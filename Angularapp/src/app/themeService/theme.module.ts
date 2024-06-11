import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class ThemeModule {
  asseturl = environment.asseturl;
}

export interface Theme {
  name: string;
  properties: any;
}

export const light: Theme = {
  name: 'light',
  properties: {
    // common colors
    //Added by Taran
    '--container-color':'#fff',
    '--white': ' white',
    '--black': ' black',
    '--blue': '#0275cc',
    '--red': ' #d23f31',
    '--brown': ' #d97d54',
    '--yellow': '#c7c782',
    '--light-brown': ' #f7d1c0',
    '--green': ' #0f9d55',
    '--gray': ' #676767',
    '--light-gray': ' #97979b',  //changed by AdilP for Light theme @28-03-2023
    '--very-light-gray': ' #fafafa',
    '--very-dark-gray': ' #212121',
    '--dark-gray': ' #303030',
    '--light-dark-gray': ' #424242',
    '--border-tr': 'solid 1px #cbd5de',
    '--main-bg-color': ' #ffffff',
    '--hover-wfl': '#7d7d7d61',
    '--navbar': ' #ffffff',
    '--navbar-main': ' #2e2f32',
    '--light-blue': '#4ac2ff87',
    '--dark-blue': '#0d445b',

    '--sidebar-li': ' #000000',
    '--sidebar-li-active': ' #1261a0',
    '--sidebar-bg': ' #eeeeee',
    '--scroll-bar': '#b6b6b6',
    '--scroll-bar-hover': ' #a4a4a4',
    '--active-sidebar': 'transparent',

    '--profile-name': ' #1a4269',
    '--label': ' #0d4a79',  //Added by AdilP @28-03-2023
    '--inline-label': ' #1261a0',

    '--checkbox': ' #424242',
    '--checkbox-bg': ' #ffffff',
    '--text': ' #000000',
    '--text-color': ' #000000',
    '--icons': ' #1261a0',
    '--icons-filter': 'grayscale(1)',
    '--active-icons-filter': 'none',
    '--calendar-filter': '',

    '--headers': ' #1a4269',
    '--containers': ' #ffffff',
    '--containers-content': '#b6b6b7',

    '--box-content': ' #eeeeee',

    '--table-header-bg': '#eeeeee',
    '--table-header-text': '#000000',
    '--table-subheader-text': '#000000',
    '--table-row-odd': ' #f8f8f8',
    '--table-row-even': ' #e8e8e8',
    '--table-row-hovered': ' #d6d6d6',
    '--td': 'black',

    '--btn-bg': ' #1261a0',
    '--btn-text': ' #ffffff',

    '--input-bg': '#efefef',
    '--input-text': ' #000000',
    '--input-border': '1px solid #dad7d7', 
    '--input-border-bottom': '1px solid #dad7d7',
    '--rm-popup':'#f7f8fc', // Added by AdilP for background @23-03-2023

    '--select-bg': '#efefef',
    '--select-text': '#000000',
    '--input-icon': 'grey',
    '--btn-hover-bg': ' #174d77',
    '--btn-hover-text': ' #ffffff',

    '--disabled': '#b5b5b585',
    '--disabled-text': ' #a7a7a7',
    // Added bt AdilP for light theme
    '--btn-disabled': '#8591a3',
    '--bt-disabled-text':'#a7a7a7',

    '--sidebar-handle': ' #a7a7a7',
    '--btn-border': ' #bebebe',
    '--btn-border-insurance': ' #cfcfcf',
    '--border': ' #bebebe', //Added by AdilP @30-03-2023
    '--btn-toggle-filter': ' brightness(1)',
    '--selected-btn-toggle-filter': ' brightness(0.3)',

    '--btn-border-bottom': ' 1px solid transparent',
    '--placeholder-text': ' #6c757d',

    '--header-line': ' linear-gradient(90deg, #111111, #fff)',

    '--risk-rating-bg': ' #e2e2e2',

    '--shadow-buttons': ' 0 0.0625rem 0.1875rem rgba(0, 25, 40, 0.2)',

    '--links': ' #0284e0',
    '--active': ' #1a4269',
    '--active-bg': '#EC0000',
    '--default-bg': '#767676',
    '--active-bg-disabled': '#ababab',
    '--default-bg-disabled': '#ababab',

    '--footer-text': ' #343a40',
    '--calendar-icon':
      'url(' + environment.asseturl + 'calendar-grey.png)',
      '--exclamation-icon':
      'url(' + environment.asseturl + 'exclamation_red.png)',//exclamation icon added by SandipA to highlight ErrorMsg @17-Nov-23
    '--xls-icon':
      'url(' + environment.asseturl + 'xls.png)',
    '--pdf-icon':
      'url(' + environment.asseturl + 'pdf.png)',

    '--portfolio-toggle-bg': '#ffffff',
    '--portfolio-toggle': '#234567',
    '--nav-header': '#0b497b',
    '--header-icon': '#fff',

    // misc
    '--container-box-shadow': ' 0px 0px 10px 4px rgba(0, 0, 0, 0.6)',
    '--box-shadow-thin':
      ' 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '--box-shadow-ccy':
      ' 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '--box-shadow':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-hovered':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-small':
      ' 0 1px 1px 0 rgba(66, 66, 66, 0.08), 0 1px 3px 1px rgba(66, 66, 66, 0.16)',

    // '--font-primary': '"Montserrat", sans-serif',
    // '--font-secondary': '"Open Sans", sans-serif',
    '--sidebar-line':
      'linear-gradient(to right, var(--sidebar-bg) 0%, #b7b7b7 50%, var(--sidebar-bg) 100%)',
    '--profile-icon':
      'url(' + environment.asseturl + 'user-blue.png)',
    '--setting-icon':
      'url(' + environment.asseturl + 'setting.png)',
    '--finiq-logo':
      'url(' + environment.asseturl + 'FinIQ_logo_blue.png)',
    '--logout-icon':
      'url(' + environment.asseturl + 'logout.png)',
    '--sidebar-filter': 'none',
    '--ticker-bg': '#ffffff',
    '--theme-active': '#e0e0e0',
    '--theme-hover': '#ebebeb',
    '--content-header': '#0b497b',
    '--heading-label': '#696969',
    '--off-color': '#0b497b',
    '--cirp-header': '#394346',
    '--fx-line': '#dadada',
    '--fx-text': '#ffffff',
    '--filter-button': '#0b4a7b',
    '--fx-tile': '#eeeeee',
    '--glass': '#ffffffe8',
    '--selected-box': '#1261a029',

    '--gap': '8px',
    '--neumorphic-down': 'none',
    '--neumorphic-up': 'none',
    '--input-height': '35px',
    '--neumorphic-disabled': 'none',
 
    '--checkbox-neo': 'none',
    '--neumorphic-sidebar': 'none',
    '--icon-active': '#1261a0',
    '--news-text': '#f7f7f7',
    '--tab-gap': '0px',
    '--tab-radius': 'none',
    '--border-tabs': '2px solid #1a4269',
    '--sub-container': '#ffffff',
    '--list-hover': '#7d7d7d36',
    '--domain-ip': window.location.protocol + '//' + window.location.host,
    '--setting-box': '#ffffff',
    '--10': 'calc(8px + (10 - 8) * ((100vw - 1200px) / (1920 - 1200)))',
    '--12': 'calc(11px + (12 - 11) * ((100vw - 1200px) / (1920 - 1200)))',
    '--14': 'calc(12px + (14 - 12) * ((100vw - 1200px) / (1920 - 1200)))',
    '--16': 'calc(14px + (16 - 14) * ((100vw - 1200px) / (1920 - 1200)))',
    '--20': 'calc(18px + (20 - 19) * ((100vw - 1200px) / (1920 - 1200)))',
    '--28': 'calc(24px + (28 - 24) * ((100vw - 1200px) / (1920 - 1200)))',
    '--sub-sidebar-color': '#cfcfcf',
    '--linkMovement': 'black',
    '--linkQMovement': 'rgb(192, 40, 2)',
    '--calendar-bg':'#f5f5f5',
    '--week-strip':'#ec5043',
    '--table-th' : '#000000',//Added by SandipA || 11-Apr-2023
    // Added Workbench label color by AdilP @28-03-2023 || Start
    '--lbl-reverseConvertible':'#4783b2', //
    '--lbl-participation':'#53697a',//
    '--lbl-creditTranche':'#7991a7', //
    '--lbl-ACC':'#505878',//
    '--lbl-DAC':'#0f56b6',//
    '--lbl-EQC':'#6182b0', //
    '--lbl-YE':'#24569a',//
    '--date-bg-color':'#efefef',  //For midnight theme
    '--bg-success':'#3446e0',  //Added by Adil for progress bar
    
    // Added Workbench label color by AdilP @28-03-2023 || End
    //START || Added by Varsha G || 25-Mar-2023
    '--best-lp':'#f5f5f5',
    '--submenu-active-color':'#0b497b',
    '--WFLabel-color':'#000000',
    '--queueCard-bg-color':'#efefef',
    '--calendar-bg-theme':'light',
    '--infoNote-bg-color':'#f8f8f8',
    '--infoNote-border':'#dddddd',
    '--tblTrigger-bg-color':'#fff',
    '--tblTrigger-border':'#ccc',
    '--container-hover':'#e8e8e8',
    '--home-container':'#ffffff',
    '--queueCard-border-color':'#dadada',
    '--tile-label':'#0d4a79',
    '--view-popup-color' : '#ffffff', //Added by Jyoti S for Prev Quotes View Pricer Popup
    '--link-popup' : '#ffffff',//Added by Jyoti S for Prev Quotes View Pricer Popup
    '--table-data-ER-color' : '#ffffff',//Added by Jyoti S for Prev Quotes table data
    '--tbl-audtitrail-border': '#dbdbdb', //Added by Jyoti S for audti trail table border
    '--tbl-th-audit-trail' : '#ffffff', //Added by Jyoti S for audti trail table border
    '--date-active' : '#000000',//Added by Jyoti S for audti trail date filter active
    '--page-background' : '#ffffff',//Added by Jyoti S for Prev quotes accoordian
    '--ripple-color' : '#0d445b',//Added by Jyoti S for audti trail ripple effect
    '--select-product' : '#ffffff',//Added by Jyoti S for audti trail tooltip
    '--select-product-color' : '#000000',//Added by Jyoti S for audti trail tooltip
    '--tbl-prevquotes' : '#ffffff',//Added by Jyoti S for prev quotes table
    '--autocall-color': "#022e58", //Added by Jyoti S for quotes audit trail autocall icon
    '--disabled-tabs-color' : ' #cccccc', //Added by Jyoti S for previous quotes product tabs
    '--header' : '#000000',//Added by Jyoti S for Quotes Audit Trail
    //'--table-th' : '#98999A',//Added by Jyoti S for Quotes Audit Trail
    '--pricer-popup-color': "#000000", //Added by Jyoti S for previous quotes popup icon
    //END || Added by Varsha G || 25-Mar-2023
    '--select-dropdown-bg': '#efefef',// Added by Sandip for underlaying popup background @11-04-2023
    '--card-bg-hover': 'linear-gradient(to right,#cdcdcd00 0%,#dad8d8 20%,#d4d3d3 40%,#dfdfdf 100%)',// Added by Sandip for card background hover effect @27-06-2023
    '--icon-active-bg': '#1a3863', // Added by SandipA for overlay background @05-07-2023
     
    // Added by RizwanS / ChaitanyaM :: Start || Instant Pricer || HSBCFXEINT-9 ||  08-Nov-2023
    //-----------------------------------------------------------//
    '--smallDiv-bg': '#FFFFFF',
    '--price-btn': '#283C83 ',
    '--price-text': '#FFFFFF ',
    '--pricer-tbl-bg': '#D4D8E6',
    '--pricer-text': '#283C83',
    '--select-bk': '#737a9c',
    '--option-bg': '#FFFFFF',
    '--popup-bk': '#f2f2f2',
    '--popup-box-shadow': '#b5b5b5',
    '--popup-border': '#c7c6c6',
    '--pair-box-shadow': '#c1c1c1',
    '--input-disabled': '#D4D8E6',
    '--scroll-bg': '#d7ddf3',
    '--scroll-bg-color': '#808080',
    '--tile-bg': '#f2f2f2',
    '--switch-bg-sell': '#d4d8e6',
    '--span-bg': '#e7e7e7',
    '--shadow-head': '#f1eeee',
    '--border-chk': '#000',
    '--product-bg': '#ffffff',
    '--aqdq-bg': '#ffffff',
    '--box-inner-bg': '#f2f2f2',
    '--li-hover-bg': '#ffffff',
    '--popup-border-bg': '#f1f1f1',
    '--ELN-bg': '#e1dddd',
    '--crudShadow': '#181818',
    '--btn-color': '#FFFFFF',
    '--select-disabled': '#d4d8e6',
    '--switch-selction-bg': '#ff9800', 
    '--nav-btn-bg': '#A2A7BC',
    '--btn-pricegrid-disabled-ip':'#D4D8E6',
    '--pricer-grid-bg-ip':'#D4D8E6',
    '--bestprice-style-bg-ip':'#07825E',
    '--btn-disabled-text-ip':'#666666',
    '--pricetext-color-ip':'#1A3343',
    '--timer-text':'#737A9B', 
    '--switch-select-bg':'#d4d8e5', // Added by Chaitanya M for toggle color | LGTGTWINT-1419 | 15 Feb 2023
    '--filter-maple': 'invert(1%) sepia(50%) saturate(6280%) hue-rotate(205deg) brightness(56%) contrast(96%)',
    '--action-icon-maple': 'invert(100%) sepia(100%) saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%)',
    '--action-icon-maple-hover': 'invert(50%) sepia(101%) saturate(1050%) hue-rotate(193deg) brightness(38%) contrast(100%)',
    '--action-drawer':'#fff',
    '--action-drawer-border':'#162258',
    '--rfq-text':'#162258', //Added by Rohit T. LGTCLI-316 | 16-feb-23
    '--advYes':'#000', //Added By RizwanS | LGTGTWINT-1605 | 03 March 2023 
    '--advNo':'red', //Added By RizwanS | LGTGTWINT-1605 | 03 March 2023 
    '--btnfilter_IP':'invert(242%) sepia(93%) saturate(50%) hue-rotate(284deg) brightness(150%) contrast(350%)', //LGTGTWINT-1462 'Mail All' functionality | Chaitanya M | 23 Feb 2023
    '--dialogboxbgIP' : '#f7f7f7', // added by Chaitanya M | 04 March 2023
    '--shdwdialogboxbgIP' : '#A2A7BC', // added by Chaitanya M | 04 March 2023
    '--templatenamebg-IP' : '#283e80',
    '--templatenamebghover-IP' : '#A2A7BC',
    '--tempplatetext-IP' : '#283C83',
    '--orderDetailsmsg':"#283e80 ", //Added By RizwanS | 04 March 2023
    '--rfqtextFXD-ip': "#fff", //RFQ ID to be in Black font for FX tiles Ref:LGTCLI-365 | Chaitanya M | 21 March 2023
    '--rfqtextEQC-ip': "#FFF", //RFQ ID to be in Black font for EQC tiles Ref:LGTCLI-365 | Chaitanya M | 21 March 2023    
    '--Buy_DirectionFXD-ip' : "#07825E", // Added for LGTCLI-348 FX Tiles Buy Sell Toggle UI Follow Single Pricer | Chaitanya M | 29 March 2023
    '--Sell_DirectionFXD-ip' : "#CB2C30", // Added for LGTCLI-348 FX Tiles Buy Sell Toggle UI Follow Single Pricer | Chaitanya M | 29 March 2023
    '--orderHeader-bottomline-color-IP':'#283C83', // Added by RizwanS || 04 Apr 2023
    '--select-bg-ip': '#C1C7E1', // Changed by Chaitanya M | 25 July 2023
    '--calendar-icon-filter':'invert(10%) sepia(72%) saturate(1429%) hue-rotate(210deg) brightness(56%) contrast(145%)',
    '--icon-header': '#1261a0', // HSBCFXEINT-8 | Chaitanya M  | 12 Dec 2023
    // Added by RizwanS / ChaitanyaM :: END || Instant Pricer || HSBCFXEINT-9 ||  08-Nov-2023
    //-----------------------------------------------------------//

  '--notificationsPopUpBG' : "#e0e0e0",//Added by Jyoti S || 06-Sept-2023
  '--calendar-prev-dates' : '#efefef', //Added by Apurva K|| 06-Sep-2023
  '--tilebgcolor' : '#f5fafb', //Added by Apurva K|| 04-Sep-2023
  //Added by AdilP for galxy pages theme wise || Start || 07-09-2023
 '--link-div':'#eeeeee',
 '--layout-inner-container':'rgb(180, 180, 180)',
 '--sub-header-lcm':'rgb(180, 180, 180)',
 '--link-select':'#ea0010',
    '--tile-1': 'rgb(67, 94, 190)',
    '--tile-2': 'rgb(6, 146, 143)',
    '--tile-3': 'rgb(254, 147, 39)',
    '--tile-4': 'rgb(255, 202, 51)',
    //Added by AdilP for galxy pages theme wise || End
    '--active-date' : "#b5d4ff", // Added by Jyoti S || 05-Oct-2023 || SP Event  Calendar
    '--card-bg': '#efefef', //Added by ChaitanyaM | 23-Jan-2023 | Single Pricer Theme issue
  },
};

