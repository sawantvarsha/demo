import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppConfig } from 'src/app/services/config.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EcCommonService } from '../components/euroconnect/services/ec-common.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpInteractiveDataService {

  currencyPreference: string = "EUR"; //Added by Kaustubh S Varsha G || User currency preference || FSLINT-64 || 30-May-2024
  currPreferenceSubject: BehaviorSubject<string> = new BehaviorSubject(null);
  currPreferenceObserver: Observable<string> = this.currPreferenceSubject.asObservable();
  
  constructor(
    public http: HttpClient,
    private commonfunctions: EcCommonService,
    public authApi: AuthService) { }

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

  async GetEventCalendar_Filterdata(param: LcmApiRequest) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'cspdata/CSPData/Get_InteractiveData';
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
        return data;
      }).catch(error => {
        console.log(error);
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }
  // Added by AdilP || 16-08-2023 || Start
  async getChart() {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'cspdata/CSPData/GetChartData';
      return await this.http.get(webMethod).toPromise().then((data: any) => {
        return JSON.parse(data.GetChartDataResult);
      })
    } catch (error) {
      console.log('Error in GetChart ', error);

    }
  }
  async AddChartData(chartData) {
    try {
      const parameter ={
        "chartType": chartData.type,
        "chartData": JSON.stringify(chartData.chart),
        "userId": AppConfig.settings.oRes.userID

      }
      const webMethod = AppConfig.settings.apiBaseUrl + 'cspdata/CSPData/AddChartData';
      return await this.http.post(webMethod,parameter).toPromise().then((data:any)=>{
        return data.AddChartDataResponse;
      })
      

    } catch (error) {
      console.log('Error in SetChart ', error);

    }
  }
  async DeleteChartData(id){
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'cspdata/CSPData/DeleteChartData';
      const parameter={
        "chartId": id
      }
      return await this.http.post(webMethod,parameter).toPromise().then((data:any)=>{
        return data.DeleteChartDataResponse;
      });
    } catch (error) {
      console.log('Error in DeleteChart ', error);
      
    }
  }
  // Added by AdilP || 16-08-2023 || End

//Added by Apurva K|| 04-Sep-2023
  async GetCommonData(commonDataType: string) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'common/v1/CVP/CommonData';
      const parameters = {
        "commonDataType": commonDataType
      };
      return await this.http.post(webMethod, parameters, {}).toPromise().then((data: any) => {
        return (data.cvpData);
      }).catch(error => {
        console.log(error);
      });
    } catch (error) {
      console.log('Error: ', error);
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
