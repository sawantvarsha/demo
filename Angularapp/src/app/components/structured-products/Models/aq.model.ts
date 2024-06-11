export class Aq {
    ProductName: string = 'ACC'
    Underlying: string = 'AAPL.OQ';
    AccrualDays: number = 0;

    UnderlyingCode: string = '';
    UnderlyingNoteCcy: string = '';
    UnderlyingExchangeCode: string = '';
    UnderlyingExchange: string = '';
    UnderlyingStrPair: string = '';

    SolveFor: string = 'UPFRONT';
    Strike: string = '98.00';
    Upfront: string = '0.50';
    IBPrice: string = '99.50';
    KO: string = '102.00';
    SettlementWeek: string = '1W';
    Leverage: string = '1';

    OrderType: string = 'Limit';
    Notional: string = '0.00';
    RemainingNotional: string = '10';
    TotalNotional: string = '10';
    
    DailyNoOfShares: Number = 10;
    TotalNoOfShares: Number = 10;
    
    Tenor: Number = 6;

    TenorTypeOptions = ['Month', 'Year'];
    SelectedTenorType: String = 'MONTH';

    NoOfDays: number = 7;
    UnderlyingCurrency: string = 'USD';

    KOSettType: string = '';
    FrequencyOptions = ['BiWeekly', 'Monthly'];
    SelectedFrequency: string = 'Monthly';

    GuaranteePeriodOptions = ['0', '1', '2', '3'];
    SelectedGuaranteePeriod: string = '1';   

    PricingTimming: number = 60;
    PPwithRFQ: string = '';
    PPDetailsStr: string = '';
    PPDetails = [];
    interval: any;
}
