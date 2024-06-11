import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HomeApiService } from '../home-api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginApiService {
  interfaceURL = environment.interfaceURL;
  temp: string;
  loggedInUserName: string;

  private LoginAuth = new BehaviorSubject<any>([]);
  ObserverLoginAuth = this.LoginAuth.asObservable();

  private LogoutAuth = new BehaviorSubject<any>([]);
  ObserverLogoutAuth = this.LogoutAuth.asObservable();

  private LoginName = new BehaviorSubject('');
  ObserverLoginName = this.LoginName.asObservable();

  private isAuth = new BehaviorSubject('');
  isAuthObserver = this.isAuth.asObservable();

  epochTime: any;
  userGroups: any[];
  portals: any;

  constructor(
    public http: HttpClient,
    public authApi: AuthService,
    public homeapi: HomeApiService
  ) {
    // this.loggedInUserName = sessionStorage.getItem('Username');
    this.userGroups = [];
    this.portals = [];
  }

  LoginUser(username, password, entity) {
    const webMethod = this.interfaceURL + 'LoginUser';
    const parameters = {
      InputUserID: username,
      InputPassword: password,
      EntityID: entity,
    };
    console.log('Login User:', parameters);

    return this.http.post<any>(webMethod, parameters, {
      withCredentials: true,
    });
  }

  LogoutUser(username, sessionToken, entity) {
    const webMethod = this.interfaceURL + 'LogoutUser';
    const parameters = {
      UserID: username,
      UserSessionToken: sessionToken,
      EntityID: entity,
    };
    console.log('Logout User:', parameters);
    this.homeapi.riskProfileArray = [
      { product: 'ALL', value: true },
      { product: 'Bonds', value: true },
      { product: 'Fund_Setup', value: true },
      { product: 'Product_Maintenance', value: true },
    ];

    return this.http.post<any>(webMethod, parameters, {
      withCredentials: true,
    });
  }

  GenerateOTP(username, entity, grpID) {
    const webMethod = this.interfaceURL + 'GenerateOTP';
    const parameters = {
      UserID: username,
      EntityID: entity,
      GroupID: grpID,
    };
    console.log('Logout User:', parameters);

    return this.http.post<any>(webMethod, parameters);
  }

  IsValidOTP(username, entity, _GroupID, otp) {
    const webMethod = this.interfaceURL + 'IsValidOTP';
    const parameters = {
      UserID: username,
      EntityID: entity,
      otp,
    };
    console.log('Logout User:', parameters);

    return this.http.post<any>(webMethod, parameters, {
      responseType: 'text' as 'json',
    });
  }

  GetEntity() {
    const webMethod = this.interfaceURL + 'GetEntity';

    return this.http.get<any>(webMethod);
  }

  RegisterUser(
    username,
    emailid,
    password,
    clientip,
    clientmcname,
    clientos,
    group,
    entity
  ) {
    const webMethod = this.interfaceURL + 'RegisterUser';
    const parameters = {
      UserID: username,
      UserPassword: password,
      PrimaryEmailAddress: emailid,
      ClientIP: clientip,
      ClientMachineName: clientmcname,
      ClientOperatingSystem: clientos,
      ApplicationStartupPath: 'LSS_REST_API',
      ApplicationMode: 'LSS_REST_API',
      AuditUserSessionStartedAt: this.getEpochTime(),
      group,
      EntityID: entity,
      // AuditUserSessionStartedAt: '/Date(1590071003389+0530)/'
    };

    return this.http.post<any>(webMethod, parameters);
  }

  SendVerifyMail(username) {
    const webMethod = this.interfaceURL + 'SendVerifyMail';
    const parameters = {
      UserID: username,
    };

    return this.http.post<any>(webMethod, parameters);
  }

  OverridePassword(
    username,
    newpassword,
    confirmpassword,
    securityToken,
    entity
  ) {
    const webMethod = this.interfaceURL + 'OverridePassword';
    const parameters = {
      UserID: username,
      NewPassword: newpassword,
      ConfirmPassword: confirmpassword,
      SessionSecurityToken: securityToken,
      AuditActionBy: username,
      EntityID: entity,
      // AuditUserSessionStartedAt: '/Date(1590071003389+0530)/'
    };

    return this.http.post<any>(webMethod, parameters);
  }

  CheckDuplicateUser(username, entity) {
    const webMethod = this.interfaceURL + 'CheckDuplicateUser';
    const parameters = {
      LoginID: username,
      EntityID: entity,
    };
    console.log('Check Duplicate User:', parameters);

    return this.http.post<any>(webMethod, parameters);
  }

  getUserTypeFromDB(username) {
    const webMethod = this.interfaceURL + 'getUserTypeFromDB';
    const parameters = {
      LoginID: username,
    };
    console.log('User Type:', parameters);
    return this.http.post<any>(webMethod, parameters).toPromise();
  }
  getUidForUnAuthorizedUser(username) {
    const webMethod = this.interfaceURL + 'getuidforunauthorizeduser';
    const parameters = {
      UserName: username,
    };
    console.log('User Type:', parameters);
    return this.http.post<any>(webMethod, parameters);
  }

  encryptParams(parameters) {
    const encryptedLoad = window.btoa(JSON.stringify(parameters));
    return encryptedLoad;
  }

  getEpochTime() {
    return '/Date(' + new Date().getTime().toString() + '+0530' + ')/';
  }

  allowAuth(authFlag) {
    this.isAuth.next(authFlag);
  }

  IsTwoStepVerificationEnabled() {
    return this.http
      .post<any>(this.interfaceURL + 'GetConfig', {
        ConfigName: 'TwoFactorAuthenticationEnabledFor',
      })
      .toPromise();
    // .then((response: any) => {
    //   return response;
    // }).catch((response: any) => {
    //   // reject(`Could not load api: ${JSON.stringify(response)}`);
    // });
  }
  GetOTPValidityPeriod() {
    // return .toPromise();
    return this.http
      .post<any>(this.interfaceURL + 'GetConfig', {
        ConfigName: 'TwoFactorOTPValidityPeriod',
      })
      .toPromise();
  }
  async getUserGroups() {
    if (this.userGroups.length > 0) {
      return this.userGroups;
    } else {
      this.userGroups = await this.http
        .get<any>(this.interfaceURL + 'GetUserGroups')
        .toPromise()
        .then((grps: any[]) => {
          console.log(grps);
          return grps;
        });
      return this.userGroups;
    }
  }
  async getPortals(): Promise<any[]> {
    if (this.portals.length > 0) {
      return this.portals;
    } else {
      this.portals = await this.http
        .get<any>(this.interfaceURL + 'getPortals')
        .toPromise()
        .then((portals: any[]) => {
          console.log(portals);
          return portals;
        });
      return this.portals;
    }
  }
}
