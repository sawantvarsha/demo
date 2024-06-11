import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { WorkflowUCPService } from 'src/app/services/workflow-ucp.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { CommonApiService } from 'src/app/services/common-api.service';
import { ExcelService } from 'src/app/services/excel.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { AuthService } from '../../services/auth/auth.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DownloadService } from 'src/app/services/download.service';
import { environment } from 'src/environments/environment';
import { AppConfig } from 'src/app/services/config.service';
import { Router } from '@angular/router';
import { FxdApifunctionService } from '../FXD/services/fxd-apifunction.service';
import { Location } from '@angular/common';
import { filter } from 'd3';
import { EqcApifunctionService } from '../structured-products/Services/eqc-apifunction.service';
import { FxdCommonfunctionsService } from '../FXD/services/fxd-commonfunctions.service';

import { isNullOrUndefined } from 'is-what';

import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-workflow-ucp',
  templateUrl: './workflow-ucp.component.html',
  styleUrls: ['./workflow-ucp.component.scss'],
})
export class WorkflowUCPComponent implements OnInit, OnDestroy {
  @Input() dynamicWorkflow: boolean;
  @Input() workflowname: string;
  ngxXml2jsonServices: NgxXml2jsonService;
  actionbtns: any[];
  showActions = [];
  oMenuDetails: any;
  strButtonID: any;
  strButtonName: string;
  strButtonCaption: any;
  strFunctionName: any;
  btnMode: any;
  selectedWorkflow: any;
  WorkflowDataUCPSubscription: Subscription;
  workflowsUCPSubscription: Subscription;
  GetCSPEventsSubscription: Subscription;
  interfaceURL: string = environment.interfaceURL;
  OrderIndex: any; 
  isUserRM: boolean;
  userType: string;
  customFilter: string;
  CustomerName: any;
  selectedQueueColor: any;

  JouneyClickFlag: boolean;
  Wf_TokenID: any;

  TermsheetSubscriber: any; 
  UserGroup: any;
  
  showWorkflowList = true
  showQueueList = true
  isEvtFilter = true
  datefilterName: string = 'Trade_Date';
  
  sTokenToSearch: string = '';
  TokenCount: any;
  TotalPageCount: number;
  SelectedQueueIndex: string = '';
  cardsRefreshedAt: Date = new Date()
  checktime: boolean = false;
  
  showPersonalSettings = false
  
  showMoreFilters = false;
  filterInfo = []
  
  exportSubscriber: any;
  exportInprogress = false
  templateDetailSubscriber: any;
  products: any;
  selectedTID = '%%'
  selectedEID: any;
  entities: any;
  entityDataSubscriber: any;
  autoRefresh: any = 10;
  autoRefreshActive: boolean = false;
  modeButtonDetailsSubscription: any;
  interval: NodeJS.Timeout;
  loadQueuesFromCustomSettings: boolean;
  showActionBtns: boolean;
  showModal: boolean;
  params: any;
  getWorkflowCustomSettingsSub: any;
  QueuesUCPSub: Subscription;
  WorkflowMetadataUCPSub: any;
  
  showPopup: boolean;
  showWFFind: boolean;
  searchToken: string;
  dispPrioritySub: Subscription; 
  
  tokenidUsed: string;
  ButtonDetails: any[] = [];
  url: string;
  pageURL: SafeResourceUrl;
  strFuncName: string = '';
  msgFlag: boolean = true;
  @ViewChild("UCP_Popup") UCP_Popup: TemplateRef<any>;
  private UCP_PopupRef;
  
  constructor(
    public wfs: WorkflowUCPService,
    public cmnapis: CommonApiService,
    public excelService: ExcelService,
    public authapi: AuthService,
    public Cuct_afs: CustomerApiService,
    public Home_api: HomeApiService,
    public Workflow_api: WorkflowApiService,
    public ref: ChangeDetectorRef,
    public datePipe: DatePipe,
    public downloadApi: DownloadService,
    public _router: Router,
    public _fxdafs: FxdApifunctionService,
    public _fxdcfs: FxdCommonfunctionsService,
    public location: Location,
    public EQC_afs: EqcApifunctionService,
    public sanitizer: DomSanitizer, 
    public dialog: MatDialog, 

  ) {
    this.actionbtns = [];
    this.dynamicWorkflow = false;
    this.workflowname = '';
    this.Wf_TokenID = '';
    this.selectedEID = '0' 
  }

  UserID: string;
  CustomerID: string;
  WorkflowList: any[];
  temp_WorkflowList: any;
  QueueList: any;
  temp_QueueList: any;
  FromDate: any;
  ToDate: any;

  selectedWorkflowId = '';
  selectedWorkflowType = '';
  selectedQueue = '';
  selectedQueueId = '';

  workflowMetadataArr = [];
  workflowMetadataHeaderNameArr = [];

  workflowMetadataArrCopy = [];  
  workflowMetadataHeaderNameArrCopy = [];
  
  workflowCustomData: any;
  temp_workflowCustomData: any;
  oMenuDet: any[] = [];
  errorMsg = '';
  successMsg = '';
  currDate: Date | undefined;

  isActive = [];
  eventList: any; 
  loaderFlag = true;
  showOrdersPopup = false; 

  pageNo = 1;
  recordsPerPage = 10;
  tempjson: any;
  jsonList: any;
  exporttoexceldata: any
  exporttoexcelflag = false;
  unlockNotemasterSubscriber: any; 

  unlockMSG: any = ''; 
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