export const stanhope: Theme = {
  name: 'stanhope',
  properties: {
    // common colors
    '--rm-popup':'#f7f8fc', // Added by AdilP for background @23-03-2023
    '--btn-disabled': 'rgb(241 166 65 / 75%)',// Added by AdilP for background @23-03-2023
    '--white': ' white',
    '--black': ' black',
    '--blue': '#0275cc',
    '--red': ' #ff4a6f',
    '--brown': ' #d97d54',
    '--light-brown': ' #f7d1c0',
    '--yellow': '#c7c782',
    '--green': '#21C747',
    '--gray': ' #676767',
    //'--light-gray': ' #f5f5f5',
    '--light-gray': ' #9d9b9b', //Added by AdilP @23-03-2023
    '--very-light-gray': ' #fafafa',
    '--very-dark-gray': ' #212121',
    '--dark-gray': ' #303030',
    '--light-dark-gray': ' #424242',
    '--border-tr': 'solid 1px #cbd5de',
    '--main-bg-color': '#F7F8FC',
    '--hover-wfl': '#7d7d7d61',
    '--navbar': ' #ffffff',
    '--navbar-main': ' #2e2f32',
    '--light-blue': '#4ac2ff87',
    '--dark-blue': '#0d445b',

    '--sidebar-li': '#D2D2D2',
    '--sidebar-li-active': '#D2D2D2',
    '--sidebar-bg':
      'linear-gradient(166deg, #092434 0%, #0D445B 48%, #092434 100%)',
    '--scroll-bar': '#b6b6b6',
    '--scroll-bar-hover': '#a4a4a4',
    '--active-sidebar': '#305667',

    '--profile-name': '#FFFFFF',
    // '--label': ' #3894D1',
    '--label': ' #f9a84f', //Added by AdilP @23-03-2023
    '--inline-label': '#0D445B',

    '--checkbox': ' #424242',
    '--checkbox-bg': ' #ffffff',
    '--portfolio-toggle-bg': '#303030',
    '--portfolio-toggle': '#959595',
    '--text': '#1A3343',
    '--text-color': '#1A3343',
    '--icons': ' #3894D1',
    '--icons-filter': 'grayscale(1) brightness(3)',
    '--active-icons-filter': 'invert(1)',
    '--calendar-filter': '',

    // '--headers': '#1A3343',
    '--headers': '#000000',  // Added by AdilP @23-03-2023
    '--containers': '#FFFFFF',
    '--containers-content': '#b6b6b7',
    '--box-content': ' #eeeeee',

    '--table-header-bg': '#eeeeee',
    '--table-header-text': '#000000',
    '--table-subheader-text': '#000000',
    '--table-row-odd': ' #f8f8f8',
    '--table-row-even': ' #e8e8e8',
    '--table-row-hovered': ' #d6d6d6',
    '--td': 'black',

    '--btn-bg': '#1a3863',// Yash A.
    '--btn-text': '#ffffff',// Yash A.

    '--input-bg': '#efefef',
    '--input-text': ' #000000',
     // '--input-border': '1px solid rgb(118, 118, 118)',
     '--input-border': '1px solid rgb(191 191 191)', // Added by AdilP @23-03-2023
    '--input-border-bottom': '1px solid rgb(191 191 191)',
    '--select-bg': '#efefef',
    '--select-text': '#000000',
    '--input-icon': 'grey',
    '--btn-hover-bg': '#2b5898',// Yash A.
    '--btn-hover-text': '#000000',

    '--btn-toggle-filter': ' brightness(1)',
    '--selected-btn-toggle-filter': ' brightness(0.3)',
    '--disabled': ' #a9a9a980',
    '--disabled-text': ' #a7a7a7',

    '--sidebar-handle': ' #a7a7a7',
    '--btn-border': ' #bebebe',
    '--btn-border-insurance': ' #cfcfcf',
    '--border': ' #cfcfcf',

    '--btn-border-bottom': ' 1px solid #000000',
    '--placeholder-text': ' #6c757d',

    '--header-line': '#D9D9D9',

    '--risk-rating-bg': ' #e2e2e2',

    '--shadow-buttons': ' 0 0.0625rem 0.1875rem rgba(0, 25, 40, 0.2)',

    '--links': '#0284e0',
    '--active': '#1a3863',// Yash A.
 '--active-bg': '#EC0000',
    '--default-bg': '#767676',
    '--active-bg-disabled': '#ababab',
    '--default-bg-disabled': '#ababab',
    '--footer-text': ' #343a40',

    '--calendar-icon':
      'url(' + environment.asseturl +'/calendar-grey.png)',
      '--exclamation-icon':
      'url(' + environment.asseturl + 'exclamation_red.png)',
    '--xls-icon':
      'url(' + environment.asseturl + 'xls-white.png)',
    '--pdf-icon':
      'url(' + environment.asseturl + 'pdf-white.png)',
    '--nav-header': '#0D445B',

    '--header-icon': '#ffffff',
    '--filter-button': '#0d445b',

    // misc
    '--container-box-shadow': ' 0px 0px 10px 4px rgba(0, 0, 0, 0.6)',
    '--box-shadow-thin':
      ' 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '--box-shadow-ccy':
      ' 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '--box-shadow':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-hovered':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-small':
      ' 0 1px 1px 0 rgba(66, 66, 66, 0.08), 0 1px 3px 1px rgba(66, 66, 66, 0.16)',

    // '--font-secondary': '"Montserrat", sans-serif',
    // '--font-primary': '"Open Sans", sans-serif',
    '--sidebar-line': '#9B9B9B',
    '--profile-icon':
      'url(' + environment.asseturl + 'user-blue.png)',
    '--setting-icon':
      'url(' + environment.asseturl + 'setting.png)',
    '--finiq-logo':
      'url('+ environment.asseturl +'/FinIQ_logo.png)',
    '--logout-icon':
      'url(' + environment.asseturl + 'logout.png)',
    '--sidebar-filter': 'brightness(0.2) invert(1)',
    '--ticker-bg': '#ffffff',
    '--theme-active': '#e0e0e0',
    '--theme-hover': '#ebebeb',
    '--content-header': '#0D445B',
    '--heading-label': '#696969',
    '--off-color': '#277ba1',
    '--cirp-header': '#394346',
    '--fx-line': '#dadada',
    '--fx-text': '#ffffff',
    '--fx-tile': '#0d445b',
    '--glass': '#ffffffe8',
    '--selected-box': '#faad3217',

    '--gap': '8px',
    '--neumorphic-down': 'none',
    '--neumorphic-up': 'none',
    '--input-height': '35px',
    '--neumorphic-disabled': 'none',
 
    '--checkbox-neo': 'none',
    '--neumorphic-sidebar': 'none',
    '--icon-active': '#1a3863',// Yash A.
    '--news-text': '#f7f7f7',
    '--tab-gap': '0px',
    '--tab-radius': 'none',
    '--border-tabs': '2px solid #1a3863',// Yash A.
    '--inactive-tab-border': '#cfcfcf',
    '--sub-container': '#ffffff',
    '--list-hover': '#7d7d7d36',
    '--domain-ip': window.location.protocol + '//' + window.location.host,
    '--setting-box': '#ffffff',
    '--10': 'calc(8px + (10 - 8) * ((100vw - 1200px) / (1920 - 1200)))',
    '--12': 'calc(11px + (12 - 11) * ((100vw - 1200px) / (1920 - 1200)))',
    '--14': 'calc(12px + (14 - 12) * ((100vw - 1200px) / (1920 - 1200)))',
    '--16': 'calc(14px + (16 - 14) * ((100vw - 1200px) / (1920 - 1200)))',
    '--20': 'calc(18px + (20 - 19) * ((100vw - 1200px) / (1920 - 1200)))',
    '--28': 'calc(24px + (28 - 24) * ((100vw - 1200px) / (1920 - 1200)))',
    '--sub-sidebar-color': '#0a3243',
    '--linkMovement': 'gray',
    '--linkQMovement': 'rgb(192, 40, 2)',
    '--calendar-bg':'#f5f5f5',
    '--week-strip':'#ec5043',
    //START || Added by SandipA || 06-Apr-23
    '--table-th' : '#1A3343',
    '--select-dropdown-bg': '#efefef',
    //END || Added by SandipA || 06-Apr-23
    //START || Added by Varsha G || 25-Mar-2023
    '--best-lp':'#f5f5f5',
    '--best-lp-shadow':'#ababab',
    '--submenu-active-color':'#bce4f6',
    '--date-bg-color':'#efefef',
    '--WFLabel-color':'#000000',
    '--queueCard-bg-color':'#efefef',
    '--calendar-bg-theme':'light',
    '--infoNote-bg-color':'#f8f8f8',
    '--infoNote-border':'#dddddd',
    '--tblTrigger-bg-color':'#fff',
    '--tblTrigger-border':'#ccc',
    '--container-hover':'#eaeaea',
    '--home-container':'#ffffff',
    '--queueCard-border-color':'#dadada',
    '--tabs-bg':'#eee',
    '--tabs-active':'#a9a9a980',
    '--tile-label':'#1a88b6',
    '--icon-delete-active':'#efefef',
    //END || Added by Varsha G || 25-Mar-2023
	  //'--date-bg-color':'#efefef', //For white theme
    '--progress-bar-border':'#cac2c2', // Added by AdilP 
    '--overlay-bg':'#b1aeadba',  //Added by AdilP
    // Added Workbench label color by AdilP @28-03-2023 || Start
    '--lbl-reverseConvertible':'#baa364e7',
    '--lbl-participation':'#7a5f1fbf',
    '--lbl-creditTranche':'#827332',
    '--lbl-ACC':'#887c53',
    '--lbl-DAC':'#726043',
    '--lbl-EQC':'hsl(38, 29%, 53%)',
    '--lbl-YE':'#7b5c32',
    '--bg-success':'#22d1aa',  //Added by Adil for progress bar
    '--view-popup-color' : '#ffffff', //Added by Jyoti S for Prev Quotes View Pricer Popup
    '--link-popup' : '#ffffff',//Added by Jyoti S for Prev Quotes View Pricer Popup
    '--table-data-ER-color' : '#ffffff',//Added by Jyoti S for Prev Quotes table data
    '--tbl-audtitrail-border': '#dbdbdb', //Added by Jyoti S for audti trail table border
    '--tbl-th-audit-trail' : '#ffffff', //Added by Jyoti S for audti trail table border
    '--date-active' : '#000000',//Added by Jyoti S for audti trail date filter active
    '--page-background' : '#ffffff',//Added by Jyoti S for Prev quotes accoordian
    '--ripple-color' : '#0d445b',//Added by Jyoti S for audti trail ripple effect
    '--select-product' : '#ffffff',//Added by Jyoti S for audti trail tooltip
    '--select-product-color' : '#000000',//Added by Jyoti S for audti trail tooltip
    '--tbl-prevquotes' : '#ffffff',//Added by Jyoti S for prev quotes table
    '--autocall-color': "#022e58", //Added by Jyoti S for quotes audit trail autocall icon
    '--disabled-tabs-color' : ' #cccccc', //Added by Jyoti S for previous quotes product tabs
    '--header' : '#000000',//Added by Jyoti S for Quotes Audit Trail
    //'--table-th' : '#98999A',//Added by Jyoti S for Quotes Audit Trail
    '--pricer-popup-color': "#000000", //Added by Jyoti S for previous quotes popup icon
    '--subscription-th' : '#1a3863',//Added by Jyoti S for Quotes Audit Trail
    

    // End
    '--card-bg-hover': 'linear-gradient(to right,#cdcdcd00 0%,#dad8d8 20%,#d4d3d3 40%,#dfdfdf 100%)',// Added by Sandip for card background hover effect @27-06-2023
    '--icon-active-bg': '#1a3863', // Added by SandipA for overlay background @05-07-2023
    '--dropdown-hover':'#cae1ff', //Added by AdilP || FIN1EURINT-584 || 29-08-2023
 
    // Added by RizwanS / ChaitanyaM :: Start || Instant Pricer || HSBCFXEINT-9 || 08-Nov-2023
    //-----------------------------------------------------------//
    '--smallDiv-bg': '#FFFFFF',
    '--price-btn': '#283C83 ',
    '--price-text': '#FFFFFF ',
    '--pricer-tbl-bg': '#D4D8E6',
    '--pricer-text': '#283C83',
    '--select-bk': '#737a9c',
    '--option-bg': '#FFFFFF',
    '--popup-bk': '#f2f2f2',
    '--popup-box-shadow': '#b5b5b5',
    '--popup-border': '#c7c6c6',
    '--pair-box-shadow': '#c1c1c1',
    '--input-disabled': '#D4D8E6',
    '--scroll-bg': '#d7ddf3',
    '--scroll-bg-color': '#808080',
    '--tile-bg': '#f2f2f2',
    '--switch-bg-sell': '#d4d8e6',
    '--span-bg': '#e7e7e7',
    '--shadow-head': '#f1eeee',
    '--border-chk': '#000',
    '--product-bg': '#ffffff',
    '--aqdq-bg': '#ffffff',
    '--box-inner-bg': '#f2f2f2',
    '--li-hover-bg': '#ffffff',
    '--popup-border-bg': '#f1f1f1',
    '--ELN-bg': '#e1dddd',
    '--crudShadow': '#181818',
    '--btn-color': '#FFFFFF',
    '--select-disabled': '#d4d8e6',
    '--switch-selction-bg': '#dfd8e6',
    '--nav-btn-bg': '#A2A7BC',
    '--btn-pricegrid-disabled-ip':'#D4D8E6',
    '--pricer-grid-bg-ip':'#D4D8E6',
    '--bestprice-style-bg-ip':'#07825E',
    '--btn-disabled-text-ip':'#666666',
    '--pricetext-color-ip':'#1A3343',
    '--Tilebg-color-ip': '#ffffff',    
    '--timer-text':'#737A9B',
    '--switch-select-bg':'#d4d8e5', 
    '--filter-maple': 'invert(1%) sepia(50%) saturate(6280%) hue-rotate(205deg) brightness(56%) contrast(96%)',
    '--action-icon-maple': 'invert(100%) sepia(100%) saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%)',
    '--action-icon-maple-hover': 'invert(50%) sepia(101%) saturate(1050%) hue-rotate(193deg) brightness(38%) contrast(100%)',
    '--action-drawer':'#fff',
    '--action-drawer-border':'#162258',
    '--rfq-text':'#162258',
    '--advYes':'#000', 
    '--advNo':'red', 
    '--btnfilter_IP':'invert(242%) sepia(93%) saturate(50%) hue-rotate(284deg) brightness(150%) contrast(350%)', 
    '--dialogboxbgIP' : '#f7f7f7', 
    '--shdwdialogboxbgIP' : '#A2A7BC',
    '--templatenamebg-IP' : '#283e80',
    '--templatenamebghover-IP' : '#A2A7BC',
    '--tempplatetext-IP' : '#283C83',
    '--orderDetailsmsg':"#283e80 ", 
    '--rfqtextFXD-ip': "#FFF", 
    '--rfqtextEQC-ip': "#FFF", 
    '--Buy_DirectionFXD-ip' : "#07825E", 
    '--Sell_DirectionFXD-ip' : "#CB2C30", 
    '--orderHeader-bottomline-color-IP':'#283C83', 
    '--select-bg-ip': '#C1C7E1', 
     '--calendar-icon-filter': 'invert(10%) sepia(72%) saturate(1429%) hue-rotate(210deg) brightness(56%) contrast(145%)',
     '--icon-header': '#1a3863', // HSBCFXEINT-8 | Chaitanya M  | 12 Dec 2023
    // Added by RizwanS / ChaitanyaM :: END || Instant Pricer || HSBCFXEINT-9 || 08-Nov-2023
    //-----------------------------------------------------------//


     '--card-bg': '#efefef', //Added by Urmila A | 30-Aug-23 | FXD pricing containers
     '--notificationsPopUpBG' : "#e0e0e0",//Added by Jyoti S || 06-Sept-2023
     '--calendar-prev-dates' : '#efefef', //Added by Apurva K|| 06-Sep-2023
     '--tilebgcolor' : '#f5fafb', //Added by Apurva K|| 04-Sep-2023
     '--page-title-hr' : '#0D445B', //Added by Apurva K|| 07-Sep-2023
     //Added by AdilP for galxy pages theme wise || Start || 07-09-2023
    '--link-div':'#eeeeee',
    '--layout-inner-container':'rgb(180, 180, 180)',
 '--sub-header-lcm':'rgb(180, 180, 180)',
 '--link-select':'#0f455a',
    '--tile-1': 'rgb(67, 94, 190)',
    '--tile-2': 'rgb(6, 146, 143)',
    '--tile-3': 'rgb(254, 147, 39)',
    '--tile-4': 'rgb(255, 202, 51)',
    //Added by AdilP for galxy pages theme wise || End
    '--active-date' : "#b5d4ff", // Added by Jyoti S || 05-Oct-2023 || SP Event  Calendar




    //Added by RajeshC || UCP Light Theme || 25-Oct-2023 || 31-10-2023
    '--mainDEBGColor' : '#FFFFFF',
    '--customtabheaderbackgroundcolor' : '#f5f5f5', //Added by RajeshC || 11-Oct-2023 || custom Tab header color
    '--customtabHeaderBGColor' : '#f5f5f5',
    '--ucp-mat-select-clr':'#444444',
    '--ucp-disbled': '#EFEFEF',
    '--mat-inputspan': '#444444',
    '--customtabHeaderColor' : '#1A3863',
    '--wflButtonsBGColor' : '#4444', 
    '--wflButtonsTxtColor' : '#4444',
    '--ucp-customtabuttons': '#748DB5',
     //Added by RajeshC || 25-10-2023
     '--readOnlyBGColor' : '#F5F5F5',  
     '--ucp-table-header-bg':'#F5f5f5',
     '--ucp-th-font':'#1A3863',
     '--ucp-enabled': '#f5f5f5',
     '--ucp-input-clr': '#000000',
     '--ucp-input-bg': '#f5f5f5',
     '--ucp-opposite': 'black',
     '--ucp-btn-bg': '#f5f5f5',
     '--ucp-panel-bg': 'white',
     '--mat-date-text-color' : '#000000', //Added  by RajeshC || 25-10-2023 





     '--table-border-bottom':'#CECECE', //Added by RajeshC || 11-Oct-2023 || custom Tab Border Bottom
     //'--ucp-disbled': '#666666',
     //DEEDF24D
     '--customTabGridButton': '#FF8B00',
     '--dropdown-arrow':'#706b6b',
     //'--readOnlyBGColor' : '#2e2e2e',
     '--readOnlyValueColor' : '#979595',
     '--staticbuttonBGcolor' : '#FF8B00',
     '--staticbuttontxtcolor' : '#ffffff',
     '--matselectedBGcolor':'#F5F5F5', //Added by RajeshC || 25-10-2023
     '--chartheadertextcolor':'#b6b6b6',
     '--selectedValInSearchCompBGClr' : '#666666', 
     '--searchCompBGClr' : '#000000', 
     '--searchCompHeaderBGClr' : '#000000',
     '--calenderBGClr' : '#262626',
     '--calenderSelectedCircleBGClr' : '#ffffff',
     '--radiobuttoncolor' : '#b6b6b6',
     '--input-focus':'#000000',
     '--ucp-neumorphic-down': 'inset 0px 0px 0px #1c1c1c, inset 0px 0px 0px #2a2a2a',
     '--ucp-neumorphic-up': '0px 0px 0px #191919, 0px 0px 0px #2e2e2e',
     //'--ucp-enabled':'#333333',
     '--ucp-btn-text': '#000000',
     //'--ucp-btn-bg': '#323232',
     '--ucp-button-neumorphic-up': '0px 2px 2px #080808, 0px 2px 2px #2f2f2f',
     '--ucp-draft-btn' : '2px 0px 0px #F4A460, 0px 4px 6px #F4A460',
     '--ucp-save-btn' : '2px 0px 0px #FFA500, 0px 4px 6px #FFA500',
     '--ucp-reprice-btn' : '2px 0px 0px #BDB76B, 0px 4px 6px #BDB76B',
     '--ucp-clear-btn' : '2px 0px 0px #BEE2F5, 0px 4px 6px #BEE2F5',
     '--ucp-simulation-btn' : '2px 0px 0px #DDA0DD, 0px 4px 6px #DDA0DD',
     '--topMarginInput': '-0.55em',
     '--matInputBGColor' : '#333333',
     '--dateLeftPadding':'1px',
     '--dateRightPadding':'15px',
     '--border-color':'rgb(116, 115, 115)',
     //'--ucp-th-font':'#FF8B00',
     '--even-row':'#f5f5f547',
     '--odd-row': '#f5f5f547',
     '--font-color':'#ffffff',
     '--text-blue': '#87CEEB',
     //'--ucp-input-bg': '#333333',
     //'--ucp-input-clr': '#bdbdbd',
     //'--ucp-opposite': 'white',
     '--ucp-same':'black',
     //'--ucp-table-header-bg':'#444444',
     '--ucp-btn-text-clr':'black',
     '--ucp-checkbox-bg':'#F5F5F5', //Added by RajeshC || 25-10-2023
     '--ucp-checkbox':'#6e6e6e',
     '--mat-select-arrow':'rgba(189, 189, 189, 0.54)',
      '--linear-grad1':'#000',
     '--linear-grad2':'#ABABAB',
     '--linear-grad3':'#2C2C2C',
     '--ucp-text-color':'#FFFFFF',

     //Added by RajeshC || 31-10-2023
     '--staticmattxtcolor' : 'black', 
     '--label-color':'#1A3863', 








  },
};

