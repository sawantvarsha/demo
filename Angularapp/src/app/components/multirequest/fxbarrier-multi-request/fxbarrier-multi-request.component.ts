import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fxbarrier-multi-request',
  templateUrl: './fxbarrier-multi-request.component.html',
  styleUrls: ['./fxbarrier-multi-request.component.scss']
})
export class FxbarrierMultiRequestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  title = 'FXMultipricerSH';
  direction = "horizontal"
  arr = [1,2,3,4,5,6,7,8,9,]

  PPName: string = "";
  BestPrice: any;

  

}
