import { Component, OnInit } from '@angular/core';
import { GreekLcmFilterService } from '../greek-lcm-filter.service';
import { LabelType, Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-greek-lcm-filter',
  templateUrl: './greek-lcm-filter.component.html',
  styleUrls: ['./greek-lcm-filter.component.scss']
})
export class GreekLcmFilterComponent implements OnInit {

  constructor(private service: GreekLcmFilterService,) { 
   
  }
  display=1

  products!: number

  startNotionalValue: number=this.service.min_Delta;
  endNotionalValue: number=this.service.max_Delta;
  current_Notional_StartValue: number=this.startNotionalValue
  current_Notional_LastValue: number=this.endNotionalValue 
  
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

  IM_Fixing_SourceList!: string[]
  selectedUnderlying!: string

  currencies!: string[]
  selectedCurrency!: string

  payOff!: string[]
  selectedPayOff!: string

  customer!:string[]
  selectedCustomer!:string

  ngOnInit(): void {
    this.startNotionalValue = this.service.min_Delta;
    this.endNotionalValue = this.service.max_Delta;
    this.options.floor=this.startNotionalValue
    this.options.ceil=this.endNotionalValue
    this.current_Notional_StartValue=this.service.current_min_Delta
    this.current_Notional_LastValue=this.service.current_max_Delta
  
    this.service.dataReceived.subscribe(() => {
      this.display=2
      this.startNotionalValue = this.service.min_Delta;
      this.endNotionalValue = this.service.max_Delta;
      this.options.floor=this.startNotionalValue
      this.options.ceil=this.endNotionalValue
      this.setProperties()
      
    })
    this.service.SenddataToDropDown.subscribe(() => {
      //this.IM_Fixing_SourceList = this.service.IM_Fixing_SourceList
      
    })

    this.service.filterSelectedEvent.subscribe(() => {

      //this.IM_Fixing_SourceList = this.service.IM_Fixing_SourceList

    })

    this.service.sendStateDataEvent.subscribe(() => {
      this.startNotionalValue = this.service.min_Delta;
      this.endNotionalValue = this.service.max_Delta;

      this.current_Notional_StartValue=this.service.current_min_Delta
      this.current_Notional_LastValue=this.service.current_max_Delta
    
      this.selectedUnderlying=this.service.selectedUnderlying
      
      })
  
  }

  binder(event) {
    if(event.target.value.length===0){
      if(event.target.name==="input1")
      event.target.value=this.startNotionalValue
      else{
        event.target.value=this.endNotionalValue
      }
    }
    if(parseFloat(event.target.value) < this.startNotionalValue){
      event.target.value=this.startNotionalValue
    }else if(parseFloat(event.target.value) > this.endNotionalValue){
      event.target.value=this.endNotionalValue

    }

    if(event.target.name==="input1"){
      this.current_Notional_StartValue=parseFloat(event.target.value)
    }else{
      this.current_Notional_LastValue=parseFloat(event.target.value)
    }
    this.service.current_min_Delta = this.current_Notional_StartValue
    this.service.current_max_Delta = this.current_Notional_LastValue
    this.service.dataFiltered.emit();
  
}
  
  sliderToInputBinder() {
    this.service.current_min_Delta = this.current_Notional_StartValue
    this.service.current_max_Delta = this.current_Notional_LastValue
    this.service.dataFiltered.emit();
  
}

  setProperties() {
    this.current_Notional_LastValue = this.endNotionalValue;
    this.current_Notional_LastValue = this.startNotionalValue;
  }
  sendSelectedUnderlying(value: string) {
    this.selectedUnderlying = value
    this.service.selectedUnderlying = this.selectedUnderlying

    this.service.filterSelectedEvent.emit()
  }

}
