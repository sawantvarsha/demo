import { Component, OnInit, ChangeDetectorRef, HostListener, AfterViewChecked, ElementRef, Input, OnDestroy } from '@angular/core';
//import { WorkflowApiService } from 'src/app/services/workflow-api.service';
// import { Router, ActivatedRoute } from '@angular/router';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { ThemeserviceService } from 'src/app/themeService/themeservice.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { PortfolioAnalyticsService } from 'src/app/services/portfolio-analytics.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomerCommonfunctionsService } from 'src/app/services/customer-commonfunctions.service';
import { Subscription } from 'rxjs';
import { DownloadService } from 'src/app/services/download.service';
import { HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// import { take } from 'rxjs/operators';

@Component({
  selector: 'app-portfolioallocation',
  templateUrl: './portfolioallocation.component.html',
  styleUrls: ['./portfolioallocation.component.scss'],
})
export class PortfolioallocationComponent implements OnInit, AfterViewChecked, OnDestroy {
  //Changes done by Alolika G on 10-02-2022 --START
  selectedRMCustomerDetails: {
    custName: any;
    custId: any;
    userName: any;
    cif: any;
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
    console.log(this.selectedRMCustomerDetails);
  }
  // //Changes done by Alolika G on 10-02-2022 --END
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
  SwitchTo3DCharts: boolean = false;
  TargetColors = [];
  CurrentColors = [];
  options = {
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
    colors: this.chartColors,
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
    is3D: this.SwitchTo3DCharts,
    // colors: ['#d4ab8b', '#ccb6a6', '#c8936a', '#ba7845'],
  };
  type = 'PieChart';
  //  freecash = 0;
  mode = 'TARGET';
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
  targetAllocationData: any;
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
  baseCCY: string;
  freecash: number = 0;
  portfName: any;
  public FCObserverSubcription: Subscription;
  baseCCYSubcription: Subscription;
  isDownloading: boolean;
  PnLPdfURL: string;
  interfaceUrl: string = environment.interfaceURL;
  message: string;

  // [
  // data : any[];
  constructor(
    //private api: WorkflowApiService,
    // private router: Router,
    // private route: ActivatedRoute,
    private custApi: CustomerApiService,
    public cfs: CommonApiService,
    public ref: ChangeDetectorRef,
    private elem: ElementRef,
    public themeService: ThemeserviceService,
    public homeapi: HomeApiService,
    public pas: PortfolioAnalyticsService,
    private authapi: AuthService,
    public Cust_cfs: CustomerCommonfunctionsService,
    public downloadApi: DownloadService
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
    this.SwitchTo3DCharts = false;
  }

  @HostListener('window:resize')
  onWindowResize() {
    // console.log('Width1: ' + window.innerWidth);
    // console.log('Height1: ' + window.innerHeight);
    this.options.width = (
      window.innerWidth -
      0.799 * window.innerWidth +
      20
    ).toString();
    this.options.height = (
      window.innerHeight -
      0.7 * window.innerHeight
    ).toString();

    this.pnlbestoptions.width = (
      window.innerWidth -
      0.799 * window.innerWidth +
      20
    ).toString();
    this.pnlbestoptions.height = (
      window.innerHeight -
      0.7 * window.innerHeight
    ).toString();

    if (window.innerWidth <= 1477) {
      this.options.width = '360';
      this.options.height = '180';

      this.pnlbestoptions.width = '400';
      this.pnlbestoptions.height = '240';
    }
  }

  ngOnDestroy() {
    console.log('destroy');
  }

  ngAfterViewChecked() {
    // console.log("out")
    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByTagName('rect'),
      (rect: HTMLElement) => {
        if (rect.getAttribute('fill') === '#ffffff') {
          // console.log("hello")
          rect.setAttribute('fill', '#ffffff00');
        }
      }
    );
    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByTagName('text'),
      (text: HTMLElement) => {
        if (['#222222', '#444444'].includes(text.getAttribute('fill'))) {
          // console.log("hello")
          text.setAttribute('fill', '#fff');
        }
      }
    );
  }
  ngOnInit(): void {
    this.userType = this.authapi.UserType;
    // Do not remove
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.crr = this.homeapi.CRR;
    this.profile = this.homeapi.RiskProfile;

    this.loader = true;

    if (this.authapi.UserType === 'RM') {
      this.isUserRM = true;
      // this.username = this.selectedRMCustomerDetails?.userName;
      // this.custId = this.selectedRMCustomerDetails?.custId;
      // this.cif = this.selectedRMCustomerDetails?.cif;
      this.username = sessionStorage.getItem('RMUser'); //Changes done by Alolika G on 10-02-2022
      this.custId = sessionStorage.getItem('RMCustID');
      this.cusotmerName = sessionStorage.getItem('RMCustName');
    } else {
      this.isUserRM = false;
      this.username = this.authapi.UserName;
      this.custId = this.homeapi.CustomerId;
      //Changes done by Alolika G on 10-02-2022 -->
      this.Customerid = this.homeapi.CustomerId;
      this.CIF = this.homeapi.CIF;
      this.portfolio = this.homeapi.Portfolio || null;
      this.cusotmerName = this.homeapi.CustomerName;
    }

    this.loadPortfolioAllocation();
    if (this.authapi.UserType === 'RM') {
      this.custApi
        .GetClientSetupformSavedForFutureKetan(this.username)
        .subscribe((res1) => {
          if (res1.GetDataResult !== '[]') {
            // console.log(res.GetDataResult);
            const serviceDataOBJ = JSON.parse(res1.GetDataResult)[0];

            this.homeapi.CRR = this.crr = serviceDataOBJ.RiskRating || '';
            this.homeapi.RiskProfile = this.profile =
              this.Cust_cfs.camelize(serviceDataOBJ.RiskProfile) || '';
          }
        });
    }
    this.homeapi
      .GetFreeCash(this.username, this.Customerid, '', this.baseCCY)
      .subscribe((res: any) => {
        if (res.length !== 0) {
          if (
            res.ListCTPDashboardCashResponse.ResponseDetails.Description ===
            'success.'
          ) {
            this.freecash = this.homeapi.freecash =
              res.ListCTPDashboardCashResponse.items[0].Total_Market_Value;
          }
        }
      });
  }
  loadPortfolioAllocation() {
    this.baseCCYSubcription = this.custApi.getBankBaseCCYOBS.subscribe(
      (ccy) => {
        this.baseCCY = ccy;

        this.freecash = 0;
        this.homeapi
          .GetAUMandPNL(
            this.homeapi.CIF || sessionStorage.getItem('RMCIF'),
            this.username,
            this.mode === 'TARGET' ? 'ASSETCLASS' : this.mode,
            this.custApi.bankBaseCCY,
            null
          )
          .subscribe((resAUM) => {
            if (resAUM.length !== 0) {
              let client = resAUM.ResponseBody.ClientWiseHoldings;
              this.loader = false;
              this.currency = client.BaseCurrency;
              // this.crr = client.CRR;
              this.AUM = client.TotalAUM;
              this.pnl = client.TotalPnL;

              if (client !== null) {
                this.portfolioDetails = [];
                if(client.ClientwisePortfolioDetails !== null){
                this.portfolioDetails = client.ClientwisePortfolioDetails;
                // console.log(this.portfolioDetails);
                this.totalPortfolioData = [];
                this.portfolioColumnNames = [];
                // this.totalPortfolioData.push('');
                  if(this.portfolioDetails.length > 0){
                this.portfolioDetails.forEach((pf, i) => {
                  pf.box = this.portfolioColorsArray[i];
                });
                  }
                // console.log('Port', this.portfolioDetails);

                this.portfolioColumnNames.push('');
                client.ClientwisePortfolioDetails.forEach((element) => {
                  this.portfolioColumnNames.push(
                    element.FacilityCode + ' ' + element.TotalAUM + ' USD '
                  );
                  // this.totalPortfolioData.push([element.FacilityCode, parseFloat(element.TotalAUM)]);
                    // this.totalPortfolioData.push([
                    //   element.PortfolioName,
                    //   parseFloat(element.TotalAUM),
                    // ]); // Added by ketan S on 23Nov2021 Asked by Parikshit Sir
                    this.totalPortfolioData.push({
                          title: element.PortfolioName,
                          value: parseFloat(element.TotalAUM),
                    });
                  // console.log(this.CurrentOptions);
                });
                }
              } else {
                this.noDataFlag = true;
              }

              if (window.innerWidth <= 1477) {
                this.options.width = '340';
                this.options.height = '180';
              }
            }
          });
      }
    );

    //Added By Arsh P || End
  }
  setGraphMode(event) {
    this.mode = event;
    this.loadPortfolioAllocation();
  }

  showdetailsPopUp(d: boolean, folioName: string) {
    if (d === true) {
      this.portfoliopopflag = true;
      this.Selectedportfolio = folioName;
      this.homeapi.Selectedportfolio = this.Selectedportfolio; //Changes done by Alolika G on 10-02-2022

      this.homeapi.SelectedFacilityCode = this.selectedfacilityCode;
      this.homeapi.selectedPage = 'PORTFOLIO REPORT';
    } else {
      this.portfoliopopflag = false;
    }
  }

  swithchTo3D() {
    this.SwitchTo3DCharts = !this.SwitchTo3DCharts;
  }

  refresh() {
    this.loadPortfolioAllocation();
  }

  getPortfolioReport() {
    this.isDownloading = true;
    this.message = 'Downloading...';
    try {
      if (!this.isUserRM) {
        this.isDownloading = true;
        this.PnLPdfURL =
          this.interfaceUrl +
          'CustomerPortfolio/' +
          this.authapi.EntityID +
          '/' +
          this.homeapi.CustomerId +
          '/' +
          this.homeapi.CustomerName +
          '/' +
          'Full' +
          '/' +
          'PDF' +
          '/' +
          this.authapi.UserName;
      } else {
        if (this.username === '') {
          this.message = 'Please select Customer.';
          this.isDownloading = false;
        } else {
          this.isDownloading = true;
          this.PnLPdfURL =
            this.interfaceUrl +
            'CustomerPortfolio/' +
            this.authapi.EntityID +
            '/' +
            this.custId +
            '/' +
            this.cusotmerName +
            '/' +
            'Full' +
            '/' +
            'PDF' +
            '/' +
            this.authapi.UserName;
        }
      }

      this.downloadFileFromURL(this.PnLPdfURL);
    } catch (error) {}
  }
  downloadFileFromURL(url) {
    if (url) {
      this.downloadApi
        .downloadPDF(url)
        .subscribe((resp: HttpResponse<Blob>) => {
          console.log(resp.headers.get('content-disposition'));
          this.isDownloading = false;
          const fileName = resp.headers.get('content-disposition')
            ? resp.headers
                .get('content-disposition')
                .split(';')[1]
                .trim()
                .replace(/filename=/g, '')
            : 'File' + new Date().toLocaleString();
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(resp.body);
          a.href = objectUrl;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(objectUrl);
        });
    } else {
      this.isDownloading = true;
      this.message = 'Error while downloading.';
    }
  }
}
