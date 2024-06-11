import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppConfig } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class EventDatesService {
  interfaceURL = environment.interfaceURL;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(public http: HttpClient) { }

  // BackTest API URL
  WhatIfMultipleBackTest(
    NoteMasterID,
    TemplateID,
    NoOfTestCases,
    StartDate,
    EntityID,
    AssetClass
  ) {
    try {
      const webMethod = this.interfaceURL  + 'WhatIfMultipleBackTest';
      const parameters = {
        NoteMasterID,
        TemplateID,
        NoOfTestCases,
        StartDate,
        EntityID,
        AssetClass,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) { }
  }


  GetProductSchedulefromDB_for_wiki(note_master_id) {
    try {
      const url  =AppConfig.settings.apiBaseUrl + "pfd/GetEventDateForProductFeatureDetails";
      const parameters = {
        note_master_id
      };
      return this.http.post<any>(url, parameters)
    } catch (error) {
    }
  }
  
  
}

