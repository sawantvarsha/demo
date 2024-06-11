// Changes added by Mayuri D. on 04-July-2022.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { EcHomeRoutingModule } from './ec-home-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';
import { HomeComponent } from 'src/app/components/home/home.component';
import { EcHomeComponent } from './ec-home.component';


@NgModule({
  declarations: [EcHomeComponent],
  imports: [EcHomeRoutingModule, SharedComponentsModule],
})
export class EcHomeModule {}
