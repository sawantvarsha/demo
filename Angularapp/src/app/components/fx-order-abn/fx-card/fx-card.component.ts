import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FxOrderAbnService } from 'src/app/services/fx-order-abn.service';
import { environment } from '../../../../environments/environment';
import { DecimalPipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';

@Component({
  selector: 'app-fx-card',
  templateUrl: './fx-card.component.html',
  styleUrls: ['./fx-card.component.scss'],
})
export class FxCardComponent implements OnInit {
  card: any;
  settlementGroup: any;
  consumerQuoteReference: any;
  favorite: boolean = true;
  assetURL: string;
  bidSmall: string;
  bidLarge: string;
  askSmall: string;
  askLarge: string;
  direction: string;
  altDirection: string;
  @Input() set setCard(value: any) {
    this.card = value;
    this.updateValues();
  }
  ccyName: any;
  bidRate: any;
  askRate: any;
  bidSwapPoints: any;
  askSwapPoints: any;
  settlementDate: any;
  ccyNameUnseparated: any;
  baseNotional: any;
  altNotional: any;
  baseCcy: any;
  altCcy: any;
  optionType = 'Spot';
  minDate: Date;
  showTenorBox = false;

  constructor(
    public fxABNService: FxOrderAbnService,
    public router: Router,
    public decimalPipe: DecimalPipe,
    public authApi: AuthService,
    public commonfunctionApi: CommonApiService
  ) {
    this.ccyName = '';
    this.bidRate = '';
    this.askRate = '';
    this.bidSwapPoints = '';
    this.askSwapPoints = '';
    this.ccyNameUnseparated = '';
    this.settlementGroup = '';
    this.consumerQuoteReference = 'ASAP_';
    this.baseNotional = 10000;
    this.altNotional = 0;

    this.bidSmall = '';
    this.bidLarge = '';
    this.askSmall = '';
    this.askLarge = '';
    this.favorite = false;
    this.direction = 'SELL';
    this.altDirection = 'BUY';
  }
  //   {
  //     "ccy": "USD/CHF",
  //     "id": "38840",
  //     "index": "1",
  //     "allInRate": {
  //         "bidRate": 0.8802328,
  //         "askRate": 0.8926328,
  //         "midRate": 0.8864328,
  //         "effectiveDateTime": "2021-09-30T11:27:11.711Z"
  //     },
  //     "spotRate": {
  //         "bidRate": 0.87999,
  //         "askRate": 0.89239,
  //         "midRate": 0.88619,
  //         "effectiveDateTime": "2021-09-30T11:27:11.617Z"
  //     },
  //     "swapPoints": {
  //         "bidPoints": 0.0002428,
  //         "askPoints": 0.0002428
  //     },
  //     "settlementDate": "2021-09-30",
  //     "ccyunseparated": "USDCHF"
  // }

  ngOnInit(): void {
    this.assetURL = environment.assetURL;
    const tod = new Date();
    this.minDate = new Date();
    if (this.minDate.getDay() > 0 && this.minDate.getDay() < 4) {
      this.minDate.setDate(tod.getDate() + 3);
    } else if (this.minDate.getDay() === 4) {
      this.minDate.setDate(tod.getDate() + 5);
    } else if (this.minDate.getDay() === 5) {
      this.minDate.setDate(tod.getDate() + 5);
    }
  }
  updateValues() {
    console.log(this.card);
    this.ccyName = this.card?.ccy;
    this.settlementGroup = this.card?.settlementGroup;
    this.card.ccyunseparated = this.card.ccy.replace(/\//g, '');
    this.favorite = this.card.favorite;

    this.fxABNService
      .getCurrencyPairsIndicativeRates([this.card.ccyunseparated], 'TODAY')
      .subscribe(
        (res) => {
          console.log(res.FXRates);
          const FXRate: any[] = res.FXRates;
          if (FXRate.length > 0) {
            this.fxABNService
              .GetCcyPairPointShiftDetails(
                'PAIR',
                this.card.ccy.replace(/\//g, ' - '),
                'FXCAPI',
                this.authApi.EntityID,
                'FXC'
              )
              .subscribe((pointshift: any) => {
                console.log('POINT SHIFT', pointshift);
                const rateDetails = FXRate; //.filter(r => r.currencyPair === this.ccyName.ccy.replace(/\//g, ''));
                const pointShift = pointshift.body[0].PointShift;
                const rateDecimal = pointshift.body[0].RateDecimal;
                const baseNotionalPF = pointshift.body[0].Ccy1AmountDecimal;
                const altNotionalPF = pointshift.body[0].Ccy2AmountDecimal;

                if (rateDetails.length > 0) {
                  this.card.allInRate = rateDetails[0].allInRate;
                  this.card.spotRate = rateDetails[0].spotRate;
                  this.card.swapPoints = rateDetails[0].swapPoints;
                  this.card.settlementDate = rateDetails[0].settlementDate;
                  this.card.ccyunseparated = rateDetails[0].currencyPair;
                  this.card.settlementGroup = this.settlementGroup;
                  this.card.pointShift = pointShift;
                  this.card.rateDecimal = rateDecimal;
                  this.card.baseNotionalPF = baseNotionalPF;
                  this.card.altNotionalPF = altNotionalPF;
                } else {
                  this.card.allInRate = {
                    bidRate: 0,
                    askRate: 0,
                    midRate: 0,
                    effectiveDateTime: '2021-10-01T09:28:35.672Z',
                  };
                  this.card.spotRate = {
                    bidRate: 0,
                    askRate: 0,
                    midRate: 0,
                    effectiveDateTime: '2021-10-01T09:28:35.603Z',
                  };
                  this.card.swapPoints = {
                    bidPoints: 0,
                    askPoints: 0,
                  };
                  this.card.settlementDate = 'NA';
                  this.card.settlementGroup = this.settlementGroup;
                }
                console.log(this.card);

                this.changeDirection();
                // this.bidSwapPoints = this.card?.swapPoints.bidPoints;
                // this.askSwapPoints = this.card?.swapPoints.askPoints;
                this.ccyNameUnseparated = this.card?.ccyunseparated;
              });
          } else {
            this.bidRate = 'NA';
            this.askRate = 'NA';
            this.baseCcy = this.card?.ccy.split('/')[0];
            this.altCcy = this.card?.ccy.split('/')[1];
            this.baseNotional = this.decimalPipe.transform(10000, '1.0-2');
            this.altNotional = this.decimalPipe.transform(0, '1.0-2');
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  placeQuoteRequest() {
    this.router.navigate(['quote'], {
      queryParams: {
        baseccy: this.direction === 'BUY' ? this.baseCcy : this.altCcy,
        basenotional:
          this.direction === 'BUY'
            ? parseFloat(this.baseNotional.replace(/,/g, ''))
            : '0',
        altccy: this.direction === 'SELL' ? this.baseCcy : this.altCcy,
        altnotional:
          this.direction === 'SELL'
            ? parseFloat(this.altNotional.replace(/,/g, ''))
            : '0',
        date: this.settlementDate,
        group: this.settlementGroup,
      },
    });
  }
  changeDirection() {
    this.direction = this.direction === 'BUY' ? 'SELL' : 'BUY';
    this.altDirection = this.altDirection === 'BUY' ? 'SELL' : 'BUY';
    this.bidRate = this.card?.spotRate.bidRate || 0;
    this.askRate = this.card?.spotRate.askRate || 0;
    if (this.direction === 'BUY') {
      this.bidSmall = this.bidRate.toString().substr(0, 4) || '0';
      this.card.spotRate.bidSmall = this.bidSmall;
      this.bidLarge = this.bidRate.toString().substr(4, 2) || '0';
      this.card.spotRate.bidLarge = this.bidLarge;
      this.askSmall = this.askRate.toString().substr(0, 4) || '0';
      this.card.spotRate.askSmall = this.askSmall;
      this.askLarge = this.askRate.toString().substr(4, 2) || '0';
      this.card.spotRate.askLarge = this.askLarge;
      this.baseCcy = this.card?.ccy.split('/')[0];
      this.altCcy = this.card?.ccy.split('/')[1];
      this.settlementDate = this.card?.settlementDate;

      this.baseNotional = parseFloat(
        this.baseNotional.toString().replace(/,/g, '')
      );
      this.altNotional = this.baseNotional * this.askRate;
      this.baseNotional = this.decimalPipe.transform(
        this.baseNotional,
        '1.' + this.card.baseNotionalPF + '-' + this.card.baseNotionalPF
      );
      this.altNotional = this.decimalPipe.transform(
        this.altNotional,
        '1.' + this.card.altNotionalPF + '-' + this.card.altNotionalPF
      );
    } else if (this.direction === 'SELL') {
      // this.bidRate = this.card?.spotRate.askRate || 0; // FLIP RATES
      // this.askRate = this.card?.spotRate.bidRate || 0; // FLIP RATES
      this.bidSmall = this.askRate.toString().substr(0, 4) || '0';
      this.card.spotRate.bidSmall = this.bidSmall;
      this.bidLarge = this.askRate.toString().substr(4, 2) || '0';
      this.card.spotRate.bidLarge = this.bidLarge;
      this.askSmall = this.bidRate.toString().substr(0, 4) || '0';
      this.card.spotRate.askSmall = this.askSmall;
      this.askLarge = this.bidRate.toString().substr(4, 2) || '0';
      this.card.spotRate.askLarge = this.askLarge;
      this.baseCcy = this.card?.ccy.split('/')[0];
      this.altCcy = this.card?.ccy.split('/')[1];
      this.settlementDate = this.card?.settlementDate;

      this.baseNotional = parseFloat(
        this.baseNotional.toString().replace(/,/g, '')
      );
      this.altNotional = this.baseNotional * this.bidRate;
      this.baseNotional = this.decimalPipe.transform(
        this.baseNotional,
        '1.' + this.card.baseNotionalPF + '-' + this.card.baseNotionalPF
      );
      this.altNotional = this.decimalPipe.transform(
        this.altNotional,
        '1.' + this.card.altNotionalPF + '-' + this.card.altNotionalPF
      );
    }

    // this.baseNotional = (parseFloat(this.baseNotional.replace(/,/g, '')).toFixed(baseNotionalPF)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // this.altNotional = parseFloat(this.altNotional.replace(/,/g, '')).toFixed(altNotionalPF);
  }
  changeNotional(value, event?) {
    const rate = this.direction === 'BUY' ? this.askRate : this.bidRate;
    switch (event) {
      case 'base':
        this.baseNotional = this.commonfunctionApi.unformatNumber(
          this.baseNotional
        );
        this.altNotional = this.commonfunctionApi.formatNumber(
          this.baseNotional * rate
        );
        break;
      case 'alt':
        this.altNotional = this.commonfunctionApi.unformatNumber(
          this.altNotional
        );
        this.baseNotional = this.commonfunctionApi.formatNumber(
          this.altNotional / rate
        );
        break;

      default:
        break;
    }
    return value;
  }
}
