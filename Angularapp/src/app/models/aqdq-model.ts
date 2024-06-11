import * as moment from "moment";

export class AQDQModel {
    bestppname: string = "Best Price";
    bestppprice: string = "";
    productname: string = "KnockIn";
    direction: string = "Buy";
    ccy: string = "EUR - USD";
    korate: string = "1.18";
    nooffixing: string = "1";
    notionalperfix: string = "10000";
    totalnotional: string = "10000";
    bidRate: string = "1.12";
    askRate: string = "1.13";
    strikeRate: string = "1.15";
    tenor: string = "1W";
    tenorDays: string = "7";
    nominal: string = "1,000,000.00"
    gauranteeperiod: string = "1";
    ibPremCcy: string = "EUR";
    ibPrem: string = "";
    ibpremnotional: string = "18000";
    upfront: string = "0.5";
    clientPrem: string = "0.5";
    lowerUpfront: string = "";
    upperUpfront: string = "";
    optionType: string = "Call";
    upperBarrier: string = "1.18";
    lowerBarrier: string = "1.08";
    tradeDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    premDate: string  = (moment(Date.now())).format('DD-MMM-YYYY');
    firstFixingDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    finalFixingDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    FinalSettDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    optionCut: string = "TOK";
}