// Changes added by Mayuri D. on 04-July-2022.

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

import { EcCommonService } from './ec-common.service';
import { AppConfig } from 'src/app/services/config.service';

declare var require: any;
const $: any = require('jquery');
@Injectable({
  providedIn: 'root',
})
export class EcHomeService {
  commonData: any;
  PayoffList: Object;
  constructor(
    private commonfunctions: EcCommonService,
    public http: HttpClient,
    public authApi: AuthService
  ) { }
  interfaceUrl = environment.interfaceURL;
  public CCY: any = [];
  public shares: any = [];
  public sharesCLN: any = [];
  public indexTrancheArr: any = [];
  public floatingRefArr: any = [];
  public floatingRefArrCLN: any = [];
  public validationArr: any = [];
  public RFQTimeFlag: any;
  public priceProviders: any = [];
  public rmList: any = [];
  BookingCenter = [];
  RFQDetails = {};
  public prevQuoteOrderPopUp = new BehaviorSubject(false);
  prevQuoteOrderPopUpObs = this.prevQuoteOrderPopUp.asObservable();

  //Added by Apurva K|| 03-May-2024
  public RFQBlotterPopupPopUp = new BehaviorSubject('');
  RFQBlotterPopupPopUpObs = this.RFQBlotterPopupPopUp.asObservable();

  saveproducttofolderresp: any;
  // FIN1EURINT-104 : Participation pay off addition in 1Europe
  allBooksData : any = [];

  productChartData: any[];
  EQ_Show_Workbench_Button = 'No';
  EQ_Show_WB_Button = 'No';
  result: any;
  UserID: any;
  public payOffList: any = [];

  MappedUsersAndGroupsArr: any;
  Dates: any;
  getSharedPortfolioAccessList: any;
  GetClientProdDetailsArr: any;

  public prevQuoteLaunchPopUpRMW = new BehaviorSubject([false, false]);
  prevQuoteLaunchPopUpRMWObs = this.prevQuoteLaunchPopUpRMW.asObservable();

  public backTestPopUp = new BehaviorSubject(false);
  backTestPopUpObs = this.backTestPopUp.asObservable();

  public lifecyclePopUp = new BehaviorSubject(false);
  lifecyclePopUpObs = this.lifecyclePopUp.asObservable();

  // public prevQuoteLaunchPopUpWFBlotter = new BehaviorSubject(false);
  // prevQuoteLaunchPopUpWFBlotterObs = this.prevQuoteLaunchPopUpWFBlotter.asObservable();



  public priceFlag = new BehaviorSubject(false);
  priceFlagCheck = this.priceFlag.asObservable();

  public rcPriceFlag = new BehaviorSubject(false);
  rcpriceFlagCheck = this.rcPriceFlag.asObservable();
  public creditFlag = new BehaviorSubject(false);
  creditpriceFlagCheck = this.creditFlag.asObservable();

  public saveFlag = new BehaviorSubject(false);
  saveFlagCheck = this.saveFlag.asObservable();

  public rcsaveFlag = new BehaviorSubject(false);
  rcsaveFlagCheck = this.rcsaveFlag.asObservable();
  public creditSaveFlag = new BehaviorSubject(false);
  creditSaveFlagCheck = this.creditSaveFlag.asObservable();

  public validationFlag = new BehaviorSubject(false);
  validationFlagCheck = this.validationFlag.asObservable();

  public loadFlag = new BehaviorSubject(false);
  LoadFlagCheck = this.loadFlag.asObservable();

  public rcloadFlag = new BehaviorSubject(false);
  RCLoadFlagCheck = this.rcloadFlag.asObservable();
  public creditloadFlag = new BehaviorSubject(false);
  CreditLoadFlagCheck = this.creditloadFlag.asObservable();
  public generateXmlObserver = new BehaviorSubject('');
  generateXml = this.generateXmlObserver.asObservable();

  public cloneFlag = new BehaviorSubject(false);
  cloneFlagCheck = this.cloneFlag.asObservable();

  public cloneFlag1 = new BehaviorSubject(false);
  cloneFlag1Obs = this.cloneFlag1.asObservable();

  public cloneData1 = new BehaviorSubject('');
  cloneData1Obs = this.cloneData1.asObservable();

  public multiPhoenixArr = new BehaviorSubject(0);
  multiPhoenixArrObserver = this.multiPhoenixArr.asObservable();

  /////////// Participatiom Observers

  public ptcloadFlag = new BehaviorSubject(false);
  PTCLoadFlagCheck = this.ptcloadFlag.asObservable();


  public ptcsaveFlag = new BehaviorSubject(false);
  ptcsaveFlagCheck = this.ptcsaveFlag.asObservable();

  public ptcPriceFlag = new BehaviorSubject(false);
  ptcpriceFlagCheck = this.ptcPriceFlag.asObservable();

  // toggle observers

  public toggleFlag = new BehaviorSubject(false);
  toggleFlagObs = this.toggleFlag.asObservable();
  
  // Bulk Pricer (AC) - Export to excel 
  public excelFlag = new BehaviorSubject(false);
  excelFlagObs = this.excelFlag.asObservable();
  
  public toggleData = new BehaviorSubject('');
  toggleDataObs = this.toggleData.asObservable();

  public toggleVisiblityFlag = new BehaviorSubject<any>('');
  toggleVisiblityFlagObs = this.toggleVisiblityFlag.asObservable();


  public refreshPreQuoteFlag = new BehaviorSubject({});
  refreshPreQuoteFlagObs = this.refreshPreQuoteFlag.asObservable();


  public schedulePriceFlag = new BehaviorSubject({});
  schedulePriceFlagCheck = this.schedulePriceFlag.asObservable();

  public schedulePopupFlag = new BehaviorSubject(false);
  schedulePopupFlagObs = this.schedulePopupFlag.asObservable();



  // BBVA workflow blotter details
  // <Suvarna(03-Dec-2019) || Workflow for RFQ blotter || start>
  GetWFBlotterPHXSF = new BehaviorSubject({});
  GetWFBlotterPHXSFObserver = this.GetWFBlotterPHXSF.asObservable();
  GetWFBlotterRCSF = new BehaviorSubject({});
  GetWFBlotterRCSFObserver = this.GetWFBlotterRCSF.asObservable();

  GetWFBlotterBRCSF = new BehaviorSubject({});
  GetWFBlotterBRCSFObserver = this.GetWFBlotterBRCSF.asObservable();

  GetWFBlotterCTSF = new BehaviorSubject({});
  GetWFBlotterCTSFObserver = this.GetWFBlotterCTSF.asObservable();

  GetWFBlotterPTCSF = new BehaviorSubject({});
  GetWFBlotterPTCSFObserver = this.GetWFBlotterPTCSF.asObservable();

  attachDetachCalculationsSF = new BehaviorSubject({});
  attachDetachCalculationsObserver = this.attachDetachCalculationsSF.asObservable();
  // /<Suvarna(13-Jan-2020) ||saved Request || end>


  //////  Attach Detach Percent Calculations || Suvarna Start 14Jan2020
  getAttachPercentSF = new BehaviorSubject({});
  getAttachPercentObserver = this.getAttachPercentSF.asObservable();
  getDetachchPercentSF = new BehaviorSubject({});
  getDetachchPercentObserver = this.getDetachchPercentSF.asObservable();
  //////  Attach Detach Percent Calculations || Suvarna End 14Jan2020


  public showPricerScreeninViewModePopup = new BehaviorSubject(false);
  showPricerScreeninViewModePopupObs = this.showPricerScreeninViewModePopup.asObservable();

  //// GetRFQDataForCloneEQ Suvarna start || 14-Jan-2020


  // Added new subscriber to handle launch product close action || PriyaL || 05Apr2022 || Assigned by PranavD
  public closeLaunchProduct = new BehaviorSubject(false);
  closeLaunchProductObs = this.closeLaunchProduct.asObservable();

  userGroupID = '';
  userGroup = '';
  portfolioGroupID = '';
  RMWProductDetails: any;
  likeProductFlag: any;
  unlikeProductFlag: any;
  folders: any;

  productattachmentlist: any;

  templateMappingArr:any=[]; //Added by ApurvaK
  userRoles:any;

  GetEventTarget(e: any) {
    try {
      const target: any = e.target || e.srcElement || e.currentTarget || null;
      return target;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // <Suvarna(13-Jan-2020) ||saved Request || start>
  async BBVWorkflowBlotter_saveQuotes(product, toDate, frmDate, PortfolioType) {
    setTimeout(() => {
      try {
        this.UserID = AppConfig.settings.oRes.userID;
        // tslint:disable-next-line: variable-name
        const month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const today = new Date();
        const formattedDate = ('0' + today.getDate()).slice(-2) + '-' + month_names[today.getMonth()] + '-' + today.getFullYear();
        const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Portfolio/GetPortfolioForAllDeals';
        const parameters = {
          UserID: this.UserID,
          Type: product,
          Mode: 'Single Pricer',
          FromDate: frmDate,
          ToDate: toDate,
          PageNo: '1',
          RowsPerPage: '500',
          PortfolioType
        };
        this.http.post(webMethod, parameters).subscribe((data: any) => {
          console.log("BBVWorkflowBlotter_saveQuotes", data)
          const Map1 = [];
          const result = data.Get_Portfolio_ForAllDealsResult;
          if (product === 'AutocallablePhoenix') {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < result.length; i++) {
              Map1.push({
                'Request ID': result[i].P_ID,
                Ccy: result[i].Ccy,
                Size: result[i].Size,
                Format: result[i].FormatDetails,
                'Solve For': result[i].SolveFor,
                'Price (%)': result[i].IBPrice,
                'Issue Price (%)': result[i].IssuePrice,
                Underlying: result[i].Share.split('##')[0].replace(/#/g, ','),
                'Expiry Date': result[i].ExpiryDate.split(' ')[0],
                'Payment Date': result[i].PaymentDate.split(' ')[0],
                'Strike (%)': result[i].Strike,
                'Strike Date': result[i].StrikeDate.split(' ')[0],
                'Coupon (%)': result[i].CouponPer,
                'Obs.': result[i].CouponObs,
                'Barrier (%)': result[i].KIPer,
                'Barrier Type': result[i].KIType,
                'Trigger (%)': result[i].KOPer,
                Frequency: result[i].KOType,
                Stepdown: result[i].StepDown,
                'Non-Call': result[i].NonCallPeriod,
                'ER Cpn (%)': result[i].ERCouponPer,
                'ER Cpn Type': result[i].ERCouponType,
                'Cpn Trigger': result[i].CouponBarrier,
                'Cpn Freq.': result[i].Frequency,
                'Cpn Type': result[i].CouponType,
                'Memory Pds.': result[i].MemoryPds,
                'Alt. Cpn (%)': result[i].AltCouponPer,
                'Alt. Obs.': result[i].AltCouponObservation,
                'Funding Type': result[i].FundingType,
                'Freq.': result[i].FundingFrequency,
                'Index Rate Spread': result[i].IndexRateSpread
              });
            }
            this.GetWFBlotterPHXSF.next(Map1);
          } else if (product === 'ReverseConvertible,BarrierReverseConvertible') {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < result.length; i++) {
              Map1.push({
                'Request ID': result[i].P_ID,
                Ccy: result[i].Ccy,
                Size: result[i].Size,
                Format: result[i].FormatDetails,
                'Solve For': result[i].SolveFor,
                'Price (%)': result[i].IBPrice,
                'Issue Price (%)': result[i].IssuePrice,
                Underlying: result[i].Share.split('##')[0].replace(/#/g, ','),
                'Expiry Date': result[i].ExpiryDate.split(' ')[0],
                'Payment Date': result[i].PaymentDate.split(' ')[0],
                'Strike (%)': result[i].Strike,
                'Strike Date': result[i].StrikeDate.split(' ')[0],
                'Coupon (%)': result[i].CouponPer,
                'Coupon Obs.': result[i].CouponObs,
                'Barrier (%)': result[i].KIPer,
                'Barrier Type': result[i].KIType,
                'Cpn Trigger': result[i].CouponBarrier,
                'Cpn Freq.': result[i].Frequency,
                'Cpn Type': result[i].CouponType,
                'Memory Pds.': result[i].MemoryPds,
                'Funding Type': result[i].FundingType,
                'Freq.': result[i].FundingFrequency,
                'Index Rate/ Spread': result[i].IndexRateSpread

              });
            }
            this.GetWFBlotterRCSF.next(Map1);
          } else if (product === 'BarrierReverseConvertible') {
            this.GetWFBlotterBRCSF.next(data.Get_PortfolioResult);
          } else if (product === 'CreditTranche') {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < result.length; i++) {
              Map1.push({
                'Request ID': result[i].P_ID,
                Ccy: result[i].Ccy,
                Size: result[i].Size,
                'Issue Date': result[i].IssueDate.split(' ')[0],
                Tenor: result[i].TenorPer,
                'Solve For': result[i].SolveFor,
                'Reoffer Price (%)': result[i].ReofferPrice,
                Index: result[i].IndexCode,
                Attach: result[i].AttachValue,
                'Attach (%)': result[i].AttachPer,
                Detach: result[i].DetachValue,
                'Detach (%)': result[i].DetachPer,
                'Cpn Type': result[i].CouponType,
                'Floating Ref.': result[i].FloatingRef,
                'Coupon/Spread': result[i].CouponPer, // IndexRateSpread
                // "Spread": result[i].CouponSpread,
                'Cpn Freq.': result[i].Frequency,
                'Coupon Basis': result[i].CouponBasis,
                'Ind./Firm': result[i].SubTemplate === 'CreditTranche' || result[i].SubTemplate === 'Credit Tranche' ? 'Firm' : 'Ind.',
                'Funding Type': result[i].FundingType,
                'Freq.': result[i].FundingFrequency,
                'Index Rate/Spread': result[i].IndexRateSpread
              });
            }
            this.GetWFBlotterCTSF.next(Map1);
          } else if (product === 'Participation') {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < result.length; i++) {
              Map1.push({
                'Request ID': result[i].P_ID,
                Type: result[i].ProductType,
                Underlying: result[i].Share.split('##')[0].replace(/#/g, ','),
                Format: result[i].Wrapper,
                'Solve For': result[i].SolveFor,
                'Price (%)': result[i].IBPrice,
                'Issue Price (%)': result[i].IssuePrice,
                Ccy: result[i].Ccy,
                Size: result[i].Size,
                'Strike Date': result[i].StrikeDate.split(' ')[0],
                'Payment Date': result[i].PaymentDate.split(' ')[0],
                'Final Redemption Date': result[i].ExpiryDate.split(' ')[0],
                'Upside Strike (%)': result[i].InputStrikePercent,
                'Gearing (%)': result[i].UpsideParticipationPercent,
                'Upper Strike (%)': result[i].UpsideParticipationCapPercent,
                'Min Coupon (%)': result[i].InputMinimumCouponPercentPA,
                'Upside Barrier Type': result[i].InputKOBarrierFrequency,
                'Upside Barrier Level (%)': result[i].InitialInputKOBarrierPercent,
                'Rebate (%)': result[i].InputRebatePercent,
                'Downside Strike (%)': result[i].InputDownsideStrikePercent,
                'Leverage (%)': result[i].DownsideParticipationPercent,
                'Lower Strike (%)': result[i].DownsideParticipationCapPercent,
                'Downside Barrier Type': result[i].InputKIBarrierFrequency,
                'Downside Barrier Level (%)': result[i].InitialInputKIBarrierPercent,
                'Capital Guranteed level (%)': result[i].DownsideCapitalProtectionPercent,
                'Coupon (%)': result[i].GuaranteedCoupon,
                'Coupon Freq.': result[i].InputFixedCouponFrequencyPeriod,
                'Funding Type': result[i].FundingType,
                'FUnding Freq.': result[i].FundingFrequency,
                'Rate/Spread (%)': result[i].IndexRateSpread
              });
            }
            this.GetWFBlotterPTCSF.next(Map1);
          }
        });

      } catch (error) {
        //console.log('Error:', error);
      }
    });
  }

  async launchProduct(ID, parameterName) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Clone/GetRFQDataForClone';
      let cloneData;
      this.UserID = AppConfig.settings.oRes.userID;
      const parameters = {
        RFQID: parameterName === 'RFQID' ? ID : '',
        NoteMasterID: parameterName === 'NoteMasterID' ? ID : '',
        BBVAID: parameterName === 'BBVAID' ? ID : '',
        LoginID: this.UserID
      };
      await this.http.post(webMethod, parameters).subscribe((data: any) => {
        console.log("launchProduct", data)
        if (data.GetRFQDataForCloneResult[0]) {
          const parseString = require('xml2js').parseString;
          // tslint:disable-next-line: only-arrow-functions
          parseString(data.GetRFQDataForCloneResult[0].RFQDetailsXML, function (result) {
            cloneData = result.RFQDetails.RFQ[0];
          });

          this.RFQDetails = {
            TemplateCode: data.GetRFQDataForCloneResult[0].TemplateCode,
            SubTemplateCode: data.GetRFQDataForCloneResult[0].SubTemplateCode, cloneData
          };

        }
      });
      return this.RFQDetails;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async getAllBooksMappedToLogin() {
    try {
      // FIN1EURINT-104 : Participation pay off addition in 1Europe
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetAllMappedBooks';
      this.UserID = AppConfig.settings.oRes.userID;
      const parameters = {
        LoginID: this.UserID
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.allBooksData = data;
        return data;
      });
      
    } catch (error) {
      //console.log('Error:', error);
    }
  }



