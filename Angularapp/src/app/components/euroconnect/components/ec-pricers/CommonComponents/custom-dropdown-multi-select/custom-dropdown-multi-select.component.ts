
import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, Renderer2, ViewChild,OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-dropdown-multi-select',
  templateUrl: './custom-dropdown-multi-select.component.html',
  styleUrls: ['./custom-dropdown-multi-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomDropdownMultiSelectComponent),
    multi: true
  }]
})
export class CustomDropdownMultiSelectComponent implements OnInit, ControlValueAccessor {

  @Input() options: any[];
  @Input() disabled: boolean = false;
  @Input() pricerType:string;
  @Input() disabledMulti:boolean = false;
  @Input() alignment:string;
  @Input() fieldName:string;
  @Input() tabIdx:string = '0';//Added by SandipA for FIN1EURINT-310 || 31-May-23
  @Input() isRefreshed: boolean = false;

  @Input() displayText2: string ;
  @Output() selectOptionsEmitter = new EventEmitter<string[]>();
  selected: string[] = [];
  displayText: string = "";
  showOptions: boolean = false;
  selectAllFlag:boolean; // For retaining the filters after Filterdiv On-Off
  placeholder: string = '';
  multiSelectSearch : string = '';
  @Input() backupOptions: any[] = [];

 
  onChange: (value: string) => any = (value: string) => {console.log(value) };
  onTouched: () => any = () => { };

  @ViewChild('dropdownRef', { static: false }) dropdownRef: ElementRef;

