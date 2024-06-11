import { Component } from '@angular/core';
import { AppConfig } from 'src/app/services/config.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent  {

  CompanyLogo: string;

  constructor() {
    this.CompanyLogo = AppConfig.settings.CSP_Company_Logo
  }

}
