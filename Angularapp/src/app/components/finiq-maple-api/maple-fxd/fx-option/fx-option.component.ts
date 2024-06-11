import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapleAPIService } from '../../maple-api.service';

@Component({
  selector: 'app-fx-option',
  templateUrl: './fx-option.component.html',
  styleUrls: ['./fx-option.component.scss']
})
export class FxOptionComponent implements OnInit , OnDestroy{

  constructor(private mapleApi: MapleAPIService) { }

  checked: boolean;
  currList = [];
  selected = "buy";
  xmlstring: any;
  FixingDate : any;
  ExpiryDate : any;
  MaturityDate: any;
  ValueDate : any;
  tenorFXO : any;
  bidFXO : any;
  askFXO : any;
  selectedCcy : any;
  DepoCcy : any;
  AltCcy : any;
  tileID: any;
  tenor= [];
  tradeDate: any;

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  ngOnInit(): void {

    this.tenorFXO = "1W";
    this.selectedCcy = "AUD - JPY";
    this.tileID = "100";
    this.DepoCcy = "AUD";
    this.AltCcy = "JPY";

    this.FormatDateAsFNQSTD();

    this.xmlstring = "<ExcelSheets><Sheet1><Product_Name>Vanilla</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><CustID>32162</CustID><Customer_Name>1007 Customer|32162</Customer_Name><Notional>1000000</Notional><OptionType>Put</OptionType><OptionCut>TOK</OptionCut><NonDeliveryYN>N</NonDeliveryYN><CcyPair>EUR - USD</CcyPair><AltCcy>USD</AltCcy><InvCcy>EUR</InvCcy><PremiumCcy>EUR</PremiumCcy><CustPrem>0</CustPrem><Tenor>3M</Tenor><PremiumDate>14-Oct-2021</PremiumDate><BuySell>Sell</BuySell><FixingDate>12-Jan-2022</FixingDate><TradeDate>12-Oct-2021</TradeDate><SettDate>14-Jan-2022</SettDate><TenorDays>92</TenorDays><Spotrate>1.1558</Spotrate><Strike>1.1558</Strike><LowerBarrier>0</LowerBarrier><UpperBarrier>0</UpperBarrier><Entity_ID>4</Entity_ID><CAI_ID>7400</CAI_ID><BarrierType>Vanilla</BarrierType><TemplateID>40245</TemplateID> </Sheet1></ExcelSheets>";
    this.mapleApi.maplegetccy("4","33","FXOptions","FXOSEN","","Y","","","","TOK");
    this.mapleApi.ccyFXD.subscribe(res => {
      if(res!= "")
      {           
        let curr = res.Get_Ccy_PairsResult;
        // console.log("currency = ",curr);
        // console.log("length = ",Object.keys(curr).length);

        for(let i =0;i <Object.keys(curr).length; i++)
        {
          this.currList[i] = curr[i].Asset_Pair;
          // this.currList.push({
          //   ccy : curr[i].Asset_Pair,
          //   depositccy : curr[i].Asset1,
          //   alternateccy : curr[i].Asset2
          // })
        }
        // console.log("Maple FXD currList(FXoptions) = ",this.currList);
      }
    })
  
    // this.mapleApi.maplegetproddetails("FXOption");
    // this.mapleApi.prodDetails.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD product details(FXoptions) = ",res);
    //   }
    // })

    this.mapleApi.maplegetdates(this.DepoCcy,this.AltCcy,this.selectedCcy,this.tradeDate,"00","4",this.tenorFXO,"Monthly","Monthly","27","FXOption","FXOSEN","TOK","32",this.tileID);
    this.mapleApi.datesFXD.subscribe(res => {
      if(res!= "" && res[1] === "100")
      {    
        // console.log("dates",res);
        let dates = res[0].Get_FinIQ_CalculateDatesWrapperResult[0];
       
        this.FixingDate = dates.FixingDate;
        this.MaturityDate = dates.MaturityDate;
        this.ValueDate = dates.ValueDate;

        console.log("Maple FXD DATES(FXoptions) = ", this.FixingDate,this.MaturityDate,this.ValueDate);
      }
    })
    
    // this.mapleApi.maplegetlplist("4","27","FXOSEN","Dealer","AUTO");
    // this.mapleApi.lpListFXD.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD lp list(FXoptions) = ",res);
    //   }
    // })

    this.mapleApi.maplegetbidask(this.selectedCcy,"FXOption","FXOSEN",this.tileID);
    this.mapleApi.bidAskFXD.subscribe(res => {
      if(res!= "" && res[1] === "100")
      {                   
        let bidAskres = res[0].Get_FinIQ_BidAsk_WrapperResult;
        console.log("res = ",res);
        this.bidFXO = bidAskres.BidRate;
        this.bidFXO = Number(this.bidFXO).toFixed(4);
        this.askFXO = bidAskres.AskRate;
        console.log("Maple FXD bid ask(FXoptions) = ",this.bidFXO,this.askFXO);

      }
    })

    this.mapleApi.mapleTenor();
    this.mapleApi.tenor.subscribe(res =>{
      if(res!="")
      {
        // console.log("tenor",res);
        // let tenorfx = res[0];
        for(let i =0;i <Object.keys(res).length; i++)
        {
          this.tenor[i] = res[i].Tenor;
        }
        console.log("tenor",this.tenor);
      }
    })

    // this.mapleApi.maplegetprice("FXOption","EUR - USD","EUR","EUR","EUR","EUR","1000000","1000000","PREMIUM","Sell","Put","1.1558","0","0","","","","TOK","0","0","0.15","3M","12-Oct-2021","14-Oct-2021","12-Jan-2022","14-Jan-2022","N","N","CADBUser_923","4","","","","","","","true","","","Barclays:BNPP:Citi:GS:Leonteq:Nomura:RBS:SocGen:UBS","30","10","true","false","false","4","30","","","","",this.xmlstring,"true","VFXO","40245","27");
    // this.mapleApi.priceFXD.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD Price = ",res);
    //   }
    // })

    // this.mapleApi.maplebooktrade("4","CADBUser_923","140176","944624","GS","FXOption","0","","N","false","33");
    // this.mapleApi.bookTradeFXD.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD bookTradeFXD = ",res);
    //   }
    // })

    // this.mapleApi.mapleproductConfigs("4","70");
    // this.mapleApi.productConfigsFXD.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD product config = ",res);
    //   }
    // })

    // this.mapleApi.maplegetbusinessDates("4");
    // this.mapleApi.businessDatesFXD.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD business date = ",res);
    //   }
    // })

    // this.mapleApi.maplegetnooffixings("4","33","EUR - USD","360","EUR","USD","SGD","USD","TOK","Monthly","Monthly","12-Oct-2021","14-Oct-2021","","12-Apr-2022","14-Apr-2022","100000","32");
    // this.mapleApi.nooffixingsFXD.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD no of fixings = ",res);
    //   }
    // })

    // this.mapleApi.maplegetentity("Dealer1");
    // this.mapleApi.entityDataFXD.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple FXD entity = ",res);
    //   }
    // })

  }

  changeTenorFXO(event){

    this.tenorFXO = event.target.value;
    console.log("Tenor =",this.tenorFXO);
    this.mapleApi.maplegetdates(this.DepoCcy,this.AltCcy,this.selectedCcy,this.tradeDate,"00","4",this.tenorFXO,"Monthly","Monthly","27","FXOption","FXOSEN","TOK","32",this.tileID);
  }

  changeCcypairFXOption(event){

    this.selectedCcy = event.target.value;
    console.log("In FX Option selectedCcy =",this.selectedCcy);
    let ccyArray = this.selectedCcy.split(" - ");
    this.DepoCcy = ccyArray[0];
    this.AltCcy = ccyArray[1];
    this.tileID = "100";
    this.mapleApi.maplegetbidask(this.selectedCcy,"FXOption","FXOSEN",this.tileID);
    this.mapleApi.maplegetdates(this.DepoCcy,this.AltCcy,this.selectedCcy,this.tradeDate,"00","4",this.tenorFXO,"Monthly","Monthly","27","FXOption","FXOSEN","TOK","32",this.tileID);
  }

  ngOnDestroy(): void {
    this.mapleApi.maplegetbidask(this.selectedCcy,"FXOption","FXOSEN","100");
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

}
