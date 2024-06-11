import { Component, OnInit } from '@angular/core';
import { LabelType, Options } from '@angular-slider/ngx-slider';
//import { GreekLcmFilters } from '../greek-lcm-filter/greek-lcm-filter.component';
import { GreekLcmFilterService } from '../greek-lcm-filter.service';
import { DatePipe } from '@angular/common';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ChartService } from 'src/app/themeService/chart.service';

@Component({
  selector: 'app-greek-lcm-top-filter',
  templateUrl: './greek-lcm-top-filter.component.html',
  styleUrls: ['./greek-lcm-top-filter.component.scss']
})
export class GreekLcmTopFilterComponent implements OnInit {
  clearProductFilter: boolean = false;
  refreshed: boolean = false;
  clearClientFilter: boolean = false;
  triggerRefreshFormat: boolean;
  triggerRefreshCurrency: boolean;
  triggerRefreshPayoff: boolean;

  constructor(private service: GreekLcmFilterService, private datePipe: DatePipe, private chartService : ChartService) { }

  //added by AdilP @15-09-2023

  selectedSortingAsc: any = 'Ascending'
  selectedSorting: any = "SelectOption";
  selectedExternal: any = ''
  showFilterDropdown: boolean = false;
  loader: boolean = false;
  color: string = "#fd4a4e";

  //already present
  selectedWorstOfUnderlyings: string[] = [];
  displayDropdown: boolean = false;
  displayString: string = 'All';

  display = 1
  products!: number
  startDeltaValue: number = this.service.min_Delta;
  endDeltaValue: number = this.service.max_Delta;
  current_Delta_StartValue: number = this.startDeltaValue
  current_Delta_LastValue: number = this.endDeltaValue
  // worstOfPerformance
  startGammaValue: number = this.service.min_Gamma;
  endGammaValue: number = this.service.max_Gamma;
  current_Gamma_StartValue: number = this.startGammaValue
  current_Gamma_LastValue: number = this.endGammaValue

  startVegaValue: number = this.service.min_Vega;
  endVegaValue: number = this.service.max_Vega;
  current_Vega_StartValue: number = this.startVegaValue
  current_Vega_LastValue: number = this.endVegaValue

  startNotionalValue: number = this.service.min_Notional;
  endNotionalValue: number = this.service.max_Notional;
  current_Notional_StartValue: number = this.startNotionalValue
  current_Notional_LastValue: number = this.endNotionalValue
  StartDate: any;
  EndDate: any;

  LiveCheck: boolean = true;
  

