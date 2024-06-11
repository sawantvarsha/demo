import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomerApiService } from '../../../services/customer-api.service';
import { LoginApiService } from 'src/app/services/auth/login-api.service';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-setup-resubmit-rejected-client',
  templateUrl: './customer-setup-resubmit-rejected-client.component.html',
  styleUrls: ['./customer-setup-resubmit-rejected-client.component.scss']
})
export class CustomerSetupResubmitRejectedClientComponent implements OnInit, OnDestroy {

  @Input() LoginID: any;
  @Input() NoteMasterID: any;
  @Output() BacktoClientSetup = new EventEmitter<any>();
  isProd = environment.production;
  domainURL = environment.domainURL;
  // LoginID: string = '';
  // NoteMasterID: string = '';
  RMComment: string;
  ClientComment: string;
  entityUser: string;
  AdditionalDocHeader: string;

  fileUploaded: number[] = [0];
  fileChosen: number[] = [0];
  uploadFileData: any[] = [];
  bytedata: any[] = [];
  docUploadDD = [];
  dropDownList = [] as any;
  AdditionalDocList: any[] = [];
  eventList: any = [];
  UploadingDocs: any = [];
  Msg: string = '';
  ViewProfilFlag: boolean;
  SuccesMsg: string;

  showLanding: boolean;
  showProfile: boolean;
  AttachDocumentSubscriber: Subscription;
  GetCSPEventsSubscription: Subscription;
  ErrorMsg: string;
  isError: boolean;

  constructor(public CustApi: CustomerApiService, public loginApi: LoginApiService, public router: Router, public authorApi: AuthService, private workflowApi: WorkflowApiService,) {
    this.showLanding = true;
    this.showProfile = false;
    this.ViewProfilFlag = true;
    this.RMComment = 'Customer details incomplete';
    this.ClientComment = '';
    this.AdditionalDocHeader = 'Additional Documents';
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this.SuccesMsg = '';
    if (this.AttachDocumentSubscriber) this.AttachDocumentSubscriber.unsubscribe();
    if (this.GetCSPEventsSubscription) this.GetCSPEventsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    // console.log(this.LoginID, this.NoteMasterID);
    this.SuccesMsg = '';
    this.entityUser = sessionStorage.getItem('Username');
    // Get all Events
    this.GetCSPEventsSubscription = this.CustApi.GetCSPEvents().subscribe((res) => {
      if (res) {
        this.eventList = res;
        this.fnDocUploaddropDownData();
      }
    });
  }

  fnReSubmissionProcess() {
    this.showLanding = false;
  }

