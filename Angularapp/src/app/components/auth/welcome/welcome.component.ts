import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';
import { LoginApiService } from 'src/app/services/auth/login-api.service';
import { AppConfig } from 'src/app/services/config.service';
import { environment } from 'src/environments/environment';
import { LanguageService } from '../../langService/language.service';
import { CommonApiService } from './../../../services/common-api.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  portalTabs: any;
  isProd = environment.production;
  domainURL = environment.domainURL;
  username: string;
  isDemo: any;
  showPortals: any[];
  CompanyLogo: string;

  constructor(
    public loginApi: LoginApiService,
    public router: Router,
    public authApi: AuthGuardService,
    public commonApi: CommonApiService,
    public activatedRoute: ActivatedRoute,
    public languageApi: LanguageService
  ) {
    this.portalTabs = 1;
    this.isDemo = AppConfig.settings.CSP_IsDemo;
    this.showPortals = AppConfig.settings.CSP_PortalAccess.split(',');

    try {
      this.CompanyLogo = sessionStorage.getItem('CompanyLogo');
    } catch (EX) {
      this.CompanyLogo = 'SHC';
    }
  }

  ngOnInit(): void {
    if (this.authApi.canActivate()) {
      this.navigate();
    } else {
      // this.loginApi.allowAuth(false);
      this.activatedRoute.params.subscribe((res) => {
        console.log(res);
        if (res.usertype !== undefined) {
          this.showPortals = [];
          switch (res.usertype.toUpperCase()) {
            case 'RM':
              this.showPortals.push('RM');
              break;
            case 'CLIENT':
            case 'CLIENTSA':
              this.showPortals.push('CLIENT');
              break;
            case 'ADMIN':
              this.showPortals.push('ADMIN');
              break;

            default:
              break;
          }
        }
      });
    }
    this.commonApi.companyLogoObserver.subscribe((res) => {
      if (res !== '' && res !== null && res !== undefined) {
        this.CompanyLogo = res;
      } else {
        this.CompanyLogo = 'SHC';
      }
    });
  }

  navigate() {
    sessionStorage.setItem('loggedIn', this.username);
    // console.log(sessionStorage.getItem('loggedIn'));
    // this.loginApi.allowAuth(true);
    // this.router.navigate(['home']);

    this.router.navigate(['/home/' + sessionStorage.getItem('Username')]);
  }
}
