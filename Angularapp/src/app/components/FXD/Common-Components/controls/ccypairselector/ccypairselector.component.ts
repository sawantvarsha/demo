import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { environment } from 'src/environments/environment';
import { FxdCommonfunctionsService } from '../../../services/fxd-commonfunctions.service';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-ccypairselector',
  templateUrl: './ccypairselector.component.html',
  styleUrls: ['./ccypairselector.component.scss','../../../products/aqdq/aqdq.component.scss'],
})
export class CcypairselectorComponent implements OnInit {
  @Input() CurrencyPair: string;
  @Input() CCYList: any;
  @Output() SelectedCcy = new EventEmitter<string>();
  @Input() disabled:boolean;
  domainURL = environment.FXD_domainURL;
  DefaultImagePath: string =
    'http://40.65.134.77/assets/Flags_Circular/usd.png';

  showUnderlyingList: boolean = false;
  EnteredUnderlying: boolean = false;
  selectedBIndex: number = 0;
  HoverCCy:any=''; //UrmilaA | LGTGTWINT-2112 | 13-june-23
  constructor(public elem: ElementRef, public Common_cfs: CommonApiService, public FXD_cfs: FxdCommonfunctionsService) {}

  ngOnInit(): void {
    console.log('CCY',this.CCYList);   //commented by UrmilaA, 22-Mar-23
   
  }

  //Added by Urmila A | LGTGTWINT-1581 | 1-Mar-23 | start
  // GauravM, UrmilaA | 08-Jan-24 | F5SAAINT-1432,  HSBCFXEINT-40| added parameter(e), CCY pair issue
  fnCheckCCY(e){
    let ccycollection:any = ''
    //  this.CCYList = this.FXD_cfs.capitalizeWords(this.CCYList)
    this.CCYList.forEach(element => {
        ccycollection = ccycollection + element.asset_Pair + ','
    });

    // if(!ccycollection.toUpperCase().includes(this.CurrencyPair.toUpperCase()) && chngeCCY == ''){ 
    //   this.NotificationFunction("Error", "Error", "Currency pair not found");
    //   this.CurrencyPair = '';
    //   this.SelectedCcy.emit(this.CurrencyPair);  //added by UrmilaA | 9-june-23
    // }

   
    //modified logic by UrmilaA | LGTGTWINT-2112 | 13-june-23 |start
    // GauravM | 03-Jan-24 | F5SAAINT-1432 | Handled all conditions for search functionality | start
      console.log('in changeccy:',this.HoverCCy, ccycollection,this.CCYList)
      let onlyCCY = ccycollection
      onlyCCY = onlyCCY.replaceAll(' - ','')
      if( (!onlyCCY.toUpperCase().includes(this.CurrencyPair.replaceAll('-','').replaceAll(' ','').toUpperCase()) )){
        this.NotificationFunction("Error", "Error", "Currency pair not found");
        this.CurrencyPair = '';   
        this.HoverCCy=''     
      }else{
        if(!this.CurrencyPair.includes('-')){
          this.CurrencyPair = this.HoverCCy.toUpperCase()
        }
        else if(this.CurrencyPair.includes('-') && e == "" && this.HoverCCy !== '' ){ //Modified by UrmilaA | F5SAAINT-1432 | 10-Jan-24 | CCY enter-change issue
          this.CurrencyPair = this.HoverCCy.toUpperCase()
        }
      }
      if($('.HoverSuggestion').data('ccy') !== (this.CurrencyPair && undefined)){ //added by UrmilaA | LGTGTWINT-2157 | 28-June-23 
        this.SelectedCcy.emit(this.CurrencyPair.toUpperCase()); 
        this.HoverCCy=this.CurrencyPair //Added by UrmilaA | F5SAAINT-1432 | 10-Jan-24 | CCY enter-change issue
      }
     
    //modified logic by UrmilaA | LGTGTWINT-2112 | 13-june-23 |ends
    // GauravM | 03-Jan-24 | F5SAAINT-1432 | Handled all conditions for search functionality | end 

  }


