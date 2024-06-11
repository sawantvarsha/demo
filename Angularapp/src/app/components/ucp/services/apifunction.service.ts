import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, BehaviorSubject, Observable } from 'rxjs';
// import { promise } from 'protractor';
import { AnyRecordWithTtl } from 'dns';
import { environment } from '../../../../environments/environment'
import { AppConfig } from 'src/app/services/config.service';
// import { SignalRService } from '../Services/Shared Controls/CommonServices/signal-r.service';
enum Status {
  Success = 1,
  Fail = 0
}

@Injectable({
  providedIn: 'root'
})
export class ApifunctionService {

  private udfDropdownDataSubject = new BehaviorSubject([]);
  udfDropdownDataObserver = this.udfDropdownDataSubject.asObservable();
  udfDropdownDataAvailable = false;
  udfDropdownData: any;

  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {
    console.log("Service IP is::::", environment.interfaceURL);
  }
  

  // ///// EQC Pricing rest call requests - start by OnkarE on 30-Aug-2021

  // async EQCAuthenticateUser(userName: string,password: string,ip: string,imei: string,CurrentTileID: string): Promise<any> {
  //   return this.http.post(environment.apiUrl + "EQCAuthenticateUser", {
  //     userName, password, ip, imei, CurrentTileID
  //   }).toPromise();
  // }
  // async EQCAQDQ_Quote(request): Promise<any> {
  //   return this.http.post(environment.apiUrl + "EQCAQDQ_Quote", request).toPromise();
  // }
  // async EQCAQDQ_GetQuoteResponse(request): Promise<any> {
  //   return this.http.post(environment.apiUrl + "EQCAQDQ_GetQuoteResponse", request).toPromise();
  // }
  // async BookOrder(request): Promise<any> {
  //   return this.http.post(environment.apiUrl + "BookOrder", request).toPromise();
  // }

  // ///// EQC Pricing rest call requests - end by OnkarE




  saveLog(type: any, message: any) {
    this.callSaveLog(type, message).subscribe(res => {
      return res;
    }, err => {
      return err;
    });
  }

  callSaveLog(type: any, message: any) {
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      MessageType: type,
      LogMessage: message,
    };
    return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'WriteLog', body, { headers: headerOptions });
  }
  // Modified by RajeshC on 09-Oct-2023
  getEntityData(StrUserID: string) {
    try {
      // const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      // const that = this;
      const body = {
        StrUserID 
      }
      //return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetEntity', body, { headers: headerOptions });
      var Resp = this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetEntity',body, { headers: this.headerOptions }).toPromise().then((data: any) => {
        var finalResp = {
          status: 1,
          response: data.GetEntityResult
        }
        finalResp.response = finalResp.response != null ? finalResp.response.map(e=>{const values = Object.values(e); const keys = Object.keys(e).map(k=>k.charAt(0).toLowerCase() + k.substr(1)); const obj = {}; keys.forEach((k,i)=> obj[k] = values[i]); return obj; }) : finalResp.response
        return finalResp;
      });
      return Resp;
    } catch (error) {
      console.error(error);
    } finally {
    }
  }
  
  // Modified by RajeshC on 09-Oct-2023
  getModuleData(UserGroup, UCPMode, LoginID, iEntityId): Promise<any> {
    try {
      //return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetProductClass', { sUserGroup: UserGroup, sUCPMode: UCPMode, loginID:LoginID, iEntityId:iEntityId }, { headers: this.headerOptions }).toPromise();
      var Resp = this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetProductClass',{ sUserGroup: UserGroup, sUCPMode: UCPMode, loginID:LoginID, iEntityId:iEntityId }, { headers: this.headerOptions }).toPromise().then((data: any) => {
        var finalResp = {
          status: 1,
          response: data.GetProductClassResult
        }
        finalResp.response = finalResp.response != null ? finalResp.response.map(e=>{const values = Object.values(e); const keys = Object.keys(e).map(k=>k.charAt(0).toLowerCase() + k.substr(1)); const obj = {}; keys.forEach((k,i)=> obj[k] = values[i]); return obj; }) : finalResp.response
        return finalResp;
      });
      console.log("ModuledataResult",Resp);
      return Resp;
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  getSchemeData(CBOModule: any, UCPMode, UserID, iEntityId, UserGroup): Promise<any> {
    try {
      const that = this;
      const body = {
        getLoginFvtsTemplates :  '',
        StrMode: UCPMode,
        StrUserID: UserID,
        sModuleId: CBOModule,
        sUserGroup: UserGroup,
        iEntityId: iEntityId
      };
      // Modified by RajeshC on 09-Oct-2023
      //return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/GetSchemeData", body, { headers: this.headerOptions }).toPromise();
      var Resp = this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetSchemeData',body, { headers: this.headerOptions }).toPromise().then((data: any) => {
        var finalResp = {
          status: 1,
          response: data.GetSchemeResult
        }
        finalResp.response = finalResp.response && finalResp.response != null ? finalResp.response.map(e=>{const values = Object.values(e); const keys = Object.keys(e).map(k=>k.charAt(0).toLowerCase() + k.substr(1)); const obj = {}; keys.forEach((k,i)=> obj[k] = values[i]); return obj; }) : finalResp.response; // Added by OnkarE on 16-June-2023 JIRA:UWI-387
        return finalResp;
      });
      return Resp;
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

// Modified by RajeshC on 09-Oct-2023
  async getTemplateData(schemeId: any,sControlType:string, UCPMode, UserID, iEntityId, UserGroup): Promise<any> {
    try {
      const body = {
        // getLogInFvtsTemplate: '',
        // strMode: UCPMode,
        // strUserID: UserID,
        // i_lngScheme_ID: schemeId,
        // sUserGroup: UserGroup,
        // sControlType:sControlType,
        // iEntityId
        getLogInFvtsTemplate: "",
        i_lngScheme_ID: "1",
        strMode: "UCPQEN",
        strUserID: "HSDealer1",
        sUserGroup: "HSBCDealer",
        sControlType: "DEAL ENTRY",
        iEntityId: "3"
      };
      //return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetTemplateData', body, { headers: this.headerOptions }).toPromise();
      var Resp = this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'getTemplateData',body, { headers: this.headerOptions }).toPromise().then((data: any) => {
        var finalResp = {
          status: 1,
          response: data.GetTemplateResult
        }
        finalResp.response = finalResp.response && finalResp.response != null ? finalResp.response.map(e=>{const values = Object.values(e); const keys = Object.keys(e).map(k=>k.charAt(0).toLowerCase() + k.substr(1)); const obj = {}; keys.forEach((k,i)=> obj[k] = values[i]); return obj; }) : finalResp.response;
        return finalResp;
      });
      console.log("TemplateDataResult",Resp);
      return Resp;

    } catch (error) {
      console.error(error);
    } finally {
    }
  }
 
// Modified by RajeshC on 09-Oct-2023
  getAllTemplates(usergroup, loginId, entityId, StaticList, Application): Promise<any> { //added by devesh for getting all templates data
    try {
      let body = {
        usergroup, loginId, entityId, StaticList, Application
      };
      var finalResp = {};
      var a = this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetAllTemplates', body, { headers: this.headerOptions }).toPromise().then((data: any) => {
        finalResp = {
              status: 1,
              response: data.GetAllTemplatesResult
            }
            // console.log("Respo: ", finalResp)
            return finalResp;
      });
      console.log("New: ", a)
      return a;
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

