import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { CustomerApiService } from '../../../services/customer-api.service';
import { CustomerCommonfunctionsService } from '../../../services/customer-commonfunctions.service';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginApiService } from 'src/app/services/auth/login-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import { CommonfunctionService } from '../../../components/fx-order/commonfunction.service';
import { HomeApiService } from './../../../services/home-api.service';
import { AppConfig } from 'src/app/services/config.service';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';

// import { FormGroup, FormControl } from '@angular/forms'; // Tracks the same values and status for a collection of form controls

declare global {
  interface Array<T> {
    sortBy(p): Array<T>;
  }
}

@Component({
  selector: 'app-customer-setup-view',
  templateUrl: './customer-setup-view.component.html',
  styleUrls: ['./customer-setup-view.component.scss'],
})
export class CustomerSetupViewComponent implements OnInit, OnDestroy {
  @Input() MyProfileMode: boolean; // true = from Rejected , False = Normal Page loading
  @Output() closeProfile = new EventEmitter<any>();
  Mode: number;
  isProd = environment.production;
  LoginID: string = '';
  NoteMasterID: string = '';
  GetCustomerAccountDetailsSubscriber: Subscription;
  IsLoading = true;
  IsPagedataLoaded = false;
  isChangePassword = false;
  DocumentFound: boolean = false;
  ErrorMsg: string;
  SectionHeaders = [];
  // form: FormGroup;
  // formGroup = {};
  MockForm = [];
  ClientSetupProfileValues: any = [];
  userType = '';
  dealNo = '';
  tokenId = '';
  login = '';
  buttonAction = '';
  buttonID = '';
  ClientOnBoardingUsername = '';
  ClientSetupFormfromService: any[] = [];
  documents: any[] = [];
  eventList: any = [];
  msg = '';
  CustomerID = '';
  interval: any;

  fileUploaded: number[] = [0];
  fileChosen: number[] = [0];
  uploadFileData: any[] = [];
  bytedata: any[] = [];
  docUploadDD = [];
  dropDownList = [] as any;

  AdditionalDocList: any[] = [];
  sectionwiseSequenceNo = 1;

  DealnumberSubscriber: Subscription;
  tokenidSubscriber: Subscription;
  loginSubscriber: Subscription;
  btnActionSubscriber: Subscription;
  processTokenSubscriber: Subscription;
  getClientSetupFormSubscription: Subscription;
  GetClientSetupformSavedForFutureSubscription: Subscription;
  CustomerDetails_ClientBoardingObserver: Subscription;
  GetCSPEventsSubscription: Subscription;
  btnIDSubscriber: Subscription;
  AttachDocumentSubscriber: Subscription;
  GetFactSheetSubscriber: Subscription;
  isAttachDocument: boolean;
  files: NgxFileDropEntry[] = [];
  SelectedfileNames: any;
  IsRMLoggedIN: boolean;
  isEditProfilePopup: boolean;
  IsBackButtonEnabled: boolean;

  constructor(
    public afs: CustomerApiService,
    public cfs: CustomerCommonfunctionsService,
    private ds: WorkflowApiService,
    public router: Router,
    public loginApi: LoginApiService,
    public elements: ElementRef,
    public comm: CommonApiService,
    public custApi: CustomerApiService,
    public commonfunctionservice: CommonfunctionService,
    public homeApi: HomeApiService
  ) {
    this.isAttachDocument = false;
    this.IsRMLoggedIN = false;
    this.isEditProfilePopup = false;
  }

