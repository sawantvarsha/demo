import { Pipe, PipeTransform } from '@angular/core';

declare global {
  interface Array<T> {
    unique(p): Array<T>;
  }
}
Array.prototype.unique = function() {
  const a = this.concat();
  for (let i = 0; i < a.length; ++i) {
      for (let j = i + 1; j < a.length; ++j) {
          if (a[i] === a[j]) {
              a.splice(j--, 1);
          }
      }
  }

  return a;
}; 


@Pipe({
  name: 'searchunderlying'
})
export class SearchunderlyingPipe implements PipeTransform {
  
  transform(pipeData, pipeModifier, FlagOnEnter = undefined): any {
    try {
      if(pipeModifier.length >= 3){
      // const res = pipeData.filter(eachItem => {
      //   if (FlagOnEnter === 1) {
      //     if (eachItem.Code.toLowerCase() === pipeModifier.toLowerCase()) {
      //       return (
      //         eachItem.LongName.toLowerCase().startsWith(pipeModifier.toLowerCase()) ||
      //         eachItem.Code.toLowerCase().startsWith(pipeModifier.toLowerCase())
      //       );
      //     }
      //   } else if (FlagOnEnter === undefined) {
      //     if (pipeModifier === undefined) {
      //       return (
      //         eachItem.LongName.toLowerCase().startsWith(pipeModifier) ||
      //         eachItem.Code.toLowerCase().startsWith(pipeModifier)
      //       );
      //     } else if (eachItem.Code.toLowerCase() === pipeModifier.toLowerCase()) {
      //       return (
      //         eachItem.LongName.toLowerCase().startsWith(pipeModifier.toLowerCase()) ||
      //         eachItem.Code.toLowerCase().startsWith(pipeModifier.toLowerCase())
      //       );
      //     } else {
      //       return (
      //         eachItem.LongName.toLowerCase().startsWith(pipeModifier.toLowerCase()) ||
      //         eachItem.Code.toLowerCase().startsWith(pipeModifier.toLowerCase())
      //       );
      //     }
      //   }
      // });
      // const res1 = pipeData.filter(eachItem => {
      //   if (FlagOnEnter === 1) {
      //     if (eachItem.Code.toLowerCase() === pipeModifier.toLowerCase()) {
      //       return (
      //         eachItem.LongName.toLowerCase().includes(pipeModifier.toLowerCase()) ||
      //         eachItem.Code.toLowerCase().includes(pipeModifier.toLowerCase())
      //       );
      //     }
      //   } else if (FlagOnEnter === undefined) {
      //     if (pipeModifier === undefined) {
      //       return (
      //         eachItem.LongName.toLowerCase().includes(pipeModifier) ||
      //         eachItem.Code.toLowerCase().includes(pipeModifier)
      //       );
      //     } else if (eachItem.Code.toLowerCase() === pipeModifier.toLowerCase()) {
      //       return (
      //         eachItem.LongName.toLowerCase().includes(pipeModifier.toLowerCase()) ||
      //         eachItem.Code.toLowerCase().includes(pipeModifier.toLowerCase())
      //       );
      //     } else {
      //       return (
      //         eachItem.LongName.toLowerCase().includes(pipeModifier.toLowerCase()) ||
      //         eachItem.Code.toLowerCase().includes(pipeModifier.toLowerCase())
      //       );
      //     }
      //   }
      // });
      //<Sudarshan | 17-Jul-2023 | User reported share search is not clear |priority given BBG Code-RIC Code-Long name >
      const res = pipeData.filter(eachItem => {
        if (FlagOnEnter === 1) {
          if (eachItem.BloombergCode.toLowerCase() === pipeModifier.toLowerCase()) {
            return (
              eachItem.BloombergCode.toLowerCase().startsWith(pipeModifier.toLowerCase()) //|| 
              //eachItem.LongName.toLowerCase().includes(pipeModifier.toLowerCase()) 
              
            );
          }
        } else if (FlagOnEnter === undefined) {
          if (pipeModifier === undefined) {
            return (
              eachItem.BloombergCode.toLowerCase().startsWith(pipeModifier) //||
             // eachItem.LongName.toLowerCase().includes(pipeModifier)
            );
          } else if (eachItem.BloombergCode.toLowerCase() === pipeModifier.toLowerCase()) {
            return (
              eachItem.BloombergCode.toLowerCase().startsWith(pipeModifier.toLowerCase()) //||
              //eachItem.LongName.toLowerCase().includes(pipeModifier.toLowerCase())
            );
          } else {
            return (
              eachItem.BloombergCode.toLowerCase().startsWith(pipeModifier.toLowerCase()) //||
              //eachItem.LongName.toLowerCase().includes(pipeModifier.toLowerCase())
            );
          }
        }
      });
      const res1 = pipeData.filter(eachItem => {
        if (FlagOnEnter === 1) {
          if (eachItem.Code.toLowerCase() === pipeModifier.toLowerCase()) {
            return (
              eachItem.Code.toLowerCase().startsWith(pipeModifier.toLowerCase()) ||
              eachItem.LongName.toLowerCase().includes(pipeModifier.toLowerCase())
            );
          }
        } else if (FlagOnEnter === undefined) {
          if (pipeModifier === undefined) {
            return (
              eachItem.Code.toLowerCase().startsWith(pipeModifier) ||
              eachItem.LongName.toLowerCase().includes(pipeModifier)
            );
          } else if (eachItem.Code.toLowerCase() === pipeModifier.toLowerCase()) {
            return (
              eachItem.Code.toLowerCase().startsWith(pipeModifier.toLowerCase()) ||
              eachItem.LongName.toLowerCase().includes(pipeModifier.toLowerCase())
            );
          } else {
            return (
              eachItem.Code.toLowerCase().startsWith(pipeModifier.toLowerCase()) ||
              eachItem.LongName.toLowerCase().includes(pipeModifier.toLowerCase())
            );
          }
        }
      });
      //</Sudarshan | 17-Jul-2023 | User reported share search is not clear |priority given BBG Code-RIC Code-Long name >
      return res.concat(res1).unique();
    }

    } catch (error) {
      //console.log('Error:', error);
    }
  }
  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }

}
