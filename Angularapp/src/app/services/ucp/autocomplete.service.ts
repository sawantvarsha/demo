import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { logging } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {

  constructor(private httpService: HttpClient) {
  }

  template_id_change: BehaviorSubject<string> = new BehaviorSubject<string>("");
  templateid: Observable<string> = this.template_id_change.asObservable();

  GetProdSchemeTemplateForSearch(): Observable<any> {
    return this.httpService.post(environment.interfaceURL+'GetProdSchemeTemplateForSearch', {})
  }

  
}
