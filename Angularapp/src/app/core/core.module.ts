import {  
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}
import { CoreRoutingModule } from './core-routing.module';
import { LoginComponent } from '../components/auth/login/login.component';
import { RegisterComponent } from '../components/auth/register/register.component';
import { PasswordOverrideComponent } from '../components/auth/password-override/password-override.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
// import { DashboardComponent } from '../components/workflow/dashboard/dashboard.component';
// import { CashdepositComponent } from '../components/workflow/cashdeposit/cashdeposit.component';
// import { WorkflowblotterComponent } from '../components/workflow/workflowblotter/workflowblotter.component';
import { PasswordStrengthBarComponent } from '../components/auth/password-strength-bar/password-strength-bar.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
// import { HomeComponent } from '../components/home/home.component';
// import { ValidateUserComponent } from '../components/customer/validate-user/validate-user.component';
// import { NeworderentryComponent } from '../components/workflow/neworderentry/neworderentry.component';
// import { AmfundsComponent } from '../components/workflow/neworderentry/amfunds/amfunds.component';
// import { MutualfundsComponent } from '../components/workflow/neworderentry/mutualfunds/mutualfunds.component';
// import { BondsComponent } from '../components/workflow/neworderentry/bonds/bonds.component';
// import { SharesComponent } from '../components/workflow/neworderentry/shares/shares.component';
// import { FixeddepositComponent } from '../components/workflow/neworderentry/fixeddeposit/fixeddeposit.component';
// import { InsuranceComponent } from '../components/workflow/neworderentry/insurance/insurance.component';
// import { StatementsComponent } from '../components/customer/statements/statements.component';
// import { PortfolioallocationComponent } from '../components/customer/reporting/portfolioallocation/portfolioallocation.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
// import { DragdropComponent } from '../extras/dragdrop/dragdrop.component';
// import { PolicydetailsComponent } from '../components/Insurance/policydetails/policydetails.component';
// import { PaymenthistoryComponent } from '../components/Insurance/paymenthistory/paymenthistory.component';
// import { PremiumCalendarComponent } from '../components/Insurance/premium-calendar/premium-calendar.component';
// import { RegularinvestmentschemeComponent } from '../components/customer/regularinvestmentscheme/regularinvestmentscheme.component';
// import { FeesndchargesComponent } from '../components/customer/feesndcharges/feesndcharges.component';
// import { RMWComponent } from '../components/RMWorkstation/rmw/rmw.component';
// import { DynamicFormComponent } from '../components/RMWorkstation/dynamic-form/dynamic-form.component';
// import { CollateralComponent } from '../components/collateral/collateral.component';
// import { CustomerMarginReportComponent } from '../components/collateral/components/customer-margin-report/customer-margin-report.component';
// import { MarginDetailsComponent } from '../components/collateral/components/customer-margin-report/margin-details/margin-details.component';
// import { CollateralDetailsComponent } from '../components/collateral/components/customer-margin-report/collateral-details/collateral-details.component';
// import { LimitUtilizationComponent } from '../components/collateral/components/customer-margin-report/limit-utilization/limit-utilization.component';
// import { MarginRatioComponent } from '../components/collateral/components/customer-margin-report/margin-ratio/margin-ratio.component';
// import { GlobalMarginReportComponent } from '../components/collateral/components/global-margin-report/global-margin-report.component';
// import { ReportComponent } from '../components/collateral/components/report/report.component';
// import { ClientResponseComponent } from '../components/customer/client-response/client-response.component';
// import { LoanComponent } from '../components/loan/loan.component';
// import { LoanOrderentryComponent } from '../components/loan/loan-orderentry/loan-orderentry.component';
// import { OverdraftComponent } from '../components/loan/overdraft/overdraft.component';
// import { MutualfundCompareComponent } from '../components/utilities/mutualfund-compare/mutualfund-compare.component';
// import { FilterFundsPipe } from '../pipes/filter-funds.pipe';
// import { NewOrderComponent } from '../components/utilities/new-order/new-order.component';
// import { LoginRMDetailsComponent } from '../components/customer/login-rmdetails/login-rmdetails.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { WelcomeComponent } from '../components/auth/welcome/welcome.component';
import { CommonCustomerSearchComponent } from '../components/controls/customer-search/customer-search.component';
//import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxSliderModule } from 'ngx-slider-v2';
// import { CAEvenetDiaryComponent } from '../components/customer/ca-evenet-diary/ca-evenet-diary.component';
// import { SunburstComponent } from '../components/utilities/sunburst/sunburst.component';
// import { NewsComponent } from '../components/utilities/news/news.component';
// import { SearchNewsPipe } from '../pipes/search-news.pipe';
// import { CardsComponent } from '../components/home/cards/cards.component';
// import { RegisterMenuComponent } from '../components/register-menu/register-menu.component';
// import { WFBlotterComponent } from '../components/workflow/wfblotter/wfblotter.component';
// import { EventSearchPipe } from '../components/customer/event-alert/event-search-pipe.pipe';
import { FilterPipe } from '../pipes/filter.pipe';
// import { FXSpotComponent } from '../components/workflow/neworderentry/fxspot/fxspot.component';
import {
  CommonModule,
  TitleCasePipe,
} from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
// import { EventAlertComponent } from '../components/customer/event-alert/event-alert.component';

