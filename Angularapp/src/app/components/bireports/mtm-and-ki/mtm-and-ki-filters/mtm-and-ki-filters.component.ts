import { Component } from '@angular/core';
import { MtmAndKiFilterService } from '../mtm-and-ki-filter.service';
import { NgxCaptureService } from "ngx-capture";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, tap } from 'rxjs';
import { ViewChild } from '@angular/core';
import { MtmAndKiComponent } from '../mtm-and-ki.component';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-mtm-and-ki-filters',
  templateUrl: './mtm-and-ki-filters.component.html',
  styleUrls: ['./mtm-and-ki-filters.component.css']
})
export class MtmAndKiFiltersComponent {
  constructor(private service: MtmAndKiFilterService, private parent: MtmAndKiComponent,private datePipe: DatePipe) {

  }




  products!: number

  startKIValue: number = this.service.min_KI;
  endKIValue: number = this.service.max_KI;
  current_KI_StartValue: number = this.startKIValue
  current_KI_LastValue: number = this.endKIValue

  startMTMValue: number = this.service.min_MTM;
  endMTMValue: number = this.service.max_MTM;
  current_MTM_StartValue: number = this.startMTMValue
  current_MTM_LastValue: number = this.endMTMValue

  worOfUnderlingList!: string[]
  selectedUnderlying!: string

  currencies!: string[]
  selectedCurrency!: string

  payOff!: string[]
  selectedPayOff!: string

  customer!: string[]
  selectedCustomer!: string

  display = 1

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


  selectedGroup: string
  selectedClient: string
  selectedType: string
  selectedTutela: string
  selectedSubtutela: string
  selectedBranch: string
  selectedTerritory: string
  selectedZone: string
  StartDate: any;
  EndDate: any;

  ngOnInit(): void {


    this.startKIValue = this.service.min_KI;
    this.endKIValue = this.service.max_KI;
    this.startMTMValue = this.service.min_MTM;
    this.endMTMValue = this.service.max_MTM;
    this.options1.floor = this.startKIValue;
    this.options1.ceil = this.endKIValue;
    this.options2.floor = this.startMTMValue;
    this.options2.ceil = this.endMTMValue;
    this.current_KI_StartValue = this.service.current_min_KI
    this.current_KI_LastValue = this.service.current_max_KI
    this.current_MTM_StartValue = this.service.current_min_MTM
    this.current_MTM_LastValue = this.service.current_max_MTM
    this.selectedUnderlying = this.service.selectedUnderlying
    this.selectedCurrency = this.service.selectedCurrency
    this.selectedPayOff = this.service.selectedPayOff

    this.selectedGroup = this.service.selectedGroup
    this.selectedClient = this.service.selectedClient
    this.selectedType = this.service.selectedType
    this.selectedTutela = this.service.selectedTutela
    this.selectedSubtutela = this.service.selectedSubtutela
    this.selectedBranch = this.service.selectedBranch
    this.selectedTerritory = this.service.selectedTerritory
    this.selectedZone = this.service.selectedZone

    this.service.dataReceived.subscribe(() => {
      this.display = 2
      this.startKIValue = this.service.min_KI;
      this.endKIValue = this.service.max_KI;
      this.startMTMValue = this.service.min_MTM;
      this.endMTMValue = this.service.max_MTM;
      this.options1.floor = this.startKIValue;
      this.options1.ceil = this.endKIValue;
      this.options2.floor = this.startMTMValue;
      this.options2.ceil = this.endMTMValue;
      this.setProperties()
    })


    // this.selectedUnderlying = "All"
    // this.selectedCurrency = "All"
    // this.selectedPayOff = "All"
    this.service.SenddataToDropDown.subscribe(() => {
      this.worOfUnderlingList = this.service.worstOfUnderLyingList
      this.payOff = this.service.selectedPayOffList;
      this.currencies = this.service.selectedCurrencyList;
    })

    this.service.filterSelectedEvent.subscribe(() => {
      this.currencies = this.service.selectedCurrencyList
      this.worOfUnderlingList = this.service.worstOfUnderLyingList
      this.payOff = this.service.selectedPayOffList;
    })
    this.service.sendStateDataEvent.subscribe(() => {
      this.startKIValue = this.service.min_KI;
      this.endKIValue = this.service.max_KI;
      this.startMTMValue = this.service.min_MTM;
      this.endMTMValue = this.service.max_MTM;
      this.current_KI_StartValue = this.service.current_min_KI
      this.current_KI_LastValue = this.service.current_max_KI
      this.current_MTM_StartValue = this.service.current_min_MTM
      this.current_MTM_LastValue = this.service.current_max_MTM
      this.selectedUnderlying = this.service.selectedUnderlying
      this.selectedCurrency = this.service.selectedCurrency
      this.selectedPayOff = this.service.selectedPayOff
    })

  }

