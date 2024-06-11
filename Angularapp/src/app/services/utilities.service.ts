import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppConfig } from './config.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  interfaceURL = environment.interfaceURL;
  alertCount: number;
  constructor(public http: HttpClient) {
    this.alertCount = 0;
  }
  private VideoInfoObserver = new BehaviorSubject<any>([]);
  public VideoInfo = this.VideoInfoObserver.asObservable();
  async PitchBookGetUserId() {
    try {
      let parameters = {};
      let url = this.interfaceURL + 'PitchBookGetUserId';
      const userID = await this.http
        .get<string>(url, parameters)
        .toPromise()
        .then((res: any) => {
          return res.GetUserResult.filter(
            (u) =>
              u.Group_id.toUpperCase() ===
              AppConfig.settings.CSP_Pitchbook_UserID.toUpperCase()
          )[0].User_Id;
        });
      return userID;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }
  PitchBookGetUserBooksView(UserId: any, mode: any) {
    try {
      let parameters = {
        UserId: UserId,
        mode: mode,
      };
      let url = this.interfaceURL + 'PitchBookGetUserBooksView';
      return this.http.post(url, parameters);
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }

  PitchBookGetBookDetails(BookId: any) {
    try {
      let parameters = {
        BookId: BookId,
      };
      let url = this.interfaceURL + 'PitchBookGetBookDetails';
      return this.http.post(url, parameters);
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }
  getVideoInfo() {
    try {
      const webMethod = this.interfaceURL + 'ExecGenericStoredProcedure';
      const parameters = {
        StoredProcedureName: 'USP_Training_Material_MasterDetails',
        Param1: 'FINIQ_COMMON',
      };
      this.http.post(webMethod, parameters).subscribe((res) => {
        if (res) {
          this.VideoInfoObserver.next(res);
        }
      });
    } catch (error) {}
  }
  Get_ClientAlertEngagementDetails(rmid, custtID) {
    try {
      const webMethod = this.interfaceURL + 'Get_ClientAlertEngagementDetails';
      const parameters = {
        RMID: rmid,
        customerId: custtID,
      };
      return this.http.post(webMethod, parameters);
    } catch (error) {}
  }


  
  Insert_ClientAlertEngagementDetails(CAE_Active_YN, CAE_Alert_Type, CAE_Attachment, CAE_Created_At, CAE_Created_By, CAE_Customer_ID, CAE_Description, CAE_End_Datetime, CAE_Frequency, CAE_ID, CAE_LastEmail_Sent_At,CAE_LastEmail_Sent_By, CAE_RM_ID, CAE_Start_Datetime,CAE_Subject ) {
    try {
      const webMethod = this.interfaceURL + 'Insert_ClientAlertEngagementDetails';
      const parameters = {
        CAE_Active_YN: CAE_Active_YN,
        CAE_Alert_Type: CAE_Alert_Type,
        CAE_Attachment :CAE_Attachment,
        CAE_Created_At : CAE_Created_At,
        CAE_Created_By : CAE_Created_By,
        CAE_Customer_ID : CAE_Customer_ID,
        CAE_Description : CAE_Description,
        CAE_End_Datetime : CAE_End_Datetime,
        CAE_Frequency : CAE_Frequency,
        CAE_ID : CAE_ID,
        CAE_LastEmail_Sent_At : CAE_LastEmail_Sent_At,
        CAE_LastEmail_Sent_By : CAE_LastEmail_Sent_By,
        CAE_RM_ID : CAE_RM_ID,
        CAE_Start_Datetime : CAE_Start_Datetime,
        CAE_Subject : CAE_Subject

      };
      return this.http.post(webMethod, parameters);
    } catch (error) {}
  }

  Insert_RM_ReminderNotesDetails(RMR_Active_YN, RMR_Created_At, RMR_Created_By, RMR_Description, RMR_ID, RMR_Login,RMR_Modified_At, RMR_Modified_By, RMR_RM_ID, RMR_Title, RMR_Mode ) {
    try {
      const webMethod = this.interfaceURL + 'Insert_RM_ReminderNotesDetails';
      const parameters = {
        RMR_Active_YN: RMR_Active_YN,
        RMR_Created_At: RMR_Created_At,
        RMR_Created_By: RMR_Created_By,
        RMR_Description: RMR_Description,
        RMR_ID : RMR_ID,
        RMR_Login : RMR_Login,
        RMR_Modified_At : RMR_Modified_At,
        RMR_Modified_By :RMR_Modified_By,
        RMR_RM_ID : RMR_RM_ID,
        RMR_Title : RMR_Title,
        RMR_Mode : RMR_Mode

      };
      return this.http.post(webMethod, parameters);
    } catch (error) {}
  }


  //Last modified by Apurva K|| 08-May-2023
  Get_RM_ReminderNotesDetails(rmid) {
    try {
      //const webMethod = this.interfaceURL + 'Get_RM_ReminderNotesDetails';
      const webMethod = this.interfaceURL + 'client/ClientAlertEngagement/GetRMReminderNotesDetails';
      const parameters = {
        loginID : AppConfig.settings.oRes.userName,
        rmid: AppConfig.settings.oRes.userName,
        misc1:"",
        misc2:""
      };
      console.log(parameters,"params getRmReminderDetails")
      return this.http.post(webMethod, parameters).toPromise();
    } catch (error) {}
  }
}
