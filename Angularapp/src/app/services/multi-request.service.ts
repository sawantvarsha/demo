import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MultiRequestService {

  header = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  interfaceUrl = environment.interfaceURL;

  constructor(private http: HttpClient) { }


  getProductDetails(productCode: string) {
    const webMethod = this.interfaceUrl + "Get_ProdDetails";
    const parameters = {
      Product_Code: productCode
    };
    return this.http.post<any>(webMethod, parameters, this.header);
  }

  getOptionCut(entityId: string, productId: string, productcode: string, mode: string, pair: string, customerId: string) {
    const webMethod = this.interfaceUrl + 'GetOptionCutFXD';
    const parameters = {
      iEntityID: entityId,
      ProductID: productId,
      ProductCode: productcode,
      Mode: mode,
      Pair: pair,
      CustomerID: customerId
    };
    return this.http.post<any>(webMethod, parameters, this.header);
  }

  getCurrencyPairs(entityId: string, productId: string, productCode: string, mode: string, optionsCut: string) {
    const webMethod = this.interfaceUrl + "GetCurrencyPairsforFXD";
    const parameters = {
      iEntityID: entityId,
      ProductID: productId,
      ProductCode: productCode,
      Mode: mode,
      OptionCut: optionsCut
    };
    return this.http.post<any>(webMethod, parameters, this.header);
  }

  getTenor(entityId: string, productId: string, productCode: string, mode: string, memberType: string) {
    const webMethod = this.interfaceUrl + "GetTenor";
    const parameters = {
      EntityID: entityId,
      ProductID: productId,
      ProductCode: productCode,
      Mode: mode,
      MemberType: memberType
    };
    return this.http.post<any>(webMethod, parameters, this.header);
  }

  getTenorDays(softTenor: string, transDate: string) {
    const webMethod = this.interfaceUrl + "GetHardTenorDaysFXD";
    const parameters = {
      SoftTenor: softTenor,
      TransDate: transDate
    };
    return this.http.post<any>(webMethod, parameters, this.header);
  }

  getBidAsk(userId: string, productCode: string, currencyPair: string) {
    const webMethod = this.interfaceUrl + "GetBidAskForVanillaBarrier";
    const parameters = {
      UserID: userId,
      I_ProductCode: productCode,
      I_StandardPair: currencyPair
    };
    return this.http.post<any>(webMethod, parameters, this.header);
  }

  getDatesCalculation(entityId: string, productId: string, productCode: string, tradeDate: string, depoCcy: string, altCcy: string, tenor: string, tenorCode: string, optionCut: string) {
    const webMethod = this.interfaceUrl + "GetCalculateDatesVB";
    const parameters = {
      iEntityID: entityId,
      ProductID: productId,
      ProductCode: productCode,
      TradeDate: tradeDate,
      DepoCcy: depoCcy,
      AltCcy: altCcy,
      Tenor: tenor,
      Tenor_Code: tenorCode,
      optioncut: optionCut
    };
    return this.http.post<any>(webMethod, parameters, this.header);
  }

  getPriceProviderDetails(entityId: string, productId: string, productCode: string) {
    const webMethod = this.interfaceUrl + "GetPriceProviderDetails";
    const parameters = {
      iEntityID: entityId,
      ProductId: productId,
      ProductCode: productCode
    };
    return this.http.post<any>(webMethod, parameters, this.header);
  }
  getBuisnessDateVB(entityId) {
    const webMethod = this.interfaceUrl + "GetBusinessDateOneFinIQ";
    const parameters = {
      EntityID: entityId
    };
    return this.http.post<any>(webMethod, parameters, this.header);
  }

  getCcyPairPointShiftDetails(ccyOptions: string, ccy: string, mode: string, entityId: string, productCode: string) {
    const webMethod = this.interfaceUrl + "GetCcyPairPointShiftSF";
    const parameters = {
      CCYOption: ccyOptions,
      Currency: ccy,
      ProductCode: productCode,
      Mode: mode,
      EntityID: entityId
    };
    return this.http.post<any>(webMethod, parameters, this.header);
  }
  async getFXMultiRequestTiles(): Promise<any[]> {
    const webMethod = this.interfaceUrl + "getmultirequesttiles";
    return await this.http.get<any>(webMethod).toPromise().then((res: any[]) => {
      try {
        return res.sort((a, b) => { return a.index > b.index ? 1 : a.index < b.index ? -1 : 0 });
      } catch (error) {
        console.log(error);
      }

    }).catch(err => {
      console.log(err);
      return [];
    });
  }

  getNoOfFixings(entityId: string, productId: string, ccy: string, daybasis: string, depoCcy: string, altCcy: string, localCcy: string, globalCcy: string, optionCut: string, fixingFreq: string, settFreq: string,
    tradeDate: string, premiumDate: string, firstFixingDate: string, finalFixingDate: string, settlementDate: string, notPerFixing: string) {

    const webMethod = this.interfaceUrl + "GetNumberofFixings";
    const parameters = {
      "oRequest": {
        EntityID: entityId,
        ProductID: productId,
        CcyPair: ccy,
        DayBasis: daybasis,
        DepoCcy: depoCcy,
        AltCcy: altCcy,
        LocalCcy: localCcy,
        GlobalCcy: globalCcy,
        OptionCut: optionCut,
        FixingFreq: fixingFreq,
        SettlementFreq: settFreq,
        TradeDate: tradeDate,
        PremiumDate: premiumDate,
        FirstFixingDate: firstFixingDate,
        FinalFixingDate: finalFixingDate,
        SettlementDate: settlementDate,
        NotionalPerFixing: notPerFixing
      }

    };
    return this.http.post<any>(webMethod, parameters, this.header);
  }



  getDatesFX(EntityId: string, depoCcy: string, altCcy: string, CurrencyPair: string, productType: string, tenor: string, tenorCode: string, tradeDate: string, prodID: string, optionCut: string,
    Fixing_Frequency: string, Settlement_Frequency: string) {
    const webMethod = this.interfaceUrl + 'Get_FinIQ_CalculateDatesWrapper';
    const parameters = {
      DepoCcy: depoCcy,
      AltCcy: altCcy,
      CurrencyPair: CurrencyPair,
      TradeDate: tradeDate,
      Tenor: tenor,
      DR_Settlement_Days: '2',
      CR_Settlement_Days: '2',
      CheckHomeLocalCcyHoliday: 'Y',
      IsRollOverMode: 'N',
      RollOver_ValueDate: '',
      iEntityID: EntityId,
      Tenor_Code: tenorCode,
      Prem_Settlement_Days: '2',
      iProductId: prodID,
      I_ProductCode: productType,
      optioncut: optionCut,
      Fixing_Frequency,
      Settlement_Frequency
    }
    return this.http.post<any>(webMethod, parameters, this.header);
  }



  getPrice(
    entityId: string, productId: string, productType: string, currencyPair: string, depoCcy: string, altCcy: string, premCcy: string, settCcy: string, amountInDepoCcy: string,
    amountInAltCcy: string, direction: string, optionType: string, strike: string, lowerBarrier: string, upperBarrier: string, barrierType: string, tenor: string,
    knockInStyle: string, knockOutStyle: string, optionCut: string, priceProvider: string, solveFor: string, valueDate: string, fixingDate: string, maturityDate: string, templateId: string, templateCode: string, notionalPerfix: string, leverageFactor: string, fixingSettFreq: string, guaranteePeriod: string, koRate: string,
    targetInPips: number, targetGainUnit: string, xml: string, rmMarginPercentage: string, userId: string, pricingModel: string) {
    const webMethod = this.interfaceUrl + "FXOBestPriceServiceVBNew";
    const parameters = {
      EntityId: entityId,
      ProductType: productType,
      CurrencyPair: currencyPair,
      DepositCurrency: depoCcy,
      AlternateCurrency: altCcy,
      PremCurrency: premCcy,
      SettlementCcy: settCcy,
      AmountInDepositCurrency: (Number(amountInDepoCcy)).toString(),
      AmountInAlternateCurrency: (Number(amountInAltCcy)).toString(),
      BuySell: direction,
      CallPut: optionType,
      Strike: strike,
      LowerBarrier: parseFloat(lowerBarrier) ? parseFloat(lowerBarrier) : 0,
      UpperBarrier: parseFloat(upperBarrier) ? parseFloat(upperBarrier) : 0,
      BarrierType: barrierType,
      KnockIn_Style: knockInStyle,
      KnockOut_Style: knockOutStyle,
      OptionCut: optionCut,
      Tenor: tenor,
      ValueDate: valueDate,
      FixingDate: fixingDate,
      MaturityDate: maturityDate,
      PriceProviderDetails: priceProvider,
      SolveFor: solveFor,
      TemplateCode: templateCode,
      TemplateID: templateId,
      NotionalPerFix: notionalPerfix,
      LeverageFactor: leverageFactor,
      FixingSettFreq: fixingSettFreq,
      GuaranteedPeriod: guaranteePeriod,
      KORate: koRate,
      TargetInPips: targetInPips,
      TargetGainunit: targetGainUnit,
      blnIsMultiLeg: true,
      CAI_ID: 1565,
      UseExternalXML_Source: true,
      XMLString: xml,
      ProductID: productId,
      RMMarginPercentage: rmMarginPercentage,
      UserID: userId,
      PricingModel: pricingModel
    }
    return this.http.post<any>(webMethod, parameters, this.header);
  }
}
