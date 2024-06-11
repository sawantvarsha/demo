import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerApiService } from '../../../services/customer-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-wfblotter',
  templateUrl: './wfblotter.component.html',
  styleUrls: ['./wfblotter.component.scss'],
})
export class WFBlotterComponent implements OnInit, OnDestroy {
  constructor(
    private api: CustomerApiService,
    public cas: CommonApiService,
    public afs: WorkflowApiService,
    private router: Router,
    public location: Location
  ) {}
  isProd = environment.production;
  showQueueBar = true;
  queues: any;
  tokens: any;
  actions: any;
  status: string;
  queueLoader: boolean;
  showloader: boolean;
  searchText: string = '';
  filterflag: boolean[] = [];
  filterType: string = 'AD_Longname';
  columnNames: any[];
  selectedqueueId = '';
  checkboxs: boolean[] = [];
  // toDate: string;
  todate: any;
  fromdate: any;
  regex: RegExp = /_x0020_/g;
  loader: boolean = true;
  checkedAll: boolean = false;
  workflow = '';
  queueMapping = [];
  columnTargetValues = [];
  columnDataType = [];
  columnstyles = [];
  WorkflowCommonData = [];
  workflowId = '';
  workflowArray = [];
  filterObj = {};
  username = '';
  tokensSubscription: Subscription;
  workflowSubscription: Subscription;
  queuesSubscription: Subscription;
  ngOnDestroy() {
    // this.api.TokensObserver.next([]);
    this.tokensSubscription.unsubscribe();
    this.workflowSubscription.unsubscribe();
    this.queuesSubscription.unsubscribe();
    this.queues = [];
    this.tokens = [];
    this.workflowArray = [];
    this.workflow = '';
  }
  ngOnInit(): void {
    // this.username = sessionStorage.getItem('Username');
    this.username = 'Dealer1';
    this.status = '';
    this.queueLoader = true;
    this.showloader = true;
    const date = new Date();
    this.todate = date
      .toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      .replace(/ /g, '-');
    console.log(this.todate);
    this.fromdate = '01-Dec-2020';
    this.api.getWorkflowCommonData();

    this.workflowSubscription = this.api.workflows.subscribe((res) => {
      this.workflow = sessionStorage.getItem('Workflow') || this.workflow;
      //console.log(sessionStorage.getItem('Workflow'));
      if (res.length !== 0) {
        if (this.workflow !== '') {
          //console.log(res);
          let comp = this.workflow;
          this.queueMapping = [];
          this.workflowArray = res;
          var rebels = res.filter(function (data) {
            return data.Value.toString().toLowerCase() === comp.toLowerCase();
            // return data.Value === 'Mutual Fund Workflow';
          });
          // this.queueMapping.push(rebels[0]);
          //console.log(rebels);
          if (rebels.length !== 0) {
            this.workflowId = rebels[0].Id;
            this.getMetadata(rebels[0].Id);
            this.getQueues(rebels[0].Id);
            this.getTokens(rebels[0].Id, '%%', 1);
            this.status = '';
          } else {
            // this.tokens = [];
            // this.columnNames = [];
            this.loader = false;
            this.queueLoader = false;
            // this.queues = [];
            // this.status = 'No records found.'
          }
        }
      }
    });

    this.api.getCommonDataObserver.subscribe((res) => {
      if (res.length !== 0) {
        this.WorkflowCommonData = [];
        //console.log(res.Get_Configurable_Common_DataResult);
        res.Get_Configurable_Common_DataResult.forEach((element) => {
          this.WorkflowCommonData.push(element.DATA_VALUE);
        });
        this.WorkflowCommonData.sort((a, b) => {
          if (a.toLowerCase() > b.toLowerCase()) {
            return 1;
          }
          if (a.toLowerCase() < b.toLowerCase()) {
            return -1;
          }
          return 0;
        });
        this.workflow = this.WorkflowCommonData[0];
        this.api.loadWorkflow(this.username);
      }
    });

    this.api.buttons.subscribe((res: any) => {
      if (res.length !== 0) {
        this.actions = res;
        this.actions.sort((a, b) => {
          if (a.WB_Caption.toLowerCase() > b.WB_Caption.toLowerCase()) {
            return 1;
          }
          if (a.WB_Caption.toLowerCase() < b.WB_Caption.toLowerCase()) {
            return -1;
          }
          return 0;
        });
        //console.log(this.actions);
      } else {
        //console.log('err: actions');
        this.actions = null;
        this.loader = false;
      }
    });

    this.queuesSubscription = this.api.queues.subscribe((res: any) => {
      if (res.length !== 0) {
        if (this.queues !== res.queues) {
          //console.log(this.loader);
          this.loader = false;
          //console.log(this.loader);
        }
        this.queues = res.queues;
        this.loader = false;
        // this.getTokens(this.workflowId, '');
        this.selectedqueueId = this.queues[0].QM_ID;
        this.getActions(this.selectedqueueId);
        //console.log(this.queues);
      } else {
        //console.log('err: queues');
        this.queues = null;
        this.loader = false;
      }
    });

    this.tokensSubscription = this.api.tokens.subscribe((ts: []) => {
      if (ts.length > 0) {
        this.status = '';
        this.tokens = ts;
        //console.log(this.tokens);
        this.queueLoader = false;

        this.tokens.forEach((element) => {
          Object.keys(element);
          this.checkboxs.push(false);
        });
        //console.log(this.checkboxs);

        // this.columnNames = Object.keys(this.tokens[0]).filter(name => !this.ignoredHeaders.includes(name));
        // console.log(this.columnNames.filter(name => !this.ignoredHeaders.includes(name)));
        if (this.showloader === true) {
          this.queueLoader = false;
        }
      } else {
        //console.log('No Data');
        this.loader = false;
        // this.queueLoader = false;
        // this.tokens = [];
        this.status = 'No records found.';
      }
    });

    this.api.processToken.subscribe((res: any) => {
      if (res.length !== 0) {
        this.status = res.processTokenonButtonClickResult;
        //console.log(this.status);
      } else {
        //console.log('err: process');
        this.status = null;
      }
    });
    // this.processToken("8418", "9123", "spname");

    this.api.getMetadataObserver.subscribe((res: any) => {
      if (res.length !== 0) {
        // this.status = res.processTokenonButtonClickResult;
        this.columnNames = [];
        this.columnTargetValues = [];
        this.columnDataType = [];
        this.columnstyles = [];
        //console.log(res.getWorkflowBlotterMetaDataResult);
        for (let i = 1; i < res.getWorkflowBlotterMetaDataResult.length; i++) {
          this.columnNames.push(
            res.getWorkflowBlotterMetaDataResult[i].WBM_Blotter_Header
          );
          this.columnstyles.push(
            parseInt(res.getWorkflowBlotterMetaDataResult[i].Size)
          );
          if (
            res.getWorkflowBlotterMetaDataResult[i].WBM_Target_Value.includes(
              ' '
            )
          ) {
            res.getWorkflowBlotterMetaDataResult[i].WBM_Target_Value =
              res.getWorkflowBlotterMetaDataResult[i].WBM_Target_Value.replace(
                ' ',
                '_x0020_'
              );
          }
          this.columnTargetValues.push(
            res.getWorkflowBlotterMetaDataResult[i].WBM_Target_Value
          );
          this.filterObj[
            res.getWorkflowBlotterMetaDataResult[i].WBM_Target_Value
          ] = '';
          this.filterflag.push(false);
          this.columnDataType.push(
            res.getWorkflowBlotterMetaDataResult[i].WBM_Column_Data_type
          );
          //console.log(this.columnDataType, this.columnTargetValues);
        }

        //console.log(this.columnstyles);
      } else {
        //console.log('err: process');
        this.status = null;
      }
    });
  }

