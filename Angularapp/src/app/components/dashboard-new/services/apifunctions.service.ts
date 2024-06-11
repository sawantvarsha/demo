import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';

import { CommonfunctionsService } from './commonfunctions.service';
import { AppConfig } from 'src/app/services/config.service';


declare var require: any;
const $: any = require('jquery');

// declare var require: any;
@Injectable(
)
export class ApifunctionsService {

  constructor(private http: HttpClient) { }

  public refreshPreQuoteFlag = new BehaviorSubject({});
  refreshPreQuoteFlagObs = this.refreshPreQuoteFlag.asObservable();
  public closeLaunchProduct = new BehaviorSubject(false);
  closeLaunchProductObs = this.closeLaunchProduct.asObservable();
  public showPricerScreeninViewModePopup = new BehaviorSubject(false);
  showPricerScreeninViewModePopupObs = this.showPricerScreeninViewModePopup.asObservable();
  public prevQuoteLaunchPopUpRMW = new BehaviorSubject([false, false]);
  prevQuoteLaunchPopUpRMWObs = this.prevQuoteLaunchPopUpRMW.asObservable();
  public prevQuoteOrderPopUp = new BehaviorSubject(false);
  prevQuoteOrderPopUpObs = this.prevQuoteOrderPopUp.asObservable();

  SendOrderToCpty(_NoteMasterID: any, _rfq: any, _TokenIdReprice: any, _arg3: string) {
    throw new Error('Method not implemented.');
  }
  BBVADeletePortfolio(PortFolioID: any, Type: any) {
    try {
      this.UserID = (this.commonfunctions.getLoggedInUserName());
      const webMethod = this.interfaceUrl + 'DeletePortfolio';
      const parameters = {
        PortFolioID,
        Type,
        UserID: this.UserID,
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          that.result = data.Delete_PortfolioResult;
        },
        error(__error: any) {
        }
      });
      return this.result;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  quoteEmail(_rfq: any) {
    throw new Error('Method not implemented.');
  }

  RedirectOrderValidationChecks(_arg0: string, _txtOrderType: any, _txtlimitLevel: any, _txtClietYield: any, _arg4: number, _SolveForvalue: any, _Issuer: any, _issuePrice: any, _arg8: string, _arg9: any, _Notional: any, _arg11: any, _ddlNoteCcy: any, _ddlNoteCcy1: any, _expshift: any) {
    throw new Error('Method not implemented.');
  }

