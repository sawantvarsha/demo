import { Component, OnInit, Input, Output, EventEmitter, NgModule } from '@angular/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import * as _moment from 'moment';
const moment =  _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-customer-grid-field-templates',
  templateUrl: './customer-grid-field-templates.component.html',
  styleUrls: ['./customer-grid-field-templates.component.css'],
  styles: [
    `
    mat-form-field {
        width: var(--appliedWidth) !important;
      }
    `
  ]
})
export class CustomerGridFieldTemplatesComponent implements OnInit {

  @Input() control: any;
  @Input() dropdowns: any;
  @Input() searchArrays: any;
  @Input() shareArray: any;
  @Input() ColSize: number;
  @Input() RowSize: number;
  @Input() index: number;
  @Input() template: any;
  @Input() selectedBookingModel: any;
  @Input() sUCPMode: any;
  @Output() CustomerGridChangeChange = new EventEmitter<any>();
  @Output() Row_type=new EventEmitter<any>();
  appliedWidth: string;

  custGridFlag: any;
  custLegVal: string;
  custLegTypeDD: Array<{ fieldName: string, displayName: string }> = [];
  dtBSDirectionClient: Array<{ fieldName: string, displayName: string }> = [];
  dtBSDirectionMarket:  Array<{ fieldName: string, displayName: string }> = [];
  BSDirectionDD:  Array<{ fieldName: string, displayName: string }> = [];
  // custLegTypeDD: { fieldName: string, displayName: string }[] = [];
  // mandatoryImageUrl = require('../../../../assets/mandatory.png');
  constructor() { }

  ngOnInit() {
    try{
      this.custGridFlag = true;
      this.custLegTypeDD = [];
      this.control.type = this.control.type.toUpperCase();

      if (this.control.type === "AMOUNT" || this.control.type === "NUMBER") {
        this.control.value = this.formatNumber(this.control);
      }

    console.log("customer Grid Component is loading... ", this.control.displayName, this.control, this.index, this.dropdowns);

      if(this.sUCPMode.toUpperCase() === 'UCPWFL'){
        /// Added this by OnkarE on 17-Dec-2021 to apply Deal Details properties in UCPWFL mode
        //Added by RajeshC || 09-Mar
        if (this.control.type.toUpperCase() == 'DATETIME' || this.control.type.toUpperCase() == 'DATE'){
          if(moment(this.control.defaultValue, "DD-MMM-YYYY hh:mm:ss n").format("DD-MMM-YYYY") == 'Invalid date' ){
            this.control.defaultValue = moment(this.control.defaultValue).format("DD-MMM-YYYY");
            this.control.value = moment(this.control.value).format("DD-MMM-YYYY");
          }
          else {
            this.control.defaultValue = moment(this.control.defaultValue , 'DD-MMM-YYYY hh:mm:ss n').format("DD-MMM-YYYY");
            this.control.value = moment(this.control.value , 'DD-MMM-YYYY hh:mm:ss n').format("DD-MMM-YYYY");
          }
          
        }
      //Added by RajeshC || Dynamic Width
      //this.appliedWidth = "50px";
      this.appliedWidth = this.control.ucgM_Column_Width + 'px';
        //this.control.visible = this.control.ddVisibility;
        //Added by RajeshC || Customer Grid Visibility
        if (this.control.visible == 'Y' && this.control.ddVisibility=='Y' ){
          this.control.visible = 'Y';  
        }else{
          this.control.visible = 'N';
        }
        this.control.readOnly = "Y";
        this.control.mandatory = this.control.ddMandatory;
    }
    if(this.sUCPMode.toUpperCase() === 'DLSADD'){
      if (this.control.type.toUpperCase() == 'DATETIME' || this.control.type.toUpperCase() == 'DATE'){
        if(this.control.value == "" || this.control.defaultValue == ""){ /// Added by OnkarE on 02-May-202
            this.control.defaultValue = moment(new Date()).format("DD-MMM-YYYY");
            this.control.value = moment(new Date()).format("DD-MMM-YYYY"); 
        }
        else {
          if(moment(this.control.defaultValue, "DD-MMM-YYYY hh:mm:ss n").format("DD-MMM-YYYY") == 'Invalid date' ){
            this.control.defaultValue = moment(this.control.defaultValue).format("DD-MMM-YYYY");
            this.control.value = moment(this.control.value).format("DD-MMM-YYYY");
          }
          else {
            this.control.defaultValue = moment(this.control.defaultValue , 'DD-MMM-YYYY hh:mm:ss n').format("DD-MMM-YYYY");
            this.control.value = moment(this.control.value , 'DD-MMM-YYYY hh:mm:ss n').format("DD-MMM-YYYY");
          }
        }
        
      }
      this.appliedWidth = this.control.ucgM_Column_Width + 'px';
    }

      if(this.control.columnName === 'clmnCustomerLeg'){
        this.fillCustLeg();
        // added by OnkarE on 03-Dec-2020
      }
      if(this.control.columnName === 'clmnCustomerDealDirection'){
        this.getBSDirection();
      }

      if(this.control.columnName == 'clmnCustomerId'){
        console.log("Customer ID:: ", this.control, this.index)
      }

      let dropdownList = document.getElementsByClassName("UCPMatSelect");
      for (let i = 0; i < dropdownList.length; i++) {
        dropdownList[i].parentElement.classList.add('ucp-mat-select-parent');
      }
    }
    catch(e){
      console.log("Error in ngOnInit :", e)
    }
  }
  async CustomerGridValueChange(control: any) {
    try{
      if(this.control.columnName === 'clmnCustomerLeg'){
        this.custLegVal = this.control.value;
        this.getBSDirection();
      }
      console.log("Emitting control ffrom cust grid field component...", control);
      if(this.control.type.toUpperCase() == 'AMOUNT' || this.control.type.toUpperCase() == 'NUMBER') {
        this.control.value = this.formatNumber(this.control);
      }
      this.CustomerGridChangeChange.emit(control);
    }
    catch(e){
      console.log("Error in CustomerGridValueChange :", e)
    }
  }
  fillCustLeg(){
    try{
      if(this.selectedBookingModel.toUpperCase() === 'POOLING' || this.selectedBookingModel.toUpperCase() === 'BACK TO BACK'){
        this.custLegTypeDD.push({fieldName: "Customer", displayName: this.template.clientLeg})
        this.custLegTypeDD.push({fieldName: "CounterParty", displayName: this.template.marketLeg})
        console.log("custLegTypeDD is: ", this.custLegTypeDD)
        if(this.index === 0){
          this.control.value = "CounterParty";
        }
        else {
          this.control.value = "Customer"
        }
      }
      else if(this.selectedBookingModel.toUpperCase() === 'DYNAMIC' || this.selectedBookingModel.toUpperCase() === 'ORDER'){
        this.custLegTypeDD.push({fieldName: "Customer", displayName: this.template.clientLeg});
        this.control.value = "Customer";
      }
      else if(this.selectedBookingModel.toUpperCase() === 'MARKET'){
        this.custLegTypeDD.push({fieldName: "CounterParty", displayName: this.template.marketLeg});
        this.control.value = "CounterParty";
      }
      this.custLegVal = this.control.value;
      this.Row_type.emit(this.control.value)
      this.CustomerGridValueChange(this.control);
    }
    catch(e){
      console.log("Error in fillCustLeg :", e)
    }
  }

