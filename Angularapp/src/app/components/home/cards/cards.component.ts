import { HomeApiService } from './../../../services/home-api.service';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked,
  ElementRef,
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CustomerApiService } from '../../../services/customer-api.service';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import { CollateralApiService } from '../../collateral/collateral-api/collateral-api.service';
import { ApifunctionService } from '../../fx-order/apifunction.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { ThemeserviceService } from './../../../themeService/themeservice.service';
import { AppConfig } from 'src/app/services/config.service';
import * as xml2js from 'xml2js';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from 'src/app/pipes/safe.pipe';
declare var require: any;
// Changed by MohanP | 2FEB22

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() card: string;
  @Input() col: any;
  Summaryflag: boolean;
  mfList: any[];
  selectedRMCustomerDetails: {
    custName: string;
    custId: string;
    userName: string;
    cif: string;
  };
  mode: any;
  isUserRM: boolean;
  legends: any[];
  legendFlag: boolean;
  cardString: string;

  @Input() get CustomerDetails() {
    return this.selectedRMCustomerDetails;
  }
  set CustomerDetails(CustomerDetails) {
    this.selectedRMCustomerDetails = CustomerDetails;
    // console.log(this.selectedRMCustomerDetails);
  }
  @Input() get Mode() {
    return this.mode;
  }
  set Mode(Mode) {
    this.mode = Mode;
    this.isUserRM = this.mode === 'RM';
    // console.log(this.mode);
  }

  domainURL = environment.domainURL;
  isSSL = environment.isSSL;
  sslURL = environment.sslURL;
  graphdata: any;
  title = 'Portfolio Details';
  type = 'PieChart';
  data = [];
  eventData = [];
  months: any[] = [
    'Jan',
    'Feb,"Mar',
    'Apr',
    'May',
    'Jun',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  event1 = '';
  isProd = environment.production;
  columnNames = ['Browser', 'Percentage'];
  image = [];
  Pieoptions: {};
  tabsArray = [
    {
      tabName: 'Watchlist',
      tabshow: true,
      column: '1',
    },
    {
      tabName: 'Balance',
      tabshow: true,
      column: '2',
    },
    {
      tabName: 'Limits and Collateral',
      tabshow: true,
      column: '2',
    },
    {
      tabName: 'Latest Transactions',
      tabshow: true,
      column: '2',
    },
    {
      tabName: 'Cash Balance',
      tabshow: true,
      column: '2',
    },
    {
      tabName: 'Performace',
      tabshow: true,
      column: '3',
    },
    {
      tabName: 'Portfolio Allocation',
      tabshow: true,
      column: '3',
    },
    {
      tabName: 'Market Watch',
      tabshow: true,
      column: '4',
    },
    {
      tabName: 'Top Performing Assets',
      tabshow: true,
      column: '4',
    },
    {
      tabName: 'My profile',
      tabshow: true,
      column: '5',
    },
    {
      tabName: 'Insurance',
      tabshow: true,
      column: '5',
    },
    {
      tabName: 'News',
      tabshow: true,
      column: '5',
    },
    {
      tabName: 'Capital and Limits tracker',
      tabshow: true,
      column: '5',
    },
    {
      tabName: 'Upcoming Events',
      tabshow: true,
      column: '5',
    },
    {
      tabName: 'FX Rates',
      tabshow: true,
      column: '5',
    },

    {
      tabName: 'Sakshi 1',
      tabshow: true,
      column: '5',
    },
    {
      tabName: 'Sakshi 2',
      tabshow: true,
      column: '5',
    },
    {
      tabName: 'Sakshi 3',
      tabshow: true,
      column: '5',
    },
    {
      tabName: 'Sakshi 5',
      tabshow: true,
      column: '5',
    },
  ];
  ccyPair = [];
  previousIndex = 0;
  ratesBuy = [];
  ratesSell = [];
  Pips = [];
  width = document.documentElement.clientWidth;
  height = document.documentElement.clientWidth;
  // options={};
  // chartColors = ['#9BD4F5', '#3895D3', '#6CC4EE', '#0C426E', '#1261A0', '#24a8f0'];
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
  // chartColors = ['#5E5CE6', '#FF9500', '#6CC4EE', '#0C426E', '#1261A0', '#24a8f0'];
  totalHoldings: any;
  // portfolioData = [];
  holdings = [];
  folioName = [];
  facilityCode = [];
  performance = [];
  userID: string;
  watchlistName: string;
  sendNewWatchlistName: string;
  closeGrid = false;
  closePie = false;
  closeColumn = false;
  closeBar = false;
  closePoster = false;
  pageName = 'Dashboard';
  options = {
    pieHole: 0.8,
    pieSliceText: 'none',
    borderWidth: 3,
    slices: {
      4: { offset: 0.2 },
    },
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
    colors: this.chartColors,
    width: '350',
    height: '210',
    hAxis: {
      textStyle: {
        color: '#808080',
      },
      gridlines: {
        color: 'transparent',
      },
    },
    vAxis: {
      textStyle: {
        color: '#808080',
      },
      gridlines: {
        color: 'transparent',
      },
    },
    titleTextStyle: {
      color: '#808080',
    },
    // backgroundColor: '#FFFFFF00',
    chartArea: { left: 10, top: 10, width: '100%', height: '100%' },

    // colors: ['#d4ab8b', '#ccb6a6', '#c8936a', '#ba7845'],
  };
  showChart = false;

  pieoptions = {
    pieHole: 0.5,
    legend: {
      position: 'right',
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: 'both',
    },
    colors: this.chartColors,
    width: '550',
    height: '350',
    hAxis: {
      textStyle: {
        color: '#808080',
      },
    },
    vAxis: {
      textStyle: {
        color: '#808080',
      },
    },
    titleTextStyle: {
      color: '#808080',
    },
    // backgroundColor: '#FFFFFF00',
    chartArea: { left: 20, top: 0, width: '100%', height: '100%' },
    // colors: ['#d4ab8b', '#ccb6a6', '#c8936a', '#ba7845'],
  };

  areaTitle = '';
  areaType = 'AreaChart';
  areaData = [
    ['2013', 1000, 400],
    ['2014', -1170, 460],
    ['2015', 660, 1120],
    ['2016', 1030, 540],
  ];
  areaColumnNames = ['Year', 'Sales'];
  areaOptions = {
    width: '400',
    height: '300',
    legend: 'none',
    colors: this.chartColors,
    backgroundColor: { fill: 'transparent' },
    hAxis: {
      textStyle: {
        color: '#808080',
      },
    },
    vAxis: {
      textStyle: {
        color: '#808080',
      },
    },
    titleTextStyle: {
      color: '#808080',
    },
  };
  view: any[] = [350, 350];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  datachart = [];
  cashbalance = [];
  cashccy = [];
  insuranceDetails = [];
  newsURL = [];
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
    width: '300',
    height: '250',
    colors: this.chartColors,
    backgroundColor: { fill: 'transparent' },
    chartArea: { left: 20, top: 20, width: '100%', height: '100%' },
    hAxis: {
      textStyle: {
        color: '#808080',
      },
    },
    vAxis: {
      textStyle: {
        color: '#808080',
      },
    },
    titleTextStyle: {
      color: '#808080',
    },
  };
  assetAlloc = [];
  pnlAlloc = [];
  title5 = '';
  pnlbestType = 'ColumnChart';
  pnlbestdata = [];
  pnlworstdata = [];
  columnNames5 = ['Year', 'Asia'];
  // pnlbestoptions = {
  //   width: '350',
  //   height: '300',
  //   legend: 'none',
  //   colors: this.chartColors

  // };
  // added by vedika
  pnlbestoptions = {
    width: '600',
    height: '400',
    legend: 'none',
    colors: this.chartColors,
    hAxis: {
      slantedText: true,
      slantedTextAngle: 45,
      textStyle: {
        color: '#808080',
      },
    },
    vAxis: {
      textStyle: {
        color: '#808080',
      },
    },
    backgroundColor: { fill: 'transparent' },
    titleTextStyle: {
      color: '#808080',
    },
  };
  pnloptions = {
    width: '400',
    height: '300',
    legend: 'none',
    colors: this.chartColors,
    hAxis: {
      slantedText: true,
      slantedTextAngle: 45,
      textStyle: {
        color: '#808080',
      },
      gridlines: {
        color: 'transparent',
      },
    },
    vAxis: {
      textStyle: {
        color: '#808080',
      },
      gridlines: {
        color: 'transparent',
      },
    },
    backgroundColor: { fill: 'transparent' },
    titleTextStyle: {
      color: '#808080',
    },
  };
  pnltitle = 'Top performing assets by PnL';

  limittitle = 'Capital and Limit Tracker';
  limittype = 'BarChart';
  limitdata = [];
  limitcolumnNames = ['limit', 'Amount'];
  limitoptions = {
    width: '400',
    height: '320',
    legend: 'none',
    colors: this.chartColors,
    // hAxis: {
    //   slantedText: true,
    //   slantedTextAngle: 45,
    // },
    titleTextStyle: {
      color: '#808080',
    },
    backgroundColor: { fill: 'transparent' },

    hAxis: {
      textStyle: {
        color: '#808080',
      },
      gridlines: {
        color: 'transparent',
      },
    },
    vAxis: {
      textStyle: {
        color: '#808080',
      },
      gridlines: {
        color: 'transparent',
      },
    },
  };
  popuperror = '';
  limitwidth = 550;
  limitheight = 400;
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
  tab11Error = '';
  background: any;
  portfoliopopflag: boolean;
  Selectedportfolio = '';
  selectedfacilityCode = '';
  currency = '';
  cusotmerName = '';
  custPortfolioPerformance: any = [];
  username: string;
  news = [];
  newsPublishAt = [];
  AUM: number;
  pnl = 0;
  CRR = '';
  freecash = 0;
  contactNo: any;
  custEmail: any;
  latestTransction: any[] = [];
  portfolioperfdata: any[] = [];
  portfolioperfdatashow: any[] = [];
  lastUpdteOn: any;
  kycUpdteOn: any;
  iskyc = false;
  isprofit: boolean;
  today: any;
  marketWatch = [];
  multiportfolio = [];
  RiskProfile = '';
  portfolioperfdataPeriodic: any[] = [];
  multiportfoliodata: Subscription;
  performancedata: Subscription;
  ClientAllocSubscriber: Subscription;
  custData: Subscription;
  insPrem: Subscription;
  allCAData: Subscription;
  FxRates: Subscription;
  noDataFlag = false;
  AllProductEventCA = [] as any;
  eventsArray: any[] = [];
  currentDate: any;
  firstDay: any;
  lastDay: any;
  dayOne = '';
  dayLast = '';
  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  isCurrentPerf = true;
  showhistddl: boolean;
  histPeriod: any;
  paymentHistory = [];
  sumassured: any;
  loanAmt: any;
  ODAmt: any;
  liabilitiesTotal = 0;
  globalMarginData: any = [];
  exposureDetailsData: any = [];
  totalExposure = 0;
  error = '';
  limitGlobalMarginData: any;
  limitCollateralData: any;
  liquidDetails: any;
  ShortfallStatus: any;
  ShortfallAmount: any;
  ShortfallSince: any;
  nonLiquidDetails: any;
  Total: any;
  limitchartData: any = [];
  viewBy: string;
  template: any;
  portfolios = [];
  eventtype: string;
  period: string;
  shortfallStatusColor: string;
  currentTheme: string;
  isLoading: boolean;
  EntityId: any;

  Year: any;
  Month: any;
  DateP: any;
  fromDate: any;
  toDate: any;
  baseCCY: any;
  // username: any;
  userType: any;
  // entityID: any;
  icon: any;
  Months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  spData = [];
  // width: any;
  // height: any;
  gridColumn: any;
  postercolumn: any;
  alignment = [];
  // chartColors = ['#dfc2e4', '#fbe19f', '#9ad3f0', '#bce4b1', '#ed7d31', '#a5a5a5', '#619010', '#388a90', '#6143b7', '#a3085f', '#85593d', '#878787', '#b19c0c'];
  lblError = '';
  // options = {};
  columnOptions = {};
  chartdata = [];
  showTile = true;
  expand = false;
  showSettings = false;
  filterdata = [];
  TimePeriodFilter = [];
  imgUrl: string;
  // Dashboard_Detail: any = [];
  scenarioDataValue: any = [];
  showDashboard = false;
  emailURL: string;
  watchlistSetup: any = [];
  watchlist: any[];

  //Added by Uddesh on Jan 27, 2022
  newWatchlistTemp: any[];
  selectedWatchlist: any;

  //Added by Uddesh on 1 Feb 2022
  wlNameInputClicked: boolean;
  // isProd = environment.production;
  // ['25-Jun-2020', 299290.4],
  // ['03-Jun-2020', 98017],
  // ['17-Jun-2020', 299290.4],
  // ['09-Jun-2020', 299290.4]
  // title = 'my-drag-drop';
  // image = [];
  holdinghistorypopupflag: any = [];
  Selectedassetlongname = '';
  holdinghistorydetails = [];
  private safePipe: SafePipe = new SafePipe(this.domSanitizer);
  // public portfolioChartOptions: Partial<ChartOptions>;
  portfolioColorsArray: string[];
  newWatchlist: boolean;
  //Changed by MohanP | 2Feb22
  collateralDetailsData: any;
  constructor(
    private api: WorkflowApiService,
    private router: Router,
    public afs: CustomerApiService,
    public cfs: CommonApiService,
    private collApi: CollateralApiService,
    public ref: ChangeDetectorRef,
    public homeApi: HomeApiService,
    public elem: ElementRef,
    public themeService: ThemeserviceService,
    public fxApi: ApifunctionService,
    public authApi: AuthService,
    private domSanitizer: DomSanitizer,
    public commonApi: CommonApiService
  ) {
    this.isprofit = false;
    this.today = '';
    this.Customerid = '';
    this.histPeriod = 'QUARTERLY';
    this.popuperror = '';
    this.paymentHistory = [];
    this.Total = {};
    this.limitGlobalMarginData = {};
    this.limitCollateralData = {};
    this.liquidDetails = {};
    this.ShortfallStatus = '-';
    this.ShortfallAmount = '-';
    this.nonLiquidDetails = {};
    this.ShortfallSince = '';
    // this.AUM = '0';
    // this.pnl = 0;
    this.graphdata = [];
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
    this.newWatchlist = false;
    this.newWatchlistTemp = [];
    this.sendNewWatchlistName = '';
  }
  reset() {
    this.datachart = [];
    this.cashbalance = [];
    this.cashccy = [];
    this.insuranceDetails = [];
    this.newsURL = [];
    this.assetAlloc = [];
    this.pnlAlloc = [];
    this.pnlbestdata = [];
    this.pnlworstdata = [];
    this.limitdata = [];
    this.CashHoldings = [];
    this.SecurityHoldings = [];
    this.portfolioDetails = [];
    this.bestPortfolio = [];
    this.worstPortfolio = [];
    this.custPortfolioPerformance = [];
    this.news = [];
    this.newsPublishAt = [];
    this.latestTransction = [];
    this.portfolioperfdata = [];
    this.portfolioperfdatashow = [];
    this.marketWatch = [];
    this.multiportfolio = [];
    this.portfolioperfdataPeriodic = [];
    this.eventsArray = [];
    this.paymentHistory = [];
    this.globalMarginData = [];
    this.exposureDetailsData = [];
    this.limitchartData = [];
    this.portfolios = [];
    this.spData = [];
    this.alignment = [];
    this.chartdata = [];
    this.filterdata = [];
    this.TimePeriodFilter = [];
    this.scenarioDataValue = [];
    this.watchlistSetup = [];
    this.holdinghistorypopupflag = [];
    this.holdinghistorydetails = [];
    this.CRR = '';
    this.AUM = 0;
    this.pnl = 0;
    this.freecash = 0;
    this.wlNameInputClicked = false;
  }
  ngOnDestroy() {
    // this.FXOBestPriceSubscription.next();
    // this.FXOBestPriceSubscription.complete();
    this.portfoliopopflag = false;
    this.homeApi.openPopup = false;
    if (![undefined, null].includes(this.FxRates)) {
      this.FxRates.unsubscribe();
      this.FxRates = null;
    }
  }
  ngAfterViewChecked() {
    // //console.log("out")
    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByTagName('rect'),
      (rect: HTMLElement) => {
        if (rect.getAttribute('fill') === '#ffffff') {
          // //console.log("hello")
          rect.setAttribute('fill', '#ffffff00');
        }
      }
    );
    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByTagName('path'),
      (path: HTMLElement) => {
        if (path.getAttribute('stroke') === '#ffffff') {
          // //console.log("hello")
          path.setAttribute('stroke-width', '0');
        }
      }
    );
  }

  ngOnInit(): void {
    this.EntityId = this.authApi.EntityID;

    // this.baseCCY = sessionStorage.getItem("BankBaseCcy");
    // this.baseCCY = AppConfig.settings.BankBaseCCy;
    // sessionStorage.setItem('BankBaseCcy', this.baseCCY);
    this.afs.getBankBaseCCYOBS.subscribe((ccy) => {
      this.baseCCY = ccy;
    });
    if (this.card !== undefined) {
      this.cardString = this.card;
      this.background = this.cardString.includes('&')
        ? this.cardString.split('&')[1].split('.')[0]
        : this.cardString;
      this.card = this.card.includes('&') ? this.card.split('&')[0] : this.card;
      // console.log(this.card);
    }

    this.themeService.themeEmitObs.subscribe((themeres) => {
      this.currentTheme = themeres;
      if (this.currentTheme !== 'dark') {
        this.background = 'card-white';
      } else {
        if (this.card !== undefined) {
          // this.cardString = this.card;
          this.background = this.cardString.includes('&')
            ? this.cardString.split('&')[1].split('.')[0]
            : this.cardString;
          this.card = this.card.includes('&')
            ? this.card.split('&')[0]
            : this.card;
          // console.log(this.card);
        }
      }
      // this.changeTheme(sessionStorage.getItem('activeTheme'));
      // this.currentTheme = sessionStorage.getItem('activeTheme');
    });

    // case 'Balance': break;
    // case 'Limits and Collateral': break;
    // case 'Latest Transaction': break;
    // case 'Cash Balance': break;
    // case 'Performance': break;
    // case 'Portfolio Allocation': break;
    // case 'Market Watch': break;
    // case 'Top Performing Assets': break;
    // case 'My Profile': break;
    // case 'Insurance': break;
    // case 'News': break;

    // document.body.scrollTop = 0;
    // document.documentElement.scrollTop = 0;
    this.today = new Date();
    if (this.authApi.UserType === 'RM') {
      this.isUserRM = true;
      this.username = sessionStorage.getItem('RMUser');
      this.Customerid = this.homeApi.CustomerId;
      this.cusotmerName = this.homeApi.CustomerDisplayName;
    } else {
      this.isUserRM = false;
      this.username = sessionStorage.getItem('Username');
      this.Customerid = this.homeApi.CustomerId;
      this.cusotmerName = this.homeApi.CustomerDisplayName;
    }
    this.portfolio = this.homeApi.Portfolio;

    this.currency = this.homeApi.Currency;
    this.contactNo = this.homeApi.ContactNo;
    this.custEmail = this.homeApi.CustEmail;
    this.emailURL = 'mailto:' + this.custEmail;
    this.RiskProfile = this.homeApi.RiskProfile;

    switch (this.card) {
      case 'WatchList':
        // case 'Watchlist':
        try {
          // const Customerid = this.isUserRM
          //   ? this.selectedRMCustomerDetails.custId
          //   : this.Customerid;
          // this.afs
          //   .getPledgedAgainstData('CSP_WatchlistColor')
          //   .subscribe((res) => {
          //     if (res) {
          //       console.log(res);
          //       this.watchlistSetup = res.Get_Configurable_Common_DataResult;
          //       this.homeApi
          //         .GetMarketWatch(Customerid, this.homeApi.Portfolio || '')
          //         .subscribe((res: any) => {
          //           if (res.length !== 0) {
          //             this.watchlist = [];
          //             res.forEach((element) => {
          //               this.watchlistSetup.forEach((setup) => {
          //                 if (
          //                   parseFloat(element.Change) >=
          //                     parseFloat(setup.Misc2) &&
          //                   parseFloat(element.Change) < parseFloat(setup.Misc1)
          //                 ) {
          //                   this.watchlist.push([element, setup.DATA_VALUE]);
          //                 }
          //               });
          //             });
          //             this.watchlist.sort((a, b) => {
          //               return b[0].Change - a[0].Change;
          //             });
          //             // console.log(this.watchlist)
          //           }
          //         });
          //     }
          //   });
        } catch (ex) {
          console.log('Error occured while loading Market Watch card :', ex);
        }
        break;
      case 'Balance':
        try {
          this.CRR = this.homeApi.CRR;
          this.AUM = this.homeApi.AUM;
          this.pnl = this.homeApi.PNL;
          this.homeApi
            .GetFreeCash(this.username, this.Customerid, null, this.baseCCY)
            .subscribe((res: any) => {
              if (res.length !== 0) {
                if (
                  res.ListCTPDashboardCashResponse.ResponseDetails
                    .Description === 'success.'
                ) {
                  this.freecash = this.homeApi.freecash =
                    res.ListCTPDashboardCashResponse.items[0].Total_Market_Value;
                }
              }
            });
          // this.freecash = this.homeApi.freecash;
          this.showPortfolio = true;
          this.isprofit = false;
          if (this.pnl > 0) {
            this.isprofit = true;
          } else {
            this.isprofit = false;
          }
        } catch (ex) {
          console.log('Error occured while loading Balance card :', ex);
        }

        break;
      case 'Limits and Collateral':
        try {
          this.collApi
            .GetGlobalMarginReportDataV2(
              this.Customerid,
              '10',
              this.username,
              '',
              '',
              'limitCollateral',
              this.baseCCY
            )
            .subscribe((d: any) => {
              if (d.DB_Get_GlobalMarginReportData_LCYEResult) {
                this.limitCollateralData =
                  d.DB_Get_GlobalMarginReportData_LCYEResult;
                this.globalMarginData =
                  d.DB_Get_GlobalMarginReportData_LCYEResult[0];
                this.processLimitCollateralData();
              }
            });
          this.collApi
            .GetGlobalMarginReportDataV2(
              this.Customerid,
              '8',
              this.username,
              this.Customerid,
              '',
              'collateralDetails',
              this.baseCCY
            )
            .subscribe((d: any) => {
              if (d.DB_Get_GlobalMarginReportData_LCYEResult) {
                this.collateralDetailsData =
                  d.DB_Get_GlobalMarginReportData_LCYEResult;
                this.processCollateralDetailsData();
              }
            });
          this.collApi
            .GetGlobalMarginReportDataV2(
              this.Customerid,
              '9',
              this.username,
              this.Customerid,
              '',
              'exposureDetails',
              this.baseCCY
            )
            .subscribe((d: any) => {
              if (d.DB_Get_GlobalMarginReportData_LCYEResult) {
                this.exposureDetailsData =
                  d.DB_Get_GlobalMarginReportData_LCYEResult;
                this.processExposureDetailsData();
              }
            });
        } catch (ex) {
          console.log(
            'Error occured while loading Limits and collateral card :',
            ex
          );
        }
        break;
      case 'Latest Transactions':
        try {
          this.homeApi
            .GetLatestTransaction(
              this.Customerid,
              this.homeApi.Portfolio || null
            )
            .subscribe((res: any) => {
              if (res !== 0) {
                this.latestTransction = res;
              }
            });
          break;
        } catch (ex) {
          console.log(
            'Error occured while loading Latest transaction card :',
            ex
          );
        }
        break;
      case 'Cash Balance':
        try {
          this.homeApi
            .GetCustPortfolioCashHoldings(
              this.Customerid,
              this.homeApi.Portfolio || ''
            )
            .subscribe((res: any) => {
              if (res.length !== 0) {
                this.tab4Error = '';
                for (let i = 0; i < res.length; i++) {
                  this.cashccy[i] = res[i].Currency;
                  this.cashbalance[i] = res[i].Cashbalance;
                }
              } else {
                this.tab4Error = 'Data not available.';
              }
            });
        } catch (ex) {
          console.log('Error occured while loading Cash balance card :', ex);
        }
        break;
      case 'Performance':
        try {
          this.homeApi
            .GetCustPortfolioPerformance(
              this.Customerid,
              this.baseCCY,
              this.homeApi.Portfolio || null
            )
            .subscribe((res: any) => {
              if (res.length !== 0) {
                this.portfolioperfdata = [];
                res.forEach((element) => {
                  if (element.cehdsf_record_date.split('(')[1]) {
                    element.cehdsf_record_date = this.epochtoFormatted(
                      element.cehdsf_record_date
                        .split('(')[1]
                        .split('+')[0]
                        .substring(0, 10)
                    );
                  }
                });
                res.forEach((element) => {
                  this.portfolioperfdata.push([
                    // element.cehdsf_record_date.slice(0, -5),
                    element.cehdsf_record_date,
                    element.MarketValueLCYE,
                  ]);
                });
                // console.log('HELLOOOO', this.portfolioperfdata);
                this.tab2Error = '';
              } else {
                this.tab2Error = 'No Data available for Performance';
              }
            });

          this.homeApi
            .GetCustPortPerformancePeriodic(
              this.Customerid,
              'QUARTERLY',
              this.baseCCY,
              this.homeApi.Portfolio || null
            )
            .subscribe((res: any) => {
              if (res !== 0) {
                this.portfolioperfdataPeriodic = [];
                res.forEach((element) => {
                  this.portfolioperfdataPeriodic.push([
                    element.Quarter,
                    element.MarketValueLCYE,
                  ]);
                });
              }
            });
          console.log(this.portfolioperfdataPeriodic);
        } catch (ex) {
          console.log('Error occured while loading Performance card :', ex);
        }
        break;
      case 'Portfolio Allocation':
        try {
          this.bestPortfolio = this.homeApi.BestPortfolio;
          const portfolioData = [];
          // console.log(this.bestPortfolio);
          this.bestPortfolio.forEach((element, i) => {
            if (parseInt(element.TotalAUM, 10) > 0) {
              this.folioName.push(
                element.PortfolioName + ' (' + element.InvestmentObjective + ')'
              );
              this.holdings.push(element.TotalAUM);
              this.facilityCode.push(element.FacilityCode);
              portfolioData.push({
                title: element.PortfolioName,
                value: parseFloat(element.TotalAUM),
                color: this.portfolioColorsArray[i],
              });
            }
          });
          this.graphdata = portfolioData;
          // this.portfolioChartOptions.labels = this.graphdata.map(
          //   (d: any) => d.PortfolioName
          // );

          // this.portfolioChartOptions.series = this.graphdata.map((d: any) =>
          //   parseFloat(d.AUM || 0)
          // );
          // y: this.commonApi.formatNumber(parseFloat(d.AUM || 0)),
          // console.log(this.portfolioChartOptions.series);
          // this.portfolioChartOptions.tooltip = {
          //   enabled: true,
          //   y: {
          //     formatter: (val) => {
          //       return this.commonApi.formatNumber(val);
          //     },
          //     title: {
          //       formatter: function (_seriesName) {
          //         return _seriesName;
          //       },
          //     },
          //   },
          // };
          // this.portfolioChartOptions.colors = this.graphdata.map(
          //   (d) => d.color
          // );
          // console.log(this.portfolioChartOptions, this.graphdata);

          this.CRR = this.homeApi.CRR;
          this.AUM = this.homeApi.AUM;
          this.pnl = this.homeApi.PNL;

          if (
            this.homeApi.RediretToHomeBuySellPledge !== '' &&
            this.homeApi.openPopup === true
          ) {
            // this.portfoliopopflag = true; //Changes done by Alolika G on 11-02-2022
            // this.homeApi.RediretToHomeBuySellPledge = '';

            this.Selectedportfolio = this.homeApi.Selectedportfolio; //Changes done by Alolika G on 10-02-2022
            this.selectedfacilityCode = this.homeApi.SelectedFacilityCode;
            // this.selectedfacilityCode = this.facilityCode[row];
            // this.homeApi.RediretToHomeBuySellPledge = this.Selectedportfolio;
          }
        } catch (ex) {
          console.log(
            'Error occured while loading Portfolio Allocation card :',
            ex
          );
        }

        break;
      case 'Market Watch':
        try {
          this.homeApi
            .GetMarketWatch(this.Customerid, this.homeApi.Portfolio || '')
            .subscribe((res: any) => {
              if (res.length !== 0) {
                this.marketWatch = [];
                this.homeApi.marketWatchBS.next(res);
                res.forEach((element) => {
                  if (element.Change <= 0) {
                    this.marketWatch.push([element, false]);
                  } else {
                    this.marketWatch.push([element, true]);
                  }
                });
                // this.marketWatch = this.marketWatch.sortBy('Misc1');
              }
            });
        } catch (ex) {
          console.log('Error occured while loading Market Watch card :', ex);
        }
        break;
      case 'Top Performing Assets':
        try {
          this.homeApi
            .GetClientWisePnL(
              this.Customerid,
              this.baseCCY,
              this.homeApi.Portfolio || ''
            )
            .subscribe((res: any) => {
              if (res.length !== 0) {
                this.tab5Error = '';
                this.bestPortfolio = res.GetClientWisePnL_LCYEResult;
                this.pnlbestdata = [];
                this.bestPortfolio
                  .map((pnl) => {
                    return {
                      Code: pnl.Code,
                      UnRealizedPnL: parseFloat(pnl.UnRealizedPnL),
                    };
                  })
                  .forEach((data) => {
                    this.pnlbestdata.push([data.Code, data.UnRealizedPnL]);
                  });
                this.pnlbestdata = this.pnlbestdata.slice(0, 4);
              } else {
                this.tab5Error = 'Data not available.';
              }
            });
        } catch (ex) {
          console.log(
            'Error occured while loading Top performing assets card :',
            ex
          );
        }
        break;

      case 'My Profile':
        this.custEmail = this.homeApi.CustEmail;
        this.contactNo = this.homeApi.ContactNo;
        this.lastUpdteOn = this.homeApi.LastUpdatedOn;
        this.kycUpdteOn = this.homeApi.KYCUpdatedOn;
        this.CRR = this.homeApi.CRR;

        break;
      case 'Insurance':
        this.homeApi
          .GetCustInsuranceDetails(
            this.Customerid,
            this.username,
            this.EntityId,
            this.baseCCY,
            this.homeApi.Portfolio || ''
          )
          .subscribe((res: any) => {
            if (res) {
              this.sumassured = 0;
              res.Get_CustInsuranceDetails_LCYEResult.forEach((element) => {
                this.sumassured =
                  this.sumassured + parseFloat(element.Sum_Assured_LCYECcy);
              });
            }
          });

        this.homeApi
          .GetInsurancePremiumDetails(
            this.authApi.UserName,
            this.homeApi.CustomerId,
            this.baseCCY,
            this.homeApi.Portfolio || ''
          )
          .subscribe((res: any) => {
            if (res.length !== 0) {
              if (res.GetInsurancePremiumDetails_LCYEResult.length > 0) {
                res.GetInsurancePremiumDetails_LCYEResult.forEach((element) => {
                  const data = element.InsuranceDetail;
                  if (data[9].Value === 'Due') {
                    data[6].Value = this.toShortFormat(new Date(data[6].Value));
                    this.paymentHistory.push(data);
                  }
                });
              } else {
                this.paymentHistory = [];
              }
              this.paymentHistory.sort((a, b) => {
                const dateA: any = new Date(a[6].Value);
                const dateB: any = new Date(b[6].Value);
                return dateA - dateB;
              });
            }
          });
        break;
      case 'News':
        this.homeApi.getLiveNews(this.username).subscribe((res) => {
          if (
            res.ListFetchNewsDetailsResponse.ResponseDetails.Description ===
            'Success.'
          ) {
            res = res.ListFetchNewsDetailsResponse.items;
            this.news = [];
            res.forEach((news) => {
              this.news.push(news.Headline);
              this.newsPublishAt.push(
                moment(news.News_Publish_At, 'MM-DD-YYYY').fromNow(true)
              );
              // this.api.getNewsImage(news.News_ID);
              this.homeApi.getNewsImage(news.News_ID).subscribe((img) => {
                // DO NOT REMOVE
                if (img.length !== 0) {
                  if (this.isSSL) {
                    this.newsURL.push(
                      this.safePipe.transform(
                        img.URL.replace(
                          /\b(http:\/\/)(?:\d{1,3}\.){3}\d{1,3}\b/g,
                          window.location.protocol + '//' + this.sslURL
                        ),
                        'resourceUrl'
                      )
                    );
                  } else {
                    this.newsURL.push(
                      this.safePipe.transform(img.URL, 'resourceUrl')
                    );
                  }
                }
                // DO NOT REMOVE
              });
            });
          }
        });
        break;
      case 'Capital and Limits tracker':
        this.api
          .GetLimitData(
            this.Customerid,
            this.baseCCY,
            this.homeApi.Portfolio || ''
          )
          .subscribe((res) => {
            if (res.length !== 0) {
              if (res.GetLimitDetails_LCYEResult.length > 0) {
                this.tab11Error = '';
                // console.log("GetLimitDetailsResult",res.GetLimitDetails_LCYEResult[0]);
                this.limitchartData = res.GetLimitDetails_LCYEResult[0];
                this.limitdata = [];
                let tempArray = [];
                tempArray = [
                  [
                    'Limit Approved',
                    parseFloat(this.limitchartData.Approved_Limit),
                  ],
                  [
                    'Capital Posted',
                    parseFloat(this.limitchartData.Capital_Posted),
                  ],
                  ['Limit Used', parseFloat(this.limitchartData.Limit_Used)],
                ];
                this.limitdata = tempArray.filter(
                  (thing, index, self) =>
                    index ===
                    self.findIndex(
                      (t) => JSON.stringify(t) === JSON.stringify(thing)
                    )
                );
                this.legends = [
                  {
                    name: '',
                    data: [0],
                  },
                  {
                    name: '',
                    data: [0],
                  },
                ];

                this.legendFlag = false;
              }

              // console.log(this.limitdata);
            } else {
              this.tab11Error = 'Data not available.';
            }
          });
        break;
      // case 'Upcoming Events':
      //   this.viewBy = 'Record Date';
      //   this.template = 'All';
      //   this.currentDate = '';
      //   this.eventsArray = [];
      //   this.firstDay = new Date(this.selectedYear, Number(this.selectedMonth), 1);
      //   this.lastDay = new Date(this.selectedYear, Number(this.selectedMonth) + 1, 0);
      //   console.log('setEventCount', this.selectedYear, this.selectedMonth, this.firstDay, this.lastDay, moment(this.firstDay).format('DD-MMM-YYYY'));
      //   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      //   // const moment = require('moment');
      //   this.dayOne = moment(this.firstDay).format('DD-MMM-YYYY');
      //   this.dayLast = moment(this.lastDay).format('DD-MMM-YYYY');
      //   // this.dayOne = moment(this.firstDay).toNow() + '-' + moment(this.firstDay).toNow + '-' + moment(this.firstDay).toNow;
      //   // this.dayLast = moment(this.lastDay).toNow() + '-' + moment(this.lastDay).toNow + '-' + moment(this.lastDay).toNow;
      //   this.afs.ReadAllProductAllEvent_CA('', '', this.Customerid, this.viewBy, this.dayOne, this.dayLast, this.template);
      //   this.allCAData = this.afs.ReadAllProductAllEvent_CAObs.subscribe(res => {
      //     if (res.length !== 0) {
      //       this.AllProductEventCA = res.ReadAllProductAllEvent_CAResult;
      //       this.AllProductEventCA.forEach(event => {
      //         this.eventsArray.push(event);
      //       });
      //       // for (let i = 0; i < this.AllProductEventCA.length; i++) {
      //       //   this.eventsArray.push(this.AllProductEventCA[i]);
      //       // }
      //       this.eventsArray = this.eventsArray.slice(0, 5);
      //     }

      //   });
      //   break;
      case 'Upcoming Events':
        this.eventtype = 'Coupon_EvtCal';
        this.period = 'Yearly';
        const d = new Date();
        let from;
        let to;
        this.viewBy = 'Fixing';
        // let year = new Date(moment(d)).getFullYear();
        if (this.period === 'Yearly') {
          from = '1-Jan-' + d.getFullYear();
          to = '31-Dec-' + d.getFullYear();
        } else if (this.period === 'Monthly') {
          from = '1-' + this.months[d.getMonth() - 1] + '-' + d.getFullYear();
          to = '31-' + this.months[d.getMonth() - 1] + '-' + d.getFullYear();
        } else if (this.period === 'Weekly') {
          const diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1);
          from = new Date(d.setDate(diff));
          const lastday = d.getDate() - (d.getDay() - 1) + 6;
          to = new Date(d.setDate(lastday));
        } else if (this.period === 'Daily') {
          from =
            d.getDate() +
            '-' +
            this.months[d.getMonth() - 1] +
            '-' +
            d.getFullYear();
          to =
            d.getDate() +
            '-' +
            this.months[d.getMonth() - 1] +
            '-' +
            d.getFullYear();
        }
        from = moment(new Date()).format('DD-MMM-YYYY');
        to = moment(
          new Date(
            d.getFullYear() + 1 + '-' + (d.getMonth() + 1) + '-' + d.getDate()
          )
        ).format('DD-MMM-YYYY');
        // from = new Date(moment(d)).getDate() + '-' + this.months[new Date(moment(d)).getMonth() - 1] + '-' + new Date(moment(d)).getFullYear();
        // to = new Date(moment(d)).getDate() + '-' + this.months[new Date(moment(d)).getMonth() - 1] + '-' + (d.getFullYear() + 1);
        this.afs.getPledgedAgainstData(this.eventtype).subscribe((res) => {
          if (res.length !== 0) {
            this.event1 = res.Get_Configurable_Common_DataResult[0].DATA_VALUE;
            this.afs
              .GetEventCalendarDetails(
                this.event1,
                from,
                to,
                this.homeApi.CustomerId,
                sessionStorage.getItem('Username'),
                this.viewBy,
                this.homeApi.Portfolio || ''
              )
              .subscribe((res) => {
                if (res.length !== 0) {
                  if (res.FinIQResponseHeader.Status === 'Succeed') {
                    this.eventData = [];
                    // console.log(res.EventCalendarResponseBody.EventCalendarResponse);
                    this.eventData =
                      res.EventCalendarResponseBody.EventCalendarResponse;

                    this.eventData = this.eventData.slice(0, 5);
                  } else {
                  }
                } else {
                }
              });
          }
        });
        break;
      case 'FX Rates':
        this.fnCallFXRates();
        break;
      case 'Vanilla':
        // i was
        break;

      default:
        this.callUserDefinedDashboard();
        break;
    }

    this.FxRates = this.fxApi.FXOBestPriceObservar.subscribe((res: any) => {
      if (res.length !== 0) {
        try {
          try {
            if (res.body.FinIQResponseHeader.Status === 'Succeed') {
              if (res.Side === 'Sell') {
                this.ratesSell[res.ID] =
                  res.body.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse[0].NearSpotRate.toString().slice(
                    -2
                  );
              } else if (res.Side === 'Buy') {
                this.ratesBuy[res.ID] =
                  res.body.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse[0].NearSpotRate;
                this.Pips[res.ID] =
                  res.body.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse[0].NearSpotRate.toString().slice(
                    -2
                  );
              }
            }
          } catch (exception) { }
        } catch (exception) { }
      }
    });
    // Do not remove

    this.cfs.ViewCardObserver.subscribe((res) => {
      if (res.length !== 0) {
        // console.log(res);
        this.tabsArray = res;
      }
    });

    // this.api.portfolioSecHoldingObserver.subscribe(res => {
    //   try {
    //     if (res.length !== 0) {
    //       this.portfolioDetails = res;
    //       this.image = [];
    //       this.portfolioDetails.forEach(e => {

    //         e.CEHD_Pending_receive_Qty[0] = parseFloat(e.CEHD_Pending_receive_Qty[0]);
    //         e.CEHD_Pending_pay_Qty[0] = parseFloat(e.CEHD_Pending_pay_Qty[0]);
    //         e.CEHD_Available_Qty[0] = parseFloat(e.CEHD_Available_Qty[0]);
    //         e.CEHD_BUY_Settled_Avg_Price[0] = this.cfs.FormatNumberr(parseFloat(e.CEHD_BUY_Settled_Avg_Price[0]));
    //         e.CEHD_PledgedOut_Qty[0] = parseFloat(e.CEHD_PledgedOut_Qty[0]);
    //         this.image.push(this.isProd ? 'assets/App_Resources/App_Resources/RMW_Images/' + e.TypeAsset[0] + '.png' : '../../../assets/App_Resources/App_Resources/RMW_Images/' + e.TypeAsset[0] + '.png');
    //       });
    //       // console.log('Portfolio de', this.portfolioDetails);
    //       this.ref.detectChanges();
    //       this.isLoading = false;
    //     }
    //   } catch (Ex) {

    //   }

    // });
  }
  fnCallFXRates() {
    this.ccyPair = [];
    this.ratesBuy = [];
    this.ratesSell = [];

    this.fxApi
      .getCommonDataFXOrder(
        AppConfig.settings.CSP_FX_Order_CCY_Pairs_Common_Data
      )
      .subscribe((res: any) => {
        // console.log(res);
        if (res.Get_Configurable_Common_DataResult.length !== 0) {
          const favoriteCcy: any[] = res.Get_Configurable_Common_DataResult;
          // const i = 1;
          // this.ccyPair = favoriteCcy.map(c => {
          //   return { ccy: c.DATA_VALUE.replace('/',' - ') };
          // });

          // for (let i = 0; i < 6; i++) {
          //   this.ccyPair.push(favoriteCcy[i].DATA_VALUE.replace('/', ' - '))
          // }
          for (let i = 0; i < 6; i++) {
            this.ccyPair.push(favoriteCcy[i].DATA_VALUE.replace('/', ' - '));
            // }
            // for(let i=0;i<6;i++){
            this.fxApi.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
              'FXC',
              this.ccyPair[i],
              'Buy',
              10000,
              0,
              0.5,
              'SPOT',
              false,
              'fx',
              '26-Aug-202',
              '26-Aug-202',
              this.authApi.UserName,
              i,
              1,
              'Buy',
              '_' + Math.random().toString(36).substr(2, 9),
              this.homeApi.CIF,
              this.homeApi.CustomerName,
              'BB',
              '',
              this.homeApi.CustomerId,
              this.homeApi.CustomerId,
              '',
              '',
              'STH'
            );
            this.fxApi.GetQuoteRequestforFXRateForCurrencyPairSPOTBarrier(
              'FXC',
              this.ccyPair[i],
              'Sell',
              0,
              10000,
              0.5,
              'SPOT',
              false,
              'fx',
              '26-Aug-202',
              '26-Aug-202',
              this.authApi.UserName,
              i,
              1,
              'Sell',
              '_' + Math.random().toString(36).substr(2, 9),
              this.homeApi.CIF,
              this.homeApi.CustomerName,
              'BB',
              '',
              this.homeApi.CustomerId,
              this.homeApi.CustomerId,
              '',
              '',
              'STH'
            );
          }
        }
        // console.log(this.ccyPair);
      });
  }
  callUserDefinedDashboard() {
    let d = new Date();
    this.Year = d.getFullYear();
    this.Month = this.Months[d.getMonth() + 1];
    this.DateP = d.getDate() + '-' + this.Month + '-' + this.Year;
    this.api
      .GetDashboardScenarioHeader('superuser1', 'RM_View', this.EntityId, '')
      .subscribe((res) => {
        if (res !== null) {
          if (res.Get_Dashboard_ScenarioHeaderResult.length !== 0) {
            this.scenarioDataValue =
              res.Get_Dashboard_ScenarioHeaderResult.filter((res) => {
                if (res.ScenarioHeader === this.card) {
                  return res;
                }
              });

            // this.showDashboard = true;
            if (this.scenarioDataValue.length > 0) {
              let ScenarioNo = this.scenarioDataValue[0].LinkName;
              this.width = this.scenarioDataValue[0].PanelWidth;
              this.height = this.scenarioDataValue[0].PanelHeight;
              if (this.isProd) {
                this.imgUrl = 'assets/App_Resources/';
              } else {
                this.imgUrl = '../../../../assets/App_Resources/';
              }

              this.icon =
                this.imgUrl +
                'images/icons/' +
                this.scenarioDataValue[0]['ControlType'] +
                '.png';
              this.fromDate = this.DateP;
              this.toDate = this.DateP;

              if (
                ScenarioNo.Trim === 'Scenario 19' ||
                ScenarioNo.Trim === 'Scenario 20' ||
                ScenarioNo.Trim === 'Scenario 21'
              ) {
                this.Month = '';
              }
              // console.log(this.Year, this.Month, this.DateP);
              // console.log(this.scenarioDataValue[0]);

              if ([null, undefined].includes(this.scenarioDataValue[0]['TimePeriodFilter'])) {
                this.TimePeriodFilter = [];
                this.TimePeriodFilter =
                  this.scenarioDataValue[0]['TimePeriodFilter'].split('|');
              }
              // console.log(this.filterdata);

              this.api
                .CallStoreProcMaster(
                  this.scenarioDataValue[0]['LinkName'],
                  this.scenarioDataValue[0]['UserType'],
                  this.EntityId,
                  '',
                  this.scenarioDataValue[0]['StoreProcName'],
                  'superuser1',
                  '',
                  '',
                  '',
                  this.DateP,
                  this.fromDate,
                  this.toDate,
                  this.Month,
                  this.Year
                )
                .subscribe((res) => {
                  if (res !== null) {
                    let that = this;
                    xml2js.parseString(
                      res.CallStoreProcMasterResult,
                      (_err, result) => {
                        if (result.DocumentElement !== '') {
                          that.spData = result.DocumentElement.DUMMY;
                          // console.log(that.spData);
                        } else {
                          that.spData = [];
                        }
                      }
                    );
                    if (this.spData.length !== 0) {
                      // this.lblError = '';
                      switch (this.scenarioDataValue[0]['ControlType']) {
                        case 'Grid':
                          this.gridColumn = Object.keys(this.spData[0]).length;
                          this.alignText();
                          break;

                        case 'Poster':
                          this.postercolumn = this.spData.length / 2;
                          this.alignText();
                          break;

                        case 'Pie':
                          let keys = Object.keys(this.spData[0]);
                          // console.log(keys);
                          this.graphdata = [];
                          this.spData.forEach((element) => {
                            this.graphdata.push([
                              element[keys[0]][0],
                              parseFloat(element[keys[1]]),
                            ]);
                          });
                          this.Pieoptions = {
                            tooltip: {
                              trigger: 'both',
                            },
                            colors: this.chartColors,
                            // changed
                            width: this.width - 200,
                            height: this.height - 200,
                            is3D: true,
                            // changed
                            // tooltip: {
                            //   isHtml: true
                            // },
                            legend: { textStyle: { color: 'white' } },
                            backgroundColor: 'transparent',
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
                            // colors: ['#d4ab8b', '#ccb6a6', '#c8936a', '#ba7845'],
                          };
                          break;
                        case 'Column':
                          let keys1 = Object.keys(this.spData[0]);
                          // console.log(keys1);
                          this.graphdata = [];
                          this.spData.forEach((element) => {
                            this.graphdata.push([
                              element[keys1[0]][0],
                              parseFloat(element[keys1[1]]),
                            ]);
                          });
                          this.columnOptions = {
                            width: this.width - 100,
                            height: this.height - 100,
                            colors: this.chartColors,
                            hAxis: {
                              textStyle: {
                                color: '#808080',
                              },
                            },
                            vAxis: {
                              textStyle: {
                                color: '#808080',
                              },
                            },
                            backgroundColor: { fill: 'transparent' },
                            titleTextStyle: {
                              color: '#808080',
                            },
                            legend: { position: 'none' },
                            title: this.card,
                          };
                          break;
                        case 'Bar':
                          let keys2 = Object.keys(this.spData[0]);
                          // console.log(keys2);
                          this.graphdata = [];
                          this.spData.forEach((element) => {
                            this.graphdata.push([
                              element[keys2[0]][0],
                              parseFloat(element[keys2[1]]),
                            ]);
                          });
                          this.columnOptions = {
                            width: this.width - 200,
                            height: this.height - 100,
                            colors: this.chartColors,
                            hAxis: {
                              textStyle: {
                                color: '#808080',
                              },
                            },
                            vAxis: {
                              textStyle: {
                                color: '#808080',
                              },
                            },
                            backgroundColor: { fill: 'transparent' },
                            titleTextStyle: {
                              color: '#808080',
                            },
                            legend: { position: 'bottom' },
                          };
                          break;
                      }
                    } else {
                      // this.lblError = 'No data available.'
                    }
                  }
                });
            }
          }
        }
      });
  }

  toShortDateFormat(date: any) {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const day = date.getDate();

    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];

    const year = date.getFullYear();

    return day + '-' + monthName + '-' + year;
  }

  callValidateUser() {
    this.router.navigate(['validateuser/2/' + this.userID]);
  }
  callAccountDetails() {
    this.router.navigate(['validateuser/3/' + this.userID]);
  }

  // callOrderEntry() {
  //   this.router.navigate(['orderentry/' + this.userID]);
  // }
  epochtoFormatted(utc) {
    const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utc);
    const dt = d.toString().split(' ');
    const mt = dt[2] + '-' + dt[1] + '-' + dt[3];
    // //console.log(mt);
    return mt;
  }

  convert(value) {
    let res;
    // if (this.baseCCY === 'INR') {
    //   if (value >= 10000000) {
    //     value = Math.round(parseFloat(value) / 10000000);
    //     res = value.toString() + 'Cr';
    //   } else if (value >= 100000) {
    //     value = Math.round(parseFloat(value) / 100000);
    //     res = value.toString() + 'L';
    //   } else if (value >= 1000) {
    //     value = Math.round(parseFloat(value) / 1000);
    //     res = value.toString() + 'K';
    //   }
    // } else {
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

  SelectPieChartSlice() {
    // this.api.getCustPortfolioSecurityHoldings(this.Customerid, this.facilityCode[row]);
    // this.api.getCustPortfolioCashHoldings(this.Customerid, this.facilityCode[row]);
    // this.api.getPortfolioPerformanceDetails(this.Customerid, this.facilityCode[row]);
    // this.api.getPnlAllPortfoliosWorst(this.Customerid, this.facilityCode[row]);
    // this.api.getPnlAllPortfoliosBest(this.Customerid, this.facilityCode[row]);
  }

  FormatNumber(v) {
    try {
      // const target: any = this.GetEventTarget(e);
      // ////console.log(target.id, $('#' + target.id)[0].value);
      if (v.toString().trim() === '') {
        v = '0';
        // const evt = new Event('change');
        // target.dispatchEvent(evt);
      } else {
        v = parseFloat(v)
          .toFixed(4)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      // ////console.log(notional);
      return v;
    } catch (error) {
      // //console.log("Error:", error);
    }
  }

  getcustPortPerfPeriodic() {
    this.homeApi
      .GetCustPortPerformancePeriodic(
        this.Customerid,
        this.histPeriod,
        this.baseCCY,
        this.homeApi.Portfolio || null
      )
      .subscribe((res: any) => {
        if (res !== 0) {
          this.portfolioperfdataPeriodic = [];
          res.forEach((element) => {
            this.portfolioperfdataPeriodic.push([
              element.Quarter,
              element.MarketValueLCYE,
            ]);
          });
        }
      });
  }

  togglePerformance(s: string) {
    if (s === 'curr') {
      this.isCurrentPerf = true;
      this.showhistddl = false;
      // call current data denari service
      // this.api.getcustPortPerf(this.Customerid, this.baseCCY);
    } else {
      this.isCurrentPerf = false;
      this.showhistddl = true;
      // call historical data denari serv
    }
  }

  toShortFormat(date: any) {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const day = date.getDate();

    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];

    const year = date.getFullYear();

    return day + '-' + monthName + '-' + year;
  }

  sendDataToParent(tilename) {
    // console.log(this.tabsArray);
    this.homeApi
      .updateCSPDashboardLayout(this.username, tilename, 'N', '', '')
      .subscribe((res) => {
        // console.log(res);
        if (res.UpdatePageNameListResult === true) {
          this.homeApi.getCSPDashboardLayout(this.username);
        }
      });
    this.cfs.displayCard(this.tabsArray);
  }

  processLimitCollateralData() {
    try {
      // const liquidData: any = this.limitCollateralData;
      // const nonLiquidData: any = this.limitCollateralData;
      const liquidData: any = this.limitCollateralData.filter(
        (d: any) => d.Liquid_YN === 'Y'
      );
      const nonLiquidData: any = this.limitCollateralData.filter(
        (d: any) => d.Liquid_YN === 'N'
      );
      // console.log(liquidData, nonLiquidData);
      if (liquidData.length) {
        this.liquidDetails.Collateral = liquidData[0].Collateral || '0';
        // this.liquidDetails.Exposure = liquidData[0].Limit_used || '0';
        this.liquidDetails.Exposure =
          liquidData[0].Exposure_Initial_Facility || '0';
        this.liquidDetails.Loanable = liquidData[0].Balance || '0';
        this.liquidDetails.Approved_Limit = liquidData[0].Approved_Limit || '0';

        // this.ShortfallStatus = liquidData[0].ShoarfallStatus || '';
        if (parseInt(liquidData[0].Balance, 10) < 0) {
          this.ShortfallStatus = liquidData[0].ShoarfallStatus || '';
          this.ShortfallAmount = liquidData[0].Balance || '0';
          this.ShortfallSince = liquidData[0].ShortfallSince || '';
        } else {
          this.ShortfallStatus = liquidData[0].ShoarfallStatus || '';
          this.ShortfallAmount = '-';
          this.ShortfallSince = '-';
        }
        switch (this.ShortfallStatus.toUpperCase()) {
          case 'NORMAL':
            this.shortfallStatusColor = 'var(--green)';
            break;
          case 'LIQUIDATION':
            this.shortfallStatusColor = 'var(--red)';
            break;
          case 'MARGIN CALL':
            this.shortfallStatusColor = '#FAAD32';
            break;

          default:
            break;
        }
      }
      if (nonLiquidData.length) {
        this.nonLiquidDetails.Collateral = nonLiquidData[0].Collateral || '0';
        this.nonLiquidDetails.Exposure = nonLiquidData[0].Limit_used || '0';
        this.nonLiquidDetails.Loanable = nonLiquidData[0].Balance || '0';
        this.nonLiquidDetails.Approved_Limit =
          nonLiquidData[0].Approved_Limit || '0';

        // this.ShortfallStatus = nonLiquidData[0].ShoarfallStatus || '';
      }

      // this.Total.Collateral = parseFloat(
      //   this.liquidDetails.Collateral || '0'
      // ).toFixed(2);
      // this.Total.Collateral =
      //   this.collateralDetailsData.length !== 0
      //     ? this.collateralDetailsData
      //         .map((asset: any) => parseFloat(asset.Amount))
      //         .reduce((sum, as) => sum + as)
      //     : 0;
      // this.Total.Exposure = parseFloat(
      //   this.liquidDetails.Exposure || '0'
      // ).toFixed(2);
      this.Total.Loanable = parseFloat(
        this.liquidDetails.Loanable || '0'
      ).toFixed(2);
      this.Total.Approved_Limit = parseFloat(
        this.liquidDetails.Approved_Limit || '0'
      ).toFixed(2);
      // this.Total.Collateral = (parseFloat(this.nonLiquidDetails.Collateral || '0') + parseFloat(this.liquidDetails.Collateral || '0')).toFixed(2);
      // this.Total.Exposure = (parseFloat(this.nonLiquidDetails.Exposure || '0') + parseFloat(this.liquidDetails.Exposure || '0')).toFixed(2);
      // this.Total.Loanable = (parseFloat(this.nonLiquidDetails.Loanable || '0') + parseFloat(this.liquidDetails.Loanable || '0')).toFixed(2);
      // this.Total.Approved_Limit = (parseFloat(this.nonLiquidDetails.Approved_Limit || '0') + parseFloat(this.liquidDetails.Approved_Limit || '0')).toFixed(2);
      this.ref.detectChanges();
    } catch (ex) {
      // console.log(ex);
    }
  }

  processCollateralDetailsData() {
    this.collateralDetailsData = this.collateralDetailsData.map((d: any) => {
      return {
        CollateralType: d.CollateralType,
        Amount: d.Amount,
      };
    });
    // console.log(this.collateralDetailsData, this.GroupId);
    // this.collateralChartData = this.collateralDetailsData.map((d: any) => {
    //   return [d.CollateralType, parseInt(d.Amount || 0, 10)];
    // });
    this.Total.Collateral =
      this.collateralDetailsData.length !== 0
        ? this.collateralDetailsData
          .map((asset: any) => parseFloat(asset.Amount))
          .reduce((sum, as) => sum + as)
        : 0;

    // console.log(this.collateralChartData);
  }

  processExposureDetailsData() {
    this.exposureDetailsData = this.exposureDetailsData.map((d: any) => {
      return {
        Facility: d.Facility,
        Amount: d.Amount,
      };
    });
    // console.log(this.exposureDetailsData, this.GroupId);
    // this.exposureChartData = this.exposureDetailsData.map((d: any) => {
    //   return [d.Facility, parseInt(d.Amount || 0, 10)];
    // });

    this.Total.Exposure =
      this.exposureDetailsData.length !== 0
        ? this.exposureDetailsData
          .map((lib) => parseFloat(lib.Amount))
          .reduce((sum, lib) => sum + lib)
        : 0;
    // console.log(this.exposureChartData);
  }
  setGrid() {
    return 'repeat(' + this.gridColumn + ' , 1fr)';
  }

  setGridPoster() {
    return 'repeat(' + this.postercolumn + ' , 1fr)';
  }

  alignText() {
    let method = '';
    method = this.scenarioDataValue['MethodName'].toString().split(''); //.reverse().join('')
    // console.log(method);
    let array = [];
    array = method.split('|')[1].split('');
    this.alignment = [];
    array.forEach((element) => {
      switch (element) {
        case 'L':
          this.alignment.push('left');
          break;
        case 'R':
          this.alignment.push('right');
          break;
        case 'C':
          this.alignment.push('center');
          break;
        case 'A':
          this.alignment.push('right');
          break;
        case 'I':
          this.alignment.push('right');
          break;
        default:
          this.alignment.push('left');
      }
    });

    // console.log(this.alignment);
  }

  showdetailsPopUp(d: boolean, row: number, folioName: string) {
    if (d === true) {
      //Changes done by Alolika G on 10-02-2022

      // this.portfoliopopflag = true;
      this.Selectedportfolio = folioName;
      this.selectedfacilityCode = this.facilityCode[row];
      this.homeApi.Selectedportfolio = this.Selectedportfolio;

      this.homeApi.SelectedFacilityCode = this.selectedfacilityCode;
      this.homeApi.selectedPage = 'HOME';
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

  callOrderEntry(item, dir) {
    // console.log(item);
    // this.homeApi.RediretToHomeBuySellPledge = dir.CEHD_Stock_Code[0]
    // if (item === 'SELL' && (dir.CEHD_Available_Qty[0] + dir.CEHD_Pending_receive_Qty[0] + dir.CEHD_PledgedOut_Qty[0] - dir.CEHD_Pending_pay_Qty[0]) <= 0) {
    //   this.popuperror = 'You don\'t have enough balance to sell';
    // } else {
    sessionStorage.setItem('RMUser', this.username);

    this.popuperror = '';
    switch (dir[0].TypeMarket) {
      // case 'UT':
      //   this.router.navigate(['/neworderentry/amfunds']);
      //   // Asset
      //   break;
      case 'FI':
        // this.cfs.setAsset(dir[0].Misc1);
        this.cfs.setAsset(dir);
        sessionStorage.setItem('BondPorfolioDetails', 'FromCardOrder'); //Changes by Ashwini H. on 15 Feb 2022 for bond order entry
        this.cfs.setFlagToDisplayCust(true); //By Ashwini H. for product catalogue display on 07 Feb
        this.cfs.setDirection(item);
        // this.cfs.setPortfoliobalance(dir.CEHD_Available_Qty[0] + dir.CEHD_Pending_receive_Qty[0] + dir.CEHD_PledgedOut_Qty[0] - dir.CEHD_Pending_pay_Qty[0]);
        this.router.navigate(['/neworderentry/bonds']);
        break;
      case 'EQ':
        this.cfs.setAsset(dir[0].Misc1);
        this.cfs.setDirection(item);
        // this.cfs.setPortfoliobalance(dir.CEHD_Available_Qty[0] + dir.CEHD_Pending_receive_Qty[0] + dir.CEHD_PledgedOut_Qty[0] - dir.CEHD_Pending_pay_Qty[0]);
        this.router.navigate(['/neworderentry/shares']);
        break;
      case 'UT':
        // this.cfs.setAsset(dir.longName[0]);
        // this.cfs.setAsset(dir[0].Misc1);
        // Added by Mayuri D | 14-Feb-2022 ...START...
        this.Summaryflag = true;
        this.cfs.setFlagToDisplayCust(this.Summaryflag);
        // console.log('in ut setfalg', dir);
        this.api.MFList.subscribe((mf) => {
          // console.log('in cards compennts', mf);
          this.mfList = mf;
          const selectedMF = this.mfList.filter(
            (b) => b.Code === dir[0].Misc1 //Added by Alolika G | 19-02-2022
          );
          this.cfs.setAsset(selectedMF[0].ISIN);
          //   that.switchList = mf.filter(item => item.Name.toLowerCase().startsWith(that.switchFund.toLowerCase()));
          // console.log(that.mfList);
        });

        // Added by Mayuri D | 14-Feb-2022 ...END...
        this.cfs.setDirection(item);
        // this.cfs.setPortfoliobalance(dir.CEHD_Available_Qty[0] + dir.CEHD_Pending_receive_Qty[0] + dir.CEHD_PledgedOut_Qty[0] - dir.CEHD_Pending_pay_Qty[0]);
        this.router.navigate(['/neworderentry/funds']);
        break;
    }

    // this.cfs.setPortfolio(this.selectedfacilityCode);

    // }
  }

  redirectToHomePage() {
    this.homeApi.RediretToHomeBuySellPledge = 'HOME';
  }
  createWatchlist() {
    this.newWatchlist = !this.newWatchlist;
  }
  closeWatchlist() {
    this.newWatchlist = !this.newWatchlist;
  }
  saveWatchlist() {
    this.newWatchlist = !this.newWatchlist;
    //added by Uddesh on 28Jan, 2022
    // console.log('save watchlist', this.watchlistName);
    if (this.newWatchlistTemp.length !== 0) {
      this.newWatchlistTemp.push({ WatchlistName: this.watchlistName });
      // this.selectedWatchlist = this.newWatchlistTemp.filter(
      //   (w) => w.WatchlistName === this.watchlistName
      // )[0].WatchlistName;

      // console.log('-*-*-*-*', this.newWatchlistTemp);
      this.sendNewWatchlistName = this.watchlistName;
      // console.log('***', this.sendNewWatchlistName);
      this.watchlistName = '';
    } else {
      this.newWatchlistTemp = [{}];
      this.newWatchlistTemp[0].WatchlistName = this.watchlistName;
    }
    //
  }

  deleteWatchlist() {
    // this.deleteWatchlist
  }

  //Added by Uddesh
  getWatchlistNamesEventListener(event: any) {
    this.newWatchlistTemp = event.watchlistNames;
    // console.log('from cards component', this.newWatchlistTemp);
    if (event.isNew) {
      this.getSelectedWatchlist(
        this.newWatchlistTemp[this.newWatchlistTemp.length - 1].WatchlistName
      );
    } else {
      this.getSelectedWatchlist(this.newWatchlistTemp[0].WatchlistName);
    }
  }

  getSelectedWatchlist(item) {
    this.selectedWatchlist = item;
    // console.log('selected', item);
    this.ref.detectChanges();
  }
}
