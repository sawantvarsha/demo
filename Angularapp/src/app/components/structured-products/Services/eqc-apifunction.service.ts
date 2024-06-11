import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EqcApifunctionService {
  interfaceUrl = environment.interfaceURL;
  // private Token: string = '';
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  sharesArr: any[] = [];

  constructor(private http: HttpClient, public authApi: AuthService) {
    this.sharesArr = [null, undefined].includes(
      JSON.parse(sessionStorage.getItem('sharesJson'))
    )
      ? []
      : JSON.parse(sessionStorage.getItem('sharesJson'));
  }

  GetToken() {
    return sessionStorage.getItem('EQC_Token');
  }

  SetToken(token: string) {
    sessionStorage.setItem('EQC_Token', token);
  }

  GetLoggedInUser() {
    return sessionStorage.getItem('EQC_Username');
  }

  SetLoggedInUser() {
    sessionStorage.setItem('EQC_Username', 'Mobile1');
  }

  AuthenticateUser(username, password) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/AuthenticateUser';
      const parameters = {
        userName: username,
        password: password,
        // userName: this.authApi.UserName,
        // userName: this.GetLoggedInUser(),
        // "password": password,
        // "password": "Password123",
        // ip: '192.168.2.131',
        ip: '',//Changed by SandipA for Internal IP Address Disclosure @05-Sep-23 
        imei: '8613750306150861',
      };

      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {}
  }

  loadShares() {
    try {
      const webMethod = this.interfaceUrl + 'EQC/GetShares';
      const parameters = {
        userName: this.authApi.UserName,
        // userName: this.GetLoggedInUser(),
        token: this.GetToken(),
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {}
  }

  loadCurrency() {
    try {
      const webMethod = this.interfaceUrl + 'EQC/GetCCY';
      return this.http
        .get<any>(webMethod, { headers: this.headerOptions })
        .toPromise();
    } catch (error) {}
  }

  LoadRiskRating(ShareCode: any) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/GetUnderlyingRiskRatingShare';
      const parameters = { Share: ShareCode };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {}
  }

  loadShareSpotRate(strPair: string) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/GetShareSpotRate';
      const parameters = { strPair };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  calculateNotional(modelObject: any) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/AccrualDays';
      const parameters = {
        UserName: this.GetLoggedInUser(),
        Exchange: modelObject.UnderlyingExchangeCode,
        Tenor: modelObject.Tenor,
        TenorType: modelObject.SelectedTenorType.substr(0, 1),
        token: this.GetToken(),
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {}
  }

  fnGetSpot(UnderlyingCode) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/SpotInfo';
      const parameters = {
        UserName: this.GetLoggedInUser(),
        share: UnderlyingCode,
        token: this.GetToken(),
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {}
  }

  fnGetLPList(modelClass: any) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/LPList';
      const parameters = {
        UserName: this.GetLoggedInUser(),
        token: this.GetToken(),
        Product: modelClass.ProductName,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {}
  }

  fnAccumPricing(modelClass: any) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/AccumDecum/Quote';

      let GuaranteedDuration: string;
      let GuaranteedDurationType: string;

      if (modelClass.SelectedFrequency === 'Monthly') {
        GuaranteedDuration = '' + modelClass.SelectedGuaranteePeriod;
        GuaranteedDurationType = 'MONTH';
      } else if (modelClass.SelectedFrequency === 'BiWeekly') {
        GuaranteedDuration = modelClass.SelectedGuaranteePeriod.toString();
        GuaranteedDurationType = 'WEEK';
      }
      const parameters = {
        userName: 'Mobile1',
        type: 'ACCUMULATOR',
        StrikePercentage:
          modelClass.SolveFor === 'Strike' ? '0.0' : modelClass.Strike,
        UnderlyingCode: modelClass.UnderlyingCode,
        TenorType: modelClass.SelectedTenorType,
        Tenor: modelClass.Tenor,
        CashCurrency: modelClass.UnderlyingCurrency,
        Exchange: modelClass.UnderlyingExchangeCode,
        Frequency: modelClass.SelectedFrequency,
        LeverageRatio: modelClass.Leverage,
        Upfront:
          modelClass.SolveFor === 'Strike'
            ? (parseFloat(modelClass.Upfront) * 100).toString()
            : '0',
        SolveFor: modelClass.SolveFor,
        KOSettlement: 'KO+1',
        KOPercentage: modelClass.KO,
        GuaranteedDuration: GuaranteedDuration,
        GuaranteedDurationType: GuaranteedDurationType,
        token: this.GetToken(),
        NoOfShare: modelClass.DailyNoOfShares,
        PPDetails: modelClass.PPDetailsStr,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (Ex) {}
  }

  fnLoopAccumPricing(PPDetails: any) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/ACCDEC/QuoteResponse';
      const parameters = {
        userName: this.GetLoggedInUser(),
        PPDetails: PPDetails,
        token: this.GetToken(),
      };
      return this.http.post<any>(webMethod, JSON.stringify(parameters), {
        headers: this.headerOptions,
      });
    } catch (Ex) {}
  }

  IBPriceCalculation(
    UserName: any,
    ClientYield: any,
    Ccy: any,
    Upfront: any,
    SettlementDate: any,
    MaturityDate: any
  ) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/IBPriceCalculation';
      const parameters = {
        userName: UserName,
        ClientYield: ClientYield,
        Ccy: Ccy,
        Upfront: Upfront,
        SettlementDate: SettlementDate,
        MaturityDate: MaturityDate,
      };
      return this.http.post<any>(webMethod, JSON.stringify(parameters), {
        headers: this.headerOptions,
      });
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  BookingBranch(userName: any) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/BookingBranch';
      const parameters = {
        userName: userName,
      };
      return this.http.post<any>(webMethod, JSON.stringify(parameters), {
        headers: this.headerOptions,
      });
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  EQCRef(pName: any, tenor: any, tenorType: any, userName: any) {
    try {
      //console.log(' In API EQCRef');
      const webMethod = this.interfaceUrl + 'EQC/EQCRef';
      const parameters = {
        userName: userName,
        productName: pName,
        Tenor: tenor,
        TenorType: tenorType,
      };
      return this.http.post<any>(webMethod, JSON.stringify(parameters), {
        headers: this.headerOptions,
      });
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  RMList(userName: any) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/RMList';
      const parameters = {
        userName: userName,
      };
      return this.http.post<any>(webMethod, JSON.stringify(parameters), {
        headers: this.headerOptions,
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  SetDates(DaysCount, shareCode, Tenor, userName) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/Dates';
      const parameters = {
        SoftTenor: Tenor,
        SettlementDays: DaysCount,
        UnderlyingCode: shareCode,
        userName: userName,
        token: '',
      };
      return this.http.post<any>(webMethod, JSON.stringify(parameters), {
        headers: this.headerOptions,
      });
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  GetLPList(Product) {
    const webMethod = this.interfaceUrl + 'EQC/EQCLPStatus';
    const parameters = {
      Product,
      Username: this.GetLoggedInUser(),
      token: this.GetToken(),
    };
    return this.http.post<any>(webMethod, JSON.stringify(parameters), {
      headers: this.headerOptions,
    });
  }
  EQOSetDates(DaysCount, shareCode, Tenor, userName) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/EQODates';
      const parameters = {
        SoftTenor: Tenor,
        SettlementDays: DaysCount,
        UnderlyingCode: shareCode,
        userName: userName,
        token: '',
      };
      return this.http.post<any>(webMethod, JSON.stringify(parameters), {
        headers: this.headerOptions,
      });
    } catch (error) {
      //console.log("Error:", error);
    }
  }
  // Get historical data
  GetShareHistoricalData(Underlyingcode) {
    try {
      const webMethod = this.interfaceUrl + 'EQC/GetSharePriceHistory';
      const parameters = {
        userName: this.GetLoggedInUser(),
        token: this.GetToken(),
        Underlyingcode,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (EX) {}
  }
}