  ngOnDestroy(): void {
    this.actionbtns = [];
    this.WorkflowList = [];
    this.workflowCustomData = [];
    this.workflowMetadataArr = [];
    this.workflowMetadataArrCopy = []; 
    
    this.clearData();
    if (this.WorkflowDataUCPSubscription) {
      this.WorkflowDataUCPSubscription.unsubscribe();
      this.WorkflowDataUCPSubscription = null;
    }
    if (this.workflowsUCPSubscription) {
      this.workflowsUCPSubscription.unsubscribe();
      this.workflowsUCPSubscription = null;
    }
    if (this.GetCSPEventsSubscription) {
      this.GetCSPEventsSubscription.unsubscribe();
      this.GetCSPEventsSubscription = null;
    }
    
    if (this.unlockNotemasterSubscriber) {
      this.unlockNotemasterSubscriber.unsubscribe()
    }
    this.unlockMSG = '';
    
    if (this.exportSubscriber) {
      this.exportSubscriber.unsubscribe()
    }
    
    if (this.modeButtonDetailsSubscription) {
      this.modeButtonDetailsSubscription.unsubscribe()
    }
    
    if (this.interval) {
      clearInterval(this.interval);
    }
    
    if (this.getWorkflowCustomSettingsSub) {
      this.getWorkflowCustomSettingsSub.unsubscribe()
    }
    if (this.QueuesUCPSub) {
      this.QueuesUCPSub.unsubscribe();
    }
    if (this.WorkflowMetadataUCPSub) {
      this.WorkflowMetadataUCPSub.unsubscribe();
    }
    
    if (this.dispPrioritySub) {
      this.dispPrioritySub.unsubscribe();
    }
    
  }
  ngOnInit(): void {

    this.fillEntityDDL() 
    
    this.UserGroup = sessionStorage.getItem('FinIQGroupID')
    this.CheckJourneyGraphfn();
    
    for (let i = 0; i < this.recordsPerPage; i++) {
      this.isActive[i] = true;
      this.showActions[i] = false;
    }
    this.loaderFlag = true;

    // Added by Mitali D - 13-09-2023 - FIN1EURINT-613 - START
    this.UserID = AppConfig?.settings.oRes.userName;
    sessionStorage.setItem('Username',this.UserID)
    // Added by Mitali D - 13-09-2023 - FIN1EURINT-613 - END
    // this.UserID = sessionStorage.getItem('Username');
    console.log('this.UserID---', this.UserID)
    this.CustomerID = sessionStorage.getItem('CustomerID');

    this.userType = sessionStorage.getItem('UserType');
    if (this.userType === 'RM') {
      this.UserID = sessionStorage.getItem('Username');
      console.log('this.UserID---', this.UserID)
      this.CustomerID = sessionStorage.getItem('CustomerID');
      this.wfs.customFilter = ''; 
    }
    // Changed by Mitali D - 11-09-2023 - FIN1EURINT-613 - START
    if(!isNullOrUndefined(this.userType)){
      this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
      if (!this.isUserRM) {
        
        this.UserID = sessionStorage.getItem('Username'); 
        console.log('this.UserID---', this.UserID)
        this.CustomerID = this.Home_api.CustomerId;
        this.CustomerName = this.Home_api.CustomerName;
        
        this.wfs.customFilter = ''; 
      }  
    }
     // Changed by Mitali D - 11-09-2023 - FIN1EURINT-613 - END
   
    this.currDate = new Date();
    const date = this.currDate; 

    this.FromDate = this.datePipe.transform(
      new Date(),
      'yyyy-MM-dd'
    );
    
    this.ToDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    
    this.getWorkflowCustomSettingsSub = this.wfs.getWorkflowCustomSettings(sessionStorage.getItem('Username')).subscribe(
      (res) => {
        // Changed by Mitali D - 21-09-2023 - FIN1EURINT-613 - START
        if(!isNullOrUndefined(res)){ 
          this.wfs.wflSettings = res[0] 
          this.FromDate = this.datePipe.transform(this.wfs.wflSettings.WCS_From_Date, 'yyyy-MM-dd');
          this.ToDate = this.datePipe.transform(this.wfs.wflSettings.WCS_To_Date, 'yyyy-MM-dd');
        // Changed by Mitali D - 21-09-2023 - FIN1EURINT-613 - END
          this.loadQueuesFromCustomSettings = true;
          this.recordsPerPage = this.wfs.wflSettings.WCS_Page_Size;
          this.showActionBtns = this.wfs.wflSettings.WCS_Action_Column === 'Show' ? true : false
        }
        this.wfs.loadWorkflowUCP(this.UserID);
      }
    )
    
    this.workflowsUCPSubscription = this.wfs.workflowsUCP.subscribe((res) => {
      this.WorkflowList = [];
      this.temp_WorkflowList = [];
      if (res.length !== 0) {
        
        this.WorkflowList = res.filter((w) => w.Value !== '' && w.Value !== 'Add On Workflow'); // Changed by Mitali D - 13-09-2023 - FIN1EURINT-613
        
        this.temp_WorkflowList = this.WorkflowList;
        
        if (!this.dynamicWorkflow) {

          let defaultWf: any;
          defaultWf = this.WorkflowList.find(x => x.WTM_Id === this.wfs.wflSettings.WCS_WTM_ID)
          if (!isNullOrUndefined(defaultWf)) {
            this.selectedWorkflow = defaultWf;
            this.selectedWorkflowId = this.selectedWorkflow.Id;
            this.selectedWorkflowType = this.selectedWorkflow.Value;
          }
          else {
            this.selectedWorkflow = this.WorkflowList[0];
            this.selectedWorkflowId = this.selectedWorkflow.Id;
            this.selectedWorkflowType = this.selectedWorkflow.Value;
          }
          this.fillProductDDL()
          
          this.wfs.loadQueuesUCP(
            this.selectedWorkflowId, 
            this.selectedEID, 
            this.FromDate,
            this.ToDate,
            this.selectedWorkflowType, 
            this.UserID,
            this.datefilterName 
            , this.sTokenToSearch 
            , this.selectedTID 
          );
          this.wfs.workflowBlotterMetaDataUCP(
            this.selectedWorkflowId, 
            this.UserID
          );
          
        }
        
        else {
          this.selectedWorkflow = this.WorkflowList.filter((w) =>
            w.Value.includes(this.workflowname)
          )[0];
          this.selectedWorkflowId = this.selectedWorkflow.Id;
          this.selectedWorkflowType = this.selectedWorkflow.Value;
          this.wfs.loadQueuesUCP(
            this.selectedWorkflow.Id,
            this.selectedEID, 
            this.FromDate,
            this.ToDate,
            this.selectedWorkflow.Value,
            this.UserID,
            this.datefilterName 
            , this.sTokenToSearch 
            , this.selectedTID 
          );
          this.wfs.workflowBlotterMetaDataUCP(
            this.selectedWorkflow.Id,
            this.UserID
          );
          this.wfs
            .getWorkflowDataDynamic(
              this.selectedWorkflow.Id,
              this.recordsPerPage,
              this.pageNo,
              this.selectedWorkflow.Value,
              this.FromDate,
              this.ToDate,
              this.UserID,
              '%%',
              this.wfs.customFilter 
              , this.sTokenToSearch 
              , this.selectedEID 
            )
            .subscribe((wd) => {
              let workflowdata = [];
              this.workflowCustomData = [];
              this.temp_workflowCustomData = [];
              if (wd.length !== 0) {
                this.loaderFlag = false;
                
                workflowdata = wd.NewDataSet.DUMMY;
                this.workflowCustomData = workflowdata;
                if (this.workflowCustomData !== undefined) {
                  if (this.workflowCustomData.length > 0) {
                    this.workflowCustomData.forEach((element) => {
                      if (element.Trade_x0020_Date) {
                        element.Trade_x0020_Date = element.Trade_x0020_Date.toString().split('T')[0];
                      }
                      if (element.Trade_Date) {
                        element.Trade_Date = element.Trade_Date.toString().split('T')[0];
                      }
                    });
                  }
                }

                this.temp_workflowCustomData = this.workflowCustomData;
                
                if (
                  this.workflowCustomData === '' ||
                  this.workflowCustomData === undefined
                ) {
                  this.errorMsg = 'No data found';
                  this.successMsg = '';
                } else {
                  
                  this.workflowCustomData.forEach((mainBlotter) => {
                    mainBlotter.actionbtns = [];
                    if (!isNullOrUndefined(mainBlotter.ACTIONS))  
                    {
                      mainBlotter.actionbtns.push(mainBlotter.ACTIONS.split(',')); // Changed by Mitali D - 22-09-2023 -   FIN1EURINT-613 
                    }
                  });
                }
              }
            });
          
        }

      }
    });

    this.QueuesUCPSub = this.wfs.QueuesUCP.subscribe((res) => {
      this.QueueList = [];
      this.temp_QueueList = [];
      if (res.length !== 0) {
        
        let queuesList = res.queues;
        for (let i = 0; i < queuesList.length; i++) {
          this.QueueList.push({
            Display_Name: queuesList[i].Display_Name,
            QM_ID: queuesList[i].QM_ID,
            QM_Name: queuesList[i].QM_Name,
          });
        }

        this.temp_QueueList = this.QueueList;

        if (this.loadQueuesFromCustomSettings) {
          let defaultQ = this.QueueList.find(x => x.QM_ID.toString() === this.wfs.wflSettings.WCS_QM_ID.toString())
          if (defaultQ) {
            this.SelectedQueueIndex = this.QueueList.findIndex(x => x.QM_ID.toString() === this.wfs.wflSettings.WCS_QM_ID.toString())
          }
          else {
            this.SelectedQueueIndex = ""
          }
          this.loadQueuesFromCustomSettings = false;
        }
        
        if (this.SelectedQueueIndex === "0" || this.SelectedQueueIndex === "") {
          this.selectedQueue = this.QueueList[0].Display_Name;
          this.selectedQueueId = this.QueueList[0].QM_ID;
        } else {
          this.selectedQueueId = this.QueueList[this.SelectedQueueIndex].QM_ID;
          this.selectedQueue = this.QueueList[this.SelectedQueueIndex].Display_Name;
        }

        this.wfs.getWorkflowData(
          this.selectedWorkflowId, 
          this.recordsPerPage,
          this.pageNo,
          this.selectedWorkflowType, 
          this.FromDate,
          this.ToDate,
          this.UserID,
          this.selectedQueueId,
          this.wfs.customFilter, 
          this.datefilterName  
          , this.sTokenToSearch 
          , this.selectedTID 
          , this.selectedEID 
        );
        
      }
    });

    this.WorkflowMetadataUCPSub = this.wfs.WorkflowMetadataUCP.subscribe((res) => {

      if (res.length !== 0) {

        this.workflowMetadataArr = [];
        this.workflowMetadataHeaderNameArr = [];
        this.workflowMetadataArrCopy = []; 
        this.workflowMetadataHeaderNameArrCopy = [];
        
        // Changed by Mitali D - 14-09-2023 - removed logic replacing space with special chars - START
        for (let i = 0; i < res.length; i++) {
          
          if (
            !res[i].WBM_Target_Value.includes(
              'Actions'
            )
          )
            this.workflowMetadataArrCopy.push({
              WBM_Target_Value: res[
                i
              ].WBM_Target_Value.toUpperCase(),
              WBM_Column_Data_type: res[
                i
              ].WBM_Column_Data_type,
              Size: res[i].Size,
              Color:
                '#' +
                res[i].WBM_Misc2,
              WBM_Blotter_Header:
                res[i].WBM_Blotter_Header,
            });
          if (
            !res[
              i
            ].WBM_Blotter_Header.includes('Actions')
          )
            this.workflowMetadataHeaderNameArrCopy.push(
              res[i].WBM_Blotter_Header
            );
          
          if (
            !res[i].WBM_Target_Value.includes(
              'Actions'
            ) && !res[i].WBM_Target_Value.includes(
              'Product_Name'
            )
          )
            this.workflowMetadataArr.push({
              WBM_Target_Value: res[
                i
              ].WBM_Target_Value.toUpperCase(), 
              WBM_Column_Data_type: res[
                i
              ].WBM_Column_Data_type,
              Size: res[i].Size,
              Color:
                '#' +
                res[i].WBM_Misc2,
              WBM_Blotter_Header:
                res[i].WBM_Blotter_Header, 
            });
          
          if (
            !res[
              i
            ].WBM_Blotter_Header.includes('Actions') && !res[i].WBM_Blotter_Header.toUpperCase().includes(
              'PRODUCT NAME'
            )
          )
            this.workflowMetadataHeaderNameArr.push(
              res[i].WBM_Blotter_Header
            );
        }
         // Changed by Mitali D - 14-09-2023 - removed logic replacing space with special chars - START
        console.log('workflow blotter header', this.workflowMetadataArr);

        this.loaderFlag = true; 

        if (!this.wfs.customFilter.length) {

          this.filterInfo = [];
          let metaData: any;
          let dataType = "";
          this.filterInfo.push({
            dataType: "TEXT",
            checked: false,
            filterBy: "FinIQ Ref No",
            dbColumn: "[TI_DealNo]",
            comparator: "",
            value: "",
          });
          
          this.workflowMetadataHeaderNameArrCopy.forEach((header) => {
            metaData = this.workflowMetadataArrCopy.find(
              (x) => x.WBM_Blotter_Header === header
            );
            dataType = metaData.WBM_Column_Data_type;
            if (dataType === "DATETIME") {
              this.filterInfo.push({
                dataType: dataType,
                checked: false,
                filterBy: header,
                dbColumn:
                  "CONVERT(DATE,[" +
                  metaData["WBM_Target_Value"].replaceAll("_x0020_", " ") +
                  "])",
                comparator: "",
                value: "",
              });
            } else {
              this.filterInfo.push({
                dataType: dataType,
                checked: false,
                filterBy: header,
                dbColumn:
                  "[" +
                  metaData["WBM_Target_Value"].replaceAll("_x0020_", " ") +
                  "]",
                comparator: "",
                value: "",
              });
            }
          });

        }
        
      }
    });

    this.WorkflowDataUCPSubscription = this.wfs.WorkflowDataUCP.subscribe(
      (res) => {

        this.successMsg = ''
        this.errorMsg = ''
        
        let workflowdata = [];
        
        this.workflowCustomData = [];
        this.temp_workflowCustomData = [];
        if (res.length !== 0) {
          this.loaderFlag = false;
          
          workflowdata = JSON.parse(res.XmlString) // Changed by Mitali D - 14-09-2023
          this.workflowCustomData = workflowdata;
          if (this.workflowCustomData !== undefined) {
            if (this.workflowCustomData.length > 0) {
              this.workflowCustomData.forEach((element) => {
                if (element.Trade_x0020_Date) {
                  element.Trade_x0020_Date = element.Trade_x0020_Date.toString().split('T')[0];
                }
                if (element.Trade_Date) {
                  element.Trade_Date = element.Trade_Date.toString().split('T')[0];
                }
              });

              this.temp_workflowCustomData = this.workflowCustomData;
              this.workflowCustomData = [];
              this.temp_workflowCustomData.forEach((obj) => {
                var key, keys = Object.keys(obj);
                var n = keys.length;
                var upperObj = {}
                while (n--) {
                  key = keys[n];
                  upperObj[key.toUpperCase()] = obj[key];
                }
                this.workflowCustomData.push(upperObj);
              });
              
            }
          }
          console.log('workflowCustomData -->', this.workflowCustomData);

          if (
            this.workflowCustomData === '' ||
            this.workflowCustomData === undefined
          ) {
            this.errorMsg = 'No data found';
            this.successMsg = '';
          } else {
            
            this.workflowCustomData.forEach((mainBlotter) => {
              mainBlotter.actionbtns = [];
              if (!isNullOrUndefined(mainBlotter.ACTIONS)) 
              {
                mainBlotter.actionbtns.push(mainBlotter.ACTIONS.split(','));
              }
            });
          }
          
          this.wfs.serverTimeStamp().subscribe(
            (res) => {
              this.cardsRefreshedAt = res.serverTimeStampResult;
            });
          
        }
      }
    );

    this.dispPrioritySub = this.wfs.dispPriorityChanged.subscribe(
      (res) => {
        if (res) {
          this.refresh();
        }
      }
    )
    
  }

