import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CustomerApiService } from 'src/app/services/customer-api.service';
// import { ExcelHandlerServiceService } from 'src/app/services/excel-handler-service.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { MatAccordion } from '@angular/material/expansion';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import * as moment from 'moment';
import { PortfolioAnalyticsService } from 'src/app/services/portfolio-analytics.service';
import { ThemeserviceService } from 'src/app/themeService/themeservice.service';
import { from, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { ChartSelectionChangedEvent } from 'angular-google-charts/lib/types/events';
import { GoogleChartComponent } from 'angular-google-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio-analytics',
  templateUrl: './portfolio-analytics.component.html',
  styleUrls: ['./portfolio-analytics.component.scss'],
})
export class PortfolioAnalyticsComponent implements OnInit, OnDestroy {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('searchInput')
  private searchInput: ElementRef;
  @ViewChildren('listTrigger')
  private listTrigger: QueryList<ElementRef>;
  tooltip: HTMLElement;
  tooltipTitle: string;
  delay = 500;
  mainTab: string = '';
  toggleFlag: boolean = true;
  searchBarString: string = '';
  Months = [
    'Jan',
    'Feb',
    'Mar',
    'APR',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  FromDate: any = '';
  ToDate: any = new Date();
  graphsTextColor = { color: '' };
  today: Date = new Date(this.ToDate);
  portfolioDetails: any = [];
  selectedPortfolio: any = null;
  showSearchResults: boolean[] = [false];
  customPortfolio = [];
  timeBasedStatisticsList = [
    {
      key: 'MTD',
      value: '-',
      startDate: new Date(new Date(this.today).setDate(1)),
      endDate: this.today,
    },
    {
      key: 'YTD',
      value: '-',
      startDate: new Date(
        new Date().setFullYear(this.today.getFullYear(), 0, 1)
      ),
      endDate: this.today,
    },
    {
      key: '1 YEAR',
      value: '-',
      startDate: this.subtractDaysFromDate(365),
      endDate: this.today,
    },
    {
      key: '3 YEAR',
      value: '-',
      startDate: this.subtractDaysFromDate(365 * 3),
      endDate: this.today,
    },
    {
      key: '5 YEAR',
      value: '-',
      startDate: this.subtractDaysFromDate(365 * 5),
      endDate: this.today,
    },
  ];
  performanceStatisticsList: any = [];
  pSLstartIndex: number = 0;
  notPercentageValues = [
    'SHARPE RATIO',
    'SORTINO RATIO',
    'BETA',
    'TRACKING ERROR',
    'UP CAPTURE RATIO',
    'DOWN CAPTURE RATIO',
  ];
  title = '';
  type = 'LineChart';
  data = [];
  columnNames = [];
  chartColors = [
    '#32B9FC',
    '#FFB700',
    '#ca0000',
    '#571CFF',
    '#16E6F5',
    '#D853EF',
    '#F0FF00',
    '#3AF507',
    '#DF007E',
    '#FF6300',
    '#00FFCD',
    '#FFE21F',
  ];
  chartColors2 = [
    '#007aff',
    '#34c759',
    '#5856d6',
    '#ff9500',
    '#ff2d55',
    '#af52de',
    '#ff3b30',
    '#5ac8fa',
    '#ffcc00',
  ];
  options: any = {
    legend: {
      textStyle: {
        color: this.graphsTextColor.color,
        fontSize: 12,
      },
    },
    interpolateNulls: true,
    curveType: 'function',
    titlePosition: 'none',
    hAxis: {
      // title: 'Dates',
      textStyle: { color: this.graphsTextColor.color },
      titleTextStyle: {
        color: this.graphsTextColor.color,
      },
      format: 'MMM yyyy',
      gridlines: {
        color: 'none',
      },
    },
    colors: this.chartColors,
    vAxis: {
      title: 'Prices',
      textStyle: { color: this.graphsTextColor.color },
      titleTextStyle: {
        color: this.graphsTextColor.color,
      },
      gridlines: {
        color: '#808080',
        count: 5,
      },
    },
    lineWidth: 2,
    backgroundColor: { fill: 'transparent' },
    titleTextStyle: {
      color: this.graphsTextColor.color,
    },
    tooltip: { isHtml: true },
    // colors: ['#dfc2e4', '#fbe19f', '#9ad3f0', '#bce4b1', '#ed7d31', '#a5a5a5', '#619010', '#388a90', '#6143b7', '#a3085f', '#85593d', '#878787', '#b19c0c'],
    chartArea: {
      left: '8%',
      top: '1%',
      width: '70%',
      height: '85%',
    },
  };
  width = 750;
  height = 475;
  Customerid: string;
  CIF: string;
  portfolio: string;
  customerName: string;
  allocationArray: any[];
  username: string;
  isUserRM: boolean;
  custId: string;
  selectedPortfolioDetails: any[] = [];
  currentTab: string = '';
  benchmarkSecurities: any[] = [];
  portfolioChecked: boolean = true;
  securityStatus: Array<boolean>;
  securityName: string = '';
  // portfolioDummySecurities: string[][] = [[" ULTRACEMCO.NS", "BAJFINANCE.NS", "GICRE.NS", "HDFC.NS", "HINDUNILVR.NS", "LUPIN.NS", "NTPC.NS"], ["RELI.NS","TITAN.NS", "KOTCADB", "ALLAFEG", "HDPMCDG", "SBIMADG", "HDFFSGD", "HDFCSDN", "UTINIFTETF.NS"], [' ULTRACEMCO.NS', "BAJFINANCE.NS", "TCS.NS", "TITAN.NS"]];
  selectedSecurities: string[] = [];
  benchmarkSecuritiesString: string = '';
  portfolioDisplayName: string = '';
  graphViewMin: number = null;
  graphViewMax: number = null;
  rollingOption1 = '50';
  rollingOption2 = '100';
  rollingOption3 = '150';
  rollingReturnsStatistics: any = [
    {
      key: 'period',
      value1: this.rollingOption1,
      value2: this.rollingOption2,
      value3: this.rollingOption3,
    },
    {
      key: 'Average',
      value1: '--',
      value2: '--',
      value3: '--',
    },
    {
      key: 'Volatility',
      value1: '--',
      value2: '--',
      value3: '--',
    },
    {
      key: 'high',
      value1: '--',
      value2: '--',
      value3: '--',
    },
    {
      key: 'low',
      value1: '--',
      value2: '--',
      value3: '--',
    },
  ];
  scenarioStatistics1: any = [
    {
      key: 'start date',
      value: '--',
    },
    {
      key: 'end date',
      value: '--',
    },
    {
      key: 'excess return',
      value: '--',
    },
    {
      key: 'correlation',
      value: '--',
    },
  ];
  scenarioStatistics2: any = [
    {
      key: '',
      value1: 'Portfolio',
      value2: 'Benchmark',
    },
    {
      key: 'return',
      value1: '--',
      value2: '--',
    },
    {
      key: 'volatility',
      value1: '--',
      value2: '--',
    },
  ];
  inBuiltScenarios = [];
  customScenarios = [];
  selectedScenario: string = '';
  isNewCustomScenario: boolean = false;
  customScenario = {
    name: '',
    fromDate: '',
    toDate: '',
  };
  secondGraphData = [];
  secondGraphType: string = 'BarChart';
  secondGraphHeight = 200;
  secondGraphWidth = 770;
  secondGraphColumns: any[];
  secondGraphOptions: any;
  secondGraphTitle: string = '';
  drawdownDetails = [];
  fetchedSecurities: any = [];
  sourceOfInvestmentList: any = [];
  securityExposureList: any = [];
  securityExposureFilteredList: any = [];
  assetClassExposureList: any = [];
  displayedSourceOfInvestment: number = null;
  currentSOIlist: any = [];
  graphSettings: any = {
    contributions: [
      {
        sectionName: 'Contributions',
        title: 'Contribution to Return',
        height: 300,
        width: 800,
        data: [],
        columnNames: ['Securities', 'Contributions'],
        type: 'BarChart',
        options: {
          legend: {
            textStyle: {
              color: this.graphsTextColor.color,
              fontSize: 12,
            },
            position: 'none',
          },
          orientation: 'horizontal',
          titlePosition: 'none',
          hAxis: {
            title: 'Securities',
            textStyle: { color: this.graphsTextColor.color },
            titleTextStyle: {
              color: this.graphsTextColor.color,
            },

            gridlines: {
              color: 'none',
            },
          },
          colors: this.chartColors,
          vAxis: {
            title: 'Contributions',
            textStyle: { color: this.graphsTextColor.color },
            format: "#'%'",
            titleTextStyle: {
              color: this.graphsTextColor.color,
            },
            gridlines: {
              color: '#808080',
              count: 5,
            },
          },
          lineWidth: 2,
          backgroundColor: { fill: 'transparent' },
          titleTextStyle: {
            color: this.graphsTextColor.color,
          },
          tooltip: { isHtml: true },
          // colors: ['#dfc2e4', '#fbe19f', '#9ad3f0', '#bce4b1', '#ed7d31', '#a5a5a5', '#619010', '#388a90', '#6143b7', '#a3085f', '#85593d', '#878787', '#b19c0c'],
          chartArea: {
            left: '15%',
            top: '5%',
            width: '75%',
            height: '70%',
          },
        },
      },
      {
        sectionName: 'Performance',
        title: 'Individual Performance',
        height: 260,
        width: 1100,
        columnNames: ['Dates', 'Rebased Prices'],
        type: 'LineChart',
        options: {
          legend: {
            textStyle: {
              color: this.graphsTextColor.color,
              fontSize: 12,
            },
            // position: 'none'
          },
          curveType: 'function',
          titlePosition: 'none',
          interpolateNulls: true,
          hAxis: {
            // title: 'Dates',
            textStyle: { color: this.graphsTextColor.color },
            titleTextStyle: {
              color: this.graphsTextColor.color,
            },
            format: 'MMM yyyy',
            gridlines: {
              color: 'none',
            },
          },
          colors: this.chartColors,
          vAxis: {
            title: 'Prices',
            textStyle: { color: this.graphsTextColor.color },
            titleTextStyle: {
              color: this.graphsTextColor.color,
            },
            gridlines: {
              color: this.graphsTextColor.color,
              count: 2,
            },
          },
          lineWidth: 2,
          backgroundColor: { fill: 'transparent' },
          titleTextStyle: {
            color: this.graphsTextColor.color,
          },
          tooltip: { isHtml: true },
          // colors: ['#dfc2e4', '#fbe19f', '#9ad3f0', '#bce4b1', '#ed7d31', '#a5a5a5', '#619010', '#388a90', '#6143b7', '#a3085f', '#85593d', '#878787', '#b19c0c'],
          chartArea: {
            left: '7%',
            top: '2%',
            width: '75%',
            height: '83%',
          },
        },
      },
    ],
    assetAllocation: [
      {
        sectionName: 'Asset Classwise Exposure',
        title: 'Asset Classwise Exposure',
        height: 275,
        width: 450,
        data: [],
        columnNames: ['Asset Classes', 'Exposures(%)'],
        type: 'PieChart',
      },
      {
        sectionName: 'DEBT EQUITY RATIO',
        title: 'Debt Equity Ratio',
        height: 275,
        width: 450,
        data: [],
        columnNames: ['Asset Classes', 'Exposures(%)'],
        type: 'PieChart',
      },
      {
        sectionName: 'EQUITY MARKET CAP EXPOSURE - TOTAL',
        title: 'Equity Market Cap Exposure - Total',
        height: 275,
        width: 450,
        data: [],
        columnNames: ['Asset Classes', 'Exposures(%)'],
        type: 'PieChart',
      },
      {
        sectionName: 'EQUITY MARKET CAP EXPOSURE - EQ',
        title: 'Equity Market Cap Exposure - EQ',
        height: 275,
        width: 450,
        data: [],
        columnNames: ['Asset Classes', 'Exposures(%)'],
        type: 'PieChart',
      },
    ],
  };
  sourceOfContributions: any[] = [];
  selectedSoC: number = null;
  assetAllocationGraphOption: any = {
    legend: {
      // position: 'labeled',
      alignment: 'start',
      textStyle: {
        color: this.graphsTextColor.color,
        fontSize: 10,
      },
    },
    titlePosition: 'none',
    backgroundColor: { fill: 'transparent' },
    chartArea: {
      left: '15%',
      top: '2%',
      width: '100%',
      height: '100%',
    },
    enableInteractivity: true,
    fontSize: 10,
    height: 275,
    width: 450,
    is3D: true,
    pieHole: 0.5,
    pieSliceText: 'percentage',
    title: '',
    tooltip: { isHtml: true },
    colors: this.chartColors,
  };
  eqMarketCapGraphs = [
    {
      key: 'Equity Market Cap Exposure - Total',
      value: 2,
    },
    {
      key: 'Equity Market Cap Exposure - EQ',
      value: 3,
    },
  ];
  selectedEqMCG = 2;
  assetAllocationgraphs = [];
  isModelPortfolio: boolean = false;
  modelPortfolioSecurities: any = [
    {
      securityName: '',
      code: '',
      weight: '',
      displaySearch: false,
    },
  ];
  compositeIndexSecurities: any = [
    {
      securityName: '',
      code: '',
      weight: '',
      displaySearch: false,
    },
  ];
  assetAllocationFilter = {
    filterType: null,
    filter: null,
  };
  selectedAAG: number = null;
  linkIndex = -1;
  ClientAllocObserversubscription = null;
  portfolioDetailsObserverSubscription = null;
  getCustAccountDetailsSubscription = null;
  portfolioDataSubscription = null;
  portfolioSecHoldingObserverSubscription = null;
  themeServiceObsSubscription = null;
  references = [
    {
      key: 'ALPHA',
      value:
        'The excess return of an investment relative to the return of a benchmark index. \n The investment has earned: \n < 0% - too little for its risk \n = 0% - a return adequate for the risk taken \n > 0% - return in excess of the reward for the assumed risk',
    },
    {
      key: 'BETA',
      value:
        'Measure of the volatility or systematic risk of a security or portfolio compared to the market as a whole. \n < 0 - Inversely correlates with Market \n < 1 - Less volatile than Market \n = 1 - Strongly correlates with Market \n > 1 - More volatile than Market',
    },
    {
      key: 'SHARPE RATIO',
      value: `Measure of risk-adjusted return of a financial portfolio. \n < 1 - Sub-optimal \n > 1 - Acceptable to Good \n > 2 - Very Good \n > 3 - Excellent`,
    },
    {
      key: 'SORTINO RATIO',
      value:
        "Ratio of asset or portfolio's return subtracted by the risk-free rate and the asset's downside deviation. \n < 1 - Sub-optimal \n > 1 - Acceptable to Good \n > 2 - Very Good \n > 3 - Excellent",
    },
    {
      key: 'MTD',
      value:
        'Period starting at the beginning of the current calendar month and ending at the current date.',
    },
    {
      key: 'YTD',
      value:
        'Period of time beginning the first day of the current calendar year or fiscal year up to the current date.',
    },
    // {
    //   key: "1 YEAR",
    //   value: ""
    // },
    // {
    //   key: "3 YEAR",
    //   value: ""
    // },
    // {
    //   key: "5 YEAR",
    //   value: ""
    // },
    {
      key: 'CAGR',
      value:
        'Annualized average rate of revenue growth between two given years, assuming growth takes place at an exponentially compounded rate.',
    },
    {
      key: 'ANNUAL RETURN',
      value:
        'A measure of how much an investment has increased on average each year, during a specific time period',
    },
    // {
    //   key: "ANNUAL VOLATILITY",
    //   value: ""
    // },

    // {
    //   key: "HISTORICAL 95 % ANNUAL VaR ",
    //   value: ""
    // },
    // {
    //   key: "IMPLIED 95 % ANNUAL VaR ",
    //   value: ""
    // },
    {
      key: 'TRACKING ERROR',
      value:
        'Divergence between the price behavior of a position or a portfolio and the price behavior of a benchmark',
    },
    {
      key: 'INFORMATION RATIO',
      value:
        'Measurement of portfolio returns beyond the returns of a benchmark, usually an index, compared to the volatility of those returns',
    },
    {
      key: 'UP CAPTURE',
      value:
        "Statistical measure of an investment manager's overall performance in up-markets",
    },
    {
      key: 'DOWN CAPTURE',
      value:
        "Statistical measure of an investment manager's overall performance in down-markets",
    },
  ];
  isLoader: boolean = true;
  error: {
    flag: boolean;
    message: string;
  } = null;
  securityMisMatchFLag: boolean = false;
  isRollingStatisticsError: boolean;
  isDrawdownsError: boolean;
  assetAllocFlags: boolean[] = [false, false, false, false];
  isSecuritiesExposureError: boolean;
  isSOIerror: boolean;
  isContributionError: boolean;
  isContPerfError: boolean;
  isRollingGraphError: boolean;
  isCumulativeReturnsError: boolean;
  exchangeDetails: any;
  selectedExchange: any;
  cummulativeReturnsData: Map<string, Array<any>>;
  isAddNewMP: boolean = false;
  newMPdetails: any[];
  newMPName: string = '';
  newCIName: string = '';
  modelPortfolioFlag: string;
  modelPortfolioList: any[] = [];
  clientDetails: any = null;
  prevSelectedEx: any;
  allModelPortfolioDetails: any;
  isSelectedMPView: boolean = false;
  isSelectedMPEdit: boolean = false;
  selectedMP: string = '';
  indicesList: any[] = [];
  selectedIndices: any;
  isCompositeIndex: boolean = false;
  isAddNewCI: boolean;
  isSelectedCIEdit: boolean;
  isSelectedCIView: boolean;
  compositeIndexList: any[] = [];
  allCustomIndicesDetails: any;
  selectedCI: any;
  newCIdetails: any[];
  compositeIndexFlag: string;
  isperfLoader: boolean = false;
  hRatio: number;
  swRatio: number;
  baseCCY: string;

  constructor(
    private renderer: Renderer2,
    private portfolioAnalyticsService: PortfolioAnalyticsService,
    private afs: CustomerApiService,
    public homeapi: HomeApiService,
    private api: WorkflowApiService,
    public cfs: CommonApiService,
    public ngxXml2jsonService: NgxXml2jsonService,
    public themeService: ThemeserviceService,
    public router: Router
  ) {
    this.exchangeDetails = [
      {
        label: 'Nifty 50',
        value: 'Nifty 50',
      },
      {
        label: 'S&P500',
        value: 'SNP500',
      },
    ];
    this.selectedExchange = 'Nifty 50';
    this.prevSelectedEx = this.selectedExchange;
    this.cummulativeReturnsData = new Map<string, Array<any>>();
  }

  @HostListener('window:resize')
  onWindowResize() {
    // console.log(this.height, window.innerHeight, 'HEIGHT');
    this.height = window.innerHeight * this.hRatio;
    this.width = window.innerWidth * this.swRatio;
    // console.log(this.height, window.innerHeight, 'HEIGHT');

    this.graphSettings.contributions[0].height =
      window.innerHeight * this.hRatio;
    this.graphSettings.contributions[0].width =
      window.innerWidth * this.swRatio;
    this.graphSettings.contributions[1].height =
      window.innerHeight * this.hRatio;
    this.graphSettings.contributions[1].width =
      window.innerWidth * 1.35 * this.swRatio;
    console.log(this.graphSettings.contributions);

    this.assetAllocationgraphs[0].height = this.roundTo(
      window.innerHeight * this.hRatio,
      0
    );
    this.assetAllocationgraphs[0].width = this.roundTo(
      window.innerWidth * this.swRatio,
      0
    );
    this.assetAllocationgraphs[1].height = window.innerHeight * this.hRatio;
    this.assetAllocationgraphs[1].width = window.innerWidth * this.swRatio;
    this.assetAllocationgraphs[2].height = window.innerHeight * this.hRatio;
    this.assetAllocationgraphs[2].width = window.innerWidth * this.swRatio;
    console.log(this.assetAllocationgraphs);
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    try {
      // console.log(this.height, window.innerHeight, 'HEIGHT');
      this.clientDetails = null;
      // console.log(this.today);
      this.isperfLoader = true;
      this.isLoader = true;
      this.themeServiceObsSubscription =
        this.themeService.themeEmitObs.subscribe((themeres) => {
          console.log(themeres);
          if (themeres == 'dark') {
            this.graphsTextColor.color = 'white';
          } else {
            this.graphsTextColor.color = 'black';
          }
          var options = [...[this.options]][0];
          this.options = this.changeGraphColors(options);
          options = [...[this.graphSettings.contributions[0].options]][0];
          this.graphSettings.contributions[0].options =
            this.changeGraphColors(options);
          this.graphSettings.contributions[0].options.vAxis.gridlines.count = 3;
          options = [...[this.graphSettings.contributions[1].options]][0];
          this.graphSettings.contributions[1].options =
            this.changeGraphColors(options);
          this.graphSettings.contributions[1].options.vAxis.gridlines.count = 3;
          options = [...[this.assetAllocationGraphOption]][0];
          this.assetAllocationGraphOption = this.changeGraphColors(options);
        });
      this.mainTab = 'current-portfolio';
      this.isAddNewMP = false;
      this.isAddNewCI = false;
      // this.generateCustomTooltip({date: "12-Dec-2020", day: "50", value: "0.217"}, "rolling");
      this.FromDate = moment(this.subtractDaysFromDate(365)).format(
        'DD-MMM-YYYY'
      );
      this.ToDate = moment(new Date()).format('DD-MMM-YYYY');

      if (sessionStorage.getItem('UserType') === 'RM') {
        this.isUserRM = true;
        this.username = sessionStorage.getItem('RMUser');
        this.custId = sessionStorage.getItem('RMCustID');
        this.CIF = sessionStorage.getItem('RMCIF');
        this.Customerid = sessionStorage.getItem('RMCustID');
      } else {
        this.isUserRM = false;
        this.username = sessionStorage.getItem('Username');
        this.custId = this.homeapi.CustomerId;
        this.CIF = sessionStorage.getItem('CIF');
        this.Customerid = sessionStorage.getItem('CustomerID');
      }

      this.baseCCY = sessionStorage.getItem('BankBaseCcy');
      if (this.baseCCY.toLocaleLowerCase() == 'inr')
        this.selectedExchange = 'Nifty 50';
      else this.selectedExchange = 'SNP500';

      this.portfolio = null;
      this.newMPName = '';

      this.afs.GetClientwisePortfolioAlloc(
        this.CIF,
        this.username,
        'ASSETCLASS',
        'USD',
        null
      );
      this.getListOfIndices();
      this.ClientAllocObserversubscription = this.afs.ClientAlloc.subscribe(
        (client) => {
          console.log(client);
          if (this.clientDetails == null && client.length !== 0) {
            if (
              client !== null ||
              this.portfolioDetails.length == 0 ||
              this.selectedPortfolioDetails.length == 0
            ) {
              this.clientDetails = client;
              console.log(client);
              this.portfolioDetails = [];
              this.portfolioDetails = client.ClientwisePortfolioDetails.slice();
              console.log(this.portfolioDetails);
              // this.selectedPortfolio = client.ClientwisePortfolioDetails[0];
              console.log(this.selectedPortfolio);

              // this.portfolioDataSubscription =
              //   this.portfolioAnalyticsService.portfolioData.subscribe(
              //     (res) => {
              //       console.log(res);
              //       if (res && Object.keys(res).length > 0) {
              //         // console.log("hi", this.portfolioDetails);
              //         for (let i = 0; i < this.portfolioDetails.length; i++) {
              //           if (
              //             this.portfolioDetails[i].PortfolioName ==
              //               res.PortfolioName &&
              //             this.portfolioDetails[i].FacilityCode ==
              //               res.FacilityCode
              //           ) {
              //             this.selectedPortfolio = i;
              //             console.log(this.selectedPortfolio);
              //             break;
              //           }
              //         }
              //       }
              //       console.log(this.selectedPortfolio);
              //     },
              //     (err) => {
              //       console.log(err);
              //     }
              //   );

              let res = this.portfolioAnalyticsService.selectedPortfolio;
              console.log(res);
              if (res && Object.keys(res).length > 0) {
                for (let i = 0; i < this.portfolioDetails.length; i++) {
                  if (
                    this.portfolioDetails[i].PortfolioName ==
                      res.PortfolioName &&
                    this.portfolioDetails[i].FacilityCode == res.FacilityCode
                  ) {
                    this.selectedPortfolio = i;
                    console.log(this.selectedPortfolio);
                    break;
                  }
                }
              }

              if (this.selectedPortfolio == null) {
                console.log(this.selectedPortfolio);
                this.selectedPortfolio = 0;
              }
              this.portfolioDisplayName =
                this.portfolioDetails[this.selectedPortfolio].PortfolioName +
                ' (' +
                this.portfolioDetails[this.selectedPortfolio].FacilityCode +
                ') ';
              console.log(this.selectedPortfolio);
              // console.log(this.mainTab);
              this.custId = this.Customerid;
              console.log(this.Customerid);
              console.log(
                this.portfolioDetails[this.selectedPortfolio].FacilityCode
              );
              // if (this.portfolioDetails.length > 0) {
              //   this.api.getCustPortfolioSecurityHoldings(
              //     this.custId,
              //     this.portfolioDetails[this.selectedPortfolio].FacilityCode,
              //     ''
              //   );
              // }

              if (this.selectedPortfolio != null) {
                console.log(this.portfolioDetails[this.selectedPortfolio]);
                this.portfolioDetailsObserverSubscription =
                  this.portfolioAnalyticsService.portfolioDetailsObserver.next({
                    CustomerID: this.Customerid,
                    FacilityCode:
                      this.portfolioDetails[this.selectedPortfolio]
                        .FacilityCode,
                  });
                console.log('Portfolio Details Called');
                this.getPortfolioHoldings();
                var num: number = this.selectedPortfolioDetails.length;
                this.securityStatus = new Array(num).fill(false);
                // this.getBenchmarkSecurities('init');
                // if (this.mainTab == 'simulation') {
                //   this.toggleSubTab('compare-portfolio');
                // }
              }
            }
          } else {
            this.isLoader = false;
            this.isperfLoader = false;
          }
        },
        (err) => {
          this.isperfLoader = false;
          this.isLoader = false;
          console.log(err);
        }
      );

      this.portfolioSecHoldingObserverSubscription =
        this.api.portfolioSecHoldingObserver.subscribe(
          (res) => {
            if (this.selectedPortfolio != null) {
              console.log(this.portfolioDetails[this.selectedPortfolio]);
              this.portfolioDetailsObserverSubscription =
                this.portfolioAnalyticsService.portfolioDetailsObserver.next({
                  CustomerID: this.Customerid,
                  FacilityCode:
                    this.portfolioDetails[this.selectedPortfolio].FacilityCode,
                });
              console.log('Portfolio Details Called');
              this.getPortfolioHoldings();
            }
            if (res.length !== 0) {
              // this.selectedPortfolioDetails = res;
              // this.selectedPortfolioDetails.forEach(e => {

              //   e.CEHD_Pending_receive_Qty[0] = parseFloat(e.CEHD_Pending_receive_Qty[0]);
              //   e.CEHD_Pending_pay_Qty[0] = parseFloat(e.CEHD_Pending_pay_Qty[0]);
              //   e.CEHD_Available_Qty[0] = parseFloat(e.CEHD_Available_Qty[0]);
              //   e.CEHD_BUY_Settled_Avg_Price[0] = this.cfs.FormatNumberr(parseFloat(e.CEHD_BUY_Settled_Avg_Price[0]));
              //   e.CEHD_PledgedOut_Qty[0] = parseFloat(e.CEHD_PledgedOut_Qty[0]);
              // });
              // this.selectedPortfolioDetails = this.portfolioDummySecurities[this.selectedPortfolio];
              // console.log('Portfolio de', this.selectedPortfolioDetails);
              var num: number = this.selectedPortfolioDetails.length;
              this.securityStatus = new Array(num).fill(false);
              // this.getBenchmarkSecurities('init');
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy() {
    this.clientDetails = null;
    this.portfolioAnalyticsService.selectedPortfolio = null;
    if (
      this.ClientAllocObserversubscription != null &&
      this.ClientAllocObserversubscription != undefined
    ) {
      console.log('unsubscribed!!');
      this.ClientAllocObserversubscription.unsubscribe();
      this.ClientAllocObserversubscription = null;
    }
    if (
      this.portfolioDetailsObserverSubscription != null &&
      this.portfolioDetailsObserverSubscription != undefined
    ) {
      console.log('unsubscribed!!');
      this.portfolioDetailsObserverSubscription.unsubscribe();
      this.portfolioDetailsObserverSubscription = null;
    }
    if (
      this.getCustAccountDetailsSubscription != null &&
      this.getCustAccountDetailsSubscription != undefined
    ) {
      console.log('unsubscribed!!');
      this.getCustAccountDetailsSubscription.unsubscribe();
      this.getCustAccountDetailsSubscription = null;
    }
    if (
      this.portfolioDataSubscription != null &&
      this.portfolioDataSubscription != undefined
    ) {
      console.log('unsubscribed!!');
      this.portfolioDataSubscription.unsubscribe();
      this.portfolioDataSubscription = null;
    }
    if (
      this.portfolioSecHoldingObserverSubscription != null &&
      this.portfolioSecHoldingObserverSubscription != undefined
    ) {
      console.log('unsubscribed!!');
      this.portfolioSecHoldingObserverSubscription.unsubscribe();
      this.portfolioSecHoldingObserverSubscription = null;
    }
    if (
      this.themeServiceObsSubscription != null &&
      this.themeServiceObsSubscription != undefined
    ) {
      console.log('unsubscribed!!');
      this.themeServiceObsSubscription.unsubscribe();
      this.themeServiceObsSubscription = null;
    }
  }

  subtractDaysFromDate(days: number) {
    try {
      var date: Date = new Date(this.today);
      date.setDate(this.today.getDate() - days);
      return date;
    } catch (error) {
      console.log(error);
    }
  }

  changeGraphColors(options: {
    legend: { textStyle: { color: string } };
    hAxis: {
      titleTextStyle: { color: string };
      textStyle: { color: string };
      gridlines: { color: string };
    };
    vAxis: {
      titleTextStyle: { color: string };
      textStyle: { color: string };
      gridlines: { color: string };
    };
    titleTextStyle: string;
  }) {
    options.legend.textStyle.color = this.graphsTextColor.color;
    if (options.hAxis) {
      options.hAxis.titleTextStyle.color = this.graphsTextColor.color;
      options.hAxis.textStyle.color = this.graphsTextColor.color;
      if (options.hAxis.gridlines.color != 'none') {
        options.hAxis.gridlines.color = '#808080';
      }
    }
    if (options.vAxis) {
      options.vAxis.titleTextStyle.color = this.graphsTextColor.color;
      options.vAxis.textStyle.color = this.graphsTextColor.color;
      if (options.vAxis.gridlines.color != 'none') {
        options.vAxis.gridlines.color = '#808080';
      }
    }
    options.titleTextStyle = this.graphsTextColor.color;

    return options;
  }

  displaySourceOfInvestment(index: number) {
    console.log('SOI CALLED', index, this.securityExposureFilteredList[index]);
    if (this.displayedSourceOfInvestment != index) {
      var ISIN = this.securityExposureFilteredList[index].Security_ISIN;
      this.currentSOIlist = this.sourceOfInvestmentList.filter(
        (it: { Security_ISIN: any }) => {
          return it.Security_ISIN == ISIN;
        }
      );
      console.log(this.currentSOIlist);
      this.displayedSourceOfInvestment = index;
    } else {
      this.displayedSourceOfInvestment = null;
    }
  }

  xmlToArray(xmlInput: string) {
    try {
      var xmlString: string = xmlInput;
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, 'text/xml');
      const obj = this.ngxXml2jsonService.xmlToJson(xml);
      var tableName: any = '';
      var keys = Object.keys(obj['NewDataSet']);
      tableName = keys.filter((it) => {
        return it != '#text' && it != 'xs:schema';
      })[0];
      var jsonList = obj['NewDataSet'][tableName];
      console.log('IMPORTANT', Array.isArray(jsonList), jsonList);
      return jsonList;
    } catch (error) {
      console.log(error);
    }
  }

  callSecuritiesAssetsInfoWrapper(solveFor: string) {
    try {
      this.portfolioAnalyticsService
        .securitiesAssetsInfoWrapper(
          this.Customerid,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode,
          solveFor
        )
        .subscribe(
          (res) => {
            if (res) {
              // console.log(solveFor);
              // console.log(res);
              var xmlString: string =
                res.SecuritiesAssetsInfoWrapperResult.response;
              var jsonList = this.xmlToArray(xmlString);
              console.log(solveFor, jsonList);
              if (solveFor == 'SECURITY EXPOSURE BREAKDOWN') {
                this.sourceOfInvestmentList = jsonList;
                console.log(jsonList);
                this.isSOIerror = false;
              } else if (solveFor == 'SECURITY EXPOSURE') {
                this.securityExposureList = jsonList;

                // this.securityExposureList = [
                //   {
                //     Equity_Market_Cap: 'Large Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '9.10',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Amazon',
                //   },
                //   {
                //     Equity_Market_Cap: 'Large Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '8.46',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Apple',
                //   },
                //   {
                //     Equity_Market_Cap: 'Large Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '7.42',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Meta Platforms',
                //   },
                //   {
                //     Equity_Market_Cap: 'Large Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '6.81',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'PayPal',
                //   },
                //   {
                //     Equity_Market_Cap: 'Large Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '6.58',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Microsoft',
                //   },
                //   {
                //     Equity_Market_Cap: 'Mid Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '6.32',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Under Armour',
                //   },
                //   {
                //     Equity_Market_Cap: 'Large Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '6.12',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Tesla',
                //   },
                //   {
                //     Equity_Market_Cap: 'Mid Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '5.22',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Stitch Fix',
                //   },
                //   {
                //     Equity_Market_Cap: 'Mid Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '5.11',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Zynga',
                //   },
                //   {
                //     Equity_Market_Cap: '',
                //     Exposure_x0020__x0028__x0025__x0029_: '4.37',
                //     Security_Asset_Class: 'Fixed Income',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: '30-year US Treasury Bonds',
                //   },
                //   {
                //     Equity_Market_Cap: 'Large Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '3.64',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Intel',
                //   },
                //   {
                //     Equity_Market_Cap: '',
                //     Exposure_x0020__x0028__x0025__x0029_: '3.60',
                //     Security_Asset_Class: 'Fixed Income',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: '30-year UK Government Bonds',
                //   },
                //   {
                //     Equity_Market_Cap: 'Large Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '3.22',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Applied Materials',
                //   },
                //   {
                //     Equity_Market_Cap: '',
                //     Exposure_x0020__x0028__x0025__x0029_: '3.18',
                //     Security_Asset_Class: 'Fixed Income',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'BUND 10-year German Government Bonds',
                //   },
                //   {
                //     Equity_Market_Cap: 'Mid Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '2.59',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: "Macy's",
                //   },
                //   {
                //     Equity_Market_Cap: '',
                //     Exposure_x0020__x0028__x0025__x0029_: '2.58',
                //     Security_Asset_Class: 'Fixed Income',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: '20-year US Treasury Bonds',
                //   },
                //   {
                //     Equity_Market_Cap: 'Large Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '2.55',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Honeywell',
                //   },
                //   {
                //     Equity_Market_Cap: 'Small Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '2.37',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Perion Network',
                //   },
                //   {
                //     Equity_Market_Cap: '',
                //     Exposure_x0020__x0028__x0025__x0029_: '1.99',
                //     Security_Asset_Class: 'Fixed Income',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: '10-year US Treasury Bonds',
                //   },
                //   {
                //     Equity_Market_Cap: 'Small Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '1.28',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Broadcom',
                //   },
                //   {
                //     Equity_Market_Cap: 'Large Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '1.21',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'MercadoLibre',
                //   },
                //   {
                //     Equity_Market_Cap: 'Large Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '0.97',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Marriott',
                //   },
                //   {
                //     Equity_Market_Cap: '',
                //     Exposure_x0020__x0028__x0025__x0029_: '0.95',
                //     Security_Asset_Class: 'Other',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Invesco QQQ Trust',
                //   },
                //   {
                //     Equity_Market_Cap: '',
                //     Exposure_x0020__x0028__x0025__x0029_: '0.88',
                //     Security_Asset_Class: 'Other',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Vanguard Energy ETF',
                //   },
                //   {
                //     Equity_Market_Cap: 'Large Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '0.80',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Monster Beverage',
                //   },
                //   {
                //     Equity_Market_Cap: '',
                //     Exposure_x0020__x0028__x0025__x0029_: '0.75',
                //     Security_Asset_Class: 'Other',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Alerian MLP ETF',
                //   },
                //   {
                //     Equity_Market_Cap: '',
                //     Exposure_x0020__x0028__x0025__x0029_: '0.66',
                //     Security_Asset_Class: 'Other',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Vanguard Short-Term Corporate Bond ETF',
                //   },
                //   {
                //     Equity_Market_Cap: '',
                //     Exposure_x0020__x0028__x0025__x0029_: '0.59',
                //     Security_Asset_Class: 'Other',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'SPDR S&P 500 ETF Trust',
                //   },
                //   {
                //     Equity_Market_Cap: 'Large Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '0.40',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Gilead Sciences',
                //   },
                //   {
                //     Equity_Market_Cap: 'Large Cap',
                //     Exposure_x0020__x0028__x0025__x0029_: '0.28',
                //     Security_Asset_Class: 'Equity',
                //     Security_ISIN: 'INE467B01029',
                //     Security_Name: 'Moderna',
                //   },
                // ];

                this.securityExposureFilteredList =
                  this.securityExposureList.slice();
                this.isSecuritiesExposureError = false;
                // console.log(this.securityExposureFilteredList);
              } else if (solveFor == 'ASSET CLASS EXPOSURE') {
                // this.assetClassExposureList = jsonList;
                console.log(this.assetClassExposureList);

                //Start - 18-03-2022
                var answer = jsonList.map(function (el: {
                  [x: string]: string;
                }) {
                  var arr = [];
                  arr.push(el['Asset_Class']);
                  arr.push(
                    parseFloat(el['Exposure_x0020__x0028__x0025__x0029_'])
                  );
                  return arr;
                });
                //End - 18-03-2022

                console.log(answer);
                this.graphSettings.assetAllocation[0].data = answer;
                this.graphSettings.assetAllocation[0].options = {
                  ...this.assetAllocationGraphOption,
                  colors: this.chartColors.slice(0, 4),
                };
                // this.updateGraphDetails(1, 'PieChart', answer, ['Asset Classes', 'Exposures(%)'], height, width, updatedOption, title);
              } else if (solveFor == 'EQUITY MARKET CAP EXPOSURE - TOTAL') {
                // Start - 18-03-2022
                var answer = jsonList.map(function (el: {
                  [x: string]: string;
                }) {
                  var arr = [];
                  arr.push(el['Market_Cap']);
                  arr.push(
                    parseFloat(el['Exposure_x0020__x0028__x0025__x0029_'])
                  );
                  return arr;
                });
                console.log(answer);
                // End - 18-03-2022

                // var answer = [];
                // answer = [
                //   ['Large Cap', 57.56],
                //   ['Mid Cap', 19.24],
                //   ['Small Cap', 8.83],
                // ];

                this.graphSettings.assetAllocation[2].data = answer;
                this.graphSettings.assetAllocation[2].options = {
                  ...this.assetAllocationGraphOption,
                  colors: this.chartColors2.slice(0, 4),
                };
              } else if (solveFor == 'EQUITY MARKET CAP EXPOSURE - EQ') {
                var answer = jsonList.map(function (el: {
                  [x: string]: string;
                }) {
                  var arr = [];
                  arr.push(el['Market_Cap']);
                  arr.push(
                    parseFloat(el['Exposure_x0020__x0028__x0025__x0029_'])
                  );
                  return arr;
                });
                // console.log(answer);

                this.graphSettings.assetAllocation[3].data = answer;
                this.graphSettings.assetAllocation[3].options = {
                  ...this.assetAllocationGraphOption,
                  colors: this.chartColors2.slice(0, 4),
                };
              } else if (solveFor == 'DEBT EQUITY RATIO') {
                // var answer = jsonList.map(function (el: {
                //   [x: string]: string;
                // }) {
                //   var arr = [];
                //   arr.push(el['Asset_Class']);
                //   arr.push(
                //     parseFloat(el['Exposure_x0020__x0028__x0025__x0029_'])
                //   );
                //   return arr;
                // });

                var answer = [];
                answer = [
                  ['Equity', 80.45],
                  ['Debt', 15.72],
                  ['Others', 3.83],
                ];
                // console.log(answer);
                this.graphSettings.assetAllocation[1].data = answer;
                this.graphSettings.assetAllocation[1].options = {
                  ...this.assetAllocationGraphOption,
                  colors: this.chartColors2.slice(5, 9),
                };
              }
              // console.log(this.graphSettings.assetAllocation);
              this.assetAllocationgraphs =
                this.graphSettings.assetAllocation.slice(0, 3);

              this.hRatio = 0.7;
              this.swRatio = 0.7;
              this.assetAllocationgraphs[0].height =
                window.innerHeight * this.hRatio;
              this.assetAllocationgraphs[0].width =
                window.innerWidth * this.swRatio;
              this.assetAllocationgraphs[1].height =
                window.innerHeight * this.hRatio;
              this.assetAllocationgraphs[1].width =
                window.innerWidth * this.swRatio;
              this.assetAllocationgraphs[2].height =
                window.innerHeight * this.hRatio;
              this.assetAllocationgraphs[2].width =
                window.innerWidth * this.swRatio;
              console.log(this.assetAllocationgraphs);
            }
            this.isLoader = false;
          },
          (err) => {
            console.log(err);
            if (solveFor == 'SECURITY EXPOSURE BREAKDOWN') {
              this.isSOIerror = true;
            } else if (solveFor == 'SECURITY EXPOSURE') {
              this.isSecuritiesExposureError = true;
            } else if (solveFor == 'ASSET CLASS EXPOSURE') {
              this.assetAllocFlags[0] = true;
            } else if (solveFor == 'EQUITY MARKET CAP EXPOSURE - TOTAL') {
              this.assetAllocFlags[2] = true;
            } else if (solveFor == 'EQUITY MARKET CAP EXPOSURE - EQ') {
              this.assetAllocFlags[3] = true;
            } else if (solveFor == 'DEBT EQUITY RATIO') {
              this.assetAllocFlags[1] = true;
            }
            // this.isLoader = true;
            this.isLoader = false;
          }
        );
    } catch (error) {
      console.log(error);
      // this.error = {
      //   message: 'Error occured in Asset Allocation',
      //   flag: true
      // };
      this.isLoader = false;
    }
  }

  updateGraphDetails(
    order: number = 1,
    type: string = 'LineChart',
    data: any[],
    columnNames: any[],
    height: number,
    width: number,
    options: any,
    title: string
  ) {
    if (order == 1) {
      this.data = data;
      this.columnNames = columnNames;
      this.height = height;
      this.width = width;
      this.type = type;
      this.options = options;
      console.log('Called');
      this.title = title;
    } else {
      this.secondGraphData = data;
      this.secondGraphColumns = columnNames;
      this.secondGraphOptions = options;
      this.secondGraphHeight = height;
      this.secondGraphWidth = width;
      this.secondGraphType = type;
      this.secondGraphTitle = title;
    }
  }

  portfolioStatistics() {
    if (this.selectedPortfolioDetails.length == 0) this.isLoader = true;
    var solveForList: string[] = [
      'CAGR',
      'ANNUALRETURN',
      'ANNUALVOLATILITY',
      'SHARPERATIO',
      'SORTINORATIO',
      'HISTORICALVAR',
      'IMPLIEDVAR',
      'BETA',
      'ALPHA',
      'TRACKINGERROR',
      'INFORMATIONRATIO',
      'UPCAPTURE',
      'DOWNCAPTURE',
    ];
    this.pSLstartIndex = solveForList.indexOf('BETA');
    this.performanceStatisticsList = [];
    var perfLoad = false,
      timeLoad = false;
    this.isLoader = true;
    // this.timeBasedStatisticsList = [];
    this.timeBasedStatisticsList = [
      {
        key: 'MTD',
        value: '-',
        startDate: new Date(new Date(this.today).setDate(1)),
        endDate: this.today,
      },
      {
        key: 'YTD',
        value: '-',
        startDate: new Date(
          new Date().setFullYear(this.today.getFullYear(), 0, 1)
        ),
        endDate: this.today,
      },
      {
        key: '1 YEAR',
        value: '-',
        startDate: this.subtractDaysFromDate(365),
        endDate: this.today,
      },
      {
        key: '3 YEAR',
        value: '-',
        startDate: this.subtractDaysFromDate(365 * 3),
        endDate: this.today,
      },
      {
        key: '5 YEAR',
        value: '-',
        startDate: this.subtractDaysFromDate(365 * 5),
        endDate: this.today,
      },
    ];

    from(solveForList)
      .pipe(
        concatMap((solveFor: string) => {
          return this.portfolioAnalyticsService
            .performanceWrapper(
              this.fetchedSecurities,
              solveFor,
              this.selectedExchange,
              this.FromDate,
              this.ToDate,
              this.Customerid,
              this.portfolioDetails[this.selectedPortfolio].FacilityCode,
              [],
              'PORTFOLIO',
              null
            )
            .pipe(
              map(
                (res) => {
                  if (res) {
                    if (res.response) {
                      if (solveFor == 'ANNUALRETURN') {
                        res.response = res.response.split(',')[0];
                      }
                      var obj = this.generatePerformanceStatisticsObj(
                        solveFor,
                        res.response
                      );
                      var perFlag = this.performanceStatisticsList.filter(
                        (it: { key: string }) => {
                          return it.key === obj.key;
                        }
                      );
                      if (perFlag.length == 0 && this.isNumber(obj.value))
                        this.performanceStatisticsList.push(obj);
                    }
                  }
                  if (solveFor === 'DOWNCAPTURE') perfLoad = true;
                  if (perfLoad && timeLoad) this.isLoader = false;
                },
                (err: any) => {
                  console.log(err);
                  // this.isLoader = true;
                }
              ),
              catchError((err) => of('error', err))
            );
        })
      )
      .subscribe((err) => {
        this.isLoader = false;
        console.log(err);
      });

    from(this.timeBasedStatisticsList)
      .pipe(
        concatMap((it: any) => {
          it.startDate = moment(it.startDate).format('YYYY-MM-DD');
          it.endDate = moment(it.endDate).format('YYYY-MM-DD');
          return this.portfolioAnalyticsService
            .performanceWrapper(
              this.fetchedSecurities,
              'TODATE',
              this.selectedExchange,
              it.startDate,
              it.endDate,
              this.Customerid,
              this.portfolioDetails[this.selectedPortfolio].FacilityCode,
              [],
              'PORTFOLIO',
              null
            )
            .pipe(
              map(
                (res) => {
                  if (res) {
                    if (res.response) {
                      if (this.isNumber(res.response)) it.value = res.response;
                      console.log(it);
                      // this.isLoader = false;
                    }
                  }
                  if (it.key == '5 YEAR') timeLoad = true;

                  if (perfLoad && timeLoad) this.isLoader = false;
                },
                (err: any) => {
                  console.log(err);
                  // this.isLoader = true;
                  this.isLoader = false;
                }
              ),
              catchError((err) => of('error', err))
            );
        })
      )
      .subscribe((err) => {
        console.log(err);
      });
  }

  generatePerformanceStatisticsObj(solveFor: string, value: string) {
    var obj = {
      key: '',
      value: '',
    };
    switch (solveFor) {
      case 'SHARPERATIO': {
        obj.key = 'SHARPE RATIO';
        break;
      }
      case 'STANDARDDEVIATION': {
        obj.key = 'STANDARD DEVIATION';
        break;
      }
      case 'SORTINORATIO': {
        obj.key = 'SORTINO RATIO';
        break;
      }
      case 'HISTORICALVAR': {
        obj.key = 'HISTORICAL VaR';
        break;
      }
      case 'IMPLIEDVAR': {
        obj.key = 'IMPLIED VaR';
        break;
      }
      case 'ANNUALVOLATILITY': {
        obj.key = 'ANNUAL VOLATILITY';
        break;
      }
      case 'BETA': {
        obj.key = 'BETA';
        break;
      }
      case 'ALPHA': {
        obj.key = 'ALPHA';
        break;
      }
      case 'TRACKINGERROR': {
        obj.key = 'TRACKING ERROR';
        break;
      }
      case 'UPCAPTURE': {
        obj.key = 'UP CAPTURE';
        break;
      }
      case 'DOWNCAPTURE': {
        obj.key = 'DOWN CAPTURE';
        break;
      }
      case 'CAGR': {
        obj.key = 'CAGR';
        break;
      }
      case 'ANNUALRETURN': {
        obj.key = 'ANNUAL RETURN';
        break;
      }
      case 'INFORMATIONRATIO': {
        obj.key = 'INFORMATION RATIO';
        break;
      }
    }
    obj.value = value;
    return obj;
  }

  changeSelectedEqMCG() {
    this.assetAllocationgraphs = this.graphSettings.assetAllocation.slice();
    if (this.selectedEqMCG == 2) this.assetAllocationgraphs.splice(3);
    else this.assetAllocationgraphs.splice(2, 1);
  }

  showTooltip(text: string, el: any, className: string) {
    this.tooltip = this.renderer.createElement('span');
    this.tooltipTitle = text;
    // console.log(this.tooltipTitle);
    // console.log(el.parentNode);
    // console.log(el);
    // console.log(this.el);
    this.tooltip.appendChild(this.renderer.createElement('span'));
    this.renderer.appendChild(
      this.tooltip,
      this.renderer.createText(this.tooltipTitle)
    );
    // console.log(this.tooltip);
    if (!this.toggleFlag) {
      // console.log("HI");
      this.tooltip.classList.add('repositionTooltip');
    }

    this.renderer.appendChild(el, this.tooltip);
    this.renderer.addClass(this.tooltip, className);
    this.renderer.addClass(this.tooltip, 'tooltip_show');
  }

  hideTooltip(_tooltip: ElementRef) {
    var elements = document.getElementsByClassName('tooltip_show');
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  textChangeSearch(index: number) {
    // this.modelPortfolioSecurities[index].code = '';
    if (this.currentTab === 'compare-portfolio') {
      if (this.benchmarkSecurities.length > 0) {
        var list = this.benchmarkSecurities.filter(
          (it) =>
            it.LongName == this.modelPortfolioSecurities[index].securityName
        );
        console.log(list);
        if (list.length != 1)
          this.modelPortfolioSecurities[index].displaySearch = true;
      } else {
        this.modelPortfolioSecurities[index].displaySearch = false;
      }
    } else {
      if (this.indicesList.length > 0) {
        var list = this.indicesList.filter(
          (it) =>
            it.SA_Long_Name == this.compositeIndexSecurities[index].securityName
        );
        console.log(list);
        if (list.length != 1)
          this.compositeIndexSecurities[index].displaySearch = true;
      } else {
        this.compositeIndexSecurities[index].displaySearch = false;
      }
    }
  }

  addStock(stockObj: any) {
    if (!this.customPortfolio.includes(stockObj)) {
      this.customPortfolio.push(stockObj);
      console.log(this.customPortfolio);
    }
  }

  removeStock(stockObj: any) {
    if (this.customPortfolio.includes(stockObj)) {
      this.customPortfolio.remove(stockObj);
    }
  }

  hideResultsWithDelay(index: number) {
    console.log('HELLo');
    setTimeout(() => {
      if (this.currentTab == 'compare-portfolio')
        this.modelPortfolioSecurities[index].displaySearch = false;
      else this.compositeIndexSecurities[index].displaySearch = false;
    }, 200);
  }

  // getFormattedDataAPI() {
  //   console.log('Graph Called');
  //   this.portfolioAnalyticsService.getFormattedDataAPI().subscribe(
  //     (res) => {
  //       console.log(res.response);
  //       var json = res.response;
  //       var answer = json.map(function (el: { [x: string]: string }) {
  //         var arr = [];
  //         for (var key in el) {
  //           if (+el[key] == NaN || (+el[key]).toString() == 'NaN')
  //             arr.push(el[key]);
  //           else arr.push(parseFloat(el[key]));
  //         }
  //         return arr;
  //       });
  //       this.data = answer;
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  setDefaultGraphSettings() {
    this.data = [];
    this.graphViewMax = null;
    this.graphViewMin = null;
    this.width = 750;
    this.height = 475;
    this.columnNames = [];
    this.selectedScenario = '';
    this.type = 'LineChart';
    this.options.hAxis.format = 'MMM yyyy';
    this.options.chartArea.left = '8%';
    this.options.chartArea.width = '70%';
    this.options.chartArea.height = '85%';
    this.options.legend['position'] = 'out';
    this.options.vAxis.gridlines = {
      color: '#808080',
      count: 5,
    };
  }

  toggleTab(flag: string) {
    try {
      console.log('Toggle Called');
      if (this.mainTab != flag) {
        this.isLoader = true;
        this.mainTab = flag;
        this.selectedSoC = null;
        this.isAddNewMP = false;
        this.isAddNewCI = false;
        this.FromDate = moment(this.subtractDaysFromDate(365)).format(
          'DD-MMM-YYYY'
        );
        this.ToDate = moment(new Date()).format('DD-MMM-YYYY');
        this.currentTab = '';
        this.cummulativeReturnsData = new Map<string, Array<any>>();
        this.setDefaultGraphSettings();
        this.newMPName = '';
        this.sourceOfContributions = [];
        this.graphSettings.assetAllocation[0].data = [];
        this.graphSettings.assetAllocation[1].data = [];
        this.graphSettings.assetAllocation[2].data = [];
        this.graphSettings.assetAllocation[3].data = [];
        this.sourceOfInvestmentList = [];
        this.securityExposureList = [];
        this.securityExposureFilteredList = [];
        this.rollingReturnsStatistics = [
          {
            key: 'period',
            value1: this.rollingOption1,
            value2: this.rollingOption2,
            value3: this.rollingOption3,
          },
          {
            key: 'Average',
            value1: '--',
            value2: '--',
            value3: '--',
          },
          {
            key: 'Volatility',
            value1: '--',
            value2: '--',
            value3: '--',
          },
          {
            key: 'high',
            value1: '--',
            value2: '--',
            value3: '--',
          },
          {
            key: 'low',
            value1: '--',
            value2: '--',
            value3: '--',
          },
        ];
        this.scenarioStatistics1 = [
          {
            key: 'start date',
            value: '--',
          },
          {
            key: 'end date',
            value: '--',
          },
          {
            key: 'excess return',
            value: '--',
          },
          {
            key: 'correlation',
            value: '--',
          },
        ];
        this.scenarioStatistics2 = [
          {
            key: '',
            value1: 'Portfolio',
            value2: 'Benchmark',
          },
          {
            key: 'return',
            value1: '--',
            value2: '--',
          },
          {
            key: 'volatility',
            value1: '--',
            value2: '--',
          },
        ];
        this.assetAllocationgraphs = this.graphSettings.assetAllocation.slice(
          0,
          3
        );
        this.isContributionError = false;
        this.isContPerfError = false;
        this.isSecuritiesExposureError = false;
        this.isRollingStatisticsError = false;
        this.isCumulativeReturnsError = false;
        this.isRollingGraphError = false;
        this.isDrawdownsError = false;
        this.assetAllocFlags = [false, false, false, false];
        this.indicesList.forEach((el) => (el['status'] = false));

        if (this.selectedPortfolioDetails.length > 0) {
          if (this.mainTab == 'current-portfolio') {
            this.performanceStatisticsList = [];
            this.portfolioStatistics();
          } else if (this.mainTab == 'simulation') {
            this.portfolioChecked = false;
            this.modelPortfolioList = [];
            this.isModelPortfolio = false;
            this.isCompositeIndex = false;
            this.hRatio = 0.6;
            this.swRatio = 0.63;
            this.height = window.innerHeight * this.hRatio;
            this.width = window.innerWidth * this.swRatio;
            this.options.chartArea.left = '10%';
            this.options.chartArea.width = '72%';
            var num: number = this.securityStatus.length;
            this.selectedSecurities = [];
            this.selectedIndices = [];
            this.securityStatus = new Array(num).fill(false);
            console.log('Hello');
            this.data = [];
            this.graphViewMax = null;
            this.graphViewMin = null;
            this.columnNames = [];
            this.toggleSubTab('compare-portfolio');
            this.title =
              'Portfolio and Individual Securities v/s ' +
              this.selectedExchange;
            this.options.vAxis.title = 'Rebased Prices';
            // this.options.vAxis['format'] = 'decimal'
          } else if (this.mainTab == 'stress-testing') {
            this.getScenarios(
              'IN_BUILT_STRESS_TEST_SCENARIOS',
              this.portfolioDetails[this.selectedPortfolio].FacilityCode
            );
            this.getScenarios(
              'CUSTOM_STRESS_TEST_SCENARIOS',
              this.portfolioDetails[this.selectedPortfolio].FacilityCode
            );
            this.title =
              'Portfolio and Individual Securities v/s ' +
              this.selectedExchange;

            this.hRatio = 0.63;
            this.swRatio = 0.4;
            this.height = window.innerHeight * this.hRatio;
            this.width = window.innerWidth * this.swRatio;
          } else if (this.mainTab == 'asset-allocation') {
            this.hRatio = 0.7;
            this.swRatio = 0.7;
            this.assetAllocationgraphs[0].height =
              window.innerHeight * this.hRatio;
            this.assetAllocationgraphs[0].width =
              window.innerWidth * this.swRatio;
            this.assetAllocationgraphs[1].height =
              window.innerHeight * this.hRatio;
            this.assetAllocationgraphs[1].width =
              window.innerWidth * this.swRatio;
            this.assetAllocationgraphs[2].height =
              window.innerHeight * this.hRatio;
            this.assetAllocationgraphs[2].width =
              window.innerWidth * this.swRatio;
            this.callSecuritiesAssetsInfoWrapper('SECURITY EXPOSURE BREAKDOWN');
            this.callSecuritiesAssetsInfoWrapper('SECURITY EXPOSURE');
            this.callSecuritiesAssetsInfoWrapper('ASSET CLASS EXPOSURE');
            this.callSecuritiesAssetsInfoWrapper(
              'EQUITY MARKET CAP EXPOSURE - TOTAL'
            );
            this.callSecuritiesAssetsInfoWrapper(
              'EQUITY MARKET CAP EXPOSURE - EQ'
            );
            this.callSecuritiesAssetsInfoWrapper('DEBT EQUITY RATIO');
            this.type = 'BarChart';
          } else if (this.mainTab == 'drawdowns') {
            this.hRatio = 0.655;
            this.swRatio = 0.4;
            this.height = window.innerHeight * this.hRatio;
            this.width = window.innerWidth * this.swRatio;
            this.title = 'Drawdowns';
            this.options.legend['position'] = 'in';
            this.options.chartArea.left = '5%';
            this.options.chartArea.width = '90%';
            this.options.chartArea.height = '90%';
            this.options.chartArea.top = '2%';
            this.options.vAxis.title = 'Drawdowns';
            // this.options.hAxis.title = 'Dates';
            // this.callDrawdownWrapper(this.portfolioDummySecurities[this.selectedPortfolio],"GRAPH", "Nifty 50", this.FromDate, this.ToDate);
            this.callDrawdownWrapper(
              this.fetchedSecurities,
              'GRAPH',
              this.selectedExchange,
              this.FromDate,
              this.ToDate
            );
            this.secondGraphColumns = ['Numbers', 'Drawdowns'];
            this.secondGraphType = 'BarChart';
            this.secondGraphOptions = JSON.parse(JSON.stringify(this.options));
            this.secondGraphOptions.hAxis.format = 'decimal';
            this.secondGraphOptions['orientation'] = 'horizontal';
            this.secondGraphOptions.chartArea.left = '6%';
            this.secondGraphOptions.chartArea.top = '5%';
            this.secondGraphOptions.vAxis.title = '';
            this.secondGraphOptions.hAxis.title = '';
            this.secondGraphOptions.chartArea.width = '90%';
            this.secondGraphOptions.chartArea.height = '85%';
            this.secondGraphOptions.legend['position'] = 'none';
            console.log(this.secondGraphOptions);
          } else if (this.mainTab == 'contributions') {
            this.hRatio = 0.28;
            this.swRatio = 0.43;
            this.graphSettings.contributions[0].height =
              window.innerHeight * this.hRatio;
            this.graphSettings.contributions[0].width =
              window.innerWidth * this.swRatio;
            this.graphSettings.contributions[1].height =
              window.innerHeight * this.hRatio;
            this.graphSettings.contributions[1].width =
              window.innerWidth * 1.35 * this.swRatio;
            console.log(this.graphSettings.contributions);
            this.graphSettings.contributions[0].data = [];
            // this.graphSettings.contributions[0].columnNames = [];
            this.graphSettings.contributions[1].data = [];
            // this.graphSettings.contributions[1].columnNames = [];
            this.callContributionWrapper(
              this.fetchedSecurities,
              'SOURCESOFPORTFOLIORETURNS',
              this.selectedExchange,
              this.FromDate,
              this.ToDate
            );
          } else if (flag == 'rolling-analysis') {
            this.isRollingGraphError = false;
            this.hRatio = 0.575;
            this.swRatio = 0.4;
            this.height = window.innerHeight * this.hRatio;
            this.width = window.innerWidth * this.swRatio;
            this.callRollingWrapper('GRAPH');
            this.callRollingWrapper('ROLLINGRETURNSSTATISTICS');
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  generateCustomTooltip(obj: any, category: string) {
    switch (category) {
      case 'rolling': {
        var htmlElement =
          '<div class="generated-tooltip"> <p class="generated-tooltip-date"> ' +
          obj.date +
          '</p> <p class="generated-tooltip-value"> ' +
          obj.day +
          ' days average: <span class = "generated-tooltip-innervalue"> ' +
          obj.value +
          '%</span> daily.  </p> </div>';
        return htmlElement;

        break;
      }
      case 'simulation': {
        break;
      }
      default: {
        break;
      }
    }
  }

  toggleSubTab(subtab: string) {
    try {
      if (subtab != this.currentTab) {
        this.isModelPortfolio = false;
        this.isCompositeIndex = false;
        if (subtab == 'compare-portfolio') {
          // this.data = [];
          // this.columnNames = [];
          // this.graphViewMax = null;
          // this.graphViewMin = null;
          // this.portfolioChecked = false;
          // this.benchmarkSecuritiesString = '';
          // this.selectedSecurities = [];
          if (!this.columnNames.includes(this.selectedExchange)) {
            this.callPerformanceWrapper(
              [this.selectedExchange],
              'CUMULATIVERETURN',
              this.selectedExchange,
              this.FromDate,
              this.ToDate,
              [],
              'INDICES',
              null
            );
            var index = -1;
            this.indicesList.forEach((el, idx) => {
              if (el.SA_ISIN == [this.selectedExchange]) index = idx;
            });
            if (index !== -1) {
              this.indicesList[index]['status'] = true;
            }
          }
          if (!this.columnNames.includes(this.portfolioDisplayName)) {
            console.log(this.columnNames);
            this.checkUnCheckCurrentPortfolio();
          }
        } else if (subtab == 'compare-indices') {
        }
      }
      this.currentTab = subtab;
    } catch (error) {
      console.log(error);
    }
  }

  getBenchmarkSecurities(_condition: string) {
    try {
      this.portfolioAnalyticsService.getBenchmarkSecurityList().subscribe(
        (res) => {
          var xmlString: string = res.response;
          this.benchmarkSecurities = this.xmlToArray(xmlString);
          // console.log(this.benchmarkSecurities);
          this.benchmarkSecurities.forEach((it) => (it.Code = it.Code.trim()));
          // console.log(this.benchmarkSecurities);
          var num: number = this.benchmarkSecurities.length;
          this.securityStatus = new Array(num).fill(false);

          // if (condition == 'init') {
          var codes = [];
          codes = this.selectedPortfolioDetails.slice();
          console.log(this.selectedPortfolioDetails);
          console.log(codes);
          if (typeof this.selectedPortfolioDetails[0] != 'string') {
            this.selectedPortfolioDetails = [];
            codes.forEach((el) => {
              this.selectedPortfolioDetails.push(el.Code.trim());
            });
          }
          // this.benchmarkSecurities.forEach((it) => console.log(it.LongName));

          console.log(this.selectedPortfolioDetails);
          console.log(this.benchmarkSecurities);
          this.selectedPortfolioDetails = this.benchmarkSecurities.filter(
            (it) => {
              if (this.selectedPortfolioDetails.includes(it.Code.trim())) {
                return it;
              }
            }
          );
          if (this.selectedPortfolioDetails.length === 0) {
            // this.selectedPortfolioDetails = [];
            this.securityMisMatchFLag = true;
          } else {
            this.securityMisMatchFLag = false;
          }
          // if (this.selectedPortfolioDetails.length == 0) {
          //   // window.alert("No Securities Found!!!");
          //   // location.reload();
          //   this.error = {
          //     message: 'No Securities Found!',
          //     flag: true
          //   };
          // }
          // if (this.selectedPortfolioDetails.length == 0) this.isLoader = true;
          console.log(this.selectedPortfolioDetails);
          // this.callPerformanceWrapper(codes,"CUMULATIVERETURN", "Nifty 50", this.FromDate, this.ToDate);
          // }
          if (this.mainTab == 'simulation') {
            this.toggleSubTab('compare-portfolio');
          }
        },
        (err) => {
          console.log(err);
          if (this.mainTab == 'simulation') {
            this.toggleSubTab('compare-portfolio');
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  removeColumn(array: any[], remIdx: number) {
    array.forEach((arr: any[]) => {
      // return arr.filter((_el: any, idx: any) => {
      //   return idx !== remIdx;
      // });
      arr.splice(remIdx, 1);
    });
    console.log(JSON.stringify(this.cummulativeReturnsData));
    // this.cummulativeReturnsData.forEach((value) => {
    //   value.splice(remIdx, 1);
    // });
    console.log(JSON.stringify(this.cummulativeReturnsData));

    return array;
  }

  checkUnCheckCurrentPortfolio() {
    try {
      if (this.portfolioChecked) {
        this.portfolioChecked = false;
        var columnIndex: number = this.columnNames.indexOf(
          this.portfolioDisplayName
        );
        console.log(JSON.stringify(this.data));
        console.log(JSON.stringify(this.columnNames));
        this.data = this.removeColumn(this.data, columnIndex).slice();
        this.data.forEach((el) => {
          this.cummulativeReturnsData.set(el[0].toString(), el);
        });
        this.columnNames.remove(this.portfolioDisplayName);
        console.log(JSON.stringify(this.data));
        console.log(JSON.stringify(this.columnNames));
        // 'if (this.data[0].length == 2) {
        //   this.data = [];
        //   this.columnNames = [];
        // }'
      } else {
        console.log(this.columnNames);
        console.log(this.data);
        this.portfolioChecked = true;
        // this.callPerformanceWrapper(this.portfolioDummySecurities[this.selectedPortfolio],"CUMULATIVERETURN", "Nifty 50", this.FromDate, this.ToDate);
        this.callPerformanceWrapper(
          this.fetchedSecurities,
          'CUMULATIVERETURN',
          this.selectedExchange,
          this.FromDate,
          this.ToDate,
          [],
          'PORTFOLIO',
          null
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  checkUncheckSecurity(security: any) {
    try {
      var index: any;
      if (this.currentTab == 'compare-portfolio') {
        console.log(this.selectedPortfolioDetails);
        console.log(security);
        index = this.selectedPortfolioDetails.indexOf(security);
        if (!this.selectedSecurities.includes(security.Code)) {
          this.selectedSecurities.push(security.Code);
          this.callPerformanceWrapper(
            [security.Code],
            'CUMULATIVERETURN',
            this.selectedExchange,
            this.FromDate,
            this.ToDate,
            [],
            'SECURITIES',
            null
          );
        } else {
          var columnIndex: number = this.columnNames.indexOf(security.Code);
          console.log(JSON.stringify(this.data));
          console.log(JSON.stringify(this.columnNames));
          this.data = this.removeColumn(this.data, columnIndex).slice();
          console.log(this.data);
          this.data.forEach((el) => {
            this.cummulativeReturnsData.set(el[0].toString(), el);
          });
          console.log(this.cummulativeReturnsData);
          this.selectedSecurities.remove(security.Code);
          this.columnNames.remove(security.Code);
          console.log(JSON.stringify(this.data));
          console.log(JSON.stringify(this.columnNames));
          // if (this.data && this.data[0].length == 2) {
          //   this.data = [];
          //   this.columnNames = [];
          // }
          console.log(this.columnNames);
        }
        this.securityStatus[index] = !this.securityStatus[index];
      } else if (
        this.currentTab === 'compare-indices' &&
        security.SA_ISIN != this.selectedExchange
      ) {
        index = this.indicesList.indexOf(security);
        if (!this.selectedIndices.includes(security.SA_ISIN)) {
          this.selectedIndices.push(security.SA_ISIN);
          this.callPerformanceWrapper(
            [security.SA_ISIN],
            'CUMULATIVERETURN',
            this.selectedExchange,
            this.FromDate,
            this.ToDate,
            [],
            'INDICES',
            null
          );
        } else {
          var columnIndex: number = this.columnNames.indexOf(security.SA_ISIN);
          this.data = this.removeColumn(this.data, columnIndex).slice();
          console.log(this.data);
          this.data.forEach((el) => {
            this.cummulativeReturnsData.set(el[0].toString(), el);
          });
          this.selectedIndices.remove(security.SA_ISIN);
          this.columnNames.remove(security.SA_ISIN);
        }
        this.indicesList[index]['status'] = !this.indicesList[index]['status'];
      }
    } catch (error) {
      console.log(error);
    }
  }

  callPerformanceWrapper(
    securities: any[],
    solveFor: string = 'CUMULATIVERETURN',
    benchmark: string = this.selectedExchange,
    FromDate,
    ToDate,
    weights: string[] = [],
    mode: string = 'SECURITIES',
    identifier: string
  ) {
    try {
      this.isCumulativeReturnsError = false;
      this.graphViewMax = null;
      this.graphViewMax = null;
      console.log('Wrapper Called');
      FromDate = moment(FromDate).format('YYYY-MM-DD');
      ToDate = moment(ToDate).format('YYYY-MM-DD');
      console.log(FromDate, ToDate);
      this.portfolioAnalyticsService
        .performanceWrapper(
          securities,
          solveFor,
          benchmark,
          FromDate,
          ToDate,
          this.Customerid,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode,
          weights,
          mode,
          identifier
        )
        .subscribe(
          (res) => {
            if (res) {
              var xmlString: string = res.response;
              var jsonList = this.xmlToArray(xmlString);
              var self = this;
              console.log(securities, jsonList);
              var answer = jsonList.map(function (el: { [x: string]: string }) {
                var arr = [];
                arr.push(new Date(el['SA_Date']));
                // var benchmarkVal = parseFloat(el['Benchmark_x0020_Values']);
                // arr.push(benchmarkVal);
                // self.graphViewMax =
                //   self.graphViewMax == null
                //     ? benchmarkVal
                //     : Math.max(self.graphViewMax, benchmarkVal);
                // self.graphViewMin =
                //   self.graphViewMin == null
                //     ? benchmarkVal
                //     : Math.min(self.graphViewMin, benchmarkVal);
                var secVal = parseFloat(el['SA_Value']);
                arr.push(secVal);
                self.graphViewMax =
                  self.graphViewMax == null
                    ? secVal
                    : Math.max(self.graphViewMax, secVal);
                self.graphViewMin =
                  self.graphViewMin == null
                    ? secVal
                    : Math.min(self.graphViewMin, secVal);
                return arr;
              });
              console.log(self.graphViewMax, self.graphViewMin);
              if (this.data.length == 0) {
                console.log(jsonList);
                // console.log(answer);
                answer.forEach((el: any) => {
                  el[1] = parseFloat(el[1]) == 0 ? null : parseFloat(el[1]);
                  this.cummulativeReturnsData.set(el[0].toString(), el);
                });
                // this.data = answer;
                if (mode === 'SECURITIES' || mode === 'INDICES') {
                  this.columnNames = ['Dates'].concat(securities);
                } else if (mode === 'MODEL_PORTFOLIO') {
                  var portList = this.modelPortfolioList.filter((it) => {
                    return it.Portfolio_ID == identifier;
                  });
                  this.columnNames = [
                    'Dates',
                    portList[0]['Portfolio_Name'] +
                      '-' +
                      portList[0]['Portfolio_ID'],
                  ];
                } else if (mode === 'PORTFOLIO') {
                  this.columnNames = ['Dates', this.portfolioDisplayName];
                } else if (mode === 'CUSTOM_INDICES') {
                  var ciList = this.compositeIndexList.filter((it) => {
                    return it['Custom_Index_ID'] == identifier;
                  });
                  this.columnNames = [
                    'Dates',
                    ciList[0]['Custom_Index_Name'] +
                      '-' +
                      ciList[0]['Custom_Index_ID'],
                  ];
                } else {
                  console.log('Invalid Mode');
                }
                var set = new Set(this.columnNames);
                this.columnNames = [...set];
                console.log(this.columnNames);
                console.log(this.data);
              } else {
                answer.forEach((el: any) => {
                  let arr: any = this.cummulativeReturnsData.get(
                    el[0].toString()
                  )
                    ? this.cummulativeReturnsData.get(el[0].toString()).slice()
                    : null;
                  if (arr === undefined || arr === null) {
                    arr = [];
                    arr = Array(this.columnNames.length).fill(null);
                    if (arr.length > 0) arr[0] = el[0];
                  }
                  arr.push(parseFloat(el[1]) == 0 ? null : parseFloat(el[1]));
                  this.cummulativeReturnsData.set(
                    el[0].toString(),
                    arr.slice()
                  );
                });
                // this.data.forEach((item, index) =>
                //   item.push(parseFloat(answer[index][2]))
                // );
                console.log(this.columnNames);
                if (mode == 'SECURITIES' || mode == 'INDICES') {
                  this.columnNames = this.columnNames.concat(securities);
                } else if (mode == 'MODEL_PORTFOLIO') {
                  var portList = this.modelPortfolioList.filter((it) => {
                    return it.Portfolio_ID == identifier;
                  });
                  this.columnNames.push(
                    portList[0]['Portfolio_Name'] +
                      '-' +
                      portList[0]['Portfolio_ID']
                  );
                } else if (mode === 'PORTFOLIO') {
                  this.columnNames = this.columnNames.concat(
                    this.portfolioDisplayName
                  );
                } else if (mode === 'CUSTOM_INDICES') {
                  var ciList = this.compositeIndexList.filter((it) => {
                    return it['Custom_Index_ID'] == identifier;
                  });
                  this.columnNames.push(
                    ciList[0]['Custom_Index_Name'] +
                      '-' +
                      ciList[0]['Custom_Index_ID']
                  );
                } else {
                  console.log('Invalid PortFolio');
                }
                var set = new Set(this.columnNames);
                this.columnNames = [...set];
                console.log(this.data);
                console.log(this.columnNames);
                this.data = [];
              }
              let lenk: number = this.columnNames.length;
              this.cummulativeReturnsData.forEach((value) => {
                let indArrLen = value.length;
                if (lenk > indArrLen) {
                  let diff = lenk - indArrLen;
                  for (let i = 0; i < diff; i++) value.push(null);
                } else {
                  console.log('Error in Graph');
                }
                this.data.push(value.slice());
              });
              // console.log(this.columnNames);
              // console.log(this.data);
              console.log('VERTICAL AXIS CHANGED', this.options.vAxis);
              var len = this.data.length;
              var minDate: Date = new Date(
                JSON.parse(JSON.stringify(this.data[0][0]))
              );
              var maxDate: Date = new Date(
                JSON.parse(JSON.stringify(this.data[len - 1][0]))
              );
              minDate.setDate(minDate.getDate() - 10);
              maxDate.setDate(maxDate.getDate() + 10);
              this.options.hAxis['viewWindow'] = {
                min: minDate,
                max: maxDate,
              };
              console.log(this.columnNames.includes('MODEL_PORTFOLIO'));
              this.isLoader = false;
            }
          },
          (err) => {
            console.log(err);
            this.isLoader = false;
            console.log('Cumulative Returns Error');
            this.isCumulativeReturnsError = true;
            // this.isLoader = true;
          }
        );
    } catch (error) {
      this.isLoader = false;
      console.log('Cumulative Returns Error');
      this.isCumulativeReturnsError = true;
      console.log(error);
      // this.isLoader = true;
    }
  }

  changePortfolio() {
    try {
      this.isLoader = true;
      this.data = [];
      this.fetchedSecurities = [];
      this.columnNames = [];
      this.selectedPortfolioDetails = [];
      this.custId = this.Customerid;
      var timeBasedStatisticsList = [...this.timeBasedStatisticsList];
      timeBasedStatisticsList.forEach((el, _index, _arr) => {
        el.value = '';
      });
      this.drawdownDetails = [];
      console.log(timeBasedStatisticsList);
      if (this.portfolioDetails.length > 0) {
        console.log(this.selectedPortfolio);
        this.api.getCustPortfolioSecurityHoldings(
          this.custId,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode,
          ''
        );
        this.benchmarkSecurities = [];
        this.portfolioDisplayName =
          this.portfolioDetails[this.selectedPortfolio].PortfolioName +
          ' (' +
          this.portfolioDetails[this.selectedPortfolio].FacilityCode +
          ') ';
      }
    } catch (error) {
      console.log(error);
      this.isLoader = true;
    }
  }

  searchSecurities() {
    // console.log(this.securityName);
    // var list = this.selectedPortfolioDetails.filter((it) => {
    //   console.log(it.longName[0]);
    //   return it.longName[0].toLowerCase().includes(this.securityName);
    // });
    // console.log(list);
  }

  datesChanged() {
    try {
      this.FromDate = moment(this.FromDate).format('DD-MMM-YYYY');
      this.ToDate = moment(this.ToDate).format('DD-MMM-YYYY');
      console.log(
        new Date(this.FromDate),
        new Date(this.ToDate),
        this.ToDate > this.FromDate
      );
      if (new Date(this.ToDate) > new Date(this.FromDate)) {
        console.log(this.FromDate, this.ToDate);
        var columns = this.columnNames.slice();
        this.data = [];
        this.columnNames = [];
        switch (this.mainTab) {
          case 'current-portfolio': {
            this.portfolioStatistics();
            break;
          }
          case 'simulation': {
            console.log(columns);
            this.cummulativeReturnsData.clear();
            columns.forEach((it) => {
              if (it != 'Dates') {
                console.log(it);
                if (it == this.portfolioDisplayName) {
                  this.callPerformanceWrapper(
                    this.fetchedSecurities,
                    'CUMULATIVERETURN',
                    this.selectedExchange,
                    this.FromDate,
                    this.ToDate,
                    [],
                    'PORTFOLIO',
                    null
                  );
                } else if (it == this.selectedExchange) {
                  this.callPerformanceWrapper(
                    [this.selectedExchange],
                    'CUMULATIVERETURN',
                    this.selectedExchange,
                    this.FromDate,
                    this.ToDate,
                    [],
                    'INDICES',
                    null
                  );
                } else if (
                  this.modelPortfolioList.filter((el) => {
                    var name = el['Portfolio_Name'] + '-' + el['Portfolio_ID'];
                    return name == it;
                  }).length > 0
                ) {
                  var index = null;
                  this.modelPortfolioList.forEach((el, varIdx) => {
                    var name = el['Portfolio_Name'] + '-' + el['Portfolio_ID'];
                    if (name == it) index = varIdx;
                  });
                  this.modelPortfolioList[index]['selected'] = false;
                  this.checkUncheckModelPortfolio(index);
                } else if (
                  this.compositeIndexList.filter((el) => {
                    var name =
                      el['Custom_Index_Name'] + '-' + el['Custom_Index_ID'];
                    return name == it;
                  }).length > 0
                ) {
                  var index = null;
                  this.compositeIndexList.forEach((el, varIdx) => {
                    var name =
                      el['Custom_Index_Name'] + '-' + el['Custom_Index_ID'];
                    if (name == it) index = varIdx;
                  });
                  this.compositeIndexList[index]['selected'] = false;
                  this.checkUncheckCompositeIndex(index);
                } else
                  setTimeout(() => {
                    this.callPerformanceWrapper(
                      [it.toString()],
                      'CUMULATIVERETURN',
                      this.selectedExchange,
                      this.FromDate,
                      this.ToDate,
                      [],
                      'SECURITIES',
                      null
                    );
                  }, 100);
              }
            });
            break;
          }
          case 'rolling-analysis': {
            this.callRollingWrapper('GRAPH');
            this.callRollingWrapper('ROLLINGRETURNSSTATISTICS');
            break;
          }
          case 'drawdowns': {
            this.callDrawdownWrapper(
              this.fetchedSecurities,
              'GRAPH',
              this.selectedExchange,
              this.FromDate,
              this.ToDate
            );
            break;
          }
          case 'contributions': {
            this.selectedSoC = null;
            this.cummulativeReturnsData.clear();
            this.graphSettings.contributions[0].data = [];
            // this.graphSettings.contributions[0].columnNames = [];
            this.graphSettings.contributions[1].data = [];
            // this.graphSettings.contributions[1].columnNames = [];
            this.callContributionWrapper(
              this.fetchedSecurities,
              'SOURCESOFPORTFOLIORETURNS',
              this.selectedExchange,
              this.FromDate,
              this.ToDate
            );
            break;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  dateTimeString2Date(dt: string) {
    var date: any = dt.split(' ')[0];
    date = date.split('-');

    return [date[2], date[1], date[0]].join('-');
  }

  callRollingWrapper(solveFor: string = 'GRAPH') {
    try {
      console.log('ROlling Wrapper Called');
      this.data = [];
      this.graphViewMax = null;
      this.graphViewMin = null;
      this.columnNames = [];
      this.title = 'Rolling Returns v/s Dates';
      // this.options.vAxis['format'] = '#' + "\'%\'"
      console.log(this.options);
      this.options.vAxis.title = 'Rolling Returns (in %)';
      var FromDate = moment(this.FromDate).format('YYYY-MM-DD');
      var ToDate = moment(this.ToDate).format('YYYY-MM-DD');
      var weights = [];
      var mode = 'PORTFOLIO';
      this.portfolioAnalyticsService
        .rollingWrapper(
          this.fetchedSecurities,
          this.selectedExchange,
          this.Customerid,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode,
          this.rollingOption1 +
            ',' +
            this.rollingOption2 +
            ',' +
            this.rollingOption3,
          FromDate,
          ToDate,
          weights,
          solveFor,
          mode
        )
        .subscribe(
          (res) => {
            console.log(res);
            if (this.mainTab == 'rolling-analysis') {
              if (solveFor == 'GRAPH') {
                var xmlString: string = res.response;
                var jsonList = this.xmlToArray(xmlString);
                var self = this;
                console.log(jsonList);
                var answer = jsonList.map(function (el: {
                  [x: string]: string;
                }) {
                  var arr = [];
                  for (var key in el) {
                    if (key != '#text') {
                      if (
                        key != 'Dates' &&
                        (+el[key] == NaN || (+el[key]).toString() == 'NaN')
                      )
                        arr.push(el[key]);
                      else if (key == 'Dates') {
                        arr.push(new Date(self.dateTimeString2Date(el[key])));
                      } else if (el[key] == '0') {
                        arr.push(null);
                      } else {
                        arr.push(parseFloat(el[key]));
                        // console.log(self.graphViewMin);
                        self.graphViewMax =
                          self.graphViewMax == null
                            ? parseFloat(el[key])
                            : Math.max(self.graphViewMax, parseFloat(el[key]));
                        self.graphViewMin =
                          self.graphViewMin == null
                            ? parseFloat(el[key])
                            : Math.min(self.graphViewMin, parseFloat(el[key]));
                        // console.log(self.graphViewMax, self.graphViewMin);
                      }
                    }
                  }
                  return arr;
                });
                console.log(self.graphViewMax, self.graphViewMin);
                // console.log(answer);
                console.log(this.rollingOption1);
                this.data = answer.slice(+this.rollingOption1);
                // console.log(this.data);

                this.columnNames = [
                  'Dates',
                  this.rollingOption1 + ' Days Average',
                  this.rollingOption2 + ' Days Average',
                  this.rollingOption3 + ' Days Average',
                ];
                this.options.hAxis['viewWindow'] = {
                  min: new Date('01/04/2018'),
                };
                // this.graphViewMax += 0.5 * this.graphViewMin;
                // this.graphViewMin -= 0.3 * this.graphViewMin;
                // this.options.vAxis['viewWindow'] = {
                //   min: this.graphViewMin,
                //   max: this.graphViewMax
                // };
                var len = this.data.length;
                var minDate: Date = new Date(
                  JSON.parse(JSON.stringify(this.data[0][0]))
                );
                var maxDate: Date = new Date(
                  JSON.parse(JSON.stringify(this.data[len - 1][0]))
                );
                minDate.setDate(minDate.getDate() - 10);
                maxDate.setDate(maxDate.getDate() + 10);
                this.options.hAxis['viewWindow'] = {
                  min: minDate,
                  max: maxDate,
                };
                this.isLoader = false;
              } else if (solveFor == 'ROLLINGRETURNSSTATISTICS') {
                var xmlString: string = res.response;
                var jsonList = this.xmlToArray(xmlString);
                console.log(jsonList);
                jsonList.forEach(
                  (element: { [x: string]: any }, index: string | number) => {
                    if (element['Column_x0027_0_x0027_'] != 'NaN')
                      this.rollingReturnsStatistics[index].value1 =
                        element['Column_x0027_0_x0027_'];
                    if (element['Column_x0027_1_x0027_'] != 'NaN')
                      this.rollingReturnsStatistics[index].value2 =
                        element['Column_x0027_1_x0027_'];
                    if (element['Column_x0027_2_x0027_'] != 'NaN')
                      this.rollingReturnsStatistics[index].value3 =
                        element['Column_x0027_2_x0027_'];
                  }
                );
                this.isRollingStatisticsError = false;
              }
              console.log('Loader', this.isLoader);
            }
          },
          (err) => {
            console.log(err);
            //  this.isLoader = true;
            this.isLoader = false;
            this.isRollingGraphError = true;
            console.log('Loader', this.isLoader);

            if (solveFor == 'ROLLINGRETURNSSTATISTICS')
              this.isRollingStatisticsError = true;
          }
        );
    } catch (error) {
      console.log(error);
      this.isLoader = false;
      this.isRollingGraphError = true;
      // this.isLoader = true;
    }
  }

  rollingPeriodsChanged() {
    try {
      this.rollingReturnsStatistics[0].value1 = this.rollingOption1;
      this.rollingReturnsStatistics[0].value2 = this.rollingOption2;
      this.rollingReturnsStatistics[0].value3 = this.rollingOption3;
      console.log(
        typeof this.rollingOption1,
        ' ',
        typeof this.rollingOption2,
        ' ',
        typeof this.rollingOption3
      );
      console.log(
        this.rollingOption1.length > 0 &&
          this.rollingOption3.length > 0 &&
          this.rollingOption3.length > 0,
        !isNaN(+this.rollingOption1) &&
          !isNaN(+this.rollingOption2) &&
          !isNaN(+this.rollingOption3),
        +this.rollingOption1 < +this.rollingOption2 &&
          +this.rollingOption2 < +this.rollingOption3
      );
      if (
        this.rollingOption1.length > 0 &&
        this.rollingOption3.length > 0 &&
        this.rollingOption3.length > 0 &&
        !isNaN(+this.rollingOption1) &&
        !isNaN(+this.rollingOption2) &&
        !isNaN(+this.rollingOption3)
      ) {
        console.log(
          'Called successfully!!',
          !isNaN(+this.rollingOption1),
          +this.rollingOption2 != NaN,
          +this.rollingOption3 != NaN
        );
        this.callRollingWrapper('GRAPH');
        this.callRollingWrapper('ROLLINGRETURNSSTATISTICS');
      } else {
        this.error = {
          message: '',
          flag: false,
        };
        // window.alert("1.) Enter all the Rolling Period values. \n2.) Enter all valid numbers. \n3.) Periods should be in increasing order.")
        this.error.message =
          '1.) Enter all the Rolling Period values. \n2.) Enter all valid numbers.';
        this.error.flag = true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  checkUncheckScenario(
    scenario: { name: string },
    type: string,
    index: number
  ) {
    try {
      this.scenarioStatistics1 = [
        {
          key: 'start date',
          value: '--',
        },
        {
          key: 'end date',
          value: '--',
        },
        {
          key: 'excess return',
          value: '--',
        },
        {
          key: 'correlation',
          value: '--',
        },
      ];
      this.scenarioStatistics2 = [
        {
          key: '',
          value1: 'Portfolio',
          value2: 'Benchmark',
        },
        {
          key: 'return',
          value1: '--',
          value2: '--',
        },
        {
          key: 'volatility',
          value1: '--',
          value2: '--',
        },
      ];
      this.data = [];
      this.columnNames = [];
      this.cummulativeReturnsData = new Map<string, any>();
      if (this.selectedScenario == scenario.name) {
        this.selectedScenario = '';
      } else {
        this.selectedScenario = scenario.name;
        var FromDate: moment.MomentInput, ToDate: moment.MomentInput;

        if (type == 'inbuilt') {
          FromDate = this.inBuiltScenarios[index].fromDate;
          ToDate = this.inBuiltScenarios[index].toDate;
        } else {
          FromDate = this.customScenarios[index].fromDate;
          ToDate = this.customScenarios[index].toDate;
        }

        FromDate = moment(FromDate).format('YYYY-MM-DD');
        ToDate = moment(ToDate).format('YYYY-MM-DD');
        // this.callPerformanceWrapper(this.portfolioDummySecurities[this.selectedPortfolio],"CUMULATIVERETURN", "Nifty 50", FromDate, ToDate);
        this.callPerformanceWrapper(
          [this.selectedExchange],
          'CUMULATIVERETURN',
          this.selectedExchange,
          FromDate,
          ToDate,
          [],
          'INDICES',
          null
        );
        this.callPerformanceWrapper(
          this.fetchedSecurities,
          'CUMULATIVERETURN',
          this.selectedExchange,
          FromDate,
          ToDate,
          [],
          'PORTFOLIO',
          null
        );
        this.portfolioAnalyticsService
          .performanceWrapper(
            this.fetchedSecurities,
            'ALPHA',
            this.selectedExchange,
            FromDate,
            ToDate,
            this.Customerid,
            this.portfolioDetails[this.selectedPortfolio].FacilityCode,
            [],
            'PORTFOLIO',
            null
          )
          .subscribe(
            (res) => {
              this.scenarioStatistics1[2].value = res.response;
            },
            (err) => {
              console.log(err);
            }
          );
        this.portfolioAnalyticsService
          .performanceWrapper(
            this.fetchedSecurities,
            'PORTFOLIOWEIGHTS',
            this.selectedExchange,
            FromDate,
            ToDate,
            this.Customerid,
            this.portfolioDetails[this.selectedPortfolio].FacilityCode,
            [],
            'PORTFOLIO',
            null
          )
          .subscribe(
            (res) => {
              var securities = this.fetchedSecurities.slice();
              securities.push(this.selectedExchange);
              console.log(res.response);
              var weights = res.response.split(',');
              weights.push(0);
              this.portfolioAnalyticsService
                .performanceWrapper(
                  securities,
                  'CORRELATION',
                  this.selectedExchange,
                  FromDate.toString(),
                  ToDate.toString(),
                  this.Customerid,
                  this.portfolioDetails[this.selectedPortfolio].FacilityCode,
                  weights,
                  'PORTFOLIO',
                  null
                )
                .subscribe(
                  (res) => {
                    console.log(res);
                    this.scenarioStatistics1[3].value = res.response;
                  },
                  (err) => {
                    console.log(err);
                  }
                );
            },
            (err) => {
              console.log(err);
            }
          );
        this.portfolioAnalyticsService
          .performanceWrapper(
            this.fetchedSecurities,
            'ANNUALRETURN',
            this.selectedExchange,
            FromDate,
            ToDate,
            this.Customerid,
            this.portfolioDetails[this.selectedPortfolio].FacilityCode,
            [],
            'PORTFOLIO',
            null
          )
          .subscribe(
            (res) => {
              console.log(res);
              var returns = res.response.split(',');
              this.scenarioStatistics2[1].value1 = returns[0];
              this.scenarioStatistics2[1].value2 = returns[1];
              console.log(this.scenarioStatistics2[1]);
            },
            (err) => {
              console.log(err);
            }
          );
        this.portfolioAnalyticsService
          .performanceWrapper(
            this.fetchedSecurities,
            'ANNUALVOLATILITY',
            this.selectedExchange,
            FromDate,
            ToDate,
            this.Customerid,
            this.portfolioDetails[this.selectedPortfolio].FacilityCode,
            [],
            'PORTFOLIO',
            null
          )
          .subscribe(
            (res) => {
              console.log(res);
              this.scenarioStatistics2[2].value1 = res.response;
            },
            (err) => {
              console.log(err);
            }
          );
        this.portfolioAnalyticsService
          .performanceWrapper(
            this.fetchedSecurities,
            'STANDARDDEVIATION',
            this.selectedExchange,
            FromDate,
            ToDate,
            this.Customerid,
            this.portfolioDetails[this.selectedPortfolio].FacilityCode,
            [],
            'PORTFOLIO',
            null
          )
          .subscribe(
            (res) => {
              console.log(res);
              this.scenarioStatistics2[2].value2 = res.response;
            },
            (err) => {
              console.log(err);
            }
          );
        FromDate = moment(FromDate).format('DD-MMM-YYYY');
        ToDate = moment(ToDate).format('DD-MMM-YYYY');

        this.scenarioStatistics1[0].value = FromDate;
        this.scenarioStatistics1[1].value = ToDate;
        // this.scenarioStatistics1[2].value = this.roundTo(Math.random(), 2);
        // this.scenarioStatistics1[3].value = this.roundTo(Math.random(), 2);
      }
    } catch (error) {
      console.log(error);
    }
  }

  roundTo = function (num: number, places: number) {
    if (String(num) == 'NaN') return '--';
    // console.log(String(num));
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  isNumber(test: string | number) {
    return !isNaN(+test);
  }

  saveCustomScenario() {
    try {
      this.error = {
        message: '',
        flag: false,
      };
      if (this.customScenario.name.length == 0) {
        // window.alert("Enter a name!");
        this.error.message = 'Enter a Name!';
        this.error.flag = true;
      }
      if (this.customScenario.toDate.length == 0) {
        // window.alert("Enter End Date!");
        this.error.message = 'Enter End Date!';
        this.error.flag = true;
      }
      if (this.customScenario.fromDate.length == 0) {
        // window.alert("Enter Start Date!");
        this.error.message = 'Enter Start Date!';
        this.error.flag = true;
      }

      if (
        this.customScenario.name.length > 0 &&
        this.customScenario.toDate.length > 0 &&
        this.customScenario.fromDate.length > 0
      ) {
        this.portfolioAnalyticsService
          .saveCustomScenario(
            this.portfolioDetails[this.selectedPortfolio].FacilityCode,
            this.customScenario.name,
            this.customScenario.fromDate,
            this.customScenario.toDate
          )
          .subscribe(
            (res) => {
              if (res) {
                this.getScenarios(
                  'CUSTOM_STRESS_TEST_SCENARIOS',
                  this.portfolioDetails[this.selectedPortfolio].FacilityCode
                );
                this.isNewCustomScenario = false;
                this.customScenario = {
                  name: '',
                  fromDate: '',
                  toDate: '',
                };
              }
            },
            (err) => {
              console.log(err);
            }
          );
      }
    } catch (error) {
      console.log(error);
    }
  }

  removeCustomScenario(index: number) {
    try {
      console.log(index);
      this.portfolioAnalyticsService
        .removeCustomScenario(
          this.portfolioDetails[this.selectedPortfolio].FacilityCode,
          this.customScenarios[index].ScenarioID
        )
        .subscribe(
          (res) => {
            if (res) {
              if (this.selectedScenario == this.customScenarios[index].name) {
                this.data = [];
                this.columnNames = [];
                this.selectedScenario = '';
              }

              this.customScenarios.splice(index, 1);
              console.log(this.customScenarios);
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } catch (error) {
      console.log(error);
    }
  }

  cancelCustomScenario() {
    this.isNewCustomScenario = false;
    this.customScenario = {
      name: '',
      fromDate: '',
      toDate: '',
    };
  }

  selectFromDate(date: moment.MomentInput) {
    this.customScenario.fromDate = moment(date).format('DD-MMM-YYYY');
  }

  selectToDate(date: moment.MomentInput) {
    this.customScenario.toDate = moment(date).format('DD-MMM-YYYY');
  }

  getScenarios(type: string, FacilityCode: string) {
    console.log('SCENARIOS CALLED');
    try {
      this.portfolioAnalyticsService.getScenarios(type, FacilityCode).subscribe(
        (res) => {
          if (res) {
            console.log(res.scenarios);
            if (type == 'IN_BUILT_STRESS_TEST_SCENARIOS') {
              this.inBuiltScenarios = res.scenarios;
              if (this.inBuiltScenarios.length > 0) {
                this.checkUncheckScenario(
                  this.inBuiltScenarios[0],
                  'inbuilt',
                  0
                );
              }
            } else {
              this.customScenarios = res.scenarios;
            }

            console.log(this.inBuiltScenarios, this.customScenarios);
          }
        },
        (err) => {
          console.log(err);
          this.isLoader = true;
        }
      );
    } catch (error) {
      console.log(error);
      this.isLoader = true;
    }
  }

  callDrawdownWrapper(
    securities: string[],
    solveFor: string = 'GRAPH',
    benchmark: string = this.selectedExchange,
    FromDate,
    ToDate
  ) {
    try {
      this.graphViewMax = null;
      this.graphViewMax = null;
      console.log('Wrapper Called');
      FromDate = moment(FromDate).format('YYYY-MM-DD');
      ToDate = moment(ToDate).format('YYYY-MM-DD');
      console.log(FromDate, ToDate);
      var mode = 'PORTFOLIO';
      this.portfolioAnalyticsService
        .drawdownWrapper(
          securities,
          solveFor,
          benchmark,
          FromDate,
          ToDate,
          this.Customerid,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode,
          [],
          mode
        )
        .subscribe(
          (res) => {
            var xmlString: string = res.response;
            var jsonList = this.xmlToArray(xmlString);
            console.log(jsonList);
            // jsonList.forEach((el) => {
            //   let start_date = el['Start_x0020_Dates']
            //     .toString()
            //     .split(' ')[0]
            //     .split('-');
            //   start_date =
            //     start_date[1] + '-' + start_date[0] + '-' + start_date[2];
            //   el['Start_x0020_Dates'] = start_date;

            //   let end_date = el['End_x0020_Dates']
            //     .toString()
            //     .split(' ')[0]
            //     .split('-');
            //   end_date = end_date[1] + '-' + end_date[0] + '-' + end_date[2];
            //   el['End_x0020_Dates'] = end_date;
            // });
            this.drawdownDetails = jsonList;
            var self = this;
            var answer = jsonList.map(function (el: { [x: string]: string }) {
              var arr = [];
              arr.push(new Date(el['Start_x0020_Dates']));
              var drawdownVal = parseFloat(el['Drawdowns']);
              arr.push(drawdownVal);
              self.graphViewMax =
                self.graphViewMax == null
                  ? drawdownVal
                  : Math.max(self.graphViewMax, drawdownVal);
              self.graphViewMin =
                self.graphViewMin == null
                  ? drawdownVal
                  : Math.min(self.graphViewMin, drawdownVal);
              return arr;
            });
            console.log(answer);
            console.log(self.graphViewMax, self.graphViewMin);
            this.data = answer;
            this.columnNames = ['Dates', 'Drawdowns'];
            console.log(this.columnNames);
            console.log('VERTICAL AXIS CHANGED', this.options.vAxis);
            var len = this.data.length;
            var minDate: Date = new Date(
              JSON.parse(JSON.stringify(this.data[0][0]))
            );
            var maxDate: Date = new Date(
              JSON.parse(JSON.stringify(this.data[len - 1][0]))
            );
            minDate.setDate(minDate.getDate() - 10);
            maxDate.setDate(maxDate.getDate() + 10);
            this.options.hAxis['viewWindow'] = {
              min: minDate,
              max: maxDate,
            };
            this.options.chartArea.width = '85%';
            this.options.chartArea.left = '10%';
            this.isDrawdownsError = false;
            this.isLoader = false;
          },
          (err) => {
            console.log(err);
            this.isDrawdownsError = true;
            this.isLoader = false;
            // this.isLoader = true;
          }
        );
    } catch (error) {
      console.log(error);
      this.isLoader = false;
      this.isDrawdownsError = true;
      // this.isLoader = true;
    }
  }

  getListOfIndices() {
    try {
      this.portfolioAnalyticsService.getListOfIndices().subscribe((res) => {
        if (res) {
          var xmlString: string = res.response;
          var jsonList = this.xmlToArray(xmlString);
          jsonList.forEach((element) => {
            delete element['#text'];
            element['status'] = false;
          });
          this.indicesList = jsonList;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  getPortfolioHoldings() {
    try {
      // console.log("CALLED -[---------------------------------------------");
      this.portfolioAnalyticsService
        .getPortfolioHoldingsEQCash(
          this.Customerid,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode
        )
        .subscribe(
          (res) => {
            if (res) {
              console.log(res);
              var xmlString: string =
                res.GetPortfolioHoldingsEQCashResult.response;
              var jsonList = this.xmlToArray(xmlString);
              console.log(jsonList);

              this.fetchedSecurities = [];
              if (jsonList)
                if (jsonList.length > 0) {
                  // Changed by MohanP | 2 Feb'22
                  // ['PUR', 'PUR', 'SB', 'SB', 'Note Purchase', 'SB', 'SB', 'PUR', 'PUR', 'SB', 'PUR', 'SB', 'SB', 'PUR', 'Initial Investment', 'PUR']
                  jsonList.forEach(
                    (element: {
                      CEHDF_Transaction_Code: string;
                      CEHDF_Stock_Code: string;
                    }) => {
                      switch (element.CEHDF_Transaction_Code.toUpperCase()) {
                        case 'INITIAL INVESTMENT':
                          break;
                        case 'NOTE PURCHASE':
                        case 'SB':
                        case 'PUR':
                          this.fetchedSecurities.push(
                            element.CEHDF_Stock_Code.trim()
                          );
                          break;

                        default:
                          break;
                      }
                      // Changed by MohanP | 2 Feb'22
                    }
                  );
                } else {
                  this.fetchedSecurities = [jsonList.CEHDF_Stock_Code.trim()];
                }
              console.log(this.fetchedSecurities);
              // if (this.fetchedSecurities.length == 0) {
              //   window.alert("No Securities Found!!!");
              //   location.reload();
              // }
              this.selectedPortfolioDetails = this.fetchedSecurities;
              console.log(this.selectedPortfolioDetails);
              var mainTab = this.mainTab;
              this.mainTab = null;
              this.toggleTab(mainTab);
              // if (this.mainTab == 'current-portfolio')
              //   this.portfolioStatistics();
              this.getBenchmarkSecurities('init');
            }
          },
          (err) => {
            console.log(err);
            this.isLoader = true;
          }
        );
    } catch (error) {
      console.log(error);
      this.isLoader = true;
    }
  }

  callContributionWrapper(
    securities: string[],
    solveFor: string = 'SOURCESOFPORTFOLIORETURNS',
    benchmark: string = this.selectedExchange,
    FromDate,
    ToDate
  ) {
    try {
      FromDate = moment(FromDate).format('YYYY-MM-DD');
      ToDate = moment(ToDate).format('YYYY-MM-DD');
      var mode = 'PORTFOLIO';
      this.callPerformanceFromContributionWrapper(
        [this.selectedExchange],
        'INDICES',
        FromDate,
        ToDate
      );
      this.callPerformanceFromContributionWrapper(
        this.fetchedSecurities,
        'PORTFOLIO',
        FromDate,
        ToDate
      );
      this.portfolioAnalyticsService
        .contributionWrapper(
          securities,
          solveFor,
          benchmark,
          this.Customerid,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode,
          FromDate,
          ToDate,
          [],
          mode
        )
        .subscribe(
          (res) => {
            console.log(res);
            var xmlString: string = res.response;
            var jsonList = this.xmlToArray(xmlString);
            console.log(jsonList);
            this.sourceOfContributions = jsonList.slice();
            if (this.benchmarkSecurities.length > 0) {
              this.sourceOfContributions.forEach((it) => {
                this.benchmarkSecurities.forEach((el) => {
                  if (
                    it['Security_x0020_Name'].toString().trim() ==
                    el.Code.toString().trim()
                  )
                    it['LongName'] = el.LongName;
                });
              });
            }
            this.sourceOfContributions = this.sourceOfContributions.sort(
              (a, b) => {
                return +b['Total_x0020_Return'] - +a['Total_x0020_Return'];
              }
            );
            console.log(this.sourceOfContributions);
            console.log(jsonList);
            if (jsonList && jsonList.length > 0) {
              var barGraphData: any[] = jsonList.map(
                (it: {
                  Security_x0020_Name: any;
                  Contribution_x0020_to_x0020_Return: string | number;
                }) => [
                  it.Security_x0020_Name,
                  this.roundTo(+it.Contribution_x0020_to_x0020_Return, 4),
                ]
              );
              barGraphData.sort((a, b) => {
                return b[1] - a[1];
              });
              console.log(barGraphData);
              this.graphSettings.contributions[0].data = barGraphData;
              console.log(this.graphSettings.contributions);
              if (this.selectedSoC == null) {
                this.selectDeselectSoC(0, FromDate, ToDate);
              } else {
                this.selectDeselectSoC(this.selectedSoC, FromDate, ToDate);
              }
            }
            this.isContributionError = false;
            this.isLoader = false;
          },
          (err) => {
            console.log(err);
            this.isContributionError = true;
            this.isLoader = false;
          }
        );
    } catch (error) {
      console.log(error);
      this.isContributionError = true;
      this.isLoader = false;
    }
  }

  callPerformanceFromContributionWrapper(
    securities: string[],
    mode = 'SECURITIES',
    FromDate: string,
    ToDate: string
  ) {
    try {
      console.log(securities);
      this.portfolioAnalyticsService
        .performanceWrapper(
          securities,
          'CUMULATIVERETURN',
          this.selectedExchange,
          FromDate,
          ToDate,
          this.Customerid,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode,
          [],
          mode,
          null
        )
        .subscribe(
          (res) => {
            this.graphSettings.contributions[1].data = [];
            var xmlString: string = res.response;
            var jsonList = this.xmlToArray(xmlString);
            // console.log(jsonList);
            var answer = jsonList.map(function (el: { [x: string]: string }) {
              var arr = [];
              arr.push(new Date(el['SA_Date']));
              var secVal = parseFloat(el['SA_Value']);
              arr.push(secVal);
              return arr;
            });

            if (this.cummulativeReturnsData.size == 0) {
              answer.forEach((el: any) => {
                el[1] = parseFloat(el[1]) == 0 ? null : parseFloat(el[1]);
                this.cummulativeReturnsData.set(el[0].toString(), el);
              });

              if (mode == 'PORTFOLIO')
                this.graphSettings.contributions[1].columnNames = [
                  'Dates',
                  this.portfolioDisplayName,
                ];
              else if (mode == 'INDICES')
                this.graphSettings.contributions[1].columnNames = [
                  'Dates',
                  this.selectedExchange,
                ];
              else if (mode == 'SECURITIES')
                this.graphSettings.contributions[1].columnNames = [
                  'Dates',
                  securities,
                ];
            } else {
              answer.forEach((el: any) => {
                let arr: any = this.cummulativeReturnsData.get(el[0].toString())
                  ? this.cummulativeReturnsData.get(el[0].toString()).slice()
                  : null;
                if (arr === undefined || arr === null) {
                  arr = [];
                  arr = Array(this.columnNames.length).fill(null);
                  if (arr.length > 0) arr[0] = el[0];
                }
                arr.push(parseFloat(el[1]) == 0 ? null : parseFloat(el[1]));
                this.cummulativeReturnsData.set(el[0].toString(), arr.slice());
              });

              if (mode == 'PORTFOLIO')
                this.graphSettings.contributions[1].columnNames.push(
                  this.portfolioDisplayName
                );
              else if (mode == 'INDICES')
                this.graphSettings.contributions[1].columnNames.push(
                  this.selectedExchange
                );
              else if (mode == 'SECURITIES')
                this.graphSettings.contributions[1].columnNames =
                  this.graphSettings.contributions[1].columnNames.concat(
                    securities
                  );
            }
            let lenk: number =
              this.graphSettings.contributions[1].columnNames.length;

            this.cummulativeReturnsData.forEach((value) => {
              let indArrLen = value.length;
              if (lenk > indArrLen) {
                let diff = lenk - indArrLen;
                for (let i = 0; i < diff; i++) value.push(null);
              } else {
                console.log('Error in Graph');
              }
              this.graphSettings.contributions[1].data.push(value.slice());
            });
            console.log(this.graphSettings.contributions[1].data);
            this.isContPerfError = false;
          },
          (err) => {
            console.log(err);
            this.isContPerfError = true;
          }
        );
    } catch (error) {
      console.log(error);
      this.isContPerfError = true;
    }
  }

  selectDeselectSoC(index: number, FromDate: string = '', ToDate: string = '') {
    try {
      if (this.selectedSoC != index) {
        var prev = this.sourceOfContributions[this.selectedSoC];
        console.log(prev);
        if (prev) {
          var idz = this.graphSettings.contributions[1].columnNames.indexOf(
            prev['Security_x0020_Name']
          );
          this.graphSettings.contributions[1].columnNames.remove(
            prev['Security_x0020_Name']
          );
          this.cummulativeReturnsData.forEach((value) => {
            value.splice(idz, 1);
          });
        }
        FromDate = moment(this.FromDate).format('YYYY-MM-DD');
        ToDate = moment(this.ToDate).format('YYYY-MM-DD');
        var currentSoC = this.sourceOfContributions[index];
        console.log(currentSoC);
        this.graphSettings.contributions[1].sectionName = currentSoC.LongName;
        this.callPerformanceFromContributionWrapper(
          [currentSoC.Security_x0020_Name],
          'SECURITIES',
          FromDate,
          ToDate
        );
        this.selectedSoC = index;
        console.log(this.selectedSoC);
      }
    } catch (error) {
      console.log(error);
    }
  }

  addModelPortfolioSecurity(index: number) {
    var newSecurity = new Object({
      securityName: '',
      code: '',
      weight: '',
      displaySearch: false,
    });
    if (this.currentTab === 'compare-portfolio')
      this.modelPortfolioSecurities.splice(index + 1, 0, newSecurity);
    else this.compositeIndexSecurities.splice(index + 1, 0, newSecurity);
  }

  removeModelPortfolioSecurity(index: number) {
    console.log(index);
    if (this.modelPortfolioSecurities.length > 1) {
      this.modelPortfolioSecurities.splice(index, 1);
    }
  }

  removeCISecurity(index: number) {
    console.log(index);
    if (this.compositeIndexSecurities.length > 1) {
      this.compositeIndexSecurities.splice(index, 1);
    }
  }

  selectMPSecurityOrIndex(
    security: { LongName: any; Code: any },
    index: number
  ) {
    var inList: boolean = false;
    this.error = {
      message: '',
      flag: false,
    };
    if (this.currentTab === 'compare-portfolio') {
      this.modelPortfolioSecurities.forEach(
        (element: { securityName: any; code: any }) => {
          if (
            element.securityName == security.LongName &&
            element.code == security.Code
          )
            inList = true;
        }
      );
      if (!inList) {
        console.log('CALLED', index);
        this.modelPortfolioSecurities[index].securityName = security.LongName;
        this.modelPortfolioSecurities[index].code = security.Code;
        this.hideResultsWithDelay(index);
      } else {
        // window.alert("Security already included!");
        this.error.message = 'Security already included!';
        this.error.flag = true;
      }
    } else {
      console.log(security, index);
      this.compositeIndexSecurities.forEach(
        (element: { securityName: any; code: any }) => {
          if (
            element.securityName == security['SA_Long_Name'] &&
            element.code == security['SA_ISIN']
          )
            inList = true;
        }
      );
      if (!inList) {
        console.log('CALLED', index, this.compositeIndexSecurities);
        this.compositeIndexSecurities[index].securityName =
          security['SA_Long_Name'];
        this.compositeIndexSecurities[index].code = security['SA_ISIN'];
        this.hideResultsWithDelay(index);
      } else {
        // window.alert("Security already included!");
        this.error.message = 'Index already included!';
        this.error.flag = true;
      }
    }
  }

  getListOfCompositeIndices() {
    try {
      this.compositeIndexList = [];
      this.portfolioAnalyticsService
        .retrieveCustomIndices(
          this.Customerid,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode
        )
        .subscribe((res) => {
          if (res) {
            console.log(res);
            // this.modelPortfolioList = res["Portfolios"];
            // this.modelPortfolioList.forEach((it) => {

            // });
            var tempList = res['Portfolios'];
            this.allCustomIndicesDetails = tempList;
            var MPLobj = {};
            tempList.forEach((it) => {
              console.log(it['Custom_Index_ID'], MPLobj[it['Custom_Index_ID']]);
              if (MPLobj[it['Custom_Index_ID']] === undefined) {
                MPLobj[it['Custom_Index_ID']] = it['Custom_Index_Name'];
                this.compositeIndexList.push({
                  Custom_Index_ID: it['Custom_Index_ID'],
                  Custom_Index_Name: it['Custom_Index_Name'],
                  selected: false,
                });
              }
            });
            console.log(this.modelPortfolioList);
            this.compositeIndexList.forEach((it, idx) => {
              var name = it['Custom_Index_Name'] + '-' + it['Custom_Index_ID'];
              if (this.columnNames.includes(name)) {
                this.compositeIndexList[idx]['selected'] = true;
                this.checkUncheckCompositeIndex(idx);
                this.checkUncheckCompositeIndex(idx);
              }
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  getAllModelPortfolios() {
    try {
      this.modelPortfolioList = [];
      this.portfolioAnalyticsService
        .retrieveModelPortfolios(
          this.Customerid,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode
        )
        .subscribe((res) => {
          if (res) {
            console.log(res);
            // this.modelPortfolioList = res["Portfolios"];
            // this.modelPortfolioList.forEach((it) => {

            // });
            var tempList = res['Portfolios'];
            this.allModelPortfolioDetails = tempList;
            var MPLobj = {};
            tempList.forEach((it) => {
              console.log(it['Portfolio_ID'], MPLobj[it['Portfolio_ID']]);
              if (MPLobj[it['Portfolio_ID']] === undefined) {
                MPLobj[it['Portfolio_ID']] = it['Portfolio_Name'];
                this.modelPortfolioList.push({
                  Portfolio_ID: it['Portfolio_ID'],
                  Portfolio_Name: it['Portfolio_Name'],
                  selected: false,
                });
              }
            });
            console.log(this.modelPortfolioList);
            this.modelPortfolioList.forEach((it, idx) => {
              var name = it['Portfolio_Name'] + '-' + it['Portfolio_ID'];
              if (this.columnNames.includes(name)) {
                this.modelPortfolioList[idx]['selected'] = true;
                this.checkUncheckModelPortfolio(idx);
                this.checkUncheckModelPortfolio(idx);
              }
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  createMP() {
    try {
      this.portfolioAnalyticsService
        .saveModelPortfolio(
          this.Customerid,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode,
          this.newMPName,
          this.newMPdetails
        )
        .subscribe(
          (res) => {
            if (res != null && res != undefined) {
              this.modelPortfolioFlag = 'PASS';
              this.clearModelPortfolio();
              this.isAddNewMP = false;
            } else {
              this.modelPortfolioFlag = 'FAIL';
            }
            this.getAllModelPortfolios();
            this.newMPName = '';
          },
          (err) => {
            console.log(err);
            this.modelPortfolioFlag = 'FAIL';
          }
        );
    } catch (error) {
      console.log(error);
    }
  }

  createCI() {
    try {
      this.portfolioAnalyticsService
        .saveCustomIndex(
          this.Customerid,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode,
          this.newCIName,
          this.newCIdetails
        )
        .subscribe(
          (res) => {
            if (res != null && res != undefined) {
              this.compositeIndexFlag = 'PASS';
              this.clearCompositeIndex();
              this.isAddNewCI = false;
            } else {
              this.compositeIndexFlag = 'FAIL';
            }
            this.getListOfCompositeIndices();
            this.newCIName = '';
          },
          (err) => {
            console.log(err);
            this.compositeIndexFlag = 'FAIL';
          }
        );
    } catch (error) {
      console.log(error);
    }
  }

  saveMP() {
    try {
      console.log(this.modelPortfolioSecurities);
      var securities = [];
      var weights = [];
      var weightSum: number = 0;
      var benchmarkList = [];
      this.benchmarkSecurities.map((it) => {
        benchmarkList.push(it.LongName);
      });
      var errorFlag = false;
      this.modelPortfolioSecurities.map((it: { weight: string }) => {
        weights.push(it.weight);
        weightSum += parseFloat(it.weight);
      });
      this.modelPortfolioSecurities.map(
        (it: { code: any; securityName: any }) => {
          securities.push(it.code);
          console.log(it.code);
          errorFlag = benchmarkList.includes(it.securityName)
            ? errorFlag
            : true;
        }
      );
      this.error = {
        message: '',
        flag: false,
      };
      if (!this.newMPName.trim()) {
        this.error.message += '- Enter Name';
        this.error.flag = true;
      }

      if (errorFlag) {
        if (this.error.message.length > 0) this.error.message += '\n';
        this.error.message += '- Invalid Security';
        this.error.flag = true;
      }

      if (weightSum != 100) {
        if (this.error.message.length > 0) this.error.message += '\n';
        this.error.message += '- Sum of all the weights should be 100%';
        this.error.flag = true;
      }
      if (this.newMPName.trim() && !errorFlag && weightSum == 100) {
        console.log(this.modelPortfolioSecurities);
        this.newMPdetails = [];
        this.modelPortfolioSecurities.forEach((it) => {
          this.newMPdetails.push(this.createMpObj(it.code, it.weight));
        });
        console.log(this.newMPdetails);

        if (this.isAddNewMP) {
          this.createMP();
        } else {
          this.updateModelPortfolioDetails();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  saveCI() {
    try {
      console.log(this.compositeIndexSecurities);
      var securities = [];
      var weights = [];
      var weightSum: number = 0;
      var benchmarkList = [];
      this.indicesList.map((it) => {
        benchmarkList.push(it.SA_Long_Name);
      });
      var errorFlag = false;
      this.compositeIndexSecurities.map((it: { weight: string }) => {
        weights.push(it.weight);
        weightSum += parseFloat(it.weight);
      });
      this.compositeIndexSecurities.map(
        (it: { code: any; securityName: any }) => {
          securities.push(it.code);
          console.log(it.code);
          errorFlag = benchmarkList.includes(it.securityName)
            ? errorFlag
            : true;
        }
      );
      this.error = {
        message: '',
        flag: false,
      };

      if (!this.newCIName.trim()) {
        this.error.message += '- Enter Name';
        this.error.flag = true;
      }

      if (errorFlag) {
        if (this.error.message.length > 0) this.error.message += '\n';
        this.error.message += '- Invalid Index';
        this.error.flag = true;
      }

      if (weightSum != 100) {
        if (this.error.message.length > 0) this.error.message += '\n';
        this.error.message += '- Sum of all the weights should be 100%';
        this.error.flag = true;
      }
      if (this.newCIName.trim() && !errorFlag && weightSum == 100) {
        console.log(this.compositeIndexSecurities);
        this.newCIdetails = [];
        this.compositeIndexSecurities.forEach((it) => {
          this.newCIdetails.push(this.createCIObj(it.code, it.weight));
        });
        console.log(this.newCIdetails);

        if (this.isAddNewCI) {
          this.createCI();
        } else {
          this.updateCompositeIndexDetails();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  createMpObj(code, weight) {
    return { SecurityCode: code, Weight: parseFloat(weight) };
  }

  createCIObj(code, weight) {
    return { IndexCode: code, IndexWeight: parseFloat(weight) };
  }

  clearModelPortfolio() {
    this.modelPortfolioSecurities = [];
    this.addModelPortfolioSecurity(0);
    this.newMPName = '';
    // var index = this.columnNames.indexOf('MODEL_PORTFOLIO');
    // console.log(index);
    // if (index >= 0) {
    //   var dataCopy = this.data.slice();
    //   dataCopy.forEach((element) => {
    //     element.splice(index, 1);
    //   });
    //   console.log(dataCopy);
    //   this.data = dataCopy.slice();
    //   this.columnNames.splice(index, 1);
    // }
  }

  clearCompositeIndex() {
    this.compositeIndexSecurities = [];
    this.addModelPortfolioSecurity(0);
    this.newCIName = '';
    // var index = this.columnNames.indexOf('MODEL_PORTFOLIO');
    // console.log(index);
    // if (index >= 0) {
    //   var dataCopy = this.data.slice();
    //   dataCopy.forEach((element) => {
    //     element.splice(index, 1);
    //   });
    //   console.log(dataCopy);
    //   this.data = dataCopy.slice();
    //   this.columnNames.splice(index, 1);
    // }
  }

  onGraphSelect(
    event: ChartSelectionChangedEvent,
    index: number,
    chart: GoogleChartComponent
  ) {
    // console.log();
    var row = null;
    if (event.selection.length > 0) {
      row = event.selection[0].row;
    } else {
      this.selectedAAG = index;
    }

    if (row != null) {
      this.assetAllocationFilter.filter =
        this.graphSettings.assetAllocation[index].data[row][0];
      var assetClassFilters = ['Equity', 'Debt'];
      var equityMarketCapFilters = ['Large Cap', 'Mid Cap', 'Small Cap'];
      if (assetClassFilters.includes(this.assetAllocationFilter.filter)) {
        this.securityExposureFilteredList = this.securityExposureList.filter(
          (it: { Security_Asset_Class: any }) => {
            return it.Security_Asset_Class == this.assetAllocationFilter.filter;
          }
        );
        this.assetAllocationFilter.filterType = 'Asset Class';
      } else if (
        equityMarketCapFilters.includes(this.assetAllocationFilter.filter)
      ) {
        this.securityExposureFilteredList = this.securityExposureList.filter(
          (it: { Equity_Market_Cap: any }) => {
            return it.Equity_Market_Cap == this.assetAllocationFilter.filter;
          }
        );
        this.assetAllocationFilter.filterType = 'Market Cap';
      } else if (this.assetAllocationFilter.filter == 'Other') {
        console.log('LOGGED');
        if (index < 2) {
          this.securityExposureFilteredList = this.securityExposureList.filter(
            (it: { Security_Asset_Class: {} }) => {
              return it.Security_Asset_Class == {};
            }
          );
          this.assetAllocationFilter.filterType = 'Asset Class';
        } else {
          this.securityExposureFilteredList = this.securityExposureList.filter(
            (it: {
              Security_Asset_Class: string;
              Equity_Market_Cap: string | any[];
            }) => {
              return (
                it.Security_Asset_Class == 'Equity' &&
                (it.Equity_Market_Cap.length == 0 ||
                  Object.keys(it.Equity_Market_Cap).length == 0)
              );
            }
          );
          console.log(this.securityExposureFilteredList);
          this.assetAllocationFilter.filterType = 'Market Cap';
        }
      } else if (this.assetAllocationFilter.filter == 'Fixed Income') {
        this.securityExposureFilteredList = this.securityExposureList.filter(
          (it: { Security_Asset_Class: string }) => {
            return it.Security_Asset_Class == 'Debt';
          }
        );
        this.assetAllocationFilter.filterType = 'Asset Class';
      }
      console.log(this.assetAllocationFilter);
    } else {
      this.securityExposureFilteredList = this.securityExposureList;
      this.selectedAAG = null;
    }
    console.log(row);
    chart.chart.setSelection([]);
  }

  removeAssetAllocationFilter() {
    this.securityExposureFilteredList = this.securityExposureList;
    this.assetAllocationFilter = {
      filterType: null,
      filter: null,
    };
  }

  clickBack() {
    this.router.navigate(['/portfolioallocation']);
  }

  public setFocusOnFirstMenuItem(event: KeyboardEvent): void {
    // event.preventDefault();
    if (event.key == 'ArrowDown' || event.key == 'ArrowUp') {
      console.log(event, this.listTrigger.first);
      if (this.listTrigger != null && this.listTrigger.first != null) {
        console.log(this.listTrigger.first.nativeElement);
        this.listTrigger.first.nativeElement.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    event.preventDefault();
    switch (event.key) {
      case 'ArrowUp':
        event.stopPropagation();
        (index === 0
          ? this.listTrigger.last
          : this.listTrigger.get(index - 1)
        ).nativeElement.focus();
        break;
      case 'ArrowDown':
        event.stopPropagation();
        (index === this.listTrigger.length - 1
          ? this.listTrigger.first
          : this.listTrigger.get(index + 1)
        ).nativeElement.focus();
        break;
      case 'Escape':
        event.stopPropagation();
        (index === this.listTrigger.length - 1
          ? this.listTrigger.first
          : this.listTrigger.get(index + 1)
        ).nativeElement.blur();
        this.searchInput.nativeElement.focus();
        break;
    }
  }

  changeExchange() {
    try {
      let index = this.columnNames.indexOf(this.prevSelectedEx);
      if (index != undefined || index != null) {
        this.removeColumn(this.data, index);
        this.columnNames.remove(this.prevSelectedEx);
        this.selectedIndices.remove(this.prevSelectedEx);
        this.indicesList.forEach((el) => {
          if (el.SA_ISIN == this.prevSelectedEx) el['status'] = false;
        });
        if (!this.columnNames.includes(this.selectedExchange)) {
          this.columnNames.push(this.selectedExchange);
          this.selectedIndices.push(this.selectedExchange);
          this.indicesList.forEach((el) => {
            if (el.SA_ISIN == this.selectedExchange) el['status'] = true;
          });
        }
      }
      console.log(this.mainTab);
      switch (this.mainTab) {
        case 'simulation': {
          this.datesChanged();
          break;
        }
        case 'stress-testing': {
          if (this.inBuiltScenarios.length > 0) {
            this.selectedScenario = '';
            this.checkUncheckScenario(this.inBuiltScenarios[0], 'inbuilt', 0);
          }
          break;
        }
        case 'current-portfolio': {
          this.performanceStatisticsList = [];
          this.portfolioStatistics();
          break;
        }
        case 'contributions': {
          var idz = this.graphSettings.contributions[1].columnNames.indexOf(
            this.prevSelectedEx
          );
          this.graphSettings.contributions[1].columnNames.remove(
            this.prevSelectedEx
          );
          this.cummulativeReturnsData.forEach((value) => {
            value.splice(idz, 1);
          });
          let FromDate = moment(this.FromDate).format('YYYY-MM-DD');
          let ToDate = moment(this.ToDate).format('YYYY-MM-DD');
          this.callPerformanceFromContributionWrapper(
            [this.selectedExchange],
            'INDICES',
            FromDate,
            ToDate
          );
          console.log(this.cummulativeReturnsData);
        }
      }
      this.title =
        'Portfolio and Individual Securities v/s ' + this.selectedExchange;
      this.prevSelectedEx = this.selectedExchange;
    } catch (error) {
      console.log(error);
    }
  }

  checkUncheckModelPortfolio(index: number) {
    try {
      var modelPortfolio = this.modelPortfolioList[index];
      console.log(modelPortfolio);
      if (!modelPortfolio.selected) {
        var tempList = this.allModelPortfolioDetails.filter((it) => {
          return it.Portfolio_ID == modelPortfolio.Portfolio_ID;
        });
        console.log(tempList);
        var securities = [];
        tempList.forEach((it) => {
          securities.push(it['Security_Code']);
        });

        let FromDate = moment(this.FromDate).format('YYYY-MM-DD');
        let ToDate = moment(this.ToDate).format('YYYY-MM-DD');
        this.callPerformanceWrapper(
          securities,
          'CUMULATIVERETURN',
          this.selectedExchange,
          FromDate,
          ToDate,
          [],
          'MODEL_PORTFOLIO',
          modelPortfolio['Portfolio_ID']
        );
        this.modelPortfolioList[index]['selected'] = true;
      } else {
        var key =
          modelPortfolio['Portfolio_Name'] +
          '-' +
          modelPortfolio['Portfolio_ID'];
        var idx = this.columnNames.indexOf(key);
        console.log(idx);
        // console.log(JSON.stringify(this.data));
        // console.log(JSON.stringify(this.columnNames));
        this.data = this.removeColumn(this.data, idx).slice();
        this.data.forEach((el) => {
          this.cummulativeReturnsData.set(el[0].toString(), el);
        });
        this.columnNames.remove(key);
        console.log(JSON.stringify(this.data[2]));
        console.log(JSON.stringify(this.columnNames));
        this.modelPortfolioList[index]['selected'] = false;
      }
    } catch (error) {
      console.log(error);
    }
  }

  checkUncheckCompositeIndex(index: number) {
    try {
      var compositeIndex = this.compositeIndexList[index];
      console.log(compositeIndex);
      if (!compositeIndex.selected) {
        var tempList = this.allCustomIndicesDetails.filter((it) => {
          return it.Custom_Index_ID == compositeIndex.Custom_Index_ID;
        });
        console.log(tempList);
        var securities = [];
        tempList.forEach((it) => {
          securities.push(it['Index_Name']);
        });

        let FromDate = moment(this.FromDate).format('YYYY-MM-DD');
        let ToDate = moment(this.ToDate).format('YYYY-MM-DD');
        this.callPerformanceWrapper(
          securities,
          'CUMULATIVERETURN',
          this.selectedExchange,
          FromDate,
          ToDate,
          [],
          'CUSTOM_INDICES',
          compositeIndex['Custom_Index_ID']
        );
        this.compositeIndexList[index]['selected'] = true;
      } else {
        var key =
          compositeIndex['Custom_Index_Name'] +
          '-' +
          compositeIndex['Custom_Index_ID'];
        var idx = this.columnNames.indexOf(key);
        console.log(idx);
        // console.log(JSON.stringify(this.data));
        // console.log(JSON.stringify(this.columnNames));
        this.data = this.removeColumn(this.data, idx).slice();
        this.data.forEach((el) => {
          this.cummulativeReturnsData.set(el[0].toString(), el);
        });
        this.columnNames.remove(key);
        console.log(JSON.stringify(this.data[2]));
        console.log(JSON.stringify(this.columnNames));
        this.compositeIndexList[index]['selected'] = false;
      }
    } catch (error) {
      console.log(error);
    }
  }

  deleteModelPortfolio(index: number) {
    try {
      var portfolio = this.modelPortfolioList[index];
      this.portfolioAnalyticsService
        .deleteModelPortfolios(
          portfolio['Portfolio_ID'],
          portfolio['Portfolio_Name'],
          this.Customerid,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode
        )
        .subscribe((res) => {
          if (res != null && res != undefined) {
            this.modelPortfolioList.splice(index, 1);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  deleteCompositeIndex(index: number) {
    try {
      var compositeIndex = this.compositeIndexList[index];
      this.portfolioAnalyticsService
        .deleteCustomIndices(compositeIndex['Custom_Index_ID'])
        .subscribe((res) => {
          if (res != null && res != undefined) {
            this.compositeIndexList.splice(index, 1);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  viewModelPortfolio(index: number) {
    try {
      var portfolio = this.modelPortfolioList[index];
      this.selectedMP = portfolio['Portfolio_ID'];
      console.log(portfolio);
      var securities = this.allModelPortfolioDetails.filter(
        (it) => it['Portfolio_ID'] == this.selectedMP
      );
      this.modelPortfolioSecurities = [];
      securities.forEach((el, idx) => {
        this.addModelPortfolioSecurity(idx);
        this.modelPortfolioSecurities[idx].securityName = el.Security_Name;
        this.modelPortfolioSecurities[idx].code = el.Security_Code;
        this.modelPortfolioSecurities[idx].weight = el.Security_Weight;
      });
      console.log(this.modelPortfolioSecurities);
      this.newMPName = portfolio['Portfolio_Name'];
      this.isSelectedMPView = true;
    } catch (error) {
      console.log(error);
    }
  }

  viewCompositeIndex(index: number) {
    try {
      var compositeIndex = this.compositeIndexList[index];
      this.selectedCI = compositeIndex['Custom_Index_ID'];
      console.log(this.allCustomIndicesDetails);
      var securities = this.allCustomIndicesDetails.filter(
        (it) => it['Custom_Index_ID'] == this.selectedCI
      );
      this.compositeIndexSecurities = [];
      securities.forEach((el, idx) => {
        this.addModelPortfolioSecurity(idx);
        this.compositeIndexSecurities[idx].securityName = el.Index_Name;
        this.compositeIndexSecurities[idx].code = el.Index_Code;
        this.compositeIndexSecurities[idx].weight = el.Index_Weight;
      });
      console.log(this.compositeIndexSecurities);
      this.newCIName = compositeIndex['Custom_Index_Name'];
      this.isSelectedCIView = true;
    } catch (error) {
      console.log(error);
    }
  }

  toggleMP() {
    this.isAddNewMP = false;
    this.isSelectedMPEdit = false;
    this.isSelectedMPView = false;
    this.isModelPortfolio = !this.isModelPortfolio;
    if (this.isModelPortfolio && this.modelPortfolioList.length == 0)
      this.getAllModelPortfolios();
  }

  toggleCI() {
    this.isAddNewCI = false;
    this.isSelectedCIEdit = false;
    this.isSelectedCIView = false;
    this.isCompositeIndex = !this.isCompositeIndex;
    if (this.isCompositeIndex && this.compositeIndexList.length == 0)
      this.getListOfCompositeIndices();
  }

  MPback() {
    this.isAddNewMP = false;
    this.isSelectedMPView = false;
    this.isSelectedMPEdit = false;
    this.clearModelPortfolio();
  }

  CIback() {
    this.isAddNewCI = false;
    this.isSelectedCIView = false;
    this.isSelectedCIEdit = false;
    this.clearCompositeIndex();
  }

  updateCompositeIndexDetails() {
    try {
      this.portfolioAnalyticsService
        .updateCustomIndices(
          this.Customerid,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode,
          this.newCIName,
          this.selectedCI,
          this.newCIdetails
        )
        .subscribe(
          (res) => {
            if (res != null && res != undefined) {
              this.compositeIndexFlag = 'PASS';
              this.clearCompositeIndex();
              this.isSelectedCIEdit = false;
            } else {
              this.compositeIndexFlag = 'FAIL';
            }
            this.getListOfCompositeIndices();
            this.newCIName = '';
          },
          (err) => {
            console.log(err);
            this.compositeIndexFlag = 'FAIL';
          }
        );
    } catch (error) {
      console.log(error);
    }
  }

  updateModelPortfolioDetails() {
    try {
      this.portfolioAnalyticsService
        .updateModelPortfolio(
          this.Customerid,
          this.portfolioDetails[this.selectedPortfolio].FacilityCode,
          this.newMPName,
          this.selectedMP,
          this.newMPdetails
        )
        .subscribe(
          (res) => {
            if (res != null && res != undefined) {
              this.modelPortfolioFlag = 'PASS';
              this.clearModelPortfolio();
              this.isSelectedMPEdit = false;
            } else {
              this.modelPortfolioFlag = 'FAIL';
            }
            this.getAllModelPortfolios();
            this.newMPName = '';
          },
          (err) => {
            console.log(err);
            this.modelPortfolioFlag = 'FAIL';
          }
        );
    } catch (error) {
      console.log(error);
    }
  }

  addNewMP() {
    this.isAddNewMP = true;
    this.clearModelPortfolio();
  }

  addNewCI() {
    this.isAddNewCI = true;
    this.clearCompositeIndex();
  }
}
