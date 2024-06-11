import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { FxdApifunctionService } from './fxd-apifunction.service';
import { FxdCommonfunctionsService } from './fxd-commonfunctions.service';
import { environment } from 'src/environments/environment';

declare var $: any;


@Injectable({
  providedIn: 'root'
})
export class FXDSignalRService {


public hubConnection: any;
public proxy: any;
public split_data:any
public isConnected = false;

public ConnectionID:any;
public FXDDignalRurl:any; //declared by Urmila A, 3-april-23


constructor(private http: HttpClient, public FXD_afs: FxdApifunctionService) {
  this.isConnected = false;
 
  
}



//Added by Urmila A, 18-May-23 | Final Working code for SignalR, RFS | LGTCLI-361 | start
 firstloadSignalR():any{ //function name changed by UrmilaA | LGTCLI-361
  try {
   
    
  
    // $.connection.hub.url = "http://52.163.252.20/FinIQ_FXD_SignalR_Pricer/signalr/hubs";   //dev url 
    $.connection.hub.url = environment.SignalREndpoint + "/FinIQ_FXD_SignalR_Pricer/signalr/hubs";  //urmilaA | 5-June-23 
    
    // $.connection.hub.url = "https://uat.test-bestpriceexecution.com/FinIQ_FXD_SignalR_Pricer/signalr/hubs";  
    this.proxy = $.connection.notificationHub;
    $.connection.hub.logging = true;
  
    this.proxy.client.getFXDResponse = (msg) => {
      if(msg !== '' || msg !== null || msg !== undefined){ //null check added by UrmilaA | LGTCLI-361
        this.split_data = msg.split("|");              
        console.table(this.split_data) //added by UrmilaA, LGTCLI-361
        this.FXD_afs.FXDSignalRBroadcastMsg.next(this.split_data)  
      }
     
    };

   
    $.connection.hub.start().done(function () {
      console.log("firstload Connection id :" + $.connection.hub.id, $.connection.hub, $.connection);
      
    });

    $.connection.hub.connectionSlow(function () {
      console.log(
        "We are currently experiencing difficulties with the connection."
      );
    });
    $.connection.hub.error(function (error) {
      console.log("SignalR error: " + error);
    });

  } catch (e) {
    console.log("firstload : " + e.message);
  }
}



callHub(quoteID) :any{
  try {  
    this.proxy.server.connectNew(sessionStorage.getItem('Username'),quoteID, 90)
    .fail(function (error) {
      console.log("connectNew error: " + error);
    });
  
  } catch (e) {
    console.log("callHub : " + e.message);
  }

}

//added by UrmilaA | 6-June-23 | LGTCLI-361 | start
closeSignalR(){
  try{ 
      $.connection.hub.stop(function() {
        console.log('Disconnected from signalR')
      });
  }catch(ex){console.log(ex.message)}
}
//added by UrmilaA | 6-June-23 | LGTCLI-361 | ends

//Added by Urmila A, 18-May-23-23 | Final Working code for SignalR, RFS | LGTCLI-361 | ends






}



