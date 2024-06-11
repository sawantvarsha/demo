import {
  Component,
  OnInit,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { CustomerCommonfunctionsService } from '../../../services/customer-commonfunctions.service';
import { CommonApiService } from '../../../services/common-api.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/services/config.service';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-mutualfund-compare',
  templateUrl: './mutualfund-compare.component.html',
  styleUrls: ['./mutualfund-compare.component.scss'],
})
export class MutualfundCompareComponent implements OnInit, OnDestroy {
  isProd = environment.production;
  domainURL = environment.domainURL;
  @ViewChild('baseChart', { static: false }) baseChart: ElementRef;

  addfundflag: boolean[] = [];
  FundName: string;
  SelectedMFBucket = [];
  RiskRating = [0, 1, 2, 3, 4, 5];
  factsheetdata = [];
  Link: any;
  FactSheetNoteMasterID: any;
  toggleSection = {
    performanceOverview: {
      showorhide: false,
    },
    fundOverview: {
      showorhide: false,
    },
    keyMetrics: {
      showorhide: false,
    },
    assetInformation: {
      showorhide: false,
    },
    aboutFund: {
      showorhide: false,
    },
  };

  selectedBIndex = 0;
  fundData: {
    fundOverview: {
      NAV: string;
      CCY: string;
      LTV: string;
      AssetClass: string;
      Category: string;
      FundSize: string;
    };
    keyMterics: {
      AnnualManagementFee: string;
      ExitLoad: string;
      EntryLoad: string;
      SwitchingFees: string;
      TradeFee: string;
      Age: string;
      DateOfInception: string;
      MinInitialInvestment: string;
      MinSIPAmount: string;
      MinSWPAmount: string;
    };
    analysis: {
      RiskRating: string;
    };
    assetInformation: {
      GeographicalRegion: string;
      SpecialistSector: string;
    };
    aboutFund: {
      FundCode: string;
      ISINCode: string;
      FundUmbrella: string;
      FundManager: string;
      Factsheet: string;
    };
  }[] = [];

  ShowChart = false;
  CcyFlagPath = '';

