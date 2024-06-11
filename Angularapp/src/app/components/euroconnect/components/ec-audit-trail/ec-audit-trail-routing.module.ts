import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcAuditTrailComponent } from './ec-audit-trail.component';

const routes: Routes = [{ path: '', component: EcAuditTrailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcAuditTrailRoutingModule { }
