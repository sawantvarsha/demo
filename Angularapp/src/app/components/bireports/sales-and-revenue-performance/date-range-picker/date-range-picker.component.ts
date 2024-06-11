import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FilterService } from '../filter.service';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css']
})
export class DateRangePickerComponent implements OnInit {

  display=1

  ngOnInit(): void {
    this.startDate = this.service.minDate;
    this.endDate = this.service.maxDate;
    this.currentFirst = this.service.currentMinDate
    this.currentLast = this.service.currentMaxDate
    this.dateTimeDisplayString = this.datepipe.transform(this.currentFirst, this.displayFormat);
    this.lastDateTimeDisplayString = this.datepipe.transform(this.currentLast, this.displayFormat);
    this.options.floor = this.startDate.getTime()
    this.options.ceil = this.endDate.getTime()
    this.setDateProperties();
    
    this.service.dataReceived.subscribe(() => {
      this.display=2
      this.startDate = this.service.minDate;
      this.endDate = this.service.maxDate;
      this.options.floor = this.startDate.getTime()
      this.options.ceil = this.endDate.getTime()
      this.currentFirst = this.startDate
      this.currentLast = this.endDate
      this.dateTimeDisplayString = this.datepipe.transform(this.currentFirst, this.displayFormat);
      this.lastDateTimeDisplayString = this.datepipe.transform(this.currentLast, this.displayFormat);
      this.setDateProperties()
    })

    this.service.sendStateDataEvent.subscribe(() => {
      this.startDate = this.service.minDate;
      this.endDate = this.service.maxDate;
      this.currentFirst = this.service.currentMinDate
      this.currentLast = this.service.currentMaxDate
      this.dateTimeDisplayString = this.datepipe.transform(this.currentFirst, this.displayFormat);
      this.lastDateTimeDisplayString = this.datepipe.transform(this.currentLast, this.displayFormat);
      this.setDateProperties()
    })

    if (!this.displayFormat && this.format === 'date') {
      this.displayFormat = 'dd-MMM-yyyy';
      //console.log("display ", this.displayFormat);

    }

    if (!this.displayFormat && this.format === 'datetime') {
      this.displayFormat = 'dd-MMM-yyyy h:mm a'
      //console.log("display ", this.displayFormat);

    }
  }

  constructor(private service: FilterService, private datepipe: DatePipe) {

  }

  startDate!: Date
  endDate!: Date
  currentFirst!: Date
  currentLast!: Date
  currentFirstNum!: number
  currentLastNum!: number

  dateTime: string;
  lastDateTime: string;
  dateTimeDisplayString: string;
  lastDateTimeDisplayString: string;
  hiddenDate: Date;
  //asseturl = environment.asseturl;
  //Added by Amogh K | 4/4/2022 | added display format and width
  @Input() displayFormat: any;
  @Input() width: any = '40%';
  @Input() isdisabled: boolean = false;
  @Input() maxDate: string = '';
  @Input() format: string = "date";
  onChange: (value: any) => any = (value: any) => { console.log(value) };
  onTouched: () => any = () => { };

