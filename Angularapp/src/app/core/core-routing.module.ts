import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../components/auth/login/login.component';
import { RegisterComponent } from '../components/auth/register/register.component';
import { PasswordOverrideComponent } from '../components/auth/password-override/password-override.component';
// import { CashdepositComponent } from '../components/workflow/cashdeposit/cashdeposit.component';
// import { WorkflowblotterComponent } from '../components/workflow/workflowblotter/workflowblotter.component';
import { AuthGuard } from '../guards/auth.guard';
// import { HomeComponent } from '../components/home/home.component';
// import { NeworderentryComponent } from '../components/workflow/neworderentry/neworderentry.component';
// import { StatementsComponent } from '../components/customer/statements/statements.component';
// import { PortfolioallocationComponent } from '../components/customer/reporting/portfolioallocation/portfolioallocation.component';
// import { DragdropComponent } from '../extras/dragdrop/dragdrop.component';
import { ColorPalletteComponent } from '../extras/color-pallette/color-pallette.component';
// import { PolicydetailsComponent } from '../components/Insurance/policydetails/policydetails.component';
// import { PaymenthistoryComponent } from '../components/Insurance/paymenthistory/paymenthistory.component';
// import { PremiumCalendarComponent } from '../components/Insurance/premium-calendar/premium-calendar.component';
// import { RegularinvestmentschemeComponent } from '../components/customer/regularinvestmentscheme/regularinvestmentscheme.component';
// import { FeesndchargesComponent } from '../components/customer/feesndcharges/feesndcharges.component';
// import { CollateralComponent } from '../components/collateral/collateral.component';
// import { ReportComponent } from '../components/collateral/components/report/report.component';
// import { ClientResponseComponent } from '../components/customer/client-response/client-response.component';
// import { LoanComponent } from '../components/loan/loan.component';
// import { MutualfundCompareComponent } from '../components/utilities/mutualfund-compare/mutualfund-compare.component';
// import { NewOrderComponent } from '../components/utilities/new-order/new-order.component';
// import { CollateralPDFComponent } from '../components/collateral/components/collateral-pdf/collateral-pdf.component';
// import { LoginRMDetailsComponent } from '../components/customer/login-rmdetails/login-rmdetails.component';
import { WelcomeComponent } from '../components/auth/welcome/welcome.component';
// import { CAEvenetDiaryComponent } from '../components/customer/ca-evenet-diary/ca-evenet-diary.component';
// import { SunburstComponent } from '../components/utilities/sunburst/sunburst.component';
// import { NewsComponent } from '../components/utilities/news/news.component';
// import { RegisterMenuComponent } from '../components/register-menu/register-menu.component';
// import { EventAlertComponent } from '../components/customer/event-alert/event-alert.component';
// import { ClientOnboardingComponent } from '../components/customer/client-onboarding/client-onboarding.component';
// import { TransactionComponent } from '../components/fx-order/transaction/transaction.component';
// import { NewtransactionComponent } from '../components/fx-order/transaction/newtransaction/newtransaction.component';
// import { ExchangeRateDisplayComponent } from '../components/fx-order/exchange-rate-display/exchange-rate-display.component';
// import { LimitorderComponent } from '../components/fx-order/limitorder/limitorder.component';
// import { OrderhistoryComponent } from '../components/fx-order/limitorder/orderhistory/orderhistory.component';
// import { PositionBlotterComponent } from '../components/fx-order/position-blotter/position-blotter.component';
// import { DailyLimitsComponent } from '../components/fx-order/daily-limits/daily-limits.component';
// import { TradingInsightsComponent } from '../components/fx-order/trading-insights/trading-insights.component';
// import { SpreadManageComponent } from '../components/fx-order/spread-manage/spread-manage.component';
// import { TransactionLimitComponent } from '../components/fx-order/transaction-limit/TransactionLimit.component';
// import { WorkflowComponent } from '../components/customer/client-onboarding/workflow/workflow.component';
// import { NewEntryComponent } from '../components/customer/client-onboarding/new-entry/new-entry.component';
// import { RmCustomerMapperComponent } from '../components/customer/rm-customer-mapper/rm-customer-mapper.component';
// import { AuthorizeUserComponent } from '../components/auth/authorize-user/authorize-user.component';
// import { SpotComponent } from '../components/fx-order/spot/spot.component';
// import { ForwardComponent } from '../components/fx-order/forward/forward.component';
// import { CustomerSetupComponent } from '../components/customer/customer-setup/customer-setup.component';
// import { CustomerSetupViewComponent } from '../components/customer/customer-setup-view/customer-setup-view.component';
// import { CustomerSetupEditProfileComponent } from '../components/customer/customer-setup-edit-profile/customer-setup-edit-profile.component';
// import { CustomerSetupViewCpraDetailsComponent } from '../components/customer/customer-setup-view-cpra-details/customer-setup-view-cpra-details.component';
// import { CustomerAccountDetailsComponent } from '../components/customer/customer-account-details/customer-account-details.component';
// import { CustomerUpdateKycDetailsComponent } from '../components/customer/customer-update-kyc-details/customer-update-kyc-details.component';
// import { CustomerViewKycDetailsComponent } from '../components/customer/customer-view-kyc-details/customer-view-kyc-details.component';
// import { MarginComponent } from '../components/margin/margin.component';
// import { FinancialPlanningComponent } from '../components/utilities/financial-planning/financial-planning.component';
// import { EqDashboardComponent } from '../components/customer/eq-dashboard/eq-dashboard.component';
// import { CustomerFindSuitableProductComponent } from '../components/customer/customer-find-suitable-product/customer-find-suitable-product.component';
// import { ClientSummaryComponent } from '../components/client-summary/client-summary.component';
// import { CustomerPortfolioDetailsComponent } from '../components/customer/customer-portfolio-details/customer-portfolio-details.component';
// import { FundDetailsComponent } from '../components/RMWorkstation/fund-details/fund-details.component';
// import { BondDetailsComponent } from '../components/RMWorkstation/bond-details/bond-details.component';
// import { VanillaComponent } from '../components/FXD/products/vanilla/vanilla.component';
// import { BarrierComponent } from '../components/FXD/products/barrier/barrier.component';
// import { AqdqComponent } from '../components/FXD/products/aqdq/aqdq.component';
// import { TrfComponent } from '../components/FXD/products/trf/trf.component';
// import { PivotComponent } from '../components/FXD/products/pivot/pivot.component';
// import { DciComponent } from '../components/FXD/products/dci/dci.component';
// import { StrategyComponent } from '../components/FXD/products/strategy/strategy.component';
// import { FXDDashboardComponent } from '../components/FXD/fxddashboard/fxddashboard.component';
// import { MapleComponent } from '../components/maple/maple.component';
// import { ModelSetupComponent } from '../components/portfolio/model-setup/model-setup.component';
// import { SupportComponent } from '../components/support/support.component';
// import { RebalanceComponent } from '../components/customer/rebalance/rebalance.component';
// import { UserDefinedDashboardsComponent } from '../components/user-defined-dashboards/user-defined-dashboards.component';
// import { CustomerPerformKycComponent } from '../components/customer/customer-perform-kyc/customer-perform-kyc.component';
// import { AlertsAndEngagementComponent } from '../components/utilities/alerts-and-engagement/alerts-and-engagement.component';
import { WorkflowUCPComponent } from '../components/workflow-ucp/workflow-ucp.component'; // Added by Mitali D - 11-09-2023
// import { NewQuoteComponent } from '../components/fx-order-abn/new-quote/new-quote.component';
// import { PortfolioAnalyticsComponent } from '../components/portfolio-analytics/portfolio-analytics.component';
// import { FxTransactionsAbnComponent } from '../components/fx-order-abn/fx-transactions-abn/fx-transactions-abn.component';
// import { MultirequestComponent } from '../components/multirequest/multirequest.component';
// import { MultirequestComponent } from '../components/stuc';
// import { FlexipricerComponent } from '../components/structured-products/flexipricer/flexipricer.component';
// import { MpgReportComponent } from '../components/client-summary/mpg-report/mpg-report.component';
// import { NewFundDetailsComponent } from '../components/RMWorkstation/new-fund-details/new-fund-details.component';
// import { ProposalGenerationComponent } from '../components/customer/reporting/portfolioallocation/proposal-generation/proposal-generation.component';
// import { PlaceOrdersComponent } from '../components/workflow-ucp/place-orders/place-orders.component';
// import { WhatIfComponent } from '../components/RMWorkstation/layout/what-if/what-if.component';
// import { DynamicWorkflowComponent } from '../components/workflow/dynamic-workflow/dynamic-workflow.component';
// import { SipComponent } from '../components/workflow/neworderentry/sip/sip.component';
// import { PitchbookComponent } from '../components/utilities/pitchbook/pitchbook.component';
// import { VideoComponent } from '../components/utilities/video/video.component';
// import { NotesComponent } from '../components/utilities/notes/notes.component';
// import { MyAlertsComponent } from '../components/my-alerts/my-alerts.component';
// import { CollateralWatchlistComponent } from '../components/collateral/collateral-watchlist/collateral-watchlist.component';
// import { LpStatusComponent } from '../components/utilities/lp-status/lp-status.component';
// import { BulkOrderEntryComponent } from '../components/utilities/bulk-order-entry/bulk-order-entry.component';
// import { SipDetailsComponent } from '../components/SIP/sip-details/sip-details.component'; //Added by AlolikaG on 31st Jan 2021. Assigned by Parikshit K.
// import { RecommendedProductListComponent } from '../components/customer/reporting/recommended-product-list/recommended-product-list.component';
// import { FxLimitOrderComponent } from '../components/fx-order/fx-limit-order/fx-limit-order.component';
// import { PortfolioDetailsComponent } from '../components/home/portfolio-details/portfolio-details.component';
// import { StructurednotesComponent } from '../components/workflow/neworderentry/structurednotes/structurednotes.component';
// import { SignatureFundsComponent } from '../components/workflow/neworderentry/signature-funds/signature-funds.component';
// import { ApiGenericResponseComponent } from '../components/utilities/api-generic-response/api-generic-response.component';
// import { StructuredProductsComponent } from '../components/structured-products/structured-products.component';
// import { ClientwiseFxPositionComponent } from '../components/fx-order/clientwise-fx-position/clientwise-fx-position.component';
// import { LimitsControlsComponent } from '../components/fx-order/limits-controls/limits-controls.component';
// import { MapleModule } from '../components/maple/maple.module';
// import { InsuranceSurrenderComponent } from '../components/Insurance/insurance-surrender/insurance-surrender.component';
// import { InsuranceRiderComponent } from '../components/Insurance/insurance-rider/insurance-rider.component';
// import { ViewProfileComponent } from '../components/customer/customer-setup-view/view-profile/view-profile.component';
// import { RmwComponent } from '../components/RMWorkstation/workbench/rmw/rmw.component';
// import { HolidayCalenderViewerComponent } from '../components/holiday-calender-viewer/holiday-calender-viewer.component';
// import { CashflowAggregationComponent } from '../components/cashflow-aggregation/cashflow-aggregation.component';
// import { ConcentrationReportsComponent } from '../components/concentration-reports/concentration-reports.component';
// import { MarketDataComponent } from '../components/market-data/market-data.component';
// import { WorkflowDashboardComponent } from '../components/workflow-dashboard/workflow-dashboard.component';
// import { DashboardComponent } from '../components/workflow/dashboard/dashboard.component';
// import { PowerbiComponent } from '../components/powerbi/powerbi.component';
//Changed by MohanP | 2FEB22
import { DashboardNewComponent } from '../components/dashboard-new/components/dashboard-new.component';
import { CoreComponent } from './core/core.component';
import { NoappaccessComponent } from '../components/noappaccess/noappaccess.component';
import { HolidayCalenderViewerComponent } from '../components/holiday-calender-viewer/holiday-calender-viewer.component';
import { BIReportsComponent } from '../components/bireports/bireports.component';
import { ProductWatchBlotterComponent } from '../components/product-watch-blotter/product-watch-blotter.component';
import { SpPortfolioSnapshotComponent } from '../components/sp-portfolio-snapshot/sp-portfolio-snapshot.component';
import { ScorecardsComponent } from '../components/scorecards/scorecards.component';
import { InteractiveDashboardComponent } from '../components/interactive-dashboard/interactive-dashboard.component';
import { StartOfDayComponent } from '../components/start-of-day/start-of-day.component';
import { LcmSimulationComponent } from '../components/lcm-simulation/lcm-simulation.component';
//Added by Apurva K||24-Jan-2024
import { SpPaymentsReconComponent } from '../components/sp-payments-recon/sp-payments-recon.component';

