import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WorkflowApiService } from '../../../../services/workflow-api.service';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { CollateralApiService } from '../../../collateral/collateral-api/collateral-api.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit, OnDestroy {
  pageName = 'Workflow';
  isProd = environment.production;
  FundsBlotterArray = [];
  userID: string;
  CustomerID: string;
  blotter = [];
  CreditFacility = [];
  CreditFacilityNonMarginDetails = [];
  PortfolioLiquidCollateral = [];
  record1 = [];
  record2 = [];
  totalCollateral = 0;
  totalconsumedLimit = 0;
  totalmargin = 0;
  totalMTM = 0;
  TotalMarketValueHKD = 0;
  totalValueafterLendingRatioHKD = 0;
  totalValueafterConcRulesHKD = 0;
  one = true;
  two = false;
  three = false;
  noDataFlag: boolean;
  collateralReport: Subscription;
  baseCCY: string;
  constructor(
    public afs: WorkflowApiService,
    public cfs: CustomerApiService,
    public api: CollateralApiService,
    public authapi: AuthService,
    public homeapi: HomeApiService
  ) {
    this.noDataFlag = false;
  }
  ngOnDestroy(): void {
    if (this.collateralReport) this.collateralReport.unsubscribe();
  }

  ngOnInit(): void {
    // this.baseCCY = sessionStorage.getItem("BankBaseCcy");
    this.cfs.getBankBaseCCYOBS.subscribe((ccy) => {
      this.baseCCY = ccy;
      this.api.collateralReport.next([]);
      this.api.GetCollateralReportData(username, custId, this.baseCCY);
    });
    // this.afs.getWorkflowData(2129, 100, 1, 'AM Investment Workflow');
    // this.api.collateralReport.next([]);
    const username = this.authapi.UserName;
    const custId = this.homeapi.CustomerId;
    // this.api.GetCollateralReportData(username, custId, this.baseCCY);

    this.collateralReport = this.api.collateralReportObserver.subscribe(
      (res) => {
        if (res.length !== 0) {
          this.CreditFacility = [];
          this.PortfolioLiquidCollateral = [];
          this.CreditFacilityNonMarginDetails = [];
          //console.log(res.CreditFacilityWithMarginDetails);
          // this.record1 = res.CreditFacilityWithMarginDetails[0];

          // console.log(this.record1);

          // for (let i = 1; i < res.CreditFacilityWithMarginDetails.length; i++) {
          //   this.CreditFacilityNonMarginDetails.push(res.CreditFacilityWithMarginDetails[i]);
          // }
          res.CreditFacilityWithMarginDetails.forEach((element) => {
            this.CreditFacility.push(element);
            this.totalCollateral = this.totalCollateral + element.NettedAmount;
            this.totalconsumedLimit =
              this.totalconsumedLimit + element.LimitUsed;
            this.totalmargin = this.totalmargin + element.Initial_Margin;
            this.totalMTM = this.totalMTM + element.FloatingPNL;
          });
          res.CreditFacilityWith_Non_MarginDetails.forEach((element) => {
            this.CreditFacilityNonMarginDetails.push(element);
          });
          res.PortfolioWith_LiquidCollateral.forEach((element) => {
            this.PortfolioLiquidCollateral.push(element);
            //console.log(this.PortfolioLiquidCollateral);
            this.TotalMarketValueHKD =
              this.TotalMarketValueHKD + element.MarketValueHKD;
            this.totalValueafterLendingRatioHKD =
              this.totalValueafterLendingRatioHKD +
              element.ValueafterLendingRatioHKD;
            this.totalValueafterConcRulesHKD =
              this.totalValueafterConcRulesHKD + element.ValueafterConcRulesHKD;
          });
          // this.CreditFacility = res.
          //console.log(this.CreditFacility);
        } else {
          this.noDataFlag = true;
        }
      }
    );
  }

  changeProduct(choice) {
    this.one = false;
    this.two = false;
    this.three = false;
    switch (choice) {
      case 1:
        this.one = true;

        break;
      case 2:
        this.two = true;

        break;
      case 3:
        this.three = true;
        break;
      default:
        this.one = true;
        break;
    }
  }
}
