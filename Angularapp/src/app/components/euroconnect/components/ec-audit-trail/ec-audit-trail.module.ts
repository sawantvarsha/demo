import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcAuditTrailRoutingModule } from './ec-audit-trail-routing.module';
import { EcAuditTrailComponent } from './ec-audit-trail.component';
import { FormsModule } from '@angular/forms';
import { SharedModuleModule } from '../../CommonComponents/svg-icons/shared-module/shared-module.module';


@NgModule({
  declarations: [
    EcAuditTrailComponent
  ],
  imports: [
    CommonModule,
    SharedModuleModule,
    EcAuditTrailRoutingModule,
    FormsModule
  ]
})
export class EcAuditTrailModule { }
