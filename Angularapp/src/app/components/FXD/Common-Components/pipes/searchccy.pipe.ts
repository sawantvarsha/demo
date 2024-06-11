import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchccy'
})
export class SearchccyPipe implements PipeTransform {
  transform(pipeData, pipeModifier): any {
    try {
      // Asset_Pair => asset_Pair lowercase converted by Urmila A | 30-Aug-23 | As service side mapping changed to lowercase
      return pipeData.filter(eachItem => {
          if (eachItem['asset_Pair'].toLowerCase().replace('-','').replace(/ /g,'').includes(pipeModifier.toLowerCase().replace('-','').replace(/ /g,''))) {
            return ( eachItem );
          }       
      });
    }
    catch (error) {
    }
  }

}
