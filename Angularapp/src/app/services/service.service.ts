import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  interfaceURL = environment.interfaceURL;
  constructor(public http: HttpClient) { }

  getDataFromAPI(fromDate: any, toDate: any, type: string, custID: string) {
    const webMethod = this.interfaceURL+ 'ReadAllProductAllEvent_';
    if (type !== 'CA') {
      fromDate = moment(fromDate, 'DD-MMM-YYYY').format('DD-MM-YYYY');
      toDate = moment(toDate, 'DD-MMM-YYYY').format('DD-MM-YYYY');
    }
    console.log(fromDate, toDate, custID);
    const obj = {
      NotemasterID: '',
      STock: '',
      CustomerID: custID,
      DateType: 'Record Date',
      From: fromDate,
      To: toDate,
      Template_Name: 'All',
      Entity_ID: '4'
    };
    return this.http.post<any>(webMethod + type, obj);
  }

  getCountFromAPI(fromDate: any, toDate: any, type: string, custID: string) {
    const webMethod = this.interfaceURL+ 'CountProductAllEvent_';
    if (type !== 'CA') {
      fromDate = moment(fromDate, 'DD-MMM-YYYY').format('DD-MM-YYYY');
      toDate = moment(toDate, 'DD-MMM-YYYY').format('DD-MM-YYYY');
    }
    console.log(fromDate, toDate);
    const obj = {
      NotemasterID: '',
      STock: '',
      CustomerID: custID,
      DateType: 'Record Date',
      From: fromDate,
      To: toDate,
      Template_Name: 'All',
      Entity_ID: '4'
    };
    return this.http.post<any>(webMethod + type, obj);
  }

  getSlideshowImages(){
    const webMethod = this.interfaceURL + 'getslideshowimages';

    return this.http.get<any>(webMethod);
  }

}
