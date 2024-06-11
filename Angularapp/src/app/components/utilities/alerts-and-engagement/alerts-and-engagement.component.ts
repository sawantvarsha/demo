import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertsAndEngagementService } from 'src/app/services/alerts-and-engagement.service';
import { DatePipe } from '@angular/common';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { Subscription } from 'rxjs';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { AppConfig } from 'src/app/services/config.service';
//Changed By MohanP | 04Feb22
@Component({
  selector: 'app-alerts-and-engagement',
  templateUrl: './alerts-and-engagement.component.html',
  styleUrls: ['./alerts-and-engagement.component.scss'],
})
export class AlertsAndEngagementComponent implements OnInit {
  CompanyLogo: string;
  selectedCustomerDetails: any = [];
  RMCustomerID: any;
  RMCustomerName: any;
  emailID: any;
  subject: any;
  emailBody: any;
  loadflag: boolean;
  PDFLink: any;
  PnLPDFLink: any;
  PdfURL: any;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  emailMsg = '';
  interfaceUrl = environment.interfaceURL;
  Format = 'PDF';
  showEmailPopup = false;

  CustomerID = '';
  CustomerName = '';

  ScheduledOption = 'Onetime';
  selected_frequency_option = 'Daily';
  SelectedTab = 'video';
  RMid: any = '12';
  RMName: any;
  frequency_no = 2;

  today = new Date();
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
  date =
    this.today.getDate() +
    '-' +
    this.months[this.today.getMonth()] +
    '-' +
    this.today.getFullYear();

  currDate: any;
  StartDate: any;
  EndDate: any;

  showAlertFlag = false;

  alertsList = [];
  AtTime: any;
  successMsg = '';
  editAlert: any = [];

  showEditAlert = false;
  selectedCustomer = '';

  clientSelectionMode = 'Single Client';

  multi_select_customer: any = [];
  selectedCustomerCheck: any = [];

  showDescription = false;

  //File upload

  fileUploaded: number[] = [0];
  fileChosen: number[] = [0];
  uploadFileData: any[] = [];
  bytedata: any[] = [];
  docUploadDD = [];
  dropDownList = [] as any;

  AdditionalDocList: any[] = [];
  sectionwiseSequenceNo = 1;

  eventList: any = [];
  LoginID: string = '';
  NoteMasterID: string = '';
  AttachDocumentSubscriber: Subscription;
  GetFactSheetSubscriber: Subscription;
  isAttachDocument: boolean;
  files: NgxFileDropEntry[] = [];
  SelectedfileNames: any;

  byteCode = '';

  UploadMsg = '';
  DGTID = '';
  Link = '';
  Attachment = '';
  attachmentMsg = '';
  NoteMasterIDMultiple = [];

  constructor(
    private alertApi: AlertsAndEngagementService,
    public datePipe: DatePipe,
    public utilitiesApi: UtilitiesService,
    public homeApi: HomeApiService,
    public custApi: CustomerApiService,
    public authApi: AuthService,
    public commonApi: CommonApiService,
    public afs: CustomerApiService,
    public http: HttpClient,
    public workflowApi: WorkflowApiService
  ) {
    try {
      this.alertsList = [];

      this.CompanyLogo = sessionStorage.getItem('CompanyLogo');
      // this.LoginID = sessionStorage.getItem('RMUser');

      this.LoginID = this.authApi.UserName;
      this.NoteMasterID = this.homeApi.NoteMasterID;
      // this.NoteMasterID = sessionStorage.getItem('NoteMasterID');
      console.log(
        'login..',
        this.LoginID,
        this.NoteMasterID,
        this.authApi.UserName
      );

      // this.emailID = sessionStorage.getItem('EmailID');
    } catch (EX) {
      this.CompanyLogo = 'SHC';
    }
  }

