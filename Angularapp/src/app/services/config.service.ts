import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IAppConfig } from '../models/app-config.model';
// import { firstValueFrom } from 'rxjs';
@Injectable()
export class AppConfig {
  static settings: IAppConfig;
  interfaceURL = environment.interfaceURL;
  isProd: boolean = environment.production;

  // constructor(private http: HttpClient) { }
  // async load() {
  //   let webUrl = 'assets/configs' + (this.isProd ? '.prod' : '') + '.json';
  //   console.log(webUrl);

  //   let configs = this.http.get(webUrl);

  //   const response = await configs.toPromise();
  //   AppConfig.settings = response as IAppConfig;

  //   return response;
  // }
  //Sudarshan | 26-sept-2023 | changed from httpclient get() to fetch() | to avoid HttpBearerTokenInterceptor
  constructor() { }
  async load() {
    let webUrl = 'assets/configs' + (this.isProd ? '.prod' : '') + '.json';   
    fetch(webUrl)
    .then((response) => response.json())
    .then((data) => {
      const response = data;
      AppConfig.settings = response as IAppConfig;
      return response;
    })
    .catch((error) => {
      console.error('Error loading config file:', error);
    });
    //</Sudarshan | 26-sept-2023 >
  }
}