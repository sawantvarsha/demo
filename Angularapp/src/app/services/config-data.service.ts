import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigDataService {
  interfaceURL: string = environment.interfaceURL;

  constructor(public http: HttpClient) { }

  async GetSourceLink(): Promise<any> {

    const webMethod = this.interfaceURL + 'GetSourceLink';


    return this.http.get(webMethod).toPromise();
  }

}
