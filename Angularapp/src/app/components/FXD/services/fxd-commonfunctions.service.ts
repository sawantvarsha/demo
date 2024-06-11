import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { FxdApifunctionService } from './fxd-apifunction.service';
import { DatePipe } from '@angular/common'; //Urmila A | 3-Feb-23 | LGTCLI-278
import { CustomerApiService } from 'src/app/services/customer-api.service';
// import { SanitizeHtmlPipePipe } from '../services/sanitize-html-pipe.pipe'; //added by UrmilaA | LGTGTWINT-2123 |14-June-23|

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Injectable({
  providedIn: 'root',
})
export class FxdCommonfunctionsService {
  count: number;
  dotcount: number;
  selectedShareIndex = 0;
  S = [];
  sampleString1: string;
  sampleString2: string;
  sampleArray = [];
  tempNumber: number;
  orderTime: any;
  hours1: any;
  ampm: any;
  min1: any;
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
  Days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

 
  // Added by Urmila A | for Invalid Session | 28-Nov-22 | start  
  sessionInvalid = new BehaviorSubject(false);
  sessionInvalidObserver = this.sessionInvalid.asObservable();
  // Added by Urmila A | for Invalid Session | 28-Nov-22 | end  
  
  // Added by Urmila A | for schedule pop-up visibility | 8-Dec-22 | start
  schedulePopupOpenClose = new BehaviorSubject(false);
  schedulePopupOpenCloseObserver = this.schedulePopupOpenClose.asObservable();
  // Added by Urmila A | for schedule pop-up visibility | 8-Dec-22 | end
  
  // Urmila A | 27-Dec-22 | start
  public NotificationContentFXD = new BehaviorSubject<any>('');
  NotificationContentObserverFXD = this.NotificationContentFXD.asObservable();
  //end



  //Added by UrmilaA | pop-up  | 7-July-23 | Start 
  loadFlag:boolean=false;
  saveTradeDone:boolean=false;
  fxdpopupOpenClose:boolean=false;
  RouteToDealerExecuted:boolean=false;
  LockedDealPopUp:boolean=false
  //added by UrmilaA | 9-Jan-24 | code sync with 5star
  orderBookingDone:boolean=false; 
  emailQuoteDone:boolean=false;
  // public RouteToDealerExe = new BehaviorSubject(false);
  // public RouteToDealerExecutedObs = this.RouteToDealerExe.asObservable();
  //Added by UrmilaA |  pop-up | 7-July-23 | ends 


  constructor(
    public AuthorAPI: AuthService,
    public FXD_afs: FxdApifunctionService,
    public HomeAPI: HomeApiService,
    private datepipe: DatePipe, //Urmila A | 3-Feb-23 | LGTCLI-278
    public CustAPI: CustomerApiService,
    // public sanitize :SanitizeHtmlPipePipe //added by UrmilaA | LGTGTWINT-2123 |14-June-23|
  ) {
    this.count = 0;
    this.dotcount = 0;
  }

  format(num: any, DecimalPointshift: number) {
    if (num.toString().match(/([kK]{1})/g) != null) {
      // // //console.log('K');
      num = (parseFloat(num.replace(/[kK]/g, '')) * 1000).toFixed(
        DecimalPointshift
      );
    } else if (num.toString().match(/([lL]{1})/g) != null) {
      // // //console.log('L');
      num = (parseFloat(num.replace(/[lL]/g, '')) * 100000).toFixed(
        DecimalPointshift
      );
    } else if (num.toString().match(/([mM]{1})/g) != null) {
      // // //console.log('M');
      num = (parseFloat(num.replace(/[mM]/g, '')) * 1000000).toFixed(
        DecimalPointshift
      );
    } else if (num.toString().match(/([bB]{1})/g) != null) {
      // // //console.log('B');
      num = (parseFloat(num.replace(/[bB]/g, '')) * 1000000000).toFixed(
        DecimalPointshift
      );
    }
    let not = num;
    if (not.toString().trim() === '') {
      not = '0';
      const evt = new Event('change');
      not.dispatchEvent(evt);
    } else {

      // Added by Urmila A | 17-Feb-23 | LGTGTWINT-1440
      if(DecimalPointshift > 0){
        not = this.numberWithCommas(not.toFixed(2))
      }else{
        not = this.numberWithCommas(not)
      }//end
     
      // Below code commented by Urmila A, as it weren't working for input with decimal points | 17-feb-23
      // if (DecimalPointshift > 0 ) { 
      //   not = not.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.00';
      // } else {
      //   not = not.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      // }
    }
    return not;
  }
  GetEventTarget(e): any {
    const target: any = e.target || e.srcElement || e.currentTarget || null;
    return target;
  }

