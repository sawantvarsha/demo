import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from 'src/app/services/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LcmSimulationServiceService {
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  inputColor: string = "#fd4a4e";
  hex1: any = '#fe9b9c'
  hex2: any = '#fd4a4e'
  inputColorEvent = new EventEmitter<void>();

  constructor( private http: HttpClient ) { }
  dataReceived = new EventEmitter<void>()
  dataFiltered = new EventEmitter<void>() 

  min_CancelProb: number = 0
  max_CancelProb: number = 0
  current_min_CancelProb: number = this.min_CancelProb
  current_max_CancelProb: number = this.max_CancelProb
  min_BarrierD: number = 0
  max_BarrierD: number = 0
  current_min_BarrierD: number = this.min_BarrierD
  current_max_BarrierD: number = this.max_BarrierD
  min_IndVal: number = 0
  max_IndVal: number = 0
  current_min_IndVal: number = this.min_IndVal
  current_max_IndVal: number = this.max_IndVal

  GetProductDetailsTimeline()
   {
    try {
      const url = AppConfig.settings.apiBaseUrl + `pdt/Get_AppPortfolioDetails`;
      const reqObj = {
        "loginId" : AppConfig.settings.oRes.userID
      }
      return this.http.post<any>(url, reqObj, {
        headers: this.headerOptions,
      });
    } catch (error) {
      console.log(error);
      
    }

   }

  async GetObservationTableData(noteMasterId: string) {
    try {
      const url = AppConfig.settings.apiBaseUrl + `pdt/Get_Underlying_Prices`;
      return await this.http.post(url, { "note_Master_ID": noteMasterId}).toPromise().then(res => {
        return res;
      });
    } catch (error) {
      console.log(error);
    }
  }
  async GetHistoricalTableData(noteMasterId: string) {
    try {
      const url = AppConfig.settings.apiBaseUrl + `pdt/GetHistoricalPerformance`;
      return await this.http.post(url, { "note_Master_ID": noteMasterId}).toPromise().then(res => {
        return res;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async GetWhatIfDataRes(external: string) {
    try {
      const url = AppConfig.settings.apiBaseUrl + `pdt/Get_Whatif_Data`;
      return await this.http.post(url, { "external": external}).toPromise().then(res => {
        return res;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async GetScenarioUnderlying() {
    try {
      const url = AppConfig.settings.apiBaseUrl + `pdt/Get_ScenarioUnderlying`;
      return await this.http.get(url).toPromise().then(res => {
        return res;
      });
    } catch (error) {
      console.log(error);
    }
  }
  async Get_Portfolio_Scenarios(testType,shifting_UL,shift) {
    try {
      const url = AppConfig.settings.apiBaseUrl + `pdt/Get_Portfolio_Scenarios`;
      return await this.http.post(url, {"login":AppConfig.settings.oRes.userID,"testType": testType,"shifting_UL": shifting_UL,"shift": shift}).toPromise().then(res => {
        return res;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async GetInteractivedata(param: LcmApiRequest) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'cspdata/CSPData/GetInteractivedata';
      const parameters = {
        "strData": param.TemplateCode || "",
        "EntityID": param.EntityID || AppConfig.settings.oRes.homeEntityID,
        "UserId":  param.UserId || AppConfig.settings.oRes.userID,
        "CustomerID": param.CustomerID || "",
        "EventType": param.EventType || "",
        "FromDate": param.FromDate || "",
        "ToDate": param.ToDate || "",
        "Measure": param.Measure || "",
        "Sector": param.Sector || "",
        "RowsPerPage": param.RowsPerPage || "",
        "PageNo": param.PageNo || "",
        "WhereClause": param.WhereClause || ""
      };
      return await this.http.post(webMethod, parameters, {}).toPromise().then((data: any) => {
        return JSON.parse(data.InteractiveDataResponse);
      }).catch(error => {
        console.log(error);
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }
  async SavePortFolioViewDetails(UserID,PortFolioName,strXml,Mode,PortFolioIDInput,PortfolioID,errorMessage) {
    try {
      const url = AppConfig.settings.apiBaseUrl + `cspdata/CSPData/SaveSPFilters`;
      return await this.http.post(url, {"UserID":UserID,"PortFolioName": PortFolioName,"strXml": strXml,"Mode": Mode,"PortFolioIDInput": PortFolioIDInput,"PortfolioID":PortfolioID,"errorMessage":errorMessage}).toPromise().then(res => {
        return res;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async GetPortFolioViews(LoginID,Mode) {
    try {
      const url = AppConfig.settings.apiBaseUrl + `cspdata/CSPData/GetUserViews`;
      return await this.http.post(url, {"LoginID":LoginID,"Mode": Mode}).toPromise().then(res => {
        return res;
      });
    } catch (error) {
      console.log(error);
    }
  }
  async DeletePortFolioViews(LoginID,PortFolioName,PortFolioIDInput,ErrorMsg) {
    try {
      const url = AppConfig.settings.apiBaseUrl + `cspdata/CSPData/DeleteUserViews`;
      return await this.http.post(url, {"LoginID":LoginID,"PortFolioName": PortFolioName,"PortFolioIDInput":PortFolioIDInput,"ErrorMsg":ErrorMsg}).toPromise().then(res => {
        return res;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async GetPortFolioViewDetails(UserID,PortFolioName,Mode) {
    try {
      const url = AppConfig.settings.apiBaseUrl + `cspdata/CSPData/GetSPFilters`;
      return await this.http.post(url, {"UserID":UserID,"PortFolioName": PortFolioName,"Mode": Mode}).toPromise().then(res => {
        return res;
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export interface LcmApiRequest {
  TemplateCode: string;
  EntityID?: string,
  UserId?: string,
  CustomerID?: string,
  EventType?: string,
  FromDate?: string,
  ToDate?: string,
  Measure?: string,
  Sector?: string,
  RowsPerPage?: string,
  PageNo?: string,
  WhereClause?: string,
}
