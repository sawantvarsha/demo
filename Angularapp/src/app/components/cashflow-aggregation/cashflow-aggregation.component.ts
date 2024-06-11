import { Component, OnInit } from '@angular/core';
import { HomeApiService } from 'src/app/services/home-api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cashflow-aggregation',
  templateUrl: './cashflow-aggregation.component.html',
  styleUrls: ['./cashflow-aggregation.component.scss']
})
export class CashflowAggregationComponent implements OnInit {

  template: any = "ALL";
  currency: any = "ALL";
  settlementType: any = "ALL";
  refProdId: any;
  exchange: any = "ALL";
  underlying: any = "ALL";
  customer: any;
  paymentType: any = "ALL";
  fromDate: any;
  toDate: any;
  recordsPerPage: any = 8;
  isExpand: any = false;
  expandAllFlag = false;
  sortFilter = [{
    col: "Ref Prod Id",
    asc: true
  },
  {
    col: "Payment Date",
    asc: true
  },
  {
    col: "Product Name",
    asc: true
  }]


  data: any = [
    {
      'date': '23-May-2022',
      'records': [
        {
          'refProdId': '176101',
          'payReceive': "Pay",
          'productType': 'Equity Autocallable (specific)',
          'productName': 'Fixed Coupon Autocall on , GOOG.OQ 6m Strike@90.00% KO@102.00% Coupon@12.00% #424197',
          'paymentEvent': 'Client Pay Interest',
          'settType': 'CASH',
          'settIn': 'USD',
          'payment': '31,000.00',
          'partyName': 'ABHISHEK JAUNSARI|32899'
        },
        {
          'refProdId': '176101',
          'payReceive': "Receive",
          'productType': 'Interest rate Swaps',
          'productName': 'RBS 6.125%, 12/15/2022',
          'paymentEvent': 'Client Pay Interest',
          'settType': 'CASH',
          'settIn': 'USD',
          'payment': '31,000.00',
          'partyName': 'ABHISHEK JAUNSARI|32899'
        }
      ]
    },
    {
      'date': '23-May-2022',
      'records': [
        {
          'refProdId': '176101',
          'payReceive': "Pay",
          'productType': 'Equity Autocallable (specific)',
          'productName': 'Fixed Coupon Autocall on , GOOG.OQ 6m Strike@90.00% KO@102.00% Coupon@12.00% #424197',
          'paymentEvent': 'Client Pay Interest',
          'settType': 'CASH',
          'settIn': 'USD',
          'payment': '31,000.00',
          'partyName': 'ABHISHEK JAUNSARI|32899'
        },
        {
          'refProdId': '176101',
          'payReceive': "Receive",
          'productType': 'Interest rate Swaps',
          'productName': 'RBS 6.125%, 12/15/2022',
          'paymentEvent': 'Client Pay Interest',
          'settType': 'CASH',
          'settIn': 'USD',
          'payment': '31,000.00',
          'partyName': 'ABHISHEK JAUNSARI|32899'
        }
      ]
    },
    {
      'date': '29-Apr-2022',
      'records': [
        {
          'refProdId': '398002',
          'payReceive': "Pay",
          'productType': 'EQC',
          'productName': 'Buy 100 Microsoft Corp @ USD 288.4500',
          'paymentEvent': 'Share_Pay_Receive',
          'settType': 'SHARE',
          'settIn': 'MSFT.OQ',
          'payment': '100.00',
          'partyName': 'DIAMOND|32490'
        },
        {
          'refProdId': '398002',
          'payReceive': "Pay",
          'productType': 'Interest rate Swaps',
          'productName': 'Buy 100 Microsoft Corp @ USD 288.4500',
          'paymentEvent': 'Share_Pay_Receive',
          'settType': 'SHARE',
          'settIn': 'MSFT.OQ',
          'payment': '100.00',
          'partyName': 'DIAMOND|32490'
        }
      ]
    },
    {
      'date': '30-Apr-2022',
      'records': [
        {
          'refProdId': '115012',
          'payReceive': "Pay",
          'productType': 'EQC',
          'productName': 'Buy 100 Microsoft Corp @ USD 288.4500',
          'paymentEvent': 'Share_Pay_Receive',
          'settType': 'SHARE',
          'settIn': 'MSFT.OQ',
          'payment': '100.00',
          'partyName': 'TEST|32490'
        }
      ]
    },
    {
      'date': '30-Apr-2022',
      'records': [
        {
          'refProdId': '115012',
          'payReceive': "Pay",
          'productType': 'EQC',
          'productName': 'Buy 100 Microsoft Corp @ USD 288.4500',
          'paymentEvent': 'Share_Pay_Receive',
          'settType': 'SHARE',
          'settIn': 'MSFT.OQ',
          'payment': '100.00',
          'partyName': 'TEST|32490'
        }
      ]
    },
    {
      'date': '30-Apr-2022',
      'records': [
        {
          'refProdId': '115012',
          'payReceive': "Pay",
          'productType': 'EQC',
          'productName': 'Buy 100 Microsoft Corp @ USD 288.4500',
          'paymentEvent': 'Share_Pay_Receive',
          'settType': 'SHARE',
          'settIn': 'MSFT.OQ',
          'payment': '100.00',
          'partyName': 'TEST|32490'
        }
      ]
    },
    {
      'date': '30-Apr-2022',
      'records': [
        {
          'refProdId': '115012',
          'payReceive': "Pay",
          'productType': 'EQC',
          'productName': 'Buy 100 Microsoft Corp @ USD 288.4500',
          'paymentEvent': 'Share_Pay_Receive',
          'settType': 'SHARE',
          'settIn': 'MSFT.OQ',
          'payment': '100.00',
          'partyName': 'TEST|32490'
        }
      ]
    },
    {
      'date': '30-Apr-2022',
      'records': [
        {
          'refProdId': '115012',
          'payReceive': "Pay",
          'productType': 'EQC',
          'productName': 'Buy 100 Microsoft Corp @ USD 288.4500',
          'paymentEvent': 'Share_Pay_Receive',
          'settType': 'SHARE',
          'settIn': 'MSFT.OQ',
          'payment': '100.00',
          'partyName': 'TEST|32490'
        }
      ]
    },
    {
      'date': '30-Apr-2022',
      'records': [
        {
          'refProdId': '115012',
          'payReceive': "Pay",
          'productType': 'EQC',
          'productName': 'Buy 100 Microsoft Corp @ USD 288.4500',
          'paymentEvent': 'Share_Pay_Receive',
          'settType': 'SHARE',
          'settIn': 'MSFT.OQ',
          'payment': '100.00',
          'partyName': 'TEST|32490'
        }
      ]
    },
    {
      'date': '30-Apr-2022',
      'records': [
        {
          'refProdId': '115012',
          'payReceive': "Pay",
          'productType': 'EQC',
          'productName': 'Buy 100 Microsoft Corp @ USD 288.4500',
          'paymentEvent': 'Share_Pay_Receive',
          'settType': 'SHARE',
          'settIn': 'MSFT.OQ',
          'payment': '100.00',
          'partyName': 'TEST|32490'
        }
      ]
    },
    {
      'date': '30-Apr-2022',
      'records': [
        {
          'refProdId': '115012',
          'payReceive': "Pay",
          'productType': 'EQC',
          'productName': 'Buy 100 Microsoft Corp @ USD 288.4500',
          'paymentEvent': 'Share_Pay_Receive',
          'settType': 'SHARE',
          'settIn': 'MSFT.OQ',
          'payment': '100.00',
          'partyName': 'TEST|32490'
        }
      ]
    },
    {
      'date': '30-Apr-2022',
      'records': [
        {
          'refProdId': '115012',
          'payReceive': "Pay",
          'productType': 'EQC',
          'productName': 'Buy 100 Microsoft Corp @ USD 288.4500',
          'paymentEvent': 'Share_Pay_Receive',
          'settType': 'SHARE',
          'settIn': 'MSFT.OQ',
          'payment': '100.00',
          'partyName': 'TEST|32490'
        }
      ]
    }
  ]

  rowToExpand: boolean[] = [];
  IsBackButtonEnabled: any;
  p: any;
  q: any;
  r: any;

  expand: any = Array(this.data.length).fill(false);
  constructor(public homeapi: HomeApiService, public location: Location) { }

  ngOnInit(): void {

    this.IsBackButtonEnabled =
      this.homeapi.RediretToHomeBuySellPledge === '' ? false : true;

    this.p = 1;
    this.q = 1;
    this.r = 1;
  }

  orderChanged(index) {
    this.sortFilter[index].asc = !this.sortFilter[index].asc;
    console.log('changed ');

  }

  expandRow(index) {
    this.rowToExpand[index] = !this.rowToExpand[index];
    this.expand[index] = !this.expand[index];
    // if(this.data[index].records.length  == 1){
    //   this.expand[index] = false;
    // }
  }

  back() {
    this.location.back();
  }

  expandAll() {
    this.expandAllFlag = !this.expandAllFlag;
    if (this.expandAllFlag)
      this.expand = Array(this.data.length).fill(true);
    else
      this.expand = Array(this.data.length).fill(false);
  }

}