  bookOrder(_selectedBookingBranch: any, _arg1: any, _OrderType: any, _selectedRFQ: any, _arg4: string, _arg5: any) {
    throw new Error('Method not implemented.');
  }
  async SchedulePrice(productVariation: any, productXML: any, scheduleTime: any,
    Source: any, GroupingID: any, TimeOffsetInSecs: any, PPCode: any, SolveFor: any, userGroupID: any, SubProductCode: any, Frequency: any, Type: any, Exchange: any) {
    try {
      let res: any;
      const webMethod = AppConfig.settings.oRes + 'eqd/Order/insertProductSchedule';
      const parameters = {
        productVariation,
        productXML,
        scheduleTime,
        UserID: AppConfig.settings.oRes.userID,
        Source,
        GroupingID,
        TimeOffsetInSecs,
        PPCode,
        EntityID: AppConfig.settings.oRes.homeEntityID,
        SolveFor,
        UserGroupID: userGroupID, //(this.commonfunctions.getLoggedInUserName())[2].UserGroupId
        SubProductCode,
        Frequency,
        Type,
        Exchange
      };
      // const that = this;
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
      //   success(data: any) {
      //     res = data;
      //     return res;
      //   },
      //   error(__error: any) {

      //   }
      // });
      // return res;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {res = data;
        return res;
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  // START : Add to watchlist api call
  AddToWatchlist(ProductVariation: any, ProductXML: any, ScheduleTime: any,
    Source: any, GroupingID: any, TimeOffsetInSecs: any, PPCode: any, SolveFor: any, userGroupID: any, SubProductCode: any, Frequency: any, Type: any, Exchange: any,
    ProductWatchYN: any, TargetValue: any, Direction: any, ExpiryDate: any, TargetHitYN: any, LastResult: any) {
    try {
      let res: any;
      const webMethod = this.interfaceUrl + 'AddProductInWatchlist';
      const parameters = {
        ProductVariation,
        ProductXML,
        ScheduleTime,
        UserID: AppConfig.settings.oRes.userID,
        Source,
        GroupingID,
        TimeOffsetInSecs,
        PPCode,
        EntityID: AppConfig.settings.oRes.homeEntityID,
        SolveFor,
        UserGroupID: userGroupID, //(this.commonfunctions.getLoggedInUserName())[2].UserGroupId
        SubProductCode,
        Frequency,
        Type,
        Exchange,
        ProductWatchYN,
        TargetValue,
        Direction,
        ExpiryDate,
        TargetHitYN,
        LastResult
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          res = data.AddProductInWatchlistResult;
          return res;
        },
        error(_error: any) {
        }
      });
      return res;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // END: Add to watchlist api

  async GetTriggerValues(Tenor: any, Frequency: any, Trigger: any, StepDown: any, NonCall: any, StepdownFrequency: any,
    AutocallTriggerFloor: any, AirbagYN: any, BarrierLevel: any) {
    try {
      let TriggerValues: any = [];
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetTriggerValues';
      const parameters = {
        Tenor,
        Frequency,
        Trigger,
        StepDown,
        NonCall,
        StepdownFrequency,
        AutocallTriggerFloor,
        AirbagYN,
        BarrierLevel
      };

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
      //   success(data: any) {
      //     TriggerValues = data;
      //   },
      //   error(__error: any) {
      //   }
      // });
      // return TriggerValues;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        TriggerValues = data;
        return TriggerValues;
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  async ViewTermsheet(NoteMasterID: any) {
    try {
      let blobstr: any = [];
      const webMethod = this.interfaceUrl + 'eqd/Document/ViewTermsheet';
      const parameters = {
        DealNo: NoteMasterID
      };
      // const that = this;
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
      //   success(data: any) {
      //     blobstr = (data.GetAttachedDocumentsResult[0]);
      //   },
      //   error(__error: any) {
      //   }
      // });
      // return blobstr;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        blobstr = data;
        return blobstr;
      });
    } catch (error) {
      return null;
      console.log(error);
    }
  }
  termsheetSender(bbvaID: any, userGroupID: any, productCode: any, subTemplateCode: any) {
    try {
      const userGroupID1 = (this.commonfunctions.getLoggedInUserName())[2].UserGroupId;
      const webMethod = this.interfaceUrl + 'RequestTermsheet';
      const parameters = {
        bbvaID,
        productCode,
        subTemplateCode,
        userGroupID
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          // console.log(data);
          that.result = data.errorMsg;
        },
        error(__error: any) {
        }
      });
      return this.result;
    } catch (error) {
      return null;
      console.log('Error:', error);
    }
  }
  async reofferValidation(IssuePrice: any, ReofferPrice: any, ProductType: any, WrapperType: any) {
    try {
      this.UserID = AppConfig.settings.oRes.userID;
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/ValidateReOfferPrice';
      const parameters = {
        IssuePrice: IssuePrice === '' ? '0' : IssuePrice,
        ReOfferPrice: ReofferPrice === '' ? '0' : ReofferPrice,
        ProductType,
        WrapperType,
        EntityId: AppConfig.settings.oRes.homeEntityID
      };
      // const that = this;
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
      //   success(data: any) {
      //     that.result = data.ValidateReOfferPriceResult;
      //   },
      //   error(__error: any) {
      //   }
      // });
      // return this.result;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.result = data;
        return this.result;
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }
  noncallValidation(NonCallValue: any, TenorExpiryDate: any, frequency: any) {
    try {
      this.UserID = (this.commonfunctions.getLoggedInUserName());
      const webMethod = this.interfaceUrl + 'noncallValidation';
      const parameters = {
        NonCallValue,
        TenorExpiryDate,
        frequency,
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          that.result = data.ValidateNonCallValueResult;
        },
        error(__error: any) {
        }
      });
      return this.result;
    } catch (error) {
    }
  }
  async BBVACheckNotional(Product: any, Ccy: any) {
    try {

      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/FetchProductCurrencyMinMaxLimits';
      const parameters = {
        Product,
        Ccy
      };
      // const that = this;
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
      //   success(data: any) {

      //     that.result = data.FetchProductCurrencyMinMaxLimitsResult;
      //   },
      //   error(__error: any) {

      //   }
      // });
      // return this.result;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.result = data;
        return this.result;
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }
  async BBVASaveQuotes(Mode: any, strXml: any, PortFolioName: any, PortfolioID: any, Type: any, Owner: any) {
    try {
      this.UserID = AppConfig.settings.oRes.userID;
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Portfolio/InsertPortfolio';
      const parameters = {
        PortfolioID,
        PortFolioName,
        Mode,
        strXml,
        UserID: this.UserID,
        Type,
        Owner
      };
      // const that = this;
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
      //   success(data: any) {

      //     that.result = data;
      //   },
      //   error(__error: any) {
      //   }
      // });


      // return this.result;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.result = data;
        return this.result;
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }
  async fnportfolioGroupID() {
    try {
      this.UserID = AppConfig.settings.oRes.userID;
      const RFQTimeFlag = [];
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/getLatestGroupID';
      const parameters = {
        MsgSource: 'ANGULAR_WEB',
        UserID: this.UserID
      };
      // const that = this;
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
      //   success(data: any) {
      //     // console.log(data);
      //     that.result = data.getLatestGroupIDResult;
      //   },
      //   error(__error: any) {
      //   }
      // });
      // return this.result;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.result = data;
        return this.result;
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }
  async getRedirectionData(portfolioID: any) {
    try {
      let webMethod;
      webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Portfolio/GetPortfolio';
      let portfolioData;
      this.UserID = AppConfig.settings.oRes.userID;
      const parameters = {
        UserID: this.UserID,
        PortFolioID: portfolioID
      };
      // const that = this;
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
      //   success(data: any) {
      //     portfolioData = data.Get_PortfolioResult;
      //   },
      //   error(__error: any) {
      //   }
      // });
      // return portfolioData;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        portfolioData = data;
        return portfolioData;
      });
    } catch (error) {
      return;
    }
  }
  async getPreviousQuoteCloneData(ID: any, parameterName: any) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Clone/GetRFQDataForClone';
      let cloneData: any;
      this.UserID = AppConfig.settings.oRes.userID;
      const parameters = {
        RFQID: parameterName === 'RFQID' ? ID : '',
        NoteMasterID: parameterName === 'NoteMasterID' ? ID : '',
        BBVAID: parameterName === 'BBVAID' ? ID : '',
        PS_ID: parameterName === 'PS_ID' ? ID : '',
        Flag: parameterName === 'PS_ID' ? 'S' : 'P',
        LoginID: this.UserID
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
      //   success(data: any) {
      //     // if(parameterName !== 'PS_ID'){
        return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
          //debugger
          // console.log(data);
          if (data.GetRFQDataForCloneResult[0]) {
            const parseString = require('xml2js').parseString;
            // tslint:disable-next-line: only-arrow-functions
            // console.log(data.GetRFQDataForCloneResult[0]);
            parseString(data.GetRFQDataForCloneResult[0].RFQDetailsXML, function (_err: any, result: any) {
              // console.log(result);

              if (parameterName === 'PS_ID') {
                cloneData = result.QuoteRequest;
              }
              else {
                cloneData = result.RFQDetails.RFQ[0];
              }

            });

            // console.log(cloneData);
            that.RFQDetails = {
              TemplateCode: data.GetRFQDataForCloneResult[0].TemplateCode,
              SubTemplateCode: data.GetRFQDataForCloneResult[0].SubTemplateCode, cloneData
            };

            // console.log(that.RFQDetails);
          }
          return this.shares;
          // }
      //   },
      //   error(__error: any) {
      //   }
      // });
      // return that.RFQDetails;
    }); 
    } catch (error) {
      console.log('Error:', error);
      return '';
    }
  }
  GetPriceProviderDetails(_arg0: string) {
    throw new Error('Method not implemented.');
  }
  async GetMappedUsersAndGroups() {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetMappedUsersAndGroups';
      let allMappedData: any = [];
      const parameters = {
        UserID: AppConfig.settings.oRes.userID
      };
      // const that = this;
      // const response = '';
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
      //   success(data: any) {
      //     that.MappedUsersAndGroupsArr = data.getMappedUsersAndGroupsResult;
      //     return that.MappedUsersAndGroupsArr;
      //   },
      //   error(__error: any) {
      //   }
      // });
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        allMappedData = data.getMappedUsersAndGroupsResult;
        return allMappedData;
      });
    } catch (error) {
      
    }
  }
  async BBVAGetDates(ccy: any, tenorCode: any, tradeDate: any) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Dates/GetUSDBasedDates';
      const parameters = {
        ccy,
        tenorCode,
        TradeDate: tradeDate,
        EntityId: AppConfig.settings.oRes.homeEntityID,
      };
      // const that = this;
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
      //   success(data: any) {
      //     that.Dates = data.Get_USDBasedDatesResult;
      //     return that.Dates;
      //   },
      //   error(__error: any) {
      //   }
      // });
      // return this.Dates;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.Dates = data;
        return this.Dates;
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }
  FetchDefaultValues(_template: any): never[] {
    throw new Error('Method not implemented.');
  }
  GetCommonDataEuroConnect(_template: any): never[] {
    throw new Error('Method not implemented.');
  }
  getCustomerList(): never[] {
    throw new Error('Method not implemented.');
  }
  GetBookingCenter(): never[] {
    throw new Error('Method not implemented.');
  }
  BookingCenter: any;
  Get_RMList() {
    throw new Error('Method not implemented.');
  }
  rmList: any;
  getPayOffList() {
    throw new Error('Method not implemented.');
  }
  payOffList: any;
  // }
  async BBVAFetchValidation(ProductType: any) {
    try {
      let validationArr: any = [];
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/FetchValidation';
      const parameters = {
        ProductType,
        entityID: AppConfig.settings.oRes.homeEntityID,
        productName:''
      };
      // const that = this;
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
      //   success(data: any) {
      //     validationArr = data.FetchValidationResult;
      //   },
      //   error(__error: any) {
      //   }
      // });

      // this.validationArr = validationArr;
      // return this.validationArr;
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        //debugger
        validationArr = data;
        this.validationArr = validationArr;
        return this.validationArr;
       });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  async fetchValidationOnLogin(product: any, entityID: any) {
    try {
      let validationArr: any = [];
      const webMethod = this.interfaceUrl + 'FetchValidation';
      const parameters = {
        ProductType: product,
        EntityId: entityID
      };
      // const that = this;
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
      //   success(data: any) {
      //     validationArr = data.FetchValidationResult;
      //   },
      //   error(_error: any) {
      //   }
      // });
      // this.validationArr = validationArr;
      // return this.validationArr;
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        //debugger
        validationArr = data;
        this.validationArr = validationArr;
        return this.validationArr;
       });
    } catch (error) {
      console.log('Error:', error);
    }
  }
  async BBVALoadCCY() {
    try {
      // const webMethod = this.interfaceUrl + 'BBVAGetCCY';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetCcyList';
      
      // const that = this;
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
      //   success(data: any) {
      //     that.CCY = data.Get_CcyList_JSONResult;
      //     return that.CCY;
      //   },
      //   error(__error: any) {
      //   }
      // });

      // return this.CCY;
      return await this.http.get(webMethod).toPromise().then((data: any) => {    
        this.CCY = data;
        return this.CCY;
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }
  async BBVALoadShares(marketType: any) {
    try {
      let shares: any = [];
      // const webMethod = this.interfaceUrl + 'BBVAGetShares';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetAllShareDetails';
      const parameters = {
        MarketType: marketType
      };
      // const that = this;
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
      //   success(data: any) {
      //     shares = data.Get_All_Share_Details_JsonResult;
      //   },
      //   error(__error: any) {

      //   }
      // });
      // this.shares = shares;
      // return this.shares;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {    
        shares = data.Get_All_Share_Details_JsonResult;
        return shares;
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }
  async getAllBooksMappedToLogin() {
    try {
      // const webMethod = this.interfaceUrl + 'GetAllBooksMappedToLogin';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetAllMappedBooks';
      let allBooksData: any = [];
      // this.UserID = (this.commonfunctions.getLoggedInUserName());
      const parameters = {
        LoginId: AppConfig.settings.oRes.userID,
      };

      // const that = this;
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
      //   success(data: any) {
      //     allBooksData = data.GetAllBooksMappedToLoginResult;
      //   },
      //   error(__error: any) {
      //   }
      // });
      // that.allBooksData = allBooksData;
      // return allBooksData;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {    
        allBooksData = data;
        return allBooksData;
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }
  //Last modified by Apurva K|| 03-May-2023
  async BBVAGetPortfolioDashboard(Type: any) {
    try {
     // this.UserID = (this.commonfunctions.getLoggedInUserName());
      const webMethod = this.interfaceUrl + 'eqd/Portfolio/GetPortfolioForAllDealsFlexiPricer';
      const parameters = {
        UserID: AppConfig.settings.oRes.userID,
        Type,
        Mode:"FlexiPricer"
      };
      // const that = this;
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
      //   success(data: any) {
      //     that.result = data.Get_Portfolio_ForAllDeals_FlexiPricerResult;
      //   },
      //   error(__error: any) {
      //   }
      // });
      // return this.result;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {    
        this.result = data;
        return this.result;
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  checkLoginBookName(): boolean {
    throw new Error('Method not implemented.');
  }

  public CCY: any = [];
  public shares: any = [];
  public indexTrancheArr: any = [];
  public floatingRefArr: any = [];
  public validationArr: any = [];
  public RFQTimeFlag: any;

  Dates: any;
  productChartData: any[] | undefined;

  public priceFlag = new BehaviorSubject(false);
  priceFlagCheck = this.priceFlag.asObservable();

  public errorFlag = new BehaviorSubject(false);
  showerrormsg = this.errorFlag.asObservable();

  public rcPriceFlag = new BehaviorSubject(false);
  rcpriceFlagCheck = this.rcPriceFlag.asObservable();

  public creditFlag = new BehaviorSubject(false);
  creditpriceFlagCheck = this.creditFlag.asObservable();

  // New observable added by Pranav D for CLN 
  public creditLinkNoteFlag = new BehaviorSubject(false);
  creditLinkNoteFlagpriceFlagCheck = this.creditLinkNoteFlag.asObservable();

  public saveFlag = new BehaviorSubject(false);
  saveFlagCheck = this.saveFlag.asObservable();

  public rcsaveFlag = new BehaviorSubject(false);
  rcsaveFlagCheck = this.rcsaveFlag.asObservable();

  public creditSaveFlag = new BehaviorSubject(false);
  creditSaveFlagCheck = this.creditSaveFlag.asObservable();
  // changes by Suvarna P || 10May2022 ||  CLN saved portfolio issue reported by Abeer || assigned by Pranav D
  // public CLNSaveFlag = new BehaviorSubject(false);
  // CLNSaveFlagCheck = this.CLNSaveFlag.asObservable();

  public validationFlag = new BehaviorSubject(false);
  validationFlagCheck = this.validationFlag.asObservable();

  public loadFlag = new BehaviorSubject(false);
  LoadFlagCheck = this.loadFlag.asObservable();

  public rcloadFlag = new BehaviorSubject(false);
  RCLoadFlagCheck = this.rcloadFlag.asObservable();

  public creditloadFlag = new BehaviorSubject(false);
  CreditLoadFlagCheck = this.creditloadFlag.asObservable();

  // New observable added by Pranav D for CLN 
  public CLNloadFlag = new BehaviorSubject(false);
  CLNLoadFlagCheck = this.CLNloadFlag.asObservable();

  public generateXmlObserver = new BehaviorSubject('');
  generateXml = this.generateXmlObserver.asObservable();

  public cloneFlag = new BehaviorSubject(false);
  cloneFlagCheck = this.cloneFlag.asObservable();

  public cloneFlag1 = new BehaviorSubject(false);
  cloneFlag1Obs = this.cloneFlag1.asObservable();

  public cloneData1 = new BehaviorSubject('');
  cloneData1Obs = this.cloneData1.asObservable();

  public multiPhoenixArr = new BehaviorSubject(0);
  multiPhoenixArrObserver = this.multiPhoenixArr.asObservable();

  // New observable added by Pranav D for CLN 
  public multiCLNArr = new BehaviorSubject(0);
  multiCLNObserver = this.multiCLNArr.asObservable();

  /////////// Participatiom Observers

  public ptcloadFlag = new BehaviorSubject(false);
  PTCLoadFlagCheck = this.ptcloadFlag.asObservable();
  interfaceUrl = environment.interfaceURL;

  public ptcsaveFlag = new BehaviorSubject(false);
  ptcsaveFlagCheck = this.ptcsaveFlag.asObservable();

  public ptcPriceFlag = new BehaviorSubject(false);
  ptcpriceFlagCheck = this.ptcPriceFlag.asObservable();


  /////////// DRA Observers

  public draloadFlag = new BehaviorSubject(false);
  draLoadFlagCheck = this.draloadFlag.asObservable();

  public drasaveFlag = new BehaviorSubject(false);
  drasaveFlagCheck = this.drasaveFlag.asObservable();

  public draPriceFlag = new BehaviorSubject(false);
  drapriceFlagCheck = this.draPriceFlag.asObservable();

  /////////// Dual FI Autocall Observers

  public dualFIAutocallLoadFlag = new BehaviorSubject(false);
  dualFIAutocallLoadFlagCheck = this.dualFIAutocallLoadFlag.asObservable();

  public dualFIAutocallSaveFlag = new BehaviorSubject(false);
  dualFIAutocallSaveFlagCheck = this.dualFIAutocallSaveFlag.asObservable();

  public dualFIAutocallPriceFlag = new BehaviorSubject(false);
  dualFIAutocallPriceFlagCheck = this.dualFIAutocallPriceFlag.asObservable();

  /////////// Dual FI RC Observers

  public dualFIRCLoadFlag = new BehaviorSubject(false);
  dualFIRCLoadFlagCheck = this.dualFIRCLoadFlag.asObservable();

  public dualFIRCSaveFlag = new BehaviorSubject(false);
  dualFIRCSaveFlagCheck = this.dualFIRCSaveFlag.asObservable();

  public dualFIRCPriceFlag = new BehaviorSubject(false);
  dualFIRCPriceFlagCheck = this.dualFIRCPriceFlag.asObservable();

  /////////// Dual FI DRA Observers

  public dualFIDRALoadFlag = new BehaviorSubject(false);
  dualFIDRALoadFlagCheck = this.dualFIDRALoadFlag.asObservable();

  public dualFIDRASaveFlag = new BehaviorSubject(false);
  dualFIDRASaveFlagCheck = this.dualFIDRASaveFlag.asObservable();

  public dualFIDRAPriceFlag = new BehaviorSubject(false);
  dualFIDRAPriceFlagCheck = this.dualFIDRAPriceFlag.asObservable();

  // toggle observers

  public toggleFlag = new BehaviorSubject(false);
  toggleFlagObs = this.toggleFlag.asObservable();

  public toggleData = new BehaviorSubject('');
  toggleDataObs = this.toggleData.asObservable();

  public toggleVisiblityFlag = new BehaviorSubject<any>('');
  toggleVisiblityFlagObs = this.toggleVisiblityFlag.asObservable();

  public resetflagonbehalf = new BehaviorSubject(false);
  resetflagonbehalfobs = this.resetflagonbehalf.asObservable();

  result: any;
  UserID: any;

  public schedulePriceFlag = new BehaviorSubject({});
  schedulePriceFlagCheck = this.schedulePriceFlag.asObservable();

  public schedulePopupFlag = new BehaviorSubject(false);
  schedulePopupFlagObs = this.schedulePopupFlag.asObservable();



  // BBVA workflow blotter details
  // <Suvarna(03-Dec-2019) || Workflow for RFQ blotter || start>
  GetWFBlotterPHXSF = new BehaviorSubject({});
  GetWFBlotterPHXSFObserver = this.GetWFBlotterPHXSF.asObservable();
  GetWFBlotterRCSF = new BehaviorSubject({});
  GetWFBlotterRCSFObserver = this.GetWFBlotterRCSF.asObservable();

  // GetWFBlotterBRCSF = new BehaviorSubject({});
  // GetWFBlotterBRCSFObserver = this.GetWFBlotterBRCSF.asObservable();

  GetWFBlotterCTSF = new BehaviorSubject({});
  GetWFBlotterCTSFObserver = this.GetWFBlotterCTSF.asObservable();

  GetWFBlotterPTCSF = new BehaviorSubject({});
  GetWFBlotterPTCSFObserver = this.GetWFBlotterPTCSF.asObservable();

  GetWFBlotterDRASF = new BehaviorSubject({});
  GetWFBlotterDRASFObserver = this.GetWFBlotterDRASF.asObservable();


  attachDetachCalculationsSF = new BehaviorSubject({});
  attachDetachCalculationsObserver = this.attachDetachCalculationsSF.asObservable();
  // /<Suvarna(13-Jan-2020) ||saved Request || end>


  //////  Attach Detach Percent Calculations || Suvarna Start 14Jan2020
  getAttachPercentSF = new BehaviorSubject({});
  getAttachPercentObserver = this.getAttachPercentSF.asObservable();
  getDetachchPercentSF = new BehaviorSubject({});
  getDetachchPercentObserver = this.getDetachchPercentSF.asObservable();
  //////  Attach Detach Percent Calculations || Suvarna End 14Jan2020


  //// GetRFQDataForCloneEQ Suvarna start || 14-Jan-2020

  // checkforAllPrice flag for multipricer - added by Priya L. on 07Jan2022
  public checkforAllPriceFlag = new BehaviorSubject(true);
  checkforAllPriceFlagObs = this.checkforAllPriceFlag.asObservable();

  RFQDetails = {};
  userGroupID = '';
  userGroup = '';

  allBooksData = [];
  allMappedData = [];
  portfolioGroupID = '';

  public sidebarCounter = new BehaviorSubject(0);
  sidebarCounterObserver = this.sidebarCounter.asObservable();

  RMWProductDetails: any;
  likeProductFlag: any;
  unlikeProductFlag: any;
  folders: any;
  saveproducttofolderresp: any;
  productattachmentlist: any;
  MappedUsersAndGroupsArr: any;
  getSharedPortfolioAccessList: any;
  GetClientProdDetailsArr: any;
  ManualFlagArr: any = [];
  BlacklistedFlagArr: any = [];
  commonfunctions: CommonfunctionsService = new CommonfunctionsService();


  async getNewsConfig() {
    let result = {};
    try {
      const webMethod = this.interfaceUrl + 'getnewsconfig';
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'GET',
      //   url: webMethod,
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data: {}) {
      //     result = data;
      //   }
      // });
      return await this.http.get(webMethod).toPromise().then((data:any)=>{
        //debugger
        result = data;
        return result;
       });

    } catch (error) {
      result = {};
    }
  
  }

  //Last modified by Apurva K || 02-May-2023
  async fetchNewsDetails(newsId: any, noRecords: any, valideFrom: any, validTill: any, tags = '', LikeValue: any,
    PageNumber: any='1', Popular: any, Recommended: any, RowsPerPage: any, SearchNews: any, MarketOppurtunities: any){
    let result: any[] = [];
    // this.UserID = 'Dealer3';
    try {
      // // console.log('FetchNewsDetails');
      const webMethod = this.interfaceUrl + 'news/PublishNews/FetchNewsDetails';
      const parameters = {
        "FinIQRequestHeader": {
          "EntityCode": "HS",
          "LoginID": AppConfig.settings.oRes.userID,
          "SourceSystem": "FinIQ",
          // "MachineIP": "172.16.23.96",
          "MachineIP": "",//Changed by SandipA for Internal IP Address Disclosure @05-Sep-23 
          "RequestID": "40467",
          "RequestAt": "5/3/2023"
      },
      "FetchNewsDetailsRequest": {
          "ValidTill": validTill,
          "ValidFrom": valideFrom,
          "News_Publish_At": "",
          "NoOfRecords": "All",
          "News_ID": newsId,
          "Tags": tags || "",
          "LoginID": AppConfig.settings.oRes.userID,
          "PageNumber": PageNumber,
          "RowsPerPage": RowsPerPage,
          "SearchNews": SearchNews,
          "LikeValue": LikeValue,
          "Recommended": Recommended,
          "Popular": Popular,
          "MarketOppurtunities": MarketOppurtunities
      }
        // News_ID: newsId,
        // NoOfRecords: noRecords,
        // ValidFrom: valideFrom,
        // ValidTill: validTill,
        // Tags: tags,
        // LoginID: this.commonfunctions.getLoggedInUserName(),
        // LikeValue,
        // PageNumber,
        // Popular,
        // Recommended,
        // RowsPerPage,
        // SearchNews,
        // MarketOppurtunities
      };
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
      //   success(data: { ListFetchNewsDetailsResponse: any; }) {
      //     if (data.ListFetchNewsDetailsResponse.items) {
      //       // console.log(data.ListFetchNewsDetailsResponse.items);
      //       result = data.ListFetchNewsDetailsResponse;
      //     } else {
      //       result = [];
      //     }


      //   },
      //   error(_error: any) {
      //     // console.log(error);
      //     result = [];
      //   }
      // });
      // return this.resMsg;
      return await this.http.post(webMethod, parameters).toPromise().then((data:any)=>{
        if (data.ListFetchNewsDetailsResponse.items) {
          //  
          result = data.ListFetchNewsDetailsResponse;
        } else {
          result = [];
        }
        // result = data;
        return result;
       });
    } catch (error) {
      // console.log('Error:', error);
    }
    return result;
  }

  async getNewsImage(newsId: any) {
    let result = '';
    try {
      // // console.log('GetNewsImage');
      const webMethod = this.interfaceUrl + 'GetNewsImage';
      const that = this;
      const parameters = {
        newsId
      };
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'text',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data: string) {
      //     // console.log(data);
      //     result = data;
      //     // if (data.FinIQResponseHeader.Status === 'Succeed' || data.FinIQResponseHeader.Status === 'Success') {
      //     //   if (data.FillOrder.ResponseDetails.Code === '0000') {
      //     //     that.resMsg = data.FillOrder.RemarkInfo.Message;
      //     //   }
      //     // } else {
      //     //   that.resMsg = data.FillOrder.ResponseDetails.Remark;
      //     // }


      //   },
      //   error(_error: any) {
      //     // console.log(error);
      //     result = '';
      //   }
      // });
      // return this.resMsg;

      return await this.http.get(webMethod).toPromise().then((data:any)=>{
        //debugger
        result = data;
        return result;
       });

    } catch (error) {
      // console.log('Error:', error);
    }
    return result;
  }

  getNewsImgResourcePath(filename: any){
    try {
      // // console.log('GetNewsImage');
      const webMethod =  AppConfig.settings.newsImgResourcePath + filename;
      const parameters = {
        filename
      };
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'text',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data: string) {
      //     // console.log(data);
      //     result = data;
      //     // if (data.FinIQResponseHeader.Status === 'Succeed' || data.FinIQResponseHeader.Status === 'Success') {
      //     //   if (data.FillOrder.ResponseDetails.Code === '0000') {
      //     //     that.resMsg = data.FillOrder.RemarkInfo.Message;
      //     //   }
      //     // } else {
      //     //   that.resMsg = data.FillOrder.ResponseDetails.Remark;
      //     // }


      //   },
      //   error(_error: any) {
      //     // console.log(error);
      //     result = '';
      //   }
      // });
      // return await this.http.get(webMethod).toPromise().then((data:any)=>{
      //   //debugger
      //   result = data;
      //   return result;
      //  });
      return webMethod;
      // return this.resMsg;
    } catch (error) {
      // console.log('Error:', error);
    }
    //return result;
  }

  async getVideoAndDocsPath(filename: any) {
    let result = '';
    try {
      // // console.log('GetNewsImage');
      const webMethod = this.interfaceUrl + 'getVideoAndDocsPath';
      const that = this;
      const parameters = {
        filename
      };
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'text',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data: string) {
      //     // console.log(data);
      //     result = data;

      //   },
      //   error(_error: any) {
      //     // console.log(error);
      //     result = '';
      //   }
      // });
      // return this.resMsg;
      return await this.http.get(webMethod).toPromise().then((data:any)=>{
        //debugger
        result = data;
        return result;
       });
    } catch (error) {
      // console.log('Error:', error);
    }
    return result;
  }

  async GetPreviewURL(){
    let result = '';
    try {
      // console.log('GetNewsImage');
      const webMethod = this.interfaceUrl + 'GetPreviewURL';
      const that = this;
      const parameters = {
        "filename": ""
      };
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'text',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data: string) {
      //     console.log(data);
      //     result = data;
      //   },
      //   error(error: any) {
      //     console.log(error);
      //     result = '';
      //   }
      // });
      return await this.http.get(webMethod).toPromise().then((data:any)=>{
        //debugger
        result = data;
        return result;
       });
      // return this.resMsg;
    } catch (error) {
      console.log('Error:', error);
    }
    return result;
  }

 async getNewsAttachment(filename: any) {
    let result = '';
    try {
      // console.log('GetNewsImage');
      const webMethod = this.interfaceUrl + 'GetNewsAttachment';
      const that = this;
      const parameters = {
        filename
      };
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'text',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data: string) {
      //     console.log(data);
      //     result = data;
      //   },
      //   error(error: any) {
      //     console.log(error);
      //     result = '';
      //   }
      // });
      return await this.http.get(webMethod).toPromise().then((data:any)=>{
        //debugger
        result = data;
        return result;
       });
      // return this.resMsg;
    } catch (error) {
      console.log('Error:', error);
    }
    return result;
  }


//Changes done by Apurva K|| for dashboard dotnet core API calls|| 10-Apr-2023
  async BBVAGetPopularProducts(loginId: any, duration: any) {
    try {
      let productChartData: any = [];
      //console.log("bbvagetPopularproducts")
      // let shares = [];
      const webMethod = this.interfaceUrl + 'landingpage/LandingPage/GetPopularProducts';
      //this.interfaceUrl + 'landingpage/GetPopularProducts';
      const parameters = {
        //LoginID: AppConfig.settings.oRes.userName,
        LoginID: loginId,
        Duration: duration
      };
      // const that = this;
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
      //   success(data: { GetPopularProductsResult: { Status: any; }; }) {
      //     productChartData = data.GetPopularProductsResult;
      //     return productChartData;
      //     // shares = data.Get_All_Share_Details_JsonResult;
      //   },
      //   error(_error: any) {
      //     console.log("Error in get popular products");
      //   }
      // });
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        productChartData = data;
        return productChartData;
      }).catch(error => {
        console.log(error);
      });
    } catch (error) {
    //console.log('Error:', error);
  }
  }



  async BBVAGetPopularUnderlyings(loginId: any, duration: any, NoOfUnderlyings: any) {
    try {
      let underlyingChartData: any = [];
      // let shares = [];
      const webMethod = this.interfaceUrl + 'landingpage/LandingPage/GetPopularUnderlyings';
      const parameters = {
        LoginID: loginId,
        Duration: duration,
        NoOfUnderlyings: NoOfUnderlyings
      };
      // const that = this;
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
      //   success(data: { GetPopularUnderlyingsResult: { Status: any; }; }) {
      //     underlyingChartData = data.GetPopularUnderlyingsResult;
      //     console.log(data);
      //     return underlyingChartData;

      //   },
      //   error(_error: any) {
      //     console.log("Error in get popular underlyings");
      //   }
      // });
      // return underlyingChartData;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        underlyingChartData = data;
        return underlyingChartData;
      }).catch(error => {
        console.log(error);
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  async BBVAGetPopularTenors(loginId: any, duration: any) {
    try {
      //let tenorChartData: any = [];
      // let shares = [];
      const webMethod = this.interfaceUrl + 'landingpage/LandingPage/GetPopularTenors';
      const parameters = {
        LoginID: loginId,
        Duration: duration
      };
      // const that = this;
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
      //   success(data: { GetPopularTenorsResult: { Status: any; }; }) {
      //     tenorChartData = data.GetPopularTenorsResult;
      //     return tenorChartData;
      //   },
      //   error(_error: any) {
      //     console.log("Error in get popular tenor");
      //   }
      // });
      // return tenorChartData;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        let tenorChartData:any = data;
        return tenorChartData;
      }).catch(error => {
        console.log(error);
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  issueDateShifter = []
  fixingDateShifter = []
  maturityDateShifter = []
  mappedformatlistLocation = []
  feeAmtCcyArr = []
  scheduleFreqArr = []
  scheduleTypeArr = []
  languageArr = []
  disclaimerArr = []
  recoveryTypeArr = []
  tenorArr = []
  ParticipationBasketType = []
  settlementTypeArr = []
  creditTrancheIndexCode = []

  async GetCommonDataType(Type: any) {
    try {
      let commonData: any = [];
      // let shares = [];
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/GetCommonDataType';
      const parameters = {
        Language: Type
      };
      const that = this;
      // const that = this;
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
      //   success(data: any) {
      //     // console.log(data);
      //     commonData = data;
      //   },
      //   error(_error: any) {
      //     console.log("Error in get coomon data");
      //   }
      // });

      // return commonData;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        commonData = data;
        switch (Type) {
          case 'IssueDate_DCN': that.issueDateShifter = commonData
            break;
          case 'FixingDate_DCN': that.fixingDateShifter = commonData
            break;
          case 'MaturityShifter_DCN': that.maturityDateShifter = commonData
            break;
          case 'FXDCNFormat': that.mappedformatlistLocation = commonData
            break;
          case 'DCNFeeAmountCurrency': that.feeAmtCcyArr = commonData
            break;
          case 'PricerScheduleFrequency': that.scheduleFreqArr = commonData
            break;
          case 'PricerScheduleType': that.scheduleTypeArr = commonData
            break;
          case 'StruxlyVideo_Language': that.languageArr = commonData
            break;
          case 'StruxlyVideo_Disclaimer': that.disclaimerArr = commonData
            break;
          case 'Recovery_Type': that.recoveryTypeArr = commonData
            break;
          case 'BasketType_Part': that.ParticipationBasketType = commonData
            break;
          case 'Recovery_Type': that.recoveryTypeArr = commonData
            break;
          case 'Settlement Type BBVA': that.settlementTypeArr = commonData
            break;
          case 'CreditIndexVideoMapping': that.creditTrancheIndexCode = commonData
            break;
          case 'CLNTenor': that.tenorArr = commonData
            break;
        }
        return commonData;
      }).catch(error => {
        console.log(error);
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }

 async GetClientProdDetails(BookName: any) {
    // const webMethod = this.interfaceUrl + 'GetClientProdDetails';
    const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetClientProdDetails';
    const parameters = {
      BookName,
      LoginID: AppConfig.settings.oRes.userID,
      EntityID: AppConfig.settings.oRes.homeEntityID
    };
    // const that = this;
    // const response = '';
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
    //   success(data: any) {
    //     that.GetClientProdDetailsArr = data.Get_Client_Prod_details_APIResult;
    //     return that.GetClientProdDetailsArr;
    //   },
    //   error(_error: any) {
    //   }
    // });
    // return this.GetClientProdDetailsArr;
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      this.GetClientProdDetailsArr = data;
      return this.GetClientProdDetailsArr;
    }).catch(error => {
      console.log(error);
    });
  } catch (error) {
    console.log('Error:', error);
}

  async GetNumberOfBusinessDays(startDate: any, endDate: any, holidayCurrencyCsv: any) {
    try {
      let commonData: any = [];
      // let shares = [];
      const webMethod = this.interfaceUrl + 'GetNumberOfBusinessDays';
      const parameters = {
        startDate,
        endDate,
        holidayCurrencyCsv

      };
      // const that = this;
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
      //   success(data: any) {
      //     // console.log(data);
      //     commonData = data;
      //   },
      //   error(_error: any) {
      //     console.log("Error in GetNumberOfBusinessDays");
      //   }
      // });
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
       commonData = data;
        return commonData;
      }).catch(error => {
        console.log(error);
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }


  setportfolioGroupID(portfolioGroupID: any) {
    this.portfolioGroupID = portfolioGroupID;
  }
  setUserGroupID(userGroupID: any) {
    this.userGroupID = userGroupID;
  }
  setUserGroup(userGroup: any) {
    this.userGroup = userGroup;
  }

  async getPortfolioSharingList(PortfolioID: any) {
    try{
    const webMethod = this.interfaceUrl + 'getPortfolioSharingList';
    const parameters = {
      PortfolioID
    };
    // const that = this;
    // const response = '';
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
    //   success(data: any) {
    //     that.getSharedPortfolioAccessList = data.getPortfolioSharingListResult;
    //     return that.getSharedPortfolioAccessList;
    //   },
    //   error(_error: any) {
    //   }
    // });
    // return this.getSharedPortfolioAccessList;
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      this.getSharedPortfolioAccessList = data;
       return this.getSharedPortfolioAccessList;
     }).catch(error => {
       console.log(error);
     });
   } catch (error) {
     console.log('Error:', error);
   }
  }

  async BBVAGetPortfolioDetails(PortFolioID: any, Type: any) {
    try {
      this.UserID = (this.commonfunctions.getLoggedInUserName());
      const webMethod = this.interfaceUrl + 'GetPortfolioDetails';
      const parameters = {
        PortFolioID,
        Type,
        UserID: this.UserID,
      };
      // const that = this;
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
      //   success(data: any) {
      //     that.result = data.Get_PortfolioResult;
      //   },
      //   error(_error: any) {
      //   }
      // });
      // return this.result;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.result = data;
         return this.result;
       }).catch(error => {
         console.log(error);
       });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  async BBVALoadSharesIR(marketType: any) {
    try {
      let floatingRefArr: any = [];
      const webMethod = this.interfaceUrl + 'BBVAGetShares';
      const parameters = {
        MarketType: marketType
      };
      // const that = this;
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
      //   success(data: any) {
      //     floatingRefArr = data.Get_All_Share_Details_JsonResult;
      //   },
      //   error(_error: any) {
      //   }
      // });
      // this.floatingRefArr = floatingRefArr;
      // return this.floatingRefArr;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        floatingRefArr = data;
        this.floatingRefArr = floatingRefArr;
         return this.floatingRefArr;
       }).catch(error => {
         console.log(error);
       });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  async BBVALoadSharesCR(marketType: any) {
    try {
      let indexTrancheArr: any = [];
      const webMethod = this.interfaceUrl + 'BBVAGetShares';
      const parameters = {
        MarketType: marketType
      };
      // const that = this;
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
      //   success(data: any) {
      //     indexTrancheArr = data.Get_All_Share_Details_JsonResult;
      //   },
      //   error(_error: any) {
      //   }
      // });
      // this.indexTrancheArr = indexTrancheArr;
      // return this.indexTrancheArr;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        indexTrancheArr = data;
        this.indexTrancheArr = indexTrancheArr;
         return this.indexTrancheArr;
       }).catch(error => {
         console.log(error);
       });
    } catch (error) {
      console.log('Error:', error);
    }
  }


  async BBVAValidateRFQTime(underlyingCode: any) {
    try {

      let RFQTimeFlag: any = [];
      const webMethod = this.interfaceUrl + 'ValidateRFQTime';
      const parameters = {
        underlyingCode
      };
      // const that = this;
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
      //   success(data: any) {
      //     // console.log(data);
      //     RFQTimeFlag = data.ValidateRFQTimeForCreditTranchResult;
      //   },
      //   error(_error: any) {
      //   }
      // });
      // this.RFQTimeFlag = RFQTimeFlag;
      // return this.RFQTimeFlag;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        RFQTimeFlag = data;
        this.RFQTimeFlag = RFQTimeFlag;
         return this.RFQTimeFlag;
       }).catch(error => {
         console.log(error);
       });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  async attachDetachCalculations(attach: any, detach: any) {
    try {
      const webMethod = this.interfaceUrl + 'CalculateCreditNominal';
      const parameters = {
        attach,
        detach
      };
      // const that = this;
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
      //   success(data: any) {
      //     that.attachDetachCalculationsSF.next(data.CalcualteCreditEventNominalAmountResult);
      //   },
      //   error(_error: any) {

      //   }
      // });
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.attachDetachCalculationsSF = data;
         return this.attachDetachCalculationsSF;
       }).catch(error => {
         console.log(error);
       });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  async getDetachPercent(detachVal: any, indexCode: any, _index: any) {
    try {
      let detachPer;
      // const webMethod = this.interfaceUrl + 'CalcualteCreditDetachPercentage';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Calculate/CreditDetachPercentage';
      const parameters = {
        detach: detachVal,
        IndexCode: indexCode
      };
      // const that = this;
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
      //   success(data: any) {
      //     detachPer = data.CalcualteCreditDetachPercentageResult;
      //     // that.getDetachchPercentSF.next({ data: data.CalcualteCreditDetachPercentageResult, index: index });
      //   },
      //   error(_error: any) {
      //   }
      // });
      // return detachPer;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        detachPer = data;
         return detachPer;
       }).catch(error => {
         console.log(error);
       });
    } catch (error) {
      console.log('Error:', error);
      return '';
    }
  }

  async getAttachPercent(attachVal: any, indexCode: any, _index: any) {
    try {
      let attachPer;
      //const webMethod = this.interfaceUrl + 'CalcualteCreditAttachPercentage';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Calculate/CreditAttachPercentage';
      const parameters = {
        attach: attachVal,
        IndexCode: indexCode
      };
      // const that = this;
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
      //   success(data: any) {
      //     attachPer = data.CalcualteCreditAttachPercentageResult;
      //     // that.getAttachPercentSF.next({ data: data.CalcualteCreditAttachPercentageResult, index: index });

      //   },
      //   error(_error: any) {

      //   }
      // });
      // return attachPer;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        attachPer = data;
         return attachPer;
       }).catch(error => {
         console.log(error);
       });
    } catch (error) {
      console.log('Error:', error);
      return '';
    }
  }

 async GetPortfolioForAllDeals(FromDate: any, Mode: any, PageNo: any, PortfolioType: any, RowsPerPage: any, ToDate: any, Type: any, UserID: any) {
    try {
      let saveReq;
      const webMethod = this.interfaceUrl + 'Get_Portfolio_ForAllDeals';
      const parameters = {
        FromDate: FromDate,
        Mode: Mode,
        PageNo: PageNo,
        PortfolioType: PortfolioType,
        RowsPerPage: RowsPerPage,
        ToDate: ToDate,
        Type: Type,
        UserID: UserID,
      };
      // const that = this;
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
      //   success(data: any) {
      //     saveReq = data.Get_Portfolio_ForAllDealsResult;

      //   },
      //   error(_error: any) {

      //   }
      // });
      // return saveReq;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        saveReq = data;
         return saveReq;
       }).catch(error => {
         console.log(error);
       });
    } catch (error) {
      console.log('Error:', error);
      return '';
    }
  }

  // Q2 API

  GetEventTarget(e: any) {
    try {
      const target: any = e.target || e.srcElement || e.currentTarget || null;
      return target;
    } catch (error) {
      console.log('Error:', error);
    }
  }



  //START  BBVAEPCLI-240   Pranav D 6-Dec-2022 changes as per SP changes 
  async BBVWorkflowBlotter(queryToSearch: any, workflowId: any, queueid: any, fromDate: any, toDate: any, requestType: any, recordsPerPage: any, pageNo: any) {
    setTimeout(async() => {
      try {
        //this.UserID = this.commonfunctions.getLoggedInUserName();
        this.UserID = AppConfig.settings.oRes.userName;
        const webMethod = this.interfaceUrl + 'getTokens';
        const parameters = {
          workflowId,
          workflowCode: 'RFQ Workflow',
          queueid,
          entityId: AppConfig.settings.oRes.homeEntityID,
          pageno: pageNo,
          pageSize: recordsPerPage,
          queryToSearch,
          LoginId: this.UserID,
          FromDate: fromDate,
          ToDate: toDate,
          Flag: requestType
        };
        // const that = this;
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
        return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
          const parseString = require('xml2js').parseString;
            // tslint:disable-next-line: only-arrow-functions
            parseString(data.getTokensResult, function (_err: any, result: any) {
              this.getDataForExportToExcel((result.NewDataSet.DUMMY));
              if (queryToSearch === 'AutocallablePhoenix' || queryToSearch === 'DualFIAutocallablePhoenix') {
                this.GetWFBlotterPHXSF.next(result.NewDataSet.DUMMY);
              } else if (queryToSearch === 'ReverseConvertible,BarrierReverseConvertible' || queryToSearch === 'DualFIReverseConvertible') {
                this.GetWFBlotterRCSF.next(result.NewDataSet.DUMMY);
              }
              // else if (queryToSearch === 'BarrierReverseConvertible') {
              //   that.GetWFBlotterBRCSF.next(result.NewDataSet.DUMMY);
              // } 
              // queryToSearch === 'CreditLinear' Pranav D 3-Dec-2022 new product scheduled request BBVAEPCLI-237
              else if (queryToSearch === 'CreditTranche' || queryToSearch === 'CreditLinkedNote' || queryToSearch === 'CreditLinear') {  //  changes by Suvarna P || 20Apr2022 || BBVACLI-188 || CLN: Previous Quotes 
                this.GetWFBlotterCTSF.next(result.NewDataSet.DUMMY);
              } else if (queryToSearch === 'Participation' || queryToSearch === 'BonusEnhancedNote') {
                this.GetWFBlotterPTCSF.next(result.NewDataSet.DUMMY);
              } else if (queryToSearch === 'DailyRangeAccrual' || queryToSearch === 'DualFIDailyRangeAccrual' || queryToSearch === 'DualCurrencyNote') {
                this.GetWFBlotterDRASF.next(result.NewDataSet.DUMMY);
              }
              // else if (queryToSearch === 'DualFIAutocallablePhoenix') {
              //   that.GetWFBlotterPHXSF.next(result.NewDataSet.DUMMY);
              // } 
              // else if (queryToSearch === 'DualFIReverseConvertible') {
              //   that.GetWFBlotterRCSF.next(result.NewDataSet.DUMMY);
              // } 
              // else if (queryToSearch === 'DualFIDailyRangeAccrual') {
              //   that.GetWFBlotterDRASF.next(result.NewDataSet.DUMMY);
              // }
            });
         }).catch(error => {
           console.log(error);
         });
      } catch (error) {
        console.log('Error:', error);
      }
    });
  }
  //END  BBVAEPCLI-240   Pranav D 6-Dec-2022 changes as per SP changes
  async BBVWorkflowBlotterPrevQuotes(queryToSearch, fromDate, toDate, nm_id) {
   
    var strRowCount = 5; // [*] Getting the max instead of chunk.. < SaurabhS | 17-sep-2021 | Pagination fetching the max record and paginate />
    setTimeout(async() => {
      try {
        //console.log("afs BBVWorkflowBlotter");
        this.UserID = AppConfig.settings.oRes.userID
        const webMethod =  AppConfig.settings.apiBaseUrl + 'eqd/Quote/GetProductBasedRFQ';
        const parameters = {
          branch_entity: '',
          TemplateName: queryToSearch, //"AutocallablePhoenix",
          UserName: AppConfig.settings.oRes.userID, //"Dealer1",
          // "strTradeDate": "22-Jun-2021",
          RowCount: strRowCount.toString(),
          Mode: 'ALL',
          ProductCode: '',
          LoginHostName: '',
          RFQID: '',
          nm_id: nm_id,
          PPName: '',
          ExpandAll: '',
          FromDate: fromDate, //"23-Jun-2021",
          ToDate: toDate, //"24-Jul-2021"
        };
        return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
          let prevQuoteData= data;
          return prevQuoteData;
        });
      } catch (error) {
        //console.log('Error:', error);
      }
    });
  }


  // <Suvarna(13-Jan-2020) ||saved Request || start>
  BBVWorkflowBlotter_saveQuotes(product: any, _saveQuoteWrkflwId: any, _queueid: any, toDate: any, frmDate: any, PortfolioType: any) {
    setTimeout(() => {
      try {
        this.UserID = (this.commonfunctions.getLoggedInUserName());
        // tslint:disable-next-line: variable-name
        const month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const today = new Date();
        const formattedDate = ('0' + today.getDate()).slice(-2) + '-' + month_names[today.getMonth()] + '-' + today.getFullYear();
        const webMethod = this.interfaceUrl + 'Get_Portfolio_ForAllDeals';
        const parameters = {
          UserID: this.UserID,
          // Type: product === 'DCN' ? 'AutocallablePhoenix' : product,
          Type: product,
          Mode: 'Single Pricer',
          FromDate: frmDate,
          ToDate: toDate,
          PageNo: '1',
          RowsPerPage: '500',
          PortfolioType
        };
        const that = this;
        $.ajax({
          async: false,
          crossDomain: true,
          type: 'POST',
          url: webMethod,
          data: JSON.stringify(parameters),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          headers: {
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
          },
          success(data: any) {
            const Map1 = [];
            const result = data.Get_Portfolio_ForAllDealsResult;
            if (product === 'AutocallablePhoenix') {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < result.length; i++) {
                Map1.push({
                  'Request ID': result[i].P_ID,
                  Ccy: result[i].Ccy,
                  Size: result[i].Size,
                  Format: result[i].FormatDetails,
                  'Solve For': result[i].SolveFor,
                  'Price (%)': result[i].IBPrice,
                  'Issue Price (%)': result[i].IssuePrice,
                  Underlying: result[i].Share.split('##')[0].replace(/#/g, ','),
                  'Expiry Date': result[i].ExpiryDate.split(' ')[0],
                  'Payment Date': result[i].PaymentDate.split(' ')[0],
                  'Strike (%)': result[i].Strike,
                  'Strike Date': result[i].StrikeDate.split(' ')[0],
                  'Coupon (%)': result[i].CouponPer,
                  'Obs.': result[i].CouponObs,

                  // new fields added by Priya L. on 28Feb2022 - assigned by PranavD
                  'Type': result[i].InputBarrierType,
                  'Barrier Type': result[i].AutocallKOBarrierType,
                  'Barrier (%)': result[i].AutocallKOBarrierLevel,
                  'Additional Coupon (%)': result[i].AutocallbonusCoupon,
                  'KI Barrier Type': result[i].KIType,
                  'KI Barrier (%)': result[i].KIPer,

                  'Trigger (%)': result[i].KOPer,
                  // new field added by Priya L. on 28Feb2022 - assigned by PranavD
                  'Limit Max Loss': result[i].LimitMaxLossYN,
                  'Frequency': result[i].KOType,
                  'Stepdown': result[i].StepDown,
                  'Stepdown Freq.': result[i].StepdownFrequency,
                  'ER Trigger Floor Y/N': result[i].AutocallTriggerFloorYN,
                  'ER Trigger Floor (%)': result[i].AutocallTriggerFloor,
                  'Airbag Y/N': result[i].AirbagYN,
                  'Non-Call': result[i].NonCallPeriod,
                  'ER Cpn (%)': result[i].ERCouponPer,
                  'ER Cpn Type': result[i].ERCouponType,
                  'Cpn Trigger': result[i].CouponBarrier,
                  'Cpn Freq.': result[i].Frequency,
                  'Cpn Type': result[i].CouponType,
                  'Memory Pds.': result[i].MemoryPds,
                  'Alt. Cpn (%)': result[i].AltCouponPer,
                  'Alt. Obs.': result[i].AltCouponObservation,
                  'Funding Type': result[i].FundingType,
                  'Freq.': result[i].FundingFrequency,
                  'Index Rate Spread': result[i].IndexRateSpread
                });
              }
              that.GetWFBlotterPHXSF.next(Map1);
            } else if (product === 'ReverseConvertible,BarrierReverseConvertible') {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < result.length; i++) {
                Map1.push({
                  'Request ID': result[i].P_ID,
                  Ccy: result[i].Ccy,
                  Size: result[i].Size,
                  Format: result[i].FormatDetails,
                  'Solve For': result[i].SolveFor,
                  'Price (%)': result[i].IBPrice,
                  'Issue Price (%)': result[i].IssuePrice,
                  Underlying: result[i].Share.split('##')[0].replace(/#/g, ','),
                  'Expiry Date': result[i].ExpiryDate.split(' ')[0],
                  'Payment Date': result[i].PaymentDate.split(' ')[0],
                  'Strike (%)': result[i].Strike,
                  'Strike Date': result[i].StrikeDate.split(' ')[0],
                  'Coupon (%)': result[i].CouponPer,
                  'Coupon Obs.': result[i].CouponObs,
                  'Barrier (%)': result[i].KIPer,
                  'Barrier Type': result[i].KIType,
                  'Cpn Trigger': result[i].CouponBarrier,
                  'Cpn Freq.': result[i].Frequency,
                  'Cpn Type': result[i].CouponType,
                  'Memory Pds.': result[i].MemoryPds,
                  'Funding Type': result[i].FundingType,
                  'Freq.': result[i].FundingFrequency,
                  'Index Rate/ Spread': result[i].IndexRateSpread

                });
              }
              that.GetWFBlotterRCSF.next(Map1);
            }
            //  else if (product === 'BarrierReverseConvertible') {
            //   that.GetWFBlotterBRCSF.next(data.Get_PortfolioResult);
            // } 
            else if (product === 'CreditTranche') {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < result.length; i++) {
                Map1.push({
                  'Request ID': result[i].P_ID,
                  Ccy: result[i].Ccy,
                  Size: result[i].Size,
                  'Issue Date': result[i].IssueDate.split(' ')[0],
                  Tenor: result[i].TenorPer,
                  'Maturity Date': result[i].MaturityDate.split(' ')[0],
                  'Solve For': result[i].SolveFor,
                  'Reoffer Price (%)': result[i].ReofferPrice,
                  Index: result[i].IndexCode,
                  Attach: result[i].AttachValue,
                  'Attach (%)': result[i].AttachPer,
                  Detach: result[i].DetachValue,
                  'Detach (%)': result[i].DetachPer,
                  'Recovery Type': result[i].RecoveryType,
                  'Settlement Type': result[i].SettlementType,
                  'Cpn Type': result[i].CouponType,
                  'Floating Ref.': result[i].FloatingRef,
                  'Coupon/Spread': result[i].CouponPer, // IndexRateSpread
                  // "Spread": result[i].CouponSpread,
                  'Cpn Freq.': result[i].Frequency,
                  'Coupon Basis': result[i].CouponBasis,
                  'Ind./Firm': result[i].SubTemplate === 'CreditTranche' || result[i].SubTemplate === 'Credit Tranche' ? 'Firm' : 'Ind.',
                  'Funding Type': result[i].FundingType,
                  'Funding Index': result[i].FundIndex,
                  'Freq.': result[i].FundingFrequency,
                  'Index Rate/Spread': result[i].IndexRateSpread
                });
              }
              that.GetWFBlotterCTSF.next(Map1);
            } else if (product === 'Participation') {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < result.length; i++) {
                Map1.push({
                  'Request ID': result[i].P_ID,
                  Type: result[i].ProductType,
                  Underlying: result[i].Share.split('##')[0].replace(/#/g, ','),
                  Format: result[i].Wrapper,
                  'Solve For': result[i].SolveFor,
                  'Price (%)': result[i].IBPrice,
                  'Issue Price (%)': result[i].IssuePrice,
                  Ccy: result[i].Ccy,
                  Size: result[i].Size,
                  'Strike Date': result[i].StrikeDate.split(' ')[0],
                  'Payment Date': result[i].PaymentDate.split(' ')[0],
                  'Final Redemption Date': result[i].ExpiryDate.split(' ')[0],
                  'Upside Strike (%)': result[i].InputStrikePercent,
                  'Gearing (%)': result[i].UpsideParticipationPercent,
                  'Upper Strike (%)': result[i].UpsideParticipationCapPercent,
                  'Min Coupon (%)': result[i].InputMinimumCouponPercentPA,
                  'Upside Barrier Type': result[i].InputKOBarrierFrequency,
                  'Upside Barrier Level (%)': result[i].InitialInputKOBarrierPercent,
                  'Rebate': result[i].InputRebatePercent,
                  'Downside Strike (%)': result[i].InputDownsideStrikePercent,
                  'Leverage': result[i].DownsideParticipationPercent,
                  'Lower Strike (%)': result[i].DownsideParticipationCapPercent,
                  'Downside Barrier Type': result[i].InputKIBarrierFrequency,
                  'Downside Barrier Level (%)': result[i].InitialInputKIBarrierPercent,
                  'Capital Guranteed Level (%)': result[i].DownsideCapitalProtectionPercent,
                  'Coupon (%)': result[i].GuaranteedCoupon,
                  'Coupon Freq.': result[i].InputFixedCouponFrequencyPeriod,
                  'Funding Type': result[i].FundingType,
                  'Funding Freq.': result[i].FundingFrequency,
                  'Rate/Spread (%)': result[i].IndexRateSpread
                });
              }
              that.GetWFBlotterPTCSF.next(Map1);
            }
            else if (product === 'DailyRangeAccrual') {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < result.length; i++) {
                Map1.push({
                  'Request ID': result[i].P_ID,
                  Ccy: result[i].Ccy,
                  Size: result[i].Size,
                  Format: result[i].FormatDetails,
                  'Solve For': result[i].SolveFor,
                  'Price (%)': result[i].IBPrice,
                  'Issue Price (%)': result[i].IssuePrice,
                  Underlying: result[i].Share.split('##')[0].replace(/#/g, ','),
                  'Expiry Date': result[i].ExpiryDate.split(' ')[0],
                  'Payment Date': result[i].PaymentDate.split(' ')[0],
                  'Strike (%)': result[i].Strike,
                  'Strike Date': result[i].StrikeDate.split(' ')[0],
                  'Coupon (%)': result[i].CouponPer,
                  'Obs.': result[i].CouponObs,
                  'Barrier (%)': result[i].KIPer,
                  'Barrier Type': result[i].KIType,
                  'Trigger (%)': result[i].KOPer,
                  Frequency: result[i].KOType,
                  Stepdown: result[i].StepDown,
                  'Non-Call': result[i].NonCallPeriod,
                  'ER Cpn (%)': result[i].ERCouponPer,
                  'ER Cpn Type': result[i].ERCouponType,
                  'Cpn Trigger': result[i].CouponBarrier,
                  'Cpn Freq.': result[i].Frequency,
                  // 'Cpn Type': result[i].CouponType, 
                  // 'Memory Pds.': result[i].MemoryPds, 
                  'Alt. Cpn (%)': result[i].AltCouponPer,
                  'Alt. Obs.': result[i].AltCouponObservation,
                  'Funding Type': result[i].FundingType,
                  'Freq.': result[i].FundingFrequency,
                  'Index Rate Spread': result[i].IndexRateSpread
                });
              }
              that.GetWFBlotterDRASF.next(Map1);
            } else if (product === 'DualFIAutocallablePhoenix') {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < result.length; i++) {
                Map1.push({
                  'Request ID': result[i].P_ID,
                  Ccy: result[i].Ccy,
                  Size: result[i].Size,
                  Format: result[i].FormatDetails,
                  'Solve For': result[i].SolveFor,
                  'Price (%)': result[i].IBPrice,
                  'Issue Price (%)': result[i].IssuePrice,
                  Underlying: result[i].Share.split('##')[0].replace(/#/g, ','),
                  'Expiry Date': result[i].ExpiryDate.split(' ')[0],
                  'Payment Date': result[i].PaymentDate.split(' ')[0],
                  'Strike (%)': result[i].Strike,
                  'Strike Date': result[i].StrikeDate.split(' ')[0],
                  'Gearing FI': result[i].DualGearingFI,
                  'Coupon FI': result[i].DualCouponFI,
                  // 'Notional FI' : result[i].IssuePrice,
                  'Coupon (%)': result[i].CouponPer,
                  'Coupon Obs.': result[i].CouponObs,
                  'Barrier (%)': result[i].KIPer,
                  'Barrier Type': result[i].KIType,
                  // new fields
                  'Frequency': result[i].KOType,
                  'Stepdown': result[i].StepDown,
                  'Stepdown Freq.': result[i].StepdownFrequency,
                  'ER Trigger Floor Y/N': result[i].AutocallTriggerFloorYN,
                  'ER Trigger Floor (%)': result[i].AutocallTriggerFloor,
                  'Airbag Y/N': result[i].AirbagYN,
                  'Non-Call': result[i].NonCallPeriod,
                  'ER Cpn (%)': result[i].ERCouponPer,
                  'ER Cpn Type': result[i].ERCouponType,
                  'Cpn Trigger': result[i].CouponBarrier,
                  'Cpn Freq.': result[i].Frequency,
                  'Cpn Type': result[i].CouponType,
                  'Memory Pds.': result[i].MemoryPds,
                  'Alt. Cpn (%)': result[i].AltCouponPer,
                  'Alt. Obs.': result[i].AltCouponObservation,
                  'Funding Type': result[i].FundingType,
                  'Freq.': result[i].FundingFrequency,
                  'Index Rate Spread': result[i].IndexRateSpread


                });
              }
              that.GetWFBlotterPHXSF.next(Map1);
            } else if (product === 'DualFIReverseConvertible') {
              for (let i = 0; i < result.length; i++) {
                Map1.push({
                  'Request ID': result[i].P_ID,
                  Ccy: result[i].Ccy,
                  Size: result[i].Size,
                  Format: result[i].FormatDetails,
                  'Solve For': result[i].SolveFor,
                  'Price (%)': result[i].IBPrice,
                  'Issue Price (%)': result[i].IssuePrice,
                  Underlying: result[i].Share.split('##')[0].replace(/#/g, ','),
                  'Expiry Date': result[i].ExpiryDate.split(' ')[0],
                  'Payment Date': result[i].PaymentDate.split(' ')[0],
                  'Strike (%)': result[i].Strike,
                  'Strike Date': result[i].StrikeDate.split(' ')[0],
                  'Gearing FI': result[i].DualGearingFI,
                  'Coupon FI': result[i].DualCouponFI,
                  // 'Notional FI' : result[i].Strike,
                  'Coupon (%)': result[i].CouponPer,
                  'Coupon Obs.': result[i].CouponObs,
                  'Barrier (%)': result[i].KIPer,
                  'Barrier Type': result[i].KIType,
                  'Cpn Trigger': result[i].CouponBarrier,
                  'Cpn Freq.': result[i].Frequency,
                  'Cpn Type': result[i].CouponType,
                  'Memory Pds.': result[i].MemoryPds,
                  'Funding Type': result[i].FundingType,
                  'Freq.': result[i].FundingFrequency,
                  'Index Rate/ Spread': result[i].IndexRateSpread


                });
              }
              that.GetWFBlotterRCSF.next(Map1);
            } else if (product === 'DualFIDailyRangeAccrual') {
              for (let i = 0; i < result.length; i++) {
                Map1.push({
                  'Request ID': result[i].P_ID,
                  Ccy: result[i].Ccy,
                  Size: result[i].Size,
                  Format: result[i].FormatDetails,
                  'Solve For': result[i].SolveFor,
                  'Price (%)': result[i].IBPrice,
                  'Issue Price (%)': result[i].IssuePrice,
                  Underlying: result[i].Share.split('##')[0].replace(/#/g, ','),
                  'Expiry Date': result[i].ExpiryDate.split(' ')[0],
                  'Payment Date': result[i].PaymentDate.split(' ')[0],
                  'Strike (%)': result[i].Strike,
                  'Strike Date': result[i].StrikeDate.split(' ')[0],
                  'Gearing FI': result[i].DualGearingFI,
                  'Coupon FI': result[i].DualCouponFI,
                  // 'Notional FI' : result[i].Strike,
                  'Coupon (%)': result[i].CouponPer,
                  'Coupon Obs.': result[i].CouponObs,
                  'Barrier (%)': result[i].KIPer,
                  'Barrier Type': result[i].KIType,
                  'Cpn Trigger': result[i].CouponBarrier,
                  'Cpn Freq.': result[i].Frequency,
                  'Cpn Type': result[i].CouponType,
                  'Memory Pds.': result[i].MemoryPds,
                  'Funding Type': result[i].FundingType,
                  'Freq.': result[i].FundingFrequency,
                  'Index Rate/ Spread': result[i].IndexRateSpread


                });
              }
              that.GetWFBlotterDRASF.next(Map1);
            } else if (product === 'BonusEnhancedNote') {
              console.log('BEN', result);
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < result.length; i++) {
                Map1.push({
                  'Request ID': result[i].P_ID,
                  //Type: result[i].ProductType,
                  // column addded by Pranav D 30-Mar-2022 as asked by Abeer Jha
                  'Basket Type': result[i].BasketType,
                  Underlying: result[i].Share.split('##')[0].replace(/#/g, ','),
                  Format: result[i].Wrapper,
                  'Solve For': result[i].SolveFor,
                  'Price (%)': result[i].IBPrice,
                  'Issue Price (%)': result[i].IssuePrice,
                  Ccy: result[i].Ccy,
                  Size: result[i].Size,
                  'Strike Date': result[i].StrikeDate.split(' ')[0],
                  'Payment Date': result[i].PaymentDate.split(' ')[0],
                  'Final Redemption Date': result[i].ExpiryDate.split(' ')[0],
                  'Bonus (%)': result[i].BonusPercent,
                  'Upside Strike (%)': result[i].InputStrikePercent,
                  'Gearing (%)': result[i].UpsideParticipationPercent,
                  //'Upper Strike (%)': result[i].UpsideParticipationCapPercent,
                  //'Min Coupon (%)': result[i].InputMinimumCouponPercentPA,
                  // column addded by Pranav D 30-Mar-2022 as asked by Abeer Jha  JIRA BBVACLI-142
                  'Bonus Observation Type': (result[i].CustomBonusBarrierYN === 'Y') ? result[i].InputKOBarrierFrequency : '',
                  'Bonus Barrier Level (%)': result[i].InitialInputKOBarrierPercent,
                  'Cap (%)': result[i].CapPercent,
                  //'Rebate': result[i].InputRebatePercent,
                  'Downside Strike (%)': result[i].InputDownsideStrikePercent,
                  // binding changed as per UCP field mapping for leverage BEN 29-Mar-2022 by Pranav D
                  'Leverage': result[i].LeverageYN,
                  //'Lower Strike (%)': result[i].DownsideParticipationCapPercent,
                  'Downside Barrier Type': result[i].InputKIBarrierFrequency,
                  'Downside Barrier Level (%)': result[i].InitialInputKIBarrierPercent,
                  // column commented by Pranav D 30-Mar-2022 as asked by Abeer Jha
                  //'Capital Guranteed Level (%)': result[i].DownsideCapitalProtectionPercent,
                  //'Coupon (%)': result[i].GuaranteedCoupon,
                  //'Coupon Freq.': result[i].InputFixedCouponFrequencyPeriod,
                  'Funding Type': result[i].FundingType,
                  'Funding Freq.': result[i].FundingFrequency,
                  'Rate/Spread (%)': result[i].IndexRateSpread
                });
              }
              that.GetWFBlotterPTCSF.next(Map1);
            }
            // changes by Suvarna P || 20Apr2022 || BBVACLI-187 ||	CLN: Saved Requests || start 
            else if (product === 'CreditLinkedNote') {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < result.length; i++) {
                let referenceNames = result[i].Share.split('#');
                let reference = '';
                for (let i = 0; i < referenceNames.length - 2; i++) {
                  reference += referenceNames[i] + ',';
                }
                Map1.push({
                  'Request ID': result[i].P_ID,
                  'Reference Entity': reference.slice(0, -1),
                  Ccy: result[i].Ccy,
                  Size: result[i].Size,
                  'Issue Date': result[i].IssueDate.split(' ')[0],
                  Tenor: result[i].TenorPer,
                  Format: result[i].FormatDetails,
                  'Maturity Date': result[i].MaturityDate.split(' ')[0],
                  'Solve For': result[i].SolveFor,
                  'Reoffer Price (%)': result[i].ReofferPrice, //(result[i].FormatDetails === 'Note') ? result[i].IBPrice : result[i].Upfront,
                  'Issue Price': result[i].IssuePrice,
                  'Recovery Type': result[i].RecoveryType,
                  'Settlement Type': result[i].SettlementType,
                  'Coupon Type': result[i].CouponType,
                  'Floating Ref.': result[i].FloatingRef,
                  'Coupon/Spread': result[i].CouponPer, // IndexRateSpread
                  'Fixed Rate': result[i].CLNFixedRate,
                  'First Number of Periods': result[i].CLNFirstPeriods,
                  'Coupon Freq.': result[i].Frequency,
                  'Coupon Basis': result[i].CouponBasis,
                  'Ind./Firm': result[i].CLNIndicativeOrFirm,
                  'Freq.': result[i].FundingFrequency
                });
                // changes by Suvarna P || 20Apr2022 || BBVACLI-187 ||	CLN: Saved Requests || end
              }
              that.GetWFBlotterCTSF.next(Map1);
            }
            // changes by Suvarna P || 13Jun2022 || DCN: Saved Requests || start
            else if (product === 'DualCurrencyNote') {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < result.length; i++) {
                // let referenceNames = result[i].Share.split('#');
                // let reference = '';
                // for (let i = 0; i < referenceNames.length - 2 ; i++) {
                //   reference += referenceNames[i] + ',';
                // }
                Map1.push({
                  'Request ID': result[i].P_ID,
                  // 'Reference Entity': reference.slice(0, -1),
                  // 'On behalf of': result[i].onBehalfOf,
                  'Ccy Pair': result[i].CurrencyPair, //result[i].Ccy,
                  'Size': result[i].Size,
                  // 'Cost' : result[i].CostPercent,
                  'Issue Date': result[i].IssueDate.split(' ')[0],
                  'Tenor': result[i].InputMaturityDateShifter,
                  Format: result[i].FormatDetails,
                  'Maturity Date': result[i].MaturityDate.split(' ')[0],
                  'Solve For': result[i].SolveFor,
                  'Strike': result[i].Strike,
                  // 'Reoffer Price' : result[i].IssuePrice,
                  'Reoffer Price': result[i].ReofferPrice,
                  // 'Ccy': result[i].Ccy,
                  // 'Issue Date': result[i].IssueDate.split(' ')[0],
                  // Tenor: result[i].TenorPer,

                  // 'Maturity Date': result[i].MaturityDate.split(' ')[0],

                  // 'Reoffer Price': result[i].ReofferPrice,

                  // 'Fixing': result[i].Fixing,
                  // 'Fee (%) p.a.': result[i].InputFeePercent,
                  // 'Fee ($)': result[i].InputFeeAmount,
                  // 'Spot': result[i].InputSpotPrice,

                  // 'Spread': result[i].IndexRateSpread,
                  // 'Coupon (%) p.a.': result[i].CouponPer,

                  // 'Fixing Date': result[i].InputFixingDate,

                  // 'Issue Shifter': result[i].InputIssueDateShifter,
                  // 'Fixing Shifter': result[i].InputFixingDateShifter,
                  // 'Maturity Shifter': result[i].InputMaturityDateShifter
                  // MaturityDateCheck
                });

              }
              // that.GetWFBlotterCTSF.next(Map1);
              that.GetWFBlotterPHXSF.next(Map1);
            }
            // changes by Suvarna P || 13Jun2022 || DCN: Saved Requests || end
            else if (product === 'CreditLinear') {
              // tslint:disable-next-line: prefer-for-of
              console.log("RESULT ", result);
              for (let i = 0; i < result.length; i++) {
                Map1.push({
                  'Request ID': result[i].P_ID,
                  Ccy: result[i].Ccy,
                  Size: result[i].Size,
                  'Issue Date': result[i].IssueDate.split(' ')[0],
                  Tenor: result[i].TenorPer,
                  'First Coupon': result[i].FirstLongCoupon,
                  'Fixed Rate': result[i].CLNFixedRate,
                  'Maturity Date': result[i].MaturityDate.split(' ')[0],
                  'Solve For': result[i].SolveFor,
                  'Reoffer Price (%)': result[i].ReofferPrice,
                  Index: result[i].Share.split('##')[0],
                  'Recovery Type': result[i].RecoveryType,
                  'Settlement Type': result[i].SettlementType,
                  'Cpn Type': result[i].CouponType,
                  'Floating Ref.': result[i].FloatingRef,
                  'Coupon/Spread': result[i].CouponPer, // IndexRateSpread
                  // "Spread": result[i].CouponSpread,
                  'Cpn Freq.': result[i].Frequency,
                  'Coupon Basis': result[i].CouponBasis,
                  'Funding Type': result[i].FundingType,
                  // 'Funding Index': result[i].FundIndex,
                  'Freq.': result[i].FundingFrequency,
                  'Index Rate/Spread': result[i].IndexRateSpread
                });
              }
              that.GetWFBlotterCTSF.next(Map1);
            }
          },
          error(_error: any) {
          }
        });
      } catch (error) {
        console.log('Error:', error);
      }
    });
  }


  getDataForExportToExcel(blotterData: any) {
    try {
      const exportExcelDataArray = [];
      if (blotterData && blotterData.length) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < blotterData.length; i++) {
          const exportExcelData = blotterData[i];
          for (const obj of Object.entries(exportExcelData) as any) {
            exportExcelData[obj[0]] = obj[1][0];
          }
          exportExcelDataArray.push(exportExcelData);
        }
      }

      return exportExcelDataArray;
    } catch (error) {
      console.log('Error:', error);
    }
  }



  // START BBVAEPCLI-240 Pranav D 8-Dec-2022 code changes required for export to excel  
  getExportExcelData(queryToSearch: any, _workflowId: any, queueid: any, fromDate: any, toDate: any, requestType: any, pageNo: any, pageSize: any) {
    try {
      let exportToExcelData;
      this.UserID = (this.commonfunctions.getLoggedInUserName());
      // const webMethod = this.interfaceUrl + 'getTokens';
      const webMethod = this.interfaceUrl + 'getTokensforExport';

      const parameters = {
        // "workflowId": workflowId,
        workflowCode: 'RFQ Workflow',
        queueid,
        entityId: AppConfig.settings.oRes.homeEntityID,
        pageno: pageNo,
        // pageSize: '1500',
        pageSize: pageSize,
        queryToSearch,
        LoginId: this.UserID,
        FromDate: fromDate,
        ToDate: toDate,
        Flag: requestType
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          const parseString = require('xml2js').parseString;
          // tslint:disable-next-line: only-arrow-functions
          parseString(data.getTokensforExportResult, function (_err: any, result: any) {
            that.getDataForExportToExcel((result.NewDataSet.DUMMY));
            exportToExcelData = (result.NewDataSet.DUMMY);
          });
        },
        error(_error: any) {
        }
      });
      return exportToExcelData;
    } catch (error) {
      console.log('Error:', error);
    }
  }


  async getNewsLikeAPI(newsId: any, ListName: any) {
    let result: any;
    try {
      // console.log('getNewsLikeAPI');
      const webMethod = this.interfaceUrl + 'news/PublishNews/getNewsLikeAPI';
      const that = this;
      const parameters = {
        "FinIQRequestHeader": {
          "EntityCode": "HS",
          "LoginID": AppConfig.settings.oRes.userID,
          "SourceSystem": "FinIQ",
          // "MachineIP": "172.16.23.96",
          "MachineIP": "",//Changed by SandipA for Internal IP Address Disclosure @05-Sep-23 
          "RequestID": "40467",
          "RequestAt": "5/3/2023"
      },
      "GetNewsLikeRequestDetails": {
        "News_ID": newsId,
        "ListName": "ListName"
      }
      };
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
      //   success(data: any) {
      //     // if (data.GetNewsLikeResponseDetails.Like_Value) {
      //     //   console.log(data.GetNewsLikeResponseDetails.Like_Value);
      //     //   result = data.GetNewsLikeResponseDetails;
      //     // } else {
      //     //   result = { 'Like_Value': 'N', 'Number Of Likes': '0' };
      //     // }
      //     result = data;
      //   },
      //   error(error: any) {
      //     console.log(error);
      //     result = 'N';
      //   }
      // });
      // return this.resMsg;

      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        //debugger
        result = data;
        return result;
       });
    } catch (error) {
      console.log('Error:', error);
    }
    return result;
  }


  async setNewsLikeAPI(newsId: any, likeValue: any) {
    let result: any = null;
    try {
      // console.log('setNewsLikeAPI');
      const webMethod = this.interfaceUrl + 'news/PublishNews/setNewsLikeAPI';
      //const that = this;
      const parameters = {
        "FinIQRequestHeader": {
          "EntityCode": "HS",
          "LoginID": AppConfig.settings.oRes.userID,
          "SourceSystem": "FinIQ",
          // "MachineIP": "172.16.23.96",
          "MachineIP": "",//Changed by SandipA for Internal IP Address Disclosure @05-Sep-23 
          "RequestID": "40467",
          "RequestAt": "5/3/2023"
      },
        "SetNewsLikeRequestDetails": {
          "News_ID": newsId,
          "Like_Value": "likeValue"
      }
      };
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
      //   success(data: any) {
      //     if (data.SetNewsLikeResponseDetails.Status) {
      //       // console.log(data.SetNewsLikeResponseDetails.Status);
      //       result = data.SetNewsLikeResponseDetails.Status;
      //     } else {
      //       result = null;
      //     }
      //   },
      //   error(_error: any) {
      //     // console.log(error);
      //     result = null;
      //   }
      // });
      // return this.resMsg;
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        //debugger
        result = data;
        return result;
       });
    } catch (error) {
      // console.log('Error:', error);
    }
    return result;
  }

  // Last modified by Apurva K|| 11-May-2023 
  async GetRMWProductDetails(template: any, productfilter: any, _ccy: any, _sortBy: any,
    _templateCode: any, rowsperpage: any, folderName: any, pageNo: any, search: any,
    FilterCriteria: any, ListType: any) {
    try{
      console.log("this is new funct")
      debugger
    const webMethod = this.interfaceUrl + 'rmw/RMWorkstation/GetRMWProductDetails';

    // const parameters = {
    //   Template_Name: template,
    //   Product_Name: productfilter,
    //   SortingCriteria: 'Note_Master_ID desc', // + sortBy,
    //   RowsperRequest: rowsperpage,
    //   FilterCriteria,
    //   Folder_Name: folderName,
    //   Page_No: pageNo,
    //   WhereClause: search,
    //   LoginID: AppConfig.settings.oRes.userName,
    //   ListType

    // };
    const parameters = {
      "FinIQRequestHeader": {
        "EntityCode": "HS",
        "LoginID": AppConfig.settings.oRes.userID,
        "SourceSystem": "FinIQ",
        // "MachineIP": "172.16.23.96",
        "MachineIP": "",//Changed by SandipA for Internal IP Address Disclosure @05-Sep-23 
        "RequestID": "40467",
        "RequestAt": "5/3/2023"
    },
    "RMWGenericRequest": {
        "Template_Name": template,
        "Product_Name": productfilter,
        "Isin": "",
        "WhereClause": search,
        "FilterCriteria": FilterCriteria,
        "SortingCriteria":'Note_Master_ID desc',
        "RowsperRequest": rowsperpage,
        "ShowLikes": "",
        "Folder_Name": folderName,
        "ListType": ListType,
        "Page_No": pageNo,
        "TrancheYN": ""
    }
  }
    // const that = this;
    // const response = '';
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
    //   success(data: any) {
    //     that.RMWProductDetails = [];
    //     if (data.RMWGenericResponse.items != null) {
    //       // that.RMWProductDetails = JSON.parse(data.RMWGenericResponse.items.replace(/\n/g, ''));
    //       that.RMWProductDetails = data.RMWGenericResponse;
    //     }
    //     // that.stopLoading();
    //     return that.RMWProductDetails;
    //   },
    //   error(_error: any) {
    //   }
    // });
    // return this.RMWProductDetails;
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      //debugger
      this.RMWProductDetails = data.RMWGenericResponse;
      return this.RMWProductDetails;
    });
    //return this.BookingCenter;
    // return this.http.post(webMethod, parameters);
  } catch (error) {
    //console.log('Error:', error);
  }
  }

  // Workbench search api - added by Priya L. 

  async GetRMWProductDetailsGenericFilter(searchText: any, pageNo: any, pageSize: any,
    templateCode: any, folderName: any, ListType: any) {
    try{
      this.RMWProductDetails = [];
    const webMethod = this.interfaceUrl + 'GetRMWProductDetailsGenericFilter';

    const parameters = {
      searchText,
      pageNo,
      pageSize,
      LoginID: 'DJ',
      templateCode,
      folderName,
      ListType
    };
    // const that = this;
    // const response = '';
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
    //   success(data: any) {
    //     that.RMWProductDetails = [];
    //     if (data.RMWGenericResponse.items != null) {
    //       that.RMWProductDetails = data.RMWGenericResponse;
    //     }
    //     return that.RMWProductDetails;
    //   },
    //   error(_error: any) {
    //   }
    // });
    // return this.RMWProductDetails;
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      //debugger
      
      this.RMWProductDetails = data;
      return this.BookingCenter;
    });
    //return this.BookingCenter;
    // return this.http.post(webMethod, parameters);
  } catch (error) {
    //console.log('Error:', error);
  }
  }

  async likeProduct(NoteMasterId: any) {
    try{
    const webMethod = this.interfaceUrl + 'LikeProduct';
    const parameters = {
      NoteMasterId,
      LoginID: 'DJ'

    };
    const that = this;
    // const response = '';
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
    //   success(data: any) {
    //     that.likeProductFlag = data;
    //     return that.likeProductFlag;
    //   },
    //   error(_error: any) {
    //   }
    // });
    // return this.likeProductFlag;
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      //debugger
      this.likeProductFlag = data;
      return this.likeProductFlag;
    });
    //return this.BookingCenter;
    // return this.http.post(webMethod, parameters);
  } catch (error) {
    //console.log('Error:', error);
  }
  }


  async unlikeProduct(NoteMasterId: any) {
    try{
    const webMethod = this.interfaceUrl + 'UnLikeProduct';

    const parameters = {
      NoteMasterId,
      //LoginID: 'DJ'
      LoginID: AppConfig.settings.oRes.userName

    };
    // const that = this;
    // const response = '';
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
    //   success(data: any) {
    //     that.unlikeProductFlag = data;
    //     return that.unlikeProductFlag;
    //   },
    //   error(_error: any) {
    //   }
    // });
    // return this.unlikeProductFlag;
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      //debugger
      this.unlikeProductFlag = data;
      return this.unlikeProductFlag;
    });
    //return this.BookingCenter;
    // return this.http.post(webMethod, parameters);
  } catch (error) {
    //console.log('Error:', error);
  }
  }

  ProductAttachmentList(NoteMasterID: any) {
    const webMethod = this.interfaceUrl + 'ProductAttachmentList';

    const parameters = {
      NoteMasterID
    };
    const that = this;
    const response = '';
    $.ajax({
      async: false,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      },
      success(data: any) {
        that.productattachmentlist = data;
        return that.productattachmentlist;
      },
      error(_error: any) {
      }
    });
    return this.productattachmentlist;
  }

  GetFolders(LoginID: any) {
    const webMethod = this.interfaceUrl + 'GetFolders';

    const parameters = {
      EntityID: '4',
      LoginID

    };
    const that = this;
    const response = '';
    $.ajax({
      async: false,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      },
      success(data: any) {
        that.folders = data;
        return that.folders;
      },
      error(_error: any) {
      }
    });
    return this.folders;
  }

  async SaveProductToFolder(FolderName: any, NoteMasterID: any, CustomerID: any,
    EntityID: any, User: any, ListType: any) {
    try{
    const webMethod = this.interfaceUrl + 'SaveProductToFolder';

    const parameters = {
      FolderName,
      NoteMasterID,
      CustomerID,
      EntityID,
      User,
      ListType
    };
    // const that = this;
    const response = '';
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
    //   success(data: any) {
    //     that.saveproducttofolderresp = data;
    //     return that.saveproducttofolderresp;
    //   },
    //   error(_error: any) {
    //   }
    // });
    // return this.saveproducttofolderresp;
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      //debugger
      this.saveproducttofolderresp = data;
      return this.saveproducttofolderresp;
    });
    //return this.BookingCenter;
    // return this.http.post(webMethod, parameters);
  } catch (error) {
    //console.log('Error:', error);
  }
  }


  async InsertPortfolioSharing(CreatedBy: any, GroupEdit: any, GroupView: any, PortfolioID: any,
    UserEdit: any, UserView: any, GroupDelete: any, UserDelete: any) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Portfolio/InsertPortfolioSharing';
      let res: any;
      const parameters = {
        CreatedBy,
        GroupEdit,
        GroupView,
        PortfolioID,
        UserEdit,
        UserView,
        GroupDelete,
        UserDelete
      };
      // const that = this;
      // const response = '';
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
      //   success(data: any) {
      //     res = data;
      //     // that.MappedUsersAndGroupsArr = data.getMappedUsersAndGroupsResult;
      //   },
      //   error(_error: any) {
      //   }
      // });
      // return res;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {res = data;
        return res;
      });
    } catch (error) {
      
    }
  }

  // Get Recent Requests || Added  bt Mahima Gaggad on 23rd Oct
  BBVAGetRecentRequests(queryToSearch: any, queueid: any) {
    try {
      this.UserID = (this.commonfunctions.getLoggedInUserName());
      const webMethod = this.interfaceUrl + 'getTokens_RecentRequests';
      const parameters = {
        workflowCode: 'RFQ Workflow',
        queueid: queueid,
        entityId: (this.commonfunctions.getEntityOfUser()),
        pageno: '1',
        pageSize: '70',
        queryToSearch: queryToSearch,
        LoginId: this.UserID
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          that.result = data.getTokens_NoDateFilterResult;
        },
        error(_error: any) {
        }
      });
      return this.result;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  //to get popular data for  Chart Data
  BBVAGetPopularData(productDuration: any, tenorDuration: any, underlyingDuration: any, NoOfUnderlyings: any) {
    try {
      let popularData: any = [];
      // let shares = [];
      const webMethod = this.interfaceUrl + 'GetPopularData';
      const parameters = {
        LoginID: '',//(this.commonfunctions.getLoggedInUserName()),
        productDuration,
        tenorDuration,
        underlyingDuration,
        NoOfUnderlyings
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          // console.log(data);
          popularData = data;
        },
        error(_error: any) {
          console.log("Error in get popular products");
        }
      });

      return popularData;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  //struxly video api
  FetchStruxlyVideo(ACDates: any, ACREF1: any, ACREF2: any, ACREF3: any, ACREF4: any, Barrier: any, Barrier0: any, Barrier2: any, Barrier2A: any, BarrierA: any, CPNDates: any, Ccy: any, CouponType: any,
    Cpn: any, Disclaimer: any, Index1: any, Index2: any, Index3: any, Index4: any, Index5: any, Indices: any, Investment: any, Kid: any, Md: any, Name: any, Pay2: any, Ref1: any, Ref2: any, Ref3: any,
    RefN: any, RefN1: any, RefN2: any, RefN3: any, RefN4: any, Strikedate: any, Tenor: any, Today: any, TriggerC: any, TriggerC2: any, TriggerC3: any, TriggerR: any,
    TriggerR2: any, TriggerR3: any, TriggerRN: any, TriggerRN1: any, TriggerRN2: any, CPNFrequency: any, ACPFrequency: any, rfq_id: any, Noncallprd: any, StoryBoardId: any, Pay2Shifter: any,
    LeverageYN: any, Strike: any, LowstrikeR: any, LowstrikeRP: any, StrikeRounded: any,
    // BBVACLI-357 CLN video parameters Pranav D 17-Aug-2022
    Index: any, References: any, Issuedate: any, Notional: any, Attach: any, Detach: any, Ref4: any, Attach0: any, Cpnamount: any, Notional2: any, Dates: any, Cpnamount2: any,
    Cpnmd: any, Barrierlevel: any, Starlevel: any) {
    // JIRA BBVACLI-198 extra parameters sent to API to get video
    try {
      let videoapires: any = [];
      // let shares = [];
      const webMethod = this.interfaceUrl + 'setdataforVDO';
      const parameters = {
        ACDates,
        ACREF1,
        ACREF2,
        ACREF3,
        ACREF4,
        Barrier,
        Barrier0,
        Barrier2,
        Barrier2A,
        BarrierA,
        CPNDates,
        Ccy,
        CouponType,
        Cpn,
        Disclaimer,
        // Frequency,
        Index1,
        Index2,
        Index3,
        Index4,
        Index5,
        Indices,
        Investment,
        Kid,
        Md,
        Name,
        Pay2,
        Ref1,
        Ref2,
        Ref3,
        RefN,
        RefN1,
        RefN2,
        RefN3,
        RefN4,
        Strikedate,
        Tenor,
        Today,
        TriggerC,
        TriggerC2,
        TriggerC3,
        TriggerR,
        TriggerR2,
        TriggerR3,
        TriggerRN,
        TriggerRN1,
        TriggerRN2,
        CPNFrequency,
        ACPFrequency,
        rfq_id,
        "entity_id": (this.commonfunctions.getEntityOfUser()),
        User: (this.commonfunctions.getLoggedInUserName()),
        Noncallprd,
        StoryBoardId,
        Pay2Shifter,
        LeverageYN,
        Strike,
        LowstrikeR,
        LowstrikeRP,
        StrikeRounded,
        Index,
        References,
        Issuedate,
        Notional,
        Attach,
        Detach,
        Ref4,
        Attach0,
        Cpnamount,
        Notional2,
        Dates,
        Cpnamount2,
        Cpnmd,
        Barrierlevel,
        Starlevel
      };
      // JIRA BBVACLI-198 extra parameters sent to API to get video 
      console.log('parameters', parameters);
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          console.log(data);

          videoapires = data;


        },
        error(_error: any) {
          console.log("Error in Fetch Struxly Video");
          videoapires = [];
        }
      });

      return videoapires;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  //updateScheduleFlagAndRFQ || by suvarna || 04Jan2022
  async updateScheduleFlagAndRFQ(RFQID: any, PSID: any, remark: any) {
    try {
      let cancelRes: any;
      const webMethod = this.interfaceUrl + 'updateScheduleFlagAndRFQ';
      const parameters = {
        "userID": (this.commonfunctions.getLoggedInUserName()), //"BANCO BPI",
        "RFQID": RFQID, //"",
        "PSID": PSID, //"189",
        "remark": remark // "CANCEL"
      };
      // const that = this;
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
      //   success(data: any) {
      //     console.log(data);
      //     cancelRes = data;
      //   },
      //   error(_error: any) {
      //     console.log("Error in updateScheduleFlagAndRFQ");
      //   }
      // });
      // return cancelRes;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        //debugger
        cancelRes = data;
        return cancelRes;
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  // Credit Linked Note API starts here 11-Apr-2022 

  GetReferenceEntityLookupData() {
    try {
      let refEntityData: any;
      const webMethod = this.interfaceUrl + 'GetReferenceEntityLookupData';
      const parameters = {
        "userID": (this.commonfunctions.getLoggedInUserName()),
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          console.log(data.GetReferenceEntityLookupDataResult);
          refEntityData = data.GetReferenceEntityLookupDataResult;
          console.log(refEntityData);
        },
        error(_error: any) {
          console.log("Error in GetReferenceEntityLookupData");
        }
      });
      return refEntityData;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  GetCLNMaturityDate(format: any, tenor: any, issueDate: any) {
    try {
      let refEntityData: any;
      const webMethod = this.interfaceUrl + 'GetCLNMaturityDate';
      const parameters = {
        "format": format,
        "tenor": tenor,
        "issueDate": issueDate
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          console.log(data);
          refEntityData = data.GetCLNMaturityDateResult;
        },
        error(_error: any) {
          console.log("Error in GetCLNMaturityDate");
        }
      });
      return refEntityData;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  // DCN Ccy Pair Fetch API
  ccypairsDCN =[]
  CcypairsDCN(_iEntityID: any, iProductId: any, ProductCode: any, Mode: any, OptionCut: any, sAssetIdentifier: any, FetchOnlyStandardPairs: any, selectedDepoCcy: any, selectedAlternatCcy: any, CcySearch: any) {
    try {
      let refEntityData: any;
      const webMethod = this.interfaceUrl + 'GetCcyPairs';
      const parameters = {
        "iEntityID": (this.commonfunctions.getEntityOfUser()),
        "iProductId": iProductId,
        "ProductCode": ProductCode,
        "Mode": Mode,
        "OptionCut": OptionCut,
        "sAssetIdentifier": sAssetIdentifier,
        "FetchOnlyStandardPairs": FetchOnlyStandardPairs,
        "selectedDepoCcy": selectedDepoCcy,
        "selectedAlternatCcy": selectedAlternatCcy,
        "CcySearch": CcySearch
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          //console.log(data);
          refEntityData = data.Get_Ccy_PairsResult;
          that.ccypairsDCN = data.Get_Ccy_PairsResult
        },
        error(error: any) {
          // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D
         if(error.status === 420){ // BBVACLI-1090 || point #1. Standard http 501 error code used , It should be custom (non-standard) code 

           that.commonfunctions.setTokenLogoutFlg(true);
         }
      }
    });
    that.ccypairsDCN = refEntityData
      return refEntityData;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // added by Suvarna P || 15Jun2022 || DCN Date Calculation api || assigned by Pranav D Pranav D || start

  GetSpotDateFromOffset(startDate: any, offset: any) {
    try {
      // const webMethod = this.interfaceUrl + 'BBVAGetDates';
      var spotDate = '';
      const webMethod = this.interfaceUrl + 'GetSpotDateFromOffset';
      // const parameters = {
      const parameters = {
        "startDate": startDate,
        // "startDate": startDate,
        "offset": offset
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          // console.log(data);
          spotDate = data.GetSpotDateFromOffsetResult;
          return spotDate;
        },
        error(_error: any) {
        }
      });
      return spotDate;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  GetMaturityDateUsingBusinessDays(StartDate: any, SoftTenorCode: any, HolidayCurrencyCsv: any) {
    try {
      // const webMethod = this.interfaceUrl + 'BBVAGetDates';
      var maturityDate = '';
      const webMethod = this.interfaceUrl + 'GetMaturityDateUsingBusinessDays';
      const parameters = {
        "StartDate": StartDate,
        "SoftTenorCode": SoftTenorCode,
        "HolidayCurrencyCsv": HolidayCurrencyCsv
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          console.log(data);
          maturityDate = data.GetMaturityDateUsingBusinessDaysResult;
          return maturityDate;
        },
        error(_error: any) {
        }
      });
      return maturityDate;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  GetMaturityDateForNegativeTenor(strInputDate: any, strTenor: any, holidayCcy: any) {
    try {
      // const webMethod = this.interfaceUrl + 'BBVAGetDates';
      var maturityDate = '';
      const webMethod = this.interfaceUrl + 'GetMaturityDateForNegativeTenor';
      const parameters = {
        "strInputDate": strInputDate,
        "strTenor": strTenor,
        "holidayCcy": holidayCcy
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          console.log(data);
          maturityDate = data.GetMaturityDateForNegativeTenorResult;
          return maturityDate;
        },
        error(_error: any) {
        }
      });
      return maturityDate;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // added by Suvarna P || 15Jun2022 || DCN Date Calculation api || assigned by Pranav D Pranav D || end

  // START : Pranav D 16-Jun-2022 getBidAsk rate DCN
  GetBidAskRate(ccyPair: any, productCode: any, mode: any, userid: any) {
    try {
      // const webMethod = this.interfaceUrl + 'BBVAGetDates';
      var bidAskRate: any;
      const webMethod = this.interfaceUrl + 'Get_FinIQ_BidAsk_Wrapper';
      const parameters = {
        "I_StandardPair": ccyPair,
        "I_ProductCode": productCode,
        "I_Mode": mode,
        "UserID": userid
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          // console.log(data);
          bidAskRate = data.Get_FinIQ_BidAsk_WrapperResult;
          return bidAskRate;
        },
        error(_error: any) {
        }
      });
      return bidAskRate;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // END : Pranav D 16-Jun-2022 getBidAsk rate DCN

  // START : Pranav D 17-Jun-2022 get location of user
  GetBookLocation(user: any, entityId: any) {
    try {
      // const webMethod = this.interfaceUrl + 'BBVAGetDates';
      var location: any;
      const webMethod = this.interfaceUrl + 'GetBookLocation';
      const parameters = {
        "user": user,
        "entityId": entityId
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          // console.log(data);
          location = data.GetBookLocationResult;
          return location;
        },
        error(_error: any) {
        }
      });
      return location;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // END : Pranav D 17-Jun-2022 get location of user

  // START : Pranav D 17-Jun-2022 get location of user
  optCutArr:any;
  GetFXOptionCut(user: any) {
    try {
      // const webMethod = this.interfaceUrl + 'BBVAGetDates';
      var location: any;
      const webMethod = this.interfaceUrl + 'GetFXOptionCut';
      const parameters = {
        "user": user,
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          // console.log(data);
          location = data.GetFXOptionCutResult;
          this.optCutArr = location;
          return location;
        },
        error(_error: any) {
        }
      });
      return location;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // END : Pranav D 17-Jun-2022 get location of user

  // START : Pranav D 17-Jun-2022 get location of user
  specialSpreadData(DepoCcy: any, AltCcy: any, DealDepoDays: any, CustomerName: any, EntityId: any, ProductID: any, ProductCode: any, DealAmount: any, BuySellDirection: any) {
    try {
      // const webMethod = this.interfaceUrl + 'BBVAGetDates';
      var specialSpreadData: any;
      const webMethod = this.interfaceUrl + 'GetFXSpecialSpreadsData';
      const parameters = {
        "DepoCcy": DepoCcy,
        "AltCcy": AltCcy,
        "DealDepoDays": DealDepoDays,
        "CustomerName": CustomerName,
        "EntityId": EntityId,
        "ProductID": ProductID,
        "ProductCode": ProductCode,
        "DealAmount": DealAmount,
        "BuySellDirection": BuySellDirection
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          // console.log(data);
          specialSpreadData = data.GetFXSpecialSpreadsDataResult;
          return specialSpreadData;
        },
        error(_error: any) {
        }
      });
      return specialSpreadData;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // END : Pranav D 17-Jun-2022 get location of user

  // START : Suvarna P || 04-Jul-2022 || DCN Date calculation api || start
  DCNDateCalculationAPI(DepoCcy: any, AltCcy: any, CurrencyPair: any, TradeDate: any, Fixing_Frequency: any, Settlement_Frequency: any, Tenor_Code: any, iProductId: any, I_ProductCode: any,
    I_Mode: any, optioncut: any, Tenor: any, CR_Settlement_Days: any, DR_Settlement_Days: any, Prem_Settlement_Days: any,Format:any) {
    try {
      var datesData: any;
      const webMethod = this.interfaceUrl + 'Get_FinIQ_CalculateDatesWrapper';
      const parameters = {
        "DepoCcy": DepoCcy, //"EUR",
        "AltCcy": AltCcy, //"USD",
        "CurrencyPair": CurrencyPair, //"EUR - USD",
        "TradeDate": TradeDate, //"07-Jul-2022",
        "Fixing_Frequency": Fixing_Frequency, //"",
        "Settlement_Frequency": Settlement_Frequency, //"",
        "Tenor_Code": Tenor_Code, //"3M",
        "iProductId": iProductId, //5,
        "I_ProductCode": I_ProductCode, //"STRANGLE",
        "I_Mode": I_Mode, //"FXOSEN",
        "optioncut": optioncut, //"TOK",
        "Tenor": Tenor, //"3M",
        "CR_Settlement_Days": CR_Settlement_Days, //"2",
        "DR_Settlement_Days": DR_Settlement_Days, //"2",
        "Prem_Settlement_Days": Prem_Settlement_Days,
        "iEntityID": (this.commonfunctions.getEntityOfUser()), //"2"
        "Format":Format
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          console.log(data.Get_FinIQ_CalculateDatesWrapperResult);
          datesData = data.Get_FinIQ_CalculateDatesWrapperResult[0];
          console.log(datesData);
          return datesData;
        },
        error(_error: any) {
        }
      });
      return datesData;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // START : Suvarna P || 04-Jul-2022 || DCN Date calculation api || end
  // START : Pranav D 8-Jul-2022 get location of user
  GetRMType(user: any, entityId: any) {
    try {
      // const webMethod = this.interfaceUrl + 'BBVAGetDates';
      var location: any;
      const webMethod = this.interfaceUrl + 'GetRMType';
      const parameters = {
        "user": user,
        "entityId": entityId
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          // console.log(data);
          location = data;
          return location;
        },
        error(_error: any) {
        }
      });
      return location;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // END : Pranav D 8-Jul-2022 get location of user

  // START : Suvarna P ||  11-July-2022 || CheckHolidayOnSelectedDate api || assigned by Pranav D
  CheckHolidayOnSelectedDate(AltCcy: any, DateMode: any, DepoCcy: any, SelectedDate: any, Mode: any, ProductId: any, noOfDays: any) {
    try {
      var CheckHolidayOnSelectedDateResult: any;
      const webMethod = this.interfaceUrl + 'CheckHolidayOnSelectedDate';
      const parameters = {
        // "user": user,
        // "entityId": entityId
        "AltCcy": AltCcy,//"USD",
        "CurrencyBasedWeekendHolidayCheck": false,//false,
        "DateMode": DateMode,//"MaturityDate",
        "DealEntry_Mode": Mode, //"FXOSEN",//"FXOSEN",
        "DepoCcy": DepoCcy,//"EUR",
        "EnableDynamicWeekendCheck": false,//false,
        "EntityId": (this.commonfunctions.getEntityOfUser()),//"4",
        "GlobalCcy": "USD",//"USD",
        "LocalCcy": "EUR",//"USD",
        "NoDays": noOfDays, //"92" ,//"92",
        "ProductId": ProductId,  //3,//"3",
        "SelectedDate": SelectedDate//"10-Jul-2022"
      };

      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          console.log(data);
          // location = data;
          CheckHolidayOnSelectedDateResult = data.CheckHolidayOnSelectedDateResult;
          return CheckHolidayOnSelectedDateResult;
        },
        error(_error: any) {
        }
      });
      return CheckHolidayOnSelectedDateResult;
    } catch (error) {
      console.log('Error:', error);
    }

  }
  // END : Suvarna P ||  11-July-2022 || CheckHolidayOnSelectedDate api || assigned by Pranav D
  // START : Suvarna P ||  11-July-2022 || Get_ProdDetails fpr DCN api || assigned by Pranav D
  Get_ProdDetails() {
    try {
      var GetProdDetailsResult: any;
      const webMethod = this.interfaceUrl + 'Get_ProdDetails';
      // const webMethod = "http://localhost:4000/api/" + 'Get_ProdDetails';
      const parameters = {
        Product_Code: "FXProducts"
      };

      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          console.log(data);
          // location = data;
          GetProdDetailsResult = data.GetProdDetailsResult;
          return GetProdDetailsResult;
        },
        error(_error: any) {
        }
      });
      return GetProdDetailsResult;
    } catch (error) {
      console.log('Error:', error);
    }

  }
  // END : Suvarna P ||  11-July-2022 || Get_ProdDetails fpr DCN api || assigned by Pranav D

  // START : Suvarna P ||  21-July-2022 || Get_ProdDetails fpr DCN api || assigned by Pranav D
  Get_ExcpRulesValidationWrapper(DepoCcy: any, AltCcy: any, StanderPairCurrencyPair: any, DealAmount: any, SalesSpread: any, ProductID: any, ProductCode: any, DealDepoDays: any) {
    try {
      var Get_ExcpRulesValidationWrapperMsg = "";
      const webMethod = this.interfaceUrl + 'Get_ExcpRulesValidationWrapper';
      // const webMethod = "http://localhost:4000/api/" + 'Get_ExcpRulesValidationWrapper';
      const parameters = {
        "EntityId": (this.commonfunctions.getEntityOfUser()), //4,
        "DepoCcy": DepoCcy, //"USD",
        "AltCcy": AltCcy, //"JPY",
        "DealAmount": DealAmount, //100000.00,
        "DealDepoDays": DealDepoDays, //1.00,
        "CalculatedYield": 0.0,
        "EnteredDelta": 0.0,
        "CounterpartyCode": "",
        "BookName": "",
        "DealerName": "",
        "CustomerName": "",
        "CustDocType": "",
        "CustomerIdType": "",
        "CustomerPan": "",
        "CrossBroder": "",
        "CustomerRelPckCode": "",
        "CustomerStaffIndicator": "",
        "IncludeRouteToDealerRules": "N",
        "ManagedCenter": "",
        "Mode": "FXOSEN",
        "SalesSpread": SalesSpread, //0.12,
        "ProductID": ProductID, //1,
        "StanderPairCurrencyPair": StanderPairCurrencyPair, //"USD - JPY",
        "Accredited_Investor_YN": "N",
        "ProductCode": ProductCode, //"FXProducts", //"FXOPTION",
        "BuySellFlag": "",
        "CallPutFlag": "",
        "BarrierType": ""
      };

      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          console.log(data);
          // location = data;
          // if(data.Get_ExcpRulesValidationWrapperResult.IsHardBlock){
          if (data.Get_ExcpRulesValidationWrapperResult.status === "1") {
            Get_ExcpRulesValidationWrapperMsg = data.Get_ExcpRulesValidationWrapperResult.Remarks;
          }
          else {
            Get_ExcpRulesValidationWrapperMsg = "";
          }
          return Get_ExcpRulesValidationWrapperMsg;
        },
        error(_error: any) {
        }
      });
      return Get_ExcpRulesValidationWrapperMsg;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // END : Suvarna P ||  21-July-2022 || Get_ProdDetails fpr DCN api || assigned by Pranav D

  // START : Pranav D 23-Aug-2022 GetDCNBankSpreadCost

  GetDCNBankSpreadCost(format: any, notionalRef: any, maturityRef: any, ccyPair: any, Depoccy: any) {
    try {
      var GetProdDetailsResult: any;
      const webMethod = this.interfaceUrl + 'GetDCNBankSpreadCost';
      const parameters = {
        format,
        notionalRef,
        maturityRef,
        ccyPair,
        Depoccy
      };

      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          // console.log(data);
          // location = data;
          GetProdDetailsResult = data.GetDCNBankSpreadCostResult;
          return GetProdDetailsResult;
        },
        error(_error: any) {
        }
      });
      return GetProdDetailsResult;
    } catch (error) {
      console.log('Error:', error);
    }

  }

  // END : Pranav D 23-Aug-2022 GetDCNBankSpreadCost


  // START : GetLinkProviderStatus Pranav D 11-Oct-2022 BBVACLI-509

  GetLinkProviderStatus(LPName: any) {
    try {
      var GetLPStatus: any;
      const webMethod = this.interfaceUrl + 'GetLinkProviderStatus';
      const parameters = {
        LPName
      };

      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          // console.log('lp status',data);
          // location = data;
          GetLPStatus = data.GetLinkProviderStatusResult;
          return GetLPStatus;
        },
        error(_error: any) {
        }
      });
      return GetLPStatus;
    } catch (error) {
      console.log('Error:', error);
    }

  }

  // END : GetLinkProviderStatus Pranav D 11-Oct-2022 BBVACLI-509

  // added by Suvarna P || 04Aug2022 || to change sidebar counter while redirection || Assigned by Pranav D 
  setSidebarCounter(counter: any) {
    this.sidebarCounter.next(counter);
  }

  // fetch video and document list
  async getVideoAndDocs(LoginId: any, RowsPerPage: any) {
    try {
      var videoanddoclist: any[] = [];
      const webMethod = this.interfaceUrl + 'Get_VideoAndAttachmentLinks';
      const parameters = {
        LoginId,
        RowsPerPage
      };

      // const that = this;
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
      //   success(data: any) {
      //     // console.log('lp status',data);
      //     // location = data;
      //     videoanddoclist = data;
      //     return videoanddoclist;
      //   },
      //   error(_error: any) {
      //   }
      // });
      // return videoanddoclist;

      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        //debugger
        videoanddoclist = data;
        return videoanddoclist;
       });

    } catch (error) {

    }
  }

  //get underlying data for byu/sell recommendations
  async getUnderlyingListData(pageNo: any, pageSize: any, vol: any) {
    try {
      var underlyingList: any[] = [];;
      const webMethod = this.interfaceUrl + 'Get_UnderlyingListData';
      const parameters = {
        PageNo: pageNo,
        RowsPerPage: pageSize,
        Vol: vol
      };
      // const that = this;
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
      //   success(data: any) {
      //     // console.log('lp status',data);
      //     // location = data;
      //     underlyingList = data
      //     return underlyingList;
      //   },
      //   error(_error: any) {
      //   }
      // });
      // return underlyingList;
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        //debugger
        underlyingList = data;
        return underlyingList;
       });

    } catch (error) {

    }
  }
  // START : Pranav D 31-Oct-2022  GetReofferOrUpfront BBVAEPCLI-122

  GetReofferOrUpfront(dayCount:any, yearBasis:any, upfront:any, reoffer:any, issuePrice: any) {
    try {
      var getUpfront: any;
      const webMethod = this.interfaceUrl + 'GetReofferOrUpfront';
      const parameters = {
        dayCount,
        yearBasis,
        upfront,
        reoffer
      };

      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data:any) {
          getUpfront = data.GetReofferOrUpfrontResult;
          return getUpfront;
        },
        error(_error: any) {
        }
      });
      return getUpfront;
    } catch (error) {
      console.log('Error:', error);
    }

  }
  GetSpotRatesCrossDetails() {
    try {
      var GetLPStatus: any;
      const webMethod = this.interfaceUrl + 'GetSpotRatesCrossDetails';
      const parameters = {

      };

      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data:any) {
          // console.log('lp status',data);
          // location = data;
          GetLPStatus = data.GetSpotRatesCrossDetailsResult;
          return GetLPStatus;
        },
        error(_error: any) {
        }
      });
      return GetLPStatus;
    } catch (error) {
      console.log('Error:', error);
    }

  }

  // Note saving functions Pranav D 8-Nov-2022
