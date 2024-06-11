import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcHomeComponent } from './ec-home.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'dashboard',
    component: EcHomeComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./landing-page/landing-page.module').then(
            (m) => m.LandingPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EcHomeRoutingModule {}
