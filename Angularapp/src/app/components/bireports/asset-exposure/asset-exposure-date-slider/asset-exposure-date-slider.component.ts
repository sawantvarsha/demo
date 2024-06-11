import { Component, Input, OnInit } from '@angular/core';
import { AssetExposureService } from '../asset-exposure.service';
import { LabelType, Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-asset-exposure-date-slider',
  templateUrl: './asset-exposure-date-slider.component.html',
  styleUrls: ['./asset-exposure-date-slider.component.css'],
})
export class AssetExposureDateSliderComponent implements OnInit {
  exchangeList: string[] = [];
  sectorList: string[] = [];
  customerList: string[] = [];
  constructor(private service: AssetExposureService) { }


  ngOnInit(): void {

    this.dateType = this.service.dateTypeForSlider
    this.highValueMonth = this.service.highValueMonth
    this.valueMonth = this.service.valueMonth
    this.highValueQuarter = this.service.highValueQuarter
    this.valueQuarter = this.service.valueQuarter
    this.highValueYear = this.service.highValueYear
    this.valueYear = this.service.valueYear

    this.calculateLabels(this.date)
    this.calculateQuarter(this.date)
    this.calculateYear(this.date)

    this.service.sendStateDataEvent.subscribe(() => {
      this.dateType = this.service.dateTypeForSlider
      this.highValueMonth = this.service.highValueMonth
      this.valueMonth = this.service.valueMonth
      this.highValueQuarter = this.service.highValueQuarter
      this.valueQuarter = this.service.valueQuarter
      this.highValueYear = this.service.highValueYear
      this.valueYear = this.service.valueYear

      switch (this.dateType) {
        case 0: this.sliderChange({ value: this.valueMonth, highValue: this.highValueMonth }, "month")
          break;
        case 1: this.sliderChange({ value: this.valueQuarter, highValue: this.highValueQuarter }, "quarter")
          break;
        case 2: this.sliderChange({ value: this.valueYear, highValue: this.highValueYear }, "year")
          break;

      }

    })
  }

  currentMonth: number = 0;
  year: number = new Date().getFullYear() + 1;
  uniqueUnderlying: string[] = [];
  date = new Date()