  ngOnInit(): void {
    this.IsBackButtonEnabled =
      this.homeApi.RediretToHomeBuySellPledge === '' ? false : true;

    try {
      try {
        this.userType = sessionStorage.getItem('UserType');
        if (this.userType === 'RM') {
          this.IsRMLoggedIN = true;
        } else {
          this.IsRMLoggedIN = false;
          if (AppConfig.settings.CSP_EditProfileControlEnabled) {
            // Added by Ketan S on 12 Oct 21 confirmed from Roshan D.
            this.fnHideControlsOnRejectedProfile();
          }
        }
      } catch (Ex) {
        console.log('Error occured while checking logged IN User type: ', Ex);
      }

      try {
        if (this.MyProfileMode === undefined) {
          this.MyProfileMode = false;
        } else if (this.MyProfileMode) {
          if (!this.IsRMLoggedIN) {
            this.fnHideControlsOnRejectedProfile();
          }
        }
      } catch (ex) {
        console.log('Error occured while loading the view profile: ', ex);
      }

      // try {
      //   this.Mode = Number(this.route.snapshot.paramMap.get('Mode')); // 1: Client Mode, 2: ClientOnBoarding Mode
      // } catch {

      // }
      // this.form = new FormGroup(this.formGroup);

      if (this.IsRMLoggedIN) {
        this.LoginID = sessionStorage.getItem('RMUser');
      } else {
        this.LoginID = sessionStorage.getItem('Username');
      }

      this.NoteMasterID = sessionStorage.getItem('NoteMasterID');
      this.fnLoadProfile();
      this.GetCSPEventsSubscription = this.afs
        .GetCSPEvents()
        .subscribe((res) => {
          if (res) {
            this.eventList = res;
            this.DocUploaddropDownData();
            // this.eventList.forEach(element => {
            //   if (element.Event_Name === DocUploadDefaultValueLabel) {
            //     this.docUploadDD.push(element.Event_Code);
            //   }
            // });
          }
        });

      this.DealnumberSubscriber = this.comm.dealnoObserver.subscribe((res) => {
        if (res.length !== 0) {
          if (this.userType.toLowerCase() === 'rm') {
            this.dealNo = res;
          }
        }
      });

      this.tokenidSubscriber = this.comm.tokenidObserver.subscribe((res) => {
        if (res.length !== 0) {
          if (this.userType.toLowerCase() === 'rm') {
            this.tokenId = res;
          }
        }
      });

      this.loginSubscriber = this.comm.loginObserver.subscribe((res) => {
        if (res.length !== 0) {
          if (this.userType.toLowerCase() === 'rm') {
            this.login = res;
          }
        }
      });

      // this.comm.ResetbtnAction();
      this.btnActionSubscriber = this.comm.btnActionObserver.subscribe(
        (res: any) => {
          if (res !== '') {
            this.buttonAction = res;
          } else if (this.buttonAction !== 'HideEditProfile') {
            this.buttonAction = '';
          }
        }
      );

      this.btnIDSubscriber = this.comm.btnIDObserver.subscribe((res: any) => {
        if (res !== '') {
          this.buttonID = res;
        } else {
          this.buttonID = '';
        }
      });

      this.afs.ResetprocessTokenObserver();
      this.processTokenSubscriber = this.afs.processTokenOnBoarding.subscribe(
        (res) => {
          if (res.length !== 0) {
            this.msg = res.processTokenonButtonClickResult;
            if (this.msg !== '') {
              // Load Customer ID
              this.interval = setInterval(() => {
                this.afs
                  .isCustProfileCreated(this.LoginID, '', '')
                  .subscribe((custRes) => {
                    if (
                      !custRes.status &&
                      custRes.message === 'No record(s) found'
                    ) {
                      // Retry
                      this.CustomerID = '';
                    } else if (custRes.length !== 0) {
                      clearInterval(this.interval);
                      this.CustomerID = custRes[0].CustomerID;
                      this.fnUpdateKYCFlag();
                    }
                  });
              }, 1000);
            }
          }
        },
        () => {
          this.msg = 'Error occured. Please try again.';
        }
      );

      this.GetFactSheetSubscriber = this.ds.getFactsheetDataObserver.subscribe(
        (res) => {
          try {
            if (res.length > 0) {
              this.documents = [];
              let IsFirstRecord: boolean = true;
              let IsFirstRecordAdditionalDoc: boolean = true;
              this.ResetAllDocs();
              let SectionsCovered = [];
              res.forEach((docelement) => {
                let DocInsertedOrNot: boolean = false;
                // Adding the Event name into the response
                if (this.eventList.length > 0) {
                  this.eventList.forEach((eventelement) => {
                    if (
                      (eventelement.Event_Code + '').toUpperCase() ===
                      docelement.Event_Code
                    ) {
                      docelement.Event_Name = eventelement.Event_Name;
                    }
                  });
                }

                this.ClientSetupFormfromService.forEach((ele) => {
                  if (
                    ele.AHU_DefaultValue.toUpperCase() === docelement.Event_Code
                  ) {
                    docelement =
                      this.fnChangeDraggedFileEventNameorCode(docelement);
                    // Checking the First record of Doc Section
                    if (SectionsCovered.length === 0) {
                      SectionsCovered.push(ele.AHU_Section);
                      IsFirstRecord = true;
                    } else {
                      SectionsCovered.forEach((sectionsCoveredEle) => {
                        if (sectionsCoveredEle === ele.AHU_Section) {
                          IsFirstRecord = false;
                        }
                      });
                      if (IsFirstRecord) {
                        SectionsCovered.push(ele.AHU_Section);
                        IsFirstRecord = true;
                      }
                    }
                    this.MockForm.push({
                      sectionName: ele.AHU_Section,
                      controlName: 'Documents Upload',
                      controlType: 'documents',
                      valueType: 'pdf',
                      validators: {
                        required: true,
                        // minlength: 5,
                        maxlength: 100,
                        DisplayYN: true,
                      },
                      selectedValue: docelement,
                      IsFirstRecord: IsFirstRecord,
                    });
                    DocInsertedOrNot = true;
                    if (!IsFirstRecord) {
                      IsFirstRecord = true;
                    }
                    // IsFirstRecord = false;
                  }
                });

                if (!DocInsertedOrNot) {
                  docelement =
                    this.fnChangeDraggedFileEventNameorCode(docelement);
                  this.MockForm.forEach((MockFormEle) => {
                    if (
                      MockFormEle.sectionName === 'Additional Documents' &&
                      MockFormEle.selectedValue !== {}
                    ) {
                      IsFirstRecordAdditionalDoc = false;
                    }
                  });
                  this.MockForm.push({
                    sectionName: 'Additional Documents',
                    controlName: 'Documents Upload',
                    controlType: 'documents',
                    valueType: 'pdf',
                    validators: {
                      required: true,
                      maxlength: 100,
                      DisplayYN: true,
                    },
                    selectedValue: docelement,
                    IsFirstRecord: IsFirstRecordAdditionalDoc,
                  });
                }
              });

              // Adding the rest Docs in the list
            }
            // Add empty docuemnt control to show no data found on form
            this.ClientSetupFormfromService.forEach((ele) => {
              let IsSectionFound: boolean = false;
              if (ele.AHU_Control === 'Document Upload') {
                // Check if control is Document
                this.MockForm.forEach((mockFormEle) => {
                  if (ele.AHU_Section === mockFormEle.sectionName) {
                    IsSectionFound = true;
                  }
                });
                if (IsSectionFound === false) {
                  this.MockForm.push({
                    sectionName: ele.AHU_Section,
                    controlName: 'Documents Upload',
                    controlType: 'documents',
                    valueType: 'pdf',
                    validators: {
                      required: true,
                      // minlength: 5,
                      maxlength: 100,
                      DisplayYN: true,
                    },
                    selectedValue: '',
                  });
                }
              }
            });
          } catch (ex) {
            console.log(
              'Error occured in My profile page while retriving documents from server',
              ex
            );
          }
          // } else {
          //   console.log('no data');
          // }
        }
      );
    } catch (error) { }
  }

