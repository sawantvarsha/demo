import { Component, Input, OnInit } from '@angular/core';
import { EqcApifunctionService } from '../Services/eqc-apifunction.service';

@Component({
  selector: 'app-eqc-card-dashboard',
  templateUrl: './card-dashboard.component.html',
  styleUrls: ['./card-dashboard.component.scss'],
})
export class EQCCardDashboardComponent implements OnInit {
  @Input() ProductName: string;
  ViewMode: string = 'Card';

  ProductCards = [];

  constructor(public EQC_afs: EqcApifunctionService) {}

  ngOnInit(): void {
    this.EQC_afs.SetLoggedInUser();
    // this.EQC_afs.AuthenticateUser().subscribe(Res => {
    //   try{
    //   this.EQC_afs.SetToken(Res.token);
    this.fnLoadValuesInSubPage();
    //   }catch(ex){
    //   }
    // });
  }

  fnLoadValuesInSubPage() {
    this.ProductCards = [
      {
        name: 'AQ',
        displayYN: true,
        activeYN: true,
      },
    ];
  }
}