  months: Array<any> = [
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

  quarterMonths: any = [{ 'Q1': ['Jan', 'Feb', 'Mar'] }, { 'Q2': ['Apr', 'May', 'Jun'] }, { 'Q3': ['Jul', 'Aug', 'Sep'] }, { 'Q4': ['Oct', 'Nov', 'Dec'] }];

  dateMonths: Array<any> = [];
  current: string = '';
  splicedDate: string = '';
  valueMonth = 0
  highValueMonth = 12

  valueQuarter = 0
  highValueQuarter = 4

  valueYear = 0
  highValueYear = 2

  startYear!: number
  monthArray: any[] = []
  quarterArray: any[] = []
  yearArray: any[] = []
  dateType: number = 0
  startDate: Date
  endDate: Date

  // @Input() ear_red_date!:Date
  // data = this.service.originalData;

  // monthMath = new Map();
  // public static underlyingMonth: string[] = [];
  // public static underlying: string[] = [];

  // sortedUnderlying: string[] = [];
  // sortedAverageExposure: number[] = [];
  // sortedProbability: number[] = [];
  // finalProbability: number[] = [];
  // finalAvgExposure: number[] = [];
  // finalDisplayExposure: number[] = [];
  // finalExposureDates: string[] = [];
  // finalColorProbability: number[] = [];
  // tooltipDateList: string[] = [];
  // value: number = this.service.sliderValue;
  // highValue: number = this.service.sliderHigh;
  // Qvalue: number = this.service.sliderQValue;
  // QhighValue: number = this.service.sliderQHigh;
  // yValue:number = this.service.sliderYValue;
  // yHighValue: number= this.service.sliderYhigh;
  // exposure: number[] = [];
  // originalData: PBI_Report_Data[] = [];
  // temp_pbi: PBI_Report_Data[] = [];
  // displayMonths :Array<any> = [];

  // //quaters
  // dateYears: Array<any> = [];
  // dateQuarters: Array<any> = [];
  // filterDatesBy: string = this.service.filterDatesBy;
  // quarter: string = '';

  options1: Options = {
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return ''
        case LabelType.High:
          return ' '
        default:
          return ''
      }
    },
    animate: true,
    floor: 0,
    ceil: 12,
    step: 1,
    showTicks: true,
  };

  options2: Options = {
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return ''
        case LabelType.High:
          return ' '
        default:
          return ''
      }
    },
    animate: true,
    floor: 0,
    ceil: 4,
    step: 1,
    showTicks: true,
  };

  options3: Options = {
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return ''
        case LabelType.High:
          return ' '
        default:
          return ''
      }
    },
    animate: true,
    floor: 0,
    ceil: 2,
    step: 1,
    showTicks: true,
  };

  calculateLabels(date: Date) {
    let month = date.getMonth()
    let monthArray: any[] = []
    let year = date.getFullYear()
    for (let i = month; i < this.months.length; i++) {
      let month = {
        month: this.months[i],
        year: year
      }
      monthArray.push(month)
    }
    for (let i = 0; i < month; i++) {
      let month = {
        month: this.months[i],
        year: year + 1
      }
      monthArray.push(month)
    }

    console.log(monthArray)
    this.monthArray = monthArray

    if (this.service.isDateFirst == true) {
      this.startDate = new Date("1 " + (monthArray[0])["month"] + ' ' + (monthArray[0])["year"])
      this.endDate = new Date("1 " + (monthArray[0])["month"] + ' ' + ((monthArray[0])["year"] + 1))
      this.service.selectedStartDate = this.startDate
      this.service.selectedEndDate = this.endDate
      this.service.isDateFirst = false
    }
  }

  calculateQuarter(date: Date) {
    let month = date.getMonth()
    let year = date.getFullYear()
    this.year = year
    let val = Math.floor((month) / 3)
    let quarterArray = []
    // [{ 'Q1': ['Jan','Feb','Mar'] },{'Q2':['Apr','May','Jun']},{'Q3':['Jul','Aug','Sep']},{'Q4':['Oct','Nov','Dec']}];
    let quarters: any[] = [{ quarter: "Q1", quarterMonths: ['Jan', 'Feb', 'Mar'], year: '' }, { quarter: "Q2", quarterMonths: ['Apr', 'May', 'Jun'] }, { quarter: "Q3", quarterMonths: ['Jul', 'Aug', 'Sep'] }, { quarter: "Q4", quarterMonths: ['Oct', 'Nov', 'Dec'] }]

    for (let i = val; i < quarters.length; i++) {
      quarters[i].year = year.toString()
      quarterArray.push(quarters[i])

    }
    for (let i = 0; i < val; i++) {
      quarters[i].year = (year + 1).toString()
      quarterArray.push(quarters[i])
    }

    this.quarterArray = quarterArray
    console.log(quarterArray)
    console.log(date.getFullYear())
  }

  changeSlider(slider: number) {
    this.dateType = slider
    this.service.dateTypeForSlider = slider
  }

  calculateYear(date: Date) {
    let month = date.getMonth()
    if (month == 0) {
      this.yearArray[0] = date.getFullYear()
      this.options3.ceil = 1
    }
    else {
      this.yearArray[0] = date.getFullYear()
      this.yearArray[1] = date.getFullYear() + 1
    }
  }

  sliderChange(value: any, value1: any) {
    console.log(value)
    console.log(value.highValue, value.value)

    var startMonth
    var endMonth
    var startYear
    var endYear
    switch (value1) {
      case "month":

        startMonth = (this.monthArray[value.value])["month"]
        endMonth = (this.monthArray[value.value !== value.highValue ? (value.highValue - 1) : (value.highValue)])["month"]
        startYear = (this.monthArray[value.value])["year"]
        endYear = (this.monthArray[value.value !== value.highValue ? (value.highValue - 1) : (value.highValue)])["year"]

        this.service.highValueMonth = value.highValue
        this.service.valueMonth = value.value
        break;
      case "quarter":
        startMonth = ((this.quarterArray[value.value])["quarterMonths"])[0]
        endMonth = ((this.quarterArray[value.highValue - 1])["quarterMonths"])[2]
        startYear = parseInt((this.quarterArray[value.value])["year"])
        endYear = parseInt((this.quarterArray[value.highValue - 1])["year"])

        this.service.highValueQuarter = value.highValue
        this.service.valueQuarter = value.value
        break;
      case "year":
        // startMonth = (this.monthArray[0])["month"]
        // endMonth = (this.monthArray[11])["month"]
        startYear = this.yearArray[value.value]
        endYear = this.yearArray[value.highValue - 1]

        this.service.highValueYear = value.highValue
        this.service.valueYear = value.value

        for (let i = 0; i < this.monthArray.length; i++) {
          if ((this.monthArray[i])["year"] == startYear) {
            startMonth = (this.monthArray[i])["month"]
            break;
          }
        }
        for (let i = 0; i < this.monthArray.length; i++) {
          if ((this.monthArray[i])["year"] == startYear) {
            endMonth = (this.monthArray[i])["month"]
          }
        }
        break;
    }


    if (this.months.indexOf(startMonth) >= this.months.indexOf(endMonth)) {
      this.startDate = new Date("1 " + startMonth + ' ' + startYear)
      this.endDate = new Date("1 " + (value.value === value.highValue ? (startMonth) : (this.months[this.months.indexOf(endMonth) + 1])) + " " + (endYear))
    }
    else {

      this.startDate = new Date("1 " + startMonth + ' ' + (startYear))
      if (endMonth === 'Dec') {
        this.endDate = new Date("1 " + this.months[(this.months.indexOf(endMonth)) % 11] + " " + (endYear + 1)) // to be verified from rajat
      }
      else {
        this.endDate = new Date("1 " + this.months[this.months.indexOf(endMonth) + 1] + " " + (endYear))
      } // to be verified from rajat
    }
    this.service.selectedStartDate = this.startDate
    this.service.selectedEndDate = this.endDate
    //this.service.filterData()
    this.service.dateSliderEvent.emit()

  }

}
