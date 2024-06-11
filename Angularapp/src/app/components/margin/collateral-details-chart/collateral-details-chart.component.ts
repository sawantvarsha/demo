import { Component, Input, OnInit } from '@angular/core';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { ChartOptions } from '../margin.component';

@Component({
  selector: 'app-collateral-details-chart',
  templateUrl: './collateral-details-chart.component.html',
  styleUrls: ['./collateral-details-chart.component.scss'],
})
export class CollateralDetailsChartComponent implements OnInit {
  @Input() CustomerDetails: any;

  public collateralChartOptions: Partial<ChartOptions>;
  collateralDetailsData: any;
  collateralColorsArray: string[];
  assetsColorsArray: string[];
  totalLoanAmount: any;
  totalLoanableAssets: any;
  custDetails:  { CustomerID: number; CustomerName: string; GroupId: string };

  constructor(
    public workflowApi: WorkflowApiService,
    public custApi: CustomerApiService
  ) {
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
    };
  }

  ngOnInit(): void {
    console.log(this.CustomerDetails);

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

    this.custDetails = this.CustomerDetails;

    this.workflowApi
      .GetCollateralChartData(
        this.custDetails.GroupId,
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
        this.collateralChartOptions.colors = this.collateralDetailsData.forEach(
          (d: any) => {
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
                d.color = this.assetsColorsArray[7];
                break;
              case 'NOTES':
                d.color = this.assetsColorsArray[8];
                break;
              case 'FIXED DEPOSIT':
                d.color = this.assetsColorsArray[9];
                break;

              default:
                break;
            }
          }
        );
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
  }
}
