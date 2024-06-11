import { Component, OnInit } from '@angular/core';
import { MapleAPIService } from '../../maple-api.service';
import * as shareList from '../../../../components/finiq-maple-api/EQCShareslist.json';
import { CommonApiService } from 'src/app/services/common-api.service';

@Component({
  selector: 'app-eln',
  templateUrl: './eln.component.html',
  styleUrls: ['./eln.component.scss']
})
export class ELNComponent implements OnInit {

  currencyList : any;
  shareList : any;
  sharesELN : any;
  FilterSharesELN : any;
  selectedShare = "AAPL.OQ";
  showSharePopup = false;
  showSearchShare = false;
  sharelistpopup = false;

  tenor = [];
  selectedTenor = "1W";
  settlementDays = "7";
  notional = "1,000,000.00"
  AmountArray = [];
  showAmountPopup = false;
  showSearchAmount = false;
  upfront = 0.5.toFixed(2);
  solveFor = "StrikePercentage";
  selectedCurrency = "AUD";
  strike = 82.00.toFixed(2);
  IBPrice = 99.00.toFixed(2);
  clientYield = 5.00.toFixed(4);
  KOPerc = 101.00.toFixed(2);
  KOType = "DAILY_CLOSE";
  TradeDate = "";
  ValueDate = "";
  FixingDate = "";
  MaturityDate = "";
  DateResponse : any;
  ProductType = "Simple";
  ELNType = "Simple";



  constructor(private mapleapi: MapleAPIService, private commonapi : CommonApiService) { }

  ngOnInit(): void {

    this.sharesELN = (shareList as any).default;
    console.log("share list from file", this.sharesELN);
    this.FilterSharesELN = this.sharesELN;

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


    this.mapleapi.mapleDates("5", "Mobile1", this.selectedShare, this.selectedTenor, this.settlementDays, "");
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
    //     this.shareList = res;
    //     console.log("shares", this.shareList)
    //   }
    // })

    this.mapleapi.mapleAmount();
    this.mapleapi.amount.subscribe(res => {
      if(res){
        console.log("Amount",res);
        this.AmountArray = res;

      }
    })

    this.mapleapi.mapleTenor();
    this.mapleapi.tenor.subscribe(res => {
      if(res){
        console.log("tenor", res);
        this.tenor = res;
      }
    })

  }


  fnShowSharePopup(share){
    this.showSharePopup = !this.showSharePopup;
    this.selectedShare = share.Share;
    
  }

  
  fnShowAmountPopup(amt){

    this.showAmountPopup = !this.showAmountPopup;  
    let amount1 = this.commonapi.NotionalChangeWOTarget(amt.Amount);
    let amount2 = this.commonapi.FormatNumberwithoutevent(amount1);
    this.notional = amount2;

  }

  getNotional(e){
    console.log("notional", e.target.value);
    let amount = this.commonapi.NotionalChange(e);
    let amount1 = this.commonapi.FormatNumberwithoutevent(amount);
    this.notional = amount1;
    console.log("amount..", amount1);
    this.showSearchAmount = !this.showSearchAmount;
    this.showAmountPopup = !this.showAmountPopup;
  }


  searchShare(event){
    let value = event.target.value;
    console.log("value..", value);

    let result = [];
    result = this.sharesELN.filter((data) => {
      return data.LongName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    });
    this.FilterSharesELN = result;
  }

  selectShareFromDropdown(event){
    console.log("", event)
    this.showSearchShare = false;
    this.sharelistpopup = false;
    this.showSharePopup = false;
    this.selectedShare = event.Code;
    this.FilterSharesELN = this.sharesELN;
  }

  onClickedOutside(_e){
    console.log("outside..");
    this.showSearchShare = false;
    this.sharelistpopup = false;
    this.showSharePopup = false;
   
  }

  onClickedOutsideAmt(_e)
  {
  this.showAmountPopup = false;
  this.showSearchAmount = false;

  }

  priceELN(){

    console.log("PRICING PARAMETERS..", this.solveFor, this.upfront, this.selectedTenor, this.selectedCurrency, this.selectedShare, this.IBPrice, this.strike, this.ProductType)
    this.ProductType = this.ELNType;
    this.KOType = this.ProductType;
    if(this.KOType === "Simple"){
      this.KOType = "";
      this.KOPerc = 0.00.toFixed(2);
    }
    if(this.ProductType === "DAILY_CLOSE" || this.ProductType === "CONTINUOUS")
    {
      this.ProductType = "BARRIER";
    }

    console.log("PRICING PARAMETERS..", this.solveFor, this.upfront, this.selectedTenor, this.selectedCurrency, this.selectedShare, this.IBPrice, this.strike, this.ProductType, this.KOPerc, this.KOType)

  }



 

}
