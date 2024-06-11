import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapleComponent } from './maple.component';

const routes: Routes = [
  {
    path: '',
    component: MapleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapleRoutingModule {}
