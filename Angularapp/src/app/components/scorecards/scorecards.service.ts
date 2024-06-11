import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/services/config.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})


export class ScorecardsService {

  constructor(public http: HttpClient) { }

  interfaceURL = environment.interfaceURL;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  indexSearch: string = '';
  pageNo: number = 1;
  daysInMonth: number = 0;
  rowsperpage: number = 99;
  selectedYear: number = 0;
  selectedMonth: number = 0;
  errorMsg: string = '';
  showError: boolean = false;
  columnTargetValues: columnTarget[] = [];
  filterObj: Object = {};

  asseturl = environment.asseturl;
  filterflag: boolean[] = [];

  months: { month: string; accesskey: string; }[] = [
    {
      month: 'Jan',
      accesskey: 'j'
    },
    {
      month: 'Feb',
      accesskey: 'b'
    },
    {
      month: 'Mar',
      accesskey: 'm'
    },
    {
      month: 'Apr',
      accesskey: 'a'
    },
    {
      month: 'May',
      accesskey: 'y'
    },
    {
      month: 'Jun',
      accesskey: 'u'
    },
    {
      month: 'Jul',
      accesskey: 'l'
    },
    {
      month: 'Aug',
      accesskey: 'g'
    },
    {
      month: 'Sep',
      accesskey: 's'
    },
    {
      month: 'Oct',
      accesskey: 't'
    },
    {
      month: 'Nov',
      accesskey: 'o'
    },
    {
      month: 'Dec',
      accesskey: 'c'
    },
  ]
  
  async CallAPIAsync(apiMethod: string, params: any, httpMethod: MethodType) {
    try {
      const url = AppConfig.settings.apiBaseUrl + apiMethod;
      switch (httpMethod) {
        case 'POST':
          return await this.http.post(url, params).toPromise().then((data:any)=>{
            return data;
          });
        case 'GET':
          return await this.http.get(url).toPromise().then((data:any)=>{
            return data;
          });
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  filterBy(key: any, arr: any[], isAsc, isNaN) {

    if (isNaN) {
      if (isAsc) {
        arr.sort((a, b) => {
          if (a[key] === undefined) {
            return -1;
          }
          if (b[key] === undefined) {
            return 1;
          }

          if (a[key] > b[key]) { return 1; }
          if (a[key] < b[key]) { return -1; }
          return 0;
        });
      } else {
        arr.sort((a, b) => {
          if (a[key] === undefined) {
            return 1;
          }
          if (b[key] === undefined) {
            return -1;
          }
          if (a[key] > b[key]) { return -1; }
          if (a[key] < b[key]) { return 1; }
          return 0;
        });
      }
    } else {
      if (isAsc) {
        arr.sort((a, b) => {
          if (a[key] === undefined) {
            return -1;
          }
          if (b[key] === undefined) {
            return 1;
          }
          return (a[key] === '' ? 0.00 : parseFloat(a[key])) - (b[key] === '' ? 0.00 : parseFloat(b[key]));
        });
      } else {
        arr.sort((a, b) => {
          if (a[key] === undefined) {
            return 1;
          }
          if (b[key] === undefined) {
            return -1;
          }
          // return parseFloat(b[key]) - parseFloat(a[key]);
          return (b[key] === '' ? 0.00 : parseFloat(b[key])) - (a[key] === '' ? 0.00 : parseFloat(a[key]));

        });
      }
    }
  }

  Year_changed(strNexPrev: string, callback) {
    try {
      if (strNexPrev === 'P') {
        this.selectedYear = this.selectedYear - 1;
      } else {
        this.selectedYear = this.selectedYear + 1;
      }
      (callback && typeof callback === 'function') ? callback() : null;
    } catch (error) {
      console.log(error);
    }
  }

  month_changed(index: string, callback) {
    try {
      if (index === 'P') {
        if (this.selectedMonth === 1) {
          this.selectedMonth = 12;
          this.selectedYear = this.selectedYear - 1;
        } else {
          this.selectedMonth = this.selectedMonth - 1;
        }
      } else if (index === 'N') {
        if (this.selectedMonth === 12) {
          this.selectedMonth = 1;
          this.selectedYear = this.selectedYear + 1;
        } else {
          this.selectedMonth = this.selectedMonth + 1;
        }
      } else {
        const idx = this.months.findIndex(ele => ele.accesskey === index);
        this.selectedMonth = idx + 1;
      }
      (callback && typeof callback === 'function') ? callback() : null;
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

  pageIndex_changed(index: string, callback) {
    try {
      if (index == 'P') {
        this.pageNo > 1 ? (this.pageNo = this.pageNo - 1) : null;
      } else {
        this.pageNo = this.pageNo + 1;
      }
      (callback && typeof callback === 'function') ? callback() : null;
    } catch (error) {
      console.log(error);
    }
  }

  ExportToExcel(strNexPrev: string, strFileName: string, strSheetName: string) {
    try {
      const element = document.getElementById(strNexPrev);
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, strSheetName);
      XLSX.writeFile(wb, strFileName);
    } catch (error) {
      console.log(error);
    }
  }

  filterColumn(i: number) {
    try {
      if (!this.filterflag[i]) {
        this.filterflag.fill(false);
        this.filterflag[i] = true;
      }
      else {
        this.filterflag.fill(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // showAscOrder(key, data) {
  //   try {
  //     this.filterBy(key, data, true, true);
  //     this.filterflag[i] = false;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // showDescOrder(i) {
  //   try {
  //     this.filterBy(this.columnTargetValues[i].key, this.eventsData, false, true);
  //     this.filterflag[i] = false;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }


}

export type MethodType = 'POST' | 'GET' | 'PUT' | 'DELETE';
export type columnTarget = { key: string, displayName: string }
