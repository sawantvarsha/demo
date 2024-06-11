import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';

@Component({
  selector: 'app-collateral-pdf',
  templateUrl: './collateral-pdf.component.html',
  styleUrls: ['./collateral-pdf.component.scss']
})
export class CollateralPDFComponent implements OnInit {

  Format = 'PDF';
  SendAs = 'Download';
  UserID: string;
  CustomerID: string;
  interfaceUrl = environment.interfaceURL;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  PDFLink: any;

  constructor(private http: HttpClient, public authapi: AuthService, public homeapi: HomeApiService) { }

  ngOnInit(): void {
    this.UserID = this.authapi.UserName;
    this.CustomerID = this.homeapi.CustomerId;
    // this.api.collateralPDFObserver.subscribe(res => {
    //   console.log(res);
    // });
  }

  GeneratePortfolioStatement() {
    // this.api.getCollateralCreditSummaryReportData(this.login, this.custId);
    const PdfURL = this.http.get<any>(this.interfaceUrl + 'GenerateCollateralCreditSummaryReportData/' + this.UserID + '/' + this.CustomerID , { headers: this.headerOptions });

    PdfURL.subscribe(res => {
      if (res) {
  //console.log(res);
        this.PDFLink = res.URL;
        window.open(this.PDFLink);
      }
    });
  }
}
