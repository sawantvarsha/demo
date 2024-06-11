import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { WorkflowApiService } from '../../services/workflow-api.service';
import { ExcelService } from '../../services/excel.service';
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
import { HomeApiService } from 'src/app/services/home-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { Location } from '@angular/common';
import { DownloadService } from 'src/app/services/download.service';
import { HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
//Changed by MohanP | 2Feb22
import { CommonApiService } from 'src/app/services/common-api.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  colors: string[];
  legend: ApexLegend;
  states: ApexStates;
  responsive: ApexResponsive[];
  noData: ApexNoData;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-margin',
  templateUrl: './margin.component.html',
  styleUrls: ['./margin.component.scss'],
})
export class MarginComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() CustomerDetails;
  @Input() Mode;
  custDetails: {
    CustomerName: string;
    CustomerID: any;
    CustomerDisplayName: any;
  };
  custList: any;
  CustName: any;
  custID: any;
  ltpgno: any;
  assetstpgno: any;
  approvedLimit: any;
  availableLimit: any;
  LoginID: any;
  liabilitiesArr: any[];
  assetsArr: any[];
  assetsTableKeyVal: any;
  liabilitiesTableKeyVal: any;

  limitUtilisation: any;
  limit: any;
  limitUsed: any;
  marginRatio: any;
  marginStatus: any;
  totalCollateral: any;
  totalLoanAmount: any;
  availableDrawdown: any;
  totalShortfall: any;
  shortfallSince: any;

  totalLoanableAssets: number;
  totalLoanLiabilities: number;
  toggleFlag: string;

  public chartOptions: Partial<ChartOptions>;
  public limitChartOptions: Partial<ChartOptions>;
  public marginChartOptions: Partial<ChartOptions>;
  public collateralChartOptions: Partial<ChartOptions>;
  public exposureChartOptions: Partial<ChartOptions>;
  utilizedLimit: any;
  statusLimit: any;
  availableForDrawdown: any;
  collateralStatus: any;
  totalExposure: any;
  utilizedLimitPercentage: number;
  collateralChartData: any;
  collateralDetailsData: any;
  assetsColorsArray: string[];
  liabilitiesColorsArray: string[];
  exposureDetailsData: any;
  exposureColorsArray: string[];
  collateralColorsArray: string[];
  isRevaluating: boolean;
  revalMsg: string;
  baseCCY: string;
  isDownloading: boolean;
  message: string;
  PdfURL: string;
  interfaceUrl: string = environment.interfaceURL;
  constructor(
    public afs: WorkflowApiService,
    private elem: ElementRef,
    private excelService: ExcelService,
    public homeApi: HomeApiService,
    public authApi: AuthService,
    public custApi: CustomerApiService,
    public location: Location,
    public ref: ChangeDetectorRef,
    public downloadApi: DownloadService,
    public commonApi: CommonApiService
  ) {
    this.elem = elem;

    this.ltpgno = 1;
    this.assetstpgno = 1;
    this.approvedLimit = '';
    this.availableLimit = '';
    this.liabilitiesArr = [];
    this.assetsArr = [];
    this.assetsTableKeyVal = [];
    this.liabilitiesTableKeyVal = [];
    this.limitUtilisation = '';
    this.limit = '';
    this.limitUsed = '';
    this.marginRatio = '';
    this.marginStatus = '';
    this.totalCollateral = '';
    this.totalLoanAmount = '';
    this.availableDrawdown = '';
    this.totalShortfall = '';
    this.shortfallSince = '';
    this.totalLoanableAssets = 0;
    this.totalLoanLiabilities = 0;
    this.collateralChartData = [];
    this.collateralDetailsData = [];
    this.collateralColorsArray = [
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
    // [
    //   '#1D3E53',
    //   '#254B62',
    //   '#476D7C',
    //   '#77ABB7',
    // ]; // ['#00a0FF', '#0079c1', '#1185ca', '#3da5e2', '#0679bd', '#0679bdcf'];
    this.exposureColorsArray = [
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
    // [
    //   '#1D3E53',
    //   '#254B62',
    //   '#476D7C',
    //   '#77ABB7',
    // ]; // ['#6082B6', '#A7C7E7', '#ADD8E6', '#B6D0E2', '#4169E1', '#4682B4'];
    this.liabilitiesColorsArray = [
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
    // [
    //   '#1D3E53',
    //   '#254B62',
    //   '#476D7C',
    //   '#77ABB7',
    // ]; // ['#00FFFF', '#00CED1', '#1E90FF', '#40E0D0', '#00FFFF', '#1E90FF', '#0679bd', '#3da5e2'];
    this.assetsColorsArray = [
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
    // [
    //   '#1D3E53',
    //   '#254B62',
    //   '#476D7C',
    //   '#77ABB7',
    // ]; // ['#00FFFF', '#00CED1', '#1E90FF', '#40E0D0', '#00FFFF', '#1E90FF', '#0679bd', '#3da5e2'];
    this.chartOptions = {};
  }
  ngOnDestroy(): void {
    this.commonApi.HideSidebar(false);
  }

  ngAfterViewChecked() {
    // console.log("out")
    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByTagName('rect'),
      (rect: HTMLElement) => {
        if (rect.getAttribute('fill') === '#ffffff') {
          // console.log("hello")
          rect.setAttribute('width', '490');
          rect.setAttribute('height', '30');
          rect.setAttribute('y', '7');
          rect.setAttribute('fill', '#ffffff00');
          rect.setAttribute('stroke', '#ffffff00');
          rect.setAttribute('stroke-width', '0');
        }
      }
    );

    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByClassName('margin-chart'),
      (_elem) => {
        // if (elem.getAttribute('fill') === 'none') {
        try {
          if (
            this.elem.nativeElement.getElementsByClassName(
              'apexcharts-radialbar-slice-0'
            )[1] !== undefined
          ) {
            this.elem.nativeElement
              .getElementsByClassName('apexcharts-radialbar-slice-0')[1]
              .setAttribute('stroke-width', '5');
            document
              .getElementsByClassName('apexcharts-track')[1]
              .querySelector('#apexcharts-radialbarTrack-0')
              .setAttribute('stroke-width', '5');
          }
        } catch (error) {
          console.log(error);
        }

        // }
      }
    );
  }

  ngOnInit(): void {
    this.commonApi.HideSidebar(true);
    this.chartOptions = {
      chart: {
        height: 250,
        type: 'radialBar',
      },
      series: [20, 100],
      plotOptions: {
        radialBar: {
          dataLabels: {
            total: {
              show: false,
              label: 'TOTAL',
            },
          },
          hollow: {
            margin: 0,
            size: '50%',
            background: 'transparent',
            position: 'front',
            dropShadow: {
              enabled: false,
              top: 0,
              left: 0,
              blur: 3,
              opacity: 0.5,
            },
          },
          track: {
            show: true,
            strokeWidth: '50%',
            margin: 0,
          },
        },
      },
      labels: ['', ''],
    };

    this.limitChartOptions = {
      chart: {
        height: 250,
        type: 'radialBar',
      },
      series: [75],
      fill: {
        opacity: 5,
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            show: false,
            total: {
              show: false,
              label: 'TOTAL',
            },
          },
          hollow: {
            margin: 0,
            size: '55%',
            background: 'transparent',
            position: 'front',
          },
          track: {
            show: true,
            strokeWidth: '100%',
            margin: 0,
            // background: '#eeeeee'
            background: '#313131',
          },
        },
      },
      labels: ['', ''],
      colors: [''],
    };

    this.marginChartOptions = {
      chart: {
        height: 250,
        type: 'radialBar',
      },
      // fill: {
      //   type: 'color',
      //   colors: ['#66DA26', '#d43b37', '#546E7A', '#E91E63', '#FF9800']
      // },
      series: [20, 100],
      plotOptions: {
        radialBar: {
          dataLabels: {
            show: false,
            total: {
              show: false,
            },
          },
          hollow: {
            margin: 0,
            size: '55%',
            background: 'transparent',
            position: 'front',
          },
          track: {
            show: true,
            strokeWidth: '100%',
            margin: 0,
            // background: '#eeeeee',
            background: '#313131',
          },
        },
      },
      labels: ['', ''],
      colors: [''],
    };

    this.collateralChartOptions = {
      series: [0],
      colors: [
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
      ],
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
        width: '100%',
        height: 180,
        type: 'donut',
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'square',
        colors: ['#232323'],
        width: 3,
        dashArray: 0,
      },
      plotOptions: {
        pie: {
          offsetX: 10,
          offsetY: 30,
          expandOnClick: true,
          donut: {
            size: '70%',
            background: 'transparent',
            labels: {
              show: false,
              total: {
                showAlways: false,
                show: false,
              },
            },
          },
        },
      },
      labels: [],
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'color',
        opacity: 1,
      },
      states: {
        hover: {
          filter: {
            type: 'none',
          },
        },
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 250,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      tooltip: {
        enabled: true,
      },
    };

    this.exposureChartOptions = {
      series: [0],
      colors: [
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
      ],
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
        width: '100%',
        height: 180,
        type: 'donut',
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'square',
        colors: ['#232323'],
        width: 3,
        dashArray: 0,
      },
      plotOptions: {
        pie: {
          offsetX: 10,
          offsetY: 30,
          donut: {
            size: '70%',
            background: 'transparent',
            labels: {
              show: false,
              total: {
                showAlways: false,
                show: false,
              },
            },
          },
        },
      },
      labels: [],
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'color',
        opacity: 1,
      },
      states: {
        hover: {
          filter: {
            type: 'none',
          },
        },
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 250,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      tooltip: {
        enabled: true,
      },
    };

    if (sessionStorage.getItem('UserType') === 'RM') {
      console.log(this.CustomerDetails);
      this.Mode = 'RM';
      this.custDetails = {
        CustomerID: this.CustomerDetails.custId,
        CustomerName: this.CustomerDetails.custName,
        CustomerDisplayName:
          this.CustomerDetails.custName + '|' + this.CustomerDetails.custId,
      };
      this.authApi.UserName = this.CustomerDetails.userName;
      this.authApi.UserType = 'RM';
    } else {
      this.Mode = 'Client';
      this.custDetails = {
        CustomerID: this.homeApi.CustomerId,
        CustomerName: this.authApi.UserName,
        CustomerDisplayName: this.homeApi.CustomerDisplayName,
      };
    }

    this.custApi.getBankBaseCCYOBS.subscribe(() => {
      this.assetsTableKeyVal = [
        {
          colName: '',
          keyName: 'CollateralType',
          isAsc: false,
          isNaN: true,
          justify: 'left',
          isFilter: false,
        },
        {
          colName: 'Trade Ccy',
          keyName: 'Ccy',
          isAsc: false,
          isNaN: true,
          justify: 'center',
          isFilter: false,
        },
        {
          colName: 'Quantity',
          keyName: 'AmountUnit',
          isAsc: false,
          isNaN: false,
          justify: 'flex-end',
          isFilter: true,
        },
        {
          colName: 'Price',
          keyName: 'MarketPrice',
          isAsc: false,
          isNaN: false,
          justify: 'flex-end',
          isFilter: true,
        },

        {
          colName: 'Market Value<br>(Ccy)',
          keyName: 'MarketValueHKD',
          isAsc: false,
          isNaN: false,
          justify: 'flex-end',
          isFilter: true,
        },
        {
          colName: 'LTV<br>(%)',
          keyName: 'LendingRatio',
          isAsc: false,
          isNaN: true,
          justify: 'flex-end',
          isFilter: false,
        },
        {
          colName: 'Loanable<br>(Ccy)',
          keyName: 'ValueafterConcRulesHKD',
          isAsc: false,
          isNaN: false,
          justify: 'flex-end',
          isFilter: true,
        },
        {
          colName: 'Loanable<br>(' + this.custApi.bankBaseCCY + ')',
          keyName: 'ValueafterConcRulesHKD',
          isAsc: false,
          isNaN: false,
          justify: 'flex-end',
          isFilter: true,
        },
      ];

      this.liabilitiesTableKeyVal = [
        {
          colName: '',
          keyName: 'ExposureDescription',
          isAsc: false,
          isNaN: true,
          justify: 'left',
          isFilter: false,
        },
        {
          colName: 'Trade Ccy',
          keyName: 'Ccy',
          isAsc: false,
          isNaN: true,
          justify: 'center',
          isFilter: false,
        },
        {
          colName: 'Exposure (Ccy)',
          keyName: 'ExposureOrigCcy',
          isAsc: false,
          isNaN: false,
          justify: 'flex-end',
          isFilter: true,
        },
        {
          colName: 'Exposure <br>(' + this.custApi.bankBaseCCY + ')',
          keyName: 'ExposureInBaseCcy',
          isAsc: false,
          isNaN: false,
          justify: 'flex-end',
          isFilter: true,
        },
      ];
      this.renderAssetsandLiabilities();
    });
    this.renderAssetsandLiabilities();
  }
  exportToExcel(section) {
    const assetsExcelData = [] as any;
    const liabilitiesExcelData = [] as any;
    switch (section) {
      case 'Assets':
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.assetsArr.length; i++) {
          assetsExcelData.push({
            'Asset Type': this.assetsArr[i].CollateralType,
            'Trade Ccy': this.assetsArr[i].Ccy, //Added By Ketan S on 12-Apr-2022 asked by Shubham C in NextgenApp Gateway issue sheet issue no 57
            'Asset Code': this.assetsArr[i].StockCode,
            'Product Name': this.assetsArr[i].CollateralName,
            'Units / Nominal': this.assetsArr[i].MarketValueHKD,
            'Mkt. Price': this.assetsArr[i].MarketPrice,
            'Mkt. Value': this.assetsArr[i].MarketValue, //Added By Ketan S on 12-Apr-2022 asked by Shubham C in NextgenApp Gateway issue sheet issue no 57
            'LTV (%)': this.assetsArr[i].LendingRatio, //Added By Ketan S on 12-Apr-2022 asked by Shubham C in NextgenApp Gateway issue sheet issue no 57
            'Loanable': this.assetsArr[i].ValueafterLendingRatioHKD,
            'Loanable (USD)': this.assetsArr[i].ValueafterLendingRatioHKD * this.assetsArr[i].FXRate,
          });
        }
        this.excelService.exportAsExcelFile(assetsExcelData, '_Assets_');
        break;
      case 'Liabilities':
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.liabilitiesArr.length; i++) {
          liabilitiesExcelData.push({
            'Exp Type': this.liabilitiesArr[i].ExposureDescription,
            'Total Exposure': this.liabilitiesArr[i].NettedAmount,
            'Exposure (USD)': this.liabilitiesArr[i].ExposureOrigCcy,
            'Exchange rate':this.liabilitiesArr[i].FXRate, //Added By Ketan S on 12-Apr-2022 asked by Shubham C in NextgenApp Gateway issue sheet issue no 56
            'Trade Ccy':this.liabilitiesArr[i].Ccy //Added By Ketan S on 12-Apr-2022 asked by Shubham C in NextgenApp Gateway issue sheet issue no 56
          });
        }
        this.excelService.exportAsExcelFile(
          liabilitiesExcelData,
          '_Liabilities_'
        );
        break;
      default:
        break;
    }
  }

  filterBy(key: any, arr: any[], headers: any[]) {
    console.log(headers.filter((e: any) => e.keyName === key)[0]);
    headers.forEach((e: any) => {
      if (e.keyName === key) {
        if (e.isNaN) {
          if (e.isAsc) {
            arr.sort((a, b) => {
              if (a[key] > b[key]) {
                return 1;
              }
              if (a[key] < b[key]) {
                return -1;
              }
              return 0;
            });
          } else {
            arr.sort((a, b) => {
              if (a[key] > b[key]) {
                return -1;
              }
              if (a[key] < b[key]) {
                return 1;
              }
              return 0;
            });
          }
          e.isAsc = !e.isAsc;
        } else {
          if (e.isAsc) {
            arr.sort((a, b) => {
              return parseFloat(a[key]) - parseFloat(b[key]);
            });
          } else {
            arr.sort((a, b) => {
              return parseFloat(b[key]) - parseFloat(a[key]);
            });
          }
          e.isAsc = !e.isAsc;
        }
      } else {
        e.isAsc = false;
      }
    });

    // headers.filter(e => e.keyName === key);
  }
  renderAssetsandLiabilities() {
    this.afs
      .GetCustomerGroupData(this.custDetails.CustomerID)
      .subscribe((res) => {
        console.log(res);
        const GroupID =
          res.ArrayOfCustomerGroupData.CustomerGroupData[0].Group_ID[0];
        // const GroupID = res.GetCustomerGroupDataResult[0].Group_ID;

        this.afs
          .GetLimitUtilizationData(
            GroupID,
            this.custDetails.CustomerName,
            this.custDetails.CustomerID,
            this.custApi.bankBaseCCY
          )
          .subscribe((limitRes) => {
            console.log('GetLimitUtilizationData', limitRes);
            this.approvedLimit =
              limitRes.DB_Get_GlobalMarginReportData_LCYEResult[0].Approved_Limit;
            this.availableLimit =
              limitRes.DB_Get_GlobalMarginReportData_LCYEResult[0].Available_Limit;
            this.utilizedLimit =
              limitRes.DB_Get_GlobalMarginReportData_LCYEResult[0].Limit_Used;

            if (parseInt(this.approvedLimit, 10) === 0) {
              this.utilizedLimitPercentage = 0;
              this.limitChartOptions.series = [this.utilizedLimitPercentage];
            } else {
              this.utilizedLimitPercentage = parseInt(
                ((this.utilizedLimit / this.approvedLimit) * 100).toFixed(2),
                10
              );
              this.limitChartOptions.series = [this.utilizedLimitPercentage];
              console.log('Utilized %', this.utilizedLimitPercentage);
            }
          });
        this.afs
          .GetLoanableAmountData(
            GroupID,
            this.custDetails.CustomerName,
            this.custDetails.CustomerID,
            this.custApi.bankBaseCCY
          )
          .subscribe((collRes) => {
            console.log('GetLimitUtilizationData', collRes);
            // this.totalLoanAmount =
            //   collRes.DB_Get_GlobalMarginReportData_LCYEResult[0].Collateral;
            this.totalCollateral =
              collRes.DB_Get_GlobalMarginReportData_LCYEResult[0].Collateral;
            this.collateralStatus =
              collRes.DB_Get_GlobalMarginReportData_LCYEResult[0].CollateralStatus;
          });
        this.afs
          .GetCollateralChartData(
            GroupID,
            this.custDetails.CustomerName,
            this.custDetails.CustomerID,
            this.custApi.bankBaseCCY
          )
          .subscribe((collChartRes) => {
            this.collateralDetailsData =
              collChartRes.DB_Get_GlobalMarginReportData_LCYEResult.map(
                (d: any, index) => {
                  return {
                    CollateralType: d.CollateralType,
                    Amount: d.Amount,
                    color: this.collateralColorsArray[index],
                  };
                }
              );
            this.collateralChartOptions.labels = this.collateralDetailsData.map(
              (d: any) => d.CollateralType
            );
            this.collateralChartOptions.series = this.collateralDetailsData.map(
              (d: any) => parseFloat(d.Amount || 0)
            );
            this.collateralChartOptions.tooltip = {
              enabled: true,
              y: {
                formatter: (val) => {
                  return this.commonApi.formatNumber(val);
                },
                title: {
                  formatter: function (_seriesName) {
                    return _seriesName;
                  },
                },
              },
            };
            this.collateralChartOptions.colors =
              this.collateralDetailsData.forEach((d: any) => {
                switch (d.CollateralType.toUpperCase()) {
                  case 'EQUITY':
                  case 'EQUITIES':
                    d.color = this.assetsColorsArray[0];
                    break;
                  case 'MUTUAL FUND':
                  case 'MUTUAL FUNDS':
                  case 'FUNDS TRADE SETUP':
                  case 'FUNDS':
                    d.color = this.assetsColorsArray[1];
                    break;
                  case 'BONDS':
                    d.color = this.assetsColorsArray[2];
                    break;
                  case 'DCI':
                    d.color = this.assetsColorsArray[3];
                    break;
                  case 'FCN':
                    d.color = this.assetsColorsArray[4];
                    break;
                  case 'STRUCTURED NOTES':
                    d.color = this.assetsColorsArray[5];
                    break;
                  case 'PHOENIX':
                    d.color = this.assetsColorsArray[6];
                    break;
                  case 'PROPERTY':
                  case 'PROPERTIES':
                    d.color = this.assetsColorsArray[7];
                    break;
                  case 'NOTES':
                    d.color = this.assetsColorsArray[8];
                    break;
                  case 'FIXED DEPOSIT':
                    d.color = this.assetsColorsArray[9];
                    break;
                  case 'INSURANCE INVESTMENT':
                    d.color = this.assetsColorsArray[10];
                    break;
                  default:
                    break;
                }
              });
            this.collateralChartOptions.colors = this.collateralDetailsData.map(
              (e) => e.color
            );

            this.totalLoanAmount =
              this.collateralDetailsData.length !== 0
                ? this.collateralDetailsData
                    .map((asset: any) => parseFloat(asset.Amount))
                    .reduce((sum, as) => sum + as)
                : 0;
            this.totalLoanableAssets =
              this.collateralDetailsData.length !== 0
                ? this.collateralDetailsData
                    .map((asset: any) => parseFloat(asset.Amount))
                    .reduce((sum, as) => sum + as)
                : 0;

            console.log(
              'collateral Chart Data',
              this.collateralDetailsData,
              'Series',
              this.collateralChartOptions
            );
          });
        this.afs
          .GetExposureChartData(
            GroupID,
            this.custDetails.CustomerName,
            this.custDetails.CustomerID,
            this.custApi.bankBaseCCY
          )
          .subscribe((collChartRes) => {
            this.exposureDetailsData =
              collChartRes.DB_Get_GlobalMarginReportData_LCYEResult.map(
                (d: any, index) => {
                  return {
                    exposureType: d.Facility,
                    Amount: d.Amount,
                    color: this.exposureColorsArray[index],
                  };
                }
              );
            this.exposureChartOptions.labels = this.exposureDetailsData.map(
              (d: any) => d.exposureType
            );
            this.exposureChartOptions.series = this.exposureDetailsData.map(
              (d: any) => parseFloat(d.Amount || 0)
            );
            this.exposureChartOptions.tooltip = {
              enabled: true,
              y: {
                formatter: (val) => {
                  return this.commonApi.formatNumber(val);
                },
                title: {
                  formatter: function (_seriesName) {
                    return _seriesName;
                  },
                },
              },
            };
            this.exposureDetailsData.forEach((d: any) => {
              switch (d.exposureType.toUpperCase()) {
                case 'FXC SPOT':
                case 'FXSPT':
                case 'FXSPOT':
                  d.color = this.liabilitiesColorsArray[0];
                  break;
                case 'LETTEROFCREDIT':
                  d.color = this.liabilitiesColorsArray[1];
                  break;
                case 'OVERDRAFTS':
                  d.color = this.liabilitiesColorsArray[2];
                  break;
                case 'TERM_LOAN_R':
                  d.color = this.liabilitiesColorsArray[3];
                  break;
                case 'FXC FORWARD':
                case 'FXFORWARD':
                  d.color = this.liabilitiesColorsArray[4];
                  break;
                case 'CCSWAP':
                  d.color = this.liabilitiesColorsArray[5];
                  break;
                case 'PIVOTTARN':
                  d.color = this.liabilitiesColorsArray[6];
                  break;
                case 'AQDQ':
                case 'FXAQDQ':
                case 'FXACCUM':
                  d.color = this.liabilitiesColorsArray[7];
                  break;
                case 'FXEXOTIC':
                case 'BARRIER':
                  d.color = this.liabilitiesColorsArray[8];
                  break;
                case 'VANILLA OPTION':
                case 'VFXO':
                  d.color = this.liabilitiesColorsArray[9];
                  break;
                case 'TARFBUY':
                  d.color = this.liabilitiesColorsArray[10];
                  break;
                default:
                  break;
              }
            });
            this.exposureChartOptions.colors = this.exposureDetailsData.map(
              (e) => e.color
            );
            console.log(
              'exposure Chart Data',
              this.exposureDetailsData,
              'Series',
              this.exposureChartOptions
            );

            this.totalExposure =
              this.exposureDetailsData.length !== 0
                ? this.exposureDetailsData
                    .map((lib) => parseFloat(lib.Amount))
                    .reduce((sum, lib) => sum + lib)
                : 0;
            this.totalLoanLiabilities =
              this.exposureDetailsData.length !== 0
                ? this.exposureDetailsData
                    .map((lib) => parseFloat(lib.Amount))
                    .reduce((sum, lib) => sum + lib)
                : 0;
          });

        this.afs
          .GetMarginRatio(
            GroupID,
            this.authApi.UserName,
            this.custDetails.CustomerID,
            this.custApi.bankBaseCCY
          )
          .subscribe((marginRes) => {
            console.log('Margin Data', marginRes);

            if (marginRes.DB_Get_GlobalMarginReportData_LCYEResult.length > 0) {
              console.log(
                marginRes.DB_Get_GlobalMarginReportData_LCYEResult[0]
              );
              const marginData =
                marginRes.DB_Get_GlobalMarginReportData_LCYEResult[0];
              this.limitUtilisation = '';
              this.limit = marginData.Approved_Limit;
              this.limitUsed = marginData.Limit_used;
              this.statusLimit = marginData.LimitStatus;
              this.marginStatus = marginData.ShoarfallStatus;
              this.totalCollateral = marginData.Aggregate_Contract_Balance_HKD;
              // this.totalLoanAmount = marginData.Aggregate_IM_HKD;
              this.availableDrawdown = marginData.AvailableForDrawdown;
              this.totalShortfall =
                marginData.Free_Margin_HKD < 0 ? marginData.Free_Margin_HKD : 0;
              this.shortfallSince = marginData.Shortfall_date_Sim;
              // this.totalExposure = marginData.MarginRequired_MM;
              this.marginRatio = parseInt(marginData.Margin, 10);
              if (this.marginRatio > 100) {
                this.marginChartOptions.series = [
                  this.marginRatio - 100,
                  this.marginRatio,
                ];
              } else {
                this.marginChartOptions.series = [0, this.marginRatio];
              }
              switch (this.marginStatus.toUpperCase()) {
                case 'NORMAL':
                  this.marginChartOptions.colors = [
                    '#21C747',
                    '#21C747',
                    '#21C747',
                    '#21C747',
                    '#21C747',
                  ];
                  // this.marginChartOptions.colors = ['#0781dc', '#0781dc', '#0781dc', '#0781dc', '#0781dc'];
                  break;
                case 'LIQUIDATION':
                  this.marginChartOptions.colors = [
                    '#ff6f6f',
                    '#ff6f6f',
                    '#ff6f6f',
                    '#ff6f6f',
                    '#ff6f6f',
                  ];
                  break;
                case 'MARGIN CALL':
                  this.marginChartOptions.colors = [
                    '#FAAD32',
                    '#FAAD32',
                    '#FAAD32',
                    '#FAAD32',
                    '#FAAD32',
                  ];
                  break;

                default:
                  break;
              }
              switch (this.statusLimit.toUpperCase()) {
                case 'NORMAL':
                  this.limitChartOptions.colors = [
                    '#21C747',
                    '#21C747',
                    '#21C747',
                    '#21C747',
                    '#21C747',
                  ];
                  // this.limitChartOptions.colors = ['#6CB4EE', '#6CB4EE', '#6CB4EE', '#6CB4EE', '#6CB4EE'];
                  break;
                case 'BREACHED':
                  this.limitChartOptions.colors = [
                    '#ff6f6f',
                    '#ff6f6f',
                    '#ff6f6f',
                    '#ff6f6f',
                    '#ff6f6f',
                  ];
                  // this.limitChartOptions.colors = ['#d13b3c', '#d13b3c', '#d13b3c', '#d13b3c', '#d13b3c'];
                  break;

                default:
                  break;
              }
              console.log('Margin Ratio', this.marginRatio);
            }
          });
      });

    this.afs
      .GetCollateralReportData(
        this.authApi.UserName,
        this.custDetails.CustomerID,
        this.custApi.bankBaseCCY
      )
      .subscribe((coldata) => {
        console.log('Collateral Data', coldata);
        if (coldata.FinIQResponseHeader.Status === 'Succeed') {
          this.assetsArr = coldata.PortfolioWith_LiquidCollateral;
          const noliquidCollateral: any[] =
            coldata.PortfolioWith_NonLiquidCollateral;
          noliquidCollateral.forEach((nl) => {
            nl.MarketValue = nl.AmountUnit;
            nl.AmountUnit = 0;
            nl.MarketPrice = 1;
            this.assetsArr.push(nl);
          });

          this.liabilitiesArr = coldata.CreditFacilityWithMarginDetails;
          this.assetsArr.map((e) => {
            e.LoanableTradeCcy =
              (parseFloat(e.LendingRatio.split('%')[0]) * e.MarketValue) / 100;

            switch (e.CollateralType.toUpperCase()) {
              case 'EQUITY':
              case 'EQUITIES':
                e.color = this.assetsColorsArray[0];
                break;
              case 'MUTUAL FUNDS':
              case 'MUTUAL FUND':
              case 'FUND':
              case 'FUNDS TRADE SETUP':
              case 'FUNDS':
                e.color = this.assetsColorsArray[1];
                break;
              case 'BONDS':
                e.color = this.assetsColorsArray[2];
                break;
              case 'DCI':
                e.color = this.assetsColorsArray[3];
                break;
              case 'FCN':
                e.color = this.assetsColorsArray[4];
                break;
              case 'STRUCTURED NOTES':
                e.color = this.assetsColorsArray[5];
                break;
              case 'PHOENIX':
                e.color = this.assetsColorsArray[6];
                break;
              case 'PROPERTY':
              case 'PROPERTIES':
                e.color = this.assetsColorsArray[7];
                break;
              case 'NOTES':
                e.color = this.assetsColorsArray[8];
                break;
              case 'FIXED DEPOSIT':
                e.color = this.assetsColorsArray[9];
                break;
              case 'INSURANCE INVESTMENT':
                e.color = this.assetsColorsArray[10];
                break;

              default:
                break;
            }
          });
          this.liabilitiesArr.map((e) => {
            //Changed By MohanP | 04Feb22
            e.ExposureTradeCcy =
              (parseFloat(this.marginRatio) * e.ExpoAmt) / 100;
            e.ExposureInBaseCcy = e.ExposureTradeCcy * e.FXRate;
            // e.ExposureInBaseCcy = e.ExposureOrigCcy * e.FXRate;
            e.Reference = e.Reference.trim();
            switch (e.ExposureDescription.toUpperCase()) {
              case 'FXC SPOT':
              case 'FXSPT':
              case 'FXSPOT':
                e.color = this.liabilitiesColorsArray[0];
                break;
              case 'LETTEROFCREDIT':
                e.color = this.liabilitiesColorsArray[1];
                break;
              case 'OVERDRAFTS':
                e.color = this.liabilitiesColorsArray[2];
                break;
              case 'TERM_LOAN_R':
                e.color = this.liabilitiesColorsArray[3];
                break;
              case 'FXC FORWARD':
              case 'FXFORWARD':
                e.color = this.liabilitiesColorsArray[4];
                break;
              case 'CCSWAP':
                e.color = this.liabilitiesColorsArray[5];
                break;
              case 'PIVOTTARN':
                e.color = this.liabilitiesColorsArray[6];
                break;
              case 'AQDQ':
              case 'FXAQDQ':
              case 'FXACCUM':
                e.color = this.liabilitiesColorsArray[7];
                break;
              case 'FXEXOTIC':
              case 'BARRIER':
                e.color = this.liabilitiesColorsArray[8];
                break;
              case 'VANILLA OPTION':
              case 'VFXO':
                e.color = this.liabilitiesColorsArray[9];
                break;
              case 'TARFBUY':
                e.color = this.liabilitiesColorsArray[10];
                break;
              default:
                break;
            }
          });
          console.log('Assets', this.assetsArr);
          console.log('Liabiliteis', this.liabilitiesArr);
          // this.totalLoanableAssets = this.assetsArr.length !== 0 ? this.assetsArr.map((asset: any) => parseFloat(asset.ValueafterLendingRatioHKD) * parseFloat(asset.FXRate)).reduce((sum, as) => sum + as) : 0;
          // this.totalLoanLiabilities = this.liabilitiesArr.length !== 0 ? this.liabilitiesArr.map(lib => lib.ExposureOrigCcy * lib.FXRate).reduce((sum, lib) => sum + lib) : 0;
        }
      });
  }
  refreshPage() {
    this.renderAssetsandLiabilities();
  }
  revaluate() {
    this.isRevaluating = true;
    this.revalMsg = 'Revaluating...';
    this.afs
      .RevaluateMargin(
        4,
        this.custDetails.CustomerID,
        this.custDetails.CustomerID,
        'N'
      )
      .subscribe((res: any) => {
        {
          console.log(res);
          if (res.length !== 0) {
            const revaluated = res.Collateral_Calculation_APIResult.Revaluated;
            if (revaluated) {
              this.isRevaluating = false;
              this.refreshPage();
            } else {
              this.revalMsg = 'Revaulation Failed!';
              setTimeout(() => {
                this.revalMsg = '';
                this.isRevaluating = false;
              }, 3000);
            }
          }
        }
      });
  }
  back() {
    this.location.back();
  }

  getCreditSummaryReport() {
    this.isDownloading = true;
    this.message = 'Downloading...';
    if (this.Mode === 'Client' || this.Mode === 'SelectedUser') {
      this.isDownloading = true;

      this.PdfURL =
        this.interfaceUrl +
        'GenerateCollateralCreditSummaryReportData/' +
        this.authApi.EntityID +
        '/' +
        this.custDetails.CustomerName +
        '/' +
        this.custDetails.CustomerID +
        '/';
    } else if (this.Mode === 'RM') {
      if (this.custDetails.CustomerName === '') {
        this.message = 'Please select Customer.';
        this.isDownloading = false;
      } else {
        this.isDownloading = true;
        this.PdfURL =
          this.interfaceUrl +
          'GenerateCollateralCreditSummaryReportData/' +
          this.authApi.EntityID +
          '/' +
          this.custDetails.CustomerName +
          '/' +
          this.custDetails.CustomerID +
          '/';
      }
    }
    this.downloadFileFromURL(this.PdfURL);
  }

  downloadFileFromURL(url) {
    if (url) {
      this.downloadApi
        .downloadPDF(url)
        .subscribe((resp: HttpResponse<Blob>) => {
          console.log(resp.headers.get('content-disposition'));
          this.isDownloading = false;
          const fileName = resp.headers.get('content-disposition')
            ? resp.headers
                .get('content-disposition')
                .split(';')[1]
                .trim()
                .replace(/filename=/g, '')
            : 'File' + new Date().toLocaleString();
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(resp.body);
          a.href = objectUrl;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(objectUrl);
        });
    } else {
      this.isDownloading = false;
      this.message = 'Error while downloading.';
    }
  }
}
