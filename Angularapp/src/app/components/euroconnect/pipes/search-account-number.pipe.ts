import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchAccountNumber'
})
export class SearchAccountNumberPipe implements PipeTransform {

  transform(pipeData, pipeModifier): any {
    try{
    return pipeData.filter(eachItem => {
      return(
        eachItem['accountNumber'].includes(pipeModifier)
    );
    });
  }
  catch(error){
    //console.log("Error:", error);
  }
  }

}
