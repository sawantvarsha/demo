import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuditTrailService {
  interfaceURL = environment.interfaceURL;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(public http: HttpClient) {}

  DB_GetAuditDetails(
    NoteMasterID,
    serialNo,
    templateID,
    LoginId,
    EntityID,
    sUserGroup
  ) {
    try {
      const webMethod =
        this.interfaceURL + 'GetProductAuditDetailsForProductFeatureDetails';
      const parameters = {
        NoteMasterID,
        serialNo,
        templateID,
        LoginId,
        EntityID,
        sUserGroup,
      };
      return this.http.post<any>(webMethod, parameters, {
        headers: this.headerOptions,
      });
    } catch (error) {}
  }
}
