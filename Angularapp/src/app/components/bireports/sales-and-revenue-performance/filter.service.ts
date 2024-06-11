import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type dataFormat = {
  title: string;
  volume: number;
  revenue: number;
}


@Injectable({
  providedIn: 'root'
})
export class FilterService {

  dataReceived = new EventEmitter<void>();
  dateFilterEvent = new EventEmitter<void>();
  currencyFilterEvent = new EventEmitter<void>();

  tradeForRevenueByPayOffSelectedEvent = new EventEmitter<string>();
  tradeForRevenueByCurrencySelectedEvent = new EventEmitter<string>();
  tradeForVolumeByPayOffSelectedEvent = new EventEmitter<string>();
  tradeForVolumeByCurrencySelectedEvent = new EventEmitter<string>();
  setTotalEvent = new EventEmitter<void>()
  filterSelectedEvent = new EventEmitter<void>()
  filterListEvent = new EventEmitter<void>();

  //========================================
  filterEvent1 = new EventEmitter<void>();
  selectedOptionCurrency: string = 'Ascending'
  selectedOption1Currency: string = 'Currency'

  filterEvent2 = new EventEmitter<void>()
  selectedOptionPayoff: string = 'Ascending'
  selectedOption1Payoff: string = 'PayOff'


  initialState:any={
    "minDate" : 0,
    "maxDate" : 0,

    "selectedOptionCurrency" : 'Ascending',
    "selectedOption1Currency" : 'Currency',
    "selectedOptionPayoff" : 'Ascending',
    "selectedOption1Payoff" : 'PayOff',
    "selectedCustomer":"All",
    "selectedLabel":"All"
  }
  //===========================================

  minDate: Date = new Date()
  maxDate: Date = new Date()
  currentMinDate: Date = this.minDate
  currentMaxDate: Date = this.maxDate
  payOff: string[] = [];
  currency: string[] = [];
  dataForVolumeByPayOff: dataFormat[] = [];
  dataForVolumeByCurrency: dataFormat[] = [];
  selectedLabel: string = "All";
  apiData: any[] = []
  filteredApiData: any[] = []
  tempCurrencyList: string[] = []
  tempPayOffList: string[] = []
  currentSelectedCurrency: string = 'All'
  currentSelectedPayOff: string  = 'All'
  totalRevenue: number = 0
  totalVolume: number = 0
  selectedCustomer: string = 'All';
  customername: string = 'CustomerName';
  clientList!: any[];
  selectedChart=0
//=========================================================================================
sendStateDataEvent = new EventEmitter<void>()
screenshotData: any = [];


setScreenshotData(value: any) {
  if (this.screenshotData.length < 15) {
    this.screenshotData.push(value);
    this.setScreenshotArray(this.screenshotData);
  } else {
    this.screenshotData.shift();
    this.screenshotData.push(value);
    this.setScreenshotArray(this.screenshotData);
  }
}

getScreenshotData() {
  return this.screenshotData;
}

private screenshotDataSubject = new BehaviorSubject<Array<any>>([]);
screenshotData$ = this.screenshotDataSubject.asObservable();
setScreenshotArray(data: Array<any>) {
  this.screenshotDataSubject.next(data);
}
private display: BehaviorSubject<'open' | 'close'> =
  new BehaviorSubject<any>('close');

watch(): Observable<'open' | 'close'> {
  return this.display.asObservable();
}

open() {
  this.display.next('open');
}

close() {
  this.display.next('close');
}


//==========================================================================================



  setApiData(apiData: []) {
    console.log(apiData)
    this.apiData = apiData.filter((data) => data["USD eqv. Trade Volume"] !== null && data["USD eqv. Revenue"] !== null);
    this.setProperties();
  }

  selectedChartPayOffFilter(){
    let data = this.dateFilter();
    if (this.selectedLabel !== 'All') {
      data=data.filter((data) => (data.Currency === this.selectedLabel))
    }
    if(this.selectedCustomer !=='All'){
      data=data.filter((data) => data[this.customername] === this.selectedCustomer)
    }

    let dataForPayOff: dataFormat[] = []
    this.payOff.forEach((pay) => {
      let tempData: dataFormat = {
        title: '',
        volume: 0,
        revenue: 0
      }
      let dataByPayOff = data.filter((data) => data.PayOff === pay)
      if (dataByPayOff.length > 0) {
        let curRevenueList = dataByPayOff.map((data) => {
          if (data['USD eqv. Revenue'] > 0)
            return data['USD eqv. Revenue']
          else
            return 0
        })
        let curVolumeList = dataByPayOff.map((data) => {
          if (data['USD eqv. Trade Volume'] > 0)
            return data['USD eqv. Trade Volume']
          else
            return 0
        })
        tempData["title"] = pay;
        tempData["revenue"] = curRevenueList.reduce((acc = 0, curRevenue) => acc + curRevenue)
        tempData["volume"] = curVolumeList.reduce((acc = 0, curvolume) => acc + curvolume)
        dataForPayOff = [...dataForPayOff, { ...tempData }]
      }

    })
    return dataForPayOff
  }

