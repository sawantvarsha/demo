import { Component, OnInit } from '@angular/core';
import { MapleAPIService } from '../../maple-api.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

  constructor(private mapleapi: MapleAPIService) { }

  xml: any;
  currency = [];
  fxrate: any;
  FixingDate: any;
  MaturityDate: any;
  ValueDate: any;
  selectedCcy: any;
  tenor = [];
  tenorDepo: any;
  tradeDate: any;

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  ngOnInit(): void {

    this.selectedCcy = "USD";
    this.tenorDepo = "1W";
    
    this.xml = "<ExcelSheets><Cash_Adjustment><int_rate_fixed>0.59</int_rate_fixed><HEDGING_TYPE>Dynamic</HEDGING_TYPE><InterestPayFrequency>Semiannually</InterestPayFrequency><Tenor>3M</Tenor><InterestType>Compound Interest</InterestType><dDefaultRT>Fixed</dDefaultRT><DepositAmt>1000000.00</DepositAmt><Trade_Date>12-Oct-2021</Trade_Date><Maturity_Date>12-Jan-2022</Maturity_Date><Customer>DAIMOND| 32490</Customer><Currency>CAD</Currency><Portfolio>0302202001-S-SMF-1</Portfolio><CIF>0302202001</CIF><FDType>Short term</FDType></Cash_Adjustment></ExcelSheets>";

    this.FormatDateAsFNQSTD();

    this.mapleapi.mapledepositgetccy();
    this.mapleapi.depositccy.subscribe(res => {
      if(res!= "")
      {           
        // let currency = res.CurrencyMnemonic
        console.log("length = ",Object.keys(res).length,res);
        for(let i=0; i< Object.keys(res).length;i++)
        {
          this.currency[i] = res[i].CurrencyMnemonic;
        }
        console.log("Maple deposit get ccy = ",this.currency);
      }
    })

    this.mapleapi.mapledepositgetfxdrate(this.selectedCcy,"GLOBAL","182");
    this.mapleapi.depositfxdrate.subscribe(res => {
      if(res)
      {           
        this.fxrate = res.GetBoardRateResult;
        console.log("Maple deposit get fxd rate = ",this.fxrate);
      }
    })
    
    // this.mapleapi.mapleTenor();
    // this.mapleapi.tenor.subscribe(res => {
    //   if(res!= "")
    //   {
    //     for(let i=0; i< Object.keys(res).length;i++)
    //     {
    //       this.tenor[i] = res[i].Tenor;
    //     }
    //     console.log("Tenor = ",this.tenor);
    //   }
    // })

    // this.mapleapi.mapledepositgettenor("CAD","GLOBAL");
    // this.mapleapi.deposittenor.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple deposit get tenor = ",res);
    //   }
    // })

    // this.mapleapi.mapledepositsaveUCP(this.xml,"Omkar7","fixed_deposit");
    // this.mapleapi.depositsaveUCP.subscribe(res => {
    //   if(res)
    //   {           
    //     console.log("Maple deposit save UCP = ",res);
    //   }
    // })

    this.mapleapi.mapledepositdates(this.selectedCcy,"",this.tradeDate,"0","2","2","N","N","","4",this.tenorDepo,"2","1","fxoption","FXOSEN","TOK");
    this.mapleapi.depodate.subscribe(res => {
      if(res!= "")
      {           
        let dates = res.Get_FinIQ_CalculateDatesWrapperResult[0];

        this.FixingDate = dates.FixingDate;
        this.MaturityDate = dates.MaturityDate;
        this.ValueDate = dates.ValueDate;
        console.log("Maple deposit date calc = ",this.FixingDate,res);
      }
    })

  }

  changeCcyDeposit(event){
    this.selectedCcy = event.target.value;
    this.mapleapi.mapledepositgetfxdrate(this.selectedCcy,"GLOBAL","182");
    this.mapleapi.mapledepositdates(this.selectedCcy,"",this.tradeDate,"0","2","2","N","N","","4",this.tenorDepo,"2","1","fxoption","FXOSEN","TOK");
  }

  changetenorDeposit(event){
    this.tenorDepo = event.target.value;
    this.mapleapi.mapledepositdates(this.selectedCcy,"",this.tradeDate,"0","2","2","N","N","","4",this.tenorDepo,"2","1","fxoption","FXOSEN","TOK");
  }

  FormatDateAsFNQSTD() {
    let Datestr:any = new Date();
    let dateArray = [];
    Datestr = JSON.stringify(Datestr);
    // console.log("Datestr = ",Datestr,typeof(Datestr));

    dateArray = Datestr.split('"');
    dateArray = dateArray[1].split('T');
    dateArray = dateArray[0].split('-');
    // console.log("trade date = ",dateArray);
    this.tradeDate = dateArray[2] + '-' + this.months[Number(dateArray[1] - 1)] + '-' + dateArray[0];
    console.log("trade date = ",this.tradeDate);
  }

}
