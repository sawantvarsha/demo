import { EventEmitter, Injectable } from '@angular/core';
import { log } from 'console';
import { local } from 'd3';
import { BehaviorSubject, Observable } from 'rxjs';

export type dataType = {
  [key: string]: number | string
}

@Injectable({
  providedIn: 'root'
})
export class KiAndWorstOfPerformanceService {

  filteredData: any[] = [];
  clientsfilteredData: any[] = [];
  totalproducts!: number
  selectedCustomer: string = "All";
  customerList!: any[];
  selectedOption: string = 'Ascending'
  selectedOption1: string = 'ISIN'
  selectedExternal: string = '';
  hex1: any = '#fe9b9c'
  hex2: any = '#fd4a4e'
  inputColor: any = '#fd4a4e';
  constructor() { }

  dataReceived = new EventEmitter<void>()
  dataFiltered = new EventEmitter<void>()
  SenddataToDropDown = new EventEmitter<void>();
  filterSelectedEvent = new EventEmitter<void>()
  sendProductTotalEvent = new EventEmitter<void>()
  filterEvent = new EventEmitter<void>()
  inputColorEvent = new EventEmitter<void>();
  ClientFilterEvent = new EventEmitter<void>();
  SenddataToClientFilter = new EventEmitter<void>();

  worstOfUnderlying = "WorstOfUnderlying"
  currency = "Currency"
  payoff = "Type"
  customername = "CustomerName"
  traceKIDistance = "Trace_KI_Distance"
  ISIN = "ISIN"
  worstOfPerformance = "WorstOfPerformance"
  format = "Format"

  min_KI: number
  max_KI: number
  current_min_KI: number
  current_max_KI: number
  //Added by Adil 18-09-2023
  min_wof: number;
  max_wof: number;
  current_min_wof: number;
  current_max_wof: number;

  filterDisplay = false

  worstOfUnderLyingList: any[] = []
  selectedCurrencyList: any[] = []
  selectedUnderlying: any = ""
  selectedCurrency: any = ""
  selectedPayOffList: any[] = []
  selectedPayoff: any = ""
  selectedFormatList: any[] = [];
  selectedFormat: any = ""

  startDate: any = ''
  maturityDate: any = ''

  selectedGroup: any
  selectedClient: any
  selectedIntRef: any;
  selectedType: any
  selectedTutela: any
  selectedSubtutela: any
  selectedBranch: any
  selectedTerritory: any
  selectedZone: any

  ClieneFilterCaseInput: Number

  groupArr: any = [];
  clientArr: any = [];
  intRefArr: any = [];
  typeArr: any = [];
  tutelaArr: any = [];
  subtutelaArr: any = [];
  branchArr: any = [];
  territoryArr: any = [];
  zoneArr: any = [];

  data: any[] = []
  dataFormat: any[] = []

  initialState: any = {
    "selectedUnderlying": "",
    "selectedCurrency": "",
    "selectedCustomer": "",
    "selectedPayOff": "",
    "selectedOption": "Ascending",
    "selectedOption1": "ISIN",
    "hex1": '#fe9b9c',
    "hex2": '#fd4a4e',
    "min_KI": 0,
    "max_KI": 0,
    "min_wof": 0,
    "max_wof": 0,
    'selectedPayoff': 'All',
    'startDate': '',
    'maturityDate': '',
    "selectedGroup": "",
    "selectedClient": "",
    "selectedType": "",
    "selectedTutela": "",
    "selectedSubtutela": "",
    "selectedBranch": "",
    "selectedTerritory": "",
    "selectedZone": "",
    "selectedIntRef": "",

  }

  //=========================================================================================
  sendStateDataEvent = new EventEmitter<void>()
  screenshotData: any = [];


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Added By Zeeshan (01-06-23)
  selectedClients: string[] = []
  selectedWorstOfUnderlyings: string[] = []
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  setScreenshotData(value: any) {
    if (this.screenshotData.length < 15) {
      this.screenshotData.push(value);
      this.setScreenshotArray(this.screenshotData);
    } else {
      this.screenshotData.shift();
      this.screenshotData.push(value);
      this.setScreenshotArray(this.screenshotData);
    }
  }

