import { Component, OnInit } from '@angular/core';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-login-rmdetails',
  templateUrl: './login-rmdetails.component.html',
  styleUrls: ['./login-rmdetails.component.scss']
})
export class LoginRMDetailsComponent implements OnInit {
  customerID: string;
  loginRMDetails = [] as any;
  p: any;
  fileName: string;
  toggleGraph: boolean = false;


  constructor( public cfs: CustomerApiService, public homeApi: HomeApiService)
  {
    this.processData();
   }

  ngOnInit(): void {
    this.customerID = this.homeApi.CustomerId;
    this.cfs.GetLoginRMDetails(this.customerID );
    this.cfs.GetLoginRMDetailsObs.subscribe(res => {
      if (res.length !== 0) {
        this.loginRMDetails = res.GetLoginRMDetailsResult;
  //console.log('this.loginRMDetails ', this.loginRMDetails );
      }
    });
  }
  ExportToExcel(){
    this.fileName = this.customerID + 'LoginRMDetailsComponent' + '.xlsx';
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }

  processData() {

  }

  toggleTheme(){
    this.toggleGraph = !this.toggleGraph;
    console.log('toggle yes');
  }

}
