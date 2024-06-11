import { Component, Input, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/services/excel.service';
import { LCMApiService } from 'src/app/services/lcmapi.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
})
export class PaymentHistoryComponent implements OnInit {
  @Input() data: any;
  @Input() NMID: any;
  recordsPerPage = 10;
  p: any;
  q: any;
  r: any;

  paymentHistoryData: any = [];

  tempData = [
    {
      Account_number: '123',
      Account_type: 'abc',
      Amount_Qty: '3,000,000.00',
      Ccy_Asset: 'USD',
      Customer_Name: 'CitiBank N.A, London Branch',
      Date: '04-Dec-2020',
      Direction: 'buy',
      Event: 'Initial Investment',
      Note_Deal_Id: 'E088416',
      Party_ID: '10',
      Party_Type: 'CounterParty',
    },
    {
      Account_number: '123',
      Account_type: 'abc',
      Amount_Qty: '131,700.00',
      Ccy_Asset: 'USD',
      Customer_Name: 'CitiBank N.A, London Branch',
      Date: '04-Dec-2020',
      Direction: 'buy',
      Event: 'Initial Investment',
      Note_Deal_Id: 'E088417',
      Party_ID: '10',
      Party_Type: 'CounterParty',
    },
    {
      Account_number: '123',
      Account_type: 'abc',
      Amount_Qty: '21,428.57',
      Ccy_Asset: 'USD',
      Customer_Name: 'TRIAL CUSTOMER 2|32750',
      Date: '07-Jan-2021',
      Direction: 'buy',
      Event: 'Coupon',
      Note_Deal_Id: 'E088418',
      Party_ID: '32570',
      Party_Type: 'Customer',
    },
  ];
  constructor(
    public excelservice: ExcelService,
    private lcmapi: LCMApiService
  ) { }

  ngOnInit(): void {
    this.p = 1;
    this.q = 1;
    this.r = 1;

    this.getPaymentHistoryData(this.NMID);
  }

  exportToExcel() {
    console.log();

    if (this.paymentHistoryData) {
      let exportData = this.paymentHistoryData.map(data => (
        {
          "Date": data.Date,
          "Event": data.Event,
          "Ccy/Asset": data.Ccy_Asset,
          "Amount/Quantity": data.Amount_Qty, 
          "Party Type": data.Party_Type, 
          "Party ID": data.Party_ID, 
          "Party Code": data.Customer_Name, 
          "Trade ID": data.Note_Deal_Id
        }))
      let today = new Date();
      this.excelservice.exportAsExcelFile(
        exportData,
        'Payment_History_' + today.toString()
      );
    }
  }

  getPaymentHistoryData(notemasterID) {
    this.lcmapi.DB_PayHistByProd_Data(notemasterID).subscribe((data) => {
      console.log('payhist ', data);
      if (data) {
        this.paymentHistoryData = data;
      }
    });
  }
}
