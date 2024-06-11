import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcHomeComponent } from './components/ec-home/ec-home.component';
import { DecumulatorComponent } from './components/ec-pricers/decumulator/decumulator.component';
import { EuroconnectComponent } from './euroconnect.component';

const routes: Routes = [
  {
    path: '',
    component: EuroconnectComponent,
    children: [
      // Changes done by APurva K for FIN1EURINT-36|| 18-Apr-2023
      { path: '', redirectTo: '', pathMatch: 'full' },
      // {
      //   path: 'home',
      //   loadChildren: () =>
      //     import('./components/ec-home/ec-home.module').then(
      //       (m) => m.EcHomeModule
      //     ),
      // },

      { path: 'workbench', 
      loadChildren: () => import('./components/ec-workbench/ec-workbench.module').then(
        m => m.EcWorkbenchModule)
      },

      { path: 'pricers', 
      loadChildren: () => import('./components/ec-pricers/ec-pricers.module').then(
        m => m.EcPricersModule)
      },

      { path: 'multirequest',
       loadChildren: () => import('./components/ec-multirequest/ec-multirequest.module').then(
        m => m.EcMultirequestModule) 
      },

      { path: 'previousquotes',
      loadChildren: () => import('./components/ec-previous-quotes/ec-previous-quotes.module').then(
       m => m.EcPreviousQuotesModule) 
     },

     { path: 'workflowblotter',
     loadChildren: () => import('./components/ec-workflow-blotter/ec-workflow-blotter.module').then(
      m => m.EcWorkflowBlotterModule) 
    },

    { path: 'audittrail',
    loadChildren: () => import('./components/ec-audit-trail/ec-audit-trail.module').then(
     m => m.EcAuditTrailModule) 
   },

    { path: 'entitydefaultvalue',
    loadChildren: () => import('./components/default-value-setup/default-value-setup.module').then(
     m => m.DefaultValueSetupModule) 
    },

    
      // { path: 'workbench', component: EcHomeComponent },
      // { path: 'pricers', component: EcHomeComponent },
      // { path: 'multirequest', component: EcHomeComponent },
      // { path: 'previousquotes', component: EcHomeComponent },
      // { path: 'previousquotes', component: EcHomeComponent },
      // { path: 'workflowblotter', component: EcHomeComponent },
      // { path: 'audittrail', component: EcHomeComponent },
    ],
  },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EuroconnectRoutingModule {}
