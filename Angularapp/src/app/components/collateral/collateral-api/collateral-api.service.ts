import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
declare var require: any;
@Injectable({
  providedIn: 'root',
})
export class CollateralApiService {
  interfaceURL = environment.interfaceURL;

  private expandedRowObserver = new BehaviorSubject<string>('');
  expandedRow = this.expandedRowObserver.asObservable();

  private RMNamesObserver = new BehaviorSubject<any>([]);
  RMNamesData = this.RMNamesObserver.asObservable();

  private CustomerGroupObserver = new BehaviorSubject<any>([]);
  CustomerGroup = this.CustomerGroupObserver.asObservable();

  private CustomerIdObserver = new BehaviorSubject<any>([]);
  CustomerId = this.CustomerIdObserver.asObservable();

  private globalMarginObserver = new BehaviorSubject<any>([]);
  globalMarginData = this.globalMarginObserver.asObservable();

  private limitUtilizationObserver = new BehaviorSubject<any>({});
  limitUtilizationData = this.limitUtilizationObserver.asObservable();

  private limitCollateralObserver = new BehaviorSubject<any>({});
  limitCollateralData = this.limitCollateralObserver.asObservable();

  private limitUtilizationChartObserver = new BehaviorSubject<any>({});
  limitUtilizationChartData = this.limitUtilizationChartObserver.asObservable();

  private collateralDetailsObserver = new BehaviorSubject<any>({});
  collateralDetailsData = this.collateralDetailsObserver.asObservable();

  private exposureDetailsObserver = new BehaviorSubject<any>({});
  exposureDetailsData = this.exposureDetailsObserver.asObservable();

  private marginRationDetailsObserver = new BehaviorSubject<any>({});
  marginRatioDetailsData = this.marginRationDetailsObserver.asObservable();

  public collateralReport = new BehaviorSubject<any>([]);
  collateralReportObserver = this.collateralReport.asObservable();

  public liquidNonLiquid = new BehaviorSubject<any>([]);
  liquidNonLiquidObserver = this.liquidNonLiquid.asObservable();

  public collateralCalculation = new BehaviorSubject('');
  public collateralCalculationObserver =
    this.collateralCalculation.asObservable();

  constructor(private http: HttpClient) {}

  GetGlobalMarginReportData(
    CustomerGroupId,
    RequireDataTableId,
    UserId,
    CustId,
    RMNames,
    Component = 'globalMarginReport',
    baseCCY
  ) {
    try {
      const webmethod = this.interfaceURL + 'GetGlobalMarginReportData_LCYE';
      // console.log(webmethod);
      const that = this;

      this.http
        .post(webmethod, {
          CustomerGroupId,
          RequireDataTableId,
          UserId,
          CustId,
          RMNames,
          baseCCY,
        })
        .subscribe(
          (val: any) => {
            // console.log('POST call to GetGlobalMarginReportData successful', val, CustomerGroupId);
            let result = {};
            //console.log('CustomerGroupId:', CustomerGroupId, 'RequireDataTableId:', RequireDataTableId, 'UserId:', UserId, 'CustId:', CustId, 'RMNames:', RMNames, Component);

            result = {
              data: val.DB_Get_GlobalMarginReportData_LCYEResult || [],
              GroupId: CustomerGroupId,
            };
            switch (Component) {
              case 'rmNames':
                that.RMNamesObserver.next(
                  val.DB_Get_GlobalMarginReportData_LCYEResult
                );
                break;
              case 'customerGroup':
                that.CustomerGroupObserver.next(
                  val.DB_Get_GlobalMarginReportData_LCYEResult
                );
                break;
              case 'customerId':
                that.CustomerIdObserver.next(result);
                break;
              case 'globalMarginReport':
                that.globalMarginObserver.next(
                  val.DB_Get_GlobalMarginReportData_LCYEResult
                );
                //console.log(val.DB_Get_GlobalMarginReportDataResult);
                break;
              case 'limitUtilization':
                that.limitUtilizationObserver.next(result);
                //console.log(val.DB_Get_GlobalMarginReportDataResult);
                break;
              case 'limitCollateral':
                that.limitCollateralObserver.next(result);
                //console.log(val.DB_Get_GlobalMarginReportDataResult);
                break;
              case 'limitUtilizationChart':
                that.limitUtilizationChartObserver.next(result);
                //console.log(val.DB_Get_GlobalMarginReportDataResult);
                break;
              case 'marginRatio':
                that.marginRationDetailsObserver.next(result);
                //console.log(val.DB_Get_GlobalMarginReportDataResult);
                break;
              case 'collateralDetails':
                that.collateralDetailsObserver.next(result);
                //console.log(val.DB_Get_GlobalMarginReportDataResult);
                break;
              case 'exposureDetails':
                that.exposureDetailsObserver.next(result);
                //console.log(val.DB_Get_GlobalMarginReportDataResult);
                break;
              case 'liquidNonLiquid':
                that.liquidNonLiquid.next(result);
              //console.log(val.DB_Get_GlobalMarginReportDataResult);
            }
          },
          () => {
            //console.log('POST call error in GetGlobalMarginReportData', response);
          },
          () => {
            // console.log('POST observable globalMarginObserver is completed.');
          }
        );
    } catch (error) {
      //console.error(error);
    }
  }