// Modified by RajeshC on 09-Oct-2023
  getTemplateMapping(template_Id: any,AppType: string, template_Name: string, UCPMODE, LoginId, sUserGroup): Promise<any> {
    try {

      const body = {
        iTemplateID: template_Id,
        sApplicationType: AppType,
        LoginId,
        sUserGroup,
        EntityID: 4,
        UCPMODE,
        template_Name: template_Name
      };
      console.log("chcekk", body.sApplicationType,body.iTemplateID)
      var finalResp = {};
      var Resp= this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetTemplateMappingData', body, { headers: this.headerOptions }).toPromise().then((data: any) => {
        finalResp = {
              status: 1,
              response: data.GetTemplateapplicationLayoutMappingResult
            }
            // console.log("Respo: ", finalResp)
            return finalResp;
      });
      return Resp;
      //return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetTemplateMappingData', body, { headers: this.headerOptions }).toPromise();
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  readLayout(template_Id: any, template_Code: any, AppType:string, UCPMODE: string, TemplateSrNo: number,SubTemplateId:number, LoginId, UserGroup,EditModeMappedTOWFBMSTField:string): Promise<any> {
    try {
      const body = {
        TemplateId: template_Id,
        TemplateCode: template_Code,
        EntityID: 4,
        //Application: 'DEAL ENTRY',
        Application: AppType.toUpperCase()=="MULTIUCP"?"MULTI UCP":AppType,
        LoginId,
        UCPMODE: UCPMODE,
        UserGroup,
        TemplateSrNo : TemplateSrNo,
        SubTemplateId:SubTemplateId,
        EditModeMappedTOWFBMSTField:EditModeMappedTOWFBMSTField
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'ReadLayout', body, { headers: this.headerOptions }).toPromise();
    } catch (error) {
      console.error(error);
    } finally {
    }
  }
// Modified by RajeshC on 09-Oct-2023
  GetCommonDataDropdownValues() {
    // return this.http.get(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetCommonDataDropdownValues', { headers: this.headerOptions }).toPromise();
    var Resp = this.http.get(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetCommonDataDropdownValues', { headers: this.headerOptions }).toPromise().then((data: any) => {
      var finalResp = {
        status: 1,
        response: data.GetCommonDataDropdownValuesResult
      }
      finalResp.response = finalResp.response ? finalResp.response.map((
        {
          Code:code,
          CustomSort:customsort,
          DecimalAmount:decimalamount,
          DecimalRate:decimalrate,
          ID:id,
          Misc1:misc1,
          Type:type,
          ...rest
        }) =>(
          {
            code,
            customsort,
            decimalamount,
            decimalrate,
            id,
            misc1,
            type,
            ...rest

          }
        )
      ) : finalResp.response;


      return finalResp;
    });
    return Resp;

  }
  
  // Modified by RajeshC on 09-Oct-2023
  GetCustomerNames(iEntityId: string, QueryString: string, LoginID: string){
    /// added by OnkarE on 05-Jan-2020
    try {
      const body = {
        iEntityId: iEntityId,
        QueryString: QueryString,
        LoginID: LoginID
      };
      //return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetCustomerNames', body, { headers: this.headerOptions }).toPromise();
      var Resp = this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetCustomerNames',body, { headers: this.headerOptions }).toPromise().then((data: any) => {
        var finalResp = {
          status: 1,
          response: data.GetCustomerNamesResult
        }
        finalResp.response = finalResp.response && finalResp.response != null ? finalResp.response.map(({
          ID: id,
          Code: code,
          Type: type,
          ...rest
        }) => ({
          id,
          code,
          type,
          ...rest
        })) : finalResp.response;
      });
      console.log("RESPONSE_Customer",Resp);
      return Resp;
    } catch (err) {

    } finally {

    }
  }
  
  // Commented this call by OnkarE on 09-Oct-2023
  // GetUDFFieldDropdownValues(iEntityId, iNoteMasterId, sLoginID) {
  //   try {
  //     const that = this;
  //     const body = {
  //       iEntityId: iEntityId,
  //       iNoteMasterId: iNoteMasterId,
  //       sLoginID: sLoginID
  //     };
  //     if (!this.udfDropdownDataAvailable) {
  //       this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetUDFFieldDropdownValues', body, { headers: this.headerOptions }).subscribe(
  //         (response: any) => {
  //           // console.log(response, response.status === Status.Success);
  //           if (response.status === Status.Success) {
  //             const res: any[] = response.response;
  //             that.udfDropdownData = res;
  //             that.udfDropdownDataAvailable = true;
  //           }
  //           // console.log(that.udfDropdownData);
  //           that.udfDropdownDataSubject.next(that.udfDropdownData);
  //         }
  //       );
  //     }
  //     if (this.udfDropdownDataAvailable) {
  //       that.udfDropdownDataSubject.next(that.udfDropdownData);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //   }
  // }

// Added by OnkarE on 09-Oct-2023
  GetUDFFieldDropdownValues(iEntityId, iNoteMasterId, sLoginID): Promise<any> {
    try {
      const that = this;
      const body = {
        iEntityId: iEntityId,
        iNoteMasterId: iNoteMasterId,
        sLoginID: sLoginID
      };
      var finalResp = {};
      var Resp= this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetUDFFieldDropdownValues', body, { headers: this.headerOptions }).toPromise().then((data: any) => {
        finalResp = {
              status: 1,
              response: data.GetUDFFieldDropdownValuesResult
            }
            
            // console.log("Respo: ", finalResp)
            return finalResp;
      });
      return Resp;
      //return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetFunctionDetails', { iTemplateId: template_Id }, { headers: this.headerOptions }).toPromise();
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

