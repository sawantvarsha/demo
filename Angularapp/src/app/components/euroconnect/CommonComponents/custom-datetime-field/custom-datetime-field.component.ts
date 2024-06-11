import { AfterContentInit, AfterViewInit, Component, ElementRef, forwardRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-custom-datetime-field',
  templateUrl: './custom-datetime-field.component.html',
  styleUrls: ['./custom-datetime-field.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomDatetimeFieldComponent),
    multi: true
  }]
})


export class CustomDatetimeFieldComponent implements OnInit, ControlValueAccessor {


  dateTime: string;
  dateTimeDisplayString: string;
  hiddenDate: Date;
  asseturl = environment.asseturl;
  //Added by Amogh K | 4/4/2022 | added display format and width
  @Input() displayFormat: any;
  @Input() width: any = 10;
  @Input() isdisabled: boolean = false;
  @Input() maxDate: string = '';
  @Input() format: string = "datetime";
  onChange: (value: any) => any = (value: any) => { console.log(value)};
  onTouched: () => any = () => { };



  constructor(public datepipe: DatePipe) {


  }

  writeValue(obj: any): void {
    if (!this.displayFormat && this.format === 'date')
      this.displayFormat = 'dd-MMM-yyyy';
    if (!this.displayFormat && this.format === 'datetime')
      this.displayFormat = 'dd-MMM-yyyy h:mm a'

    if (obj) {
      if (typeof (obj) != typeof (''))
        this.dateTime = this.datepipe.transform(obj, 'yyyy-MM-ddTHH:mm')
      else
        this.dateTime = obj;
      if (this.format.toLocaleLowerCase() === "date")
        this.dateTimeDisplayString = this.datepipe.transform(this.dateTime, this.displayFormat);
      else
        // this.dateTimeDisplayString = this.datepipe.transform(this.dateTime, 'dd-MMM-yyyy H:mm a');
        this.dateTimeDisplayString = this.datepipe.transform(this.dateTime, this.displayFormat);
    }
    else {
      this.dateTime = '';
      this.dateTimeDisplayString = '';
    }

  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit() {
    //Added by Amogh K | 4/4/2022 | initializing display format
    if (!this.displayFormat && this.format === 'date') {
      this.displayFormat = 'dd-MMM-yyyy';
      //console.log("display ", this.displayFormat);

    }

    if (!this.displayFormat && this.format === 'datetime') {
      this.displayFormat = 'dd-MMM-yyyy h:mm a'
      //console.log("display ", this.displayFormat);

    }
  }
  dateChanged(event) {
    this.dateTime = event;
    if (this.format.toLocaleLowerCase() === "date")
      this.dateTimeDisplayString = this.datepipe.transform(event, this.displayFormat);
    else
      // this.dateTimeDisplayString = this.datepipe.transform(event, 'dd-MMM-yyyy H:mm a');
      this.dateTimeDisplayString = this.datepipe.transform(event, this.displayFormat);
    this.onChange(this.dateTime);
  }

  //Added by KaustubhS for editable datetime field :: START
  userInputDate(event){
    try {
      const ipDateArr = event.target.value.match(/\w+/g); //split the input values
      //expected values :: ipDateArr[0] => Day, ipDateArr[1] => Month, ipDateArr[2] => Year

      let ipDateStr: string = `${ipDateArr[1]}-${ipDateArr[0]}-${ipDateArr[2]}`;

      if(this.format.toLocaleLowerCase() === 'datetime'){
        const time: string = `${(ipDateArr[3] || 0)}:${(ipDateArr[4] || 0)} ${(ipDateArr[5] || '')}`.trim();
        ipDateStr = ipDateStr.concat(` ${time}`); 
      }

      this.dateTimeDisplayString = this.datepipe.transform(new Date(ipDateStr), this.displayFormat);

    } catch (error) {
      console.log(error);
      this.dateTimeDisplayString = this.datepipe.transform(new Date(), this.displayFormat);
    }
  }
  //Added by KaustubhS for editable datetime field :: END

}