  constructor(private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (!this.dropdownRef.nativeElement.contains(e.target)) {
        this.showOptions = false;
      }
    });
  }

  writeValue(obj: string): void {
    if(this.pricerType === 'dropdownSearch'){
      const selLen = this.options.filter(el => el.checked === true).length;
      if(selLen === this.options.length){
        this.selectAllFlag = true;
        this.placeholder = this.displayText2;
      }
      else if(selLen === 0){
        this.selectAllFlag = false;
        this.placeholder = this.displayText2;
      }
      else{
        this.selectAllFlag = false;
        this.placeholder = this.options.filter(el => el.checked === true).map(el => el.value).toString();
      }
    }
    else{
      if (obj) {
        // this.displayText = obj;
        this.placeholder = obj;
        // this.selected = obj.split(',');
        this.selected = Array.isArray(obj) ? obj : obj.split(',');//Changed by Jyoti S || 13-Jul-2023
      }else{
        // this.displayText = '';
        this.placeholder = this.displayText2;
        //this.selected = [];
      }
      // For retaining the filters after Filterdiv On-Off
      if (this.selected?.length != this.options?.length){
        this.selectAllFlag = false;
      }
    }
  }

  registerOnChange(fn: any): void {
    //console.log('fn onchange', fn)
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    //console.log('fn on touched', fn)
    this.onTouched = fn;
  }

  ngOnInit() {
    console.log("alignment", this.disabled)
    this.placeholder = this.displayText2;
    this.selectAllFlag = true; 
    // Multi select dropdown with search option | 12-10-2023
    if(this.pricerType === 'dropdownSearch'){
    }
    else{
      this.selected=this.options?.slice();
    }
    
  }

  ngOnChanges(){
    // On Refresh all options must be selected
    if(this.isRefreshed){
      if(this.pricerType !== 'dropdownSearch'){
        this.selected=this.options?.slice();
      }
      else{
        this.placeholder = this.displayText2;
      }
      this.selectAllFlag=true;
    }
  }

  toggleDropdown() {
    if(this.disabledMulti){
      this.showOptions = false;
    }
    else
    {
      if(this.showOptions)
        this.showOptions = false;
      else
        this.showOptions = true;
    }
      
    //return false;
  }

  setValue(value: string,singleUpdate=false) {

    if(singleUpdate){
      this.selectAllFlag = false;
    }
    const selectedOptions = this.selected;
    if (selectedOptions.includes(value) ) {
      if(!this.selectAllFlag)
        selectedOptions.splice(selectedOptions.indexOf(value), 1);
    } else {
      selectedOptions.push(value)
    }
    if(singleUpdate && selectedOptions.length === this.options.length){
      this.selectAllFlag = true;
    }
    this.selected = selectedOptions;
    this.displayText = this.selected.join(',');
    this.placeholder = this.displayText //Changed by Jyoti S || F5SAAINT-967 && F5SAAINT-992 || 05-Dec-2023
    this.onChange(this.displayText);
    return false;
  }
  
  setValue2(value: string,singleUpdate=false) {

    if(singleUpdate){
      this.selectAllFlag = false;
    }
    const selectedOptions = this.selected;
    if (selectedOptions.includes(value) ) {
      if(!this.selectAllFlag)
        selectedOptions.splice(selectedOptions.indexOf(value), 1);
    } else {
      selectedOptions.push(value)
    }
    if(singleUpdate && selectedOptions.length === this.options.length){
      this.selectAllFlag = true;
    }
    this.selected = selectedOptions;
    if(this.selected.length != 0)
      this.placeholder = this.selected.join(',');   
    else
      this.placeholder = this.displayText2;
    this.onChange(this.placeholder);
    this.selectOptionsEmitter.emit(this.selected);
    return false;
  }

  isSelected(value?: string) {
    if (this.selected) {
      if (this.selected.includes(value) || this.selectAllFlag)
        return true;
    }
    return false;
  }

  // setDisabledState(isDisabled: boolean): void {
  //   this.disabled = isDisabled;
  // }

  toggleSelectFlag(){
    this.selectAllFlag = !this.selectAllFlag;
    // if(this.selectAllFlag){
    // }
    this.options.forEach(item => {
      this.setValue(item.Value)
    });
    
  }
  toggleSelectFlag2(){
    this.selectAllFlag = !this.selectAllFlag;
    
    if(this.selectAllFlag){
      this.selected = this.options.slice();
      this.placeholder = this.selected.join(',');
    }
    else{
      this.selected = [];
      this.placeholder=this.displayText2;
    }
    this.onChange(this.placeholder);
    this.selectOptionsEmitter.emit(this.selected);
    // this.options.forEach(item => {
    //   this.setValue(item)
    // });
    
  }
  
  postbackMethod(){
    return false;
  }

  // Multi select dropdown with search option | 12-10-2023
  filterOptions(){
    try{
      let selStr = '';
      if(this.backupOptions.length <= 0){
        return;
      }
      this.selectAllFlag = true;
      this.options = [];
      const searchInputArr = this.multiSelectSearch.split(',').filter(el => el !== '');
      if(searchInputArr.length > 0){
        this.options = this.backupOptions.filter(el => searchInputArr.some(s => el.value.toString().toLowerCase().includes(s.toString().toLowerCase())));
        this.options.forEach(el => {
          el.checked = true;
        });
      }
      else{
        this.options = [...this.backupOptions];
        this.options.forEach(el => {
          el.checked = true;
        });
      }
      if(this.options.length <= 0){
        selStr = this.displayText2 + ':' + 'NONE';
        this.placeholder = this.displayText2;
        this.onChange(this.placeholder);
        this.selectOptionsEmitter.emit([selStr]);
      }
      else{
        this.selectAll(false);
      }
    }
    catch(er){
    }
  }

  selectAll(filter){
    try{
      let selStr = '';
      if(filter){
        if(this.selectAllFlag){
          this.options.forEach(el => {
            el.checked = false;
          });
        }
        else{
          this.options.forEach(el => {
            el.checked = true;
          });
        }
        this.selectAllFlag = !this.selectAllFlag;
      }
      if(this.multiSelectSearch.length > 0){
        if(this.selectAllFlag){
          if(this.backupOptions.length === this.options.length){
            selStr = this.displayText2 + ':' + this.options.map(el => el.value).toString();
            this.placeholder = this.displayText2;
          }
          else{
            this.placeholder = this.options.map(el => el.value).toString();
            selStr = this.displayText2 + ':' + this.placeholder;
          }
        }
        else{
          selStr = this.displayText2 + ':' + 'NONE';
          this.placeholder = this.displayText2;
        }
      }
      else{
        if(this.selectAllFlag){
          selStr = this.displayText2 + ':' + this.options.map(el => el.value).toString();
          this.placeholder = this.displayText2;
        }
        else{
          selStr = this.displayText2 + ':' + 'NONE';
          this.placeholder = this.displayText2;
        }
      }
      this.onChange(this.placeholder);
      this.selectOptionsEmitter.emit([selStr]);
    }
    catch(error){

    }
  }

  selectOne(option){
    try{
      let selStr = '';
      option.checked = !option.checked;
      const selLen = this.options.filter(el => el.checked === true).length;
      if(selLen === this.options.length){
        this.selectAllFlag = true;
      }
      else{
        this.selectAllFlag = false;
      }
      if(this.backupOptions.length === selLen){
        selStr = this.displayText2 + ':' + this.options.map(el => el.value).toString();
        this.placeholder = this.displayText2;
      }
      else if(0 === selLen){
        selStr = this.displayText2 + ':' + 'NONE';
        this.placeholder = this.displayText2;
      }
      else{
        this.placeholder = this.options.filter(el => el.checked === true).map(el => el.value).toString();
        selStr = this.displayText2 + ':' + this.placeholder;
      }
      this.onChange(this.placeholder);
      this.selectOptionsEmitter.emit([selStr]);
    }
    catch(error){
    
    }
  }


}
