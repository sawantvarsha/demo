import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.css'],
  styles: [
    `
      mat-form-field {
        width: var(--width) !important;
      }
    `
  ]
})
export class MultiSelectDropdownComponent implements OnInit {

  @Input() input: any;
  @Input() values: any[];
  @Input() assignedValue: any;
  @Input() disabled = false; //added by devesh 
  @Input() width: any;
  @Output() selectedValue = new EventEmitter<any>();
  selected = [];
  options = [];

  constructor() { }

  ngOnInit(): void {
    try{
      console.log("Multi select::: ", this.input)
      if (String(this.input.value).includes('~')) //condition added by devesh as ngOnit triggered everytime after ngOnChanges which causes issue
      {
        this.selected=this.input.value.split('~'); //added by devesh for showing values in wfl mode & default value if any
      }
      else if(this.input.value.trim().length > 1) {
        this.selected = [];
        this.selected.push(this.input.value);
      }
    }
    catch(e){
      console.log("Error in ngOnInit :", e)
    }
  }

  ngOnChanges(changes: SimpleChange) {
    try{
      console.log("Multi select onchanges::: ", this.input,changes)
      this.options = this.values.map(a => a.code);
      // if (String(this.input.value).includes('~')) //condition added by devesh as ngOnit triggered everytime after ngOnChanges which causes issue
      // {
      if (this.input.value.lastIndexOf('~') + 1 === this.input.value.length && this.input.value.length > 1) {     //Added by BhagyashriB on 29-Sept-2021 
        this.selected = this.input.value.slice(0, -1).split('~'); //added by devesh for showing values in wfl mode & default value if any
      }
      else if(this.input.value.trim().length > 1) {
        this.selected = [];
        this.selected.push(this.input.value);
      }
    }
    catch(e){
      console.log("Error in ngOnChanges :", e)
    }
  }

  udfFieldValueChange(): void {
    try{
    this.input.value = this.selected.join("~")+"~"; //added by devesh since last element of the string must be '~', as per .net code
      this.selectedValue.emit(this.input);
    }
    catch(e){
      console.log("Error in udfFieldValueChange :", e)
    }
  }

}
