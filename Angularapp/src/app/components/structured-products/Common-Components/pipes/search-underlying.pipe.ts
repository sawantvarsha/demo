import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchUnderlying'
})
export class SearchUnderlyingPipe implements PipeTransform {
  transform(pipeData, pipeModifier, FlagOnEnter): any {
    try {
      return pipeData.filter(eachItem => {
        if (FlagOnEnter === 1) {
          if (eachItem['LongName'].toLowerCase().includes(pipeModifier.toLowerCase())) {
            return ( eachItem );
          }
        } else if (FlagOnEnter === undefined) {
          if (eachItem['LongName'].toLowerCase().includes(pipeModifier.toLowerCase())) {
            return ( eachItem );
          }
        }
      });
    }
    catch (error) {
    }
  }
}
