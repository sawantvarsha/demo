import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { TmplAstRecursiveVisitor } from '@angular/compiler';
import { Guid } from 'guid-typescript';
import { EcHomeService } from '../../services/ec-home.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { CustomerService } from '../../services/customer.service';
import { environment } from 'src/environments/environment';
import {FilterPipe} from '../../pipe/filter.pipe'
import { ActivatedRoute } from '@angular/router';
import { debug } from 'console';

declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-ec-workflow-blotter',
  templateUrl: './ec-workflow-blotter.component.html',
  styleUrls: ['./ec-workflow-blotter.component.scss'],
  providers: [DatePipe]
})



export class EcWorkflowBlotterComponent implements OnInit, OnDestroy {

  @ViewChild('paginator', { static: true }) paginator: PageEvent;
  pageTitle: any;
  filterData: any[]; //Added by AdilP for FIN1EURINT-668 -02-12-2023
  FilterBySearchInput: string; //Added by AdilP for FIN1EURINT-668 -02-12-2023 
  filterBySearch: boolean = false; //Added by AdilP for FIN1EURINT-668 -02-12-2023 

  constructor(public api: CustomerService, public apifunctionsService: EcHomeService,private route: ActivatedRoute,

    private router: Router, public datepipe: DatePipe) { }

  asseturl = environment.asseturl;

  isProd = environment.production;
  showQueueBar = true;
  restCount = 0;
  restQueues = [];
  queues = [];
  tokens = [];
  actions: any;
  status: string;
  queueLoader: boolean;
  showloader: boolean;
  searchText: string = "";
  filterflag: boolean[] = [];
  filterType: string = "AD_Longname";
  columnNames: any[];
  selectedqueueId = '';
  checkboxs: boolean[] = [];
  todate: any;
  fromdate: any;
  regex: RegExp = /_x0020_/g;
  loader: boolean = true;
  checkedAll: boolean = false;
  workflowDD:any[] = [];
  workflow = ''; // = 'Order Workflow(EQC Europe)';
  workflowId: any; //'2186';
  workflowCode: any; //'2186';
  showDocsPopup: boolean = false;
  docsData: Object[] = [];
  docsView : string = "VIEW"
  docsPopupLabels: Object[] = [];
  RefreshDocs: Promise<boolean>
  // Id: "2187"
  // code: "OrderWorkflowEQCEurope"
  // value: "Order Workflow(SP Connect)"

  // Id: "2188"
  // code: "PoolWorkflowEQCEurope"
  // value: "Product Workflow(SP Connect)"

  queueMapping = [];
  columnTargetValues = [];
  columnDataType = [];
  columnstyles = [];
  WorkflowCommonData = [];
  workflowArray = [];
  filterObj = {};
  username = '';
  tokensSubscription: Subscription;
  workflowSubscription: Subscription;
  queuesSubscription: Subscription;
  getCommonDataSubscription: Subscription;
  getMetadataSubscription: Subscription;
  buttonsSubscription: Subscription;
  processTokenSubscription: Subscription;

  successMessage = false; //true;
  successMsgButtonAction = "";
  // Added by AdilP
  successMsg = '';
  errorMsg = '';
  TSLoadFlag = false
  KIDLoadFlag = false

  noOfRecords = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  pageEvent1: PageEvent;
  pageNo = 0;
  pageFirstRecord = (this.pageNo * this.pageSize) + 1;
  pageLastRecord = this.pageSize;

  // View pricer variable -- added by Priya L . on 14-Dec-2021 
  viewRFQID = '';
  NMID = '';
  Issuer = '';
  TokenIdReprice = "";
  viewOnlyFlag = false;
  showPricerScreeninViewMode = false;
  sendtocptyflag = false;
  accord: number = 0;
  pageloadflag = true; //Added by AdilP || FIN1EURINT-282
  ngOnDestroy() {
    if(this.tokensSubscription){
    this.tokensSubscription.unsubscribe();
    }
    // this.workflowSubscription.unsubscribe();
    if(this.queuesSubscription){
      this.queuesSubscription.unsubscribe();
    }
    // this.getCommonDataSubscription.unsubscribe();
    if(this.getMetadataSubscription){
      this.getMetadataSubscription.unsubscribe();
    }
    if(this.buttonsSubscription){
      this.buttonsSubscription.unsubscribe();
    }
    if(this.processTokenSubscription){
      this.processTokenSubscription.unsubscribe();
    }
    this.queues = [];
    this.tokens = [];
    this.workflowArray = [];
    this.workflow = '';
  }
  ngOnInit(): void {
try{
    $('#loading').show();
  //   this.route.params.subscribe
  //   (async params => {
  //   this.pageTitle = params.pageTitle;
  // }); //Added by Jyoti S || 05-May-2023
    this.pageTitle = history.state.pageTitle;//Added by Jyoti S || 25-May-2023

    setTimeout(async () => {
      this.workflowDD = await this.api.fnGetWorkflow_EQCEurope().then((data) => {
        return data as [];
      });
      this.pageloadflag = true; //Added by AdilP || FIN1EURINT-282
      this.errorMsg = '';
      this.status = '';
      this.queueLoader = true;
      this.showloader = true;
      const date = new Date();
      this.todate = date.getFullYear().toString() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
      var today = new Date();
      today.setDate(today.getDate() - 7);
      this.fromdate = this.datepipe.transform(today, 'yyyy-MM-dd');


      this.queues = [];
      this.tokens = [];
      this.workflowArray = [];
      this.workflow = '';
      this.WorkflowCommonData = [];
      this.queueMapping = [];
      this.columnNames = [];
      this.columnTargetValues = [];
      this.columnDataType = [];
      this.columnstyles = [];
      this.selectedqueueId = '';
      this.actions = [];
      this.api.getMetadata.next([]);
      this.api.QueuesObserver.next([]);
      this.api.TokensObserver.next([]);
      this.api.ButtonsObserver.next([]);
      this.api.processTokenObserver.next([]);

      // this.workflow = this.workflowDD[1].value; // 'Order Workflow(EQC Europe)';
      // this.workflowId = this.workflowDD[1].Id; //'2186';
      this.workflow = this.workflowDD[0].value; // 'Order Workflow(EQC Europe)';
      this.workflowId = this.workflowDD[0].id; //'2186';
      this.workflowCode = this.workflowDD[0].code; //'2186';

      this.getMetadata(this.workflowId);
      //console.log(this.columnNames);
      //console.log(this.columnTargetValues);
      // this.columnDataType.push("TEXT");
      //console.log(this.columnDataType);
      //console.log(this.columnstyles);

      this.getQueues(this.workflowId, this.workflow);
      // this.getActions(this.selectedqueueId == 'Rest'? '%%' : this.selectedqueueId);
      this.getActions('%%');

      // //console.log(this.selectedqueueId);
      this.status = '';

      this.getMetadataSubscription = this.api.getMetadataObserver.subscribe((res: any) => {
        if (res && res.length !== 0) {
          // this.status = res.processTokenonButtonClickResult;
          this.columnNames = [];
          this.columnTargetValues = [];
          this.columnDataType = [];
          this.columnstyles = [];

          this.columnNames.push("FinIQ Ref No.");
          this.columnTargetValues.push("Ref_x0020_No");
          // this.columnDataType.push("TEXT");
          this.columnDataType.push("CURRENCY");
          this.columnstyles.push("50");

          for (let i = 1; i < res.length; i++) {
            this.columnNames.push(res[i].WBM_Blotter_Header);
            this.columnstyles.push(parseInt(res[i].Size));
            if (res[i].WBM_Target_Value.includes(' ')) {
              res[i].WBM_Target_Value = res[i].WBM_Target_Value.replace(' ', '_x0020_');
            }
            this.columnTargetValues.push(res[i].WBM_Target_Value);
            this.filterObj[res[i].WBM_Target_Value] = "";
            this.filterflag.push(false);
            this.columnDataType.push(res[i].WBM_Column_Data_type);
            ////console.log(this.columnDataType, this.columnTargetValues);
          }

          ////console.log(this.columnstyles);
        } else {
          ////console.log('err: process');
          this.status = null;
        }
      });

      this.queuesSubscription = this.api.queues.subscribe(async (res: any) => {
        if (res?.length !== 0) {
          if (this.queues !== res.queues) {
            this.loader = false;
          }
          this.queues = res.queues;
          this.loader = false;
          // if(this.selectedqueueId == ""){
          //     this.selectedqueueId = this.queues[0].QM_ID;
          // }
          if (this.queues?.length > 1) {
            this.queues.sort(function (a, b) {
              // if (a.TokenCount < b.TokenCount)
              if (a.TokenCount > b.TokenCount)
                return -1;
              // if (a.TokenCount > b.TokenCount)
              if (a.TokenCount < b.TokenCount)
                return 1;
              return 0;
            });
          }

          // this.queues = this.queues.slice(0,4);
          this.restCount = 0;
          this.restQueues = [];
          //console.log("queues:" + this.queues);
          if (this.queues?.length > 5) {
            if ((this.queues[4].TokenCount) > 0) {
              for (var i = 4; i < this.queues.length; i++) {
                this.restCount = this.restCount + (this.queues[i].TokenCount)
                if (this.queues[i].TokenCount > 0) {
                  this.restQueues.push(this.queues[i]);
                }
              }
            }
          }

          if (this.workflowId !== '') {
            //console.log(this.queues);
            //console.log(this.restQueues);

            if (this.selectedqueueId == "") {
              this.selectedqueueId = this.queues?.length ? this.queues[0].QM_ID : '';
            }
            else {
              var idx = this.queues.findIndex(item => item.QM_ID === this.selectedqueueId);
              var idxRest = this.restQueues.findIndex(item => item.QM_ID === this.selectedqueueId);
              if (idx === -1 && idxRest !== -1) {
                this.selectedqueueId = "Rest"
              }
            }
            //console.log(this.selectedqueueId);
            // this.getTokens(this.workflowId, this.selectedqueueId, 1);
            if (this.selectedqueueId == "Rest") {
              await this.getRestTokens();
            }
            else {
              this.getTokens(this.workflowId, this.selectedqueueId, 1);
              this.pageloadflag = false; //Added by AdilP || FIN1EURINT-282
            }
            // this.getActions(this.selectedqueueId == 'Rest'? '%%' : this.selectedqueueId);
          }
        } else {
          this.queues = null;
          this.loader = false;
        }
      });

      this.tokensSubscription = this.api.tokens.subscribe((ts: []) => {
        //console.log(ts);
        if (ts.length > 0) {
          this.status = '';
          this.tokens = ts;
          this.noOfRecords = this.GetQueueTotalRecords({selectedQueueID: this.selectedqueueId, defaultRecords: this.tokens.length});
          this.getPageInfo({'pageNo':this.pageNo, 'pageSize':this.pageSize,'reload':false, 'length':this.noOfRecords}); //Added by Amogh K | 9-mar-2022
          console.log(this.tokens);
          this.queueLoader = false;

          this.tokens.forEach(element => {
            const arr = Object.keys(element);
            this.checkboxs.push(false);
          });
          if (this.showloader === true) {
            this.queueLoader = false;
          }
        }
        else {
          this.loader = false;
          this.status = 'No records found.'
        }
      });

      this.buttonsSubscription = this.api.buttons.subscribe((res: any) => {
        if (res?.length !== 0) {
          this.actions = res;
          this.actions?.sort((a, b) => {
            if (a.WB_Caption.toLowerCase() > b.WB_Caption.toLowerCase()) { return 1 };
            if (a.WB_Caption.toLowerCase() < b.WB_Caption.toLowerCase()) { return -1 };
            return 0;
          });
        } else {
          this.actions = null;
          this.loader = false;
        }
      });

      this.processTokenSubscription = this.api.processToken.subscribe((res: any) => {
        if (res.length !== 0) {
          this.status = res.processTokenonButtonClickResult;
        } else {
          this.status = null;
        }
      });
      this.pageloadflag = false; //Added by AdilP || FIN1EURINT-282
    });
    /*
    this.apifunctionsService.prevQuoteLaunchPopUpRMWObs.subscribe((res: boolean) => {
       //console.log(this.selectedToken);    
      this.prevQuoteLaunchPopUp = res;
      if(this.selectedToken['Mode'] === 'Reopen'){
       //console.log('reopen');  
       //console.log(this.selectedToken['ButtonAction']);  
       this.WFPerformAction(this.selectedToken, this.selectedToken['ButtonAction']);
      }
      else{
        this.getQueues(this.workflowId, this.workflow);
      }
    });
*/
    // this.apifunctionsService.prevQuoteLaunchPopUpWFBlotterObs.subscribe((res: boolean) => {
    // this.apifunctionsService.prevQuoteLaunchPopUpRMWObs.subscribe((res: boolean) => {
    this.apifunctionsService.prevQuoteLaunchPopUpRMWObs.subscribe((res: any) => {
      // this.selectedToken = token;
      //     this.selectedToken['selectedAction'] = action
      //     this.selectedToken['RedirectedFrom'] = 'Reopen'
      //     this.selectedToken['Mode'] = 'Reopen'
      //     this.selectedToken['buttonID'] = action.WB_ID
      //     this.selectedToken['buttonName'] = action.WB_Caption;
      //     this.selectedToken['Template_Code'] = action.TemplateCode;
      //console.log(res);
      //console.log(this.selectedToken);
      this.prevQuoteLaunchPopUp = res[0];
      if (res[1]) {
        if (this.selectedToken['Mode'] === 'Reopen') {
          //console.log('reopen');
          //console.log(this.selectedToken['ButtonAction']);
          this.WFPerformAction(this.selectedToken, this.selectedToken['ButtonAction']);
        }
        else {
          //console.log('NOt reopen');
          this.getQueues(this.workflowId, this.workflow);
        }
      }
    });
    // View pricer Subscriber / Observer -- added by Priya L . on 14-Dec-2021 
    this.apifunctionsService.showPricerScreeninViewModePopupObs.subscribe((res: boolean) => {
      this.showPricerScreeninViewMode = res;
    });
  }
  catch(error){
    //console.log(error);
  }
  }



  checked(j: number) {
    this.checkboxs[j] = !this.checkboxs[j];
  }

  fncheckedAll() {

  }

  getActions(queueId: string) {
    this.api.loadButtons(queueId, this.workflowId, this.username);
  }

  getQueues(workflowid: any, workflow: any) {
    this.pageloadflag = true; //Added by AdilP || FIN1EURINT-282
    this.errorMsg = '';
    //console.log(this.columnNames);
    //console.log(this.columnTargetValues);
    // this.columnDataType.push("TEXT");
    //console.log(this.columnDataType);
    //console.log(this.columnstyles);

    this.queues = [];
    this.tokens = [];
    $('#loading').show();
    setTimeout(() => {
      this.api.loadQueues(workflowid, this.fromdate, this.todate, workflow, this.username);
    });
  }

