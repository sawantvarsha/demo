import { Component, OnInit, Input, Output, EventEmitter, NgModule, ElementRef, AfterViewChecked } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
//import { isNullOrUndefined } from 'util';

declare var require: any;

@Component({
  selector: 'app-field-templates',
  templateUrl: './field-templates.component.html',
  styleUrls: ['./field-templates.component.css'],
  styles: [
    `
      mat-form-field {
        width: var(--width) !important;
      }
    `,
    `
      textarea {
        height: var(--appliedHeight) !important;
      }
    `
  ]
})

export class FieldTemplatesComponent implements OnInit {

  @Input() control: any;
  @Input() dropdowns: any;
  @Input() searchArrays: any;
  @Input() shareArray: any;
  @Input() Multi_UCP: any;
  @Input() ColSize: number;
  @Input() RowSize: number;
  @Input() layoutColWidth: number;
  @Input() layoutLblWidth: number;
  @Input() required: Boolean;
  @Input() sUCPMode:string;
  @Input() WFLqueueButtons: any;
  @Input() Savingmsg: any;
  @Input() Cancelmsg: any;
  @Input() themeList: any;
  @Output() UDFFieldChangeChange = new EventEmitter<any>();
  @Output() WFLButtonActions = new EventEmitter<any>();
  @Output() SaveDataAmendMode = new EventEmitter<any>();
  @Output() RefreshWFLMode = new EventEmitter<any>();
  @Output() HandleAnotherUCPChange = new EventEmitter<any>();
  @Output() HandleHyperlinkChange = new EventEmitter<any>();
  @Output() HandleStaticButtonClick = new EventEmitter<any>();
  @Output() HandleGridChangeChange = new EventEmitter<any>();
  tabFlag: any;
  // VarWidth: any;
  visibleFlag: boolean;
  ddflag: boolean;
  width:any;
  appliedHeight: string;
  halfWidth: any;
  labelName: '';
  yesno: any;
  yesnoModel: boolean;
  yesnolblwidth: string;
  yesnocolwidth: string;
  iControlHeight: any = 27;
  userControlName: string;
 // mandatoryImageUrl = require('../../../../../assets/mandatory.png');
  colWidthToApply: any;
  lblWidthToApply: any;
  chart_data:any[][] = [
    ['', 0.0],
    ['', 0.0]
    //['Chrome', 12.8],
    //['Safari', 8.5],
    //['Opera', 6.2],
    //['Others', 0.7] 
  ];
  oneforthwidth: string;
  textFlag: boolean = true; /// Added by OnkarE on 18-June-2021 to handle textarea in TEXT data type when height > 1
  udfColor: string = "";
  udfFontName: string = "";
  udfFontSize: any = 0;
  udfBold = false;
  udfItalic = false;
  udfUnderline = false;
  dynamicCSSList: any[] = [];
  constructor(private elemRef: ElementRef,private sanitizer: DomSanitizer) { }

