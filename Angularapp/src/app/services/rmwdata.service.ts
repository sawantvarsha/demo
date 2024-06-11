import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RMWDataService {
  // viewOrders(I_EntityId: any, I_lngNoteMasterID: any, I_strCreatedBy: any, I_strFromDate: any, I_strToDate: any, LoginID: any, PrdType: any, strBranchName: any, strISIN: any, strIssuerID: any, strOrderNo: any, strSchemeName: any, str_CusID: any, str_OrderStatus: any, str_RMName: any, strcboserchcustomer: any, strissuertype: any, strordertype: any, I_strAccountNo: any, I_strFundCode: any, I_strShowOrdersFor: any, ShowAdditionalColumns: any) {
  //   throw new Error('Method not implemented.');
  // }
  interfaceURL = environment.interfaceURL;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(public http: HttpClient) {}


  getRMWData(
    TemplateName,
    username,
    filterString,
    selectedProduct,
    pageNo,
    EntityCode,
    pageSize,
    SortingCriteria,
    foldersString,
    ListType,
    Product_Name,
    Isin
  ) {
    try {
      const webMethod = this.interfaceURL + 'getRMWData';

      const parameters = {
        EntityCode,
        TemplateName,
        Product_Name,
        Isin,
        username,
        filterString,
        selectedProduct,
        Page_No: pageNo,
        RowsperRequest: pageSize,
        SortingCriteria,
        foldersString,
        ListType,
      };
      // const that = this;

     return  this.http.post<any>(webMethod + '', parameters, {
        // console.log(res);
        headers: this.headerOptions,
      });
    } catch (ex) {
      console.log(ex);
    }
  }


}