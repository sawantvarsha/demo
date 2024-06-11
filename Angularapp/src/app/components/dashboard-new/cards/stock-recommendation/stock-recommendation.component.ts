import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApifunctionsService } from 'src/app/components/dashboard-new/services/apifunctions.service';
import { CommonfunctionsService } from 'src/app/components/dashboard-new/services/commonfunctions.service';

declare var require: any;
const $: any = require('jquery');
@Component({
  selector: 'app-stock-recommendation',
  templateUrl: './stock-recommendation.component.html',
  styleUrls: ['./stock-recommendation.component.scss']
})
export class StockRecommendationComponent implements OnInit {
  selectedSegment: number = 0;
  segments: string[] = [];
  tabCase = 'capitalize';
  receivedSTockRecommendation: any = [];
  stockDataToShow: any = [];
  Underlying="Underlying"
  Action = "Action"
  pageNo: any
  pageSize: any
  resCount: any
  recordLength: any
  noOfRecords1: any
  pageFirstRecord: any = 1
  pageLastRecord: any = 5
  
  constructor(public commonfunctions: CommonfunctionsService,
    public apifunctions: ApifunctionsService,
    private router: Router) { }
  ngOnInit(): void {
    this.segments = ["All", "Buy Vol", "Sell Vol"];
    this.getStockRecommendation();

  }

  getStockRecommendation() {
    this.stockDataToShow = [];
    this.recordLength = []
    this.pageNo = 1;
    this.pageSize = 5;
    this.pageFirstRecord = 1
    console.log("Page Reset");

    this.pageLastRecord = 5

    if (this.selectedSegment === 0) {
      this.stockDataToShow = [];
      this.receivedSTockRecommendation = this.apifunctions.getUnderlyingListData(this.pageNo, this.pageSize, "All");
      // this.stockDataToShow = this.receivedSTockRecommendation.Get_UnderlyingListDataResult;
      this.receivedSTockRecommendation.Get_UnderlyingListDataResult.forEach((res: any) => {
        if (res.AXE !== '') {
          this.stockDataToShow.push(res);
        }
      });
      console.log('stock recommendation', this.receivedSTockRecommendation.Get_UnderlyingListDataResult);
      console.log('recommendation', this.stockDataToShow);
      this.resCount = this.stockDataToShow[0].Count
      console.log("Res", this.resCount)
    } else if (this.selectedSegment === 1) {
      this.stockDataToShow = [];
      this.receivedSTockRecommendation = this.apifunctions.getUnderlyingListData(this.pageNo, this.pageSize, "Buy");
      this.stockDataToShow = this.receivedSTockRecommendation.Get_UnderlyingListDataResult
      console.log('recommendation', this.stockDataToShow);
      this.resCount = this.stockDataToShow[0].Count;
    } else {
      this.stockDataToShow = [];

      this.receivedSTockRecommendation = this.apifunctions.getUnderlyingListData(this.pageNo, this.pageSize, "Sell");
      this.stockDataToShow = this.receivedSTockRecommendation.Get_UnderlyingListDataResult
      this.resCount = this.stockDataToShow[0].Count
      console.log('recommendation', this.stockDataToShow);
    }

  }

  getStockRecommendationWithPages(pageNo: any, pageSize: any) {
    this.stockDataToShow = [];
    this.recordLength = []
    if (this.selectedSegment === 0) {
      this.stockDataToShow = [];
      this.receivedSTockRecommendation = this.apifunctions.getUnderlyingListData(pageNo, pageSize, "All");
      this.stockDataToShow = this.receivedSTockRecommendation.Get_UnderlyingListDataResult
      console.log('stock recommendation', this.receivedSTockRecommendation.Get_UnderlyingListDataResult);
      console.log('recommendation', this.stockDataToShow);
      this.resCount = this.stockDataToShow[0].Count
      console.log("Res", this.resCount)

    } else if (this.selectedSegment === 1) {
      this.stockDataToShow = [];
      this.receivedSTockRecommendation = this.apifunctions.getUnderlyingListData(pageNo, pageSize, "Buy");
      this.stockDataToShow = this.receivedSTockRecommendation.Get_UnderlyingListDataResult
      console.log('recommendation', this.stockDataToShow);
      this.resCount = this.stockDataToShow[0].Count;

    } else {
      this.stockDataToShow = [];
      this.receivedSTockRecommendation = this.apifunctions.getUnderlyingListData(pageNo, pageSize, "Sell");
      this.stockDataToShow = this.receivedSTockRecommendation.Get_UnderlyingListDataResult
      this.resCount = this.stockDataToShow[0].Count

      console.log('recommendation', this.stockDataToShow);
    }
  }


  PagesInfo: any
  getPageInfo(pageInfo: any) {
    try {
      this.PagesInfo = pageInfo
      this.pageFirstRecord = 1
      this.pageLastRecord = 5
      this.noOfRecords1 = pageInfo.length;
      this.pageNo = pageInfo.pageIndex;
      console.log("Page no", this.pageNo + 1)
      this.getStockRecommendationWithPages(this.pageNo + 1, 5);
      this.pageSize = pageInfo.pageSize;

      this.pageFirstRecord = (this.pageNo * this.pageSize) + 1;
      this.pageLastRecord = ((this.pageNo + 1) * this.pageSize) >= this.noOfRecords1
        ? this.noOfRecords1 : ((this.pageNo + 1) * this.pageSize);

      console.log("Pages", this.noOfRecords1, this.pageFirstRecord, this.pageLastRecord)
    } catch (error) {
      console.log(error);
    }
  }
}