// import { ClientOnboardingComponent } from '../components/customer/client-onboarding/client-onboarding.component';
// import { DynamicControlComponent } from '../components/customer/client-onboarding/dynamic-control/dynamic-control.component';
// import { NewEntryComponent } from '../components/customer/client-onboarding/new-entry/new-entry.component';
// import { DropdownTypeFilterPipe } from '../pipes/dropdown-type-filter.pipe';
// import { WorkflowComponent } from '../components/customer/client-onboarding/workflow/workflow.component';
// ------------------ FX Trading ------------------------
// import { FxOrderComponent } from '../../app/components/fx-order/fx-order.component';
// import { ExchangeRateDisplayComponent } from '../../app/components/fx-order/exchange-rate-display/exchange-rate-display.component';
// import { SingleCardComponent } from '../../app/components/fx-order/single-card/single-card.component';
import { AngularMaterialModule } from '../../app/components/fx-order/angular-material.module';
// import { TransactionComponent } from '../../app/components/fx-order/transaction/transaction.component';
// import { LimitorderComponent } from '../../app/components/fx-order/limitorder/limitorder.component';
// import { NewtransactionComponent } from '../../app/components/fx-order/transaction/newtransaction/newtransaction.component';
// import { OrderEntryComponent } from '../../app/components/fx-order/limitorder/order-entry/order-entry.component';
// import { SpotforwardblotterComponent } from '../../app/components/fx-order/transaction/spotforwardblotter/spotforwardblotter.component';
// import { CalenderControlComponent } from '../../app/components/fx-order/limitorder/calender-control/calender-control.component';
// import { Tab2Component } from '../../app/components/fx-order/limitorder/tab2/tab2.component';
// import { BlotterRowComponent } from '../../app/components/fx-order/limitorder/tab2/blotter-row/blotter-row.component';
// import { OrderhistoryComponent } from '../../app/components/fx-order/limitorder/orderhistory/orderhistory.component';
// import { SingleRowComponent } from '../../app/components/fx-order/limitorder/orderhistory/single-row/single-row.component';
// import { SearchPipeFx } from '../../app/components/fx-order/search.pipe';
// import { DailyLimitsComponent } from '../../app/components/fx-order/daily-limits/daily-limits.component';
// import { PositionBlotterComponent } from '../../app/components/fx-order/position-blotter/position-blotter.component';
// import { MaturingtransactionComponent } from '../../app/components/fx-order/transaction/maturingtransaction/maturingtransaction.component';
import { ScriptLoaderService } from 'angular-google-charts';
// import { TradingInsightsComponent } from '../../app/components/fx-order/trading-insights/trading-insights.component';
// import { SpreadManageComponent } from '../../app/components/fx-order/spread-manage/spread-manage.component';
// import { TransactionLimitComponent } from '../../app/components/fx-order/transaction-limit/TransactionLimit.component';
// import { RmCustomerMapperComponent } from '../components/customer/rm-customer-mapper/rm-customer-mapper.component';
// import { AuthorizeUserComponent } from '../components/auth/authorize-user/authorize-user.component';
import { AppConfig } from '../services/config.service';
// import { SpotComponent } from '../components/fx-order/spot/spot.component';
// import { ForwardComponent } from '../components/fx-order/forward/forward.component';
// import { CustfilterPipe } from '../pipes/custfilter.pipe';
// import { CustomerSetupComponent } from '../components/customer/customer-setup/customer-setup.component';
// import { CustomerSetupViewComponent } from '../components/customer/customer-setup-view/customer-setup-view.component';
// import { CustomerAccountDetailsComponent } from '../components/customer/customer-account-details/customer-account-details.component';
import { ClickOutsideModule } from 'ng-click-outside';
// import { CustomerSetupUpdateCpraDetailsComponent } from '../components/customer/customer-setup-update-cpra-details/customer-setup-update-cpra-details.component';
// import { SlideshowComponent } from '../components/auth/slideshow/slideshow.component';
// import { CustomerSetupEditProfileComponent } from '../components/customer/customer-setup-edit-profile/customer-setup-edit-profile.component';
// import { CustomerSetupViewCpraDetailsComponent } from '../components/customer/customer-setup-view-cpra-details/customer-setup-view-cpra-details.component';
// import { MarginComponent } from '../components/margin/margin.component';
import { NgApexchartsModule } from 'ng-apexcharts';

import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { PledgeComponent } from '../components/workflow/neworderentry/pledge/pledge.component'; // Added by Ketan S for PDF Viewer on Terms and conditions
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { SchedulerComponent } from '../components/scheduler/scheduler.component';
// import { CustomerUpdateKycDetailsComponent } from '../components/customer/customer-update-kyc-details/customer-update-kyc-details.component';
// import { CustomerViewKycDetailsComponent } from '../components/customer/customer-view-kyc-details/customer-view-kyc-details.component';
// import { FinancialPlanningComponent } from '../components/utilities/financial-planning/financial-planning.component';
// import { EqDashboardComponent } from '../components/customer/eq-dashboard/eq-dashboard.component';
// import { CustomerFindSuitableProductComponent } from '../components/customer/customer-find-suitable-product/customer-find-suitable-product.component';
// import { LayoutComponent } from '../components/RMWorkstation/layout/layout.component';
// import { QuestionAnswerComponent } from '../components/customer/question-answer/question-answer.component';
// import { CustomerSetupResubmitRejectedClientComponent } from '../components/customer/customer-setup-resubmit-rejected-client/customer-setup-resubmit-rejected-client.component';
// import { CustomerPortfolioDetailsComponent } from '../components/customer/customer-portfolio-details/customer-portfolio-details.component';
// import { ClientSummaryComponent } from '../components/client-summary/client-summary.component';
import { MatPaginatorModule } from '@angular/material/paginator';
// import { MpgReportComponent } from '../components/client-summary/mpg-report/mpg-report.component';
// import { FiltersComponent } from '../components/client-summary/mpg-report/filters/filters.component';
// import { MpgComponent } from '../components/client-summary/mpg-report/mpg/mpg.component';
// import { SidenavDrawerComponent } from '../components/client-summary/mpg-report/sidenav-drawer/sidenav-drawer.component';
// import { FundDetailsComponent } from '../components/RMWorkstation/fund-details/fund-details.component';

