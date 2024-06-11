import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { HomeApiService } from './home-api.service';
import { AppConfig } from './config.service';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Injectable({
  providedIn: 'root',
})
export class WorkflowApiService {
  interfaceURL = environment.interfaceURL;

  public getFoldersDataBS = new BehaviorSubject<any>([]);
  getFoldersDataObs = this.getFoldersDataBS.asObservable();

  PIBNo: any;

  RMWProductDetails: any;
  public portfolio = new BehaviorSubject<any>([]);
  Observerportfolio = this.portfolio.asObservable();

  private funds = new BehaviorSubject([]);
  fundDetails = this.funds.asObservable();

  fundSubscribe = new BehaviorSubject('');
  fundSubscribeObserver = this.fundSubscribe.asObservable();

  TradeList = new BehaviorSubject('');
  TradeListObserver = this.TradeList.asObservable();

  KYCCheck = new BehaviorSubject('');
  KYCCheckObserver = this.KYCCheck.asObservable();

  holdings = new BehaviorSubject([]);
  holdingsObserver = this.holdings.asObservable();

  public portfolioSecHolding = new BehaviorSubject<any>([]);
  portfolioSecHoldingObserver = this.portfolioSecHolding.asObservable();

  public CustPortfolioCashHoldings = new BehaviorSubject<any>([]);
  CustPortfolioCashHoldingsObserver =
    this.CustPortfolioCashHoldings.asObservable();

  public multiportfolio = new BehaviorSubject<any>([]);
  multiportfolioObserver = this.multiportfolio.asObservable();

  public PortfolioPerformanceDetails = new BehaviorSubject<any>([]);
  PortfolioPerformanceDetailsObserver =
    this.PortfolioPerformanceDetails.asObservable();

  public pnlportfoliosWorst = new BehaviorSubject<any>([]);
  pnlportfoliosWorstObserver = this.pnlportfoliosWorst.asObservable();

  public pnlportfoliosBest = new BehaviorSubject<any>([]);
  pnlportfoliosBestObserver = this.pnlportfoliosBest.asObservable();

  public CustPortfolioperformance = new BehaviorSubject<any>([]);
  CustPortfolioperformanceObserver =
    this.CustPortfolioperformance.asObservable();

  public configValue = new BehaviorSubject<any>([]);
  configValueObserver = this.configValue.asObservable();

  public liveNews = new BehaviorSubject<any>([]);
  liveNewsObserver = this.liveNews.asObservable();

  public NewsImage = new BehaviorSubject<any>([]);
  NewsImageObserver = this.NewsImage.asObservable();

  public freeCash = new BehaviorSubject<any>([]);
  freeCashObserver = this.freeCash.asObservable();

  public latestTrans = new BehaviorSubject<any>([]);
  latestTransObserver = this.latestTrans.asObservable();

  // public custPortPerf = new BehaviorSubject<any>([]);
  // custPortPerfObserver = this.custPortPerf.asObservable();

  public marketWatch = new BehaviorSubject<any>([]);
  marketWatchObserver = this.marketWatch.asObservable();

  public sharelist = new BehaviorSubject<any>([]);
  sharelistObserver = this.sharelist.asObservable();

  public shareDetails = new BehaviorSubject([]);
  shareDetailsObserver = this.shareDetails.asObservable();

  public eqsubscribe = new BehaviorSubject([]);
  eqsubscribeObserver = this.eqsubscribe.asObservable();

  private MF = new BehaviorSubject([]);
  MFList = this.MF.asObservable();

  private orderDetails = new BehaviorSubject([]);
  orderDetailsObserver = this.orderDetails.asObservable();

  private clientPnl = new BehaviorSubject([]);
  clientPnlObserver = this.clientPnl.asObservable();

  public bondlist = new BehaviorSubject([]);
  bondlistObserver = this.bondlist.asObservable();

  public bondDetails = new BehaviorSubject([]);
  bondDetailsObserver = this.bondDetails.asObservable();

  public bondDetailsRebal = new BehaviorSubject([]);
  bondDetailsRebalObserver = this.bondDetailsRebal.asObservable();

  public bondCalculations = new BehaviorSubject([]);
  bondCalculationsObserver = this.bondCalculations.asObservable();

  public bondsubscribe = new BehaviorSubject([]);
  bondsubscribeObserver = this.bondsubscribe.asObservable();

  public insurancelist = new BehaviorSubject([]);
  insurancelistObserver = this.insurancelist.asObservable();

  public resInsurance = new BehaviorSubject([]);
  resInsuranceObserver = this.resInsurance.asObservable();

  public insuranceDetails = new BehaviorSubject([]);
  insuranceDetailsObserver = this.insuranceDetails.asObservable();

  public insurancePremium = new BehaviorSubject([]);
  insurancePremiumObserver = this.insurancePremium.asObservable();

  public custPortPerfperiodic = new BehaviorSubject([]);
  custPortPerfperiodicObserver = this.custPortPerfperiodic.asObservable();

  public insAppID = new BehaviorSubject([]);
  insAppIDObserver = this.insAppID.asObservable();

  public RMWData = new BehaviorSubject<any>([]);
  RMWDataObserver = this.RMWData.asObservable();

  public RMWLayout = new BehaviorSubject<any>('');
  RMWLayoutObserver = this.RMWLayout.asObservable();

  public RMWFilterData = new BehaviorSubject<any>([]);
  RMWFilterDataObserver = this.RMWFilterData.asObservable();

  public RMWSortingData = new BehaviorSubject<any>([]);
  RMWSortingDataObserver = this.RMWSortingData.asObservable();

  public RMWFilterFillExchange = new BehaviorSubject<any>([]);
  RMWFillExchangeObserver = this.RMWFilterFillExchange.asObservable();

  public RMWFilterSQLDdl = new BehaviorSubject<any>([]);
  RMWFilterSQLDdlObserver = this.RMWFilterSQLDdl.asObservable();

  public RMWLinkData = new BehaviorSubject<any>([]);
  RMWLinkDataObserver = this.RMWLinkData.asObservable();

  public GetDataFromSQLFunction = new BehaviorSubject('');
  GetDataFromSQLFunctionObserver = this.GetDataFromSQLFunction.asObservable();

  public globalMarginData = new BehaviorSubject([]);
  globalMarginDataObserver = this.globalMarginData.asObservable();

  public liabilitiesData = new BehaviorSubject<any>([]);
  liabilitiesDataObserver = this.liabilitiesData.asObservable();

  notificationData = new BehaviorSubject<any>([]);
  notificationDataObserver = this.notificationData.asObservable();

  MFDetailsObserver = new BehaviorSubject('');
  MFDetails = this.MFDetailsObserver.asObservable();

  public MFDataObserver = new BehaviorSubject<any>([]);
  MFData = this.MFDataObserver.asObservable();

  public suitabilityCheckData = new BehaviorSubject<any>([]);
  suitabilityCheck = this.suitabilityCheckData.asObservable();

  public viewCPRAData = new BehaviorSubject<any>([]);
  viewCPRADataObserver = this.viewCPRAData.asObservable();

  public getLayout = new BehaviorSubject<any>([]);
  getLayoutObserver = this.getLayout.asObservable();

  public getMenu = new BehaviorSubject<any>([]);
  getMenuObserver = this.getMenu.asObservable();

  public getFactsheetData = new BehaviorSubject<any>([]);
  getFactsheetDataObserver = this.getFactsheetData.asObservable();

  public bondsAmend = new BehaviorSubject<any>([]);
  bondsAmendObserver = this.bondsAmend.asObservable();

  public bondsCancel = new BehaviorSubject<any>([]);
  bondsCancelObserver = this.bondsCancel.asObservable();

  public shareAmend = new BehaviorSubject<any>([]);
  shareAmendObserver = this.shareAmend.asObservable();

  public shareCancel = new BehaviorSubject<any>([]);
  shareCancelObserver = this.shareCancel.asObservable();

  customerChangeBS = new BehaviorSubject(''); // 32768
  customerChangeBSObserver = this.customerChangeBS.asObservable();

  selectedMPG = new BehaviorSubject([]);
  selectedMPGObserver = this.selectedMPG.asObservable();

  setFilterToggle = new BehaviorSubject(false);
  setFilterToggleObserver = this.setFilterToggle.asObservable();

  BlotterDataRows = new BehaviorSubject([]);
  BlotterDataRowsObserver = this.BlotterDataRows.asObservable();

  BlotterDataColumnHeader = new BehaviorSubject([]);
  BlotterDataColumnHeaderObserver = this.BlotterDataColumnHeader.asObservable();

  JorneyGraphVisibility = new BehaviorSubject([]);
  JorneyGraphVisibilityObserver = this.JorneyGraphVisibility.asObservable();
  
  BlotterItems = [];
  custList = [];
  metaDataResult = [];

  BlotterDataRowsCopy = [];
  insuranceList: any[] = [];
  custID: string;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  listData: any;
  shareList: any;

  constructor(
    public http: HttpClient,
    public authApi: AuthService,
    public homeApi: HomeApiService
  ) {
    this.shareList = [];
    this.custID = '';
    // this.getInsuranceList();
    // this.GetShareList('');
  }

  ResetkGetFactSheetData() {
    this.getFactsheetData.next([]);
  }

  ResetViewCPRAData() {
    this.viewCPRAData.next([]);
  }

  ResetRMWData() {
    this.RMWData.next([]);
  }

  ResetRMWLayout() {
    this.RMWLayout.next('');
  }

  ResetRMWFilterData() {
    this.RMWFilterData.next([]);
  }

  ResetRMWLinkData() {
    this.RMWLinkData.next([]);
  }

  ResetRMWFillExchange() {
    this.RMWFilterFillExchange.next([]);
  }

  ResetRMWFilterSQLDdl() {
    this.RMWFilterSQLDdl.next([]);
  }

  getPorfolio(customer) {
    const webMethod = this.interfaceURL + 'getPortfolio';

    const parameters = {
      CustomerID: customer,
    };
    const that = this;

    this.http.post<any>(webMethod, parameters).subscribe((res) => {
      // console.log(res);
      that.portfolio.next(res);
    });
  }

