import { Component, OnInit, Input,ViewChild, TemplateRef, ElementRef, Output,EventEmitter } from '@angular/core';
// import { AuthenticationService } from '../../../../_services';
// import { User } from '../../../../_models/user';
import { ApifunctionService } from '../../../services/apifunction.service';
import { DatePipe } from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { ExcelService } from 'src/app/components/ucp/services/UCPSharedControls/Controls/excel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import * as XLSX from 'xlsx';
import { DIR_DOCUMENT_FACTORY } from '@angular/cdk/bidi/dir-document-token';
const moment =  _moment;
enum Status {
  Success = 1,
  Fail = 0
}


@Component({
  selector: 'app-ucp-product-schedule-mutation',
  templateUrl: './ucp-product-schedule-mutation.component.html',
  styleUrls: ['./ucp-product-schedule-mutation.component.scss'],
  providers: [DatePipe]
})
export class UcpProductScheduleMutationComponent implements OnInit {

  @Input() oUCPAppTablesData: any;
  @Input() sUCPMode: string;
  @Input() iTemplateID: string;
  @Input() entityId: string;
  @Input() iNoteMasterID: string;
  @Input() oldSchdeule:any;
  @Output() GetProductSchedule = new EventEmitter < any > ();

  loginId: string;
  // currentUser: User;
  oProdSchedule:any[]=[];
  dtfiltereddata:any[]=[];
  toDate:any={fieldName: "toDate", value: "", readOnly: ""};
  fromDate:any={fieldName: "fromDate", value: "", readOnly: ""};
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Fixing', 'Settlement', 'StartDate', 'EndDate'];  
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  pageSizeVal:number=10;
  distinct_codes=[];
  TSM_code:string = "";
  Show_processed:boolean=false;
  loader:boolean=false;
  lblErrorMessage:string="";
  fileUploaded: File;
  worksheet: any;
  importJSON:any;
  mutatingFields: any;
  mutatingSchedule: any;
  subcodes: any;
  mutationCodes: any;
  allMutationCodes: any;
  dateChanged: boolean;

  constructor(private api: ApifunctionService, private datePipe: DatePipe,private excelService: ExcelService,private _snackBar: MatSnackBar) {
    // authenticationService.currentUser.subscribe(x => this.currentUser = x);
     this.loginId =  sessionStorage.getItem('FinIQUserID') ? sessionStorage.getItem('FinIQUserID') : 'Ketan_Dealer';
  }

  ngOnInit(): void {
    try{
      console.log("inside product mutation schedule", this.oUCPAppTablesData)
      this.GetMutatingFields();
      this.GetMutationHistory();
      this.GetMutationCodesAndSubcodes();
      
    }
    catch(e){
      console.log("Error in ngOnInit :", e)
    }
  }

  GetMutatingFields() {
    try{
      this.api.GetMutatingFields(this.iTemplateID).then(
        async (response: any) => {
          if (response.status === Status.Success) {
            const res = response.response;
            this.mutatingFields = res;
          }
      })
    }
    catch(e){
      console.log(e);
    }
  }

  GetMutationHistory() {
    try{
      this.api.GetMutationHistory(this.iNoteMasterID).then(
        async (response: any) => {
          if (response.status === Status.Success) {
            const res = response.response;
            this.mutatingSchedule = res;
          }
      })
    }
    catch(e){
      console.log(e);
    }
  }

  GetMutationCodesAndSubcodes() {
    try{
      this.api.GetTemplate_Schedule_SubCodes(this.iTemplateID).then(
        async (response: any) => {
          if (response.status === Status.Success) {
            const res = response.response;
            this.subcodes = res;
            const uniqueCodes = [...new Set(this.subcodes.map(item => item.TSS_ParentCode))];
            this.api.Get_Mutation_Template_ScheduleCodes(this.iTemplateID).then(
              async (response: any) => {
                if (response.status === Status.Success) {
                  var res = response.response;
                  this.allMutationCodes = res;
                  res = res.filter(e => uniqueCodes.toString().includes(e.TSM_ScheduleCode));
                  this.mutationCodes = res;
                  console.log("mutationCodes: ", this.mutationCodes)
                  this.GetProductScheduleDetails();
                }
            })
          }
      })
    }
    catch(e){
      console.log(e);
    }
  }


