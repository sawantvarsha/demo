import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EcCommonService } from './services/ec-common.service';
@Component({
  selector: 'app-euroconnect',
  templateUrl: './euroconnect.component.html',
  styleUrls: ['./euroconnect.component.scss'],
})
export class EuroconnectComponent implements OnInit {
  constructor(public ecCommonApi: EcCommonService, public router: Router) { }

   ngOnInit() {

    this.router.events.subscribe((res: any) => {
      console.log('in ec', res.routeConfig);

    })
    
    //const entityCode = await this.ecCommonApi.getEntityCode();
    // console.log(entityCode);
  }
}
