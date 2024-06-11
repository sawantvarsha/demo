import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef, OnChanges } from '@angular/core';

@Component({
  selector: 'app-custom-tabs-row',
  templateUrl: './custom-tabs-row.component.html',
  styleUrls: ['./custom-tabs-row.component.css']
})
export class CustomTabsRowComponent implements OnInit {

  @Input() index: number;
  @Input() row: string;
  @Input() dropdowns: any;
  @Input() searchArrays: any;
  @Input() shareArray: any;
  @Input() CustomTabs: any;
  @Input() sUCPMode: any;
  @Output() removeRow = new EventEmitter<any>();
  @Output() checkResponse = new EventEmitter<any>();
  @Output() CustomTabChangeChange = new EventEmitter<any>();
  
  @Input()
  set draftcheck(value: any) {
    console.log(value);
    this.ValidateData();
  }

  data: any;
  ErrorMessage: any;
  disabled: boolean =  false;

  constructor( private elemRef: ElementRef, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    // console.log('Custom tab', this.dropdowns);
    try{
      this.data = this.row;
    }
    catch(e){
      console.log("Error in ngOnInit :", e)
    }
  }

  ngOnChanges() {
    try{
      this.data = this.row;
      console.log("Input CustomTabs ", this.CustomTabs);
      // this.customTabFlag = true;
      if(this.sUCPMode === 'UCPWFL' || this.sUCPMode === 'DLSADD'){ // Modified this by OnkarE on 06-May-2023
        this.disabled = true;  /// Added by OnkarE on 15-Feb-2021 to disable '-' button in UCPWFL mode
      }
    }
    catch(e){
      console.log("Error in ngOnChanges :", e)
    }
    // this.doSomething(this.CustomTabs);
  }

  async customTabFieldValueChange(control: any) {
    try{
      this.CustomTabChangeChange.emit({field_element:control,index:this.index});
    }
    catch(e){
      console.log("Error in customTabFieldValueChange :", e)
    }
  }
 
  decTableRowCount() {
    // console.log(this.data);
    try{
      this.removeRow.emit(this.index);
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
      console.log("Error in decTableRowCount :", e)
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

  checkUDFVisibility(control){ //added by Devesh because td was taking space even if visibility was N
    try 
    {
      if(control.visibility=='Y' || control.visibility=='') 
			{
					// return {
					// 	'display': 'block'						
					// }
			}
			else
			{
					return {
					'display': 'none'
				}
			}
    } 
    catch (error) {
    }
  }
}
