import { Component, OnInit } from '@angular/core';
import { MapleAPIService } from '../../maple-api.service';
import * as shareList from '../../../../components/finiq-maple-api/EQCShareslist.json';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit {

  constructor(private mapleapi: MapleAPIService) { }

  
  currencyList : any;
  tenor_FCN : any = 6;

  shareListOption : any;
  sharesOption : any;
  FilterSharesOption : any;
  selectedShareOption = "AAPL.OQ";
  showSharePopup = false;
  showSearchShare = false;
  sharelistpopup = false;

  tenorOption = [];
  selectedTenorOption = "1W";
  settlementDaysOption = "7";
  NoOfSharesOption = "2,000"
  AmountArrayOption = [];
  showAmountPopup = false;
  showSearchAmount = false;
  upfront = 0.5.toFixed(2);
  solveForOption = "STRIKE";
  selectedCurrencyOption = "AUD";
  strikeOption = 82.00.toFixed(2);
  PremiumOption = 5.00.toFixed(2);
  OptionType = "European Call"
  TradeDate = "";
  ValueDate = "";
  FixingDate = "";
  MaturityDate = "";
  DateResponse : any;
  Settlement = "Cash";

 
  
  ngOnInit(): void {

    this.sharesOption = (shareList as any).default;
    console.log("share list from file", this.sharesOption);
    this.FilterSharesOption = this.sharesOption;


    this.mapleapi.mapleCurrencyPair();
    this.mapleapi.currecyPair.subscribe(res => {
      if(res){
        
        // console.log(res);
        this.currencyList = [];
        this.currencyList =Array.of(res.responseData);
        this.currencyList = JSON.parse("[" + this.currencyList + "]");
        console.log(this.currencyList);
      }
    })

    this.mapleapi.mapleDates("5", "Mobile1", this.selectedShareOption, this.selectedTenorOption, this.settlementDaysOption, "");
    this.mapleapi.dates.subscribe(res => {
      if(res){
        
        console.log("Date",res.responseData);
        this.DateResponse = res.responseData;
        console.log(this.DateResponse);
        this.DateResponse = Array.of(res.responseData);
        console.log(this.DateResponse);
        this.DateResponse = JSON.parse("[" + this.DateResponse + "]");
        this.DateResponse = Object.assign({}, ...this.DateResponse);
        console.log(this.DateResponse);
        if(Object.keys(this.DateResponse).length > 0)
        {
          this.TradeDate = this.DateResponse[0].TradeDate;
          this.ValueDate = this.DateResponse[0].ValueDate;
          this.FixingDate = this.DateResponse[0].FixingDate;
          this.MaturityDate = this.DateResponse[0].MaturityDate;
          console.log("Dates::", this.TradeDate, this.ValueDate, this.FixingDate, this.MaturityDate);
        }
        
        
      }
    })

    
    // this.mapleapi.mapleQuote("Mobile1", "5", "Simple", "NASDAQ", "AAPL.OQ", "USD", "PricePercentage", "", "6M", "85.00", "0.00", "JPM|HSBC|CS|BNPP|MS|UBS", "", "7", "0.50", "");
    this.mapleapi.quote.subscribe(res => {
      if(res){
        
        console.log(res);
        
      }
    })

    
    // this.mapleapi.mapleQuoteResponse("Mobile1", "Barclays-32475,BNPP-32476,Citi-32477,CS-32478,GS-32479,HSBC-32480,JPM-32481,Leonteq-32482,MS-32483,Natixis-32484,Nomura-32485,OCBC-32486,Raiffeisen-32487,RBC-32488,SCB-32489,SocGen-32490,TDS-32491,UBS-32492,Vontobel-32493", "");
    this.mapleapi.quoteResponse.subscribe(res => {
      if(res){
        
        console.log(res);
        
      }
    })

    
    // this.mapleapi.mapleIBPrice("Mobile1", "5.00", this.selectedCurrency, this.upfront, this.FixingDate, this.MaturityDate,"");
    this.mapleapi.ibPrice.subscribe(res => {
      if(res){
        
        console.log("IBPrice",res);
        // this.IBPrice = res;
        
      }
    })

    // this.mapleapi.mapleShares();
    // this.mapleapi.shares.subscribe(res => {
    //   if(res){
        
    //     console.log(res);
    //     this.shareListOption = res;
    //     console.log("shares", this.shareListOption)
    //   }
    // })

    this.mapleapi.mapleAmount();
    this.mapleapi.amount.subscribe(res => {
      if(res){
        console.log("Amount",res);
        this.AmountArrayOption = res;

      }
    })

    this.mapleapi.mapleTenor();
    this.mapleapi.tenor.subscribe(res => {
      if(res){
        console.log("tenor", res);
        this.tenorOption = res;
      }
    })


  }

  
  fnShowSharePopup(share){
    this.showSharePopup = !this.showSharePopup;
    this.selectedShareOption = share.Share;
    
  }

  searchShare(event){
    let value = event.target.value;
    console.log("value..", value);

    let result = [];
    result = this.sharesOption.filter((data) => {
      return data.LongName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    });
    this.FilterSharesOption = result;
  }

  selectShareFromDropdown(event){
    console.log("", event)
    this.showSearchShare = false;
    this.sharelistpopup = false;
    this.showSharePopup = false;
    this.selectedShareOption = event.Code;
    this.FilterSharesOption = this.sharesOption;
  }

  onClickedOutside(_e){
    console.log("outside..");
    this.showSearchShare = false;
    this.sharelistpopup = false;
    this.showSharePopup = false;
   
  }



}
