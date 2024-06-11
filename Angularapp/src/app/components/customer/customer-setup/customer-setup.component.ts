import { Customersetupformdata } from '../../../interfaces/customersetupformdata';
import { LoginApiService } from 'src/app/services/auth/login-api.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerApiService } from '../../../services/customer-api.service';
import { CommonfunctionService } from '../../../components/fx-order/commonfunction.service';
import { CommonApiService } from '../../../services/common-api.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerCommonfunctionsService } from '../../../services/customer-commonfunctions.service';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/services/config.service';
import { AuthService } from 'src/app/services/auth/auth.service';
// import * as $ from 'jquery';
import { DatePipe } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { LanguageService } from '../../langService/language.service';
declare var require: any;
const $: any = require('jquery');

declare global {
  interface Array<T> {
    sortBy(p): Array<T>;
  }
}

@Component({
  selector: 'app-customer-setup',
  templateUrl: './customer-setup.component.html',
  styleUrls: ['./customer-setup.component.scss'],
})
export class CustomerSetupComponent implements OnInit, OnDestroy {
  isProd = environment.production;

  pdfSRC: any;
  CompanyLogo: string;
  Mode: number;
  NavigatingFrom = ''; // FCL = From Client Login, FRML = From RM Login, FPFCL = From Partially Filled Client Login, FCLFUCPRA = From Client Login For CPRA
  // form: FormGroup;
  // formGroup = {};
  showprocess: boolean;
  IsKYCDoneAtSecStage = true;
  MockForm: Customersetupformdata[] = [];
  UserRegistrationSection: any[];
  PageMenu: any[];
  activePageName: any;
  WelcomeMsg = 'Loading...';
  activePageNumber = '1';
  PendingPageNumber = 1;
  ClientSetupFormfromService = [];
  SectionHeaders = [];
  expanded = false;
  JSONtoXMLObj: any = {};
  entityUser: any;
  Key: any;
  barLabel = 'Password Strength:';
  isError = false;
  Username: any;
  EmailID: any;
  ErrorMsg = '';
  isDuplicateUser = false;
  accountCreatedsuccessful = false;
  IsSidebarCollapsed = false;
  AccountMessage = '';
  SuccessMsg = '';
  NotteMasterID = '';
  Message = '';
  UserType = '';

  CustomerID: string;
  HomeEntityID: any;
  HomeEntityName: any;
  CreatingCustomer = false;
  sectionwiseSequenceNo = 1;
  serviceExecutionCompletionFlag = false;
  isProfileCreated = false;
  isClientKYCDone = false;
  isNewRegistration = true;
  isFormFilledFully = false;
  DisableNextbtn = false;
  ClientSetupProfileValues = [];
  docUploadDD = [];
  dropDownList = [] as any;
  eventList: any = [];
  fileUploaded: number[] = [0];
  fileChosen: number[] = [0];
  uploadFileData: any[] = [];
  bytedata: any[] = [];

  GetCustomerAccountDetailsSubscriber: Subscription;
  SaveCustomerDetailsSubscriber: Subscription;
  GetCSPEventsSubscription: Subscription;
  DetectSidebarcollapse: Subscription;
  IsUserRegister = false;
  isCollapseSidebar: boolean;
  isDemo: boolean;
  userType: any;
  ActionButtons = [
    {
      btnname: 'Prev',
      disabled: false,
      visibility: false,
    },
    {
      btnname: 'Save',
      disabled: false,
      visibility: false,
    },
    {
      btnname: 'Next',
      disabled: false,
      visibility: false,
    },
    {
      btnname: 'Submit',
      disabled: false,
      visibility: false,
    },
  ];
  OnlyUpdateCIRP = false;
  IsLoading = true;

  IsProfileRejected: boolean = false;
  IsProfileInfoServiceLoading: boolean = true;
  RejectedProfileNoteMasterID: string = '';
  RejectedProfileUsername: string = '';
  files: NgxFileDropEntry[] = [];
  DefaultFontSize: number = 16;
  DefaultControlLength: number = 100;
  ProcessingLoader: boolean = false;
  clienRiskAssessmentPageName: any;
  constructor(
    private datepipe: DatePipe,
    public afs: CustomerApiService,
    public loginApi: LoginApiService,
    public cfs: CommonfunctionService,
    public ccfs: CustomerCommonfunctionsService,
    public wfs: WorkflowApiService,
    private route: ActivatedRoute,
    public router: Router,
    public cmnapis: CommonApiService,
    public authorApi: AuthService,
    public custApi: CustomerApiService,
    public ref: ChangeDetectorRef,
    public languageApi: LanguageService
  ) {
    // this.form = new FormGroup({});
    this.showprocess = true;
    this.isCollapseSidebar = false;
    this.isDemo = AppConfig.settings.CSP_IsDemo;
    try {
      this.CompanyLogo = sessionStorage.getItem('CompanyLogo');
    } catch (EX) {
      this.CompanyLogo = 'SHC';
    }
  }

