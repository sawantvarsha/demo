import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
// import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class PortfolioAnalyticsService {
  interfaceURL = environment.interfaceURL;
  public portfolioDetailsObserver = new BehaviorSubject<any>({});
  portfolioDetailsData = this.portfolioDetailsObserver.asObservable();
  public portfolioChangeObserver = new BehaviorSubject<any>({});
  portfolioData = this.portfolioChangeObserver.asObservable();
  selectedPortfolio: any;

  constructor(private http: HttpClient) {
    this.selectedPortfolio = null;
  }

  public getBenchmarkSecurityList() {
    try {
      const webMethod = this.interfaceURL + 'GetBenchmarkSecurities';
      const parameters = {};
      return this.http.post<any>(webMethod, parameters, {
        withCredentials: true,
      });
    } catch(error) {
      console.log(error);
    }
  }

  public getCorrelationMatrix(
    portfolioSecurities: string[],
    solveFor: string = 'CUMULATIVERETURN',
    benchmark: string = 'Nifty 50',
    FromDate = '2017-10-26',
    ToDate = '2021-09-07',
    customerID: string,
    facilityCode: string,
    weights: string[]
  ) {
    try {
      const webMethod = this.interfaceURL + 'CorrelationWrapperAPI';
      const parameters = {
        securities: portfolioSecurities.join(),
        solveFor: solveFor,
        benchmark: benchmark,
        date1: FromDate,
        date2: ToDate,
        customerID: customerID,
        weights: weights.join(),
        facilityCode: facilityCode
      };
      return this.http.post<any>(webMethod, parameters);
    } catch(error) {
      console.log(error);
    }
  }

  public performanceWrapper(
    portfolioSecurities: string[],
    solveFor: string,
    benchmark: string,
    FromDate,
    ToDate,
    customerID: string,
    facilityCode: string,
    weights: string[],
    mode: string,
    identifier: string
  ) {
    try {
      const webMethod = this.interfaceURL + 'performanceWrapperAPI';
      const parameters = {
        securities: portfolioSecurities.join(),
        solveFor: solveFor,
        benchmark: benchmark,
        date1: FromDate,
        date2: ToDate,
        customerID: customerID,
        weights: weights.join(),
        facilityCode: facilityCode,
        mode: mode,
        identifier: identifier,
      };
      // console.log(parameters);
      return this.http.post<any>(webMethod, parameters);
    } catch(error) {
      console.log(error);
    }
  }

  public drawdownWrapper(
    portfolioSecurities: string[],
    solveFor: string = 'GRAPH',
    benchmark: string = 'Nifty 50',
    FromDate = '2017-10-26',
    ToDate = '2021-09-07',
    customerID: string,
    facilityCode: string,
    weights: string[],
    mode: string
  ) {
    try {
      const webMethod = this.interfaceURL + 'DrawdownWrapperAPI';
      const parameters = {
        securities: portfolioSecurities.join(),
        solveFor: solveFor,
        benchmark: benchmark,
        date1: FromDate,
        date2: ToDate,
        customerID: customerID,
        weights: weights.join(),
        facilityCode: facilityCode,
        mode: mode,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch(error) {
      console.log(error);
    }
  }
  
  public rollingWrapper(
    portfolioSecurities: string[],
    benchmark,
    customerID: string,
    facilityCode: string,
    period: string = '50,100,150',
    FromDate = '2017-10-26',
    ToDate = '2021-09-07',
    weights: string[],
    solveFor: string = 'GRAPH',
    mode: string
  ) {
    try {
      const webMethod = this.interfaceURL + 'RollingWrapperAPI';
      const parameters = {
        securities: portfolioSecurities.join(),
        period: period,
        benchmark: benchmark,
        date1: FromDate,
        date2: ToDate,
        customerID: customerID,
        weights: weights.join(),
        solveFor: solveFor,
        facilityCode: facilityCode,
        mode: mode,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch(error) {
      console.log(error);
    }
  }

  public contributionWrapper(
    portfolioSecurities: string[],
    solveFor: string,
    benchmark: string,
    customerID: string,
    facilityCode: string,
    FromDate = '2017-10-26',
    ToDate = '2021-09-07',
    weights: string[],
    mode: string
  ) {
    try {
      const webMethod = this.interfaceURL + 'ContributionWrapperAPI';
      const parameters = {
        securities: portfolioSecurities.join(),
        benchmark: benchmark,
        solveFor: solveFor,
        date1: FromDate,
        date2: ToDate,
        customerID: customerID,
        weights: weights.join(),
        facilityCode: facilityCode,
        mode,
      };
      console.log(parameters);
      return this.http.post<any>(webMethod, parameters);
    } catch(error) {
      console.log(error);
    }
  }

  public securitiesAssetsInfoWrapper(
    customerID: string,
    facilityCode: string,
    solveFor: string
  ) {
    try {
      const webMethod = this.interfaceURL + 'SecuritiesAssetsInfoWrapperAPI';
      const parameters = {
        customerID: customerID,
        facilityCode: facilityCode,
        solveFor: solveFor,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch(error) {
      console.log(error);
    }
  }

  public getScenarios(type: string, FacilityCode: string) {
    try {
      const webMethod = this.interfaceURL + 'RetrieveScenarios';
      const parameters = {
        ScenarioType: type,
        PortfolioFacilityCode: FacilityCode,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch(error) {
      console.log(error);
    }
  }

  public saveCustomScenario(
    FacilityCode: string,
    name: string,
    fromDate: string,
    toDate: string
  ) {
    try {
      const webMethod = this.interfaceURL + 'SaveCustomScenario';
      const parameters = {
        FacilityCode: FacilityCode,
        name: name,
        fromDate: fromDate,
        toDate: toDate,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch(error) {
      console.log(error);
    }
  }

  public removeCustomScenario(FacilityCode: string, ScenarioID: string) {
    try {
      const webMethod = this.interfaceURL + 'RemoveCustomScenario';
      const parameters = {
        FacilityCode: FacilityCode,
        ScenarioID: ScenarioID,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch(error) {
      console.log(error);
    }
  }

  public getPortfolioHoldingsEQCash(customerID: string, FacilityCode: string) {
    try {
      const webMethod = this.interfaceURL + 'GetPortfolioHoldingsEQCash';
      const parameters = {
        FacilityCode: FacilityCode,
        customerID: customerID,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch(error) {
      console.log(error);
    }
  }

  public changePortfolio(portfolio) {
    try {
      console.log(portfolio);
      this.portfolioChangeObserver.next(portfolio);
    } catch(error) {
      console.log(error);
    }
  }

  public saveModelPortfolio(customerID, facilityCode, portfolioName, MPV) {
    try {
      const webMethod = this.interfaceURL + 'SaveModelPortfolio';
      const parameters = {
        customerID,
        facilityCode,
        portfolioName,
        MPV,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log(error);
    }
  }
  public updateModelPortfolio(
    customerID,
    facilityCode,
    portfolioName,
    portfolioID,
    MPV
  ) {
    try {
      const webMethod = this.interfaceURL + 'UpdateModelPortfolio';
      const parameters = {
        customerID,
        facilityCode,
        portfolioName,
        portfolioID,
        MPV,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log(error);
    }
  }
  public retrieveModelPortfolios(customerID, facilityCode) {
    try {
      const webMethod = this.interfaceURL + 'RetrieveModelPortfolios';
      const parameters = {
        customerID,
        facilityCode,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log(error);
    }
  }
  public deleteModelPortfolios(
    portfolioID,
    portfolioName,
    customerID,
    facilityCode
  ) {
    try {
      const webMethod = this.interfaceURL + 'DeleteModelPortfolio';
      const parameters = {
        portfolioID,
        portfolioName,
        customerID,
        facilityCode,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log(error);
    }
  }

  public saveCustomIndex(customerID, facilityCode, customerIndexName, CIV) {
    try {
      const webMethod = this.interfaceURL + 'SaveCustomIndices';
      const parameters = {
        customerID,
        facilityCode,
        customerIndexName,
        CIV,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log(error);
    }
  }

  public updateCustomIndices(
    customerID,
    facilityCode,
    customIndexName,
    customIndexID,
    CIV
  ) {
    try {
      const webMethod = this.interfaceURL + 'UpdateCustomIndices';
      const parameters = {
        customerID,
        facilityCode,
        customIndexName,
        customIndexID,
        CIV,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log(error);
    }
  }

  public retrieveCustomIndices(customerID, facilityCode) {
    try {
      const webMethod = this.interfaceURL + 'RetrieveCustomIndices';
      const parameters = {
        customerID,
        facilityCode,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log(error);
    }
  }

  public deleteCustomIndices(customIndexID) {
    try {
      const webMethod = this.interfaceURL + 'DeleteCustomIndices';
      const parameters = {
        customIndexID,
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log(error);
    }
  }

  public getListOfIndices() {
    try {
      const webMethod = this.interfaceURL + 'RetrieveAllIndices';
      const parameters = {};
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log(error);
    }
  }
}