  selectWorkflow(e) {
    this.clearData();
    this.currDate = new Date(); 
    this.loaderFlag = true;
    this.selectedWorkflowId = e.Id;
    this.selectedWorkflowType = e.Value;
    this.pageNo = 1; 
    
    this.wfs.loadQueuesUCP(
      this.selectedWorkflowId,
      this.selectedEID, 
      this.FromDate,
      this.ToDate,
      this.selectedWorkflowType,
      this.UserID,
      this.datefilterName 
      , this.sTokenToSearch 
      , this.selectedTID 
    );
    this.wfs.workflowBlotterMetaDataUCP(this.selectedWorkflowId, this.UserID);
    this.wfs.getWorkflowData(
      this.selectedWorkflowId,
      this.recordsPerPage,
      this.pageNo,
      this.selectedWorkflowType,
      this.FromDate,
      this.ToDate,
      this.UserID,
      this.selectedQueueId,
      this.wfs.customFilter, 
      this.datefilterName  
      , this.sTokenToSearch 
      , this.selectedTID 
      , this.selectedEID 
    );
    
    this.fillProductDDL() 

  }

  selectQueue(e, i) {
    this.SelectedQueueIndex = i;
    this.currDate = new Date(); 
    this.loaderFlag = true;
    this.workflowCustomData = [];
    this.temp_workflowCustomData = [];
    this.errorMsg = '';
    this.successMsg = '';
    this.unlockMSG = ''
    
    this.selectedQueue = e.Display_Name;
    this.selectedQueueId = e.QM_ID;
    
    this.pageNo = 1; 

    this.wfs.loadQueuesUCP(
      this.selectedWorkflowId,
      this.selectedEID, 
      this.FromDate,
      this.ToDate,
      this.selectedWorkflowType,
      this.UserID,
      this.datefilterName 
      , this.sTokenToSearch 
      , this.selectedTID 
    );
    
    this.wfs.workflowBlotterMetaDataUCP(this.selectedWorkflowId, this.UserID);
    this.wfs.getWorkflowData(
      this.selectedWorkflowId,
      this.recordsPerPage,
      this.pageNo,
      this.selectedWorkflowType,
      this.FromDate,
      this.ToDate,
      this.UserID,
      this.selectedQueueId,
      this.wfs.customFilter, 
      this.datefilterName  
      , this.sTokenToSearch 
      , this.selectedTID 
      , this.selectedEID 
    );
    
  }
  
