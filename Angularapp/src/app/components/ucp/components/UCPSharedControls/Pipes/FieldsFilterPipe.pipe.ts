import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fieldSearch' })
export class FieldsFilterPipe implements PipeTransform {
  public transform(fields: any[], searchText: any, mode: string): any {
    if (searchText == null || fields == null) {
      return fields;
    }
    if (mode === "SelectedTab") {
      return fields.filter(field => field.Display_Name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    } else if (mode === "WFL") {
      return fields.filter(field => field.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    } else if(mode === "UserGroup"){
      return fields.filter(field => field.Data_Value.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    } else if(mode === "VisibilityMap"){
      return fields.filter(field => field.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    } else if(mode === "UserGroupWF"){
	  return fields.filter(field => field.U_Id.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    }
  }
}