  GetProductScheduleDetails(){
    try {
      //few initialization service calls
      this.selection.clear();
      this.dataSource = new MatTableDataSource();
      this.paginator.hidePageSize=true;
      this.oldSchdeule?this.oProdSchedule=this.oldSchdeule:this.oProdSchedule=[];
      this.dateChanged = false;      
      this.fillgrid()
    } catch (error) {
      
    }
  }

  async fillgrid(){
    try 
    { 
      //this.lblErrorMessage="";
      switch(this.sUCPMode.toUpperCase())
      {
        case "UCPQEN":
            if (this.oProdSchedule.length>0) //if data already present
            {
              //Sorting data in ascending order as per fixing date 
              
              // Used moment in below code by OnkarE 
              this.oProdSchedule=this.oProdSchedule.sort((a,b)=> {    
                return  moment(a.pS_Fixing_Date,"DD-MM-YYYY").diff(moment(b.pS_Fixing_Date,"DD-MM-YYYY"))                         
               }); // Added by OnkarE
               
               if(this.distinct_codes.length==0)
               {
                this.loadfiltervalues();
               }

               this.dtfiltereddata=this.filterData(this.oProdSchedule);
               this.dataSource.data=this.dtfiltereddata;
               this.dataSource.paginator = this.paginator;
               this.GetProductSchedule.emit(this.oProdSchedule);

            }

            else //for onload and refresh condition when data not present
            { 
              let response: any;
              this.loader=true;                    
              response = await this.api.GetProductSchedule(Number(this.iTemplateID), "", this.oUCPAppTablesData, true,this.oProdSchedule , false, "", Number(this.entityId), this.sUCPMode, this.iNoteMasterID ? Number(this.iNoteMasterID) : 0, this.loginId)
             if (response.status === Status.Success) {
                 const res = response.response;				
                 if (res) {
                    this.oProdSchedule=res;
                    if (this.oProdSchedule.length>0)
                    {
                      // Used moment in below code by OnkarE 
                      this.oProdSchedule=this.oProdSchedule.sort((a,b)=> {                        
                        return  moment(a.pS_Fixing_Date,"DD-MM-YYYY").diff(moment(b.pS_Fixing_Date,"DD-MM-YYYY"))              
                      }); // Added by OnkarE
                      this.loadfiltervalues();                      
                      for (let i=0;i<this.oProdSchedule.length;i++){
                        this.oProdSchedule[i].Sr_No=String(i);
                      }
                      this.oProdSchedule.map(i=>{i.Fixing={ fieldName: i.Sr_No, id:"Fixing", value: moment(i.pS_Fixing_Date,"DD-MM-YYYY").format("DD-MMM-YYYY"), readOnly: "" },i.Settlement= { fieldName: i.Sr_No, id:"Settlement", value: moment(i.pS_Settlement_Date,"DD-MM-YYYY").format("DD-MMM-YYYY"), readOnly: "" }}); //for keeping it in sync with date control // Added by OnkarE
                      this.oProdSchedule.forEach(element => {
                        element.pS_Fixing_Date = moment(element.pS_Fixing_Date,"DD-MM-YYYY").format("DD-MMM-YYYY")
                        element.pS_Settlement_Date = moment(element.pS_Settlement_Date,"DD-MM-YYYY").format("DD-MMM-YYYY")
                      }); // Added by OnkarE

                      console.log("Product Sched final data:",this.oProdSchedule);
                      this.dtfiltereddata=this.filterData(this.oProdSchedule);
                      this.dataSource.data=this.dtfiltereddata;
                      this.dataSource.paginator = this.paginator;
                      this.loader=false;
                      this.GetProductSchedule.emit(this.oProdSchedule);
                    }                    
                }
              }
              else{
                this.lblErrorMessage=response.response;
                this.loader=false;
                this.GetProductSchedule.emit(this.oProdSchedule); 
              }

            }
          
          break;
        case "UCPWFL":
          // if (this.oProdSchedule.length>0) //if data already present
          // {
          //   //Sorting data in ascending order as per fixing date
          //   // Used moment in below code by OnkarE 
          //   this.oProdSchedule=this.oProdSchedule.sort((a,b)=> {                        
          //     return  moment(a.pS_Fixing_Date,"DD-MM-YYYY").diff(moment(b.pS_Fixing_Date,"DD-MM-YYYY"))              
          //    }); // Added by OnkarE

          //    if(this.distinct_codes.length==0) {
          //       this.loadfiltervalues();
          //     }
             
          //    this.dtfiltereddata=this.filterData(this.oProdSchedule);
          //    this.dataSource.data=this.dtfiltereddata;
          //    this.dataSource.paginator = this.paginator;
          // }
          // else
          {
              let response: any;
              this.loader=true;                    
              response = await this.api.GetProductSchedulefromDB(this.iNoteMasterID);
             if (response.status === Status.Success) {
                 const res = response.response;				
                 if (res) {
                    this.oProdSchedule=res;
                    this.dataSource.data = [];
                    if (this.oProdSchedule.length>0)
                    {
                      // Used moment in below code by OnkarE 
                      for (let k = 0; k < this.oProdSchedule.length; k++) {
                        if(moment(this.oProdSchedule[k].pS_Fixing_Date).format("MM/DD/YYYY") == "Invalid date"){
                          this.oProdSchedule[k].pS_Fixing_Date = moment(this.oProdSchedule[k].pS_Fixing_Date,"DD-MM-YYYY").format("MM/DD/YYYY")
                        }   
                        if(moment(this.oProdSchedule[k].pS_Settlement_Date).format("MM/DD/YYYY") == "Invalid date"){
                          this.oProdSchedule[k].pS_Settlement_Date = moment(this.oProdSchedule[k].pS_Settlement_Date,"DD-MM-YYYY").format("MM/DD/YYYY")
                        }                      
                      }
                      this.oProdSchedule=this.oProdSchedule.sort((a,b)=> {                        
                        return  moment(a.pS_Fixing_Date).diff(moment(b.pS_Fixing_Date))                            
                      }); // Added by OnkarE
                      this.loadfiltervalues();                      
                      for (let i=0;i<this.oProdSchedule.length;i++){
                        this.oProdSchedule[i].Sr_No=String(i);
                      }

                      this.oProdSchedule.map(i=>{i.Fixing={ fieldName: i.pS_Id, id:"Fixing", value: moment(i.pS_Fixing_Date).format("DD-MMM-YYYY"), readOnly: "Y" },
                      i.Settlement= { fieldName: i.pS_Id, id:"Settlement", value: moment(i.pS_Settlement_Date).format("DD-MMM-YYYY"), readOnly: "Y" },
                      i.StartDate= { fieldName: i.pS_Id, id:"StartDate", value: moment(i.pS_Accrual_StartDate).format("DD-MMM-YYYY"), readOnly: "Y" },
                      i.EndDate= { fieldName: i.pS_Id, id:"EndDate", value: moment(i.pS_Accrual_EndDate).format("DD-MMM-YYYY"), readOnly: "Y" }}); //for keeping it in sync with date control // Added by OnkarE
                      this.oProdSchedule.forEach(element => {
                        element.pS_Fixing_Date = moment(element.pS_Fixing_Date).format("DD-MMM-YYYY")
                        element.pS_Settlement_Date = moment(element.pS_Settlement_Date).format("DD-MMM-YYYY"),
                        element.pS_Accrual_StartDate = moment(element.pS_Accrual_StartDate).format("DD-MMM-YYYY"),
                        element.pS_Accrual_EndDate = moment(element.pS_Accrual_EndDate).format("DD-MMM-YYYY")
                      }); // Added by OnkarE

                      // const uniquePSCodes = [...new Set(this.oProdSchedule.map(item => item.PS_TSM_Code))]; 
                      // if(uniquePSCodes.length > 0){
                      //   for (let x = 0; x < uniquePSCodes.length; x++) {
                      //     var specificSch = this.oProdSchedule.filter(e=> e.PS_TSM_Code == uniquePSCodes[x]);
                      //       if(specificSch.length > 0){

                      //       }
                          
                      //   }
                      // }
                      this.oProdSchedule = this.oProdSchedule.filter(e=> e.pS_TSM_Code == this.TSM_code);
                      var specificSch = this.subcodes.filter(b=> b.TSS_ParentCode == this.TSM_code)
                      var specificTSM = this.allMutationCodes.filter(t=> t.TSM_ScheduleCode == this.TSM_code);
                      var displayVis = "YYYY";
                      if(specificTSM.length > 0){
                        displayVis = specificTSM[0].DateVisibilityYN;
                      }
                      this.displayedColumns = ['Fixing'];
                      if(displayVis.substring(2,1) == "Y"){
                        this.displayedColumns.push("Settlement");
                      }
                      if(displayVis.substring(3,2) == "Y"){
                        this.displayedColumns.push("StartDate");
                      }
                      if(displayVis.substring(4,3) == "Y"){
                        this.displayedColumns.push("EndDate");
                      }                  
                      if(specificSch.length > 0){
                        for (let x = 0; x < specificSch.length; x++) {
                          var displayName = this.oUCPAppTablesData.filter(a => a.fieldName == specificSch[x].TSS_UDF_FieldName)[0].displayName;
                          //console.log("App table field : ", specificSch[x].TSS_UDF_FieldName,  this.oUCPAppTablesData.filter(a => a.fieldName == specificSch[x].TSS_UDF_FieldName)[0])
                          //var fieldValue = this.oUCPAppTablesData.filter(a => a.fieldName == specificSch[x].TSS_UDF_FieldName)[0].currentValue;
                          var fieldFormat = this.oUCPAppTablesData.filter(a => a.fieldName == specificSch[x].TSS_UDF_FieldName)[0].udF_Format;
                          var fieldType = this.oUCPAppTablesData.filter(a => a.fieldName == specificSch[x].TSS_UDF_FieldName)[0].dataType;
                          this.displayedColumns.push(displayName);
                          for (let y = 0; y < this.oProdSchedule.length; y++) {
                            var fieldValueArr =  this.mutatingSchedule.filter(a => a.uML_UDF_Field == specificSch[x].TSS_UDF_FieldName && moment(a.uML_Mutution_Date,"MM/DD/YYYY hh:mm:ss a").format("DD-MMM-YYYY") == this.oProdSchedule[y].pS_Fixing_Date)
;                           ///console.log("Debugging: ", this.mutatingSchedule, specificSch[x].TSS_UDF_FieldName, this.oProdSchedule[y].pS_Fixing_Date, fieldValueArr, fieldValueArr)
                            var fieldValue = fieldValueArr.length > 0 ? fieldValueArr[0].uML_New_value : ""
                            if(fieldType.toUpperCase() == "AMOUNT" || fieldType.toUpperCase() == "NUMBER"){
                              this.oProdSchedule[y][displayName] = fieldValue != "" ? this.formatKLMB(fieldValue, fieldFormat) : fieldValue;
                            }
                            else {
                              this.oProdSchedule[y][displayName] = fieldValue;  
                            }
                                                 
                          }
                        }
                      }

                      console.log("Product Sched final data:",this.oProdSchedule, this.displayedColumns);
                      this.dtfiltereddata=this.filterData(this.oProdSchedule);
                      this.dataSource.data=this.dtfiltereddata;
                      this.dataSource.paginator = this.paginator;
                      this.loader=false;
                      this.GetProductSchedule.emit(this.oProdSchedule);
                    } 
                    else {
                      this.loader=false;
                      this.lblErrorMessage = "No data found."
                    }                   
                }
              }
              else{
                this.lblErrorMessage=response.response;
                this.loader=false;
                this.GetProductSchedule.emit(this.oProdSchedule); 
              }

          }

          break;
        default:
          break;         

      }

      var checkBoxArr = document.getElementsByClassName('mat-checkbox-input') as HTMLCollectionOf<HTMLElement>; 
      if(checkBoxArr && checkBoxArr.length > 0){
        for (let i = 0; i < checkBoxArr.length; i++) {
          checkBoxArr[i].style.height = '0px'
        }
      }


    } 
    catch (error) {
      this.loader=false
    }
  }
  