  getBSDirection(){
    // Added by OnkarE on 03-Dec-2020
    try{
      this.dtBSDirectionClient.push({fieldName: "Buy", displayName: this.template.clientBuy})
      this.dtBSDirectionClient.push({fieldName: "Sell", displayName: this.template.clientSell})
      this.dtBSDirectionMarket.push({fieldName: "Buy", displayName: this.template.marketBuy})
      this.dtBSDirectionMarket.push({fieldName: "Sell", displayName: this.template.marketSell})
      if(this.sUCPMode !="UCPUNW" && this.sUCPMode != "UCPREV" && this.sUCPMode!= "UNWFUL")
      {
        if(this.control.columnName === 'clmnCustomerDealDirection'){
          if(this.selectedBookingModel === 'Pooling' || this.selectedBookingModel === 'Back to Back'){
            if(this.index === 0){
              this.control.value = "Sell";
            }
            else {
              this.control.value = "Buy"
            }
          }
          else if(this.selectedBookingModel === 'Dynamic' || this.selectedBookingModel === 'Order'){
            this.control.value = "Buy";
          }
          else if(this.selectedBookingModel === 'Market'){
            this.control.value = "Sell";
          }
        }
      }
      
      if(this.custLegVal === 'CounterParty'){
        this.BSDirectionDD = this.dtBSDirectionMarket;
      }
      else {
        this.BSDirectionDD = this.dtBSDirectionClient;
      }
    }
    catch(e){
      console.log("Error in getBSDirection :", e)
    }
    
    //this.CustomerGridValueChange(this.control);
  }

  selectDate(control: any, date: string) {
    try{
      console.log(date);
      control.value = date;
      this.CustomerGridChangeChange.emit(control);
    }
    catch(e){
      console.log("Error in selectDate :", e)
    }
  }

  checkUDFVisibility(index: number) {
    try{
      const mod = index % 50;
      if (index > 50 * this.ColSize) {
        return { 'display': 'none' };
      }
      if ((mod) >= this.RowSize) {
        return { 'display': 'none' };
      } else {
        return { 'display': 'grid' };
      }
    }
    catch(e){
      console.log("Error in checkUDFVisibility :", e)
    }
  }

  formatNumber(control) {
    try{
      // console.log(control);
      if (isNaN(parseFloat(control.value))) {
        // return '';
        control.value = '';
      } else {
        console.log("Format no in cust grid: ", control)
        // if(control.udF_Format == 0) 
        //   control.udF_Format = 2;
        control.value = this.formatKLMB(control.value, control.udF_Format);
      }
      return control.value;
    }
    catch(e){
      console.log("Error in formatNumber :", e)
    }
  }

