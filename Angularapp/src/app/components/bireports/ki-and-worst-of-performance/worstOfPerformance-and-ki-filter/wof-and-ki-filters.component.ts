import { Component } from '@angular/core';
import { KiAndWorstOfPerformanceService } from '../wof-and-ki-filter.service';
import { LabelType, Options } from '@angular-slider/ngx-slider';


@Component({
  selector: 'app-wof-and-ki-filters',
  templateUrl: './wof-and-ki-filters.component.html',
  styleUrls: ['./wof-and-ki-filters.component.css']
})
export class WofAndKiFiltersComponent {
  selectedWorstOfUnderlyings: string[]=[];
  displayDropdown: boolean=false;
  displayString: string='All';

  constructor(private service: KiAndWorstOfPerformanceService) {

  }

display=1

  ngOnInit(): void {
    
    this.startKIValue = this.service.min_KI;
    this.endKIValue = this.service.max_KI;
    this.options.floor=this.startKIValue
    this.options.ceil=this.endKIValue

    this.current_KI_StartValue=this.service.current_min_KI
    this.current_KI_LastValue=this.service.current_max_KI

    this.selectedUnderlying=this.service.selectedUnderlying
  
    
    this.service.dataReceived.subscribe(() => {
      this.display=2
      this.startKIValue = this.service.min_KI;
      this.endKIValue = this.service.max_KI;
      this.options.floor=this.startKIValue
      this.options.ceil=this.endKIValue
  
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
      this.startKIValue = this.service.min_KI;
      this.endKIValue = this.service.max_KI;
      
      this.current_KI_StartValue = this.service.current_min_KI
      this.current_KI_LastValue = this.service.current_max_KI
     
      this.selectedUnderlying = this.service.selectedUnderlying

    })
    
  
  }

  products!: number
  startKIValue: number=this.service.min_KI;
  endKIValue: number=this.service.max_KI;
  current_KI_StartValue: number=this.startKIValue
  current_KI_LastValue: number=this.endKIValue
 
 // worstOfPerformance
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
      event.target.value=this.startKIValue
      else{
        event.target.value=this.endKIValue
      }
    }
    if(parseFloat(event.target.value) < this.startKIValue){
      event.target.value=this.startKIValue
    }else if(parseFloat(event.target.value) > this.endKIValue){
      event.target.value=this.endKIValue
    }

    if(event.target.name==="input1"){
      this.current_KI_StartValue=parseFloat(event.target.value)
    }else{
      this.current_KI_LastValue=parseFloat(event.target.value)
    }
    this.service.current_min_KI = this.current_KI_StartValue
    this.service.current_max_KI = this.current_KI_LastValue
    this.service.dataFiltered.emit();
  
}
  
  sliderToInputBinder() {
    this.service.current_min_KI = this.current_KI_StartValue
    this.service.current_max_KI = this.current_KI_LastValue
    this.service.dataFiltered.emit();
  
}

  setProperties() {
    this.current_KI_LastValue = this.endKIValue;
    this.current_KI_StartValue = this.startKIValue;
  }

  sendSelectedUnderlying(value: string) {
    this.selectedUnderlying = value
    this.service.selectedUnderlying = this.selectedUnderlying

    this.service.filterSelectedEvent.emit()
  }

  manipulateDropDown() {
    if (this.displayDropdown === false) {
      this.displayDropdown = true
    }
    else {
      this.displayDropdown = false
    }
  }

  optionManipulation(underlying: string) {
    this.service.selectedUnderlying="All"
    let displayString = ''
    let i = this.selectedWorstOfUnderlyings.indexOf(underlying)
    if (i === -1) {
      this.selectedWorstOfUnderlyings = [...this.selectedWorstOfUnderlyings, underlying]
    }
    else {
      this.selectedWorstOfUnderlyings = this.selectedWorstOfUnderlyings.filter((value) => {
        return value !== underlying
      })
    }

    if (this.selectedWorstOfUnderlyings.length === 0) {
      this.displayString = "All"
    }
    else {
      this.selectedWorstOfUnderlyings.forEach((value) => {
        displayString = displayString + value + ","
      })

      
    }

    this.displayString = displayString.substring(0, displayString.length - 1);
    this.service.selectedWorstOfUnderlyings=this.selectedWorstOfUnderlyings
    // this.service.dateCurrencyAndPayOffFilter()
    this.service.filterSelectedEvent.emit()
  }

  optionSelected(underlying: string) {
    if (this.selectedWorstOfUnderlyings.indexOf(underlying) !== -1)
      return true;
    else
      return false
  }

}
