import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

declare var $: any;
@Injectable({
  providedIn: 'root',
})
export class SignalrApiService {
  sslUrl = environment.sslURL;
  private hubConnection: any;
  private proxy: any;
  // private ConnectionURL: any =
  //   window.location.protocol +
  //   '//' +
  //   this.sslUrl +
  //   '/FinIQSignalRBonds/signalr/hubs';
  private ConnectionURL: any = this.sslUrl ? 'https://' + environment.domainURL +'/FinIQSignalRBonds/signalr/hubs' : 'http://' + environment.domainURL +'/FinIQSignalRBonds/signalr/hubs'
    //'http://52.163.118.116/FinIQSignalRBonds/signalr/hubs';

  PriceFeed:any = new BehaviorSubject('No Price');
  PriceFeedObs = this.PriceFeed.asObservable();

  BondsPriceFeed :any= new BehaviorSubject(false);
  BondsPriceFeedObs = this.BondsPriceFeed.asObservable();

  NewsAlert :any= new BehaviorSubject(false);
  NewsAlertObs = this.NewsAlert.asObservable();

  NotificationsAlert:any = new BehaviorSubject(false);
  NotificationsAlertObs = this.NotificationsAlert.asObservable();
  isSignalRConnected: boolean;

  constructor() {}

  startConnection() {
    try {
      console.log($);
    this.hubConnection = $.hubConnection();
    this.hubConnection.logging = true;
    const LoggedUser = sessionStorage.getItem('Username');
    this.hubConnection.qs = { User: LoggedUser, Group: 'Notification' };
    this.proxy = this.hubConnection.createHubProxy('MessageHub');
    this.proxy.on('PublishEQPricestoSubsciber', (message) => {
        // console.log(message);
      this.PriceFeed.next(message);
    });
    this.hubConnection.url = this.ConnectionURL;
    this.hubConnection.logging = false;
    this.hubConnection
      // .start({transport: ['webSockets', 'longPolling'] })
      .start({ jsonp: true, transport: ['webSockets', 'longPolling'] })
      .done(() => {
        // $('#btnAdd').click(function () {
        // const stringn = $('#searchNews').val();
          // this.proxy.invoke('sendMessage', 'DJ', 'text');
          // let obj = {
          //   FeedCode: 'JPM',
          //   FeedInfo: [
          //     { FieldName: 'perdiff', FeedValue: '1.22' },
          //     { FieldName: 'netchange', FeedValue: '-0.233' },
          //     { FieldName: 'previousclose', FeedValue: '143.00' },
          //   ],
          // };
          // this.proxy.invoke('PublishEQPricestoSubsciber', JSON.stringify(obj));
        // });
        this.isSignalRConnected = true;
        console.log('Signalr Connected!');
      })
      .fail((e) => {
        console.error('Could not connect ' + e);
      });
    } catch (error) {
      console.error(error);
    }

    this.hubConnection.connectionSlow(() => {
      console.log(
        'We are currently experiencing difficulties with the this.hubConnection.'
      );
    });

    this.hubConnection.disconnected(() => {
      if (this.hubConnection.lastError) {
        this.isSignalRConnected = false;

        console.log(
          'Disconnected. Reason: ',
          this.hubConnection.lastError.message
        );
      }
      setTimeout(() => {
        this.hubConnection.start();
      }, 5000);
      // Restart connection after 5 seconds.
    });

    this.hubConnection.reconnected(() => {});

    // this.proxy.on('PublishEQPricestoSubsciber', (message) => {
    //   // This is where you will get BPIPE PRICES
    //   // console.log(message);
    //   this.PriceFeed.next(message);
    // });

    this.proxy.on('displayMessage', (_sender, _message) => {
      // console.log(sender, message);
    });

    this.proxy.on('OnNotifications', (message) => {
      // notification api
      // console.log('Notifications', message);
      this.NotificationsAlert.next(message);
    });

    this.proxy.on('PublishBondsPriceToSubscriber', (message) => {
      // bonds bpipe prices
      // console.log('BondsPrice', message);
      this.BondsPriceFeed.next(message);
    });

    this.proxy.on('PublishNews', (message) => {
      // news realtime
      // console.log('News', message);
      this.NewsAlert.next(message);
    });
  }
  stopConnection() {
    this.hubConnection;
    // .start({transport: ['webSockets', 'longPolling'] })
    stop();
  }
}
