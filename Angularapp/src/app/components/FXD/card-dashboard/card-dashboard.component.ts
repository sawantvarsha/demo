import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { AppConfig } from 'src/app/services/config.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { FxdApifunctionService } from '../services/fxd-apifunction.service';

@Component({
  selector: 'app-card-dashboard',
  templateUrl: './card-dashboard.component.html',
  styleUrls: ['./card-dashboard.component.scss']
})
export class CardDashboardComponent implements OnInit {

  @Input() ProductName: string;
  Mode: string;
  UserGroup: string;
  PricingMode: string;
  AppMode: string;
  ViewMode: string = 'Card';

  ProductCards = [];

  constructor(private FXD_afs: FxdApifunctionService, public AuthorAPI: AuthService, public CustAPI: CustomerApiService, public commonApi: CommonApiService) {
    this.Mode = 'FXOSEN';
    this.UserGroup = 'Dealer';
    this.PricingMode = 'AUTO';
   }

  ngOnInit(): void {

    this.fnLoadValuesInSubPage();
    this.FXD_afs.fnGetAllProductinfo(this.FXD_afs.EntityID, 'FXOQEN', this.FXD_afs.UserName,'FXOption').subscribe((res) => {
      if (res) {
        res.GetAllProductInfoResult.forEach((element) => {
          this.ProductCards.forEach((ProductCardsEle) => {
            if (element.Product_Code === ProductCardsEle.Product_Code && element.Product_Name === ProductCardsEle.Product_Name) {
              ProductCardsEle.Product_Id = element.Product_Id;
              ProductCardsEle.Product_Name = element.Product_Name;
            }
          });
        });
      }
    });
    this.AppMode = AppConfig.settings.CSP_FXD_Mode;
    console.log(this.ProductCards);
  }

  fnLoadValuesInSubPage() {
    this.ProductCards = [
      {
        name: 'Vanilla',
        Product_Id: '27',
        Product_Code: 'FXOption',
        Product_Name: 'Vanilla',
        displayYN: true,
        activeYN: true,
      },
      {
        name: 'Barrier',
        Product_Id: '',
        Product_Code: 'FXBarrier',
        Product_Name: 'Barrier',
        displayYN: true,
        activeYN: false,
      },
      {
        name: 'Digital',
        Product_Id: '106',
        Product_Code: 'Digital',
        Product_Name: 'Digital',
        displayYN: true,
        activeYN: false,
      },
      {
        name: 'Strategies',
        Product_Id: '',
        Product_Code: 'STRADDLE',
        Product_Name: 'Straddle',
        displayYN: true,
        activeYN: false,
      },
      {
        name: 'AQ/DQ',
        Product_Id: '155', // 33 Changed by Ketan
        // Product_Code: 'FXAccum',
        Product_Code: 'FXAccum',// 'FXAQ', Changed by Mohan
        Product_Name: 'AQ ',//'FXAQ', Changed by Mohan
        displayYN: true,
        activeYN: false,
      },
      {
        name: 'TRF',
        Product_Id: '67',
        Product_Code: 'TEKO',
        Product_Name: 'TRF Buy',
        displayYN: true,
        activeYN: false,
      },
      {
        name: 'Pivot',
        Product_Id: '70',
        Product_Code: 'Pivot',
        Product_Name: 'Pivot',
        displayYN: true,
        activeYN: false,
      },
      {
        name: 'DCI',
        Product_Id: '51',
        Product_Code: 'DCD',
        Product_Name: 'Dual Currency Investment',
        displayYN: true,
        activeYN: false,
      },
    ];
  }

}
