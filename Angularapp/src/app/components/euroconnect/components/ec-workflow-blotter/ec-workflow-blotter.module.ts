import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcWorkflowBlotterRoutingModule } from './ec-workflow-blotter-routing.module';
import { EcWorkflowBlotterComponent } from './ec-workflow-blotter.component';
import { FormsModule } from '@angular/forms';
// import { FilterPipe } from '../../pipe/filter.pipe';
import { SharedModuleModule } from '../../CommonComponents/svg-icons/shared-module/shared-module.module';
import { EcPreviousQuotesModule } from '../ec-previous-quotes/ec-previous-quotes.module';
// import { SharedModuleModule } from '../../CommonComponents/svg-icons/shared-module/shared-module.module';
import { ClickOutsideModule } from 'ng-click-outside';
@NgModule({
  declarations: [
    EcWorkflowBlotterComponent ,
    // FilterPipe  
  ],
  imports: [
    CommonModule,
    EcWorkflowBlotterRoutingModule,
    FormsModule,
    SharedModuleModule,
    EcPreviousQuotesModule,
    ClickOutsideModule
    
  ]
})
export class EcWorkflowBlotterModule { }
