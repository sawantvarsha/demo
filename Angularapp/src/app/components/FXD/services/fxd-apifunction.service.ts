import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';

import * as xml2js from 'xml2js';

import { NgxXml2jsonService } from 'ngx-xml2json';

import { environment } from './../../../../environments/environment';

import moment from 'moment'; //Added by UrmilaA | 14-Aug-23 | Core migration : API req body modification 
import { AppConfig } from 'src/app/services/config.service';
import { RemarkComponent } from '../Common-Components/remark/remark.component';  // HSBCFXEINT-21 | Chaitanya M | 08 Dec 2023

declare var require: any;
declare var require: any;
const $: any = require('jquery');


@Injectable({
  providedIn: 'root',
})
export class FxdApifunctionService {
  // New param for HTTP request added by Ketan S. on 23-02-2020
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  private data;

  ngxXml2jsonServices: NgxXml2jsonService;

  //Added FXD interface URL by Urmila A | 28-Aug-23 | for Euroconnect HSBC CH entity | start
  interfaceUrl = environment.interfaxeURL_fxcommon_FXD; 
  interfaxeURL_common_FXD = environment.interfaxeURL_common_FXD; 
  interfaxeURL_bestprice_FXD = environment.interfaxeURL_bestprice_FXD; 
  interfaxeURL_staticcontrol_FXD = environment.interfaxeURL_staticcontrol_FXD; 
  interfaxeURL_DateCal_FXD = environment.interfaxeURL_DateCal_FXD
  interfaxeURL_DocGen_FXD = environment.interfaxeURL_DocGen_FXD //UrmilaA | 2-Dec-23 | Indicative termsheet changes

  //Added FXD interface URL by Urmila A | 28-Aug-23 | for Euroconnect HSBC CH entity | ends
  
  FXOrderBlotterForFXD: any;
  sampleobject: any;
  FXScheduleForFXD: any;
  CurrentlyPricingFor: string;
  Productname: any;
  CustomerID;
  GetScheduleVB = new BehaviorSubject<any>([]);
  GetScheduleVBObserver = this.GetScheduleVB.asObservable();

  GetWorkflowBlotterFXDS = new BehaviorSubject<any>([]);
  GetWorkflowBlotterFXDObserverS = this.GetWorkflowBlotterFXDS.asObservable();

  // DCI Data Imported BY Ketan S from 1Angular
  Ccy = [];
  SingleCCY = new BehaviorSubject('');
  SingleCCYObserver = this.SingleCCY.asObservable();
  PriceDCICADB = new BehaviorSubject([]);
  PriceDCICADBObserver = this.PriceDCICADB.asObservable();
  private Dates = new BehaviorSubject('');
  DatesOberserver = this.Dates.asObservable();
  private SpotRate_DCI = new BehaviorSubject('');
  SpotRateOberserver_DCI = this.SpotRate_DCI.asObservable();
  FXBookDealVB = new BehaviorSubject('');
  FXBookDealVBObserver = this.FXBookDealVB.asObservable();
  private PriceDCI = new BehaviorSubject({});
  PriceDCIOberserver = this.PriceDCI.asObservable();

  // Urmila A | 6-Dec-22 | start
  public FXD_RFQID = new BehaviorSubject('');
  FXD_RFQIDOberserver = this.FXD_RFQID.asObservable();

  // public FXD_Schedule_GuratenteeTillDate_AQDQ = new BehaviorSubject('');
  public FXD_Schedule_GuratenteeTillDate_AQDQ = new BehaviorSubject({});
  FXD_Schedule_GuratenteeTillDate_AQDQObs = this.FXD_Schedule_GuratenteeTillDate_AQDQ.asObservable();

  public FXD_RFQDetailsFromNoteMasterID = new BehaviorSubject([]);
  FXD_RFQDetailsFromNoteMasterIDObs = this.FXD_RFQDetailsFromNoteMasterID.asObservable();

  public FXD_RFQDealDetails_navigateToPricers = new BehaviorSubject({});
  FXD_RFQDealDetails_navigateToPricersObs = this.FXD_RFQDealDetails_navigateToPricers.asObservable();
  // Urmila A | 6-Dec-22 | end


  // ---START--- Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P.
  SaveTradeBtnFlag = new BehaviorSubject(null);
  SaveTradeBtnFlagObserver = this.SaveTradeBtnFlag.asObservable();
  // ---END--- Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P.

  //Added by Urmila A, 9-May-23, LGTCLI-361 - start
  public FXDSignalRBroadcastMsg = new BehaviorSubject(null);
  FXDSignalRBroadcastMsgObs = this.FXDSignalRBroadcastMsg.asObservable();
  
  public RFSRes = new BehaviorSubject(null);
  RFSResObs = this.RFSRes.asObservable();
  //Added by Urmila A, 9-May-23, LGTCLI-361 - end

  EntityID: string;
  UserName: string;
  Password: string;


  //code shifted above by Urmila A | 14-Aug-23 |start
  SetOrderbtnonSaveTrade(value) {
    this.SaveTradeBtnFlag.next(value)
    console.log("dis", value)
  }
  //code shifted above by Urmila A | 14-Aug-23 |ends


  //Added by UrmilaA | 14-Aug-23 | Core migration : API req body modification | Start
  SourceSystem: string = 'FinIQ'
  LOCAL_MACHINE_IP ='';
  REQUESTID = Date.now();
  //Added by UrmilaA | 14-Aug-23 | Ends


  constructor(
    private ngxXml2jsonService: NgxXml2jsonService,
    private http: HttpClient
  ) {
    this.ngxXml2jsonServices = ngxXml2jsonService;
  }

  ResetGetWorkflowBlotterFXD() {
    this.GetWorkflowBlotterFXDS.next(null);
  }

  ResetGetScheduleVB() {
    this.GetScheduleVB.next(null);
  }