  //Remaining
  async BBVAGetRecentRequests(queryToSearch: any, queueid: any) {
    try {
      this.UserID = this.commonfunctions.getLoggedInUserName()[0].UserId;
      const webMethod = AppConfig.settings.apiBaseUrl + 'getTokens_RecentRequests';
      const parameters = {
        workflowCode: 'RFQ Workflow',
        queueid: queueid,
        entityId: AppConfig.settings.oRes.homeEntityID,
        pageno: '1',
        pageSize: '70',
        queryToSearch: queryToSearch,
        LoginId: this.UserID,
      };
      await this.http.post(webMethod, parameters).subscribe((data: any) => {
        this.result = data.getTokens_NoDateFilterResult;
      });


      return this.result;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  //to get popular products Chart Data
  async BBVAGetPopularProducts(loginId: any, duration: any) {
    try {
      // let shares = [];
      const webMethod = AppConfig.settings.apiBaseUrl + 'landingpage/LandingPage/GetPopularProducts';
      const parameters = {
        LoginID: loginId,
        Duration: duration,
      };
      return this.http
        .post(webMethod, parameters, {})
        .toPromise();
      // return this.productChartData;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  //Remianing
  async BBVAGetPopularData(
    productDuration: any,
    tenorDuration: any,
    underlyingDuration: any,
    NoOfUnderlyings: any
  ) {
    try {
      const webMethod =
        AppConfig.settings.apiBaseUrl + 'landingpage/LandingPage/GetPopularProducts';

      // console.log('in popular data echome', webMethod);
      const parameters = {
        LoginID: this.commonfunctions.getLoggedInUserName()[0].UserId,
        productDuration,
        tenorDuration,
        underlyingDuration,
        NoOfUnderlyings,
      };

      return this.http
        .post(webMethod, parameters, {
          // responseType: 'text' as 'json',
        })
        .toPromise();
    } catch (error) {
      //console.log('Error:', error);
    }
  }


  async BBVAGetPopularUnderlyings(loginId: any, duration: any, NoOfUnderlyings: any) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'landingpage/LandingPage/GetPopularUnderlyings';
      const parameters = {
        LoginID: loginId,
        Duration: duration,
        NoOfUnderlyings: NoOfUnderlyings,
      };

      return this.http
        .post(webMethod, parameters, {
          // responseType: 'text' as 'json',
        })
        .toPromise();

    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async BBVAGetPopularTenors(loginId: any, duration: any) {
    try {
      // let shares = [];
      const webMethod = AppConfig.settings.apiBaseUrl + 'landingpage/LandingPage/GetPopularTenors';
      const parameters = {
        LoginID: loginId,
        Duration: duration,
      };

      return this.http
        .post(webMethod, parameters, {
          // responseType: 'text' as 'json',
        })
        .toPromise();

    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async BBVAGetPortfolio(Type: any, Mode: any) {
    try {
      this.UserID = AppConfig.settings.oRes.userID;
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Portfolio/GetPortfolioForAllDealsFlexiPricer';
      const parameters = {
        UserID: this.UserID,
        Type: Type,
        Mode: Mode
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {    
        this.result = data;
        return data;
      });
    } catch (error) {
    }
  }


  // Added by Apurva K|| 15-Mar-2023
  async BBVALoadShares(marketType: any, strExchange: any, ProductCode: any) {
    try {
      // debugger
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetAllShareDetails';
      const parameters = {
        MarketType: marketType,
        strExchange,
        ProductCode,
        // entityID: this.commonfunctions.getLoggedInUserName()[1].EntityId,
        entityID: AppConfig.settings.oRes.homeEntityID,
      };
      // const response = this.http.post(webMethod,parameters);

      // return await response.toPromise();
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        //debugger
        this.shares = data;
        console.log ( 'Autocall', this.sharesCLN);
        return this.shares;
       });

    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async BBVALoadCCY() {
    try {
       //debugger;
      //  const that=this;
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetCcyList';
      return await this.http.get(webMethod).toPromise().then((data:any)=>{
        this.CCY = data;
        return this.CCY;
       
       });

      // return this.http.post(webMethod, parameters);
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  //Remianing
  async bookOrder(
    BookingBranch: any,
    LimitPrice1: any,
    OrderType: any,
    QuoteRequestId: any,
    RMNameforOrderConfirm: any,
    orderQuantity: any
  ) {
    try {
      let res: any;

      const webMethod = this.interfaceUrl + 'bookOrder';
      const parameters = {
        BookingBranch,
        LimitPrice1,
        OrderType,
        QuoteRequestId,
        RMNameforOrderConfirm,
        userName: AppConfig.settings.oRes.homeEntityID,
        orderQuantity,
      };
      await this.http.post(webMethod,parameters).subscribe((data:any)=>{
        res = data;
       });
      return res;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  //Remaining
  async SaveProductToFolder(
    FolderName: any,
    NoteMasterID: any,
    CustomerID: any,
    ListType: any
  ) {
    const webMethod = this.interfaceUrl + 'SaveProductToFolder';

    const parameters = {
      FolderName,
      NoteMasterID,
      CustomerID,
      EntityID: AppConfig.settings.oRes.homeEntityID,
      User: AppConfig.settings.oRes.userID,
      ListType,
    };
    await this.http.post(webMethod,parameters).subscribe((data:any)=>{
      this.saveproducttofolderresp = data;
        //return this.saveproducttofolderresp;
     });
    return this.saveproducttofolderresp;
  }

  //Remianing: Paramter mismatch
  async BBVAFetchValidation(ProductType: any) {
    try {
      let validationArr = [];
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/FetchValidation';
      const parameters = {
        ProductType,
        entityID: AppConfig.settings.oRes.homeEntityID,
        productName:""
      };
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        this.validationArr = data;
        return this.validationArr;
       });
      
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async Get_RMList() {
    try {
      let res: any;
      //console.log('in Get_RMList');
      this.rmList = [];
      const webMethod =  AppConfig.settings.apiBaseUrl  + 'eqd/Details/GetRMList';
      const parameters = {
        strEntityId: AppConfig.settings.oRes.homeEntityID, // "3",
        strLoginName: AppConfig.settings.oRes.userID, //"Dealer1",
        FollowLRC_YN:
        AppConfig.settings.oRes.groupID.includes('RM') == true
            ? 'Y'
            : 'N',
        strDeptNameYN: 'N',
        CB_EntityID: AppConfig.settings.oRes.homeEntityID,
        // userName:AppConfig.settings.oRes.userID,
        // orderQuantity
      };
      await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
       
        this.rmList = data;
        
       });
      // this.priceProviders = res;
      
      return this.rmList;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  //Remianing
  async GetBookingCenter() {
    try {
      let res: any;
      //console.log('in GetBookingCenter');

      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetBookingCenter';

      const parameters = {
        // Modified request parameter by Priya L. as asked by Samruddhi W. on 14Mar2022
        User:
        AppConfig.settings.oRes.groupID +   //Needs to be changed later on || AK
          ':' +
          AppConfig.settings.oRes.homeEntityID,
      };
      
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        //debugger
        this.BookingCenter = data;
        return this.BookingCenter;
      });
      //return this.BookingCenter;
      // return this.http.post(webMethod, parameters);
    } catch (error) {
      //console.log('Error:', error);
    }
  }
//Remianing: params mismacth
  async getCustomerList() {
    try {
      var custList = [];
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Details/FindCustomerDetails';
      const parameters = {
        LoginID: AppConfig.settings.oRes.homeEntityID,
        Customer_name: '',
      };
      await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
       //console.log(data);
       if (
        data?.ResponseDetails.Description === 'Success'
      ) {
        // $('#loading').hide();
        custList = data.items;
        // this.watchlistList = data.EQGetWatchListAPIResponse.items;
      } else {
        // MsgDialog(this, "Warning", 0, data.ListInfoProduct.ResponseDetails.Remark)
      }
       });


      return custList;
    } catch (error) {
      // //console.log('Error:', error);
    }
  }

  //Remaining
  async getPreviousQuoteCloneData(ID, parameterName) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Clone/GetRFQDataForClone';
      let cloneData;
      this.UserID = AppConfig.settings.oRes.userID;
      this.RFQDetails = {};
      const parameters = {
        RFQID: parameterName === 'RFQID' ? ID : '',
        NoteMasterID: parameterName === 'NoteMasterID' ? ID : '',
        BBVAID: parameterName === 'BBVAID' ? ID : '',
        LoginID: this.UserID,
      };
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        if (data?.length) {
          // //console.log(data);
          const parseString = require('xml2js').parseString;
          // tslint:disable-next-line: only-arrow-functions
          parseString(
            data[0].RFQDetailsXML,
            function (_err, result) {
              if (result) {
                cloneData = result.RFQDetails.RFQ[0];
              }
            }
          );

          this.RFQDetails = {
            TemplateCode: data[0].TemplateCode,
            SubTemplateCode: data[0].SubTemplateCode,
            cloneData,
          };
        }
        return this.RFQDetails;
       });

      
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  //Remaining
 //modified by PoojaW
 async getRedirectionData(portfolioID,Type) {
  try {
    
    const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Portfolio/GetPortfolio';
    let portfolioData;
    this.UserID = AppConfig.settings.oRes.userID;
    const parameters = {
      UserID: this.UserID,
      Portfolio_ID: portfolioID,
      Type,

    };
     await this.http.post(webMethod, parameters).toPromise().then((data: any) => {    
      portfolioData = data;
     
    });
    return portfolioData;
  } catch (error) {}
}
 //Remaining: params mismatch
  async BBVAGetDates(ccy: string, tenorCode: string | any[], tradeDate: string) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Dates/GetUSDBasedDates';
      const parameters = {

        EntityId: AppConfig.settings.oRes.homeEntityID,
        Base_Currency: ccy,
        Quanto_Currency: "",
        BankLocalCurrency: "EUR",
        Tenor_Code: tenorCode,
        FixingOffset: 0,
        Settlement_Days: "0",
        TradeDate: tradeDate

      };

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.Dates = data;
        return data;
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async GetMappedUsersAndGroups() {
    const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetMappedUsersAndGroups';

    const parameters = {
      UserID: AppConfig.settings.oRes.userID,
    };
    return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
      this.MappedUsersAndGroupsArr = data;
      return this.MappedUsersAndGroupsArr;
     });
  }

  async GetPriceProviderDetails(product: string) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetPriceProviderDetails';
      const parameters = {
        "product": product,
        "entityID": AppConfig.settings.oRes.homeEntityID
      }
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data.PPName;
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async fnportfolioGroupID() {
    try {
      this.UserID = AppConfig.settings.oRes.userID;
      const RFQTimeFlag = [];
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Details/getLatestGroupID';
      const parameters = {
        MsgSource: 'ANGULAR_WEB',
        UserID: this.UserID,
      };
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        this.result = data.LastestGroupIdResult;
        return this.result;
       });
      
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  /// BBVA Load shares indexTrancheArr

 async  BBVALoadSharesCR(marketType: any, strExchange: any, ProductCode: any) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetAllShareDetails';
      const parameters = {
        MarketType: marketType,
        strExchange,
        ProductCode,
        // entityID: this.commonfunctions.getLoggedInUserName()[1].EntityId,
        entityID: AppConfig.settings.oRes.homeEntityID,
      };

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.indexTrancheArr = data;
        return data;
      });
      
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // BBVA Load shares floatingRefArr