  contains(key) {
    const findNaN = key !== key;
    let indexOf: any;
    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
      indexOf = Array.prototype.indexOf;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      indexOf = function (key) {
        // eslint-disable-next-line one-var
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
  }
  NotionalValidate(e) {
    const target: any = this.GetEventTarget(e);
    e = e ? e : window.event;
    const code = e.which ? e.which : e.keyCode;
    const value = target.value.toString();
    // console.log(value);

    if(target.value.includes('.')){ //Urmila A | 15-Feb-23 | start
      if(target.value.indexOf('.') === 0){
        target.value ='0.00';
      }
    } //end
   
    //Added by urmilaA | F5SAAINT-587 | start | code sync with 5Star | 10-Jan-24
    if(target.value.charAt(0).toLowerCase() == 'm' || target.value.charAt(0).toLowerCase() =='b' || 
    target.value.charAt(0).toLowerCase() =='k' || target.value.charAt(0).toLowerCase() == 't' || 
    target.value.charAt(0).toLowerCase() =='h' || target.value.charAt(0).toLowerCase() == 'n' || target.value.indexOf('NaN') == 0){
      target.value ='0.00';
    }
    //Added by urmilaA | F5SAAINT-587 | ends | code sync with 5Star | 10-Jan-24
   

    let codes = new Array();
    // Checking for number inputs, k, m, b, ., del or backspace
    // removed 101 by Urmila A | 31-Jan-23 | LGTGTWINT-790
    codes = [
      8, 9, 13, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 66, 75, 76, 77, 69,
      98,  107, 108, 109, 127,
    ];
    if (!this.contains.call(codes, code)) {
      return false;
    }
    if (code === 46) {
      this.sampleString2 = target.value;
      if (this.sampleString2.includes('.')) {
        return false;
      } else {
        return true;
      }

      // if (this.count > 1) {
      //   return false;
      // } else {
      //   return true;
      // }
    }

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
    if (value > 10000000000000) {
      return false;
    }

    return true;
  }
  NotionalChange(e,ccy) {
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
        );
      } else if (target.value.toString().match(/([mM]{1})/g) != null) {
        // //console.log('M');
        // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '000000')).toFixed(2);
        target.value = (
          parseFloat(target.value.replace(/[mM]/g, '')) * 1000000
        );
      } else if (target.value.toString().match(/([bB]{1})/g) != null) {
        // //console.log('B');
        // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[bB]/g, '000000000')).toFixed(2);
        target.value = (
          parseFloat(target.value.replace(/[bB]/g, '')) * 1000000000
        );
      }
    }
    target.value = Number(target.value).toFixed(ccy === 'JPY' ?  0 : 2);  //added by Urmila A | 5-June-23 | LGTGTWINT-2062 // added by UrmilaA | F5SAAINT-660 | 29-Nov-23
    return target.value;
  }

  NotionalChangewithDecimalFixes(InputNumber: any, DecimalFixes: number) {
    var formattedString: any;
    try {
      if (InputNumber === '') {
      } else {
        if (InputNumber.toString().match(/([kK]{1})/g) != null) {
          // //console.log('K');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[kK]/g, '000')).toFixed(2);
          InputNumber = (
            parseFloat(InputNumber.replace(/[kK]/g, '')) * 1000
          ).toFixed(DecimalFixes);
        } else if (InputNumber.toString().match(/([lL]{1})/g) != null) {
          // //console.log('L');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '00000')).toFixed(2);
          InputNumber = (
            parseFloat(InputNumber.replace(/[lL]/g, '')) * 100000
          ).toFixed(DecimalFixes);
        } else if (InputNumber.toString().match(/([mM]{1})/g) != null) {
          // //console.log('M');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '000000')).toFixed(2);
          InputNumber = (
            parseFloat(InputNumber.replace(/[mM]/g, '')) * 1000000
          ).toFixed(DecimalFixes);
        } else if (InputNumber.toString().match(/([bB]{1})/g) != null) {
          // //console.log('B');
          // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[bB]/g, '000000000')).toFixed(2);
          InputNumber = (
            parseFloat(InputNumber.replace(/[bB]/g, '')) * 1000000000
          ).toFixed(DecimalFixes);
        }
       //commented by Urmila A | it is resulting wrong formatting | F5SAAINT-660 | 10-Jan-24
        // formattedString = parseFloat(InputNumber.replace(/,/g, ''))
        //   .toFixed(DecimalFixes)
        //   .toString()
        //   .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // }
        formattedString = this.numberWithCommas(parseFloat(InputNumber.replace(/,/g, '')).toFixed(DecimalFixes));  //added by Urmila A | for correct number formatting | F5SAAINT-660 | 10-Jan-24
      }
    } catch (Ex) {}
    return formattedString;
  }
  AllocationAmount(e) {
    const target: any = this.GetEventTarget(e);
    if (
      $('#' + target.id)[0]
        .value.toString()
        .match(/([kK]{1})/g) != null
    ) {
      // //console.log('K');
      // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[kK]/g, '000')).toFixed(2);
      $('#' + target.id)[0].value =
        parseFloat($('#' + target.id)[0].value.replace(/[kK]/g, '')) * 1000;
    } else if (
      $('#' + target.id)[0]
        .value.toString()
        .match(/([lL]{1})/g) != null
    ) {
      // //console.log('L');
      // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '00000')).toFixed(2);
      $('#' + target.id)[0].value =
        parseFloat($('#' + target.id)[0].value.replace(/[lL]/g, '')) * 100000;
    } else if (
      $('#' + target.id)[0]
        .value.toString()
        .match(/([mM]{1})/g) != null
    ) {
      // //console.log('M');
      // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '000000')).toFixed(2);
      $('#' + target.id)[0].value =
        parseFloat($('#' + target.id)[0].value.replace(/[mM]/g, '')) * 1000000;
    } else if (
      $('#' + target.id)[0]
        .value.toString()
        .match(/([bB]{1})/g) != null
    ) {
      // //console.log('B');
      // $('#' + target.id)[0].value = parseFloat($('#' + target.id)[0].value.replace(/[bB]/g, '000000000')).toFixed(2);
      $('#' + target.id)[0].value =
        parseFloat($('#' + target.id)[0].value.replace(/[bB]/g, '')) *
        1000000000;
    }
    // //console.log('amt' , $('#' + target.id)[0].value);
    // this.selectedAccountsNotional.next($('#' + target.id)[0].value);
    // this.selectedAllocationNotional.next($('#' + target.id)[0].value);
  }
  FormatNumber(e) {
    const target: any = this.GetEventTarget(e);
    //below code commented by UrmilaA | F5SAAINT-660 | 29-Nov-23 | code sync with 5Star | 10-Jan-23 | start
    // // //console.log(target.id, $('#' + target.id)[0].value);
    // const notional = target.value;
    // if (target.value.trim() === '') {
    //   target.value = '0.00';
    //   const evt = new Event('change');
    //   target.dispatchEvent(evt);
    //   // console.log('Zero');
    // } else {
    //   this.sampleString1 = target.value;
    //   // console.log('in else');
    //   if (this.sampleString1.includes('.')) {
    //     // console.log('Contain dot');
    //     if (this.sampleString1.indexOf('.') === 0) {
    //       target.value = '0' + this.sampleString1;
    //     }
    //   //  target.value = this.toFixed(this.sampleString1, 2); // commented by UrmilaA | F5SAAINT-660 | 29-Nov-23
    //     // target.value = parseFloat(this.sampleString1).toFixed(2);
    //   } else {
    //     // console.log('Does not contain dot');
    //     target.value = this.sampleString1 + '.00';
    //   } 
      target.value = target.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // } //code sync with 5Star | 10-Jan-23 | ends
    // //console.log(notional);
    return target.value;
    
    //code sync with 5Star | 10-Jan-23 | ends
  }
  formatNumberwithEvengtKetan(e, DecimalPlaces: number) {
    // var valueString = "1500"; //can be 1500.0 or 1500.00
    try {
      const target: any = this.GetEventTarget(e);
      const InputNumber = target.value;

      if (InputNumber.includes(',')) {
        var amount = parseFloat(InputNumber.replace(/,/g, '')).toFixed(
          DecimalPlaces
        );
      } else {
        var amount = parseFloat(InputNumber).toFixed(DecimalPlaces);
      }
      var formattedString = amount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      target.value = formattedString;
    } catch (Ex) {}
  }
  formatNumberKetan(InputNumber: any, DecimalPlaces: number) {
    // var valueString = "1500"; //can be 1500.0 or 1500.00
    try {
      if (InputNumber.includes(',')) {
        var amount = parseFloat(InputNumber.replace(/,/g, '')).toFixed(
          DecimalPlaces
        );
      } else {
        var amount = parseFloat(InputNumber).toFixed(DecimalPlaces);
      }
      var formattedString = amount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return formattedString;
    } catch (Ex) {}
  }
  toFixed(num, fixed) {
    const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
  }
  FormatNumberwithoutevent(amount: any) {
    // //console.log(target.id, $('#' + target.id)[0].value);
    // const notional =amount;
    if (amount.trim() === '') {
      amount = '0.00';
    } else {
      amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    // //console.log(notional);
    return amount;
  }

  InputNunbersOnly(e) {
    const target: any = this.GetEventTarget(e);
    e = e ? e : window.event;
    const code = e.which ? e.which : e.keyCode;

    
    if(target.value.includes('.')){ //Urmila A | 15-Feb-23 | start
      if(target.value.indexOf('.') === 0){
        target.value ='0.'; // F5SAAINT-659 | code sync with 5Star | 10-Jan-24
      }
    } //end


    //Added by urmilaA | F5SAAINT-587 | start  | code sync with 5Star | 10-Jan-24
    if(target.value.charAt(0).toLowerCase() == 'm' || target.value.charAt(0).toLowerCase() =='b' || 
    target.value.charAt(0).toLowerCase() =='k' || target.value.charAt(0).toLowerCase() == 't' || 
    target.value.charAt(0).toLowerCase() =='h' || target.value.charAt(0).toLowerCase() == 'n' || target.value.indexOf('NaN') == 0){
      target.value ='0.00';
    }
    //Added by urmilaA | F5SAAINT-587 | ends  | code sync with 5Star | 10-Jan-24

    
    
    
    // var iKeyCode = (evt.which) ? evt.which : evt.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      // console.log('return false');
      if (code === 46) {
        this.sampleString2 = target.value;
        if (this.sampleString2.includes('.')) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    }
    // console.log('return true');
    return true;
  }
  InputNunbersOnlyWithoutDec(e) {
    const target: any = this.GetEventTarget(e); //Urmila A | 5-June-23 | LGTGTWINT-2059
    e = e ? e : window.event;
    const code = e.which ? e.which : e.keyCode;

    if(target.value.includes('0')){ //Urmila A | 5-June-23 | LGTGTWINT-2059
      if(target.value.indexOf('0') === 0){
        target.value ='';
      }
    } //end

    // var iKeyCode = (evt.which) ? evt.which : evt.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      // console.log('return false');
      return false;
    }

    // console.log('return true');
    return true;
  }
  validateSpreadRate(e) {
    const target: any = this.GetEventTarget(e);

    e = e ? e : window.event;
    if (target.value.includes('.')) {
      console.log('Decimal detected');
      target.value = parseFloat(target.value).toFixed(2);
    }
  }
  InputNunbersOnlyWithoutDecforSpread(e) {
    const target: any = this.GetEventTarget(e);

    e = e ? e : window.event;
    const code = e.which ? e.which : e.keyCode;

    if (Number(target.value) > 100000 || Number(target.value) < 0) {
      return false;
    }
    if (code === 46) {
      // this.sampleString2 = target.value;
      if (target.value.includes('.')) {
        return false;
      } else {
        return true;
      }
    }
    // var iKeyCode = (evt.which) ? evt.which : evt.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      // console.log('return false');
      return false;
    }
    return true;
  }
  InputNunbersOnlyWithoutDecforRate(e) {
    const target: any = this.GetEventTarget(e);

    e = e ? e : window.event;
    const code = e.which ? e.which : e.keyCode;
    if (Number(target.value) > 500 || Number(target.value) < 0) {
      return false;
    }
    // var iKeyCode = (evt.which) ? evt.which : evt.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      return false;
    }
    return true;
  }

  UnformatNumber(e) {
    const target: any = this.GetEventTarget(e);
    // //console.log(target.id, $('#' + target.id)[0].value);
    target.value = target.value.replace(/,/g, '');
    if (target.value === '0.00') {
      target.value = '';
    }
  }

  InputNumber(e) {
    const target: any = this.GetEventTarget(e);
    const regex = /^(\d)*(\.)?([0-9]+)?$/g;
    e = e ? e : window.event;
    // const code = e.which ? e.which : e.keyCode;
    // let codes = new Array();

    // codes = [
    //   8, 9, 13, 17, 18, 19, 20, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
    // ];
    if ((target.value + e.key).match(regex)) {
      // if (!this.contains.call(codes, code)) {
      //   return false;
      // }
      return true;
    } else {
      return false;
    }
  }

  isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }
  // moveUpSelection(e) {
  //   const target: any = this.GetEventTarget(e);
  //   if (this.selectedShareIndex > 0) {
  //     this.selectedShareIndex--;
  //   }
  //   // this.selectedShare.next(this.selectedShareIndex);
  //   this.ScrollTo('.SelectorBox', '.HoverSuggestion', 'down');
  // }

  // moveDownSelection(e) {

  //   const target: any = this.GetEventTarget(e);
  //   if (this.selectedShareIndex < $('.SelectorBox')[0].childElementCount - 1) {
  //     this.selectedShareIndex++;
  //   }
  //   // this.selectedShare.next(this.selectedShareIndex);
  //   if ($('.SelectorBox')[0].childElementCount > this.selectedShareIndex) {
  //     this.ScrollTo('.SelectorBox', '.HoverSuggestion', 'up');
  //   }
  // }
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
  ScrollTo(container, element, direction) {
    const $container = $(container);
    const $scrollTo = $(element);
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
        // eslint-disable-next-line max-len
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
  }

  AddpipestoNumber(pipes: number, Rate: string) {
    // console.log(pipes, Rate);
    const amount = Rate;
    this.S = amount.split('.');
    this.S[1] = this.S[1].substring(0, 4);
    const length = this.S[1].length;
    // console.log(length);
    // console.log(this.S[0], this.S[1]);
    // this.S = null;
    const temp = this.S[0] + '' + this.S[1];
    // eslint-disable-next-line radix
    this.tempNumber = parseInt(temp);
    // console.log(this.tempNumber);
    // console.log(this.tempNumber + pipes);

    const sum = Number(this.tempNumber) + Number(pipes);
    // console.log(sum);
    // this.S = tempstring.split('.');
    const result = sum / Math.pow(10, length);
    // console.log(result);
    return result;
  }
  StrikeValidation(e) {
    try {
      const target = this.GetEventTarget(e);
      if (target.value) {
        target.value = parseFloat(target.value).toFixed(4);
      }
    } catch (Ex) {}
  }
  UpfrontValidation(e) {
    try {
      const target = this.GetEventTarget(e);
      if (target.value) {
        target.value = parseFloat(target.value).toFixed(6);
      } else if (target.value === '') {
        target.value = '0.000000';
      }
    } catch (Ex) {
      console.log(Ex);
    }
  }
  TwoDigitValidation(e) {
    try {
      const target = this.GetEventTarget(e);
      if (target.value) {
        target.value = parseFloat(target.value).toFixed(6);
      }
    } catch (Ex) {
      console.log(Ex);
    }
  }
  fnFormatNumber(value, decimalPlaces) {
    try {
      return parseFloat(value).toFixed(decimalPlaces);
    } catch (Ex) {}
  }

  TenorValidation(e) {
    try {
      e = e ? e : window.Event;
      const code = e.which ? e.which : e.keyCode;
      let codes = new Array();
      codes = [
        8, 9, 13, 17, 18, 19, 20, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
      ];
      if (!this.contains.call(codes, code)) {
        return false;
      }
      return true;
    } catch (error) {}
  }

  fnGetPointShiftFromCcy(_CcyPair: string) {
    // calculate point shift here
    var pointShift = 4;
    return pointShift;
  }

  fnValidations(ProductName: string): string {
    // I was here
    switch (ProductName) {
      case 'Vanilla':
        break;
      case '':
        break;
      case '':
        break;
      case '':
        break;
      default:
        break;
    }
    return '';
  }

  // public cancelPendingRequests() {
  //   this.pendingHTTPRequests$.next();
  // }

  // public onCancelPendingRequests() {
  //   return this.pendingHTTPRequests$.asObservable();
  // }

  fnGetStrikeRate(
    OptionType: string,
    OrderDirection: string,
    AskSpot: string,
    BidSpot: string,
    StrikePoint: string,
    CcyPair: string
  ): string {
    // Strike Calculation
    if (
      (OptionType === 'Call' && OrderDirection === 'Buy') ||
      (OptionType === 'Put' && OrderDirection === 'Sell')
    ) {
      return (Number(AskSpot) + Number(StrikePoint) / 100)
        .toFixed(this.fnGetPointShiftFromCcy(CcyPair))
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return (Number(BidSpot) - Number(StrikePoint) / 100)
        .toFixed(this.fnGetPointShiftFromCcy(CcyPair))
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    }
  }

  fnGetPriceProviderLPs(modelClassObj) {
    try {
      console.log("pp details ", modelClassObj);
      
      this.FXD_afs.GetPriceProviderDetails(
        this.FXD_afs.EntityID,
        modelClassObj.Product_ID,
        modelClassObj.Mode,
        modelClassObj.UserGroup,
        modelClassObj.UserID,
        modelClassObj.PricingMode,
     //Core migration: API req parameters are modified | Urmila A | 22-Aug-23
      ).subscribe((res) => {
        if (res) {
          modelClassObj.LPList = [];
          res.GetFXDPriceProviderDetailsResult.PriceProviderDetails.forEach((element) => {
            modelClassObj.LPList.push(element);
            modelClassObj.PriceProviderString === ''
              ? (modelClassObj.PriceProviderString = '' + element.PP_Code)
              : (modelClassObj.PriceProviderString =
                  modelClassObj.PriceProviderString + ':' + element.PP_Code);
          });
          this.fnChangeAppMode(modelClassObj);
        }
      });
    } catch (Ex) {
      console.log(Ex);
    }
  }

  fnChangeAppMode(modelClassObj) {
    try {
      if (modelClassObj.PricingMode.toUpperCase() === 'AUTO') {
        modelClassObj.LPList.unshift({
          PP_Code: 'Best Price',
          PP_CustomerId: '',
          PP_ExternalCode: '',
          PP_Id: '',
          PP_Name: 'Best Price',
          PP_Round_Strike_Diff: '',
          PP_TwoStepOrderExecutionYN: '',
          PP_Type: '',
        });
      } else {
        modelClassObj.LPList.shift();
      }
      modelClassObj.SelectedLPForPrice = modelClassObj.LPList[0].PP_Name;
      modelClassObj.ClearPricingFlag = false;
      this.ResetAllFields(modelClassObj);
    } catch (Ex) {
      console.log(Ex);
    }
  }

  fnGetPriceProviderandCcypairs(modelClassObj) {
    try {
      this.fnGetPriceProviderLPs(modelClassObj);
      this.FXD_afs.fnGetFXDCurrencyPairs( //Core migration: API req params modified by Urmila A | 24-Aug-23
        '3',
        modelClassObj.Product_ID,
        modelClassObj.Product_Name,
        modelClassObj.Mode,    
        '',
        '',
        '',  //Added by Urmila A | 11-Jan-23
        modelClassObj.OptionCut
      ).subscribe((res) => {
        if (res.Get_Ccy_PairsResult.Pair_Tradable_Details) {
          res = res.Get_Ccy_PairsResult.Pair_Tradable_Details;
          res.forEach((element, index) => {
            modelClassObj.CCYOptions.push(element);
            if (modelClassObj.CCYOptions[index].Asset_Pair === 'EUR - USD') {
              modelClassObj.CurrencyPair =
                modelClassObj.CCYOptions[index].Asset_Pair;
              modelClassObj.DepCcy = modelClassObj.CurrencyPair.slice(0, 3);
              modelClassObj.AltCcy = modelClassObj.CurrencyPair.slice(6, 9);

              modelClassObj.NotionalCCY = modelClassObj.DepCcy;
              modelClassObj.IBPremCCY = modelClassObj.DepCcy;

              this.fnGetBidAskRates(modelClassObj);
              this.fnGetDatesCalculationforVB(modelClassObj);
              this.fnGetOptionCutFXD(modelClassObj);
              this.fnGetTenor(modelClassObj);

              modelClassObj.Asset1_DecimalAmount = element.Asset1_DecimalAmount;
              modelClassObj.Asset2_DecimalAmount = element.Asset2_DecimalAmount;
            }
          });
          this.sort_by_key(modelClassObj.CCYOptions, 'Asset_Pair');
        }
      });
    } catch (Ex) {
      console.log(Ex);
    }
  }

  fnGetBidAskRates(modelClassObj) {
    try {
      this.FXD_afs.GetBidAskVB(    //API req params modified by Urmila A | 21-Aug-23 | Core migration
        modelClassObj.Product_Code,
        modelClassObj.CurrencyPair,
        this.fngetMode(), //RizwanS || added userid || 30 Aug 2023
        this.FXD_afs.UserName,
      ).subscribe((res) => {
        if (res) {
          modelClassObj.BidRate = parseFloat(
            res.BidRate
          )
            .toFixed(Number(res.PointShift))
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');

          modelClassObj.AskRate = parseFloat(
            res.Get_FinIQ_BidAsk_WrapperResult.AskRate
          )
            .toFixed(Number(res.PointShift))
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');

          modelClassObj.NotionalPointShift = Number(
            res.DecimalRate
          );
          modelClassObj.StrikePointShift = Number(
            res.PointShift
          );

          modelClassObj.PipsMultiplier = Number(
            res.PipsMultiplier
          );

          this.GetStrikeRate(modelClassObj);
          this.fnEnablePrembtn(modelClassObj);
        }
      });
    } catch (Ex) {
      console.log(Ex);
    }
  }
  fnGetBidAskRatesFlipped(modelClassObj) {
    try {
      this.FXD_afs.GetBidAskVB(  //API req params modified by Urmila A | 21-Aug-23 | Core migration
        modelClassObj.Product_Code,
        modelClassObj.AltCcy + ' - ' + modelClassObj.DepCcy,
        this.fngetMode(),
        this.FXD_afs.UserName, //RizwanS || added userid || 30 Aug 2023
      ).subscribe((res) => {
        if (res) {
          modelClassObj.NotionalPointShift = Number(res.DecimalRate);
          modelClassObj.StrikePointShift = Number(res.PointShift);
        }
      });
    } catch (Ex) {
      console.log(Ex);
    }
  }
  fnGetDatesCalculationforVB(modelClassObj) {
    try {
      this.FXD_afs.GetDatesCalculationforVB(
        '3',
        modelClassObj.Product_ID,
        modelClassObj.Product_Code,
        modelClassObj.DepCcy,
        modelClassObj.AltCcy,
        modelClassObj.FixingSettFreq.split('/')[0],
        modelClassObj.FixingSettFreq.split('/')[1],
        // '' + modelClassObj.TenorDays,
        modelClassObj.Tenor,
        modelClassObj.OptionCut,
        modelClassObj.TradeDate,
        // modelClassObj.TenorDays,
        '',
        '','' //Core migration: API req parameters modified by Urmila A | 22-Aug-23
      ).subscribe((res) => {
        if (res) {
          res = res.CalculateDatesResult.Dates;
          modelClassObj.PremiumDate = res[0].ValueDate;
          modelClassObj.FixingDate = res[0].FixingDate;
          modelClassObj.MaturityDate = res[0].MaturityDate;
          modelClassObj.TenorDays = res[0].ExpiryDays;
          this.fnEnablePrembtn(modelClassObj);
        }
      });
    } catch (Ex) {}
  }
  fnGetOptionCutFXD(modelClassObj) {
    try {
      this.FXD_afs.fnGetOptionCutFXD(
        '3',
        modelClassObj.Product_ID,
        modelClassObj.Product_Code,
        modelClassObj.Mode,
        modelClassObj.CurrencyPair,
        this.HomeAPI.CustomerId,
        this.FXD_afs.UserName
      ).subscribe((res) => {
        if (res.Get_OptionCutResult.D_OptionCut.length > 0) {
          res.Get_OptionCutResult.D_OptionCut.forEach((element) => {
            if (element) {
              modelClassObj.OptionCutOptions.push(element.OptionCut);
            }
          });
        }
      });
    } catch (Ex) {
      console.log(Ex);
    }
  }

  fnGetTenor(modelClassObj) {
    try {
      this.FXD_afs.fnGetTenor(
        '3',
        modelClassObj.Product_ID,
        modelClassObj.Product_Code,
        modelClassObj.Mode,
        'T',
        this.FXD_afs.UserName
      ).subscribe((res) => {
        if (res.Get_Entity_Member_Map_DataResult.Entity_MemberData.length > 0) {
          res.Get_Entity_Member_Map_DataResult.Entity_MemberData.forEach((element) => {
            if (element) {
              modelClassObj.TenorOptions.push(element.Member_ID);
            }
          });
        }
      });
    } catch (Ex) {
      console.log(Ex);
    }
  }

  fnTenorChanged(modelClassObj) {
    try {
      // modelClassObj.ResetAllFields();
      modelClassObj.disabledPrembtn = true;

      modelClassObj.TenorDays = '';
      modelClassObj.MaturityDate = '';
      modelClassObj.FixingDate = '';
      modelClassObj.PremiumDate = '';
      
      this.fnGetDatesCalculationforVB(modelClassObj);
    } catch (Ex) {
      console.log(Ex);
    }
  }

  setCCY(modelClassObj) {
    this.ResetAllFields(modelClassObj);
    modelClassObj.DepCcy = modelClassObj.CurrencyPair.slice(0, 3);
    modelClassObj.AltCcy = modelClassObj.CurrencyPair.slice(6, 9);
    modelClassObj.NotionalCCY = modelClassObj.DepCcy;
    modelClassObj.IBPremCCY = modelClassObj.DepCcy;

    modelClassObj.AskRate = '';
    modelClassObj.BidRate = '';

    this.fnGetBidAskRates(modelClassObj);
    this.fnIsMetalInCcy(modelClassObj);
    this.fnChangeNotionalCCY(modelClassObj);
    this.fnGetDatesCalculationforVB(modelClassObj);

    try {
      modelClassObj.CappedLossCcyOptions = [];
      modelClassObj.CappedLossCcyOptions.push(modelClassObj.DepCcy);
      modelClassObj.CappedLossCcyOptions.push(modelClassObj.AltCcy);
    } catch (ex) {
      console.log('Prem product found');
    }
  }

  ChangeinNotionalPerfixing(modelClassObj) {
    modelClassObj.Notional = this.format(
      Number(modelClassObj.NotionalPerFixing.replace(/,/g, '')) *
        Number(modelClassObj.NoOfSett),
      2
    );
  }

  GetStrikeRate(modelClassObj) {
    try {
      if (modelClassObj.OptionType === 'Call') {
        // if (this.OptionType === 'Call') {
        if (modelClassObj.OrderDirection === 'Buy') {
          if (
            Number(modelClassObj.AskRate) > 100 &&
            Number(modelClassObj.BidRate) > 100
          ) {
            modelClassObj.Strike = (
              Number(modelClassObj.AskRate) +
              Number(modelClassObj.StrikePoint) / 100
            ).toFixed(2);
          } else {
            modelClassObj.Strike = (
              Number(modelClassObj.AskRate) +
              Number(modelClassObj.StrikePoint) / 10000
            ).toFixed(4);
          }
        } else {
          if (
            Number(modelClassObj.AskRate) > 100 &&
            Number(modelClassObj.BidRate) > 100
          ) {
            modelClassObj.Strike = (
              Number(modelClassObj.BidRate) +
              Number(modelClassObj.StrikePoint) / 100
            ).toFixed(2);
          } else {
            modelClassObj.Strike = (
              Number(modelClassObj.BidRate) +
              Number(modelClassObj.StrikePoint) / 10000
            ).toFixed(4);
          }
        }
      } else {
        if (modelClassObj.OrderDirection === 'Sell') {
          if (
            Number(modelClassObj.AskRate) > 100 &&
            Number(modelClassObj.BidRate) > 100
          ) {
            modelClassObj.Strike = (
              Number(modelClassObj.AskRate) -
              Number(modelClassObj.StrikePoint) / 100
            ).toFixed(2);
          } else {
            modelClassObj.Strike = (
              Number(modelClassObj.AskRate) -
              Number(modelClassObj.StrikePoint) / 10000
            ).toFixed(4);
          }
        } else {
          if (
            Number(modelClassObj.AskRate) > 100 &&
            Number(modelClassObj.BidRate) > 100
          ) {
            modelClassObj.Strike = (
              Number(modelClassObj.BidRate) -
              Number(modelClassObj.StrikePoint) / 100
            ).toFixed(2);
          } else {
            modelClassObj.Strike = (
              Number(modelClassObj.BidRate) -
              Number(modelClassObj.StrikePoint) / 10000
            ).toFixed(4);
          }
        }
      }
    } catch (Ex) {
      console.log(Ex);
    }
  }

  ChangedCCY(modelClassObj) {
    // this.ResetAllFields();
    try {
      modelClassObj.disabledPrembtn = true;

      modelClassObj.DepCcy = modelClassObj.CurrencyPair.slice(0, 3);
      modelClassObj.AltCcy = modelClassObj.CurrencyPair.slice(6, 9);

      modelClassObj.NotionalCCY = modelClassObj.DepCcy;
      modelClassObj.IBPremCCY = modelClassObj.DepCcy;

      modelClassObj.AskRate = '';
      modelClassObj.BidRate = '';

      this.fnGetBidAskRates(modelClassObj);
      this.fnGetDatesCalculationforVB(modelClassObj);
    } catch (Ex) {}
  }

  StrikePointChanged(modelClassObj) {
    try {
      modelClassObj.OrderDirection === 'Buy'
        ? (modelClassObj.Strike = modelClassObj.BidRate)
        : (modelClassObj.Strike = modelClassObj.AskRate);
      modelClassObj.Strike =
        '' +
        this.AddpipestoNumber(modelClassObj.StrikePoint, modelClassObj.Strike);
    } catch (Ex) {
      console.log(Ex);
    }
  }

  UpfrontChanged(modelClassObj) {
    if (
      parseFloat(modelClassObj.upfront) > 1 ||
      parseFloat(modelClassObj.upfront) < 0.01
    ) {
      return 'Upfront should be between 0.01% to 1%';
    } else {
      return '';
    }
  }

  OrderDirectionChanged(modelClassObj) {
    try {
      this.ResetAllFields(modelClassObj);
      if (modelClassObj.OrderDirection === 'Buy') {
        modelClassObj.Strike = modelClassObj.BidRate;
      } else {
        modelClassObj.Strike = modelClassObj.AskRate;
      }
    } catch (Ex) {
      console.log(Ex);
    }
  }

  fnCalcUpfrontAndIbPrem(modelClassObj) {
    try {
      var UpfrontInCcy = 0;

      if (
        modelClassObj.IBPremCCY === modelClassObj.DepCcy &&
        modelClassObj.NotionalCCY === modelClassObj.AltCcy
      ) {
        UpfrontInCcy =
          (Number(modelClassObj.Notional.toString().replace(/,/g, '')) /
            parseFloat(modelClassObj.Strike)) *
          (parseFloat(modelClassObj.UpfrontPer) / 100);
      } else if (modelClassObj.IBPremCCY !== modelClassObj.NotionalCCY) {
        UpfrontInCcy =
          Number(modelClassObj.Notional.toString().replace(/,/g, '')) *
          parseFloat(modelClassObj.Strike) *
          (parseFloat(modelClassObj.UpfrontPer) / 100);
      } else {
        UpfrontInCcy =
          Number(modelClassObj.Notional.toString().replace(/,/g, '')) *
          (parseFloat(modelClassObj.UpfrontPer) / 100);
      }

      if (modelClassObj.OrderDirection.toUpperCase() === 'BUY') {
        //data.ClientPremium = ((Math.abs(Number(this.unformatNumber(data.nominal)) * (Number(data.price) + Number(data.upfront)))) / 100).toString();
        modelClassObj.ClientPremium = (
          parseFloat(modelClassObj.IBPremium) +
          Number(modelClassObj.Notional.replace(/,/g, '')) *
            (parseFloat(modelClassObj.UpfrontPer) / 100)
        ).toString();

        modelClassObj.ClientPremium = (
          parseFloat(this.fnGetIBPrem(modelClassObj)) + UpfrontInCcy
        )
          .toFixed(
            modelClassObj.IBPremCCY === modelClassObj.secondCCY
              ? modelClassObj.Asset2_DecimalAmount
              : modelClassObj.Asset1_DecimalAmount
          )
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        //data.ClientPremium = ((Math.abs(Number(this.unformatNumber(data.nominal)) * (Number(data.price) - Number(data.upfront)))) / 100).toString();
        modelClassObj.ClientPremium = (
          parseFloat(modelClassObj.IBPremium) -
          Number(modelClassObj.Notional.replace(/,/g, '')) *
            (parseFloat(modelClassObj.UpfrontPer) / 100)
        ).toString();
      }
    } catch (Ex) {
      console.log(Ex);
    }
  }

  fnGetIBPrem(modelClassObj) {
    return modelClassObj.IBPremium.replace(/,/g, '');
  }

  GeneratePipes(modelClassObj, SpotRate) {
    try {
      if (modelClassObj.CurrencyPair === 'USD - JPY') {
        return Math.round(
          Number(modelClassObj.Strike) * 100 - Number(SpotRate) * 100
        );
      } else {
        return Math.round(
          Number(modelClassObj.Strike) * 10000 - Number(SpotRate) * 10000
        );
      }
    } catch (Ex) {
      console.log(Ex);
    }
  }

  StrikeChanged(modelClassObj) {
    if (
      Number(modelClassObj.AskRate) >= 100 &&
      Number(modelClassObj.BidRate) >= 100
    ) {
      modelClassObj.Strike = Number(modelClassObj.Strike).toFixed(2);
    } else {
      modelClassObj.Strike = Number(modelClassObj.Strike).toFixed(4);
    }
    if (modelClassObj.OrderDirection === 'Buy') {
      if (modelClassObj.OptionType === 'Call') {
        modelClassObj.StrikePoint = this.GeneratePipes(
          modelClassObj,
          modelClassObj.AskRate
        );
      } else {
        modelClassObj.StrikePoint = this.GeneratePipes(
          modelClassObj,
          modelClassObj.BidRate
        );
      }
    } else {
      if (modelClassObj.OptionType === 'Call') {
        modelClassObj.StrikePoint = this.GeneratePipes(
          modelClassObj,
          modelClassObj.BidRate
        );
      } else {
        modelClassObj.StrikePoint = this.GeneratePipes(
          modelClassObj,
          modelClassObj.AskRate
        );
      }
    }

   
  }

  fnEnablePrembtn(modelClassObj) {
    if (
      Number(modelClassObj.BidRate) > 0 &&
      Number(modelClassObj.AskRate) > 0 &&
      modelClassObj.CurrencyPair !== '' &&
      modelClassObj.DepCcy !== '' &&
      modelClassObj.AltCcy !== '' &&
      Number(modelClassObj.Strike > 0) &&
      modelClassObj.TenorDays !== '' &&
      Number(modelClassObj.Notional.replace(/,/g, '')) > 0 &&
      modelClassObj.TradeDate !== '' &&
      modelClassObj.PremiumDate !== '' &&
      modelClassObj.FixingDate !== '' &&
      modelClassObj.MaturityDate !== ''
    ) {
      modelClassObj.disabledPrembtn = false;
    } else {
      modelClassObj.disabledPrembtn = true;
    }
  }

  BookDeal(modelClassObj) {
    modelClassObj.OrderPlaceFlag = true;
    modelClassObj.BookOrdersubscription = this.FXD_afs.BookOrderforVB(
      '4',
      modelClassObj.Product_Code,
      modelClassObj.BestPriceProvider,
      modelClassObj.DCDRfqId,
      modelClassObj.ExternalRfqId,
      modelClassObj.ClientPremium !== '' &&
        Number(modelClassObj.ClientPremium) > 0
        ? modelClassObj.ClientPremium.replace(/,/g, '')
        : '0',
      this.HomeAPI.CustomerId,
      this.FXD_afs.UserName
    ).subscribe((res) => {
      const d1 = new Date();
      try {
        if (this.FXD_afs.GetPricingProduct() === modelClassObj.Product_Name) {
          res = res.BookTradeAndGetExternalTradeNumberReqJSONResult;
          if (res) {
            if (res.isProcessCompleted === true) {
              modelClassObj.Orderplace = res.External_TradeID;
              modelClassObj.DealNo = res.DealNo;
              modelClassObj.ClearPricingFlag = true;
            } else {
              modelClassObj.Errormsg = res.Message;
              modelClassObj.Orderplace = '';
            }
            try{
              modelClassObj.ViewScheduleflag = false;
            }catch(ex){

            }
            
          }
          if (d1.getHours() >= 12) {
            d1.getHours() === 12
              ? (this.hours1 = d1.getHours())
              : (this.hours1 = d1.getHours() % 12);
            this.ampm = 'PM';
          } else {
            this.hours1 = d1.getHours();
            this.ampm = 'AM';
          }
          d1.getMinutes() < 10
            ? (this.min1 = '0' + d1.getMinutes())
            : (this.min1 = d1.getMinutes());
          modelClassObj.orderTime =
            d1.getDate() +
            '-' +
            this.months[d1.getMonth()] +
            '-' +
            d1.getFullYear() +
            ' ' +
            this.hours1 +
            ':' +
            this.min1 +
            ' ' +
            this.ampm;
        }
        modelClassObj.OrderPlaceFlag = false;
      } catch (ex) {
        console.log(ex);
      }
      // this.loadflag = false;
    });
  }

  GenerateUserID(modelClassObj) {
    modelClassObj.RandomUserID =
      'GMUser_' + Math.floor(Math.random() * 1000 + 1).toString();
  }

  ResetAllFields(modelClassObj) {
    try {
      modelClassObj.ClearPricingFlag = true;
      modelClassObj.ClientPremium = 0;
      modelClassObj.IBPremium = '0.00';
      modelClassObj.PricingServiceResponse = '';
      modelClassObj.BestPrice = '';
      modelClassObj.BestPriceProvider = '';
      modelClassObj.Orderplace = '';
      modelClassObj.ExternalRfqId = '';
      modelClassObj.OrderPlaceFlag = false;
      modelClassObj.PricingLoading = false;
      modelClassObj.Errormsg = '';
      modelClassObj.DealNo = '';
    } catch (Ex) {
      console.log(Ex);
    }
  }

  sort_by_key(array, key) {
    try {
      return array.sort(function (a, b) {
        var x = a[key].toLowerCase();
        var y = b[key].toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });
    } catch (Ex) {
      console.log('');
      return array;
    }
  }

  fnIsMetalInCcy(modelClassObj) {
    try {
      modelClassObj.CCYOptions.forEach((element) => {
        if (element.Asset_Pair === modelClassObj.CurrencyPair) {
          if (element.LCY_Type.toUpperCase() === 'METAL') {
            // Check if the Dep ccy is metal or not
            modelClassObj.DisableCCYChangeControl = true;
            modelClassObj.DepCcy = modelClassObj.CurrencyPair.substr(0, 3);
            modelClassObj.AltCcy = modelClassObj.CurrencyPair.substr(6, 8);

            modelClassObj.IBPremCCY = modelClassObj.AltCcy;
            modelClassObj.NotionalCCY = modelClassObj.DepCcy;
            modelClassObj.NotionalDecimalPointShift = 0;
          } else if (element.RCY_Type.toUpperCase() === 'METAL') {
            // Check if the Alt ccy is metal or not
            modelClassObj.DisableCCYChangeControl = true;
            modelClassObj.DepCcy = modelClassObj.CurrencyPair.substr(0, 3);
            modelClassObj.AltCcy = modelClassObj.CurrencyPair.substr(6, 8);

            modelClassObj.IBPremCCY = modelClassObj.DepCcy;
            modelClassObj.NotionalCCY = modelClassObj.DepCcy;
            modelClassObj.NotionalDecimalPointShift = Number(
              element.Asset1_DecimalRate
            );
          } else {
            modelClassObj.DisableCCYChangeControl = false;
            modelClassObj.NotionalDecimalPointShift = Number(
              element.Asset1_DecimalRate
            );
          }
        }
      });
    } catch (ex) {}
  }

  fnChangeNotionalCCY(modelClassObj) {
    try {
      try {
        modelClassObj.CCYOptions.forEach((element) => {
          if (element.Asset_Pair === modelClassObj.CurrencyPair) {
            if (modelClassObj.NotionalCCY === element.Asset1) {
              modelClassObj.NotionalDecimalPointShift =
                element.Asset1_DecimalAmount;
            } else if (modelClassObj.NotionalCCY === element.Asset2) {
              modelClassObj.NotionalDecimalPointShift =
                element.Asset2_DecimalAmount;
            }
            modelClassObj.Notional = this.NotionalChangewithDecimalFixes(
              modelClassObj.Notional,
              modelClassObj.NotionalDecimalPointShift
            );
          }
        });
      } catch (ex) {}
    } catch (Ex) {}
  }

  fnCheckValidFirstFixingDate(
    Fixingdate: any,
    TradeDate: any,
    PremiumDate: any
  ) {
    let dateformFixingdate = new Date(Fixingdate);
    let dateformTradeDate = new Date(TradeDate);
    let dateformPremiumDate = new Date(PremiumDate);
    let dayName = this.Days[dateformFixingdate.getDay()];
    if (
      dayName.toUpperCase().includes('SAT') ||
      dayName.toUpperCase().includes('SUN')
    ) {
      return 'First fixing date should not fall on weekend.';
    } else if (dateformFixingdate.getTime() < dateformTradeDate.getTime()) {
      return 'First fixing should not be less than Trade Date.';
    } else if (dateformPremiumDate.getTime() > dateformFixingdate.getTime()) {
      return 'First fixing should not be less than Premium date.';
    } else {
      return '';
      this.fnGetDatesCalculationforVB;
    }
  }

  DealBooked = new BehaviorSubject<any>('');
  DealBookedObs = this.DealBooked.asObservable();


  // Added by Urmila A | 18-Oct-22 | Format number with commas | Start
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  // Added by Urmila A | 18-Oct-22 |Format number with commas | end

  // Added by Urmila A| to check Session validity | start 
  fnSetSessionInvalid() {
    this.sessionInvalid.next(true);
  }

  fnSetSessionValid() {
    this.sessionInvalid.next(false);
  }

  fnCheckSessionValidity(response) {
    try {
      // console.log("session validity ", response)
      if (response['A_ResponseHeader']['FailedReason']?.toString().toUpperCase() === 'INVALID SESSION') {
        this.fnSetSessionInvalid();
        return false;
      } else {
        return true;
      }
    } catch (ex) {
      console.log("fnCheckSessionValidity(...)", ex);
      return true;
    }

  }
  // Added by Urmila A | to check Session validity | end 


   //Added by Urmila A | Code to format date | start
   convertDate(input: any):any {
    const months = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var date = new Date(input),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);

    return [day, months[Number(mnth)], date.getFullYear()].join("-");
  }
   //Added by Urmila A | Code to format date | end


  // Urmila A  | 17-Dec-22 | Start
  TitleCase(sentence: any) {
    let sentence1 = sentence.toLowerCase().split(' ');
    for (let i = 0; i < sentence1.length; i++) {
      sentence1[i] = sentence1[i][0].toUpperCase() + sentence1[i].slice(1);
    }
    return sentence1.join(' ');
  }

  // Urmila A | 27-Dec-22 | start
  fnSetNotificationFXD(Content: any) {
    console.log("content" , Content)
    this.NotificationContentFXD.next(Content);
  }
  //end


  //Added by Urmila A | 5-Jan-23 | for fetching active remark based on User,Single pricer, Redirected deals
  fnGetRemark(UserType, IsRedirectedDeal,DealerRemark,RMRemark){
        var Remark;
        if(UserType === 'DEALER' || UserType.toLowerCase().includes('dealer')){
              Remark = DealerRemark
        }else if(UserType === 'RM'  && !IsRedirectedDeal){
            Remark = RMRemark
        }else if(UserType === 'RM' && IsRedirectedDeal){
            Remark = DealerRemark
        }else if(UserType === 'FXADVISORY' ){
            Remark = DealerRemark
        }
        // console.log('Active remark:',Remark)
        return Remark;
  }
  //end

  // Added by Urmila A | LGTGTWINT-790 | 31-Jan-23 | start
  FXDInputOnlyChar(e:any){
    const target: any = this.GetEventTarget(e);
    e = e ? e : window.event;
    const code = e.which ? e.which : e.keyCode;
    if(code >= 65 && code <= 90 || code >= 97 && code <= 122 || code === 45 ){
      return true
    }else {
      return false;
    }
  }
  // Added by Urmila A | LGTGTWINT-790 | 31-Jan-23 | end

  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 | start
  fnCheckAllDataLoaded(AllDataLoaded):any{
  var allareloaded: boolean = false;
  let FalseCnt = 0;
  Object.values(AllDataLoaded).forEach(res => {
    if (res === true) {
      allareloaded = true;     
    }else{
      allareloaded = false; 
      FalseCnt = FalseCnt + 1;      
    }
  });
  if(FalseCnt === 0){
        return true;
  }else{
        return false;
  }
  }
  //Urmila A | LGTGTWINT-1295 | 1-Feb-23 | end


  //Urmila A | LGTCLI-278 | start | 3-Feb-23
  fnGetMinDate(){
      return this.datepipe.transform(new Date(), 'yyyy-MM-dd')
  }
  //Urmila A | LGTCLI-278 | end | 3-Feb-23


  //Urmila A | LGTCLI-294 | 13-feb-23 | start
  fnRMremarkVisibility( queue):any{
          if(queue === 'Executed Orders' ){
                return true;
          }else if(queue === 'Trade Idea' ){
            return false;
          }else if(queue === 'Expired Trade Idea'){
            return false;
          }else if(queue === 'New Order from RM'){
            return true;
          }else if(queue === 'Rejected Orders'){
            return true;
          }
  }
  //Urmila A | LGTCLI-294 | 13-feb-23 | end



  //Urmila A | 15-feb-23 | LGTGTWINT-1403
  fngetMode(){
        //commented by Urmila A | as mode to be used from sidebar api response which is set in sessionStorage | LGTGTWINT-1681
        // if(usertype === 'DEALER' || usertype === 'FXADVISORY' ||
        //  usertype === 'HSBCDealer' || usertype === 'FXDealers'  ){
        //       return 'SEN'
        // }else if(usertype === 'IA' || usertype === 'RM'){
        //       return 'QEN'
        // }
        // console.log(usertype)
        return 'SEN'  //RizwanS || temporary set to SEN mode || 30 Aug 2023
        // return sessionStorage.getItem('/fxd') // Urmila A | 8-Mar-23 | LGTGTWINT-1681
  }

  //Urmila A | 16-feb-23 | LGTCLI-315 | start
  fnGetLP_withPrice(LParr){
        let cnt=0;
        LParr.forEach(element => {
                if(element.premium !== 0 && element.validResponseReceived == true){
                  cnt = cnt + 1;
                }
        });
        console.log('Lps with price:', cnt)
        return cnt;
  } 
  //Urmila A | 16-feb-23 | LGTCLI-315 | end
 

  //Urmila a | 16-feb-23 | LGTCLI-314 | start
  fngetIBcomment(clientPremDirection){
        if(clientPremDirection === 'CLIENT RECEIVES'){
          return 'IB Pays'
        }else if( clientPremDirection ===  'CLIENT PAYS'){
          return 'IB Receives'
        }
        if(clientPremDirection === 'P'){
          return 'IB Receives'
        }else if(clientPremDirection === 'R'){
          return 'IB Pays'
        }    
  }
  //Urmila a | 16-feb-23 | LGTCLI-314 | end

  // Start - HSBCFXEINT-38 | Chaitanya M | 14 Dec 2023
  fngetClientPremComment(clientPremDirection){
    try{
      if(clientPremDirection === 'CLIENT RECEIVES'){
        return 'Client Receives'
      }else if( clientPremDirection ===  'CLIENT PAYS'){
        return 'Client Pays'
      }
      if(clientPremDirection === 'P'){
        return 'Client Pays'
      }else if(clientPremDirection === 'R'){
        return 'Client Receives'
      } 
      
    }catch(e){
    }
  }
  // End - HSBCFXEINT-38 | Chaitanya M | 14 Dec 2023


  //Urmila A | 20-Feb-23 | LGTGTWINT-1444 | start
  fnCheckIncomingProdData(prodID, prodCode, ProdName, TempName, TempCode, tempID){
    if(prodID !== '' && prodCode !== ''  && ProdName !== '' &&
    TempName !== '' && TempCode !== '' && tempID !== ''){
        return true
    }else {
        return false
    }
  }
  //Urmila A | 20-Feb-23 | end


  //Added by Urmila A | timer calculations FXD | 27-feb-23 | LGTGTWINT-1539 | start
  calculateRemainingSecondsFXD(validTillTime){
    try {
      
      // HSBCFXEINT-68 : Timer not visible upon Best Price. || Commented by Chaitanya M|| 02-Feb-2024
      // --------------------------------------------Start--------------------------------------------

      // let d = new Date();
      // let currentTime = d.getTime()
      // // var currentTime = this.fnSGTime(+8);
      // var remainingSeconds = Math.floor((validTillTime.getTime() - currentTime) / 1000);
      // console.log('remainingSeconds',remainingSeconds)
      // return remainingSeconds;

      let validTillTimeNew=new Date(Date.parse(validTillTime))
      
      // let clientTime = this.changeTimeZone(new Date(), 'Asia/Kolkata'); 
    
      let clientTime = this.changeTimeZone(new Date(), 'Europe/London'); 

      let remainingSeconds = Math.max(0,Math.floor((validTillTimeNew.getTime() - clientTime.getTime()) / 1000))

      return remainingSeconds;

      // HSBCFXEINT-68 : Timer not visible upon Best Price. || Commented by Chaitanya M|| 02-Feb-2024
      // --------------------------------------------End--------------------------------------------


    } catch (error) {
      console.log(error.message);
    }
  }

  // HSBCFXEINT-68 : Timer not visible upon Best Price. || Commented by Chaitanya M|| 02-Feb-2024
  // --------------------------------------------Start--------------------------------------------
  changeTimeZone(date, timeZone) {
    try
    {
      if (typeof date === 'string') {
        return new Date(
          new Date(date).toLocaleString('en-US', {
            timeZone,
          }),
        );
      }
      return new Date(date.toLocaleString('en-US', {timeZone,}),);
    }catch(error){
      console.log(error.message)
    } 
  }
  // HSBCFXEINT-68 : Timer not visible upon Best Price. || Commented by Chaitanya M|| 02-Feb-2024
  // --------------------------------------------End--------------------------------------------

  fnSGTime(offset){
    try{
      let d = new Date();
      let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      let nd = new Date(utc + (3600000*offset));
      return nd;
      // return "The local time in " + city + " is " + nd.toLocaleString();

    }catch(er){
    console.log(er.message);
    }
  }
  //Added by Urmila A | timer calculations FXD | 27-feb-23 | end


  //Urmila A | set FXD pricing error msg - LGTGTWINT-1607 | start
  fnSetErrorMsg(msg:any){
      if(msg.includes('.')){
        msg = msg.replaceAll('.','')
      }
      if(msg.toLowerCase().includes('aborting further')){
        msg = msg.replace('Aborting further Migration for this record','')
      }

      // return this.sentenceCase(msg.trim() + '.');
      return msg.trim() + '.';
  }
  //end

  //Added by Urmila A | start
  titleCaseSentence(str){
    str = str.toLowerCase();
    str = str.split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
  }

  sentenceCase(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  //Added by Urmila A | end


  //Urmila a, 3-Mar-23 | LGTGTWINT-1798 | start
  GetQuoteHistoryMode(Mode, filter){
          if(Mode === 'SEN'){
                if(filter === 'Self' ){
                    return 'SELF'
                }else if(filter === 'Group'){
                    return 'Group'
                }else if (filter === 'All'){
                    return 'All'
                }
          }else if(Mode === 'QEN'){
                if(filter === 'Self' ){
                  return 'SELF'
                }else if(filter === 'Group'){
                    return 'Group'
                }
          }else if(Mode === 'SELF'){
                if(filter === 'Self' ){
                  return 'SELF'
                }
          }else if(Mode === 'QEN_LRC'){
                if(filter === 'Self' ){
                  return 'SELF'
                }else if(filter === 'Group'){
                    return 'Group_LRC'
                }
          }
  }
  //Urmila a, 3-Mar-23 | LGTGTWINT-1798 | end


  //modified by Urmila A | 9-may-23, LGTCLI-361 |start
  fnGetLP_withPrice_Quote(LParr){
    let quoteID='';
    LParr.forEach(element => {        
              quoteID === '' ? quoteID = quoteID + '' + element.quoteId : 
                                    quoteID = quoteID + ',' + element.quoteId;       
    });
    console.log('Lps with price & quote:', quoteID)
    return quoteID;
  }//end

  //LGTGTWINT-1947 reference | LGTGTWINT-2123 -> Making common functions across product | added by UrmilaA | 13-June-23 |start
  fnParseXML(response, parse){
    let value;
    let FA=[];
    let KO=[];
    let FF=[];
    let parser = new DOMParser()
    let xmlDoc = parser.parseFromString(response, "text/xml")
    if(parse === 'fixingAdj' || parse === 'finappaytype' ){  //modified by UrmilaA, 17-may-23
      value =  xmlDoc.getElementsByTagName("FinalPayType")
      let inputList = Array.prototype.slice.call(value);
      console.log('inputList',inputList)
      inputList.forEach(element => {
            console.log('in for',element)
            FA.push(element.childNodes[0].nodeValue)
      });  
      return FA
    }else if(parse === 'KOtype'){
      value =  xmlDoc.getElementsByTagName("KOType")
      let inputList = Array.prototype.slice.call(value);
      inputList.forEach(element => {
            KO.push(element.childNodes[0].nodeValue)
      });  
      return KO
    }else if(parse === 'fixingfreq'){
      value =  xmlDoc.getElementsByTagName("Freq").length > 0 ? xmlDoc.getElementsByTagName("Freq") : xmlDoc.getElementsByTagName("Element")
      let inputList = Array.prototype.slice.call(value);
      inputList.forEach(element => {
            FF.push(element.childNodes[0].nodeValue)
      });  
      return FF
    }
    else{
      value =  xmlDoc.getElementsByTagName("Element")[0].childNodes[0].nodeValue;
      return value
    }
  }
  //LGTGTWINT-1947 reference | LGTGTWINT-2123 -> Making common functions across product | added by UrmilaA | 13-June-23 |ends

  //added by UrmilaA | LGTGTWINT-2123 |14-June-23|start
  fngetContractSumm(data){
    let ContractSummary;
    if(data.includes('color:green')){ //Urmila A | 16-feb-23 |LGTGTWINT-1429
      // ContractSummary = this.sanitize.transform(data.toString().replaceAll("\color:green","color:var(--green) !important"))
    }else if(data.includes('color:red')){
      // ContractSummary = this.sanitize.transform(data.toString().replaceAll("\color:red","color:var(--red) !important"))
    }else if(data === ''){
      ContractSummary=''
    }

    return ContractSummary;
  }
  //added by UrmilaA | LGTGTWINT-2123 |14-June-23 |ends


  //Added by UrmilaA | 13-July-23 | Common pricing  Notification function | start 
  NotificationFunction(type , header, reason)
  {
    this.fnSetNotificationFXD({ 
      NotificationType: type , //'Error',
      header: header , // 'Error',
      body: reason,
      DateandTime: ''
    });
  }


  //Error handling logic modified by Urmila A | 15-sep-23 | start
  fnPricingNotification(res){
      if(res.errors !== undefined){
        let key = Object.keys(res.errors)
        let Error = res.errors[key[0]]
        console.log('errorrr',Error)
        this.NotificationFunction("Error","Error" , Error)
        return 'Fail'
      }else if(res?.oPriceResponseBody[0]){
        let error = res?.oPriceResponseBody[0]?.errorMessage; 
          if(res?.oPriceResponseBody[0]?.bestPriceProvider === 'FAIL:FAIL'){  
            this.NotificationFunction("Error","Error" , "No response received from remote system")
            return 'NoResReceived'   
          }else if(res.oPriceResponseBody[0]?.bestPriceProvider === null ){ 
            if(res.oPriceResponseBody[0]?.errorMessage.includes('Aborting further')){ 
              this.NotificationFunction("Error","Error" , this.fnSetErrorMsg(error)); 
            }else{
              this.NotificationFunction("Error","Error" , "No response received from remote system")
            }
            return 'Fail'
          }else if(res === null){   
            this.NotificationFunction("Error","Error" , "System error occured, Please contact support")
            return 'Fail'
          } 
      } 
  }
  //Error handling logic modified by Urmila A | 15-sep-23 | ends


  //UrmilaA | 8-Jan-24 | Restriction of drag-drop, copy-paste  on input fields | start
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
  }

  DisableCut(event:any){
    event.preventDefault();
  }
  DisableCopy(event:any){
    event.preventDefault();
  }
  DisablePaste(event:any){
    event.preventDefault();
  }
  //UrmilaA | 8-Jan-24 | Restriction of drag-drop, copy-paste on input fields | ends

  fnThrowError(res){ // added by UrmilaA | 8-jan-24 | Error handling
    let key = Object.keys(res.errors)
    let Error = res.errors[key[0]]
    this.NotificationFunction("Error", "Error", Error);
  }

  // Start : HSBCFXEINT-75 Enable Soft Tenor | Chaitanya M | 28-Feb-2024
  onTenorChange(e) {
    let tenorsuffix = e.target.value.charAt(e.target.value.length - 1);
    if ((tenorsuffix.toUpperCase() !== 'M' && tenorsuffix.toUpperCase() !== 'Y' && tenorsuffix.toUpperCase() !== 'D' && tenorsuffix.toUpperCase() !== 'W') && (isNaN(tenorsuffix) || isNaN(parseInt(tenorsuffix)))) {
      e.target.value = e.target.value.slice(0, -1);
    }
    else {
      e.target.value = e.target.value.toUpperCase();
    }
  }
  // End : HSBCFXEINT-75 Enable Soft Tenor | Chaitanya M | 28-Feb-2024


  // Start : HSBCFXEINT-75 Enable Soft Tenor | Chaitanya M | 28-Feb-2024
  fnGetTenorType(tenor: string) {
    switch (tenor.charAt(tenor.length - 1).toUpperCase()) {
      case 'M': case 'm':
        return 'Month';
      case 'Y': case 'y':
        return 'Year';
      case 'D': case 'd':
        return 'Date';
      case 'W': case 'w':
        return 'Date';
      default:
        break;
    }
  }
  // End : HSBCFXEINT-75 Enable Soft Tenor | Chaitanya M | 28-Feb-2024


  // Start : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
  ConvertIntoPIPs(notionalAmt, Strikerate, value, pointshift, IBPremCCY,NotionalCCY,DepCcy){

    let _Pipsmultipler = this.multiplyByMultiplier(10, Number(pointshift));

    if(IBPremCCY !== NotionalCCY){
      
      value = ( value / (Number(notionalAmt))) * _Pipsmultipler ;  

    }else{

      if(NotionalCCY === DepCcy){

        value = ( value / ( Number(notionalAmt) * Number(Strikerate))) * _Pipsmultipler ;  
        
      }else{

        value = ( value / ( Number(notionalAmt) / Number(Strikerate))) * _Pipsmultipler ;  
      
      }
      
    }

    return value.toFixed(4).replaceAll('-','');
  }


    multiplyByMultiplier(number, multiplier) {
    let result = number;
    for (let i = 1; i < multiplier; i++) {
        result = result *10;
    }
    return result;
  }
  // End : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024

}