  ngOnInit() {
    try{
      this.tabFlag = false;
      this.visibleFlag = true;
      this.appliedHeight = "50px";
      // this.width = '280px';
      // console.log("MULTI UCP FLAGGGGGGGGGGGGGGGGGGG", this.Multi_UCP, environment.fullWidthInDL, environment.halfWidthInDL);
      // console.log("FLAGGGGGGGGGGGGGGGGGGG", this.control.displayName, this.control.label_Width, this.control.column_Width, Number(this.layoutLblWidth), Number(this.layoutColWidth))
      if(this.control.label_Width == 0){
        this.lblWidthToApply = Number(this.layoutLblWidth)
      }
      else {
        this.lblWidthToApply = this.control.label_Width
      }

      if(this.control.column_Width == 0){
        this.colWidthToApply = Number(this.layoutColWidth);
      }
      else {
        this.colWidthToApply = this.control.column_Width
      }

      this.width = (Number(this.colWidthToApply +  this.lblWidthToApply) / 2 ) + "px";
      this.halfWidth = Number(Number(this.width.replace("px", ""))/2) + "px";
      this.oneforthwidth = Number(Number(this.halfWidth.replace("px", ""))/2) + "px";

      // if(this.control.column_Width + this.control.label_Width === 0){
      //   if(this.Multi_UCP){
      //     this.width = environment.fullWidthInDL;
      //     this.halfWidth = environment.halfWidthInDL;
      //   }
      //   else {
      //     this.width = ((Number(this.layoutColWidth) + Number(this.layoutLblWidth)) / 2 ) < Number(environment.fullWidthInDL.replace("px","")) ? environment.fullWidthInDL : ((Number(this.layoutColWidth) + Number(this.layoutLblWidth)) / 2) + "px";
      //     this.halfWidth = Number(Number(this.width.replace("px", ""))/2) + "px";
      //     this.oneforthwidth = Number(Number(this.halfWidth.replace("px", ""))/2) + "px";
      //     console.log("Temp Width is: ", this.oneforthwidth)
      //     // this.oneforthwidth = '42px';
      //     // this.width = '300px';
      //     // this.halfWidth = '150px';
      //   }
      // }
      // else {
      //   // console.log("Width is other than 0 for this: ", this.control)
      //   // console.log("Widths from deal entry are: ", this.layoutColWidth, this.layoutLblWidth)
      //   let tempWidth = ((Number(this.layoutColWidth) + Number(this.layoutLblWidth)) / 2 ) + ((Number(this.control.column_Width) + Number(this.control.label_Width)) / 2);
      //   this.width = tempWidth+"px";
      //   this.halfWidth = Number(tempWidth/2) + "px";
      // }
      this.ddflag = false;
      // console.log("On load data +++++++++++++++++++++++++++++++++++++++++++++++++++", this.control.displayName, ':::::::::', this.control.udF_Feature1, ':::::::::::', this.control.defaultValue);
      //  console.log("data typeeeeee",this.control.dataType);
      if(this.control.mandatory === 'Y'){
        this.required = true;
      }
      if (this.control.dataType === 'TIMER') {
        // console.log("Timer datatype:.............", this.control);
      }
      if(this.control.dataType === 'CHART'){
        console.log("Chart data in html comp---> ", this.control);
      }
      if(this.control.dataType === 'LABEL'){
        if(this.control.defaultValue === '' || this.control.defaultValue === null){
          this.labelName = this.control.displayName;
        }
        else 
          this.labelName = this.control.defaultValue;

        // Added these conditions by OnkarE on 01-Feb-2022 - if color and font size is not specified, use default 'RED' color and '12px' fontsize
        if (this.control.color == null || this.control.color == "") {
          //this.control.color = "#ff7777";
          this.udfColor = "RGB(255, 119, 119)"
          this.dynamicCSSList.push({
            id: this.control.fieldName,
            prop: '--clr',
            value: 'RGB(255, 119, 119)'
          });
        }

        if (this.control.udF_FontName == null || this.control.udF_FontName == "") {
          this.udfFontName = "Verdana, Geneva, Tahoma, sans-serif;"
          this.dynamicCSSList.push({
            id: this.control.fieldName,
            prop: '--fontName',
            value: this.udfFontName
          });
        }

        if (this.control.udF_FontSize == null || this.control.udF_FontSize == "0") {
          this.udfFontSize = 12 + "px";
          this.dynamicCSSList.push({
            id: this.control.fieldName,
            prop: '--fontSize',
            value: this.udfFontSize
          });
        }
      }
      

      if(this.control.dataType === 'TEXT'){
        if(this.control.controlHeight == '' || Number(this.control.controlHeight) < 2) {
          this.textFlag = true;
        }
        else {
          this.textFlag = false;
          let tempHt = Number(this.control.controlHeight) * Number(this.iControlHeight); 
          this.control.newHt = tempHt + 'px';
          this.appliedHeight = tempHt + 'px';
        }
      }

      if(this.control.controlHeight != "0" && this.control.controlHeight != null) {
        let tempHt = Number(this.control.controlHeight) * Number(this.iControlHeight); 
        if(this.control.dataType == "AMOUNT" || this.control.dataType == "NUMBER" || this.control.dataType == "INTEGER" || (this.control.dataType == "TEXT")) {
          tempHt = tempHt - 3;
        }
        this.control.newHt = tempHt + 'px';
        this.appliedHeight = tempHt + 'px';
      }

      // if(this.control.udF_Feature1 != 'Allow Blank Row' && this.control.defaultValue === '' && this.dropdowns[this.control.sourcingLink || this.control.fieldName] != null){
      //   console.log("Blank row nahiye....", this.control, this.dropdowns);
      //   if(this.dropdowns[this.control.fieldName || this.control.sourcingLink].length > 0)
      //    this.control.value = this.dropdowns[this.control.fieldName || this.control.sourcingLink][0].code;
      // }
      if (!this.isNullOrUndefined(this.control.dataType))
      {
        switch(this.control.dataType.toUpperCase()){
          case 'AMOUNT':
          case 'NUMBER':
          case 'INTEGER':
            break;
          default:
              if(this.control.udF_Feature1 != 'Allow Blank Row' && this.control.defaultValue === '' && this.dropdowns[this.control.sourcingLink || this.control.fieldName] != null){
                // console.log("Blank row nahiye....", this.control, this.dropdowns);
                if( this.control.sourcingLink !=""){
                  if(this.dropdowns[this.control.sourcingLink].length > 0) {
                    if(this.control.udF_Feature1.includes('Multiselect Dropdown') && this.control.defaultValue == ""){
                      this.control.value = "";
                    }
                    else {
                      this.control.value = this.dropdowns[this.control.sourcingLink][0].code;
                    }
                  }
              
                }
                else{
                if(this.dropdowns[this.control.fieldName || this.control.sourcingLink].length > 0) {
                  if(this.control.udF_Feature1.includes('Multiselect Dropdown') && this.control.defaultValue == ""){
                    this.control.value = "";
                  }
                  else {
                    this.control.value = this.dropdowns[this.control.fieldName || this.control.sourcingLink][0].code;
                  }
                }
                }
              }
          break;
      }
      }
    

        
      //}
      // if (this.control.visibleOpt != null) {
        // if (this.control.visibleOpt === 'N') {
        //   console.log("Onkar-----------------");
        //   this.visibleFlag = false;
        //   console.log("INSIDE Visible FORMATTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", this.control.displayName, this.control.visibleOpt, this.visibleFlag);
        // }
      //}
      if (this.control.dataType === "AMOUNT" || this.control.dataType === "NUMBER") {
        this.control.value = this.formatNumber(this.control);
      }

      if (this.control.dataType ==='CURRENCY'){
        // console.log("CURR dataset",this.dropdowns[this.control.fieldName]);
      }

      if(this.control.dataType === 'YES/NO'){
        this.yesno = this.control.value ? this.control.value : 'No';
        if(this.yesno === 'Yes'){
          this.yesnoModel = true;
        }
        else
          this.yesnoModel = false;
        this.yesnolblwidth = this.control.label_Width === 0 ? '140px' : this.control.label_Width + 'px';
        this.yesnocolwidth = this.control.column_Width=== 0 ? '140px' : this.control.column_Width + 'px';
        // var ele = {checked: this.yesno}
        // this.displayYesNo(ele);
      }
      if(this.control.dataType === 'IMAGE' || this.control.dataType === 'TEXTAREA' || this.control.dataType === 'UCP USER CONTROL'){
        // console.log("Image file is::: ", this.control);
        if(this.control.controlHeight === 0 || this.control.controlHeight === null){
          this.control.controlHeight = 5;
        }
        let tempHt = Number(this.control.controlHeight) * Number(this.iControlHeight); 
        this.control.newHt = tempHt + 'px';
        this.appliedHeight = tempHt + 'px';
      }

      // if(this.control.dataType === 'TEXT'){
      //   if(this.control.controlHeight && Number(this.control.controlHeight) > 0){
      //     let tempHt = Number(this.control.controlHeight) * Number(this.iControlHeight); 
      //     this.control.newHt = tempHt + 'px';
      //   }
      // }

      if(this.control.dataType === 'UPLOAD'){
        // console.log("Upload file is::: ", this.control);
      }


      if(this.control.dataType === 'FILE' ){
        // console.log("File datatype control is::: ", this.control);
        const data = this.control.image_Data;
        const blob = new Blob([data], {type: "text/plain;base64"});
    
        this.control.image_Data  = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

      /*  var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
        //   const blob = new Blob([this.control.image_Data], { type: 'text/csv' });
        this.control.image_Data = window.URL.createObjectURL(blob);
        //  this.control.image_Data = window.URL.createObjectURL(new Blob( this.control.image_Data));
        */
      
      }
      if(this.control.dataType === 'FILEPATH'){
        console.log("fILEPATH is::: ", this.control);
        
      }

      if(this.control.dataType === 'COMMON DATA'){
        if(this.control.sourcingLink == '' || this.control.sourcingLink == null){
          var testObj = {code : ""};
          this.dropdowns[this.control.fieldName].push(testObj);
        }
      }

      if(this.control.dataType === 'UCP USER CONTROL'){
        this.userControlName = "app-" + this.control.sourcingLink;
      }

      //start by SwatiP
      if(this.control.dataType == 'WFL BUTTON'){
        console.log("WFL BTN Data : ", this.WFLqueueButtons)
        var tempObj = this.WFLqueueButtons.filter(e => e.caption== this.control.sourcingLink)[0];
        if(!this.isNullOrUndefined(tempObj)) //Added by Devesh to avoid null ref error 
        {
        tempObj.dataType = this.control.dataType;
        tempObj.visibility=this.control.visibility;
        this.control = tempObj;
        }      
      }
      //Added by bhagyashriB on 29-Sept-2021 | for color property of udf field
      if (this.control.color != null && this.control.color != "") {
        this.udfColor = this.ColorCodeToRGB(this.control.color);
        this.dynamicCSSList.push({
          id: this.control.fieldName,
          prop: '--clr',
          value: this.udfColor
        });
      }
      if (this.control.udF_FontName != null && this.control.udF_FontName != "") {
        this.udfFontName = this.control.udF_FontName;
        this.dynamicCSSList.push({
          id: this.control.fieldName,
          prop: '--fontName',
          value: this.udfFontName
        });
      }
      if (this.control.udF_FontSize != null && this.control.udF_FontSize != "0") {
        this.udfFontSize = Number(this.control.udF_FontSize);
        this.dynamicCSSList.push({
          id: this.control.fieldName,
          prop: '--fontSize',
          value: this.udfFontSize + "px"
        });
      }
      this.udfBold = this.control.bold ? this.control.bold.toLowerCase() === "true" : false;
      this.udfItalic = this.control.italic ? this.control.italic.toLowerCase() === "true" : false;
      this.udfUnderline = this.control.underline ? this.control.underline.toLowerCase() === "true" : false;
      //Added by BhagyashriB on 08-Oct-2021
      if (this.control.udF_Feature1 != null && this.control.udF_Feature1 != undefined) {
        if (this.control.udF_Feature1.toUpperCase().includes("UPPERCASE")) {
          this.control.value = this.control.value.toUpperCase();
        }
        if (this.control.udF_Feature1.toUpperCase().includes("LOWERCASE")) {
          this.control.value = this.control.value.toLowerCase();
        }
        if (this.control.udF_Feature1.toUpperCase().includes("WIDTH")) {
          if (!this.isNullOrUndefined(this.control.udF_Feature2) && this.control.udF_Feature2 != "") {
            this.width = this.control.udF_Feature2;
          }
        }
        if (this.control.udF_Feature1.toUpperCase().includes("RAILWAY LINE")) {
          this.width = "fit-content";
        }
      }
      //End by BhagyashriB
      let dropdownList = document.getElementsByClassName("UCPMatSelect");
      for (let i = 0; i < dropdownList.length; i++) {
        if(dropdownList[i].className.includes('mat-select-disabled')) {
          dropdownList[i].parentElement.classList.add('ucp-mat-select-disabled-parent');
        }
        else {
          dropdownList[i].parentElement.classList.add('ucp-mat-select-parent');
        }
      }
      // let matFormFieldsArray = document.getElementsByClassName("mat-form-field-label")
      // for (let i = 0; i < matFormFieldsArray.length; i++) {
      //   matFormFieldsArray[i].classList.add('ucp-mat-label');
      // }
    }
    catch(e){
      console.log("Error in ngOnInit :", e)
    }
  }
  ngAfterViewInit() {     //Added by BhagyashriB on 11-Oct-2021 | to set CSS properties per element after it is rendered
    try{
      this.dynamicCSSList.forEach(elem => {
        if(elem.id == "Cust_Nationality") {
          console.log("DynamicClassList: ", this.dynamicCSSList);
        }
        let input = document.getElementById(elem.id);
        let props = "";
        if (input && input.nextSibling && input.nextSibling.firstChild) {
          let label;
          switch (elem.prop) {
            case '--clr':
              label = input.nextSibling.firstChild;
              props = "color";
              break;
            case '--fontName':
            case '--fontSize':
              label = input.nextSibling.firstChild.firstChild;
              props = "font-size";
              break;
          } 
          (label as HTMLElement).style.setProperty(props, elem.value);
          
        }
      });
    }
    catch(e){
      console.log("Error in ngAfterViewInit :", e)
    }
  }
  ColorCodeToRGB(color: any): string {    //Added by BhagyashriB
    try{
      let strClr = "";
        let lColor = color;
        let r = ~~lColor % 256;
        lColor = lColor / 256;
        let g = ~~lColor % 256;
        lColor = lColor / 256;
        let b = ~~lColor % 256;
        if (r == 0 && g == 0 && b == 0) {
          strClr = null
        } else {
          strClr = "RGB(" + r + "," + g + "," + b + ")";
        }
        return strClr;
    }
    catch(e){
      console.log("Error in ColorCodeToRGB :", e)
    }
  }

