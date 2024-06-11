import { Component, OnInit, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
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
import { DatePipe } from '@angular/common';

// import { FormGroup, FormControl } from '@angular/forms'; // Tracks the same values and status for a collection of form controls

@Component({
  selector: 'app-customer-setup-edit-profile',
  templateUrl: './customer-setup-edit-profile.component.html',
  styleUrls: ['./customer-setup-edit-profile.component.scss']
})
export class CustomerSetupEditProfileComponent implements OnInit , OnDestroy{

  // @Input() LoginID: string;
  @Output() editProfileCancelled = new EventEmitter<boolean>();

  Mode: number;
  isProd = environment.production;
  UserName: string;
  GetCustomerAccountDetailsSubscriber: Subscription;
  IsLoading = true;
  isChangePassword = false;
  ErrorMsg: string;
  SectionHeaders = [];
  // form: FormGroup;
  // formGroup = {};
  MockForm = [];
  ClientSetupProfileValues: any = [];
  UserType = '';
  dealNo = '';
  tokenId = '';
  login = '';
  buttonAction = '';
  ClientOnBoardingUsername = '';
  ClientSetupFormfromService: any[] = [];
  dropDownList = [] as any;
  documents: any[] = [];
  eventList: any = [];
  fileUploaded: number[] = [0];
  fileChosen: number[] = [0];
  sectionwiseSequenceNo = 1;
  uploadFileData: any[] = [];
  bytedata: any[] = [];
  docUploadDD = [];
  msg = '';
  DealnumberSubscriber: Subscription;
  tokenidSubscriber: Subscription;
  loginSubscriber: Subscription;
  btnActionSubscriber: Subscription;
  processTokenSubscriber: Subscription;
  getClientSetupFormSubscription: Subscription;
  GetClientSetupformSavedForFutureSubscription: Subscription;
  CustomerDetails_ClientBoardingObserver: Subscription;
  getFactsheetDataSubscriber: Subscription;
  JSONtoXMLObj: any = {};
  Key: any;
  isError = false;
  IsPagedataLoaded = false;
  SaveCustomerDetailsSubscriber: Subscription;
  GetCSPEventsSubscription: Subscription;
  Message: any;
  NotteMasterID: any;
  NoteMasterID: any;
  displayClass: any;
  IsRMLoggedIN: boolean;

  constructor(private datepipe: DatePipe, public afs: CustomerApiService, public cfs: CustomerCommonfunctionsService, private ds: WorkflowApiService, public router: Router, public loginApi: LoginApiService, public elements: ElementRef, public comm: CommonApiService, public custApi: CustomerApiService, public commonfunctionservice: CommonfunctionService, public homeApi: HomeApiService) {
    this.IsRMLoggedIN = false;
  }

  ngOnInit(): void {
    try {
      // this.form = new FormGroup(this.formGroup);
      this.UserName = sessionStorage.getItem('Username');
      this.UserType = sessionStorage.getItem('UserType');
      this.NoteMasterID = '';

      try {
        if (sessionStorage.getItem('UserType') === 'RM') {
          this.IsRMLoggedIN = true;
        } else {
          this.IsRMLoggedIN = false;
        }
      } catch (Ex) {
        console.log('Error occured while checking logged IN User type: ', Ex);
      }

      if (this.IsRMLoggedIN) {
        this.UserName = sessionStorage.getItem('RMUser');
      } else {
        this.UserName = sessionStorage.getItem('Username');
      };
      this.UserType = sessionStorage.getItem('UserType');
      this.NoteMasterID = sessionStorage.getItem('NoteMasterID');


      this.GetCSPEventsSubscription = this.afs.GetCSPEvents().subscribe((res) => {
        if (res) {
          this.eventList = res;
          try {
            this.DocUploaddropDownData();
            this.fnLoadFormandMode();
          } catch (e) {
            // console.log(this.ClientOnBoardingUsername);
          }
        }
      });

      this.ds.ResetkGetFactSheetData();

      this.SaveCustomerDetailsSubscriber = this.afs.SaveOrder.subscribe((res) => {
        if (res) {
          if (res.SaveUCPResult) {
            this.Message = res.SaveUCPResult[0].SavingMessage;
            if (this.Message !== null && this.Message !== '') {
              if (res.SaveUCPResult[0].RowNumber === 1 && this.Message.length > 0) {
                // this.NotteMasterID = res.SaveUCPResult[0].NoteMasterID;
                // this.NotteMasterID = sessionStorage.getItem('NoteMasterID');
                this.Message = 'Ref ID ' + this.NoteMasterID;
                this.fnSaveForFuture();
                this.isError = true;
                this.ErrorMsg = 'Account Updated Successfully.';
                this.ErrorMsgVanish();

                this.afs.getCommonDataEFX('CSP_Entity_Name').subscribe((res: any) => {
                  if (res.Get_Configurable_Common_DataResult.length !== 0) {
                    // this.HomeEntityName = res.Get_Configurable_Common_DataResult[0].DATA_VALUE;
                    // this.HomeEntityID = res.Get_Configurable_Common_DataResult[0].Misc1;
                    this.uploadDoc();
                  }
                });
                const that = this;
                setTimeout(function () {
                  that.BackToMyProfile();
                }, 1000);
                // this.ErrorMsg = '';
              } else {
                this.Message =
                  'Error while saving the record. Please try again or contact the system administrator.';
                this.isError = true;
                this.ErrorMsg = this.Message;
                this.ErrorMsgVanish();
              }
            } else {
              // this.Message =
              //   'Error while saving the record. Please try again or contact the system administrator.';
              this.isError = true;
              this.ErrorMsg = res.SaveUCPResult[0].WarningMessage;
              this.ErrorMsgVanish();
            }
          }

        }
      });

    } catch (error) {
      this.BackToMyProfile();
    }
  }

  ngOnDestroy(): void {
    try {
      this.ClientSetupProfileValues = {};
      this.SectionHeaders = [];
      this.MockForm = [];
      this.ResetData();
      this.afs.ClearObserverofFD();
      this.ds.ResetkGetFactSheetData();
      if (this.SaveCustomerDetailsSubscriber) { this.SaveCustomerDetailsSubscriber.unsubscribe(); }
      if (this.GetClientSetupformSavedForFutureSubscription) { this.GetClientSetupformSavedForFutureSubscription.unsubscribe(); }
      if (this.getClientSetupFormSubscription) { this.getClientSetupFormSubscription.unsubscribe(); }
      if (this.getFactsheetDataSubscriber) { this.getFactsheetDataSubscriber.unsubscribe(); }

    } catch (e) {
      console.log('Error occured in customer setup view destroy while unsubscribing the Subscribers: ', e);
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
      // this.isError = false;
    }, 3000);
  }

  ResetData() {
    this.SectionHeaders = [];
    this.MockForm = [];
    this.buttonAction = '';
    this.ErrorMsg = '';
    this.msg = '';
  }

  DocUploaddropDownData() {
    try {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.eventList.length; i++) {
        this.dropDownList.push(this.eventList[i].Event_Name);
      }
      // this.docUploadDD[0] = this.dropDownList[0];
    } catch (error) { }
  }

  fnLoadFormandMode(): void {
    if (this.UserType !== '' && this.UserType !== undefined && this.UserType !== null) {

      this.fnGetCustomerSetupForm(1);
    }

  }

  fnGetCustomerSetupForm(IsLoadedMode: number) {
    this.afs.getClientSetupForm().subscribe((res) => {
      if (res) {
        this.ClientSetupFormfromService = [];
        // this.ClientSetupFormfromService = res.DB_Get_DataGridResult;
        this.ClientSetupFormfromService = res.DB_GetAPIDataResult;
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
                sectionName: obj.AHU_Section,
                controlName: obj.AHU_DisplayName,
                controlType: obj.AHU_DataType, // AHU_Control
                valueType: obj.AHU_DataType,
                placeholder: 'Enter ' + obj.AHU_DisplayName,
                validators: {
                  required: obj.AHU_MandatoryYN === 'Y' ? true : false,
                  // minlength: 5,
                  maxlength: 5000,
                  visibility: obj.AHU_DisplayYN
                },
                selectedValue: '',
                pageNumber: obj.Page_Number,
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
              this.MockForm.push({
                tagName: obj.AHU_Misc1,
                sequenceNumber: Number(obj.AHU_Priority) + 4,
                sectionName: obj.AHU_Section,
                controlName: obj.AHU_DisplayName,
                controlType: obj.AHU_Control,
                valueType: obj.AHU_DataType,
                placeholder: 'Choose ' + obj.AHU_DisplayName,
                options: optionsArray,
                validators: {
                  required: obj.AHU_MandatoryYN === 'Y' ? true : false,
                  visibility: obj.AHU_DisplayYN
                  // minlength: 5,
                  // maxlength: Number(obj.AHU_Length)
                },
                selectedValue: '',
                pageNumber: obj.Page_Number,
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
              this.MockForm.push({
                tagName: obj.AHU_Misc1,
                sequenceNumber: Number(obj.AHU_Priority) + 4,
                sectionName: obj.AHU_Section,
                controlName: obj.AHU_DisplayName,
                controlType: obj.AHU_Control,
                valueType: obj.AHU_DataType,
                placeholder: 'Choose ' + obj.AHU_DisplayName,
                options: multipleoptionsArray,
                validators: {
                  required: obj.AHU_MandatoryYN === 'Y' ? true : false,
                  visibility: obj.AHU_DisplayYN
                  // minlength: 5,
                  // maxlength: Number(obj.AHU_Length)
                },
                selectedValue: '',
                selectedValueArray: [],
                ShowMultiSelectPopup: false,
                pageNumber: obj.Page_Number,
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
                sectionName: obj.AHU_Section,
                controlName: obj.AHU_DisplayName,
                placeholder: 'Select ' + obj.AHU_DisplayName,
                controlType: obj.AHU_Control,
                options: radioGroupArray,
                validators: {
                  required: obj.AHU_MandatoryYN === 'Y' ? true : false,
                  visibility: obj.AHU_DisplayYN
                },
                selectedValue: '',
                pageNumber: obj.Page_Number,
                IsHorizontal: obj.AHU_Misc1 === 'Horizontal' ? true : false,
              });
              break;
            case 'Label':
              obj.AHU_Control = 'label';
              this.MockForm.push({
                tagName: obj.AHU_Misc1,
                sequenceNumber: Number(obj.AHU_Priority) + 4,
                sectionName: obj.AHU_Section,
                controlName: obj.AHU_DefaultValue,
                controlType: obj.AHU_Control, // AHU_Control
                valueType: obj.AHU_DataType,
                placeholder: '',
                validators: {
                  required: obj.AHU_MandatoryYN === 'Y' ? true : false,
                  visibility: obj.AHU_DisplayYN,
                  // minlength: 5,
                  maxlength: 5000,
                },
                selectedValue: '',
                pageNumber: obj.Page_Number,
              });
              break;

            case 'Date':
              obj.AHU_Control = 'Date';
              this.MockForm.push({
                tagName: obj.AHU_Misc1,
                sequenceNumber: Number(obj.AHU_Priority) + 4,
                sectionName: obj.AHU_Section,
                controlName: obj.AHU_DisplayName,
                controlType: obj.AHU_Control, // AHU_Control
                valueType: obj.AHU_DataType,
                placeholder: '',
                validators: {
                  required: obj.AHU_MandatoryYN === 'Y' ? true : false,
                  // minlength: 5,
                  maxlength: 5000,
                  visibility: obj.AHU_DisplayYN
                },
                selectedValue: '',
                pageNumber: obj.Page_Number,
              });
              break;
            case 'Document Upload':
              obj.AHU_Control = 'Document_Upload';
              let IsDocUploadDefaultValuePresentInDocUploadList =
                false;
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
                sectionName: obj.AHU_Section,
                controlName: obj.AHU_DefaultValue,
                controlType: obj.AHU_Control, // AHU_Control
                valueType: obj.AHU_DataType,
                placeholder: '',
                validators: {
                  required: obj.AHU_MandatoryYN === 'Y' ? true : false,
                  // minlength: 5,
                  maxlength: 5000,
                  visibility: obj.AHU_DisplayYN
                },
                selectedValue: '',
                pageNumber: obj.Page_Number,
                DocUploadValue: IsDocUploadDefaultValuePresentInDocUploadList,
                docUploadValuelabel: DocUploadDefaultValueLabel,
                sectionwiseSequenceNo: this.sectionwiseSequenceNo++,
                DGT_ID: ''
              });
              this.eventList.forEach(element => {
                if (element.Event_Name === DocUploadDefaultValueLabel) {
                  this.docUploadDD.push(element.Event_Code);
                }
              });
              break;
          }
        });
        this.InitMockForm();
        if (IsLoadedMode === 1) { // Need to load form filling status after this
          this.fnLoadCurrerntFormFilling();
        } else if (IsLoadedMode === 0) {

        }
      }
    });
  }

  fnLoadCurrerntFormFilling() {
    try {
      this.afs.GetClientSetupformSavedForFutureKetan(this.UserName).subscribe(res => {
        if (res.GetDataResult !== '[]') {
          const serviceDataOBJ = JSON.parse(res.GetDataResult)[0];
          const IsProfileSubmitted = false;

          if (!IsProfileSubmitted) { // Checking profile is submitted or not
            const keyData = Object.keys(serviceDataOBJ);
            keyData.forEach((element) => {
              if (element) {
                this.MockForm.forEach(mockformelement => {
                  if (mockformelement.tagName === element) {
                    mockformelement.selectedValue = serviceDataOBJ[element];
                    if (mockformelement.controlType === 'selectmultiple' && mockformelement.selectedValue !== '') {
                      mockformelement.selectedValueArray = mockformelement.selectedValue.split('~');
                      mockformelement.selectedValueArray.forEach(eleselectedValueArray => {
                        mockformelement.options.forEach(eleOptions => {
                          if (eleselectedValueArray === eleOptions.value) {
                            eleOptions.Ischecked = true;
                          }
                        });

                      });
                      mockformelement.selectedValue = mockformelement.selectedValue.split('~').join(' | ');
                    }
                    if (mockformelement.controlType === 'radio' && mockformelement.selectedValue !== '' && mockformelement.selectedValue !== null) {
                      mockformelement.options.forEach(eleOptions => {
                        if (mockformelement.selectedValue === eleOptions.value) {
                          eleOptions.Ischecked = true;
                        }
                      });
                    }
                    if (mockformelement.controlType === 'numberdecimal' && mockformelement.selectedValue !== '' && mockformelement.selectedValue !== null) {
                      // mockformelement.selectedValue = this.cfs.FormatNumberr(mockformelement.selectedValue); 
                    }
                    if (mockformelement.controlType === 'select' && mockformelement.selectedValue !== '' && mockformelement.selectedValue !== null) {
                      mockformelement.selectedValue = (mockformelement.selectedValue)[0].toUpperCase() + (mockformelement.selectedValue).substring(1)
                    }
                  }
                  if (mockformelement.controlName === 'Client Risk Profile') {
                    mockformelement.selectedValue = (serviceDataOBJ.RiskProfile)[0].toUpperCase() + (serviceDataOBJ.RiskProfile).substring(1);
                    mockformelement.validators.disabled = true;
                  }
                });

                if (element === 'NoteMasterID') {
                  this.NoteMasterID = serviceDataOBJ[element];
                }

              }
            });

            this.sort_by_key(this.MockForm, 'pageNumber');
            this.fnGetAttachedDocuments();
          }

        } else {
          // No data received

        }
        this.fnIsPageDataLoaded();
      });
    } catch (ex) {
      console.log('Error generated in fnLoadCurrerntFormFilling function as:', ex);
    }

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
        this.SectionHeaders.push({
          SectionName: formControl.sectionName,
          pageNumber: formControl.pageNumber,
        });
      }
    });
    this.sort_by_key(this.SectionHeaders, 'pageNumber');
    // this.SectionHeaders.forEach((ele, index) => {
    //   if (ele.SectionName === 'Required Documents') {
    //     this.SectionHeaders.splice(index, 1);
    //   }
    // });
    // this.SectionHeaders.push({
    //   SectionName: 'Required Documents',
    //   pageNumber: '2',
    // });

    this.fnFillValuesIntoForm();

    // this.form = new FormGroup(this.formGroup);
  }

  fnGetAttachedDocuments() {
    try {
      if (sessionStorage.getItem('NoteMasterID') !== undefined && sessionStorage.getItem('NoteMasterID') !== null) {
        this.NoteMasterID = sessionStorage.getItem('NoteMasterID');
      }
    } catch (ex) {
      console.log('Error while getting NoteMasterID for documents fetching process: ', ex);
    }
    if (this.NoteMasterID !== null && this.NoteMasterID !== undefined && this.NoteMasterID !== '') {
      this.ds.ProductAttachmentList(this.NoteMasterID);
      this.getFactsheetDataSubscriber = this.ds.getFactsheetDataObserver.subscribe((res) => {
        if (res) {
          try {
            if (res.length > 0) {
              this.documents = [];
              res.forEach((element) => {
                this.documents.push(element);
              });
              this.MockForm.forEach(ele => {
                if (ele.controlType === 'Document_Upload') {
                  this.eventList.forEach((element) => {
                    if (element.Event_Code === ele.controlName) { // found event name
                      this.documents.forEach(docele => {
                        if (docele.Event_Code.toUpperCase() === (ele.controlName + '').toUpperCase()) {
                          ele.selectedValue = docele.Document_Output_Path;
                          ele.DGT_ID = docele.DGT_ID;
                        }
                      });

                    }
                  });
                }
              });
              // console.log(this.MockForm);
            }
          } catch (ex) {
            console.log('Error occured in My profile page while retriving documents from server', ex);
          }
        }
      });
    }
  }

  showCheckboxes(Controlname: any) {
    const checkboxes = document.getElementById(Controlname);
    const selectControlID = document.getElementById('select_' + Controlname);

    if (checkboxes.style.display === 'none') {
      document.getElementById(Controlname).style.display = 'block';
      selectControlID.classList.add('selectddl');
      // this.expanded = true;
    } else {
      document.getElementById(Controlname).style.display = 'none';
      selectControlID.classList.remove('selectddl');
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
    this.displayClass = document.getElementById(Controlname).style.display;
    // console.log(document.getElementById(Controlname).style.display);
  }

  closeCheckboxes(Controlname: any) {
    document.getElementById(Controlname).style.display = 'none';
    this.displayClass = document.getElementById(Controlname).style.display;
  }

  CheckBoxValue(e, inputField) {
    const target: any = this.GetEventTarget(e);
    if (target.checked === true) {
      inputField.selectedValueArray.push(target.value);
    } else {
      inputField.selectedValueArray.forEach((element, i) => {
        if (element === target.value) {
          inputField.selectedValueArray.splice(i, 1);
        }
      });
    }
  }
  RemoveCheckBoxValue(item, inputField){
    inputField.selectedValueArray.forEach((element, i) => {
      if (element === item) {
        inputField.Ischecked = false;
        inputField.selectedValueArray.splice(i, 1);
      }
    });

    inputField.options.forEach((element) => {
      if (element.value === item) {
        element.Ischecked = false;
      }
    });

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
        element.Ischecked = true;
      } else {
        element.Ischecked = false;
      }
    });
    input.selectedValue = SourceValue;

  }
  ClickOnLabelofRadiobutton(input: any, SourceValue: string) {
    input.options.forEach((element) => {
      if (element.value === SourceValue) {
        element.Ischecked = true;
      } else {
        element.Ischecked = false;
      }
    });
    input.selectedValue = SourceValue;
  }

  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      const x = a[key]; const y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  eventChange(event, i) {
    this.docUploadDD[i] = event.target.value;
  }

  fnFillValuesIntoForm() {

    this.MockForm.forEach((obj) => {
      try {
        if (Object.keys(this.ClientSetupProfileValues).length !== 0 && obj.controlType === 'selectmultiple') {
          obj.selectedValueArray = (this.ClientSetupProfileValues[obj.tagName] + '').split('~');
        } else {
          obj.selectedValue = this.ClientSetupProfileValues[obj.tagName];
        }
      } catch (e) { }
    });

  }
  showFile(DGTID) {
    // const noteMasterID = sessionStorage.getItem('NoteMasterID');
    const Link =
      'http://' + environment.domainURL + '/FinIQService/RMWorkstation_JSON.svc/Get_Uploaded_Documents_API/' +
      this.NoteMasterID +
      '/' +
      DGTID;

    window.open(Link);
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
  BackToMyProfile() {
    if (this.IsRMLoggedIN) {
      this.editProfileCancelled.emit(false);
    } else {
      this.router.navigate(['/customersetupview']);
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
  saveDetails() {
    try {
      this.JSONtoXMLObj = {
        ExcelSheets: {
          Initial_Evaluation: {},
        },
      };
      this.JSONtoXMLObj.ExcelSheets.Initial_Evaluation.CSS_Login_ID = this.UserName; // Default insert CustomerID
      this.ClientSetupFormfromService.forEach((CSFObj) => {
        if (CSFObj.AHU_Misc1 !== '') {
          this.Key = CSFObj.AHU_Misc1;
          this.MockForm.forEach((MockObj) => {
            if (MockObj.controlName === CSFObj.AHU_DisplayName) {
              if (CSFObj.AHU_Control === 'selectmultiple') {
                this.JSONtoXMLObj.ExcelSheets.Initial_Evaluation[this.Key] =
                  this.ArrayToString(MockObj.selectedValueArray);
              } else {
                this.JSONtoXMLObj.ExcelSheets.Initial_Evaluation[this.Key] =
                  MockObj.selectedValue;
              }
            }
          });
        }
      });

      this.afs.ClearObserversonValidateUserPage();

      // if (saveMode === 'Insert') {
      //   this.afs.saveNewOrder(
      //     this.JSONtoXMLObj,
      //     this.UserName,
      //     'Initial_Evaluation',
      //     'Insert',
      //     0
      //   );
      // } else {
      this.afs.saveNewOrder(
        this.JSONtoXMLObj,
        this.UserName,
        'Initial_Evaluation',
        'Update',
        this.NoteMasterID
      );
      Number(sessionStorage.getItem('NoteMasterID'))
      // }
    } catch (ex) {
      console.log(ex);
      // this.Message ='Error occurred while processing the request. Please contact the system administrator.';
    }
  }
  fnSaveForFuture() {
    const JSONToString: any = {};
    this.ClientSetupFormfromService.forEach((CSFObj) => {
      if (CSFObj.AHU_Misc1 !== '') {
        this.Key = CSFObj.AHU_Misc1;
        this.MockForm.forEach((MockObj) => {
          if (MockObj.controlName === CSFObj.AHU_DisplayName) {
            if (CSFObj.AHU_Control === 'selectmultiple') {
              JSONToString[this.Key] = this.ArrayToString(MockObj.selectedValueArray);
            } else {
              JSONToString[this.Key] = MockObj.selectedValue;
            }
          }
        });
        JSONToString.LoginId = this.UserName;
        if (this.NotteMasterID !== '' && this.NotteMasterID !== null && this.NotteMasterID !== undefined) {
          JSONToString.NoteMasterID = this.NotteMasterID;
        }
      }
    });
    this.afs.SetClientSetupformSavedForFuture(this.UserName, JSON.stringify(JSONToString)).subscribe((res) => {
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
  uploadDoc() {
    if (
      this.UserName !== '' &&
      this.NoteMasterID !== '' &&
      this.NoteMasterID !== undefined &&
      this.NoteMasterID !== null
    ) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.uploadFileData.length; i++) {
        // console.log(username, HomeEntityID, HomeEntityName, noteMasterID, this.uploadFileData[i].EventCode, this.uploadFileData[i].Name, this.uploadFileData[i].FileDetails);
        this.afs.AttachDocument(
          this.UserName,
          sessionStorage.getItem('HomeEntityID'),
          sessionStorage.getItem('HomeEntityName'),
          this.NoteMasterID,
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
  fnIsPageDataLoaded() {
    if (this.ClientSetupFormfromService.length > 0 && this.SectionHeaders.length > 0 && this.ClientSetupProfileValues !== {}) {
      this.IsPagedataLoaded = true;
    }
  }
  ClosePopup(Controlname: any) {
    // var checkboxes = document.getElementById(Controlname);
    try {
      document.getElementById(Controlname).style.display = 'none';
      const selectControlID = document.getElementById('select_' + Controlname); // for neumorphism
      selectControlID.classList.remove('selectddl'); // for neumorphism
    } catch (ex) {
      console.log('Error occured while closing the pop up: ', ex);
    }

    // this.MockForm.forEach((obj) => {
    //   if (obj.controlType === 'selectmultiple' && document.getElementById(obj.controlName).style.display === 'block') {
    //     document.getElementById(obj.controlName).style.display = 'none';
    //   }
    // });
    //  console.log('Clicked outside');
    // this.displayClass = document.getElementById(Controlname).style.display;
  }
  fnSetDOB(inputDate) {
    return this.datepipe.transform(inputDate, 'dd-MMM-yyyy');
  }
}
