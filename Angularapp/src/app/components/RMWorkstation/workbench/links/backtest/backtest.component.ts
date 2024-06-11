import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { LCMApiService } from 'src/app/services/lcmapi.service';

import * as XLSX from 'xlsx';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ApexStroke,
  ApexDataLabels,
  ApexLegend,
  ApexStates,
  ApexResponsive,
  ApexNoData,
  ApexTooltip,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  grid: ApexGrid;
  labels: string[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  colors: string[];
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  states: ApexStates;
  responsive: ApexResponsive[];
  noData: ApexNoData;
  tooltip: ApexTooltip;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis[];
  theme: ApexTheme;
  markers: ApexMarkers;
  lblError: any;
};
@Component({
  selector: 'app-backtest',
  templateUrl: './backtest.component.html',
  styleUrls: ['./backtest.component.scss'],
})
export class BacktestComponent implements OnInit {
  backtestNMID: any;
  backTestNoteMasterId: any;
  backTestTemplateID: any;
  StartDate: any;
  TestCases: any;
  whatIfBackTestArr: any = [];

  @Input() data = [];
  @Input() product: string;
  @Input() templateID: any;
  @Input() productDetails: any;

  entityId: any;
  popUpSelected: string;
  showPopUp: boolean = false;
  AssetClass: string;
  tradingHistoryArr: any = [];
  barChartY: any = [];
  countArrOfTestcaseNoDays: any;
  TWRRArr: any = [];
  twrrChartY: any = [];
  chartData: any = [];
  barChartX: any = [];
  twrrChartX: any = [];

  templateSrNo: any;
  templateId: any;
  perfTraceMatDate: any;
  perfTraceTradeDate: any;
  showBacktest: boolean = false;
  lblError: any;
  productInfoArr: any[] = [];
  twrrAvg: any;
  KnockInCount: any;
  KnockOutCount: any;
  underlyingNames: any;
  assetUnderlying: any;
  TradingDays: any[] = [];
  KnockinPct: any;
  KnockOutPct: any;
  twrrChartXSorted: any = [];
  twrrChartYSorted: any = [];
  KnockOutCountReceived: any;
  KnockOutPctReceived: any;

  constructor(private lcmapi: LCMApiService, public datepipe: DatePipe) { }

  async ngOnInit() {

    let asset: any[] = [];
    console.log('data', this.data);
    // this.backTestNoteMasterId = '432788';
    this.backTestTemplateID = this.data["Template_ID"];
    this.backTestNoteMasterId = this.data["Note_Master_ID"];
    // await this.getStaticData();
    this.backtestNMID = this.backTestNoteMasterId;
    this.TestCases = '25';
    this.StartDate = '';
    this.popUpSelected = 'BackTest';
    this.showPopUp = true;
    this.entityId = "4";
    this.AssetClass = "EQ";
    // this.lcmapi.GetNumberOfTestCasesAndStartDate(
    //     this.backTestNoteMasterId,
    //     this.backTestTemplateID,
    //     this.TestCases,
    //     this.StartDate
    //   )
    //   .subscribe((data) => {
    //     console.log(data);
    //   });
    this.lcmapi.GetNumberOfTestCasesAndStartDate(this.backTestNoteMasterId, this.TestCases, this.StartDate, this.backTestTemplateID.toString())
      .subscribe((data) => {
        this.StartDate = data.GetNumberOfTestCasesAndStartDateResult;
        if (this.StartDate.length > 12) {
          this.lblError = this.StartDate;
          this.StartDate = '';
        } else {
          this.StartDate = new Date(data.GetNumberOfTestCasesAndStartDateResult);
          this.StartDate = this.datepipe.transform(this.StartDate, 'dd-MMM-yyyy');
        }
        // console.log('StartDate1', data, this.StartDate);

        // this.StartDate = this.datepipe.transform(this.StartDate, 'yyyy-MM-dd');


        if (this.StartDate !== '') {
          this.getWhatIfBacktestData()
        }
        this.getProductInfo();
      });

  }

  async getStaticData() {
    try {
      await this.lcmapi.GetStaticData(this.backTestNoteMasterId).then(async (data) => {
        this.templateSrNo = data.GetStaticDataResult[0].Template_Sr_No;
        this.backTestTemplateID = data.GetStaticDataResult[0].Template_ID;
        console.log('templateSrNo', this.templateSrNo);

      });
    } catch (error) {

    }
  }

