import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AppConfig } from 'src/app/services/config.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { ThemeserviceService } from 'src/app/themeService/themeservice.service';
import { dark, stanhope } from 'src/app/themeService/theme.module';
import { LoginApiService } from 'src/app/services/auth/login-api.service';
import { LanguageService } from '../../langService/language.service';

@Component({
  selector: 'app-verify-login',
  templateUrl: './verify-login.component.html',
  styleUrls: ['./verify-login.component.scss'],
})
export class VerifyLoginComponent implements OnInit {
  username: any;
  message: any;
  isUserVerified: boolean;
  header: any;
  isDemo: any;
  CompanyLogo: any;
  showSupport: boolean;
  userGroups: any;
  userType: any;

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    public router: Router,
    public custApi: CustomerApiService,
    public themeService: ThemeserviceService,
    public loginApi: LoginApiService,
    public languageApi: LanguageService
  ) {
    this.isUserVerified = false;
    this.message = '';
    this.header = '';
    this.isDemo = AppConfig.settings.CSP_IsDemo;
    this.CompanyLogo = AppConfig.settings.CSP_Company_Logo;
    this.showSupport = false;
  }

  ngOnInit(): void {
    this.custApi.isFirstCustomerLogin.next(true);
    if (this.CompanyLogo === 'SHC') {
      this.themeService.setActiveTheme(stanhope);
    } else {
      this.themeService.setActiveTheme(dark);
    }

    this.languageApi.translate.onDefaultLangChange.subscribe((res) => {
      console.log(res);
      this.header =
        this.languageApi.translatePipe.transform('Hello', res) +
        ' ' +
        this.username +
        '' +
        this.languageApi.translatePipe.transform(
          ', please click on verify button to complete your registration process',
          res
        ) +
        '.';
    });
    this.route.params.subscribe(async (res) => {
      const currLang = this.languageApi.translate.translations;
      this.username = res.userid;
      this.header =
        this.languageApi.translatePipe.transform('Hello', currLang) +
        ' ' +
        this.username +
        ', ' +
        this.languageApi.translatePipe.transform(
          'please click on verify button to complete your registration process',
          currLang
        ) +
        '.';
      if (this.username) {
        // this.loginApi
        //   .getUserTypeFromDB(this.username)
        //   .subscribe(async (uidRes) => {

        const uidRes = await this.loginApi.getUserTypeFromDB(this.username);
        if (uidRes.GetUIdResult.length > 0) {
          console.log(uidRes.GetUIdResult);
          const userType = uidRes.GetUIdResult[0].U_ID.toUpperCase();

          this.userGroups = await this.loginApi.getUserGroups();
          this.userGroups.forEach((g) => {
            if (userType === g.group.toUpperCase()) {
              console.log(g);
              this.userType = g.type;
              return;
            }
          });
        } else {
          this.loginApi
            .getUidForUnAuthorizedUser(this.username)
            .subscribe(async (res) => {
              // console.log(res.GetUIdResult);
              const userType = res.U_Id[0].toUpperCase();

              this.userGroups = await this.loginApi.getUserGroups();
              this.userGroups.forEach((g) => {
                if (userType === g.group.toUpperCase()) {
                  console.log(g);
                  this.userType = g.type;
                  return;
                }
              });
            });
        }
        // });
      }
      console.log(res);
    });
  }
  authorizeUser() {
    if (this.username) {
      this.authService.AuthorizeUser(this.username).subscribe((res) => {
        console.log(res);
        if (res.RequestProcessed) {
          this.message =
            'Your email has been successfully verified. Please click on Login to proceed.';
          this.isUserVerified = true;
        } else {
          this.isUserVerified = true;
          this.message =
            'Your email has been already verified. Please click on Login to proceed.';
        }
      });
      console.log(this.message);
    } else {
      this.message = 'Please enter username.';
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
  goTOLogin() {
    switch (this.userType.toUpperCase()) {
      case 'RM':
        console.log('RM');
        this.router.navigate(['/login/rm']);

        break;
      case 'CLIENT':
      case 'CLIENTSA':
        console.log('Client');
        this.router.navigate(['/login/client']);

        break;
      case 'ADMIN':
        console.log('Admin');
        this.router.navigate(['/login/admin']);

        break;

      default:
        break;
    }
  }
  toggleSupport() {
    this.showSupport = !this.showSupport;
  }

  ClosePopup(_e: any) {
    try {
      this.showSupport = false;
    } catch (ex) {
      console.log('Error occured while closing the pop up: ', ex);
    }
  }
}
