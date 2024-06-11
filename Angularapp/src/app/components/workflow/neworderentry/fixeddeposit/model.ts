export class DealSave {

    depositType: string;
    currency: string;
    boardRate: number;
    dayBasis: number;
    depositDays: number;
    expiryDays: number;
    depositAmount: number;
    depositAmountDisplay: any;
    tenor: number;
    tenorUnit: string;
    interestType: string;
    interestRate: number;
    interestAmount: number;
    cif: string;
    maturityInstructions: string;
    intPaymentFreq: string;
    maturityAmount: number;
    maturityAmountDisplay: any;
    sourceAcNo: string;
    rePaymentAcNo: string;
    product: string;
    tradeDate: string;
    maturityDate: string;
    // SourceAccount: string;
    // RePayAccount: string;
    PortfolioID: string;
    accountType: string;
}

export class Principle {
    depositAmount: number;
    tenor: number;
    tenorUnit: string;
    interestRate: number;
    dayBasis: number;
    depositDays: number;
    expiryDays: number;
    interestType: string;
    interestPaymentFreq: string;
}