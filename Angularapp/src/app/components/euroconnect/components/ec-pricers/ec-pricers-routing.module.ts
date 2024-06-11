import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecumulatorComponent } from './decumulator/decumulator.component';
import { EarlyRedemptionComponent } from './early-redemption/early-redemption.component';
import { EcAccumulatorComponent } from './ec-accumulator/ec-accumulator.component';
import { EcParticipationComponent } from './ec-participation/ec-participation.component';
import { EcPricersComponent } from './ec-pricers.component';
import { YieldEnhancementComponent } from './yield-enhancement/yield-enhancement.component';
import { CreditLinkedNoteComponent } from './credit-linked-note/credit-linked-note.component';
import { CreditTrancheComponent } from './credit-tranche/credit-tranche.component';
import { SteepenerComponent } from './steepener/steepener.component';
import { EcCapsFloorsComponent } from './ec-caps-floors/ec-caps-floors.component';
import { DualCurrencyNoteComponent } from './dual-currency-note/dual-currency-note.component';


const routes: Routes =
 [
  {path: '',component: EcPricersComponent },
  {
    path: 'AQ',component: EcAccumulatorComponent
  },
  { path: 'DQ', component : DecumulatorComponent },
  { path : 'YieldEnhancement' , component : YieldEnhancementComponent},
  { path : 'EarlyRedemption' , component : EarlyRedemptionComponent},
  { path : 'Participation' , component : EcParticipationComponent},
  { path : 'Credit Linked Note' , component : CreditLinkedNoteComponent},
  { path : 'Credit Tranche' , component : CreditTrancheComponent},
  { path : 'Dual Currency Note' , component : DualCurrencyNoteComponent},
  { path : 'Steepener' , component : SteepenerComponent},
  { path : 'CapsFloors' , component : EcCapsFloorsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcPricersRoutingModule { }
