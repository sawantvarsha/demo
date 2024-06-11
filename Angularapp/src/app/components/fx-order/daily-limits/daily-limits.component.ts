import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonfunctionService } from '../commonfunction.service';
@Component({
  selector: 'app-daily-limits',
  templateUrl: './daily-limits.component.html',
  styleUrls: ['./daily-limits.component.css']
})
export class DailyLimitsComponent {

  commonfunction: CommonfunctionService;
  workflowRecords = [
    {
      'Customer': 'BNP Paribas Arbitrage Issurance B.V. (I) ',
      'maxTradingLimit': [{ 'ccy': 'AUD', 'limit': 1000000 }, { 'ccy': 'EUR', 'limit': 500000 }, { 'ccy': 'USD', 'limit': 1000000 }],
      'minTradingLimit': 50000
    },
    {
      'Customer': 'CUSTOMER 2|32099',
      'maxTradingLimit': [{ 'ccy': 'AUD', 'limit': 200000 }, { 'ccy': 'EUR', 'limit': 5000000 }, { 'ccy': 'GBP', 'limit': 500000 }, { 'ccy': 'JPY', 'limit': 5000000 }, { 'ccy': 'NZD', 'limit': 1000000 }, { 'ccy': 'SGD', 'limit': 2000000 },{ 'ccy': 'USD', 'limit': 1000000 }],
      'minTradingLimit': 25000
    },
    {
      'Customer': 'CUSTOMER 3|32100',
      'maxTradingLimit': [{ 'ccy': 'AUD', 'limit': 1000000 }, { 'ccy': 'EUR', 'limit': 500000 }, { 'ccy': 'USD', 'limit': 1000000 }],
      'minTradingLimit': 10000
    },
    {
      'Customer': 'CUSTOMER 4|32101',
      'maxTradingLimit': [{ 'ccy': 'AUD', 'limit': 1000000 }, { 'ccy': 'EUR', 'limit': 500000 }, { 'ccy': 'USD', 'limit': 1000000 }],
      'minTradingLimit': 20000
    },
    {
      'Customer': 'EGYPT DEMO CUSTOMER|32106',
      'maxTradingLimit': [{ 'ccy': 'AUD', 'limit': 1000000 }, { 'ccy': 'EUR', 'limit': 500000 }, { 'ccy': 'USD', 'limit': 1000000 }],
      'minTradingLimit': 15000
    },
    {
      'Customer': 'P386 & P478|32105',
      'maxTradingLimit': [{ 'ccy': 'AUD', 'limit': 1000000 }, { 'ccy': 'EUR', 'limit': 500000 }, { 'ccy': 'USD', 'limit': 1000000 }],
      'minTradingLimit': 25000
    }, {
      'Customer': 'SUN CUSTOMER|26723',
      'maxTradingLimit': [{ 'ccy': 'AUD', 'limit': 1000000 }, { 'ccy': 'EUR', 'limit': 500000 }, { 'ccy': 'USD', 'limit': 1000000 }],
      'minTradingLimit': 50000
    }
  ];
  edit = false;
  editID: number;
  showPopupFlag = false;
  limitData = [];
  popupEdit = false;
  popupEditID: number;
  selectedCustomer: string;
  domainURL = environment.domainURL;
  constructor(cfs: CommonfunctionService) {
    this.commonfunction = cfs;
  }

  popupShow(record) {
    try {
      this.showPopupFlag = true;
      this.limitData = record.maxTradingLimit;
      this.selectedCustomer = record.Customer;
      (<HTMLInputElement>document.getElementById('overlay')).style.display = 'block';
    } catch (ex) {
//console.log(ex);
    }
  }
  popupClose() {
    (<HTMLInputElement>document.getElementById('overlay')).style.display = 'none';
    this.showPopupFlag = false
  }
}