  fnChangeDraggedFileEventNameorCode(docelement: any) {
    if (
      docelement.Event_Code === 'CustomerDragDocs' ||
      docelement.Event_Name === 'CustomerDragDocs' ||
      docelement.Event_Code === 'CUSTOMERDRAGDOCS' ||
      docelement.Event_Name === 'CUSTOMERDRAGDOCS'
    ) {
      docelement.Event_Code = docelement.Document_Output_Path.split('.')[0];
      docelement.Event_Name = docelement.Document_Output_Path.split('.')[0];
    }
    return docelement;
  }

  fnLoadProfile() {
    try {
      this.ClientOnBoardingUsername = sessionStorage.getItem('ClientName');
      sessionStorage.setItem('ClientName', '');
      if (
        this.ClientOnBoardingUsername !== '' &&
        this.ClientOnBoardingUsername !== null
      ) {
        this.afs.GetCustomerDetails_ClientOnBoarding(
          this.ClientOnBoardingUsername
        );
        this.CustomerDetails_ClientBoardingObserver =
          this.afs.CustomerDetails_ClientBoardingObserver.subscribe((res) => {
            if (res !== {}) {
              try {
                sessionStorage.setItem('CPRACustomerID', res.Customer_ID);
                // const noteMasterID = sessionStorage.getItem('NoteMasterID');
                // this.ds.ProductAttachmentList(noteMasterID, 0);
                if (
                  res.UserLogin !== '' &&
                  res.UserLogin !== null &&
                  res.UserLogin !== undefined
                ) {
                  this.LoginID = res.UserLogin;
                  this.afs
                    .GetClientSetupformSavedForFutureKetan(this.LoginID)
                    .subscribe((res) => {
                      if (res.GetDataResult !== '[]') {
                        // console.log(res.GetDataResult);
                        let serviceDataOBJ = JSON.parse(res.GetDataResult)[0];
                        this.ClientSetupProfileValues = serviceDataOBJ;
                        this.MapFormTagsToProfileTags();
                        let keyData = Object.keys(serviceDataOBJ);
                        keyData.forEach((element, _i) => {
                          if (element) {
                            this.MockForm.forEach((mockformelement) => {
                              if (mockformelement.tagName === element) {
                                mockformelement.selectedValue =
                                  serviceDataOBJ[element];
                                if (
                                  mockformelement.controlType ===
                                  'selectmultiple' &&
                                  mockformelement.selectedValue !== ''
                                ) {
                                  mockformelement.selectedValueArray =
                                    mockformelement.selectedValue.split('~');
                                  mockformelement.selectedValueArray.forEach(
                                    (eleselectedValueArray) => {
                                      mockformelement.options.forEach(
                                        (eleOptions) => {
                                          if (
                                            eleselectedValueArray ===
                                            eleOptions.value
                                          ) {
                                            eleOptions.Ischecked = true;
                                          }
                                        }
                                      );
                                    }
                                  );
                                  mockformelement.selectedValue =
                                    mockformelement.selectedValue
                                      .split('~')
                                      .join(' | ');
                                }
                                if (
                                  mockformelement.controlType === 'radio' &&
                                  mockformelement.selectedValue !== ''
                                ) {
                                  mockformelement.options.forEach(
                                    (eleOptions) => {
                                      if (
                                        mockformelement.selectedValue ===
                                        eleOptions.value
                                      ) {
                                        eleOptions.Ischecked = true;
                                      }
                                    }
                                  );
                                }
                                if (
                                  mockformelement.controlType === 'checkbox' &&
                                  mockformelement.selectedValue !== ''
                                ) {
                                  mockformelement.options.forEach(
                                    (eleOptions) => {
                                      if (
                                        mockformelement.selectedValue ===
                                        eleOptions.value
                                      ) {
                                        eleOptions.Ischecked = true;
                                      }
                                    }
                                  );
                                }
                              }
                            });
                          }
                        });

                        this.sort_by_key(this.MockForm, 'pageNumber');
                        this.fnIsPageDataLoaded();
                      } else {
                        // No data received
                      }
                    });
                }
              } catch (Exception) {
                console.log('Error occured in filling customer details.');
              }
            } else {
              this.IsLoading = false;
              this.msg = 'No records found here';
            }
          });
      }
    } catch (e) {
      // console.log(this.ClientOnBoardingUsername);
    }
    // CLIENTSETUPFORM SERVICE
    this.getClientSetupFormSubscription = this.afs
      .getClientSetupForm()
      .subscribe((res) => {
        if (res) {
          // this.ClientSetupFormfromService = res.DB_Get_DataGridResult;
          this.ClientSetupFormfromService = res.DB_GetAPIDataResult;
          if (this.ClientSetupProfileValues !== {}) {
            this.MapFormTagsToProfileTags();
            this.ds.ResetkGetFactSheetData();
            // this.ds.ProductAttachmentList(this.NoteMasterID);
            this.fnProductAttachmentListWTO(this.NoteMasterID);
            this.fnIsPageDataLoaded();
          }
          // const noteMasterID = sessionStorage.getItem('NoteMasterID');
          // this.ds.ProductAttachmentList(noteMasterID, 0);
        }
      });

    if (
      this.ClientOnBoardingUsername === '' ||
      this.ClientOnBoardingUsername === null
    ) {
      this.GetClientSetupformSavedForFutureSubscription = this.afs
        .GetClientSetupformSavedForFutureKetan(this.LoginID)
        .subscribe((res) => {
          if (res.GetDataResult !== '[]') {
            let serviceDataOBJ = JSON.parse(res.GetDataResult)[0];
            this.ClientSetupProfileValues = serviceDataOBJ;

            this.MapFormTagsToProfileTags();

            let keyData = Object.keys(serviceDataOBJ);
            keyData.forEach((element, _i) => {
              if (element) {
                if (element === 'NoteMasterID') {
                  this.NoteMasterID = serviceDataOBJ[element];
                  this.ds.ResetkGetFactSheetData();
                  // this.ds.ProductAttachmentList(this.NoteMasterID);
                  this.fnProductAttachmentListWTO(this.NoteMasterID);
                }
                this.MockForm.forEach((mockformelement) => {
                  if (mockformelement.tagName === element) {
                    mockformelement.selectedValue = serviceDataOBJ[element];
                    if (
                      mockformelement.controlType === 'selectmultiple' &&
                      mockformelement.selectedValue !== ''
                    ) {
                      mockformelement.selectedValueArray =
                        mockformelement.selectedValue.split('~');
                      mockformelement.selectedValueArray.forEach(
                        (eleselectedValueArray) => {
                          mockformelement.options.forEach((eleOptions) => {
                            if (eleselectedValueArray === eleOptions.value) {
                              eleOptions.Ischecked = true;
                            }
                          });
                        }
                      );
                      mockformelement.selectedValue =
                        mockformelement.selectedValue.split('~').join(' | ');
                    }
                    if (
                      mockformelement.controlType === 'radio' &&
                      mockformelement.selectedValue !== ''
                    ) {
                      mockformelement.options.forEach((eleOptions) => {
                        if (
                          mockformelement.selectedValue === eleOptions.value
                        ) {
                          eleOptions.Ischecked = true;
                        }
                      });
                    }
                    if (
                      mockformelement.controlType === 'checkbox' &&
                      mockformelement.selectedValue !== ''
                    ) {
                      mockformelement.options.forEach((eleOptions) => {
                        if (
                          mockformelement.selectedValue === eleOptions.value
                        ) {
                          eleOptions.Ischecked = true;
                        }
                      });
                    }
                  }
                });
              }
            });
            // this.AddLoginInfoSectionValues();
            this.sort_by_key(this.MockForm, 'pageNumber');
            this.fnIsPageDataLoaded();
          } else {
            // No data received
          }
        });
    }
  }

