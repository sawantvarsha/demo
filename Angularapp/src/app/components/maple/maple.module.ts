import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { MapleComponent } from '../maple/maple.component';
import { MapleRoutingModule } from './maple-routing.module';

@NgModule({
  declarations: [MapleComponent],
  imports: [
    SharedComponentsModule,
    AuthRoutingModule,
    CommonModule,
    MapleRoutingModule,
  ],
})
export class MapleModule {}
