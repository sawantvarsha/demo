import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TmplAstBoundAttribute } from '@angular/compiler';
import { environment } from 'src/environments/environment';
import { EcCommonService } from './ec-common.service';
import { AppConfig } from 'src/app/services/config.service';

declare var require: any;
const $: any = require('jquery');

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  public WorkflowObserver = new BehaviorSubject<any>([]);
  workflows = this.WorkflowObserver.asObservable();

  public QueuesObserver = new BehaviorSubject<any>([]);
  queues = this.QueuesObserver.asObservable();

  public TokensObserver = new BehaviorSubject<any>([]);
  tokens = this.TokensObserver.asObservable();

  public ButtonsObserver = new BehaviorSubject<any>([]);
  buttons = this.ButtonsObserver.asObservable();

  public processTokenObserver = new BehaviorSubject<any>([]);
  processToken = this.processTokenObserver.asObservable();

  public getMetadata = new BehaviorSubject<any>([]);
  getMetadataObserver = this.getMetadata.asObservable();

  public getCommonData = new BehaviorSubject<any>([]);
  getCommonDataObserver = this.getCommonData.asObservable();

  // interfaceUrl = environment.interfaceURL;
  interfaceUrl = environment.interfaceURL;
 
  constructor(private EcCommon: EcCommonService, private http: HttpClient) {
    

  }

  loadWorkflow(loginId: string) {
    try {
      console.log(loginId)
      // var UserID = (this.EcCommon.getLoggedInUserName())[0].UserId;
      var UserID = AppConfig.settings.oRes.userID;

      // const webMethod = this.interfaceUrl + 'getWorkflow';
      const webMethod = AppConfig.settings.apiBaseUrl + 'wbapi/getWorkflowTemplateMapping';
      const parameters = {
        loginid: UserID //loginId,
      }
      const that = this;
      // $.ajax({
      //   async: true,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*',
      //   },
      //   data: JSON.stringify({
      //     loginid: UserID //loginId,
      //   }),
      //   processData: false,
      //   success(data) {
      //     // //console.log('Workflows', data);
      //     that.WorkflowObserver.next(data);
      //   },
      //   error() {
      //     // //console.log("error getWorflows", error);
      //   },
      // });

      this.http.post(webMethod, parameters).subscribe((data) => {
        that.WorkflowObserver.next(data);
      })

    } catch (error) {
      // console.error(error);
    }
  }

  loadQueues(
    workflowId: string,
    // entityId: number,
    fromDate: any,
    toDate: string,
    workFlowName: string,
    login: any

  ) {
    try {
      console.log(login)
      // var UserID = (this.EcCommon.getLoggedInUserName())[0].UserId;
      var UserID = AppConfig.settings.oRes.userID;

      // const webMethod = this.interfaceUrl + 'getQueues';//Anubhav 10-Jan-23
      const webMethod = AppConfig.settings.apiBaseUrl + 'wbapi/getqueues';//Anubhav 10-Jan-23
      const parameters = {
        "filter": [
          {
            "sEvent": "",
            "sScheme": "",
            "sScheme_Code": "",
            "sProduct_Code": "",
            "sProduct_Doc_Type": "",
            "sProductId": "0",
            "bAll": true,
            "sRm": "",
            "sCustomerId": "",
            "sBook": "",
            "sFromDate": fromDate,
            "sToDate": toDate,
            "sQueueId": "%%",
            "sWorkFlowType": workFlowName,
            "sWorkFlowTypeId": workflowId,
            "sTokenToSearch": "",
            "bShowParentToken": false,
            "bShowBoth": false,
            "lEntity_Id": AppConfig.settings.oRes.homeEntityID,
            "sBackSucessQueue": "",
            "allEntity": "",
            "sTemplateId": "%%",
            "sWorkflowSuperType": "TRADE",
            "parentTokenId": -1
          }
        ],
        "Login": UserID,
        "customfilter": "",
        "datefilterType": "Trade_Date",
        "product_Id": "0",
        "paymentType": "",
        "I_strApplyDealCreatedByFilter": "",
        "IncludeAllDate": "false"
      }
      // //console.log(webMethod);
      const that = this;
      // $.ajax({
      //   async: true,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*',
      //   },
      //   data: JSON.stringify({
      //     workflowID: workflowId,
      //     // entityID: entityId,
      //     entityID: (this.EcCommon.getLoggedInUserName())[1].EntityId,
      //     fromDate,
      //     toDate,
      //     workflow: workFlowName,
      //     login: UserID,
      //   }),
      //   processData: false,
      //   success(data) {
      //     const returnData = { queues: [], WorkFlowName: workFlowName };
      //     returnData.queues = data;
      //     that.QueuesObserver.next(returnData);
      //   },
      //   error() {
      //     // //console.log("error getQueues", error);
      //   },
      // });

      this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        const returnData = { queues: [], WorkFlowName: workFlowName };
        returnData.queues = data;
        that.QueuesObserver.next(returnData);
      }).catch(error => {
        console.log(error);
      })


    } catch (error) {
      // console.error(error);
    }
  }

  loadTokens(
    workflow: string,
    workflowID: string,
    queueId: number,

    toDate: string,
    fromDate: string,
    pageNo: number,
    records: number,
    login
  ) {
    try {
      console.log(login)
      // const webMethod = this.interfaceUrl + 'getTokens';
      // var UserID = (this.EcCommon.getLoggedInUserName())[0].UserId;
      var UserID = AppConfig.settings.oRes.userID;

      // const webMethod = this.interfaceUrl + 'getTokens_WFBLotter';//Riddhi P duplicate service
      const webMethod = AppConfig.settings.apiBaseUrl + 'wbapi/getdatafromuspcustomfilter';//Riddhi P duplicate service
      const parameters = {
        "Filter": [
          {
            "sEvent": "",
            "sScheme": "",
            "sScheme_Code": "",
            "sProduct_Code": "",
            "sProduct_Doc_Type": "",
            "sProductId": "0",
            "bAll": true,
            "sRm": "",
            "sCustomerId": "",
            "sBook": "",
            "sFromDate": fromDate,
            "sToDate": toDate,
            "sQueueId": queueId.toString(),
            "sWorkFlowType": workflow,
            "sWorkFlowTypeId": workflowID,
            "sTokenToSearch": "",
            "bShowParentToken": false,
            "bShowBoth": false,
            "lEntity_Id": AppConfig.settings.oRes.homeEntityID,
            "sBackSucessQueue": "",
            "allEntity": "",
            "sTemplateId": "%%",
            "sWorkflowSuperType": "TRADE",
            "parentTokenId": -1
          }
        ],
        "Login": UserID,
        "RowsPerPage": records.toString(),
        "PageNo": pageNo.toString(),
        "CustomFilter": "",
        "DateFilterName": "Trade_Date",
        "Product_Id": "0",
        "PaymentType": "",
        "ApplyDealCreatedByFilter": "",
        "IncludeAllDate": "false"
      }
      // //console.log(webMethod);
      const that = this;

      // $.ajax({
      //   async: true,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'text',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*',
      //   },
      //   data: JSON.stringify({
      //     fromDate,
      //     toDate,
      //     workflow: workflow,
      //     workflowID: workflowID,
      //     queueID: queueId.toString(),
      //     rows: records.toString(),
      //     // entityID: 4,
      //     entityID: (this.EcCommon.getLoggedInUserName())[1].EntityId,
      //     pageNo: pageNo.toString(),
      //     login: UserID,
      //   }),
      //   processData: false,
      //   success(data) {
      //     const json = that.EcCommon.xml2json(data).NewDataSet.DUMMY;
      //     // //console.log(json);
      //     let result = [];
      //     if (json) {
      //       if (json['#text'] !== null) {
      //         delete json['#text'];
      //         result.push(json);
      //       }
      //       if (Array.isArray(json)) {
      //         json.forEach((item) => {
      //           if (item['#text'] !== null) {
      //             delete item['#text'];
      //           }
      //         });
      //         // //console.log(json);
      //         result = json;
      //       }
      //     }
      //     // //console.log(result);
      //     that.TokensObserver.next(result);
      //     $('#loading').hide();
      //   },
      //   error() {
      //     // //console.log("error getTokens", error);
      //   },
      // });

      this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        const tempjson = that.EcCommon.xml2json(data.XmlString);
        const json = tempjson.NewDataSet.DUMMY;
        let result = [];
        if (json) {
          if (json['#text'] !== null) {
            delete json['#text'];
            result.push(json);
          }
          if (Array.isArray(json)) {
            json.forEach((item) => {
              if (item['#text'] !== null) {
                delete item['#text'];
              }
            });
            result = json;
          }
        }
        that.TokensObserver.next(result);
        $('#loading').hide();
      }).catch(error => {
        console.log(error);

      })

    } catch (error) {
      // console.error(error);
    }
  }


  async loadRestTokens(
    workflow: string,
    workflowID: string,
    queueId: number,

    toDate: string,
    fromDate: string,
    pageNo: number,
    records: number,
    login
  ) {
    console.log(login)
    try {
      // const webMethod = this.interfaceUrl + 'getTokens';
      var UserID = AppConfig.settings.oRes.userID;
      // const webMethod = this.interfaceUrl + 'getTokens_WFBLotter';//Riddhi P duplicate service
      const webMethod = AppConfig.settings.apiBaseUrl + 'wbapi/getdatafromuspcustomfilter';//Riddhi P duplicate service

      const parameters = {
        "Filter": [
          {
            "sEvent": "",
            "sScheme": "",
            "sScheme_Code": "",
            "sProduct_Code": "",
            "sProduct_Doc_Type": "",
            "sProductId": "0",
            "bAll": true,
            "sRm": "",
            "sCustomerId": "",
            "sBook": "",
            "sFromDate": fromDate,
            "sToDate": toDate,
            "sQueueId": queueId.toString(),
            "sWorkFlowType": workflow,
            "sWorkFlowTypeId": workflowID,
            "sTokenToSearch": "",
            "bShowParentToken": false,
            "bShowBoth": false,
            "lEntity_Id": AppConfig.settings.oRes.homeEntityID,
            "sBackSucessQueue": "",
            "allEntity": "",
            "sTemplateId": "%%",
            "sWorkflowSuperType": "TRADE",
            "parentTokenId": -1
          }
        ],
        "Login": UserID,
        "RowsPerPage": records.toString(),
        "PageNo": pageNo.toString(),
        "CustomFilter": "",
        "DateFilterName": "Trade_Date",
        "Product_Id": "0",
        "PaymentType": "",
        "ApplyDealCreatedByFilter": "",
        "IncludeAllDate": "false"
      }

      const that = this;
      var restTokens = [];
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'text',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*',
      //   },
      //   data: JSON.stringify({
      //     fromDate,
      //     toDate,
      //     workflow: workflow,
      //     workflowID: workflowID,
      //     queueID: queueId.toString(),
      //     rows: records.toString(),
      //     // entityID: 4,
      //     entityID: (this.EcCommon.getLoggedInUserName())[1].EntityId,
      //     pageNo: pageNo.toString(),
      //     login: UserID,
      //   }),
      //   processData: false,
      //   success(data) {
      //     const json = that.EcCommon.xml2json(data).NewDataSet.DUMMY;
      //     // //console.log(json);
      //     let result = [];
      //     if (json) {
      //       if (json['#text'] !== null) {
      //         delete json['#text'];
      //         result.push(json);
      //       }
      //       if (Array.isArray(json)) {
      //         json.forEach((item) => {
      //           if (item['#text'] !== null) {
      //             delete item['#text'];
      //           }
      //         });
      //         // //console.log(json);
      //         result = json;
      //       }
      //     }
      //     // //console.log(result);
      //     // that.TokensObserver.next(result);
      //     restTokens = result;
      //     $('#loading').hide();
      //   },
      //   error() {
      //     // //console.log("error getTokens", error);
      //   },
      // });
      // return restTokens;
      await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        const tempjson = that.EcCommon.xml2json(data.XmlString);
        const json = tempjson.NewDataSet.DUMMY;
        let result = [];
        if (json) {
          if (json['#text'] !== null) {
            delete json['#text'];
            result.push(json);
          }
          if (Array.isArray(json)) {
            json.forEach((item) => {
              if (item['#text'] !== null) {
                delete item['#text'];
              }
            });
            result = json;
          }
        }
        restTokens = result;
        $('#loading').hide();
      }).catch(error => {
        console.log(error);

      })
      return restTokens;
    } catch (error) {
      // console.error(error);
    }
  }

  loadButtons(queueId: string, workflowID: string, login) {
    try {
      console.log(login)
      // const webMethod = this.interfaceUrl + 'getButton';//Anubhav Goyal 10-Jan-23
      const webMethod = AppConfig.settings.apiBaseUrl + 'wbapi/getButtonDetail';//Anubhav Goyal 10-Jan-23
      // //console.log(webMethod);
      const that = this;
      var UserID = AppConfig.settings.oRes.userID;
      const parameters = {
        "QueueId": queueId,
        "WorkflowTypeId": workflowID,
        "Mode": "",
        "UserId": UserID,
        "CallingMode": ""
      }
      // $.ajax({
      //   async: true,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*',
      //   },
      //   data: JSON.stringify({
      //     workflowID,
      //     queueID: queueId,
      //     login: UserID,
      //   }),
      //   processData: false,
      //   success(data) {
      //     // //console.log(data);
      //     that.ButtonsObserver.next(data);
      //   },
      //   error() {
      //     // //console.log("error getButtons", error);
      //   },
      // });
      this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        that.ButtonsObserver.next(data);
      }).catch(er => {
        console.log(er);
      })
    } catch (error) {
      // console.error(error);
    }
  }
  

  processButtonAction(
    token: string,
    deal: string,
    button: string,
    sp: string,
    username
  ) {
    try {
      // const webMethod = this.interfaceUrl + 'processTokenonButtonClick';
      const webMethod = AppConfig.settings.apiBaseUrl + 'wbapi/processTokenonButtonClick';
      const parameters = {
        "Tokenid": [token],
        "DealRefNo": [deal],
        "ProcessName": sp.toString(),
        "Userid": AppConfig.settings.oRes.userName.toString(),
        "Action": "PROCESS",
        "ButtonId": button.toString(),
        "Remark": "Angular app movement"
      }
      // //console.log(webMethod);
      const that = this;
      // $.ajax({
      //   async: true,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*',
      //   },
      //   data: JSON.stringify({
      //     tokenId: [token],
      //     dealNo: [deal],
      //     spName: sp,
      //     loginid: username,
      //     buttonId: button,
      //   }),
      //   processData: false,
      //   success(data) {
      //     // //console.log(data);
      //     that.processTokenObserver.next(data);
      //   },
      //   error() {
      //     // //console.log("error processTokenonButtonClick", error);
      //   },
      // });
      this.http.post(webMethod, parameters).subscribe(data => {
        that.processTokenObserver.next(data);
      });
    } catch (error) {
      // console.error(error);
    }
  }

  async fnWorkflowButtonActions(remark: any, button_id: any, button_name: any, tokenid: any) {
    try {
      console.log(remark)
      // const webMethod = this.interfaceUrl + 'WorkflowButtonActions';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/workflowblotter/WorkflowButtonActions';
      var UserID = AppConfig.settings.oRes.userID;
      var workflowButtonActionsData = {};
      const parameters = {
        // workflowID,
        // queueID: queueId,
        // login,
        "Remark": "",
        "button_id": button_id.toString(),
        "button_name": button_name,
        "login_ID": UserID, //"String content",
        "tokenid": tokenid
      }
      // //console.log(webMethod);
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*',
      //   },
      //   data: JSON.stringify({
      //     // workflowID,
      //     // queueID: queueId,
      //     // login,
      //     "Remark":"",
      //     "button_id":button_id,
      //     "button_name":button_name,
      //     "login_ID": UserID, //"String content",
      //     "tokenid":tokenid
      //   }),
      //   success(data) {
      //     //console.log(data);
      //     workflowButtonActionsData = data;
      //     // that.ButtonsObserver.next(data);
      //   },
      //   error() {
      //     // //console.log("error getButtons", error);
      //   },
      // });
      await this.http.post(webMethod, parameters).toPromise().then(data => {
        workflowButtonActionsData = data;
      })
      return workflowButtonActionsData;
    } catch (error) {
      // console.error(error);
    }
  }
  async fnGetWorkflow_EQCEurope() {
    try {
      // const webMethod = this.interfaceUrl + 'getWorkflow_EQCEurope';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/WorkflowBlotter/getEQCEuropeWorkflow';
      var UserID = AppConfig.settings.oRes.userID;
      const parameters = {
        "LoginID": UserID
      }
      var workflowDD = [];
      // //console.log(webMethod);
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*',
      //   },
      //   data: JSON.stringify({
      //     "LoginID": UserID, 

      //   }),
      //   success(data) {
      //     //console.log(data);
      //     // return data;
      //     workflowDD = data;
      //   },
      //   error() {
      //     // //console.log("error getButtons", error);
      //   },
      // });

      await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        workflowDD = data || [];
      })

    } catch (error) {
      // console.error(error);
    }
    return workflowDD;
  }

  getWorkflowMetadata(workflowId: any, loginid: any) {
    // async getWorkflowMetadata(workflowId: any, loginid: any) {

    try {
      //  const webMethod = this.interfaceUrl + 'getWorkflowBlotterMetaData'; //Riddhi P Duplicate api
      const webMethod = AppConfig.settings.apiBaseUrl + 'wbapi/getWorkflowBlotterMetaData'; //Riddhi P Duplicate api
      const parameters = {
        workflowId,
        'loginid': AppConfig.settings.oRes.userID,
      };
      const that = this;
      const response = '';
      this.http.post<any>(webMethod + '', parameters).subscribe((res) => {


        that.getMetadata.next(res);
      });

      // that.getMetadata.next(this.http.post(webMethod, parameters).toPromise());

    }
    catch (error) {
      //console.log(error);
    }
  }

  getWorkflowCommonData() {
    const webMethod = this.interfaceUrl + 'GetCommandata';
    // const webMethod = AppConfig.settings.apiBaseUrl + 'GetCommandata';

    const parameters = {
      DataType: 'CSP_Workflow_Type',
    };
    const that = this;
    const response = '';
    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      // //console.log(res);
      // res.push({'index' : index});
      that.getCommonData.next(res);
    });
  }

  FormatNumberr(v) {
    try {
      
      const notional = v;
      if (v === '-') {
        return v;
      }
      if (v.toString().trim() === '') {
        v = '0.00';
        // const evt = new Event('change');
        // target.dispatchEvent(evt);
      } else {
        v = parseFloat(v).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      }
      // ////console.log(notional);
      return v;
    }
    catch (error) {
      // //console.log("Error:", error);
    }
  }
  checkAndFormatDate(value: string): string {
    if (!isNaN(Date.parse(value))) {
      const d = new Date(value);
      return (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) + '-' + this.months[d.getMonth()] + '-' + d.getFullYear();
    }
    return value;
  }
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  checkAndFormatDateTime(value: string): string {
    if (!isNaN(Date.parse(value))) {
      const d = new Date(value);
      return (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) + '-' + this.months[d.getMonth()] + '-' + d.getFullYear() + ' ' + ((d.getHours() < 10) ? '0' + d.getHours() : d.getHours()) + ':' + ((d.getMinutes() < 10) ? '0' + d.getMinutes() : d.getMinutes()) + ':' + '00';
    }
    return value;
  }
  // DealerRedirection Accept SendOrderToCpty Api Added by SuvarnaP on 16-Dec-2021
  // token.Ref_x0020_No, token.TI_Linked_Trade_ID, token.Token_x0020_Id, 'Y'
  async SendOrderToCpty(finIQRefNO, RFQID, TokenID, OrderRedirectYN) {
    try {
      var res: any;
      // const webMethod = this.interfaceUrl + 'SendOrderToCpty';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Order/SendOrderToCpty';
      const parameters = {
        "Entity_Id": AppConfig.settings.oRes.homeEntityID, //Entity_Id,
        // "RFQID": RFQID,
        // "Note_master_ID": finIQRefNO,
        "RFQID": finIQRefNO,
        "Note_master_ID": RFQID,
        "LoginID": AppConfig.settings.oRes.userID,
        "OrderRedirectYN": OrderRedirectYN,
        "TokenID": TokenID,
      };
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     //console.log(data);
      //     res = data;
      //   },
      //   error() {
      //   }
      // });
      await this.http.post(webMethod, parameters).toPromise().then(data => {
        res = data;
      })
      return res;
    } catch (error) {
      return null;
      //console.log(error);
    }
  }
  // OrderSender - Added by SuvarnaP on 23-Dec-2021
  async OrderSender(RFQID, ppcode) {
    try {
      let res: any;
      const webMethod = this.interfaceUrl + 'eqd/Order/OrderSender';
      // const webMethod = AppConfig.settings.apiBaseUrl + 'OrderSender';

      const parameters = {
        // Entity_Id: (this.EcCommon.getLoggedInUserName())[1].EntityId,
        // RFQID,
        // Note_master_ID,
        // LoginID: (this.EcCommon.getLoggedInUserName())[0].UserId,
        "RFQID": RFQID,
        "ppcode": ppcode,
        "userGroupID": AppConfig.settings.oRes.userID,
      }
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     res = data;
      //     return res;
      //   },
      //   error() {
      //     //console.log(error);
      //   }
      // });
      await this.http.post(webMethod, parameters).toPromise().then(data => {
        res = data;
        // return res;
      });
      return res;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

}
