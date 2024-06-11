import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconsComponent } from '../extras/svg-icons/svg-icons.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../components/FXD/Common-Components/loader/loader.component';
import { CardDashboardComponent } from '../components/FXD/card-dashboard/card-dashboard.component';
import { VanillaComponent } from '../components/FXD/products/vanilla/vanilla.component';
import { BarrierComponent } from '../components/FXD/products/barrier/barrier.component';
import { DigitalComponent } from '../components/FXD/products/digital/digital.component';
import { StrategyComponent } from '../components/FXD/products/strategy/strategy.component';
import { TrfComponent } from '../components/FXD/products/trf/trf.component';
import { PivotComponent } from '../components/FXD/products/pivot/pivot.component';
import { AqdqComponent } from '../components/FXD/products/aqdq/aqdq.component';
import { ScheduleComponent } from '../components/FXD/Common-Components/schedule/schedule.component';
import { PricingComponent } from '../components/FXD/Common-Components/pricing/pricing.component';
import { SIVChartsComponent } from '../components/FXD/Common-Components/siv-charts/siv-charts.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { ToggleControlComponent } from '../components/FXD/Common-Components/controls/toggle-control/toggle-control.component';
import { CcypairselectorComponent } from '../components/FXD/Common-Components/controls/ccypairselector/ccypairselector.component';
import { SearchccyPipe } from '../components/FXD/Common-Components/pipes/searchccy.pipe';
import { CustomerSearchComponent } from '../components/FXD/Common-Components/controls/customer-search/customer-search.component';
// import { FXDSearchPipe } from '../components/FXD/Common-Components/pipes/search.pipe';
import { OrderplacementpopupComponent } from '../components/FXD/Common-Components/orderplacementpopup/orderplacementpopup.component';
import { RemarkComponent } from '../components/FXD/Common-Components/remark/remark.component';
import { ContractSummaryComponent } from '../components/FXD/Common-Components/contract-summary/contract-summary.component';
import { SearchPipe } from '../pipes/search.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FxdPopupComponent } from '../components/FXD/Common-Components/fxd-popup/fxd-popup.component';

// import { EcPricersModule } from '../components/euroconnect/components/ec-pricers/ec-pricers.module'; //commented by Urmila A | 20-sep-23 as it was affecting FXD route

import { NotificationsComponent } from '../components/FXD/Common-Components/notifications/notifications.component';
@NgModule({
  declarations: [
    SvgIconsComponent,
    LoaderComponent,
    CardDashboardComponent,
    VanillaComponent,
    BarrierComponent,
    DigitalComponent,
    StrategyComponent,
    AqdqComponent,
    TrfComponent,
    PivotComponent,
    PricingComponent,
    SIVChartsComponent,
    ToggleControlComponent,
    CcypairselectorComponent,
    SearchccyPipe,
    SearchPipe,
    ScheduleComponent,
    CustomerSearchComponent,
    OrderplacementpopupComponent,
    RemarkComponent,
    ContractSummaryComponent,
    FxdPopupComponent, //Urmila A | 11-Sep-23 
    NotificationsComponent
    // FXDSearchPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleChartsModule.forRoot({ version: '1.1' }),
    MatSlideToggleModule,
    // EcPricersModule //commented by Urmila A | 20-sep-23 as it was affecting FXD route
  ],
  exports: [
    SvgIconsComponent,
    LoaderComponent,
    CardDashboardComponent,
    VanillaComponent,
    BarrierComponent,
    DigitalComponent,
    StrategyComponent,
    AqdqComponent,
    TrfComponent,
    PivotComponent,
    PricingComponent,
    SIVChartsComponent,
    ToggleControlComponent,
    SearchccyPipe,
    ScheduleComponent,
    CustomerSearchComponent,
    OrderplacementpopupComponent,
    FxdPopupComponent,
    NotificationsComponent,
    SearchPipe,
    MatSlideToggleModule,

 
    // FXDSearchPipe
  ],
})
export class SharedComponentsModule {}