  GetTradeMaturityDateTrace() {
    try {
      this.lcmapi.Get_Trade_Maturity_Date_Trace(this.backTestNoteMasterId, this.templateSrNo.toString(), this.templateId.toString())
        .then((data) => {
          this.perfTraceMatDate = data.Get_Trade_Maturity_Date_TraceResult[0].Maturity_Date.split(' ')[0];
          this.perfTraceMatDate = this.datepipe.transform(this.perfTraceMatDate, 'dd-MMM-yyyy');
          this.perfTraceTradeDate = data.Get_Trade_Maturity_Date_TraceResult[0].Trade_Date.split(' ')[0];
          this.perfTraceTradeDate = this.datepipe.transform(this.perfTraceTradeDate, 'dd-MMM-yyyy');
          console.log('perf dates', this.perfTraceMatDate, this.perfTraceTradeDate);
        });
    } catch (error) {

    }
  }

  GetRUHDates() {
    try {
      this.lcmapi.Get_RUHDates(this.backTestNoteMasterId, this.backTestTemplateID, this.templateSrNo, this.perfTraceTradeDate, this.perfTraceMatDate, "");
    } catch (error) {

    }
  }

  // START : Changed by Amogh K | 10-Jan-2023 | Backtest graph modifications
  getWhatIfBacktestData(){


    let asset: any[] = [];

    this.lcmapi.WhatIfMultipleBackTest(this.backTestNoteMasterId,
      this.backTestTemplateID,
      this.TestCases,
      this.StartDate,
      this.entityId,
      this.AssetClass).subscribe((data) => {
        this.TradingDays = [];
        this.tradingHistoryArr = data.WhatIfMultipleBackTestResult.dC_IndexHistory_WhatIf_GMC_BackTests;
        this.whatIfBackTestArr = data.WhatIfMultipleBackTestResult.dC_UDT_WhatIf_GMC_BackTests;
        this.KnockInCount = this.whatIfBackTestArr.filter(i => (i.KnockIn && i.KnockIn === "True")).length;
        let tenordays = this.productInfoArr[0].Tenor;
        this.KnockinPct = (this.KnockInCount / this.whatIfBackTestArr.length) * 100;
        this.KnockinPct = this.KnockinPct.toFixed(2);
        this.KnockOutCount = this.whatIfBackTestArr.filter(i => (i.AutocallDay < parseInt(tenordays))).length;
        this.KnockOutPct = (this.KnockOutCount / this.whatIfBackTestArr.length) * 100;
        this.KnockOutPct = this.KnockOutPct.toFixed(2);
        this.assetUnderlying = '';
        this.underlyingNames = (this.whatIfBackTestArr[0].Asset).split(',');
        this.underlyingNames.forEach(res => this.assetUnderlying += res.split('-')[1] + ',');
        let len = this.tradingHistoryArr.length - parseInt(this.TestCases)
        let tradingHist1 = this.tradingHistoryArr.slice(0,len)
        let tradingHist2 = this.tradingHistoryArr.slice(parseInt(this.TestCases))
        console.log('backtest', this.tradingHistoryArr, this.whatIfBackTestArr, this.assetUnderlying);
        let initAssetValues = []
        let graphLabels = [];
        let underlyingList = [];
        let shares = []
        if(this.whatIfBackTestArr.length > 0){
          let assets = this.whatIfBackTestArr[0].Asset;
          assets.split(',').map(e=>{
            let key = e.split('-')[1].trim();
            shares.push(key)
            underlyingList.push('Scenario 1 '+key)
          })
        }
        this.plotTestCaseNoOfDaysCalc();
        this.calcTWRR();

        tradingHist1.map((item) => {
          
          if (item.Asset1 !== "") {
            if (!asset[0]){
              initAssetValues.push(item.Asset1);
              asset.push([]);
            };
            asset[0].push((item.Asset1 / initAssetValues[0])* 100)
          }
          if (item.Asset2 !== "") {
            if (!asset[1]){
              initAssetValues.push(item.Asset2);
              asset.push([]);
            } 
            asset[1].push((item.Asset2 / initAssetValues[1])* 100)
          }
          if (item.Asset3 !== "") {
            if (!asset[2]){
              initAssetValues.push(item.Asset3);
              asset.push([]);
            } 
            asset[2].push((item.Asset3 / initAssetValues[2])*100)
          }
          if (item.Asset4 !== "") {
            if (!asset[3]){
              initAssetValues.push(item.Asset4);
              asset.push([]);
            } 
            asset[3].push((item.Asset4 / initAssetValues[3])*100)
          }
          if (item.Asset5 !== "") {
            if (!asset[4]){
              initAssetValues.push(item.Asset5);
              asset.push([]);
            } 
            asset[4].push((item.Asset5 / initAssetValues[4])*100)
          }
          // asset1.push(item.Asset1)
          // asset2.push(item.Asset2)
          // asset3.push(item.Asset3)
          // asset4.push(item.Asset4)
          // asset5.push(item.Asset5)
          this.TradingDays.push(parseInt(item.TradingDays))
        });
        let assetlen = asset.length;

          tradingHist2.map(item=>{
            if (item.Asset1 !== "") {
              if (!asset[assetlen]){
                initAssetValues.push(item.Asset1);
                underlyingList.push('Scenario '+this.TestCases+' '+shares[0])
                asset.push([]);
              } 
              asset[assetlen].push((item.Asset1 / initAssetValues[assetlen])*100)
            }

            if (item.Asset2 !== "") {
              if (!asset[assetlen+1]){
                initAssetValues.push(item.Asset2);
                underlyingList.push('Scenario '+this.TestCases+' '+shares[1])
                asset.push([]);
              } 
              asset[assetlen+1].push((item.Asset2 / initAssetValues[assetlen+1])*100)
            }
            if (item.Asset3 !== "") {
              if (!asset[assetlen+2]){
                initAssetValues.push(item.Asset3);
                underlyingList.push('Scenario '+this.TestCases+' '+shares[2])
                asset.push([]);
              } 
              asset[assetlen+2].push((item.Asset3 / initAssetValues[assetlen+2])*100)
            }
            if (item.Asset4 !== "") {
              if (!asset[assetlen+3]){
                initAssetValues.push(item.Asset4);
                underlyingList.push('Scenario '+this.TestCases+' '+shares[3])
                asset.push([]);
              } 
              asset[assetlen+3].push((item.Asset4 / initAssetValues[assetlen+3])*100)
            }
            if (item.Asset5 !== "") {
              if (!asset[assetlen+4]){
                initAssetValues.push(item.Asset5);
                underlyingList.push('Scenario '+this.TestCases+' '+shares[4])
                asset.push([]);
              } 
              asset[assetlen+4].push((item.Asset5 / initAssetValues[assetlen+4])*100)
            }
          });
        console.log('merged', asset, underlyingList);

        this.chartData = asset.map((item: any[], i: number) => {
          return {
            name: underlyingList[i]? underlyingList[i] : "Asset" + (i + 1),
            data: item
          };
        });
        console.log('chartdata', this.chartData);

      });
  }
  // END : Changed by Amogh K | 10-Jan-2023 | Backtest graph modifications

