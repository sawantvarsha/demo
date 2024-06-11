import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-generic-div',
  templateUrl: './generic-div.component.html',
  styleUrls: ['./generic-div.component.css']
})
export class GenericDivComponent implements OnChanges {
  genDivHtml: any;

  constructor() { }
  @Input() gridControl: any;
  @Input() width: any;
  @Input() value: any;
  @Output() HandleGridChange = new EventEmitter<any>();

  ngOnChanges(): void {
    this.loadGridData();
  }

  loadGridData() {
    try {
      console.log("Output in Generic Div Component.....", this.gridControl.gridDt.Column1.replace("DataSource:",""))
      this.genDivHtml = this.gridControl.gridDt.Column1.replace("DataSource:","")
      var test = document.getElementById("GenDiv");
      test.innerHTML = this.genDivHtml;
    }
    catch (e) {

    }
  }

}
