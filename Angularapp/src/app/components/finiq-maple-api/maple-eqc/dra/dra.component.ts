import { Component, OnInit } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { MapleAPIService } from '../../maple-api.service';

@Component({
  selector: 'app-dra',
  templateUrl: './dra.component.html',
  styleUrls: ['./dra.component.scss']
})
export class DRAComponent implements OnInit {

  constructor(private mapleapi: MapleAPIService, private commonapi : CommonApiService ) { }

  currencyList : any;
  tenor_DRA : any = 6;

  shareList : any;
  sharesDRA : any;
  FilterSharesDRA : any;
  tenor : any;
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

  selectedTenor = "1W";
  settlementDays = "7";
  solveForDRA = "CONVERSION_STRIKE";
  StrikeDRA = 85.00.toFixed(2);
  IBPriceDRA = 99.00.toFixed(2);
  CouponDRA = 8.00.toFixed(2);
  KOPercDRA = 105.00.toFixed(2);
  KOTypeDRA = "DAILY_CLOSE";
  KITypeDRA = "";
  KIPercDRA = 65.00.toFixed(2);
  NonCall = 1;
  CouponFreq = "MONTHLY";
  KOKIDropdown = "No KI / KO Daily Close";

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
        this.tenor = res;
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
    result = this.sharesDRA.filter((data) => {
      return data.LongName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    });
    this.FilterSharesDRA = result;
  }

  selectShareFromDropdown(event){
    console.log("", event)
    this.showSearchShare = false;
    this.sharelistpopup = false;
    this.showSharePopup = false;
    this.selectedShare = event.Code;
    this.FilterSharesDRA = this.sharesDRA;
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
  changeTenor(){
    this.mapleapi.mapleDates("5", "Mobile1", this.selectedShare, this.selectedTenor, this.settlementDays, "");
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

  changeKOKIType(){
  
    if(this.KOKIDropdown === "No KI / KO Daily Close"){
      // this.KIPercDRA = 0.00.toFixed(2);
      this.KITypeDRA = "";
      this.KOTypeDRA = "DAILY_CLOSE";
    }
    else if(this.KOKIDropdown === "No KI / KO Period End"){
      // this.KIPercDRA = 0.00.toFixed(2);
      this.KITypeDRA = "";
      this.KOTypeDRA = "American";
    }
    else if(this.KOKIDropdown === "KI Day Close / KO Daily Close"){
      this.KITypeDRA = "DAILY_CLOSE";
      this.KOTypeDRA = "DAILY_CLOSE";
    }
    else if(this.KOKIDropdown === "KI Day Close / KO Period End"){
      this.KITypeDRA = "DAILY_CLOSE";
      this.KOTypeDRA = "American";

    }
    else if(this.KOKIDropdown === "KI European / KO Daily Close"){
      this.KITypeDRA = "European";
      this.KOTypeDRA = "DAILY_CLOSE";

    }
    else if(this.KOKIDropdown === "KI European / KO Period End"){
      this.KITypeDRA = "European";
      this.KOTypeDRA = "American";
    }
   

    console.log("Selected KI KO::", this.KITypeDRA, this.KIPercDRA, this.KOPercDRA, this.KOTypeDRA);
  }

}
