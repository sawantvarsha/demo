import { Pipe, PipeTransform } from '@angular/core';
import { NgStyle } from '@angular/common';

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
  name: 'searchUnderlying'
})
export class SearchUnderlyingPipe implements PipeTransform {

  // tslint:disable-next-line: no-unnecessary-initializer
  transform(pipeData, pipeModifier, FlagOnEnter = undefined): any {
    try {
      const res = pipeData.filter(eachItem => {
        if (FlagOnEnter === 1) {
          if (eachItem.Code.toLowerCase() === pipeModifier.toLowerCase()) {
            return (
              eachItem.LongName.toLowerCase().startsWith(pipeModifier.toLowerCase()) ||
              eachItem.Code.toLowerCase().startsWith(pipeModifier.toLowerCase())
            );
          }
        } else if (FlagOnEnter === undefined) {
          if (pipeModifier === undefined) {
            return (
              eachItem.LongName.toLowerCase().startsWith(pipeModifier) ||
              eachItem.Code.toLowerCase().startsWith(pipeModifier)
            );
          } else if (eachItem.Code.toLowerCase() === pipeModifier.toLowerCase()) {
            return (
              eachItem.LongName.toLowerCase().startsWith(pipeModifier.toLowerCase()) ||
              eachItem.Code.toLowerCase().startsWith(pipeModifier.toLowerCase())
            );
          } else {
            return (
              eachItem.LongName.toLowerCase().startsWith(pipeModifier.toLowerCase()) ||
              eachItem.Code.toLowerCase().startsWith(pipeModifier.toLowerCase())
            );
          }
        }
      });
      const res1 = pipeData.filter(eachItem => {
        if (FlagOnEnter === 1) {
          if (eachItem.Code.toLowerCase() === pipeModifier.toLowerCase()) {
            return (
              eachItem.LongName.toLowerCase().includes(pipeModifier.toLowerCase()) ||
              eachItem.Code.toLowerCase().includes(pipeModifier.toLowerCase())
            );
          }
        } else if (FlagOnEnter === undefined) {
          if (pipeModifier === undefined) {
            return (
              eachItem.LongName.toLowerCase().includes(pipeModifier) ||
              eachItem.Code.toLowerCase().includes(pipeModifier)
            );
          } else if (eachItem.Code.toLowerCase() === pipeModifier.toLowerCase()) {
            return (
              eachItem.LongName.toLowerCase().includes(pipeModifier.toLowerCase()) ||
              eachItem.Code.toLowerCase().includes(pipeModifier.toLowerCase())
            );
          } else {
            return (
              eachItem.LongName.toLowerCase().includes(pipeModifier.toLowerCase()) ||
              eachItem.Code.toLowerCase().includes(pipeModifier.toLowerCase())
            );
          }
        }
      });
      return res.concat(res1).unique();

    } catch (error) {
      //console.log('Error:', error);
    }
  }
}