  ngOnDestroy(): void {
    // console.log('Customer setup page NgOnDestroy Called');
    try {
      this.homeApi.RediretToHomeBuySellPledge = '';
      this.ClientSetupProfileValues = {};
      this.SectionHeaders = [];
      this.MockForm = [];
      this.ResetData();
      this.msg = '';
      this.comm.ResetbtnAction();
      this.comm.ResetbtnID();
      this.afs.ResetprocessTokenObserver();
      this.afs.ResetCustomerDetails_ClientBoardingObserver();
      this.ds.ResetkGetFactSheetData();
      if (this.CustomerDetails_ClientBoardingObserver) {
        this.CustomerDetails_ClientBoardingObserver.unsubscribe();
      }
      if (this.getClientSetupFormSubscription) {
        this.getClientSetupFormSubscription.unsubscribe();
      }
      if (this.processTokenSubscriber) {
        this.processTokenSubscriber.unsubscribe();
      }
      if (this.DealnumberSubscriber) {
        this.DealnumberSubscriber.unsubscribe();
      }
      if (this.tokenidSubscriber) {
        this.tokenidSubscriber.unsubscribe();
      }
      if (this.loginSubscriber) {
        this.loginSubscriber.unsubscribe();
      }
      if (this.btnActionSubscriber) {
        this.btnActionSubscriber.unsubscribe();
      }
      if (this.AttachDocumentSubscriber) {
        this.AttachDocumentSubscriber.unsubscribe();
      }
      if (this.GetFactSheetSubscriber) {
        this.GetFactSheetSubscriber.unsubscribe();
      }
      // this.GetClientSetupformSavedForFutureSubscription.unsubscribe();
    } catch (e) {
      console.log(
        'Error occured in customer setup view destroy while unsubscribing the Subscribers: ',
        e
      );
    }
  }

