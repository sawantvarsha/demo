import { I } from '@angular/cdk/keycodes';
import { Component, OnInit, Input, Output, EventEmitter, NgModule, ElementRef, ChangeDetectorRef, OnChanges } from '@angular/core';
declare var require: any;

@Component({
  selector: 'app-custom-tab-field-templates',
  templateUrl: './custom-tab-field-templates.component.html',
  styleUrls: ['./custom-tab-field-templates.component.css'],
  styles: [
    `
      mat-form-field {
        width: var(--width) !important;
      }
    `
  ]
})
export class CustomTabFieldTemplatesComponent implements OnInit  {
  @Input() control: any;
  @Input() index: any;
  @Input() dropdowns: any;
  @Input() searchArrays: any;
  @Input() shareArray: any;
  @Input() ColSize: number;
  @Input() RowSize: number;
  @Input() CustomTabs: any;T
  @Output() CustomTabChangeChange = new EventEmitter<any>();

  customTabFlag: any;
  width:any;
  //mandatoryImageUrl = require('../../../../../assets/mandatory.png');
  constructor(private elemRef: ElementRef, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    //console.log("Initializing Custom Tab App templates......", this.control);
    try{

      this.customTabFlag = true;


      if ((this.control.dataType === "AMOUNT" ||this.control.dataType === "NUMBER") && Number(this.control.defaultValue) > 0) { //added by devesh as amount was not formatting on value change,same code was present in field template but missing here
        this.control.value = this.formatKLMB(this.control.value, this.control.udF_Format);
      }
      
      if(this.control.udF_Feature1.toUpperCase().includes('WIDTH')){
        this.width = this.control.udF_Feature2.toString() + "px";
      }
      else {
        this.width = "100px"
      }
      let dropdownList = document.getElementsByClassName("UCPMatSelect");
      for (let i = 0; i < dropdownList.length; i++) {
        dropdownList[i].parentElement.classList.add('ucp-mat-select-parent');
      }
    }
    catch(e){
      console.log("Error in ngOnInit :", e)
    }
  }
  // ngAfterViewChecked() {
  //  this.ref.detectChanges();
  //  console.log(this.control.displayName, this.control.value);
    
  // }

  ngOnChanges() {
    try{
      this.customTabFlag = true;
    }
    catch(e){
      console.log("Error in ngOnChanges :", e)
    }
    //this.doSomething(this.CustomTabs);
  }

  async customTabFieldValueChange(control: any) {
    try{
      control.rowNo = this.index;
      //console.log("Control in ts file...", control);
      this.CustomTabChangeChange.emit(control);
    }
    catch(e){
      console.log("Error in customTabFieldValueChange :", e)
    }
  }

  selectDate(control: any, date: string) {
    try{
      console.log(date);
      control.value = date;
      this.CustomTabChangeChange.emit(control);
    }
    catch(e){
      console.log("Error in selectDate :", e)
    }
  }

  checkUDFVisibility(index: number) {
    try{
      const mod = index % 50;
      if (index > 50 * this.ColSize) {
        return { 'display': 'none' };
      }
      if ((mod) >= this.RowSize) {
        return { 'display': 'none' };
      } else {
        return { 'display': 'grid' };
      }
    }
    catch(e){
      console.log("Error in checkUDFVisibility :", e)
    }
    
  }

  formatNumber(control: { value: string; udF_Format: number; }) {
    // console.log(control);
    try{
      console.log("Formatting number",control);
      if (isNaN(parseFloat(control.value))) {
        // return '';
        control.value = '';
      } else {
        control.value = this.formatKLMB(control.value, control.udF_Format);
      }
    }
    catch(e){
      console.log("Error in formatNumber :", e)
    }
  }

  unformatNumber(control: { value: string; }) {
    try{
      // console.log(control);
      if (control.value) {
        control.value.replace(/,/g, '');
      }
    }
    catch(e){
      console.log("Error in unformatNumber :", e)
    }
    // control.currentValue.replace(/,/g, '');
  }

  IsValidNumber(val: any): boolean {
    try {
      return /^\d+(.\d*?)?$/.test(val);
    }
    catch(e){
      console.log("Error in IsValidNumber :", e)
    }
  }

  formatKLMB(value: string, precision = 2) {
    try{
      value = value.replace(/,/g, '');
      if ((value.match(/([kK]{1})/g)) != null) {
        value = (parseFloat(value.replace(/[kK]/g, '')) * 1000).toFixed(precision);
      } else if ((value.match(/([lL]{1})/g)) != null) {
        value = (parseFloat(value.replace(/[lL]/g, '')) * 100000).toFixed(precision);
      } else if ((value.match(/([mM]{1})/g)) != null) {
        value = (parseFloat(value.replace(/[mM]/g, '')) * 1000000).toFixed(precision);
      } else if ((value.match(/([bB]{1})/g)) != null) {
        value = (parseFloat(value.replace(/[bB]/g, '')) * 1000000000).toFixed(precision);
      }
      if(precision == 2)
        value = parseFloat(value).toFixed(precision).replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ','); // Changed by Onkar on 14-Apr-2023
      else 
        value = parseFloat(value).toFixed(precision).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      console.log("Formatting number",value);
      return value;
    }
    catch(e){
      console.log("Error in formatKLMB :", e)
    }
  }

  selectSearchVal(control: String, searchVal: String){
    try{
      console.log(control,searchVal)
    }
    catch(e){
      console.log("Error in selectSearchVal :", e)
    }
  }
}
