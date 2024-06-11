import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { isNumber } from 'util';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  @Input() calendarData: any;
  @Input() minYear: string;
  @Input() maxYear: string;
  @Input() dateFormat = 'dd-mmm-yyyy';

  @Output() setDate = new EventEmitter<string>();

  // days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  years = [];

  date: number;
  month: string;
  year: number;

  _today = new Date();
  _selectedMonth: string;
  _selectedYear: number;
  _selectedDate: string;

  _currentMonth: string;
  _currentYear: number;
  _currentDate: string;

  _dates = [];

  showMonthDropdown = false;
  showYearDropdown = false;

  constructor() { }

  ngOnInit() {
    if (!parseInt(this.minYear, 10)) {
      this.minYear = '2000';
    }
    if (!parseInt(this.maxYear, 10)) {
      this.maxYear = this._today.getFullYear() + '';
    }
    for (let i = parseInt(this.minYear, 10); i <= parseInt(this.maxYear, 10); i++) {
      this.years.push(i);
    }
    let date = new Date();

    this.calendarData = {
      date: this.calendarData.split('-')[0],
      month: this.calendarData.split('-')[1],
      year: this.calendarData.split('-')[2],
    };

    if (this.calendarData.date && this.calendarData.month && this.calendarData.year) {
      if (this.validateDate(this.calendarData.date + '', this.calendarData.month + '', this.calendarData.year + '')) {
        this.date = this.calendarData.date;
        this.month = this.calendarData.month;
        this.year = this.calendarData.year;

        date = new Date(this.year, this.months.indexOf(this.month), this.date);
        this._selectedMonth = this.months[date.getMonth()];
        this._selectedYear = date.getFullYear();
        this._selectedDate = date.getDate() + '';
      } else {
        this._selectedMonth = this.months[this._today.getMonth()];
        this._selectedYear = this._today.getFullYear();
        this._selectedDate = this._today.getDate() + '';
      }
    } else {
      this._selectedMonth = this.months[this._today.getMonth()];
      this._selectedYear = this._today.getFullYear();
      this._selectedDate = this._today.getDate() + '';
    }

    this._currentMonth = this._selectedMonth;
    this._currentYear = this._selectedYear;
    this._currentDate = this._selectedDate;

    if (!this.validateRequestedDateFormat()) {
      this.dateFormat = 'dd-mmm-yyyy';
    }

    this.generateCalendar(this._selectedMonth, this._selectedYear);
  }

  daysInMonth(month, year) {
    return 32 - new Date(year, this.months.indexOf(month), 32).getDate();
  }

  next() {
    this._selectedYear = (this.months.indexOf(this._selectedMonth) === 11) ? this._selectedYear + 1 : this._selectedYear;
    this._selectedMonth = this.months[(this.months.indexOf(this._selectedMonth) + 1) % 12];
    this.generateCalendar(this._selectedMonth, this._selectedYear);
  }

  previous() {
    this._selectedMonth = this.months[(this.months.indexOf(this._selectedMonth) === 0) ? 11 : this.months.indexOf(this._selectedMonth) - 1];
    this._selectedYear = (this.months.indexOf(this._selectedMonth) === 11) ? this._selectedYear - 1 : this._selectedYear;
    this.generateCalendar(this._selectedMonth, this._selectedYear);
  }

  generateCalendar(month: string, year: number) {
    const firstDay = (new Date(year, this.months.indexOf(month), 1)).getDay();

    this._dates.length = 0;
    for (let i = 0; i < firstDay; i++) {
      this._dates.push('');
    }
    const daysInMonth = this.daysInMonth(month, year)
    for (let i = 0, day = 1; i < daysInMonth; i++ , day++) {
      this._dates.push(day + '');
    }
    while (this._dates.length % 7) {
      this._dates.push('');
    }
  }

  setToday() {
    this._selectedMonth = this.months[this._today.getMonth()];
    this._selectedYear = this._today.getFullYear();
    this._selectedDate = this._today.getDate() + '';
    this.selectedDate(this._selectedDate);
  }

  formatDate(): string {
    if (this._selectedMonth && this._selectedYear && this._selectedDate) {
      let d = '';
      let m = '';
      let y = '';
      let formattedDate = this.dateFormat;

      if ((this.dateFormat.match(/[yY]/g) || []).length === 2) {
        y = (this._selectedYear + '').slice(2, 4);
      } else {
        y = this._selectedYear + '';
      }
      formattedDate = formattedDate.replace(/[yY]+/, y);

      if ((this.dateFormat.match(/d/g) || []).length === 1) {
        d = this._selectedDate;
      } else {
        d = parseInt(this._selectedDate, 10) > 9 ? this._selectedDate : '0' + this._selectedDate;
      }
      formattedDate = formattedDate.replace(/[dD]+/g, d);

      if ((this.dateFormat.match(/[mM]/g) || []).length === 2) {
        m = (this.months.indexOf(this._selectedMonth + 1) > 9 ? (this.months.indexOf(this._selectedMonth) + 1) : '0' + (this.months.indexOf(this._selectedMonth) + 1)) + '';
      } else {
        m = this._selectedMonth;
      }
      formattedDate = formattedDate.replace(/[mM]+/g, m);

      return formattedDate;
    }
  }

  validateRequestedDateFormat(): boolean {
    const pattern = new RegExp('((d{1,2}|D{1,2})[\/](m{2,3}|M{2,3})[\/](y{2}|y{4}|Y{2}|Y{4})|(d{1,2}|D{1,2})[\|](m{2,3}|M{2,3})[\|](y{2}|y{4}|Y{2}|Y{4})|(d{1,2}|D{1,2})[\-](m{2,3}|M{2,3})[\-](y{2}|y{4}|Y{2}|Y{4}))');
    if (pattern.test(this.dateFormat)) {
      return true;
    }
    return false;
  }

  validateDate(date: string, month: string, year: string): boolean {
    if (isNaN(Date.parse(date + '-' + month + '-' + year))) {
      return false;
    } else {
      return true;
    }
  }

  selectedDate(date) {
    this._selectedDate = date;
    this.setDate.emit(this.formatDate());
    this.showMonthDropdown = false;
    this.showYearDropdown = false;
  }

}
