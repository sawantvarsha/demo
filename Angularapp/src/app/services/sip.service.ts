import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SIPService {
  interfaceURL = environment.interfaceURL;

  constructor(public http: HttpClient) {}

  GetSIPInstallmentDates(CustomerID, EntityID, LoginUser, NoteMasterId) {
    try {
      const webMethod = this.interfaceURL + 'getSIPInstallmentDates';
      const parameters = {
        CustomerID,
        EntityID,
        LoginUser,
        NoteMasterId
      };
      return this.http.post<any>(webMethod, parameters);
    } catch (error) {
      console.log('Exception caught in GetSIPInstallmentDates', error);
      return null;
    }
  }

  UpdateSIPDetails(NoteMasterId, UserId, NextDueDates, Mode){
    try{
      const webMethod = this.interfaceURL + 'UpdateSIPDetails';
      const parameters = {
        NoteMasterId,
        UserId,
        NextDueDates,
        Mode
      };
      return this.http.post<any>(webMethod, parameters);
    }catch(error){
      console.log("error in UpdateSIPDetails function", error)
      return null;
    }
  }
}
