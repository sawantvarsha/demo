// Changes added by Mayuri D. on 04-July-2022.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import $ from 'jquery';
import { environment } from 'src/environments/environment';
import { HomeApiService } from 'src/app/services/home-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

import { BehaviorSubject } from 'rxjs';

import { NgxXml2jsonService } from 'ngx-xml2json';


@Injectable({
  providedIn: 'root',
})
export class EcCommonService {

  
  private selectedShare = new BehaviorSubject(0);
  shareIndex = this.selectedShare.asObservable();

  private selectedAccount = new BehaviorSubject(0);
  Account = this.selectedAccount.asObservable();


  private underlyingCurrency = new BehaviorSubject<any>(0);
  Currency = this.underlyingCurrency.asObservable();


  private PricesObserver = new BehaviorSubject<any>('');
  SignalRPrices = this.PricesObserver.asObservable();
  Prices = [];

  private ClearPrices = new BehaviorSubject<any>('');
  clearPrices = this.ClearPrices.asObservable();


  selectedShareIndex = 0;
  selectedAccountNumber = 0;


  public PHXPricesObserver = new BehaviorSubject<any>('');
  PHXSignalRPrices = this.PHXPricesObserver.asObservable();
  PHXPrices = [];

  public BRCPricesObserver = new BehaviorSubject<any>('');
  BRCSignalRPrices = this.BRCPricesObserver.asObservable();
  BRCPrices = [];

  private RCPricesObserver = new BehaviorSubject<any>('');
  RCSignalRPrices = this.RCPricesObserver.asObservable();
  RCPrices = [];


  public CreditPricesObserver = new BehaviorSubject<any>('');
  CreditSignalRPrices = this.CreditPricesObserver.asObservable();
  CreditPrices = [];

  private submultiPricesObserver = new BehaviorSubject<any>('');
  submultiSignalRPrices = this.submultiPricesObserver.asObservable();
  submultiPrices = [];

  private submultiRCPricesObserver = new BehaviorSubject<any>('');
  submultiRCSignalRPrices = this.submultiRCPricesObserver.asObservable();
  submultiRCPrices = [];

  private submultiCreditPricesObserver = new BehaviorSubject<any>('');
  submultiCreditSignalRPrices = this.submultiCreditPricesObserver.asObservable();
  submultiCreditPrices = [];

  private submultiPTCPricesObserver = new BehaviorSubject<any>('');
  submultiPTCSignalRPrices = this.submultiPTCPricesObserver.asObservable();
  submultiPTCPrices = [];

  public PTCPricesObserver = new BehaviorSubject<any>('');
  PTCSignalRPrices = this.PTCPricesObserver.asObservable();
  PTCPrices = [];

  // FIN1EURINT-502 : Bulk Pricer - Rows get rearranged on saving or updating a portfolio.
  public strxmlObserver = new BehaviorSubject({});
  strxml = this.strxmlObserver.asObservable();
  
  // Bulk Pricer (AC) - Export to excel 
  public strXLObserver = new BehaviorSubject({});
  strXL = this.strXLObserver.asObservable();

  public strxmlRCObserver = new BehaviorSubject('');
  strxmlRC = this.strxmlRCObserver.asObservable();
  public strxmlCreditObserver = new BehaviorSubject('');
  strxmlCredit = this.strxmlCreditObserver.asObservable();

  public strxmlPTCObserver = new BehaviorSubject('');
  strxmlPTC = this.strxmlPTCObserver.asObservable();

  public deleteRowObserver = new BehaviorSubject('');
  dltRow = this.deleteRowObserver.asObservable();

  public deleteCreditRowObserver = new BehaviorSubject('');
  dltCreditRow = this.deleteCreditRowObserver.asObservable();


  public AQPricesObserver = new BehaviorSubject<any>('');
  AQSignalRPrices = this.AQPricesObserver.asObservable();
  AQPrices = [];

  public DQPricesObserver = new BehaviorSubject<any>('');
  DQSignalRPrices = this.DQPricesObserver.asObservable();
  DQPrices = [];

  public ERPricesObserver = new BehaviorSubject<any>('');
  ERSignalRPrices = this.ERPricesObserver.asObservable();
  ERPrices = [];

  public YEPricesObserver = new BehaviorSubject<any>('');
  YESignalRPrices = this.YEPricesObserver.asObservable();
  YEPrices = [];

  public CLNPricesObserver = new BehaviorSubject<any>('');
  CLNSignalRPrices = this.CLNPricesObserver.asObservable();
  CLNPrices = [];

  public CTPricesObserver = new BehaviorSubject<any>('');
  CTSignalRPrices = this.CTPricesObserver.asObservable();
  CTPrices = [];

//Added by SandipA || 12-Oct-23
public SteepenerPricesObserver = new BehaviorSubject<any>('');
SteepenerSignalRPrices = this.SteepenerPricesObserver.asObservable();
SteepenerPrices: any = [];
  public CapsNFloorPricesObserver = new BehaviorSubject<any>('');
  CapsNFloorSignalRPrices = this.CapsNFloorPricesObserver.asObservable();
  CapsNFloorPrices = [];

  public DCPricesObserver = new BehaviorSubject<any>('');
  DCSignalRPrices = this.DCPricesObserver.asObservable();
  DCPrices = [];

  loadingFlag = false;
  datepipe: any;
  layout = false;

  userInfo :any;
  interfaceurl = environment.interfaceURL;
  //apurva
  // state: any = true;
  // accord: any = [];


  constructor(
    public http: HttpClient,
    public authApi: AuthService,
    public xml2jsonservice: NgxXml2jsonService,
    private auth: AuthService
  ) {}
  async getEntityCode() {
    const params = {
      LoginID: this.authApi.UserName,
    };
    return this.http
      .post(this.interfaceurl + 'GetEntityCode', params, {
        responseType: 'text' as 'json',
      })
      .toPromise();
  }


  contains(key) {
    try {
      const findNaN = key !== key;
      let indexOf: any;
      if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
      } else {
        // tslint:disable-next-line: no-shadowed-variable
        indexOf = function (key: any) {
          // tslint:disable-next-line: one-variable-per-declaration
          let i = -1, index = -1;
          for (i = 0; i < this.legth; i++) {
            const item = this[i];
            if ((findNaN && item !== item) || item === key) {
              index = i;
              break;
            }
          }
          return index;
        };
      }
      return indexOf.call(this, key) > -1;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  GetEventTarget(e): any {
    try {
      const target: any = e.target || e.srcElement || e.currentTarget || null;
      return target;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  NotionalValidateKeys(e) {
    try {
      const target: any = this.GetEventTarget(e);
      // tslint:disable-next-line: deprecation
      e = (e) ? e : window.event;
      const code = (e.which) ? e.which : e.keyCode;
      let codes = new Array();
      // Checking for number inputs, k, m, b, ., del or backspace  46-.  76 - L  108l
      codes = [8, 9, 13, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 66, 75, 77, 98, 107, 109, 127];
      // 66 B , 75 K 77 M, 98 b, 107 k, 109 m
      if (!this.contains.call(codes, code)) {
        return false;
      }
      return true;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // NotionalValidate(e)
  allowIntegerOnly(e) { // required only for MemoryPeriods
    try {
      const target: any = this.GetEventTarget(e);
      // tslint:disable-next-line: deprecation
      e = (e) ? e : window.event;
      const code = (e.which) ? e.which : e.keyCode;
      let codes = new Array();
      // Checking for number inputs, k, m, b, ., del or backspace
      codes = [8, 9, 13, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
      if (!this.contains.call(codes, code)) {
        return false;
      }
      return true;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // uncommented by PriyaL on 13Sep2021 - required for AQ DQ product
  NotionalChange(e) {  //to be remove later. used in Autocall and RC
    try {
      const target: any = this.GetEventTarget(e);

      if (target.value === '') {

      } else {
        if ((target.value.toString().match(/([kK]{1})/g)) !== null) {
          target.value = (parseFloat(target.value.replace(/[kK]/g, '')) * 1000);
        } else if ((target.value.toString().match(/([lL]{1})/g)) !== null) {
          target.value = (parseFloat(target.value.replace(/[lL]/g, '')) * 100000);
        } else if ((target.value.toString().match(/([mM]{1})/g)) !== null) {
          target.value = (parseFloat(target.value.replace(/[mM]/g, '')) * 1000000);
        } else if ((target.value.toString().match(/([bB]{1})/g)) !== null) {
          target.value = (parseFloat(target.value.replace(/[bB]/g, '')) * 1000000000);
        }
      }


      return target.value;
    }
    catch (error) {
      //console.log("Error:", error);
    }
  }

  FormatNumber(e) {
    try {
      const target: any = this.GetEventTarget(e);
      //console.log(target);
      const notional = $('#' + target.id)[0]['value'];
      if (
        $('#' + target.id)[0]['value'].trim() === '' ||
        isNaN($('#' + target.id)[0]['value'])
      ) {
        $('#' + target.id)[0]['value'] = '0';
        const evt = new Event('change');
        $('#' + target.id)[0].dispatchEvent(evt);
      }
      // else {
      //   $('#' + target.id)[0].value = $('#' + target.id)[0].value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      //   //console.log($('#' + target.id)[0].value);
      // //console.log(parseFloat($('#' + target.id)[0].value));
      return parseFloat($('#' + target.id)[0]['value']);
    } catch (error) {
      //console.log('Error:', error);
    }
  }
 
  InputNumber(e) {
    try {
      const target: any = this.GetEventTarget(e);
      // tslint:disable-next-line: deprecation
      e = e ? e : window.event;
      const code = e.which ? e.which : e.keyCode;
      let codes = new Array();
      codes = [
        8, 9, 13, 17, 18, 19, 20, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
      ];
      if (!this.contains.call(codes, code)) {
        return false;
      }
      if (e.key === '.') {
        if (target.value.indexOf('.') > -1) {
          return false;
        }
      }
      return true;
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  UnformatNumber(e) {
    try {
      const target: any = this.GetEventTarget(e);
      $('#' + target.id)[0]['value'] = $('#' + target.id)[0]['value'].replace(
        /,/g,
        ''
      );
      if ($('#' + target.id)[0]['value'] === '0.00') {
        $('#' + target.id)[0]['value'] = '';
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }



  setDecimal(e) {
    try {
      const target: any = this.GetEventTarget(e);
      if (target.value.trim() === '' || isNaN(target.value)) {
        target.value = parseFloat('0.00').toFixed(2);
      } else {
        target.value = parseFloat(target.value).toFixed(2);
      }
      return target.value;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setDecimaltoFour(e) {
    try {
      const target: any = this.GetEventTarget(e);
      if (target.value.trim() === '' || isNaN(target.value)) {
        target.value = parseFloat('0.0000').toFixed(4);
      } else {
        target.value = parseFloat(target.value).toFixed(4);
      }
      return target.value;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setDecimalForBlank(e) {
    try {
      const target: any = this.GetEventTarget(e);
      if (target.value.trim() === '' || isNaN(target.value)) {

      } else {
        target.value = parseFloat(target.value).toFixed(2);
      }
      // if (target.value === '0.00') {
      //   target.value = '';
      // }
      return target.value;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

 

  InputNegativeNumber(e) {
    try {
      const target: any = this.GetEventTarget(e);
      // tslint:disable-next-line: deprecation
      e = (e) ? e : window.event;
      const code = (e.which) ? e.which : e.keyCode;
      let codes = new Array();
      codes = [8, 9, 13, 17, 18, 19, 20, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 45];
      if (!this.contains.call(codes, code)) {
        return false;
      }
      if (e.key === '-') {
        if (target.value.indexOf('-') > -1) {
          return false;
        }
      }
      if (e.key === '.') {
        if (target.value.indexOf('.') > -1) {
          return false;
        }
      }
      return true;
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  TenorValidation(e) {
    try {
      const target: any = this.GetEventTarget(e);
      // tslint:disable-next-line: deprecation
      e = (e) ? e : window.event;
      const code = (e.which) ? e.which : e.keyCode;
      let codes = new Array();
      codes = [8, 9, 13, 17, 18, 19, 20, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 68, 77, 87, 89, 100, 109, 119, 121];
      if (!this.contains.call(codes, code)) {
        return false;
      }
      return true;
    } catch (error) {
      //console.log('Error:', error);
    }
  }



  moveUpSelection1(_e, selectedIndex) {
    try {
      if (selectedIndex !== undefined) {
        if (selectedIndex > 0) {
          selectedIndex--;
        }
        if ($('.SelectorBox').length > 0) {
          this.ScrollTo('.SelectorBox', '.HoverSuggestion', 'down');
          return selectedIndex;
        } else {
          return 0;
        }

      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  moveDownSelection1(_e, selectedIndex) {
    try {
      if ($('.SelectorBox').length > 0) {
        if (selectedIndex < $('.SelectorBox')[0].childElementCount - 1) {
          selectedIndex++;
        }
        if ($('.SelectorBox')[0].childElementCount > selectedIndex) {
          this.ScrollTo('.SelectorBox', '.HoverSuggestion', 'up');
          return selectedIndex;
        }
      } else {
        return 0;
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }


  ScrollTo(container, element, direction) {
    try {
      const $container = $(container);
      const $scrollTo = $(element);
      switch (direction) {
        case 'up':
          //$container.animate({ scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop(), scrollLeft: 0 }, 10);
          $container.scrollTop(($container.scrollTop() + $scrollTo.offset().top - $container.offset().top) + 10)  // Added by AdilP to resolve scroll issue though keyboard click
          break;
        case 'down':
          //$container.animate({scrollTop: $scrollTo.offset().top - $container.offset().top+ $container.scrollTop() - 100, scrollLeft: 0}, 10);
          $container.scrollTop($scrollTo.offset().top - $container.offset().top+ $container.scrollTop() - 100)  // Added by AdilP to resolve scroll issue though keyboard click
          break;
        default:
          break;
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }


  setReceivedPrices(prices: any) {
    try {
      this.Prices[this.Prices.length] = prices;
      this.PricesObserver.next(prices);
    } catch (error) {
      //console.log('Error:', error);
    }
  }


  ClearPricesFromMultiToDealEntry() {
    try {
      this.PricesObserver.next('');
      this.Prices = [];
      this.PHXPricesObserver.next('');
      this.PHXPrices = [];
      this.BRCPricesObserver.next('');
      this.BRCPrices = [];
      this.RCPricesObserver.next('');
      this.RCPrices = [];
      this.CreditPricesObserver.next('');
      this.CreditPrices = [];
      this.submultiPricesObserver.next('');
      this.submultiPrices = [];
    } catch (error) {
      //console.log('Error:', error);
    }
  }



  clearPricesEvent(status: any) {
    try {
      this.ClearPrices.next(status);
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  CheckAllFieldsPrecision(e) {
    try {
      let fieldvalue = this.GetEventTarget(e).value;
      const DotPos = fieldvalue.indexOf('.');
      if (DotPos < 0) {

        return fieldvalue + '.00';
      } else if (DotPos === 0) {
        fieldvalue = '0' + fieldvalue;
        const diff = (fieldvalue.length - 2) - DotPos;
        if (diff === 1) {
          return fieldvalue + '0';
        }

        return fieldvalue;
      } else {
        const diff = (fieldvalue.length - 1) - DotPos;
        if (diff === 1) {
          return fieldvalue + '0';
        }

        return fieldvalue;
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }


  setPHXReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.PHXPrices[this.PHXPrices.length] = prices;
      this.PHXPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setBRCReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.BRCPrices[this.BRCPrices.length] = prices;
      this.BRCPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setRCReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.RCPrices[this.RCPrices.length] = prices;
      this.RCPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setCreditReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.CreditPrices[this.CreditPrices.length] = prices;
      this.CreditPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setAQReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.AQPrices[this.AQPrices.length] = prices;
      this.AQPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setDQReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.DQPrices[this.DQPrices.length] = prices;
      this.DQPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setERReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.ERPrices[this.ERPrices.length] = prices;
      this.ERPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  //Added by Apurva K|| 31-Oct-2023
  setCLNReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.CLNPrices[this.CLNPrices.length] = prices;
      this.CLNPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  //Added by Apurva K|| 28-Nov-2023
  setCTReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.CTPrices[this.CTPrices.length] = prices;
      this.CTPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      //console.log('Error:', error);
    }
  }


  setYEReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.YEPrices[this.YEPrices.length] = prices;
      this.YEPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      // //console.log('Error:', error);
    }
  }

  setSteepenerReceivedPrices(prices: any, ComponentIndex: any) {
    try {
      this.SteepenerPrices[this.SteepenerPrices.length] = prices;
      this.SteepenerPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {

    }
  }
  setCapsNFloorsReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.CapsNFloorPrices[this.CapsNFloorPrices.length] = prices;
      this.CapsNFloorPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
    }
  }

  setDCReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.DCPrices[this.DCPrices.length] = prices;
      this.DCPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      // //console.log('Error:', error);
    }
  }

  setsubmultiReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.submultiPrices[this.submultiPrices.length] = prices;
      this.submultiPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setsubmultiCreditReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.submultiCreditPrices[this.submultiPrices.length] = prices;
      this.submultiCreditPricesObserver.next({ price: prices, Index: ComponentIndex });

    } catch (error) {
      //console.log('Error:', error);
    }
  }
  setsubmultiRCReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.submultiRCPrices[this.submultiPrices.length] = prices;
      this.submultiRCPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setPTCReceivedPrices(prices: any, ComponentIndex) {
    try {
      this.PTCPrices[this.PTCPrices.length] = prices;//Changed by Jyoti S || 16-May-2023
      this.PTCPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setsubmultiPTCReceivedPrices(prices: any, ComponentIndex) {
    try {
      // FIN1EURINT-104 : Participation pay off addition in 1Europe
      this.submultiPTCPrices[this.submultiPTCPrices.length] = prices;
      this.submultiPTCPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  tenorDateValidation(e) {
    try {
      const target: any = this.GetEventTarget(e);
      // tslint:disable-next-line: deprecation
      e = (e) ? e : window.event;
      const code = (e.which) ? e.which : e.keyCode;
      let codes = new Array();
      // Checking for number inputs, y,w, m, b, ., del or backspace
      codes = [8, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 66, 68, 77, 87, 89, 98, 100, 109, 119, 121, 127];
      if (!this.contains.call(codes, code)) {
        return false;
      }
      return true;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  /////////////////  Compare function start || added by suvarna start
  compareValues(key, order = 'asc') {
    try {
      return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          return 0;
        }
        const varA = (typeof a[key] === 'string')
          ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
          ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return (
          (order === 'desc') ? (comparison * -1) : comparison
        );
      };
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  ////////////////   Compare function end || added by suvarna end


  generateFlexiXml(xml) {
    this.strxmlObserver.next(xml);
  }
  
  // Bulk Pricer (AC) - Export to excel 
  generateExcelJson(str){
    this.strXLObserver.next(str);
  }

  generateRCFlexiXml(xml) {
    this.strxmlRCObserver.next(xml);
  }
  generateCreditFlexiXml(xml) {
    this.strxmlCreditObserver.next(xml);
  }

  generatePTCFlexiXml(xml) {
    this.strxmlPTCObserver.next(xml);
  }
  getLoggedInUserName(): any {
    try {
      let userInfo = [];
      // //console.log(AppConfig.settings.usertype);
      const inputs = document.getElementsByTagName('input');
      // tslint:disable-next-line: prefer-for-of

      // for (let i = 0; i < inputs.length; i++) {
      //   switch (inputs[i].id) {
      //     case 'ctl00_hdnAngUserID':
      //       userInfo.push({ UserId: inputs[i].value });
      //       break;
      //     case 'ctl00_hdnAngEntityID':
      //       userInfo.push({ EntityId: inputs[i].value });
      //       break;
      //     case 'ctl00_hdnAngUserGroupID':
      //       userInfo.push({ UserGroupId: inputs[i].value });
      //       break;
      //     case 'ctl00_hdnAngMode':
      //       userInfo.push({ Usertype: inputs[i].value });
      //       break;
      //   }
      // }
      // if(this.auth.EntityID){
      //   userInfo = [
      //     { UserId: this.auth.UserName },
      //     { EntityId: this.auth.EntityID },
      //     { Usertype: this.auth.UserType },
      //   ]
      // }
      // if(this.userInfo){
      //   return this.userInfo;
      // }

      
      if (userInfo.length <= 0) {
        // userInfo = [{ UserId: 'Dealer2' }, { EntityId: '4' }, { UserGroupId: 'Default' },{Usertype:'Dealer'}];
        // userInfo = [{ UserId: 'Dealer1' }, { EntityId: '4' }, { UserGroupId: 'Default' },{Usertype:'Dealer'}];
        // userInfo = [{ UserId: 'Sheetalk' }, { EntityId: '4' }, { UserGroupId: 'Default' },{Usertype:'Dealer'}];
        // userInfo = [{ UserId: 'RushikeshN_D' }, { EntityId: '4' }, { UserGroupId: 'Default' },{Usertype:'Dealer'}];
        // userInfo = [
        //   { UserId: 'LGTDealer01' },
        //   { EntityId: '158' },
        //   { UserGroupId: 'LGTDealer' },
        //   { Usertype: 'Dealer' },
        // ];
        //  userInfo = [{ UserId: 'LGTDealer02' }, { EntityId: '158' }, { UserGroupId: 'LGTDealer' },{Usertype:'Dealer'}];
        //  userInfo = [{ UserId: 'LGTUser01' }, { EntityId: '158' }, { UserGroupId: 'Default' },{Usertype:'Dealer'}];
        // userInfo = [{ UserId: 'gayatri_j' }, { EntityId: '151' }, { UserGroupId: 'Default' },{Usertype:'Dealer'}];
        // userInfo = [{ UserId: 'JARC_01' }, { EntityId: '151' }, { UserGroupId: 'Default' },{Usertype:'Dealer'}];
        // userInfo = [
        //   { UserId: 'JARDealer_01' },
        //   { EntityId: '151' },
        //   { UserGroupId: 'JARDealer' },
        //   { Usertype: 'Dealer' },
        // ];
        // userInfo = [{ UserId: 'JARDealer_02' }, { EntityId: '151' }, { UserGroupId: 'JARDealer' },{Usertype:'Dealer'}];
        // userInfo = [{ UserId: 'pritam_j' }, { EntityId: '151' }, { UserGroupId: 'Default' },{Usertype:'Dealer'}];

        // userInfo = [{ UserId: 'apurvak_j' }, { EntityId: '151' }, { UserGroupId: 'Default' },{Usertype:'Dealer'}];
        // userInfo = [{ UserId: 'BGCM_01' }, { EntityId: '157' }, { UserGroupId: 'Default' },{Usertype:'Dealer'}];
        // userInfo = [{ UserId: 'AB' }, { EntityId: '4' }, { UserGroupId: 'JARDealer' },{Usertype:'Dealer'}];
        // userInfo = [{ UserId: 'Mayank' }, { EntityId: '4' }, { UserGroupId: 'Dealer' },{Usertype:'Dealer'}];
        userInfo = [{ UserId: 'DJ' }, { EntityId: '4' }, { UserGroupId: 'Dealer' },{Usertype:'Dealer'}];
      }

      console.log("userInfo" , userInfo);
      return userInfo;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  deleteRow(row) {
    this.deleteRowObserver.next(row);
  }

  deleteCreditRow(row) {
    this.deleteCreditRowObserver.next(row);
  }

  formatAmt(amount) {
    try {
      if (amount === '') {
        return amount;
      } else {
        const stramount = parseFloat(amount.replace(/,/g, '')).toFixed(2).toString();
        return (stramount.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  formatNotional(amount) {
    if (amount.indexOf(',') > -1) {
      amount = amount.toString().replace(/,/g, '');
      // amount = parseFloat(amount.replace(/,/g, '')).toFixed(2).toString();

    }
    // tslint:disable-next-line: radix
    // return (parseInt(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    return (parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  }

  getSolveForValue(val) {
    try {
      let solForVal = '';
      switch (val) {
        case 'IBPrice':
          solForVal = 'Price';
          break;
        case 'KO':
          solForVal = 'Autocall Trigger';
          break;
        case 'RebateCoupon':
          solForVal = 'Autocall Coupon';
          break;
        case 'CouponBarrier':
          solForVal = 'Coupon Trigger';
          break;
        case 'Coupon':
          solForVal = 'Coupon (%)';
          break;
        case 'Coupon':
          solForVal = 'Coupon (%)';
          break;
        case 'Strike':
          solForVal = 'Strike (%)';
          break;
        case 'KI':
          solForVal = 'Barrier Level(%)';
          break;
        case 'FundingRate':
          solForVal = 'Rate/Spread (%)';
          break;
        case 'Reoffer':
          solForVal = 'Reoffer';
          break;
      }
      return solForVal;
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }
  InputNumberForInteger(e) {
    try {
      const target: any = this.GetEventTarget(e);
      // tslint:disable-next-line: deprecation
      e = (e) ? e : window.event;
      const code = (e.which) ? e.which : e.keyCode;
      let codes = new Array();
      codes = [8, 9, 13, 17, 18, 19, 20, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
      if (!this.contains.call(codes, code)) {
        return false;
      }
      return true;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setloadflag(status) {
    this.loadingFlag = status;
  }

  getloadflag() {
    return this.loadingFlag;
  }
  checkValidFilledNotional(e) {
    try {
      const target = this.GetEventTarget(e);
      //console.log(target.value);
      let Notional = target.value.replace(/,/g, '');
      //console.log(Notional);
      let ErrorMsg = '';
      if (Notional === '') {
        // target.classList.add('error');
        // ErrorMsg = 'Please enter valid notional';
        Notional = '0.00'
        return { Notional, ErrorMsg };
        // target.focus();
      }
      if (this.chkNotionalFormat(Notional)) {
        ErrorMsg = '';
      } else {
        target.classList.add('error');
        ErrorMsg = 'Please enter valid notional.';
        target.focus();
        return { Notional, ErrorMsg };
      }


      if (Notional === '') {
      } else {
        if ((Notional.toString().match(/([kK]{1})/g)) !== null) {
          Notional = (parseFloat(Notional.replace(/[kK]/g, '') === '' ? 1 : Notional.replace(/[kK]/g, '')) * 1000);
        } else if ((Notional.toString().match(/([lL]{1})/g)) !== null) {
          // Notional = (parseFloat(Notional.replace(/[lL]/g, '')) * 100000);
          Notional = (parseFloat(Notional.replace(/[lL]/g, '') === '' ? 1 : Notional.replace(/[lL]/g, '')) * 100000);
        } else if ((target.value.toString().match(/([mM]{1})/g)) !== null) {
          // Notional = (parseFloat(Notional.replace(/[mM]/g, '')) * 1000000);
          Notional = (parseFloat(Notional.replace(/[mM]/g, '') === '' ? 1 : Notional.replace(/[mM]/g, '')) * 1000000);
        } else if ((target.value.toString().match(/([bB]{1})/g)) !== null) {
          // Notional = (parseFloat(Notional.replace(/[bB]/g, '')) * 1000000000);
          Notional = (parseFloat(Notional.replace(/[bB]/g, '') === '' ? 1 : Notional.replace(/[bB]/g, '')) * 1000000000);
        }
        target.classList.remove('error');
      }

      Notional = parseFloat(Notional).toFixed(2);

      Notional = Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return { Notional, ErrorMsg };
    } catch (error) {
      //console.log('Error:', error);
    }
  }


  checkValidNotional(e) {
    try {
      const target = this.GetEventTarget(e);
      //console.log(target.value);
      let Notional = target.value.replace(/,/g, '');
      //console.log(Notional);
      let ErrorMsg = '';
      if (Notional === '') {
        target.classList.add('error');
        ErrorMsg = 'Please enter valid notional';
        // target.focus();
        return { Notional, ErrorMsg };
      }
      if (this.chkNotionalFormat(Notional)) {
        ErrorMsg = '';
      } else {
        target.classList.add('error');
        ErrorMsg = 'Please enter valid notional.';
        target.focus();
        return { Notional, ErrorMsg };
      }


      if (Notional === '') {
      } else {
        if ((Notional.toString().match(/([kK]{1})/g)) !== null) {
          Notional = (parseFloat(Notional.replace(/[kK]/g, '') === '' ? 1 : Notional.replace(/[kK]/g, '')) * 1000);
        } else if ((Notional.toString().match(/([lL]{1})/g)) !== null) {
          // Notional = (parseFloat(Notional.replace(/[lL]/g, '')) * 100000);
          Notional = (parseFloat(Notional.replace(/[lL]/g, '') === '' ? 1 : Notional.replace(/[lL]/g, '')) * 100000);
        } else if ((target.value.toString().match(/([mM]{1})/g)) !== null) {
          // Notional = (parseFloat(Notional.replace(/[mM]/g, '')) * 1000000);
          Notional = (parseFloat(Notional.replace(/[mM]/g, '') === '' ? 1 : Notional.replace(/[mM]/g, '')) * 1000000);
        } else if ((target.value.toString().match(/([bB]{1})/g)) !== null) {
          // Notional = (parseFloat(Notional.replace(/[bB]/g, '')) * 1000000000);
          Notional = (parseFloat(Notional.replace(/[bB]/g, '') === '' ? 1 : Notional.replace(/[bB]/g, '')) * 1000000000);
        }
        target.classList.remove('error');
      }

      Notional = parseFloat(Notional).toFixed(2);

      Notional = Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return { Notional, ErrorMsg };
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  //Required for Entity default setip
  checkValidMinMaxNotional(e) {
    try {
      const target = this.GetEventTarget(e);
      //console.log(target.value);
      let Notional = target.value.replace(/,/g, '');
      //console.log(Notional);
      let ErrorMsg = '';
      if (Notional === '') {
        ErrorMsg = 'Please enter valid notional';
        // target.focus();
        return { Notional, ErrorMsg };
      }
      if (this.chkNotionalFormat(Notional)) {
        ErrorMsg = '';
      } else {
        ErrorMsg = 'Please enter valid notional.';

        return { Notional, ErrorMsg };
      }

      if (Notional === '') {
      } else {
        if ((Notional.toString().match(/([kK]{1})/g)) !== null) {
          Notional = (parseFloat(Notional.replace(/[kK]/g, '') === '' ? 1 : Notional.replace(/[kK]/g, '')) * 1000);
        } else if ((Notional.toString().match(/([lL]{1})/g)) !== null) {
          // Notional = (parseFloat(Notional.replace(/[lL]/g, '')) * 100000);
          Notional = (parseFloat(Notional.replace(/[lL]/g, '') === '' ? 1 : Notional.replace(/[lL]/g, '')) * 100000);
        } else if ((target.value.toString().match(/([mM]{1})/g)) !== null) {
          // Notional = (parseFloat(Notional.replace(/[mM]/g, '')) * 1000000);
          Notional = (parseFloat(Notional.replace(/[mM]/g, '') === '' ? 1 : Notional.replace(/[mM]/g, '')) * 1000000);
        } else if ((target.value.toString().match(/([bB]{1})/g)) !== null) {
          // Notional = (parseFloat(Notional.replace(/[bB]/g, '')) * 1000000000);
          Notional = (parseFloat(Notional.replace(/[bB]/g, '') === '' ? 1 : Notional.replace(/[bB]/g, '')) * 1000000000);
        }
        target.classList.remove('error');
      }

      Notional = parseFloat(Notional).toFixed(2);

      Notional = Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return { Notional, ErrorMsg };
    } catch (error) {
      //console.log('Error:', error);
    }
  }
  checkValidNotionalRMW(e, fieldName) {
    try {
      const target = this.GetEventTarget(e);
      //console.log(target.value);
      let Notional = target.value.replace(/,/g, '');
      //console.log(Notional);
      let ErrorMsg = '';
      if (Notional === '') {
        target.classList.add('error');
        // ErrorMsg = 'Please enter valid notional';
        ErrorMsg = 'Please enter valid ' + fieldName;
        // target.focus();
        return { Notional, ErrorMsg };
      }
      if (this.chkNotionalFormat(Notional)) {
        ErrorMsg = '';
      } else {
        target.classList.add('error');
        // ErrorMsg = 'Please enter valid notional.';
        ErrorMsg = 'Please enter valid ' + fieldName;
        target.focus();
        return { Notional, ErrorMsg };
      }

      if (Notional === '') {
      } else {
        if ((Notional.toString().match(/([kK]{1})/g)) !== null) {
          Notional = (parseFloat(Notional.replace(/[kK]/g, '') === '' ? 1 : Notional.replace(/[kK]/g, '')) * 1000);
        } else if ((Notional.toString().match(/([lL]{1})/g)) !== null) {
          // Notional = (parseFloat(Notional.replace(/[lL]/g, '')) * 100000);
          Notional = (parseFloat(Notional.replace(/[lL]/g, '') === '' ? 1 : Notional.replace(/[lL]/g, '')) * 100000);
        } else if ((target.value.toString().match(/([mM]{1})/g)) !== null) {
          // Notional = (parseFloat(Notional.replace(/[mM]/g, '')) * 1000000);
          Notional = (parseFloat(Notional.replace(/[mM]/g, '') === '' ? 1 : Notional.replace(/[mM]/g, '')) * 1000000);
        } else if ((target.value.toString().match(/([bB]{1})/g)) !== null) {
          // Notional = (parseFloat(Notional.replace(/[bB]/g, '')) * 1000000000);
          Notional = (parseFloat(Notional.replace(/[bB]/g, '') === '' ? 1 : Notional.replace(/[bB]/g, '')) * 1000000000);
        }
        target.classList.remove('error');
      }
      Notional = parseFloat(Notional).toFixed(2);
      Notional = Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return { Notional, ErrorMsg };
    } catch (error) {
      //console.log('Error:', error);
    }
  }


  chkNotionalFormat(notional) {
    try {
      const regex: RegExp = new RegExp(/^[0-9]*(\.[0-9]*){0,1}$/g);
      const regex3: RegExp = new RegExp(/^[0-9]*(\.[0-9]*){0,1}([A-Za-z]){0,1}$/g);

      notional = notional.toString();
      if (notional.match(regex) || notional.match(regex3)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // allowOneDecimalInInput(e) {
  //   try {
  //     const target = this.GetEventTarget(e);
  //     var regex = /^[0-9]+\.?[0-9]*/g;
  //     target.value = regex.exec(target.value);
  //   }
  //   catch (error) {
  //     //console.log("Error:", error);
  //   }
  // }

  // allowOneDecimalInNegativeInput(e) {
  //   try {
  //     const target = this.GetEventTarget(e); //^[0-9 -]+\.?[0-9]*
  //     var regex = /^[0-9 -]+\.?[0-9]*/g;
  //     target.value = regex.exec(target.value);
  //   }
  //   catch (error) {
  //     //console.log("Error:", error);
  //   }
  // }

  AutocallTriggerInputNumber(e) {
    try {
      const target: any = this.GetEventTarget(e);
      // tslint:disable-next-line: deprecation
      e = (e) ? e : window.event;
      const code = (e.which) ? e.which : e.keyCode;
      let codes = new Array();
      codes = [8, 9, 13, 17, 18, 19, 20, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
      if (!this.contains.call(codes, code)) {
        return false;
      }
      return true;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  chkNotionalFormat_keyUp(e) {
    try {
      const regex: RegExp = new RegExp(/^[0-9]*(\.[0-9]*){0,1}$/g);
      const regex3: RegExp = new RegExp(/^[0-9]*(\.[0-9]*){0,1}([A-Za-z]){0,1}$/g);
      // var regex=/^[0-9]+\.?[0-9]*/g;
      let notional = e.target.value;
      notional = notional.toString().replace(/,/g, '');
      // //console.log(notional);
      if (notional.match(regex) || notional.match(regex3)) {
        return true;
      } else {
        if (!notional.match(regex)) {
          e.target.value = /^[0-9]*(\.[0-9]*){0,1}/g.exec(notional)[0];
          // //console.log('false1');
        } else if (!notional.match(regex3)) {
          e.target.value = /^[0-9]*(\.[0-9]*){0,1}([A-Za-z]){0,1}/g.exec(notional);
          // //console.log('false2');
        }
        return false;
      }
    } catch (error) {
      //console.log(error);
    }
  }

  xml2json(xmlString): any {
    const parser = new DOMParser();
    // const xml = '';
    // const xml = parser.parseFromString(xmlString.replace(/?/g, '').replace(/\s\s+/g, ' '), 'text/xml');
    const xml = parser.parseFromString(xmlString, 'text/xml');
    //console.log(xml);
    const obj = this.xml2jsonservice.xmlToJson(xml);
    return obj;
  }

  json2xml(obj) {
    let xml = '';
    for (const prop in obj) {
      xml += obj[prop] instanceof Array ? '' : '<' + prop + '>';
      if (obj[prop] instanceof Array) {
        for (const array in obj[prop]) {
          xml += '<' + prop + '>';
          xml += this.json2xml(new Object(obj[prop][array]));
          xml += '</' + prop + '>';
        }
      } else if (typeof obj[prop] === 'object') {
        xml += this.json2xml(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : '</' + prop + '>';
    }
    xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml;
  }


  getSpainDate(orignalDate, time) {
    try {
      const orignalDate1 = new Date(orignalDate + ' ' + time).toLocaleString('es-AR', { timeZone: 'Europe/Madrid' });
      const formatedFrmDate1 = orignalDate1.split(' ')[0].split('/')[1] +
        '/' +
        orignalDate1.split(' ')[0].split('/')[0] +
        '/' +
        orignalDate1.split(' ')[0].split('/')[2];
      const formatedFrmDate2 = this.datepipe.transform(formatedFrmDate1, 'dd-MMM-yyyy') +
        ' ' +
        new Date(orignalDate + ' ' + time).toLocaleString('es-AR', { timeZone: 'Europe/Madrid' }).split(' ')[1];
      return formatedFrmDate2;
    } catch (error) {
      //console.log(error);
    }
  }

  changeLayout() {
    this.layout = !this.layout;
  }

  getLayout() {
    return this.layout;
  }

  formatDate(Datestr: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let dateArray = [];
    dateArray = Datestr?.split('-');
    let monthNo = (months.indexOf(dateArray[1]) + 1) + '';
    // //console.log(monthNo);
    if (monthNo.length === 1) {
      monthNo = '0' + monthNo;
    }
    // //console.log(dateArray[2] + '-' + monthNo + '-' + dateArray[0]);
    return dateArray[2] + '-' + monthNo + '-' + dateArray[0];
  }

  getEntityOfUser(){
    const webMethod = this.interfaceurl + 'GetEntityDetails';
    const parameters = {
      "userID":this.auth.UserName
    }
    return this.http.post(webMethod, parameters).toPromise();   
  }


  InputSpread(e) {
    try {
      const target: any = this.GetEventTarget(e);
      // tslint:disable-next-line: deprecation
      e = (e) ? e : window.event;
      const code = (e.which) ? e.which : e.keyCode;
      let codes = new Array();
      codes = [8, 9, 13, 17, 18, 19, 20, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 45, 47];
      if (!this.contains.call(codes, code)) {
        return false;
      }
      // if (e.key === '-') {
      //   if (target.value.indexOf('-') > -1) {
      //     return false;
      //   }
      // }
      // if (e.key === '.') {
      //   if (target.value.indexOf('.') > -1) {
      //     return false;
      //   }
      // }
      return true;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  formatSlashDate(Datestr: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let dateArray = [];
    dateArray = Datestr.split('/');

    // //console.log(dateArray[2] + '-' + monthNo + '-' + dateArray[0]);
    return dateArray[0] + '-' + months[dateArray[1] - 1] + '-' + dateArray[2];
  }

  validTime(inputtime) {
    try {
      //console.log(inputtime);
      const regex: RegExp = new RegExp(/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/g);
      inputtime = inputtime.toString();
      if (inputtime.match(regex) !== null) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  getInputTime(inputTime: any) {
    const timeSplit = inputTime.split(':');
    let hours = timeSplit[0];
    const minutes = timeSplit[1];
    let meridian: any;
    if (hours > 12) {
      meridian = 'PM';
      hours -= 12;
    } else if (hours < 12) {
      meridian = 'AM';
      if (hours === 0) {
        hours = 12;
      }
    } else {
      meridian = 'PM';
    }
    return (hours === '00' ? '12' : hours) + ':' + minutes + ' ' + meridian;
  }

  formatSlashMaturityDate(Datestr: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let dateArray = [];
    dateArray = Datestr.split('/');

    // //console.log(dateArray[2] + '-' + monthNo + '-' + dateArray[0]);
    return dateArray[0] + '-' + months[dateArray[1] - 1] + '-' + (parseInt(dateArray[2]) + 1).toString();
  }

  fnCompareNotional(amt1, amt2) {

    // //console.log(this.txtnotional.replace);
    // return amt =='0' || amt== '' || amt =='0.00' ?  0.00: parseFloat(amt.replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // //console.log(parseFloat(amt1.replace(/,/g, '')));
    // //console.log(this.totalNotional);
    if (parseFloat(amt1.replace(/,/g, '')) === parseFloat(amt2.replace(/,/g, ''))) {
      return true;
    }
    return false;
  }

  strToFloat(str) {
    return parseFloat(str.replace(/,/g, '')) || 0.00
  }

  //apurva
  // setState(state) {
  //   this.state = state;
  //   //console.log("set value ", this.state)
  // }
  // getState() {
  //   return this.state
  // }
  // setAccord(accord, template) {
  //   this.accord = []
  //   this.accord.push(accord);
  //   this.accord.push(template);

  // }
  // getAccord() {
  //   return this.accord
  // }
alphaNumSorting(arr) {
    // var arr = ['12m', '1m', '6m', '3m'];

    // regular expression to get the alphabetic and the number parts, if any
    var regex = /^([a-z]*)(\d*)/i;

    function sortFn(a, b) {
      var _a = a['Key'].match(regex);
      var _b = b['Key'].match(regex);

      // if the alphabetic part of a is less than that of b => -1
      if (_a[1] < _b[1]) return -1;
      // if the alphabetic part of a is greater than that of b => 1
      if (_a[1] > _b[1]) return 1;

      // if the alphabetic parts are equal, check the number parts
      var _n = parseInt(_a[2]) - parseInt(_b[2]);
      if (_n == 0) // if the number parts are equal start a recursive test on the rest
        return sortFn(a.substr(_a[0].length), b.substr(_b[0].length));
      // else, just sort using the numbers parts
      return _n;
    }

    return arr.sort(sortFn);
  }
  TenorValidationwithoutDays(e) {
    try {
      const target: any = this.GetEventTarget(e);
      // tslint:disable-next-line: deprecation
      e = (e) ? e : window.event;
      const code = (e.which) ? e.which : e.keyCode;
      let codes = new Array();
      codes = [8, 9, 13, 17, 18, 19, 20, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,  77, 87, 89, 109, 119, 121];
      if (!this.contains.call(codes, code)) {
        return false;
      }
      return true;
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  // Min max value format changes || by pranav D || 26Mar2022 start 

  nFormatter(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
  }
   // Min max value format changes || by pranav D || 26Mar2022 end 


  //  Added by Amogh K | 25 Aug 2022 | EUJARINT-511 start
   formatXMLString(str:string){   
    let formattedStr = str 
    if(formattedStr.includes('&'))
      formattedStr =  formattedStr.replace(/\&/gi, '&amp;')
    if(formattedStr.includes('"'))
      formattedStr =  formattedStr.replace(/\"/gi, "&quot;")
    if(formattedStr.includes("'"))
      formattedStr =  formattedStr.replace(/\'/gi, "&apos;")
    if(formattedStr.includes('<'))
      formattedStr =  formattedStr.replace(/\</gi, "&lt;") 
    if(formattedStr.includes('>'))
      formattedStr =  formattedStr.replace(/\>/gi, "&gt;")
    return formattedStr;  
   }
   //  Added by Amogh K | 25 Aug 2022 | EUJARINT-511 end

   customTenorValidation(e, inputTxtBox){
    try {
      let len = inputTxtBox.length;
      if(len === 0){
        e = (e) ? e : window.event;
        const code = (e.which) ? e.which : e.keyCode;
        let codes = new Array();
        codes = [8, 9, 13, 17, 18, 19, 20, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
        if (!this.contains.call(codes, code)) {
          return false;
        }
        return true;
      }
      else{
        e = (e) ? e : window.event;
        const code = (e.which) ? e.which : e.keyCode;
        let codes = new Array();
        codes = [8, 9, 13, 17, 18, 19, 20, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,  77, 87, 89, 109, 119, 121];
        if (!this.contains.call(codes, code)) {
          return false;
        }
        else{
          let codes = new Array();
          codes = [77, 87, 89, 109, 119, 121];
          const code = inputTxtBox.charCodeAt(len - 1);
          if (this.contains.call(codes, code)) {
            return false;
          }
          else{
            return true;
          }
        }
      }
    } catch (error) {
    }
  }

}
