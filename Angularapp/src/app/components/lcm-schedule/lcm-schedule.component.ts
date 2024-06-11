import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LCMApiService } from 'src/app/services/lcmapi.service';

@Component({
  selector: 'app-lcm-schedule',
  templateUrl: './lcm-schedule.component.html',
  styleUrls: ['./lcm-schedule.component.scss']
})
export class LcmScheduleComponent implements OnInit {

  @Input() data: any;
  notemasterId: any;
  lcmScheduleDataArr: any[] = [];
  headerDetailsArr: any[] = [];
  misc: any[] = [];
  temp: any[] = [];
  visibleRow: boolean[] = [];

  constructor(public datepipe: DatePipe, private lcmapi: LCMApiService) { }

  ngOnInit(): void {
    console.log('schedule', this.data);
    this.notemasterId = this.data["Note_Master_ID"];
    this.getLcmScheduleData();
  }

  getLcmScheduleData() {
    try {
      this.lcmapi.GetProductSchedulefromDB_for_wiki(this.notemasterId).subscribe((data) => {
        data.GetProductSchedulefromDB_for_wikiResult.forEach(element => {
          this.lcmScheduleDataArr.push(element);
          this.headerDetailsArr.push(element.PS_TSM_Code);
        });
        this.headerDetailsArr = [...new Set(this.headerDetailsArr)].sort();
        this.misc = [];
        this.temp = [];
        this.lcmScheduleDataArr.forEach(res => {

          if(this.temp.filter(item=> {return item.PS_TSM_Code === res.PS_TSM_Code}).length === 0){
            this.temp.push({
              "PS_TSM_Code":res.PS_TSM_Code,
              "records":this.lcmScheduleDataArr.filter(item=>{return item.PS_TSM_Code === res.PS_TSM_Code})
            })
          }

          // for (let i = 0 ; i < this.headerDetailsArr.length ; i++) {
          //   if (this.headerDetailsArr[i] === res.PS_TSM_Code) {
          //     this.misc.push({"key" : res.PS_TSM_Code, "value" :  res.PS_Fixing_Date});
          //   }
          //   console.log('headerDetailsArr', this.misc, this.misc.sort((a,b) => a.key.localeCompare(b.key)));
          // }
        });
        let sortedArr = [];
        this.temp.sort( (a,b)=> (a.PS_TSM_Code > b.PS_TSM_Code) ? 1: -1 )
;         
       
        console.log('lcmScheduleDataArr', this.lcmScheduleDataArr, this.headerDetailsArr, this.temp);
        for (let i = 0; i < this.temp.length; i++){
          this.visibleRow[i] =  true;
        }
      });



    } catch (error) {

    }
  }

  expandRow(index){
    this.visibleRow[index] = !this.visibleRow[index]; 
  }


}