  ngAfterViewChecked() {
    try{
      if (this.control.visibleOpt === 'N' || this.control.visibility === 'N') {
        // console.log("Onkar-----------------");
        this.visibleFlag = false;
        if(this.control.dataType === 'IMAGE' || this.control.dataType === 'TEXTAREA' || this.control.dataType === 'UCP USER CONTROL') //condition added by devesh as invisble were taking same height as visible fields casuing layout issues
        {
          this.control.newHt = 135 + 'px';
          this.appliedHeight = 135 + 'px';
        }
        // console.log("INSIDE Visible FORMATTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", this.control.displayName, this.control.visibleOpt, this.visibleFlag);
      }
      else {
        this.visibleFlag = true;
        if(this.control.dataType === 'IMAGE' || this.control.dataType === 'TEXTAREA' || this.control.dataType === 'UCP USER CONTROL') //condition added by devesh as invisble were taking same height as visible fields casuing layout issues
        {
        if(this.control.controlHeight === 0 || this.control.controlHeight === null){
          this.control.controlHeight = 5;
        }
        let tempHt = Number(this.control.controlHeight) * Number(this.iControlHeight);
        this.control.newHt = tempHt + 'px';
        this.appliedHeight = tempHt + 'px';
        }
      }
    }
    catch(e){
      console.log("Error in ngAfterViewChecked :", e)
    }
    // if(this.control.value != '')
    //   this.doSomething(this.control);
  }
  async udfFieldValueChange(control: any) {
    try{
      if(control.dataType === 'FILEPATH'){
        control.currentValue = control.value;
      }
      if(control.dataType === 'YES/NO' && control.udF_Feature1 ==='Toggle Button'){
        control.value = this.yesno;
      }
      // console.log("this is udf change in field templates.........", control, this.UDFFieldChangeChange);
      this.UDFFieldChangeChange.emit({control:control,loader:true});
    }
    catch(e){
      console.log("Error in udfFieldValueChange :", e)
    }
  }
  //Start by SwatiP
  async WFLButtonActionsChange(btn:any){
    try{
      this.WFLButtonActions.emit(btn);
    }
    catch(e){
      console.log("Error in WFLButtonActionsChange :", e)
    }
  }
  async SaveDataAmendModeChange(){
    try{
      this.SaveDataAmendMode.emit();
    }
    catch(e){
      console.log("Error in SaveDataAmendModeChange :", e)
    }
  }
  async RefreshWFLModeChange(){
    try{
      this.RefreshWFLMode.emit();
    }
    catch(e){
      console.log("Error in RefreshWFLModeChange :", e)
    }
  }
  //eND BY sWATIp
  validateInput(control: any){
    try{
      console.log("Validate input:: ")
      if (!this.isNullOrUndefined(control.dataType))
      {
        switch(control.dataType.toUpperCase()){
          case 'AMOUNT':
          case 'NUMBER':
          case 'INTEGER':
            if(!control.udF_Feature1.includes('Allow Negative')){
              Number(control.value) < 0 ? control.value = control.value.replace(/[-]/g, "") : "";
            }
            // if(control.udF_Feature1.includes('Length')){
            //   control.value.length > Number(control.udF_Feature2) ? control.value.trim()  :  
            // }
            break;
          default:
              
          break;
      }
      }
      if(this.control.mandatory === 'Y' && this.control.value.length > 0){
        this.control.error = false;
        this.elemRef.nativeElement.querySelector('#' + control.fieldName).parentElement.parentElement.parentElement.parentElement.classList.remove('mat-form-field-invalid');
      }
    }
    catch(e){
      console.log("Error in validateInput :", e)
    }
  }

