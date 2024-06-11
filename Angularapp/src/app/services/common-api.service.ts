import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { DecimalPipe, Location } from '@angular/common';
import { HomeApiService } from './home-api.service';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Injectable({
  providedIn: 'root',
})
export class CommonApiService {
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  specialCaseTags = [];
  sampleString: string;
  sampleString2: string;
  public entitlements: any = [];
  private isKyc = new BehaviorSubject<any>(false);
  isKycObserver = this.isKyc.asObservable();

  private getactivetab = new BehaviorSubject<any>('');
  getactivetabObserver = this.getactivetab.asObservable();

  private iscustomer = new BehaviorSubject<any>(false);
  iscustomerObserver = this.iscustomer.asObservable();

  private redirecttohome = new BehaviorSubject<any>('');
  redirecttohomeObserver = this.redirecttohome.asObservable();

  private redirecttoCashDeposit = new BehaviorSubject<any>('');
  redirecttoCashDepositObserver = this.redirecttoCashDeposit.asObservable();

  public selectSIPFund = new BehaviorSubject<any>('');
  selectSIPFundObserver = this.selectSIPFund.asObservable();

  public selectedAsset = new BehaviorSubject<any>('');
  selectedAssetObserver = this.selectedAsset.asObservable();

  public selectedState = new BehaviorSubject<any>('');
  selectedStateObserver = this.selectedState.asObservable();

  public selectedDir = new BehaviorSubject<any>('');
  selectedDirObserver = this.selectedDir.asObservable();

  public selectedPortfolio = new BehaviorSubject<any>('');
  selectedPortfolioObserver = this.selectedPortfolio.asObservable();

  public selectedPortfolioalloc = new BehaviorSubject<any>('');
  selectedPortfolioallocObserver = this.selectedPortfolioalloc.asObservable();

  public selectedPortfolioBal = new BehaviorSubject<any>('');
  selectedPortfolioBalObserver = this.selectedPortfolioBal.asObservable();

  // Added by Mayuri D. on 07th Feb 2022 ... START....

  public SetFlagtoCustomer = new BehaviorSubject<any>('');
  SetFlagtoCustomerObserver = this.SetFlagtoCustomer.asObservable();

  // Added by Mayuri D. on 07th Feb 2022 ... END....

  ViewCard = new BehaviorSubject<any>([]);
  ViewCardObserver = this.ViewCard.asObservable();

  hideMenu = new BehaviorSubject<any>(false);
  hideMenuObs = this.hideMenu.asObservable();

  graphData = new BehaviorSubject<any>([]);
  graphDataObserver = this.graphData.asObservable();

  bondInfo = new BehaviorSubject<any>([]);
  bondInfoObserver = this.bondInfo.asObservable();

  dealno = new BehaviorSubject<any>('');
  dealnoObserver = this.dealno.asObservable();

  tokenid = new BehaviorSubject<any>('');
  tokenidObserver = this.tokenid.asObservable();

  login = new BehaviorSubject<any>('');
  loginObserver = this.login.asObservable();

  btnAction = new BehaviorSubject<any>('');
  btnActionObserver = this.btnAction.asObservable();

  btnID = new BehaviorSubject<any>('');
  btnIDObserver = this.btnID.asObservable();

  fundDetails = new BehaviorSubject<any>([]);
  fundDetailsObserver = this.fundDetails.asObservable();

  companyLogo = new BehaviorSubject<any>('');
  companyLogoObserver = this.companyLogo.asObservable();

  deleteTile = new BehaviorSubject<any>([]);
  deleteTileObserver = this.deleteTile.asObservable();

  showTicker = new BehaviorSubject<any>(false);
  showTickerObs = this.showTicker.asObservable();

  showPDFMode = new BehaviorSubject<any>(false);
  showPDFModeObs = this.showPDFMode.asObservable();

  constructor(
    public xml2jsonservice: NgxXml2jsonService,
    public decimalPipe: DecimalPipe,
    public homeapi: HomeApiService,
    public location: Location
  ) { }