  async BBVALoadSharesIR(marketType: any, strExchange: any, ProductCode: any) {
    try {
      let floatingRefArr = [];
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Details/GetAllShareDetails';
      const parameters = {
        MarketType: marketType,
        strExchange,
        ProductCode,
        entityID: AppConfig.settings.oRes.homeEntityID,
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.floatingRefArr = data;
        return data;
      });
      
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  //Remaining
  async BBVWorkflowBlotter_old(
    queryToSearch,
    workflowId,
    queueid,
    fromDate,
    toDate,
    requestType
  ) {
    setTimeout(async() => {
      try {
        this.UserID = this.commonfunctions.getLoggedInUserName()[0].UserId;
        const webMethod = this.interfaceUrl + 'getTokens';
        const parameters = {
          workflowId,
          workflowCode: 'RFQ Workflow',
          queueid,
          entityId: AppConfig.settings.oRes.homeEntityID,
          pageno: '1',
          pageSize: '1500',
          queryToSearch,
          LoginId: this.UserID,
          FromDate: fromDate,
          ToDate: toDate,
          Flag: requestType,
        };
        await this.http.post(webMethod,parameters).subscribe((data:any)=>{
          const parseString = require('xml2js').parseString;
          // tslint:disable-next-line: only-arrow-functions
          parseString(data.getTokensResult, function (err, result) {
            console.log(err);
            if (result.NewDataSet) {
              this.getDataForExportToExcel(result.NewDataSet.DUMMY);
              if (queryToSearch === 'AutocallablePhoenix') {
                this.GetWFBlotterPHXSF.next(result.NewDataSet.DUMMY);
              } else if (
                queryToSearch ===
                'ReverseConvertible,BarrierReverseConvertible'
              ) {
                this.GetWFBlotterRCSF.next(result.NewDataSet.DUMMY);
              } else if (queryToSearch === 'BarrierReverseConvertible') {
                this.GetWFBlotterBRCSF.next(result.NewDataSet.DUMMY);
              } else if (queryToSearch === 'CreditTranche') {
                this.GetWFBlotterCTSF.next(result.NewDataSet.DUMMY);
              } else if (queryToSearch === 'Participation') {
                this.GetWFBlotterPTCSF.next(result.NewDataSet.DUMMY);
              }
            }
         });
        });
        return false;
      } catch (error) {
        //console.log('Error:', error);
      }
    });
  }

  // BBVWorkflowBlotter(queryToSearch, workflowId, queueid, fromDate, toDate, requestType, strRowCount,nm_id) {
  async BBVWorkflowBlotter(queryToSearch, fromDate, toDate, nm_id='',pageIndex='0',pageSize='5',rfqID='',filterMode='Self') {
    $('#loading').show();
    var strRowCount = 1000; // [*] Getting the max instead of chunk.. < SaurabhS | 17-sep-2021 | Pagination fetching the max record and paginate />
      try {
        console.log("afs BBVWorkflowBlotter",filterMode);
        this.UserID = AppConfig.settings.oRes.userID
        const webMethod =  AppConfig.settings.apiBaseUrl + 'eqd/Quote/GetProductBasedRFQ';
        const parameters = {
          branch_entity: '',
          // TemplateName: queryToSearch, //"AutocallablePhoenix",
          TemplateName: queryToSearch,
          UserName: AppConfig.settings.oRes.userID, //"Dealer1", //Changed by Jyoti S || 14-Jul-2023
          // "strTradeDate": "22-Jun-2021",
          // RowCount: strRowCount.toString(),
          //RowCount: '',
          Mode: filterMode,
          ProductCode: '',
          LoginHostName: '',
          RFQID: rfqID,
          nm_id: nm_id,
          PPName: '',
          ExpandAll: '',
          FromDate: fromDate, //"23-Jun-2021",
          ToDate: toDate, //"24-Jul-2021"
          PageNumber:pageIndex,
          RowsPerPage:pageSize
        };
        return await this.http.post(webMethod,parameters).toPromise().then((data: any) => {
        return data;
      //Changed by Jyoti S || 21-Jul-2023
         });

      } catch (error) {
        //console.log('Error:', error);
      }
  }

  // BBVWorkflowBlotterReprice(queryToSearch, RFQID) {
  async BBVWorkflowBlotterReprice(queryToSearch, fromDate, toDate, nm_id,pageIndex='0',pageSize='5') {
    // $('#loading').show();
    var rePriceData;
    var strRowCount = 1000; // [*] Getting the max instead of chunk.. < SaurabhS | 17-sep-2021 | Pagination fetching the max record and paginate />
    // setTimeout(async() => {
    try {
     
      // this.UserID = this.commonfunctions.getLoggedInUserName()[0].UserId;
      const webMethod =  AppConfig.settings.apiBaseUrl + 'eqd/Quote/GetProductBasedRFQ';
      const parameters = {
        branch_entity: '',
        UserName: AppConfig.settings.oRes.userID,//Changed by Jyoti S || 14-Jul-2023, 
        TemplateName: queryToSearch,
        //RowCount: strRowCount.toString(),
        Mode: 'Self',
        ProductCode: '',
        LoginHostName: '',
        RFQID: '',
        nm_id: nm_id,
        PPName: '',
        ExpandAll: '',
        FromDate: fromDate,
        ToDate: toDate, 
        PageNumber:pageIndex,
        RowsPerPage:pageSize
      };
      return await this.http.post(webMethod,parameters).toPromise().then((data: any) => {
      return data;
      //Changed by Jyoti S || 12-Jul-2023
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  // });
  }

  //Remaining
  BBVOrderBlotter(
    queryToSearch,
    workflowId,
    queueid,
    fromDate,
    toDate,
    requestType
  ) {
    setTimeout(async () => {
      try {
        this.UserID = AppConfig.settings.oRes.userID;
        const webMethod = this.interfaceUrl + 'getTokens';
        // const webMethod = AppConfig.settings.apiBaseUrl + 'getTokens';
        const parameters = {
          workflowId,
          workflowCode: 'Retail ELI Order Workflow',
          queueid,
          entityId: AppConfig.settings.oRes.homeEntityID,
          pageno: '1',
          pageSize: '1500',
          queryToSearch,
          LoginId: this.UserID,
          FromDate: fromDate,
          ToDate: toDate,
          Flag: requestType,
        };

        // $.ajax({
        //   async: false,
        //   crossDomain: true,
        //   type: 'POST',
        //   url: webMethod,
        //   data: JSON.stringify(parameters),
        //   contentType: 'application/json; charset=utf-8',
        //   dataType: 'json',
        //   headers: {
        //     'Cache-Control': 'no-cache',
        //     'Access-Control-Allow-Origin': '*',
        //   },
        //   success(data) {
        //     const parseString = require('xml2js').parseString;
        //     // tslint:disable-next-line: only-arrow-functions
        //     parseString(data.getTokensResult, function (err, result) {
        //       console.log(err);
        //       this.getDataForExportToExcel(result.NewDataSet.DUMMY);
        //       if (queryToSearch === 'AutocallablePhoenix') {
        //         this.GetWFBlotterPHXSF.next(result.NewDataSet.DUMMY);
        //       } else if (
        //         queryToSearch === 'ReverseConvertible,BarrierReverseConvertible'
        //       ) {
        //         this.GetWFBlotterRCSF.next(result.NewDataSet.DUMMY);
        //       } else if (queryToSearch === 'BarrierReverseConvertible') {
        //         this.GetWFBlotterBRCSF.next(result.NewDataSet.DUMMY);
        //       } else if (queryToSearch === 'CreditTranche') {
        //         this.GetWFBlotterCTSF.next(result.NewDataSet.DUMMY);
        //       } else if (queryToSearch === 'Participation') {
        //         this.GetWFBlotterPTCSF.next(result.NewDataSet.DUMMY);
        //       }
        //     });
        //   },
        //   error() { },
        // });
        // return false;
        const that = this;
        await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
          const parseString = require('xml2js').parseString;
          // tslint:disable-next-line: only-arrow-functions
          parseString(data.getTokensResult, function (err, result) {
            console.log(err);
            that.getDataForExportToExcel(result.NewDataSet.DUMMY);
            if (queryToSearch === 'AutocallablePhoenix') {
              that.GetWFBlotterPHXSF.next(result.NewDataSet.DUMMY);
            } else if (
              queryToSearch === 'ReverseConvertible,BarrierReverseConvertible'
            ) {
              that.GetWFBlotterRCSF.next(result.NewDataSet.DUMMY);
            } else if (queryToSearch === 'BarrierReverseConvertible') {
              that.GetWFBlotterBRCSF.next(result.NewDataSet.DUMMY);
            } else if (queryToSearch === 'CreditTranche') {
              that.GetWFBlotterCTSF.next(result.NewDataSet.DUMMY);
            } else if (queryToSearch === 'Participation') {
              that.GetWFBlotterPTCSF.next(result.NewDataSet.DUMMY);
            }
          });
        }).catch(error => {
          console.log(error);
        });
        return false;
      } catch (error) {
        //console.log('Error:', error);
      }
    });
  }

  getDataForExportToExcel(blotterData) {
    try {
      const exportExcelDataArray = [];
      if (blotterData && blotterData.length) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < blotterData.length; i++) {
          const exportExcelData = blotterData[i];
          for (const obj of Object.entries(exportExcelData)) {
            exportExcelData[obj[0]] = obj[1][0];
          }
          exportExcelDataArray.push(exportExcelData);
        }
      }

      return exportExcelDataArray;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

//Remianing
  async bookOrderUCP_LaunchProd(
    //    this.Issuer,
    AdvisoryReason,
    BookingBranch,
    ClientPrice,
    ClientYield,
    ConfirmReason,
    LimitPrice1,
    LimitPrice2,
    LimitPrice3,
    LimitPrice4,
    LimitPrice5, // added by suvarna P || 06Apr2022 || for 5th underlying
    Margin,
    OrderComment,
    OrderType,
    PoolID,
    PreTradeXml,
    QuoteRequestId, // QuoteRequestId = //"1025750",
    RMEmailIdforOrderConfirm, // RMEmailIdforOrderConfirm =
    RMNameforOrderConfirm,
    RedirectOrderID,
    orderQuantity,
    token,
    PoolYN, //:"Y",
    MaxNotional, //:"1000000",
    MinNotional, //:"300000",
    MinOrderSize, //:"100",
    CloseDate, //:"19-Mar-2021",
    StartDate, //18-Mar-2021",
    Denomination, //:"100"
    Summary,
    ProductName,
    MinMaxCoupon,
    Remarks,
    MinMaxSolveFor,
    TrancheRemarks,
    DoneAtString,
    LimitLevel,
    NonBestPriceReason,
    EditPoolYN,
    NotemasterID
  ) {
    try {
      console.log(LimitPrice5);
      let res: any;
      //console.log('in bookOrderUCP_LaunchProd');

      // const webMethod = this.interfaceUrl + 'bookOrderUCP';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Order/OrderRequest';
      // const webMethod = "http://localhost:4000/api/" + 'bookOrderUCP_LaunchProd';
      // const webMethod = this.interfaceUrl + 'bookOrderUCP_LaunchProd';
      const parameters = {
        // "strEntityId": AppConfig.settings.oRes.homeEntityID, // AppConfig.settings.oRes.homeEntityID,
        // "strLoginName": AppConfig.settings.oRes.userID, //"Dealer1",
        // "AdvisoryReason":"Hey1",
        // "BookingBranch":"BANCO",
        // "ClientPrice":"0",
        // "ClientYield":"0",
        // "ConfirmReason":"Hey",
        // "LimitPrice1":"0",
        // "LimitPrice2":"0",
        // "LimitPrice3":"0",
        // "LimitPrice4":"0",
        // "Margin":"0",
        // "OrderComment":"",
        // "OrderType":"Market",
        // "PoolID":"",
        // "PreTradeXml":"",
        // "QuoteRequestId": selectedRFQ , //"1025750",
        // "RMEmailIdforOrderConfirm":"",
        // "RMNameforOrderConfirm":"",
        // "RedirectOrderID":"",
        // "orderQuantity": totalNotional , //"10000",
        // "token":"",
        AdvisoryReason,
        BookingBranch,
        ClientPrice,
        ClientYield,
        ConfirmReason,
        LimitPrice1,
        LimitPrice2,
        LimitPrice3,
        LimitPrice4,
        Margin,
        OrderComment,
        OrderType,
        PoolID,
        PreTradeXml,
        QuoteRequestId, // QuoteRequestId = //"1025750",
        RMEmailIdforOrderConfirm, // RMEmailIdforOrderConfirm =
        RMNameforOrderConfirm,
        RedirectOrderID,
        orderQuantity,
        token,
        userName: AppConfig.settings.oRes.userID, //"Dealer1",
        PoolYN, //:"Y",
        MaxNotional, //:"1000000",
        MinNotional, //:"300000",
        MinOrderSize, //:"100",
        CloseDate, //:"19-Mar-2021",
        StartDate, //18-Mar-2021",
        Denomination, //:"100"
        Summary,
        ProductName,
        MinMaxCoupon,
        Remarks,
        MinMaxSolveFor,
        TrancheRemarks,
        DoneAtString,
        LimitLevel,
        NonBestPriceReason,
        EditPoolYN,
        NotemasterID,
      };
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
       //console.log(data);
       res = data;
       return res;
       });
      // this.priceProviders = res;
      // return res;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

// Changed By AdilP 
  async getOrderInfo(
    queryToSearch: any,
    PageNo: any,
    RowsperPage: any,
    NoteMasterId: any,
    fillNotional: any,
    viewOnlyYN
  ) {
    try {
      var getOrderInfo = [];
      //const webMethod = this.interfaceUrl + 'getOrderInfo';
       const webMethod = AppConfig.settings.apiBaseUrl + 'wbdsapi/GetOrderInfo'; //Added by AdilP @11-04-2023
      // const webMethod =  'http://localhost:4000/api/' + 'getOrderInfo';
      const parameters = {
        'queryToSearch':queryToSearch,
        'entityId': AppConfig.settings.oRes.homeEntityID,
        'PageNo': parseInt(PageNo) ,
        'RowsperPage': parseInt(RowsperPage),
        'NoteMasterId': parseInt(NoteMasterId),
        // NoteMasterId: "311787",
        'fillNotional':parseInt(fillNotional),
        'User_ID': AppConfig.settings.oRes.userID,
        'Mode': this.commonfunctions.getLoggedInUserName()[3].Usertype,
        'viewOnlyYN': viewOnlyYN,
      };

      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*',
      //   },
      //   success(data) {
      //     //console.log(data);
      //     const parseString = require('xml2js').parseString;
      //     // tslint:disable-next-line: only-arrow-functions
      //     parseString(data.getOrderInfoResult, function (err, result) {
      //       console.log(err);
      //       //console.log(result.NewDataSet);
      //       //console.log(result.NewDataSet.DUMMY);
      //       if (result.NewDataSet.DUMMY) {
      //         getOrderInfo = result.NewDataSet.DUMMY;
      //       }
      //     });
      //     //console.log(getOrderInfo);
      //   },
      //   error() { },
      // });
      // return getOrderInfo;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        const parseString = require('xml2js').parseString;
             parseString(data.Result, function (err, result) {
            console.log(err);
            //console.log(result.NewDataSet);
            //console.log(result.NewDataSet.DUMMY);
            if (result.NewDataSet.DUMMY) {
              getOrderInfo = result.NewDataSet.DUMMY;
            }
          });
          return getOrderInfo;
      }).catch(error => {
        console.log(error);
      });
    } catch (error) {
      // //console.log('Error:', error);
    }
  }

