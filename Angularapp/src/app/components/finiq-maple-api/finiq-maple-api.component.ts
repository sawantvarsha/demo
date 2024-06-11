import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-finiq-maple-api',
  templateUrl: './finiq-maple-api.component.html',
  styleUrls: ['./finiq-maple-api.component.scss']
})
export class FiniqMapleAPIComponent implements OnInit {

  constructor() { }

  templateList: any;
  selected_template : any;
  Default_template : any;

  ArrayOfComponents = ["ELN","FCN", "DRA", "BEN", "AQDQ", "Phoenix", "Option", "Spot", "Strategies", "FX AQ", "Cash FX", "Deposits", "ELI", "EQ Options", "FX PIVOT", "Snowball", "AvgAutocall", "RELCI", "BEI", "FCI", "DCI", "FX DQ", "Bonds", "Mutual Funds", "Insurance", "FX TRF", "RANGE ACCRUAL", "WoBAutocall", "ELCI", "TwinWin", "SPS"];
  templateFlag = false;
  booleanArr = [];

  templateName = "";
  newTemplate = [];
  

  ngOnInit(): void {
    this.Default_template = "EQC";
   

    for(let i = 0; i < this.ArrayOfComponents.length; i++ ){
      this.booleanArr[i] = false;
    }
    this.templateList = ["Movie", "Cash FX", "FXD", "EQC", "EQ", "SI +  SD" ];
  }
  
  selectedTemplate(template, _index){
    console.log("selected template ",this.selected_template);
     // this.newTemplate = [];
     this.Default_template = template;
     this.templateFlag = false;

 }

  selectedTemplateList(template, index){
     console.log("selected template ",this.selected_template);
      // this.newTemplate = [];
      this.selected_template = template;
    
      this.booleanArr[index] = !this.booleanArr[index];
      console.log("boolean array of components..",  this.booleanArr);
      this.newTemplate.push(this.selected_template);
  
  }

  createTemplate(){
    this.templateFlag = true;
  }

  saveTemplate(){
    // this.templateFlag = !this.templateFlag;
    console.log("save template", this.templateName);
    this.templateList.push(this.templateName);
    console.log("template", this.templateList);
    console.log("template list new", this.newTemplate);
  }
 
    
  // drop(event: CdkDragDrop<string[]>) {
  //   console.log("..", event, event.previousIndex,  event.currentIndex)
  //   moveItemInArray(this.selected_template, event.previousIndex, event.currentIndex);
  //   }

}
