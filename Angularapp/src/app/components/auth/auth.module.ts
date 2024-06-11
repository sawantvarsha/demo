import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { VerifyLoginComponent } from './verify-login/verify-login.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/interceptor/http-translate.interceptor';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    VerifyLoginComponent,
  ],
  imports: [
    SharedComponentsModule,
    AuthRoutingModule,
    CommonModule,
    ClickOutsideModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers:[
    TranslatePipe
  ]
})
export class AuthModule { }
