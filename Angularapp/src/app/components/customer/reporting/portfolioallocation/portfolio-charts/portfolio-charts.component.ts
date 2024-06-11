import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { ThemeserviceService } from 'src/app/themeService/themeservice.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { PortfolioAnalyticsService } from 'src/app/services/portfolio-analytics.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChartService } from 'src/app/themeService/chart.service';

@Component({
  selector: 'app-portfolio-charts',
  templateUrl: './portfolio-charts.component.html',
  styleUrls: ['./portfolio-charts.component.scss'],
})
export class PortfolioChartsComponent implements OnInit {
  @Input() selectedportfolioData: any = [];
  // @Input() index: any;

  mode = '';
  // @Input() allocationtype: string  ;
  private is3D: boolean = false;
  colors: any;
  colorsCopy: any;

  @Input() get SwitchTo3DChart(): boolean {
    return this.is3D;
  }
  set SwitchTo3DChart(value: boolean) {
    this.is3D = value;
    if(this.is3D === true){
this.callportfolioholding();
    }
    
  }

  @Input()
  get allocationtype(): string {
    return this.mode;
  }
  set allocationtype(mode: string) {
    this.mode = (mode && mode.trim()) || '<no mode set>';
  }
  //Changes done by Alolika G on 10-02-2022 --START
  @Input() baseCCY: string;
  selectedRMCustomerDetails: {
    custName: string;
    custId: string;
    userName: string;
    cif: string;
  };
  cif: string;

  @Input() get CustomerDetails() {
    return this.selectedRMCustomerDetails;
  }
  set CustomerDetails(CustomerDetails) {
    this.selectedRMCustomerDetails = CustomerDetails;
    // this.username = this.selectedRMCustomerDetails?.userName;
    // this.custId = this.selectedRMCustomerDetails?.custId;
    // this.cif = this.selectedRMCustomerDetails?.cif;
    // console.log(this.selectedRMCustomerDetails);
  }
  //Changes done by Alolika G on 10-02-2022 --END

  // @Input() SwitchTo3DChart: boolean;
  pnlMode: boolean = false; // Changes done by Alolika G | 11-02-2022
  today: any;
  username: string;
  Customerid: string;
  CIF: string;
  portfolio: string;
  currency = '';
  cusotmerName = '';
  BarChart = 'BarChart';
  totalHoldings: any;
  portfolioData = [];
  holdings = [];
  folioName = [];
  facilityCode = [];
  performance = [];
  portfolioDetails = [];
  loader: boolean;
  selectedPortfolioDetails = [];
  totalPortfolioData = [];
  portfolioColumnNames = [];
  portfolioColorsArray: any[];
  userID: string;
  AUM: any;
  aum1: any;
  data = [];
  showPortfolio: boolean;
  bestPortfolio = [];
  worstPortfolio = [];
  isBestperf = false;
  pnl = 0;
  isprofit: boolean;
  noDataFlag: boolean;
  tab1Error = '';
  tab2Error = '';
  tab3Error = '';
  tab4Error = '';
  tab5Error = '';
  tab6Error = '';
  selectedfacilityCode = '';
  showRebalance = false;
  isLoading = false;
  portfoliopopflag = false;
  Selectedportfolio = '';
  popuperror = '';
  InvestmentObj = '';
  userType: any;
  // chartColors = [
  //   // '#5856D6', '#FF9500', '#FF3B30', '#AF52DE', '#34C759', '#007AFF', '#5AC8FA'
  //   '#F09639',
  //   '#F0654B',
  //   '#09B39C',
  //   '#5173B8',
  // ];
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
  TargetColors = [];
  CurrentColors = [];
  options = [];
  type = 'PieChart';
  // freecash = 0;
  pnlbestType = 'ColumnChart';
  pnlbestdata = [];
  pnlworstdata = [];
  columnNames5 = ['Year', 'Asia'];
  targetOptions = [];
  CurrentOptions = [];
  pnlbestoptions = {
    pieHole: 0.8,
    legend: 'none',
    width: '360',
    height: '240',
    colors: this.chartColors,
    tooltip: {
      isHtml: true,
    },
    pieSliceTextStyle: {
      color: 'black',
    },

    // chbh: a,
    hAxis: { direction: 1, slantedText: true, slantedTextAngle: 45 },
    //  chartArea: { left: 20, top: 20, width: '100%', height: '100%' }
  };
  crr: any;
  profile: any;
  allocationArray = [];
  targetAllocationData: any = [];
  targetAllocationData3D: any = [];
  targetAllocationColumnNames: any;
  targetAllocationOptions: any;
  columnChartOptions: any;
  columnChartData: any;
  columnNames: any;
  custId: any;
  totalPortfolioOptions = {
    width: '480',
    height: '45',
    pieHole: 0.8,
    // is3D: true,
    legend: { position: 'none' },
    // vAxis: {
    //   baselineColor: 'none',
    //   minValue: 0,
    //   gridlines: {
    //     color: 'transparent'
    //   }
    // },
    // hAxis: {
    //   title: '',
    //   baselineColor: 'none',
    //   ticks: [],
    //   gridlines: {
    //     color: 'transparent'
    //   }
    // },
    // gridlines: {
    //   color: 'none'
    // },
    title: 'Title',
    // titleTextStyle: {
    //   color: '333333',
    //   fontName: 'Arial',
    //   fontSize: 10
    // },
    // colors: ['#FFCBCB', '#DDF3F5', '#FDFD96'],
    colors: this.chartColors,
    tooltip: {
      trigger: 'both',
      isHtml: 'true',
    },
    chartArea: { left: 0, right: 0, width: '100%', height: '80%' },
  };

  collateralColorsArray = [
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
  // [
  //   '#1D3E53',
  //   '#254B62',
  //   '#476D7C',
  //   '#77ABB7',
  // ]; // ['#00a0FF', '#0079c1', '#1185ca', '#3da5e2', '#0679bd', '#0679bdcf'];
  exposureColorsArray = [
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
  isUserRM: boolean;

  assetAlloc = [];
  assetAlloc3D = []
  pnlAlloc = [];
  pnlAllocDesc = [];
  top5Bestpnl = [];
  top5Worstpnl = [];
  targetallocation = [];
  portfolioSecOBS: Subscription;

  // [
  // data : any[];
  constructor(
    private api: WorkflowApiService,
    private custApi: CustomerApiService,
    public cfs: CommonApiService,
    public ref: ChangeDetectorRef,
    public themeService: ThemeserviceService,
    public homeapi: HomeApiService,
    public pas: PortfolioAnalyticsService,
    public authApi: AuthService,
    public homeApi: HomeApiService,
    public router: Router,
    public chartService: ChartService, 
  ) {
    this.isprofit = false;
    this.today = '';
    this.noDataFlag = false;
    this.portfolioColorsArray = [
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
    // this.SwitchTo3DChart = false;
    // this.mode = 'TARGET';
  }


  ngOnInit(): void {
    //Added by Arsh P. on 27th-June-2022 || Start
    this.chartService.paletteEmitObs.subscribe((paletteres) => {
      if (!!paletteres) {
        let pallete = this.chartService.getPallete(paletteres);
        // console.log(paletteres, pallete.colors);
        this.colors = pallete.colors;
        console.log("colors", this.colors);
      }
    });
    //Added by Arsh P. on 27th-June-2022 || End

    if (this.authApi.UserType === 'RM') {
      this.isUserRM = true;
      this.username = sessionStorage.getItem('RMUser');
      this.custId = sessionStorage.getItem('RMCustID');
      this.cusotmerName = sessionStorage.getItem('RMCustName');
      // this.username = this.selectedRMCustomerDetails?.userName; //Changes done by Alolika G on 10-02-2022
      // this.custId = this.selectedRMCustomerDetails?.custId;
      // this.cif = this.selectedRMCustomerDetails?.cif;
    } else {
      this.isUserRM = false;
      this.username = this.authApi.UserName;
      this.custId = this.homeapi.CustomerId;
    }
    // alert(this.is3D);
    if (this.authApi.UserType === 'RM') {
      this.custId = sessionStorage.getItem('RMCustID');
    } else {
      this.custId = this.homeapi.CustomerId;
    }
    this.portfolioSecOBS = this.api.portfolioSecHoldingObserver.subscribe(
      (res) => {
      if (res.length !== 0) {
        this.selectedPortfolioDetails = res;
        this.selectedPortfolioDetails.forEach((e) => {
          e.CEHD_Pending_receive_Qty[0] = parseFloat(
            e.CEHD_Pending_receive_Qty[0]
          );
          e.CEHD_Pending_pay_Qty[0] = parseFloat(e.CEHD_Pending_pay_Qty[0]);
          e.CEHD_Available_Qty[0] = parseFloat(e.CEHD_Available_Qty[0]);
          e.CEHD_BUY_Settled_Avg_Price[0] = this.cfs.FormatNumberr(
            parseFloat(e.CEHD_BUY_Settled_Avg_Price[0])
          );
          e.CEHD_PledgedOut_Qty[0] = parseFloat(e.CEHD_PledgedOut_Qty[0]);
        });
        // console.log('Portfolio de', this.selectedPortfolioDetails);
        if (
          this.homeapi.RediretToHomeBuySellPledge !== '' &&
          this.homeapi.selectedPage === 'PORTFOLIO REPORT'
        ) {
          // this.portfoliopopflag = true;
          this.Selectedportfolio = this.homeapi.Selectedportfolio;
          this.selectedfacilityCode = this.homeapi.SelectedFacilityCode;
        }
        this.ref.detectChanges();
        this.isLoading = false;
        }
      }
    );
    //Added By Arsh P || Start || For back button triggering Rebalance
    // this.custApi.FacilityCodeOBS.subscribe((facCode) => {
    //   if (facCode && facCode.length > 0) {
    //     console.log('Observable Triggered', this.allocationArray);
    //     var index = null;
    //     for (let i = 0; i < this.allocationArray.length; i++) {
    //       if (this.allocationArray[i].FacilityCode.value == facCode) {
    //         index = i;
    //         break;
    //       }
    //     }
    //     this.showRebalance = true;
    //      this.portfName(this.allocationArray[index].PortfolioName.value);
    //   }
    // });
    this.callportfolioholding();
  }

  callportfolioholding() {
    this.allocationArray = [];
    this.targetAllocationData = [];
    this.targetAllocationData3D = [];
    this.portfolioDetails = this.selectedportfolioData;
    // console.log(this.portfolioDetails);
    this.totalPortfolioData = [];
    this.portfolioColumnNames = [];
    // this.targetallocation = [['', 0]];
    this.targetallocation = [];
    // console.log(this.CurrentOptions);
    this.custApi.GetPortfolioTargetAllocation(
        this.authApi.UserType !== 'RM'
          ? this.homeapi.CustomerId
          : sessionStorage.getItem('RMCustID'),
        this.portfolioDetails['FacilityCode']
      )
      .subscribe((res: any) => {
        if (res.length !== 0) {
          let data = res.TargetAllocation_PortfolioResponse.items;
          if (data.length !== 0) {
            this.TargetColors = [];
            this.targetallocation = [];
            // console.log(data)
            data.forEach((element) => {
              // console.log(element)
              if (element.Scheme_Name === 'MF') {
                element.Scheme_Name = 'Mutual Funds';
              }
              // this.targetallocation.push([
              //   element.Scheme_Name,
              //   parseFloat(element.BA_Allocation),
              // ]);

              switch (element.Scheme_Name.toString().toUpperCase()) {
                case 'CERTIFICATES':
                  this.TargetColors.push(this.chartColors[0]);
                  break;
                case 'ETFS':
                  this.TargetColors.push(this.chartColors[1]);
                  break;

                case 'FIXED INCOME':
                  this.TargetColors.push(this.chartColors[2]);
                  break;
                case 'MF':
                  this.TargetColors.push(this.chartColors[3]);
                  break;

                case 'MUTUAL FUNDS':
                  this.TargetColors.push(this.chartColors[3]);
                  break;
                case 'CASH':
                  this.TargetColors.push(this.chartColors[4]);
                  break;
                case 'FUTURES':
                  this.TargetColors.push(this.chartColors[5]);
                  break;
                case 'FX':
                  this.TargetColors.push(this.chartColors[6]);
                  break;
                case 'OPTIONS':
                  this.TargetColors.push(this.chartColors[7]);
                  break;
                case 'EQUITIES':
                  this.TargetColors.push(this.chartColors[8]);
                  break;
                default:
                  this.TargetColors.push(this.chartColors[9]);
                  break;
              }
            });
            data.forEach((element) => {
              this.targetAllocationData.push({
                title: element.Scheme_Name,
                value: parseFloat(element.BA_Allocation),
              });
              this.targetAllocationData3D.push([
                element.Scheme_Name,
                parseFloat(element.BA_Allocation)
              ])
            });
            // console.log(this.targetAllocationData)
            // this.targetAllocationData = this.targetallocation;
            // console.log(this.targetallocation);

            // console.log(this.TargetColors);
            // this.TargetColors.push(targetcolor);
            let options = {};
            options = {
              pieHole: 0.5,
              legend: {
                position: 'right',
                textStyle: {
                  color: '#fff',
                  fontSize: 14,
                },
              },
              tooltip: {
                trigger: 'both',
              },
              colors: this.colors,
              width: '360',
              height: '200',
              chartArea: {
                left: 10,
                top: 10,
                width: '100%',
                height: '100%',
                Margin: '0 auto',
              },
              pieSliceTextStyle: {
                color: 'black',
              },
              is3D: this.is3D,
            };
            this.targetOptions = [];
            this.targetOptions.push(options);
            console.log(this.targetOptions, this.colors);
          }
          // this.targetAllocationData = this.targetallocation;
          // this.ref.detectChanges();

        }
      });


    // this.totalPortfolioData.push('');
    this.portfolioDetails['AssetDetails'].forEach((pf, i) => {
      pf.box = this.portfolioColorsArray[i];
    });
    // console.log('Port', this.portfolioDetails);

    this.portfolioColumnNames.push('');

    this.assetAlloc = [];
    this.assetAlloc3D = [];
    this.targetAllocationData3D = [];
    this.pnlAlloc = [];
    this.pnlAllocDesc = [];
    this.top5Bestpnl = [];
    this.top5Worstpnl = [];
    this.AUM = this.portfolioDetails['TotalAUM'];
    this.pnl = this.portfolioDetails['TotalPnL'];
    this.InvestmentObj = this.portfolioDetails['InvestmentObjective'];
    this.portfolioColumnNames.push(
      this.portfolioDetails['FacilityCode'] +
      ' ' +
      this.portfolioDetails['TotalAUM'] +
      ' USD '
    );
    this.totalPortfolioData.push([
      this.portfolioDetails['PortfolioName'],
      parseFloat(this.portfolioDetails['TotalAUM']),
    ]); // Added by ketan S on 23Nov2021 Asked by Parikshit Sir
    this.CurrentColors = [];
    this.portfolioDetails['AssetDetails'].forEach((ele) => {
      // this.assetAlloc.push([ele.XAxisMember, Math.abs(ele.Holdings)]); //Maths.abs changes by Alolika G on 11-02-2022 as asked by Mohan P
      this.assetAlloc.push({
        title: ele.XAxisMember,
        value: parseFloat(ele.Holdings),
      });
      this.assetAlloc3D.push([
        ele.XAxisMember, parseFloat(ele.Holdings)
      ])
      // console.log("this.assetAlloc",this.assetAlloc)
      console.log("Asset Alloc 3D",this.assetAlloc3D);
      this.pnlAlloc.push([ele.XAxisMember, parseFloat(ele.UnRealizedPnL)]);
      this.pnlAllocDesc.push([ele.XAxisMember, parseFloat(ele.UnRealizedPnL)]);

      switch (ele.XAxisMember.toString().toUpperCase()) {
        case 'CERTIFICATES':
          this.CurrentColors.push(this.chartColors[0]);
          break;
        case 'ETFS':
          this.CurrentColors.push(this.chartColors[1]);
          break;

        case 'FIXED INCOME':
          this.CurrentColors.push(this.chartColors[2]);
          break;
        case 'MF':
          this.CurrentColors.push(this.chartColors[3]);
          break;

        case 'MUTUAL FUNDS':
          this.CurrentColors.push(this.chartColors[3]);
          break;
        case 'CASH':
          this.CurrentColors.push(this.chartColors[4]);
          break;
        case 'FUTURES':
          this.CurrentColors.push(this.chartColors[5]);
          break;
        case 'FX':
          this.CurrentColors.push(this.chartColors[6]);
          break;
        case 'OPTIONS':
          this.CurrentColors.push(this.chartColors[7]);
          break;
        case 'EQUITIES':
          this.CurrentColors.push(this.chartColors[8]);
          break;
        default:
          this.CurrentColors.push(this.chartColors[9]);
          break;
      }
    });

    this.pnlAlloc.sort(this.cfs.compareSecondColumnAsc);
    this.pnlAllocDesc.sort(this.cfs.compareSecondColumnDesc);
    console.log(this.assetAlloc);
    // console.log("pnlAlloc",this.pnlAlloc);
    this.pnlAlloc.forEach((pnla) => {
      if (this.top5Bestpnl.length < 5) {
        this.top5Bestpnl.push(pnla);
      }
    });
    this.pnlAllocDesc.forEach((pnld) => {
      if (this.top5Worstpnl.length < 5) {
        this.top5Worstpnl.push(pnld);
      }
    });
    let options = {};
    options = {
      pieHole: 0.5,
      legend: {
        position: 'right',
        textStyle: {
          color: '#fff',
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'both',
      },
      colors: this.colors,
      width: '360',
      height: '200',
      chartArea: {
        left: 10,
        top: 10,
        width: '100%',
        height: '100%',
        Margin: '0 auto',
      },
      pieSliceTextStyle: {
        color: 'black',
      },
      is3D: this.is3D,
    };
    this.CurrentOptions = [];
    this.CurrentOptions.push(options);
    let Assetoptions = {};
    Assetoptions = {
      pieHole: 0.5,
      // pieSliceText: 'none',

      legend: {
        // position: 'bottom',
        textStyle: {
          color: '#fff',
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'both',
      },
      colors: this.colors,
      // changed
      width: '350',
      height: '200',

      // changed
      // tooltip: {
      //   isHtml: true
      // },
      chartArea: {
        top: 10,
        bottom: 10,
        width: '100%',
        height: '100%',
        Margin: '0 auto',
      },
      pieSliceTextStyle: {
        color: 'black',
      },
      is3D: this.is3D,
      // colors: ['#d4ab8b', '#ccb6a6', '#c8936a', '#ba7845'],
    };
    this.options.push(Assetoptions);
    // this.fnSwitchTo3DChart();
    console.log('Alloc Array', this.allocationArray);
    // });
    // this.allocationArray.sort((a: any, b: any) => {
    //   return a.PortfolioName.value > b.PortfolioName.value
    //     ? 1
    //     : a.PortfolioName.value < b.PortfolioName.value
    //     ? -1
    //     : 0;
    // });
    // } else {
    //   this.noDataFlag = true;
    // }

    // if (window.innerWidth <= 1477) {
    //   this.options.width = '340';
    //   this.options.height = '180';
    // }
    // }
    // });

  }
  portfName(name) {
    this.cfs.setallocation(this.portfolioDetails, name);
    this.cfs.ScrollTo('page-content-container-popupRM', 'overlay', 'up');
    this.router.navigate(['/rebalance'], {
      queryParams: { portfolio: this.portfolioDetails['FacilityCode'] },
    });
  }

  showdetailsPopUp(d: boolean, folioName: string) {
    if (d === true) {
      // this.portfoliopopflag = true;
      this.Selectedportfolio = folioName;

      this.homeapi.RediretToHomeBuySellPledge = this.Selectedportfolio;

      this.homeapi.SelectedFacilityCode = this.selectedfacilityCode;
      this.homeapi.selectedPage = 'PORTFOLIO REPORT';
      this.api.getCustPortfolioSecurityHoldings(
        this.custId,
        this.selectedfacilityCode,
        this.baseCCY
      );
      //Changes done by Alolika G on 10-02-2022
      this.router.navigate(['/portfolioDetails'], {
        queryParams: {
          Selectedportfolio: this.Selectedportfolio,
            selectedfacilityCode: this.selectedfacilityCode,
            baseCCY: this.baseCCY,
          username: this.username,
          cif: this.isUserRM
            ? this.selectedRMCustomerDetails?.cif
            : this.homeApi.CIF,
          custId: this.isUserRM
            ? this.selectedRMCustomerDetails?.custId
            : this.homeApi.CustomerId,
        },
      });
    } else {
      this.portfoliopopflag = false;
    }
  }
  //Added By Shravan S
  //Start
  callPortfolioAnalytics(portfolio) {
    // console.log(portfolio);
    try {
      // this.pas.changePortfolio(portfolio);

      this.pas.selectedPortfolio = portfolio; //Added by Shravan S | 09-02-2022
    } catch (error) {
      console.log(error);
    }
  }
  //End

  getpnlMode(_i) {
    // Changes done by Alolika G on 11-02-2022
    if (this.pnlMode) {
        document.getElementById('pnlLabel').innerHTML = 'PnL (Best 5)';
    } else {
        document.getElementById('pnlLabel').innerHTML = 'PnL (Worst 5)';
    }


  }


}
