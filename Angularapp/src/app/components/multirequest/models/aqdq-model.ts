import * as moment from "moment";

export class AQDQModel {
    displayProvider: string = "";
    bestppname: string = "Best Price";
    provider: string = "Best Price";
    price: string = "";
    bestppprice: string = "";
    productType: string = "AQ";
    direction: string = "Buy";
    ccy: string = "EUR - USD";
    korate: string = "1.18";
    nooffixing: string = "1";
    notionalperfix: string = "10000";
    totalnotional: string = "10000";
    bidRate: string = "1.12";
    askRate: string = "1.13";
    strikeRate: string = "1.15";
    tenor: string = "1M";
    tenorDays: string = "31";
    nominal: string = "1,000,000.00"
    gauranteeperiod: string = "0";
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
    enableUpperBarrier: boolean = false
    enableLowerBarrier: boolean = true;
    tradeDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    premDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    firstFixingDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    finalFixingDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    FinalSettDate: string = (moment(Date.now())).format('DD-MMM-YYYY');
    optionCut: string = "TOK";
    decimalShift: string = "2";
    pointShift: number = 4;
    pipsMultiplier: number = 1000;
    fixingFreq: string = "Monthly";
    settFreq: string = "Monthly";
    error: string = "";
    ccyPair: string = "EUR - USD";;
    notionalCcy: string = "EUR";
    ibCcy: any;
    strikepoints: any;
    barrierType: any;
    leverageFactor:string = "1";
    isLoading: boolean = false;

}