  async ngOnInit() {
    this.loadflag = true;
    this.RMCustomerID = '';
    this.RMCustomerName = '';
    this.subject = '';
    this.emailBody = '';
    this.emailID = 'handore.ashwini@finiq.com';
    this.uploadFileData = [];

    this.currDate = new Date();
    this.currDate = this.datePipe.transform(this.date, 'dd-MMM-YYYY');

    this.StartDate = this.datePipe.transform(this.date, 'dd-MMM-YYYY');

    this.EndDate = this.datePipe.transform(this.date, 'dd-MMM-YYYY');
    console.log('FromDate & ToDate', this.StartDate, this.EndDate);

    console.log('Dates', this.currDate, this.StartDate, this.EndDate);

    this.homeApi.RMID = await this.custApi.GetRMIDFromUsername(
      this.authApi.UserName
    );
    console.log('rmid in alert', this.homeApi.RMID);

    this.LoginID = this.authApi.UserName;

    // this.NoteMasterID = this.homeApi.NoteMasterID;

    this.LoginID = 'Arctic';
    this.NoteMasterID = '557';
    console.log(
      'login..',
      this.LoginID,
      this.NoteMasterID,
      this.authApi.UserName,
      this.homeApi.NoteMasterID
    );

    this.getScheduledAlertsEngagements('');

    console.log('homeapi ', this.homeApi.CustomerMappedToRM);
    // for(let i = 0; i< this.alertsList.length; i++){
    //   this.editAlert[i] = false;
    // }
  }

  changeFromDate(_e) {
    this.clearErrorMsg();
    this.StartDate = this.datePipe.transform(this.StartDate, 'dd-MMM-YYYY');
    this.EndDate = this.datePipe.transform(this.EndDate, 'dd-MMM-YYYY');
  }

  sendEmail() {
    this.showEmailPopup = true;
    console.log(
      'Email ',
      this.subject,
      this.RMCustomerName,
      this.emailBody,
      this.emailID
    );
    if (
      this.RMCustomerName != '' &&
      this.subject != '' &&
      this.emailBody != ''
    ) {
      this.loadflag = true;
      this.alertApi.sendEmailUsingEmailSetting(
        this.RMCustomerName,
        this.subject,
        this.emailBody,
        this.emailID
      ); //Call to sendEmail service
      this.emailMsg = 'Email sent succesfully!';
    } else if (this.RMCustomerName === '') {
      this.loadflag = false;
      this.emailMsg = 'Please select customer';
    } else if (this.subject === '') {
      this.loadflag = false;
      this.emailMsg = 'Please enter subject';
    } else if (this.emailBody === '') {
      this.loadflag = false;
      this.emailMsg = 'Please enter message';
    }
  }

  getPDF() {
    // this.PdfURL = this.http.get<any>(this.interfaceUrl + '/'+ 'sample' + + this.Format, { headers: this.headerOptions });
    this.PdfURL.subscribe((res) => {
      if (res) {
        // console.log(res);
        this.PDFLink = res.URL;
        window.open(this.PDFLink);
      }
    });
  }

  getCustomerDetails(res) {
    if (res.length > 0) {
      this.selectedCustomerDetails = [];
      this.selectedCustomerDetails = res;
      // console.log('customer details', res);
    }
  }

  selectedArrayList(e) {
    console.log('array', e);
    this.selectedCustomerCheck = e;
  }

  selectedCustomerValue1(e) {
    this.loadflag = true;

    if (this.clientSelectionMode === 'Single Client') {
      console.log(e);
      this.RMCustomerID = e.CustomerID;
      this.RMCustomerName = e.CustomerName.split('|')[0];
      // this.RMCustomerName = e.CustomerName;
      this.emailID = e.EmailID;
      this.RMName = e.RM;
      console.log(
        'Alert Customers...',
        e,
        this.RMCustomerID,
        this.RMCustomerName,
        this.emailID,
        this.RMName
      );
    }
  }