  toggleQueueBar() {
    this.showQueueBar = !this.showQueueBar;
  }

  toggleFlag(_i: number) {
    this.filterflag.fill(false);
    console.log(this.filterflag, 'hi');
  }

  checked(j: number) {
    this.checkboxs[j] = !this.checkboxs[j];
    // console.log(this.checkboxs);
  }

  fncheckedAll() {}

  getActions(queueId: string) {
    this.api.loadButtons(queueId, this.workflowId, this.username);
  }

  getQueues(workflowid: any) {
    console.log(workflowid);
    // this.loader = true;
    // console.log(this.workflow, this.queueMapping[this.workflow]);
    this.api.loadQueues(
      workflowid,
      4,
      this.fromdate,
      this.todate,
      this.workflow,
      this.username
    );
  }

  getTokens(workflowid: any, QueueID: any, TokenCount: any) {
    console.log(QueueID);
    if (TokenCount > 0) {
      this.selectedqueueId = QueueID;
      this.api.loadTokens(
        this.workflow,
        workflowid,
        QueueID,
        this.todate,
        this.fromdate,
        1,
        10,
        this.username
      );
      this.filterObj = {};
      this.filterflag.fill(false);
      this.checkboxs = [];
      this.getMetadata(this.workflowId);
    }
  }

