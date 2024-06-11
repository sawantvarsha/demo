import { Component, OnInit } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { MultiRequestService } from 'src/app/services/multi-request.service';

@Component({
  selector: 'app-multirequest',
  templateUrl: './multirequest.component.html',
  styleUrls: ['./multirequest.component.scss']
})
export class MultirequestComponent implements OnInit {
  multiReqCards: any[];
  FXMultiRequestTiles: any[];
  selectedProduct: any;
  isShowProduct: boolean;
  constructor(public multiRequestApi: MultiRequestService, public commonApi: CommonApiService) {
    this.isShowProduct = false;
    this.multiReqCards = [];
    this.FXMultiRequestTiles = [];
  }

  async ngOnInit() {
    this.FXMultiRequestTiles = await this.multiRequestApi.getFXMultiRequestTiles();
    this.multiReqCards = this.FXMultiRequestTiles.filter(m => m.active);
    // this.multiReqCards.push({ name: 'AQ/DQ', active: true });
  }
  selectProduct(card) {
    this.commonApi.HideSidebar(true);
    this.isShowProduct = true;
    this.selectedProduct = card;
  }
  closeProduct() {
    this.isShowProduct = false;
    this.selectedProduct = {};
    this.commonApi.HideSidebar(false);

  }
}
