import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: environment.lssURL,
        redirectUrl: window.location.origin + '/' + environment.hostedApp,
        postLogoutRedirectUri:
        window.location.origin + '/' + environment.hostedApp,
        clientId: 'eu',
        scope: 'openid profile offline_access api',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        silentRenewTimeoutInSeconds: 300,
        tokenRefreshInSeconds: 5,
        refreshTokenRetryInSeconds: 5,
        renewTimeBeforeTokenExpiresInSeconds: 30,
        ignoreNonceAfterRefresh: true,
        logLevel: LogLevel.None,
        customParamsRefreshTokenRequest: {
          scope: 'openid profile offline_access api',
        },
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule { }
