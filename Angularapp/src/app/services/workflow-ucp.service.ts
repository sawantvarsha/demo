import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { AppConfig } from './config.service';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Injectable({
  providedIn: 'root',
})
export class WorkflowUCPService {
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  private WorkflowUCPObserver = new BehaviorSubject<any>([]);
  workflowsUCP = this.WorkflowUCPObserver.asObservable();

  private QueuesUCPObserver = new BehaviorSubject<any>([]);
  QueuesUCP = this.QueuesUCPObserver.asObservable();

  private WorkflowMetadataUCPObserver = new BehaviorSubject<any>([]);
  WorkflowMetadataUCP = this.WorkflowMetadataUCPObserver.asObservable();

  private WorkflowDataUCPObserver = new BehaviorSubject<any>([]);
  WorkflowDataUCP = this.WorkflowDataUCPObserver.asObservable();

  private dispPriorityChangedObserver = new BehaviorSubject<any>([]);
  dispPriorityChanged = this.dispPriorityChangedObserver.asObservable();

  constructor(private http: HttpClient, public authApi: AuthService,) { }
  interfaceUrl = AppConfig.settings.apiBaseUrl;
  async loadWorkflowDashboard(loginId: string) {
    const webMethod = this.interfaceUrl + 'getWorkflow';
    const params = {
      loginid: loginId,
    };
    return await this.http.post(webMethod, params).toPromise();
  }

  // Changed by Mitali D - 13-09-2023 - FIN1EURINT-613 - START
  async loadWorkflowUCP(loginId: string) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'wbapi/getWorkflowTemplateMapping';
      var UserID = AppConfig?.settings.oRes.userName;
      const parameters = {
        userId: UserID,
        workflowSuperType: 'TRADE',
        selectedEntityId: AppConfig.settings.oRes.homeEntityID // Changed by Mitali D - 08-02-2024
      }

      const that = this;

