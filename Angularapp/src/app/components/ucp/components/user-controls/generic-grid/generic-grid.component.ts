import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';

@Component({
  selector: 'app-generic-grid',
  templateUrl: './generic-grid.component.html',
  styleUrls: ['./generic-grid.component.css']
})
export class GenericGridComponent implements OnChanges {

  constructor() { }
  @Input() gridControl: any;
  @Input() width: any;
  @Input() value: any;
  @Output() HandleGridChange = new EventEmitter<any>();
  GridData: [];
  height: '';
  tempData: any;
  dataSource: any;
  keys: any;  
  ngOnChanges (): void {
    this.loadGridData();
  }
  loadGridData(){
    try{
      console.log("Output in Grid Component.....", this.gridControl)
      this.tempData = this.gridControl;
      this.height = this.gridControl.newHt;
      this.keys = Object.keys(this.tempData.gridDt[0]);
      console.log("Keys are::: ", this.keys)
      console.log("binding data to table.....", this.tempData.gridDt)
      this.dataSource =  new MatTableDataSource(this.tempData.gridDt);
      this.HandleGridData();
    }
    catch(e){
        console.log("Error in loadGridData :", e)
    }
    // this.GridData = this.gridControl.value;
    // console.log("Grid data value is: ", this.GridData);
  }

  HandleGridData(){
    try{
      var tempStr = "";
      this.tempData.gridDt.forEach(field => {
        tempStr += this.OBJtoXML(field);
      });
      console.log("FINAL XML OUTPUT in generic grid is.... ", tempStr);
      this.gridControl.xmlVal = tempStr;
      this.HandleGridChange.emit(this.gridControl);
    }
    catch(e){
        console.log("Error in HandleGridData :", e)
    }
  }

  OBJtoXML(obj) {
    try{
      var xml = '';
      for (var prop in obj) {
        xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
        if (obj[prop] instanceof Array) {
          for (var array in obj[prop]) {
            xml += "<" + prop + ">";
            xml += this.OBJtoXML(new Object(obj[prop][array]));
            xml += "</" + prop + ">";
          }
        } else if (typeof obj[prop] == "object") {
          xml += this.OBJtoXML(new Object(obj[prop]));
        } else {
          xml += obj[prop];
        }
        xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
      }
      var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
      return xml
    }
    catch(e){
        console.log("Error in OBJtoXML :", e)
    }
  }
}
