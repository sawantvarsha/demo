import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginApiService } from 'src/app/services/auth/login-api.service';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/services/config.service';
import { AuthService } from 'src/app/services/auth/auth.service';
// import * as $ from 'jquery';
import { AfterViewChecked } from '@angular/core';
import { HomeApiService } from 'src/app/services/home-api.service';
import { TitleCasePipe } from '@angular/common';
import { LanguageService } from '../../langService/language.service';
import { SignalrApiService } from 'src/app/services/signalR/signalr-api.service';
import { EqcApifunctionService } from '../../structured-products/Services/eqc-apifunction.service';
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewChecked {
  IsKYCDoneAtSecStage: boolean = AppConfig.settings.CSP_IsKYCDoneAtSecStage;
  isProd = environment.production;
  username: string;
  password: string;
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
  isPasswordText: boolean;
  isUserRM: boolean;
  userType: any;
  displayUserType: any;
  RouteParamertesSubscription: Subscription;
  LoginAuthSubscription: Subscription;
  currUserType: string;
  isProfileCreated: boolean;
  isAdmin: boolean;
  FinIQGroupID: any;
  isDemo: boolean;
  EntityID: any;
  // optVerification: boolean;
  twoStepVerification: boolean;
  isTwoStepVerificationEnabled: boolean;
  TwoStepOTPValidityPeriod: number;
  OTPValidityTimer: number;
  OTPValidityInterval: any;
  otpDigitsArr: number[];
  SessionToken: string;
  EmailID: string;
  LoggedAt: string;
  UserID: string;
  EntityName: string;
  CompanyLogo: string;
  isRegisterEnabled: boolean;
  userGroups: any;
  portalHeader: any;

  constructor(
    private router: Router,
    public loginApi: LoginApiService,
    public authApi: AuthGuardService,
    public route: ActivatedRoute,
    public custApi: CustomerApiService,
    public authorApi: AuthService,
    public commonApi: CommonApiService,
    public homeApi: HomeApiService,
    public titleCase: TitleCasePipe,
    public languageApi: LanguageService,
    public signalRApi: SignalrApiService,
    public eqcApi: EqcApifunctionService
  ) {
    const ClientIP = localStorage.getItem('IP');
    this.clientip = ClientIP || '';
    sessionStorage.removeItem('loggedIn');
    this.apptype = 2;
    this.clientos = 'Unknown';
    this.loginFlag = false;
    this.loadflag = false;
    this.isForgotpassword = false;
    this.username = '';
    this.password = '';
    this.email = '';
    this.isError = false;
    this.ErrorMsg = '';
    this.isSuccess = false;
    this.SuccessMsg = '';
    this.isPasswordText = false;
    this.isProfileCreated = false;
    this.displayUserType = '';
    this.isDemo = AppConfig.settings.CSP_IsDemo;
    this.twoStepVerification = false;
    this.isTwoStepVerificationEnabled = false;
    this.isRegisterEnabled = false;
    this.userGroups = [];
    try {
      this.CompanyLogo = sessionStorage.getItem('CompanyLogo');
    } catch (EX) {
      this.CompanyLogo = 'SHC';
    }
  }
  ngOnDestroy(): void {
    if (this.RouteParamertesSubscription) {
      this.RouteParamertesSubscription.unsubscribe();
    }
    // this.LoginAuthSubscription.unsubscribe();
  }

  ngOnInit() {
    if (this.authApi.canActivate()) {
      this.navigate();
    } else {
      this.twoStepVerification = false;
      this.otpDigitsArr = new Array(
        Number(AppConfig.settings.TwoFactorAuthenticationOTPDigits) || 4
      );
      // this.loginApi.allowAuth(false);
      this.RouteParamertesSubscription = this.route.params.subscribe(
        (params: any) => {
          const casevalue: string = params.usertype;
          this.displayUserType =
            casevalue.charAt(0).toUpperCase() +
            casevalue.substr(1).toLowerCase();
          this.portalHeader = this.displayUserType + ' Login';

          if (casevalue === 'rm') {
            this.displayUserType = 'RM';
            this.portalHeader = this.displayUserType + ' Login';
          }
          this.currUserType = casevalue.toUpperCase();
          this.validateUser();
          if (casevalue) {
            switch (casevalue.toUpperCase()) {
              case 'CLIENT':
                this.userType = casevalue;
                this.custApi.isFirstCustomerLogin.next(false); // to show slide show on login
                break;
              case 'RM':
                this.userType = 'RM';
                break;
              case 'EMPLOYER':
                this.userType = casevalue;
                break;
              case 'ADMIN':
                this.userType = 'ADMIN';
                this.isAdmin = true;
                break;
              case 'DEALER':
                this.userType = 'DEALER';
                break;
              case 'NEWUSER':
                this.userType = 'NEWUSER';
                break;

              default:
                this.router.navigate(['welcome']);
                break;
            }
          }
          this.isRegisterEnabled =
            AppConfig.settings.CSP_EnableRegisterFor.split(',').includes(
              this.userType.toString().toUpperCase()
            );
        }
      );

      if (window.navigator.userAgent.indexOf('Windows NT 10.0') !== -1) {
        this.clientos = 'Windows 10';
      }
      if (window.navigator.userAgent.indexOf('Windows NT 6.2') !== -1) {
        this.clientos = 'Windows 8';
      }
      if (window.navigator.userAgent.indexOf('Windows NT 6.1') !== -1) {
        this.clientos = 'Windows 7';
      }
      if (window.navigator.userAgent.indexOf('Windows NT 6.0') !== -1) {
        this.clientos = 'Windows Vista';
      }
      if (window.navigator.userAgent.indexOf('Windows NT 5.1') !== -1) {
        this.clientos = 'Windows XP';
      }
      if (window.navigator.userAgent.indexOf('Windows NT 5.0') !== -1) {
        this.clientos = 'Windows 2000';
      }
      if (window.navigator.userAgent.indexOf('Mac') !== -1) {
        this.clientos = 'Mac/iclientos';
      }
      if (window.navigator.userAgent.indexOf('X11') !== -1) {
        this.clientos = 'UNIX';
      }
      if (window.navigator.userAgent.indexOf('Linux') !== -1) {
        this.clientos = 'Linux';
      }
    }
    this.commonApi.companyLogoObserver.subscribe((res) => {
      if (res !== '' && res !== null && res !== undefined) {
        this.CompanyLogo = res;
      } else {
        this.CompanyLogo = 'SHC';
      }
    });
  }

  validateUser() {
    this.loginFlag = true;
    this.message = '';
    // console.log(this.username, 'a', this.password, 'a', this.clientip, 'a', this.clientos, 'a', this.path, this.apptype);
    if (typeof this.username === 'undefined' || this.username === '') {
      this.message = 'Please enter username';
    } else if (typeof this.password === 'undefined' || this.password === '') {
      this.message = 'Please enter password';
    } else {
      this.loadflag = true;
    }
  }

  navigate() {
    sessionStorage.setItem('loggedIn', this.username);
    // console.log(sessionStorage.getItem('loggedIn'));
    // this.loginApi.allowAuth(true);
    this.userType = sessionStorage.getItem('UserType');
    switch (this.userType.toUpperCase()) {
      case 'CLIENT':
        this.router.navigate(['home' + this.username]);
        break;
      case 'RM':
        this.router.navigate(['ClientSummary']);
        break;
      case 'EMPLOYER':
        this.router.navigate(['home' + this.username]);
        break;
      case 'ADMIN':
        this.router.navigate(['Menu']);
        break;
      case 'NEWUSER':
        this.router.navigate(['customersetup/3/FPFCL']);
        break;
      default:
        this.router.navigate(['welcome']);
        break;
    }
    // this.selectUserType();
  }
  checkForTwoStepVerifation() {
    switch (AppConfig.settings.TwoFactorAuthenticationEnabledFor) {
      case 'NONE':
        this.isTwoStepVerificationEnabled = false;
        break;
      case 'ALLUSER':
      case 'ADMUSER':
      case 'APPUSER':
      case 'ADMANDAPPUSER':
        this.isTwoStepVerificationEnabled = true;
        break;
      default:
        this.isTwoStepVerificationEnabled = false;
        break;
    }
    this.login();
  }
  async login() {
    try {
      this.isTwoStepVerificationEnabled = await this.loginApi
        .IsTwoStepVerificationEnabled()
        .then((response: any) => {
          const res = response.Get_Config_ValueResult[0].Config_Value;
          switch (res) {
            case 'NONE':
              return false;
            case 'ALLUSER':
            case 'ADMUSER':
            case 'APPUSER':
            case 'ADMANDAPPUSER':
              return true;
            default:
              return false;
          }
          // return res === 'NONE' ? false : true;
        })
        .catch((_response: any) => {
          // reject(`Could not load api: ${JSON.stringify(response)}`);
          return false;
        });

      if (await this.validateInputs()) {
        this.loginApi.loggedInUserName = this.username;
        this.loginApi
          .LoginUser(this.username, this.password, this.authorApi.EntityID)
          .subscribe((res) => {
            if (res) {
              if (res.Status === 0 && res.SessionToken) {
                this.FinIQGroupID =
                  res.WLoginUserInfo.FinIQGroupID.toUpperCase();
                this.UserID = res.WLoginUserInfo.FinIQUserID;
                this.EntityID = res.WLoginUserInfo.HomeEntityID;
                this.EntityName = res.WLoginUserInfo.HomeEntityName;
                this.SessionToken = res.SessionToken;
                this.EmailID = res.Primary_Email_Address;
                this.LoggedAt = res.ResponseDateTime;
                sessionStorage.setItem(
                  'EntityID',
                  res.WLoginUserInfo.HomeEntityID
                );
                sessionStorage.setItem(
                  'EntityName',
                  res.WLoginUserInfo.HomeEntityName
                );
                this.eqcApi
                  .AuthenticateUser(this.username, this.password)
                  .subscribe((tokenRes) => {
                    this.eqcApi.SetToken(tokenRes.token);
                  });
                if (!this.isTwoStepVerificationEnabled) {
                  this.selectUserType();
                } else {
                  this.twoStepVerification = true;
                  this.generateOTP();
                  console.log('Wait for OTP');
                }
              } else {
                this.isError = true;
                this.ErrorMsg =
                  'Login Failed! <br> Please check Username and Password.';
              }
            } else {
              this.isError = true;
              this.ErrorMsg = 'Login Failed!';
            }
          });
      }
    } catch (error) {}
  }

  handleKeyboardEvent(event) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  async validateInputs() {
    if (this.username === '') {
      this.isError = true;
      this.ErrorMsg = 'Please enter all the fields!';
      return false;
    }
    await this.getUserType();
    if (!this.currUserType.includes(this.userType.toUpperCase())) {
      this.isError = true;
      this.ErrorMsg = 'Please enter a valid User ID!';
      return false;
    }
    // if (this.userType.toUpperCase() === 'CLIENT' && !this.isProfileCreated) {
    //   this.isError = true;
    //   this.ErrorMsg = 'Please create user profile!';
    //   return false;
    // }
    return true;
  }
  forgotPassword() {
    this.isError = false;
    this.isForgotpassword = true;
  }
  backtologin() {
    // this.isError = false;
    this.isForgotpassword = false;
  }
  changePassword() {
    this.isForgotpassword = false;
    // if (this.validateInputs()) {
    // this.router.navigate(['/login']);
    // }
  }

  async selectUserType() {
    this.authorApi.UserName = this.username;
    this.authorApi.UserType = this.currUserType;
    sessionStorage.setItem('SessionToken', this.SessionToken);
    sessionStorage.setItem('Username', this.username);
    sessionStorage.setItem('EmailID', this.EmailID);
    sessionStorage.setItem('LoggedAt', this.LoggedAt);
    sessionStorage.setItem('FinIQGroupID', this.FinIQGroupID);
    this.homeApi.FinIQGroupID = this.FinIQGroupID;
    sessionStorage.setItem('FinIQUserID', this.UserID);
    sessionStorage.setItem('HomeEntityID', this.EntityID);
    sessionStorage.setItem('HomeEntityName', this.EntityName);
    this.homeApi.Portfolio = 0;
    switch (this.authorApi.UserType) {
      case 'CLIENT':
        this.custApi
          .isCustProfileCreated(this.username, '', '')
          .subscribe(async (custRes) => {
            // console.log('Profile', custRes);
            if (!custRes.status && custRes.message === 'No record(s) found') {
              this.isProfileCreated = false;
              sessionStorage.setItem('isClientKYCDone', 'false');
              sessionStorage.setItem(
                'isProfileCreated',
                this.isProfileCreated.toString()
              );
              this.userType = 'NEWUSER';
              sessionStorage.setItem('UserType', this.userType);
              this.authorApi.UserType = this.userType;
            } else if (custRes.length !== 0) {
              this.isProfileCreated = true;
              sessionStorage.setItem('CustomerID', custRes[0].CustomerID);
              this.homeApi.CustomerId = custRes[0].CustomerID;
              this.homeApi.RMID = custRes[0].RMID;
              this.homeApi.RMName = custRes[0].RM;
              // console.log(custRes[0].CustomerID);
              if (this.IsKYCDoneAtSecStage) {
                this.userType = 'CLIENT';
                sessionStorage.setItem('UserType', this.userType);
                // sessionStorage.setItem('isProfileCreated', 'true');
                sessionStorage.setItem('isClientKYCDone', 'true');
                this.authorApi.UserType = this.userType;

                // let clientDetails: any;
                // clientDetails = await this.custApi.GetClientSetupformSavedForFuture(this.authorApi.UserName);

                // this.homeApi.NoteMasterID = clientDetails.NoteMasterID;
                // this.homeApi.Portfolio = clientDetails.Portfolio;
              } else {
                await this.custApi
                  .isKYCDone(
                    AppConfig.settings.CSP_UpdateCIRPFormName,
                    custRes[0].CustomerID
                  )
                  .then(async (kycRes) => {
                    // console.log('KYC', kycRes);
                    sessionStorage.setItem(
                      'isProfileCreated',
                      this.isProfileCreated.toString()
                    );
                    if (JSON.parse(kycRes)) {
                      this.userType = 'CLIENT';
                      sessionStorage.setItem('UserType', this.userType);
                      sessionStorage.setItem('isClientKYCDone', kycRes);
                      this.authorApi.UserType = this.userType;
                      let clientDetails: any;
                      clientDetails =
                        await this.custApi.GetClientSetupformSavedForFuture(
                          this.authorApi.UserName
                        );

                      /* Do Not take in CSP */
                      this.homeApi.NoteMasterID =
                        clientDetails?.NoteMasterID || '';
                      this.homeApi.Portfolio = clientDetails?.Portfolio || '';
                      /* Do Not take in CSP */

                      // this.custApi.GetClientSetupformSavedForFuture(this.authorApi.UserName).subscribe(clientdet => {
                      //   console.log();
                      //   const clientDetails = JSON.parse(clientdet.GetDataResult);
                      //   this.homeApi.NoteMasterID = clientDetails.NoteMasterID
                      // });
                    } else {
                      this.userType = 'NEWUSER';
                      sessionStorage.setItem('UserType', this.userType);
                      sessionStorage.setItem('isClientKYCDone', kycRes);
                      this.authorApi.UserType = this.userType;
                    }
                  })
                  .catch((err) => console.log(err));
              }
            }

            switch (this.userType.toUpperCase()) {
              case 'CLIENT':
                this.router.navigate(['home' + this.username]);
                break;
              case 'NEWUSER':
                this.router.navigate(['customersetup/3/FPFCL']);
                break;
              default:
                this.router.navigate(['welcome']);
                break;
            }
          });
        break;
      case 'CLIENTSA':
        sessionStorage.setItem('isClientKYCDone', 'true');
        let clientDetails: any;
        clientDetails = await this.custApi.GetClientSetupformSavedForFuture(
          this.authorApi.UserName
        );

        this.homeApi.NoteMasterID = clientDetails?.NoteMasterID || '';
        this.homeApi.Portfolio = clientDetails?.Portfolio || '';

        this.router.navigate(['home' + this.username]);
        break;
      case 'NEWUSER':
        this.router.navigate(['customersetup/3/FPFCL']);
        break;
      case 'RM':
        this.homeApi.RMID = await this.custApi.GetRMIDFromUsername(
          this.username
        );
        console.log(this.homeApi.RMID);
        this.router.navigate(['ClientSummary']);
        break;
      case 'DEALER':
        this.router.navigate(['wfblotter']);
        break;
      case 'ADMIN':
        this.router.navigate(['ClientSummary']);
        break;

      default:
        this.router.navigate(['welcome']);
        break;
    }
  }

  async getUserType() {
    if (this.username && this.username !== undefined) {
      // this.loginApi.getUserTypeFromDB(this.username).subscribe(async (res) => {
     
      const res = await this.loginApi.getUserTypeFromDB(this.username);
      console.log(" console.log(res.GetUIdResult);" ,res.GetUIdResult);
      const userType = res.GetUIdResult[0].U_ID.toUpperCase();

      this.userGroups = await this.loginApi.getUserGroups();
      this.userGroups.forEach((g) => {
        if (userType === g.group.toUpperCase()) {
          this.currUserType = g.type.toUpperCase();
          sessionStorage.setItem('UserType', this.currUserType);
          if (['RM', 'ADMIN'].includes(this.currUserType)) {
            sessionStorage.setItem('isClientKYCDone', 'true');
          }
          return;
        }
      });
      // this.validateInputs();
      // });
    }
  }

  cancelOTPVerification() {
    this.twoStepVerification = false;
    this.ErrorMsg = '';
    this.isError = false;
  }
  // sendOTP() {
  //   this.optVerification = true;
  // }
  ngAfterViewChecked() {
    $('.digit-group')
      .find('input')
      .each(function () {
        $(this).attr('maxlength', 1);
        $(this).on('keyup', function (e) {
          const parent = $($(this).parent());

          if (e.keyCode === 8 || e.keyCode === 37) {
            const prev = parent.find('input#' + $(this).data('previous'));

            if (prev.length) {
              $(prev).select();
            }
          } else if (
            (e.keyCode >= 48 && e.keyCode <= 57) ||
            (e.keyCode >= 65 && e.keyCode <= 90) ||
            (e.keyCode >= 96 && e.keyCode <= 105) ||
            e.keyCode === 39
          ) {
            const next = parent.find('input#' + $(this).data('next'));

            if (next.length) {
              $(next).select();
            } else {
              if (parent.data('autosubmit')) {
                parent.submit();
              }
            }
          }
        });
      });
  }
  goToNext() {}

  verifyOTP() {
    // this.selectUserType();
    let otp = '';
    document
      .querySelectorAll('.digit-group>input')
      .forEach((e: HTMLInputElement) => {
        otp += e.value;
      });
    this.loginApi
      .IsValidOTP(this.username, this.EntityID, this.FinIQGroupID, otp)
      .subscribe((res) => {
        // let res = 'SUCCESS';
        // console.log(otp, res);
        const otpValidity = res.toUpperCase();
        switch (otpValidity) {
          case 'SUCCESS':
            this.selectUserType();
            break;
          case 'UNMATCH':
            this.isError = true;
            this.ErrorMsg = 'Login Failed! <br> Please enter valid OTP.';
            break;
          case 'EXPIRED':
            this.isError = true;
            this.ErrorMsg =
              'Login Failed! <br> OTP expired. Please login again.';
            break;

          default:
            break;
        }
      });
  }
  async generateOTP() {
    try {
      this.loginApi
        .GenerateOTP(this.username, this.authorApi.EntityID, this.FinIQGroupID)
        .subscribe(async (_resOTP) => {
          // console.log(resOTP);
          this.TwoStepOTPValidityPeriod = await this.loginApi
            .GetOTPValidityPeriod()
            .then((response: any) => {
              const res = response.Get_Config_ValueResult[0].Config_Value;
              return Number(res);
            })
            .catch((_response: any) => {
              return 60;
            });
          this.OTPValidityTimer = this.TwoStepOTPValidityPeriod;
          this.OTPValidityInterval = setInterval(() => {
            if (this.OTPValidityTimer > 0) {
              this.OTPValidityTimer--;
            } else {
              clearInterval(this.OTPValidityInterval);
            }
          }, 1000);
        });
    } catch (error) {}
  }

  firstCustomerRegistration() {
    this.custApi.isFirstCustomerLogin.next(true);
  }
  register() {
    // this.userType = sessionStorage.getItem('UserType');
    switch (this.userType.toUpperCase()) {
      case 'CLIENT':
        this.router.navigate(['/customerregsetup/1/FCL']);
        break;
      case 'RM':
        this.router.navigate(['/register/rm']);
        break;
      case 'EMPLOYER':
        // this.router.navigate(['home' + this.username]);
        break;
      case 'ADMIN':
        // this.router.navigate(['Menu']);
        break;
      case 'NEWUSER':
        // this.router.navigate(['customersetup/3/FPFCL']);
        break;
      default:
        this.router.navigate(['welcome']);
        break;
    }
  }
}