  // getWhatIfBacktestData() {
  //   try {
  //     let asset1 = []
  //     let asset2 = []
  //     let asset3 = []
  //     let asset4 = []
  //     let asset5 = []
  //     this.TradingDays = []
  //     this.lcmapi.WhatIfMultipleBackTest(this.backTestNoteMasterId,
  //       this.backTestTemplateID,
  //       this.TestCases,
  //       this.StartDate,
  //       this.entityId,
  //       this.AssetClass).subscribe((data) => {
  //         this.tradingHistoryArr = [];
  //         this.tradingHistoryArr = data.WhatIfMultipleBackTestResult.dC_IndexHistory_WhatIf_GMC_BackTests;
  //         this.whatIfBackTestArr = [];
  //         this.whatIfBackTestArr = data.WhatIfMultipleBackTestResult.dC_UDT_WhatIf_GMC_BackTests;

  //         this.tradingHistoryArr = data.WhatIfMultipleBackTestResult.dC_IndexHistory_WhatIf_GMC_BackTests;
  //         this.whatIfBackTestArr = data.WhatIfMultipleBackTestResult.dC_UDT_WhatIf_GMC_BackTests;
  //         this.KnockInCount = this.whatIfBackTestArr.filter(i => (i.KnockIn && i.KnockIn === "True")).length;
  //         this.KnockinPct = (this.KnockInCount / this.whatIfBackTestArr.length) * 100;
  //         this.KnockinPct = this.KnockinPct.toFixed(2);
  //         this.KnockOutCount = this.whatIfBackTestArr.filter(i => (i.KnockOut && i.KnockOut === "True")).length;
  //         this.KnockOutPct = (this.KnockOutCount / this.whatIfBackTestArr.length) * 100;
  //         this.KnockOutPct = this.KnockOutPct.toFixed(2);
  //         this.assetUnderlying = '';
  //         this.underlyingNames = (this.whatIfBackTestArr[0].Asset).split(',');
  //         this.underlyingNames.forEach(res => this.assetUnderlying += res.split('-')[1] + ',');

