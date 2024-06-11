import { Component, OnInit } from '@angular/core';
import { ScorecardsService, columnTarget } from '../scorecards.service';

@Component({
  selector: 'app-kidistance',
  templateUrl: './kidistance.component.html',
  styleUrls: ['./kidistance.component.scss']
})

export class KIDistanceComponent implements OnInit {

  constructor(public fastFrontendService: ScorecardsService) { }

  eventsData: any[] = [];
  columnTargetValues: columnTarget[] = [];

  asseturl = this.fastFrontendService.asseturl;

  pageloadflag: boolean;

  async ngOnInit(): Promise<void> {
    this.fastFrontendService.indexSearch = '';
    this.fastFrontendService.selectedYear = new Date().getUTCFullYear();
    this.fastFrontendService.selectedMonth = new Date().getUTCMonth() + 1;
    this.fastFrontendService.pageNo = 1;
    await this.IndexMaster();
  }

  GenerateTableHeaders(len: number) {
    try {
      this.columnTargetValues = new Array();
      this.fastFrontendService.filterflag = new Array((len+2));
      this.fastFrontendService.filterflag.fill(false);
      this.columnTargetValues.push({ key: 'iM_Index_Code', displayName: 'ISIN/Ref No' });
      this.fastFrontendService.filterObj["iM_Index_Code"] = "";
      for (let i = 1; i <= len; i++) {
        this.columnTargetValues.push({ key: `p${i}`, displayName: i.toString() });
        this.fastFrontendService.filterObj[`P${i}`] = "";
      }
      this.columnTargetValues.push({ key: 'product', displayName: 'Product' });
      this.fastFrontendService.filterObj["product"] = "";
    } catch (error) {
      console.log(error);
    }
  }

  async IndexMaster() {
    try {
      this.fastFrontendService.errorMsg = '';
      this.fastFrontendService.showError = false;
      this.pageloadflag = true;
      this.fastFrontendService.daysInMonth = Number(new Date(this.fastFrontendService.selectedYear, this.fastFrontendService.selectedMonth, 0).getDate());
      this.GenerateTableHeaders(this.fastFrontendService.daysInMonth);
      const params = {
       "Filter": this.fastFrontendService.indexSearch,
       "MutationField": "KIDistance",
       "RowsPerPage": this.fastFrontendService.rowsperpage,
       "PageNo": this.fastFrontendService.pageNo,
       "MonthNo": this.fastFrontendService.selectedMonth,
       "Year": this.fastFrontendService.selectedYear,
       "strProduct": "",
	   "strSP": "USP_Get_Distance_PivotedMonthlyView"
      }
      
      const apiMethod = `Scorecards/GetFastViewsMontlyGridDatasp`;
      const data = await this.fastFrontendService.CallAPIAsync(apiMethod, params, 'POST');
       
      if (data) {
        this.eventsData = [];
        this.fastFrontendService.errorMsg = '';
        this.fastFrontendService.showError = false;
        this.eventsData = this.eventsData.concat(data);
        this.fastFrontendService.filterflag.fill(false);
        this.fastFrontendService.filterObj = {};
      } else {
        this.fastFrontendService.showError = true;
        this.fastFrontendService.errorMsg = `No records found.`
      }
      
      this.pageloadflag = false;
    } catch (error) {
      console.log(error);
    }
  }

  Year_changed(strNexPrev: string) {
    try {
      this.fastFrontendService.Year_changed(strNexPrev, () => this.IndexMaster());
    } catch (error) {
      console.log(error);
    }
  }

  month_changed(index: string) {
    try {
      this.fastFrontendService.month_changed(index, this.IndexMaster.bind(this));
    } catch (error) {
      console.log(error);
    }
  }

  HideTable(strNexPrev: string) {
    try {
      console.log(strNexPrev);
    } catch (error) {
      console.log(error);
    }
  }

  pageIndex_changed(index: string) {
    try {
      this.fastFrontendService.pageIndex_changed(index, this.IndexMaster.bind(this));
    } catch (error) {
      console.log(error);
    }
  }

  ExportToExcel(strNexPrev: string) {
    try {
      const monthName: string = this.fastFrontendService.months[this.fastFrontendService.selectedMonth - 1].month;
      const fileName = `KIDistance_${monthName}_${this.fastFrontendService.selectedYear}.xlsx`;
      this.fastFrontendService.ExportToExcel(strNexPrev, fileName, monthName);
    } catch (error) {
      console.log(error);
    }
  }

  filterColumn(i: number) {
    try {
      this.fastFrontendService.filterColumn(i);
    } catch (error) {
      console.log(error);
    }
  }

  showAscOrder(i) {
    try {
      this.fastFrontendService.filterBy(this.columnTargetValues[i].key, this.eventsData, true, true);
      this.fastFrontendService.filterflag[i] = false;
    } catch (error) {
      console.log(error);
    }
  }

  showDescOrder(i) {
    try {
      this.fastFrontendService.filterBy(this.columnTargetValues[i].key, this.eventsData, false, true);
      this.fastFrontendService.filterflag[i] = false;
    } catch (error) {
      console.log(error);
    }
  }


}
