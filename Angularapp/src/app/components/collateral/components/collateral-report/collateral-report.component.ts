import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WorkflowApiService } from '../../../../services/workflow-api.service';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { CollateralApiService } from '../../collateral-api/collateral-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-collateral-report',
  templateUrl: './collateral-report.component.html',
  styleUrls: ['./collateral-report.component.scss']
})
export class CollateralReportComponent implements OnInit {
  pageName = 'Workflow';
  isProd = environment.production;
  FundsBlotterArray = [];
  userID: string;
  CustomerID: string;
  blotter = [];
  CreditFacility = [];
  username = '';
  custId = '';
  CreditFacilityWithNonMarginDetails: any[] = [];
  PortfolioWithLiquidCollateral: any[] = [];
  baseCCY: string;

  constructor(public afs: WorkflowApiService, public cfs: CustomerApiService, public api: CollateralApiService, public homeapi: HomeApiService, public authapi: AuthService) { }

  ngOnInit(): void {
    // this.baseCCY = sessionStorage.getItem("BankBaseCcy");
    this.cfs.getBankBaseCCYOBS.subscribe(ccy => {
      this.baseCCY = ccy;
    })
    const username = this.authapi.UserName;
    //Added by ruchira custaccountdetailsservice change || 22-11-2021
    this.CustomerID = this.homeapi.CustomerId; 
     this.afs.getAllOrderDetails(this.CustomerID, this.homeapi.Portfolio || '');
        this.api.GetCollateralReportData(username, 32710, this.baseCCY);
    //commented by ruchira custaccountdetailsservice change || 22-11-2021
    // this.cfs.fngetCustAccountDetails(username);
    // this.cfs.getCustAccountDetails.subscribe(res => {
    //   if (res.length !== 0) {
  //console.log(res);

        // this.CustomerID = res.CustomerID;
        // this.afs.getAllOrderDetails(this.CustomerID);
        // this.api.GetCollateralReportData(username, 32710, this.baseCCY);
    //   }
    // });

    this.afs.orderDetailsObserver.subscribe(res => {
      if (res.length !== 0) {
        this.blotter = [];
        res.forEach(element => {
          this.blotter.push(element.OrderDetail);
        });
        //console.log(this.blotter);
      }
    });

    this.api.collateralReportObserver.subscribe(res => {
      if (res.length !== 0) {

        //console.log(res.CreditFacilityWithMarginDetails);
        res.CreditFacilityWithMarginDetails.forEach(element => {
          this.CreditFacility.push(element);
        });
        // this.CreditFacility = res.
        //console.log(this.CreditFacility);
      }
    });
  }
}
