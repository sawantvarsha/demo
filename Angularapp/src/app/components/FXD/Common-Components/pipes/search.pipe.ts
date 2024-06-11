import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class FXDSearchPipe implements PipeTransform {


  transform(pipeData: any[], pipeModifier: string, jsonKey: string): any {
    try {
//console.log(pipeModifier);
      return pipeData.filter(item => {
      return (
            item[jsonKey].toLowerCase().includes(pipeModifier.toLowerCase())
          );
      })
    } catch (error) {
//console.log('error', error);
    }
  }

}
