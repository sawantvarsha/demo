import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonApiService } from 'src/app/services/common-api.service';
import { environment } from 'src/environments/environment';
import { WorkflowApiService } from '../../../services/workflow-api.service';

import { HomeApiService } from '../../../services/home-api.service';
import { AuthService } from '../../../services/auth/auth.service';
import { AppConfig } from 'src/app/services/config.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LCMApiService } from 'src/app/services/lcmapi.service';

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

declare enum LCM {
  Greeks,
  Backtest,
  Stresstest,
  UnderlyingPrices,
}
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
};

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss'],
})
export class WorkbenchComponent implements OnInit, OnDestroy {
  @Input() data = [];
  @Input() product: string;
  @Input() templateID: any;
  @Input() index: any;
  @Input() dataLength: any;
  RMWLayoutSubscription: Subscription;
  lcm: LCM;
  isLoading: boolean;
  flag = false;
  Link = '';
  background = '';
  layout = [];
  like = false;
  gridColumn: any;
  column = [];
  showOrderEntry: boolean = false;
  rmwlayout = [];
  getFirstRowDataArray: any[] = [];
  getSecondRowDataArray: any[] = [];
  getThirdRowDataArray: any[] = [];
  getFourthRowDataArray: any[] = [];
  getFifthRowDataArray: any[] = [];
  getSixthRowDataArray: any[] = [];
  selectedProduct = '';
  showRecommendations: boolean = false;
  // showFactsheet: any = [];
  showFactsheet: boolean = false;
  factsheetdata = [];
  recommendedProductsList: any[];
  recommendatioMsg: any;
  listType = 'Private';
  // templateID = '';
  controlledSwiper: any;
  showFolder = false;
  links = [];
  imgUrl = '../../../../assets/App_Resources/';
  imagepathProd = 'assets';
  userType = '';
  isProd = environment.production;
  privateList = [];
  publicList = [];
  allList = [];
  all = '';
  private = '';
  public = '';
  folderName = '';
  message = '';
  showFundDetails = false;
  showBondDetails: boolean;
  stateArr: any;
  showNewFundDetails: boolean;
  showSIP: boolean = false;
  showbundle: boolean;
  lifeValLayout: any = [];
  layoutTypes: any[];
  linkBS: Subscription;
  popUpSelected: string = '';
  showPopUp: boolean = false;
  backTestNoteMasterId: any;
  backTestTemplateID: any;
  StartDate: any;
  TestCases: any;
  backtestNMID: any;
  entityId: any;
  AssetClass: any;
  tradingHistoryArr: any[];
  whatIfBackTestArr: any[];
  countArrOfTestcaseNoDays: any = [];
  barChartY = [];
  barChartX = [];

  twrrChartY = [];
  twrrChartX = [];
  TWRRArr: any[] = [];

  chartData = [];

  lifecycle_tab: string[] = ['Greeks', 'Backtest', 'Stress Test'];

