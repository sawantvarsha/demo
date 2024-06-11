import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GoogleChartComponent } from 'angular-google-charts';
import { CollateralApiService } from '../../../collateral-api/collateral-api.service';
import { CustomerApiService } from '../../../../../services/customer-api.service';
@Component({
  selector: 'app-collateral-details',
  templateUrl: './collateral-details.component.html',
  styleUrls: ['./collateral-details.component.scss']
})
export class CollateralDetailsComponent implements OnInit {

  @Input() id = 0;

  GroupId: string;
  @Input()
  public set groupId(val: string) {
    if (val) {
      this.GroupId = val;
    }
  }

  @ViewChild('collateralChart')
  collateralChart: GoogleChartComponent;

  @ViewChild('collateralChart')
  exposureChart: GoogleChartComponent;
  collateralChartData = [
    // ['Cash Collateral', 10650],
    // ['Cash', 120000],
    // ['NOTES & BONDS', 4500000]
  ];
  collateralChartTitle = '';
  collateralChartType = 'PieChart';

  collateralChartColumnNames = ['Collateral Type', 'Amount in USD'];
  collateralChartOptions = {
    is3D: true,
    pieSliceText: 'value',
    pieSliceBorderColor: 'transparent',
    backgroundColor: { fill: 'transparent' },
    colors: ['#ccb6a6', '#887f76', '#d4ab8b'],
    chartArea: { left: 0, top: 5, width: '60%', height: '85%' },
    tooltip: {
      textStyle: {
        color: '#887f76',
        bold: false
      },
      // ignoreBounds: true
    },
    height: 150
  };

  exposureChartTitle = '';
  exposureChartType = 'PieChart';
  exposureChartData = [
    // ['FX Forward', 500000],
    // ['FX Option', 15000000],
    // ['IRS', 5000000]
  ];
  exposureChartColumnNames = ['Exposure Type', 'Amount in USD (IM)'];
  exposureChartOptions = {
    is3D: true,
    pieSliceText: 'value',
    pieSliceBorderColor: 'transparent',
    backgroundColor: { fill: 'transparent' },
    colors: ['#ccb6a6', '#887f76', '#d4ab8b'],
    chartArea: { left: 0, top: 5, width: '60%', height: '85%' },
    tooltip: {
      textStyle: {
        color: '#887f76',
        bold: false
      },
      // ignoreBounds: true
    },
    height: 150
  };

  collateralDetailsData = [];
  exposureDetailsData = [];
  baseCCY: string;
  constructor(private collateralApi: CollateralApiService, private custapi: CustomerApiService) { }

  ngOnInit() {
    const that = this;
    // this.baseCCY = sessionStorage.getItem("BankBaseCcy");

    this.custapi.getBankBaseCCYOBS.subscribe(ccy =>{
      this.baseCCY = ccy;
    })
        this.collateralApi.collateralDetailsData.subscribe((d: any) => {
      if (d.data && d.GroupId === this.GroupId) {
        that.collateralDetailsData = d.data;
        that.processCollateralDetailsData();
      }
    });
    this.collateralApi.exposureDetailsData.subscribe((d: any) => {
      if (d.data && d.GroupId === this.GroupId) {
        that.exposureDetailsData = d.data;
        that.processExposureDetailsData();
      }
    });

    this.collateralApi.expandedRow.subscribe((id: string) => {
      // console.log(id);
      if (id === that.GroupId) {
        if (!that.collateralDetailsData.length) {
          that.collateralApi.GetGlobalMarginReportData(that.GroupId, '8', 'Dealer4', '', '', 'collateralDetails',this.baseCCY );
        }
        if (!that.exposureDetailsData.length) {
          that.collateralApi.GetGlobalMarginReportData(that.GroupId, '9', 'Dealer4', '', '', 'exposureDetails', this.baseCCY);
        }
      }
    });
  }



  processCollateralDetailsData() {
    this.collateralDetailsData = this.collateralDetailsData.map((d: any) => {
      return {
        CollateralType: d.CollateralType,
        Amount: d.Amount
      };
    });
    // console.log(this.collateralDetailsData, this.GroupId);
    this.collateralChartData = this.collateralDetailsData.map((d: any) => {
      return [d.CollateralType, parseFloat(d.Amount || 0)];
    });
    // console.log(this.collateralChartData);
  }

  processExposureDetailsData() {
    this.exposureDetailsData = this.exposureDetailsData.map((d: any) => {
      return {
        Facility: d.Facility,
        Amount: d.Amount
      };
    });
    // console.log(this.exposureDetailsData, this.GroupId);
    this.exposureChartData = this.exposureDetailsData.map((d: any) => {
      return [d.Facility, parseFloat(d.Amount || 0)];
    });
    // console.log(this.exposureChartData);
  }


}
