import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'customersearchclientsummary'
})
export class CustomersearchclientsummaryPipe implements PipeTransform {
  transform(CustomerList: any, searchName: string): any[] {
    if (CustomerList.length > 0 && searchName !== '') {
      // return CustomerList.filter(Customer => Customer.LongName.toLowerCase().startsWith(searchName.toLowerCase()));
      return CustomerList.filter(Customer => Customer.LongName.toLowerCase().includes(searchName.toLowerCase()));
    }else {
      return CustomerList;
    }
  }
}
