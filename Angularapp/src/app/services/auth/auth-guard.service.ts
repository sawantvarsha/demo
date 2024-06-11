import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoginApiService } from './login-api.service';
import { AppConfig } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    public auth: AuthService,
    public router: Router,
    public loginApi: LoginApiService
  ) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.loginApi.allowAuth(false);
      return false;
    } else {
      this.auth.EntityID = sessionStorage.getItem('EntityID');
      this.auth.EntityName = sessionStorage.getItem('EntityName');
      // this.auth.EntityID = AppConfig.settings.CSP_EntityDetails.Entity_ID;
      // this.auth.EntityName = AppConfig.settings.CSP_EntityDetails.Entity_Name;
      this.loginApi.allowAuth(true);
      return true;
    }
  }
}
