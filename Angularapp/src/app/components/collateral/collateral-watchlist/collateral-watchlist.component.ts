import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';

@Component({
  selector: 'app-collateral-watchlist',
  templateUrl: './collateral-watchlist.component.html',
  styleUrls: ['./collateral-watchlist.component.scss'],
})
export class CollateralWatchlistComponent implements OnInit {
  isRM: boolean;
  baseCCY: string;
  ClientSummaryResult: any[];
  watchlistData: any;
  custDetails: { CustomerID: number; CustomerName: string; GroupId: string };
  constructor(
    public commonApi: CommonApiService,
    public workflowApi: WorkflowApiService,
    public authorApi: AuthService,
    public custapi: CustomerApiService,
    public homeApi: HomeApiService
  ) {
    this.isRM = false;
    this.watchlistData = [];
  }

  async ngOnInit() {
    this.custDetails = {
      CustomerID: 102,
      CustomerName: 'Apollo',
      GroupId: '',
    };
    await this.getGroupId();
    this.custapi.getBankBaseCCYOBS.subscribe(async (ccy) => {
      this.baseCCY = ccy;

      this.homeApi.CustomerMappedToRM =
        await this.workflowApi.GetClientSummaryAsync(
          this.authorApi.EntityID,
          this.authorApi.UserName,
          this.baseCCY
        );

      // if (!this.homeApi.CustomerMappedToRM.length) {
      //   this.workflowApi
      //     .GetClientSummary(
      //       this.authorApi.EntityID,
      //       this.authorApi.UserName,
      //       this.baseCCY
      //     )
      //     .subscribe((res) => {
      //       if (res.length !== 0) {
      //         let data = [];
      //         data = JSON.parse(res.GetRMPortalClientSummary_LCYEResult);
      //         console.log(data);
      //         this.ClientSummaryResult = data.sort((a, b) =>
      //           a.LongName > b.LongName ? 1 : -1
      //         );
      //         this.homeApi.CustomerMappedToRM = this.ClientSummaryResult;
      //       }
      //     });
      // }
      this.ClientSummaryResult = this.homeApi.CustomerMappedToRM;
      this.watchlistData = this.ClientSummaryResult.map((c) => {
        const obj = {
          id: c.CustomerID,
          value: c.LongName,
          data1: c.AUM,
          data2: c.Volume,
          data3: c.PnL,
          data4: c.Collateral,
        };
        return obj;
      });
      console.log(this.ClientSummaryResult);
    });
  }
  selectedWatchlistDataEvent(_event) {
    console.log(_event);
  }
  async getGroupId() {
    this.custDetails.GroupId = await this.workflowApi.GetCustomerGroupDataAsync(
      this.custDetails.CustomerID
    );
  }
}
