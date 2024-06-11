import { Component, OnDestroy, OnInit } from '@angular/core';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import { AppConfig } from 'src/app/services/config.service';
import { CustomerApiService } from '../../../services/customer-api.service';
import { HomeApiService } from '../../../services/home-api.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-fund-details',
  templateUrl: './fund-details.component.html',
  styleUrls: ['./fund-details.component.scss']
})
export class FundDetailsComponent implements OnInit, OnDestroy {

  activeTab: boolean[];
  MFList = [];
  data: any = [];
  productCatalogue: any = [];
  AllMFData: any = [];
  FundCode = '';
  MFChartData: any = [];
  MFChartLabels: any;
  factsheetdata = [];
  FactSheetNoteMasterID: any;
  rating = '';
  selectedTab = 'Fund Categorization';
  corporateactions = [];
  chartColors = ['#dfc2e4', '#fbe19f', '#9ad3f0', '#bce4b1', '#ed7d31', '#a5a5a5', '#619010', '#388a90', '#6143b7', '#a3085f', '#85593d', '#878787', '#b19c0c'];

  chartOptions = {
    width: '700',
    height: '250',
    legend: 'none',
    colors: this.chartColors,
    backgroundColor: { fill: 'transparent' },
    hAxis: { textPosition: 'none' },
    vAxis: { textPosition: 'none' },
    titleTextStyle: {
      color: '#808080'
    },
  };
  chartData = [{ data: [330, 600, 260, 700], label: 'Account A' }];
  chartLabels = ['A', 'B', 'C', 'D'];
  Title = 'NAV History';
  MFDetailsSubscription: Subscription;
  eventSubscription: Subscription;
  RMWStateArr: any[];
  stateFlag: boolean;
  showOrderEntry: boolean;

  constructor(public router: Router, private afs: WorkflowApiService, private cfs: CommonApiService, private custapi: CustomerApiService, private homeapi: HomeApiService) 
  { 
    this.AllMFData = {};
  }

  ngOnDestroy(): void {
    if (this.MFDetailsSubscription) { this.MFDetailsSubscription.unsubscribe(); }
    if (this.eventSubscription) { this.eventSubscription.unsubscribe(); }
  }

  ngOnInit(): void {

    this.cfs.selectedStateObserver.subscribe(res => {
      if (res) {
        this.RMWStateArr = [];
        this.stateFlag = true;
        this.RMWStateArr = res;
      }
    });

    this.activeTab = [];
    for (let i = 0; i < 5; i++) {
      this.activeTab.push(false);
    }
    this.activeTab[0] = true;

    this.afs.loadMutualFunds();
    this.afs.MFList.subscribe(res => {
      if (res) {
        this.MFList = res;
        // console.log(this.MFList);
      }
    });


    this.cfs.selectedAssetObserver.subscribe((res) => {
      if (res.length !== 0) {
        // console.log('mF data from the product catalog', res);
        this.MFList.forEach((element) => {
          if (res.includes(element.ISIN)) {
            this.data = [];
            this.data = element;
            this.FundCode = element.Code;
            this.rating = element.Rating;
            // console.log('selected data', this.data);
          } else {
            console.log('Invalid Mutual fund selected');
          }
        });

        this.afs.getMFDetails(this.FundCode);
      }
    });


    this.MFDetailsSubscription = this.afs.MFDetails.subscribe((res: any) => {
      if (res.length !== 0) {
        try {
          this.AllMFData = {};
          this.AllMFData = res;
          //console.log(this.SelectedMFBucket);
          const tempObj = {};
          Object.keys(this.AllMFData).forEach(k => {
            tempObj[k] = this.AllMFData[k][0];
          });
          // console.log(tempObj);
          this.AllMFData = tempObj;

          this.AllMFData.forEach(mf => {
            mf.FundSize = parseFloat(mf.FundSize).toFixed(2);
          });

          this.viewFactSheet(this.AllMFData.Note_Master_ID);
          // console.log(this.AllMFData);
          this.custapi.ReadAllProductAllEvent_CA(this.AllMFData.Note_Master_ID, "", this.homeapi.CustomerId.toString(), "Record Date", '01-Jan-2021', '21-Sep-2021', "All").subscribe(res => {
            if (res.ReadAllProductAllEvent_CAResult.length !== 0) {
              // console.log(res);

              // this.corporateactions = [];
              // this.corporateactions = res.ReadAllProductAllEvent_CAResult;
              // this.loadingComplete = true;
              // this.errorFlag = false;
            }
            else {
              this.corporateactions = [];
            }
          });

        } catch (ex) {

        }
      }
    });


    this.afs.getMFNAVHistorychart(this.FundCode, '', '', '1Y').subscribe(res => {
      const data = res.GetDateChartdataResult;
      if (data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        if (data.length > 0) {
          // const MFHistoryDataArr = data.map(r => parseFloat(r.IH_Fixing_Value));
          // const MFHistoryLabelArr = data.map(r => r.IH_Fixing_Date);
          // const MFHistoryData = MFHistoryDataArr.splice(MFHistoryDataArr.length - 10, MFHistoryDataArr.length);
          // const MFHistoryLabels = MFHistoryLabelArr.splice(MFHistoryLabelArr.length - 10, MFHistoryLabelArr.length);
          this.MFChartData = [];
          // this.MFChartLabels = [];
          // this.MFChartData.push({ data: MFHistoryData });
          // this.MFChartLabels.push(MFHistoryLabels);
          data.forEach(element => {
            this.MFChartData.push([element.IH_Fixing_Date, parseFloat(element.IH_Fixing_Value)]);
          });

          // console.log(this.MFChartData);
        }

        // this.chartData[0].data = array;
      }
    });

    this.afs.getFactsheetDataObserver.subscribe(res => {
      if (res) {
        this.factsheetdata = res;
        //this.showFile(this.factsheetdata[0].DGT_ID, this.FactSheetNoteMasterID);
      } else {
        this.factsheetdata = [];
      }
    });


  }

  changeTab(index) {
    for (let i = 0; i < 5; i++) {
      this.activeTab[i] = false;
    }
    this.activeTab[index] = true;
  }
  viewFactSheet(Note_Master_ID) {
    this.FactSheetNoteMasterID = Note_Master_ID;
    if (this.FactSheetNoteMasterID) {
      this.afs.ProductAttachmentList(this.FactSheetNoteMasterID);

    }
  }
  showFile(DGTID, NoteMasterID) {
    let Link = 'http://' + AppConfig.settings.CSP_FXPricingURL + '/FinIQService/RMWorkstation_JSON.svc/Get_Uploaded_Documents_API/' + NoteMasterID + '/' + DGTID;
    window.open(Link);
  }
  clickBack() {
    this.router.navigate(['/rmw']);
    this.cfs.setRMWstate(this.RMWStateArr);
  }

  callOrderEntry(item) {
    this.homeapi.RMWlink = 'Fund Order'; //Added to clear filters on page navigation
    this.showOrderEntry = true
    this.cfs.setAsset(this.AllMFData.ISIN);
    this.cfs.setDirection(item);

  }
}
