import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dropdownTypeFilter'
})
export class DropdownTypeFilterPipe implements PipeTransform {

  transform(dropdownValues: any[], type: any): any {
    if (!dropdownValues) { return []; }
    if (!dropdownValues.length) { return []; }
    if (!type) { return []; }
    try {
//console.log(dropdownValues.filter((d) => d.filter === type).map((d) => d.data)[0]);
      return dropdownValues.filter((d) => d.filter === type).map((d) => d.data)[0] || [];
    } catch (error) {
//console.error(error);
    }
  }

}
