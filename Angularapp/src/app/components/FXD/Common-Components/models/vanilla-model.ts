import * as moment from "moment";

export class VanillaModel {
  displayProvider: string = "";
  provider: string = "Best Price";
  price: string = "";

  Product_ID: number = 0;
  Product_Code: string = '';
  Product_Name: string = '';
  Mode: string = '';
  UserGroup: string = '';
  PricingMode: string = '';
  AppMode: string = '';
  
  TemplateCode: string = "VFXO";
  TemplateID: number = 40245;

  OrderDirection: string = "Buy";
  CCYOptions = [];
  CurrencyPair: string = "EUR - USD";
  DepCcy: string = 'EUR';
  AltCcy: string = 'USD';
  BidRate: string = "";
  AskRate: string = "";
  StrikePoint: string = "100";
  Strike: string = "";
  Tenor: string = "6M";
  TenorDays: string = "183";
  TenorOptions = [];
  Notional: string = "1,000,000.00";
  AltNotional: number = 0;
  NotionalCCY: string = "EUR";
  NotionalPointShift: number = 2;
  StrikePointShift: number = 4;
  IBPremCCY: string = "EUR";
  IBPremium: string = "0.00";
  UpfrontPer: string = "0.150000";
  ClientPremium: number = 0;

  lowerUpfront: string = "";
  upperUpfront: string = "";

  OptionType: string = "Call";
  LPList = [];

  TradeDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
  PremiumDate: string = '';
  FixingDate: string = '';
  MaturityDate: string = '';

  OptionCut: string = "TOK";
  OptionCutOptions = [];
  pricingModel: string = "Black Scholes";
  decimalShift: string = "";

  error: string = "";
  isLoading: boolean = false;
  disabledPrembtn: boolean = false;
  SeletcedPricingModel: string = 'Black Scholes';
  SelectedLPForPrice : string = 'Best Price';
}
