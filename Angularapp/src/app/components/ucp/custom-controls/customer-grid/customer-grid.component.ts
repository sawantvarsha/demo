import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-grid',
  templateUrl: './customer-grid.component.html',
  styleUrls: ['./customer-grid.component.css']
})
export class CustomerGridComponent implements OnInit {
  @Input() index: number;
  @Input() row: any;
  @Input() dropdowns: any;
  @Input() searchArrays: any;
  @Input() shareArray: any;
  @Input() selectedBookingModel: any;
  @Input() template: any;
  @Input() sUCPMode: any;
  @Input() parentCustGridLength: Number; // Added by OnkarE on 06-May-2023
  @Output() removeRow = new EventEmitter<any>();
  @Output() checkResponse = new EventEmitter<any>();
  @Output() CustomerGridChangeChange = new EventEmitter<any>();
  @Output() GetCustomerId = new EventEmitter<any>();
  
  @Input()
  set draftcheck(value: any) {
    console.log(value);
    this.ValidateData();
  }

  data: any;
  ErrorMessage: any;
  disabled: boolean =  false;
  row_type:string="";
  btnPooltext:string="-"; //Added by Devesh on 6-April-2022
  btnPoolReadonly:boolean;
  constructor( private elemRef: ElementRef, private ref: ChangeDetectorRef) {
    // this.data = this.row.filter((ele)=> ele.visible === 'Y')
   }

  ngOnInit() {
    try{
      this.data = this.row
      // this.data.forEach(element => {
      //   if(element.columnName=="clmnCustomerLeg"){
      //     (element.value=="CounterParty"?this.row_type="Market":this.row_type="Client")
      //   }
      // });
      // .filter((ele)=> ele.visible === 'Y');
      console.log('Customer Grid with data', this.index, this.parentCustGridLength, this.data );
      //commented by devesh and add in below switch case on 6-April-2022
      // if(this.sUCPMode === 'UCPWFL'){ 
      //   this.disabled = true; /// Added by OnkarE on 15-Feb-2021 to disable '-' button in UCPWFL mode
      // } 
      switch(this.sUCPMode.toUpperCase()) //as per dotnet code
      {
        case "DLSADD":
        case "RECADD":
          if(Number(this.index) > Number(this.parentCustGridLength)){ // Added this condition by OnkarE on 06-May-2023
            this.disabled = false;
          }
          else {
            this.disabled = true;
          }
          break;
        case "UCPUNW":
        case "UCPREV":
        case "UNWFUL":
        if (this.data.filter(c=>c.columnName == 'clmnCustomerLeg')[0].value.toUpperCase() == "CUSTOMER" && this.data.filter(c=>c.columnName == "Order_Status")[0].value.toUpperCase() == "UNWIND" )
          {
            //dgvCustCpty.Rows(iCustCnt).Enabled = False        
          }
        else if (this.data.filter(c=>c.columnName == "Parent_Deal_ID")[0].value == "" && this.data.filter(c=>c.columnName == 'clmnCustomerLeg')[0].value.toUpperCase() == "CUSTOMER" )
        {
          // TryCast(dgvCustCpty.Rows(iCustCnt).FindControl("clmnCustomerName"), UCP_CounterParty_Client).CustomereEnabled = False
          // For iColCnt = 1 To dgvCustCpty.Columns.Count - 1
          //     dgvCustCpty.Rows(iCustCnt).Cells(iColCnt).Enabled = False
          // Next
          this.btnPoolReadonly = false;
          this.btnPooltext = "+";
        }        
        else if (this.data.filter(c=>c.columnName=="clmnCustomerLeg")[0].value.toUpperCase() == "COUNTERPARTY")
        {
          this.btnPoolReadonly = true;
          this.btnPooltext="";        
        }
          break;
        case "UNWAMD":
          break;  
        case "UCPWFL":
          this.disabled = true; /// Added by OnkarE on 15-Feb-2021 to disable '-' button in UCPWFL mode
          break;
        default:
          break; 
      } 
    }
    catch(e){
      console.log("Error in ngOnInit :", e)
    }
  }


  async CustomTabChange(control: any) {
    try{
      this.CustomerGridChangeChange.emit(control);
    }
    catch(e){
      console.log("Error in CustomTabChange :", e)
    }
  }
  
  async CustomerGridValueChange(control: any) {
    try{
      console.log("this is grid change in customer grid template.........", control);
      // this.CustomerGridChangeChange.emit(control);
      this.CustomerGridChangeChange.emit({field_element:control,index:this.index});
      if (control.columnName =='clmnCustomerName')
      {
        this.GetCustomerId.emit({name:control.value,row_index:this.index});
      }
    }
    catch(e){
      console.log("Error in CustomerGridValueChange :", e)
    }

  }

  setrow_type(input){
    try{
      (input=="CounterParty"?this.row_type="Market":this.row_type="Client");
    }
    catch(e){
      console.log("Error in CustomerGridValueChange :", e)
    }
  }

  decTableRowCount_confirmpopup(){
    try{
      if(confirm("Are you sure you want to remove "+this.row_type+" leg.")) {
      this.decTableRowCount();
      }
    }
    catch(e){
      console.log("Error in CustomerGridValueChange :", e)
    }
  }

  btn_pool_add_remove() //Added for other modes apart from ucpqen and ucpwfl like ucpunwind, ucprev,etc
  {
    try
    {
      this.removeRow.emit({index:this.index,btn_text:this.btnPooltext});
    }
    catch(err)
    {
      console.error("Error in btn_pool_add_remove: ", err);
    }
  }
  decTableRowCount() {
    // console.log(this.data);
    try{
      this.removeRow.emit({index:this.index,btn_text:""}); //changes done by Devesh on 6-April-2022 for handling other mdes 
    }
    catch(e){
      console.log("Error in decTableRowCount :", e)
    }
  }
  deleteRow() {
    try{
      this.data.splice(this.index, 1);
    }
    catch(e){
      console.log("Error in deleteRow :", e)
    }
  }
  ValidateData(): boolean {
    try{
      if (!this.data) {
        return false;
      }
      let strMandate = '';

      this.data.filter((c: any) => c.mandatory === 'Y' && c.value !== undefined).forEach((control: any) => {
        if (control !== null) {
          this.elemRef.nativeElement.querySelector('#' + control.fieldName).style.borderColor = 'white';
        }
      });

      this.data.filter((c: any) => c.mandatory === 'Y' && (c.value === undefined || c.value.trim() === '')).forEach((control: any) => {
        this.elemRef.nativeElement.querySelector('#' + control.fieldName).style.borderColor = 'red';
        strMandate = strMandate + control.displayName + ', ';
      });

      if (strMandate) {
        this.ErrorMessage = 'Error or Blank value in mandatory field(s) : ' + strMandate.slice(0, -2) + '.';
        console.log(this.ErrorMessage);
        this.checkResponse.emit('Error');
        return false;
      } else {
        this.checkResponse.emit('OK');
        this.ErrorMessage = '';
        return true;
      }
    }
    catch(e){
      console.log("Error in ValidateData :", e)
    }
  }
  

}
