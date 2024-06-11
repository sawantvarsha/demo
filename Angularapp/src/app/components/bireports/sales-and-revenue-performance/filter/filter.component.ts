import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit{

  selected:string="All"
  labels!:string[]
  tradeRevenue!:string | number;
  tradeVolume!:string | number
  constructor(private service:FilterService){

  }
  ngOnInit(): void {

    this.labels=this.service.tempCurrencyList;
    this.selected=this.service.selectedLabel
    this.setTotal();

    this.service.filterListEvent.subscribe(()=>{
      this.labels=this.service.tempCurrencyList
      this.selected=this.service.selectedLabel
    })

    this.service.sendStateDataEvent.subscribe(()=>{
      this.labels=this.service.tempCurrencyList
      this.selected=this.service.selectedLabel
    })

    this.service.setTotalEvent.subscribe(()=>{
      this.setTotal()
    })
  }

  sendSelected(selected:string){
    // this.service.currentSelectedCurrency="All"
    // this.service.currentSelectedPayOff="All"
    this.service.selectedLabel = selected
    this.service.dateCurrencyAndPayOffFilter();
    this.service.filterSelectedEvent.emit()
  }

  setTotal(){
    this.tradeRevenue = this.service.totalRevenue
    let displayRevenue: string = ''
    if (this.tradeRevenue > 1000000) {
      displayRevenue = (this.tradeRevenue / 1000000).toString()
      this.tradeRevenue = displayRevenue.substring(0, displayRevenue.indexOf(".") + 3) + "M"
    }
    else {
      if (this.tradeRevenue !== 0) {
        displayRevenue = (this.tradeRevenue / 1000).toString()
        this.tradeRevenue = displayRevenue.substring(0, displayRevenue.indexOf(".") + 3) + "K"
      }
    }

    
    this.tradeVolume = this.service.totalVolume
    let displayVolume: string = ''
    if (this.tradeVolume > 1000000) {
      displayVolume = (this.tradeVolume / 1000000).toString()
      this.tradeVolume = displayVolume.substring(0, displayVolume.indexOf(".") + 3) + "M"
    }
    else {
      if (this.tradeVolume !== 0) {
        displayVolume = (this.tradeVolume / 1000).toString()
        this.tradeVolume = displayVolume.substring(0, displayVolume.indexOf(".") + 3) + "K"
      }
    }
  }

}
