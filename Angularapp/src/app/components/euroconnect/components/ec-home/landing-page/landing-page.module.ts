// Changes added by Mayuri D. on 05-July-2022.

import { NgModule } from '@angular/core';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { MarketIntelligenceComponent } from './market-intelligence/market-intelligence.component';
import { LandingPageNewsComponent } from './landing-page-news/landing-page-news.component';
import { NewsProductListComponent } from './news-product-list/news-product-list.component';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { GoogleChartsModule } from 'angular-google-charts';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [
    LandingPageComponent,
    MarketIntelligenceComponent,
    LandingPageNewsComponent,
    NewsProductListComponent,
  ],
  imports: [
    LandingPageRoutingModule,    
    CommonModule,
    MatTabsModule,
    SharedComponentsModule,
    MatCheckboxModule,
    GoogleChartsModule,
    FormsModule,
    MatIconModule
    
  ],
})
export class LandingPageModule {}
