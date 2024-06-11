import { Component, OnInit } from '@angular/core';
import { EcHomeService } from '../../services/ec-home.service';

@Component({
  selector: 'app-default-value-setup',
  templateUrl: './default-value-setup.component.html',
  styleUrls: ['./default-value-setup.component.scss']
})
export class DefaultValueSetupComponent implements OnInit {

  //clickTab = 'Autocallable';
  //PayoffNamearray: any;
  //TrueDisplayProducts: any[] = [];
  subpages = [];
  constructor(public apifunctions: EcHomeService) { }
  //Page load logic changed by AdilP as per new layout @11-07-2023
  async ngOnInit() {
    if (this.apifunctions.payOffList === undefined || this.apifunctions.payOffList.length <= 0) {
      await this.apifunctions.getPayOffList();
    }
    const res: any = this.apifunctions.payOffList.filter(e => {
      return e.display;
    });
    res.forEach((item: any)=>{
    if(item.displayName === 'Autocallable'){
    this.subpages.push({ ActiveYN: true, Name: item.displayName, displayYN: item.display})
    }
    else  if(item.displayName === 'Custom Strategy'){
    this.subpages.push({ ActiveYN: false, Name: item.displayName, displayYN: item.display})
    }else
    this.subpages.push({ ActiveYN: false, Name: item.displayName, displayYN: item.display})

    });

    // this.PayoffNamearray = await this.apifunctions.payOffList
    // console.log(this.PayoffNamearray,"PayoffNamearray")
    // //console.log(this.PayoffNamearray);
    // for (let i = 0; i < this.PayoffNamearray.length; i++) {
    //   if (this.PayoffNamearray[i].display === true) {
    //     //console.log(this.PayoffNamearray[i].Product, "Product");
    //     this.TrueDisplayProducts.push(this.PayoffNamearray[i].Product);
    //   }
    // }
    // this.clickTab = this.TrueDisplayProducts[0];
    // console.log(this.clickTab,"ClickTab")
    // this.SelectedTab(this.clickTab);

  }
  

  eqchangeProduct(choice, from) {
    if (from === 'click') {
      if (choice !== '') {
        
        this.subpages.forEach((res) => {
          if (res) {
            if (res.Name === choice) {
              res.ActiveYN = true;
            } else {
              res.ActiveYN = false;
            }
          }
        });
      }
    } else {
      if (choice !== '') {
        this.subpages.forEach((res) => {
          if (res) {
            if (res.Name === choice) {
              res.ActiveYN = true;
            } else {
              res.ActiveYN = false;
            }
          }
        });
      }
    }
  }
  // SelectedTab(tab: any) {
  //   this.clickTab = tab;
  // }
}
