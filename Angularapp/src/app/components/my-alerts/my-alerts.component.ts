import { Component, HostListener, OnInit } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-my-alerts',
  templateUrl: './my-alerts.component.html',
  styleUrls: ['./my-alerts.component.scss'],
})
export class MyAlertsComponent implements OnInit {
  myAlerts: any[];
  Attachment: any;
  attachmentMsg: string;
  showDescription: boolean;
  subject: any;
  alertsList: any;
  ScheduledOption: any;
  StartDate: any;
  EndDate: any;
  selected_frequency_option: any;
  emailBody: any;
  selectedCustomer: any;
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.showDescription = false;
    }
  }
  constructor(
    public commonApi: CommonApiService,
    public utilitiesApi: UtilitiesService,
    public homeApi: HomeApiService
  ) {
    this.myAlerts = [];
  }

  ngOnInit(): void {
    this.getScheduledAlerts();
  }
  getScheduledAlerts() {
    this.utilitiesApi
      .Get_ClientAlertEngagementDetails(
        this.homeApi.RMID,
        this.homeApi.CustomerId.toString()
      )
      .subscribe((res: any) => {
        console.log(res);
        if (res.length) {
          this.myAlerts = res;
        }
      });
  }
  refresh() {
    this.getScheduledAlerts();
  }
  showPDF(alert) {
    this.Attachment = alert.CAE_Attachment;
    if (this.Attachment === '') {
      this.attachmentMsg = 'No Attachment Found';
    } else {
      window.open(this.Attachment);
    }
  }
  closeAlertsPopup() {
    this.showDescription = false;
  }
  showDescriptionFn(alert: any) {
    this.showDescription = !this.showDescription;
    this.subject = alert.CAE_Subject;
    this.ScheduledOption = alert.CAE_Alert_Type;
    this.StartDate = alert.CAE_Start_Datetime;
    this.EndDate = alert.CAE_End_Datetime;
    this.selected_frequency_option = alert.CAE_Frequency;
    this.emailBody = alert.CAE_Description;
    this.selectedCustomer = alert.CustomerName;
  }
}
