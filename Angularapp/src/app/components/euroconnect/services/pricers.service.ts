import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { param } from 'jquery';
import { environment } from 'src/environments/environment';
import { EcCommonService } from './ec-common.service';

@Injectable({
  providedIn: 'root'
})
export class PricersService {

  payOffList:any = [];
  interfaceUrl = environment.interfaceURL;

  constructor(private commonfunctions:EcCommonService, private http: HttpClient) { }

  getPayOffList(): any {
    try {

      let asseturl = environment.asseturl;
      

      // let entityWisePayOffList = ['AutocallablePhoenix', 'ReverseConvertible', 'CreditTranche', 'Participation', 'EQC_Europe', 'YieldEnhancement', 'DiscountCertificates', 'Accumulator', 'Decumulator'];
      let entityWisePayOffList = ['AutocallablePhoenix', 'ReverseConvertible', 'CreditTranche', 'Participation', 'EQC_Europe', 'YieldEnhancement', 'DiscountCertificates', 'ACC', 'DAC','CustomStrategy'];

      let payOffList = [
      {
        'name': 'EQC_Europe',
        'displayName': 'Autocallable',
        'auditTProductType' : 'EQC_Europe',
        'prevQuoteProductName' : 'EQC_Europe', //Prev Quotes
        'Product' : 'Autocallable' ,
        'multiProductName' : 'AutocallablePhoenixER' ,
        'matIcon': 'dashboard',
        'singleRoute': '/EarlyRedemption',
        'multiRoute': '/MultiEarlyRedemption',
        'settingsRoute': '/SettingsAutocallable',
        'display': false,
        'accord': 5,
        'image':asseturl+'autocallable.png',
      },
      {
        'name': 'YieldEnhancement',
        'displayName': 'Yield Enhancement',
        'auditTProductType' : 'YieldEnhancement',
        'prevQuoteProductName' : 'YieldEnhancement', //Prev Quotes
        'Product' : 'Yield Enhancement' ,
        'multiProductName' : 'YieldEnhancement' ,
        'matIcon': 'dashboard_customize',
        'singleRoute': '/YieldEnhancement',
        'multiRoute': '/MultiYieldEnhancement',
        'settingsRoute': '/SettingsYield',
        'display': false,
        'accord': 6,
        'image':asseturl+'yield-enhancement.png',
      },
      {
        'name': 'CustomPayoffs',
        'displayName': 'Custom Strategy',
        'auditTProductType' : 'CustomPayoffs',
        'prevQuoteProductName' : 'CustomPayoffs',
        'Product' : 'CustomStrategy' ,
        'multiProductName' : 'CustomStrategy' ,
        'matIcon': 'dashboard_customize',
        'singleRoute': '/CustomStrategy',
        'multiRoute': '/MultiCustomStrategy',
        'settingsRoute': '/SettingsYield',
        'display': false,
        // 'display': true,  //temp
        'accord': 10,
        'image':asseturl+'customstrategy.png',
      },    
      {
        'name': 'DiscountCertificates',
        'displayName': 'Discount Certificates',
        'auditTProductType' : 'DiscountCertificates',
        'prevQuoteProductName' : 'DiscountCertificates', //Prev Quotes
        'Product' : 'Discount Certificates' ,
        'multiProductName' : 'DiscountCertificate' ,
        'matIcon': 'grid_view',
        'singleRoute': '/DiscountCertificates',
        'multiRoute': '/MulitiDiscountCertificates',
        'settingsRoute': '/SettingsDC',
        'display': false,
        'accord': 7
      },
      {
        // 'name': 'Accumulator',
        'name': 'ACC',
        'displayName': 'Accumulator',
        'auditTProductType' : 'ACC',
        'prevQuoteProductName' : 'Accumulator', //Prev Quotes
        'Product' : 'Accumulator' ,
        'multiProductName' : 'Accumulator' ,
        'matIcon': 'trending_up',
        'singleRoute': '/AQ',
        'multiRoute': '/MultiAccu',
        'settingsRoute': '/SettingsAccum',
        'display': false,
        'accord': 8,
        'image':asseturl+'accumulator.png',
      },
      {
        // 'name': 'Decumulator',
        'name': 'DAC',
        'displayName': 'Decumulator',
        'auditTProductType' : 'DAC',
        'prevQuoteProductName' : 'Decumulator', //Prev Quotes
        'Product' : 'Decumulator' ,
        'multiProductName' : 'Decumulator' ,
        'matIcon': 'trending_down',
        'singleRoute': '/DQ',
        'multiRoute': '/MultiDecu',
        'settingsRoute': '/SettingsDecum',
        'display': false,
        'accord': 9,
        'image':asseturl+'decumulator.png',
      },
      {
        'name': 'AutocallablePhoenix',
        'displayName': 'Autocall',
        'auditTProductType' : 'AutocallablePhoenix', //AuditTrail, RMW, Landing Page
        'prevQuoteProductName' : 'AutocallablePhoenix', //Prev Quotes
        'Product' : 'Autocall Phoenix' ,
        'multiProductName' : 'AutocallablePhoenix' ,
        'matIcon': 'widgets',
        'singleRoute': '/Phoenix',
        'multiRoute': '/MultiPhoenix',
        'settingsRoute': '/SettingsAuocall',
        'display': false,
        'accord': 1
      },
      {
        'name': 'ReverseConvertible',
        'displayName': 'Reverse Convertible',
        'auditTProductType' : 'ReverseConvertible',
        'prevQuoteProductName' : 'ReverseConvertible', //Prev Quotes
        'Product' : 'Reverse Convertible' ,
        'multiProductName' : 'ReverseConvertible' ,
        'matIcon': 'aspect_ratio',
        'singleRoute': '/BRC',
        'multiRoute': '/MultiBRC',
        'settingsRoute': '/SettingsRC',
        'display': false,
        'accord': 2
      },
      {
        'name': 'CreditTranche',
        'displayName': 'Credit Tranche',
        'auditTProductType' : 'CreditTranche',
        'prevQuoteProductName' : 'CreditTranche', //Prev Quotes
        'Product' : 'Credit Tranche' ,
        'multiProductName' : 'CreditTranche' ,
        'matIcon': 'card_giftcard',
        'singleRoute': '/Credit',
        'multiRoute': '/MultiCredit',
        'settingsRoute': '/SettingsCT',
        'display': false,
        'accord': 3
      },
      {
        'name': 'Participation',
        'displayName': 'Participation',
        'auditTProductType' : 'Participation',
        'prevQuoteProductName' : 'Participation', //Prev Quotes
        'Product' : 'Participation' ,
        'multiProductName' : 'Participation' ,
        'matIcon': 'description',
        'singleRoute': '/Participation',
        'multiRoute': '/MultiParticipation',
        'settingsRoute': '/SettingsParticipation',
        'display': false,
        'accord': 4
      },
      ]
      this.GetDealEntryUSAM().subscribe((res:any)=>{
        let data = JSON.parse(res);
        entityWisePayOffList = data.GetDealEntryUSAMResult
        payOffList.forEach(payOff => {
          if (entityWisePayOffList.includes(payOff.name)) {
            payOff.display = true;
          }
        });
  
        this.payOffList = payOffList;
      });
      // entityWisePayOffList = ['AutocallablePhoenix','YieldEnhancement', 'DiscountCertificates', 'Accumulator', 'Decumulator'];
      // entityWisePayOffList = ['AutocallablePhoenix','YieldEnhancement', 'DiscountCertificates', 'ACC', 'DAC'];
      // entityWisePayOffList = ['AutocallablePhoenix', 'EQC_Europe', 'ACC', 'DAC','YieldEnhancement', 'DiscountCertificates'];

      
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  GetDealEntryUSAM() {
    try {
      // //console.log('In GetDealEntryUSAM');
      var userName = (this.commonfunctions.getLoggedInUserName())[0].UserId;

      const webMethod = this.interfaceUrl + 'GetDealEntryUSAM';
      let res: any;
      const parameters = {
        // "USAM_Type": "Login",
        // "USAM_Target_Value": userName // "Sheetalk"

        "USAM_Type": "Entity",
        "USAM_Target_Value": (this.commonfunctions.getLoggedInUserName())[1].EntityId // "Sheetalk"
     

      };
      //console.log(parameters);
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
      //     //console.log(data);
      //     // res = JSON.parse(data);
      //     // //console.log(res);
      //     // this.addAttachmentData.next(res);
      //     res = data.GetDealEntryUSAMResult
      //     return res;
      //   },
      //   error(error:any) {
      //     console.log(error);
          
      //   }
      // });
      return this.http.post(webMethod, parameters);
    } catch (error) {
      //console.log('Error:', error);
    }
  }
}