  private bg1Subject = new BehaviorSubject<Array<any>>([]);
  bg1$ = this.bg1Subject.asObservable();
  setBg1(data: Array<any>) {
    this.bg1Subject.next(data);
    if (data.length !== 0) {
      this.hex1 = data[0]
    }
  }

  private bg2Subject = new BehaviorSubject<Array<any>>([]);
  bg2$ = this.bg2Subject.asObservable();
  setBg2(data: Array<any>) {
    this.bg2Subject.next(data);
    if (data.length !== 0) {
      this.hex2 = data[0]
    }
  }


  getScreenshotData() {
    return this.screenshotData;
  }

  private screenshotDataSubject = new BehaviorSubject<Array<any>>([]);
  screenshotData$ = this.screenshotDataSubject.asObservable();
  setScreenshotArray(data: Array<any>) {
    this.screenshotDataSubject.next(data);
  }
  private display: BehaviorSubject<'open' | 'close'> =
    new BehaviorSubject<any>('close');

  watch(): Observable<'open' | 'close'> {
    return this.display.asObservable();
  }

  open() {
    this.display.next('open');
  }

  close() {
    this.display.next('close');
  }


  //==========================================================================================

  setData(apiData: any[]) {
    //this.data =apiData
    this.data = apiData.filter((data) => data["WorstOfPerformance"] !== null && data["Trace_KI_Distance"] !== null && !data["Trace_KI_Distance"].isNaN);
    this.setProperties()

  }

  filter() {
    if (this.selectedCurrency === "") {
      this.filteredData = this.filteredData
    }
    else {
      //this.filteredData = this.filteredData.filter((data) => data[this.currency] === this.selectedCurrency)
      this.filteredData = this.filteredData.filter((s: any) => this.selectedCurrency.some(currency => (s.Currency.toString().toLowerCase().includes(currency) || s.Currency.toLowerCase().includes(currency.toLowerCase()))))

    }

    if (this.selectedUnderlying === "") {
      this.filteredData = this.filteredData
    }
    else {
      // this.filteredData = this.filteredData.filter((data) => data[this.Underlying] === this.selectedUnderlying)
      // this.filteredData = this.filteredData.filter((s: any) => (this.selectedUnderlying.every(underlying => s.Underlying.toLowerCase().includes(underlying.toLowerCase()))))//&& s.ULCount!="1"
      this.filteredData = this.filteredData.filter((s: any) => this.selectedUnderlying.some(underlyings => (s.Underlying.toLowerCase().includes(underlyings.toLowerCase()))))

    }

    if (this.selectedPayoff === "") {
      this.filteredData = this.filteredData
    }
    else {
      //this.filteredData = this.filteredData.filter((data) => data[this.payoff] === this.selectedPayoff)
      this.filteredData = this.filteredData.filter((s: any) => this.selectedPayoff.some(payoff => (s.PayOffClass.toString().toLowerCase().includes(payoff) || s.PayOffClass.toLowerCase().includes(payoff.toLowerCase()))))
    }
    if (this.selectedFormat === "") {
      this.filteredData = this.filteredData
    }
    else {
      // this.filteredData = this.filteredData.filter((data) => data[this.format] === this.selectedFormat)
      this.filteredData = this.filteredData.filter((s: any) => this.selectedFormat.some(format => (s.Format.toString().toLowerCase().includes(format) || s.Format.toLowerCase().includes(format.toLowerCase()))))
    }

    if (this.selectedCustomer === "All") {
      this.filteredData = this.filteredData
    }
    else {
      this.filteredData = this.filteredData.filter((data) => data[this.customername] === this.selectedCustomer)
    }
  }



