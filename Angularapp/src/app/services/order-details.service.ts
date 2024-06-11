import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailsService {
  // viewOrders(I_EntityId: any, I_lngNoteMasterID: any, I_strCreatedBy: any, I_strFromDate: any, I_strToDate: any, LoginID: any, PrdType: any, strBranchName: any, strISIN: any, strIssuerID: any, strOrderNo: any, strSchemeName: any, str_CusID: any, str_OrderStatus: any, str_RMName: any, strcboserchcustomer: any, strissuertype: any, strordertype: any, I_strAccountNo: any, I_strFundCode: any, I_strShowOrdersFor: any, ShowAdditionalColumns: any) {
  //   throw new Error('Method not implemented.');
  // }
  interfaceURL = environment.interfaceURL;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(public http: HttpClient) {}

  DB_GetOrderDetails(
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
  ) {
    try {
      console.log('check3: ' + I_lngNoteMasterID);
      // const webMethod = this.interfaceURL + '';
      const url = this.interfaceURL + 'GetOrdersDataForProductFeatureDetails';
      const parameters = {
        objDC_Get_OrdersForSelectedProduct_Out: {
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
        },
        I_strAccountNo,
        I_strFundCode,
        I_strShowOrdersFor,
        ShowAdditionalColumns,
      };
      console.log(
        this.http.post<any>(url, parameters, {
          headers: this.headerOptions,
        })
      );
      return this.http.post<any>(url, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {}
  }

  DB_GetMTMHistory(Product_Id) {
    try {
      const url =
        this.interfaceURL +
        'GetMTMHistoryForProductFeatureDetails';
      const parameters = {
        Product_Id,
      };
      return this.http.post<any>(url, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {}
  }

  DB_GetDoc(Product_Id) {
    try {
      const url =
        this.interfaceURL +
        'GetMTMHistoryForProductFeatureDetails';
      const parameters = {
        Product_Id,
      };
      return this.http.post<any>(url, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {}
  }

  DB_GetUnderlyings(Product_Name) {
    try {
      const url =
        'https://1europe.test-equity-connect.com/FinIQService/RMWorkstation_JSON.svc/GetRMWProductDetails_Generic';
      const parameters = {
        FinIQRequestHeader: {
          EntityCode: 'BV',
          LoginID: 'Mayank',
          SourceSystem: 'FinIQ',
          MachineIP: '51.141.46.224',
          RequestID: '1',
          RequestAt: '04-Feb-2023 11:16:38 AM',
        },
        RMWGenericRequest: {
          Template_Name: 'EquityAutocallableNote',
          Product_Name,
          Isin: '',
          WhereClause: "Where Template_Code = 'EquityAutocallableNote'",
          FilterCriteria:
            "and RFM.RFMD_Layout_Code in ('Angular','Default','Lifecycle','Valuation')and RFM.RFMD_Layout_Code in ('Angular','Default','Lifecycle','Valuation')and RFM.RFMD_Layout_Code in ('Angular','Default','Lifecycle','Valuation')",
          SortingCriteria: '',
          RowsperRequest: '',
          ShowLikes: 'true',
          Folder_Name: '',
          ListType: '',
          Page_No: '',
        },
      };
      return this.http.post<any>(url, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {}
  }

  DB_GetPaymentHistory(Product_Id) {
    try {
      const url =
        this.interfaceURL +
        'GetPaymentHistoryForProductFeatureDetails';
      const parameters = {
        Product_Id,
      };
      return this.http.post<any>(url, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {}
  }

  DB_GetLPQuotes(productID) {
    try {
      const url =
        this.interfaceURL +'GetLPQuoteDataForProductFeatureDetails';
      const parameters = {
        productID,
      };
      return this.http.post<any>(url, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {}
  }

  DB_GetGreeksData(ISIN) {
    try {
      const url =
        this.interfaceURL +
        'GetLatestSixGreeksForProductFeaturesDetails';
      const parameters = {
        ISIN,
      };
      return this.http.post<any>(url, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      console.log(error);
    }
  }

  DB_GetLatestTokenIdForProductFeatureDetails(NoteMasterID,UserID) {
    try {
      const url = this.interfaceURL + 'GetLatestTokenIdForProductFeatureDetails';
      const parameters = {
        NoteMasterID,
        UserID
      };
      return this.http.post<any>(url, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      console.log(error);
    }
   }

   DB_GetWorkflowIDfromTokenIdForProductFeatureDetails(TokenID){
    try {
      const url = this.interfaceURL + 'GetWorkflowIDfromTokenIdForProductFeatureDetails';
      const parameters = {
        TokenID
      };
      return this.http.post<any>(url, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      console.log(error);
      
    }
   }

   GetProductWatchBlotter()
   {
    try {
      const url = this.interfaceURL + `pfd/GetProductWatchBlotter`;// "http://finiq840:84/FinIQService/ProductFeaturesDetails.svc/v1/GetProductWatchBlotter";//"http://52.163.118.116/FinIQService/ProductFeaturesDetails.svc/v1/GetProductWatchBlotter";// this.interfaceURL + `GetProductWatchBlotter`;
     // "https://sit-finiqlcm.test-1finiq.com/FinIQAPIGateway/api/pfd/GetProductWatchBlotter";
      //"http://finiq840:84/FinIQService/ProductFeaturesDetails.svc/v1/GetProductWatchBlotter"
      //"http://finiq786:82/FinIQService/ProductFeaturesDetails.svc/v1/GetProductWatchBlotter";
      //this.interfaceURL + `GetProductWatchBlotter`;
      // const parameters = {
      //   NoteMasterID
      // };
      return this.http.get<any>(url, {
        headers: this.headerOptions,
      });
    } catch (error) {
      console.log(error);
      
    }

   }
}
