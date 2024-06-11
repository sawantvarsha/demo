import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommonApiService } from './common-api.service';
import { AuthService } from './auth/auth.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { HomeApiService } from './home-api.service';
import { AppConfig } from './config.service';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Injectable({
  providedIn: 'root',
})
export class CustomerApiService {
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  public entityConfig = {};

  private CountProductAllEvent_CABS = new BehaviorSubject<any>('');
  CountProductAllEvent_CAObs = this.CountProductAllEvent_CABS.asObservable();

  private GetEventNameCABS = new BehaviorSubject<any>('');
  GetEventNameCAObs = this.GetEventNameCABS.asObservable();
  private ReadAllProductAllEvent_CABS = new BehaviorSubject<any>('');
  ReadAllProductAllEvent_CAObs =
    this.ReadAllProductAllEvent_CABS.asObservable();
  private GetClientResponsePendingBS = new BehaviorSubject<any>('');
  GetClientResponsePendingObs = this.GetClientResponsePendingBS.asObservable();

  private GetEmailNotificationBS = new BehaviorSubject<any>('');
  GetEmailNotificationObs = this.GetEmailNotificationBS.asObservable();

  private getYNBS = new BehaviorSubject<any>('');
  getYNObs = this.getYNBS.asObservable();

  private GetUDFValuesBS = new BehaviorSubject<any>([]);
  GetUDFValuesObs = this.GetUDFValuesBS.asObservable();

  private UpdateCashSharePriceBS = new BehaviorSubject<any>([]);
  UpdateCashSharePriceObs = this.UpdateCashSharePriceBS.asObservable();

  private GetDocumentDetailsBS = new BehaviorSubject<any>([]);
  GetDocumentDetailsObs = this.GetDocumentDetailsBS.asObservable();

  private GetNotemasterDetailsBS = new BehaviorSubject<any>([]);
  GetNotemasterDetailsObs = this.GetNotemasterDetailsBS.asObservable();

  private GetShareQuantityBS = new BehaviorSubject<any>([]);
  GetShareQuantityObs = this.GetShareQuantityBS.asObservable();

  private GetDocHoldingQtyBS = new BehaviorSubject<any>([]);
  GetDocHoldingQtyObs = this.GetDocHoldingQtyBS.asObservable();

  private GetCAWithChoiceMetadataCBS = new BehaviorSubject<any>([]);
  GetCAWithChoiceMetadataObs = this.GetCAWithChoiceMetadataCBS.asObservable();

  private GetPaymentTp_CABS = new BehaviorSubject<any>([]);
  GetPaymentTp_CAObs = this.GetPaymentTp_CABS.asObservable();

  private GetClientResYNBS = new BehaviorSubject<any>([]);
  GetClientResYNObs = this.GetClientResYNBS.asObservable();

  private GetLabelforCustPriceBS = new BehaviorSubject<any>([]);
  GetLabelforCustPriceObs = this.GetLabelforCustPriceBS.asObservable();

  private GetRuleoutputHistorydetailsBS = new BehaviorSubject<any>([]);
  GetRuleoutputHistorydetailsObs =
    this.GetRuleoutputHistorydetailsBS.asObservable();

  private GetDocumentEmailcountBS = new BehaviorSubject<any>([]);
  GetDocumentEmailcountObs = this.GetDocumentEmailcountBS.asObservable();

  private CorpActionWithChoiceDetailsBS = new BehaviorSubject<any>([]);
  CorpActionWithChoiceDetailsObs =
    this.CorpActionWithChoiceDetailsBS.asObservable();

  private GetFaciltyBS = new BehaviorSubject<any>([]);
  GetFaciltyObserver = this.GetFaciltyBS.asObservable();

  private shareDetailsCorpActionBS = new BehaviorSubject<any>([]);
  shareDetailsCorpActionObs = this.shareDetailsCorpActionBS.asObservable();

  private CorpActionDetailsBS = new BehaviorSubject<any>([]);
  CorpActionDetailsObserver = this.CorpActionDetailsBS.asObservable();

  private WorkflowObserver = new BehaviorSubject<any>([]);
  workflows = this.WorkflowObserver.asObservable();

  private QueuesObserver = new BehaviorSubject<any>([]);
  queues = this.QueuesObserver.asObservable();

  private FilteredQueuesObserver = new BehaviorSubject<any>('');
  filteredqueues = this.FilteredQueuesObserver.asObservable();

  private QueuesOnBoardingObserver = new BehaviorSubject<any>([]);
  queuesonBoarding = this.QueuesOnBoardingObserver.asObservable();

  public TokensObserver = new BehaviorSubject<any>([]);
  tokens = this.TokensObserver.asObservable();

  public TokensOnBoardingObserver = new BehaviorSubject<any>([]);
  tokensOnBoarding = this.TokensOnBoardingObserver.asObservable();

  private ButtonsObserver = new BehaviorSubject<any>([]);
  buttons = this.ButtonsObserver.asObservable();

  private ButtonsOnBoardingObserver = new BehaviorSubject<any>([]);
  buttonsOnBoarding = this.ButtonsOnBoardingObserver.asObservable();

  private processTokenObserver = new BehaviorSubject<any>([]);
  processToken = this.processTokenObserver.asObservable();

  private processTokenOnBoardingObserver = new BehaviorSubject<any>([]);
  processTokenOnBoarding = this.processTokenOnBoardingObserver.asObservable();

  private webAppURLObserver = new BehaviorSubject<any>({});
  webAppURL = this.webAppURLObserver.asObservable();

  private dropdownValuesObserver = new BehaviorSubject<any>({});
  dropdownValues = this.dropdownValuesObserver.asObservable();

  public SaveOrderObserver = new BehaviorSubject<any>({});
  SaveOrder = this.SaveOrderObserver.asObservable();

  private BSBCDetailsObserver = new BehaviorSubject<any>({});
  BSBCDetails = this.BSBCDetailsObserver.asObservable();

  public getCustAccountDetailsObserver = new BehaviorSubject<any>([]);
  getCustAccountDetails = this.getCustAccountDetailsObserver.asObservable();

  public CustomerDetails_ClientBoarding = new BehaviorSubject<any>({});
  CustomerDetails_ClientBoardingObserver =
    this.CustomerDetails_ClientBoarding.asObservable();

  public getCustAccountDetailsforMultiAccObserver = new BehaviorSubject<any>(
    []
  );
  getCustAccountDetailsforMultiAcc =
    this.getCustAccountDetailsforMultiAccObserver.asObservable();

  private riskaccesment = new BehaviorSubject<any>({});
  riskaccesmentObserver = this.riskaccesment.asObservable();

  public KYCriskRating = new BehaviorSubject<any>({});
  KYCriskRatingObserver = this.KYCriskRating.asObservable();

  public CashDeposits = new BehaviorSubject<any>([]);
  CashDepositsObserver = this.CashDeposits.asObservable();

  public loanOrder = new BehaviorSubject<any>([]);
  loanOrderObserver = this.loanOrder.asObservable();

  public pledgedAgainstData = new BehaviorSubject<any>([]);
  pledgedAgainstDataObserver = this.pledgedAgainstData.asObservable();

  public SavePortfolio = new BehaviorSubject<any>({});
  SavePortfolioObserver = this.SavePortfolio.asObservable();

  public LoadPortfolioSub = new BehaviorSubject<any>([]);
  LoadPortfolioObserver = this.LoadPortfolioSub.asObservable();

  public InvestObjSub = new BehaviorSubject<any>([]);
  InvestObjSubObserver = this.InvestObjSub.asObservable();

  public AllocPortfolio = new BehaviorSubject<any>([[]]);
  AllocPortfolioObserver = this.AllocPortfolio.asObservable();

  public ClientAlloc = new BehaviorSubject<any>([]);
  ClientAllocObserver = this.ClientAlloc.asObservable();

  public allTradablePair = new BehaviorSubject([]);
  allTradablePairObserver = this.allTradablePair.asObservable();

  private validateUserModeFlag = new BehaviorSubject<any>('');
  validateUserModeFlagObserver = this.validateUserModeFlag.asObservable();

  private statementpageMode = new BehaviorSubject<any>('');
  statementpageModeObserver = this.statementpageMode.asObservable();

  private RISPaymentScheduleDetails = new BehaviorSubject<any>([]);
  RISPaymentScheduleDetailsObserver =
    this.RISPaymentScheduleDetails.asObservable();

  private CustomerFeesandCharge = new BehaviorSubject<any>([]);
  CustomerFeesandChargeObserver = this.CustomerFeesandCharge.asObservable();

  private GetCustProfiledetails = new BehaviorSubject<any>([]);
  GetCustProfiledetailsObserver = this.GetCustProfiledetails.asObservable();

  private GetAllCustomerGroups = new BehaviorSubject<any>([]);
  GetAllCustomerGroupsObserver = this.GetAllCustomerGroups.asObservable();
  private GetRMOrderDetails = new BehaviorSubject<any>([]);
  GetRMOrderDetailsObserver = this.GetRMOrderDetails.asObservable();

  private GetCustomersOfRM = new BehaviorSubject<any>([]);
  GetCustomersOfRMObserver = this.GetCustomersOfRM.asObservable();
  private GetCustomerStatus = new BehaviorSubject<any>([]);
  GetCustomerStatusObserver = this.GetCustomerStatus.asObservable();

  public GetCustProfileFromCustID = new BehaviorSubject<any>([]);
  GetCustProfileFromCustIDObserver =
    this.GetCustProfileFromCustID.asObservable();

  private GetLoginRMDetailsBS = new BehaviorSubject<any>('');
  GetLoginRMDetailsObs = this.GetLoginRMDetailsBS.asObservable();

  private oGetCSPEvents = new BehaviorSubject<any>([]);
  GetCSPEventsObservable = this.oGetCSPEvents.asObservable();

  private oAttachDocuments = new BehaviorSubject<any>([]);
  AttachDocumentsObservable = this.oAttachDocuments.asObservable();

  private oGetDocuments = new BehaviorSubject<any>([]);
  GetDocumentsObservable = this.oGetDocuments.asObservable();

  public getMetadata = new BehaviorSubject<any>([]);
  getMetadataObserver = this.getMetadata.asObservable();

  public getCommonData = new BehaviorSubject<any>([]);
  getCommonDataObserver = this.getCommonData.asObservable();

  public updateSidebarData = new BehaviorSubject<any>([]);
  updateSidebarDataObs = this.updateSidebarData.asObservable();

  public getSidebarData = new BehaviorSubject<any>('');
  getSidebarDataObs = this.getSidebarData.asObservable();

  public getCheckedMenu = new BehaviorSubject<any>([]);
  getCheckedMenuObs = this.getCheckedMenu.asObservable();

  public GetCorpActionsWithFlagData = new BehaviorSubject<any>('');
  GetCorpActionsWithFlagObs = this.GetCorpActionsWithFlagData.asObservable();

  public CountPerDay_BS = new BehaviorSubject<any>('');
  CountPerDay_Obs = this.CountPerDay_BS.asObservable();

  GetinsertRMUpdateInfo = new BehaviorSubject<any>(false);
  GetinsertRMUpdateInfoObserver = this.GetinsertRMUpdateInfo.asObservable();

  public isFirstCustomerLogin = new BehaviorSubject(false);
  isFirstCustomerLoginObs = this.isFirstCustomerLogin.asObservable();

  public updateSidebarBS = new BehaviorSubject('');
  updateSidebarOBS = this.updateSidebarBS.asObservable();

  public getBankBaseCCY = new BehaviorSubject('');
  getBankBaseCCYOBS = this.getBankBaseCCY.asObservable();
  public FacilityCodeObserver = new BehaviorSubject<string>('');
  FacilityCodeOBS = this.FacilityCodeObserver.asObservable();

  public FacilityCodeObserver2 = new BehaviorSubject<any>('');
  FacilityCodeOBS2 = this.FacilityCodeObserver2.asObservable();

