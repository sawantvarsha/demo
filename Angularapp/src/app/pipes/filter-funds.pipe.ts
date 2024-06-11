import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterFunds'
})
export class FilterFundsPipe implements PipeTransform {

  transform(pipeData, pipeModifier, FlagOnEnter): any {
    try {
      return pipeData.filter(eachItem => {
        if (FlagOnEnter === 1) {
          if (eachItem.Name.toLowerCase() === pipeModifier.toLowerCase()) {
            return (
              eachItem.Name.toLowerCase().includes(pipeModifier.toLowerCase())
            );
          }
        } else if (FlagOnEnter === undefined) {
          return (
            eachItem.Name.toLowerCase().includes(pipeModifier.toLowerCase())
          );
        }
      });
    } catch (error) {
//console.log('Error:', error);
    }
  }
}