export const neu_light: Theme = {
  name: 'neu_light',
  properties: {
    // common colors
    '--white': ' white',
    '--black': ' black',
    '--blue': '#0275cc',
    '--red': ' #ff4a6f',
    '--brown': ' #d97d54',
    '--yellow': '#c7c782',
    '--light-brown': ' #f7d1c0',
    '--green': '#21C747',
    '--gray': '#676767',
    '--light-gray': ' #f5f5f5',
    '--very-light-gray': ' #fafafa',
    '--very-dark-gray': ' #212121',
    '--dark-gray': ' #303030',
    '--light-dark-gray': ' #424242',
    '--border-tr': 'solid 1px #cbd5de',
    '--main-bg-color': '#f2f2f2',
    '--hover-wfl': '#7d7d7d61',
    '--navbar': ' #ffffff',
    '--navbar-main': ' #2e2f32',
    '--light-blue': '#4ac2ff87',
    '--dark-blue': '#0d445b',

    '--sidebar-li': '#D2D2D2',
    '--sidebar-li-active': '#D2D2D2',
    '--sidebar-bg':
      'linear-gradient(166deg, #092434 0%, #0D445B 48%, #092434 100%)',
    '--scroll-bar': '#b6b6b6',
    '--scroll-bar-hover': '#a4a4a4',
    '--active-sidebar': 'transparent',

    '--profile-name': '#FFFFFF',
    '--label': ' #0f455a',  //Added by AdilP @30-03-2023
    '--inline-label': '#0D445B',

    '--checkbox': ' #424242',
    '--checkbox-bg': ' #ffffff',
    '--portfolio-toggle-bg': '#303030',
    '--portfolio-toggle': '#959595',
    '--text': '#1A3343',
    '--text-color': '#1A3343',
    '--icons': ' #3894D1',
    '--icons-filter': 'grayscale(1) brightness(3)',
    '--active-icons-filter': 'invert(1)',
    '--calendar-filter': '',

    '--headers': '#1A3343',
    '--containers': '#f2f2f2',
    '--containers-content': '#b6b6b7',
    '--box-content': ' #eeeeee',
    '--btn-toggle-filter': ' brightness(1)',
    '--selected-btn-toggle-filter': ' brightness(0.3)',
    '--table-header-bg': '#eeeeee',
    '--table-header-text': '#000000',
    '--table-subheader-text': '#000000',
    '--table-row-odd': ' #f8f8f8',
    '--table-row-even': ' #e8e8e8',
    '--table-row-hovered': ' #d6d6d6',
    '--td': 'black',

    '--btn-bg': '#FAAD32',
    '--btn-text': '#000000',

    '--input-bg': '#f2f2f2',
    '--input-text': '#0d445b',
    '--input-border': '1px none transparent',
    '--input-border-bottom': '1px none transparent',
    '--select-bg': '#f2f2f2',
    '--select-text': '#0d445b',
    '--input-icon': 'grey',
    //'--btn-hover-bg': '#f2f2f2',
    '--btn-hover-bg': '#faa015',//Added by SandipA @11-04-23
    '--btn-hover-text': '#0d445b',

    '--disabled': ' #a9a9a980',
    '--disabled-text': ' #a7a7a7',
    //Added by AdilP @29-03-2023
    '--btn-disabled': 'rgb(241 166 65 / 75%)',
    '--bt-disabled-text':'#a7a7a7',

    '--sidebar-handle': ' #a7a7a7',
    '--btn-border': '#a7a7a7', //Added by AdilP @31-03-2023
    '--btn-border-insurance': ' #cfcfcf',
    '--border': ' #cfcfcf',

    '--btn-border-bottom': ' 1px solid #000000',
    '--placeholder-text': ' #6c757d',

    '--header-line': '#D9D9D9',

    '--risk-rating-bg': ' #e2e2e2',

    '--shadow-buttons': ' 0 0.0625rem 0.1875rem rgba(0, 25, 40, 0.2)',

    '--links': '#0284e0',
    '--active': '#FAAD32',
    '--active-bg': '#EC0000',
    '--default-bg': '#767676',
    '--active-bg-disabled': '#ababab',
    '--default-bg-disabled': '#ababab',
    '--footer-text': ' #343a40',

    '--calendar-icon':
      'url(' + environment.asseturl + 'calendar-grey.png)',
      '--exclamation-icon':
      'url(' + environment.asseturl + 'exclamation_red.png)',
    '--xls-icon':
      'url(' + environment.asseturl + 'xls-white.png)',
    '--pdf-icon':
      'url(' + environment.asseturl + 'pdf-white.png)',
    '--nav-header': '#0D445B',

    '--header-icon': '#ffffff',
    '--filter-button': '#0d445b',

    // misc
    '--container-box-shadow': ' 0px 0px 10px 4px rgba(0, 0, 0, 0.6)',
     '--box-shadow-thin': ' 10px 7px 7px #d0d0d0, -5px -1px 6px #ffffff', //changed by AdilP for NeuLight Theme @30-03-2023
    '--box-shadow-ccy': 'none',
    '--box-shadow':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-hovered':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-small':
      ' 0 1px 1px 0 rgba(66, 66, 66, 0.08), 0 1px 3px 1px rgba(66, 66, 66, 0.16)',

    // '--font-secondary': '"Montserrat", sans-serif',
    // '--font-primary': '"Open Sans", sans-serif',
    '--sidebar-line': '#9B9B9B',
    '--profile-icon':
      'url(' + environment.asseturl + 'user-blue.png)',
    '--setting-icon':
      'url(' + environment.asseturl + 'setting.png)',
    '--finiq-logo':
      'url('+ environment.asseturl +'/FinIQ_logo.png)',
    '--logout-icon':
      'url(' + environment.asseturl + 'logout.png)',
    '--sidebar-filter': 'brightness(0.2) invert(1)',
    '--ticker-bg': '#ffffff',
    '--theme-active': '#e0e0e0',
    '--theme-hover': '#ebebeb',
    '--content-header': '#0D445B',
    '--heading-label': '#696969',
    '--off-color': '#0D445B',
    '--cirp-header': '#394346',
    '--fx-line': '#dadada',
    '--fx-text': '#ffffff',
    '--fx-tile': '#0d445b',
    '--glass': '#ffffffe8',
    '--selected-box': '#f2f2f2',

    '--gap': '20px',
    '--neumorphic-down':
      'inset 5px 5px 5px #d0d0d0, inset -5px -5px 5px #ffffff',
    '--neumorphic-up': ' 5px 5px 6px #d0d0d0, -5px -5px 6px #ffffff',
    '--input-height': '35px',
    '--neumorphic-disabled':
      'inset 4px 4px 7px #dfdfdf, inset -4px -4px 7px #ffffff',
   
    '--checkbox-neo': 'inset 2px 2px 3px #d4d5d9, inset -2px -2px 3px #ffffff',
    '--neumorphic-sidebar':
      'inset 4px 4px 7px #082a38, inset -4px -4px 7px #125e7e',
    '--icon-active': '#FAAD32',
    '--news-text': '#f7f7f7',
    '--tab-gap': '20px',
    '--tab-radius': '4px',
    '--border-tabs': 'none',
    '--inactive-tab-border': 'none',
    '--sub-container': '#ffffff',
    '--list-hover': '#7d7d7d36',
    '--domain-ip': window.location.protocol + '//' + window.location.host,
    '--setting-box': '#ffffff',
    '--10': 'calc(8px + (10 - 8) * ((100vw - 1200px) / (1920 - 1200)))',
    '--12': 'calc(11px + (12 - 11) * ((100vw - 1200px) / (1920 - 1200)))',
    '--14': 'calc(12px + (14 - 12) * ((100vw - 1200px) / (1920 - 1200)))',
    '--16': 'calc(14px + (16 - 14) * ((100vw - 1200px) / (1920 - 1200)))',
    '--20': 'calc(18px + (20 - 19) * ((100vw - 1200px) / (1920 - 1200)))',
    '--28': 'calc(24px + (28 - 24) * ((100vw - 1200px) / (1920 - 1200)))',
    '--sub-sidebar-color': '#141414',

    '--linkMovement': 'gray',
    '--linkQMovement': 'rgb(192, 40, 2)',
    '--calendar-bg':'#f5f5f5',
    '--week-strip':'#ec5043',
    //START || Added by Varsha G || 25-Mar-2023
    '--best-lp':'#f5f5f5',
    '--submenu-active-color':'#0D445B',
    '--WFLabel-color':'#000000',
    '--queueCard-bg-color':'#efefef',
    '--calendar-bg-theme':'light',
    '--infoNote-bg-color':'#f8f8f8',
    '--infoNote-border':'#dddddd',
    '--tblTrigger-bg-color':'#fff',
    '--tblTrigger-border':'#ccc',
    '--container-hover':'#ffffff',
    '--queueCard-border-color':'#dadada',
    '--tile-label':'#0f455a',
    //END || Added by Varsha G || 25-Mar-2023
    '--rm-popup':'#f7f8fc', /* Added by AdilP for background @23-03-2023 */
    // Added Workbench label color by AdilP @28-03-2023
    '--lbl-reverseConvertible':'#baa364e7',
    '--lbl-participation':'#7a5f1fbf',
    '--lbl-creditTranche':'#827332',
    '--lbl-ACC':'#887c53',
    '--lbl-DAC':'#726043',
    '--lbl-EQC':'hsl(38, 29%, 53%)',
    '--lbl-YE':'#7b5c32',
    '--bg-success':'#22d1aa',  //Added by Adil for progress bar
    '--date-bg-color':'#f2f2f2', //For neu white theme
    '--view-popup-color' : '#ffffff', //Added by Jyoti S for Prev Quotes View Pricer Popup
    '--link-popup' : '#ffffff',//Added by Jyoti S for Prev Quotes View Pricer Popup
    '--table-data-ER-color' : '#ffffff',//Added by Jyoti S for Prev Quotes table data
    '--tbl-audtitrail-border': '#dbdbdb', //Added by Jyoti S for audti trail table border
    '--tbl-th-audit-trail' : '#ffffff', //Added by Jyoti S for audti trail table border
    '--date-active' : '#000000',//Added by Jyoti S for audti trail date filter active
    '--page-background' : '#ffffff',//Added by Jyoti S for Prev quotes accoordian
    '--ripple-color' : '#0d445b',//Added by Jyoti S for audti trail ripple effect
    '--select-product' : '#ffffff',//Added by Jyoti S for audti trail tooltip
    '--select-product-color' : '#000000',//Added by Jyoti S for audti trail tooltip
    '--tbl-prevquotes' : '#ffffff',//Added by Jyoti S for prev quotes table
    '--autocall-color': "#172647", //Added by Jyoti S for quotes audit trail autocall icon
    '--disabled-tabs-color' : ' #cccccc', //Added by Jyoti S for previous quotes product tabs
    '--header' : '#000000',//Added by Jyoti S for Quotes Audit Trail
    //'--table-th' : '#98999A',//Added by Jyoti S for Quotes Audit Trail
    '--pricer-popup-color': "#000000", //Added by Jyoti S for previous quotes popup icon
    
    //START || Added by SandipA || 11-Apr-23
    '--table-th' : '#1A3343',
    '--select-dropdown-bg': '#efefef',
    //END || Added by SandipA || 11-Apr-23
    '--icon-active-bg': '#1a3863', // Added by SandipA for overlay background @05-07-2023
    '--dropdown-hover':'#cae1ff', //Added by AdilP || FIN1EURINT-584 || 29-08-2023

    // Added by RizwanS / ChaitanyaM :: Start || Instant Pricer || HSBCFXEINT-9 || 08-Nov-2023
    //-----------------------------------------------------------//
    '--smallDiv-bg': '#FFFFFF',
    '--price-btn': '#283C83 ',
    '--price-text': '#FFFFFF ',
    '--pricer-tbl-bg': '#D4D8E6',
    '--pricer-text': '#283C83',
    '--select-bk': '#737a9c',
    '--option-bg': '#FFFFFF',
    '--popup-bk': '#f2f2f2',
    '--popup-box-shadow': '#b5b5b5',
    '--popup-border': '#c7c6c6',
    '--pair-box-shadow': '#c1c1c1',
    '--input-disabled': '#D4D8E6',
    '--scroll-bg': '#d7ddf3',
    '--scroll-bg-color': '#808080',
    '--tile-bg': '#f2f2f2',
    '--switch-bg-sell': '#d4d8e6',
    '--span-bg': '#e7e7e7',
    '--shadow-head': '#f1eeee',
    '--border-chk': '#000',
    '--product-bg': '#ffffff',
    '--aqdq-bg': '#ffffff',
    '--box-inner-bg': '#f2f2f2',
    '--li-hover-bg': '#ffffff',
    '--popup-border-bg': '#f1f1f1',
    '--ELN-bg': '#e1dddd',
    '--crudShadow': '#181818',
    '--btn-color': '#FFFFFF',
    '--select-disabled': '#d4d8e6',
    '--switch-selction-bg': '#ff9800', 
    '--nav-btn-bg': '#283C83',
    '--btn-pricegrid-disabled-ip':'#D4D8E6',
    '--pricer-grid-bg-ip':'#D4D8E6',
    '--bestprice-style-bg-ip':'#07825E',
    '--btn-disabled-text-ip':'#666666',
    '--pricetext-color-ip':'#1A3343',
    '--Tilebg-color-ip': '#ffffff',  
    '--timer-text':'#737A9B',
    '--calendar-icon-filter': 'brightness(0) saturate(100%) invert(63%) sepia(82%) saturate(410%) hue-rotate(353deg) brightness(97%) contrast(96%)',
    '--icon-header': '#FAAD32', // HSBCFXEINT-8 | Chaitanya M  | 12 Dec 2023
    // Added by RizwanS / ChaitanyaM :: END || Instant Pricer || HSBCFXEINT-9 ||  08-Nov-2023
    //-----------------------------------------------------------//

     '--notificationsPopUpBG' : "#e0e0e0",//Added by Jyoti S || 06-Sept-2023
     '--calendar-prev-dates' : '#efefef', //Added by Apurva K|| 06-Sep-2023
     '--tilebgcolor' : '#f5fafb', //Added by Apurva K|| 04-Sep-2023
     '--mail': '#77a5e3', //Urmila A | 14-sep-23
     //END
     //Added by AdilP for galxy pages theme wise || Start || 07-09-2023
 '--link-select':'#ea0010',
 '--link-div':'#eeeeee',
 '--layout-inner-container':'rgb(180, 180, 180)',
 '--sub-header-lcm':'rgb(180, 180, 180)',
    '--tile-1': 'rgb(67, 94, 190)',
    '--tile-2': 'rgb(6, 146, 143)',
    '--tile-3': 'rgb(254, 147, 39)',
    '--tile-4': 'rgb(255, 202, 51)',
 //Added by AdilP for galxy pages theme wise || End
     //END
  },
};

