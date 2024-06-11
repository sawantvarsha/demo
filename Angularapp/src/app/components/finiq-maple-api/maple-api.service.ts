import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Injectable({
  providedIn: 'root',
})
export class MapleAPIService {
  constructor() {}

  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  private currecyPairObserver = new BehaviorSubject<any>([]);
  currecyPair = this.currecyPairObserver.asObservable();

  private datesObserver = new BehaviorSubject<any>([]);
  dates = this.datesObserver.asObservable();

  private quoteObserver = new BehaviorSubject<any>([]);
  quote = this.quoteObserver.asObservable();

  private quoteResponseObserver = new BehaviorSubject<any>([]);
  quoteResponse = this.quoteResponseObserver.asObservable();

  private ibPriceObserver = new BehaviorSubject<any>([]);
  ibPrice = this.ibPriceObserver.asObservable();

  private tenorObserver = new BehaviorSubject<any>([]);
  tenor = this.tenorObserver.asObservable();

  private basketObserver = new BehaviorSubject<any>([]);
  basket = this.basketObserver.asObservable();

  private amountObserver = new BehaviorSubject<any>([]);
  amount = this.amountObserver.asObservable();

  private ccyFXDObserver = new BehaviorSubject<any>([]);
  ccyFXD = this.ccyFXDObserver.asObservable();

  private prodDetailsObserver = new BehaviorSubject<any>([]);
  prodDetails = this.prodDetailsObserver.asObservable();

  private datesFXDObserver = new BehaviorSubject<any>([]);
  datesFXD = this.datesFXDObserver.asObservable();

  private bidAskFXDObserver = new BehaviorSubject<any>([]);
  bidAskFXD = this.bidAskFXDObserver.asObservable();

  private priceFXDObserver = new BehaviorSubject<any>([]);
  priceFXD = this.priceFXDObserver.asObservable();

  private bookTradeFXDObserver = new BehaviorSubject<any>([]);
  bookTradeFXD = this.bookTradeFXDObserver.asObservable();

  private productConfigsFXDObserver = new BehaviorSubject<any>([]);
  productConfigsFXD = this.productConfigsFXDObserver.asObservable();

  private businessDatesFXDObserver = new BehaviorSubject<any>([]);
  businessDatesFXD = this.businessDatesFXDObserver.asObservable();

  private nooffixingsFXDObserver = new BehaviorSubject<any>([]);
  nooffixingsFXD = this.nooffixingsFXDObserver.asObservable();

  private entityDataFXDObserver = new BehaviorSubject<any>([]);
  entityDataFXD = this.entityDataFXDObserver.asObservable();

  private lpListFXDObserver = new BehaviorSubject<any>([]);
  lpListFXD = this.lpListFXDObserver.asObservable();

  private EQprodinfoObserver = new BehaviorSubject<any>([]);
  EQprodinfo = this.EQprodinfoObserver.asObservable();

  private EQordersaveObserver = new BehaviorSubject<any>([]);
  EQordersave = this.EQordersaveObserver.asObservable();

  private mutualdetailsObserver = new BehaviorSubject<any>([]);
  mutualdetails = this.mutualdetailsObserver.asObservable();

  private fundssubscribeObserver = new BehaviorSubject<any>([]);
  fundssubscribe = this.fundssubscribeObserver.asObservable();

  private appidObserver = new BehaviorSubject<any>([]);
  appid = this.appidObserver.asObservable();

  private prodbyTempObserver = new BehaviorSubject<any>([]);
  prodbyTemp = this.prodbyTempObserver.asObservable();

  private checktempObserver = new BehaviorSubject<any>([]);
  checktemp = this.checktempObserver.asObservable();

  private prodbycodeObserver = new BehaviorSubject<any>([]);
  prodbycode = this.prodbycodeObserver.asObservable();

  private savelayObserver = new BehaviorSubject<any>([]);
  savelay = this.savelayObserver.asObservable();

  private accesscontrolObserver = new BehaviorSubject<any>([]);
  accesscontrol = this.accesscontrolObserver.asObservable();

  private deltempObserver = new BehaviorSubject<any>([]);
  deltemp = this.deltempObserver.asObservable();

  private depodateObserver = new BehaviorSubject<any>([]);
  depodate = this.depodateObserver.asObservable();

  private depositccyObserver = new BehaviorSubject<any>([]);
  depositccy = this.depositccyObserver.asObservable();

  private depositfxdrateObserver = new BehaviorSubject<any>([]);
  depositfxdrate = this.depositfxdrateObserver.asObservable();

  private deposittenorObserver = new BehaviorSubject<any>([]);
  deposittenor = this.deposittenorObserver.asObservable();

  private depositsaveUCPObserver = new BehaviorSubject<any>([]);
  depositsaveUCP = this.depositsaveUCPObserver.asObservable();

  private ccyPairCashFXObserver = new BehaviorSubject<any>([]);
  ccyPairCashFX = this.ccyPairCashFXObserver.asObservable();

  private FXCashPairDatesObserver = new BehaviorSubject<any>([]);
  FXCashPairDates = this.FXCashPairDatesObserver.asObservable();

  private USPCustomFilterObserver = new BehaviorSubject<any>([]);
  USPCustomFilter = this.USPCustomFilterObserver.asObservable();

  private ccyELIObserver = new BehaviorSubject<any>([]);
  ccyELI = this.ccyELIObserver.asObservable();

  private extppdetailsELIObserver = new BehaviorSubject<any>([]);
  extppdetailsELI = this.extppdetailsELIObserver.asObservable();

  private insertELIObserver = new BehaviorSubject<any>([]);
  insertELI = this.insertELIObserver.asObservable();

  private savetradeELIObserver = new BehaviorSubject<any>([]);
  savetradeELI = this.savetradeELIObserver.asObservable();

  interfaceUrl = environment.interfaceURL;

