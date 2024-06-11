import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchUserGroup'
})
export class SearchUserGroupPipe implements PipeTransform {

  transform(pipeData, pipeModifier, FlagOnEnter = undefined): any {
    try {
      const res = pipeData.filter(eachItem => {
        if (FlagOnEnter === 1) {
          if (eachItem.Code.toLowerCase() === pipeModifier.toLowerCase()) {
            return (
              eachItem.Name.toLowerCase().startsWith(pipeModifier.toLowerCase()) ||
              eachItem.Code.toLowerCase().startsWith(pipeModifier.toLowerCase())
            );
          }
        } else if (FlagOnEnter === undefined) {
          if (pipeModifier === undefined) {
            return (
              eachItem.Name.toLowerCase().startsWith(pipeModifier) ||
              eachItem.Code.toLowerCase().startsWith(pipeModifier)
            );
          } else if (eachItem.Code.toLowerCase() === pipeModifier.toLowerCase()) {
            return (
              eachItem.Name.toLowerCase().startsWith(pipeModifier.toLowerCase()) ||
              eachItem.Code.toLowerCase().startsWith(pipeModifier.toLowerCase())
            );
          } else {
            return (
              eachItem.Name.toLowerCase().startsWith(pipeModifier.toLowerCase()) ||
              eachItem.Code.toLowerCase().startsWith(pipeModifier.toLowerCase())
            );
          }
        }
      });
      const res1 = pipeData.filter(eachItem => {
        if (FlagOnEnter === 1) {
          if (eachItem.Code.toLowerCase() === pipeModifier.toLowerCase()) {
            return (
              eachItem.Name.toLowerCase().includes(pipeModifier.toLowerCase()) ||
              eachItem.Code.toLowerCase().includes(pipeModifier.toLowerCase())
            );
          }
        } else if (FlagOnEnter === undefined) {
          if (pipeModifier === undefined) {
            return (
              eachItem.Name.toLowerCase().includes(pipeModifier) ||
              eachItem.Code.toLowerCase().includes(pipeModifier)
            );
          } else if (eachItem.Code.toLowerCase() === pipeModifier.toLowerCase()) {
            return (
              eachItem.Name.toLowerCase().includes(pipeModifier.toLowerCase()) ||
              eachItem.Code.toLowerCase().includes(pipeModifier.toLowerCase())
            );
          } else {
            return (
              eachItem.Name.toLowerCase().includes(pipeModifier.toLowerCase()) ||
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
