import { Component } from '@angular/core';
import { MapleAPIService } from '../../maple-api.service';

@Component({
  selector: 'app-mutual-funds',
  templateUrl: './mutual-funds.component.html',
  styleUrls: ['./mutual-funds.component.scss']
})
export class MutualFundsComponent {

  constructor(private mapleapi: MapleAPIService) { }



}
