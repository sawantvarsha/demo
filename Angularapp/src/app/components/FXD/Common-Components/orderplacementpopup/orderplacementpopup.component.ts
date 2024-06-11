import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-orderplacementpopup',
  templateUrl: './orderplacementpopup.component.html',
  styleUrls: ['./orderplacementpopup.component.scss']
})
export class OrderplacementpopupComponent implements OnInit {
  @Input() Orderplace: string;
  @Input() DealNo: string;
  @Input() orderTime: string;

  @Output() Orderplacepopupclose = new EventEmitter<boolean>();
  
  constructor() { }

  ngOnInit(): void {
  }

  fnCloseOrderPopUp(){
    this.Orderplacepopupclose.emit(false);
  }
}
