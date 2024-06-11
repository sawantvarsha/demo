import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform {

    transform(items: any[], jsonKey1: string, jsonKey2: string, searchText: string): any[] {
        // console.log(items, jsonKey, searchText);
        if (!items) { return []; }
        if (!searchText) { return items; }
        if (!searchText.trim()) { return items; }
        // if (searchText.length < 3) { return []; }
        return items.filter(item => {
            // if (item[jsonKey].toLowerCase().startsWith(searchText.toLowerCase())) {
            //   console.log(item[jsonKey].toLowerCase());
            // }
            return item[jsonKey1].toLowerCase().includes(searchText.toLowerCase()) || item[jsonKey2].toLowerCase().includes(searchText.toLowerCase());
        });
    }
}
