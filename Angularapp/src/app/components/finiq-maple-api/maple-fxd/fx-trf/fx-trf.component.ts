import { Component, OnInit } from '@angular/core';
import { MapleAPIService } from '../../maple-api.service';

@Component({
  selector: 'app-fx-trf',
  templateUrl: './fx-trf.component.html',
  styleUrls: ['./fx-trf.component.scss']
})
export class FxTrfComponent implements OnInit {

  constructor(private mapleapi: MapleAPIService) { }

  xmlstring: any;
  currList = [];
  selectedCcy: any;
  DepoCcy: any;
  AltCcy: any;
  tenor: any;
  tileID: any;
  bidTRF: any;
  askTRF: any;
  FixingDateTRF: any;
  MaturityDateTRF: any;
  ValueDateTRF: any;
  tradeDate: any;
  notperFixing: any;

  depoccyFlag = true;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  ngOnInit(): void {

    this.selectedCcy = "EUR - USD";
    this.DepoCcy = "EUR";
    this.AltCcy = "USD";
    this.tenor = "6M";
    this.tileID = "103";
    this.notperFixing = "EUR";

    this.FormatDateAsFNQSTD();

    this.xmlstring = "<ExcelSheets><Sheet1><Product_Name>Vanilla</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><CustID>32162</CustID><Customer_Name>1007 Customer|32162</Customer_Name><Notional>1000000</Notional><OptionType>Put</OptionType><OptionCut>TOK</OptionCut><NonDeliveryYN>N</NonDeliveryYN><CcyPair>EUR - USD</CcyPair><AltCcy>USD</AltCcy><InvCcy>EUR</InvCcy><PremiumCcy>EUR</PremiumCcy><CustPrem>0</CustPrem><Tenor>3M</Tenor><PremiumDate>14-Oct-2021</PremiumDate><BuySell>Sell</BuySell><FixingDate>12-Jan-2022</FixingDate><TradeDate>12-Oct-2021</TradeDate><SettDate>14-Jan-2022</SettDate><TenorDays>92</TenorDays><Spotrate>1.1558</Spotrate><Strike>1.1558</Strike><LowerBarrier>0</LowerBarrier><UpperBarrier>0</UpperBarrier><Entity_ID>4</Entity_ID><CAI_ID>7400</CAI_ID><BarrierType>Vanilla</BarrierType><TemplateID>40245</TemplateID> </Sheet1></ExcelSheets>";

    this.mapleapi.maplegetccy("4","67","TEKO","FXOSEN","","Y","","","","TOK");
    this.mapleapi.ccyFXD.subscribe(res => {
      if(res!= "")
      {           
        let curr = res.Get_Ccy_PairsResult;
        // console.log("curr",curr);
        // console.log("length = ",Object.keys(curr).length);

        for(let i =0;i <Object.keys(curr).length; i++)
        {
          this.currList[i] = curr[i].Asset_Pair;
        }
        // console.log("Maple FXD currList = ",this.currList);
      }
    })

    // this.mapleapi.maplegetproddetails("fxoption");
    // this.mapleapi.prodDetails.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD product details = ",res);
    //   }
    // })

    this.mapleapi.maplegetdates(this.DepoCcy,this.AltCcy,this.selectedCcy,this.tradeDate,"00","4","1M","Monthly","Monthly","67","TEKO","FXOSEN","TOK","32",this.tileID);
    this.mapleapi.datesFXD.subscribe(res => {
      if(res!= "" && res[1] === "103")
      {           
        let dates = res[0].Get_FinIQ_CalculateDatesWrapperResult[0];
       
        this.FixingDateTRF = dates.FixingDate;
        this.MaturityDateTRF = dates.MaturityDate;
        this.ValueDateTRF = dates.ValueDate;

        console.log("Maple FXD DATES(Strategies) = ", this.FixingDateTRF,this.MaturityDateTRF,this.ValueDateTRF,res);
      }
    })

    // this.mapleapi.maplegetlplist("4","69","FXOSEN","Dealer","AUTO");
    // this.mapleapi.lpListFXD.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD lp list = ",res);
    //   }
    // })

    this.mapleapi.maplegetbidask(this.selectedCcy,"TEKO","FXOSEN",this.tileID);
    this.mapleapi.bidAskFXD.subscribe(res => {
      if(res!= "" && res[1] === "103")
      {           
        // console.log("Maple FXD bid ask (TRF) = ",res);
        let bidAskres = res[0].Get_FinIQ_BidAsk_WrapperResult;
        this.bidTRF = bidAskres.BidRate;
        this.bidTRF = Number(this.bidTRF).toFixed(4);
        this.askTRF = bidAskres.AskRate;
        console.log("Maple FXD bid ask(strategies) = ",this.bidTRF,this.askTRF);
      }
    })

     // this.mapleapi.maplegetprice("FXOption","EUR - USD","EUR","EUR","EUR","EUR","1000000","1000000","PREMIUM","Sell","Put","1.1558","0","0","","","","TOK","0","0","0.15","3M","12-Oct-2021","14-Oct-2021","12-Jan-2022","14-Jan-2022","N","N","CADBUser_923","4","","","","","","","true","","","Barclays:BNPP:Citi:GS:Leonteq:Nomura:RBS:SocGen:UBS","30","10","true","false","false","4","30","","","","",this.xmlstring,"true","VFXO","40245","27");
    // this.mapleapi.priceFXD.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD Price = ",res);
    //   }
    // })

    // this.mapleapi.maplebooktrade("4","CADBUser_923","140176","944624","GS","FXOption","0","","N","false","33");
    // this.mapleapi.bookTradeFXD.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD bookTradeFXD = ",res);
    //   }
    // })

    // this.mapleapi.mapleproductConfigs("4","70");
    // this.mapleapi.productConfigsFXD.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD product config = ",res);
    //   }
    // })

    // this.mapleapi.maplegetbusinessDates("4");
    // this.mapleapi.businessDatesFXD.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD business date = ",res);
    //   }
    // })

    // this.mapleapi.maplegetnooffixings("4","33","EUR - USD","360","EUR","USD","SGD","USD","TOK","Monthly","Monthly","12-Oct-2021","14-Oct-2021","","12-Apr-2022","14-Apr-2022","100000","32");
    // this.mapleapi.nooffixingsFXD.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD no of fixings = ",res);
    //   }
    // })

    // this.mapleapi.maplegetentity("Dealer1");
    // this.mapleapi.entityDataFXD.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD entity = ",res);
    //   }
    // })

  }

