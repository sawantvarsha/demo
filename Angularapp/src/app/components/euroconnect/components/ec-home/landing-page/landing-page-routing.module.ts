// Changes added by Mayuri D. on 05-July-2022.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageNewsComponent } from './landing-page-news/landing-page-news.component';
import { LandingPageComponent } from './landing-page.component';
import { MarketIntelligenceComponent } from './market-intelligence/market-intelligence.component';
import { NewsProductListComponent } from './news-product-list/news-product-list.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  //   children: [
  //     {
  //       path: '',
  //       redirectTo:
  //     },
  //     {
  //       path: 'marketintelligence',
  //       component: MarketIntelligenceComponent,
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: 'landingpageNews',
  //       component: LandingPageNewsComponent,
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: 'newsproductlist',
  //       component: NewsProductListComponent,
  //       pathMatch: 'full',
  //     },
  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