  fnlogout() {
    let SessionToken: any = '';
    if (sessionStorage.getItem('Username')) {
      this.entityUser = sessionStorage.getItem('Username');
      SessionToken = sessionStorage.getItem('SessionToken');
    }
    this.CustApi.getCheckedMenu.next([]);
    this.CustApi.getCustAccountDetailsObserver.next([]);
    this.CustApi.KYCriskRating.next({});
    // this.api.portfolio.next([]);
    this.loginApi.LogoutUser(this.entityUser, SessionToken, this.authorApi.EntityID).subscribe(res => {
      if (res) {
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

  fneventChange(event, i) {
    this.UploadingDocs[i] = event.target.value;
  }

  fnfileSelectionFunction(event: any, index: number) {
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
    this.getByteArray(event.target.files[0]).then((byteArray) => {
      let jsonObject: any;
      jsonObject = { ImgData: byteArray };
      this.bytedata = jsonObject.ImgData;
      fileData.FileDetails = this.bytedata;
      this.uploadFileData.push(fileData);
    }).catch(err => console.log(err));
    // console.log(this.uploadFileData);
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

  fnuploadDoc(Index: number) {
    if (this.LoginID !== '' && this.NoteMasterID !== '' && this.NoteMasterID !== undefined && this.NoteMasterID !== null) {
      this.CustApi.AttachDocument(this.LoginID, sessionStorage.getItem('HomeEntityID'), sessionStorage.getItem('HomeEntityName'), this.NoteMasterID, this.uploadFileData[Index].EventCode, this.uploadFileData[Index].Name, this.uploadFileData[Index].FileDetails);
      this.AttachDocumentSubscriber = this.CustApi.AttachDocumentsObservable.subscribe((res: any) => {
        if (res) {
          const noteMasterID = sessionStorage.getItem('NoteMasterID');
          this.workflowApi.ResetkGetFactSheetData();
          this.workflowApi.ProductAttachmentList(noteMasterID);
          // this.ErrorMsg = this.uploadFileData[Index].Name + ' Uploaded Successfully';
          // this.ErrorMsgVanish();
        }
      });
    } else {
    }
  }

  fnremoveDocFromList(index) {
    // console.log(index);
    this.UploadingDocs.splice(index, 1);
  }

  fnAddDocinUploadingDocList() {
    // if(this.UploadingDocs.lenght() <= this.eventList.length()){
    this.UploadingDocs.push({ SequenceNo: 1 });
    // }
  }
  fnDocUploaddropDownData() {
    try {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.eventList.length; i++) {
        this.dropDownList.push(this.eventList[i].Event_Name);
      }
      this.docUploadDD[0] = this.eventList[0].Event_Code;
    } catch (error) { }
  }
  fnSubmit() {
    if (this.ClientComment !== '') {
      const JSONToString: any = {};
      // this.ClientSetupFormfromService.forEach((CSFObj, i) => {
      //   if (CSFObj.AHU_Misc1 !== '') {
      //     this.Key = CSFObj.AHU_Misc1;
      //     this.MockForm.forEach((MockObj) => {
      //       if (MockObj.controlName === CSFObj.AHU_DisplayName) {
      //         if (CSFObj.AHU_Control === 'selectmultiple') {
      //           JSONToString[this.Key] = this.ArrayToString(MockObj.selectedValueArray);
      //         } else {
      //           JSONToString[this.Key] = MockObj.selectedValue;
      //         }
      //       }
      //     });
      JSONToString.LoginId = this.entityUser;
      JSONToString.Rejected_YN = 'N';
      JSONToString.Client_Remarks = this.ClientComment;

      // try {
      //   if (sessionStorage.getItem('AvgValue') !== undefined || sessionStorage.getItem('AvgValue') !== null) {
      //     JSONToString.AvgValue = sessionStorage.getItem('AvgValue');
      //   }
      //   if (sessionStorage.getItem('RiskProfile') !== undefined || sessionStorage.getItem('RiskProfile') !== null) {
      //     JSONToString.RiskProfile = sessionStorage.getItem('RiskProfile');
      //   }
      //   if (sessionStorage.getItem('RiskRating') !== undefined || sessionStorage.getItem('RiskRating') !== null) {
      //     JSONToString.RiskRating = sessionStorage.getItem('RiskRating');
      //   }
      // } catch (ex) {
      //   console.log('Error occured while saving KYC Result in SetData service :', ex);
      // }
      // if (this.uploadFileData.length > 0) {
      //   JSONToString['UploadDocumentData'] = this.uploadFileData;
      // }
      // if (this.NotteMasterID !== '' && this.NotteMasterID !== null && this.NotteMasterID !== undefined) {
      //   JSONToString.NoteMasterID = this.NotteMasterID;
      // }
      //   }
      // });
      this.CustApi.SetClientSetupformSavedForFuture(this.entityUser, JSON.stringify(JSONToString)).subscribe((res) => {
        try {
          if (res.InsertJSONResult === true) {
            this.SuccesMsg = 'Profile submitted successfully.';
            setTimeout(function () {
              this.fnToggleRejectionFlag();
            }, 3000);
            // this.Msg = 'Form saved successfully.';
            // this.ErrorMsgVanish();
          } else {
            this.Msg = 'Try again';
            this.ErrorMsgVanish();
          }
        } catch (exeception) {
          console.log(
            'Error occured while executing SetClientSetupFormSavedForFuture service: ' +
            exeception
          );
        }
      });
    } else {
      this.Msg = 'Please Enter Remark';
      this.ErrorMsgVanish();
    }
  }

  ErrorMsgVanish() {
    const x = document.getElementById('snackbar');
    x.className = 'show';
    // document.body.scrollTop = 0;
    // document.documentElement.scrollTop = 0;
    setTimeout(() =>{
      x.className = x.className.replace('show', '');
      this.ErrorMsg = '';
      this.isError = false;
    }, 3000);
  }
  fnOpenProfile() {
    this.showProfile = true;
  }
  fnCloseProfileFlag(closeFlag) {
    this.showProfile = closeFlag;
  }
  fnShowlanding() {
    this.showLanding ? this.showLanding = false : this.showLanding = true;
  }
  fnToggleRejectionFlag() {
    this.BacktoClientSetup.emit(false);
  }
}
