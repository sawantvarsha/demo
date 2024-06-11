import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultDecumComponent } from './default-decum/default-decum.component';
import { DefaultAutocallableComponent } from './default-autocallable/default-autocallable.component';
import { DefaultAccumComponent } from './default-accum/default-accum.component';
import { DefaultParticipationComponent } from './default-participation/default-participation.component';
import { DefaultValueSetupComponent } from '../default-value-setup/default-value-setup.component';
import { DefaultYieldComponent } from './default-yield/default-yield.component';
import { DefaultCustomstrategyComponent } from './default-customstrategy/default-customstrategy.component';

const routes: Routes = [
  {path: '',component: DefaultValueSetupComponent },
  {
    path: 'AQ',component: DefaultAccumComponent
  },
  { path: 'DQ', component : DefaultDecumComponent },
  { path : 'YieldEnhancement' , component : DefaultYieldComponent},
  { path : 'EarlyRedemption' , component : DefaultAutocallableComponent},
  { path : 'Participation' , component : DefaultParticipationComponent},
  { path : 'CustomStrategy' , component : DefaultCustomstrategyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultValueSetupRoutingModule { }
