// Changes added by Mayuri D. on 06-July-2022.

import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/services/config.service';
import { environment } from 'src/environments/environment';
import { EcCommonService } from './ec-common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsServiceService {

  constructor(public commonfunctions : EcCommonService,
    public http: HttpClient) { }
  public validationArr: any = [];
  public shares: any = [];
  public CCY: any = [];
  public indexTrancheArr: any = [];
  public floatingRefArr: any = [];

  interfaceUrl = environment.interfaceURL;
  UserID: any;

    // Fetch Validation
    BBVAFetchValidation(ProductType: any) {
      try {
        let validationArr = [];
        const webMethod = this.interfaceUrl + 'FetchValidation';
        const parameters = {
          ProductType,
          EntityId: (this.commonfunctions.getLoggedInUserName())[1].EntityId
        };
        const that = this;
        $.ajax({
          async: false,
          crossDomain: true,
          type: 'POST',
          url: webMethod,
          data: JSON.stringify(parameters),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          headers: {
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
          },
          success(data) {
            
            validationArr = data.FetchValidationResult;
          },
          error() {
          }
        });
  
        this.validationArr = validationArr;
        return this.validationArr;
      } catch (error) {
        //console.log('Error:', error);
      }
    }



    // news services - added by Priya L

  getNewsConfig(): any {
    let result = {};
    try {
      const webMethod = this.interfaceUrl + 'getnewsconfig';
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'GET',
        url: webMethod,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data) {
          result = data;
        }
      });
    } catch (error) {
      result = {};
    }
    return result;
  }

  fetchNewsDetails(newsId : any, noRecords : any, valideFrom : any, validTill : any, tags = '', LikeValue : any,
    PageNumber : any, Popular : any, Recommended : any, RowsPerPage : any, SearchNews : any, MarketOppurtunities : any, EntityCode: any){
    let result: any[] = [];
    this.UserID = (this.commonfunctions.getLoggedInUserName())[0].UserId;
    try {
      console.log('FetchNewsDetails' , newsId, noRecords, valideFrom, validTill, tags = '', LikeValue,
      PageNumber, Popular, Recommended, RowsPerPage, SearchNews, MarketOppurtunities, EntityCode);
      const webMethod = this.interfaceUrl + 'FetchNewsDetails';
      const that = this;
      const parameters = {
        News_ID: newsId,
        NoOfRecords: noRecords,
        ValidFrom: valideFrom,
        ValidTill: validTill,
        Tags: tags,
        LoginID: this.UserID,
        LikeValue,
        PageNumber,
        Popular,
        Recommended,
        RowsPerPage,
        SearchNews,
        MarketOppurtunities,
        EntityCode
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data) {
          if (data.ListFetchNewsDetailsResponse.items) {
            // //console.log(data.ListFetchNewsDetailsResponse.items);
            result = data.ListFetchNewsDetailsResponse;
          } else {
            result = [];
          }


        },
        error() {
          // //console.log(error);
          result = [];
        }
      });
      // return this.resMsg;
    } catch (error) {
      // //console.log('Error:', error);
    }
    return result;
  }

  getNewsImage(newsId): string {
    let result = '';
    try {
      // // //console.log('GetNewsImage');
      const webMethod = this.interfaceUrl + 'GetNewsImage';
      const that = this;
      const parameters = {
        newsId
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data) {
          // //console.log(data);
          result = data;
          // if (data.FinIQResponseHeader.Status === 'Succeed' || data.FinIQResponseHeader.Status === 'Success') {
          //   if (data.FillOrder.ResponseDetails.Code === '0000') {
          //     that.resMsg = data.FillOrder.RemarkInfo.Message;
          //   }
          // } else {
          //   that.resMsg = data.FillOrder.ResponseDetails.Remark;
          // }


        },
        error() {
          // //console.log(error);
          result = '';
        }
      });
      // return this.resMsg;
    } catch (error) {
      // //console.log('Error:', error);
    }
    return result;
  }

  getNewsImgResourcePath(filename): string {
    let result = '';
    try {
      // // //console.log('GetNewsImage');
      const webMethod = this.interfaceUrl + 'getNewsImgResourcePath';
      const that = this;
      const parameters = {
        filename
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data) {
          // //console.log(data);
          result = data;
          // if (data.FinIQResponseHeader.Status === 'Succeed' || data.FinIQResponseHeader.Status === 'Success') {
          //   if (data.FillOrder.ResponseDetails.Code === '0000') {
          //     that.resMsg = data.FillOrder.RemarkInfo.Message;
          //   }
          // } else {
          //   that.resMsg = data.FillOrder.ResponseDetails.Remark;
          // }


        },
        error() {
          // //console.log(error);
          result = '';
        }
      });
      // return this.resMsg;
    } catch (error) {
      // //console.log('Error:', error);
    }
    return result;
  }


  GetPreviewURL(): string {
    let result = '';
    try {
      // //console.log('GetNewsImage');
      const webMethod = this.interfaceUrl + 'GetPreviewURL';
      const that = this;
      const parameters = {
        "filename": ""
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data) {
          //console.log(data);
          result = data;
        },
        error() {
          //console.log(error);
          result = '';
        }
      });
      // return this.resMsg;
    } catch (error) {
      //console.log('Error:', error);
    }
    return result;
  }


  getNewsAttachment(filename): string {
    let result = '';
    try {
      // //console.log('GetNewsImage');
      const webMethod = this.interfaceUrl + 'GetNewsAttachment';
      const that = this;
      const parameters = {
        filename
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data) {
          //console.log(data);
          result = data;
        },
        error() {
          //console.log(error);
          result = '';
        }
      });
      // return this.resMsg;
    } catch (error) {
      //console.log('Error:', error);
    }
    return result;
  }


  getNewsLikeAPI(newsId: any, ListName: any, EntityCode: any) {
    let result: any;
    try {
      // //console.log('getNewsLikeAPI');
      const webMethod = this.interfaceUrl + 'getNewsLikeAPI';
      const that = this;
      const parameters = {
        News_ID: newsId,
        LoginID: (this.commonfunctions.getLoggedInUserName())[0].UserId,
        ListName,
        EntityCode
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data) {
          // if (data.GetNewsLikeResponseDetails.Like_Value) {
          //   //console.log(data.GetNewsLikeResponseDetails.Like_Value);
          //   result = data.GetNewsLikeResponseDetails;
          // } else {
          //   result = { 'Like_Value': 'N', 'Number Of Likes': '0' };
          // }
          result = data;
        },
        error() {
          //console.log(error);
          result = 'N';
        }
      });
      // return this.resMsg;
    } catch (error) {
      //console.log('Error:', error);
    }
    return result;
  }


  setNewsLikeAPI(newsId, likeValue, EntityCode: any): string {
    let result = null;
    try {
      // //console.log('setNewsLikeAPI');
      const webMethod = this.interfaceUrl + 'setNewsLikeAPI';
      const that = this;
      const parameters = {
        Like_Value: likeValue,
        News_ID: newsId,
        LoginID: (this.commonfunctions.getLoggedInUserName())[0].UserId,
        EntityCode
      };
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data) {
          if (data.SetNewsLikeResponseDetails.Status) {
            // //console.log(data.SetNewsLikeResponseDetails.Status);
            result = data.SetNewsLikeResponseDetails.Status;
          } else {
            result = null;
          }
        },
        error() {
          // //console.log(error);
          result = null;
        }
      });
      // return this.resMsg;
    } catch (error) {
      // //console.log('Error:', error);
    }
    return result;
  }

    /// BBVA Load shares

    // BBVALoadShares(marketType: any,
    //   strExchange: any, 
    //   ProductCode: any
    //   ) {
    //   try {
    //     let shares = [];
    //     const webMethod = this.interfaceUrl + 'BBVAGetShares';
    //     const parameters = {
    //       MarketType: marketType,
    //       strExchange,
    //       ProductCode,
    //       entityID: (this.commonfunctions.getLoggedInUserName())[1].EntityId
    //     };
    //     const that = this;
    //     $.ajax({
    //       async: false,
    //       crossDomain: true,
    //       type: 'POST',
    //       url: webMethod,
    //       data: JSON.stringify(parameters),
    //       contentType: 'application/json; charset=utf-8',
    //       dataType: 'json',
    //       headers: {
    //         'Cache-Control': 'no-cache',
    //         'Access-Control-Allow-Origin': '*'
    //       },
    //       success(data) {
    //         shares = data.Get_All_Share_Details_JsonResult;
    //       },
    //       error() {
  
    //       }
    //     });
    //     this.shares = shares;
    //     return this.shares;
    //   } catch (error) {
    //     //console.log('Error:', error);
    //   }
    // }
  

    async BBVALoadShares(marketType: any, strExchange: any, ProductCode: any) {
      try {
        let shares = [];
        const webMethod = AppConfig.settings.apiBaseUrl + 'eqd/Details/GetAllShareDetails';
        const parameters = {
          MarketType: marketType,
          strExchange,
          ProductCode,
          // entityID: this.commonfunctions.getLoggedInUserName()[1].EntityId,
          entityID: AppConfig.settings.oRes.homeEntityID,
        };
        const response = this.http.post(webMethod,parameters);
      
        return await response.toPromise();
      } catch (error) {
        //console.log('Error:', error);
      }
    }
    
    // BBVA ccy
  
    BBVALoadCCY() {
      try {
        const webMethod = this.interfaceUrl + 'BBVAGetCCY';
        const parameters = {
        };
        const that = this;
        $.ajax({
          async: false,
          crossDomain: true,
          type: 'POST',
          url: webMethod,
          data: JSON.stringify(parameters),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          headers: {
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
          },
          success(data) {
            that.CCY = data.Get_CcyList_JSONResult;
            return that.CCY;
          },
          error() {
          }
        });
  
        return this.CCY;
      } catch (error) {
        //console.log('Error:', error);
      }
    }
  
      /// BBVA Load shares indexTrancheArr

  BBVALoadSharesCR(marketType: any, 
    strExchange: any, 
    ProductCode: any
    ) {
    try {
      let indexTrancheArr = [];
      const webMethod = this.interfaceUrl + 'BBVAGetShares';
      const parameters = {
        MarketType: marketType,
        strExchange,
        ProductCode,
        entityID: (this.commonfunctions.getLoggedInUserName())[1].EntityId
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data) {
          indexTrancheArr = data.Get_All_Share_Details_JsonResult;
        },
        error() {
        }
      });
      this.indexTrancheArr = indexTrancheArr;
      return this.indexTrancheArr;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // BBVA Load shares floatingRefArr

  BBVALoadSharesIR(marketType: any,
     strExchange: any, 
     ProductCode: any
     ) {
    try {
      let floatingRefArr = [];
      const webMethod = this.interfaceUrl + 'BBVAGetShares';
      const parameters = {
        MarketType: marketType,
        strExchange,
        ProductCode,
        entityID: (this.commonfunctions.getLoggedInUserName())[1].EntityId
      };
      const that = this;
      $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        success(data) {
          floatingRefArr = data.Get_All_Share_Details_JsonResult;
        },
        error() {
        }
      });
      this.floatingRefArr = floatingRefArr;
      return this.floatingRefArr;
    } catch (error) {
      //console.log('Error:', error);
    }
  }


}
