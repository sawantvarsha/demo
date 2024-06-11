import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { environment } from 'src/environments/environment';

declare var require: any;

@Component({
  selector: 'app-calender-control',
  templateUrl: './calender-control.component.html',
  styleUrls: ['./calender-control.component.css'],
})
export class CalenderControlComponent implements OnInit {
  // calendarIconSrc = require('../../../../../assets/');

  @Input() label: string;
  assetURL: any;
  @Input()
  set defaultDate(value: string) {
    this.DefaultDate = value || '';
    this.createDateTime();
  }

  @Input() disabled: boolean;

  @Input()
  set ShowTime(value: boolean) {
    this.showTime = value || false;
    this.createDateTime();
  }

  @Output() selectedDate = new EventEmitter();

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
    'Dec',
  ];
  showTime = false;
  DefaultDate = '';
  time = '';

  finalDate: string;

  constructor() {}

  ngOnInit() {
    this.createDateTime();
    this.assetURL = environment.assetURL;
  }

  createDateTime() {
    this.finalDate = '';
    let date: any;
    if (!this.DefaultDate) {
      date = new Date();
      date =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        '-' +
        this.months[date.getMonth()] +
        '-' +
        date.getFullYear();
    } else {
      date = this.DefaultDate;
    }
    let formattedDate = '';
    //console.log(this.showTime);
    if (this.showTime) {
      let hours = '';
      let minutes = '';
      let meridian = '';
      if (date.includes(':')) {
        const currTime = date.split(' ')[1];
        hours = currTime.split(':')[0] || '';
        minutes = currTime.split(':')[1] || '';
        meridian = date.split(' ')[2] || '';

        if (hours && minutes && meridian) {
          this.finalDate = hours + ':' + minutes + ' ' + meridian;
        }
      } else {
        if (hours && minutes && meridian) {
          this.finalDate = hours + ':' + minutes + ' ' + meridian;
        } else {
          const today = new Date();
          hours = (today.getHours() > 12
            ? today.getHours() - 12 < 10
              ? '0' + (today.getHours() - 12)
              : today.getHours() - 12
            : today.getHours() < 10
            ? '0' + today.getHours()
            : today.getHours()
          ).toString();
          minutes = (today.getMinutes() < 10
            ? '0' + today.getMinutes()
            : today.getMinutes()
          ).toString();
          meridian = today.getHours() >= 12 ? 'PM' : 'AM';
          this.finalDate = hours + ':' + minutes + ' ' + meridian;
        }
      }
      this.time = this.finalDate;
      formattedDate = date.split(' ')[0];
    } else {
      formattedDate = date;
    }
    //console.log(formattedDate);

    // const currDate = date.split(' ')[0];
    // let day = currDate.split('-')[0];
    // let month = (this.months.indexOf(currDate.split('-')[1]) + 1).toString();
    // let year = currDate.split('-')[2];

    // if (day.length === 1) {
    //   day = '0' + day;
    // }
    // if (month.length === 1) {
    //   month = '0' + month;
    // }
    // if (year.indexOf('-') >= 0) {
    //   year = year.substr(1);
    // }

    // const formattedDate = day + '/' + month + '/' + year;

    this.finalDate = this.finalDate
      ? formattedDate + ' ' + this.finalDate
      : formattedDate;
  }

  getDate(event: MatDatepickerInputEvent<Date>) {
    const selecteddate = event.value;
    const date =
      (selecteddate.getDate() < 10
        ? '0' + selecteddate.getDate()
        : selecteddate.getDate()) +
      '-' +
      this.months[selecteddate.getMonth()] +
      '-' +
      selecteddate.getFullYear();

    if (!this.time) {
      const today = new Date();
      const hours = (today.getHours() > 12
        ? today.getHours() - 12 < 10
          ? '0' + (today.getHours() - 12)
          : today.getHours() - 12
        : today.getHours() < 10
        ? '0' + today.getHours()
        : today.getHours()
      ).toString();
      const minutes = (today.getMinutes() < 10
        ? '0' + today.getMinutes()
        : today.getMinutes()
      ).toString();
      const meridian = today.getHours() >= 12 ? 'PM' : 'AM';
      this.time = hours + ':' + minutes + ' ' + meridian;
    }

    // let day = selecteddate.getDate().toString();
    // let month = (selecteddate.getMonth() + 1).toString();
    // let year = selecteddate.getFullYear().toString();

    // if (day.length === 1) {
    //   day = '0' + day;
    // }
    // if (month.length === 1) {
    //   month = '0' + month;
    // }
    // if (year.indexOf('-') >= 0) {
    //   year = year.substr(1);
    // }
    if (this.showTime) {
      // this.selectedDate.next((day + '-' + this.months[parseInt(month, 10) - 1] + '-' + year) + ' ' + this.time);
      // this.finalDate = (selecteddate.getDate() < 10 ? ('0' + selecteddate.getDate()) : selecteddate.getDate()) + '-' + ((selecteddate.getMonth() + 1) < 10 ? ('0' + (selecteddate.getMonth() + 1)) : (selecteddate.getMonth() + 1)) + '-' + selecteddate.getFullYear() + ' ' + this.time;
      // this.finalDate = (day + '-' + this.months[parseInt(month, 10) - 1] + '-' + year) + ' ' + this.time;
      this.selectedDate.next(date + ' ' + this.time);
      this.finalDate = date + ' ' + this.time;
    } else {
      // this.selectedDate.next(day + '-' + this.months[parseInt(month, 10) - 1] + '-' + year);
      // this.finalDate = (selecteddate.getDate() < 10 ? ('0' + selecteddate.getDate()) : selecteddate.getDate()) + '-' + this.months[(selecteddate.getMonth() + 1)] + '-' + selecteddate.getFullYear();
      // this.finalDate = day + '-' + this.months[parseInt(month, 10) - 1] + '-' + year;
      this.selectedDate.next(date);
      this.finalDate = date;
    }
  }
}
