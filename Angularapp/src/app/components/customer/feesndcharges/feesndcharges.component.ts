import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { CustomerApiService } from '../../../services/customer-api.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';

@Component({
  selector: 'app-feesndcharges',
  templateUrl: './feesndcharges.component.html',
  styleUrls: ['./feesndcharges.component.scss']
})
export class FeesndchargesComponent implements OnInit, OnDestroy {

  isProd = environment.production;
  Blotter = [];
  IsLoading = false;
  CustomerFeesandChargeSubscriber: Subscription;

  constructor(public afs: WorkflowApiService, public cfs: CustomerApiService, public authApi: AuthService, public homeApi: HomeApiService) { }

  ngOnInit(): void {
    // Do not remove
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    const username = this.authApi.UserName;
    const customerID = this.homeApi.CustomerId;
    this.IsLoading = true;
    this.cfs.fnGetCustomerFeesandCharge(customerID, username);

    this.CustomerFeesandChargeSubscriber = this.cfs.CustomerFeesandChargeObserver.subscribe(res => { //updated by Uddesh on 7 Feb, 2022
      if (res.length !== 0) {
        this.Blotter = [];
        res.forEach(element => {
          //validations added by Uddesh on 7 Feb, 2022 asked by Mohan
          if(element.AssetClass == 'MF' || element.AssetClass == 'UT'){
            element.AssetClass = 'FUNDS'
          } else if(element.AssetClass == 'FI'){
            element.AssetClass = 'BONDS'
          } else if(element.AssetClass == 'EQ'){
            element.AssetClass = 'SHARES'
          } else{
            element.AssetClass = 'OTHER'
          }

          this.Blotter.push(element);

        });
        this.IsLoading = false;
      }
    });
    
  }
  ngOnDestroy(): void {
    this.CustomerFeesandChargeSubscriber.unsubscribe();
  }
}
