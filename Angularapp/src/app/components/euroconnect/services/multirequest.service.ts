import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from 'src/app/services/config.service';
import { environment } from 'src/environments/environment';
import { EcCommonService } from './ec-common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MultirequestService {

  constructor(public EcCommon : EcCommonService, public http: HttpClient) { }

  RFQDetails = {};
  userGroupID = '';
  userGroup = '';

  allBooksData = [];
 BookingCenter = [];
 portfolioGroupID = '';
 result: any;
 UserID: any;


  public multiPhoenixArr = new BehaviorSubject(0);
  multiPhoenixArrObserver = this.multiPhoenixArr.asObservable();

  public cloneFlag = new BehaviorSubject(false);
  cloneFlagCheck = this.cloneFlag.asObservable();

  public cloneFlag1 = new BehaviorSubject(false);
  cloneFlag1Obs = this.cloneFlag1.asObservable();

  public cloneData1 = new BehaviorSubject('');
  cloneData1Obs = this.cloneData1.asObservable();

  public toggleFlag = new BehaviorSubject(false);
  toggleFlagObs = this.toggleFlag.asObservable();

  public toggleData = new BehaviorSubject('');
  toggleDataObs = this.toggleData.asObservable();

  public toggleVisiblityFlag = new BehaviorSubject<any>('');
  toggleVisiblityFlagObs = this.toggleVisiblityFlag.asObservable();

  /////////// Participatiom Observers

  public ptcloadFlag = new BehaviorSubject(false);
  PTCLoadFlagCheck = this.ptcloadFlag.asObservable();
  interfaceUrl = environment.interfaceURL;

  public ptcsaveFlag = new BehaviorSubject(false);
  ptcsaveFlagCheck = this.ptcsaveFlag.asObservable();

  public ptcPriceFlag = new BehaviorSubject(false);
  ptcpriceFlagCheck = this.ptcPriceFlag.asObservable();

  public priceFlag = new BehaviorSubject(false);
  priceFlagCheck = this.priceFlag.asObservable();

  public schedulePriceFlag = new BehaviorSubject({});
  schedulePriceFlagCheck = this.schedulePriceFlag.asObservable();

  public rcloadFlag = new BehaviorSubject(false);
  RCLoadFlagCheck = this.rcloadFlag.asObservable();

  public rcsaveFlag = new BehaviorSubject(false);
  rcsaveFlagCheck = this.rcsaveFlag.asObservable();
  public creditSaveFlag = new BehaviorSubject(false);
  creditSaveFlagCheck = this.creditSaveFlag.asObservable();

  public rcPriceFlag = new BehaviorSubject(false);
  rcpriceFlagCheck = this.rcPriceFlag.asObservable();
  public creditFlag = new BehaviorSubject(false);
  creditpriceFlagCheck = this.creditFlag.asObservable();

  public creditloadFlag = new BehaviorSubject(false);
  CreditLoadFlagCheck = this.creditloadFlag.asObservable();

  public schedulePopupFlag = new BehaviorSubject(false);
  schedulePopupFlagObs = this.schedulePopupFlag.asObservable();

  public saveFlag = new BehaviorSubject(false);
  saveFlagCheck = this.saveFlag.asObservable();

  public loadFlag = new BehaviorSubject(false);
  LoadFlagCheck = this.loadFlag.asObservable();

  attachDetachCalculationsSF = new BehaviorSubject({});
  attachDetachCalculationsObserver = this.attachDetachCalculationsSF.asObservable();

  async attachDetachCalculations(attach, detach) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl  + 'Calculate/CalculateCreditNominal';
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

  async getAttachPercent(attachVal, indexCode, index) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl  + 'Calculate/CreditAttachPercentage';
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
  async getDetachPercent(detachVal, indexCode, index) {
    try {
      const webMethod = AppConfig.settings.apiBaseUrl  + 'Calculate/CreditDetachPercentage';
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

  setUserGroupID(userGroupID) {
    this.userGroupID = userGroupID;
  }

  setUserGroup(userGroup) {
    this.userGroup = userGroup;
  }

  setportfolioGroupID(portfolioGroupID) {
    this.portfolioGroupID = portfolioGroupID;
  }

  async reofferValidation(IssuePrice: any, ReofferPrice: any, ProductType: any, WrapperType: any) {
    try {
      this.UserID = AppConfig.settings.oRes.userID;
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/ValidateReOfferPrice';
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
  // noncall validation
  async noncallValidation(NonCallValue: any, TenorExpiryDate: any, frequency: any) {
    try {
      this.UserID = AppConfig.settings.oRes.userID;
      const webMethod = AppConfig.settings.apiBaseUrl  + 'eqd/ValidateNonCallValue';
      const parameters = {
        NonCallValue: NonCallValue,
        Tenor: TenorExpiryDate,
        frequency: frequency
      };
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data.Result;
      });
    } catch (error) {
    }
  }

 
}