  optionsDelta: Options = {
    // floor: this.startDate.getTime(),
    // ceil:this.endDate.getTime(),
    //step: 0.01,
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
  options1: Options = {
    // floor: this.startDate.getTime(),
    // ceil:this.endDate.getTime(),
    // step: 0.01,
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
    // step: 0.01,
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
  options3: Options = {
    // floor: this.startDate.getTime(),
    // ceil:this.endDate.getTime(),
    // step: 0.01,
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
  selectedPayOff!: any

  customer!: string[]
  selectedCustomer!: string

  formatList!: string[]
  selectedFormat!: any;

  selectedGroup: any
  selectedClient: any
  selectedIntRef: any;
  selectedType: any
  selectedTutela: any
  selectedSubtutela: any
  selectedBranch: any
  selectedTerritory: any
  selectedZone: any

  groupArr: any = [];
  clientArr: any = [];
  intRefArr: any = [];
  typeArr: any = [];
  tutelaArr: any = [];
  subtutelaArr: any = [];
  branchArr: any = [];
  territoryArr: any = [];
  zoneArr: any = [];

  ngOnDestroy(): void {
    this.service.selectedUnderlying = '';
    this.service.selectedCurrency = '';
    this.service.selectedPayoff = '';
    this.service.selectedFormat = '';
  }
  ngOnInit(): void {
    this.StartDate = this.service.startDate
    this.EndDate = this.service.maturityDate
    this.startDeltaValue = this.service.min_Delta;
    this.endDeltaValue = this.service.max_Delta;
    this.optionsDelta.floor = this.startDeltaValue
    this.optionsDelta.ceil = this.endDeltaValue
    this.current_Delta_StartValue = this.service.current_min_Delta
    this.current_Delta_LastValue = this.service.current_max_Delta

    this.startGammaValue = this.service.min_Gamma;
    this.endGammaValue = this.service.max_Gamma;
    this.current_Gamma_StartValue = this.startGammaValue
    this.current_Gamma_LastValue = this.endGammaValue
    this.options1.floor = this.startGammaValue
    this.options1.ceil = this.endGammaValue

    this.startVegaValue = this.service.min_Vega;
    this.endVegaValue = this.service.max_Vega;
    this.current_Vega_StartValue = this.startVegaValue
    this.current_Vega_LastValue = this.endVegaValue
    this.options2.floor = this.startVegaValue
    this.options2.ceil = this.endVegaValue

    this.startNotionalValue = this.service.min_Notional;
    this.endNotionalValue = this.service.max_Notional;
    this.current_Notional_StartValue = this.startNotionalValue
    this.current_Notional_LastValue = this.endNotionalValue
    this.options3.floor = this.startNotionalValue
    this.options3.ceil = this.endNotionalValue

    this.selectedUnderlying = this.service.selectedUnderlying
    this.selectedCurrency = this.service.selectedCurrency;
    this.selectedPayOff = this.service.selectedPayoff;
    this.selectedFormat = this.service.selectedFormat;

    this.selectedGroup = this.service.selectedGroup
    this.selectedClient = this.service.selectedClient
    this.selectedType = this.service.selectedType
    this.selectedTutela = this.service.selectedTutela
    this.selectedSubtutela = this.service.selectedSubtutela
    this.selectedBranch = this.service.selectedBranch
    this.selectedTerritory = this.service.selectedTerritory
    this.selectedZone = this.service.selectedZone

    this.service.sendProductTotalEvent.subscribe(() => {
      this.products = this.service.totalproducts
    })

    this.service.dataReceived.subscribe(() => {
      this.display = 2
      this.startDeltaValue = this.service.min_Delta;
      this.endDeltaValue = this.service.max_Delta;
      this.optionsDelta.floor = this.startDeltaValue
      this.optionsDelta.ceil = this.endDeltaValue

      this.startGammaValue = this.service.min_Gamma;
      this.endGammaValue = this.service.max_Gamma;
      this.options1.floor = this.startGammaValue
      this.options1.ceil = this.endGammaValue

      this.startVegaValue = this.service.min_Vega;
      this.endVegaValue = this.service.max_Vega;
      this.options2.floor = this.startVegaValue
      this.options2.ceil = this.endVegaValue

      this.startNotionalValue = this.service.min_Notional;
      this.endNotionalValue = this.service.max_Notional;
      this.options3.floor = this.startNotionalValue
      this.options3.ceil = this.endNotionalValue

      this.setProperties()
    })


    // this.selectedUnderlying = "All"
    // this.selectedCurrency = "All"
    // this.selectedPayOff = "All"
    this.service.SenddataToDropDown.subscribe(() => {

      this.worOfUnderlingList = this.service.UnderlyingList
      this.currencies = this.service.selectedCurrencyList;
      this.payOff = this.service.selectedPayOffList
      this.formatList = this.service.selectedFormatList;


    })

    this.service.SenddataToClientFilter.subscribe(() => {
      this.groupArr = this.service.groupArr
      this.clientArr = this.service.clientArr
      this.intRefArr = this.service.intRefArr
      this.typeArr = this.service.typeArr
      this.tutelaArr = this.service.tutelaArr
      this.subtutelaArr = this.service.subtutelaArr
      this.branchArr = this.service.branchArr
      this.territoryArr = this.service.territoryArr
      this.zoneArr = this.service.zoneArr
    })

    this.service.filterSelectedEvent.subscribe(() => {

      this.worOfUnderlingList = this.service.UnderlyingList
      this.currencies = this.service.selectedCurrencyList;
      this.payOff = this.service.selectedPayOffList;
      this.formatList = this.service.selectedFormatList;


    })

    this.service.sendStateDataEvent.subscribe(() => {

      this.startDeltaValue = this.service.min_Delta;
      this.endDeltaValue = this.service.max_Delta;
      this.current_Delta_StartValue = Number(this.service.current_min_Delta.toFixed(2))
      this.current_Delta_LastValue = Number(this.service.current_max_Delta.toFixed(2))

      this.startVegaValue = this.service.min_Vega;
      this.endVegaValue = this.service.max_Vega;
      this.current_Vega_StartValue = Number(this.service.current_min_Vega.toFixed(2))
      this.current_Vega_LastValue = Number(this.service.current_max_Vega.toFixed(2))

      this.startGammaValue = this.service.min_Gamma;
      this.endGammaValue = this.service.max_Gamma;
      this.current_Gamma_StartValue = Number(this.service.current_min_Gamma.toFixed(2))
      this.current_Gamma_LastValue = Number(this.service.current_max_Gamma.toFixed(2))

      this.startNotionalValue = this.service.min_Notional;
      this.endNotionalValue = this.service.max_Notional;
      this.current_Notional_StartValue = Number(this.service.current_min_Notional.toFixed(2))
      this.current_Notional_LastValue = Number(this.service.current_max_Notional.toFixed(2))

      // this.selectedUnderlying = this.service.selectedUnderlying
      // this.selectedCurrency = this.service.selectedCurrency;
      // this.selectedPayOff = this.service.selectedPayoff;
      // this.selectedFormat= this.service.selectedFormat

      // this.payOff= this.service.selectedPayOffList
      // this.currencies= this.service.selectedCurrencyList
      // this.formatList= this.service.selectedFormatList



    })

    this.chartService.paletteEmitObs.subscribe((paletteres) => {
      if (!!paletteres) {
        let pallete = this.chartService.getPallete(paletteres);
        this.color = pallete.colors[4];
      }
    })


  }

  binder(event) {
    if (event.target.value.length === 0) {
      if (event.target.name === "input1")
        event.target.value = this.startDeltaValue
      else {
        event.target.value = this.endDeltaValue
      }
    }
    if (parseFloat(event.target.value) < this.startDeltaValue) {
      event.target.value = this.startDeltaValue
    } else if (parseFloat(event.target.value) > this.endDeltaValue) {
      event.target.value = this.endDeltaValue
    }

    if (event.target.name === "input1") {
      this.current_Delta_StartValue = Number(parseFloat(event.target.value).toFixed(2));
    } else {
      this.current_Delta_LastValue = Number(parseFloat(event.target.value).toFixed(2))
    }
    this.service.current_min_Delta = this.current_Delta_StartValue
    this.service.current_max_Delta = this.current_Delta_LastValue

    this.service.dataFiltered.emit();

  }

  sliderToInputBinder() {
    this.service.current_min_Delta = this.current_Delta_StartValue
    this.service.current_max_Delta = this.current_Delta_LastValue
    this.service.dataFiltered.emit();

  }

  binder1(event) {
    if (event.target.value.length === 0) {
      if (event.target.name === "input1")
        event.target.value = this.startGammaValue
      else {
        event.target.value = this.endGammaValue
      }
    }
    if (parseFloat(event.target.value) < this.startGammaValue) {
      event.target.value = this.startGammaValue
    } else if (parseFloat(event.target.value) > this.endGammaValue) {
      event.target.value = this.endGammaValue
    }

    if (event.target.name === "input1") {
      this.current_Gamma_StartValue = Number(parseFloat(event.target.value).toFixed(2))
    } else {
      this.current_Gamma_LastValue = Number(parseFloat(event.target.value).toFixed(2))
    }
    this.service.current_min_Gamma = this.current_Gamma_StartValue
    this.service.current_max_Gamma = this.current_Gamma_LastValue

    this.service.dataFiltered.emit();

  }

  sliderToInputBinder1() {
    this.service.current_min_Gamma = this.current_Gamma_StartValue
    this.service.current_max_Gamma = this.current_Gamma_LastValue
    this.service.dataFiltered.emit();

  }

  binder2(event) {
    if (event.target.value.length === 0) {
      if (event.target.name === "input1Vega")
        event.target.value = this.startVegaValue
      else {
        event.target.value = this.endVegaValue
      }
    }
    if (parseFloat(event.target.value) < this.startVegaValue) {
      event.target.value = this.startVegaValue
    } else if (parseFloat(event.target.value) > this.endVegaValue) {
      event.target.value = this.endVegaValue
    }

    if (event.target.name === "input1Vega") {
      this.current_Vega_StartValue = Number(parseFloat(event.target.value).toFixed(2))
    } else {
      this.current_Vega_LastValue = Number(parseFloat(event.target.value).toFixed(2))
    }
    this.service.current_min_Vega = this.current_Vega_StartValue
    this.service.current_max_Vega = this.current_Vega_LastValue

    this.service.dataFiltered.emit();

  }

  sliderToInputBinder2() {
    this.service.current_min_Vega = this.current_Vega_StartValue
    this.service.current_max_Vega = this.current_Vega_LastValue
    this.service.dataFiltered.emit();

  }

  binder3(event) {
    if (event.target.value.length === 0) {
      if (event.target.name === "input1")
        event.target.value = this.startNotionalValue
      else {
        event.target.value = this.endNotionalValue
      }
    }
    if (parseFloat(event.target.value) < this.startNotionalValue) {
      event.target.value = this.startNotionalValue
    } else if (parseFloat(event.target.value) > this.endNotionalValue) {
      event.target.value = this.endNotionalValue
    }

    if (event.target.name === "input1") {
      this.current_Notional_StartValue = Number(parseFloat(event.target.value).toFixed(2))
    } else {
      this.current_Notional_LastValue = Number(parseFloat(event.target.value).toFixed(2))
    }
    this.service.current_min_Notional = this.current_Notional_StartValue
    this.service.current_max_Notional = this.current_Notional_LastValue

    this.service.dataFiltered.emit();

  }

  sliderToInputBinder3() {
    this.service.current_min_Notional = this.current_Notional_StartValue
    this.service.current_max_Notional = this.current_Notional_LastValue
    this.service.dataFiltered.emit();

  }

  setProperties() {
    this.current_Notional_LastValue = this.endNotionalValue;
    this.current_Notional_StartValue = this.startNotionalValue;
    this.current_Delta_StartValue = this.startDeltaValue;
    this.current_Delta_LastValue = this.endDeltaValue;
    this.current_Gamma_StartValue = this.startGammaValue;
    this.current_Gamma_LastValue = this.endGammaValue;
    this.current_Vega_StartValue = this.startVegaValue;
    this.current_Vega_LastValue = this.endVegaValue;
  }

  sendSelectedUnderlying(value: string) {
    // this.selectedUnderlying = value
    const underlyingToSearch = this.selectedUnderlying.split(',').map(arg => arg.trim().toLowerCase());
    this.service.selectedUnderlying = underlyingToSearch

    this.service.filterSelectedEvent.emit()
  }
  sendSelectedCurrency(value: string) {
    const currencyArr = this.selectedCurrency.split(',').map(arg => arg.trim().toLowerCase());
    // this.selectedCurrency = value
    this.service.selectedCurrency = currencyArr

    this.service.filterSelectedEvent.emit()
  }
  sendSelectedPayoff(value: string) {
    const payOffArr = this.selectedPayOff.split(',').map(arg => arg.trim().toLowerCase());
    // this.selectedPayOff = value
    this.service.selectedPayoff = payOffArr

    this.service.filterSelectedEvent.emit()
  }
  sendselectedFormatList(value: string) {
    //this.selectedFormat = value
    const formatArr = this.selectedFormat.split(',').map(arg => arg.trim().toLowerCase());
    this.service.selectedFormat = formatArr
    //this.service.selectedFormat = this.selectedFormat

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

  refreshMultiSelect(product) {
    try {

      // this.triggerRefresh = false;
      switch (product) {
        case 'format':
          if (this.triggerRefreshFormat) {
            this.triggerRefreshFormat = false
            return true;
          }
          break;

        case 'currency':
          if (this.triggerRefreshCurrency) {
            this.triggerRefreshCurrency = false
            return true;
          }
          break;

        case 'payoff':
          if (this.triggerRefreshPayoff) {
            this.triggerRefreshPayoff = false
            return true;
          }
          break;
      }
      return false

    } catch (error) {
      console.log(error);

    }
  }

  clearProduct() {
    try {

      
      this.triggerRefreshFormat = true
      this.triggerRefreshCurrency = true
      this.triggerRefreshPayoff = true
      this.service.selectedUnderlying = this.service.initialState["selectedUnderlying"]
      this.service.selectedCurrency = this.service.initialState["selectedCurrency"];
      this.service.selectedPayoff = this.service.initialState["selectedPayoff"];
      this.service.selectedFormat = this.service.initialState['selectedFormat'];
      // this.clearProductFilter = true;
      this.selectedUnderlying = this.service.selectedUnderlying
      this.selectedCurrency = this.service.selectedCurrency;
      this.selectedPayOff = this.service.selectedPayoff;
      this.selectedFormat = this.service.selectedFormat

      this.service.sendStateDataEvent.emit();
    } catch (error) {
      console.log("Error in clearProduct filter", error);

    }
  }

  clearProductSpecs() {
    try {
      this.service.current_min_Delta = this.service.initialState["min_Delta"]
      this.service.current_max_Delta = this.service.initialState["max_Delta"]
      this.service.current_min_Vega = this.service.initialState["min_Vega"]
      this.service.current_max_Vega = this.service.initialState["max_Vega"]
      this.service.current_min_Gamma = this.service.initialState["min_Gamma"]
      this.service.current_max_Gamma = this.service.initialState["max_Gamma"]
      this.service.current_min_Notional = this.service.initialState["min_Notional"]
      this.service.current_max_Notional = this.service.initialState["max_Notional"]
      this.service.startDate = this.service.initialState['startDate']
      this.service.maturityDate = this.service.initialState['maturityDate']
      this.StartDate = ''
      this.EndDate = ''
      this.service.sendStateDataEvent.emit();
    } catch (error) {
      console.log("Error in clearProductSpecs filter", error);

    }
  }

  basicSort(value: any) {
    try {
      // this.chartComponent.filterData1(value)
      this.service.selectedOption1 = value;
      this.service.filterEvent.emit()

    } catch (error) {
      console.log("error in basicSort", error);

    }
  }
  basicSortAsc(value: any) {
    try {
      // this.chartComponent.filterData(value)
      this.service.selectedOption = value;
      this.service.filterEvent.emit()

    } catch (error) {
      console.log("error in basicSortAsc", error);

    }
  }

  onColorChange(value: any) {
    try {
      this.service.inputColor = value
      this.service.inputColorEvent.emit();

    } catch (error) {
      console.log("error in onColorChange", error);

    }
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
      this.service.ClieneFilterCaseInput = ClieneFilterCaseInput;
      this.service.ClientFilterEvent.emit()


    } catch (error) {
      console.log("Error in FilterForAll", error);

    }
  }
  checkLiveToggle(event: MatSlideToggleChange) {
    this.LiveCheck = event.checked;
    this.service.LiveCheck = this.LiveCheck;
    this.service.LiveCheckEvent.emit();
  }

  clearClient() {
    try {
      this.service.selectedGroup = this.service.initialState['selectedGroup'];
      this.service.selectedClient = this.service.initialState['selectedClient'];
      this.service.selectedIntRef = this.service.initialState['selectedIntRef'];
      this.service.selectedType = this.service.initialState['selectedType'];
      this.service.selectedTutela = this.service.initialState['selectedTutela'];
      this.service.selectedSubtutela = this.service.initialState['selectedSubtutela'];
      this.service.selectedBranch = this.service.initialState['selectedBranch'];
      this.service.selectedTerritory = this.service.initialState['selectedTerritory'];
      this.service.selectedZone = this.service.initialState['selectedZone'];
      this.service.fillClientfilterData();
      this.clearClientFilter = true;
      this.service.ClientFilterEvent.emit();
    } catch (error) {
      console.log("Error in clearClinet", error);
    }
  }

  refresh() {
    try {
      this.service.selectedOption = this.service.initialState["selectedOption"]
      this.service.selectedOption1 = this.service.initialState["selectedOption1"]
      this.service.selectedUnderlying = this.service.initialState["selectedUnderlying"]
      this.service.selectedCurrency = this.service.initialState["selectedCurrency"];
      this.service.selectedPayoff = this.service.initialState["selectedPayoff"];
      this.service.selectedFormat = this.service.initialState['selectedFormat'];
      this.service.current_min_Delta = this.service.initialState["min_Delta"]
      this.service.current_max_Delta = this.service.initialState["max_Delta"]
      this.service.current_min_Vega = this.service.initialState["min_Vega"]
      this.service.current_max_Vega = this.service.initialState["max_Vega"]
      this.service.current_min_Gamma = this.service.initialState["min_Gamma"]
      this.service.current_max_Gamma = this.service.initialState["max_Gamma"]
      this.service.current_min_Notional = this.service.initialState["min_Notional"]
      this.service.current_max_Notional = this.service.initialState["max_Notional"]
      this.service.startDate = this.service.initialState['startDate']
      this.service.maturityDate = this.service.initialState['maturityDate']
      this.service.selectedGroup = this.service.initialState['selectedGroup'];
      this.service.selectedIntRef = this.service.initialState['selectedIntRef'];
      this.service.selectedType = this.service.initialState['selectedType'];
      this.service.selectedTutela = this.service.initialState['selectedTutela'];
      this.service.selectedSubtutela = this.service.initialState['selectedSubtutela'];
      this.service.selectedBranch = this.service.initialState['selectedBranch'];
      this.service.selectedTerritory = this.service.initialState['selectedTerritory'];
      this.service.selectedZone = this.service.initialState['selectedZone'];
      this.service.fillClientfilterData();
      this.clearClientFilter = true;
      // this.service.setBg1([this.service.initialState["hex1"]])
      // this.service.setBg2([this.service.initialState["hex2"]])
      this.service.LiveCheck = this.service.initialState['LiveCheck'];
      this.StartDate = '';
      this.EndDate = '';
      this.selectedUnderlying = this.service.selectedUnderlying
      this.selectedCurrency = this.service.selectedCurrency;
      this.selectedPayOff = this.service.selectedPayoff;
      this.selectedFormat = this.service.selectedFormat
      this.triggerRefreshFormat = true
      this.triggerRefreshCurrency = true
      this.triggerRefreshPayoff = true
      this.service.sendStateDataEvent.emit();
    } catch (error) {
      console.log("Error in clearClinet", error);
    }
  }
  FilterBasedOnExternal(event?: KeyboardEvent) {
    this.service.selectedExternal = this.selectedExternal;
    this.service.filterEvent.emit()
  }

  clientFilterData(event) {
    try {
      switch (event[0].split(':')[0]) {
        case 'Group':
          this.service.selectedGroup = event[0].split(':')[1];
          this.service.selectedType = '';
          this.service.selectedTutela = '';
          this.service.selectedSubtutela = '';
          this.service.selectedClient = '';
          this.service.selectedIntRef = '';
          break;
        case 'Client':
          this.service.selectedClient = event[0].split(':')[1];
          break;
        case 'Internal Ref./J':
          this.service.selectedIntRef = event[0].split(':')[1];
          break;
        case 'Type':
          this.service.selectedType = event[0].split(':')[1];
          this.service.selectedTutela = '';
          this.service.selectedSubtutela = '';
          this.service.selectedClient = '';
          this.service.selectedIntRef = '';
          break;
        case 'Tutela':
          this.service.selectedTutela = event[0].split(':')[1];
          this.service.selectedSubtutela = '';
          this.service.selectedClient = '';
          this.service.selectedIntRef = '';
          break;
        case 'Subtutela':
          this.service.selectedSubtutela = event[0].split(':')[1];
          this.service.selectedClient = '';
          this.service.selectedIntRef = '';
          break;
        case 'Branch':
          this.service.selectedBranch = event[0].split(':')[1];
          break;
        case 'Territory':
          this.service.selectedTerritory = event[0].split(':')[1];
          this.service.selectedZone = '';
          this.service.selectedBranch = '';
          break;
        case 'Zone':
          this.service.selectedZone = event[0].split(':')[1];
          this.service.selectedBranch = '';
          break;
        default:
          break;
      }
      // this.FilterForAll();
      this.service.setClientFilters(event[0].split(':')[0]);
      //this.clearClientFilter = false;
      this.service.ClientFilterEvent.emit()
    }
    catch (er) {

    }
  }
  clearClientFilterSelectAll() {
    try {
      if (this.clearClientFilter) {


        // this.clearClientFilter = false;
        return true;
      }
      else
        return false;
    } catch (error) {
      console.log(error);

    }
  }

}
