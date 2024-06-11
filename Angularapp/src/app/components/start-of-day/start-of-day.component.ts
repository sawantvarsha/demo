import { Component, OnInit, ElementRef  } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Chart, registerables } from 'chart.js';
import { ExcelService } from '../euroconnect/services/excel.service';
import { SpInteractiveDataService } from 'src/app/services/sp-interactive-data.service';
import { ChartService } from 'src/app/themeService/chart.service';

const $: any = require('jquery');
@Component({
  selector: 'app-start-of-day',
  templateUrl: './start-of-day.component.html',
  styleUrls: ['./start-of-day.component.scss'],
})
export class StartOfDayComponent implements OnInit {
  asseturl = environment.asseturl;
  constructor(private elementRef: ElementRef,public excelService: ExcelService,private intDashboard: SpInteractiveDataService, private readonly chartService: ChartService) {}

  KIBarrierData: object[] = [];
  AutocallData: object[] = [];
  CouponMaturityData: object[] = [];
  superData: object = {};
  selectedCard: string = '';
  chartData: any;
  doughnutData: DoughnutChartData[] = [];
  prevDoughPart: string = '';
  KIPercentage:string = '10';
  AutocallPercentage:string = '5';
  CouponMaturityDays:string = '10';
  colors: any;
  loader: boolean = true;
  showFilterDropdown: boolean = false;
  groupArr: any = [];
  clientArr: any = [];
  intRefArr: any = [];
  typeArr: any = [];
  tutelaArr: any = [];
  subtutelaArr: any = [];
  branchArr: any = [];
  territoryArr: any = [];
  zoneArr: any = [];
  selectedGroup:any = '';
  selectedClient:any = '';
  selectedIntRef:any = '';
  selectedType:any = '';
  selectedTutela:any = '';
  selectedSubtutela:any = '';
  selectedBranch:any = '';
  selectedTerritory:any = '';
  selectedZone:any = '';
  filterData:any;
  productDetails:any;

   ngOnInit(): void {
    try {      
      
      setTimeout(async () => {

        this.KIBarrierData = await this.intDashboard.GetInteractivedata({TemplateCode: "USP_SOTD_KI_Distance_EQ_Structures",FromDate: "01-Jan-17",ToDate: "31-Dec-30",WhereClause: this.KIPercentage.toString()});   
        this.AutocallData = await this.intDashboard.GetInteractivedata({TemplateCode: "USP_SOTD_KO_Distance_EQ_Structures",FromDate: "01-Jan-17",ToDate: "31-Dec-30",WhereClause: this.AutocallPercentage.toString()});
        this.CouponMaturityData = await this.intDashboard.GetInteractivedata({TemplateCode: "USP_SOTD_CouponMaturity_EQ_Structures",FromDate: "01-Jan-17",ToDate: "31-Dec-30",WhereClause: this.CouponMaturityDays.toString()});
        this.chartService.paletteEmitObs.subscribe((paletteres) => {
          if (!!paletteres) {
            let pallete = this.chartService.getPallete(paletteres);
            this.colors = pallete.colors
            this.TileSelected(this.selectedCard || 'tile-1');
          }
        });
        this.TileSelected('tile-1');
        this.loader = false;
      });

    } catch (error) {
      
    }

  }

