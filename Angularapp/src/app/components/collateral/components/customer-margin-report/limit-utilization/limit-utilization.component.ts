import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CollateralApiService } from '../../../collateral-api/collateral-api.service';
import { GoogleChartComponent } from 'angular-google-charts';
import { CustomerApiService } from '../../../../../services/customer-api.service';
@Component({
  selector: 'app-limit-utilization',
  templateUrl: './limit-utilization.component.html',
  styleUrls: ['./limit-utilization.component.scss']
})
export class LimitUtilizationComponent implements OnInit {


  @Input() id: number;

  GroupId: string;
  @Input()
  public set groupId(val: string) {
    if (val) {
      this.GroupId = val;
    }
  }

  @ViewChild('limitUsageChart')
  limitUsageChart: GoogleChartComponent;

  chart = {
    title: '',
    type: 'ColumnChart',
    data: [
      // ['SMF', 400000, 6000000],
      // ['CRD', 16000000, 15500000]
    ],
    columnNames: ['Entity', 'Limit Used', 'Approved Limit'],
    options: {
      hAxis: {
        // title: 'Entity',
        format: 'short',
        position: 'in'
      },
      vAxis: {
        // title: 'Amount',
        minValue: 0,
        format: 'short',
        position: 'in'
      },
      tooltip: {
        textStyle: {
          color: '#887f76',
          bold: false
        }
      },
      legend: {
        position: 'top'
      },
      bars: 'vertical',
      backgroundColor: 'transparent',
      chartArea: { left: 30, top: 30, width: '75%', height: '70%' },
      colors: ['#ab9f93', '#d4ab8b']
    },
    height: 1000
  };

  limitUtilizationData = [];
  limitCollateralData = [];
  limitUtilizationChartData = [];

  liquidDetails = {
    CreditLimit: 'Liquid',
    AvailableLimit: '0.00',
    LimitStatus: '',
    LimitUsed: '0.00',
    ApprovedLimit: '0.00',
    LiquidYN: '',
    Collateral: '0.00',
    Exposure: '0.00',
    Loanable: '0.00',
    Total: '0.00',
  };

  nonLiquidDetails = {
    CreditLimit: 'Non-Liquid',
    AvailableLimit: '0.00',
    LimitStatus: '',
    LimitUsed: '0.00',
    ApprovedLimit: '0.00',
    LiquidYN: '',
    Collateral: '0.00',
    Exposure: '0.00',
    Loanable: '0.00',
    Total: '0.00'
  };

  Total = {
    Collateral: '0.00',
    Exposure: '0.00',
    Loanable: '0.00'
  };

  ShortfallStatus = '';
  ShortfallSince = '';
  ShortfallAmount = '0.00';
  baseCCY: string;
  constructor(private collateralApi: CollateralApiService, private custapi: CustomerApiService) { }

  ngOnInit() {
    const that = this;
    
    // this.baseCCY = sessionStorage.getItem("BankBaseCcy");
    this.custapi.getBankBaseCCYOBS.subscribe(ccy =>{
      this.baseCCY = ccy;
    })
    this.collateralApi.limitUtilizationData.subscribe((d: any) => {
      if (d.data && d.GroupId === that.GroupId) {
        that.limitUtilizationData = d.data;
        that.processLimitUtilizationData();
      }
    });

    this.collateralApi.limitCollateralData.subscribe((d: any) => {
      if (d.data && d.GroupId === that.GroupId) {
        that.limitCollateralData = d.data;
        that.processLimitCollateralData();
      }
    });

    this.collateralApi.limitUtilizationChartData.subscribe((d: any) => {
      if (d.data && d.GroupId === that.GroupId) {
        that.limitUtilizationChartData = d.data;
        that.setChartData();
      }
    });

    this.collateralApi.expandedRow.subscribe((id: string) => {
      // console.log(id);
      if (id === that.GroupId) {
        if (!that.limitUtilizationData.length) {
          this.collateralApi.GetGlobalMarginReportData(that.GroupId, '6', 'Dealer4', '', '', 'limitUtilization', this.baseCCY);
        }
        if (!that.limitCollateralData.length) {
          this.collateralApi.GetGlobalMarginReportData(that.GroupId, '10', 'Dealer4', '', '', 'limitCollateral', this.baseCCY);
        }
        if (!that.limitUtilizationChartData.length) {
          this.collateralApi.GetGlobalMarginReportData(that.GroupId, '11', 'Dealer4', '', '', 'limitUtilizationChart', this.baseCCY);
        }
      }
    });
  }

