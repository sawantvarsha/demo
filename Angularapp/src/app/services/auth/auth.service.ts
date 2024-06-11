import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  interfaceURL = environment.interfaceURL;
  public EntityID: any;
  public EntityCode: any;
  public EntityName: any;
  public UserName: any;
  public UserType: any;
  constructor(public http: HttpClient) {
    this.EntityID = '';
    this.UserName = sessionStorage.getItem('Username') || '';
    this.UserType = sessionStorage.getItem('UserType') || '';
  }
  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('SessionToken');
    this.UserName = sessionStorage.getItem('Username');
    // Check whether the token is expired and return
    // true or false
    return !!token;
  }

  AuthorizeUser(username) {
    const webMethod = this.interfaceURL + 'AuthoriseUser';
    const parameters = {
      UserID: username,
      EntityID: this.EntityID,
    };

    const result = this.http.post<any>(webMethod, parameters);
    return result;
  }

  GetUnAuthorizedUsers() {
    const webMethod = this.interfaceURL + 'GetUnAuthorizedUserList';
    return this.http.get<any>(webMethod);
  }
}
