import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FXLimitService {
  interfaceURL = environment.interfaceURL;
  PointShiftDetails: any;

  constructor(public http: HttpClient) {
    // this.PointShiftDetails = undefined;
  }

  getCcyPairDetailsforAll() {
    if (!this.PointShiftDetails) {
      console.log('data undefined');
      try {
        const webMethod = this.interfaceURL + 'GetCcyPairPointShiftSF';
        const parameters = {
          CCYOption: 'PAIR',
          Currency: '',
          ProductCode: 'FXC',
          EntityID: '4',
          Mode: 'FXCAPI',
        };

        this.PointShiftDetails = this.http.post<any>(webMethod, parameters);
        return this.PointShiftDetails;
      } catch (ex) {
        console.log('exception caught in getCcyPairDetails()', ex);
      }
    } else {
      console.log('data available');
      return this.PointShiftDetails;
    }
  }

  getHistoricalDataforCcyPairWithTenor(paircode: any, tenor: any) {
    try {
      const webMethod = this.interfaceURL + 'GetHistoricalFeedDataWithTenor';
      const options = {
        paircode,
        tenor,
      };
      return this.http.post<any>(webMethod, options);
    } catch (ex) {
      console.log(
        'exception caught in getHistoricalDataforCcyPairWithTenor()',
        ex
      );
      return null;
    }
  }

  getOpenTradesforLimitOrder(fromdate: any, todate: any) {
    try {
      const webMethod = this.interfaceURL + 'GetFXLimitOpenTrades';
      const parameters = {
        fromdate,
        todate,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (ex) {
      console.log('exception occured in getOpenTradesforLimitOrder()', ex);
      return null;
    }
  }

  getHistoricalTradesforLimitOrder(fromdate: any, todate: any) {
    try {
      const webMethod = this.interfaceURL + 'GetFXLimitHistoricalTrades';
      const parameters = {
        fromdate,
        todate,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (ex) {
      console.log(
        'exception occured in getHistoricalTradesforLimitOrder()',
        ex
      );
      return null;
    }
  }


  //already present in apifunctio.services.ts
//   getLimitOrderBlotterData(
//     WorflowType: any,
//     WorkFlowTypeId: any,
//     WorkflowSuperType: any,
//     ProductID: any,
//     FromDate: any,
//     ToDate: any,
//     customFilter: any,
//     rows: any,
//     PageNo?: any
//   ) {
//     try {
//       const webMethod = this.interfaceURL + 'LimitOrderWorkflowBlotter';
//       const parameters = {
//         WorflowType,
//         WorkFlowTypeId,
//         ProductID,
//         FromDate,
//         ToDate,
//         WorkflowSuperType,
//         Login: 'Dealer1',
//         Filter: customFilter,
//         Rows: rows,
//         PageNo: PageNo || 1,
//       };
//       return this.http.post<any>(webMethod, parameters);
//     } catch (ex) {
//       console.log('Exception caught at getLimitOrderBlotterData() ', ex);
//       return null;
//     }
//   }
}
