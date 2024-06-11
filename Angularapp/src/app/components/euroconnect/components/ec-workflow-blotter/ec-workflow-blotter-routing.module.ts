import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcWorkflowBlotterComponent } from './ec-workflow-blotter.component';

const routes: Routes = [{ path: '', component: EcWorkflowBlotterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcWorkflowBlotterRoutingModule { }
