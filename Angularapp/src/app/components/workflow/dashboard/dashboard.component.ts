import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CustomerApiService } from '../../../services/customer-api.service';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  title = 'Portfolio Details';
  type = 'PieChart';
  data = [];
  isProd = environment.production;
  columnNames = ['Browser', 'Percentage'];

  width = document.documentElement.clientWidth;
  height = document.documentElement.clientWidth;
  // options={};
  chartColors = [
    '#dfc2e4',
    '#fbe19f',
    '#9ad3f0',
    '#bce4b1',
    '#ed7d31',
    '#a5a5a5',
    '#619010',
    '#388a90',
    '#6143b7',
    '#a3085f',
    '#85593d',
    '#878787',
    '#b19c0c',
  ];
  totalHoldings: any;
  portfolioData = [];
  holdings = [];
  folioName = [];
  facilityCode = [];
  performance = [];
  userID: string;
  pageName = 'Dashboard';
  options = {
    pieHole: 0.8,
    // pieSliceText: 'none',
    legend: { position: 'none' },
    colors: this.chartColors,
    width: '300',
    height: '200',
    chartArea: { left: 20, top: 20, width: '100%', height: '100%' },
    // colors: ['#d4ab8b', '#ccb6a6', '#c8936a', '#ba7845'],
  };

  areaTitle = '';
  areaType = 'AreaChart';
  areaData = [];
  areaColumnNames = ['Year', 'Sales'];
  areaOptions = {
    width: '350',
    height: '300',
    colors: this.chartColors,
  };
  view: any[] = [350, 350];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  datachart = [];

  colorScheme = {
    domain: this.chartColors,
  };
  // Asset alocation chart data 3
  assetAlocationtitle = 'PieChart';
  assetType = 'PieChart';
  assetOptions = {
    is3D: true,
    pieHole: 0.8,
    // pieSliceText: 'none',
    legend: { position: 'none' },
    width: '350',
    height: '200',
    colors: this.chartColors,

    chartArea: { left: 20, top: 20, width: '100%', height: '100%' },
  };

  title5 = '';
  pnlbestType = 'ColumnChart';
  pnlbestdata = [];
  pnlworstdata = [];
  columnNames5 = ['Year', 'Asia'];
  pnlbestoptions = {
    legend: 'none',
    width: '350',
    height: '300',
    colors: this.chartColors,
    hAxis: { direction: 1, slantedText: true, slantedTextAngle: 90 },
    // chartArea: { left: 20, top: 20, width: '400', height: '400' }
  };
  // assetOptions = {
  //   pieHole: 0.8,
  //   pieSliceText: 'none',
  //   legend: { position: 'labeled' },
  //   colors: ['#d4ab8b', '#ccb6a6', '#109618', '#DB4437'],
  //   backgroundColor: '#f5f5f5',
  //   width: '370',
  //   height: '200'
  // };

  Notification = false;
  Customerid: string;
  portfolio: string;
  CashHoldings = [];
  SecurityHoldings = [];
  assetTotal: any;
  portfolioDetails = [];
  showPortfolio: boolean;
  bestPortfolio = [];
  worstPortfolio = [];
  isBestperf = false;
  tab1Error = '';
  tab2Error = '';
  tab3Error = '';
  tab4Error = '';
  tab5Error = '';
  tab6Error = '';
  portfoliopopflag: boolean;
  currency = '';
  cusotmerName = '';
  custPortfolioPerformance = [];
  username: string;
  baseCCY: string;
  // eslint-disable-next-line max-len
  constructor(
    private api: WorkflowApiService,
    private router: Router,
    private afs: CustomerApiService,
    public cfs: CommonApiService
  ) {}

  ngOnInit(): void {
    // this.baseCCY = sessionStorage.getItem("BankBaseCcy");
    this.username = sessionStorage.getItem('Username');
    this.afs.getBankBaseCCYOBS.subscribe((ccy) => {
      this.baseCCY = ccy;

      this.afs.fngetCustAccountDetails(this.username);
    });

    this.afs.getCustAccountDetails.subscribe((res) => {
      if (res.length !== 0) {
        if (Object.keys(res).length === 0 && res.constructor === Object) {
        } else {
          this.Customerid = res.CustomerID;
          this.portfolio = res.portfolio;
          this.cusotmerName = res.misc1;
          this.currency = res.currency;
          this.api.getPorfolio(this.Customerid);
          this.api.getCustPortfolioSecurityHoldings(
            this.Customerid,
            this.portfolio,
            this.baseCCY
          );
          // this.api.getCustPortfolioCashHoldings(this.Customerid, this.portfolio);
          this.api.getPortfolioPerformanceDetails(
            this.Customerid,
            this.portfolio
          );
          this.api.getPnlAllPortfoliosWorst(this.Customerid, this.portfolio);
          this.api.getPnlAllPortfoliosBest(this.Customerid, this.portfolio);

          // this.api.getCustPortfolioPerformance(this.Customerid, this.portfolio);
        }
      }
    });

    // this.Customerid ="32852"
    // this.portfolio = "K3536853-S-SMF-1";
    // this.currency = "AUD";
    // this.cusotmerName ="AUUser2"
    // this.api.getPorfolio(this.Customerid);
    // this.api.getCustPortfolioSecurityHoldings(this.Customerid, this.portfolio);
    //       this.api.getCustPortfolioCashHoldings(this.Customerid, this.portfolio);
    //       this.api.getPortfolioPerformanceDetails(this.Customerid, this.portfolio);
    //       this.api.getPnlAllPortfoliosWorst(this.Customerid, this.portfolio);
    //       this.api.getPnlAllPortfoliosBest(this.Customerid, this.portfolio);

    // this.api.getCustPortfolioPerformance(this.Customerid, this.portfolio);

    this.api.Observerportfolio.subscribe((res) => {
      if (res.length !== 0) {
        this.tab1Error = '';
        this.totalHoldings = parseFloat(res[0].Holdings).toFixed(2);
        //  this.totalHoldings = this.convert(this.totalHoldings);
        //console.log(this.totalHoldings);
        this.portfolioData = [];
        this.holdings = [];
        this.folioName = [];
        this.facilityCode = [];
        for (let i = 1; i < res.length; i++) {
          this.portfolioData.push([
            res[i].PortfolioName,
            parseFloat(res[i].Holdings),
          ]);
          this.holdings.push(parseFloat(res[i].Holdings).toFixed(2));
          this.folioName.push(res[i].PortfolioName);
          this.facilityCode.push(res[i].CEHDF_Facility_Code);
        }
        this.data = this.portfolioData;
        this.showPortfolio = true;
      } else {
        this.showPortfolio = false;
        this.tab1Error = 'Data not available.';
      }
    });

    // 14july ChangeDetectionStrategy

    this.api.portfolioSecHoldingObserver.subscribe((res: any) => {
      if (res.length !== 0) {
        this.tab3Error = '';

        if (
          res.CustPortfolioSecurityHoldingsResponse
            .CustPortfolioSecurityHoldings
        ) {
          // eslint-disable-next-line max-len
          //console.log('secholding:', res.CustPortfolioSecurityHoldingsResponse.CustPortfolioSecurityHoldings[0].DCCustPortfolioSecurityHoldings);
          const result =
            res.CustPortfolioSecurityHoldingsResponse
              .CustPortfolioSecurityHoldings[0].DCCustPortfolioSecurityHoldings;
          this.SecurityHoldings = [];
          this.portfolioDetails = [];
          this.assetTotal = 0;

          for (let i = 0; i < result.length; i++) {
            this.SecurityHoldings[i] = [
              result[i].CEHD_Stock_Code[0],
              parseFloat(result[i].Market_Value_LCYE[0]),
            ];
            this.assetTotal =
              this.assetTotal + parseFloat(result[i].Market_Value_LCYE[0]);
            this.portfolioDetails.push(result[i]);
          }

          //console.log(this.SecurityHoldings);
        } else {
          this.tab3Error = 'Data not available.';
        }

        //console.log(this.SecurityHoldings);
      } else {
        //console.log('err: secholding');

        this.tab3Error = 'Data not available.';
      }
    });
    this.api.CustPortfolioCashHoldingsObserver.subscribe((res: any) => {
      if (res.length !== 0) {
        this.tab4Error = '';
        //console.log('cashholding:', res.CustPortfolioCashHoldingsResponse.CustPortfolioCashHoldings[0].DCCustPortfolioCashHoldings);
        const result =
          res.CustPortfolioCashHoldingsResponse.CustPortfolioCashHoldings[0]
            .DCCustPortfolioCashHoldings;
        this.CashHoldings = [];
        result.forEach((element) => {
          this.CashHoldings.push(element);
        });
      } else {
        this.tab4Error = 'Data not available.';
        //console.log('err: casholding');
      }
    });
    this.api.PortfolioPerformanceDetailsObserver.subscribe((res: any) => {
      if (res.length !== 0) {
        this.tab2Error = '';
        //console.log('performance details:', res.GET_PortfolioPerformance_DETAILS_RESTResult);

        const result = res.GET_PortfolioPerformance_DETAILS_RESTResult;
        this.performance = [];
        result.forEach((element) => {
          const date = this.epochtoFormatted(
            element.Record_Date.split('(')[1].split('+')[0].substring(0, 10)
          );
          // console.log(date);
          this.performance.push([date, element.PnL_Per]);
        });

        // areaData
      } else {
        this.tab2Error = 'Data not available.';
        //console.log('err: performance details');
      }
    });
    this.api.pnlportfoliosBestObserver.subscribe((res: any) => {
      if (res.length !== 0) {
        this.tab5Error = '';
        //console.log(res);
        this.bestPortfolio = res;
        // let pnlbestdata=[]
        this.bestPortfolio.forEach((element) => {
          this.pnlbestdata.push([
            element.FacDesc,
            parseFloat(element.UnRealizedPnL),
          ]);
        });
        this.datachart = [
          {
            name: this.pnlbestdata[0][0],
            value: this.pnlbestdata[0][1],
          },
          {
            name: this.pnlbestdata[1][0],
            value: this.pnlbestdata[1][1],
          },
          {
            name: this.pnlbestdata[2][0],
            value: this.pnlbestdata[2][1],
          },
        ];
        //console.log(this.pnlbestdata);
      } else {
        this.tab5Error = 'Data not available.';
      }
    });
    this.api.pnlportfoliosWorstObserver.subscribe((res: any) => {
      if (res.length !== 0) {
        this.tab5Error = '';
        //console.log(res);
        this.worstPortfolio = res;
        this.worstPortfolio.forEach((element) => {
          this.pnlworstdata.push([
            element.FacDesc,
            parseFloat(element.UnRealizedPnL),
          ]);
        });
        //console.log(this.pnlworstdata);
      } else {
        this.tab5Error = 'Data not available.';
      }
    });

    // this.api.CustPortfolioperformanceObserver.subscribe((res: any) => {
    //   if (res.length !== 0) {
    //     console.log(res.CustPortfolioPerformanceResponse.CustPortfolioPerformance[0].DCCustPortfolioPerformance[0]);
    //     this.custPortfolioPerformance = res.CustPortfolioPerformanceResponse.CustPortfolioPerformance[0].DCCustPortfolioPerformance[0];
    //     console.log(this.custPortfolioPerformance);
    //   }
    // });

    // this.api.getConfigValue('', 'bankbasecurrency');  // use real values
    // this.api.configValueObserver.subscribe((res: any) => {
    //   if (res.length !== 0) {
    //     console.log(res);
    //   }
    // });
  }
  callValidateUser() {
    this.router.navigate(['validateuser/2/' + this.userID]);
  }
  callAccountDetails() {
    this.router.navigate(['validateuser/3/' + this.userID]);
  }

  callOrderEntry() {
    this.router.navigate(['orderentry/' + this.userID]);
  }
  epochtoFormatted(utc) {
    const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utc);
    const dt = d.toString().split(' ');
    const mt = dt[2] + '-' + dt[1] + '-' + dt[3];
    console.log(mt);
    return mt;
  }

  convert(value) {
    let res;
    // if (this.baseCCY === 'INR'){
    //     if (value >= 10000000) {
    //     value = Math.round(parseFloat(value) / 10000000);
    //     res = value.toString() + 'Cr';
    //   }
    //   else if (value >= 100000) {
    //     value = Math.round(parseFloat(value) / 100000);
    //     res = value.toString() + 'L';
    //   }  else if (value >= 1000) {
    //     value = Math.round(parseFloat(value) / 1000);
    //     res = value.toString() + 'K';
    //   }
    // } else{

    if (value >= 1000000) {
      value = Math.round(parseFloat(value) / 1000000);
      res = value.toString() + 'M';
    } else if (value >= 1000) {
      value = Math.round(parseFloat(value) / 1000);
      res = value.toString() + 'K';
    }
    // }
    return res;
  }
  togglebestworst(s: string) {
    if (s === 'best') {
      this.isBestperf = true;
    } else {
      this.isBestperf = false;
    }
  }

  showdetailsPopUp(d: boolean, row: number) {
    if (d === true) {
      this.api.getCustPortfolioSecurityHoldings(
        this.Customerid,
        this.facilityCode[row],
        this.baseCCY
      );
      this.portfoliopopflag = true;
    } else {
      this.portfoliopopflag = false;
    }
  }

  SelectPieChartSlice(event) {
    const row = event.selection[0].row;
    this.api.getCustPortfolioSecurityHoldings(
      this.Customerid,
      this.facilityCode[row],
      this.baseCCY
    );
    // this.api.getCustPortfolioCashHoldings(this.Customerid, this.facilityCode[row]);
    this.api.getPortfolioPerformanceDetails(
      this.Customerid,
      this.facilityCode[row]
    );
    this.api.getPnlAllPortfoliosWorst(this.Customerid, this.facilityCode[row]);
    this.api.getPnlAllPortfoliosBest(this.Customerid, this.facilityCode[row]);
  }
}
