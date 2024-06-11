import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FXDRoutingModule } from './fxd-routing.module';
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';

// import { CardDashboardComponent } from '../../components/FXD/card-dashboard/card-dashboard.component';
// import { VanillaComponent } from '../../components/FXD/products/vanilla/vanilla.component';
import { FXDDashboardComponent } from '../../components/FXD/fxddashboard/fxddashboard.component';

// import { PricingComponent } from '../../components/FXD/Common-Components/pricing/pricing.component';
// import { ScheduleComponent } from '../../components/FXD/Common-Components/schedule/schedule.component';
// import { SIVChartsComponent } from '../../components/FXD/Common-Components/siv-charts/siv-charts.component';

// import { BarrierComponent } from '../../components/FXD/products/barrier/barrier.component';
// import { AqdqComponent } from '../../components/FXD/products/aqdq/aqdq.component';
// import { TrfComponent } from '../../components/FXD/products/trf/trf.component';
// import { PivotComponent } from '../../components/FXD/products/pivot/pivot.component';
import { DciComponent } from '../../components/FXD/products/dci/dci.component';
// import { StrategyComponent } from '../../components/FXD/products/strategy/strategy.component';
// import { DigitalComponent } from '../../components/FXD/products/digital/digital.component';

import { httpTranslateLoader } from 'src/app/interceptor/http-translate.interceptor';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';
import { RFQLogMonitorComponent } from './rfqlog-monitor/rfqlog-monitor.component';
import { NgxPaginationModule, PaginationControlsComponent } from 'ngx-pagination';
import { SanitizeHtmlPipePipe } from './services/sanitize-html-pipe.pipe'; //added by UrmilaA | 29-July-23

// import { NotificationsComponent } from './Common-Components/notifications/notifications.component'; //added by UrmilaA | 7-Aug-23
// import { NotificationsComponent } from '../../components/structured-products/Common-Components/notifications/notifications.component';
// import { SearchPipe } from './common-components/pipes/search.pipe';
// import { CustomerSearchComponent } from './Common-Components/controls/customer-search/customer-search.component';
// import { SearchccyPipe } from './Common-Components/pipes/searchccy.pipe';
// import * as PlotlyJS from 'plotly.js/dist/plotly.js';
// import { PlotlyModule } from 'angular-plotly.js';
// PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    // CardDashboardComponent,
    FXDDashboardComponent,
    // ScheduleComponent,
    // VanillaComponent,
    // BarrierComponent,
    // AqdqComponent,
    // TrfComponent,
    // PivotComponent,
    DciComponent,
    RFQLogMonitorComponent,
    SanitizeHtmlPipePipe, //added by UrmilaA | 29-July-23
    // NotificationsComponent //added by UrmilaA | 7-Aug-23

    // NotificationsComponent
    // OrderplacementpopupComponent,
    // SearchPipe,
    // CustomerSearchComponent,
    // StrategyComponent,
    // DigitalComponent,
    // SearchccyPipe,
  ],
  imports: [
    SharedComponentsModule,
    CommonModule,
    FXDRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    // PlotlyModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [TranslatePipe,SanitizeHtmlPipePipe], //added by UrmilaA | 29-July-23
  exports:[SanitizeHtmlPipePipe] //added by UrmilaA | 29-July-23
})
export class FXDModule { }
