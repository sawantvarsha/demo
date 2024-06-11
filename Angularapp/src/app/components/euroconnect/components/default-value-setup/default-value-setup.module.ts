import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultValueSetupComponent} from './default-value-setup.component';
import { DefaultValueSetupRoutingModule} from './default-value-setup-routing.module';
//import { DemoPipe } from '../../../../demo.pipe'
// import {SearchunderlyingPipe} from '../../pipe/searchunderlying.pipe'
import { SharedModuleModule } from '../../CommonComponents/svg-icons/shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { DefaultAutocallableComponent } from './default-autocallable/default-autocallable.component';
import { DefaultAccumComponent } from './default-accum/default-accum.component';
import { DefaultParticipationComponent } from './default-participation/default-participation.component';
import { DefaultYieldComponent } from './default-yield/default-yield.component';
import { DefaultDecumComponent } from './default-decum/default-decum.component';
import { EcPricersModule } from '../ec-pricers/ec-pricers.module';
import { DefaultCustomstrategyComponent } from './default-customstrategy/default-customstrategy.component';


@NgModule({
  declarations: [
    // //DemoPipe,
    DefaultValueSetupComponent,
    DefaultAutocallableComponent,
    DefaultYieldComponent,
    DefaultParticipationComponent,
    DefaultAccumComponent,
    DefaultDecumComponent,
    DefaultCustomstrategyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModuleModule,
    ClickOutsideModule,
    DefaultValueSetupRoutingModule,
    EcPricersModule
  ],
  exports: [
    DefaultAutocallableComponent,
    DefaultYieldComponent,
    DefaultParticipationComponent,
    DefaultAccumComponent,
    DefaultDecumComponent
  ]
})
export class DefaultValueSetupModule { }
