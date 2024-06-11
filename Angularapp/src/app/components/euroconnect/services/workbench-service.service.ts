// Changes added by Mayuri D. on 06-July-2022.

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from 'src/environments/environment';
import { EcCommonService } from './ec-common.service';
import { AppConfig } from 'src/app/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class WorkbenchServiceService {

  constructor(public commonfunctions: EcCommonService,
    public http: HttpClient) { }

  interfaceUrl = environment.interfaceURL;

  RMWProductDetails: any;
  likeProductFlag: any;
  unlikeProductFlag: any;
  productattachmentlist: any;
  folders: any;
  saveproducttofolderresp: any;
  MappedUsersAndGroupsArr: any;
  getSharedPortfolioAccessList: any;
  GetClientProdDetailsArr: any;
  public backTestPopUp = new BehaviorSubject(false);
  backTestPopUpObs = this.backTestPopUp.asObservable();

  public lifecyclePopUp = new BehaviorSubject(false);
  lifecyclePopUpObs = this.lifecyclePopUp.asObservable();


  async GetShareHistoricalData(UnderlyingCode) {
    const webMethod = this.interfaceUrl + 'GetShareHistoricalData';
    const parameters = {
      UnderlyingCode,
    };

    return this.http.post(webMethod, parameters).toPromise();
  }

  // async FetchFolderList() {
  //   const webMethod = this.interfaceUrl + 'FetchFolderList';
  //   let fetchFolderList = [];
  //   const parameters = {
  //     user_id: (this.commonfunctions.getLoggedInUserName())[0].UserId,

  //   };

  //   return this.http.post(webMethod, parameters).toPromise();
  //   const that = this;
  //   const response = '';
  //   $.ajax({
  //     async: false,
  //     crossDomain: true,
  //     type: 'POST',
  //     url: webMethod,
  //     data: JSON.stringify(parameters),
  //     contentType: 'application/json; charset=utf-8',
  //     dataType: 'json',
  //     headers: {
  //       'Cache-Control': 'no-cache',
  //       'Access-Control-Allow-Origin': '*'
  //     },
  //     success(data) {
  //       //console.log(data)
  //       fetchFolderList = data.FetchFolderListResult;
  //     },
  //     error() {
  //     }
  //   });
  //   return fetchFolderList;
  // }



  //ADDED for folder popup data by Riddhi P \\ 9jan  
  // Fetch Userwise folder
  
  //Modified to remove AJAX call by RajeshC & AdilP
  async FetchFolderList() {
    try {
      //const webMethod = this.interfaceUrl + 'FetchFolderList';
      const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/rmworkstation/FetchFolderList';
      let fetchFolderList = [];
      const parameters = {
        "user_id": AppConfig.settings.oRes.userID,

      };
      const that = this;
      const response = '';
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     //console.log(data)
      //     fetchFolderList = data.FetchFolderListResult;
      //   },
      //   // error(error) {
      //   // }

      // });

      // return fetchFolderList;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        

        // return data.FetchFolderListResult;
        return data ? data : null;  //added by AdilP 
      })
    } catch (error) {
      console.log("Error: " + error)
    }
  }

  // Create folder
  //Modified to remove AJAX call by RajeshC & AdilP
  async CreateFolder(FolderName: any, NoteMasterID: any, Mode: any) {
    try {
      
      //const webMethod = this.interfaceUrl + 'CreateFolder';
      const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/rmworkstation/CreateFolder';
      let createfolderres = [];
      const parameters = {
        'user_id': AppConfig.settings.oRes.userID,
        'folder_name': FolderName,
        'nm_id': NoteMasterID,
        'mode': Mode
      };
      const that = this;
      const response = '';
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     //console.log(data['Create_FolderResult'])
      //     createfolderres = data;
      //   },
      //   error() {
      //   }
      // });
      // return createfolderres;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        
        return data;});

    } catch (e) {
      console.log("Error: " + e);
    }
  }


