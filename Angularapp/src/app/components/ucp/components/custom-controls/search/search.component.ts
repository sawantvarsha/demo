import { Component, OnInit, Inject, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApifunctionService } from 'src/app/components/ucp/services/apifunction.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  styles: [
    `
      mat-form-field {
        width: var(--width) !important;
      }
    `
  ]
})
export class SearchComponent implements OnInit {

  @Input() input: any;
  @Input() searchArr: any;
  @Input() disabled = false;
  @Input() TabFlag: any;
  @Input() width: any;
  @Input() Multi_UCP: any;
  @Output() selectedSearchVal = new EventEmitter<string>();

  constructor(private http: HttpClient, private api: ApifunctionService) {
    
   }
  custflag:Boolean = false;
  selectedInput:Boolean = false;
  searchText: any;
  functionParameters: any[] = [];
  functions: any[] = [];
  controls: any;
  searchRes: any;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  displayName: any;
  ngOnInit() {
    // this.width = this.width + " !important";
    try{
      this.displayName = this.input.displayName;
      if(this.Multi_UCP === true || this.Multi_UCP === 'true')
        this.Multi_UCP = true;
      else 
        this.Multi_UCP = false;
      console.log("Applied width is::: ", this.width, this.Multi_UCP);
      if(this.TabFlag === true){
        this.displayName = "";
      }
    }
    catch(e){
      console.log("Error in ngOnInit :", e)
    }
  }

  onCustSearchChange(searchValue: string, control:any, searchArr:any) {
    try{
      console.log(searchValue, searchArr, control);
      // this.custflag = false;
      this.searchText = searchValue;
      // if(this.searchText.length >= 2){
        this.custflag = true;
        setTimeout( () => { 
          var tbody = document.getElementsByClassName("TableCustomerSearchResult_new")[0].querySelector('tr:nth-child(2)');
          tbody.classList.add('selectedCust');

        }, 50);
        
      // }
      if(searchValue == ""){
        this.custflag = false;
      }
    }
    catch(e){
      console.log("Error in onCustSearchChange :", e)
    }
  }

  onCustChange(event: { keyCode: number; }){
    try{
      var selected = document.getElementsByClassName("selectedCust")[0];
      var tbody = document.getElementsByClassName("TableCustomerSearchResult_new")[0];
      var gridName = document.getElementsByClassName("Grid")[0];
      if (event.keyCode == 38) {
        selected.classList.remove("selectedCust");
          if (selected.previousSibling.previousSibling.previousSibling == null) {
              tbody.querySelector('tr:last-child').classList.add("selectedCust");
              gridName.scrollTop = 0;
          } else {
            selected.previousElementSibling.classList.add("selectedCust");
              var scrollTP = gridName.scrollTop;
              gridName.scrollTop = scrollTP - 13;
          }
      }
      else if (event.keyCode == 40) {
        selected.classList.remove("selectedCust");
          if (selected.nextElementSibling == null) {
              tbody.querySelector("tr:nth-child(2)").classList.add("selectedCust");
              gridName.scrollTop = 0;
          } else {
              selected.classList.remove("selectedCust");
              selected.nextElementSibling.classList.add("selectedCust");
              var scrollTP1 =gridName.scrollTop;
              gridName.scrollTop = scrollTP1 + 13;
          }
      }
      else if (event.keyCode == 13) {
        console.log(this.input)
          if(this.input.dataType === 'SHARE'){
            this.searchRes = document.getElementsByClassName("selectedCust")[0].childNodes[0].textContent;
          }
          else if(this.input.dataType === 'CURRENCY' || this.input.dataType === 'CURRENCY PAIR'){
            this.searchRes = document.getElementsByClassName("selectedCust")[0].childNodes[1].textContent;
          }
          else {
            this.searchRes = document.getElementsByClassName("selectedCust")[0].childNodes[2].textContent;
          }
          this.custflag = false;
          this.selectedInput = true;
          console.log("Enter event....", event, this.input);
          this.testChange(this.input)
      }
      else if (event.keyCode == 27) {
          this.custflag = false;
      }
      else if (event.keyCode == 16) {
          this.custflag = false;
      }
      else if (event.keyCode == 9) {
          this.custflag = false;
      }
    }
    catch(e){
      console.log("Error in onCustChange :", e)
    }
  }