  options: Options = {
    // floor: this.startDate.getTime(),
    // ceil:this.endDate.getTime(),

    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "";
        case LabelType.High:
          return "";
        default:
          return "";
      }
    }
  };



  stdbinder(selected: number, event: any) {
    console.log("In Std Binder")
    if (selected === 1) {
      this.currentFirstNum = event
    }
    else {
      this.currentLastNum = event
    }
    this.currentFirst = new Date(this.currentFirstNum);
    this.currentLast = new Date(this.currentLastNum);
    this.dateTimeDisplayString = this.datepipe.transform(this.currentFirst, this.displayFormat);
    this.lastDateTimeDisplayString = this.datepipe.transform(this.currentLast, this.displayFormat);
    this.service.currentMinDate = this.currentFirst;
    this.service.currentMaxDate = this.currentLast;
    this.service.dateCurrencyAndPayOffFilter();
    this.service.dateFilterEvent.emit()
  }

  selectDate(date) {
    return this.datepipe.transform(date, 'dd-MMM-yyyy');
  }

  dtsbinder(selected: number, event: any) {
    console.log("In Dts Binder")
    if (selected === 1) {
      this.currentFirst = event
    }
    else {
      this.currentLast = event
    }
    this.currentFirstNum = this.currentFirst.getTime();
    this.currentLastNum = this.currentLast.getTime();
    this.service.currentMinDate = this.currentFirst;
    this.service.currentMaxDate = this.currentLast;
    this.service.dateCurrencyAndPayOffFilter();
    this.service.dateFilterEvent.emit()
  }

  setDateProperties() {
    // this.currentFirst=this.startDate;
    // this.currentLast=this.endDate;
    this.currentFirstNum = this.currentFirst.getTime();
    this.currentLastNum = this.currentLast.getTime();
  }

  // writeValue(obj: any): void {
  //   if (!this.displayFormat && this.format === 'date')
  //     this.displayFormat = 'dd-MMM-yyyy';
  //   if (!this.displayFormat && this.format === 'datetime')
  //     this.displayFormat = 'dd-MMM-yyyy h:mm a'

  //   if (obj) {
  //     if (typeof (obj) != typeof (''))
  //       this.dateTime = this.datepipe.transform(obj, 'yyyy-MM-ddTHH:mm')
  //     else
  //       this.dateTime = obj;
  //     if (this.format.toLocaleLowerCase() === "date")
  //       this.dateTimeDisplayString = this.datepipe.transform(this.dateTime, this.displayFormat);
  //     else
  //       // this.dateTimeDisplayString = this.datepipe.transform(this.dateTime, 'dd-MMM-yyyy H:mm a');
  //       this.dateTimeDisplayString = this.datepipe.transform(this.dateTime, this.displayFormat);
  //   }
  //   else {
  //     this.dateTime = '';
  //     this.dateTimeDisplayString = '';
  //   }

  // }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // ngOnInit() {
  //   //Added by Amogh K | 4/4/2022 | initializing display format

  // }
  dateChanged(num: any, event: any) {
    if (num === 1) {
      this.dateTime = event;
      if (this.format.toLocaleLowerCase() === "date") {
        this.dateTimeDisplayString = this.datepipe.transform(event, this.displayFormat);
        this.currentFirst = new Date(event)
        this.currentFirstNum = this.currentFirst.getTime();
        //this.currentLastNum = this.currentLast.getTime();
        this.service.currentMinDate = this.currentFirst;
        this.service.currentMaxDate = this.currentLast;
        this.service.dateCurrencyAndPayOffFilter();
        this.service.dateFilterEvent.emit()
      }
      else
        // this.dateTimeDisplayString = this.datepipe.transform(event, 'dd-MMM-yyyy H:mm a');
        this.dateTimeDisplayString = this.datepipe.transform(event, this.displayFormat);
      this.onChange(this.dateTime);
    }
    if (num === 2) {
      this.lastDateTime = event;
      if (this.format.toLocaleLowerCase() === "date") {
        this.lastDateTimeDisplayString = this.datepipe.transform(event, this.displayFormat);
        this.currentLast = new Date(event)
        //this.currentFirstNum = this.currentFirst.getTime();
        this.currentLastNum = this.currentLast.getTime();
        this.service.currentMinDate = this.currentFirst;
        this.service.currentMaxDate = this.currentLast;
        this.service.dateCurrencyAndPayOffFilter();
        this.service.dateFilterEvent.emit()
      }
      else
        // this.dateTimeDisplayString = this.datepipe.transform(event, 'dd-MMM-yyyy H:mm a');
        this.lastDateTimeDisplayString = this.datepipe.transform(event, this.displayFormat);
      this.onChange(this.dateTime);
      this.onChange(this.lastDateTime)
    }

  }

  //Added by KaustubhS for editable datetime field :: START
  userInputDate(num: any, event: any) {

    if (num === 1) {
      try {
        const ipDateArr = event.target.value.match(/\w+/g); //split the input values
        //expected values :: ipDateArr[0] => Day, ipDateArr[1] => Month, ipDateArr[2] => Year

        let ipDateStr: string = `${ipDateArr[1]}-${ipDateArr[0]}-${ipDateArr[2]}`;

        if (this.format.toLocaleLowerCase() === 'datetime') {
          const time: string = `${(ipDateArr[3] || 0)}:${(ipDateArr[4] || 0)} ${(ipDateArr[5] || '')}`.trim();
          ipDateStr = ipDateStr.concat(` ${time}`);
        }

        this.dateTimeDisplayString = this.datepipe.transform(new Date(ipDateStr), this.displayFormat);
        this.currentFirst = new Date(ipDateStr)
        this.currentFirstNum = this.currentFirst.getTime();
        //this.currentLastNum = this.currentLast.getTime();
        this.service.currentMinDate = this.currentFirst;
        this.service.currentMaxDate = this.currentLast;
        this.service.dateCurrencyAndPayOffFilter();
        this.service.dateFilterEvent.emit()

      } catch (error) {
        console.log(error);
        this.dateTimeDisplayString = this.datepipe.transform(new Date(), this.displayFormat);
      }
    }
    if(num === 2){
      try {
        const ipDateArr = event.target.value.match(/\w+/g); //split the input values
        //expected values :: ipDateArr[0] => Day, ipDateArr[1] => Month, ipDateArr[2] => Year

        let ipDateStr: string = `${ipDateArr[1]}-${ipDateArr[0]}-${ipDateArr[2]}`;

        if (this.format.toLocaleLowerCase() === 'datetime') {
          const time: string = `${(ipDateArr[3] || 0)}:${(ipDateArr[4] || 0)} ${(ipDateArr[5] || '')}`.trim();
          ipDateStr = ipDateStr.concat(` ${time}`);
        }

        this.lastDateTimeDisplayString = this.datepipe.transform(new Date(ipDateStr), this.displayFormat);
        this.currentLast = new Date(ipDateStr)
        //this.currentFirstNum = this.currentFirst.getTime();
        this.currentLastNum = this.currentLast.getTime();
        this.service.currentMinDate = this.currentFirst;
        this.service.currentMaxDate = this.currentLast;
        this.service.dateCurrencyAndPayOffFilter();
        this.service.dateFilterEvent.emit()
        

      } catch (error) {
        console.log(error);
        this.lastDateTimeDisplayString = this.datepipe.transform(new Date(), this.displayFormat);
      }
    }
  }

  // minValue: number = new Date('12-12-2020').getTime();
  // maxValue: number = new Date().getTime();


}
