import { Component, OnInit } from '@angular/core';
import { MapleAPIService } from '../../maple-api.service';
import { CommonApiService } from 'src/app/services/common-api.service'

@Component({
  selector: 'app-ben',
  templateUrl: './ben.component.html',
  styleUrls: ['./ben.component.scss']
})
export class BENComponent implements OnInit {

  constructor(private mapleapi: MapleAPIService,  private commonapi : CommonApiService) { }

  
  currencyList : any;
  tenor_DRA : any = 6;

  shareList : any;
  sharesBEN : any;
  FilterSharesBEN : any;
  tenorBEN : any;
  showSharePopup = false;
  showSearchShare = false;
  sharelistpopup = false;
  selectedShare = "";
  basketArray = [];
  BasketSplit = ["AAPL.OQ", "AMZN.OQ", "IBM.N"];

  notional = "1,000,000.00"
  AmountArray = [];
  showAmountPopup = false;
  showSearchAmount = false;

  TradeDate = "";
  ValueDate = "";
  FixingDate = "";
  MaturityDate = "";
  DateResponse : any;

  selectedTenorBEN = "1W";
  settlementDays = "7";
  solveForBEN = "CONVERSION_STRIKE";
  StrikeBEN = 85.00.toFixed(2);
  IBPriceBEN = 99.00.toFixed(2);
  CouponBEN = 8.00.toFixed(2);

  KITypeBEN = "Vanilla";
  KIPercBEN = 65.00.toFixed(2);
  NonCall = 1;
  CouponFreq = "MONTHLY";
 
  
  ngOnInit(): void {

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

    this.mapleapi.mapleBasket();
    this.mapleapi.basket.subscribe(res => {
      if(res){
        console.log("Basket ...", res);
        this.basketArray = res;
      

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
        this.tenorBEN = res;
      }
    })
    

    this.mapleapi.mapleDates("5", "Mobile1", this.selectedShare, this.selectedTenorBEN, this.settlementDays, "");
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

  }

  fnShowSharePopup(basket){
    console.log("basket", basket)
    this.showSharePopup = !this.showSharePopup;
    this.BasketSplit = basket.split(",");
    console.log("split basket..", this.BasketSplit)
    
  }

  
  searchShare(event){
    let value = event.target.value;
    console.log("value..", value);

    let result = [];
    result = this.sharesBEN.filter((data) => {
      return data.LongName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    });
    this.FilterSharesBEN = result;
  }

  selectShareFromDropdown(event){
    console.log("", event)
    this.showSearchShare = false;
    this.sharelistpopup = false;
    this.showSharePopup = false;
    this.selectedShare = event.Code;
    this.FilterSharesBEN = this.sharesBEN;
  }

  removeShare(share){
    for (let i = 0; i < this.BasketSplit.length; i++) {
      if (this.BasketSplit[i] === share) {
        this.BasketSplit.splice(i, 1)
        console.log("Basket after remove",this.BasketSplit);
      }
    }
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

  changeTenor(){
    this.mapleapi.mapleDates("5", "Mobile1", this.selectedShare, this.selectedTenorBEN, this.settlementDays, "");
  }

}
