import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcPricersRoutingModule } from './ec-pricers-routing.module';
import { EcPricersComponent } from './ec-pricers.component';
// import { SvgIconsComponent } from '../../CommonComponents/svg-icons/svg-icons.component';
import { DecumulatorComponent } from './decumulator/decumulator.component';
// import { FormsModule } from '@angular/forms';
import { DemoPipe } from '../../../../demo.pipe'
// import {SearchunderlyingPipe} from '../../pipe/searchunderlying.pipe'
import { SharedModuleModule } from '../../CommonComponents/svg-icons/shared-module/shared-module.module';
// import { PhoenixComponent } from './phoenix/phoenix.component';
// import { BrcComponent } from './brc/brc.component';
// import { ParticipationComponent } from './participation/participation.component';
import { EarlyRedemptionComponent } from './early-redemption/early-redemption.component';
import { YieldEnhancementComponent } from './yield-enhancement/yield-enhancement.component';
// import { DiscountCertificatesComponent } from './discount-certificates/discount-certificates.component';
import { CustomDropdownMultiSelectComponent } from './CommonComponents/custom-dropdown-multi-select/custom-dropdown-multi-select.component';
import { CustomDropdownComponent } from './CommonComponents/custom-dropdown/custom-dropdown.component';
import { EcAccumulatorComponent } from './ec-accumulator/ec-accumulator.component';
import { FormsModule } from '@angular/forms';
import { EcPreviousQuotesModule } from '../ec-previous-quotes/ec-previous-quotes.module';
import { PreviousQuotesNewComponent } from './CommonComponents/previous-quotes-new/previous-quotes-new.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { EcParticipationComponent } from './ec-participation/ec-participation.component';
import { CustomStrategyComponent } from './custom-strategy/custom-strategy.component';
import { CreditLinkedNoteComponent } from './credit-linked-note/credit-linked-note.component';
import { SteepenerComponent } from './steepener/steepener.component';
import { EcCapsFloorsComponent } from './ec-caps-floors/ec-caps-floors.component';
import { CreditTrancheComponent } from './credit-tranche/credit-tranche.component';
import { DualCurrencyNoteComponent } from './dual-currency-note/dual-currency-note.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
@NgModule({
  declarations: [
    EcPricersComponent,
    // SvgIconsComponent,
    DecumulatorComponent,
    EcAccumulatorComponent,
    DemoPipe,
    EarlyRedemptionComponent,
    YieldEnhancementComponent,
    CustomDropdownMultiSelectComponent,
    CustomDropdownComponent,
    PreviousQuotesNewComponent,
    EcParticipationComponent,
    CustomStrategyComponent,
    CreditLinkedNoteComponent,
    SteepenerComponent,
    EcCapsFloorsComponent,
    CreditTrancheComponent,
    DualCurrencyNoteComponent,
    // SearchunderlyingPipe
    // SearchUserGroupPipe,
    // SearchPipe
    
  ],
  imports: [
    CommonModule,
    EcPricersRoutingModule,
    FormsModule,
    SharedModuleModule,
    ClickOutsideModule,
    ScrollingModule,
  ],
  exports: [
    EcAccumulatorComponent,
    DecumulatorComponent,
    EarlyRedemptionComponent,
    YieldEnhancementComponent,
    CustomDropdownMultiSelectComponent,
    PreviousQuotesNewComponent,
    EcParticipationComponent,
    CreditLinkedNoteComponent
  ]
})
export class EcPricersModule { }