  lineChartOptions: Partial<ChartOptions> = {
    series: [
      {
        name: 'Cost',
        type: 'line',
        data: [0, 1, 2, 3],
      },
      {
        name: 'Networth',
        type: 'line',
        data: [0, 3, 4, 5],
      },
      // {
      //   name: 'Growth',
      //   type: 'line',
      //   data: [0],
      // },
    ],
    colors: ['#0070C0', '#faad32'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '30%',
      },
    },
    markers: {
      size: 2,
      colors: undefined,
      strokeColors: '#fff',
      strokeWidth: 2,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: 'circle',
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      onClick: undefined,
      onDblClick: undefined,
      showNullDataPoints: true,
      hover: {
        size: undefined,
        sizeOffset: 3,
      },
    },
    noData: {
      text: 'No Data',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: '14px',
      },
    },
    chart: {
      height: 600,
      width: 480,
      type: 'line',
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    grid: {
      show: false, // you can either change hear to disable all grids
      xaxis: {
        lines: {
          show: true, //or just here to disable only x axis grids
        },
      },
      yaxis: {
        lines: {
          show: true, //or just here to disable only y axis
        },
      },
    },
    stroke: {
      width: [0, 4],
    },
    dataLabels: {
      enabled: false,
      enabledOnSeries: [1],
    },
    legend: {
      show: true,
      position: 'top',
    },
    labels: ['2020'],
    xaxis: {
      type: 'datetime',
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: true,
        minHeight: 100,
        maxHeight: 180,
      },
      tooltip: {
        enabled: false,
      },
    },
    tooltip: {
      enabled: true,
    },
    yaxis: [
      {
        show: false,
      },
    ],
    theme: {
      mode: 'dark',
      palette: 'palette1',
      monochrome: {
        enabled: false,
        color: '#0070C0',
        shadeTo: 'light',
        shadeIntensity: 1,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };
  popUpName: any;

  showGreeks: boolean = false;
  showStressTest: boolean = false;
  showBacktest: boolean = false;
  Format: string = 'Greeks';
  previousIndex: any;
  linkFlag: boolean = false;
  NoteMasterID: any;
  showUnderlyingPrices: boolean;
  docListFlag: boolean = false;
  ProductName: any;
  constructor(
    private workflowApi: WorkflowApiService,
    public cfs: CommonApiService,
    private router: Router,
    public homeapi: HomeApiService,
    private Auth: AuthService,
    public datepipe: DatePipe,
    private lcmapi: LCMApiService
  ) {}

  ngOnDestroy(): void {
    try {
      if (this.RMWLayoutSubscription) {
        this.RMWLayoutSubscription.unsubscribe();
      }
      this.linkBS.unsubscribe();
      this.workflowApi.RMWLinkData.next([]);
    } catch (error) {}
  }

  ngOnInit(): void {
    // console.log(this.index, "index");
    // for(let i = 0; i < this.dataLength; i++) {
    //       this.homeapi.showFactsheet.push(false);
    // }
    // this.userType = sessionStorage.getItem('UserType');
    // if (this.userType.toLowerCase() === 'client') {
    //   this.userType = 'Client';
    // }
    // if (this.userType.toLowerCase() === 'rm') {
    //   this.userType = 'RM';
    // }
    this.userType = sessionStorage.getItem('FinIQGroupID');

    this.cfs.selectedStateObserver.subscribe((res) => {
      if (res) {
        this.stateArr = [];
        this.stateArr = res;
      }
    });

    this.workflowApi.getRMWLayout(this.data['Template_ID']);
    this.like = this.data['LikeValue'] === '1' ? true : false;
    // this.workflowApi.getRMWActionLinks(this.templateID, this.userType, 'Default'); //uncmment later
    this.getActionLinks();
    this.RMWLayoutSubscription = this.workflowApi.RMWLayoutObserver.subscribe(
      (rmwlayout: any) => {
        // console.log("LAYOUT FROM API: ",rmwlayout)
        this.isLoading = false;
        if (rmwlayout.length !== 0) {
          if (
            this.templateID ===
            rmwlayout.GetRMWMetadataFieldsResult[0].TemplateId
          ) {
            this.flag = true;
            this.rmwlayout = [];
            this.layout = [];
            let tempArray = [];
            if (
              this.product === 'NiftyParticipation' ||
              this.product === 'EquityAutocallableNote'
            ) {
              rmwlayout.GetRMWMetadataFieldsResult.forEach((element) => {
                if (element.LayoutCode === 'Default') {
                  this.rmwlayout.push(element);
                } else {
                  this.lifeValLayout.push(element);
                }
              });
            } else {
              this.rmwlayout = rmwlayout.GetRMWMetadataFieldsResult;
            }
            // tempArray.forEach(element => {
            //   this.rmwlayout.push(element);
            // });

            // this.rmwlayout = rmwlayout.GetRMWMetadataFieldsResult;

            this.background = this.rmwlayout[0].TemplateBackground;
            // console.log(this.background);
            this.layout = [];
            this.layout = this.rmwlayout.sort((a, b) =>
              a.DesignLabelID < b.DesignLabelID ? -1 : 1
            );

            this.layoutTypes = [
              ...new Set(
                this.lifeValLayout
                  .map((e) => e.LayoutCode)
                  .filter((e) => e !== undefined)
              ),
            ];

            // console.log('layoutTypes', this.layoutTypes);

            this.layoutTypes.forEach((type) => {
              let arraynew: any = {
                layoutArray: this.rmwlayout.filter(
                  (a) => a.LayoutCode === type
                ),
              };
              this.lifeValLayout.push(arraynew);
            });
            // console.log('lifeValLayout array', this.lifeValLayout);

            this.background = this.rmwlayout[0].TemplateBackground;
            // console.log(this.background);
            this.layout = [];
            this.layout = this.rmwlayout.sort((a, b) =>
              a.DesignLabelID < b.DesignLabelID ? -1 : 1
            );

            // console.log('RMW LAYOUT', this.rmwlayout);

            // split ROW and Column
            this.splitRowColumn();

            // // getMax Column
            // this.templateID = this.layout[0].TemplateId;
            this.getMaxColumn(this.product);

            // // to fill empty row
            this.fillEmptyRow();

            // Merge Column
            //  this.mergeColumn();
            this.getFirstRowData();
            this.getSecondRowData();
            this.getThirdRowData(this.data);
            this.getFourthRowData();
            this.getFifthRowData();
            this.getSixthRowData(); //ChitraM |  this.getSixthRowData();
            this.IsDataLoaded();
            // this.layout = [];
            // console.log('data', this.data);
          }
        }
      }
    );
    this.workflowApi.getFactsheetDataObserver.subscribe((res) => {
      if (res) {
        // console.log(res);
        this.factsheetdata = res;
        this.isLoading = false;
        this.docListFlag = false;
        // console.log('getFactsheetDataObserver', res.body)
      } else {
        this.factsheetdata = [];
        this.docListFlag = false;
        // console.log('no data');
      }
    });

    // this.linkBS = this.workflowApi.RMWLinkDataObserver.subscribe((res: any) => {
    //   if (res.length !== 0) {
    //      console.log(res);
    //     this.links = [];
    //     res = res.GetRMWActionLinksMetadataFieldsResult;
    //     this.links = res;
    //   }
    // });

    this.workflowApi.Get_FoldersAPI('', this.Auth.EntityID).subscribe((res) => {
      this.publicList = res;
    });
    this.workflowApi
      .Get_FoldersAPI(sessionStorage.getItem('Username'), this.Auth.EntityID)
      .subscribe((res) => {
        this.privateList = res;
      });
    this.workflowApi
      .Get_FoldersAPI('ALL', this.Auth.EntityID)
      .subscribe((res) => {
        this.allList = res;
      });
  }

  getActionLinks() {
    this.linkFlag = true;
    try {
      this.workflowApi
        .getRMWActionLinks(this.templateID, this.userType, 'Default')
        .subscribe((res) => {
          if (res.length !== 0) {
            this.linkFlag = false;
            // console.log(res);
            this.links = [];
            res = res.GetRMWActionLinksMetadataFieldsResult;
            this.links = res;
          }
        });
    } catch (error) {}
  }

  splitRowColumn() {
    // console.log('LAYOUT',this.layout)
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.layout.length; i++) {
      if (this.layout[i].DesignLabelID.length > 5) {
        this.layout[i].row = this.layout[i].DesignLabelID.split(
          'Label'
        )[1].substring(0, 2);
        this.layout[i].column = this.layout[i].DesignLabelID.split(
          'Label'
        )[1].substring(2, 4);
        this.column[i] = parseFloat(
          this.layout[i].DesignLabelID.split('Label')[1].substring(2, 4)
        );
        this.layout[i].mergeData = '';
        this.layout[i].mergeStyle = '';
        this.layout[i].image = '';
      }
    }
    // console.log('COLUMN', this.column)
    // if (this.templateID === "5") {
    //   this.layout.push({
    //     row: '03',
    //     column: '18',
    //     DesignLabelID: 'Label0398',
    //     FieldDisplayName: '',
    //     TargetField: '',
    //     FieldType: '',
    //     ImageDataField: ''
    //   });

    // }
    // // else {
    //   this.layout.push({
    //     row: '02',
    //     column: '98',
    //     DesignLabelID: 'Label0298',
    //     FieldDisplayName: '',
    //     TargetField: '',
    //     FieldType: '',
    //     ImageDataField: ''
    //   });

    // }
    this.layout = this.layout.sort((a, b) =>
      a.DesignLabelID < b.DesignLabelID ? -1 : 1
    );
  }

  getMaxColumn(id) {
    // this.gridColumn = this.rmwlayout.filter(f => (f.row === '01' && f.FieldVisibleYN === 'Y')).length;
    this.gridColumn = this.column.reduce((a, b) => {
      return Math.max(a, b);
    });
    if (id === 'Fund_Setup') {
      this.gridColumn = 9;
    }
    if (id === 'Bonds') {
      this.gridColumn = 14;
    }
    if (id === 'Product_Maintenance') {
      this.gridColumn = this.column.reduce((a, b) => {
        return Math.max(a, b);
      });
    }
    if (id === 'NiftyParticipation') {
      this.gridColumn = 11;
    }

    if (id === 'EquityAutocallableNote') {
      this.gridColumn = 11;
    }
  }

  fillEmptyRow() {
    // console.log(this.layout);
    for (let i = 0; i < this.layout.length - 1; i++) {
      const j = i + 1;
      if (j < this.layout.length) {
        if (parseFloat(this.layout[i].row) !== parseFloat(this.layout[j].row)) {
          let col = parseFloat(this.layout[i].column);
          // let remainingColumn = this.gridColumn - col;
          // console.log(remainingColumn);
          for (let k = col; k < this.gridColumn; k++) {
            col = col + 1;
            this.layout.push({
              row: this.layout[i].row,
              column: col < 10 ? '0' + col.toString() : col.toString(),
              DesignLabelID:
                'Label' +
                this.layout[i].row +
                (col < 10 ? '0' + col.toString() : col.toString()),
              FieldDisplayName: '',
              TargetField: '',
              FieldType: '',
              ImageDataField: '',
            });
          }
          i++;
          this.layout = this.layout.sort((a, b) =>
            a.DesignLabelID < b.DesignLabelID ? -1 : 1
          );
        }
      }
    }
  }
  getFirstRowData(): any[] {
    this.getFirstRowDataArray = [];
    this.getFirstRowDataArray = this.layout.filter((d) => d.row === '00');
    // this.getFirstRowDataArray.map(e=>{
    //   d.image
    // })
    // console.table(this.layout.filter(d => d.row === '00'));
    // console.log('FIRST ROW wrk', this.getFirstRowDataArray);
    return this.getFirstRowDataArray;
  }

  getSecondRowData() {
    this.getSecondRowDataArray = [];
    // console.table(this.layout.filter(d => d.row !== '00'));
    this.getSecondRowDataArray = this.layout.filter((d) => d.row === '01');
    // console.log('SECOND ROW wrk', this.getSecondRowDataArray);
    // return this.getSecondRowDataArray;
  }

  getThirdRowData(rmwdata) {
    this.getThirdRowDataArray = [];
    this.mergeData(rmwdata);
    // console.log('THIRD ROW wrk', this.getThirdRowDataArray);
    // return this.getThirdRowDataArray;
  }

  mergeData(_rmwdata) {
    for (let i = 0; i < this.layout.length; i++) {
      if (parseFloat(this.layout[i].row) === 2) {
        // if (this.layout[i].TargetField.includes('Rating') && this.layout[i + 1].TargetField.includes('Misc')) {
        //   this.layout[i].TargetField = this.layout[i].TargetField + '+' + this.layout[i + 1].TargetField;
        //   this.layout[i].mergeStyle = this.layout[i + 1].FieldStyle;
        //   this.layout[i + 1].column = '99';
        //   this.layout[i + 1].DesignLabelID = 'Label' + this.layout[i].row + '99';
        //   this.layout[i + 1].FieldDisplayName = '';
        //   this.layout[i].FieldType = '';
        //   // this.layout[i].TextAfterData = this.layout[i + 1].TextAfterData;
        //   // this.layout[i].MergeFieldDataType = this.layout[i + 1].FieldDataType;
        // }
        if (
          this.layout[i].FieldType === 'Label' &&
          this.layout[i + 1].FieldType === 'Data'
        ) {
          this.layout[i].TargetField = this.layout[i + 1].TargetField + '*';
          this.layout[i].mergeStyle = this.layout[i + 1].FieldStyle;
          this.layout[i].MergeFieldDataType = this.layout[i + 1].FieldDataType;
          this.layout[i + 1].column = '99';
          this.layout[i + 1].DesignLabelID =
            'Label' + this.layout[i].row + '99';
          this.layout[i + 1].FieldDisplayName = '';
          this.layout[i].FieldType = '';
          this.layout[i].TextAfterData = this.layout[i + 1].TextAfterData;
        }

        if (
          this.layout[i].TargetField.includes('Currency') &&
          this.layout[i + 1].TargetField.includes('Amount')
        ) {
          this.layout[i].TargetField =
            this.layout[i].TargetField + '#' + this.layout[i + 1].TargetField;
          this.layout[i].mergeStyle = this.layout[i + 1].FieldStyle;
          this.layout[i + 1].column = '99';
          this.layout[i + 1].DesignLabelID =
            'Label' + this.layout[i].row + '99';
          this.layout[i + 1].FieldDisplayName = '';
          this.layout[i].FieldType = '';
          this.layout[i].TextAfterData = this.layout[i + 1].TextAfterData;
          this.layout[i].MergeFieldDataType = this.layout[i + 1].FieldDataType;
        }

        if (
          this.layout[i].TargetField.includes('Rating') &&
          this.layout[i + 1].TargetField.includes('Misc')
        ) {
          // console.log("this.layout[i].TargetField", this.layout[i].TargetField, "this.layout[i + 1].TargetField", this.layout[i + 1].TargetField);
          this.layout[i].TargetField =
            this.layout[i].TargetField + '#' + this.layout[i + 1].TargetField;
          this.layout[i].mergeStyle = this.layout[i + 1].FieldStyle;
          this.layout[i + 1].column = '99';
          this.layout[i + 1].DesignLabelID =
            'Label' + this.layout[i].row + '99';
          this.layout[i + 1].FieldDisplayName = '';
          this.layout[i].FieldType = '';
          this.layout[i].TextAfterData = this.layout[i + 1].TextAfterData;
          this.layout[i].MergeFieldDataType = this.layout[i + 1].FieldDataType;
        }

        if (this.layout[i].TargetField.includes('dbo')) {
          // console.log('target Field', this.layout[i]);
        }
      }
    }

    this.layout = this.rmwlayout.sort((a, b) =>
      a.DesignLabelID < b.DesignLabelID ? -1 : 1
    );

    this.getThirdRowDataArray = this.layout.filter(
      (d) => parseFloat(d.row) === 2
    );
    // console.log(this.getThirdRowDataArray)
    if (this.product === 'Bonds' && this.getThirdRowDataArray.length > 15) {
      this.getThirdRowDataArray.length = 15;
    }
  }

  getFourthRowData() {
    // console.table(this.layout.filter(d => d.row !== '00'));
    this.getFourthRowDataArray = [];
    // for (let i = 0; i < this.layout.length; i++) {
    //   if (parseFloat(this.layout[i].row) === 3) {

    //     if (this.layout[i].FieldType === 'Label' && this.layout[i + 1].FieldType === 'Data') {
    //       this.layout[i].TargetField = this.layout[i + 1].TargetField + '*';
    //       this.layout[i].mergeStyle = this.layout[i + 1].FieldStyle;
    //       this.layout[i].MergeFieldDataType = this.layout[i + 1].FieldDataType;
    //       this.layout[i + 1].column = '99';
    //       this.layout[i + 1].DesignLabelID = 'Label' + this.layout[i].row + '99';
    //       this.layout[i + 1].FieldDisplayName = '';
    //       this.layout[i].FieldType = '';
    //       this.layout[i].TextAfterData = this.layout[i + 1].TextAfterData;
    //     }
    //     if (this.layout[i].TargetField.includes('Rating') && (this.layout[i + 1].TargetField.includes('Curve'))) {
    //       this.layout[i].TargetField = this.layout[i].TargetField + '#' + this.layout[i + 1].TargetField;
    //       this.layout[i].mergeStyle = this.layout[i + 1].FieldStyle;
    //       this.layout[i + 1].column = '99';
    //       this.layout[i + 1].DesignLabelID = 'Label' + this.layout[i].row + '99';
    //       this.layout[i + 1].FieldDisplayName = '';
    //       this.layout[i].FieldType = '';
    //       this.layout[i].TextAfterData = this.layout[i + 1].TextAfterData;
    //       this.layout[i].MergeFieldDataType = this.layout[i + 1].FieldDataType;
    //     }

    //   }
    // }

    this.layout = this.rmwlayout.sort((a, b) =>
      a.DesignLabelID < b.DesignLabelID ? -1 : 1
    );
    // if (this.selectedProduct === 'Bonds') {
    //   this.layout.push({
    //     row: '03',
    //     column: '99',
    //     DesignLabelID: 'Label0399',
    //     FieldDisplayName: '',
    //     TargetField: '',
    //     FieldType: '',
    //     ImageDataField: ''
    //   });
    // }

    this.getFourthRowDataArray = this.layout.filter((d) => d.row === '03');
    this.getFourthRowDataArray.sort((a, b) =>
      a.DesignLabelID < b.DesignLabelID ? -1 : 1
    );
    if (this.getFourthRowDataArray.length > 14) {
      this.getFourthRowDataArray.length = 14;
    }
    this.getFourthRowDataArray.forEach((element, i) => {
      if (parseFloat(element.column) !== i) {
        this.getFourthRowDataArray.push({
          row: '03',
          column: i < 10 ? '0' + i.toString() : i.toString(),
          DesignLabelID:
            'Label03' + (i < 10 ? '0' + i.toString() : i.toString()),
          FieldDisplayName: '',
          TargetField: '',
          FieldType: '',
          ImageDataField: '',
        });
      }
    });
    if (this.product === 'Bonds') {
      this.getFourthRowDataArray.pop();
      this.getFourthRowDataArray.pop();
      this.getFourthRowDataArray.pop();
      this.getFourthRowDataArray.push({
        row: '03',
        column: '15',
        DesignLabelID: 'Label0315',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      // this.getFourthRowDataArray.push({
      //   row: '03',
      //   column: '99',
      //   DesignLabelID: 'Label0399',
      //   FieldDisplayName: '',
      //   TargetField: '',
      //   FieldType: '',
      //   ImageDataField: ''
      // });
      // this.getFourthRowDataArray.push({
      //   row: '03',
      //   column: '99',
      //   DesignLabelID: 'Label0399',
      //   FieldDisplayName: '',
      //   TargetField: '',
      //   FieldType: '',
      //   ImageDataField: ''
      // });
    } else if (this.product === 'Fund_Setup') {
      this.getFourthRowDataArray.push({
        row: '03',
        column: '01',
        DesignLabelID: 'Label0301',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getFourthRowDataArray.push({
        row: '03',
        column: '02',
        DesignLabelID: 'Label0302',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
    } else if (this.product === 'EquityAutocallableNote') {
      this.getFourthRowDataArray.pop();
      this.getFourthRowDataArray.pop();
      this.getFourthRowDataArray.pop();
      this.getFourthRowDataArray.pop();

      this.getFourthRowDataArray.push({
        row: '03',
        column: '07',
        DesignLabelID: 'Label0307',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });

      this.getFourthRowDataArray.push({
        row: '03',
        column: '11',
        DesignLabelID: 'Label0311',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });

      this.getFourthRowDataArray.push({
        row: '03',
        column: '12',
        DesignLabelID: 'Label0312',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });

      this.getFourthRowDataArray.push({
        row: '03',
        column: '13',
        DesignLabelID: 'Label0313',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });

      // this.getFourthRowDataArray.push({
      //   row: '03',
      //   column: '04',
      //   DesignLabelID: 'Label0302',
      //   FieldDisplayName: '',
      //   TargetField: '',
      //   FieldType: '',
      //   ImageDataField: ''
      // });
    }

    this.getFourthRowDataArray.sort((a, b) =>
      a.DesignLabelID < b.DesignLabelID ? -1 : 1
    );
    // console.log(this.getFourthRowDataArray);
    // if (this.selectedProduct === 'Bonds') {
    //   this.getFourthRowDataArray.pop();
    // }]
    if (this.product === 'Bonds' && this.getFourthRowDataArray.length > 12) {
      this.getFourthRowDataArray.length = 12;
    }
    // console.log('FOURTH ROW wrk', this.getFourthRowDataArray);

    // return this.getFourthRowDataArray;
  }

  getFifthRowData(): any[] {
    this.getFifthRowDataArray = [];
    for (let i = 0; i < this.layout.length; i++) {
      if (parseFloat(this.layout[i].row) === 4) {
        if (
          this.layout[i].FieldType === 'Label' &&
          this.layout[i + 1].FieldType === 'Data'
        ) {
          this.layout[i].TargetField = this.layout[i + 1].TargetField + '*';
          this.layout[i].mergeStyle = this.layout[i + 1].FieldStyle;
          this.layout[i].MergeFieldDataType = this.layout[i + 1].FieldDataType;
          this.layout[i + 1].column = '99';
          this.layout[i + 1].DesignLabelID =
            'Label' + this.layout[i].row + '99';
          this.layout[i + 1].FieldDisplayName = '';
          this.layout[i].FieldType = '';
          this.layout[i].TextAfterData = this.layout[i + 1].TextAfterData;
        }
        if (
          this.layout[i].TargetField.includes('Currency') &&
          this.layout[i + 1].TargetField.includes('Amount')
        ) {
          this.layout[i].TargetField =
            this.layout[i].TargetField + '#' + this.layout[i + 1].TargetField;
          this.layout[i].mergeStyle = this.layout[i + 1].FieldStyle;
          this.layout[i + 1].column = '99';
          this.layout[i + 1].DesignLabelID =
            'Label' + this.layout[i].row + '99';
          this.layout[i + 1].FieldDisplayName = '';
          this.layout[i].FieldType = '';
          this.layout[i].TextAfterData = this.layout[i + 1].TextAfterData;
          this.layout[i].MergeFieldDataType = this.layout[i + 1].FieldDataType;
        }
        if (
          this.layout[i].TargetField.includes('Rating') &&
          this.layout[i + 1].TargetField.includes('Bond')
        ) {
          this.layout[i].TargetField =
            this.layout[i].TargetField + '#' + this.layout[i + 1].TargetField;
          this.layout[i].mergeStyle = this.layout[i + 1].FieldStyle;
          this.layout[i + 1].column = '99';
          this.layout[i + 1].DesignLabelID =
            'Label' + this.layout[i].row + '99';
          this.layout[i + 1].FieldDisplayName = '';
          this.layout[i + 1].TargetField = '';
          this.layout[i].FieldType = '';
          this.layout[i].TextAfterData = this.layout[i + 1].TextAfterData;
          this.layout[i].MergeFieldDataType = this.layout[i + 1].FieldDataType;
        }
      }
    }

    this.getFifthRowDataArray = this.layout.filter((d) => d.row === '04');
    this.getFifthRowDataArray.sort((a, b) =>
      a.DesignLabelID < b.DesignLabelID ? -1 : 1
    );

    if (this.product === 'Bonds') {
      this.getFifthRowDataArray.push({
        row: '04',
        column: '01',
        DesignLabelID: 'Label0401',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getFifthRowDataArray.push({
        row: '04',
        column: '02',
        DesignLabelID: 'Label0402',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getFifthRowDataArray.push({
        row: '04',
        column: '03',
        DesignLabelID: 'Label0403',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getFifthRowDataArray.push({
        row: '04',
        column: '04',
        DesignLabelID: 'Label0404',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getFifthRowDataArray.push({
        row: '04',
        column: '05',
        DesignLabelID: 'Label0405',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getFifthRowDataArray.push({
        row: '04',
        column: '06',
        DesignLabelID: 'Label0406',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getFifthRowDataArray.push({
        row: '04',
        column: '07',
        DesignLabelID: 'Label0407',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
    } else {
      // for (let i = 0; i < this.gridColumn - 1; i++) {
      //   if (this.getFifthRowDataArray[i]) {
      //     if (parseFloat(this.getFifthRowDataArray[i].column) !== i) {
      //       this.getFifthRowDataArray.push({
      //         row: '04',
      //         column: i < 10 ? '0' + i.toString() : i.toString(),
      //         DesignLabelID:
      //           'Label04' + (i < 10 ? '0' + i.toString() : i.toString()),
      //         FieldDisplayName: '',
      //         TargetField: '',
      //         FieldType: '',
      //         ImageDataField: '',
      //       });
      //     }
      //   } else {
      //     this.getFifthRowDataArray.push({
      //       row: '04',
      //       column: i < 10 ? '0' + i.toString() : i.toString(),
      //       DesignLabelID:
      //         'Label04' + (i < 10 ? '0' + i.toString() : i.toString()),
      //       FieldDisplayName: '',
      //       TargetField: '',
      //       FieldType: '',
      //       ImageDataField: '',
      //     });
      //   }
      // }
    }
    this.getFifthRowDataArray.push({
      row: '04',
      column: '15',
      DesignLabelID: 'Label0415',
      FieldDisplayName: '',
      TargetField: '',
      FieldType: '',
      ImageDataField: '',
    });
    if (this.product === 'EquityAutocallableNote') {
      this.getFifthRowDataArray.push({
        row: '04',
        column: '00',
        DesignLabelID: 'Label0400',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getFifthRowDataArray.push({
        row: '04',
        column: '01',
        DesignLabelID: 'Label0401',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
    }

    this.getFifthRowDataArray.sort((a, b) =>
      a.DesignLabelID < b.DesignLabelID ? -1 : 1
    );
    // console.log('FIFTH ROW wrk', this.getFifthRowDataArray);
    return this.getFifthRowDataArray;
  }

  getSixthRowData(): any[] {
    this.getSixthRowDataArray = [];
    for (let i = 0; i < this.layout.length; i++) {
      if (parseFloat(this.layout[i].row) === 5) {
        if (
          this.layout[i].FieldType === 'Label' &&
          this.layout[i + 1].FieldType === 'Data'
        ) {
          this.layout[i].TargetField = this.layout[i + 1].TargetField + '*';
          this.layout[i].mergeStyle = this.layout[i + 1].FieldStyle;
          this.layout[i].MergeFieldDataType = this.layout[i + 1].FieldDataType;
          this.layout[i + 1].column = '99';
          this.layout[i + 1].DesignLabelID =
            'Label' + this.layout[i].row + '99';
          this.layout[i + 1].FieldDisplayName = '';
          this.layout[i].FieldType = '';
          this.layout[i].TextAfterData = this.layout[i + 1].TextAfterData;
        }
        if (
          this.layout[i].TargetField.includes('Currency') &&
          this.layout[i + 1].TargetField.includes('Amount')
        ) {
          this.layout[i].TargetField =
            this.layout[i].TargetField + '#' + this.layout[i + 1].TargetField;
          this.layout[i].mergeStyle = this.layout[i + 1].FieldStyle;
          this.layout[i + 1].column = '99';
          this.layout[i + 1].DesignLabelID =
            'Label' + this.layout[i].row + '99';
          this.layout[i + 1].FieldDisplayName = '';
          this.layout[i].FieldType = '';
          this.layout[i].TextAfterData = this.layout[i + 1].TextAfterData;
          this.layout[i].MergeFieldDataType = this.layout[i + 1].FieldDataType;
        }
        if (
          this.layout[i].TargetField.includes('Rating') &&
          this.layout[i + 1].TargetField.includes('Bond')
        ) {
          this.layout[i].TargetField =
            this.layout[i].TargetField + '#' + this.layout[i + 1].TargetField;
          this.layout[i].mergeStyle = this.layout[i + 1].FieldStyle;
          this.layout[i + 1].column = '99';
          this.layout[i + 1].DesignLabelID =
            'Label' + this.layout[i].row + '99';
          this.layout[i + 1].FieldDisplayName = '';
          this.layout[i + 1].TargetField = '';
          this.layout[i].FieldType = '';
          this.layout[i].TextAfterData = this.layout[i + 1].TextAfterData;
          this.layout[i].MergeFieldDataType = this.layout[i + 1].FieldDataType;
        }
      }
    }
    this.getSixthRowDataArray = this.layout.filter((d) => d.row === '05');
    this.getSixthRowDataArray.sort((a, b) =>
      a.DesignLabelID < b.DesignLabelID ? -1 : 1
    );
    if (this.product === 'Bonds') {
      this.getSixthRowDataArray.push({
        row: '05',
        column: '01',
        DesignLabelID: 'Label0501',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getSixthRowDataArray.push({
        row: '05',
        column: '02',
        DesignLabelID: 'Label0502',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getSixthRowDataArray.push({
        row: '05',
        column: '03',
        DesignLabelID: 'Label0503',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getSixthRowDataArray.push({
        row: '05',
        column: '04',
        DesignLabelID: 'Label0504',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getSixthRowDataArray.push({
        row: '05',
        column: '05',
        DesignLabelID: 'Label0505',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getSixthRowDataArray.push({
        row: '05',
        column: '06',
        DesignLabelID: 'Label0506',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getSixthRowDataArray.push({
        row: '05',
        column: '07',
        DesignLabelID: 'Label0507',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
    } else {
      // for (let i = 0; i < this.gridColumn - 1; i++) {
      //   if (this.getFifthRowDataArray[i]) {
      //     if (parseFloat(this.getFifthRowDataArray[i].column) !== i) {
      //       this.getFifthRowDataArray.push({
      //         row: '04',
      //         column: i < 10 ? '0' + i.toString() : i.toString(),
      //         DesignLabelID:
      //           'Label04' + (i < 10 ? '0' + i.toString() : i.toString()),
      //         FieldDisplayName: '',
      //         TargetField: '',
      //         FieldType: '',
      //         ImageDataField: '',
      //       });
      //     }
      //   } else {
      //     this.getFifthRowDataArray.push({
      //       row: '04',
      //       column: i < 10 ? '0' + i.toString() : i.toString(),
      //       DesignLabelID:
      //         'Label04' + (i < 10 ? '0' + i.toString() : i.toString()),
      //       FieldDisplayName: '',
      //       TargetField: '',
      //       FieldType: '',
      //       ImageDataField: '',
      //     });
      //   }
      // }
    }
    this.getSixthRowDataArray.push({
      row: '05',
      column: '15',
      DesignLabelID: 'Label0515',
      FieldDisplayName: '',
      TargetField: '',
      FieldType: '',
      ImageDataField: '',
    });
    if (this.product === 'EquityAutocallableNote') {
      this.getSixthRowDataArray.push({
        row: '05',
        column: '00',
        DesignLabelID: 'Label0500',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getSixthRowDataArray.push({
        row: '05',
        column: '01',
        DesignLabelID: 'Label0501',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getSixthRowDataArray.push({
        row: '05',
        column: '02',
        DesignLabelID: 'Label0502',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
      this.getSixthRowDataArray.push({
        row: '05',
        column: '03',
        DesignLabelID: 'Label0503',
        FieldDisplayName: '',
        TargetField: '',
        FieldType: '',
        ImageDataField: '',
      });
    }
    this.getSixthRowDataArray.sort((a, b) =>
      a.DesignLabelID < b.DesignLabelID ? -1 : 1
    );
    // console.log('FIFTH ROW wrk', this.getFifthRowDataArray);
    return this.getSixthRowDataArray;
  }
  // getSixthRowData() {
  //   console.log("getSixthRowData");
  //   this.getSixthRowDataArray = [];
  //   // console.table(this.layout.filter(d => d.row !== '00'));
  //   this.getSixthRowDataArray = this.layout.filter((d) => d.row === '05');
  //   this.getSixthRowDataArray.sort((a, b) =>
  //     a.DesignLabelID < b.DesignLabelID ? -1 : 1
  //   );
  //   console.log("this.product", this.product);
  //  console.log(this.getSixthRowDataArray);
  //   if (this.product === 'EquityAutocallableNote') {
  //     //if (this.layoutType.toLowerCase() === 'lifecycle') {
  //       for (let i = 0; i < this.gridColumn - 1; i++) {
  //         if (this.getSixthRowDataArray[i]) {
  //           if (parseFloat(this.getSixthRowDataArray[i].column) !== i) {
  //             this.getSixthRowDataArray.push({
  //               row: '05',
  //               column: i < 10 ? '0' + i.toString() : i.toString(),
  //               DesignLabelID:
  //                 'Label05' + (i < 10 ? '0' + i.toString() : i.toString()),
  //               FieldDisplayName: '',
  //               TargetField: '',
  //               FieldType: '',
  //               ImageDataField: '',
  //             });
  //           }
  //         } else {
  //           this.getSixthRowDataArray.push({
  //             row: '05',
  //             column: i < 10 ? '0' + i.toString() : i.toString(),
  //             DesignLabelID:
  //               'Label05' + (i < 10 ? '0' + i.toString() : i.toString()),
  //             FieldDisplayName: '',
  //             TargetField: '',
  //             FieldType: '',
  //             ImageDataField: '',
  //           });
  //         }
  //       }
  //       this.getSixthRowDataArray.pop();
  //       this.getSixthRowDataArray.pop();
  //       this.getSixthRowDataArray.pop();
  //       this.getSixthRowDataArray.pop();
  //       this.getSixthRowDataArray.pop();
  //       this.getSixthRowDataArray.pop();
  //     //}
  //   }
  //   this.getSixthRowDataArray.sort((a, b) =>
  //     a.DesignLabelID < b.DesignLabelID ? -1 : 1
  //   );
  //   // console.log('SIXTH ROW', this.getSixthRowDataArray);
  //    return this.getSixthRowDataArray;
  // }
  IsDataLoaded() {
    setTimeout(() => {
      if (this.rmwlayout !== null) {
        // this.loader = false;
      }
    }, 500);
  }
  ResetComponent() {
    try {
      // this.data = [];
      this.rmwlayout = [];
      this.workflowApi.RMWLayout.next([]);
    } catch (Ex) {
      console.log('Error occured while reset data in RMW: ', Ex);
    }
  }

  setGrid() {
    return 'repeat(' + (this.gridColumn + 1) + ' , minmax(auto, auto))';
  }

  myStyle(): object {
    return Object(this.layout[0].FieldStyle9);
  }

  addData(element, _rowIndex?) {
    // if ( j === 5){
    //   console.log(element, " : " ,j)
    // }
    if (element.TargetField) {
      if (element.TargetField !== '') {
        if (element.TargetField.includes('#')) {
          const firstvalue = element.TargetField.split('#')[0];
          const secondvalue = element.TargetField.split('#')[1];
          let value1, value2;
          if (firstvalue.includes('as')) {
            value1 = firstvalue.split('as ')[1];
            value2 = secondvalue.split('.')[1];
          } else {
            value1 = firstvalue.split('.')[1];
            value2 = secondvalue.split('.')[1];
          }

          if (!isNaN(this.data[value1])) {
            element.FieldDisplayName = this.cfs.FormatNumbernull(
              this.data[value1]
            );
          } else {
            element.FieldDisplayName = this.data[value1];
          }

          // element.mergeData = this.data[value2] + element.TextAfterData;
          if (!isNaN(this.data[value2])) {
            if (this.data[value2] === '') {
              element.mergeData = this.cfs.FormatNumbernull(this.data[value2]);
            } else {
              element.mergeData =
                this.cfs.FormatNumbernull(this.data[value2]) +
                element.TextAfterData;
            }
          } else {
            element.mergeData = this.data[value2] + element.TextAfterData;
          }
        } else if (element.TargetField.includes('as')) {
          //
          if (element.TargetField.includes('dbo.')) {
            let value = element.TargetField.split('as ')[1].trim();
            element.FieldDisplayName = this.data[value];
          } else {
            element.TargetField = element.TargetField.split(' ')[0];
          }
        } else if (element.TargetField.includes('*')) {
          const removestar = element.TargetField.split('*')[0];
          if (removestar.includes('.')) {
            const value = removestar.split('.')[1];
            if (!isNaN(this.data[value])) {
              if (this.data[value] === '') {
                element.mergeData = this.cfs.FormatNumbernull(this.data[value]);
              } else {
                element.mergeData =
                  this.cfs.FormatNumbernull(this.data[value]) +
                  element.TextAfterData;
              }
            } else {
              element.mergeData = this.data[value] + element.TextAfterData;
            }
          }
        } else if (element.TargetField.includes('.')) {
          const value = element.TargetField.split('.')[1];
          if (this.data[value] === '') {
            element.FieldDisplayName = this.data[value];
          } else {
            element.FieldDisplayName = this.data[value] + element.TextAfterData;
          }
        }

        if (element.TargetField === 'NM.AssetClass') {
          const value = element.TargetField.split('.')[1];

          element.FieldDisplayName = this.data[value] + element.TextAfterData;
        }
        if (element.TargetField.includes('dbo.Docgen_Bonds_TenorLeft')) {
          const value = 'Docgen_Bonds_TenorLeft';
          // if (this.data[value] !== '') {
          element.FieldDisplayName = this.data[value] + element.TextAfterData;
          // } else {
          //   element.FieldDisplayName = '';
          // }
        }
        if (element.TargetField.includes('dbo.Docgen_IPO_Indicator')) {
          const value = 'Docgen_IPO_Indicator';
          // if (this.data[value] !== '') {
          element.FieldDisplayName = this.data[value] + element.TextAfterData;
          // } else {
          //   element.FieldDisplayName = '';
          // }
        }
      }
    }
    return element.FieldDisplayName;
  }

  addImage(element, value) {
    if (this.isProd) {
      this.imgUrl = 'assets/App_Resources/';
    } else {
      this.imgUrl = '../../../../assets/App_Resources/';
    }
    if (element.ImagePath) {
      let path = element.ImagePath.replace(/\\/g, '/');
      path = path.split('../')[1];

      if (value === 'Imagepath') {
        element.image = this.imgUrl + path;
      } else if (value === 'textImage') {
        if (element.ImageDataField) {
          if (element.ImageDataField.includes('.')) {
            const data = element.ImageDataField.split('.')[1];

            if (this.data[data] !== '') {
              element.image =
                this.imgUrl +
                path +
                '/' +
                this.data[data] +
                '.' +
                element.ImageExtension.toLowerCase();
            } else {
              element.FieldDisplayName = '';
              // element.image = this.imgUrl + path + '/Empty.';
              return false;
            }
          }
        }
      }
    }
    return element.image;
  }

  createStyle(style: string, _FieldDisplayName: any = ''): any {
    // 'height: 20px ;font-size: 13px ;color: #000000;vertical-align: top ;padding-left: 10px! important;'
    try {
      // if(FieldDisplayName === "Endowment"){
      // console.log(style);
      // }
      //console.log(style);
      if (style) {
        let newStyle = '';
        style = style
          .replace(/! important/g, '')
          .replace(/!important/g, '')
          .replace(/;/g, ',')
          .replace(/{/g, '')
          .replace(/}/g, '');
        // .replace(/rgb/g, '');
        style.split(',').forEach((s) => {
          if (s.length && s.split(':')[0].trim()) {
            if (s.split(':')[1].trim() === '#000000') {
              newStyle += '"' + s.split(':')[0].trim() + '":"' + '' + '",';
            } else {
              newStyle +=
                '"' +
                s.split(':')[0].trim() +
                '":"' +
                s.split(':')[1].trim() +
                '",';
            }
          }
        });
        newStyle = '{' + newStyle.substr(0, newStyle.length - 1) + '}';
        // console.log(JSON.parse(newStyle));
        return JSON.parse(newStyle);
      } else {
        return style;
      }
    } catch (e) {
      // console.log(e);
    }
  }

  linkClick(link) {
    this.homeapi.RMWlink = link; //Added to clear filters on page navigation

    //console.log(AppConfig.settings.CSP_Show_FundDetails_RatioAndPerformance);
    if (link === 'Order Entry') {
      switch (this.product) {
        case 'AM_Fund_Setup':
          this.cfs.setAsset(this.data['Product_Name']);
          // this.router.navigate(['/neworderentry/amfunds']);

          // Asset
          break;
        case 'Bonds':
          this.cfs.setAsset(this.data);
          // this.cfs.setAsset(this.data['ISIN']);
          // this.router.navigate(['/neworderentry/bonds']);

          break;
        case 'Product_Maintenance':
          this.cfs.setAsset(this.data['Product_Name']);
          // this.router.navigate(['/neworderentry/insurance']);

          break;
        case 'Fund_Setup':
          // console.log(item); // this.data['NM_Bonds_LTV']
          this.cfs.setAsset(this.data['ISIN']);
          // this.router.navigate(['/neworderentry/funds']);

          break;
        case 'Equity_Setup':
          // console.log(item);
          this.cfs.setAsset(this.data['Product_Name']);
          // this.router.navigate(['/neworderentry/shares']);

          break;
        case 'NiftyParticipation':
          // console.log(item);
          this.cfs.setAsset(this.data['Note_Master_ID']);
          // this.router.navigate(['/neworderentry/shares']);
          break;
        case 'EquityAutocallableNote':
          this.cfs.setAsset(this.data['Note_Master_ID']);
          break;

        case 'FundsBundle':
          this.showbundle = true;
          this.cfs.setAsset(this.data);
          break;
      }
    } else if (link === 'Factsheet') {
      this.showRecommendations = false;

      if (this.showFactsheet === false) {
        this.showFactsheet = true;
        // console.log(item);
        this.workflowApi.ProductAttachmentList(this.data['Note_Master_ID']);
      } else {
        this.showFactsheet = false;
      }
    } else if (link === 'Recommendations') {
      this.showFactsheet = false;
      this.showRecommendations = !this.showRecommendations;
      this.recommendedProductsList = [];
      this.GetBondsRecommendation(
        this.data['Note_Master_ID'],
        sessionStorage.getItem('Username')
      );
    } else if (link === 'Fund Details') {
      let detailsFlag: boolean;
      detailsFlag = AppConfig.settings.CSP_Show_FundDetails_RatioAndPerformance;
      if (detailsFlag) {
        this.showNewFundDetails = true;
        this.cfs.setAsset(this.data['ISIN']);
        this.router.navigate(['/newFundDetails']);
      } else {
        this.showFundDetails = true;
        this.router.navigate(['/fundDetails']);
        this.cfs.setAsset(this.data['ISIN']);
        // this.router.navigate(['/fundDetails']);
      }
    }
    // else if (link === 'New Fund Details') {
    //   this.showNewFundDetails =true;
    //   this.cfs.setAsset(this.data['Asset']);
    // }
    else if (link === 'Bond Details') {
      this.showBondDetails = true;
      this.cfs.setAsset(this.data['Note_Master_ID']);
      this.cfs.setRMWstate(this.stateArr);
    } else if (link === 'SIP Order Entry') {
      //--Added by AlolikaG on 31st Jan 2022. Assigned by ParikshitK --START-->
      switch (
        this.product //--Added by AlolikaG on 17-02-2022. Assigned by ParikshitK --START-->
      ) {
        case 'Fund_Setup':
          this.showSIP = true;
          this.cfs.setSIPFund([
            { ISIN: this.data['ISIN'], Ccy: this.data['Currency'] },
          ]);
          this.cfs.setRMWstate(this.stateArr);
          break;

        case 'FundsBundle':
          this.showSIP = true;
          this.cfs.setAsset(this.data);
          this.cfs.setRMWstate(this.stateArr);
          break;

        default:
          break;
      }
    }
  }
  GetBondsRecommendation(NMID, loginID) {
    this.recommendatioMsg = 'Loading Recommendation...';
    this.workflowApi.GetBondsRecommendation(NMID, loginID).subscribe(
      (res) => {
        // console.log(res);
        this.recommendedProductsList = res.GetBondsRecommendationResult;
      },
      (_err) => {
        // console.log(err);
        this.recommendedProductsList = [];
        this.recommendatioMsg = 'No Recommendation Found.';
      }
    );
  }

  showFile(DGTID, NoteMasterID) {
    this.Link =
      'http://' +
      AppConfig.settings.CSP_FXPricingURL +
      '/FinIQService/RMWorkstation_JSON.svc/Get_Uploaded_Documents_API/' +
      NoteMasterID +
      '/' +
      DGTID;
    // alert(this.Link);
    window.open(this.Link);
  }

  setControlledSwiper(swiper) {
    this.controlledSwiper = swiper;
  }

  imageClick(d: any) {
    if (d.TargetField === 'RMW_Launch_Public_Private_List') {
      this.showFolder = !this.showFolder;
      this.message = '';
    }
  }

  saveFolder() {
    let folder = '';
    if (this.folderName === '') {
      switch (this.listType) {
        case 'All':
          folder = this.all;
          break;
        case 'Private':
          folder = this.private;
          break;
        case 'Public':
          folder = this.public;
          break;
        default:
          folder = this.folderName;
      }
    } else {
      folder = this.folderName;
    }
    this.workflowApi
      .Save_Folder(
        folder,
        this.data['Note_Master_ID'],
        this.homeapi.CustomerId,
        this.Auth.EntityID,
        this.Auth.UserName,
        this.listType
      )
      .subscribe((res) => {
        if (res.length !== 0) {
          if (res.Remark === 'Success') {
            this.message = 'List saved successfully.';
          } else {
            this.message = res.Remark;
          }
        }
      });
  }

  likeUnlikeProduct() {
    this.like = !this.like;
    if (this.like === true) {
      this.workflowApi
        .likeProduct(
          this.data['Note_Master_ID'],
          sessionStorage.getItem('Username')
        )
        .subscribe((res) => {
          if (res.length !== 0) {
            // console.log(res);
          }
        });
    } else {
      this.workflowApi
        .unlikeProduct(
          this.data['Note_Master_ID'],
          sessionStorage.getItem('Username')
        )
        .subscribe((res) => {
          if (res.length !== 0) {
            console.log(res);
          }
        });
    }
  }

  clickActionLink(link, _i) {
    let asset1 = [];
    let asset2 = [];
    let asset3 = [];
    let asset4 = [];
    let asset5 = [];
    try {
      console.log(
        'NMID',
        this.data['Note_Master_ID'],
        this.data['Template_ID'],
        this.data
      );
      console.log('link', link);

      switch (link.toUpperCase()) {
        case 'BACKTEST':
          // this.backTestNoteMasterId = this.data['Note_Master_ID'];
          // this.backTestTemplateID = this.data['Template_ID'];
          this.backTestNoteMasterId = '432788';
          this.backTestTemplateID = '40872';
          this.backtestNMID = this.backTestNoteMasterId;
          this.TestCases = '25';
          this.StartDate = '';
          this.popUpSelected = 'BACKTEST';
          this.showPopUp = true;
          this.entityId = '4';
          this.AssetClass = 'EQ';
          // this.lcmapi.GetNumberOfTestCasesAndStartDate(
          //     this.backTestNoteMasterId,
          //     this.backTestTemplateID,
          //     this.TestCases,
          //     this.StartDate
          //   )
          //   .subscribe((data) => {
          //     console.log(data);
          //   });
          this.lcmapi
            .GetNumberOfTestCasesAndStartDate(
              this.backTestNoteMasterId,
              this.TestCases,
              this.StartDate,
              this.backTestTemplateID
            )
            .subscribe((data) => {
              this.StartDate = new Date(
                data.GetNumberOfTestCasesAndStartDateResult
              );
              // console.log('StartDate1', data, this.StartDate);

              // this.StartDate = this.datepipe.transform(this.StartDate, 'yyyy-MM-dd');
              this.StartDate = this.datepipe.transform(
                this.StartDate,
                'dd-MMM-yyyy'
              );

              if (this.StartDate !== '') {
                this.lcmapi
                  .WhatIfMultipleBackTest(
                    this.backTestNoteMasterId,
                    this.backTestTemplateID,
                    this.TestCases,
                    this.StartDate,
                    this.entityId,
                    this.AssetClass
                  )
                  .subscribe((data) => {
                    this.tradingHistoryArr =
                      data.WhatIfMultipleBackTestResult.dC_IndexHistory_WhatIf_GMC_BackTests;
                    this.whatIfBackTestArr =
                      data.WhatIfMultipleBackTestResult.dC_UDT_WhatIf_GMC_BackTests;
                    console.log(
                      'backtest',
                      this.tradingHistoryArr,
                      this.whatIfBackTestArr
                    );
                    this.plotTestCaseNoOfDaysCalc();
                    this.calcTWRR();
                    this.tradingHistoryArr.map((item) => {
                      asset1.push(item.Asset1);
                      asset2.push(item.Asset2);
                      asset3.push(item.Asset3);
                    });
                    this.chartData = [
                      {
                        name: 'Asset1',
                        data: asset1,
                      },
                      {
                        name: 'Asset2',
                        data: asset2,
                      },
                      {
                        name: 'Asset3',
                        data: asset3,
                      },
                    ];
                  });
              }
            });
          break;
        case 'LIFECYCLE ANALYTICS':
          this.popUpSelected = 'LIFECYCLE ANALYTICS';
          this.showPopUp = true;
          this.displayGreeks();
          break;
        case 'WHAT IF':
          console.log(this.data);
          this.NoteMasterID = this.data['Note_Master_ID'];
          this.ProductName = this.data['Product_Name'];
          console.log(this.ProductName);
          this.router.navigate([
            'whatif/',
            { nmid: this.NoteMasterID, prodname: this.ProductName },
          ]);
          // Added by Arsh P on 5-Aug-2022
          break;

        case 'REF. DOCS':
          if (this.showFactsheet === false) {
            this.showFactsheet = true;
            this.docListFlag = true;

            // console.log(item);
            this.workflowApi.ProductAttachmentList(this.data['Note_Master_ID']);
          } else {
            this.showFactsheet = false;
          }

          // if (this.homeapi.showFactsheet[i] === false) {
          //   // this.showFactsheet = true;
          //   this.showFactsheet[this.homeapi.previousIndex] = false;
          //   // console.log(item);
          //   this.docListFlag = true;
          //   this.workflowApi.ProductAttachmentList(this.data['Note_Master_ID']);
          //   this.homeapi.showFactsheet[i] = true;
          //   this.homeapi.previousIndex = i;

          // } else {
          //   this.homeapi.showFactsheet[i] = false;
          // }
          // console.log("showFactsheet", this.homeapi.showFactsheet);
          // console.log("this.showFactsheet[this.index]", this.homeapi.showFactsheet[this.index], this.index);
          break;

        case 'GEN. TERMSHEET':
          this.workflowApi
            .generateDoc(
              this.Auth.EntityID,
              this.Auth.EntityCode,
              this.Auth.EntityName,
              this.Auth.UserName,
              this.data['Note_Master_ID'],
              'PRODUCT',
              'PRODUCT_TERMSHEET'
            )

            .subscribe((response) => {
              var fileURL: string = '';
              // Start Added by Ketan S on 14-Apr-22 regarding JIRA ANAPPDEVIN-159
              if (response[0].GeneratedFilePath.includes('\\\\')) {
                var fileURL =
                  AppConfig.settings.CSP_DocGen_Virtual_Path +
                  '/' +
                  response[0].GeneratedFilePath.split('\\\\')[1];
              }
              // END Added by Ketan S on 14-Apr-22 regarding JIRA ANAPPDEVIN-159
              else {
                var fileURL =
                  AppConfig.settings.CSP_DocGen_Virtual_Path +
                  '/' +
                  response[0].GeneratedFilePath.split('\\')[2];
              }

              window.open(fileURL);
            });
          break;

        case 'LIFECYCLE PDF':
          this.workflowApi
            .generateDoc(
              this.Auth.EntityID,
              this.Auth.EntityCode,
              this.Auth.EntityName,
              this.Auth.UserName,
              this.data['Note_Master_ID'],
              'PRODUCT',
              'LIFECYCLE_STATUS'
            )

            .subscribe((response) => {
              var fileURL: string = '';
              // Start Added by Ketan S on 14-Apr-22 regarding JIRA ANAPPDEVIN-159
              if (response[0].GeneratedFilePath.includes('\\\\')) {
                var fileURL =
                  AppConfig.settings.CSP_DocGen_Virtual_Path +
                  '/' +
                  response[0].GeneratedFilePath.split('\\\\')[1];
              }
              // END Added by Ketan S on 14-Apr-22 regarding JIRA ANAPPDEVIN-159
              else {
                var fileURL =
                  AppConfig.settings.CSP_DocGen_Virtual_Path +
                  '/' +
                  response[0].GeneratedFilePath.split('\\')[2];
              }

              window.open(fileURL);
            });
          break;

        // Added by AnjaliT on 09/12/2022 told by PranavD --START
        case 'VIEW ORDERS':
          this.showPopUp = true;
          this.popUpSelected = 'VIEW ORDERS';
          break;
      // Added by AnjaliT on 09/12/2022 told by PranavD --END

        default:
          break;
      }
    } catch (error) {}
  }

  calcTWRR() {
    try {
      let power;
      let twr;
      let twrr;

      let count = {};

      for (let i = 0; i < this.whatIfBackTestArr.length; i++) {
        power = 252 / this.whatIfBackTestArr[i].AutocallDay;
        twr = Math.pow(1 + this.whatIfBackTestArr[i].ROIPercentage, power);
        twrr = ((twr - 1) * 100).toFixed(4);
        // console.log('calculation', power, twr, twrr);
        if (count[twrr]) count[twrr] += 1;
        else count[twrr] = 1;
        this.TWRRArr.push(twrr);
      }
      this.twrrChartY = [
        {
          name: 'Testcases',
          data: Object.values(count),
        },
      ];

      this.twrrChartX = Object.keys(count);
      // console.log('twrr',this.TWRRArr, count);
    } catch (error) {}
  }

  plotTestCaseNoOfDaysCalc() {
    try {
      const occurenceArr = [];
      this.whatIfBackTestArr.forEach((res) => {
        occurenceArr.push(res.AutocallDay);
      });
      // console.log('occurenceArr', occurenceArr);
      const count = {};
      for (const element of occurenceArr) {
        if (count[element]) {
          count[element] += 1;
        } else {
          count[element] = 1;
        }
      }
      this.barChartY = [
        {
          name: 'Testcases',
          data: Object.values(count),
        },
      ];
      this.barChartX = Object.keys(count);
      // console.log('count', count);
      // this.countArrOfTestcaseNoDays = [];
      this.countArrOfTestcaseNoDays.push(count);
      // console.log('count ', this.countArrOfTestcaseNoDays);
    } catch (error) {}
  }

  getStartDateNoofTestCase(TestCases) {
    try {
      this.StartDate = '';
      this.lcmapi
        .GetNumberOfTestCasesAndStartDate(
          this.backTestNoteMasterId,
          TestCases,
          '',
          this.backTestTemplateID
        )
        .subscribe((data) => {
          this.StartDate = data.GetNumberOfTestCasesAndStartDateResult;
        });

      // console.log('testcase change', this.StartDate);
    } catch (error) {}
  }

  convertdate(selecteddate) {
    //console.log(selecteddate);
    selecteddate = selecteddate.replace("  ", " ");
    let date = selecteddate.split(' ');
    //let date = selecteddate.trim();
    let final = date[0] + ' ' + date[1] + ' ' + date[2];
    return final;
  }
  selectDate(date) {
    try {
      return this.datepipe.transform(date, 'dd-MMM-yyyy');
    } catch (error) {}
  }
  // displayLCM(popupName: LCM) {
  //   console.log(popupName);
  //   switch (popupName) {
  //     case popupName.Gre:
  //       break;

  //     default:
  //       break;
  //   }
  // }
  displayGreeks() {
    this.Format = 'Greeks';
    this.showGreeks = true;
    this.showStressTest = false;
    this.showBacktest = false;
    this.showUnderlyingPrices = false;
  }
  displayStressTest() {
    this.Format = 'Stress';
    this.showStressTest = true;
    this.showGreeks = false;
    this.showBacktest = false;
    this.showUnderlyingPrices = false;
  }
  displayBacktest() {
    this.Format = 'Backtest';
    this.showStressTest = false;
    this.showGreeks = false;
    this.showBacktest = true;
    this.showUnderlyingPrices = false;
  }
  underlyingPrices() {
    this.Format = 'UnderlyingPrices';
    this.showStressTest = false;
    this.showGreeks = false;
    this.showBacktest = false;
    this.showUnderlyingPrices = true;
  }
  SelectFormat(format) {
    this.Format = format;
  }
  async getActiveTab(tab: any) {
    if (tab === 0) {
      this.displayGreeks();
    } else if (tab === 1) {
      this.displayBacktest();
    } else if (tab === 2) {
      this.displayStressTest();
    }
  }
}
