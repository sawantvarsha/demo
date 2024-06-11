import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApifunctionsService } from 'src/app/components/dashboard-new/services/apifunctions.service';
import { CommonfunctionsService } from 'src/app/components/dashboard-new/services/commonfunctions.service';
import { AppConfig } from 'src/app/services/config.service';

@Component({
  selector: 'app-multi-request-launch-card',
  templateUrl: './multi-request-launch-card.component.html',
  styleUrls: ['./multi-request-launch-card.component.scss']
})
export class MultiRequestLaunchCardComponent implements OnInit {


  SelectProduct = "Select Product"
  SelectPortfolio = "Select Portfolio"

  duration: any;
  productNameArr: any[] = [];
  selectedProd: any;
  PopularProdList: any[] = [];
  receivedPortFolios: any[] = [];
  portfolioList: any = '';
  selectedPortfolio:string = '';

  constructor(private apiservice: ApifunctionsService, private router: Router, private commonfunctions: CommonfunctionsService) { }

  async ngOnInit() {
    this.duration = 'Month';
    await this.getPopularProdData();
    this.getPortfolioData();
  }

  launchToMultipricer() {
    console.log(this.selectedProd, this.selectedPortfolio);
    if(this.selectedPortfolio === '')
      return;
    switch (this.selectedProd ) {
      // changes done by Apurva K|| 14-Apr-2023
      case 'EQC_Europe':
        this.router.navigate(['/MultiEarlyRedemption', {'action':'portfolio', 'portfolioID':this.selectedPortfolio}])
        break;

      case 'YieldEnhancement':
        this.router.navigate(['/MultiYeildEnhancement', {'action':'portfolio', 'portfolioID':this.selectedPortfolio}])
        break;
      case 'CustomPayoffs':
        this.router.navigate(['/MultiCustomStrategy', { 'action': 'portfolio', 'portfolioID': this.selectedPortfolio }])
        break;
      case 'ACC':
        this.router.navigate(['/MultiAccu', {'action':'portfolio', 'portfolioID':this.selectedPortfolio}])
        break;

      case 'DAC':
        this.router.navigate(['/MultiDecu', {'action':'portfolio', 'portfolioID':this.selectedPortfolio}])
        break;

      // case 'DRA Autocall':
      //   this.router.navigate(['/multidraautocall', {'action':'portfolio', 'portfolioID':this.selectedPortfolio}])
      //   break;

      // case 'DCN':
      //   this.router.navigate(['/', {'action':'portfolio', 'portfolioID':this.selectedPortfolio}])
      //   break;

      // case 'Dual FI DRA Autocall':
      //   this.router.navigate(['/MultiDualAutocall', {'action':'portfolio', 'portfolioID':this.selectedPortfolio}])
      //   break;

      // case 'Participation':
      //   this.router.navigate(['/multiparticipation', {'action':'portfolio', 'portfolioID':this.selectedPortfolio}])
      //   break;

      // case 'RC':
      //   this.router.navigate(['/multireverseconvertible', {'action':'portfolio', 'portfolioID':this.selectedPortfolio}])
      //   break;
    }

  }

  async getPopularProdData() {
    try {
      console.log('selectedProd', this.selectedProd);
      let temp = this.selectedProd;
      this.productNameArr = [];
      this.PopularProdList = [];
      let res:any = await this.apiservice.BBVAGetPopularProducts(AppConfig.settings.oRes.userID, this.duration);
      // console.log('popular data', res);
      res.forEach((data: any) => {
        this.productNameArr.push(data.Product);
      });
      // console.log('Prods', this.productNameArr.sort());

      for (let i = 0; i < res.length; i++) {
        if (res[i].Product === "EQC_Europe") {
          this.PopularProdList.push({ key: 'EQC_Europe', value: "Autocallable" });
        }
        if (res[i].Product === "YieldEnhancement") {
          this.PopularProdList.push({ key: 'YieldEnhancement', value: "Yield Enhancement" });
        }
        if (res[i].Product === "CustomPayoffs") {
          this.PopularProdList.push({ key: 'CustomPayoffs', value: "Custom Strategy" });
        }
        if (res[i].Product === "ACC") {
          this.PopularProdList.push({ key: 'ACC', value: "Accumulator" });
        }
        if (res[i].Product === "DAC") {
          this.PopularProdList.push({ key: 'DAC', value: "Decumulator" });
        }

        // if (res[i].Product === "AutocallablePhoenix") {
        //   this.PopularProdList.push({ key: 'AutocallablePhoenix', value: "Autocall" });
        // }
        // if (res[i].Product === "ReverseConvertible") {
        //   this.PopularProdList.push({ key: 'ReverseConvertible', value: "RC" });
        // }
        // if (res[i].Product === "CreditTranche") {
        //   this.PopularProdList.push({ key: 'CreditTranche', value: "Credit" });
        // }
        // if (res[i].Product === "Participation") {
        //   this.PopularProdList.push({ key: 'Participation', value: "Participation" });
        // }
        // if (res[i].Product === "DailyRangeAccrual") {
        //   this.PopularProdList.push({ key: 'DailyRangeAccrual', value: "DRA Autocall" });
        // }
        // if (res[i].Product === "DualFIAutocallablePhoenix") {
        //   this.PopularProdList.push({ key: 'DualFIAutocallablePhoenix', value: "Dual FI Autocall" });
        // }
        // if (res[i].Product === "DualFIReverseConvertible") {
        //   this.PopularProdList.push({ key: 'DualFIReverseConvertible', value: "Dual FI RC" });
        // }
        // if (res[i].Product === "DualFIDailyRangeAccrual") {
        //   this.PopularProdList.push({ key: 'DualFIDailyRangeAccrual', value: "Dual FI DRA Autocall" });
        // }
        // if (res[i].Product === "BonusEnhancedNote") {
        //   this.PopularProdList.push({ key: 'BonusEnhancedNote', value: "BEN" });
        // }
        // if (res[i].Product === "CreditLinkedNote") {
        //   this.PopularProdList.push({ key: 'CreditLinkedNote', value: "CLN" });
        // }
        // if (res[i].Product === "DualCurrencyNote") {
        //   this.PopularProdList.push({ key: 'DualCurrencyNote', value: "DCN" });
        // }
      }
      this.PopularProdList = this.PopularProdList.sort((a, b) => { return a.key.localeCompare(b.key) });

      // console.log('PopularProdList',  this.PopularProdList);
      this.getPortfolioData();

    } catch (error) {
    }
    return false;
  }

  async getPortfolioData() {
    try {
      this.receivedPortFolios = [];
      const productName = this.PopularProdList.filter(res => {
        return this.selectedProd === res.value;
      });
     console.log('key' , productName[0].key);
      // Changes by Apurva K
      let res:any = await this.apiservice.BBVAGetPortfolioDashboard(productName[0].key);
      console.log('received portfolio', res);

      res.forEach((data: any) => {
        if (data.created_by === AppConfig.settings.oRes.userID) {
          this.receivedPortFolios.push(data);
        }
      });
      console.log('user portfolio', this.receivedPortFolios);
    } catch (error) {

    }
  }

}