  MapFormTagsToProfileTags() {
    if (this.ClientSetupFormfromService.length > 0) {
      this.SectionHeaders = [];
      this.MockForm = [];
      this.ClientSetupFormfromService.forEach((obj) => {
        obj.AHU_Priority = Number(obj.AHU_Priority);
      });
      this.sort_by_key(this.ClientSetupFormfromService, 'AHU_Priority');
      if (
        this.ClientOnBoardingUsername === '' ||
        this.ClientOnBoardingUsername === null
      ) {
        this.SectionHeaders.push({ Name: 'Login Info', DisplayYN: true }); // Add Login info section header
      }

      let DocumentsUploadSections = [];

      this.ClientSetupFormfromService.forEach((formControl) => {
        // if (formControl.AHU_Section === 'Required Documents') {
        //   // Skip this section
        // } else
        if (formControl.AHU_Section === 'Terms and Conditions') {
          // Skip this section
        } else {
          // If element is document upload
          if (
            formControl.AHU_Section === 'Corporate Entity Documents' ||
            formControl.AHU_Section === 'Identification Documents' ||
            formControl.AHU_Section ===
            'Legal Entity Information and Documents' ||
            formControl.AHU_Section === 'Required Documents'
          ) {
            if (DocumentsUploadSections.length > 0) {
              let Sectionfound: boolean = false;
              DocumentsUploadSections.forEach((docuploadele) => {
                if (docuploadele === formControl.AHU_Section) {
                  Sectionfound = true;
                }
              });
              if (!Sectionfound) {
                DocumentsUploadSections.push(formControl.AHU_Section);
              }
            } else {
              DocumentsUploadSections.push(formControl.AHU_Section);
            }
          } else {
            if (this.SectionHeaders.length > 0) {
              let IsHeaderPresentInList = false;
              this.SectionHeaders.forEach((sectionHeaders) => {
                if (sectionHeaders.Name === formControl.AHU_Section) {
                  IsHeaderPresentInList = true;
                }
              });
              if (!IsHeaderPresentInList) {
                this.SectionHeaders.push({
                  Name: formControl.AHU_Section,
                  DisplayYN: true,
                });
              }
            } else {
              this.SectionHeaders.push({
                Name: formControl.AHU_Section,
                DisplayYN: true,
              });
            }
          }
        }
      });
      if (
        this.ClientOnBoardingUsername === '' ||
        this.ClientOnBoardingUsername === null
      ) {
        this.SectionHeaders.push({
          Name: 'Risk Profile Details',
          DisplayYN: true,
        }); // Add Login info section header
        // this.SectionHeaders.push('Documents Information'); // Add Documents Information section header
      }
      if (DocumentsUploadSections.length > 0) {
        DocumentsUploadSections.forEach((docuploadsecele) => {
          this.SectionHeaders.push({ Name: docuploadsecele, DisplayYN: true });
        });
      }
      this.SectionHeaders.push({
        Name: 'Additional Documents',
        DisplayYN: true,
      }); // Add additional documents section header

      this.ClientSetupFormfromService.forEach((obj) => {
        if (obj.AHU_Misc1 !== '') {
          try {
            if (Object.keys(this.ClientSetupProfileValues).length !== 0) {
              // if (this.ClientSetupProfileValues[obj.AHU_Misc1] !== undefined && this.ClientSetupProfileValues[obj.AHU_Misc1] !== null) { // commented by Ketan S on 22 April to show all labels
              if (obj.AHU_Control === 'Multiselect') {
                this.MockForm.push({
                  sectionName: obj.AHU_Section,
                  controlName: obj.AHU_DisplayName,
                  controlType: 'label',
                  // controlType: obj.AHU_Control,
                  valueType: obj.AHU_DataType,
                  validators: {
                    required: true,
                    // minlength: 5,
                    maxlength: Number(obj.AHU_Length),
                    DisplayYN: obj.AHU_DisplayYN === 'N' ? false : true,
                  },
                  selectedValue:
                    this.ClientSetupProfileValues[obj.AHU_Misc1] !== null
                      ? (this.ClientSetupProfileValues[obj.AHU_Misc1] + '')
                        .split('~')
                        .join(' | ')
                      : '',
                });
              } else {
                this.MockForm.push({
                  sectionName: obj.AHU_Section,
                  controlName: obj.AHU_DisplayName,
                  controlType: 'label',
                  // controlType: obj.AHU_Control,
                  valueType: obj.AHU_DataType,
                  validators: {
                    required: true,
                    // minlength: 5,
                    maxlength: Number(obj.AHU_Length),
                    DisplayYN: obj.AHU_DisplayYN === 'N' ? false : true,
                  },
                  selectedValue:
                    this.ClientSetupProfileValues[obj.AHU_Misc1] !== null
                      ? obj.AHU_DataType === 'money'
                        ? this.commonfunctionservice.FormatNumberWithoutEventForAmount(
                          this.ClientSetupProfileValues[obj.AHU_Misc1],
                          2
                        )
                        : this.ClientSetupProfileValues[obj.AHU_Misc1]
                      : '',
                  // selectedValue: this.ClientSetupProfileValues[obj.AHU_Misc1]
                });
              }
            } else {
              // If Data not received add - in values
              this.MockForm.push({
                sectionName: obj.AHU_Section,
                controlName: obj.AHU_DisplayName,
                controlType: 'label',
                // controlType: obj.AHU_Control,
                valueType: obj.AHU_DataType,
                validators: {
                  required: true,
                  // minlength: 5,
                  maxlength: Number(obj.AHU_Length),
                  DisplayYN: obj.AHU_DisplayYN === 'N' ? false : true,
                },
                selectedValue: '-',
              });
            }

            // }
          } catch (e) { }
        } else if (obj.AHU_Control === 'Label') {
          this.MockForm.push({
            sectionName: obj.AHU_Section,
            // controlName: obj.AHU_DisplayName,
            controlName: obj.AHU_DefaultValue,
            controlType: 'sentence',
            valueType: obj.AHU_DataType,
            validators: {
              required: true,
              maxlength: Number(obj.AHU_Length),
              DisplayYN: obj.AHU_DisplayYN === 'N' ? false : true,
            },
            selectedValue: '',
          });
        }
      });
      // Add the Customer Ref Number in Client Info Section
      this.MockForm.push({
        sectionName: this.SectionHeaders[1].Name,
        controlName: 'Client Ref No',
        controlType: 'label',
        // controlType: obj.AHU_Control,
        valueType: 'text',
        validators: {
          required: true,
          // minlength: 5,
          maxlength: 20,
        },
        selectedValue: sessionStorage.getItem('CustomerID'),
      });
      if (
        this.ClientOnBoardingUsername === '' ||
        this.ClientOnBoardingUsername === null
      ) {
        this.AddLoginInfoSectionValues();
        this.AddRiskProfileDetailsSectionValues();
        // this.AddAdditionalDocumentsSectionValues();
      }
    }
  }