  GetGlobalMarginReportDataV2(
    CustomerGroupId,
    RequireDataTableId,
    UserId,
    CustId,
    RMNames,
    _Component = 'globalMarginReport',
    baseCCY
  ) {
    try {
      const webmethod = this.interfaceURL + 'GetGlobalMarginReportData_LCYE';

      return this.http.post(webmethod, {
        CustomerGroupId,
        RequireDataTableId,
        UserId,
        CustId,
        RMNames,
        baseCCY,
      });
    } catch (error) {
      console.error(error);
    }
  }
  GetControlPopupData(CustomerGroupId, RequireDataTableId) {
    try {
      const webmethod = this.interfaceURL + 'GetControlPopupData';
      //console.log(webmethod);

      this.http
        .post(webmethod, {
          CustomerGroupId,
          RequireDataTableId,
        })
        .subscribe(
          () => {
            //console.log('POST call successful', val);
          },
          () => {
            //console.log('POST call in error', response);
          },
          () => {
            //console.log('POST observable is completed.');
          }
        );
    } catch (error) {
      //console.error(error);
    }
  }

  UpdateCurrentDealStatusInCollateralDeals(CustomerGroupId, DealNumber) {
    try {
      const webmethod =
        this.interfaceURL + 'UpdateCurrentDealStatusInCollateralDeals';
      //console.log(webmethod);

      this.http
        .post(webmethod, {
          CustomerGroupId,
          DealNumber,
        })
        .subscribe(
          () => {
            //console.log('POST call successful', val);
          },
          () => {
            //console.log('POST call in error', response);
          },
          () => {
            //console.log('POST observable is completed.');
          }
        );
    } catch (error) {
      //console.error(error);
    }
  }

  GetCollateralReportData(username, custid, baseCCY) {
    const webMethod = this.interfaceURL + 'GetCollateralReportData_LCYE';
    const parameters = {
      username,
      custid,
      baseCCY,
    };
    const that = this;

    this.http.post<any>(webMethod + '', parameters).subscribe((res) => {
      //console.log(res);
      that.collateralReport.next(res);
    });
  }

  clearObservers() {
    this.globalMarginObserver.complete();
  }

  GetEventTarget(e): any {
    const target: any = e.target || e.srcElement || e.currentTarget || null;
    return target;
  }

  expandRow(groupId: string) {
    this.expandedRowObserver.next(groupId);
  }

  FormatNumber(value, input = false) {
    value = parseFloat(value + '').toFixed(2);
    if (input) {
      if (value.toString().trim() === '') {
        value = '0.00';
      } else {
        value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return value;
    } else {
      if (value) {
        return (value + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '';
      } else {
        return '0.00';
      }
    }
  }

  GetCollateralCalculation(
    EntityID,
    I_CustomerGroupId,
    UserName,
    IncludeDraftDeal
  ) {
    const body = {
      I_CustomerGroup: '',
      I_CustomerGroupId,
      RevalulationOutput: '',
      EntityID,
      Note_Master_Id: '',
      UserName,
      CallingParm:
        I_CustomerGroupId +
        ':' +
        I_CustomerGroupId +
        ':' +
        IncludeDraftDeal +
        ':::::', // String is given by Amol Mahale Sir on 08-Mar-2021
    };
    this.http
      .post<any>(this.interfaceURL + 'CollateralCalculation', body)
      .subscribe(
        (res: any) => {
          this.collateralCalculation.next(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