// // import { MapleComponent } from '../components/maple/maple.component';
// import { AlertsAndEngagementComponent } from '../components/utilities/alerts-and-engagement/alerts-and-engagement.component';

// import { ModelSetupComponent } from '../components/portfolio/model-setup/model-setup.component';
// import { PortfolioComponent } from '../components/portfolio/portfolio.component';

// import { CustomersearchclientsummaryPipe } from '../pipes/customersearchclientsummary.pipe';

// import { UserDefinedDashboardsComponent } from '../components/user-defined-dashboards/user-defined-dashboards.component';
import { NgxFileDropModule } from 'ngx-file-drop';
// import { GridViewComponent } from '../components/user-defined-dashboards/grid-view/grid-view.component';

// import { CustomerPerformKycComponent } from '../components/customer/customer-perform-kyc/customer-perform-kyc.component';
import { WorkflowUCPComponent } from '../components/workflow-ucp/workflow-ucp.component'; // Added by Mitali D - 11-09-2023
import { MatDialogModule } from '@angular/material/dialog'; // Added by Mitali D - 11-09-2023
// import { BondDetailsComponent } from '../components/RMWorkstation/bond-details/bond-details.component';
// import { SupportComponent } from '../components/support/support.component';
// import { FxOrderAbnComponent } from '../components/fx-order-abn/fx-order-abn.component';
// import { FxCardComponent } from '../components/fx-order-abn/fx-card/fx-card.component';
// import { NewQuoteComponent } from '../components/fx-order-abn/new-quote/new-quote.component';
// import { RebalanceComponent } from '../components/customer/rebalance/rebalance.component';
// import { FiniqMapleAPIComponent } from '../components/finiq-maple-api/finiq-maple-api.component';
// import { MapleEQCComponent } from '../components/finiq-maple-api/maple-eqc/maple-eqc.component';
// import { ELNComponent } from '../components/finiq-maple-api/maple-eqc/eln/eln.component';
// import { FCNComponent } from '../components/finiq-maple-api/maple-eqc/fcn/fcn.component';
// import { DRAComponent } from '../components/finiq-maple-api/maple-eqc/dra/dra.component';
// import { BENComponent } from '../components/finiq-maple-api/maple-eqc/ben/ben.component';
// import { OptionComponent } from '../components/finiq-maple-api/maple-eqc/option/option.component';
// import { PhoenixComponent } from '../components/finiq-maple-api/maple-eqc/phoenix/phoenix.component';
// import { AQDQMapleComponent } from '../components/finiq-maple-api/maple-eqc/aqdqmaple/aqdqmaple.component';
// import { FxTransactionsAbnComponent } from '../components/fx-order-abn/fx-transactions-abn/fx-transactions-abn.component';
// import { PortfolioAnalyticsComponent } from '../components/portfolio-analytics/portfolio-analytics.component';
// import { CorrelationAnalyticsComponent } from '../components/portfolio-analytics/correlation-analytics/correlation-analytics.component';
// import { SecuritySearchPipe } from '../pipes/security-search.pipe';
// import { RouteHistoryComponent } from '../components/route-history/route-history.component';
// import { NewFundDetailsComponent } from '../components/RMWorkstation/new-fund-details/new-fund-details.component';
// import { CustomerSubAccountComponent } from '../components/customer/customer-sub-account/customer-sub-account.component';
import { SafePipe } from '../pipes/safe.pipe';
// import { FXBarrierMultiRequestComponent } from '../components/multirequest/components/fxbarrier-multi-request/fxbarrier-multi-request.component';
// import { FXVanillaMultiRequestComponent } from '../components/multirequest/components/fxvanilla-multi-request/fxvanilla-multi-request.component';
// import { FxaqdqMultiRequestComponent } from '../components/multirequest/components/fxaqdq-multi-request/fxaqdq-multi-request.component';
// import { MultirequestComponent } from '../components/multirequest/multirequest.component';
// import Helper from '../components/multirequest/helpers/helpers';

// import { PortfolioDetailsComponent } from '../components/home/portfolio-details/portfolio-details.component';
// import { ProposalGenerationComponent } from '../components/customer/reporting/portfolioallocation/proposal-generation/proposal-generation.component';
// import { RecommendedProductListComponent } from '../components/customer/reporting/recommended-product-list/recommended-product-list.component';
// import { ProposalGenerationPreviewComponent } from '../components/customer/reporting/proposal-generation-preview/proposal-generation-preview.component';
// import { TickerComponent } from '../components/controls/ticker/ticker.component';
// import { DynamicWorkflowComponent } from '../components/workflow/dynamic-workflow/dynamic-workflow.component';
// import { PortfolioChartsComponent } from '../components/customer/reporting/portfolioallocation/portfolio-charts/portfolio-charts.component';

import { SharedComponentsModule } from '../modules/shared-components.module';
// import { SipComponent } from '../components/workflow/neworderentry/sip/sip.component';

// import { PitchbookComponent } from '../components/utilities/pitchbook/pitchbook.component';

// import { StructurednotesComponent } from '../components/workflow/neworderentry/structurednotes/structurednotes.component';
// import { VideoComponent } from '../components/utilities/video/video.component';
// import { NotesComponent } from '../components/utilities/notes/notes.component';
// import { MyAlertsComponent } from '../components/my-alerts/my-alerts.component';
// import { CollateralWatchlistComponent } from '../components/collateral/collateral-watchlist/collateral-watchlist.component';
// import { WatchlistComponent } from '../components/collateral/collateral-watchlist/watchlist/watchlist.component';
// import { StructuredProductsComponent } from '../components/structured-products/structured-products.component';

