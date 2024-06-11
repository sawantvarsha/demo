import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import { CollateralApiService } from '../../collateral-api/collateral-api.service';
import { environment } from '../../../../../environments/environment';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
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
// import { GoogleChartsConfig } from 'angular-google-charts/lib/models/google-charts-config.model';

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
  selector: 'app-global-margin-report',
  templateUrl: './global-margin-report.component.html',
  styleUrls: ['./global-margin-report.component.scss'],
})
export class GlobalMarginReportComponent
  implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  public marginChartOptions: Partial<ChartOptions>;


  globalMarginData: any = [];
  collateralDetailsData: any = [];
  exposureDetailsData: any = [];
  totalExposure = 0.0;
  collateralChartData: any = [];
  exposureChartData: any = [];
  flag = false;
  collateralChartTitle = '';
  collateralChartType = 'PieChart';

  type = 'ColumnChart';
  BarChart = 'BarChart';
  limitData = [];
  limitExposureData = [];
  columnNames = ['Year', 'Available Limit', 'Limit Used'];
  collateralExposurecolumnNames = ['Year', 'Collateral', 'Exposure'];
  options = {
    width: 500,
    height: 350,
    legend: {
      position: 'top',
      maxLines: 3,
      textStyle: { color: '#fff', fontSize: 14 },
    },
    bar: { groupWidth: '50%' },
    isStacked: true,
    backgroundColor: { fill: 'transparent' },
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
    hAxis: {
      textStyle: {
        color: '#808080',
      },
      gridlines: {
        color: 'transparent',
      },
    },
    vAxis: {
      textStyle: {
        color: '#808080',
      },
      gridlines: {
        color: 'transparent',
      },
    },
  };

  LineChart = 'LineChart';
  linechartcolumnNames = ['Title', 'IM', 'MM', 'CM'];

  linechartoptions = {
    width: 400,
    height: 350,
    legend: { position: 'top', maxLines: 3, textStyle: { color: '#808080' } },
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
  };

  linechartData = [];
  isProd = environment.production;
  collateralChartColumnNames = ['Collateral Type', 'Amount in USD'];
  collateralChartOptions = {
    is3D: true,
    legend: { position: 'right', textStyle: { color: '#fff', fontSize: 14 } },
    pieSliceText: 'value',
    pieSliceBorderColor: 'transparent',
    backgroundColor: { fill: 'transparent' },
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
    chartArea: { left: 30, top: 50, width: '100%', height: '100%' },
    tooltip: {
      textStyle: {
        color: 'black',
        bold: false,
      },
      // ignoreBounds: true
    },
    height: 180,
    pieSliceTextStyle: {
      color: 'black',
    },
  };

  exposureChartTitle = '';
  exposureChartType = 'PieChart';
  exposureChartColumnNames = ['Exposure Type', 'Amount in USD (IM)'];
  exposureChartOptions = {
    is3D: true,
    legend: { position: 'right', textStyle: { color: '#fff', fontSize: 14 } },
    pieSliceText: 'value',
    pieSliceBorderColor: 'transparent',
    backgroundColor: { fill: 'transparent' },
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
    chartArea: { left: 0, top: 50, width: '100%', height: '100%' },
    tooltip: {
      textStyle: {
        color: 'black',
        bold: false,
      },
      // ignoreBounds: true
    },
    height: 180,
    pieSliceTextStyle: {
      color: 'black',
    },
  };

  chart = {
    title: 'Usage',
    type: 'Gauge',
    data: [['', 0]],
    options: {
      animation: {
        duration: 1000,
        easing: 'in',
      },
      min: 0,
      max: 300,
      height: 250,
      redColor: '#999999',
      redFrom: 0,
      redTo: 0,
      greenColor: '#ED4235',
      greenFrom: 0,
      greenTo: 300,
      minorTicks: 20,
      majorTicks: ['0', '50', '100', '150', '200', '250', '300'],
      chartArea: { left: 0, top: 0, width: '100%' },
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
      backgroundColor: 'transparent',
    },
  };



  marginRatioDetailsData = [];
  liquidNonliquidData = [];
  collateralLiquid = '';
  collateralNonLiquid = '';
  ExposureLiquid = '';
  ExposureNonLiquid = '';
  balanceLiquid = '';
  balanceNonLiquid = '';
  AvailableLimitLiquid = '';
  AvailableLimitNonLiquid = '';
  LimitUsedNonLiquid = '';
  LimitUsedLiquid = '';

  marginRatioValue = 0;
  username = '';
  custId = '';
  globalMarginDataUnFiltered: any;
  globalMarginView: any;
  limitUtilizationData: any;

  limitGlobalMarginData: any;
  limitCollateralData: any;
  liquidDetails: any;
  ShortfallStatus: any;
  ShortfallAmount: any;
  ShortfallSince: any;
  nonLiquidDetails: any;
  Total: any;
  marginInterval: any;
  RevaluateLoader: boolean = false;
  baseCCY: string;
  custDetails: { CustomerID: string; CustomerName: string };
  //Changed By MohanP | 04Feb22
  totalLoanLiabilities: any;
  marginRatio: any[];
  constructor(
    public collateralApi: CollateralApiService,
    private elem: ElementRef,
    public custapi: CustomerApiService,
    public ref: ChangeDetectorRef,
    public afs: WorkflowApiService,
    public authApi: AuthService,
    public homeApi: HomeApiService
  ) {
    this.Total = {};
    this.limitGlobalMarginData = {};
    this.limitCollateralData = {};
    this.liquidDetails = {};
    this.ShortfallStatus = '';
    this.ShortfallAmount = '';
    this.nonLiquidDetails = {};
    this.ShortfallSince = '';
  }
  ngOnDestroy() {
    clearInterval(this.marginInterval);
  }
  ngAfterViewInit() {
    this.customizeChart();
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

    
  }
  ngAfterViewChecked() {
    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByTagName('rect'),
      (rect: HTMLElement) => {
        if (rect.getAttribute('fill') === '#ffffff') {
          // console.log("hello")
          rect.setAttribute('fill', 'transparent');
        }
        if (rect.getAttribute('fill') === '#cccccc') {
          // console.log("hello")
          rect.setAttribute('fill', 'transparent');
        }
        if (rect.getAttribute('fill') === '#ebebeb') {
          // console.log("hello")
          rect.setAttribute('fill', 'transparent');
        }
      }
    );

    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByClassName('guageChart'),
      (_elem) => {
        // if (elem.getAttribute('fill') === 'none') {
        try {
          if (
            this.elem.nativeElement.getElementsByClassName(
              'apexcharts-radialbar-slice-0'
            )[0] !== undefined
          ) {
            this.elem.nativeElement
              .getElementsByClassName('apexcharts-radialbar-slice-0')[0]
              .setAttribute('stroke-width', '5');
            document
              .getElementsByClassName('apexcharts-track')[0]
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

    this.marginChartOptions = {
      chart: {
        height: 350,
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
            background: 'var(--light-dark-gray)',
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

    // this.baseCCY = sessionStorage.getItem("BankBaseCcy");
    this.username = this.authApi.UserName;
    this.custId = this.homeApi.CustomerId;
    if (this.authApi.UserType === 'RM') {
      this.custDetails = {
        CustomerID: sessionStorage.getItem('RMCustID'),
        CustomerName: sessionStorage.getItem('RMCustName'),
      };
    } else {
      this.custDetails = {
        CustomerID: this.homeApi.CustomerId,
        CustomerName: this.homeApi.CustomerDisplayName,
      };
    }
    this.custapi.getBankBaseCCYOBS.subscribe((ccy) => {
      this.baseCCY = ccy;
      this.loadCollateralData();
    });

    this.collateralApi.collateralCalculationObserver.subscribe((res: any) => {
      {
        console.log(res);
        if (res.length !== 0) {
          this.RevaluateLoader = false;
          const revaluated =
            res.success.Collateral_Calculation_APIResult.Revaluated;
          if (revaluated) {
            this.chart.data = [['', 0]]; // don't remove
            this.loadCollateralData();
          }
        }
      }
    });
  }

  loadCollateralData() {
    this.collateralApi
      .GetGlobalMarginReportDataV2(
        this.custId,
        '10',
        this.username,
        '',
        '',
        'limitCollateral',
        this.baseCCY
      )
      .subscribe((d: any) => {
        try {
          // console.log(d);
          if (d) {
            this.globalMarginData.length = 0;
            this.globalMarginData =
              d.DB_Get_GlobalMarginReportData_LCYEResult[0];
            this.globalMarginDataUnFiltered =
              d.DB_Get_GlobalMarginReportData_LCYEResult[0];
            this.processGlobalMarginData();
          } else {
            this.globalMarginData.length = 0;
            this.globalMarginView.length = 0;
          }
        } catch (ex) {
          console.log(ex);
        }
      });
    this.collateralApi
      .GetGlobalMarginReportDataV2(
        this.custId,
        '5',
        this.username,
        this.custId,
        '',
        'globalMarginReport',
        this.baseCCY
      )
      .subscribe((d: any) => {
        try {
          if (d) {
            console.log(d);
          } else {
            this.globalMarginData.length = 0;
            this.globalMarginView.length = 0;
          }
        } catch (ex) {
          console.log(ex);
        }
      });

    this.collateralApi
      .GetGlobalMarginReportDataV2(
        this.custId,
        '8',
        this.username,
        this.custId,
        '',
        'collateralDetails',
        this.baseCCY
      )
      .subscribe((d: any) => {
        if (d.DB_Get_GlobalMarginReportData_LCYEResult) {
          this.collateralDetailsData =
            d.DB_Get_GlobalMarginReportData_LCYEResult;
          this.processCollateralDetailsData();
        }
      });

    this.collateralApi
      .GetGlobalMarginReportDataV2(
        this.custId,
        '9',
        this.username,
        this.custId,
        '',
        'exposureDetails',
        this.baseCCY
      )
      .subscribe((d: any) => {
        if (d.DB_Get_GlobalMarginReportData_LCYEResult) {
          this.exposureDetailsData = d.DB_Get_GlobalMarginReportData_LCYEResult;
          this.processExposureDetailsData();
        }
      });

    this.collateralApi
      .GetGlobalMarginReportDataV2(
        this.custId,
        '14',
        this.username,
        this.custId,
        '',
        'marginRatio',
        this.baseCCY
      )
      .subscribe((d: any) => {
        if (d.DB_Get_GlobalMarginReportData_LCYEResult) {
          this.marginRatioDetailsData =
            d.DB_Get_GlobalMarginReportData_LCYEResult;
          this.processMarginRatioDetailsData();
        }
      });

    this.collateralApi
      .GetGlobalMarginReportDataV2(
        this.custId,
        '6',
        this.username,
        '',
        '',
        'limitUtilization',
        this.baseCCY
      )
      .subscribe((d: any) => {
        if (d.DB_Get_GlobalMarginReportData_LCYEResult) {
          this.limitUtilizationData =
            d.DB_Get_GlobalMarginReportData_LCYEResult;
          this.processLimitUtilizationData();
        }
      });

    this.collateralApi
      .GetGlobalMarginReportDataV2(
        this.custId,
        '10',
        this.username,
        '',
        '',
        'limitCollateral',
        this.baseCCY
      )
      .subscribe((d: any) => {
        if (d.DB_Get_GlobalMarginReportData_LCYEResult) {
          this.limitCollateralData = d.DB_Get_GlobalMarginReportData_LCYEResult;
          console.log(this.limitCollateralData);
          // this.globalMarginData = d.DB_Get_GlobalMarginReportData_LCYEResult[0];
          // this.processGlobalMarginData();
          this.processLimitCollateralData();

          // console.log(this.liquidNonliquidData);
        }
      });
    // this.collateralApi.GetGlobalMarginReportDataV2(this.custId, '10', this.username, this.custId, '', 'liquidNonLiquid').subscribe((d: any) => {
    //   if (d.data) {

    //   }
    // });
  }

  processGlobalMarginData() {
    try {
      this.flag = true;
      this.linechartData.push([
        '',
        parseFloat(this.globalMarginData.IMMMCM.split(',')[0]),
        parseFloat(this.globalMarginData.IMMMCM.split(',')[1]),
        parseFloat(this.globalMarginData.IMMMCM.split(',')[2]),
      ]);
      // this.linechartData.push(['', parseFloat(this.globalMarginData.IMMMCM.split(',')[0]), parseFloat(this.globalMarginData.IMMMCM.split(',')[1]), parseFloat(this.globalMarginData.IMMMCM.split(',')[2])]);
      // this.linechartData.push(['', parseFloat(this.globalMarginData.IMMMCM.split(',')[0]), parseFloat(this.globalMarginData.IMMMCM.split(',')[1]), parseFloat(this.globalMarginData.IMMMCM.split(',')[2])]);
      this.globalMarginData = this.globalMarginData.map((_gm: any) => { });
      console.log('GlobalMarginData', this.globalMarginData);
      this.ref.detectChanges();
    } catch (Ex) { }
  }
  processCollateralDetailsData() {
    this.collateralDetailsData = this.collateralDetailsData.map((d: any) => {
      return {
        CollateralType: d.CollateralType,
        Amount: d.Amount,
      };
    });
    // console.log(this.collateralDetailsData, this.GroupId);
    // this.collateralChartData = this.collateralDetailsData.map((d: any) => {
    //   return [d.CollateralType, parseInt(d.Amount || 0, 10)];
    // });
    if (this.collateralDetailsData.length !== 0) {
      this.collateralDetailsData.forEach((element) => {
        this.collateralChartData.push({
          title: element.CollateralType,
          value: parseInt(element.Amount || 0, 10),
        });
      })
      console.log(this.collateralChartData)
    }
    //Changed By MohanP | 4Feb22
    this.Total.Collateral =
      this.collateralDetailsData.length !== 0
        ? this.collateralDetailsData
          .map((asset: any) => parseFloat(asset.Amount))
          .reduce((sum, as) => sum + as)
        : 0;

    // console.log(this.collateralChartData);
  }

  processExposureDetailsData() {
    this.exposureDetailsData = this.exposureDetailsData.map((d: any) => {
      return {
        Facility: d.Facility,
        Amount: d.Amount,
      };
    });
    // console.log(this.exposureDetailsData, this.GroupId);
    // this.exposureChartData = this.exposureDetailsData.map((d: any) => {
    //   return [d.Facility, parseInt(d.Amount || 0, 10)];
    // });

    if (this.exposureDetailsData.length !== 0) {
      this.exposureDetailsData.forEach((element) => {
        this.exposureChartData.push({
          title: element.Facility,
          value: parseInt(element.Amount || 0, 10),
        });
      });
    }

    this.Total.Exposure =
      this.exposureDetailsData.length !== 0
        ? this.exposureDetailsData
          .map((lib) => parseFloat(lib.Amount))
          .reduce((sum, lib) => sum + lib)
        : 0;
    console.log(this.exposureChartData);
  }

  customizeChart() {
    // Array.prototype.forEach.call(this.elem.nativeElement.getElementsByTagName('circle'), (circle: HTMLElement) => {
    //   if (circle.getAttribute('fill') === '#4684ee') {
    //     circle.setAttribute('fill', '#1261a0');
    //     // circle.setAttribute('fill', '#1261a0');
    //   }
    //   if (circle.getAttribute('fill') === '#cccccc') {
    //     // circle.setAttribute('r', '108');
    //     circle.setAttribute('fill', '#0D445B');
    //     // circle.setAttribute('fill', '#1261a0');
    //     // #ed4235
    //   }
    //   if (circle.getAttribute('r') === '15') {
    //     circle.setAttribute('r', '10');
    //     circle.setAttribute('fill', 'grey');
    //   }
    //   circle.setAttribute('stroke', 'transparent');
    // });
    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByTagName('text'),
      (text: HTMLElement) => {
        if (text.getAttribute('font-family') === 'arial') {
          text.setAttribute('fill', 'var(--grey)');
          text.setAttribute('font-size', '11');
        }
        if (text.getAttribute('x') === '125') {
          text.setAttribute('fill', 'var(--grey)');
          text.setAttribute('font-size', '18');
        }
      }
    );
    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByTagName('path'),
      (path: HTMLElement) => {
        if (path.getAttribute('stroke') === '#c63310') {
          path.setAttribute('stroke', 'transparent');
          path.setAttribute('fill', 'var(--dark-grey)');
        }
        if (path.getAttribute('fill') === '#ed4235') {
          path.setAttribute('fill', 'transparent');
          // path.setAttribute('stroke', '#ed4235');
          // path.setAttribute('stroke-width', '2');
        }
        if (path.getAttribute('fill') === '#999999') {
          path.setAttribute('fill', 'transparent');
          // path.setAttribute('stroke', '#999999');
          // path.setAttribute('stroke-width', '2');
        }
      }
    );
    try {
      Array.prototype.forEach.call(
        this.elem.nativeElement.getElementsByTagName('google-chart'),
        (chart: HTMLElement) => {
          chart.querySelector('td').style.background = 'transparent';
          chart.querySelector('tr').style['background-color'] = 'transparent';
        }
      );
    } catch (Ex) { }
  }
  processMarginRatioDetailsData() {
    let value = 0;
    this.marginRatio = [];
    if (this.marginRatioDetailsData.length) {
      value = parseFloat(
        (this.marginRatioDetailsData[0].Margin_Utilization_Ratio_HKD || 0) + ''
      );
      let margin = 0;
      this.marginRatio.push([value]);
      this.marginInterval = setInterval(() => {
        if (margin <= value) {
          this.chart.data = [['', margin]];
          this.marginRatio.push([margin]);
          margin++;
        } else {
          this.chart.data = [['', value]];
          this.marginRatio.push([value]);

          clearInterval(this.marginInterval);
        }
      }, 1);
    } else {
      this.chart.data = [['', value]];
      this.marginRatio.push([value]);

    }


    this.marginRatioValue = value;
    // this.marginRatio = parseInt(marginData.Margin, 10);
    if (this.marginRatioValue > 100) {
      this.marginChartOptions.series = [
        this.marginRatioValue - 100,
        this.marginRatioValue,
      ];
    } else {
      this.marginChartOptions.series = [0, this.marginRatioValue];
    }
    this.marginChartOptions.colors = [
      '#ff6f6f',
      '#ff6f6f',
      '#ff6f6f',
      '#ff6f6f',
      '#ff6f6f',
    ];
    if (value > 100) {
      this.chart.options.max = this.getMaxValue(Math.ceil(value));
      this.chart.options.redTo = value;
      this.chart.options.greenTo = this.getMaxValue(Math.ceil(value));
      this.chart.options.greenFrom = value > 300 ? 300 : value;
      const tickDiff = this.getPower(Math.ceil(value));
      this.chart.options.majorTicks = [];
      let ticks = 0;
      for (let cnt = 0; ticks <= this.chart.options.max; cnt++) {
        this.chart.options.majorTicks.push(ticks.toString());
        ticks = ticks + Math.pow(10, tickDiff - 1);
      }
    } else {
      this.chart.options.redTo = value;
      this.chart.options.greenFrom = value > 300 ? 300 : value;
    }
  }

  getMaxValue(v) {
    return Math.pow(10, v.toString().length);
  }
  getPower(v) {
    let pow = 0;
    for (let cnt = v; cnt > 0; cnt--) {
      cnt = cnt / 10;
      pow++;
    }
    return pow;
  }
  processLimitUtilizationData() {
    // const liquidData: any = this.limitUtilizationData;
    // const nonLiquidData: any = this.limitUtilizationData;
    const liquidData: any = this.limitUtilizationData.filter(
      (d: any) => d.Liquid_YN === 'Y'
    );
    const nonLiquidData: any = this.limitUtilizationData.filter(
      (d: any) => d.Liquid_YN === 'N'
    );
    // console.log(liquidData, nonLiquidData.length);
    if (liquidData.length) {
      this.liquidDetails.CreditLimit = liquidData[0].CreditLimit || '';
      this.liquidDetails.AvailableLimit = liquidData[0].AvailableLimit || '';
      this.liquidDetails.LimitStatus = liquidData[0].LimitStatus || '';
      this.liquidDetails.LimitUsed = liquidData[0].Limit_Used || '';
      this.liquidDetails.LiquidYN = liquidData[0].Liquid_YN || '';
      this.liquidDetails.ApprovedLimit = liquidData[0].Approved_Limit || '';
    } else {
      this.liquidDetails.CreditLimit = 'Liquid';
      this.liquidDetails.AvailableLimit = '0.00';
      this.liquidDetails.LimitStatus = 'Sufficient';
      this.liquidDetails.LimitUsed = '0.00';
      this.liquidDetails.LiquidYN = 'Y';
      this.liquidDetails.ApprovedLimit = '0.00';
    }

    if (nonLiquidData.length) {
      this.nonLiquidDetails.CreditLimit = nonLiquidData[0].CreditLimit || '';
      this.nonLiquidDetails.AvailableLimit =
        nonLiquidData[0].Available_Limit || '';
      this.nonLiquidDetails.LimitStatus = nonLiquidData[0].LimitStatus || '';
      this.nonLiquidDetails.LimitUsed = nonLiquidData[0].Limit_Used || '';
      this.nonLiquidDetails.LiquidYN = nonLiquidData[0].Liquid_YN || '';
      this.nonLiquidDetails.ApprovedLimit =
        nonLiquidData[0].Approved_Limit || '';
    } else {
      this.nonLiquidDetails.CreditLimit = 'Non-Liquid';
      this.nonLiquidDetails.AvailableLimit = '0.00';
      this.nonLiquidDetails.LimitStatus = 'Sufficient';
      this.nonLiquidDetails.LimitUsed = '0.00';
      this.nonLiquidDetails.LiquidYN = 'N';
      this.nonLiquidDetails.ApprovedLimit = '0.00';
    }
  }

  processLimitCollateralData() {
    try {
      this.flag = true;
      // const liquidData: any = this.limitCollateralData;
      // const nonLiquidData: any = this.limitCollateralData;
      const liquidData: any = this.limitCollateralData.filter(
        (d: any) => d.Liquid_YN === 'Y'
      );
      const nonLiquidData: any = this.limitCollateralData.filter(
        (d: any) => d.Liquid_YN === 'N'
      );
      // console.log(liquidData, nonLiquidData);
      if (liquidData.length) {
        this.liquidDetails.Collateral = liquidData[0].Collateral || '0.00';
        this.liquidDetails.Exposure =
          liquidData[0].Exposure_Initial_Facility || '0.00';
        this.liquidDetails.Loanable = liquidData[0].Balance || '0.00';

        this.collateralLiquid = liquidData[0].Collateral || '0.00';
        this.ExposureLiquid = liquidData[0].Exposure_Initial_Facility;
        this.balanceLiquid = liquidData[0].Balance || '0.00';
        this.AvailableLimitLiquid = liquidData[0].Available_Limit;
        this.LimitUsedLiquid = liquidData[0].Limit_used || '0.00';

        // this.ShortfallStatus = liquidData[0].ShoarfallStatus || '';
        if (parseInt(liquidData[0].Balance, 10) < 0) {
          this.ShortfallStatus = liquidData[0].ShoarfallStatus || '';
          this.ShortfallAmount = liquidData[0].Balance || '0.00';
          this.ShortfallSince = this.limitGlobalMarginData.ShortfallSince || '';
        } else {
          this.ShortfallStatus = liquidData[0].ShoarfallStatus || '';
          this.ShortfallAmount = '-';
          this.ShortfallSince = '-';
        }
      }

      if (nonLiquidData.length) {
        this.nonLiquidDetails.Collateral =
          nonLiquidData[0].Collateral || '0.00';
        this.nonLiquidDetails.Exposure = nonLiquidData[0].Limit_used || '0.00';
        this.nonLiquidDetails.Loanable = nonLiquidData[0].Balance || '0.00';

        this.collateralNonLiquid = nonLiquidData[0].Collateral || '0.00';
        this.ExposureNonLiquid = nonLiquidData[0].Exposure_Initial_Facility;
        this.balanceNonLiquid = nonLiquidData[0].Balance;
        this.AvailableLimitNonLiquid = nonLiquidData[0].Available_Limit;
        this.LimitUsedNonLiquid = nonLiquidData[0].LimitUsed;

        // this.ShortfallStatus = nonLiquidData[0].ShoarfallStatus || '';
      }

      // this.Total.Collateral = parseFloat(
      //   this.liquidDetails.Collateral || '0'
      // ).toFixed(2);
      // this.Total.Exposure = parseFloat(
      //   this.liquidDetails.Exposure || '0'
      // ).toFixed(2);
      this.Total.Loanable = parseFloat(
        this.liquidDetails.Loanable || '0'
      ).toFixed(2);
      this.Total.Approved_Limit = parseFloat(
        this.liquidDetails.Approved_Limit || '0'
      ).toFixed(2);

      // this.Total.Collateral = (parseFloat(this.nonLiquidDetails.Collateral || '0') + parseFloat(this.liquidDetails.Collateral || '0')).toFixed(2);
      // this.Total.Exposure = (parseFloat(this.nonLiquidDetails.Exposure || '0') + parseFloat(this.liquidDetails.Exposure || '0')).toFixed(2);
      // this.Total.Loanable = (parseFloat(this.nonLiquidDetails.Loanable || '0') + parseFloat(this.liquidDetails.Loanable || '0')).toFixed(2);

      // this.limitData.push('Liquid', parseFloat(this.AvailableLimitLiquid), parseFloat(this.limitusedLiquid));
      // this.limitData.push('NonLiquid',  parseFloat(this.AvailableLimitNonLiquid),  parseFloat(this.limitusedNonLiquid));
      // this.limitData.push([
      //   'Liquid',
      //   parseFloat(this.AvailableLimitLiquid),
      //   parseFloat(this.LimitUsedLiquid),
      // ]);
      // this.limitData.push([
      //   'NonLiquid',
      //   parseFloat(this.AvailableLimitNonLiquid),
      //   parseFloat(this.LimitUsedNonLiquid),
      // ]);
      this.limitExposureData.push([
        'Collateral',
        parseFloat(this.collateralLiquid),
        0,
      ]);
      this.limitExposureData.push([
        'Exposure',
        0,
        parseFloat(this.ExposureLiquid),
      ]);
      // this.limitExposureData.push([
      //   'NonLiquid',
      //   parseFloat(this.collateralNonLiquid),
      //   parseFloat(this.ExposureNonLiquid),
      // ]);
      this.ref.detectChanges();
    } catch (ex) {
      console.log(ex);
    }
  }

  Revaluate() {
    this.RevaluateLoader = true;
    this.collateralApi.GetCollateralCalculation(
      4,
      this.custId,
      this.username,
      'N'
    );
  }
}
