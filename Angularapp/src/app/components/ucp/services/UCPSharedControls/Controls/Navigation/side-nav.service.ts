import { Injectable, ElementRef, ViewChild,EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { AutocompleteService } from '../../../UCP/LayoutDesignControls/autocomplete.service';
@Injectable({
  providedIn: 'root'
})
export class SideNavService {
   sidenav: MatSidenav;
  selectedtemplate: any;
  templateselected: any;
  public subject = new BehaviorSubject<any>("");
public setSideNav(sidenav:MatSidenav){
  this.sidenav=sidenav;
  
}
public setTemplateValue(templateselected:any){
  debugger;
  this.selectedtemplate=templateselected;
   console.log(this.selectedtemplate);
}

sendTemplate(message: any) {
  if(message==""){
  this._autodata.GetProdSchemeTemplateForSearch().subscribe(  
      data => { 
        
          message=data.GetProdSchemeTemplateForSearchResult[1].ST_Template_ID;
          this.subject.next({text:message});
         
      });
     }
    else{
      this.subject.next({text:message});
      sessionStorage.setItem('TemplateID',message);
    }
}

getTemplate(): Observable<any> {
    return this.subject.asObservable();
}
  constructor( private _autodata: AutocompleteService,) { 

   } 

}