  GetEventTarget(e): any {
    try {
      const target: any = e.target || e.srcElement || e.currentTarget || null;
      return target;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  setCompanyLogo(logoName) {
    this.companyLogo.next(logoName);
  }

  ResetbtnAction() {
    this.btnAction.next('');
  }

  ResetbtnID() {
    this.btnID.next('');
  }

  moveUpSelection(_e, selectedIndex) {
    try {
      // console.log('selectedIndex index',e, selectedIndex)
      // console.log(target, selectedIndex);
      if (selectedIndex > 0) {
        selectedIndex--;
      }
      this.ScrollTo('.SelectorBox', '.HoverSuggestion', 'down');
      return selectedIndex;
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  ScrollTo(container, element, direction) {
    try {
      const $container = $(container);
      const $scrollTo = $(element);
      // //console.log($container, $scrollTo);
      switch (direction) {
        case 'up':
          $container.animate(
            {
              scrollTop:
                $scrollTo.offset().top -
                $container.offset().top +
                $container.scrollTop(),
            },
            50
          );
          break;
        case 'down':
          $container.animate(
            {
              scrollTop:
                $scrollTo.offset().top -
                $container.offset().top +
                $container.scrollTop() -
                100,
            },
            10
          );
          break;
        default:
          break;
      }
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  moveDownSelection(_e, selectedIndex) {
    try {
      // console.log('selectedIndex index',e, selectedIndex)
      if (selectedIndex < $('.SelectorBox')[0].childElementCount - 1) {
        selectedIndex++;
      }
      if ($('.SelectorBox')[0].childElementCount > selectedIndex) {
        this.ScrollTo('.SelectorBox', '.HoverSuggestion', 'up');
        return selectedIndex;
      }
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  moveUpSelectionCcy(_e, selectedIndex) {
    try {
      // console.log('selectedIndex index',e, selectedIndex)
      // console.log(target, selectedIndex);
      if (selectedIndex > 0) {
        selectedIndex--;
      }
      this.ScrollTo('.setting-grid', '.ccyselected', 'down');
      return selectedIndex;
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  moveDownSelectionCcy(_e, selectedIndex) {
    try {
      // console.log('selectedIndex index',e, selectedIndex)
      if (selectedIndex < $('.setting-grid')[0].childElementCount - 1) {
        selectedIndex++;
      }
      if ($('.setting-grid')[0].childElementCount > selectedIndex) {
        this.ScrollTo('.setting-grid', '.ccyselected', 'up');
        return selectedIndex;
      }
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  UnformatNumber(e) {
    try {
      const target: any = this.GetEventTarget(e);
      target.value = target.value.replace(/,/g, '');
      if (target.value === '0.00') {
        target.value = '';
      }
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  UnformatNumberwithoutevent(number) {
    try {
      number = number.replace(/,/g, '');
      return number;
      // if (target.value === '0.00') {
      //   target.value = '';
      // }
    } catch (error) {
      // console.log("Error:", error);
      return number;
    }
  }

  UnformatNumberwithcomma(number) {
    try {
      if (number.includes(',')) {
        number = number.replace(/,/g, '');
      } else {
        return number;
      }
      return number;

      // if (target.value === '0.00') {
      //   target.value = '';
      // }
    } catch (error) {
      // console.log("Error:", error);
      return number;
    }
  }

  FormatNumber(e) {
    const target: any = this.GetEventTarget(e);
    // //console.log(target.id, $('#' + target.id)[0].value);
    const notional = target.value;
    if (target.value.trim() === '') {
      target.value = '0.00';
      const evt = new Event('change');
      target.dispatchEvent(evt);
    } else {
      this.sampleString = target.value;
      if (this.sampleString.includes('.')) {
        if (this.sampleString.indexOf('.') === 0) {
          target.value = '0' + this.sampleString;
        }
        try {
          target.value = this.toFixed(this.sampleString.replace(/,/, ''), 2);
        } catch (EX) { }
      } else {
        try {
          target.value = this.sampleString.replace(/,/, '') + '.00';
        } catch (EX) { }
      }
      target.value = target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return notional;
  }

  FormatNumberr(v) {
    try {
      // const target: any = this.GetEventTarget(e);
      // //console.log(target.id, $('#' + target.id)[0].value);
      // let ccy = this.homeapi.baseCCY;
      // let decimal;
      if (v === '-') {
        return v;
      }
      if (v.toString().trim() === '') {
        v = '0.00';
        // const evt = new Event('change');
        // target.dispatchEvent(evt);
      } else {
        // if (ccy === 'INR') {
        //   decimal = parseFloat(v).toFixed(2).split('.')[1];
        //   v = parseFloat(v).toFixed(2).split('.')[0];
        //   if (v.length > 3) {
        //     var lastThree = v.substring(v.length - 3);
        //     var otherNumbers = v.substring(0, v.length - 3);
        //     if (otherNumbers != '') lastThree = ',' + lastThree;
        //     v =
        //       otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
        //       lastThree +
        //       decimal;
        //   } else {
        //     v = v + '.' + decimal;
        //   }
        // } else {
        v = parseFloat(v)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      // }
      // //console.log(notional);
      return v;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  FormatNumbernull(v) {
    try {
      // const target: any = this.GetEventTarget(e);
      // //console.log(target.id, $('#' + target.id)[0].value);
      // let ccy = this.homeapi.baseCCY;
      // let decimal;
      if (v === '-') {
        return v;
      }
      if (v.toString().trim() === '') {
        v = '';
        // const evt = new Event('change');
        // target.dispatchEvent(evt);
      } else {
        // if (ccy === 'INR') {
        //   decimal = parseFloat(v).toFixed(2).split('.')[1];
        //   v = parseFloat(v).toFixed(2).split('.')[0];
        //   if (v.length > 3) {
        //     var lastThree = v.substring(v.length - 3);
        //     var otherNumbers = v.substring(0, v.length - 3);
        //     if (otherNumbers != '') lastThree = ',' + lastThree;
        //     v =
        //       otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
        //       lastThree +
        //       decimal;
        //   } else {
        //     v = v + '.' + decimal;
        //   }
        // } else {
        v = parseFloat(v)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '';
      }
      // }
      // //console.log(notional);
      if (isNaN(v)) {
        return ''
      } else {
        return v;
      }
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  FormatNumberfourDecimal(v) {
    try {
      // const target: any = this.GetEventTarget(e);
      // //console.log(target.id, $('#' + target.id)[0].value);
      if (v.toString().trim() === '') {
        v = '0.00';
        // const evt = new Event('change');
        // target.dispatchEvent(evt);
      } else {
        v = parseFloat(v)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      // //console.log(notional);
      return v;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  FormatNumberRMW(v) {
    try {
      // const target: any = this.GetEventTarget(e);
      // //console.log(target.id, $('#' + target.id)[0].value);
      if (v.toString().trim() === '') {
        v = '0.00';
        // const evt = new Event('change');
        // target.dispatchEvent(evt);
      } else {
        v = parseFloat(v)
          .toFixed(6)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      // //console.log(notional);
      return v;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  // Added by Ketan S. on 9-July-2020
  FormatNumberKetan(e) {
    const target: any = this.GetEventTarget(e);
    // //console.log(target.id, $('#' + target.id)[0].value);
    const notional = target.value;
    if (target.value.trim() === '') {
      target.value = '0.00';
      const evt = new Event('change');
      target.dispatchEvent(evt);
    } else {
      this.sampleString = target.value;
      if (this.sampleString.includes('.')) {
        if (this.sampleString.indexOf('.') === 0) {
          target.value = '0' + this.sampleString;
        }
        target.value = this.toFixed(this.sampleString, 2);
      } else {
        target.value = this.sampleString + '.00';
      }
      target.value = target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return notional;
  }

  toFixed(num, fixed) {
    const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
  }

  NotionalChange(e) {
    try {
      const target: any = this.GetEventTarget(e);

      if (target.value === '') {
      } else {
        if (target.value.toString().match(/([kK]{1})/g) != null) {
          // //console.log('K');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[kK]/g, '000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[kK]/g, '')) * 1000
          ).toFixed(2);
        } else if (target.value.toString().match(/([lL]{1})/g) != null) {
          // //console.log('L');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '00000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[lL]/g, '')) * 100000
          ).toFixed(2);
        } else if (target.value.toString().match(/([mM]{1})/g) != null) {
          // //console.log('M');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '000000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[mM]/g, '')) * 1000000
          ).toFixed(2);
        } else if (target.value.toString().match(/([bB]{1})/g) != null) {
          // //console.log('B');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[bB]/g, '000000000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[bB]/g, '')) * 1000000000
          ).toFixed(2);
        }
      }
      return target.value;
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  NotionalChangeWOTarget(value) {
    try {
      const target: any = {};
      target.value = value;

      if (target.value === '') {
      } else {
        if (target.value.toString().match(/([kK]{1})/g) != null) {
          // //console.log('K');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[kK]/g, '000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[kK]/g, '')) * 1000
          ).toFixed(2);
        } else if (target.value.toString().match(/([lL]{1})/g) != null) {
          // //console.log('L');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '00000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[lL]/g, '')) * 100000
          ).toFixed(2);
        } else if (target.value.toString().match(/([mM]{1})/g) != null) {
          // //console.log('M');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '000000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[mM]/g, '')) * 1000000
          ).toFixed(2);
        } else if (target.value.toString().match(/([bB]{1})/g) != null) {
          // //console.log('B');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[bB]/g, '000000000')).toFixed(2);
          target.value = (
            parseFloat(target.value.replace(/[bB]/g, '')) * 1000000000
          ).toFixed(2);
        }
      }
      return target.value;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  contains(key) {
    try {
      const findNaN = key !== key;
      let indexOf: any;
      if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
      } else {
        indexOf = function (key) {
          let i = -1;
          let index = -1;
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
      // console.log("Error:", error);
    }
  }

  NotionalValidate(e) {
    try {
      // //console.log(e.keyCode);.

      const target: any = this.GetEventTarget(e);
      e = e ? e : window.event;
      const code = e.which ? e.which : e.keyCode;
      const value = target.value.toString();
      // console.log(value);
      let codes = new Array();
      // Checking for number inputs, k, m, b, ., del or backspace
      codes = [
        8, 9, 13, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 66, 75, 76, 77,
        98, 107, 108, 109, 127,
      ];
      // //console.log(this.contains.call(codes, code), code);
      if (!this.contains.call(codes, code)) {
        return false;
      }
      // if (code === 46) {
      //   this.count += 1;
      //   if (this.count > 1) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // }

      if (
        value.includes('k') ||
        value.includes('K') ||
        value.includes('l') ||
        value.includes('L') ||
        value.includes('m') ||
        value.includes('M') ||
        value.includes('b') ||
        value.includes('B')
      ) {
        return false;
      }

      return true;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  getWorkflowId(workflowName: string, workflowsArray: Array<any>): string {
    return workflowsArray.filter((w: any) => w.value === workflowName)[0].Id;
  }

  xml2json(xmlString): any {
    const parser = new DOMParser();
    // const xml = '';
    // const xml = parser.parseFromString(xmlString.replace(/?/g, '').replace(/\s\s+/g, ' '), 'text/xml');
    const xml = parser.parseFromString(xmlString, 'text/xml');

    const obj = this.xml2jsonservice.xmlToJson(xml);
    return obj;
  }

  json2xml(obj) {
    let xml = '';
    // eslint-disable-next-line guard-for-in
    for (const prop in obj) {
      xml += obj[prop] instanceof Array ? '' : '<' + prop + '>';
      if (obj[prop] instanceof Array) {
        // eslint-disable-next-line guard-for-in
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

  convertTagNames(tagname: string, type: string): string {
    let converted = '';
    if (type === 'header') {
      converted = tagname.replace(/_x0020_/g, ' ');
      if (converted.includes('_')) {
        converted = converted.replace(/_/g, ' ');
        if (!this.specialCaseTags.includes(converted)) {
          this.specialCaseTags.push(converted);
        }
      }
    } else {
      if (this.specialCaseTags.includes(tagname)) {
        converted = tagname.replace(/\s/g, '_');
      } else {
        converted = tagname.replace(/\s/g, '_x0020_');
      }
    }
    // if (side && converted.includes('_')) {
    //   console.log(converted);
    //   return converted.replace(/_/g, ' ');
    // }
    return converted;
  }

  checkAndFormatDate(value: string): string {
    if (!isNaN(Date.parse(value))) {
      const d = new Date(value);
      return (
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
        '-' +
        this.months[d.getMonth()] +
        '-' +
        d.getFullYear()
      );
    }
    return value;
  }

  checkAndFormatDateTime(value: string): string {
    if (!isNaN(Date.parse(value))) {
      const d = new Date(value);
      return (
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
        '-' +
        this.months[d.getMonth()] +
        '-' +
        d.getFullYear() +
        ' ' +
        (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
        ':' +
        (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) +
        ':' +
        '00'
      );
    }
    return value;
  }

  isNumber(evt) {
    evt = evt ? evt : window.event;
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  isContactNumber(evt) {
    evt = evt ? evt : window.event;
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 43) {
      return false;
    }
    return true;
    // evt = (evt) ? evt : window.event;
    // const charCode = (evt.which) ? evt.which : evt.keyCode;
    // if ((charCode > 48 && charCode < 57) || charCode === 43 || charCode === 8 || charCode === 9 || charCode === 107 || charCode === 16 ) {
    //   if (charCode === 107) {
    //     this.sampleString2 = evt.value;
    //     if (this.sampleString2.includes('+')) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }
    //   return true;
    // } else{
    //  return false;
    // }
    //   return false;
    // }
    // return true;

    // const target: any = this.GetEventTarget(e);
    // e = (e) ? e : window.Event;
    // const code = (e.which) ? e.which : e.keyCode;
    // // var iKeyCode = (evt.which) ? evt.which : evt.keyCode;
    // if (code > 31 && (code < 48 || code > 57) && code === 43) {
    //   // console.log('return false');
    //   if (code === 43) {
    //     this.sampleString2 = target.value;
    //     if (this.sampleString2.includes('+')) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }
    //   return false;
    // }
    // // console.log('return true');
    // return true;
  }

  isalpha(evt) {
    // alert(event);

    // var key;
    evt = evt ? evt : window.event;
    const key = evt.which ? evt.which : evt.keyCode;
    // if (window.event) {
    //   key = window.event.keyCode;
    // } else if (event) {
    //   key = event.which;
    // }
    // var key = window.event.key || event.key;
    // alert(key.value);
    return (key >= 65 && key <= 90) || (key >= 95 && key <= 122) || key === 32;
  }
  isAlphaNumeric(evt) {
    evt = evt ? evt : window.event;
    const key = evt.which ? evt.which : evt.keyCode;
    return (
      (key >= 65 && key <= 90) ||
      (key >= 95 && key <= 122) ||
      key === 32 ||
      !(key > 31 && (key < 48 || key > 57))
    );
  }
  isvalidContactNo(evt) {
    evt = evt ? evt : window.event;
    // const key = (evt.which) ? evt.which : evt.key;
    // console.log(evt.key);
    const phoneno = /^\+?([0-9])/;
    if (phoneno.test(evt.key)) {
      return true;
    } else {
      // console.log('error');
      return false;
    }
  }

  FormatNumberwithoutevent(amount: any) {
    // if (amount.trim() === '') {
    //   amount = '0.00';
    // } else {
    //   amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // }
    // return amount;
    if (amount.trim() === '') {
      amount = '0.00';
    } else {
      var sampleString1 = amount;
      if (sampleString1.includes('.')) {
        if (sampleString1.indexOf('.') === 0) {
          amount = '0' + sampleString1;
        }
        amount = this.toFixed(sampleString1, 2);
      } else {
        amount = sampleString1 + '.00';
      }
      amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return amount;
  }

  setiskycflag(flag: boolean) {
    this.isKyc.next(flag);
  }

  isCustomerCreated(value: boolean) {
    this.iscustomer.next(value);
  }
  setRedirectFlag(flag) {
    this.redirecttohome.next(flag);
  }
  setAccountInfoForRedirectTocashDesposit(accountDetails) {
    this.redirecttoCashDeposit.next(accountDetails);
  }

  clearredirecttoCashDepositObserver() {
    this.redirecttoCashDeposit.next(null);
  }

  setActiveNewOrderEntry(val: string) {
    this.getactivetab.next(val);
  }
  NotionalConvert(v, _ccy) {
    try {
      let type = 1;
      // v = v.toString();
      // console.log(Math.sign(v));
      if (Math.sign(v) === -1) {
        type = -1;
        v = Math.abs(v);
        // console.log(v);
      }

      const target = v;

      if (target === '') {
      } else {
        // if (ccy === 'INR') {
        //   if (target >= 10000000) {
        //     v = (target / 10000000).toFixed(1) + 'Cr';
        //   } else if (target >= 100000) {
        //     v = (target / 100000).toFixed(1) + 'L';
        //   } else if (target >= 1000) {
        //     v = (target / 1000).toFixed(1) + 'K';
        //   } else {
        //     v = v.toFixed(2);
        //   }
        // } else {
        if (target >= 1000000) {
          v = (target / 1000000).toFixed(1) + 'M';
        } else if (target >= 100000) {
          v = (target / 1000).toFixed(1) + 'K';
        } else if (target >= 1000) {
          v = (target / 1000).toFixed(1) + 'K';
        } else {
          v = v.toFixed(2);
        }
      }
      // }
      if (type === -1) {
        v = '-' + v;
      }
      return v;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  compareSecondColumnAsc(a, b) {
    if (a[1] === b[1]) {
      return 0;
    } else {
      return a[1] < b[1] ? 1 : -1;
    }
  }

  compareSecondColumnDesc(a, b) {
    if (a[1] === b[1]) {
      return 0;
    } else {
      return a[1] < b[1] ? -1 : 1;
    }
  }

  FormatNumberValue(v) {
    try {
      if (v.toString().trim() === '') {
        v = '0.00';
      } else {
        v = parseFloat(v)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      // //console.log(notional);
      return v;
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  setSIPFund(asset) {
    this.selectSIPFund.next(asset);
  }

  setAsset(asset) {
    this.selectedAsset.next(asset);
  }

  setDirection(dir) {
    this.selectedDir.next(dir);
  }
  setPortfolio(folio) {
    this.selectedPortfolio.next(folio);
  }

  // Added by Mayuri D. on 07th Feb 2022 ... START....

  setFlagToDisplayCust(CustToFlag) {
    console.log('in api functionobserver  ', CustToFlag);
    this.SetFlagtoCustomer.next(CustToFlag);
  }
  // Added by Mayuri D. on 07th Feb 2022 ... END....

  setallocation(alloc: any[], name) {
    this.selectedPortfolioalloc.next({ alloc, name });
  }

  setPortfoliobalance(folioBalance) {
    this.selectedPortfolioBal.next(folioBalance);
  }

  displayCard(card) {
    this.ViewCard.next(card);
  }
  sendData(data) {
    this.graphData.next(data);
  }
  HideSidebar(hideFlag) {
    this.hideMenu.next(hideFlag);
  }
  sendDatatoBondsOrderEntry(data, action) {
    this.bondInfo.next({ data, action });
  }
  sendDataforVerification(dealno, tokenid, login, action, buttonID) {
    this.dealno.next(dealno);
    this.tokenid.next(tokenid);
    this.login.next(login);
    this.btnAction.next(action);
    this.btnID.next(buttonID);
  }
  setFundDetails(data) {
    this.fundDetails.next(data);
  }

  removetile(arg: any) {
    this.deleteTile.next(arg);
  }
  formatNumber(value) {
    return this.decimalPipe.transform(value, '1.2-2');
  }
  formatNumberWithKLM(value) {
    if (value.toString().match(/([kK]{1})/g) != null) {
      value = (parseFloat(value.replace(/[kK]/g, '')) * 1000).toFixed(2);
    } else if (value.toString().match(/([lL]{1})/g) != null) {
      value = (parseFloat(value.replace(/[lL]/g, '')) * 100000).toFixed(2);
    } else if (value.toString().match(/([mM]{1})/g) != null) {
      value = (parseFloat(value.replace(/[mM]/g, '')) * 1000000).toFixed(2);
    } else if (value.toString().match(/([bB]{1})/g) != null) {
      value = (parseFloat(value.replace(/[bB]/g, '')) * 1000000000).toFixed(2);
    }
    return this.decimalPipe.transform(value, '1.2-2');
  }
  unformatNumber(value) {
    return value.toString().replace(/,/g, '');
  }

  setRMWstate(state: any[]) {
    this.selectedState.next(state);
  }
  SelectFullText(event) {
    const target: any = this.GetEventTarget(event);
    target.select();
  }

  toggleTicker(value: boolean) {
    this.showTicker.next(value);
  }
  togglePDFMode(value: boolean) {
    this.showPDFMode.next(value);
  }
  back() {
    this.location.back();
  }
  // Accepts the array and key
  groupBy(array, key) {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  }
  clusterArray(array, uniqueKey) {
    // Return the end result

    return [
      ...// spread the values iterator to an array
      array
        .reduce((r, o) => {
          const key = uniqueKey; // generate a key with name and age
          if (!r.has(key)) r.set(key, []); // add a new entry for key if it's not in the Map

          r.get(key).push(o); // push the current object to the keys's entry

          return r;
        }, new Map())
        .values(), // get the Maps values iterator
    ];
  }

  getLocalDateFromEpochDate(epochdate) {
    // const datetime = epochdate.replace(/(Date\(|(\/)|\))/g,'');
    return new Date(epochdate.match(/\d+/)[0] * 1);
  }

  //Start ||Added by Shraddha D || LGTGTWINT-836 || 9-Jan-23

  FormatNumberInWorkflow(v, prec) {
    try {

      if (v.toString().trim() === '') {
        v = '0.00';

      } else {
        if (prec < 4) {
          v = parseFloat(v)
            .toFixed(prec)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        }
        else {

          v = parseFloat(v)
            .toFixed(prec)
            .toString()

        }


      }

      return v;
    } catch (error) {

    }
  }

  //End ||Added by Shraddha D || LGTGTWINT-836 || 9-Jan-23
}
