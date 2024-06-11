import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.scss']
})
export class TickerComponent implements OnInit {
  isTickerPaused: boolean;
  marketWatchSubscriber: any;
  marketWatch: any;
  showTicker: any;

  constructor(public homeApi: HomeApiService, public decimalPipe: DecimalPipe, public commonApi: CommonApiService) {
    this.showTicker = true;
    this.marketWatch = [];
  }

  ngOnInit(): void {
    this.commonApi.showTickerObs.subscribe(res => {
      this.showTicker = res;
    });
    this.marketWatchSubscriber = this.homeApi.GetMarketWatch(this.homeApi.CustomerId || sessionStorage.getItem('CustomerID'), this.homeApi.Portfolio || '').subscribe((mkwatch: any) => {
      if (mkwatch.length !== 0 && this.marketWatch.length === 0) {
        this.marketWatch = [];
        mkwatch.forEach(element => {
          element.SpotBidQuote = element.SpotBidQuote !== '' ? this.decimalPipe.transform(element.SpotBidQuote, '1.2-2') : '0';
          if (element.Change <= 0) {
            this.marketWatch.push([element, false]);
          } else {
            this.marketWatch.push([element, true]);
          }
        });
        this.isTickerPaused = this.marketWatch.length < 4;
        // this.marketWatch = this.marketWatch.sortBy('Misc1');
      }
    });
  }
  tickerPausePlay() {
    this.isTickerPaused = !this.isTickerPaused;
  }

}
