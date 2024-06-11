import { Component, OnDestroy, OnInit } from '@angular/core';
import { FxdCommonfunctionsService } from 'src/app/components/FXD/services/fxd-commonfunctions.service';
// import { EqcCommonfunctionsService } from '../../Services/eqc-commonfunctions.service'; //commented by UrmilaA | 7-Aug-23 , as currenly using this component only for FXD

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  NotificationsStack: any[];
  showNotification: boolean;
  NotificationType: string;
  durationofNotification: 5000;
  bodyNotification: string;
  headerNotification: string;
  dateandTimeNotification: string;
  NotificationContentSubscriberFXD: any;
  constructor(
    // private EQC_cfs: EqcCommonfunctionsService, //commented by UrmilaA | 7-Aug-23 , as currenly using this component only for FXD
     public FXD_cfs: FxdCommonfunctionsService) {
    this.showNotification = false;
    this.bodyNotification = '';
    this.headerNotification = '';
    this.dateandTimeNotification = '';
    this.NotificationsStack = [];
  }
  ngOnDestroy(): void {
    this.NotificationsStack = [];
    // this.fnCloseNotification();
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {

    // this.fnPushNotificationOnScreen();
    //commented by UrmilaA | 7-Aug-23 , as currenly using this component only for FXD | start
    // this.EQC_cfs.NotificationContentObserver.subscribe(res => {
    //   try {
    //     if (res !== '' && res !== null) {
    //       this.fnSetNotificationData(res.NotificationType, res.header, res.body, res.DateandTime);
    //     }
    //   } catch (ex) {

    //   }
    // });
    //commented by UrmilaA | 7-Aug-23 , as currenly using this component only for FXD | ends

    //FXD Notiofication, Added by Urmila A | 27-Dec-22 | start
    this.NotificationContentSubscriberFXD = this.FXD_cfs.NotificationContentObserverFXD.subscribe(res => {
      try {
        if (res !== '' && res !== null) {
          this.fnSetNotificationData(res.NotificationType, res.header, res.body, res.DateandTime);
        }
      } catch (ex) {
      }
    });
    //FXD Notiofication, Added by Urmila A | 27-Dec-22 | end
  }

  fnSetNotificationData(NotificationType: string, header: string, body: string, DateandTime: string) {
    console.log("notification", header, body, DateandTime);
    switch (NotificationType) {
      case 'Normal':// General

        break;
      case 'Warning':// Warning

        break;
      case 'Error':// Error and Failure

        break;
      case 'Success':// Success

        break;
    }

    this.NotificationsStack.push({
      NotificationType: NotificationType,
      headerNotification: header,
      bodyNotification: body,
      dateandTimeNotification: DateandTime,
      showNotification: false,
      timeout: ''
    });

    // Resetting and assign values to notification contents
    // this.NotificationType = '';
    // this.NotificationType = NotificationType;
    // this.headerNotification = '';
    // this.headerNotification = header;
    // this.bodyNotification = '';
    // this.bodyNotification = body;
    // this.dateandTimeNotification = '';
    // this.dateandTimeNotification = DateandTime;

    this.fnPushNotificationOnScreen(this.NotificationsStack.length - 1);// Push notification on screen

  }

  fnPushNotificationOnScreen(index: number) {
    if (this.NotificationsStack.length > 0) {
      this.NotificationsStack[index].showNotification = true; // Enabled for Testing
      const that = this;
      if (this.NotificationsStack[index].NotificationType !== 'Success') {
        this.NotificationsStack[index].timeout = setTimeout(function () {
          if (that.NotificationsStack.length > 0) {
            clearInterval(that.NotificationsStack[index].timeout);
            that.fnCloseNotification(index);
          }
        }, 5000);
      } else {
        this.NotificationsStack[index].timeout = setTimeout(function () {
          if (that.NotificationsStack.length > 0) {
            clearInterval(that.NotificationsStack[index].timeout);
            that.fnCloseNotification(index);
          }
        }, 10000);
      }
    }


  }

  fnCloseNotification(index: number) {
    if (this.NotificationsStack.length > 0) {
      this.NotificationsStack[index].showNotification = false;
      // this.NotificationsStack.splice(index,1);
    }
    // this.EQC_cfs.fnSetNotification(null); //commented by UrmilaA | 7-Aug-23 , as currenly using this component only for FXD
    this.FXD_cfs.fnSetNotificationFXD(null);  //Added by Urmila A, on 3-Jan-23 | LGTGTWINT-675
  }

  fnClosepopuponButton(index: number) {
    if (this.NotificationsStack.length > 0) {
      this.NotificationsStack[index].showNotification = false;
      // this.NotificationsStack.splice(index,1);
    }

    // this.EQC_cfs.fnSetNotification(null);
  }
  fnCloseAllPopUPNotifications() {
    if (this.NotificationsStack.length > 0) {
      this.NotificationsStack.forEach((res, i) => {
        if (res) {
          this.fnCloseNotification(i);
        }
      });
    }

  }


}