// Modified by RajeshC on 09-Oct-2023
  GetShares(){
    console.log("Calling GetShares() function!");
    try {
      const that = this;
      const body = {
        I_MarketType: 'EQ',
        I_exchange: 'NYSE',
        I_sLike: '',
        I_ShareVAl: ''
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetShares', body, { headers: this.headerOptions });
      // this.http.get<any>('api/ShareSearchService/GetShares').subscribe(res => {

      //   console.log(res)
      // }, error => console.error(error));
    } catch (error) {
      console.error(error);
    } finally {
    }
  }
  GetFunctionDetails(template_Id: any): Promise<any> {
    try {
      var finalResp = {};
      var Resp= this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetFunctionDetails', { iTemplateId: template_Id }, { headers: this.headerOptions }).toPromise().then((data: any) => {
        finalResp = {
              status: 1,
              response: data.GetFunctionDetailsResult
            }
            
            // console.log("Respo: ", finalResp)
            return finalResp;
      });
      return Resp;
      //return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetFunctionDetails', { iTemplateId: template_Id }, { headers: this.headerOptions }).toPromise();
    } catch (error) {
      console.log(error);
    } finally {
    }
  }
  

  ExecuteFunction(funcName: string, funcType: string, csvFunctionParameter: string, dbName: string, outputForm: string, TargetControl: string, functionMode:string):Promise<any> {
    try {
      let body = {};
      switch (funcType) {
        case 'FUNCTION':
          body = {
            FunctionName: funcName,
            DBName: dbName,
            FunctionOutputForm: outputForm,
            Parameters: csvFunctionParameter,
            FunctionType: funcType,
            TargetField: TargetControl,
            functionMode: functionMode,
          };
          return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'ExecuteFunction', body, { headers: this.headerOptions }).toPromise();
        case 'SP':
          body = {
            FunctionType: funcType,
            TargetField: TargetControl,
            functionMode: functionMode,
            FunctionName: funcName,
            DBName: dbName,
            Parameters: csvFunctionParameter
          };
          return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'ExecuteStoredProc', body, { headers: this.headerOptions }).toPromise();
      }
    } catch (error) { }
    finally {
    }
  }
  // Modified by RajeshC on 09-Oct-2023
  GetStaticAccessMatrix(UserGroup, LoginID, iEntityId): Promise<any> {
    try {
      const body = {
        UserGroup: UserGroup,
        LoginID: LoginID,
        EntityID: iEntityId
      };
      //var finalResp = {};
      var Resp = this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetStaticAccessMatrix', body, { headers: this.headerOptions }).toPromise().then((data: any) => {
        var finalResp = {
              status: 1,
              response: data.GetStaticAccessMatrixDataResult
            } 
            if(finalResp.response != null && finalResp.response != "null") {
              finalResp.response = finalResp.response != null ? finalResp.response.map(e=>{const values = Object.values(e); const keys = Object.keys(e).map(k=>k.charAt(0).toLowerCase() + k.substr(1)); const obj = {}; keys.forEach((k,i)=> obj[k] = values[i]); return obj}) : finalResp.response
              finalResp.response[0] = JSON.parse(JSON.stringify(finalResp.response[0]).replace(/uSAM/g, 'usaM'))
            } 
            console.log("Respo: ", finalResp)
            return finalResp;
      });
      return Resp;
      //return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetStaticAccessMatrix', body, { headers: this.headerOptions }).toPromise();
    } catch (error) {
      console.log(error);
    } finally { }
  }

  SaveUCP(MergedContract: any): Promise<any> {
    try {
      console.log("Save UCP in apifunction.service.ts.... ", MergedContract)
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'SaveUCP', MergedContract, { headers: this.headerOptions }).toPromise();
    } catch (error) {
      console.log(error);
    } finally { }
  }
  InsertToken(Note_Master_ID:Number, IN_User_ID): Promise<any> {
    try {
      const body = {
        IN_Note_Master_Id: Note_Master_ID,
        IN_User_ID
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'InsertToken', body, { headers: this.headerOptions }).toPromise();

    } catch (error) {
      console.log(error);
    } finally {

    }
  }


  GetAppTableDatainXMLFormat(iParentTemplateSrNo:Number, sParentTemplateCode:String, entityId:Number) {
    try {
      const body = {
        iTemplateSrNo: iParentTemplateSrNo, 
        sTemplateCode: sParentTemplateCode,
        sEntityID: entityId
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetAppTableDatainXMLFormat', body, { headers: this.headerOptions });

    } catch (error) {
      console.log(error);
    } finally {

    }
  }
  
  GetRecipeMapping( iParentTemplateId:number,iChildTemplateId:number,  iTemplateSeq:number,  sRecipeType:string): Promise<any> {
    try {
      const body = {
        iParentTemplateId: iParentTemplateId,
        iChildTemplateId: iChildTemplateId,
        iTemplateSeq: iTemplateSeq,
        sRecipeType: sRecipeType

      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetRecipeMapping', body, { headers: this.headerOptions }).toPromise();
    } catch (err) {

    } finally {

    }
  }

  GetStaticDetailsFromTemplate( TemplateCode:string): Promise<any> {
    try {
      const body = {
        TemplateCode: TemplateCode
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetStaticDetailsFromTemplate', body, { headers: this.headerOptions }).toPromise();
    } catch (err) {

    } finally {

    }
  }

  GetChildTemplates(iTemplateId: number, sFieldType: string, sROHMode: string, sRecipeType: string): Promise<any> {
    try {
      const body = {
        iTemplateId: iTemplateId,
        sFieldType: sFieldType,
        sROHMode: sROHMode,
        sRecipeType: sRecipeType

      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetChildTemplates', body, { headers: this.headerOptions }).toPromise();
    } catch (err) {

    } finally {

    }
  }


  ReadCustomTabDetails(templateID,subtemplateID, sUCPMode): Promise<any> {
    try {
      const body = {
        iTemplateId: templateID,
        UCPMODE: sUCPMode,
        sEditModeMappedTOWFBMST: '',
        sUserGroup: '',
        sQueueId: 0,
        iSubTemplateId:subtemplateID
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'ReadCustomTabDetails', body, { headers: this.headerOptions }).toPromise();
    } catch (err) {

    } finally {

    }
  }

  GetCustomerGridDynamicColumnDetails(templateID): Promise<any> {
    try {
      const body = {
        iTemplateId: templateID
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetCustomerGridDynamicColumnDetails', body, { headers: this.headerOptions }).toPromise();
    } catch (err) {

    } finally {

    }
  }

  GetCustomerGridColumnDetails(templateID): Promise<any> {
    try {
      const body = {
        iTemplateId: templateID
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetCustomerGridColumnDetails', body, { headers: this.headerOptions }).toPromise();
    } catch (err) {

    } finally {

    }
  }

  GetCustGridDetails(templateID, strMode): Promise<any> {
    // Added by OnkarE on 25-Nov-2020
    try {
      const body = {
        itemplateID: templateID,
        strMode: strMode
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetCustGridDetails', body, { headers: this.headerOptions }).toPromise();
    } catch (err) {

    } finally {

    }
  }

  InvokeWCFServiceMigration(dbName,classname, funcName,params, outputForm: string, TargetControl: string, functionMode:string):  Promise<any> {
    try {
      const body = {
        wcfServiceUrl: dbName,
        contractName: classname,
        operationName: funcName,
        operationParameters: params,
        FunctionOutputForm: outputForm,
        TargetField: TargetControl,
        functionMode: functionMode,
        FunctionType: "WCF Service"
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'InvokeWCFServiceMigration', body, { headers: this.headerOptions }).toPromise();
    } catch (err) {

    } finally {

    }
  }

  GetDealDetails(NoteMasterId, NoteDealId,iEntityId) {
    console.log("Get Deal Details inside apifunction service with request: ", NoteMasterId, NoteDealId)
    try {
      const body = {
        noteMasterId: NoteMasterId,
        noteDealId: NoteDealId,
        strPageNo: "",
        iEntityId: iEntityId
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetDealDetails', body, { headers: this.headerOptions });
    } catch (err) {

    } finally {

    }
  }
  GetSubTemplate(templateID: string): Promise<any> {
    try {
      const body = {
        strTemplateId: templateID
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetSubTemplate', body, { headers: this.headerOptions}).toPromise();
    } catch (error) {
    } finally {
    }
  }
   GetIntersectionMappingDetails(iTemplateId) {
    try {
      const body = {
        iTemplateId: iTemplateId
        
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetIntersectionMappingDetails', body, { headers: this.headerOptions });
    } catch (err) {

    } finally {

    }
  }
  GetCustomTabDetails(intTemplateId:number){
    try {
      const body = {
        intTemplateId: intTemplateId 
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetCustomTabDetails', body, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  GetDynamicNoteDealsValues(iNoteMasterID, sNoteDealId){
    try {
      const body = {
        iNoteMasterID,
        sNoteDealId
      };
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetDynamicNoteDealsValues', body, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

// Modified by RajeshC on 09-Oct-2023
  GetMappedTabsDetails(sTemplateId, sQueueId, sMode , sUserGroup, User_ID){
    try {
      const body = {
        sTemplateId, sQueueId, sMode , sUserGroup, User_ID
      };
      console.log("GetMappedTabsDetails data API Service........ ", body);
      
      // Changed by OnkarE
      var Resp= this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetMappedTabsDetails', body, { headers: this.headerOptions }).toPromise().then((data: any) => {
        var finalResp = {
              status: 1,
              response: data.GetMappedTabsDetailsResult
            }
            finalResp.response = finalResp.response != null ? finalResp.response.map(({
              UCIF_Field_Name: uciF_Field_Name,
              UCIF_Display_Name: uciF_Display_Name,
              UCIF_Misc3: uciF_Misc3,
              ...rest
            }) => ({
              uciF_Field_Name,
              uciF_Display_Name,
              uciF_Misc3,
              ...rest
            })) : finalResp.response
            // console.log("Respo: ", finalResp)
            return finalResp;
      });
      return Resp;
    } catch (err) {
    } finally {
    }
  }
  
  GetRuleSchedule(iTemplateId: number, sActionType: string, dtAppTableData: any[], IsUserFacing: boolean, oEditedSchedule: any[], IsPackagedSchedule: boolean, 
      sSchedulePackagedCSV: string, iEntityId: number, sUCPMode: string, iNoteMasterId: number, sUserID: string): Promise<any> {
    try {
      const body = {
        iTemplateId, sActionType, ODCUCPAppTablesData: dtAppTableData, IsUserFacing,
        oEditedSchedule, IsPackagedSchedule, sSchedulePackagedCSV, iEntityId, sUCPMode, iNoteMasterId, sUserID
      };
      console.log("GetRuleSchedule data API Service........ ", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetRuleScheduleWrapper', body, { headers: this.headerOptions }).toPromise();
    } catch (err) {
      console.error(err);
    } finally {
    }
  }

  GetSchemeAndTemplateIdForProduct(sProductID){
    try {
      const body = {
        sProductID
      };
      console.log("GetSchemeAndTemplateIdForProduct data API Service........ ", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetSchemeAndTemplateIdForProduct', body, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  GetUCPToOtherControlIntersectionMapping(TemplateId, ApplicationControlType){
    try {
      const body = {
        TemplateId, ApplicationControlType
      };
      console.log("GetUCPToOtherControlIntersectionMapping data API Service........ ", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetUCPToOtherControlIntersectionMapping', body, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  Get_ELN_Price(): Observable<any> {
    return this.http.post("https://neweqc.test-equity-connect.com/rain_1finiqserver/ELN/Quote", {
      "BarrierMode": "",
      "BarrierPercentage": "",
      "CashCurrency": "HKD",
      "Definition": "Simple2021-03-172021-09-152021-09-170.00.000493.HK",
      "ELNType": "Simple",
      "Exchange": "HKG",
      "ExpiryDate": "1633199400000",
      "InterBankPrice": "97.00",
      "IssuerDateOffset": 7,
      "LongDays": 0,
      "MaturityDate": "1633372200000",
      "Notional": "1000000.00",
      "PDD": "",
      "PPID": "",
      "Price": "97.00",
      "SettlementDate": "1617388200000",
      "SolveFor": "StrikePercentage",
      "StrikePercentage": "0.00",
      "Tenor": 6,
      "TenorType": "Month",
      "TradeDate": "1617388200000",
      "TransactionTime": "1617388200000",
      "UnderlyingCode": "0493.HK",
      "Upfront": "0.50",
      "token": "",
      "userName": "FINIQ_D15"
    });
  }

  Get_ELN_QuoteResponse(EntityId, PPDetails, token, userName): Observable<any> {
    return this.http.post("https://neweqc.test-equity-connect.com/rain_1finiqserver/ELN/QuoteResponse", {
      EntityId, PPDetails, token, userName
    });
  }

  EntityDefaultValueSetup(loginID, entityID,  applicationID ): Observable<any> {
    return this.http.post("https://neweqc.test-equity-connect.com/rain_1finiqserver/EntityDefaultValueSetup", {
      loginID, entityID,  applicationID
    });
  }

  DealerPopUpTable(NoteMasterID, CallFrom){
    try {
      const body = {
        NoteMasterID, CallFrom
      };
      console.log("DealerPopUpTable data API Service........ ", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'DealerPopUpTable', body, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  Get_Avail_Login_For_PPAsync(strLoginName, strProductCode, bookingCenter, CBCheck){
    try {
      const body = {
        strLoginName, strProductCode, bookingCenter, CBCheck
      };
      console.log("Get_Avail_Login_For_PPAsync data API Service........ ", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'Get_Avail_Login_For_PPAsync', body, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  GetQueueButtonDetails(QueueId, QueueName, UserGroup){
    try {
      const body = {
        QueueId, QueueName, UserGroup
      };
      console.log("GetQueueButtonDetails data API Service........ ", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetQueueButtonDetails', body, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  Pushtoken(token){
    try {
      console.log("Pushtoken data API Service........ ", token);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'Pushtoken', token, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }
  
   WFLButtonSPAction(PushTokenRequest:any){
    try {
           console.log("WFLButtonSPAction request parameters........ ", PushTokenRequest);
           return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'WFLButtonSPAction', PushTokenRequest, { headers: this.headerOptions });     
    } catch (err) {
    } finally {
    }
  }
  
   InsertRuleSchedule(iNoteMasterId: number, oRuleSchedule: any[], sUserName: string, sInsertUpdateMode: string) {   //Added by BhagyashriB on 03-May-2021 for saving Rule schedule
    try {
      const body = {
        iNoteMasterId, oRuleSchedule, sUserName, sInsertUpdateMode
      };
      console.log("InsertRuleSchedule data API Service.....", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'InsertRuleSchedule', body, { headers: this.headerOptions }).toPromise();
    } catch (err) {
      console.error(err);
    }
  }
  GetAuditSerials(i_NoteMasterId, templateID, LoginId, EntityID, sUserGroup){
    try {
       
      const body = {
        i_NoteMasterId, templateID, LoginId, EntityID, sUserGroup
      };
      console.log("GetAuditSerials data API Service........ ", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPAmendService/GetAuditSerials', body, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  DB_GetAuditDetails(NoteMasterID,serialNo,templateID,LoginId,EntityID,sUserGroup){
    try {
       
      const oReq = {
        NoteMasterID:NoteMasterID,
        serialNo:serialNo,
        templateID:templateID,
        LoginId:LoginId,
        EntityID:EntityID,
        sUserGroup:sUserGroup
      };
      console.log("DB_GetAuditDetails data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPAmendService/DB_GetAuditDetails', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }
  DB_GetAuditSerials_DealAmend(NoteMasterID){
    try {
       
      const oReq = {
        i_templateId:NoteMasterID };
      console.log("DB_GetAuditSerials_DealAmend data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPAmendService/DB_GetAuditSerials_DealAmend', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  DB_GetAuditDetails_DealAmend(template_id,NDL_AuditID,NDL_Note_Deal_Id,NDL_Note_Master_Id){
    try {
       
      const oReq = {
        template_id:template_id,
        NDL_AuditID:NDL_AuditID,
        NDL_Note_Deal_Id:NDL_Note_Deal_Id,
        NDL_Note_Master_Id:NDL_Note_Master_Id
      };
      console.log("DB_GetAuditDetails_DealAmend data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPAmendService/DB_GetAuditDetails_DealAmend', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  DB_GetColumnName_DealAmend(TemplateId) {
    try {

      const oReq = {
        TemplateId : TemplateId
      };
      console.log("DB_GetColumnName_DealAmend data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPAmendService/DB_GetColumnName_DealAmend', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }

  }
   GetProductSchedule(iTemplateId: number, sActionType: string, dtAppTableData: any[], IsUserFacing: boolean, oEditedSchedule: any[], IsPackagedSchedule: boolean, 
      sSchedulePackagedCSV: string, iEntityId: number, sUCPMode: string, iNoteMasterId: number, sUserID: string): Promise<any> {
    try {
      const body = {
        iTemplateId, sActionType, ODCUCPAppTablesData: dtAppTableData, IsUserFacing,
        oEditedSchedule, IsPackagedSchedule, sSchedulePackagedCSV, iEntityId, sUCPMode, iNoteMasterId, sUserID
      };
      console.log("GetProductSchedule data API Service........ ", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetProductScheduleWrapper', body, { headers: this.headerOptions }).toPromise();
    } catch (err) {
      console.error(err);
    } finally {
    }
  }

  InvokeRestJSON(restjsonUrl, jsonObjString, token): Promise<any> {
    try {
      // let headerOptions1 = new HttpHeaders({ 'Content-Type': 'application/json' });
      // if(header && header != ""){
      //    headerOptions1 = new HttpHeaders({ 'Content-Type': 'application/json', 'TOKEN':header });
      // }
      const body = {
        restjsonUrl, jsonObjString, token
      };
      console.log("Header sending:: ", body)
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'InvokeRestJSON', body, { headers: this.headerOptions }).toPromise();
    } catch (error) {
      console.log(error);
    } finally { }
  }

 WriteErrorLogs(message) {
    try{
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body={
        Message:message
      }
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'WriteErrorLog', body, { headers: headerOptions }).toPromise();
    }
    catch(error) {
      console.log(error);
    }
    finally{}
  }

  Get_Trade_Maturity_Date_Payment(notemasterId){
    try{
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body={
        strNoteMasterID:notemasterId
      }
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPPaymentsService/Get_Trade_Maturity_Date_Payment', body, { headers: headerOptions }).toPromise();
    }
    catch(error){

    }
  }


  DB_GetIndex(notemasterId){
    try{
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body={
        strNoteMasterID:notemasterId
      }
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCP_IndexService/DB_GetIndex', body, { headers: headerOptions }).toPromise();
    }
    catch(error){

    }
  }

  DB_get_DateHistory(request){
    try {
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body={
        lstIndex:request.lstIndex,
				dtpindexfromdate:request.dtpindexfromdate,
				dtpindextodate:request.dtpindextodate,
      }
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCP_IndexService/DB_get_DateHistory', body, { headers: headerOptions }).toPromise();
    } catch (error) {
      
    }
  }

  DB_get_Date(request){
    try {
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body={
        lstIndex:request.lstIndex,
				dtpindexfromdate:request.dtpindexfromdate,
				dtpindextodate:request.dtpindextodate,
      }
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCP_IndexService/DB_get_Date', body, { headers: headerOptions }).toPromise();
    } catch (error) {
      
    }
  }

  DB_Save_Index_History_Details(request,UserID){
    try
    {
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body={
       ID:request.ID, 
       IM_ID:request.IM_ID,     
       FixingDate:request.FixingDate,         
       FixingValue:request.FixingValue,   
       UserID:UserID
      }
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCP_IndexService/DB_Save_Index_History_Details', body, { headers: headerOptions }).toPromise();
    }
    catch(error)
    {

    }
  }
  
  //Added by BhagyashriB on 14-Sept-2021
  GetSchedule(iNoteMasterId: number, ScheduleTab: string): Promise<any> {
    try {
      const body = {
        iNoteMasterId, ScheduleTab
      };
      console.log("GetSchedule data API service........ ", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/" + 'api/UCPViewScheduleService/GetSchedule', body, { headers: this.headerOptions }).toPromise();
     } catch (err) {
       console.error(err);
     } finally {
     }
  }

  InsertProdSchedule(iNoteMasterId:string, sProdSchedule:string, sUserName:string, sInsertUpdateMode:string, sGenerateAmendedTradeConfo:string){
    try {
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body={
        iNoteMasterId, 
        sProdSchedule,    
        sUserName,        
        sInsertUpdateMode,   
        sGenerateAmendedTradeConfo
      }
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'InsertProdSchedule', body, { headers: headerOptions }).toPromise();
      
    } catch (error) {
      
    }
  }

  // Made changes in GetProductSchedulefromDB by OnkarE on 11-Oct-2023
  GetProductSchedulefromDB(strNoteMasterID){
    try {
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body={
        note_master_id: strNoteMasterID
      }
      //return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetProductSchedulefromDB', body, { headers: headerOptions }).toPromise();
      var Resp= this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetProductSchedulefromDB', body, { headers: this.headerOptions }).toPromise().then((data: any) => {
        var finalResp = {
              status: 1,
              response: data.GetProductSchedulefromDBResult
            }
            finalResp.response = finalResp.response != null ? finalResp.response.map(e=>{const values = Object.values(e); const keys = Object.keys(e).map(k=>k.charAt(0).toLowerCase() + k.substr(1)); const obj = {}; keys.forEach((k,i)=> obj[k] = values[i]); return obj}) : finalResp.response
            // console.log("Respo: ", finalResp)
            return finalResp;
      });
      return Resp;
      
    } catch (error) {
      
    }
  }
  
  GetScheduleLogicFlag(templateId: number): Promise<any> {       //Added by BhagyashriB on 15-ept-2021 | for package schedule
    try {
      const body = {
        templateId
      };
      console.log("GetScheduleLogicFlag data API service..... ", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/" + 'GetScheduleLogicFlag', body, { headers: this.headerOptions }).toPromise();
    } catch (err) {
      console.error(err);
    }
  }

  RuleScheduleInsertStatus(notemasterId: number): Promise<any> {    //Added by BhagyashriB on 15-Sept-2021 | for package schedule tab
    try {
      const body = {
        notemasterId
      };
      console.log("RuleScheduleInsertStatus data API service...... ", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/" + 'api/UCPViewScheduleService/RuleScheduleInsertStatus', body, { headers: this.headerOptions }).toPromise();
      
    } catch (err) {
      console.error(err);      
    }
  }

  GetExtendedPackageScheduleData(iNoteMasterID: number): Promise<any> {      //Added by BhagyashriB on 16-Sept-2021 | for package schedule tab
    try {
      const body = {
        iNoteMasterID
      };
      console.log("GetExtendedPackageScheduleData data API service..... ", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/" + 'GetExtendedPackageScheduleData', body, { headers: this.headerOptions }).toPromise();
      
    } catch (err) {
      console.error(err);      
    }
  }

  GetEditRightsInfo(iTemplateId:number, iQueueId:number,sEditGroups:string, sUserGroupName:string,g_strMode:string,Type:string,LoginID:string,iEntityId:string,iSubTemplateId:string){
    try 
    {
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body={
        iTemplateId,
        iQueueId,
        sEditGroups,
        sUserGroupName,
        g_strMode,
        Type,
        LoginID,
        iEntityId,
        iSubTemplateId        
      }
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetEditRightsInfo', body, { headers: headerOptions }).toPromise();
    }
     catch (error) {
      
    }
  }
  InsertPackageSchedule(iNoteMasterId: number, oMutation: string, sUserName: string, oRuleSchedule: string, InsertUpdateMode: string, oProductSchedule: string, schedule_logic: string): Promise<any> {
    try {
      const body = {
        iNoteMasterId, oMutation, sUserName, oRuleSchedule, InsertUpdateMode, oProductSchedule, schedule_logic
      };
      console.log("InsertPackageSchedule data API service......", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/" + 'InsertPackageSchedule', body, { headers: this.headerOptions }).toPromise();
    } catch (err) {
      console.error(err);      
    }
  }

  //  Added by RajeshC || Trace
  Get_Trade_Maturity_Date_Trace(iNoteMasterId: number, iTemplateSrNo: number, iTemplateId: number){
    try {
      
      const oReq = {
        NoteMasterID:iNoteMasterId,
        TemplateSrNo:iTemplateSrNo,
        TemplateId:iTemplateId,
      };
      console.log("Get_Trade_Maturity_Date_Trace data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPTraceService/Get_Trade_Maturity_Date_Trace', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  Get_RUHDates(sNMId:string,sTemplateID: number, sTemplateSrNo: number, sFromDate: Date , sToDate: Date, isReducedData: boolean){
    try {
      const oReq = {
        sNMId:sNMId,
        sTemplateID:sTemplateID,
        sTemplateSrNo:sTemplateSrNo,
        sFromDate:sFromDate,
        sToDate:sToDate,
        isReducedData:isReducedData,
      };
      console.log("Get_RUHDates data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPTraceService/Get_RUHDates', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  GetTemplateapplicationLayoutMapping(iTemplateID:number,sApplicationType: string){
    try {
      const oReq = {
        iTemplateID:iTemplateID,
        sApplicationType:sApplicationType,
        
      };
      console.log("GetTemplateapplicationLayoutMapping data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPTraceService/GetTemplateapplicationLayoutMapping1', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }
  
  Get_LayoutSequence(templateID:string,sVerifyYN:string,sApplicationType: string,layoutStyle:string){
    try {
      const oReq = {
        templateID:templateID,
        sVerifyYN:sVerifyYN,
        sApplicationType:sApplicationType,
        layoutStyle:layoutStyle,
        
      };
      console.log("Get_LayoutSequence data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPTraceService/Get_LayoutSequence', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  
  Get_RUH_Data(iNoteMasterID:number,iTemplateID:number,iTemplateSrNo: number,sFromDate: Date , sToDate: Date, isReducedData: boolean){
    try {
      const oReq = {
        iNoteMasterID:iNoteMasterID,
        iTemplateID:iTemplateID,
        iTemplateSrNo:iTemplateSrNo,
        sFromDate:sFromDate,
        sToDate:sToDate,
        isReducedData:isReducedData,
      };
      console.log("Get_RUH_Data data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPTraceService/Get_RUH_Data', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  Get_UDFData(sTemplateCode:string,iTemplateSrNo:number,UserName: string){
    try {
      const oReq = {
        sTemplateCode:sTemplateCode,
        iTemplateSrNo:iTemplateSrNo,
        UserName:UserName,
        
      };
      console.log("Get_UDFData data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPTraceService/Get_UDFData', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }


  GetStaticData(NotMasterId:number){
    try {
      const oReq = {
        NotMasterId:NotMasterId,
      };
      console.log("GetStaticData data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetStaticData', oReq, { headers: this.headerOptions }).toPromise();
    } catch (err) {
    } finally {
    }
  }

//Added by RajeshC on 17-Sept || SubscriptionTab
  DB_Get_Product_Group(){
    try {
      
      console.log("DB_Get_Product_Group data API Service........ ");
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPSubscriptionTabService/DB_Get_Product_Group', { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }
  
  Db_Get_Issuer_Master_Details(){
    try {
      
      console.log("Db_Get_Issuer_Master_Details data API Service........ ");
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPSubscriptionTabService/Db_Get_Issuer_Master_Details', { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  DB_GetAssetClass_Details(){
    try {
      
      console.log("DB_GetAssetClass_Details data API Service........ ");
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPSubscriptionTabService/DB_GetAssetClass_Details', { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  
  GetProductRisk(){
    try {
      
      console.log("GetProductRisk data API Service........ ");
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPSubscriptionTabService/GetProductRisk', { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }
  
  DB_GetRMClass(){
    try {
      
      console.log("DB_GetRMClass data API Service........ ");
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPSubscriptionTabService/DB_GetRMClass', { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }
  
  GetCustomerTradability(){
    try {
      
      console.log("GetCustomerTradability data API Service........ ");
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPSubscriptionTabService/GetCustomerTradability', { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }
  
  DB_GetCustomerSegment(appUser:string,g_strLRCMode:string){
    try {
      const oReq = {
        appUser:appUser,
        g_strLRCMode:g_strLRCMode,
  
      };
      console.log("Get_UDFData data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPSubscriptionTabService/DB_GetCustomerSegment', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }
  
  DB_Get_Subscription_Parameter_Details(Note_Master_Id:string,TemplateId:string,Mode:string){
    try {
      const oReq = {
        Note_Master_Id:Note_Master_Id,
        TemplateId:TemplateId,
        Mode:Mode,
      };
      console.log("DB_Get_Subscription_Parameter_Details data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPSubscriptionTabService/DB_Get_Subscription_Parameter_Details', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }


  DB_Update_Subscription(udt_EPA_Map:any [],Note_Master_Id:string){
    try {
      const oReq = {
        udt_EPA_Map,
        Note_Master_Id,
        
      };
      console.log("DB_Update_Subscription data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPSubscriptionTabService/DB_Update_Subscription', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }
  
  DB_GetRMClassByNoteMasterID(noteMasterID:string){
    try {
      const oReq = {
        noteMasterID,
      };
      console.log("DB_GetRMClassByNoteMasterID data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPSubscriptionTabService/DB_GetRMClassByNoteMasterID', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }
  
  DB_GetCustomerSegmentByNoteMasterID(NoteMasterID:string){
    try {
      const oReq = {
        NoteMasterID,
      };
      console.log("DB_GetCustomerSegmentByNoteMasterID data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPSubscriptionTabService/DB_GetCustomerSegmentByNoteMasterID', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  
  GetDefaultSubscriptionParam(TemplateID:number){
    try {
      const oReq = {
        TemplateID,
      };
      console.log("GetDefaultSubscriptionParam data API Service........ ", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPSubscriptionTabService/GetDefaultSubscriptionParam', oReq, { headers: this.headerOptions });
    } catch (err) {
    } finally {
    }
  }

  Get_MetaDataDetails(iTemplateId) {
    try{
      const oReq = {
        iTemplateId
      }
      console.log("Get_MetaDataDetails data API Service........", oReq);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/MutationScheduleService/Get_MetaDataDetails', oReq, { headers: this.headerOptions });
    } 
    catch (err) {
    } 
    finally {
    }
    
  }

    // Made changes in GetMutationHistory by OnkarE on 12-Oct-2023
  GetMutationHistory(iNoteMasterId) {
    try{
      const body = {
        iNoteMasterId
      }
      console.log("GetMutationHistorydata API Service........", body);
      //return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/MutationScheduleService/GetMutationHistory', oReq, { headers: this.headerOptions });
      var Resp = this.http.post(AppConfig.settings.apiBaseUrl + "UCP_MutationSchedule/"+'GetMutationHistory',body, { headers: this.headerOptions }).toPromise().then((data: any) => {
        var finalResp = {
          status: 1,
          response: data.GetMutationHistoryResult
        }
        finalResp.response = finalResp.response != null ? finalResp.response.map(e=>{const values = Object.values(e); const keys = Object.keys(e).map(k=>k.charAt(0).toLowerCase() + k.substr(1)); const obj = {}; keys.forEach((k,i)=> obj[k] = values[i]); return obj; }) : finalResp.response
        return finalResp;
      });
      return Resp;
    }
    catch (err) {
    } 
    finally {
    }
  }

  // Made changes in GetMutatingFields by OnkarE on 10-Oct-2023
  GetMutatingFields(iTemplateId) {
    try{
      const body = {
        iTemplateId
      }
      console.log("GetMutatingFields data API Service........", body);
      //return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/MutationScheduleService/GetMutatingFields', oReq, { headers: this.headerOptions });
      var Resp = this.http.post(AppConfig.settings.apiBaseUrl + "UCP_MutationSchedule/"+'GetMutatingFields',body, { headers: this.headerOptions }).toPromise().then((data: any) => {
        var finalResp = {
          status: 1,
          response: data.GetMutatingFieldsResult
        }
        finalResp.response = finalResp.response != null ? finalResp.response.map(e=>{const values = Object.values(e); const keys = Object.keys(e).map(k=>k.charAt(0).toLowerCase() + k.substr(1)); const obj = {}; keys.forEach((k,i)=> obj[k] = values[i]); return obj; }) : finalResp.response
        return finalResp;
      });
      return Resp;
    } 
    catch (err) {
    } 
    finally {
    }
  }
  // Added GetTemplate_Schedule_SubCodes by OnkarE on 12-Oct-2023
  GetTemplate_Schedule_SubCodes(iTemplateId) {
    try{
      const body = {
        iTemplateId
      }
      console.log("GetTemplate_Schedule_SubCodes data API Service........", body);
      var Resp = this.http.post(AppConfig.settings.apiBaseUrl + "UCP_MutationSchedule/"+'GetTemplate_Schedule_SubCodes',body, { headers: this.headerOptions }).toPromise().then((data: any) => {
        var finalResp = {
          status: 1,
          response: data.GetTemplate_Schedule_SubCodesResult
        }
        //finalResp.response = finalResp.response != null ? finalResp.response.map(e=>{const values = Object.values(e); const keys = Object.keys(e).map(k=>k.charAt(0).toLowerCase() + k.substr(1)); const obj = {}; keys.forEach((k,i)=> obj[k] = values[i]); return obj; }) : finalResp.response
        return finalResp;
      });
      return Resp;
    } 
    catch (err) {
    } 
    finally {
    }
  }

  // Added Get_Mutation_Template_ScheduleCodes by OnkarE on 12-Oct-2023
  Get_Mutation_Template_ScheduleCodes(iTemplateId) {
    try{
      const body = {
        iTemplateId
      }
      console.log("Get_Mutation_Template_ScheduleCodes data API Service........", body);
      var Resp = this.http.post(AppConfig.settings.apiBaseUrl + "UCP_MutationSchedule/"+'Get_Mutation_Template_ScheduleCodes',body, { headers: this.headerOptions }).toPromise().then((data: any) => {
        var finalResp = {
          status: 1,
          response: data.Get_Mutation_Template_ScheduleCodesResult
        }
        //finalResp.response = finalResp.response != null ? finalResp.response.map(e=>{const values = Object.values(e); const keys = Object.keys(e).map(k=>k.charAt(0).toLowerCase() + k.substr(1)); const obj = {}; keys.forEach((k,i)=> obj[k] = values[i]); return obj; }) : finalResp.response
        return finalResp;
      });
      return Resp;
    } 
    catch (err) {
    } 
    finally {
    }
  }
  InsertMutationSchedule(iNoteMasterId: number, oMutation: any[], sUserName: string) {   //Added by BhagyashriB on 03-May-2021 for saving Rule schedule
    
    try {
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body = {
        iNoteMasterId,  oMutation, sUserName
      };
      console.log("InsertMutationSchedule data API Service.....", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'InsertMutationSchedule', body, { headers: this.headerOptions }).toPromise();
    } catch (err) {
      console.error(err);
    }
  }

  GetFromTODate( sNoteMasterID: string) {
    try {
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body = {
        sNoteMasterID
      };
      console.log("GetFromTODate data API Service.....", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPPaymentService/GetFromTODate', body, { headers: this.headerOptions });
    } catch (err) {
      console.error(err);
    }
  }

  

  GetCustomerName( _NMId: number) {
    try {
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body = {
        _NMId
      };
      console.log("GetCustomerName data API Service.....", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPPaymentService/GetCustomerName', body, { headers: this.headerOptions });
    } catch (err) {
      console.error(err);
    }
  }

  GetNoteMaster(iParentId: number, sParentChildFilter: string) {
    try {
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body = {
        iParentId,  sParentChildFilter
      };
      console.log("GetNoteMaster data API Service.....", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPPaymentService/GetNoteMaster', body, { headers: this.headerOptions });
    } catch (err) {
      console.error(err);
    }
  }

  Get_CashFlow_Details(I_CustomerID :number, I_strFromDate : string, I_strToDate: string,lngEntity_ID: number,strCustomerType: string,strNoteMasterId: string) {
    try {
      const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body = {
        I_CustomerID,  I_strFromDate, I_strToDate, lngEntity_ID,strCustomerType,strNoteMasterId
      };
      console.log("Get_CashFlow_Details data API Service.....", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPPaymentService/Get_CashFlow_Details', body, { headers: this.headerOptions });
    } catch (err) {
      console.error(err);
    }
  }

  getBasketEntryColumnDetails(templateId :number) {
    try {
      const body = {
        templateId
      };
      console.log("getBasketEntryColumnDetails data API Service.....", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'getBasketEntryColumnDetails', body, { headers: this.headerOptions });
    } catch (err) {
      console.error(err);
    }
  }

  GetBasketArrayFunctionDetails(iTemplateId :number) {
    try {
      const body = {
        iTemplateId
      };
      console.log("GetBasketArrayFunctionDetails data API Service.....", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetBasketArrayFunctionDetails', body, { headers: this.headerOptions });
    } catch (err) {
      console.error(err);
    }
  }
ReadFieldDetailsAngular(template_Id: any, template_Code: any, AppType:string, UCPMODE: string, TemplateSrNo: number,SubTemplateId:number, LoginId, UserGroup,EditModeMappedTOWFBMSTField:string,selectedBookingModel:string,NoteMasterId:string,QueueId: number, EntityID: number, sClickedButton: string): Promise<any> 
  {
    try {
      var iDataRequest = {
        TemplateCode: template_Code,
        TemplateID: template_Id,
        TemplateSrNo : TemplateSrNo ? TemplateSrNo : 0,
        SubTemplateId:SubTemplateId ? SubTemplateId : 0,
        EditModeMappedTOWFBMST: EditModeMappedTOWFBMSTField,
        UserGroup,
        QueueId,
        UCPMODE: UCPMODE,
        LoginId,
        EntityID: EntityID,
        sEntity_ID: EntityID.toString(),
        sTemplate_ID: template_Id.toString(),
        Application: AppType.toUpperCase()=="MULTIUCP"?"MULTI UCP":AppType,
        sWFLButtonCaption: sClickedButton
      }
      const body = {
        iDataRequest,
        sHedging_Type : selectedBookingModel ? selectedBookingModel : "Product",
        NoteMasterId: NoteMasterId ? NoteMasterId : "-1"
      };
    return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'ReadFieldDetailsAngular', body, { headers: this.headerOptions }).toPromise();
  }
   catch (error)
    {
    console.error(error);
    } 
  finally {}
  }

  // Added by BhagyashriB on 17-Nov-2021
  GetSchemeTemplateMapping(): Promise<any> {
    try {
      console.log("GetSchemeTemplateMapping data API Service....");
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/" + 'api/UCPExportService/GetSchemeTemplateMapping', { headers: this.headerOptions }).toPromise();
    } catch (err) {
      console.error(err);      
    }
  }
  GetSchemeTemplateDetails(_mode: string, UserID: string, EntityID: string, _strSchemeAlias: string, _strSchemeName: string, _sstrTemplateCode: string,
    _strTemplateName: string, _strNewTempCode: string, _strNewTempName: string, _strNewProductClass: string, _strNewSchemeName: string, 
    _strNewSchemeAlias: string, _AllFunScripts: boolean, _IncludeDocgen: boolean, _InsertScript: boolean, _IncludeSubTemplate: boolean, 
    _Script_OTP: string): Promise<any> {
      try {
        const body = {
          _mode, UserID, EntityID, _strSchemeAlias, _strSchemeName, _sstrTemplateCode, _strTemplateName, _strNewTempCode, _strNewTempName,
          _strNewProductClass, _strNewSchemeName, _strNewSchemeAlias, _AllFunScripts, _IncludeDocgen, _IncludeSubTemplate, _Script_OTP
        }
        console.log("GetSchemeTemplateDetails data API service.....", body);
        return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPExportService/GetSchemeTemplateDetails', body, { headers: this.headerOptions }).toPromise();
      } catch (err) {
        console.error(err);        
      }
    }
    GetIntersectionFieldMaster(): Promise<any> {
      try {
        console.log("GetIntersectionFieldMaster data API service.....");
        return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPExportService/GetIntersectionFieldMaster', { headers: this.headerOptions }).toPromise();        
      } catch (err) {
        console.error(err);
      }
    }
    UCPEXP_GetStaticAccessMatrix(): Promise<any> {
      try {
        console.log("GetStaticAccessMatrix data API service...");
        return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPExportService/GetStaticAccessMatrix', { headers: this.headerOptions }).toPromise();
      } catch (err) {
        console.error(err);        
      }
    }
    GetCreateTableScript(): Promise<any> {
      try {
        console.log("GetCreateTableScript data API service...");
        return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPExportService/GetCreateTableScript', { headers: this.headerOptions }).toPromise();        
      } catch (err) {
        console.error(err);        
      }
    }
    GetUCPTableNames(): Promise<any> {
      try {
        console.log("GetUCPTableNames data API service...");
        return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPExportService/GetUCPTableNames', { headers: this.headerOptions }).toPromise();
      } catch (err) {
        console.error(err);        
      }
    }
    GetUDTScripts(): Promise<any> {
      try {
        console.log("GetUDTScripts data API service...");
        return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPExportService/GetUDTScripts', { headers: this.headerOptions }).toPromise();
      } catch (err) {
        console.error(err);
      }
    }
    GetStoredProcedureScripts(): Promise<any> {
      try {
        console.log("GetStoredProcedureScripts data API service...");
        return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPExportService/GetStoredProcedureScripts', { headers: this.headerOptions }).toPromise();
      } catch (err) {
        console.error(err);        
      }
    }
    GetIndexScript(): Promise<any> {
      try {
        console.log("GetIndexScript data API service...");
        return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'api/UCPExportService/GetIndexScript', { headers: this.headerOptions }).toPromise();
      } catch (err) {
        console.error(err);        
      }
    }
  //End by BhagyashriB on 17-Nov-2021 

  //     //Added by RajeshC and VijayH for deal lock
  DB_Check_Lock_Status(inttokenID :string, sUserId: string) {
    try {
      const body = {
        inttokenID, sUserId
      };
      console.log("DB_Check_Lock_Status data API Service.....", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'DB_Check_Lock_Status', body, { headers: this.headerOptions });
    } catch (err) {
      console.error(err);
    }
  }

  DB_Insert_Lock_Status(inttokenID :string, sUserID: string, sHostName: string) {
      try {
        const body = {
          inttokenID: inttokenID,
          sUserID: sUserID,
          sHostName: sHostName
        };
        console.log("DB_Insert_Lock_Status data API Service.....", body);
        return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'DB_Insert_Lock_Status', body, { headers: this.headerOptions });
      } catch (err) {
        console.error(err);
      }

  }


  DB_Delete_Lock_Status(inttokenID :string, sUserID: string) {
    try {
      const body = {
        inttokenID: inttokenID,
        sUserID: sUserID
      };
      console.log("DB_Delete_Lock_Status data API Service.....", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'DB_Delete_Lock_Status', body, { headers: this.headerOptions });
    } catch (err) {
      console.error(err);
    }

  }

  //Added by VijayH on 24/01/2022 as per the disucssion with OnkarE
  GetStaticData_dropdown(EntityID :string, UserGroup: string, LoginId: string, Application :string, UCPMode :string) {
    try {
      const body = {
        EntityID: EntityID,
        UserGroup: UserGroup,
        LoginId: LoginId,
        Application: Application,
        UCPMode: UCPMode
      };
      console.log("GetStaticData_dropdown data API Service.....", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetStaticData_dropdown', body, { headers: this.headerOptions });
    } catch (err) {
      console.error(err);
    }

  }


  //Added by VijayH for Image Datatype as output after Function Execution on 9-March-2022
  ImageIOAfterFunctionExecution_Angular(filePath :string) {
    try {
      const body = {
        filePath : filePath
      };
      console.log("ImageIOAfterFunctionExecution_Angular data API Service.....", body);
      //return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'ImageIOAfterFunctionExecution_Angular', body, {headers: this.headerOptions})
      
    }
    catch (err) {
      console.error(err);
    }
  }

  GetCustomerGridRowCount(iNoteMasterID :number) {
    try {
      const body = {
        iNoteMasterID: iNoteMasterID
      };
      console.log("GetCustomerGridRowCount data API Service.....", body);
      return this.http.post(AppConfig.settings.apiBaseUrl + "UCPCTL/"+'GetCustomerGridRowCount', body, { headers: this.headerOptions });
    } catch (err) {
      console.error(err);
    }

  }

}

