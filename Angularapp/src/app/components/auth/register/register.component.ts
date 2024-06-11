import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginApiService } from 'src/app/services/auth/login-api.service';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { CustomerCommonfunctionsService } from 'src/app/services/customer-commonfunctions.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { Subscription } from 'rxjs/internal/Subscription';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AppConfig } from 'src/app/services/config.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  domainURL = environment.domainURL;
  isProd = environment.production;
  loadflag: boolean;
  isError: boolean;
  username: string;
  password: string;
  emailid: string;
  confirmPassword: string;
  ErrorMsg: string;
  SuccessMsg: string;
  isSuccess: boolean;
  isPasswordText: boolean;
  isConfirmPasswordText: boolean;
  isDuplicateUser: boolean;
  barLabel = 'Password Strength:';
  userType: string;
  Message: string;
  AccountMessage: string;
  DocumentMessage: string;
  ErrorMessage: any;
  LoaderFlag: boolean;
  HomeEntityID: any;
  HomeEntityName: any;

  Summary = [];
  LoginUserDetails = [];

  customerType = [
    '',
    'Balanced',
    'Moderate',
    'Dynamic',
    'Aggressive',
    'Highly Aggressive',
  ];
  customerTypes = ['PP', 'IC', 'RC', '01', '04'];
  countryNames = [];
  dropdownValuesSubscription: Subscription;

  SaveCustomerDetailsSubscriber: Subscription;
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
  userID: any;
  EmailID: any;
  NotteMasterID: any;
  entityUser: any;
  CustomerID: any;
  ReadOnlyMode: boolean;
  editProfileflag: boolean;
  fileUploaded: number[] = [0];
  fileChosen: number[] = [0];
  uploadFileData: any[] = [];
  identificationTypes: [];
  legalEntties = [];
  dropdownTypes = [
    'Customer_type',
    'Country Long Name',
    'Identification_Type',
    'Legal Entity Type',
  ];
  docUploadDD = [];
  dropDownList = [] as any;
  eventList: any;
  bytedata: any[] = [];
  moreDetails = false;
  GetCSPEventsSubscription: Subscription;

  constructor(
    public loginApi: LoginApiService,
    public authApi: AuthGuardService,
    private ds: WorkflowApiService,
    public route: ActivatedRoute,
    public afs: CustomerApiService,
    public cfs: CustomerCommonfunctionsService,
    public router: Router,
    public authorApi: AuthService,
    public custApi: CustomerApiService,
  ) {
    this.loadflag = false;
    this.isError = false;
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.emailid = '';
    this.ErrorMsg = '';
    this.SuccessMsg = '';
    this.isSuccess = false;
    this.isPasswordText = false;
    this.isConfirmPasswordText = false;
  }
  ngOnDestroy(): void {
    this.GetCSPEventsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.emailid = '';

    this.GetCSPEventsSubscription = this.afs.GetCSPEvents().subscribe((res) => {
      if (res) {
        this.eventList = res;
        // console.log(this.eventList)
        this.dropDownData();
      }
    });

    this.custApi.isFirstCustomerLogin.next(true);
    this.route.params.subscribe((params: any) => {
      const casevalue: string = params.usertype;
      if (casevalue) {
        switch (casevalue.toUpperCase()) {
          case 'CLIENT':
            this.userType = casevalue;
            break;
          case 'RM':
            this.userType = casevalue;
            break;
          case 'EMPLOYER':
            this.userType = casevalue;
            break;

          default:
            this.router.navigate(['welcome']);
            break;
        }
      }

      // console.log(this.userType);
    });
  }

  register() {
    if (this.validateInputs()) {
      let group = '';
      if (this.userType.toLowerCase() === 'client') {
        group = 'OnlineBanking';
      } else if (this.userType.toLowerCase() === 'rm') {
        group = 'RM';
      }
      this.loginApi
        .RegisterUser(
          this.username,
          this.emailid,
          this.password,
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
            switch (res.Status) {
              case 1:
                // console.log(res);
                this.isSuccess = true;
                this.loginApi
                  .SendVerifyMail(this.username)
                  .subscribe((mail) => {
                    if (
                      mail.InsertEmailNotificationStatusResult === 'Success'
                    ) {
                      if (group === 'OnlineBanking') {
                        this.saveDetails('Insert');
                      } else {
                        this.ds.InsertRMGroupMapping(
                          this.username,
                          this.authorApi.EntityID
                        );
                      }
                      this.SuccessMsg =
                        'User registeration successful. <br> Please check your email to complete the verification.';
                    }

                    // console.log(mail);
                  });
                break;
              case 2:
                // console.log(res);
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
    // this.username = '';
    // this.password = '';
    // this.confirmPassword = '';
    // this.emailid = '';
  }
  validateInputs() {
    this.isSuccess = false;
    this.isError = false;
    if (
      this.username === '' ||
      this.password === '' ||
      this.confirmPassword === '' ||
      this.emailid === ''
    ) {
      this.isError = true;
      this.ErrorMsg = 'Please enter all the fields!';
      return false;
    }
    if (this.password !== this.confirmPassword) {
      this.isError = true;
      this.ErrorMsg = "Password don't match!";
      return false;
    }
    if (!this.validateEmail(this.emailid)) {
      this.isError = true;
      this.ErrorMsg = 'Please enter correct Email Id (emailid@finiq.com) !';
      return false;
    }
    return true;
  }
  checkDuplicateUser() {
    console.log('username changed');
    this.loginApi
      .CheckDuplicateUser(this.username, this.authorApi.EntityID)
      .subscribe((res) => {
        // console.log(res.Get_FINIQ_LOGIN_INFOResult[0].O_Message);
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

  dropDownData() {
    try {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.eventList.length; i++) {
        this.dropDownList.push(this.eventList[i].Event_Name);
      }
      this.docUploadDD[0] = this.dropDownList[0];
    } catch (error) {}
  }

  uploadDoc() {
    const username = this.username;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.uploadFileData.length; i++) {
      // console.log(username, HomeEntityID,        HomeEntityName, noteMasterID, this.uploadFileData[i].EventCode, this.uploadFileData[i].Name, this.uploadFileData[i].FileDetails);
      this.afs.AttachDocument(
        username,
        this.HomeEntityID,
        this.HomeEntityName,
        this.NotteMasterID,
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

  uploadtempDoc() {
    this.DocumentMessage = 'Document(s) Uploaded Successfully';
  }

  eventChange(event, i) {
    this.docUploadDD[i] = event.target.value;
  }

  selectFunctionDD() {
    if (this.fileUploaded[this.fileUploaded.length - 1] === 1) {
      this.fileUploaded.push(0);
      this.fileChosen.push(0);
    }
  }

  selectLastKYCDoneOn(date) {
    this.BasicInfoNew.LastKYCDoneOn.value = moment(date).format('DD-MMM-YYYY');
  }

  selectDateOfBirth(date) {
    this.BasicInfoNew.DateOfBirth.value = moment(date).format('DD-MMM-YYYY');
  }

  PrevBasicInfo() {
    this.ErrorMessage = '';
    this.ReadOnlyMode = true;
  }

  CancelEditProfile() {
    this.ReadOnlyMode = false;
    this.editProfileflag = true;
  }

  confirPasswordKeyPressed() {}

  saveDetails(Mode: string) {
    try {
      const jsonObj = {
        ExcelSheets: {
          Initial_Evaluation: {
            CSS_Login_ID: this.username,
            CSS_Email_ID: this.emailid,
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
            CSS_ProfessionalInvestor:
              this.BasicInfoNew.ProfessionalInvestor.value,
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
          this.username,
          'Initial_Evaluation',
          'Insert',
          0
        );
      } else {
        this.afs.saveNewOrder(
          jsonObj,
          this.username,
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
                // console.log(this.Message, res.SaveUCPResult[0].RowNumber === 1 && this.Message.length > 0);
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

                  this.afs
                    .getCommonDataEFX('CSP_Entity_Name')
                    .subscribe((res: any) => {
                      if (res.Get_Configurable_Common_DataResult.length !== 0) {
                        this.HomeEntityName =
                          res.Get_Configurable_Common_DataResult[0].DATA_VALUE;
                        this.HomeEntityID =
                          res.Get_Configurable_Common_DataResult[0].Misc1;
                        this.uploadDoc();
                      }
                    });
                  this.cfs.isCustomerCreated(true);
                  this.afs.fngetCustAccountDetails(this.username);
                  this.ds.Get_KYCFeedbackIDCheck(
                    AppConfig.settings.CSP_UpdateCIRPFormName,
                    this.username
                  );
                } else {
                  this.Message =
                    'Error while saving the record. Please try again or contact the system administrator.';
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
                } catch (Exception) {}
              }
            }
            this.LoaderFlag = false;
          }
        }
      );
    } catch (ex) {
      // console.log(ex);
      this.Message =
        'Error occurred while processing the request. Please contact the system administrator.';
    }
  }

  validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((finiq.com))$/;
    return re.test(email);
  }
  backtologin() {
    this.custApi.isFirstCustomerLogin.next(false);
    this.router.navigate(['/login' + this.userType.toLowerCase()]);
  }
}