export const midnight: Theme = {
  name: 'midnight',
  properties: {
    // common colors
    '--white': ' white',
    '--black': ' black',
    '--blue': '#0275cc',
    '--red': ' #ff4a6f',
    '--brown': ' #d97d54',
    '--yellow': '#c7c782',
    '--light-brown': ' #f7d1c0',
    '--green': '#21C747',
    '--gray': ' #676767',
    '--light-gray': ' #97979b',  //changed by AdilP for Midnight theme @28-03-2023
    '--very-light-gray': ' #fafafa',
    '--very-dark-gray': ' #212121',
    '--dark-gray': ' #303030',
    '--light-dark-gray': ' #424242',
    '--border-tr': 'solid 1px #cbd5de',
    '--main-bg-color': '#F7F8FC',
    '--hover-wfl': '#7d7d7d61',
    '--navbar': ' #ffffff',
    '--navbar-main': ' #2e2f32',

    '--sidebar-li': '#D2D2D2',
    '--sidebar-li-active': '#D2D2D2',
    '--sidebar-bg':
      'linear-gradient(166deg, #151D3B 0%, #37446E 51%, #141C3A 100%)',
    '--scroll-bar': ' #b6b6b6',
    '--scroll-bar-hover': '#a4a4a4',
    '--active-sidebar': '#313d65',
    '--light-blue': '#4ac2ff87',
    '--dark-blue': '#0d445b',

    '--profile-name': '#FFFFFF',
    '--label': ' #3894D1',
    '--inline-label': '#0D445B',
    '--btn-toggle-filter': ' brightness(0.3)',
    '--selected-btn-toggle-filter': ' brightness(1)',
    '--checkbox': ' #424242',
    '--checkbox-bg': ' #ffffff',
    '--portfolio-toggle-bg': '#303030',
    '--portfolio-toggle': '#959595',
    '--text': '#172647',
    '--text-color': '#172647',
    '--icons': ' #3894D1',
    '--icons-filter': 'grayscale(1) brightness(3)',
    '--active-icons-filter': 'invert(1)',
    '--calendar-filter': '',

    '--headers': '#172647',
    '--containers': '#FFFFFF',
    '--containers-content': '#b6b6b7',
    '--box-content': ' #eeeeee',

    '--table-header-bg': '#eeeeee',
    '--table-header-text': '#000000',
    '--table-subheader-text': '#000000',
    '--table-row-odd': ' #f8f8f8',
    '--table-row-even': ' #e8e8e8',
    '--table-row-hovered': ' #d6d6d6',
    '--td': 'black',

    '--btn-bg': '#748DB5',
    '--btn-text': '#ffffff',
    //added by AdilP for Disabled button
    '--btn-disabled': '#8591a3',
    '--bt-disabled-text':'#a7a7a7',

    '--input-bg': '#efefef',
    '--input-text': ' #000000',
    '--input-border': '1px solid #848fa3',
    '--input-border-bottom': '1px solid #848fa3',
    '--select-bg': '#efefef',
    '--select-text': '#000000',
    '--input-icon': 'grey',
    '--btn-hover-bg': '#728cb7',
    '--btn-hover-text': '#ffffff',

    '--disabled': '#b5b5b585',
    '--disabled-text': ' #a7a7a7',

    '--sidebar-handle': ' #a7a7a7',
    '--btn-border': ' #bebebe',
    '--btn-border-insurance': ' #cfcfcf',
    '--border': ' #cfcfcf',

    '--btn-border-bottom': ' 1px solid #000000',
    '--placeholder-text': ' #6c757d',

    '--header-line': '#D9D9D9',

    '--risk-rating-bg': ' #e2e2e2',

    '--shadow-buttons': ' 0 0.0625rem 0.1875rem rgba(0, 25, 40, 0.2)',

    '--links': '#0d9bc6', //Added by AdilP For Midnight theme @28-03-2023
    '--active': '#748DB5',
    '--active-bg': '#EC0000',
    '--default-bg': '#767676',
    '--active-bg-disabled': '#ababab',
    '--default-bg-disabled': '#ababab',
    '--footer-text': ' #343a40',

    '--calendar-icon':
      'url(' + environment.asseturl + 'calendar-grey.png)',
      '--exclamation-icon':
      'url(' + environment.asseturl + 'exclamation_red.png)',
    '--xls-icon':
      'url(' + environment.asseturl + 'xls-white.png)',
    '--pdf-icon':
      'url(' + environment.asseturl + 'pdf-white.png)',
    '--nav-header': '#172647',

    '--header-icon': '#ffffff',

    // misc
    '--container-box-shadow': ' 0px 0px 10px 4px rgba(0, 0, 0, 0.6)',
    '--box-shadow-thin':
      ' 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '--box-shadow-ccy':
      ' 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '--box-shadow':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-hovered':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-small':
      ' 0 1px 1px 0 rgba(66, 66, 66, 0.08), 0 1px 3px 1px rgba(66, 66, 66, 0.16)',

    // '--font-secondary': '"Open Sans", sans-serif',
    // '--font-primary': '"Open Sans", sans-serif',
    '--sidebar-line': '#9B9B9B',
    '--profile-icon':
      'url(' + environment.asseturl + 'user-blue.png)',
    '--setting-icon':
      'url(' + environment.asseturl + 'setting.png)',
    '--finiq-logo':
      'url('+ environment.asseturl +'/FinIQ_logo.png)',
    '--logout-icon':
      'url(' + environment.asseturl + 'logout.png)',
    '--sidebar-filter': 'brightness(0.2) invert(1)',
    '--ticker-bg': '#ffffff',
    '--theme-active': '#e0e0e0',
    '--theme-hover': '#ebebeb',
    '--content-header': '#172647',
    '--heading-label': '#696969',
    '--off-color': '#9ca4c9',
    '--cirp-header': '#394346',
    '--fx-line': '#dadada',
    '--fx-text': '#ffffff',
    '--filter-button': '#323e66',
    '--fx-tile': '#f7f7f7',
    '--glass': '#ffffffe8',
    '--selected-box': '#748db563',

    '--gap': '8px',
    '--neumorphic-down': 'none',
    '--neumorphic-up': 'none',
    '--input-height': '35px',
    '--neumorphic-disabled': 'none',
    '--checkbox-neo': 'none',
    '--neumorphic-sidebar': 'none',
    '--icon-active': '#748DB5',
    '--news-text': '#f7f7f7',
    '--tab-gap': '0px',
    '--tab-radius': 'none',
    '--border-tabs': '2px solid #748DB5',
    '--inactive-tab-border': '#cfcfcf',
    '--sub-container': '#ffffff',
    '--list-hover': '#7d7d7d36',
    '--domain-ip': window.location.protocol + '//' + window.location.host,
    '--setting-box': '#ffffff',
    '--10': 'calc(8px + (10 - 8) * ((100vw - 1200px) / (1920 - 1200)))',
    '--12': 'calc(11px + (12 - 11) * ((100vw - 1200px) / (1920 - 1200)))',
    '--14': 'calc(12px + (14 - 12) * ((100vw - 1200px) / (1920 - 1200)))',
    '--16': 'calc(14px + (16 - 14) * ((100vw - 1200px) / (1920 - 1200)))',
    '--20': 'calc(18px + (20 - 19) * ((100vw - 1200px) / (1920 - 1200)))',
    '--28': 'calc(24px + (28 - 24) * ((100vw - 1200px) / (1920 - 1200)))',
    '--sub-sidebar-color': '#2b3555',
    '--linkMovement': 'gray',
    '--linkQMovement': 'rgb(192, 40, 2)',
    '--calendar-bg': '#f5f5f5',
    '--week-strip':'#ec5043',
    //START || Added by Varsha G || 25-Mar-2023
    '--best-lp':'#f5f5f5',
    '--best-lp-shadow':'#ababab',
    '--submenu-active-color':'#9ca4c9',
    '--date-bg-color':'#efefef',
    '--WFLabel-color':'#000000',
    '--queueCard-bg-color':'#efefef',
    '--calendar-bg-theme':'light',
    '--infoNote-bg-color':'#f8f8f8',
    '--infoNote-border':'#dddddd',
    '--tblTrigger-bg-color':'#fff',
    '--tblTrigger-border':'#ccc',
    '--container-hover':'#eaeaea',
    '--home-container':'#ffffff',
    '--queueCard-border-color':'#dadada',
    '--tile-label':'#6581d9',
    '--tabs-bg':'#eee',
    '--tabs-active':'#a9a9a980',
    '--icon-delete-active':'#efefef',
    //END || Added by Varsha G || 25-Mar-2023
	
	// Added Workbench label color by AdilP @28-03-2023
    '--lbl-reverseConvertible':'#4783b2', 
    '--lbl-participation':'#53697a',
    '--lbl-creditTranche':'#7991a7', 
    '--lbl-ACC':'#505878',
    '--lbl-DAC':'#0f56b6',
    '--lbl-EQC':'#6182b0', 
    '--lbl-YE':'#24569a',
    //'--date-bg-color':'#efefef',  //For midnight theme
    '--rm-popup':'#eaeaeb', 
    '--bg-success':'#3446e0',  //Added by Adil for progress bar
    '--view-popup-color' : '#ffffff', //Added by Jyoti S for Prev Quotes View Pricer Popup
    '--link-popup' : '#ffffff',//Added by Jyoti S for Prev Quotes View Pricer Popup
    '--table-data-ER-color' : '#ffffff',//Added by Jyoti S for Prev Quotes table data
    '--tbl-audtitrail-border': '#dbdbdb', //Added by Jyoti S for audti trail table border
    '--tbl-th-audit-trail' : '#ffffff', //Added by Jyoti S for audti trail table border
    '--date-active' : '#000000',//Added by Jyoti S for audti trail date filter active
    '--page-background' : '#ffffff',//Added by Jyoti S for Prev quotes accoordian
    '--ripple-color' : '#0d445b',//Added by Jyoti S for audti trail ripple effect
    '--select-product' : '#ffffff',//Added by Jyoti S for audti trail tooltip
    '--select-product-color' : '#000000',//Added by Jyoti S for audti trail tooltip
    '--tbl-prevquotes' : '#ffffff',//Added by Jyoti S for prev quotes table
    '--autocall-color': "#172647", //Added by Jyoti S for quotes audit trail autocall icon
    '--disabled-tabs-color' : ' #cccccc', //Added by Jyoti S for previous quotes product tabs
    '--header' : '#000000',//Added by Jyoti S for Quotes Audit Trail
    //'--table-th' : '#98999A',//Added by Jyoti S for Quotes Audit Trail
    '--pricer-popup-color': "#000000", //Added by Jyoti S for previous quotes popup icon
    //START || Added by SandipA || 11-Apr-23
    '--table-th' : '#1A3343',
    '--select-dropdown-bg': '#efefef',
    //END || Added by SandipA || 11-Apr-23
    '--card-bg-hover': 'linear-gradient(to right,#cdcdcd00 0%,#dad8d8 20%,#d4d3d3 40%,#dfdfdf 100%)',// Added by Sandip for card background hover effect @27-06-2023
    '--icon-active-bg': '#42507a', // Added by SandipA for overlay background @05-07-2023

    '--card-bg': '#efefef', //Urmila A | 30-Aug-23| FXD Pricing containers
    '--notificationsPopUpBG' : "#e0e0e0",//Added by Jyoti S || 06-Sept-2023
    '--calendar-prev-dates' : '#efefef', //Added by Apurva K|| 06-Sep-2023
    '--tilebgcolor' : '#f5fafb', //Added by Apurva K|| 04-Sep-2023
    '--page-title-hr' : '#172647', //Added by Apurva K|| 07-Sep-2023
    '--mail': '#77a5e3', //Urmila A | 14-sep-23
    '--active-date' : "#ccdffa", // Added by Jyoti S || 05-Oct-2023 || SP Event  Calendar
    //Added by AdilP for galxy pages theme wise || Start || 07-09-2023
    '--link-select': '#000000',
    '--link-div': '#1d4662',
    '--layout-inner-container': 'rgb(180, 180, 180)',
    '--sub-header-lcm': 'rgb(180, 180, 180)',
    '--tile-1': 'rgb(67, 94, 190)',
    '--tile-2': 'rgb(6, 146, 143)',
    '--tile-3': 'rgb(254, 147, 39)',
    '--tile-4': 'rgb(255, 202, 51)',
    //Added by AdilP for galxy pages theme wise || End
     //Added by RajeshC || UCP Midnight Theme || 13-Oct-2023 || 31-Oct-2023
     '--mainDEBGColor' : '#FFFFFF',
     '--customtabheaderbackgroundcolor' : '#f5f5f5', //Added by RajeshC || 11-Oct-2023 || custom Tab header color
     '--customtabHeaderBGColor' : '#f5f5f5',
     '--ucp-mat-select-clr':'#444444',
     '--ucp-disbled': '#EFEFEF',
     '--mat-inputspan': '#444444',
     '--customtabHeaderColor' : '#748DB5', //Added by RajeshC  31-Oct-2023
     '--wflButtonsBGColor' : '#4444', 
     '--wflButtonsTxtColor' : '#4444',
     '--ucp-customtabuttons': '#748DB5',

      //Added by RajeshC || 25-10-2023 || 31-10-2023
     '--readOnlyBGColor' : '#F5F5F5',  
     '--ucp-table-header-bg':'#F5f5f5',
     '--ucp-th-font':'#1A3863',
     '--ucp-enabled': '#f5f5f5',
     '--ucp-input-clr': '#000000',
     '--ucp-input-bg': '#f5f5f5',
     '--ucp-opposite': 'black',
     '--ucp-btn-bg': '#f5f5f5',
     '--ucp-panel-bg': 'white',
     '--mat-date-text-color' : '#000000', //Added  by RajeshC || 25-10-2023 
     '--table-border-bottom':'#848fa3', //Added by RajeshC || 11-Oct-2023 || custom Tab Border Bottom
     //'--ucp-disbled': '#666666',
     //DEEDF24D
     '--customTabGridButton': '#FF8B00',
     '--dropdown-arrow':'#706b6b',
     //Commented by RajeshC || 31-10-2023
    // '--readOnlyBGColor' : '#2e2e2e',
     '--readOnlyValueColor' : '#979595',
     '--staticbuttonBGcolor' : '#FF8B00',
     '--staticbuttontxtcolor' : '#ffffff',
     '--matselectedBGcolor':'#F5F5F5', //Added by RajeshC || 31-10-2023
     '--chartheadertextcolor':'#b6b6b6',
     '--selectedValInSearchCompBGClr' : '#666666', 
     '--searchCompBGClr' : '#000000', 
     '--searchCompHeaderBGClr' : '#000000',
     '--calenderBGClr' : '#262626',
     '--calenderSelectedCircleBGClr' : '#ffffff',
     '--radiobuttoncolor' : '#b6b6b6',
     '--input-focus':'#000000',
     '--ucp-neumorphic-down': 'inset 0px 0px 0px #1c1c1c, inset 0px 0px 0px #2a2a2a',
     '--ucp-neumorphic-up': '0px 0px 0px #191919, 0px 0px 0px #2e2e2e',
      //Commented by RajeshC || 31-10-2023
    // '--ucp-enabled':'#333333',
     '--ucp-btn-text': '#000000',
    // '--ucp-btn-bg': '#323232', Commented by RajeshC || 31-10-2023
     '--ucp-button-neumorphic-up': '0px 2px 2px #080808, 0px 2px 2px #2f2f2f',
     '--ucp-draft-btn' : '2px 0px 0px #F4A460, 0px 4px 6px #F4A460',
     '--ucp-save-btn' : '2px 0px 0px #FFA500, 0px 4px 6px #FFA500',
     '--ucp-reprice-btn' : '2px 0px 0px #BDB76B, 0px 4px 6px #BDB76B',
     '--ucp-clear-btn' : '2px 0px 0px #BEE2F5, 0px 4px 6px #BEE2F5',
     '--ucp-simulation-btn' : '2px 0px 0px #DDA0DD, 0px 4px 6px #DDA0DD',
     '--topMarginInput': '-0.55em',
     '--matInputBGColor' : '#333333',
     '--dateLeftPadding':'1px',
     '--dateRightPadding':'15px',
     '--border-color':'rgb(116, 115, 115)',
      //Commented by RajeshC || 31-10-2023
    // '--ucp-th-font':'#FF8B00',
    //Added by RajeshC || 31-10-2023
     '--even-row':'#F5F5F547',
     '--odd-row': '#F5F5F547',
     '--font-color':'#ffffff',
     '--text-blue': '#87CEEB',
     //Commented by RajeshC || 31-10-2023
    // '--ucp-input-bg': '#333333',
    // '--ucp-input-clr': '#bdbdbd',
    // '--ucp-opposite': 'white',
     '--ucp-same':'black',
    // '--ucp-table-header-bg':'#444444',
     '--ucp-btn-text-clr':'black',
     '--ucp-checkbox-bg':'#f5f5f5', //Added by RajeshC || 31-10-2023
     '--ucp-checkbox':'#6e6e6e',
     '--mat-select-arrow':'rgba(189, 189, 189, 0.54)',
      '--linear-grad1':'#000',
     '--linear-grad2':'#ABABAB',
     '--linear-grad3':'#2C2C2C',
     '--ucp-text-color':'#FFFFFF',
     //Added by RajeshC || labelColor || 31-10-2023
     '--label-color':'#1A3863', 
     '--staticmattxtcolor' : 'black',

    // Added by RizwanS / ChaitanyaM :: Start || Instant Pricer || HSBCFXEINT-9 ||  08-Nov-2023
    //-----------------------------------------------------------//
    '--smallDiv-bg': '#FFFFFF',
    '--price-btn': '#283C83 ',
    '--price-text': '#FFFFFF ',
    '--pricer-tbl-bg': '#D4D8E6',
    '--pricer-text': '#283C83',
    '--select-bk': '#737a9c',
    '--option-bg': '#FFFFFF',
    '--popup-bk': '#f2f2f2',
    '--popup-box-shadow': '#b5b5b5',
    '--popup-border': '#c7c6c6',
    '--pair-box-shadow': '#c1c1c1',
    '--input-disabled': '#D4D8E6',
    '--scroll-bg': '#d7ddf3',
    '--scroll-bg-color': '#808080',
    '--tile-bg': '#f2f2f2',
    '--switch-bg-sell': '#d4d8e6',
    '--span-bg': '#e7e7e7',
    '--shadow-head': '#f1eeee',
    '--border-chk': '#000',
    '--product-bg': '#ffffff',
    '--aqdq-bg': '#ffffff',
    '--box-inner-bg': '#f2f2f2',
    '--li-hover-bg': '#ffffff',
    '--popup-border-bg': '#f1f1f1',
    '--ELN-bg': '#e1dddd',
    '--crudShadow': '#181818',
    '--btn-color': '#FFFFFF',
    '--select-disabled': '#d4d8e6',
    '--switch-selction-bg': '#dfd8e6',
    '--nav-btn-bg': '#A2A7BC',
    '--btn-pricegrid-disabled-ip':'#D4D8E6',
    '--pricer-grid-bg-ip':'#D4D8E6',
    '--bestprice-style-bg-ip':'#07825E',
    '--btn-disabled-text-ip':'#666666',
    '--pricetext-color-ip':'#1A3343',
    '--Tilebg-color-ip': '#ffffff',    
    '--timer-text':'#737A9B',
    '--switch-select-bg':'#d4d8e5', 
    '--filter-maple': 'invert(1%) sepia(50%) saturate(6280%) hue-rotate(205deg) brightness(56%) contrast(96%)',
    '--action-icon-maple': 'invert(100%) sepia(100%) saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%)',
    '--action-icon-maple-hover': 'invert(50%) sepia(101%) saturate(1050%) hue-rotate(193deg) brightness(38%) contrast(100%)',
    '--action-drawer':'#fff',
    '--action-drawer-border':'#162258',
    '--rfq-text':'#162258',
    '--advYes':'#000', 
    '--advNo':'red', 
    '--btnfilter_IP':'invert(242%) sepia(93%) saturate(50%) hue-rotate(284deg) brightness(150%) contrast(350%)', 
    '--dialogboxbgIP' : '#f7f7f7', 
    '--shdwdialogboxbgIP' : '#A2A7BC',
    '--templatenamebg-IP' : '#283e80',
    '--templatenamebghover-IP' : '#A2A7BC',
    '--tempplatetext-IP' : '#283C83',
    '--orderDetailsmsg':"#283e80 ", 
    '--rfqtextFXD-ip': "#FFF", 
    '--rfqtextEQC-ip': "#FFF", 
    '--Buy_DirectionFXD-ip' : "#07825E", 
    '--Sell_DirectionFXD-ip' : "#CB2C30", 
    '--orderHeader-bottomline-color-IP':'#283C83', 
    '--select-bg-ip': '#C1C7E1',
    '--calendar-icon-filter': 'invert(10%) sepia(72%) saturate(1429%) hue-rotate(210deg) brightness(56%) contrast(145%)',
    '--icon-header': '#748DB5', // HSBCFXEINT-8 | Chaitanya M  | 12 Dec 2023
    // Added by RizwanS / ChaitanyaM :: End || Instant Pricer || HSBCFXEINT-9 ||  08-Nov-2023
    //-----------------------------------------------------------//

  },
};

