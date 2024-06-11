import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OauthService } from '../services/oauth/oauth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(private readonly oauthApi: OauthService) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    // if (this.oauthApi.isLoggenIn()) {

    // }
    const authRes = await this.oauthApi.isLoggenIn();
    if (authRes.isAuthenticated) {
      this.oauthApi.access_token = authRes.accessToken;
      this.oauthApi.id_token = authRes.idToken;
      this.oauthApi.refresh_token = await this.oauthApi.getRefreshToken();
      return true;
    }

    this.oauthApi.login();
  }
}
