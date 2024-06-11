import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AppConfig } from 'src/app/services/config.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  socketURL = '/FinIQService/WSCallback.svc';
  sslURL = environment.sslURL;
  isSSl = environment.isSSL;
  socket$: WebSocketSubject<any>;
  constructor(public authApi: AuthService) {
    // this.socket$.isStopped = true;
    if (this.isSSl) {
      // this.socketURL = 'wss://' + this.sslURL + this.socketURL;
      // console.log('Socket URL', this.socketURL);
      this.socketURL =
        'ws://' + AppConfig.settings.CSP_FXPricingURL + this.socketURL;
      //console.log('Socket URL', this.socketURL);
    } else {
      this.socketURL =
        'ws://' + AppConfig.settings.CSP_FXPricingURL + this.socketURL;
      //console.log('Socket URL', this.socketURL);
    }
  }
  startSocket() {
    console.log('MASTERSUBSCRIBE|' + this.authApi.UserName);
    this.socket$ = webSocket({
      url: this.socketURL,
      serializer: (data) => data.message,
      // deserializer: (e) => JSON.stringify(e),
      openObserver: {
        next: () => {
          try {
            this.socket$.next({
              message: 'MASTERSUBSCRIBE|' + this.authApi.UserName,
            });
            this.socket$.isStopped = false;
          } catch (error) {}
        },
      },
      closeObserver: {
        next: () => {
          try {
            if (this.socket$) {
              this.socket$.isStopped = true;
            }
            this.startSocket();
          } catch (error) {}
        },
      },
    });
  }

  closeSocket() {
    this.socket$.unsubscribe();
    this.socket$.isStopped = true;
    this.socket$ = null;
  }
}
