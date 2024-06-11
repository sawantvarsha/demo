import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipeNew implements PipeTransform {

  transform(list: any[], filters: Object): any {
    try {
      const keys = Object.keys(filters).filter(key => filters[key]);

      // const filterRecords = record => keys.every(key => 
      //   record[key]?.toLowerCase().includes(filters[key].toLowerCase())
      //   );
      const filterRecords = record => keys.every(key => 
        record[key].toLowerCase().includes(filters[key].toLowerCase())
        );

      return keys.length ? list.filter(filterRecords) : list;
    }
    catch (error) {
//console.log('Error:', error);
    }
  }

}
