import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScorecardsComponent } from './scorecards.component';
import { IndexHistoryComponent } from './index-history/index-history.component';
import { KIDistanceComponent } from './kidistance/kidistance.component';
import { KODistanceComponent } from './kodistance/kodistance.component';
import { GreeksAggregationComponent } from './greeks-aggregation/greeks-aggregation.component';
import { EventWatchComponent } from './event-watch/event-watch.component';

const routes: Routes = [
  { path: '', 
    component: ScorecardsComponent,
    children: [
      { path: 'IndexHistory', component: IndexHistoryComponent },
      { path: 'KIDistance', component: KIDistanceComponent },
      { path: 'KODistance', component: KODistanceComponent },
      { path: 'GreeksAggregation', component: GreeksAggregationComponent },
      { path: 'EventWatch', component: EventWatchComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScorecardsRoutingModule { }
