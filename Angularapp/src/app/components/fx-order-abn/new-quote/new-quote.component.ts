import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CommonApiService } from 'src/app/services/common-api.service';
import { FxOrderAbnService } from 'src/app/services/fx-order-abn.service';

@Component({
  selector: 'app-new-quote',
  templateUrl: './new-quote.component.html',
  styleUrls: ['./new-quote.component.scss']
})
export class NewQuoteComponent implements OnInit {
  consumerQuoteReference: string;
  baseCcy: any;
  baseNotional: string;
  altCcy: any;
  altnotional: string;
  rate: string;
  settlementDate: any;
  settlementGroup: any;
  ccy: string;
  direction: any;
  altDirection: any;
  quoteTimer: any;
  quoteSeconds: any;
  quoteInterval: any;
  quoteSignature: any;
  message: string;
  buyAmount: string;
  sellAmount: string;

  constructor(public activatedRoute: ActivatedRoute, public fxABNService: FxOrderAbnService, public decimalPipe: DecimalPipe, public commonfunctionApi: CommonApiService, public router: Router) {
    this.consumerQuoteReference = 'ASAP_';
    this.direction = 'BUY';
    this.altDirection = 'SELL';
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(res => {
      console.log(res);
      // this.baseCcy = res.baseccy;
      // this.baseNotional = res.basenotional;
      // this.altCcy = res.altccy;
      // this.altnotional = res.altnotional;
      // this.settlementDate = res.date;
      // this.settlementGroup = res.group;
      this.placeQuote(res.baseccy, res.basenotional,
        res.altccy,
        res.altnotional,
        res.date,
        res.group);
    })
  }
  placeQuote(baseCcy, baseNotional, altCcy, altnotional, settlementDate, settlementGroup) {

    this.fxABNService.placeQuote(this.consumerQuoteReference + moment().format('YYYY-MM-DDHHmmSS'), baseCcy, baseNotional, altCcy, altnotional, settlementDate, settlementGroup).subscribe(res => {
      console.log(res);
      switch (res.quoteStatus) {
        case 'REJECTED':
          this.message = res.message;
          break;
        case 'PENDING_NEW': case 'QUOTED':
          this.consumerQuoteReference = res.consumerQuoteReference;
          this.quoteSignature = res.quoteSignature;
          this.rate = res.rate;
          this.baseCcy = res.buyCurrency;
          this.buyAmount = res.buyAmount ? this.decimalPipe.transform(res.buyAmount, '1.2-2') : '0';
          this.sellAmount = res.sellAmount ? this.decimalPipe.transform(res.sellAmount, '1.2-2') : '0';
          this.baseNotional = this.decimalPipe.transform(res.buyAmount || res.sellAmount, '1.2-2');
          this.altCcy = res.sellCurrency;
          this.altnotional = this.decimalPipe.transform(res.contraAmount, '1.2-2');
          this.settlementDate = res.settlementDate;
          this.settlementGroup = res.settlementAccountGroup;
          this.quoteSeconds = this.getQuoteTimer(res.expirationDateTime, res.submittedDateTime);
          this.quoteTimer = this.convertSecondstoHMS(this.quoteSeconds);
          this.quoteInterval = setInterval(() => {
            if (this.quoteSeconds > 0) {
              this.quoteTimer = this.convertSecondstoHMS(this.quoteSeconds--);
              console.log(this.quoteTimer);
            } else {
              this.quoteTimer = 'Quote Expired, Please price again.'
              clearInterval(this.quoteInterval);
            }
          }, 1000);
          break;

        default:
          break;
      }

      // this.baseCcy = res.
      //   this.altCcy
      // submittedDateTime
    }, err => {
      console.log(err)
    });
  }

  getQuoteTimer(dt2, dt1) {
    try {
      let diff = (new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000;
      // console.log(this.convertSeconds(diff));
      return diff;
    } catch (error) {
      console.log(error);
    }


  }
  convertSecondstoHMS(time) {
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }
  placeOrder() {
    this.fxABNService.placeOrder(
      this.consumerQuoteReference,
      this.baseCcy,
      this.commonfunctionApi.unformatNumber(this.buyAmount),
      this.commonfunctionApi.unformatNumber(this.sellAmount),
      this.altCcy,
      this.settlementDate,
      this.settlementGroup,
      this.quoteSignature).subscribe(res => {
        console.log(res);
        this.router.navigate(['order'], { queryParams: { orderid: res.orderId } });
      });
  }
}


// {
//   "quoteId": "017ce073-e840-4b0a-8729-b61e2c41d896",
//   "submittedDateTime": "2021-11-02T11:41:04.960Z",
//   "quoteStatus": "QUOTED",
//   "expirationDateTime": "2021-11-02T11:42:34.960Z",
//   "consumerQuoteReference": "ASAP_2021-11-02171180",
//   "buyCurrency": "EUR",
//   "sellCurrency": "USD",
//   "buyAmount": 10000,
//   "settlement": "2021-11-02",
//   "settlementAccountGroup": "Client Account",
//   "currencyPair": "EURUSD",
//   "spotRate": {
//       "bidRate": 1.21045,
//       "askRate": 1.22751,
//       "midRate": 1.21898,
//       "effectiveDateTime": "2021-11-02T11:41:04.364Z"
//   },
//   "swapPoints": {
//       "bidPoints": -0.0001169,
//       "askPoints": -0.0001169
//   },
//   "allInRate": {
//       "bidRate": 1.2103331,
//       "askRate": 1.2273931,
//       "midRate": 1.2188631,
//       "effectiveDateTime": "2021-11-02T11:41:04.960Z"
//   },
//   "contraAmount": 12273.93,
//   "rate": 1.2273931,
//   "settlementDate": "2021-11-02",
//   "quoteSignature": "AAAAAEn1DK880B/kGIbZDrPt6jQ/JoYve1pfgs4jPKA646dj4owb1FR70fjCJSJ/u6HdFU7rYVd4C8rt0Ayu4w4tjjupsPQKtT/x5kK9R658Ky4uevv6Gd3OK2UOlseUzz2y2Bw/0YpCKzrnixRTTnCWZRsn1KjxxMtx1wgZTtNwvFDrWQ=="
// }