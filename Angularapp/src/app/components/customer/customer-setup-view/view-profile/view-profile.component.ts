import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { ActivatedRoute } from '@angular/router';

export interface secdetails {
  custid: string;
  portfolio: string;
  pnl: number;
  holdings: number;
  code: string;
  isin: string;
  type: string;
  longname: string;
  invested: number;
}

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
})
export class ViewProfileComponent implements OnInit {
  @Input() clientDetails: any;

  // portfolios: any = ['62-S-SMF-2', '62-S-CUS-1']

  freecash: number;
  currency: any;
  noDataFlag: boolean;
  // Security Wise Holdings
  // mode: string = "ASSET";
  // Asset Wise Holdings
  mode: string = 'ASSETCLASS';
  mainTab: string;
  clientdetailsmode: string = 'ASSET';
  username: string;
  investedAmt: string;
  AUM: string;
  custcif: any;
  clientdetailsflag: boolean = false;
  returnsflag: boolean = true;

  // //Doughnut chart.
  type = 'PieChart';
  colors = ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'];
  chartColors = [
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
  options = {
    pieHole: 0.6,
    pieSliceText: 'none',
    backgroundColor: {
      fill: 'transparent',
    },

    legend: {
      position: 'right',
      alignment: 'center',
      textStyle: {
        color: 'white',
        fontSize: 14,
      },
    },

    tooltip: {
      trigger: 'both',
    },
    colors: this.chartColors,
    width: '600',
    height: '300',
    is3D: false,

    chartArea: {
      left: 80,
      top: 30,
      width: '70%',
      height: '80%',
      Margin: '0 auto',
    },
    pieSliceTextStyle: {
      color: 'white',
    },
  };
  columnNames = ['Name', 'Percentage'];

  //Barchart.
  Btype = 'BarChart';

  BcolumnNames = ['P&L', 'Assets'];
  Bwidth = 500;
  Bheight = 300;
  Boptions = {
    //chartArea: { backgroundColor: '#000000' },
    backgroundColor: {
      fill: 'transparent',
    },
    legend: {
      textStyle: {
        color: 'white',
        fontSize: 14,
      },
    },
    hAxis: {
      title: 'Year',
    },
    vAxis: {
      minValue: 0,
    },
    bars: 'horizontal',
    isStacked: false,
  };

  // options1 = {
  //   pieHole: 0.6,
  //   pieSliceText: 'none',
  //   backgroundColor: {
  //     fill: 'transparent',
  //   },

  //   legend: {
  //     position: 'right',
  //     alignment: 'center',
  //     textStyle: {
  //       color: 'white',
  //       fontSize: 14,
  //     },
  //   },

  //   tooltip: {
  //     trigger: 'both',
  //   },
  //   colors: this.chartColors,
  //   width: '600',
  //   height: '250',
  //   is3D: false,

  //   chartArea: {
  //     left: 80,
  //     top: 30,
  //     width: '70%',
  //     height: '80%',
  //     Margin: '0 auto',
  //   },
  //   pieSliceTextStyle: {
  //     color: 'white',
  //   },

  // };

  assetClassMap1: Map<string, Object>;
  assetAllocData1: any[] = [];
  assetPnLData1: any[] = [];
  assetClassMap: Map<string, Object>;
  assetAllocData: any[] = [];
  assetPnLData: any[] = [];
  totalreturns: any;
  portfoliopopflag: boolean = false;
  portfoliosec: any[] = [];
  portfoliosecdetails: any;
  customersecdetails: any[] = [];
  numport: any;

  assetClassMap2: Map<string, Object>;
  assetAllocData2: any[] = [];
  assetPnLData2: any[] = [];

  assetAllocDataC1: any[] = [];
  assetPnLDataC1: any[] = [];
  assetAllocDataC2: any[] = [];
  assetPnLDataC2: any[] = [];
  assetAllocDataC3: any[] = [];
  assetPnLDataC3: any[] = [];

  headers: any[] = [];
  data: any[] = [];
  ClientSummaryResult: any[];
  portfolios: any = [];
  bankBaseCCY: string;
  EQChart: boolean = true;
  MFChart: boolean = false;
  BondsChart: boolean = false;
  PMSChart: boolean = false;
  AIFChart: boolean = false;
  unformattedInv: any;
  unformattedAUM: any;

  constructor(
    public custapi: CustomerApiService,
    public api: WorkflowApiService,
    public authorApi: AuthService,
    public homeApi: HomeApiService,
    public cfs: CommonApiService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // console.log(this.clientDetails);
    this.bankBaseCCY = sessionStorage.getItem('BankBaseCcy');

    this.assetClassMap2 = new Map<string, Object>();
    this.assetAllocData2 = [];
    this.assetPnLData2 = [];
    this.assetClassMap1 = new Map<string, Object>();
    this.assetAllocData1 = [];
    this.assetPnLData1 = [];
    this.assetClassMap = new Map<string, Object>();
    this.assetAllocData = [];
    this.assetPnLData = [];
    this.customersecdetails = [];

    this.assetAllocDataC1 = [];
    this.assetPnLDataC1 = [];
    this.assetAllocDataC2 = [];
    this.assetPnLDataC2 = [];
    this.assetAllocDataC3 = [];
    this.assetPnLDataC3 = [];

    this.headers = ['Security', 'Name', 'Invested', 'Current Value', 'Returns'];
    this.data = [];

    this.mainTab = 'equity';

    //this.getClientSummary();

    if (this.clientDetails != '' && this.clientDetails != null) {
      // // console.log(this.clientDetails);
      this.username = this.clientDetails['UserLogin'];
      this.custcif = this.clientDetails['CIF'].toString();
      this.totalreturns = parseFloat(this.clientDetails['PnL']);
      this.unformattedInv =
        +this.clientDetails['AUM'] -
        +this.cfs.UnformatNumberwithoutevent(this.clientDetails['PnL']);
      this.unformattedAUM = this.cfs.UnformatNumberwithoutevent(
        String(this.clientDetails['AUM'])
      );
      this.AUM = this.cfs.FormatNumberwithoutevent(
        String(this.clientDetails['AUM'])
      );
      this.investedAmt = this.cfs.FormatNumberwithoutevent(
        String(this.unformattedInv)
      );
      // // console.log(this.investedAmt);
      if (this.username.length) {
        this.loadPortfolioClientDetails(this.username, this.custcif);
        this.loadPortfolioAllocation(this.username, this.custcif);
      }
    }
  }

  getClientSummary() {
    try {
      // console.log( this.authorApi.EntityID, this.authorApi.UserName,)
      this.api
        .GetClientSummary(
          this.authorApi.EntityID,
          this.authorApi.UserName,
          this.bankBaseCCY
        )
        .subscribe((res) => {
          if (res.length !== 0) {
            let data = [];
            data = JSON.parse(res.GetRMPortalClientSummary_LCYEResult);
            // console.log(data);
            this.ClientSummaryResult = data.sort((a, b) =>
              a.LongName > b.LongName ? 1 : -1
            );
            // console.log(this.ClientSummaryResult);
            this.clientDetails = this.ClientSummaryResult[0];
            // this.homeApi.CustomerMappedToRM = this.ClientSummaryResult;
          }
        });
    } catch (error) {}
  }

  loadPortfolioAllocation(username: string, cif: string) {
    this.freecash = 0;
    this.portfolios = [];
    // console.log( cif, username, this.mode === 'TARGET' ? 'ASSETCLASS' : this.mode, this.custapi.bankBaseCCY);
    this.homeApi
      .GetAUMandPNL(
        // this.homeApi.CIF || sessionStorage.getItem('RMCIF'),
        cif,
        username,
        this.mode === 'TARGET' ? 'ASSETCLASS' : this.mode,
        this.custapi.bankBaseCCY,
        null
      )
      .subscribe((resAUM) => {
        // // console.log(resAUM, "ASSETCLASS");
        if (resAUM.length !== 0) {
          let client = resAUM.ResponseBody.ClientWiseHoldings;
          this.currency = client.BaseCurrency;

          if (client !== null) {
            // // console.log(client);
            client['ClientwisePortfolioDetails'].forEach((portfolio) => {
              this.portfolios.push(portfolio['FacilityCode'].toString());
              // console.log(this.portfolios.length);
              portfolio['AssetDetails'].forEach((asset) => {
                if (
                  this.assetClassMap.get(asset['XAxisMember']) === undefined
                ) {
                  this.assetClassMap.set(asset['XAxisMember'], {
                    Holdings: +asset['Holdings'],
                    PnL: +asset['UnRealizedPnL'],
                  });
                } else {
                  var obj = this.assetClassMap.get(asset['XAxisMember']);
                  this.assetClassMap.set(asset['XAxisMember'], {
                    Holdings: obj['Holdings'] + +asset['Holdings'],
                    PnL: obj['PnL'] + +asset['UnRealizedPnL'],
                  });
                }
              });
            });

            if (this.portfolios.length > 0) {
              // console.log(this.portfolios.length, "PORTFOLIO_LENGTH")
              this.numport = this.portfolios.length;
              // console.log(this.portfolios, this.numport);
              this.portfolios.forEach((portfolio) => {
                this.loadDetailedHoldings(
                  this.clientDetails['CustomerID'].toString(),
                  portfolio,
                  this.custapi.bankBaseCCY
                );
              });
            }

            // // console.log(this.assetClassMap1);

            this.assetAllocData = [];
            this.assetPnLData = [];

            this.assetClassMap.forEach((value, key) => {
              this.assetAllocData.push({
                title: key,
                value: parseFloat(value['Holdings']),
              });
              this.assetPnLData.push([key, parseFloat(value['PnL'])]);
            });

            this.assetAllocData.push({
              title: 'PMS',
              value: parseFloat('6127000'),
            });
            this.assetPnLData.push(['PMS', parseFloat('1127000')]);

            this.assetAllocData.push({
              title: 'AIF',
              value: parseFloat('23700000'),
            });
            this.assetPnLData.push(['AIF', parseFloat('3700000')]);
            // // console.log(this.assetAllocData);
            // // console.log(this.assetPnLData);
          } else {
            this.noDataFlag = true;
          }
        }
      });

    //// console.log(this.portfolios);
  }

  loadPortfolioClientDetails(username: string, cif: string) {
    this.freecash = 0;
    this.homeApi
      .GetAUMandPNL(
        // this.homeApi.CIF || sessionStorage.getItem('RMCIF'),
        cif,
        username,
        this.clientdetailsmode === 'TARGET' ? 'ASSET' : this.clientdetailsmode,
        this.custapi.bankBaseCCY,
        null
      )
      .subscribe((resAUM) => {
        // // console.log(resAUM, "ASSET");
        if (resAUM.length !== 0) {
          let client = resAUM.ResponseBody.ClientWiseHoldings;
          this.currency = client.BaseCurrency;

          if (client !== null) {
            console.log(client, 'Client', 'ClD');
            client['ClientwisePortfolioDetails'].forEach((portfolio) => {
              portfolio['AssetDetails'].forEach((asset) => {
                if (
                  this.assetClassMap1.get(asset['XAxisMember']) === undefined
                ) {
                  this.assetClassMap1.set(asset['XAxisMember'], {
                    Holdings: +asset['Holdings'],
                    PnL: +asset['UnRealizedPnL'],
                  });
                } else {
                  var obj = this.assetClassMap1.get(asset['XAxisMember']);
                  this.assetClassMap1.set(asset['XAxisMember'], {
                    Holdings: obj['Holdings'] + +asset['Holdings'],
                    PnL: obj['PnL'] + +asset['UnRealizedPnL'],
                  });
                }
              });
            });

            // console.log(this.assetClassMap1, "ClD");

            this.assetAllocData1 = [];
            this.assetPnLData1 = [];

            this.assetClassMap1.forEach((value, key) => {
              this.assetAllocData1.push({
                title: key,
                value: parseFloat(value['Holdings']),
              });
              this.assetPnLData1.push([key, parseFloat(value['PnL'])]);
            });

            this.assetPnLData1 = this.sortPnL(this.assetPnLData1);

            // console.log(this.assetAllocData1, "ClD");
            // console.log(this.assetPnLData1, "ClD");
          } else {
            this.noDataFlag = true;
          }
        }
      });
  }

  toggleTab(flag: string) {
    this.mainTab = flag;
    // console.log(this.mainTab, this.numport, this.portfolios.length);

    if (this.numport === this.customersecdetails.length) {
      this.assetAllocData2 = [];
      this.assetPnLData2 = [];
      this.data = [];

      var tab;

      if (this.mainTab === 'equity') {
        tab = 'EQ';
        this.EQChart = true;
      } else if (this.mainTab === 'mutualfunds') {
        tab = 'UT';
        this.MFChart = true;
      } else if (this.mainTab === 'bonds') {
        tab = 'FI';
        this.BondsChart = true;
      } else if (this.mainTab === 'pms') {
        tab = 'PMS';
        this.PMSChart = true;
      } else if (this.mainTab === 'aif') {
        tab = 'AIF';
        this.AIFChart = true;
      }

      if (tab === 'AIF' || tab === 'PMS') {
        var sec_data = [];
        if (tab === 'PMS') {
          this.assetAllocData2.push({
            title: 'Ambit Coffee Can Portfolio',
            value: parseFloat('3212000'),
          });
          this.assetAllocData2.push({
            title: 'Emkay Capital Builder PMS',
            value: parseFloat('2915000'),
          });

          this.assetPnLData2.push([
            'Ambit Coffee Can Portfolio',
            parseFloat('712000'),
          ]);
          this.assetPnLData2.push([
            'Emkay Capital Builder PMS',
            parseFloat('415000'),
          ]);

          sec_data.push(
            'Ambit',
            'Ambit Coffee Can Portfolio',
            parseFloat('2500000').toFixed(2),
            parseFloat('3212000').toFixed(2),
            parseFloat('712000').toFixed(2),
            '28.48 %'
          );
          this.data.push(sec_data);
          sec_data = [];
          sec_data.push(
            'Emkay',
            'Emkay Capital Builder PMS',
            parseFloat('2500000').toFixed(2),
            parseFloat('2915000').toFixed(2),
            parseFloat('415000').toFixed(2),
            '16.60 %'
          );
          this.data.push(sec_data);

          this.headers = [
            'Security',
            'Name',
            'Invested',
            'Current Value',
            'Unrealized PnL',
            'Total Returns',
          ];

          // this.assetAllocDataC3 = this.assetAllocData2;
          // this.assetPnLDataC3 = this.assetPnLData2;

          this.assetAllocDataC3 = [];
          this.assetPnLDataC3 = [];
        } else if (tab === 'AIF') {
          this.assetAllocData2.push({
            title: 'Plutus High Yeild Convertible',
            value: parseFloat('11400000'),
          });
          this.assetAllocData2.push({
            title: 'ASK Real Estate Special Opportunities Fund - 2',
            value: parseFloat('12300000'),
          });

          this.assetPnLData2.push([
            'Plutus High Yeild Convertible',
            parseFloat('1400000'),
          ]);
          this.assetPnLData2.push([
            'ASK Real Estate Special Opportunities Fund - 2',
            parseFloat('2300000'),
          ]);

          sec_data.push(
            'Plutus',
            'Plutus High Yeild Convertible',
            parseFloat('10000000').toFixed(2),
            parseFloat('11400000').toFixed(2),
            parseFloat('1400000').toFixed(2),
            '14.00 %'
          );
          this.data.push(sec_data);
          sec_data = [];
          sec_data.push(
            'ASK',
            'ASK Real Estate Special Opportunities Fund - 2',
            parseFloat('10000000').toFixed(2),
            parseFloat('12300000').toFixed(2),
            parseFloat('2300000').toFixed(2),
            '23.00 %'
          );
          this.data.push(sec_data);

          this.headers = [
            'Security',
            'Name',
            'Invested',
            'Current Value',
            'Unrealized PnL',
            'Total Returns',
          ];

          // this.assetAllocDataC3 = this.assetAllocData2;
          // this.assetPnLDataC3 = this.assetPnLData2;

          this.assetAllocDataC3 = [];
          this.assetPnLDataC3 = [];
        }
      } else {
        // console.log(this.customersecdetails);
        this.customersecdetails.forEach((port) => {
          port['securities'].forEach((sec) => {
            var sec_data = [];
            if (sec['type'] === tab) {
              this.assetAllocData2.push({
                title: sec['longname'],
                value: parseFloat(sec['holdings']),
              });
              this.assetPnLData2.push([
                sec['longname'],
                parseFloat(sec['pnl']),
              ]);
              sec_data.push(
                sec['code'],
                sec['longname'],
                parseFloat(sec['invested']).toFixed(2),
                parseFloat(sec['holdings']).toFixed(2),
                parseFloat(sec['pnl']).toFixed(2)
              );
              this.data.push(sec_data);
              // // console.log(sec_data)
            }
          });
        });

        this.assetAllocDataC3 = this.assetAllocData2;
        this.assetPnLDataC3 = this.assetPnLData2;

        this.headers = [
          'Security',
          'Name',
          'Invested',
          'Current Value',
          'Returns',
        ];
      }

      // console.log(this.assetAllocDataC3, this.assetPnLDataC3, this.data, "Chart 3");
    }
  }

  async loadDetailedHoldings(
    CustomerId: string,
    Portfolio: string,
    baseCCY: string
  ) {
    var port;
    // console.log(CustomerId, Portfolio, baseCCY);
    // Portfolio = Portfolio.title
    this.api.getCustPortfolioSecurityHoldings(CustomerId, Portfolio, baseCCY);

    this.api.portfolioSecHoldingObserver.subscribe((res) => {
      // // console.log(res)
      this.portfoliosec = [];
      // console.log(res, "RES")

      if (res.length !== 0) {
        // console.log(res)
        res.forEach((security) => {
          let sec: secdetails = {
            custid: security['CEHD_Customer_ID'][0],
            portfolio: security['CEHD_Facility_Code'][0],
            code: security['CEHD_Stock_Code'][0],
            isin: security['ISIN'][0],
            longname: security['longName'][0],
            holdings: parseFloat(security['Market_Value_LCYE'][0]),
            pnl: parseFloat(security['CEHD_SELL_Settled_Avg_Price'][0]),
            type: security['TypeAsset'][0],
            invested: parseFloat(security['Capital_Invested'][0]),
          };
          this.portfoliosec.push(sec);
          this.portfoliosecdetails = {
            portfolio: security['CEHD_Facility_Code'][0],
            securities: this.portfoliosec,
          };
          port = security['CEHD_Facility_Code'][0];
        });
        console.log(this.portfoliosec, Portfolio, 'SECURITY_ARRAY');
        if (port === Portfolio) {
          // // console.log(this.portfoliosecdetails, "PORTFOLIO_DETAILS_1")
          this.customersecdetails.push(this.portfoliosecdetails);
          // console.log(this.customersecdetails, "CUSTOMER_DETAILS_1")
        }

        if (this.numport === this.customersecdetails.length) {
          // console.log(this.customersecdetails, "CUSTOMER_DETAILS_1")

          this.assetAllocData2 = [];
          this.assetPnLData2 = [];
          this.data = [];

          this.customersecdetails.forEach((port) => {
            port['securities'].forEach((sec) => {
              var sec_data = [];
              if (sec['type'] === 'EQ') {
                this.assetAllocData2.push({
                  title: sec['longname'],
                  value: parseFloat(sec['holdings']),
                });
                this.assetPnLData2.push([
                  sec['longname'],
                  parseFloat(sec['pnl']),
                ]);
                sec_data.push(
                  sec['code'],
                  sec['longname'],
                  parseFloat(sec['invested']).toFixed(2),
                  parseFloat(sec['holdings']).toFixed(2),
                  parseFloat(sec['pnl']).toFixed(2)
                );
                this.data.push(sec_data);
              }
            });
          });

          // // console.log(this.assetAllocData2, "ClD");
          // // console.log(this.assetPnLData2, "ClD");
          // this.assetAllocData.forEach((ele) =>
          //   ass
          // )
          this.assetAllocDataC1 = this.assetAllocData;
          this.assetAllocDataC2 = this.assetAllocData1;
          this.assetAllocDataC3 = this.assetAllocData2;

          this.assetPnLDataC1 = this.assetPnLData;
          this.assetPnLDataC2 = this.assetPnLData1;
          this.assetPnLDataC3 = this.assetPnLData2;

          console.log(this.assetAllocDataC1, this.assetPnLDataC1, 'Chart 1');
          console.log(this.assetAllocDataC2, this.assetPnLDataC2, 'Chart 2');
          console.log(this.assetAllocDataC3, this.assetPnLDataC3, 'Chart 3');
        }
      }
    });
  }

  sortPnL(assetdata: any) {
    assetdata.sort(function (a, b) {
      return a[1] - b[1];
    });
    console.log(assetdata);
    if (assetdata.length > 10) {
      var worst5 = assetdata.slice(0, 5);
      var top5 = assetdata.slice(Math.max(assetdata.length - 5, 5));

      assetdata = top5.concat(worst5);
      assetdata.sort(function (a, b) {
        return a[1] - b[1];
      });
      console.log(assetdata);

      return assetdata;
    } else {
      return assetdata;
    }
  }
}