  GetDate(e) {
    this.errorMsg = '';
    this.successMsg = '';
    var a = new Date(this.ToDate)
    
    var FromDate: any

    switch (e) {
      case "Y": var c = a.setFullYear(a.getFullYear() - 1)
        this.FromDate = this.datePipe.transform(c, 'yyyy-MM-dd');
        this.getworkflowDate(this.FromDate, this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
        break;
      case "M": var b = a.setMonth(a.getMonth() - 1)
        this.FromDate = this.datePipe.transform(b, 'yyyy-MM-dd');
        this.getworkflowDate(this.FromDate, this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
        break;
      case "W": var d = a.setDate(a.getDate() - 7)
        this.FromDate = this.datePipe.transform(d, 'yyyy-MM-dd');
        this.getworkflowDate(this.FromDate, this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
        break;
      case "D": this.FromDate = this.datePipe.transform(new Date(this.ToDate), 'yyyy-MM-dd');
        this.getworkflowDate(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
        break;
    }
    
  }

  getworkflowDate(FromDate, ToDate) {
    this.currDate = new Date();
    this.pageNo = 1; 
    
    this.loaderFlag = true;
    this.wfs.loadQueuesUCP(
      this.selectedWorkflowId,
      this.selectedEID, 
      this.FromDate,
      this.ToDate,
      this.selectedWorkflowType,
      this.UserID,
      this.datefilterName 
      , this.sTokenToSearch 
      , this.selectedTID 
    );
    this.wfs.workflowBlotterMetaDataUCP(this.selectedWorkflowId, this.UserID);
    this.wfs.getWorkflowData(
      this.selectedWorkflowId,
      this.recordsPerPage,
      this.pageNo,
      this.selectedWorkflowType,
      FromDate,
      ToDate,
      this.UserID,
      this.selectedQueueId,
      this.wfs.customFilter, 
      this.datefilterName  
      , this.sTokenToSearch 
      , this.selectedTID 
      , this.selectedEID 
    );
  }
  
  changeFromDate(_e) {
    
    this.successMsg = ''
    this.errorMsg = ''
    
    this.currDate = new Date();
    this.loaderFlag = true;
    const FromDate = this.datePipe.transform(this.FromDate, 'dd-MMM-YYYY');
    const ToDate = this.datePipe.transform(this.ToDate, 'dd-MMM-YYYY');
    
    if (this.FromDate > this.ToDate) {
      this.errorMsg = 'From date cannot be greater than to date ';
      this.successMsg = '';
      this.loaderFlag = false;
    } else {
      this.wfs.loadQueuesUCP(
        this.selectedWorkflowId,
        this.selectedEID, 
        FromDate,
        ToDate,
        this.selectedWorkflowType,
        this.UserID,
        this.datefilterName 
        , this.sTokenToSearch 
        , this.selectedTID 
      );
      this.wfs.workflowBlotterMetaDataUCP(this.selectedWorkflowId, this.UserID);
      this.wfs.getWorkflowData(
        this.selectedWorkflowId,
        this.recordsPerPage,
        this.pageNo,
        this.selectedWorkflowType,
        FromDate,
        ToDate,
        this.UserID,
        this.selectedQueueId,
        this.customFilter,
        this.datefilterName
        , this.sTokenToSearch 
        , this.selectedTID 
        , this.selectedEID 
      );
    }
  }

  changeToDate(_e) {
    
    this.successMsg = ''
    this.errorMsg = ''
    
    this.currDate = new Date(); 
    this.loaderFlag = true;
    
    const FromDate = this.datePipe.transform(this.FromDate, 'dd-MMM-YYYY');
    const ToDate = this.datePipe.transform(this.ToDate, 'dd-MMM-YYYY');
    if (this.FromDate > this.ToDate) {
      this.errorMsg = 'To date cannot be less than from date ';
      this.successMsg = '';
      this.loaderFlag = false;
    } else {
      this.wfs.loadQueuesUCP(
        this.selectedWorkflowId,
        this.selectedEID, 
        FromDate,
        ToDate,
        this.selectedWorkflowType,
        this.UserID,
        this.datefilterName 
        , this.sTokenToSearch 
        , this.selectedTID 
      );
      this.wfs.workflowBlotterMetaDataUCP(this.selectedWorkflowId, this.UserID);
      this.wfs.getWorkflowData(
        this.selectedWorkflowId,
        this.recordsPerPage,
        this.pageNo,
        this.selectedWorkflowType,
        FromDate,
        ToDate,
        this.UserID,
        this.selectedQueueId,
        this.wfs.customFilter, 
        this.datefilterName  
        , this.sTokenToSearch 
        , this.selectedTID 
        , this.selectedEID 
      );
    }
  }

  searchWorkflowList(event) {
    let value = event.target.value.toLowerCase();
    
    let result = [];
    result = this.temp_WorkflowList.filter((data) => {
      return data.Value.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    });
    this.WorkflowList = result;
  }

  searchQueueList(event) {
    let value = event.target.value.toLowerCase();
    
    let result = [];
    result = this.temp_QueueList.filter((data) => {
      return (
        data.Display_Name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    });
    this.QueueList = result;
  }

  searchWorkflowRecords(event) {
    this.loaderFlag = true;
    let value = event.target.value.toLowerCase();
    
    this.sTokenToSearch = event.target.value.trim();
    
    this.refresh();

  }

  accordion(index) {
    
    for (let i = 0; i < this.recordsPerPage; i++) {
      if (i === index) {
        this.isActive[i] = !this.isActive[i];
      }
    }

  }

  refresh() {
    this.successMsg = '';
    this.errorMsg = '';
    this.unlockMSG = '';
    this.currDate = new Date(); 
    this.loaderFlag = true;
    this.pageNo = 1; 
    
    this.wfs.loadQueuesUCP(
      this.selectedWorkflowId,
      this.selectedEID, 
      this.FromDate,
      this.ToDate,
      this.selectedWorkflowType,
      this.UserID,
      this.datefilterName 
      , this.sTokenToSearch 
      , this.selectedTID 
    );
    
    this.wfs.workflowBlotterMetaDataUCP(this.selectedWorkflowId, this.UserID);
    
  }

  nextBtnClick() {
    this.errorMsg = '';
    this.successMsg = '';
    
    this.TokenCount = this.selectedQueue.split('(')
    this.TokenCount = this.TokenCount[1].split(")")
    this.TotalPageCount = Math.ceil(parseInt(this.TokenCount) / this.recordsPerPage)
    
    if (this.pageNo > 0) {
      this.pageNo = this.pageNo + 1;
      if (this.TotalPageCount >= this.pageNo) {
        this.wfs.getWorkflowData(
          this.selectedWorkflowId,
          this.recordsPerPage,
          this.pageNo,
          this.selectedWorkflowType,
          this.FromDate,
          this.ToDate,
          this.UserID,
          this.selectedQueueId,
          this.wfs.customFilter, 
          this.datefilterName  
          , this.sTokenToSearch
          , this.selectedTID 
          , this.selectedEID 
        );
      }
      else {
        this.pageNo = this.pageNo - 1;  
      }
    }
  }

  prevBtnClick() {
    this.errorMsg = '';
    this.successMsg = '';
    if (this.pageNo >= 1) {
      if (this.pageNo === 1) {
        this.pageNo = this.pageNo;
      } else {
        this.pageNo = this.pageNo - 1;
      }

      this.wfs.getWorkflowData(
        this.selectedWorkflowId,
        this.recordsPerPage,
        this.pageNo,
        this.selectedWorkflowType,
        this.FromDate,
        this.ToDate,
        this.UserID,
        this.selectedQueueId,
        this.wfs.customFilter, 
        this.datefilterName  
        , this.sTokenToSearch 
        , this.selectedTID 
        , this.selectedEID 
      );
    }
  }
  
  isNumber(evt) {

    var ctl = document.getElementById('txtpage');
    var startPos = ctl['selectionStart'];

    if (startPos == 0 && String.fromCharCode(evt.which) == '0') {
      return false
    }

    evt = evt ? evt : window.event;
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  changePageOnEnter() {
    this.loaderFlag = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.wfs.getWorkflowData(
      this.selectedWorkflowId,
      this.recordsPerPage,
      this.pageNo,
      this.selectedWorkflowType,
      this.FromDate,
      this.ToDate,
      this.UserID,
      this.selectedQueueId,
      this.wfs.customFilter, 
      this.datefilterName  
      , this.sTokenToSearch
      , this.selectedTID 
      , this.selectedEID 
    );
  }

  changePagePerRecords(e) {
    this.loaderFlag = true;
    for (let i = 0; i < this.recordsPerPage; i++) {
      this.isActive[i] = true;
    }
    this.recordsPerPage = e.target.value;
    this.wfs.getWorkflowData(
      this.selectedWorkflowId,
      this.recordsPerPage,
      this.pageNo,
      this.selectedWorkflowType,
      this.FromDate,
      this.ToDate,
      this.UserID,
      this.selectedQueueId,
      this.wfs.customFilter, 
      this.datefilterName  
      , this.sTokenToSearch 
      , this.selectedTID 
      , this.selectedEID 
    );
  }

  clearData() {
    this.workflowMetadataArr = [];
    this.workflowMetadataHeaderNameArr = [];
    
    this.workflowMetadataArrCopy = [];
    this.workflowMetadataHeaderNameArrCopy = [];
    
    this.workflowCustomData = [];
    this.temp_workflowCustomData = [];
    this.successMsg = '';
    this.errorMsg = '';
    this.unlockMSG = ''
    this.wfs.customFilter = '' 
    this.QueueList = [];
    this.temp_QueueList = [];
    for (let i = 0; i < this.recordsPerPage; i++) {
      this.isActive[i] = true;
    }
  }
  
  openDetail(_item, tokenid, DealNo, mainblotter): void {
    
    this.actionbtns = [];
    mainblotter.actionbtns = [];
    
    if (tokenid !== '' || tokenid !== undefined) {
      this.actionbtns['TokenID'] = tokenid;
    }
    if (DealNo !== '' || DealNo !== undefined) {
      this.actionbtns['DealNo'] = DealNo;
    }

    this.wfs.getMenuDetails(tokenid, this.UserID, 'WEB').subscribe((data) => {
      this.oMenuDet = data.getMenuDetailsResult;
      this.oMenuDet.sort(function (a, b) {
        if (a.RCA_Label < b.RCA_Label) {
          return -1;
        }
        if (a.RCA_Label > b.RCA_Label) {
          return 1;
        }
        return 0;
      });
      
      for (let i = 0; i < this.oMenuDet.length; i++) {
        
        mainblotter.actionbtns.push(this.oMenuDet[i].RCA_Label);
        
      }
      
      this.ref.detectChanges();
    });
    
  }
  onActionBtnClick(tokenid, btnname, DealNo, mainBlotterObj) {

    this.errorMsg = '';
    
    var cnt = 0;
    if (btnname === 'View Proposal') {
      if (mainBlotterObj.ViewProposalDiv) {
        mainBlotterObj.ViewProposalDiv = false;
      } else {
        
        this.fnViewPrposal(mainBlotterObj);
        mainBlotterObj.ViewProposalDiv = true;
      }
    }
    
    this.CheckTimeStamp(tokenid);
    if (this.checktime) {
      this.errorMsg = 'Token state modified, please reload.'
      return;
    }
    
    this.wfs.getMenuDetails(tokenid, this.UserID, 'WEB').subscribe((data) => {
      this.oMenuDetails = [];
      this.oMenuDetails = data.getMenuDetailsResult;
      
      for (let i = 0; i < this.oMenuDetails.length; i++) {
        if (this.oMenuDetails[i].RCA_Label == btnname) {
          cnt = i;
        }
      }
      this.strButtonID = this.oMenuDetails[cnt].ButtonID;
      this.strButtonName = 'Process';
      this.strButtonCaption = this.oMenuDetails[cnt].RCA_Label;
      this.strFunctionName = this.oMenuDetails[cnt].FunctionName;
      this.btnMode = this.oMenuDetails[cnt].MODE.toUpperCase();
      if (this.btnMode == 'SPMODE' || this.btnMode == 'SP') {
        
        if (this.strButtonCaption.includes('Unlock')) {
          this.fnUnlockDeals(mainBlotterObj.PRODUCT_CODE, mainBlotterObj['REF NO'])
        } else {  
          this.processonbtn(
            tokenid,
            DealNo,
            'USP_ButtonSP_Mode_wrapper_for_web',
            this.UserID,
            'PROCESS',
            this.strButtonID,
            ''
          );
        }
        
      } else if (this.btnMode == 'MODE') {
        
        if (this.strButtonCaption.includes('Journey')) {
          this.OpenWfJourney(tokenid);
          
        }
        
        if (this.strButtonCaption === 'Indicative Termsheet') {
          this.fnDownloadTermsheet(mainBlotterObj.PRODUCT_CODE, mainBlotterObj['REF NO'])
        }
        
        else {
          
        }

      } else if (this.btnMode == 'WCFSERVICE') { 
        
        this.fnInvokeWCFServiceRest(this.strFunctionName, tokenid[0], this.strButtonID, DealNo);
      } else {
        
        this.errorMsg = 'Another mode';
      }
    });

  }
  
  OnRefNoClick(tokenid) {

    var currLocation = window.location.href.toString();
    this.wfs.getLeftClickOperationFunctionNameIfExists(this.selectedWorkflowId, this.UserID).subscribe((data) => {
      this.strFuncName = data.getLeftClickOperationFunctionNameIfExistsResult;
      if (this.strFuncName.trim() === "" || this.strFuncName.trim().toString().toUpperCase() === "NOTALLOWED") {
        this.successMsg = 'Permission not granted';
      }
      if (this.strFuncName.trim() != "") {
        this.wfs.getModeButtonDetails(this.strFuncName, tokenid[0],sessionStorage.getItem('HomeEntityID'), "0", this.EQC_afs.GetLoggedInUser()).subscribe(Res => {
          if (Res.getModeButtonDetailsResult.length > 0) {
            if (!Res.getModeButtonDetailsResult[2].EXE_Name.toUpperCase().includes("EXCEPTION")) {
              this.url =
                "" +
                currLocation.replace(
                  "wfblotter",
                  Res.getModeButtonDetailsResult[2].EXE_Name
                ) +
                "?WorkflowMode=" +
                Res.getModeButtonDetailsResult[2].sixth +
                "&DealNum=" +
                Res.getModeButtonDetailsResult[2].thirteen +
                "&TokenID=" +
                Res.getModeButtonDetailsResult[2].eleven +
                "&ButtonID=" +
                Res.getModeButtonDetailsResult[2].seventh +
                "&Master_Popup=POPUP" +
                "&UserGroup=" + this.UserGroup
                +
                "&LoginID=" + this.UserID;
              if (Res.getModeButtonDetailsResult[2].fourth.toString() === "OPENWORKFLOWINPOPUP" || Res.getModeButtonDetailsResult[2].fourth.toString() === "NORMALPOPUP") {
                var left = (screen.width - Res.getModeButtonDetailsResult[2].nine) / 2;
                var top = (screen.height - Res.getModeButtonDetailsResult[2].ten) / 4;
                var myWindow = window.open(
                  this.url,
                  "_blank"
                )
                myWindow.focus();
              }
              else {
                this.pageURL = this.sanitizer.bypassSecurityTrustResourceUrl(
                  this.url
                );
                const dialogConfig = new MatDialogConfig();
                dialogConfig.width = Res.getModeButtonDetailsResult[2].nine + "px";
                dialogConfig.height = Res.getModeButtonDetailsResult[2].ten + "px";
                dialogConfig.panelClass = "UCP_Popup";
                this.UCP_PopupRef = this.dialog.open(this.UCP_Popup, dialogConfig);
              }
            }
          }
        });
      }
    });
  }
  
  processonbtn(
    tokenid,
    dealRefNo,
    processName,
    userid,
    action,
    buttonId,
    remark
  ) {
    var tokenidarr: any[] = [];
    var strMsg: string = '';
    tokenidarr.push(tokenid);
    var dealRefNoarr: any[] = [];
    dealRefNoarr.push(dealRefNo);
    this.wfs.processTokenonButtonClick(
      tokenidarr[0],
      dealRefNoarr[0],
      processName,
      userid,
      action,
      buttonId.toString(),
      remark
    )
      .subscribe(
        (data) => {
          
          strMsg = data.processTokenonButtonClickResult;
          if (strMsg.toString().trim().startsWith("Warning")) {
            this.errorMsg = strMsg.toString().replace("Warning", "");
          }
          else {
            this.successMsg = strMsg;
          }
          
          this.selectedQueueId = this.QueueList[this.SelectedQueueIndex].QM_ID;
          this.selectedQueue = this.QueueList[this.SelectedQueueIndex].Display_Name;
          this.wfs.loadQueuesUCP(
            this.selectedWorkflowId,
            this.selectedEID, 
            this.FromDate,
            this.ToDate,
            this.selectedWorkflowType,
            this.UserID,
            this.datefilterName 
            , this.sTokenToSearch 
            , this.selectedTID 
          );
          this.wfs.workflowBlotterMetaDataUCP(
            this.selectedWorkflowId,
            this.UserID
          );
          this.wfs.getWorkflowData(
            this.selectedWorkflowId,
            this.recordsPerPage,
            this.pageNo,
            this.selectedWorkflowType,
            this.FromDate,
            this.ToDate,
            this.UserID,
            this.selectedQueueId,
            this.wfs.customFilter, 
            this.datefilterName 
            , this.sTokenToSearch 
            , this.selectedTID 
            , this.selectedEID 
          );
          
        },
        (error) => {
          console.error('Error occured in processonbtn: ', error);
          
          this.errorMsg = 'Error occured in processonbtn';
        }
      );
  }

  getModebtndetail() {

  }

  closePopup(index) {
    this.showActions[index] = !this.showActions[index];
    for (let i = 0; i < this.recordsPerPage; i++) {
      if (i !== index) {
        this.showActions[i] = false;
      }
    }
  }

  ReturnIndex(index) {
    this.OrderIndex = index;
    this.showOrdersPopup = true;
    
  }
  fnViewPrposal(mainPortfolioObject: any) {
    
    this.GetCSPEventsSubscription = this.Cuct_afs.GetCSPEvents().subscribe(
      (res) => {
        if (res) {
          this.eventList = res;

          this.GetCSPEventsSubscription =
            this.Workflow_api.ProductAttachmentListWTO(
              mainPortfolioObject.Ref_x0020_No[0]
            ).subscribe((res) => {
              try {
                if (res.length > 0) {
                  mainPortfolioObject.ViewProposalDocs = [];
                  res.forEach((docelement) => {
                    if (this.eventList.length > 0) {
                      this.eventList.forEach((eventelement) => {
                        if (
                          docelement.Event_Code === 'Proposal_Generation' &&
                          eventelement.Event_Code === 'Proposal_Generation'
                        ) {
                          docelement.Event_Name = eventelement.Event_Name;
                        }
                      });
                      mainPortfolioObject.ViewProposalDocs.push(docelement);
                    }
                  });
                }
              } catch (ex) {
                console.log('Error :', ex);
              }
            });
        }
      }
    );
  }

  showFile(DGTID, RefNo) {
    
    const Link =
      'http:'+
      AppConfig.settings.CSP_FXPricingURL +
      '/FinIQService/RMWorkstation_JSON.svc/Get_Uploaded_Documents_API/' +
      RefNo +
      '/' +
      DGTID;

    window.open(Link);
  }

  fnGotoFXD(item: any, mainBlotter: any) {
    if (item === 'Pick DI RFQ') {
      this._fxdafs.setData(mainBlotter);
      this._router.navigateByUrl('/fxd');
    } else if (item === 'Navigate') {
      
      mainBlotter.redirectFrom = 'blotter' 
      this._fxdafs.setData(mainBlotter);
      this._router.navigateByUrl('/app/fxdconnect'); // Changed by Mitali D - 01-11-2023
      this._fxdafs.FXD_RFQDealDetails_navigateToPricers.next(
        {
          navigate: true,
          ProdcutCode: mainBlotter.PRODUCT_CODE.toUpperCase(), 
          ReFNo: mainBlotter['REF NO'],  
          ProductID: mainBlotter.TI_PRODUCT_CLASS_ID,  
          redirectFrom: 'blotter' 
        }
      );
    }
  }

  OpenWfJourney(tokenId: any) {
    this.JouneyClickFlag = !this.JouneyClickFlag;
    this.Wf_TokenID = tokenId;
  }

  CheckJourneyGraphfn() {
    this.Workflow_api.JorneyGraphVisibility.subscribe((data: any) => {
      if (data === false) {
        this.JouneyClickFlag = false;
      }
    });
  }

  back() {
    this.location.back();
  }

  fnInvokeWCFServiceRest(functionName: string, tokenId, buttonId, DealNo) {
    var tokenidarrForWCF: any[] = [];
    tokenidarrForWCF.push(tokenId);
    this.wfs.getModeButtonDetails(functionName, tokenId,sessionStorage.getItem('HomeEntityID'), buttonId, this.EQC_afs.GetLoggedInUser()).subscribe(Res => {
      try {
        let operationParam: string[] = [];
        let serviceUrl: string = '';
        let contractName: string = '';
        let operationName: string = '';
        if (Res?.getModeButtonDetailsResult.length > 1) {
          serviceUrl = Res?.getModeButtonDetailsResult[1].EXE_Name;
          contractName = Res?.getModeButtonDetailsResult[1].first;
          operationName = Res?.getModeButtonDetailsResult[1].second;
          operationParam = (Res?.getModeButtonDetailsResult[1].third).split(',');
        }
        this.wfs.InvokeWCFServiceRest(serviceUrl, contractName, operationName, operationParam).subscribe(invokewcfserviceObj => {
          
          console.log(invokewcfserviceObj.result);
          
          this.processonbtn(tokenidarrForWCF,
            DealNo,
            'USP_ButtonSP_Mode_wrapper_for_web',
            this.UserID,
            'PROCESS',
            buttonId,
            '');
          
        });
      } catch (Ex) {

      }
    });
  }

  //API request modified by Urmila A | 8-Jan-23 | start
  fnUnlockDeals(Prod_code, RefNo) {
    this.unlockMSG = ''
    this.unlockNotemasterSubscriber = this._fxdafs.FXDUnLockNoteMasterIDForDIAPI( RefNo,this._fxdafs.UserName ).subscribe((res: any) => {
        try {
          res = res
          if (res) {
            if (res.errors == undefined && res !== null) {
              
              if (res.result.UnlockRFQ === true) {
                // this.unlockMSG = res.UnLockNoteMasterIDForDIResult.UnlockRFQMsg
              } else {
                // this.unlockMSG = res.UnLockNoteMasterIDForDIResult.UnlockRFQMsg
              }
            }
          }
        } catch (err) {
          console.log(err)
        }
      })
  }
  //API request modified by Urmila A | 8-Jan-23 | ends

  applyFilter() {
    
    if (this.isEvtFilter) {
      this.datefilterName = "Trade_Date"
    }
    else {
      this.datefilterName = " "
    }

    this.refresh();

  }
  
  getWorkflowCustomSettings() {
    this.wfs.getWorkflowCustomSettings(sessionStorage.getItem('Username')).subscribe(
      (res) => {
        this.wfs.wflSettings = res.getWorkflowCustomSettingsResult[0]
        
      }
    )
  }

  afterPSClosed() {
    this.showPersonalSettings = false;
    
    if (this.autoRefreshActive) {
      
      this.errorMsg = ''
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.refresh();
        
      }, this.autoRefresh * 1000);
    } else {
      if (this.interval) clearInterval(this.interval);
    }
  }

  moreFilters() {
    this.loaderFlag = true;
    this.wfs.getWorkflowData(
      this.selectedWorkflowId,
      this.recordsPerPage,
      this.pageNo,
      this.selectedWorkflowType,
      this.FromDate,
      this.ToDate,
      this.UserID,
      this.selectedQueueId,
      this.wfs.customFilter,
      this.datefilterName
      , this.sTokenToSearch 
      , this.selectedTID 
      , this.selectedEID 
    );
    this.loaderFlag = false;
  }

  // Changed by Mitali D - 31-01-2024 - HSBCFXEINT-67 -  - export to excel not working - START
  exportWorkflowBlotter() {
    if (!this.exportInprogress) {
      try {
        this.exportInprogress = true;
        this.exportSubscriber = this.wfs.exportWorkflowBlotter(
          this.selectedWorkflowId,
          this.recordsPerPage,
          this.pageNo,
          this.selectedWorkflowType,
          this.FromDate,
          this.ToDate,
          this.UserID,
          this.selectedQueueId,
          this.wfs.customFilter,
          this.datefilterName
          , this.sTokenToSearch,
          this.selectedTID,
          this.selectedEID // Changed by Mitali D - 07-02-2024 - HSBCFXEINT-67
        ).subscribe(
          (res) => {

            this.exporttoexceldata = JSON.parse(res.XmlString)
            let temp_workflowCustomData = this.exporttoexceldata;
            this.exporttoexceldata = [];
            temp_workflowCustomData.forEach((obj) => {
              var key, keys = Object.keys(obj);
              var n = keys.length;
              var upperObj = {}
              while (n--) {
                key = keys[n];
                upperObj[key.toUpperCase()] = obj[key];
              }
              this.exporttoexceldata.push(upperObj);
            });
            this.exportAsXLSX()
          }
        )

      } catch (error) {
        console.error('exportWorkflowBlotter error -- ', error)
        this.exportInprogress = false;
      }

    }

  }
  // Changed by Mitali D - 31-01-2024 - HSBCFXEINT-67 -  - export to excel not working - END
  
  fillProductDDL() {
    try {
      
      // if (AppConfig.settings.WFL_LoadEntityMappedTemplates) {
      //   this.templateDetailSubscriber = this.wfs.GetMappedTemplateDetails(this.selectedEID, '', '', this.authapi.UserName).subscribe(
      //     (res) => {
      //       this.products = res.GetMappedTemplateDetailsResult
      //       this.products = this.products.filter(x => x.Template_Name.trim().length > 0)
      //       console.log('GetMappedTemplateDetails--', this.products)
      //       this.selectedTID = this.wfs.wflSettings.WCS_Default_Template === 0 || !this.products.find(x => x.Id.toString() === this.wfs.wflSettings.WCS_Default_Template.toString()) ? '%%' : this.wfs.wflSettings.WCS_Default_Template.toString()  
      //     })
      // }
      // else {
        this.templateDetailSubscriber = this.wfs.getTemplateDetails(this.authapi.UserName, this.selectedWorkflowId,this.selectedWorkflowType).subscribe(
          (res) => {
            this.products = res
            this.products = this.products.filter(x => x.Template_Name.trim().length > 0)
            
            this.selectedTID = this.wfs.wflSettings.WCS_Default_Template === 0 || !this.products.find(x => x.Id.toString() === this.wfs.wflSettings.WCS_Default_Template.toString()) ? '%%' : this.wfs.wflSettings.WCS_Default_Template.toString()  
          })
      // }

    } catch (error) {
      console.error('fillProductEntityDDL error --- ', error)
    }

  }

  applyProductOREntityFilter() {
    
    this.refresh();
  }

  fillEntityDDL() {
    this.loaderFlag = true;
    this.entityDataSubscriber =
      this._fxdafs.getEntityData(this.authapi.UserName)
        .subscribe((res: any) => {
          // Changed by Mitali D - 13-09-2023 - FIN1EURINT-613 - START
          if (res.cvpData) {
            this.entities = res.cvpData
            this.selectedEID =  this.entities[0].code ///'35' ////this.entities[0].code // Changed by Mitali D - 22-09-2023 - FIN1EURINT-613
            this.loaderFlag = false
          }
          // Changed by Mitali D - 13-09-2023 - FIN1EURINT-613 - END
        })
  }

  // Changed by Mitali D - 31-01-2024 - HSBCFXEINT-67 -  - export to excel not working - START
  exportAsXLSX(): void {

    if (this.exporttoexceldata.length) {
      this.exporttoexcelflag = false
      this.jsonList = [];
      this.tempjson = this.exporttoexceldata;
      let array1 = [];
      let bodyarr = [];
      let rowarr = [];
      let contentarr = [];
      let tempRow = {};

      //console.log(this.exporttoexceldata)

      this.workflowMetadataHeaderNameArrCopy.forEach((element) => {
        rowarr.push(element);
      });
      for (let i = 0; i < this.tempjson.length; i++) {
        bodyarr.push(rowarr);
      }
      for (let i = 0; i < this.exporttoexceldata.length; i++) {
        tempRow = {};
        tempRow["FinIQ Ref No"] = this.tempjson[i]['REF NO']; // Changed by Mitali D - 24-11-2023 - F5SAAINT-460
        this.workflowMetadataHeaderNameArrCopy.forEach((element, index) => {
          let ele = element
          rowarr = [];
          if (

            this.exporttoexceldata[i][
            this.workflowMetadataArrCopy[index].WBM_Target_Value.toUpperCase() // Changed by Mitali D - 24-11-2023 - F5SAAINT-460
            ]

          ) {
            tempRow[this.workflowMetadataHeaderNameArrCopy[index]] =

              this.exporttoexceldata[i][
              this.workflowMetadataArrCopy[index].WBM_Target_Value.toUpperCase() // Changed by Mitali D - 24-11-2023 - F5SAAINT-460
              ]

          } else {
            tempRow[this.workflowMetadataHeaderNameArrCopy[index]] = "";
          }
        });

        array1.push(tempRow)
      }

      this.excelService.exportAsExcelFile(array1, 'WorkflowBlotter');
      this.exportInprogress = false

    }

  }
  // Changed by Mitali D - 31-01-2024 - HSBCFXEINT-67 -  - export to excel not working - END
  
  formatDate(date: string) {
    let d: any;
    if (Array.isArray(date))
      date = date[0]
    if (date.includes('T')) {
      d = new Date(date.split('T')[0])
    }
    else {
      d = new Date(date)
    }
    return this.datePipe.transform(d, 'dd-MMM-yyyy');
  }
  
  CallActions(tokenid, btnname, DealNo, mainBlotterObj) {
    this.errorMsg = '';
    var cnt = 0;
    let strExeName = ''
   
    this.wfs.getMenuDetails(tokenid, this.UserID, 'WEB').subscribe((data) => {
      this.oMenuDetails = [];
      this.oMenuDetails = data; // Changed by Mitali D - 20-09-2023 - FIN1EURINT-613
      
      for (let i = 0; i < this.oMenuDetails.length; i++) {
        if (this.oMenuDetails[i].RCA_Label == btnname) {
          cnt = i;
        }
      }
      this.strButtonID = this.oMenuDetails[cnt].ButtonID;
      this.strButtonName = 'Process';
      this.strButtonCaption = this.oMenuDetails[cnt].RCA_Label;
      this.strFunctionName = this.oMenuDetails[cnt].FunctionName;
      this.btnMode = this.oMenuDetails[cnt].MODE.toUpperCase();

      if (this.strButtonCaption === 'Indicative Termsheet') {
        this.fnDownloadTermsheet(mainBlotterObj.PRODUCT_CODE, mainBlotterObj['REF NO'])
        return;
      }

      if (this.btnMode.toUpperCase() === 'MODE') {
        try {
          this.modeButtonDetailsSubscription = this.wfs
            .getModeButtonDetails(this.strFunctionName, tokenid[0],sessionStorage.getItem('HomeEntityID'), this.strButtonID, this.UserID)
            .subscribe(
              (res) => {
                let params = res // Changed by Mitali D - 20-09-2023  - FIN1EURINT-613
                this.wfs.params = []
                this.wfs.params = params
                if (!isNullOrUndefined(params) && params.length) {
                  if (!params[1].EXE_Name.toUpperCase().includes('EXCEPTION')) {
                    let EXE_Name = params[1].EXE_Name.toUpperCase()

                    if (EXE_Name === 'STAY_ON_SAME_PAGE_ONLY_APPLY_FILTERS') { }
                    else if (EXE_Name === 'SHOW_ALERT') { }
                    else if (params[1].first.toUpperCase() === 'REDIRECT') { }
                    else if (params[1].fourth.toString().toUpperCase() === 'OPENWORKFLOWINPOPUP' || params[1].fourth.toString().toUpperCase() === 'NORMALPOPUP') { }
                    else if (params[1].fourth.toString().toUpperCase() === 'OPENACCORDION') { }
                    else {

                      this.strButtonCaption = this.strButtonCaption.replace(" ", "&nbsp;")
                      params[1].second = params[1].second.replace(" ", "&nbsp;")
                      let showAllPaths = params[0].thirteen
                      if (showAllPaths === 'TRUE') {
                        
                      }
                      else {
                        if (!isNullOrUndefined(params[2])) {
                          if (params[2].fourth.toString().toUpperCase() === 'OPENWORKFLOWINPOPUP' || params[2].fourth.toString().toUpperCase() === 'NORMALPOPUP') {
                            this.wfs.showPopup = true;
                            this._router.navigate(['/wfblotter', params[2].EXE_Name])
                          }
                        }
                      }

                    }
                  }
                  else {
                    strExeName = params(1).EXE_Name.Replace("Exception", "")
                    this.errorMsg = strExeName
                  }
                }
              })

        } catch (error) {
          console.log(error)
        }

        this.refresh();

      }
      else if (this.oMenuDetails[cnt].MODE.toUpperCase() === "WCFSERVICE") {
        this.fnInvokeWCFServiceRest(this.strFunctionName, tokenid[0], this.strButtonID, DealNo);
      }
      else if (this.oMenuDetails[cnt].MODE.toUpperCase() === 'SP') {
        this.processonbtn(
          tokenid,
          DealNo,
          'USP_ButtonSP_Mode_wrapper_for_web',
          this.UserID,
          'PROCESS',
          this.strButtonID,
          ''
        );
      }
      else if (this.oMenuDetails[cnt].MODE.toUpperCase() === 'SPMODE') {
        this.processonbtn(
          tokenid,
          DealNo,
          'USP_ButtonSP_Mode_wrapper_for_web',
          this.UserID,
          'PROCESS',
          this.strButtonID,
          ''
        );

        this.modeButtonDetailsSubscription = this.wfs
          .getModeButtonDetails(this.strFunctionName, tokenid[0],sessionStorage.getItem('HomeEntityID'), this.strButtonID, this.UserID)
          .subscribe(
            (res) => {
              let params = res.getModeButtonDetailsResult
              if (!isNullOrUndefined(params) && params.length) {
                if (!params[1].EXE_Name.toUpperCase().includes('EXCEPTION')) {
                  this.strButtonCaption = this.strButtonCaption.replace(" ", "&nbsp;")
                  if (params[1].fourth.ToString().toUpperCase() === 'OPENWORKFLOWINPOPUP' || params[1].fourth.ToString().toUpperCase() === 'NORMALPOPUP') {
                    
                  }
                  else {
                    
                  }
                }
                else {
                  strExeName = params[1].EXE_Name.Replace("Exception", "")
                  this.errorMsg = strExeName
                }
              }
            })
      }
      else if (this.oMenuDetails[cnt].MODE.toUpperCase() === "RESTCALL") { }
      else {

      }

    });

  }
  //modified by UrmilaA | 2-Dec-23 | start
  fnDownloadTermsheet(prodCode, RefNo) {
    let EntName:any
    this.entities.forEach(element => {
        if(this.selectedEID == element.code){
          EntName = element.value
        }
    });
    this.successMsg = 'Termsheet downloading in progress.'
    this._fxdafs.FXDDownloadTermsheetAPI(this._fxdafs.EntityID, EntName,  this._fxdafs.UserName, prodCode, RefNo, 'PRODUCT',
      'RFQ_CONFIRMATION', 'Postman', 'Demo')
      .subscribe((res: any) => {
        if (res.errors == undefined) {
            this.successMsg = '';
            const bytes = new Uint8Array(res);
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = "RFQ_CONFIRMATION_" + prodCode + '_' + RefNo + '_' + this.datePipe.transform(new Date(), 'ddMMYYYY')
            link.click();
            window.open(link.href)         
        }else{       
          let key = Object.keys(res.errors)
          this.errorMsg =  res.errors[key[0]]
  
        }
      })

  }
  //modified by UrmilaA | 2-Dec-23 | ends
  
  CheckTimeStamp(tokenID) {

    this.wfs.checkLastModified(tokenID.toString()).subscribe((res) => {
      console.log(this.cardsRefreshedAt);
      if (res.checkLastModifiedResult == this.cardsRefreshedAt) {
        this.checktime = true;
      }
      else {
        this.checktime = false;
      }
    });

  }

  wfFind(data) {
    this.selectedWorkflowId = data.wfl.WTM_ID
    this.selectedWorkflowType = data.wfl.WTM_Title
    this.SelectedQueueIndex = this.QueueList.findIndex(x => x.QM_ID.toString() === data.wfl.QM_ID.toString())
    this.sTokenToSearch = data.refNo
    this.searchToken = data.refNo
    this.refresh();
    this.showWFFind = false;

  }
  
}