export const coral: Theme = {
  name: 'coral',
  properties: {
    // common colors
    '--white': ' white',
    '--black': ' black',
    '--blue': '#0275cc',
    '--red': ' #d23f31',
    '--brown': ' #d97d54',
    '--yellow': '#c7c782',
    '--light-brown': ' #f7d1c0',
    '--green': ' #0f9d55',
    '--gray': ' #676767',
    '--light-gray': ' #bea9a9', //changed by AdilP
    '--very-light-gray': ' #fafafa',
    '--very-dark-gray': ' #212121',
    '--dark-gray': ' #303030',
    '--light-dark-gray': ' #424242',
    '--border-tr': 'solid 1px #cbd5de',
    '--main-bg-color': ' #ffffff',
    '--hover-wfl': '#7d7d7d61',
    '--navbar': ' #ffffff',
    '--navbar-main': ' #2e2f32',
    '--light-blue': '#4ac2ff87',
    '--dark-blue': '#0d445b',
    '--sidebar-li': '#ffffff',
    '--sidebar-li-active': '#ffffff',
    '--sidebar-bg':
      'url(' + environment.asseturl + 'coral-bg.png)',
    '--scroll-bar': '#b6b6b6',
    '--scroll-bar-hover': '#a4a4a4',
    '--active-sidebar': '#ff8383',

    '--profile-name': ' #1a4269',
    '--label': ' #eb4f47', //Added by AdilP @28-03-2023
    '--inline-label': '#000000',
    '--rm-popup':'#f9f6f6',  // Added by AdilP @23-03-2023 

    '--checkbox': ' #424242',
    '--checkbox-bg': ' #ffffff',
    '--text': '#4E4E4E',
    '--text-color': '#4E4E4E',
    '--icons': ' #1261a0',
    '--icons-filter': 'brightness(0) invert(1)',
    '--active-icons-filter': 'brightness(0) invert(1)',
    '--calendar-filter': '',

    '--headers': '#4E4E4E',
    '--containers': ' #ffffff',
    '--containers-content': '#b6b6b7',

    '--box-content': ' #eeeeee',
    '--btn-toggle-filter': ' brightness(1)',
    '--selected-btn-toggle-filter': ' brightness(0.3)',
    '--table-header-bg': '#eeeeee',
    '--table-header-text': '#000000',
    '--table-subheader-text': '#000000',
    '--table-row-odd': ' #f8f8f8',
    '--table-row-even': ' #e8e8e8',
    '--table-row-hovered': ' #d6d6d6',
    '--td': 'black',

    '--btn-bg': '#ec5043',
    '--btn-text': ' #ffffff',

    '--input-bg': '#f5f5f5',
    '--input-text': ' #000000',
    '--input-border': '1px solid rgb(118, 118, 118)',
    '--input-border-bottom': '1px solid rgb(118, 118, 118)',
    '--select-bg': '#f5f5f5',
    '--select-text': '#000000',
    '--input-icon': 'grey',
    '--btn-hover-bg': '#f57f76',
    '--btn-hover-text': ' #ffffff',

    //changed by AdilP @29-03-2023
    '--disabled': '#e3dad9',
    '--disabled-text': ' #a7a7a7',
    //added by AdilP for Disabled button
    '--btn-disabled': '#bda1a0 ',
    '--bt-disabled-text':'#937676',

    '--sidebar-handle': ' #a7a7a7',
    '--btn-border': ' #bebebe',
    '--btn-border-insurance': ' #cfcfcf',
    '--border': ' #cfcfcf',

    '--btn-border-bottom': ' 1px solid #000000',
    '--placeholder-text': ' #6c757d',

    '--header-line': '#D9D9D9',

    '--risk-rating-bg': ' #e2e2e2',

    '--shadow-buttons': ' 0 0.0625rem 0.1875rem rgba(0, 25, 40, 0.2)',

    '--links': '#0284e0',
    '--active': '#ec5043',

    '--active-bg': '#EC0000',
    '--default-bg': '#767676',
    '--active-bg-disabled': '#ababab',
    '--default-bg-disabled': '#ababab',

    '--footer-text': ' #343a40',
    '--calendar-icon':
      'url(' + environment.asseturl + 'calendar-grey.png)',
      '--exclamation-icon':
      'url(' + environment.asseturl + 'exclamation_red.png)',
    '--xls-icon':
      'url(' + environment.asseturl + 'xls.png)',
    '--pdf-icon':
      'url(' + environment.asseturl + 'pdf.png)',

    '--portfolio-toggle-bg': '#ffffff',
    '--portfolio-toggle': '#234567',
    '--nav-header': '#EC5043',
    '--header-icon': '#fff',

    // misc
    '--container-box-shadow': ' 0px 0px 10px 4px rgba(0, 0, 0, 0.6)',
    '--box-shadow-thin':
      ' 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '--box-shadow-ccy':
      ' 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '--box-shadow':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-hovered':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-small':
      ' 0 1px 1px 0 rgba(66, 66, 66, 0.08), 0 1px 3px 1px rgba(66, 66, 66, 0.16)',

    // '--font-secondary': '"Montserrat", sans-serif',
    // '--font-primary': '"Open Sans", sans-serif',
    '--sidebar-line': '#f4f4f4',
    '--profile-icon':
      'url(' + environment.asseturl + 'user-blue.png)',
    '--setting-icon':
      'url(' + environment.asseturl + 'setting.png)',
    '--finiq-logo':
      'url('+ environment.asseturl +'/FinIQ_logo.png)',
    '--logout-icon':
      'url(' + environment.asseturl + 'logout.png)',
    '--sidebar-filter': 'brightness(0.2) invert(1)',
    '--ticker-bg': '#ffffff',
    '--theme-active': '#e0e0e0',
    '--theme-hover': '#ebebeb',
    '--content-header': '#EC5043',
    '--heading-label': '#696969',
    '--off-color': '#140000',
    '--cirp-header': '#394346',
    '--fx-line': '#dadada',
    '--fx-text': '#ffffff',
    '--filter-button': '#ff665f',
    '--fx-tile': '#f7f7f7',
    '--glass': '#ffffffe8',
    '--selected-box': '#beb3a354',

    '--gap': '8px',
    '--neumorphic-down': 'none',
    '--neumorphic-up': 'none',
    '--input-height': '35px',
    '--neumorphic-disabled': 'none',
   
    '--checkbox-neo': 'none',
    '--icon-active': '#ec5043',
    '--news-text': '#f7f7f7',
    '--tab-gap': '0px',
    '--tab-radius': 'none',
    '--border-tabs': '2px solid #ec5043',
    '--inactive-tab-border': '#cfcfcf',
    '--sub-container': '#ffffff',
    '--list-hover': '#7d7d7d36',
    '--domain-ip': window.location.protocol + '//' + window.location.host,
    '--setting-box': '#ffffff',
    '--10': 'calc(8px + (10 - 8) * ((100vw - 1200px) / (1920 - 1200)))',
    '--12': 'calc(11px + (12 - 11) * ((100vw - 1200px) / (1920 - 1200)))',
    '--14': 'calc(12px + (14 - 12) * ((100vw - 1200px) / (1920 - 1200)))',
    '--16': 'calc(14px + (16 - 14) * ((100vw - 1200px) / (1920 - 1200)))',
    '--20': 'calc(18px + (20 - 19) * ((100vw - 1200px) / (1920 - 1200)))',
    '--28': 'calc(24px + (28 - 24) * ((100vw - 1200px) / (1920 - 1200)))',
    '--sub-sidebar-color': '#f35e57',
    '--linkMovement': 'gray',
    '--linkQMovement': 'rgb(192, 40, 2)',
    '--calendar-bg': '#f5f5f5',
    '--week-strip':'#ec5043',
    //START || Added by Varsha G || 25-Mar-2023
    '--best-lp':'#f5f5f5',
    '--best-lp-shadow':'#ababab',
    '--submenu-active-color':'#fba6a7',
    '--date-bg-color':'#efefef',
    '--WFLabel-color':'#000000',
    '--queueCard-bg-color':'#efefef',
    '--infoNote-bg-color':'#f8f8f8',
    '--infoNote-border':'#dddddd',
    '--tblTrigger-bg-color':'#fff',
    '--tblTrigger-border':'#ccc',
    '--container-hover':'#eaeaea',
    '--home-container':'#ffffff',//attachment details popup
    '--queueCard-border-color':'#dadada',
    '--tabs-bg':'#eee',
    '--tile-label':'#eb4f47',
    '--tabs-active':'#a9a9a980',
    '--icon-delete-active':'#e3dad9',
    //END || Added by Varsha G || 25-Mar-2023
	// Added Workbench label color by AdilP @28-03-2023
    '--lbl-reverseConvertible':'#baa364e7',
    '--lbl-participation':'#db5a5d',
    '--lbl-creditTranche':'#f96973',
    '--lbl-ACC':'#ef6f7a',
    '--lbl-DAC':'#e76d7c',
    '--lbl-EQC':'#f1596c',
    '--lbl-YE':'#8f4046',
    '--bg-success':'#cd820d',  //Added by Adil for progress bar
    '--pricer-popup-color': "#000000", //Added by Jyoti S for previous quotes popup icon
    //START || Added by SandipA || 11-Apr-23
    '--table-th' : '#1A3343',
    '--select-dropdown-bg': '#efefef',
    //END || Added by SandipA || 11-Apr-23
    '--view-popup-color' : '#ffffff', //Added by Jyoti S for Prev Quotes View Pricer Popup
    '--link-popup' : '#ffffff',//Added by Jyoti S for Prev Quotes View Pricer Popup
    '--table-data-ER-color' : '#ffffff',//Added by Jyoti S for Prev Quotes table data
    '--tbl-audtitrail-border': '#dbdbdb', //Added by Jyoti S for audti trail table border
    '--tbl-th-audit-trail' : '#ffffff', //Added by Jyoti S for audti trail table border
    '--date-active' : '#000000',//Added by Jyoti S for audti trail date filter active
    '--page-background' : '#ffffff',//Added by Jyoti S for Prev quotes accoordian
    '--ripple-color' : '#0d445b',//Added by Jyoti S for audti trail ripple effect
    '--select-product' : '#ffffff',//Added by Jyoti S for audti trail tooltip
    '--select-product-color' : '#000000',//Added by Jyoti S for audti trail tooltip
    '--tbl-prevquotes' : '#ffffff',//Added by Jyoti S for prev quotes table
    '--autocall-color': "#022e58", //Added by Jyoti S for quotes audit trail autocall icon
    '--disabled-tabs-color' : ' #cccccc', //Added by Jyoti S for previous quotes product tabs
    '--header' : '#000000',//Added by Jyoti S for Quotes Audit Trail
    //'--table-th' : '#98999A',//Added by Jyoti S for Quotes Audit Trail
    '--subscription-th' : '#555555',//Added by Jyoti S for Quotes Audit Trail
    '--card-bg-hover': 'linear-gradient(to right,#cdcdcd00 0%,#dad8d8 20%,#d4d3d3 40%,#dfdfdf 100%)',// Added by Sandip for card background hover effect @27-06-2023
    '--icon-active-bg': '#af615f', // Added by SandipA for overlay background @05-07-2023
    '--dropdown-hover':'#cae1ff', //Added by AdilP || FIN1EURINT-584 || 29-08-2023
    '--notificationsPopUpBG' : "#e0e0e0",//Added by Jyoti S || 06-Sept-2023
    '--calendar-prev-dates' : '#efefef', //Added by Apurva K|| 06-Sep-2023
    '--tilebgcolor' : '#f5fafb', //Added by Apurva K|| 04-Sep-2023
    '--page-title-hr' : '#EC5043', //Added by Apurva K|| 07-Sep-2023
    '--mail': '#77a5e3', //Urmila A | 14-Sep-23
     //Added by AdilP for galxy pages theme wise || Start || 07-09-2023
 '--link-select':'#ea0010',
 '--link-div':'#eeeeee',
 '--layout-inner-container':'rgb(180, 180, 180)',
 '--sub-header-lcm':'rgb(180, 180, 180)',
    '--tile-1': '#ff4b4b',
    '--tile-2': '#ff0b0b',
    '--tile-3': '#921919',
    '--tile-4': '#6b1c1f',
 //Added by AdilP for galxy pages theme wise || End
 '--active-date' : "#ffd6d7", // Added by Jyoti S || 05-Oct-2023 || SP Event  Calendar
    //Added by RajeshC || UCP Coral Theme || 11-Oct-2023
    '--mainDEBGColor' : '#FFFFFF',
    '--customtabheaderbackgroundcolor' : '#f5f5f5', //Added by RajeshC || 11-Oct-2023 || custom Tab header color
    '--customtabHeaderBGColor' : '#f5f5f5',
    '--ucp-mat-select-clr':'#444444',
    '--ucp-disbled': '#EFEFEF',
    '--mat-inputspan': '#444444',
    '--customtabHeaderColor' : '#ec5043', //Added by RajeshC || 31-10-2023
    '--wflButtonsBGColor' : '#4444', 
    '--wflButtonsTxtColor' : '#4444',
    '--ucp-customtabuttons': '#ffb3b3',
    '--label-color':'#EC5043', //Added by RajeshC || 25-10-2023 || 31-10-2023
    //Added by RajeshC || 25-10-2023 || 31-10-2023
    '--readOnlyBGColor' : '#F5F5F5',  
    '--ucp-table-header-bg':'#F5f5f5',
    '--ucp-th-font':'#EC0000',
    '--ucp-enabled': '#f5f5f5',
    '--ucp-input-clr': '#000000',
    '--ucp-input-bg': '#f5f5f5',
    '--ucp-opposite': 'black',
    '--ucp-btn-bg': '#f5f5f5',
    '--ucp-panel-bg': 'white',
    '--staticmattxtcolor' : 'black', //Added by RajeshC || 31-10-2023


    '--table-border-bottom':'#CECECE', //Added by RajeshC || 11-Oct-2023 || custom Tab Border Bottom
    //'--ucp-disbled': '#666666',
    //DEEDF24D
    '--customTabGridButton': '#FF8B00',
    '--dropdown-arrow':'#706b6b',
    //'--readOnlyBGColor' : '#2e2e2e', Commented by RajeshC || 31-10-2023
    '--readOnlyValueColor' : '#979595',
    '--staticbuttonBGcolor' : '#FF8B00',
    '--staticbuttontxtcolor' : '#ffffff',
    // '--matselectedBGcolor':'#2e2e2e',
    '--matselectedBGcolor':'rgb(222 237 242 / 30%)', //Added by RajeshC || 31-10-2023
    '--chartheadertextcolor':'#b6b6b6',
    '--selectedValInSearchCompBGClr' : '#666666', 
    '--searchCompBGClr' : '#000000', 
    '--searchCompHeaderBGClr' : '#000000',
    '--calenderBGClr' : '#262626',
    '--calenderSelectedCircleBGClr' : '#ffffff',
    '--radiobuttoncolor' : '#b6b6b6',
    '--input-focus':'#000000',
    '--ucp-neumorphic-down': 'inset 0px 0px 0px #1c1c1c, inset 0px 0px 0px #2a2a2a',
    '--ucp-neumorphic-up': '0px 0px 0px #191919, 0px 0px 0px #2e2e2e',
    //'--ucp-enabled':'#333333',Commented by RajeshC || 31-10-2023
    '--ucp-btn-text': '#000000',
    //'--ucp-btn-bg': '#323232',Commented by RajeshC || 31-10-2023
    '--ucp-button-neumorphic-up': '0px 2px 2px #080808, 0px 2px 2px #2f2f2f',
    '--ucp-draft-btn' : '2px 0px 0px #F4A460, 0px 4px 6px #F4A460',
    '--ucp-save-btn' : '2px 0px 0px #FFA500, 0px 4px 6px #FFA500',
    '--ucp-reprice-btn' : '2px 0px 0px #BDB76B, 0px 4px 6px #BDB76B',
    '--ucp-clear-btn' : '2px 0px 0px #BEE2F5, 0px 4px 6px #BEE2F5',
    '--ucp-simulation-btn' : '2px 0px 0px #DDA0DD, 0px 4px 6px #DDA0DD',
    '--topMarginInput': '-0.55em',
    '--matInputBGColor' : '#333333',
    '--dateLeftPadding':'1px',
    '--dateRightPadding':'15px',
    '--border-color':'rgb(116, 115, 115)',
    //'--ucp-th-font':'#FF8B00', Commented by RajeshC || 31-10-2023
    //Added by RajeshC || ProductSchedule
    '--even-row':'#f5f5f547',
    '--odd-row': '#f5f5f547',
    '--font-color':'#ffffff',
    '--text-blue': '#87CEEB',
//Commented by RajeshC || 31-10-2023
    //'--ucp-input-bg': '#333333',
    //'--ucp-input-clr': '#bdbdbd',
    //'--ucp-opposite': 'white',
    '--ucp-same':'black',
    //'--ucp-table-header-bg':'#444444', Commented by RajeshC || 31-10-2023
    '--ucp-btn-text-clr':'black',
    // '--ucp-checkbox-bg':'#ffffff',
    '--ucp-checkbox-bg':'#f5f5f5', //Added by RajeshC || 31-10-2023
    '--ucp-checkbox':'#6e6e6e',
    '--mat-select-arrow':'rgba(189, 189, 189, 0.54)',
     '--linear-grad1':'#000',
    '--linear-grad2':'#ABABAB',
    '--linear-grad3':'#2C2C2C',
    '--ucp-text-color':'#FFFFFF',

    // Added by RizwanS / ChaitanyaM :: Start || Instant Pricer || HSBCFXEINT-9 || 08-Nov-2023
    //-----------------------------------------------------------//
    '--smallDiv-bg': '#FFFFFF',
    '--price-btn': '#283C83 ',
    '--price-text': '#FFFFFF ',
    '--pricer-text': '#283C83',
    '--select-bk': '#737a9c',
    '--option-bg': '#FFFFFF',
    '--popup-bk': '#f2f2f2',
    '--popup-box-shadow': '#b5b5b5',
    '--popup-border': '#c7c6c6',
    '--pair-box-shadow': '#c1c1c1',
    '--input-disabled': '#D4D8E6',
    '--scroll-bg': '#d7ddf3',
    '--scroll-bg-color': '#808080',
    '--tile-bg': '#f2f2f2',
    '--switch-bg-sell': '#d4d8e6',
    '--span-bg': '#e7e7e7',
    '--shadow-head': '#f1eeee',
    '--border-chk': '#000',
    '--aqdq-bg': '#ffffff',
    '--box-inner-bg': '#f2f2f2',
    '--li-hover-bg': '#ffffff',
    '--popup-border-bg': '#f1f1f1',
    '--ELN-bg': '#e1dddd',
    '--crudShadow': '#181818',
    '--btn-color': '#FFFFFF',
    '--select-disabled': '#d4d8e6',
    '--switch-selction-bg': '#dfd8e6',
    '--btn-pricegrid-disabled-ip':'#D4D8E6',
    '--bestprice-style-bg-ip':'#07825E',
    '--btn-disabled-text-ip':'#666666',
    '--pricetext-color-ip':'#1A3343',
    '--Tilebg-color-ip': '#ffffff',    
    '--timer-text':'#737A9B',
    '--switch-select-bg':'#d4d8e5', 
    '--filter-maple': 'invert(1%) sepia(50%) saturate(6280%) hue-rotate(205deg) brightness(56%) contrast(96%)',
    '--action-icon-maple': 'invert(100%) sepia(100%) saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%)',
    '--action-icon-maple-hover': 'invert(50%) sepia(101%) saturate(1050%) hue-rotate(193deg) brightness(38%) contrast(100%)',
    '--action-drawer':'#fff',
    '--action-drawer-border':'#162258',
    '--rfq-text':'#162258',
    '--advYes':'#000', 
    '--advNo':'red', 
    '--btnfilter_IP':'invert(242%) sepia(93%) saturate(50%) hue-rotate(284deg) brightness(150%) contrast(350%)', 
    '--dialogboxbgIP' : '#f7f7f7', 
    '--shdwdialogboxbgIP' : '#A2A7BC',
    '--templatenamebg-IP' : '#283e80',
    '--templatenamebghover-IP' : '#A2A7BC',
    '--tempplatetext-IP' : '#283C83',
    '--orderDetailsmsg':"#283e80 ", 
    '--rfqtextFXD-ip': "#FFF", 
    '--rfqtextEQC-ip': "#FFF", 
    '--Buy_DirectionFXD-ip' : "#07825E", 
    '--Sell_DirectionFXD-ip' : "#CB2C30", 
    '--orderHeader-bottomline-color-IP':'#283C83', 
    '--select-bg-ip': '#C1C7E1',
    '--product-bg': '#ffffff',
    '--calendar-icon-filter': 'brightness(0) saturate(100%) invert(40%) sepia(80%) saturate(2182%) hue-rotate(335deg) brightness(96%) contrast(92%)',
    '--icon-header': '#ec5043', // HSBCFXEINT-8 | Chaitanya M  | 12 Dec 2023
    // Added by RizwanS / ChaitanyaM :: End || Instant Pricer || HSBCFXEINT-9 || 08-Nov-2023
    //-----------------------------------------------------------//
    '--card-bg': '#efefef', // Added by ChaitanyaM | 23-Jan-2023 | Single Pricer Theme issue

  },
};

export const BankTheme_1: Theme = {
  name: 'BankTheme_1',
  properties: { 
    // common colors
    '--white': '#FFFFFF',
    '--black': '#000000',
    '--blue': '#EC0000',
    '--red': '#EC0000',
    '--brown':'#CC0000',
    '--yellow': '#EC0000',
    '--light-brown': '#990000',
    '--green': '#9BC3D3',
    
    '--gray': '#CCCCCC',
    '--light-gray': '#CCCCCC', //changed by AdilP
    '--very-light-gray': '#F0F0F0',
    '--very-dark-gray': '#222222',
    '--dark-gray': '#444444',
    '--light-dark-gray': '#CCCCCC',
    
    '--border-tr': 'solid 1px var(--border-color)',
    '--main-bg-color': '#FFFFFF',
    '--hover-wfl': '#7d7d7d61',
    '--navbar': '#FFFFFF',
    '--navbar-main': '#EC0000',
    '--light-blue': '#4ac2ff87',
    '--dark-blue': '#0d445b', 

    '--scroll-bar': '#b6b6b6',
    '--scroll-bar-hover': '#a4a4a4',

    '--sidebar-li': '#444444', 
    '--sidebar-bg':'#FFFFFF',//'url(' + environment.asseturl + 'SidebarBG.png) #EC0000',  
      //'url(' + environment.asseturl + 'coral-bg.png)',      
    '--active-sidebar': '#FFFFFF',
    '--sidebar-li-active': '#EC0000',
    '--sidebar-handle': '#FFFFFF',
    '--submenu-active-color':'#EC0000',

    '--icons': '#EC0000',
    '--icons-filter': 'invert(8%) sepia(97%) saturate(6905%) hue-rotate(2deg) brightness(101%) contrast(130%)',
    '--active-icons-filter': 'invert(8%) sepia(97%) saturate(6905%) hue-rotate(2deg) brightness(101%) contrast(130%)',
    '--calendar-filter': 'invert(85%) sepia(16%) saturate(527%) hue-rotate(157deg) brightness(87%) contrast(90%)',

    '--filterDiv':'#FFFFFF',
   '--filter-border':'#CCCCCC',
    '--profile-name': ' #1a4269',
    '--label': ' #eb4f47', //Added by AdilP @28-03-2023
    '--inline-label': '#000000',
    '--rm-popup':'#f9f6f6',  // Added by AdilP @23-03-2023 

    '--checkbox': '#EC0000',
    '--checkbox-bg': '#FFFFFF',
    '--text': '#444444',
    '--text-color': '#444444',
    '--slider-bg': '#257fa4',    
    '--slider--pointer-bg': '#257fa4', 
    '--slider-border-color': '#FFFFFF',
    '--toggle-pointer-bg':'#999999',
    '--toggle-pointer-bg-checked':'#257fa4', 

    '--headers': '#EC0000',
    '--containers': '#f6fafc',
    '--containers-content': '#444444',

    '--box-content': ' #eeeeee',
    '--btn-toggle-filter': ' brightness(1)',
    '--selected-btn-toggle-filter': ' brightness(0.3)',
    '--table-header-bg': '#EC0000',
    '--table-header-text': '#FFFFFF',
    '--table-subheader-text': '#FFFFFF',
    '--table-row-odd': ' #f8f8f8',
    '--table-row-even': ' #e8e8e8',
    '--table-row-hovered': ' #d6d6d6',
    '--td': '#000000',

    '--btn-bg': '#EC0000',
    '--btn-text': '#FFFFFF',

    '--input-bg': 'rgb(222 237 242 / 30%)',
    '--input-text': '#000000',
    '--input-border': '1px solid rgb(222 237 242 / 30%)',
    '--input-border-bottom': '2px solid #9BC3D3',
    '--input-radius' : '4px 4px 0px 0px;',
    '--select-bg': 'rgb(222 237 242 / 30%)',
    '--select-text': '#000000',
    '--input-icon': '#9BC3D3',
    '--btn-hover-bg': '#f57f76',
    '--btn-hover-text': ' #ffffff',

    //changed by AdilP @29-03-2023
    '--disabled': '#e3dad9',
    '--disabled-text': ' #a7a7a7',
    //added by AdilP for Disabled button
    '--btn-disabled': '#bda1a0 ',
    '--bt-disabled-text':'#937676',

    
    '--btn-border': ' #cfcfcf',//Updated by ShekharL@06-Sep-2023
    '--btn-border-insurance': ' #cfcfcf',
    '--border': ' #cfcfcf',//Updated by ShekharL@06-Sep-2023

    '--btn-border-bottom': ' 1px solid  #cfcfcf',//Updated by ShekharL@06-Sep-2023
    '--placeholder-text': ' #6c757d',

    '--header-line': '#D9D9D9',

    '--risk-rating-bg': ' #e2e2e2',

    '--shadow-buttons': ' 0 0.0625rem 0.1875rem rgba(0, 25, 40, 0.2)',

    '--links': '#EC0000',
    '--links-hover': '#990000',
    '--active': '#ec0000',
    '--active-bg': '#EC0000',
    '--default-bg': '#767676',
    '--active-bg-disabled': '#ababab',
    '--default-bg-disabled': '#ababab',

    '--footer-text': ' #343a40',
    '--calendar-icon':
      'url(' + environment.asseturl + 'calendar-grey.png)',
    '--xls-icon':
      'url(' + environment.asseturl + 'xls.png)',
    '--pdf-icon':
      'url(' + environment.asseturl + 'pdf.png)',

    '--portfolio-toggle-bg': '#ffffff',
    '--portfolio-toggle': '#234567',
    '--nav-header': '#EC0000',
    '--header-icon': '#fff',

    // misc
    '--container-box-shadow': ' 0px 0px 10px 4px rgba(0, 0, 0, 0.6)',
    '--box-shadow-thin':
      ' 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '--box-shadow-ccy':
      ' 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '--box-shadow':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-hovered':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-small':
      ' 0 1px 1px 0 rgba(66, 66, 66, 0.08), 0 1px 3px 1px rgba(66, 66, 66, 0.16)',

    // '--font-secondary': '"Montserrat", sans-serif',
    // '--font-primary': '"Open Sans", sans-serif',
    '--sidebar-line': '#f4f4f4',
    '--profile-icon':
      'url(' + environment.asseturl + 'user-blue.png)',
    '--setting-icon':
      'url(' + environment.asseturl + 'setting.png)',
    '--finiq-logo':
      'url('+ environment.asseturl +'/FinIQ_logo.png)',
    '--logout-icon':
      'url(' + environment.asseturl + 'logout.png)',
    '--sidebar-filter': 'invert(8%) sepia(97%) saturate(6905%) hue-rotate(2deg) brightness(101%) contrast(130%)',
    '--ticker-bg': '#ffffff',
    '--theme-active': '#e0e0e0',
    '--theme-hover': '#ebebeb',
    '--content-header': '#EC0000',
    '--heading-label': '#696969',
    '--off-color': '#140000',
    '--cirp-header': '#394346',
    '--fx-line': '#dadada',
    '--fx-text': '#ffffff',
    '--filter-button': '#ff665f',
    '--fx-tile': '#f7f7f7',
    '--glass': '#ffffffe8',
    '--selected-box': '#beb3a354',

    '--gap': '8px',
    '--neumorphic-down': 'none',
    '--neumorphic-up': 'none',
    '--input-height': '35px',
    '--neumorphic-disabled': 'none',
    
    '--checkbox-neo': 'none',
    '--icon-active': '#EC0000',
    '--news-text': '#f7f7f7',
    '--tab-gap': '0px',
    '--tab-radius': 'none',
    '--border-tabs': '2px solid #EC0000',
    '--inactive-tab-border': '#cfcfcf',
    '--sub-container': '#ffffff',
    '--list-hover': '#7d7d7d36',
    '--domain-ip': window.location.protocol + '//' + window.location.host,
    '--setting-box': '#ffffff',
    '--10': 'calc(8px + (10 - 8) * ((100vw - 1200px) / (1920 - 1200)))',
    '--12': 'calc(11px + (12 - 11) * ((100vw - 1200px) / (1920 - 1200)))',
    '--14': 'calc(12px + (14 - 12) * ((100vw - 1200px) / (1920 - 1200)))',
    '--16': 'calc(14px + (16 - 14) * ((100vw - 1200px) / (1920 - 1200)))',
    '--20': 'calc(18px + (20 - 19) * ((100vw - 1200px) / (1920 - 1200)))',
    '--28': 'calc(24px + (28 - 24) * ((100vw - 1200px) / (1920 - 1200)))',
    '--sub-sidebar-color': 'var(--options-color-primary-sky)',
    '--linkMovement': 'gray',
    '--linkQMovement': 'rgb(192, 40, 2)',
    '--calendar-bg': '#f5f5f5',
    '--week-strip':'#EC0000',
    //START || Added by Varsha G || 25-Mar-2023
    '--best-lp':'#f5f5f5',
    '--best-lp-shadow':'#ababab',
    
    '--date-bg-color':'#efefef',
    '--WFLabel-color':'#000000',
    '--queueCard-bg-color':'#efefef',
    '--infoNote-bg-color':'#f8f8f8',
    '--infoNote-border':'#dddddd',
    '--tblTrigger-bg-color':'#fff',
    '--tblTrigger-border':'#ccc',
    '--container-hover':'#eaeaea',
    '--home-container':'#ffffff',//attachment details popup
    '--queueCard-border-color':'#dadada',
    '--tabs-bg':'#eee',
    '--tile-label':'#eb4f47',
    '--tabs-active':'#a9a9a980',
    '--icon-delete-active':'#e3dad9',
    //END || Added by Varsha G || 25-Mar-2023
	// Added Workbench label color by AdilP @28-03-2023
    '--lbl-reverseConvertible':'#baa364e7',
    '--lbl-participation':'#db5a5d',
    '--lbl-creditTranche':'#f96973',
    '--lbl-ACC':'#ef6f7a',
    '--lbl-DAC':'#e76d7c',
    '--lbl-EQC':'#f1596c',
    '--lbl-YE':'#8f4046',
    '--bg-success':'#cd820d',  //Added by Adil for progress bar
    '--pricer-popup-color': "#000000", //Added by Jyoti S for previous quotes popup icon
    //START || Added by SandipA || 11-Apr-23
    '--table-th' : '#1A3343',
    '--select-dropdown-bg': '#efefef',
    //END || Added by SandipA || 11-Apr-23
    '--view-popup-color' : '#ffffff', //Added by Jyoti S for Prev Quotes View Pricer Popup
    '--link-popup' : '#ffffff',//Added by Jyoti S for Prev Quotes View Pricer Popup
    '--table-data-ER-color' : '#ffffff',//Added by Jyoti S for Prev Quotes table data
    '--tbl-audtitrail-border': '#DEEDF2', //Added by Jyoti S for audti trail table border
    '--tbl-th-audit-trail' : '#ffffff', //Added by Jyoti S for audti trail table border
    '--date-active' : '#000000',//Added by Jyoti S for audti trail date filter active
    '--page-background' : '#ffffff',//Added by Jyoti S for Prev quotes accoordian
    '--ripple-color' : '#0d445b',//Added by Jyoti S for audti trail ripple effect
    '--select-product' : '#ffffff',//Added by Jyoti S for audti trail tooltip
    '--select-product-color' : '#000000',//Added by Jyoti S for audti trail tooltip
    '--tbl-prevquotes' : '#ffffff',//Added by Jyoti S for prev quotes table
    '--autocall-color': "#022e58", //Added by Jyoti S for quotes audit trail autocall icon
    '--disabled-tabs-color' : ' #cccccc', //Added by Jyoti S for previous quotes product tabs
    '--header' : '#000000',//Added by Jyoti S for Quotes Audit Trail
    //'--table-th' : '#98999A',//Added by Jyoti S for Quotes Audit Trail
    '--subscription-th' : '#555555',//Added by Jyoti S for Quotes Audit Trail
    '--card-bg-hover': 'linear-gradient(to right,#cdcdcd00 0%,#dad8d8 20%,#d4d3d3 40%,#dfdfdf 100%)',// Added by Sandip for card background hover effect @27-06-2023
    '--icon-active-bg': '#af615f', // Added by SandipA for overlay background @05-07-2023
  '--box-shadow-color':'rgba(155,195,211,0.2)',
  '--tilebgcolor' : '#f5fafb', //Added by Apurva K|| 04-Sep-2023
  '--calendar-prev-dates' : '#efefef', //Added by Apurva K|| 06-Sep-2023
  '--notificationsPopUpBG' : "#e0e0e0",//Added by Jyoti S || 06-Sept-2023
  '--page-title-hr' : '#ec0000', //Added by Apurva K|| 07-Sep-2023
  //Added by AdilP for galxy pages theme wise || Start || 07-09-2023
 '--link-select':'#ea0010',
 '--link-div':'#eeeeee',
 '--layout-inner-container':'#6d6d6d',
 '--sub-header-lcm':'#9d7678',
    '--tile-1': '#ff4b4b',
    '--tile-2': '#ff0b0b',
    '--tile-3': '#921919',
    '--tile-4': '#6b1c1f',
 //Added by AdilP for galxy pages theme wise || End
 '--active-date' : "#ffcbd0", // Added by Jyoti S || 05-Oct-2023 || SP Event  Calendar
    //Added by RajeshC || UCP RED Theme || 11-Oct-2023
    '--mainDEBGColor' : '#FFFFFF',
    '--customtabheaderbackgroundcolor' : '#DEEDF24D', //Added by RajeshC || 11-Oct-2023 || custom Tab header color
    '--customtabHeaderBGColor' : '#DEEDF24D',
    '--ucp-mat-select-clr':'#444444',
    '--ucp-disbled': '#EFEFEF',
    '--mat-inputspan': '#444444',
    '--customtabHeaderColor' : '#EC0000',
    '--wflButtonsBGColor' : '#4444', 
     '--wflButtonsTxtColor' : '#000000',
     '--ucp-customtabuttons': '#ffb3b3',
     '--readOnlyBGColor' : '#DEEDF24D',
     '--ucp-table-header-bg':'#deedf291',
     '--ucp-th-font':'#EC0000',
     //'--text-color' :'#000000', Commented by RajeshC || 25-10-2023
     '--ucp-enabled': 'rgb(222 237 242 / 30%)',
     '--ucp-input-clr': '#000000',
     '--ucp-input-bg': 'rgb(222 237 242 / 30%)',
     '--ucp-opposite': 'black',
     '--ucp-btn-bg': 'rgb(222 237 242 / 30%)',
     '--ucp-panel-bg': 'white',
    //  '--even-row':'#FFFFFF',
    //  '--odd-row': '#FFFFFF',
    '--even-row':'#f6fafc',
    '--odd-row': '#f6fafc',
     '--staticbuttontxtcolor' : 'rgb(222 237 242 / 30%)',
     '--staticmattxtcolor' : 'black',
     '--ucp-checkbox-bg':'rgb(222 237 242 / 30%)',
     '--matselectedBGcolor':'rgb(222 237 242 / 30%)',
     '--label-color':'red',
    //'--ucp-disbled': '#666666',
    //DEEDF24D
    '--customTabGridButton': '#FF8B00',
    '--dropdown-arrow':'#706b6b',
    
    
    //'--readOnlyBGColor' : '#2e2e2e', Commented by RajeshC || 25-10-2023
    '--readOnlyValueColor' : '#979595',
    '--staticbuttonBGcolor' : '#FF8B00',
    //'--staticbuttontxtcolor' : '#ffffff', Commented by RajeshC || 25-10-2023
    //'--matselectedBGcolor':'#2e2e2e', Commented by RajeshC || 25-10-2023
    '--chartheadertextcolor':'#b6b6b6',
    
    
  
    '--selectedValInSearchCompBGClr' : '#666666', 
    '--searchCompBGClr' : '#000000', 
    '--searchCompHeaderBGClr' : '#000000',
    '--calenderBGClr' : '#262626',
    '--calenderSelectedCircleBGClr' : '#ffffff',
    '--radiobuttoncolor' : '#b6b6b6',
    '--input-focus':'#000000',
    '--ucp-neumorphic-down': 'inset 0px 0px 0px #1c1c1c, inset 0px 0px 0px #2a2a2a',
    '--ucp-neumorphic-up': '0px 0px 0px #191919, 0px 0px 0px #2e2e2e',
   
    
    //'--ucp-enabled':'#333333', Commented by RajeshC || 25-10-2023
    '--ucp-btn-text': '#000000',
    //'--ucp-btn-bg': '#323232', Commented by RajeshC || 25-10-2023
    '--ucp-button-neumorphic-up': '0px 2px 2px #080808, 0px 2px 2px #2f2f2f',
    '--ucp-draft-btn' : '2px 0px 0px #F4A460, 0px 4px 6px #F4A460',
    '--ucp-save-btn' : '2px 0px 0px #FFA500, 0px 4px 6px #FFA500',
    '--ucp-reprice-btn' : '2px 0px 0px #BDB76B, 0px 4px 6px #BDB76B',
    '--ucp-clear-btn' : '2px 0px 0px #BEE2F5, 0px 4px 6px #BEE2F5',
    '--ucp-simulation-btn' : '2px 0px 0px #DDA0DD, 0px 4px 6px #DDA0DD',
    '--topMarginInput': '-0.55em',
    '--matInputBGColor' : '#333333',
    '--dateLeftPadding':'1px',
    '--dateRightPadding':'15px',
    '--border-color':'rgb(116, 115, 115)',
    //'--ucp-th-font':'#FF8B00', Commented by RajeshC || 25-10-2023
    //'--even-row':'#1A1A1A', Commented by RajeshC || 25-10-2023
   // '--odd-row': '#1A1A1A', Commented by RajeshC || 25-10-2023
    '--font-color':'#ffffff',
    '--text-blue': '#87CEEB',
    
    //'--ucp-input-bg': '#333333', Commented by RajeshC || 25-10-2023
    //'--ucp-input-clr': '#bdbdbd', Commented by RajeshC || 25-10-2023
    //'--ucp-opposite': 'white', Commented by RajeshC || 25-10-2023
    '--ucp-same':'black',
    //'--ucp-table-header-bg':'#444444', Commented by RajeshC || 25-10-2023
    '--ucp-btn-text-clr':'black',
    //'--ucp-checkbox-bg':'#ffffff', Commented by RajeshC || 25-10-2023
    '--ucp-checkbox':'#6e6e6e',
    '--mat-select-arrow':'rgba(189, 189, 189, 0.54)',
     '--linear-grad1':'#000',
    '--linear-grad2':'#ABABAB',
    '--linear-grad3':'#2C2C2C',
    '--ucp-text-color':'#FFFFFF',
    '--hist-perf-row': '#e5e5e5',
    '--hist-perf-rowbg': '#EC0000',

    // Added by RizwanS / ChaitanyaM :: Start || Instant Pricer || HSBCFXEINT-9 ||  08-Nov-2023
    //-----------------------------------------------------------//
    '--smallDiv-bg': '#FFFFFF',
    '--price-btn': '#283C83 ',
    '--price-text': '#FFFFFF ',
    '--pricer-text': '#283C83',
    '--select-bk': '#737a9c',
    '--option-bg': '#FFFFFF',
    '--popup-bk': '#f2f2f2',
    '--popup-box-shadow': '#b5b5b5',
    '--popup-border': '#c7c6c6',
    '--pair-box-shadow': '#c1c1c1',
    '--input-disabled': '#D4D8E6',
    '--scroll-bg': '#d7ddf3',
    '--scroll-bg-color': '#808080',
    '--tile-bg': '#f2f2f2',
    '--switch-bg-sell': '#d4d8e6',
    '--span-bg': '#e7e7e7',
    '--shadow-head': '#f1eeee',
    '--border-chk': '#000',
    '--aqdq-bg': '#ffffff',
    '--box-inner-bg': '#f2f2f2',
    '--li-hover-bg': '#ffffff',
    '--popup-border-bg': '#f1f1f1',
    '--ELN-bg': '#e1dddd',
    '--crudShadow': '#181818',
    '--btn-color': '#FFFFFF',
    '--select-disabled': '#d4d8e6',
    '--switch-selction-bg': '#dfd8e6',
    '--btn-pricegrid-disabled-ip':'#D4D8E6',
    '--bestprice-style-bg-ip':'#07825E',
    '--btn-disabled-text-ip':'#666666',
    '--pricetext-color-ip':'#1A3343',
    '--Tilebg-color-ip': '#ffffff',    
    '--timer-text':'#737A9B',
    '--switch-select-bg':'#d4d8e5', 
    '--filter-maple': 'invert(1%) sepia(50%) saturate(6280%) hue-rotate(205deg) brightness(56%) contrast(96%)',
    '--action-icon-maple': 'invert(100%) sepia(100%) saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%)',
    '--action-icon-maple-hover': 'invert(50%) sepia(101%) saturate(1050%) hue-rotate(193deg) brightness(38%) contrast(100%)',
    '--action-drawer':'#fff',
    '--action-drawer-border':'#162258',
    '--rfq-text':'#162258',
    '--advYes':'#000', 
    '--advNo':'red', 
    '--btnfilter_IP':'invert(242%) sepia(93%) saturate(50%) hue-rotate(284deg) brightness(150%) contrast(350%)', 
    '--dialogboxbgIP' : '#f7f7f7', 
    '--shdwdialogboxbgIP' : '#A2A7BC',
    '--templatenamebg-IP' : '#283e80',
    '--templatenamebghover-IP' : '#A2A7BC',
    '--tempplatetext-IP' : '#283C83',
    '--orderDetailsmsg':"#283e80 ", 
    '--rfqtextFXD-ip': "#FFF", 
    '--rfqtextEQC-ip': "#FFF", 
    '--Buy_DirectionFXD-ip' : "#07825E", 
    '--Sell_DirectionFXD-ip' : "#CB2C30", 
    '--orderHeader-bottomline-color-IP':'#283C83', 
    '--select-bg-ip': '#414141', // Modified by LalitG@13May2024 || HSBCFXEINT-96
    '--header-bg':'#F2a832', // Added by LalitG@13May2024 || HSBCFXEINT-96
    '--product-bg': '#ffffff',
    '--calendar-icon-filter': 'brightness(0) saturate(100%) invert(40%) sepia(80%) saturate(2182%) hue-rotate(335deg) brightness(96%) contrast(92%)',
    '--icon-header': '#EC0000', // HSBCFXEINT-8 | Chaitanya M  | 12 Dec 2023
    // Added by RizwanS / ChaitanyaM :: End || Instant Pricer || HSBCFXEINT-9 || 08-Nov-2023
    //-----------------------------------------------------------//
    '--card-bg': '#efefef', // Added by ChaitanyaM | 23-Jan-2023 | Single Pricer Theme issue

  },
};

