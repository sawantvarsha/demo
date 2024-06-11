import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FXLimitService } from 'src/app/services/fxlimit.service';
import { DatePipe, formatDate } from '@angular/common';
import { ApifunctionService } from '../../apifunction.service';

@Component({
  selector: 'app-fxlimit-trades',
  templateUrl: './fxlimit-trades.component.html',
  styleUrls: ['./fxlimit-trades.component.scss'],
})
export class FxlimitTradesComponent implements OnInit, OnChanges {
  @Input() Title: any;
  TradesData : any [];
  fromdate  : Date
  todate : Date

  FromDate: any;
  ToDate: any;

  errormsg: any;
  errormsgFlag: boolean;

  tradeLoader : boolean;

  noofRows : any;
  componentId: any;
  noTradesMsg : any;

  allccypairDetails : any[];
  ccyPointshiftDetails : any;
  constructor(private fxlimit : FXLimitService,
    public datePipe: DatePipe,
    private afs : ApifunctionService) { 
    this.fromdate = new Date();
    this.todate = new Date();
    this.FromDate = this.datePipe.transform(this.fromdate, 'dd-MMM-YYYY');
    this.ToDate = this.datePipe.transform(this.todate, 'dd-MMM-YYYY');
    this.errormsgFlag = false;
    this.noofRows = '50';
    this.componentId = Math.floor(Math.random() * 100000);
    this.noTradesMsg = 'No data found'
  }

  ngOnInit(): void {
    this.fxlimit.getCcyPairDetailsforAll().subscribe((res) => {
      if(res){
        console.log("ALL pair details", res);
        this.allccypairDetails=res.body;
        // this.ccyPointshiftDetails = this.allccypairDetails.forEach(element => {
        //   const item = {"Pair":element.Pair, "Pointshift":element.PointShift};
        //   return item;
        // });
        // this.ccyPointshiftDetails = this.allccypairDetails.map((p) => {
        //   return {"Pair":p.Pair, "PointShift":p.PointShift};
        // });

        
        console.log("pointshift details", this.ccyPointshiftDetails);

        if(this.Title == "Open Trades"){
          this.getOpenTrades();
        }else if(this.Title == "Historical Trades"){
          this.getHistoricalTrades();
        }else if(this.Title == "Recent Trades"){
          this.getLmitOrderRecentTrades();
        }
      }
    })
  }

  // UpdateLimitOrderData(){
  //   this.fxlimit.getLimitOrderBlotterData('FX Cash Order Workflow', 2082, 'TRADE', '1', this.FromDate, this.todate, '[OM_Status] LIKE \'%OPEN%\' or [OM_Status] LIKE \'%AMEND%\'', '10', 1).subscribe((res: any) => {
  //     console.log("Res", res)
  //   })
  // }

  ngOnChanges() : void {
    this.tradeLoader = true;
    if(this.Title == "Open Trades"){
      console.log("Open Trades");
      this.getOpenTrades();
    }else if(this.Title == "Historical Trades"){
      console.log("Histoical Trades");
      this.getHistoricalTrades();
    }else if(this.Title == "Recent Trades"){
      console.log("Recent Trades");
      // this.getLmitOrderRecentTrades();
      this.tradeLoader = false;
    }
  }

  getOpenTrades() {
    this.fxlimit
      .getOpenTradesforLimitOrder(this.FromDate, this.ToDate)
      .subscribe((res) => {
        if (res) {
          this.TradesData = res.getFXOrderDetails_SLTPResult;
          this.TradesData = this.TradesData.filter(
            (item) => item.ExecutionType == 'Limit'
          );
          console.log('open trades *****, ', this.TradesData);
          this.tradeLoader = false;
        }
      });
  }

  getHistoricalTrades() {
    this.fxlimit
      .getHistoricalTradesforLimitOrder(this.FromDate, this.ToDate)
      .subscribe((res) => {
        if (res) {
          this.TradesData = res.getHistoricalTradesResult;
          console.log('Historical trades *****, ', this.TradesData);
          // this.TradesData = this.TradesData.filter(item => item.ExecutionType=='Limit')
          this.TradesData.forEach(
            (item) =>
              (item.Trade_Date = formatDate(
                item.Trade_Date,
                'dd-MMM-yyyy',
                'en-US',
                '+0530'
              ))
          );
          this.tradeLoader = false;
        }
      });
  }

  getLmitOrderRecentTrades(){
    this.afs.getLimitOrderWorkflowBlotterData( //FXCash workflow not set. First set that then check for response
      'FX Cash Order Workflow',
      2082,
      'TRADE',
      '1',
      this.FromDate,
      this.ToDate,
      this.componentId,
      "[OM_Status] LIKE '%OPEN%' or [OM_Status] LIKE '%AMEND%' or [OM_Status] LIKE '%CANCEL%'",
      this.noofRows,
      1
    );
    this.afs.GetLimitOrderBlotterDataObserver.subscribe((res: any) => {
      if (res) {
        if (res.CallId === this.componentId) {
          // console.log("limit order blotter data",res);
          if (res.response !== undefined) {
            if(res.response.length==undefined){ //for single record in response
              this.TradesData[0] = res.response;
              this.noTradesMsg = ''; 
              this.tradeLoader = false;
            }else{
              this.TradesData = res.response;
              // console.log("loader", this.tradeLoader)
              this.noTradesMsg = ''; 
              this.tradeLoader = false;
            }
          } else {
            this.TradesData = [];
            console.log("data check", this.TradesData)
            this.noTradesMsg = 'No data found'
            this.tradeLoader = false;
          }
          // res.filter(r => ['OPEN', 'AMENDED'].includes((r.OM_Status + '').toUpperCase()));
          //console.log(this.workflowRecords);
          // this.afs.getCurrencyPairs();
        }
      } else {
        this.TradesData = [];
        this.noTradesMsg = 'Please contact support!'
        this.tradeLoader = false;
      }
    });
  }

  // EpochToDate(epochdate : any) {
  //   let idx1, idx2, s, dt, dt1;
  //   idx1 = epochdate.indexOf("("); 
  //   idx2 = epochdate.indexOf("+");
  //   if (idx1 > 0 && idx1 < idx2 && idx2 < epochdate.length) {
  //     s = epochdate.substring(idx1 + 1, idx2);
  //   }
  //   dt = new Date(parseFloat(s));
  //   dt1 = formatDate(dt, 'dd-MMM-yyyy HH:mm:ss a', 'en-US', '+0530');
  //   return dt1;
  // }

  refresh(){
    this.FromDate = this.datePipe.transform(this.fromdate, 'dd-MMM-YYYY');
    this.ToDate = this.datePipe.transform(this.todate, 'dd-MMM-YYYY');

    if (this.FromDate > this.ToDate) {
      this.errormsgFlag = true;
      this.errormsg = "* From date should not be greater than To date";
      setTimeout(() => {
        this.errormsgFlag = false;
        this.errormsg = '';
      }, 3000);
    } else {
      this.tradeLoader = true;
      
      this.noTradesMsg = '';
      this.TradesData = [];
      console.log("loader", this.tradeLoader, "msg", this.noTradesMsg)

      if(this.Title == "Open Trades"){
        this.getOpenTrades();
      }else if(this.Title == "Historical Trades"){
        this.getHistoricalTrades();
      }else if(this.Title == "Recent Trades"){
        this.getLmitOrderRecentTrades();
      }

      
    }
  }

  changeFromDate() {
    console.log('date validation');
  }

  formatStringtoDate(value: string) {
    return value
      ? formatDate(value.split("T")[0], "dd-MMM-yyyy", "en-US", "+0800")
      : "";
  }

}
