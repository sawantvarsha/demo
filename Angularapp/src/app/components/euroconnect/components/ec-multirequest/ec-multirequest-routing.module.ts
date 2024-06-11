import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcMultiAccuComponent } from './ec-multi-accu/ec-multi-accu.component';
import { EcMultiEarlyredemptionComponent } from './ec-multi-earlyredemption/ec-multi-earlyredemption.component';
import { EcMultiYieldEnhancementComponent } from './ec-multi-yield-enhancement/ec-multi-yield-enhancement.component';
import { EcMultirequestComponent } from './ec-multirequest.component';
import { MultiDecuComponent } from './ec-multi-decu/multi-decu.component';
import { EcMultiParticipationComponent } from './ec-multi-participation/ec-multi-participation.component';
import { EcMultiCustomstrategyComponent } from './ec-multi-customstrategy/ec-multi-customstrategy.component';

const routes: Routes = [
{ path: '', component: EcMultirequestComponent },
{ path: 'MultiDecu', component: MultiDecuComponent },
{ path: 'MultiAccu', component: EcMultiAccuComponent },
{ path: 'MultiEarlyRedemption', component: EcMultiEarlyredemptionComponent},
{ path: 'MultiYeildEnhancement', component: EcMultiYieldEnhancementComponent},
{ path: 'MultiParticipation', component: EcMultiParticipationComponent},
{ path: 'MultiCustomStrategy', component: EcMultiCustomstrategyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcMultirequestRoutingModule { }
