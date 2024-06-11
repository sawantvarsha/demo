import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomerApiService } from '../../../services/customer-api.service';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { HomeApiService } from '../../../services/home-api.service';

@Component({
  selector: 'app-customer-perform-kyc',
  templateUrl: './customer-perform-kyc.component.html',
  styleUrls: ['./customer-perform-kyc.component.scss']
})
export class CustomerPerformKycComponent implements OnInit, OnDestroy {
  isProd = environment.production;

  SectionHeaders = ['KYC Details'];
  MyProfileMode: boolean;
  isChangePassword: boolean;
  isPerformKYC: boolean;
  isSubmitDisabled: boolean;
  hideOrShowKYCVerification: boolean;

  MockForm: any;
  ErrorMsg: string;
  Username: string;
  Password: string;
  Authorization: string;
  Type: string;
  Email: string;
  CallbackURL: string;
  ImagePath: string;
  Service: string;
  ItemID: string;
  Task: string;
  AccessToken: string;
  EssentialNumber: string;
  EssentialName: string;
  EssentialFuzzy: string;
  SelectedDoc: string;
  RequiredDocs = ['Pan Card', 'Aadhar Card', 'Passport'];
  NotificationMes: string;
  PANCardNumber: string;
  PANCardName: string;
  AadharCardNumber: string;
  FileName: string;
  NoteMasterID: string;

  isClientKYCDone: string;

  files: NgxFileDropEntry[] = [];

  constructor(private CustApi: CustomerApiService, private HomeApi: HomeApiService) {
    this.MockForm = [];
    this.MyProfileMode = false;
    this.isChangePassword = false;
    this.isPerformKYC = false;
    this.isSubmitDisabled = true;
    this.hideOrShowKYCVerification = true;
    this.ErrorMsg = '';
    this.Username = '';
    this.Password = '';
    this.Authorization = '';
    this.Type = '';
    this.Email = '';
    this.CallbackURL = '';
    this.ImagePath = '';
    this.Service = '';
    this.ItemID = '';
    this.Task = '';
    this.AccessToken = '';
    this.EssentialNumber = '';
    this.EssentialName = '';
    this.EssentialFuzzy = '';
    this.SelectedDoc = 'Pan Card';
    this.NotificationMes = '';
    // this.PANCardNumber = 'BBQPM0796R';
    // this.PANCardName = 'Ashwin Jagannath Mhaisne';
    this.PANCardNumber = '';
    this.PANCardName = '';
    this.FileName = '';
    this.isClientKYCDone = '';
    this.NoteMasterID = '';
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this.DeAllocateVariables();
  }

  DeAllocateVariables() {
    this.NotificationMes = '';
    this.PANCardNumber = '';
    this.PANCardName = '';
    this.FileName = '';
  }

  ngOnInit(): void {
    // Load Default Values
    this.fnDefaultValues();

    // this.PANCardNumber = 'BBQPM0796R';
    // this.PANCardName = 'Ashwin Jagannath Mhaisne';

    this.fnAddClientInfoSectionValues();
    this.fnAddLoginInfoSectionValues();
    this.fnAddClassificationSectionValues();
    this.fnAddServiceSectionValues();
    this.fnAddExecutionMethodsSectionValues();
    this.fnAddFundingCurrencySectionValues();
    this.fnAddExecutionCurrencySectionValues();
    this.fnAddGeographyofAssetsSectionValues();
    this.fnAddProductEntitlementSectionValues();
    this.fnAddInvestmentNotionalSectionValues();
  }

  fnDefaultValues(): void {
    this.isClientKYCDone = sessionStorage.getItem('isClientKYCDone');
    this.Username = sessionStorage.getItem('Username');
    this.NoteMasterID = sessionStorage.getItem('NoteMasterID');
    this.Password = 'Z9KCTbse2dHTPgGkL5Cv';
    this.Authorization = 'LtugaGjRZxG4BJ8gKirqomwASc8tMfUwwrbLSVdUSg6raJ3dElAmqEIF7H8iGqSg';
    this.Type = 'individualPan';
    this.Email = 'prashant.m@finiq.com';
    this.CallbackURL = 'http://52.163.92.80/FinIQWebApp/FinIQAppLogin.aspx?ReturnUrl=%2ffiniqwebapp%2f';
    this.ImagePath = 'http://52.163.92.80/dataimg/Capture.PNG';
    this.Service = 'Identity';
    this.ItemID = '612f5aca53f5188cc08dd314';
    this.Task = 'verification';
    this.AccessToken = 'ud2w6md0g3dofm53qbj34jexx36ojkw3';
    this.EssentialNumber = 'AXHPA2987Q';
    this.EssentialName = 'PRASHANT SHRIDHARRAO MALEGAONKAR';
    this.EssentialFuzzy = 'true';
  }

  fnAddLoginInfoSectionValues() {
    let loggedAt: any = '';
    if (sessionStorage.getItem('LoggedAt')) {
      const loginTime = sessionStorage.getItem('LoggedAt');
      loggedAt = new Date(parseInt(loginTime.substring(6, loginTime.length - 7), 10));
    }
    // const LoginSectionKeys = [{ Key: 'Username', Value: this.LoginID }, { Key: 'Email ID', Value: sessionStorage.getItem('EmailID') }, { Key: 'Password', Value: '********' }, { Key: 'Last Login time', Value: this.homeApi.LastUpdatedOn }];
    const LoginSectionKeys = [{ Key: 'Username', Value: sessionStorage.getItem('CustomerName') }, { Key: 'Email ID', Value: sessionStorage.getItem('EmailID') }, { Key: 'Password', Value: '********' }, { Key: 'Last Login time', Value: loggedAt }];

    LoginSectionKeys.forEach(obj => {
      this.MockForm.push({
        sectionName: 'Login Info',
        controlName: obj.Key,
        controlType: 'label',
        valueType: 'string',
        validators: {
          required: true,
          maxlength: 50
        },
        selectedValue: obj.Value
      });
    });
  }
  fnAddClientInfoSectionValues() {
    let loggedAt: any = '';
    if (sessionStorage.getItem('LoggedAt')) {
      const loginTime = sessionStorage.getItem('LoggedAt');
      loggedAt = new Date(parseInt(loginTime.substring(6, loginTime.length - 7), 10));
    }
    // const LoginSectionKeys = [{ Key: 'Username', Value: this.LoginID }, { Key: 'Email ID', Value: sessionStorage.getItem('EmailID') }, { Key: 'Password', Value: '********' }, { Key: 'Last Login time', Value: this.homeApi.LastUpdatedOn }];
    const ClientInfoSectionKeys = [{ Key: 'Client Name', Value: sessionStorage.getItem('CustomerName') }, { Key: 'Client ID', Value: sessionStorage.getItem('CustomerID') }, { Key: 'Client Email', Value: sessionStorage.getItem('EmailID') }, { Key: 'Last KYC Done At', Value: this.HomeApi.KYCUpdatedOn }, { Key: 'Next KYC Due On', Value: loggedAt }, { Key: 'KYC Status', Value: this.isClientKYCDone ? 'Valid' : 'Invalid' }];

    ClientInfoSectionKeys.forEach(obj => {
      this.MockForm.push({
        sectionName: 'KYC Details',
        controlName: obj.Key,
        controlType: 'label',
        valueType: 'string',
        validators: {
          required: true,
          maxlength: 50
        },
        selectedValue: obj.Value
      });
    });
    // const ClientInfoSectionKeys = [{ Key: 'Client Name', Value: 'Divya Jyoti Patra' }, { Key: 'Client Contact', Value: '+91-9845678965' }, { Key: 'Client Email', Value: 'divyajyoti.p@finiq.com' }, { Key: 'Client tel', Value: '+61-132610' }, { Key: 'Client Ref No', Value: 'CRN1222306114425315NN' }];

    // ClientInfoSectionKeys.forEach(obj => {
    //   this.MockForm.push({
    //     sectionName: 'KYC Details',
    //     controlName: obj.Key,
    //     controlType: 'label',
    //     valueType: 'string',
    //     validators: {
    //       required: true,
    //       maxlength: 50
    //     },
    //     selectedValue: obj.Value
    //   });
    // });
  }
  fnAddClassificationSectionValues() {
    const ClassificationSectionKeys = [{ Key: 'Classification', Value: 'Corporate' }];
    ClassificationSectionKeys.forEach(obj => {
      this.MockForm.push({
        sectionName: 'Classification',
        controlName: obj.Key,
        controlType: 'label',
        valueType: 'string',
        validators: {
          required: true,
          maxlength: 50
        },
        selectedValue: obj.Value
      });
    });
  }
  fnAddServiceSectionValues() {
    const ServiceSectionKeys = [{ Key: 'Execution', Value: 'Y' }, { Key: 'Advisory', Value: 'Y' }];
    ServiceSectionKeys.forEach(obj => {
      this.MockForm.push({
        sectionName: 'Service',
        controlName: obj.Key,
        controlType: 'label',
        valueType: 'string',
        validators: {
          required: true,
          maxlength: 50
        },
        selectedValue: obj.Value
      });
    });
  }
  fnAddExecutionMethodsSectionValues() {
    const ExecutionMethodsSectionKeys = [{ Key: 'Execution Methods', Value: 'Platform' }];
    ExecutionMethodsSectionKeys.forEach(obj => {
      this.MockForm.push({
        sectionName: 'Execution Methods',
        controlName: obj.Key,
        controlType: 'label',
        valueType: 'string',
        validators: {
          required: true,
          maxlength: 50
        },
        selectedValue: obj.Value
      });
    });
  }
  fnAddFundingCurrencySectionValues() {
    const FundingCurrencySectionKeys = [{ Key: 'Funding Currency', Value: 'AED | EUR | USD' }];
    FundingCurrencySectionKeys.forEach(obj => {
      this.MockForm.push({
        sectionName: 'Funding Currency',
        controlName: obj.Key,
        controlType: 'label',
        valueType: 'string',
        validators: {
          required: true,
          maxlength: 50
        },
        selectedValue: obj.Value
      });
    });
  }
  fnAddExecutionCurrencySectionValues() {
    const ExecutionCurrencySectionKeys = [{ Key: 'Execution Currency', Value: 'USD' }];
    ExecutionCurrencySectionKeys.forEach(obj => {
      this.MockForm.push({
        sectionName: 'Execution Currency',
        controlName: obj.Key,
        controlType: 'label',
        valueType: 'string',
        validators: {
          required: true,
          maxlength: 50
        },
        selectedValue: obj.Value
      });
    });
  }
  fnAddGeographyofAssetsSectionValues() {
    const ExecutionCurrencySectionKeys = [{ Key: 'Geography of Assets', Value: 'Asia | Europe' }];
    ExecutionCurrencySectionKeys.forEach(obj => {
      this.MockForm.push({
        sectionName: 'Geography of Assets',
        controlName: obj.Key,
        controlType: 'label',
        valueType: 'string',
        validators: {
          required: true,
          maxlength: 50
        },
        selectedValue: obj.Value
      });
    });
  }
  fnAddProductEntitlementSectionValues() {
    const ProductEntitlementSectionKeys = [{ Key: 'Product Entitlement', Value: 'ETFs | FX | Money Market Funds' }];
    ProductEntitlementSectionKeys.forEach(obj => {
      this.MockForm.push({
        sectionName: 'Product Entitlement',
        controlName: obj.Key,
        controlType: 'label',
        valueType: 'string',
        validators: {
          required: true,
          maxlength: 50
        },
        selectedValue: obj.Value
      });
    });
  }
  fnAddInvestmentNotionalSectionValues() {
    const InvestmentNotionalSectionKeys = [{ Key: 'Maximum Amount to be invested', Value: '10,000,000.00' }];
    InvestmentNotionalSectionKeys.forEach(obj => {
      this.MockForm.push({
        sectionName: 'Investment Notional',
        controlName: obj.Key,
        controlType: 'label',
        valueType: 'string',
        validators: {
          required: true,
          maxlength: 50
        },
        selectedValue: obj.Value
      });
    });
  }

  fnPerformKYC() {
    this.isPerformKYC = true;
    setInterval(() => {
      let body = document.getElementsByTagName('body')[0];
      body.classList.remove("ngx-file-drop__drop-zone");   //remove the class

      // let elem: any = document.getElementById('iddropfilesinnerdiv');
      // elem.classList.remove('ngx-file-drop__drop-zone');
      // elem.setAttribute("style", "border: 3px dotted var(--grey) !important;");
    }, 1000);

    // elem.style.border = '3px dotted var(--grey)';

    // this.CustApi.fnDiagoKYCwithtemple().subscribe(res => {
    //   if (res) {
    //     console.log(res);
    //   }
    // });
  }

  fnGetSignzyAuthentication() {
    this.CustApi.fnSignzyAPILogin(this.Username, this.Password).subscribe(res => {
      if (res) {
        console.log(res);
      }
    })
  }
  fnGetSignzyIdentities() {
    this.CustApi.fnSignzyAPIIdentities(this.Authorization, this.Type, this.Email, this.CallbackURL, this.ImagePath).subscribe(res => {
      if (res) {
        console.log(res);
      }
    })
  }
  fnGetSignzySnoops() {
    this.CustApi.fnSignzyAPISnoops(this.Service, this.ItemID, this.Task, this.AccessToken, this.EssentialNumber, this.EssentialName, this.EssentialFuzzy).subscribe(res => {
      if (res) {
        console.log(res);
      }
    })
  }

  fnpasswordOverride() {
    this.isChangePassword = true;
  }

  fnoverrideCancelled() {
    this.isChangePassword = false;
  }