//Last modified by APurva K|| 14-Apr-2023
   InsertNoteDetails(RMR_Active_YN: any, RMR_Created_At: any, RMR_Description: any,
    RMR_Modified_At: any, RMR_Title: any, RMR_Mode: any, RMR_IsNotes: any, RMR_TaskDone_YN: any, RMR_ID: any) {
    try {
      var insertNotes: any;
      const webMethod = this.interfaceUrl + 'client/ClientAlertEngagement/InsertRMReminderNotesDetails';
      const parameters = {
        rmR_Active_YN: RMR_Active_YN,
        rmR_Created_At: RMR_Created_At,
        rmR_Created_By: AppConfig.settings.oRes.userName,
        rmR_Description:RMR_Description,
        rmR_ID: RMR_ID,
        rmR_Login: AppConfig.settings.oRes.userName,
        rmR_Modified_At: RMR_Modified_At,
        rmR_Modified_By: AppConfig.settings.oRes.userName,
        rmR_RM_ID: AppConfig.settings.oRes.userName,
        rmR_Title:RMR_Title,
        rmR_Mode: RMR_Mode,
        rmR_IsNotes: RMR_IsNotes,
        rmR_TaskDone_YN: RMR_TaskDone_YN
      };

      // const that = this;
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
      //   success(data:any) {
      //     insertNotes = data;
      //     return insertNotes;
      //   },
      //   error(_error: any) {
      //   }
      // });
      // return insertNotes;
      // return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      //   //debugger
      //   return data;
        
      // });
     // console.log('parameters', parameters);
      return this.http.post(webMethod, parameters).toPromise();
    } catch (error) {
      console.log('Error:', error);
    }

  }

  // get notes Pranav D 3-Jan-2023 BBVAEPCLI-106

  async GetNoteDetails(Misc1: any, Misc2: any) {
    try {
      var insertNotes: any;
      const webMethod = this.interfaceUrl + 'Get_RM_ReminderNotesDetails';
      const parameters = {
        LoginID: AppConfig.settings.oRes.userName,
        Misc1,
        Misc2,
        RMID: AppConfig.settings.oRes.userName
      };

      // const that = this;
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
      //   success(data:any) {
      //     insertNotes = data;
      //     return insertNotes;
      //   },
      //   error(_error: any) {
      //   }
      // });
      // return insertNotes;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        //debugger
        insertNotes = data;
        return insertNotes;
      });
    } catch (error) {
      console.log('Error:', error);
    }

  }

  // delete note and todo ||Modified by Apurva K || 08-May-2023
   DeleteNoteToDO(RMR_ID: any) {
    try {
      const webMethod = this.interfaceUrl + 'client/ClientAlertEngagement/DeleteRMReminderNotesDetails';
      const parameters = {
        rmR_ID:RMR_ID
      };
      // const that = this;
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
      //   success(data: any) {
      //     insertNotes = data;
      //     return insertNotes;
      //   },
      //   error(_error: any) {
      //   }
      // });
      // return insertNotes;
      return this.http.post(webMethod, parameters).toPromise();
      //return this.BookingCenter;
      // return this.http.post(webMethod, parameters);
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // START : Chat functionality GetChatMessagesByPageNo Pranav D 10-Jan-2023
  async GetChatMessagesByPageNo(PageSize: any, PageNo: any) {
    try {
      var receibedMesages: any;
      const webMethod = this.interfaceUrl + 'GetChatMessagesByPageNo';
      const parameters = {
        LoginID: (this.commonfunctions.getLoggedInUserName()),
        PageSize,
        PageNo,
      };
      // const that = this;
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
      //   success(data: any) {
      //     receibedMesages = data.GetChatMessagesByPageNoResult;
      //     return receibedMesages;
      //   },
      //   error(_error: any) {
      //   }
      // });
      // return receibedMesages;
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        //debugger
        receibedMesages = data;
        return receibedMesages;
       });
    } catch (error) {
    }
  }
  // END : Chat functionality GetChatMessagesByPageNo Pranav D 10-Jan-2023
  ForgotPassword(LoginID: any, EmailID: any, PasswordHistoryCount: any, LSS_Password_NotificationMethod: any) {
    try {
      var receibedMesages: any;
      const webMethod = this.interfaceUrl + 'ForgotPassword';
      const parameters = {
        LoginID: LoginID,
        EmailID: EmailID,
        IPAddress: '',
        PasswordHistoryCount: PasswordHistoryCount,
        LSS_Password_NotificationMethod: LSS_Password_NotificationMethod,
        UsePasswordHistory: PasswordHistoryCount,
        EnableMultiEntity: '',
        GlobalServerDateTime: ''
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          receibedMesages = data;
          return receibedMesages;
        },
        error(_error: any) {
        }
      });
      return receibedMesages;
    } catch (error) {
    }
  }
  async fnSaveLayout(Sequence: any) {
    try {
      let receivedmsg: any;
      const webMethod = AppConfig.settings.apiBaseUrl + 'wb/mapTileToUser';
      const parameters = {
        "UserName": AppConfig.settings.oRes.userName,
        "Sequence": Sequence,
        "EntityId": AppConfig.settings.oRes.homeEntityID
      };
      // const that = this;
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
      //   success(data: any) {
      //     receivedmsg = data;
      //     return receivedmsg;
      //   },
      //   error(_error: any) {
      //   }
      // });
      // return receivedmsg;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        //debugger
        receivedmsg = data;
        return receivedmsg;
      });
      //return this.BookingCenter;
      // return this.http.post(webMethod, parameters);
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  fnGetLayoutDetails() {
    const webMethod = this.interfaceUrl + 'wb/getTileUserMapping'
    const parameters = {
      "UserName": AppConfig.settings.oRes.userName,
      "EntityId": AppConfig.settings.oRes.homeEntityID
    }
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  Notify_OTP(LoginID: any, strOTP: any) {
    try {
      var receivedMesages: any;
      const webMethod = this.interfaceUrl + 'Notify_OTP';
      const parameters = {
        I_EntityId: "4",
        I_LoginId: LoginID,
        I_LSS_OTP_NotificationMethod: "MAIL",
        strOTP,
        mode: "MAIL"
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          receivedMesages = data;
          return receivedMesages;
        },
        error(_error: any) {
        }
      });
      return receivedMesages;
    } catch (error) {
    }
  }
  SendChatToHelpDesk(message: any, sentAt: any) {
    try {
      var receibedMesages: any;
      const webMethod = this.interfaceUrl + 'SendChatToHelpDesk';
      const parameters = {
        loginId: (this.commonfunctions.getLoggedInUserName()),
        messageText: message,
        sentAt: sentAt
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          receibedMesages = data;
          return receibedMesages;
        },
        error(_error: any) {
        }
      });
      return receibedMesages;
    } catch (error) {
    }
  }
  async GetWatchlistData_ForCard(pageSize: any, pageNo: any) {
    try {
      var receibedMesages: any;
      const webMethod = this.interfaceUrl + 'GetWatchlistData_ForCard';
      const parameters = {
        LoginId: (this.commonfunctions.getLoggedInUserName()),
        PageSize: pageSize,
        PageNo: pageNo
      };
      // const that = this;
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
      //   success(data: any) {
      //     receibedMesages = data;
      //     return receibedMesages;
      //   },
      //   error(_error: any) {
      //   }
      // });
      // return receibedMesages;
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        //debugger
        receibedMesages = data;
        return receibedMesages;
       });
    } catch (error) {
    }
  }
  //Delete WatchID
  async DeleteProductWatchId(WatchlistId: any,) {
    try {
      let cancelRes: any;
      const webMethod = this.interfaceUrl + 'DeleteProductFromWatchlist';
      const parameters = {
        "WatchId": WatchlistId, //"",
      };
      // const that = this;
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
      //   success(data: any) {
      //     console.log(data);
      //     cancelRes = data;
      //   },
      //   error(_error: any) {
      //     console.log("Error in DeleteProductFromWatchlist");
      //   }
      // });
      // return cancelRes;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        //debugger
        cancelRes = data;
        return cancelRes;
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }
  //  AcceptedUserAgreement() HasAcceptedUserAgreement()
  // <Start> Added by Vaibhav B and Riddhi P | 15-02-2023 
  HasAcceptedUserAgreement(username: any, _entityId: any) {
    try {
      //this.UserID = (this.commonfunctions.getLoggedInUserName());
      var res: any;
      const webMethod = this.interfaceUrl + 'HasAcceptedUserAgreement';
      const parameters = {
        LoggedInUserID: username,
        LoggedInUserGroupID: "",
        LoggedInUserRole: "",
        LoggedInUserHomeEntityID: "4"
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          res = data;
          return res;
        },
        error(error: any) {
          console.log('Error:', error);
        }
      });
      return res;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  AcceptedUserAgreement(username: any, _entityId: any) {
    try {
      //this.UserID = (this.commonfunctions.getLoggedInUserName());
      var res: any;
      const webMethod = this.interfaceUrl + 'AcceptUserAgreement';
      const parameters = {
        LoggedInUserID: username,
        LoggedInUserGroupID: "",
        LoggedInUserRole: "",
        LoggedInUserHomeEntityID: "4"
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          res = data;
          return res;
        },
        error(error: any) {
          console.log('Error:', error);
        }
      });
      return res;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // <End> Added by Vaibhav B and Riddhi P | 15-02-2023
  GenerateOTP(username: any, _entityId: any) {
    try {
      //this.UserID = (this.commonfunctions.getLoggedInUserName());
      var res: any;
      const webMethod = this.interfaceUrl + 'GenerateOTP';
      const parameters = {
        GroupID: "BBVASales",
        EntityID: "4",
        UserID: username,
        IPAddress: "::1",
        AuthMethod: "MAILOTP"
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          res = data;
          return res;
        },
        error(error: any) {
          console.log('Error:', error);
        }
      });
      return res;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  CheckUserWiseMFA(username: any) {
    try {
      //this.UserID = (this.commonfunctions.getLoggedInUserName());
      var res: any;
      const webMethod = this.interfaceUrl + 'CheckUserWiseMFA';
      const parameters = {
        LoginID: username,
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data: any) {
          res = data;
          return res;
        },
        error(error: any) {
          console.log('Error:', error);
        }
      });
      return res;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  async fnGetProdTemplate(product : any) {
    try {
      var templateMappingArr;
      const webMethod = this.interfaceUrl + 'PHXAutocallableTemplate';
        // const webMethod = 'http://localhost:4000/api/' + 'PHXAutocallableTemplate';
        // const webMethod = 'https://bbvaepricer.equity-connect.com/bbvaserver/' + 'PHXAutocallableTemplate';
        const that = this;
        const parameters = {
            // Product: 'AutocallablePhoenix',
            Product: product,
        };
        // $.ajax({
        //     async: false,
        //     crossDomain: true,
        //     type: 'POST',
        //     url: webMethod,
        //     data: JSON.stringify(parameters),
        //     contentType: 'application/json; charset=utf-8',
        //     dataType: 'json',
        //     headers: this.getHeaders(),  // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D

        //     success(data: any) {
        //         templateMappingArr = data;
        //         return templateMappingArr;
        //         //  
        //     },
        //     error(error: any) {
        //       // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D
        //       if(error.status === 420){ // BBVACLI-1090 || point #1. Standard http 501 error code used , It should be custom (non-standard) code 

        //         that.commonfunctions.setTokenLogoutFlg(true);
        //       }
        //     }
           
        // });
        return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
          templateMappingArr = data.getMappedUsersAndGroupsResult;
          return templateMappingArr;
        });
    } catch (error) {
         
    }
    return  templateMappingArr;
}

