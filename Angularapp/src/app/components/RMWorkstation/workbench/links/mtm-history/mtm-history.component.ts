import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { WorkbenchLinksService } from 'src/app/services/workbench-links.service';

@Component({
  selector: 'app-mtm-history',
  templateUrl: './mtm-history.component.html',
  styleUrls: ['./mtm-history.component.scss'],
})
export class MtmHistoryComponent implements OnInit {
  @Input('NMID') NMID;
  mtmHistoryData: any[] = [];
  mtmHistoryLineChartData: any = [];
  mtmHistoryLineChartDataSeries: any = [];
  mtmHistoryColumnChartData: any = [];
  isLoader: boolean = true;
  mtmHistoryDataTable: any[] = [];
  constructor(
    public workbenchLinksApi: WorkbenchLinksService,
    public datePipe: DatePipe
  ) {
    this.mtmHistoryLineChartDataSeries = [{ name: '', data: [] }];
  }

  ngOnInit(): void {
    this.getMTMHistoryData();
  }
  async getMTMHistoryData() {
    this.mtmHistoryDataTable = await this.workbenchLinksApi.GetMTMHistoryData(
      this.NMID
    );
    this.isLoader = false;
    if (this.mtmHistoryDataTable.length) {
      this.mtmHistoryData = this.mtmHistoryDataTable.reverse();
      const lineChartData = this.mtmHistoryData.map((p, _i) => {
        const obj: any = {};
        obj.x = this.datePipe.transform(p.MTM_Done_at, 'dd-MMM-yy');
        obj.y = parseFloat(p.MTM).toFixed(2);
        return obj;
      });
      this.mtmHistoryLineChartData = [
        ...new Set(lineChartData.map((e) => JSON.stringify(e))),
      ].map((e: string) => JSON.parse(e));

      const max = Math.ceil(
        Math.max(...this.mtmHistoryData.map((e) => parseFloat(e.MTM)))
      );
      const min = Math.floor(
        Math.min(...this.mtmHistoryData.map((e) => parseFloat(e.MTM)))
      );
      console.log("MIN", min)
      console.log("MAX", max)
      let diff = 0.25;
      let p = min;
      let range = [];
      while (p < max) {
        // columnData.push({ p: this.mtmHistoryData.map((p) => p.MTM) });
        const obj = {
          range: p,
          count: this.mtmHistoryData.reduce((iter, e) => {
            if (parseFloat(e.MTM) >= p && parseFloat(e.MTM) < p + diff) {
              iter++;
            } else {
              iter;
            }
            return iter;
          }, 0),
        };
        range.push(obj);
        p = p + diff;
      }
      console.log(range);
      range.forEach(element => {
        element.range += ''
      });
      console.log(range);
      var tempArray = []
      // this.mtmHistoryColumnChartData = array.map(Object.values);
      tempArray = range.map(Object.values)
      // const columnData = range.reduce((it, e) => {
      //   return Object.assign(it, { [e.range]: e.count });
      // }, {});
      //   .map((p) => p.MTM)
      //   .reduce((totals, p) => {
      //     console.log(totals);
      //     p = min + 0.25;
      //     return { ...totals, [p]: totals[p] || 0 };
      //   }, {});
      this.mtmHistoryColumnChartData = tempArray
      console.log(this.mtmHistoryColumnChartData);

      this.mtmHistoryLineChartDataSeries = [
        {
          name: '',
          data: this.mtmHistoryLineChartData,
        },
      ];
      console.log(this.mtmHistoryLineChartData);
    }
  }
}
