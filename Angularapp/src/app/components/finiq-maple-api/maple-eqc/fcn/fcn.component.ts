import { Component, OnInit } from '@angular/core';
import { MapleAPIService } from '../../maple-api.service';
import * as shareList from '../../../../components/finiq-maple-api/EQCShareslist.json';
import { CommonApiService } from 'src/app/services/common-api.service';

@Component({
  selector: 'app-fcn',
  templateUrl: './fcn.component.html',
  styleUrls: ['./fcn.component.scss']
})
export class FCNComponent implements OnInit {

  constructor( private mapleapi: MapleAPIService, private commonapi : CommonApiService) { }

  currencyList : any;
  tenor_FCN : any = 6;
  shareList : any;
  sharesFCN : any;
  FilterSharesFCN : any;
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
  solveForFCN = "PRICE";
  StrikeFCN = 85.00.toFixed(2);
  IBPriceFCN = 99.00.toFixed(2);
  CouponFCN = 8.00.toFixed(2);
  KOPercFCN = 105.00.toFixed(2);
  KOTypeFCN = "DAILY_CLOSE";
  KITypeFCN = "";
  KIPercFCN = 65.00.toFixed(2);
  NonCall = 1;
  CouponFreq = "MONTHLY";
  KOKIDropdown = "No KI / KO Daily Close";


  ngOnInit(): void {

    this.sharesFCN = (shareList as any).default;
    console.log("share list from file", this.sharesFCN);
    this.FilterSharesFCN = this.sharesFCN;

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
    result = this.sharesFCN.filter((data) => {
      return data.LongName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    });
    this.FilterSharesFCN = result;
  }

  selectShareFromDropdown(event){
    console.log("", event)
    this.showSearchShare = false;
    this.sharelistpopup = false;
    this.showSharePopup = false;
    this.selectedShare = event.Code;
    this.FilterSharesFCN = this.sharesFCN;
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
    this.mapleapi.mapleDates("5", "Mobile1", this.selectedShare, this.selectedTenor, this.settlementDays, "");
  }

  changeKOKIType(){
    if(this.KOKIDropdown === "No KI / No KO"){
      // this.KOPercFCN = 0.00.toFixed(2);
      this.KOTypeFCN = "";
      // this.KIPercFCN = 0.00.toFixed(2);
      this.KITypeFCN = "";
    }
    else if(this.KOKIDropdown === "No KI / KO Daily Close"){
      // this.KIPercFCN = 0.00.toFixed(2);
      this.KITypeFCN = "";
      this.KOTypeFCN = "DAILY_CLOSE";
    }
    else if(this.KOKIDropdown === "No KI / KO Period End"){
      // this.KIPercFCN = 0.00.toFixed(2);
      this.KITypeFCN = "";
      this.KOTypeFCN = "American";
    }
    else if(this.KOKIDropdown === "KI Day Close / KO Daily Close"){
      this.KITypeFCN = "DAILY_CLOSE";
      this.KOTypeFCN = "DAILY_CLOSE";
    }
    else if(this.KOKIDropdown === "KI Day Close / KO Period End"){
      this.KITypeFCN = "DAILY_CLOSE";
      this.KOTypeFCN = "American";

    }
    else if(this.KOKIDropdown === "KI European / KO Daily Close"){
      this.KITypeFCN = "European";
      this.KOTypeFCN = "DAILY_CLOSE";

    }
    else if(this.KOKIDropdown === "KI European / KO Period End"){
      this.KITypeFCN = "European";
      this.KOTypeFCN = "American";
    }
    else if(this.KOKIDropdown === "KI Day Close / No KO"){
      this.KITypeFCN = "DAILY_CLOSE";
      this.KOTypeFCN = "";
      // this.KOPercFCN = "";

    }
    else if(this.KOKIDropdown === "KI European / No KO"){
      this.KITypeFCN = "European";
      this.KOTypeFCN = "";
      // this.KOPercFCN = "";

    }

    console.log("Selected KI KO::", this.KITypeFCN, this.KIPercFCN, this.KOPercFCN, this.KOTypeFCN);
  }


}
