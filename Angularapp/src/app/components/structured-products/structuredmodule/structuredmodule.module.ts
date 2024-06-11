import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ELNComponent } from '../Products/eln/eln.component';
import { FCNComponent } from '../Products/fcn/fcn.component';
import { DRAComponent } from '../Products/dra/dra.component';
import { AccuComponent } from '../Products/accu/accu.component';
import { DecuComponent } from '../Products/decu/decu.component';
// import { AqComponent } from '../Products/aq/aq.component';
// import { DqComponent } from '../Products/dq/dq.component';
import { OptionsComponent } from '../Products/options/options.component';
import { BENComponent } from '../Products/ben/ben.component';
import { PhoenixComponent } from '../Products/phoenix/phoenix.component';

import { UnderlyingComponent } from '../Common-Components/underlying/underlying.component';
import { SearchUnderlyingPipe } from '../Common-Components/pipes/search-underlying.pipe';
import { EQCPricingComponent } from '../Common-Components/pricing/pricing.component';
// import { LoaderComponent } from '../Common-Components/loader/loader.component';
import { HttpClient } from '@angular/common/http';
import { ShareDetailsComponent } from '../Common-Components/share-details/share-details.component';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';
import { GoogleChartsModule } from 'angular-google-charts';
// export function HttpLoaderFactory(httpClient: HttpClient) {
//   return new TranslateHttpLoader(httpClient,'./assets/i18n/', '.json');
// }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    ELNComponent,
    FCNComponent,
    DRAComponent,
    AccuComponent,
    DecuComponent,
    // AqComponent,
    // DqComponent,
    OptionsComponent,
    BENComponent,
    PhoenixComponent,
    UnderlyingComponent,
    SearchUnderlyingPipe,
    EQCPricingComponent,
    // LoaderComponent,
    ShareDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedComponentsModule,
    GoogleChartsModule.forRoot({ version: '1.1' }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    ELNComponent,
    FCNComponent,
    DRAComponent,
    AccuComponent,
    DecuComponent,
    // AqComponent,
    // DqComponent,
    OptionsComponent,
    BENComponent,
    PhoenixComponent,
    UnderlyingComponent,
    SearchUnderlyingPipe,
    EQCPricingComponent,
    // LoaderComponent,
    ShareDetailsComponent,
  ],
})
export class StructuredmoduleModule {}
