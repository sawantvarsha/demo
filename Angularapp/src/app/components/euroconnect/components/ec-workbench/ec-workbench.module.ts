import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EcWorkbenchRoutingModule } from './ec-workbench-routing.module';
import { EcWorkbenchComponent } from './ec-workbench.component';
// import { FilterPipe } from '../../pipe/filter.pipe';
import { SharedModuleModule } from '../../CommonComponents/svg-icons/shared-module/shared-module.module';
import { EcPreviousQuotesModule } from '../ec-previous-quotes/ec-previous-quotes.module';
import { EcPricersModule } from '../ec-pricers/ec-pricers.module';
import { ClickOutsideModule } from 'ng-click-outside';
@NgModule({
  declarations: [
    EcWorkbenchComponent,
    // FilterPipe
  ],
  imports: [
    CommonModule,
    EcWorkbenchRoutingModule,
    SharedModuleModule,
    FormsModule,
    EcPreviousQuotesModule,   //added on 09 Jan 2023 by Ashwini H for loading EcPreviousQuotesComponent from moredetails
    EcPricersModule,//added on 09 Jan 2023 by Ashwini H for loading EcPreviousQuotesComponent from moredetails
    ClickOutsideModule //Added by AdilP || 11-05-2023 || FIN1EURINT-313
  ]
})
export class EcWorkbenchModule { }
