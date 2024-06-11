import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/services/auth/auth.service';
import { WorkflowUCPService } from 'src/app/services/workflow-ucp.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Element } from '@angular/compiler';

@Component({
  selector: 'app-workflow-dashboard',
  templateUrl: './workflow-dashboard.component.html',
  styleUrls: ['./workflow-dashboard.component.scss'],
})
export class WorkflowDashboardComponent implements OnInit {
  username: any;
  column: any = [];
  dateFilter: string[] = ['1W', '1M', '1Y'];
  selectedTab: string;
  WorkflowList: any = [];
  temp_WorkflowList: any;
  QueueList: any;
  temp_QueueList: any;
  workflowsUCPSubscription: Subscription;
  isUserRM: boolean;
  UserID: string;
  userType: string;
  currDate: Date;
  FromDate: any;
  ToDate: any;
  selectedWorkflowId: any;
  selectedWorkflowType: any;
  // QueueList: any[] = [];
  // temp_QueueList: any;
  today = new Date();
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  date =
    this.today.getDate() +
    '-' +
    this.months[this.today.getMonth()] +
    '-' +
    this.today.getFullYear();
  New_WorkflowList: any;
  isLoading: boolean;
  constructor(public authApi: AuthService, public wfs: WorkflowUCPService, public datePipe: DatePipe,) {
    this.column = [];
    this.selectedTab = '1D';
    this.username = this.authApi.UserName;
  }

