/// Created this component to handle 'TIME' datatype in UCP by OnkarE on 16-June-2021
// import { NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
// import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
const moment = _moment;
import { Theme } from 'src/app/themeService/theme.module'; // Added by OnkarE
import { ThemeserviceService } from 'src/app/themeService/themeservice.service'; // Added by OnkarE
import { Subscription } from 'rxjs'; // Added by OnkarE

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'l, LTS'
  },
  display: {
    dateInput: 'hh:mm:ss A',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};


@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      //deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
   // {provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS}
  ]
})



export class TimePickerComponent implements OnInit {
  @Input() input: any;
  @Input() disabled = false;
  @Input() width: string;
  @Output() selectedTime = new EventEmitter<any>();
  form: UntypedFormGroup;
  date: string;
  month: string;
  year: string;
  stepHour: number;
  stepMinute: number;
  stepSecond: number;

  minYear: string;
  maxYear: string;
  dateTimeFormat = 'hh:mm:ss:t';
  calendarData: any;
  temp: String;
  parsedDate = '';
  showCalendar = false;
  matSelectedTime = new UntypedFormControl(moment(new Date()));
  selectedTheme:any; // Added by OnkarE on 03-Feb-2022
  themeList: Theme[]; // Added by OnkarE on 03-Feb-2022
	Subscription:  Subscription; // Added by OnkarE on 04-Feb-2022

  constructor(public themeService: ThemeserviceService) { }

  ngOnInit(): void {
    try{
      const formGroup = {};
      formGroup[this.input.fieldName] = new UntypedFormControl('');
      this.form = new UntypedFormGroup(formGroup);
      
      // Added theme changes to get theme wise background style to be set in date time picker
      this.themeList=this.themeService.getAvailableThemes();
      this.Subscription = this.themeService.themeEmit.subscribe(res => {
        this.selectedTheme = res;
      })
      this.themeList = this.themeList.filter(e => e.name == this.selectedTheme)

      this.stepHour = 1;
      this.stepMinute = 1;
      this.stepSecond = 1;

      if (this.input.value.trim()) {
        this.matSelectedTime.setValue(moment(this.input.value.trim()));
      } else {
        this.matSelectedTime = new UntypedFormControl(moment(new Date()));
        this.input.value = moment(new Date()).format("hh:mm:ss A");
        //this.selectedTime.emit(moment(new Date()).format("hh:mm:ss A"));
      }
    }
    catch(e){
      console.log("Error in ngOnInit :", e)
    }
  }

  udfFieldValueChange(type: string, event, matDate: any) {
    try{
      console.log("Selected DateTime is ......", type, event, moment(matDate.value).format("hh:mm:ss A"), moment(this.matSelectedTime.value).format("hh:mm:ss A"));
      if (matDate.status.toUpperCase() == "INVALID" || matDate.value == null || matDate.value == '') {
        this.matSelectedTime = new UntypedFormControl(moment(new Date()));
        console.log("Change for DateTime is done!", this.matSelectedTime);
      }
      event.value = moment(matDate.value).format("hh:mm:ss A");
      console.log("Updated event value for DateTime is: ", event.value, typeof(event.value));
      this.selectedTime.emit(event);
    }
    catch(e){
      console.log("Error in udfFieldValueChange :", e)
    }
  }

  hideCalendar(){
    // console.log("Hiding Calneder");
    // var calClass = document.getElementsByClassName("mat-calendar") as HTMLCollectionOf<HTMLElement>;
    // console.log("Cal Class element::: ", calClass);
    // if(calClass.length > 0) {
    //   calClass[0].style.display = "none";
    //   var timeclass = document.getElementsByClassName("time-container") as HTMLCollectionOf<HTMLElement>;
    //   if(timeclass.length > 0){
    //     timeclass[0].style.width = this.width;
    //   }
    // }
  }

  toggle(ref: any){
    try{
      console.log("Hiding Calneder", ref);
      // Added theme changes to get theme wise background style to be set in date time picker
      this.themeList=this.themeService.getAvailableThemes();
      this.Subscription = this.themeService.themeEmit.subscribe(res => {
        this.selectedTheme = res;
      })
      this.themeList = this.themeList.filter(e => e.name == this.selectedTheme)
      
      var calClass = document.getElementsByClassName("mat-calendar") as HTMLCollectionOf<HTMLElement>;
      var bgClr = this.themeList[0].properties['--calenderBGClr'] // Added by OnkarE
      console.log("Cal Class element::: ", calClass);
      if(calClass.length > 0) {
        calClass[0].style.display = "none";

        var contentClass = document.getElementsByClassName("mat-datepicker-content") as HTMLCollectionOf<HTMLElement>;
        if(contentClass.length > 0) {
          contentClass[0].style.width = "300px";
          contentClass[0].style.height = "250px";
          contentClass[0].style.background = bgClr;
        }

        // var btnClass = document.getElementsByClassName("mat-focus-indicator mat-button mat-stroked-button mat-button-base mat-primary") as HTMLCollectionOf<HTMLElement>;
        // if(btnClass.length > 0){
        //   btnClass[0].style.marginLeft = "-42px";
        //   btnClass[0].style.marginTop = "5px";
        // }

        // var spacerClass = document.getElementsByClassName("spacer") as HTMLCollectionOf<HTMLElement>;
        // if(spacerClass.length > 0){
        //   for (let i = 0; i < spacerClass.length; i++) {
        //     spacerClass[i].style.paddingTop = "26px";
        //   }
        // }

      }
    }
    catch(e){
      console.log("Error in toggle :", e)
    }
  }

  /// Picker open action 
  // .mat-calendar


  // ngAfterViewChecked() {
  //   if(this.input.dataType === 'TIME'){
  //     var calClass = document.getElementsByClassName("mat-calendar") as HTMLCollectionOf<HTMLElement>;
  //     console.log("Cal Class element::: ", calClass);
  //     if(calClass.length > 0) {
  //       calClass[0].style.display = "none";
  //       var timeclass = document.getElementsByClassName("time-container") as HTMLCollectionOf<HTMLElement>;
  //       if(timeclass.length > 0){
  //         timeclass[0].style.width = this.width;
  //       }
  //     }
  //   }
  // }

}
