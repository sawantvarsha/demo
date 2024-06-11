import { Component } from '@angular/core';

@Component({
  selector: 'app-limitorder',
  templateUrl: './limitorder.component.html',
  styleUrls: ['./limitorder.component.css']
})
export class LimitorderComponent  {

  show = 'dealentry';
  dealentry: boolean;
  blotter: boolean;
  orderhistory: boolean;
  constructor() { 
    this.dealentry = true;
    this.blotter = false;
    this.orderhistory = false;
  }


  changeProduct(choice) {
    this.dealentry = false;
    this.blotter = false;
    this.orderhistory = false;
  
    switch (choice) {
      case 'dealentry':
        this.dealentry = true;
        break;
      case 'blotter':
        this.blotter = true;
        break;
      case 'orderhistory':
        this.orderhistory = true;
        break;  
  
      default:
        this.dealentry = true;
        break;
    }
  }

}