  getLists() {
    let tempData = []
    tempData = this.filteredData
    if (this.selectedCustomer !== "All") {
      tempData = tempData.filter((data) => data[this.customername] === this.selectedCustomer)
    }
    this.worstOfUnderLyingList = [...new Set(tempData.map((data) => data[this.worstOfUnderlying]))]
    this.worstOfUnderLyingList = this.worstOfUnderLyingList.sort((a, b) => { return a.localeCompare(b) })

    this.selectedCurrencyList = [...new Set(tempData.map((data) => data[this.currency]))]
    this.selectedCurrencyList = this.selectedCurrencyList.sort((a, b) => { return a.localeCompare(b) })

    this.selectedPayOffList = [...new Set(tempData.map((data) => data[this.payoff]))]
    this.selectedPayOffList = this.selectedPayOffList.sort((a, b) => { return a.localeCompare(b) })

    this.selectedFormatList = [...new Set(tempData.map((data) => data[this.format]))]
    this.selectedFormatList = this.selectedFormatList.sort((a, b) => { return a.localeCompare(b) })



    // tempData = []
    // tempData = this.filteredData
    // if (this.selectedCustomer !== "All") {
    //   tempData = tempData.filter((data) => data[this.customername] === this.selectedCustomer)
    // }
    // if (this.selectedUnderlying !== "All")
    //   tempData = tempData.filter((data) => data[this.worstOfUnderlying] === this.selectedUnderlying)

    // tempData = []
    // tempData = this.filteredData
    // if (this.selectedCustomer !== "All") {
    //   tempData = tempData.filter((data) => data[this.customername] === this.selectedCustomer)
    // }
    // if (this.selectedUnderlying !== "All")
    //   tempData = tempData.filter((data) => data[this.worstOfUnderlying] === this.selectedUnderlying)

    // tempData = []
    // tempData = this.filteredData

    if (this.selectedUnderlying !== "All")
      tempData = tempData.filter((data) => data[this.worstOfUnderlying] === this.selectedUnderlying)
    this.customerList = [...new Set(tempData.map((data) => data[this.customername]))]
    this.SenddataToDropDown.emit()


  }

  getData(): dataType[] {
    let tempData: dataType = {}
    let dataFormat: dataType[] = []
    this.filterData()
    this.filteredData.forEach((data) => {
      // tempData[this.traceKIDistance] = data[this.traceKIDistance]
      // tempData[this.worstOfPerformance] = data[this.worstOfPerformance]
      // tempData[this.ISIN] = data[this.ISIN]
      // tempData["Product_Name"] = data["Product_Name"]
      // tempData[this.worstOfUnderlying] = data[this.worstOfUnderlying]
      // tempData["C_Note_Barrier_PC"] = data["C_Note_Barrier_PC"]
      // tempData["NM_Airbag_PC"] = data["NM_Airbag_PC"]
      // tempData["Note_Master_ID"] = data["Note_Master_ID"]
      // dataFormat = [...dataFormat, { ...tempData }]
      tempData = {
        "Trace_KI_Distance": data[this.traceKIDistance],
        "WorstOfPerformance": data[this.worstOfPerformance],
        "ISIN": data[this.ISIN],
        "Product_Name": data["Product_Name"],
        "WorstOfUnderlying": data[this.worstOfUnderlying],
        "C_Note_Barrier_PC": data["C_Note_Barrier_PC"],
        "NM_Airbag_PC": data["NM_Airbag_PC"],
        "Note_Master_ID": data["Note_Master_ID"],
      }
      dataFormat.push(tempData)
    })
    this.dataFormat = dataFormat  // Changed by AdilP
    this.dataFormat.sort((a: any, b: any) => b[this.traceKIDistance] - a[this.traceKIDistance])
    this.getDistinct(dataFormat)
    return this.dataFormat
  }

