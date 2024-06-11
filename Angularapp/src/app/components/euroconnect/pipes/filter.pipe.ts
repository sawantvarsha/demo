import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'searchFilter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) { return []; }
    if (!searchText) { return items; }
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      // return it.toString().toLowerCase().includes(searchText) ||
      // JSON.stringify(it).toLowerCase().includes(searchText)
      // return it.toString().toLowerCase().includes(searchText) ||
      // JSON.stringify(it).toLowerCase().includes(searchText)
      return (
        it.CustomerName.toLowerCase().startsWith(searchText.toLowerCase()) ||
        it.CustomerID.toLowerCase().startsWith(searchText.toLowerCase()) ||
        it.CustomerName.toLowerCase().includes(searchText.toLowerCase()) ||
        it.CustomerID.toLowerCase().includes(searchText.toLowerCase())
        );
    });
  }
}