  selectedCustomerValueMulti(e) {
    this.loadflag = true;

    if (this.clientSelectionMode === 'Multi-Client') {
      console.log(e);
      // const checkedCustomer = e.filter(a => a.CustFlag).map(c => c);
      // console.log("checked in alerts", checkedCustomer)
      // this.multi_select_customer = checkedCustomer;
      // console.log("checked in alerts", checkedCustomer, this.multi_select_customer);

      // Changes on 17 Feb 2022
      this.multi_select_customer = e;
      console.log('Inside multiselect', this.multi_select_customer);
    }
  }

  clearData() {
    // this.RMCustomerName = '';

    if (this.loadflag === true) {
      this.subject = '';
      this.emailBody = '';
      this.emailID = '';
      this.emailMsg = '';
      this.loadflag = true;
    }
  }

  changeScheduleEmailOption(e: any) {
    this.clearErrorMsg();
    this.ScheduledOption = e.target.value;
  }

  changeClientSelectionMode(e: any) {
    this.clientSelectionMode = e.target.value;
    this.multi_select_customer = [];
    this.selectedCustomerCheck = [];
    this.emailMsg = '';
    this.successMsg = '';
    this.UploadMsg = '';
    this.attachmentMsg = '';
  }

  showAlerts() {
    this.showAlertFlag = true;
  }

  closeAlertsPopup() {
    this.showAlertFlag = false;
    this.showEditAlert = false;
    this.showDescription = false;
    this.emailMsg = '';
    this.successMsg = '';
    this.UploadMsg = '';
    this.attachmentMsg = '';
    this.subject = '';
    this.emailBody = '';
    // this.alertsList = [];
    this.ScheduledOption = 'Onetime';
    this.selected_frequency_option = '';
    this.multi_select_customer = [];
    this.selectedCustomerCheck = [];
  }

  getScheduledAlertsEngagements(SelectedCustomerID) {
    console.log(
      'RMI, Customer ID',
      this.homeApi.RMID,
      this.CustomerID,
      SelectedCustomerID
    );

    this.utilitiesApi
      .Get_ClientAlertEngagementDetails(this.homeApi.RMID, '')
      .subscribe((res: any) => {
        console.log(res);
        if (res) {
          this.alertsList = res;
          this.alertsList.forEach((a) => {
            const longname = this.homeApi.CustomerMappedToRM.find(
              (c) => c.CustomerID === parseInt(a.CAE_Customer_ID)
            );
            a.CustomerName = [null, undefined].includes(longname)
              ? ''
              : longname.LongName;
          });
          // console.log(
          //   'Alert list...',
          //   this.alertsList
          // );
        }
      });
  }

  scheduleEmail() {
    if ([undefined, [], '', null].includes(this.bytedata)) {
      this.byteCode = '';
    } else {
      this.byteCode = this.Link;
    }

    if (this.clientSelectionMode === 'Single Client') {
      if (this.subject != '') {
        this.utilitiesApi
          .Insert_ClientAlertEngagementDetails(
            'Y',
            this.ScheduledOption,
            this.byteCode,
            this.currDate,
            this.RMName,
            this.RMCustomerID,
            this.emailBody,
            this.EndDate,
            ['ONETIME', 'SCHEDULED'].includes(
              this.ScheduledOption.toUpperCase()
            )
              ? ''
              : this.selected_frequency_option,
            '1',
            '18-Jan-2019',
            'RM1',
            this.homeApi.RMID,
            this.StartDate,
            this.subject
          )
          .subscribe((res: any) => {
            console.log(res);
            if (res) {
              console.log('Response insert alert ', res);

              if (res === true) {
                this.successMsg = 'Alert Saved';
                this.getScheduledAlertsEngagements(this.RMCustomerID);
              }
            }
          });
      }
    } else if (this.clientSelectionMode === 'Multi-Client') {
      for (let i = 0; i < this.multi_select_customer.length; i++) {
        if (this.subject != '') {
          this.utilitiesApi
            .Insert_ClientAlertEngagementDetails(
              'Y',
              this.ScheduledOption,
              this.byteCode,
              this.currDate,
              this.multi_select_customer[i].RMName,
              this.multi_select_customer[i].CustomerID,
              this.emailBody,
              this.EndDate,
              ['ONETIME', 'SCHEDULED'].includes(
                this.ScheduledOption.toUpperCase()
              )
                ? ''
                : this.selected_frequency_option,
              '1',
              '18-Jan-2019',
              'RM1',
              this.homeApi.RMID,
              this.StartDate,
              this.subject
            )
            .subscribe((res: any) => {
              console.log(res);
              if (res) {
                console.log('Response insert alert ', res);

                if (res === true) {
                  this.successMsg = 'Alert Saved';
                  this.getScheduledAlertsEngagements(
                    this.multi_select_customer[i].CustomerID
                  );
                }
              }
            });
        }
      }
    }

    console.log('customer', this.RMCustomerName);
  }
  refresh() {
    this.getScheduledAlertsEngagements('');
  }