  formatKLMB(value: string, precision = 2) {
    try{
      value = value.replace(/,/g, '');
      if ((value.match(/([kK]{1})/g)) != null) {
        value = (parseFloat(value.replace(/[kK]/g, '')) * 1000).toFixed(precision);
      } else if ((value.match(/([lL]{1})/g)) != null) {
        value = (parseFloat(value.replace(/[lL]/g, '')) * 100000).toFixed(precision);
      } else if ((value.match(/([mM]{1})/g)) != null) {
        value = (parseFloat(value.replace(/[mM]/g, '')) * 1000000).toFixed(precision);
      } else if ((value.match(/([bB]{1})/g)) != null) {
        value = (parseFloat(value.replace(/[bB]/g, '')) * 1000000000).toFixed(precision);
      }
      if(precision == 2)
        value = parseFloat(value).toFixed(precision).replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ','); // Changed by Onkar on 14-Apr-2023
      else 
        value = parseFloat(value).toFixed(precision).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      return value;
    }
    catch(e){
      console.log("Error in formatKLMB :", e)
    }
  }

  filterData(dtprodschedule:any):any{
    try {
      let filter_dt=[];
      //to apply tsm_code filter
      (this.TSM_code!="All")?filter_dt=dtprodschedule.filter(x=>x.pS_TSM_Code==this.TSM_code):filter_dt=dtprodschedule; 
       
      //to apply processed check filter
      (this.Show_processed==true && filter_dt.length>0)?filter_dt=filter_dt.filter(x=>x.pS_Status.includes('P')):"";

      //to apply from & to date filter
      if(filter_dt.length>0 && this.fromDate.value!="" && this.toDate.value!="")
      { 
          filter_dt = filter_dt.filter(a => { 
          var date = moment(a.pS_Fixing_Date);
          return (date.diff(moment(this.fromDate.value)) >= 0 && moment(this.toDate.value).diff(date) >= 0);
        }); // Added by OnkarE
      }

      console.log("Filtered dt",filter_dt);
      return filter_dt;

    } catch (error) {
      
    }
  }

  // assigndatatotable(dtProdschedule:any){
  //   try {
  //     this.dataSource.data=dtProdschedule;
  //     this.dataSource.paginator = this.paginator;
  //   } catch (error) {
      
  //   }
  // }

  FilterDatechanged(datecontrol:any){
    try {
      this.lblErrorMessage="";
      this.dateChanged = true;
      console.log("control received",datecontrol);
      if (moment(this.fromDate.value).diff(moment(this.toDate.value)) > 0 ){
           this.lblErrorMessage="From Date cannot be greater than To Date."
           return;
      } // Added by OnkarE
      
      this.fillgrid();      
    } catch (error) {
      
    }
  }

  Griddatechanged(datecontrol:any){
    try {
     if(this.sUCPMode.toUpperCase()=="UCPQEN")
     {
       let field = this.oProdSchedule.filter(x=>x.Sr_No==datecontrol.fieldName)[0];
       datecontrol.id=="Fixing"?field.pS_Fixing_Date=datecontrol.value:field.pS_Settlement_Date=datecontrol.value;
     } 
     else
     {
      let field = this.oProdSchedule.filter(x=>x.pS_Id==datecontrol.fieldName)[0];
      datecontrol.id=="Fixing"?field.pS_Fixing_Date=datecontrol.value:field.pS_Settlement_Date=datecontrol.value;
     }
      
    //  this.oProdSchedule=this.oProdSchedule.sort((a,b)=> {                        
    //   return  Date.parse(new Date(a.pS_Fixing_Date).toDateString()) - Date.parse(new Date(b.pS_Fixing_Date).toDateString());                        
    //   }); 
     
     this.fillgrid();
    } catch (error) {
      
    }
  }

  ddlTSM_codeschange(){
    try {      
      this.selection.clear();
      this.lblErrorMessage = "";
      this.fillgrid();
    } catch (error) {
      
    }

  }

  async btnDelete_Row(){
    try {
      let ProdDeleteArr: any[];
      let response:any;      
      ProdDeleteArr = this.selection.selected;
      this.lblErrorMessage = "";
      if (ProdDeleteArr.length>0){
        switch(this.sUCPMode.toUpperCase()){

          case "UCPQEN":
            ProdDeleteArr.forEach(row => {
              this.oProdSchedule.splice(this.oProdSchedule.indexOf(row),1);
            });
            console.log("Product Schedule after row deletion",this.oProdSchedule);
            //this.FilterDatechanged(null);
            (this.oProdSchedule.length>0)?this.fillgrid():this.dataSource.data=[];            
            break;

          case "UCPWFL":
            let dtProdSched_del=this.CreateProdSchedDataContract(ProdDeleteArr);
            /////////service call & other changes remain
            response = await this.api.InsertProdSchedule(this.iNoteMasterID, JSON.stringify(dtProdSched_del), this.loginId, "DELETE", "")
            if(response.status === Status.Success)
            {
              const res = response.response;				
              if (res)
             {
              this.oProdSchedule=[];
              this.lblErrorMessage="Record(s) deleted successfully."
             }
             else
             {
               this.lblErrorMessage="Error occured while deleting Record(s)."
             }
             this.fillgrid();
            }
            
            break;
          default:
            break;   
        }
        
        this.selection.clear();
      }      
      else{
        this.lblErrorMessage="No record(s) selected. Please select a record";
      }

      
    } catch (error) {
      
    }
  }
  
  Load_Click(){
    try{
      this.selection.clear();
      this.oProdSchedule=[];
      this.distinct_codes=[];
      this.Show_processed=false;
      //this.fileUpload.nativeElement.value = '';
      this.lblErrorMessage = "";
      this.ngOnInit();
    }
    catch(e){
      console.log("Error in Load_Click :", e)
    }
  }

   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    try{
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      //const page = this.dataSource.paginator.pageSize;
      return numSelected === numRows;    
    }
    catch(e){
      console.log("Error in isAllSelected :", e)
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    try{
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
      }
      catch(e){
        console.log("Error in masterToggle :", e)
      }
        //this.selection.clear() : this.selectRows();
  }

  selectRows() {   
    try{ 
      for (let index = 0; index < this.dataSource.paginator.pageSize; index++) {
        this.selection.select(this.dataSource.data[index]);
        //this.selectionAmount = this.selection.selected.length;
      }
    }
    catch(e){
      console.log("Error in selectRows :", e)
    }
  }

  rowsperpage(rows: number) {
    try{
      if (rows.toString() != "") {
        this.dataSource.paginator.pageSize = rows;
        this.paginator._changePageSize(this.dataSource.paginator.pageSize);
      }
    }
    catch(e){
      console.log("Error in rowsperpage :", e)
    }
  }

  exportToExcel() {
    try{
      let tempJSON: any = [];
      let exportJSON: any[] = [];    
      this.lblErrorMessage = "";
      tempJSON = this.dataSource.data;    
      for (let i = 0; i < tempJSON.length; i++) {
        exportJSON.push({        
          'Fixing': moment(tempJSON[i].pS_Fixing_Date).format("DD-MMM-YYYY").toString(),
          'Settlement':moment(tempJSON[i].pS_Settlement_Date).format("DD-MMM-YYYY").toString(),
          'Schedule_Code':tempJSON[i].pS_TSM_Code        
        });
      };

      this.excelService.exportAsExcelFile(exportJSON, "ProductSchedule_"+this.iTemplateID+"_"+moment(new Date()).format("DD-MM-YYYY HH:mm:ss"));
      this._snackBar.open("File exported successfully", "", {
        duration: 3000
      });
    }
    catch(e){
      console.log("Error in exportToExcel :", e)
    }
  }

  Process_Toggle(){
    try {
      this.selection.clear();
      this.lblErrorMessage ="";
      this.fillgrid();
    } catch (error) {
      
    }
  }

  onImportClick(evt){
    try {
      let data, header;
      this.lblErrorMessage = "";
      const target: DataTransfer = <DataTransfer>(evt.target);
      let isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
      if (target.files.length > 1) {
        this.fileUpload.nativeElement.value = '';
      }
      if (isExcelFile) {
        
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
  
          /* grab first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  
          /* save data */
          data = XLSX.utils.sheet_to_json(ws, {raw: false});
        };
  
        reader.readAsBinaryString(target.files[0]);
  
        reader.onloadend = (e) => {          
          //this.keys = Object.keys(data[0]);
          console.log("Import data",data, e); 
          if (data.length <= 0) {
            this._snackBar.open("Import file is blank.", "", {
              duration: 5000
            });
            return false;
          }
          
          this.readAsJson(data)

        }
      } 

      else {
        this.fileUpload.nativeElement.value = '';
        this._snackBar.open("Import file is not in correct format.", "", {
          duration: 5000
        });
        return false;
      } 
    } 
    catch (error) {
      
    }
  }
 

  async readAsJson(data:any){
    try {      
       
      let tempJSON=[];
      let import_TSMcodes=[];
      let max = this.sUCPMode.toUpperCase()=="UCPQEN" ? Math.max.apply(Math, this.oProdSchedule.map(function(o) { return o.Sr_No; })) : 0;
      for(let i=0;i<data.length;i++)
      {
        if(data[i].Fixing=="" || data[i].Settlement==""){  //as of now only blank date validation added will add other validations later
          this.lblErrorMessage="Date format not supported. Please check and try again."
          break;
        }
        if(data[i].Schedule_Code.trim()==""){
          this.lblErrorMessage="Schdeule code is blank. Please check uploaded file."
          break;
        }
        tempJSON.push({
          'pS_Fixing_Date':data[i].Fixing,
          'pS_Settlement_Date':data[i].Settlement,
          'pS_TSM_Code':data[i].Schedule_Code,
          'pS_TSM_Id': 0,
          'pS_NM_Id' : this.iNoteMasterID,
          'pS_Accrual_StartDate':   moment(new Date()),
          'pS_Accrual_EndDate' :  moment(new Date()),
          'pS_Message_Format' : "",
          'pS_Created_AT' : moment(new Date()),
          'pS_Created_By' : "",
          'pS_Updated_AT' : moment(new Date()),
          'pS_Updated_By' : this.loginId,
          'pS_Active_YN'  : "",
          'pS_Remark'     : "",
          'pS_Id'         : 0,
          'pS_Misc1'      : "",
          'pS_Misc2'      : "",
          'pS_Misc3'      : "",
          'pS_Status'     : "",
          'Sr_No'         : (this.sUCPMode.toUpperCase()=="UCPQEN"?String(max+i+1):String(i))          
        }); 
        if(import_TSMcodes.indexOf(data[i].Schedule_Code)==-1 && data[i].Schedule_Code!=""){ //push distinct elements in the array
          import_TSMcodes.push(data[i].Schedule_Code);
        }

      } 
        
        if(tempJSON.length==data.length)
        {
          this.importJSON=tempJSON;      
          
          switch(this.sUCPMode.toUpperCase())
          {
           case "UCPQEN":
            this.importJSON.map(i=>{i.Fixing={ fieldName: i.Sr_No, id:"Fixing", value: moment(i.pS_Fixing_Date,"DD-MMM-YYYY").format("DD-MMM-YYYY"), readOnly: "" },i.Settlement= { fieldName: i.Sr_No, id:"Settlement", value: moment(i.pS_Settlement_Date,"DD-MMM-YYYY").format("DD-MMM-YYYY"), readOnly: "" }}); //for keeping it in sync with date control // Added by OnkarE
            import_TSMcodes.forEach(code=>{
            this.oProdSchedule=this.oProdSchedule.filter(x=>!x.pS_TSM_Code.includes(code));
            });
            this.oProdSchedule.push(...this.importJSON);
            console.log("Final product Schedule after import",this.oProdSchedule);
            this._snackBar.open("File Imported Successfully...", "", {
            duration: 5000
            });            
             break;
           case "UCPWFL":
            this.importJSON.map(i=>{i.Fixing={ fieldName: i.Sr_No, id:"Fixing", value: moment(i.pS_Fixing_Date).format("DD-MMM-YYYY"), readOnly: "" },i.Settlement= { fieldName: i.Sr_No, id:"Settlement", value: moment(i.pS_Settlement_Date).format("DD-MMM-YYYY"), readOnly: "" }}); //for keeping it in sync with date control // Added by OnkarE
            import_TSMcodes.forEach(code=>{
            this.oProdSchedule=this.oProdSchedule.filter(x=>!x.pS_TSM_Code.includes(code));
            });
            this.oProdSchedule.push(...this.importJSON);
            console.log("Final product Schedule after import",this.oProdSchedule);
            let dtProdSched=this.CreateProdSchedDataContract(this.oProdSchedule);
              ///to be coded need to give service calls for import

             let response:any;
             response = await this.api.InsertProdSchedule(this.iNoteMasterID, JSON.stringify(dtProdSched), this.loginId, "IMPORT", "")
            if(response.status === Status.Success)
            {
              const res = response.response;				
              if (res)
             {
              this.oProdSchedule=[];
              this.lblErrorMessage="Record(s) imported successfully."
             }
             else
             {
               this.lblErrorMessage="Error occured while importing Record(s)."
             }
             //this.fillgrid();
            }
             break;  
           default:
             break;
         }
         this.fillgrid();
         this.fileUpload.nativeElement.value = '';
        }
        else{
          this.importJSON=[];
        }
               
    } catch (error) {
      
    }
  }

  CreateProdSchedDataContract(dtSchedule:any):any{
    let dtProdschedule=[];
    try {
      if(dtSchedule.length>0){
        for(let i=0;i<dtSchedule.length;i++){        
         dtProdschedule.push({
          'PS_Fixing_Date':moment(dtSchedule[i].pS_Fixing_Date).format("MM-DD-YYYY HH:mm:ss"),
          'PS_Settlement_Date':moment(dtSchedule[i].pS_Settlement_Date).format("MM-DD-YYYY HH:mm:ss"),
          'PS_TSM_Code':dtSchedule[i].pS_TSM_Code,
          'PS_TSM_Id': dtSchedule[i].pS_TSM_Id,
          'PS_NM_Id' :dtSchedule[i].pS_NM_Id,
          'PS_Accrual_StartDate':   moment(dtSchedule[i].pS_Accrual_StartDate).format("MM-DD-YYYY HH:mm:ss"),
          'PS_Accrual_EndDate' :   moment(dtSchedule[i].pS_Accrual_EndDate).format("MM-DD-YYYY HH:mm:ss"),
          'PS_Message_Format' : dtSchedule[i].pS_Message_Format,
          'PS_Created_AT' :  moment(dtSchedule[i].pS_Created_AT).format("MM-DD-YYYY HH:mm:ss"),
          'PS_Created_By' : dtSchedule[i].pS_Created_By,
          'PS_Updated_AT' : moment(new Date()).format("MM-DD-YYYY HH:mm:ss"),
          'PS_Updated_By' : this.loginId,
          'PS_Active_YN'  : dtSchedule[i].pS_Active_YN,
          'PS_Remark'     : dtSchedule[i].pS_Remark,
          'PS_Id'         : dtSchedule[i].pS_Id,
          'PS_Misc1'      : dtSchedule[i].pS_Misc1,
          'PS_Misc2'      : dtSchedule[i].pS_Misc2,
          'PS_Misc3'      : dtSchedule[i].pS_Misc3,
          'PS_Status'     : dtSchedule[i].pS_Status
        });// Added moment changes by OnkarE
       }       
      }
      console.log("Data contract of Product schedule",dtProdschedule);
      return dtProdschedule;

      
    } catch (error) {
      
    }
  }

 async btnSave_click()
  {
    try 
    {
      this.lblErrorMessage = "";
      if (this.oProdSchedule.length>0)
      {
        let dtProdSched=this.CreateProdSchedDataContract(this.oProdSchedule);
        ////service call & other related changes pending for WFL mode.
        let response:any;
        response = await this.api.InsertProdSchedule(this.iNoteMasterID, JSON.stringify(dtProdSched), this.loginId, "UPDATE", "")
            if(response.status === Status.Success)
            {
              const res = response.response;				
              if (res)
             {
              this.oProdSchedule=[];
              this.lblErrorMessage="Record(s) saved successfully."
             }
             else
             {
               this.lblErrorMessage="Error occured while saving Record(s)."
             }
             //this.fillgrid();
            }
      }
    } 
    catch (error) 
    {
      
    }
  }

  loadfiltervalues()
  {
    try 
    {
      this.oProdSchedule.forEach(element=>{
        if(this.distinct_codes.indexOf(element.pS_TSM_Code)==-1){ //push distinct elements in the array
          this.distinct_codes.push(element.pS_TSM_Code);
        }
     });
     if(this.TSM_code == "")
       this.TSM_code = this.distinct_codes.length > 0 ? this.distinct_codes[0] : "";
    //  this.distinct_codes.sort((a,b)=>{
    //    return a.localeCompare(b);
    //  });
    //  this.distinct_codes.unshift("All");  
    //  this.TSM_code="All";   
     console.log("Distinct schedule codes",this.distinct_codes);  
     console.log("loadfiltervalues: ",this.fromDate, this.toDate);        
     if(this.dateChanged == false){
      this.fromDate=this.oProdSchedule[0];
      this.fromDate.fieldName= "fromDate"
      this.fromDate.value= moment(this.oProdSchedule[0].pS_Fixing_Date).format("DD-MMM-YYYY") === this.oProdSchedule[0].pS_Fixing_Date ? this.oProdSchedule[0].pS_Fixing_Date : moment(this.oProdSchedule[0].pS_Fixing_Date).format("DD-MMM-YYYY")  // Added by OnkarE
      this.toDate=this.oProdSchedule[this.oProdSchedule.length-1];
      this.toDate.value= moment(this.oProdSchedule[this.oProdSchedule.length-1].pS_Fixing_Date).format("DD-MMM-YYYY") === this.oProdSchedule[this.oProdSchedule.length-1].pS_Fixing_Date ? this.oProdSchedule[this.oProdSchedule.length-1].pS_Fixing_Date : moment(this.oProdSchedule[this.oProdSchedule.length-1].pS_Fixing_Date).format("DD-MMM-YYYY");  // Added by OnkarE
      this.toDate.fieldName= "toDate"
     }
     else {
      console.log("loadfiltervalues: ",this.fromDate, this.toDate);
     }        
     
    } 
    catch (error) 
    {
      
    }
  }

}
