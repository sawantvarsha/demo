import { Component } from '@angular/core';
import { MapleAPIService } from '../../maple-api.service';

@Component({
  selector: 'app-fx-dci',
  templateUrl: './fx-dci.component.html',
  styleUrls: ['./fx-dci.component.scss']
})
export class FxDciComponent  {

  constructor(private mapleapi: MapleAPIService) { }


}
