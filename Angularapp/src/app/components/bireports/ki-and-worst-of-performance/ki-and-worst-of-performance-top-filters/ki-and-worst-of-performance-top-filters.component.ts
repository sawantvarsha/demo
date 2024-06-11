import { Component, OnInit } from '@angular/core';
import { KiAndWorstOfPerformanceService } from '../wof-and-ki-filter.service';
// import { KiAndWorstOfPerformanceChartComponent } from '../worstOfPerformance-and-ki-chart/wof-and-ki-chart.component';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { DatePipe } from '@angular/common';
import { log } from 'console';
import { ChartService } from 'src/app/themeService/chart.service';

@Component({
  selector: 'app-ki-and-worst-of-performance-top-filters',
  templateUrl: './ki-and-worst-of-performance-top-filters.component.html',
  styleUrls: ['./ki-and-worst-of-performance-top-filters.component.scss']
})
export class KiAndWorstOfPerformanceTopFiltersComponent implements OnInit {

  clearProductFilter: boolean = false;
  refreshed: boolean = false;
  clearClientFilter: boolean = false;
  triggerRefreshFormat: boolean;
  triggerRefreshCurrency: boolean;
  triggerRefreshPayoff: boolean;

  constructor(private service: KiAndWorstOfPerformanceService, private datePipe: DatePipe, private chartService : ChartService) { }
  //added from here for filter

  selectedSorting: any = "SelectOption";
  selectedSortingAsc: any = 'Ascending'
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
  startKIValue: number = this.service.min_KI;
  endKIValue: number = this.service.max_KI;
  current_KI_StartValue: number = this.startKIValue
  current_KI_LastValue: number = this.endKIValue
  // worstOfPerformance
  startWOFValue: number = this.service.min_wof;
  endWOFValue: number = this.service.max_wof;
  current_WOF_StartValue: number = this.startWOFValue
  current_WOF_LastValue: number = this.endWOFValue
  StartDate: any;
  EndDate: any;

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

  worOfUnderlingList!: string[]
  selectedUnderlying!: string

  currencies!: string[]
  selectedCurrency!: string

  payOff!: string[]
  selectedPayOff!: any

  formatList!: string[]
  selectedFormat!: any;

  customer!: string[]
  selectedGroup: any
  selectedClient: any
  selectedIntRef:any;
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
    this.chartService.paletteEmitObs.subscribe((paletteres) => {
      if (!!paletteres) {
        let pallete = this.chartService.getPallete(paletteres);
        this.color = pallete.colors[4];
      }
    })
    this.StartDate = this.service.startDate
    this.EndDate = this.service.maturityDate
    this.startKIValue = this.service.min_KI;
    this.endKIValue = this.service.max_KI;
    this.options.floor = this.startKIValue
    this.options.ceil = this.endKIValue

    this.current_KI_StartValue = this.service.current_min_KI
    this.current_KI_LastValue = this.service.current_max_KI

    this.startWOFValue = this.service.min_wof;
    this.endWOFValue = this.service.max_wof;
    this.current_WOF_StartValue = this.startWOFValue
    this.current_WOF_LastValue = this.endWOFValue
    this.options1.floor = this.startWOFValue
    this.options1.ceil = this.endWOFValue

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
      this.startKIValue = this.service.min_KI;
      this.endKIValue = this.service.max_KI;
      this.options.floor = this.startKIValue
      this.options.ceil = this.endKIValue

      this.startWOFValue = this.service.min_wof;
      this.endWOFValue = this.service.max_wof;
      this.options1.floor = this.startWOFValue
      this.options1.ceil = this.endWOFValue

