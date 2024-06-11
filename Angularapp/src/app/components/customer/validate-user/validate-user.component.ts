import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  HostListener,
} from '@angular/core';
import { CustomerApiService } from '../../../services/customer-api.service';
import { CustomerCommonfunctionsService } from '../../../services/customer-commonfunctions.service';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { LoginApiService } from 'src/app/services/auth/login-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import { AppConfig } from 'src/app/services/config.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DecimalPipe } from '@angular/common';
// import { Session } from 'inspector';

@Component({
  selector: 'app-validate-user',
  templateUrl: './validate-user.component.html',
  styleUrls: ['./validate-user.component.scss'],
})
export class ValidateUserComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  target: HTMLElement;

  // @Input() pageMode: any;
  // @Input() userID: string;

  // AnujaD || DocUpload || Start
  dropDownList = [] as any;
  docUploadDD = [];
  fileUploaded: number[] = [0];
  fileChosen: number[] = [0];
  eventList: any;
  eventCodeList = [] as any;
  uploadFileData: any[] = [];
  DOCresponse: any[] = [];
  bytedata: any[] = [];
  GetDocDeatils = [];
  ShowFD = false; //Added by Ruchira
  // AnujaD || DocUpload || End
  isProd = environment.production;
  pageName = 'Validate User';
  EmailID = '';
  @ViewChild('card3') elem: ElementRef;

  isChangePassword: boolean;

  pageMode: number;
  userID = '';
  FeedBackID: any;
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  User_ID = '';
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  Form_ID = '';
  PortfolioID = '';
  Account_Type = '';

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  dd_lastKYCDoneon = [];
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  dd_NextKYCDueon = [];
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  dd_DocumentType = [];
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  dd_CustomerType = [];
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  dd_CapitalCurrency = [];
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  dd_LimitCurrency = [];

  ActualQuestionaries = [];
  quationsList = [
    {
      quation: '',
      Question_NO: '',
      optionsList: [],
      answer: '',
      riskRating: [],
      FeedBack_ID: '',
      User_ID: '',
      Form_ID: '',
      Temp_Name: '',
      Date_OF_Submission: '',
      DataType: '',
      Section: '',
    },
  ];
  FinIQRequestHeader = {
    EntityCode: 'PB',
    EntityID: '4',
    LoginID: 'Akshayv',
    MachineIP: '192.168.20.135',
    RequestAt: '15-Jul-2020 04:22:54 PM',
    SourceSystem: 'FinIQ Test Excel',
    ExternalRequestID: '906d3433-a5e9-496d-9f8f-196ee5b7fba8',
    CustomerID: sessionStorage.getItem('CustomerID'),
    Formname: AppConfig.settings.CSP_UpdateCIRPFormName,
    OldNewFlag: AppConfig.settings.CSP_FormOldNewFlag,
  };
  FinalQuestionAnswered = [
    {
      FeedBack_ID: '',
      User_ID: '',
      Form_ID: '',
      Temp_Name: '',
      Question_NO: '',
      Question: '',
      Answer: '',
      Points: '',
      DataType: '',
      Date_OF_Submission: '',
    },
  ];
  FinalQuestionAnsweredNew = [
    {
      Key: '',
      Value: '',
    },
  ];

  today = new Date();
  dateFormatted =
    this.today.getMonth() +
    1 +
    '/' +
    this.today.getDate() +
    '/' +
    this.today.getFullYear();
  answerList = {};
  // formName = 'Capital Protection';
  formName = '';

  SelectedAnswer: any;
  viewQuation: number;
  showLastbtn: boolean;
  isaddressSameasPostal: boolean;
  resultKYC: boolean;
  CustomerID: any;
  Accountpagemessage: any;
  BasicInfoNewKeys = [];
  BasicInfo = {
    CustomerType: {
      value: 'Individual Customer',
      visibility: true,
    },
    // FinIQRefNo: {
    //   value: '',
    //   visibility: true
    // },
    CustomerName: {
      value: '',
      visibility: true,
    },
    Contact_Number: {
      value: '',
      visibility: true,
    },
    IdentificationType: {
      value: 'Passport',
      visibility: true,
    },
    IdentificationNo: {
      value: '',
      visibility: true,
    },
    DOB: {
      value: '',
      visibility: true,
    },
    Nationality: {
      value: 'AUSTRALIA',
      visibility: true,
    },
    Address_Details: {
      value: '',
      visibility: true,
    },
    Postal_Details: {
      value: '',
      visibility: true,
    },
    Nature_of_Business: {
      value: 'Computer/Information Technology',
      visibility: true,
    },
  };
  AccountInfo = {
    BSB: {
      value: '',
      visibility: true,
    },
    Bank_Name: {
      value: '',
      visibility: true,
    },
    Account_Number: {
      value: '',
      visibility: true,
    },
    Account_Name: {
      value: '',
      visibility: true,
    },
    Payment_Frequency: {
      value: 'Ontime',
      visibility: true,
    },
    Deposit_Amount: {
      value: '',
      visibility: true,
    },
    Currency: {
      value: 'USD',
      visibility: true,
    },
  };
  BasicInfoNew = {
    Name: {
      value: '',
      visibility: true,
    },
    BlockHouseNo: {
      value: '',
      visibility: true,
    },
    StreetName: {
      value: '',
      visibility: true,
    },
    City: {
      value: '',
      visibility: true,
    },
    State: {
      value: '',
      visibility: true,
    },
    Country: {
      value: 'AUSTRALIA',
      visibility: true,
    },
    PostalCode: {
      value: '',
      visibility: true,
    },
    HomePhoneNumber: {
      value: '',
      visibility: true,
    },
    OfficePhoneNumber: {
      value: '',
      visibility: true,
    },
    FaxNumber: {
      value: '',
      visibility: true,
    },
    Email: {
      value: '',
      visibility: true,
    },
    CIF: {
      value: '',
      visibility: true,
    },
    CustomerIDType: {
      value: 'IC',
      visibility: true,
    },
    CustomerIDNumber: {
      value: '',
      visibility: true,
    },
    AlternateDocID: {
      value: '',
      visibility: true,
    },
    DateOfBirth: {
      value: '',
      visibility: true,
    },
    CountryResidence: {
      value: 'AUSTRALIA',
      visibility: true,
    },
    Nationality: {
      value: 'AUSTRALIA',
      visibility: true,
    },
    CustomerType: {
      value: 'Individual Customer',
      visibility: true,
    },
    CustomerSegment: {
      value: 'Corporate',
      visibility: true,
    },
    Category: {
      value: 'VIP',
      visibility: true,
    },
    ProfessionalInvestor: {
      value: 'Yes',
      visibility: true,
    },
    LastKYCDoneOn: {
      value: '',
      visibility: true,
    },
    PEPFlag: {
      value: 'Yes',
      visibility: true,
    },
  };
  SubmitQuestionriesAnswers = {
    FeedBack_ID: '',
    User_ID: '',
    Form_ID: '',
    Temp_Name: '',
    Question_NO: '',
    Question: '',
    Answer: [],
    Points: 'undefined',
    DataType: '',
    Date_OF_Submission: '',
  };
  Summary = [];
  LoginUserDetails = [];
  SummaryHeaderLabels = [
    'Name',
    'Block/House No',
    'Street Name',
    'City',
    'State',
    'Country',
    'Postal Code',
    'Home Phone Number',
    'Office Phone Number',
    'Fax No',
    'Email',
    'CIF',
    'Customer ID Type',
    'Customer ID No',
    'Alternate Doc ID',
    'Date of Birth',
    'Country Residence',
    'Nationality',
    'Customer Type',
    'Customer Segement',
    'Category',
    'Professional Investor',
    'Last KYC Done on',
    'PEP Flag',
  ];

  KYCStatus: string;
  SelectedTab: any;
  accountInfoViewMode = false;
  RiskRatingGenerated = false;

  // dropdownTypes = ['Nature of business', 'Country Long Name', 'Identification_Type', 'Legal Entity Type'];
  dropdownTypes = [
    'Customer_type',
    'Country Long Name',
    'Identification_Type',
    'Legal Entity Type',
  ];
  paymentFrequency = ['Ontime', 'Monthly', 'Quarterly', 'Annual'];
  CurrencyList = ['AUD', 'EUR', 'GBP', 'JPY', 'IDR', 'USD'];
  // dd_ALternateDocID = ['PP', 'IC', 'RC', '01', '04'];
  customerTypes = ['PP', 'IC', 'RC', '01', '04'];
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  dd_customerSegment = [
    'Branches',
    'Business Bank',
    'Commercial',
    'Corporate',
    'eFX Customers',
    'Gold',
    'GWB',
    'Internal Department',
    'PB',
    'Mobile App',
    'PFS',
    'Priority',
    'Priority Islamic',
    'Retail',
    'Retail Islamic',
    'Treasury',
    'Wealth Management',
  ];
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  dd_Category = ['VIP', 'VVIP', 'Normal', 'Unemployed'];
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  dd_ProfessionalInvestor = ['Yes', 'No'];
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  dd_PEPFlag = ['Y', 'N'];
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  dd_InvestmentObjective = []; // ['Generating Income', 'Preserving Wealth', 'Market Speculation', 'Retirement Funding', 'Moderate Growth', 'Growth of Capital'];
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  dd_PortfolioType = [
    'Cash Financing',
    'LTV Financing',
    'Share Margin Financing',
  ];
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  dd_AutoPledge = ['Yes', 'No'];
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  dd_RiskProfile = ['Balanced', 'LOW'];
  MandatoryFields = ['CIF', 'CountryResidence', 'PEPFlag'];

  NatureOfBusiness = [
    'Architecture/Engineering',
    'Arts/Design',
    'Business, Non-Finance',
    'Community/Social Service',
    'Computer/Information Technology',
    'Construction/Extraction',
    'Education/Training/Library',
    'Farming, Fishing, Forestry',
    'Food Preparation & Servicing',
    'Healthcare',
    'Installation, Maintenance and Repair',
    'Legal',
    'Life, Physical and Social Science',
    'Media and Communications',
    'Military, Law Enforcement, Government',
    'Other',
    'Personal Care/Service',
    'Production',
  ];

  countryNames = [];
  identificationTypes = [];
  legalEntties = [];
  Message = '';
  entityId: number;
  entityName: string;
  entityUser: string;
  bankName: string;
  totalRiskRating: any;

  // buttonsVisibility: boolean;
  ReadOnlyMode: boolean;
  showTimeLine = false;

  entities = {};
  isAccountCreated: boolean;
  customerType = [
    '',
    'Balanced',
    'Moderate',
    'Dynamic',
    'Aggressive',
    'Highly Aggressive',
  ];
  totalaccounts = [];
  // chitra start on 23-Jul-2020
  totalPortfolio = [];
  index = 0;
  // chitra end on 23-Jul-2020
  ErrorMessage = '';
  indexConst = '';
  AllTradablePairsDetails = [];

  CustomerInfoDetails = [];
  Nationality: string;
  NotteMasterID = '';
  LoaderFlag = false;
  KYCRiskRatingReponse: any;
  ViewKYC = false;
  viewKYCQuestionsAnswers = [];
  fascility = [];

  IsLoading = true;
  selectedCustomer: any;
  // Charts vartiables

  chartColors = [
    // new
    // '#F1AC45',
    // '#E05140',
    // '#86D749',
    // '#3ACDE1',

    // // cash
    // '#F1AB48',
    // // Fixed income
    // '#81DB46',
    // // Mutual funds
    // '#3DC9E4',
    // // Equities
    // '#DE5340'
    '#dfc2e4', '#fbe19f', '#9ad3f0', '#bce4b1', '#ed7d31', '#a5a5a5', '#619010', '#388a90', '#6143b7', '#a3085f', '#85593d', '#878787', '#b19c0c'


    // dull
    // '#F09639',
    // '#F0654B',
    // '#09B39C',
    // '#5173B8',

  ];
  chartColorsLegends = [
    // new
    // '#F1AC45',
    // '#E05140',
    // '#86D749',
    // '#3ACDE1',

    //     Cash #DFC2E4
    // Fixed income #9AD3F0
    // Mutual funds #BCE4B1
    // Equities #FBE19F

    // cash
    { label: 'Cash', color: '#DFC2E4', },
    { label: 'Fixed Income', color: '#9AD3F0', },
    { label: 'Mutual Funds', color: '#BCE4B1', },
    { label: 'Equities', color: '#FBE19F', }

    // dull
    // '#F09639',
    // '#F0654B',
    // '#09B39C',
    // '#5173B8',

  ];

  options = {
    pieHole: 0,
    // pieSliceText: 'none',
    // legend: { position: 'right' },
    legend: { position: 'labeled' },
    colors: this.chartColors,
    // changed
    width: '350',
    height: '225',
    // changed
    chartArea: {
      left: '0',
      top: '0',
      right: '0',
      width: '100%',
      height: '100%',
      Margin: '0',
    },
    is3D: true,

    // colors: ['#d4ab8b', '#ccb6a6', '#c8936a', '#ba7845'],
  };

  // chitra started new chart
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  type_port_details = 'PieChart';
  // eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  options_port_details = {
    pieHole: 0,
    // pieSliceText: 'none',
    legend: {
      position: 'right', labeledValueText: 'both',
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    colors: this.chartColors,
    // changed
    width: '420',
    height: '225',
    // changed
    chartArea: {
      left: '20%',
      top: '20%',
      width: '100%',
      height: '100%',
      Margin: '0',
    },
    is3D: true,
    // pieSliceText: 'none',
    pieSliceTextStyle: {
      color: 'black',
    },

    // colors: ['#d4ab8b', '#ccb6a6', '#c8936a', '#ba7845'],
  };
  // chitra ended new chart
  MGData = [];
  type = 'PieChart';
  AllChartsData = [];
  IdentificationNumber: any;
  PortType = '';
  unique = [];
  portfolioNames: string[];
  // callFlag = true;
  facDesc = '';
  loggedAt: any;
  editProfileflag = false;

  // Subscribe paramerters
  SetUserModeSubscriber: Subscription;
  GetCustomerAccountDetailsSubscriber: Subscription;
  GetCustomerMultiAccountDetailsSubscriber: Subscription;
  SaveCustomerDetailsSubscriber: Subscription;
  GetKYCFormSubscriber: Subscription;
  SubmitKYCFormSubscriber: Subscription;
  GetBankNameSubscriber: Subscription;
  AddCustomerAccountSubscriber: Subscription;
  GetAllTradableCurrenciesSubscriber: Subscription;
  GetFeedBackIDSubscriber: Subscription;
  dropdownValuesSubscription: Subscription;
  buttonActionSubscription: Subscription;

  addPortVisibility: boolean;
  tab1Error: string;
  data: any[];
  portfolioData: any[];
  callFlag: boolean;
  LoadMultipleAccounts = true;
  loggedInUsername: string;
  RiskRating: any;
  RiskProfile: any;
  AccountMessage = '';
  DocumentMessage = '';
  msg: string;
  FCode: any;
  star: string;
  SaveMode: string;

  AvgCPRADetails = '';
  loadflag: boolean;
  isError: boolean;
  username1 = '';
  password1 = '';
  emailid1 = '';
  confirmPassword1 = '';
  ErrorMsg: string;
  SuccessMsg: string;
  isSuccess: boolean;
  isPasswordText: boolean;
  isConfirmPasswordText: boolean;
  isDuplicateUser: boolean;
  barLabel = 'Password Strength:';
  userType: string;
  CPRAGraph = [];
  documents = [];
  dealNo: string;
  tokenId: string;
  login: string;
  buttonAction = '';
  CustomerName: string;
  // charts variables End
  customersOfRMArray: any = [];
  showSuggestions: boolean;
  selectedCustomerIndex = 0;
  ViewCPRADataSubscription: Subscription;
  ClientOnBoardingUsername: any = '';
  LoadButtonaction = false;
  clientFormName: number;
  SavePortfolioResult: any;
  FinancialPlanningOverlayflag: boolean = false;
  FixedDepositOverlayflag: boolean = false;
  CashDepositOverlayflag: boolean = false;
  SelectedPortfolioForFinancialPlanning: string = '';
  SelectedIndexPortfolioForFinancialPlanning: number;
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.isChangePassword = false;
      this.FinancialPlanningOverlayflag = false;
      this.FixedDepositOverlayflag = false;
      this.CashDepositOverlayflag = false;
    }
  }
  constructor(
    private afs: CustomerApiService,
    public cfs: CustomerCommonfunctionsService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private ds: WorkflowApiService,
    public router: Router,
    public loginApi: LoginApiService,
    public elements: ElementRef,
    public comm: CommonApiService,
    public authorApi: AuthService,
    public decimalPipe: DecimalPipe
  ) {
    this.isAccountCreated = false;
    this.isChangePassword = false;
    this.loadflag = false;
    this.isError = false;
    this.username1 = '';
    this.password1 = '';
    this.confirmPassword1 = '';
    this.emailid1 = '';
    this.ErrorMsg = '';
    this.SuccessMsg = '';
    this.isSuccess = false;
    this.isPasswordText = false;
    this.isConfirmPasswordText = false;
    this.formName = AppConfig.settings.CSP_UpdateCIRPFormName;
    this.clientFormName = AppConfig.settings.CSP_UpdateCIRPPageHeaderName;

  }
  @HostListener('window:resize')
  onWindowResize() {
    // this.options_port_details.width = ((window.innerWidth - (0.799 * window.innerWidth)) + 20).toString();
    // this.options_port_details.height = (window.innerHeight - (0.7 * window.innerHeight)).toString();
    this.options_port_details.width = '320';
    this.options_port_details.height = '125';
    // console.log('Width1: ' + window.innerWidth, 'graph: ' + this.options_port_details.width);
    // console.log('Height1: ' + window.innerHeight, 'graph: ' + this.options_port_details.height);
    // this.pnlbestoptions.width = ((window.innerWidth - (0.799 * window.innerWidth)) + 20).toString();
    // this.pnlbestoptions.height = (window.innerHeight - (0.7 * window.innerHeight)).toString();

    if (window.innerWidth <= 1477) {
      this.options_port_details.width = '420';
      this.options_port_details.height = '225';
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
    try {
      this.SuccessMsg = '';
      this.username1 = '';
      this.password1 = '';
      this.emailid1 = '';
      this.confirmPassword1 = '';
      this.portfolioNames = [];
      this.totalPortfolio = [];

      // Extract EmailID From SessionStorage
      this.EmailID = sessionStorage.getItem('EmailID');
      this.loggedInUsername = sessionStorage.getItem('Username');
      this.userID = sessionStorage.getItem('Username');
      this.entityUser = sessionStorage.getItem('Username');
      this.userType = sessionStorage.getItem('UserType');
      const loginTime = sessionStorage.getItem('LoggedAt');
      this.dealNo = sessionStorage.getItem('NoteMasterID'); // added by suvarna  dealNo NMI And tokenId to be confirm
      this.tokenId = sessionStorage.getItem('TokenID'); // added by suvarna  dealNo NMI And tokenId to be confirm

      // this.RiskRating = sessionStorage.getItem('RiskRating');
      if (
        sessionStorage.getItem('RiskProfile') === null ||
        sessionStorage.getItem('RiskProfile') === ''
      ) {
        this.RiskProfile = '-';
      } else {
        this.RiskProfile = sessionStorage.getItem('RiskProfile');
      }
      // this.FinalAnswerSubmit();
      // if (sessionStorage.getItem('RiskRating') === null || sessionStorage.getItem('RiskRating') === '') {
      //   this.RiskRating = sessionStorage.getItem('CRR');
      // } else {
      //   this.RiskRating = sessionStorage.getItem('RiskRating');
      // }
      // this.afs.downloadFileObservable.subscribe(res => {
      //   if (res.length !== 0) {
      //     console.log(res);
      //   }
      // })

      this.comm.dealnoObserver.subscribe(res => {
        if (res.length !== 0) {
          if (this.userType.toLowerCase() === 'rm') {
            this.dealNo = res;

          }
        }
      });

      this.comm.tokenidObserver.subscribe(res => {
        if (res.length !== 0) {
          if (this.userType.toLowerCase() === 'rm') {
            this.tokenId = res;
          }
        }
      });

      this.comm.loginObserver.subscribe(res => {
        if (res.length !== 0) {
          if (this.userType.toLowerCase() === 'rm') {
            this.login = res;
          }
        }
      });

      this.comm.btnActionObserver.subscribe((res: any) => {
        if (res !== '') {
          this.LoadButtonaction = true;
          this.buttonAction = res;
          console.log('button action from the page', res);
          // if (this.buttonAction === 'Verify' || this.buttonAction === 'Reject') {
          //   this.buttonAction = 'Edit';
          //   this.editProfileflag = false;
          // }
        } else {
          this.buttonAction = '';
        }
      }).unsubscribe();

      // this.afs.fngetCustAccountDetailsforMultiAcc(this.entityUser);
      // this.GetCustomerMultiAccountDetailsSubscriber = this.afs.getCustAccountDetailsforMultiAcc.subscribe(
      //   (res: any) => {
      //     console.log(res, this.LoadMultipleAccounts);
      //     if (res.length !== 0 && this.LoadMultipleAccounts) {
      //       this.CustomerInfoDetails = res;
      //       this.totalaccounts = [];
      //       if (res.status === false) {
      //         this.IsLoading = false;
      //         this.Accountpagemessage = 'No record found.';
      //       } else if (res.length !== 0) {
      //         if (this.callFlag === true) {
      //           this.callFlag = false;
      //           // this.CustomerID = res[0].CustomerID;
      //           const array = [];
      //           for (const acc of res) {
      //             array.push(acc.CustomerID);
      //           }

      //           this.RiskRating = res[res.length - 1].misc9;
      //           // added chitra

      //           this.CustomerID = res[res.length - 1].CustomerID;

      //           this.unique = array.filter(this.cfs.onlyUnique);

      //           if (this.CustomerID !== undefined) {
      //             this.afs.GetCustInvestmentObj(sessionStorage.getItem('CustomerID'));

      //             this.afs.LoadPortfolio(this.CustomerID, 0);
      //             // this.ds.getCPRAData(sessionStorage.getItem('RiskRating'), sessionStorage.getItem('Username')).subscr
      //           }
      //         }
      //         // this.LoadMultipleAccounts = false;

      //         res.forEach((element) => {
      //           this.LoadAccounts(element);
      //         });
      //         const array = [];
      //         for (const acc of res) {
      //           array.push(acc.portfolio);
      //         }
      //         this.unique = array.filter(this.cfs.onlyUnique);
      //       }
      //     } else {
      //       this.IsLoading = false;
      //       this.Accountpagemessage = 'No record found.';
      //     }
      //   }
      // );
      this.loggedAt = new Date(
        parseInt(loginTime.substring(6, loginTime.length - 7), 10)
      );
      this.route.params.subscribe((params) => {
        this.pageMode = Number(params.pageMode); // 1 = WriteMode, 2 = BasicInfo, 3 = AccountInfo
        console.log(this.pageMode);
        if (this.pageMode === 1) {
          // this.EditProfile();
          // if (this.pageMode === 2)
          this.clearInputs();
        }
        this.afs.setValidateUserPageMode(this.pageMode);
        if (this.ClientOnBoardingUsername === '') {
          this.userID = sessionStorage.getItem('Username');
          // this.userID = params.userID;
          this.entityUser = sessionStorage.getItem('Username');
        } else {
          this.userID = this.ClientOnBoardingUsername;
          this.entityUser = this.ClientOnBoardingUsername;
        }

      });
      // By Default
      this.LoadMultipleAccounts = true;

      this.NotteMasterID = '';
      this.cfs.clearredirecttoCashDepositObserver();
      if (this.ClientOnBoardingUsername === '') {
        this.userID = sessionStorage.getItem('Username');
        this.entityUser = sessionStorage.getItem('Username');
      } else {
        this.userID = this.ClientOnBoardingUsername;
        this.entityUser = this.ClientOnBoardingUsername;
      }

      this.ReadOnlyMode = false;
      this.resultKYC = false;
      this.totalRiskRating = 0;
      this.GetFeedBackIDSubscriber = this.afs
        .getMaxFeedBackID()
        .subscribe((res: any) => {
          if (res) {
            this.FeedBackID = Number(res) + 1;
          }
        });
      this.callFlag = true;
      // this.afs.getCustProfiledetails(this.loggedInUsername);
      this.afs.GetCustProfiledetailsObserver.subscribe((cust) => {
        // console.log('cust', cust);
        try {
          if (![0, undefined].includes(cust.length)) {
            this.totalPortfolio = [];

            this.CustomerID = cust[0].CustomerID;
            this.FCode = cust[0].misc10;
            console.log(
              'CustomerID in GetCustProfiledetailsObserver',
              this.CustomerID
            );
            console.log('TotalPortfolio in above', this.totalPortfolio);
          }
        } catch (Exception) {
          console.log(Exception);
          // this.isAccCreated = false;
          // this.isKYCdone = false;
        }
      });


      this.afs.InvestObjSubObserver.subscribe((res: any) => {
        this.dd_InvestmentObjective = [];
        if (res.length > 0) {
          this.RiskProfile = res[0].benchmark_name;
          // console.log(res);
          res.forEach((element) => {
            this.dd_InvestmentObjective.push(element.benchmark_misc1);
          });
        }
      });
      // chitra start on 23-Jul-2020
      this.afs.LoadPortfolioObserver.subscribe((res) => {
        // console.log('Get_Portfolio_Details_RESTResult', res);
        if (res.Get_Portfolio_Details_RESTResult !== undefined) {
          // console.log('CustomerID in LoadPortfolioObserver', this.CustomerID);
          // console.log('TotalPortfolio in above', this.totalPortfolio);
          this.totalPortfolio = [];
          res.Get_Portfolio_Details_RESTResult.forEach((element) => {
            this.facDesc = element.FacDesc;
            let capitalPosted =
              element.Capital_Posted === '' ? '0' : element.Capital_Posted;
            if (capitalPosted !== null) {
              if (!capitalPosted.search(',')) {
                capitalPosted = this.cfs.FormatNumberr(capitalPosted);
              } else {
                capitalPosted = this.cfs.FormatNumberr(
                  parseFloat(capitalPosted).toFixed(2)
                );
              }
            }
            let limitPosted =
              element.FacLimit === '' ? '0' : element.FacLimit.toString();
            if (limitPosted !== null) {
              if (!limitPosted.search(',')) {
                limitPosted = this.cfs.FormatNumberr(limitPosted);
              } else {
                limitPosted = this.cfs.FormatNumberr(
                  parseFloat(limitPosted).toFixed(2)
                );
              }
            }
            const tempNotional = this.cfs.FormatNumberr(element.FacLimit_HKD);
            // res.Get_Portfolio_Details_RESTResult[0].FacLimit_HKD = tempNotional;
            // console.log('this facType', element);

            let fascCode = element.FacDesc.split('-')[2];
            if (element.FacDesc.split('-')[2] === 'SMF') {
              fascCode = 'Share Margin Financing';
            } else if (element.FacDesc.split('-')[2] === 'CUS') {
              fascCode = 'Cash Financing';
            } else {
              fascCode = 'LTV Financing';
            }

            let autoPledge = '';
            if (element.AutoPledgeFlag === 'NO') {
              autoPledge = 'No';
            } else {
              autoPledge = 'Yes';
            }
            // console.log('element', element, this.RiskProfile);

            if (this.totalPortfolio.length < res.Get_Portfolio_Details_RESTResult.length) {
              this.portfolioNames.push(element.PortfolioName);

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
                  value: this.RiskProfile.toUpperCase(),
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
                  value: '',
                  visibility: false,
                },
                TargetGoal: {
                  value: '',
                  visibility: false,
                }
              });
              const parameters = {
                RiskProfile: this.RiskProfile.toUpperCase(),
                InvestmentObj: element.Char8,
                PortfolioName: element.PortfolioName,
                // RiskProfile: "Low",
                // InvestmentObj: "Growth of Capital"
              };
              this.portfolioData = [];
              this.afs.getPortfolioAllocation(parameters);
            }
            this.totalaccounts.forEach((element1) => {
              if (element1.Portfolio.value === element.FacDesc) {
                // element.PortfolioName.value = element.PortfolioName;
                element1.PortfolioName.value = element.FacDesc;
              }
            });
          });
          if (window.innerWidth <= 1477) {
            this.options_port_details.width = '270';
            this.options_port_details.height = '150';
          }

          // console.log('CustomerID in the END of LoadPortfolioObserver', this.CustomerID);
          // console.log('TotalPortfolio in above', this.totalPortfolio);
        }
      });

      this.data = [];

      this.afs.AllocPortfolioObserver.subscribe((res) => {
        this.fascility = [];
        this.totalPortfolio.forEach((element) => {
          this.fascility.push(element.fascDesc.value);
        });
        if (res.length) {
          this.totalPortfolio.map((pf) => {
            if (pf.PortfolioName.value === res[1]) {
              // console.log('Portfolio name', pf.PortfolioName.value, res[1]);
              const data = res[0].map((d) => {
                const obj = [d.Scheme_Name, parseFloat(d.BA_Allocation)];
                return obj;
              });
              pf.ChartData = data;
            }
          });
          // console.log('Portfolio Chart Data res', res, 'total pf after data', this.totalPortfolio);

          // if (!this.portfolioNames.includes(res[1])) {
          //   this.portfolioNames.push(res[1]);

          //   this.portfolioData = [];

          // eslint-disable-next-line
          //   for (let i = 0; i < res[0].length; i++) {
          //     if (res[0][i].length === 0) {
          //       // this.portfolioData.push(["No Data", 0]);
          //       // this.data.push(this.portfolioData);

          //     }
          //     else {
          //       this.portfolioData.push([res[0][i].Scheme_Name, parseFloat(res[0][i].BA_Allocation)]);

          //     }
          //   }
          //   this.data.push(this.portfolioData);

          //   console.log('Portfolio Chart', this.data, this.totalPortfolio);
          // }
          // this.portfolioData = [["Cash", 25],["Equities", 15], ["Fixed Income", 45], ["MF", 15]];

          // for(let r in res){
          // this.portfolioData.push([r.Scheme_Name])
          // }
        }
      });
      //  chitra end on 23-Jul-2020

      this.afs.GetAllTradableCurrency();
      this.GetAllTradableCurrenciesSubscriber = this.afs.allTradablePairObserver.subscribe(
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
          }
        }
      );

      this.GetBankNameSubscriber = this.afs.BSBCDetails.subscribe(
        (res: any) => {
          if (this.accountInfoViewMode) {
            if (res) {
              this.totalaccounts[this.indexConst].ErrorMessage = '';
              if (res.O_Result === 'Fail') {
                this.totalaccounts[this.indexConst].ErrorMessage =
                  res.O_Result + ':' + res.O_Message;
                this.Accountpagemessage = 'Failed: Bank name is unavailable.';
                const x = document.getElementById('snackbar');
                x.className = 'show';
                setTimeout(() =>{
                  x.className = x.className.replace('show', '');
                }, 3000);
                this.Accountpagemessage = '';
              } else {
                if (res.Bank_Name !== null && res.Bank_Name !== '') {
                  this.totalaccounts[this.indexConst].bankName.value =
                    res.Bank_Name;
                } else {
                  this.Accountpagemessage = 'Failed: Bank name is unavailable.';
                  const x = document.getElementById('snackbar');
                  x.className = 'show';
                  setTimeout(() => {
                    x.className = x.className.replace('show', '');
                  }, 3000);
                  this.Accountpagemessage = '';
                }
              }
            }
            this.accountInfoViewMode = false;
          } else {
            if (res !== '' || res !== {}) {
              this.Accountpagemessage = '';
              if (res.O_Result === 'Fail') {
                this.Accountpagemessage = res.O_Result + ':' + res.O_Message;
              } else {
                if (res.Bank_Name !== null && res.Bank_Name !== '') {
                  this.AccountInfo.Bank_Name.value = res.Bank_Name;
                } else {
                  this.Accountpagemessage = 'Failed: Bank name is unavailable.';
                }
              }
            }
          }
        }
      );
      // Load Drop downs for mode 1 and 2
      this.dropdownValuesSubscription = this.afs.dropdownValues.subscribe(
        (d) => {
          if (d) {
            switch (d.filter) {
              case 'Customer_type':
                // that.customerTypes = d.data;
                this.dd_CustomerType = d.data;
                break;
              case 'Country Long Name':
                this.countryNames = d.data;
                break;
              case 'Identification_Type':
                this.identificationTypes = d.data;
                this.dd_DocumentType = d.data;
                break;
              case 'Legal Entity Type':
                this.legalEntties = d.data;
                break;
              // case 'Investment_Objective':
              //   this.dd_InvestmentObjective = d.data;
              //   break;
            }
          }
        }
      );
      this.dropdownTypes.forEach((type) => {
        this.afs.loadDropdownValues(type, 'CommonData');
      });

      this.SetUserModeSubscriber = this.afs.validateUserModeFlagObserver.subscribe(
        (res) => {
          this.pageMode = Number(res);
          this.afs.ClearObserversonValidateUserPage();
          if (!this.LoadButtonaction) {
            this.buttonAction = 'Edit';
            // this.editProfileflag = false;
          } else {
            this.LoadButtonaction = false;
          }
          // Do not remove
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;

          switch (this.pageMode) {
            case 1: // Write Mode
              this.viewQuation = 0;
              this.SelectedAnswer = '';
              this.showLastbtn = false;
              this.IsLoading = false;
              this.SelectedTab = 'basicInfo';
              this.isaddressSameasPostal = false;
              this.bankName = '';
              this.ReadOnlyMode = true;
              const that = this;
              that.afs.clearObservers();
              this.BasicInfoFormFillingStatus();

              // // Temprory assign KYC Status to Pending
              // this.KYCStatus = 'Pending';
              // this.isAccountCreated = false;

              break;
            case 2: // view BasicInfo Mode
              this.openTabs('basicInfo');
              this.IsLoading = true;
              this.Summary = [];
              this.editProfileflag = true;
              // this.afs.fngetCustAccountDetails(this.entityUser);
              this.BasicInfo.DOB.value = this.cfs.checkAndFormatDate(
                this.BasicInfo.DOB.value.split(' ')[0]
              );
              this.ReadOnlyMode = false;
              try {
                this.ClientOnBoardingUsername = sessionStorage.getItem('ClientName');
                this.entityUser = sessionStorage.getItem('ClientName');
                this.login = this.ClientOnBoardingUsername;
                sessionStorage.setItem('ClientName', '');
                if (this.ClientOnBoardingUsername !== '') {
                  this.afs.GetCustomerDetails_ClientOnBoarding(this.ClientOnBoardingUsername);
                  this.afs.CustomerDetails_ClientBoardingObserver.subscribe(
                    // res=>{
                    // if(res.length !== 0){

                    (res) => {
                      if (res !== {}) {
                        try {
                          this.CustomerID = res.CustomerID;
                          this.PortfolioID = res.portfolio;
                          this.Account_Type = res.accounttype;

                          this.AccountInfo.BSB.value = res.BSB;
                          // this.BasicInfoNew.BankName.value = res.misc6;
                          // this.BasicInfoNew.BankName.value = res.Bank_Name;
                          this.AccountInfo.Account_Name.value = res.Customer_Name;
                          this.AccountInfo.Account_Number.value = res.Account_No;
                          this.AccountInfo.Currency = res.Accountcurrency;
                          this.AccountInfo.Payment_Frequency = res.PaymentFrequency;
                          this.AccountInfo.Deposit_Amount = this.cfs.FormatNumberr(
                            res.DepositAmount
                          );

                          this.BasicInfoNew.Name.value = res.Customer_Name;
                          this.BasicInfoNew.BlockHouseNo.value = res.Block_House_No;
                          this.BasicInfoNew.StreetName.value = res.Street_Name;
                          this.BasicInfoNew.City.value = res.City;
                          this.BasicInfoNew.State.value = res.State;
                          this.BasicInfoNew.Country.value = res.Country;
                          this.BasicInfoNew.PostalCode.value = res.Postal_Code;
                          this.BasicInfoNew.HomePhoneNumber.value =
                            res.Home_Phone_No;
                          this.BasicInfoNew.OfficePhoneNumber.value =
                            res.Office_Phone_No;
                          this.BasicInfoNew.FaxNumber.value = res.Fax_No;
                          this.BasicInfoNew.Email.value = res.Email_ID;
                          this.BasicInfoNew.CIF.value = res.CIF;
                          this.BasicInfoNew.CustomerIDType.value =
                            res.Identification_type;
                          this.BasicInfoNew.CustomerIDNumber.value = res.CustomerID;
                          this.BasicInfoNew.AlternateDocID.value =
                            res.Alternate_Doc_ID;
                          this.BasicInfoNew.DateOfBirth.value = this.cfs.checkAndFormatDate(
                            res.Date_of_birth.split('T')[0]
                          );
                          this.BasicInfoNew.CountryResidence.value =
                            res.Residence_Country;
                          this.BasicInfoNew.Nationality.value = res.Nationality;
                          this.BasicInfoNew.CustomerType.value = res.CustomerType;
                          this.BasicInfoNew.CustomerSegment.value =
                            res.Customer_Segment;
                          this.BasicInfoNew.Category.value = res.Category;
                          this.BasicInfoNew.ProfessionalInvestor.value =
                            res.Professional_Investor;
                          this.BasicInfoNew.LastKYCDoneOn.value = this.cfs.checkAndFormatDate(
                            res.Last_KYC_Done_On.split('T')[0]
                          );
                          // this.BasicInfoNew.NextKYCDueOn.value = this.cfs.checkAndFormatDate(res.Next_KYC_Due_On.split('T')[0]);
                          // this.BasicInfoNew.DocumentType.value = res.Document_Type;
                          this.BasicInfoNew.PEPFlag.value = res.PEP_Flag;

                          this.isAccountCreated = false;
                          const noteMasterID = sessionStorage.getItem(
                            'NoteMasterID'
                          );
                          this.ds.ProductAttachmentList(noteMasterID);

                          console.log('CustomerID', this.CustomerID);
                          this.SubmitBasicInfo();
                          this.IsLoading = false;
                          this.msg = '';
                          // this.BasicInfoFormFillingStatus();
                        } catch (Exception) {
                          console.log('Error occured in filling customer details.');
                        }
                      } else {
                        this.IsLoading = false;
                        this.msg = 'No records found here';
                      }
                      if (res === undefined) {
                        this.CustomerID = '';
                      }
                      // }
                      // }
                    });
                }
              } catch (e) {
                console.log(this.ClientOnBoardingUsername);
              }
              if (this.ClientOnBoardingUsername === null || this.ClientOnBoardingUsername === '') {
                this.loggedInUsername = this.userID = sessionStorage.getItem('Username');
                this.entityUser = sessionStorage.getItem('Username');
                this.afs.fngetCustAccountDetails(this.entityUser);
                this.GetCustomerAccountDetailsSubscriber = this.afs.getCustAccountDetails.subscribe(
                  (res) => {
                    if (res.length !== 0) {
                      try {
                        this.CustomerID = res.CustomerID;
                        if (this.CustomerID !== undefined) {
                          sessionStorage.setItem('CustomerID', this.CustomerID);
                          sessionStorage.setItem('CPRACustomerID', this.CustomerID);
                        }

                        this.PortfolioID = res.portfolio;
                        this.Account_Type = res.accounttype;

                        this.AccountInfo.BSB.value = res.BSB;
                        // this.BasicInfoNew.BankName.value = res.misc6;
                        // this.BasicInfoNew.BankName.value = res.Bank_Name;
                        this.AccountInfo.Account_Name.value = res.Customer_Name;
                        this.AccountInfo.Account_Number.value = res.Account_No;
                        this.AccountInfo.Currency = res.Accountcurrency;
                        this.AccountInfo.Payment_Frequency = res.PaymentFrequency;
                        this.AccountInfo.Deposit_Amount = this.cfs.FormatNumberr(
                          res.DepositAmount
                        );

                        this.BasicInfoNew.Name.value = res.misc1;
                        this.BasicInfoNew.BlockHouseNo.value = res.Block_House_No;
                        this.BasicInfoNew.StreetName.value = res.Street_Name;
                        this.BasicInfoNew.City.value = res.City;
                        this.BasicInfoNew.State.value = res.State;
                        this.BasicInfoNew.Country.value = res.Country;
                        this.BasicInfoNew.PostalCode.value = res.Postal_Code;
                        this.BasicInfoNew.HomePhoneNumber.value =
                          res.Home_Phone_No;
                        this.BasicInfoNew.OfficePhoneNumber.value =
                          res.Office_Phone_No;
                        this.BasicInfoNew.FaxNumber.value = res.Fax_No;
                        this.BasicInfoNew.Email.value = res.Email_ID;
                        this.BasicInfoNew.CIF.value = res.CIF;
                        this.BasicInfoNew.CustomerIDType.value =
                          res.Identification_type;
                        this.BasicInfoNew.CustomerIDNumber.value = res.CustomerID;
                        this.BasicInfoNew.AlternateDocID.value =
                          res.Alternate_Doc_ID;
                        this.BasicInfoNew.DateOfBirth.value = this.cfs.checkAndFormatDate(
                          res.Date_of_birth.split('T')[0]
                        );
                        this.BasicInfoNew.CountryResidence.value =
                          res.Residence_Country;
                        this.BasicInfoNew.Nationality.value = res.Nationality;
                        this.BasicInfoNew.CustomerType.value = res.CustomerType;
                        this.BasicInfoNew.CustomerSegment.value =
                          res.Customer_Segment;
                        this.BasicInfoNew.Category.value = res.Category;
                        this.BasicInfoNew.ProfessionalInvestor.value =
                          res.Professional_Investor;
                        this.BasicInfoNew.LastKYCDoneOn.value = this.cfs.checkAndFormatDate(
                          res.Last_KYC_Done_On.split('T')[0]
                        );
                        // this.BasicInfoNew.NextKYCDueOn.value = this.cfs.checkAndFormatDate(res.Next_KYC_Due_On.split('T')[0]);
                        // this.BasicInfoNew.DocumentType.value = res.Document_Type;
                        this.BasicInfoNew.PEPFlag.value = res.PEP_Flag;
                        // this.BasicInfoNew.PortfolioName.value = res.Portfolio_Name;
                        // this.BasicInfoNew.InvestmentObjective.value = res.Investment_Objective;
                        // this.BasicInfoNew.PortfolioType.value = res.Portfolio_Type;
                        // this.BasicInfoNew.AutoPledge.value = res.Autopledge;
                        // this.BasicInfoNew.CapitalCurrency.value = res.Capital_Currency;
                        // this.BasicInfoNew.CapitalPosted.value = this.cfs.FormatNumberr(res.Capital_Posted);
                        // this.BasicInfoNew.LimitCurrency.value = res.Limit_Currency;
                        // this.BasicInfoNew.LimitPosted.value = this.cfs.FormatNumberr(res.Limit_Posted);
                        // this.BasicInfoNew.Currency.value = res.Accountcurrency;

                        // this.BasicInfoNew.BSB.value = res.BSB;
                        // this.BasicInfoNew.AccountName.value = res.Customer_Name;
                        // this.BasicInfoNew.AccountNumber.value = res.Account_No;
                        // this.BasicInfoNew.Currency.value = res.Accountcurrency;
                        // this.BasicInfoNew.PaymentFrequency.value = res.PaymentFrequency;
                        // this.BasicInfoNew.DepositAmount.value = this.cfs.FormatNumberr(res.DepositAmount);

                        this.isAccountCreated = false;
                        // this.LoadAccounts(res);

                        // AnujaD. || DocUpload || 7/12/2020 ||Start
                        const noteMasterID = sessionStorage.getItem(
                          'NoteMasterID'
                        );
                        this.ds.ProductAttachmentList(noteMasterID);
                        // commented by Ruchira M
                        // for (let i = 0; i < this.eventList.length; i++) {
                        //   this.afs.DB_GetDocBody(noteMasterID, this.eventList[i].Event_Code);
                        // }

                        // this.afs.GetDocumentsObservable.subscribe((res) => {

                        //   if (res) {
                        //     this.GetDocDeatils = null;
                        //     this.GetDocDeatils = res;
                        //     this.DocumentInformation();
                        //   }
                        // });
                        // AnujaD. || DocUpload || 7/12/2020 ||End

                        console.log('CustomerID', this.CustomerID);
                        this.SubmitBasicInfo();
                        this.IsLoading = false;
                        this.msg = '';
                        // this.BasicInfoFormFillingStatus();
                      } catch (Exception) {
                        console.log('Error occured in filling customer details.');
                      }
                    } else {
                      this.IsLoading = false;
                      this.msg = 'No records found here';
                    }
                    if (res === undefined) {
                      this.CustomerID = '';
                    }
                  }
                );
              }

              break;
            case 3: // View AccountInfo Mode
              this.openTabs('accountInfo');
              this.IsLoading = true;
              // this.afs.fngetCustAccountDetails(this.entityUser);
              this.ReadOnlyMode = false;
              this.LoadMultipleAccounts = true;
              this.totalaccounts = [];
              // this.afs.fngetCustAccountDetailsforMultiAcc(this.entityUser);
              this.GetCustomerMultiAccountDetailsSubscriber = this.afs.getCustAccountDetailsforMultiAcc.subscribe(
                (res: any) => {
                  if (res.message.length !== undefined && res.message.length > 0 && this.LoadMultipleAccounts) {
                    this.IsLoading = false;
                    this.totalaccounts = [];
                    // this.LoadMultipleAccounts = false;
                    this.CustomerInfoDetails = res.message;
                    try{
                      res.message.forEach((element) => {
                        this.LoadAccounts(element);
                      });
                    }catch(ex){

                    }
                    this.CustomerID = res.message[0].CustomerID;
                    const array = [];
                    for (const acc of res.message) {
                      array.push(acc.portfolio);
                    }
                    this.unique = array.filter(this.cfs.onlyUnique);
                    if (this.CustomerID !== undefined) {
                      // for (const port of this.unique) {
                      this.afs.LoadPortfolio(this.CustomerID, 0);
                      // }
                    }
                  } else {
                    this.IsLoading = false;
                    console.log('No Account found');
                  }
                }
              );
              this.afs.fngetCustAccountDetails(this.entityUser);
              this.GetCustomerAccountDetailsSubscriber = this.afs.getCustAccountDetails.subscribe(
                (res) => {
                  if (res) {
                    this.CustomerID = res.CustomerID;
                    this.PortfolioID = res.portfolio;
                    this.Account_Type = res.accounttype;
                    this.AccountInfo.Account_Name.value = res.Customer_Name;
                    this.AccountInfo.Account_Number.value = res.Account_No;
                    this.AccountInfo.BSB.value = res.BSB;
                    // this.BasicInfoNew.BankName.value = res.misc6;
                    // this.BasicInfoNew.BankName.value = res.Bank_Name;
                    this.AccountInfo.Account_Number.value = res.accountnumber;
                    this.AccountInfo.Currency = res.Accountcurrency;

                    // this.BasicInfoNew.Address_Details.value = res.Address_Details;
                    this.BasicInfoNew.Name.value = res.Customer_Name;
                    this.BasicInfoNew.BlockHouseNo.value = res.Block_House_No;
                    this.BasicInfoNew.StreetName.value = res.Street_Name;
                    this.BasicInfoNew.City.value = res.City;
                    this.BasicInfoNew.State.value = res.State;
                    this.BasicInfoNew.Country.value = res.Country;
                    this.BasicInfoNew.PostalCode.value = res.Postal_Code;
                    this.BasicInfoNew.HomePhoneNumber.value = res.Home_Phone_No;
                    this.BasicInfoNew.OfficePhoneNumber.value =
                      res.Office_Phone_No;
                    this.BasicInfoNew.FaxNumber.value = res.Fax_No;
                    this.BasicInfoNew.Email.value = res.Email_ID;
                    this.BasicInfoNew.CIF.value = res.CIF;
                    this.BasicInfoNew.CustomerIDType.value =
                      res.Identification_type;
                    this.BasicInfoNew.CustomerIDNumber.value = res.CustomerID;
                    this.BasicInfoNew.AlternateDocID.value =
                      res.Alternate_Doc_ID;
                    this.BasicInfoNew.DateOfBirth.value = this.cfs.checkAndFormatDate(
                      res.Date_of_birth.split('T')[0]
                    );
                    this.BasicInfoNew.CountryResidence.value =
                      res.Residence_Country;
                    this.BasicInfoNew.Nationality.value = res.Nationality;
                    // this.BasicInfoNew.BankName.value = res.misc6;
                    // this.BasicInfoNew.BankName.value = res.Bank_Name;
                    this.BasicInfoNew.CustomerType.value = res.CustomerType;
                    this.BasicInfoNew.CustomerSegment.value =
                      res.Customer_Segment;
                    this.BasicInfoNew.Category.value = res.Category;
                    this.BasicInfoNew.ProfessionalInvestor.value =
                      res.Professional_Investor;
                    this.BasicInfoNew.LastKYCDoneOn.value = this.cfs.checkAndFormatDate(
                      res.Last_KYC_Done_On.split('T')[0]
                    );
                    // this.BasicInfoNew.NextKYCDueOn.value = this.cfs.checkAndFormatDate(res.Next_KYC_Due_On.split('T')[0]);
                    // this.BasicInfoNew.DocumentType.value = res.Document_Type;
                    this.BasicInfoNew.PEPFlag.value = res.PEP_Flag;
                    // this.BasicInfoNew.PortfolioName.value = res.Portfolio_Name;
                    // this.BasicInfoNew.InvestmentObjective.value = res.Investment_Objective;
                    // this.BasicInfoNew.PortfolioType.value = res.Portfolio_Type;
                    // this.BasicInfoNew.AutoPledge.value = res.Autopledge;
                    // this.BasicInfoNew.CapitalCurrency.value = res.Capital_Currency;
                    // this.BasicInfoNew.CapitalPosted.value = this.cfs.FormatNumberr(res.Capital_Posted);
                    // this.BasicInfoNew.LimitCurrency.value = this.cfs.FormatNumberr(res.Limit_Currency);
                    // this.BasicInfoNew.LimitPosted.value = res.Limit_Posted;

                    // this.BasicInfoNew.BSB.value = res.BSB;
                    // this.BasicInfoNew.AccountName.value = res.Customer_Name;
                    // this.BasicInfoNew.AccountNumber.value = res.Account_No;
                    // this.BasicInfoNew.Currency.value = res.Accountcurrency;
                    // this.BasicInfoNew.PaymentFrequency.value = res.PaymentFrequency;
                    // this.BasicInfoNew.DepositAmount.value = this.cfs.FormatNumberr(res.DepositAmount);

                    // this.CustomerID = res.CustomerID;
                    this.AccountInfo.Currency = res.Accountcurrency;
                    this.isAccountCreated = false;
                    this.IsLoading = false;
                    // this.LoadAccounts(res);
                  }
                }
              );

              break;
            case 4:
              // Complete KYC ONLY
              this.IsLoading = true;
              this.viewQuation = 0;
              this.openTabs('completeKYC');
              this.ViewKYC = false;
              this.ReadOnlyMode = true;
              this.isAccountCreated = true;
              this.resultKYC = false;
              this.RiskRatingGenerated = false;
              this.afs.fngetCustAccountDetails(this.entityUser);
              this.GetCustomerAccountDetailsSubscriber = this.afs.getCustAccountDetails.subscribe(
                (res) => {
                  if (res) {
                    this.CustomerID = res.CustomerID;
                    this.PortfolioID = res.portfolio;
                    this.Account_Type = res.accounttype;
                    this.AccountInfo.Account_Name.value = res.Customer_Name;
                    this.AccountInfo.Account_Number.value = res.Account_No;
                    this.AccountInfo.BSB.value = res.BSB;
                    this.AccountInfo.Account_Number.value = res.accountnumber;

                    // this.BasicInfoNew.Address_Details.value = res.Address_Details;
                    this.BasicInfoNew.OfficePhoneNumber.value = res.Contact_no;
                    this.BasicInfoNew.CustomerType.value = res.CustomerType;
                    this.BasicInfoNew.Name.value = res.Customer_Name;
                    this.BasicInfoNew.DateOfBirth.value = res.Date_of_birth;
                    this.BasicInfoNew.CustomerIDType.value =
                      res.Identification_type;
                    this.BasicInfoNew.CustomerIDNumber.value =
                      res.Identificatoin_number;
                    this.BasicInfoNew.Nationality.value = res.Nationality;
                    // this.BasicInfoNew.Nature_of_Business.value = res.NatureOfBusiness;
                    // this.BasicInfoNew.Postal_Details.value = res.Postal_Address;

                    // this.CustomerID = res.CustomerID;
                    this.AccountInfo.Currency = res.Accountcurrency;
                    this.isAccountCreated = false;
                    // this.router.navigate(['validateUser/4']);
                    // this.LoadAccounts(res);
                  }
                }
              );
              this.IsLoading = true;
              this.afs.getRiskassesmentForm(this.formName);
              this.SubmitKYCFormSubscriber = this.afs.riskaccesmentObserver.subscribe(
                (res) => {
                  if (Object.keys(res).length !== 0) {
                    this.ConvertReponse(res);
                    this.ActualQuestionaries = res;
                    this.IsLoading = false;
                  }
                }
              );

              break;
            case 5:
              // View KYC Answers
              this.router.navigate(['CustomerSetupViewCpraDetailsComponent']);
              // this.IsLoading = true;
              // this.ReadOnlyMode = true;
              // this.viewKYCQuestionsAnswers = [];
              // this.openTabs('viewKYC');
              // this.ViewKYC = true;
              // this.msg = '';
              // // this.CustomerID = sessionStorage.getItem('CPRACustomerID');
              // this.CustomerID = sessionStorage.getItem('CustomerID');
              // this.GetKYCFormSubscriber = this.afs
              //   .fetchKYCFormDetails(this.formName, this.CustomerID)
              //   .subscribe((res) => {
              //     if (res.DB_GetKYCRiskProfileSummary_DataResult.length > 0) {
              //       res.DB_GetKYCRiskProfileSummary_DataResult.forEach(
              //         (element) => {
              //           if (
              //             element.DataType === 'radio' &&
              //             element.Question_NO !== '0'
              //           ) {
              //             this.viewKYCQuestionsAnswers.push({
              //               dataType: 'SectionValue',
              //               sectionHeader: '',
              //               QuestionNumber: element.Question_NO,
              //               key: element.Question,
              //               value: element.Answer,
              //             });
              //           }
              //         }
              //       );
              //       this.IsLoading = false;
              //     } else {
              //       this.IsLoading = false;
              //       this.msg = 'Complete your CPRA';
              //     }
              //   });
              break;

            // chitra start on 21-July-2020
            case 6:
              this.IsLoading = true;
              this.ReadOnlyMode = false;
              // this.totalPortfolio = [];
              this.addPortVisibility = true;
              this.tab1Error = '';
              this.openTabs('portfolioInfo');
              this.afs.loadDropdownValues('Risk_Profile', 'CommonData');
              this.afs.GetCustInvestmentObj(sessionStorage.getItem('CustomerID'));
              this.dropdownValuesSubscription = this.afs.dropdownValues.subscribe(
                (d) => {
                  if (d) {
                    // this.dd_InvestmentObjective = [];
                    // console.log('common data');
                    // console.log(d);
                    switch (d.filter) {
                      // case 'Investment_Objective':
                      //   d.data.forEach(element => {
                      //     this.dd_InvestmentObjective.push(element.Code);
                      //   });
                      // this.dd_InvestmentObjective = d.data;
                      // break;
                      case 'Risk_Profile':
                        d.data.forEach((element) => {
                          this.dd_RiskProfile.push(element.Code);
                        });
                        // this.dd_InvestmentObjective = d.data;
                        break;
                    }
                  }
                }
              );
              // this.afs.fngetCustAccountDetailsforMultiAcc(this.entityUser);
              this.GetCustomerMultiAccountDetailsSubscriber = this.afs.getCustAccountDetailsforMultiAcc.subscribe(
                (res) => {
                  console.log('getCustAccountDetailsforMultiAcc', res);
                  // this.totalPortfolio = [];
                  if (res.length !== 0 && this.LoadMultipleAccounts) {
                    this.CustomerInfoDetails = res;
                    this.totalaccounts = [];
                    if (res.status === false) {
                      this.IsLoading = false;
                      this.Accountpagemessage = 'No record found.';
                    } else if (res.length !== 0) {
                      if (this.callFlag === true) {
                        this.callFlag = false;
                        // this.CustomerID = res[0].CustomerID;
                        const array = [];
                        for (const acc of res) {
                          array.push(acc.CustomerID);
                        }

                        this.RiskRating = res[res.length - 1].misc9;
                        // added chitra

                        this.CustomerID = res[res.length - 1].CustomerID;

                        this.unique = array.filter(this.cfs.onlyUnique);

                        if (this.CustomerID !== undefined) {
                          this.afs.GetCustInvestmentObj(sessionStorage.getItem('CustomerID'));

                          this.afs.LoadPortfolio(this.CustomerID, 0);
                          // this.ds.getCPRAData(sessionStorage.getItem('RiskRating'), sessionStorage.getItem('Username')).subscr
                        }
                      }
                      // this.LoadMultipleAccounts = false;

                      res.forEach((element) => {
                        this.LoadAccounts(element);
                      });
                      const array = [];
                      for (const acc of res) {
                        array.push(acc.portfolio);
                      }
                      this.unique = array.filter(this.cfs.onlyUnique);
                    }
                  } else {
                    this.IsLoading = false;
                    this.Accountpagemessage = 'No record found.';
                  }
                  // if (res.status === false) {
                  //   this.IsLoading = false;
                  //   this.Accountpagemessage = 'No record found.';
                  // } else if (res.length !== 0) {
                  //   if (this.callFlag === true) {
                  //     this.callFlag = false;
                  //     // this.CustomerID = res[0].CustomerID;
                  //     const array = [];
                  //     for (const acc of res) {
                  //       array.push(acc.CustomerID);
                  //     }

                  //     this.RiskRating = res[res.length - 1].misc9;
                  //     // added chitra

                  //     this.unique = array.filter(this.cfs.onlyUnique);

                  //     if (this.CustomerID !== undefined) {
                  //       // console.log('CustomerID in getCustAccountDetailsforMultiAcc', this.CustomerID);
                  //       // console.log('TotalPortfolio in above', this.totalPortfolio);

                  //       this.afs.GetCustInvestmentObj(sessionStorage.getItem('CustomerID'));

                  //       this.afs.LoadPortfolio(this.CustomerID, 0);
                  //       console.log(res, this.LoadMultipleAccounts);

                  //     }
                  //     if (this.callFlag) {
                  //       for (let port of this.unique) {
                  //         this.afs.LoadPortfolio(this.CustomerID, port);
                  //       }
                  //     }
                  //     if (this.totalPortfolio.length === this.unique.length) {
                  //       console.log("matched");
                  //       // this.callFlag = true;
                  //     }
                  //   }
                  // }
                }
              );
              if (this.CustomerID !== undefined) {
                console.log('CustomerID in case 6 IF', this.CustomerID);
                console.log('TotalPortfolio in above', this.totalPortfolio);
                this.afs.GetCustInvestmentObj(sessionStorage.getItem('CustomerID'));
                this.afs.LoadPortfolio(sessionStorage.getItem('CustomerID'), 0);

                // this.afs.LoadPortfolio(this.CustomerID, 0);
                // if(this.callFlag){
                // for (let port of this.unique) {
                //   this.afs.LoadPortfolio(this.CustomerID, port);
                // }
                // }
                // if(this.totalPortfolio.length === this.unique.length){
                //   // this.callFlag = true;
                // }
              }
              break;

            // chitra end on 21-July-2020
          }
        }
      );

      // AnujaD || DocUpload || Start
      this.afs.GetCSPEvents().subscribe((res) => {
        if (res) {
          this.eventList = res;
          this.dropDownData();
        }
      });
      // AnujaD || DocUpload || End

      // this.ViewCPRADataSubscription = this.ds.viewCPRADataObserver.subscribe((res) => {
      //   if (res.length !== 0) {
      //     this.AvgCPRADetails = res.getKYCDataResult[0].RiskRatingDetails[0].Avg_Value;
      //     let InvestmentObjective = '';
      //     let tempArray = [];
      //     this.CPRAGraph = [];
      //     const RiskProfileGraphDetailsArray =
      //       res.getKYCDataResult[0].RiskprofileGraphDetails;

      //     RiskProfileGraphDetailsArray.forEach((ele, index) => {
      //       if (ele === null) {
      //         // console.log('true 1',ele,index);
      //         RiskProfileGraphDetailsArray.splice(index - 1, index);
      //         // console.log('true');
      //       }
      //     });
      //     if (RiskProfileGraphDetailsArray.length > 0) {
      //       RiskProfileGraphDetailsArray.forEach((element, index) => {
      //         if (InvestmentObjective === '') {
      //           // First chart
      //           InvestmentObjective = element.InvestmentObjective;
      //           tempArray.push([
      //             element.Scheme_Name,
      //             parseFloat(element.BA_Allocation),
      //           ]);
      //         } else if (InvestmentObjective === element.InvestmentObjective) {
      //           tempArray.push([
      //             element.Scheme_Name,
      //             parseFloat(element.BA_Allocation),
      //           ]);
      //         } else if (InvestmentObjective !== element.InvestmentObjective) {
      //           this.CPRAGraph.push({
      //             chartName: InvestmentObjective,
      //             data: tempArray,
      //           });
      //           InvestmentObjective = '';
      //           tempArray = [];
      //           tempArray.push([
      //             element.Scheme_Name,
      //             parseFloat(element.BA_Allocation),
      //           ]);
      //         }
      //         if (index === RiskProfileGraphDetailsArray.length - 1) {
      //           // Last index
      //           this.CPRAGraph.push({
      //             chartName: InvestmentObjective,
      //             data: tempArray,
      //           });
      //           tempArray = [];
      //         }
      //       });
      //     }
      //     console.log('viewCPRADataObserver', this.CPRAGraph[0].data);
      //   }
      // });
      // added by ruchira M on 05-jan-2021

      this.ds.getFactsheetDataObserver.subscribe((res) => {
        if (res) {
          console.log(res);
          if (res.length > 0) {
            this.documents = [];
            res.forEach((element) => {
              this.documents.push(element);
            });
          }
        } else {
          console.log('no data');
        }
      });
      this.afs.processToken.subscribe(
        (res) => {
          if (res.length !== 0) {
            this.loadflag = false;
            this.msg = res.processTokenonButtonClickResult;
            console.log(res);
          }
        },
        (err) => {
          this.loadflag = false;
          this.msg = 'Error occured. Please try again.';

        });
      this.afs.getCustomersOfRM(this.userID);

      // Subscription
      this.afs.GetCustomersOfRMObserver.subscribe((res: any) => {
        if (res.length) {
          this.customersOfRMArray = [];
          res.forEach((element) => {
            this.customersOfRMArray.push(element);
          });
          console.log('\nCustomers of RM: ', this.customersOfRMArray);
        }
      });
    } catch (error) {
      console.error(error);
    }

    this.afs.SavePortfolioObserver.subscribe((res: any) => {
      console.log(res);
      if (res) {
        console.log('SavePortfolioObserver', res);
        this.SavePortfolioResult = res;
      }
    });
    this.afs.LoadPortfolio(this.CustomerID, 0);
  }

  ngOnDestroy() {
    try {
      this.SelectedTab = '';
      this.pageMode = null;
      this.userID = '';
      this.buttonAction = '';
      try {
        // this.buttonActionSubscription?.unsubscribe();
        this.SetUserModeSubscriber.unsubscribe();
        this.GetCustomerAccountDetailsSubscriber.unsubscribe();
        this.GetCustomerMultiAccountDetailsSubscriber.unsubscribe();
        this.SaveCustomerDetailsSubscriber.unsubscribe();
        this.GetKYCFormSubscriber.unsubscribe();
        this.SubmitKYCFormSubscriber.unsubscribe();
        this.GetBankNameSubscriber.unsubscribe();
        this.AddCustomerAccountSubscriber.unsubscribe();
        this.GetAllTradableCurrenciesSubscriber.unsubscribe();
        this.GetFeedBackIDSubscriber.unsubscribe();
        this.dropdownValuesSubscription.unsubscribe();
        this.ViewCPRADataSubscription.unsubscribe();
      } catch (ex) {

      }

      this.afs.ResetprocessTokenObserver();
      this.ds.ResetViewCPRAData();
      this.totalPortfolio = [];
      this.afs.ResetCustomerDetails_ClientBoardingObserver();
      this.comm.ResetbtnAction();
      this.ClearAll();
    } catch (Exception) {
      console.log('Error occured while unsubscribing Subscriber: ' + Exception);
    }
  }
  // AnujaD || DocUpload || Start
  dropDownData() {
    try {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.eventList.length; i++) {
        this.dropDownList.push(this.eventList[i].Event_Name);
      }
      this.docUploadDD[0] = this.dropDownList[0];
    } catch (error) { }
  }
  uploadDoc() {
    let username;
    if (this.ClientOnBoardingUsername === '') {
      username = sessionStorage.getItem('Username');
    } else {
      username = this.ClientOnBoardingUsername;
    }

    const noteMasterID = sessionStorage.getItem('NoteMasterID');
    const HomeEntityID = sessionStorage.getItem('HomeEntityID');
    const HomeEntityName = sessionStorage.getItem('HomeEntityName');

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.uploadFileData.length; i++) {
      this.afs.AttachDocument(
        username,
        HomeEntityID,
        HomeEntityName,
        noteMasterID,
        this.uploadFileData[i].EventCode,
        this.uploadFileData[i].Name,
        this.uploadFileData[i].FileDetails
      );
      this.afs.AttachDocumentsObservable.subscribe((res: any) => {
        if (res) {
          this.DocumentMessage = 'Document(s) Uploaded Successfully';
        }
      });
    }
  }

  fileSelectionFunction(event: any, index) {
    let fileData: any;
    fileData = [];
    this.fileUploaded[this.fileUploaded.length - 1] = 1;
    fileData.Name = event.target.files[0].name;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.eventList.length; i++) {
      if (this.eventList[i].Event_Name === this.docUploadDD[index]) {
        fileData.EventCode = this.eventList[i].Event_Code;
        fileData.EventName = this.eventList[i].Event_Name;
      }
    }

    this.getByteArray(event.target.files[0]).then((byteArray) => {
      let jsonObject: any;
      jsonObject = { ImgData: byteArray };
      this.bytedata = jsonObject.ImgData;
      fileData.FileDetails = this.bytedata;
      this.uploadFileData.push(fileData);
    }).catch(err => console.log(err));;
  }
  getByteArray(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (ev) => {
        let array: any;
        array = ev.target.result;
        const fileByteArray = [];
        for (let i = 0; i < new Uint8Array(array).length; i++) {
          fileByteArray.push(new Uint8Array(array)[i]);
        }
        resolve(fileByteArray); // successful
      };
      fileReader.onerror = reject; // call reject if error
    });
  }

  selectFunctionDD() {
    if (this.fileUploaded[this.fileUploaded.length - 1] === 1) {
      this.fileUploaded.push(0);
      this.fileChosen.push(0);
    }
  }
  // AnujaD || DocUpload || End
  openTabs(infoType) {
    try {
      // eslint-disable-next-line one-var
      let i, tabcontent, tablinks;
      this.SelectedTab = infoType;
      tabcontent = document.getElementsByClassName('tabcontent');
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
      }
      tablinks = document.getElementsByClassName('tablinks');
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active-tl', '');
      }
      // evt.currentTarget.className += ' active-tl';
      // document.getElementById(infoType).style.display = 'block';
      // document.getElementById('defaultOpen').click();
      switch (infoType) {
        case 'basicInfo':
          this.Message = '';
          document.getElementById('tabbasicInfo').className += ' active-tl';
          break;
        case 'accountInfo':
          this.Message = '';
          document.getElementById('tabaccountInfo').className += ' active-tl';
          document.getElementById('tabbasicInfo').className += ' active-tl';

          break;
        case 'accountCreated':
          console.log('inside create');
          document.getElementById('tabaccountCreated').className +=
            ' active-tl';
          document.getElementById('tabaccountInfo').className += ' active-tl';
          document.getElementById('tabbasicInfo').className += ' active-tl';
          break;
        case 'completeKYC':
          this.Message = '';
          document.getElementById('tabacompleteKYC').className += ' active-tl';
          document.getElementById('tabaccountCreated').className +=
            ' active-tl';
          document.getElementById('tabaccountInfo').className += ' active-tl';
          document.getElementById('tabbasicInfo').className += ' active-tl';
          break;

        // chitra start on 21-July-2020
        case 'portfolioInfo':
          this.Message = '';
          document.getElementById('tabaccountInfo').className += ' active-tl';
          document.getElementById('tabbasicInfo').className += ' active-tl';
          break;
        // chitra end on 21-July-2020
      }
    } catch (Exception) { }
  }

  validateBasicInfo() {
    const invalidBasicInfo = Object.keys(this.BasicInfo)
      .map(
        (v) =>
          this.BasicInfo[v].value.trim() === '' && this.BasicInfo[v].visibility
      )
      .includes(true);
    if (invalidBasicInfo) {
      this.Message = 'All fields are mandatory';
    } else {
      // can move to second tab
      this.Message = '';
      this.openTabs('accountInfo');
    }
  }

  validateAccountInfo() {
    const invalidIndividualInfo = Object.keys(this.AccountInfo)
      .map(
        (v) =>
          this.AccountInfo[v].value.trim() === '' &&
          this.AccountInfo[v].visibility
      )
      .includes(true);
    if (invalidIndividualInfo) {
      this.Accountpagemessage = 'All fields are mandatory';
    } else {
      // can move to second tab
      this.Accountpagemessage = '';
      this.saveDetails('Insert');
      this.LoaderFlag = true;
    }
  }

  checkboxchangeListner() {
    if (
      this.isaddressSameasPostal &&
      this.BasicInfo.Address_Details.value.trim() !== ''
    ) {
      this.BasicInfo.Postal_Details.value = this.BasicInfo.Address_Details.value;
    }
  }

  getBSBCDetails() {
    this.AccountInfo.Bank_Name.value = '';
    if (this.AccountInfo.BSB.value.length > 1) {
      this.afs.getBSBDetails(this.AccountInfo.BSB.value);
    }
  }

  areAllQuestionsareAnswered(target: HTMLElement) {
    this.ErrorMessage = '';
    this.quationsList.forEach((item: any) => {
      if (item.answer === '' && this.ErrorMessage === '') {
        // target.scrollIntoView({
        //   behavior: 'smooth',
        //   block: 'end',
        //   inline: 'start',
        // });
        this.ErrorMessage = 'Please attempt all questions.';
        // const x = document.getElementById('snackbar');
        // x.className = 'show';
        // setTimeout(function () {
        //   x.className = x.className.replace('show', '');
        // }, 3000);
        // this.ErrorMessage = '';
        return false;
      }
      // else {
      //   this.ErrorMessage = '';
      // }
    });
    if (this.ErrorMessage === '') {
      return true;
    } else {
      return false;
    }
  }

  IsValidKYCAnswers(target: HTMLElement) {
    if (this.areAllQuestionsareAnswered(target)) {
      // All Questions are answered

      this.ErrorMessage = '';

      this.FinalAnswerSubmit();
    } else {
      // All Questions are not answered
      this.ErrorMessage = 'Please attempt all questions';
    }
  }

  FinalAnswerSubmit() {
    let Section;
    Section = '';
    this.FinalQuestionAnswered = [];
    this.FinalQuestionAnsweredNew = [];
    this.quationsList.forEach((element) => {
      if (Section !== element.Section) {
        // Section Changed
        Section = element.Section;
        this.FinalQuestionAnswered.push({
          FeedBack_ID: this.FeedBackID,
          User_ID: this.CustomerID,
          Form_ID: this.Form_ID,
          Temp_Name: this.formName,
          Question_NO: '0',
          Question: '',
          Answer: '',
          Points: '',
          DataType: 'Section',
          Date_OF_Submission: element.Date_OF_Submission,
        });
      }
      if (Section === element.Section && Section !== '') {
        // Fill Options
        this.FinalQuestionAnswered.push({
          // eslint-disable-next-line max-len
          FeedBack_ID: this.FeedBackID,
          User_ID: this.CustomerID,
          Form_ID: this.Form_ID,
          Temp_Name: this.formName,
          Question_NO: element.Question_NO,
          Question: element.quation,
          Answer: element.answer,
          Points: 'undefined',
          DataType: element.DataType,
          Date_OF_Submission: element.Date_OF_Submission,
        });
      }
    });

    this.FinalQuestionAnswered.forEach((questionElemet: any) => {
      let QuestionNumber = '';
      let AnswerNumber = 0;
      if (questionElemet.Question_NO !== '0') {
        AnswerNumber = 1;
        QuestionNumber = questionElemet.Question_NO;
        this.ActualQuestionaries.forEach((element: any) => {
          if (
            QuestionNumber === element.QuestionNo &&
            element.DataType === 'radio'
          ) {
            if (
              element.DataType === 'radio' &&
              element.DisplayName === questionElemet.Answer
            ) {
              this.FinalQuestionAnsweredNew.push({
                Key: 'Q' + QuestionNumber,
                Value: AnswerNumber.toString(),
              });
            } else {
              AnswerNumber = AnswerNumber + 1;
            }
          }
        });
      }
    });

    this.FinIQRequestHeader.LoginID = this.loggedInUsername;
    this.FinIQRequestHeader.CustomerID = this.CustomerID;
    this.answerList = {
      FinIQRequestHeader: this.FinIQRequestHeader,
      CRRCalculationRequest: this.FinalQuestionAnsweredNew,
    };
    this.afs.insertKYCformdetail(this.answerList).subscribe((response) => {
      if (response) {
        this.resultKYC = true;
        this.KYCRiskRatingReponse = response[0];
        if (this.KYCRiskRatingReponse.RiskRatingDetails[0].RiskRating !== '') {
          this.totalRiskRating = this.KYCRiskRatingReponse.RiskRatingDetails[0].RiskRating;
          if (this.totalRiskRating) {
            this.resultKYC = true;
            this.cfs.setiskycflag(true);
            this.RiskRatingGenerated = true;
            // Update Risk rating and risk profile
            sessionStorage.setItem(
              'RiskProfile',
              this.KYCRiskRatingReponse.RiskRatingDetails[0].Avg_Value
            );
            let InvestmentObjective = '';
            let tempArray = [];
            this.AllChartsData = [];
            const RiskProfileGraphDetailsArray = this.KYCRiskRatingReponse
              .RiskprofileGraphDetails;
            if (RiskProfileGraphDetailsArray.length > 0) {
              RiskProfileGraphDetailsArray.forEach((element, index) => {
                try {
                  if (element !== null) {
                    if (InvestmentObjective === '') {
                      // First chart
                      InvestmentObjective = element.InvestmentObjective;
                      tempArray.push([
                        element.Scheme_Name,
                        parseFloat(element.BA_Allocation),
                      ]);
                    } else if (
                      InvestmentObjective === element.InvestmentObjective
                    ) {
                      tempArray.push([
                        element.Scheme_Name,
                        parseFloat(element.BA_Allocation),
                      ]);
                    } else if (
                      InvestmentObjective !== element.InvestmentObjective
                    ) {
                      this.AllChartsData.push({
                        chartName: InvestmentObjective,
                        data: tempArray,
                      });
                      InvestmentObjective = '';
                      tempArray = [];
                      tempArray.push([
                        element.Scheme_Name,
                        parseFloat(element.BA_Allocation),
                      ]);
                    }
                    if (index === RiskProfileGraphDetailsArray.length - 1) {
                      // Last index
                      this.AllChartsData.push({
                        chartName: InvestmentObjective,
                        data: tempArray,
                      });
                      tempArray = [];
                    }
                    console.log('this.AllChartsData', this.AllChartsData);
                  }
                } catch (e) {
                  console.log('Null data found on investment objective');
                }
              });
            }
          }
          if (sessionStorage.getItem('isClientKYCDone') !== 'true') {
            sessionStorage.setItem('UserType', 'CLIENT');
            setTimeout(() => {
              this.afs.UpdateSidebarObserver(sessionStorage.getItem('UserType'));
            }, (AppConfig.settings.FormTimeOut * 1000));
          }
        } else {
          this.resultKYC = false;
          this.RiskRatingGenerated = false;
          this.ErrorMessage = 'Error occured while saving KYC Details.';
        }
        console.log(response);
      }
    });
    // this.afs.getKYCriskRating(this.formName, this.FeedBackID, this.Form_ID, this.CustomerID).subscribe(
    //   (res: any) => {
    //     try {
    //       if (res[0].RiskRating !== '') {
    //         this.totalRiskRating = res[0].RiskRating;
    //         if (this.totalRiskRating > 0) {
    //           this.resultKYC = true;
    //           this.cfs.setiskycflag(true);
    //           this.RiskRatingGenerated = true;
    //         }
    //       } else {
    //         this.resultKYC = false;
    //         this.RiskRatingGenerated = false;
    //         this.ErrorMessage = 'Error occured while saving KYC Details.';
    //       }
    //     } catch (Error) {
    //       console.log(Error);

    //     }
    //   });
    // this.custApi.updateSidebarBS.next(this.userType);

  }

  ConvertReponse(actualResponse: any) {
    try {
      if (
        actualResponse !== '' ||
        actualResponse !== null ||
        actualResponse !== undefined
      ) {
        let question, questionNumber, section;
        this.quationsList = [];
        let optionsList = [];
        let riskList = [];
        question = '';
        questionNumber = 0;
        section = '';
        actualResponse.forEach((element, index) => {
          const that = this;
          if (element.QuestionNo > 0) {
            if (questionNumber === element.QuestionNo) {
              if (element.DataType === 'radio') {
                optionsList.push(element.DisplayName);
                riskList.push(element.Riskrating);
              }
              if (index === actualResponse.length - 1) {
                if (question !== '' && optionsList.length > 0) {
                  // this.quationsList.push({ quation: question, 'optionsList': optionsList, answer: '', riskRating: riskList });
                  this.quationsList.push({
                    quation: question,
                    optionsList,
                    answer: '',
                    riskRating: riskList,
                    FeedBack_ID: '',
                    User_ID: '',
                    Form_ID: this.Form_ID,
                    Temp_Name: that.formName,
                    Date_OF_Submission: this.dateFormatted,
                    Question_NO: questionNumber,
                    DataType: 'radio',
                    Section: section,
                  });
                }
              }
            } else {
              if (question !== '' && optionsList.length > 0) {
                // this.quationsList.push({ quation: question, 'optionsList': optionsList, answer: '', riskRating: riskList });
                this.quationsList.push({
                  quation: question,
                  optionsList,
                  answer: '',
                  riskRating: riskList,
                  FeedBack_ID: '',
                  User_ID: '',
                  Form_ID: this.Form_ID,
                  Temp_Name: that.formName,
                  Date_OF_Submission: this.dateFormatted,
                  Question_NO: questionNumber,
                  DataType: 'radio',
                  Section: section,
                });
              }
              questionNumber = element.QuestionNo;
              section = element.Section;
              this.Form_ID = element.FormID;
              if (element.DataType === 'Question') {
                question = element.DisplayName;
                optionsList = [];
                riskList = [];
              }
            }
          }
        });
      }
    } catch (Exception) {
      console.log('Exception in ConvertResponse:' + Exception);
    }
  }
  // createAccount(account) {
  //   try {
  //     if (account.bankName.value) {
  //       this.afs
  //         .insertCustPortfolioDetails(
  //           this.CustomerID.toString(),
  //           account.Currency.value,
  //           account.PortfolioName.value,
  //           account.Account_Number.value,
  //           this.Account_Type,
  //           account.BSB.value,
  //           account.bankName.value
  //         ).subscribe((res: any) => {
  //           if (res === 'Success') {
  //             account.createdSuccessfully = 'true';
  //             this.Accountpagemessage = 'Account added successfully.';
  //           } else {
  //             this.Accountpagemessage =
  //               'Failed: Error occured while adding Account.';
  //           }
  //         });
  //     } else {
  //       this.Accountpagemessage = 'Failed: Please enter valid BSB/Branch Code.';
  //     }
  //   } catch (ex) {
  //     console.log(ex);
  //   } finally {
  //     const x = document.getElementById('snackbar');
  //     x.className = 'show';
  //     setTimeout(() => {
  //       x.className = x.className.replace('show', '');
  //     }, 3000);
  //   }
  // }
  createAccount(account) {
    try {
      if (account.BSB.value) {
        this.Accountpagemessage = '';
        if (account.bankName.value && account.Account_Number && account.AccountName.value &&
          account.PortfolioName.value && account.Currency.value) {
          this.afs
            .insertCustPortfolioDetails(
              this.CustomerID.toString(),
              account.Currency.value,
              account.PortfolioName.value,
              account.Account_Number.value,
              this.Account_Type === null ? 'CA' : this.Account_Type,
              account.BSB.value,
              account.bankName.value
            ).subscribe((res: any) => {

              /*if( account.BSB.value === '' || account.bankName.value === '' || account.Account_Number.value === '' ||
                account.AccountName.value === '' || account.PortfolioName.value === '' ||
                account.Currency.value === '') {

                  this.Accountpagemessage = 'Please enter all the fields!';
                  return false;
              }*/

              if (res === 'Success') {
                account.createdSuccessfully = 'true';
                this.Accountpagemessage = 'Account added successfully.';
                this.openTabs('accountInfo');
                // this.afs.fngetCustAccountDetailsforMultiAcc(this.entityUser);
              } else {
                this.Accountpagemessage =
                  'Failed: Error occured while adding Account.';
                this.openTabs('accountInfo');
              }
            });
        }
        else {
          this.Accountpagemessage = 'Please enter all the fields!';
          return false;
        }
      } else {
        this.Accountpagemessage = 'Failed: Please enter valid BSB/Branch Code.';
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      const x = document.getElementById('snackbar');
      x.className = 'show';
      setTimeout(() => {
        x.className = x.className.replace('show', '');
      }, 3000);
    }
  }
  selectDateOfBirth(date) {
    this.BasicInfoNew.DateOfBirth.value = moment(date).format('DD-MMM-YYYY');
  }
  selectLastKYCDoneOn(date) {
    this.BasicInfoNew.LastKYCDoneOn.value = moment(date).format('DD-MMM-YYYY');
  }
  selectNextKYCDueOn(date) {
    // this.BasicInfoNew.NextKYCDueOn.value = moment(date).format('DD-MMM-YYYY');
  }
  redirectToHome() {
    this.cfs.setRedirectFlag('Home');
  }
  addAccount() {
    this.totalaccounts.push({
      BSB: { value: '', visibility: true },
      bankName: { value: '', visibility: true },
      Account_Balance: { value: '', visibility: false },
      Account_Number: { value: '', visibility: true },
      AccountName: { value: '', visibility: true },
      Portfolio: { value: '', visibility: true },
      PortfolioName: { value: '', visibility: true },
      Currency: { value: '', visibility: true },
      ErrorMessage: '',
      createdSuccessfully: '',
    });
  }
  removeAccount(index) {
    this.totalaccounts.splice(index, 1);
  }
  addaccountBSB(index) {
    this.indexConst = index;
    this.totalaccounts[this.indexConst].bankName.value = '';
    if (this.totalaccounts[this.indexConst].BSB.value.length > 1) {
      // this.afs.ClearObserversonValidateUserPage();
      // this.afs.getBSBDetails(this.totalaccounts[this.indexConst].BSB.value);
      this.accountInfoViewMode = true;
    }
  }
  LoadAccounts(res) {
    // accountDetail.forEach((res: any) => {
    // Validating BSB Code
    // if (res.BSB !== null) {
    //   if (res.BSB.length < 6) {
    //     for (let i = res.BSB.length; i < 7; i++) {
    //       res.BSB = '0' + res.BSB;
    //     }
    //   }
    if (res.accountnumber !== null) {
      this.totalaccounts.push({
        BSB: { value: Number(res.misc6).toString(), visibility: false },
        // bankName: { value: res.Bank_Name, visibility: false },
        bankName: { value: res.misc3, visibility: false },
        Account_Balance: { value: this.decimalPipe.transform(res.AvailableBalance, '1.2-2'), visibility: false },
        Account_Number: { value: res.accountnumber, visibility: false },
        AccountName: { value: res.Customer_Name, visibility: false },
        Portfolio: { value: res.portfolio, visibility: false },
        PortfolioName: { value: '', visibility: true },
        Currency: { value: res.Accountcurrency, visibility: false },
        ErrorMessage: '',
        createdSuccessfully: 'true',
      });
    } else {

    }

    // }
    // this.addaccountBSB(this.totalaccounts.length - 1);
    // });
  }
  getValueInput(event, index) {
    const target: any = this.cfs.GetEventTarget(event);
    this.totalaccounts[index].BSB.value = target.value;
    this.addaccountBSB(index);
  }
  TransferAmount(index) {

    this.cfs.setAccountInfoForRedirectTocashDesposit(this.CustomerInfoDetails[index]);
    // console.log("CustomerInfoDetails[index]", this.CustomerInfoDetails[index]);
    this.cfs.setRedirectFlag('Cash Deposit');

  }
  SubmitBasicInfo() {
    this.Summary = [];

    if (this.ValidateSaveUCPReuqest() || this.pageMode !== 1) {
      window.scroll(0, 0);
      this.ErrorMessage = '';
      this.ReadOnlyMode = false; // this is read only mode
      try {
        Object.keys(this.BasicInfoNew).forEach((ele, index) => {
          if (ele === 'Name') {
            this.Summary.push({
              dataType: 'SectionHeader',
              sectionHeader: 'Personal Details',
              key: '',
              value: '',
            });
            this.Summary.push({
              dataType: 'SectionValue',
              sectionHeader: '',
              key: this.SummaryHeaderLabels[index],
              value: this.BasicInfoNew[ele].value,
            });
          } else if (ele === 'HomePhoneNumber') {
            this.Summary.push({
              dataType: 'SectionHeader',
              sectionHeader: 'Contact Info',
              key: '',
              value: '',
            });
            this.Summary.push({
              dataType: 'SectionValue',
              sectionHeader: '',
              key: this.SummaryHeaderLabels[index],
              value: this.BasicInfoNew[ele].value,
            });
          } else if (ele === 'CIF') {
            this.Summary.push({
              dataType: 'SectionHeader',
              sectionHeader: 'Identification Details',
              key: '',
              value: '',
            });
            this.Summary.push({
              dataType: 'SectionValue',
              sectionHeader: '',
              key: this.SummaryHeaderLabels[index],
              value: this.BasicInfoNew[ele].value,
            });
          } else if (ele === 'CustomerType') {
            this.Summary.push({
              dataType: 'SectionHeader',
              sectionHeader: 'Investor Details',
              key: '',
              value: '',
            });
            this.Summary.push({
              dataType: 'SectionValue',
              sectionHeader: '',
              key: this.SummaryHeaderLabels[index],
              value: this.BasicInfoNew[ele].value,
            });
          }
          // else if (ele === 'PortfolioName') {
          //   this.Summary.push({ dataType: 'SectionHeader', sectionHeader: 'Portfolio Details', key: '', value: '' });
          //   this.Summary.push({ dataType: 'SectionValue', sectionHeader: '', key: this.SummaryHeaderLabels[index], value: this.BasicInfoNew[ele].value });
          // } else if (ele === 'BSB') {
          //   this.Summary.push({ dataType: 'SectionHeader', sectionHeader: 'Account Info', key: '', value: '' });
          //   this.Summary.push({ dataType: 'SectionValue', sectionHeader: '', key: this.SummaryHeaderLabels[index], value: this.AccountInfo[ele].value });
          // else if (this.pageMode === 1) {
          //   this.BasicInfoNew.AccountName.value = this.AccountInfo.Account_Name.value;
          //   this.BasicInfoNew.BankName.value = this.AccountInfo.Bank_Name.value;
          //   this.BasicInfoNew.AccountNumber.value = this.AccountInfo.Account_Number.value;
          //   this.BasicInfoNew.PaymentFrequency.value = this.AccountInfo.Payment_Frequency.value;
          //   this.BasicInfoNew.Currency.value = this.AccountInfo.Currency.value;
          //   this.BasicInfoNew.DepositAmount.value = this.AccountInfo.Deposit_Amount.value;
          // }
          // }
          else if (ele === 'PEPFlag' && this.pageMode === 2) {
            this.Summary.push({
              dataType: 'SectionValue',
              sectionHeader: '',
              key: this.SummaryHeaderLabels[index],
              value: this.BasicInfoNew[ele].value,
            });
            this.Summary.push({
              dataType: 'SectionHeader',
              sectionHeader: 'Risk Profile Details',
              key: '',
              value: '',
            });
            this.Summary.push({
              dataType: 'SectionValue',
              sectionHeader: '',
              key: 'Risk Rating',
              value: this.RiskRating,
            });
            this.Summary.push({
              dataType: 'SectionValue',
              sectionHeader: '',
              key: 'Risk Profile',
              value: this.RiskProfile,
            });
            // } else if (ele === 'PEPFlag' && this.pageMode === 2) {
            if (this.ClientOnBoardingUsername === '') {
              this.Summary.push({
                dataType: 'SectionHeader',
                sectionHeader: 'Login Info',
                key: '',
                value: '',
              });
              this.Summary.push({
                dataType: 'SectionValue',
                sectionHeader: '',
                key: 'Username',
                value: this.userID,
              });
              this.Summary.push({
                dataType: 'SectionValue',
                sectionHeader: '',
                key: 'Email ID',
                value: this.EmailID,
              });
              this.Summary.push({
                dataType: 'SectionValue',
                sectionHeader: '',
                key: 'Password',
                value: '*******',
              });
              this.Summary.push({
                dataType: 'SectionValue',
                sectionHeader: '',
                key: 'Last Login time',
                value: this.loggedAt,
              });
            }


            this.Summary.push({
              dataType: 'SectionHeader',
              sectionHeader: 'Documents Information',
              key: '',
              value: '',
            });
          } else {
            this.Summary.push({
              dataType: 'SectionValue',
              sectionHeader: '',
              key: this.SummaryHeaderLabels[index],
              value: this.BasicInfoNew[ele].value,
            });
          }
          // console.log('summary', this.Summary);
        });
      } catch (Exception) {
        console.log('Error occured in Summary generation function.');
      }
    }
  }
  // AnujaD. || DocUpload || 7/12/2020 ||Start
  DocumentInformation() {
    Object.keys(this.BasicInfoNew).forEach((ele, index) => {
      if (ele === 'PEPFlag' && this.pageMode === 2) {
        this.DOCresponse = [];

        if (this.GetDocDeatils.length > 0) {
          // this.DOCresponse.push(GetDocDeatils[0]);

          for (let i = 0; i < this.eventList.length; i++) {
            if (
              this.eventList[i].Event_Code.toUpperCase() ===
              this.GetDocDeatils[0].Event.toUpperCase()
            ) {
              let DOCresponse: any;
              DOCresponse = [];

              DOCresponse.Event = this.eventList[i].Event_Name;
              DOCresponse.DocumentName =
                this.GetDocDeatils[0].TargetFileName +
                '.' +
                this.GetDocDeatils[0].OutPutExtension;
              this.DOCresponse = [];
              this.DOCresponse.push(DOCresponse);
              this.pushDocumentInformation();
              break;
            }
          }
        }
      }
    });
  }
  pushDocumentInformation() {
    for (let i = 0; i < this.DOCresponse.length; i++) {
      const event = this.DOCresponse[i].Event;
      const name = this.DOCresponse[i].DocumentName;
      const checkEventExistence = (event) =>
        this.Summary.some(({ value }) => value === event);

      console.log(
        'CHECK ROLE EXISTANCE: ',
        checkEventExistence(this.DOCresponse[i].Event)
      );

      if (
        !checkEventExistence('  Filename: ' + this.DOCresponse[i].DocumentName)
      ) {
        console.log('DOC RESPONSE LOOP FUNCTION: ', this.DOCresponse[i]);
        this.Summary.push({
          dataType: 'SectionValue',
          sectionHeader: '',
          key: 'Event: ' + this.DOCresponse[i].Event,
          value: '  Filename: ' + this.DOCresponse[i].DocumentName,
        });
      }
    }
    this.DOCresponse = [];
  }
  // AnujaD. || DocUpload || 3/12/2020 ||End
  FinalSubmitBasicInfo() {
    // Final Submit SaveUCP
    try {
      this.saveDetails('Insert');
      this.LoaderFlag = true;
    } catch (Exception) {
      console.log('Error occured while submitting the info in UCP.');
    }
  }
  saveDetails(Mode: string) {
    try {
      const jsonObj = {
        ExcelSheets: {
          Initial_Evaluation: {
            CSS_Login_ID: this.username1,
            CSS_Email_ID: this.emailid1,
            CSS_Identification_number: this.BasicInfoNew.CustomerIDNumber.value,
            CSS_Customer_Name: this.BasicInfoNew.Name.value,
            CSS_BlockHouseNo: this.BasicInfoNew.BlockHouseNo.value,
            CSS_StreetName: this.BasicInfoNew.StreetName.value,
            CSS_City: this.BasicInfoNew.City.value,
            CSS_State: this.BasicInfoNew.State.value,
            CSS_Country: this.BasicInfoNew.Country.value,
            CSS_PostalCode: this.BasicInfoNew.PostalCode.value,
            CSS_HomePhoneNo: this.BasicInfoNew.HomePhoneNumber.value,
            CSS_OfficePhoneNo: this.BasicInfoNew.OfficePhoneNumber.value,
            CSS_FaxNo: this.BasicInfoNew.FaxNumber.value,
            CSS_Email: this.BasicInfoNew.Email.value,
            CSS_Cif: this.BasicInfoNew.CIF.value,
            CSS_CustomerIDType: this.BasicInfoNew.CustomerIDType.value,
            CSS_CustomerIDNo: this.BasicInfoNew.CustomerIDNumber.value,
            CSS_AlternateDocID: this.BasicInfoNew.AlternateDocID.value,
            CSS_Dateofbirth: this.BasicInfoNew.DateOfBirth.value,
            CSS_CountryResidence: this.BasicInfoNew.CountryResidence.value,
            CSS_Nationality: this.BasicInfoNew.Nationality.value,
            CSS_CustomerType: this.BasicInfoNew.CustomerType.value,
            CSS_CustomerSegment: this.BasicInfoNew.CustomerSegment.value,
            CSS_Category: this.BasicInfoNew.Category.value,
            CSS_ProfessionalInvestor: this.BasicInfoNew.ProfessionalInvestor
              .value,
            CSS_LastKYCDoneOn: this.cfs.checkAndFormatDate(
              this.BasicInfoNew.LastKYCDoneOn.value
            ),
            // CSS_NextKYCDueOn: this.cfs.checkAndFormatDate(this.BasicInfoNew.NextKYCDueOn.value),
            // CSS_DocumentType: this.BasicInfoNew.DocumentType.value,
            CSS_PEPFlag: this.BasicInfoNew.PEPFlag.value === 'Yes' ? 'Y' : 'N',
            // CSS_PortfolioName: this.BasicInfoNew.PortfolioName.value,
            // CSS_InvestmentObjective: this.BasicInfoNew.InvestmentObjective.value,
            // CSS_PortfolioType: this.BasicInfoNew.PortfolioType.value,
            // CSS_AutoPledge: this.BasicInfoNew.AutoPledge.value,
            // CSS_CapitalCurrency: this.BasicInfoNew.CapitalCurrency.value,
            // CSS_CapitalPosted: this.BasicInfoNew.CapitalPosted.value,
            // CSS_LimitCurrency: this.BasicInfoNew.LimitCurrency.value,
            // CSS_LimitPosted: this.BasicInfoNew.LimitPosted.value,

            // CSS_Contact_Number: '+' + this.BasicInfoNew.Contact_Number.value,
            // CSS_Identification_type: this.BasicInfoNew.IdentificationType.value,
            // CSS_Identification_number: this.BasicInfoNew.IdentificationNo.value,
            // CSS_Date_of_birth: this.cfs.checkAndFormatDate(this.BasicInfo.DOB.value),
            // CSS_Nationality: this.BasicInfo.Nationality.value,
            // CSS_Address_Details: this.BasicInfo.Address_Details.value,
            // CSS_Postal_Details: this.BasicInfo.Postal_Details.value,
            // CSS_Nature_of_Business: this.BasicInfo.Nature_of_Business.value,

            // CSS_BSB: this.AccountInfo.BSB.value,
            // CSS_BankName: this.AccountInfo.Bank_Name.value,
            // CSS_Account_Number: this.AccountInfo.Account_Number.value,
            // CSS_Account_Name: this.AccountInfo.Account_Name.value,
            // CSS_Payment_Frequency: this.AccountInfo.Payment_Frequency.value,
            // CSS_Deposit_Amount: this.AccountInfo.Deposit_Amount.value,
            // CSS_Login_ID: this.entityUser,
            // CSS_Currency: this.AccountInfo.Currency
          },
        },
      };

      this.Message = '';
      this.AccountMessage = '';
      this.DocumentMessage = '';
      this.afs.ClearObserversonValidateUserPage();
      if (Mode === 'Insert') {
        this.afs.saveNewOrder(
          jsonObj,
          this.entityUser,
          'Initial_Evaluation',
          'Insert',
          0
        );
      } else {
        this.afs.saveNewOrder(
          jsonObj,
          this.entityUser,
          'Initial_Evaluation',
          'Update',
          Number(sessionStorage.getItem('NoteMasterID'))
        );
      }

      this.SaveCustomerDetailsSubscriber = this.afs.SaveOrder.subscribe(
        (res) => {
          if (res) {
            if (res.SaveUCPResult) {
              this.Message = res.SaveUCPResult[0].SavingMessage;
              if (this.Message !== null) {
                console.log(
                  this.Message,
                  res.SaveUCPResult[0].RowNumber === 1 &&
                  this.Message.length > 0
                );
                if (
                  res.SaveUCPResult[0].RowNumber === 1 &&
                  this.Message.length > 0
                ) {
                  this.Message = 'Ref id ' + res.SaveUCPResult[0].NoteMasterID;
                  this.NotteMasterID = res.SaveUCPResult[0].NoteMasterID;
                  if (Mode === 'Insert') {
                    this.AccountMessage = 'Account Created Successfully';
                  } else {
                    this.AccountMessage = 'Account Updated Successfully';
                  }
                  this.cfs.isCustomerCreated(true);
                  this.afs.fngetCustAccountDetails(this.entityUser);
                  this.ds.Get_KYCFeedbackIDCheck(AppConfig.settings.CSP_UpdateCIRPFormName, this.CustomerID);
                  this.openTabs('accountCreated');
                  this.SuccessMsg = '';
                  this.ErrorMsg = '';
                } else {
                  this.Message =
                    'Error while saving the record. Please try again or contact the system administrator.';
                  this.SuccessMsg = '';
                  this.ErrorMsg = '';
                }
              } else {
                try {
                  this.ErrorMessage = res.SaveUCPResult[0].WarningMessage;
                  const x = document.getElementById('snackbar');
                  x.className = 'show';
                  setTimeout(function () {
                    x.className = x.className.replace('show', '');
                  }, 3000);
                  this.ErrorMessage = '';
                } catch (Exception) { }
              }
            }
            this.LoaderFlag = false;
          }
        }
      );
    } catch (ex) {
      console.log(ex);
      this.Message =
        'Error occurred while processing the request. Please contact the system administrator.';
    }
  }
  PrevBasicInfo() {
    this.ErrorMessage = '';
    this.ReadOnlyMode = true;
  }

  ValidateSaveUCPReuqest() {
    let isAnyFieldBlank = false;
    this.MandatoryFields.forEach((param: any) => {
      if (
        this.BasicInfoNew[param].value === '' &&
        this.BasicInfoNew[param].visibility === true
      ) {
        isAnyFieldBlank = true;
      }
    });
    if (isAnyFieldBlank) {
      return false;
    } else {
      return true;
    }
  }
  BasicInfoFormFillingStatus() {
    try {
      if (this.isPersonalDetailsFullyFilled()) {
        document.getElementById('dotpersonalDetails').className = 'dotselected';
      } else {
        document.getElementById('dotpersonalDetails').className =
          'dotunselected';
      }
      if (this.isContactInfoFullyFilled()) {
        document.getElementById('dotcontactInfo').className = 'dotselected';
      } else {
        document.getElementById('dotcontactInfo').className = 'dotunselected';
      }
      if (this.isIdentificationDetailsFullyFilled()) {
        document.getElementById('dotidentificationDetails').className =
          'dotselected';
      } else {
        document.getElementById('dotidentificationDetails').className =
          'dotunselected';
      }
      if (this.isInvestorDetailsFullyFilled()) {
        document.getElementById('dotinvestorDetails').className = 'dotselected';
      } else {
        document.getElementById('dotinvestorDetails').className =
          'dotunselected';
      }
      // if (this.isPortfolioDetailsFullyFilled()) {
      //   document.getElementById('dotportfolioDetails').className = 'dotselected';
      // } else {
      //   document.getElementById('dotportfolioDetails').className = 'dotunselected';
      // }
      // if (this.isAccountInfoFullyFilled()) {
      //   document.getElementById('dotaccountInfo').className = 'dotselected';
      // } else {
      //   document.getElementById('dotaccountInfo').className = 'dotunselected';
      // }
    } catch (Exception) {
      console.log('Error generated in Update form status: ' + Exception);
    }
  }

  EditProfile() {
    // this.pageMode =1;
    this.msg = '';
    this.username1 = '';
    this.password1 = '';
    this.emailid1 = '';
    this.confirmPassword1 = '';
    this.ReadOnlyMode = true;
    this.editProfileflag = false;
    this.CustomerID = '';
    this.PortfolioID = '';
    // this.Account_Type ='';
    // this.AccountInfo.BSB.value ='';
    // this.AccountInfo.Account_Name.value ='';
    // this.AccountInfo.Account_Number.value = '';
    // this.AccountInfo.Currency = {value:'', visibility:false};
    // this.AccountInfo.Payment_Frequency ={value:'', visibility:false};
    // this.AccountInfo.Deposit_Amount = {value:'', visibility:false};
    // this.BasicInfoNew.Name.value =  '';
    // this.BasicInfoNew.BlockHouseNo.value =  '';
    // this.BasicInfoNew.StreetName.value = '';
    // this.BasicInfoNew.City.value =  '';
    // this.BasicInfoNew.State.value =  '';
    // this.BasicInfoNew.Country.value =  '';
    // this.BasicInfoNew.PostalCode.value =  '';
    // this.BasicInfoNew.HomePhoneNumber.value =  '';
    // this.BasicInfoNew.OfficePhoneNumber.value = '';
    // this.BasicInfoNew.FaxNumber.value =  '';
    // this.BasicInfoNew.Email.value =  '';
    // this.BasicInfoNew.CIF.value =  '';
    // this.BasicInfoNew.CustomerIDType.value =  '';
    // this.BasicInfoNew.CustomerIDNumber.value =  '';
    // this.BasicInfoNew.AlternateDocID.value = '';
    // this.BasicInfoNew.DateOfBirth.value =  '';
    // this.BasicInfoNew.CountryResidence.value =  '';
    // this.BasicInfoNew.Nationality.value =  '';
    // this.BasicInfoNew.CustomerType.value =  '';
    // this.BasicInfoNew.CustomerSegment.value =  '';
    // this.BasicInfoNew.Category.value =  '';
    // this.BasicInfoNew.ProfessionalInvestor.value = '';
    // this.BasicInfoNew.LastKYCDoneOn.value =  '';
    // this.BasicInfoNew.PEPFlag.value =  '';
  }
  VerifyProfile() {
    this.msg = '';
    this.loadflag = true;
    this.afs.processButtonActionOnBoarding(

      this.tokenId,
      this.dealNo,
      11169,
      this.login
    ); // Added by Suvarna P dealNo NMI And tokenId to be confirm
  }
  RejectProfile() {
    this.msg = '';
    this.loadflag = true;
    this.afs.processButtonActionOnBoarding(
      this.tokenId,
      this.dealNo,
      11170,
      this.userID
    ); // Added byh Suvarna P dealNo And tokenId to be confirm
  }

  CancelEditProfile() {
    this.ReadOnlyMode = false;
    this.editProfileflag = true;
  }

  isPersonalDetailsFullyFilled() {
    if (
      this.BasicInfoNew.Name.value !== '' &&
      this.BasicInfoNew.Name.visibility === true
    ) {
      if (
        this.BasicInfoNew.BlockHouseNo.value !== '' &&
        this.BasicInfoNew.BlockHouseNo.visibility === true
      ) {
        if (
          this.BasicInfoNew.StreetName.value !== '' &&
          this.BasicInfoNew.StreetName.visibility === true
        ) {
          if (
            this.BasicInfoNew.City.value !== '' &&
            this.BasicInfoNew.City.visibility === true
          ) {
            if (
              this.BasicInfoNew.State.value !== '' &&
              this.BasicInfoNew.State.visibility === true
            ) {
              if (
                this.BasicInfoNew.Country.value !== '' &&
                this.BasicInfoNew.Country.visibility === true
              ) {
                if (
                  this.BasicInfoNew.PostalCode.value !== '' &&
                  this.BasicInfoNew.PostalCode.visibility === true
                ) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }
  isContactInfoFullyFilled() {
    if (
      this.BasicInfoNew.HomePhoneNumber.value !== '' &&
      this.BasicInfoNew.HomePhoneNumber.visibility === true
    ) {
      if (
        this.BasicInfoNew.OfficePhoneNumber.value !== '' &&
        this.BasicInfoNew.OfficePhoneNumber.visibility === true
      ) {
        if (
          this.BasicInfoNew.FaxNumber.value !== '' &&
          this.BasicInfoNew.FaxNumber.visibility === true
        ) {
          if (
            this.BasicInfoNew.Email.value !== '' &&
            this.BasicInfoNew.Email.visibility === true
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
  isIdentificationDetailsFullyFilled() {
    if (
      this.BasicInfoNew.CIF.value !== '' &&
      this.BasicInfoNew.CIF.visibility === true
    ) {
      if (
        this.BasicInfoNew.CustomerIDType.value !== '' &&
        this.BasicInfoNew.CustomerIDType.visibility === true
      ) {
        if (
          this.BasicInfoNew.CustomerIDNumber.value !== '' &&
          this.BasicInfoNew.CustomerIDNumber.visibility === true
        ) {
          if (
            this.BasicInfoNew.AlternateDocID.value !== '' &&
            this.BasicInfoNew.AlternateDocID.visibility === true
          ) {
            if (
              this.BasicInfoNew.DateOfBirth.value !== '' &&
              this.BasicInfoNew.DateOfBirth.visibility === true
            ) {
              if (
                this.BasicInfoNew.CountryResidence.value !== '' &&
                this.BasicInfoNew.CountryResidence.visibility === true
              ) {
                if (
                  this.BasicInfoNew.Nationality.value !== '' &&
                  this.BasicInfoNew.Nationality.visibility === true
                ) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }
  isInvestorDetailsFullyFilled() {
    if (
      this.BasicInfoNew.CustomerType.value !== '' &&
      this.BasicInfoNew.CustomerType.visibility === true
    ) {
      if (
        this.BasicInfoNew.CustomerSegment.value !== '' &&
        this.BasicInfoNew.CustomerSegment.visibility === true
      ) {
        if (
          this.BasicInfoNew.Category.value !== '' &&
          this.BasicInfoNew.Category.visibility === true
        ) {
          if (
            this.BasicInfoNew.ProfessionalInvestor.value !== '' &&
            this.BasicInfoNew.ProfessionalInvestor.visibility === true
          ) {
            if (
              this.BasicInfoNew.LastKYCDoneOn.value !== '' &&
              this.BasicInfoNew.LastKYCDoneOn.visibility === true
            ) {
              // if (this.BasicInfoNew.NextKYCDueOn.value !== '' && this.BasicInfoNew.NextKYCDueOn.visibility === true) {
              //   if (this.BasicInfoNew.DocumentType.value !== '' && this.BasicInfoNew.DocumentType.visibility === true) {
              if (
                this.BasicInfoNew.PEPFlag.value !== '' &&
                this.BasicInfoNew.PEPFlag.visibility === true
              ) {
                return true;
              }
            }
            //   }
            // }
          }
        }
      }
    }
    return false;
  }
  // isPortfolioDetailsFullyFilled() {
  //   if (this.BasicInfoNew.PortfolioName.value !== '' && this.BasicInfoNew.PortfolioName.visibility === true) {
  //     if (this.BasicInfoNew.InvestmentObjective.value !== '' && this.BasicInfoNew.InvestmentObjective.visibility === true) {
  //       if (this.BasicInfoNew.PortfolioType.value !== '' && this.BasicInfoNew.PortfolioType.visibility === true) {
  //         if (this.BasicInfoNew.AutoPledge.value !== '' && this.BasicInfoNew.AutoPledge.visibility === true) {
  //           if (this.BasicInfoNew.CapitalCurrency.value !== '' && this.BasicInfoNew.CapitalCurrency.visibility === true) {
  //             if (this.BasicInfoNew.CapitalPosted.value !== '' && this.BasicInfoNew.CapitalPosted.visibility === true) {
  //               if (this.BasicInfoNew.LimitCurrency.value !== '' && this.BasicInfoNew.LimitCurrency.visibility === true) {
  //                 if (this.BasicInfoNew.LimitPosted.value !== '' && this.BasicInfoNew.LimitPosted.visibility === true) {
  //                   return true;
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return false;
  // }
  // isAccountInfoFullyFilled() {
  //   if (this.AccountInfo.BSB.value !== '' && this.AccountInfo.BSB.visibility === true) {
  //     if (this.AccountInfo.Account_Number.value !== '' && this.AccountInfo.Account_Number.visibility === true) {
  //       if (this.AccountInfo.Account_Name.value !== '' && this.AccountInfo.Account_Name.visibility === true) {
  //         if (this.AccountInfo.Payment_Frequency.value !== '' && this.AccountInfo.Payment_Frequency.visibility === true) {
  //           if (this.AccountInfo.Currency.value !== '' && this.AccountInfo.Currency.visibility === true) {
  //             if (this.AccountInfo.Deposit_Amount.value !== '' && this.AccountInfo.Deposit_Amount.visibility === true) {
  //               return true;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return false;
  // }

  // chitra start on 23-July-2020
  addPortfolioTile() {
    // console.log('adding', this.totalPortfolio[0].RiskProfile.value);
    this.afs.GetCustInvestmentObj(sessionStorage.getItem('CustomerID'));
    // console.log('inv', this.dd_InvestmentObjective);
    // console.log('FCode', this.FCode);
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
        value: 'LTV Financing',
        visibility: true,
      },
      AutoPledge: {
        value: 'No',
        visibility: true,
      },
      InvestmentObjective: {
        value: 'Capital Protection',
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
        value: this.RiskProfile.toUpperCase(),
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
      }
    });
    // console.log('after addPortfolioTile()');
    this.addPortVisibility = false;
    // console.log(this.totalPortfolio);

    setTimeout(() => {
      const elmnt = document.getElementById(
        'card' + (this.totalPortfolio.length - 1)
      );
      elmnt.scrollIntoView({ behavior: 'smooth' });
    }, 500);

    this.afs.loadDropdownValues('Investment_Objective', 'CommonData');
  }

  removePortfolioTile(ind: number) {
    // console.log('Mode', this.totalPortfolio[ind].)
    this.totalPortfolio[ind].msg.visibility = false;
    this.totalPortfolio[ind].Message.visibility = false;
    if (this.totalPortfolio[ind].Mode.value === 'INSERT') {
      this.totalPortfolio.pop();
      // console.log(this.totalPortfolio);
      this.addPortVisibility = true;
      // const elmnt = document.getElementById('portfolioInfo');
      setTimeout(() => {
        const elmnt = document.getElementById('card0');
        elmnt.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } else {
      this.totalPortfolio[ind].removeVisibility.visibility = false;
    }
    // elmnt.scrollIntoView({ behavior: 'smooth' });
  }

  editPortfolioTile(index: number) {
    console.log(index);
    this.totalPortfolio[index].removeVisibility.visibility = true;
  }
  savePortfolioTile(ind: number) {
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    // let PortType;
    if (
      this.totalPortfolio[ind].PortfolioType.value === 'Share Margin Financing'
    ) {
      this.PortType = 'SMF';
    } else if (
      this.totalPortfolio[ind].PortfolioType.value === 'Cash Financing'
    ) {
      this.PortType = 'CUS';
    } else {
      this.PortType = 'LTV';
    }

    let fascilityCode = '';
    // let SaveMode = '';
    console.log('fascCoe', this.totalPortfolio[ind].fascDesc.value);
    console.log('fasc desc', this.totalPortfolio[ind].fascDesc.value === '');
    // if (this.totalPortfolio[ind].fascDesc.value === ''){
    //   this.SaveMode = 'INSERT';
    // }
    // else{
    //   this.SaveMode = 'UPDATE';
    // }
    if (this.totalPortfolio[ind].Mode.value === 'INSERT') {
      if (
        this.facDesc === '' ||
        this.facDesc === undefined ||
        this.facDesc === null
      ) {
        console.log('FacDesc is blank');
        // this.SaveMode = 'INSERT';

        this.index = 1;
        fascilityCode = this.FCode + '-S-' + this.PortType + '-' + this.index;
      } else {
        console.log('FCode is blank');
        // this.SaveMode = 'INSERT';

        this.index = parseInt(this.facDesc.split('-')[3], 10) + 1;
        this.FCode = this.facDesc.split('-')[0];
        fascilityCode = this.FCode + '-S-' + this.PortType + '-' + this.index;
      }
    } else {
      console.log('UPDATE MODE');
      // SaveMode = 'UPDATE';
      fascilityCode = this.totalPortfolio[ind].fascDesc.value;
    }
    const capitalPosted = this.cfs.removeComma(
      this.totalPortfolio[ind].CapitalPosted.value
    );
    const FacLimit = this.cfs.removeComma(
      this.totalPortfolio[ind].LimitPosted.value
    );
    console.log(
      'Portfolio name saving',
      this.totalPortfolio[ind].PortfolioName.value
    );
    console.log('Limit Posted', FacLimit);
    const parameters = {
      PortfolioName: this.totalPortfolio[ind].PortfolioName.value,
      InvestmentObj: this.totalPortfolio[ind].InvestmentObjective.value,
      AutoPledgeFlag: this.totalPortfolio[ind].AutoPledge.value.toUpperCase(),
      Currency: this.totalPortfolio[ind].CapitalCurrency.value,
      CustomerID: this.CustomerID,
      LoginID: sessionStorage.getItem('Username'),
      facdesc: fascilityCode,
      LD_Facility_code: this.PortType,
      LD_FM_ID: '0', // this.totalPortfolio[ind - 1].LD_FM_ID.value,
      SysCode: '', // this.totalPortfolio[ind - 1].SysCode.value,
      CapitalPosted: capitalPosted,
      Fac_Limit: FacLimit,
      Mode: this.totalPortfolio[ind].Mode.value,
      Goal: this.totalPortfolio[ind].Goal.value,
      TargetGoal: this.totalPortfolio[ind].TargetGoal.value
    };
    // chitra added
    let flagName;
    // this.totalPortfolio.forEach(ele => {
    let i = 0;
    console.log('portfolioNames', this.portfolioNames);
    for (i = 0; i < this.portfolioNames.length; i++) {
      console.log(
        this.totalPortfolio[ind].PortfolioName.value,
        'and',
        this.portfolioNames[i]
      );
      if (
        this.portfolioNames[i] ===
        this.totalPortfolio[ind].PortfolioName.value &&
        this.totalPortfolio[ind].removeVisibility.visibility === false
      ) {
        console.log('Names matched');
        flagName = true;
        break;
      } else {
        console.log('not matched');
        flagName = false;
      }
    }
    //   console.log(this.totalPortfolio[ind].PortfolioName.value, 'and', this.totalPortfolio[i].PortfolioName.value)
    //   if ( === this.totalPortfolio[i].PortfolioName.value){
    //     flagName = true;
    //     break;
    //   }
    //   else{
    //     flagName = false;
    //   }
    // }
    console.log('flag', flagName);
    // chitra ended
    if (this.totalPortfolio[ind].PortfolioName.value === '') {
      this.totalPortfolio[ind].msg.visibility = true;
      this.totalPortfolio[ind].msg.value = 'Portfolio Name can not be blank';
      console.log(this.totalPortfolio[ind].msg.value);
    } else if (flagName === true) {
      this.totalPortfolio[ind].msg.visibility = true;
      this.totalPortfolio[ind].msg.value = 'Duplicate Portfolio Name';
    } else if (this.totalPortfolio[ind].CapitalPosted.value === '') {
      this.totalPortfolio[ind].msg.visibility = true;
      this.totalPortfolio[ind].msg.value = 'Capital Posted can not be blank';
    } else if (this.totalPortfolio[ind].PortfolioType.value === '') {
      this.totalPortfolio[ind].msg.visibility = true;
      this.totalPortfolio[ind].msg.value = 'Portfolio Type can not be blank';
    } else {
      this.totalPortfolio[ind].msg.value = '';
      this.totalPortfolio[ind].msg.visibility = false;
      this.afs.savePortfolio(parameters);
    }
    this.afs.SavePortfolioObserver.subscribe((res: any) => {
      console.log(res);
      if (res) {
        console.log(res);
        // console.log(res);
        if (res.Status) {
          // console.log('yes');
          this.totalPortfolio[ind].Message.value = 'Portfolio saved!';
          this.totalPortfolio[ind].Message.visibility = true;
          this.totalPortfolio[ind].addVisibility.visibility = true;
          this.totalPortfolio[ind].removeVisibility.visibility = false;
          const parameters = {
            RiskProfile: this.RiskProfile.toUpperCase(),
            InvestmentObj: this.totalPortfolio[ind].InvestmentObjective.value,
            PortfolioName: this.totalPortfolio[ind].PortfolioName.value,
            // RiskProfile: "Low",
            // InvestmentObj: "Growth of Capital"
          };
          this.portfolioData = [];
          this.afs.getPortfolioAllocation(parameters);
          this.afs.LoadPortfolio(this.CustomerID, 0);
          // this.router.navigate(['validateUser/6']);
        }
      }
    });
  }

  changeFascDesc(event, ind: number) {
    // console.log("changed");
    // console.log(event.target.value);
    // console.log(ind);
    let max = 0;
    let cnt_ltv = 1;
    let cnt_smf = 1;
    let cnt_cus = 1;
    this.fascility.forEach((ele) => {
      max = 0;
      if (ele.split('-')[2] === 'LTV') {
        cnt_ltv = parseInt(ele.split('-')[3]) + 1;
        // console.log('LTV');
        // console.log(parseInt(ele.split('-')[3]));
      } else if (ele.split('-')[2] === 'SMF') {
        cnt_smf = parseInt(ele.split('-')[3]) + 1;
        // console.log('SMF');
        // console.log(parseInt(ele.split('-')[3]));
      } else {
        cnt_cus = parseInt(ele.split('-')[3]) + 1;
        // console.log('CUS');
        // console.log(parseInt(ele.split('-')[3]));
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
    console.log('fasc desc', this.totalPortfolio[ind].fascDesc.value === '');
    // if (this.totalPortfolio[ind].fascDesc.value === ''){
    //   this.totalPortfolio[ind].SaveMode = 'INSERT';
    // }
    // else{
    //   this.totalPortfolio[ind].SaveMode = 'UPDATE';
    // }
    if (
      this.facDesc === '' ||
      this.facDesc === undefined ||
      this.facDesc === null
    ) {
      // console.log('facdesc is blank');
      this.totalPortfolio[ind].fascDesc.value =
        this.FCode + '-S-' + this.PortType + '-' + max.toString();
    } else {
      this.totalPortfolio[ind].fascDesc.value =
        this.facDesc.split('-')[0] +
        '-S-' +
        this.PortType +
        '-' +
        max.toString();
    }
    // console.log(this.totalPortfolio[ind].fascDesc.value);
  }
  // chitra end on 21-July-2020

  SelectPieChartSlice(event) {
    const row = event.selection[0].row;
    // this.api.getCustPortfolioSecurityHoldings(this.Customerid, this.facilityCode[row]);
    // this.api.getCustPortfolioCashHoldings(this.Customerid, this.facilityCode[row]);
    // this.api.getPortfolioPerformanceDetails(this.Customerid, this.facilityCode[row]);
    // this.api.getPnlAllPortfoliosWorst(this.Customerid, this.facilityCode[row]);
    // this.api.getPnlAllPortfoliosBest(this.Customerid, this.facilityCode[row]);
  }

  passwordOverride() {
    this.isChangePassword = true;
  }
  overrideCancelled() {
    this.isChangePassword = false;
  }

  viewdoc() {
    // this.afs.DownloadFile('Dealer4');
  }
  eventChange(event, i) {
    this.docUploadDD[i] = event.target.value;
  }
  showFile(DGTID) {
    const noteMasterID = sessionStorage.getItem('NoteMasterID');
    const Link =
      'http://' + AppConfig.settings.interfaceURL + '/FinIQService/RMWorkstation_JSON.svc/Get_Uploaded_Documents_API/' +
      noteMasterID +
      '/' +
      DGTID;

    window.open(Link);
  }

  register() {
    this.SuccessMsg = '';
    this.ReadOnlyMode = true;
    if (this.validateInputs()) {
      let group = '';
      // if (this.userType.toLowerCase() === "client") {
      group = 'OnlineBanking';
      // } else if (this.userType.toLowerCase() === "rm") {
      //   group = "RM";
      // }
      this.loginApi
        .RegisterUser(
          this.username1,
          this.emailid1,
          this.password1,
          // '192.168.0.1',
          '',//Changed by SandipA for Internal IP Address Disclosure @05-Sep-23 
          // 'FINIQNSK82',
          '',
          'WINDOWS',
          group,
          this.authorApi.EntityID
        )
        .subscribe((res) => {
          if (res.Status) {
            console.log(res.Status);
            switch (res.Status) {
              case 1:
                console.log(res);
                this.isSuccess = true;
                this.loginApi.SendVerifyMail(this.username1).subscribe((mail) => {
                  if (mail.InsertEmailNotificationStatusResult === 'Success') {
                    this.SuccessMsg =
                      'User registeration successful. <br> Please check your email to complete the verification.';
                  }
                  console.log(mail);
                });
                break;
              case 2:
                console.log(res);
                this.isError = true;
                this.ErrorMsg =
                  'Registration Unsuccessful! ' + res.ResponseMessage;
                break;

              default:
                break;
            }
          }
        });
    }
  }
  validateInputs() {
    this.isSuccess = false;
    this.isError = false;
    if (
      this.username1 === '' ||
      this.password1 === '' ||
      this.confirmPassword1 === '' ||
      this.emailid1 === ''
    ) {
      this.isError = true;
      this.ErrorMsg = 'Please enter all the fields!';
      return false;
    }
    return true;
  }
  checkDuplicateUser() {
    console.log('username changed');
    this.loginApi.CheckDuplicateUser(this.username1, this.authorApi.EntityID).subscribe((res) => {
      console.log(res.Get_FINIQ_LOGIN_INFOResult[0].O_Message);
      if (res) {
        if (
          res.Get_FINIQ_LOGIN_INFOResult[0].O_Message ===
          'Login id already exists'
        ) {
          this.isDuplicateUser = true;
          this.isError = true;
          this.ErrorMsg = 'User Already Exists!';
        } else {
          this.isDuplicateUser = false;
          this.isError = false;
          this.ErrorMsg = '';
        }
      }
    });
  }

  confirPasswordKeyPressed() { }
  clearInputs() {
    this.username1 = '';
    this.password1 = '';
    this.emailid1 = '';
    this.confirmPassword1 = '';
    this.ReadOnlyMode = true;
    this.editProfileflag = false;
    this.PortfolioID = '';
    this.Account_Type = '';
    this.AccountInfo.BSB.value = '';
    this.AccountInfo.Account_Name.value = '';
    this.AccountInfo.Account_Number.value = '';
    this.AccountInfo.Currency = { value: '', visibility: false };
    this.AccountInfo.Payment_Frequency = { value: '', visibility: false };
    this.AccountInfo.Deposit_Amount = { value: '', visibility: false };
    this.BasicInfoNew.Name.value = '';
    this.BasicInfoNew.BlockHouseNo.value = '';
    this.BasicInfoNew.StreetName.value = '';
    this.BasicInfoNew.City.value = '';
    this.BasicInfoNew.State.value = '';
    this.BasicInfoNew.Country.value = '';
    this.BasicInfoNew.PostalCode.value = '';
    this.BasicInfoNew.HomePhoneNumber.value = '';
    this.BasicInfoNew.OfficePhoneNumber.value = '';
    this.BasicInfoNew.FaxNumber.value = '';
    this.BasicInfoNew.Email.value = '';
    this.BasicInfoNew.CIF.value = '';
    this.BasicInfoNew.CustomerIDType.value = '';
    this.BasicInfoNew.CustomerIDNumber.value = '';
    this.BasicInfoNew.AlternateDocID.value = '';
    this.BasicInfoNew.DateOfBirth.value = '';
    this.BasicInfoNew.CountryResidence.value = '';
    this.BasicInfoNew.Nationality.value = '';
    this.BasicInfoNew.CustomerType.value = '';
    this.BasicInfoNew.CustomerSegment.value = '';
    this.BasicInfoNew.Category.value = '';
    this.BasicInfoNew.ProfessionalInvestor.value = '';
    this.BasicInfoNew.LastKYCDoneOn.value = '';
    this.BasicInfoNew.PEPFlag.value = '';
  }

  getCustomerDetails(res) {
    if (res.length > 0) {
      console.log(res);
    }
  }
  selectCustomer(e) {
    try {
      const target: any = this.cfs.GetEventTarget(e);
      // const customer = $('.HoverSuggestion').data('customer');
      const customer = e.CustomerID;
      this.showSuggestions = false;
      this.afs.fngetCustAccountDetails(e.CustomerID);
    } catch (Error) {
      // console.log(Error);
    }
  }
  onClickedOutside(e: Event) {
    try {
      this.showSuggestions = false;
      // //console.log('Clicked outside:', e);
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  ChangeIndex(e) {
    try {
      this.selectedCustomerIndex = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
      // this.apifunction.log(4, Error, 'share-component.component.ts', 'ChangeIndex()');
    }
  }
  selectedCustomerValue1(e) {
    console.log(e);
    this.CustomerName = e.CustomerName;
  }
  ClearAll() {
    this.Summary = [];
    this.msg = '';
    this.buttonAction = '';
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
      this.totalPortfolio[this.SelectedIndexPortfolioForFinancialPlanning].TargetGoal.value = data.TargetGoal;
      this.totalPortfolio[this.SelectedIndexPortfolioForFinancialPlanning].TargetGoal.visibility = true;
    }

  }

  fnFixedDeposit(data){
  this.FixedDepositOverlayflag = false;
  }
  fnCashDeposit(data){
  this.CashDepositOverlayflag = false;
  }
}