  setProperties() {
    this.filterDisplay = true
    let KI_list: number[] = this.data.map((data) => data[this.traceKIDistance]).sort((a, b) => a - b)
    this.min_KI = KI_list[0]
    this.max_KI = KI_list[KI_list.length - 1]
    this.current_min_KI = this.min_KI
    this.current_max_KI = this.max_KI
    let wof_list: number[] = this.data.map((data) => data[this.worstOfPerformance]).sort((a, b) => a - b)

    this.min_wof = wof_list[0]
    this.max_wof = KI_list[wof_list.length - 1]
    this.current_min_wof = this.min_wof
    this.current_max_wof = this.max_wof


    this.initialState["min_KI"] = this.min_KI
    this.initialState["max_KI"] = this.max_KI
    this.initialState["min_wof"] = this.min_wof
    this.initialState["max_wof"] = this.max_wof

    this.fillClientfilterData()

  }
  fillClientfilterData() {
    try {
      this.groupArr = [];
      this.clientArr = [];
      this.intRefArr = [];
      this.typeArr = [];
      this.tutelaArr = [];
      this.subtutelaArr = [];
      this.branchArr = [];
      this.territoryArr = [];
      this.zoneArr = [];

      [...new Set(this.data.map(item => item["Group"]))].filter(el => el !== '').sort().forEach(el => {
        let newObj = {
          value: el,
          checked: true
        };
        this.groupArr.push(newObj);
      });
      [...new Set(this.data.map(item => item["Client"]))].filter(el => el !== '').sort().forEach(el => {
        let newObj = {
          value: el,
          checked: true
        };
        this.clientArr.push(newObj);
      });
      [...new Set(this.data.map(item => item["Internal_J"]))].filter(el => el !== '').sort().forEach(el => {
        let newObj = {
          value: el,
          checked: true
        };
        this.intRefArr.push(newObj);
      });
      [...new Set(this.data.map(item => item["Type"]))].filter(el => el !== '').sort().forEach(el => {
        let newObj = {
          value: el,
          checked: true
        };
        this.typeArr.push(newObj);
      });
      [...new Set(this.data.map(item => item["Tutela"]))].filter(el => el !== '').sort().forEach(el => {
        let newObj = {
          value: el,
          checked: true
        };
        this.tutelaArr.push(newObj);
      });
      [...new Set(this.data.map(item => item["Subtutela"]))].filter(el => el !== '').sort().forEach(el => {
        let newObj = {
          value: el,
          checked: true
        };
        this.subtutelaArr.push(newObj);
      });
      [...new Set(this.data.map(item => item["Branch"]))].filter(el => el !== '').sort().forEach(el => {
        let newObj = {
          value: el,
          checked: true
        };
        this.branchArr.push(newObj);
      });
      [...new Set(this.data.map(item => item["Territory"]))].filter(el => el !== '').sort().forEach(el => {
        let newObj = {
          value: el,
          checked: true
        };
        this.territoryArr.push(newObj);
      });
      [...new Set(this.data.map(item => item["Zone"]))].filter(el => el !== '').sort().forEach(el => {
        let newObj = {
          value: el,
          checked: true
        };
        this.zoneArr.push(newObj);
      });

      this.SenddataToClientFilter.emit();
    } catch (error) {
      console.log(error);

    }
  }

  filterData() {
    this.clientFilters()

    this.filteredData = this.clientsfilteredData.filter((data) => ((data[this.traceKIDistance] >= this.current_min_KI && data[this.traceKIDistance] <= this.current_max_KI) &&
      (data[this.worstOfPerformance] >= this.current_min_wof && data[this.worstOfPerformance] <= this.current_max_wof))
    )
    let tempData: any
    if (this.startDate && this.maturityDate) {
      tempData = this.filteredData.filter((data) => {
        return ((new Date(data['Start_Date']) >= new Date(this.startDate)) && (new Date(data['EventDate']) <= new Date(this.maturityDate)))
      })
    } else {
      if (this.startDate) {
        tempData = this.filteredData.filter((data) => {
          return (new Date(data['Start_Date']) >= new Date(this.startDate))
        })
      }
      if (this.maturityDate) {
        tempData = this.filteredData.filter((data) => {
          return (new Date(data['EventDate']) <= new Date(this.maturityDate))
        })
      }
    }
    this.filteredData = tempData || this.filteredData;
    this.getLists()
    this.filter()
  }