  selectedChartCurrencyFilter(){
    let data = this.dateFilter();
    if (this.selectedLabel !== 'All') {
      data=data.filter((data) => (data.Currency === this.selectedLabel))
    }

    if(this.selectedCustomer !=='All'){
      data=data.filter((data) => data[this.customername] === this.selectedCustomer)
    }

    let dataForCurrency: dataFormat[] = []

    this.currency.forEach((currency) => {
      let tempData: dataFormat = {
        title: '',
        volume: 0,
        revenue: 0
      }
      let dataByCurrency = data.filter((data) => data.Currency === currency)
      if (dataByCurrency.length > 0) {
        let curRevenueList = dataByCurrency.map((data) => {
          if (data['USD eqv. Revenue'] > 0)
            return data['USD eqv. Revenue']
          else
            return 0
        })
        let curVolumeList = dataByCurrency.map((data) => {
          if (data['USD eqv. Trade Volume'] > 0)
            return data['USD eqv. Trade Volume']
          else
            return 0
        })
        tempData["title"] = currency;
        tempData["revenue"] = curRevenueList.reduce((acc = 0, curRevenue) => acc + curRevenue)
        tempData["volume"] = curVolumeList.reduce((acc = 0, curvolume) => acc + curvolume)
        dataForCurrency = [...dataForCurrency, { ...tempData }]
      }
    })

    return dataForCurrency
  }

  dateCurrencyAndPayOffFilter() {
    this.filteredApiData = this.dateFilter()
    this.getLists();
    this.filterListEvent.emit()
    this.clientFilter();
    if (this.selectedLabel !== 'All' && this.currentSelectedCurrency !== 'All') {
      this.filteredApiData = [...this.labelSelectedFilter()]
    }
    else if (this.selectedLabel === 'All' && this.currentSelectedCurrency != "All") {
      this.filteredApiData = [...this.currencySelectedFilter()]
    }
    else {
      this.filteredApiData = [...this.labelSelectedFilter()]
      this.filteredApiData = [...this.currencySelectedFilter()]
    }


    let payoffs: string[] = this.filteredApiData.map((data: any) => {
      return data.PayOff
    })
    this.filteredApiData = [...this.payOffSelectedFilter()]
    this.tempPayOffList = [...new Set(payoffs)];

    let total = 0;
    this.filteredApiData.forEach((data) => {
      if (data['USD eqv. Trade Volume'] !== null)
        total = total + data['USD eqv. Trade Volume']
      else
        total = total + 0
    })
    this.totalVolume = total


    this.filteredApiData = [...this.payOffSelectedFilter()]
    total = 0;
    this.filteredApiData.forEach((data) => {
      if (data['USD eqv. Revenue'] !== null)
        total = total + data['USD eqv. Revenue']
      else
        total = total + 0
    })
    this.totalRevenue = total
    this.setTotalEvent.emit();
  }

  clientFilter() {
    if (this.selectedCustomer === "All") {
      this.filteredApiData = this.filteredApiData
    }
    else {
      this.filteredApiData = this.filteredApiData.filter((data) => data[this.customername] === this.selectedCustomer)
    }
  }

  payOffSelectedFilter(): any[] {
    if (this.currentSelectedPayOff === 'All') {
      return this.filteredApiData
    }
    else {
      return this.filteredApiData.filter((data) => (data.PayOff === this.currentSelectedPayOff))
    }
  }

  labelSelectedFilter(): any[] {
    if (this.selectedLabel === 'All') {
      return this.filteredApiData
    }
    else {
      return this.filteredApiData.filter((data) => (data.Currency === this.selectedLabel))
    }
  }

  currencySelectedFilter(): any[] {

    if (this.currentSelectedCurrency === 'All') {
      return this.filteredApiData
    }
    else {
      return this.filteredApiData.filter((data) => (data.Currency === this.currentSelectedCurrency))
    }
  }

  dateFilter(): any[] {
    return this.apiData.filter((data) => {
      let date = new Date(data.Trade_Date)
      return date.getTime() >= this.currentMinDate.getTime() && date.getTime() <= this.currentMaxDate.getTime()
    })
  }

  getLists() {
    let tempData = []
    tempData = this.filteredApiData
    if (this.selectedCustomer !== "All") {
      tempData = tempData.filter((data) => data[this.customername] === this.selectedCustomer)
    }
    this.tempCurrencyList = [...new Set(tempData.map((data) => data['Currency']))]
    this.tempCurrencyList=this.tempCurrencyList.sort((a,b)=>{return a.localeCompare(b)})

    tempData = []
    tempData = this.filteredApiData
    if (this.selectedLabel !== "All") {
      tempData = tempData.filter((data) => data['Currency'] === this.selectedLabel)
    }
    this.clientList = [...new Set(tempData.map((data) => data[this.customername]))]
    console.log("Send")
  }

