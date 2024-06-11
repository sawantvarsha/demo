import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchNews'
})
export class SearchNewsPipe implements PipeTransform {

  transform(items: any[], jsonKey: string, searchText: string): any[] {
    // console.log(items, jsonKey, searchText);
    if (!items) { return []; }
    if (!searchText) { return items; }
    if (!searchText.trim()) { return items; }
    // if (searchText.length < 3) { return []; }
    return items.filter(item => {
        // if (item[jsonKey].toLowerCase().startsWith(searchText.toLowerCase())) {
        //   console.log(item[jsonKey].toLowerCase());
        // }
        return item[jsonKey].toLowerCase().includes(searchText.toLowerCase());
    });
}

}