//Modified to remove AJAX call by RajeshC & AdilP
  async UDTForRMOrderSave1(Note_Master_ID, NominalAmount, RMID, RMNAME, Ccy, CustomerID, CustomerName, MinCoupon, onBehalfOf) {
    try {
      let res: any;
      //const webMethod = this.interfaceUrl + 'UDTForRMOrderSave';
      //const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/rmworkstation/UDTForRMOrderSave';
      const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Order/UDTForRMOrderSave';
      const parameters = {
        // 'Note_Master_ID': Note_Master_ID,
        // 'Login_ID': AppConfig.settings.oRes.userID,
        // 'Entity_ID': AppConfig.settings.oRes.homeEntityID,
        // 'NominalAmount': NominalAmount,
        // 'RMID': RMID,
        // 'RMNAME': RMNAME,
        // 'Ccy': Ccy,
        // 'CustomerID': CustomerID,
        // 'CustomerName': CustomerName,
        // 'MinCoupon': MinCoupon,
        // 'onBehalfOf': onBehalfOf


        "Note_Master_ID": Note_Master_ID,
        "Login_ID": AppConfig.settings.oRes.userID,
        "Entity_ID": AppConfig.settings.oRes.homeEntityID,
        "CustomerID": CustomerID,
        "CustomerName": CustomerName,
        "NominalAmount": NominalAmount,
        "RMID": RMID,
        "RMNAME": RMNAME,
        "Ccy": Ccy,
        "AdvRsn": "",
        "I_strCashSettlementAccount": "",
        "I_strCashSettlementCcy": "",
        "I_strSecuritiesAccount": "",
        "I_strELIAccount": "",
        "I_strReferralYN": "",
        "I_strPICOP": "s",
        "I_strPortfolio": "",
        "USDequiv": "",
        "I_strBook": "",
        "I_strNonBestPriceTrancheRemark": "",
        "strInputChannel": "",
        "strInternalRefNo": "",
        "onBehalfOf": onBehalfOf,
        "strDocID": "",
        "strDocType": "",
        "MinCoupon": MinCoupon,
      }
      const that = this;
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {

      //     res = data.UDTForRMOrderSaveResult;
      //     return res;
      //   },
      //   error() {
      //     //console.log(error);
      //   }
      // });

      // return res;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        res= data;
        return res;
      })
      
    } catch (error) {
      //console.log('Error:', error);
    }
  }

//Modified to remove AJAX call by RajeshC & AdilP
  async GetRMWProductDetails(template: any, productfilter: any, ccy: any, sortBy: any,
    templateCode: any, rowsperpage: any, folderName: any, pageNo: any, search: any,
    FilterCriteria: any, ListType: any, TrancheYN: any, EntityCode: any, ShowLikes: any) {
    try {
      //const webMethod = this.interfaceUrl + 'GetRMWProductDetails';
      const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/rmworkstation/GetRMWProductDetails';
      console.log(templateCode, ccy, sortBy)
      const parameters = {
        "FinIQRequestHeader": {
          "EntityCode": AppConfig.settings.oRes.homeEntityName,
          "LoginID": AppConfig.settings.oRes.userID,
          "SourceSystem": "FinIQ",
          "MachineIP": "000.00.00.00",
          "RequestID": "1",
          "RequestAt": "13-Nov-24",
        },
        "RMWGenericRequest": {
          "Template_Name": "",
          "Product_Name": productfilter,
          "Isin": "",
          "WhereClause": search,
          "FilterCriteria": FilterCriteria,
          "SortingCriteria": 'Note_Master_ID desc',
          "RowsperRequest": rowsperpage.toString(),
          "ShowLikes": ShowLikes ? ShowLikes : "",
          "Folder_Name": folderName,
          "ListType": ListType,
          "Page_No": pageNo.toString(),
          "TrancheYN": TrancheYN,
        },
      }
      // const parameters = {
      //   Template_Name: "",
      //   Product_Name: productfilter,
      //   SortingCriteria: 'Note_Master_ID desc', 
      //   RowsperRequest: rowsperpage,
      //   FilterCriteria,
      //   Folder_Name: folderName,
      //   Page_No: pageNo,
      //   WhereClause: search,
      //   LoginID: AppConfig.settings.oRes.userID,
      //   ListType,
      //   TrancheYN,
      //   EntityCode:  AppConfig.settings.oRes.homeEntityName,
      //   ShowLikes

      // };
      const that = this;
      const response = '';
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     that.RMWProductDetails = [];
      //     if (data.RMWGenericResponse.items != null) {
      //       // that.RMWProductDetails = JSON.parse(data.RMWGenericResponse.items.replace(/\n/g, ''));
      //       that.RMWProductDetails = data.RMWGenericResponse;
      //     }
      //     // that.stopLoading();
      //     return that.RMWProductDetails;
      //   },
      //   error() {
      //   }
      // });

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {

        return data.RMWGenericResponse;
      })
    } catch (error) {
    }
    //return this.RMWProductDetails;
  }

  // Workbench search api - added by Priya L. 
