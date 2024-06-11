import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LPScanService {
  interfaceURL = environment.interfaceURL;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  result: any;
  SessionID: any;

  Sharelist: any;
  datesResponse: any;

  constructor(public http: HttpClient) {
    this.Sharelist = undefined;
    this.datesResponse = undefined;
  }

  EQCcheckStatus() {
    // console.log('Uddesh LP SCAN');
    try {
      const webMethod = this.interfaceURL + 'EQCLPStatus';
      const parameters = {};

      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log('error in lp service file', error);
      return null;
    }
  }

  getDates(share: any, tenorno: any, tenortype: any) {
    if (tenortype == 'Month') {
      tenortype = 'M';
    } else if (tenortype == 'Year') {
      tenortype = 'Y';
    }

    try {
      const webMethod = this.interfaceURL + 'getDatesMaple';
      const paramters = {
        I_UserID: 'Mobile1',
        UnderlyingCode: share,
        Settlement_Days: 7,
        token: '',
        Tenor: tenorno + tenortype,
        I_Entity_Id: '',
      };

      return this.http.post<any>(webMethod, paramters);
    } catch (error) {
      console.log('error in dates service file LPScan', error);
    }
  }

  EQCPriceQuote(
    share: any,
    tenorno: any,
    tenortype: any,
    strike: any,
    datesRes: any
  ) {
    try {
      const webMethod = this.interfaceURL + 'EQCLPPriceQuote';
      const parameters = {
        Share: share,
        Tenor: tenorno + tenortype,
        StrikePercent: strike,
        ExpiryDate: datesRes[0].FixingDate,
        MaturityDate: datesRes[0].MaturityDate,
        SettlementDate: datesRes[0].ValueDate,
      };
      console.log('parameters for EQCPriceQuote ', parameters);

      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log('error in EQCPrice for pricing', error);
      return null;
    }
  }

  EQCPriceQuoteResponse(ppdetails: any) {
    try {
      console.log('in service', ppdetails);
      const webMethod = this.interfaceURL + 'EQCLPPriceQuoteResponse';
      const parameters = {
        ppdetails,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log('error in EQCPrice for pricing', error);
      return null;
    }
  }

  FXSPOTPriceCheck(ccy: any, buysell : any, datesRes : any) {
    this.SessionID = '_' + Math.random().toString(36).substr(2, 9);
    try {
      const webMethod =
        this.interfaceURL + 'QuoteRequestforFXRateForCurrencyPairLPScan';
      const parameters = {
        SessionID: this.SessionID,
        ProductCode: 'FXC',
        // CurrencyPair: 'EUR - USD',
        CurrencyPair: ccy,
        // Direction: 'Buy',
        Direction: buysell,
        CCY1AmountNearLeg: '100000',
        CCY2AmountNearLeg: '0',
        TenorCode: 'Spot',
        // FixingDate: '20-Apr-2022',
        // ValueDate: '22-Jan-2022',
        // SpotDate: '20-Apr-2022',
        FixingDate: datesRes.FinIQFixingDate,
        ValueDate: datesRes.FinIQValueDate,
        SpotDate: datesRes.FinIQSpotDate,
        RMSpread: 0,
        IsStraightToExecution: false,
        MarginType: 'fx',
        PriceProvider: 'UBS,JPM,OCBC,Citi,BNP',
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log('FX SPOT error in service', error);
      return null;
    }
  }

  FXDPriceCheck(inccy : any, depccy : any, buysell : any, tenor: any, strike : any, dates: any) {
    try {
      const webMethod = this.interfaceURL + 'FXOBestPriceServiceFDXLPScan';
      const parameters = {
        ProductType: 'FX Option',
        // CurrencyPair: 'EUR - USD',
        CurrencyPair: inccy+' - '+depccy,
        // DepositCurrency: 'EUR',
        DepositCurrency: inccy,
        // AlternateCurrency: 'USD',
        AlternateCurrency: depccy,
        // PremCurrency: 'EUR',
        PremCurrency: inccy,
        // SettlementCcy: 'USD',
        SettlementCcy: depccy,
        AmountInDepositCurrency: 50000,
        AmountInAlternateCurrency: 56665,
        // BuySell: 'Sell',
        BuySell: buysell,
        CallPut: 'call',
        // Strike: 1.1333,
        Strike: strike,
        OptionCut: 'TOK',
        // Tenor: '3M',
        Tenor: tenor,
        // ValueDate: '22-Jan-2022',
        // FixingDate: '20-Apr-2022',
        // MaturityDate: '22-Apr-2022',
        ValueDate: dates[0].ValueDate,
        FixingDate: dates[0].FixingDate,
        MaturityDate: dates[0].MaturityDate,
        LP: 'BNP:Citi:DB:HSBC:JPM:Leonteq:OCBC:UBS',
      };

      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log('Error in PXD Price check LP Scan', error);
    }
  }

  getShareList() {
    if (this.Sharelist != undefined) {
      console.log('available');
      return this.Sharelist;
    } else {
      console.log('not avail');
      this.callsharelistService().subscribe((res) => {
        console.log('res in res', res);
        this.Sharelist = res.ListProduct.items;
        console.log(this.Sharelist);
        return this.Sharelist;
      });
    }
  }

  callsharelistService() {
    try {
      const webMethod = this.interfaceURL + 'getsharelist';
      const parameters = {
        ProductName: '',
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log('error in sharelist fetch in lpscan service', error);
      return null;
    }
  }

  async getStatusCheckRows() {
    try {
      const webMethod = this.interfaceURL + 'getstatuscheckrows';

      const rows = await this.http
        .get<any>(webMethod)
        .toPromise()
        .then((res) => {
          return res;
        });
      return rows;
    } catch (error) {
      console.log('error in sharelist fetch in lpscan service', error);
      return null;
    }
  }
}
