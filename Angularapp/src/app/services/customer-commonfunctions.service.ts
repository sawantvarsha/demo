import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgxXml2jsonService } from 'ngx-xml2json';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Injectable({
  providedIn: 'root',
})
export class CustomerCommonfunctionsService {
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

  private isKyc = new BehaviorSubject<any>(false);
  isKycObserver = this.isKyc.asObservable();

  private iscustomer = new BehaviorSubject<any>(false);
  iscustomerObserver = this.iscustomer.asObservable();

  private redirecttohome = new BehaviorSubject<any>('');
  redirecttohomeObserver = this.redirecttohome.asObservable();

  private redirecttoCashDeposit = new BehaviorSubject<any>('');
  redirecttoCashDepositObserver = this.redirecttoCashDeposit.asObservable();

  constructor(private xml2jsonservice: NgxXml2jsonService) {}

  GetEventTarget(e): any {
    try {
      const target: any = e.target || e.srcElement || e.currentTarget || null;
      return target;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  moveUpSelection(_e, selectedIndex) {
    try {
      // console.log(target, selectedIndex);
      if (selectedIndex > 0) {
        selectedIndex--;
      }
      // this.selectedShare.next(selectedIndex);
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
              scrollLeft: 0,
            },
            10
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
              scrollLeft: 0,
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
      if (selectedIndex < $('.SelectorBox')[0].childElementCount - 1) {
        selectedIndex++;
      }
      // //console.log(this.selectedShare);
      // this.selectedShare.next(this.selectedShareIndex);
      // //console.log(this.selectedShare);
      if ($('.SelectorBox')[0].childElementCount > selectedIndex) {
        this.ScrollTo('.SelectorBox', '.HoverSuggestion', 'up');
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
        target.value = this.toFixed(this.sampleString, 2);
      } else {
        target.value = this.sampleString + '.00';
      }
      target.value = target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return notional;
  }
  // chitra added
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  // chitra added
  FormatNumberr(v) {
    try {
      // const target: any = this.GetEventTarget(e);
      // //console.log(target.id, $('#' + target.id)[0].value);
      if (v.toString().trim() === '') {
        v = '0.00';
        // const evt = new Event('change');
        // target.dispatchEvent(evt);
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
    var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
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

  contains(key) {
    try {
      const findNaN = key !== key;
      let indexOf: any;
      if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
      } else {
        indexOf = function (key) {
          let i = -1,
            index = -1;
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
    const xml = parser.parseFromString(
      xmlString.replace(/↵/g, '').replace(/\s\s+/g, ' '),
      'text/xml'
    );
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

  isNumber(evt) {
    evt = evt ? evt : window.event;
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (
      (charCode > 31 && (charCode < 48 || charCode > 57)) ||
      charCode === 72 ||
      charCode === 43 ||
      charCode === 8 ||
      charCode === 9 ||
      charCode === 107 ||
      charCode === 16
    ) {
      return false;
    }
    return true;
  }

  isContactNumber(evt) {
    evt = evt ? evt : window.event;
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (
      (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 43) ||
      charCode === 72 ||
      charCode === 43 ||
      charCode === 8 ||
      charCode === 9 ||
      charCode === 107 ||
      charCode === 16
    ) {
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
    return (
      (key >= 65 && key <= 90) ||
      (key >= 95 && key <= 122) ||
      key === 32 ||
      key === 72 ||
      key === 43 ||
      key === 8 ||
      key === 9 ||
      key === 107 ||
      key === 16
    );
  }
  isAlphaNumeric(evt) {
    evt = evt ? evt : window.event;
    const key = evt.which ? evt.which : evt.keyCode;
    return (
      (key >= 65 && key <= 90) ||
      (key >= 95 && key <= 122) ||
      key === 32 ||
      key === 72 ||
      key === 43 ||
      key === 8 ||
      key === 9 ||
      key === 107 ||
      key === 16 ||
      !(key > 31 && (key < 48 || key > 57))
    );
  }
  isvalidContactNo(evt) {
    evt = evt ? evt : window.event;
    // const key = (evt.which) ? evt.which : evt.key;
    console.log(evt.key);
    let phoneno = /^\+?([0-9])/;
    if (phoneno.test(evt.key)) {
      return true;
    } else {
      //console.log("error");
      return false;
    }
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

  removeComma(str) {
    return str.replace(/,/g, '');
  }

  SelectFullText(event) {
    const target: any = this.GetEventTarget(event);
    target.select();
  }

  camelize(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  // toTitleCase(str) {
  //   return str.replace(
  //     /\w\S*/g,
  //     function(txt) {
  //       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  //     }
  //   );
  // }
}
