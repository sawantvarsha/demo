import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { tickStep } from 'd3';
import { data } from 'jquery';
import { elementAt } from 'rxjs/operators';
import { ExcelService } from 'src/app/services/excel.service';
import { LCMApiService } from 'src/app/services/lcmapi.service';

@Component({
  selector: 'app-performance-timeline',
  templateUrl: './performance-timeline.component.html',
  styleUrls: ['./performance-timeline.component.scss']
})
export class PerformanceTimelineComponent implements OnInit,OnChanges {
  

  @Input() data:any;
  fromDate:any = '';
  toDate:any = '';
  isLoader = true;
  performanceTimelineData = []
  backTestNoteMasterId: any;
  templateSrNo: any;
  templateId: any;
  perfTraceMatDate : any;
  perfTraceTradeDate : any;
  backTestTemplateID: any;
  templateCode: any;
  username: any;
  sApplicationType = "EVTFIX";
  layoutStyle :string = '';
  layoutcols:14;
  colStyle = ""
  rowSize = 5;
  headerArr:any = [];
  headerKeyArr:any = [];
  keyValueMappingArr = []
  RUHDatesArr = [];
  RUHData:any = [];
  headerDetails:any = []
  headerKeyMapping:any = [];
  isReduced: boolean = true;
  excelData:any = [];
  isEmpty:boolean=false;
  selectDate(date) {
    try {
      return this.datepipe.transform(date, 'dd-MMM-yyyy');
    } catch (error) {
      
    }
  }

  constructor(public datepipe: DatePipe, private lcmapi: LCMApiService, public excelservice: ExcelService,) { }

  async ngOnInit() {
    console.log('temp init', this.data);
    this.backTestNoteMasterId = this.data["Note_Master_ID"];
    this.backTestTemplateID = this.data["Template_ID"];
    await this.getStaticData();
    this.loadTimeline()
    // await this.GetRUHData();
    // await this.GetTemplateapplicationLayoutMapping();
    // await this.GetUDFData();
  }
  ngOnChanges(){
    console.log('temp change', this.data);
  }

  async getStaticData() {
    try {
      await this.lcmapi.GetStaticData(this.backTestNoteMasterId).then(async (data) => {
        this.templateSrNo = data.GetStaticDataResult[0].Template_Sr_No;
        this.templateSrNo = this.templateSrNo.toString();
        this.backTestTemplateID = data.GetStaticDataResult[0].Template_ID;
        this.backTestTemplateID = this.backTestTemplateID.toString();
        this.templateCode = data.GetStaticDataResult[0].Template_Code;
        this.username = data.GetStaticDataResult[0].TM_AppUserName;
        console.log('templateSrNo', this.templateSrNo);
        await this.GetTradeMaturityDateTrace();
      });
    } catch (error) {
    }
  }
  async GetTradeMaturityDateTrace() {
    try {
      await this.lcmapi.Get_Trade_Maturity_Date_Trace(this.backTestNoteMasterId, this.templateSrNo, this.backTestTemplateID)
      .then((data) => {
        this.perfTraceMatDate = data.Get_Trade_Maturity_Date_TraceResult[0].Maturity_Date.split(' ')[0];
        this.perfTraceMatDate = this.datepipe.transform(this.perfTraceMatDate, 'dd-MMM-yyyy');
        this.toDate = this.perfTraceMatDate;
        this.perfTraceTradeDate = data.Get_Trade_Maturity_Date_TraceResult[0].Trade_Date.split(' ')[0];
        this.perfTraceTradeDate = this.datepipe.transform(this.perfTraceTradeDate, 'dd-MMM-yyyy');
        this.fromDate = this.perfTraceTradeDate;
        console.log('perf dates', this.perfTraceMatDate,this.perfTraceTradeDate);
      });
    } catch (error) {
    }
  }
  async GetRUHDates() {
    try {
      this.lcmapi.Get_RUHDates(this.backTestNoteMasterId, this.backTestTemplateID, this.templateSrNo, this.fromDate, this.toDate, this.isReduced).then(async(data)=>{
        console.log('RUH dates ', data);
        if(data.Get_RUHDatesResult){

          this.RUHDatesArr = data.Get_RUHDatesResult;
          await this.GetTemplateapplicationLayoutMapping();
        }
        else{
          this.isEmpty = true;
          this.isLoader = false;
        }
        
      });
    } catch (error) {
    }
  }

