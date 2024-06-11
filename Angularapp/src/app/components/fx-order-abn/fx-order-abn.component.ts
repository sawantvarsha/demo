import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FxOrderAbnService } from 'src/app/services/fx-order-abn.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fx-order-abn',
  templateUrl: './fx-order-abn.component.html',
  styleUrls: ['./fx-order-abn.component.scss']
})
export class FxOrderAbnComponent implements OnInit {

  cards: any;
  ccyPairsToAddNewCard: { ccy: any; }[];
  ccyPairsFromTemplate: any[];
  ccyPairs: any[];
  showCurrencySelection: boolean = false;
  assetURL: string;
  availablePairs: any[];
  settlementGroup: any;
  constructor(public fxABNService: FxOrderAbnService, public authService: AuthService) {
    this.cards = [];
    this.ccyPairsToAddNewCard = [];
    this.ccyPairsFromTemplate = [];
    this.ccyPairs = [];
    this.availablePairs = [];
  }

  ngOnInit(): void {
    this.assetURL = environment.assetURL;
    // this.fxABNService.getAvailableCCYPairs(AppConfig.settings.CSP_FX_Order_CCY_Pairs_Common_Data).subscribe((res: any) => {

    //   console.log(res);
    //   if (res.Get_Configurable_Common_DataResult.length !== 0) {
    //     const favoriteCcy: any[] = res.Get_Configurable_Common_DataResult;
    //     this.availablePairs = favoriteCcy.map(c => {
    //       return { ccy: c.DATA_VALUE };
    //     });
    //   }

    // });
    this.fxABNService.getAvailableCCYPairs().subscribe((res: any) => {
      console.log(res);
      if (res.Get_Configurable_Common_DataResult.length !== 0) {
        const favoriteCcy: any[] = res.Get_Configurable_Common_DataResult;
        this.availablePairs = favoriteCcy.map(c => {
          return { ccy: c.DATA_VALUE };
        });
        console.log(this.availablePairs);
      }
    }, err => { console.log(err) });

    this.refreshTiles();
    // this.fxABNService.getAllValidCcyPairs().subscribe(res => {
    //   console.log(res);
    // }, err => { console.log(err) });
  }
  addNewCard(pair: any) {
    this.cards.push({ ccy: pair.ccy, id: this.cards.length, index: this.cards.length + 1 })
  }
  refreshTiles() {
    this.fxABNService.getFavoritesFromTemplate(this.authService.UserName).subscribe(res => {
      this.ccyPairsFromTemplate = res.web_getProductsByTemplateResult;
      if (this.ccyPairsFromTemplate.length > 0) {


        this.fxABNService.getSettelementAccountGroups().subscribe(res => {
          console.log(res);
          const settlementGroup = res.SettelementGroups[0];
          this.settlementGroup = settlementGroup;
          this.ccyPairsFromTemplate = this.ccyPairsFromTemplate.map(c => {
            return {
              ccy: c.ProductName,
              id: c.TileID,
              index: c.SequenceNo,
              favorite: true,
              settlementGroup: this.settlementGroup
            }
          });
          this.ccyPairs = [this.ccyPairsFromTemplate.map(c => c.ccy.replace(/\//g, '')).join(',')];
          this.cards = this.ccyPairsFromTemplate;
        },
          err => {
            console.log(err)
          });

      }
      console.log(this.ccyPairsFromTemplate);

    }, err => { console.log(err) });
  }
}
