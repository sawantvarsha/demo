import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventSearchPipe'
})
export class EventSearchPipe implements PipeTransform {

  transform(value: any, args?: any[]): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      let rVal = ((val.Note_Master_Id.toLocaleLowerCase().includes(args))
        || (val.Product_Name.toLocaleLowerCase().includes(args))
        || (val.Template_Name.toLocaleLowerCase().includes(args))
        || (val.Asset.toLocaleLowerCase().includes(args))
        || (val.Client_response_applicable.toLocaleLowerCase().includes(args))
        || (val.Announcement_Date.toLocaleLowerCase().includes(args))
        || (val.Record_Date.toLocaleLowerCase().includes(args))
        || (val.Response_Date.toLocaleLowerCase().includes(args)));
      return rVal;
    })
  }

}