  getDistinct(dataFormat){
    let distinct = new Map<string,dataType>()
    dataFormat.forEach((data)=>{
      distinct.set(data[this.ISIN],data)
    })
    dataFormat=[...distinct.values()]
    this.totalproducts = dataFormat.length
    this.sendProductTotalEvent.emit()
    // console.log(this.dataFormat.length)
  }
  
  clientFilters() {
    try {
      this.clientsfilteredData = this.data;
      let backupData = this.clientsfilteredData
      // switch (this.ClieneFilterCaseInput) {
      //   case 1:
      //     if (this.selectedGroup)
      //       this.clientsfilteredData = this.data.filter((data) => {
      //         if (JSON.stringify(data['Group']) === '{}') {
      //           return false;
      //         } else {
      //           return data['Group'].includes(this.selectedGroup)
      //         }
      //       })
      //     break;
      //   case 2:
      //     if (this.selectedClient)
      //       this.clientsfilteredData = this.data.filter((data) => {
      //         if (JSON.stringify(data['Client']) === '{}') {
      //           return false;
      //         } else {
      //           return data['Client'].includes(this.selectedClient)
      //         }
      //       })

      //     break;
      //   case 3: if (this.selectedType)
      //     this.clientsfilteredData = this.data.filter((data) => {
      //       // return (Object.keys(data['Type']).length > 0 && data['Type']?.includes(this.selectedType))
      //       if (JSON.stringify(data['Type']) === '{}') {
      //         return false;
      //       } else {
      //         return data['Type'].includes(this.selectedType)
      //       }
      //     })
      //     break;
      //   case 4:
      //     if (this.selectedTutela)
      //       this.clientsfilteredData = this.data.filter((data) => {
      //         // return (Object.keys(data['Tutela']).length > 0 && data['Tutela']?.includes(this.selectedTutela))
      //         if (JSON.stringify(data['Tutela']) === '{}') {
      //           return false;
      //         } else {
      //           return data['Tutela'].includes(this.selectedTutela)
      //         }
      //       })
      //     break;
      //   case 5:
      //     if (this.selectedSubtutela)
      //       this.clientsfilteredData = this.data.filter((data) => {
      //         //return (Object.keys(data['Subtutela']).length > 0 && data['Subtutela']?.includes(this.selectedSubtutela))
      //         if (JSON.stringify(data['Subtutela']) === '{}') {
      //           return false;
      //         } else {
      //           return data['Subtutela'].includes(this.selectedSubtutela)
      //         }
      //       })
      //     break;
      //   case 6:
      //     if (this.selectedBranch)
      //       this.clientsfilteredData = this.data.filter((data) => {
      //         // return (Object.keys(data['Branch']).length > 0 && data['Branch']?.includes(this.selectedBranch))
      //         if (JSON.stringify(data['Branch']) === '{}') {
      //           return false;
      //         } else {
      //           return data['Branch'].includes(this.selectedBranch)
      //         }
      //       })
      //     break;
      //   case 7:
      //     if (this.selectedTerritory)
      //       this.clientsfilteredData = this.data.filter((data) => {
      //         // return (Object.keys(data['Territory']).length > 0 && data['Territory']?.includes(this.selectedTerritory))
      //         if (JSON.stringify(data['Territory']) === '{}') {
      //           return false;
      //         } else {
      //           return data['Territory'].includes(this.selectedTerritory)
      //         }
      //       })
      //     break;
      //   case 8:
      //     if (this.selectedZone)
      //       this.clientsfilteredData = this.data.filter((data) => {
      //         // return (Object.keys(data['Zone']).length > 0 && data['Zone']?.includes(this.selectedZone))
      //         if (JSON.stringify(data['Zone']) === '{}') {
      //           return false;
      //         } else {
      //           return data['Zone'].includes(this.selectedZone)
      //         }
      //       })
      //     break;
      // }
      // this.data = tempdata;

      // if (this.selectedGroup!='') {
      //   backupData = backupData.filter((s: any) => s.Group.toLowerCase().includes(this.selectedGroup.toLowerCase()) )
      // }
      if (this.selectedGroup && this.selectedGroup != "") {
        if (this.selectedGroup === 'NONE') {
          this.selectedGroup = 'Group';
          backupData = [];
        }
        else {
          const groupSelArr = this.selectedGroup.split(',');
          // backupData = backupData.filter((s: any) => groupSelArr.some(group => (s.Group.toString().toLowerCase() === group.toString().toLowerCase())));
          backupData = backupData.filter((s: any) => this.binarySearch(groupSelArr, s.Group));
        }
      }

      // if (this.selectedClient!='') {
      //   backupData = backupData.filter((s: any) => s.Client.toLowerCase().includes(this.selectedClient.toLowerCase()) )
      // }
      if (this.selectedClient && this.selectedClient != "") {
        if (this.selectedClient === 'NONE') {
          this.selectedClient = 'Client';
          backupData = [];
        }
        else {
          const clientSelArr = this.selectedClient.split(',');
          // backupData = backupData.filter((s: any) => clientSelArr.some(client => (s.Client.toString().toLowerCase() === client.toString().toLowerCase())));
          backupData = backupData.filter((s: any) => this.binarySearch(clientSelArr, s.Client));
        }
      }

      // if (this.selectedIntRef!='') {
      //   backupData = backupData.filter((s: any) => s.Internal_J.toLowerCase().includes(this.selectedIntRef.toLowerCase()) )
      // }
      if (this.selectedIntRef && this.selectedIntRef != "") {
        if (this.selectedIntRef === 'NONE') {
          this.selectedIntRef = 'Internal Ref./J';
          backupData = [];
        }
        else {
          const intRefSelArr = this.selectedIntRef.split(',');
          // backupData = backupData.filter((s: any) => intRefSelArr.some(intRef => (s.Internal_J.toString().toLowerCase() === intRef.toString().toLowerCase())));
          backupData = backupData.filter((s: any) => this.binarySearch(intRefSelArr, s.Internal_J));
        }
      }

      // if (this.selectedType!='') {
      //   backupData = backupData.filter((s: any) => s.Type.toLowerCase().includes(this.selectedType.toLowerCase()) )
      // }
      if (this.selectedType && this.selectedType !== '') {
        if (this.selectedType === 'NONE') {
          this.selectedType = 'Type';
          backupData = [];
        }
        else {
          const typeSelArr = this.selectedType.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(typeSelArr, s.Type));
        }
      }

      // if (this.selectedTutela!='') {
      //   backupData = backupData.filter((s: any) => s.Tutela.toLowerCase().includes(this.selectedTutela.toLowerCase()) )
      // }
      if (this.selectedTutela && this.selectedTutela !== '') {
        if (this.selectedTutela === 'NONE') {
          this.selectedTutela = 'Tutela';
          backupData = [];
        }
        else {
          const tutelaSelArr = this.selectedTutela.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(tutelaSelArr, s.Tutela));
        }
      }