  processLimitUtilizationData() {
    const liquidData: any = this.limitUtilizationData.filter((d: any) => d.Liquid_YN === 'Y');
    const nonLiquidData: any = this.limitUtilizationData.filter((d: any) => d.Liquid_YN === 'N');
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
      this.nonLiquidDetails.AvailableLimit = nonLiquidData[0].AvailableLimit || '';
      this.nonLiquidDetails.LimitStatus = nonLiquidData[0].LimitStatus || '';
      this.nonLiquidDetails.LimitUsed = nonLiquidData[0].Limit_Used || '';
      this.nonLiquidDetails.LiquidYN = nonLiquidData[0].Liquid_YN || '';
      this.nonLiquidDetails.ApprovedLimit = nonLiquidData[0].Approved_Limit || '';
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
      const liquidData: any = this.limitCollateralData.filter((d: any) => d.Liquid_YN === 'Y');
      const nonLiquidData: any = this.limitCollateralData.filter((d: any) => d.Liquid_YN === 'N');
      // console.log(liquidData, nonLiquidData);
      if (liquidData.length) {
        this.liquidDetails.Collateral = liquidData[0].Collateral || '0.00';
        this.liquidDetails.Exposure = liquidData[0].Limit_used || '0.00';
        this.liquidDetails.Loanable = liquidData[0].Balance || '0.00';

        // this.ShortfallStatus = liquidData[0].ShoarfallStatus || '';
        if (parseInt(liquidData[0].Balance, 10) < 0) {
          this.ShortfallStatus = liquidData[0].ShoarfallStatus || '';
          this.ShortfallAmount = liquidData[0].Balance || '0.00';
          this.ShortfallSince = liquidData[0].Calculation_Date || '';
        } else {
          this.ShortfallStatus = liquidData[0].ShoarfallStatus || '';
          this.ShortfallAmount = '';
          this.ShortfallSince = '';
        }
      }
      if (nonLiquidData.length) {
        this.nonLiquidDetails.Collateral = nonLiquidData[0].Collateral || '0.00';
        this.nonLiquidDetails.Exposure = nonLiquidData[0].Limit_used || '0.00';
        this.nonLiquidDetails.Loanable = nonLiquidData[0].Balance || '0.00';

        // this.ShortfallStatus = nonLiquidData[0].ShoarfallStatus || '';
      }

      this.Total.Collateral = (parseFloat(this.nonLiquidDetails.Collateral || '0') + parseFloat(this.liquidDetails.Collateral || '0')).toFixed(2);
      this.Total.Exposure = (parseFloat(this.nonLiquidDetails.Exposure || '0') + parseFloat(this.liquidDetails.Exposure || '0')).toFixed(2);
      this.Total.Loanable = (parseFloat(this.nonLiquidDetails.Loanable || '0') + parseFloat(this.liquidDetails.Loanable || '0')).toFixed(2);
    } catch (ex) {
//console.log(ex);
    }
  }

  setChartData() {
    try {
      this.limitUtilizationChartData = this.limitUtilizationChartData.map((d: any) => {
        return [d.Facility, parseFloat(d.Limit_Used || 0), parseFloat(d.Approved_Limit || 0)];
      });
      this.chart.data = this.limitUtilizationChartData;
      // console.log(this.chart.data);

      // let wrapper = this.limitUsageChart.wrapper;
      // wrapper = this.limitUsageChart.wrapper;
      // wrapper.draw(this.limitUsageChart.getChartElement());
    } catch (ex) {
//console.log(ex);
    }
  }

}
