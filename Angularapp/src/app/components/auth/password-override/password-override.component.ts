import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
import { LoginApiService } from 'src/app/services/auth/login-api.service';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-password-override',
  templateUrl: './password-override.component.html',
  styleUrls: ['./password-override.component.scss']
})
export class PasswordOverrideComponent implements OnInit, OnDestroy {
  @Output() cancelPasswordOverride = new EventEmitter();
  @Input() IUSERID;
  isProd = environment.production;
  username: string;
  oldpassword: string;
  newpassword: string;
  confirmpassword: string;
  email: string;
  isError: boolean;
  ErrorMsg: string;
  isSuccess: boolean;
  SuccessMsg: string;
  message: string;
  clientip: string;
  clientos: any;
  path: string;
  apptype: any;
  loginFlag: boolean;
  loadflag: boolean;
  isForgotpassword: boolean;
  isOldPasswordText: boolean;
  isNewPasswordText: boolean;
  isConfirmPasswordText: boolean;
  sessionToken: string;
  loggedInUsername: string;
  ObserverLoginAuthSubscription: Subscription;

  constructor(private router: Router, public loginApi: LoginApiService, public authApi: AuthGuardService, public cfs: CommonApiService, public afs: CustomerApiService, public api: WorkflowApiService, public authorApi: AuthService) {
    const ClientIP = localStorage.getItem('IP');
    this.clientip = ClientIP || '';
    sessionStorage.removeItem('loggedIn');
    this.apptype = 2;
    this.clientos = 'Unknown';
    this.loginFlag = false;
    this.loadflag = false;
    this.isForgotpassword = false;
    this.username = sessionStorage.getItem('Username');;
    this.oldpassword = '';
    this.newpassword = '';
    this.confirmpassword = '';
    this.email = '';
    this.isError = false;
    this.ErrorMsg = '';
    this.isSuccess = false;
    this.SuccessMsg = '';
    this.isOldPasswordText = false;
    this.isNewPasswordText = false;
    this.isConfirmPasswordText = false;
  }
  ngOnDestroy(): void {
    this.ObserverLoginAuthSubscription.unsubscribe();
  }

  ngOnInit() {
   

    this.sessionToken = sessionStorage.getItem('SessionToken');

    if (window.navigator.userAgent.indexOf('Windows NT 10.0') !== -1) { this.clientos = 'Windows 10'; }
    if (window.navigator.userAgent.indexOf('Windows NT 6.2') !== -1) { this.clientos = 'Windows 8'; }
    if (window.navigator.userAgent.indexOf('Windows NT 6.1') !== -1) { this.clientos = 'Windows 7'; }
    if (window.navigator.userAgent.indexOf('Windows NT 6.0') !== -1) { this.clientos = 'Windows Vista'; }
    if (window.navigator.userAgent.indexOf('Windows NT 5.1') !== -1) { this.clientos = 'Windows XP'; }
    if (window.navigator.userAgent.indexOf('Windows NT 5.0') !== -1) { this.clientos = 'Windows 2000'; }
    if (window.navigator.userAgent.indexOf('Mac') !== -1) { this.clientos = 'Mac/iclientos'; }
    if (window.navigator.userAgent.indexOf('X11') !== -1) { this.clientos = 'UNIX'; }
    if (window.navigator.userAgent.indexOf('Linux') !== -1) { this.clientos = 'Linux'; }

    const that = this;
    this.ObserverLoginAuthSubscription = this.loginApi.ObserverLoginAuth.subscribe((status: any) => {
      if (this.loginFlag === true) {
        this.loadflag = false;
        //console.log(status);
        if (status.Status === 'LoginSucceeded') {
          that.message = 'Logged in successfully.';
          //console.log(this.message);
          sessionStorage.setItem('SessionToken', status.SessionToken);
          sessionStorage.setItem('ResponseDateTime', status.ResponseDateTime);
          sessionStorage.setItem('groupID', status.GroupID);
          that.navigate();
        } else {
          const errMessage = `Login Security Shell encountered problems due to all or any of the below mentioned reasons!.
          1). Invalid login credentials.
          2). Login-Entity map not found.
          3). Entity deactivated.
          Please call system administrator. `;
          // that.message = status.StatusMessage;
          that.message = errMessage;
        }
      }
    }, error => console.log(error)
    );
  }

  validateUser() {
    this.loginFlag = true;
    this.message = '';
    // console.log(this.username, 'a', this.password, 'a', this.clientip, 'a', this.clientos, 'a', this.path, this.apptype);
    if (typeof this.username === 'undefined' || this.username === '') {
      this.message = 'Please enter username';
    } else if (typeof this.oldpassword === 'undefined' || this.oldpassword === '') {
      this.message = 'Please enter password';
    } else {
      this.loadflag = true;
    }
  }

  navigate() {
    sessionStorage.setItem('loggedIn', this.username);
    console.log(sessionStorage.getItem('loggedIn'));
    this.loginApi.allowAuth(true);
    this.router.navigate(['home'+ this.username]);
  }
  validateInputs() {
    if (this.username === '') {
      this.isError = true;
      this.ErrorMsg = 'Please enter all the fields!';
      return false;
    }
    return true;
  }
  changePassword() {
    this.loginApi.OverridePassword(this.username, this.newpassword, this.confirmpassword, this.sessionToken, this.authorApi.EntityID).subscribe(resOverride => {
      //console.log(resOverride);

      switch (resOverride.Status) {
        case 1:
          this.isSuccess = true;
          this.SuccessMsg = resOverride.StatusMessage;
          setTimeout(() => {
            this.logout();
          }, 3000);
          break;
        default:
          this.isError = true;
          this.ErrorMsg = resOverride.StatusMessage;
          break;
      }
    });
  }
  cancel() {
    this.cancelPasswordOverride.emit();
  }

  logout() {
    let SessionToken: any = '';
    if (sessionStorage.getItem('Username')) {
      this.loggedInUsername = sessionStorage.getItem('Username');
      SessionToken = sessionStorage.getItem('SessionToken');

    }
    console.log(SessionToken);
    this.afs.getCustAccountDetailsObserver.next([]);
    this.afs.KYCriskRating.next({});
    this.api.portfolio.next([]);
    this.loginApi.LogoutUser(this.loggedInUsername, SessionToken, this.authorApi.EntityID).subscribe(res => {
      if (res) {
        //console.log(res);

        if (res.LoggedOut) {
          sessionStorage.clear();
          this.loginApi.allowAuth(false);
          this.router.navigate(['/login']);
        } else {
          //console.log('Logout Failed');
        }
      }
    });
  }

}
