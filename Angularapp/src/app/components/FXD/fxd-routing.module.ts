import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FXDDashboardComponent } from '../../components/FXD/fxddashboard/fxddashboard.component';
import { RFQLogMonitorComponent } from './rfqlog-monitor/rfqlog-monitor.component';


const routes: Routes = [
  {
    path: '',
    component: FXDDashboardComponent,
  },
   //added by urmilaA | 7-Sep-23 |start
  {
    path: 'quotehistory',
    component: RFQLogMonitorComponent,
  },
   //added by urmilaA | 7-Sep-23 |ends
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FXDRoutingModule {}