  mapleCurrencyPair() {
    try {
      const webMethod = this.interfaceUrl + 'getCurrencyPairMaple';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'GET',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({}),
        processData: false,
        success(data) {
          that.currecyPairObserver.next(data);
          console.log('maple..', data);
        },
      });
    } catch (error) {}
  }

  mapleDates(
    I_Entity_Id,
    I_UserID,
    UnderlyingCode,
    Tenor,
    Settlement_Days,
    token
  ) {
    try {
      const webMethod = this.interfaceUrl + 'getDatesMaple';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          I_Entity_Id: I_Entity_Id,
          I_UserID: I_UserID,
          UnderlyingCode: UnderlyingCode,
          Tenor: Tenor,
          Settlement_Days: Settlement_Days,
          token: token,
          // CurrentTileID : CurrentTileID
        }),
        processData: false,
        success(data) {
          that.datesObserver.next(data);
          console.log('maple dates..', data);
        },
      });
    } catch (error) {}
  }

  mapleQuote(
    UserID,
    I_Entity_Id,
    Type,
    Exchange,
    UnderlyingCode,
    Ccy,
    strSolveFor,
    BarrierPerc,
    Tenor,
    strikePerc,
    PricePerc,
    PPDetails,
    BarrierMode,
    Settlement_Days,
    Upfront,
    token
  ) {
    try {
      const webMethod = this.interfaceUrl + 'getQuoteMaple';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          UserID: UserID,
          I_Entity_Id: I_Entity_Id,
          Type: Type,
          Exchange: Exchange,
          UnderlyingCode: UnderlyingCode,
          Ccy: Ccy,
          strSolveFor: strSolveFor,
          BarrierPerc: BarrierPerc,
          Tenor: Tenor,
          strikePerc: strikePerc,
          PricePerc: PricePerc,
          PPDetails: PPDetails,
          BarrierMode: BarrierMode,
          Settlement_Days: Settlement_Days,
          Upfront: Upfront,
          token: token,

          // CurrentTileID : CurrentTileID
        }),
        processData: false,
        success(data) {
          that.quoteObserver.next(data);
          console.log('maple quote..', data);
        },
      });
    } catch (error) {}
  }

  mapleQuoteResponse(UserID, PPDetails, token) {
    try {
      const webMethod = this.interfaceUrl + 'getQuoteResponseMaple';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          UserID: UserID,
          PPDetails: PPDetails,
          token: token,
          // CurrentTileID : CurrentTileID
        }),
        processData: false,
        success(data) {
          that.quoteResponseObserver.next(data);
          console.log('maple quote response..', data);
        },
      });
    } catch (error) {}
  }

  mapleIBPrice(
    UserName,
    ClientYield,
    Ccy,
    Upfront,
    SettlementDate,
    MaturityDate,
    token
  ) {
    try {
      const webMethod = this.interfaceUrl + 'getIBPriceMaple';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          UserName: UserName,
          ClientYield: ClientYield,
          Ccy: Ccy,
          Upfront: Upfront,
          SettlementDate: SettlementDate,
          MaturityDate: MaturityDate,
          token: token,
          // CurrentTileID : CurrentTileID
        }),
        processData: false,
        success(data) {
          that.ibPriceObserver.next(data);
          console.log('maple ib price response..', data);
        },
      });
    } catch (error) {}
  }

  mapleTenor() {
    try {
      const webMethod = this.interfaceUrl + 'getTenorMaple';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({}),
        processData: false,
        success(data) {
          that.tenorObserver.next(data);
          console.log('maple tenor response..', data);
        },
      });
    } catch (error) {}
  }

  mapleBasket() {
    try {
      const webMethod = this.interfaceUrl + 'getBasketMaple';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({}),
        processData: false,
        success(data) {
          that.basketObserver.next(data);
          console.log('maple tenor response..', data);
        },
      });
    } catch (error) {}
  }

  mapleAmount() {
    try {
      const webMethod = this.interfaceUrl + 'getAmountMaple';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({}),
        processData: false,
        success(data) {
          that.amountObserver.next(data);
          console.log('maple tenor response..', data);
        },
      });
    } catch (error) {}
  }

  maplegetccy(
    iEntityID,
    iProductId,
    ProductCode,
    Mode,
    sAssetIdentifier,
    FetchOnlyStandardPairs,
    selectedDepoCcy,
    selectedAlternatCcy,
    CcySearch,
    OptionCut
  ) {
    try {
      const webMethod = this.interfaceUrl + 'getCcyPairs';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          iEntityID: iEntityID,
          iProductId: iProductId,
          ProductCode: ProductCode,
          Mode: Mode,
          sAssetIdentifier: sAssetIdentifier,
          FetchOnlyStandardPairs: FetchOnlyStandardPairs,
          selectedDepoCcy: selectedDepoCcy,
          selectedAlternatCcy: selectedAlternatCcy,
          CcySearch: CcySearch,
          OptionCut: OptionCut,
        }),
        processData: false,
        success(data) {
          that.ccyFXDObserver.next(data);
          console.log('maple fxd ccy response..', data);
        },
      });
    } catch (error) {}
  }

  maplegetproddetails(Product_Code) {
    try {
      const webMethod = this.interfaceUrl + 'getProdDetails';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          Product_Code: Product_Code,
        }),
        processData: false,
        success(data) {
          that.prodDetailsObserver.next(data);
          console.log('maple fxd get prod details response..', data);
        },
      });
    } catch (error) {}
  }

  maplegetdates(
    DepoCcy,
    AltCcy,
    CurrencyPair,
    TradeDate,
    Tenor,
    iEntityID,
    Tenor_Code,
    Fixing_Frequency,
    Settlement_Frequency,
    iProductId,
    I_ProductCode,
    I_Mode,
    optioncut,
    CurrentTileID,
    tileID
  ) {
    try {
      const webMethod = this.interfaceUrl + 'getDates';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          DepoCcy: DepoCcy,
          AltCcy: AltCcy,
          CurrencyPair: CurrencyPair,
          TradeDate: TradeDate,
          Tenor: Tenor,
          iEntityID: iEntityID,
          Tenor_Code: Tenor_Code,
          Fixing_Frequency: Fixing_Frequency,
          Settlement_Frequency: Settlement_Frequency,
          iProductId: iProductId,
          I_ProductCode: I_ProductCode,
          I_Mode: I_Mode,
          optioncut: optioncut,
          CurrentTileID: CurrentTileID,
        }),
        processData: false,
        success(data) {
          that.datesFXDObserver.next([data, tileID]);
          console.log('maple fxd get dates response..', data, tileID);
        },
      });
    } catch (error) {}
  }

  maplegetlplist(iEntityID, ProductId, Mode, UserGroup, PricingMode) {
    try {
      const webMethod = this.interfaceUrl + 'getlplist';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          iEntityID: iEntityID,
          ProductId: ProductId,
          Mode: Mode,
          UserGroup: UserGroup,
          PricingMode: PricingMode,
        }),
        processData: false,
        success(data) {
          that.lpListFXDObserver.next(data);
          console.log('maple fxd get lp list response..', data);
        },
      });
    } catch (error) {}
  }

  maplegetbidask(I_StandardPair, I_ProductCode, I_Mode, tileID) {
    try {
      const webMethod = this.interfaceUrl + 'getBidAsk';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          I_StandardPair: I_StandardPair,
          I_ProductCode: I_ProductCode,
          I_Mode: I_Mode,
        }),
        processData: false,
        success(data) {
          that.bidAskFXDObserver.next([data, tileID]);
          console.log('maple fxd get bid-ask details response..', data, tileID);
        },
      });
    } catch (error) {}
  }

  maplegetprice(
    ProductType,
    CurrencyPair,
    DepositCurrency,
    AlternateCurrency,
    PremCurrency,
    SettlementCcy,
    AmountInDepositCurrency,
    AmountInAlternateCurrency,
    SolveFor,
    BuySell,
    CallPut,
    Strike,
    LowerBarrier,
    UpperBarrier,
    BarrierType,
    KnockIn_Style,
    KnockOut_Style,
    OptionCut,
    MarketPremium,
    MarketPremiumAmount,
    RMMarginPercentage,
    Tenor,
    TradeDate,
    ValueDate,
    FixingDate,
    MaturityDate,
    NDFFlag,
    IsMetal,
    UserID,
    EntityId,
    IndicativeQuote,
    GroupKey,
    DCDRFQID,
    Parant_DCDRFQID,
    Deal_Rate2,
    NoteMasterID,
    blnIsMultiLeg,
    InternalLPID,
    NotionalInPremCcy,
    PriceProviderDetails,
    MaxQuoteTimeOut,
    MinQuoteTimeOutForFirstQuoteRFQ,
    IgnoreValidTill,
    CheckOnlyRFQ,
    UseMaxTTL,
    MinQuoteValidityPeriodRFQ,
    MaxTTL,
    CIF_Code,
    BTB_Protfolio_Code,
    Marketer_Code,
    Strategy_Code,
    ExternalXMLString,
    UseExternalXML_Source,
    TemplateCode,
    TemplateID,
    ProductID
  ) {
    try {
      const webMethod =
        this.interfaceUrl + 'GetFXOPriceFromExternalProvidersJSON';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          ProductType: ProductType,
          CurrencyPair: CurrencyPair,
          DepositCurrency: DepositCurrency,
          AlternateCurrency: AlternateCurrency,
          PremCurrency: PremCurrency,
          SettlementCcy: SettlementCcy,
          AmountInDepositCurrency: AmountInDepositCurrency,
          AmountInAlternateCurrency: AmountInAlternateCurrency,
          SolveFor: SolveFor,
          BuySell: BuySell,
          CallPut: CallPut,
          Strike: Strike,
          LowerBarrier: LowerBarrier,
          UpperBarrier: UpperBarrier,
          BarrierType: BarrierType,
          KnockIn_Style: KnockIn_Style,
          KnockOut_Style: KnockOut_Style,
          OptionCut: OptionCut,
          MarketPremium: MarketPremium,
          MarketPremiumAmount: MarketPremiumAmount,
          RMMarginPercentage: RMMarginPercentage,
          Tenor: Tenor,
          TradeDate: TradeDate,
          ValueDate: ValueDate,
          FixingDate: FixingDate,
          MaturityDate: MaturityDate,
          NDFFlag: NDFFlag,
          IsMetal: IsMetal,
          UserID: UserID,
          EntityId: EntityId,
          IndicativeQuote: IndicativeQuote,
          GroupKey: GroupKey,
          DCDRFQID: DCDRFQID,
          Parant_DCDRFQID: Parant_DCDRFQID,
          Deal_Rate2: Deal_Rate2,
          NoteMasterID: NoteMasterID,
          blnIsMultiLeg: blnIsMultiLeg,
          InternalLPID: InternalLPID,
          NotionalInPremCcy: NotionalInPremCcy,
          PriceProviderDetails: PriceProviderDetails,
          MaxQuoteTimeOut: MaxQuoteTimeOut,
          MinQuoteTimeOutForFirstQuoteRFQ: MinQuoteTimeOutForFirstQuoteRFQ,
          IgnoreValidTill: IgnoreValidTill,
          CheckOnlyRFQ: CheckOnlyRFQ,
          UseMaxTTL: UseMaxTTL,
          MinQuoteValidityPeriodRFQ: MinQuoteValidityPeriodRFQ,
          MaxTTL: MaxTTL,
          CIF_Code: CIF_Code,
          BTB_Protfolio_Code: BTB_Protfolio_Code,
          Marketer_Code: Marketer_Code,
          Strategy_Code: Strategy_Code,
          ExternalXMLString: ExternalXMLString,
          UseExternalXML_Source: UseExternalXML_Source,
          TemplateCode: TemplateCode,
          TemplateID: TemplateID,
          ProductID: ProductID,
        }),
        processData: false,
        success(data) {
          that.priceFXDObserver.next(data);
          console.log('maple fxd get bid-ask details response..', data);
        },
      });
    } catch (error) {}
  }

  maplebooktrade(
    EntityId,
    LoginId,
    DCD_RFQId,
    External_RFQId,
    PriceProviderName,
    ProductCode,
    Cust_Prem_Amt,
    Order_Response_TimeOut,
    TwoStepOrderExecutionYN,
    OrderRetryFlag,
    CurrentTileID
  ) {
    try {
      const webMethod =
        this.interfaceUrl + 'BookTradeAndGetExternalTradeNumber';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          EntityId: EntityId,
          LoginId: LoginId,
          DCD_RFQId: DCD_RFQId,
          External_RFQId: External_RFQId,
          PriceProviderName: PriceProviderName,
          ProductCode: ProductCode,
          Cust_Prem_Amt: Cust_Prem_Amt,
          Order_Response_TimeOut: Order_Response_TimeOut,
          TwoStepOrderExecutionYN: TwoStepOrderExecutionYN,
          OrderRetryFlag: OrderRetryFlag,
          CurrentTileID: CurrentTileID,
        }),
        processData: false,
        success(data) {
          that.bookTradeFXDObserver.next(data);
          console.log('maple fxd bookTradeFXD details response..', data);
        },
      });
    } catch (error) {}
  }

  mapleproductConfigs(EntityId, ProductID) {
    try {
      const webMethod = this.interfaceUrl + 'GetProductConfigs';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          EntityId: EntityId,
          ProductID: ProductID,
        }),
        processData: false,
        success(data) {
          that.productConfigsFXDObserver.next(data);
          console.log('maple fxd productConfigs details response..', data);
        },
      });
    } catch (error) {}
  }

  maplegetbusinessDates(EntityId) {
    try {
      const webMethod = this.interfaceUrl + 'GetBusinessDate';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          EntityId: EntityId,
        }),
        processData: false,
        success(data) {
          that.businessDatesFXDObserver.next(data);
          console.log(
            'maple fxd businessDatesFXDObserver details response..',
            data
          );
        },
      });
    } catch (error) {}
  }

  maplegetnooffixings(
    EntityID,
    ProductID,
    CcyPair,
    DayBasis,
    DepoCcy,
    AltCcy,
    LocalCcy,
    GlobalCcy,
    OptionCut,
    FixingFreq,
    SettlementFreq,
    TradeDate,
    PremiumDate,
    FirstFixingDate,
    FinalFixingDate,
    SettlementDate,
    NotionalPerFixing,
    currentTile
  ) {
    try {
      const webMethod = this.interfaceUrl + 'GetNumberofFixings';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          EntityID: EntityID,
          ProductID: ProductID,
          CcyPair: CcyPair,
          DayBasis: DayBasis,
          DepoCcy: DepoCcy,
          AltCcy: AltCcy,
          LocalCcy: LocalCcy,
          GlobalCcy: GlobalCcy,
          OptionCut: OptionCut,
          FixingFreq: FixingFreq,
          SettlementFreq: SettlementFreq,
          TradeDate: TradeDate,
          PremiumDate: PremiumDate,
          FirstFixingDate: FirstFixingDate,
          FinalFixingDate: FinalFixingDate,
          SettlementDate: SettlementDate,
          NotionalPerFixing: NotionalPerFixing,
          currentTile: currentTile,
        }),
        processData: false,
        success(data) {
          that.nooffixingsFXDObserver.next(data);
          console.log(
            'maple fxd nooffixingsFXDObserver details response..',
            data
          );
        },
      });
    } catch (error) {}
  }

  maplegetentity(UserID) {
    try {
      const webMethod = this.interfaceUrl + 'GetEntityData';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          UserID: UserID,
        }),
        processData: false,
        success(data) {
          that.entityDataFXDObserver.next(data);
          console.log('maple fxd entityDataFXD details response..', data);
        },
      });
    } catch (error) {}
  }

  // CASH EQUITIES

  mapleEQprodinfo(
    EntityCode,
    LoginID,
    SourceSystem,
    MachineIP,
    RequestID,
    RequestAt,
    NoteMasterID
  ) {
    try {
      const webMethod = this.interfaceUrl + 'EQProductInfo';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          EntityCode: EntityCode,
          LoginID: LoginID,
          SourceSystem: SourceSystem,
          MachineIP: MachineIP,
          RequestID: RequestID,
          RequestAt: RequestAt,
          NoteMasterID: NoteMasterID,
        }),
        processData: false,
        success(data) {
          that.EQprodinfoObserver.next(data);
          console.log('maple EQprodinfo response..', data);
        },
      });
    } catch (error) {}
  }

  mapleEquitiesordersave(
    EntityCode,
    LoginID,
    SourceSystem,
    MachineIP,
    RequestID,
    RequestAt,
    UnderlyingSecurityID,
    Side,
    ExDestination,
    Currency,
    TradeDate,
    SettlType,
    SettlDate,
    OrdType,
    Price,
    TimeInForce,
    ExpireDate,
    OrderQty,
    RM,
    Customer,
    Trigger_Price,
    SuitabilityYN,
    NetAmount,
    CurrentTileID
  ) {
    try {
      const webMethod = this.interfaceUrl + 'FinIQ_Equities_Order_Save';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          EntityCode: EntityCode,
          LoginID: LoginID,
          SourceSystem: SourceSystem,
          MachineIP: MachineIP,
          RequestID: RequestID,
          RequestAt: RequestAt,
          UnderlyingSecurityID: UnderlyingSecurityID,
          Side: Side,
          ExDestination: ExDestination,
          Currency: Currency,
          TradeDate: TradeDate,
          SettlType: SettlType,
          SettlDate: SettlDate,
          OrdType: OrdType,
          Price: Price,
          TimeInForce: TimeInForce,
          ExpireDate: ExpireDate,
          OrderQty: OrderQty,
          RM: RM,
          Customer: Customer,
          Trigger_Price: Trigger_Price,
          SuitabilityYN: SuitabilityYN,
          NetAmount: NetAmount,
          CurrentTileID: CurrentTileID,
        }),
        processData: false,
        success(data) {
          that.EQordersaveObserver.next(data);
          console.log('maple Equitiesordersave response..', data);
        },
      });
    } catch (error) {}
  }

  // FUNDS

  maplegetmutualfundsdetails() {
    try {
      const webMethod = this.interfaceUrl + 'GetMutualFundsDetails';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({}),
        processData: false,
        success(data) {
          that.mutualdetailsObserver.next(data);
          console.log('maple GetMutualFundsDetails response..', data);
        },
      });
    } catch (error) {}
  }

  maplemutualfundssubscribe(
    ImportMode,
    RefreshMode,
    SystemEvent,
    SystemLogin,
    SystemProduct,
    SystemTemplate,
    ValidateMode,
    EntityCode,
    EntityID,
    LoginGroup,
    LoginID,
    RequestAt,
    SourceSystem,
    MachineIP,
    MachinePort,
    RequestID,
    RecordType,
    ApplicationID,
    ApplicationType,
    SourceofOrigin,
    SalespersonOfficerCodeTeam,
    UTSalespersonCode,
    DomicileBranchCode,
    DomicileBankCode,
    EffectingBranchCode,
    EffectingBankCode,
    Bank,
    ReferrorEmployeeName,
    ReferrorEmployeeID,
    ExternalReferrorName,
    ExternalReferrorID,
    ExternalReferrorIDType,
    ExternalReferrorIDCountry,
    ReferrorFlag,
    SubmittedDateTime,
    RcRpIndicator,
    SalespersonEmployeeID,
    SalespersonName1LastName,
    SalespersonName2MidName,
    CIFNumber,
    Salutation,
    ApplicantName1,
    ApplicantName2,
    IDInformation,
    IDTypeCode,
    IDCountryCode,
    PhoneWork,
    PhoneHome,
    PhoneMobile,
    Email,
    DateofBirth,
    Age,
    Gender,
    Race,
    MaritalStatus,
    CountryofCitizenshipCode,
    CountryofResidenshipCode,
    PermanentResidentFlg,
    CDPNo,
    CPFNo,
    TaxStatus,
    OtherIdentification,
    EmployerName,
    TypeofBusiness,
    JobDesignation,
    Position,
    EmployeeFlag,
    ApplicantType,
    CareOfName,
    AddressSeqNum,
    AddressType,
    AddressFormat,
    Block,
    Street,
    Storey,
    Unit,
    BuildingName,
    POBox,
    PostalCode,
    City,
    Country,
    AddressLine1,
    AddressLine2,
    AddressLine3,
    AddressLine4,
    Segment,
    CustomerRiskScoreRc,
    RiskReviewDate,
    RiskSource,
    RcId,
    RcIdType,
    RcIdCountry,
    IDExpiryDate,
    CountryofBirthCode,
    TIN1,
    Country1Code,
    TIN2,
    Country2Code,
    Reason1,
    Reason2,
    TIN3,
    Country3Code,
    Reason3,
    TIN4,
    Country4,
    Reason4,
    FundCode,
    ProductRiskScoreRp,
    CurrencyDenominated,
    TradeDate,
    TransactionType,
    FINorWPNo,
    Discount,
    ExistingSubscriberofFund,
    ExistingSubscriberACNo,
    SigningCondition,
    ModeofPayment,
    PurchaseAmount,
    DividendInstruction,
    RegularSavingsMode,
    NumberofMthsorQtrs,
    RegularInvestment,
    DepositAmount,
    SwitchFrom,
    SwitchTo,
    SwitchUnits,
    ModeofSettlement,
    RealizedAmountUnits,
    AccountPaymentType,
    UOBCreditCardNumber,
    UOBCreditCardExpiry,
    ApprovalCode,
    ChequeNumber,
    UOBDebitingACNo,
    TelegraphicTransfertoFundManagerACNo,
    CPFApprovedBank,
    CPFACNo,
    CPFInvestmentACNo,
    CompletedStandingInstructionFormPreviously,
    SRSOperator,
    SRSACNo,
    CreditingACNo,
    CreditingACNoForDividend,
    CreditingACName1ForDividend,
    CreditingACName2ForDividend,
    CreditingACCurrencyForDividend,
    CampaignCode,
    SystemCampaignCode,
    EarlyMaturityProceedsInstruction,
    CreditingACNoMaturity,
    CreditingACCurrencyMaturity,
    CurrentTileID
  ) {
    try {
      const webMethod = this.interfaceUrl + 'ImportUTAPI';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          ImportMode: ImportMode,
          RefreshMode: RefreshMode,
          SystemEvent: SystemEvent,
          SystemLogin: SystemLogin,
          SystemProduct: SystemProduct,
          SystemTemplate: SystemTemplate,
          ValidateMode: ValidateMode,
          EntityCode: EntityCode,
          EntityID: EntityID,
          LoginGroup: LoginGroup,
          LoginID: LoginID,
          RequestAt: RequestAt,
          SourceSystem: SourceSystem,
          MachineIP: MachineIP,
          MachinePort: MachinePort,
          RequestID: RequestID,
          RecordType: RecordType,
          ApplicationID: ApplicationID,
          ApplicationType: ApplicationType,
          SourceofOrigin: SourceofOrigin,
          SalespersonOfficerCodeTeam: SalespersonOfficerCodeTeam,
          UTSalespersonCode: UTSalespersonCode,
          DomicileBranchCode: DomicileBranchCode,
          DomicileBankCode: DomicileBankCode,
          EffectingBranchCode: EffectingBranchCode,
          EffectingBankCode: EffectingBankCode,
          Bank: Bank,
          ReferrorEmployeeName: ReferrorEmployeeName,
          ReferrorEmployeeID: ReferrorEmployeeID,
          ExternalReferrorName: ExternalReferrorName,
          ExternalReferrorID: ExternalReferrorID,
          ExternalReferrorIDType: ExternalReferrorIDType,
          ExternalReferrorIDCountry: ExternalReferrorIDCountry,
          ReferrorFlag: ReferrorFlag,
          SubmittedDateTime: SubmittedDateTime,
          RcRpIndicator: RcRpIndicator,
          SalespersonEmployeeID: SalespersonEmployeeID,
          SalespersonName1LastName: SalespersonName1LastName,
          SalespersonName2MidName: SalespersonName2MidName,
          CIFNumber: CIFNumber,
          Salutation: Salutation,
          ApplicantName1: ApplicantName1,
          ApplicantName2: ApplicantName2,
          IDInformation: IDInformation,
          IDTypeCode: IDTypeCode,
          IDCountryCode: IDCountryCode,
          PhoneWork: PhoneWork,
          PhoneHome: PhoneHome,
          PhoneMobile: PhoneMobile,
          Email: Email,
          DateofBirth: DateofBirth,
          Age: Age,
          Gender: Gender,
          Race: Race,
          MaritalStatus: MaritalStatus,
          CountryofCitizenshipCode: CountryofCitizenshipCode,
          CountryofResidenshipCode: CountryofResidenshipCode,
          PermanentResidentFlg: PermanentResidentFlg,
          CDPNo: CDPNo,
          CPFNo: CPFNo,
          TaxStatus: TaxStatus,
          OtherIdentification: OtherIdentification,
          EmployerName: EmployerName,
          TypeofBusiness: TypeofBusiness,
          JobDesignation: JobDesignation,
          Position: Position,
          EmployeeFlag: EmployeeFlag,
          ApplicantType: ApplicantType,
          CareOfName: CareOfName,
          AddressSeqNum: AddressSeqNum,
          AddressType: AddressType,
          AddressFormat: AddressFormat,
          Block: Block,
          Street: Street,
          Storey: Storey,
          Unit: Unit,
          BuildingName: BuildingName,
          POBox: POBox,
          PostalCode: PostalCode,
          City: City,
          Country: Country,
          AddressLine1: AddressLine1,
          AddressLine2: AddressLine2,
          AddressLine3: AddressLine3,
          AddressLine4: AddressLine4,
          Segment: Segment,
          CustomerRiskScoreRc: CustomerRiskScoreRc,
          RiskReviewDate: RiskReviewDate,
          RiskSource: RiskSource,
          RcId: RcId,
          RcIdType: RcIdType,
          RcIdCountry: RcIdCountry,
          IDExpiryDate: IDExpiryDate,
          CountryofBirthCode: CountryofBirthCode,
          TIN1: TIN1,
          Country1Code: Country1Code,
          TIN2: TIN2,
          Country2Code: Country2Code,
          Reason1: Reason1,
          Reason2: Reason2,
          TIN3: TIN3,
          Country3Code: Country3Code,
          Reason3: Reason3,
          TIN4: TIN4,
          Country4: Country4,
          Reason4: Reason4,
          FundCode: FundCode,
          ProductRiskScoreRp: ProductRiskScoreRp,
          CurrencyDenominated: CurrencyDenominated,
          TradeDate: TradeDate,
          TransactionType: TransactionType,
          FINorWPNo: FINorWPNo,
          Discount: Discount,
          ExistingSubscriberofFund: ExistingSubscriberofFund,
          ExistingSubscriberACNo: ExistingSubscriberACNo,
          SigningCondition: SigningCondition,
          ModeofPayment: ModeofPayment,
          PurchaseAmount: PurchaseAmount,
          DividendInstruction: DividendInstruction,
          RegularSavingsMode: RegularSavingsMode,
          NumberofMthsorQtrs: NumberofMthsorQtrs,
          RegularInvestment: RegularInvestment,
          DepositAmount: DepositAmount,
          SwitchFrom: SwitchFrom,
          SwitchTo: SwitchTo,
          SwitchUnits: SwitchUnits,
          ModeofSettlement: ModeofSettlement,
          RealizedAmountUnits: RealizedAmountUnits,
          AccountPaymentType: AccountPaymentType,
          UOBCreditCardNumber: UOBCreditCardNumber,
          UOBCreditCardExpiry: UOBCreditCardExpiry,
          ApprovalCode: ApprovalCode,
          ChequeNumber: ChequeNumber,
          UOBDebitingACNo: UOBDebitingACNo,
          TelegraphicTransfertoFundManagerACNo:
            TelegraphicTransfertoFundManagerACNo,
          CPFApprovedBank: CPFApprovedBank,
          CPFACNo: CPFACNo,
          CPFInvestmentACNo: CPFInvestmentACNo,
          CompletedStandingInstructionFormPreviously:
            CompletedStandingInstructionFormPreviously,
          SRSOperator: SRSOperator,
          SRSACNo: SRSACNo,
          CreditingACNo: CreditingACNo,
          CreditingACNoForDividend: CreditingACNoForDividend,
          CreditingACName1ForDividend: CreditingACName1ForDividend,
          CreditingACName2ForDividend: CreditingACName2ForDividend,
          CreditingACCurrencyForDividend: CreditingACCurrencyForDividend,
          CampaignCode: CampaignCode,
          SystemCampaignCode: SystemCampaignCode,
          EarlyMaturityProceedsInstruction: EarlyMaturityProceedsInstruction,
          CreditingACNoMaturity: CreditingACNoMaturity,
          CreditingACCurrencyMaturity: CreditingACCurrencyMaturity,
          CurrentTileID: CurrentTileID,
        }),
        processData: false,
        success(data) {
          that.fundssubscribeObserver.next(data);
          console.log('maple GetMutualFunds subscribe response..', data);
        },
      });
    } catch (error) {}
  }

  maplefundsappID(login, CurrentTileID) {
    try {
      const webMethod = this.interfaceUrl + 'GetNewApplicationId';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          login: login,
          CurrentTileID: CurrentTileID,
        }),
        processData: false,
        success(data) {
          that.appidObserver.next(data);
          console.log('maplefundsappID..', data);
        },
      });
    } catch (error) {}
  }

  //TEMPLATE

  mapletemplategetprod(templateName, EntityID, UserName) {
    try {
      const webMethod = this.interfaceUrl + 'GetNewApplicationId';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          templateName: templateName,
          EntityID: EntityID,
          UserName: UserName,
        }),
        processData: false,
        success(data) {
          that.prodbyTempObserver.next(data);
          console.log('template get product by temp..', data);
        },
      });
    } catch (error) {}
  }

  mapletemplatecheck(
    sequenceNo,
    templateName,
    ProductName,
    EntityID,
    userName,
    filters
  ) {
    try {
      const webMethod = this.interfaceUrl + 'GetNewApplicationId';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          sequenceNo: sequenceNo,
          templateName: templateName,
          ProductName: ProductName,
          EntityID: EntityID,
          userName: userName,
          filters: filters,
        }),
        processData: false,
        success(data) {
          that.checktempObserver.next(data);
          console.log('template check template', data);
        },
      });
    } catch (error) {}
  }

  mapletemplatesave(
    sequenceNo,
    templateName,
    ProductName,
    EntityID,
    userName,
    filters
  ) {
    try {
      const webMethod = this.interfaceUrl + 'saveLayout';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          sequenceNo: sequenceNo,
          templateName: templateName,
          ProductName: ProductName,
          EntityID: EntityID,
          userName: userName,
          filters: filters,
        }),
        processData: false,
        success(data) {
          that.savelayObserver.next(data);
          console.log('template check template', data);
        },
      });
    } catch (error) {}
  }

  maplegetProductsByCode(EntityID, userName) {
    try {
      const webMethod = this.interfaceUrl + 'getProductsByTemplateCODE';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          EntityID: EntityID,
          userName: userName,
        }),
        processData: false,
        success(data) {
          that.prodbycodeObserver.next(data);
          console.log('template get prod by temp code', data);
        },
      });
    } catch (error) {}
  }

  mapledeltemplate(templateName, EntityID, userName) {
    try {
      const webMethod = this.interfaceUrl + 'deleteTemplate';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          templateName: templateName,
          EntityID: EntityID,
          userName: userName,
        }),
        processData: false,
        success(data) {
          that.deltempObserver.next(data);
          console.log('del temp', data);
        },
      });
    } catch (error) {}
  }

  mapleaccesscontrolData() {
    try {
      const webMethod = this.interfaceUrl + 'GetMapleAccessControlData';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'GET',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({}),
        processData: false,
        success(data) {
          that.accesscontrolObserver.next(data);
          console.log('GetMapleAccessControlData', data);
        },
      });
    } catch (error) {}
  }

  // DEPOSIT

  mapledepositgetccy() {
    try {
      const webMethod = this.interfaceUrl + 'GetLocalCcyByEntity';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({}),
        processData: false,
        success(data) {
          that.depositccyObserver.next(data);
          console.log('GetLocalCcyByEntity', data);
        },
      });
    } catch (error) {}
  }

  mapledepositgetfxdrate(DepoCcy, RateSetName, DepoDays) {
    try {
      const webMethod = this.interfaceUrl + 'GetBoardRate';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          DepoCcy: DepoCcy,
          RateSetName: RateSetName,
          DepoDays: DepoDays,
        }),
        processData: false,
        success(data) {
          that.depositfxdrateObserver.next(data);
          console.log('GetBoardRate', data);
        },
      });
    } catch (error) {}
  }

  mapledepositgettenor(Currency, EntityName) {
    try {
      const webMethod = this.interfaceUrl + 'GetTenorbyCurrency';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          Currency: Currency,
          EntityName: EntityName,
        }),
        processData: false,
        success(data) {
          that.deposittenorObserver.next(data);
          console.log('GetTenorbyCurrency', data);
        },
      });
    } catch (error) {}
  }

  mapledepositsaveUCP(xmlExcel, userId, templateCode) {
    try {
      const webMethod = this.interfaceUrl + 'SaveUCP';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          xmlExcel: xmlExcel,
          userId: userId,
          templateCode: templateCode,
        }),
        processData: false,
        success(data) {
          that.depositsaveUCPObserver.next(data);
          console.log('SaveUCP', data);
        },
      });
    } catch (error) {}
  }

  mapledepositdates(
    DepoCcy,
    AltCcy,
    TradeDate,
    Tenor,
    DR_Settlement_Days,
    CR_Settlement_Days,
    CheckHomeLocalCcyHoliday,
    IsRollOverMode,
    RollOver_ValueDate,
    iEntityID,
    Tenor_Code,
    Prem_Settlement_Days,
    iProductId,
    I_ProductCode,
    I_Mode,
    optioncut
  ) {
    try {
      const webMethod = this.interfaceUrl + 'Get_FinIQ_CalculateDatesWrapper';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          DepoCcy: DepoCcy,
          AltCcy: AltCcy,
          TradeDate: TradeDate,
          Tenor: Tenor,
          DR_Settlement_Days: DR_Settlement_Days,
          CR_Settlement_Days: CR_Settlement_Days,
          CheckHomeLocalCcyHoliday: CheckHomeLocalCcyHoliday,
          IsRollOverMode: IsRollOverMode,
          RollOver_ValueDate: RollOver_ValueDate,
          iEntityID: iEntityID,
          Tenor_Code: Tenor_Code,
          Prem_Settlement_Days: Prem_Settlement_Days,
          iProductId: iProductId,
          I_ProductCode: I_ProductCode,
          I_Mode: I_Mode,
          optioncut: optioncut,
        }),
        processData: false,
        success(data) {
          that.depodateObserver.next(data);
          console.log('Get_FinIQ_CalculateDatesWrapper', data);
        },
      });
    } catch (error) {}
  }

  // ELI

  maplegetccyELI(strUserID) {
    try {
      const webMethod = this.interfaceUrl + 'getccyeli';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          strUserID: strUserID,
        }),
        processData: false,
        success(data) {
          that.ccyELIObserver.next(data);
          console.log('getccy eli', data);
        },
      });
    } catch (error) {}
  }

  maplegetppdetailsELI(
    strSolveFor,
    I_Entity_Id,
    PPDetails,
    I_UserID,
    CurrentTileID
  ) {
    try {
      const webMethod = this.interfaceUrl + 'getppdetailseli';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          strSolveFor: strSolveFor,
          I_Entity_Id: I_Entity_Id,
          PPDetails: PPDetails,
          I_UserID: I_UserID,
          CurrentTileID: CurrentTileID,
        }),
        processData: false,
        success(data) {
          that.extppdetailsELIObserver.next(data);
          console.log('getccy eli', data);
        },
      });
    } catch (error) {}
  }

  maplesavetradeELI(
    rfqID,
    productName,
    currency,
    notional,
    strikePer,
    KOPer,
    startDate,
    endDate,
    KIType,
    KIPer,
    couponPer,
    couponFre,
    tenor,
    createdby,
    schemeType,
    customer_id,
    solveFor,
    CurrentTileID
  ) {
    try {
      const webMethod = this.interfaceUrl + 'saveTradeeli';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          rfqID: rfqID,
          productName: productName,
          currency: currency,
          notional: notional,
          strikePer: strikePer,
          KOPer: KOPer,
          startDate: startDate,
          endDate: endDate,
          KIType: KIType,
          KIPer: KIPer,
          couponPer: couponPer,
          couponFre: couponFre,
          tenor: tenor,
          createdby: createdby,
          schemeType: schemeType,
          customer_id: customer_id,
          solveFor: solveFor,
          CurrentTileID: CurrentTileID,
        }),
        processData: false,
        success(data) {
          that.savetradeELIObserver.next(data);
          console.log('getccy eli', data);
        },
      });
    } catch (error) {}
  }

  mapleinsertELI(
    rfqID,
    UserID,
    Entity_Id,
    Type,
    Exchange1,
    UnderlyingCode1,
    Exchange2,
    UnderlyingCode2,
    Exchange3,
    UnderlyingCode3,
    Ccy,
    SolveFor,
    BarrierPerc,
    Tenor,
    strikePerc,
    Upfront,
    PPDetails,
    Variation,
    CouponFrq,
    KIPerc,
    KIType,
    PricePerc,
    CouponPerc,
    MiscVar1,
    MiscVar2,
    MiscVar3,
    Product,
    KO_Type,
    Quanto,
    Single_Worst_of,
    TradeDate,
    HighCouponPer,
    LowCouponPer,
    ER_Mode,
    EP_Lookup_Type,
    CurrentTileID
  ) {
    try {
      const webMethod = this.interfaceUrl + 'inserteli';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          rfqID: rfqID,
          UserID: UserID,
          Entity_Id: Entity_Id,
          Type: Type,
          Exchange1: Exchange1,
          UnderlyingCode1: UnderlyingCode1,
          Exchange2: Exchange2,
          UnderlyingCode2: UnderlyingCode2,
          Exchange3: Exchange3,
          UnderlyingCode3: UnderlyingCode3,
          Ccy: Ccy,
          SolveFor: SolveFor,
          BarrierPerc: BarrierPerc,
          Tenor: Tenor,
          strikePerc: strikePerc,
          Upfront: Upfront,
          PPDetails: PPDetails,
          Variation: Variation,
          CouponFrq: CouponFrq,
          KIPerc: KIPerc,
          KIType: KIType,
          PricePerc: PricePerc,
          CouponPerc: CouponPerc,
          MiscVar1: MiscVar1,
          MiscVar2: MiscVar2,
          MiscVar3: MiscVar3,
          Product: Product,
          KO_Type: KO_Type,
          Quanto: Quanto,
          Single_Worst_of: Single_Worst_of,
          TradeDate: TradeDate,
          HighCouponPer: HighCouponPer,
          LowCouponPer: LowCouponPer,
          ER_Mode: ER_Mode,
          EP_Lookup_Type: EP_Lookup_Type,
          CurrentTileID: CurrentTileID,
        }),
        processData: false,
        success(data) {
          that.insertELIObserver.next(data);
          console.log('getccy eli', data);
        },
      });
    } catch (error) {}
  }

  //Cash FX

  maplegetccypairCashFX(CCYOption, Currency, ProductCode, EntityID, Mode) {
    try {
      const webMethod = this.interfaceUrl + 'GetCcyPairDetails';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          CCYOption: CCYOption,
          Currency: Currency,
          ProductCode: ProductCode,
          EntityID: EntityID,
          Mode: Mode,
        }),
        processData: false,
        success(data) {
          that.ccyPairCashFXObserver.next(data);
          console.log('getccypair CashFX', data);
        },
      });
    } catch (error) {}
  }

  mapleGetFXCashPairDates(
    CurrencyPair,
    TenorCode,
    EntityId,
    ProductCode,
    ProductId,
    TradeDate,
    NearLegValueDate,
    SourceSystem,
    ModeType,
    currentTileID
  ) {
    try {
      const webMethod = this.interfaceUrl + 'GetFXCashPairDates';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          CurrencyPair: CurrencyPair,
          TenorCode: TenorCode,
          EntityId: EntityId,
          ProductCode: ProductCode,
          ProductId: ProductId,
          TradeDate: TradeDate,
          NearLegValueDate: NearLegValueDate,
          SourceSystem: SourceSystem,
          ModeType: ModeType,
          currentTileID: currentTileID,
        }),
        processData: false,
        success(data) {
          that.FXCashPairDatesObserver.next(data);
          console.log('getccypair CashFX', data);
        },
      });
    } catch (error) {}
  }

  maplegetDataFromUSPCustomFilter(
    sProductId,
    sFromDate,
    sToDate,
    sQueueId,
    sWorkFlowType,
    sWorkFlowTypeId,
    bShowParentToken,
    bShowBoth,
    lEntity_Id,
    sTemplateId,
    sWorkflowSuperType,
    parentTokenId,
    login,
    rowsPerPage,
    pageNo,
    customFilter,
    datefilterName,
    product_Id,
    I_strApplyDealCreatedByFilter,
    IncludeAllDate
  ) {
    try {
      const webMethod = this.interfaceUrl + 'getDataFromUSPCustomFilter';
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          sProductId: sProductId,
          sFromDate: sFromDate,
          sToDate: sToDate,
          sQueueId: sQueueId,
          sWorkFlowType: sWorkFlowType,
          sWorkFlowTypeId: sWorkFlowTypeId,
          bShowParentToken: bShowParentToken,
          bShowBoth: bShowBoth,
          lEntity_Id: lEntity_Id,
          sTemplateId: sTemplateId,
          sWorkflowSuperType: sWorkflowSuperType,
          parentTokenId: parentTokenId,
          login: login,
          rowsPerPage: rowsPerPage,
          pageNo: pageNo,
          customFilter: customFilter,
          datefilterName: datefilterName,
          product_Id: product_Id,
          I_strApplyDealCreatedByFilter: I_strApplyDealCreatedByFilter,
          IncludeAllDate: IncludeAllDate,
        }),
        processData: false,
        success(data) {
          that.USPCustomFilterObserver.next(data);
          console.log('getDataFromUSPCustomFilter CashFX', data);
        },
      });
    } catch (error) {}
  }
}