// import { LpStatusComponent } from '../components/utilities/lp-status/lp-status.component';
// import { CollateralDetailsChartComponent } from '../components/margin/collateral-details-chart/collateral-details-chart.component';
// import { BulkOrderEntryComponent } from '../components/utilities/bulk-order-entry/bulk-order-entry.component';
// import { ProductWatchlistComponent } from '../components/home/product-watchlist/product-watchlist.component';
// import { FullpageDashboardComponent } from '../components/structured-products/fullpage-dashboard/fullpage-dashboard.component';

// import { EQCCardDashboardComponent } from '../components/structured-products/card-dashboard/card-dashboard.component';
// // import { SearchUnderlyingPipe } from '../components/structured-products/Common-Components/pipes/search-underlying.pipe';
// // import { EQCPricingComponent } from '../components/structured-products/Common-Components/pricing/pricing.component';
// import { SwitchfundComponent } from '../components/workflow/neworderentry/switchfund/switchfund.component';
// import { MultiSelectionCustomerSearchComponent } from '../components/utilities/multi-selection-customer-search/multi-selection-customer-search.component';
// import { SipDetailsComponent } from '../components/SIP/sip-details/sip-details.component';
// import { SuitabilityComponent } from '../components/workflow/neworderentry/suitability/suitability.component'; //Added by AlolikaG on 31st Jan 2021. Assigned by Parikshit K.
// import { FxLimitOrderComponent } from '../components/fx-order/fx-limit-order/fx-limit-order.component';
// import { FxgraphComponent } from '../components/fx-order/fx-limit-order/fxgraph/fxgraph.component';
// import { FxlimitTradesComponent } from '../components/fx-order/fx-limit-order/fxlimit-trades/fxlimit-trades.component';
// import { RangeSliderHorizontalComponent } from '../extras/range-slider-horizontal/range-slider-horizontal.component';
// import { SignatureFundsComponent } from '../components/workflow/neworderentry/signature-funds/signature-funds.component';
// import { PieChartComponent } from '../extras/pie-chart/pie-chart.component';
// import { ColumnChartComponent } from '../extras/column-chart/column-chart.component';
// import { PlaceOrdersComponent } from '../components/workflow-ucp/place-orders/place-orders.component';
// import { ApiGenericResponseComponent } from '../components/utilities/api-generic-response/api-generic-response.component';
// import { BarChartComponent } from '../extras/bar-chart/bar-chart.component';
import { StructuredmoduleModule } from '../components/structured-products/structuredmodule/structuredmodule.module';

// import { ClientwiseFxPositionComponent } from '../components/fx-order/clientwise-fx-position/clientwise-fx-position.component';
// import { MapleModule } from '../components/maple/maple.module';

//Changed by MohanP | 2FEB22

// import { LimitsControlsComponent } from '../components/fx-order/limits-controls/limits-controls.component';
// import { AreaChartComponent } from '../extras/area-chart/area-chart.component';
// import { RadialChartComponent } from '../extras/radial-chart/radial-chart.component';
// import { InsuranceRiderComponent } from '../components/Insurance/insurance-rider/insurance-rider.component';
// import { InsuranceSurrenderComponent } from '../components/Insurance/insurance-surrender/insurance-surrender.component';
// import { ViewProfileComponent } from '../components/customer/customer-setup-view/view-profile/view-profile.component';
// import { SharesNewComponent } from '../components/workflow/neworderentry/shares-new/shares-new.component';
// import { WorkflowJourneyComponent } from '../components/workflow/workflow-journey/workflow-journey.component';
// import { FlexipricerComponent } from '../components/structured-products/flexipricer/flexipricer.component';
// import { ElnFlxComponent } from '../components/structured-products/Flexipricer-products/eln-flx/eln-flx.component';
// import { FcnFlxComponent } from '../components/structured-products/Flexipricer-products/fcn-flx/fcn-flx.component';
// import { CashflowAggregationComponent } from '../components/cashflow-aggregation/cashflow-aggregation.component';
// import { DemoPipe } from '../demo.pipe';
// import { WorkbenchComponent } from '../components/RMWorkstation/workbench/workbench.component';
// import { RmwComponent } from '../components/RMWorkstation/workbench/rmw/rmw.component';
// import { SubLayoutComponent } from '../components/RMWorkstation/workbench/sub-layout/sub-layout.component';
// import { ConcentrationReportsComponent } from '../components/concentration-reports/concentration-reports.component';
// import { MarketDataComponent } from '../components/market-data/market-data.component';
// import { StressTestComponent } from '../components/stress-test/stress-test.component';
// import { HolidayCalenderViewerComponent } from '../components/holiday-calender-viewer/holiday-calender-viewer.component';
// import { WhatIfComponent } from '../components/RMWorkstation/layout/what-if/what-if.component';
// import { LineChartComponent } from '../extras/line-chart/line-chart.component';
// import { PaymentHistoryComponent } from '../components/payment-history/payment-history.component';

