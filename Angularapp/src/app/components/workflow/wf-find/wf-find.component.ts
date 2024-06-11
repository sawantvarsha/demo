import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkflowUCPService } from 'src/app/services/workflow-ucp.service';

@Component({
  selector: 'app-wf-find',
  templateUrl: './wf-find.component.html',
  styleUrls: ['./wf-find.component.scss']
})
export class WfFindComponent implements OnInit {

  @Output() closewf = new EventEmitter<any>();
  @Output() goToWf = new EventEmitter<any>();
  showTable: boolean = false
  searchToken: string;
  searchRefSub: Subscription;
  searchRes: any;

  constructor(private wfs: WorkflowUCPService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.searchRefSub)
      this.searchRefSub.unsubscribe();
  }

  closepopup() {
    this.closewf.emit();
  }

  searchRef() {
    this.showTable = false;
    try {
      if(this.searchToken.length)
      {
        this.searchRefSub = this.wfs.GetSearchedRef(this.searchToken.trim()).subscribe(
          (res) => {
            this.searchRes = res.GetSearchedRefResult
            this.showTable = true;
          }
        )
      }
     

    } catch (error) {
      console.log(error)
    }

  }

  clear()
  {
    this.searchToken = ''
    this.searchRes = []
  }

  navigateToWF(wfl)
  {
    this.goToWf.emit({wfl:wfl,refNo:this.searchToken.trim()})
  }

}