  async getTokens(workflowid: any, QueueID: any, TokenCount: any) {
    // this.setPaginatorValues();
    this.selectedqueueId = QueueID;
    if (TokenCount === 0) {
      this.tokens = [];
      this.status = 'No records found.'
      this.noOfRecords = 0;
      this.getPageInfo({'pageNo':0, 'pageSize':this.pageSize,'reload':true, 'length':this.noOfRecords});//Added by Amogh K | 9-mar-2022
      this.queueLoader = false;
      this.showloader = false;
      this.selectedqueueId = QueueID;
      return false;
    }
    this.queueLoader = true;
    this.showloader = true
    $('#loading').show();
    this.status = '';
    this.tokens = [];
    this.pageloadflag = true; //Added by AdilP || FIN1EURINT-282
    setTimeout(async () => {

      if (TokenCount > 0) {
        this.noOfRecords = this.GetQueueTotalRecords({selectedQueueID: QueueID, defaultRecords: TokenCount});
        this.selectedqueueId = QueueID;
        this.api.loadTokens(this.workflow, workflowid, QueueID, this.todate, this.fromdate, (this.pageNo + 1), this.pageSize, this.username);
        this.filterObj = {};
        this.filterflag.fill(false);
        this.checkboxs = [];
        this.pageloadflag = false; //Added by AdilP || FIN1EURINT-282
      }
    });
  }