  showEditAlertFn(i: any) {
    this.showEditAlert = !this.showEditAlert;
    this.subject = this.alertsList[i].CAE_Subject;
    this.ScheduledOption = this.alertsList[i].CAE_Alert_Type;
    this.StartDate = this.alertsList[i].CAE_Start_Datetime;
    this.EndDate = this.alertsList[i].CAE_End_Datetime;
    this.selected_frequency_option = this.alertsList[i].CAE_Frequency;
    this.emailBody = this.alertsList[i].CAE_Description;
    this.selectedCustomer = this.alertsList[i].CustomerName;
  }

  showDescriptionFn(i: any) {
    this.showDescription = !this.showDescription;
    this.subject = this.alertsList[i].CAE_Subject;
    this.ScheduledOption = this.alertsList[i].CAE_Alert_Type;
    this.StartDate = this.alertsList[i].CAE_Start_Datetime;
    this.EndDate = this.alertsList[i].CAE_End_Datetime;
    this.selected_frequency_option = this.alertsList[i].CAE_Frequency;
    this.emailBody = this.alertsList[i].CAE_Description;
    this.selectedCustomer = this.alertsList[i].CustomerName;
  }

  clearErrorMsg() {
    this.emailMsg = '';
    this.successMsg = '';
    this.UploadMsg = '';
    this.attachmentMsg = '';
  }

  //Document Upload