      this.setProperties()
    })


    // this.selectedUnderlying = "All"
    // this.selectedCurrency = "All"
    // this.selectedPayOff = "All"
    this.service.SenddataToDropDown.subscribe(() => {

      this.worOfUnderlingList = this.service.worstOfUnderLyingList
      this.currencies = this.service.selectedCurrencyList;
      this.payOff = this.service.selectedPayOffList
      this.formatList = this.service.selectedFormatList;


    })

    this.service.filterSelectedEvent.subscribe(() => {

      this.worOfUnderlingList = this.service.worstOfUnderLyingList
      this.currencies = this.service.selectedCurrencyList;
      this.payOff = this.service.selectedPayOffList;
      this.formatList = this.service.selectedFormatList;

    })

    this.service.sendStateDataEvent.subscribe(() => {

      this.startKIValue = this.service.min_KI;
      this.endKIValue = this.service.max_KI;

      this.current_KI_StartValue = this.service.current_min_KI
      this.current_KI_LastValue = this.service.current_max_KI

      this.startWOFValue = this.service.min_wof;
      this.endWOFValue = this.service.max_wof;

      this.current_WOF_StartValue = this.service.current_min_wof
      this.current_WOF_LastValue = this.service.current_max_wof

      // this.selectedUnderlying = this.service.selectedUnderlying
      // this.selectedCurrency = this.service.selectedCurrency;
      // this.selectedPayOff = this.service.selectedPayoff;

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


  }

  binder(event) {
    if (event.target.value.length === 0) {
      if (event.target.name === "input1")
        event.target.value = this.startKIValue
      else {
        event.target.value = this.endKIValue
      }
    }
    if (parseFloat(event.target.value) < this.startKIValue) {
      event.target.value = this.startKIValue
    } else if (parseFloat(event.target.value) > this.endKIValue) {
      event.target.value = this.endKIValue
    }

    if (event.target.name === "input1") {
      this.current_KI_StartValue = parseFloat(event.target.value)
    } else {
      this.current_KI_LastValue = parseFloat(event.target.value)
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

  binder1(event) {
    if (event.target.value.length === 0) {
      if (event.target.name === "input1")
        event.target.value = this.startWOFValue
      else {
        event.target.value = this.endWOFValue
      }
    }
    if (parseFloat(event.target.value) < this.startWOFValue) {
      event.target.value = this.startWOFValue
    } else if (parseFloat(event.target.value) > this.endWOFValue) {
      event.target.value = this.endWOFValue
    }

    if (event.target.name === "input1") {
      this.current_WOF_StartValue = parseFloat(event.target.value)
    } else {
      this.current_WOF_LastValue = parseFloat(event.target.value)
    }
    this.service.current_min_wof = this.current_WOF_StartValue
    this.service.current_max_wof = this.current_WOF_LastValue

    this.service.dataFiltered.emit();

  }

  sliderToInputBinder1() {
    this.service.current_min_wof = this.current_WOF_StartValue
    this.service.current_max_wof = this.current_WOF_LastValue
    this.service.dataFiltered.emit();

  }

  setProperties() {
    this.current_KI_LastValue = this.endKIValue;
    this.current_KI_StartValue = this.startKIValue;
    this.current_WOF_StartValue = this.startWOFValue;
    this.current_WOF_LastValue = this.endWOFValue;
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
      this.service.current_min_KI = this.service.initialState["min_KI"]
      this.service.current_max_KI = this.service.initialState["max_KI"]
      this.service.current_min_wof = this.service.initialState['min_wof']
      this.service.current_max_wof = this.service.initialState['max_wof']
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

  clearClient() {
    try {
      this.service.selectedGroup = this.service.initialState['selectedGroup'];
      this.service.selectedClient = this.service.initialState['selectedClient'];
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
      this.service.selectedPayoff = this.service.initialState["selectedPayOff"];
      this.service.selectedFormat = this.service.initialState['selectedFormat'];
      this.service.current_min_KI = this.service.initialState["min_KI"]
      this.service.current_max_KI = this.service.initialState["max_KI"]
      this.service.current_min_wof = this.service.initialState['min_wof']
      this.service.current_max_wof = this.service.initialState['max_wof']
      this.service.startDate = this.service.initialState['startDate']
      this.service.maturityDate = this.service.initialState['maturityDate']
      this.service.selectedGroup = this.service.initialState['selectedGroup'];
      this.service.selectedClient = this.service.initialState['selectedClient'];
      this.service.selectedType = this.service.initialState['selectedType'];
      this.service.selectedTutela = this.service.initialState['selectedTutela'];
      this.service.selectedSubtutela = this.service.initialState['selectedSubtutela'];
      this.service.selectedBranch = this.service.initialState['selectedBranch'];
      this.service.selectedTerritory = this.service.initialState['selectedTerritory'];
      this.service.selectedZone = this.service.initialState['selectedZone'];
      this.service.fillClientfilterData();
      this.clearClientFilter = true;
      this.service.setBg1([this.service.initialState["hex1"]])
      this.service.setBg2([this.service.initialState["hex2"]])
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
    this.service.filterEvent.emit();
  }

  clientFilterData(event){
    try{
      switch(event[0].split(':')[0]){
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
    catch(er){

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
