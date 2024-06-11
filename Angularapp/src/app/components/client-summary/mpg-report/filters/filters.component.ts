import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
// import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
import { WorkflowApiService } from '../../../../services/workflow-api.service';



export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

export interface PeriodicElement {
  name: string;
  position: number;
}



@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  // providers: [

  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  //   },

  //   { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  // ],

})
export class FiltersComponent implements OnInit {

  @Output() expandedChange: EventEmitter<any> = new EventEmitter();
  @Input() expanded: any


  searchText = '';
  classApplied = true;
  toggle: any;

  BlotterDataColumnHeader: any;

  txtFilterSearch = '';
  showFilter: boolean;

  constructor(public apifunction: WorkflowApiService) { }

  BlotterDataColumnHeader1: (string | boolean)[][] = [];
  headerColumnData: (string | boolean)[][] = [];


  ngOnInit(): void {
    this.showFilter = false;

    try {

      this.apifunction.BlotterDataColumnHeaderObserver.subscribe((res: any) => {
        if (res) {
          this.BlotterDataColumnHeader = res;

          this.headerColumnData = [];
          // console.log(this.apifunction.BlotterDataRowsCopy[0]);
          // console.log(this.BlotterDataColumnHeader[0]);

          if (this.apifunction.BlotterDataRowsCopy && this.apifunction.BlotterDataRowsCopy.length > 0) {
            this.apifunction.BlotterDataRowsCopy.forEach((element: any) => {
              for (const [key, value] of Object.entries(element)) {
                var brkFlg = false;
                if (`${key}` === this.BlotterDataColumnHeader[0][0]) {

                  if (this.searchForArray(this.headerColumnData, [`${value}`, false]) == -1) {
                    this.headerColumnData.push([`${value}`, false])
                  }
                  brkFlg = true;
                  break;
                }
                if (brkFlg) {
                  break;
                }
              }

            })
          }

          // console.log(this.headerColumnData);
        }
      });

      this.apifunction.setFilterToggleObserver.subscribe((res: boolean) => { 
        console.log(res);
        this.toggle = res })
    }
    catch (error) {
      console.log(error);
    }
  }

  allClick() {
    try {
      // this.toggle=true;
      this.toggle = false;
      this.apifunction.setBlotterData(this.apifunction.BlotterDataRowsCopy);
      this.BlotterDataColumnHeader.forEach((item: boolean[]) => item[1] = false);

      this.headerColumnData.forEach((item: boolean[]) => item[1] = false);

    }
    catch (error) {
      console.log(error);
    }
  }
  chkBoxClick(headerItem: any, checked: any) {
    try {
      // this.toggle=false;
      this.toggle = true;
      this.classApplied = !this.classApplied;
      var index = this.BlotterDataColumnHeader.findIndex((item: any) => item === headerItem);
      this.BlotterDataColumnHeader.forEach((item: boolean[]) => item[1] = false);


      this.BlotterDataColumnHeader[index][1] = !checked; //true;
      if (headerItem[0] == 'All' && headerItem[1] == true) {
        this.apifunction.setBlotterData(this.apifunction.BlotterDataRowsCopy);
      }

      /*
      this.headerColumnData = [];
  
      this.apifunction.BlotterDataRowsCopy.forEach((element: any) => {
        for (const [key, value] of Object.entries(element)) {
          var brkFlg = false;
          if (`${key}` === headerItem[0]) {
            
            if (this.searchForArray(this.headerColumnData, [`${value}`, false]) == -1) {
              this.headerColumnData.push([`${value}`, false])
             
            }
            brkFlg = true;
            break;
          }
          if (brkFlg) {
            break;
          }
        }
  
      })
      */

    }
    catch (error) {
      console.log(error);
    }
  }
  chkBoxClickStage2(headerItem: any, checked: any) {
    try {

      var index = this.headerColumnData.findIndex((item: any) => item === headerItem);

      this.headerColumnData[index][1] = !checked;

      if (this.headerColumnData.findIndex(item => item[1] == true) == -1) {
        this.apifunction.setBlotterData(this.apifunction.BlotterDataRowsCopy);
        return;
      }
      this.filterBlotterDataRows();
    }
    catch (error) {
      console.log(error);
    }
  }

  filterBlotterDataRows() {
    try {
      var key = this.BlotterDataColumnHeader[this.BlotterDataColumnHeader.findIndex((item: boolean[]) => item[1] == true)][0];
      var valueArr = this.headerColumnData.filter(item => item[1] == true);
      var BlotterDataRows = [];
      this.apifunction.BlotterDataRowsCopy.filter(item => {
        if (this.searchForArray(valueArr, [item[key], true]) > -1) {
          BlotterDataRows.push(item);
        }
      });
      this.apifunction.setBlotterData(BlotterDataRows);
    }
    catch (error) {
      console.log(error);
    }
  }
  searchForArray(haystack: string | any[], needle: string | any[]) {
    try {
      var i, j, current;
      for (i = 0; i < haystack.length; ++i) {
        if (needle.length === haystack[i].length) {
          current = haystack[i];
          for (j = 0; j < needle.length && needle[j] === current[j]; ++j);
          if (j === needle.length)
            return i;
        }
      }
      return -1;
    }
    catch (error) {
      console.log(error);
    }
  }
  replaceChar(str: any) {
    try {
      return (str.toString().replace(/_x0020_/g, ' '));
    } catch (error) {
      console.log(error);
    }
  }
  onKeydownFilter() {
    try {
      console.log('onKeydownFilter:' + this.txtFilterSearch);
      this.BlotterDataColumnHeader[0][1] = true;
    }
    catch (error) {
      console.log(error);
    }
  }
  toggleFilter() {
    this.showFilter = !this.showFilter;
    console.log(this.expanded)
    if (this.showFilter === false){
      if(this.expanded.isMenu === false){
        this.expandedChange.emit({isMPG : true, isFilter: false, isMenu: false});
      } else{
        this.expandedChange.emit({isMPG : true, isFilter: false, isMenu: true});
      }
    }
    else {
      if(this.expanded.isMenu === false){
        this.expandedChange.emit({isMPG : true, isFilter: true, isMenu: false});
      } else{
        this.expandedChange.emit({isMPG : true, isFilter: true, isMenu: true});
      }
    }
    // this.expandedChange.emit({isMPG : true, isFilter: false, isMenu: true});
    // console.log(this.expanded);
  }
}
