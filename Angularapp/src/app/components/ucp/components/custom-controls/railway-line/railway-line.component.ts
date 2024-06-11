import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-railway-line',
  templateUrl: './railway-line.component.html',
  styleUrls: ['./railway-line.component.css']
})
export class RailwayLineComponent implements OnInit {

  @Input() input: any;
  @Input() radioValues: any[];
  @Output() selectedValue = new EventEmitter<any>();
  currentValue: string;
  constructor() { }

  ngOnInit(): void {
    try{
      console.log("Railway line, control: ", this.input);
      if (this.input.value) {
        this.currentValue = this.input.value;
      }
    }
    catch(e){
      console.log("Error in ngOnInit :", e)
    }
  }

  radioSelectionChange(event: MatRadioChange): void {
    try{
      this.input.value = event.value;
      this.selectedValue.emit(this.input);
    }
    catch(e){
      console.log("Error in radioSelectionChange :", e)
    }
  }

}
