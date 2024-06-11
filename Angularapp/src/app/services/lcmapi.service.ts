import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppConfig } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class LCMApiService {
  interfaceURL = environment.interfaceURL;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(public http: HttpClient) { }

  // BackTest API URL
  WhatIfMultipleBackTest(
    NoteMasterID,
    TemplateID,
    NoOfTestCases,
    StartDate,
    EntityID,
    AssetClass
  ) {
    try {
      const webMethod = this.interfaceURL + 'WhatIfMultipleBackTest';
      const parameters = {
        NoteMasterID,
        TemplateID,
        NoOfTestCases,
        StartDate,
        EntityID,
        AssetClass,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  DB_PayHistByProd_Data(NmId) {
    try {
      const webMethod = this.interfaceURL + 'DB_PayHistByProd_Data';
      const parameters = {
        NmId,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  Calculate_StressMTM_Scenarios(NM_ID, userID) {
    try {
      const webMethod = this.interfaceURL + 'Calculate_StressMTM_Scenarios';
      const parameters = {
        NM_ID,
        userID,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  Get_Trade_Maturity_Date_Trace(NoteMasterID, TemplateSrNo, TemplateId) {
    try {
      const webMethod = this.interfaceURL + 'Get_Trade_Maturity_Date_Trace';
      const parameters = {
        NoteMasterID,
        TemplateSrNo,
        TemplateId,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      }).toPromise();
    } catch (error) { }
  }

  Get_Template_By_NmID(sNoteMasterID) {
    try {
      const webMethod = this.interfaceURL + 'Get_Template_By_NmID';
      const parameters = {
        sNoteMasterID,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  Get_RUHDates(
    sNMId,
    sTemplateID,
    sTemplateSrNo,
    sFromDate,
    sToDate,
    isReducedData
  ) {
    try {
      const webMethod = this.interfaceURL + 'Get_RUHDates';
      const parameters = {
        sNMId,
        sTemplateID,
        sTemplateSrNo,
        sFromDate,
        sToDate,
        isReducedData,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      }).toPromise();
    } catch (error) { }
  }

  Get_LayoutSequence(templateID, sVerifyYN, sApplicationType, layoutStyle) {
    try {
      const webMethod = this.interfaceURL + 'Get_LayoutSequence';
      const parameters = {
        templateID,
        sVerifyYN,
        sApplicationType,
        layoutStyle,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      }).toPromise();
    } catch (error) { }
  }

  GetEquityVolatility(ShareCode) {
    try {
      const webMethod = this.interfaceURL + 'GetEquityVolatility';
      const parameters = {
        ShareCode,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      return null;
    }
  }

  GetShareHistory(ShareCode) {
    try {
      const webMethod = this.interfaceURL + 'GetShareHistory';

      const parameters = {
        ShareCode,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      return null;
    }
  }

  GetHighLow(ShareCode) {
    try {
      const webMethod = this.interfaceURL + 'GetHighLow';
      const parameters = {
        ShareCode,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      return null;
    }
  }

  GetOptionRates(ShareCode) {
    try {
      const webMethod = this.interfaceURL + 'GetOptionRates';
      const parameters = {
        ShareCode,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      return null;
    }
  }

  GetCorrelationMatrix(ShareCodes) {
    try {
      const webMethod = this.interfaceURL + 'GetCorrelationMatrix';

      const parameters = {
        ShareCodes,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      return null;
    }
  }

  GetPrevClose(ShareCodes) {
    try {
      const webMethod = this.interfaceURL + 'GetPrevClose';

      const parameters = {
        ShareCodes,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      return null;
    }
  }

  GetNumberOfTestCasesAndStartDate(NoteMasterID, NumberOfTestcases, StartDate, TemplateID) {
    try {
      const webMethod = this.interfaceURL + 'GetNumberOfTestCasesAndStartDate';

      const parameters = {
        NoteMasterID,
        NumberOfTestcases,
        StartDate,
        TemplateID,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  GetStaticData(NotMasterId) {
    try {
      const webMethod = this.interfaceURL + 'GetStaticData';

      const parameters = {
        NotMasterId
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      }).toPromise();
    } catch (error) { }
  }

  GetTemplateapplicationLayoutMapping(iTemplateID, sApplicationType) {
    try {
      const webMethod = this.interfaceURL + 'GetTemplateapplicationLayoutMapping';

      const parameters = {
        iTemplateID,
        sApplicationType
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      }).toPromise();
    } catch (error) { }
  }

  Get_UDFData(sTemplateCode, iTemplateSrNo, UserName) {
    try {
      const webMethod = this.interfaceURL + 'Get_UDFData';

      const parameters = {
        sTemplateCode,
        iTemplateSrNo,
        UserName
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      }).toPromise();
    } catch (error) { }
  }

  Get_RUH_Data(iNoteMasterID,iTemplateID,itemplateSrNo,sFromDate,sToDate,isReducedData) {
    try {
      const webMethod = this.interfaceURL + 'Get_RUH_Data';

      const parameters = {
        iNoteMasterID,
        iTemplateID,
        itemplateSrNo,
        sFromDate,
        sToDate,
        isReducedData
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      }).toPromise();
    } catch (error) { }
  }

  GetProductSchedulefromDB_for_wiki(note_master_id) {
    try {
      const url  =AppConfig.settings.apiBaseUrl + "pfd/GetEventDateForProductFeatureDetails";
      const parameters = {
        note_master_id
      };
      return this.http.post<any>(url, parameters)
    } catch (error) {
    }
  }
  getProductInfo(NoteMasterID ,TemplateID) {
    try {
      const webMethod = this.interfaceURL + 'GetProductInfo';
      const parameters = {
        NoteMasterID,
        TemplateID
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      })
    } catch (error) {
    }
  }
  Get_SP_Value( Param1, Param2,Param3,Param4){
    try {
      const webMethod = this.interfaceURL + 'Get_SP_Value';

      const parameters = {
        Param1,
        Param2,
        Param3,
        Param4
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  CalculateMTMGreeks(NM_ID, userID) {
    try {
      const webMethod = this.interfaceURL + 'CalculateMTMGreeks';
      const parameters = {
        NM_ID,
        userID,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  StressTest(NM_ID,userID,entityID,Model,SpotPercChange,VolPercChange) {
    try {
      const webMethod = this.interfaceURL + 'stressTest';
      const parameters = {
        NM_ID,
        userID,
        entityID,
        Model,
        SpotPercChange,
        VolPercChange
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  GetSpotsforNmid(noteMasterID,templateCode,templateDataCSV,Mode,EntityID) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'premcalc/PremiumCalculation/GetSpotsForNMID';
      const parameters = {
        noteMasterID,
        templateCode,
        templateDataCSV,
        Mode,
        EntityID
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  //Added by Anjali T. on 13-Dec-2022 told by Pranav D. for view Orders --START
  getViewOrdersData(I_EntityId: any,I_lngNoteMasterID: any,I_strCreatedBy: any,I_strFromDate: any,I_strToDate: any,LoginID: any,PrdType: any,strBranchName: any,strISIN: any,strIssuerID: any,strOrderNo: any,strSchemeName: any,str_CusID: any,str_OrderStatus: any,str_RMName: any,strcboserchcustomer: any,strissuertype: any,strordertype: any,I_strAccountNo: any,I_strFundCode: any,I_strShowOrdersFor: any,ShowAdditionalColumns: any) {
    try {
      const webMethod = this.interfaceURL + 'viewOrders';
      const parameters = {
        I_EntityId,
        I_lngNoteMasterID,
        I_strCreatedBy,
        I_strFromDate,
        I_strToDate,
        LoginID,
        PrdType,
        strBranchName,
        strISIN,
        strIssuerID,
        strOrderNo,
        strSchemeName,
        str_CusID,
        str_OrderStatus,
        str_RMName,
        strcboserchcustomer,
        strissuertype,
        strordertype,
        I_strAccountNo,
        I_strFundCode,
        I_strShowOrdersFor,
        ShowAdditionalColumns   
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  //Added by Anjali T. on 13-Dec-2022 told by Pranav D. for view Orders --START
}

