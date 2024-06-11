import { Component } from '@angular/core';
import { KoAndWorstOfPerformanceService } from '../wof-and-ko-filter.service';

import { KoAndWorstOfPerformanceComponent } from '../wof-and-ko.component';
import { LabelType, Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-wof-and-ko-filters',
  templateUrl: './wof-and-ko-filters.component.html',
  styleUrls: ['./wof-and-ko-filters.component.css']
})
export class WofAndKoFiltersComponent {
  constructor(private service: KoAndWorstOfPerformanceService,) {

  }
  
  display=1

  ngOnInit(): void {
    
    this.startKOValue = this.service.min_KO;
    this.endKOValue = this.service.max_KO;
    this.options.floor=this.startKOValue
    this.options.ceil=this.endKOValue
    this.current_KO_StartValue=this.service.current_min_KO
    this.current_KO_LastValue=this.service.current_max_KO

    this.selectedUnderlying=this.service.selectedUnderlying
  
    
    this.service.dataReceived.subscribe(() => {
      this.display=2
      this.startKOValue = this.service.min_KO;
      this.endKOValue = this.service.max_KO;
      this.options.floor=this.startKOValue
      this.options.ceil=this.endKOValue
      this.setProperties()
      
    })


    // this.selectedUnderlying = "All"
    // this.selectedCurrency = "All"
    // this.selectedPayOff = "All"
    this.service.SenddataToDropDown.subscribe(() => {
      this.worOfUnderlingList = this.service.worstOfUnderLyingList
      
    })

    this.service.filterSelectedEvent.subscribe(() => {

      this.worOfUnderlingList = this.service.worstOfUnderLyingList

    })
    
    this.service.sendStateDataEvent.subscribe(() => {
      this.startKOValue = this.service.min_KO;
      this.endKOValue = this.service.max_KO;

      this.current_KO_StartValue=this.service.current_min_KO
      this.current_KO_LastValue=this.service.current_max_KO
    
      this.selectedUnderlying=this.service.selectedUnderlying
      
      })
     
  }

  products!: number

  startKOValue: number=this.service.min_KO;
  endKOValue: number=this.service.max_KO;
  current_KO_StartValue: number=this.startKOValue
  current_KO_LastValue: number=this.endKOValue

  options: Options = {
    // floor: this.startDate.getTime(),
    // ceil:this.endDate.getTime(),
     step: 0.01,
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



  worOfUnderlingList!: string[]
  selectedUnderlying!: string

  currencies!: string[]
  selectedCurrency!: string

  payOff!: string[]
  selectedPayOff!: string

  customer!:string[]
  selectedCustomer!:string


  binder(event) {
    if(event.target.value.length===0){
      if(event.target.name==="input1")
      event.target.value=this.startKOValue
      else{
        event.target.value=this.endKOValue
      }
    }
    if(parseFloat(event.target.value) < this.startKOValue){
      event.target.value=this.startKOValue
    }else if(parseFloat(event.target.value) > this.endKOValue){
      event.target.value=this.endKOValue

    }

    if(event.target.name==="input1"){
      this.current_KO_StartValue=parseFloat(event.target.value)
    }else{
      this.current_KO_LastValue=parseFloat(event.target.value)
    }
    this.service.current_min_KO = this.current_KO_StartValue
    this.service.current_max_KO = this.current_KO_LastValue
    this.service.dataFiltered.emit();
  
}
  
  sliderToInputBinder() {
    this.service.current_min_KO = this.current_KO_StartValue
    this.service.current_max_KO = this.current_KO_LastValue
    this.service.dataFiltered.emit();
  
}


  setProperties() {
    this.current_KO_LastValue = this.endKOValue;
    this.current_KO_StartValue = this.startKOValue;
  }

  sendSelectedUnderlying(value: string) {
    this.selectedUnderlying = value
    this.service.selectedUnderlying = this.selectedUnderlying

    this.service.filterSelectedEvent.emit()
  }

}