  //fnCheckValidCCY added by UrmilaA | HSBCFXEINT-40 | for checking valid ccy | 8-Jan-24 | start
  fnCheckValidCCY(e){
    let ccy;
    e.target == undefined ? ccy = e : ccy = e.target.value;
    console.log('chk valid ccy: ',e ,ccy )
    if(ccy.split(' ')[0] === ccy.split(' ')[2]){
      this.SelectedCcy.emit('');
      this.HoverCCy='' //Added by UrmilaA | F5SAAINT-1432 | 10-Jan-24 | CCY enter-change issue
    }
    if(ccy.length <= 8 && this.CurrencyPair !== this.HoverCCy){
      this.SelectedCcy.emit('');
      this.NotificationFunction("Error", "Error", "Currency pair not found");
      this.CurrencyPair = '';   
      this.HoverCCy=''       
    }
  }
  //fnCheckValidCCY added by UrmilaA |HSBCFXEINT-40 |  for checking valid ccy |  8-Jan-24  |ends



  ChangeIndex() {
    try {
      this.selectedBIndex = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
      this.EnteredUnderlying = true;
    } catch (Error) {}
  }

  showUnderlying(ccyPair: string) {
    console.log('ccyPair',ccyPair)
    this.showUnderlyingList = false;
    this.SelectedCcy.emit(ccyPair.toUpperCase());
    this.HoverCCy=ccyPair //Added by UrmilaA | F5SAAINT-1432 | 10-Jan-24 | CCY enter-change issue
  }

  //added by UrmilaA | LGTGTWINT-2112 | 13-june-23 | start
  updateCCy(ccy){
    console.log('hover',ccy)
    this.HoverCCy = ccy
   
  }
  //added by UrmilaA | LGTGTWINT-2112 | 13-june-23 | ends


  EnterCurrencyPair(e) {
  
    try {
    
      if ($('.HoverSuggestion').data('ccy') != undefined) {
        this.CurrencyPair = $('.HoverSuggestion').data('ccy').toUpperCase();
      }
      this.fnCheckCCY(e); //Added by Urmila A | LGTGTWINT-1581 | 2-Mar-23 | GauravM | 03-Jan-24 | F5SAAINT-1432
      if(this.CurrencyPair !== ''){ //Added by Urmila A | LGTGTWINT-1581 | 2-Mar-23
          // this.ShareName = this.shareCode;
          // this.showUnderlying(SearchUnderlyingPipe.prototype.transform(this.CCYList, this.shareCode, 1)[0]);
          this.showUnderlyingList = false;
          this.EnteredUnderlying = false;       
      }
      // this.SelectedCcy.emit(this.CurrencyPair); //UrmilaA | 28-June-23 | LGTGTWINT-2157
     
    } catch (Error) {}
  }

  //added by UrmilaA | 9-june-23 |LGTGTWINT-2112 | start
  chngCCY(){
    this.fnCheckCCY("") // GauravM | 03-Jan-24 | F5SAAINT-1432
    // this.EnterCurrencyPair()
    this.EnteredUnderlying = false
    this.showUnderlyingList=false
  }
  //added by UrmilaA | 9-june-23 |LGTGTWINT-2112| ends

  backKeyPress() {
    try {
      this.selectedBIndex = 0;
      this.showUnderlyingList = true;
    } catch (error) {}
  }

  ScrollTo(container, element, direction) {
    try {
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
      //console.log("Error:", error);
    }
  }

  moveUpSelection(selectedIndex) {
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
    } catch (error) {}
  }

  moveDownSelection(selectedIndex) {
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
    } catch (error) {}
  }


  //Added by Urmila A | LGTGTWINT-1581 | 2-Mar-23 | start
  NotificationFunction(type , header, reason)
  {
    this.FXD_cfs.fnSetNotificationFXD({ // Shifted function to FXDCommnService, to avoid EQC service injection, by Urmila A | 27-Dec-22
      NotificationType: type , //'Error',
      header: header , // 'Error',
      body: reason,
      DateandTime: ''
    });
  }


  //Added by UrmilaA | 26-Dec-23 | start
  onInput(e){
    this.CurrencyPair = e.target.value.toUpperCase()
    console.log('input change',e, this.CurrencyPair)
  }
}