  fileSelectionFunction(event: any) {
    let fileData: any;
    fileData = [];

    console.log('..', event);
    this.fileUploaded[this.fileUploaded.length - 1] = 1;
    fileData.Name = event.target.files[0].name;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    // for (let i = 0; i < this.eventList.length; i++) {
    //   if (this.eventList[i].Event_Code === this.docUploadDD[i]) {
    //     fileData.EventCode = this.eventList[i].Event_Code;
    //     fileData.EventName = this.eventList[i].Event_Name;
    //   }
    // }

    fileData.EventCode = 'AlertSetup';
    this.getByteArray(event.target.files[0])
      .then((byteArray) => {
        let jsonObject: any;
        jsonObject = { ImgData: byteArray };
        this.bytedata = jsonObject.ImgData;
        fileData.FileDetails = this.bytedata;
        this.uploadFileData.push(fileData);

        console.log('upload file data..', this.uploadFileData);
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

        console.log('fileByte', fileByteArray);
      };
      fileReader.onerror = reject; // call reject if error
    });
  }

  async uploadDoc(Index: number) {
    if (this.clientSelectionMode === 'Multi-Client') {
      // this.multi_select_customer.forEach((a) => {
      //   const longname = this.homeApi.CustomerMappedToRM.find(
      //     (c) => c.CustomerID === a.CustomerID
      //   );
      //   console.log("multi", longname)
      // })

      console.log(this.multi_select_customer);

      this.multi_select_customer.forEach((f) => {
        this.NoteMasterIDMultiple.push(
          this.homeApi.CustomerMappedToRM.find(
            (t) => t.CustomerID === parseInt(f.CustomerID)
          )
        );
      });

      for (let i = 0; i < this.NoteMasterIDMultiple.length; i++) {
        for (let j = 0; j < this.uploadFileData.length; j++) {
          const documnetUploadRes = await this.afs.AttachDocumentAsync(
            this.NoteMasterIDMultiple[i].CustomerName,
            sessionStorage.getItem('HomeEntityID'),
            sessionStorage.getItem('HomeEntityName'),
            this.NoteMasterIDMultiple[i].Notemasterid,
            'AlertSetup',
            this.uploadFileData[j].Name,
            this.uploadFileData[j].FileDetails
          );
          console.log('uploaded res', documnetUploadRes);

          if (documnetUploadRes) {
            this.UploadMsg = 'Uploaded Successfully';
            this.fnProductAttachmentListWTO(this.NoteMasterID);
            // this.ErrorMsgVanish();
          }
          // this.AttachDocumentSubscriber =
          //   this.afs.AttachDocumentsObservable.subscribe((res: any) => {
          //     if (res) {
          //       this.UploadMsg = 'Uploaded Successfully';
          //       this.fnProductAttachmentListWTO(this.NoteMasterID);
          //       console.log('uploaded successfully', res);
          //       // this.ErrorMsgVanish();
          //     }
          //   });
        }
      }
    } else if (this.clientSelectionMode === 'Single Client') {
      const notemasterid = this.homeApi.CustomerMappedToRM.find(
        (c) => c.CustomerID === parseInt(this.RMCustomerID)
      );

      this.NoteMasterID = notemasterid.Notemasterid;

      console.log(
        'login details',
        this.LoginID,
        this.NoteMasterID,
        Index,
        notemasterid,
        this.RMCustomerID
      );

      for (let j = 0; j < this.uploadFileData.length; j++) {
        const documnetUploadRes = await this.afs.AttachDocumentAsync(
          this.RMCustomerName,
          sessionStorage.getItem('HomeEntityID'),
          sessionStorage.getItem('HomeEntityName'),
          this.NoteMasterID,
          'AlertSetup',
          this.uploadFileData[j].Name,
          this.uploadFileData[j].FileDetails
        );
        console.log('uploaded res', documnetUploadRes);

        if (documnetUploadRes) {
          this.UploadMsg = 'Uploaded Successfully';
          this.fnProductAttachmentListWTO(this.NoteMasterID);
          // this.ErrorMsgVanish();
        }
        // this.AttachDocumentSubscriber =
        //   this.afs.AttachDocumentsObservable.subscribe((res: any) => {
        //     if (res) {
        //       this.UploadMsg = 'Uploaded Successfully';
        //       this.fnProductAttachmentListWTO(this.NoteMasterID);
        //       console.log('uploaded successfully', res);
        //       // this.ErrorMsgVanish();
        //     }
        //   });
      }
    }
  }

  fnProductAttachmentListWTO(NoteMasterID) {
    this.workflowApi.ProductAttachmentListWTO(NoteMasterID).subscribe((res) => {
      try {
        if (res.length > 0) {
          console.log('pdf path', res);
          for (let i = 0; i < res.length; i++) {
            if (
              res[i].Event_Code === 'ALERTSETUP' &&
              res[i].Note_Ref_ID === NoteMasterID
            )
              this.DGTID = res[i].DGT_ID;
          }

          this.Link =
            'http://' +
            AppConfig.settings.CSP_FXPricingURL +
            '/FinIQService/RMWorkstation_JSON.svc/Get_Uploaded_Documents_API/' +
            this.NoteMasterID +
            '/' +
            this.DGTID;

          console.log('link', this.Link);
        }
      } catch (ex) {}
    });
  }

  showPDF(index) {
    this.Attachment = this.alertsList[index].CAE_Attachment;
    if (this.Attachment === '') {
      this.attachmentMsg = 'No Attachment Found';
    } else {
      window.open(this.Attachment);
    }
  }
}
