import moment from 'moment';

export class DigitalModel {
  displayProvider: string = '';
  provider: string = 'Best Price';
  price: string = '';

  Product_ID: number = 0;
  Product_Code: string = '';
  Product_Name: string = '';
  Mode: string = '';
  UserGroup: string = '';
  PricingMode: string = '';
  AppMode: string = '';
  AppModes: any[] = ['Auto', 'Manual'];

  TemplateCode: string = 'Digital';
  TemplateID: number = 40719;

  OrderDirection: string = 'Buy';
  CCYOptions = [];
  CurrencyPair: string = 'EUR - USD';
  DepCcy: string = 'EUR';
  AltCcy: string = 'USD';
  BidRate: string = '';
  AskRate: string = '';
  StrikePoint: string = '100';
  Strike: string = '';
  Tenor: string = '6M';
  TenorDays: string = '183';
  TenorOptions = [];
  Notional: string = '1,000,000.00';
  AltNotional: any = '';
  NotionalCCY: string = 'EUR';
  NotionalPointShift: number = 2;
  StrikePointShift: number = 4;
  IBPremCCY: string = 'EUR';
  IBPremium: string = '0.00';
  IBPremType: string = 'IB Pays';

  UpfrontPer: string = '0.250000';
  ClientPremium: any = '0.00';
  ClientPremType: string = 'Client Pays';
  SelectedDigitalType: string = 'Digital-European';
  DigitalTypeOptions = [
    'Digital-European',
    'Digital-No Touch American',
    'Digital Touch American',
    'Double Digital-No Touch American',
    'Double Digital Touch American',
  ];
  SelectedDigitalTypeCode: string = '1C';
  SelectedTriggerCondition: string = 'at or above';
  DisableTriggerCondition: boolean = false;
  TriggerConditionOptions = [
    { Key: 'Digital-European', Value: 'at or above' },
    { Key: 'Digital-European', Value: 'at or below' },
    { Key: 'Digital-No Touch American', Value: 'always above' },
    { Key: 'Digital-No Touch American', Value: 'always below' },
    { Key: 'Digital Touch American', Value: 'touches upper barrier' },
    { Key: 'Digital Touch American', Value: 'touches lower barrier' },
  ];
  lowerUpfront: string = '';
  upperUpfront: string = '';
  UpperBarrierLevel: string = '';
  DisableUpperBarrier: boolean = true;
  LowerBarrierLevel: string = '';
  DisableLowerBarrier: boolean = true;

  OptionType: string = 'Call';
  LPList = [];

  TradeDate: string = moment(Date.now()).format('DD-MMM-YYYY');
  PremiumDate: string = '';
  FixingDate: string = '';
  MaturityDate: string = '';

  OptionCut: string = 'TOK';
  OptionCutOptions = [];
  decimalShift: string = '';

  error: string = '';
  isLoading: boolean = false;
  disabledPrembtn: boolean = false;
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
  DisableCCYChangeControl: boolean = false;

  NotionalDecimalPointShift: number = 2;
  StrikeRatePointShift: number = 0;
  PipsMultiplier: number = 0;
  Asset1_DecimalAmount: number = 0;
  Asset2_DecimalAmount: number = 0;
}
