import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isNullOrUndefined } from 'is-what';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { WorkflowUCPService } from 'src/app/services/workflow-ucp.service';

@Component({
  selector: 'app-display-priority',
  templateUrl: './display-priority.component.html',
  styleUrls: ['./display-priority.component.scss']
})
export class DisplayPriorityComponent implements OnInit {

  @Input() wssWflNames:any;
  selectedWfl:any;
  @Output() closedp = new EventEmitter<any>();
  dispPrioTableSub: any;
  tabledata: any;
  startidx = 0
  endidx = 5
  editingidx = null
  editingDP = null
  pageNo: number = 1;
  saveSeqSub: any;
  successMsg: string = '';
  errorMsg:string = '';

  constructor(private wfl:WorkflowUCPService) { }

  ngOnInit(): void {
    if(!isNullOrUndefined(this.wssWflNames)){
      this.selectedWfl = this.wssWflNames[0].WTM_Id // Changed by Mitali D - 12-06-2023 - LGTGTWINT-2107
      this.getDispPrioData();
    }
  }

  ngOnDestroy()
  {
    if(this.dispPrioTableSub){
      this.dispPrioTableSub.unsubscribe();
    }
    if(this.saveSeqSub){
      this.saveSeqSub.unsubscribe();
    }
  }

  onChangeWfl(){
    this.getDispPrioData();
  }

  closepopup() {
    this.closedp.emit();
  }

  getDispPrioData(){
    try {
      this.errorMsg = ''
      // this.successMsg = ''
      this.pageNo = 1
      this.dispPrioTableSub = this.wfl.getDispPriorityTable(this.selectedWfl,sessionStorage.getItem('Username')).subscribe(
        (res)=>{
          this.tabledata = res.getWorkflowBlotterMetaDataResult
          this.tabledata = this.tabledata.filter(x=> x.WBM_Blotter_Header !== 'Actions')
        }
      )
    } catch (error) {
      console.log(error)
    }
  
  }

  cancel(){
    this.editingidx = null
  }

  edit(item,i){
    this.editingidx = i
    this.editingDP = item.WBM_Sequence
  }

  prevPage()
  {
    this.editingidx = null
    if(this.pageNo - 1 > 0 )
    {
      this.pageNo = this.pageNo - 1
      if(this.pageNo === 1 ){
        this.startidx = 0
        this.endidx = 5
      }
      else{
        this.startidx = 5*(this.pageNo-1)
        this.endidx = 5*this.pageNo
      }
    }
  }

  nextPage()
  {
    this.editingidx = null
    let noOfPages = Math.ceil((this.tabledata.length -1)/5) 
    if(this.pageNo + 1 <=  noOfPages )
    {
      this.pageNo = this.pageNo + 1
      this.startidx = 5*(this.pageNo-1)
      this.endidx = 5*this.pageNo
    }
  }

  changePage(){
    this.editingidx = null
    let noOfPages = Math.ceil((this.tabledata.length -1)/5) 
    if(this.pageNo <= noOfPages ){
      if(this.pageNo === 1 ){
        this.startidx = 0
        this.endidx = 5
      }
      else{
        this.startidx = 5*(this.pageNo-1)
        this.endidx = 5*this.pageNo
      }
    }
  }

  allowThreeDigitPosInteger(event:any, callfrompagination=true)  {
    if(callfrompagination){
      if(event.charCode == 13)
      {
        this.changePage()
        return;
      }
    }
     return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57
   };

   save(item){
    this.errorMsg = ''
    this.successMsg =''
    let duplicate = false
    this.tabledata.forEach(element => {
      if( parseInt(element.WBM_Sequence) === parseInt(this.editingDP) && element.WBM_Blotter_Header !== item.WBM_Blotter_Header ){
        duplicate = true
      }
    });

    if(duplicate){
      this.errorMsg = 'Cannot update duplicate display priority'
      return;
    }

    this.saveSeqSub = this.wfl.saveSequenceSettings(item.WBM_Blotter_Header,this.editingDP,this.selectedWfl,
      sessionStorage.getItem('Username'),"Login",item.WSS_UseForFilter).subscribe(
        (res)=>{
          // console.log('saveSequenceSettings--',res)
          if(res.InsertUpdateWorkflowSequenceSettingsResult){
            this.editingidx = null
            this.successMsg = 'Column '+item.WBM_Blotter_Header+' updated successfully'
            this.getDispPrioData();
            this.wfl.dispPriorityChangedReloadBlotter();
          }
          else{
            this.errorMsg = 'Error occured while Saving Display Priority Data'
          }
         
        }
      )
   }
}
