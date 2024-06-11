import { Component } from '@angular/core';
import { MtmAndKoFilterService } from '../mtm-and-ko-filter.service';
import { LabelType, Options } from '@angular-slider/ngx-slider';


@Component({
  selector: 'app-mtm-and-ko-filters',
  templateUrl: './mtm-and-ko-filters.component.html',
  styleUrls: ['./mtm-and-ko-filters.component.css']
})
export class MtmAndKoFiltersComponent {
  constructor(private service: MtmAndKoFilterService,) {

  }

  display=1

  ngOnInit(): void {
    this.startKOValue = this.service.min_KO;
    this.endKOValue = this.service.max_KO;
    this.options1.floor = this.startKOValue;
    this.options1.ceil = this.endKOValue;
    this.startMTMValue = this.service.min_MTM;
    this.endMTMValue = this.service.max_MTM;
    this.options2.floor = this.startMTMValue;
    this.options2.ceil = this.endMTMValue;
    this.current_KO_StartValue = this.service.current_min_KO
    this.current_KO_LastValue = this.service.current_max_KO
    this.current_MTM_StartValue = this.service.current_min_MTM
    this.current_MTM_LastValue = this.service.current_max_MTM
    this.selectedUnderlying = this.service.selectedUnderlying
    this.selectedCurrency = this.service.selectedCurrency
    this.selectedPayOff = this.service.selectedPayOff

    this.service.dataReceived.subscribe(() => {
      this.display=2
      this.startKOValue = this.service.min_KO;
      this.endKOValue = this.service.max_KO;
      this.options1.floor = this.startKOValue;
      this.options1.ceil = this.endKOValue;
      this.startMTMValue = this.service.min_MTM;
      this.endMTMValue = this.service.max_MTM;
      this.options2.floor = this.startMTMValue;
      this.options2.ceil = this.endMTMValue;
      this.setProperties()
    })


    this.service.SenddataToDropDown.subscribe(() => {
      this.worOfUnderlingList = this.service.worstOfUnderLyingList
      this.payOff = this.service.payOffList;
      this.currencies = this.service.currencyList;
    })

    this.service.filterSelectedEvent.subscribe(() => {
      this.currencies = this.service.currencyList
      this.worOfUnderlingList = this.service.worstOfUnderLyingList
      this.payOff = this.service.payOffList;
    })

    this.service.sendStateDataEvent.subscribe(() => {
      this.startKOValue = this.service.min_KO;
      this.endKOValue = this.service.max_KO;
      this.startMTMValue = this.service.min_MTM;
      this.endMTMValue = this.service.max_MTM;
      this.current_KO_StartValue = this.service.current_min_KO
      this.current_KO_LastValue = this.service.current_max_KO
      this.current_MTM_StartValue = this.service.current_min_MTM
      this.current_MTM_LastValue = this.service.current_max_MTM
      this.selectedUnderlying = this.service.selectedUnderlying
      this.selectedCurrency = this.service.selectedCurrency
      this.selectedPayOff = this.service.selectedPayOff

    })


  }

  products!: number

  startKOValue!: number
  endKOValue!: number
  current_KO_StartValue!: number
  current_KO_LastValue!: number

  startMTMValue!: number
  endMTMValue!: number
  current_MTM_StartValue!: number
  current_MTM_LastValue!: number

  worOfUnderlingList!: string[]
  selectedUnderlying!: string

  currencies!: string[]
  selectedCurrency!: string

  payOff!: string[]
  selectedPayOff!: string
  customer!: string[]
  selectedCustomer!: string

  // display: boolean = false

  options1: Options = {
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

  options2: Options = {
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

  KOinputchange(event,num){
    if(event.target.value.length===0){
      if(num===1)
      event.target.value=this.startKOValue
      else if(num===2)
      event.target.value=this.endKOValue
    }

    if(parseFloat(event.target.value) < this.startKOValue){
      event.target.value=this.startKOValue
    }else if(parseFloat(event.target.value) > this.endKOValue){
      event.target.value=this.endKOValue
    }

    if(event.target.name==="ko-input1"){
      this.current_KO_StartValue=parseFloat(event.target.value)
    }else{
      this.current_KO_LastValue=parseFloat(event.target.value)
    }
    this.service.current_min_KO = this.current_KO_StartValue
    this.service.current_max_KO = this.current_KO_LastValue
  }

  mtminputchange(event,num){
    if(event.target.value.length===0){
      if(num===1)
      event.target.value=this.startMTMValue
      else if(num===2)
      event.target.value=this.endMTMValue
    }
    if(parseFloat(event.target.value) < this.startMTMValue){
      event.target.value=this.startMTMValue
    }else if(parseFloat(event.target.value) > this.endMTMValue){
      event.target.value=this.endMTMValue
    }

    if(event.target.name==="mtm-input1"){
      this.current_MTM_StartValue=parseFloat(event.target.value)
    }else{
      this.current_MTM_LastValue=parseFloat(event.target.value)
    }
    this.service.current_min_MTM = this.current_MTM_StartValue
    this.service.current_max_MTM = this.current_MTM_LastValue
  }

  binder(event) {
    
    switch(event.target.name){
      case "ko-input1": this.KOinputchange(event,1);
                        break;
      case "ko-input2": this.KOinputchange(event,2);
                        break;
      case "mtm-input1": this.mtminputchange(event,1);
                        break;
      case "mtm-input2":this.mtminputchange(event,2);
                        break;
    }

    this.service.dataFiltered.emit();
  
}
  
  sliderToInputBinder() {
    this.service.current_min_KO = this.current_KO_StartValue
    this.service.current_max_KO = this.current_KO_LastValue
    this.service.current_min_MTM = this.current_MTM_StartValue
    this.service.current_max_MTM = this.current_MTM_LastValue
    this.service.dataFiltered.emit();
  
}



  setProperties() {
    this.current_KO_LastValue = this.endKOValue;
    this.current_KO_StartValue = this.startKOValue;
    this.current_MTM_StartValue = this.startMTMValue;
    this.current_MTM_LastValue = this.endMTMValue
    // this.setForSlider()
  }

  setForSlider(){
    this.current_KO_LastValue = this.endKOValue;
    this.current_KO_StartValue = this.startKOValue;
    this.current_MTM_StartValue = this.startMTMValue;
    this.current_MTM_LastValue = this.endMTMValue
  }

  sendSelectedUnderlying(value: string) {
    this.selectedUnderlying = value
    this.service.selectedUnderlying = this.selectedUnderlying

    this.service.filterSelectedEvent.emit()
  }

  sendSelectedCurrency(value: string) {
    this.selectedCurrency = value
    this.service.selectedCurrency = this.selectedCurrency

    this.service.filterSelectedEvent.emit()
  }

  sendSelectedPayOff(value: string) {
    this.selectedPayOff = value
    this.service.selectedPayOff = this.selectedPayOff

    this.service.filterSelectedEvent.emit()
  }
}
