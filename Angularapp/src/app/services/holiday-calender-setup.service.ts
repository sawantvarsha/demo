import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HolidayCalenderSetupService {
  interfaceURL = environment.interfaceURL;
  // interfaceURL =
  //   'http://52.163.118.116/FinIQService/HolidayCalenderSetupService.svc/';

  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(public http: HttpClient) {}

  async GetCurrencyOrAsset() {
    const webMethod = this.interfaceURL + 'holidaycal/GetCurrencyOrAsset';
    return this.http.get(webMethod).toPromise();
  }

  async GetHolidayCalenderRecords(
    strCCY,
    strType,
    strFromDate,
    strToDate,
    strHolName,
    strEvent
  ) {
    // const webMethod = this.interfaceURL + 'GetHolidayCalender_Records_API';
    const webMethod = this.interfaceURL + 'holidaycal/GetHolidayCalendarRecords';
    const parameters = {
      strCCY,
      strType,
      strFromDate,
      strToDate,
      strHolName,
      strEvent,
    };
    return this.http.post(webMethod, parameters).toPromise();
  }

  // Added on 02 Aug 2022 for update and insert
  async SaveHolidayCalendar(
    idd,
    holccy,
    holtype,
    holdate,
    holname,
    misc,
    IUorD,
    strCCYAllOrNot,
    AppUser,
    I_StrIPAddress
  ) {
    const webMethod = this.interfaceURL + 'holidaycal/saveHolidayCalender';
    const parameters = {
      "id" : idd,
      "holidayCcy" : holccy,
      "holidayType" : holtype,
      "holidayDate" : holdate,
      "holidayName" : holname,
      "misc" : misc,
      "IUorD" : IUorD,
      "cCYAllOrNot" : strCCYAllOrNot,
      "AppUser" : AppUser,
      "IPAddress" : I_StrIPAddress,
    };
    return this.http.post(webMethod, parameters).toPromise();
  }

  // Added on 02 Aug 2022 for delete
  async DeleteRecords(strid, AppUserName, I_StrIPAddress) {
    const webMethod = this.interfaceURL + 'holidaycal/deleteRecords';
    const parameters = {
      "id" : strid,
      "AppUserName" : AppUserName,
      "IPAddress" : I_StrIPAddress,
    };
    return this.http.post(webMethod, parameters).toPromise();
  }
}