  AddLoginInfoSectionValues() {
    let loggedAt: any = '';
    if (sessionStorage.getItem('LoggedAt')) {
      const loginTime = sessionStorage.getItem('LoggedAt');
      loggedAt = new Date(
        parseInt(loginTime.substring(6, loginTime.length - 7), 10)
      );
    }
    const LoginSectionKeys = [
      { Key: 'Username', Value: this.LoginID },
      { Key: 'Email ID', Value: sessionStorage.getItem('EmailID') },
      { Key: 'Password', Value: '********' },
      { Key: 'Last Login time', Value: loggedAt },
    ];

    LoginSectionKeys.forEach((obj) => {
      this.MockForm.push({
        sectionName: 'Login Info',
        controlName: obj.Key,
        controlType: 'label',
        valueType: 'string',
        validators: {
          required: true,
          maxlength: 50,
          DisplayYN: true,
        },
        selectedValue: obj.Value,
      });
    });
  }

  AddAdditionalDocumentsSectionValues() {
    this.MockForm.push({
      sectionName: 'Additional Documents',
      controlName: '',
      controlType: 'additionalDocuments',
      valueType: 'string',
      validators: {
        required: true,
        maxlength: 50,
        DisplayYN: true,
      },
      selectedValue: '',
      sectionwiseSequenceNo: this.sectionwiseSequenceNo++,
    });
  }

  AddRiskProfileDetailsSectionValues() {
    // let CRR = '';
    // let riskProfile = '';
    // try {
    //   CRR = this.homeApi.CRR;
    //   riskProfile = this.homeApi.RiskProfile;
    //   // CRR = this.ClientSetupProfileValues.RiskRating;
    //   // riskProfile = this.ClientSetupProfileValues.RiskProfile;
    // } catch (ex) {

    // }

    const RiskProfileDetailsSectionKeys = [
      { Key: 'Risk Rating', Value: this.homeApi.RiskRating },
      { Key: 'Risk Profile', Value: this.homeApi.RiskProfile },
    ];

    RiskProfileDetailsSectionKeys.forEach((obj) => {
      this.MockForm.push({
        sectionName: 'Risk Profile Details',
        controlName: obj.Key,
        controlType: 'label',
        valueType: 'string',
        validators: {
          required: true,
          maxlength: 50,
          DisplayYN: true,
        },
        selectedValue: obj.Value,
      });
    });
  }

  passwordOverride() {
    this.isChangePassword = true;
  }
  overrideCancelled() {
    this.isChangePassword = false;
  }