  //Remaining
  async Update_Underlying_CustomerDetails(
    DoneUpdateString: any,
    FilledNotional: any,
    Note_master_id: any,
    Remark: any,
    Template_Code: any,
    Template_Sr_No: any,
    objCustomerDealUpdateDetails: any,
    orderExecutionTime: any,
    orderPlacedTime: any
  ) {
    const webMethod = this.interfaceUrl + 'eqd/Details/UpdateUnderlyingCustomerDetails';
    // const webMethod = AppConfig.settings.apiBaseUrl + 'Update_Underlying_CustomerDetails';
    const parameters = {
          DoneUpdateString,
          FilledNotional,
          Note_master_id,
          Remark,
          Template_Code,
          Template_Sr_No,
          UserID: this.commonfunctions.getLoggedInUserName()[0].UserId,
          objCustomerDealUpdateDetails,
          orderExecutionTime,
          orderPlacedTime,
        }
    let response: any = [];
    try {
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify({
      //     DoneUpdateString,
      //     FilledNotional,
      //     Note_master_id,
      //     Remark,
      //     Template_Code,
      //     Template_Sr_No,
      //     UserID: this.commonfunctions.getLoggedInUserName()[0].UserId,
      //     objCustomerDealUpdateDetails,
      //     orderExecutionTime,
      //     orderPlacedTime,
      //   }),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*',
      //   },
      //   success(data) {
      //     response = data;
      //   },
      //   error() {
      //     //console.log(error);
      //   },
      // });
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        response = data;
        return response;
      }).catch(error => {
        console.log(error);
      });
    } catch (error) {
      //console.log(error);
    }
    // return response;
  }

  //Remaining
  // bookOrderUCP( Issuer, selectedRFQ, totalNotional) {
 async bookOrderUCP(
    //    this.Issuer,
    AdvisoryReason,
    BookingBranch,
    ClientPrice,
    ClientYield,
    ConfirmReason,
    LimitPrice1,
    LimitPrice2,
    LimitPrice3,
    LimitPrice4,
    Margin,
    OrderComment,
    OrderType,
    PoolID,
    PreTradeXml,
    QuoteRequestId, // QuoteRequestId = //"1025750",
    RMEmailIdforOrderConfirm, // RMEmailIdforOrderConfirm =
    RMNameforOrderConfirm,
    RedirectOrderID,
    orderQuantity,
    token,
    CustomerGridInfo
  ) {
    try {
      let res: any;
      //console.log('in bookOrderUCP');

      // const webMethod = this.interfaceUrl + 'bookOrderUCP';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Order/OrderRequest';
      //const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Order/BookOrder'; //Changes done by Apurva K for hedging type issue
      const parameters = {
        // "strEntityId": AppConfig.settings.oRes.homeEntityID, // AppConfig.settings.oRes.homeEntityID,
        // "strLoginName": AppConfig.settings.oRes.userID, //"Dealer1",
        // "AdvisoryReason":"Hey1",
        // "BookingBranch":"BANCO",
        // "ClientPrice":"0",
        // "ClientYield":"0",
        // "ConfirmReason":"Hey",
        // "LimitPrice1":"0",
        // "LimitPrice2":"0",
        // "LimitPrice3":"0",
        // "LimitPrice4":"0",
        // "Margin":"0",
        // "OrderComment":"",
        // "OrderType":"Market",
        // "PoolID":"",
        // "PreTradeXml":"",
        // "QuoteRequestId": selectedRFQ , //"1025750",
        // "RMEmailIdforOrderConfirm":"",
        // "RMNameforOrderConfirm":"",
        // "RedirectOrderID":"",
        // "orderQuantity": totalNotional , //"10000",
        // "token":"",
        AdvisoryReason,
        BookingBranch,
        ClientPrice,
        ClientYield,
        ConfirmReason,
        LimitPrice1,
        LimitPrice2,
        LimitPrice3,
        LimitPrice4,
        Margin,
        OrderComment,
        OrderType,
        PoolID,
        PreTradeXml,
        QuoteRequestId, // QuoteRequestId = //"1025750",
        RMEmailIdforOrderConfirm, // RMEmailIdforOrderConfirm =
        RMNameforOrderConfirm,
        RedirectOrderID,
        orderQuantity,
        token,
        userName: AppConfig.settings.oRes.userID, //"Dealer1",
        CustomerGridInfo,
      };

      // const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*',
      //   },
      //   success(data) {
      //     //console.log(data);
      //     res = data;
      //     return res;
      //   },
      //   error() {},
      // });
      // // this.priceProviders = res;
      // return res;
      return await this.http.post(webMethod,parameters).toPromise().then((data: any) => {
        return data;
      }).catch(error => {
        console.log(error);
      });
      // return await response.toPromise();
    } catch (error) {
      //console.log('Error:', error);
    }
  }


  async GetClientProdDetails(BookName: any) {
    // const webMethod = this.interfaceUrl + 'GetClientProdDetails';
    const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetClientProdDetails';
    const parameters = {
      BookName: "",
      LoginID: AppConfig.settings.oRes.groupID,
      EntityID: AppConfig.settings.oRes.homeEntityID,
    };
    // const that = this;
    // const response = '';
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*',
    //   },
    //   success(data) {
    //     that.GetClientProdDetailsArr = data.Get_Client_Prod_details_APIResult;
    //     return that.GetClientProdDetailsArr;
    //   },
    //   error() {},
    // });
    // return this.GetClientProdDetailsArr;
    const response = this.http.post(webMethod,parameters);
    return await response.toPromise();
  }

  setUserGroupID(userGroupID: string) {
    this.userGroupID = userGroupID;
  }

  setUserGroup(userGroup: string) {
    this.userGroup = userGroup;
  }

  setportfolioGroupID(portfolioGroupID: string) {
    this.portfolioGroupID = portfolioGroupID;
  }

