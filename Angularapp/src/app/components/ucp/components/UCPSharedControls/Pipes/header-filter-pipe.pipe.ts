import { Pipe, PipeTransform } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
//import { isNullOrUndefined } from 'util';

@Pipe({
  name: 'headerFilter'
})
export class HeaderFilterPipe implements PipeTransform {

  transform(tblData: any[], searchText: string, columnName: string, filterOption: string, isDate: boolean): any {
    console.log(columnName)
    if (tblData != null && searchText != null && searchText != "") {
      if (filterOption === 'like') {
       // tblData = tblData.filter(x => (!isNullOrUndefined(x[columnName]) ? x[columnName] : '').toString().toLowerCase().includes(searchText.trim().toLowerCase()));
      } else if (filterOption === 'exact') {
        //tblData = tblData.filter(x => (!isNullOrUndefined(x[columnName]) ? x[columnName] : '').toString().toLowerCase() === searchText.trim().toLowerCase());
      } else if (filterOption === 'less_than') {
        if (isDate) {
         // tblData = tblData.filter(x => (!isNullOrUndefined(x[columnName]) ? new Date(x[columnName]) : 0) < new Date(searchText));
        } else {
         // tblData = tblData.filter(x => (!isNullOrUndefined(x[columnName]) ? +x[columnName] : 0) < +searchText);
        }
      } else if (filterOption === 'greater_than') {
        if (isDate) {
          //tblData = tblData.filter(x => (!isNullOrUndefined(x[columnName]) ? new Date(x[columnName]) : 0) > new Date(searchText));
        } else {
          //tblData = tblData.filter(x => (!isNullOrUndefined(x[columnName]) ? +x[columnName] : 0) > +searchText);
        }
      }
    }
    return tblData;
  }
}
