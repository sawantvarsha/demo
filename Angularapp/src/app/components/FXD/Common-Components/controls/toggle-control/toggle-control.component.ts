import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-toggle-control',
  templateUrl: './toggle-control.component.html',
  styleUrls: ['./toggle-control.component.scss'],
})
export class ToggleControlComponent implements OnInit, OnChanges {
  constructor() {}

  @Input() button1Name: string;
  @Input() button2Name: string;
  @Input() IsDisabled: boolean;
  @Input() DefaultSelectedOption: string;

  IsButtonChecked: boolean = true;
  @Output() SelectedButton = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.IsButtonChecked = true;
    if (this.DefaultSelectedOption === this.button1Name) {
      this.IsButtonChecked = false;
    } else {
      this.IsButtonChecked = true;
    }
  }

  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.DefaultSelectedOption === this.button1Name) {
      this.IsButtonChecked = false;
    } else {
      this.IsButtonChecked = true;
    }
    this.fnSelectedBuySellBtn();
  }

  fnSelectedBuySellBtn() {
    this.SelectedButton.emit(this.IsButtonChecked);
  }
}
