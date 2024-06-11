import { Component, OnInit,ElementRef, ViewChild, Input,Output,EventEmitter,ViewEncapsulation } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {UntypedFormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
//import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-sharecollection',
  templateUrl: './sharecollection.component.html',
  styleUrls: ['./sharecollection.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SharecollectionComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  shareCtrl = new UntypedFormControl();
  filteredShares: Observable<any[]>;
  shares: string[] = [];
  shares_val:string;
  //allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  //allFruits:any[];
  @ViewChild('shareInput') shareInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @Input() defaultshares: string;
  @Input() allShares: any[];
  @Input() disabled = false;
  @Input() TabFlag: any;
  @Input() Tilda_sep:boolean=false;
  @Input() control: any;
  @Output() selectedShareVal = new EventEmitter<string>();

  constructor() { 
    this.filteredShares = this.shareCtrl.valueChanges.pipe(
      startWith(null),
      map((share_name: string | null) => share_name ? this._filter(share_name) : this.allShares.slice()));
  }

  ngOnInit(): void {
    try{
      console.log("all shares",this.allShares);
      console.log("default shares received",this.defaultshares);
      console.log("Tilda sep",this.Tilda_sep);
      if ((this.defaultshares != null || this.defaultshares != undefined) && this.defaultshares!=""){
        if (this.Tilda_sep == true){
          this.shares=this.defaultshares.split('~');
        }
        else{
      this.shares=this.defaultshares.split(',');
        }
      console.log("After string to array conv",this.shares);
      //this.control.value=this.defaultshares //to set control value even
      //this.selectedShareVal.emit(this.control);//to emit default values even if no changes is made in share selection
      }
    }
    catch(e){
        console.log("Error :", e)
    }
   //console.log("Selected shares",this.fruits);
   //this.allFruits=this.allShares;
  }
 
  add(event: MatChipInputEvent): void {
    try{
      const input = event.input;
      const value = event.value;
      
      console.log("Value",value);
      console.log("Input",input);
      // Add our share
      if ((value || '').trim()) {
        
        this.shares.push(value.trim());
        console.log("Selected shares",this.shares);
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.shareCtrl.setValue(null);
    }
    catch(e){
        console.log("Error :", e)
    }
  }

  remove(share: string): void {
    try{
      const index = this.shares.indexOf(share);

      if (index >= 0) {
        this.shares.splice(index, 1);
      }
      console.log("Selected shares",this.shares);
      this.concat_values();
    }
    catch(e){
        console.log("Error :", e)
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    try{
      if (!this.shares.includes(event.option.value) && event.option.viewValue!="") //to avoid duplicate selection of same entry
      {
      console.log("view value",event.option.viewValue);
      console.log("Value to be pushed in share collection array",event.option.value)
      this.shares.push(event.option.value);
      this.shareInput.nativeElement.value = '';
      this.shareCtrl.setValue(null);
      console.log("Selected shares",this.shares);
      this.concat_values();
      }
    }
    catch(e){
        console.log("Error :", e)
    }
  }

  private _filter(value: string): string[] {
    try{
      const filterValue = value.toLowerCase();

      //return this.allShares.filter(share => share.code.toLowerCase().indexOf(filterValue) === 0);
      return this.allShares.filter(share=>share.code.toLowerCase().includes(filterValue));
    }
    catch(e){
        console.log("Error :", e)
    }
  }

  concat_values(){
    try{
      this.shares_val="";
      this.shares_val=this.shares.toString();
      console.log("Til val",this.Tilda_sep);
      if (this.Tilda_sep == true){
        //console.log("in before replac",this.shares_val);
        this.shares_val=this.shares_val.replace(/\,/g,'~'); //for global replacement as .replace only replaces first occurence
        //console.log("in replac",this.shares_val.replace(/\,/g,'~')); 
      } 
      console.log("Shares val to string",this.shares_val);
      console.log("Shares",this.shares);
      this.control.value=this.shares_val;//for emiting value to control
      //this.selectedShareVal.emit(this.shares_val);
      this.selectedShareVal.emit(this.control);
      }
      catch(e){
          console.log("Error :", e)
      }
  }
}
