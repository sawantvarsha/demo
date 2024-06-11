
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.css'],
})
export class CustomDropdownComponent implements OnInit {
  @Input() options: any[];
  @Input() extraOptions: any[];
  @Input() selectedValue: string;
  @Input() ddVal: string;
  @Input() label: string;
  @Input() drpId: string;
  @Input() drpName: string;
  @Input() flag: boolean;
  @Input() requiredCheck: boolean;
  @Input() disableFlag: boolean;
  @Input() width: string;
  @Output() selectionChange = new EventEmitter<{ Id: string, Lbl: string }>();
  filtereddata: any[] = [];
  evt: string;

  public control: UntypedFormControl = new UntypedFormControl();
  searchCtrl: string;

  ngOnInit() {

    this.selectedValue = this.ddVal;

  }

  constructor() {
    /*  this.selectionChange = new EventEmitter(); */
    this.options = [];
    this.extraOptions = [];
  }


  DataFilter(evt: string) {
    // console.log(this.options, this.extraOptions)
    try{
      evt = evt + "";
      if (!evt || evt === 'null') {
        this.options = this.extraOptions;
      }
      else if (evt){
        //  debugger
        // console.log(evt) 
        this.filtereddata = this.extraOptions.filter(item => item[this.drpName].toLowerCase().indexOf(evt.toLowerCase()) >= 0);
        this.options = this.filtereddata;
        console.log(this.options.length)
        // let evt1 = this.options;
    if( this.options.length === 0){
          let str = evt.toLocaleLowerCase().substring(0,3) + " - " + evt.toLocaleLowerCase().substring(3,evt.toLocaleLowerCase().length)
        //  console.log(str)
          this.filtereddata = this.extraOptions.filter(item =>item[this.drpName].toLowerCase().includes(str.toLocaleLowerCase()))
          this.options = this.filtereddata;
        }
      }
    }
    catch(e){
        console.log("Error :", e)
    }
  }

  action(Id, Lbl) {
    try{
      this.selectionChange.emit({ Id, Lbl });
    }
    catch(e){
        console.log("Error :", e)
    }
  }

}
