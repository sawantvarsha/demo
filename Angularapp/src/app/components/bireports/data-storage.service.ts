import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilterService } from './sales-and-revenue-performance/filter.service';
import { MtmAndKoFilterService } from './mtm-and-ko/mtm-and-ko-filter.service';
import { MtmAndKiFilterService } from './mtm-and-ki/mtm-and-ki-filter.service';
import { KoAndWorstOfPerformanceService } from './ko-and-worst-of-performance/wof-and-ko-filter.service';
import { KiAndWorstOfPerformanceService } from './ki-and-worst-of-performance/wof-and-ki-filter.service'; 
import { BarrierProbabilityService } from './barrier-probability/barrier-probability.service';
import { BarrierWatchService } from './barrier-watch/barrier-watch.service';
import { AssetExposureService } from './asset-exposure/asset-exposure.service';

export type Data = {
  GetInteractivedataResult: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient,private mtmAndkoService:MtmAndKoFilterService,private salesAndRevenueService:FilterService,private mtmAndKiService:MtmAndKiFilterService,private koAndwopService:KoAndWorstOfPerformanceService,private kiAndwopService :KiAndWorstOfPerformanceService,private barrierProbabilityService:BarrierProbabilityService,private barrierWatchService: BarrierWatchService,private assetexposureservice:AssetExposureService
    ) { }

//   KIandKOData = this.http.post<Data>('http://1europe.test-equity-connect.com/FinIQService/InteractiveDashboard.svc/GetInteractivedata', {
//     "strData": "USP_PerformanceTimelineV2_PBIReport",
//     "I_Entity_ID": "149",
//     "I_User_Id": "Bhavik",
//     "CustomerID": "",
//     "EventType": "",
//     "I_FromDate": "01-Jan-22",
//     "I_ToDate": "31-Oct-23",
//     "Measure": "",
//     "Sector": "",
//     "RowsPerPage": "",
//     "PageNo": "",
//     "WhereClause": ""
//   }, {
//     responseType: "json"
//   }).subscribe((value)=>{
//     console.log('ki-ko Data')
    
//     const data=JSON.parse(value.GetInteractivedataResult)

    
//     this.mtmAndkoService.setData(data)
//     this.mtmAndKiService.setData(data)
//     this.kiAndwopService.setData(data);
//     this.koAndwopService.setData(data);
//     this.koAndwopService.dataReceived.emit()
//     this.kiAndwopService.dataReceived.emit()
//     this.mtmAndkoService.dataReceived.emit()
//     this.mtmAndKiService.dataReceived.next()
//   })


//   salesAndRevenueData = this.http.post<Data>('http://1europe.test-equity-connect.com/FinIQService/InteractiveDashboard.svc/GetInteractivedata', {
//     "strData": "USP_SalesRevenuePerformance_PBIReport",
//     "I_Entity_ID": "149",
//     "I_User_Id": "Bhavik",
//     "CustomerID": "",
//     "EventType": "",
//     "I_FromDate": "",
//     "I_ToDate": "",
//     "Measure": "",
//     "Sector": "",
//     "RowsPerPage": "",
//     "PageNo": "",
//     "WhereClause": ""
//   }, {
//     responseType: "json"
//   }).subscribe((value)=>{
//     this.salesAndRevenueService.setApiData(JSON.parse(value.GetInteractivedataResult))
//     this.salesAndRevenueService.dataReceived.emit()
//   })

//   BarrierProbabilityData = this.http.post<Data>("http://1europe.test-equity-connect.com/FinIQService/InteractiveDashboard.svc/GetInteractivedata", {
//   "strData": "USP_LifecycleSnapshot_PBIReport",
//   "I_Entity_ID": "149",
//   "I_User_Id": "Bhavik",
//   "CustomerID": "",
//   "EventType": "",
//   "I_FromDate": "01-Oct-2022",
//   "I_ToDate": "31-Oct-2022",
//   "Measure": "",
//   "Sector": "",
//   "RowsPerPage": "",
//   "PageNo": "",
//   "WhereClause": ""
// }, {
//   responseType: "json"
// }).subscribe((value)=>{
//   var data1=new Map<any,any>()
//   const data=JSON.parse(value.GetInteractivedataResult)
//   console.log(data)
//   var data2=new Map<any,any>()
//    data.map((ele:any)=>{
//      data1.set(ele.ProductID,ele)
//      data2.set(ele.ISIN,ele)
//    })
 
//    this.barrierProbabilityService.setApiData([...data1.values()])
//    console.log([data1.values()])
//    this.setBarrierWatchProperties(value)
// this.barrierWatchService.dataReceived.emit()

//    this.barrierProbabilityService.dataReceived.emit()
// })

// setBarrierWatchProperties(value: any) {
//   var data1 = new Map<any, any>()
//   const data = JSON.parse(value.GetInteractivedataResult)

//   data.map((ele: any) => {
//     data1.set(ele.ProductID, ele)
//   })
//   console.log(data1)
//   this.barrierWatchService.setApiData([...data1.values()], [...data]);
//   this.barrierWatchService.setAsset([...new Set(data.map((item: any) => item['Asset']))]);
//   this.barrierWatchService.setFilterData([...new Map([...data1.values()].map((item: any) => [item.ProductID, item])).values()]);

//   this.barrierWatchService.setTotalProducts([...new Map([...data1.values()].map((item: any) => [item["ProductID"], item])).values()].length)
//   this.barrierWatchService.dataReceived.emit()
// }

//   AssetExposureData = this.http
//     .post<any>(
//       'http://1europe.test-equity-connect.com/FinIQService/InteractiveDashboard.svc/GetInteractivedata',
//       {
//         strData: 'USP_ConcentrationByUnderlying_PBIReport',
//         I_Entity_ID: '149',
//         I_User_Id: 'Bhavik',
//         CustomerID: '',
//         EventType: '',
//         I_FromDate: '',
//         I_ToDate: '',
//         Measure: '',
//         Sector: '',
//         RowsPerPage: '',
//         PageNo: '',
//         WhereClause: '',
//       },
//       { 
//         responseType: "json"
//        }
//     ).subscribe((value)=>{
//       this.assetexposureservice.setApiData(value)
//     })
}
