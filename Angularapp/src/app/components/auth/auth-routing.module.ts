import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyLoginComponent } from './verify-login/verify-login.component';

const routes: Routes = [
  // { path: '', redirectTo:'verifyemail/test' },
  { path: 'verifyemail/:userid', component: VerifyLoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class AuthRoutingModule { }
