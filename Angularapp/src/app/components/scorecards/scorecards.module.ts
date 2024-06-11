import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScorecardsRoutingModule } from './scorecards-routing.module';
import { IndexHistoryComponent } from './index-history/index-history.component';
import { KIDistanceComponent } from './kidistance/kidistance.component';
import { KODistanceComponent } from './kodistance/kodistance.component';
import { GreeksAggregationComponent } from './greeks-aggregation/greeks-aggregation.component';
import { EventWatchComponent } from './event-watch/event-watch.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    IndexHistoryComponent,
    KIDistanceComponent,
    KODistanceComponent,
    GreeksAggregationComponent,
    EventWatchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ScorecardsRoutingModule
  ]
})
export class ScorecardsModule { }
