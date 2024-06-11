export class BulkOrderEntryModel {
  shareName: string = '';
  feedCode: string = '';
  direction: string = 'Buy';
  directions: any[] = ['Buy', 'Sell'];
  quantity: string = '';
  exchange: string = '';
  settlementType: string = '';
  timeInForce: string = '';
  settlementDate: string = '';
  tradeDate: string = '';
  expiryDate: string = '';
  rm: string = '';
  settlementAmount: string = '';
  cif: string = '';
  suitabilityYN: string = '';
  orderTypes: any[] = ['Market', 'Limit'];
  orderType: string = '';
  orderSubmitType: string = '';
  customerDetails: {
    custName: string;
    custID: string;
    portfolio: string;
    facilityCode: string;
    accountNo: string;
    accountCurrency: string;
  } = {
    custID: '',
    custName: '',
    portfolio: '',
    facilityCode: '',
    accountNo: '',
    accountCurrency: '',
  };
  portfolioList: any[] = [];
  accountNoList: any[] = [];
  orderRate: any = '';
  askRate: any = '';
  bidRate: any = '';
  limitRate: any = '';
  isLoading: boolean = false;
  message: string = '';
  //Changed By MohanP | 04Feb22
  errorMessage: string = '';
  orderID: string = '';
  isOrderSuccess: boolean;
  currency: string = '';
  NoteMasterId: any = '';
  ISIN: any;
  LotSize: any;
  isValid: boolean = true;
  isError: boolean = false;
  lotsize: any;
  isSuitabilityValid: boolean = true;
  isSuitabilityValidRef: boolean = true;
  suitabiltyTable: any[] = [];
  isShowSuitabiltyTooltip: boolean = false;
  commission: {
    amount: string;
    value: string;
    percentage: string;
    reason: string;
  } = {
    amount: '',
    value: '',
    percentage: '',
    reason: '',
  };
  SuitabilityNMID: string;
  suitabiltyToken: any;
}
