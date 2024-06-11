import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeApiService } from '../../../app/services/home-api.service';
import { Router } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';

@Component({
  selector: 'app-collateral',
  templateUrl: './collateral.component.html',
  styleUrls: ['./collateral.component.scss'],
})
export class CollateralComponent implements OnInit, OnDestroy {
  IsBackButtonEnabled: boolean;

  constructor(
    public router: Router,
    public homeapi: HomeApiService,
    public commonApi: CommonApiService
  ) {}

  ngOnDestroy(): void {
    this.homeapi.RediretToHomeBuySellPledge = '';
  }

  ngOnInit(): void {
    this.IsBackButtonEnabled =
      this.homeapi.RediretToHomeBuySellPledge === '' ? false : true;
  }

  fnRedirectToHomePage() {
    if (this.homeapi.RediretToHomeBuySellPledge === 'HOME') {
      // this.homeapi.openPopup =true;
      this.router.navigate(['/home']);
      this.homeapi.RediretToHomeBuySellPledge = '';
    } else {
      // this.router.navigate(['/portfolioallocation']);
    }
  }
}
