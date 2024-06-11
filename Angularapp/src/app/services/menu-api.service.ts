import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppConfig } from 'src/app/services/config.service';
@Injectable({
  providedIn: 'root'
})
export class MenuApiService {
  interfaceURL = environment.interfaceURL;
  mainMenuArr: any[];
  subMenuArr: any[];

  constructor(public http: HttpClient) {
    this.mainMenuArr = [];
    this.subMenuArr = [];
  }


  getMenu(userType) {
    const webMethod = this.interfaceURL + 'GetMenuDetails';
    const parameters = {
      UserType: userType
    };
    return this.http.post(webMethod, parameters);
  }

  updateMenuPosition(portalType, menu, submenu, displayYN, position, App_ID, path) {
    const webMethod = this.interfaceURL + 'UpdateMenuPosition';
    const parameters = {
      LoginType: portalType,
      Menu: menu,
      Submenu: submenu,
      DisplayYN: displayYN,
      Position: position,
      Path: path,
      App_ID
    };
    return this.http.post(webMethod, parameters);
  }

  addMenu(portalType, menu, submenu, displayYN, position, App_ID, path) {
    const webMethod = this.interfaceURL + 'UpdateMenu';
    const parameters = {
      LoginType: portalType,
      Menu: menu,
      SubMenu: submenu,
      DisplayYN: displayYN,
      RouterLink: path,
      Position: position,
      Icon: 'workflow-icon',
      AppID: App_ID
    };
    return this.http.post(webMethod, parameters);
  }

  async GetSidebar(groupid: any) {
    try{
      
      const URL =  AppConfig.settings.apiBaseUrl + 'csp/GetSidebar';
      const params = {
        LoginType : groupid
      };
      const response = this.http.post(URL,params);
    
      return await response.toPromise();
    }
    catch (error) {
        return;
      }
  }
  // async GetSidebar(groupId: string) {
  //   const webMethod = AppConfig.settings.apiBaseUrl + 'csp/GetSidebar';
  //   const parameters = {
  //     LoginType: groupId
  //   };
  //   return await this.http.post(webMethod, parameters).toPromise();
  //   // this.http.post<any>(webMethod + "", parameters).subscribe((res) => {
  //   //   that.getSidebarData.next(res);
  //   // });
  // }
}