  ngOnInit(): void {
    this.cmnapis.companyLogoObserver.subscribe((res) => {
      if (res !== '' && res !== null && res !== undefined) {
        this.CompanyLogo = res;
      } else {
        this.CompanyLogo = 'SHC';
      }
    });

    this.IsKYCDoneAtSecStage = AppConfig.settings.CSP_IsKYCDoneAtSecStage;
    this.languageApi.translate.onDefaultLangChange.subscribe((res) => {
      console.log(res);
      this.ShowProcessContents(res); //
      this.activePageName = this.languageApi.translatePipe.transform(
        'User Registration',
        res
      );
    });
    this.activePageName = this.languageApi.translatePipe.transform(
      'User Registration',
      this.languageApi.translate.translations
    );
    this.ShowProcessContents(this.languageApi.translate.translations);
    this.route.params.subscribe((res) => {
      const routePath = res.NavigatingFrom;
      switch (routePath) {
        case 'FCLFUCPRA':
          this.isCollapseSidebar = true;
          // console.log(routePath);
          break;
        case 'FCL':
          this.custApi.isFirstCustomerLogin.next(true); // to hide slide show on FCL
          break;
        default:
          break;
      }
    });
    try {
      this.Mode = Number(this.route.snapshot.paramMap.get('Mode')); // 1: Edit Mode, 2: Edit with Values Mode, 3: Resumed form filling
      this.NavigatingFrom = this.route.snapshot.paramMap.get('NavigatingFrom');
    } catch {
      console.log('Error occured on Customer setup: Mode is', this.Mode);
    }
    this.ResetValues();

    try {
      this.entityUser = sessionStorage.getItem('Username');
      this.RejectedProfileUsername = sessionStorage.getItem('Username');
      this.CustomerID = sessionStorage.getItem('CustomerID');
      this.UserType = sessionStorage.getItem('UserType');
    } catch (ex) {
      console.log('Error in Customer setup: ', ex);
    }

    this.DetectSidebarcollapse = this.cmnapis.hideMenuObs.subscribe((res) => {
      if (res) {
        this.IsSidebarCollapsed = true;
      } else {
        this.IsSidebarCollapsed = false;
      }
    });

    this.GetCSPEventsSubscription = this.afs.GetCSPEvents().subscribe((res) => {
      if (res) {
        this.eventList = res;
        // console.log(this.eventList)
        this.DocUploaddropDownData();
        this.fnLoadFormandMode();
      }
    });

    this.SaveCustomerDetailsSubscriber = this.afs.SaveOrder.subscribe((res) => {
      if (res) {
        if (res.SaveUCPResult) {
          this.Message = res.SaveUCPResult[0].SavingMessage;
          if (this.Message !== null && this.Message !== '') {
            if (
              res.SaveUCPResult[0].RowNumber === 1 &&
              this.Message.length > 0
            ) {
              this.NotteMasterID = res.SaveUCPResult[0].NoteMasterID;
              this.Message = 'Ref ID ' + this.NotteMasterID;
              this.fnSaveForFuture();
              this.AccountMessage = 'Account Created Successfully';
              this.afs
                .getCommonDataEFX('CSP_Entity_Name')
                .subscribe((enty: any) => {
                  if (enty.Get_Configurable_Common_DataResult.length !== 0) {
                    this.HomeEntityName =
                      enty.Get_Configurable_Common_DataResult[0].DATA_VALUE;
                    this.HomeEntityID =
                      enty.Get_Configurable_Common_DataResult[0].Misc1;
                    this.uploadDoc();
                  }
                });
              this.ccfs.isCustomerCreated(true);
              this.SuccessMsg =
                'User registeration successful. <br> Please check your email to complete the verification.';
              this.ErrorMsg = '';
              if (this.NotteMasterID !== '' && this.CreatingCustomer) {
                // this.PageMenu[3].IsFilled = true;
                this.SetActivePage('Client Profile Verification');
              }
            } else {
              this.accountCreatedsuccessful = false;
              this.CreatingCustomer = false;
              this.Message =
                'Error while saving the record. Please try again or contact the system administrator.';
              this.SuccessMsg = '';
              this.isError = true;
              this.ErrorMsg = res.SaveUCPResult[0].WarningMessage;
              this.ErrorMsgVanish();
            }
          } else {
            this.accountCreatedsuccessful = false;
            this.CreatingCustomer = false;
            this.isError = true;
            this.ErrorMsg = res.SaveUCPResult[0].WarningMessage;
            this.ErrorMsgVanish();
            this.accountCreatedsuccessful = false;
            this.CreatingCustomer = false;
          }
          this.CreatingCustomer = false;
          this.ProcessingLoader = false;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.SaveCustomerDetailsSubscriber.unsubscribe();
    if (this.GetCustomerAccountDetailsSubscriber)
      this.GetCustomerAccountDetailsSubscriber.unsubscribe();
    this.afs.ClearObserverofFD();
  }

  fnLoadFormandMode(): void {
    try {
      if (
        this.UserType !== '' &&
        this.UserType !== undefined &&
        this.UserType !== null
      ) {
        // if (this.UserType.toUpperCase() !== 'CLIENT') {
        //   this.NavigatingFrom = 'FPFCL';
        //   this.OnlyUpdateCIRP = false;
        // }
      }
    } catch (Ex) {}

    switch (this.NavigatingFrom) {
      case 'FCLFUCPRA':
        this.isProfileCreated = true;
        this.isNewRegistration = false;
        this.isClientKYCDone = false;
        this.OnlyUpdateCIRP = true;
        if (this.IsKYCDoneAtSecStage) {
          try {
            this.activePageName = this.PageMenu[1].pageName;
            this.PageMenu.forEach((element, index) => {
              if (this.PageMenu[1].pageName === element.pageName) {
                this.activePageNumber = (index + 1).toString();
                element.IsFilled = false;
              } else {
                element.IsFilled = true;
              }
            });
          } catch (ex) {}
        } else {
          this.SetActivePage(this.PageMenu[5].pageName);
        }
        this.IsLoading = false;
        break;
      default:
        switch (this.Mode) {
          case 1:
            this.AddUserRegistrationSection();
            this.fnGetCustomerSetupForm(0);
            break;
          case 2:
            const EditModeUserID = sessionStorage.getItem('EditProfile');
            this.afs.fngetCustAccountDetails(EditModeUserID);
            this.afs.getCustAccountDetails
              .subscribe((res) => {
                if (res.length !== 0) {
                  try {
                    this.ClientSetupProfileValues = res;
                    this.MockForm = [];
                    this.fnGetCustomerSetupForm(0);
                  } catch (Exception) {
                    console.log('Error occured in filling customer details.');
                  }
                } else {
                  // this.IsLoading = false;
                  // this.ErrorMsg = 'No records found here';
                }
              })
              .unsubscribe();
            break;
          case 3:
            // Checking the profile is created or not If Yes then check KYC Is done or not
            this.afs
              .isCustProfileCreated(this.entityUser, '', '')
              .subscribe(async (custRes) => {
                // console.log('Profile', custRes);
                if (
                  !custRes.status &&
                  custRes.message === 'No record(s) found'
                ) {
                  this.isProfileCreated = false;
                  sessionStorage.setItem('isClientKYCDone', 'false');
                  sessionStorage.setItem(
                    'isProfileCreated',
                    this.isProfileCreated.toString()
                  );
                } else if (custRes.length !== 0) {
                  this.isProfileCreated = true;
                  // console.log(custRes[0].CustomerID);
                  if (!this.IsKYCDoneAtSecStage) {
                    await this.afs
                      .isKYCDone(
                        AppConfig.settings.CSP_UpdateCIRPFormName,
                        custRes[0].CustomerID
                      )
                      .then((kycRes) => {
                        // console.log('KYC', kycRes);
                        // sessionStorage.setItem('isProfileCreated', this.isProfileCreated.toString());
                        sessionStorage.setItem('UserType', 'Client');
                        sessionStorage.setItem(
                          'isProfileCreated',
                          this.isProfileCreated.toString()
                        );
                        if (JSON.parse(kycRes)) {
                          this.userType = 'CLIENT';
                          sessionStorage.setItem('UserType', this.userType);
                          sessionStorage.setItem('isClientKYCDone', kycRes);
                          // this.selectUserType();
                        } else {
                          this.userType = 'NEWUSER';
                          sessionStorage.setItem('UserType', this.userType);
                          sessionStorage.setItem('isClientKYCDone', kycRes);
                          // this.selectUserType();
                        }
                      })
                      .catch((err) => console.log(err));
                  } else {
                    // KYC Done at 2nd stage
                    this.userType = 'CLIENT';
                    sessionStorage.setItem('UserType', this.userType);
                    sessionStorage.setItem('isClientKYCDone', 'true');
                    // this.selectUserType();
                  }
                }
              });

            // this.toggleRegistration();
            this.IsUserRegister = true;
            this.isProfileCreated = JSON.parse(
              sessionStorage.getItem('isProfileCreated')
            );
            this.isClientKYCDone = JSON.parse(
              sessionStorage.getItem('isClientKYCDone')
            );

            if (this.isProfileCreated && !this.isClientKYCDone) {
              // profile is created but KYC Not
              this.isNewRegistration = false;
              if (this.IsKYCDoneAtSecStage) {
                // this.selectUserType();
              } else {
                this.SetActivePage(this.PageMenu[5].pageName);
              }

              this.afs.fngetCustAccountDetails(this.entityUser);
              this.GetCustomerAccountDetailsSubscriber =
                this.afs.getCustAccountDetails.subscribe((res) => {
                  if (res.length !== 0) {
                    try {
                      this.CustomerID = res.CustomerID;
                      if (this.CustomerID !== undefined) {
                        sessionStorage.setItem('CustomerID', this.CustomerID);
                        sessionStorage.setItem(
                          'CPRACustomerID',
                          this.CustomerID
                        );
                      }
                    } catch (ex) {}
                  }
                });
            } else if (!this.isProfileCreated && !this.isClientKYCDone) {
              // half form fill
              this.AddUserRegistrationSection();
              this.fnGetCustomerSetupForm(1);
            }

            break;
          default:
            this.AddUserRegistrationSection();
            this.fnGetCustomerSetupForm(0);
            break;
        }
        break;
    }
  }

  fnGetCustomerSetupForm(IsLoadedMode: number) {
    this.afs.getClientSetupForm().subscribe((res) => {
      // console.log(res);
      if (res) {
        this.ClientSetupFormfromService = [];
        // this.fnParseMetaData(this.dummyMetaData);
        this.fnParseMetaData(res);
        this.InitMockForm();
        if (IsLoadedMode === 1) {
          // Need to load form filling status after this
          this.fnLoadCurrerntFormFilling();
        } else if (IsLoadedMode === 0) {
          // console.log(this.MockForm);
          this.IsLoading = false;
        }

        // this.form = new FormGroup(this.formGroup);
      }
    });
  }

  fnParseMetaData(Inputdata) {
    // this.ClientSetupFormfromService = Inputdata.DB_Get_DataGridResult;
    const currLang = this.languageApi.translate.translations;
    this.ClientSetupFormfromService = Inputdata.DB_GetAPIDataResult;
    const onlyMisc1 = [];
    this.ClientSetupFormfromService.forEach((obj) => {
      onlyMisc1.push({ Key: obj.AHU_Misc1 });
      switch (obj.AHU_DataType) {
        case 'nvarchar':
          obj.AHU_DataType = 'text';
          break;
        case 'bigint':
          obj.AHU_DataType = 'number';
          break;
        case 'int':
          obj.AHU_DataType = 'number';
          break;
        case 'decimal':
          obj.AHU_DataType = 'numberdecimal';
          break;
        case 'money':
          obj.AHU_DataType = 'numberdecimal';
          break;
        default:
          break;
      }
      switch (obj.AHU_Control) {
        case 'Text':
          obj.AHU_Control = 'text';
          this.MockForm.push({
            tagName: obj.AHU_Misc1,
            sequenceNumber: Number(obj.AHU_Priority) + 4,
            sectionName: this.languageApi.translatePipe.transform(
              obj.AHU_Section,
              currLang
            ),
            controlName: this.languageApi.translatePipe.transform(
              obj.AHU_DisplayName,
              currLang
            ),
            controlType: obj.AHU_DataType, // AHU_Control
            valueType: obj.AHU_DataType,
            placeholder: 'Enter ' + obj.AHU_DisplayName,
            validators: {
              required: obj.AHU_MandatoryYN === 'Y' ? true : false,

              visibility: obj.AHU_DisplayYN === 'N' ? 'none' : '',
              disabled: false,
              IsBold: obj.AHU_Bold === 'Y' ? true : false,
              FontSize:
                obj.AHU_Font === '0'
                  ? this.DefaultFontSize + 'px'
                  : obj.AHU_Font + 'px',
              maxlength:
                obj.AHU_Length === '0'
                  ? this.DefaultControlLength
                  : Number(obj.AHU_Length),
              // mandatory: obj.AHU_MandatoryYN === 'Y' ? true : false
            },
            selectedValue: '',
            pageNumber:
              this.IsKYCDoneAtSecStage === true
                ? (Number(obj.Page_Number) + 1).toString()
                : obj.Page_Number,
          });
          break;
        case 'Drop Down':
          obj.AHU_Control = 'select';
          let dropdownValues = [];
          dropdownValues = (obj.AHU_PossibleValues + '').split(',');
          const optionsArray = [];
          dropdownValues.forEach((ddvalues) => {
            optionsArray.push({
              optionName: ddvalues,
              value: ddvalues,
            });
          });
          dropdownValues = this.sort_by_key(dropdownValues, 'optionName');
          this.MockForm.push({
            tagName: obj.AHU_Misc1,
            sequenceNumber: Number(obj.AHU_Priority) + 4,
            sectionName: this.languageApi.translatePipe.transform(
              obj.AHU_Section,
              currLang
            ),
            controlName: this.languageApi.translatePipe.transform(
              obj.AHU_DisplayName,
              currLang
            ),
            controlType: obj.AHU_Control,
            valueType: obj.AHU_DataType,
            placeholder: 'Choose ' + obj.AHU_DisplayName,
            options: optionsArray,
            validators: {
              required: obj.AHU_MandatoryYN === 'Y' ? true : false,
              disabled: false,
              visibility: obj.AHU_DisplayYN === 'N' ? 'none' : '',
              IsBold: obj.AHU_Bold === 'Y' ? true : false,
              FontSize:
                obj.AHU_Font === '0'
                  ? this.DefaultFontSize + 'px'
                  : obj.AHU_Font + 'px',
              maxlength:
                obj.AHU_Length === '0'
                  ? this.DefaultControlLength
                  : Number(obj.AHU_Length),
            },
            selectedValue: '',
            pageNumber:
              this.IsKYCDoneAtSecStage === true
                ? (Number(obj.Page_Number) + 1).toString()
                : obj.Page_Number,
          });
          break;
        case 'Multiselect':
          obj.AHU_Control = 'selectmultiple';
          let multipledropdownValues = [];
          multipledropdownValues = (obj.AHU_PossibleValues + '').split(',');
          const multipleoptionsArray = [];
          multipledropdownValues.forEach((ddvalues) => {
            multipleoptionsArray.push({
              optionName: ddvalues,
              value: ddvalues,
              Ischecked: false,
            });
          });
          // multipleoptionsArray = this.sort_by_key(multipleoptionsArray, 'optionName');
          this.MockForm.push({
            tagName: obj.AHU_Misc1,
            sequenceNumber: Number(obj.AHU_Priority) + 4,
            sectionName: this.languageApi.translatePipe.transform(
              obj.AHU_Section,
              currLang
            ),
            controlName: this.languageApi.translatePipe.transform(
              obj.AHU_DisplayName,
              currLang
            ),
            controlType: obj.AHU_Control,
            valueType: obj.AHU_DataType,
            placeholder: 'Choose ' + obj.AHU_DisplayName,
            options: multipleoptionsArray,
            validators: {
              required: obj.AHU_MandatoryYN === 'Y' ? true : false,
              visibility: obj.AHU_DisplayYN === 'N' ? 'none' : '',
              disabled: false,
              IsBold: obj.AHU_Bold === 'Y' ? true : false,
              FontSize:
                obj.AHU_Font === '0'
                  ? this.DefaultFontSize + 'px'
                  : obj.AHU_Font + 'px',
              maxlength:
                obj.AHU_Length === '0'
                  ? this.DefaultControlLength
                  : Number(obj.AHU_Length),
            },
            selectedValue: '',
            selectedValueArray: [],
            ShowMultiSelectPopup: false,
            pageNumber:
              this.IsKYCDoneAtSecStage === true
                ? (Number(obj.Page_Number) + 1).toString()
                : obj.Page_Number,
          });
          break;
        case 'Radio Button':
          obj.AHU_Control = 'radio';
          let radiogroupValues = [];
          radiogroupValues = (obj.AHU_PossibleValues + '').split(',');
          const radioGroupArray = [];
          radiogroupValues.forEach((ddvalues) => {
            radioGroupArray.push({
              optionName: ddvalues,
              value: ddvalues,
              Ischecked: false,
            });
          });
          this.MockForm.push({
            tagName: obj.AHU_Misc1,
            sequenceNumber: Number(obj.AHU_Priority) + 4,
            sectionName: this.languageApi.translatePipe.transform(
              obj.AHU_Section,
              currLang
            ),
            controlName: this.languageApi.translatePipe.transform(
              obj.AHU_DisplayName,
              currLang
            ),
            placeholder: 'Select ' + obj.AHU_DisplayName,
            controlType: obj.AHU_Control,
            options: radioGroupArray,
            validators: {
              required: obj.AHU_MandatoryYN === 'Y' ? true : false,
              visibility: obj.AHU_DisplayYN === 'N' ? 'none' : '',
              disabled: false,
              IsBold: obj.AHU_Bold === 'Y' ? true : false,
              FontSize:
                obj.AHU_Font === '0'
                  ? this.DefaultFontSize + 'px'
                  : obj.AHU_Font + 'px',
              maxlength:
                obj.AHU_Length === '0'
                  ? this.DefaultControlLength
                  : Number(obj.AHU_Length),
            },
            selectedValue: '',
            pageNumber:
              this.IsKYCDoneAtSecStage === true
                ? (Number(obj.Page_Number) + 1).toString()
                : obj.Page_Number,
            IsHorizontal: obj.AHU_Misc1 === 'Horizontal' ? true : false,
          });
          break;
        case 'Label':
          obj.AHU_Control = 'label';
          this.MockForm.push({
            tagName: obj.AHU_Misc1,
            sequenceNumber: Number(obj.AHU_Priority) + 4,
            sectionName: this.languageApi.translatePipe.transform(
              obj.AHU_Section,
              currLang
            ),
            controlName: obj.AHU_DefaultValue,
            controlType: obj.AHU_Control, // AHU_Control
            valueType: obj.AHU_DataType,
            placeholder: '',
            validators: {
              required: obj.AHU_MandatoryYN === 'Y' ? true : false,
              visibility: obj.AHU_DisplayYN === 'N' ? 'none' : '',
              disabled: false,
              IsBold: obj.AHU_Bold === 'Y' ? true : false,
              FontSize:
                obj.AHU_Font === '0'
                  ? this.DefaultFontSize + 'px'
                  : obj.AHU_Font + 'px',
              maxlength:
                obj.AHU_Length === '0'
                  ? this.DefaultControlLength
                  : Number(obj.AHU_Length),
            },
            selectedValue: '',
            pageNumber:
              this.IsKYCDoneAtSecStage === true
                ? (Number(obj.Page_Number) + 1).toString()
                : obj.Page_Number,
          });
          break;
        case 'Date':
          obj.AHU_Control = 'Date';
          this.MockForm.push({
            tagName: obj.AHU_Misc1,
            sequenceNumber: Number(obj.AHU_Priority) + 4,
            sectionName: this.languageApi.translatePipe.transform(
              obj.AHU_Section,
              currLang
            ),
            controlName: this.languageApi.translatePipe.transform(
              obj.AHU_DisplayName,
              currLang
            ),
            controlType: obj.AHU_Control, // AHU_Control
            valueType: obj.AHU_DataType,
            placeholder: '',
            validators: {
              required: obj.AHU_MandatoryYN === 'Y' ? true : false,
              visibility: obj.AHU_DisplayYN === 'N' ? 'none' : '',
              disabled: false,
              IsBold: obj.AHU_Bold === 'Y' ? true : false,
              FontSize:
                obj.AHU_Font === '0'
                  ? this.DefaultFontSize + 'px'
                  : obj.AHU_Font + 'px',
              maxlength:
                obj.AHU_Length === '0'
                  ? this.DefaultControlLength
                  : Number(obj.AHU_Length),
            },
            selectedValue: '',
            pageNumber:
              this.IsKYCDoneAtSecStage === true
                ? (Number(obj.Page_Number) + 1).toString()
                : obj.Page_Number,
          });
          break;

        case 'Document Upload':
          obj.AHU_Control = 'Document_Upload';
          let IsDocUploadDefaultValuePresentInDocUploadList = false;
          let DocUploadDefaultValueLabel = '';

          this.eventList.forEach((element) => {
            if (element.Event_Code === obj.AHU_DefaultValue) {
              IsDocUploadDefaultValuePresentInDocUploadList = true;
              DocUploadDefaultValueLabel = element.Event_Name;
            }
          });
          this.MockForm.push({
            tagName: obj.AHU_Misc1,
            sequenceNumber: Number(obj.AHU_Priority) + 4,
            sectionName: this.languageApi.translatePipe.transform(
              obj.AHU_Section,
              currLang
            ),
            controlName: obj.AHU_DefaultValue,
            controlType: obj.AHU_Control, // AHU_Control
            valueType: obj.AHU_DataType,
            placeholder: '',
            validators: {
              required: obj.AHU_MandatoryYN === 'Y' ? true : false,
              visibility: obj.AHU_DisplayYN === 'N' ? 'none' : '',
              IsBold: obj.AHU_Bold === 'Y' ? true : false,
              FontSize:
                obj.AHU_Font === '0'
                  ? this.DefaultFontSize + 'px'
                  : obj.AHU_Font + 'px',
              maxlength:
                obj.AHU_Length === '0'
                  ? this.DefaultControlLength
                  : Number(obj.AHU_Length),
            },
            selectedValue: '',
            pageNumber:
              this.IsKYCDoneAtSecStage === true
                ? (Number(obj.Page_Number) + 1).toString()
                : obj.Page_Number,
            DocUploadValue: IsDocUploadDefaultValuePresentInDocUploadList,
            docUploadValuelabel: DocUploadDefaultValueLabel,
            sectionwiseSequenceNo: this.sectionwiseSequenceNo++,
          });
          this.eventList.forEach((element) => {
            if (element.Event_Name === DocUploadDefaultValueLabel) {
              this.docUploadDD.push(element.Event_Code);
            }
          });
          break;
        case 'Text Area':
          obj.AHU_Control = 'Text_Area';
          // let Splittedarray = ('' + obj.AHU_DefaultValue).split('/');
          // Splittedarray.forEach(element => {
          //   obj.AHU_DefaultValue = element + '\n';
          // });
          this.MockForm.push({
            tagName: obj.AHU_Misc1,
            sequenceNumber: Number(obj.AHU_Priority) + 4,
            sectionName: this.languageApi.translatePipe.transform(
              obj.AHU_Section,
              currLang
            ),
            controlName: obj.AHU_DefaultValue,
            controlType: obj.AHU_Control, // AHU_Control
            valueType: obj.AHU_DataType,
            placeholder: '',
            validators: {
              required: obj.AHU_MandatoryYN === 'Y' ? true : false,
              visibility: obj.AHU_DisplayYN === 'N' ? 'none' : '',
              IsBold: obj.AHU_Bold === 'Y' ? true : false,
              FontSize:
                obj.AHU_Font === '0'
                  ? this.DefaultFontSize + 'px'
                  : obj.AHU_Font + 'px',
              maxlength:
                obj.AHU_Length === '0'
                  ? this.DefaultControlLength
                  : Number(obj.AHU_Length),
            },
            selectedValue: '',
            pageNumber:
              this.IsKYCDoneAtSecStage === true
                ? (Number(obj.Page_Number) + 1).toString()
                : obj.Page_Number,
          });
          break;
        case 'File Control':
          obj.AHU_Control = 'File_Control';
          this.fnGetTermsandConditionsFile(obj.AHU_DefaultValue);
          // this.MockForm.push({
          //   tagName: obj.AHU_Misc1,
          //   sequenceNumber: Number(obj.AHU_Priority) + 4,
          //   sectionName: this.languageApi.translatePipe.transform(obj.AHU_Section,currLang),
          //   controlName: '',
          //   controlType: obj.AHU_Control, // AHU_Control
          //   valueType: obj.AHU_DataType,
          //   placeholder: '',
          //   validators: {
          //     required: obj.AHU_MandatoryYN === 'Y' ? true : false,
          //     // minlength: 5,
          //     maxlength: obj.AHU_Length === '0' ? this.DefaultControlLength : Number(obj.AHU_Length),
          //   },
          //   selectedValue: '',
          //   pageNumber: this.IsKYCDoneAtSecStage === true ? (Number(obj.Page_Number) + 1).toString() : obj.Page_Number,
          //   Misc1: ''
          // });
          break;
        case 'Checkbox':
          try {
            obj.AHU_Control = 'checkbox'; // UN-Commented For Gateway by Ketan S on 7Dec to enabled text format of terms of bussiness
            // obj.AHU_Control = 'File_Control'; Commented For SHAPP by Ketan S on 7Dec to enabled text format of terms of bussiness
            let CheckboxValues = [];
            CheckboxValues = (obj.AHU_PossibleValues + '').split(',');
            const CheckboxArray = [];
            CheckboxValues.forEach((ddvalues) => {
              CheckboxArray.push({
                optionName: ddvalues,
                value: ddvalues,
                Ischecked: false,
              });
            });
            this.MockForm.push({
              tagName: obj.AHU_Misc1,
              sequenceNumber: Number(obj.AHU_Priority) + 4,
              sectionName: this.languageApi.translatePipe.transform(
                obj.AHU_Section,
                currLang
              ),
              controlName: this.languageApi.translatePipe.transform(
                obj.AHU_DisplayName,
                currLang
              ),
              placeholder: 'Select ' + obj.AHU_DisplayName,
              controlType: obj.AHU_Control,
              options: CheckboxArray,
              validators: {
                required: obj.AHU_MandatoryYN === 'Y' ? true : false,
                visibility: obj.AHU_DisplayYN === 'N' ? 'none' : '',
                IsBold: obj.AHU_Bold === 'Y' ? true : false,
                FontSize:
                  obj.AHU_Font === '0'
                    ? this.DefaultFontSize + 'px'
                    : obj.AHU_Font + 'px',
                maxlength:
                  obj.AHU_Length === '0'
                    ? this.DefaultControlLength
                    : Number(obj.AHU_Length),
              },
              selectedValue: '',
              pageNumber:
                this.IsKYCDoneAtSecStage === true
                  ? (Number(obj.Page_Number) + 1).toString()
                  : obj.Page_Number,
              IsHorizontal: obj.AHU_Misc1 === 'Horizontal' ? true : false,
              Misc1: 'I agree',
            });
          } catch (exception) {}
          break;
      }
    });
    this.fnParseStringforControlDisable();
    this.ClientSetupFormfromService.forEach((obj) => {
      // Added More Documents
      if (obj.AHU_Section === 'More Documents') {
        this.fnAddDragandDropControl(obj);
      }
    });
    console.log(this.MockForm);
  }

  fnLoadCurrerntFormFilling() {
    try {
      this.PageMenu.forEach((ele, index) => {
        if (index < Number(this.activePageNumber) - 1) {
          ele.IsFilled = true;
        }
      });
      this.IsProfileInfoServiceLoading = true;
      this.afs
        .GetClientSetupformSavedForFutureKetan(this.entityUser)
        .subscribe((res) => {
          if (res.GetDataResult !== '[]') {
            // console.log(res.GetDataResult);
            const serviceDataOBJ = JSON.parse(res.GetDataResult)[0];
            let IsProfileSubmitted = false;
            try {
              if (
                serviceDataOBJ.NoteMasterID !== '' &&
                serviceDataOBJ.NoteMasterID !== null &&
                serviceDataOBJ.NoteMasterID !== undefined
              ) {
                // Customer profile is submitted but not verifed itself
                IsProfileSubmitted = true;
                this.isNewRegistration = false;
                this.isProfileCreated = false;
                this.isClientKYCDone = false;
                this.RejectedProfileNoteMasterID = serviceDataOBJ.NoteMasterID;
                this.RejectedProfileUsername =
                  sessionStorage.getItem('Username');
                serviceDataOBJ.Rejected_YN === 'Y'
                  ? (this.IsProfileRejected = true)
                  : (this.IsProfileRejected = false);
                // Non-Rejected Profiles
                if (this.IsKYCDoneAtSecStage) {
                  this.SetActivePage(this.PageMenu[5].pageName);
                } else {
                  this.SetActivePage(this.PageMenu[4].pageName);
                }
              }
            } catch (ex) {}
            if (!IsProfileSubmitted) {
              // Checking profile is submitted or not
              const keyData = Object.keys(serviceDataOBJ);
              keyData.forEach((element, _i) => {
                if (element) {
                  this.MockForm.forEach((mockformelement) => {
                    if (mockformelement.tagName === element) {
                      mockformelement.selectedValue = serviceDataOBJ[element];
                      if (
                        mockformelement.controlType === 'selectmultiple' &&
                        mockformelement.selectedValue !== '' &&
                        mockformelement.selectedValue !== null
                      ) {
                        mockformelement.selectedValueArray =
                          mockformelement.selectedValue.split('~');
                        mockformelement.selectedValueArray.forEach(
                          (eleselectedValueArray) => {
                            mockformelement.options.forEach(
                              (eleOptions: any) => {
                                if (
                                  eleselectedValueArray === eleOptions.value
                                ) {
                                  eleOptions.Ischecked = true;
                                }
                              }
                            );
                          }
                        );
                        mockformelement.selectedValue =
                          mockformelement.selectedValue.split('~').join(' | ');
                      }
                      if (
                        mockformelement.controlType === 'radio' &&
                        mockformelement.selectedValue !== '' &&
                        mockformelement.selectedValue !== null
                      ) {
                        mockformelement.options.forEach((eleOptions: any) => {
                          if (
                            mockformelement.selectedValue === eleOptions.value
                          ) {
                            eleOptions.Ischecked = true;
                          }
                        });
                      }
                      // if (mockformelement.controlType === 'checkbox' && mockformelement.selectedValue !== '' && mockformelement.selectedValue !== null) {
                      if (
                        mockformelement.controlType === 'File_Control' &&
                        mockformelement.Misc1 === 'I agree' &&
                        mockformelement.selectedValue !== '' &&
                        mockformelement.selectedValue !== null
                      ) {
                        mockformelement.options.forEach((eleOptions: any) => {
                          if (
                            mockformelement.selectedValue === eleOptions.value
                          ) {
                            eleOptions.Ischecked = true;
                          }
                        });
                      }
                    }
                    if (
                      mockformelement.controlName === 'Client Risk Profile' &&
                      this.IsKYCDoneAtSecStage
                    ) {
                      try {
                        mockformelement.selectedValue =
                          serviceDataOBJ.RiskProfile[0].toUpperCase() +
                          serviceDataOBJ.RiskProfile.substring(1);
                      } catch (Ex) {}

                      // sessionStorage.setItem('RiskProfile',serviceDataOBJ.RiskProfile);
                      mockformelement.validators.disabled = true;
                    }
                  });
                }
              });

              this.sort_by_key(this.MockForm, 'pageNumber');
              // Updating form status
              let IsFormValueEmptyFound = false;
              this.MockForm.forEach((mockformelement) => {
                if (
                  mockformelement.controlName === 'Client Risk Profile' &&
                  (mockformelement.selectedValue === '' ||
                    mockformelement.selectedValue === null)
                ) {
                  this.isFormFilledFully = false;
                  IsFormValueEmptyFound = true;
                  this.isNewRegistration = true;
                  this.SetActivePage(this.PageMenu[1].pageName);
                }
              });
              if (!IsFormValueEmptyFound) {
                this.MockForm.forEach((mockformelement) => {
                  if (!IsFormValueEmptyFound) {
                    // check blank value found in form
                    if (
                      (mockformelement.selectedValue === '' ||
                        mockformelement.selectedValue === null) &&
                      mockformelement.pageNumber !== '1' &&
                      mockformelement.tagName !== ''
                    ) {
                      this.isFormFilledFully = false;
                      IsFormValueEmptyFound = true;
                      this.isNewRegistration = true;
                      this.SetActivePage(
                        this.PageMenu[Number(mockformelement.pageNumber) - 1]
                          .pageName
                      );
                    }
                  }
                });
              }

              // profile and KYC is not done
              if (!IsFormValueEmptyFound) {
                // Form is filled but profile verification and login authorization is pending
                // this.isNewRegistration = false; // commented temporary
                // this.isFormFilledFully = true;
                if (this.IsKYCDoneAtSecStage) {
                  this.SetActivePage(this.PageMenu[4].pageName);
                } else {
                  this.SetActivePage(this.PageMenu[3].pageName);
                }
              }
            }
            this.IsLoading = false;
          } else {
            // No data received
            this.SetActivePage(this.PageMenu[1].pageName);
          }
        });
    } catch (ex) {
      console.log(
        'Error generated in fnLoadCurrerntFormFilling function as:',
        ex
      );
    }
  }

  fnSwapJSONIndex(index_A, index_B) {
    const temp = this.MockForm[index_A];
    this.MockForm[index_A] = this.MockForm[index_B];
    this.MockForm[index_B] = temp;
  }

  fnFillValuesIntoForm() {
    this.MockForm.forEach((obj) => {
      try {
        if (obj.controlType === 'selectmultiple') {
          obj.selectedValueArray = (
            this.ClientSetupProfileValues[obj.tagName] + ''
          ).split('~');
        } else {
          obj.selectedValue = this.ClientSetupProfileValues[obj.tagName];
        }
      } catch (e) {}
    });
    // console.log(this.MockForm);
  }

  AddUserRegistrationSection() {
    this.UserRegistrationSection.forEach((ele, i) => {
      this.MockForm.push({
        sequenceNumber: i + 1,
        sectionName: ele.sectionName,
        controlName: ele.controlName,
        controlType: ele.controlType,
        valueType: ele.valueType,
        placeholder: ele.placeholder,
        validators: {
          required: true,
          // minlength: 5,
          maxlength: 30,
          spacesAllowed: ele.validators.spacesAllowed,
        },
        selectedValue: '',
        pageNumber: ele.Page_Number,
      });
    });
  }

  showCheckboxes(Controlname: any) {
    // if (Controlname.ShowMultiSelectPopup === true) {
    //   Controlname.ShowMultiSelectPopup = false;
    // } else {
    //   Controlname.ShowMultiSelectPopup = true;
    // }
    const checkboxes = document.getElementById(Controlname);
    if (checkboxes.style.display === 'none') {
      document.getElementById(Controlname).style.display = 'block';
      // this.expanded = true;
    } else {
      document.getElementById(Controlname).style.display = 'none';
      // this.expanded = false;
    }
    this.MockForm.forEach((obj) => {
      if (
        obj.controlType === 'selectmultiple' &&
        Controlname !== obj.controlName
      ) {
        document.getElementById(obj.controlName).style.display = 'none';
      }
    });
    // console.log(document.getElementById(Controlname).style.display);
  }
  ClosePopup(Controlname: any) {
    // var checkboxes = document.getElementById(Controlname);
    document.getElementById(Controlname).style.display = 'none';
    // console.log('Closed Pop up');
    // this.MockForm.forEach((obj) => {
    //   if (obj.controlType === 'selectmultiple' && document.getElementById(obj.controlName).style.display === 'block') {
    //     document.getElementById(obj.controlName).style.display = 'none';
    //   }
    // });
    // console.log('Clicked outside');
  }
  closeCheckboxes(Controlname: any) {
    document.getElementById(Controlname).style.display = 'none';
  }

  InitMockForm() {
    this.sort_by_key(this.MockForm, 'sequenceNumber');
    this.MockForm.forEach((formControl) => {
      // this.formGroup[formControl.controlName] = new FormControl('');

      // Define section names array
      if (this.SectionHeaders.length > 0) {
        let IsHeaderPresentInList = false;
        this.SectionHeaders.forEach((sectionHeaders) => {
          if (sectionHeaders.SectionName === formControl.sectionName) {
            IsHeaderPresentInList = true;
          }
        });
        if (!IsHeaderPresentInList) {
          this.SectionHeaders.push({
            SectionName: formControl.sectionName,
            pageNumber: formControl.pageNumber,
          });
        }
        // if (this.SectionHeaders[this.SectionHeaders.length - 1] !== formControl.sectionName) {

        // }
      } else {
        if (formControl.validators.visibility !== 'none')
          this.SectionHeaders.push({
            SectionName: formControl.sectionName,
            pageNumber: formControl.pageNumber,
          });
      }
    });
    // Rearrange the Terms and conditions text area and radio buttons
    let startingIndex = '';
    let swappingIndex = '';
    this.MockForm.forEach((ele, index) => {
      // if (startingIndex === '' && ele.controlType === 'checkbox' && ele.sectionName === 'Terms and Conditions') {
      if (
        startingIndex === '' &&
        ele.controlType === 'File_Control' &&
        ele.Misc1 === 'I agree' &&
        ele.sectionName === 'Terms and Conditions'
      ) {
        startingIndex = index.toString();
      }
      // if (swappingIndex === '' && ele.controlType === 'Text_Area' && ele.sectionName === 'Terms and Conditions') {
      //   swappingIndex = index.toString();
      // }
      if (
        swappingIndex === '' &&
        ele.controlType === 'File_Control' &&
        ele.sectionName === 'Terms and Conditions'
      ) {
        swappingIndex = index.toString();
      }
    });
    if (Number(startingIndex) < Number(swappingIndex)) {
      this.SwapJSONIndex(startingIndex, swappingIndex);
    }
    // End Rearrange the Terms and conditions text area and radio buttons
    if (this.Mode === 2) {
      this.fnFillValuesIntoForm();
    }
    // this.fnAddBirthDateControl();
  }

  saveDetails(saveMode: any) {
    try {
      this.ProcessingLoader = true;
      this.accountCreatedsuccessful = true;
      this.CreatingCustomer = true;
      this.JSONtoXMLObj = {
        ExcelSheets: {
          Initial_Evaluation: {},
        },
      };
      this.JSONtoXMLObj.ExcelSheets.Initial_Evaluation.CSS_Login_ID =
        this.entityUser; // Default insert CustomerID
      this.ClientSetupFormfromService.forEach((CSFObj, _i) => {
        if (CSFObj.AHU_Misc1 !== '') {
          this.Key = CSFObj.AHU_Misc1;
          this.MockForm.forEach((MockObj) => {
            if (MockObj.controlName === CSFObj.AHU_DisplayName) {
              if (CSFObj.AHU_Control === 'selectmultiple') {
                this.JSONtoXMLObj.ExcelSheets.Initial_Evaluation[this.Key] =
                  this.ArrayToString(MockObj.selectedValueArray);
              } else {
                this.JSONtoXMLObj.ExcelSheets.Initial_Evaluation[this.Key] =
                  MockObj.selectedValue.toString().replace('&', '&amp;');
              }
            }
          });
        }
      });

      this.afs.ClearObserversonValidateUserPage();

      if (saveMode === 'Insert') {
        this.afs.saveNewOrder(
          this.JSONtoXMLObj,
          this.entityUser,
          'Initial_Evaluation',
          'Insert',
          0
        );
      } else {
        this.afs.saveNewOrder(
          this.JSONtoXMLObj,
          this.entityUser,
          'Initial_Evaluation',
          'Update',
          Number(sessionStorage.getItem('NoteMasterID'))
        );
      }
    } catch (ex) {
      console.log(ex);
      // this.Message ='Error occurred while processing the request. Please contact the system administrator.';
    }
  }

  ArrayToString(RequestedArray: Array<{}>) {
    try {
      let ResponseString = '';
      RequestedArray.forEach((obj, i) => {
        if (i === 0) {
          ResponseString = obj + '';
        } else {
          ResponseString = ResponseString + '~' + obj;
        }
      });
      return ResponseString;
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  RemoveCheckBoxValue(item, inputField) {
    inputField.selectedValueArray.forEach((element, i) => {
      if (element === item) {
        inputField.selectedValueArray.splice(i, 1);
      }
    });
    if (
      inputField.selectedValue !== '' &&
      inputField.selectedValue.includes(',')
    ) {
      // Contains comma
      var SelectedSplittedArray = inputField.selectedValue.split(',');
      SelectedSplittedArray.forEach((element, i) => {
        if (element === item) {
          SelectedSplittedArray.splice(i, 1);
        }
      });
      inputField.selectedValue = '';
      SelectedSplittedArray.forEach((element, i) => {
        if (i === 0) {
          inputField.selectedValue = element;
        } else {
          inputField.selectedValue = inputField.selectedValue + ',' + element;
        }
      });
    } else {
      // Does not contain comma
      if (inputField.selectedValue === item) {
        inputField.selectedValue = '';
      }
    }

    inputField.options.forEach((element) => {
      if (element.value === item) {
        element.Ischecked = false;
      }
    });
  }

  CheckBoxValue(e, inputField) {
    try {
      const target: any = this.GetEventTarget(e);
      if (target.checked === true) {
        inputField.selectedValueArray.push(target.value);
        inputField.selectedValue =
          inputField.selectedValue + ',' + target.value;
      } else {
        inputField.selectedValueArray.forEach((element, i) => {
          if (element === target.value) {
            inputField.selectedValueArray.splice(i, 1);
          }
        });
        if (
          inputField.selectedValue !== '' &&
          inputField.selectedValue.includes(',')
        ) {
          // Contains comma
          var SelectedSplittedArray = inputField.selectedValue.split(',');
          SelectedSplittedArray.forEach((element, i) => {
            if (element === target.value) {
              SelectedSplittedArray.splice(i, 1);
            }
          });
          inputField.selectedValue = '';
          SelectedSplittedArray.forEach((element, i) => {
            if (i === 0) {
              inputField.selectedValue = element;
            } else {
              inputField.selectedValue =
                inputField.selectedValue + ',' + element;
            }
          });
        } else {
          // Does not contain comma
          if (inputField.selectedValue === target.value) {
            inputField.selectedValue = '';
          }
        }
      }
      inputField.selectedValueArray.sort();
    } catch (EX) {
      console.log(
        'Error occured in MultiSelect control while updating value in ts: ',
        EX
      );
    }
  }
  GetEventTarget(e): any {
    try {
      const target: any = e.target || e.srcElement || e.currentTarget || null;
      return target;
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  ClickOnLabelofCheckBox(input: any, SourceValue: string) {
    input.options.forEach((element) => {
      if (element.value === SourceValue) {
        if (element.Ischecked) {
          element.Ischecked = false;
          this.DisableNextbtn = true;
        } else {
          element.Ischecked = true;
          this.DisableNextbtn = false;
        }
        // element.Ischecked = true;
      } else {
        element.Ischecked = false;
        this.DisableNextbtn = true;
      }
      input.selectedValue = SourceValue;
    });
  }
  ClickOnLabelofRadiobutton(input: any, SourceValue: string, _e) {
    // const target: any = this.GetEventTarget(e);
    // target.value = SourceValue;
    input.options.forEach((element) => {
      if (element.value === SourceValue) {
        element.Ischecked = true;
      } else {
        element.Ischecked = false;
      }
    });
    input.selectedValue = SourceValue;
  }

  CreateCustomer(_CreateOnlyLogin: boolean) {
    // this.saveDetails('Insert');
    if (this.Mode === 1) {
      if (this.VerifyRequestBeforeSubmit()) {
        this.ProcessingLoader = true;
        this.loginApi
          .RegisterUser(
            this.MockForm[0].selectedValue,
            this.MockForm[1].selectedValue,
            this.MockForm[2].selectedValue,
            '52.187.114.119',
            'Stanhope',
            'WINDOWS',
            'OnlineBanking',
            this.authorApi.EntityID
          )
          .subscribe((res) => {
            if (res.Status) {
              switch (res.Status) {
                case 1:
                  this.loginApi
                    .SendVerifyMail(this.MockForm[0].selectedValue)
                    .subscribe((mail) => {
                      if (
                        mail.InsertEmailNotificationStatusResult === 'Success'
                      ) {
                        this.IsUserRegister = true;
                        this.isError = true;

                        this.ErrorMsg = res.ResponseMessage;
                        this.ErrorMsgVanish();
                        this.MockForm.forEach((element) => {
                          if (element.tagName === 'CSS_Email_ID') {
                            element.selectedValue =
                              this.MockForm[1].selectedValue;
                          }
                        });
                        this.CustomerID = this.MockForm[0].selectedValue;
                        this.entityUser = this.MockForm[0].selectedValue;
                        sessionStorage.setItem(
                          'TempCustomerID',
                          this.CustomerID
                        );
                        this.fnSaveForFuture();
                        // if (!CreateOnlyLogin) {
                        //   this.saveDetails('Insert');
                        // }
                        // this.SuccessMsg = 'User registeration successful. <br> Please check your email to complete the verification.';
                      }
                      // console.log(mail);
                    });
                  break;
                case 2:
                  this.isError = true;
                  this.ErrorMsg =
                    'Registration Unsuccessful! ' + res.ResponseMessage;
                  this.ErrorMsgVanish();
                  break;
                default:
                  break;
              }
            }
            this.ProcessingLoader = false;
          });
      }
    } else if (this.Mode === 2) {
      // if (this.VerifyRequestBeforeSubmit()) {
      this.saveDetails('Update');
      // }
    }
  }

  VerifyRequestBeforeSubmit() {
    if (
      this.MockForm[0].selectedValue === '' ||
      this.MockForm[2].selectedValue === '' ||
      this.MockForm[3].selectedValue === '' ||
      this.MockForm[1].selectedValue === ''
    ) {
      this.isError = true;
      this.ErrorMsg = 'Please enter all the Registration fields!';
      this.ErrorMsgVanish();
      return false;
    }
    if (this.MockForm[2].selectedValue !== this.MockForm[3].selectedValue) {
      this.isError = true;
      this.ErrorMsg = "Password don't match!";
      this.ErrorMsgVanish();
      return false;
    }
    if (!this.validateEmail(this.MockForm[1].selectedValue)) {
      this.isError = true;
      this.ErrorMsg = 'Please enter correct Email Id!';
      this.ErrorMsgVanish();
      return false;
    }

    return true;
  }

  validateEmail(email) {
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
  }

  ErrorMsgVanish() {
    const x = document.getElementById('snackbar');
    x.className = 'show';
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
    document.documentElement.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      x.className = x.className.replace('show', '');
      this.ErrorMsg = '';
      // this.isError = false;
    }, 3000);
  }

  hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  }

  checkDuplicateUser() {
    // if (this.hasWhiteSpace(this.MockForm[0].selectedValue)) {
    //   console.log('Contains white spaces');
    // }

    this.loginApi
      .CheckDuplicateUser(
        this.MockForm[0].selectedValue,
        this.authorApi.EntityID
      )
      .subscribe((res) => {
        if (res) {
          if (
            res.Get_FINIQ_LOGIN_INFOResult[0].O_Message ===
            'Login id already exists'
          ) {
            this.isDuplicateUser = true;
            this.isError = true;
            this.ErrorMsg = 'User Already Exists!';
            this.ErrorMsgVanish();
          } else {
            this.isDuplicateUser = false;
            this.isError = false;
            this.ErrorMsg = '';
          }
        }
      });
  }

  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      const x = a[key];
      const y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  ResetValues() {
    this.NotteMasterID = '';
    this.accountCreatedsuccessful = false;
    this.sectionwiseSequenceNo = 1;
  }

  fnChangePage(takeBackOrFrwd) {
    if (takeBackOrFrwd) {
      // frwd
      if (this.IsValidForward()) {
        this.PageMenu[Number(this.activePageNumber) - 1].IsFilled = true;
        this.activePageNumber = (Number(this.activePageNumber) + 1).toString();
        this.activePageName =
          this.PageMenu[Number(this.activePageNumber) - 1].pageName;
        if (
          this.PageMenu[Number(this.activePageNumber) - 2].pageName !==
          'Terms of Business'
        ) {
          this.fnSaveForFuture();
        }
      }
    } else {
      // Back
      if (Number(this.activePageNumber) > 2) {
        this.activePageNumber = (Number(this.activePageNumber) - 1).toString();
        this.activePageName =
          this.PageMenu[Number(this.activePageNumber) - 1].pageName;
      }
    }
    if (this.activePageName === 'Client Information') {
      // Scroll to top
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      window.scrollTo(0, 0);
    }
    if (this.activePageName === 'Terms of Business') {
      // Scroll to top
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      window.scrollTo(0, 0);
      // this.DisableNextbtn = true;
      // console.log('append');

      setTimeout(function () {
        $('.ng2-pdf-viewer-container').css('position', 'relative');
      }, 1000);

      // $( "<p>Test</p>" ).insertBefore( "#IAgreeButton" );
      // $("<pdf-viewer [src]="+SRC+" useBrowserLocale="+useBrowserLocale+" [original-size]="+originalSize+" [autoresize]="+autosize+"></pdf-viewer>").insertBefore('#IAgreeButton');

      // $( "<p>Test</p>" ).insertBefore( "#IAgreeButton" );
      // $('<div>hello</div>').insertBefore('#IAgreeButton');
      // $("<pdf-viewer [src]='../../assets/TC.pdf' useBrowserLocale='true' [original-size]='false' [autoresize]='true'></pdf-viewer>").insertBefore('#IAgreeButton');
    }
    try {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      document.getElementsByClassName('form-container')[0].scrollTo(0, 0);
      // console.log(this.MockForm);
    } catch (error) {}
  }
  toggleRegistration() {
    this.showprocess = !this.showprocess;
    if (this.isCollapseSidebar) {
      this.cmnapis.HideSidebar(true);
    }
  }
  DocUploaddropDownData() {
    try {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.eventList.length; i++) {
        this.dropDownList.push(this.eventList[i].Event_Name);
      }
      // this.docUploadDD[0] = this.dropDownList[0];
    } catch (error) {}
  }
  fileSelectionFunction(event: any, index: number) {
    let fileData: any;
    fileData = [];

    this.fileUploaded[this.fileUploaded.length - 1] = 1;
    fileData.Name = event.target.files[0].name;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.eventList.length; i++) {
      if (this.eventList[i].Event_Code === this.docUploadDD[index]) {
        fileData.EventCode = this.eventList[i].Event_Code;
        fileData.EventName = this.eventList[i].Event_Name;
      }
    }
    this.getByteArray(event.target.files[0])
      .then((byteArray) => {
        let jsonObject: any;
        jsonObject = { ImgData: byteArray };
        this.bytedata = jsonObject.ImgData;
        fileData.FileDetails = this.bytedata;
        this.uploadFileData.push(fileData);
      })
      .catch((err) => console.log(err));
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

  uploadDoc() {
    if (
      this.entityUser !== '' &&
      this.NotteMasterID !== '' &&
      this.NotteMasterID !== undefined &&
      this.NotteMasterID !== null
    ) {
      this.fnAddDraggedDoc();
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.uploadFileData.length; i++) {
        // console.log(username, HomeEntityID, HomeEntityName, noteMasterID, this.uploadFileData[i].EventCode, this.uploadFileData[i].Name, this.uploadFileData[i].FileDetails);
        this.afs.AttachDocument(
          this.entityUser,
          this.HomeEntityID,
          this.HomeEntityName,
          this.NotteMasterID,
          this.uploadFileData[i].EventCode,
          this.uploadFileData[i].Name,
          this.uploadFileData[i].FileDetails
        );
        this.afs.AttachDocumentsObservable.subscribe((res: any) => {
          if (res) {
            // this.Message = 'Document(s) Uploaded Successfully';
            this.isError = true;
            this.ErrorMsg = 'Document(s) Uploaded Successfully';
            this.ErrorMsgVanish();
          }
        });
      }
    } else {
    }
  }

  eventChange(event, i) {
    this.docUploadDD[i] = event.target.value;
  }
  IsValidForward() {
    let IsSelectedValueNullorBlank = false;
    this.isError = false;
    this.MockForm.forEach((element) => {
      if (Number(element.pageNumber) === Number(this.activePageNumber)) {
        // inside Active page
        // Applying Control type

        // if (element.validators.required === true && element.controlType === 'selectmultiple' && element.selectedValueArray.length === 0) {
        //   // check all the values are filled or not
        //   IsSelectedValueNullorBlank = true;
        //   this.isError = true;
        //   this.ErrorMsg = 'Please enter all the fields';
        //   this.ErrorMsgVanish();
        // } else

        if (
          element.validators.required === true &&
          element.selectedValue === ''
        ) {
          // check all the values are filled or not
          IsSelectedValueNullorBlank = true;
          this.isError = true;
          this.ErrorMsg = 'Please enter all the fields';
          this.ErrorMsgVanish();
        }
      }
    });
    if (IsSelectedValueNullorBlank) {
      return false;
    } else {
      switch (this.activePageNumber) {
        case '1':
          if (
            this.MockForm[2].selectedValue !== this.MockForm[3].selectedValue
          ) {
            this.isError = true;
            this.ErrorMsg = "Password don't match!";
            this.ErrorMsgVanish();
            return false;
          }
          if (!this.validateEmail(this.MockForm[1].selectedValue)) {
            this.isError = true;
            this.ErrorMsg =
              'Please enter correct Email Id (emailid@finiq.com) !';
            this.ErrorMsgVanish();
            return false;
          }
          break;
      }
    }
    if (this.isError === false) {
      return true;
    }
    this.ref.detectChanges();
  }
  ProceedToProfileVerfication() {
    // if (this.NotteMasterID !== '' && !this.CreatingCustomer) {
    this.PageMenu[3].IsFilled = true;
    this.isNewRegistration = false;
    this.isProfileCreated = false;
    this.isClientKYCDone = false;
    // }
    // this.PageMenu[Number(this.activePageNumber) - 1].IsFilled = true;
    this.activePageNumber = (Number(this.activePageNumber) + 1).toString();
    this.activePageName =
      this.PageMenu[Number(this.activePageNumber) - 1].pageName;
  }
  fnSaveForFuture() {
    if (this.activePageNumber === '1' && !this.IsUserRegister) {
      this.CreateCustomer(true);
    } else {
      const JSONToString: any = {};
      this.ClientSetupFormfromService.forEach((CSFObj, _i) => {
        if (CSFObj.AHU_Misc1 !== '') {
          this.Key = CSFObj.AHU_Misc1;
          this.MockForm.forEach((MockObj) => {
            if (MockObj.controlName === CSFObj.AHU_DisplayName) {
              if (CSFObj.AHU_Control === 'selectmultiple') {
                JSONToString[this.Key] = this.ArrayToString(
                  MockObj.selectedValueArray
                );
              } else {
                JSONToString[this.Key] = MockObj.selectedValue;
              }
            }
          });
          JSONToString.LoginId = this.entityUser;
          try {
            if (
              sessionStorage.getItem('AvgValue') !== undefined ||
              sessionStorage.getItem('AvgValue') !== null
            ) {
              JSONToString.AvgValue = sessionStorage.getItem('AvgValue');
            }
            if (
              sessionStorage.getItem('RiskProfile') !== undefined ||
              sessionStorage.getItem('RiskProfile') !== null
            ) {
              try {
                let RiskRating = sessionStorage.getItem('RiskProfile');
                JSONToString.RiskProfile =
                  RiskRating[0].toUpperCase() + RiskRating.substring(1);
              } catch (Ex) {}
            }
            if (
              sessionStorage.getItem('RiskRating') !== undefined ||
              sessionStorage.getItem('RiskRating') !== null
            ) {
              JSONToString.RiskRating = sessionStorage.getItem('RiskRating');
            }
          } catch (ex) {
            console.log(
              'Error occured while saving KYC Result in SetData service :',
              ex
            );
          }
          // if (this.uploadFileData.length > 0) {
          //   JSONToString['UploadDocumentData'] = this.uploadFileData;
          // }
          if (
            this.NotteMasterID !== '' &&
            this.NotteMasterID !== null &&
            this.NotteMasterID !== undefined
          ) {
            JSONToString.NoteMasterID = this.NotteMasterID;
          }
        }
      });
      this.afs
        .SetClientSetupformSavedForFuture(
          this.entityUser,
          JSON.stringify(JSONToString)
        )
        .subscribe((res) => {
          try {
            if (res.InsertJSONResult === true) {
              this.isError = true;
              this.ErrorMsg = 'Form saved successfully.';
              this.ErrorMsgVanish();
            } else {
              this.isError = true;
              this.ErrorMsg = 'Try again';
              this.ErrorMsgVanish();
            }
          } catch (exeception) {
            console.log(
              'Error occured while executing SetClientSetupFormSavedForFuture service: ' +
                exeception
            );
          }
        });
    }
  }
  IsKYCCompletedChangedHandler(IsKYCCompleted: boolean) {
    // this.Counter = count;
    // console.log(IsKYCCompleted);
    if (IsKYCCompleted) {
      this.PageMenu[Number(this.activePageNumber) - 1].IsFilled = true;
    }
  }
  MoveToNextPageFromCIRPComp(ValidMoveToNextPage: boolean) {
    try {
      // console.log('Event emmited from CIRP :', ValidMoveToNextPage);
      if (ValidMoveToNextPage) {
        this.fnChangePage(true);

        this.MockForm.forEach((element) => {
          if (element.controlName === 'Client Risk Profile') {
            let RiskRatingstr = sessionStorage.getItem('RiskProfile');
            element.selectedValue =
              RiskRatingstr[0].toUpperCase() + RiskRatingstr.substring(1);
            element.validators.disabled = true;
          }
          // if(element.controlName === 'Investment Risk Profile'){ // Commnted with confirmation from Harsh M
          //   switch(sessionStorage.getItem('RiskRating')){
          //     case ''
          //   }
          //   element.selectedValue = sessionStorage.getItem('RiskRating');
          //   element.validators.disabled = true;
          // }
        });
      }
    } catch (Ex) {}
  }
  logout() {
    let SessionToken: any = '';
    if (sessionStorage.getItem('Username')) {
      this.entityUser = sessionStorage.getItem('Username');
      SessionToken = sessionStorage.getItem('SessionToken');
    }
    this.afs.getCheckedMenu.next([]);
    // console.log(SessionToken);
    this.afs.getCustAccountDetailsObserver.next([]);
    this.afs.KYCriskRating.next({});
    // this.api.portfolio.next([]);
    this.loginApi
      .LogoutUser(this.entityUser, SessionToken, this.authorApi.EntityID)
      .subscribe((res) => {
        if (res) {
          // console.log(res);
          // this.themeService.setActiveTheme(dark);
          if (res.LoggedOut) {
            sessionStorage.clear();
            this.loginApi.allowAuth(false);
            this.router.navigate(['/welcome']);
          } else {
            // console.log('Logout Failed');
            sessionStorage.clear();
            this.loginApi.allowAuth(false);
            this.router.navigate(['/welcome']);
          }
        }
      });
  }
  SwapJSONIndex(firstIndex: any, secondIndex: any) {
    const JSONObjTemp = this.MockForm[firstIndex];
    this.MockForm[firstIndex] = this.MockForm[secondIndex];
    this.MockForm[secondIndex] = JSONObjTemp;
  }

  selectUserType() {
    switch (this.userType.toUpperCase()) {
      case 'CLIENT':
        this.router.navigate(['home' + this.Username]);
        break;
      case 'RM':
        this.router.navigate(['ClientOnboarding']);
        break;
      case 'EMPLOYER':
        this.router.navigate(['home' + this.Username]);
        break;
      case 'ADMIN':
        this.router.navigate(['Menu']);
        break;
      case 'NEWUSER':
        this.router.navigate(['customersetup/3/FPFCL']);
        break;
      default:
        this.router.navigate(['welcome']);
        break;
    }
  }

  ShowProcessContents(lang) {
    this.clienRiskAssessmentPageName = this.languageApi.translatePipe.transform(
      'Client Risk Assessment',
      lang
    );
    if (this.IsKYCDoneAtSecStage) {
      console.log(this.languageApi.selectedLanguage);
      this.PageMenu = [
        {
          pageName: this.languageApi.translatePipe.transform(
            'User Registration',
            lang
          ),
          IsFilled: false,
          imgSrc: 'assets/user.png',
          height: '60px',
          width: '60px',
        },
        {
          pageName: this.languageApi.translatePipe.transform(
            'Client Risk Assessment',
            lang
          ),
          IsFilled: false,
          imgSrc: 'assets/risk.png',
          height: '60px',
          width: '60px',
        },
        {
          pageName: this.languageApi.translatePipe.transform(
            'Client Information',
            lang
          ),
          IsFilled: false,
          imgSrc: 'assets/clientInfo.png',
          height: '60px',
          width: '60px',
        },
        {
          pageName: this.languageApi.translatePipe.transform(
            'Terms of Business',
            lang
          ),
          IsFilled: false,
          imgSrc: 'assets/terms.png',
          height: '60px',
          width: '60px',
        },
        {
          pageName: this.languageApi.translatePipe.transform(
            'Required Documents',
            lang
          ),
          IsFilled: false,
          imgSrc: 'assets/documentupload.png',
          height: '60px',
          width: '60px',
        },
        {
          pageName: this.languageApi.translatePipe.transform(
            'Client Profile Verification',
            lang
          ),
          IsFilled: false,
          imgSrc: 'assets/pendingverification.png',
          height: '60px',
          width: '60px',
        },
      ];
    } else {
      this.PageMenu = [
        {
          pageName: this.languageApi.translatePipe.transform(
            'User Registration',
            lang
          ),
          IsFilled: false,
          imgSrc: 'assets/user.png',
          height: '60px',
          width: '60px',
        },
        {
          pageName: this.languageApi.translatePipe.transform(
            'Client Information',
            lang
          ),
          IsFilled: false,
          imgSrc: 'assets/clientInfo.png',
          height: '60px',
          width: '60px',
        },
        {
          pageName: this.languageApi.translatePipe.transform(
            'Terms of Business',
            lang
          ),
          IsFilled: false,
          imgSrc: 'assets/terms.png',
          height: '60px',
          width: '60px',
        },
        {
          pageName: this.languageApi.translatePipe.transform(
            'Required Documents',
            lang
          ),
          IsFilled: false,
          imgSrc: 'assets/documentupload.png',
          height: '60px',
          width: '60px',
        },
        {
          pageName: this.languageApi.translatePipe.transform(
            'Client Profile Verification',
            lang
          ),
          IsFilled: false,
          imgSrc: 'assets/pendingverification.png',
          height: '60px',
          width: '60px',
        },
        {
          pageName: this.languageApi.translatePipe.transform(
            'Client Risk Assessment',
            lang
          ),
          IsFilled: false,
          imgSrc: 'assets/risk.png',
          height: '60px',
          width: '60px',
        },
      ];
    }

    this.UserRegistrationSection = [
      {
        sectionName: this.languageApi.translatePipe.transform(
          'User Registration',
          lang
        ),
        controlName: this.languageApi.translatePipe.transform('Username', lang),
        controlType: 'text',
        valueType: 'text',
        placeholder: this.languageApi.translatePipe.transform(
          'Enter Username',
          lang
        ),
        validators: {
          required: true,
          spacesAllowed: false,
        },
        Page_Number: '1',
      },
      {
        sectionName: this.languageApi.translatePipe.transform(
          'User Registration',
          lang
        ),
        controlName: this.languageApi.translatePipe.transform(
          'Email address',
          lang
        ),
        controlType: 'text',
        valueType: 'email',
        placeholder: this.languageApi.translatePipe.transform(
          'Enter Email address',
          lang
        ),
        validators: {
          required: true,
          spacesAllowed: false,
        },
        Page_Number: '1',
      },
      {
        sectionName: this.languageApi.translatePipe.transform(
          'User Registration',
          lang
        ),
        controlName: this.languageApi.translatePipe.transform('Password', lang),
        controlType: 'text',
        valueType: 'password',
        placeholder: this.languageApi.translatePipe.transform(
          'Enter Password',
          lang
        ),
        validators: {
          required: true,
          spacesAllowed: false,
        },
        Page_Number: '1',
      },
      {
        sectionName: this.languageApi.translatePipe.transform(
          'User Registration',
          lang
        ),
        controlName: this.languageApi.translatePipe.transform(
          'Confirm Password',
          lang
        ),
        controlType: 'text',
        valueType: 'password',
        placeholder: this.languageApi.translatePipe.transform(
          'Re-Enter Password',
          lang
        ),
        validators: {
          required: true,
          spacesAllowed: false,
        },
        Page_Number: '1',
      },
    ];
  }
  SetActivePage(pageName) {
    let IsActivePageFound = false;
    this.activePageName = pageName;

    this.PageMenu.forEach((element, index) => {
      if (pageName === element.pageName) {
        this.activePageNumber = (index + 1).toString();
        element.IsFilled = false;
        IsActivePageFound = true;
      } else {
        if (IsActivePageFound !== true) {
          element.IsFilled = true;
        } else {
          element.IsFilled = false;
        }
      }
    });
  }

  PushDataIntoMockForm(
    _tagName,
    _sequenceNumber,
    _sectionName,
    _controlName,
    _placeholder,
    _controlType,
    _options: any,
    _validators_required,
    _selectedValue,
    _pageNumber,
    _IsHorizontal
  ) {
    // this.MockForm.push({
    //   tagName: obj.AHU_Misc1,
    //   sequenceNumber: Number(obj.AHU_Priority) + 4,
    //   sectionName: obj.AHU_Section,
    //   controlName: obj.AHU_DisplayName,
    //   placeholder: 'Select ' + obj.AHU_DisplayName,
    //   controlType: obj.AHU_Control,
    //   options: CheckboxArray,
    //   validators: {
    //     required: obj.AHU_MandatoryYN === 'Y' ? true : false,
    //   },
    //   selectedValue: '',
    //   pageNumber: this.IsKYCDoneAtSecStage === true ? (Number(obj.Page_Number) + 1).toString() : obj.Page_Number,
    //   IsHorizontal: obj.AHU_Misc1 === 'Horizontal' ? true : false,
    // });
  }

  // ConvertBase64ToByteArray(base64String) {
  //   const blob = new Blob([this._base64ToArrayBuffer(base64String)], { type: 'application/pdf' });
  //   const url: any = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  //   console.log(url.changingThisBreaksApplicationSecurity);
  //   return url.changingThisBreaksApplicationSecurity;
  // }
  // _base64ToArrayBuffer(base64) {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  //   const binary_string = this.document.defaultView.atob(base64);
  //   const len = binary_string.length;
  //   const bytes = new Uint8Array(len);
  //   for (let i = 0; i < len; i++) {
  //     bytes[i] = binary_string.charCodeAt(i);
  //   }
  //   return bytes.buffer;
  // }
  fnGetTermsandConditionsFile(pdfPath) {
    this.pdfSRC = {
      url:
        'http://' +
        environment.domainURL +
        pdfPath
          .replaceAll('\\\\', '/')
          .replace('F:', '')
          .replaceAll(' ', '%20'),
      withCredentials: true,
    };
    console.log(this.pdfSRC);
    // this.ref.detectChanges();
  }
  // ViewActionsButtons() {
  //   if (this.IsKYCDoneAtSecStage) {
  //     if (this.activePageNumber){

  //     }
  //   } else {

  //   }
  // }
  // fnButtonClick(btnName: string) {
  //   switch (btnName) {
  //     case this.ActionButtons[0].btnname:
  //       // Prev
  //       this.fnChangePage(false);
  //       break;
  //     case this.ActionButtons[1].btnname:
  //       // next
  //       this.fnChangePage(true);
  //       this.fnSaveForFuture();
  //       break;
  //     case this.ActionButtons[2].btnname:
  //       // save
  //       this.fnSaveForFuture();
  //       break;
  //     case this.ActionButtons[3].btnname:
  //       // submit
  //       this.saveDetails('Insert');
  //       break;
  //     default:
  //       break;
  //   }
  // }
  routeToWelcome() {
    this.custApi.isFirstCustomerLogin.next(false);
    this.router.navigate(['welcome']);
  }

  fnToggleRejectionFlag(flag) {
    // this.IsProfileRejected ? this.IsProfileRejected = false : this.IsProfileRejected = true;
    this.IsProfileRejected = flag;
  }

  fncamelCase(name) {
    try {
      var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
      var MOZ_HACK_REGEXP = /^moz([A-Z])/;
      return name
        .replace(
          SPECIAL_CHARS_REGEXP,
          function (_, _separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
          }
        )
        .replace(MOZ_HACK_REGEXP, 'Moz$1');
    } catch (Ex) {}
  }
  fnAddBirthDateControl() {
    this.MockForm.push({
      tagName: '',
      sequenceNumber: 6,
      sectionName: 'Client Info',
      controlName: 'Date Of Birth',
      controlType: 'DOB',
      valueType: 'date',
      placeholder: 'Choose Date Of Birth',
      validators: {
        required: false,
        disabled: false,
      },
      selectedValue: '',
      pageNumber: this.IsKYCDoneAtSecStage === true ? '3' : '2',
    });
  }
  fnSetDOB(inputDate) {
    return this.datepipe.transform(inputDate, 'dd-MMM-yyyy');
  }

  fnAddDragandDropControl(obj) {
    this.MockForm.push({
      tagName: '',
      sequenceNumber: 6,
      sectionName: obj.AHU_Section,
      controlName: 'Drag and Drop',
      controlType: 'Drag and Drop', // AHU_Control
      valueType: '',
      validators: {
        required: false,
        visibility: obj.AHU_DisplayYN === 'N' ? 'none' : '',
      },
      selectedValue: '',
      pageNumber:
        this.IsKYCDoneAtSecStage === true
          ? (Number(obj.Page_Number) + 1).toString()
          : obj.Page_Number,
    });
  }

  fndropped(files: NgxFileDropEntry[]) {
    this.files = files;
    this.files.forEach((filesObj) => {
      if (filesObj) {
        filesObj['isUploaded'] = false;
      }
    });
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          // console.log(droppedFile.relativePath, file);
          this.getByteArray(file)
            .then((byteArray) => {
              let jsonObject: any;
              jsonObject = { ImgData: byteArray };
              this.bytedata = jsonObject.ImgData;
              droppedFile['FileDetails'] = this.bytedata;
            })
            .catch((err) => console.log(err));

          // this.FileName = file.name;
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }
    // console.log(this.files);
  }

  fnSubmitFiles() {
    this.files.forEach((filesObj) => {
      if (filesObj) {
        filesObj['isUploaded'] = true;
      }
    });
  }

  fnRemoveSelectedFile(index) {
    this.files.splice(index, 1);
  }

  fnfileOver(event: any) {
    console.log(event);
  }

  fnfileLeave(event: any) {
    console.log(event);
  }

  fnAddDraggedDoc() {
    try {
      this.files.forEach((uploadfiledataobj, _i) => {
        uploadfiledataobj['Name'] = uploadfiledataobj.relativePath;
        uploadfiledataobj['EventCode'] = 'CustomerDragDocs';
        uploadfiledataobj['EventName'] = 'CustomerDragDocs';
        this.uploadFileData.push(uploadfiledataobj);
      });

      // this.afs.AttachDocumentWTOObservable(
      //   this.Username,
      //   sessionStorage.getItem('HomeEntityID'),
      //   sessionStorage.getItem('HomeEntityName'),
      //   this.NotteMasterID,
      //   'CustomerDragDocs',
      //   uploadfiledataobj['relativePath'],
      //   uploadfiledataobj['FileDetails']
      // ).subscribe((res: any) => {
      //   if (res) {
      //     console.log(res);
      //   }
      // });

      // this.fnSubmitFiles();
    } catch (ex) {}
  }
  // fnDropDownChange(){
  //   this.MockForm.forEach(res=>{
  //     if()
  //   });
  // }
  fnParseStringforControlDisable() {
    let SplittedConditions = []; // Handled multiple Conditions
    let SplittedCondition = []; // Handle Single Condition

    this.ClientSetupFormfromService.forEach((clientsetupformObj, _index) => {
      if (clientsetupformObj.AHU_Misc2 !== '') {
        if (clientsetupformObj.AHU_Misc2.includes(',')) {
          SplittedConditions = clientsetupformObj.AHU_Misc2.split(',');
          let IsValueMatched: boolean = false;
          SplittedConditions.forEach((condition) => {
            SplittedCondition = condition.split('=');

            this.MockForm.forEach((res) => {
              if (
                res.tagName === SplittedCondition[0].replace(/ /g, '') &&
                res.selectedValue === SplittedCondition[1].replace(/ /g, '')
              ) {
                IsValueMatched = true;
              }
            });
            if (IsValueMatched) {
              // clientsetupformObj.validators.disabled = true;
              this.MockForm.forEach((res) => {
                if (res.tagName === clientsetupformObj.AHU_Misc1) {
                  res.validators.disabled = true;
                } else {
                  res.validators.disabled = false;
                }
              });
              return;
            } else {
              this.MockForm.forEach((res) => {
                if (res.tagName === clientsetupformObj.AHU_Misc1) {
                  res.validators.disabled = false;
                }
              });
            }
            // IsValueMatched = false;
          });
        } else {
          try {
            SplittedCondition = clientsetupformObj.AHU_Misc2.split('=');
            let IsValueMatched: boolean = false;
            this.MockForm.forEach((res) => {
              if (
                res.tagName === SplittedCondition[0].replace(/ /g, '') &&
                res.selectedValue === SplittedCondition[1].replace(/ /g, '')
              ) {
                IsValueMatched = true;
              }
            });
            if (IsValueMatched) {
              // clientsetupformObj.validators.disabled = true;
              this.MockForm.forEach((res) => {
                if (res.tagName === clientsetupformObj.AHU_Misc1) {
                  res.validators.disabled = true;
                } else {
                  res.validators.disabled = false;
                }
              });
            } else {
              this.MockForm.forEach((res) => {
                if (res.tagName === clientsetupformObj.AHU_Misc1) {
                  res.validators.disabled = false;
                }
              });
            }
            // IsValueMatched = false;
          } catch (Ex) {
            console.log(
              'Error occured while splitting the misc1 condition',
              Ex
            );
          }
        }
      }
    });
    // console.log(this.MockForm);
  }

  fnExit() {
    if (sessionStorage.getItem('UserType') !== 'RM') {
      this.logout();
    } else {
      this.router.navigate(['/ClientSummary']);
    }
  }
}
