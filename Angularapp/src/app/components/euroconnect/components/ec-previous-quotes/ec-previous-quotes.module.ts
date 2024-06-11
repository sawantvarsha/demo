import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { EcPreviousQuotesRoutingModule } from './ec-previous-quotes-routing.module';
import { EcPreviousQuotesComponent } from './ec-previous-quotes.component';
import { SharedModuleModule } from '../../CommonComponents/svg-icons/shared-module/shared-module.module';
import { FormsModule } from '@angular/forms';
import { EcPricersModule } from '../ec-pricers/ec-pricers.module';
import { ClickOutsideModule } from 'ng-click-outside';
// import {CustomDatetimeFieldComponent} from '../../CommonComponents/custom-datetime-field/custom-datetime-field.component'


@NgModule({
  declarations: [
    EcPreviousQuotesComponent,
    // CustomDatetimeFieldComponent
  ],
  imports: [
    CommonModule,
    EcPreviousQuotesRoutingModule,
    MatExpansionModule,
    SharedModuleModule,
    FormsModule,
    EcPricersModule,
    ClickOutsideModule,
    
  ],
  exports:[
    EcPreviousQuotesComponent
  ]
})
export class EcPreviousQuotesModule { }