  async ngOnInit() {
    this.selectedTab = '1W'
    this.currDate = new Date();
    const date = this.currDate; //Added by Alolika G on 9th Feb 2022
    this.FromDate = this.datePipe.transform(
      new Date(date.setDate(date.getDate() - 7)),
      'yyyy-MM-dd'
    );
    this.ToDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    // console.log('FromDate & ToDate', this.FromDate, this.ToDate);
    this.column[0] = []
    this.column[1] = []
    this.column[2] = []
    this.column[3] = []
    this.UserID = sessionStorage.getItem('Username');

    this.userType = sessionStorage.getItem('UserType');
    if (this.userType === 'RM') {
      this.UserID = sessionStorage.getItem('Username');
    }
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    if (!this.isUserRM) {
      this.UserID = this.authApi.UserName;
    }
    // this.column[0] = [
    //   {
    //     value: 'RFQ Workflow',
    //     tileCode: 'RFQWorkflow',
    //     height: '350px',
    //     column: 1,
    //     row: 2,
    //     disabled: false,
    //   },
    // ];
    // this.column[1] = [
    //   {
    //     value: 'Corporate Action Workflow',
    //     tileCode: 'CorporateActionWorkflow',
    //     height: '350px',
    //     column: 4,
    //     row: 2,
    //     disabled: false,
    //   },
    //   {
    //     value: 'Ticket Workflow',
    //     tileCode: 'TicketWorkflow',
    //     height: '350px',
    //     column: 2,
    //     row: 2,
    //     disabled: false,
    //   },
    // ];
    // this.column[2] = [
    //   {
    //     value: 'Document Workflow',
    //     tileCode: 'DocumentWorkflow',
    //     height: '350px',
    //     column: 3,
    //     row: 2,
    //     disabled: false,
    //   },
    //   {
    //     value: 'Booking Workflow',
    //     tileCode: 'BookingWorkflow',
    //     height: '350px',
    //     column: 3,
    //     row: 1,
    //     disabled: false,
    //   },
    // ];
    // this.column[3] = [
    //   {
    //     value: 'Counterparty Setup Workflow',
    //     tileCode: 'CounterpartySetupWorkflow',
    //     height: '350px',
    //     column: 4,
    //     row: 1,
    //     disabled: false,
    //   },
    // ];
    this.getWorkflowList()

  }
  async getWorkflowList() {
    this.isLoading = true
    const loadWorkflowDashboardRes = await this.wfs.loadWorkflowDashboard(this.UserID);
    // console.log(loadWorkflowDashboardRes[0]);
    this.WorkflowList = [];
    this.temp_WorkflowList = [];
    if (loadWorkflowDashboardRes[0].length !== 0) {

      let tempWorkflowList = loadWorkflowDashboardRes[0].filter((w) => w.Value !== '');

      this.temp_WorkflowList = tempWorkflowList;
      console.log('this.WorkflowList', tempWorkflowList);
      for (var j = 0, length = this.temp_WorkflowList.length; j < length; j++) {
        let loadQueuesDashboardRes: any = await this.wfs.loadQueuesDashboard(this.temp_WorkflowList[j].Id,
          this.authApi.EntityID,
          this.FromDate,
          this.ToDate,
          this.temp_WorkflowList[j].Value,
          this.UserID);
        if (loadQueuesDashboardRes.length !== 0) {
          let queuesList = loadQueuesDashboardRes
          // console.log("QUEUE", queuesList)
          let tempQueue = []
          for (var i = 0, len = queuesList.length; i < len; i++) {
            if (queuesList[i].TokenCount !== 0 && queuesList[i].QM_Name !== '') {
              tempQueue.push({
                title: queuesList[i].Display_Name,
                value: queuesList[i].TokenCount,
                name: queuesList[i].QM_Name,
              });
            }
          }
          // console.log(tempQueue)
          this.temp_WorkflowList[j].QueueList = tempQueue
        }
      }
      // this.temp_WorkflowList.forEach( async (element: any) => {
      //   let loadQueuesDashboardRes: any = await this.wfs.loadQueuesDashboard(element.Id,
      //     this.authApi.EntityID,
      //     this.FromDate,
      //     this.ToDate,
      //     element.Value,
      //     this.UserID);
      //   if (loadQueuesDashboardRes.length !== 0) {
      //     let queuesList = loadQueuesDashboardRes
      //     console.log("QUEUE", queuesList)
      //     let tempQueue = []
      //     for (var i = 0, len = queuesList.length; i < len; i++) {
      //       if (queuesList[i].TokenCount !== 0 && queuesList[i].QM_Name !== '') {
      //         tempQueue.push({
      //           title: queuesList[i].Display_Name,
      //           value: queuesList[i].TokenCount,
      //           name: queuesList[i].QM_Name,
      //         });
      //       }
      //     }
      //     console.log(tempQueue)
      //     element.QueueList = tempQueue
      //   }
      // })
      console.log(this.temp_WorkflowList)
      this.WorkflowList = this.temp_WorkflowList.filter((w) => w.QueueList.length !== 0);
      console.log(this.WorkflowList)
      for (let i = 0; i < this.WorkflowList.length; i) {
        if (i < this.WorkflowList.length) {
          this.column[0].push(this.WorkflowList[i++])
        }
        if (i < this.WorkflowList.length) {
          this.column[1].push(this.WorkflowList[i++])
        }
        if (i < this.WorkflowList.length) {
          this.column[2].push(this.WorkflowList[i++])
        }
        if (i < this.WorkflowList.length) {
          this.column[3].push(this.WorkflowList[i++])
        }
      }
      console.log("DONE")
      this.isLoading = false
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    this.removeEmptyCards();
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // if(event.previousContainer.data[0])
      if (event.previousContainer.data[0].Value !== 'EmptyCard') {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
    if (this.column[0].length === 0) {
      this.addEmptyCard(0);
    } else if (this.column[1].length === 0) {
      this.addEmptyCard(1);
    } else if (this.column[2].length === 0) {
      this.addEmptyCard(2);
    } else if (this.column[3].length === 0) {
      this.addEmptyCard(3);
    } else {
      this.removeEmptyCards();
    }
  }

  addEmptyCard(number: any) {
    this.column[number] = [
      {
        Value: 'EmptyCard',
        height: '350px',
        column: number,
        row: 1,
        disabled: true,
      },
    ];
  }

  removeEmptyCards() {
    //remove empty cards
    const indexOfObject1 = this.column[0].findIndex(
      (object: { Value: string }) => {
        return object.Value === 'EmptyCard';
      }
    );
    console.log(indexOfObject1);
    if (indexOfObject1 !== -1) {
      this.column[0].splice(indexOfObject1, 1);
    }

    const indexOfObject2 = this.column[1].findIndex(
      (object: { Value: string }) => {
        return object.Value === 'EmptyCard';
      }
    );
    console.log(indexOfObject2);
    if (indexOfObject2 !== -1) {
      this.column[1].splice(indexOfObject2, 1);
    }

    const indexOfObject3 = this.column[2].findIndex(
      (object: { Value: string }) => {
        return object.Value === 'EmptyCard';
      }
    );
    console.log(indexOfObject3);
    if (indexOfObject3 !== -1) {
      this.column[2].splice(indexOfObject3, 1);
    }

    const indexOfObject4 = this.column[3].findIndex(
      (object: { Value: string }) => {
        return object.Value === 'EmptyCard';
      }
    );
    console.log(indexOfObject4);
    if (indexOfObject4 !== -1) {
      this.column[3].splice(indexOfObject4, 1);
    }
  }

  async getActiveTab(tab: any) {
    this.WorkflowList = []
    this.currDate = new Date();
    console.log(tab)
    const date = this.currDate; //Added by Alolika G on 9th Feb 2022
    if (tab === 0) {
      this.selectedTab = '1W';
      this.FromDate = this.datePipe.transform(
        new Date(date.setDate(date.getDate() - 7)),
        'yyyy-MM-dd'
      );
      this.ToDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
      this.column[0] = []
      this.column[1] = []
      this.column[2] = []
      this.column[3] = []
      this.getWorkflowList()
    } else if (tab === 1) {
      this.selectedTab = '1M';
      this.FromDate = this.datePipe.transform(
        new Date(date.setDate(date.getDate() - 30)),
        'yyyy-MM-dd'
      );
      this.ToDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
      this.column[0] = []
      this.column[1] = []
      this.column[2] = []
      this.column[3] = []
      this.getWorkflowList()
    } else if (tab === 2) {
      this.selectedTab = '1Y';
      this.FromDate = this.datePipe.transform(
        new Date(date.setDate(date.getDate() - 365)),
        'yyyy-MM-dd'
      );
      this.ToDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
      this.column[0] = []
      this.column[1] = []
      this.column[2] = []
      this.column[3] = []
      this.getWorkflowList()
    }
  }

  async getQueues(id, value) {
    this.selectedWorkflowId = id;
    this.selectedWorkflowType = value;
    let loadQueuesDashboardRes: any = await this.wfs.loadQueuesDashboard(this.selectedWorkflowId,
      this.authApi.EntityID,
      this.FromDate,
      this.ToDate,
      this.selectedWorkflowType,
      this.UserID);
    if (loadQueuesDashboardRes.length !== 0) {
      let queuesList = loadQueuesDashboardRes;
      queuesList.forEach((element) => {
        if (element.TokenCount !== 0 && element.QM_Name !== '') {
          this.QueueList.push({
            title: element.Display_Name,
            value: element.TokenCount,
            name: element.QM_Name,
          });
        }
      })

      // console.log(this.QueueList);
    }
    return this.QueueList
  }
}