  getDataByPayOff(): dataFormat[] {
    this.dateCurrencyAndPayOffFilter();
    let dataForPayOff: dataFormat[] = []
    this.payOff.forEach((pay) => {
      let tempData: dataFormat = {
        title: '',
        volume: 0,
        revenue: 0
      }
      let dataByPayOff = this.filteredApiData.filter((data) => data.PayOff === pay)
      if (dataByPayOff.length > 0) {
        let curRevenueList = dataByPayOff.map((data) => {
          if (data['USD eqv. Revenue'] > 0)
            return data['USD eqv. Revenue']
          else
            return 0
        })
        let curVolumeList = dataByPayOff.map((data) => {
          if (data['USD eqv. Trade Volume'] > 0)
            return data['USD eqv. Trade Volume']
          else
            return 0
        })
        tempData["title"] = pay;
        tempData["revenue"] = curRevenueList.reduce((acc = 0, curRevenue) => acc + curRevenue)
        tempData["volume"] = curVolumeList.reduce((acc = 0, curvolume) => acc + curvolume)
        dataForPayOff = [...dataForPayOff, { ...tempData }]
      }

    })
    return dataForPayOff
  }

  // getDataForRevenueByPayOff(): dataFormat[] {
  //   let dataForRevenueByPayOff: dataFormat[] = []
  //   this.payOff.forEach((pay) => {
  //     let tempData: dataFormat = {
  //       title: '',
  //       volume: 0
  //     }
  //     let dataByPayOff = this.filteredApiData.filter((data) => data.PayOff === pay)
  //     if (dataByPayOff.length > 0) {
  //       let curRevenueList = dataByPayOff.map((data) => {
  //         if (data['USD eqv. Revenue'] > 0)
  //           return data['USD eqv. Revenue']
  //         else
  //           return 0
  //       })
  //       tempData["title"] = pay;
  //       tempData["volume"] = curRevenueList.reduce((acc = 0, curvolume) => acc + curvolume)
  //       dataForRevenueByPayOff = [...dataForRevenueByPayOff, { ...tempData }]
  //     }

  //   })
  //   return dataForRevenueByPayOff
  // }


  getDataByCurrency(): dataFormat[] {
    this.dateCurrencyAndPayOffFilter();
    let dataForCurrency: dataFormat[] = []

    let tempCurrencies: string[] = []
    this.currency.forEach((currency) => {
      let tempData: dataFormat = {
        title: '',
        volume: 0,
        revenue: 0
      }
      let dataByCurrency = this.filteredApiData.filter((data) => data.Currency === currency)
      if (dataByCurrency.length > 0) {
        let curRevenueList = dataByCurrency.map((data) => {
          if (data['USD eqv. Revenue'] > 0)
            return data['USD eqv. Revenue']
          else
            return 0
        })
        let curVolumeList = dataByCurrency.map((data) => {
          if (data['USD eqv. Trade Volume'] > 0)
            return data['USD eqv. Trade Volume']
          else
            return 0
        })
        tempData["title"] = currency;
        tempData["revenue"] = curRevenueList.reduce((acc = 0, curRevenue) => acc + curRevenue)
        tempData["volume"] = curVolumeList.reduce((acc = 0, curvolume) => acc + curvolume)
        dataForCurrency = [...dataForCurrency, { ...tempData }]
      }
    })

    return dataForCurrency
  }

  // getDataForRevenueByCurrency(): dataFormat[] {
  //   let dataForRevenueByCurrency: dataFormat[] = []

  //   let tempCurrencies: string[] = []
  //   this.currency.forEach((currency) => {
  //     let tempData: dataFormat = {
  //       title: '',
  //       volume: 0
  //     }
  //     let dataByCurrency = this.filteredApiData.filter((data) => data.Currency === currency)
  //     if (dataByCurrency.length > 0) {
  //       let curVolumeList = dataByCurrency.map((data) => {
  //         if (data['USD eqv. Revenue'] > 0)
  //           return data['USD eqv. Revenue']
  //         else
  //           return 0
  //       })

  //       tempData["title"] = currency;
  //       tempData["volume"] = curVolumeList.reduce((acc = 0, curvolume) => acc + curvolume)
  //       dataForRevenueByCurrency = [...dataForRevenueByCurrency, { ...tempData }]
  //     }

  //   })
  //   return dataForRevenueByCurrency
  // }


  setProperties() {
    let dates = this.apiData.map((data) => new Date(data.Trade_Date)).sort((a: Date, b: Date) => a.getTime() - b.getTime());
    this.minDate = dates[0]
    this.currentMinDate = this.minDate
    this.maxDate = dates[dates.length - 1];
    this.currentMaxDate = this.maxDate
    this.initialState["minDate"]=this.minDate
    this.initialState["maxDate"]=this.maxDate
    let payoffs: string[] = this.apiData.map((data: any) => {
      return data.PayOff
    })
    this.payOff = [...new Set(payoffs)];

    let currencies: string[] = this.apiData.map((data: any) => {
      return data.Currency
    })
    this.currency = [...new Set(currencies)];
  }


  destroySelected() {
    this.currentSelectedCurrency="All";
    this.currentSelectedPayOff="All"
  }
}
