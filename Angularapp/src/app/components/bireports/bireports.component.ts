import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AssetExposureService } from './asset-exposure/asset-exposure.service';
import { BarrierProbabilityService } from './barrier-probability/barrier-probability.service';
import { BarrierWatchService } from './barrier-watch/barrier-watch.service';
import { KiAndWorstOfPerformanceService } from './ki-and-worst-of-performance/wof-and-ki-filter.service';
import { KoAndWorstOfPerformanceService } from './ko-and-worst-of-performance/wof-and-ko-filter.service';
import { MtmAndKiFilterService } from './mtm-and-ki/mtm-and-ki-filter.service';
import { MtmAndKoFilterService } from './mtm-and-ko/mtm-and-ko-filter.service';
import { GreekLcmFilterService } from './greek-lcm/greek-lcm-filter.service';
import { FilterService } from './sales-and-revenue-performance/filter.service';
import { DashboardServiceService } from './galaxy-dashboard/dashboard-service.service';
import { threadId } from 'worker_threads';
import { AppConfig } from 'src/app/services/config.service';
import { SpInteractiveDataService } from 'src/app/services/sp-interactive-data.service';
import { Router  } from '@angular/router';

class ElementRef<T>{
  nativeElement!: T
}

export type Data = {
  InteractiveDataResponse: string;
}

type voidFunction=(id:number)=>void

@Component({
  selector: 'app-bireports',
  templateUrl: './bireports.component.html',
  styleUrls: ['./bireports.component.scss'],
})
export class BIReportsComponent implements OnInit {

  @ViewChild("links") ctx = new ElementRef<HTMLDivElement>();

  currentRoute: string;
  selected: number = 1
  constructor(private http: HttpClient, private mtmAndkoService: MtmAndKoFilterService, private salesAndRevenueService: FilterService, private mtmAndKiService: MtmAndKiFilterService, private koAndwopService: KoAndWorstOfPerformanceService, private kiAndwopService: KiAndWorstOfPerformanceService, private barrierProbabilityService: BarrierProbabilityService, private barrierWatchService: BarrierWatchService, private assetexposureservice: AssetExposureService, private dashboardServiceService: DashboardServiceService,private GreekLcmService: GreekLcmFilterService ,private readonly apiService: SpInteractiveDataService, private router: Router
  ) {
    let route = router.url.split('/lcm/')[1];  //Added by AdilP
    switch (route) {
      case 'wofpr':
        this.selected = 0
        break;
      case 'mtmpr':
        this.selected = 1
        break;
      case 'greeks':
        this.selected = 2
        break;
    }
    this.userName = sessionStorage.getItem("Username")
  }
  pageloadflag : boolean = false;
  salesAndRevenueData: any;
  BarrierProbabilityData: any;
  AssetExposureData: any;
  KIandKOData: any;
  greekChartData: any;
  chart: any = []
  userName: any
  header = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  ngOnInit(): void {
    try {
      this.pageloadflag = true;
      setTimeout(async () => {

        //await this.getChart();
        // code commented by AdilP || 13-09-2023
        // this.salesAndRevenueData = this.apiService.GetInteractivedata({ TemplateCode: "USP_SalesRevenuePerformance_PBIReport_Santander" }).then(value => {
        //   this.salesAndRevenueService.setApiData(value);
        //   this.salesAndRevenueService.dataReceived.emit();
        // });

        // this.BarrierProbabilityData = this.apiService.GetInteractivedata({
        //   TemplateCode: "USP_LifecycleSnapshot_PBIReport_Santander",
        //   FromDate: "01-Oct-2022",
        //   ToDate: "31-Oct-2022",
        // }).then((data) => {
        //   var data1 = new Map<any, any>();

        //   var data2 = new Map<any, any>()
        //   data.map((ele: any) => {
        //     data1.set(ele.ProductID, ele)
        //     data2.set(ele.ISIN, ele)
        //   })
        //   var fileteredData = [...data1.values()].map((ele) => {
        //     if (isNaN(parseFloat(ele["KIProbability"]))) {
        //       ele["KIProbability"] = "0"
        //     }
        //     if (isNaN(parseFloat(ele["KOProbability"]))) {
        //       ele["KOProbability"] = "0"
        //     }
        //     return ele
        //   })
        //   this.barrierProbabilityService.setApiData([...fileteredData])
        //   this.setBarrierWatchProperties(data, fileteredData)
        //   this.barrierWatchService.dataReceived.emit()

        //   this.barrierProbabilityService.dataReceived.emit()
        // })

        // this.AssetExposureData = this.apiService.GetInteractivedata({ TemplateCode: "USP_ConcentrationByUnderlying_PBIReport_Santander" }).then(value => {
        //   this.assetexposureservice.setApiData(value);
        //   this.assetexposureservice.dataReceived.emit();
        // });

        if (this.selected == 0 || this.selected == 1) {
          this.KIandKOData = await this.apiService.GetInteractivedata({
            TemplateCode: "USP_Get_PerformanceTimeline_PBIReport",
            FromDate: "",
            ToDate: "",
          }).then((data) => {
            if(this.selected== 0){
              this.kiAndwopService.setData(data);
            this.kiAndwopService.dataReceived.emit()
            }else{
              this.mtmAndKiService.setData(data)
              this.mtmAndKiService.dataReceived.next()
            }
            
            //this.mtmAndkoService.setData(data)
            //this.koAndwopService.dataReceived.emit()
            //this.koAndwopService.setData(data);
            //this.mtmAndkoService.dataReceived.emit()
          });
        }
        // Added by AdilP @13-09-2023        

        if(this.selected == 2 ){
          this.greekChartData = await this.apiService.GetInteractivedata({
            TemplateCode: "USP_Get_Greek_Details",
            FromDate: "",
            ToDate: "",
          }).then((data) => {
            //console.log('greeks data', data);
            this.GreekLcmService.setData(data);
            this.GreekLcmService.dataReceived.emit();
          });
        }
        this.pageloadflag = false;

      });
      // this.selection(this.selected);

    } catch (error) {
      console.log(error);
    }
  }


  setBarrierWatchProperties(data: any, value1: any) {
    var data1 = value1
    
    

    const aggregatedData = {};
    var data2 = []
    // Function to aggregate notional values
    const aggregateNotional = (element) => {
      element.forEach((item) => {
        const { ProductID, Notional } = item;
        if (aggregatedData.hasOwnProperty(ProductID)) {
          aggregatedData[ProductID] += Notional;
        } else {
          aggregatedData[ProductID] = Notional;
        }
      });
    };

    // Aggregate notional values from data1
    aggregateNotional(data);

    // Resulting aggregated data
    // console.log(aggregatedData);

    const mergedArray = [...data1].map(product => {
      var productId = product.ProductID;
      return { ...product, ...{ "eqvNotional": aggregatedData[productId] } }
    });

    const mergedArray2 = [...data].map(product => {
      var productId = product.ProductID;
      return { ...product, ...{ "eqvNotional": aggregatedData[productId] } }
    });
    this.barrierWatchService.setApiData([...mergedArray], [...mergedArray2]);
    this.barrierWatchService.setAsset([...new Set(data.map((item: any) => item['Asset']))]);
    this.barrierWatchService.setFilterData([...new Map([...mergedArray].map((item: any) => [item.ProductID, item])).values()]);

    this.barrierWatchService.setTotalProducts([...new Map([...data1].map((item: any) => [item["ProductID"], item])).values()].length)
    this.barrierWatchService.dataReceived.emit()
  }

//changed by AdilP @13-09-2023
  async getChart() {
    try {
      this.dashboardServiceService.setUserName(this.userName)
      //this.chart = JSON.parse(response.GetChartDataResponse)
      this.chart = await this.apiService.getChart();
      if (this.chart != null) {
        for (let i = 0; i < this.chart.length; i++) {
          if (this.chart[i].chartData != null && this.chart[i].chartData != 'string') {
            this.chart[i].chartData = JSON.parse((this.chart[i]).chartData)
            console.log(i, this.chart[i].chartData);

          }
          // this.chart.push({"id": `c${val[i].chartId}`, "chart":val[i].chartData, "type": val[i].chartType,})
        }
        // console.log(this.chart);
        // this.chart = this.chart.filter((c: any) => {
        //   if (c.userId !== null) {
        //     return c.userId === (this.userName)
        //   }
        // })
        // console.log(this.chart);

        this.dashboardServiceService.setChartData(this.chart, this.userName)
      } else {
        console.log('No charts to display');

      }

    }
    catch (error) {
      console.error(error);
    }

  }


  async setChart(chartData) {
 try {
      if(this.apiService.AddChartData(chartData)){
        console.log('Chart added successfully');
      }else{
        console.log('Error in adding chart');
      }
      await this.getChart();
      this.dashboardServiceService.chartEvent.emit();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteChart(id, fun: voidFunction) {
    try {
      if(this.apiService.DeleteChartData(id)){
        console.log('Chart deleted successfully');
      }else{
        console.log('Error in deleting chart');
      }
      await this.getChart()
      fun(id)
      this.dashboardServiceService.chartEvent1.emit()
    }
    catch (error) {
      console.error(error);
    }
  }


  

  // selection(ele: number) {
  //   for (let i = 0; i < this.ctx.nativeElement.children.length; i++) {
  //     this.ctx.nativeElement.children[i].className = ele === i ? "selected" : "link";
  //   }

  //   this.selected = ele
  // }


}
