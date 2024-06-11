import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { EuroconnectRoutingModule } from './euroconnect-routing.module';
import { EuroconnectComponent } from './euroconnect.component';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';
import { EcHomeComponent } from './components/ec-home/ec-home.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { EcEventCalendarComponent } from './components/ec-event-calendar/ec-event-calendar.component';
import { EcLifecycleComponent } from './components/ec-lifecycle/ec-lifecycle.component';
import { EcSelectAllOptionComponent } from './components/ec-select-all-option/ec-select-all-option.component';
import { DefaultValueSetupComponent } from './components/default-value-setup/default-value-setup.component';
import { DefaultAutocallableComponent } from './components/default-value-setup/default-autocallable/default-autocallable.component';
import { DefaultYieldComponent } from './components/default-value-setup/default-yield/default-yield.component';
import { DefaultParticipationComponent } from './components/default-value-setup/default-participation/default-participation.component';
import { DefaultAccumComponent } from './components/default-value-setup/default-accum/default-accum.component';
import { DefaultDecumComponent } from './components/default-value-setup/default-decum/default-decum.component';


@NgModule({
  declarations: [EuroconnectComponent, EcEventCalendarComponent, EcLifecycleComponent, EcSelectAllOptionComponent],
  imports: [
    EuroconnectRoutingModule,
    SharedComponentsModule,
    CommonModule,
    MatTableModule,
    MatTabsModule,
    MatSlideToggleModule,
    FormsModule,
  ],
})
export class EuroconnectModule {}