  loadFunds() {
    try {
      const webMethod = this.interfaceURL + 'GetMFDetails';
      const that = this;
      this.http.get<any>(webMethod).subscribe(
        (res: any) => {
          // console.log(res);
          if (res) {
            that.funds.next(res.GetMFListResult || []);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    } catch (error) {}
  }

  loadMutualFunds() {
    try {
      const webMethod = this.interfaceURL + 'GetMF';
      const that = this;
      this.http.get<any>(webMethod).subscribe(
        (res: any) => {
          // console.log(res);
          if (res) {
            that.MF.next(res.GetMutualFundsDetailsResult || []);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    } catch (error) {}
  }

  getNewApplicationID() {
    try {
      const webMethod = this.interfaceURL + 'GetApplicationid';
      let result: any;

      $.ajax({
        async: false,
        crossDomain: true,
        type: 'GET',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          result = data.GetAM_ApplicationIDResult;
        },
        error() {
          result = '';
        },
      });
      return result;
    } catch (error) {}
  }

  SubscribeFunds(
    notional,
    fundCode,
    transectionType,
    applicationType,
    switchFrom,
    switchTo,
    switchUnits,
    ModeofSettlement,
    RealizedAmountUnits,
    Ccy,
    RM,
    Book,
    CustomerType,
    CustomerName,
    DOB,
    IdentificationType,
    IdentificationNo,
    Nationality,
    Account_Number,
    portfolio,
    username
  ) {
    console.log(Ccy);
    // DOB = DOB.to
    const webMethod = this.interfaceURL + 'ImportUTAPI';
    const today = new Date();
    this.PIBNo = this.getNewApplicationID();
    // this.PIBNo = "PIB888963"
    console.log(
      CustomerType,
      CustomerName,
      DOB,
      IdentificationType,
      IdentificationNo,
      Nationality,
      Account_Number,
      portfolio
    );
    const parameters = {
      notional,
      fundCode,
      transectionType,
      ApplicationType: applicationType,
      applicationID: this.PIBNo,
      switchFrom,
      switchTo,
      switchUnits,
      ModeofSettlement,
      RealizedAmountUnits,
      Ccy,
      today:
        (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
        '-' +
        (today.getMonth() + 1 < 10
          ? '0' + (today.getMonth() + 1)
          : today.getMonth() + 1) +
        '-' +
        today.getFullYear() +
        ' ' +
        (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) +
        ':' +
        (today.getMinutes() < 10
          ? '0' + today.getMinutes()
          : today.getMinutes()) +
        ':' +
        '00',
      SubmittedDateTime:
        (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
        '-' +
        (today.getMonth() + 1 < 10
          ? '0' + (today.getMonth() + 1)
          : today.getMonth() + 1) +
        '-' +
        today.getFullYear() +
        ' ' +
        (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) +
        ':' +
        (today.getMinutes() < 10
          ? '0' + today.getMinutes()
          : today.getMinutes()) +
        ':' +
        '00',
      Trade:
        (today.getMonth() + 1 < 10
          ? '0' + (today.getMonth() + 1)
          : today.getMonth() + 1) +
        '-' +
        (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
        '-' +
        today.getFullYear(),
      RM,
      Book,
      CustomerType,
      CustomerName,
      DOB,
      IdentificationType,
      IdentificationNo,
      Nationality,
      Account_Number,
      portfolio,
      username,
    };

    const that = this;
    this.http.post<any>(webMethod, parameters).subscribe(
      (data: any) => {
        // console.log(data);
        if (data) {
          if (data.FinIQResponseBody.Status === 'SUCCESS') {
            const notemasterId = data.FinIQResponseBody.NoteMasterID;
            that.fundSubscribe.next(notemasterId);
          } else {
            that.fundSubscribe.next(data.FinIQResponseBody.Status);
          }
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  Get_KYCFeedbackIDCheck(FormName, customer) {
    const webMethod = this.interfaceURL + 'Get_KYCFeedbackIDCheck';

    const parameters = {
      custID: customer,
      FormName,
    };
    const that = this;

    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      // console.log(res);
      that.KYCCheck.next(res);
    });
  }

  GetHoldingsDetailsForRedeem(custId, fundCode) {
    const webMethod = this.interfaceURL + 'GetHoldingsForRedeem';

    const parameters = {
      custID: custId.toString(),
      fundCode,
    };
    const that = this;

    this.http.post<any>(webMethod, parameters).subscribe((res) => {
      // console.log(res);
      that.holdings.next(res);
    });
  }
  // 14jul changes
  getCustPortfolioSecurityHoldings(
    CustomerId: string,
    Portfolio: string,
    baseCCY: string
  ): any {
    try {
      const webMethod =
        this.interfaceURL + 'GetCustPortfolioSecurityHoldings_LCYE';
      const parameters = {
        CustomerId,
        Portfolio,
        baseCCY,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
        responseType: 'json',
      });
      result.subscribe((res) => {
        if (res) {
          // console.log(res);
          if (
            res.CustPortfolioSecurityHoldingsResponse
              .CustPortfolioSecurityHoldings !== undefined
          ) {
            this.portfolioSecHolding.next(
              res.CustPortfolioSecurityHoldingsResponse
                .CustPortfolioSecurityHoldings[0]
                .DCCustPortfolioSecurityHoldings
            );
          } else {
            this.portfolioSecHolding.next([]);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  // getCustPortfolioCashHoldings(custID: string): any {
  //   try {
  //     const webMethod = this.interfaceURL + 'getCustPortfolioCashHoldings';
  //     const parameters = {
  //       custID
  //     };
  //     const result = this.http.post<any>(webMethod, parameters, { headers: this.headerOptions });
  //     result.subscribe(res => { if (res) { console.log(res); this.CustPortfolioCashHoldings.next(res); } });
  //   } catch (error) {
  //     // console.error(error);
  //   }
  // }
  getPortfolioPerformanceDetails(customer: string, facility: string): any {
    try {
      const webMethod = this.interfaceURL + 'getportfolioperformance';
      const parameters = {
        customerId: customer,
        facilityCode: facility,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          this.PortfolioPerformanceDetails.next(res);
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  getPnlAllPortfoliosWorst(CustomerId: string, FacilityCode: string): any {
    try {
      const webMethod = this.interfaceURL + 'getpnlportfoliosworst';
      const parameters = {
        CustomerId,
        FacilityCode,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          this.pnlportfoliosWorst.next(res);
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  getPnlAllPortfoliosBest(CustomerId: string, FacilityCode: string): any {
    try {
      const webMethod = this.interfaceURL + 'getpnlportfoliosbest';
      const parameters = {
        CustomerId,
        FacilityCode,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          this.pnlportfoliosBest.next(res);
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  // getCustPortfolioPerformance(CustomerId: string, Portfolio: string): any {
  //   try {
  //     const webMethod = this.interfaceURL + 'getcustportfolioperformance';
  //     const parameters = {
  //       CustomerId, Portfolio
  //     };
  //     const result = this.http.post<any>(webMethod, parameters, { headers: this.headerOptions });
  //     // console.log(result);
  //     result.subscribe(res => { if (res) { console.log(res); this.CustPortfolioperformance.next(res); } });
  //   } catch (error) {
  //     // console.error(error);
  //   }
  // }

  getConfigValue(EntityID: string, ConfigName: string): any {
    try {
      const webMethod = this.interfaceURL + 'getconfigvalues';
      const parameters = {
        EntityID,
        ConfigName,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          this.configValue.next(res);
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  getLiveNews(LoginID): any {
    try {
      const webMethod = this.interfaceURL + 'getlivenews';
      const parameters = {
        LoginID,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          this.liveNews.next(res);
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  getNewsImage(newsID): any {
    try {
      const webMethod = this.interfaceURL + 'GetNewsImage/' + newsID;
      const result = this.http.get<any>(webMethod, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          this.NewsImage.next(res);
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  getNewsImageContent(newsId): string {
    let result = '';
    try {
      // // console.log('GetNewsImage');
      const webMethod = this.interfaceURL + 'GetNewsImage';
      const parameters = {
        newsId,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          // console.log(data);
          result = data;
        },
        error() {
          // console.log(error);
          result = '';
        },
      });
      // return this.resMsg;
    } catch (error) {
      // console.log('Error:', error);
    }
    return result;
  }

  // getFreeCash(user, custID, portfolio): any {
  //   try {
  //     const webMethod = this.interfaceURL + 'getFreeCash';
  //     const parameters = {
  //       user,
  //       custID,
  //       portfolio
  //     };
  //     const result = this.http.post<any>(webMethod, parameters, { headers: this.headerOptions });
  //     result.subscribe(res => { if (res) { this.freeCash.next(res); } });
  //   } catch (error) {
  //     // console.error(error);
  //   }
  // }

  // getlatesttrans(CustomerID,portfolio): any {
  //   try {
  //     const webMethod = this.interfaceURL + 'getlatesttrans';
  //     const parameters = {
  //       CustomerID,
  //       portfolio
  //     };
  //     const result = this.http.post<any>(webMethod, parameters, { headers: this.headerOptions });
  //     result.subscribe(res => { if (res) { this.latestTrans.next(res); } });
  //   } catch (error) {
  //     // console.error(error);
  //   }
  // }
  // getcustPortPerf(CustomerID, baseCCY): any {
  //   try {
  //     const webMethod = this.interfaceURL + 'getcustperformance_LCYE';
  //     const parameters = {
  //       CustomerID,
  //       baseCCY
  //     };
  //     const result = this.http.post<any>(webMethod, parameters, { headers: this.headerOptions });
  //     result.subscribe(res => { if (res) { this.custPortPerf.next(res); } });
  //   } catch (error) {
  //     // console.error(error);
  //   }
  // }

  // getMarketWatch(CustomerID): any {
  //   try {
  //     const webMethod = this.interfaceURL + 'getMarketWatch';
  //     const parameters = {
  //       CustomerID
  //     };
  //     const result = this.http.post<any>(webMethod, parameters, { headers: this.headerOptions });
  //     result.subscribe(res => { if (res) { this.marketWatch.next(res); } });
  //   } catch (error) {
  //     // console.error(error);
  //   }
  // }

  getmultiPortfolio(LoginID: any): any {
    try {
      const webMethod = this.interfaceURL + 'getCustomerAccDetails';
      const parameters = {
        LoginID,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            // console.log(res);
            this.multiportfolio.next(res);
          } else {
            // console.log(res.error);
          }
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  // shares api

  GetShareList(ProductName) {
    try {
      const webMethod = this.interfaceURL + 'getsharelist';
      const parameters = {
        ProductName,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          this.sharelist.next(res.ListProduct.items);
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }
  async GetShareListAsync(ProductName) {
    try {
      const webMethod = this.interfaceURL + 'getsharelist';
      const parameters = {
        ProductName,
      };
      const result = await this.http
        .post<any>(webMethod, parameters, {
          headers: this.headerOptions,
        })
        .toPromise()
        .then((res) => {
          if (res.FinIQResponseHeader.Status.toUpperCase() === 'FAILED') {
            return [];
          }
          return res.ListProduct.items;
        });
      return result;
    } catch (error) {
      // console.error(error);
    }
  }
  GetIndividualShareDetails(NoteMasterID) {
    try {
      const webMethod = this.interfaceURL + 'getshareinfo';
      const parameters = {
        NoteMasterID,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          this.shareDetails.next(res.ListInfoProduct);
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }
  SubscribeEquities(
    UnderlyingCode,
    Side,
    ccy,
    TradeDate,
    SettType,
    SettDate,
    OrderType,
    Price,
    TimeInForce,
    ExpDate,
    OrderQty,
    Exchange,
    portfolio,
    CustomerName,
    username,
    Account_Number,
    CIF,
    NetAmt,
    BankContribution,
    FundingType,
    LoanTenor
  ) {
    try {
      const webMethod = this.interfaceURL + 'EQOrderSave';
      const parameters = {
        UnderlyingCode,
        Side,
        CCY: ccy,
        TradeDate,
        SettlType: SettType,
        SettleDate: SettDate,
        OrderType,
        Price,
        TimeInForce,
        ExpDate,
        OrderQty,
        ExDestination: Exchange,
        portfolio,
        CustomerName,
        UserID: username,
        Account_Number,
        CIF,
        NetAmt,
        // Changes done by Alolika G on 28-02-2022
        BankContribution,
        FundingType,
        LoanTenor,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          // console.log(res);
          this.eqsubscribe.next(res);
        }
      });
    } catch (ex) {
      // console.log(ex);
    }
  }
  SubscribeEquitiesBulkOrder(
    UnderlyingCode,
    Side,
    ccy,
    TradeDate,
    SettType,
    SettDate,
    OrderType,
    Price,
    TimeInForce,
    ExpDate,
    OrderQty,
    Exchange,
    portfolio,
    CustomerName,
    username,
    Account_Number,
    CIF,
    NetAmt
  ) {
    try {
      const webMethod = this.interfaceURL + 'EQOrderSave';
      const parameters = {
        UnderlyingCode,
        Side,
        CCY: ccy,
        TradeDate,
        SettlType: SettType,
        SettleDate: SettDate,
        OrderType,
        Price,
        TimeInForce,
        ExpDate,
        OrderQty,
        ExDestination: Exchange,
        portfolio,
        CustomerName,
        UserID: username,
        Account_Number,
        CIF,
        NetAmt,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (ex) {
      // console.log(ex);
    }
  }

  getNewApplicationIDForMF(loginId) {
    try {
      const webMethod = this.interfaceURL + 'GetApplicationidforMF';
      let result: any;

      const parameters = {
        login_id: loginId,
      };

      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          result = data.GetNewApplicationIdResult;
        },
        error() {
          result = '';
        },
      });
      return result;
    } catch (error) {}
  }

  FundsOrderEntry(
    notional,
    fundCode,
    transectionType,
    applicationType,
    switchFrom,
    switchTo,
    switchUnits,
    ModeofSettlement,
    RealizedAmountUnits,
    Ccy,
    RM,
    Book,
    CustomerType,
    CustomerName,
    DOB,
    IdentificationType,
    IdentificationNo,
    Nationality,
    Account_Number,
    portfolio,
    username
  ) {
    console.log(Ccy);
    // DOB = DOB.to
    const webMethod = this.interfaceURL + 'MutualFundsSubscribe';
    const today = new Date();
    const PIB = this.getNewApplicationIDForMF('Dealer4');
    // this.PIBNo = "PIB888963"
    console.log(
      CustomerType,
      CustomerName,
      DOB,
      IdentificationType,
      IdentificationNo,
      Nationality,
      Account_Number,
      portfolio
    );
    const parameters = {
      notional,
      fundCode,
      transectionType,
      ApplicationType: applicationType,
      applicationID: PIB,
      switchFrom,
      switchTo,
      switchUnits,
      ModeofSettlement,
      RealizedAmountUnits,
      Ccy,
      today:
        (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
        '-' +
        (today.getMonth() + 1 < 10
          ? '0' + (today.getMonth() + 1)
          : today.getMonth() + 1) +
        '-' +
        today.getFullYear() +
        ' ' +
        (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) +
        ':' +
        (today.getMinutes() < 10
          ? '0' + today.getMinutes()
          : today.getMinutes()) +
        ':' +
        '00',
      SubmittedDateTime:
        (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
        '-' +
        (today.getMonth() + 1 < 10
          ? '0' + (today.getMonth() + 1)
          : today.getMonth() + 1) +
        '-' +
        today.getFullYear() +
        ' ' +
        (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) +
        ':' +
        (today.getMinutes() < 10
          ? '0' + today.getMinutes()
          : today.getMinutes()) +
        ':' +
        '00',
      Trade:
        +(today.getMonth() + 1 < 10
          ? '0' + (today.getMonth() + 1)
          : today.getMonth() + 1) +
        '-' +
        (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
        '-' +
        today.getFullYear(),
      RM,
      Book,
      CustomerType,
      CustomerName,
      DOB,
      IdentificationType,
      IdentificationNo,
      Nationality,
      Account_Number,
      portfolio,
      username,
    };

    const that = this;
    this.http.post<any>(webMethod, parameters).subscribe(
      (data: any) => {
        // console.log(data);
        if (data) {
          if (data.FinIQResponseBody.Status === 'SUCCESS') {
            const notemasterId = data.FinIQResponseBody.NoteMasterID;
            that.fundSubscribe.next(notemasterId);
          } else {
            that.fundSubscribe.next(data.FinIQResponseBody.Status);
          }
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getAllOrderDetails(custID, portfolio) {
    const webMethod = this.interfaceURL + 'GetAllOrderDetails';

    const parameters = {
      custID,
      portfolio,
    };

    return this.http.post<any>(webMethod + '', parameters);

    // .subscribe(res => {
    //   // console.log(res);
    //   that.orderDetails.next(res);
    // });
  }

  // getClientWisePnL(custID, baseCCY, portfolio) {
  //   const webMethod = this.interfaceURL + 'GetClientWisePnL_LCYE';

  //   const parameters = {
  //     custID,
  //     baseCCY,
  //     portfolio
  //   };
  //   const that = this;

  //   this.http.post<any>(webMethod + '', parameters).subscribe(res => {
  //     // console.log(res);
  //     that.clientPnl.next(res);
  //   });

  // }

  // getInterestRate(boardRateObj: any): Promise<any> {
  //   try {
  //     return this.http.post(this.interfaceURL + 'depositsAPI/interestRate', boardRateObj)
  //       .toPromise()
  //       .then(response => response)
  //       .catch(this.catchHandler);
  //   } catch (error) {
  //     // console.log("Error:", error);
  //   }
  // }

  // getMaturityDays(tenorObj: any): Promise<any> {
  //   try {
  //     return this.http.post(this.interfaceURL + 'depositsAPI/maturityDate', tenorObj)
  //       .toPromise()
  //       .then(response => response)
  //       .catch(this.catchHandler);
  //   } catch (error) {
  //     // console.log("Error:", error);
  //   }
  // }

  // calculatePrincipleAmount(principle: any): Promise<any> {
  //   try {
  //     return this.http.post(this.interfaceURL + 'depositsAPI/principleAmount', principle)
  //       .toPromise()
  //       .then(response => response)
  //       .catch(this.catchHandler);
  //   } catch (error) {
  //     // console.log("Error:", error);
  //   }
  // }

  saveDealEntry(saveDeal: any): Promise<any> {
    try {
      return this.http
        .post(this.interfaceURL + 'depositsAPI/saveOrder', saveDeal)
        .toPromise()
        .then((response) => response)
        .catch(this.catchHandler);
    } catch (error) {
      // console.log("Error:", error);
      return null;
    }
  }

  catchHandler(error: HttpErrorResponse) {
    try {
      if (error.error instanceof ErrorEvent) {
        // console.log("An Error Occured", error.message);
      }
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  getbondslist(LoginID, ProductName, EntityCode) {
    try {
      const webMethod = this.interfaceURL + 'searchbonds';
      const parameters = {
        EntityCode,
        LoginID,
        ProductName,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          this.bondlist.next(res.ListProduct.items);
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }
  async getbondslistasync(LoginID, ProductName, EntityCode) {
    try {
      const webMethod = this.interfaceURL + 'searchbonds';
      const parameters = {
        EntityCode,
        LoginID,
        ProductName,
      };
      const result = await this.http
        .post<any>(webMethod, parameters, {
          headers: this.headerOptions,
        })
        .toPromise()
        .then((res) => {
          if (res.FinIQResponseHeader.Status.toUpperCase() === 'FAILED') {
            return [];
          }
          return res.ListProduct.items;
        });
      return result;
    } catch (error) {
      // console.error(error);
    }
  }
  Resetgetbonddetails() {
    this.bondDetails.next([]);
  }
  getbonddetails(ISINNumber, EntityCode, LoginID) {
    try {
      const webMethod = this.interfaceURL + 'getbondinfo';
      const parameters = {
        LoginID,
        EntityCode,
        ISINNumber,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          this.bondDetails.next(res.BondInfoResponse);
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  async getbondinfoRebalance(ISIN, EntityCode, LoginID) {
    try {
      const webMethod = this.interfaceURL + 'getbondinfoRebalance';
      const parameters = {
        LoginID,
        EntityCode,
        ISIN,
      };
      const result = await this.http
        .post<any>(webMethod, parameters, {
          headers: this.headerOptions,
        })
        .toPromise()
        .then((res) => {
          if (res) {
            return res.BondInfoResponse;
          }
        });
      return result;
    } catch (error) {
      // console.error(error);
    }
  }

  getbondCalculations(
    LoginID,
    NoteMasterId,
    Notional,
    Side,
    SettlementDate,
    Spread,
    OrderType,
    EntityCode,
    ClientLimitPrice,
    ISIN
  ) {
    try {
      const webMethod = this.interfaceURL + 'getbondcalculations';
      const parameters = {
        EntityCode,
        LoginID,
        NoteMasterId,
        Notional,
        Side,
        SettlementDate,
        Spread,
        OrderType,
        ClientLimitPrice,
        ISIN,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          this.bondCalculations.next(res.BondCalcResponse);
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }
  getbondsubscribe(
    ISIN,
    Currency,
    Side,
    Notional,
    SettDate,
    Spread,
    AccInt,
    SettAmt,
    TradeDate,
    SettType,
    ExpDate,
    _PriceType,
    Price,
    DirtyPrice,
    CleanPrice,
    YTM,
    Proceeds,
    PNL,
    Portfolio,
    TimeInForce,
    OrderType,
    NoteMasterID,
    CustDirtyPrice,
    CustCleanPrice,
    MarketCleanPrice,
    MarketDirtyPrice,
    YTC,
    YTP,
    YTConv,
    UserID,
    CustomerName,
    AccNo,
    EntityCode,
    QuantityType,
    RMName
  ) {
    try {
      const webMethod = this.interfaceURL + 'subscribebond';
      const parameters = {
        ISIN,
        Currency,
        Side,
        Qty: Notional,
        SettDate,
        OrderType,
        Spread,
        AccInt,
        SettAmt,
        TradeDate,
        SettType,
        ExpDate,
        IssueSize: '1',
        PriceType: 1,
        Price,
        DirtyPrice,
        CleanPrice,
        YTM,
        Nominal: Notional,
        Proceeds,
        PNL,
        Portfolio,
        TimeInForce,
        NoteMasterID,
        CustDirtyPrice,
        CustCleanPrice,
        MarketCleanPrice,
        MarketDirtyPrice,
        YTC,
        YTP,
        YTConv,
        UserID,
        CustomerName,
        AccNo,
        EntityCode,
        QuantityType,
        RMName,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          this.bondsubscribe.next(res.Order_Save_Res_DTO.objResponseDetails);
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  // Deposits API calls Added by Ketan S.
  getInterestRate(boardRateObj: any): Promise<any> {
    try {
      return this.http
        .post(this.interfaceURL + 'depositsAPI/interestRate', boardRateObj)
        .toPromise()
        .then((response) => response)
        .catch(this.catchHandler);
    } catch (error) {
      // console.log("Error:", error);
      return null;
    }
  }

  getMaturityDays(tenorObj: any): Promise<any> {
    try {
      return this.http
        .post(this.interfaceURL + 'depositsAPI/maturityDate', tenorObj)
        .toPromise()
        .then((response) => response)
        .catch(this.catchHandler);
    } catch (error) {
      // console.log("Error:", error);
      return null;
    }
  }

  calculatePrincipleAmount(principle: any): Promise<any> {
    try {
      return this.http
        .post(this.interfaceURL + 'depositsAPI/principleAmount', principle)
        .toPromise()
        .then((response) => response)
        .catch(this.catchHandler);
    } catch (error) {
      // console.log("Error:", error);
      return null;
    }
  }
  // End of Deposits API calls Added by Ketan S.
  // insurance API

  getInsuranceList() {
    try {
      const webMethod = this.interfaceURL + 'getinsurancelist';
      const that = this;
      this.http.get<any>(webMethod).subscribe(
        (res: any) => {
          // console.log(res);
          if (res) {
            this.insuranceList = res.getProductDetailsResult;
            this.insurancelist.next(res);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    } catch (error) {}
  }

  ImportInsuranceProduct(
    APPID,
    CCY,
    Premium,
    SumAssured,
    ProductRisk,
    ProductCode,
    ProductName,
    Method,
    policyTerm,
    paymentTerm,
    commencementDate,
    paymentFreq,
    UserID,
    portfolio,
    customerName,
    accountNo
  ) {
    try {
      // console.log(APPID, CCY, Premium, SumAssured, ProductRisk, ProductCode, ProductName, Method, policyTerm, paymentTerm, commencementDate, paymentFreq, UserID, portfolio, customerName, accountNo);
      // const param = {
      //   APPID: 'INS3422134',
      //   CCY: 'AUD',
      //   Method: 'Cash',
      //   Premium: '000000000000000000000000000000',
      //   ProductCode: 'AVIVA30',
      //   ProductName: 'WeCare Life Protection Plan (HKD)',
      //   ProductRisk: '1',
      //   SumAssured: '000000000000000000011111111110.00',
      //   commencementDate: '05-Aug-2020',
      //   paymentFreq: 'Annually',
      //   paymentTerm: '123',
      //   policyTerm: '12312',
      // };
      const webMethod = this.interfaceURL + 'ImportInsuranceProduct';
      const parameters = {
        APPID,
        CCY,
        Method,
        Premium,
        ProductCode,
        ProductName,
        ProductRisk,
        SumAssured,
        commencementDate,
        paymentFreq,
        policyTerm,
        paymentTerm,
        UserID,
        portfolio,
        customerName,
        accountNo,
      };
      // console.log(parameters);
      const that = this;
      const headers = new HttpHeaders()
        .set('Accept', 'application/xml')
        .set('Response-Type', 'Text');

      this.http
        .post<any>(webMethod, parameters, { headers, responseType: 'json' })
        .subscribe(
          (res: any) => {
            // console.log(res);
            if (res) {
              that.resInsurance.next(res[0]);
            }
          },
          (err: any) => {
            console.log(err);
          }
        );
    } catch (error) {
      // console.log('Error:', error);
    }
  }

  // GetCustInsuranceDetails(custID, custName, EntityId,baseCCY) {
  //   try {
  //     const webMethod = this.interfaceURL + 'Get_CustInsuranceDetails_LCYE';
  //     const parameters = {
  //       custID,
  //       custName,
  //       EntityId,
  //       baseCCY
  //     };
  //     const result = this.http.post<any>(webMethod, parameters, { headers: this.headerOptions });
  //     result.subscribe(res => { if (res) { this.insuranceDetails.next(res.Get_CustInsuranceDetails_LCYEResult); } });
  //   } catch (error) {
  //     // console.error(error);
  //   }
  // }

  // GetInsurancePremiumDetails(login, custID,baseCCY) {
  //   try {
  //     const webMethod = this.interfaceURL + 'GetInsurancePremiumDetails_LCYE';
  //     const parameters = {
  //       login,
  //       custID,
  //       baseCCY
  //     };
  //     const result = this.http.post<any>(webMethod, parameters, { headers: this.headerOptions });
  //     result.subscribe(res => { if (res) { this.insurancePremium.next(res.GetInsurancePremiumDetails_LCYEResult); } });
  //   } catch (error) {
  //     // console.error(error);
  //   }
  // }

  getINSApplicationID() {
    try {
      const webMethod = this.interfaceURL + 'getinsappid';
      const that = this;
      this.http.get<any>(webMethod).subscribe(
        (res: any) => {
          // console.log(res);
          if (res) {
            that.insAppID.next(res);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    } catch (error) {}
  }
  // getcustPortPerfPeriodic(CustomerID, Period, baseCCY): any {
  //   try {
  //     const webMethod = this.interfaceURL + 'getcustperfperiodic_LCYE';
  //     const parameters = {
  //       CustomerID, Period, baseCCY
  //     };
  //     const result = this.http.post<any>(webMethod, parameters, { headers: this.headerOptions });
  //     result.subscribe(res => { if (res) { this.custPortPerfperiodic.next(res); } });
  //   } catch (error) {
  //     // console.error(error);
  //   }
  // }

  getRMWData(
    TemplateName,
    username,
    filterString,
    selectedProduct,
    pageNo,
    EntityCode,
    pageSize,
    SortingCriteria,
    foldersString,
    ListType,
    Product_Name,
    Isin
  ) {
    try {
      const webMethod = this.interfaceURL + 'getRMWData';

      const parameters = {
        EntityCode,
        TemplateName,
        Product_Name,
        Isin,
        username,
        filterString,
        selectedProduct,
        Page_No: pageNo,
        RowsperRequest: pageSize,
        SortingCriteria,
        foldersString,
        ListType,
      };
      // const that = this;

      this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
        // console.log(res);
        this.RMWData.next(res);
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  getRMWDataforSearch(
    TemplateName,
    username,
    filterString,
    selectedProduct,
    pageNo,
    EntityCode,
    pageSize,
    SortingCriteria,
    foldersString,
    ListType,
    Product_Name,
    Isin
  ) {
    try {
      const body = {
        EntityCode,
        TemplateName,
        Product_Name,
        Isin,
        username,
        filterString,
        selectedProduct,
        Page_No: pageNo,
        RowsperRequest: pageSize,
        SortingCriteria,
        foldersString,
        ListType,
      };

      return this.http.post<any>(this.interfaceURL + 'getRMWData', body);
    } catch (error) {
      console.log(error);
    }
  }

  getRMWLayout(templateID) {
    try {
      const webMethod = this.interfaceURL + 'getRMWLayout';

      const parameters = {
        templateID,
      };
      // const that = this;

      this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
        // console.log(res);
        this.RMWLayout.next(res);
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  getTemplates() {
    try {
      const webMethod = this.interfaceURL + 'getTemplates';
      return this.http.get<any>(webMethod);
    } catch (ex) {
      console.log(ex);
    }
  }

  getRMWFilter(templateID) {
    try {
      const webMethod = this.interfaceURL + 'getRMWFilters';

      const parameters = {
        templateID,
      };
      // const that = this;

      this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
        // console.log(res);
        this.RMWFilterData.next(res);
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  getRMWSortingData(templateID) {
    try {
      const webMethod = this.interfaceURL + 'getRMWSortingData';

      const parameters = {
        templateID,
      };
      // const that = this;

      this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
        // console.log(res);
        this.RMWSortingData.next(res);
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  FillExchange(LoginID) {
    try {
      const webMethod = this.interfaceURL + 'FillExchange';
      const parameters = { LoginID };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      return result;
    } catch (exception) {
      // console.log(exception);
      return null;
    }
  }

  FillIssuerDetails(LoginID) {
    try {
      const webMethod = this.interfaceURL + 'FillIssuerDetails';
      const parameters = { LoginID };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      return result;
    } catch (exception) {
      // console.log(exception);
      return null;
    }
  }

  GenericSQLToFillDropdown() {
    try {
      const webMethod = this.interfaceURL + 'GenericSQLToFillDropdown';
      const parameters = {};
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      return result;
    } catch (exception) {
      // console.log(exception);
      return null;
    }
  }

  // GenericSQLToFillDropdown(LoginID) {
  //   try {
  //     const webMethod = this.interfaceURL + 'GenericSQLToFillDropdown';

  //     const parameters = {
  //       LoginID
  //     };
  //     // const that = this;

  //     this.http.post<any>(webMethod + '', parameters).subscribe(res => {
  //       // console.log(res);
  //       this.RMWFilterSQLDdl.next(res);
  //     });
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // }

  getRMWActionLinks(templateID, UserAccess, LayoutCode) {
    try {
      const webMethod = this.interfaceURL + 'GetRMWActionLinks';

      const parameters = {
        templateID,
        UserAccess,
        LayoutCode
      };
      // const that = this;

      // this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      //   // console.log(res);
      //   this.RMWLinkData.next(res);
      // });

      return this.http.post<any>(webMethod, parameters); 
      
    } catch (ex) {
      console.log(ex);
    }
  }

  async getDataFromFunction(functionName, param) {
    try {
      const webMethod = this.interfaceURL + 'getDatafromSQLFuction';
      try {
        const parameters = {
          functionName,
          param,
        };
        return this.http.post<any>(webMethod, parameters).toPromise();

        // $.ajax({
        //   async: false,
        //   crossDomain: true,
        //   data: JSON.stringify(parameters),
        //   type: 'POST',
        //   url: webMethod,
        //   contentType: 'application/json; charset=utf-8',
        //   dataType: 'json',
        //   headers: {
        //     'Cache-Control': 'no-cache',
        //     'Access-Control-Allow-Origin': '*'
        //   },
        //   success(data) {
        //     xml2js.parseString(data.Get_Function_ValueResult, (err, response) => {
        //       // console.log(response);
        //       if (response !== undefined) {
        //         result = response;
        //       } else {
        //         result = '';
        //       }
        //     });
        //   },
        //   error() {
        //     result = 'error';
        //   }
        // });
      } catch (error) {}
    } catch (error) {}
  }

  getGlobalMarginReportData(login, baseCCY) {
    const webMethod = this.interfaceURL + 'GetGlobalMarginReportData_LCYE';

    const parameters = {
      login,
      baseCCY,
    };
    const that = this;

    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      // console.log(res);
      that.globalMarginData.next(res);
    });
  }

  GetLiabilitiesData(username, custid) {
    const webMethod = this.interfaceURL + 'GetLiabilitiesData';
    const today = new Date();
    const parameters = {
      username,
      custid,
      today:
        (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
        '-' +
        (today.getMonth() + 1 < 10
          ? '0' + (today.getMonth() + 1)
          : today.getMonth() + 1) +
        '-' +
        today.getFullYear() +
        ' ' +
        (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) +
        ':' +
        (today.getMinutes() < 10
          ? '0' + today.getMinutes()
          : today.getMinutes()) +
        ':' +
        '00',
    };
    const that = this;

    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      // console.log(res);
      that.liabilitiesData.next(res);
    });
  }

  GetCSPNotifications() {
    const webMethod = this.interfaceURL + 'GetCSPNotifications';
    const that = this;

    this.http.get<any>(webMethod + '').subscribe((res) => {
      // console.log(res);
      that.notificationData.next(res);
    });
  }

  getMFDetails(MFCode: any) {
    try {
      const webMethod = this.interfaceURL + 'MFDetails';
      const parameters = { MFCode };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      result.subscribe((res) => {
        if (res) {
          if (!res.Error) {
            this.MFDetailsObserver.next(
              res.ArrayOfDC_MFDetails.DC_MFDetails[0]
            );
          }
        }
      });
    } catch (exception) {
      // console.log(exception);
    }
  }

  getMFDetailsFundSwitch(MFCode: any) {
    try {
      const webMethod = this.interfaceURL + 'MFDetails';
      const parameters = { MFCode };
      return this.http.post<any>(webMethod, parameters);
    } catch (exception) {
      // console.log(exception);
    }
  }
  fngetMFGenericfn(functionName: string, ParamList: any) {
    try {
      const webMethod = this.interfaceURL + 'getMFGenericfn';
      const parameters = { functionName, ParamList };

      return this.http.post<any>(webMethod, parameters);
    } catch (exception) {
      // console.log(exception);
    }
  }

  getMFDetailsNewLayout(MFCode: any) {
    try {
      const webMethod = this.interfaceURL + 'getMFDetailsNewLayout';
      const parameters = { MFCode };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      // console.log(exception);
    }
  }

  getMFNAVHistorychart(
    MFCode: any,
    FromDate: any,
    ToDate: any,
    TimePeriod: any
  ) {
    try {
      const webMethod = this.interfaceURL + 'GetDateChartdata';
      const parameters = { MFCode, FromDate, ToDate, TimePeriod };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      return result;
      // result.subscribe(res => { if (res) { if (!res.Error) { this.NAVHistoryObserver.next(res.GetDateChartdataResult); } } });
    } catch (exception) {
      // console.log(exception);
      return null;
    }
  }

  setMFData(data) {
    this.MFDataObserver.next(data);
  }
  ResetMFDetails() {
    this.MFDetailsObserver.next(null);
  }

  ResetFundSubscribe() {
    this.fundSubscribe.next('');
  }

  GetsuitabilityCheckData(name, id, login) {
    const webMethod = this.interfaceURL + 'suitabilityCheck';
    const parameters = {
      name,
      id,
      login,
    };
    const that = this;

    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      // console.log(res);
      that.suitabilityCheckData.next(res);
    });
  }

  getCPRAData(RiskRating, custid) {
    const webMethod = this.interfaceURL + 'viewCPRA';
    const parameters = {
      RiskRating,
      custid,
    };
    return this.http.post<any>(webMethod + '', parameters);
  }

  // news

  getNewsConfig(): any {
    let result = {};
    try {
      const webMethod = this.interfaceURL + 'getnewsconfig';
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'GET',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          result = data;
        },
      });
    } catch (error) {
      result = {};
    }
    return result;
  }

  fetchNewsDetails(newsId, noRecords, valideFrom, validTill, tags = ''): any[] {
    let result: any[] = [];
    try {
      // // console.log('FetchNewsDetails');
      const webMethod = this.interfaceURL + 'FetchNewsDetails';
      const parameters = {
        News_ID: newsId,
        NoOfRecords: noRecords,
        ValidFrom: valideFrom,
        ValidTill: validTill,
        Tags: tags,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          if (data?.ListFetchNewsDetailsResponse?.items) {
            // console.log(data?.ListFetchNewsDetailsResponse?.items);
            result = data?.ListFetchNewsDetailsResponse?.items;
          } else {
            result = [];
          }
        },
        error() {
          // console.log(error);
          result = [];
        },
      });
      // return this.resMsg;
    } catch (error) {
      // console.log('Error:', error);
    }
    return result;
  }

  getNewsAttachment(filename): string {
    let result = '';
    try {
      // console.log('GetNewsImage');
      const webMethod = this.interfaceURL + 'GetNewsAttachment';
      const parameters = {
        filename,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          // console.log(data);
          result = data;
        },
        error() {
          // console.log(error);
          result = '';
        },
      });
      // return this.resMsg;
    } catch (error) {
      // console.log('Error:', error);
    }
    return result;
  }

  getNewsLikeAPI(newsId): string {
    let result = 'N';
    try {
      // console.log('getNewsLikeAPI');
      const webMethod = this.interfaceURL + 'getNewsLikeAPI';
      const parameters = {
        News_ID: newsId,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          if (data?.GetNewsLikeResponseDetails?.Like_Value) {
            // console.log(data?.GetNewsLikeResponseDetails?.Like_Value);
            result = data?.GetNewsLikeResponseDetails?.Like_Value;
          } else {
            result = 'N';
          }
        },
        error() {
          // console.log(error);
          result = 'N';
        },
      });
      // return this.resMsg;
    } catch (error) {
      // console.log('Error:', error);
    }
    return result;
  }

  getNoOfNewsLikesAPI(newsId): number {
    let result = 0;
    try {
      // console.log('getNoOfNewsLikesAPI');
      const webMethod = this.interfaceURL + 'getNoOfNewsLikesAPI';
      const parameters = {
        News_ID: newsId + '',
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          if (data?.GetNewsLikeResponseDetails?.Like_Value) {
            // console.log(data?.GetNewsLikeResponseDetails?.Like_Value);
            result = data?.GetNewsLikeResponseDetails?.Like_Value;
          } else {
            result = 0;
          }
        },
        error(error) {
          console.log(error);
          result = 0;
        },
      });
      // return this.resMsg;
    } catch (error) {
      // console.log('Error:', error);
    }
    return parseInt(result + '', 10);
  }

  setNewsLikeAPI(newsId, likeValue): string {
    let result = null;
    try {
      // console.log('setNewsLikeAPI');
      const webMethod = this.interfaceURL + 'setNewsLikeAPI';
      const parameters = {
        Like_Value: likeValue,
        News_ID: newsId,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          if (data?.SetNewsLikeResponseDetails?.Status) {
            // console.log(data?.SetNewsLikeResponseDetails?.Status);
            result = data?.SetNewsLikeResponseDetails?.Status;
          } else {
            result = null;
          }
        },
        error(error) {
          console.log(error);
          result = null;
        },
      });
      // return this.resMsg;
    } catch (error) {
      // console.log('Error:', error);
    }
    return result;
  }

  GetRMWProductDetails(
    template: any,
    productfilter: any,
    ccy: any,
    sortBy: any,
    templateCode: any,
    rowsperpage: any,
    folderName: any,
    pageNo: any,
    search: any,
    FilterCriteria: any,
    ListType: any
  ) {
    const webMethod = this.interfaceURL + 'GetRMWProductDetails';

    const parameters = {
      Template_Name: template,
      Product_Name: productfilter,
      SortingCriteria: 'Note_Master_ID desc', // + sortBy,
      RowsperRequest: rowsperpage,
      FilterCriteria,
      Folder_Name: folderName,
      Page_No: pageNo,
      WhereClause: search,
      LoginID: sessionStorage.getItem('Username'),
      ListType,
      ccy,
      sortBy,
      templateCode,
    };
    const that = this;
    $.ajax({
      async: false,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        that.RMWProductDetails = [];
        if (data.RMWGenericResponse.items != null) {
          // that.RMWProductDetails = JSON.parse(data.RMWGenericResponse.items.replace(/\n/g, ''));
          that.RMWProductDetails = data.RMWGenericResponse;
        }
        // that.stopLoading();
        return that.RMWProductDetails;
      },
    });
    return this.RMWProductDetails;
  }

  // Get_FoldersAPI(LoginID) {
  //   const webMethod = this.interfaceURL + 'Get_FoldersAPI';

  //   const parameters = {
  //     LoginID
  //   };
  //   const that = this;

  //   this.http.post<any>(webMethod + '', parameters).subscribe(res => {
  //     // console.log('get folders api',res);
  //     // that.getFoldersDataBS.next(res);
  //     that.listData = res;
  //   });
  //   return this.listData;
  // }

  Get_FoldersAPI(LoginID, EntityID) {
    try {
      const webMethod = this.interfaceURL + 'Get_FoldersAPI';
      const parameters = { LoginID, EntityID };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      return result;
    } catch (exception) {
      return null;
      // console.log(exception);
    }
  }

  Save_Folder(FolderName, NoteMasterID, CustomerID, EntityID, User, ListType) {
    try {
      const webMethod = this.interfaceURL + 'SaveProductToFolder';
      const parameters = {
        FolderName,
        NoteMasterID,
        CustomerID,
        EntityID,
        User,
        ListType,
      };
      const result = this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
      return result;
    } catch (exception) {
      return null;
      // console.log(exception);
    }
  }

  GetDashboardLayout(action, login, layout) {
    try {
      const webMethod = this.interfaceURL + 'GetDashboardLayout';
      const parameters = {
        action,
        login,
        layout,
      };
      const that = this;

      this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
        // console.log(res);
        that.getLayout.next(res);
      });
    } catch (exception) {
      // console.log(exception);
    }
  }

  GetMenu(action, login, menu) {
    try {
      const webMethod = this.interfaceURL + 'GetMenu';
      const parameters = {
        action,
        login,
        menu,
      };
      const that = this;

      this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
        // console.log(res);
        // that.getMenu.next(res);
        that.getMenu.next(res[0].Message);
      });
    } catch (exception) {
      // console.log(exception);
    }
  }

  ProductAttachmentList(NoteMasterID: any) {
    const webMethod = this.interfaceURL + 'ProductAttachmentList';

    const parameters = {
      NoteMasterID,
      // index
    };
    const that = this;
    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      // console.log(res);
      // res.push({'index' : index});
      that.getFactsheetData.next(res);
    });
  }
  ProductAttachmentListWTO(NoteMasterID: any) {
    const webMethod = this.interfaceURL + 'ProductAttachmentList';

    const parameters = {
      NoteMasterID,
      // index
    };
    return this.http.post<any>(webMethod + '', parameters);
    // this.http.post<any>(webMethod + '', parameters).subscribe(res => {
    //   // console.log(res);
    //   // res.push({'index' : index});
    //   that.getFactsheetData.next(res);
    // });
  }

  AmendBondOrder(
    username: any,
    clorId: any,
    nominal: any,
    OrderType: any,
    ClientPrice: any,
    TimeInForce: any,
    expiryDate: any,
    spread: any,
    SpreadOutOfRange: any,
    PrimaryBondOrderYN: any,
    BankPnL: any,
    Remark: any,
    CIF: any,
    portfolio: any,
    account: any
  ) {
    const webMethod = this.interfaceURL + 'AmendBondOrder';
    console.log(username);
    const parameters = {
      LoginID: sessionStorage.getItem('Username'),
      ClOrdID: clorId,
      Nominal: nominal,
      OrderType,
      CustomerLimitPrice: ClientPrice,
      TimeInForce, // 9/11/2020 12:00:00 AM,
      ExpireDate: expiryDate, // 9/11/2020 12:00:00 AM,
      OrderSpread: spread, // 30,
      SpreadOutOfRange, // Y,
      PrimaryBondOrderYN, // N,
      BankPnL, // 100,
      Remark, // ,
      CIF, // ,
      Portfolio: portfolio, // ,
      CashSettlAccNo: account, // ,
      OrderAmendRemark: Remark, //
    };
    const that = this;
    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      // console.log(res);
      // res.push({'index' : index});
      that.bondsAmend.next(res);
    });
  }

  CancelBondOrder(username, clordID, remark) {
    const webMethod = this.interfaceURL + 'CancelBondOrder';

    const parameters = {
      LoginID: username,
      ClOrdID: clordID,
      Remark: remark,
    };
    const that = this;
    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      // console.log(res);
      // res.push({'index' : index});
      that.bondsCancel.next(res);
    });
  }

  AmendShareOrder(
    OrderID,
    OrderQty,
    Price,
    UserGroup,
    RMID,
    Remarks,
    TAPPortfolioID,
    loginID
  ) {
    const webMethod = this.interfaceURL + 'FinIQ_Equities_Amend_Order';

    const parameters = {
      OrderID,
      OrderQty,
      Price,
      UserGroup,
      RMID,
      Remarks,
      TAPPortfolioID,
      loginID,
    };

    const that = this;
    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      // console.log(res);
      // res.push({'index' : index});
      that.shareAmend.next(res);
    });
  }

  CancelShareOrder(requestAt, ClOrdID, Remark, RequestType, loginID) {
    const webMethod = this.interfaceURL + 'FinIQ_Equities_Cancel_Order';

    const parameters = {
      requestAt,
      ClOrdID,
      Remark,
      RequestType,
      loginID: loginID,
    };
    const that = this;
    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      // console.log(res);
      // res.push({'index' : index});
      that.shareCancel.next(res);
    });
  }

  InsertRMGroupMapping(login, entityID) {
    try {
      const webMethod = this.interfaceURL + 'InsertRMGroupMapping';
      let result: any;

      const parameters = {
        login,
        entityID,
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        success(data) {
          result = data;
        },
        error() {
          result = '';
        },
      });
      return result;
    } catch (error) {}
  }

  // onCustomerChange(portfolio: string) {
  //   this.invokePortfoliodetails.emit(portfolio);
  // }

  setCustomer(username) {
    // this.custList = this.CustomerList(sessionStorage.getItem('Username')); // refresh change
    this.custID = this.custList.filter(
      (cust) => cust.CustomerName === username
    )[0].CustomerID;
    console.log('username and id', username, this.custID);
    this.changeCustomer(this.custID);
  }

  changeCustomer(customerID) {
    this.customerChangeBS.next(customerID);
  }
  GetCustomerGroupData(CustomerID) {
    const webMethod = this.interfaceURL + 'GetCustomerGroupData';
    const params = {
      CustomerID,
    };
    return this.http.post<any>(webMethod, params);
    // return this.http.post<any>(webMethod, params, { responseType: 'text' as 'json' });
  }
  async GetCustomerGroupDataAsync(CustomerID) {
    const webMethod = this.interfaceURL + 'GetCustomerGroupData';
    const params = {
      CustomerID,
    };
    const GroupID = this.http
      .post<any>(webMethod, params)
      .toPromise()
      .then((res) => {
        return res.ArrayOfCustomerGroupData.CustomerGroupData[0].Group_ID[0];
      });
    return GroupID;
    // return this.http.post<any>(webMethod, params, { responseType: 'text' as 'json' });
  }

  GetLimitUtilizationData(CustomerGroupID, CustomerName, CustID, baseCCY) {
    const webMethod = this.interfaceURL + 'GetLimitUtilizationData';
    const params = {
      Customer_Grp_ID: CustomerGroupID,
      UserId: CustomerName,
      CustID,
      baseCCY,
      Portfolio: '',
    };
    return this.http.post<any>(webMethod, params);
  }

  GetLoanableAmountData(CustomerGroupID, CustomerName, CustID, baseCCY) {
    const webMethod = this.interfaceURL + 'GetLoanableAmountData';
    const params = {
      Customer_Grp_ID: CustomerGroupID,
      UserId: CustomerName,
      CustID,
      baseCCY,
    };
    return this.http.post<any>(webMethod, params);
  }

  GetCollateralChartData(CustomerGroupID, CustomerName, CustID, baseCCY) {
    const webMethod = this.interfaceURL + 'GetCollateralChartData';
    const params = {
      Customer_Grp_ID: CustomerGroupID,
      UserId: CustomerName,
      CustID,
      baseCCY,
    };
    return this.http.post<any>(webMethod, params);
  }
  GetExposureChartData(CustomerGroupID, CustomerName, CustID, baseCCY) {
    const webMethod = this.interfaceURL + 'GetExposureChartData';
    const params = {
      Customer_Grp_ID: CustomerGroupID,
      UserId: CustomerName,
      CustID,
      baseCCY,
    };
    return this.http.post<any>(webMethod, params);
  }
  GetMarginRatio(CustomerGroupID, CustomerName, CustID, baseCCY) {
    const webMethod = this.interfaceURL + 'GetMarginRatio';
    const params = {
      Customer_Grp_ID: CustomerGroupID,
      UserId: CustomerName,
      CustID,
      baseCCY,
    };
    return this.http.post<any>(webMethod, params);
  }
  GetCustomerAccount(CustID) {
    const webMethod = this.interfaceURL + 'GetCustomerAccount';
    const params = {
      I_CustomerID: CustID,
    };
    return this.http.post<any>(webMethod, params);
  }

  GetAssets(CustomerName: any, CustID: any, AccountNumbers: any) {
    const webMethod = this.interfaceURL + 'GetAssets';
    const params = {
      custcif: CustID,
      custname: CustomerName,
      AccountNumbers,
    };
    return this.http.post<any>(webMethod, params);
  }

  GetCollateralReportData(username: any, custid: any, baseCCY: any) {
    const webMethod = this.interfaceURL + 'GetCollateralReportData_LCYE';
    const params = {
      username,
      custid,
      baseCCY,
      portfolio: '',
    };
    return this.http.post<any>(webMethod, params);
  }

  RevaluateMargin(
    EntityID: any,
    CustomerGroupId: any,
    UserName: any,
    IncludeDraftDeal: any
  ) {
    const body = {
      CustomerGroup: '',
      CustomerGroupId,
      RevalulationOutput: '',
      EntityID,
      Note_Master_Id: '',
      UserName,
      CallingParm:
        CustomerGroupId +
        ':' +
        CustomerGroupId +
        ':' +
        IncludeDraftDeal +
        ':::::', // String is given by Amol Mahale Sir on 08-Mar-2021
    };
    return this.http.post<any>(
      this.interfaceURL + 'CollateralCalculationMargin',
      body
    );
  }
  GetLimitData(CustomerId: any, baseCCY: string, portfolio) {
    const webMethod = this.interfaceURL + 'GetLimitDetails';
    const params = {
      CustomerId,
      baseCCY,
      portfolio,
    };
    return this.http.post<any>(webMethod, params);
  }

  loadCurrency() {
    const webMethod = this.interfaceURL + 'GetCCY';
    return this.http.get<any>(webMethod);
  }

  GetBondsRecommendation(NMID: any, loginID: any) {
    const webMethod = this.interfaceURL + 'GetBondsRecommendation';
    const params = { NMID, loginID };
    return this.http.post<any>(webMethod, params);
  }

  async SearchEquities(ProductName: any) {
    try {
      const webMethod = this.interfaceURL + 'getsharelist';
      const parameters = {
        ProductName,
      };
      return this.http
        .post<any>(webMethod, parameters, { headers: this.headerOptions })
        .toPromise();
    } catch (error) {
      // console.error(error);
    }
  }

  GetClientSummary(entityID, loginID, baseCCY) {
    const webMethod = this.interfaceURL + 'clientSummary_LCYE';
    const params = { entityID, loginID, baseCCY };
    return this.http.post<any>(webMethod, params);
  }
  async GetClientSummaryAsync(entityID, loginID, baseCCY) {
    const webMethod = this.interfaceURL + 'clientSummary_LCYE';
    const params = { entityID, loginID, baseCCY };
    const clientSummary = await this.http
      .post<any>(webMethod, params)
      .toPromise()
      .then((res) => JSON.parse(res.GetRMPortalClientSummary_LCYEResult));
    return clientSummary;
  }

   getBlotterCode(login) {
    try {
      // var body = {
      //   BCMLevelSpec: 'Primary',
      //   User_ID: login, //"Nikhilkumar"
      // };

      // return this.http.post<any>(this.interfaceURL + 'getBlottercode', body);
      const webMethod = AppConfig.settings.apiBaseUrl  + 'mpg/getBlottercode';
      const parameters = {
        BCMLevelSpec: 'Primary',
        UserID: login,
      };
      // return this.http.post<any>(webMethod, parameters);
      return this.http.post<any>(webMethod,parameters)

    } catch (error) {
      console.log(error);
    }
  }

  fillGridAllTemplateUsingSPGen(
    selectedMPGitem: any,
    RowsPerPage: any,
    PageNo: any,
    date1: any,
    login: any,
    entity: any
  ) {
    try {
      // console.log(this.Login_Id);
      console.log('fillGridAllTemplateUsingSPGen');
      // const body = {
      //   entityId: entity,
      //   UserId: login, // "Nikhilkumar",
      //   BlotterCode: selectedMPGitem.BCM_ID, //"10097",  10074
      //   from: date1, //"16-Feb-2021",
      //   to: date1, //"16-Feb-2021",
      //   DealFacing: 'ALL',
      //   WhereClause: '',
      //   RowsPerPage: RowsPerPage, //"15",
      //   PageNo: PageNo, //"1",
      //   ExcelFlag: '0',
      // };
      const webMethod = AppConfig.settings.apiBaseUrl  + 'mpg/fillGridAllTemplateUsingSPGen';
      const parameters = {
        entityId: AppConfig.settings.oRes.homeEntityID,//"3",
        UserId: AppConfig.settings.oRes.userName, //"HSDealer1",
        // BlotterCode: selectedMPGitem.BCM_ID,
        BlotterCode : selectedMPGitem.BCM_ID.toString(),
        from: date1, //"16-Feb-2021",
        to: date1, //"16-Feb-2021",
        DealFacing: 'ALL',
        WhereClause: '',
        RowsPerPage: RowsPerPage.toString(), //"15",
        PageNo: PageNo.toString(), //"1",
        ExcelFlag: '0',
      };
      
      return this.http.post<any>(webMethod,parameters);
    } catch (error) {
      console.log(error);
    }
  }

  fillGridMetaData(selectedMPGitem: any) {
    try {
      //console.log(this.Login_Id);
      // const body = {
      //   Blottercode: selectedMPGitem.BCM_ID,
      // };

      // return this.http.post<any>(this.interfaceURL + 'fillGridMetaData', body);
    const webMethod = AppConfig.settings.apiBaseUrl + 'mpg/fillGridMetaData';

    const parameters = {
      Blottercode : selectedMPGitem.BCM_ID.toString()
    };
    return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log(error);
    }
  }

  setSelectedMPG(mpgItem: any) {
    try {
      // console.log(mpgItem);
      this.selectedMPG.next(mpgItem);
    } catch (error) {
      console.log(error);
    }
  }

  setBlotterData(setBlotterData: any) {
    try {
      // console.log(mpgItem);
      this.BlotterDataRows.next(setBlotterData);
    } catch (error) {
      console.log(error);
    }
  }

  getDataForExportToExcel(blotterData: any) {
    const exportExcelDataArray = [];
    try {
      if (blotterData && blotterData.length) {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < blotterData.length; i++) {
          // for (let i = 0; i < 1; i++) {
          const exportExcelData1 = blotterData[i];
          const exportExcelData: [][] = blotterData[i];
          for (const obj of Object.entries(exportExcelData)) {
            // console.log(obj[0]);
            // console.log( obj[1].toString);
            // console.log( obj[1].map(x=>x).join(''));
            // if(obj[0] === 'Note_x0020_Deal_x0020_ID'){
            // exportExcelData1[obj[0]] = obj[1][0]; //[0];
            exportExcelData1[obj[0]] = obj[1].map((x) => x).join(''); //[0];
            // console.log(exportExcelData);
            // }
          }
          exportExcelDataArray.push(exportExcelData1);
        }
        // console.log(exportExcelDataArray[0]);
      }

      return exportExcelDataArray;
    } catch (error) {
      console.log('Error:', error);
    }
    return exportExcelDataArray;
  }
  getAllDataForExportToExcel( selectedMPGitem: any,
    RowsPerPage: any,
    PageNo: any,
    date1: any,
    login: any,
    entity: any) {
    try {
      const body = {
        entityId: entity,
        UserId: login, // "Nikhilkumar",
        BlotterCode: selectedMPGitem.BCM_ID, //"10097",  10074
        from: date1, //"16-Feb-2021",
        to: date1, //"16-Feb-2021",
        DealFacing: 'ALL',
        WhereClause: '',
        RowsPerPage: RowsPerPage, //"15",
        PageNo: PageNo, //"1",
        ExcelFlag: '0',
      };
      return this.http.post<any>(
        this.interfaceURL + 'mpg/fillGridAllTemplateUsingSPGen',
        body
      );
    } catch (error) {
      console.log('Error:', error);
    }
  }
  setBlotterDataColumnHeader(BlotterDataColumnHeader: any) {
    try {
      console.log("Jyoti setBlotterDataColumnHeader",BlotterDataColumnHeader);
      this.BlotterDataColumnHeader.next(BlotterDataColumnHeader);
    } catch (error) {
      console.log(error);
    }
  }

  mapHeader(str: any) {
    try {
      if (this.metaDataResult && this.metaDataResult.length > 0) {
        var index = this.metaDataResult.findIndex(
          (item) =>
            this.replaceChar(item.Blotter_Column) == this.replaceChar(str)
        );
        if (index === -1) {
          return this.replaceChar(str);
        } else {
          return this.metaDataResult[index].Header;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  replaceChar(str: any) {
    try {
      str =  str.toString().replace(/_x0020_/g, ' ');
      return str.toString().replace(/_x0023_/g, '#');
    } catch (error) {
      console.log(error);
    }
  }

  likeProduct(NoteMasterId: any, LoginID: any) {
    try {
      //console.log(this.Login_Id);
      const body = {
        NoteMasterId,
        LoginID,
      };

      return this.http.post<any>(this.interfaceURL + 'LikeProduct', body);
    } catch (error) {
      console.log(error);
    }
  }

  unlikeProduct(NoteMasterId: any, LoginID: any) {
    try {
      //console.log(this.Login_Id);
      const body = {
        NoteMasterId,
        LoginID,
      };

      return this.http.post<any>(this.interfaceURL + 'UnLikeProduct', body);
    } catch (error) {
      console.log(error);
    }
  }

  Get_UserType(LoginID: any) {
    try {
      const body = {
        LoginID,
      };

      return this.http.post<any>(this.interfaceURL + 'Get_UserType', body);
    } catch (error) {
      console.log(error);
    }
  }

  Get_Dashboard_Master(UserType: any, EntityID: any) {
    try {
      const body = {
        UserType,
        EntityID,
      };

      return this.http.post<any>(
        this.interfaceURL + 'Get_Dashboard_Master',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  GetDashboardScenarioHeader(
    Username: any,
    UserType: any,
    entityId: any,
    layoutID: any
  ) {
    try {
      const body = {
        Username,
        UserType,
        entityId,
        layoutID,
      };

      return this.http.post<any>(
        this.interfaceURL + 'Get_Dashboard_ScenarioHeader',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  CallStoreProcMaster(
    ScenarioNo,
    UserType,
    entityId,
    DayRange,
    StoreProcName,
    loginID,
    Product,
    ProductId,
    Mode,
    DateP,
    fromDate,
    toDate,
    Month,
    Year
  ) {
    try {
      const body = {
        ScenarioNo,
        UserType,
        entityId,
        DayRange,
        StoreProcName,
        loginID,
        Product,
        ProductId,
        Mode,
        DateP,
        fromDate,
        toDate,
        Month,
        Year,
      };

      return this.http.post<any>(
        this.interfaceURL + 'CallStoreProcMaster',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  Get_Dashboard_Detail(Username: any, UserType: any, entityId: any) {
    try {
      const body = {
        Username,
        UserType,
        entityId,
      };

      return this.http.post<any>(
        this.interfaceURL + 'Get_Dashboard_Detail',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  Insert_Dashboard_Data(
    SequenceNo,
    EntityID,
    ScenarioID,
    UserName,
    UserType,
    FromDate,
    ToDate,
    DayRange,
    SelectedDate,
    SelectedYear,
    SelectedMonth,
    LayoutID
  ) {
    try {
      const body = {
        SequenceNo,
        EntityID,
        ScenarioID,
        UserName,
        UserType,
        FromDate,
        ToDate,
        DayRange,
        SelectedDate,
        SelectedYear,
        SelectedMonth,
        LayoutID,
      };

      return this.http.post<any>(
        this.interfaceURL + 'Insert_Dashboard_Data',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  Delete_Dashboard_Data(
    EntityID: any,
    UserName: any,
    UserType: any,
    LayoutID: any
  ) {
    try {
      const body = {
        EntityID,
        UserName,
        UserType,
        LayoutID,
      };

      return this.http.post<any>(
        this.interfaceURL + 'Delete_Dashboard_Data',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  GetPriceHistoryData(LoginID: any, NoteMasterId: any, period: any) {
    try {
      const body = {
        LoginID,
        NoteMasterId,
        period,
      };

      return this.http.post<any>(
        this.interfaceURL + 'GetPriceHistoryData',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  Get_Rule_Schedule_Details(Note_Master_Id: any) {
    try {
      const body = {
        Note_Master_Id,
      };

      return this.http.post<any>(
        this.interfaceURL + 'Get_Rule_Schedule_Details',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  GetMaturityDateForTenor(
    StartDate: any,
    SoftTenorCode: any,
    HolidayCurrencyCsv: any
  ) {
    try {
      const body = {
        StartDate,
        SoftTenorCode,
        HolidayCurrencyCsv,
      };

      return this.http.post<any>(
        this.interfaceURL + 'GetMaturityDateForTenor',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  Get_Template_Data(template_Id: any, TemplateName: any, Note_master_ID: any) {
    try {
      const body = {
        template_Id,
        TemplateName,
        Note_master_ID,
      };

      return this.http.post<any>(this.interfaceURL + 'Get_Template_Data', body);
    } catch (error) {
      console.log(error);
    }
  }

  Get_Bond_Browser_Data(EntityId: any, NotemasterId: any) {
    try {
      const body = {
        EntityId,
        NotemasterId,
      };

      return this.http.post<any>(
        this.interfaceURL + 'Get_Bond_Browser_Data',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }
  //Changed by MohanP | 02Feb22
  generateDoc(
    EntityID,
    EntityCode,
    EntityName,
    user,
    transactionNumber,
    transactionType,
    transactionEventCode
  ) {
    try {
      const body = {
        EntityID,
        EntityCode,
        EntityName,
        user,
        transactionNumber,
        transactionType,
        transactionEventCode,
      };

      return this.http.post<any>(this.interfaceURL + 'GenerateDocument', body);
    } catch (error) {
      console.log(error);
    }
  }

  GetPortfoliosFromCusID(CustId, Currency) {
    try {
      const body = {
        CustId,
        Currency,
      };

      return this.http.post<any>(
        this.interfaceURL + 'GetPortfoliosFromCusID',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  getAccountNumberFromPortfolioGeneric(CustomerId, Portfolio, Ccy) {
    try {
      const body = {
        CustomerId,
        Portfolio,
        Ccy,
      };

      return this.http.post<any>(
        this.interfaceURL + 'getAccountNumberFromPortfolioGeneric',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  getCashbalanceFromAccountNumber(ccy, accountNo) {
    try {
      const body = {
        ccy,
        accountNo,
      };

      return this.http.post<any>(
        this.interfaceURL + 'getCashbalanceFromAccountNumber',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  Fill_FundRatiosUpload_Details_REST(ISIN) {
    try {
      const body = {
        ISIN,
      };

      return this.http.post<any>(
        this.interfaceURL + 'Fill_FundRatiosUpload_Details_REST',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }

  Fill_FundPerformanceUpload_Details_REST(ISIN) {
    try {
      const body = {
        ISIN,
      };

      return this.http.post<any>(
        this.interfaceURL + 'Fill_FundPerformanceUpload_Details_REST',
        body
      );
    } catch (error) {
      console.log(error);
    }
  }
  getMFListForSIP(baseCCY) {
    try {
      const body = {
        baseCCY,
      };
      return this.http.post<any>(this.interfaceURL + 'getMFListForSIP', body);
    } catch (error) {
      console.log(error);
    }
  }
  getDefaultValuesForSIP(template) {
    const body = {
      template,
    };
    return this.http.post<any>(
      this.interfaceURL + 'getDefaultValuesForSIP',
      body
    );
  }

  getVAT(custID) {
    const body = {
      custID,
    };

    return this.http.post<any>(this.interfaceURL + 'getVat', body);
  }

  FillProductDetailsSP(NoteMasterId, TemplateCode) {
    const body = {
      NoteMasterId,
      TemplateCode,
    };
    return this.http.post<any>(
      this.interfaceURL + 'FillProductDetailsSP',
      body
    );
  }

  SNSaveOrder(
    Order_Type,
    OrderMode,
    Client_Price,
    CustomerID,
    Customer_Name,
    Nominal_Amount,
    NoteMasterId,
    Trade_Date,
    LoginId,
    AccountNo,
    SETTLECCY,
    Portfolio,
    SalesChargePCT,
    AccountType,
    FreezeAmount,
    SalesCharge,
    SettlementAmount,
    Units,
    VATAmount,
    ClientContribution
  ) {
    const body = {
      Order_Type,
      OrderMode,
      Client_Price,
      CustomerID,
      Customer_Name,
      Nominal_Amount,
      NoteMasterId,
      Trade_Date,
      LoginId,
      AccountNo,
      SETTLECCY,
      Portfolio,
      SalesChargePCT,
      AccountType,
      FreezeAmount,
      SalesCharge,
      SettlementAmount,
      Units,
      VATAmount,
      ClientContribution,
    };
    return this.http.post<any>(this.interfaceURL + 'SNSaveOrder', body);
  }

  //SIP
  Get_CommaSeperatedCcy(LocalCcy, Ccy) {
    const body = {
      LocalCcy,
      Ccy,
    };
    return this.http.post<any>(
      this.interfaceURL + 'Get_CommaSeperatedCcy',
      body
    );
  }

  Get_Dummy_Tenor_From_Fixings_SIP(Frequency, NoOfFixings) {
    const body = {
      Frequency,
      NoOfFixings,
    };
    return this.http.post<any>(
      this.interfaceURL + 'Get_Dummy_Tenor_From_Fixings_SIP',
      body
    );
  }

  GetMaturityDateUsingBusinessDays(
    StartDate,
    SoftTenorCode,
    HolidayCurrencyCsv
  ) {
    const body = {
      StartDate,
      SoftTenorCode,
      HolidayCurrencyCsv,
    };
    return this.http.post<any>(
      this.interfaceURL + 'GetMaturityDateUsingBusinessDays',
      body
    );
  }

  GetMaturityDateForTenorSIP(StartDate, SoftTenorCode, HolidayCurrencyCsv) {
    const body = {
      StartDate,
      SoftTenorCode,
      HolidayCurrencyCsv,
    };
    return this.http.post<any>(
      this.interfaceURL + 'GetMaturityDateForTenorSIP',
      body
    );
  }

  async GetSpreadMessage(
    Currency,
    Quantity,
    InputSpread,
    SpreadAmount,
    ClientGroup,
    CustomerCode,
    Mode
  ) {
    const body = {
      Currency,
      Quantity,
      InputSpread,
      SpreadAmount,
      ClientGroup,
      CustomerCode,
      Mode,
      Product: 'SIP',
    };
    const spreadMessage = await this.http
      .post<any>(this.interfaceURL + 'GetSpreadMessage', body)
      .toPromise()
      .then((res) => res);
    return spreadMessage;
  }
  // MF Drawdown --Added by AlolikaG on 2nd Feb 2022. Assigned by Parikshit K.
  getMFDrawdown(Customer_ID, CurrentOrderQty, CurrentPrice, LTV, Mode) {
    try {
      const body = {
        Customer_ID,
        CurrentOrderQty,
        CurrentPrice,
        LTV,
        Mode,
      };
      return this.http.post<any>(this.interfaceURL + 'getMFDrawdown', body);
    } catch (error) {
      console.log('Error in getMFDrawdown', error);
    }
  }
  //Check Sutability --Added by Rohit T. 04-Feb-2021. Assigned by Parikshit K.
  getSuitabilityDetails(NoteMasterId, LoginId, EntityId) {
    try {
      const body = {
        NoteMasterId,
        LoginId,
        EntityId,
      };
      return this.http.post<any>(
        this.interfaceURL + 'getSuitabilityDetails',
        body
      );
    } catch (error) {
      console.log('Error in getSuitabilityDetails', error);
    }
  }
  //Check Sutability --Added by Rohit T. 04-Feb-2021. Assigned by Parikshit K. --End

  // Check Suitability Added by Alolika G. on 07-Feb-2021. Assigned by Parikshit K. --START
  async checkSuitability(order) {
    order.commissionValue = '0';
    order.commissionPercentage = '5';
    const webMethod = this.interfaceURL + 'checkSuitability';
    const params = {
      entityId: this.authApi.EntityID,
      username: this.authApi.UserName,
      custId: order.custID,
      crr: order.CRR,
      entityCode: this.authApi.EntityCode,
      commissionamt: order.commissionValue,
      commissionperct: order.commissionPercentage,
      commissionreason: order.commissionReason,
      currency: order.currency,
      custName: order.custName,
      orderType: order.orderType,
      direction: order.direction,
      notional: order.settlementAmount,
      productCode: order.productCode,
      fundingMode: order.fundingMode,
      productref: order.productref,
    };
    const response = await this.http
      .post<any>(webMethod, params)
      .toPromise()
      .then((res) => res.Get_SuitabilityAPIResult[0])
      .catch((err) => err);
    return response;
  }

  async getSuitabilityToken(order) {
    const webMethod = this.interfaceURL + 'getSuitabilityToken';
    const params = {
      entityId: this.authApi.EntityID,
      username: this.authApi.UserName,
      custId: order.custID,
      currency: order.currency,
      custName: order.custName,
      noteMasterId: order.NoteMasterId,
      notional: order.settlementAmount,
      portfolio: order.portfolio,
      orderID: order.orderID,
      suitabiltyToken: order.failrules,
    };
    const response = await this.http
      .post<any>(webMethod, params)
      .toPromise()
      .then((res) => res)
      .catch((err) => err);
    return response;
  }

  // Check Suitability Added by Alolika G. on 07-Feb-2021. Assigned by Parikshit K. --END

  //Added by Alolika G to get Business Date | 09-03-2022 --START
  async getBusinessDate() {
    const webMethod = this.interfaceURL + 'getBusinessDate';
    const response = await this.http
      .get(webMethod + '/' + this.authApi.EntityID)
      .toPromise()
      .then((res) => res)
      .catch((err) => err);
    return response;
  }
  //Added by Alolika G to get Business Date | 09-03-2022 --END

  async getbondCalculations_bulk(
    LoginID,
    NoteMasterId,
    Notional,
    Side,
    SettlementDate,
    Spread,
    OrderType,
    EntityCode,
    ClientLimitPrice,
    ISIN
  ) {
    try {
      console.log('Bond Cal.');
      const webMethod = this.interfaceURL + 'getbondcalculations';
      const parameters = {
        EntityCode,
        LoginID,
        NoteMasterId,
        Notional,
        Side,
        SettlementDate,
        Spread,
        OrderType,
        ClientLimitPrice,
        ISIN,
      };
      const result = await this.http
        .post<any>(webMethod, parameters)
        .toPromise()
        .then((res) => res.BondCalcResponse)
        .catch((err) => err);
      return result;
      // result.subscribe((res) => {
      //   if (res) {
      //     this.bondCalculations.next(res.BondCalcResponse);
      //   }
      // });
    } catch (error) {
      // console.error(error);
    }
  }

  async getbondsubscribe_bulk(
    ISIN,
    Currency,
    Side,
    Notional,
    SettDate,
    Spread,
    AccInt,
    SettAmt,
    TradeDate,
    SettType,
    ExpDate,
    _PriceType,
    Price,
    DirtyPrice,
    CleanPrice,
    YTM,
    Proceeds,
    PNL,
    Portfolio,
    TimeInForce,
    OrderType,
    NoteMasterID,
    CustDirtyPrice,
    CustCleanPrice,
    MarketCleanPrice,
    MarketDirtyPrice,
    YTC,
    YTP,
    YTConv,
    UserID,
    CustomerName,
    AccNo,
    EntityCode,
    QuantityType,
    RMName
  ) {
    try {
      const webMethod = this.interfaceURL + 'subscribebond';
      const parameters = {
        ISIN,
        Currency,
        Side,
        Qty: Notional,
        SettDate,
        OrderType,
        Spread,
        AccInt,
        SettAmt,
        TradeDate,
        SettType,
        ExpDate,
        IssueSize: '1',
        PriceType: 1,
        Price,
        DirtyPrice,
        CleanPrice,
        YTM,
        Nominal: Notional,
        Proceeds,
        PNL,
        Portfolio,
        TimeInForce,
        NoteMasterID,
        CustDirtyPrice,
        CustCleanPrice,
        MarketCleanPrice,
        MarketDirtyPrice,
        YTC,
        YTP,
        YTConv,
        UserID,
        CustomerName,
        AccNo,
        EntityCode,
        QuantityType,
        RMName,
      };
      const result = await this.http
        .post<any>(webMethod, parameters)
        .toPromise()
        .then((res) => res.Order_Save_Res_DTO.objResponseDetails)
        .catch((err) => err);
      return result;
    } catch (error) {
      // console.error(error);
    }
  }

  //Added by Alolika G | 05-05-2022 bulk order placement in Rebalance
  async getCustPortfolioSecurityHoldings_bulk(
    CustomerId: string,
    Portfolio: string,
    baseCCY: string
  ) {
    try {
      const webMethod =
        this.interfaceURL + 'GetCustPortfolioSecurityHoldings_LCYE';
      const parameters = {
        CustomerId,
        Portfolio,
        baseCCY,
      };

      const result = await this.http
        .post<any>(webMethod, parameters, { responseType: 'json' })
        .toPromise()
        .then((res) =>
          res.CustPortfolioSecurityHoldingsResponse
            .CustPortfolioSecurityHoldings
            ? res.CustPortfolioSecurityHoldingsResponse
                .CustPortfolioSecurityHoldings[0]
                .DCCustPortfolioSecurityHoldings
            : []
        )
        .catch((err) => err);
      return result;
    } catch (error) {
      // console.error(error);
    }
  }

  //Added by Urmila A | 28-06-2022 | Workflow Journey graph
  GetWorkflowTitle(WTM_ID: any) {
    try {
      const webMethod = this.interfaceURL + 'GetWorkflowTitle';
      const parameters = { WTM_ID };
      return this.http.post<any>(webMethod, parameters, { });
    } catch (error) {
      // console.log(exception);
    }
  }


  GetWorkflowNodes(WorkFlowTypeId: any[],getAllNodes: boolean) {
    try {
      const webMethod = this.interfaceURL + 'GetWorkflowNodes';
      const parameters = {WorkFlowTypeId, getAllNodes };
      return this.http.post<any>(webMethod, parameters, { });
    } catch (error) {
      // console.log(exception);
    }
  }

  GetWorkflowLinks(WorkFlowTypeId: any[], getAllNodes: boolean) {
    try {
      const webMethod = this.interfaceURL + 'GetWorkflowLinks';
      const parameters = {WorkFlowTypeId, getAllNodes };
      return this.http.post<any>(webMethod, parameters, { });
    } catch (error) {
      // console.log(exception);
    }
  }

  GetWorkflowNodes_QMovement(TokenId: any[], getAllNodes: boolean) {
    try {
      const webMethod = this.interfaceURL + 'GetWorkflowNodes_QMovement';
      const parameters = {TokenId, getAllNodes };
      return this.http.post<any>(webMethod, parameters, { });
    } catch (error) {
      // console.log(exception);
    }
  }

  GetHolidayCalender_Records(Exchange: any, Type: any, FromDate: any, ToDate: any) {
    try {
      const webMethod = this.interfaceURL + 'GetHolidayCalender_Records';
      const parameters = {Exchange, Type, FromDate, ToDate };
      return this.http.post<any>(webMethod, parameters, { });
    } catch (error) {
      // console.log(exception);
    }
  }

  // Added by Mitali D - 10-05-2023 - for MPG - START
  filterActive = []
  filterTable = []

  // Added by Mitali D - 10-05-2023 - for MPG - END
}
