import * as moment from "moment";

export class BarrierModel {
    displayProvider: string = "";
    provider: string = "Best Price";
    price: string = "";
    productType: string = "Knock-In";
    barrierType: string = "DAI";
    direction: string = "Buy";
    ccy: string = "EUR";
    ccyPair: string = "EUR - USD";
    ibCcy: string = "EUR";
    notionalCcy: string = "EUR"
    bidRate: string = "";
    askRate: string = "";
    strikepoints: string = "100";
    strikeRate: string = "";
    tenor: string = "1W";
    tenorDays: string = "7";
    nominal: string = "100000";
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
    premDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    finalFixingDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    FinalSettDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    optionCut: string = "TOK";
    decimalShift: string = "2";
    error: string = "";
    isLoading: boolean = false;
}