  kiinputchange(event,num) {
    if(event.target.value.length===0){
      if(num===1)
      event.target.value=this.startKIValue
      else if(num===2)
      event.target.value=this.endKIValue
    }
    if (parseFloat(event.target.value) < this.startKIValue) {
      event.target.value = this.startKIValue
    } else if (parseFloat(event.target.value) > this.endKIValue) {
      event.target.value = this.endKIValue
    }

    if (event.target.name === "ki-input1") {
      this.current_KI_StartValue = parseFloat(event.target.value)
    } else {
      this.current_KI_LastValue = parseFloat(event.target.value)
    }
    this.service.current_min_KI = this.current_KI_StartValue
    this.service.current_max_KI = this.current_KI_LastValue
  }

  mtminputchange(event, num) {
    if (event.target.value.length === 0) {
      if (num === 1)
        event.target.value = this.startMTMValue
      else if(num === 2)
      event.target.value = this.endMTMValue
    }

    if (parseFloat(event.target.value) < this.startMTMValue) {
      event.target.value = this.startMTMValue
    } else if (parseFloat(event.target.value) > this.endMTMValue) {
      event.target.value = this.endMTMValue
    }

    if (event.target.name === "mtm-input1") {
      this.current_MTM_StartValue = parseFloat(event.target.value)
    } else {
      this.current_MTM_LastValue = parseFloat(event.target.value)
    }
    this.service.current_min_MTM = this.current_MTM_StartValue
    this.service.current_max_MTM = this.current_MTM_LastValue
  }

  binder(event) {

    switch (event.target.name) {
      case "ki-input1": this.kiinputchange(event, 1);
        break;
      case "ki-input2": this.kiinputchange(event, 2);
        break;
      case "mtm-input1": this.mtminputchange(event, 1);
        break;
      case "mtm-input2": this.mtminputchange(event, 2);
        break;
    }

    this.service.dataFiltered.emit();

  }

  sliderToInputBinder() {
    this.service.current_min_KI = this.current_KI_StartValue
    this.service.current_max_KI = this.current_KI_LastValue
    this.service.current_min_MTM = this.current_MTM_StartValue
    this.service.current_max_MTM = this.current_MTM_LastValue
    this.service.dataFiltered.emit();

  }


  setProperties() {
    this.current_KI_LastValue = this.endKIValue;
    this.current_KI_StartValue = this.startKIValue;
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

  selectDate(StartDate) {
    try {
      this.service.startDate = StartDate;
      this.StartDate = this.datePipe.transform(StartDate, 'yyyy-MM-dd');

      this.service.dataFiltered.emit();
    } catch (error) {
      console.log("error in selectDate", error);

    }
  }
  selectEndDate(EndDate) {
    try {
      this.service.maturityDate = EndDate;
      this.EndDate = this.datePipe.transform(EndDate, 'yyyy-MM-dd');

      this.service.dataFiltered.emit();
    } catch (error) {
      console.log('Error in selectEndDate', error);

    }
  }

  FilterForAll(value: any, ClieneFilterCaseInput: number) {
    try {
      this.service.selectedGroup = this.selectedGroup;
      this.service.selectedClient = this.selectedClient;
      this.service.selectedType = this.selectedType;
      this.service.selectedTutela = this.selectedTutela;
      this.service.selectedSubtutela = this.selectedSubtutela;
      this.service.selectedBranch = this.selectedBranch;
      this.service.selectedTerritory = this.selectedTerritory;
      this.service.selectedZone = this.selectedZone;
      this.service.ClieneFilterCaseInput= ClieneFilterCaseInput;
      this.service.ClientFilterEvent.emit()


    } catch (error) {
      console.log("Error in FilterForAll", error);

    }
  }
}
