import { Component, OnDestroy, OnInit } from '@angular/core';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import { AppConfig } from 'src/app/services/config.service';
// import { CustomerApiService } from '../../../services/customer-api.service';
import { HomeApiService } from '../../../services/home-api.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-fund-details',
  templateUrl: './new-fund-details.component.html',
  styleUrls: ['./new-fund-details.component.scss'],
})
export class NewFundDetailsComponent implements OnInit, OnDestroy {
  activeTab: boolean[];
  MFList = [];
  data: any = [];
  productCatalogue: any = [];
  AllMFData: any;
  FundCode = '';
  isin = '';
  MFChartData: any = [];
  MFChartLabels: any;
  factsheetdata = [];
  FactSheetNoteMasterID: any;
  rating = '';
  selectedTab = 'Fund Categorization';
  corporateactions = [];
  chartColors = [
    '#dfc2e4',
    '#fbe19f',
    '#9ad3f0',
    '#bce4b1',
    '#ed7d31',
    '#a5a5a5',
    '#619010',
    '#388a90',
    '#6143b7',
    '#a3085f',
    '#85593d',
    '#878787',
    '#b19c0c',
  ];

  chartOptions = {
    width: '500',
    height: '250',
    legend: 'none',
    colors: this.chartColors,
    backgroundColor: { fill: 'transparent' },
    hAxis: {
      textStyle: {
        color: '#808080',
      },
    },
    vAxis: {
      textStyle: {
        color: '#808080',
      },
    },
    titleTextStyle: {
      color: '#808080',
    },
  };
  chartData = [{ data: [330, 600, 260, 700], label: 'Account A' }];
  chartLabels = ['A', 'B', 'C', 'D'];
  Title = 'NAV History';
  MFDetailsSubscription: Subscription;
  eventSubscription: Subscription;
  Year1 = true;
  Year3 = false;
  Year5 = false;
  Year10 = false;
  RMWStateArr: any;
  stateFlag: boolean;
  FundRatios: any[];
  FundRatio_10Y: any[];
  FundRatio_1Y: any[];
  FundRatio_3Y: any[];
  FundRatio_5Y: any[];
  FillRatios: any;
  SecurityInfoData: any;
  PerformanceData: any[];
  PerfPeriods: any[] = [];
  PerfYears: any[] = [];
  PerfQuarters: any[] = [];
  perfFlag: boolean = false;
  showOrderEntry: boolean;
  selectFundObserverBS: Subscription; //Added by Alolika G on 9th Feb 2022

  constructor(
    public router: Router,
    private afs: WorkflowApiService,
    public cfs: CommonApiService,
    private homeapi: HomeApiService
  ) {
    //private custapi: CustomerApiService,
    this.AllMFData = {};
    this.FillRatios = {};
  }

  ngOnDestroy(): void {
    if (this.MFDetailsSubscription) {
      this.MFDetailsSubscription.unsubscribe();
    }
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    if (this.selectFundObserverBS !== null) {
      //Added by Alolika G on 9th Feb 2022
      this.selectFundObserverBS.unsubscribe();
    }
  }
  // constructor() { }