getHeaders(){
  var header = {
  'Cache-Control': 'no-cache',
  'Access-Control-Allow-Origin': '*',
  'token': sessionStorage.getItem('token'),
  'username': this.commonfunctions.getLoggedInUserName()
  }
  return header;
}
FetchNotionalBasedTradingValidations(loginID: any, clientID: any, notional: any, notionalCCY: any, format:any) {
  try {
    var res: any;
    let webMethod = environment.interfaceURL + 'FetchNotionalBasedTradingValidations';
    const parameters = {
      loginID,
      clientID,
      notional,
      notionalCCY,
      format
    };
    const that = this;
    $.ajax({
      async: false,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: this.getHeaders(), // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D
      success(data: any) {
        res = data;
        return res;
      },
      error(error: any) {
         // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D
        if(error.status === 420){ // BBVACLI-1090 || point #1. Standard http 501 error code used , It should be custom (non-standard) code 

          that.commonfunctions.setTokenLogoutFlg(true);
        }
    }
    });
    return res;
  } catch (error) {
 }
}
// END : Pranav D 29-Mar-2023
DCNOrderStatus(RFQID: any) {
  try {
    var res: any;
    const webMethod = this.interfaceUrl + 'OrderStatus';
    const parameters = {
      quoteRequestID: RFQID
    };
    const that = this;
    $.ajax({
      async: false,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: this.getHeaders(), // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D
      success(data: any) {
        res = data;
        return res;
      },
      error(error: any) {
         // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D
        if(error.status === 420){ // BBVACLI-1090 || point #1. Standard http 501 error code used , It should be custom (non-standard) code 

          that.commonfunctions.setTokenLogoutFlg(true);
        }
    }
    });
    return res;
  } catch (error) {
 }
}
//END: Added DCN order status | Anubhav Goyal | 12-Apr-2023 | To display Fetch Order Status and display current queue status of order      
// START: API Call for Fee Policy | Anubhav Goyal | 2-June-2023 | BBVAEPCLI-567 New logic in terms of fee policy (Number 11 in Blanca's mail)
GetFeePolicy(IssuePrice:any,ReofferPrice:any,TenorinDays:any){
  try{
    var res;
    const webMethod = this.interfaceUrl + 'GetFeePolicy';
    const parameters = {
      IssuePrice:IssuePrice,
      ReofferPrice:ReofferPrice,
      TenorinDays:TenorinDays
    };
    const that = this
    $.ajax({
      async: false,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: this.getHeaders(),
      success(data: any) {
          res = data;
          return res; 
      },
      error(error: any) {
        // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D
        if(error.status === 420){ // BBVACLI-1090 || point #1. Standard http 501 error code used , It should be custom (non-standard) code 
 
          that.commonfunctions.setTokenLogoutFlg(true);
        }
      }    
  });

  }catch(error){

  }

  return res;
 }
 // END : API Call for Fee Policy | Anubhav Goyal | 2-June-2023 | BBVAEPCLI-567 New logic in terms of fee policy (Number 11 in Blanca's mail)
