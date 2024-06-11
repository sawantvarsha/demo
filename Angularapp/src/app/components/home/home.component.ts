import { HomeApiService } from './../../services/home-api.service';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  AfterViewInit,
} from '@angular/core';
import { CustomerApiService } from '../../services/customer-api.service';
import { WorkflowApiService } from '../../services/workflow-api.service';
import { AuthService } from '../../services/auth/auth.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonApiService } from '../../services/common-api.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppConfig } from 'src/app/services/config.service';
import { CustomerCommonfunctionsService } from 'src/app/services/customer-commonfunctions.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ThemeserviceService } from './../../themeService/themeservice.service';

//Added by Uddesh to generate PDF of dashboard
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { SignalrApiService } from 'src/app/services/signalR/signalr-api.service';
import { LoginApiService } from 'src/app/services/auth/login-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  interfaceURL = environment.interfaceURL;
  cusotmerName = '';
  Customerid = '';
  username: string;
  portfolio: string;
  domainURL = environment.domainURL;
  multiportfoliodata: Subscription;
  column1 = [];
  column2 = [];
  column3 = [];
  column4 = [];
  column5 = [];
  // tabsArray = [];
  expandFlag: any;
  selectedRMCustomerDetails: {
    custName: string;
    custId: string;
    userName: string;
    cif: string;
  };
  mode: any;
  isUserRM: boolean;
  getBankBaseCCYSubscription: Subscription;

  @Input() get CustomerDetails() {
    return this.selectedRMCustomerDetails;
  }
  set CustomerDetails(CustomerDetails) {
    this.selectedRMCustomerDetails = CustomerDetails;
    console.log(this.selectedRMCustomerDetails);
  }
  @Input() get Mode() {
    return this.mode;
  }
  set Mode(Mode) {
    this.mode = Mode;
    this.isUserRM = this.mode === 'RM';
    console.log(this.mode);
  }
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
      tabName: 'Ticker',
      tabshow: true,
      column: '0',
    },
    {
      tabName: 'FX Rates',
      tabshow: true,
      column: '5',
    },
    {
      tabName: 'Vanilla',
      tabshow: true,
      column: '5',
    },
    {
      tabName: 'AQ',
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
  portfolioData = [];

  isProd = environment.production;
  ClientAllocSubscriber: Subscription;
  data = [];
  tabsadata = [];
  layoutsaveMessage = '';
  tabs = [
    'Watchlist',
    'Balance',
    'Limits and Collateral',
    'Latest Transactions',
    'Cash Balance',
    'Performace',
    'Portfolio Allocation',
    'Market Watch',
    'Top Performing Assets',
    'My Profile',
    'Insurance',
    'News',
    'Capital and Limits tracker',
    'Upcoming Events',
    'FX Rates',
    'Ticker',
    'Vanilla',
    'AQ',
  ];
  isLoading: boolean;
  customerProfiles: any[];
  customerAccounts: any[];
  portfolios: any[];
  freecash = 0;
  CustomerDisplayName: any;
  WelcomeMsg: any;
  dashboardLayout = [];
  addItemsLayout = [];
  layoutSubscription: Subscription;
  isProfileCreated: boolean;
  isRM: boolean = false; //Added by ketan s on 15-sep-21 confirmed by Parikshit K and Roshan K
  baseCCY: string;
  Note_Master_ID: string;
  // pdfSRC: string =  '../../assets/PortfolioSummaryDark.pdf'; // Added by Ketan S on 7-Feb-21 confirmed by Parikshit k and Milind k
  // pdfSRC: string =  'http://40.65.134.77/assets/PortfolioSummaryTHEME.pdf'; // Added by Ketan S on 7-Feb-21 confirmed by Parikshit k and Milind k
  pdfSRC: string = ''; // Added by Ketan S on 7-Feb-21 confirmed by Parikshit k and Milind k

  isPDFMode: boolean = false;

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  constructor(
    public custApi: CustomerApiService,
    private workflowApi: WorkflowApiService,
    public cfs: CommonApiService,
    public homeApi: HomeApiService,
    public authApi: AuthService,
    public commonApi: CommonApiService,
    public Cust_cfs: CustomerCommonfunctionsService,
    public translatePipe: TranslatePipe,
    public translate: TranslateService,
    public utilitiesApi: UtilitiesService,
    public themeService: ThemeserviceService,
    public signalRApi: SignalrApiService,
    public loginApi: LoginApiService
  ) {
    this.WelcomeMsg = '';
    if (this.authApi.UserType === 'RM') {
      this.isRM = true;
      this.username = sessionStorage.getItem('RMUser');
    } else {
      this.username = sessionStorage.getItem('Username');
    }
  }

  reset() {
    // sessionStorage.removeItem('RMUser'); //Changes done by Alolika G | 11-02-2022
  }
  removeSubcriptions() {
    if (this.layoutSubscription) {
      this.layoutSubscription.unsubscribe();
    }
    if (this.getBankBaseCCYSubscription) {
      this.getBankBaseCCYSubscription.unsubscribe();
    }
  }
  ngOnDestroy() {
    this.reset();
    this.removeSubcriptions();
    this.signalRApi.stopConnection();
  }
  ngAfterViewInit(): void {
    // this.signalRApi.startConnection();
  }
  async ngOnInit() {
    this.themeService.themeEmitObs.subscribe((themeres) => {
      if (themeres === 'dark') {
        if (this.isProd) {
          this.pdfSRC = AppConfig.settings.CSP_DashboardPDFpath.replace(
            'THEME',
            'Dark'
          );
        } else {
          this.pdfSRC =
            this.interfaceURL + 'assets/pdf/PortfolioSummaryDark.pdf';
        }
      } else {
        if (this.isProd) {
          this.pdfSRC = AppConfig.settings.CSP_DashboardPDFpath.replace(
            'THEME',
            'Light'
          );
        } else {
          this.pdfSRC =
            this.interfaceURL + 'assets/pdf/PortfolioSummaryLight.pdf';
        }
      }
    });

    /* commented for 1Europe RM Home */
    // this.fnUpdateKYCFlag();
    this.translate.onLangChange.subscribe((res) => {
      console.log(res);
      this.WelcomeMsg = this.isRM
        ? this.CustomerDisplayName
        : this.translatePipe.transform('Welcome', res) +
        ' ' +
        this.CustomerDisplayName;
    });

    this.commonApi.showPDFMode.subscribe((res) => {
      this.isPDFMode = res;
    });
    /* commented for 1Europe RM Home */

    // if (this.homeApi.NoteMasterID === '') {
    //   this.custApi
    //     .GetClientSetupformSavedForFutureKetan(this.authApi.UserName)
    //     .subscribe((res1) => {
    //       if (res1.GetDataResult !== '[]') {
    //         // console.log(res.GetDataResult);
    //         const serviceDataOBJ = JSON.parse(res1.GetDataResult)[0];
    //         if (this.authApi.UserType === 'CLIENTSA') {
    //           this.homeApi.NoteMasterID = serviceDataOBJ.NoteMasterID;
    //         }

    //         this.homeApi.Portfolio = serviceDataOBJ.Portfolio || 0;
    //         this.homeApi.RiskRating = serviceDataOBJ.RiskRating || '';
    //         this.homeApi.CRR = serviceDataOBJ.RiskRating || '';
    //         this.homeApi.RiskProfile =
    //           this.Cust_cfs.camelize(serviceDataOBJ.RiskProfile) || '';
    //       }
    //     });
    // }
    let dashboardRes: any = '';
    this.getBankBaseCCYSubscription = this.custApi.getBankBaseCCYOBS.subscribe(async (ccy) => {
      if (ccy === '') {
        this.custApi.setBankBaseCCY(AppConfig.settings.BankBaseCCy);
        this.baseCCY = AppConfig.settings.BankBaseCCy;
      } else {
        this.baseCCY = ccy;
      }


    });
    if (this.authApi.UserType === 'CLIENTSA') {
      dashboardRes = await this.homeApi.getCSPDashboardLayout('Default_sub_account');
    } else {
      dashboardRes = await this.homeApi.getCSPDashboardLayout(this.authApi.UserName);
    }

    if (dashboardRes.length !== 0) {
      this.dashboardLayout = [];
      this.addItemsLayout = [];
      dashboardRes.GetPageNameListResult.forEach((element) => {
        if (element.Visible === 'Y') {
          this.dashboardLayout.push(element);
        } else {
          this.addItemsLayout.push(element);
        }
      });
      // console.log(this.dashboardLayout);
      this.column1 = [];
      this.column2 = [];
      this.column3 = [];
      this.column4 = [];
      this.column5 = [];

      try {
        // this.dashboardLayout.forEach(d => {
        //   if (Number(d.ColumnNumber) === 0 && Number(d.RowNumber) === 0) {
        //     console.log(d);
        //     this.commonApi.toggleTicker(true);
        //   }
        // })
      } catch (ex) {
        console.log('Error occured while loading Market Watch card :', ex);
      }
      // this.column1[0] = 'Watchlist&black.jpg';
      this.dashboardLayout.forEach((element) => {
        switch (element.ColumnNumber) {
          case '1':
            // console.log(element.tabName, element.column);
            this.column1[parseInt(element.RowNumber, 10) - 1] =
              element.layout.trim() + '&' + element.Background;
            // this.column1.push(element.tabName);
            break;
          case '2':
            // console.log(element.tabName, element.column);
            this.column2[parseInt(element.RowNumber, 10) - 1] =
              element.layout.trim() + '&' + element.Background;
            // this.column2 = [];
            // this.column2.push(element.tabName);
            break;
          case '3':
            // console.log(element.tabName, element.column);
            this.column3[parseInt(element.RowNumber, 10) - 1] =
              element.layout.trim() + '&' + element.Background;
            // this.column3 = [];
            // this.column3.push(element.tabName);
            break;
          case '4':
            // console.log(element.tabName, element.column);
            this.column4[parseInt(element.RowNumber, 10) - 1] =
              element.layout.trim() + '&' + element.Background;
            // this.column4 = [];
            // this.column4.push(element.tabName);
            break;
          case '5':
            // console.log(element.tabName, element.column);
            this.column5[parseInt(element.RowNumber, 10) - 1] =
              element.layout.trim() + '&' + element.Background;
            // this.column4 = [];
            // this.column4.push(element.tabName);
            break;
        }
      });
      this.loadCards();

      // console.log(this.column1, this.column2, this.column3, this.column4);
      // this.isLoading =  false;
    } else {
      // this.defaultLayout();
    }

    this.layoutsaveMessage = '';

    // this.layoutSubscription = this.homeApi.layoutObs.subscribe((res) => {
    //   try {
    //     if (res.length !== 0) {
    //       this.dashboardLayout = [];
    //       this.addItemsLayout = [];
    //       res.GetPageNameListResult.forEach((element) => {
    //         if (element.Visible === 'Y') {
    //           this.dashboardLayout.push(element);
    //         } else {
    //           this.addItemsLayout.push(element);
    //         }
    //       });
    //       // console.log(this.dashboardLayout);
    //       this.column1 = [];
    //       this.column2 = [];
    //       this.column3 = [];
    //       this.column4 = [];
    //       this.column5 = [];

    //       try {
    //         // this.dashboardLayout.forEach(d => {
    //         //   if (Number(d.ColumnNumber) === 0 && Number(d.RowNumber) === 0) {
    //         //     console.log(d);
    //         //     this.commonApi.toggleTicker(true);
    //         //   }
    //         // })
    //       } catch (ex) {
    //         console.log('Error occured while loading Market Watch card :', ex);
    //       }
    //       // this.column1[0] = 'Watchlist&black.jpg';
    //       this.dashboardLayout.forEach((element) => {
    //         switch (element.ColumnNumber) {
    //           case '1':
    //             // console.log(element.tabName, element.column);
    //             this.column1[parseInt(element.RowNumber, 10) - 1] =
    //               element.layout.trim() + '&' + element.Background;
    //             // this.column1.push(element.tabName);
    //             break;
    //           case '2':
    //             // console.log(element.tabName, element.column);
    //             this.column2[parseInt(element.RowNumber, 10) - 1] =
    //               element.layout.trim() + '&' + element.Background;
    //             // this.column2 = [];
    //             // this.column2.push(element.tabName);
    //             break;
    //           case '3':
    //             // console.log(element.tabName, element.column);
    //             this.column3[parseInt(element.RowNumber, 10) - 1] =
    //               element.layout.trim() + '&' + element.Background;
    //             // this.column3 = [];
    //             // this.column3.push(element.tabName);
    //             break;
    //           case '4':
    //             // console.log(element.tabName, element.column);
    //             this.column4[parseInt(element.RowNumber, 10) - 1] =
    //               element.layout.trim() + '&' + element.Background;
    //             // this.column4 = [];
    //             // this.column4.push(element.tabName);
    //             break;
    //           case '5':
    //             // console.log(element.tabName, element.column);
    //             this.column5[parseInt(element.RowNumber, 10) - 1] =
    //               element.layout.trim() + '&' + element.Background;
    //             // this.column4 = [];
    //             // this.column4.push(element.tabName);
    //             break;
    //         }
    //       });
    //       this.loadCards();

    //       // console.log(this.column1, this.column2, this.column3, this.column4);
    //       // this.isLoading =  false;
    //     } else {
    //       // this.defaultLayout();
    //     }
    //   } catch (Ex) { }
    // });

    this.cfs.ViewCardObserver.subscribe((res) => {
      if (res.length !== 0) {
        this.tabsArray = [];
        this.tabsArray = res;
      }
    });
  }
  expandItems() {
    this.expandFlag = !this.expandFlag;
    // alert(this.expandFlag);
  }
  enableAllTabs() {
    this.tabsArray.forEach((elem) => {
      elem.tabshow = true;
    });
  }

  saveLayout() {
    // const layout = [];
    // this.column1 = [];
    // this.column2 = [];
    // this.column3 = [];
    // this.column4 = [];
    this.layoutsaveMessage = '';
    // console.log('col1', this.column1, 'col2', this.column2, 'col3', this.column3, 'col4', this.column4);

    this.dashboardLayout.map((data) => {
      this.column1.map((col, i) => {
        if (data.layout === col.split('&')[0]) {
          data.RowNumber = i + 1;
          data.ColumnNumber = 1;
        }
      });
      this.column2.map((col, i) => {
        if (data.layout === col.split('&')[0]) {
          data.RowNumber = i + 1;
          data.ColumnNumber = 2;
        }
      });
      this.column3.map((col, i) => {
        if (data.layout === col.split('&')[0]) {
          data.RowNumber = i + 1;
          data.ColumnNumber = 3;
        }
      });
      this.column4.map((col, i) => {
        if (data.layout === col.split('&')[0]) {
          data.RowNumber = i + 1;
          data.ColumnNumber = 4;
        }
      });
      this.column5.map((col, i) => {
        if (data.layout === col.split('&')[0]) {
          data.RowNumber = i + 1;
          data.ColumnNumber = 5;
        }
      });
    });
    // console.log(this.dashboardLayout);
    this.homeApi
      .changeCSPDashboardLayout(this.dashboardLayout)
      .subscribe((res) => {
        if (res.length !== 0) {
          if (res.ChangeLayoutDetailsResult === true) {
            this.layoutsaveMessage = 'Layout saved successfully.';
          } else {
            this.layoutsaveMessage = 'Failed to save Layout.';
          }
        }
      });
  }

  defaultLayout() {
    this.layoutsaveMessage = '';
    this.homeApi.getCSPDashboardLayout('DEFAULT');
    // this.getDashboardLayout('DEFAULT');
    // this.column1 = [
    //   'Balance',
    //   'Limits and Collateral',
    //   'Latest Transactions',
    //   'Cash Balance',
    // ];

    // this.column2 = ['Performance', 'Portfolio Allocation'];

    // this.column3 = ['Market Watch', 'Top Performing Assets'];

    // this.column4 = ['My Profile', 'Insurance', 'News', 'Capital and Limits tracker', 'Upcoming Events'];
  }
  loadCards() {
    this.isLoading = true;
    this.WelcomeMsg = 'Loading...';
    this.cfs.HideSidebar(false);
    try {
      this.isLoading = false;
      this.isProfileCreated = true;
      this.WelcomeMsg = 'Welcome ' + this.authApi.UserName;
      /* commented for RM Login */
      // this.custApi
      //   .isCustProfileCreated(
      //     this.username,
      //     '',
      //     this.homeApi.NoteMasterID || ''
      //   )
      //   .subscribe((res) => {
      //     if (res) {
      //       if (!res.length) {
      //         this.WelcomeMsg = 'No profile created.';
      //         this.isProfileCreated = false;
      //         this.isLoading = false;
      //       } else {
      //         this.customerProfiles = res;
      //         this.isProfileCreated = true;
      //         // console.log(res);
      //         res = res[res.length - 1];
      //         this.CustomerDisplayName = res.misc1;
      //         // this.Customerid = res.misc10;
      //         this.Customerid = res.CustomerID;
      //         sessionStorage.setItem('CustomerID', res.CustomerID);
      //         sessionStorage.setItem('CustomerName', res.Customer_Name);
      //         sessionStorage.setItem('CustomerNamemisc1', res.misc1);
      //         sessionStorage.setItem('NoteMasterID', res.misc7);
      //         // sessionStorage.setItem('RiskProfile', res.misc8); // Commented by Ketan S. on 25 jun 2021
      //         sessionStorage.setItem('TokenID', res.TI_ID);
      //         // sessionStorage.setItem('CRR', res.misc9);
      //         // sessionStorage.setItem('RiskRating', res.CRR); // Commented by Ketan S. on 25 jun 2021
      //         sessionStorage.setItem('AccountType', res.accounttype);
      //         sessionStorage.setItem('AccountNumber', res.accountnumber);
      //         sessionStorage.setItem('CIF', res.misc10);
      //         // if(this.homeApi.Portfolio === ''){
      //         //   this.homeApi.Portfolio = res.portfolio;
      //         // }
      //         this.homeApi.CustomerId = res.CustomerID;
      //         this.homeApi.CustomerDisplayName = res.misc1;
      //         this.homeApi.CIF = res.misc10;
      //         this.homeApi.AccountType = res.accounttype;
      //         this.homeApi.AccountNumber = res.accountnumber;
      //         this.homeApi.CustomerName = res.misc1;
      //         this.homeApi.ContactNo = res.Home_Phone_No;
      //         this.homeApi.CustEmail = res.misc2;
      //         this.homeApi.Currency = res.currency;
      //         this.homeApi.RMID = res.RMID;
      //         this.homeApi.RMName = res.RM;
      //         this.homeApi.LastUpdatedOn =
      //           res.misc4 !== null
      //             ? this.cfs.checkAndFormatDate(res.misc4.split('T')[0])
      //             : '-';
      //         this.homeApi.KYCUpdatedOn =
      //           res.misc5 !== null
      //             ? // ? this.cfs.checkAndFormatDate(res.misc5.split('T')[0])
      //             this.cfs.checkAndFormatDate(res.misc5.split('T')[0])
      //             : '-';
      //         this.homeApi.Profiles = {
      //           Portfolio: {
      //             portfolioname: [
      //               ...new Set(
      //                 this.customerProfiles
      //                   .filter((c) => c.accountnumber !== null)
      //                   .map((c) => c.portfolio)
      //               ),
      //             ],
      //           },
      //           AccountNumber: [
      //             ...new Set(
      //               this.customerProfiles
      //                 .filter((c) => c.accountnumber !== null)
      //                 .map((c) => c.accountnumber)
      //             ),
      //           ],
      //           AccountType: [
      //             ...new Set(
      //               this.customerProfiles
      //                 .filter((c) => c.accountnumber !== null)
      //                 .map((c) => c.accounttype)
      //             ),
      //           ],
      //           Currency: [
      //             ...new Set(
      //               this.customerProfiles
      //                 .filter((c) => c.accountnumber !== null)
      //                 .map((c) => c.Accountcurrency)
      //             ),
      //           ],
      //           PortfolioDetails: this.customerProfiles
      //             .filter((c) => c.accountnumber !== null)
      //             .map(
      //               (c) =>
      //                 new Object({
      //                   Portfoio: c.portfolio,
      //                   AccountNumber: c.accountnumber,
      //                   Currency: c.Accountcurrency,
      //                 })
      //             ),
      //         };
      //         this.utilitiesApi
      //           .Get_ClientAlertEngagementDetails(
      //             this.homeApi.RMID,
      //             this.Customerid.toString()
      //           )
      //           .subscribe((res: any) => {
      //             if (res !== null) {
      //               if (res.length > 0) {
      //                 this.utilitiesApi.alertCount = res?.length;
      //               }
      //             }
      //           });

      //         sessionStorage.setItem('CRR', this.homeApi.CRR);
      //         // this.fnUpdateKYCFlag();
      //         let portfolio;
      //         if (this.homeApi.Portfolio === 0) {
      //           portfolio = null;
      //         } else {
      //           portfolio = this.homeApi.Portfolio;
      //         }

      //         if (!this.homeApi.AUM && !this.homeApi.PNL) {
      //         }
      //         this.homeApi
      //           .GetAUMandPNL(
      //             this.homeApi.CIF,
      //             this.username,
      //             'ASSET',
      //             this.custApi.bankBaseCCY,
      //             portfolio
      //           )
      //           .subscribe((resAUM) => {
      //             if (resAUM.length !== 0) {
      //               resAUM = resAUM.ResponseBody.ClientWiseHoldings;
      //               // this.WelcomeMsg = 'Welcome ' + this.CustomerDisplayName;
      //               this.WelcomeMsg = this.isRM
      //                 ? this.CustomerDisplayName
      //                 : 'Welcome ' + this.CustomerDisplayName;
      //               this.homeApi.BestPortfolio =
      //                 resAUM.ClientwisePortfolioDetails;
      //               this.homeApi.AUM = resAUM.TotalAUM;
      //               this.homeApi.PNL = resAUM.TotalPnL;
      //               // this.homeApi.CRR = this.homeApi.CRR = resAUM.CRR;

      //               if (
      //                 resAUM.ClientwisePortfolioDetails === null ||
      //                 resAUM.ClientwisePortfolioDetails === undefined ||
      //                 resAUM.ClientwisePortfolioDetails === ''
      //               ) {
      //                 this.isLoading = false;
      //               }
      //               this.workflowApi.loadMutualFunds();
      //               this.workflowApi.getbondslist(
      //                 sessionStorage.getItem('Username'),
      //                 '',
      //                 this.authApi.EntityID
      //               );
      //               this.isLoading = false;
      //               // });
      //             } else {
      //               this.homeApi.AUM = '0.00';
      //               this.homeApi.PNL = 0.0;
      //               this.homeApi.BestPortfolio = [];
      //             }
      //           });

      //         this.custApi
      //           .GetPortfolio(this.Customerid, this.homeApi.Portfolio)
      //           .subscribe((result) => {
      //             if (result.length !== 0) {
      //               // console.log(result);
      //               this.portfolios = [];
      //               result.Get_Portfolio_Details_RESTResult.forEach(
      //                 (element) => {
      //                   this.freecash = 0;
      //                   if (!this.homeApi.freecash) {
      //                     this.homeApi
      //                       .GetFreeCash(
      //                         this.username,
      //                         this.Customerid,
      //                         element.FacDesc,
      //                         this.baseCCY
      //                       )
      //                       .subscribe((res: any) => {
      //                         if (res.length !== 0) {
      //                           if (
      //                             res.ListCTPDashboardCashResponse
      //                               .ResponseDetails.Description === 'success.'
      //                           ) {
      //                             res.ListCTPDashboardCashResponse.items.forEach(
      //                               (listsRes) => {
      //                                 this.freecash =
      //                                   this.freecash +
      //                                   parseFloat(listsRes.Market_Value_LCYE);
      //                               }
      //                             );
      //                             this.homeApi.freecash = this.freecash;
      //                             // for (let i = 0; i < res.ListCTPDashboardCashResponse.items.length; i++) {
      //                             //   this.freecash = this.freecash + parseFloat(res.ListCTPDashboardCashResponse.items[i].Market_Value_LCYE);
      //                             // this.homeApi.setfreecash(this.freecash);
      //                             // }
      //                           }
      //                         }
      //                       });
      //                   }
      //                 }
      //               );
      //             }
      //           });
      //       }
      //     } else {
      //       this.isLoading = false;
      //     }
      //   });
    } catch (ex) { }
  }

  // Added by Ketan S for Update KYC Flag on 25 Jun 2021
  fnUpdateKYCFlag() {
    try {
      const Formname = AppConfig.settings.CSP_UpdateCIRPFormName;
      // let RiskRating = '';
      this.custApi.Get_KYC_Risk_Rating_Login(this.username).subscribe((res) => {
        if (res) {
          const serviceDataOBJ = JSON.parse(res.KYC_Risk_Rating_LoginResult)[0];
          // const UpdateKYCFlagsResult = kyc.UpdateKYCFlagsResult;
          if (serviceDataOBJ !== undefined) {
            this.custApi
              .UpdateKYCFlag(
                Formname,
                sessionStorage.getItem('CustomerID'),
                sessionStorage.getItem('Username'),
                serviceDataOBJ.Rating || ''
              )
              .subscribe((kyc) => {
                try {
                  if (kyc !== null && kyc !== undefined) {
                    const UpdateKYCFlagsResult = kyc.UpdateKYCFlagsResult;
                    console.log(UpdateKYCFlagsResult);
                  }
                } catch (ex) {
                  console.log(
                    'Error occured while updating KYC Flag in system :',
                    ex
                  );
                }
              });
          }
          // this.custApi.GetClientSetupformSavedForFuture(sessionStorage.getItem('Username')).subscribe(res => {
          //   if (res.GetDataResult !== '[]') {
          //     // console.log(res.GetDataResult);
          //     const serviceDataOBJ = JSON.parse(res.GetDataResult)[0];
          //     try {
          //       RiskRating = serviceDataOBJ.RiskRating;
          //       this.Note_Master_ID = serviceDataOBJ.NoteMasterID;

          //       this.homeApi.Portfolio = serviceDataOBJ.Portfolio;
          //       sessionStorage.setItem('RiskRating', RiskRating);
          //       sessionStorage.setItem('RiskProfile', serviceDataOBJ.RiskProfile);

          //     } catch (ex) {

          //     }
          //   }
          // });
        }
      });
    } catch (Ex) { }
  }
  addTile(tilename, row, column) {
    this.homeApi
      .updateCSPDashboardLayout(
        this.authApi.UserName,
        tilename,
        'Y',
        row,
        column
      )
      .subscribe((res) => {
        // console.log(res);
        if (res.UpdatePageNameListResult === true) {
          this.homeApi.getCSPDashboardLayout(this.authApi.UserName);
          //this.getDashboardLayout(this.authApi.UserName);
        }
      });
  }

  //[*] Added by Uddesh on 10 Feb, 2022 asked by Mohan P.
  //
  // ** PDF generation of client dashboard
  //
  GeneratePDF() {
    var data = document.getElementById('Dashboard');

    html2canvas(data, {
      backgroundColor: sessionStorage.getItem('bgcolor'),
      useCORS: true,
      allowTaint: true,
      scale: 2,
    }).then((canvas) => {
      // Few necessary setting options
      // var imgWidth = 208;
      var imgWidth = 209.8;
      var pageHeight = 297;
      // var imgHeight = (canvas.height * imgWidth) / canvas.width;
      // var imgHeight = canvas.height;

      // var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      const svg: any = document.getElementsByTagName('app-svg-icons');
      pdf.addSvgAsImage(svg, 1, 1, 100, 100, '', true);
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, pageHeight);
      pdf.save('CSP_Dashboard.pdf'); // Generated PDF
    });
  }
  //
  //
  // ** PDF generation of client dashboard
  //[*] Added by Uddesh on 10 Feb, 2022 asked by Mohan P. DONE
}
