import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponseBase,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { OauthService } from '../services/oauth/oauth.service';
import { environment } from '../../environments/environment';
import { AppConfig } from '../services/config.service';


@Injectable()
export class HttpBearerTokenInterceptor implements HttpInterceptor {
  constructor(
    public oidc: OidcSecurityService,
    public oauthApi: OauthService
  ) { 
    this.hashingFlag = AppConfig.settings?.isHashingEnabled;
    if(this.hashingFlag === undefined || this.hashingFlag === null || !this.hashingFlag.toString().trim()) {
      this.hashingFlag = true;
    }
    this.hKey = AppConfig.settings?.hkey || 'C1PFxPgKepndcdBCqU6yYODCDlSw0W2v';
  }
  //ignoreUrls = ['oauth/token', '.well-known/jwks', 'oauth/userinfo']; //Sudarshan | APT issue reported userinfo request intercept 
  //Added by Apurva K/ Varsha G for Spanish logout issue || FSLINT-14 || 25-Oct-2023
  ignoreUrls = ['oauth/token', '.well-known/jwks', '/assets/i18n/']; 
  ciphertext: any = '';
  hashingFlag: boolean;
  hKey: string = '';
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const CryptoJS = require('crypto-js');
    environment.production = true;                                   // Only for Hosted endpoint
    let url = request.url.replace(/http[s]:\/\/[^./]+\//g, '');
    if (environment.production) {
      url = request.url.replace(/http[s]:\/\/[^//]*\/[^//]*\//g, '');
    }
    // console.log(url);
    //Added by Apurva K/ Varsha G for Spanish logout issue || FSLINT-14 || 25-Oct-2023
    if (this.ignoreUrls.includes(url)||url.includes(this.ignoreUrls[2])) {
      return next.handle(request).pipe(
        map((e: any) => {
          if (e instanceof HttpResponseBase) {
            const response: any = e as HttpResponseBase;
            if (url === this.ignoreUrls[0])
              this.oauthApi.access_token = response?.body.access_token;

              sessionStorage.setItem("nested_", this.oauthApi.access_token); // HSBCFXEINT-2 | Added by Chaitanya M after discussion with Rijwan S to store the access token | 03-Nov-2023
          
          }
          return e;
        })
      );
    }
   
    // this.oidc
    //   .getAccessToken()
    //   .pipe(map((res) => (this.oauthApi.access_token = res)));

    
    //const hKey = this.oauthApi.hkey;
    if (this.hashingFlag) {
      if (request.method === 'GET') {
        this.ciphertext = CryptoJS.HmacSHA256(
          request.url,
          this.hKey
        ).toString();
      } else if (request.method === 'POST') {
        const hashSeed = request.url + (typeof request.body !== typeof ''
          ? JSON.stringify(request.body)
          : request.body);
        this.ciphertext = CryptoJS.HmacSHA256(
          hashSeed,
          this.hKey
        ).toString();
      }
      this.ciphertext = this.ciphertext.toUpperCase();

      const req =
        this.oauthApi.access_token === ''
          ? request
          : request.clone({
            withCredentials: true,
            headers: new HttpHeaders({
              Authorization: 'Bearer ' + this.oauthApi.access_token,
              hash: this.ciphertext,
            }),
          });
	  
      //<Sudarshan | APT issue response tampring | added condition to compare hash in response headers >
      return next.handle(req).pipe(
        map((response) => {
          if (response instanceof HttpResponse) {
            let respHash : string;
            const body =  response.body ? JSON.stringify(response.body) : "";
            respHash = CryptoJS.HmacSHA256(
              body,
              this.hKey
            ).toString().replaceAll("-","").toUpperCase();
            //alert('url: - '+ req.url + ' angularhash: -' + this.ciphertext+ ' dotnethash: -' + response.headers?.get('Resphkey'));
            if (respHash != response.headers?.get('Resphkey'))         
              this.oauthApi.logout();
            
          }
          return response;
        })
	  //</Sudarshan | APT issue response modify | added condition to compare hash in response headers >
      );

    } else {
      const req =
        this.oauthApi.access_token === ''
          ? request
          : request.clone({
            withCredentials: true,
            headers: new HttpHeaders({
              Authorization: 'Bearer ' + this.oauthApi.access_token,
            }),
          });
      return next.handle(req).pipe(
        map((res: any) => {
          if (res instanceof HttpResponseBase) {
            const response = res as HttpResponseBase;
            // console.log(response.status);
          }

          return res;
        })
      );
    }

    
  }
}
