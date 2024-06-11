import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { WorkflowUCPService } from 'src/app/services/workflow-ucp.service';

@Component({
  selector: 'app-dynamic-workflow',
  templateUrl: './dynamic-workflow.component.html',
  styleUrls: ['./dynamic-workflow.component.scss'],
})
export class DynamicWorkflowComponent implements OnDestroy {
  workflowName: string;
  UserID: string;
  CustomerID: string;
  currDate: Date;
  FromDate: string;
  ToDate: any;
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
  WorkflowList: any[];
  temp_WorkflowList: any[];
  selectedWorkflowType: any;
  pageNo = 1;
  recordsPerPage = 10;
  constructor(
    public workflowApi: WorkflowUCPService,
    public authApi: AuthService,
    public commonApi: CommonApiService,
    public title: Title
  ) {
    this.workflowName = 'Investment Proposal and Trade Ideas';
    // this.workflowName = title.getTitle();
  }
  ngOnDestroy(): void {
    this.commonApi.HideSidebar(false);
  }
}
