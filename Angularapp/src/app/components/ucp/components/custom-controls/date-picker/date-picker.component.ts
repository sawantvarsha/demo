import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, SimpleChanges, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
// import { HelperFunctionService } from 'src/app/helpers/helper-function.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
const moment =  _moment;


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  host: {
    '(document:mousedown)': 'onClick($event)',
  },
  styles: [
    `
      mat-form-field {
        width: var(--width) !important;
      }
    `
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DatePickerComponent implements OnInit {
  @Input() input: any;
  @Input() value:string;
  @Input() TabFlag: boolean;
  @Input() disabled = false;
  @Input() width: any;
  @Input() displayFormat: string;   //Added by BhagyashriB on 27-Sept-2021 | input field added to set display format
  @Input() ParentComp: string;
  @Output() selectedDate = new EventEmitter<any>();
  // @Output() changeDate = new EventEmitter<any>();
  form: UntypedFormGroup;

  date: string;
  month: string;
  year: string;

  minYear: string;
  maxYear: string;
  dateFormat = 'dd-mmm-yyyy';
  calendarData: any;
  temp: String;
  parsedDate = '';
  showCalendar = false;
  showDatepicker: boolean = false;
  matSelectedDate = new UntypedFormControl(moment(new Date()));
  minDate = new Date(1970, 0, 1);
  maxDate = new Date(2050, 0, 1);
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  displayName: string;
  // constructor() { }
  constructor(private _eref: ElementRef) { }

  ngOnInit() {
    try{
      if (this.displayFormat) {       //Added by BhagyashriB on 27-Sept-2021 | this allows to change display format of date in date picker
        MY_FORMATS.display.dateInput = this.displayFormat;
      }
      console.log('ParentComp: ', this.ParentComp);
      const formGroup = {};
      formGroup[this.input.fieldName] = new UntypedFormControl('');
      this.form = new UntypedFormGroup(formGroup);
      if(this.TabFlag)
        this.displayName = "";
      else
        this.displayName = this.input.displayName;

      console.log("Input to date control::: ", this.input);
      this.minYear = '1970';
      this.maxYear = '2050';
      this.dateFormat = 'dd-mmm-yyyy';

      if (this.input.value && this.input.value.trim()) {
        this.matSelectedDate.setValue(moment(this.input.value.trim()));
        // this.parsedDate = this.input.value;
      } else {

        this.matSelectedDate = new UntypedFormControl(moment(new Date())); 
        this.input.value=moment(new Date()).format("DD-MMM-YYYY");  //Added by Swati to pass today's date
        //this.selectedDate.emit(moment(new Date()).format("DD-MMM-YYYY"));  //Added by Swati to pass today's date
        // const today = new Date();

        // this.date = today.getDate() > 9 ? '' + today.getDate() : '0' + today.getDate();
        // this.month = this.months[today.getMonth()];
        // this.year = today.getFullYear() + '';

        // this.parsedDate = this.date + '-' + this.month + '-' + this.year;
      }
    }
    catch(e){
      console.log("Error in selectSearchVal :", e)
    }
    // this.form.get(this.input.fieldName).setValue(this.parsedDate);
    //this.selectedDate.emit(this.matSelectedDate);
  }

  // setDate(date) {
  //   this.parsedDate = date;
  //   this.form.get(this.input.fieldName).setValue(this.parsedDate);

  //   this.selectedDate.emit(this.parsedDate);
  //   this.showCalendar = false;
  // }
  showPopup() {
    try{
      this.showDatepicker = true;
    }
    catch(e){
      console.log("Error in showPopup :", e)
    }
  }
  onClick(event) {
    try{
      if (!this._eref.nativeElement.contains(event.target)) {
          this.showDatepicker = false;
      }
    }
    catch(e){
      console.log("Error in onClick :", e)
    }
 }
  udfFieldValueChange(type: string, event, matDate: any) {
    try{
      console.log("Matselected date is .........", type, event, moment(matDate.value).format("DD-MMM-YYYY"), moment(this.matSelectedDate.value).format("DD-MMM-YYYY"));
      if(matDate.status.toUpperCase() == "INVALID" || matDate.value == null || matDate.value == ''){
        this.matSelectedDate = new UntypedFormControl(moment(new Date()));
        console.log("Change is done!", this.matSelectedDate);
      }
      event.value = moment(matDate.value).format("DD-MMM-YYYY");
      console.log("Updated event value is: ", event.value, typeof(event.value));
      this.selectedDate.emit(event);
    }
    catch(e){
      console.log("Error in udfFieldValueChange :", e)
    }
  }
  ngOnChanges()
  {
    try{
      if(this.input.value)
      {
        this.matSelectedDate.setValue(moment(this.input.value.trim()));
        console.log("Mat selected date is: ", this.matSelectedDate)
      }
    }
    catch(e){
      console.log("Error in ngOnChanges :", e)
    }
  }
}
