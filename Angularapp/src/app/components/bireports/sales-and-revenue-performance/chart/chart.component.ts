import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  selectedOptionCurrency: string = 'Ascending'
  selectedOption1Currency: string = 'Currency'

  selectedOptionPayoff: string = 'Ascending'
  selectedOption1Payoff: string = 'PayOff'
  showDiv:any='false'
  showDiv1:any='false'
  constructor(private service: FilterService) {

  }
  ngOnInit(): void {
    this.selectedOptionCurrency = this.service.selectedOptionCurrency
    this.selectedOption1Currency = this.service.selectedOption1Currency
    this.selectedOptionPayoff = this.service.selectedOptionPayoff
    this.selectedOption1Payoff = this.service.selectedOption1Payoff


    this.service.sendStateDataEvent.subscribe(() => {
      this.selectedOptionCurrency = this.service.selectedOptionCurrency
      this.selectedOption1Currency = this.service.selectedOption1Currency
      this.selectedOptionPayoff = this.service.selectedOptionPayoff
      this.selectedOption1Payoff = this.service.selectedOption1Payoff
    })
  }

  filterDataCurrency(value: string) {
    this.selectedOptionCurrency = value
    this.service.selectedOptionCurrency = value
    this.service.filterEvent1.emit()

  }

  filterData1Currency(value: string) {
    this.selectedOption1Currency = value
    this.service.selectedOption1Currency = value
    this.service.filterEvent1.emit()
  }

  filterDataPayoff(value: string) {
    this.selectedOptionPayoff = value
    this.service.selectedOptionPayoff = value
    this.service.filterEvent2.emit()

  }

  filterData1Payoff(value: string) {
    this.selectedOption1Payoff = value
    this.service.selectedOption1Payoff = value
    this.service.filterEvent2.emit()
  }

  display(){
    if(this.showDiv=='false'){
     this.showDiv='true'
    }else{
     this.showDiv='false'
    }
   }

   display1(){
    if(this.showDiv1=='false'){
     this.showDiv1='true'
    }else{
     this.showDiv1='false'
    }
   }



}
