import { Component, Input, OnInit,OnChanges  } from '@angular/core';
import { Router } from '@angular/router';


import { ApifunctionsService } from 'src/app/components/dashboard-new/services/apifunctions.service';
declare var require: any;
const $: any = require('jquery');

class PopularProductChart {
  type: string = "";
  data: any[] = [];
  options: any = {};
  columnNames: any[] = [];
  width: any;
  height: any;
}
class PopularUnderlyingChart {
  type: string = "";
  data: any[] = [];
  options: any = {};
  columnNames: any[] = [];
  width: any;
  height: any;
}

class PopularTenorChart {
  type: string = "";
  data: any[] = [];
  options: any = {};
  columnNames: any[] = [];
  width: any;
  height: any;
}
class UnderlyingChartData {
  UnderlyingCode: string = "";
  UnderlyingType: string = "";
}
@Component({
  selector: 'app-order-summary-card',
  templateUrl: './order-summary-card.component.html',
  styleUrls: ['./order-summary-card.component.scss']
})
export class OrderSummaryCardComponent implements OnInit {

  PopularProductlabel = "Product"
  PopularUnderlyinglabel = "Underlying"
  PopularTenorlabel = "Tenor"

  maxTenor: String = "";
  maxTenorCount: number = 0;
  maxUnderlying: String = "";

  maxUnderlyingCount: number = 0;
  maxProduct: String = "";
  maxProductCount: number = 0;
  @Input() selectedSegment:any;
  //Data for charts
  @Input () productsChartData: any;
  @Input() underlyingsChartData: any;
  @Input() tenorsChartData: any;
  
  productsChartData1: any;
  underlyingsChartData1: any;

  tenorsChartData1: any;
  RMWBondProductDetailsArr: any = [];

  //Only keep the ones that are used
  PopularProdList: any[] = [];
  PopularProductChecked: string = '';
  popularProdSelected: number = 0;

  CheckedUnderlyingList: string[] = [];
  CheckedUnderlyingString: string = "";
  underlyingVal: boolean[] = []

  PopularTenorList: any[] = [];
  PopularTenorSelected: number = -1;
  PopularTenorChecked: string = '';
  disableTenorOption: string = 'Others';

  PopularProdChart: PopularProductChart = new PopularProductChart();
  PopularUnderlying: PopularUnderlyingChart = new PopularUnderlyingChart();
  PopularTenor: PopularTenorChart = new PopularTenorChart();
  PopularUnderlyingChart: UnderlyingChartData[] = [];

  tempID: any = -1;
  selectedPopular: any = [];
  successMsg: string = "";
  ErrorMsg: string = "";
  ePricerSelection: string = "";
  inputudl = 40;

  extras: any;
  constructor(private apiservice: ApifunctionsService, private route: Router) {
    // this.underlyingsChartData = [];
    this.RMWBondProductDetailsArr = [];
    this.tenorsChartData = [];
  }

  segments: string[] = [];

  tabCase = 'capitalize';

  //Added by Apurva K for populating fav product, underlying and tenor on widget||10-May-2023
  ngOnChanges() {
    this.findMaxValues() ;
  }

  ngOnInit(): void {
    
    
    // this.GetPopularProducts();
    // this.GetPopularTenors();
    // this.GetPopularUnderlyings();
    //this.findMaxValues() ;
   
    this.segments = ["Product", "Underlying", "Tenor"];
    this.handleSegmentChange();
    this.productsChartData1 = [];

    this.underlyingsChartData1 = [];

    this.tenorsChartData1 = [];

    console.log('underlying ', this.underlyingsChartData)
  }

  findMaxValues(){
    try{
      
      this.maxProduct = this.productsChartData.sort((a:any,b:any)=>{
        return a['value'] < b['value'] 
      })[0].title;
  
      this.maxTenor = this.tenorsChartData.sort((a:any,b:any)=>{
        return a['value'] < b['value'] 
      })[0].title;
  
      this.maxUnderlying = this.underlyingsChartData.sort((a:any,b:any)=>{
        return a['value'] < b['value'] 
      })[0].title;
    }
    catch(error){
      console.log(error);
      
    }
    

  }

  handleSegmentChange() {
    // console.log(this.selectedSegment)
  }
  routeToPricer(_e: any, maxProduct: any, maxUnderlying: any, maxTenor: any) {
    try {
      //console.log('params to route', _e, maxProduct, maxUnderlying, maxTenor);
      switch (maxProduct) {
        //Last modified by Apurva K|| 11-May-2023 || for navigation 
        case 'Autocallable':
          this.route.navigate(["/app/euroconnect/pricers/EarlyRedemption"], { queryParams: { Underlying: maxUnderlying, Tenor: maxTenor } });
          break;
        case 'Participation':
          this.route.navigate(["/app/euroconnect/pricers/Participation"], { queryParams: { Underlying: maxUnderlying, Tenor: maxTenor } });
          break;
        case 'Yield Enhancement':
          this.route.navigate(["/app/euroconnect/pricers/YieldEnhancement"], { queryParams: { Underlying: maxUnderlying, Tenor: maxTenor } });
          break;
        case 'Custom Strategy':
          this.route.navigate(["/app/euroconnect/pricers/CustomStrategy"], { queryParams: { Underlying: maxUnderlying, Tenor: maxTenor } });
          break;
        case 'Accumulator':
          this.route.navigate(["/app/euroconnect/pricers/AQ"], { queryParams: { Underlying: maxUnderlying, Tenor: maxTenor } });
          break;
        case 'Decumulator':
          this.route.navigate(["/app/euroconnect/pricers/DQ"], { queryParams: { Underlying: maxUnderlying, Tenor: maxTenor } });
          break;
        // case 'Dual FI Autocall':
        //   this.route.navigate(["/dualautocall"], { queryParams: { Underlying: maxUnderlying, Tenor: maxTenor } });
        //   break;
        // case 'Dual FI RC':
        //   this.route.navigate(["/dualRC"], { queryParams: { Underlying: maxUnderlying, Tenor: maxTenor } });
        //   break;
        // case 'Dual FI DRA Autocall':
        //   this.route.navigate(["/dualDRAAutoCall"], { queryParams: { Underlying: maxUnderlying, Tenor: maxTenor } });
        //   break;
        // case 'Credit Linked Note':
        //   this.route.navigate(["/CreditLinkedNote"], { queryParams: { Underlying: maxUnderlying, Tenor: maxTenor } });
        //   break;
        // case 'Credit Tranche':
        //   this.route.navigate(["/credittranche"], { queryParams: { Underlying: maxUnderlying, Tenor: maxTenor } });
        //   break;
        // case 'Dual Currency Note':
        //   this.route.navigate(["/FX"], { queryParams: { Underlying: maxUnderlying, Tenor: maxTenor } });
        //   break;
        //   //Added case CLI | Anubhav Goyal | 30-01-2023 | BBVACLI-773 
        // case 'Credit Linear Index':
        //   this.route.navigate(["/LinearTranche"], { queryParams: { Underlying: maxUnderlying, Tenor: maxTenor } });
        //   break;

      }
    } catch (error) {

    }
  }

  setProductNameFromChart(event: any) {
    switch (this.selectedSegment) {
      case 0:
        this.maxProduct = event;
        break;
      case 1:
        this.maxUnderlying = event;
        break;
      case 2:

        this.maxTenor = event;
        break;
      default:
        break
    }
  }

}