  TileSelected(id: string, evt?) {
    try {
      let targetElement = $(evt?.target);
      if((evt?.target?.localName === 'input' || targetElement?.parents(`div#${id}`)) && this.selectedCard === id) {
        return;
      }
      this.loader = true;
      setTimeout(() => {
        this.selectedCard = id.trim() || 'tile-1';
        this.clearClient();
        this.filterData = this.superData[this.selectedCard]
        this.GenerateDoughData(this.selectedCard);
        this.loader = false;
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  fillFilterDropdown(){
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
      [...new Set(this.superData[this.selectedCard].map(item=>item["Group"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.groupArr.push(newObj);
      });
      [...new Set(this.superData[this.selectedCard].map(item=>item["Client"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.clientArr.push(newObj);
      });
      [...new Set(this.superData[this.selectedCard].map(item => item["Internal_J"]))].filter(el => el !== '').sort().forEach(el => {
        let newObj = {
          value: el,
          checked: true
        };
        this.intRefArr.push(newObj);
      });
      [...new Set(this.superData[this.selectedCard].map(item=>item["Type"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.typeArr.push(newObj);
      });
      [...new Set(this.superData[this.selectedCard].map(item=>item["Tutela"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.tutelaArr.push(newObj);
      });
      [...new Set(this.superData[this.selectedCard].map(item=>item["Subtutela"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.subtutelaArr.push(newObj);
      });
      [...new Set(this.superData[this.selectedCard].map(item=>item["Branch"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.branchArr.push(newObj);
      });
      [...new Set(this.superData[this.selectedCard].map(item=>item["Territory"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.territoryArr.push(newObj);
      });
      [...new Set(this.superData[this.selectedCard].map(item=>item["Zone"]))].filter(el => el !== '').sort().forEach(el =>{
        let newObj = {
          value : el,
          checked : true
        };
        this.zoneArr.push(newObj);
      });
    } catch (error) {
      
    }
  }

  async getProductDetails(){
    try {
      this.loader = true;
      let InteractiveData = {
        tempCode:'',
        _where:''
      };
      switch (this.selectedCard) {
        case 'tile-1':
          this.KIPercentage?.toString().trim() ?? (this.KIPercentage = '10');           
          InteractiveData.tempCode = "USP_SOTD_KI_Distance_EQ_Structures"
          InteractiveData._where = this.KIPercentage;
          this.KIBarrierData = await this.intDashboard.GetInteractivedata({TemplateCode: InteractiveData.tempCode,FromDate: "01-Jan-17",ToDate: "31-Dec-30",WhereClause: InteractiveData._where?.toString()});
        break;

        case 'tile-2':
          this.AutocallPercentage?.toString().trim() ?? (this.AutocallPercentage = '5');
          InteractiveData.tempCode = "USP_SOTD_KO_Distance_EQ_Structures"
          InteractiveData._where = this.AutocallPercentage;
          this.AutocallData = await this.intDashboard.GetInteractivedata({TemplateCode: InteractiveData.tempCode,FromDate: "01-Jan-17",ToDate: "31-Dec-30",WhereClause: InteractiveData._where?.toString()});
        break;
        
        case 'tile-3':
          this.CouponMaturityDays?.toString().trim() ?? (this.CouponMaturityDays = '10');
          InteractiveData.tempCode = "USP_SOTD_CouponMaturity_EQ_Structures"
          InteractiveData._where = this.CouponMaturityDays;
          this.CouponMaturityData = await this.intDashboard.GetInteractivedata({TemplateCode: InteractiveData.tempCode,FromDate: "01-Jan-17",ToDate: "31-Dec-30",WhereClause: InteractiveData._where?.toString()});
        break;
      
        default:
          break;
      }
      this.ResetSuperData();
      this.filterData = this.superData[this.selectedCard]
      this.ClientFilters();
      await this.GenerateDoughData(this.selectedCard);
      this.loader = false;
    } catch (error) {
      
    }
  }

  equivalentEURNotional(id: string){
    try {
      const num = this.superData[id]?.reduce((acc,currObj)=>{
        return acc + Number(currObj.EURNominal);
      },0)  
      const map = [
        { suffix: 'T', threshold: 1e12 },
        { suffix: 'B', threshold: 1e9 },
        { suffix: 'M', threshold: 1e6 },
        { suffix: 'K', threshold: 1e3 },
        { suffix: '', threshold: 1 },
      ]; 
      const MatchedNum = map.find((x) => Math.abs(num) >= x.threshold);
      if (MatchedNum) {
        const formatted = (num / MatchedNum.threshold).toFixed(2) + MatchedNum.suffix;
        return formatted;
      } 
      return num;
    } catch (error) {
      console.log(error);
    }
  }

  FormatNotional(Notional: number){
    try {
      const formattedNotinal = Notional.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return formattedNotinal;
    } catch (error) {
      
    }
  }

  sortDoughData(doughnutData){
    try {
      return Object.keys(doughnutData).sort((a, b) => doughnutData[b] - doughnutData[a]).reduce((acc, cur) => {
        acc[cur] = doughnutData[cur]
        return acc      
      }, {})
    } catch (error) {
      
    }
  }
  GenerateDoughData(tileId: string = 'tile-1'){
    try {
      this.chartData?.destroy();
      let doughnutData = {};
      this.superData[tileId].map((ele, idx) => {
        ++doughnutData[ele["PayOff"]] || (doughnutData[ele["PayOff"]] = 1);
      });
      const result = this.sortDoughData(doughnutData);
      doughnutData = result;      
      let chartRef = this.elementRef.nativeElement.querySelector("#doughnutChart");
          this.chartData = new Chart(chartRef, {
            type: 'doughnut',
            data: {
              labels: Object.keys(doughnutData),
              datasets: [
                {
                  // label: 'Notional by Payoff',
                  data: Object.values(doughnutData),
                  backgroundColor: this.colors,
                  borderColor: this.colors,
                  borderWidth: 0,
                  hoverOffset:10,
                  spacing:1,
                },
              ],
            },
            options: {
              maintainAspectRatio: false,
              cutout: '60%',
              radius: '90%',
              onClick:(e, elements, chart) => {
                let selectedindex = elements[0].index
                let selectedPayOff = Object.keys(doughnutData)[selectedindex]
                this.DoughnutCallback(selectedPayOff)
              },
              plugins: {
                legend: {
                  title: {
                    display: true,
                    color: 'rgb(227, 228, 230)',
                    position: 'start',
                    font: {
                      size: 16,
                    },
                  },
                  onClick:(e, elements, chart) => {
                    let selectedPayOff = elements.text
                    this.DoughnutCallback(selectedPayOff)
                  },
                  position: 'bottom',
      
                  labels: {
                    font: {
                      size: 13,
                    },
                    color: 'rgb(148, 148, 148)',
                    usePointStyle: true,
                  },
                },
                datalabels: {
                  display: false,
                },
              },
              layout: {
                padding: 40,
              },
            },
          });
    } catch (error) {
      console.log(error);
    }
  }

  DoughnutCallback(evt) {
    try {
      if((this.selectedGroup || this.selectedClient || this.selectedIntRef || this.selectedType || this.selectedTutela || this.selectedSubtutela || this.selectedBranch || this.selectedTerritory || this.selectedZone) != ''){
        this.superData[this.selectedCard] = this.productDetails
      }else{
        this.ResetSuperData();
      }
      if(this.prevDoughPart !== evt){
        this.prevDoughPart = evt;
        Object.keys(this.superData).forEach((key, idx) => {
          this.superData[key] = this.superData[key].filter(obj => (obj.PayOff === (evt)));
        })
      } else {
        this.prevDoughPart = '';
      }
    } catch (error) {
      console.log(error);
    }
  }

  ResetSuperData() {
    try {
      this.superData["tile-1"] = [...this.KIBarrierData];
      this.superData["tile-2"] = [...this.AutocallData];
      this.superData["tile-3"] = [...this.CouponMaturityData];
    } catch (error) {
      console.log(error);
    }
  }

  exportToExcel(){
    try {
      const exportToExcelData = this.superData[this.selectedCard];
      this.excelService.exportAsExcelFile(this.getExcelData(exportToExcelData), 'StartOfTheDay');
    } catch (error) {
      
    }
  }

  getExcelData(ExcelData){
    try {
      const exlDataCopy = [];
      let obj;
      ExcelData.forEach(item => {
        obj = {};
        obj["Product"] = item["Product_Name"];
        obj["PayOff"] = item["PayOff"];
        obj["Currency"] = item["Currency"];
        obj["Notional"] = item["Nominal_Amount"];
        exlDataCopy.push(obj);
      });
      return exlDataCopy;
    } catch (error) {
      
    }
  }

  ClientFilters(event?: KeyboardEvent){
    try { 
      this.productDetails = this.filterData;
      let backupData = this.productDetails;
      if (this.selectedGroup != "") {
        if(this.selectedGroup === 'NONE'){
          this.selectedGroup = 'Group';
          backupData = [];
        }
        else{
          const groupSelArr = this.selectedGroup.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(groupSelArr, s.Group));
        }
      }
      if (this.selectedClient != "") {
        if(this.selectedClient === 'NONE'){
          this.selectedClient = 'Client';
          backupData = [];
        }
        else{
          const clientSelArr = this.selectedClient.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(clientSelArr, s.Client));
        }
      }
      if (this.selectedIntRef != "") {
        if(this.selectedIntRef === 'NONE'){
          this.selectedIntRef = 'Internal Ref./J';
          backupData = [];
        }
        else{
          const intRefSelArr = this.selectedIntRef.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(intRefSelArr, s.Internal_J));
        }
      }
      if (this.selectedType !== '') {
        if(this.selectedType === 'NONE'){
          this.selectedType = 'Type';
          backupData = [];
        }
        else{
          const typeSelArr = this.selectedType.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(typeSelArr, s.Type));
        }
      }
      if (this.selectedTutela !== '' ) {
        if(this.selectedTutela === 'NONE'){
          this.selectedTutela = 'Tutela';
          backupData = [];
        }
        else{
          const tutelaSelArr = this.selectedTutela.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(tutelaSelArr, s.Tutela));
        }
      }
      if (this.selectedSubtutela !== '') {
        if(this.selectedSubtutela === 'NONE'){
          this.selectedSubtutela = 'Subtutela';
          backupData = [];
        }
        else{
          const subtutelaSelArr = this.selectedSubtutela.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(subtutelaSelArr, s.Subtutela));
        }
      }
      if (this.selectedBranch !== '') {
        if(this.selectedBranch === 'NONE'){
          this.selectedBranch = 'Branch';
          backupData = [];
        }
        else{
          const branchSelArr = this.selectedBranch.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(branchSelArr, s.Branch));
        }
      }
      if (this.selectedTerritory !== '') {
        if(this.selectedTerritory === 'NONE'){
          this.selectedTerritory = 'Territory';
          backupData = [];
        }
        else{
          const territorySelArr = this.selectedTerritory.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(territorySelArr, s.Territory));
        }
      }
      if (this.selectedZone !== '') {
        if(this.selectedZone === 'NONE'){
          this.selectedZone = 'Zone';
          backupData = [];
        }
        else{
          const zoneSelArr = this.selectedZone.split(',');
          backupData = backupData.filter((s: any) => this.binarySearch(zoneSelArr, s.Zone));
        }
      }
      this.productDetails = backupData
      this.superData[this.selectedCard] = this.productDetails
      
      // this.GenerateDoughData(this.selectedCard);
            
    } catch (error) {
      console.log(error.message);
      
    }
  }

  binarySearch(arr: any, x: any) {
    let l = 0,
    r = arr.length - 1;
    while (l <= r) {
      let m = l + Math.floor((r - l) / 2);
      let res = x.localeCompare(arr[m]);
      if (res == 0)
          return true;
      if (res > 0)
          l = m + 1;
      else
          r = m - 1;
    }
    return false;
  }

  ProdDetailsTitle(): string {
    try {
      switch (this.selectedCard) {
        case 'tile-1':
          return `Protection in ${this.KIPercentage || ""}%`;
          break;

        case 'tile-2':
          return `Autocall in ${this.AutocallPercentage || ""}%`;
          break;

        case 'tile-3':
          return `Coupon & Maturity in ${this.CouponMaturityDays || ""} days`;
          break;
      
        default:
          break;

        return "";
      }
    } catch (error) {
      console.log(error);
    }
  }

  clearClient() {
    try {
      this.selectedGroup='';
      this.selectedIntRef='';
      this.selectedClient = '';
      this.selectedType= '';
      this.selectedTutela= '';
      this.selectedSubtutela= '';
      this.selectedBranch= '';
      this.selectedTerritory= '';
      this.selectedZone= '';
      this.ResetSuperData();
      this.fillFilterDropdown();
    } catch (error) {
      
    }
  }

  clientFilterData(event){
    try{
      switch(event[0].split(':')[0]){
        case 'Group':
          this.selectedGroup = event[0].split(':')[1];
          this.selectedType = '';
          this.selectedTutela = '';
          this.selectedSubtutela = '';
          this.selectedClient = '';
          this.selectedIntRef = '';
          break;
        case 'Client':
          this.selectedClient = event[0].split(':')[1];
          break;
        case 'Internal Ref./J':
          this.selectedIntRef = event[0].split(':')[1];
          break;
        case 'Type':
          this.selectedType = event[0].split(':')[1];
          this.selectedTutela = '';
          this.selectedSubtutela = '';
          this.selectedClient = '';
          this.selectedIntRef = '';
          break;
        case 'Tutela':
          this.selectedTutela = event[0].split(':')[1];
          this.selectedSubtutela = '';
          this.selectedClient = '';
          this.selectedIntRef = '';
          break;
        case 'Subtutela':
          this.selectedSubtutela = event[0].split(':')[1];
          this.selectedClient = '';
          this.selectedIntRef = '';
          break;
        case 'Branch':
          this.selectedBranch = event[0].split(':')[1];
          break;
        case 'Territory':
          this.selectedTerritory = event[0].split(':')[1];
          this.selectedZone = '';
          this.selectedBranch = '';
          break;
        case 'Zone':
          this.selectedZone = event[0].split(':')[1];
          this.selectedBranch = '';
          break;
        default:
          break;
      }
      this.ClientFilters();
      this.setClientFilters(event[0].split(':')[0]);
      this.GenerateDoughData(this.selectedCard);
      // this.clearClientFilter = false;
    }
    catch(er){

    }
  }

  setClientFilters(filter: string){
    try{
      if(filter === "Group" || filter === "Type"  || filter === "Tutela" || filter === "Subtutela") {
        this.clientArr = [];
        [...new Set(this.productDetails.map(item=>item["Client"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.clientArr.push(newObj);
        });
      }
      if(filter === "Group" || filter === "Type"  || filter === "Tutela" || filter === "Subtutela") {
        this.intRefArr = [];
        [...new Set(this.productDetails.map(item=>item["Internal_J"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.intRefArr.push(newObj);
        });
      }
      if(filter === "Group") {
        this.typeArr = [];
        [...new Set(this.productDetails.map(item=>item["Type"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.typeArr.push(newObj);
        });
      }
      if(filter === "Group" || filter === "Type" ) {
        this.tutelaArr = [];
        [...new Set(this.productDetails.map(item=>item["Tutela"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.tutelaArr.push(newObj);
        });
      }
      if(filter === "Group" || filter === "Type"  || filter === "Tutela") {
        this.subtutelaArr = [];
        [...new Set(this.productDetails.map(item=>item["Subtutela"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.subtutelaArr.push(newObj);
        });
      }
      if(filter === "Territory" || filter === "Zone") {
        this.branchArr = [];
        [...new Set(this.productDetails.map(item=>item["Branch"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.branchArr.push(newObj);
        });
      }
      if(filter === "Territory") {
        this.zoneArr = [];
        [...new Set(this.productDetails.map(item=>item["Zone"]))].filter(el => el !== '').sort().forEach(el =>{
          let newObj = {
            value : el,
            checked : true
          };
          this.zoneArr.push(newObj);
        });
      }
    }
    catch(error){

    }
  }

  setSortingDirection(header:string,elem:string){
    try {
      let order = (<HTMLInputElement>document.querySelector(`.tblProdDetails .${header}`)).dataset.order;
      let id = document.getElementById(elem);
      if(order === 'desc')
      {
        id.style.setProperty('cursor', 'pointer');
        id.style.setProperty('transition', 'transform 0.5s');
        id.style.setProperty('-webkit-transform', 'scaleY(-1)');
        id.style.setProperty('color', 'var(--headers) !important');
      }
      else{
        id.style.setProperty('cursor', 'pointer');
        id.style.setProperty('transition', 'transform 0.5s');
        id.style.setProperty('-webkit-transform', 'scaleY(1)');
        id.style.setProperty('color', 'var(--headers) !important');
      }
    } catch (error) {
      
    }
  }

}

export interface DoughnutChartData {
  title: string,
  value: number
}