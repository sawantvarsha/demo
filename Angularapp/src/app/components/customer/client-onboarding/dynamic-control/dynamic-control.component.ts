import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dynamic-control',
  templateUrl: './dynamic-control.component.html',
  styleUrls: ['./dynamic-control.component.scss']
})
export class DynamicControlComponent implements OnInit {


  @Input() controlDetails: any;
  @Input() token: '';

  @Output() action = new EventEmitter<any>();

  id: string;
  controlSelectionCondition: boolean;
  buttonAsLink: boolean;
  buttonaction: string;
  constructor() {
  }

  ngOnInit() {
    this.id = this.generateRandomControlId();
    // console.log(this.controlDetails);
    this.controlSelectionCondition = Object.keys(this.controlDetails).includes('Action_button_id');
    this.buttonAsLink = this.controlDetails.Button_As_Link === 'Y';
    this.buttonaction = this.controlDetails.Action_Button_Title
    // console.log('sau', this.buttonaction);
  }

  generateRandomControlId() {
    return 'xxxxxxxxxxxxxxx'.replace(/[x]/g, (c) => {
      // eslint-disable-next-line no-bitwise
      const r = Math.random() * 16 | 0;
      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString();
    });
  }

  ButtonClick() {
    // console.log(this.token);

    this.action.emit({ control: 'button', event: 'click', buttonId: this.controlDetails.Action_button_id, tokenId: this.token});
  }

}