  //         console.log('backtest', this.tradingHistoryArr, this.whatIfBackTestArr);
  //         this.plotTestCaseNoOfDaysCalc();
  //         this.calcTWRR();
  //         this.tradingHistoryArr.map(item => {
  //           // if (item.Asset1 !== "") {
  //           //   asset1.push(item.Asset1)
  //           // }
  //           // if (item.Asset2 !== "") {
  //           //   asset1.push(item.Asset2)
  //           // }
  //           // if (item.Asset3 !== "") {
  //           //   asset1.push(item.Asset3)
  //           // }
  //           // if (item.Asset4 !== "") {
  //           //   asset1.push(item.Asset4)
  //           // }
  //           // if (item.Asset5 !== "") {
  //           //   asset1.push(item.Asset5)
  //           // }
  //           asset1.push(item.Asset1)
  //           asset2.push(item.Asset2)
  //           asset3.push(item.Asset3)
  //           asset4.push(item.Asset4)
  //           asset5.push(item.Asset5)
  //           this.TradingDays.push(parseInt(item.TradingDays))

  //         })
  //         this.chartData = [];
  //         this.chartData = [
  //           {
  //             name: "Asset1",
  //             data: asset1
  //           },
  //           {
  //             name: "Asset2",
  //             data: asset2
  //           },
  //           {
  //             name: "Asset3",
  //             data: asset3
  //           },
  //           {
  //             name: "Asset4",
  //             data: asset4
  //           },
  //           {
  //             name: "Asset5",
  //             data: asset5
  //           }
  //         ]
  //         console.log('chart data', this.chartData, this.TradingDays);
  //       });
  //   } catch (error) {

  //   }
  // }


  plotTestCaseNoOfDaysCalc() {
    try {
      const occurenceArr = [];
      this.whatIfBackTestArr.forEach((res) => {
        occurenceArr.push(res.AutocallDay);
      });
      console.log('occurenceArr', occurenceArr);
      let count = {};
      for (const element of occurenceArr) {
        if (count[element]) {
          count[element] += 1;
        } else {
          count[element] = 1;
        }
      }

      count = (Object.keys(count) as unknown as Array<keyof typeof count>)
        .sort().reduce((r: any, k) => (r[k] = count[k], r), {})

      console.log('count ', count);

      this.barChartY = [
        {
          name: 'Testcases',
          data: Object.values(count),
        },
      ];


      console.log('barChartY', this.barChartY[0]);
      this.KnockOutCountReceived = this.barChartY[0].data[0];
      this.KnockOutPctReceived = (this.KnockOutCount / this.whatIfBackTestArr.length) * 100;
      this.KnockOutPctReceived = this.KnockOutPctReceived.toFixed(2);
      this.barChartX = Object.keys(count);
      // console.log('count', count);
      // this.countArrOfTestcaseNoDays = [];
      this.countArrOfTestcaseNoDays.push(count);
      // console.log('count ', this.countArrOfTestcaseNoDays);
    } catch (error) { }
  }