//Anubhav Goyal | Added orderRejectionReason | 12-Apr-2023
DCNTrade(RFQID: any, currency: any, notional: any,generateOrder: boolean, sendMessage: boolean, loginID: any,  orderRejectionReason:any, buttonName:any, blotterFetchTimeStamp:any) {
  try {
    var res: any;
    const webMethod = this.interfaceUrl + 'DCNOrder';
    const parameters = {
      quoteRequestID: RFQID,
      notional: notional,
      currency: currency,
      generateOrder: generateOrder,
      sendMessage: sendMessage,
      loginID: loginID,
      orderRejectionReason:orderRejectionReason,
      buttonName: buttonName,
      fetchTimeStamp: blotterFetchTimeStamp,
    };
    const that = this;
    $.ajax({
      async: false,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: this.getHeaders(), // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D
      success(data: any) {
        res = data;
        return res;
      },
      error(error: any) {
         // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D
        if(error.status === 420){ // BBVACLI-1090 || point #1. Standard http 501 error code used , It should be custom (non-standard) code 

          that.commonfunctions.setTokenLogoutFlg(true);
        }
    }
    });
    return res;
  } catch (error) {

  }
}
// BBVAEPCLI-607 Pranav D 26-Jun-2023 DCN TS doc opened when format is note
getDCNTSDoc(filename: any): string {
  let result = '';
  try {
    const webMethod = this.interfaceUrl + 'getDCNTSDoc';
    const that = this;
    const parameters = {
      filename
    };
    $.ajax({
      async: false,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'text',
      headers: this.getHeaders(),
      success(data: string) {
        result = data;
      },
      error(error: any) {
        result = '';
        if(error.status === 420){ // BBVACLI-1090 || point #1. Standard http 501 error code used , It should be custom (non-standard) code 

          that.commonfunctions.setTokenLogoutFlg(true);
        }
    }
    });
  } catch (error) {
  }
  return result;
}
}

