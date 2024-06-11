import { Component, Input, OnInit } from '@angular/core';
import { LCMApiService } from 'src/app/services/lcmapi.service';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss']
})
export class ViewOrdersComponent implements OnInit {

  @Input() data: any = [];
  
  constructor(private api: LCMApiService) { }

  ordersData: any = [];
  I_EntityId: any = "149";
  I_lngNoteMasterID: any = "";
  I_strCreatedBy: any = "SOLAR_T1";
  I_strFromDate: any = "";
  I_strToDate: any = "";
  LoginID: any = "SOLAR_T1";
  PrdType: any = "BOTH";
  strBranchName: any = "";
  strISIN: any = "";
  strIssuerID: any = "0";
  strOrderNo: any = "";
  strSchemeName: any  = "";
  str_CusID: any  = "0";
  str_OrderStatus: any = "All";
  str_RMName: any = "";
  strcboserchcustomer: any = "";
  strissuertype: any = "All";
  strordertype: any = "All";
  I_strAccountNo: any = "";
  I_strFundCode: any = "";
  I_strShowOrdersFor: any = "NonFunds";
  ShowAdditionalColumns: any = "N";
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  loader = true;

  ngOnInit(): void {

    console.log("Data ...",this.data["Note_Master_ID"]);
    this.I_lngNoteMasterID = this.data["Note_Master_ID"];

    this.getOrdersData();

  }

  getOrdersData(){ 
    this.api.getViewOrdersData(this.I_EntityId,this.I_lngNoteMasterID,this.I_strCreatedBy,this.I_strFromDate,this.I_strToDate,this.LoginID,this.PrdType,this.strBranchName,
    this.strISIN,this.strIssuerID,this.strOrderNo,this.strSchemeName,this.str_CusID,this.str_OrderStatus,this.str_RMName,this.strcboserchcustomer,this.strissuertype,
    this.strordertype,this.I_strAccountNo,this.I_strFundCode,this.I_strShowOrdersFor,this.ShowAdditionalColumns)
    .subscribe((res: any) => 
    {
      this.ordersData = res.Db_Get_OrdersForSelectedProductResult;
      this.ordersData = this.ordersData.map((h: any) => {
        h.formattedNotional = this.formatNotional(h.Nominal_Amount);      
        h.formattedDate = this.formatDate(h.Trade_Date);   
        return h;
      });
      this.loader = false;
      // if(this.ordersData.length > 0 ) {
      //   this.loader = false;
      // }
      console.log("res getViewOrdersData",this.ordersData);
      
    })
  }

  formatNotional(value: string) {
    return parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  formatDate(date: any){
    // let formatted_: any = [];
    let tempDate = date.split('/');
    // console.log("tempdate = ",tempDate);    
    return (tempDate[1] + '-' + this.months[tempDate[0] - 1] + '-' + tempDate[2])
    // formatted_  = (tempDate[2] + '-' + this.months[tempDate[1] - 1] + '-' + tempDate[0])

  }
}