  fnGetAllProductinfo(iEntityID, Mode, UserID, ProductCode) {
    const webMethod = this.interfaceUrl + 'GetProductInfoFXD';
    const parameters = {
      iEntityID,
      Mode, // FXOQEN
      UserID,
      ProductCode,
      Token: this.GetToken()
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }


  //added by UrmilaA | 21-Aug-23 | Core migration : API req body modification | start
  fnGetOptionCutFXD(
    iEntityID: any,
    ProductID: any,
    ProductCode: any,
    Mode: any,
    Pair: any,
    CustomerID: any,
    UserID: any
  ) {
    const webMethod = this.interfaceUrl + 'Get_OptionCut';
    const parameters = {
      entityID: iEntityID,
      productId: ProductID,
      productCode: ProductCode,
      mode: Mode,
      pair: Pair,
      customerID: CustomerID,
      requestID:  UserID + '_' + 'GetOptionCut' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3)

    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //added by UrmilaA | 21-Aug-23 | Core migration : API req body modification | ends


  //Core migration : API req parameters are modified by Urmila A | 23-Aug-23 |start
  fnGetFXDCurrencyPairs(
    iEntityID: any,
    iProductId: any,
    ProductCode: string, 
    Mode: string,  
    selectedDepoCcy,
    selectedAlternatCcy,
    CcySearch:any, //Added by Urmila A | 11-Jan-23
    OptionCut: string,
  ) {
    const webMethod = this.interfaxeURL_staticcontrol_FXD + 'DB_Get_Tradable_Pair_Details';
    const parameters = { iEntityID, iProductId, ProductCode, Mode,
      sAssetIdentifier:'0',
      FetchOnlyStandardPairs:'Y', 
      selectedDepoCcy: selectedDepoCcy,
      selectedAlternatCcy: selectedAlternatCcy,
      CcySearch,
      OptionCut
     };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //Core migration : API req parameters are modified by Urmila A | 23-Aug-23 |ends


  fnGetTenor( // RizwanS || to fetch tenor values|| 30 Aug 2023 
    iEntityID: any,
    iProductID: any,
    ProductCode: string,
    Mode: string,
    MemberType: string,
    UserID
  ) {
    const webMethod = this.interfaceUrl + 'EntityMemberMapData';
    const parameters = { iEntityID, iProductID, ProductCode, Mode, MemberType}; // RizwanS || to fetch tenor values|| 30 Aug 2023 
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  //Commented by Urmila A | 21-Aug-23 | Core migration : API req body modification

  //Added by Urmila A | 21-Aug-23 | Core migration : API req body modification | start
  fnGetTenorfromFixings(Frequency: string, NoofFixings: string, UserID) {
    const webMethod = this.interfaceUrl + 'GetTenorfromFixings';
    const parameters = { 
      Frequency: Frequency,
      NoofSettlements: '', 
      NoofFixings: NoofFixings.toString(),
      RequestID: UserID + '_' + 'GetTenorfromFixings' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3)
     };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //Added by Urmila A | 21-Aug-23 | Core migration : API req body modification  | ends

   //Added by Urmila A | 21-Aug-23 | Core migration : API req body modification |start
  GetBidAskVB( ProductCode: string, CurrencyPair: string, Mode:any,UserID:any) { //RizwanS || added userid || 30 Aug 2023
    const webMethod = this.interfaceUrl + 'BidAskRate';
    const parameters = { 
      ProductCode: ProductCode,
      StandardPair: CurrencyPair,
      Mode:Mode,
      RequestID:UserID + '_' + 'BidAskRate' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3)  ,
      UserID: UserID 
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
   //Added by Urmila A | 21-Aug-23 | Core migration : API req body modification |ends

  // Added by Urmila A | 26-oct-23 | .Net Core pointing | GetFXBestPriceForVB |start
  GetFXBestPriceForVBNew(
    EntityId: string,
    LoginID: string,
    // Token: string,
    // ProductCode: string,
    ProductType: string,
    CurrencyPair: string,
    DepositCurrency: string,
    AlternateCurrency: string,
    PremCurrency: string,
    SettlementCcy: string,
    AmountInDepositCurrency: string,
    // AmountInAlternateCurrency: string,
    SolveFor: any,
    BuySell: string,
    Strike: any,
    LowerBarrier: any,
    UpperBarrier: any,
    BarrierType: string,
    KnockIn_Style: string,
    KnockOut_Style: string,
    OptionCut: string,
    Tenor: string,
    ValueDate: string,
    FixingDate: string,
    MaturityDate: string,
    UserID: string,
    // EntityId_: any,
    blnIsMultiLeg: boolean,
    PriceProviderDetails: string,
    // PricingModel: any,
    ExternalXMLString: string,
    TemplateCode: string,
    TemplateID: any,
    ProductID: any,
    //  Remark: any,
    //  Parant_DCDRFQID: any,
    // DI_YN: any,
    NoteMasterID: any,
    //  DIfromTradeIdea: any, 
    // Mode:any, //UrmilaA | LGTGTWINT-1470 | 21-feb-23
    TradeDate:any,
    NDFFlag:any,  //Urmila A | 8-Mar-23 -LGTGTWINT-1687
    IsMetal:any,  //Urmila A | 8-Mar-23 -LGTGTWINT-1687
    ShowRFS:any, //UrmilaA | 9-May-23 | LGTCLI-361
    CallPut:any,
    RMMarginPercentage:any,
    Mode:any,
    DI_YN:any,
    KIType:any,
    Remark:any,
    CapLoss : any,
    DCDRFQID : any,
    GroupKey : any,
    Frequency : any,
    CapLossCcy : any,
    TargetType : any,
    PayAtStrike : any,
    AdjustmentYN : any,
    PricingModel : any,
    CapLossAmount : any,
    AdjustmentType : any,
    ResponseMethod : any,
    DIfromTradeIdea : any,
    Parant_DCDRFQID : any,
    StrikeAdjustment : any,
    CustomerPremAmount : any,
    GuaranteedLeverageYN : any,
    Bank_Prem_CashFlow_Direction : any,
    Target:any


  ) {
    const webMethod = this.interfaxeURL_bestprice_FXD + 'GetFXOPriceFromExternalProvidersJSON';
    const parameters:any = {    
      ProductType: ProductType,
      CurrencyPair: CurrencyPair,
      DepositCurrency: DepositCurrency,
      PremCurrency: PremCurrency,
      AlternateCurrency: AlternateCurrency,
      SettlementCcy:SettlementCcy,
      AmountInDepositCurrency: AmountInDepositCurrency,
      SolveFor: SolveFor, 
      BuySell: BuySell,
      CallPut:CallPut,
      Strike: Strike,
      LowerBarrier: LowerBarrier !== '' ? LowerBarrier : '',
      UpperBarrier: UpperBarrier !== '' ? UpperBarrier : '',
      BarrierType: BarrierType,
      KnockIn_Style : KnockIn_Style,
      KnockOut_Style: KnockOut_Style,
      OptionCut: OptionCut,
      MarketPremium: "0",
      MarketPremiumAmount: "0",
      RMMarginPercentage: RMMarginPercentage,
      Tenor: Tenor,
      TradeDate: TradeDate,
      ValueDate: ValueDate,
      FixingDate: FixingDate,
      MaturityDate: MaturityDate,
      NDFFlag:NDFFlag, 
      IsMetal : IsMetal,
      UserID: UserID,
      EntityId: EntityId,
      IndicativeQuote:'',
      Deal_Rate2: '',
      NoteMasterID: NoteMasterID,
      blnIsMultiLeg: blnIsMultiLeg,
      InternalLPID:'',
      NotionalInPremCcy: "0",
      PriceProviderDetails,
      CIF_Code:'',
      BTB_Protfolio_Code:'',
      Marketer_Code: '',
      Strategy_Code:'',
      ExternalXMLString: ExternalXMLString,
      UseExternalXML_Source: true,
      TemplateCode: TemplateCode,
      TemplateID: TemplateID,
      ProductID: ProductID,
      RFQSource: "Single_Pricer", //UrmilaA | 6-Dec-23 | as told by RahulP
      requestID: LoginID + '_' + 'GetFXOPriceFromExternalProvidersJSON' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),
      Mode:Mode,  
      DI_YN:DI_YN,
      KIType:KIType ,
      Remark ,
      CapLoss ,
      DCDRFQID ,
      GroupKey ,
      Frequency ,
      CapLossCcy ,
      TargetType ,
      PayAtStrike ,
      AdjustmentYN ,
      PricingModel ,
      CapLossAmount ,
      AdjustmentType ,
      ResponseMethod ,
      DIfromTradeIdea ,
      Parant_DCDRFQID ,
      StrikeAdjustment ,
      CustomerPremAmount ,
      GuaranteedLeverageYN ,
      Bank_Prem_CashFlow_Direction ,
      Target
    
    };

    if(ShowRFS){
      parameters.responseMethod = 'RFS'
    }
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
   //Modified by UrmilaA | 16-Aug-23 | Core migration : API req body modification | ends
  //end


  GetFXBestPriceForVBManual(
    EntityId: string,
    ProductID: number,
    ProductType: string,
    CurrencyPair: string,
    DepositCurrency: string,
    AlternateCurrency: string,
    PremCurrency: string,
    SettlementCcy: string,
    AmountInDepositCurrency: string,
    AmountInAlternateCurrency: string,
    BuySell: string,
    CallPut: string,
    Strike: string,
    LowerBarrier: string,
    UpperBarrier: string,
    BarrierType: string,
    KnockIn_Style: string,
    KnockOut_Style: string,
    OptionCut: string,
    Tenor: string,
    ValueDate: string,
    FixingDate: string,
    MaturityDate: string,
    PriceProviderDetails: string,
    SolveFor: string,
    TemplateCode: string,
    TemplateID: number,
    NotionalPerFix: string,
    LeverageFactor: string,
    FixingSettFreq: string,
    GuaranteedPeriod: string,
    KORate: string,
    TargetInPips: number,
    TargetGainunit: string,
    XMLString: string,
    RMMarginPercentage: string,
    UserID: string,
    PricingModel: string,
    PricingMode: string,
    CustPayReceiveDirection: string,
    IBPayReceiveDirection: string,
    MarketPremium: string,
    MarketPremiumAmount: string,
    CustomerPremAmount: string
  ) {
    const webMethod = this.interfaceUrl + 'FXOBestPriceServiceVBNewManual';
    const parameters = {
      EntityId,
      ProductType,
      CurrencyPair,
      DepositCurrency,
      AlternateCurrency,
      PremCurrency,
      SettlementCcy,
      AmountInDepositCurrency: Number(AmountInDepositCurrency).toString(),
      AmountInAlternateCurrency: Number(AmountInAlternateCurrency).toString(),
      BuySell,
      CallPut,
      Strike,
      LowerBarrier: LowerBarrier !== '' ? parseFloat(LowerBarrier) : '',
      UpperBarrier: UpperBarrier !== '' ? parseFloat(UpperBarrier) : '',
      BarrierType,
      KnockIn_Style,
      KnockOut_Style,
      OptionCut,
      Tenor,
      ValueDate,
      FixingDate,
      MaturityDate,
      PriceProviderDetails,
      SolveFor,
      TemplateCode,
      TemplateID,
      NotionalPerFix,
      LeverageFactor,
      FixingSettFreq,
      GuaranteedPeriod,
      KORate,
      TargetInPips,
      TargetGainunit,
      blnIsMultiLeg: true,
      CAI_ID: 7400,
      UseExternalXML_Source: false,
      XMLString,
      ProductID,
      RMMarginPercentage,
      UserID,
      PricingModel,
      PricingMode,
      CustPayReceiveDirection,
      IBPayReceiveDirection,
      MarketPremium,
      MarketPremiumAmount,
      CustomerPremAmount,
      Token: this.GetToken()
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  
  //Modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification | start
  GetFXBestPrice(
    EntityId: string,
    LoginID: string,
    Token: string,
    ProductCode: string,
    ProductType: string,
    CurrencyPair: string,
    DepositCurrency: string,
    AlternateCurrency: string,
    PremCurrency: string,
    SettlementCcy: string,
    AmountInDepositCurrency: string,
    // AmountInAlternateCurrency: string,
    SolveFor: any,
    BuySell: string,
    CallPut:any,
    Strike: any,
    LowerBarrier: any,
    UpperBarrier: any,
    BarrierType: string,
    KnockIn_Style: string,
    KnockOut_Style: string,
    OptionCut: string,
    Tenor: string,
    ValueDate: string,
    FixingDate: string,
    MaturityDate: string,
    UserID: string,
    EntityId_: any,
    blnIsMultiLeg: boolean,
    PriceProviderDetails: string,
    PricingModel: any,
    ExternalXMLString: string,
    TemplateCode: string,
    TemplateID: any,
    ProductID: any,
    Remark: any,
    Parant_DCDRFQID: any,
    DI_YN: any,
    NoteMasterID: any,
    DIfromTradeIdea: any, 
    Mode:any, //UrmilaA | LGTGTWINT-1470 | 21-feb-23
    TradeDate:any,
    NDFFlag:any,  //Urmila A | 8-Mar-23 -LGTGTWINT-1687
    IsMetal:any , //Urmila A | 8-Mar-23 -LGTGTWINT-1687
    ShowRFS:any //UrmilaA | 9-May-23 | LGTCLI-361
  ) {
    this.REQUESTID += 1;
    this.headerOptions = this.headerOptions.append('Token', this.GetToken())
    const webMethod = this.interfaceUrl + 'GetFXOPriceFromExternalProvidersJSON';
    const parameters = {
      body : {
        oRequestHeader : {
          EntityID : EntityId,
          LoginID: LoginID,
          SourceSystem : this.SourceSystem,
          MachineIP : this.LOCAL_MACHINE_IP,
          RequestID: LoginID + '_' + 'GetFXOPriceFromExternalProvidersJSON' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),
          RequestAt : moment().format("DD-MMM-YYYY HH:mm:ss"),
          Token : this.GetToken(),
          ProductCode : ProductCode,
       },
       oRequestParameters : {
            EntityId :EntityId, 
            LoginID : LoginID, 
            Token : this.GetToken(), 
            ProductCode :ProductCode,
            ProductType : ProductType,
            CurrencyPair : CurrencyPair,
            DepositCurrency: DepositCurrency,
            AlternateCurrency : AlternateCurrency,
            PremCurrency : PremCurrency,
            SettlementCcy : SettlementCcy, 
            AmountInDepositCurrency: Number(AmountInDepositCurrency).toString(),
            // AmountInAlternateCurrency: Number(AmountInAlternateCurrency).toString(),
            SolveFor: SolveFor, 
            BuySell: BuySell,
            CallPut: CallPut,
            Strike: Strike,
            LowerBarrier: LowerBarrier !== '' ? LowerBarrier : '',
            UpperBarrier: UpperBarrier !== '' ? UpperBarrier : '',
            BarrierType: BarrierType,
            KnockIn_Style: KnockIn_Style,
            KnockOut_Style: KnockOut_Style,
            OptionCut : OptionCut,
            Tenor: Tenor,
            ValueDate: ValueDate,
            FixingDate: FixingDate,
            MaturityDate: MaturityDate,
            UserID : UserID,
            EntityId_: EntityId_,
            blnIsMultiLeg: blnIsMultiLeg,
            PriceProviderDetails: PriceProviderDetails,
            PricingModel: PricingModel,
            ExternalXMLString: ExternalXMLString,
            TemplateCode: TemplateCode,
            TemplateID: TemplateID,
            ProductID:ProductID,
            Remark:Remark,
            Parant_DCDRFQID:Parant_DCDRFQID,
            DI_YN: DI_YN,
            NoteMasterID: NoteMasterID,
            DIfromTradeIdea: DIfromTradeIdea,
            Mode:Mode,
            TradeDate : TradeDate,//Urmila A | 3-Mar-23 
            NDFFlag: NDFFlag, 
            IsMetal : IsMetal,
            ShowRFS: ShowRFS
            // Token: this.GetToken()
       }
    
      }
      
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
   }
  //Modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification | ends
  //end | Urmila A | 12-April-23 | for PB demo entity


  //Not Used | UrmilaA | 16-Aug-23
  BookOrderforVB(
    EntityID: string,
    ProductCode: string,
    PriceProvider: string,
    DCDRFQId: string,
    ExternalRFQId: string,
    CustPrem: number,
    LoginId: string,
    UserID
  ) {
    const webMethod = this.interfaceUrl + 'FXOPlaceOrderVBNew';
    const parameters = {
      EntityID,
      ProductCode,
      PriceProvider,
      DCDRFQId,
      ExternalRFQId,
      CustPrem,
      LoginId,
      UserID,
      Token: this.GetToken()
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  //Modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification | start
  BookOrderforVBNew(
   
    entityId: string,
    loginId:string,
    dcD_RFQId:string,
    external_RFQId: string,
    priceProviderName: string,
    productCode:string,
    cust_Prem_Amt:number,
    Remark :string    // HSBCFXEINT-21 | Chaitanya M | 08 Dec 2023
  ) {
    this.REQUESTID += 1;
    this.headerOptions = this.headerOptions.append('Token', this.GetToken())
    const webMethod = this.interfaxeURL_bestprice_FXD + 'FXOBookTradeAndGetExternalTradeNumberJSON';
    const parameters = {
        entityId: entityId,
        loginId:loginId,
        dcD_RFQId:dcD_RFQId,
        external_RFQId: external_RFQId,
        priceProviderName: priceProviderName,
        productCode:productCode,
        cust_Prem_Amt:cust_Prem_Amt,
        order_Response_TimeOut:"", // HSBCFXEINT-29 | Chaitanya M | 11 Dec 2023
        twoStepOrderExecutionYN:'N',
        orderRetryFlag:false,
        Remark: Remark, // HSBCFXEINT-21 | Chaitanya M | 08 Dec 2023
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //Modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification | ends
  //Added by Urmila A | 4-Nov-22 | as per UAT request parameter | end

  //Modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification | start
  GetDatesCalculationforVB(
    iEntityID: string,
    ProductID: number,
    ProductCode: string,
    DepoCcy: string,
    AltCcy: string,
    Fixing_Frequency: any,
    Settlement_Frequency :any,
    // Tenor: any,
    Tenor_Code: any,
    optioncut: any,
    TradeDate:any,
   // Tenordays:any,
    Mode:any,
    firstFixingChangeYN:any,
    firstFixingDate:any
  
  ) {
    const webMethod = this.interfaxeURL_DateCal_FXD + 'Get_FinIQ_CalculateDatesWrapper';
    const parameters = {
      depoCcy:DepoCcy,
      altCcy:AltCcy,
      currencyPair: DepoCcy + ' - ' + AltCcy,
      tradeDate: TradeDate,
      tenor: '',
      iEntityID:iEntityID,
      tenor_Code:Tenor_Code,
      iProductId:ProductID,
      i_ProductCode: ProductCode,
      i_Mode: Mode,
      optioncut: optioncut,
      fixing_Frequency: Fixing_Frequency,
      settlement_Frequency:Settlement_Frequency,        
      firstFixingChangeYN,
      firstFixingDate,
      defaultFixingDate:'',
      defaultSettDate:'',
      prem_Settlement_Days :''
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //Modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification | ends


  //modified by UrmilaA | 16-Aug-23 | Core migration : API req body modification  | start
  GetPriceProviderDetails(
    iEntityID: any,
    ProductId: any,
    Mode: string,
    UserGroup: string,
    UserID: string,
    PricingMode: string
  ) {
    this.REQUESTID += 1; //added by Urmila A | 8-Jan-24 | priceproviders doesn't work on first load
    const webMethod = this.interfaceUrl + 'PriceProviderDetails';
    const parameters = {
        iEntityID:iEntityID,
        ProductId: ProductId.toString(),
        Mode: Mode,
        UserGroup:UserGroup,
        UserID:UserID,
        PricingMode:PricingMode,
        RequestID: UserID + '_' + 'PriceProviderDetails' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),    
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //modified by UrmilaA | 16-Aug-23 | Core migration : API req body modification  | ends


  //Modified by UrmilaA | 21-Aug-23 | Core migration : API req body modification | start
  fnGetSchedule(NoteMasterID: string, EntityID, UserID,  ExternalXMLString: any,
    TemplateCode: any, TemplateID: any) {
    this.REQUESTID += 1;  
    const webMethod = this.interfaceUrl + 'ViewSchedule';
    const parameters = {      
          requestID: UserID + '_' + 'ViewSchedule' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),       
          templateID:TemplateID,
          templateCode:TemplateCode,
          externalXMLString:ExternalXMLString,
          entityId: EntityID,
          noteMasterID: NoteMasterID,
          userID: UserID,    
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //Modified by UrmilaA | 21-Aug-23 | Core migration : API req body modification | ends

  //Modified by UrmilaA | 21-Aug-23 | Core migration : API req body modification | start
  fnGetProdDetailsFXD(UserID:any,Product_Code:any) { 
    this.REQUESTID += 1;
    const webMethod = this.interfaceUrl + 'GetProdDetails';
    const parameters = {     
       product_Code : Product_Code,
       requestID: UserID + '_' + 'GetProdDetails' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),
       loginId: UserID
    
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //Modified by UrmilaA | 21-Aug-23 | Core migration : API req body modification | ends

  //Not Used | UrmilaA | 16-Aug-23 
  fnGetHardTenorDaysFXD(SoftTenor: string, TransDate) {
    const webMethod = this.interfaceUrl + 'GetHardTenorDaysFXD';
    const parameters = {
      SoftTenor,
      TransDate,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  //Not Used | UrmilaA | 16-Aug-23 
  fnGetWorkflowBlotterFXD(
    sProductId: string,
    sFromDate: string,
    sToDate: string,
    rowsPerPage: string,
    EntityID,
    UserID
  ) {
    const webMethod = this.interfaceUrl + 'GetWorkflowBlotterFXD';
    const parameters = { sProductId, sFromDate, sToDate, rowsPerPage, EntityID, UserID, Token: this.GetToken() };
    const that = this;
    const result = this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
    result.subscribe((res) => {
      if (res) {
        if (!res.Error) {
          that.FXOrderBlotterForFXD = res.getDataFromCustomFilterResult;
          xml2js.parseString(res, function () {
            const parser = new DOMParser();
            const xml = parser.parseFromString(
              that.FXOrderBlotterForFXD,
              'text/xml'
            );
            that.sampleobject = that.ngxXml2jsonService.xmlToJson(xml);
            that.sampleobject = that.sampleobject.NewDataSet;
            that.sampleobject = that.sampleobject.DUMMY;
            console.log(that.sampleobject);
          });
          that.GetWorkflowBlotterFXDS.next(that.sampleobject);
        }
      }
    });
  }

  //Not Used | UrmilaA | 16-Aug-23 
  fnGetInteresetRates(ccyPair) {
    const webMethod = this.interfaceUrl + 'GetCcyinterestRate';
    const parameters = {
      ccyPair,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  //Not Used | UrmilaA | 16-Aug-23 
  fnGetCcyVolatalitychart(ccyPair) {
    const webMethod = this.interfaceUrl + 'GetCcyVolatalitychart';
    const parameters = {
      ccyPair,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  //Not Used | UrmilaA | 16-Aug-23 
  fnCcyRatesHistoryData(currencyPair, optionCut) {
    const webMethod = this.interfaceUrl + 'GetCcyHistoryData';
    const parameters = {
      currencyPair,
      optionCut,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  //Not Used | UrmilaA | 16-Aug-23
  GetCcyPairPointShiftDetails(
    CCYOption,
    Currency,
    Mode,
    EntityID,
    ProductCode
  ) {
    const webMethod = this.interfaceUrl + 'GetCcyPairPointShiftSF';
    const parameters = {
      CCYOption,
      Currency,
      ProductCode,
      Mode,
      EntityID,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  SetPricingProduct(ProductName: string) {
    this.CurrentlyPricingFor = ProductName;
  }

  GetPricingProduct() {
    return this.CurrentlyPricingFor;
  }

  SetProductName(ProductName) {
    this.Productname = ProductName;
  }

  GetProductName() {
    return this.Productname;
  }

  //Not Used | UrmilaA | 16-Aug-23
  getcurrencies(EntityID, UserID, ProductCode) {
    const webMethod = this.interfaceUrl + 'SingleCurrency';
    const that = this;
    const parameters = {
      EntityID,
      UserID,
      ProductCode,
      Token: this.GetToken()
    };

    $.ajax({
      async: false,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        that.Ccy = data.DB_GetEntity_Tradable_PairsResult;
        that.SingleCCY.next(data.DB_GetEntity_Tradable_PairsResult);
      },
      error(error) {
        console.log(error);
      },
    });
    return this.Ccy;
  }
  // DCI Pricer Decorative End

  // DCI CADB Start
  //Not Used | UrmilaA | 16-Aug-23
  Pricer_DCI_CADB(
    LoginID,
    SolveFor,
    DepoCcy,
    AltCcy,
    CallPut,
    SpotRate,
    StrikeRate,
    Tenor,
    Notional,
    InputtedMargin,
    InputtedCustomerYield,
    Index,
    SessionID
  ) {
    const webMethod = this.interfaceUrl + 'Pricernew';
    const that = this;
    const parameters = {
      LoginID,
      SolveFor,
      DepoCcy,
      AltCcy,
      CallPut,
      SpotRate,
      StrikeRate,
      Tenor,
      Notional,
      InputtedMargin,
      InputtedCustomerYield,
      Index,
      SessionID,
    };
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        console.log(data);
        try {
          // if (data['body']['DCI_PricingResult'].length > 0) {

          that.PriceDCICADB.next(data);
          // }
        } catch (ex) {
          const data1 = [
            { Success: false, index: data.Index, sessionID: SessionID },
          ];
          that.PriceDCICADB.next(data1);
        }
      },
      error(error) {
        console.log(error);
      },
    });
  }

  //Not Used | UrmilaA | 16-Aug-23
  // DCI CADB End
  getDates(investccy, altccy, tenor, SettlementDays, index, EntityID, UserID, ProductCode) {
    const webMethod = this.interfaceUrl + 'CalculateDate_FXOVanilla';
    const that = this;
    const parameters = {
      DepoCcy: investccy,
      AltCcy: altccy,
      TenorCode: tenor,
      SettlementDays,
      index,
      EntityID,
      UserID,
      ProductCode,
      Token: this.GetToken()
    };
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },

      success(data) {
        that.Dates.next(data);
      },
      error(error) {
        console.log(error);
      },
    });
  }

  //Not Used | UrmilaA | 16-Aug-23
  getSpotRate_DCI(pair, index) {
    const webMethod = this.interfaceUrl + 'SpotRate_DCI';
    const that = this;
    const parameters = {
      pair,
      index,
    };
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        // that.spot = data['Get_FinIQ_BidAsk_WrapperResult'].split(';')[0];
        that.SpotRate_DCI.next(data);
      },
      error(error) {
        console.log(error);
      },
    });
    // return this.spot;
  }


  //Not Used | UrmilaA | 16-Aug-23
  Price(
    ProductType,
    altccy,
    investccy,
    strike,
    valuedate,
    fixingdate,
    maturitydate,
    tenor,
    notional,
    altnotional,
    buysell,
    user,
    callput,
    xml,
    index,
    sessionID,
    lplist,
    EntityID,
  ) {
    const webMethod = this.interfaceUrl + 'Pricer_FXOVanilla';
    const that = this;
    const parameters = {
      altccy,
      investccy,
      strike,
      // "tradedete":tradedete,
      valuedate,
      fixingdate,
      maturitydate,
      tenor,
      notional,
      altnotional,
      buysell,
      User: user,
      index,
      callput,
      xml,
      sessionID,
      lplist,
      ProductType,
      EntityID,
      Token: this.GetToken()
    };
    console.log(
      altccy,
      investccy,
      strike,
      valuedate,
      fixingdate,
      maturitydate,
      tenor,
      notional,
      altnotional,
      buysell,
      user,
      callput,
      xml,
      index,
      sessionID,
      lplist
    );
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        console.log(data);
        try {
          if (
            data.body.GetFXOPriceFromExternalProvidersJSONResult
              .oPriceResponseBody.length > 0
          ) {
            that.PriceDCI.next(data);
          }
        } catch (ex) {
          const data1 = [
            {
              Success: false,
              index: data.index,
              direction: data.direction,
              sessionID,
            },
          ];
          that.PriceDCI.next(data1);
        }
      },
      error(error) {
        console.log(error);
      },
    });
  }

  fnGetNoOfSettFromFixingDate(
    DepoCcy: string,
    AltCcy: string,
    CurrencyPair: string,
    TradeDate: string,
    iEntityID: string,
    Tenor_Code: string,
    Fixing_Frequency: string,
    Settlement_Frequency: string,
    iProductId: number,
    I_ProductCode: string,
    FirstFixingDate: string,
    _Mode: string,
    _OptionCut: string,
    UserID
  ) {
    const webMethod = this.interfaceUrl + 'filldatesafterFix';
    const parameters = {
      DepoCcy,
      AltCcy,
      CurrencyPair,
      TradeDate,
      iEntityID,
      Tenor_Code,
      Fixing_Frequency,
      Settlement_Frequency,
      iProductId,
      I_ProductCode,
      FirstFixingDate,
      UserID,
      Token: this.GetToken()
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  //modified by UrmilaA | 7-Sep-23 | Core migration : API req body modification | start
  fnGetFixingDateFromNoOfSett(
    DepoCcy: string,
    AltCcy: string,
    CurrencyPair: string,
    TradeDate: string,
    IEntityID: string,
    // Tenor_Code: string,
    FixingFreq: string,
    SettlementFreq: string,
    iProductId: string,
    I_ProductCode: string,
    I_Mode: string,
    OptionCut: string,
    UserID,
    // DayBasis,
    LocalCcy,
    GlobalCcy,
    PremiumDate,
    // FirstFixingDate,
    FinalFixingDate,
    SettlementDate,
    NotionalPerFixing
  ) {
    this.REQUESTID += 1;
    this.headerOptions = this.headerOptions.append('Token', this.GetToken())
    const webMethod = this.interfaxeURL_DateCal_FXD + 'GetNumberofFixings'; // Added by Urmila A | 18-feb-23
    const parameters = {
  

          RequestID: UserID + '_' + 'GetNumberofFixings' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),
          EntityID: IEntityID,
          ProductID:iProductId,
          CcyPair:CurrencyPair,
          DayBasis: '365',
          DepoCcy:DepoCcy,
          AltCcy: AltCcy,
          LocalCcy: LocalCcy,
          GlobalCcy: GlobalCcy,
          Mode : I_Mode, //added by UrmilaA | 16-Aug-23 | Initially weren't sent in server req
          OptionCut: OptionCut,
          FixingFreq: FixingFreq,
          SettlementFreq: SettlementFreq,
          TradeDate: TradeDate,
          PremiumDate: PremiumDate,
          FinalFixingDate: FinalFixingDate,
          SettlementDate: SettlementDate,
          NotionalPerFixing: NotionalPerFixing,
          FirstFixingDate: "",
          GuaranteedPeriods: "0",
          TemplateID: "1",
      
    };

    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //modified by UrmilaA | 7-Sep-23 | Core migration : API req body modification | ends



  //Not Used | UrmilaA | 16-Aug-23
  fnPremiumCalculationManualMode(
    SolveFor: string,
    IBPrem: string,
    CustPremium: string,
    MarginPerc: string,
    IBPayReceiveDirection: string,
    CustPayReceiveDirection: string,
    CcyPair: string,
    PremCcy: string,
    NotionalCcy: string,
    CallOrPut: string,
    BuySell: string,
    BidRate: string,
    AskRate: string,
    Strike: string,
    Notional: string,
    UserID,

  ) {
    const webMethod = this.interfaceUrl + 'GetNumberofFixings';
    const parameters = {
      SolveFor,
      IBPrem,
      CustPremium,
      MarginPerc,
      IBPayReceiveDirection,
      CustPayReceiveDirection,
      CcyPair,
      PremCcy,
      NotionalCcy,
      CallOrPut,
      BuySell,
      BidRate,
      AskRate,
      Strike,
      Notional,
      UserID,
      Token: this.GetToken()
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  //HSBCFXEINT-82 : Editable fixing date and maturity date | ChaitanyaM | 10-April-2024
  // ------------------------------------ Start --------------------------------------

  fnGetFixingMaturityDate(
    altCcy,
    depoCcy,
    tradeDate,
    entityID,
    tenor_Code,
    productId,
    mode,
    optionCut,
    fixingOrMaturityDate,
    pageImplemented,
    user,
    calcSettlementDate
  ) {
    const webMethod = this.interfaxeURL_DateCal_FXD + 'Get_FixingMaturityDates'; // Added by Urmila A | 18-feb-23
    const parameters = {
      altCcy,
      depoCcy,
      tradeDate,
      entityID,
      tenor_Code,
      productId,
      mode,
      optionCut,
      fixingOrMaturityDate,
      pageImplemented,
      user,
      calcSettlementDate

    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //HSBCFXEINT-82 : Editable fixing date and maturity date | ChaitanyaM | 10-April-2024
  // ------------------------------------ End --------------------------------------

  fnSaveRemark(RFQ_ID: string, Page_Mode: string, Remark: string) {
    const webMethod = this.interfaceUrl + 'Save_Remark';
    const parameters = {
      RFQ_ID,
      Page_Mode,
      Remark,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  fnFetchRemark(RFQ_ID: string) {
    const webMethod = this.interfaceUrl + 'Fetch_Remark';
    const parameters = {
      RFQ_ID,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  fnGetRFQDetails(Note_Master_Id: string) {
    const webMethod = this.interfaceUrl + 'GetRFQDetails';
    const parameters = {
      Note_Master_Id,
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }

  //Modified by UrmilaA | 22-Aug-23 | Core migration : API req body modification | start
  fnGetContractSummary(
    EntityID: number,
    LoginID: any,
    //ProductCode: any,
    // EntityID: EntityID: any,
    TemplateCode: any,
    producttype: any,
    BSdirection: any,
    ccypair: any,
    OptionType: any,
    Invccy: any,
    AltNotionalCcy: any,
    PremCcy: any,
    Notional: number,
    // Alternatenotional:number, //new
    notionalperfixing: any,
    Tenor: any,
    Expiry: any,
    settlement: any,
    LongDate: any,
    shortDate: any,
    Strike: any,
    OptionCut: any,
    BarrierType: any,
    ExoticCode: any,
    DigitalType: any,
    UpperBarrier: any,
    LowerBarrier: any,
    LeverageFactor: any,
    noofsett: any,
    nooffixings: any,
    FixingFrequency: any,
    settfrequency: any,
    LowerStrike: any,
    UpperStrike: any,
    pivotstrike: any,
    SpreadType: any,
    customerpremdir: any,
    IBPremDir: any,
    IBPrem: any,
    RTC: any,
    IBPremperc: any,
    RTCPerc: any,
    Target: any,
    TargetNotional: any,
    KIStyle: any,
    LowerKI: any,
    UpperKI: any,
    Guaranteedtill: any,
    GuaranteedPeriods: any,
    CappedLossCcy: any,
    CappedLossType: any,
    CappedLoss: any,
    CappedLossAmt: any,
    TargetBigFigure: any,
    Targetgainunit: any,
    TargetinPips: any,
    KOITMEvent: any,
    Striptype: any,
    FirstFixingDate: any,
    FinalPayType: any,
    FixingAdjustment: any
  ) {
    this.REQUESTID += 1;
    const webMethod = this.interfaceUrl + 'GetContractSummary';
    const parameters = {
          requestID: LoginID + '_' + 'GetContractSummary' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),
          entityID: EntityID,
          templateCode: TemplateCode,
          producttype: producttype,
          bSdirection: BSdirection,
          ccypair: ccypair,
          optionType: OptionType,
          invccy: Invccy,
          altNotionalCcy: AltNotionalCcy,
          premCcy: PremCcy,
          notional: Notional,
          alternatenotional: notionalperfixing,
          notionalperfixing: notionalperfixing,
          tenor: Tenor,
          expiry: Expiry,
          settlement: settlement,
          longDate: LongDate,
          shortDate: shortDate,
          strike: Strike,
          optionCut: OptionCut,
          barrierType: BarrierType,
          exoticCode: ExoticCode,
          digitalType: DigitalType,
          upperBarrier: UpperBarrier,
          lowerBarrier: LowerBarrier,
          leverageFactor: LeverageFactor,
          noofsett: noofsett,
          nooffixings:nooffixings,
          FixingFrequency: FixingFrequency,
          settfrequency: settfrequency,
          lowerStrike: LowerStrike,
          upperStrike: UpperStrike,
          pivotstrike: pivotstrike,
          spreadType: SpreadType,
          customerpremdir: customerpremdir,
          ibPremDir: IBPremDir,
          ibPrem: IBPrem,
          rtc: RTC,
          ibPremperc: IBPremperc,
          rtcPerc: RTCPerc,
          target:Target,
          targetNotional: TargetNotional,
          kiStyle: KIStyle,
          lowerKI: LowerKI,
          upperKI: UpperKI,
          guaranteedtill: Guaranteedtill,
          guaranteedPeriods: GuaranteedPeriods,
          cappedLossCcy:CappedLossCcy,
          cappedLossType: CappedLossType,
          cappedLoss: CappedLoss,
          cappedLossAmt: CappedLossAmt,
          targetBigFigure: TargetBigFigure,
          targetgainunit: Targetgainunit,
          targetinPips:TargetinPips,
          koitmEvent: KOITMEvent,
          striptype: Striptype,
          firstFixingDate:FirstFixingDate,
          finalPayType: FinalPayType,
          fixingAdjustment: FixingAdjustment,    
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //Modified by UrmilaA | 22-Aug-23 | Core migration : API req body modification | start

  
  //modified by UrmilaA | 16-Aug-23 | Core migration : API req body modification | start
  fnSendQuoteEmail(
    EntityID: any,
    LoginID: any,
    NoteMasterId: any,
    ProductID: any,
    RFQID: any
  ) {
    this.REQUESTID += 1;
    // this.headerOptions = this.headerOptions.append('Token', this.GetToken())
    const webMethod = this.interfaceUrl + 'SendQuoteEmail';
    const parameters = {

      RequestID: LoginID + '_' + 'SendQuoteEmail' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),
      EntityID: EntityID,
      ProductID: ProductID,
      LoginId: LoginID,
      NoteMasterId: NoteMasterId,
      RFQID: RFQID
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //modified by UrmilaA | 16-Aug-23 | Core migration : API req body modification | ends
 
  //API Req body modified by Urmila A | 22-Aug-23 | Core migration | start
  fngetExceptionRule(
    EntityID: any,
    LoginID: any,
    ProductCode: any,
    DepoCcy: any,
    AltCcy: any,
    DealAmount: any,
    DealDepoDays: any,
    CalculatedYield: any,
    EnteredDelta: any,
    CounterpartyCode: any,
    BookName: any,
    DealerName: any,
    CustomerName: any,
    CustDocType: any,
    CustomerIdType: any,
    CustomerPan: any,
    CrossBroder: any,
    CustomerRelPckCode: any,
    CustomerStaffIndicator: any,
    IncludeRouteToDealerRules: any,
    ManagedCenter: any,
    Mode: any,
    SalesSpread: any,
    ProductID: any,
    StanderPairCurrencyPair: any,
    Accredited_Investor_YN: any,
    //ProductCode_: any,
    BuySellFlag: any,
    CallPutFlag: any,
    BarrierType: any,
    loginUserGroup:any
  ) {
    const webMethod = this.interfaceUrl + 'GetExceptionRules';
    const parameters = {
      entityId: EntityID,
      loginUserID: LoginID,
      loginUserGroup: loginUserGroup,
    //  Token: this.GetToken(),
      productCode: ProductCode,
      EntityID_: EntityID,
      //LoginID_: LoginID,
      depoCcy: DepoCcy,
      altCcy: AltCcy,
      dealAmount: DealAmount,
      dealDepoDays: DealDepoDays,
      calculatedYield: CalculatedYield,
      enteredDelta: EnteredDelta,
      CounterpartyCode,
      bookName: BookName,
      dealerName: DealerName,
      customerName: CustomerName,
      custDocType: CustDocType,
      customerIdType: CustomerIdType,
      customerPan: CustomerPan,
      crossBroder: CrossBroder,
      customerRelPckCode: CustomerRelPckCode,
      customerStaffIndicator : CustomerStaffIndicator,
      includeRouteToDealerRules: IncludeRouteToDealerRules,
      managedCenter: ManagedCenter,
      mode: Mode,
      salesSpread: SalesSpread,
      productID: ProductID,
      standerPairCurrencyPair: StanderPairCurrencyPair,
      accredited_Investor_YN: Accredited_Investor_YN,
     // ProductCode_,
      buySellFlag: BuySellFlag,
      callPutFlag: CallPutFlag,
      barrierType: BarrierType

    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //API Req body modified by Urmila A | 22-Aug-23 | Core migration | ends


  // Added by Urmila A | 12-Nov-22 | end
  //Not used | UrmilaA | 16-Aug-23
  fnRouteToDealer(
    sDealLifeCycleXSD: any,
    DCDRFQID: any,
    Note_Master_ID: any,
    UserID: any,
    EntityID
  ) {
    const webMethod = this.interfaceUrl + 'RouteToDealer';
    const parameters = {
      sDealLifeCycleXSD,
      DCDRFQID,
      Note_Master_ID,
      UserID,
      EntityID: EntityID,
      Token: this.GetToken()
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }


  setData(data) {
    this.data = data;
  }

  getData() {
    let temp = this.data;
    this.clearData();
    return temp;
  }

  clearData() {
    this.data = undefined;
  }

  GetToken() {
    return sessionStorage.getItem('FXD_Token');
  }

  SetToken(token: string) {
    sessionStorage.setItem('FXD_Token', token);
  }


  StoreCredentials(UserName, EntityID) {
    sessionStorage.setItem('FXD_UserName', UserName);
    // sessionStorage.setItem('FXD_Password', Password);
    sessionStorage.setItem('EntityID', EntityID);  //modified by UrmilaA, 24-April-23 | LGTGTWINT-1898
    
  }


  //modified by Urmila A | 28-Aug-23 | for Euroconnect HSBC | start
  SetCredentials() {
    //this.UserName = sessionStorage.getItem('FXD_UserName');
    this.EntityID = sessionStorage.getItem('FXD_EntityID');

    console.log('oRes response=> ',AppConfig?.settings.oRes,this.EntityID);
    this.UserName = AppConfig?.settings.oRes.userName;
    //Added Cust Details by Urmila A | 31-Aug-23
    sessionStorage.setItem('FXD_CustID','20'); 
    sessionStorage.setItem('FXD_CustName','Customer_CH');
    sessionStorage.setItem('UserType', AppConfig?.settings.oRes.groupID) //Urmila A | 7-Sep-23
    sessionStorage.setItem('fxd/rfqlogmonitor','SEN'); //Urmila A | 7-Sep-23
  }
  //modified by Urmila A | 28-Aug-23 | end


  fnGetRMloggedIN() {
    if (sessionStorage.getItem('UserType') === 'RM') {
      return true;
    } else {
      return false;
    }
  }


  async mapleFXDAuthenticateUser(userName: string, password: string) {

    const parameters = {
      userName: userName,
      password: password
    }
    const webMethod = this.interfaceUrl + 'MapleFXDAuthenticateUser'

    return this.http.post(webMethod, parameters).toPromise();
  }


  // Added by Pranav D 6-Sep-2022 to get first fixing date 
  //Not Used | UrmilaA | 16-Aug-23
  fnGetNoOfFirstFixingDate(
    EntityID: any, ProductID: any, CcyPair: any, DayBasis: any, DepoCcy: any, AltCcy: any, LocalCcy: any, GlobalCcy: any, OptionCut: any,
    FixingFreq: any, SettlementFreq: any, TradeDate: any, PremiumDate: any, FirstFixingDate: any, FinalFixingDate: any, SettlementDate: any, NotionalPerFixing: any) {
    const webMethod = this.interfaceUrl + 'GetNumberofFixings';
    const parameters = {
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
      NotionalPerFixing
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }


  //Modified by UrmilaA | 22-Aug-23 | Core migration : API req body modification | start
  getEntityData(loginID: any) { 
    const webMethod = this.interfaxeURL_common_FXD + 'CVP/EntitiesMappedToUser' + '?SortBy=1&AddALLToListIfNoDataFound=true'; 
    const parameters = {
      // loginID : loginID,   
      loginID: this.UserName = AppConfig?.settings.oRes.userName  // RizwanS || to fetch enitity as per user log in || 30 Aug 2023 
    }
    console.log('URL',webMethod, 'GetEntityData : ',parameters)
    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });
   
  }

  //Modified by UrmilaA | 22-Aug-23 | Core migration : API req body modification | ends


  //modified by UrmilaA | 16-Aug-23 | Core migration : API req body modification | start
  getPersonalSettingFXD(EntityID: any, LoginID: any, ObjectName: any) {
    this.REQUESTID += 1;
    const webMethod = this.interfaceUrl + 'GetPersonalSettings';
    const parameters = {     
      objectName:ObjectName,
      loginName:LoginID,
      entityID:EntityID,
      requestID: LoginID + '_' + 'GetPersonalSettings' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),
    }

    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });

  }
  //modified by UrmilaA | 16-Aug-23 | Core migration : API req body modification | ends
  // Added by Urmila A | 22-Nov-22 | end


  //modified by UrmilaA | 16-Aug-23 | Core migration : API req body modification  | start
  FXDSaveRouteToDealerAPI(EntityID: any, LoginID: any,
    ProductCode: any, DCDRFQID: any, NoteMasterId: any, CustPAN: any,
    RMRemark: any, ExceptionWarningMsg: any) {
    this.REQUESTID += 1;
    const webMethod = this.interfaceUrl + 'SaveRouteToDealer';
    const parameters = {  

        RequestID: LoginID + '_' + 'SaveRouteToDealer' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),
        EntityID: EntityID,
        DCDRFQID:  DCDRFQID,
        EntityCode: "",
        ProductCode: ProductCode,
        LoginId:  LoginID,
        NoteMasterId: NoteMasterId,
        CustPAN: CustPAN,
        RMRemark: RMRemark,
        ExceptionWarningMsg: ExceptionWarningMsg

    }

    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });

  }
  //modified by UrmilaA | 16-Aug-23 | Core migration : API req body modification  | end

  // Added by Urmila A | 1-Dec-22 | end

  //modified by UrmilaA | 16-Aug-23 | Core migration : API req body modification  | start
  FXDGetLiveDatePeriodAPI(EntityID: any, LoginID: any, ProductCode: any) {
    this.REQUESTID += 1;
    const webMethod = this.interfaceUrl + 'GetLiveDatePeriod';
    this.headerOptions = this.headerOptions.append('Token', this.GetToken())
    console.log('Header options: ', this.headerOptions)
    const parameters = {
      body: {
        oRequestHeader : {
          EntityID : EntityID,
          LoginID: LoginID,
          SourceSystem : this.SourceSystem,
          MachineIP : this.LOCAL_MACHINE_IP,
          RequestID: LoginID + '_' + 'GetLiveDatePeriod' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),
          RequestAt : moment().format("DD-MMM-YYYY HH:mm:ss"),
          Token : this.GetToken(),
          ProductCode : ProductCode,
        }
      }
    }
    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });

  }
  //modified by UrmilaA | 16-Aug-23 | Core migration : API req body modification  | ends


  // Added by Urmila A | FXD GetLiveDatePeriod | 6-Dec-22 | end


  //modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification  | start
  //Not used in Euroconnect HSBC | UrmilaA | 14-Aug-23
  FXDGetFXORFQDataAPI(EntityID: any, LoginID: any, 
    FromDate: any, ToDate: any,ProviderId:any, RFQID: any, ProductId:any,NoOfRecords: any,Mode : any,
    RFQSource:any) {
    this.REQUESTID += 1;
    const webMethod = this.interfaceUrl + 'GetFXORFQData';
    const parameters = { 
        strFromDate: FromDate,
        strToDate: ToDate,
        strDataType: '',
        strProviderId: ProviderId,
        i_RFQID: RFQID,
        strProductId: ProductId,
        strtop: NoOfRecords,
        strLoginID: LoginID,
        strMode: Mode , // "SELF",  //Modified Value by Mayuri D. on 24-Mar-2023 | LGTGTWINT - 1743 | ///30-Mar-23, FilterType replaced  by Urmila A
        requestID: LoginID + '_' + 'GetFXORFQData' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),
        RFQSource: RFQSource, //LGTGTWINT-1783, Urmila A, 29-Mar-23
        strEntityId: EntityID //LGTGTWINT-1783, Urmila A, 29-Mar-23        
    }
    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });

  }
  //modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification  | ends

  // Added by Urmila A | FXD GetFXORFQData | 6-Dec-22 | end

  //Modified by UrmilaA | 22-Aug-23 | Core migration : API req body modification | start
  FXDGetLegPremDetailsAPI( 
    DCDRFQ_ID:any,
    LoginID : any
  ) {
    this.REQUESTID += 1;
    const webMethod = this.interfaceUrl + 'GetLegPremDetails';
    const parameters = {
      RFQId: DCDRFQ_ID,
      RequestID: LoginID + '_' + 'GetLegPremDetails' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),
    }
    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });

  }


  //Modified by UrmilaA | 22-Aug-23 | Core migration : API req body modification | ends
  // Added by Urmila A | FXD GetLegPremDetails | 12-Dec-22 | end

  //modified by UrmilaA | 21-Aug-23 | Core migration : API req body modification  |start
  // not used in Euroconnect HSBC | UrmilaA | 14-Aug-23
  FXDGetRFQDetailsFromNoteMasterIDAPI( NoteMasterId: any, LoginID: any, 
    Mode: any) {
    this.REQUESTID += 1;
    const webMethod = this.interfaceUrl + 'GetRFQDetailsFromNoteMasterID';
    const parameters = {   
          sNoteMasterId: NoteMasterId,
          sOpenDealEntry: "VIEW",
          loginID: LoginID,
          mode: Mode,
          rfqLockTime: ''        
    }
    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });

  }
  //modified by UrmilaA | 21-Aug-23 | Core migration : API req body modification  | ends

  // Added by Urmila A | FXD GetRFQDetailsFromNoteMasterID | 14-Dec-22 | end


  //Modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification | start
  getSavetradeRecommendation( LoginID: any,
    NoteMasterId: any, RFQID: any,Mode:any,Remark:any ) {
    this.REQUESTID += 1;
    const webMethod = this.interfaceUrl + 'Save_TradeRecommendationforAPI';
    const parameters = {
      "RFQID": RFQID,
      "NoteMasterID":NoteMasterId,
      "UserID": LoginID,
      "Mode": Mode,
      "Remark": Remark
    }
    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //Modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification | ends


  //Modified by UrmilaA | 9-Jan-24 | Core migration : API req body modification | code sync with 5star | start
  FXDRejectRouteToDealerAPI( LoginID: any,
    NoteMasterId: any, Remark: any) {
      this.REQUESTID += 1;
    const webMethod = this.interfaceUrl + 'RejectRouteToDealer';
    const parameters = {  
      NoteMasterId,
      Remark,
      LoginID,
      RequestID: LoginID + '_' + 'RejectRouteToDealer' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3)   
    }
    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });

  }
  //Modified by UrmilaA | 9-Jan-24 | Core migration : API req body modification | code sync with 5star | ends

  // Added by Urmila A | FXD RejectRouteToDealer | 2-Jan-24 | start
  FXDUnLockNoteMasterIDForDIAPI( NoteMasterId: any,LoginID: any ) {
    const webMethod = this.interfaceUrl + 'UnLockNoteMasterIDForDI';
    const parameters = {  
      NoteMasterId,
      LoginID,    
    }
    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });

  }
  // Added by Urmila A | FXD RejectRouteToDealer | 2-Jan-24  | end
  // Added by Urmila A | FXD RejectRouteToDealer | 20-Dec-22 | end
  

  //Modified by UrmilaA | 2-Dec-23 | Core migration : API req body modification | start
  FXDDownloadTermsheetAPI(EntityID: any, EntityName:any, LoginID: any, ProductCode: any,
    BulkTransactionNumber: any,TransactionType:any,TransactionEventCode:any,
    DocumentGenerationCallingFrom:any,DocumentGenerationSourceSystem:any) {
    const webMethod = this.interfaxeURL_DocGen_FXD + 'DocGen/GenerateDocument';
    const parameters = {
      HomeEntityId: EntityID,
      HomeEntityCode: EntityName.split(' ')[1],
      HomeEntityName: EntityName,
      HomeEntityLanguageId: 1,
      LoginId: LoginID,
      BulkTransactionNumber: BulkTransactionNumber,
      TransactionType: TransactionType,
      TransactionEventCode: TransactionEventCode,
      DocumentGenerationCallingFrom: DocumentGenerationCallingFrom,
      DocumentGenerationSourceSystem: DocumentGenerationSourceSystem,
      AttchedFilePath: "",
      AttchedFileDetails: "",
      Misc1: "",
      Misc2: "",
      Misc3: "",
      Misc4: "",
      Misc5: "",
      DocGenMode: "",
      DocumentSavingMode: "",
      OutputDirectory: ""
    }
    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });

  }
  //Modified by UrmilaA | 2-Dec-23 | Core migration : API req body modification | ends
  //Added by Urmila A | Indicative Termshee t| 19-Jan-23 | LGTCLI-237 | end

  //modified by UrmilaA | 21-Aug-23 | Core migration : API req body modification | start
  FXDGet_FunctionValue_FXDC_API(
    Param3: any,Param4:any) {
    this.REQUESTID += 1;
    const webMethod = this.interfaceUrl + 'Get_FunctionValue_FXDC'; //changed method name as generic for UCP functions, by UrmilaA, 2-May-23 | LGTGTWINT-1947
    const parameters = {  
          Param1: "FINIQ_COMMON",
          Param2: "dbo",
          Param3: Param3,
          Param4: Param4   
    }
    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });

  }
  //modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification | ends

  //Added by Urmila A | 16-mar-23 | Get_FunctionValue_FXDC (Max client profit) |LGTGTWINT-684|  end


  //Modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification | start
  GetFXBestPriceForVBNewStratgey(
    EntityId: string,
    LoginID: string,
    // Token: string,
    ProductCode: string,
    ProductType: string,
    CurrencyPair: string,
    DepositCurrency: string,
    AlternateCurrency: string,
    PremCurrency: string,
    SettlementCcy: string,
    AmountInDepositCurrency: string,
    // AmountInAlternateCurrency: string,
    SolveFor: any,
    BuySell: string,
    Strike: any,
    LowerBarrier: any,
    UpperBarrier: any,
    BarrierType: string,
    KnockIn_Style: string,
    KnockOut_Style: string,
    OptionCut: string,
    RMMarginPercentage : string,
    Tenor: string,
    ValueDate: string,
    FixingDate: string,
    MaturityDate: string,
    UserID: string,
    EntityId_: any,
    blnIsMultiLeg: boolean,
    PriceProviderDetails: string,
    PricingModel: any,
    ExternalXMLString: string,
    TemplateCode: string,
    TemplateID: any,
    ProductID: any,
    Remark: any,
    Parant_DCDRFQID: any,
    DI_YN: any,
    NoteMasterID: any,
    DIfromTradeIdea: any, 
    Mode:any, //UrmilaA | LGTGTWINT-1470 | 21-feb-23
    TradeDate:any,
    NDFFlag:any,  //Urmila A | 8-Mar-23 -LGTGTWINT-1687
    IsMetal:any  //Urmila A | 8-Mar-23 -LGTGTWINT-1687
  ) {
    this.REQUESTID += 1;

    const webMethod = this.interfaceUrl + 'GetFXOPriceFromExternalProvidersJSON';
    const parameters = {
      
        body : {
          oRequestHeader : {
            EntityID : EntityId_,
            LoginID: LoginID,
            SourceSystem : this.SourceSystem,
            MachineIP : this.LOCAL_MACHINE_IP,
            RequestID: LoginID + '_' + 'FXOBestPriceServiceVBNewForStrategy' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),
            RequestAt : moment().format("DD-MMM-YYYY HH:mm:ss"),
            Token : this.GetToken(),
            ProductCode : ProductCode,
          },
          oRequestParameters:{
            ProductType: ProductType,
            CurrencyPair: CurrencyPair,
            DepositCurrency: DepositCurrency,
            AlternateCurrency: AlternateCurrency,
            PremCurrency: PremCurrency,
            SettlementCcy: SettlementCcy,
            AmountInDepositCurrency: AmountInDepositCurrency,
            SolveFor: SolveFor,
            BuySell: BuySell,
            CallPut: '',
            Strike: Strike,
            LowerBarrier: LowerBarrier,
            UpperBarrier: UpperBarrier,
            BarrierType: BarrierType,
            KnockIn_Style: KnockIn_Style,
            KnockOut_Style: KnockOut_Style,
            OptionCut: OptionCut,
            MarketPremium: '0',
            MarketPremiumAmount: '0',
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
            IndicativeQuote: "False",
            Deal_Rate2: '',
            NoteMasterID: NoteMasterID,
            blnIsMultiLeg: blnIsMultiLeg,
            InternalLPID: '',
            NotionalInPremCcy: '0',
            PriceProviderDetails: PriceProviderDetails,
            MaxQuoteTimeOut: 50,
            MinQuoteTimeOutForFirstQuoteRFQ: 22,
            IgnoreValidTill: false,
            CheckOnlyRFQ: false,
            MinQuoteValidityPeriodRFQ: 1,
            UseMaxTTL: false,
            MaxTTL: 50,
            CIF_Code: '',
            BTB_Protfolio_Code:  '',
            Marketer_Code: '',
            Strategy_Code: '',
            PricingModel: PricingModel,
            ExternalXMLString: ExternalXMLString,
            UseExternalXML_Source: true,
            ShowLegWisePremium: false,
            TemplateCode: TemplateCode,
            TemplateID: TemplateID,
            ProductID: ProductID,
            Remark: Remark,
            Parant_DCDRFQID: Parant_DCDRFQID,
            DI_YN: DI_YN,
            DIfromTradeIdea: DIfromTradeIdea,
            Mode: Mode,
            RFQSource: 'Euroconnect_Single_Pricer'
          }
        }
    
    };
    return this.http.post<any>(webMethod, parameters, {
      headers: this.headerOptions,
    });
  }
  //Modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification | ends

  //modified by UrmilaA | 21-Aug-23 | Core migration : API req body modification  | start
  FXDGetProductConfigsAPI( LoginID: any, 
    ProductID: any) {
    const webMethod = this.interfaceUrl + 'GetProductConfigs';
    const parameters = {
        entityID: this.EntityID,
        productID : ProductID,
        requestID: LoginID + '_' + 'GetProductConfigs' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3)   
    }
    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });

  }
  //modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification  | ends

  //Added by Urmila A | 9-May-23 | FXDGetProductConfigs  | LGTCLI-361 |  end

 //Modified by UrmilaA | 21-Aug-23 | Core migration : API req body modification | start
  FXDGetConfigsForDealEntryAPI(EntityID: any, LoginID: any
    ) {
    this.REQUESTID += 1;
    const webMethod = this.interfaceUrl + 'GetConfigsForDealEntry';
    const parameters = {
      entityID: EntityID,
      requestID:  LoginID + '_' + 'GetConfigsForDealEntry' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3)
    }
    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });

  }
  //Modified by UrmilaA | 21-Aug-23 | Core migration : API req body modification | ends


  //Modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification | start
  FXDResetDictionaryFromRFQIDAPI( EntityID: any,LoginID: any,ProductCode:any,
    RFQIDs: any,DCDRFQID:any, NoteMasterID:any  ) {
    this.REQUESTID += 1;
    const webMethod = this.interfaceUrl + 'UnsubcribeRFQID';
    const parameters = {
      headers : {
        Token : this.GetToken()
      },
      body: {
        oRequestHeader: {
          EntityID : EntityID,
                LoginID: LoginID,
                SourceSystem : this.SourceSystem,
                MachineIP : this.LOCAL_MACHINE_IP,
                RequestID: LoginID + '_' + 'UnsubcribeRFQID' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3),
                RequestAt : moment().format("DD-MMM-YYYY HH:mm:ss"),
                Token : this.GetToken(),
                ProductCode : ProductCode,
        },
        RFQIDs: RFQIDs,
        DCDRFQID:DCDRFQID,
        NoteMasterID : NoteMasterID,
        // UpdateOnly: req.body.UpdateOnly // commented by UrmilaA | 29-May-23 | LGTCLI-361
      }
    
    }
    return this.http.post(webMethod, parameters, {
      headers: this.headerOptions,
    });

  }
  //Modified by UrmilaA | 14-Aug-23 | Core migration : API req body modification | ends

  //Added by Urmila A | 29-Aug-23 | Common data API | start
  fngetCommondata(dataType:any){
    try {
      const webMethod = this.interfaxeURL_common_FXD + 'CVP/CommonData' + '?SortBy=1&AddALLToListIfNoDataFound=true';
      const parameters = {
        commonDataType: dataType
      };
      return this.http.post<any>(webMethod, parameters,
        { headers: this.headerOptions
      });} catch (error) {}
  }//Added by Urmila A | 29-Aug-23 | ends


  //Added by UrmilaA | HSBCFXEINT-51 | 5-Jan-24 | start
  GetPremPercConfig(entityID:any) {
    try{
      const webMethod = this.interfaxeURL_common_FXD + 'configs/text' + '/OPTDEN_PremiumRoundingDecimals' + '/'+ entityID;
      return this.http.get<any>(webMethod,{ headers: this.headerOptions} );
    } catch (error) {}
  }
  //Added by UrmilaA | HSBCFXEINT-51 |  5-Jan-24 | ends

  // Start : HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024
  async FXDGetConfigsForDealEntryAPI2(EntityID: any, LoginID: any) {
    try{

      this.REQUESTID += 1;
      const webMethod = this.interfaceUrl + 'GetConfigsForDealEntry';
      const parameters = {
        entityID: EntityID,
        // requestID:  LoginID + '_' + 'GetConfigsForDealEntry' + '_' + moment().format("DDMMMYYYYHHmmss")+ '_' + this.REQUESTID.toString().substring(3) /* Commented by Aditya W on 13-May 2024 | EFGUPINT-267 | to remove angular time from log file name */
        requestID:  LoginID + '_' + 'GetConfigsForDealEntry' + '_' + this.REQUESTID.toString().substring(3)
      }
      return await this.http.post(webMethod, parameters, {
        headers: this.headerOptions,
      }).toPromise().then((data) => {
        return data;
      });

    } catch (error) {
      console.log(error.message)
    }
    
  }
  // End : HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024

}

