import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';
declare global {
  interface Array<T> {
    remove(p): Array<T>;
  }
}
Array.prototype.remove = function () {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};
@Component({
  selector: 'app-authorize-user',
  templateUrl: './authorize-user.component.html',
  styleUrls: ['./authorize-user.component.scss']
})

export class AuthorizeUserComponent implements OnInit {

  isProd = environment.production;
  loadflag = false;
  username: string;
  message: any;
  unAuthorizedUserList: any[];
  unAuthorizedUserListRes: any[];
  markedForAuth: any[];
  markedForAuthInterval: any;

  constructor(public authService: AuthService) {
    this.message = '';
    this.unAuthorizedUserList = [];
    this.unAuthorizedUserListRes = [];
    this.markedForAuth = [];
    this.username = '';
  }

  ngOnInit(): void {
    this.getUnauthorizedUserList();
  }

  authorizeUser() {
    if (this.markedForAuth.length > 0) {
      this.markedForAuthInterval = setInterval(() => {
        if (this.markedForAuth.length > 0) {
          this.authService.AuthorizeUser(this.markedForAuth[0]).subscribe((res) => {
            // console.log(res);
            if (res.RequestProcessed) {
              this.message = res.ProcessResponseMessage;
              this.markedForAuth.remove(this.markedForAuth[0]);
              this.getUnauthorizedUserList();
            } else {
              this.message = this.markedForAuth[0] + ' User already Authorized.';
            }
          });
        } else {
          clearInterval(this.markedForAuthInterval);
          setTimeout(() => {
            this.message = '';
          }, 2000);
        }
      }, 2000);
      // console.log(this.message);
    } else {
      this.message = 'Please select users.';
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
  filterUsers() {
    // console.log(this.username);
    if (this.username !== '') {
      this.unAuthorizedUserList = this.unAuthorizedUserListRes.filter(user => user.UserName.toLowerCase().includes(this.username.toLowerCase()))
    } else {
      this.unAuthorizedUserList = this.unAuthorizedUserListRes;
    }
  }
  markForAuthorization(username, checked) {
    if (checked) {
      this.markedForAuth.push(username);
    } else {
      this.markedForAuth.remove(username);
    }
  }
  getUnauthorizedUserList() {
    this.authService.GetUnAuthorizedUsers().subscribe(res => {
      // console.log(res);
      this.unAuthorizedUserListRes = res;
      this.unAuthorizedUserList = this.unAuthorizedUserListRes = this.unAuthorizedUserListRes.map(e => {
        return {
          UserName: e.L_ID[0],
          UserType: e.L_type[0],
        };
      }).sort((a, b) => {
        if (a.UserName < b.UserName) {
          return -1;
        }
        if (a.UserName > b.UserName) {
          return 1;
        }
        return 0;
      });
    })
  }
}