import { MpgGridViewComponent } from '../components/client-summary/mpg-report/mpg-grid-view/mpg-grid-view.component';
const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      { path: '', redirectTo: 'euroconnect', pathMatch: 'full' },
     // { path: '', redirectTo: 'newdashboard', pathMatch: 'full' },
      {
        path: 'welcome'
        , component: WelcomeComponent
        , canActivate: [AuthGuard]
      },
      {
        path: 'noappaccess'
        , component: NoappaccessComponent
        , canActivate: [AuthGuard]
      },
      
      { path: 'welcome/:usertype', component: WelcomeComponent, canActivate: [AuthGuard] },
      {
        path: 'auth',
        loadChildren: () =>
          import('../components/auth/auth.module')
            .then((m) => m.AuthModule)
            .catch((e) => {console.log(e);
              return Promise.reject(e);
            }),
      },

      { path: 'login/:usertype', component: LoginComponent },
      { path: 'register/:usertype', component: RegisterComponent },
      { path: 'passwordoverride', component: PasswordOverrideComponent },
      // { path: 'support', component: SupportComponent },
      // {
      //   path: 'home',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Home', isClickable: true },
      //   component: HomeComponent,
      //   children: [
      //     {
      //       path: ':login',
      //       component: HomeComponent,
      //       data: { breadcrumb: '', isClickable: true },
      //     },
      //   ],
      // },
      // {
      //   path: 'dashboardFx',
      //   data: { breadcrumb: 'FX Order', isClickable: false },
      //   children: [
      //     // { path: '', component: ExchangeRateDisplayComponent },
      //     {
      //       path: ':mode',
      //       component: ExchangeRateDisplayComponent,
      //       data: { breadcrumb: 'Mutli Pair Pricing', isClickable: true },
      //       canActivate: [AuthGuard],
      //     },
      //   ],
      // },
      // {
      //   path: 'customersetupview',
      //   component: CustomerSetupViewComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'My Profile', isClickable: false },
      // },
      // {
      //   path: 'CustomerUpdateKycDetails',
      //   component: CustomerUpdateKycDetailsComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'CustomerViewKycDetails',
      //   component: CustomerViewKycDetailsComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'CustomerPortfolioDetails',
      //   component: CustomerPortfolioDetailsComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'performkyc',
      //   component: CustomerPerformKycComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'financialplanning/:Mode',
      //   component: FinancialPlanningComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'CustomerFindSuitableProduct',
      //   component: CustomerFindSuitableProductComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'authorizeuser',
      //   component: AuthorizeUserComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'vanilla',
      //   component: VanillaComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'barrier',
      //   component: BarrierComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'aqdq',
      //   component: AqdqComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'trf',
      //   component: TrfComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'pivot',
      //   component: PivotComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'dci',
      //   component: DciComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'strategy',
      //   component: StrategyComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'fxd',
      //   component: FXDDashboardComponent,
      //   canActivate: [AuthGuard],
      //   // data: { Inputdata: 'Input data' },
      // },
      // {
      //   path: 'multirequest',
      //   component: MultirequestComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'eqc/flexipricer',
      //   component: FlexipricerComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'rebalance',
      //   component: RebalanceComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'mpg',
      //   component: MpgReportComponent,
      //   // component: FiniqMapleAPIComponent,
      //   //  component : WorkflowUCPComponent,
      //   // component : WorkflowUCPComponent,
      // },
      // {
      //   path: 'CustomerSupport',
      //   component: SupportComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'customerregsetup/:Mode/:NavigatingFrom',
      //   component: CustomerSetupComponent,
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'customersetup/:Mode/:NavigatingFrom',
      //   component: CustomerSetupComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'fxorder/spot',
      //   component: SpotComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'fxorder/forward',
      //   component: ForwardComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'editprofile',
      //   component: CustomerSetupEditProfileComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'viewcpradetails',
      //   component: CustomerSetupViewCpraDetailsComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'accountdetails/:Mode',
      //   component: CustomerAccountDetailsComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'CustomerUpdateKycDetails',
      //   component: CustomerUpdateKycDetailsComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'CustomerViewKycDetails',
      //   component: CustomerViewKycDetailsComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'CustomerPortfolioDetails',
      //   component: CustomerPortfolioDetailsComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'performkyc',
      //   component: CustomerPerformKycComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'FinancialPlanning/:Mode',
      //   component: FinancialPlanningComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'CustomerFindSuitableProduct',
      //   component: CustomerFindSuitableProductComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'authorizeuser',
      //   component: AuthorizeUserComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'vanilla',
      //   component: VanillaComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'barrier',
      //   component: BarrierComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'aqdq',
      //   component: AqdqComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'trf',
      //   component: TrfComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'pivot',
      //   component: PivotComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'dci',
      //   component: DciComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'strategy',
      //   component: StrategyComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'fxd',
      //   component: FXDDashboardComponent,
      //   canActivate: [AuthGuard],
      //   data: { Inputdata: 'Input data' },
      // },
      // {
      //   path: 'rebalance',
      //   component: RebalanceComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'mpg',
      //   component: MpgReportComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'cashdeposit',
      //   component: CashdepositComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'My Orders' },
      // },
      // {
      //   path: 'workflowblotter',
      //   component: WorkflowblotterComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'My Orders' },
      // },

      // {
      //   path: 'neworderentry/:orderType',
      //   component: NeworderentryComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'statements/:userType',
      //   component: StatementsComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'portfolioallocation',
      //   component: PortfolioallocationComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'dragdrop',
      //   component: DragdropComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      {
        path: 'colorpallette',
        component: ColorPalletteComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Portfolio Details' },
      },
      // {
      //   path: 'policy',
      //   children: [
          // {
          //   path: '',
          //   component: PolicydetailsComponent,
          // },
          // {
          //   path: 'surrender',
          //   component: InsuranceSurrenderComponent,
          // },
          // {
          //   path: 'rider',
          //   component: InsuranceRiderComponent,
          // },
      //   ],
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'paymenthistory',
      //   component: PaymenthistoryComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'premCalendar',
      //   component: PremiumCalendarComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'regularinvestmentscheme',
      //   component: RegularinvestmentschemeComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'feesndcharges',
      //   component: FeesndchargesComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'rmw',
      //   component: RmwComponent,
      //   // component: DynamicFormComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'clientresponse',
      //   component: ClientResponseComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'loginrmdetails',
      //   component: LoginRMDetailsComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'globalMarginDashboard',
      //   component: CollateralComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'collateralReport',
      //   component: ReportComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'loansoverdraft/:loanType',
      //   component: LoanComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'mutualFundCompare',
      //   component: MutualfundCompareComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'NewOrder/:MFCode',
      //   component: NewOrderComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'collateralPDF',
      //   component: CollateralPDFComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'EventAlert',
      //   component: EventAlertComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'CAEvenetDiary',
      //   component: CAEvenetDiaryComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'SunburstComponent',
      //   component: SunburstComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'News',
      //   component: NewsComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'Menu',
      //   component: RegisterMenuComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'workflow',
      //   children: [
      //     {
      //       path: '',
      //       redirectTo: 'dashboard',
      //       pathMatch: 'full',
      //     },
          // {
          //   path: 'dashboard',
          //   component: WorkflowDashboardComponent,
          //   canActivate: [AuthGuard],
          //   data: { breadcrumb: 'Workflow UCP' },
          // },
          // {
          //   path: 'blotter',
          //   component: WorkflowUCPComponent,
          //   pathMatch: 'full',
          //   canActivate: [AuthGuard],
          //   data: { breadcrumb: 'Portfolio Details' },
          // },
      //   ],
      // },
      // {
      //   path: 'rmcustomermapping',
      //   component: RmCustomerMapperComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // ------------------------ Fx Trading -------------------------------<START>
      // {
      //   path: 'dashboardFx',
      //   data: { breadcrumb: 'FX Order', isClickable: false },
      //   children: [
      //     // { path: '', component: ExchangeRateDisplayComponent },
      //     {
      //       path: ':mode',
      //       component: ExchangeRateDisplayComponent,
      //       data: { breadcrumb: 'Mutli Pair Pricing', isClickable: true },
      //       canActivate: [AuthGuard],
      //     },
      //   ],
      // },
      // {
      //   path: 'transaction/:mode',
      //   component: TransactionComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'newtransaction',
      //   component: NewtransactionComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'limitOrder',
      //   component: LimitorderComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'orderhistory',
      //   component: OrderhistoryComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'positionblotter',
      //   component: PositionBlotterComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'dailylimit',
      //   component: DailyLimitsComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'insights',
      //   component: TradingInsightsComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'spreadManagement',
      //   component: SpreadManageComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'fxlimitscontrols',
      //   // path: 'limitSetup',
      //   component: LimitsControlsComponent,
      //   // component: TransactionLimitComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },

      // {
      //   path: 'clientwisefxposition',
      //   component: ClientwiseFxPositionComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // }, // ------------------------ Fx Trading -------------------------------<END>
      // {
      //   path: 'margin',
      //   component: MarginComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'ClientOnboarding',
      //   component: ClientOnboardingComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'Onboard/:entity',
      //   component: WorkflowComponent,
      //   pathMatch: 'full',
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'New/:entity',
      //   component: NewEntryComponent,
      //   pathMatch: 'full',
      //   data: { breadcrumb: 'Share Finder' },
      // },
      // {
      //   path: 'ShareFinder',
      //   component: EqDashboardComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Share Finder' },
      // },
      // {
      //   path: 'quote',
      //   component: NewQuoteComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'order',
      //   component: FxTransactionsAbnComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'ClientSummary',
      //   component: ClientSummaryComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'fundDetails',
      //   component: FundDetailsComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'bondDetails',
      //   component: BondDetailsComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'bondDetails',
      //   component: BondDetailsComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      {
        path: 'instantpricing',
        loadChildren: () =>
          import('../components/maple/maple.module')
            .then((m) => m.MapleModule)
            .catch((e) => {console.log(e);
              return Promise.reject(e);
            }),
        // component: MapleComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Portfolio Details' },
      },
      // {
      //   path: 'modelsetup',
      //   component: ModelSetupComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'udd',
      //   component: UserDefinedDashboardsComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'alertsandengagement',
      //   component: AlertsAndEngagementComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'recommededproducts',
      //   component: RecommendedProductListComponent,
      //   canActivate: [AuthGuard],
      // },
      {
        path: 'wfblotter',
        component: WorkflowUCPComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Portfolio Details' },
      },
      // {
      //   path: 'portfolioanalytics',
      //   component: PortfolioAnalyticsComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      // {
      //   path: 'newFundDetails',
      //   component: NewFundDetailsComponent,
      //   pathMatch: 'full',
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'proposalGeneration',
      //   component: ProposalGenerationComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'placeOrders', //Changes done by ArshP on 24th Feb 2022
      //   component: PlaceOrdersComponent,
      //   //canActivate: [AuthGuard],
      // },
      // {
      //   path: 'whatif', //Changes done by ArshP on 7th July 2022
      //   children: [
      //     { path: '', component: WhatIfComponent },
      //     { path: ':nmid', component: WhatIfComponent },
      //   ],

      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'sip',
      //   // path: 'sipdetails',
      //   component: SipComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'pitchbook',
      //   component: PitchbookComponent,
      //   // component: CollateralWatchlistComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'myalerts',
      //   component: MyAlertsComponent,
      //   canActivate: [AuthGuard],
      // },

      // {
      //   path: 'dynamicworkflow',
      //   component: DynamicWorkflowComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'videos',
      //   component: VideoComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'notes',
      //   component: NotesComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'lpstatus',
      //   component: LpStatusComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'bulkorderentry',
      //   component: BulkOrderEntryComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'sipoverview', //Changes done by AlolikaG on 1st Feb 2021.
      //   // path: 'sip',
      //   component: SipDetailsComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'fxlimitorder', //Changes done by UddeshS on 11st Feb 2021.
      //   component: FxLimitOrderComponent,
      //   canActivate: [AuthGuard],
      // },
      {
        path: 'fxdconnect', //renamed by UrmilaA | 31-July-23 //old path-fxd
        loadChildren: () =>
          import('../components/FXD/fxd.module')
            .then((m) => m.FXDModule)
            .catch((e) => {console.log(e);
              return Promise.reject(e);
            }),
        canActivate: [AuthGuard],
      },

      {
        path: 'euroconnect',
        loadChildren: () =>
          import('../components/euroconnect/euroconnect.module')
            .then((m) => m.EuroconnectModule)
            .catch((e) => {console.log(e);
              return Promise.reject(e);
            }),
        canActivate: [AuthGuard],
      },
      // Added by OnkarE on 09-Oct-2023
      // {
        
      //   path: 'ucpdealentry',
      //   loadChildren: () =>
      //     import('../components/ucp/ucp.module')
      //       .then((m) => m.UCPModule)
      //       .catch((e) => {console.log(e);
      //         return Promise.reject(e);
      //       }),
      //   canActivate: [AuthGuard],
      // },
      {
        path: 'maple',
        loadChildren: () =>
          import('../components/maple/maple.module')
            .then((m) => m.MapleModule)
            .catch((e) => {console.log(e);
              return Promise.reject(e);
            }),
        canActivate: [AuthGuard],
      },

      // {
      //   path: 'portfolioDetails', //Changes done by AlolikaG on 10th Feb 2021.
      //   // path: 'sip',
      //   component: PortfolioDetailsComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'structurednotesorder', //Changes done by AlolikaG on 10th Feb 2021.
      //   // path: 'sip',
      //   component: StructurednotesComponent,
      //   canActivate: [AuthGuard],
      // },

      // {
      //   path: 'bundlefundsorder', //Changes done by AlolikaG on 10th Feb 2021.
      //   // path: 'sip',
      //   component: SignatureFundsComponent,
      //   canActivate: [AuthGuard],
      // },

      // {
      //   path: 'apiresponse', //Changes by Akhilesh D | Added on 09th Mar 2021.
      //   component: ApiGenericResponseComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'structuredproduct', //Changes done by Ketan S on 18-Apr-2022
      //   component: StructuredProductsComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'viewprofile/:clientdetails', // Changes done by Arsh P on 13-June-2022
      //   component: ViewProfileComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'holidaycalendar', // Changes done by MOhan P on 13-June-2022
      //   component: HolidayCalenderViewerComponent,
      //   canActivate: [AuthGuard],
      // },
      {
        path: 'euroconnect', //Changes done by Ketan S on 18-Apr-2022
        loadChildren: () =>
          import('../../app/components/euroconnect/euroconnect.module')
            .then((m) => m.EuroconnectModule)
            .catch((err) => {console.error(err);
              return Promise.reject(err);
            }),
        canActivate: [AuthGuard],
      },
      // {
      //   path: 'cashflowaggregation', //Added by Amogh K 27/7/2022
      //   component: CashflowAggregationComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'marketdata', //Added by Mohan P 01/08/2022
      //   component: MarketDataComponent,
      //   canActivate: [AuthGuard],
      // },
      {
        path: 'reports', //Changes done by Ketan S on 18-Apr-2022
        children: [
          { path: '', redirectTo: 'concentration', pathMatch: 'full' },
          // {
          //   path: 'concentration', // Changes done by Arsh P on 13-June-2022
          //   component: ConcentrationReportsComponent,
          //   canActivate: [AuthGuard],
          // },
          {
            path: 'mpg',
            component: MpgGridViewComponent,
            canActivate: [AuthGuard],
          },//Added by Jyoti S || 25-Sept-2023
        ],
        canActivate: [AuthGuard],
      },
      // {
      //   path: 'workflowDashboard',
      //   component: WorkflowDashboardComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'powerbi/:srcLink',
      //   component: PowerbiComponent,
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Portfolio Details' },
      // },
      {
        path: 'newdashboard',
        component: DashboardNewComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Dashboard Details' },
      },
      {
        path: 'holidaycalendar',
        component: HolidayCalenderViewerComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Holiday Calender' },
      },

      {
        path: 'lcm',
        component: BIReportsComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'BI Reports' },
      },
      //Added by AdilP For LCM pages 
      {
        path: 'lcm/mtmpr',
        component: BIReportsComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'BI Reports' },
      },
      {
        path: 'lcm/wofpr',
        component: BIReportsComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'BI Reports' },
      },
      {
        path: 'lcm/greeks',
        component: BIReportsComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'BI Reports' },
      },
      {
        path: 'lcm/simulation',
        component: LcmSimulationComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'BI Reports' },
      },
      {
        path: 'sotd',
        component: StartOfDayComponent,
        canActivate: [AuthGuard]
      },
      {  path: 'ProductWatchBlotter', 
        //loadChildren: () => import('./../app/app.module').then((m) => m.AppModule),
        component: ProductWatchBlotterComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Product Watch Blotter' },
      },
      {
        path: 'Portfolio', 
        //loadChildren: () => import('./../app/app.module').then((m) => m.AppModule),
        component: SpPortfolioSnapshotComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Sp Portfolio Snapshot' },
      },
      {         
        path: 'LifecycleScorecards', 
        loadChildren: () => import('../components/scorecards/scorecards.module').then(
        m => m.ScorecardsModule),
        canActivate: [AuthGuard],
      },      {
        path: 'speventcalendar',
        component: InteractiveDashboardComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Interactive Dashboard' },
      },
      //Added by Apurva K|| 24-Jan-2024
      {
        path: 'sppaymentsrecon', 
        component: SpPaymentsReconComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Sp Payment Recon' },
      },

      { path: '**', redirectTo: 'home' },

    ]
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule { }
// Added by mohan