  processToken(
    tokenId: string,
    dealNo: string,
    action: any,
    token: any,
    j: any
  ) {
    console.log(this.actions);
    if (this.checkboxs[j]) {
      if (action.includes('Amend') || action.includes('Cancel')) {
        this.cas.sendDatatoBondsOrderEntry(token, action);
        if (this.workflow.toUpperCase().includes('BOND')) {
          sessionStorage.setItem('Workflow', this.workflow);
          //console.log(sessionStorage.getItem('Workflow'));
          this.router.navigate(['/neworderentry/bonds']);
        } else if (this.workflow.toUpperCase().includes('EQ')) {
          this.router.navigate(['/neworderentry/shares']);
        }
      } else {
        this.actions.forEach((element) => {
          if (element.WB_Caption === action) {
            this.api.processButtonAction(
              tokenId,
              dealNo,
              element.WB_ID,
              element.WB_Process_SP_Name,
              this.username
            );
          }
        });
      }
      this.getQueues(this.workflowId);
    }
  }

  filterByDate() {
    //   this.todate = moment(this.todate, "YYYY-MM-DD").format("DD-MMM-YYYY");
    //   this.fromdate = moment(this.fromdate, "YYYY-MM-DD").format("DD-MMM-YYYY");
    // console.log(this.todate,this.fromdate);
    //ruchira
    this.getQueues(this.workflowId);
    // this.getMetadata(this.workflowId);
    this.getTokens(this.workflowId, this.selectedqueueId, 1);
  }
  selectDate(reqPram, date) {
    switch (reqPram) {
      case 'toDate':
        this.todate = moment(date).format('DD-MMM-YYYY');
        break;
      case 'fromDate':
        this.fromdate = moment(date).format('DD-MMM-YYYY');
        break;
    }
  }

  filterColumn(i: number) {
    if (!this.filterflag[i]) {
      this.filterflag.fill(false);
      //console.log(this.filterflag);
      this.filterflag[i] = true;
    } else {
      this.filterflag.fill(false);
    }
    console.log(this.filterflag, this.filterObj);
    this.filterType = this.columnTargetValues[i];
  }

  getMetadata(WorkflowID: any) {
    this.api.getWorkflowMetadata(WorkflowID, this.username);
  }

  changeWorkflow() {
    // this.tokens = [];
    this.columnNames = [];
    this.loader = true;
    this.queueLoader = true;
    this.queues = [];
    sessionStorage.removeItem('Workflow');

    let comp = this.workflow;
    let rebels = this.workflowArray.filter(function (data) {
      return data.Value.toString().toLowerCase() === comp.toLowerCase();
      // return data.Value === 'Mutual Fund Workflow';
    });
    // this.queueMapping.push(rebels[0]);
    if (rebels.length !== 0) {
      this.workflowId = rebels[0].Id;
      this.getMetadata(rebels[0].Id);
      this.getQueues(rebels[0].Id);
      this.getTokens(rebels[0].Id, '%%', 1);
      this.status = '';
    } else {
      this.tokens = [];
      this.columnNames = [];
      this.loader = false;
      this.queueLoader = false;
      this.queues = [];
      this.status = 'No records found.';
    }
  }

  reloadRecords() {
    this.getQueues(this.workflowId);
    this.getTokens(this.workflowId, this.selectedqueueId, 1);
    this.getActions(this.selectedqueueId);
  }

  validateCheckboxes(j) {
    if (this.checkboxs[j] === false) {
      document.getElementById('checkboxID').className = 'checkboxes';
    }
  }
  back() {
    this.location.back();
  }
}