  getStartDateNoofTestCase(TestCases) {
    try {
      this.StartDate = '';
      this.lcmapi
        .GetNumberOfTestCasesAndStartDate(
          this.backTestNoteMasterId,
          TestCases,
          '',
          this.backTestTemplateID.toString()
        )
        .subscribe((data) => {
          this.StartDate = data.GetNumberOfTestCasesAndStartDateResult;
          if (this.StartDate !== '') {
            this.getWhatIfBacktestData();
          }
        });

      // console.log('testcase change', this.StartDate);
    } catch (error) { }
  }

  convertdate(selecteddate) {
    let date = selecteddate.split(' ');
    let final = date[0] + ' ' + date[1] + ' ' + date[2];
    return final;
  }
  selectDate(date) {
    try {
      return this.datepipe.transform(date, 'dd-MMM-yyyy');
    } catch (error) { }
  }

  calcTWRR() {
    try {
      let power;
      let twr = 0;
      let twrr;
      let roi = 0;

      let count = {};

      for (let i = 0; i < this.whatIfBackTestArr.length - 1; i++) {
        roi = this.whatIfBackTestArr[i].ROIPercentage / 100;
        power = 252 / this.whatIfBackTestArr[i].AutocallDay; // Changed by Amogh K | 10-Jan-2023 | changed calculation of twrr
        twr = Math.pow((1 + roi), power);
        twrr = ((twr - 1) * 100);
        this.whatIfBackTestArr[i].twrr = parseFloat(twrr.toFixed(4));
        twrr = parseFloat(twrr.toFixed(2));
        console.log('calculation', count, twrr.toFixed(2));
        
        if (count[twrr]) {
          count[twrr] += 1;
        }
        else {
          count[twrr] = 1;
        }
        this.TWRRArr.push(twrr);
      }
      const arr = Object.entries(count).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])).reduce((t, a) => (Object.assign(t, { [a[0]]: a[1] })), {});
      let twrrSum: number = 0;
      for (let i = 0; i < this.TWRRArr.length; i++) {
        twrrSum += this.TWRRArr[i];
      }
      this.twrrAvg = twrrSum / this.TWRRArr.length;
      this.twrrAvg = this.twrrAvg.toFixed(2);
      this.twrrChartY = [
        {
          name: 'Testcases',
          data: Object.values(arr),
        },
      ];

      this.twrrChartX = Object.keys(arr);
      // console.log('twrr',this.TWRRArr, count);
      // this.twrrChartXSorted = [];
      // this.twrrChartYSorted = [];
      // this.twrrChartX.forEach(res => {
      //   this.twrrChartXSorted.push(parseFloat(res));
      // });
      // this.twrrChartXSorted = this.twrrChartXSorted.sort((a,b) => {
      //   return a - b;
      // });
      // (this.twrrChartY[0].data).forEach(res => {
      //   this.twrrChartYSorted.push(parseFloat(res));
      // });
      // this.twrrChartYSorted = this.twrrChartYSorted.sort((a,b) => {
      //   return a - b;
      // });
      console.log('twrr', this.twrrChartX, this.twrrChartY, this.twrrChartXSorted, this.twrrChartYSorted);
    } catch (error) { }
  }

  getProductInfo() {
    try {
      this.lcmapi.getProductInfo(this.backTestNoteMasterId, this.backTestTemplateID).
        subscribe((data) => {
          console.log('prodInfo', data.GetProductInfoResult);
          this.productInfoArr.push(data.GetProductInfoResult);
          console.log('productInfoArr', this.productInfoArr)
        });
    } catch (error) {

    }
  }

  downloadBacktest() {
    try {
      const element = document.getElementById('whatifbacktestTable');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, "whatifbacktestTable.xlsx");
    } catch (error) {

    }
  }

  getTestcaseonDateChange(txtStartDate) {
    try {
      this.TestCases = '';
      this.lcmapi
        .GetNumberOfTestCasesAndStartDate(
          this.backTestNoteMasterId,
          this.TestCases,
          txtStartDate,
          this.backTestTemplateID.toString()
        )
        .subscribe((data) => {
          this.TestCases = data.GetNumberOfTestCasesAndStartDateResult;
          if (this.TestCases !== '') {
            this.getWhatIfBacktestData();
          }
        });
    } catch (error) {

    }
  }

  loadBtnClick() {
    try {
      if (this.StartDate !== '' && this.TestCases !== '') {
        this.getWhatIfBacktestData();
      }

    } catch (error) {

    }
  }


}
