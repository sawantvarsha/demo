import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  interfaceURL = environment.interfaceURL;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(public http: HttpClient) {}

  DB_GetProductList(PageNumber, RowsPerPage, SearchColumns, SearchKeywords) {
    try {
      const url =
        this.interfaceURL +
        'GetFilteredProductWatchlistForProductFeatureDetails';
      const parameters = {
        PageNumber,
        RowsPerPage,
        SearchColumns,
        SearchKeywords,
      };

      return this.http.post<any>(url, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