export const dark: Theme = {
  name: 'dark',
  properties: {
    // common colors
    '--container-color':'#000',
    '--white': ' white',
    '--black': ' black',
    '--blue': '#00a1ff',
    '--red': '#ff5c7e',
    '--brown': ' #d97d54',
    '--yellow': '#c7c782',
    '--light-brown': ' #f7d1c0',
    '--green': '#00d8a8',
    '--gray': '#e0e0e0',
    '--light-gray': ' #f5f5f5',
    '--very-light-gray': ' #fafafa',
    '--very-dark-gray': ' #212121',
    '--dark-gray': ' #303030',
    '--light-dark-gray': ' #424242',
    '--border-tr': 'solid 1px #414447',
    '--hover-wfl': '#7d7d7d61',
    '--main-bg-color': '#000000',
    '--light-blue': '#4ac2ff87',
    '--dark-blue': '#5cfee387',

    '--navbar': ' #ffffff',
    '--navbar-main': ' #2e2f32',

    '--sidebar-li': '#ffffff',
    '--sidebar-li-active': '#ffffff',
    '--sidebar-bg': '#232323',
    '--scroll-bar': '#b6b6b6',
    '--scroll-bar-hover': '#a4a4a4',
    '--active-sidebar': '#beb3a354',

    '--profile-name': ' #1a4269',
    '--label': '#f2a832',
    '--inline-label': '#f2a832',

    '--checkbox': ' #424242',
    '--checkbox-bg': ' #ffffff',
    '--text': '#f7f7f7',
    '--text-color': '#f7f7f7',
    '--icons': ' #acacac',
    '--icons-filter': 'brightness(0) invert(1)',
    '--active-icons-filter': 'brightness(0) invert(1)',
    '--calendar-filter': '',

    '--headers': '#FFFFFF',
    '--containers': '#232323',
    '--containers-content': '#b6b6b7',
    '--btn-toggle-filter': ' brightness(0.3)',
    '--selected-btn-toggle-filter': ' brightness(1)',
    '--box-content': ' #eeeeee',

    '--table-header-bg': '#444444',
    '--table-header-text': '#828282',
    '--table-subheader-text': '#f7f7f7',
    '--table-row-odd': '#77777742',
    '--table-row-even': '#ffffff00',
    '--table-row-hovered': ' #d6d6d6',
    '--td': 'white',

    '--btn-bg': '#f2a832',
    '--btn-text': '#000000',

    '--input-bg': '#2f2f2f',
    '--input-text': '#f7f7f7',
    '--input-border': '1px solid rgb(118, 118, 118)',
    '--input-border-bottom': '1px solid rgb(118, 118, 118)',
    // var changed for SelectorBox by SandipA @30-Mar-2023
    '--select-bg': '#2f2f2f',
    
    '--select-dropdown-bg': '#444444',
    '--select-text': '#f7f7f7',
    '--input-icon': 'grey',
    '--btn-hover-bg': '#f5b95a',
    '--btn-hover-text': '#000000',

    // '--disabled': ' #565656',
    '--btn-disabled': 'rgb(241 166 65 / 75%)',
    '--bt-disabled-text':'#414040',
    '--overlay-bg':'#4f464645',
    '--disabled': ' #565656',
    '--disabled-text': ' #a7a7a7',

    '--sidebar-handle': ' #a7a7a7',
    '--btn-border': '#595959',
    '--btn-border-insurance': '#616161',
    '--border': ' #616161',

    '--btn-border-bottom': ' 1px solid #000000',
    '--placeholder-text': ' #6c757d',

    '--header-line': '#D9D9D9',

    '--risk-rating-bg': ' #e2e2e2',

    '--shadow-buttons': ' 0 0.0625rem 0.1875rem rgba(0, 25, 40, 0.2)',

    '--links': '#00befe',
    '--active': '#f2a832',
    '--active-bg': '#EC0000',
    '--default-bg': '#767676',
    '--active-bg-disabled': '#ababab',
    '--default-bg-disabled': '#ababab',
    '--box-shadow-color':'rgb(244 244 244 / 73%)',

    '--footer-text': ' #343a40',
    '--calendar-icon':
      'url(' + environment.asseturl + 'calendar-grey.png)',
      '--exclamation-icon':
      'url(' + environment.asseturl + 'exclamation_red.png)',//exclamation icon added by SandipA to highlight ErrorMsg @17-Nov-23
    '--xls-icon':
      'url(' + environment.asseturl + 'xls.png)',
    '--pdf-icon':
      'url(' + environment.asseturl + 'pdf.png)',

    '--portfolio-toggle-bg': '#ffffff',
    '--portfolio-toggle': '#234567',
    '--nav-header': '#232323',
    '--header-icon': '#fff',

    // misc
    '--container-box-shadow': ' 0px 0px 10px 4px rgba(0, 0, 0, 0.6)',
    '--box-shadow-thin':
      '0px 0px 3px rgb(255 255 255 / 15%), 0px 0px 3px rgb(255 255 255 / 15%)',
    '--box-shadow-ccy':
      '0px 0px 3px rgb(255 255 255 / 15%), 0px 0px 3px rgb(255 255 255 / 15%)',
    '--box-shadow':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-hovered':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-small':
      ' 0 1px 1px 0 rgba(66, 66, 66, 0.08), 0 1px 3px 1px rgba(66, 66, 66, 0.16)',

    // '--font-secondary': 'graphie, sans-serif',
    // '--font-primary': 'bio-sans, sans-serif',
    '--sidebar-line': '#f4f4f4',
    '--profile-icon':
      'url(' + environment.asseturl + 'user-blue.png)',
    '--setting-icon':
      'url(' + environment.asseturl + 'setting.png)',
    '--finiq-logo':
      'url('+ environment.asseturl +'/FinIQ_logo.png)',
    '--logout-icon':
      'url(' + environment.asseturl + 'logout.png)',
    '--sidebar-filter': 'brightness(0.2) invert(1)',
    '--ticker-bg': '#232323',
    '--theme-active': '#232323',
    '--theme-hover': '#353535',
    '--content-header': '#464646',
    '--heading-label': '#dfdfdf',
    '--off-color': '#f9e9cf',
    '--cirp-header': '#394346',
    '--fx-line': '#525252',
    '--fx-text': '#f2a832',
    '--filter-button': '#464646',
    '--glass': '#000000c7',
    '--fx-tile': '#2f2f2f',
    '--selected-box': '#beb3a354',

    '--gap': '8px',
    '--neumorphic-down': 'none',
    '--neumorphic-up': 'none',
    '--input-height': '35px',
    '--neumorphic-disabled': 'none',
    
    '--checkbox-neo': 'none',
    '--neumorphic-sidebar': 'none',
    '--icon-active': '#f2a832',
    '--news-text': '#f7f7f7',
    '--tab-gap': '0px',
    '--tab-radius': 'none',
    '--border-tabs': '2px solid #f2a832',
    '--inactive-tab-border': '#8c8c8c',
    '--sub-container': '#313131',
    '--list-hover': '#7d7d7d36',
    '--domain-ip': window.location.protocol + '//' + window.location.host,
    '--setting-box': '#111111',
    '--10': 'calc(8px + (10 - 8) * ((100vw - 1200px) / (1920 - 1200)))',
    '--12': 'calc(11px + (12 - 11) * ((100vw - 1200px) / (1920 - 1200)))',
    '--14': 'calc(12px + (14 - 12) * ((100vw - 1200px) / (1920 - 1200)))',
    '--16': 'calc(14px + (16 - 14) * ((100vw - 1200px) / (1920 - 1200)))',
    '--20': 'calc(18px + (20 - 19) * ((100vw - 1200px) / (1920 - 1200)))',
    '--28': 'calc(24px + (28 - 24) * ((100vw - 1200px) / (1920 - 1200)))',
    '--sub-sidebar-color': '#141414',
    '--linkMovement': '#00cbca',
    '--linkQMovement': '#f03c03',
    '--calendar-bg': '#303030',
    '--week-strip':'#ec5043',
    '--table-th' : 'white',
    //START || Added by Varsha G || 25-Mar-2023
    '--best-lp':'#363636',
    '--best-lp-shadow':'#767575',
    '--submenu-active-color':'#f9e9cf',
    '--date-bg-color':'#464545',
    '--WFLabel-color':'white',
    '--queueCard-bg-color':'#525252',
    '--calendar-bg-theme':'dark',
    '--infoNote-bg-color':'#363636',
    '--infoNote-border':'#595959',
    '--tblTrigger-bg-color':'#3e3e3e',
    '--tblTrigger-border':'#565656',
    '--container-hover':'#353535',
    '--home-container':'#232323',//attachment details popup
    '--queueCard-border-color':'#818181',
    '--tabs-bg':'#2f2f2f',
    '--tabs-active':'#565656',
    '--tile-label':'#f2a832',
    '--icon-delete-active':'#484848',
    //END || Added by Varsha G || 25-Mar-2023
'--rm-popup':'#303030',  // Added by AdilP @23-03-2023 
   // '--date-bg-color':'#464545',  //For Dark theme
    
    '--progress-bar-border':'#a29c9c', // Added by AdilP 
    // Added Workbench label color by AdilP @28-03-2023
    '--lbl-reverseConvertible':'#baa364e7',
    '--lbl-participation':'#7a5f1fbf',
    '--lbl-creditTranche':'#827332',
    '--lbl-ACC':'#887c53',
    '--lbl-DAC':'#726043',
    '--lbl-EQC':'hsl(38, 29%, 53%)',
    '--lbl-YE':'#7b5c32',
    '--bg-success':'#22d1aa',  //Added by Adil for progress bar
    '--view-popup-color' : '#000000',//Added by Jyoti S for Prev Quotes View Pricer Popup
    '--link-popup' : '#000000',//Added by Jyoti S for Prev Quotes link Popup
    '--table-data-ER-color' : '#232323',//Added by Jyoti S for Prev Quotes table data
    '--page-background' : '#1e1e1e',//Added by Jyoti S for Prev quotes accoordian
    '--tbl-audtitrail-border': '#4b4b4b', //Added by Jyoti S for audti trail table border
    '--tbl-th-audit-trail' : '#000000', //Added by Jyoti S for audti trail table border
    '--date-active' : '#ffffff',//Added by Jyoti S for audti trail date filter active
    '--ripple-color' : '#ffffff',//Added by Jyoti S for audti trail ripple effect
    '--select-product' : '#000000',//Added by Jyoti S for audti trail tooltip
    '--select-product-color' : '#ffffff',//Added by Jyoti S for audti trail tooltip
    '--tbl-prevquotes' : '#232323',//Added by Jyoti S for prev quotes table
    '--autocall-color': "#d6d6d6", //Added by Jyoti S for quotes audit trail autocall icon
    '--disabled-tabs-color' : ' #98999A', //Added by Jyoti S for previous quotes product tabs
    '--pricer-popup-color': "#ffffff", //Added by Jyoti S for previous quotes popup icon
    '--subscription-th' : '#555555',//Added by Jyoti S for Quotes Audit Trail
    '--header' : '#ffffff',//Added by Jyoti S for Quotes Audit Trail
    '--card-bg-hover': 'linear-gradient(to right,#2c2c2c00 0%,#2c2c2c 20%,#323232 40%,#262626 100%)',// Added by Sandip for card background hover effect @27-06-2023
    /// Added by OnkarE for UCP Pages
    '--customTabGridButton': '#FF8B00',
    '--dropdown-arrow':'#706b6b',
    '--customtabheaderbackgroundcolor': '#444444', //Added by RajeshC || 11-Oct-2023 || custom Tab header color
    '--customtabHeaderBGColor' : '#232323',
    '--customtabHeaderColor' : '#FF8B00', 
    '--readOnlyBGColor' : '#2e2e2e',
    '--readOnlyValueColor' : '#979595',
    '--staticbuttonBGcolor' : '#FF8B00',
    '--staticbuttontxtcolor' : '#ffffff',
    '--staticmattxtcolor' : '#ffffff', // Added by RajeshC
    '--matselectedBGcolor':'#2e2e2e',
    '--label-color':'#FFFFFF',  // Added by RajeshC
    '--chartheadertextcolor':'#b6b6b6',
    '--mainDEBGColor' : '#000000',
    '--wflButtonsBGColor' : '#FF8B00',
    '--wflButtonsTxtColor' : '#ffffff',
    '--selectedValInSearchCompBGClr' : '#666666', 
    '--searchCompBGClr' : '#000000', 
    '--searchCompHeaderBGClr' : '#000000',
    '--calenderBGClr' : '#262626',
    '--calenderSelectedCircleBGClr' : '#ffffff',
    '--radiobuttoncolor' : '#b6b6b6',
    '--input-focus':'#000000',
    '--ucp-neumorphic-down': 'inset 0px 0px 0px #1c1c1c, inset 0px 0px 0px #2a2a2a',
    '--ucp-neumorphic-up': '0px 0px 0px #191919, 0px 0px 0px #2e2e2e',
    '--ucp-mat-select-clr':'#f7f7f7',
    '--ucp-disbled': '#666666',
    '--ucp-enabled':'#333333',
    '--ucp-btn-text': '#000000',
    '--ucp-btn-bg': '#323232',
    '--ucp-panel-bg': '#323232',   // Added by RajeshC
    '--ucp-button-neumorphic-up': '0px 2px 2px #080808, 0px 2px 2px #2f2f2f',
    '--ucp-draft-btn' : '2px 0px 0px #F4A460, 0px 4px 6px #F4A460',
    '--ucp-save-btn' : '2px 0px 0px #FFA500, 0px 4px 6px #FFA500',
    '--ucp-reprice-btn' : '2px 0px 0px #BDB76B, 0px 4px 6px #BDB76B',
    '--ucp-clear-btn' : '2px 0px 0px #BEE2F5, 0px 4px 6px #BEE2F5',
    '--ucp-simulation-btn' : '2px 0px 0px #DDA0DD, 0px 4px 6px #DDA0DD',
    '--topMarginInput': '-0.55em',
    '--matInputBGColor' : '#333333',
    '--dateLeftPadding':'1px',
    '--dateRightPadding':'15px',
    '--border-color':'rgb(116, 115, 115)',
    '--ucp-th-font':'#FF8B00',
    '--even-row':'#1A1A1A',
    '--odd-row': '#1A1A1A',
    '--font-color':'#ffffff',
    '--text-blue': '#87CEEB',
    '--mat-inputspan': '#EDE9C6',
    '--ucp-input-bg': '#333333',
    '--ucp-input-clr': '#bdbdbd',
    '--ucp-opposite': 'white',
    '--ucp-same':'black',
    '--ucp-table-header-bg':'#444444',
    '--ucp-btn-text-clr':'black',
    '--ucp-checkbox-bg':'#ffffff',
    '--ucp-checkbox':'#6e6e6e',
    '--mat-select-arrow':'rgba(189, 189, 189, 0.54)',
     '--linear-grad1':'#000',
    '--linear-grad2':'#ABABAB',
    '--linear-grad3':'#2C2C2C',
    '--ucp-text-color':'#FFFFFF',
    '--ucp-customtabuttons':'#f2a832', //Added by RajeshC || 11-Oct-2023
    '--table-border-bottom':'#828282', //Added by RajeshC || 11-Oct-2023
    
    '--icon-active-bg': '#0e0e0e', // Added by SandipA for overlay background @05-07-2023
    '--dropdown-hover':'#634f34',//Added by AdilP || FIN1EURINT-584 || 29-08-2023
  
    // Added by RizwanS / ChaitanyaM :: Start || Instant Pricer || HSBCFXEINT-9 || 08-Nov-2023
    //-----------------------------------------------------------//
    '--smallDiv-bg': '#000000',
    '--price-btn': '#FFB033',
    '--price-text': '#000000',
    '--pricer-tbl-bg': '#2d2d2d',
    '--pricer-text': 'peachpuff',
    '--select-bk': '#000000',
    '--option-bg': '#000000',
    '--popup-bk': '#252525',
    '--popup-box-shadow': '#1d1d1d',
    '--popup-border': '#101010',
    '--pair-box-shadow': '#3a3a3a',
    '--input-disabled': '#666', 
    '--scroll-bg': '#cccccc',
    '--scroll-bg-color': '#cccccc',
    '--tile-bg': '#444',
    '--switch-bg-sell': '#0e0e0e',
    '--span-bg': '#252525',
    '--shadow-head': '#1d1d1d',
    '--border-chk': '#fff',
    '--product-bg': '#000000',
    '--aqdq-bg': '#000000',
    '--box-inner-bg': '#272525c2',
    '--li-hover-bg': '#000000',
    '--popup-border-bg': '#484848',
    '--ELN-bg': '#3a3a3a',
    '--crudShadow': '#e0e0e0',
    '--btn-color': '#000000',
    '--select-disabled': '#383838',
    '--switch-selction-bg': '#ff9800', 
    '--nav-btn-bg': '#ff9c00',
    '--heading-label-workflow': '#808080',
    '--btn-pricegrid-disabled-ip':'#666',
    '--pricer-grid-bg-ip':'#2f2f2f',
    '--bestprice-style-bg-ip':'#07825E',
    '--pricetext-color-ip':'#ffffff',
    '--btn-disabled-text-ip':'#cccccc',
    '--Tilebg-color-ip': '#000000', 
    '--timer-text':'#bdbdbd',
    '--switch-select-bg':'#333',  
    '--filter-maple': 'invert(55%) sepia(96%) saturate(1325%) hue-rotate(1deg) brightness(105%) contrast(104%)',
    '--action-icon-maple': 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
    '--action-icon-maple-hover': 'invert(31%) sepia(95%) saturate(836%) hue-rotate(334deg) brightness(100%) contrast(100%)',
    '--action-drawer':'#000',
    '--action-drawer-border':'#162258',
    '--rfq-text':'#ff9c00',
    '--advYes':'#f7f7f7', 
    '--advNo':'#ff4545', 
    '--btnfilter_IP':'invert(242%) sepia(93%) saturate(50%) hue-rotate(284deg) brightness(150%) contrast(350%)',
    '--dialogboxbgIP' : 'black', 
    '--shdwdialogboxbgIP' : '#e0e0e0', 
    '--templatenamebg-IP' : 'black',
    '--templatenamebghover-IP' : '#2f2f2f',
    '--tempplatetext-IP' : '#ffffff',
    '--orderDetailsmsg':"#85ca9e", 
    '--rfqtextFXD-ip': "#fff", // HSBCFXEINT-8 | Chaitanya M  | 12 Dec 2023
    '--rfqtextEQC-ip': "#FFF", 
    '--Buy_DirectionFXD-ip' : "#07825E", 
    '--Sell_DirectionFXD-ip' : "#CB2C30", 
    '--orderHeader-bottomline-color-IP':'#FF9C00', 
    '--calendar-icon-filter': 'brightness(0) saturate(100%) invert(63%) sepia(82%) saturate(410%) hue-rotate(353deg) brightness(97%) contrast(96%)',
    '--icon-header': '#414141', // HSBCFXEINT-8 | Chaitanya M  | 12 Dec 2023
    // Added by RizwanS / ChaitanyaM :: END || Instant Pricer || HSBCFXEINT-9 || 08-Nov-2023
    //-----------------------------------------------------------//

    '--card-bg': '#666666', //Urmila A | 30-Aug-23 | FXD Pricing containers
    '--tilebgcolor' : '#252525', //Added by Apurva K|| 04-Sep-2023
    '--calendar-prev-dates' : '#383838', //Added by Apurva K|| 06-Sep-2023
    '--notificationsPopUpBG' : "#4c4c4c",//Added by Jyoti S || 06-Sept-2023
    '--page-title-hr' : '#f2a832', //Added by Apurva K|| 07-Sep-2023
    '--mail': '#77a5e3', //Urmila A | 14-sep-23

    //END
     //Added by AdilP for galxy pages theme wise || Start || 07-09-2023
 '--link-select':'#000000',
 '--link-div':'#1d4662',
 '--layout-inner-container':'rgb(180, 180, 180)',
 '--sub-header-lcm':'rgb(180, 180, 180)',
    '--tile-1': 'rgb(67, 94, 190)',
    '--tile-2': 'rgb(6, 146, 143)',
    '--tile-3': 'rgb(254, 147, 39)',
    '--tile-4': 'rgb(255, 202, 51)',
 //Added by AdilP for galxy pages theme wise || End
    //END
    '--active-date' : "#7d7d7d", // Added by Jyoti S || 05-Oct-2023 || SP Event  Calendar
    '--hist-perf-row': 'transparent',
    '--hist-perf-rowbg': '#9d9d9d',
  },
};

