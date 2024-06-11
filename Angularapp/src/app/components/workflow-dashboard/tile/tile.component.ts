import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { WorkflowUCPService } from 'src/app/services/workflow-ucp.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() FromDate: any;
  @Input() ToDate: any;
  @Input() card: any;
  productsChartData: any;
  expand: boolean[] = [];
  UserID: string;
  selectedWorkflowId: any;
  selectedWorkflowType: any;
  QueueList: any[] = [];
  temp_QueueList: any;
  userType: string;
  isUserRM: boolean;

  constructor(public wfs: WorkflowUCPService, public authapi: AuthService,) { }

  ngOnInit(): void {
    this.UserID = sessionStorage.getItem('Username');
    this.userType = sessionStorage.getItem('UserType');
    if (this.userType === 'RM') {
      this.UserID = sessionStorage.getItem('Username');
    }
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    if (!this.isUserRM) {
      this.UserID = this.authapi.UserName;
    }
    // console.log(this.authapi.EntityID)
    // this.getQueues(this.card)

    this.productsChartData = [
      {
        title: "Participation",
        value: 34
      },
      {
        title: "Autocall",
        value: 20
      },
      {
        title: "CLN(%)",
        value: 14
      },
      {
        title: "RC",
        value: 10
      },
      {
        title: "BEN(%)",
        value: 7
      },
      {
        title: "DRA Autocall(%)",
        value: 5
      },
      {
        title: "Dual FI DRA Autocall(%)",
        value: 4
      },
      {
        title: "Dual FI RC(%)",
        value: 1.5
      },
      {
        title: "DRA Autocall(%)",
        value: 1.5
      },
      {
        title: "Other",
        value: 3
      }
    ]
  }
  // async getQueues(card: any) {
  //   this.selectedWorkflowId = card.Id;
  //   this.selectedWorkflowType = card.Value;
  //   let loadQueuesDashboardRes: any = await this.wfs.loadQueuesDashboard(this.selectedWorkflowId,
  //     this.authapi.EntityID,
  //     this.FromDate,
  //     this.ToDate,
  //     this.selectedWorkflowType,
  //     this.UserID);
  //   if (loadQueuesDashboardRes.length !== 0) {
  //     let queuesList = loadQueuesDashboardRes;

  //     queuesList.forEach((element) => {
  //       if (element.TokenCount !==0 && element.QM_Name !== ''){
  //         this.QueueList.push({
  //           title: element.Display_Name,
  //           value: element.TokenCount,
  //           name: element.QM_Name,
  //         });
  //       }
  //     })
  //     // console.log(this.QueueList);
  //   }
  // }
  expandRow(index) {
    this.expand[index] = !this.expand[index];
    console.log(this.expand)
  }
}