 async BBVASaveQuotes(
    Mode: any,
    strXml: any,
    PortFolioName: any,
    PortFolioIDInput: any,
    Type: any,
    Owner: any
  ) {
    try {
      this.UserID = AppConfig.settings.oRes.userID;
      // const webMethod = this.interfaceUrl + 'BBVASaveQuotes';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Portfolio/InsertPortfolio'
      const parameters = {
        UserID: this.UserID,
        PortFolioName: PortFolioName,
        Type: Type,
        strXml: strXml,
        Mode: Mode,
        PortFolioIDInput: PortFolioIDInput,
        Owner: Owner  
      };

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        
        return data;
      });
      
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async BBVAGetPortfolioDetails(PortFolioID: any) {
    try {
      this.UserID = AppConfig.settings.oRes.userID;
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Portfolio/GetPortfolio';
      const parameters = {
        UserID: this.UserID,
        Portfolio_ID: String(PortFolioID),
        Type: ""
      };

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data;
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async BBVADeletePortfolio(PortFolio_ID: any, Type: any) {
    try {
      
      this.UserID = AppConfig.settings.oRes.userID;
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Portfolio/DeletePortfolio';
      const parameters = {
        UserID: this.UserID,
        Portfolio_ID: PortFolio_ID,
        Type: ""
      };

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        
        return data;
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async getPortfolioSharingList(PortfolioID: any) {
    const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Portfolio/GetPortfolioSharingList';
    const parameters = {
      PortfolioID,
    };

    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      return data;
    });
  }

  async InsertPortfolioSharing(
    CreatedBy: any,
    GroupEdit: any,
    GroupView: any,
    PortfolioID: any,
    UserEdit: any,
    UserView: any,
    GroupDelete: any,
    UserDelete: any
  ) {
    try{
    this.UserID = AppConfig.settings.oRes.userID;
    //this.UserID = this.commonfunctions.getLoggedInUserName()[0].UserId;
    const webMethod = AppConfig.settings.apiBaseUrl+ 'eqd/Portfolio/InsertPortfolioSharing';
    // let res: any;
    const parameters = {
      CreatedBy,
      GroupEdit,
      GroupView,
      PortfolioID:PortfolioID.toString(),
      UserEdit,
      UserView,
      GroupDelete,
      UserDelete,
      UserID:this.UserID
    };
    // const that = this;
    // const response = '';
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*',
    //   },
    //   success(data) {
    //     res = data;
    //     // that.MappedUsersAndGroupsArr = data.getMappedUsersAndGroupsResult;
    //   },
    //   error(_error) {},
    // });
    // return res;
    const response = this.http.post(webMethod,parameters);
    return await response.toPromise();
  }catch(error){
  }
  }

  async BBVACheckNotional(Product: any, Ccy: any) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/FetchProductCurrencyMinMaxLimits';
      const parameters = {
        Product,
        Ccy,
        PriceProvider:'BBVA'
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data;
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async reofferValidation(IssuePrice: any, ReofferPrice: any, ProductType: any, WrapperType: any) {
    try {
      this.UserID = AppConfig.settings.oRes.userID;
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/ValidateReOfferPrice';
      const parameters = {
        IssuePrice: IssuePrice === '' ? '0' : IssuePrice,
        ReOfferPrice: ReofferPrice === '' ? '0' : ReofferPrice,
        ProductType,
        WrapperType,
        EntityId: AppConfig.settings.oRes.homeEntityID
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data.Result;
      });

    } catch (error) {
      //console.log('Error:', error);
    }
  }
  async noncallValidation(NonCallValue: any, TenorExpiryDate: any, frequency: any) {
    try {
      this.UserID = AppConfig.settings.oRes.userID;
      const webMethod = AppConfig.settings.apiBaseUrl+ 'eqd/ValidateNonCallValue';
      const parameters = {
        NonCallValue: NonCallValue,
        Tenor :TenorExpiryDate ,
        frequency: frequency
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data.Result;
      });
    } catch (error) {
    }
  }

  async attachDetachCalculations(attach, detach) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'Calculate/CalculateCreditNominal';
      const parameters = {
        attach: attach,
        IndexCode: "",
        detach: detach
      };
      await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.attachDetachCalculationsSF.next(data);
      })

    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async BBVAValidateRFQTime(underlyingCode: any) {
    try {
      let RFQTimeFlag = [];
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/ValidateRFQTimeForCreditTranch';
      const parameters = {
        underlyingCode,
      };
      // const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*',
      //   },
      //   success(data) {
      //     // //console.log(data);
      //     RFQTimeFlag = data.ValidateRFQTimeForCreditTranchResult;
      //   },
      //   error(_error) {},
      // });
      // this.RFQTimeFlag = RFQTimeFlag;
      // return this.RFQTimeFlag;
      const response = this.http.post(webMethod,parameters);
      return await response.toPromise();
    } catch (error) {
      //console.log('Error:', error);
    }
  }

 async getAttachPercent(attachVal, indexCode, _index) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'Calculate/CreditAttachPercentage';
      const parameters = {
        attach: attachVal,
        IndexCode: indexCode,
        detach: 0
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data;
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

 async getDetachPercent(detachVal, indexCode, _index) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'Calculate/CreditDetachPercentage';
      const parameters = {
        attach: 0,
        IndexCode: indexCode,
        detach: detachVal
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data;
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  //Modified by Sudarshan P|| 20-Apr-2023
  async termsheetSender(
    ppID,
    RFQID,
    TemplateCode,
    docLang,
    docCountry
  ) {
    try {
     
      const webMethod = AppConfig.settings.apiBaseUrl + 'doc/IndicativeTermsheetRequest';
      // const parameters = {
      //   bbvaID: bbvaID,
      //   productCode: productCode,
      //   subTemplateCode: subTemplateCode,
      //   userGroupID: userGroupID,
      //   ppcode: type,
      //   entityID: AppConfig.settings.oRes.homeEntityID,
      // };
      const parameters = {
        "refID": RFQID,
        "ppCode": ppID,
        "documentLanguage": docLang,
        "documentCountry": docCountry,
        "documentType": "Indicative_Termsheet", // Sudarshan | changed Indicative_Termsheet  from IndicativeTermsheet 
        "interfaceDealType": "RFQELN",
        "loginID": AppConfig.settings.oRes.userID,
        "templateCode": TemplateCode  //Changes by Apurva K|| 20-Apr-2023|| As discussed with Arshin S
      }
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data;
      });
      
    } catch (error) {
      return null;
      //console.log('Error:', error);
    }
  }

  async KIDSender(
    ppID,
    RFQID,
    TemplateCode,
    docLang,
    docCountry
  ) {
    try {
     
      const webMethod = AppConfig.settings.apiBaseUrl + 'doc/KidRequest';
      // const parameters = {
      //   bbvaID: bbvaID,
      //   productCode: productCode,
      //   subTemplateCode: subTemplateCode,
      //   userGroupID: userGroupID,
      //   ppcode: type,
      //   entityID: AppConfig.settings.oRes.homeEntityID,
      // };
      const parameters = {
        "refID": RFQID,
        "ppCode": ppID,
        "documentLanguage": docLang,
        "documentCountry": docCountry,
        "documentType": "KID",
        "interfaceDealType": "RFQELN",
        "loginID": AppConfig.settings.oRes.userID,
        "templateCode": TemplateCode  //Changes by Apurva K|| 20-Apr-2023|| As discussed with Arshin S
      }
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data;
      });
      
    } catch (error) {
      return null;
      //console.log('Error:', error);
    }
  }

  async ViewTermsheet(NoteMasterID: any, EventName: any = 'IndicativeTermsheet') {
    try {
      const webMethod =AppConfig.settings.apiBaseUrl + 'eqd/Document/GetAttachedDocuments';
      const parameters = {
        DealNo: NoteMasterID,
        EventName: EventName
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data;
      });
    } catch (error) {
      return null;
      //console.log(error);
    }
  }

  async GetTriggerValues(
    Tenor: any,
    Frequency: any,
    Trigger: any,
    StepDown: any,
    NonCall: any
  ) {
    try {
      let TriggerValues = [];
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetTriggerValues';
      const parameters = {
        Tenor : Tenor.toString(), // changed by Jyoti S || 14-Apr-2023
        Frequency,
        Trigger,
        StepDown,
        NonCall,
      };

      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*',
      //   },
      //   success(data) {
      //     TriggerValues = data;
      //   },
      //   error(_error) {},
      // });
      // return TriggerValues;
      const response = this.http.post(webMethod,parameters);
      return await response.toPromise();
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async SchedulePrice(
    productVariation: any,
    productXML: any,
    scheduleTime: any,
    Source: any,
    GroupingID: any,
    TimeOffsetInSecs: any,
    PPCode: any,
    SolveFor: any,
    userGroupID: any
  ) {
    try {
      let res: any;

      const webMethod = AppConfig.settings.apiBaseUrl+ 'eqd/Order/InsertProductSchedule';
      const parameters = {
        productVariation,
        productXML,
        scheduleTime,
        UserID: AppConfig.settings.oRes.userID,
        Source,
        GroupingID,
        TimeOffsetInSecs,
        PPCode,
        EntityID: AppConfig.settings.oRes.homeEntityID,
        SolveFor,
        UserGroupID: userGroupID, //(this.commonfunctions.getLoggedInUserName())[2].UserGroupId
      };
      // const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*',
      //   },
      //   success(data) {
      //     res = data;
      //     return res;
      //   },
      //   error(_error) {},
      // });
      // return res;
      const response = this.http.post(webMethod,parameters);
      return await response.toPromise();
    } catch (error) {
      //console.log('Error:', error);
    }
  }

// Changes by Yash Agrawal
 async quoteEmail(RFQ_ID) {
    try {
      let res: any;

      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Quote/InsertRFQGroupEmailNotification';
      const parameters = {
        // Login_ID:AppConfig.settings.oRes.userID,
        // Entity_ID:AppConfig.settings.oRes.homeEntityID,
        "userID": AppConfig.settings.oRes.homeEntityID,
        "RFQID": RFQ_ID,
        "bestPriceSingleLP": 'SINGLECPTY',
      };
      
      return await this.http.post(webMethod,parameters).toPromise().then((data: any) => {
        return data;
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  // End Changes by Yash Agrawal

//Changes done by Jyoti S || 09-Aug-2023 || HSBCECCLI-28 || START
  async getAuditTrailRFQData(
    pageNo: number,
    pageSize: number,
    productType: string,
    searchRFQID: string,
    fromDate: string,
    toDate: string,
    mode : string
  ) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + "eqd/GetAuditTrailRFQData";
      const parameters={
        pageNo,
        pageSize,
        productType,
        searchRFQID,
        fromDate,
        toDate,
        Entity_id:AppConfig.settings.oRes.homeEntityID,
        User_ID:AppConfig.settings.oRes.userID,
        Mode: mode,
      }
      //Changes done by Jyoti S || 09-Aug-2023 || HSBCECCLI-28 || END
      // let response: any;
      // pageSize = 1000; //Added by Apurva C || 15-Nov-2021
      // try {
      //   $.ajax({
      //     async: false,
      //     crossDomain: true,
      //     type: 'POST',
      //     url: webMethod,
      //     data: JSON.stringify({
      //       PageSize: pageSize,
      //       PageNo: pageNo,
      //       ProductType: productType,
      //       SearchKey: searchRFQID,
      //       FromDate: fromDate,
      //       ToDate: toDate,
      //       "Entity_id": AppConfig.settings.oRes.homeEntityID, //4
      //       "User_ID": AppConfig.settings.oRes.userID,
      //       "Mode": (this.commonfunctions.getLoggedInUserName())[3].Usertype,
      //     }),
      //     contentType: "application/json; charset=utf-8",
      //     dataType: 'json',
      //     headers: {
      //       'Cache-Control': 'no-cache',
      //       'Access-Control-Allow-Origin': '*'
      //     },
      //     success(data) {
      //       response = data;
      //     }, error(_error) {
      //       //console.log(error);
      //     }
      //   });
      // } catch (error) {
      //   //console.log(error);
      // }
      // return response;
      const response = this.http.post(webMethod,parameters);
      return await response.toPromise();
    } catch (error) {

    }

  }

  getAuditTrailQuoteData(rfqId: string) {
    // const webMethod = this.interfaceUrl + "GetAuditTrailQuoteData"
    const webMethod = AppConfig.settings.apiBaseUrl + "eqd/GetAuditTrailQuoteData";
    // let response: any;
    const requestParams = {
      "RFQID": rfqId
    }

    try {
      return this.http.post(webMethod, requestParams).toPromise();
    } catch (error) {
      console.log(error);

    }

    // try {
    //   $.ajax({
    //     async: false,
    //     crossDomain: true,
    //     type: 'POST',
    //     url: webMethod,
    //     data: JSON.stringify({
    //       RFQID: rfqId
    //     }),
    //     contentType: "application/json; charset=utf-8",
    //     dataType: 'json',
    //     headers: {
    //       'Cache-Control': 'no-cache',
    //       'Access-Control-Allow-Origin': '*'
    //     },
    //     success(data) {
    //       response = data;
    //     }, error(error) {
    //       console.log(error);
    //     }
    //   });
    // } catch (error) {
    //   //console.log(error);
    // }
  }

  getAuditTrailProductData(quoteId: string, subscription: boolean) {
    // const webMethod = this.interfaceUrl + "GetAuditTrailProductData";
    const webMethod = AppConfig.settings.apiBaseUrl + "eqd/GetAuditTrailProductData";
    //let response: any;
    const requestParams = {
           QuoteID: quoteId,
           Subscriptions: subscription
    }
    try {
      return this.http.post(webMethod, requestParams).toPromise();
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify({
      //     QuoteID: quoteId,
      //     Subscriptions: subscription
      //   }),
      //   contentType: "application/json; charset=utf-8",
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     response = data;
      //   }, error(_error) {
      //     //console.log(error);
      //   }
      // });
    } catch (error) {
      console.log(error);
    }
    //return response;
  }

  GetAuditTrailTimelineData(rfqId: string, quoteId: string) {
    // const webMethod = this.interfaceUrl + "GetAuditTrailTimelineData";
    const webMethod = AppConfig.settings.apiBaseUrl + "eqd/GetAuditTrailTimelineData";
    const requestParams = {
      RFQID: rfqId,
      QuoteID: quoteId,
    }
    // let response: any;
    try {
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: "POST",
      //   url: webMethod,
      //   data: JSON.stringify({
          // RFQID: rfqId,
          // QuoteID: quoteId,
      //   }),
      //   contentType: "application/json; charset=utf-8",
      //   dataType: "json",
      //   headers: {
      //     "Cache-Control": "no-cache",
      //     "Access-Control-Allow-Origin": "*",
      //   },
      //   success(data) {
      //     response = data;
      //   },
      //   error(_error) {
      //     //console.log(error);
      //   },
      // });
      return this.http.post(webMethod, requestParams).toPromise();
    } catch (error) {
      console.log(error);
    }
    // return response;
  }

  /////////////////////////////// Backtest api start - added by Priya L. on 09-Aug-2021 ///////////////////////////////////////////////////////////

  // Fetch template ID based on Note Master ID
  async GetTemplateIDFromNMID(NoteMasterID) {
    try {
      let res: any;


      const webMethod = this.interfaceUrl + 'GetTemplateIDFromNMID';
      // const webMethod = AppConfig.settings.apiBaseUrl + 'GetTemplateIDFromNMID';
      const parameters = {
        NoteMasterID
      }
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     res = data.GetTemplateIDFromNMIDResult;
      //     return res;
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        res = data.GetTemplateIDFromNMIDResult;
        return res;
      })

      // return res;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // Get Product Info
  async GetProductInfo(NoteMasterID, TemplateID) {
    try {
      let res: any;


      const webMethod = this.interfaceUrl + 'GetProductInfo';
      // const webMethod = AppConfig.settings.apiBaseUrl + 'GetProductInfo';
      const parameters = {
        NoteMasterID,
        TemplateID
      }
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     res = data.GetProductInfoResult;
      //     return res;
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        res = data.GetProductInfoResult;
        return res;
      }).catch(error => {
        console.log(error);

      })

      // return res;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // Get Number of test cases and start date
  async GetNumberOfTestCasesAndStartDate(NoteMasterID, TemplateID, NumberOfTestcases, StartDate) {
    try {
      let res: any;


      const webMethod = this.interfaceUrl + 'GetNumberOfTestCasesAndStartDate';
      // const webMethod = AppConfig.settings.apiBaseUrl + 'GetNumberOfTestCasesAndStartDate';
      const parameters = {
        NoteMasterID,
        TemplateID,
        NumberOfTestcases,
        StartDate
      }
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     res = data.GetNumberOfTestCasesAndStartDateResult;
      //     return res;
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        res = data.GetNumberOfTestCasesAndStartDateResult;
        return res;
      })

      // return res;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // Get multiple backtest data
  async WhatIfMultipleBackTest(NoteMasterID, TemplateID, NoOfTestCases, StartDate) {
    try {
      let res: any;


      const webMethod = this.interfaceUrl + 'WhatIfMultipleBackTest';
      // const webMethod = AppConfig.settings.apiBaseUrl + 'WhatIfMultipleBackTest';
      const parameters = {
        NoteMasterID,
        TemplateID,
        NoOfTestCases,
        StartDate,
        EntityID: AppConfig.settings.oRes.homeEntityID,
        AssetClass: 'EQ'
      }
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     res = data.WhatIfMultipleBackTestResult;
      //     return res;
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        res = data.WhatIfMultipleBackTestResult;
        return res;
      }).catch(error => {
        console.log(error);
      });

      // return res;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  /////////////////////////////// Backtest api end - added by Priya L. on 09-Aug-2021 ///////////////////////////////////////////////////////////

  // Get EntityCode
  async GetEntityCode() {
    try {
      // let res: any;


      // const webMethod = this.interfaceUrl + 'GetEntityCode';
      const webMethod = AppConfig.settings.apiBaseUrl + 'news/PublishNews/GetEntityCode';
      const parameters = {
        "loginId": AppConfig.settings.oRes.userID,
      }
      // const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'text',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     //console.log(data);
      //     res = data;
      //     return res;
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });

      // return res;
      return await this.http.post(webMethod, parameters).toPromise();
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // Get Common Data api  - added by Priya L. on 14-Sep-2021
  async GetCommonDataEuroConnect(TemplateCode: string) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/Details/GetCommonData';
      const parameters = {
        TemplateCode: TemplateCode,
        EntityId: AppConfig.settings.oRes.homeEntityID
      }
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        this.commonData = data;
        return data;
       });
    } catch (error) {
      //console.log('Error:', error);
    }
  }


  // Fetch Default value - added by Priya L. on 16-Sep-2021
  async FetchDefaultValues(template_code) {
    try {
      // let res: any;
      // const webMethod = this.interfaceUrl + 'FetchDefaultValues';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/FetchEQCEuropeDefaultValues';
      const parameters = {
        template_code
      }

      const resp = await this.http.post(webMethod, parameters).toPromise();
      return resp;
      // const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     res = data.FetchDefaultValues_EQCEuropeResult;
      //     return res;
      //   },
      //   error(error) {
      //   console.log(error);
      //     // return error;
      //   }
      // });

      // return res;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // Get Accrual Days - added by Priya L. on 17-Sep-2021
  async GetNoOfDays(strExchange: any, Tenor: any, strTenorType: any, strBase_Ccy: any, strSettleFrequency: any) {
    try {
      // let res: any;
      // const webMethod = this.interfaceUrl + 'GetNoOfDays';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Dates/GetNoOfDays';
      const parameters = {
        strExchange,
        Tenor,
        strTenorType,
        strBase_Ccy,
        strEntityID: AppConfig.settings.oRes.homeEntityID,
        strSettleFrequency
      }
      // const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     res = data.GetNoOfDaysResult;
      //     return res;
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });

      // return res;
      return await this.http.post(webMethod, parameters).toPromise();
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // Get Share Info - added by Priya L. on 17-Sep-2021
  GetSharesInfo(ShareCode: any) {
    try {
      // let res: any;
      // const webMethod = this.interfaceUrl + 'GetSharesInfo';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetShareInfo';
      const parameters = {
        'ShareName':ShareCode
      }
      // const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     res = data;
      //     return res;
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });

      // return res;
      this.http.post(webMethod, parameters).toPromise();
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // changes by Suvarna P || 22Apr2022 || GetSharesInfo chnaged to GetShareRate || assigned by Pranav D
  async GetShareRate(ShareCode: any, ddlNoteCcy : any) {
    try {
      // let res: any;
      // const webMethod = this.interfaceUrl + 'GetSharesInfo';
      // const webMethod = this.interfaceUrl + 'GetShareRate';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetShareRate';
      const parameters = {
        // ShareCode
        // "strPair" : "AMZN.OQ - USD"
        "Pair" : ShareCode + " - " + ddlNoteCcy
      }
      // const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     res = data;
      //     //console.log(res);
      //     return res;
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });

      // return res;
      return await this.http.post(webMethod, parameters).toPromise();
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  // Redirect Validation Check Api - added by Priya L. on 07-Oct-2021
  async RedirectOrderValidationChecks(rmName: any, orderType: any, limitPrice: any, clientYield: any, upfront: any, solveFor: any, issuerName: any, issuerPrice: any, token: any,
    product: any, notional: any, underlying: any, underlyingCcy: any, QuantoCcy: any, tenor: any) {
    try {
      const webMethod = this.interfaceUrl + 'eqd/Order/RedirectOrderValidationChecks';
      // const webMethod = AppConfig.settings.apiBaseUrl + 'RedirectOrderValidationChecks';
      const parameters = {
        userName: AppConfig.settings.oRes.userID,
        entityID: AppConfig.settings.oRes.homeEntityID,
        rmName,
        orderType,
        limitPrice,
        clientYield,
        upfront,
        solveFor,
        issuerName,
        issuerPrice,
        token,
        product,
        notional,
        underlying,
        underlyingCcy,
        QuantoCcy,
        tenor,
        UserGroup: AppConfig.settings.oRes.groupID,
        IsRMLogin:  AppConfig.settings.oRes.groupID.includes("RM") ? "Y" :"N",
        CustomerCode: "",
        CustomerGrp: "",
        CustomerType: "",
      }
      //const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'text',//'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     //console.log(data);
      //     res = JSON.parse(data);
      //     //console.log(res);
      //     return res;
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data;
      }).catch(error => {
        console.log(error);
      });

      // return res;
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  //Addedby ApurvaK for Add attachment feature
  // addAttachment(DocumentID: any, DocumentName: any, byteData: any, DocumentFileType: any, NoteMasterID: any, CreatedAt: any, CreatedBy: any) {
  async addAttachment(objAttachDoc) {
    try {
      // //console.log(DocumentFileType);
      // const webMethod = this.interfaceUrl + 'AttachDocument';
      if(objAttachDoc.length>0){
        objAttachDoc.forEach(item=> item.EntityID = AppConfig.settings.oRes.homeEntityID);
      }
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Document/UploadDocument';
      const parameters = objAttachDoc;
      return await this.http.post(webMethod, parameters).toPromise().then(data => {
        return data;
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async getPayOffList(): Promise<any> {
    try {

      let asseturl = 'assets/';

      // let entityWisePayOffList = ['AutocallablePhoenix', 'ReverseConvertible', 'CreditTranche', 'Participation', 'EQC_Europe', 'YieldEnhancement', 'DiscountCertificates', 'Accumulator', 'Decumulator'];
      let entityWisePayOffList: any = ['AutocallablePhoenix', 'ReverseConvertible', 'CreditTranche', 'Participation', 'EQC_Europe', 'YieldEnhancement', 'DiscountCertificates', 'ACC', 'DAC', 'CustomStrategy'];

      let payOffList = [
      {
        'name': 'EQC_Europe',
        'displayName': 'Autocallable',
        'auditTProductType' : 'EQC_Europe',
        'prevQuoteProductName' : 'EQC_Europe', //Prev Quotes
        'Product' : 'Autocallable' ,
        'multiProductName' : 'AutocallablePhoenixER' ,
        'matIcon': 'dashboard',
        'singleRoute': '/EarlyRedemption',
        'multiRoute': '/MultiEarlyRedemption',
        'settingsRoute': '/SettingsAutocallable',
        'display': false,
        'accord': 5,
        'image':asseturl+'autocallable.png',
      },
      {
        'name': 'YieldEnhancement',
        'displayName': 'Yield Enhancement',
        'auditTProductType' : 'YieldEnhancement',
        'prevQuoteProductName' : 'YieldEnhancement', //Prev Quotes
        'Product' : 'Yield Enhancement' ,
        'multiProductName' : 'YieldEnhancement' ,
        'matIcon': 'dashboard_customize',
        'singleRoute': '/YieldEnhancement',
        'multiRoute': '/MultiYieldEnhancement',
        'settingsRoute': '/SettingsYield',
        'display': false,
        'accord': 6,
        'image':asseturl+'yield-enhancement.png',
      },
      {
        'name': 'CustomPayoffs',
        'displayName': 'Custom Strategy',
        'auditTProductType' : 'CustomPayoffs',
        'prevQuoteProductName' : 'CustomPayoffs',
        'Product' : 'CustomStrategy' ,
        'multiProductName' : 'CustomStrategy' ,
        'matIcon': 'dashboard_customize',
        'singleRoute': '/CustomStrategy',
        'multiRoute': '/MultiCustomStrategy',
        'settingsRoute': '/SettingsYield',
        'display': false,
        // 'display': true,  //temp
        'accord': 10,
        'image':asseturl+'customstrategy.png',
      },
      {
        'name': 'DiscountCertificates',
        'displayName': 'Discount Certificates',
        'auditTProductType' : 'DiscountCertificates',
        'prevQuoteProductName' : 'DiscountCertificates', //Prev Quotes
        'Product' : 'Discount Certificates' ,
        'multiProductName' : 'DiscountCertificate' ,
        'matIcon': 'grid_view',
        'singleRoute': '/DiscountCertificates',
        'multiRoute': '/MulitiDiscountCertificates',
        'settingsRoute': '/SettingsDC',
        'display': false,
        'accord': 7
      },
      {
        'name': 'Participation',
        'displayName': 'Participation',
        'auditTProductType' : 'Participation',
        'prevQuoteProductName' : 'Participation', //Prev Quotes
        'Product' : 'Participation' ,
        'multiProductName' : 'Participation' ,
        'matIcon': 'description',
        'singleRoute': '/Participation',
        'multiRoute': '/MultiParticipation',
        'settingsRoute': '/SettingsParticipation',
        'display': false, // temp done by Jyoti S || to be removed || 17-Apr-2023
        'accord': 4,
        'image':asseturl+'Participation.png', //Added by Jyoti S || 17-Apr-2023
      },
      {
        // 'name': 'Accumulator',
        'name': 'ACC',
        'displayName': 'Accumulator',
        'auditTProductType' : 'ACC',
        'prevQuoteProductName' : 'Accumulator', //Prev Quotes
        'Product' : 'Accumulator' ,
        'multiProductName' : 'Accumulator' ,
        'matIcon': 'trending_up',
        'singleRoute': '/AQ',
        'multiRoute': '/MultiAccu',
        'settingsRoute': '/SettingsAccum',
        'display': false,
        'accord': 8,
        'image':asseturl+'accumulator.png',
      },
      {
        // 'name': 'Decumulator',
        'name': 'DAC',
        'displayName': 'Decumulator',
        'auditTProductType' : 'DAC',
        'prevQuoteProductName' : 'Decumulator', //Prev Quotes
        'Product' : 'Decumulator' ,
        'multiProductName' : 'Decumulator' ,
        'matIcon': 'trending_down',
        'singleRoute': '/DQ',
        'multiRoute': '/MultiDecu',
        'settingsRoute': '/SettingsDecum',
        'display': false,
        'accord': 9,
        'image':asseturl+'decumulator.png',
      },
      {
        'name': 'AutocallablePhoenix',
        'displayName': 'Autocall',
        'auditTProductType' : 'AutocallablePhoenix', //AuditTrail, RMW, Landing Page
        'prevQuoteProductName' : 'AutocallablePhoenix', //Prev Quotes
        'Product' : 'Autocall Phoenix' ,
        'multiProductName' : 'AutocallablePhoenix' ,
        'matIcon': 'widgets',
        'singleRoute': '/Phoenix',
        'multiRoute': '/MultiPhoenix',
        'settingsRoute': '/SettingsAuocall',
        'display': false,
        'accord': 1
      },
      {
        'name': 'ReverseConvertible',
        'displayName': 'Reverse Convertible',
        'auditTProductType' : 'ReverseConvertible',
        'prevQuoteProductName' : 'ReverseConvertible', //Prev Quotes
        'Product' : 'Reverse Convertible' ,
        'multiProductName' : 'ReverseConvertible' ,
        'matIcon': 'aspect_ratio',
        'singleRoute': '/BRC',
        'multiRoute': '/MultiBRC',
        'settingsRoute': '/SettingsRC',
        'display': false,
        'accord': 2
      },
      {
         //Added by Apurva K
        'name': 'CreditTranche',
        'displayName': 'Credit Tranche',
        'auditTProductType' : 'CreditTranche',
        'prevQuoteProductName' : 'CreditTranche', //Prev Quotes
        'Product' : 'Credit Tranche' ,
        'multiProductName' : 'CreditTranche' ,
        'matIcon': 'card_giftcard',
        'singleRoute': '/Credit',
        'multiRoute': '/MultiCredit',
        'settingsRoute': '/SettingsCT',
        'display': false,
        'accord': 3
      },
      {
        //Added by Apurva K
        'name': 'CreditLinkedNote',    
        'displayName': 'Credit Linked Note',
        'auditTProductType' : 'CreditLinkedNote',
        'prevQuoteProductName' : 'CreditLinkedNote', 
        'Product' : 'Credit Tranche' ,
        'multiProductName' : 'CreditLinkedNote' ,
        'matIcon': 'card_giftcard',
        'singleRoute': '/CreditLinkedNote',
        'multiRoute': '/MultiCreditLinkedNote',
        'settingsRoute': '/SettingsCT',
        'display': false,
        'accord': 11
      },
      {
        //Added by Apurva K
        'name': 'DualCurrencyNote',    
        'displayName': 'Dual Currency Note',
        'auditTProductType' : 'DualCurrencyNote',
        'prevQuoteProductName' : 'DualCurrencyNote', 
        'Product' : 'Dual Currency Note' ,
        'multiProductName' : 'DualCurrencyNote' ,
        'matIcon': 'card_giftcard',
        'singleRoute': '/DualCurrencyNote',
        'multiRoute': '/MultiDualCurrencyNote',
        'settingsRoute': '/SettingsDCN',
        'display': false,
        'accord': 11
      },

      // Added by SandipA || 12-Oct-23
      {
        'name': 'RatesSteepener',
        'displayName': 'Steepener',
        'auditTProductType' : 'Steepener',
        'prevQuoteProductName' : 'Steepener', //Prev Quotes
        'Product' : 'Steepener' ,
        'multiProductName' : 'Steepener' ,
        'matIcon': 'card_giftcard',
        'singleRoute': '/Steepener',
        'multiRoute': '/Steepener',
        'settingsRoute': '/SettingsCT',
        'display': false,
        'accord': 12
      },
      {
        'name': 'RatesCapsFloors',
        'displayName': 'Caps & Floors',
        'auditTProductType' : 'CapsFloors',
        'prevQuoteProductName' : 'CapsFloors', //Prev Quotes
        'Product' : 'Caps & Floors' ,
        'multiProductName' : 'CapsFloors' ,
        'matIcon': 'card_giftcard',
        'singleRoute': '/CapsFloors',
        'multiRoute': '/CapsFloors',
        'settingsRoute': '/SettingsCT',
        'display': false,
        'accord': 12
      },
      
      
      ]
      entityWisePayOffList =  await this.GetDealEntryUSAM();
      // entityWisePayOffList = ['AutocallablePhoenix','YieldEnhancement', 'DiscountCertificates', 'Accumulator', 'Decumulator'];
      // entityWisePayOffList = ['AutocallablePhoenix','YieldEnhancement', 'DiscountCertificates', 'ACC', 'DAC'];
      // entityWisePayOffList = ['AutocallablePhoenix', 'EQC_Europe', 'ACC', 'DAC','YieldEnhancement', 'DiscountCertificates'];

      payOffList.forEach(payOff => {
        if (entityWisePayOffList.includes(payOff.name)) {
          payOff.display = true;
        }
      });

      this.payOffList = payOffList;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  async GetDealEntryUSAM() {
    try {

      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetDealEntryUSAM';
      let res: any;
      const parameters = {
        USAM_Type: "Entity",
        USAM_Target_Value: AppConfig.settings.oRes.homeEntityID
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        res = data.DealEntryUSAMResponse;
        //res =  res.concat(',DualCurrencyNote');
        return res;
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  
  // Added by ApurvaK for viewAttachment on workbench| 24 Nov 2021| Start
  async viewAttachment(NoteMasterID: any): Promise<any[]> {
    try {
      let blobstr: any = [];
      // const webMethod = this.interfaceUrl + 'ViewAttachment';
      const webMethod = this.interfaceUrl + 'eqd/Document/GetDocuments';
      const parameters = {
        NoteMasterID: NoteMasterID
      };
      await this.http.post(webMethod, parameters).toPromise().then(data => {
        blobstr = data;
        return blobstr;
      })
      
    } catch (error) {
      return null;
      //console.log(error);
    }
  }
  // Added by ApurvaK for viewAttachment on workbench| 24 Nov 2021| End

  // Added by Suvarna for showCustomerConfig | 05 Dec 2021| Start
  /*
  showCustomerConfig = [];
  GetEntityConfig(Setting_Name: any) {
    try {
      const webMethod = this.interfaceUrl + 'GetEntityConfig';
      const parameters = {
        "Entity_Id" : AppConfig.settings.oRes.homeEntityID, //"3",
        "Setting_Name" : Setting_Name , //"EQC_Allow_BasketELN_YN"
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
          'Access-Control-Allow-Origin': '*'
        },
        success(data) {
          // blobstr = (data.GetDocumentsResult[0]);
          //console.log(data);
          that.showCustomerConfig = data.GetEntityConfigResult
        },
        error(error) {
        }
      });
      return this.showCustomerConfig;
    } catch (error) {
      return null;
      //console.log(error);
    }
  }
  */
  // Added by SuvarnaP for showCustomerConfig| 05 Dec 2021| End

  // showCustomerConfig = [];
  async checkLoginBookName() {
    try {
      let checkLoginBookNameResult = false;
      // const webMethod = this.interfaceUrl + 'checkLoginBookName';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/checkLoginBookName';
      const parameters = {
        "LoginID" : AppConfig.settings.oRes.userID,
        "BookName" : 'MASTERDEALER'
      };
      // const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     //console.log(data);
      //     checkLoginBookNameResult = data.checkLoginBookNameResult
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });
      // return checkLoginBookNameResult;
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
         
        return data?.Status.toLowerCase() == "success" ? true : false ;
      })
      //this.checkLoginBookNameResult =checkLoginBookNameResult

    } catch (error) {
      // return null;
      //console.log(error);
    }
  }

  // Pending http conversion: api not deployed
  // Get Payment History Data  - added by Priya L. on 13-Dec-2021
  async PayHistByProdData(NoteMasterID: any) {
    try {
      let res: any;
      const webMethod = this.interfaceUrl + 'PayHistByProdData';
      // const webMethod = AppConfig.settings.apiBaseUrl + 'PayHistByProdData';
      const parameters = {
        NoteMasterID
      }
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     res = data;
      //     return res;
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        res = data;
        return res;
      }).catch(error => {
        console.log(error);
      });

      // return res;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // Pending http conversion: api not deployed
  async DB_MTMHist_Data(NoteMasterID) {
    try {
      var MTMHistData = [];
      const webMethod = this.interfaceUrl + 'DB_MTMHist_Data';
      // const webMethod = AppConfig.settings.apiBaseUrl + 'DB_MTMHist_Data';
      const parameters = {
        "NoteMasterID": NoteMasterID,
      };
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data: any) {
      //     //console.log(data);
      //     MTMHistData = data;
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        MTMHistData = data;
        return MTMHistData;
      }).catch(error => {
        console.log(error);
      });

      // return MTMHistData;
    } catch (error) {
      return null;
      //console.log(error);
    }
  }


    EditPoolDetails(
      //    this.Issuer,
      AdvisoryReason,
      BookingBranch,
      ClientPrice,
      ClientYield,
      ConfirmReason,
      LimitPrice1,
      LimitPrice2,
      LimitPrice3,
      LimitPrice4,
      Margin,
      OrderComment,
      OrderType,
      PoolID,
      PreTradeXml,
      QuoteRequestId, // QuoteRequestId = //"1025750",
      RMEmailIdforOrderConfirm, // RMEmailIdforOrderConfirm =
      RMNameforOrderConfirm,
      RedirectOrderID,
      orderQuantity,
      token,
      PoolYN, //:"Y",
      MaxNotional, //:"1000000",
      MinNotional, //:"300000",
      MinOrderSize, //:"100",
      CloseDate, //:"19-Mar-2021",
      StartDate, //18-Mar-2021",
      Denomination, //:"100"
      Summary,
      ProductName,
      MinMaxCoupon,
      Remarks,
      EditPoolYN,
      NotemasterID
    ) {

      try {
        // let res: any;
        //console.log('in EditPoolDetails');

        // const webMethod = this.interfaceUrl + 'EditPoolDetails';
        const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Order/EditPoolDetails';
        const parameters = {

          AdvisoryReason,
          BookingBranch,
          ClientPrice,
          ClientYield,
          ConfirmReason,
          LimitPrice1,
          LimitPrice2,
          LimitPrice3,
          LimitPrice4,
          Margin,
          OrderComment,
          OrderType,
          PoolID,
          PreTradeXml,
          QuoteRequestId, // QuoteRequestId = //"1025750",
          RMEmailIdforOrderConfirm, // RMEmailIdforOrderConfirm =
          RMNameforOrderConfirm,
          RedirectOrderID,
          orderQuantity,
          token,
          "userName": AppConfig.settings.oRes.userID, //"Dealer1",
          PoolYN, //:"Y",
          MaxNotional, //:"1000000",
          MinNotional, //:"300000",
          MinOrderSize, //:"100",
          CloseDate, //:"19-Mar-2021",
          StartDate, //18-Mar-2021",
          Denomination, //:"100"
          Summary,
          ProductName,
          MinMaxCoupon,
          Remarks,
          EditPoolYN,
          NotemasterID
        }
        return this.http.post(webMethod, parameters).toPromise();
        // const that = this;
        // $.ajax({
        //   async: false,
        //   crossDomain: true,
        //   type: 'POST',
        //   url: webMethod,
        //   data: JSON.stringify(parameters),
        //   contentType: 'application/json; charset=utf-8',
        //   dataType: 'json',
        //   headers: {
        //     'Cache-Control': 'no-cache',
        //     'Access-Control-Allow-Origin': '*'
        //   },
        //   success(data) {
        //     //console.log(data);
        //     res = data;
        //     return res;
        //   },
        //   error(error) {
        //     console.log(error);

        //   }
        // });
        // // this.priceProviders = res;
        // return res;
      } catch (error) {
        console.log('Error:', error);
      }
    }

  // Pending http conversion: swagger link not working
  // Added by Amogh K on 14-Dec-2021
  async getProdSchedule(NoteMasterID) {
    let res: any;
    try {
      const webMethod = this.interfaceUrl + 'GetProductSchedulefromDB_For_wiki';
      // const webMethod = AppConfig.settings.apiBaseUrl + 'GetProductSchedulefromDB_For_wiki';
      const parameters = {
        "note_master_id": NoteMasterID,
      };
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     //console.log("schedule",data.GetProductSchedulefromDB_for_wikiResult);
      //     res = data.GetProductSchedulefromDB_for_wikiResult
      //     return res;
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        res = data.GetProductSchedulefromDB_for_wikiResult;
        return res;
      }).catch(error => {
        console.log(error);
      });

      // return res;
    } catch (error) {
      return null;
      //console.log(error);
    }
  }
  // Pending http conversion: api not deployed
  // Send Order to Cpty Api - Added by Priya L on 16-Dec-2021
  async SendOrderToCpty(Note_master_ID: any, RFQID: any, token, OrderRedirectYN: any) {
    try {
      let res: any;
      const webMethod = this.interfaceUrl + 'SendOrderToCpty';//
      // const webMethod = AppConfig.settings.apiBaseUrl + 'SendOrderToCpty';//
      const parameters = {
        Entity_Id: AppConfig.settings.oRes.homeEntityID,
        RFQID,
        Note_master_ID,
        LoginID: AppConfig.settings.oRes.userID,
        TokenID: token,
        OrderRedirectYN
      }
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     res = data;
      //     return res;
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        res = data;
        return res;
      }).catch(error => {
        console.log(error);
      });

      // return res;
    } catch (error) {
      //console.log('Error:', error);
    }
  }
// Added by ApurvaK for Settings page default value xml| 29 Dec 2021| Start
  async SetEntityDefaultValues(applicationID: any, settingsType: any, xmlAutocallable:any) {
  try {
    // const webMethod = this.interfaceUrl + 'SetEntityDefaultValues';
    const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/SetEntityDefaultValues';
    const parameters = {
      Login_Id: AppConfig.settings.oRes.userName,
      Application_Id : applicationID,
      Setting_Type : settingsType,
      strxml : xmlAutocallable
    };
    // let res: any;
    //console.log(parameters);
    // const that = this;
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   success(data) {
    //     //console.log(data);
    //     res = data.SetEntityDefaultValuesResult;
    //     return res;
    //   },
    //   error(error) {
    //     console.log(error);
    //   }
    // });
    // return res;
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      return data;
    });
  } catch (error) {
    return null;
    console.log(error);
  }
}
// Added by ApurvaK for Settings page default value xml| 29 Dec 2021| End

//Added by Apurva C || Service for Popup || Settings Page |Start
async UpdateEntity(applicationID:any, id:any,minValue:any,maxValue:any,activeYN:any,CSV:any) {
  try {
    // const webMethod = this.interfaceUrl + 'UpdateEntityDefaultValues';
    const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/UpdateEntityDefaultValues';
    const parameters = {
    "Login_Id": AppConfig.settings.oRes.userID,
    "Application_Id": applicationID,
    "Control_Name": id,
    "Setting_Type":"",
    "Minvalue": minValue,
    "Maxvalue": maxValue,
    "ActiveYN":activeYN,
    "Selectedvaluecsv":CSV
    };
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {     
      return data;
    }).catch(error => {
      console.log(error);
    });
    
    //console.log("resultfromparams",parameters)
    // let res;
    // const that = this;
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   success(data) {

    //   //console.log("resultfromapifun",data.UpdateEntityDefaultValuesResult);
    //   res = data.UpdateEntityDefaultValuesResult;
    //   },
    //   error(error) {
    //     console.log(error);
    //   }
    // });
    // return res;
  } catch (error) {
    return null;
    //console.log(error);
  }
}
//Added by Apurva C || Service for Popup || Settings Page |End


  async GetEntityDefaultValues(_enityID: any, loginID: any, applicationID: any) {
    try {
      // const webMethod = this.interfaceUrl + 'GetEntityDefaultValues';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/GetEntityDefaultValues';
      const parameters = {
        Entity_Id: AppConfig.settings.oRes.homeEntityID,
        Login_Id: AppConfig.settings.oRes.userID,
        Application_Id: applicationID
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {

        return data;
      });
    } catch (error) {
      return null;
      //console.log(error);
    }
  }
  // Added by ApurvaK for Settings page default value xml| 29 Dec 2021| End

  // Pending http conversion: api not deployed
  //API call for Indicative Termsheet generation and Download -added by PriyaL on 04Mar2022 -assigned by PranavD - Start
  async GenerateDocument(NoteMasterID: any) {
    try {
      let blobstr: any = [];
      const webMethod = this.interfaceUrl + 'GenerateDocument';
      // const webMethod = this.interfaceUrl + 'GenerateDocument';
      const parameters = {
        BulkTransactionNumber: NoteMasterID,
        HomeEntityId: AppConfig.settings.oRes.homeEntityID,
        LoginId: AppConfig.settings.oRes.userID,
      };
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   // global: false,
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     blobstr = (data[0]);
      //   },
      //   error(error) {
      //     console.log(error);
      //   }

      // });

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        blobstr = (data[0]);
        return blobstr;
      }).catch(error => {
        console.log(error);
      });

      // return blobstr;
    } catch (error) {
      return null;
      //console.log(error);
    }
  }
  //API call for Indicative Termsheet generation and Download -added by PriyaL on 04Mar2022 -assigned by PranavD - Start


  // Pending http conversion: api not deployed
  async getExportExcelData(queryToSearch,
    queueid, fromDate, toDate, requestType) {
    try {
      let exportToExcelData;
      this.UserID = AppConfig.settings.oRes.userID;
      // const webMethod = this.interfaceUrl + 'getTokens';
      const webMethod = this.interfaceUrl + 'getTokensforExport';
      // const webMethod = AppConfig.settings.apiBaseUrl + 'getTokensforExport';

      const parameters = {
        // "workflowId": workflowId,
        workflowCode: 'RFQ Workflow',
        queueid,
        entityId: AppConfig.settings.oRes.homeEntityID,
        pageno: '1',
        pageSize: '1500',
        queryToSearch,
        LoginId: this.UserID,
        FromDate: fromDate,
        ToDate: toDate,
        Flag: requestType
      };
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     const parseString = require('xml2js').parseString;
      //     // tslint:disable-next-line: only-arrow-functions
      //     parseString(data.getTokensforExportResult, function (result) {
      //       that.getDataForExportToExcel((result.NewDataSet.DUMMY));
      //       exportToExcelData = (result.NewDataSet.DUMMY);
      //     });
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });
      // return exportToExcelData;

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        const parseString = require('xml2js').parseString;
        // tslint:disable-next-line: only-arrow-functions
        parseString(data.getTokensforExportResult, function (result) {
          that.getDataForExportToExcel((result.NewDataSet.DUMMY));
          exportToExcelData = (result.NewDataSet.DUMMY);
        });
      }).catch(error => {
        console.log(error);
      });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

   // news services - added by Priya L

  //hardcoded response : 1) since api was not hosted, 2) node server also returned response based on local config file
  getNewsConfig(): any {
    let result = {};
    try {
      // const webMethod = this.interfaceUrl + 'getnewsconfig';
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'GET',
      //   url: webMethod,
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     result = data;
      //   }
      // });
      result = {
        show_news_stage1_buttons: true,
        show_news_stage2_buttons: true,
        ContentHideConfig: false
    }
    } catch (error) {
      result = {};
    }
    return result;
  }






  async fetchNewsDetails(newsId, noRecords, valideFrom, validTill, tags = '', LikeValue,
    PageNumber, Popular, Recommended, RowsPerPage, SearchNews, MarketOppurtunities, EntityCode: any): Promise<any[]> {
    let result: any[] = [];
    this.UserID = AppConfig.settings.oRes.userID;
    try {
      // // //console.log('FetchNewsDetails');
      // const webMethod = this.interfaceUrl + 'FetchNewsDetails';
      const webMethod = AppConfig.settings.apiBaseUrl + 'newsURL/PublishNews/FetchNewsDetails';
      // const that = this;
      const parameters = {
        News_ID: newsId,
        NoOfRecords: noRecords,
        ValidFrom: valideFrom,
        ValidTill: validTill,
        Tags: tags,
        LoginID: this.UserID,
        LikeValue,
        PageNumber,
        Popular,
        Recommended,
        RowsPerPage,
        SearchNews,
        MarketOppurtunities,
        EntityCode
      };
      const resp = await this.http.post(webMethod, parameters).toPromise();
      return resp?.['ListFetchNewsDetailsResponse']?.['items'] || [];
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     if (data.ListFetchNewsDetailsResponse.items) {
      //       // //console.log(data.ListFetchNewsDetailsResponse.items);
      //       result = data.ListFetchNewsDetailsResponse;
      //     } else {
      //       result = [];
      //     }


      //   },
      //   error(error) {
      //     console.log(error);
      //     result = [];
      //   }
      // });
      // return this.resMsg;
    } catch (error) {
      // //console.log('Error:', error);
    }
    return result;
  }

   async getNewsImage(newsId): Promise<Object> {
    // let result = '';
    try {
      // // //console.log('GetNewsImage');
      // const webMethod = this.interfaceUrl + 'GetNewsImage';
      const webMethod = this.interfaceUrl + `GetNewsImage/newsId=${newsId}`;
      const that = this;
      const parameters = {
        newsId
      };
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'text',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     // //console.log(data);
      //     result = data;
      //     // if (data.FinIQResponseHeader.Status === 'Succeed' || data.FinIQResponseHeader.Status === 'Success') {
      //     //   if (data.FillOrder.ResponseDetails.Code === '0000') {
      //     //     that.resMsg = data.FillOrder.RemarkInfo.Message;
      //     //   }
      //     // } else {
      //     //   that.resMsg = data.FillOrder.ResponseDetails.Remark;
      //     // }


      //   },
      //   error(error) {
      //     console.log(error);
      //     result = '';
      //   }
      // });
      const resp = await this.http.post(webMethod, parameters).toPromise();
      return resp;
      // return this.resMsg;
    } catch (error) {
      // //console.log('Error:', error);
    }
    return {};
    // return result;
  }

  getNewsImgResourcePath(filename): string {
    let result = '';
    result = `https://euroconnect.test-equity-connect.com/FinIQWebApp/News_Twitter/FinIQNewsImage/${filename}`;
    try {
      // // //console.log('GetNewsImage');
      // const webMethod = this.interfaceUrl + 'getNewsImgResourcePath';
      // const that = this;
      // const parameters = {
      //   filename
      // };
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'text',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     // //console.log(data);
      //     result = data;
      //     // if (data.FinIQResponseHeader.Status === 'Succeed' || data.FinIQResponseHeader.Status === 'Success') {
      //     //   if (data.FillOrder.ResponseDetails.Code === '0000') {
      //     //     that.resMsg = data.FillOrder.RemarkInfo.Message;
      //     //   }
      //     // } else {
      //     //   that.resMsg = data.FillOrder.ResponseDetails.Remark;
      //     // }


      //   },
      //   error(error) {
      //   console.log(error);
      //     result = '';
      //   }
      // });
      // return this.resMsg;
    } catch (error) {
      // //console.log('Error:', error);
    }
    return result;
  }

  GetPreviewURL(): string {
    let result = '';
    result = 'https://view.officeapps.live.com/op/embed.aspx?src=';
    try {
      // // //console.log('GetNewsImage');
      // const webMethod = this.interfaceUrl + 'GetPreviewURL';
      // const that = this;
      // const parameters = {
      //   "filename": ""
      // };
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'text',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     //console.log(data);
      //     result = data;
      //   },
      //   error(error) {
      //   console.log(error);
      //     result = '';
      //   }
      // });
      // // return this.resMsg;
    } catch (error) {
      //console.log('Error:', error);
    }
    return result;
  }



  getNewsAttachment(filename): string {
    let result = '';
    result = 'https://euroconnect.test-equity-connect.com/FinIQWebApp/News_Twitter/FinIQNewsDocs/'+filename;
    try {
      // // //console.log('GetNewsImage');
      // const webMethod = this.interfaceUrl + 'GetNewsAttachment';
      // const that = this;
      // const parameters = {
      //   filename
      // };
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'text',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     //console.log(data);
      //     result = data;
      //   },
      //   error(error) {
      //     console.log(error);
      //     result = '';
      //   }
      // });
      // // return this.resMsg;
    } catch (error) {
      //console.log('Error:', error);
    }
    return result;
  }


  getNewsLikeAPI(newsId: any, ListName: any, EntityCode: any) {
    // let result: any;
    try {
      // //console.log('getNewsLikeAPI');
      // const webMethod = this.interfaceUrl + 'getNewsLikeAPI';
      const webMethod = AppConfig.settings.apiBaseUrl + 'news/PublishNews/getNewsLikeAPI';
      // const that = this;
      // const parameters = {
      //   News_ID: newsId,
      //   LoginID: AppConfig.settings.oRes.userID,
      //   ListName,
      //   EntityCode
      // };
      const parameters = {
        "FinIQRequestHeader": {
          "EntityCode": EntityCode,
          "LoginID": AppConfig.settings.oRes.userID,
          "SourceSystem": "FinIQ",
          // "MachineIP": "192.168.15.72",
          "MachineIP": "",//Changed by SandipA for Internal IP Address Disclosure @05-Sep-23 
          "RequestID": "12346",
          "RequestAt": "21-06-2019"
        },
        "GetNewsLikeRequestDetails": {
          "News_ID": newsId,
          "ListName": ListName
        }
      };
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     // if (data.GetNewsLikeResponseDetails.Like_Value) {
      //     //   //console.log(data.GetNewsLikeResponseDetails.Like_Value);
      //     //   result = data.GetNewsLikeResponseDetails;
      //     // } else {
      //     //   result = { 'Like_Value': 'N', 'Number Of Likes': '0' };
      //     // }
      //     result = data;
      //   },
      //   error(error) {
      //   console.log(error);
      //     result = 'N';
      //   }
      // });
      // return this.resMsg;
      return this.http.post(webMethod, parameters).toPromise();
    } catch (error) {
      //console.log('Error:', error);
    }
    // return result;
  }

  setNewsLikeAPI(newsId, likeValue, EntityCode: any) {
    // let result = null;
    try {
      // //console.log('setNewsLikeAPI');
      // const webMethod = this.interfaceUrl + 'setNewsLikeAPI';
      const webMethod = AppConfig.settings.apiBaseUrl + 'news/PublishNews/setNewsLikeAPI';
      // const that = this;//image.png
      // const parameters = {
      //   Like_Value: likeValue,
      //   News_ID: newsId,
      //   LoginID: AppConfig.settings.oRes.userID,
      //   EntityCode
      // };
      const parameters = {
        "FinIQRequestHeader": {
          "EntityCode": EntityCode,
          "LoginID": AppConfig.settings.oRes.userID,
          "SourceSystem": "FinIQ",
          //"MachineIP": "192.168.15.72",
          "MachineIP": "",//Changed by SandipA for Internal IP Address Disclosure @05-Sep-23 
          "RequestID": "12346",
          "RequestAt": "21-06-2019"
        },
        "SetNewsLikeRequestDetails": {
          "News_ID": newsId,
          "Like_Value": likeValue
        }
      };
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     if (data.SetNewsLikeResponseDetails.Status) {
      //       // //console.log(data.SetNewsLikeResponseDetails.Status);
      //       result = data.SetNewsLikeResponseDetails.Status;
      //     } else {
      //       result = null;
      //     }
      //   },
      //   error(error) {
      //     console.log(error);
      //     result = null;
      //   }
      // });
      return this.http.post(webMethod, parameters).toPromise();
      // return this.resMsg;
    } catch (error) {
      // //console.log('Error:', error);
    }
    // return result;
  }


  // Workbench started - added by Priya L
  async GetRMWProductDetails(template: any, productfilter: any,
     rowsperpage: any, folderName: any, pageNo: any, search: any,
    FilterCriteria: any, ListType: any, TrancheYN: any, EntityCode: any, ShowLikes: any) {
    // const webMethod = this.interfaceUrl + 'GetRMWProductDetails';
    const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/RMWorkstation/GetRMWProductDetails';

    // const parameters = {
    //   Template_Name: template,
    //   Product_Name: productfilter,
    //   SortingCriteria: 'Note_Master_ID desc', // + sortBy,
    //   RowsperRequest: rowsperpage,
    //   FilterCriteria,
    //   Folder_Name: folderName,
    //   Page_No: pageNo,
    //   WhereClause: search,
    //   LoginID: AppConfig.settings.oRes.userID,
    //   ListType,
    //   TrancheYN,
    //   EntityCode,
    //   ShowLikes,
    // };
    const parameters = {
      "FinIQRequestHeader": {
        "EntityCode": EntityCode,
        "LoginID": AppConfig.settings.oRes.userID,
        "SourceSystem": "FinIQ",
        // "MachineIP": "192.168.26.195",
        "MachineIP": "",//Changed by SandipA for Internal IP Address Disclosure @05-Sep-23 
        "RequestID": "1",
        "RequestAt": "13-Nov-19"
      },
      "RMWGenericRequest": {
        "Template_Name": template,
        "Product_Name": productfilter,
        "Isin": "",
        "WhereClause": search,
        "FilterCriteria": FilterCriteria,
        "SortingCriteria": "Note_Master_ID desc",
        "RowsperRequest": rowsperpage,
        "ShowLikes": ShowLikes,
        "Folder_Name": folderName,
        "ListType": ListType,
        "Page_No": pageNo,
        "TrancheYN": TrancheYN
      }
    };
    // const that = this;
    try {
      const response = await this.http.post(webMethod, parameters).toPromise();
    this.RMWProductDetails = [];
    if (response['RMWGenericResponse'].items != null) {
      // that.RMWProductDetails = JSON.parse(data.RMWGenericResponse.items.replace(/\n/g, ''));
      this.RMWProductDetails = response['RMWGenericResponse'];
    }
    return this.RMWProductDetails;
    } catch (error) {
      console.log(error);

    }
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   success(data) {
    //     that.RMWProductDetails = [];
    //     if (data.RMWGenericResponse.items != null) {
    //       // that.RMWProductDetails = JSON.parse(data.RMWGenericResponse.items.replace(/\n/g, ''));
    //       that.RMWProductDetails = data.RMWGenericResponse;
    //     }
    //     // that.stopLoading();
    //     return that.RMWProductDetails;
    //   },
    //   error(error) {
    //     console.log(error);
    //   }
    // });
    // return this.RMWProductDetails;
  }

  // Workbench search api - added by Priya L.

  // Pending http conversion: api not deployed
  async GetRMWProductDetailsGenericFilter(searchText: any, pageNo: any, pageSize: any,
    templateCode: any, folderName: any, ListType: any, TrancheYN: any, EntityCode: any) {
    const webMethod = this.interfaceUrl + 'GetRMWProductDetailsGenericFilter';
    // const webMethod = AppConfig.settings.apiBaseUrl + 'GetRMWProductDetailsGenericFilter';

    const parameters = {
      searchText,
      pageNo,
      pageSize,
      LoginID: AppConfig.settings.oRes.userID,
      templateCode,
      folderName,
      ListType,
      TrancheYN,
      EntityCode
    };
    const that = this;
    const response = '';
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   success(data) {
    //     that.RMWProductDetails = [];
    //     if (data.RMWGenericResponse.items != null) {
    //       that.RMWProductDetails = data.RMWGenericResponse;
    //     }
    //     return that.RMWProductDetails;
    //   },
    //   error(error) {
    //     console.log(error);
    //   }

    // });
    // return this.RMWProductDetails;

    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      that.RMWProductDetails = [];
      if (data.RMWGenericResponse.items != null) {
        that.RMWProductDetails = data.RMWGenericResponse;
      }
      return that.RMWProductDetails;
    }).catch(error => {
      console.log(error);
    });
  }

  // Pending http conversion: api not deployed
  async likeProduct(NoteMasterId: any) {
    const webMethod = this.interfaceUrl + 'LikeProduct';
    // const webMethod = AppConfig.settings.apiBaseUrl + 'LikeProduct';
    const parameters = {
      NoteMasterId,
      LoginID: AppConfig.settings.oRes.userID,

    };
    const that = this;
    const response = '';
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   success(data) {
    //     that.likeProductFlag = data;
    //     return that.likeProductFlag;
    //   },
    //   error(error) {
    //     console.log(error);
    //   }
    // });
    // return this.likeProductFlag;
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      that.likeProductFlag = data;
      return that.likeProductFlag;
    }).catch(error => {
      console.log(error);
    });
  }

  // Pending http conversion: api not deployed
  async unlikeProduct(NoteMasterId: any) {
    const webMethod = this.interfaceUrl + 'UnLikeProduct';
    // const webMethod = AppConfig.settings.apiBaseUrl + 'UnLikeProduct';

    const parameters = {
      NoteMasterId,
      LoginID: AppConfig.settings.oRes.userID,

    };
    const that = this;
    const response = '';
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   success(data) {
    //     that.unlikeProductFlag = data;
    //     return that.unlikeProductFlag;
    //   },
    //   error(error) {
    //     console.log(error);
    //   }
    // });
    // return this.unlikeProductFlag;
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      that.unlikeProductFlag = data;
      return that.unlikeProductFlag;
    }).catch(error => {
      console.log(error);
    });
  }

  // Pending http conversion: api not deployed
  async ProductAttachmentList(NoteMasterID: any) {
    const webMethod = this.interfaceUrl + 'ProductAttachmentList';
    // const webMethod = AppConfig.settings.apiBaseUrl + 'ProductAttachmentList';

    const parameters = {
      NoteMasterID
    };
    const that = this;
    const response = '';
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   success(data) {
    //     that.productattachmentlist = data;
    //     return that.productattachmentlist;
    //   },
    //   error(error) {
    //     console.log(error);
    //   }
    // });
    // return this.productattachmentlist;
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      that.productattachmentlist = data;
      return that.productattachmentlist;
    }).catch(error => {
      console.log(error);
    });
  }

