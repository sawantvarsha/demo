import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BulkOrderEntryModel } from '../components/utilities/bulk-order-entry/bulk-order.model';
import { AuthService } from './auth/auth.service';
import { CustomerApiService } from './customer-api.service';
import { HomeApiService } from './home-api.service';

@Injectable({
  providedIn: 'root',
})
export class EquitiesService {
  interfaceURL = environment.interfaceURL;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  //Changed by MohanP | 02Feb22
  constructor(
    public http: HttpClient,
    public homeApi: HomeApiService,
    public custApi: CustomerApiService,
    public authApi: AuthService
  ) {}

  async GetShareHistoricalData(UnderlyingCode) {
    const webMethod = this.interfaceURL + 'GetShareHistoricalData';
    const parameters = {
      UnderlyingCode,
    };

    return this.http.post(webMethod, parameters).toPromise();
  }

  async GetShareInfo(NoteMasterID: any) {
    const webMethod = this.interfaceURL + 'EQProductInfo';

    const parameters = {
      NoteMasterID,
      LoginID: sessionStorage.getItem('Username'),
    };

    return this.http.post(webMethod, parameters).toPromise();
  }

  SubscribeEquitiesBulkOrder(
    UnderlyingCode,
    Side,
    ccy,
    TradeDate,
    SettType,
    SettDate,
    OrderType,
    Price,
    TimeInForce,
    ExpDate,
    OrderQty,
    Exchange,
    portfolio,
    CustomerName,
    username,
    Account_Number,
    CIF,
    NetAmt
  ) {
    try {
      const webMethod = this.interfaceURL + 'EQOrderSave';
      const parameters = {
        UnderlyingCode,
        Side,
        CCY: ccy,
        TradeDate,
        SettlType: SettType,
        SettleDate: SettDate,
        OrderType,
        Price,
        TimeInForce,
        ExpDate,
        OrderQty,
        ExDestination: Exchange,
        portfolio,
        CustomerName,
        UserID: username,
        Account_Number,
        CIF,
        NetAmt,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (ex) {
      // console.log(ex);
    }
  }
  async checkSuitability(order: BulkOrderEntryModel) {
    const webMethod = this.interfaceURL + 'checkSuitability';

    let crr = 'R5';
    switch (order.NoteMasterId) {
      case '1688': //Netflix
        crr = 'P3';
        break;
      case '5432': //"Starbucks Corporation"
        crr = 'P3';
        break;
      case '2061': //Intel Corp
        crr = 'P3';
        break;
      default:
        break;
    }
    const params = {
      entityId: this.authApi.EntityID,
      username: this.authApi.UserName,
      custId: order.customerDetails.custID,
      // crr: this.homeApi.CRR,
      productref: order.NoteMasterId,
      crr: crr,
      entityCode: this.authApi.EntityCode,
      commissionamt: order.commission.amount,
      commissionperct: order.commission.percentage,
      commissionreason: order.commission.reason,
      currency: order.currency,
      custName: order.customerDetails.custName,
      orderType: order.orderType,
      direction: order.direction,
      notional: order.settlementAmount,
      productCode: order.feedCode,
      fundingMode: 'FULLY FUNDED',
    };
    const response = await this.http
      .post<any>(webMethod, params)
      .toPromise()
      .then((res) => res.Get_SuitabilityAPIResult[0])
      .catch((err) => err);
    return response;
  }
  async getSuitabilityToken(order: BulkOrderEntryModel) {
    const webMethod = this.interfaceURL + 'getSuitabilityToken';
    const params = {
      entityId: this.authApi.EntityID,
      username: this.authApi.UserName,
      custId: order.customerDetails.custID,
      currency: order.currency,
      custName: order.customerDetails.custName,
      noteMasterId: order.NoteMasterId,
      notional: order.settlementAmount,
      portfolio: order.customerDetails.portfolio,
      orderID: order.orderID,
      suitabiltyToken: order.suitabiltyToken,
    };
    const response = await this.http
      .post<any>(webMethod, params)
      .toPromise()
      .then((res) => res)
      .catch((err) => err);
    return response;
  }
}