  bankBaseCCY: any;

  interfaceUrl = environment.interfaceURL;
  RMWActionLinks: any;
  CorpActionDate: any;
  getYN: any;
  shareDetailsCorpAction: any;
  allCorpData: any;
  custID = '';
  isKYCDoneFlag: boolean;
  isAccCreated: boolean;
  isProfileCreated: boolean;
  UserType: string;
  ProposalId: string = '';
  nameproposal: string = '';
  AUM: any;
  baseCCY: any;
  particularPortfolio: any;
  MFList: any;
  tradablePairs: any[] = [];
  constructor(
    private cfs: CommonApiService,
    private http: HttpClient,
    private auth: AuthService,
    private homeapi: HomeApiService
  ) {
    this.isKYCDoneFlag = false;
    this.isAccCreated = false;
    this.isProfileCreated = false;
    this.UserType = '';
  }

  UpdateSidebarObserver(UserTypeValue: any) {
    this.updateSidebarBS.next(UserTypeValue);
  }

  ResetSideBarData() {
    this.getSidebarData.next([]);
  }

  ResetprocessTokenObserver() {
    this.processTokenOnBoardingObserver.next('');
  }

  ResetLoadPortfolioSubObserver() {
    this.LoadPortfolioSub.next([]);
  }

  FacilityCodeStatus(FacilityCode: any) {
    console.log('Observer Triggered');
    this.FacilityCodeObserver.next(FacilityCode);
  }

  PortfolioDetailsStatus(particularPortfolio: any) {
    this.FacilityCodeObserver2.next(particularPortfolio);
  }

  getUserName(entityId): string {
    return Object.keys(this.entityConfig)
      .filter((e) => this.entityConfig[e].Id === parseInt(entityId, 10))
      .map((e) => this.entityConfig[e].User)[0];

    // const entityName = environment[entityId];
    // return environment[entityName + 'User'];
  }

  getEntityConfig() {
    try {
      if (!Object.keys(this.entityConfig).length) {
        const that = this;
        const webMethod = this.interfaceUrl + 'getEntityConfig';
        $.ajax({
          async: false,
          crossDomain: true,
          type: 'GET',
          url: webMethod,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          headers: {
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
          },
          success(data) {
            // console.log(data);
            that.entityConfig = data;
          },
        });
      }
    } catch (error) {
      // console.error("error getEntityConfig", error);
    }
  }