//Modified to remove AJAX call by RajeshC & AdilP
  async GetRMWProductDetailsGenericFilter(searchText: any, pageNo: any, pageSize: any,
    templateCode: any, folderName: any, ListType: any, TrancheYN: any, EntityCode: any) {
    try {
      //      const webMethod = this.interfaceUrl + 'GetRMWProductDetailsGenericFilter';
      const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/rmworkstation/GetRMWProductDetailsGenericFilter';

      const parameters = {
        "searchText": searchText,
        "pageNo": pageNo.toString(),
        "pageSize": pageSize.toString(),
        "LoginID": AppConfig.settings.oRes.userID,
        "templateCode": templateCode,
        "folderName": folderName,
        "ListType": ListType,
        "TrancheYN": TrancheYN,
        "EntityCode": EntityCode
      };
      const that = this;
      // const response = '';
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     that.RMWProductDetails = [];
      //     if (data.RMWGenericResponse.items != null) {
      //       that.RMWProductDetails = data.RMWGenericResponse;
      //     }
      //     return that.RMWProductDetails;
      //   },
      //   error() {
      //   }
      // });
      // return this.RMWProductDetails;

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data.RMWGenericResponse;
      })
    } catch (error) {
      console.log("Error : " + error);

    }
  }

//Modified to remove AJAX call by RajeshC & AdilP
  async likeProduct(NoteMasterId: any) {
    try {
      // const webMethod = this.interfaceUrl + 'LikeProduct';
      const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/rmworkstation/LikeProduct';

      const parameters = {
        "NoteMasterId": NoteMasterId,
        "LoginID": AppConfig.settings.oRes.userID,

      };
      const that = this;
      const response = '';
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     that.likeProductFlag = data;
      //     return that.likeProductFlag;
      //   },
      //   error() {
      //   }
      // });
      // return this.likeProductFlag;
      return await this.http.post(webMethod, parameters).toPromise()

    } catch (error) {
      console.log("Error :" + error);

    }
  }


