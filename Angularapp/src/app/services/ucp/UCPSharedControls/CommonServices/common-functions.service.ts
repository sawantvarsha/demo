import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionsService {
  private AQPricesObserver = new BehaviorSubject<any>('');
  AQSignalRPrices = this.AQPricesObserver.asObservable();
  AQPrices = [];
  
  constructor() { }
  
  priceChange: BehaviorSubject<string> = new BehaviorSubject<string>("");
  priceObj: Observable<string> = this.priceChange.asObservable();
  pricingIDflexi = 0;
  setAQReceivedPrices(prices: any) {
    try {
      console.log("setAQReceivedPrices data:::: ", prices)
      //this.AQPrices[this.AQPrices.length] = prices;
      this.priceChange.next(prices);
    }
    catch (error) {
    }
  }
  IncrementPricingID() {
    try {
      this.pricingIDflexi += 1;
    }
    catch (error) {
      //console.log("Error:", error);
    }
  }
  getPricingID() {
    try {
      return this.pricingIDflexi;
    }
    catch (error) {
      //console.log("Error:", error);
    }
  }
  
}