      // if (this.selectedSubtutela!='') {
      //   backupData = backupData.filter((s: any) => s.Subtutela.toLowerCase().includes(this.selectedSubtutela.toLowerCase()) )
      // }
      if (this.selectedSubtutela && this.selectedSubtutela !== '') {
        if (this.selectedSubtutela === 'NONE') {
          this.selectedSubtutela = 'Subtutela';
          backupData = [];
        }
        else {
          const subtutelaSelArr = this.selectedSubtutela.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(subtutelaSelArr, s.Subtutela));
        }
      }

      // if (this.selectedBranch!='') {
      //   backupData = backupData.filter((s: any) => s.Branch.toLowerCase().includes(this.selectedBranch.toLowerCase()) )
      // }
      if (this.selectedBranch && this.selectedBranch !== '') {
        if (this.selectedBranch === 'NONE') {
          this.selectedBranch = 'Branch';
          backupData = [];
        }
        else {
          const branchSelArr = this.selectedBranch.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(branchSelArr, s.Branch));
        }
      }

      // if (this.selectedTerritory!='') {
      //   backupData = backupData.filter((s: any) => s.Territory.toLowerCase().includes(this.selectedTerritory.toLowerCase()) )
      // }
      if (this.selectedTerritory && this.selectedTerritory !== '') {
        if (this.selectedTerritory === 'NONE') {
          this.selectedTerritory = 'Territory';
          backupData = [];
        }
        else {
          const territorySelArr = this.selectedTerritory.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(territorySelArr, s.Territory));
        }
      }

      // if (this.selectedZone!='') {
      //   backupData = backupData.filter((s: any) => s.Zone.toLowerCase().includes(this.selectedZone.toLowerCase()) )
      // }
      if (this.selectedZone && this.selectedZone !== '') {
        if (this.selectedZone === 'NONE') {
          this.selectedZone = 'Zone';
          backupData = [];
        }
        else {
          const zoneSelArr = this.selectedZone.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(zoneSelArr, s.Zone));
        }
      }
      this.clientsfilteredData = backupData;

    } catch (error) {
      console.log('Error in client Filters', error);

    }
  }

  setClientFilters(filter: string) {
    try {
      // if(filter !== "Group") {
      //   this.groupArr = [];
      //   [...new Set(this.data.map(item=>item["Group"]))].filter(el => el !== '').sort().forEach(el =>{
      //     let newObj = {
      //       value : el,
      //       checked : true
      //     };
      //     this.groupArr.push(newObj);
      //   });
      // }
      if (filter === "Group" || filter === "Type" || filter === "Tutela" || filter === "Subtutela") {
        this.clientArr = [];
        [...new Set(this.data.map(item => item["Client"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.clientArr.push(newObj);
        });
      }
      if (filter === "Group" || filter === "Type" || filter === "Tutela" || filter === "Subtutela") {
        this.intRefArr = [];
        [...new Set(this.data.map(item => item["Internal_J"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.intRefArr.push(newObj);
        });
      }
      if (filter === "Group") {
        this.typeArr = [];
        [...new Set(this.data.map(item => item["Type"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.typeArr.push(newObj);
        });
      }
      if (filter === "Group" || filter === "Type") {
        this.tutelaArr = [];
        [...new Set(this.data.map(item => item["Tutela"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.tutelaArr.push(newObj);
        });
      }
      if (filter === "Group" || filter === "Type" || filter === "Tutela") {
        this.subtutelaArr = [];
        [...new Set(this.data.map(item => item["Subtutela"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.subtutelaArr.push(newObj);
        });
      }
      if (filter === "Territory" || filter === "Zone") {
        this.branchArr = [];
        [...new Set(this.data.map(item => item["Branch"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.branchArr.push(newObj);
        });
      }
      // if(filter !== "Territory") {
      //   this.territoryArr = [];
      //   [...new Set(this.data.map(item=>item["Territory"]))].filter(el => el !== '').sort().forEach(el =>{
      //     let newObj = {
      //       value : el,
      //       checked : true
      //     };
      //     this.territoryArr.push(newObj);
      //   });
      // }
      if (filter === "Territory") {
        this.zoneArr = [];
        [...new Set(this.data.map(item => item["Zone"]))].filter(el => el !== '').sort().forEach(el => {
          let newObj = {
            value: el,
            checked: true
          };
          this.zoneArr.push(newObj);
        });
      }
      this.SenddataToClientFilter.emit();
    }
    catch (error) {

    }
  }
  binarySearch(arr: any, x: any) {
    let l = 0,
      r = arr.length - 1;
    while (l <= r) {
      let m = l + Math.floor((r - l) / 2);
      try {
        let res = x.localeCompare(arr[m]);
        if (res == 0)
          return true;
        if (res > 0)
          l = m + 1;
        else
          r = m - 1;

      } catch (error) {
        return false;
      }
    }
    return false;
  }


}