//Modified to remove AJAX call by RajeshC & AdilP
  async unlikeProduct(NoteMasterId: any) {
    //const webMethod = this.interfaceUrl + 'UnLikeProduct';
    const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/rmworkstation/UnLikeProduct';

    const parameters = {
      "NoteMasterId": NoteMasterId,
      "LoginID": AppConfig.settings.oRes.userID

    };
    const that = this;
    const response = '';
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   success(data) {
    //     that.unlikeProductFlag = data;
    //     return that.unlikeProductFlag;
    //   },
    //   error() {
    //   }
    // });
    //return this.unlikeProductFlag;
    return await this.http.post(webMethod, parameters).toPromise()
  }

//Modified to remove AJAX call by RajeshC & AdilP
  async ProductAttachmentList(NoteMasterID: any) {
    //    const webMethod = this.interfaceUrl + 'ProductAttachmentList';
    const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/rmworkstation/ProductAttachmentList';

    const parameters = {
      "NoteMasterID": NoteMasterID
    };
    const that = this;
    const response = '';
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   success(data) {
    //     that.productattachmentlist = data;
    //     return that.productattachmentlist;
    //   },
    //   error() {
    //   }
    // });
    // return this.productattachmentlist;
    return await this.http.post(webMethod, parameters).toPromise();
  }

//Modified to remove AJAX call by RajeshC & AdilP
  async GetFolders(LoginID) {

    //const webMethod = this.interfaceUrl + 'GetFolders';
    //Added by RajeshC || Testing Purpose
    const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/rmworkstation/GetFolders';
    const parameters = {
      'EntityID': AppConfig.settings.oRes.homeEntityID,
      'LoginID': AppConfig.settings.oRes.userID

    };
    // const that = this;
    // const response = '';
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   success(data) {
    //     that.folders = data;
    //     return that.folders;
    //   },
    //   error() {
    //   }
    // });
    // return this.folders;
    //var abc = await this.http.post(webMethod,parameters).toPromise(); 
    //var folderlist= [{"PF_Folder_Name":"2021 July"},{"PF_Folder_Name":"22 sept"},{"PF_Folder_Name":"AA 2026"},{"PF_Folder_Name":"Air Mexico"},{"PF_Folder_Name":"Au"},{"PF_Folder_Name":"AU Funds"},{"PF_Folder_Name":"Australia Employment"},{"PF_Folder_Name":"Australian Bonds"},{"PF_Folder_Name":"Autocall"},{"PF_Folder_Name":"Banking"},{"PF_Folder_Name":"Biden"},{"PF_Folder_Name":"Boeing 5 Jun"},{"PF_Folder_Name":"Bonds"},{"PF_Folder_Name":"Callable"},{"PF_Folder_Name":"Canadian Bonds"},{"PF_Folder_Name":"China green dev"},{"PF_Folder_Name":"China trade war"},{"PF_Folder_Name":"Chinese bad loans"},{"PF_Folder_Name":"Chinese banks"},{"PF_Folder_Name":"Client trading 1"},{"PF_Folder_Name":"CMB"},{"PF_Folder_Name":"Content 134709"},{"PF_Folder_Name":"Content 134713"},{"PF_Folder_Name":"Content 134714"},{"PF_Folder_Name":"Convertible"},{"PF_Folder_Name":"Coronavirus Relief"},{"PF_Folder_Name":"Cruise"},{"PF_Folder_Name":"Daimler sells"},{"PF_Folder_Name":"DECU"},{"PF_Folder_Name":"EcoBank"},{"PF_Folder_Name":"EIBANK"},{"PF_Folder_Name":"EIBANK Demo"},{"PF_Folder_Name":"EM Govt"},{"PF_Folder_Name":"EQ Dip"},{"PF_Folder_Name":"Europe"},{"PF_Folder_Name":"Facebook ban"},{"PF_Folder_Name":"Falling Oil"},{"PF_Folder_Name":"Feb Public list"},{"PF_Folder_Name":"Forex"},{"PF_Folder_Name":"France US"},{"PF_Folder_Name":"Gold"},{"PF_Folder_Name":"hotel"},{"PF_Folder_Name":"Indo Sukuk"},{"PF_Folder_Name":"Intel news"},{"PF_Folder_Name":"Islamic Products"},{"PF_Folder_Name":"July Favourites"},{"PF_Folder_Name":"LGT1"},{"PF_Folder_Name":"MKB Demo Products"},{"PF_Folder_Name":"NBG demo products"},{"PF_Folder_Name":"new"},{"PF_Folder_Name":"New Jersey Loan"},{"PF_Folder_Name":"New Proposal"},{"PF_Folder_Name":"October List"},{"PF_Folder_Name":"oil"},{"PF_Folder_Name":"ORI"},{"PF_Folder_Name":"Perpetual"},{"PF_Folder_Name":"Piyusha_training"},{"PF_Folder_Name":"PUBLIC LIST"},{"PF_Folder_Name":"Qantas"},{"PF_Folder_Name":"Recommended"},{"PF_Folder_Name":"S&P Rally"},{"PF_Folder_Name":"Sandeep"},{"PF_Folder_Name":"September Fav."},{"PF_Folder_Name":"SGD"},{"PF_Folder_Name":"Siemens"},{"PF_Folder_Name":"Stanhope List 1"},{"PF_Folder_Name":"Structured Products"},{"PF_Folder_Name":"Tencent"},{"PF_Folder_Name":"Tesla"},{"PF_Folder_Name":"test"},{"PF_Folder_Name":"TMM Funds"},{"PF_Folder_Name":"Travel and Leisure"},{"PF_Folder_Name":"UK"},{"PF_Folder_Name":"UK lock down"},{"PF_Folder_Name":"UOB SG"},{"PF_Folder_Name":"UOBI Demo"},{"PF_Folder_Name":"US"},{"PF_Folder_Name":"User_Test"},{"PF_Folder_Name":"User_Test_Pub"},{"PF_Folder_Name":"USNews"},{"PF_Folder_Name":"USNews2"},{"PF_Folder_Name":"Vangelis"},{"PF_Folder_Name":"Viral wave"},{"PF_Folder_Name":"Wall street back"},{"PF_Folder_Name":"WatchList4"},{"PF_Folder_Name":"WM and Treasury EIBANK Demo"},{"PF_Folder_Name":"YE"}]
    return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {

      //return data ? data : null;
	  return data ? data : [];
    
  })
  }

//Modified to remove AJAX call by RajeshC & AdilP
  async SaveProductToFolder(FolderName: any, NoteMasterID: any, CustomerID: any,
    ListType: any) {
    //const webMethod = this.interfaceUrl + 'SaveProductToFolder';
    const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/rmworkstation/SaveProductToFolder';

    const parameters = {
      "FolderName": FolderName,
      "NoteMasterID": NoteMasterID,
      "CustomerID": CustomerID,
      "EntityID": AppConfig.settings.oRes.userID,
      "User": AppConfig.settings.oRes.userID,
      "ListType": ListType
    };
    const that = this;
    const response = '';
    // $.ajax({
    //   async: false,
    //   crossDomain: true,
    //   type: 'POST',
    //   url: webMethod,
    //   data: JSON.stringify(parameters),
    //   contentType: 'application/json; charset=utf-8',
    //   dataType: 'json',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   success(data) {
    //     that.saveproducttofolderresp = data;
    //     return that.saveproducttofolderresp;
    //   },
    //   error() {
    //   }
    // });
    // return this.saveproducttofolderresp;
    return await this.http.post(webMethod, parameters).toPromise();
  }


//Modified to remove AJAX call by RajeshC & AdilP
  async GetMappedUsersAndGroups() {
    //const webMethod = this.interfaceUrl + 'GetMappedUsersAndGroups';
    try {
      const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/rmworkstation/GetMappedUsersAndGroups';

      const parameters = {
        "UserID": AppConfig.settings.oRes.userID
      };
      const that = this;
      const response = '';
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     that.MappedUsersAndGroupsArr = data.getMappedUsersAndGroupsResult;
      //     return that.MappedUsersAndGroupsArr;
      //   },
      //   error() {
      //   }
      // });
      // return this.MappedUsersAndGroupsArr;
      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {

        return data.getMappedUsersAndGroupsResult;
      })
    } catch (error) {
      console.log("Error: " + error);

    }
  }

//Modified to remove AJAX call by RajeshC & AdilP
  async InsertPortfolioSharing(CreatedBy: any, GroupEdit: any, GroupView: any, PortfolioID: any,
    UserEdit: any, UserView: any, GroupDelete: any, UserDelete: any) {
    try {
      //const webMethod = this.interfaceUrl + 'InsertPortfolioSharing';
      const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/rmworkstation/InsertPortfolioSharing';

      let res: any;
      const parameters = {
        'CreatedBy': CreatedBy,
        'GroupEdit': GroupEdit,
        'GroupView': GroupView,
        'PortfolioID': PortfolioID,
        'UserEdit': UserEdit,
        'UserView': UserView,
        'GroupDelete': GroupDelete,
        'UserDelete': UserDelete
      };
      const that = this;
      const response = '';
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     res = data;
      //     // that.MappedUsersAndGroupsArr = data.getMappedUsersAndGroupsResult;
      //   },
      //   error() {
      //   }
      // });
      // return res;

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {

        return data.getMappedUsersAndGroupsResult;
      });
    } catch (error) {
      console.log("Error: " + error);

    }

  }
  //Modified to remove AJAX call by RajeshC & AdilP
  async getPortfolioSharingList(PortfolioID: any) {
    try {
      //    const webMethod = this.interfaceUrl + 'getPortfolioSharingList';
      const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/rmworkstation/getPortfolioSharingList';

      const parameters = {
        "PortfolioID": PortfolioID
      };
      const that = this;
      const response = '';
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     that.getSharedPortfolioAccessList = data.getPortfolioSharingListResult;
      //     return that.getSharedPortfolioAccessList;
      //   },
      //   error() {
      //   }
      // });
      // return this.getSharedPortfolioAccessList;

      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data.getPortfolioSharingListResult;
      })
    } catch (error) {
      console.log("Error: " + error);

    }
  }
  //Modified to remove AJAX call by RajeshC & AdilP
  async GetClientProdDetails(BookCode: any) {
    try {
      //const webMethod = this.interfaceUrl + 'GetClientProdDetails';
      const webMethod = AppConfig.settings.apiBaseUrl + 'rmw/rmworkstation/GetClientProdDetails';

      const parameters = {
        "BookCode": BookCode,
        'EntityID': AppConfig.settings.oRes.homeEntityID,
        'LoginID': AppConfig.settings.oRes.userID
      };
      const that = this;
      const response = '';
      // $.ajax({
      //   async: false,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: {
      //     'Cache-Control': 'no-cache',
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   success(data) {
      //     that.GetClientProdDetailsArr = data.Get_Client_Prod_details_APIResult;
      //     return that.GetClientProdDetailsArr;
      //   },
      //   error() {
      //   }
      // });
      // return this.GetClientProdDetailsArr;




      return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        return data.Get_Client_Prod_details_APIResult;
      })
    } catch (error) {
      console.log("Error: " + error);

    }
  }
}
