import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonfunctionService } from './commonfunction.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApifunctionService } from './apifunction.service';
import { Subscription } from 'rxjs';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-fx-order',
  templateUrl: './fx-order.component.html',
  styleUrls: ['./fx-order.component.scss']
})
export class FxOrderComponent implements OnInit, OnDestroy {
  title = 'FXTrading';
  tab = 'Dashboard';
  assetURL: string;
  commonfunction: CommonfunctionService;
  loadingFlag = false;
  check = false;
  checkTrading: boolean;
  apifunction: ApifunctionService;
  templateNames = [];
  selectedTemplate = '';
  showTemplateDdl = false;
  spradValue: string;
  SpreadMultiplier: boolean;
  ShowSubscription: Subscription;
  GetTemplateSubscription: Subscription;
  LoadingCompleteSubscription: Subscription;
  GetFavouriteSubscription: Subscription;
  SpreadValueSubscription: Subscription;
  ConfigValueSubscription: Subscription;
  ConfigChangeSubscription: Subscription;
  constructor(commonfunct: CommonfunctionService, route: Router, location: Location, public afs: ApifunctionService, public ref: ChangeDetectorRef, public webSocketApi: WebsocketService) {
    this.commonfunction = commonfunct;
    this.apifunction = afs;
    route.events.subscribe(_val => {
      if (location.path() !== '') {
        this.tab = location.path().replace(/\//g, '');
      } else {
        this.tab = 'exchangerates';
      }
    });

  }
  ngOnDestroy(): void {
    this.ShowSubscription.unsubscribe();
    this.GetTemplateSubscription.unsubscribe();
    this.LoadingCompleteSubscription.unsubscribe();
    this.GetFavouriteSubscription.unsubscribe();
    this.SpreadValueSubscription.unsubscribe();
    this.ConfigValueSubscription.unsubscribe();
    this.ConfigChangeSubscription.unsubscribe();
  }

  ngOnInit() {
    
    this.apifunction.getCurrencyPairs();
    this.afs.showLoader(true);
    this.assetURL = environment.assetURL;
    this.apifunction.getFavoritesFromTemplate('Template1');
    this.afs.getConfigValue('TradingSwitch_FXTrading');
    this.afs.getConfigValue('SpreadMultiplier_FXTrading');
    this.afs.getConfigValue('CSP_IsStraightToProcess');
    this.apifunction.CustomerSearch("");
    // this.checkTrading = (this.commonfunction.tradingOnOffVar === 'on' ? true : false);
    // this.SpreadMultiplier = (this.commonfunction.spreadMultiplierVar === 'on' ? true : false);

    this.ShowSubscription = this.commonfunction.showobservar.subscribe(show => {
      //console.log(show);
      this.tab = show;
    });
    this.LoadingCompleteSubscription = this.afs.loadingCompleteObserver.subscribe(res => {
      this.loadingFlag = res;
      this.ref.detectChanges();
    });
    this.GetTemplateSubscription = this.apifunction.gettemplateObserver.subscribe(res => {
      if (res.length !== 0) {
        //console.log(res);
        this.templateNames = res;
        this.selectedTemplate = res[0].TemplateName;
        this.showTemplateDdl = !this.showTemplateDdl;
      }
    });
    this.GetFavouriteSubscription = this.apifunction.getfavoriteObserver.subscribe(res => {
      if (res.length !== 0) {
        //console.log(res);
        this.commonfunction.FavoriteCurrencies.next(res);
      }
    });
    this.SpreadValueSubscription = this.commonfunction.spreadvalueObserver.subscribe(value => {
      this.spradValue = value;
    });
    this.ConfigValueSubscription = this.afs.configValueObserver.subscribe(data => {
      if (data.length > 0) {
        let res = data[0]['body']['getConfigValueResult'];
        if (res[0]['Setting_Name'] === 'TradingSwitch_FXTrading') {
          // console.log(res['Default_Value'].toString().toLowerCase());
          this.checkTrading = (res[0]['Default_Value'].toString().toLowerCase() === "on" ? true : false);
          this.commonfunction.tradingOnOff.next(res[0]['Default_Value'].toString().toLowerCase());
          this.commonfunction.tradingOnOffVar = res[0]['Default_Value'].toString().toLowerCase();
        } else if (res[0]['Setting_Name'] === 'SpreadMultiplier_FXTrading') {
          let data = res[0]['Default_Value'].split(';');
          this.SpreadMultiplier = (data[0].toString().toLowerCase() === "on" ? true : false);
          this.commonfunction.spreadvalue.next(data[1]);
          this.commonfunction.spreadMultiplier.next(data[0]);
          this.commonfunction.spreadMultiplierVar = data[0];
        }
      }
    });
    this.ConfigChangeSubscription = this.afs.configChangeResObserver.subscribe(res => {
      if (res.length > 0) {
        if (res[0]['body']['setConfigValueResult'] === true) {
          //console.log('Config value changed succesfully');
        } else {
          //console.log('Fail to change config value');
        }
      }
    });
  }

  changeLanguage() {
    try {
      this.check = !this.check;
      if (this.check) {
        this.commonfunction.lang.next('gr');
      } else {
        this.commonfunction.lang.next('en');
      }

    }
    catch (ex) {
      //console.log(ex);
    }
  }
  getTemplates() {
    try {
      this.apifunction.getTemplatesFromUser();
    }
    catch (ex) {
      //console.log(ex);
    }
  }
  getFavoriteCcyFromSelectedTem() {
    try {
      this.apifunction.getFavoritesFromTemplate(this.selectedTemplate);
      this.commonfunction.selectedTemplate = this.selectedTemplate;
      //console.log(this.commonfunction.selectedTemplate);
    }
    catch (ex) {
      //console.log(ex);
    }
  }
  tabclick(value) {
    try {
      this.tab = value;
    } catch (ex) {
      //console.log(ex);
    }


  }
  transactionRoute() {
    this.commonfunction.show.next('blotter');
  }
  changeTradingOption() {
    this.checkTrading = !this.checkTrading;
    let value = this.checkTrading === true ? 'on' : 'off';
    this.commonfunction.tradingOnOff.next(value);
    this.commonfunction.tradingOnOffVar = value;
    this.apifunction.setConfigValue('TradingSwitch_FXTrading', value)
  }
  changeSpreadMultiplier() {
    this.SpreadMultiplier = !this.SpreadMultiplier;
    let value = this.SpreadMultiplier === true ? 'on' : 'off';
    this.commonfunction.spreadMultiplier.next(value);
    this.commonfunction.spreadMultiplierVar = value;
    this.apifunction.setConfigValue('SpreadMultiplier_FXTrading', value + ';' + this.spradValue);
  }
}
