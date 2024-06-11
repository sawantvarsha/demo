import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { formatDate } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class HomeApiService {
  // 'Balance'
  // 'Limits and Collateral'
  // 'Latest Transaction'
  // 'Cash Balance'
  // 'Performance'
  // 'Portfolio Allocation'
  // 'Market Watch'
  // 'Top Performing Assets'
  // 'My Profile'
  // 'Insurance'
  // 'News'
  interfaceURL = environment.interfaceURL;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  riskProfileArray: any = [
    { product: 'ALL', value: false },
    { product: 'Bonds', value: false },
    { product: 'Fund_Setup', value: false },
    { product: 'Product_Maintenance', value: false },
    { product: 'NiftyParticipation', value: false },
  ];

  Portfolio: any = 0;
  CustomerId: any;
  CustomerName: any;
  CustomerDisplayName: any;
  ContactNo: any;
  CustEmail: any;
  RiskProfile: any;
  CRR: any;
  Currency: any;
  AUM: any;
  PNL: any;
  BestPortfolio: any[];
  NoteMasterID: any;
  TokenID: any;
  RiskRating: any;
  LastUpdatedOn: any;
  KYCUpdatedOn: any;
  freecash: any = 0;
  public layout = new BehaviorSubject<any>([]);
  layoutObs = this.layout.asObservable();
  // public freecash = new BehaviorSubject<any>('');
  // freecashObs = this.freecash.asObservable();
  CIF: any;
  AccountType: any;
  AccountNumber: any;
  Profiles: {
    Portfolio: any;
    AccountNumber: any;
    AccountType: any;
    Currency: any;
    PortfolioDetails: any[];
  };
  marketWatchBS = new BehaviorSubject([]);
  marketWatchObs = this.marketWatchBS.asObservable();
  RediretToHomeBuySellPledge: any;
  SelectedFacilityCode: any;
  Selectedportfolio: any; //Changes done by Alolika G on 10-02-2022
  selectedPage: any;
  openPopup: boolean;
  RMWlink: string;
  baseCCY: any;
  RMID: any;
  RMName: any;
  CustomerMappedToRM: any[];
  FinIQGroupID: string;
  previousIndex: any;
  showFactsheet: any[] = [];
  constructor(public http: HttpClient, public authApi: AuthService) {
    this.BestPortfolio = [];
    this.Profiles = {
      Portfolio: '',
      AccountNumber: '',
      AccountType: '',
      Currency: '',
      PortfolioDetails: [],
    };
    this.NoteMasterID = '';
    this.RediretToHomeBuySellPledge = '';
    this.RMWlink = '';
    this.FinIQGroupID = '';
    this.CustomerMappedToRM = [];
    this.previousIndex = '';
    this.showFactsheet = [];
    // this.riskProfileArray = [{ product: 'ALL', value: true }, { product: 'Bonds', value: true }, { product: 'Fund_Setup', value: true }, { product: 'Product_Maintenance', value: true }];
  }

  getLiveNews(LoginID) {
    try {
      const webMethod = this.interfaceURL + 'getlivenews';
      const parameters = {
        LoginID,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      // console.error(error);
      return null;
    }
  }

  getNewsImage(newsID) {
    try {
      const webMethod = this.interfaceURL + 'GetNewsImage/' + newsID;

      return this.http.get<any>(webMethod, { headers: this.headerOptions });
    } catch (error) {
      //console.error(error);
      return null;
    }
  }

  getNewsImageContent() {
    let result = '';
    try {
      // // console.log('GetNewsImage');
      const webMethod = this.interfaceURL + 'GetNewsImage';
      return this.http.post<any>(
        webMethod,
        { headers: this.headerOptions },
        { responseType: 'text' as 'json' }
      );
    } catch (error) {
      // console.log('Error:', error);
    }
    return result;
  }

  GetDashboardLayout(action, login, layout) {
    try {
      const webMethod = this.interfaceURL + 'GetDashboardLayout';
      const parameters = {
        action,
        login,
        layout,
      };
      return this.http.post<any>(webMethod + '', parameters);
    } catch (exception) {
      //console.log(exception);
      return null;
    }
  }

  GetLatestTransaction(CustomerID, portfolio): any {
    try {
      const webMethod = this.interfaceURL + 'getlatesttrans';
      const parameters = {
        CustomerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      //console.error(error);
    }
  }

  GetMarketWatch(CustomerID, portfolio): any {
    try {
      const webMethod = this.interfaceURL + 'getMarketWatch';
      const parameters = {
        CustomerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  GetFreeCash(user, custID, portfolio, baseCCY): any {
    try {
      const webMethod = this.interfaceURL + 'getFreeCash_LYCE';
      const parameters = {
        user,
        custID,
        portfolio,
        baseCCY,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }

  GetAUMandPNL(
    CustomerID: string,
    userID: string,
    sCategory: string,
    baseCCY: string,
    portfolio: string
  ) {
    try {
      const webMethod =
        this.interfaceURL + 'GetClientwisePortfolioHoldings_LCYE';
      const parameters = {
        sCustomerId: CustomerID,
        sUserId: userID,
        Category: sCategory,
        baseCCY: baseCCY,
        Portfolio: portfolio,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      return null;
    }
  }

  GetCustPortfolioCashHoldings(custID: string, portfolio) {
    try {
      const webMethod = this.interfaceURL + 'getCustPortfolioCashHoldings';
      const parameters = {
        custID,
        portfolio,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      return null;
    }
  }

  GetCustPortfolioPerformance(CustomerID, baseCCY, portfolio): any {
    try {
      const webMethod = this.interfaceURL + 'getcustperformance_LCYE';
      const parameters = {
        CustomerID,
        baseCCY,
        portfolio,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      //console.error(error);
    }
  }

  GetCustPortPerformancePeriodic(CustomerID, Period, baseCCY, portfolio): any {
    try {
      const webMethod = this.interfaceURL + 'getcustperfperiodic_LCYE';
      const parameters = {
        CustomerID,
        Period,
        baseCCY,
        portfolio,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      //console.error(error);
    }
  }

  GetClientWisePnL(custID, baseCCY, portfolio) {
    const webMethod = this.interfaceURL + 'GetClientWisePnL_LCYE';
    const parameters = {
      custID,
      baseCCY,
      portfolio,
    };
    return this.http.post<any>(webMethod + '', parameters);
  }

  GetCustInsuranceDetails(custID, custName, EntityId, baseCCY, portfolio) {
    try {
      const webMethod = this.interfaceURL + 'Get_CustInsuranceDetails_LCYE';
      const parameters = {
        custID,
        custName,
        EntityId,
        baseCCY,
        portfolio,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      return null;
      //console.error(error);
    }
  }
  GetInsurancePremiumDetails(login, custID, baseCCY, portfolio) {
    try {
      const webMethod = this.interfaceURL + 'GetInsurancePremiumDetails_LCYE';
      const parameters = {
        login,
        custID,
        baseCCY,
        portfolio,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      return null;
      //console.error(error);
    }
  }

  // setfreecash(data) {
  //   this.freecash.next(data);
  // }
  async getCSPDashboardLayout(login) {
    try {
      const webMethod = this.interfaceURL + 'GetLayout';
      const parameters = {
        login,
      };
      const that = this;
      return this.http.post<any>(webMethod + '', parameters).toPromise()
      //   .subscribe((res) => {
      //   that.layout.next(res);
      // });
    } catch (error) {
      // console.error(error);
    }
  }
  getBaseCCYForLogin(login) {
    try {
      const webMethod = this.interfaceURL + 'GetBaseCCYofUser';
      const parameters = {
        login,
      };
      return this.http.post<any>(webMethod + '', parameters);
    } catch (error) {
      // console.error(error);
    }
  }
  getUserPreferences(login) {
    try {
      const webMethod = this.interfaceURL + 'GetLayout';
      const parameters = {
        login,
      };
      return this.http.post<any>(webMethod + '', parameters);
    } catch (error) { }
  }
  updateCSPDashboardLayout(login, tilename, VisibleYN, row, column) {
    try {
      const webMethod = this.interfaceURL + 'updateLayout';
      const parameters = {
        login,
        tilename,
        VisibleYN,
        row,
        column,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      return null;
      //console.error(error);
    }
  }

  InsertLayout(login, tilename, VisibleYN, row, column) {
    try {
      const webMethod = this.interfaceURL + 'InsertLayout';
      const parameters = {
        login,
        tilename,
        VisibleYN,
        row,
        column,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      return null;
      //console.error(error);
    }
  }

  changeCSPDashboardLayout(LayoutDetails) {
    try {
      const webMethod = this.interfaceURL + 'changeLayout';
      const Layout = JSON.stringify(LayoutDetails);
      const parameters = {
        Layout,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      return null;
      //console.error(error);
    }
  }
  reset() {
    this.Portfolio = 0;
    this.CustomerId = '';
    this.CustomerName = '';
    this.CustomerDisplayName = '';
    this.ContactNo = '';
    this.CustEmail = '';
    this.RiskProfile = '';
    this.CRR = '';
    this.Currency = '';
    this.AUM = '';
    this.PNL = '';
    this.BestPortfolio = [];
    this.NoteMasterID = '';
    this.TokenID = '';
    this.RiskRating = '';
    this.LastUpdatedOn = '';
    this.KYCUpdatedOn = '';
    this.freecash = '';
    this.CIF = '';
    this.AccountType = '';
    this.AccountNumber = '';
    this.RediretToHomeBuySellPledge = '';
  }
  //Changed by MohanP | 03feb22
  //Added by Uddesh on 25 Jan, 2022
  getAllProducts() {
    try {
      const webMethod = this.interfaceURL + 'findAllProducts';
      const parameters = {
        LoginID: this.authApi.UserName,
        requestDate: formatDate(new Date(), 'dd-MMM-yyyy', 'en'),
        EntityCode: this.authApi.EntityCode,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log('Error in fetching all products', error);
    }
  }
  //Insurance Policy Details --Added by AlolikaG on 27-Jan-22
  Get_PolicyRelationship(strPolicyNo) {
    try {
      const body = {
        strPolicyNo,
      };
      return this.http.post<any>(
        this.interfaceURL + 'Get_PolicyRelationship',
        body
      );
    } catch (error) {
      console.log('Error in Get_PolicyRelationship', error);
    }
  }
  Get_PolicyRider(strPolicyNo) {
    try {
      const body = {
        strPolicyNo,
      };
      return this.http.post<any>(this.interfaceURL + 'Get_PolicyRider', body);
    } catch (error) {
      console.log('Error in Get_PolicyRider', error);
    }
  }
  Get_PruLIP(strPolicyNo) {
    try {
      const body = {
        strPolicyNo,
      };
      return this.http.post<any>(this.interfaceURL + 'Get_PruLIP', body);
    } catch (error) {
      console.log('Error in Get_PruLIP', error);
    }
  }
  Fill_PolicyData_REST(EntityId, strPolicyNo) {
    try {
      const body = {
        EntityId,
        strPolicyNo,
      };
      return this.http.post<any>(
        this.interfaceURL + 'Fill_PolicyData_REST',
        body
      );
    } catch (error) {
      console.log('Error in Fill_PolicyData_REST', error);
    }
  }
  //SIP Details --Added by AlolikaG on 31st Jan 2022. Assigned by Parikshit K.
  getSIPDetails(CustomerID, EntityID, LoginUser, baseCcy) {
    try {
      const body = {
        CustomerID,
        EntityID,
        LoginUser,
        baseCcy,
      };
      return this.http.post<any>(this.interfaceURL + 'getSIPDetails', body);
    } catch (error) {
      console.log('Error in getSIPDetails', error);
    }
  }

  // SIP Imp Dates  --Added by AlolikaG on 1st Feb 2022. Assigned by Parikshit K.
  getSIPDates(CustomerID, EntityID, LoginUser, NotemasterID, baseCcy) {
    try {
      const body = {
        CustomerID,
        EntityID,
        LoginUser,
        NotemasterID,
        baseCcy,
      };
      return this.http.post<any>(this.interfaceURL + 'getSIPDates', body);
    } catch (error) {
      console.log('Error in getSIPDates', error);
    }
  }

  // SIP Overview  --Added by AlolikaG on 1st Feb 2022. Assigned by Parikshit K.
  getSIPOverview(CustomerID, EntityID, LoginUser, baseCcy) {
    try {
      const body = {
        CustomerID,
        EntityID,
        LoginUser,
        baseCcy,
      };
      return this.http.post<any>(this.interfaceURL + 'getSIPOverview', body);
    } catch (error) {
      console.log('Error in getSIPOverview', error);
    }
  }

  // SIP Overview  --Added by AlolikaG on 2nd Feb 2022. Assigned by Parikshit K.
  getSIPActions(NoteMasterId, UserId, NextDueDates, Mode) {
    try {
      const body = {
        NoteMasterId,
        UserId,
        NextDueDates,
        Mode,
      };
      return this.http.post<any>(this.interfaceURL + 'getSIPActions', body);
    } catch (error) {
      console.log('Error in getSIPActions', error);
    }
  }
  // SIP Overview  --Added by AlolikaG on 3rd Feb 2022. Assigned by Parikshit K.
  getSIPpausedDates(CustomerID, EntityID, LoginUser, NotemasterID, baseCcy) {
    try {
      const body = {
        CustomerID,
        EntityID,
        LoginUser,
        NotemasterID,
        baseCcy,
      };
      return this.http.post<any>(this.interfaceURL + 'getSIPpausedDates', body);
    } catch (error) {
      console.log('Error in getSIPpausedDates', error);
    }
  }
  getMFGenericTableValuedFunction(SPName, ParamList) {
    try {
      const body = {
        SPName,
        ParamList
      };
      return this.http.post<any>(this.interfaceURL + 'getMFGenericTableValuedFunction', body);
    } catch (error) {
      console.log('Error in getMFGenericTableValuedFunction', error);
    }
  }

  getMFExecGenericStoredProcedure(SPName, ParamList) {
    try {
      const body = {
        SPName,
        ParamList
      };
      return this.http.post<any>(this.interfaceURL + 'getMFExecGenericStoredProcedure', body);
    } catch (error) {
      console.log('Error in getMFExecGenericStoredProcedure', error);
    }
  }
  SIPGenericStoredProcedure(SPName, ParamList) {
    try {
      const body = {
        SPName,
        ParamList
      };
      return this.http.post<any>(this.interfaceURL + 'SIPGenericStoredProcedure', body);
    } catch (error) {
      console.log('Error in SIPGenericStoredProcedure', error);
    }
  }
  async Get_PruSurval_Data(PolicyID: any) {
    try {
      const webMethod = this.interfaceURL + 'Get_PruSurval_Data';
      const parameters = {
        PolicyID,
      };
      return this.http
        .post<any>(webMethod, parameters, { headers: this.headerOptions })
        .toPromise();
    } catch (error) {
    }
  }
  async Get_PruPRider_Data() {
    try {
      const webMethod = this.interfaceURL + 'Get_PruPRider_Data';
      const parameters = {
      };
      return this.http
        .post<any>(webMethod, parameters, { headers: this.headerOptions })
        .toPromise();
    } catch (error) {
    }
  }
  async DB_GetBenefitCodeDesc() {
    try {
      const webMethod = this.interfaceURL + 'DB_GetBenefitCodeDesc';
      const parameters = {
      };
      return this.http
        .post<any>(webMethod, parameters, { headers: this.headerOptions })
        .toPromise();
    } catch (error) {
    }
  }
  async GetInsuranceApplicationDetails(EntityID, PolicyNo) {
    try {
      const webMethod = this.interfaceURL + 'GetInsuranceApplicationDetails';
      const parameters = {
        EntityID,
        PolicyNo
      };
      return this.http
        .post<any>(webMethod, parameters, { headers: this.headerOptions })
        .toPromise();
    } catch (error) {
    }
  }
}
