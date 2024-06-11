import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';


@Injectable({
  providedIn: 'root',
})
export class OauthService {
  access_token: any;
  refresh_token: any;
  id_token: any;
  isHashingEnabled: boolean = true;
  hkey = 'C1PFxPgKepndcdBCqU6yYODCDlSw0W2v';
  constructor(public oidcSecurityApi: OidcSecurityService) { }
  async isLoggenIn() {
    return await this.oidcSecurityApi.checkAuth().toPromise();
    //return await lastValueFrom(this.oidcSecurityApi.checkAuth());
  }
  async getRefreshToken() {
    return await this.oidcSecurityApi.getRefreshToken();
    //return await lastValueFrom(this.oidcSecurityApi.getRefreshToken());
  }
  async getAccessToken() {
    return await this.oidcSecurityApi.getAccessToken();
    //return await lastValueFrom(this.oidcSecurityApi.getAccessToken());
  }

  login() {
    this.oidcSecurityApi.authorize();
  }

  logout() {
    this.oidcSecurityApi.logoff();//.subscribe(res => res);
  }
  getUserData() {
    try {
      return this.oidcSecurityApi.getUserData();   
    } catch (err) {
      console.log('getPayloadFromIdToken', err);
    }
  }
}
