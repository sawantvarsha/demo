import { Component, OnInit } from '@angular/core';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import { CustomerApiService } from '../../../services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';

@Component({
  selector: 'app-paymenthistory',
  templateUrl: './paymenthistory.component.html',
  styleUrls: ['./paymenthistory.component.scss']
})
export class PaymenthistoryComponent implements OnInit {

  login: string;
  custId: string;
  paymentHistory = [];
  baseCCY: string;
  constructor(private api: WorkflowApiService, public cfs: CommonApiService, public custapi: CustomerApiService, public homeapi: HomeApiService) { }

  ngOnInit(): void {
    // Do not remove
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // this.baseCCY = sessionStorage.getItem("BankBaseCcy");
    this.login = sessionStorage.getItem('Username');
    this.custId = sessionStorage.getItem('CustomerID');
    this.api.insurancePremium.next([]);
    this.custapi.getBankBaseCCYOBS.subscribe(ccy =>{
  
      this.baseCCY = ccy;
    
      this.homeapi.GetInsurancePremiumDetails(this.login, this.custId, this.baseCCY, this.homeapi.Portfolio || '').subscribe(res => {
        if (res.length !== 0) {
          this.paymentHistory = [];
          //console.log(res);
          res.GetInsurancePremiumDetails_LCYEResult.forEach(element => {
          //console.log(element.InsuranceDetail[9].Value);
            const data = element.InsuranceDetail;
            if (data[9].Value === 'Paid') {
              this.paymentHistory.push(data);
            }
  
          });
          console.log(this.paymentHistory);
        }
      });
    })
  

 
  }

}
