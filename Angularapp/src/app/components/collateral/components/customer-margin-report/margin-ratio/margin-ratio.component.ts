import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { CollateralApiService } from '../../../collateral-api/collateral-api.service';
import { GoogleChartComponent } from 'angular-google-charts';
import { CustomerApiService } from '../../../../../services/customer-api.service';
@Component({
  selector: 'app-margin-ratio',
  templateUrl: './margin-ratio.component.html',
  styleUrls: ['./margin-ratio.component.scss', '../../../collateral.component.scss']
})
export class MarginRatioComponent implements OnInit {

  @ViewChild('marginRatioChart')
  marginRatioChart: GoogleChartComponent;

  GroupId: string;
  baseCCY: string;
  @Input()
  public set groupId(val: string) {
    if (val) {
      this.GroupId = val;
    }
  }

  chart = {
    title: 'Usage',
    type: 'Gauge',
    data: [
      ['', 0]
    ],
    options: {
      animation: {
        duration: 5000,
        easing: 'out'
      },
      min: 0,
      max: 300,
      height: 250,
      redColor: '#ab9f93',
      redFrom: 0,
      redTo: 0,
      greenColor: '#d4ab8b',
      greenFrom: 0,
      greenTo: 300,
      minorTicks: 20,
      majorTicks: ['0', '50', '100', '150', '200', '250', '300'],
      chartArea: { left: 0, top: 0 }
    }
  };

  marginRatioDetailsData = [];
  marginRatioValue = 0;

  constructor(private elem: ElementRef, public collateralApi: CollateralApiService, public custapi: CustomerApiService) { }

  ngOnInit() {
    const that = this;

    
    // this.baseCCY = sessionStorage.getItem("BankBaseCcy");
    this.custapi.getBankBaseCCYOBS.subscribe(ccy =>{
      this.baseCCY = ccy;
    })
    that.collateralApi.marginRatioDetailsData.subscribe((d: any) => {
      if (d.data && d.GroupId === that.GroupId) {
        that.marginRatioDetailsData = d.data;
        that.processMarginRatioDetailsData();
      }
    });

    this.collateralApi.expandedRow.subscribe((id: string) => {
      // console.log(id);
      if (id === that.GroupId && !that.marginRatioDetailsData.length) {
        that.collateralApi.GetGlobalMarginReportData(that.GroupId, '14', 'Dealer4', '', '', 'marginRatio', this.baseCCY);
      }
    });
  }

  customizeChart() {
    Array.prototype.forEach.call(this.elem.nativeElement.getElementsByTagName('circle'), (circle: HTMLElement) => {
      if (circle.getAttribute('fill') === '#4684ee') {
        circle.setAttribute('fill', 'var(--light-grey)');
      }
      circle.setAttribute('stroke', 'transparent');
    });
    Array.prototype.forEach.call(this.elem.nativeElement.getElementsByTagName('text'), (text: HTMLElement) => {
      text.setAttribute('fill', 'var(--grey)');
    });
    Array.prototype.forEach.call(this.elem.nativeElement.getElementsByTagName('path'), (path: HTMLElement) => {
      if (path.getAttribute('stroke') === '#c63310') {
        path.setAttribute('stroke', 'transparent');
        path.setAttribute('fill', 'var(--dark-grey)');
      }
    });
    Array.prototype.forEach.call(this.elem.nativeElement.getElementsByTagName('google-chart'), (chart: HTMLElement) => {
      chart.querySelector('td').style.background = 'transparent';
    });
  }

  processMarginRatioDetailsData() {
    let value = 0;
    if (this.marginRatioDetailsData.length) {
      value = parseFloat((this.marginRatioDetailsData[0].Margin_Utilization_Ratio_HKD || 0) + '');
      this.chart.data = [['', value]];
    } else {
      this.chart.data = [['', value]];
    }
    this.marginRatioValue = value;
    // let wrapper = this.marginRatioChart.wrapper;
    this.chart.options.redTo = value;
    this.chart.options.greenFrom = value > 300 ? 300 : value;
    // wrapper = this.marginRatioChart.wrapper;
    // wrapper.draw(this.marginRatioChart.getChartElement());
    // this.customizeChart();
  }


}