  async GetRUHData(){
    await this.lcmapi.Get_RUH_Data(this.backTestNoteMasterId, this.backTestTemplateID, this.templateSrNo, this.perfTraceTradeDate, this.perfTraceMatDate, this.isReduced).then(data=>{
      if(data.Get_RUH_DataResult){
        this.RUHData =  Array.from(
          new Set(data.Get_RUH_DataResult.map((object)=>JSON.stringify(object)))
        ).map((x:any) => JSON.parse(x))
      }
      else{
        this.isEmpty = true;
        this.isLoader = false;
      }
      
      
      console.log('RUHData ', this.RUHData);

    })
  }
  
  
  GetUDFData() {
    try {
      // this.username = sessionStorage.getItem('Username');
      this.lcmapi.Get_UDFData(this.templateCode, parseInt(this.templateSrNo), this.username).then((data) => {
        console.log('UDF data ', data);
        
      });
    } catch (error) {

    }
  }
  async GetTemplateapplicationLayoutMapping(){
    try{
      await this.lcmapi.GetTemplateapplicationLayoutMapping(this.backTestTemplateID, this.sApplicationType).then(data=>{
        console.log('GetTemplateapplicationLayoutMapping ', data);
        this.layoutStyle = data['GetTemplateapplicationLayoutMappingResult'][0].LayoutStyle;
        this.layoutcols = data['GetTemplateapplicationLayoutMappingResult'][0].ColSize;
       
        this.rowSize = data['GetTemplateapplicationLayoutMappingResult'][0].RowSize;
        this.colStyle = "2fr 2fr repeat(" + (this.layoutcols-2)+", 1fr);"

        this.Get_LayoutSequence();
      });
    }
    catch(error){
    }
  }
  setGrid(){
    return '2.4fr 2fr 1fr 2fr repeat('+(
      this.layoutcols-4)+', 1fr)';

  }

  exportToExcel() {
    let dataList = [];
    let headers = ['Date'];
    this.headerArr.forEach(element => {
      headers.push(element.Field_Display_Name)
    });
    this.excelData.forEach((data)=>{
      let dataFormatted = {}
      headers.forEach((element, i) => {
        dataFormatted[element] = i === 0 ? data[i] : data[i].RUH_Rule_Result;
      });
      dataList.push(dataFormatted)
    })

    console.log('excel=', dataList);
    
  
    if(dataList.length > 0){

      let today = new Date();
      this.excelservice.exportAsExcelFile(
        dataList,
        'performance_timeline_' + today.toString()
      );
    }
  }
  async Get_LayoutSequence(){
    try{
      this.lcmapi.Get_LayoutSequence(this.backTestTemplateID, '', this.sApplicationType, this.layoutStyle).then(async (data)=>{
        if(data.Get_LayoutSequenceResult){
          this.headerArr = data.Get_LayoutSequenceResult.filter(element => {
            return element.Index_Coordinates === "EVTFIX_Header";
          }).sort((a,b)=>a.REPORT_SEQUENCE < b.REPORT_SEQUENCE);

          this.headerArr.forEach(element => {
            if(['Initial Price', 'Fixing Price', 'Performance','MTM (N/S)'].includes(element.Field_Display_Name))
            {
              element["alignment"] = 'right';
            }
            else
            element["alignment"] = 'left';
          });
          console.log("headerarr", this.headerArr);
          this.headerKeyArr = data.Get_LayoutSequenceResult.filter(element => {
            return element.Index_Coordinates === "EVTFIX";
          }).sort((a,b)=>a.REPORT_SEQUENCE < b.REPORT_SEQUENCE);
          

          this.headerKeyArr.forEach(e=>{
            e['header'] = this.headerArr.filter(i=>{return i.REPORT_SEQUENCE === Math.floor((e.REPORT_SEQUENCE - 1)/this.rowSize) + 1})[0]
          })

          console.log("headerarr", this.headerKeyArr);
          await this.GetRUHData()
          this.RUHDatesArr.forEach(date=>{
            let matrix: any[][] = new Array(this.rowSize)
              .fill('')
              .map(() => new Array(this.layoutcols+1).fill(''));



            this.headerKeyArr.forEach((item) => {
              let x = this.RUHData?.filter(d => { return d.RUH_Schedule_Date === date.RUH_Schedule_Date && d.RUH_Target_Field === item.Field_Name })[0];
              if(x ) {
                console.log(x);
                x["header"] = item?.header;
                matrix[Math.floor(item.REPORT_SEQUENCE - 1) % this.rowSize][Math.floor((item.REPORT_SEQUENCE - 1) / this.rowSize +1)] = x
                matrix[Math.floor(item.REPORT_SEQUENCE - 1) % this.rowSize][0] = x.RUH_Schedule_Date 
              }
            })

            matrix.forEach(e=>{this.excelData.push(e)});
            date["records"] = matrix; 

          })
          this.isLoader = false;
          
          console.log("records ", this.RUHDatesArr);
        }
      })
    }
    catch(error){
    }
  }

  reset(){
    this.isLoader = true;
    this.RUHData = [];
    this.RUHDatesArr = [];
    this.headerArr = [];
    this.headerKeyArr = [];
    this.headerKeyMapping = [];
  }

  async loadTimeline(){
    this.reset();
    await this.GetRUHDates();
  }

  toggleDataView(){
    this.isReduced = !this.isReduced;
    this.loadTimeline()
  }


  async dateChanged(){
    this.loadTimeline()
  }

  alignContent(col){
    
    if(col && col != '')
      return col.header.alignment;
  }
}