export const neu_dark: Theme = {
  name: 'neu_dark',
  properties: {
    // common colors
    '--white': ' white',
    '--black': ' black',
    '--blue': '#00a1ff',
    '--red': '#ff5c7e',
    '--brown': ' #d97d54',
    '--yellow': '#c7c782',
    '--light-brown': ' #f7d1c0',
    '--green': '#00d8a8',
    '--gray': '#808080',
    '--light-gray': ' #f5f5f5',
    '--very-light-gray': ' #fafafa',
    '--very-dark-gray': ' #212121',
    '--dark-gray': ' #303030',
    '--light-dark-gray': ' #424242',
    '--border-tr': 'solid 1px #414447',
    '--hover-wfl': '#7d7d7d61',
    '--main-bg-color': '#232323',
    '--light-blue': '#4ac2ff87',
    '--dark-blue': '#5cfee387',

    '--navbar': ' #ffffff',
    '--navbar-main': ' #2e2f32',

    '--sidebar-li': '#ffffff',
    '--sidebar-li-active': '#ffffff',
    '--sidebar-bg': '#232323',
    '--scroll-bar': '#808080',
    '--scroll-bar-hover': '#a0a0a0',
    '--active-sidebar': 'transparent',

    '--profile-name': ' #1a4269',
    '--label': '#f2a832',
    '--inline-label': '#f2a832',

    '--checkbox': ' #424242',
    '--checkbox-bg': ' #ffffff',
    '--text': '#f7f7f7',
    '--text-color': '#f7f7f7',
    '--icons': ' #acacac',
    '--icons-filter': 'brightness(0) invert(1)',
    '--active-icons-filter': 'brightness(0) invert(1)',
    '--calendar-filter': '',

    '--headers': '#FFFFFF',
    '--containers': '#232323',
    '--containers-content': '#b6b6b7',

    '--box-content': ' #eeeeee',

    '--table-header-bg': '#444444',
    '--table-header-text': '#828282',
    '--table-subheader-text': '#828282',
    '--table-row-odd': '#77777742',
    '--table-row-even': '#ffffff00',
    '--table-row-hovered': ' #d6d6d6',
    '--td': 'white',

    '--btn-bg': '#f2a832',
    '--btn-text': '#000000',

    '--input-bg': '#232323',
    '--input-text': '#f7f7f7',
    '--input-border': 'none',
    '--input-border-bottom': 'none',
    '--select-bg': '#232323',
    '--select-text': '#f7f7f7',
    '--input-icon': 'grey',
    //'--btn-hover-bg': '#232323',
    '--btn-hover-bg': '#faa015',//Added by SandipA @11-04-23
    '--btn-hover-text': '#f2a832',

    // '--disabled': '#2c2c2c', 
    // Disabled color changed by AdilP @21-03-2023
    '--disabled': '#565656',
    '--disabled-text': ' #a7a7a7',

    '--sidebar-handle': ' #a7a7a7',
    '--btn-border': '#777777', //Added by AdilP @31-03-2023
    '--btn-border-insurance': ' #cfcfcf',
    '--btn-toggle-filter': ' brightness(1)',
    '--selected-btn-toggle-filter': ' brightness(0.3)',
    '--border': ' #5b4a4a', //Added by AdilP @31-03-2023

    '--btn-border-bottom': ' 1px solid #000000',
    '--placeholder-text': ' #6c757d',

    '--header-line': '#D9D9D9',

    '--risk-rating-bg': ' #e2e2e2',

    '--shadow-buttons': ' 0 0.0625rem 0.1875rem rgba(0, 25, 40, 0.2)',

    '--links': '#7bc7de',
    '--active': '#f2a832',

    '--footer-text': ' #343a40',
    '--calendar-icon':
      'url(' + environment.asseturl + 'calendar-grey.png)',
      '--exclamation-icon':
      'url(' + environment.asseturl + 'exclamation_red.png)',
    '--xls-icon':
      'url(' + environment.asseturl + 'xls.png)',
    '--pdf-icon':
      'url(' + environment.asseturl + 'pdf.png)',

    '--portfolio-toggle-bg': '#ffffff',
    '--portfolio-toggle': '#234567',
    '--nav-header': '#232323',
    '--header-icon': '#fff',

    // misc
    '--container-box-shadow': ' 0px 0px 10px 4px rgba(0, 0, 0, 0.6)',
    '--box-shadow-thin': '5px 5px 6px #191919, -5px -5px 6px #2e2e2e',
    '--box-shadow-ccy': '5px 5px 6px #191919, -5px -5px 6px #2e2e2e',
    '--box-shadow':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-hovered':
      ' 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '--box-shadow-small':
      ' 0 1px 1px 0 rgba(66, 66, 66, 0.08), 0 1px 3px 1px rgba(66, 66, 66, 0.16)',

    // '--font-secondary': '"Montserrat", sans-serif',
    // '--font-primary': '"Open Sans", sans-serif',
    '--sidebar-line': '#f4f4f4',
    '--profile-icon':
      'url(' + environment.asseturl + 'user-blue.png)',
    '--setting-icon':
      'url(' + environment.asseturl + 'setting.png)',
    '--finiq-logo':
      'url('+ environment.asseturl +'/FinIQ_logo.png)',
    '--logout-icon':
      'url(' + environment.asseturl + 'logout.png)',
    '--sidebar-filter': 'brightness(0.2) invert(1)',
    '--ticker-bg': '#232323',
    '--theme-active': '#232323',
    '--theme-hover': '#353535',
    '--content-header': '#464646',
    '--heading-label': '#afafaf',
    '--off-color': '#f9e9cf',
    '--cirp-header': '#394346',
    '--fx-line': '#525252',
    '--fx-text': '#f2a832',
    '--filter-button': '#464646',
    '--glass': '#000000c7',
    '--fx-tile': '#2f2f2f',
    '--selected-box': '#232323',

    '--gap': '20px',
    '--neumorphic-down':
      'inset 5px 5px 6px #1c1c1c, inset -5px -5px 6px #2a2a2a',
    '--neumorphic-up': '5px 5px 6px #191919, -5px -5px 6px #2e2e2e',
    '--input-height': '35px',
    '--neumorphic-disabled':
      'inset 4px 4px 7px #202020, inset -4px -4px 7px #262626',
   
    '--checkbox-neo': 'none',
    '--neumorphic-sidebar':
      'inset 5px 5px 6px #1c1c1c, inset -5px -5px 6px #2a2a2a',
    '--icon-active': '#f2a832',
    '--news-text': '#f7f7f7',
    '--tab-gap': '20px',
    '--tab-radius': '4px',
    '--border-tabs': 'none',
    '--inactive-tab-border': 'none',
    '--sub-container': '#313131',
    '--list-hover': '#7d7d7d36',
    // '--checkbox-neo': '',
    '--domain-ip': window.location.protocol + '//' + window.location.host,
    '--setting-box': '#111111',
    '--10': 'calc(8px + (10 - 8) * ((100vw - 1200px) / (1920 - 1200)))',
    '--12': 'calc(11px + (12 - 11) * ((100vw - 1200px) / (1920 - 1200)))',
    '--14': 'calc(12px + (14 - 12) * ((100vw - 1200px) / (1920 - 1200)))',
    '--16': 'calc(14px + (16 - 14) * ((100vw - 1200px) / (1920 - 1200)))',
    '--20': 'calc(18px + (20 - 19) * ((100vw - 1200px) / (1920 - 1200)))',
    '--28': 'calc(24px + (28 - 24) * ((100vw - 1200px) / (1920 - 1200)))',
    '--sub-sidebar-color': '#141414',
    '--linkMovement': '#00cbca',
    '--linkQMovement': '#f03c03',
    '--calendar-bg': '#303030',
    '--week-strip':'#ec5043',
    //START || Added by Varsha G || 25-Mar-2023
    '--best-lp':'#363636',
    '--submenu-active-color':'#f9e9cf',
    '--WFLabel-color':'white',
    '--queueCard-bg-color':'#525252',
    '--calendar-bg-theme':'dark',
    '--infoNote-bg-color':'#363636',
    '--infoNote-border':'#595959',
    '--tblTrigger-bg-color':'#3e3e3e',
    '--tblTrigger-border':'#565656',
    '--container-hover':'#353535',
    '--home-container':'#232323',//attachment details popup
    '--queueCard-border-color':'#818181',
    '--tile-label':'#f2a832',
    //END || Added by Varsha G || 25-Mar-2023

// Added Workbench label color by AdilP @28-03-2023
    '--lbl-reverseConvertible':'#baa364e7',
    '--lbl-participation':'#7a5f1fbf',
    '--lbl-creditTranche':'#827332',
    '--lbl-ACC':'#887c53',
    '--lbl-DAC':'#726043',
    '--lbl-EQC':'hsl(38, 29%, 53%)',
    '--lbl-YE':'#7b5c32',
    '--bg-success':'#22d1aa',  //Added by Adil for progress bar
    '--view-popup-color' : '#000000',//Added by Jyoti S for Prev Quotes View Pricer Popup
    '--link-popup' : '#000000',//Added by Jyoti S for Prev Quotes link Popup
    '--table-data-ER-color' : '#232323',//Added by Jyoti S for Prev Quotes table data
    '--page-background' : '#1e1e1e',//Added by Jyoti S for Prev quotes accoordian
    '--tbl-audtitrail-border': '#4b4b4b', //Added by Jyoti S for audti trail table border
    '--tbl-th-audit-trail' : '#000000', //Added by Jyoti S for audti trail table border
    '--date-active' : '#ffffff',//Added by Jyoti S for audti trail date filter active
    '--ripple-color' : '#ffffff',//Added by Jyoti S for audti trail ripple effect
    '--select-product' : '#000000',//Added by Jyoti S for audti trail tooltip
    '--select-product-color' : '#ffffff',//Added by Jyoti S for audti trail tooltip
    '--tbl-prevquotes' : '#232323',//Added by Jyoti S for prev quotes table
    '--autocall-color': "#d6d6d6", //Added by Jyoti S for quotes audit trail autocall icon
    '--disabled-tabs-color' : ' #98999A', //Added by Jyoti S for previous quotes product tabs
    '--pricer-popup-color': "#ffffff", //Added by Jyoti S for previous quotes popup icon
    '--date-bg-color':'#232323',
    '--select-dropdown-bg': '#444444',//Added by SandipA @11-04-23
    '--header' : '#ffffff',//Added by Jyoti S for Quotes Audit Trail
    '--icon-active-bg': '#0e0e0e', // Added by SandipA for overlay background @05-07-2023
    '--dropdown-hover':'#634f34', //Added by AdilP || FIN1EURINT-584 || 29-08-2023
    '--card-bg': '#232323', //Urmila A | 30-Aug-23 | FXD Pricing containers
    '--notificationsPopUpBG' : "#e0e0e0",//Added by Jyoti S || 06-Sept-2023
    '--tilebgcolor' : '#252525', //Added by Apurva K|| 04-Sep-2023
    '--calendar-prev-dates' : '#383838', //Added by Apurva K|| 06-Sep-2023
    '--mail': '#77a5e3', //Urmila A | 14-sep-23

    //Added by AdilP for galxy pages theme wise || Start || 07-09-2023
 '--link-select':'#ea0010',
 '--link-div':'#eeeeee',
 '--layout-inner-container':'rgb(180, 180, 180)',
 '--sub-header-lcm':'rgb(180, 180, 180)',
    '--tile-1': 'rgb(67, 94, 190)',
    '--tile-2': 'rgb(6, 146, 143)',
    '--tile-3': 'rgb(254, 147, 39)',
    '--tile-4': 'rgb(255, 202, 51)',
 //Added by AdilP for galxy pages theme wise || End

    // Added by RizwanS / ChaitanyaM :: Start || Instant Pricer || HSBCFXEINT-9 || 08-Nov-2023
    //-----------------------------------------------------------//
    '--smallDiv-bg': '#000000',
    '--price-btn': '#FFB033',
    '--price-text': '#000000',
    '--pricer-tbl-bg': '#2d2d2d',
    '--pricer-text': 'peachpuff',
    '--select-bk': '#000000',
    '--option-bg': '#000000',
    '--popup-bk': '#252525',
    '--popup-box-shadow': '#1d1d1d',
    '--popup-border': '#101010',
    '--pair-box-shadow': '#3a3a3a',
    '--input-disabled': '#666', 
    '--scroll-bg': '#cccccc',
    '--scroll-bg-color': '#cccccc',
    '--tile-bg': '#444',
    '--switch-bg-sell': '#0e0e0e',
    '--span-bg': '#252525',
    '--shadow-head': '#1d1d1d',
    '--border-chk': '#fff',
    '--product-bg': '#000000',
    '--aqdq-bg': '#000000',
    '--box-inner-bg': '#272525c2',
    '--li-hover-bg': '#000000',
    '--popup-border-bg': '#484848',
    '--ELN-bg': '#3a3a3a',
    '--crudShadow': '#e0e0e0',
    '--btn-color': '#000000',
    '--select-disabled': '#383838',
    '--switch-selction-bg': '#ff9800', 
    '--nav-btn-bg': '#ff9c00',
    '--heading-label-workflow': '#808080',
    '--btn-pricegrid-disabled-ip':'#666',
    '--pricer-grid-bg-ip':'#2f2f2f',
    '--bestprice-style-bg-ip':'#07825E',
    '--pricetext-color-ip':'#ffffff',
    '--btn-disabled-text-ip':'#cccccc',
    '--Tilebg-color-ip': '#000000', 
    '--timer-text':'#bdbdbd',
    '--switch-select-bg':'#333', 
    '--filter-maple': 'invert(55%) sepia(96%) saturate(1325%) hue-rotate(1deg) brightness(105%) contrast(104%)',
    '--action-icon-maple': 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
    '--action-icon-maple-hover': 'invert(31%) sepia(95%) saturate(836%) hue-rotate(334deg) brightness(100%) contrast(100%)',
    '--action-drawer':'#000',
    '--action-drawer-border':'#162258',
    '--rfq-text':'#ff9c00',
    '--advYes':'#f7f7f7', 
    '--advNo':'#ff4545', 
    '--btnfilter_IP':'invert(242%) sepia(93%) saturate(50%) hue-rotate(284deg) brightness(150%) contrast(350%)',
    '--dialogboxbgIP' : 'black',
    '--shdwdialogboxbgIP' : '#e0e0e0', 
    '--templatenamebg-IP' : 'black',
    '--templatenamebghover-IP' : '#2f2f2f',
    '--tempplatetext-IP' : '#ffffff',
    '--orderDetailsmsg':"#85ca9e", 
    '--rfqtextFXD-ip': "#fff",  // HSBCFXEINT-8 | Chaitanya M  | 12 Dec 2023
    '--rfqtextEQC-ip': "#FFF", 
    '--Buy_DirectionFXD-ip' : "#07825E", 
    '--Sell_DirectionFXD-ip' : "#CB2C30", 
    '--orderHeader-bottomline-color-IP':'#FF9C00', 
    '--calendar-icon-filter': 'brightness(0) saturate(100%) invert(63%) sepia(82%) saturate(410%) hue-rotate(353deg) brightness(97%) contrast(96%)',
    '--icon-header': '#414141', // HSBCFXEINT-8 | Chaitanya M  | 12 Dec 2023
    // Added by RizwanS / ChaitanyaM :: END || Instant Pricer || HSBCFXEINT-9 || 08-Nov-2023
    //-----------------------------------------------------------//

  },
};
