import * as moment from "moment";

export class BarrierModel {
    bestppname: string = "Best Price";
    bestppprice: string = "";
    productType: string = "Knock-In";
    direction: string = "Buy";
    ccy: string = "EUR";
    ccyPair: string = "EUR - USD";
    bidRate: string = "";
    askRate: string = "";
    strikepoints: string = "100";
    strikeRate: string = "";
    tenor: string = "1W";
    tenorDays: string = "7";
    nominal: string = "1,000,000.00";
    ibPremCcy: string = "EUR";
    ibPrem: string = "";
    upfront: string = "0.25";
    clientPrem: string = "";
    lowerUpfront: string = "";
    upperUpfront: string = "";
    optionType: string = "Call";
    upperBarrier: string = "";
    lowerBarrier: string = "";
    enableUpperBarrier: boolean = false
    enableLowerBarrier: boolean = true;
    tradeDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    premDate: string  = (moment(Date.now())).format('DD-MMM-YYYY');
    finalFixingDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    FinalSettDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    optionCut: string = "TOK";
    decimalShift: string = "";
}