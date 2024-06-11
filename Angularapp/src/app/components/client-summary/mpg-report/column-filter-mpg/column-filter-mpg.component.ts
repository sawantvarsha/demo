import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { isNullOrUndefined } from 'is-what';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';

@Component({
  selector: 'app-column-filter-mpg',
  templateUrl: './column-filter-mpg.component.html',
  styleUrls: ['./column-filter-mpg.component.scss']
})
export class ColumnFilterMpgComponent implements OnInit {

  @Input() colName = ''
  @Input() colNo = 1
  @Input() left = ''
  @Input() top = ''
  @Input() BlotterDataRowsCopy = []
  @Input() BlotterDataRows = []
  @Input() BlotterDataColumnHeader = []
  @Input() filterkey = ''
  @Output() tableFiltered = new EventEmitter<any>();
  sortAsc: boolean = true


  placeholder = 'Search'
  searchToken: any;

  constructor( private apifunction: WorkflowApiService) { }

  ngOnInit(): void {
    if(this.apifunction.filterTable.find(x=>x.columnName === this.filterkey)){
      let idx = this.apifunction.filterTable.findIndex(x=>x.columnName === this.filterkey)
      this.searchToken = this.apifunction.filterTable[idx].filterTerm
    }
    // this.searchToken = ''
    // console.log('filterkey--',this.filterkey)
    // this.placeholder = this.placeholder + ' '+this.colName
  }

  ngOnChanges() {
    // this.searchToken = ''
    this.placeholder = ''
    this.placeholder = 'Search ' + this.colName
  }

  filter() {
    this.BlotterDataRows = this.BlotterDataRowsCopy.filter(x => x[this.filterkey].toString().includes(this.searchToken)) // Changed by Mitali D - 14-06-2023 - FIN1EURINT-422
    this.tableFiltered.emit(this.BlotterDataRows)
    if(this.searchToken.length){
      if(!this.apifunction.filterActive.includes(this.colName)){
        this.apifunction.filterActive.push(this.colName)
      }
    }
    let idx = this.apifunction.filterTable.findIndex(x=>x.columnName === this.filterkey)
    this.apifunction.filterTable[idx].filterTerm = this.searchToken
    console.log('filtered--', this.BlotterDataRows)
  }

  clearFilter() {
    this.searchToken = ''
    let idx = this.apifunction.filterTable.findIndex(x=>x.columnName === this.filterkey)
    this.apifunction.filterTable[idx].filterTerm = this.searchToken
    this.BlotterDataRows = []
    
    if(this.apifunction.filterActive.includes(this.colName)){
      const index = this.apifunction.filterActive.indexOf(this.colName);
      if (index > -1) { 
        this.apifunction.filterActive.splice(index, 1); 
      }
    }

    //check if any other filters are active and reapply them
    let active = this.apifunction.filterTable.find(x=> x.filterTerm.length)
    this.BlotterDataRows = this.BlotterDataRowsCopy
    if(active){
      this.apifunction.filterTable.forEach(element => {
        if(element.filterTerm.length){
          this.BlotterDataRows = this.BlotterDataRows.filter(x => x[element.columnName].toString() === element.filterTerm)
        }
      });
    }
    this.tableFiltered.emit(this.BlotterDataRows)
    console.log('filtered--', this.BlotterDataRows)
  }

  sort() {
   
    let x = this.BlotterDataRows.find(x=> !isNullOrUndefined(x[this.filterkey])) 
    if(x){
      let sorted = []
      if(this.isNumeric(x[this.filterkey])){
        sorted = this.sortNumbers(this.BlotterDataRows,this.filterkey,x[this.filterkey])
      }
      else if(this.isDate(x[this.filterkey])){
        sorted = this.sortDates(this.BlotterDataRows,this.filterkey)
      }
      else{
        sorted = this.sortStrings(this.BlotterDataRows,this.filterkey)
      }

      if(sorted.length){
        this.BlotterDataRows = []
        this.BlotterDataRows = sorted
      }

      this.sortAsc = !this.sortAsc
      this.tableFiltered.emit(this.BlotterDataRows)
      console.log('sorted--', this.BlotterDataRows)
    }
    
  }

  sortStrings(array, key) {
    if (this.sortAsc) {
      array.sort(function (a, b) {
        const A = a[key].toUpperCase();
        const B = b[key].toUpperCase();
        if (A > B) {
          return -1;
        }
        if (A < B) {
          return 1;
        }
        return 0;
      });
    }
    else if (!this.sortAsc) {
      array.sort(function (a, b) {
        const A = a[key].toUpperCase();
        const B = b[key].toUpperCase();
        if (A < B) {
          return -1;
        }
        if (A > B) {
          return 1;
        }
        return 0;
      });
    }


    return array;
  }

  sortNumbers(array, key,filterterm) {

    if(typeof filterterm === 'string' ){
      if (this.sortAsc) {
        array.sort((r1, r2) => ( parseFloat(r1[key].replace(/,/g, ''))  > parseFloat(r2[key].replace(/,/g, ''))) ? 1 : (parseFloat(r1[key].replace(/,/g, '')) < parseFloat(r2[key].replace(/,/g, ''))) ? -1 : 0)
      }
      else if (!this.sortAsc) {
        array.sort((r1, r2) => (parseFloat(r1[key].replace(/,/g, '')) < parseFloat(r2[key].replace(/,/g, ''))) ? 1 : (parseFloat(r1[key].replace(/,/g, '')) > parseFloat(r2[key].replace(/,/g, ''))) ? -1 : 0)
      }

    }
    else{
      if (this.sortAsc) {
        array.sort((r1, r2) => ( parseFloat(r1[key])  > parseFloat(r2[key])) ? 1 : (parseFloat(r1[key]) < parseFloat(r2[key])) ? -1 : 0)
      }
      else if (!this.sortAsc) {
        array.sort((r1, r2) => (parseFloat(r1[key]) < parseFloat(r2[key])) ? 1 : (parseFloat(r1[key]) > parseFloat(r2[key])) ? -1 : 0)
      }

    }

   

    return array;
  }

  sortDates(array, key) {
    if (this.sortAsc) {
      array.sort((x, y) => {
        x = new Date(x[key]),
        y = new Date(y[key]);
        return x - y;
      });
    }
    else if (!this.sortAsc) {
      array.sort((x, y) => {
        x = new Date(x[key]),
        y = new Date(y[key]);
        return y - x;
      });
    }
    return array;
  }

  isNumeric(str: any) {
    return !isNaN(str) && !isNaN(parseFloat(str)) || !isNaN(str.replace(/,/g, ''))
  }

  isDate(sDate) {  
    if(sDate.toString() == parseInt(sDate).toString()) return false; 
    let tryDate:any = new Date(sDate);
    return (tryDate && tryDate.toString() != "NaN" && tryDate != "Invalid Date");  
  }


}