      await lastValueFrom(this.http.post(webMethod, parameters))
        .then((data) => {
          that.WorkflowUCPObserver.next(data);
        })

    } catch (error) {

    }
  }
  // Changed by Mitali D - 13-09-2023 - FIN1EURINT-613 - END
  async loadQueuesDashboard(workflowId: string,
    entityId: number,
    fromDate: string,
    toDate: string,
    workFlowName: string,
    login) {
    const webMethod = AppConfig.settings.apiBaseUrl + 'wbapi/getqueues';
    // const webMethod = this.interfaceUrl + 'getQueues';
    const params = {
      workflowID: workflowId,
      entityID: entityId,
      fromDate,
      toDate,
      workflow: workFlowName,
      login,
    };
    return await this.http.post(webMethod, params).toPromise();
  }

  // Changed by Mitali D - 13-09-2023 - FIN1EURINT-613 - START
  async loadQueuesUCP(
    workflowId: string,
    entityId: number,
    fromDate: string,
    toDate: string,
    workFlowName: string,
    login,
    datefilter: string,
    sTokenToSearch: string,
    sTemplateId
  ) {
    try {
      //const webMethod = this.interfaceUrl + 'getQueues';
      var UserID = AppConfig?.settings.oRes.userName;
      const webMethod = AppConfig.settings.apiBaseUrl + 'wbapi/getqueues';
      const that = this;
      const parameters = {
        filter: [
          {
            sEvent: "",
            sScheme: "",
            sScheme_Code: "",
            sProduct_Code: "",
            sProduct_Doc_Type: "",
            sProductId: "0",
            bAll: true,
            sRm: "",
            sCustomerId: "",
            sBook: "",
            sFromDate: fromDate,
            sToDate: toDate,
            sQueueId: "%%",
            sWorkFlowType: workFlowName,
            sWorkFlowTypeId: workflowId.toString(),
            sTokenToSearch: sTokenToSearch,
            bShowParentToken: false,
            bShowBoth: false,
            lEntity_Id: entityId.toString(),
            sBackSucessQueue: "",
            allEntity: "",
            sTemplateId: sTemplateId,
            sWorkflowSuperType: "TRADE",
            parentTokenId: -1
          }
        ],
        Login: login,
        customfilter: "",
        datefilterType: datefilter,
        product_Id: "0",
        paymentType: "",
        I_strApplyDealCreatedByFilter: "",
        IncludeAllDate: "false"
      }

      await lastValueFrom(this.http.post(webMethod, parameters))
        .then((data: any) => {
          const returnData = { queues: [], WorkFlowName: workFlowName };
          returnData.queues = data;
          that.QueuesUCPObserver.next(returnData);
        })

    } catch (error) {

    }
  }

  async workflowBlotterMetaDataUCP(workflowId: string, loginid: string) {
    try {
      //const webMethod = this.interfaceUrl + 'getWorkflowBlotterMetaData';
      const webMethod = AppConfig.settings.apiBaseUrl + 'wbapi/getWorkflowBlotterMetaData';
      const parameters = {
        workflowId: workflowId.toString(),
        loginid: AppConfig?.settings.oRes.userName,
      };
      const that = this;

      await lastValueFrom(this.http.post<any>(webMethod + '', parameters))
        .then((res) => {
          that.WorkflowMetadataUCPObserver.next(res);
        })

    } catch (error) {

    }
  }
   // Changed by Mitali D - 13-09-2023 - FIN1EURINT-613 - END

  // Changed by Mitali D - 13-09-2023 - FIN1EURINT-613 - START
  async getWorkflowData(
    WorkFlowTypeID,
    rowsPerPage,
    pageNo,
    Workflow,
    FromDate,
    ToDate,
    loginID,
    QueueId,
    customFilter,
    datefilterName,
    sTokenToSearch: string,
    sTemplateId,
    entityId: number,
  ) {
    //const webMethod = this.interfaceUrl + 'WorkflowBlotterUCP';
    const webMethod = AppConfig.settings.apiBaseUrl + 'wbapi/getdatafromuspcustomfilter'
    const parameters = {
      "Filter": [
        {
          sEvent: "",
          sScheme: "",
          sScheme_Code: "",
          sProduct_Code: "",
          sProduct_Doc_Type: "",
          sProductId: "0",
          bAll: true,
          sRm: "",
          sCustomerId: "",
          sBook: "",
          sFromDate: FromDate,
          sToDate: ToDate,
          sQueueId: QueueId.toString(),
          sWorkFlowType: Workflow,
          sWorkFlowTypeId: WorkFlowTypeID.toString(),
          sTokenToSearch: sTokenToSearch,
          bShowParentToken: false,
          bShowBoth: false,
          lEntity_Id: entityId,
          sBackSucessQueue: "",
          allEntity: "",
          sTemplateId: sTemplateId,
          sWorkflowSuperType: "TRADE",
          parentTokenId: -1
        }
      ],
      Login: loginID,
      RowsPerPage: rowsPerPage.toString(),
      PageNo: pageNo.toString(),
      CustomFilter: customFilter,
      DateFilterName: datefilterName,
      Product_Id: "0",
      PaymentType: "",
      ApplyDealCreatedByFilter: "",
      IncludeAllDate: "false"
    }
    const that = this;

    await lastValueFrom(this.http.post(webMethod, parameters)).then(
      (data: any) => {

        that.WorkflowDataUCPObserver.next(data);

      }

    )

  }
  // Changed by Mitali D - 13-09-2023 - FIN1EURINT-613 - END

  getWorkflowDataDynamic(
    WorkFlowTypeID: any,
    rowsPerPage: any,
    pageNo: any,
    Workflow: any,
    FromDate: any,
    ToDate: any,
    loginID: any,
    QueueId: any,
    customFilter,
    sTokenToSearch: string,
    entityId: number,
  ) {
    const webMethod = this.interfaceUrl + 'WorkflowBlotterUCP';

    const parameters = {
      FromDate: FromDate,
      ToDate: ToDate,
      WorflowType: Workflow,
      WorflowID: WorkFlowTypeID,
      loginID: loginID,
      QueueId: QueueId,
      rowsPerPage: rowsPerPage,
      pageNo: pageNo,
      customFilter: customFilter,
      sTokenToSearch: sTokenToSearch,
      entityId: entityId,
    };
    return this.http.post<any>(webMethod, parameters);

  }

  getMenuDetails(tokneid: string, userid: string, callingMode: string) {
    try {
      // Changed by Mitali D - 06-12-2023 - FIN1EURINT-690 - START
      const body = {
        Tokneid: tokneid.toString(), 
        Userid: userid,
        CallingMode: callingMode,
      };
     
      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/getMenuDetails',
        body
      );
       // Changed by Mitali D - 06-12-2023 - FIN1EURINT-690 - END
    } catch (error) {
      console.log(error);
    }
  }

  processTokenonButtonClick(
    tokenid: string[],
    dealRefNo: string[],
    processName: string,
    userid: string,
    action: string,
    buttonId: string,
    remark: string
  ): any {
    try {
      const body = {
        tokenid: tokenid,
        dealRefNo: dealRefNo,
        processName: processName,
        userid: userid,
        action: action,
        buttonId: buttonId,
        remark: remark,
      };

      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/processTokenonButtonClick',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  // Changed by Mitali D - 13-09-2023 - START
  getTemplateDetails(userId: string, wtmid: string,wtmCode:string): any {
    try {
      const body ={
        WorkflowSuperType: "TRADE",
        Wtmid: wtmid.toString(),
        WtmCode: wtmCode,
        UserId: userId
      }

      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/getTemplateDetails',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }
  // Changed by Mitali D - 13-09-2023 - END

  getWorkflowCustomSettings(Login_Id: string): any {
    try {
      const body = {
        Login_Id:Login_Id
      };

      console.log("getWorkflowCustomSettings", body)

      return this.http.post<any>(
        // 'http://localhost:47697/FinIQ/api/WorkflowBlotterAPI/getWorkflowCustomSettings',
        AppConfig.settings.apiBaseUrl + 'wbapi/getWorkflowCustomSettings',
        //AppConfig.settings.apiBaseUrl + 'getWorkflowCustomSettings',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  customFilter = ''

  FXDGenerateDocAPI(HomeEntityId: any,
    HomeEntityCode: any,
    HomeEntityName: any,
    BulkTransactionNumber: any,
    TransactionType: any,
    TransactionEventCode: any,) {
    try {
      const webMethod = this.interfaceUrl + 'GenerateDocument';
      const parameters = {
        HomeEntityId,
        HomeEntityCode,
        HomeEntityName,
        BulkTransactionNumber,
        TransactionType,
        TransactionEventCode
      }
      return this.http.post(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      console.log(error);
    }
  }

  getModeButtonDetails(functionName: string, tokenid: string, entityid: string, buttonid: string, UserID: string) {
    try {
      const body = { functionName, tokenid, entityid, buttonid, UserID };
      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/getModeButtonDetails',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  InvokeWCFServiceRest(
    wcfServiceUrl: string,
    contractName: string,
    operationName: string,
    operationParameters: any) {
    try {
      const body = {
        wcfServiceUrl,
        contractName,
        operationName,
        operationParameters
      };
      return this.http.post<any>(AppConfig.settings.apiBaseUrl + 'InvokeWCFServiceRest', body);
    } catch (error) {
      console.log(error);
    }
  }

  wflSettings: any = {};

  serverTimeStamp(): any {
    try {
      const body = {};

      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/serverTimeStamp', body
      );
    } catch (error) {
      console.log(error);
    }
  }
  checkLastModified(tokenid: string): any {
    try {
      const body = {
        tokenid: tokenid
      };

      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/checkLastModified', body
      );
    } catch (error) {
      console.log(error);
    }
  }

  getQueueWFCustSettings(L_Id: string, wtm_id: number): any {
    try {
      // Changed by Mitali D - 21-09-2023 - FIN1EURINT-613 - START
      const body = {
        LoginId:L_Id,
        Wtm_id:wtm_id
      };
      // Changed by Mitali D - 21-09-2023 - FIN1EURINT-613 - END

      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/getQueueWFCustSettings',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  // Changed by Mitali D - 31-01-2024 - HSBCFXEINT-67 -  - personal settings save not working - START
  savePersonalSettings(settings: any): any {
    try {
      const body = settings
      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/SetWorkflowCustomSettings', 
        body
      );
    } catch (error) {
      console.log(error);
    }
  }
  // Changed by Mitali D - 31-01-2024 - HSBCFXEINT-67 -  - personal settings save not working - END

  addFavWfl(wfID: any, L_Id: any): any {
    try {
      const body = {
        wfID,
        L_Id
      };

      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/addFavWfl',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  removeFavWfl(wfID: any, L_Id: any): any {
    try {
      const body = {
        wfID,
        L_Id
      };

      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/removeFavWfl',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  // Changed by Mitali D - 31-01-2024 - HSBCFXEINT-67 -  - export to excel not working - START
  exportWorkflowBlotter(
    WorkFlowTypeID,
    rowsPerPage,
    pageNo,
    Workflow,
    FromDate,
    ToDate,
    loginID,
    QueueId,
    customFilter,
    datefilterName,
    sTokenToSearch: string,
    sTemplateId,
    lEntity_Id:string  // Changed by Mitali D - 07-02-2024 - HSBCFXEINT-67
  ) {
    const webMethod = this.interfaceUrl + 'wbapi/getDataFromUSPCustomFilterExportToExcel';

    const parameters = {
      "Filter": [
        {
          sEvent: "",
          sScheme: "",
          sScheme_Code: "",
          sProduct_Code: "",
          sProduct_Doc_Type: "",
          sProductId: "0",
          bAll: true,
          sRm: "",
          sCustomerId: "",
          sBook: "",
          sFromDate: FromDate,
          sToDate: ToDate,
          sQueueId: QueueId.toString(),
          sWorkFlowType: Workflow,
          sWorkFlowTypeId: WorkFlowTypeID.toString(),
          sTokenToSearch: sTokenToSearch,
          bShowParentToken: false,
          bShowBoth: false,
          lEntity_Id: lEntity_Id,  // Changed by Mitali D - 07-02-2024 - HSBCFXEINT-67
          sBackSucessQueue: "",
          allEntity: "",
          sTemplateId: sTemplateId,
          sWorkflowSuperType: "TRADE",
          parentTokenId: -1
        }
      ],
      Login: loginID,
      RowsPerPage: rowsPerPage.toString(),
      PageNo: pageNo.toString(),
      CustomFilter: customFilter,
      DateFilterName: datefilterName,
      Product_Id: "0",
      PaymentType: "",
      ApplyDealCreatedByFilter: "",
      IncludeAllDate: "false"
    }

    return this.http.post<any>(webMethod, parameters);
  }
  // Changed by Mitali D - 31-01-2024 - HSBCFXEINT-67 -  - export to excel not working - END

  GetMappedTemplateDetails(entityId: string, wtmid: string, wtmCode: string, userId: string): any {
    try {
      const body = {
        entityId: entityId,
        wtmid: wtmid,
        wtmCode: wtmCode,
        userId: userId,
      };

      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/GetMappedTemplateDetails',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  getDateFromEpochStr(date) {
    let epochstr = date.substr(
      date.indexOf("(") + 1,
      date.indexOf("+") - 6
    );

    let adjustedEpoch = parseInt(epochstr) + this.getTimeZoneDiff(date)
    var d = new Date(adjustedEpoch);
    return d.toLocaleString();

  }

  toEpochformat(Displaydate, serverTimeStamp) {

    Displaydate = new Date(Displaydate);
    let setmilisec = new Date(Displaydate).getTime() + this.getTimeZoneDiff(serverTimeStamp);
    return "/Date(" + setmilisec + ")/";
  };

  getTimeZoneDiff(date) {
    let browserUTCOffset: any = new Date().getTimezoneOffset();
    var offset = new Date().getTimezoneOffset();
    let o = Math.abs(offset);
    browserUTCOffset = (
      (offset < 0 ? "+" : "-") +
      ("00" + Math.floor(o / 60)).slice(-2) +
      ("00" + (o % 60)).slice(-2))

    let browserUTCOffsetHrs = parseInt(browserUTCOffset.substring(1, 3))
    let browserUTCOffsetMins = parseInt(browserUTCOffset.substring(3, 5))
    let browserUTCOffsetInt = browserUTCOffsetMins === 30 ? browserUTCOffsetHrs + 0.5 : browserUTCOffsetHrs
    if (offset > 0) {
      browserUTCOffsetInt = 0 - browserUTCOffsetInt
    }

    let serverUTCOffset = ''
    let sign = ''
    if (date.split('(')[1].includes('+')) {
      serverUTCOffset = date.split('(')[1].split('+')[1].substring(0, 4)
      sign = '+'
    }
    else {
      serverUTCOffset = date.split('(')[1].split('-')[1].substring(0, 4)
      sign = '-'
    }

    let serverUTCOffsetHrs = parseInt(serverUTCOffset.substring(0, 2))
    let serverUTCOffsetMins = parseInt(serverUTCOffset.substring(2, 4))
    let serverUTCOffsetInt = serverUTCOffsetMins === 30 ? serverUTCOffsetHrs + 0.5 : serverUTCOffsetHrs
    if (sign === '-') {
      serverUTCOffsetInt = 0 - serverUTCOffsetInt
    }

    let browserServerDiff = serverUTCOffsetInt - browserUTCOffsetInt

    let millisecondsOffest = (Math.floor(browserServerDiff) * 3600000)

    if (browserServerDiff % 1 === 0.5) {
      millisecondsOffest = millisecondsOffest + (30 * 60000)
    }

    return millisecondsOffest
  };

  showPopup = false
  params = []

  GetSearchedRef(refNo: string) {
    try {
      const body = {
        refNo
      };

      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/GetSearchedRef',
        body
      );
    } catch (error) {
      console.log(error);
    }

  }

  getWSSWorkflowNamesForDispPriority(Selection_key: string, selection_level: string, wtm_id: any) {
    try {
      const body = {
        Selection_key,
        selection_level,
        wtm_id
      };

      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/getWSSWorkflowNames_Blotter',
        body
      );
    } catch (error) {
      console.log(error);
    }

  }

  getDispPriorityTable(workflowId: string, loginid: string) {
    try {
      const body = {
        loginid,
        workflowId
      };

      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/getWorkflowBlotterMetaData',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  saveSequenceSettings(column_name: string, display_Priority: any, wtm_Id: any, selection_Key: string, selection_Level: string, use_as_filter: string) {
    try {
      const body = {
        column_name,
        display_Priority,
        wtm_Id,
        selection_Key,
        selection_Level,
        use_as_filter
      };

      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/InsertUpdateWorkflowSequenceSettings',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  dispPriorityChangedReloadBlotter() {
    this.dispPriorityChangedObserver.next(true)
  }

  getLeftClickOperationFunctionNameIfExists(workflowId: string, userId: string) {
    try {
      console.log(workflowId, userId)
      const body = { workflowId: workflowId.toString(), userId: userId }; // Changed by Mitali D - 22-09-2023 -  FIN1EURINT-613
      return this.http.post<any>(
        AppConfig.settings.apiBaseUrl + 'wbapi/getLeftClickOperationFunctionNameIfExists',
        body
      );
    }
    catch (error) {
      console.log(error);
    }
  }

}
