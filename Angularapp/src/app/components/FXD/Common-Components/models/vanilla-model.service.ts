import * as moment from "moment";

export class VanillaModel {
  displayProvider: string = "";
  provider: string = "Best Price";
  price: string = "";
  productname: string = "KnockIn";
  barrierType: string = "";
  productType : string = "FXOption";
  direction: string = "Buy";
  ccy: string = "EUR"
  ccyPair: string = "EUR - USD";
  bidRate: string = "";
  askRate: string = "";
  strikepoints: string = "100";
  strikeRate: string = "";
  tenor: string = "1W";
  tenorDays: string = "7";
  nominal: string = "1m";
  notionalCcy: string = "EUR";
  ibPremCcy: string = "EUR";
  ibPrem: string = "";
  upfront: string = "0.25";
  clientPrem: string = "";
  lowerUpfront: string = "";
  upperUpfront: string = "";
  optionType: string = "Call";
  upperBarrier: string = "0";
  lowerBarrier: string = "0";
  enableUpperBarrier: boolean = false;
  enableLowerBarrier: boolean = false;
  tradeDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
  premDate: string  = (moment(Date.now())).format('DD-MMM-YYYY');
  finalFixingDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
  FinalSettDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
  optionCut: string = "TOK";
  pricingModel: string = "Black Scholes";
  decimalShift:string = "";
  error: string = "";
  isLoading: boolean = false;
}
