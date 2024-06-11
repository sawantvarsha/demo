import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { UCPDealEntryComponent } from './components/UCPDealEntry/UCPDealEntry.component';


const routes: Routes = [
  { path: '', component: UCPDealEntryComponent }, // Added by OnkarE on 01-June-2023 // Changes by RajeshC on 09-Oct-2023
  
  // { path: '', redirectTo: '', pathMatch: 'full' },
  // { path: 'dealentry', 
  //     loadChildren: () => import('./components/UCPDealEntry/UCPDealEntry.component').then(
  //       m => m.UCPDealEntryComponent) 
  // }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UCPRoutingModule {}