  fndropped(files: NgxFileDropEntry[]) {
    this.files = files;
    this.fnCheckSubmitbtn();
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          // console.log(droppedFile.relativePath, file);
          this.FileName = file.name;

          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)
  
          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })
  
          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  fnfileOver(event: any) {
    console.log(event);
  }

  fnfileLeave(event: any) {
    console.log(event);
  }

  fnCheckSubmitbtn() {
    this.isSubmitDisabled = false
  }

  fnSubmitPerformKYC() {
    switch (this.SelectedDoc) {
      case 'Pan Card':
        this.fnGetCustomerPANVerification();
        break;
      case 'Aadhar Card':
        this.fnGetCustomerAadharVerification();
        break;
      default:
        break;
    }
  }

  fnGetCustomerAadharVerification() {
    this.isSubmitDisabled = true;
    const dateToday = new Date();
    let timeStamp = '\/Date(' + this.epoch(dateToday) + '+0530)\/';
    this.CustApi.fnCustomerAadharVerfication(sessionStorage.getItem('HomeEntityID'), 'superuser1', this.AadharCardNumber, timeStamp).subscribe(res => {
      if (res) {
        // console.log(res);
        try {
          if (res.ErrorCode !== '') {
            if (JSON.parse(res.ResponseContent).error !== undefined) {
              this.isPerformKYC = false;
              // this.NotificationMes = JSON.parse(res.ResponseContent).error.message;
              this.NotificationMes = 'Please Enter Correct Number.';
            }
          } else {
            if (JSON.parse(res.ResponseContent).response.result.verified) {
              this.isPerformKYC = true;
              // this.NotificationMes = JSON.parse(res.ResponseContent).response.result.message;
              this.NotificationMes = 'Verification Done Successfully.';
              this.files = [];
              this.FileName = '';
            } else {
              this.isPerformKYC = false;
              // this.NotificationMes = JSON.parse(res.ResponseContent).response.result.message;
              this.NotificationMes = 'Please Enter Correct Number.';
            }
          }
        } catch (Ex) {

        }
        this.isSubmitDisabled = false;
      }
    });
  }

  fnGetCustomerPANVerification() {
    this.fnUploadDoc();
    this.isSubmitDisabled = true;
    const dateToday = new Date();
    let timeStamp = '\/Date(' + this.epoch(dateToday) + '+0530)\/';
    // this.CustApi.fnCustomerPANVerfication('PSagar', 'BBQPM0796R', 'Ashwin Jagannath Mhaisne', timeStamp).subscribe(res => {
    this.CustApi.fnCustomerPANVerfication(sessionStorage.getItem('HomeEntityID'), 'superuser1', this.PANCardNumber, this.PANCardName, timeStamp).subscribe(res => {
      if (res) {
        // console.log(res);
        try {
          if (res.ErrorCode !== '') {
            if (JSON.parse(res.ResponseContent).error !== undefined) {
              this.isPerformKYC = false;
              // this.NotificationMes = JSON.parse(res.ResponseContent).error.message;
              this.NotificationMes = 'Please Enter Correct Name and Number.';
            }
          } else {
            if (JSON.parse(res.ResponseContent).response.result.verified) {
              this.isPerformKYC = true;
              // this.NotificationMes = JSON.parse(res.ResponseContent).response.result.message;
              this.NotificationMes = 'Verification Done Successfully.';
              this.files = [];
              this.FileName = '';
            } else {
              this.isPerformKYC = false;
              // this.NotificationMes = JSON.parse(res.ResponseContent).response.result.message;
              this.NotificationMes = 'Please Enter Correct Name and Number.';
            }
          }
        } catch (Ex) {

        }
        this.isSubmitDisabled = false;
      }
    });
  }

  fnUploadDoc() {
    try {
      this.files.forEach((uploadfiledataobj) => {
        this.CustApi.AttachDocumentWTOObservable(
          this.Username,
          sessionStorage.getItem('HomeEntityID'),
          sessionStorage.getItem('HomeEntityName'),
          this.NoteMasterID,
          'CustomerDragDocs',
          uploadfiledataobj['relativePath'],
          uploadfiledataobj['FileDetails']
        ).subscribe((res: any) => {
          if (res) {
            console.log(res);
          }
        });
      });
      this.fnSubmitFiles();
    } catch (ex) {

    }
  }

  fnSubmitFiles() {
    this.files.forEach(filesObj => {
      if (filesObj) {
        filesObj['isUploaded'] = true;
      }
    });
  }

  fnResetKYCVerfication() {
    this.isPerformKYC = false;
    this.NotificationMes = '';

  }

  epoch(date: any) {
    return Date.parse(date)
  }

  fnRemoveSelectedFile(index) {
    this.files.splice(index, 1);
  }

}