  selectDate(control: any, date: string) {
    try{
      //debugger;
      console.log(date);
      control.value = date;
      this.UDFFieldChangeChange.emit(control);
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
        console.log("Number formatting", control.displayName, control.value, control.udF_Format);
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
    try{
      // console.log(control);
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
      console.log("Error in IsValidNumber :", e)
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

  HandleAnotherUCP(control){
    try{
      console.log(this.control);
      this.HandleAnotherUCPChange.emit(control);
    }
    catch(e){
      console.log("Error in HandleAnotherUCP :", e)
    }
  }

  HandleHyperlink(control){
    try{
      console.log(this.control);
      this.HandleHyperlinkChange.emit(control);
    }
    catch(e){
      console.log("Error in HandleHyperlink :", e)
    }
  }
  HandleStaticButton(control){
    try{
      console.log(this.control);
      this.HandleStaticButtonClick.emit(control);
    }
    catch(e){
      console.log("Error in HandleStaticButton :", e)
    }
  }
  HandleGridData(control){
    try{
      console.log("In field template...", control);
      this.HandleGridChangeChange.emit(control)
    }
    catch(e){
      console.log("Error in HandleGridData :", e)
    }
  }

  onlyNumber(event): boolean {    //Added by BhagyashriB on 12-Oct-2021
    try{
      let charCode = (event.which) ? event.which : event.keyCode;
      if (charCode == 8 || charCode == 9 || charCode == 37 || charCode == 38 || charCode == 39 || charCode == 40) {
        return true;
      }
      if (charCode > 31 && (charCode < 45 || (charCode > 57 && charCode < 96) || charCode > 105)) {
        return false;
      }
      return true;
    }
    catch(e){
      console.log("Error in onlyNumber :", e)
    }
  }
  onlyAlphanumeric(event) {    //Added by BhagyashriB on 12-Oct-2021
    try{
      let code = (event.which) ? event.which : event.keyCode;
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
          event.preventDefault();
      }
    }
    catch(e){
      console.log("Error in onlyAlphanumeric :", e)
    }
  }
  onlyNumberwithMinus(event) {    //Added by BhagyashriB on 26-Oct-2021
    try{
      event = (event) ? event : window.event;
      var charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 189) {
          return false;
      }
      return true;
    }
    catch(e){
      console.log("Error in onlyNumberwithMinus :", e)
    }
  }
  displayYesNo(e) {
    try{
      if (e.checked)
        this.yesno = 'Yes';
      else
        this.yesno='No';
      if(this.yesno === 'Yes'){
        this.yesnoModel = true;
      }
      else
        this.yesnoModel = false;
    }
    catch(e){
      console.log("Error in displayYesNo :", e)
    }
  }
  isNullOrUndefined(value: any) { // Added by OnkarE
    try{
      return value === null || value === undefined;
    }
    catch(e){
      console.log("Error in isNullOrUndefined :", e)
    }
  }
  // OpenUploadedFile(control){
  //   try{
  // ///Extension:pdf|Type:application/pdf|Data:JVBERi0xL
  //     debugger;  
  //     let docData;
  //     docData = control.value.split("|")
  //     console.log("-------", control.value, docData);
  //     let result = docData[2].split(":")[1];
  //     let type = docData[1].split(":")[1];
  //    const blob = this.b64toBlob(result, type);
  //    const blobUrl = URL.createObjectURL(blob);    
  //    //window.location = blobUrl;
  //    window.open(blobUrl,control.fieldName, 'width=900,height=900,');
     
  //   }
  //   catch(err){
  //   }
  // }
  // b64toBlob (b64Data:string, contentType:string='', sliceSize:number=512)  {
  //   const byteCharacters = atob(b64Data);
  //   const byteArrays = [];
  //   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
  //     const slice = byteCharacters.slice(offset, offset + sliceSize);
  //     const byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);
  //     byteArrays.push(byteArray);
  //   }
  //   const blob = new Blob(byteArrays, {type: contentType});
  //   return blob;
  // }
}