  filterByDate() {
    this.errorMsg = '';
    this.pageloadflag = true; //Added by AdilP || FIN1EURINT-282
    $("#txtfromdate").next(".error-input").remove();
    $("#txtfromdate").next(".validate-popup").remove();
    $("#txttodate").next(".error-input").remove();
    $("#txttodate").next(".validate-popup").remove();
    //console.log(this.todate, this.fromdate);





    $('#loading').show();
    this.status = '';
    this.tokens = [];
    setTimeout(() => {
      this.setPaginatorValues();
      this.getQueues(this.workflowId, this.workflow);
    });
    this.pageloadflag = false; //Added by AdilP || FIN1EURINT-282
    return false;


  }
  disableLoadFlg = false;
  selectDate(reqPram, date) {
    $("#txtfromdate").next(".error-input").remove();
    $("#txtfromdate").next(".validate-popup").remove();
    $("#txttodate").next(".error-input").remove();
    $("#txttodate").next(".validate-popup").remove();

    this.disableLoadFlg = false;
    //console.log(date);
    //console.log(this.fromdate);
    if (this.fromdate === 'Invalid date' || this.fromdate == '') {

      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + 'Invalid date' + '</span></div>').insertAfter("#txtfromdate")
      $('.validate-popup').delay(5000).fadeOut('slow');
      this.disableLoadFlg = true;
      return false;
    }
    if (this.todate === 'Invalid date' || this.todate == '') {

      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + 'Invalid date' + '</span></div>').insertAfter("#txttodate")
      $('.validate-popup').delay(5000).fadeOut('slow');
      this.disableLoadFlg = true;
      return false;
    }

    switch (reqPram) {
      case 'toDate':
        // this.todate = moment(date).format('DD-MMM-YYYY');
        this.todate = moment(date).format('YYYY-MM-DD');
        var d1 = Date.parse(this.fromdate);
        var d2 = Date.parse(this.todate);
        // if (d1 > d2) {
        if (d2 < d1) {
          // $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.fromdate + '</span></div>').insertAfter("#txtfromdate")
          // $('.validate-popup').delay(5000).fadeOut('slow');
         
          // $('<div class="error-input"></div><div class="validate-popup active"><span> ' + "should be greater than or equal to From date" + '</span></div>').insertAfter("#txttodate")
          // $('.validate-popup').delay(5000).fadeOut('slow');
          // this.disableLoadFlg = true;

          this.fromdate = this.todate;

          return false;
          // this.ErrorMsg = 'Please enter valid date.';
        } else {
          // this.ErrorMsg = '';
        }
        break;
      case 'fromDate':
        // this.fromdate = moment(date).format('DD-MMM-YYYY');
        this.fromdate = moment(date).format('YYYY-MM-DD');
        var d1 = Date.parse(this.fromdate);
        var d2 = Date.parse(this.todate);
        if (d1 > d2) {
          // $('<div class="error-input"></div><div class="validate-popup active"><span> ' + "should be less than or equal to To date" + '</span></div>').insertAfter("#txtfromdate")
          // $('.validate-popup').delay(5000).fadeOut('slow');
          // this.disableLoadFlg = true;

          this.todate = this.fromdate;

          return false;
          // this.ErrorMsg = 'Please enter valid date.';
        } else {
          // this.ErrorMsg = '';
        }
        break;
    }

  }

  filterColumn(i: number) {
    if (!this.filterflag[i]) {
      this.filterflag.fill(false);
      this.filterflag[i] = true;
    }
    else {
      this.filterflag.fill(false);
    }
    //console.log(this.filterflag, this.filterObj);
    this.filterType = this.columnTargetValues[i];
  }

  // async getMetadata(WorkflowID: any) {
   getMetadata(WorkflowID: any) {
    try
    {

    this.api.getWorkflowMetadata(WorkflowID, this.username);
    // await this.api.getWorkflowMetadata(WorkflowID, this.username);
    }
    catch(error){
      //console.log(error);
    }
  }


  reloadRecordsOnchangeWOrkflow() {
    $('#loading').show();
    setTimeout(() => {
      this.queues = [];
      this.tokens = [];

      this.getQueues(this.workflowId, this.workflow);
    });
    return false;
  }
  /*
    reloadRecords() {
      $('#loading').show();
      setTimeout(() => {
        this.queues = [];
        this.tokens = [];
  
        this.getQueues(this.workflowId, this.workflow);
        this.getTokens(this.workflowId, this.selectedqueueId, 1);
  
      });
      return false;
    }*/

  validateCheckboxes(j) {
    if (this.checkboxs[j] === false) {
      document.getElementById('checkboxID').className = 'checkboxes';
    }
  }
  workflowChange() {
    $('#loading').show();

    setTimeout(() => {
      // //console.log('workflow change');

      // //console.log(this.workflowId);
      var idx = this.workflowDD.findIndex(item => item.id.toString() === this.workflowId);
      this.workflow = this.workflowDD[idx].value;
      this.workflowCode = this.workflowDD[idx].code;
      this.selectedqueueId = '';
      this.getMetadata(this.workflowId);
      this.getActions('%%');
      this.reloadRecordsOnchangeWOrkflow();
    });
  }

  clickOutsideActions(j, Ref_x0020_No) {
    var idx = this.tokens.findIndex(item => item.Ref_x0020_No === Ref_x0020_No);
    if (idx > -1) {
      j = idx;
    }
    else {
      return false;
    }
    this.tokens[j].showActionButtons = false; //!this.tokens[j].showActionButtons; //false;;
    this.errorMsg= '';
  }

  showActions(j, Ref_x0020_No) {
    this.errorMsg = '';
    // //console.log('in showActions', j);
    // //console.log('in showActions', Ref_x0020_No);
    // //console.log(this.tokens[j]);
    // //console.log(this.tokens);
    // //console.log(this.filterObj);
    // //console.log(this.tokens.filter(item=>item.Ref_x0020_No === Ref_x0020_No));
    // //console.log(this.tokens.findIndex(item=>item.Ref_x0020_No === Ref_x0020_No));
    var idx = this.tokens.findIndex(item => item.Ref_x0020_No === Ref_x0020_No)
    if (idx > -1) {
      j = idx;
    }
    else {
      return false;
    }
    const shwHide = this.tokens[j].showActionButtons ? this.tokens[j].showActionButtons : false;
    this.tokens.forEach((item) => {
      item.showActionButtons = false;
    });
    this.tokens[j].showActionButtons = true; //!shwHide;
  }

  performActionClosePool(token, action) {
    this.status = "";
    this.successMsgButtonAction = "";
    this.successMessage = false;
    this.confirmPopUp = false;
    //console.log(token);
    var button_id = action.WB_ID; // 13278;
    var button_name = action.WB_Caption;
    var tokenid = token.Token_x0020_Id;
    //console.log(button_id, button_name, tokenid);
    // return false;
    if (action.WB_Caption !== 'Manual Execution' && action.WB_Caption !== 'Open For Subscription') {
      this.WFPerformAction(token, action);
    }
    this.selectedToken = {};

  }

  prevQuoteLaunchPopUp = false;
  confirmPopUp = false;
  selectedToken = {};
  performAction(token, action) {
    this.status = "";
    //console.log(this.actions);
    var btnIdx = this.actions.findIndex(item => item.WB_Caption === action);
    if (btnIdx > -1) {
      action = this.actions[btnIdx];
    }
    else {
      // error
      this.status = "Error occured."
      return false;
    }

    this.successMsgButtonAction = "";
    this.successMessage = false;
    this.selectedToken = {};
    //console.log(token);
    // action.WB_Caption = 'Place with CPTY'


    this.confirmPopUp = false;

    if (action.WB_Caption.toUpperCase() == "ATTACH DOCUMENT") {
      this.selectedToken = token;
      this.AttachDocumentNew(token);
      //this.showAttachmentPopup(token);
      return false;
    }
    if (action.WB_Caption.toUpperCase() == "CLOSE POOL") {
      this.confirmPopUp = !this.confirmPopUp;
      this.selectedToken = token;
      this.selectedToken['selectedAction'] = action
      return false;
    }
    //Changed by Jyoti S || 25-May-2023
    if (action.WB_Caption.toUpperCase() == "VIEW TERMSHEET" || action.WB_Caption.toUpperCase() == "VIEW TS" ) {
     this.TSLoadFlag = true;
      this.ViewDoc(token.Ref_x0020_No,token.PriceProvider || token.Issuer,'IndicativeTermsheet');      
      return false;
    }
    if (action.WB_Caption.toUpperCase() == "VIEW KID" ) {
      this.KIDLoadFlag = true;
      this.ViewDoc(token.Ref_x0020_No,token.PriceProvider || token.Issuer,'Kid');      
      return false;
    }

    if (
      action.WB_Caption !== 'Manual Execution' &&
      action.WB_Caption !== 'Open For Subscription' &&
      action.WB_Caption !== 'Amend Pool' &&
      // (action.WB_Caption.toUpperCase() !== 'Place with CTPY' || action.WB_Caption !== 'Place with CTPY') &&
      action.WB_Caption.toUpperCase() !== 'Place with CTPY'.toUpperCase() &&
      action.WB_Caption.toUpperCase() !== 'Place with CPTY'.toUpperCase() &&
      action.WB_Caption !== 'Reopen Pool' &&
      action.WB_Caption !== 'Manual Allocations'
      // && action.WB_Caption !== 'Assign Allocations'
    ) {
      if (action.WB_Caption === 'Dealer Approve' || action.WB_Caption === 'Barclays Response') {
        this.SendOrderToCptyAction(token, action);
      }
      else {
        this.WFPerformAction(token, action);
      }
    } else {

      switch (action.WB_Caption) {
        case 'Manual Execution':
          this.prevQuoteLaunchPopUp = true;
          // this.router.navigate(['/PreviousQuotesNew', { RFQ_ID: token.Reference_Number, Template_Code: token.TemplateCode, RedirectedFrom: 'ManualHedge', Mode: 'Manual Hedge', OrderNotional: token.Nominal_Amount_x0020_SCB_x0020_Merge }]);
          this.selectedToken = token;
          this.selectedToken['selectedAction'] = action
          this.selectedToken['RedirectedFrom'] = 'ManualHedge'
          this.selectedToken['Mode'] = 'Manual Hedge'
          this.selectedToken['Template_Code'] = action.TemplateCode
          break;
        case 'Manual Allocations':
          this.prevQuoteLaunchPopUp = true;
          // this.router.navigate(['/PreviousQuotesNew', { RFQ_ID: token.Reference_Number, Template_Code: token.TemplateCode, RedirectedFrom: 'ManualHedge', Mode: 'Manual Hedge', OrderNotional: token.Nominal_Amount_x0020_SCB_x0020_Merge }]);
          this.selectedToken = token;
          this.selectedToken['selectedAction'] = action
          this.selectedToken['RedirectedFrom'] = 'ManualAllocations'
          // this.selectedToken['Mode'] = 'ManualAllocations'
          this.selectedToken['Mode'] = 'Manual Hedge'
          this.selectedToken['Template_Code'] = action.TemplateCode
          break;
        case 'Open For Subscription':
          this.prevQuoteLaunchPopUp = true;
          //this.router.navigate(['/PreviousQuotesNew', { RFQ_ID: token.Reference_Number, Template_Code: token.TemplateCode, RedirectedFrom: 'NewPool', Mode: 'NewPool', buttonID: action.WB_ID, buttonName: action.WB_Caption, tokenID: token.Token_x0020_Id }]);
          this.selectedToken = token;
          this.selectedToken['selectedAction'] = action
          this.selectedToken['RedirectedFrom'] = 'NewPool'
          this.selectedToken['Mode'] = 'NewPool'
          this.selectedToken['buttonID'] = action.WB_ID
          this.selectedToken['buttonName'] = action.WB_Caption;
          this.selectedToken['Template_Code'] = action.TemplateCode;
          break;
        case 'Amend Pool':
          this.prevQuoteLaunchPopUp = true;
          //this.router.navigate(['/PreviousQuotesNew', { RFQ_ID: token.Reference_Number, Template_Code: token.TemplateCode, RedirectedFrom: 'NewPool', Mode: 'NewPool', buttonID: action.WB_ID, buttonName: action.WB_Caption, tokenID: token.Token_x0020_Id }]);
          this.selectedToken = token;
          this.selectedToken['selectedAction'] = action
          this.selectedToken['RedirectedFrom'] = 'Amend'
          this.selectedToken['Mode'] = 'Amend'
          this.selectedToken['buttonID'] = action.WB_ID
          this.selectedToken['buttonName'] = action.WB_Caption;
          this.selectedToken['Template_Code'] = action.TemplateCode;
          break;
        case 'Reopen Pool':
          this.prevQuoteLaunchPopUp = true;
          //this.router.navigate(['/PreviousQuotesNew', { RFQ_ID: token.Reference_Number, Template_Code: token.TemplateCode, RedirectedFrom: 'NewPool', Mode: 'NewPool', buttonID: action.WB_ID, buttonName: action.WB_Caption, tokenID: token.Token_x0020_Id }]);
          this.selectedToken = token;
          this.selectedToken['selectedAction'] = action
          this.selectedToken['RedirectedFrom'] = 'Reopen'
          this.selectedToken['Mode'] = 'Reopen'
          this.selectedToken['buttonID'] = action.WB_ID
          this.selectedToken['buttonName'] = action.WB_Caption;
          this.selectedToken['Template_Code'] = action.TemplateCode;
          this.selectedToken['ButtonAction'] = action;
          break;
        case 'Place with CTPY':
        case 'Place with CPTY':
          //console.log('12378', token.TemplateCode);
          this.selectedToken = token;
          //Added by Apurva K for temporary fix for demo purpose as discussed iwth Sudarshan P|| 18-oct-2023
          this.WFPerformAction(token, action);  //Needs to checked later and to be fixed
           //Added by Apurva K for temporary fix for demo purpose as discussed iwth Sudarshan P|| 18-oct-2023
          switch (token.TemplateCode) {
            case "Autocall Phoenix": this.accord = 1;
              break;
            case "Reverse Convertible":
            case "ReverseConvertible": this.accord = 2;
              break;
            case "Credit Tranche": this.accord = 3;
              break;
            case "Participation": this.accord = 4;
              break;
            case "Early Redemption":
            case "Autocallable":
            case "EQC_Europe": this.accord = 5;
              break;
            case "YieldEnhancement":
            case "Yield Enhancement":
              this.accord = 6;
              break;
            case "Discount Certificates":
            case "DiscountCertificates": this.accord = 7;
              break;
            case "Accumulator":
            case "Accu":
            case "ACC": this.accord = 8;
              break;
            case "Decumulator":
            case "Decu":
            case "DAC": this.accord = 9;
              break;
          }
          //console.log(this.accord);
          // if(token.RFQID){
          if (token.Reference_Number) {
            // this.viewRFQID = token.RFQID;
            this.viewRFQID = token.Reference_Number; //for RFQID
          }
          else {
            this.status = "Error occured."
            return false;
          }
          // this.NMID = token.Reference_Number;
          this.NMID = token.Ref_x0020_No;
          this.Issuer = token.Issuer;
          this.TokenIdReprice = token.Token_x0020_Id;
          this.viewOnlyFlag = true;
          this.sendtocptyflag = true;
          // this.tokenID = token.
          this.showPricerScreeninViewMode = true;
          break;
      }
    }
    return false;
  }

  async SendOrderToCptyAction(token, action) {
    if (action.WB_Caption === 'Dealer Approve') {
      let res = this.api.SendOrderToCpty(token.Ref_x0020_No, token.TI_Linked_Trade_ID, token.Token_x0020_Id, 'Y');
      if (res && res['Status'] && res['Status'] === 'Succeed') {
        this.successMessage = true;
        this.successMsgButtonAction = res['ResponseMessage']
      }
    }
    if (action.WB_Caption === 'Barclays Response') {
      // this.viewRFQID = token.RFQID;
      // this.NMID = token.Reference_Number;
      // this.Issuer = token.Issuer;
      //console.log(token.RFQID);
      // var res = this.api.OrderSender(token.RFQID, token.Issuer); Ref_x0020_No
      let res = this.api.OrderSender(token.Reference_Number, token.Issuer);
      if (res && res['Status'] && res['Status'] === 'Succeed') {
        this.successMessage = true;
        this.successMsgButtonAction = res['ResponseMessage']
      }
    }
  }
  async WFPerformAction(token, action) {
    var remark = "";
    var button_id = action.WB_ID; // 13278;
    var button_name = action.WB_Caption;
    var tokenid = token.Token_x0020_Id;
    var workflowButtonActionsData = await this.api.fnWorkflowButtonActions(remark, button_id, button_name, tokenid);
    if (workflowButtonActionsData && workflowButtonActionsData['Message']) {
      this.successMessage = true;
      // this.successMsgButtonAction = workflowButtonActionsData['Message'];
      if (action.WB_Caption === 'Dealer Approve') {
        this.successMsgButtonAction = "Deal " + token.Ref_x0020_No + " sent to counterparty."
      } else if (action.WB_Caption === 'Dealer Reject') {
        this.successMsgButtonAction = "Deal " + token.Ref_x0020_No + " rejected."
      } else if (action.WB_Caption === 'Close Pool') {
        this.successMsgButtonAction = "Product sent to closed pool."
      } else if (action.WB_Caption === 'Cancel Request') {
        this.successMsgButtonAction = "Cancellation Request for Order ID:" + token.Ref_x0020_No;
      } else if (action.WB_Caption === 'Accept Cancellation') {
        this.successMsgButtonAction = "Order ID:" + token.Ref_x0020_No + " cancelled.";
      }else if (action.WB_Caption === 'Reopen Pool'){
        this.successMsgButtonAction = ' Token Ref '+ token.Ref_x0020_No + ' sent to Open For Subscription queue.';  //Added by AdilP || FIN1EURINT-243 || 19-05-2023
      }
      else {
        
        this.successMsgButtonAction = workflowButtonActionsData['Message'];
      }

    }
    else {
      this.status = "Error occured."
    }
  }

  showProdDetails(token) {
    //console.log('showProdDetails', token);
    if (token.Reference_Number && token.Reference_Number !== '') {
      this.status = "";
      this.successMsgButtonAction = "";
      this.successMessage = false;
      this.selectedToken = {};
      //console.log(token);
      this.confirmPopUp = false;

      this.prevQuoteLaunchPopUp = true;
      //this.router.navigate(['/PreviousQuotesNew', { RFQ_ID: token.Reference_Number, Template_Code: token.TemplateCode, RedirectedFrom: 'NewPool', Mode: 'NewPool', buttonID: action.WB_ID, buttonName: action.WB_Caption, tokenID: token.Token_x0020_Id }]);
      this.selectedToken = token;
      this.selectedToken['selectedAction'] = "ViewProduct"
      // this.selectedToken['RedirectedFrom'] = 'Amend'
      // this.selectedToken['Mode'] = 'Amend'
      this.selectedToken['RedirectedFrom'] = "WFBlotter";
      this.selectedToken['Mode'] = "Launch Product";
      // this.selectedToken['buttonID'] = action.WB_ID
      // this.selectedToken['buttonName'] = action.WB_Caption;
      this.selectedToken['Template_Code'] = token.TemplateCode;
      // Reference_Number Ref_x0020_No 
      //console.log(this.prevQuoteLaunchPopUp);
    }
  }

  async getPageInfo(pageInfo, pagiCall = false) { //Changed by Amogh K | 9-mar-2022
    try {
      this.filterBySearch = false  //Added by AdilP for FIN1EURINT-668 -02-12-2023
      this.FilterBySearchInput=''  //Added by AdilP for FIN1EURINT-668 -02-12-2023 
      this.errorMsg = '';
      this.pageloadflag = true; //Added by AdilP || FIN1EURINT-282
      this.noOfRecords = pageInfo.length;
      this.pageSize = pageInfo.pageSize;
      if(pageInfo.reload){
        this.pageNo = 0;
      }
      else{
        this.pageNo = pageInfo.pageNo;
      }
      this.pageFirstRecord = (this.pageNo * this.pageSize) + 1;
      this.pageLastRecord = ((this.pageNo + 1) * this.pageSize) >= this.noOfRecords
        ? this.noOfRecords : ((this.pageNo + 1) * this.pageSize);

      if(pagiCall){
        if (this.selectedqueueId == "Rest") {
          await this.getRestTokens();
        }
        else {
          this.getTokens(this.workflowId, this.selectedqueueId, 1);
        }
      }  
      this.pageloadflag = false; //Added by AdilP || FIN1EURINT-282

    } catch (error) {
      //console.log(error);
    }
  }
  setPaginatorValues() {
    try {
      this.pageNo = 0;
      // this.paginator.pageIndex = 0;
      this.pageFirstRecord = (this.pageNo * this.pageSize) + 1;
      this.pageLastRecord = this.pageSize;
    } catch (error) {
      //console.log(error);
    }
  }
  toggleSuccessMessage() {
    this.successMessage = false;
  }
  async getRestTokens() {
    this.selectedqueueId = "Rest"
    // this.setPaginatorValues();
    this.status = '';
    this.tokens = [];
    this.noOfRecords = 0;
    this.queueLoader = false;
    let recordsToFetch: number = this.pageSize;
    let flag: boolean = true;
    let qIdx: number = 0;
    let qPgNum: number = 1;
    let recToSkip: number = this.pageNo * this.pageSize;

    this.restQueues.map((ele, idx) => {
      this.noOfRecords += ele["TokenCount"];

      if(recToSkip > 0){

        if(recToSkip >= ele["TokenCount"]){
          qIdx = (idx + 1);
          recToSkip -= ele["TokenCount"];
          qPgNum = 1;
        } else {
          qIdx = idx;
          qPgNum = (recToSkip/this.pageSize) + 1;
          recToSkip = 0;
        }

      }
    });
    
    while(flag){
      let tokens1 = await this.api.loadRestTokens(this.workflow, this.workflowId, this.restQueues[qIdx].QM_ID, this.todate, this.fromdate, qPgNum, recordsToFetch, "");
      this.tokens = this.tokens.concat(tokens1);

      if(this.tokens.length < this.pageSize && qIdx < this.restQueues.length) {
        qIdx++;
        qPgNum = 1;
        recordsToFetch = this.pageSize - this.tokens.length;
      }
      if (this.tokens.length >= this.pageSize || qIdx >= this.restQueues.length) {
        flag = false;
        break;
      }
    }

    this.getPageInfo({'pageNo':this.pageNo, 'pageSize':this.pageSize,'reload':false, 'length':this.noOfRecords});
    if (this.tokens.length == 0) {
      this.status = "No records found.";
    }
  }
  //Added by AdilP for FIN1EURINT-668 -02-12-2023 -- Start
  searchFilter(i) {
    this.filterData = this.searchBy(this.tokens, this.columnTargetValues[i]);
    if(this.filterData.length != this.tokens.length){
      this.filterBySearch = true
    }
    else{
      this.filterBySearch = false
      this.FilterBySearchInput ='';
    }
  }
  searchBy(arr: any[], key: any) {
    const ToSearch = this.FilterBySearchInput.split(',').map(arg => arg.trim().toLowerCase());
    arr = arr.filter((s: any) => ToSearch.some(value =>(s[key].toString().toLowerCase().includes(value))))
    return arr;
  }
  //Added by AdilP for FIN1EURINT-668 -02-12-2023 -- End

  showAscOrder(i) {
    //console.log(i);
    //console.log(this.columnDataType[i]);
    //console.log(this.columnNames[i]);
    //console.log(this.columnTargetValues[i]);
    //console.log(this.columnstyles[i]);
    //console.log(this.tokens);
    if (this.columnDataType[i] === 'NUMERIC' || this.columnDataType[i] === 'NUMERIC2' || this.columnDataType[i] === 'NUMERIC4') {
      this.filterBy(this.columnTargetValues[i], this.tokens, true, false);
    }
    else {
      this.filterBy(this.columnTargetValues[i], this.tokens, true, true);
    }
    this.filterflag[i] = false; //DrishtyR | 29-Jul-2021 | Added to close filter panel after sorting
  }

  //DrishtyR | 29-Jul-2021 | Added to fix "On Workflow Blotter, Descending Filters not working" issue
  showDescOrder(i) {
    //console.log(this.columnNames[i]);
    if (this.columnDataType[i] === 'NUMERIC' || this.columnDataType[i] === 'NUMERIC2' || this.columnDataType[i] === 'NUMERIC4') {
      this.filterBy(this.columnTargetValues[i], this.tokens, false, false);
    }
    else {
      this.filterBy(this.columnTargetValues[i], this.tokens, false, true);
    }
    this.filterflag[i] = false;
  }
  // filterBy(key: any, arr: any[], headers: any[], isNaN) {
  filterBy(key: any, arr: any[], isAsc, isNaN) {

    if (isNaN) {
      if (isAsc) {
        arr.sort((a, b) => {
          // a[key] = a[key] === undefined ? '' :a[key];
          // b[key] = b[key] === undefined ? '' :b[key];
          if (a[key] === undefined) {
            return -1;
          }
          if (b[key] === undefined) {
            return 1;
          }

          if (a[key] > b[key]) { return 1; }
          if (a[key] < b[key]) { return -1; }
          return 0;
        });
      } else {
        arr.sort((a, b) => {
          // a[key] = a[key] === undefined ? '' :a[key];
          // b[key] = b[key] === undefined ? '' :b[key];
          if (a[key] === undefined) {
            return 1;
          }
          if (b[key] === undefined) {
            return -1;
          }
          if (a[key] > b[key]) { return -1; }
          if (a[key] < b[key]) { return 1; }
          return 0;
        });
      }
      // e.isAsc = !e.isAsc;
    } else {
      if (isAsc) {
        arr.sort((a, b) => {
          if (a[key] === undefined) {
            return -1;
          }
          if (b[key] === undefined) {
            return 1;
          }
          // return parseFloat(a[key]) - parseFloat(b[key]);
          return (a[key] === '' ? 0.00 : parseFloat(a[key])) - (b[key] === '' ? 0.00 : parseFloat(b[key]));
        });
      } else {
        arr.sort((a, b) => {
          if (a[key] === undefined) {
            return 1;
          }
          if (b[key] === undefined) {
            return -1;
          }
          // return parseFloat(b[key]) - parseFloat(a[key]);
          return (b[key] === '' ? 0.00 : parseFloat(b[key])) - (a[key] === '' ? 0.00 : parseFloat(a[key]));

        });
      }
    }
  }

  // fileName: any;
  // DocumentName: any;
  // byteData: any;
  // DocumentFileType: any;
  // fileNameArr = [];
  /*
  onSelectFileOld(event, token) {
    // //console.log(this.cpnCoupon);
    // //console.log(this.selectedRFQData.SolveForValue);
    this.status = "";
    this.successMsgButtonAction = "";
    this.successMessage = false;

    //console.log("Eventtt:: ", event);
    //console.log("token:: ", token);
    //console.log("token:: ", token.Ref_x0020_No);
    if (event.target.files && event.target.files[0]) {
      var files = event.target.files;
      var file = event.target.files[0];
      this.fileName = event.target.files[0].name;
      this.DocumentName = event.target.files[0].name;
      // this.DocumentName = event.target.files[0].type;
      this.DocumentFileType = event.target.files[0].type;
      // //console.log(this.DocumentName);

      this.getByteArray(file).then((byteArray) => {
        let jsonObject: any;
        this.byteData = byteArray;
        //console.log(this.byteData);
        // this.saveAttachment(token.Ref_x0020_No)
        if (this.byteData == undefined || this.DocumentName == undefined || this.DocumentName == "") {
          return false;
        }
        else {
          var res = this.apifunctionsService.addAttachment("", this.DocumentName, this.byteData, this.DocumentFileType, token.Ref_x0020_No, "", "");
          if (res && res.AttachDocumentResult) {
            // this.status = "";
            this.successMsgButtonAction = "Document attached Successfully";
            this.successMessage = true;
          }
          else {
            this.status = "Error occured."
          }

        }
        // this.imgArr=byteArray;
      })
      //console.log(this.byteData);
    }
  }
  */
 /*
  onSelectFile_old(event, token) {
    this.status = "";
    this.successMsgButtonAction = "";
    this.successMessage = false;
    var fileNameArr = [];

    //console.log("Eventtt:: ", event);
    //console.log("token:: ", token);
    //console.log("token:: ", token.Ref_x0020_No);
    if (event.target.files && event.target.files[0]) {
      var files = event.target.files;
      var file = event.target.files[0];
      var fileName = event.target.files[0].name;
      var DocumentName = event.target.files[0].name;
      // this.DocumentName = event.target.files[0].type;
      var DocumentFileType = event.target.files[0].type;
      // //console.log(this.DocumentName);

      this.getByteArray(file).then((byteArray) => {
        let jsonObject: any;
        var byteData = byteArray;
        //console.log(byteData);
        // this.saveAttachment(token.Ref_x0020_No)
        if (byteData == undefined || DocumentName == undefined || DocumentName == "") {
          return false;
        }
        else {
          // var res = this.apifunctionsService.addAttachment("", this.DocumentName, this.byteData, this.DocumentFileType, token.Ref_x0020_No, "", "");
          fileNameArr.push({
            // "Done_Notional": this.viewOrderData[k].Done_Notional[0].replace(/,/g, ''),
            // "Note_Deal_ID": this.viewOrderData[k].Deal_x0020_ID[0]
            "DocumentID": "",
            "DocumentName": DocumentName,
            "DocumentByteFile": byteData,
            "DocumentFileType": DocumentFileType,
            "NoteMasterID": token.Ref_x0020_No,
            "CreatedAt": "",
            "CreatedBy": "",
            "EntityID": "", // this.co.getLoggedInUserName()[1].EntityId //req.body['EntityID']
          });
          if (fileNameArr.length > 0) {
            var res = this.apifunctionsService.addAttachment(fileNameArr);
            if (res && res.AttachDocumentResult) {
              // this.status = "";
              this.successMsgButtonAction = "Document attached Successfully";
              this.successMessage = true;
            }
            else {
              this.status = "Error occured."
            }
          }
        }
        // this.imgArr=byteArray;
      })
      // //console.log(byteData);
    }
  }


  getByteArray_old(file) {
    return new Promise(function (resolve, reject) {
      const fileReader: FileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = function (event) {
        let array: any;
        // array = event.target.result;
        array = fileReader.result;
        const fileByteArray = [];
        let bytesData: any;
        for (let i = 0; i < new Uint8Array(array).length; i++) {
          fileByteArray.push(new Uint8Array(array)[i]);

        }
        //  return fileByteArray;
        //console.log(fileByteArray);
        resolve(fileByteArray);  // successful
      }
      fileReader.onerror = reject; // call reject if error
    })
  }
  */
  /*
    saveAttachment(NoteMasterID) {
      // var EntityID = this.comm.getLoggedInUserName()[1].EntityId;+
      //console.log(this.DocumentName);
      //console.log(this.byteData);
      if(this.byteData == undefined || this.DocumentName == undefined || this.DocumentName == "" ){
       return false;
      }
      else{
        this.apifunctionsService.addAttachment("", this.DocumentName, this.byteData, this.DocumentFileType, NoteMasterID, "", "");
      }
    }
  */

  // orange: #ffa207 #ff8100ed ;
  // red : rgb(234, 108, 100) #ea6c64;
  // green : rgb(15, 157, 85) #0f9d55;

  statusColourArray = [
    {
      status: "dafault",
      color: "#ff8100ed"
    },
    {
      status: "Pending Dealer Approval",
      // color: "#ffa207" //orange
      color: "#ff8100ed" //orange
      // color: "#16744704" //orange
    },
    {
      status: "Placed With Cpty",
      // color: "#16777215" //green
      color: "#0f9d55" //green
    },
    {
      status: "New Subscription",
      color: "#ff8100ed" //orange
    },
    {
      status: "Order Cancelled",
      color: "#ea6c64" //red
    },
    {
      status: "Order Rejected",
      color: "#ea6c64" //red
    },
    {
      status: "Pending Order Response",
      color: "#ff8100ed" //orange
    },
    {
      status: "Order Filled",
      // color: "#0f9d55" //green
      color: "#006400" //dark green
    },
    {
      status: "Order Partially Filled",
      // color: "#0f9d55" //green
      color: "#006400" //dark green
    },
    {
      status: "Cancellation Requested",
      color: "#ff8100ed" //orange
    },
    // {
    //   status: "Cancellation Requested",
    //   color: "#ffa207" //orange
    // },
    {
      status: "Dealer Rejected",
      color: "#ea6c64" //red
    },
    // {
    //   status: "Order Rejected",
    //   color: "#ea6c64" //red
    // },
    {
      status: "Order Lapsed",
      color: "#ea6c64" // red
    },
    {
      status: "Order Expired",
      color: "#ea6c64" //red
    },
    {
      status: "New Pool",
      color: "#ff8100ed" //orange
    },
    {
      status: "Open For Subscription",
      color: "#0f9d55" //green
    },
    {
      status: "Pool Closed",
      color: "#ff8100ed" //orange
    },
    {
      status: "Placed With Cpty",
      color: "#0f9d55" //green
    },
    {
      status: "Pool Executed",
      // color: "#0f9d55" //green
      color: "#006400" //dark green
    },
    {
      status: "Pending Allocation",
      color: "#ff8100ed" //orange
    },
    {
      status: "Pool Cancelled",
      color: "#ea6c64" //red
    },
    {
      status: "Pool Rejected",
      color: "#ea6c64" //red
    }
  ];

  actionButtonArray = [
    {
      action: "dafault",
      imgName: "cancel-icon.png"
    },
    {
      action: "Amend Pool",
      imgName: "amend1.png"
    },
    {
      action: "Cancel Order",
      imgName: "cancel-icon.png"
    },
    {
      action: "Cancel Pool",
      imgName: "cancel-icon.png"
    },
    {
      action: "Close Pool",
      imgName: "close-icon.png"
    },
    {
      action: "Manual Execution",
      imgName: "manual.png"
    },
    {
      action: "Manual Allocations",
      imgName: "manual.png"
    },
    {
      action: "Assign Allocations",
      imgName: "manual.png"
    },
    {
      action: "Open For Subscription",
      // imgName : "openForSubscription.png"
      imgName: "amend.png"
    },
    {
      action: "Reject",
      imgName: "reject.png"
    },
    {
      action: "Reject Pool",
      imgName: "reject.png"
    },
    {
      action: "Dealer Approve",
      imgName: "manual.png"
    },
    {
      action: "Dealer Reject",
      imgName: "reject.png"
    },
    {
      action: "Workflow Journey",
      imgName: "journey.png"
    },
    {
      action: "Cancel Request",
      imgName: "cancel-icon.png"
    },
    {
      action: "Accept Cancellation",
      imgName: "approve.png"
    },
    {
      action: "Reopen Pool",
      // imgName : "amend.png"
      imgName: "amend1.png"
    },
    {
      action: "Place with CTPY",
      imgName: "manual.png"
    },
    {
      action: "Place with CPTY",
      imgName: "manual.png"
    },
    {
      action: "Barclays Response",
      imgName: "amend.png"
    },
    {
      action: "Attach Document",
      imgName: "link.png"
    },
    {
      action: "View Termsheet",
      imgName: "viewImg.png"
    },
    // Added by Adilp for FIN1EURINT-653 || 19-10-2023 || Start
    {
      action: "View TS",
      imgName: "viewImg.png"
    },
    {
      action: "View KID",
      imgName: "viewImg.png"
    }
     // Added by Adilp for FIN1EURINT-653 || 19-10-2023 || End
  ]

  // getAction(tokenActions, action){
  getAction(action) {
    var idx = this.actionButtonArray.findIndex(item => item.action === action);
    if (idx !== -1) {
      return this.actionButtonArray[idx].imgName;
    }
    else {
      return this.actionButtonArray[0].imgName;
    }
  }

  getStatusColourArray(status) {
    // statusColourArray
    // //console.log(status);
    var idx = this.statusColourArray.findIndex(item => item.status === status);
    if (idx !== -1) {
      return this.statusColourArray[idx].color;
    }
    else {
      return this.statusColourArray[0].color;
    }
  }
  getStatusColor(color) {
    // "rgba(0-255,0-255,0-255,0-1)"
    var colorRGB = this.toColor(color);
    // //console.log(colorRGB);
    return colorRGB;
    // var newColor = parseInt(color.toString(16), 16);
    // return '#' + newColor;
  }

  toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
      g = (num & 0xFF00) >>> 8,
      r = (num & 0xFF0000) >>> 16,
      // a = ((num & 0xFF000000) >>> 24) / 255;
      a = 1;
    return "rgba(" + [r, g, b, a].join(",") + ")";
  }

  fileNameArr = [];
  shwAttachmentPopUp =false;
  attachmentErrorMsg = "";
  async showAttachmentPopup(token){
    this.shwAttachmentPopUp = true;
    this.attachmentErrorMsg = "";
    this.fileNameArr = [];
    await this.viewAttachment(token.Ref_x0020_No)
  }

  hideAttachmentPopup(){
    this.shwAttachmentPopUp = false;
  }

  async viewAttachment(NoteMasterID: any) {
    this.errorMsg = '';
    // this.showAttahmentflag = true;
    //console.log("this is view attachment func call", NoteMasterID);
    // this.downloadAttachment(NoteMasterID);
    this.fileNameArr = await this.apifunctionsService.viewAttachment(NoteMasterID);
    // this.attachmentName = this.ViewAttachmentRes.DocumentName;
    //console.log(this.fileNameArr);
  }

  onSelectFile(event) {
    //console.log("Eventtt:: ", event);
    if (event.target.files && event.target.files[0]) {
      var files = event.target.files;
      var file = event.target.files[0];
      var fileName = event.target.files[0].name;
      var DocumentName = event.target.files[0].name;
      var DocumentFileType = event.target.files[0].type;
      this.getByteArray(file).then((byteArray) => {
        let jsonObject: any;
        var byteData = byteArray;
        //console.log(byteData);
        // this.imgArr=byteArray;
        this.fileNameArr.push({
          // "Done_Notional": this.viewOrderData[k].Done_Notional[0].replace(/,/g, ''),
          // "Note_Deal_ID": this.viewOrderData[k].Deal_x0020_ID[0]
          "DocumentID": "",
          "DocumentName": DocumentName,
          "DocumentByteFile": byteData,
          "DocumentFileType": DocumentFileType,
          "NoteMasterID": "",
          "CreatedAt": "",
          "CreatedBy": "",
          "EntityID": "" //this.cfs.getLoggedInUserName()[1].EntityId //req.body['EntityID']

        });
           })
      return false;
    }

  }
  getByteArray(file) {
    return new Promise(function (resolve, reject) {
      const fileReader: FileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = function (event) {
        console.log(event)
        let array: any;
        // array = event.target.result;
        array = fileReader.result;
        const fileByteArray = [];
        let bytesData: any;
        for (let i = 0; i < new Uint8Array(array).length; i++) {
          fileByteArray.push(new Uint8Array(array)[i]);

        }
        resolve(fileByteArray);  // successful
      }
      fileReader.onerror = reject; // call reject if error
    })
  }

  removeAttachment(idx) {
    if (this.fileNameArr !== null && this.fileNameArr !== undefined && this.fileNameArr.length > 0) {
      this.fileNameArr.splice(idx, 1);
    }
  }

  downloadAttachment(idx) {
    // //console.log(res);
    if (this.fileNameArr !== null && this.fileNameArr !== undefined && this.fileNameArr.length > 0) {
      // //console.log(this.ViewAttachmentRes);
      const bytes = new Uint8Array(this.fileNameArr[idx].DocumentByteFile);
      const blob = new Blob([bytes], { type: 'application/doc' }); //DocumentFileType
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = this.fileNameArr[idx].DocumentName;
      link.click();
    }
    else {
      this.attachmentErrorMsg = 'Attachment not available. Please try again later.';

    }
  }

  async saveAttachment(NoteMasterID) {
    // this.successMessage = '';
    // this.EntityID = this.cfs.getLoggedInUserName()[1].EntityId;+
    // //console.log(this.DocumentName);
    // //console.log(this.byteData);
    // if (this.byteData == undefined || this.DocumentName == undefined || this.DocumentName == "") {
    //   return false;
    // }
    // else {
    // this.afs.addAttachment("", this.DocumentName, this.byteData, this.DocumentFileType, NoteMasterID, "", "");
    // NoteMasterID = this.selectedToken['Ref_x0020_No'];
    if (this.fileNameArr.length > 0) {
      this.fileNameArr.forEach(item => item.NoteMasterID = NoteMasterID);
       var res = await this.apifunctionsService.addAttachment(this.fileNameArr);
       //console.log(res);
       if(res){
        this.successMessage = true;
        this.successMsgButtonAction = "Document attached Successfully."
        this.shwAttachmentPopUp = false
       }
    }
    // }
  }

  postBackMethod() {
    try {
      return false;
    } catch (error) {
      //console.log(error);
    }
  }
   // Added by Suvarna P on 22Mar2022 || assign by Pranav D.
   // Indicative Termsheet generation and Download - added by PriyaL on 07Mar2022 -assigned by PranavD - Start
   GenerateDocument(noteMasterID: any, RFQ : any) {
    try {
      this.status ='';
      // this.NMID = token.Ref_x0020_No;
      const res: any = this.apifunctionsService.GenerateDocument(noteMasterID + '~' + RFQ);
      if (res !== null && res !== undefined) {
        if (res.GeneratedFileBytes[0] !== undefined) {
          const bytes = new Uint8Array(res.GeneratedFileBytes);
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download =  this.selectedToken['TemplateCode']  + "_" + Guid.create();
         
          link.click();
        } else {
          this.status  = res.Status.toString();
        }

      } else {
        this.status  = 'Termsheet not available. Please try again later.';
      }
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

  GetQueueTotalRecords(obj: IQueueTotalRecordsDTO): number{
    try {
      return this.queues?.length ? 
              (this.queues.find(ele => ele["QM_ID"] === obj.selectedQueueID)?.["TokenCount"] || obj.defaultRecords) 
                  : obj.defaultRecords;
    } catch (error) {
      console.log(error);
      return obj.defaultRecords;
    }
  }

  closeDocsModal(val: boolean) {
    try {
      this.showDocsPopup = val;
    } catch (error) {
      console.log(error);
    }
  }

  showDocsModal() {
    try {
      this.showDocsPopup = true;
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  async ViewDoc(RFQ,LP,docType) {
    try {
      //this.RefreshDocs = this.ViewDoc(RFQ,LP,docType);
      this.errorMsg = '';
      this.docsData = [];
      this.docsView = "VIEW";
      let showFlag = false;
      const res: any = await this.apifunctionsService.ViewTermsheet(RFQ, docType);
      const thisRef = this;
      this.docsPopupLabels = [
        {title: "Counterparty", value: LP},
      ];
      if (res?.length) {
        //<Sudarshan | base64 to Bytes>
        if(res[0].DGI_Image == null){
          this.errorMsg = res[0].Status.toString();
        }else
        res.forEach(function (item : any) {
          if (item.Status.toString().toUpperCase() === 'SUCCESS') {
             const downloadLink = document.createElement('a');
           let fileName = item.Document_Output_Path;
           downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
           downloadLink.download = fileName;
            const obj = {
              "File Name": item["Document_Output_Path"],
              "Type": item["DocumentType"],
              "Language": item["DocumentLanguage"],
              "Country": item["DocumentCountry"],
              "View": () => { downloadLink.click();},
            }
            thisRef.docsData.push(obj);
            showFlag = true;          
          }
          else {
            this.ErrorMsgTop = item.Status.toString();
            showFlag = false;
          }
        });
        //</Sudarshan | base64 to Bytes>       
        this.showDocsPopup = showFlag; 
      } else {
        this.showDocsPopup = false;
  
  
      }// Changed by Jyoti S || 25-May-2023  || END
      this.TSLoadFlag= false;
      this.KIDLoadFlag= false;
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

  async AttachDocumentNew(token){
    try {
      
      
      this.errorMsg = '';
      this.docsData = [];
      this.showDocsPopup = true;
      this.docsPopupLabels = [
        {title: "Counterparty", value: token.Issuer},
        {title: "Product Name ", value: token.Deal_x0020_details},
        {title: "RFQ ID ", value: token.Reference_Number},
        {title: "ISIN", value: token.Ref_x0020_No},


      ];
      this.docsView= "ATTACH"
      
    } catch (error) {
      console.log("Error: ", error)
    }  
  }
}

interface IQueueTotalRecordsDTO {
  selectedQueueID: string, 
  defaultRecords: number
}


