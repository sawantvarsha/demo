import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { createChart } from 'lightweight-charts';
import { FXLimitService } from 'src/app/services/fxlimit.service';
// import * as $ from 'jquery';
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-fxgraph',
  templateUrl: './fxgraph.component.html',
  styleUrls: ['./fxgraph.component.scss'],
})
export class FxgraphComponent implements OnInit, OnChanges {
  @Input() SelectedCcyPair: any;
  PairData: any;
  chart: any;
  graphloader: boolean;
  selectedTenor: any;

  constructor(private fxlimitService: FXLimitService) {
    this.PairData = [{ time: '14-Feb-2022', value: '100' }];
    this.graphloader = true;
  }

  ngOnInit(): void {
    // console.log('');
  }

  ngOnChanges(): void {
    if (this.SelectedCcyPair) {
      this.graphloader = true;
      // console.log('selected pair', this.SelectedCcyPair);
      this.selectedTenor = '12';
      this.getHistoricalData(12);
    }
  }

  getHistoricalData(tenor: any) {
    this.fxlimitService
      .getHistoricalDataforCcyPairWithTenor(this.SelectedCcyPair, tenor)
      .subscribe((res) => {
        if (res) {
          // console.log('hitorical data', res);
          this.PairData = [{ time: '14-Feb-2022', value: '100' }]; //to reset array
          for (let i = 0; i < res.GetRateFeedData_WithTenorResult.length; i++) {
            this.PairData[i] = {
              time: res.GetRateFeedData_WithTenorResult[i].RateDate,
              value: res.GetRateFeedData_WithTenorResult[i].AvgRate,
            };
          }
          this.newGraph(this.PairData);
          this.graphloader = false;
        }
        // console.log('selective data', this.PairData);
      });
  }

  getTenor(tenor: any) {
    this.graphloader = true;
    // console.log('tenor', tenor);
    this.selectedTenor = tenor;
    this.getHistoricalData(tenor);
  }

  newGraph(data: { time: string; value: number }[]) {
    if ($('#graphContainer') !== null || $('#graphContainer') !== undefined)
      $('#graphContainer').remove();
    $('#mainContainer').append(
      '<div class="graphContainer" style="border: 1px solid var(--theme-hover); border-radius: 3px;" id="graphContainer"></div>'
    );

    var len = data.length;

    this.chart = createChart(document.getElementById('graphContainer'), {
      width: document.getElementById('mainContainer').clientWidth
        ? document.getElementById('mainContainer').clientWidth
        : window.innerWidth * 0.34, //modified by Uddesh
      height: document.getElementById('mainContainer').clientHeight
        ? document.getElementById('mainContainer').clientHeight - 95
        : 225, //modified by Uddesh

      layout: {
        backgroundColor: 'rgba(76, 175, 80, 0.00)',
        textColor: '#7C7C7C', //#B0B0B0
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          // color: '#363C4E',
          visible: false,
        },
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
    });

    var areaSeries = this.chart.addAreaSeries({
      topColor:
        data[len - 1].value > data[0].value
          ? 'rgba(76, 175, 80, 0.56)'
          : 'rgba(227, 50, 50, 0.56)',
      bottomColor:
        data[len - 1].value > data[0].value
          ? 'rgba(76, 175, 80, 0.04)'
          : 'rgba(227, 50, 50, 0.04)',
      lineColor:
        data[len - 1].value > data[0].value
          ? 'rgba(76, 175, 80, 1)'
          : 'rgba(227, 50, 50, 1)',
      lineWidth: 2,
      // title: this.ccypair,
    });

    // let legend = document.createElement('p');
    // legend.classList.add('legend');
    // legend.style.color = 'var(--table-headers)';
    // legend.style.top = '37px';
    // legend.style.padding = '0';
    // legend.style.margin = '0';
    // legend.style.fontWeight = '400';
    // legend.style.width = 'fit-content';
    // legend.style.zIndex = '2';
    // $('#chartarea').append(legend);

    areaSeries.setData(data);
    this.chart.timeScale().fitContent();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.chart.applyOptions({
      // width: document.getElementById("mainContainer").clientWidth,
      // height: document.getElementById("mainContainer").clientHeight,
      width: window.innerWidth * 0.445,
      height: window.innerHeight * 0.305,
    });
  }
}
