import { Component } from '@angular/core';

@Component({
  selector: 'app-fi-bonds',
  templateUrl: './fi-bonds.component.html',
  styleUrls: ['./fi-bonds.component.scss']
})
export class FiBondsComponent {

  constructor() { }

  orderFlag= false;


  bookRequest(){
    this.orderFlag = true;
  }

}
