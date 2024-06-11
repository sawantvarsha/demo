import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'securitySearch',
  pure: false,
})
export class SecuritySearchPipe implements PipeTransform {
  transform(list: any[], filter: string, type: string): any {
    try {
      if (type == 'portfolio') {
        list = list.filter((it) => {
          return it.LongName.toLowerCase().includes(filter.toLowerCase());
        });
      } else if (type == 'indices') {
        list = list.filter((it) => {
          return it.SA_Long_Name.toLowerCase().includes(filter.toLowerCase());
        });
      }

      return list.length ? list : [];
    } catch (error) {
      //console.log('Error:', error);
    }
  }
}