  MFList = [];

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      easing: 'easeInOutBack',
      duration: 520,
    },
    showLines: true,
    scales: {
      xAxes: [
        {
          gridLines: {
            color: 'rgba(200, 200, 200, 0.05)',
            lineWidth: 1,
          },
          display: false,
        },
      ],
      yAxes: [
        {
          gridLines: {
            color: 'rgba(200, 200, 200, 0.08)',
            lineWidth: 1,
          },
          display: false,
        },
      ],
    },
    legend: {
      display: false,
      labels: {
        fontColor: '#000000',
      },
      position: 'top',
    },
    bezierCurve: true,
  };
  chartData = [{ data: [330, 600, 260, 700], label: 'Account A' }];
  chartLabels = ['A', 'B', 'C', 'D'];

  MFChartData: any;
  MFChartLabels: any;
  getFactsheetDataSubscriber: Subscription;
  ExpandOrCollapsebtn = {
    value: 'Expand All',
    flag: false,
  };

  Chartcolor = [
    {
      backgroundColor: 'rgba(0, 154, 255, .1)',
      borderColor: 'rgb(0, 154, 255)',
      pointBackgroundColor: 'rgb(0, 154, 255)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .8)',
    },
  ];

  constructor(
    private elem: ElementRef,
    public router: Router,
    public afs: WorkflowApiService,
    public cfs: CustomerCommonfunctionsService,
    public api: CommonApiService
  ) {
    // for (let i = 0; i < 4; i++) {
    //   this.addfundflag[i] = false;
    // }
    this.MFChartData = [];
    this.ExpandOrCollapsebtn.value = 'Expand All';
    this.ExpandOrCollapsebtn.flag = false;
    this.MFChartLabels = [];
  }
  ngOnDestroy(): void {
    if (this.getFactsheetDataSubscriber) {
      this.getFactsheetDataSubscriber.unsubscribe();
    }
    this.ResetValues();
    // throw new Error('Method not implemented.');
  }

  ngOnInit() {
    try {
      this.ResetValues();
      // for (let i = 1; i <= 4; i++) {
      //   if (i === (this.SelectedMFBucket.length)) {
      //     this.addfundflag[i] = false;
      //   } else {
      //     this.addfundflag[i] = true;
      //   }
      // }
    } catch (ex) {}

    this.afs.loadMutualFunds();
    this.afs.MFList.subscribe((res) => {
      if (res) {
        this.MFList = res;
      }
    });
    this.afs.ResetMFDetails();
    this.afs.MFDetails.subscribe((res: any) => {
      if (res) {
        try {
          res.CcyFlagPath = this.isProd
            ? 'assets/App_Resources/App_Resources/RMW_Images/Flags/' +
              res.Ccy +
              '.png'
            : '../../../../assets/App_Resources/App_Resources/RMW_Images/Flags/' +
              res.Ccy +
              '.png';
          this.SelectedMFBucket.push(res);
          //console.log(this.SelectedMFBucket);
          this.SelectedMFBucket.forEach((mf) => {
            mf.FundSize[0] = parseFloat(mf.FundSize[0]).toFixed(2);
          });
        } catch (ex) {}
      }
    });
  }

  ResetValues() {
    this.SelectedMFBucket = [];
    for (let i = 1; i <= 4; i++) {
      this.addfundflag[i] = false;
    }
  }

  toggleAccordian(sectionId: any) {
    try {
      // const elemt = event.target;
      // // console.log(element);
      // const panel = elemt.nextElementSibling;
      // const arrow = elemt.querySelector('.arrow');
      // // console.log(arrow);
      // arrow.classList.toggle('active');
      // // console.log(panel);
      // if (panel.style.maxHeight) {
      //   panel.style.maxHeight = null;
      // } else {
      //   panel.style.maxHeight = panel.scrollHeight + 'px';
      // }
      switch (sectionId) {
        case '1':
          this.toggleSection.performanceOverview.showorhide =
            !this.toggleSection.performanceOverview.showorhide;

          break;
        case '2':
          this.toggleSection.fundOverview.showorhide =
            !this.toggleSection.fundOverview.showorhide;
          break;
        case '3':
          this.toggleSection.keyMetrics.showorhide =
            !this.toggleSection.keyMetrics.showorhide;
          break;
        case '4':
          this.toggleSection.assetInformation.showorhide =
            !this.toggleSection.assetInformation.showorhide;
          break;
        case '5':
          this.toggleSection.aboutFund.showorhide =
            !this.toggleSection.aboutFund.showorhide;
          break;
        default:
          break;
      }
    } catch (Ex) {}
  }

  fnExpandAccordian() {
    this.ExpandOrCollapsebtn.flag = !this.ExpandOrCollapsebtn.flag;
    if (this.ExpandOrCollapsebtn.flag) {
      this.ExpandOrCollapsebtn.value = 'Collapse All';
      this.toggleSection.performanceOverview.showorhide = true;
      this.toggleSection.fundOverview.showorhide = true;
      this.toggleSection.keyMetrics.showorhide = true;
      this.toggleSection.assetInformation.showorhide = true;
      this.toggleSection.aboutFund.showorhide = true;
    } else {
      this.ExpandOrCollapsebtn.value = 'Expand All';
      this.toggleSection.performanceOverview.showorhide = false;
      this.toggleSection.fundOverview.showorhide = false;
      this.toggleSection.keyMetrics.showorhide = false;
      this.toggleSection.assetInformation.showorhide = false;
      this.toggleSection.aboutFund.showorhide = false;
    }
  }

  addfund(i: number) {
    this.addfundflag[i] = !this.addfundflag[i];
    // setTimeout(() => {
    window.setTimeout(function () {
      switch (i) {
        case 1:
          document.getElementById('searchfundcontrol1').focus();
          break;
        case 2:
          document.getElementById('searchfundcontrol2').focus();
          break;
        case 3:
          document.getElementById('searchfundcontrol3').focus();
          break;
        case 4:
          document.getElementById('searchfundcontrol4').focus();
          break;
      }
    }, 0);
    // }, 2000);
  }

  SelectMFOnEnter(e) {
    try {
      const MFCode = $('.HoverSuggestion').data('mfdata');
      this.selectedBIndex = 0;
      console.log(e);
      // Search the MF in List
      // eslint-disable-next-line @typescript-eslint/no-shadow
      this.MFList.forEach((element) => {
        if (element.Code === MFCode) {
          this.InsertMFinBucket(element);
        }
      });
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  fnToggleGraph() {
    this.ShowChart = !this.ShowChart;
  }

  ChangeIndex(_index) {
    try {
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
      // this.apifunction.log(4, Error, 'share-component.component.ts', 'ChangeIndex()');
    }
  }
  InsertMFinBucket(MFDetails: any) {
    this.afs.ResetMFDetails();
    this.afs.getMFDetails(MFDetails.Code);
    this.afs
      .getMFNAVHistorychart(MFDetails.Code, '', '', '1Y')
      .subscribe((res) => {
        const data = res.GetDateChartdataResult;
        if (data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          if (data.length > 0) {
            const MFHistoryDataArr = data.map((r) =>
              parseFloat(r.IH_Fixing_Value)
            );
            const MFHistoryLabelArr = data.map((r) => r.IH_Fixing_Date);
            const MFHistoryData = MFHistoryDataArr.splice(
              MFHistoryDataArr.length - 10,
              MFHistoryDataArr.length
            );
            const MFHistoryLabels = MFHistoryLabelArr.splice(
              MFHistoryLabelArr.length - 10,
              MFHistoryLabelArr.length
            );
            //console.log(this.SelectedMFBucket);
            this.MFChartData.push([{ data: MFHistoryData }]);
            // this.MFChartData.push([{ data: MFHistoryDataArr }]);
            this.MFChartLabels.push(MFHistoryLabels);
            // this.MFChartLabels.push(MFHistoryLabelArr);
            // this.chartData.push(MFHistoryData);
            // this.chartLabels = MFHistoryLabelArr.splice(MFHistoryLabelArr.length - 10, MFHistoryLabelArr.length);
          }

          // this.chartData[0].data = array;
        }
      });
    // this.afs.NAVHistory.subscribe((res: any[]) => {
    //
    // });
    this.FundName = '';
  }
  DeleteMFFromBucket(index: any) {
    try {
      this.SelectedMFBucket.splice(index, 1);
      this.addfundflag[index] = true;
      this.chartData.splice(index, 1);
      this.chartLabels.splice(index, 1);
      this.MFChartData.splice(index, 1);
      // this.MFChartData.push([{ data: MFHistoryDataArr }]);
      this.MFChartLabels.splice(index, 1);
      // for (let i = 1; i <= 4; i++) {
      //   if (i === (this.SelectedMFBucket.length)) {
      //     this.addfundflag[i] = false;
      //   } else {
      //     this.addfundflag[i] = true;
      //   }
      // }
    } catch (ex) {}
    // this.addfundflag[this.SelectedMFBucket.length - 1] = !this.addfundflag[this.SelectedMFBucket.length - 1];
  }
  sendDataforBookOrder(MFDetails) {
    // this.cfs.setMFData(MFDetails);
    // this.router.navigate(['NewOrder', MFDetails.Code[0]]);
    console.log(MFDetails.Name[0]);
    this.api.setAsset(MFDetails.Name[0]);
    this.router.navigate(['/neworderentry/funds']);
  }
  viewFactSheet(item) {
    this.FactSheetNoteMasterID = item.Note_Master_ID[0];
    if (this.FactSheetNoteMasterID) {
      this.afs.ProductAttachmentList(this.FactSheetNoteMasterID);
      this.getFactsheetDataSubscriber =
        this.afs.getFactsheetDataObserver.subscribe((res) => {
          if (res) {
            this.factsheetdata = res;
            this.showFile(
              this.factsheetdata[0].DGT_ID,
              this.FactSheetNoteMasterID
            );
          } else {
            this.factsheetdata = [];
          }
        });
    }
  }
  showFile(DGTID, NoteMasterID) {
    this.Link =
      'http://' +
      AppConfig.settings.CSP_FXPricingURL +
      '/FinIQService/RMWorkstation_JSON.svc/Get_Uploaded_Documents_API/' +
      NoteMasterID +
      '/' +
      DGTID;
    window.open(this.Link);
  }
}