  ngOnInit(): void {
    this.cfs.selectedStateObserver.subscribe((res) => {
      if (res[0].index) {
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
    this.afs.MFList.subscribe((res) => {
      if (res) {
        this.MFList = res;
        // console.log(this.MFList);
      }
    });

    this.selectFundObserverBS = this.cfs.selectedAssetObserver.subscribe(
      (res) => {
        if (res.length !== 0) {
          // console.log('mF data from the product catalog', res);
          this.MFList.forEach((element) => {
            if (res === element.ISIN) {
              this.data = [];
              this.data = element;
              this.isin = element.ISIN;
              this.FundCode = element.Code;
              this.rating = element.Rating;
              // console.log('selected data', this.data);
            } else {
              console.log('Invalid Mutual fund selected');
            }
          });

          this.afs.getMFDetails(this.FundCode);
          this.getFundRatioDetails(this.isin);
          this.getMFDetailsSecurityInfo(this.FundCode);
          this.getFundPerformance(this.isin);
        }
      }
    );

    this.MFDetailsSubscription = this.afs.MFDetails.subscribe((res: any) => {
      if (res.length !== 0) {
        try {
          this.AllMFData = {};
          this.AllMFData = res;
          //console.log(this.SelectedMFBucket);
          const tempObj = {};
          Object.keys(this.AllMFData).forEach((k) => {
            tempObj[k] = this.AllMFData[k][0];
          });
          // console.log(tempObj);
          // -- Changes done  by Alolika G on 9th Feb 2022 ---
          this.AllMFData = tempObj;
          this.viewFactSheet(this.AllMFData.Note_Master_ID);

          // console.log(this.AllMFData);
          // this.custapi.ReadAllProductAllEvent_CA(this.AllMFData.Note_Master_ID, "", this.homeapi.CustomerId.toString(), "Record Date", '01-Jan-2021', '21-Sep-2021', "All").subscribe(res => {
          //   if (res.ReadAllProductAllEvent_CAResult.length !== 0) {
          //     // console.log(res);

          //     // this.corporateactions = [];
          //     // this.corporateactions = res.ReadAllProductAllEvent_CAResult;
          //     // this.loadingComplete = true;
          //     // this.errorFlag = false;
          //   }
          //   else {
          //     this.corporateactions = [];
          //   }
          // });
        } catch (ex) {}
      }
    });
    this.afs
      .getMFNAVHistorychart(this.FundCode, '', '', '1Y')
      .subscribe((res) => {
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
            data.forEach((element) => {
              this.MFChartData.push([
                element.IH_Fixing_Date,
                parseFloat(element.IH_Fixing_Value),
              ]);
            });

            // console.log(this.MFChartData);
          }

          // this.chartData[0].data = array;
        }
      });

    this.afs.getFactsheetDataObserver.subscribe((res) => {
      if (res) {
        this.factsheetdata = res;
        //this.showFile(this.factsheetdata[0].DGT_ID, this.FactSheetNoteMasterID);
      } else {
        this.factsheetdata = [];
      }
    });
  }

  getFundRatioDetails(ISIN) {
    this.afs.Fill_FundRatiosUpload_Details_REST(ISIN).subscribe((data) => {
      this.FundRatios = [];
      this.FundRatios = data.Fill_FundRatiosUpload_Details_RESTResult;
      // let tempArr = this.FundRatios[0].Fill_FundRatiosUpload_Details_RESTResult;
      this.FundRatios.forEach((element) => {
        switch (element.FR_Period) {
          case 'Ten Years':
            this.FundRatio_10Y = element;
            break;

          case 'One Year':
            this.FundRatio_1Y = element;
            break;

          case 'Three Years':
            this.FundRatio_3Y = element;
            break;

          case 'Five Years':
            this.FundRatio_5Y = element;
            break;

          default:
            break;
        }
      });
      this.chkChange(0);
    });
  }

  chkChange(value) {
    this.FillRatios = [];
    switch (value) {
      case 0:
        this.Year1 = true;
        this.Year3 = false;
        this.Year5 = false;
        this.Year10 = false;
        this.FillRatios = this.FundRatio_1Y;
        break;

      case 1:
        this.Year1 = false;
        this.Year3 = true;
        this.Year5 = false;
        this.Year10 = false;
        this.FillRatios = this.FundRatio_3Y;
        break;

      case 2:
        this.Year1 = false;
        this.Year3 = false;
        this.Year5 = true;
        this.Year10 = false;
        this.FillRatios = this.FundRatio_5Y;
        break;

      case 3:
        this.Year1 = false;
        this.Year3 = false;
        this.Year5 = false;
        this.Year10 = true;
        this.FillRatios = this.FundRatio_10Y;
        break;

      default:
        break;
    }
    // console.log("this.FillRatios", this.FillRatios);
  }

  getMFDetailsSecurityInfo(ISIN) {
    this.afs.getMFDetailsNewLayout(ISIN).subscribe((res) => {
      if (res) {
        // console.log("Fund Data", res);
        this.SecurityInfoData = {};
        this.SecurityInfoData = res[0];
      }
    });
  }

  getFundPerformance(ISIN) {
    this.afs.Fill_FundPerformanceUpload_Details_REST(ISIN).subscribe((res) => {
      if (res) {
        // console.log("Fund Data", res);
        this.PerformanceData = [];
        this.PerfPeriods = [];
        this.PerfYears = [];
        this.PerfQuarters = [];
        this.PerformanceData =
          res.Fill_FundPerformanceUpload_Details_RESTResult;
        if (this.PerformanceData.length !== 0) {
          this.perfFlag = true;
        }
        this.PerformanceData.forEach((element) => {
          if (
            element.FP_Period_Type === 'Periods' &&
            element.FP_Period !== '12 Years'
          ) {
            this.PerfPeriods.unshift(element);
          } else if (element.FP_Period_Type === 'Years') {
            this.PerfYears.unshift(element);
          } else if (
            element.FP_Period_Type === 'Quarters' &&
            (element.FP_Period.startsWith('2021') ||
              element.FP_Period.startsWith('2020'))
          ) {
            this.PerfQuarters.unshift(element);
          }
        });
        // console.log("this.PerfYears",this.PerfYears);
        this.PerfYears = this.PerfYears.slice(0, 6);
        this.setLabelSequencePeriods();
        // this.setLabelSequenceYears();
        // this.setLabelSequenceQuarters();

        // console.log("this.PerfPeriods", this.PerfPeriods)
      } else {
        this.perfFlag = false;
      }
    });
  }

  setLabelSequencePeriods() {
    this.PerfPeriods.forEach((element, i) => {
      switch (element.FP_Period) {
        case 'Day Change':
          this.PerfPeriods[i].sequence = 0;
          break;

        case 'YTD':
          this.PerfPeriods[i].sequence = 1;
          break;

        case '1 Week':
          this.PerfPeriods[i].sequence = 2;
          break;

        case '1 Month':
          this.PerfPeriods[i].sequence = 3;
          break;

        case '3 Months':
          this.PerfPeriods[i].sequence = 4;
          break;

        case '6 Months':
          this.PerfPeriods[i].sequence = 5;
          break;

        case '1 Year':
          this.PerfPeriods[i].sequence = 6;
          break;

        case '3 Years':
          this.PerfPeriods[i].sequence = 7;
          break;

        case '5 Years':
          this.PerfPeriods[i].sequence = 8;
          break;

        default:
          break;
      }
    });
    let tempArr = [];
    tempArr = this.PerfPeriods.slice();
    this.PerfPeriods = [];
    this.PerfPeriods = tempArr.sort((a, b) => a.sequence - b.sequence);
    // console.log("this.PerfPeriods", this.PerfPeriods)
  }

  clickBack() {
    this.router.navigate(['/rmw']);
    this.cfs.setRMWstate(this.RMWStateArr);
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
    let Link =
      'http://' +
      AppConfig.settings.CSP_FXPricingURL +
      '/FinIQService/RMWorkstation_JSON.svc/Get_Uploaded_Documents_API/' +
      NoteMasterID +
      '/' +
      DGTID;
    window.open(Link);
  }

  callOrderEntry(item) {
    this.homeapi.RMWlink = 'Fund Order'; //Added to clear filters on page navigation
    this.showOrderEntry = true;
    this.cfs.setAsset(this.AllMFData.ISIN);
    this.cfs.setDirection(item);
  }
}
