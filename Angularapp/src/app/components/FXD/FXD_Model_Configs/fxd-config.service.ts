import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FXDConfig } from './fxdconfig.model';

@Injectable()
export class FXDConfigService {

  static settings: FXDConfig;
  isProd: boolean = environment.production;
  constructor(private http: HttpClient) { }

  loadFXDConfigs(){
    // let webUrl = 'src/app/components/FXD/FXD_Model_Configs/fxd-config' + (this.isProd ? '.prod' : '') + '.json';
    let webUrl = 'E:/UrmilaAhire/BitBucket/finiq_gateway_mapleapi_repository/Source_Code/Gateway_Markets/Gateway_Markets/src/app/components/FXD/FXD_Model_Configs/fxd-config.json';
    console.log('FXD config Url :',webUrl);
    let configs = this.http.get(webUrl);

    return new Promise<void>((resolve, reject) => {
      this.http
        .get(webUrl)
        .toPromise()
        .then((response: FXDConfig) => {
          FXDConfigService.settings = response as FXDConfig;
          resolve();
        })
        .catch((response: any) => {
          reject(`Could not load api: ${JSON.stringify(response)}`);
        });
    }).catch((err) => console.log(err));

  }
}
