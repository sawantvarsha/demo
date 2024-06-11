import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(pipeData, pipeModifier, searchType): any {
    try {
      const filtered = pipeData.filter((eachItem) => {
        return eachItem[searchType]
          .toLowerCase()
          .includes(pipeModifier.toLowerCase());
      });
      const unique = [];
      filtered.forEach((i) => {
        if (!unique.includes(i[searchType])) {
          unique.push(i[searchType]);
        }
      });
      // //console.log(unique);
      return unique;
    } catch (error) {
      //console.log('Error:', error);
    }
  }
}