  getWebSocketUrl(): any {
    try {
      const webMethod = this.interfaceUrl + 'getWebSocketUrl';
      // console.log(webMethod);
      let response = {};
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'GET',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          response = data;
        },
      });
      return response;
    } catch (error) {
      // console.error(error);
      return {};
    }
  }

  loadWorkflow(loginId: string) {
    try {
      const webMethod = this.interfaceUrl + 'getWorkflow';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          loginid: loginId,
        }),
        processData: false,
        success(data) {
          // console.log('Workflows', data);
          that.WorkflowObserver.next(data);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  loadFilteredQueues(
    workflowId: string,
    entityId: number,
    workFlowName: string
    // login
  ) {
    try {
      const webMethod = this.interfaceUrl + 'getFilteredQueues';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          WorkTypeID: workflowId,
          entityID: entityId,
          login: sessionStorage.getItem('Username'),
        }),
        processData: false,
        success(data) {
          const returnData = { queues: [], WorkFlowName: workFlowName };
          returnData.queues = data.getQueuesResult;
          that.FilteredQueuesObserver.next(returnData);
          console.log(returnData);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  loadQueues(
    workflowId: string,
    entityId: number,
    fromDate: any,
    toDate: string,
    workFlowName: string,
    login
  ) {
    try {
      const webMethod = this.interfaceUrl + 'getQueues';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          workflowID: workflowId,
          entityID: entityId,
          fromDate,
          toDate,
          workflow: workFlowName,
          login,
        }),
        processData: false,
        success(data) {
          const returnData = { queues: [], WorkFlowName: workFlowName };
          returnData.queues = data;
          that.QueuesObserver.next(returnData);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  loadTokens(
    workflow: string,
    workflowID: string,
    queueId: number,
    fromDate: string,
    toDate: string,
    pageNo: number,
    records: number,
    login
  ) {
    try {
      const webMethod = this.interfaceUrl + 'getTokens';
      // console.log(webMethod);
      const that = this;

      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          fromDate,
          toDate,
          workflow,
          workflowID,
          queueID: queueId.toString(),
          rows: records.toString(),
          entityID: 4,
          pageNo: pageNo.toString(),
          login,
        }),
        processData: false,
        success(data) {
          const json = that.cfs.xml2json(data).NewDataSet.DUMMY;
          // console.log(json);
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
              // console.log(json);
              result = json;
            }
          }
          // console.log(result);
          that.TokensObserver.next(result);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  loadButtons(queueId: string, workflowID: string, login) {
    try {
      const webMethod = this.interfaceUrl + 'getButton';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          workflowID,
          queueID: queueId,
          login,
        }),
        processData: false,
        success(data) {
          // console.log(data);
          that.ButtonsObserver.next(data);
        },
      });
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
      const webMethod = this.interfaceUrl + 'processTokenonButtonClick';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          tokenId: [token],
          dealNo: [deal],
          spName: sp,
          loginid: username,
          buttonId: button,
        }),
        processData: false,
        success(data) {
          // console.log(data);
          that.processTokenObserver.next(data);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  getWebAppRedirectDetails(workflowId, tokenId, loginId, entityId, buttonId) {
    try {
      const webMethod = this.interfaceUrl + 'getWebAppRedirectDetails';
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          workflowid: workflowId,
          tokenid: tokenId,
          loginid: loginId,
          entityid: entityId,
          buttonid: buttonId,
        }),
        processData: false,
        success(data) {
          // console.log(data);
          that.webAppURLObserver.next(data[0]);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  getServerTimeStamp() {
    let result = '';
    try {
      const webMethod = this.interfaceUrl + 'serverTimeStamp';
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          // console.log(data);
          result = data.serverTimeStampResult;
        },
      });
    } catch (error) {
      // console.error(error);
    }
    return result;
  }

  getLastModifiedTime(tokenId) {
    let result = '';
    try {
      const webMethod = this.interfaceUrl + 'checkLastModified';
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          tokenid: tokenId,
        }),
        processData: false,
        success(data) {
          // console.log(data);
          result = data.checkLastModifiedResult;
        },
      });
    } catch (error) {
      // console.error(error);
    }
    return result;
  }

  loadDropdownValues(
    filterKey: string,
    dropdownType: string,
    loginId?: string,
    entityId?: string,
    noteMasterId?: string
  ) {
    // let result = '';
    try {
      let webMethod = this.interfaceUrl;
      switch (dropdownType) {
        case 'CommonData':
          webMethod += 'getCommonDataDropdownValues';
          const parametersCommonData = {
            loginId,
            entityId,
            noteMasterId,
            filterKey,
          };
          const resultCommonData = this.http.post<any>(
            webMethod,
            parametersCommonData,
            { headers: this.headerOptions }
          );
          resultCommonData.subscribe((res) => {
            if (res) {
              if (!res.Error) {
                this.dropdownValuesObserver.next({
                  filter: filterKey,
                  data: res.GetCommonDataDropdownValuesResult,
                });
              }
            }
          });
          break;
        case 'UDF':
          webMethod += 'getUDFDropdownValues';
          const parametersUDF = {
            loginId,
            entityId,
            noteMasterId,
            filterKey,
          };
          const resultUDF = this.http.post<any>(webMethod, parametersUDF, {
            headers: this.headerOptions,
          });
          resultUDF.subscribe((res) => {
            if (res) {
              if (!res.Error) {
                this.dropdownValuesObserver.next({
                  filter: filterKey,
                  data: res.GetCommonDataDropdownValuesResult,
                });
              }
            }
          });
          break;
        default:
          const parameters = {
            filterKey,
          };
          const result = this.http.post<any>(webMethod, parameters, {
            headers: this.headerOptions,
          });
          result.subscribe((res) => {
            if (res) {
              if (!res.Error) {
                this.dropdownValuesObserver.next({
                  filter: filterKey,
                  data: res.GetCommonDataDropdownValuesResult,
                });
              }
            }
          });
          break;
      }
    } catch (error) {
      // console.error(error);
    }
  }

  saveNewOrder(
    jsonObj: any,
    entityUser: string,
    templateCode: string,
    Mode: string,
    NoteMasterId: number
  ): any {
    let xmlString = '';

    // Added by Ketan S on 1-May-2021 for mutual funds order placement...after this Mutual fund will use this service to place order...Said by Harsh M
    if (Mode === 'MutualFundSave') {
      xmlString = jsonObj;
      Mode = 'Insert';
    } else {
      xmlString = this.cfs.json2xml(jsonObj);
    }
    xmlString = xmlString.replace(/&/g, '&amp;');
    // End by Ketan S
    try {
      const webMethod = this.interfaceUrl + 'saveNewOrder';
      const parameters = {
        xmlString,
        userId: entityUser,
        templateCode,
        Mode,
        NoteMasterId,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            this.SaveOrderObserver.next(res);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  saveNewOrderFundSwitch(
    jsonObj: any,
    entityUser: string,
    templateCode: string,
    Mode: string,
    NoteMasterId: number
  ) {
    let xmlString = '';

    // Added by Ketan S on 1-May-2021 for mutual funds order placement...after this Mutual fund will use this service to place order...Said by Harsh M
    if (Mode === 'MutualFundSave') {
      xmlString = jsonObj;
      Mode = 'Insert';
    } else {
      xmlString = this.cfs.json2xml(jsonObj);
    }
    xmlString = xmlString.replace(/&/g, '&amp;');
    // End by Ketan S

    try {
      const webMethod = this.interfaceUrl + 'saveNewOrder';
      const parameters = {
        xmlString,
        userId: entityUser,
        templateCode,
        Mode,
        NoteMasterId,
      };
      // const result = this.http.post<any>(webMethod, parameters, {
      //   headers: this.headerOptions,
      // });
      // result.subscribe((res) => {
      //   if (res) {
      //     if (!res.Error) {
      //       this.SaveOrderObserver.next(res);
      //     }
      //   }
      // });
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      // console.error(error);
    }
  }

  async saveNewOrder_bulk(
    jsonObj: any,
    entityUser: string,
    templateCode: string,
    Mode: string,
    NoteMasterId: number
  ) {
    let xmlString = '';

    // Added by Ketan S on 1-May-2021 for mutual funds order placement...after this Mutual fund will use this service to place order...Said by Harsh M
    if (Mode === 'MutualFundSave') {
      xmlString = jsonObj;
      Mode = 'Insert';
    } else {
      xmlString = this.cfs.json2xml(jsonObj);
    }
    xmlString = xmlString.replace(/&/g, '&amp;');
    // End by Ketan S
    try {
      const webMethod = this.interfaceUrl + 'saveNewOrder';
      const parameters = {
        xmlString,
        userId: entityUser,
        templateCode,
        Mode,
        NoteMasterId,
      };
      const result = await this.http
        .post<any>(webMethod, parameters)
        .toPromise()
        .then((res) => res)
        .catch((err) => err);
      return result;
      // result.subscribe((res) => {
      //   if (res) {
      //     if (!res.Error) {
      //       this.SaveOrderObserver.next(res);
      //     }
      //   }
      // });
    } catch (error) {
      // console.error(error);
    }
  }

  getBSBDetails(BSBCode: any): any {
    // try {
    //   const webMethod = this.interfaceUrl + 'getBSBCDetails';
    //   const parameters = {
    //     BSBCode
    //   };
    //   const result = this.http.post<any>(webMethod, parameters, { headers: this.headerOptions });
    //   result.subscribe(res => { if (res) { if (!res.Error) { this.BSBCDetailsObserver.next(res.Get_BSBCDetailsResult[0]); } } });
    // } catch (error) {
    //   console.error(error);
    // }
    try {
      const webMethod = this.interfaceUrl + 'getBSBCDetails';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          BSBCode,
        }),
        success(data) {
          // console.log(data);
          that.BSBCDetailsObserver.next(data.Get_BSBCDetailsResult[0]);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  fngetCustAccountDetails(LoginID: any): any {
    try {
      const webMethod = this.interfaceUrl + 'getCustomerAccDetails';
      const parameters = {
        LoginID,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            // console.log("res from getCustAccountDetailsObserver for issue",res);
            this.getCustAccountDetailsObserver.next(
              res.message[res.message.length - 1]
            );
          } else {
            // console.log("res from getCustAccountDetailsObserver for error",res.error);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  isAccountCreated(LoginID: any) {
    try {
      const webMethod = this.interfaceUrl + 'getCustomerAccDetails';
      const parameters = {
        LoginID,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      // console.error(error);
    }
  }

  ResetgetCustAccountDetailsforMultiAccObserver() {
    this.getCustAccountDetailsforMultiAccObserver.next('');
  }

  Resetriskaccesment() {
    this.riskaccesment.next([]);
  }

  getRiskassesmentForm(FormName) {
    try {
      const webMethod = this.interfaceUrl + 'getRiskassesmentForm';
      const body = {
        FormName,
      };
      const result = this.http.post<any>(webMethod, body, {
        headers: this.headerOptions,
      });
      // console.log(result);
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            this.riskaccesment.next(res);
          }
        }
      });
    } catch (error) {
      // console.log(error);
    }
  }

  // Created by Mohit Sable on 9-July-2020
  getMaxFeedBackID() {
    try {
      const webMethod = this.interfaceUrl + 'getMaxFeedbackID';
      const body = {};
      return this.http.post<any>(webMethod, body, {
        headers: this.headerOptions,
      });
    } catch (ex) {
      // console.log(ex);
    }
  }
  insertKYCformdetail(Result) {
    try {
      const webMethod = this.interfaceUrl + 'insertKYCFormDetails';
      const body = Result;
      return this.http.post<any>(webMethod, body, {
        headers: this.headerOptions,
      });
    } catch (ex) {
      // console.log("error", ex);
    }
  }
  fetchKYCFormDetails(FormName, CustomerID) {
    try {
      const webMethod = this.interfaceUrl + 'fetchKYCFormDetails';
      const body = {
        KYCRiskProfileSummaryRequest: [
          {
            FormName,
            CustomerID,
          },
        ],
      };
      return this.http.post<any>(webMethod, body, {
        headers: this.headerOptions,
      });
    } catch (ex) {
      // console.log("error", ex);
    }
  }
  getKYCriskRating(FormName, FeedbackID, FormID, CustomerID) {
    try {
      const webMethod = this.interfaceUrl + 'getKYCRiskRating';
      const body = {
        FormName,
        FeedbackID,
        FormID,
        CustomerID,
      };
      // const result = this.http.post<any>(webMethod, body, { headers: this.headerOptions });
      return this.http.post<any>(webMethod, body, {
        headers: this.headerOptions,
      });
      // result.subscribe((res: any) => { if (res) { console.log(res); this.KYCriskRating.next(res); } });
    } catch (ex) {
      // console.log("error ala", ex);
    }
  }

  insertCustPortfolioDetails(
    CustomerID,
    Currency,
    Portfolio,
    AccountNo,
    AccountType,
    Bank,
    Branch
  ) {
    try {
      const webMethod = this.interfaceUrl + 'insertCustPortfolioDetails';
      const body = {
        CustomerID,
        Currency,
        Portfolio,
        AccountNo,
        AccountType,
        Bank,
        Branch,
      };
      return this.http.post<any>(webMethod, body, {
        headers: this.headerOptions,
        responseType: 'text' as 'json',
      });
    } catch (ex) {
      // console.log(ex);
    }
  }

  saveCashDeposits(xml: string, entityUser: string, templateCode: string): any {
    // const xmlString = this.cfs.json2xml(jsonObj);
    try {
      const webMethod = this.interfaceUrl + 'saveNewOrder';
      const parameters = {
        xmlString: xml.replace(/&/g, '&amp;'),
        userId: entityUser,
        templateCode,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            this.CashDeposits.next(res);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  saveLoanOrder(
    xml: string,
    user: string,
    templateCode: string,
    mode: string,
    noteMasterId: number
  ) {
    try {
      const webMethod = this.interfaceUrl + 'saveNewOrder';
      const parameters = {
        xmlString: xml.replace(/&/g, '&amp;'),
        userId: user,
        templateCode,
        Mode: mode,
        NoteMasterId: noteMasterId,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            this.loanOrder.next(res);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  getPledgedAgainstData(dataType: string) {
    try {
      const webMethod = this.interfaceUrl + 'GetConfigurableCommonData';
      const parameters = {
        DataType: dataType,
      };
      // const result = this.http.post<any>(webMethod, parameters, {
      //   headers: this.headerOptions,
      // });
      // result.subscribe((res) => {
      //   if (res) {
      //     if (!res.Error) {
      //       this.pledgedAgainstData.next(res);
      //     }
      //   }
      // });
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      // console.error(error);
    }
  }

  GetAllTradableCurrency() {
    // try {
    //   const webMethod = this.interfaceUrl + 'GetAllTradablePairs';
    //   const result = this.http.get<any>(webMethod, { headers: this.headerOptions, responseType: 'text' as 'json' });
    //   result.subscribe(res => {
    //     if (res) {
    //       if (!res.Error) {
    //         this.allTradablePair.next(res);
    //       }
    //     }
    //   });
    // } catch (ex) {
    //   console.log(ex);
    // }

    const result = this.http.get<any>(
      this.interfaceUrl + 'GetAllTradablePairs',
      { headers: this.headerOptions }
    );
    result.subscribe((res) => {
      if (res) {
        if (!res.Error) {
          this.tradablePairs = res;
          this.allTradablePair.next(res);
        }
      }
    });
  }

  // Save Portfolio
  // chitra start on 21-July-2020

  savePortfolio(parametersPortfolio: any): any {
    // const xmlString = this.cfs.json2xml(jsonObj);
    try {
      const webMethod = this.interfaceUrl + 'InsertLimitData_REST';
      const parameters = {
        LD_FM_ID: parametersPortfolio.LD_FM_ID.toString(),
        LD_Facility_Code: parametersPortfolio.LD_Facility_code,
        // LD_Facility_Code: '',
        SysCode: parametersPortfolio.SysCode,
        Customer_ID: parametersPortfolio.CustomerID.toString(),
        FacType: parametersPortfolio.LD_Facility_code,
        facdesc: parametersPortfolio.facdesc,
        Currency: parametersPortfolio.Currency,
        PortfolioName: parametersPortfolio.PortfolioName,
        modelPortfolio: '',
        InvestmentObj: parametersPortfolio.InvestmentObj,
        AutoPledgeFlag: parametersPortfolio.AutoPledgeFlag,
        Inserted_By: parametersPortfolio.LoginID,
        // Capital_Posted : '',
        // FacLimit : '',
        // Capital_Ccy : ''
        Capital_Posted: parametersPortfolio.CapitalPosted,
        FacLimit: parametersPortfolio.Fac_Limit,
        Mode: parametersPortfolio.Mode,
        Goal: parametersPortfolio.Goal,
        TargetGoal: parametersPortfolio.TargetGoal,
      };
      // const result = this.http.post<any>(webMethod, parameters, {
      //   headers: this.headerOptions,
      // });
      return this.http.post<any>(webMethod, parameters);

      // result.subscribe((res) => {
      //   if (res) {
      //     if (!res.Error) {
      //       this.SavePortfolio.next(res);
      //     }
      //   }
      // });
    } catch (error) {
      // console.error(error);
    }
  }
  // chitra end on 21-July-2020

  // chitra start on 22-July-2020

  LoadPortfolio(CustomerID: string, PortfolioID: number): any {
    // const xmlString = this.cfs.json2xml(jsonObj);
    try {
      // console.log("Calling");
      const webMethod = this.interfaceUrl + 'Get_Portfolio_Details_REST';
      const parameters = {
        Customer_ID: CustomerID.toString(),
        facdesc: PortfolioID,
      };
      // console.log(parameters);
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            this.LoadPortfolioSub.next(res);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }
  GetPortfolio(CustomerID: string, PortfolioID: any): any {
    // const xmlString = this.cfs.json2xml(jsonObj);
    try {
      // console.log("Calling");
      const webMethod = this.interfaceUrl + 'Get_Portfolio_Details_REST';
      const parameters = {
        Customer_ID: CustomerID.toString(),
        facdesc: PortfolioID,
      };
      // console.log(parameters);
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      // console.error(error);
    }
  }
  // chitra end on 22-July-2020

  // chitra start on 17-Oct-2020
  GetCustInvestmentObj(Customer_ID: string): any {
    // const xmlString = this.cfs.json2xml(jsonObj);
    try {
      // console.log("Calling inve");
      const webMethod = this.interfaceUrl + 'GetCustInvestmentObj';
      const parameters = {
        CustomerID: Customer_ID,
      };
      // console.log(parameters);
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            this.InvestObjSub.next(res);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }
  // chitra end on 17-OCt-2020

  // chitra start on 27-Jul-2020
  getPortfolioAllocation(parametersPortfolio: any): any {
    // const xmlString = this.cfs.json2xml(jsonObj);
    console.log('called getPortfolioAlloc', parametersPortfolio.PortfolioName);
    try {
      const webMethod = this.interfaceUrl + 'Get_TargetAllocationGraph';
      const parameters = {
        RiskProile: parametersPortfolio.RiskProfile, // 'BALANCED',
        InvetsmentObj: parametersPortfolio.InvestmentObj, // 'Regular Income'
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            // console.log("port");
            // console.log([res, parametersPortfolio.PortfolioName]);
            this.AllocPortfolio.next([res, parametersPortfolio.PortfolioName]);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  GetClientwisePortfolioAlloc(
    CustomerID: string,
    userID: string,
    sCategory: string,
    Ccy: string,
    Portfolio: any
  ): any {
    // const xmlString = this.cfs.json2xml(jsonObj);
    try {
      // console.log('Calling');
      const webMethod =
        this.interfaceUrl + 'GetClientwisePortfolioHoldings_LCYE';
      const parameters = {
        sCustomerId: CustomerID,
        sUserId: userID,
        Category: sCategory,
        baseCCY: Ccy,
        Portfolio,
      };
      // console.log(parameters);
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            this.ClientAlloc.next(res.ResponseBody.ClientWiseHoldings);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  // GetClientwisePortfolioAllocforDashbaord(
  //   CustomerID: string,
  //   userID: string,
  //   sCategory: string
  // ): any {
  //   try {
  //     const parameters = {
  //       sCustomerId: CustomerID,
  //       sUserId: userID,
  //       Category: sCategory,
  //     };
  //     return this.http.post<any>(this.interfaceUrl + 'GetClientwisePortfolioHoldings', parameters);
  //   } catch (error) {
  //     // console.error(error);
  //   }
  // }

  // GenerateStatementReport(CustomerID, FromDate, ToDate, UserID) {
  //   try {
  //     const webMethod = this.interfaceUrl + 'GenerateStatementReport';
  //     const parameters = {
  //       CustomerID,
  //       FromDate,
  //       ToDate,
  //       UserID
  //     };
  //     const result = this.http.get<any>(webMethod, parameters, { headers: this.headerOptions });
  //     result.subscribe((res) => {
  // // console.log(res);
  //     });
  //     const result = this.http.get<any>(this.interfaceUrl + 'GetAllTradablePairs', { headers: this.headerOptions });
  //     result.subscribe(res => { if (res) { if (!res.Error) { this.allTradablePair.next(res); } } });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  GeneratePnLStatementReport(CustomerID, UserID) {
    try {
      const webMethod = this.interfaceUrl + 'GeneratePnLStatementReport';
      const parameters = {
        CustomerID,
        UserID,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            // console.log(res);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  clearObservers() {
    try {
      this.WorkflowObserver.next('');
      this.QueuesObserver.next('');
      this.TokensObserver.next('');
      this.ButtonsObserver.next('');
      this.processTokenObserver.next('');
      this.webAppURLObserver.next('');
      this.dropdownValuesObserver.next('');
      this.CorpActionDetailsBS.next('');
    } catch (error) {
      // console.error(error);
    }
  }
  ClearObserversonValidateUserPage() {
    try {
      this.BSBCDetailsObserver.next('');
      this.getCustAccountDetailsforMultiAccObserver.next('');
      this.getCustAccountDetailsObserver.next('');
    } catch (error) {
      // console.log(error);
    }
  }
  setValidateUserPageMode(mode) {
    this.validateUserModeFlag.next(mode);
  }
  setStatmentPageMode(pageMode: number) {
    this.statementpageMode.next(pageMode);
  }
  ClearObserverofFD() {
    this.SaveOrderObserver.next('');
  }
  fnGetRISPaymentScheduleDetails(CustomerID, LoginID) {
    try {
      const webMethod = this.interfaceUrl + 'getRISPaymentScheduleDetails';
      const parameters = {
        CustomerID,
        LoginID,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            this.RISPaymentScheduleDetails.next(
              res.GetRISPaymentScheduleDetailsResult
            );
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }
  fnGetCustomerFeesandCharge(CustomerID, LoginID) {
    try {
      const webMethod = this.interfaceUrl + 'getCustomerFeesandCharge';
      const parameters = {
        CustomerID,
        LoginID,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            this.CustomerFeesandCharge.next(res.GetCustomerFeesandChargeResult);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  GetAllCorpAction() {
    console.log('function called');
    try {
      const webMethod = this.interfaceUrl + 'GetAllCorpAction';
      const that = this;
      const params = {};
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.RMWActionLinks = data;
          // console.log(data);
        },
      });
      return this.RMWActionLinks;
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetCorpActionDate() {
    console.log('function called');
    try {
      const webMethod = this.interfaceUrl + 'Get_CorpActionDate';
      const that = this;
      const params = {};
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.CorpActionDate = data;
          // console.log(data);
        },
      });
      return this.CorpActionDate;
    } catch (error) {
      // console.log('Error:', error);
    }
  }
  GetCertificateYN(NotemasterID) {
    try {
      // console.log(" GetCertificateYN function");
      const webMethod = this.interfaceUrl + 'Get_Certificate_YN';
      // console.log(webMethod);
      const that = this;
      const params = {
        NotemasterID,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.getYN = data;
          // console.log("ynflag in service ts file", data);
        },
      });
      return this.getYN;
    } catch (error) {
      // console.error(error);
    }
  }

  GetCorporateActionDetails(
    dateFilter,
    fromDate,
    toDate,
    corpAction,
    security,
    status,
    customerID
  ) {
    try {
      // console.log("loadAllCorpActionData servic called");
      const webMethod = this.interfaceUrl + 'Get_Corporate_Action_Details';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          dateFilter,
          fromDate,
          toDate,
          corpAction,
          security,
          status,
          customerID,
        }),
        processData: false,
        success(data) {
          // that.allCorpData = data;
          that.CorpActionDetailsBS.next(data);
          // console.log("CorpActionDetailsBS", data);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  GetShareDetailsCorpAct(NotemasterID) {
    try {
      const webMethod = this.interfaceUrl + 'Get_Share_Details_CorpAct';
      const that = this;
      const params = {
        NotemasterID,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.shareDetailsCorpActionBS.next(data);
          // console.log(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetCorpActionWithChoiceDetails(
    NotemasterID,
    StockCode,
    blnRecompute,
    templateCode,
    strQueueName,
    CustomerID,
    LoginID,
    CIF
  ) {
    try {
      const webMethod = this.interfaceUrl + 'Get_CorpActionWithChoiceDetails';
      const that = this;
      const params = {
        NotemasterID,
        StockCode,
        blnRecompute,
        templateCode,
        strQueueName,
        CustomerID,
        LoginID,
        CIF,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.CorpActionWithChoiceDetailsBS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetFacilty(CustomerID, StockCode, NotemasterID) {
    try {
      const webMethod = this.interfaceUrl + 'Get_Facilty';
      const that = this;
      const params = {
        CustomerID,
        StockCode,
        NotemasterID,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.GetFaciltyBS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetDocumentEmailcount(NotemasterID) {
    try {
      const webMethod = this.interfaceUrl + 'Get_DocumentEmailcount';
      const that = this;
      const params = {
        NotemasterID,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.GetDocumentEmailcountBS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetRuleoutputHistorydetails(NotemasterID, CustomerID) {
    try {
      const webMethod = this.interfaceUrl + 'GetRuleoutputHistorydetails';
      const that = this;
      const params = {
        NotemasterID,
        CustomerID,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.GetRuleoutputHistorydetailsBS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetDocumentDetails(NotemasterID, CustomerID) {
    try {
      const webMethod = this.interfaceUrl + 'Get_DocumentDetails';
      const that = this;
      const params = {
        NotemasterID,
        CustomerID,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.GetDocumentDetailsBS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetLabelforCustPrice(TemplateCode) {
    try {
      const webMethod = this.interfaceUrl + 'Get_LabelforCustPrice';
      const that = this;
      const params = {
        TemplateCode,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.GetLabelforCustPriceBS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetClientResYN(TemplateCode) {
    try {
      const webMethod = this.interfaceUrl + 'GetClientResYN';
      const that = this;
      const params = {
        TemplateCode,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.GetClientResYNBS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetShareQuantity(Asset) {
    try {
      const webMethod = this.interfaceUrl + 'Get_Share_Quantity';
      const that = this;
      const params = {
        Asset,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.GetShareQuantityBS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetDocHoldingQty(NoteMasterID, CustomerID) {
    try {
      const webMethod = this.interfaceUrl + 'GetDocHoldingQty';
      const that = this;
      const params = {
        NoteMasterID,
        CustomerID,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.GetDocHoldingQtyBS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetPaymentTp_CA(TemplateCode, NoteMasterId) {
    try {
      const webMethod = this.interfaceUrl + 'GetPaymentTp_CA';
      const that = this;
      const params = {
        TemplateCode,
        NoteMasterId,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.GetPaymentTp_CABS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetCAWithChoiceMetadataC(TemplateCode) {
    try {
      const webMethod = this.interfaceUrl + 'Get_CAWithChoice_MetadataC';
      const that = this;
      const params = {
        TemplateCode,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.GetCAWithChoiceMetadataCBS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetUDF_Values(_TemplateCode) {
    try {
      const webMethod = this.interfaceUrl + 'GetUDF_Values';
      const that = this;
      const params = {};
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.GetUDFValuesBS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetNotemasterDetails(NotemasterID) {
    try {
      const webMethod = this.interfaceUrl + 'Getnotemasterdetails';
      const that = this;
      const params = {
        NotemasterID,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.GetNotemasterDetailsBS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  GetEmailNotification(NotemasterID) {
    try {
      const webMethod = this.interfaceUrl + 'Get_EmailNotification';
      const that = this;
      const params = {
        NotemasterID,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.GetEmailNotificationBS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  UpdateCashSharePrice(
    Cash,
    Ccy,
    CorpAction,
    CustId,
    noteMasterId,
    payIn,
    ClientResponse,
    responseQuan,
    rightsOpted,
    rtsAllocated,
    rtsPrice,
    Share,
    strShareCalcMethod,
    strUserID,
    taxPerc,
    warrAllocated,
    warrApplied,
    warrOpted,
    warrPrice,
    CIF
  ) {
    try {
      const webMethod = this.interfaceUrl + 'Update_Cash_Share_Price';
      const that = this;
      const params = {
        Cash,
        Ccy,
        CorpAction,
        CustId,
        noteMasterId,
        payIn,
        ClientResponse,
        responseQuan,
        rightsOpted,
        rtsAllocated,
        rtsPrice,
        Share,
        strShareCalcMethod,
        strUserID,
        taxPerc,
        warrAllocated,
        warrApplied,
        warrOpted,
        warrPrice,
        CIF,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(params),
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          that.UpdateCashSharePriceBS.next(data);
        },
      });
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  getRMOrderDetails(RM_Id: string) {
    try {
      const webMethod = this.interfaceUrl + 'getRMOrderDetails';
      const parameters = {
        RM_Id,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            this.GetRMOrderDetails.next(res);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  getCustomersOfRM(LoginId: string) {
    try {
      const webMethod = this.interfaceUrl + 'getCustomersOfRM';
      const parameters = {
        LoginId,
        EntityID: this.auth.EntityID,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            this.GetCustomersOfRM.next(res);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  insertRMUpdateInfo(customerobj: any) {
    try {
      const webMethod = this.interfaceUrl + 'Insert_Update_RM_Info';
      const parameters = {
        LoginId: sessionStorage.getItem('Username'),
        RM_Manager_Name: sessionStorage.getItem('FinIQUserID'),
        customerobj,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      return result;
      // result.subscribe((res) => {
      //   if (res) {
      //     if (!res.Error) {
      //       this.GetinsertRMUpdateInfo.next(res.Insert_CustomerRM_MapResult);
      //     }
      //   }
      // });
      // console.log(result);
    } catch (error) {
      // console.error(error);
    }
  }
  getCustomerGroupForMapping(entityID) {
    try {
      const webMethod = this.interfaceUrl + 'rmCustMapping';
      // console.log("hello")
      const parameters = {
        LoginId: sessionStorage.getItem('Username'),
        Rel_Manager_Name: sessionStorage.getItem('FinIQUserID'),
        RM_Group_Name: sessionStorage.getItem('FinIQUserID'),
        EntityID: entityID,
        // RM_Group_Name: sessionStorage.getItem("FinIQUserID"),
        //   RM_GS_Type: "",
        //   Customer_GS_Type: "",
        //   Customer_Group_Name: "",
        //   Customer_Name: "",
        //   Access_Type: "",
        //   Valid_From: "",
        //   Valid_To: "",
        //   Created_By: "",
        //   Created_At: "",
        //   RCM_Id: 0,
        //   MainRM_YN: "",
        //   CustomerId: 0,

        //   RM_Id: 0,

        //   EntityID: 4,

        //   UserID: "",

        //   IPAddress: "",

        //   MAPPED_YN: "N",

        //   GS: ""
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });

      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            // console.log(res);
            this.GetAllCustomerGroups.next(res);
          }
        }
      });
    } catch (error) {
      // console.log(error)
    }
  }

  getMappingStatus(CustomerGroup: string) {
    try {
      const webMethod = this.interfaceUrl + 'getMappingStatus';
      // console.log("hello")
      const parameters = {
        CustomerGroup,
        LoginId: sessionStorage.getItem('Username'),
        Rel_Manager_Name: sessionStorage.getItem('FinIQUserID'),
        // RM_Group_Name: sessionStorage.getItem("FinIQUserID"),
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });

      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            // console.log(res);
            this.GetCustomerStatus.next({ CustomerGroup, response: res });
          }
        }
      });
    } catch (error) {
      // console.log(error)
    }
  }

  GetCustProfileDetailsFromCustID(CustomerID: string) {
    try {
      const webMethod = this.interfaceUrl + 'GetCustProfileDetailsFromCustID';
      const parameters = {
        CustomerID,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            // console.log(res);
            this.GetCustProfileFromCustID.next(res);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  isCustProfileCreated(loginId: string, custID: string, NoteMaster_ID: string) {
    if (loginId) {
      try {
        const webMethod = this.interfaceUrl + 'GetCustProfiledetails';
        // console.log(webMethod);
        const parameters = {
          login: loginId,
          NoteMaster_ID,
        };
        return this.http.post<any>(webMethod, parameters, {
          headers: this.headerOptions,
        });
      } catch (error) {
        // console.error(error);
      }
    } else if (custID) {
      try {
        const webMethod = this.interfaceUrl + 'GetCustProfileDetailsFromCustID';
        const parameters = {
          custID,
        };
        return this.http.post<any>(webMethod, parameters, {
          headers: this.headerOptions,
        });
      } catch (error) {
        // console.error(error);
      }
    }
  }
  getCustProfiledetails(loginId: string, _NoteMaster_ID: string) {
    try {
      const webMethod = this.interfaceUrl + 'GetCustProfiledetails';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          login: loginId,
          NoteMaster_Id: '',
        }),
        processData: false,
        success(data) {
          // console.log('Workflows', data);
          that.GetCustProfiledetails.next(data);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }
  GetLoginRMDetails(customerID: string) {
    try {
      const webMethod = this.interfaceUrl + 'GetLoginRMDetails';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          customerID,
        }),
        processData: false,
        success(data) {
          // console.log('Workflows', data);
          that.GetLoginRMDetailsBS.next(data);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  GetCSPEvents() {
    try {
      const webMethod = this.interfaceUrl + 'GetCSPEvents';

      return this.http.get(webMethod);
      // console.log(webMethod);
      //   const that = this;
      //   let response = {};
      //   $.ajax({
      //     async: true,
      //     crossDomain: true,
      //     type: 'GET',
      //     url: webMethod,
      //     contentType: 'application/json; charset=utf-8',
      //     dataType: 'json',
      //     headers: {
      //       'Cache-Control': 'no-cache',
      //       'Access-Control-Allow-Origin': '*'
      //     },
      //     success(data) {
      //       that.oGetCSPEvents.next(data);

      //     },
      //     error(error) {
      // // console.log('error getWorflows', error);
      //     }
      //   });
    } catch (error) {
      // console.error(error);
    }
  }

  AttachDocument(
    loginId: string,
    EntityID: string,
    EntityName: string,
    noteMasterID: string,
    eventCode: string,
    fileName: string,
    FileData: string
  ) {
    try {
      const webMethod = this.interfaceUrl + 'AttachDocument';

      // const parameters = { EntityID, EntityName, login: loginId, noteMasterID, eventCode, fileName, FileData };
      // return this.http.post<any>(webMethod, parameters);

      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          EntityID,
          EntityName,
          login: loginId,
          noteMasterID,
          eventCode,
          fileName,
          FileData,
        }),
        processData: false,
        success(data) {
          console.log('Workflows', data);
          that.oAttachDocuments.next(data);
        },
        error(err) {
          console.log('error in file attachment', err);
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  AttachDocumentWTOObservable(
    loginId: string,
    EntityID: string,
    EntityName: string,
    noteMasterID: string,
    eventCode: string,
    fileName: string,
    FileData: string
  ) {
    try {
      const webMethod = this.interfaceUrl + 'AttachDocument';
      let parameters = JSON.stringify({
        EntityID,
        EntityName,
        login: loginId,
        noteMasterID,
        eventCode,
        fileName,
        FileData,
      });
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      // console.error(error);
    }
  }
  async AttachDocumentAsync(
    loginId: string,
    EntityID: string,
    EntityName: string,
    noteMasterID: string,
    eventCode: string,
    fileName: string,
    FileData: string
  ) {
    try {
      const webMethod = this.interfaceUrl + 'AttachDocument';
      let parameters = JSON.stringify({
        EntityID,
        EntityName,
        login: loginId,
        noteMasterID,
        eventCode,
        fileName,
        FileData,
      });
      const res = await this.http
        .post<any>(webMethod, parameters, {
          headers: this.headerOptions,
        })
        .toPromise()
        .then((res) => {
          return res;
        });
      return res;
    } catch (error) {
      // console.error(error);
    }
  }

  DB_GetDocBody(noteMasterID: string, eventCode: string) {
    try {
      const webMethod = this.interfaceUrl + 'DB_GetDocBody';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          noteMasterID,
          eventCode,
        }),
        processData: false,
        success(data) {
          // console.log("getDocData", data);
          that.oGetDocuments.next(data.DB_GetDocBodyResult);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  GetEventName_CA() {
    try {
      const webMethod = this.interfaceUrl + 'GetEventName_CA';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({}),
        processData: false,
        success(data) {
          // console.log("event data", data);
          that.GetEventNameCABS.next(data);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  ReadAllProductAllEvent_CA(
    NotemasterID: string,
    STock: string,
    CustomerID: string,
    DateType: string,
    From: string,
    To: string,
    Template_Name: string
  ) {
    try {
      const webMethod = this.interfaceUrl + 'ReadAllProductAllEvent_CA';
      // console.log(webMethod);
      const parameters = {
        NotemasterID,
        STock,
        CustomerID,
        DateType,
        From,
        To,
        Template_Name,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      // console.error(error);
    }
  }
  CountPerDayEventDiary_CA_async(
    NotemasterID: string,
    STock: string,
    CustomerID: string,
    DateType: string,
    From: string,
    To: string,
    Template_Name: string
  ) {
    // console.log(From);
    const webMethod = this.interfaceUrl + 'CountPerDayEventDiary_CA';
    const parameters = {
      NotemasterID,
      STock,
      CustomerID,
      DateType,
      From,
      To,
      Template_Name,
    };
    const that = this;
    return this.http.post<any>(webMethod, parameters);
  }

  CountProductAllEvent_CA(
    NotemasterID: string,
    STock: string,
    CustomerID: string,
    DateType: string,
    From: string,
    To: string,
    Template_Name: string
  ) {
    try {
      // console.log(NotemasterID, STock, CustomerID, DateType, From, To, Template_Name);
      const webMethod = this.interfaceUrl + 'CountProductAllEvent_CA';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          NotemasterID,
          STock,
          CustomerID,
          DateType,
          From,
          To,
          Template_Name,
        }),
        processData: false,
        success(data) {
          that.CountProductAllEvent_CABS.next(
            data.CountProductAllEvent_CAResult
          );
          // console.log('data in service call', data.CountProductAllEvent_CAResult);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  GetClientResponsePending(
    NotemasterID: string,
    STock: string,
    CustomerID: string,
    DateType: string,
    From: string,
    To: string,
    Template_Name: string
  ) {
    try {
      const webMethod = this.interfaceUrl + 'GetClientResponsePending';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          NotemasterID,
          STock,
          CustomerID,
          DateType,
          From,
          To,
          Template_Name,
        }),
        processData: false,
        success(data) {
          that.GetClientResponsePendingBS.next(data);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }
  getWorkflowMetadata(workflowId: any, loginid: any) {
    const webMethod = this.interfaceUrl + 'getWorkflowBlotterMetaData';

    const parameters = {
      workflowId,
      loginid,
    };
    const that = this;
    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      // console.log(res);
      // res.push({'index' : index});
      that.getMetadata.next(res);
    });
  }

  getWorkflowCommonData() {
    const webMethod = this.interfaceUrl + 'GetCommandata';

    const parameters = {
      DataType: 'CSP_Workflow_Type',
    };
    const that = this;
    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      // console.log(res);
      // res.push({'index' : index});
      that.getCommonData.next(res);
    });
  }

  UpdateSidebar(
    LoginType: string,
    Menu: string,
    Submenu: string,
    DisplayYN: string
  ) {
    const webMethod = this.interfaceUrl + 'UpdateSidebar';
    const parameters = {
      LoginType,
      Menu,
      Submenu,
      DisplayYN,
    };
    const that = this;
    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      // console.log(res);
      that.updateSidebarData.next(res);
    });
  }

  GetSidebar(LoginType: string) {
    const webMethod = this.interfaceUrl + 'GetSidebar';
    const parameters = {
      LoginType,
    };
    return this.http.post<any>(webMethod + '', parameters);
    // this.http.post<any>(webMethod + "", parameters).subscribe((res) => {
    //   that.getSidebarData.next(res);
    // });
  }

  // CheckedMenu(LoginType: string) {
  //   const webMethod = this.interfaceUrl + 'GetSidebar';
  //   const parameters = {
  //     LoginType,
  //   };
  //   const that = this;
  //   return this.http.post<any>(webMethod + '', parameters);
  //   // this.http.post<any>(webMethod + "", parameters).subscribe((res) => {
  //   //   that.getCheckedMenu.next(res);
  //   // });
  // }

  GetCorpActionsWithFlag(
    dateFilter,
    fromDate,
    toDate,
    corpAction,
    security,
    status,
    customerID
  ) {
    const webMethod = this.interfaceUrl + 'GetCorpActionsWithFlag';
    const parameters = {
      dateFilter,
      fromDate,
      toDate,
      corpAction,
      security,
      status,
      customerID,
    };
    const that = this;
    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      that.GetCorpActionsWithFlagData.next(res);
    });
  }
  CountPerDayEventDiary_CA(
    NotemasterID: string,
    STock: string,
    CustomerID: string,
    DateType: string,
    From: string,
    To: string,
    Template_Name: string
  ) {
    // console.log(From);
    const webMethod = this.interfaceUrl + 'CountPerDayEventDiary_CA';
    const parameters = {
      NotemasterID,
      STock,
      CustomerID,
      DateType,
      From,
      To,
      Template_Name,
    };
    const that = this;
    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      that.CountPerDay_BS.next(res.CountPerDayEventDiary_CAResult);
    });
  }

  saveNewOrderOnBoarding(jsonObj: any, entityUser: string): any {
    let xmlString = this.cfs.json2xml(jsonObj);
    xmlString = xmlString.replace(/&/g, '&amp;');
    // console.log(xmlString);
    let result = {};
    try {
      const webMethod = this.interfaceUrl + 'saveNewOrderOnBoarding';
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          xmlString,
          userId: entityUser,
          templateCode: 'Initial_Evaluation',
        }),
        processData: false,
        success(data) {
          // console.log(data);
          result = data;
        },
      });
    } catch (error) {
      // console.error(error);
    }
    return result;
  }

  loadButtonsOnBoarding(queueId: string, loginId: string) {
    try {
      const webMethod = this.interfaceUrl + 'getButtonsOnBoarding';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          queueid: queueId,
          loginid: loginId,
          modeAVE: 'CST',
        }),
        processData: false,
        success(data) {
          // console.log(data);
          that.ButtonsOnBoardingObserver.next(data);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  loadTokensOnBoarding(
    queueId: number,
    entity: number,
    dateFilter: number,
    pageNo: number,
    records: number,
    search: string
  ) {
    try {
      const webMethod = this.interfaceUrl + 'getTokensOnBoarding';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          queueid: queueId,
          entityId: entity,
          dateFilter: '/Date(' + dateFilter + ')/',
          pageno: pageNo,
          pageSize: records,
          searchKey: search || '',
        }),
        processData: false,
        success(data) {
          const json = that.cfs.xml2json(data).NewDataSet.DUMMY;
          // console.log(json);
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
              // console.log(json);
              result = json;
            }
          }
          // console.log(result);
          that.TokensOnBoardingObserver.next(result);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  processButtonActionOnBoarding(token, deal, button, loginId) {
    try {
      const webMethod =
        this.interfaceUrl + 'processTokenonButtonClickOnBoarding';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          tokenId: [token],
          dealNo: [deal],
          buttonId: button,
          loginid: loginId,
        }),
        processData: false,
        success(data) {
          // console.log(data);
          that.processTokenOnBoardingObserver.next(data);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  loadQueuesOnBoarding(
    workflowId: string,
    entityId: number,
    dateFilter: number,
    workFlowName: string,
    includeClosure: string,
    search: string
  ) {
    try {
      const webMethod = this.interfaceUrl + 'loadQueuesOnBoarding';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          workflowid: workflowId,
          entityid: entityId,
          dateFilter: '/Date(' + dateFilter + ')/',
          closure: includeClosure || 'No',
          searchKey: search || '',
        }),
        processData: false,
        success(data) {
          const returnData = { queues: [], WorkFlowName: workFlowName };
          returnData.queues = data;
          that.QueuesOnBoardingObserver.next(returnData);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }

  async isKYCDone(formName, customer) {
    const webMethod = this.interfaceUrl + 'Get_KYCFeedbackIDCheck';

    const parameters = {
      custID: customer,
      FormName: formName,
    };

    return this.http
      .post<any>(webMethod + '', parameters, { responseType: 'text' as 'json' })
      .toPromise();
  }

  GetCustomerDetails_ClientOnBoarding(RefID) {
    const webMethod =
      this.interfaceUrl + 'getCustomerDetails_for_clientOnboarding';

    const parameters = {
      RefID,
    };
    return this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      this.CustomerDetails_ClientBoarding.next(
        JSON.parse(res.GetDataResult)[0]
      );
    });
  }
  ResetCustomerDetails_ClientBoardingObserver() {
    this.CustomerDetails_ClientBoarding.next({});
  }

  getCommonDataEFX(dataType) {
    const body = { DataType: dataType };
    return this.http.post<any>(this.interfaceUrl + 'GetCommonDataEFX', body);
  }

  getClientSetupForm() {
    const webMethod = this.interfaceUrl + 'GetClientSetupform';
    const parameters = {};
    return this.http.post<any>(webMethod, parameters);
  }

  GettCustomerAccountDetails(LoginID: any): any {
    try {
      const webMethod = this.interfaceUrl + 'getCustomerAccDetails';
      const parameters = {
        LoginID,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      // console.error(error);
    }
  }
  async GetClientSetupformSavedForFuture(LoginID): Promise<any[]> {
    try {
      const webMethod = this.interfaceUrl + 'GetClientSetupformSavedForFuture';
      const parameters = {
        LoginID,
      };
      // this.userGroups = await this.http.get<any>(this.interfaceURL + 'GetUserGroups').toPromise().then((grps: any[]) => {
      //   console.log(grps);
      //   return grps;
      // });
      // return this.userGroups;

      const clientdet = await this.http
        .post<any>(webMethod, parameters)
        .toPromise()
        .then((clientdet) => {
          const res = JSON.parse(clientdet.GetDataResult);
          if (res.length > 0) {
            return res[0];
          } else {
            return {};
          }
        });
      return clientdet;
    } catch (exeception) {
      console.log(
        'Error occured in GetClientSetupformSavedForFuture api calling'
      );
    }
  }
  GetClientSetupformSavedForFutureKetan(LoginID) {
    try {
      const webMethod = this.interfaceUrl + 'GetClientSetupformSavedForFuture';
      const parameters = {
        LoginID,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (exeception) {
      console.log(
        'Error occured in GetClientSetupformSavedForFuture api calling'
      );
    }
  }
  SetClientSetupformSavedForFuture(LoginID, JSON: string) {
    try {
      const webMethod = this.interfaceUrl + 'SetClientSetupformSavedForFuture';
      const parameters = {
        JSON,
        LoginID,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (exeception) {
      console.log(
        'Error occured in SetClientSetupformSavedForFuture api calling'
      );
    }
  }

  fnGet_Workflow_Type_Master_Id(WTM_Code: string) {
    try {
      const webMethod = this.interfaceUrl + 'Get_Workflow_Type_Master_Id';
      const parameters = {
        WTM_Code,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (exeception) {
      console.log('Error occured in fnGet_Workflow_Type_Master_Id api calling');
    }
  }
  clearCustProfileData() { }
  UpdateKYCFlag(FormName, CustomerId, LoginId, RiskRating) {
    try {
      const webMethod = this.interfaceUrl + 'UpdateKYCFlags';
      const parameters = { FormName, CustomerId, RiskRating, LoginId };
      return this.http.post<any>(webMethod, parameters);
    } catch (ex) {
      console.log('Error occured in UpdateKYCFlag api function as :', ex);
    }
  }
  GetProductsListofUpdateCIRP(Avg_Value) {
    try {
      const webMethod = this.interfaceUrl + 'GetRiskProfileDetails';
      const parameters = { Avg_Value };
      return this.http.post<any>(webMethod, parameters);
    } catch (ex) {
      console.log(
        'Error occured in GetProductsListofUpdateCIRP api function as :',
        ex
      );
    }
  }
  GetSSIDetailsofAccountDetails(CustomerId, LoginId) {
    try {
      const webMethod = this.interfaceUrl + 'GetSSIDetailsforAccount';
      const parameters = { CustomerId, LoginId };
      return this.http.post<any>(webMethod, parameters);
    } catch (ex) {
      console.log(
        'Error occured in GetSSIDetailsofAccountDetails api function as :',
        ex
      );
    }
  }
  GetTermsAndConditionsPDF() {
    try {
      const webMethod = this.interfaceUrl + 'getFile';
      return this.http.get<any>(webMethod);
    } catch (ex) {
      console.log(
        'Error occured in GetSSIDetailsofAccountDetails api function as :',
        ex
      );
    }
  }

  GetEventCalendarDetails(
    event,
    fromDate,
    toDate,
    custID,
    custName,
    viewBy,
    portfolio
  ) {
    try {
      const webMethod = this.interfaceUrl + 'GetEventCalendarDetails';
      const parameters = {
        event,
        fromDate,
        toDate,
        custID,
        custName,
        viewBy,
        portfolio,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (ex) {
      console.log(
        'Error occured in GetEventCalendarDetails api function as :',
        ex
      );
    }
  }

  GetPortfolioTargetAllocation(custID, portfolio) {
    const webMethod = this.interfaceUrl + 'GetPortfolioTargetAllocation';
    const entityCode = this.auth.EntityCode;
    const login = sessionStorage.getItem('Username');
    const parameters = {
      entityCode,
      login,
      CustomerID: custID,
      Portfolio: portfolio,
    };
    return this.http.post<any>(webMethod, parameters);
  }
  async GetPortfolioTargetAllocationAsync(custID, portfolio) {
    const webMethod = this.interfaceUrl + 'GetPortfolioTargetAllocation';
    const entityCode = this.auth.EntityCode;
    const login = sessionStorage.getItem('Username');
    const parameters = {
      entityCode,
      login,
      CustomerID: custID,
      Portfolio: portfolio,
    };
    const targetallocation = await this.http
      .post<any>(webMethod, parameters)
      .toPromise()
      .then((res) => res);
    return targetallocation;
  }
  GetFinancialPlan(Request) {
    try {
      const webMethod = this.interfaceUrl + 'GetFinancialPlan';
      return this.http.post<any>(webMethod, Request);
    } catch (ex) {
      console.log('Error occured in GetFinancialPlan api function as :', ex);
      return null;
    }
  }

  /***************Watchlist Apis<START>*********************/

  async AddSharetoWatchList(loginId, wlname, newwlname, nmid, custID) {
    try {
      const webMethod = this.interfaceUrl + 'AddSharetoWatchList';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: loginId || sessionStorage.getItem('Username'),
        WatchListName: wlname,
        NewWatchListName: newwlname,
        NoteMasterID: nmid,
        CustomerID: custID,
        EntityID: this.auth.EntityID,
      };
      return this.http.post<any>(webMethod, params).toPromise();
    } catch (ex) {
      console.log('Error occured in AddSharetoWatchList api function as :', ex);
    }
  }

  async GetWatchListNames(loginId: any, custID: any) {
    try {
      const webMethod = this.interfaceUrl + 'GetWatchListNames';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: loginId || sessionStorage.getItem('Username'),
        Type: 'EQ',
        CustomerID: custID,
        EntityID: this.auth.EntityID,
      };
      return this.http.post<any>(webMethod, params).toPromise();
    } catch (ex) {
      console.log('Error occured in GetWatchListNames api function as :', ex);
    }
  }

  async GetWatchListData(loginId, custId, wlName) {
    try {
      const webMethod = this.interfaceUrl + 'GetWatchListData';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: loginId || sessionStorage.getItem('Username'),
        WatchListName: wlName,
        CustomerID: custId,
        EntityID: this.auth.EntityID,
      };
      return this.http.post<any>(webMethod, params).toPromise();
    } catch (ex) {
      console.log('Error occured in GetWatchListData api function as :', ex);
    }
  }
  async DeleteShareFromWatchList(wlname, nmid, custID) {
    try {
      const webMethod = this.interfaceUrl + 'DeleteShareFromWatchList';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: sessionStorage.getItem('Username'),
        WatchListName: wlname,
        NoteMasterID: nmid,
        CustomerID: custID,
        EntityID: this.auth.EntityID,
      };
      return this.http.post<any>(webMethod, params).toPromise();
    } catch (ex) {
      console.log(
        'Error occured in DeleteShareFromWatchList api function as :',
        ex
      );
    }
  }
  //Changed by MohanP | 03feb22
  async SaveOrderWatchlist(wlsaveOrder) {
    try {
      const webMethod = this.interfaceUrl + 'SaveOrderWatchlist';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: sessionStorage.getItem('Username'),
        SaveOrder: wlsaveOrder,
      };
      return this.http.post<any>(webMethod, params).toPromise();
    } catch (ex) {
      console.log('Error occured in SaveOrderWatchlist api function as :', ex);
    }
  }

  /***************Watchlist Apis<END>*********************/
  /***************Watchlist Apis<START>*********************/

  async AddSharetoWatchListMulti(
    loginId,
    wlname,
    newwlname,
    nmid,
    custID,
    type
  ) {
    try {
      const webMethod = this.interfaceUrl + 'AddSharetoWatchListMulti';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: loginId || sessionStorage.getItem('Username'),
        WatchListName: wlname,
        NewWatchListName: newwlname,
        NoteMasterID: nmid,
        CustomerID: custID,
        EntityID: this.auth.EntityID,
        Type: type,
      };
      return this.http.post<any>(webMethod, params).toPromise();
    } catch (ex) {
      console.log('Error occured in AddSharetoWatchList api function as :', ex);
    }
  }

  async GetWatchListNamesMulti(loginId: any, custID: any) {
    try {
      const webMethod = this.interfaceUrl + 'GetWatchListNamesMulti';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: loginId || sessionStorage.getItem('Username'),
        CustomerID: custID,
        EntityID: this.auth.EntityID,
      };
      return this.http.post<any>(webMethod, params).toPromise();
    } catch (ex) {
      console.log('Error occured in GetWatchListNames api function as :', ex);
    }
  }

  async GetWatchListDataMulti(loginId, custId, wlName) {
    try {
      const webMethod = this.interfaceUrl + 'GetWatchListDataMulti';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: loginId || sessionStorage.getItem('Username'),
        WatchListName: wlName,
        CustomerID: custId,
        EntityID: this.auth.EntityID,
      };
      return this.http.post<any>(webMethod, params).toPromise();
    } catch (ex) {
      console.log('Error occured in GetWatchListData api function as :', ex);
    }
  }
  async DeleteShareFromWatchListMulti(wlname, nmid, custID, type) {
    try {
      const webMethod = this.interfaceUrl + 'DeleteShareFromWatchListMulti';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: sessionStorage.getItem('Username'),
        WatchListName: wlname,
        NoteMasterID: nmid,
        CustomerID: custID,
        EntityID: this.auth.EntityID,
        Type: type,
      };
      return this.http.post<any>(webMethod, params).toPromise();
    } catch (ex) {
      console.log(
        'Error occured in DeleteShareFromWatchList api function as :',
        ex
      );
    }
  }
  async SaveOrderWatchlistMulti(wlsaveOrder) {
    try {
      const webMethod = this.interfaceUrl + 'SaveOrderWatchlist';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: sessionStorage.getItem('Username'),
        SaveOrder: wlsaveOrder,
      };
      return this.http.post<any>(webMethod, params).toPromise();
    } catch (ex) {
      console.log('Error occured in SaveOrderWatchlist api function as :', ex);
    }
  }

  /***************Watchlist Apis<END>*********************/
  /***************Client Holdings Api<START>*********************/

  GetClientHoldingsData(_loginid, pfName, custId) {
    try {
      const webMethod = this.interfaceUrl + 'GetClientHoldingsData';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: sessionStorage.getItem('Username'),
        Portfolio_Name: pfName,
        PageNo: 1,
        NoOfRecords: 10,
        TypeMarket: 'EQ',
        FromDate: moment().subtract(1, 'years').format('DD-MMM-YYYY'), //'01-Aug-2021',
        ToDate: moment().format('DD-MMM-YYYY'), //'01-Aug-2022',
        CustomerID: custId,
        EntityID: this.auth.EntityID,
        BankBaseCurrency: this.bankBaseCCY,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log(
        'Error occured in GetClientHoldingsData api function as :',
        ex
      );
    }
  }
  /***************Client Holdings Api<END>*********************/
  /***************Client Orders Api<START>*********************/
  //Changed by MohanP | 2FEB22
  GetClientOrdersData(pfName, wfType, custId, currentPage, recordsPerPage) {
    try {
      const webMethod = this.interfaceUrl + 'GetClientOrderDetails';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: sessionStorage.getItem('Username'),
        Underlying: '',
        PortfolioName: pfName,
        CustomerID: custId,
        WorkflowType: wfType,
        FromDate: moment().subtract(1, 'years').format('DD-MMM-YYYY'), //'01-Aug-2021',
        ToDate: moment().format('DD-MMM-YYYY'), //'01-Aug-2022',
        NoOfRecords: recordsPerPage,
        PageNo: currentPage,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log(
        'Error occured in GetClientOrderDeatils api function as :',
        ex
      );
    }
  }
  /***************Client Orders Api<END>*********************/
  /***************Client Portfolios Api<END>*********************/
  // GetClientPortfolios(
  //   CustomerID: string,
  //   userID: string,
  //   sCategory: string
  // ): any {
  //   try {
  //     const webMethod = this.interfaceUrl + 'GetClientwisePortfolioHoldings';
  //     const parameters = {
  //       sCustomerId: CustomerID,
  //       sUserId: userID,
  //       Category: sCategory,
  //     };
  //     return this.http.post<any>(webMethod, parameters, {
  //       headers: this.headerOptions,
  //     });

  //   } catch (error) {
  //   }
  // }
  /***************Client Portfolios Api<END>*********************/

  // START -- Rebalancing component

  GetAllocationDetails(
    benchmark,
    portfolio,
    entityID,
    CustomerID,
    strategy
  ): any {
    try {
      const webMethod = this.interfaceUrl + 'GetAllocationDetails';
      const parameters = {
        benchmark: benchmark,
        portfolio: portfolio,
        entityID: entityID,
        CustomerID: CustomerID,
        strategy: strategy,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  GetBenchmarkId(CustomerId, Portfolio, LoginID): any {
    try {
      const webMethod = this.interfaceUrl + 'GetBenchmarkId';
      const parameters = {
        CustomerId: CustomerId,
        Portfolio: Portfolio,
        LoginID: LoginID,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  //Rebalance Equities

  GetRebalanceData_EQ(
    direction,
    portfolio,
    entityID,
    CustomerID,
    rebalanceAmt
  ): any {
    try {
      const webMethod = this.interfaceUrl + 'GetRebalanceData_EQ';
      const parameters = {
        direction: direction,
        portfolio: portfolio,
        entityID: entityID,
        CustomerID: CustomerID,
        rebalanceAmt: rebalanceAmt,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  //Rebalance Mutual Funds

  GetRebalanceData_MF(
    direction,
    portfolio,
    entityID,
    CustomerID,
    rebalanceAmt
  ): any {
    try {
      const webMethod = this.interfaceUrl + 'GetRebalanceData_MF';
      const parameters = {
        direction: direction,
        portfolio: portfolio,
        entityID: entityID,
        CustomerID: CustomerID,
        rebalanceAmt: rebalanceAmt,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  //Rebalance Bonds

  GetRebalanceData_Bonds(
    direction,
    portfolio,
    entityID,
    CustomerID,
    rebalanceAmt
  ): any {
    try {
      const webMethod = this.interfaceUrl + 'GetRebalanceData_Bonds';
      const parameters = {
        direction: direction,
        portfolio: portfolio,
        entityID: entityID,
        CustomerID: CustomerID,
        rebalanceAmt: rebalanceAmt,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  GetStrategyWiseData_Wrapper(
    portfolio,
    entityID,
    CustomerID,
    strategy,
    refDate,
    threshold
  ): any {
    try {
      const webMethod = this.interfaceUrl + 'GetStrategyWiseData_Wrapper';
      const parameters = {
        portfolio: portfolio,
        entityID: entityID,
        CustomerID: CustomerID,
        strategy: strategy,
        refDate: refDate,
        threshold: threshold,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  GetReferenceDate(Frequency, EntityId): any {
    try {
      const webMethod = this.interfaceUrl + 'GetReferenceDate';
      const parameters = {
        Frequency: Frequency,
        EntityId: EntityId,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  GetFrequencies(): any {
    try {
      const webMethod = this.interfaceUrl + 'GetFrequencies';
      return this.http.get<any>(webMethod);
    } catch (error) { }
  }

  //Rebalance -- END

  fnDiagoKYCwithtemple() {
    const webMethod = this.interfaceUrl + 'DiagoKYCwithtemple';
    const parameters = {
      customer_identifier: '9890021034',
      customer_name: 'Prashant',
      reference_id: 'CRN122306114425315NN',
      template_name: 'AADHAAR TEST',
      notify_customer: true,
      request_details: {
        customer_name: 'Prashant',
        Age: 45,
      },
      transaction_id: 'CRN122306114425315NN',
      generate_access_token: true,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  fnSignzyAPILogin(username: any, password: any) {
    const webMethod = this.interfaceUrl + 'Signzyapi/v2/patrons/login';
    const parameters = { username, password };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  fnSignzyAPIIdentities(
    authorization: string,
    type: string,
    email: string,
    callbackUrl: string,
    images: string
  ) {
    const webMethod = this.interfaceUrl + 'Signzyapi/v2/patrons/identities';
    const parameters = { authorization, type, email, callbackUrl, images };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  fnSignzyAPISnoops(
    service: string,
    itemId: string,
    task: string,
    accessToken: string,
    number: string,
    name: string,
    fuzzy: string
  ) {
    const webMethod = this.interfaceUrl + 'Signzyapi/v2/snoops';
    const parameters = {
      service,
      itemId,
      task,
      accessToken,
      number,
      name,
      fuzzy,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  fnCustomerPANVerfication(
    EntityID: string,
    LoginID: string,
    PANNUMBER: string,
    PANNAME: string,
    RequestDatetTime: any
  ) {
    const webMethod = this.interfaceUrl + 'CustomerPANVerfication';
    const parameters = {
      EntityID,
      LoginID,
      PANNUMBER,
      PANNAME,
      RequestDatetTime,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  fnCustomerAadharVerfication(
    EntityID: string,
    LoginID: string,
    AADHARNUMBER: string,
    RequestDatetTime: any
  ) {
    const webMethod = this.interfaceUrl + 'CustomerAADHARVerfication';
    const parameters = { EntityID, LoginID, AADHARNUMBER, RequestDatetTime };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  fnSetSubAccountToPortfolio(
    LoginId1: string,
    LoginId2: string,
    NoteMasterId: string,
    Portfolio: string
  ) {
    const webMethod = this.interfaceUrl + 'UpdateOnboardingData';
    const parameters = { LoginId1, LoginId2, NoteMasterId, Portfolio };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  setBankBaseCCY(ccy) {
    this.bankBaseCCY = ccy;
    this.homeapi.baseCCY = ccy;
    this.getBankBaseCCY.next(ccy);
  }

  fnFacilitiesList(Misc1: string, Misc2: string) {
    const webMethod = this.interfaceUrl + 'Get_FacilityDescription';
    const parameters = { Misc1, Misc2 };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  getCashHoldingsHistory(
    customerid: string,
    loginid: string,
    entityid: string,
    accountnumber: string
  ) {
    const webMethod = this.interfaceUrl + 'getcashholdingshistory';
    const parameters = {
      CustomerID: customerid,
      LoginID: loginid,
      EntityID: entityid,
      AccountNumber: accountnumber,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  Get_KYC_Risk_Rating_Login(LoginID) {
    const webMethod = this.interfaceUrl + 'Get_KYC_Risk_Rating_Login';
    const parameters = {
      LoginID,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  fnGetPortfolioSubAccountDetails(NoteMasterId: string, Portfolio: string) {
    const webMethod = this.interfaceUrl + 'GetPortfolioSubAccountDetails';
    const parameters = { NoteMasterId, Portfolio };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetHoldingHistoryDetails(
    Id: string,
    custId: string,
    facility: string,
    stockCode: string,
    EntityId: string
  ) {
    const webMethod = this.interfaceUrl + 'Get_Holding_History_Details';
    const parameters = {
      Id: Id,
      custId: custId,
      facility: facility,
      stockCode: stockCode,
      EntityId: EntityId,
    };
    console.log(parameters);
    return this.http.post<any>(webMethod, parameters);
  }

  ToggleTicker(loginId, visible) {
    const webMethod = this.interfaceUrl + 'toggleTicker';
    const parameters = {
      UserName: loginId,
      Visible: visible ? 'Y' : 'N',
    };
    console.log(parameters);
    return this.http.post<any>(webMethod, parameters);
  }
  TogglePDFMode(loginId, visible) {
    const webMethod = this.interfaceUrl + 'togglePDFMode';
    const parameters = {
      UserName: loginId,
      Visible: visible ? 'Y' : 'N',
    };
    console.log(parameters);
    return this.http.post<any>(webMethod, parameters);
  }

  //Added by Arsh P || JIRA ID: STANHCINT-506 || Start

  getModelPortfolioDetails() {
    const webMethod = this.interfaceUrl + 'GetModelPortfolioDetails';
    const parameters = {
      // strCustomerId: "84"
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  // GetModelPortfolio() {
  //   const webMethod = this.interfaceUrl + 'GetModelPortfolio'
  //   const parameters = {
  //     CustomerID:"84"
  //   };
  //   return this.http.post<any>(webMethod, parameters, {
  //     headers: this.headerOptions
  //   });
  // }

  GetRiskProfileDetails() {
    const webMethod =
      this.interfaceUrl + 'GetRiskProfileDetails_RiskDescription';
    const parameters = {};
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  // GetCustomerRiskRating() {
  //   const webMethod = this.interfaceUrl + 'GetCustomerRiskRating'
  //   const parameters = {
  //     RiskProfile: "Balanced"

  //   };
  //   return this.http.post<any>(webMethod, parameters, {
  //     headers: this.headerOptions
  //   });
  // }

  // GetCustomerInfo() {
  //   const webMethod = this.interfaceUrl + 'GetCustomerInfo'
  //   const parameters = {
  //     CustID : "84"

  //   };
  //   return this.http.post<any>(webMethod, parameters, {
  //     headers: this.headerOptions
  //   });
  // }

  SaveProposalDetails(objProposalDetails, UserId, EntityId) {
    const webMethod = this.interfaceUrl + 'SaveProposalDetails';
    const parameters = {
      objProposalDetails: objProposalDetails,
      UserId: UserId,
      EntityId: EntityId,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetProposalNames() {
    const webMethod = this.interfaceUrl + 'GetProposalNames';
    const parameters = {};
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetProposalDetails(ProposalName) {
    const webMethod = this.interfaceUrl + 'GetProposalDetails';
    const parameters = {
      ProposalName: ProposalName,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetLoginRMMappedCustomer(username, entityID) {
    const webMethod = this.interfaceUrl + 'GetLoginRMMappedCustomer';
    const parameters = {
      Login: username,
      entityID: entityID,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetTemplateDetails() {
    const webMethod = this.interfaceUrl + 'GetTemplateDetails';
    const parameters = {};
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  Get_Private_Proposal_Customer_Details(Customerid) {
    const webMethod =
      this.interfaceUrl + 'Get_Private_Proposal_Customer_Details';
    const parameters = {
      CustomerId: Customerid,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  DB_Get_SchemeCode() {
    const webMethod = this.interfaceUrl + 'DB_Get_SchemeCode';
    const parameters = {};
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  BOProcessing_CommonData(tempCode) {
    const webMethod = this.interfaceUrl + 'BOProcessing_CommonData';
    const parameters = {
      template_code: tempCode,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetRecommendedProductList(TemplateCode, SubTemplate, Category) {
    const webMethod = this.interfaceUrl + 'GetRecommendedProductList';
    const parameters = {
      TemplateCode: TemplateCode,
      SubTemplate: SubTemplate,
      Category: Category,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetProductList() {
    const webMethod = this.interfaceUrl + 'GetProductList';
    const parameters = {};
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  DB_Get_GridData(ProposalId) {
    const webMethod = this.interfaceUrl + 'DB_Get_GridData';
    const parameters = {
      ProposalId: ProposalId,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetNextValue(sTable, sField) {
    const webMethod = this.interfaceUrl + 'GetNextValue';
    const parameters = {
      sTable: sTable,
      sField: sField,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetBenchmarkMasterData() {
    const webMethod = this.interfaceUrl + 'GetBenchmarkMasterData';
    // const parameters = {
    // };
    return this.http.get<any>(webMethod);
  }

  GetChartData(CIF, RiskProfile, investmentObj) {
    const webMethod = this.interfaceUrl + 'GetChartData';
    const parameters = {
      CIFNO: CIF,
      benchmark: RiskProfile,
      investmentobjective: investmentObj,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetPortfoliosFromCusID(CustId, Ccy) {
    console.log(CustId, Ccy);
    const webMethod = this.interfaceUrl + 'GetPortfoliosFromCusID';
    const parameters = {
      CustId: CustId,
      Currency: Ccy,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetTemplateList(riskprofile, invobjective) {
    const webMethod = this.interfaceUrl + 'GetTemplateList';
    const parameters = {
      riskprofile: riskprofile,
      invobjective: invobjective,
    };
    console.log('In cust');
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  //Added by Arsh P || JIRA ID: STANHCINT-506 ||End
  async GetRMIDFromUsername(username) {
    try {
      const webMethod = this.interfaceUrl + 'GetRMIDFromUsername';
      const parameters = {
        username,
      };
      const RMID = await this.http
        .post<any>(webMethod, parameters, {
          headers: this.headerOptions,
        })
        .toPromise()
        .then((res) => {
          return res.ExecGenericScalarFunctionResult;
        });
      return RMID;
    } catch (error) { }
  }
  //Added bY Uddesh on 1Feb 2022 asked by Mohan P
  async AddSharetoWatchListForAll(
    loginId,
    wlname,
    newwlname,
    nmid,
    custID,
    type
  ) {
    try {
      const webMethod = this.interfaceUrl + 'AddSharetoWatchListForAll';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: loginId || sessionStorage.getItem('Username'),
        WatchListName: wlname,
        NewWatchListName: newwlname,
        NoteMasterID: nmid,
        CustomerID: custID,
        EntityID: this.auth.EntityID,
        Type: type,
      };
      return this.http.post<any>(webMethod, params).toPromise();
    } catch (ex) {
      console.log(
        'Error occured in AddSharetoWatchListForAll api function as :',
        ex
      );
    }
  }
  async GetWatchListDataForAll(loginId, custId, wlName) {
    try {
      const webMethod = this.interfaceUrl + 'GetWatchListDataForAll';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: loginId || sessionStorage.getItem('Username'),
        WatchListName: wlName,
        CustomerID: custId,
        EntityID: this.auth.EntityID,
      };
      return this.http.post<any>(webMethod, params).toPromise();
    } catch (ex) {
      console.log(
        'Error occured in GetWatchListDataForAll api function as :',
        ex
      );
    }
  }
  async DeleteShareFromWatchListForAll(wlname, nmid, custID, type) {
    try {
      const webMethod = this.interfaceUrl + 'DeleteShareFromWatchListForAll';
      const params = {
        EntityCode: this.auth.EntityCode,
        LoginID: sessionStorage.getItem('Username'),
        WatchListName: wlname,
        NoteMasterID: nmid,
        CustomerID: custID,
        EntityID: this.auth.EntityID,
        Type: type,
      };
      console.log('delete param', params);
      return this.http.post<any>(webMethod, params).toPromise();
    } catch (ex) {
      console.log(
        'Error occured in DeleteShareFromWatchList api function as :',
        ex
      );
    }
  }
  //Added by Arsh P for Place Order popup || Start ||28-FEB-2022
  getPlaceOrderSecurities(StoredProcedureName, ParamList) {
    const webMethod = this.interfaceUrl + 'getPlaceOrderSecurities';
    const parameters = {
      StoredProcedureName: StoredProcedureName,
      ParamList: ParamList,
    };
    console.log('PLACE ORDER');
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  getCustomerPortfolios(StoredProcedureName, ParamList) {
    const webMethod = this.interfaceUrl + 'getCustomerPortfolios';
    const parameters = {
      StoredProcedureName: StoredProcedureName,
      ParamList: ParamList,
    };
    // console.log('Portfolios');
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  //Added by Arsh P for What if || Start || 25-07-2022
  GetTemplateIDFromNMID(notemasterid) {
    const webMethod = this.interfaceUrl + 'GetTemplateIDFromNMID';
    const parameters = {
      NoteMasterID: notemasterid
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetScheduleCSV(notemasterid, templateid) {
    const webMethod = this.interfaceUrl + 'GetScheduleCSV';
    const parameters = {
      NoteMasterID: notemasterid,
      TemplateID: templateid
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetMaxScenarioNo(notemasterid) {
    const webMethod = this.interfaceUrl + 'GetMaxScenarioNo';
    const parameters = {
      sNoteMasterID: notemasterid,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  async GetRecords(notemasterid, scenariono, userid) {
    const webMethod = this.interfaceUrl + 'GetRecords';
    const parameters = {
      strNoteMasterId: notemasterid,
      sScenarioNo: scenariono,
      UserID: userid
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    }).toPromise();
  }

  GetRecords_Low(notemasterid, scenariono) {
    const webMethod = this.interfaceUrl + 'GetRecords_Low';
    const parameters = {
      sNoteMasterID: notemasterid,
      sScenarioNo: scenariono,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetRecords_High(notemasterid, scenariono) {
    const webMethod = this.interfaceUrl + 'GetRecords_High';
    const parameters = {
      sNoteMasterID: notemasterid,
      sScenarioNo: scenariono,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetKIKOValues(notemasterid, absolutespot) {
    const webMethod = AppConfig.settings.apiBaseUrl + 'pdt/GetKIKOValues';
    const parameters = {
      "note_Master_ID": notemasterid,
      "absoluteSpot": absolutespot,
    };
    return this.http.post<any>(webMethod, parameters);
  }

  async GetTemplateCode(templateid): Promise<any> {
    const webMethod = this.interfaceUrl + 'GetTemplateCode';
    const parameters = {
      strTemplateID: templateid
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    }).toPromise();
  }

  GetWhatIfCSV(templateid) {
    const webMethod = this.interfaceUrl + 'GetWhatIfCSV';
    const parameters = {
      sTemplateID: templateid
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetInitialSpots(notemasterid, templatecode, templatedatacsv) {
    const webMethod = this.interfaceUrl + 'GetInitialSpots';
    const parameters = {
      noteMasterID: notemasterid,
      templateCode: templatecode,
      templateDataCSV: templatedatacsv
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetShareNameList(notemasterid) {
    const webMethod = this.interfaceUrl + 'GetShareNameList';
    const parameters = {
      strNoteMasterId: notemasterid
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetAbsKO(notemasterid) {
    const webMethod = this.interfaceUrl + 'GetAbsKO';
    const parameters = {
      strNoteMasterId: notemasterid
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetTenor(notemasterid) {
    const webMethod = this.interfaceUrl + 'WhatIfGetTenor';
    const parameters = {
      strNoteMasterId: notemasterid
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetVolListForWhatIf(notemasterid, templatedatacsv, templatecode) {
    const webMethod = this.interfaceUrl + 'GetVolListForWhatIf';
    const parameters = {
      noteMasterId: notemasterid,
      templateCSV: templatedatacsv,
      templateCode: templatecode
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  GetWhatIfAnalysis(noteMasterId, HighLow, templateCode, scenarioDetails, distt, Amplitude, scenario_no, handInputPath, midLifeDate, templateDataCSV, startDay, EntityID, AbsoluteSpot, SpotSim, RFQTradeMode, UserID) {
    const webMethod = this.interfaceUrl + 'GetWhatIfAnalysis';
    const parameters = {
      noteMasterId: noteMasterId,
      HighLow: HighLow,
      templateCode: templateCode,
      scenarioDetails: scenarioDetails,
      distt: distt,
      Amplitude: Amplitude,
      scenario_no: scenario_no,
      handInputPath: handInputPath,
      midLifeDate: midLifeDate,
      templateDataCSV: templateDataCSV,
      startDay: startDay,
      EntityID: EntityID,
      AbsoluteSpot: AbsoluteSpot,
      SpotSim: SpotSim,
      RFQTradeMode: RFQTradeMode,
      UserID: UserID

    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //Added by Arsh P for What if || End || 25-07-2022


  //Added by Alolika G for event diary --START

  ReadAllProductAllEvent(
    ProductName: any,
    SchemeCode: any,
    EventName: any,
    EntityID: any,
    FromDate: any,
    ToDate: any,
    ProductID: any,
    strSelectedEventName: any,
    Frequency: any,
    CboDailyValue: any,
    CboDealValue: any,
    Processed: any,
    strEventgrouping: any,
    chkLauchedProdState: any,
    EventNameActual: any,
    cboShowEvents: any,
    cboIssuer: any,
    sendEmail: any,
    cboTemplate: any,
    Str_Event_Group_Name: any,
    cboRM: any,
    cboCustid: any,
    ViewBy: any,
    FacDesc: any,
    oEventList: any,
    oGroupEvent: any
  ) {
    try {
      const webMethod = this.interfaceUrl + 'ReadAllProductAllEvent';
      // console.log(webMethod);
      const parameters = {
        ProductName,
        SchemeCode,
        EventName,
        EntityID,
        FromDate,
        ToDate,
        ProductID,
        strSelectedEventName,
        Frequency,
        CboDailyValue,
        CboDealValue,
        Processed,
        strEventgrouping,
        chkLauchedProdState,
        EventNameActual,
        cboShowEvents,
        cboIssuer,
        sendEmail,
        cboTemplate,
        Str_Event_Group_Name,
        cboRM,
        cboCustid,
        ViewBy,
        FacDesc,
        oEventList,
        oGroupEvent
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      // console.error(error);
    }
  }
  //Added by Alolika G for event diary --END

  GetEventCode(
    SchemeName: any,
    EntityId: any,
    strEventgrouping: any
  ) {
    try {
      const webMethod = this.interfaceUrl + 'GetEventCode';
      // console.log(webMethod);
      const parameters = {
        SchemeName,
        EntityId,
        strEventgrouping
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      // console.error(error);
    }
  }

  GET_EventName(
    strTEMName: any
  ) {
    try {
      const webMethod = this.interfaceUrl + 'GET_EventName';
      // console.log(webMethod);
      const parameters = {
        strTEMName
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      // console.error(error);
    }
  }
}