  onClickRow(cust){
    try{
      console.log("Clicked on share picker share selection", cust, this.input);
      if(this.input.dataType == 'SHARE'){
        this.searchRes = cust.id;    }
      else {
        this.searchRes = cust.code;    }
    
      this.custflag = false;
      this.selectedInput = true;
      this.testChange(this.input)
    }
    catch(e){
      console.log("Error in onClickRow :", e)
    }
    //this.udfFieldValueChange(this.input)
  }

  CloseTable(event){
    try{
      console.log("Closing the table.......................................", event);
      this.custflag = false;
    }
    catch(e){
      console.log("Error in CloseTable :", e)
    }
  }
  testChange(control: any){
    console.log("Changing search functions...... ", control, this.input)
    try{
      if(this.TabFlag === true){
        control.displayName = this.input.displayName;
        if(control.hasOwnProperty('columnName')){
          this.CustomerGridValueChange(control);
        }
        else{
          this.udfFieldValueChange(control); 
        }
      }
      else
        this.udfFieldValueChange(control);
    }
    catch(e){
      console.log("Error in testChange :", e)
    }
  }
  CustomerGridValueChange(control: any){
    try{
      if(this.selectedInput === true) {
        console.log("The search component in customer grid emits the control with ddetails are: ", control, this.searchRes);
        control.value = this.searchRes;
        this.selectedSearchVal.emit(control);
      }
    }
    catch(e){
      console.log("Error in CustomerGridValueChange :", e)
    }
  }
  udfFieldValueChange(control: any) {
    try{
      if(this.selectedInput === true) {
        console.log("The search component emits the control with ddetails are: ", control, this.searchRes);
        control.value = this.searchRes;
        this.selectedSearchVal.emit(control);
      }
    }
    catch(e){
      console.log("Error in udfFieldValueChange :", e)
    }
    // if (this.functionParameters.includes(control.fieldName)) {
    //   const functionsOnChangedControl = this.functions['FUNCTION'].filter(f => f.ufD_CSV_Input.split('~').includes(control.fieldName));
    //   console.log(functionsOnChangedControl);
    //   this.executeFunction(functionsOnChangedControl);
    // }
  }
  customTabFieldValueChange(control: any) {
    try{
      if(this.selectedInput === true) {
        console.log("The search component emits the control with in Custom Tab are: ", control, this.searchRes);
        control.value = this.searchRes;
        this.selectedSearchVal.emit(control);
      }
    }
    catch(e){
      console.log("Error in customTabFieldValueChange :", e)
    }
  }
  executeFunction(functions: any[]) {
    try{
      const that = this;
      functions.forEach((func: any) => {
        const TargetControl: any = this.controls.filter((c: any) => c.fieldName === func.ufD_Target_Field);
        const params: any[] = this.controls.filter((c: any) => func.ufD_CSV_Input.split('~').includes(c.fieldName));
        const funcName = func.ufD_Function_Name;
        const dbName = func.ufD_DB_Name;
        const outputForm = func.ufD_Function_Output_Form;
        let csvFunctionParameter = '';
        const blnValuesAvailableCheck = true;
        params.forEach(p => {
          console.log(p)
          let controlValue = '';
          // if (p.value && blnValuesAvailableCheck) {
          // switch (p.dataType) {
          //   case 'AMOUNT':
          //     controlValue = p.value ? (p.value.includes(',') ? p.value.replace(/,/g, '') : this.formatKLMB(p.value).replace(/,/g, '')) : '0';
          //     break;
          //   default:
          //     break;
          // }
          csvFunctionParameter += (csvFunctionParameter.length ? ',\'' : '\'') + controlValue + '\'';
          // } else {
          //   blnValuesAvailableCheck = false;
          // }
        });
        // csvFunctionParameter = '\'' + csvFunctionParameter + '\'';
        console.log(csvFunctionParameter);
        if (blnValuesAvailableCheck) {
          this.http.post('api/UCPControlService/ExecuteFunction', {
            FunctionName: funcName,
            DBName: dbName,
            FunctionOutputForm: outputForm,
            Parameters: csvFunctionParameter
          }, { headers: this.headerOptions }).subscribe((res: any) => {
            if (res) {
              // console.log(TargetControl, res, that.formatKLMB(res.DocumentElement.DUMMY.Column1));
              // TargetControl.forEach(tc => tc.value = that.formatKLMB(res.DocumentElement.DUMMY.Column1));
            }
          });
        }
      });
    }
    catch(e){
      console.log("Error in executeFunction :", e)
    }
  }

}
