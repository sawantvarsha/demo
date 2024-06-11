import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, OnChanges } from '@angular/core';
import { LoginApiService } from 'src/app/services/auth/login-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomerApiService } from '../../../services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';

@Component({
  selector: 'app-customer-sub-account',
  templateUrl: './customer-sub-account.component.html',
  styleUrls: ['./customer-sub-account.component.scss']
})
export class CustomerSubAccountComponent implements OnInit, OnDestroy, OnChanges {

  @Input() Mode: number; // 1-Read Only, 2- Edit Mode
  @Input() index: number;
  @Input() PortfolioID: string;
  @Input() NoteMasterId: string;
  @Input() CreateSubAccFlag: boolean;

  // @Input()
  // get subaccount(): any { return this.childsubaccount; }
  // set subaccount(acc: any) {
  //   console.log(acc);
  //   // acc.addedvalue = 'TEMP';
  //   acc.subaccount.username.selectedValue = this.SubAccountForm[0].selectedValue ,
  //   acc.emailid.selectedValue = this.SubAccountForm[1].selectedValue ,
  //   acc.password.selectedValue = this.SubAccountForm[2].selectedValue ,
  //   acc.confirmpassword.selectedValue = this.SubAccountForm[3].selectedValue
  //   // this._name = (name && name.trim()) || '<no name set>';
  // }

  @Output() CancelCreateAccount = new EventEmitter<string>();
  @Output() IsPortforlioHavingSubAccount = new EventEmitter<string>();
  
  barLabel = 'Password Strength:';
  NotificationMsg = '';
  SubAccounts = [];

  constructor(public authorApi: AuthService, public loginApi: LoginApiService, public CustApi: CustomerApiService, public HomeApi: HomeApiService) { }

  SubAccountForm = [
    {
      controlName: 'Username',
      selectedValue: '',
      controlType: 'text',
      isRequired: true
    },
    {
      controlName: 'Email address',
      selectedValue: '',
      controlType: 'email',
      isRequired: true
    },
    {
      controlName: 'Password',
      selectedValue: '',
      controlType: 'password',
      isRequired: true
    },
    {
      controlName: 'Confirm Password',
      selectedValue: '',
      controlType: 'password',
      isRequired: true
    },
  ]

  ngOnInit(): void {
    // this.SubAccountForm[1].selectedValue = sessionStorage.getItem('EmailID');
    if (this.Mode === 1) {
      // Read Only
      this.fnGetPortfolioSubAccountDetails();
    } else {
      // Edit mode
    }

  }

  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.CreateSubAccFlag) {
      console.log('createAccount');
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.SubAccounts = [];
    this.SubAccountForm = [];
  }

  fnGetPortfolioSubAccountDetails() {
    this.CustApi.fnGetPortfolioSubAccountDetails(this.NoteMasterId, this.PortfolioID).subscribe(element => {
      if (element) {
        // console.log(element.PortfolioSubAccountDetailsResult);
        this.SubAccounts = JSON.parse(element.PortfolioSubAccountDetailsResult);
        this.IsPortforlioHavingSubAccount.emit(this.index + ',' + (this.SubAccounts.length > 0 ? 'true' : 'false'));
      }
    });
    this.IsPortforlioHavingSubAccount.emit(this.index + ',' + (this.SubAccounts.length > 0 ? 'true' : 'false'));
  }

  // fnCreateAccount(): boolean {
  //   if (this.fnVerifyRequestBeforeSubmit()) {
  //     this.loginApi.RegisterUser(
  //       this.SubAccountForm[0].selectedValue,
  //       this.SubAccountForm[1].selectedValue,
  //       this.SubAccountForm[2].selectedValue,
  //       '40.65.134.77',
  //       'Stanhope',
  //       'WINDOWS',
  //       'OnlineBanking_SA',
  //       this.authorApi.EntityID
  //     )
  //       .subscribe((res) => {
  //         if (res.Status) {
  //           switch (res.Status) {
  //             case 1:
  //               this.loginApi.SendVerifyMail(this.SubAccountForm[0].selectedValue).subscribe((mail) => {
  //                 if (mail.InsertEmailNotificationStatusResult === 'Success') {

  //                   this.NotificationMsg = res.ResponseMessage;

  //                   // this.SubAccountForm.forEach(element => {
  //                   //   if (element.tagName === 'CSS_Email_ID') {
  //                   //     element.selectedValue = this.SubAccountForm[1].selectedValue;
  //                   //   }
  //                   // });
  //                 }

  //               });
  //               this.fnSetSubAccountToPortfolio();
  //               break;
  //             case 2:
  //               this.NotificationMsg = 'Registration Unsuccessful! ' + res.ResponseMessage;
  //               break;
  //             default:
  //               break;
  //           }
  //         }
  //       });
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // fnSetSubAccountToPortfolio() {
  //   this.CustApi.fnSetSubAccountToPortfolio(this.authorApi.UserName, this.SubAccountForm[0].selectedValue, this.NoteMasterId, this.PortfolioID).subscribe(res => {
  //     if (res) {
  //       console.log(res);
  //       return true;
  //     }
  //   });
  // }

  // fnVerifyRequestBeforeSubmit() {
  //   if (this.SubAccountForm[0].selectedValue === '' ||
  //     this.SubAccountForm[2].selectedValue === '' ||
  //     this.SubAccountForm[3].selectedValue === '' ||
  //     this.SubAccountForm[1].selectedValue === '') {
  //     this.NotificationMsg = 'Please enter all the Registration fields!';
  //     return false;
  //   }
  //   if (this.SubAccountForm[2].selectedValue !== this.SubAccountForm[3].selectedValue) {
  //     this.NotificationMsg = 'Password don\'t match!';
  //     return false;
  //   }
  //   if (!this.fnValidateEmail(this.SubAccountForm[1].selectedValue)) {
  //     this.NotificationMsg = 'Please enter correct Email Id!';
  //     return false;
  //   }
  //   return true;
  // }

  fnCancelCreateSubAccount(): void {
    this.CancelCreateAccount.emit(false + ',' + this.index);
  }

  // fnValidateEmail(email) {
  //   const re =
  //     /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  //   return re.test(email);
  // }
}