async GetFolders(LoginID) {
    // const webMethod = this.interfaceUrl + 'GetFolders';
    const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/RMWorkstation/GetFolders';

    const parameters = {
      EntityID: '4',
      LoginID

    };
    // const that = this;
    try {
      const response = this.http.post(webMethod, parameters).toPromise();
      this.folders = response;
      return this.folders;
    } catch (error) {
      console.log(error);
    }
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   success(data) {
    //     that.folders = data;
    //     return that.folders;
    //   },
    //   error(error) {
    //     console.log(error);
    //   }
    // });
    // return this.folders;
  }


  async UDTForRMOrderSave(Note_Master_ID, NominalAmount, RMID, RMNAME, Ccy, CustomerID, CustomerName, MinCoupon, onBehalfOf): Promise<any[]> {
    try {
      let res: any;
      // const webMethod = this.interfaceUrl + 'UDTForRMOrderSave';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Order/UDTForRMOrderSave';
      // const parameters = {
      //   Note_Master_ID,
      //   Login_ID: AppConfig.settings.oRes.userID,
      //   Entity_ID: AppConfig.settings.oRes.homeEntityID,
      //   NominalAmount,
      //   RMID,
      //   RMNAME,
      //   Ccy,
      //   CustomerID,
      //   CustomerName,
      //   MinCoupon,
      //   onBehalfOf: onBehalfOf
      // }
      const parameters = {
        "Note_Master_ID": Note_Master_ID,
        "Login_ID": AppConfig.settings.oRes.userID,
        "Entity_ID": AppConfig.settings.oRes.homeEntityID,
        "CustomerID": CustomerID,
        "CustomerName": CustomerName,
        "NominalAmount": NominalAmount,
        "RMID": RMID,
        "RMNAME": RMNAME,
        "Ccy": Ccy,
        "AdvRsn": "Hey",
        "I_strCashSettlementAccount": "",
        "I_strCashSettlementCcy": "",
        "I_strSecuritiesAccount": "",
        "I_strELIAccount": "",
        "I_strReferralYN": "",
        "I_strPICOP": "N",
        "I_strPortfolio": "",
        "USDequiv": "",
        "I_strBook": "",
        "I_strNonBestPriceTrancheRemark": "",
        "strInputChannel": "",
        "strInternalRefNo": "134335",
        "onBehalfOf": onBehalfOf,
        "strDocID": "",
        "strDocType": "",
        "MinCoupon": MinCoupon
      }

      const response: any = await this.http.post(webMethod, parameters).toPromise();
      return response;

      // const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {

      //     res = data.UDTForRMOrderSaveResult;
      //     return res;
      //   },
      //   error(error) {
      //     console.log(error);
      //   }
      // });

      // return res;
    } catch (error) {
      //console.log('Error:', error);
    }
  }


  // Pending http conversion: api not deployed
  // Create folder
  async CreateFolder(FolderName: any, NoteMasterID: any, Mode: any) {
    const webMethod = this.interfaceUrl + 'CreateFolder';
    // const webMethod = AppConfig.settings.apiBaseUrl + 'CreateFolder';
    let createfolderres = [];
    const parameters = {
      user_id: AppConfig.settings.oRes.userID,
      folder_name: FolderName,
      nm_id: NoteMasterID,
      mode: Mode
    };
    const that = this;
    const response = '';
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   success(data) {
    //     //console.log(data['Create_FolderResult'])
    //     createfolderres = data;
    //   },
    //   error(error) {
    //     console.log(error);
    //   }
    // });
    // return createfolderres;
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      //console.log(data['Create_FolderResult'])
      createfolderres = data;
      return createfolderres;
    }).catch(error => {
      console.log(error);
    });
  }

  // Pending http conversion: api not deployed.
  // Fetch Userwise folder
  async FetchFolderList() {
    const webMethod = this.interfaceUrl + 'FetchFolderList';
    // const webMethod = AppConfig.settings.apiBaseUrl + 'FetchFolderList';
    let fetchFolderList = [];
    const parameters = {
      user_id: AppConfig.settings.oRes.userID,

    };
    const that = this;
    const response = '';
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   success(data) {
    //     //console.log(data)
    //     fetchFolderList = data.FetchFolderListResult;
    //   },
    //   error(error) {
    //     console.log(error);
    //   }
    // });
    // return fetchFolderList;
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
      fetchFolderList = data.FetchFolderListResult;
      return fetchFolderList;
    }).catch(error => {
      console.log(error);
    });
  }

   //Added by ApurvaK|| 17-Mar-2023
   async fnGetProdTemplate(product : string) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Quote/FetchAppTableSchema';
      const parameters = {
        productName: product,
        subTemplateCode: "",
        requestXML: "",
        solveFor: "",
        loginID: "",
        buyerEntityID: "",
        userGroupID: ""
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.templateMappingArr = data;
        return this.templateMappingArr
      });
          
      //console.log(that.templateMappingArr);
        
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // async GetDocumentSupportStatus() {
  //   try {
  //     const webMethod = this.interfaceUrl + 'eqd/Document/GetDocumentSupportStatus';
  //     return await this.http.get(webMethod).toPromise().then(data => { return data });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  //Added by SandipA suggested by SudarshanP @29-Dec-23 || To send docs specfic to the entity ID  ||  START
  async GetDocumentSupportStatus(product: string) {
    try {
      const webMethod = this.interfaceUrl + 'eqd/Document/GetDocumentSupportStatus';
      const parameters = {
        "Product": product,
        "EntityID": AppConfig.settings.oRes.homeEntityID
      }
      return await this.http.post(webMethod,parameters).toPromise().then(data => { return data });
    } catch (error) {
      console.log(error);
    }
  }
  //Added by SandipA suggested by SudarshanP @29-Dec-23 || To send docs specfic to the entity ID  ||  END

  //Added by Varsha G || 01-June-2023
  async GetCommonDataReason(DataType : string){
    try{
      const webMethod = AppConfig.settings.apiBaseUrl + 'elnrfq/GetCommonDataReason';
      const parameters = {
        Data_Type: DataType,
        Entity_ID:AppConfig.settings.oRes.homeEntityID,
      };
      const response: any = await this.http.post(webMethod, parameters).toPromise();
      return response;

    }catch(error){

    }
  }

  async GetCommonDataEntityWise(DataType : string,Misc : string){
    try{
      const webMethod = AppConfig.settings.apiBaseUrl + 'elnrfq/GetCommonDataEntityWise';
      const parameters = 
        {
          "Data_Type": DataType,
          "Entity_ID": AppConfig.settings.oRes.homeEntityID,
          "Misc3": Misc
        };
      const response: any = await this.http.post(webMethod, parameters).toPromise();
      return response;

    }catch(error){

    }
  }

  async GetCommonData(Type: string) {
    try {
      this.UserID = AppConfig.settings.oRes.userID;
      const webMethod = AppConfig.settings.apiBaseUrl + 'elnrfq/GetCommonData';
      const parameters = {
        Data_Type: Type
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {    
        return data;
      });
    } catch (error) {
    }
  }

  async BBVALoadSharesAssets(MarketType: string, AssetType: string) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetAllShareDetailsWithAssset';
      const parameters = {
        MarketType,
        AssetType
      };
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        this.floatingRefArrCLN = data;
        return data;
       });
    } catch (error) {
      
    }
  }

  //Added by Apurva K|| 16-May-2024
  async GetReferenceEntityLookupData(MarketType:any,AssetType:any) {
    try {
      let refEntityData: any;
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetReferenceEntityLookupData';
      const parameters = {
        "userID": AppConfig.settings.oRes.userID,
        "MarketType": MarketType,
        "AssetType": AssetType,
      };
      return await this.http.post(webMethod,parameters).toPromise().then((data:any)=>{
        // refEntityData = data.GetReferenceEntityLookupDataResult;
        // console.log(refEntityData,"refEntityData")
        this.sharesCLN = data;
        console.log ( 'CLN', this.sharesCLN);
        return this.sharesCLN;
       });
    } catch (error) {
    
    }
   
  }
}
