import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class WorkbenchLinksService {
  interfaceUrl: string = environment.interfaceURL;
  constructor(public authApi: AuthService, public http: HttpClient) {}
  async GetMTMHistoryData(notemasterID): Promise<any> {
    try {
      const webMethod = this.interfaceUrl + 'GetMTMHistoryData';
      const parameters = {
        NMID: notemasterID,
        userID: this.authApi.UserName,
      };
      return this.http.post(webMethod, parameters).toPromise();
    } catch (error) {
      console.log(error);
    }
  }
}
