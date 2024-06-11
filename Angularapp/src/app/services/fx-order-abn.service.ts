import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppConfig } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class FxOrderAbnService {
  interfaceURL = environment.interfaceURL;
  constructor(public http: HttpClient) { }

  getAvailableCCYPairs() {
    const body = { DataType: AppConfig.settings.CSP_FX_Order_CCY_Pairs_Common_Data };
    return this.http.post<any>(this.interfaceURL + 'GetCommonDataEFX', body);
  }
  // getAvailableCCYPairs(dataType) {
  //   const body = { DataType: dataType };
  //   return this.http.post<any>(this.interfaceURL + 'GetCommonDataEFX', body);
  // }
  getAllValidCcyPairs() {
    const webMethod = this.interfaceURL + 'GetAllValidCcyPairsABN';
    return this.http.get<any>(webMethod);
  }
  getSettelementAccountGroups() {
    const webMethod = this.interfaceURL + 'GetSettelementAccountGroupsABN';
    return this.http.get<any>(webMethod);
  }
  getCurrencyPairsIndicativeRates(currencyPairs, tenor) {
    const webMethod = this.interfaceURL + 'GetCurrencyPairsIndicativeRatesABN';
    const params = {
      CurrencyPairs: currencyPairs,
      Tenor: tenor
    }
    return this.http.post<any>(webMethod, params);
  }

  getFavoritesFromTemplate(templateName) {
    const webMethod = this.interfaceURL + 'getfavoriteFromTemplates';
    const params = {
      templateName
    };
    return this.http.post<any>(webMethod, params);
  }
  deleteCcyFromTemplate(templateName, tileID, index) {
    const webMethod = this.interfaceURL + 'deletefavoriteFromTemplates';
    const params = {
      templateName,
      tileID,
      index
    };
    return this.http.post<any>(webMethod, params);
  }
  addNewCcyInTemplate(templateName, productName, index) {
    const webMethod = this.interfaceURL + 'addNewCcyFromTemplate';
    const params = {
      templateName,
      productName,
      index
    };
    return this.http.post<any>(webMethod, params);
  }

  GetCcyPairPointShiftDetails(CCYOption, Currency, Mode, EntityID, ProductCode) {

    const webMethod = this.interfaceURL + 'GetCcyPairPointShiftSF';
    const parameters = {
      CCYOption,
      Currency,
      ProductCode,
      index: '1',
      Mode,
      EntityID
    };
    return this.http.post(webMethod, parameters);
  }

  placeQuote(consumerQuoteReference, baseccy, basenotional = '10000', altccy, altnotional = '0', settlementDate, settlementAccountGroup) {
    const webMethod = this.interfaceURL + 'placequote';
    const params = {
      consumerQuoteReference,
      baseccy,
      basenotional,
      altccy,
      altnotional,
      settlementDate,
      settlementAccountGroup
    };
    return this.http.post<any>(webMethod, params);
  }
  placeOrder(consumerQuoteReference, baseccy, buyAmount, sellAmount, altccy, settlementDate, settlementAccountGroup, quoteSignature) {
    const webMethod = this.interfaceURL + 'placeorder';
    const params = {
      consumerQuoteReference,
      baseccy,
      buyAmount,
      sellAmount,
      altccy,
      settlementDate,
      settlementAccountGroup,
      quoteSignature
    };
    return this.http.post<any>(webMethod, params);
  }
  getOrderDetails(orderid) {
    const webMethod = this.interfaceURL + 'getorderdetails';
    const params = {
      orderid
    };
    return this.http.post<any>(webMethod, params);
  }
}
