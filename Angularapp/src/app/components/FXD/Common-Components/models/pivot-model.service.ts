import moment from "moment";
import { Subscription } from "rxjs";

export class PivotModel {
  displayProvider: string = "";
  provider: string = "Best Price";
  price: string = "";

  // Product_ID: number = 15;
  // Product_Code: string = 'Pivot';
  // Product_Name: string = 'Pivot';
  // TemplateCode: string = "PivotTarn";
  // TemplateID: number = 15;
  Product_ID: any ;
  Product_Code: string = '';
  Product_Name: string = '';
  TemplateCode: string = "";
  TemplateID: any ;

  Mode: string = '';
  UserGroup: string = '';
  PricingMode: string = '';
  AppMode: string = '';
  // AppModes: any[] = ['Auto', 'Manual'];
  AppModes: any[] = ['Auto'];


  IBPremPer:any;
  OrderDirection: string = "Buy";
  CCYOptions = [];
  CurrencyPair: string = "EUR - USD";
  DepCcy: any = 'EUR';
  AltCcy: string = 'USD';
  BidRate: string = "";
  AskRate: string = "";
  StrikePoint: string = "100";
  Strike: string = "";
  SpotRate: string = '';
  Tenor: string = "6M";
  TenorDays: any = "183";
  TenorOptions = [];
  Notional: any = "1,000,000.00";
  AltNotional: number = 0;
  NotionalCCY: string = "EUR";
  NotionalPointShift: number = 2;
  StrikePointShift: number = 4;
  IBPremCCY: string = "EUR";
  IBPremium: string = "0.00";
  IBPremType: string = 'IB Pays';
  UpfrontPer: any = "0.150000";
  ClientPremium: any = '0.00';
  ClientPremType: string = 'Client Pays';
  SelectedDigitalType: string = 'Digital-European';
  DigitalTypeOptions = ['Digital-European', 'Digital-No Touch American', 'Digital Touch American', 'Double Digital-No Touch American', 'Double Digital Touch American'];
  SelectedDigitalTypeCode: string = '1C';
  SelectedTriggerCondition: string = 'at or above';
  DisableTriggerCondition: boolean = false;
  TriggerConditionOptions = [{ Key: 'Digital-European', Value: 'at or above' }, { Key: 'Digital-European', Value: 'at or below' }, { Key: 'Digital-No Touch American', Value: 'always above' }, { Key: 'Digital-No Touch American', Value: 'always below' }, { Key: 'Digital Touch American', Value: 'touches upper barrier' }, { Key: 'Digital Touch American', Value: 'touches lower barrier' }];
  lowerUpfront: string = "";
  upperUpfront: string = "";
  UpperBarrierLevel: string = '';
  DisableUpperBarrier: boolean = true;
  LowerBarrierLevel: string = '';
  DisableLowerBarrier: boolean = true;

  OptionType: string = "European";
  LPList = [];

  TradeDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
  PremiumDate: string = '';
  FixingDate: string = '';
  MaturityDate: string = '';

  OptionCut: string = "TOK";
  OptionCutOptions = [];
  decimalShift: string = "";

  error: string = "";
  isLoading: boolean = false;
  disabledPrembtn: boolean = true;
  SelectedLPForPrice: string = 'Best Price';
  PriceProviderString: string = '';
  PriceProviderArray: any[] = [];
  BestPriceProvider: string = '';
  DCDRfqId: string = '';
  ExternalRfqId: string = '';
  BestPrice: string = '';
  BestPriceabs: number = 0;
  DealNo: string = '';

  Orderplace: string = '';
  orderTime: string = '';
  OrderPlaceFlag: boolean = false;
  PricingLoading: boolean = false;
  PricingServiceResponse: any;
  PricingServiceResponseArray = [];
  RandomUserID: any = '';
  ClearPricingFlag: boolean = false;

  LowerStrike: string = '';
  UpperStrike: string = '';
  Pivot: string = '';
  KOTypeOptions = ['Big Figure', 'ITM'];
  SelectedKOType: string = 'Big Figure';
  NoofKOITMEvents: string = '';
  TargetPips: any = 0;
  NotionalPerFixing: string = '';


  //modified default settleFreq & Noofsett by Urmila A | LGTCLI-325 | 24-feb-23
  // SelectedFixingSettFreq: string = 'Weekly/Weekly'; //UrmilaA | LGTGTWINT-1895 | 5-july-23
  SelectedFixingSettFreq: string = '';
  NoOfSett: string = '52';


  Leverage: any = '1';
  FirstFixingDate: string = '';
  // KIStyleOptions = ['E-101', 'E-102', 'E-112', 'NO'];
  KIStyleOptions = ['Yes', 'No'];
  SelectedKIStyle: string = 'No';
  LowerKI: string = '';
  UpperKI: string = '';
  CappedLossYNOptions = ['Yes', 'NO'];
  SelectedCappedLossYN: string = 'NO';
  CappedLossCcyOptions = ['EUR', 'USD'];
  SelectedCappedLossCcy: string = 'USD';
  CappedLossAmount: string = '0';
  NotionalDecimalPointShift: number = 2;
  DisableCCYChangeControl: boolean = false;

  //added by UrmilaA, LGTGTWINT-1947 | 8-May-23 |start
  // FinalPayType = ['Exact', 'Full', 'None'];
  // SelectedFinalPayType: string = 'Exact';  //Urmila A | 2-Feb-23 | LGTCLI-288
  // FixingAdjustment = ['Notional','None'];
  // SelectedFixingAdjustment: string = 'Notional'; //Urmila A | 2-Feb-23 | LGTCLI-288
  FinalPayType = [];
  SelectedFinalPayType: string = '';  
  FixingAdjustment = [];
  SelectedFixingAdjustment: string = ''; 
  //added by UrmilaA, LGTGTWINT-1947 | 8-May-23 |ends

  
  StrikeRatePointShift: number = 0;
  PipsMultiplier: number = 0;
  Asset1_DecimalAmount: number = 0;
  Asset2_DecimalAmount: number = 0;

  BookOrdersubscription: Subscription;
  ViewScheduleflag: boolean;
  NoteMasterID: string='0';
  UpfrontAlt:any;

}
