import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-insurance-surrender',
  templateUrl: './insurance-surrender.component.html',
  styleUrls: ['./insurance-surrender.component.scss'],
})
export class InsuranceSurrenderComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<boolean>();
  @Input() policyData: any;

  constructor() {
    // setTimeout(() => {
    //   console.log('Policy Data', this.policyData);
    // }, 1000);

      console.log('Policy Data', this.policyData);


  }

  ngOnInit(): void {}

  EmitColseAction() {
    this.newItemEvent.emit(false);
  }
}