  ResetData() {
    this.SectionHeaders = [];
    this.MockForm = [];
    this.buttonAction = '';
    this.ErrorMsg = '';
    // this.tokenId = '';
    // this.dealNo = '';
    // this.login = '';
    this.msg = '';
  }

  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      const x = a[key];
      const y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }
  EditProfile() {
    if (this.IsRMLoggedIN) {
      //Opening Edit Profile as popup
      this.isEditProfilePopup = true;
    } else {
      //Opening Edit Profile as new page
      sessionStorage.setItem('EditProfile', this.LoginID);
      this.router.navigate(['/editprofile']);
    }
  }
  VerifyProfile() {
    this.msg = '';
    // this.loadflag = true;
    this.afs.processButtonActionOnBoarding(
      this.tokenId,
      this.dealNo,
      this.buttonID,
      this.login
    );
  }
  RejectProfile() {
    this.msg = '';
    // this.loadflag = true;
    this.afs.processButtonActionOnBoarding(
      this.tokenId,
      this.dealNo,
      this.buttonID,
      this.login
    );
  }
  showFile(DGTID) {
    const noteMasterID = sessionStorage.getItem('NoteMasterID');
    const Link =
      'http://' +
      AppConfig.settings.CSP_FXPricingURL +
      '/FinIQService/RMWorkstation_JSON.svc/Get_Uploaded_Documents_API/' +
      noteMasterID +
      '/' +
      DGTID;

    window.open(Link);
  }
  fnIsPageDataLoaded() {
    if (
      this.ClientSetupFormfromService.length > 0 &&
      this.SectionHeaders.length > 0 &&
      this.ClientSetupProfileValues !== {}
    ) {
      this.IsPagedataLoaded = true;
    }
  }
  fnUpdateKYCFlag() {
    const Formname = AppConfig.settings.CSP_UpdateCIRPFormName;
    let RiskRating = '';
    this.afs
      .GetClientSetupformSavedForFutureKetan(this.LoginID)
      .subscribe((res) => {
        if (res.GetDataResult !== '[]') {
          let serviceDataOBJ = JSON.parse(res.GetDataResult)[0];
          try {
            RiskRating = serviceDataOBJ.RiskRating;
            this.afs
              .UpdateKYCFlag(
                Formname,
                this.CustomerID,
                this.LoginID,
                RiskRating
              )
              .subscribe((res) => {
                try {
                  if (res !== null && res !== undefined) {
                  }
                } catch (ex) {
                  console.log(
                    'Error occured while updating KYC Flag in system :',
                    ex
                  );
                }
              });
          } catch (ex) { }
        }
      });
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

  uploadDoc(Index: number) {
    if (
      this.LoginID !== '' &&
      this.NoteMasterID !== '' &&
      this.NoteMasterID !== undefined &&
      this.NoteMasterID !== null
    ) {
      // for (let i = 0; i < this.uploadFileData.length; i++) {
      this.afs.AttachDocument(
        this.LoginID,
        sessionStorage.getItem('HomeEntityID'),
        sessionStorage.getItem('HomeEntityName'),
        this.NoteMasterID,
        this.uploadFileData[Index].EventCode,
        this.uploadFileData[Index].Name,
        this.uploadFileData[Index].FileDetails
      );
      this.AttachDocumentSubscriber =
        this.afs.AttachDocumentsObservable.subscribe((res: any) => {
          if (res) {
            // this.Message = 'Document(s) Uploaded Successfully';

            this.ds.ResetkGetFactSheetData();
            // this.ds.ProductAttachmentList(noteMasterID);
            this.fnProductAttachmentListWTO(this.NoteMasterID);
            this.ErrorMsg =
              this.uploadFileData[Index].Name + ' Uploaded Successfully';
            this.ErrorMsgVanish();
          }
        });
      // }
    } else {
    }
  }

  ErrorMsgVanish() {
    try {
      const x = document.getElementById('snackbar');
      x.className = 'show';
      setTimeout(function () {
        x.className = x.className.replace('show', '');
        this.ErrorMsg = '';
      }, 3000);
    } catch (Ex) {
      console.log(
        'Error occured while destroying Error pop up in Customer setup view page: ',
        Ex
      );
    }
  }
  AddEmptyDoc() {
    this.isAttachDocument = !this.isAttachDocument;
    this.AddAdditionalDocumentsSectionValues();
  }
  removeDocFromList(index) {
    this.MockForm.splice(index, 1);
  }
  eventChange(event, i) {
    this.docUploadDD[i] = event.target.value;
  }
  DocUploaddropDownData() {
    try {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.eventList.length; i++) {
        this.dropDownList.push(this.eventList[i].Event_Name);
      }
      this.docUploadDD[0] = this.eventList[0].Event_Code;
    } catch (error) { }
  }
  ResetAllDocs() {
    try {
      this.MockForm.forEach((mockFormres) => {
        if (
          mockFormres.controlType === 'documents' &&
          mockFormres.valueType === 'pdf'
        ) {
          const Splicedindex = this.MockForm.indexOf(mockFormres);
          if (Splicedindex > -1) {
            this.MockForm.remove(Splicedindex);
            this.MockForm.splice(Splicedindex);
          }
        }
      });
    } catch (Ex) {
      console.log(
        'Error occured while uploading the Additional Documents: ',
        Ex
      );
    }
  }
  fnCloseProfile() {
    this.closeProfile.emit(false);
  }
  fnHideControlsOnRejectedProfile() {
    this.buttonAction = 'HideEditProfile';
  }
  fnProductAttachmentListWTO(NoteMasterID) {
    this.ds.ProductAttachmentListWTO(NoteMasterID).subscribe((res) => {
      try {
        if (res.length > 0) {
          this.documents = [];
          let IsFirstRecord: boolean = true;
          let IsFirstRecordAdditionalDoc: boolean = true;
          this.ResetAllDocs();
          let SectionsCovered = [];
          res.forEach((docelement) => {
            let DocInsertedOrNot: boolean = false;
            if (this.eventList.length > 0) {
              this.eventList.forEach((eventelement) => {
                if (
                  (eventelement.Event_Code + '').toUpperCase() ===
                  docelement.Event_Code
                ) {
                  docelement.Event_Name = eventelement.Event_Name;
                }
              });
            }
            this.ClientSetupFormfromService.forEach((ele) => {
              if (
                ele.AHU_DefaultValue.toUpperCase() === docelement.Event_Code
              ) {
                docelement =
                  this.fnChangeDraggedFileEventNameorCode(docelement);
                // Checking the First record of Doc Section
                if (SectionsCovered.length === 0) {
                  SectionsCovered.push(ele.AHU_Section);
                  IsFirstRecord = true;
                } else {
                  SectionsCovered.forEach((sectionsCoveredEle) => {
                    if (sectionsCoveredEle === ele.AHU_Section) {
                      IsFirstRecord = false;
                    }
                  });
                  if (IsFirstRecord) {
                    SectionsCovered.push(ele.AHU_Section);
                    IsFirstRecord = true;
                  }
                }
                this.MockForm.push({
                  sectionName: ele.AHU_Section,
                  controlName: 'Documents Upload',
                  controlType: 'documents',
                  valueType: 'pdf',
                  validators: {
                    required: true,
                    // minlength: 5,
                    maxlength: 100,
                    DisplayYN: true,
                  },
                  selectedValue: docelement,
                  IsFirstRecord: IsFirstRecord,
                });
                DocInsertedOrNot = true;
                if (!IsFirstRecord) {
                  IsFirstRecord = true;
                }
                // IsFirstRecord = false;
              }
            });
            if (!DocInsertedOrNot) {
              docelement = this.fnChangeDraggedFileEventNameorCode(docelement);
              this.MockForm.forEach((MockFormEle) => {
                if (
                  MockFormEle.sectionName === 'Additional Documents' &&
                  MockFormEle.selectedValue !== {}
                ) {
                  IsFirstRecordAdditionalDoc = false;
                }
              });
              this.MockForm.push({
                sectionName: 'Additional Documents',
                controlName: 'Documents Upload',
                controlType: 'documents',
                valueType: 'pdf',
                validators: {
                  required: true,
                  maxlength: 100,
                  DisplayYN: true,
                },
                selectedValue: docelement,
                IsFirstRecord: IsFirstRecordAdditionalDoc,
              });
            }
          });
        }
        // Add empty document control to show no data found on form
        this.ClientSetupFormfromService.forEach((ele) => {
          let IsSectionFound: boolean = false;
          if (ele.AHU_Control === 'Document Upload') {
            // Check if control is Document
            this.MockForm.forEach((mockFormEle) => {
              if (ele.AHU_Section === mockFormEle.sectionName) {
                IsSectionFound = true;
              }
            });
            if (IsSectionFound === false) {
              this.MockForm.push({
                sectionName: ele.AHU_Section,
                controlName: 'Documents Upload',
                controlType: 'documents',
                valueType: 'pdf',
                validators: {
                  required: true,
                  // minlength: 5,
                  maxlength: 100,
                  DisplayYN: true,
                },
                selectedValue: '',
              });
            }
          }
        });
        this.fnHideEmptyDocumentsSection();
      } catch (ex) {
        console.log(
          'Error occured in My profile page while retriving documents from server',
          ex
        );
      }
    });
  }

  fnHideEmptyDocumentsSection() {
    let DocumentsContainingSections = [];
    this.MockForm.forEach((res) => {
      if (
        res.sectionName === 'Corporate Entity Documents' ||
        res.sectionName === 'Identification Documents' ||
        res.sectionName === 'Legal Entity Information and Documents' ||
        res.sectionName === 'Required Documents'
      ) {
        if (res.controlName === 'Documents Upload') {
          DocumentsContainingSections.push(res.sectionName);
        }
      }
    });
    this.SectionHeaders.forEach((SectionHeaderRes) => {
      let DocFound: boolean = false;
      if (
        SectionHeaderRes.Name === 'Corporate Entity Documents' ||
        SectionHeaderRes.Name === 'Identification Documents' ||
        SectionHeaderRes.Name === 'Legal Entity Information and Documents' ||
        SectionHeaderRes.Name === 'Required Documents'
      ) {
        DocumentsContainingSections.forEach((Res) => {
          if (Res === SectionHeaderRes.Name) {
            DocFound = true;
          }
        });
        SectionHeaderRes.DisplayYN = DocFound;
      }
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

  fnUploadDoc() {
    try {
      this.files.forEach((uploadfiledataobj) => {
        this.afs
          .AttachDocumentWTOObservable(
            this.LoginID,
            sessionStorage.getItem('HomeEntityID'),
            sessionStorage.getItem('HomeEntityName'),
            this.NoteMasterID,
            'CustomerDragDocs',
            uploadfiledataobj['relativePath'],
            uploadfiledataobj['FileDetails']
          )
          .subscribe((res: any) => {
            if (res) {
              console.log(res);
            }
          });
      });
      this.fnSubmitFiles();
    } catch (ex) { }
  }

  fnEditProfileCancelled(event) {
    this.fnLoadProfile();
    this.isEditProfilePopup = event;
  }

  fnRedirectToHomePage() {
    if (this.homeApi.RediretToHomeBuySellPledge === 'HOME') {
      // this.homeapi.openPopup =true;
      this.router.navigate(['/home']);
      this.homeApi.RediretToHomeBuySellPledge = '';
    } else {
      // this.router.navigate(['/portfolioallocation']);
    }
  }
}
