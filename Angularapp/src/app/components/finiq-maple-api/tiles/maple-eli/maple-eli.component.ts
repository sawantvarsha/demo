import { Component, OnInit } from '@angular/core';
import { MapleAPIService } from '../../maple-api.service';

@Component({
  selector: 'app-maple-eli',
  templateUrl: './maple-eli.component.html',
  styleUrls: ['./maple-eli.component.scss']
})
export class MapleEliComponent implements OnInit {

  constructor(private mapleapi: MapleAPIService) { }

  currency = [];
  selectedCcy: any;

  ngOnInit(): void {

    this.selectedCcy = "HKD";

    this.mapleapi.maplegetccyELI("HRRM2");
    this.mapleapi.ccyELI.subscribe( res => {
      if(res!= "")
      {
        let ccy = res.Get_CcyList_JSONResult;
        for(let i=0; i< Object.keys(ccy).length;i++)
        {
          this.currency[i] = ccy[i].Ccy;
        }
        console.log("Maple ELI get ccy = ",this.currency);
      }
    })
  }

}