  //Added by SwatiP on 7-12-2021
  allowNominalWithMKBDecimalwithoutMinus(event, ctl, decimalPoint) {
    console.log("formattry");
    var charCode;
    var txt;
    var len;
    var mLen;
    var kLen;
    var bLen;
    var dotLen;
    var dot;
    var minus;
    var m_low, b_low, k_low, m_Cap, b_Cap, k_Cap;
    if (event.shiftKey && event.keyCode == 45) { return false; }
    try {
        charCode = (event.which) ? event.which : event.keyCode;
        if (charCode == 8 || charCode == 9 || charCode == 37 || charCode == 38 || charCode == 39 || charCode == 40 || charCode == 46) {
            return true;
        }
        txt = ctl.value;
        len = txt.length;
        dot = txt.indexOf('.');
        minus = txt.indexOf('-');
        m_low = txt.indexOf('m');
        b_low = txt.indexOf('b');
        k_low = txt.indexOf('k');
        m_Cap = txt.indexOf('M');
        b_Cap = txt.indexOf('B');
        k_Cap = txt.indexOf('K');
        mLen = txt.split('m').length;
        kLen = txt.split('k').length;
        bLen = txt.split('b').length;
        dotLen = txt.split('.').length;
        if (((charCode > 47 || charCode < 58) && event.shiftKey) || charCode == 107 || charCode == 109) { return false; }
        if (charCode > 31 && (charCode < 45 || (charCode > 57 && charCode < 96) || charCode > 105) && charCode != 46 && (charCode != 66 && charCode != 77 && charCode != 75) && (charCode != 98) && charCode != 190 && charCode != 110) {
            return false;
        } else {
            if (charCode == 47) {
                return false;
            }
            if (m_low >= 0 && charCode == 109) {
                return false;
            }
            if (b_low >= 0 && charCode == 98) {
                return false;
            }
            if (k_low >= 0 && charCode == 107) {
                return false;
            }
            if (m_Cap >= 0 && charCode == 77) {
                return false;
            }
            if (b_Cap >= 0 && charCode == 66) {
                return false;
            }
            if (k_Cap >= 0 && charCode == 75) {
                return false;
            }
            if (dot >= 0 && charCode == 46) {
                return false;
            }
            if (minus > -2 && charCode == 45) {
                return false;
            }
            if (event.keyCode == 65 || event.keyCode == 191 || event.keyCode == 76 || event.keyCode >= 67 && event.keyCode <= 74 || event.keyCode >= 78 && event.keyCode <= 90
                || event.keyCode >= 106 && event.keyCode <= 109 || event.keyCode == 111 || event.keyCode >= 186 && event.keyCode <= 188) {
                return false
            }
            if (dot > 0 || minus > 0) {
                var CharAfterdot = (len + 1) - dot;
                if (CharAfterdot > (Number(decimalPoint) + 1)) {
                    if (event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 75 || event.keyCode == 77 || event.keyCode == 66 || event.keyCode == 9) {
                        return true;
                    } else if ((event.keyCode > 47 && event.keyCode < 58) || (event.keyCode >= 96 && event.keyCode <= 105)) {
                        return true;
                    }
                    else { return false }
                    return false;
                }
            }
            if (dotLen > 1) {
                var nextChar = event.keyCode;
                var prevChar = txt.charAt(len - 1);
                if (nextChar == 75 || nextChar == 77 || nextChar == 66) {
                    if (prevChar == "." && (nextChar == 75 || nextChar == 77 || nextChar == 66)) {
                        return false
                    }
                }
                if (event.keyCode == 110 || event.keyCode == 190) {
                    return false
                }
                else {
                    return true
                }
            }
            if (mLen > 1 || kLen > 1 || bLen > 1) {
                if (event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 9) {
                    return true;
                }
                return false;
            }
        }
        return true;
    }
    catch (error) {
    }
    finally {
        charCode = null;
        txt = null;
        len = null;
        dot = null;
        minus = null;
        m_low = null;
        b_low = null;
        k_low = null;
        m_Cap = null;
        b_Cap = null;
        k_Cap = null;
    }
  }
  unformatNumber(control: { value: string; }) {
    // console.log(control);
    try{
      if (control.value) {
        control.value.replace(/,/g, '');
      }
    }
    catch(e){
      console.log("Error in unformatNumber :", e)
    }
    // control.currentValue.replace(/,/g, '');
  }

  IsValidNumber(val: any): boolean {
    try{
      return /^\d+(.\d*?)?$/.test(val);
    }
    catch(e){
      console.log("Error in unformatNumber :", e)
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

  selectSearchVal(control: String, searchVal: String){
    try{
      console.log(control,searchVal)
    }
    catch(e){
      console.log("Error in selectSearchVal :", e)
    }
  }

}
