import { APP_INITIALIZER, NgModule } from '@angular/core';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
  HttpClientXsrfModule,
} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AuthConfigModule } from './auth/auth-config.module';
import { HttpBearerTokenInterceptor } from './interceptor/http-bearer-token.interceptor';
import { HttpErrorInterceptor } from './interceptor/http-error.interceptor';
import { AppConfig } from './services/config.service';

import {
  TranslateLoader,
  TranslateModule,
  TranslatePipe,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; //ChitraM | 5-May-23 | FIN1EURINT-100
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from './modules/shared-components.module';
// import { SpPortfolioSnapshotComponent } from './sp-portfolio-snapshot/sp-portfolio-snapshot.component';
import { HttpCSRFInterceptor } from './interceptor/http-csrf.interceptor';
//import { SpPaymentsReconComponent } from './components/sp-payments-recon/sp-payments-recon.component';
export function initializeApp(appConfig: AppConfig) {
  return async () => await appConfig.load()
}


@NgModule({
  declarations: [
    AppComponent,
    //SpPaymentsReconComponent,
   // SpPortfolioSnapshotComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    AuthConfigModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory, //ChitraM | 5-May-23 | FIN1EURINT-100
        deps: [HttpClient],
      },
    }),

  ],
  providers: [
    AppConfig,
    DatePipe,
    DecimalPipe,
    TranslatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi: true,
    },
    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpBearerTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    // Added by KaustubhS for XSRF token APT || 09-Oct-2023 || START   
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCSRFInterceptor,
      multi: true,
    },   
    // Added by KaustubhS for XSRF token APT || 09-Oct-2023 || END
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

//ChitraM | 5-May-23 | FIN1EURINT-100
// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '/EuroconnectPortal/assets/i18n/', '.json');
}