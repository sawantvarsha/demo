import { Component, OnInit } from '@angular/core';
import { MapleAPIService } from '../../maple-api.service';
import * as shareList from '../../../../components/finiq-maple-api/EQCShareslist.json';

@Component({
  selector: 'app-aqdqmaple',
  templateUrl: './aqdqmaple.component.html',
  styleUrls: ['./aqdqmaple.component.scss'],
})
export class AQDQMapleComponent implements OnInit {
  constructor(private mapleapi: MapleAPIService) {}

  currencyList: any;
  tenor_FCN: any = 6;

  shareListAQDQ: any;
  sharesAQDQ: any;
  FilterSharesAQDQ: any;
  selectedShareAQDQ = 'AAPL.OQ';
  showSharePopup = false;
  showSearchShare = false;
  sharelistpopup = false;

  tenorAQDQ = [];
  selectedTenorAQDQ = '1W';
  settlementDaysAQDQ = '7';
  NoOfSharesAQDQ = '250';
  AmountArrayAQDQ = [];
  showAmountPopup = false;
  showSearchAmount = false;
  upfront = (0.5).toFixed(2);
  solveForAQDQ = 'STRIKE';
  selectedCurrencyAQDQ = 'AUD';
  strikeAQDQ = (82.0).toFixed(2);
  UpfrontAQDQ = 50;
  LeverageAQDQ = '2';
  KOPercAQDQ = (105.0).toFixed(2);
  KOTypeAQDQ = 'DAILY_CLOSE';
  TradeDate = '';
  ValueDate = '';
  FixingDate = '';
  MaturityDate = '';
  DateResponse: any;
  ProductTypeAQDQ = 'AQ';
  AQDQType = 'AQ';
  FrequencyAQDQ = 'MONTHLY';
  GuaranteeAQDQ = '0';
  GuaranteeAQDQ_ARRAY = ['0', '1', '2', '3', '5'];

  ngOnInit(): void {
    this.sharesAQDQ = (shareList as any).default;
    console.log('share list from file', this.sharesAQDQ);
    this.FilterSharesAQDQ = this.sharesAQDQ;

    this.mapleapi.mapleCurrencyPair();
    this.mapleapi.ccyFXD.subscribe((res) => {
      if (res) {
        // console.log(res);
        this.currencyList = [];
        this.currencyList = Array.of(res.responseData);
        this.currencyList = JSON.parse('[' + this.currencyList + ']');
        console.log(this.currencyList);
      }
    });

    this.mapleapi.mapleDates(
      '5',
      'Mobile1',
      this.selectedShareAQDQ,
      this.selectedTenorAQDQ,
      this.settlementDaysAQDQ,
      ''
    );
    this.mapleapi.dates.subscribe((res) => {
      if (res) {
        console.log('Date', res.responseData);
        this.DateResponse = res.responseData;
        console.log(this.DateResponse);
        this.DateResponse = Array.of(res.responseData);
        console.log(this.DateResponse);
        this.DateResponse = JSON.parse('[' + this.DateResponse + ']');
        this.DateResponse = Object.assign({}, ...this.DateResponse);
        console.log(this.DateResponse);
        if (Object.keys(this.DateResponse).length > 0) {
          this.TradeDate = this.DateResponse[0].TradeDate;
          this.ValueDate = this.DateResponse[0].ValueDate;
          this.FixingDate = this.DateResponse[0].FixingDate;
          this.MaturityDate = this.DateResponse[0].MaturityDate;
          console.log(
            'Dates::',
            this.TradeDate,
            this.ValueDate,
            this.FixingDate,
            this.MaturityDate
          );
        }
      }
    });

    // this.mapleapi.mapleQuote("Mobile1", "5", "Simple", "NASDAQ", "AAPL.OQ", "USD", "PricePercentage", "", "6M", "85.00", "0.00", "JPM|HSBC|CS|BNPP|MS|UBS", "", "7", "0.50", "");
    this.mapleapi.quote.subscribe((res) => {
      if (res) {
        console.log(res);
      }
    });

    // this.mapleapi.mapleQuoteResponse("Mobile1", "Barclays-32475,BNPP-32476,Citi-32477,CS-32478,GS-32479,HSBC-32480,JPM-32481,Leonteq-32482,MS-32483,Natixis-32484,Nomura-32485,OCBC-32486,Raiffeisen-32487,RBC-32488,SCB-32489,SocGen-32490,TDS-32491,UBS-32492,Vontobel-32493", "");
    this.mapleapi.quoteResponse.subscribe((res) => {
      if (res) {
        console.log(res);
      }
    });

    // this.mapleapi.mapleIBPrice("Mobile1", "5.00", this.selectedCurrency, this.upfront, this.FixingDate, this.MaturityDate,"");
    this.mapleapi.ibPrice.subscribe((res) => {
      if (res) {
        console.log('IBPrice', res);
        // this.IBPrice = res;
      }
    });

    // this.mapleapi.mapleShares();
    // this.mapleapi.shares.subscribe(res => {
    //   if(res){

    //     console.log(res);
    //     this.shareListAQDQ = res;
    //     console.log("shares", this.shareListAQDQ)
    //   }
    // })

    this.mapleapi.mapleAmount();
    this.mapleapi.amount.subscribe((res) => {
      if (res) {
        console.log('Amount', res);
        this.AmountArrayAQDQ = res;
      }
    });

    this.mapleapi.mapleTenor();
    this.mapleapi.tenor.subscribe((res) => {
      if (res) {
        console.log('tenor', res);
        this.tenorAQDQ = res;
      }
    });
  }

  fnShowSharePopup(share) {
    this.showSharePopup = !this.showSharePopup;
    this.selectedShareAQDQ = share.Share;
  }

  searchShare(event) {
    let value = event.target.value;
    console.log('value..', value);

    let result = [];
    result = this.sharesAQDQ.filter((data) => {
      return data.LongName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    });
    this.FilterSharesAQDQ = result;
  }

  selectShareFromDropdown(event) {
    console.log('', event);
    this.showSearchShare = false;
    this.sharelistpopup = false;
    this.showSharePopup = false;
    this.selectedShareAQDQ = event.Code;
    this.FilterSharesAQDQ = this.sharesAQDQ;
  }

  onClickedOutside(_e) {
    console.log('outside..');
    this.showSearchShare = false;
    this.sharelistpopup = false;
    this.showSharePopup = false;
  }

  changeAQDQType() {
    if (this.FrequencyAQDQ === 'MONTHLY') {
      this.GuaranteeAQDQ_ARRAY = ['0', '1', '2', '3', '5'];
    } else if (this.FrequencyAQDQ === 'BI-WEEKLY') {
      this.GuaranteeAQDQ_ARRAY = ['0', '1', '2', '3', '4', '6'];
    }
  }
}
