// import { Pipe, PipeTransform } from '@angular/core';
// // import { EROFS } from 'constants';

// @Pipe({
//   name: 'searchUnderlying'
// })
// export class SearchUnderlyingPipe implements PipeTransform {

//   transform(pipeData, pipeModifier): any {
//     try {
//       return pipeData.filter(eachItem => {
//         return (
//           eachItem['LongName'].toLowerCase().includes(pipeModifier.toLowerCase()) ||
//           eachItem['Code'].toLowerCase().includes(pipeModifier.toLowerCase())
//         );
//       });
//     } catch (error) {
//       // throw new Error(error.name);
//       //console.log(error.name);
//     }
//   }
// }

import { Pipe, PipeTransform } from '@angular/core';
// import { EROFS } from 'constants';

@Pipe({
  name: 'searchUnderlying'
})
export class SearchUnderlyingPipe implements PipeTransform {

  transform(pipeData, pipeModifier, FlagOnEnter): any {
    try {
      return pipeData.filter(eachItem => {
        // //console.log(FlagOnEnter);
        // //console.log(eachItem['Code'] + ' : ' + eachItem['Code'].toLowerCase().includes(pipeModifier.toLowerCase()));
        if (FlagOnEnter === 1) {
          if (eachItem['Code'].toLowerCase() === pipeModifier.toLowerCase()) {
            return (
              eachItem['LongName'].toLowerCase().includes(pipeModifier.toLowerCase()) ||
              eachItem['Code'].toLowerCase().includes(pipeModifier.toLowerCase())
            );
          }
        } else if (FlagOnEnter === undefined) {
          return (
            eachItem['LongName'].toLowerCase().includes(pipeModifier.toLowerCase()) ||
            eachItem['Code'].toLowerCase().includes(pipeModifier.toLowerCase())
          );
        }
      });
    }
    catch (error) {
      //console.log("Error:", error);
    }
  }
}
