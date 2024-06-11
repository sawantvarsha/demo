import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class FinancialService {
  interfaceURL = environment.interfaceURL;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(public http: HttpClient) { }

  DB_GetFinancialDetails(productID) {
    try {
        const url = this.interfaceURL + `GetProductFinancialsForFeatureDetails?productID=${productID}` ;
        
          console.log("response");
          
          return this.http.get<any>(url, {
            headers: this.headerOptions,
          })
        }  catch (error) {
        } 
}

}
