export default class Helper {
  validateParameters(
    notional: string,
    upfront: string,
    strike: string,
    spotBid: string,
    spotAsk: string,
    tradeDate: string,
    premiumDate: string,
    fixingDate: string,
    maturityDate: string,
    lowerBarrier: string,
    upperBarrier: string,
    enabledLowerBarrier: boolean,
    enabledUpperBarrier: boolean
  ): string {
    if (Number(notional.replace(/,/g, '')) < 0) {
      return 'Notional should be greater than 0';
    }

    if (parseFloat(upfront) > 1) {
      return 'Upfront should be less than 1%';
    }

    if (Number(strike) < 0) {
      return 'Strike cannot be negative';
    }

    if (Number(spotBid) <= 0 || Number(spotAsk) <= 0) {
      return 'Spot rate should be greater than 0';
    }

    if (
      tradeDate.trim() == '' ||
      premiumDate.trim() == '' ||
      fixingDate.trim() == '' ||
      maturityDate.trim() == ''
    ) {
      return 'Dates are not loaded';
    }

    if (
      enabledLowerBarrier &&
      (Number(lowerBarrier) <= 0 || Number(lowerBarrier) >= Number(strike))
    ) {
      return 'Lower barrier should be greater than 0 and less than strike';
    }

    if (enabledUpperBarrier && Number(upperBarrier) <= Number(strike)) {
      return 'Upper barrier should be greater than strike';
    }

    return '';
  }

  handleAmount(amount: string, defaultValue: number, decimal: string) {
    if (amount.toString().match(/([kK]{1})/g) != null) {
      amount = (parseFloat(amount.replace(/[kK]/g, '')) * 1000).toFixed(2);
    } else if (amount.toString().match(/([lL]{1})/g) != null) {
      amount = (parseFloat(amount.replace(/[lL]/g, '')) * 100000).toFixed(2);
    } else if (amount.toString().match(/([mM]{1})/g) != null) {
      amount = (parseFloat(amount.replace(/[mM]/g, '')) * 1000000).toFixed(2);
    } else if (amount.toString().match(/([bB]{1})/g) != null) {
      amount = (parseFloat(amount.replace(/[bB]/g, '')) * 1000000000).toFixed(
        2
      );
    }
    amount = parseFloat(amount) ? amount : defaultValue.toString();
    amount = parseFloat(amount)
      .toFixed(parseInt(decimal, 10) || 2)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    return amount;
  }

  amountEdit(amount: string) {
    return amount.replace(/,/g, '');
  }
}