// import { GreeksComponent } from '../components/greeks/greeks.component';
// import { LcmLineChartComponent } from '../extras/lcm-charts/lcm-line-chart/lcm-line-chart.component';
// import { LcmBarChartComponent } from '../extras/lcm-charts/lcm-bar-chart/lcm-bar-chart.component';
// import { MtmHistoryComponent } from '../components/RMWorkstation/workbench/links/mtm-history/mtm-history.component';
// import { PerformanceTimelineComponent } from '../components/performance-timeline/performance-timeline.component';
// import { BacktestComponent } from '../components/RMWorkstation/workbench/links/backtest/backtest.component';
// import { CustomTabsComponent } from '../extras/custom-tabs/custom-tabs.component';
import { UnderlyingPricesComponent } from '../components/underlying-prices/underlying-prices.component';
// import { WorkflowDashboardComponent } from '../components/workflow-dashboard/workflow-dashboard.component';
// import { TileComponent } from '../components/workflow-dashboard/tile/tile.component';
// import { ChartLegendComponent } from '../extras/chart-legend/chart-legend.component';
// import { LcmScheduleComponent } from '../components/lcm-schedule/lcm-schedule.component';
import { UnderlyingLinechartComponent } from '../extras/underlying-linechart/underlying-linechart.component';
import * as PlotlyJS from 'plotly.js/dist/plotly';
import { PlotlyModule } from 'angular-plotly.js';
// import { ViewOrdersComponent } from '../components/view-orders/view-orders.component';
// import { PowerbiComponent } from '../components/powerbi/powerbi.component';
// import { PersonalSettingsComponent } from '../components/personal-settings/personal-settings.component';
// import { MoreFiltersComponent } from '../components/more-filters/more-filters.component';
//<Sudarshan|24Feb2022>
import { DashboardNewComponent } from '../components/dashboard-new/components/dashboard-new.component';
import { InteractiveDashboardComponent } from '../components/interactive-dashboard/interactive-dashboard.component';
import { ApifunctionsService } from '../components/dashboard-new/services/apifunctions.service';
import { TileNewComponent } from '../components/dashboard-new/tile/tile.component';
import { PreviousQuotesCardComponent } from '../components/dashboard-new/cards/previous-quotes-card/previous-quotes-card.component';
import { AccessVideosCardComponent } from '../components/dashboard-new/cards/access-videos-card/access-videos-card.component';
import { ContentCardComponent } from '../components/dashboard-new/cards/content-card/content-card.component';
import { MultiRequestLaunchCardComponent } from '../components/dashboard-new/cards/multi-request-launch-card/multi-request-launch-card.component';
import { TabsComponent } from '../extras/tabs/tabs.component';
import { OrderSummaryCardComponent } from '../components/dashboard-new/cards/order-summary-card/order-summary-card.component';
import { AddCardComponent } from '../components/dashboard-new/cards/add-card/add-card.component';
import { MarketingMaterialCardComponent } from '../components/dashboard-new/cards/marketing-material-card/marketing-material-card.component';
import { ScheduledRequestsComponent } from '../components/dashboard-new/cards/scheduled-requests/scheduled-requests.component';
import { StockRecommendationComponent } from '../components/dashboard-new/cards/stock-recommendation/stock-recommendation.component';
import { SavedRequestsCardComponent } from '../components/dashboard-new/cards/saved-requests-card/saved-requests-card.component';
import { CoreComponent } from './core/core.component';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from '../components/ucp/custom-controls/date-picker/calendar/calendar.component';
import {
  TranslateLoader,
  TranslateModule,
  TranslatePipe,
} from '@ngx-translate/core';
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader { //ChitraM | 5-May-23 | FIN1EURINT-100
  return new TranslateHttpLoader(http, '/EuroconnectPortal/assets/i18n/', '.json');
}
import { AuthModule } from '../components/auth/auth.module'
import {  HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; //ChitraM | 5-May-23 | FIN1EURINT-100
import { NotesComponent } from '../components/utilities/notes/notes.component';
import { TileComponent } from '../components/powerbi/tile/tile.component';
import { PieChartComponent } from '../extras/pie-chart/pie-chart.component';
import { NoappaccessComponent } from '../components/noappaccess/noappaccess.component';
import { RmwComponent } from '../components/dashboard-new/cards/rmw/rmw.component';
import { HolidayCalenderViewerComponent } from '../components/holiday-calender-viewer/holiday-calender-viewer.component';
import {NgIdleModule} from '@ng-idle/core';
import { MatIconModule } from '@angular/material/icon';
import { FiltersComponent } from '../components/client-summary/mpg-report/filters/filters.component';
import { MpgGridComponent } from '../components/client-summary/mpg-report/mpg-grid/mpg-grid.component';
import { SidenavDrawerComponent } from '../components/client-summary/mpg-report/sidenav-drawer/sidenav-drawer.component';
import { MpgGridViewComponent } from '../components/client-summary/mpg-report/mpg-grid-view/mpg-grid-view.component';
import { GenericPopupComponent } from '../extras/generic-popup/generic-popup.component';
//</Sudarshan|24Feb2022>
PlotlyModule.plotlyjs = PlotlyJS;

// imports added for Galaxy BI for Santander LCM || START || 17-Jun-2023 || KaustubhS
import { BIReportsComponent } from '../components/bireports/bireports.component';
import { ChartComponent } from '../components/bireports/sales-and-revenue-performance/chart/chart.component';
import { AssetExposureChartComponent } from '../components/bireports/asset-exposure/asset-exposure-chart/asset-exposure-chart.component';
import { AssetExposureDateSliderComponent } from '../components/bireports/asset-exposure/asset-exposure-date-slider/asset-exposure-date-slider.component';
import { AssetExposureComponent } from '../components/bireports/asset-exposure/asset-exposure.component';
import { BarrierProbabilityChart1Component } from '../components/bireports/barrier-probability/barrier-probability-chart1/barrier-probability-chart1.component';
import { BarrierProbabilityChart2Component } from '../components/bireports/barrier-probability/barrier-probability-chart2/barrier-probability-chart2.component';
import { BarrierProbabilityComponent } from '../components/bireports/barrier-probability/barrier-probability.component';
import { BarrierWatchChartComponent } from '../components/bireports/barrier-watch/barrier-watch-chart/barrier-watch-chart.component';
import { BarrierWatchComponent } from '../components/bireports/barrier-watch/barrier-watch.component';
import { KiAndWorstOfPerformanceComponent } from '../components/bireports/ki-and-worst-of-performance/wof-and-ki.component';
import { KiAndWorstOfPerformanceChartComponent } from '../components/bireports/ki-and-worst-of-performance/worstOfPerformance-and-ki-chart/wof-and-ki-chart.component';
import { WofAndKiFiltersComponent } from '../components/bireports/ki-and-worst-of-performance/worstOfPerformance-and-ki-filter/wof-and-ki-filters.component';
import { KoAndWorstOfPerformanceComponent } from '../components/bireports/ko-and-worst-of-performance/wof-and-ko.component';
import { KoAndWorstOfPerformanceChartComponent } from '../components/bireports/ko-and-worst-of-performance/worstOfPerformance-and-ko-chart/wof-and-ko-chart.component';
import { WofAndKoFiltersComponent } from '../components/bireports/ko-and-worst-of-performance/worstOfPerformance-and-ko-filter/wof-and-ko-filters.component';
import { MtmAndKiChartComponent } from '../components/bireports/mtm-and-ki/mtm-and-ki-chart/mtm-and-ki-chart.component';
import { MtmAndKiFiltersComponent } from '../components/bireports/mtm-and-ki/mtm-and-ki-filters/mtm-and-ki-filters.component';
import { MtmAndKiComponent } from '../components/bireports/mtm-and-ki/mtm-and-ki.component';
import { MtmAndKoChartComponent } from '../components/bireports/mtm-and-ko/mtm-and-ko-chart/mtm-and-ko-chart.component';
import { MtmAndKoFiltersComponent } from '../components/bireports/mtm-and-ko/mtm-and-ko-filters/mtm-and-ko-filters.component';
import { MtmAndKoComponent } from '../components/bireports/mtm-and-ko/mtm-and-ko.component';
import { DateRangePickerComponent } from '../components/bireports/sales-and-revenue-performance/date-range-picker/date-range-picker.component';
import { DoughnutChartCurrencyComponent } from '../components/bireports/sales-and-revenue-performance/doughnut-chart-currency/doughnut-chart-currency.component';
import { DoughnutChartPayoffComponent } from '../components/bireports/sales-and-revenue-performance/doughnut-chart-payoff/doughnut-chart-payoff.component';
import { FilterComponent } from '../components/bireports/sales-and-revenue-performance/filter/filter.component';
import { SalesAndRevenuePerformanceComponent } from '../components/bireports/sales-and-revenue-performance/sales-and-revenue-performance.component';
import { TreemapCurrencyComponent } from '../components/bireports/sales-and-revenue-performance/treemap-currency/treemap-currency.component';
import { TreemapPayoffComponent } from '../components/bireports/sales-and-revenue-performance/treemap-payoff/treemap-payoff.component';
import { GalaxyDashboardComponent } from '../components/bireports/galaxy-dashboard/galaxy-dashboard.component';
import { ProductWatchBlotterComponent } from '../components/product-watch-blotter/product-watch-blotter.component';
import { SpPortfolioSnapshotComponent } from '../components/sp-portfolio-snapshot/sp-portfolio-snapshot.component';
import { ScorecardsComponent } from '../components/scorecards/scorecards.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import { StartOfDayComponent } from '../components/start-of-day/start-of-day.component';
import { SortDirective } from '../directive/sort.directive';
// imports added for Galaxy BI for Santander LCM || END || 17-Jun-2023 || KaustubhS
// added for new Greek page
import { GreekLCMComponent } from '../components/bireports/greek-lcm/greek-lcm.component';
import { GreekLcmChartComponent } from '../components/bireports/greek-lcm/greek-lcm-chart/greek-lcm-chart.component';
import { GreekLcmFilterComponent } from '../components/bireports/greek-lcm/greek-lcm-filter/greek-lcm-filter.component';
// Added by Mitali D - 13-09-2023 - FIN1EURINT-613 - START
import { WfFindComponent } from '../components/workflow/wf-find/wf-find.component';
import { DisplayPriorityComponent } from '../components/workflow/display-priority/display-priority.component';
import { PersonalSettingsComponent } from '../components/workflow/personal-settings/personal-settings.component';
import { MoreFiltersComponent } from '../components/more-filters/more-filters.component';
import { EcPricersModule } from '../components/euroconnect/components/ec-pricers/ec-pricers.module';
// Added by Mitali D - 13-09-2023 - FIN1EURINT-613 - END
// Added by AdilP - 21-09-2023 -start
import { KiAndWorstOfPerformanceTopFiltersComponent } from '../components/bireports/ki-and-worst-of-performance/ki-and-worst-of-performance-top-filters/ki-and-worst-of-performance-top-filters.component'; 
import { MtmAndKiTopFiltersComponent } from '../components/bireports/mtm-and-ki/mtm-and-ki-top-filters/mtm-and-ki-top-filters.component'; 
import { GreekLcmTopFilterComponent } from '../components/bireports/greek-lcm/greek-lcm-top-filter/greek-lcm-top-filter.component';
import { LcmSimulationComponent } from '../components/lcm-simulation/lcm-simulation.component'; 
import { SimulationChartComponent } from '../components/lcm-simulation/simulation-chart/simulation-chart.component';
// Added by AdilP - 21-09-2023 -start
import { ScrollingModule } from '@angular/cdk/scrolling';
//Added by Apurva K|| 24-Jan-2024
import { SpPaymentsReconComponent } from '../components/sp-payments-recon/sp-payments-recon.component';

@NgModule({
  declarations: [
    CoreComponent,
    LoginComponent,
    RegisterComponent,
    PasswordOverrideComponent,
    SidebarComponent,
    // Added by Mitali D - 13-09-2023 - FIN1EURINT-613 - START
    WfFindComponent,
    DisplayPriorityComponent,
    PersonalSettingsComponent,
    MoreFiltersComponent,
    // Added by Mitali D - 13-09-2023 - FIN1EURINT-613 - END
    // DashboardComponent,
    // CashdepositComponent,
    // WorkflowblotterComponent,
    PasswordStrengthBarComponent,
    // HomeComponent,
    // NeworderentryComponent,
    // AmfundsComponent,
    // MutualfundsComponent,
    // BondsComponent,
    // SharesComponent,
    // FixeddepositComponent,
    // InsuranceComponent,
    // StatementsComponent,
    // PortfolioallocationComponent,
    // DragdropComponent,
    // PolicydetailsComponent,
    // PaymenthistoryComponent,
    // PremiumCalendarComponent,
    // RegularinvestmentschemeComponent,
    // FeesndchargesComponent,
    // DynamicFormComponent,
    // CollateralComponent,
    // CustomerMarginReportComponent,
    // MarginDetailsComponent,
    // CollateralDetailsComponent,
    // LimitUtilizationComponent,
    // MarginRatioComponent,
    // GlobalMarginReportComponent,
    // ReportComponent,
    // ClientResponseComponent,
    // LoanComponent,
    // LoanOrderentryComponent,
    // OverdraftComponent,
    // MutualfundCompareComponent,
    // FilterFundsPipe,
    // NewOrderComponent,
    // LoginRMDetailsComponent,
    WelcomeComponent,
    CommonCustomerSearchComponent,
    // CAEvenetDiaryComponent,
    // SunburstComponent,
    // NewsComponent,
    // SearchNewsPipe,
    // CardsComponent,
    // RegisterMenuComponent,
    // WFBlotterComponent,
    // EventSearchPipe,
    // FilterPipe,
    // FXSpotComponent,
    // EventAlertComponent,
    // ClientOnboardingComponent,
    // DynamicControlComponent,
    // NewEntryComponent,
    // DropdownTypeFilterPipe,
    // WorkflowComponent,
    // FX Trading
    // ExchangeRateDisplayComponent,
    // SingleCardComponent,
    // TransactionComponent,
    // LimitorderComponent,
    // NewtransactionComponent,
    // OrderEntryComponent,
    // SpotforwardblotterComponent,
    // CalenderControlComponent,
    // Tab2Component,
    // BlotterRowComponent,
    // OrderhistoryComponent,
    // SingleRowComponent,
    // SearchPipeFx,
    // DailyLimitsComponent,
    // PositionBlotterComponent,
    // MaturingtransactionComponent,
    // TradingInsightsComponent,
    // SpreadManageComponent,
    // TransactionLimitComponent,
    // FxOrderComponent,
    // RmCustomerMapperComponent,
    // AuthorizeUserComponent,
    // SpotComponent,
    // ForwardComponent,
    // CustfilterPipe,
    // CustomerSetupComponent,
    // CustomerSetupViewComponent,
    // CustomerAccountDetailsComponent,
    // CustomerSetupUpdateCpraDetailsComponent,
    // VerifyLoginComponent,
    // SlideshowComponent,
    // CustomerSetupEditProfileComponent,
    // CustomerSetupViewCpraDetailsComponent,
    // MarginComponent,
    // PledgeComponent,
    // SchedulerComponent,
    // CustomerUpdateKycDetailsComponent,
    // CustomerViewKycDetailsComponent,
    // FinancialPlanningComponent,
    // EqDashboardComponent,
    // CustomerFindSuitableProductComponent,
    // LayoutComponent,
    // QuestionAnswerComponent,
    // CustomerSetupResubmitRejectedClientComponent,
    // CustomerPortfolioDetailsComponent,
    // ClientSummaryComponent,
    // MpgReportComponent,
    FiltersComponent,
    // MpgComponent,
    MpgGridComponent,
    SidenavDrawerComponent,
    MpgGridViewComponent,
    // FundDetailsComponent,
    // ClientSummaryComponent,
    // AlertsAndEngagementComponent,
    // ModelSetupComponent,
    // PortfolioComponent,
    // SupportComponent,
    // CustomersearchclientsummaryPipe,
    // UserDefinedDashboardsComponent,
    // GridViewComponent,
    // UserDefinedDashboardsComponent,
    // CustomerPerformKycComponent,
    WorkflowUCPComponent,
    // BondDetailsComponent,
    // FxOrderAbnComponent,
    // FxCardComponent,
    // NewQuoteComponent,
    // FiniqMapleAPIComponent,
    // MapleEQCComponent,
    // PortfolioAnalyticsComponent,
    // CorrelationAnalyticsComponent,
    // SecuritySearchPipe,
    // FxTransactionsAbnComponent,
    // FxTransactionsAbnComponent,
    // RouteHistoryComponent,
    // NewFundDetailsComponent,
    // CustomerSubAccountComponent,
    // SafePipe,
    // MultirequestComponent,
    // FXBarrierMultiRequestComponent,
    // FXVanillaMultiRequestComponent,
    // FxaqdqMultiRequestComponent,
    // PortfolioDetailsComponent,
    // TickerComponent,
    // // NumberToWordsPipe
    // ProposalGenerationComponent,
    // RecommendedProductListComponent,
    // ProposalGenerationPreviewComponent,
    // DynamicWorkflowComponent,
    // PortfolioChartsComponent,
    // SipComponent,
    // StructurednotesComponent,
    // PitchbookComponent,
    // VideoComponent,
     NotesComponent,
    // MyAlertsComponent,
    // CollateralWatchlistComponent,
    // WatchlistComponent,
    // StructuredProductsComponent,
    // LpStatusComponent,
    // CollateralDetailsChartComponent,
    // BulkOrderEntryComponent,
    // FullpageDashboardComponent,

    // EQCCardDashboardComponent,

    // // EQCPricingComponent,
    // ProductWatchlistComponent,
    // SwitchfundComponent,
    // ProductWatchlistComponent,
    // MultiSelectionCustomerSearchComponent,
    // ProductWatchlistComponent,
    // SipDetailsComponent,
    // SuitabilityComponent,
    // RebalanceComponent,
    // FxLimitOrderComponent,
    // FxlimitTradesComponent,
    // FxgraphComponent,
    // RangeSliderHorizontalComponent,
    // SignatureFundsComponent,
    PieChartComponent,
    // ColumnChartComponent,
    // PlaceOrdersComponent,
    // ApiGenericResponseComponent,
    // BarChartComponent,
    // LimitsControlsComponent,
    // ClientwiseFxPositionComponent,
    // AreaChartComponent,
    // RadialChartComponent,
    // InsuranceRiderComponent,
    // InsuranceSurrenderComponent,
    // ViewProfileComponent,
    // SharesNewComponent,
    // WorkflowJourneyComponent,
    // FlexipricerComponent,
    // ElnFlxComponent,
    // FcnFlxComponent,
    // WorkbenchComponent,
    // RmwComponent,
     RmwComponent,
    // SubLayoutComponent,
    // CashflowAggregationComponent,
    // DemoPipe,
    // ViewProfileComponent,
    // MapleComponent,
    // ConcentrationReportsComponent,

    // MarketDataComponent,
    // PaymentHistoryComponent,
    // StressTestComponent,
     HolidayCalenderViewerComponent,
    // WhatIfComponent,
    // LineChartComponent,
    // GreeksComponent,
    // PaymentHistoryComponent,
    // LcmLineChartComponent,
    // LcmBarChartComponent,
    // MtmHistoryComponent,
    // PerformanceTimelineComponent,
    // BacktestComponent,
    // CustomTabsComponent,
    UnderlyingPricesComponent,
    // WorkflowDashboardComponent,
    TileComponent,
    // ChartLegendComponent,
    // LcmScheduleComponent,
    UnderlyingLinechartComponent,
    // ViewOrdersComponent,
    // PowerbiComponent,
    // PersonalSettingsComponent,
    // MoreFiltersComponent,
    DashboardNewComponent,
    TileNewComponent,
    PreviousQuotesCardComponent,
    AccessVideosCardComponent,
    ContentCardComponent,
    MultiRequestLaunchCardComponent,
    TabsComponent,
    OrderSummaryCardComponent,
    AddCardComponent,
    MarketingMaterialCardComponent,
    ScheduledRequestsComponent,
    StockRecommendationComponent,
    SavedRequestsCardComponent,
    NoappaccessComponent,
    GenericPopupComponent,
    // declarations added for Galaxy BI for Santander LCM || START || 17-Jun-2023 || KaustubhS
    BIReportsComponent,
    ChartComponent,
    AssetExposureChartComponent,
    AssetExposureDateSliderComponent,
    AssetExposureComponent,
    BarrierProbabilityChart1Component,
    BarrierProbabilityChart2Component,
    BarrierProbabilityComponent,
    BarrierWatchChartComponent,
    BarrierWatchComponent,
    KiAndWorstOfPerformanceComponent,
    KiAndWorstOfPerformanceChartComponent,
    WofAndKiFiltersComponent,
    KoAndWorstOfPerformanceComponent,
    KoAndWorstOfPerformanceChartComponent,
    WofAndKoFiltersComponent,
    MtmAndKiChartComponent,
    MtmAndKiFiltersComponent,
    MtmAndKiComponent,
    MtmAndKoChartComponent,
    MtmAndKoFiltersComponent,
    MtmAndKoComponent,
    DateRangePickerComponent,
    DoughnutChartCurrencyComponent,
    DoughnutChartPayoffComponent,
    FilterComponent,
    SalesAndRevenuePerformanceComponent,
    TreemapCurrencyComponent,
    TreemapPayoffComponent,
    GalaxyDashboardComponent,
    ProductWatchBlotterComponent,
    SpPortfolioSnapshotComponent,
    ScorecardsComponent,
    InteractiveDashboardComponent,
    CalendarComponent,
    // declarations added for Galaxy BI for Santander LCM || END || 17-Jun-2023 || KaustubhS
    StartOfDayComponent,
    SortDirective,
    GreekLCMComponent,
    GreekLcmChartComponent,
    GreekLcmFilterComponent,
    KiAndWorstOfPerformanceTopFiltersComponent,
    MtmAndKiTopFiltersComponent,
    GreekLcmTopFilterComponent,
    LcmSimulationComponent,
    SimulationChartComponent,
    SpPaymentsReconComponent
  ],
  imports: [
    MatDialogModule, // Added by Mitali D - 11-09-2023
    CommonModule,
    CoreRoutingModule,
    PlotlyModule,
    // PlotlyViaWindowModule,
    SharedComponentsModule,      
    GoogleChartsModule.forRoot({ version: '1.1' }),  
    DragDropModule,
    NgxPaginationModule,
    NgxSliderModule,
    ClickOutsideModule,
    // FX Trading
    AngularMaterialModule,
    NgApexchartsModule,
    PdfViewerModule,
    MatPaginatorModule,
    NgMultiSelectDropDownModule,
    NgxFileDropModule,
    // Ng2SearchPipeModule,  
    StructuredmoduleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    // MapleModule,
    FormsModule,
    AuthModule,
    MatTabsModule,
    MatSnackBarModule,
    EcPricersModule,
    ScrollingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory, //ChitraM | 5-May-23 | FIN1EURINT-100
        deps: [HttpClient],
      },
    }),
    NgIdleModule.forRoot() //Added for Idle logout || Kaustubh S || 15-Sep-2023
  ],
  providers: [  
    ScriptLoaderService,
    ApifunctionsService,
    TitleCasePipe,
    // CustomersearchclientsummaryPipe,  
    SafePipe,    
    // Helper,
    TranslatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class CoreModule { }