  changeTenor(event){

    this.tenor = event.target.value;
    console.log("Tenor =",this.tenor);
    // this.mapleapi.maplegetdates(this.DepoCcy,this.AltCcy,this.selectedCcy,this.tradeDate,"00","4",this.tenor,"Monthly","Monthly","27","FXOption","FXOSEN","TOK","32");
  }

  changeccyTRF(event){

    this.selectedCcy = event.target.value;
    console.log("selectCcy =",this.selectedCcy);
    let ccyArray = this.selectedCcy.split(" - ");
    this.DepoCcy = ccyArray[0];
    this.AltCcy = ccyArray[1];
    this.mapleapi.maplegetbidask(this.selectedCcy,"TEKO","FXOSEN",this.tileID);
    // this.mapleapi.maplegetdates(this.DepoCcy,this.AltCcy,this.selectedCcy,this.tradeDate,"00","4",this.tenor,"Monthly","Monthly","27","FXOption","FXOSEN","TOK","32");
  }

  FormatDateAsFNQSTD() {
    let Datestr:any = new Date();
    let dateArray = [];
    Datestr = JSON.stringify(Datestr);

    dateArray = Datestr.split('"');
    dateArray = dateArray[1].split('T');
    dateArray = dateArray[0].split('-');
    this.tradeDate = dateArray[2] + '-' + this.months[Number(dateArray[1] - 1)] + '-' + dateArray[0];
    console.log("trade date = ",this.tradeDate);
  }

  changenotperFixing(event){

    this.notperFixing = event.target.value;
    console.log("Not per fixing ",this.notperFixing);

    if(this.notperFixing === this.DepoCcy)
      this.depoccyFlag = true;
    else if(this.notperFixing === this.AltCcy)
      this.depoccyFlag = false;
  }
}
