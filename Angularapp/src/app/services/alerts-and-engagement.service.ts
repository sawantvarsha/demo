import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

import { HttpHeaders } from '@angular/common/http';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Injectable({
  providedIn: 'root',
})
export class AlertsAndEngagementService {
  constructor() {}

  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  interfaceUrl = environment.interfaceURL;

  private SendEmailObserver = new BehaviorSubject<any>([]);
  SendEmail = this.SendEmailObserver.asObservable();

  sendEmailUsingEmailSetting(USER_ID, EMAIL_SUBJECT, EMAIL_BODY, EMAIL_TO) {
    try {
      const webMethod = this.interfaceUrl + 'Get_SendEmailUsingEmailSetting';
      // console.log(webMethod);
      const that = this;
      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
        data: JSON.stringify({
          EmailSettingName: 'EmailSetting',
          EmailAlertName: 'AlertsAndEngagements',
          _Deal_No: 100,
          _Dealtype: 13,
          _dealSubType: 'AlertsAndEngagements',
          _DataType: 7,
          _ProductType: 0,
          Entity_ID: 6,
          AttachmentFullPath: '',
          ENS_ID: 100,
          Ens_Misc1: 100,
          ENS_Misc2: '',
          AppUserId: USER_ID, //Arctic
          Email_Limit_Counter: 3,
          Email_Limited_Log: 'N',
          UseStandardReferanceNo: false,
          UseEmailQTable: false,
          RFQID: '',
          misc4: '',
          misc5: '',
          UseEmailBodyByDocgen: false,
          EmailBodyByUser: '',
          UseEmailSubjectByDocgen: false,
          EmailSubject: '',
          ens_misc6: '',
          ens_misc7: '',
          ens_subject: EMAIL_SUBJECT,
          ENS_Email_Body: EMAIL_BODY,
          TOEmailByUser: true,
          TOEmailID: EMAIL_TO,
          CCEmailByUser: false,
          CCEmailID: '',
          BCCEmailByUser: false,
          BCCEmailID: '',
          ens_misc8: '',
          ens_misc9: '',
          ens_misc10: '',
        }),
        processData: false,
        success(data) {
          that.SendEmailObserver.next(data);
        },
      });
    } catch (error) {
      // console.error(error);
    }
  }
}
