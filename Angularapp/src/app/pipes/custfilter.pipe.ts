import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'custfilter'
})
export class CustfilterPipe implements PipeTransform {

  transform(items: any[], value: any): any {
    console.log(items, value);
    if (items.length > 0 && value !== '') {
      return items.filter(c => c.CustomerGroup.toLowerCase().includes(value.toLowerCase()));
    } else {
      return items;
    }
  }

}
