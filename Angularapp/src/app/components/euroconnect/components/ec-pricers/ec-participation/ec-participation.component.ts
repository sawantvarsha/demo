import {
  Component, OnInit, ElementRef, Input, OnDestroy, ViewChild, Output, EventEmitter, Renderer2
} from '@angular/core';
import { SearchUnderlyingPipe } from '../../../pipes/search-underlying.pipe';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatCalendar } from '@angular/material/datepicker';
import { SearchUserGroupPipe } from '../../../pipe/search-user-group.pipe';
import { EcCommonService } from '../../../services/ec-common.service';
import { AppConfig } from 'src/app/services/config.service';
import { EcHomeService } from '../../../services/ec-home.service';
import { HttpClient } from '@angular/common/http';

declare var require: any;
const $: any = require('jquery');

declare global {
    interface Array<T> {
        PTCsortBy(p): Array<T>;
    }
}
Array.prototype.PTCsortBy = function (p): Array<any> {
    try {
        if (this !== undefined) {
            if (this.length > 0) {
                if (this[0].solveFor !== 'Coupon' && this[0].solveFor !== 'RebateCoupon') {
                    return this.slice(0).sort(function (a, b) {
                        return (Number(a[p]) > Number(b[p])) ? 1 : (Number(a[p]) < Number(b[p])) ? -1 : 0;

                    });

                }
                else {
                    return this.slice(0).sort(function (a, b) {
                        return (Number(a[p]) < Number(b[p])) ? 1 : (Number(a[p]) > Number(b[p])) ? -1 : 0;

                    });
                }
            }
        }

    } catch (error) { }
};
function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

@Component({
  selector: 'app-ec-participation',
  templateUrl: './ec-participation.component.html',
  styleUrls: ['./ec-participation.component.scss']
})
export class EcParticipationComponent implements OnInit, OnDestroy {
  @Input() PrevQuoteShowOrderPopUp: any;
  @Input() dataItemAccordian: any;
  pageActive: Boolean = true;
  @Input() viewRFQID: any;
  @Input() Order_Notional: any;
  @Input() NMID: any;
  @Input() RepriceIssuer: any;
  @Input() TokenIdReprice: any;
  @Input() viewOnlyFlag: any;
  @Input() sendtocptyflag: any;
  @Input() selectedToken: any;
  shwRepriceBookOrder = false;
  sendtoCptyBookOrder = false;
  showDocsPopup: boolean = false; //Added by Jyoti S || 25-May-2023
  docsData: Object[] = []; //Added by Jyoti S || 25-May-2023
  docsPopupLabels: Object[] = [];//Added by Jyoti S || 25-May-2023
  docSupportStatus: any = {};
  txtnotional: any;
  txtIBPrice: any;
  txtClientPrice: any;
  txtStrike: any;
  txtTenor: any;
  txtUpfront: any;
  txtClietYield: any;
  txtOrderType: any;
  txtlimitLevel: any;
  txtEQCRef: any;
  txtComment: any;
  underlyingForLimit = '';
  orderLoadFlag: boolean = false// Added by YASH AGRAWAL
  txtOthersRsn: any;
  nonBestPriceRsnDD: any;
  customTenor = '';
  Tenor = [];
  autoNonCallArr: any = [];
  txtShare: any;
  RMList = [];
  customerList = [];
  BookingCenter = [];
  successMsgBookOrder: string = "";
  errorMsgBookOrder: string = "";
  orderBookedFlag = false;
  successMessage: boolean;
  warningMessage: boolean;
  IssueDateOffset = [];
  stkshiftFwd : any = 'Fwd'
  stkshiftTdy : any = '0B'
  autoFreq: any;
  @Output()
  dateSelected: EventEmitter<Moment> = new EventEmitter();

  @Output()
  selectedDate = moment();

  @ViewChild('calendar', { static: true })
  calendar: MatCalendar<Moment>;

  @ViewChild('focusable', { static: false }) namefield: ElementRef;



  timeoutMsg = '';
  reqSuccessMsg: string;

  upperStrikeYN: any;
  minCouponYN: any;
  lowerStrikeYN: any;
  upRebate: any;
  downLowerStrike: any;
  downLeverage: any;
  upBarrierType: any;
  upGearing: any;
  upUpperStrike: any;
  participationType: any;
  upCoupon: any;
  upStrike: any;
  upBarrierLevel: any;
  downStrike: any;
  downBarrierType: any;
  downBarrierLevel: any;
  capitalGuaranteed: any;
  guaranteedCoupon: any;
  guaranteedCouponFreq: any;
  onBehalfOf = '';

  ynToggle: any;
  selectedBIndex = 0;
  showSuggestions = false;
  Currency: string;


  flag: boolean;
  shares: any;
  ShareName: string;
  shareCode: any;
  exchngCode: any;
  selectedShareIndex = 0;
  ShareBasket = [];
  settdate = '';
  stkdate = '';
  expdate = '';
  country = 'UK'; //Changes by Apurva K || 21-Dec-2023
  language = 'English'; //Changes by Apurva K || 18-May-2023
  ddlNoteCcy: any;
  txtddlNoteCcy: any;
  UnderlyingCurrency = 'EUR';
  CCY = [];
  ReceivedCCY: any;
  SolveForvalue: any;
  ccyChange: any;
  IBPrice: any;
  Coupon: any;
  sortedAllPrices: any = [];
  bestLPArray: any = [];
  AllPrices = [];
  Prices = [];

  interfaceUrl = environment.interfaceURL;
  asseturl = environment.asseturl;
  SelectedUnderlyingarray = [];
  SelectedUnderlyingBasketArray = [];
  SelectedUnderlyingBasket: any = {
      UnderlyingOne: {},
      UnderlyingTwo: {},
      UnderlyingThree: {},
      UnderlyingFour: {},
      UnderlyingFive: {},

  };
  Code: any;
  RICCode: any;
  Exchange: any;
  Notional: any;
  loadflag = false;
  variantFlag = false; //Added by Apurva K|| 18-Dec-2023||HSBCECCLI-87
  pageloadflag = true;//Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
  orderID: any;
  timeLeft = 60;
  interval: any;
  PPDetails: any;
  ErrorMsg = '';
  ErrorMsgTop = '';
  clearFlag: boolean;
  format: any;
  templateMappingArr: any;
  Product = 'Participation';

  fundType: any;
  fundFreq: any;
  fundRate: any;
  rfqID: any;
  noteMasterID: any;
  barrierLevelYN: any;
  rebateYN: any;
  Dates: any = [];
  NoteMasterID: any;
  orderStatus: any;
  saveFlag = false;
  quoteEmailFlg = false;
  successMsg: any;
  errorTemplateMessage = '';
  replySolveFor: any;
  validationArr: any;
  minTrigger: any;
  maxTrigger: any;
  minStepdown: any;
  maxCoupon: any;
  minCoupon: any;
  minBarrier: any;
  maxBarrier: any;
  minStrike: any;
  maxStrike: any;
  mindownLeverage: any;
  maxdownLeverage: any;
  minReoffer: any;
  issuePrice: any;
  defaultRFQTimeout: number;
  defaultOrderTimeout: number;
  tempXML = '';
  checkNotionalRes: any;
  viewOnly = false;
  stkshift: any;
  paymentshift: any;
  expshift: any;

  portfolioId: any;
  allBooksData: any = [];

  upMinGearing: any;
  upMaxGearing: any;
  upMinStrike: any;
  upMaxStrike: any;
  upMinUpperStrike: any;
  upMaxUpperStrike: any;
  upMinBarrierLevel: any;
  upMaxBarrierLevel: any;
  upMinRebate: any;
  upMaxRebate: any;
  upMinCoupon: any;
  upMaxCoupon: any;
  downMinStrike: any;
  downMaxStrike: any;
  downMinLowerStrike: any;
  downMaxLowerStrike: any;
  downMinBarrierLevel: any;
  downMaxBarrierLevel: any;
  portfolioGroupID: any = '';

  downLeverageYN: any = '';

  ptcPriceSubscription: Subscription;
  TriggerValueArr: any;
  fundRatePopup = false;
  priceoptionflag = false;
  saveoptionflag = false;
  showSchedulePopupFlag = false;
  showsaveSharePopupFlag = false;
  updateMessagePopupFlag = false;
  GetClientProdDetailsArr: any;
  // priceBtnActive = 'N';
  priceBtnActive = 'Y'; // set default to 'Y'|| added by PriyaL || 22Apr2022
  mappedformatlist: any;

  // ssss
  userName: string;
  selectedUserIndex = 0;
  showSuggestions_User = false;
  userflag: boolean;
  users: any;
  // userName: string;
  userCode: any;
  selectedBIndex_User = 0;
  userBasket = [];
  currentowner: any;
  saveportfolioId = '';
  scheduleMsg: any;
  inputDate: any;
  inputTime: any;
  todayDate: any;
  priceProvidersArr: any = [];
  priceProvidersArrCpy: any = [];
  showOrderDetailsFlag = false;
  Issuer: any;
  selectedRFQ: any;
  selectedBookingBranch: any;
  OrderType: any;
  LimitAmount: any;
  eqcRef: any;
  ErrorMsg1: any;
  minNotional: any;
  maxNotional: any;
  tblAllocation = [];
  allocatedNotional: any = 0;
  remainingNotional: any = 0;
  previousNotional: any = 0;
  totalNotional: any = "300,000.00";
  poolActivateDate: any;
  poolExpiryDate: any;
  minPoolNotional: any;
  maxPoolNotional: any;
  minOrderSize: any;
  Denomination: any;
  poolDetailsVisibleFlag = false;
  ordersuccessMsg: any;
  poolErrorMsg: any;
  poolSuccessMsg: any;
  Format = [];

  allocatedNotionalArr: any = [0.00];
  allocatedRMArray: any = [''];
  // View TS flag and timer
  //TSTimeout = 180;
  TSTimeout = 300; //CHanges by Apurva K|| 18-May-2023
  TSInterval: any;
  KIDInterval: any;
  TSFlag = false;

  buttonList: any = '';
  viewRFQ = '';
  priceClickFlag = false;
  templateName = '';
  portfolio = '';
  portfolioIdArr: any = [];
  portfolioName = '';
  UserRolesArr:any = [];
  selectedVariantName = '';
  bookOrderFlag = true;

  //Start || Avinash G || 10-Apr-2024 || HSBCECCLI-119 || Warning on screen if Issue Date Offset is less than a configured value || Config Based Issue Date offset Warning Message Display asked by Nitish K
  MinimumAllowedIssueDateOffset:any;  
  //End || Avinash G || 10-Apr-2024 || HSBCECCLI-119 || Warning on screen if Issue Date Offset is less than a configured value || Config Based Issue Date offset Warning Message Display asked by Nitish K



  LanguageArr1: any = [{ 'Key': 'Czech', 'Value': 'Czech' },
  //{ 'Key': 'Czechia', 'Value': 'Czechia' },
  { 'Key': 'Dutch', 'Value': 'Dutch' },
  { 'Key': 'English', 'Value': 'English' },
  { 'Key': 'Finnish', 'Value': 'Finnish' },
  { 'Key': 'French', 'Value': 'French' },
  { 'Key': 'Galician', 'Value': 'Galician' },
  { 'Key': 'German', 'Value': 'German' },
 // { 'Key': 'Greece', 'Value': 'Greece' }, //Commented by Apurva K|| suggested by Kundan/Vipul|| 05-Jun-2023
  { 'Key': 'Greek', 'Value': 'Greek' },
 // { 'Key': 'Guernsey', 'Value': 'Guernsey' },
  { 'Key': 'Hungarian', 'Value': 'Hungarian' },
  { 'Key': 'Italian', 'Value': 'Italian' },
 // { 'Key': 'Italy', 'Value': 'Italy' },
  { 'Key': 'Norwegian', 'Value': 'Norwegian' },
  { 'Key': 'Polish', 'Value': 'Polish' },
  { 'Key': 'Portuguese', 'Value': 'Portuguese' },
  { 'Key': 'Russian', 'Value': 'Russian' },
  { 'Key': 'Spanish', 'Value': 'Spanish' },
  { 'Key': 'Swedish', 'Value': 'Swedish' },
  ];
  LanguageArr = [];
  //<!--Added by Apurva C||19-Oct-->
  activeTab: any = 'Pricing';

  //  add allocation table changes for dropdown - added by PriyaL on 08Dec2021
  EQ_Show_Order_RM = 'NO';
  EQ_Show_Order_Customer = 'NO';
  EQ_Login_Client_Mapping = 'NO';
  allocatedClientArray: any = [''];
  allocatedCustomerArray: any = [''];

  accessRight = 'All'; // save and share change- added by PriyaL on 07Dec2021
  isDealer = true; // Dealer flag - added by PriyaL on 08Dec2021 
  commonData = [];
  defaultvaluesArr = [];
  NonBestPriceReasonArr = [];
  minNotionalConfirm = false;

  // new config variable || PriyaL || 05Apr2022 || Assigned by PranavD
  EQ_Show_Launch_Button = 'NO';
  EQ_Show_Order_Button = 'NO';

  // new config variable || Amogh k || 19Apr2022 || Assigned by PranavD
  EQ_Show_Termsheet_Button = 'NO';
  // new config variable || Amogh k || 21Apr2022 || Assigned by PranavD
  EQ_Show_KID_Button = 'NO';
    DealerValue: boolean;
    participationTypeArr: any;
    SolveForvalueArr: any;
    upBarrierTypeArr: any;
    downBarrierTypeArr: any;
    priipsYN: string;
    languageDropdown: any;
    LanguageUpdatedBy: any;
    LanguageUpdatedAt: any;
    countryDropdown1: any[];
    countryYN: any;
    countryDropdown: any;
    CountryUpdatedBy: any;
    CountryUpdatedAt: any;
    CountryofDistribution: any;
    countryArr: any[];
    CurrencyYN: any;
    CurrDropdown: any;
    CurrencyUpdatedBy: any;
    CurrencyUpdatedAt: any;
    downsideType: any = 'Put';
    upsidetype : any = 'Call Spread';
    downsidePutGearing: string;
    capitalprotection: string;
    downRebate: string;
    infoMsg: string;


  monthSelected(date: Moment) {
    console.log('month changed' , date);
  }

  dateChanged() {
      this.scheduleMsg = '';
      this.ErrorMsgTop = '';
      // this.calendar.activeDate = this.selectedDate;
      this.inputDate = this.selectedDate.format('DD-MMM-YYYY');
      this.inputTime = this.selectedDate.format('HH:mm');
      this.dateSelected.emit(this.selectedDate);
  }

  prevDay() {
      const prevMoment = moment(this.selectedDate).add(-1, 'days');
      this.selectedDate = prevMoment;
      this.dateChanged();
  }

  today() {
      this.selectedDate = moment();
      this.dateChanged();
  }

  nextDay() {
      const nextMoment = moment(this.selectedDate).add(1, 'days');
      this.selectedDate = nextMoment;
      this.dateChanged();
  }

  positionDropdown() {
    //console.log("Clicked")
    $("div.cdk-overlay-pane").addClass("adjust-dropdown");
  }

  ngOnDestroy(): void {
      this.pageActive = false;
      this.timeLeft = -1;
      this.timeoutMsg = '';
      clearInterval(this.interval);
      //clearInterval(this.TSInterval);
      this.clearAllDocIntervals();
      this.AllPrices = [];
      this.sortedAllPrices = [];
      this.EcCommon.setPTCReceivedPrices({}, '');
      if (this.ptcPriceSubscription) {
          this.ptcPriceSubscription.unsubscribe();
      }

  }

  private intervals: Set<NodeJS.Timeout>;
  customSetDate: number = 1;

  constructor(public elem: ElementRef, public EcCommon: EcCommonService,
      public EcHome: EcHomeService, public datepipe: DatePipe,
      private route: ActivatedRoute,
      private renderer: Renderer2,public http: HttpClient) {
      try {
          this.portfolioId = '';
          this.flag = false;
          this.shares = [];
          this.ddlNoteCcy = 'EUR';
          this.UnderlyingCurrency = 'EUR';
          this.format = 'Note';
          this.barrierLevelYN = 'N';
          this.rebateYN = 'N';
          this.successMessage = false;
          this.warningMessage = false;
          this.pageloadflag=true;////Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
          this.intervals = new Set<NodeJS.Timeout>();//Added by Varsha G || 23-Jun-2023
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  ngAfterViewInit() {
    const buttons = document.querySelectorAll('.mat-calendar-previous-button, .mat-calendar-next-button');

    if (buttons) {
      Array.from(buttons).forEach(button => {
        this.renderer.listen(button, 'click', () => {
          //console.log('Arrow buttons clicked');
        });
      });
    }
  }

  closeDocsModal(val: boolean) {
    try {
      this.showDocsPopup = val;
    } catch (error) {
      console.log(error);
    }
  }//Added by Jyoti S || 25-May-2023

  showDocsModal() {
    try {
      this.showDocsPopup = true;
      return false;
    } catch (error) {
      console.log(error);
    }
  }//Added by Jyoti S || 25-May-2023


  async ngOnInit() {
      this.pageActive = true;
      this.minNotionalConfirm = false;
      this.priipsYN = 'Yes'
      try {
            this.pageloadflag=true;
          $('#loading').show();
          this.viewOnly = this.viewOnlyFlag ?? this.viewOnly; // Added by Jyoti S || 30-Jun-2023 || FIN1EURINT-511
          setTimeout(async () => {
            this.docSupportStatus = await this.EcHome.GetDocumentSupportStatus('Participation');//Changed by Sandip A || 05-Jan-2023 || To send docs specfic to the entity ID 
            this.LanguageArr = [];
            for (let j = 0; j < this.LanguageArr1.length; j++) {
                if (this.LanguageArr1[j].Value !== '') {
                    this.LanguageArr.push(this.LanguageArr1[j].Value);
                }
            }
            let UserGroup = AppConfig.settings.oRes.groupID;       
            this.UserRolesArr = await this.EcHome.GetCommonDataReason("CSP_UserRoles");//Added by Varsha G || 01-June-2023
            const matchedGroup = this.UserRolesArr?.filter((obj)=>{
            return obj.Misc1 === UserGroup;
            })
            if(matchedGroup?.[0]?.Data_Value?.toUpperCase() === "DEALER"){
            this.isDealer = true;
            }else{
            this.isDealer = false;
            }
            this.DealerValue = this.isDealer
              // this.RMList = this.EcHome.Get_RMList();
              //this.isDealer = await this.EcHome.checkLoginBookName();
              // this.BookingCenter = this.EcHome.GetBookingCenter();
              this.portfolioIdArr = [];
              this.portfolioIdArr = await this.EcHome.BBVAGetPortfolio('Participation', 'Single Pricer');
        if (this.portfolioIdArr?.length > 0) {
              this.portfolioIdArr?.splice(0, 0, {
                  AccessDetail: "ALL",
                  Created_At: "",
                  P_ID: "",
                  P_Name: "",
                  ProdType: "",
                  ShareType: "ALL",
                  created_by: "",
              });
              this.portfolioIdArr?.map(r => {
                  let item = r;
                  item.imageIcon = environment.asseturl + ((r.ShareType + '').toUpperCase() === 'OWNER' ? 'owner.png' : 'shared.png');
                  return item;
              });
        }
              //console.log(this.RMList);
              //console.log(this.BookingCenter);

            //   if (this.EcHome.allBooksData === undefined || this.EcHome.allBooksData.length <= 0) {
            //       this.allBooksData = await this.EcHome.getAllBooksMappedToLogin();
            //   }
              // if (this.EcHome.shares === undefined || this.EcHome.shares.length <= 0) {
                 //Commented by Apurva K|| 07-Jul-2023|| As discussed with Nitish K for removing extra call to GetAllShareDetails
              //this.shares = await this.EcHome.BBVALoadShares('EQ,IDX', "", "EQC_Europe"); // Temp done by Jyoti S || 02-May-2023 || FIN1EURINT-127
              //this.shares = await this.EcHome.BBVALoadShares('EQ', "", "Participation");
              // }
              if (this.EcHome.CCY === undefined || this.EcHome.CCY.length <= 0) {
                  this.ReceivedCCY = await this.EcHome.BBVALoadCCY();
              }
              if (this.EcHome.validationArr === undefined || this.EcHome.validationArr.length <= 0) {
                  this.validationArr = await this.EcHome.BBVAFetchValidation('EQ');
              }
              if (this.EcHome.payOffList === undefined || this.EcHome.payOffList.length <= 0) {
                  await this.EcHome.getPayOffList();
              }
              if (this.EcHome.rmList === undefined || this.EcHome.rmList.length <= 0) {
                  await this.EcHome.Get_RMList();
              }else{
                this.RMList = await this.EcHome.rmList;
              }

              // Fetch booking center - added by Priya L. on 14Mar2022 - assigned by Pranav D.
              if (this.EcHome.BookingCenter === undefined || this.EcHome.BookingCenter.length <= 0) {
                this.BookingCenter = await this.EcHome.GetBookingCenter();
              }
              else{
               this.BookingCenter = this.EcHome.BookingCenter;
              }
              this.customerList = await this.EcHome.getCustomerList();
              this.shares = await this.EcHome.shares;
              this.ReceivedCCY =  await this.EcHome.CCY;
              try {
                this.ReceivedCCY.forEach((element) => {
                  const ccyData = element.Ccy;
                  this.CCY.push(ccyData);
                });
              } catch (error) {
              }
            //   this.ddlNoteCcy = 'EUR';
      
              this.reset();

              this.fnGetProdTemplate();
              this.fnGetValidation();
              // this.priceProvidersArr = this.EcHome.priceProviders;
              //   if (this.templateMappingArr && this.templateMappingArr.length > 0) {
                  this.commonData = await this.EcHome.GetCommonDataEuroConnect("Participation");
                  if (this.commonData && this.commonData.length > 0) {
                      this.filldropdownfromcommandata();
                  }
                  this.defaultvaluesArr = await this.EcHome.GetEntityDefaultValues("", AppConfig.settings.oRes.userID, 'Participation');
              //   }

            //   this.allBooksData = this.EcHome.allBooksData;
              // Removed client book mapping || PriyaL || 22Apr2022 || Assigned by Pranav D


              // if (this.allBooksData && this.allBooksData.length > 0) {
              //     this.onBehalfOf = this.allBooksData[0].BookCode;
              //     this.GetClientProdDetailsArr = this.EcHome.GetClientProdDetails(this.onBehalfOf);
              //     if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
              //         if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation') > -1) {
              //             this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation')].CPM_Format).toString().split(',');
              //             this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation')].ActiveYN;
              //             //console.log(this.mappedformatlist, this.priceBtnActive);
              //         } else {
              //             if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All') > -1) {
              //                 this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].CPM_Format).toString().split(',');
              //                 this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].ActiveYN;
              //                 //console.log(this.mappedformatlist, this.priceBtnActive);
              //             }
              //         }
              //     }
              // }
            this.EcCommon.ClearPricesFromMultiToDealEntry();

              this.Code = () => {
                  let code = '';
                  if (this.SelectedUnderlyingBasket) {
                      if (this.SelectedUnderlyingBasket.UnderlyingOne && this.SelectedUnderlyingBasket.UnderlyingOne.Code) {
                          code = this.SelectedUnderlyingBasket.UnderlyingOne.Code;
                      }
                      if (this.SelectedUnderlyingBasket.UnderlyingTwo && this.SelectedUnderlyingBasket.UnderlyingTwo.Code) {
                          code += ',' + this.SelectedUnderlyingBasket.UnderlyingTwo.Code;
                      }
                      if (this.SelectedUnderlyingBasket.UnderlyingThree && this.SelectedUnderlyingBasket.UnderlyingThree.Code) {
                          code += ',' + this.SelectedUnderlyingBasket.UnderlyingThree.Code;
                      }
                      if (this.SelectedUnderlyingBasket.UnderlyingFour && this.SelectedUnderlyingBasket.UnderlyingFour.Code) {
                          code += ',' + this.SelectedUnderlyingBasket.UnderlyingFour.Code;
                      }
                      if (this.SelectedUnderlyingBasket.UnderlyingFive && this.SelectedUnderlyingBasket.UnderlyingFive.Code) {
                          code += ',' + this.SelectedUnderlyingBasket.UnderlyingFive.Code;
                      }
                  }
                  return code;
              };

              this.RICCode = () => {
                  let code = '';
                  if (this.SelectedUnderlyingBasket) {
                      if (this.SelectedUnderlyingBasket.UnderlyingOne && this.SelectedUnderlyingBasket.UnderlyingOne.RICCode) {
                          code = this.SelectedUnderlyingBasket.UnderlyingOne.RICCode;
                      }
                      if (this.SelectedUnderlyingBasket.UnderlyingTwo && this.SelectedUnderlyingBasket.UnderlyingTwo.RICCode) {
                          code += ',' + this.SelectedUnderlyingBasket.UnderlyingTwo.RICCode;
                      }
                      if (this.SelectedUnderlyingBasket.UnderlyingThree && this.SelectedUnderlyingBasket.UnderlyingThree.RICCode) {
                          code += ',' + this.SelectedUnderlyingBasket.UnderlyingThree.RICCode;
                      }
                      if (this.SelectedUnderlyingBasket.UnderlyingFour && this.SelectedUnderlyingBasket.UnderlyingFour.RICCode) {
                          code += ',' + this.SelectedUnderlyingBasket.UnderlyingFour.RICCode;
                      }
                      if (this.SelectedUnderlyingBasket.UnderlyingFive && this.SelectedUnderlyingBasket.UnderlyingFive.RICCode) {
                          code += ',' + this.SelectedUnderlyingBasket.UnderlyingFive.RICCode;
                      }
                  }
                  return code;
              };


              this.Exchange = () => {
                  let exchange = '';
                  if (this.SelectedUnderlyingBasket) {
                      if (this.SelectedUnderlyingBasket.UnderlyingOne && this.SelectedUnderlyingBasket.UnderlyingOne.ExchangeCode) {
                          exchange = this.SelectedUnderlyingBasket.UnderlyingOne.ExchangeCode;
                      }
                      if (this.SelectedUnderlyingBasket.UnderlyingTwo && this.SelectedUnderlyingBasket.UnderlyingTwo.ExchangeCode) {
                          exchange += ',' + this.SelectedUnderlyingBasket.UnderlyingTwo.ExchangeCode;
                      }
                      if (this.SelectedUnderlyingBasket.UnderlyingThree && this.SelectedUnderlyingBasket.UnderlyingThree.ExchangeCode) {
                          exchange += ',' + this.SelectedUnderlyingBasket.UnderlyingThree.ExchangeCode;
                      }
                      if (this.SelectedUnderlyingBasket.UnderlyingFour && this.SelectedUnderlyingBasket.UnderlyingFour.ExchangeCode) {
                          exchange += ',' + this.SelectedUnderlyingBasket.UnderlyingFour.ExchangeCode;
                      }
                      if (this.SelectedUnderlyingBasket.UnderlyingFive && this.SelectedUnderlyingBasket.UnderlyingFive.ExchangeCode) {
                          exchange += ',' + this.SelectedUnderlyingBasket.UnderlyingFive.ExchangeCode;
                      }
                  }


                  return exchange;
              };
              this.participationType = 'Booster';
              this.guaranteedCoupon = '';
              this.IBPrice = '99.50';
              this.ddlNoteCcy = 'EUR';
              this.SolveForvalue = 'IBPrice';
              this.shares = this.EcHome.shares;

              this.guaranteedCouponFreq = '';
              this.Notional = '1,000,000.00';
              this.upStrike = '100.00';
              this.upGearing = '100.00';
              this.downStrike = '100.00';
              this.downLeverage = '100.00';
              this.capitalGuaranteed = '';

              this.fundType = '';
              this.fundFreq = '';
              this.fundRate = '';
              this.upBarrierLevel = '';
              this.upBarrierType = 'None';
              this.downBarrierType = 'None';
              this.downBarrierLevel = '';
              this.issuePrice = '100.00';
              this.upUpperStrike = '';
              this.upRebate = '';
              this.upCoupon = '0.00';
              const today = new Date();
              this.upperStrikeYN = 'N';
              this.minCouponYN = 'Y';
              this.lowerStrikeYN = 'Y';
              this.downLowerStrike = '70.00';
              this.downLeverageYN = 'N';
              this.stkshift = '0B';
              this.paymentshift = 'T + 5';
              this.expshift = '1Y';
              this.upsidetype='';
              this.downsideType = '';
              this.downsidePutGearing = '100.00';
              this.capitalprotection='100.00';
              this.downRebate='3.00';
              if (this.defaultvaluesArr && this.defaultvaluesArr.length > 0) {
                this.ShareBasket = [];
                this.SelectedUnderlyingBasket = [];
                this.SelectedUnderlyingBasketArray = [];
                //console.log(this.defaultvaluesArr);
                this.setdefaultvalues();
              }

              // tslint:disable-next-line: max-line-length
              // this.stkdate = this.stkdate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
              this.Dates = await this.EcHome.BBVAGetDates('', '0B', '');
              if (this.Dates) {
                  this.todayDate = this.EcCommon.formatDate(this.Dates.MaturityDate);

              }

              this.Dates = await this.EcHome.BBVAGetDates(this.Exchange(), '0B', '');
              if (this.Dates) {
                  this.stkdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
                  // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
              }

            //   this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, '5B', this.stkdate);
            this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
              this.settdate = this.EcCommon.formatDate(this.Dates.MaturityDate); //Changes done by Jyoti S || 08-May-2023

              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

            //   this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, '1Y', this.settdate);
            //   this.expdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
            // this.Dates =await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? '' : this.Tenor), this.settdate);
            this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate); // Changed by Jyoti S || 09-May-2023
            if (this.Dates) {
              this.expdate = this.EcCommon.formatDate(this.Dates.MaturityDate);//Changes done by Jyoti S || 08-May-2023
              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
            }
              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

              this.sortedAllPrices = [];

            //   this.EcCommon.Currency.subscribe(cu => this.ddlNoteCcy = cu);
            //   this.CCY.push('EUR');
            //   this.ReceivedCCY = await this.EcHome.CCY;
            //   console.log("YASH", this.ReceivedCCY);
              
            //   try {
            //       this.ReceivedCCY.forEach((element) => {
            //           const ccyData = element.Ccy;
            //           this.CCY.push(ccyData);
            //       });
            //   } catch (error) {

            //   }
            //   this.CCY.splice(0, 1);
            //   this.ddlNoteCcy = 'EUR';

              this.users = await this.EcHome.GetMappedUsersAndGroups();

              // const res = this.EcHome.GetPriceProviderDetails('ReverseConvertible');
             //   const res: any = await this.EcHome.GetPriceProviderDetails('Participation'); 
                const res: any = await this.EcHome.GetPriceProviderDetails(this.templateMappingArr?.length > 0 ? this.templateMappingArr[0].template : 'Participation'); // Changed by Jyoti S || 02-May-2023

              for (let i = 0; i < res.length; i++) {
                const currCPdocStatus = this.docSupportStatus?.[res[i]];
                  // for (let i = 0; i < 1; i++) {
                  this.priceProvidersArr.push({
                      lp: res[i],
                      rfq: '',
                      price: '-',
                      timer: this.defaultOrderTimeout, //this.startCountDown(this.defaultTimeout, i),
                      id: '',
                      status: '',
                      NoteMasterID: '',
                      TSFlag: false,
                      Msg: '',
                      KIDFlag: false,
                      TSMsg: '',
                      timeStartFlag: false,
                      priceChkFlg: false,
            loadFlag: false,
                      TSLoadFlag: false, //Added by Apurva K|| 02-May-2023
                      KIDLoadFlag: false,  //Added by Apurva K|| 09-May-2023
                      ViewKIDFlag: false,  //Added by Jyoti S || 25-May-2023
                      ViewTSFlag: false,  //Added by Jyoti S|| 25-May-2023
                      TSDisableFlag: false, //Added by Apurva K|| 22-May-2023
                      KidDisableFlag: false,  //Added by Apurva K|| 22-May-2023
                      KidNotSupported: !(currCPdocStatus?.["KID"] === "Y"),
                      TSNotSupported: !(currCPdocStatus?.["Indicative_Termsheet"] === "Y"),
                  });
                  this.priceProvidersArrCpy.push({
                      lp: res[i],
                      rfq: '',
                      price: '-',
                      timer: this.defaultOrderTimeout, //this.startCountDown(this.defaultTimeout, i),
                      id: '',
                      status: '',
                      NoteMasterID: '',
                      TSFlag: false,
                      Msg: '',
                      KIDFlag: false,
                      TSMsg: '',
                      timeStartFlag: false,
                      priceChkFlg: false,
            loadFlag: false,
                      TSLoadFlag: false, //Added by Apurva K|| 02-May-2023
                      KIDLoadFlag: false,  //Added by Apurva K|| 09-May-2023
                      ViewTSFlag: false,  //Added by Jyoti S|| 25-May-2023
                      ViewKIDFlag: false,  //Added by Jyoti S || 25-May-2023
                      TSDisableFlag: false, //Added by Apurva K|| 22-May-2023
                      KidDisableFlag: false,  //Added by Apurva K|| 22-May-2023
                      KidNotSupported: !(currCPdocStatus?.["KID"] === "Y"),
                      TSNotSupported: !(currCPdocStatus?.["Indicative_Termsheet"] === "Y"),
                  });
              }

              const that = this;
              this.ptcPriceSubscription = this.EcCommon.PTCSignalRPrices.subscribe(res => {
                  const prices = res.price;
                  if (prices && prices.length > 0) {

                      this.sortedAllPrices = [];
                      this.AllPrices = [];
                      // tslint:disable-next-line: prefer-for-of
                      for (let i = 0; i < prices.length; i++) {
                          for (let k = 0; k < this.priceProvidersArr.length; k++) {
                              if (prices[i].ppID === this.priceProvidersArr[k].lp) {
                                  this.priceProvidersArr[k].price = ((prices[i].status + '').toUpperCase() === 'TIMEOUT' && (this.priceProvidersArr[k].price === '' || this.priceProvidersArr[k].price === '-')) ? 'Timeout' :
                                      ((prices[i].value === null || prices[i].value === '') ? ((prices[i].status + '').toUpperCase() === 'REJECTED' ? 'Rejected' : ((prices[i].status + '').toUpperCase() === 'UNSUPPORTED' ? 'Unsupported'
                                          : ((prices[i].status + '').toUpperCase() === 'EXPIRED' ? 'Expired' : '-'))) : ((prices[i].value !== null && prices[i].value !== '' && (prices[i].status + '').toUpperCase() === 'EXPIRED') ? 'Expired' :
                                              (prices[i].value !== null && prices[i].value !== '' && (prices[i].status + '').toUpperCase() === 'CANCELLED') ? 'Cancelled' : prices[i].value));
                                              if(this.priceProvidersArr[k].price !== '-'){
                                                this.priceProvidersArr[k].loadFlag = false
                                              }
                                              this.priceProvidersArr[k].rfq = prices[i].rfqID;
                                  this.priceProvidersArr[k].id = prices[i].id;
                                  this.priceProvidersArr[k].status = prices[i].status;
                                  this.priceProvidersArr[k].NoteMasterID = prices[i].noteMasterID;
                                  this.priceProvidersArr[k].minLimit = prices[i].minLimit;
                                  this.priceProvidersArr[k].maxLimit = prices[i].maxLimit;
                                  this.priceProvidersArr[k].bestYN = prices[i].bestYN;
                                  this.priceProvidersArr[k].remark = prices[i].remark;
                                  this.priceProvidersArr[k].isSpreadEntityYN = prices[i].isSpreadEntityYN;
                                  this.priceProvidersArr[k].modifiedValue = prices[i].modifiedValue;
                                  // quote expired timeout chnages by suvarna P || 31Mar2022 || assigned by Pranav D || start
                                  this.priceProvidersArr[k].EP_Quote_Response_At = prices[i].EP_Quote_Response_At;
                                  this.priceProvidersArr[k].EP_ValidUntilTime = prices[i].EP_ValidUntilTime;
                              }
                          }

                          if (this.AllPrices.findIndex(record => record.rfq === prices[i].rfqID) === -1) {
                              if (prices[i].value !== null && prices[i].value !== "") {
                                  this.AllPrices.push({
                                      rfq: prices[i].rfqID,
                                      lp: prices[i].ppID,
                                      //Price: (prices[i].value === null ? 'Rejected' : prices[i].value),
                                      Price: (prices[i].value === null ? '-' : prices[i].value),
                                      solveFor: prices[i].solveFor,
                                      NoteMasterID: prices[i].noteMasterID,
                                      id: prices[i].id,
                                      status: prices[i].status,
                                      bestYN: prices[i].bestYN,
                    remark: prices[i].remark,
                                      // quote expired timeout chnages by suvarna P || 31Mar2022 || assigned by Pranav D || start
                                      EP_Quote_Response_At: prices[i].EP_Quote_Response_At,
                                      EP_ValidUntilTime: prices[i].EP_ValidUntilTime
                                  });
                              }
                          }
                      }



                      // this.sortedAllPrices = this.AllPrices;//.sortBy('Price');
                      var idxBest = this.AllPrices.findIndex(item => item.bestYN === 'Y');
                      if (idxBest > -1) {
                          //  this.sortedAllPrices = this.AllPrices.PHXsortBy('Price');
                          this.sortedAllPrices = this.AllPrices.filter(item => item.bestYN === 'Y');
                      }

                      // set sortedAllPrices array on reprice action - added by PriyaL on  25-Feb-2022 - assigned by Pranav D.
                      if (this.sendtocptyflag) {
                          this.sortedAllPrices = this.AllPrices;
                      }


                      if (this.sortedAllPrices && this.sortedAllPrices[0]) {
                          var idx = this.priceProvidersArr.findIndex(item => item.lp == this.sortedAllPrices[0].lp);
                          // //console.log(idx);
                          // if(idx > 0){
                          // array_move(this.priceProvidersArr, idx, 0)
                          this.bestLPArray = this.priceProvidersArr[idx];
                          this.bestLPArray.idx = idx
                      }

                      this.buttonList = '';
                      if (this.sortedAllPrices.length > 0) {
                          if (this.sortedAllPrices.length > 0 && this.sortedAllPrices[0].Price !== ''
                              && this.sortedAllPrices[0].Price !== '-' && this.sortedAllPrices[0].Price !== 'Timeout'
                              && this.sortedAllPrices[0].Price > 0 && this.sendtocptyflag) {
                              this.shwRepriceBookOrder = true;
                          }
                          that.loadflag = false;
                          let price = '';
                          if (this.sortedAllPrices[0].Price !== 'Rejected' && this.sortedAllPrices[0].Price !== 'Unsupported' && this.sortedAllPrices[0].Price !== 'Expired' && this.sortedAllPrices[0].Price !== 'Cancelled') {
                              price = parseFloat(this.sortedAllPrices[0].Price).toFixed(2);
                          }
                          if (price !== '') {
                if (this.sortedAllPrices[0].solveFor !== 'PutStrike') {
                              if (this.elem.nativeElement.querySelector('#txt' + this.sortedAllPrices[0].solveFor)) {
                                  this.elem.nativeElement.querySelector('#txt' + this.sortedAllPrices[0].solveFor).classList.add('reply');
                              }
                } else {
                  this.elem.nativeElement.querySelector('#txtStrike').classList.add('reply');
                          }

              }
                          that.NoteMasterID = this.sortedAllPrices[0].NoteMasterID;
                          that.orderID = this.sortedAllPrices[0].id;
                          that.orderStatus = this.sortedAllPrices[0].status;

                      }
                      if (this.sortedAllPrices.length === this.priceProvidersArr.length) {
                          that.timeLeft = 0;
                      }

                      // if (this.sortedAllPrices.length > 0) {
                      //     this.timeLeft = -1;
                      //     this.timeoutMsg = '';

                      //     clearInterval(this.interval);
                      // }
                      // if (this.timeLeft === 0) {
                      //     this.sortedAllPrices = [];
                      //     // this.loadflag = false;
                      // } else {
                      //     this.timeoutMsg = '';
                      // }
                  }
                  const today = new Date();
                  if (Date.parse(this.stkdate) > Date.parse(moment().format("YYYY-MM-DD"))) {
                      that.bookOrderFlag = false;
                  }
                  // stop timer if price is unsupported - added by Priya L on 17Dec2021
                  this.priceProvidersArr.forEach(item => {
                      var idx = this.priceProvidersArr.findIndex(item1 => item1.lp == item.lp);
                      if (item.price === 'Unsupported' || item.price === 'Expired' || item.price === 'Cancelled') {
                          item.timer = '';
                          clearInterval(item.interval1);
                          item.timeStartFlag = false;
                      }
                  });
              });

              this.route.params.subscribe
                  (async params => {
                      if (params.RFQ_ID) {
                          let preQuoteData1: any;
                          preQuoteData1 = await this.EcHome.getPreviousQuoteCloneData(params.RFQ_ID, 'RFQID');
                          if (this.EcCommon.isEmptyObject(preQuoteData1)) {
                              this.ErrorMsgTop = 'No data found for this record.';
                          } else {
                              // viewOnly
                              this.viewOnly = params.viewOnly ? true : false;
                              this.viewRFQ = params.RFQ_ID;
                            this.setPrevQuoteData1(preQuoteData1.cloneData, this.viewOnly);
                          }
                      }
                      if (params.BBVAID) {
                          let preQuoteData1: any;
                          preQuoteData1 = await this.EcHome.getPreviousQuoteCloneData(params.BBVAID, 'BBVAID');
                          if (this.EcCommon.isEmptyObject(preQuoteData1)) {
                              this.ErrorMsgTop = 'No data found for this record.';
                          } else {
                              // viewOnly
                              this.viewOnly = params.viewOnly ? true : false;
                              this.setPrevQuoteData1(preQuoteData1.cloneData, this.viewOnly);
                          }
                      }
                      if (params.PORTFOLIO_ID) {
                          this.portfolioId = params.PORTFOLIO_ID;
                          const saveQuoteData = await this.EcHome.getRedirectionData(params.PORTFOLIO_ID,'Participation');
                          if (saveQuoteData.length === 0) {
                              this.ErrorMsgTop = 'No data found for this record.';
                          } else {
                              // viewOnly
                              this.viewOnly = params.viewOnly ? true : false;
                 this.setSaveQuoteData(saveQuoteData[0], this.viewOnly);
                          }
                      }
                      if (params.Tenor) {
                          this.expshift = params.Tenor;
                      }
                      if (params.Underlyings) {
                          // multiple shares issue when redirecting from home || by Suvarna P || 21Mar2022 || assign by Pranav D
                          this.ShareBasket = [];
                          this.SelectedUnderlyingarray = [];
                          this.SelectedUnderlyingBasketArray = [];
                          var list: string[] = params.Underlyings.split(",")
                          for (var each of list) {
                            this.showUnderlying("event", SearchUnderlyingPipe.prototype.transform(this.shares, each)[0]);
                          }

                      }

                  });
              //console.log(this.PrevQuoteShowOrderPopUp);
              if (this.PrevQuoteShowOrderPopUp) {

                  this.showOrderDetailsFromPrevQuote();
                  $('#loading').hide();
                  return false;
              }

              if (this.viewRFQID && this.viewRFQID !== '') {

                  if (this.viewRFQID) {
                      let preQuoteData1: any;
                      preQuoteData1 = await this.EcHome.getPreviousQuoteCloneData(this.viewRFQID, 'RFQID');
                      if (this.EcCommon.isEmptyObject(preQuoteData1)) {
                          this.ErrorMsgTop = 'No data found for this record.';
                      } else {
                          // viewOnly
                          this.viewOnly = true;
                          if (parseInt(this.Order_Notional) < parseInt(preQuoteData1.cloneData.MinNotional[0])) {
                              this.minNotionalConfirm = true;
                          }
                          this.viewRFQ = this.viewRFQID;
                          if (this.sendtocptyflag && this.Order_Notional && this.Order_Notional !== '') {
                              preQuoteData1.cloneData.InputRequestedSize[0] = this.EcCommon.formatNotional(this.Order_Notional);
                          }
              this.setPrevQuoteData1(preQuoteData1.cloneData, this.viewOnly);
                          this.RepriceIssuer = preQuoteData1.cloneData.PPCODE[0];
                      }
                  }
                  $('#loading').hide();
                  return false;
              }
              this.pageloadflag=false;
          });
          
          this.EcHome.prevQuoteLaunchPopUpRMWObs.subscribe((res: any) => {
              this.prevQuoteLaunchPopUp = res[0];
          });

          // Handled close launch product subscriber to clear the price || PriyaL || 05Apr2022 || Assigned by PranavD
          this.EcHome.closeLaunchProductObs.subscribe((res: any) => {
              if (res) {
                  this.timeLeft = -1;
                  this.timeoutMsg = '';
                  this.clearFlag = true;
                  clearInterval(this.interval);

                  this.TSFlag = false;
                  //clearInterval(this.TSInterval);
                  this.clearAllDocIntervals();
                  this.sortedAllPrices = [];
                  this.AllPrices = [];

                  this.bestLPArray = [];
                  //this.priceProvidersArr = [];
                  this.priceProvidersArr.forEach(element => {


                      if (element.interval1) {

                          element.interval1 = clearInterval(element.interval1);
                          element.timeStartFlag = false;
                      }



                      element.rfq = '';
                      element.price = '-';
                      element.timer = this.defaultOrderTimeout; //this.startCountDown(this.defaultTimeout, i),
                      element.id = '';
                      element.status = '';
                      element.NoteMasterID = '';
                      element.TSFlag = false;
                      element.Msg = '';
                      element.KIDFlag = false;
                      element.TSMsg = '';
                      element.loadFlag = false;// Yash A.

                  }
                  );
              }
          });

      } catch (error) {
          //console.log('Error:', error);
      }

  }

  onchangeProduct() {
    try {
        if (this.participationType === 'Guaranteed Capital') {
            if (this.SolveForvalue === 'DownsideStrike' || this.SolveForvalue === 'DownsideBarrierLevel' || this.SolveForvalue === 'LowerStrike' || this.SolveForvalue === 'Leverage') {
                this.SolveForvalue = 'IBPrice';
            }
        }

        if (this.participationType !== 'Twin Win') {
            if (this.SolveForvalue === 'DownsideStrike + LowerStrike') {
                this.SolveForvalue = 'IBPrice';
            }
        }

        this.reset();
        this.infoMsg = '';
        this.downsideType = '' //downsideType to be blank | Anubhav Goyal | 11-Sep-2023 | BBVAEPCLI-687 Participation: Twin Win KG UI changes 
        this.downsidePutGearing = ''
        this.capitalprotection='100.00'; //  BBVAEPCLI-687 ||RadhaM || 7-11-2023
        if (this.participationType === 'Guaranteed Capital') {
            //START Added by Radha M  || BBVAEPCLI-687 ||08-12-23|| Participation: Twin Win KG UI changes
            this.minCouponYN='Y';
                this.upCoupon='0.00';
            this.upBarrierType='None';
            this.upperStrikeYN='N';
            this.upUpperStrike='';
            this.upsidetype='';
            //END Added by Radha M  || BBVAEPCLI-687 ||08-12-23|| Participation: Twin Win KG UI changes
            this.capitalGuaranteed = '100.00';
            this.guaranteedCoupon = '0.00';
            this.guaranteedCouponFreq = 'At Maturity';
            this.downLeverage = '100.00';
            this.downStrike = '';
            this.downLowerStrike = '';
            this.downLeverageYN = '';
            this.downBarrierType = '';
            this.downBarrierLevel = '';

        } else {
            this.capitalGuaranteed = '';
            this.guaranteedCoupon = '';
            this.guaranteedCouponFreq = '';
            this.downLeverage = '100.00';
            this.downStrike = '';
            this.downLowerStrike = '';
            if (this.participationType === 'Booster') {
                //START Added by Radha M  || BBVAEPCLI-687 ||08-12-23|| Participation: Twin Win KG UI changes
                this.minCouponYN='Y';
                this.upCoupon='0.00';
                this.upBarrierType='None';
                this.upperStrikeYN='N';
                this.upUpperStrike='';
                this.upsidetype='';
                //END Added by Radha M  || BBVAEPCLI-687 ||08-12-23|| Participation: Twin Win KG UI changes
                this.downLowerStrike='70.00';
                this.downStrike = '100.00';
                this.lowerStrikeYN = 'Y';
                this.downLeverageYN = 'N';
            } else {
                // this.downLowerStrike = '';
                this.lowerStrikeYN = 'Y';
                this.downLeverageYN = 'N'; //BBVAEPCLI-687 || RadhaM || 17-11-23
            }
            // Added condition to check this.participationType === 'TwinWin KG' : Anubhav Goyal | 11-Sep-2023 | BBVAEPCLI-687 Participation: Twin Win KG UI changes 
            if (this.participationType === 'Twin Win' || this.participationType === 'TwinWin KG') {
                this.downStrike = '100.00';
                this.downBarrierType = 'At Expiry';
                this.downBarrierLevel = '100.00';
            }
            if (this.participationType === 'Booster') {
                this.downBarrierType = 'None';
                this.downBarrierLevel = '';

            }
            // START: Anubhav Goyal | 11-Sep-2023 | BBVAEPCLI-687 Participation: Twin Win KG UI changes 
            if (this.participationType === 'TwinWin KG') {
                //START Added by Radha M  || BBVAEPCLI-687 ||08-12-23|| Participation: Twin Win KG UI changes
                this.upBarrierType='';
                this.upsidetype='Call Spread';
                //END Added by Radha M  || BBVAEPCLI-687 ||08-12-23|| Participation: Twin Win KG UI changes
                this.downsideType = 'Put' //11-Sep-2023
                this.downLowerStrike='';
                this.downsidePutGearing = '100.00';
                this.downStrike = '100.00'; //RadhaM || 16-11-23 BBVAEPCLI-687
                this.downLeverage = '100.00' //BBVAEPCLI-687 || RadhaM || 17-11-23
                this.upUpperStrike='100.00'//Added by Radha M  || BBVAEPCLI-687 ||08-12-23|| Participation: Twin Win KG UI changes
            }
            //START Added by Radha M  || BBVAEPCLI-687 ||08-12-23|| Participation: Twin Win KG UI changes
            if(this.participationType =='Twin Win'){
                this.upBarrierType='None';
                this.upsidetype='';
                this.upperStrikeYN='N';
                this.upUpperStrike='';
                this.minCouponYN='Y';
                this.upCoupon='0.00';
            }
            //END Added by Radha M  || BBVAEPCLI-687 ||08-12-23|| Participation: Twin Win KG UI changes
            // END: Anubhav Goyal | 11-Sep-2023 | BBVAEPCLI-687 Participation: Twin Win KG UI changes 
            this.downbarrierTypeChange();
            this.changedownLeverageYN();
            this.changelowerStrikeYN('Y');
        }


    } catch (error) {
         
    }
}


  fnGetValidation() {
      try {

          this.validationArr = this.EcHome.validationArr;
          if (this.validationArr) {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < this.validationArr.length; i++) {

                  switch (this.validationArr[i].Setting_Name) {
                    //Start || Avinash G || 10-Apr-2024 || HSBCECCLI-119 || Warning on screen if Issue Date Offset is less than a configured value || Config Based Issue Date offset Warning Message Display asked by Nitish K
                    case 'MinimumAllowedIssueDateOffset':
                        this.MinimumAllowedIssueDateOffset= this.validationArr[i].Default_Value;
                        break;
                    //End || Avinash G || 10-Apr-2024 || HSBCECCLI-119 || Warning on screen if Issue Date Offset is less than a configured value || Config Based Issue Date offset Warning Message Display asked by Nitish K

              
                      case 'EQ_Upside_MinGearing':
                          this.upMinGearing = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Upside_MaxGearing':
                          this.upMaxGearing = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Upside_MinStrike':
                          this.upMinStrike = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Upside_MaxStrike':
                          this.upMaxStrike = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Upside_MinUpperStrike':
                          this.upMinUpperStrike = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Upside_MaxUpperStrike':
                          this.upMaxUpperStrike = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Upside_MinBarrierLevel':
                          this.upMinBarrierLevel = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Upside_MaxBarrierLevel':
                          this.upMaxBarrierLevel = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Upside_MinRebate':
                          this.upMinRebate = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Upside_MaxRebate':
                          this.upMaxRebate = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Upside_MinCoupon':
                          this.upMinCoupon = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Upside_MaxCoupon':
                          this.upMaxCoupon = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Downside_MinStrike':
                          this.downMinStrike = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Downside_MaxStrike':
                          this.downMaxStrike = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Downside_MinLowerStrike':
                          this.downMinLowerStrike = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Downside_MaxLowerStrike':
                          this.downMaxLowerStrike = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Downside_MinBarrierLevel':
                          this.downMinBarrierLevel = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Downside_MaxBarrierLevel':
                          this.downMaxBarrierLevel = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_MinReOfferPricePercentage':
                          this.minReoffer = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_DefaultRFQTimeOut_Ang':
                          this.defaultRFQTimeout = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_OrderValidityTimer_Ang':
                          this.defaultOrderTimeout = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Downside_MinLeverage':
                          this.mindownLeverage = this.validationArr[i].Default_Value;
                          break;

                      case 'EQ_Downside_MaxLeverage':
                          this.maxdownLeverage = this.validationArr[i].Default_Value;
                          break;
                      case 'EQ_Show_Order_RM':
                          if (this.validationArr[i].Config_Value !== '') {
                              if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                                  this.EQ_Show_Order_RM = this.validationArr[i].Config_Value;
                              }
                          } else {
                              this.EQ_Show_Order_RM = this.validationArr[i].Default_Value;
                          }
                          break;
                      case 'EQ_Show_Order_Customer':
                          if (this.validationArr[i].Config_Value !== '') {
                              if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                                  this.EQ_Show_Order_Customer = this.validationArr[i].Config_Value;
                              }
                          } else {
                              this.EQ_Show_Order_Customer = this.validationArr[i].Default_Value;
                          }

                          break;
                      case 'EQ_Login_Client_Mapping':
                          if (this.validationArr[i].Config_Value !== '') {
                              if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                                  this.EQ_Login_Client_Mapping = this.validationArr[i].Config_Value;
                              }
                          } else {
                              this.EQ_Login_Client_Mapping = this.validationArr[i].Default_Value;
                          }
                          break;
                      //  Added new entity config to show/hide Launch button || PriyaL || 05Apr2022 || Assigned by PranavD
                      case 'EQ_Show_Launch_Button':
                          if (this.validationArr[i].Config_Value !== '') {
                              if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                                  this.EQ_Show_Launch_Button = this.validationArr[i].Config_Value;
                              }
                          } else {
                              this.EQ_Show_Launch_Button = this.validationArr[i].Default_Value;
                          }
                          break;
                      //  Added new entity config to show/hide Order button || PriyaL || 05Apr2022 || Assigned by PranavD
                      case 'EQ_Show_Order_Button':
                          if (this.validationArr[i].Config_Value !== '') {
                              if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                                  this.EQ_Show_Order_Button = this.validationArr[i].Config_Value;
                              }
                          } else {
                              this.EQ_Show_Order_Button = this.validationArr[i].Default_Value;
                          }

                          break;


                      //  Added new entity config to show/hide TS button || Amogh K || 19Apr2022 || Assigned by PranavD
                      case 'EQ_Show_Termsheet_Button':
                          //console.log("TS button ", this.validationArr[i], this.EcCommon.getLoggedInUserName()[1].EntityId)
                          if (this.validationArr[i].Config_Value !== '') {
                if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                  this.EQ_Show_Termsheet_Button = this.validationArr[i].Config_Value;
                }
                              if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                                  this.EQ_Show_Termsheet_Button = this.validationArr[i].Config_Value;
                              }
                          } else {
                              this.EQ_Show_Termsheet_Button = this.validationArr[i].Default_Value;
                          }

                          break;

                      //  Added new entity config to show/hide KID button || Amogh K || 21Apr2022 || Assigned by PranavD
                      case 'EQ_Show_KID_Button':
                          //console.log("TS button ", this.validationArr[i], this.EcCommon.getLoggedInUserName()[1].EntityId)
                          if (this.validationArr[i].Config_Value !== '') {
                              if ((this.validationArr[i].Entity_Id === AppConfig.settings.oRes.homeEntityID)) {
                                  this.EQ_Show_KID_Button = this.validationArr[i].Config_Value;
                              }
                          } else {
                              this.EQ_Show_KID_Button = this.validationArr[i].Default_Value;
                          }
          
                          break;

                  }
              }

          }
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  async fnGetProdTemplate() {
    try {

        this.templateMappingArr = await this.EcHome.fnGetProdTemplate('Participation');
      
      } catch (error) {
        //console.log('Error:', error);
      }
  }

  setDefaultSolveForValues(solveFor: any) {
    try {

        if (this.IBPrice === '' && solveFor !== 'IBPrice') {
            if (this.format === 'Swap') {
                this.IBPrice = '0.00';
            } else {
                this.IBPrice = '99.50';
            }
        }

        if (this.upStrike === '' && solveFor !== 'UpsideStrike') {
            this.upStrike = '100.00';

        }

        if (this.upBarrierLevel === '' && solveFor !== 'UpsideBarrierLevel') {
            if (this.upBarrierType === 'None') {
                this.upBarrierLevel = '';
                this.upRebate = '';
            } else {
                this.upGearing = '100.00';
                if (this.upBarrierLevel === '') {
                    this.upBarrierLevel = '110.00';
                }
                if (this.upRebate === '') {
                    this.upRebate = '0.00';
                }

            }
        }

        if (this.upGearing === '' && solveFor !== 'UpsideGearing') {
            this.upGearing = '100.00';
        }

        if (this.upUpperStrike === '' && solveFor !== 'UpperStrike') {
            if (this.upperStrikeYN === 'Y') {
                this.minCouponYN = 'N';
                this.upCoupon = '';
                this.upUpperStrike = '110.00';
                this.upBarrierType = 'None';
            } else {
                this.upUpperStrike = '';
                this.minCouponYN = 'Y';
                this.upCoupon = '0.00';
            }

        }
        if (this.upRebate === '' && solveFor !== 'Rebate') {
            if (this.upBarrierType === 'None') {
                this.upRebate = '';
            } else {
                if (this.upRebate === '') {
                    this.upRebate = '0.00';
                }

            }
        }

        if (this.downStrike === '' && (solveFor !== 'DownsideStrike' && solveFor !== 'DownsideStrike + LowerStrike')) {
            this.downStrike = '100.00';
        }


        if (this.downBarrierLevel === '' && solveFor !== 'DownsideBarrierLevel') {
            if (this.downBarrierType === 'None') {
                this.downBarrierLevel = '';
            } else {
                if (this.downBarrierLevel === '' && solveFor !== 'DownsideBarrierLevel') {
                    this.downBarrierLevel = '100.00';
                } else {
                    this.downBarrierLevel = '';
                }

            }
        }

        if (this.downLowerStrike === '' && (solveFor !== 'LowerStrike' && solveFor !== 'DownsideStrike + LowerStrike')) {
            if (this.participationType === 'Booster') {
                if (this.lowerStrikeYN === 'Y') {
                    this.downLowerStrike = '70.00';
                } else {
                    this.downLowerStrike = '';

                }
            } else if (this.participationType === 'Twin Win') {
                this.downLowerStrike = '70.00';

            } else {
                this.downLowerStrike = '';

            }

        }

        if (this.downLeverage === '' && solveFor !== 'Leverage') {
            if (this.participationType === 'Booster') {
                if (((this.lowerStrikeYN === 'Y' && this.downLeverageYN === 'Y')
                    || (this.lowerStrikeYN === 'N' && this.downLeverageYN === 'Y'))
                    && solveFor !== 'DownsideStrike' && solveFor !== 'DownsideStrike + LowerStrike') {
                    this.downLeverage = ((1 / parseFloat(this.downStrike)) * 10000).toFixed(2);
                } else {
                    this.downLeverage = '100.00';
                }
            } else {
                this.downLeverage = '100.00';
            }
        }


    } catch (error) {
         
    }
}
  setSelectedUnderlyingarray(LongName: string, Ccy: string, Code: string, ExchangeCode: string,
      Exchangename: string, ISINname: string, Last1yearHighValue: string, Last1yearLowValue: string,
      Spot: string, RiskRating: any, RICCode: any) {
      try {
          this.SelectedUnderlyingarray.push({ LongName, Ccy, Code, ExchangeCode, Exchangename });
          this.SelectedUnderlyingBasketArray.push({
              LongName, Ccy, Code, ExchangeCode, Exchangename,
              ISINName: ISINname, Last1yearHighValue, Last1yearLowValue, Spot, Riskrating: RiskRating, RICCode: RICCode
          });
          this.updateShareBasket();
      } catch (error) {
          //console.log('Error:', error);
      }
  }
  updateShareBasket() {
      try {
          if (this.SelectedUnderlyingBasketArray[0] === undefined) {
              this.SelectedUnderlyingBasket.UnderlyingOne = {};
          } else {
              this.SelectedUnderlyingBasket.UnderlyingOne = this.SelectedUnderlyingBasketArray[0];
          }
          if (this.SelectedUnderlyingBasketArray[1] === undefined) {
              this.SelectedUnderlyingBasket.UnderlyingTwo = {};
          } else {
              this.SelectedUnderlyingBasket.UnderlyingTwo = this.SelectedUnderlyingBasketArray[1];
          }
          if (this.SelectedUnderlyingBasketArray[2] === undefined) {
              this.SelectedUnderlyingBasket.UnderlyingThree = {};
          } else {
              this.SelectedUnderlyingBasket.UnderlyingThree = this.SelectedUnderlyingBasketArray[2];
          }
          if (this.SelectedUnderlyingBasketArray[3] === undefined) {
              this.SelectedUnderlyingBasket.UnderlyingFour = {};
          } else {
              this.SelectedUnderlyingBasket.UnderlyingFour = this.SelectedUnderlyingBasketArray[3];
          }
          if (this.SelectedUnderlyingBasketArray[4] === undefined) {
              this.SelectedUnderlyingBasket.UnderlyingFive = {};
          } else {
              this.SelectedUnderlyingBasket.UnderlyingFive = this.SelectedUnderlyingBasketArray[4];
          }

      } catch (error) {
          //console.log('Error:', error);
      }
  }

  ChangeIndex(e) {
      try {
        if (e.keyCode === 32 && this.ShareName == undefined) {
            e.preventDefault();
        }//Added by Varsha G || FIN1EURINT-581 || 09-Aug-2023 
          this.selectedShareIndex = 0;
          this.flag = true;
          this.shareCode = '';
          this.selectedBIndex = 0;
          this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
      } catch (error) {
          //console.log('Error:', error);
      }
  }
  selectShare(e) {
      try {
          this.flag = false;
          if ($('.HoverSuggestion').data('share') !== undefined) {
              this.shareCode = $('.HoverSuggestion').data('share');
          }
          if (this.shareCode !== undefined && this.shareCode !== '') {
              this.showUnderlying('', SearchUnderlyingPipe.prototype.transform(this.shares, this.shareCode)[0]);
          }
      } catch (error) {
          //console.log('Error:', error);
      }
  }
  backKeyPress(e) {
      try {
          // this.flag = false;
          // this.shareCode = '';
          // this.selectedBIndex = 0;
          this.selectedShareIndex = 0;
          this.flag = true;
          this.shareCode = '';
          this.selectedBIndex = 0;
          this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;

          if (this.ShareName.length === 1) {
              this.showSuggestions = false;
              this.flag = false;
          }
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  showUnderlying(event, item) {
    try {
      this.reset();
      this.flag = false;
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      this.ShareName = '';
      if (this.ShareBasket.length <= 3) {
        if (this.ShareBasket.find(i => i.Code === item.BloombergCode) === undefined) {
          this.ShareBasket.push({ Code: item.BloombergCode, LongName: item.LongName, Weight: '', Exchange: item.ExchangeCode, RICCode: item.Code , CCY: item.Ccy });
          this.setSelectedUnderlyingarray(item.LongName, item.Ccy, item.BloombergCode,
            item.ExchangeCode, item.ExchangeName, '', '', '', '', '', item.Code);
        } else {
          return false;
        }
      }
      if (this.ShareBasket.length > 0) {
        $("#txtShare").next(".error-input").remove();
        $("#txtShare").next(".validate-popup").remove();
        $('#txtShare').css("text-indent", "0px")
        document.getElementById('txtShare').classList.remove('underlyingError');
        document.getElementById('txtShare').classList.add('longText');
      }

      if (this.ShareBasket.length === 1) {
        if (event == '')
        this.ddlNoteCcy = item.Ccy;
        this.UnderlyingCurrency = item.Ccy;
        this.ddlNoteCcy = item.Ccy;
      }
      else{        
        if (event == '')
        this.ddlNoteCcy = this.ShareBasket[this.ShareBasket.length -1].CCY;
        this.UnderlyingCurrency = this.ShareBasket[this.ShareBasket.length -1].CCY;
      }

      this.txtTenorDateChange('Payment');

    } catch (error) {
      //console.log('Error:', error);
    }
  }


  async Price() {
      try {
          $(".validate-popup").each(function () {
              $(this).remove();
          });
          $(".error-input").each(function () {
              $(this).remove();
          });
      this.ErrorMsgTop = '';
      this.ErrorMsgTop = '';
          await this.validationOnButton(); // added `await` keyword || FIN1EURINT-581 || Kaustubh S || 09-Aug-2023 
          if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
            this.reset();
            this.priceBtnActive = 'N' //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
            this.loadflag = true;
            this.pageloadflag=false;//Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
              this.portfolioGroupID = await this.EcHome.fnportfolioGroupID();
              if (!this.priceClickFlag) {
                  this.PTCPrice('All', "0", 'N');
              }

          }
          return false;
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

  async PriceLP(LP) {
      try {
          //console.log(this.priceProvidersArr);
          $(".validate-popup").each(function () {
              $(this).remove();
          });
          $(".error-input").each(function () {
              $(this).remove();
          });

          /* commented by Suvarna P || assign by Pranav D || added later
         // cleared Pricer Provider Array on reprice action - added by PriyaL.on 25Feb2022 - assigned by Pranav D.
         this.priceProvidersArr = [];
         const res = this.EcHome.GetPriceProviderDetails(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].template : 'Participation');
         for (let i = 0; i < res.length; i++) {
             if (res[i] === res[i]) {
                 this.priceProvidersArr.push({ lp: res[i], rfq: '', price: '-', timer: '', id: '', status: '', NoteMasterID: '', TSFlag: false, Msg: '', KIDFlag: false, TSMsg: '' });

             }
         }
         */
          this.validationOnButton();

          if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
            this.priceProvidersArr.forEach(item=>{
                if(item.lp == LP){
                  this.priceProvidersArr[this.priceProvidersArr.indexOf(item)].loadFlag = true
                }
                else{
                  this.priceProvidersArr[this.priceProvidersArr.indexOf(item)].loadFlag = false
                }
              })
              this.reset();
              // this.resetReprice(LP);
              this.loadflag = true;

              this.portfolioGroupID = await this.EcHome.fnportfolioGroupID();
              // //console.log(this.priceProvidersArr);

              if (!this.priceClickFlag) {
                  // this.PTCPrice(LP);
                  if (this.sendtocptyflag) {

                      // cleared Pricer Provider Array on reprice action - added by PriyaL.on 25Feb2022 - assigned by Pranav D.
                      this.priceProvidersArr = [];
                      const res = await this.EcHome.GetPriceProviderDetails(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].template : 'Participation');
                      for (let i = 0; i < res.length; i++) {
                          if (res[i] === res[i]) {
                              this.priceProvidersArr.push({ lp: res[i], rfq: '', price: '-', timer: '', id: '', status: '', NoteMasterID: '', TSFlag: false, Msg: '', KIDFlag: false, TSMsg: '' ,TSLoadFlag: false, KIDLoadFlag: false,ViewKIDFlag: false,ViewTSFlag: false, TSDisableFlag:false, KidDisableFlag:false});//Added by Apurva K|| 02-May-2023

                          }
                      }
                      // this.ERRePrice(LP,this.NMID,'Y');
                      // this.PTCPrice(LP,this.NMID,'Y');
                      this.PTCPrice(LP, this.viewRFQID, 'Y');
                  }
                  else {
                      this.PTCPrice(LP, "0", 'N');
                  }
              }
          }
          return false;
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }


  generateXML() {
      try {
                  if (this.templateMappingArr && this.templateMappingArr.length > 0) {
              let xmlstr = '<QuoteRequest>';
              this.templateName = this.templateMappingArr[0].template;
              // tslint:disable-next-line: forin
              for (const i in this.templateMappingArr) {
                  switch (this.templateMappingArr[i].email_Header) {
                      case 'Product': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.Product + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'participationType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.participationType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'Format': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.format + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'ddlNoteCcy': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.ddlNoteCcy + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'Notional': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.Notional + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'IBPrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.IBPrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'ShareCode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.Code() + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'upBarrierType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + (this.upsidetype === 'Up and Out' ? this.upBarrierType : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'upBarrierLevel': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + ((this.upBarrierType != 'None' && this.upBarrierType != '') ? this.upBarrierLevel : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'upCoupon': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.upCoupon + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'upGearing': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.upGearing + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'upUpperStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.upUpperStrike + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'upRebate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + ((this.upBarrierType != 'None' && this.upBarrierType != '') ? this.upRebate : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'downStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.downStrike + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'downBarrierType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.downBarrierType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'settdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy')
                          + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'stkdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.datepipe.transform(this.stkdate, 'dd-MMM-yyyy')
                          + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'expdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.datepipe.transform(this.expdate, 'dd-MMM-yyyy')
                          + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'fundType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.fundType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'fundFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.fundFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'fundRate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.fundRate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'downBarrierLevel': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.downBarrierLevel + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'downLowerStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + (this.downsideType==='Put'?'':this.downLowerStrike) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'downLeverage': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.downLeverage + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'capitalGuaranteed': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.capitalGuaranteed + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'guaranteedCoupon': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.guaranteedCoupon + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'SolveForValue': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.SolveForvalue + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'upStrike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.upStrike + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'guaranteedCouponFreq': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.guaranteedCouponFreq + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'IssuePrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.issuePrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;

                      case 'SettShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                        //   + this.paymentshift + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                        + (this.paymentshift === 'Custom' ? (this.customSetDate) : (this.paymentshift === 'T + 10' ? '10' : '5')) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;

                      case 'StkShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                        //   + this.stkshift + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                        + (this.stkshift === 'Fwd' ? 'Forward' : 'Today') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;

                      case 'ExpShifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + (this.expshift === 'Custom' ? this.customTenor : this.expshift) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'customTenor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.expshift === 'Custom' ? this.customTenor : this.expshift)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;

                      case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.onBehalfOf + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'portfolioGroupID': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.portfolioGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;

                      case 'loginUser': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + AppConfig.settings.oRes.userID
                          + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'RICCode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                          + this.RICCode() + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                          break;
                      case 'priipsYN': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + this.priipsYN
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                      case 'country': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + this.country
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                      case 'language': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + this.language
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                       case 'underlyingCount': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket === undefined ? '0' : this.ShareBasket.length)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                       case 'Underlying1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[0] === undefined || this.ShareBasket[0].Code === undefined ? '' : this.ShareBasket[0].Code)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                       case 'IX1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[0] === undefined || this.ShareBasket[0].Exchange === undefined ? '' : this.ShareBasket[0].Exchange)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                       case 'Underlying2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[1] === undefined || this.ShareBasket[1].Code === undefined ? '' : this.ShareBasket[1].Code)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                            case 'IX2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[1] === undefined || this.ShareBasket[1].Exchange === undefined ? '' : this.ShareBasket[1].Exchange)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                       case 'Underlying3': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[2] === undefined || this.ShareBasket[2].Code === undefined ? '' : this.ShareBasket[2].Code)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                            case 'Underlying4': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[3] === undefined || this.ShareBasket[3].Code === undefined ? '' : this.ShareBasket[3].Code)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                       case 'IX3': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[2] === undefined || this.ShareBasket[2].Exchange === undefined ? '' : this.ShareBasket[2].Exchange)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                            case 'IX4': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[3] === undefined || this.ShareBasket[3].Exchange === undefined ? '' : this.ShareBasket[3].Exchange)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                       case 'Underlying5': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[4] === undefined || this.ShareBasket[4].Code === undefined ? '' : this.ShareBasket[4].Code)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;

                       case 'IX5': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[4] === undefined || this.ShareBasket[4].Exchange === undefined ? '' : this.ShareBasket[4].Exchange)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;

                       case 'LN1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[0] === undefined || this.ShareBasket[0].LongName === undefined ? '' : this.ShareBasket[0].LongName)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                       case 'LN2': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[1] === undefined || this.ShareBasket[1].LongName === undefined ? '' : this.ShareBasket[1].LongName)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                       case 'LN3': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[2] === undefined || this.ShareBasket[2].LongName === undefined ? '' : this.ShareBasket[2].LongName)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                       case 'LN4': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[3] === undefined || this.ShareBasket[3].LongName === undefined ? '' : this.ShareBasket[3].LongName)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                       case 'LN5': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.ShareBasket[4] === undefined || this.ShareBasket[4].LongName === undefined ? '' : this.ShareBasket[4].LongName)
                            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                       case 'downsideType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.participationType === 'TwinWin KG' ? this.downsideType : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                            case 'downsideGearing': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.participationType === 'TwinWin KG' ? this.downsidePutGearing : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;
                        case 'downRebate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.participationType === 'TwinWin KG' ? this.downRebate : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;

                        case 'capitalprotection': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + (this.participationType === 'TwinWin KG' ? this.capitalprotection : '') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;

                        case 'upsidetype': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                            + this.upsidetype + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                            break;

                  }

              }

              xmlstr += '</QuoteRequest>';
              return xmlstr;
          } else {
              return '';
          }
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  async PTCPrice(LPVal, NMID, repriceFlg) {
      try {
        this.priceBtnActive =  'N' //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
          var LP = '';
          if (LPVal == 'All') {
              let isPriceFlgChk = this.priceProvidersArr.findIndex(item => item.priceChkFlg == true);
              if (isPriceFlgChk == -1) {
                this.priceProvidersArr.forEach(item => {
                    let idx = this.priceProvidersArr.findIndex(item1 => item1.lp == item.lp);
                    this.priceProvidersArr[idx].loadFlag = true
                  });
                //   this.priceProvidersArr.forEach(item => {
                //     this.priceProvidersArr[this.priceProvidersArr.indexOf(item)].loadFlag = true
                //       var idx = this.priceProvidersArr.findIndex(item1 => item1.lp == item.lp);
          //   item.timer = this.startCountDown(this.defaultRFQTimeout, idx);
                //       // LP = 'Citi'; //'Barclays';
                //       LP = ''; //'Barclays';
                //   })
                LP = '';
              } else {
                  // //console.log(this.priceProvidersArr);
                  this.priceProvidersArr.forEach(item => {
                      if (item.priceChkFlg) {
                        let idx = this.priceProvidersArr.findIndex(item11 => item11.lp === item.lp);
                        this.priceProvidersArr[idx].loadFlag = true;
                        //this.priceProvidersArr[this.priceProvidersArr.indexOf(item)].loadFlag = true
                          LP = LP + item.lp + ',';
                          // this.txtShare = this.txtShare.trim();
                        //   var idx = this.priceProvidersArr.findIndex(item11 => item11.lp === item.lp)
                        //   item.timer = this.startCountDown(this.defaultTimeout, idx);
                      }
                  });
                  let lastCharater = LP.split('').pop();
                  if (lastCharater == ',')
                      LP = LP.substring(0, LP.length - 1);
                  // }
              }
              //  LP = '';
          }
          else {
            let idx = this.priceProvidersArr.findIndex(item1 => item1.lp == LPVal);
            if (idx > -1) {
                this.priceProvidersArr[idx].loadFlag = true
            }
            //   var idx = this.priceProvidersArr.findIndex(item1 => item1.lp == LPVal);
            //   if (idx > -1) {
            //     this.priceProvidersArr[idx].loadFlag = true // Added by Jyoti S || 02-May-2023
            //       this.priceProvidersArr[idx].timer = this.startCountDown(this.defaultTimeout, idx);
            //   }
              LP = LPVal;
          }
          this.priceClickFlag = true;
      const requestXML = this.generateXML();
          this.clearFlag = false;
          const webMethod = this.interfaceUrl + 'eqd/Quote/QuoteRequest';
          const that = this;
          const parameters = [{
            productCode: this.templateName,
            subTemplateCode: this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Participation',
            LP: LP, // this.apifunctions.priceProviders.join(','),
            requestXML,
            solveFor: this.SolveForvalue,
            loginID: AppConfig.settings.oRes.userID,
            userGroupID: AppConfig.settings.oRes.groupID,
            buyerEntityID: AppConfig.settings.oRes.homeEntityID,
            noteMasterID: NMID,
            repricereqYN: repriceFlg
          }];
          await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
            this.loadflag = false;
            if (LPVal == 'All') {
                let isPriceFlgChk = that.priceProvidersArr.findIndex(item => item.priceChkFlg == true);
                if (isPriceFlgChk == -1) {
                  that.priceProvidersArr.forEach(item => {
                    let idx = that.priceProvidersArr.findIndex(item1 => item1.lp == item.lp);
                    //that.priceProvidersArr[idx].loadFlag = true
                    that.priceProvidersArr[idx].timer = that.startCountDown(that.defaultOrderTimeout, idx);
      
                  });
                } else {
                  that.priceProvidersArr.forEach(item => {
                    if (item.priceChkFlg) {
                      let idx = that.priceProvidersArr.findIndex(item11 => item11.lp === item.lp);
                      //that.priceProvidersArr[idx].loadFlag = true;
                      that.priceProvidersArr[idx].timer = that.startCountDown(that.defaultOrderTimeout, idx);
                    }
                  });
                }
              }
              else {
                let idx = that.priceProvidersArr.findIndex(item1 => item1.lp == LPVal);
                if (idx > -1) {
                  //that.priceProvidersArr[idx].loadFlag = true // Added by Jyoti S || 02-May-2023
                  that.priceProvidersArr[idx].timer = that.startCountDown(that.defaultOrderTimeout, idx);
                }
              }
            if (data.errorMessage !== '' || !that.pageActive) {
              that.ErrorMsgTop = data.errorMessage.split('. ')[0];
              that.loadflag = false;
              that.timeLeft = 0;
              this.priceBtnActive = 'Y'
  
              this.priceProvidersArr.forEach(item=>{
                this.priceProvidersArr[this.priceProvidersArr.indexOf(item)].loadFlag = false
              })
  
              for (let i = 0; i < that.priceProvidersArr.length; i++) {
                that.priceProvidersArr[i].timer = '';
                clearInterval(that.priceProvidersArr[i].interval1);
                // this.priceProvidersArr[index].price = 'Timeout';
                that.priceProvidersArr[i].timeStartFlag = false;
              }
              return false;
            }
            
            that.rfqID = data.rfqid;
            that.noteMasterID = data.noteMasterID;
            if (!that.clearFlag) {
              that.Prices = [];
              that.timeLeft = that.defaultRFQTimeout;
              that.PPDetails = that.rfqID;
              if (that.PPDetails !== '') {
                that.priceClickFlag = false;
                if (data.rfqPPid !== '') {
                  const rfqPPID = data.rfqPPid.split(',');
                  for (let k = 0; k < rfqPPID.length; k++) {
                    if (rfqPPID[k].toString().includes(':')) {
                      const splitRFQID = rfqPPID[k].split(':');
                      const index = that.priceProvidersArr.findIndex(res => res.lp === splitRFQID[0].toString().trim());
                      if (index > -1) {
                        that.priceProvidersArr[index].rfq = splitRFQID[1];
                      }
                    }
  
                  }
                }
  
  
                /*
                      const res = that.apifunctions.GetPriceProviderDetails(that.templateMappingArr.length > 0 ? that.templateMappingArr[0].template : 'EQC_Europe');
                      for (let i = 0; i < res.length; i++) {
                        that.priceProvidersArr.push({ lp: res[i], rfq: '', price: '-', timer: that.startCountDown(that.defaultTimeout, i), id: '', status: '', NoteMasterID: '', TSFlag: false, Msg: '', KIDFlag: false, TSMsg: '' });
                      }
                */
                let quoteResponseCheck = false;
                that.interval = setInterval(async () => {
  
                  if (that.timeLeft > 0) {
                    that.timeoutMsg = '';
                    if (!quoteResponseCheck) {
                        quoteResponseCheck = await that.PTCPriceResponse(that.PPDetails);
                      }
                   
  
                    that.timeLeft = that.timeLeft - 5;
                  } else if (that.timeLeft === 0 || that.timeLeft < 0) {
                    that.loadflag = false;
                    // that.timeoutMsg = 'Timeout';
                    clearInterval(that.interval);                   
                  }
  
                }, 5000);
              }
            }
        });
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  async PTCPriceResponse(PPDetails) {
      try {

          const webMethod = this.interfaceUrl + 'eqd/Quote/CheckIfResponseReceived';
          const that = this;
          const parameters = {
            QuoteRequestID: PPDetails
          };
          return await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
            that.Prices = data;
            that.EcCommon.setPTCReceivedPrices(that.Prices, 1);
            // Added by Yash Agrawal to keep price button disabled until first price is received
            this.Prices.forEach((item) =>{
              if(item.value != ""){
                this.priceBtnActive = 'Y'; //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
              }
            })
            let invalidDataLength = data.filter((lp) => { return ['no response'].includes(lp.status.toLowerCase()) }).length;
        if (invalidDataLength > 0) {
          this.loadflag = false;
          return false;
        }
        else {
          return true;
          }
          }       
          );
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  removeShare(rownumber: any) {
      try {
          this.ShareBasket.splice(rownumber, 1);
          this.SelectedUnderlyingarray.splice(rownumber, 1);
          this.SelectedUnderlyingBasketArray.splice(rownumber, 1);
          this.updateShareBasket();
          this.reset();
      } catch (error) {
          //console.log('Error:', error);
      }

  }
  IBPricechange() {
      try {
          this.reset();
      } catch (error) {
          //console.log('Error:', error);
      }
  }
  
  //START || Added by Varsha G || To clear multiple intervals || 23-Jun-2023
  public clearAllDocIntervals(): void {
    for (const id of this.intervals) {
      this.clearDocInterval(id);
    }
    this.intervals.clear();
  }

  public clearDocInterval(id: NodeJS.Timeout): void {
    clearInterval(id);
    this.intervals.delete(id);
  }
//END || Added by Varsha G || To clear multiple intervals || 23-Jun-2023

  reset() {
      try {
          // $(".validate-popup").each(function() {
          //     $(this).remove();
          // });
          // $(".error-input").each(function() {
          //     $(this).remove();
          // });
          // $(document).bind('ajaxStart', () => {
          //     $('#loading').show();
          //   });
        this.loadflag = false;// Yash A.
        this.priceBtnActive = 'Y';// Yash A.
          this.timeLeft = -1;
          this.timeoutMsg = '';
          this.clearFlag = true;
          clearInterval(this.interval);
      this.TSFlag = false;
      //clearInterval(this.TSInterval);
          this.clearAllDocIntervals();
          if (this.ShareBasket.length > 0) {
              document.getElementById('txtShare').classList.remove('underlyingError');
              document.getElementById('txtShare').classList.add('longText');
          }
          document.querySelectorAll("#txtIBPrice ~ .error-input").forEach(node => node.remove()); // Kaustubh S || HSBCECCLI-44 || 16-Aug-2023
          this.PPDetails = '';
          this.sortedAllPrices = [];
          this.AllPrices = [];
          this.orderID = '';
          this.loadflag = false;
          this.ErrorMsg = '';
          this.ErrorMsgTop = '';
          this.rfqID = '';
          this.noteMasterID = '';
          this.saveFlag = false;
          this.quoteEmailFlg = false;
          this.successMsg = '';
          this.errorTemplateMessage = '';
          this.reqSuccessMsg = '';
          const els = document.getElementsByClassName('error');

          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < els.length; i++) {
              els[i].classList.remove('error');
          }
          document.querySelectorAll('input#txtstkdate ~ .error-input').forEach(ele => {ele.remove()});//Changes done by Varsha G || FIN1EURINT-123 || 29-May-2023
          document.querySelectorAll('div#customOffset ~ .error-input').forEach(ele => {ele.remove()});
          document.getElementById('txtShare').classList.remove('underlyingError');
          document.getElementById('txtShare').classList.add('longText');

          if (this.SolveForvalue === 'IBPrice') {

              this.IBPrice = '';
          }

          document.getElementById('txtIBPrice').classList.remove('reply');
          this.EcCommon.PTCPricesObserver.next('');
          this.EcCommon.PTCPrices = [];
          this.EcCommon.setPTCReceivedPrices({}, '');
          // //console.log(this.priceProvidersArr);
          this.bestLPArray = [];

          // this.priceProvidersArr = [];
          this.priceProvidersArr.forEach(element => {
              // lp: res[i],
              // this.priceProvidersArr[index].timeStartFlag = true;
              // if(element.timeStartFlag == true){

              if (element.interval1) {
                  // //console.log(element.interval1);
                  element.interval1 = clearInterval(element.interval1);
                  element.timeStartFlag = false;
              }


              // }
              element.rfq = '';
              element.price = '-';
              element.timer = this.defaultOrderTimeout; //this.startCountDown(this.defaultTimeout, i),
              element.id = '';
              element.status = '';
              element.NoteMasterID = '';
              element.TSFlag = false;
              element.Msg = '';
              element.KIDFlag = false;
              element.TSMsg = '';
              element.loadFlag = false;// Yash A.
              element.TSLoadFlag = false;  //Added by Apurva K|| 09-May-2023
              element.KIDLoadFlag = false; //Added by Apurva K|| 09-May-2023
              element.ViewKIDFlag = false; //Added by Jyoti S || 25-May-2023
              element.ViewTSFlag = false;  //Added by Jyoti S|| 25-May-2023
              element.TSDisableFlag = false;  //Added by Apurva K|| 09-May-2023
              element.KidDisableFlag = false; //Added by Apurva K|| 09-May-2023
          }
          );
          this.poolDetailsVisibleFlag = false;
          this.bookOrderFlag = true;
          this.priceClickFlag = false;
          if (this.SolveForvalue === 'IBPrice') {

            this.IBPrice = '';
        }


        if (this.SolveForvalue === 'UpsideStrike') {
            this.upStrike = '';
        }
        if (this.SolveForvalue === 'UpsideBarrierLevel') {
            this.upBarrierLevel = '';
        }

        if (this.SolveForvalue === 'UpsideGearing') {
            this.upGearing = '';
        }

        if (this.SolveForvalue === 'UpperStrike') {
            this.upUpperStrike = '';
        }
        if (this.SolveForvalue === 'Rebate') {
            this.upRebate = '';
        }
        if (this.SolveForvalue === 'DownsideStrike') {
            this.downStrike = '';
        }
        if (this.SolveForvalue === 'DownsideBarrierLevel') {
            this.downBarrierLevel = '';
        }
        if (this.SolveForvalue === 'LowerStrike') {
            this.downLowerStrike = '';
        }
        if (this.SolveForvalue === 'Leverage') {
            this.downLeverage = '';
        }
        if (this.SolveForvalue === 'DownsideStrike + LowerStrike') {
            this.downStrike = '';
            this.downLowerStrike = '';
        }

      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }


  async PriceValidation(e, Pricestr: string) {

      try {
          this.reset();
          // $(".validate-popup").each(function() {
          //     $(this).remove();
          // });
          // $(".error-input").each(function() {
          //     $(this).remove();
          // });
          const target = await this.EcCommon.GetEventTarget(e);
          this.ErrorMsg = '';
          this.ErrorMsgTop = '';
          target.classList.remove('error');
          // this.removeErrorPopup(target)
          $(".validate-popup").each(function () {
              $(this).remove();
          });
          $(".error-input").each(function () {
              $(this).remove();
          });
          switch (Pricestr) {
              case 'upStrike':

                  if (parseFloat(target.value) < parseFloat(this.upMinStrike)
                      || parseFloat(target.value) > parseFloat(this.upMaxStrike)) {
                      this.ErrorMsgTop = 'Upside strike should be between ' + this.upMinStrike + ' and ' + this.upMaxStrike;
                      target.classList.add('error');
                  } else if (this.upUpperStrike !== '') {
                      if (parseFloat(target.value) > parseFloat(this.upUpperStrike)) {
                          this.ErrorMsgTop = 'Upper strike should be greater than upside strike';
                          target.classList.add('error');
                      }
                  }
                  break;

              case 'downStrike':

                  if (parseFloat(target.value) < parseFloat(this.downMinStrike)
                      || parseFloat(target.value) > parseFloat(this.downMaxStrike)) {
                      this.ErrorMsgTop = 'Downside strike should be between ' + this.downMinStrike + ' and ' + this.downMaxStrike;
                      target.classList.add('error');
                  } else if (this.downLowerStrike !== '') {
                      if (parseFloat(target.value) < parseFloat(this.downLowerStrike)) {
                          this.ErrorMsgTop = 'Downside strike should be greater than lower strike';
                          target.classList.add('error');
                      }
                  }
                  break;

              case 'upUpperStrike':

                  if (parseFloat(target.value) < parseFloat(this.upMinUpperStrike)
                      || parseFloat(target.value) > parseFloat(this.upMaxUpperStrike)) {
                      this.ErrorMsgTop = 'Upper strike should be between ' + this.upMinUpperStrike + ' and ' + this.upMaxUpperStrike;
                      target.classList.add('error');
                  } else if (parseFloat(target.value) < parseFloat(this.upStrike)) {
                      this.ErrorMsgTop = 'Upper strike should be greater than upside strike';
                      target.classList.add('error');
                  } else if (this.downLowerStrike !== '') {
                      if (target.value !== '') {
                          if (parseFloat(target.value) < parseFloat(this.downLowerStrike)) {
                              this.ErrorMsgTop = 'Upper strike should be greater than lower strike.';
                              target.classList.add('error');
                          } else if (parseFloat(target.value) < parseFloat(this.upStrike)) {
                              this.ErrorMsgTop = 'Upper strike should be greater than upside strike';
                              target.classList.add('error');
                          }
                      } else {
                          this.ErrorMsgTop = 'Upper strike should be greater than lower strike.';
                          target.classList.add('error');
                      }

                  }
                  break;

              case 'downLowerStrike':
                  if (this.participationType === 'Booster') {
                      if (parseFloat(target.value) < parseFloat(this.downMinLowerStrike)
                          || parseFloat(target.value) > parseFloat(this.downMaxLowerStrike)) {
                          this.ErrorMsgTop = 'Lower strike should be between ' + this.downMinLowerStrike + ' and ' + this.downMaxLowerStrike;
                          target.classList.add('error');
                      } else if (parseFloat(target.value) > parseFloat(this.downStrike)) {
                          this.ErrorMsgTop = 'Downside strike should be greater than lower strike';
                          target.classList.add('error');
                      } else if (target.value !== '') {
                          if (this.upUpperStrike !== '') {
                              if (parseFloat(target.value) > parseFloat(this.upUpperStrike)) {
                                  this.ErrorMsgTop = 'Upper strike should be greater than lower strike.';
                                  target.classList.add('error');
                              } else if (parseFloat(target.value) > parseFloat(this.downStrike)) {
                                  this.ErrorMsgTop = 'Downside strike should be greater than lower strike';
                                  target.classList.add('error');
                              }
                          } else {
                              if (this.upperStrikeYN === 'Y') {
                                  this.ErrorMsgTop = 'Upper strike should be greater than lower strike.';
                                  target.classList.add('error');
                              }

                          }

                      }

                  }

                  break;

              case 'upBarrierLevel':
                  if (this.upBarrierType !== 'None') {
                      if (parseFloat(target.value) < parseFloat(this.upMinBarrierLevel)
                          || parseFloat(target.value) > parseFloat(this.upMaxBarrierLevel)) {
                          // tslint:disable-next-line: max-line-length
                          this.ErrorMsgTop = 'Upside barrier level should be between ' + this.upMinBarrierLevel + ' and ' + this.upMaxBarrierLevel;
                          target.classList.add('error');
                      }
                  }

                  break;

              case 'downBarrierLevel':
                  if (this.downBarrierType !== 'None') {
                      if (parseFloat(target.value) < parseFloat(this.downMinBarrierLevel)
                          || parseFloat(target.value) > parseFloat(this.downMaxBarrierLevel)) {
                          // tslint:disable-next-line: max-line-length
                          this.ErrorMsgTop = 'Downside barrier level should be between ' + this.downMinBarrierLevel + ' and ' + this.downMaxBarrierLevel;
                          target.classList.add('error');
                      }
                  }

                  break;

              case 'upGearing':

                  if (parseFloat(target.value) < parseFloat(this.upMinGearing)
                      || parseFloat(target.value) > parseFloat(this.upMaxGearing)) {
                      this.ErrorMsgTop = 'Upside gearing should be between ' + this.upMinGearing + ' and ' + this.upMaxGearing;
                      target.classList.add('error');
                  }

                  break;

              case 'upRebate':

                  if (parseFloat(target.value) < parseFloat(this.upMinRebate)
                      || parseFloat(target.value) > parseFloat(this.upMaxRebate)) {
                      this.ErrorMsgTop = 'Upside rebate should be between ' + this.upMinRebate + ' and ' + this.upMaxRebate;
                      target.classList.add('error');
                  }
                  break;

              case 'upCoupon':

                  if (parseFloat(target.value) < parseFloat(this.upMinCoupon)
                      || parseFloat(target.value) > parseFloat(this.upMaxCoupon)) {
                      this.ErrorMsgTop = 'Upside coupon should be between ' + this.upMinCoupon + ' and ' + this.upMaxCoupon;
                      target.classList.add('error');
                  }
                  break;

              case 'downLeverage':
                  if (this.participationType === 'Booster' && this.lowerStrikeYN === 'Y') {
                      if (parseFloat(target.value) < parseFloat(this.mindownLeverage)
                          || parseFloat(target.value) > parseFloat(this.maxdownLeverage)) {
                          this.ErrorMsgTop = 'Leverage should be between ' + this.mindownLeverage + ' and ' + this.maxdownLeverage;
                          target.classList.add('error');
                      }
                  }
                  break;

          }
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter(".error")
          $('.validate-popup').delay(5000).fadeOut('slow');
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  formatChange() {
      try {
          this.reset();
          if (this.format !== 'Swap' && this.SolveForvalue === 'FundingRate') {
            this.SolveForvalue = 'IBPrice';
          }
          if (this.SolveForvalue === 'IBPrice') {
              this.IBPrice = '';
              if (this.format === 'Swap' || this.format === 'Option') {
                  this.issuePrice = '';
              } else {
                  this.issuePrice = '100.00';
              }
          } else {
              if (this.format === 'Swap' || this.format === 'Option') {
                  this.IBPrice = '0.00';
                  this.issuePrice = '';
              } else {
                  this.IBPrice = '99.50';
                  this.issuePrice = '100.00';
              }
          }

          if (this.format === 'Swap') {
              this.fundType = 'Floating Rate';
              this.fundFreq = '3m';
              if (this.SolveForvalue === 'FundingRate') {
                  this.fundRate = '';
              } else {
                  this.fundRate = '1.00';
              }
          } else {

              this.fundType = '';
              this.fundFreq = '';
              this.fundRate = '';
          }
          if (this.format === 'BonoJ' || this.format === 'Warrant') {
              this.ddlNoteCcy = 'MXN';
              this.Notional = '10,000,000';
          }
          if (this.format === 'Swap') {
            this.ddlNoteCcy = 'EUR';
          }
          // else {
          //     this.ddlNoteCcy = 'EUR';
          // }
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

  upbarrierTypeChange() {
      try {
          this.reset();
          if (this.SolveForvalue === 'UpsideBarrierLevel' && this.upBarrierType === 'None') {
            this.SolveForvalue = 'IBPrice';
        }

        if (this.SolveForvalue === 'Rebate' && this.upBarrierType === 'None') {
            this.SolveForvalue = 'IBPrice';
        }
          if (this.upBarrierType === 'None') {
              this.upBarrierLevel = '';
              this.upRebate = '';
          } else {
              this.upGearing = '100.00';
              if (this.upBarrierLevel === '') {
                  this.upBarrierLevel = '110.00';
              }
              if (this.upRebate === '') {
                  this.upRebate = '0.00';
              }

          }
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  downbarrierTypeChange() {
    try {
        this.reset();
        if (this.SolveForvalue === 'DownsideBarrierLevel' && this.downBarrierType === 'None') {
            this.SolveForvalue = 'IBPrice';
        }
        if (this.downBarrierType === 'None') {
            this.downBarrierLevel = '';
        } else {
            if (this.downBarrierLevel === '' || this.SolveForvalue !== 'DownsideBarrierLevel') {
                this.downBarrierLevel = '100.00';
            } else {
                this.downBarrierLevel = '';
            }
        }
    } catch (error) {
         
    }
}

  async txtTenorChange(e, type: any) {
      try {
        this.priceBtnActive = 'Y'; //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
          this.reset();
          $("#txtstkdate").next(".error-input").remove();
          $("#txtstkdate").next(".validate-popup").remove();
          $("#txtsettdate").next(".error-input").remove();
          $("#txtsettdate").next(".validate-popup").remove();
          const target = await this.EcCommon.GetEventTarget(e);
          const today = new Date();
          let strDate = '';
          const dayCount = 0;
      let CustomIssueDate: string = (this.customSetDate || this.customSetDate == 0) ? (this.customSetDate  + 'B') : '';//Changed by Varsha G || FIN1EURINT-604 || 04-Sep-2023
          if (target.value === undefined || target.value === '') {
              if (type === 'Strike') {
                  target.value = '0D';
                  this.stkshift = '0D';
              }
              if (type === 'Payment') {
                  target.value = '7D';
                  this.paymentshift = '7D';
              }
              if (type === 'Expiry') {
                  target.value = '1Y';
                  this.expshift = '1Y';
              }
          } else if (target.value.length === 1) {
              if (isNaN(target.value)) {
                  target.value = '0' + target.value;
              } else {
                  target.value = target.value + 'D';
              }
          } else if (target.value.length > 1 && target.value.length <= 3) {
              if (Number(target.value)) {
                  target.value = target.value + 'D';
              }
          }

          const str = target.value + '';
          if (str.substr(str.length - 1, 1).toUpperCase() === 'M') {
              // tslint:disable-next-line: radix
              if ((parseInt(str.substr(0, str.length - 1)) / 12) > 6) {
                  this.ErrorMsgTop = 'Please enter valid date shifter.';
                  return false;
              }
          }
          if (str.substr(str.length - 1, 1).toUpperCase() === 'Y') {
              // tslint:disable-next-line: radix
              if (parseInt(str.substr(0, str.length - 1)) > 6) {
                  this.ErrorMsgTop = 'Please enter valid date shifter.';
                  return false;
              }
          }

          if (type === 'Strike') {
              this.stkshift = target.value;

              // if (str.toUpperCase() === '0B') {
              // tslint:disable-next-line: max-line-length
              //     strDate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);

              // }
              // else {
              this.Dates = await this.EcHome.BBVAGetDates(this.Exchange(), str.toUpperCase(), '');
              strDate = await this.EcCommon.formatDate(this.Dates.MaturityDate);
              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
              // }

              this.stkdate = strDate;
              this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? CustomIssueDate  : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
              this.settdate = await this.EcCommon.formatDate(this.Dates.MaturityDate);
              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

              this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
              this.expdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          }
          if (type === 'Payment') {
              this.paymentshift = target.value;

              // if (str.toUpperCase() === '0B') {
              // tslint:disable-next-line: max-line-length
              //     //strDate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
              //     strDate = this.stkdate;

              // }
              // else {
              this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, str.toUpperCase(), this.stkdate);
              strDate = this.EcCommon.formatDate(this.Dates.MaturityDate);
              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
              // }
              this.settdate = strDate;

              this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
              this.expdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          }
          if (type === 'Expiry') {
              this.expshift = target.value;
              if (this.expshift === 'Custom') {
                return true;
              } // Changes done by Jyoti S || 08-05-2023 || FIN1EURINT-206
              if (str.toUpperCase() === '0B') {
                  // tslint:disable-next-line: max-line-length
                  // strDate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
                  strDate = this.settdate;
              } else {
                  this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
                  strDate = this.EcCommon.formatDate(this.Dates.MaturityDate);
                  // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
              }
              this.expdate = strDate;
          }

          if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
              || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
              this.ErrorMsgTop = 'Please select valid strike date.';
              document.getElementById('txtstkdate').classList.add('error');
              $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtstkdate")
              $('.validate-popup').delay(5000).fadeOut('slow');
              return false;
          }

          if (this.settdate === '' || (Date.parse(this.settdate) > Date.parse(this.expdate))) {
              document.getElementById('txtsettdate').classList.add('error');
              this.ErrorMsgTop = 'Please select valid payment date.';
              $('<div class="error-input" style="left: 150px;"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtsettdate")
              $('.validate-popup').delay(5000).fadeOut('slow');
              return false;
          }
          if ((Date.parse(this.expdate) < Date.parse(this.settdate))) {
              // document.getElementById('txtexpdate').classList.add('error');
              this.ErrorMsgTop = 'Please select valid expiry date.';
              return false;
          }
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  async Save() {
      try {
        this.variantFlag = true; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
      this.reset(); //Added to fix timeout bug on Save New variant call while pricing|| 13-Jun-2023
          if (this.portfolioName === '') {
              this.ErrorMsgTop = "Please enter valid template name.";
              this.variantFlag = false; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
              return false;
          }

          this.validationOnButton();
          if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
              this.timeLeft = -1;
              this.timeoutMsg = '';
              this.clearFlag = true;
        //clearInterval(this.interval); //Removed to fix timeout bug on Save New variant call while pricing|| 13-Jun-2023
              if (this.ShareBasket.length > 0) {
                  $(".validate-popup").remove();
                  document.getElementById('txtShare').classList.remove('underlyingError');
                  document.getElementById('txtShare').classList.add('longText');
              }
              this.saveportfolioId = '';
              this.PPDetails = '';
              this.sortedAllPrices = [];
              this.AllPrices = [];
              this.orderID = '';
              this.loadflag = false;
              this.ErrorMsg = '';
              this.ErrorMsgTop = '';
              this.rfqID = '';
              this.noteMasterID = '';
              this.saveFlag = false;
              this.quoteEmailFlg = false;
              this.successMsg = '';
              this.errorTemplateMessage = '';
              this.reqSuccessMsg = '';
              const strXml = '<Details>' +await this.generateSaveXML() + '</Details>';
        var res : any;
             await this.EcHome.BBVASaveQuotes('Single Pricer', strXml, this.portfolioName, '', 'Participation', AppConfig.settings.oRes.userName).then((data:any)=>{res = data;});
              if (res) {
                  if (res.errorMessage === '') {

                      this.saveFlag = true;
                      this.variantFlag = false; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
                      this.saveportfolioId = res.PortFolioID;
                      this.successMsg = 'Template : ' + this.portfolioName + ' saved successfully.';
                      // this.successMsg = 'Portfolio ID ' + res.PortFolioID + ' saved successfully.';
                      this.portfolioIdArr = [];
                      await this.EcHome.BBVAGetPortfolio('Participation', 'Single Pricer').then((data:any)=>{
              this.portfolioIdArr=data;
            });
                      this.portfolioIdArr?.splice(0, 0, {
                          AccessDetail: "ALL",
                          Created_At: "",
                          P_ID: "",
                          P_Name: "",
                          ProdType: "",
                          ShareType: "ALL",
                          created_by: "",
                      });
                      this.portfolioIdArr?.map(r => {
                          let item = r;
                          item.imageIcon = environment.asseturl + ((r.ShareType + '').toUpperCase() === 'OWNER' ? 'owner.png' : 'shared.png');
                          return item;
                      });
                  } else {
                      this.errorTemplateMessage = res.errorMessage;
                      this.variantFlag = false; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
                  }
              }
          }
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

  async generateSaveXML() {
      try {
          this.validationOnButton();
          this.tempXML = '';
          if ((this.Notional + '').includes(',')) {
              this.Notional = this.Notional.replace(/,/g, '');
          }
          //Changed by Apurva K||14-Dec-2023|| HSBCECCLI-86//Changed by Apurva K||14-Dec-2023|| HSBCECCLI-86
          const shareCcy = ((this.ShareBasket[0] === undefined) ? '' : (this.ShareBasket[0].RICCode + '#')) +
              '#' + this.ddlNoteCcy;

          this.tempXML += '<Record>' +
              '<Share>' + shareCcy + '</Share>' +
              ' <ProductType>' + this.participationType + '</ProductType>' +
              '<ShareBBGRIC1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].RICCode) + '</ShareBBGRIC1>' +
              '<ShareLongName1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].LongName) + '</ShareLongName1>' +
              '<SolveFor>' + this.SolveForvalue + '</SolveFor>' +
              '<IBPrice>' + this.IBPrice + '</IBPrice>' +
              '<Ccy>' + this.ddlNoteCcy + '</Ccy>' +
              '<InputStrikePercent>' + this.upStrike + '</InputStrikePercent>' +
              '<InitialInputKOBarrierPercent>' + this.upBarrierLevel + '</InitialInputKOBarrierPercent>' +
              '<InputKOBarrierFrequency>' + this.upBarrierType + '</InputKOBarrierFrequency>' +
              '<ComputedUpsidePayoffDescription></ComputedUpsidePayoffDescription>' +
              '<UpsideParticipationPercent>' + this.upGearing + '</UpsideParticipationPercent>' +
              '<UpsideParticipationCapPercent>' + this.upUpperStrike + '</UpsideParticipationCapPercent>' +
              '<InputDownsideStrikePercent>' + this.downStrike + '</InputDownsideStrikePercent>' +
              '<InitialInputKIBarrierPercent>' + this.downBarrierLevel + '</InitialInputKIBarrierPercent>' +
              '<InputKIBarrierFrequency>' + this.downBarrierType + '</InputKIBarrierFrequency>' +
              '<ComputedDownsidePayoffDescription></ComputedDownsidePayoffDescription>' +
              '<DownsideParticipationPercent>' + this.downLeverage + '</DownsideParticipationPercent>' +
              '<DownsideParticipationCapPercent>' + this.downLowerStrike + '</DownsideParticipationCapPercent>' +
              '<DownsideCapitalProtectionPercent>' + this.capitalGuaranteed + '</DownsideCapitalProtectionPercent>' +
              '<GuaranteedCoupon>' + this.guaranteedCoupon + '</GuaranteedCoupon>' +
              '<Underlying1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].Code) + '</Underlying1>' +
              '<Wrapper>' + this.format + '</Wrapper>' +
              '<Size>' + this.Notional + '</Size>' +
              '<PaymentDate>' + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy') + '</PaymentDate>' +
              '<StrikeDate>' + this.datepipe.transform(this.stkdate, 'dd-MMM-yyyy') + '</StrikeDate>' +
              '<FundingType>' + this.fundType + '</FundingType>' +
              '<FundingFrequency>' + this.fundFreq + '</FundingFrequency>' +
              '<IndexRateSpread>' + this.fundRate + '</IndexRateSpread>' +
              '<ExpiryDate>' + this.datepipe.transform(this.expdate, 'dd-MMM-yyyy') + '</ExpiryDate>' +
              '<IssueDate>' + this.datepipe.transform(this.settdate, 'dd-MMM-yyyy') + '</IssueDate>' +
              '<IssuePrice>' + this.issuePrice + '</IssuePrice>' +
              '<SubTemplate>Participation</SubTemplate>' +
              '<ComputedStrikeFixingLag>' + this.stkshift + '</ComputedStrikeFixingLag>' +
            //   '<ComputedSettlementPeriodSoftTenor>' + this.paymentshift + '</ComputedSettlementPeriodSoftTenor>' +
              '<ComputedSettlementPeriodSoftTenor>' + (this.paymentshift === 'Custom' ? (this.customSetDate + 'B') : (this.paymentshift === 'T + 10' ? '10B' : '5B')) + '</ComputedSettlementPeriodSoftTenor>' +
            //   '<ComputedPayoffSoftTenor>' + this.expshift + '</ComputedPayoffSoftTenor>' +
            '<ComputedPayoffSoftTenor>' + (this.expshift === 'Custom' ? this.customTenor : this.expshift) + '</ComputedPayoffSoftTenor>' +
              //'<onBehalfOf>' + this.onBehalfOf + '</onBehalfOf>' +
              '<onBehalfOf></onBehalfOf>' +
              '<InputRebatePercent>' + this.upRebate + '</InputRebatePercent>' +
              '<InputMinimumCouponPercentPA>' + this.upCoupon + '</InputMinimumCouponPercentPA>' +
              '<InputFixedCouponFrequencyPeriod>' + this.guaranteedCouponFreq + '</InputFixedCouponFrequencyPeriod>' +
              '<Language>' + this.language + '</Language>' +
              '<Country>' + this.country + '</Country>' +
              '<downsideType>' +(this.participationType==='TwinWin KG'?this.downsideType:'') + '</downsideType>' +
                '<downsideGearing>' + (this.participationType==='TwinWin KG'?this.downsidePutGearing:'') + '</downsideGearing>' +
                '<downRebate>' + (this.participationType==='TwinWin KG'?this.downRebate:'') + '</downRebate>' +
                '<capitalprotection>' + (this.participationType==='TwinWin KG'?this.capitalprotection:'') + '</capitalprotection>' +
                '<upsidetype>' + this.upsidetype + '</upsidetype>' +
              '</Record>';
          // FIN1EURINT-502 : Bulk Pricer - Rows get rearranged on saving or updating a portfolio.
          this.EcCommon.generateFlexiXml({xml: this.tempXML, index: 0});
          return this.tempXML;
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  async checkValidNotional(e) {
      try {
          $("#txtnotional").next(".error-input").remove();
          $("#txtnotional").next(".validate-popup").remove();
          const NotionalData =  this.EcCommon.checkValidNotional(e);
          if (NotionalData.ErrorMsg === '') {
              this.Notional = NotionalData.Notional;
              e.target.value = this.Notional;
          } else {
              this.ErrorMsgTop = NotionalData.ErrorMsg;
              $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtnotional")
              $('.validate-popup').delay(5000).fadeOut('slow');
          }
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  async checkValidAllocateNotional(e, rowindex) {
      try {
          const NotionalData = await this.EcCommon.checkValidNotional(e);
          //console.log(NotionalData);
          if (NotionalData.ErrorMsg === '') {
              // this.Notional = NotionalData.Notional;
              if (NotionalData.Notional.includes(',')) {
                  NotionalData.Notional = NotionalData.Notional.toString().replace(/,/g, '');
              }
              e.target.value = parseFloat(NotionalData.Notional).toFixed(0);
              this.allocatedNotionalArr[rowindex] = e.target.value; // copied formated value to allocated notional array - added by Pranav D on 16Feb2022
              this.errorMsgBookOrder = "";
          } else {
              this.allocatedNotionalArr[rowindex] = 0.00;
              e.target.value = 0.00;
              this.errorMsgBookOrder = NotionalData.ErrorMsg;
          }




          // const target = this.EcCommon.GetEventTarget(e);
          // if (target.value === '' || isNaN(target.value))
          //     target.value = '0.00';

          // this.checkValidAllocateNotional(e);    

          // ////console.log(target, this.allocatedNotional, target.value, this.previousNotional, this.Notional);
          // // this.allocatedNotional = parseFloat(this.allocatedNotional) + parseFloat(target.value) - parseFloat(this.previousNotional);
          // target.value = parseFloat(target.value).toFixed(2);
          // this.allocatedNotionalArr[rowindex] = target.value;

      } catch (error) {
          //console.log('Error', error);
      }
  }
  async checkValidBookOrderNotional(e, fieldName) {
      try {
          var fieldsArr = { 'txtlimitLevel': 'Limit Level', 'txtnotional': 'Order Notional' }
          const NotionalData = await this.EcCommon.checkValidNotional(e);
      fieldName === "txtnotional" ? this.txtnotional = NotionalData.Notional : null; //Changes by Apurva K/ Kaustubh S|| 30-May-2023
          //this.txtnotional = NotionalData.Notional;
      this.setTotalNotional(); //Changes done by Jyoti S to resolve Order & Total notional issue in place order popup of Previous quotes || 14-Apr-2023
          //console.log(NotionalData);
          if (NotionalData.ErrorMsg === '') {
              // this.Notional = NotionalData.Notional;
              this[fieldName] = NotionalData.Notional;
              // this.allocatedNotionalArr[rowindex] =  NotionalData.Notional;
              e.target.value = NotionalData.Notional;
              this.errorMsgBookOrder = "";
          } else {
              // this.allocatedNotionalArr[rowindex] = 0.00;
              this[fieldName] = 0.00;
              e.target.value = 0.00;
              // this.errorMsgBookOrder = NotionalData.ErrorMsg;
              this.errorMsgBookOrder = "Please enter valid " + fieldsArr[fieldName];
          }

      } catch (error) {
          //console.log('Error', error);
      }
  }

  async checkNotional(e) {
      try {
          if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
              const target = await this.EcCommon.GetEventTarget(e);
              const floatNotional = parseFloat(this.Notional.toString().replace(/,/g, ''));
              this.checkNotionalRes = await this.EcHome.BBVACheckNotional(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Participation', this.ddlNoteCcy);
              if (floatNotional < this.checkNotionalRes[0].Minimum || floatNotional > this.checkNotionalRes[0].Maximum) {
                  target.classList.add('error');
          this.ErrorMsgTop = 'You must enter a number from '
            + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
                  target.focus();
                  $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter(".error")
                  $('.validate-popup').delay(5000).fadeOut('slow');
              } else {
                  target.classList.remove('error');
              }
          }
          this.Notional = this.Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          e.target.value = this.Notional;
      } catch (error) {
          //console.log('Error:', error);
      }
  }
  async currencyChange() {
      try {
          this.reset();
      let CustomIssueDate: string = (this.customSetDate || this.customSetDate == 0) ? (this.customSetDate  + 'B') : '';//Changed by Varsha G || FIN1EURINT-604 || 04-Sep-2023
      this.priceBtnActive = 'Y'; //Added by ApurvaK||04-Apr-2023|| Remove multiple clicks pn Price button
          this.checkNotionalRes = await this.EcHome.BBVACheckNotional(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Participation', this.ddlNoteCcy);
          if ((this.Notional + '').includes(',')) {
              this.Notional = this.Notional.replace(/,/g, '');
          }
          if (this.checkNotionalRes !== undefined && this.checkNotionalRes && this.checkNotionalRes.length > 0) {
              if (parseFloat(this.Notional) < parseFloat(this.checkNotionalRes[0].Minimum)
                  || parseFloat(this.Notional) > parseFloat(this.checkNotionalRes[0].Maximum)) {
                  document.getElementById('txtnotional').classList.add('error');
          this.ErrorMsgTop = 'You must enter a number from '
            + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
                  document.getElementById('txtnotional').focus();
                  $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtnotional")
                  $('.validate-popup').delay(5000).fadeOut('slow');

              } else {
                  document.getElementById('txtnotional').classList.remove('error');
              }
          }
          if (!(this.Notional + '').includes(',')) {
              this.Notional = (this.Notional + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }


          this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? CustomIssueDate  : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate); // Changes done by Jyoti S || 08-May-2023
          if (this.Dates) {
              this.settdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
          }

          this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);// Changes done by Jyoti S || 08-May-2023
          if (this.Dates) {
              this.expdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
          }

      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

  async validationOnButton() {
      try {
          $('#txtShare').css("text-indent", "0px")
          $(".validate-popup").each(function () {
              $(this).remove();
          });
          $(".error-input").each(function () {
              $(this).remove();
          });

          if (this.templateMappingArr === undefined || this.templateMappingArr.length <= 0) {
              this.ErrorMsgTop = "Service unavailable. Please reload the application and try again.";
              return false;
          } else {
              this.ErrorMsgTop = '';
          }

        //   if (this.onBehalfOf === '' && !this.sendtocptyflag) {
        //       this.ErrorMsgTop = 'No client is  mapped for this user. Request cannot be placed.';
        //       return false;
        //   } else {
        //       this.ErrorMsgTop = '';
        //   }

          if (this.ShareBasket.length <= 0) {
              document.getElementById('txtShare').className = 'underlyingError';
              this.ErrorMsgTop = 'Please enter underlying.';
              $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtShare")
              $('.validate-popup').delay(5000).fadeOut('slow');
              $('#txtShare').css("text-indent", "30px")
          }

          this.checkNotionalRes = await this.EcHome.BBVACheckNotional('Participation', this.ddlNoteCcy);

          if (this.checkNotionalRes !== undefined && this.checkNotionalRes && this.checkNotionalRes.length > 0) {

              if ((this.Notional + '').includes(',')) {

                  this.Notional = this.Notional.replace(/,/g, '');
              }

              if (parseFloat(this.Notional) < parseFloat(this.checkNotionalRes[0].Minimum)
                  || parseFloat(this.Notional) > parseFloat(this.checkNotionalRes[0].Maximum)) {
                  document.getElementById('txtnotional').classList.add('error');
                  // tslint:disable-next-line: max-line-length
                  this.ErrorMsgTop = 'You must enter a number from ' + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
                  document.getElementById('txtnotional').focus();
                  $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtnotional")
                  $('.validate-popup').delay(5000).fadeOut('slow');
              } else {
                  document.getElementById('txtnotional').classList.remove('error');
              }
              if (!(this.Notional + '').includes(',')) {
                  this.Notional = (this.Notional + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }
          }

          if (parseFloat(this.upStrike) < parseFloat(this.upMinStrike) || parseFloat(this.upStrike) > parseFloat(this.upMaxStrike)) {
              this.ErrorMsgTop = 'Upside strike should be between ' + this.upMinStrike + ' and ' + this.upMaxStrike;
              document.getElementById('txtupStrike').classList.add('error');
              $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtupStrike")
              $('.validate-popup').delay(5000).fadeOut('slow');
          } else {

              document.getElementById('txtupStrike').classList.remove('error');
          }

          if (parseFloat(this.downStrike) < parseFloat(this.downMinStrike)
              || parseFloat(this.downStrike) > parseFloat(this.downMaxStrike)) {
              this.ErrorMsgTop = 'Downside strike should be between ' + this.downMinStrike + ' and ' + this.downMaxStrike;
              document.getElementById('txtdownStrike').classList.add('error');
              $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtdownStrike")
              $('.validate-popup').delay(5000).fadeOut('slow');
          } else {

              document.getElementById('txtdownStrike').classList.remove('error');
          }

          if (this.upUpperStrike !== '') {
              if (parseFloat(this.upUpperStrike) < parseFloat(this.upMinUpperStrike)
                  || parseFloat(this.upUpperStrike) > parseFloat(this.upMaxUpperStrike)) {
                  this.ErrorMsgTop = 'Upside upper strike should be between ' + this.upMinUpperStrike + ' and ' + this.upMaxUpperStrike;
                  document.getElementById('txtupUpperStrike').classList.add('error');
                  $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtupUpperStrike")
                  $('.validate-popup').delay(5000).fadeOut('slow');
              } else if (parseFloat(this.upUpperStrike) < parseFloat(this.upStrike)) {
                  this.ErrorMsgTop = 'Upper strike should be greater than upside strike.';
                  document.getElementById('txtupUpperStrike').classList.add('error');
                  $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtupUpperStrike")
                  $('.validate-popup').delay(5000).fadeOut('slow');
              } else {
                  document.getElementById('txtupUpperStrike').classList.remove('error');
              }
          }

          if (this.participationType === 'Booster') {
              if (this.downLowerStrike !== '') {
                  if (parseFloat(this.downLowerStrike) < parseFloat(this.downMinLowerStrike)
                      || parseFloat(this.downLowerStrike) > parseFloat(this.downMaxLowerStrike)) {
                      this.ErrorMsgTop = 'Lower strike should be between ' + this.downMinLowerStrike + ' and ' + this.downMaxLowerStrike;
                      document.getElementById('txtdownLowerStrike').classList.add('error');
                      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtdownLowerStrike")
                      $('.validate-popup').delay(5000).fadeOut('slow');
                  } else if (parseFloat(this.downStrike) < parseFloat(this.downLowerStrike)) {
                      this.ErrorMsgTop = 'Downside strike should be greater than lower strike.';
                      document.getElementById('txtdownLowerStrike').classList.add('error');
                      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtdownLowerStrike")
                      $('.validate-popup').delay(5000).fadeOut('slow');
                  } else if (this.upUpperStrike !== '') {
                      if (parseFloat(this.upUpperStrike) < parseFloat(this.downLowerStrike)) {
                          this.ErrorMsgTop = 'Upper strike should be greater than lower strike.';
                          document.getElementById('txtdownLowerStrike').classList.add('error');
                          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtdownLowerStrike")
                          $('.validate-popup').delay(5000).fadeOut('slow');
                      }
                  } else if (this.upUpperStrike === '' && this.upperStrikeYN === 'Y') {
                      this.ErrorMsgTop = 'Upper strike should be greater than lower strike.';
                      document.getElementById('txtupUpperStrike').classList.add('error');
                      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtupUpperStrike")
                      $('.validate-popup').delay(5000).fadeOut('slow');
                  } else {

                      document.getElementById('txtdownLowerStrike').classList.remove('error');
                  }

              } else {
                  if (parseFloat(this.downLeverage) < parseFloat(this.mindownLeverage)
                      || parseFloat(this.downLeverage) > parseFloat(this.maxdownLeverage)) {
                      this.ErrorMsgTop = 'Leverage should be between ' + this.mindownLeverage + ' and ' + this.maxdownLeverage;
                      document.getElementById('txtdownLeverage').classList.add('error');
                      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtdownLeverage")
                      $('.validate-popup').delay(5000).fadeOut('slow');
                  } else {

                      document.getElementById('txtdownLeverage').classList.remove('error');
                  }

              }
          }

          if (this.upBarrierType !== 'None') {
              if (parseFloat(this.upBarrierLevel) < parseFloat(this.upMinBarrierLevel)
                  || parseFloat(this.upBarrierLevel) > parseFloat(this.upMaxBarrierLevel)) {
                  this.ErrorMsgTop = 'Upside barrier level should be between ' + this.upMinBarrierLevel + ' and ' + this.upMaxBarrierLevel;
                  if (document.getElementById('txtupBarrierLevel')) {
                      document.getElementById('txtupBarrierLevel').classList.add('error');
                      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtupBarrierLevel")
                      $('.validate-popup').delay(5000).fadeOut('slow');
                  }
              } else {

                  if (document.getElementById('txtupBarrierLevel')) {
                      document.getElementById('txtupBarrierLevel').classList.remove('error');
                  }
              }
          }

          if (this.downBarrierType !== 'None') {
              if (parseFloat(this.downBarrierLevel) < parseFloat(this.downMinBarrierLevel)
                  || parseFloat(this.downBarrierLevel) > parseFloat(this.downMaxBarrierLevel)) {
                  // tslint:disable-next-line: max-line-length
                  this.ErrorMsgTop = 'Downside barrier level should be between ' + this.downMinBarrierLevel + ' and ' + this.downMaxBarrierLevel;
                  if (document.getElementById('txtdownBarrierLevel')) {
                      document.getElementById('txtdownBarrierLevel').classList.add('error');
                      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtdownBarrierLevel")
                      $('.validate-popup').delay(5000).fadeOut('slow');
                  }

              } else {

                  if (document.getElementById('txtdownBarrierLevel')) {
                      document.getElementById('txtdownBarrierLevel').classList.remove('error');
                  }
              }
          }

          if (parseFloat(this.upGearing) < parseFloat(this.upMinGearing) || parseFloat(this.upGearing) > parseFloat(this.upMaxGearing)) {
              this.ErrorMsgTop = 'Upside gearing should be between ' + this.upMinGearing + ' and ' + this.upMaxGearing;
              document.getElementById('txtupGearing').classList.add('error');
              $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtupGearing")
              $('.validate-popup').delay(5000).fadeOut('slow');
          } else {

              document.getElementById('txtupGearing').classList.remove('error');
          }

          if (parseFloat(this.upRebate) < parseFloat(this.upMinRebate) || parseFloat(this.upRebate) > parseFloat(this.upMaxRebate)) {
              this.ErrorMsgTop = 'Upside rebate should be between ' + this.upMinRebate + ' and ' + this.upMaxRebate;
              if (document.getElementById('txtRebateCoupon')) {
                  document.getElementById('txtRebateCoupon').classList.add('error');
                  $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtRebateCoupon")
                  $('.validate-popup').delay(5000).fadeOut('slow');
              }
          } else {

              if (document.getElementById('txtRebateCoupon')) {
                  document.getElementById('txtRebateCoupon').classList.remove('error');
              }

          }

          if (parseFloat(this.upCoupon) < parseFloat(this.upMinCoupon) || parseFloat(this.upCoupon) > parseFloat(this.upMaxCoupon)) {
              this.ErrorMsgTop = 'Upside coupon should be between ' + this.upMinCoupon + ' and ' + this.upMaxCoupon;
              document.getElementById('txtupCoupon').classList.add('error');
              $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtupCoupon")
              $('.validate-popup').delay(5000).fadeOut('slow');
          } else {

              document.getElementById('txtupCoupon').classList.remove('error');
          }



          if (this.stkdate === '') {
              document.getElementById('txtstkdate').classList.add('error');
              this.ErrorMsgTop = 'Please enter valid strike date.';
              $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtstkdate")
              $('.validate-popup').delay(5000).fadeOut('slow');

          }

          if (this.settdate === '') {
              document.getElementById('txtsettdate').classList.add('error');
              this.ErrorMsgTop = 'Please enter valid payment date.';
              $('<div class="error-input" style="left: 150px;"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#customOffset")
              $('.validate-popup').delay(5000).fadeOut('slow');
          }

      if (this.settdate !== undefined) {
          if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
              || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
              this.ErrorMsgTop = 'Please select valid strike date.';
              document.getElementById('txtstkdate').classList.add('error');
          $('<div class="error-input" style="left: 150px;"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#customSetDate")//style
              $('.validate-popup').delay(5000).fadeOut('slow');
          }
      }

          if (this.settdate === '' || (Date.parse(this.settdate) > Date.parse(this.expdate))) {
              document.getElementById('txtsettdate').classList.add('error');
              this.ErrorMsgTop = 'Please select valid payment date.';
              $('<div class="error-input" style="left: 150px;"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#customSetDate")
              $('.validate-popup').delay(5000).fadeOut('slow');
          }

      if ((Date.parse(this.expdate) < Date.parse(this.settdate))) {
        // document.getElementById('txtexpdate').classList.add('error');
        this.ErrorMsgTop = 'Please select valid expiry date.';
      }
          if (this.customSetDate === null) {
            document.getElementById('txtsettdate').classList.add('error');
        this.ErrorMsgTop = 'Please enter valid payment date xtxt.';
            $('<div class="error-input" style="left: 150px;"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#customOffset")
            $('.validate-popup').delay(5000).fadeOut('slow');
          }

          if ((Date.parse(this.expdate) < Date.parse(this.settdate))) {
              // document.getElementById('txtexpdate').classList.add('error');
              this.ErrorMsgTop = 'Please select valid expiry date.';
          }

          var IssueDateOffsetValue;
          if(this.paymentshift==='Custom')
            {
              console.log(this.customSetDate);
              IssueDateOffsetValue=Number(this.customSetDate);
              if(IssueDateOffsetValue<Number(this.MinimumAllowedIssueDateOffset)){
                this.ErrorMsgTop="Issue Date Offset (" + this.customSetDate + ") is less than minimum required ("+ this.MinimumAllowedIssueDateOffset +")";
                document.getElementById('txtERCoupon').classList.add('error');
                $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtERCoupon")
                $('.validate-popup').delay(5000).fadeOut('slow');
              }          
            }
            else
            {
              IssueDateOffsetValue=Number(this.paymentshift.split('+')[1].trim());
              if(IssueDateOffsetValue<Number(this.MinimumAllowedIssueDateOffset)){
                this.ErrorMsgTop="Issue Date Offset (" + this.paymentshift + ") is less than minimum required ("+ this.MinimumAllowedIssueDateOffset+")";
                document.getElementById('txtERCoupon').classList.add('error');
                $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtERCoupon")
                $('.validate-popup').delay(5000).fadeOut('slow');            
              }          
            }
    
          $('.validate-popup').delay(5000).fadeOut('slow');


        
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

  async setPrevQuoteData1(cloneData, viewOnly) {
      try {
        //Changes done by Jyoti S || 30-May-2023 || START
          // this.buttonList = cloneData.Actions[0];
          this.ShareBasket = [];
          this.SelectedUnderlyingarray = [];
          this.SelectedUnderlyingBasketArray = [];
          cloneData.ShareCode[0].split(',').forEach(async element => {
            //console.log(element);
            var index = this.shares.findIndex(shareItem => shareItem.BloombergCode == element)
            if (index >= 0) {
    
              const shareCode = this.shares[index].Code;
              await this.showUnderlying('', SearchUnderlyingPipe.prototype.transform(this.shares, shareCode)[0]);
            }
          });
          this.participationType = cloneData.participationType[0];
          if (this.participationType === 'TwinWin KG'){
            this.downsideType=cloneData?.downsideType[0];
            this.downsidePutGearing=cloneData?.downsideGearing[0];
            this.capitalprotection=cloneData?.capitalprotection[0];
            this.downRebate=cloneData?.downRebate[0];
        }
        this.upsidetype=cloneData?.upsidetype[0];
          this.ddlNoteCcy = cloneData.ddlNoteCcy[0];
          this.IBPrice = cloneData.IBPrice[0];//Need to check || Jyoti S || 30-May-2023 || Jyoti S 
          this.Notional = await this.EcCommon.formatNotional(cloneData.Notional[0]);
          this.format = cloneData.Format[0];
          this.SolveForvalue = cloneData.SolveForValue[1];//Need to check || Jyoti S || 30-May-2023 || Jyoti S 
          this.issuePrice = cloneData.IssuePrice[0];
          this.language = cloneData?.language[0].replace(/~/g, ',')
          this.country = cloneData?.country[0].replace(/~/g, ',')
          this.upStrike = cloneData.upStrike[0];
          this.upBarrierType = cloneData.upBarrierType[0];
          this.upGearing = cloneData.upGearing[0];
          this.upBarrierLevel = cloneData.upBarrierLevel[0];

          if (this.upBarrierLevel !== '') {
              this.barrierLevelYN = 'Y';
          } else {
              this.barrierLevelYN = 'N';
          }
          this.upUpperStrike = cloneData.upUpperStrike[0];
          if (cloneData.upUpperStrike[0] === '') {
              this.upperStrikeYN = 'N';
          } else {
              this.upperStrikeYN = 'Y';
          }

          this.upRebate = cloneData.upRebate[0];
          if (this.upRebate !== '') {
              this.rebateYN = 'Y';
          } else {

              this.rebateYN = 'N';
          }

          if (cloneData.upCoupon[0] === '') {
              this.minCouponYN = 'N';
          } else {
              this.minCouponYN = 'Y';
          }
          this.upCoupon = cloneData.upCoupon[0];

          this.fundType = cloneData.fundType[0];
          this.fundFreq = cloneData.fundFreq[0];

          this.downStrike = cloneData.downStrike[0];
          this.downBarrierType = cloneData.downBarrierType[0];
          this.downLeverage = cloneData.downLeverage[0];
          this.downBarrierLevel = cloneData.downBarrierLevel[0];

          if (cloneData.downLowerStrike[0] === '') {
              this.lowerStrikeYN = 'N';
          } else {
              this.lowerStrikeYN = 'Y';
          }
          this.downLowerStrike = cloneData.downLowerStrike[0];
          this.capitalGuaranteed = cloneData.capitalGuaranteed[0];
          this.guaranteedCoupon = cloneData.guaranteedCoupon[0];
          this.guaranteedCouponFreq = cloneData.guaranteedCouponFreq[0];

          this.fundRate = cloneData.fundRate[0];
          this.orderID = cloneData.BBVAIDcsv[0].trim().split(',')[0].trim();
          this.orderStatus = cloneData.Status[0];

        //   this.ShareBasket = [];
        //   if (cloneData.FirstUnderlyingCode1[0] !== undefined && cloneData.FirstUnderlyingCode1[0] !== '') {
        //       this.ShareBasket.push({ Code: cloneData.FirstUnderlyingCode1[0] });
        //       this.setSelectedUnderlyingarray('', '', cloneData.FirstUnderlyingCode1[0], '', '', '', '', '', '', '', '');
        //   }//Need to check || Jyoti S || 30-May-2023

          this.stkshift = cloneData.StkShifter[0];
          //this.paymentshift = cloneData.ComputedSettlementPeriodSoftTenor[0]; // Need to check || Jyoti S || 08-May-2023
          if ((!cloneData.SettShifter[0] || cloneData.SettShifter[0] !== '') && cloneData.settdate[0] !== '') {
            this.paymentshift = "Custom";
            this.customSetDate = cloneData.SettShifter[0];
            //console.log(" payment shift update", this.paymentshift, this.settdate)
          }
          else {
            this.paymentshift = cloneData.SettShifter[0] === '5' ? 'T + 5' : (cloneData.SettShifter[0] === '10' ? 'T + 10' : cloneData.SettShifter[0]);
            //console.log("paymentshift", this.paymentshift)
          }

          if (cloneData.customTenor[0] && cloneData.customTenor[0] !== '') {
            //console.log(this.Tenor);
            //console.log(cloneData.customTenor[0]);
            var TenorIdx = this.Tenor.findIndex(item => item.Key === cloneData.customTenor[0].toUpperCase())
            //console.log(TenorIdx);
            if (TenorIdx > -1) {
              this.expshift = cloneData.customTenor[0].toUpperCase();
            } else {
              this.expshift = 'Custom'
              this.customTenor = cloneData.customTenor[0].toUpperCase();
            }
          }
          this.expshift = cloneData.ExpShifter[0];

          this.Dates = await this.EcHome.BBVAGetDates(this.Exchange(), this.stkshift, '');
          if (this.Dates) {
              this.stkdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          }

          this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, this.paymentshift, this.stkdate);
          if (this.Dates) {
              this.settdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          }

          this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, this.expshift, this.settdate);
          if (this.Dates) {
              this.expdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          }
          if (cloneData.downLeverage[0] === '100.00') {
              this.downLeverageYN = 'N';
          } else {
              this.downLeverageYN = 'Y';
          }

          if (viewOnly) {

              // Removed client book mapping || PriyaL || 22Apr2022 || Assigned by Pranav D

              // this.onBehalfOf = cloneData.InputOnBehalfOfBook[0];
              // this.GetClientProdDetailsArr = this.EcHome.GetClientProdDetails(this.onBehalfOf);
              // if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
              //     if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation') > -1) {
              //         this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation')].CPM_Format).toString().split(',');
              //         this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation')].ActiveYN;
              //         //console.log(this.mappedformatlist, this.priceBtnActive);
              //     } else {
              //         if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All') > -1) {
              //             this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].CPM_Format).toString().split(',');
              //             this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].ActiveYN;
              //             //console.log(this.mappedformatlist, this.priceBtnActive);
              //         }
              //     }
              // }
            //   this.stkdate = this.datepipe.transform(cloneData.stkdate[0].split(' ')[0], 'yyyy-MM-dd'); //Need to check || Jyoti S || 30-May-2023
            //   this.settdate = this.datepipe.transform(cloneData.settdate[0].split(' ')[0], 'yyyy-MM-dd'); //Need to check || Jyoti S || 30-May-2023
            //   this.expdate = this.datepipe.transform(cloneData.expdate[0].split('T')[0], 'yyyy-MM-dd'); //Need to check || Jyoti S || 30-May-2023

              // this.rfqID = cloneData.RFQID[0]; //  //RFQIDcsv
              this.rfqID = cloneData.RFQIDcsv[0].trim().substring(0, cloneData.RFQIDcsv[0].length - 2);
              this.noteMasterID = cloneData.Note_Master_Id[0];
              this.NoteMasterID = cloneData.Note_Master_Id[0];
            //   this.sortedAllPrices = [{
            //       Price: (cloneData.SolveForValue[0] === '' && this.orderID !== '')
            //           ? 'Rejected' : cloneData.SolveForValue[0], solveFor: cloneData.InputRFQSolveFor[0]
            //   }];//Need to check || Jyoti S || 30-May-2023

              this.priceProvidersArr = [];

              for (let i = 0; i < cloneData.RFQIDcsv[0].trim().split(',').length - 1; i++) {
                  this.priceProvidersArr.push(
                      {
                          lp: cloneData.Counterparty[0].trim().split(',')[i].trim(),
                          rfq: cloneData.RFQIDcsv[0].trim().split(',')[i].trim(),
                          price: (cloneData.BestValue[0].trim().split(',')[i].trim() === '0' || cloneData.BestValue[0].trim().split(',')[i].trim() === '')
                              ? '-' : cloneData.BestValue[0].trim().split(',')[i].trim(),
                          bestPriceFlag: cloneData.BESTPriceFlag[0] ? cloneData.BESTPriceFlag[0].trim().split(',')[i].trim() : '',
                          id: cloneData.BBVAIDcsv[0].trim().split(',')[i].trim(),
                          //   BESTPriceFlag
                          timer: '-', // '0'
                          TSFlag: cloneData.Termsheetcsv[0].trim().split(',')[i].trim() === 'Y' ? true : false,
                          Msg: '',
                          KIDFlag: cloneData.KIDcsv[0].trim().split(',')[i].trim() === 'Y' ? true : false,
                          TSMsg: '',
                          // Min Max Limit changes on View action - Added by PriyaL || 21Apr2022 || Assigned by PranavD
                          minLimit: this.minNotional,
                          maxLimit: this.maxNotional
                      }
                  )
              }
              //console.log(this.priceProvidersArr);
              this.sortedAllPrices = {};
              this.sortedAllPrices = this.priceProvidersArr.filter(item => item.rfq === this.viewRFQ);
              //   this.NoteMasterID = this.sortedAllPrices[0].NoteMasterID;
              this.orderID = this.sortedAllPrices[0].id;
              //   this.orderStatus = this.sortedAllPrices[0].status;
              //console.log(this.sortedAllPrices);

              //    for(var i = 0; i < this.sortedAllPrices[0].length; i++){
              //     this.sortedAllPrices[0].Price = this.sortedAllPrices[i]['price'];
              //     delete this.sortedAllPrices[i].price;
              //    }  

              if (this.sortedAllPrices && this.sortedAllPrices.length > 0) {
                  this.sortedAllPrices[0] = Object.keys(this.sortedAllPrices[0]).reduce((object, key) => {
                      if (key !== 'price') {
                          object[key] = this.sortedAllPrices[0][key]
                      } else {
                          object['Price'] = this.sortedAllPrices[0][key]
                      }
                      return object
                  }, {});
                  this.orderID = this.sortedAllPrices[0].id;
              }

              switch (cloneData.SolveForValue[1]) {
                  case 'IBPrice': this.sortedAllPrices[0].Price; //cloneData.SolveForValue[0]; //;
                      this.replySolveFor = 'Price';
                      break;

              }

              if (this.sortedAllPrices && this.sortedAllPrices[0]) {
                  var idx = this.priceProvidersArr.findIndex(item => item.lp == this.sortedAllPrices[0].lp);
                  // array_move(this.priceProvidersArr, idx, 0)
                  this.bestLPArray = this.priceProvidersArr[idx];
                  this.bestLPArray.idx = idx

              }
          }//Changes done by Jyoti S || 30-May-2023 || END
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  async setSaveQuoteData(cloneData, viewOnly) {
      try {

          // Removed client book mapping || PriyaL || 22Apr2022 || Assigned by Pranav D

          // this.onBehalfOf = cloneData.onBehalfOf;
          // this.GetClientProdDetailsArr = this.EcHome.GetClientProdDetails(this.onBehalfOf);
          // if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
          //     if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation') > -1) {
          //         this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation')].CPM_Format).toString().split(',');
          //         this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation')].ActiveYN;
          //         //console.log(this.mappedformatlist, this.priceBtnActive);
          //     } else {
          //         if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All') > -1) {
          //             this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].CPM_Format).toString().split(',');
          //             this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].ActiveYN;
          //             //console.log(this.mappedformatlist, this.priceBtnActive);
          //         }
          //     }
          // }
          this.participationType = cloneData.ProductType;
          this.ddlNoteCcy = cloneData.Ccy;
          this.format = cloneData.FormatDetails;
          this.SolveForvalue = cloneData.SolveFor;
          // this.ShareBasket = [];
          // if (cloneData.Share.indexOf('##') !== -1) {
          //     // tslint:disable-next-line: prefer-for-of
          //     for (let i = 0; i < cloneData.Share.split('##')[0].split('#').length; i++) {
          //         this.ShareBasket.push({ Code: cloneData.Share.split('##')[0].split('#')[i] });
          //         this.setSelectedUnderlyingarray('', '', cloneData.Share.split('##')[0].split('#')[i], '', '', '', '', '', '', '', '');
          //     }
          // }
          this.ShareBasket = [];
          if (cloneData.Share.indexOf('##') !== -1) {
              for (let i = 0; i < cloneData.Share.split('##')[0].split('#').length; i++) {
                  this.shareCode = cloneData.Share.split('##')[0].split('#')[i];
                  this.showUnderlying('', SearchUnderlyingPipe.prototype.transform(this.shares, this.shareCode)[0]);
              }
          }
          this.IBPrice = cloneData.IBPrice;
          this.Notional = this.EcCommon.formatNotional(cloneData.Size);
          this.issuePrice = cloneData.IssuePrice;
          this.format = cloneData.Wrapper
          this.upStrike = cloneData.InputStrikePercent;
          this.upBarrierType = cloneData.InputKOBarrierFrequency;
          this.upGearing = cloneData.UpsideParticipationPercent;
          this.upBarrierLevel = cloneData.InitialInputKOBarrierPercent;
          if (this.upBarrierLevel !== '') {
              this.barrierLevelYN = 'Y';
          } else {
              this.barrierLevelYN = 'N';
          }

          // upperStrikeYN
          if (cloneData.UpsideParticipationCapPercent === '') {
              this.upperStrikeYN = 'N';
          } else {
              this.upperStrikeYN = 'Y';
          }

          this.upUpperStrike = cloneData.UpsideParticipationCapPercent;
          this.upRebate = cloneData.InputRebatePercent;
          // minCouponYN
          if (cloneData.InputMinimumCouponPercentPA === '') {
              this.minCouponYN = 'N';
          } else {
              this.minCouponYN = 'Y';
          }
          this.upCoupon = cloneData.InputMinimumCouponPercentPA;

          this.downStrike = cloneData.InputDownsideStrikePercent;
          this.downBarrierType = cloneData.InputKIBarrierFrequency;
          this.downLeverage = cloneData.DownsideParticipationPercent;
          this.downBarrierLevel = cloneData.InitialInputKIBarrierPercent;
          if (cloneData.DownsideParticipationCapPercent === '') {
              this.lowerStrikeYN = 'N';
          } else {
              this.lowerStrikeYN = 'Y';
          }
          this.downLowerStrike = cloneData.DownsideParticipationCapPercent;
          this.capitalGuaranteed = cloneData.DownsideCapitalProtectionPercent;
          this.guaranteedCoupon = cloneData.GuaranteedCoupon;
          this.guaranteedCouponFreq = cloneData.InputFixedCouponFrequencyPeriod;

           //Added by ApurvaK|| 18-Dec-2023|| FIN1EURINT-688
            if(cloneData.ComputedStrikeFixingLag == 'Forward'){
                this.stkdate = cloneData.StrikeShifterDate;
            }
            else{
                this.stkdate = '';
            }
          if (this.upRebate !== '') {
              this.rebateYN = 'Y';
          } else {
              this.rebateYN = 'N';
          }

          this.fundType = cloneData.FundingType;
          this.fundFreq = cloneData.FundingFrequency;

          this.fundRate = cloneData.IndexRateSpread;

          this.stkshift = cloneData.ComputedStrikeFixingLag;
          //this.paymentshift = cloneData.ComputedSettlementPeriodSoftTenor;
          if (cloneData.ComputedSettlementPeriodSoftTenor === '10B') {
            this.paymentshift = "T + 10"
          }
          else if (cloneData.ComputedSettlementPeriodSoftTenor === '5B') {
            this.paymentshift = "T + 5"
          }
          else {
            this.paymentshift = 'Custom';
          }// Changes done by Jyoti S || 08-May-2023

          this.expshift = cloneData.ComputedPayoffSoftTenor;

          this.Dates = await this.EcHome.BBVAGetDates(this.Exchange(), this.stkshift, '');
          if (this.Dates) {
              this.stkdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          }

        //   this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, this.paymentshift, this.stkdate);
        this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, cloneData.ComputedSettlementPeriodSoftTenor, this.stkdate); //Need to check || Jyoti S || 30-May-2023 || Temp by Jyoti S 
        //   if (this.Dates) {
        //       this.settdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
        //       // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        //   }
        if (this.Dates) {
            this.settdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
            // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
            if (cloneData.ComputedSettlementPeriodSoftTenor !== '10B' && cloneData.ComputedSettlementPeriodSoftTenor !== '5B') {
              this.paymentshift = 'Custom';
              // this.settdate = this.datepipe.transform(cloneData.IssueDate, 'yyyy-MM-dd');
              //this.settdate = cloneData.PaymentDate.split(' ')[0];
              this.customSetDate = cloneData.ComputedSettlementPeriodSoftTenor.split('B')[0];
            }
    
          }

          this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
        //   if (this.Dates) {
        //       this.expdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
        //       // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        //   }
        if (this.Dates) {
            this.expdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
            this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          }

          if (cloneData.DownsideParticipationPercent === '100.00') {
              this.downLeverageYN = 'N';
          } else {
              this.downLeverageYN = 'Y';
          }
          if (cloneData.Language !== undefined && cloneData.Country !== undefined)  // FIN1EURINT-502 || For updating regulatory information || Added by AdilP
      {
        this.priipsYN = "Yes"
        this.language = cloneData.Language
        this.country = cloneData.Country
      }
          if (viewOnly) {
              this.stkdate = cloneData.StrikeDate.split(' ')[0];
              this.settdate = cloneData.PaymentDate.split(' ')[0];
              this.expdate = cloneData.ExpiryDate.split(' ')[0];
              this.rfqID = '';
              this.replySolveFor = cloneData.RFQID;
              this.sortedAllPrices = [];
          } else {
              switch (this.SolveForvalue) {
                  case 'Strike':
                      this.upStrike = '';
                      break;
                  case 'IBPrice':
                      this.IBPrice = '';
                      break;
              }
          }
      } catch (error) {
          //console.log('Error:', error);
      }
  }




  onclickShareBasket(item: any) {
      // open dotnet popup base
      // window.open("https://euroconnect.test-equity-connect.com/FinIQWebApp/Technical_Charts/Technical_Charts.aspx?Bloomberg=" + item.Code + "&FIGI=&ISIN=&LongName=" + item.LongName + "&RIC=" + item.RICCode + "&Master_Popup=POPUP", "_blank", "");
      return false;
  }

  upUpperStrikeChange() {
      try {
          if (this.upUpperStrike === '' || this.upUpperStrike === '0') {
              this.upCoupon = '0.00';
          } else {
              this.upCoupon = '';
              this.upBarrierType = 'None';
              this.upBarrierLevel = '';
              this.upRebate = '';

          }
      } catch (error) {
          //console.log('Error:', error);
      }
  }
  changeupperStrikeYN(state) {
      try {
          this.reset();
          this.upperStrikeYN = state; // Added by Jyoti S || 24-Apr-2023
          if (this.upperStrikeYN === 'Y') {
              this.minCouponYN = 'N';
              this.upCoupon = '';
              this.upUpperStrike = '110.00';
              this.upBarrierType = 'None';
          } else {
              this.upUpperStrike = '';
              this.minCouponYN = 'Y';
              this.upCoupon = '0.00';
          }
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  changeminCouponYN(state) {
      try {
        if (this.SolveForvalue === 'UpperStrike') {
            this.SolveForvalue = 'IBPrice';
        }
          this.reset();
          this.minCouponYN = state; // Added by Jyoti S || 24-Apr-2023
          if (this.minCouponYN === 'Y') {
              this.upperStrikeYN = 'N';
              this.upUpperStrike = '';
              this.upCoupon = '0.00';
          } else {
              this.upperStrikeYN = 'Y';
              this.upCoupon = '';
              this.upUpperStrike = '110.00';
              this.upBarrierType = 'None';
              this.upBarrierLevel = '';
              this.upRebate = '';
          }
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  setFocus() {
      this.namefield.nativeElement.focus();
  }
//Downside Lower strike and leverage changes done by Jyoti S as suggested by Vipul B || 12-Dec-2023 || START
  changelowerStrikeYN(state) {
    try {
        this.reset();
        this.lowerStrikeYN = state; // Added by Jyoti S || 24-Apr-2023
        // this.infoMsg = '';
        if (this.SolveForvalue === 'LowerStrike' && this.downBarrierType === 'None') {
            this.SolveForvalue = 'IBPrice';
        }
        if (this.participationType === 'Booster') {
            if (this.lowerStrikeYN === 'Y') {
                this.downLowerStrike = '70.00';
            } else {
                this.downLowerStrike = '';
            }
        }
        // Added condition to check this.participationType === 'TwinWin KG' : Anubhav Goyal | 11-Sep-2023 | BBVAEPCLI-687 Participation: Twin Win KG UI changes 
        else if (this.participationType === 'Twin Win' || this.participationType === 'TwinWin KG') {
            this.downLowerStrike = '70.00';

        } else {
            this.downLowerStrike = '';

        }


        if (this.SolveForvalue !== 'Leverage') {
            if (((this.lowerStrikeYN === 'Y' && this.downLeverageYN === 'Y')
                || (this.lowerStrikeYN === 'N' && this.downLeverageYN === 'Y'))
                && this.SolveForvalue !== 'DownsideStrike' && this.SolveForvalue !== 'DownsideStrike + LowerStrike') {
                this.downLeverage = ((1 / parseFloat(this.downStrike)) * 10000).toFixed(2);
                }
            // } else {
            //     // Added condition if lowerstrike Y and downleverage N then downleverage Value '' | Anubhav Goyal | 1-June-2023 | BBVACLI-1121 Participation: Leverage toggle becomes 'No' on save/load portfolio  
                    
            //     if (this.downLeverageYN == 'N') {
            //         this.downLeverage = '100.00';
            //     } else {
            //         this.downLeverage = '100.00';
            //     }

            // }
        } else {
            this.downLeverage = '100.00';
        }

        // if (this.lowerStrikeYN === 'N') {
        //     this.downLeverageYN = 'N';
        //     this.downLeverage = '100.00';
        // }
//Downside Lower strike and leverage changes done by Jyoti S as suggested by Vipul B || 12-Dec-2023 || END
    } catch (error) {
         
    }
}

calculateLeverage() {
    try {
        if (this.participationType === 'Booster') {
            if (this.SolveForvalue !== 'Leverage') {
                if (((this.lowerStrikeYN === 'Y' && this.downLeverageYN === 'Y')
                    || (this.lowerStrikeYN === 'N' && this.downLeverageYN === 'Y'))
                    && this.SolveForvalue !== 'DownsideStrike' && this.SolveForvalue !== 'DownsideStrike + LowerStrike') {
                    this.downLeverage = ((1 / parseFloat(this.downStrike)) * 10000).toFixed(2);
                } else {
                    //When downLeverageYN = N , downLeverage should be '' | Added by Anubhav Goyal | 18-Oct-2023 | BBVAEPCLI- 731
                    //this.downLeverage = '';
                this.downLeverage = '100.00';

                }
            } else {
                this.downLeverage = '100.00';
            }
        }
    } catch (error) {

    }
}


  cloneSinglePricer() {
      this.viewOnly = false;
      this.viewRFQ = '';
      this.buttonList = 'Clone,View,';
      this.reset();
  }
//Downside Lower strike and leverage changes done by Jyoti S as suggested by Vipul B || 12-Dec-2023 || START
  changedownLeverageYN() {
    try {
        this.reset();
        //this.infoMsg = '';
        if (this.SolveForvalue !== 'Leverage') {
            if (((this.lowerStrikeYN === 'Y' && this.downLeverageYN === 'Y')
                || (this.lowerStrikeYN === 'N' && this.downLeverageYN === 'Y'))
                && this.SolveForvalue !== 'DownsideStrike' && this.SolveForvalue !== 'DownsideStrike + LowerStrike') {
                this.downLeverage = ((1 / parseFloat(this.downStrike)) * 10000).toFixed(2);
            } else {
                // START : BBVACLI-845 Pranav D 8-Feb-2023 
                if (this.lowerStrikeYN === 'Y') {
                    // Added condition if lowerstrike Y and downleverage N then downleverage Value '' | Anubhav Goyal | 1-June-2023 | BBVACLI-1121 Participation: Leverage toggle becomes 'No' on save/load portfolio  
                    if (this.downLeverageYN == 'N') {
                        this.downLeverage = '100.00';
                    } else {
                        this.downLeverage = '100.00';
                    }
                } else {
                    this.downLeverage = '100.00';
                }
                // END : BBVACLI-845 Pranav D 8-Feb-2023 
            }
        } else {
            this.downLeverage = '100.00';
        }
        //Downside Lower strike and leverage changes done by Jyoti S as suggested by Vipul B || 12-Dec-2023 || END
    } catch (error) {
         
    }
}

  txtupCouponChange() {
      if (this.upCoupon !== '0.00') {
          this.upBarrierType = 'None';
          this.upBarrierLevel = '';
          this.upRebate = '';
      }
  }

  async txtTenorDateChange(type: any) {
      try {
          let CustomIssueDate: string = this.customSetDate ? (this.customSetDate  + 'B') : '';
          let strDate = '';
          this.priceBtnActive = 'Y'; //ApurvaK 
          $("#txtstkdate").next(".error-input").remove();
          $("#txtstkdate").next(".validate-popup").remove();
          $("#txtsettdate").next(".error-input").remove();
          $("#txtsettdate").next(".validate-popup").remove();
          //if (type === 'Payment') {
              this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? CustomIssueDate : (this.paymentshift === 'T + 10' ? '10B' : '5B')), this.stkdate);
              if (this.Dates && this.Dates.MaturityDate !== "") {
              strDate = this.EcCommon.formatDate(this.Dates.MaturityDate);
              }
              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
              // }
              //if (this.paymentshift !== 'Custom') {
              this.settdate = strDate;
              //}
            //   this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
            //   if (this.Dates) {
            //   this.expdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
            //   }
              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          //}
          //if (type === 'Expiry') {

              this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
              if (this.Dates) {
              strDate = this.EcCommon.formatDate(this.Dates.MaturityDate);
              // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
              }
              this.expdate = strDate;
          //}
        //   if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
        //       || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
        //       this.ErrorMsgTop = 'Please select valid strike date.';
        //       document.getElementById('txtstkdate').classList.add('error');
        //       $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtstkdate")
        //       $('.validate-popup').delay(5000).fadeOut('slow');
        //       return false;
        //   }
        if (this.stkdate === '' || (Date.parse(this.stkdate) > Date.parse(this.settdate))
        || (Date.parse(this.stkdate) > Date.parse(this.expdate))) {
        this.ErrorMsgTop = 'Please select valid strike date.';
        if (document.getElementById('txtstkdate')) {
          document.getElementById('txtstkdate').classList.add('error');
        }
        return false;
      }
        //   if (this.settdate === '' || (Date.parse(this.settdate) > Date.parse(this.expdate))) {
        //       document.getElementById('txtsettdate').classList.add('error');
        //       this.ErrorMsgTop = 'Please select valid payment date.';
        //       $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtsettdate")
        //       $('.validate-popup').delay(5000).fadeOut('slow');
        //       return false;
        //   }

        if (this.settdate === '' || (Date.parse(this.settdate) > Date.parse(this.expdate))) {
            if (document.getElementById('txtsettdate')) {
              document.getElementById('txtsettdate').classList.add('error');
            }
            this.ErrorMsgTop = 'Please select valid payment date.';
            $('<div class="error-input" style="left:150px"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#customOffset")
            $('.validate-popup').delay(5000).fadeOut('slow');
            return false;
          }
          if ((Date.parse(this.expdate) < Date.parse(this.settdate))) {
              // document.getElementById('txtexpdate').classList.add('error');
              this.ErrorMsgTop = 'Please select valid expiry date.';
              return false;
          }
      } catch (error) {
          //console.log('Error', error);
      }
  }

  async GetTriggerValue(type: any) {

      if (type === 'fundRate') {
          this.TriggerValueArr = await this.EcHome.GetTriggerValues(this.expshift, this.fundFreq,
              this.fundRate, '', '');
          //console.log(this.TriggerValueArr);
          this.fundRatePopup = true;
      }
  }

  onClickedOutside(type: any) {
      if (type === 'fundRate') {
          this.fundRatePopup = false;
      }
  }

  priceOptions() {
      try {
          this.priceoptionflag = !this.priceoptionflag;
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

  saveOptions() {
      try {
          this.saveoptionflag = !this.saveoptionflag;
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

  showSchedulePopup() {
      try {
          this.ErrorMsg = '';
          this.ErrorMsgTop = '';
          this.scheduleMsg = '';
          this.validationOnButton();
          if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
              this.showSchedulePopupFlag = !this.showSchedulePopupFlag;
              this.dateChanged();
          }
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

  hideSchedulePopup() {
      try {
          this.showSchedulePopupFlag = false;
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

  showsaveSharePopup() {
      try {
          this.validationOnButton();
          if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
              this.showsaveSharePopupFlag = !this.showsaveSharePopupFlag;
              // const res = this.EcHome.GetMappedUsersAndGroups();
              // this.users = this.EcHome.GetMappedUsersAndGroups();

              // //console.log('Result', res);
              // //console.log('users', this.users);
              this.currentowner = AppConfig.settings.oRes.userID;
          }

      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

  hidesaveSharePopup() {
      try {
          this.showsaveSharePopupFlag = false;
          this.saveportfolioId = '';
          this.userBasket = [];
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
    }

  //Added by Varsha G || FIN1EURINT-277 || 04-May-2023
  updateVariant(){
    try{
      if(this.portfolioName != this.selectedVariantName){
        this.updateMessagePopupFlag=true;
      }else{
        this.updatePortfolio();
      }
    }catch(error){

    }
  }

  onBehalfOfChange() {
      this.mappedformatlist = [];
      // this.priceBtnActive = 'N';
      this.priceBtnActive = 'Y'; // set to 'Y' on changing onbehalf || PriyaL || 22Apr2022 || Assigned by Pranav D

      // Removed client book mapping || PriyaL || 22Apr2022 || Assigned by Pranav D

      // this.GetClientProdDetailsArr = this.EcHome.GetClientProdDetails(this.onBehalfOf);
      // if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
      //   if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'EQC_Europe') > -1) {
      //     this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'EQC_Europe')].CPM_Format).toString().split(',');
      //     this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'EQC_Europe')].ActiveYN;
      //     //console.log(this.mappedformatlist, this.priceBtnActive);
      //   } else {
      //     if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All') > -1) {
      //       this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].CPM_Format).toString().split(',');
      //       this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].ActiveYN;
      //       //console.log(this.mappedformatlist, this.priceBtnActive);
      //     }
      //   }
      // }
  }


  // save share user changes

  backKeyPress_User(e) {
      try {
          // this.flag = false;
          // // this.shareCode = '';
          // this.userCode = '';
          // // this.selectedBIndex = 0;
          // this.selectedBIndex_User = 0;

          this.selectedUserIndex = 0;
          this.flag = true;
          this.userCode = '';
          this.selectedBIndex_User = 0;
          this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;

          if (this.userName.length === 1) {
              this.showSuggestions = false;
              this.flag = false;
          }
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  ChangeIndex_User(e) {
      try {
          // this.selectedShareIndex = 0;
          this.selectedUserIndex = 0;
          this.userflag = true;
          this.userCode = '';
          this.selectedBIndex_User = 0;
          this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
      } catch (Error) {
      }
  }

  selectUser(e) {
      try {
          this.userflag = false;
          // if ($('.HoverSuggestion').data('share') !== undefined) {
          if ($('.HoverSuggestion').data('user') !== undefined) {
              this.userCode = $('.HoverSuggestion').data('user');
          }
          if (this.userCode !== undefined && this.userCode !== '') {
              this.showUser(e, SearchUserGroupPipe.prototype.transform(this.users, this.userCode)[0]);
          }
      } catch (Error) {
          //console.log('Error', Error);
      }
  }

  showUser(event, item) {
      try {
          this.userflag = false;
          this.selectedBIndex_User = 0;
          this.showSuggestions_User = false;
          this.userName = '';
          //console.log(item);
          if (this.userBasket.find(i => i.Code === item.Code) === undefined) {
              this.userBasket.push({ 'Code': item.Code, 'Name': item.Name, 'Type': item.Type, 'Access': 'VIEW', 'NewAddFlag': true });
          }
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  async deleteUserfromList(index: any) {
      this.successMsg = '';
      let groupdelete = [];
      let userdelete = [];
      const name = this.userBasket[index]['Name'];
      const type = this.userBasket[index]['Type'];
      if (type === 'GROUP' || type === 'Group') {
          groupdelete[0] = this.userBasket[index].Code;

      }
      if (type === 'USER' || type === 'User') {
          userdelete[0] = this.userBasket[index].Code;
      }
      const res = await this.EcHome.InsertPortfolioSharing(this.currentowner, [],
          [], this.saveportfolioId, [], [], groupdelete, userdelete);
      if (res) {
          this.userBasket.splice(index, 1);

          this.successMsg = type + ' ' + name + ' access removed sucessfully.';
      }


  }

  async changeAccessofUserGroup(e: Event, index: any) {
      const target = await this.EcCommon.GetEventTarget(e);
      let res: any;
      //console.log(target.value);

      this.userBasket[index]['Access'] = target.value;

  }

  async sharePortfolio() {
    if(this.userBasket && this.userBasket.length > 0){
        if (this.portfolio === '') {
            this.Save();
        } else {
            await this.updatePortfolio();
        }
        if (this.saveportfolioId !== '') {
            // let groupEdit =[];
            let groupView = [];
            let userEdit = [];
            let userView = [];
            for (let i = 0, j = 0, k = 0, m = 0; i < this.userBasket.length; i++) {
                if (this.userBasket[i]['Type'] === 'GROUP' || this.userBasket[i]['Type'] === 'Group') {
                    groupView[j] = this.userBasket[i].Code;
                    j++;
                }
                if (this.userBasket[i]['Type'] === 'USER' || this.userBasket[i]['Type'] === 'User') {
                    if (this.userBasket[i]['Access'] === 'EDIT') {
                        userEdit[k] = this.userBasket[i].Code;
                        k++;
                    }
                    if (this.userBasket[i]['Access'] === 'VIEW') {
                        userView[m] = this.userBasket[i].Code;
                        m++;
                    }
                }

            }
            //console.log(userView, userEdit, groupView);
            let PortfolioID = this.saveportfolioId.toString();
            const res = await this.EcHome.InsertPortfolioSharing(this.currentowner, [], groupView, PortfolioID, userEdit, userView, [], []);
            if (res["Status"]?.toUpperCase() === "SUCCESS") {
                this.saveFlag = true;
                this.successMsg = 'Template ' + this.portfolioName + ' saved and shared successfully.';
                this.saveportfolioId = '';
                this.userBasket = [];
                this.showsaveSharePopupFlag = false;
            }

        }
    }else{
        this.successMsg = '';
        this.errorTemplateMessage = 'Please enter user ID or client group';
    }

  }

  async scheduleSend() {
      try {
          this.scheduleMsg = '';
          this.ErrorMsg = '';
          this.ErrorMsgTop = '';
          if (!this.EcCommon.validTime(await this.EcCommon.getInputTime(this.inputTime))) {
              this.ErrorMsgTop = 'Please enter valid time in hh:mm (am/pm) format';
              $('#loading').hide();
              return false;
          } else {
              this.ErrorMsgTop = '';
          }
          this.validationOnButton();
          const sDate = new Date(this.inputDate + ' ' + await this.EcCommon.getInputTime(this.inputTime));
          const today = new Date();
          if (sDate < today) {
              this.ErrorMsgTop = 'Please enter valid time';
              return false;
          }
          if (Date.parse(this.stkdate) < Date.parse(this.inputDate)) {
              this.ErrorMsgTop = 'Strike date must be greater than schedule date.';
              return false;
          }
          const timeinsecs = Math.round((sDate.getTime() - today.getTime()) / 1000);
          if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
              this.portfolioGroupID = await this.EcHome.fnportfolioGroupID();
              const xmlstr = this.generateXML();
              const res = await this.EcHome.SchedulePrice('Participation', xmlstr,
                  sDate, 'SINGLE_PRICER', this.portfolioGroupID, timeinsecs, 'BBVA', this.SolveForvalue, this.allBooksData[this.allBooksData.findIndex(x => x.BookCode === this.onBehalfOf)].BookName);
              if (res) {
                  this.scheduleMsg = 'Request scheduled successfully.';
              }
          }
      } catch (error) {

      }
      return false;
  }

  startCountDownOld(sec, index) {
      let counter = sec;

      var interval1 = setInterval(() => {
          ////console.log( counter);  
          if (this.priceProvidersArr.length <= 0) {
              clearInterval(interval1);
          }
          if (this.priceProvidersArr.length > 0) {
              this.priceProvidersArr[index].timer = counter;
              counter--;
          }


          if (counter < 0) {

              clearInterval(interval1);


          };
      }, 1000);

  }

//   startCountDown(sec, index) {

//       let starttime = new Date().getTime();
//       let counter = sec;
//       //console.log(this.priceProvidersArr);

//       this.priceProvidersArr[index].timeStartFlag = true;
//       this.priceProvidersArr[index].interval1 = setInterval(() => {
//           ////console.log( counter);  
//           if (this.priceProvidersArr.length <= 0) {
//               clearInterval(this.priceProvidersArr[index].interval1);
//               this.priceProvidersArr[index].price = 'Timeout';
//           }
//           if (this.priceProvidersArr.length > 0) {
//               this.priceProvidersArr[index].timer = counter;
//               counter--;
//           }
//           if (counter < 0) {
//               clearInterval(this.priceProvidersArr[index].interval1);
//               if (this.priceProvidersArr[index].rfq === '') {

//                   this.priceProvidersArr[index].price = 'Timeout';
//               }

//               this.priceProvidersArr[index].timeStartFlag = false;
//           };


//           // Clear timer if system is on sleep mode - added by Priya L. on 25Mar2022 - assigned by Pranav D.
//           let curtime = new Date().getTime();
//           let timediff = parseInt(((curtime - starttime) / 1000).toString())

//           // //console.log('1234',starttime, curtime , parseInt(((curtime  - starttime)/1000).toString())) 

//           if (timediff !== counter) {
//               counter = this.defaultTimeout - timediff;
//               if (counter < 0) {
//                   counter = 0;
//                   this.loadflag = false;
//                   clearInterval(this.interval);
//                   for (let i = 0; i < this.priceProvidersArr.length; i++) {
//                       if (this.priceProvidersArr[i].price === '-') {
//                           this.priceProvidersArr[i].price = 'Timeout'
//                       }
//                   }
//               }
//           }
//       }, 1000);

//   }
startCountDown(sec, index) {

    let starttime = new Date().getTime();
    let counter = sec;
    //console.log(this.priceProvidersArr);
    
    this.priceProvidersArr[index].timeStartFlag = true;
    this.priceProvidersArr[index].interval1 = setInterval(() => {
      ////console.log( counter);  
    //<Sudarshan| condition always false | dead code | 30-May-23>
    //   if (this.priceProvidersArr.length <= 0) {
    //     clearInterval(this.priceProvidersArr[index].interval1);
    //     this.priceProvidersArr[index].price = 'Timeout';
    //   }
      if (this.priceProvidersArr[index].price != '-') {//Changed by Varsha G || For starting timer after LP quote response received || 12-Apr-2023
        this.priceProvidersArr[index].timer = counter;
        counter--;
      }
      if (counter < 0) {
        clearInterval(this.priceProvidersArr[index].interval1);
        // if (this.priceProvidersArr[index].rfq === '') {


        //   this.priceProvidersArr[index].price = 'Timeout';
        // }

        this.priceProvidersArr[index].timeStartFlag = false;
      }
      if (this.timeLeft <= 0 && this.priceProvidersArr[index].price == '-')
      {  
        this.loadflag = false;
        if (this.priceProvidersArr[index].price == '-') 
        {
          this.priceProvidersArr[index].price = 'Timeout';
        }        
        this.priceBtnActive = 'Y'
        this.priceProvidersArr[index].loadFlag = false
        clearInterval(this.priceProvidersArr[index].interval1);
      }
      // Clear timer if system is on sleep mode - added by Priya L. on 25Mar2022 - assigned by Pranav D.
      let curtime = new Date().getTime();
      let timediff = (curtime - starttime) / 1000;

      // //console.log('1234',starttime, curtime , parseInt(((curtime  - starttime)/1000).toString())) 

      if (timediff !== counter) {
        // counter = this.defaultTimeout - timediff;// Commented by Varsha G || 12-Apr-2023 || To prevent counter decrement before LP Quote response received. 
        if ((this.defaultRFQTimeout - timediff) < 0) {
          //counter = 0;
          this.loadflag = false;
          clearInterval(this.interval);
        //   for (let i = 0; i < this.priceProvidersArr.length; i++) {
        //     if (this.priceProvidersArr[i].price === '-') {
        //       // this.priceProvidersArr[i].price = 'Timeout'//Code commented by Varsha G || 12-Apr-2023 || Suggested by Sudarshan P 
        //       this.priceBtnActive = 'Y'
        //       this.priceProvidersArr[i].loadFlag = false
        //     }
        //   }
        if (this.priceProvidersArr[index].price == '-') {
            this.priceProvidersArr[index].price = 'Timeout';
          }
          this.priceBtnActive = 'Y'
          this.priceProvidersArr[index].timer = 0 ;
          this.priceProvidersArr[index].loadFlag = false
          clearInterval(this.priceProvidersArr[index].interval1);
        }
      }
    }, 1000);

  }

 //Modified by Sudarshan P|| 20-Apr-2023
 async RequestTermsheet() {
    try {
      this.TSFlag = false;
      this.ErrorMsgTop = '';
      this.ErrorMsgTop = '';
      this.sortedAllPrices[0].TSDisableFlag = true;
      this.sortedAllPrices[0].TSLoadFlag = true;
      //const errorMsg: any = this.apifunctions.termsheetSender(this.orderID, '', this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'AutocallablePhoenixER', this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'AutocallablePhoenixER', 'TS');
      const res: any = await this.EcHome.termsheetSender(this.sortedAllPrices[0].lp, this.sortedAllPrices[0].rfq, 'Participation', this.language, this.country);
      
      if (res?.status.toLowerCase() === 'success' || res?.status.toLowerCase() === 'awaited') {
        //if (errorMsg === '') {
          this.sortedAllPrices[0].TSLoadFlag = false;
          this.reqSuccessMsg = 'TS Awaited.';
        let TSTimeLeft = this.TSTimeout;

        const that = this;

        const TSInterval = setInterval(async () => {
          if (TSTimeLeft > 0) {

            const res: any = await this.EcHome.ViewTermsheet(that.sortedAllPrices[0].rfq, 'IndicativeTermsheet');
            if (res?.length) {
              if (res[0].Status.toString().toUpperCase() === 'SUCCESS') {
                this.sortedAllPrices[0].TSFlag = true;
                TSTimeLeft = 0;
                clearInterval(TSInterval);
                that.reqSuccessMsg = 'Received.';
                that.sortedAllPrices[0].TSDisableFlag = false;
              } else {
                //that.TSFlag = false;
                TSTimeLeft = TSTimeLeft - 10;
              }

            } else {
              //that.TSFlag = false;
              TSTimeLeft = TSTimeLeft - 10;
            }
          } else if (TSTimeLeft === 0 && that.sortedAllPrices[0].TSFlagTSFlag === false) {

            that.sortedAllPrices[0].TSDisableFlag = false;
            that.reqSuccessMsg = 'Termsheet response is taking longer than expected.Please try again later.';
            clearInterval(TSInterval);
          }
        }, 10000);
        this.intervals.add(TSInterval);
      } else {
        this.sortedAllPrices[0].TSDisableFlag = false;
        this.sortedAllPrices[0].TSLoadFlag = false;
        this.reqSuccessMsg = 'TS Request Failed.';
      }

      return false;
    } catch (error) {
      return false;
      //console.log('Error:', error);
    }
  }

  async ViewTermsheet() {
      try {
          // $(document).bind('ajaxStart', () => {
          //     $('#loading').hide();
          //   });
          this.ErrorMsg = '';
          this.ErrorMsgTop = '';
          this.docsData = [];
          let showFlag = false;
          this.sortedAllPrices[0].ViewTSFlag = true;
          const res = await this.EcHome.ViewTermsheet(this.sortedAllPrices[0].rfq, 'IndicativeTermsheet');
          this.sortedAllPrices[0].ViewTSFlag = false;
          const thisRef = this;
          this.docsPopupLabels = [
           {title: "Counterparty", value: this.sortedAllPrices[0].lp},
        ];
          if (res?.length) {
            //<Sudarshan | base64 to Bytes>
            //Added by Apurva K||05-Dec-2023|| View TS popup not opening||FIN1EURINT-689
            res.forEach(function (item : any) {
                if (item.Status.toString().toUpperCase() === 'SUCCESS') {
                  const downloadLink = document.createElement('a');
                let fileName = item.Document_Output_Path;
                downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
                downloadLink.download = fileName;
                 const obj = {
                   "Type": item["DocumentType"],
                   "Country": item["DocumentCountry"],
                   "Language": item["DocumentLanguage"],
                   "File Name": item["Document_Output_Path"],
                   "View": () => { downloadLink.click();},
                 }
                 thisRef.docsData.push(obj);
                 showFlag = true;          
               }
               else {
                 this.ErrorMsgTop = item.Status.toString();
                 showFlag = false;
               }
             });
            //</Sudarshan | base64 to Bytes> 
            this.showDocsPopup = showFlag;  
          } else {
            this.showDocsPopup = false;
            this.reqSuccessMsg = 'Termsheet not available. Please try again later.';      
        }
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;

  }

//   async RequestKIDonView() {
//       try {
//           this.TSFlag = false;
//           this.ErrorMsg = '';
//           this.ErrorMsgTop = '';
//           const errorMsg = await this.EcHome.termsheetSender(this.sortedAllPrices[0].id, this.onBehalfOf, 'AutocallablePhoenix', 'AutocallablePhoenix', 'KID');
//           if (errorMsg === '') {
//               // this.reqSuccessMsg = 'Requested.';
//               this.sortedAllPrices[0].Msg = 'KID Requested.';
//               let TSTimeLeft = this.TSTimeout;

//               const that = this;
//               that.TSInterval = setInterval(async () => {
//                   if (TSTimeLeft > 0) {
//                       const res = await this.EcHome.ViewTermsheet(that.sortedAllPrices[0].rfq, 'KID Termsheet');
//                       if (res !== null && res !== undefined) {
//                           if (res.Status.toString().toUpperCase() === 'SUCCESS') {
//                               that.sortedAllPrices[0].KIDFlag = true;
//                               TSTimeLeft = 0;
//                               clearInterval(that.TSInterval);
//                               // that.reqSuccessMsg = 'Received.';
//                               that.sortedAllPrices[0].Msg = 'KID Received.';

//                           } else {
//                               that.sortedAllPrices[0].KIDFlag = false;
//                               TSTimeLeft = TSTimeLeft - 10;
//                           }

//                       } else {
//                           that.sortedAllPrices[0].KIDFlag = false;
//                           TSTimeLeft = TSTimeLeft - 10;
//                       }
//                   } else if (TSTimeLeft === 0 && that.sortedAllPrices[0].KIDFlag === false) {
//                       // that.ErrorMsg = "Termsheet response is taking longer time than expected. Please try again later.";
//                       // tslint:disable-next-line: max-line-length
//                       that.ErrorMsg = 'KID response is taking longer than expected hence KID will not display on this screen.\n Instead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section.';
//                       clearInterval(that.TSInterval);
//                   }
//               }, 10000);
//           } else {
//               // this.reqSuccessMsg = 'TS Request Failed.';
//               this.sortedAllPrices[0].Msg = 'KID Request Failed.';
//           }

//           return false;
//       } catch (error) {
//           return false;
//           //console.log('Error:', error);
//       }
//   }

//Modified by Sudarshan P|| 20-Apr-2023
async RequestKIDonView() {
    try {
      this.TSFlag = false;
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      const res: any = await this.EcHome.KIDSender(this.sortedAllPrices[0].lp, this.sortedAllPrices[0].rfq, 'Participation', this.language, this.country);
      
      if (res?.status.toLowerCase() === 'success') {
        // this.reqSuccessMsg = 'Requested.';
        this.sortedAllPrices[0].Msg = 'KID Requested';
        let TSTimeLeft = this.TSTimeout;

        const that = this;
        const KIDInterval = setInterval(async() => {
          if (TSTimeLeft > 0) {
            const res: any = await this.EcHome.ViewTermsheet(that.sortedAllPrices[0].rfq, 'Kid');//Apurva K|| FIN1EURINT-385|| 23-May-2023
            if (res?.length) {
              if (res[0].Status.toString().toUpperCase() === 'SUCCESS') {
                that.sortedAllPrices[0].KIDFlag = true;
                TSTimeLeft = 0;
                clearInterval(KIDInterval);
                // that.reqSuccessMsg = 'Received.';
                that.sortedAllPrices[0].Msg = 'KID Received';

              } else {
                that.sortedAllPrices[0].KIDFlag = false;
                TSTimeLeft = TSTimeLeft - 10;
              }

            } else {
              that.sortedAllPrices[0].KIDFlag = false;
              TSTimeLeft = TSTimeLeft - 10;
            }
          } else if (TSTimeLeft === 0 && that.sortedAllPrices[0].KIDFlag === false) {
            that.ErrorMsg = 'KID response is taking longer than expected hence KID will not display on this screen.\n Instead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section.';
            clearInterval(KIDInterval);
          }
        }, 10000);
        this.intervals.add(KIDInterval);
      } else {
        // this.reqSuccessMsg = 'TS Request Failed.';
        this.sortedAllPrices[0].Msg = 'KID Request Failed';
      }

      return false;
    } catch (error) {
      return false;
      //console.log('Error:', error);
    }
  }

//Changes 
  async ViewKIDonView() {
    try {
      //Changed by Jyoti S || 31-May-2023 || START
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.docsData = [];
      let showFlag = false;
      this.sortedAllPrices[0].ViewKIDFlag = true;
      const res: any = await this.EcHome.ViewTermsheet(this.sortedAllPrices[0].rfq, 'Kid');//Apurva K|| FIN1EURINT-385|| 23-May-2023
      this.sortedAllPrices[0].ViewKIDFlag = false;
      const thisRef = this;
      this.docsPopupLabels = [
        {title: "Counterparty", value: this.sortedAllPrices[0].lp},
      ];
      if (res?.length) {
        //<Sudarshan | base64 to Bytes>
        const downloadLink = document.createElement('a');
        res.forEach(function (item : any) {
          if (item.Status.toString().toUpperCase() === 'SUCCESS') {
            const downloadLink = document.createElement('a');
          let fileName = item.Document_Output_Path;
          downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
          downloadLink.download = fileName;
           const obj = {
             "Type": item["DocumentType"],
             "Country": item["DocumentCountry"],
             "Language": item["DocumentLanguage"],
             "File Name": item["Document_Output_Path"],
             "View": () => { downloadLink.click();},
           }
           thisRef.docsData.push(obj);
           showFlag = true;          
         }

         else {
           this.ErrorMsgTop = item.Status.toString();
           showFlag = false;
         }
       });  
       this.showDocsPopup = showFlag;  

      } else {
        this.showDocsPopup = false;
        this.reqSuccessMsg = 'KID not available. Please try again later.';

      }//Changed by Jyoti S || 31-May-2023 || END
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
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
      //console.log('Error', error);
    }
  }

  async RequestKID(index: any) {
    try {
      this.TSFlag = false;
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.priceProvidersArr[index].KIDLoadFlag= true;//Apurva K||09-May-2023

      // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
      // const errorMsg = this.apifunctions.termsheetSender(this.priceProvidersArr[index].id, this.onBehalfOf, 'AutocallablePhoenix', 'AutocallablePhoenix', 'KID');
      //const errorMsg: any = await this.apifunctions.termsheetSender(this.priceProvidersArr[index].id, '', 'AutocallablePhoenix', 'AutocallablePhoenix', 'KID');
      //Modified by Sudarshan P|| 20-Apr-2023
      const res: any = await this.EcHome.KIDSender(this.priceProvidersArr[index].lp, this.priceProvidersArr[index].rfq, 'Participation', this.language, this.country);
       //Changes by Apurva K|| 18-May-2023 || for Awaited response in request TS
      if ((res?.status.toLowerCase() === 'success' || res?.status.toLowerCase() === 'awaited') && (this.priceProvidersArr[index].price !== "-")) {        
        this.priceProvidersArr[index].Msg = 'KID Awaited';  
        this.priceProvidersArr[index].KidDisableFlag = true;  //Added by Apurva K|| 22-May-2023||FIN1EURINT-359
        this.priceProvidersArr[index].KIDLoadFlag= false;//Apurva K||09-May-2023
        let TSTimeLeft = this.TSTimeout;

        const that = this;
        // Changes done by Apurva K || 17-May-2023 || View btn not visible on UI when clicked simultaneously with Request TS
        const KIDInterval = setInterval(async () => {
          if (TSTimeLeft > 0) {
            const res: any = await this.EcHome.ViewTermsheet(that.priceProvidersArr[index].rfq, 'Kid');//Apurva K|| FIN1EURINT-385|| 23-May-2023
            if (res?.length) {
              if (res[0].Status.toString().toUpperCase() === 'SUCCESS') {
                that.priceProvidersArr[index].KIDFlag = true;
                TSTimeLeft = 0;
                clearInterval(KIDInterval);
                // that.reqSuccessMsg = 'Received.';
                that.priceProvidersArr[index].Msg = 'KID Received';

              } else {
                that.priceProvidersArr[index].KIDFlag = false;
                TSTimeLeft = TSTimeLeft - 10;
              }

            } else {
              that.priceProvidersArr[index].KIDFlag = false;
              TSTimeLeft = TSTimeLeft - 10;
            }
          } else if (TSTimeLeft === 0 && that.priceProvidersArr[index].KIDFlag === false) {
            // that.ErrorMsg = "Termsheet response is taking longer time than expected. Please try again later.";
            // tslint:disable-next-line: max-line-length
            that.ErrorMsg = 'KID response is taking longer than expected hence KID will not display on this screen.\n Instead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section.';
            this.priceProvidersArr[index].KIDLoadFlag= false;//Apurva K||09-May-2023
            clearInterval(KIDInterval);
          }
        }, 10000);
        this.intervals.add(KIDInterval);
      } else {
        // this.reqSuccessMsg = 'TS Request Failed.';
        this.priceProvidersArr[index].Msg = 'KID Request Failed';
        this.priceProvidersArr[index].KIDLoadFlag= false;//Apurva K||09-May-2023
      }

      return false;
    } catch (error) {
      return false;
      //console.log('Error:', error);
    }
  }

  async ViewKID(index: any) {
    try {
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.docsData = [];
      let showFlag = false;
      this.priceProvidersArr[index].ViewKIDFlag = true;  //Added by Kaustubh S|| 18-May-2023

      const res: any = await this.EcHome.ViewTermsheet(this.priceProvidersArr[index].rfq, 'Kid'); //Apurva K|| FIN1EURINT-385|| 23-May-2023
      this.priceProvidersArr[index].ViewKIDFlag = false;  //Added by Kaustubh S|| 18-May-2023
      const thisRef = this;
      this.docsPopupLabels = [
        {title: "Counterparty", value: this.priceProvidersArr[index]["lp"]},
      ];
      if (res?.length) {
       //<Sudarshan | base64 to Bytes>
       res.forEach(function (item : any) {
         if (item.Status.toString().toUpperCase() === 'SUCCESS') {
           const downloadLink = document.createElement('a');
           let fileName = item.Document_Output_Path;
           downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
           downloadLink.download = fileName;
            const obj = {
              "Type": item["DocumentType"],
              "Country": item["DocumentCountry"],
              "Language": item["DocumentLanguage"],
              "File Name": item["Document_Output_Path"],
              "View": () => { downloadLink.click();},
            }
            thisRef.docsData.push(obj);
            showFlag = true;
          }
          else {
            this.ErrorMsgTop = item.Status.toString();
            showFlag = false;
          }
       });
       //</Sudarshan | base64 to Bytes>
       this.showDocsPopup = showFlag;      

      } else {
        this.showDocsPopup = false;
        this.ErrorMsgTop = 'KID not available. Please try again later.';

      }
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

  async RequestTS(index: any) {
    try {
      this.TSFlag = false;
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.priceProvidersArr[index].TSLoadFlag= true;//Apurva K||26-Apr-2023||FIN1EURINT-246
      
      //const errorMsg: any = this.apifunctions.termsheetSender(this.priceProvidersArr[index].id, '', this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'AutocallablePhoenixER',
       // this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'AutocallablePhoenixER', 'TS');
        const res: any = await this.EcHome.termsheetSender(this.priceProvidersArr[index].lp, this.priceProvidersArr[index].rfq, 'Participation', this.language, this.country);
        //Changes by Apurva K|| 18-May-2023 || for Awaited response in request TS
        if ((res?.status.toLowerCase() === 'success' || res?.status.toLowerCase() === 'awaited') && (this.priceProvidersArr[index].price !== "-")) {
            this.priceProvidersArr[index].TSMsg = 'TS Awaited';
            // this.reqSuccessMsg = 'Requested.';
            this.priceProvidersArr[index].TSDisableFlag = true;  //Added by Apurva K|| 22-May-2023||FIN1EURINT-359
            this.priceProvidersArr[index].TSLoadFlag = false; //Apurva K||26-Apr-2023||FIN1EURINT-246
            let TSTimeLeft = this.TSTimeout;

            const that = this;
            const TSInterval = setInterval(async () => {
                if (TSTimeLeft > 0) {
                    const res: any = await this.EcHome.ViewTermsheet(that.priceProvidersArr[index].rfq, 'IndicativeTermsheet');
                    if (res?.length) {
                        if (res[0].Status.toString().toUpperCase() === 'SUCCESS') {
                            that.priceProvidersArr[index].TSFlag = true;
                            TSTimeLeft = 0;
                            clearInterval(TSInterval);
                            // that.reqSuccessMsg = 'Received.';
                            that.priceProvidersArr[index].TSMsg = 'TS Received';

                        } else {

                            that.TSFlag = false;
                            TSTimeLeft = TSTimeLeft - 10;
                        }

                    } else {
                        that.priceProvidersArr[index].TSFlag = false;
                        TSTimeLeft = TSTimeLeft - 10;
             
                    }
                } else if (TSTimeLeft === 0 && that.priceProvidersArr[index].TSFlag === false) {
                    that.ErrorMsg = 'Termsheet response is taking longer than expected hence Termsheet will not display on this screen.\n Instead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section.';
                    this.priceProvidersArr[index].TSLoadFlag = false; //Apurva K||26-Apr-2023||FIN1EURINT-246
                    clearInterval(TSInterval);
                }
            }, 10000);
            this.intervals.add(TSInterval);
        } else {
            // this.reqSuccessMsg = 'TS Request Failed.';

            this.priceProvidersArr[index].TSMsg = 'TS Request Failed';
            this.priceProvidersArr[index].TSLoadFlag = false; //Apurva K||26-Apr-2023||FIN1EURINT-246
        }

          return false;
      } catch (error) {
          return false;
          //console.log('Error:', error);
      }
  }
  
  setdefaultvalues() {
    //console.log('setdefaultvalues');
    for (let i = 0; i < this.defaultvaluesArr.length; i++) {
      if (this.defaultvaluesArr[i].Control_Name === 'AutocallFrequency') {
        //console.log(this.defaultvaluesArr[i]);
      }
      switch (this.defaultvaluesArr[i].Control_Name) {
        case 'Currency':
          this.ddlNoteCcy = this.defaultvaluesArr[i].Default_Value;
          this.CurrencyYN = this.defaultvaluesArr[i].ActiveYN;
          this.CurrDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');
          this.CurrencyUpdatedBy = this.defaultvaluesArr[i].Updated_By;

          // //console.log((new Date(Date.parse(record.SolveForRequestAt + ' UTC'))).toLocaleString())
          this.CurrencyUpdatedAt = this.defaultvaluesArr[i].Updated_At;

          this.CurrencyUpdatedAt = 
              (new Date(Date.parse(this.CurrencyUpdatedAt + ' UTC'))).toLocaleString();
          //console.log("This is setting up of currency", this.ddlNoteCcy)
          break;

        case 'StaticFormat':
          this.format = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'Format':
          this.format = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'SolveFor':
          this.SolveForvalue = this.defaultvaluesArr[i].Default_Value;
          // //console.log(this.format,"defaultformatval");
          break;

        case 'Underlyings':
          // this.ShareName = this.defaultvaluesArr[i].Default_Value;
          if (this.defaultvaluesArr[i].Default_Value && this.defaultvaluesArr[i].Default_Value !== '') {
            this.defaultvaluesArr[i].Default_Value.split(',').forEach(element => {
              var index = this.shares.findIndex(shareItem => shareItem.BloombergCode == element)
              if (index >= 0) {
                const shareCode = this.shares[index].Code;
                this.showUnderlying('', SearchUnderlyingPipe.prototype.transform(this.shares, shareCode)[0]);
              }
            });
          }

          break;

        case 'Notional':
          this.Notional = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Notional"
          break;

        case 'ReofferPrice':
          this.IBPrice = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Reoffer (%)"
          break;

        // case 'Upfront':
        //   this.upfrontFee = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Upfront (%)"
        //   break;

        case 'IssuePrice':
          this.issuePrice = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Issue Price (%)"
          break;

        // case 'BasketType':
        //   this.basketType = this.defaultvaluesArr[i].Default_Value;
        //   break;

        // case 'PublicPrivate':
        //   this.publicOrPrivate = this.defaultvaluesArr[i].Default_Value;
        //   break;

        // case 'Quanto':
        //   this.quanto = this.defaultvaluesArr[i].Default_Value;
        //   break;

        // case 'Listed':
        //   this.listed = this.defaultvaluesArr[i].Default_Value;
        //   break;

        // case 'StockExchange':
        //   this.stockExchange = this.defaultvaluesArr[i].Default_Value;
        //   break;

        case 'Priips':
          this.priipsYN = this.defaultvaluesArr[i].Default_Value === 'Y' ? 'Yes' : 'No';
          break;

        case 'Language':
          this.language = this.defaultvaluesArr[i].Default_Value;
          this.languageDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');
          //console.log(this.languageDropdown, "languageDropdown");
          this.languageDropdown=[];
          for (let i = 0; i < this.languageDropdown.length; i++) {
            if (this.languageDropdown[i] != '') {
              this.languageDropdown.push({ 'Key': this.languageDropdown[i], 'Value': this.languageDropdown[i] });
            }
            //console.log(this.languageDropdown1,"languagekeyvalue");
          }

          this.LanguageUpdatedBy = this.defaultvaluesArr[i].Updated_By;
          this.LanguageUpdatedAt = this.defaultvaluesArr[i].Updated_At;
          
          this.LanguageUpdatedAt = 
          (new Date(Date.parse(this.LanguageUpdatedAt + ' UTC'))).toLocaleString();
          break;


          case 'Country':
            this.country = this.defaultvaluesArr[i].Default_Value;
            this.countryYN = this.defaultvaluesArr[i].ActiveYN;
            this.countryDropdown = this.defaultvaluesArr[i].Selectedvaluecsv.split(',');
            this.countryDropdown1=[];
            for (let i = 0; i < this.countryDropdown.length; i++) {
              if (this.countryDropdown[i] != '') {
                this.countryDropdown1.push({ 'Key': this.countryDropdown[i], 'Value': this.countryDropdown[i] });
              }
              //console.log(this.countryDropdown1,"countryDropdownkeyvalue");
            }
            this.CountryUpdatedBy = this.defaultvaluesArr[i].Updated_By;
            this.CountryUpdatedAt = this.defaultvaluesArr[i].Updated_At;
  
             
            this.CountryUpdatedAt = 
            (new Date(Date.parse(this.CountryUpdatedAt + ' UTC'))).toLocaleString();
            break;
  

        // case 'Termsheet':
        //   this.termsheetType = this.defaultvaluesArr[i].Default_Value;
        //   break;


        case 'StrikeShifterDate':
          this.stkdate = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'IssueDateOffset':
          this.paymentshift = this.defaultvaluesArr[i].Default_Value;
          break;


        case 'Tenor':
          this.expshift = this.defaultvaluesArr[i].Default_Value;
          break;


        // case 'SettlementMethod':
        //   this.SettlementMethod = this.defaultvaluesArr[i].Default_Value;
        //   break;


        case 'FundType':
          this.fundType = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'FundingFrequency':
          this.fundFreq = this.defaultvaluesArr[i].Default_Value;
          break;

        case 'FundingRateSpread':
          this.fundRate = this.defaultvaluesArr[i].Default_Value;
          this.defaultvaluesArr[i].label = "Rate/Spread (%)"
          break;

        // case 'AutocallType':
        //   this.autocallCouponType = this.defaultvaluesArr[i].Default_Value;
        //   break;

        // case 'AutocallFrequency':
        //   this.autoFreq = this.defaultvaluesArr[i].Default_Value;
        //   break;

        // case 'PutableFrequency':
        //   this.putableFreq = this.defaultvaluesArr[i].Default_Value;
        //   break;

        // case 'CallableFrequency':
        //   this.callableFreq = this.defaultvaluesArr[i].Default_Value;
        //   break;

        // case 'AutocallableFrom':
        //   this.autoNonCall = this.defaultvaluesArr[i].Default_Value;
        //   break;

        // case 'AutocallBarrier':
        //   this.autoTrigger = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Autocall Barrier (%)"
        //   break;

        // case 'StepUpDown':
        //   this.autoStepDown = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Step Up / Down (%)"
        //   break;

        // case 'PutableBarrierLevel':
        //   this.PutableBarrier = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Putable Barrier Level (%)"
        //   break;

        // case 'ProtectionType':
        //   this.barrierType = this.defaultvaluesArr[i].Default_Value;
        //   break;


        // case 'PutStrike':
        //   this.Strike = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Put Strike (%)"
        //   break;

        // case 'ProtectionLevel':
        //   this.ProtectionLevel = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Protection Level (%)"
        //   break;

        // case 'UpperPutStrike':
        //   this.upperPutStrike = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Upper Put Strike (%)"
        //   break;

        // case 'PutGearring':
        //   this.leverage = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Put Gearing (%)"
        //   break;

        // case 'LowerPutStrike':
        //   this.lowerPutStrike = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Lower Put Strike (%)"
        //   break;


        // case 'BarrierLevel':
        //   this.barrierLevel = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "KI Barrier (%)"
        //   break;


        // case 'PutSpreadGearing':
        //   this.putSpreadGearing = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Put Spread Gearing (%)"
        //   break;

        // case 'CallStrike':
        //   this.callStrike = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Call Strike (%)"
        //   break;

        // case 'LowerCallStrike':
        //   this.lowerCallStrike = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Lower Call Strike (%)"
        //   break;

        // case 'CallGearring':
        //   this.callGearing = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Call Gearing (%)"
        //   break;

        // case 'UpperCallStrike':
        //   this.upperCallStrike = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Upper Call Strike (%)"
        //   break;

        // case 'CallSpreadGearing':
        //   this.callSpreadGearing = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Call Spread Gearing (%)"
        //   break;

        // case 'AutocallCouponType':
        //   this.ERCpnType = this.defaultvaluesArr[i].Default_Value;

        //   break;

        // case 'ERCouponPa':
        //   this.ERCoupon = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "ER Coupon p.a. (%)"
        //   break;

        // case 'AddPeriodicCpn':
        //   this.periodicCouponFlag = this.defaultvaluesArr[i].Default_Value;
        //   break;

        // case 'PeriodicCpnType':
        //   this.cpnType = this.defaultvaluesArr[i].Default_Value;
        //   break;


        // case 'CouponBarrierType':
        //   this.cpnObservation = this.defaultvaluesArr[i].Default_Value;
        //   break;

        // case 'RangeAccuralFreq':
        //   this.rangeAccrualFreq = this.defaultvaluesArr[i].Default_Value;
        //   break;

        // case 'PeriodicCpnFreq':
        //   this.cpnFreq = this.defaultvaluesArr[i].Default_Value;
        //   break;

        // case 'CouponBarrierLevel':
        //   this.cpnTrigger = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Coupon Barrier Level(%)"
        //   break;

        // case 'CouponPaPerc':
        //   this.cpnCoupon = this.defaultvaluesArr[i].Default_Value;
        //   this.defaultvaluesArr[i].label = "Coupon p.a. (%) / Yield Spread p.a. (%)"
        //   break;

        // case 'CouponInFine':
        //   this.cpnInFine = this.defaultvaluesArr[i].Default_Value;
        //   break;
      }
    }
    this.pageloadflag=false;
  }

  async CustomerTenorChange(type: any){
    try {
      let strDate = '';
      if (type === 'Expiry') {
          this.Dates =  await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
          strDate = this.EcCommon.formatDate(this.Dates.MaturityDate);
        this.expdate = strDate;
      }
      
    } catch (error) {
      
    }
      }

      

  enabledisablefields(fieldName) {
    let enabledisableflag = false;
    for (let i = 0; i < this.defaultvaluesArr?.length; i++) {
      if (this.defaultvaluesArr[i].Control_Name === fieldName) {
        if (this.defaultvaluesArr[i].ActiveYN === 'Y') {
          enabledisableflag = false;
        } else {
          enabledisableflag = true;
        }
        return enabledisableflag;
      }
    }
    return enabledisableflag;
  }

  async ViewTS(index: any) {
    try {
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      // Changed by Jyoti S || 25-May-2023  || START
      this.docsData = [];
      let showFlag = false;
      this.priceProvidersArr[index].ViewTSFlag = true;
      const res: any = await this.EcHome.ViewTermsheet(this.priceProvidersArr[index].rfq, 'IndicativeTermsheet');
      this.priceProvidersArr[index].ViewTSFlag = false;
      const thisRef = this;
      this.docsPopupLabels = [
        {title: "Counterparty", value: this.priceProvidersArr[index]["lp"]},
      ];
      if (res?.length) {
        //<Sudarshan | base64 to Bytes>
        res.forEach(function (item : any) {
          if (item.Status.toString().toUpperCase() === 'SUCCESS') {
             const downloadLink = document.createElement('a');
           let fileName = item.Document_Output_Path;
           downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
           downloadLink.download = fileName;
            const obj = {
              "Type": item["DocumentType"],
              "Country": item["DocumentCountry"],
              "Language": item["DocumentLanguage"],
              "File Name": item["Document_Output_Path"],
              "View": () => { downloadLink.click();},
            }
            thisRef.docsData.push(obj);
            showFlag = true;          
          }
          else {
            this.ErrorMsgTop = item.Status.toString();
            showFlag = false;
          }
        });
        //</Sudarshan | base64 to Bytes>       
        this.showDocsPopup = showFlag; 
      } else {
        this.showDocsPopup = false;
        this.ErrorMsgTop = 'Termsheet not available. Please try again later.';

      }// Changed by Jyoti S || 25-May-2023  || END
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }
  // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D
  intervalBookOrder: any;
  timeLeftBookOrder = 0;
  showOrderDetails(lp: any, rfq: any, item) {
      try {
          //console.log('in showOrderDetails' + item);
          // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D || start
          this.timeLeftBookOrder = 0; //"3/15/2022 2:18:56 PM"
          if (item && item.EP_ValidUntilTime && item.EP_Quote_Response_At) {
              // item.EP_Quote_Response_At = "3/15/2022 2:26:56 PM"
              this.timeLeftBookOrder = (new Date(item.EP_ValidUntilTime).getTime() - new Date(item.EP_Quote_Response_At).getTime());
              // this.timeLeft = (new Date(this.selectedRFQData.Quote_Response_At).getTime()  - new Date(this.selectedRFQData.ValidUntilTime).getTime());
              //console.log(this.timeLeftBookOrder);
              this.timeLeftBookOrder = this.timeLeftBookOrder / 1000;
              //console.log(this.timeLeftBookOrder);
              // this.timeLeft = 20;
              if (this.timeLeftBookOrder > 0) {
                  this.intervalBookOrder = setInterval(() => {

                      if (this.timeLeftBookOrder > 0) {
                          this.timeLeftBookOrder = this.timeLeftBookOrder - 1;
                          // //console.log(this.timeLeft);
                      } else if (this.timeLeftBookOrder === 0 || this.timeLeftBookOrder < 0) {

                      }
                  }, 1000);
              }
          }
          // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D || end
          this.ErrorMsg = '';
          this.ErrorMsgTop = '';
          this.ordersuccessMsg = '';
          this.successMsgBookOrder = "";
          this.errorMsgBookOrder = "";
          this.showOrderDetailsFlag = true;
          this.Issuer = lp;
          this.selectedRFQ = rfq;
          this.OrderType = 'Market';
          // this.selectedBookingBranch = 'FinIQ Europe';
          // this.totalNotional = this.Notional;
          this.txtnotional = this.Notional;
          this.txtddlNoteCcy = this.ddlNoteCcy;
          this.txtIBPrice = this.IBPrice;
          this.txtClientPrice = '';
          // this.txtStrike = this.Strike; 
          this.txtTenor = this.expshift;
          // this.txtUpfront = '';

          if (this.SolveForvalue === 'IBPrice') {
              this.txtIBPrice = item.price;
          }
          this.txtUpfront = (100 - parseFloat(this.txtIBPrice)).toFixed(2);

          this.txtClietYield = '';
          this.txtOrderType = 'Market';
          this.txtlimitLevel = '';
          this.txtEQCRef = '';
          this.txtComment = '';
          this.txtClientPrice = this.issuePrice;
      this.maxNotional = item.maxLimit && parseFloat(item.maxLimit) !== 0 && item.maxLimit !== '' ? parseFloat(item.maxLimit) : '0';//Changed by Varsha G || Changed from 5000000 to 0 || As per discussion with Nitish K || FIN1EURINT-76 || 25-Apr-2023
      this.minNotional = item.minLimit && parseFloat(item.minLimit) !== 0 && item.minLimit !== '' ? parseFloat(item.minLimit) : '0';//Changed by Varsha G || Changed from 250000 to 0 || As per discussion with Nitish K || FIN1EURINT-76 || 25-Apr-2023

          // this.nonBestPriceRsnDD = 'Reason1';
          this.nonBestPriceRsnDD = 'Please Select';
          this.txtOthersRsn = '';
          // //console.log(this.BookingCenter[0].BookingCenterCode);
          if (this.BookingCenter && this.BookingCenter.length > 0) {
              // resolved blank booking branch issue by priya l. on 16Feb2022 - assigned by Pranav d.
              this.selectedBookingBranch = this.BookingCenter[0].BookingCenterCode;
          }

          //console.log(this.totalNotional);
          //console.log(this.Notional);
          // this.txtShare = this.ShareBasket[0].Code;
          this.txtShare = ''
          this.ShareBasket.forEach(item =>
              this.txtShare = this.txtShare + item.Code + ', '
          )

          this.txtShare = this.txtShare.trim();
          var lastCharater = this.txtShare.split('').pop();

          if (lastCharater == ',')
              this.txtShare = this.txtShare.substring(0, this.txtShare.length - 1);

          this.tblAllocation = [];

          this.tblAllocation.push('');

          this.underlyingForLimit = "";
          this.remainingNotional = "0.00"
          // this.totalNotional = "300,000.00";
          this.totalNotional = parseFloat(this.Notional.replace(/,/g, '')).toFixed(2);
          this.remainingNotional = parseFloat(this.Notional.replace(/,/g, '')).toFixed(2);
          // this.txtnotional.replace(/,/g, '')
          this.allocatedNotional = "0.00"
          this.allocatedNotionalArr = [0.00];
          this.allocatedRMArray = [''];
          this.allocatedClientArray = [''];
          this.allocatedCustomerArray = [''];

          this.orderBookedFlag = false;

          //console.log(this.tblAllocation)
          //console.log(this.tblAllocation.length)
          return false;

      } catch (error) {

      }
  }

  // showOrderDetailsFromPrevQuote(lp: any, rfq: any, item) {
  async showOrderDetailsFromPrevQuote() {
      try {
          //console.log('in showOrderDetailsFromPrevQuote');
          //console.log(this.dataItemAccordian);
          this.ErrorMsg = '';
          this.ErrorMsgTop = '';
          this.ordersuccessMsg = '';
          this.successMsgBookOrder = "";
          this.errorMsgBookOrder = "";
          this.showOrderDetailsFlag = true;
          // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D || start
          if (this.dataItemAccordian.ER_QuoteRequestId) {
              let preQuoteData1: any;
              preQuoteData1 = await this.EcHome.getPreviousQuoteCloneData(this.dataItemAccordian.ER_QuoteRequestId, 'RFQID');
              if (this.EcCommon.isEmptyObject(preQuoteData1)) {
                  // this.ErrorMsgTop = 'No data found for this record.';

              } else {
                  // viewOnly
                  // this.viewOnly = params.viewOnly ? true : false;
                  // this.viewRFQ = params.RFQ_ID;
                  this.setPrevQuoteData1(preQuoteData1.cloneData, this.viewOnly);
                  // this.dataItemAccordian.EP_Quote_Response_At = 
                  preQuoteData1.cloneData.Quote_Response_At; //= 
                  // }
                  // }

                  this.timeLeftBookOrder = 0; //"3/15/2022 2:18:56 PM"
                  // if (this.dataItemAccordian && this.dataItemAccordian.EP_ValidUntilTime && this.dataItemAccordian.EP_Quote_Response_At) {
                  if (this.dataItemAccordian && preQuoteData1.cloneData.Quote_Response_At && this.dataItemAccordian.EP_Quote_Response_At) {
                      // item.EP_Quote_Response_At = "3/15/2022 2:26:56 PM"
                      this.timeLeftBookOrder = (new Date(this.dataItemAccordian.EP_ValidUntilTime).getTime() - new Date(preQuoteData1.cloneData.Quote_Response_At).getTime());
                      // this.timeLeft = (new Date(this.selectedRFQData.Quote_Response_At).getTime()  - new Date(this.selectedRFQData.ValidUntilTime).getTime());
                      //console.log(this.timeLeftBookOrder);
                      this.timeLeftBookOrder = this.timeLeftBookOrder / 1000;
                      //console.log(this.timeLeftBookOrder);
                      // this.timeLeft = 20;
                      if (this.timeLeftBookOrder > 0) {
                          this.intervalBookOrder = setInterval(() => {

                              if (this.timeLeftBookOrder > 0) {
                                  this.timeLeftBookOrder = this.timeLeftBookOrder - 1;
                                  // //console.log(this.timeLeft);
                              } else if (this.timeLeftBookOrder === 0 || this.timeLeftBookOrder < 0) {

                              }
                          }, 1000);
                      }
                  }
              }
          }
          // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D || end

          this.Issuer = this.dataItemAccordian.PP_CODE;
          this.selectedRFQ = this.dataItemAccordian.ER_QuoteRequestId;
          this.OrderType = 'Market';
          // this.selectedBookingBranch = 'FinIQ Europe';
          // this.totalNotional = this.Notional;
          this.txtnotional = this.formattedAmount(this.dataItemAccordian.ER_CashOrderQuantity);
          this.txtddlNoteCcy = this.dataItemAccordian.ER_CashCurrency;
          this.txtIBPrice = this.dataItemAccordian.ER_SolveFor === 'Price(%)' ? this.dataItemAccordian.EP_Price : this.dataItemAccordian.EP_OfferPrice;
          // this.txtClientPrice = '';
          this.txtStrike = this.dataItemAccordian.EP_StrikePercentage;
          this.txtTenor = this.dataItemAccordian.ER_RFQTenor;
          this.txtUpfront = (100 - parseFloat(this.txtIBPrice)).toFixed(2);
          this.txtClietYield = '';
          this.txtOrderType = 'Market';
          this.txtlimitLevel = '';
          this.txtEQCRef = '';
          this.txtComment = '';
          this.txtClientPrice = 100; //this.issuePrice; // need to ask sheetal
      this.maxNotional = this.dataItemAccordian.EP_MaxNotional && this.dataItemAccordian.EP_MaxNotional > 0 ? parseFloat(this.dataItemAccordian.EP_MaxNotional) : '0';//Changed by Varsha G || Changed from 5000000 to 0 || As per discussion with Nitish K || FIN1EURINT-76 || 25-Apr-2023
      this.minNotional = this.dataItemAccordian.EP_MinNotional && this.dataItemAccordian.EP_MinNotional > 0 ? parseFloat(this.dataItemAccordian.EP_MinNotional) : '0';//Changed by Varsha G || Changed from 250000 to 0 || As per discussion with Nitish K || FIN1EURINT-76 || 25-Apr-2023
          //console.log(this.dataItemAccordian.EP_MaxNotional && this.dataItemAccordian.EP_MaxNotional !== '');
          // //console.log(this.BookingCenter[0].BookingCenterCode);
          if (this.BookingCenter && this.BookingCenter.length > 0) {
              // resolved blank booking branch issue by priya l. on 16Feb2022 - assigned by Pranav d.
              this.selectedBookingBranch = this.BookingCenter[0].BookingCenterCode;
          }
          //console.log(this.totalNotional);
          //console.log(this.Notional);
          // this.txtShare = this.ShareBasket[0].Code;
          this.txtShare = ''
          // this.selectedSharesData=[];
          this.ShareBasket = [];
          this.SelectedUnderlyingarray = [];
          this.SelectedUnderlyingBasketArray = [];
          if (this.dataItemAccordian.ER_UnderlyingCode !== undefined && this.dataItemAccordian.ER_UnderlyingCode !== '') {
              const sharecsvArr = this.dataItemAccordian.ER_UnderlyingCode.split(',');
              for (let k = 0; k < sharecsvArr.length; k++) {
                  var index = this.shares.findIndex(shareItem => shareItem.Code == sharecsvArr[k]);
                  if (index >= 0) {
                      this.shareCode = this.shares[index].Code;
                      this.exchngCode = this.shares[index].ExchangeCode;
                      const lName = this.shares[index].LongName;
                      const Ccy = this.shares[index].LongName;
                      this.ShareBasket.push({ Code: this.dataItemAccordian.ER_UnderlyingCode, LongName: lName, Weight: '', Exchange: this.exchngCode, RICCode: this.shares[index].Code });
                      this.setSelectedUnderlyingarray(lName, Ccy, this.dataItemAccordian.ER_UnderlyingCode, this.exchngCode, '', '', '', '', '', '', '');
                  }
              }
          }
          this.ShareBasket.forEach(item => {
              this.txtShare = this.txtShare + item.Code + ', '
              //console.log(item);
              // var index = this.shares.findIndex(shareItem => shareItem.Code == item);
              // if (index >= 0) {
              //   this.selectedSharesData.push(this.shares[index]);
              // }
          }
          )
          // //console.log(this.ShareBasket);
          // this.shares.findIndex(shareItem => shareItem.Code == item);
          //  //console.log(this.selectedSharesData);
          this.txtShare = this.txtShare.trim();
          var lastCharater = this.txtShare.split('').pop();
          if (lastCharater == ',')
              this.txtShare = this.txtShare.substring(0, this.txtShare.length - 1);
          this.txtShare = this.dataItemAccordian.ER_UnderlyingCode
          this.tblAllocation = [];
          this.tblAllocation.push('');
          this.underlyingForLimit = "";
          this.remainingNotional = "0.00"
          // this.totalNotional = "300,000.00";
          // this.totalNotional = parseFloat(this.Notional.replace(/,/g, '')).toFixed(2);
          this.totalNotional = parseFloat(this.txtnotional.replace(/,/g, '')).toFixed(2);
      this.remainingNotional = parseFloat(this.txtnotional.replace(/,/g, '')).toFixed(2);
          // this.txtnotional.replace(/,/g, '')
      this.allocatedNotional = "0.00";
          this.allocatedNotionalArr = [0.00];
          this.allocatedRMArray = [''];
          this.allocatedClientArray = [''];
          this.allocatedCustomerArray = [''];
          this.orderBookedFlag = false;
          //console.log(this.tblAllocation)
          //console.log(this.tblAllocation.length)
          return false;
      } catch (error) {
      }
  }
//   btnAllocationClick() {
//       ////console.log('click');
//       this.tblAllocation.push('');
//       (<HTMLInputElement>document.getElementById("checkboxAll")).checked = true;
//       return false;
//   }

btnAllocationClick() {
    ////console.log('click');
    this.tblAllocation.push('');
    (<HTMLInputElement>document.getElementById("checkboxAll")).checked = true;
    this.allocatedRMArray.push('');
    return false;
  }
  /*
      chkAll(e) {
          this.ErrorMsg1 = '';
  
          const target = this.EcCommon.GetEventTarget(e);
          ////console.log(target.id, e, target.checked);
          var i = 0;
          if (target.checked) {
              this.allocatedNotional = '0';
              this.tblAllocation.forEach((element) => {
                  (<HTMLInputElement>document.getElementById("checkbox" + i)).checked = true;
                  document.getElementById("Notional" + i).removeAttribute('disabled');
                  // document.getElementById("Select" + i).removeAttribute('disabled');
                  this.allocatedNotional = parseFloat(this.allocatedNotional) + parseFloat((<HTMLInputElement>document.getElementById("Notional" + i)).value.replace(/,/g, ''));
                  this.remainingNotional = parseFloat(this.Notional.replace(/,/g, '')) - parseFloat(this.allocatedNotional);
                  i++;
  
              });
          }
          else {
              this.tblAllocation.forEach((element) => {
                  (<HTMLInputElement>document.getElementById("checkbox" + i)).checked = false;
                  document.getElementById("Notional" + i).setAttribute('disabled', 'true');
                  // document.getElementById("Select" + i).setAttribute('disabled', 'true');
                  this.allocatedNotional = parseFloat(this.allocatedNotional) - parseFloat((<HTMLInputElement>document.getElementById("Notional" + i)).value.replace(/,/g, ''));
                  this.remainingNotional = parseFloat(this.Notional.replace(/,/g, '')) - parseFloat(this.allocatedNotional);
                  i++;
              });
          }
      }
  */

  async chkAll(e) {
      this.ErrorMsg1 = '';

      const target = await this.EcCommon.GetEventTarget(e);
      ////console.log(target.id, e, target.checked);
      let i = 0;
      if (target.checked) {
          this.allocatedNotional = '0';
          this.tblAllocation.forEach((element) => {
              ////console.log(element);
              (<HTMLInputElement>document.getElementById("checkbox" + i)).checked = true;
              document.getElementById("Notional" + i).removeAttribute('disabled');
              document.getElementById("Select" + i).removeAttribute('disabled');
              this.allocatedNotional = parseFloat(this.allocatedNotional) + parseFloat((<HTMLInputElement>document.getElementById("Notional" + i)).value.replace(/,/g, ''));
              this.remainingNotional = parseFloat(this.totalNotional.toString().replace(/,/g, '')) - parseFloat(this.allocatedNotional);
              i++;

          });
      }
      else {
          this.tblAllocation.forEach((element) => {
              ////console.log(element);
              (<HTMLInputElement>document.getElementById("checkbox" + i)).checked = false;
              // document.getElementById("Notional" + i).setAttribute('disabled', 'true');
              // document.getElementById("Select" + i).setAttribute('disabled', 'true');
              // this.allocatedNotional = parseFloat(this.allocatedNotional) - parseFloat((<HTMLInputElement>document.getElementById("Notional" + i)).value.replace(/,/g, ''));
              // this.remainingNotional = parseFloat(this.totalNotional.replace(/,/g, '')) - parseFloat(this.allocatedNotional);
              this.allocatedNotional = "0.00";
              this.remainingNotional = parseFloat(this.totalNotional.toString().replace(/,/g, '')) - parseFloat(this.allocatedNotional);
              this.tblAllocation = [];

              // this.tblAllocation.push('');
              this.totalNotional = parseFloat(this.Notional.replace(/,/g, '')).toFixed(2);
              this.remainingNotional = parseFloat(this.Notional.replace(/,/g, '')).toFixed(2);
              this.allocatedNotional = "0.00"
              this.allocatedNotionalArr = [0.00];
              this.allocatedRMArray = [''];
              this.allocatedClientArray = [''];
              this.allocatedCustomerArray = [''];
              i++;
          });
      }
  }
  /*
  chkAllocation(e) {
      this.ErrorMsg1 = '';
      const target = this.EcCommon.GetEventTarget(e);
      ////console.log(target.id, e, target.checked);
      if (!(target.checked)) {
          document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1)).setAttribute('disabled', 'true');
          document.getElementById("Select" + target.id.substr(target.id.toString().length - 1, 1)).setAttribute('disabled', 'true');
          ////console.log((<HTMLInputElement>document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1))).value, this.allocatedNotional, this.remainingNotional, this.Notional);
          this.allocatedNotional = parseFloat(this.allocatedNotional) - parseFloat((<HTMLInputElement>document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1))).value.replace(/,/g, ''));
          this.remainingNotional = parseFloat(this.Notional.replace(/,/g, '')) - parseFloat(this.allocatedNotional);
          ////console.log(this.allocatedNotional);
      }
      else {

          document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1)).removeAttribute('disabled');
          document.getElementById("Select" + target.id.substr(target.id.toString().length - 1, 1)).removeAttribute('disabled');
          this.allocatedNotional = parseFloat(this.allocatedNotional) + parseFloat((<HTMLInputElement>document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1))).value.replace(/,/g, ''));
          this.remainingNotional = parseFloat(this.Notional.replace(/,/g, '')) - parseFloat(this.allocatedNotional);
      }

      var i = 0;
      var tempflag = true;
      this.tblAllocation.forEach((element) => {
          ////console.log(element);
          if (!(<HTMLInputElement>document.getElementById("checkbox" + i)).checked) {
              tempflag = false;
          }

          if (!tempflag) {
              (<HTMLInputElement>document.getElementById("checkboxAll")).checked = false;
          }
          else {
              (<HTMLInputElement>document.getElementById("checkboxAll")).checked = true;
          }
          i++;
      });


  }
  */

  async chkAllocation(e, index: any) {

      this.ErrorMsg1 = '';
      const target = await this.EcCommon.GetEventTarget(e);
      //console.log(target.id, e, target.checked);
      if (!(target.checked)) {
          // // document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1)).setAttribute('disabled', 'true');
          // // document.getElementById("Select" + target.id.substr(target.id.toString().length - 1, 1)).setAttribute('disabled', 'true');
          // // ////console.log((<HTMLInputElement>document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1))).value, this.allocatedNotional, this.remainingNotional, this.Notional);
          // //console.log(parseFloat((<HTMLInputElement>document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1))).value.toString().replace(/,/g, '')));
          this.allocatedNotional = parseFloat(this.allocatedNotional) - (parseFloat((<HTMLInputElement>document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1))).value.replace(/,/g, '')) || 0.00);
          this.remainingNotional = parseFloat(this.totalNotional.toString().replace(/,/g, '')) - parseFloat(this.allocatedNotional) || 0.00;
          // ////console.log(this.allocatedNotional);


          // // this.allocatedNotionalArr.splice(index, 1);

          // // //console.log(this.tblAllocation);
          // (<HTMLInputElement>document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1))).disabled = true;
          // (<HTMLInputElement>document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1))).classList.remove('error');
          this.tblAllocation.splice(index, 1);
          this.allocatedNotionalArr.splice(index, 1);
          this.allocatedRMArray.splice(index, 1);
          (<HTMLInputElement>document.getElementById("checkbox" + index)).checked = true;

      }
      // else {

      //   document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1)).removeAttribute('disabled');
      //   document.getElementById("Select" + target.id.substr(target.id.toString().length - 1, 1)).removeAttribute('disabled');
      //   this.allocatedNotional = parseFloat(this.allocatedNotional) + (parseFloat((<HTMLInputElement>document.getElementById("Notional" + target.id.substr(target.id.toString().length - 1, 1))).value.replace(/,/g, '')) || 0.00);
      //   this.remainingNotional = parseFloat(this.totalNotional.toString().replace(/,/g, '')) - parseFloat(this.allocatedNotional);
      // }

      let i = 0;
      let tempflag = true;
      this.tblAllocation.forEach((element) => {
          ////console.log(element);
          if (!(<HTMLInputElement>document.getElementById("checkbox" + i)).checked) {
              tempflag = false;
          }

          if (!tempflag) {
              (<HTMLInputElement>document.getElementById("checkboxAll")).checked = false;
          }
          else {
              (<HTMLInputElement>document.getElementById("checkboxAll")).checked = true;
          }
          i++;
      });


  }

  /*
      addNotional(e) {
          this.ErrorMsg1 = '';
          const target = this.EcCommon.GetEventTarget(e);
          if (target.value === '' || isNaN(target.value))
              target.value = '0.00';
  
          ////console.log(target, this.allocatedNotional, target.value, this.previousNotional, this.Notional);
          this.allocatedNotional = parseFloat(this.allocatedNotional) + parseFloat(target.value) - parseFloat(this.previousNotional);
          ////console.log(this.allocatedNotional);
          this.remainingNotional = parseFloat(this.Notional.replace(/,/g, '')) - parseFloat(this.allocatedNotional);
          ////console.log("B4 Fixing 2 Decimal" + target.value);
          target.value = parseFloat(target.value).toFixed(2);
  
      }
  */
  /*
      addNotional(e, rowindex) {
          this.ErrorMsg1 = '';
                  this.checkValidAllocateNotional(e, rowindex);    
  
          // const target = this.EcCommon.GetEventTarget(e);
          // if (target.value === '' || isNaN(target.value))
          //     target.value = '0.00';
  
  
          ////console.log(target, this.allocatedNotional, target.value, this.previousNotional, this.Notional);
          // this.allocatedNotional = parseFloat(this.allocatedNotional) + parseFloat(target.value) - parseFloat(this.previousNotional);
          
          // target.value = parseFloat(target.value).toFixed(2);
          // this.allocatedNotionalArr[rowindex] = target.value;
          let sumarr = 0.00;
          for (let i = 0; i < this.allocatedNotionalArr.length; i++) {
              sumarr += parseFloat(this.allocatedNotionalArr[i].replace(/,/g, ''));
          }
          //console.log(sumarr);
          ////console.log(this.allocatedNotional);
          this.allocatedNotional = sumarr.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          //console.log(this.totalNotional);
  
          this.remainingNotional = parseFloat(this.totalNotional.replace(/,/g, '')) - parseFloat(this.allocatedNotional.replace(/,/g, ''));
          this.remainingNotional = this.remainingNotional.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          ////console.log("B4 Fixing 2 Decimal" + target.value);
  
          //console.log(this.allocatedNotionalArr);
          //console.log("AddNotional:" + this.Notional, this.allocatedNotional, this.previousNotional, this.remainingNotional, this.totalNotional);
  
      }
      */

  async addNotional(e, rowindex) {
      this.ErrorMsg1 = '';
      await this.checkValidAllocateNotional(e, rowindex);

      // const target = this.EcCommon.GetEventTarget(e);
      // if (target.value === '' || isNaN(target.value))
      //     target.value = '0.00';


      ////console.log(target, this.allocatedNotional, target.value, this.previousNotional, this.Notional);
      // this.allocatedNotional = parseFloat(this.allocatedNotional) + parseFloat(target.value) - parseFloat(this.previousNotional);

      e.target.value = parseFloat(e.target.value).toFixed(2);
      this.allocatedNotionalArr[rowindex] = e.target.value;
      if (this.errorMsgBookOrder !== "") {
          return false;
      }
      //console.log(this.allocatedNotionalArr);

      let sumarr = 0.00;
      for (let i = 0; i < this.allocatedNotionalArr.length; i++) {
          if ((<HTMLInputElement>document.getElementById("checkbox" + i)).checked) {
              sumarr += parseFloat(this.allocatedNotionalArr[i].toString().replace(/,/g, '')) || 0.00;
          }
      }
      //console.log(sumarr);
      ////console.log(this.allocatedNotional);
      this.allocatedNotional = sumarr.toFixed(2);
      //console.log(this.totalNotional);

      // this.remainingNotional = parseFloat(this.totalNotional.replace(/,/g, '')) - parseFloat(this.allocatedNotional.replace(/,/g, ''));
      this.remainingNotional = parseFloat(this.totalNotional.toString().replace(/,/g, '')) - parseFloat(this.allocatedNotional.toString().replace(/,/g, ''));

      this.remainingNotional = this.remainingNotional.toFixed(2);
      ////console.log("B4 Fixing 2 Decimal" + target.value);

      //console.log(this.allocatedNotionalArr);
      //console.log("AddNotional:" + this.Notional, this.allocatedNotional, this.previousNotional, this.remainingNotional, this.totalNotional);

  }
  /*
      previousNotionals(e) {
          this.ErrorMsg1 = '';
          const target = this.EcCommon.GetEventTarget(e);
          if (target.value === '') {
              this.previousNotional = 0.00;
          }
          else {
              this.previousNotional = target.value;
          }
  
  
          ////console.log(this.previousNotional);
      }
      */

  confirmValidation() {

      // for (let k = 0; k < this.lpArr.length; k++) {
      //     if (this.lpArr[k].rfq === this.rfq) {
      //         if (this.lpArr[k].timer == 0) {
      //             this.accordflag = false;
      //             this.bookOrderFlag = false;
      //             return false;
      //         }

      //     }
      // }
      ////console.log(this.allocatedNotional, this.maxNotional, this.minNotional);
      this.ordersuccessMsg = '';
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.ErrorMsg1 = '';
      if (parseFloat(this.allocatedNotional) > parseFloat(this.maxNotional)) {
          this.ErrorMsg1 = "Cannot place order. Allocated notional is greater than the maximum permitted.";
          return false;
      }
      if (parseFloat(this.allocatedNotional) < parseFloat(this.minNotional)) {
          this.ErrorMsg1 = "Cannot place order. Allocated notional is less than the minimum permitted.";
          return false;
      }

      if (parseFloat(this.allocatedNotional) <= 0) {
          this.ErrorMsg1 = "Please enter valid allocated notional.";
          return false;
      }

      if (parseFloat(this.allocatedNotional) !== parseFloat(this.Notional.replace(/,/g, ''))) {
          // this.ErrorMsg1 = "Sum of notionals is not equal to Order Quantity.";
          this.ErrorMsg1 = "The Total of Quantities/ Notionals is not equal to the Order Quantity/ Notional."

          return false;
      }

      var i = 0;
      this.tblAllocation.forEach((element) => {
          ////console.log((<HTMLInputElement>document.getElementById("Notional" + i)).value);
          if ((<HTMLInputElement>document.getElementById("Notional" + i)).value === '0.00' && (<HTMLInputElement>document.getElementById("checkbox" + i)).checked) {
              this.ErrorMsg1 = "Please enter valid Notional.";
          }
          i++;

      });

  }

  async checkValidAllocatedNotional(e) {
      try {
          this.ordersuccessMsg = '';
          this.ErrorMsg = '';
          this.ErrorMsgTop = '';
          this.ErrorMsg1 = '';
          const NotionalData = await this.EcCommon.checkValidNotional(e);
          //console.log('1234', NotionalData);
          if (NotionalData.ErrorMsg === '') {

              e.target.value = NotionalData.Notional;
          } else {

              this.ErrorMsg1 = NotionalData.ErrorMsg;
          }

      } catch (error) {
          //console.log('Error', error);
      }
  }

  showPoolDetails() {
      this.poolDetailsVisibleFlag = true;
      this.setDefaultPoolVariable();
      return false;
  }

  async setDefaultPoolVariable() {
      let today = new Date();
      this.Dates = await this.EcHome.BBVAGetDates(this.Exchange(), '0B', '');
      if (this.Dates) {
          this.poolActivateDate = this.Dates.MaturityDate + ' ' + moment().format('HH:mm:ss A');

      }
      this.Dates = await this.EcHome.BBVAGetDates(this.Exchange(), '3B', '');
      if (this.Dates) {
          this.poolExpiryDate = this.Dates.MaturityDate + ' ' + moment().format('HH:mm:ss A');

      }
      this.minPoolNotional = '200,000.00';
      this.maxPoolNotional = '3,000,000.00';
      this.minOrderSize = '1,000,000.00';
      this.Denomination = '100,000.00';
  }

  hidePoolDetails() {
      this.poolDetailsVisibleFlag = false;
      return false;
  }

  hideOrderDetails() {
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.ordersuccessMsg = '';
      this.showOrderDetailsFlag = false;
      // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D
      if (this.intervalBookOrder) {
          clearInterval(this.intervalBookOrder);
      }

      if (this.PrevQuoteShowOrderPopUp) {
          this.PrevQuoteShowOrderPopUp = false;
          this.EcHome.prevQuoteOrderPopUp.next(false);
      }
      return false;
  }

  async bookOrder() {
      try {
          this.ErrorMsg = '';
          this.ErrorMsg1 = '';
          this.ErrorMsgTop = '';
          this.ordersuccessMsg = '';
          //console.log(this.selectedRFQ, this.Notional.replace(/,/g, ''));
          const res = await this.EcHome.bookOrder(this.selectedBookingBranch, this.OrderType === 'Limit' ? this.LimitAmount : '', this.OrderType,
              this.selectedRFQ, 'PBRM1', this.Notional.replace(/,/g, ''));
          if (res) {
              //console.log(res, res['status'])
              if (res['status'] === 'Succeed') {
                  const DealNo = res['DealNo'].split(',');
                  this.ordersuccessMsg = "Order placed successfully. Order ID : " + DealNo[DealNo.length - 1];
              }
          }
      } catch (error) {

      }
      return false;
  }

  async createPool() {
      try {
          const res = await this.EcHome.SaveProductToFolder('Fed List', this.NoteMasterID, '32264', 'Public');
          if (res) {
              this.poolSuccessMsg = "Pool created successfully";
          }
      } catch (error) {

      }
      return false;
  }
  async confirmOrder() {
    this.orderLoadFlag = true// Added by YASH AGRAWAL
      // this.validateNotional();
      this.successMsgBookOrder = "";
      this.errorMsgBookOrder = "";
      this.warningMessage = false;

      // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D
      if (this.timeLeftBookOrder <= 0) {
        this.orderLoadFlag = false// Added by YASH AGRAWAL
          this.errorMsgBookOrder = "Cannot book order. Quote expired.";
          return false;
      }
      if (!this.isValidParameters()) {
        this.orderLoadFlag = false// Added by YASH AGRAWAL
          return false;
      }

      // if(!this.EcCommon.fnCompareNotional(this.txtnotional,this.allocatedNotional)){
      //     this.errorMsgBookOrder = "Sum of Notionals is not equal to Order Notional."
      //      return false;
      // }
      if (!this.confirmValidation1()) {
        this.orderLoadFlag = false// Added by YASH AGRAWAL
          return false;
      }

      if (this.allocatedRMArray[0] === '' && (this.EQ_Login_Client_Mapping === 'NO' || this.EQ_Login_Client_Mapping === 'No')) {
        this.orderLoadFlag = false// Added by YASH AGRAWAL
          this.errorMsgBookOrder = "Please select valid RM name.";
          return false;
      }
      if (this.allocatedClientArray[0] === '' && (this.EQ_Login_Client_Mapping === 'YES' || this.EQ_Login_Client_Mapping === 'Yes')) {
        this.orderLoadFlag = false// Added by YASH AGRAWAL
          this.errorMsgBookOrder = "Please select valid client name.";
          return false;
      }
      //    var bookOrderDetails =  this.EcHome.bookOrderUCP( 
      //        this.Issuer, this.selectedRFQ, this.totalNotional.replace(/,/g, ''));

      // Redirect validation check
      let redirectYN = 'N';
    const res : any = await this.EcHome.RedirectOrderValidationChecks("", this.txtOrderType, this.txtlimitLevel.toString(), this.txtClietYield,
      parseFloat(this.txtUpfront) > 1 ? (parseFloat(this.txtUpfront)).toString() : (parseFloat(this.txtUpfront) * 100).toString(), this.SolveForvalue, this.Issuer, this.issuePrice, "", (this.templateMappingArr !== undefined && this.templateMappingArr.length > 0) ? this.templateMappingArr[0].template : 'Participation', this.txtnotional.replace(/,/g, ''), this.Code(), this.ddlNoteCcy, this.ddlNoteCcy, this.expshift);

    if (res['ValidationRemark'] !== 'Validation successful') {
          // this.errorMsgBookOrder = res;
          redirectYN = 'Y';
          // return false;
      } else {
          redirectYN = 'N';
      }

      let CustomerGridInfo = [];
      for (let i = 0; i < this.tblAllocation.length; i++) {
          let custID = '';
          let custName = '';

          if (this.allocatedCustomerArray && this.allocatedCustomerArray.length > 0) {
              custID = this.allocatedCustomerArray[i];
              const index = this.customerList.findIndex(res => res.Customer_ID === this.allocatedCustomerArray[i]);
              if (index > -1) {
                  custName = this.customerList[index].CustomerName;
              }

          }


          CustomerGridInfo.push({
              "Customer_ID": (this.EQ_Show_Order_Customer === 'Yes' || this.EQ_Show_Order_Customer === 'YES') ? custID : '',
              "Customer_Name": (this.EQ_Show_Order_Customer === 'Yes' || this.EQ_Show_Order_Customer === 'YES') ? custName : '',
              "Nominal_Amt": this.allocatedNotionalArr[i],
              "RM_ID": (this.EQ_Show_Order_RM === 'Yes' || this.EQ_Show_Order_RM === 'YES') ? this.allocatedRMArray[i] : '',
              "RM_Name": (this.EQ_Show_Order_RM === 'Yes' || this.EQ_Show_Order_RM === 'YES') ? this.allocatedRMArray[i] : '',
              "Book_Name": (this.EQ_Login_Client_Mapping === 'Yes' || this.EQ_Login_Client_Mapping === 'YES') ? this.allocatedClientArray[i] : '',
          })
      }

      //console.log(CustomerGridInfo);

      var bookOrderDetails = await this.EcHome.bookOrderUCP(
          //    this.Issuer, 
          "",//    advisoryReason,""
          this.selectedBookingBranch,
          this.txtClientPrice.toString().replace(/,/g, ''),
          this.txtClietYield.toString().replace(/,/g, ''),
          (this.nonBestPriceRsnDD === 'Others' || this.nonBestPriceRsnDD === 'Other') ? this.txtOthersRsn : this.nonBestPriceRsnDD, // confirmReason, 
          this.txtlimitLevel.toString().replace(/,/g, ''),
          "",
          "",
          "",
          "0", //margin=
          this.txtComment,
          this.txtOrderType,
          "", //PoolID=
          "", //PreTradeXml =
          this.selectedRFQ, // QuoteRequestId = //"1025750",
          "", // RMEmailIdforOrderConfirm = 
          // this.allocatedRMArray[0], //"", //RMNameforOrderConfirm =

          // Allocated dropdwon changes based on config - added by PriyaL on 8Dec2021
          (this.EQ_Login_Client_Mapping === 'YES' || this.EQ_Login_Client_Mapping === 'Yes') ? this.allocatedClientArray[0] : this.allocatedRMArray[0],
          redirectYN, //RedirectOrderID =
          this.allocatedNotional == 0 || this.allocatedNotional == '' ? 0.00 : this.allocatedNotional.toString().replace(/,/g, ''), // this.totalNotional.replace(/,/g, ''),  //orderQuantity: //"10000",
          "", //token
          //   userName:"Dealer1"
          // this.selectedRFQ, this.totalNotional.replace(/,/g, '')
          CustomerGridInfo
      );


      //console.log(bookOrderDetails);
      this.orderLoadFlag = false// Added by YASH AGRAWAL
    if (bookOrderDetails && bookOrderDetails.status !== undefined) {
      if (bookOrderDetails.status == "Succeed") {
  
        var str = bookOrderDetails.SavingMessage; //"Order(s) E000408I,E000409I Booked Successfully."
          var DealNo = bookOrderDetails.DealNo; // "E000408I,E000409I";
          var orderId = DealNo.split(',')[0];
          // //console.log( str.replace(/,/g, ' ').split(orderId)[0]);
          // //console.log( str.replace(/,/g, ' ').split(orderId)[1]);
          if (redirectYN === 'N') {
  
            this.successMsgBookOrder = bookOrderDetails.SavingMessage.replace(orderId + ',', '');
  
          } else {
            // Success message changes based on allocation - added by Pranav D. on 16Feb2022
            if (this.tblAllocation.length > 1) {
              this.successMsgBookOrder = res?.ValidationRemark + '\nOrder(s) ' + bookOrderDetails.DealNo + ' redirected to dealer.';
            } else {
              this.successMsgBookOrder = res?.ValidationRemark + '\nOrder(s) ' + DealNo.split(',')[0] + ' redirected to dealer.'
            }
            this.quoteEmailFlg = false;
            this.warningMessage = true;
          }
          this.orderBookedFlag = true;
          this.successMessage = true;
          this.showOrderDetailsFlag = false;
          // this.apifunctions.refreshPreQuoteFlag.next(true);
          if (this.intervalBookOrder) {
            clearInterval(this.intervalBookOrder);
          }
        }
        else {
          this.errorMsgBookOrder = bookOrderDetails.message
          this.orderBookedFlag = false;
  
        }
      } else {
        this.errorMsgBookOrder = "Error occured while placing order.Please try again.";
        this.orderBookedFlag = false;
  
      }
      //console.log(this.successMsgBookOrder);
      //console.log(this.errorMsgBookOrder);
  }

  async setFormattedNotional(e,rowindex){
    try{
     await this.addNotional(e,rowindex);
     const formattedNotional = this.EcCommon.checkValidNotional(e);
     if(formattedNotional.ErrorMsg === ''){
      e.target.value = formattedNotional.Notional;
      this.allocatedNotionalArr[rowindex] = e.target.value;
     }else{
      this.allocatedNotionalArr[rowindex] = 0.00;
      e.target.value = 0.00;
      this.errorMsgBookOrder = formattedNotional.ErrorMsg;
     }
    }catch (error){

    }

  }//Added by Jyoti S || 17-May-2023

  formattedAmount(amt) {
      if (amt) {
          amt = amt.toString();
          return amt == '0' || amt == '' || amt == '0.00' ? 0.00 : parseFloat(amt.replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      else {
          return '';
      }
  }
  postBackMethod() {
      try {
          return false;
      } catch (error) {
          //console.log(error);
      }
  }


  confirmValidation1() {

      //console.log(this.priceProvidersArr);

      /* 
       for (let k = 0; k < this.priceProvidersArr.length; k++) {
            if (this.priceProvidersArr[k].rfq === this.selectedRFQ) {
                if (this.priceProvidersArr[k].timer == 0) {
                    //this.accordflag = false;
                    // this.bookOrderFlag = false;
                    this.showOrderDetailsFlag = false;
                    return false;
                }
    
            }
        }
       */

      //console.log(parseFloat(this.allocatedNotional));
      //console.log(parseFloat(this.totalNotional));
      //console.log(this.priceProvidersArr);

      //    //console.log(this.priceProvidersArr.findIndex(item=>item.rfq == this.selectedRFQ));
      if (!this.PrevQuoteShowOrderPopUp) {
          var index = this.priceProvidersArr.findIndex(item => item.rfq == this.selectedRFQ)
          //console.log(index);
          //console.log(this.priceProvidersArr[index]);
          if (this.priceProvidersArr[index].timer == 0) {
              //this.accordflag = false;
              // this.bookOrderFlag = false;
              this.showOrderDetailsFlag = false;
              return false;
          }
      }
      // if(this.allocatedNotional < parseFloat(this.priceProvidersArr[index].minLimit)){
      if (this.allocatedNotional < parseFloat(this.minNotional)) {
          // //console.log('less than min price');
          // //console.log('Allocated notional is should be between ' + this.priceProvidersArr[index].minLimit  +
          //              ' and' + this.priceProvidersArr[index].maxLimit);
          this.errorMsgBookOrder = "Cannot place order. Allocated notional is less than the minimum permitted.";
          return false;
      }
      // if(this.allocatedNotional > parseFloat(this.priceProvidersArr[index].maxLimit)){
      if (this.allocatedNotional > parseFloat(this.maxNotional)) {
          // //console.log('greater than min price');
          this.errorMsgBookOrder = "Cannot place order. Allocated notional is greater than the maximum permitted.";
          return false;
      }
      if (parseFloat(this.allocatedNotional) !== parseFloat(this.totalNotional)) {
          // this.errorMsgBookOrder = "Sum of notionals is not equal to Order Quantity.";
          this.errorMsgBookOrder = "The Total of Quantities/ Notionals is not equal to the Order Quantity/ Notional."

          return false;
      }

      if (parseFloat(this.allocatedNotional) <= 0) {
          // this.errorMsgBookOrder = "Please enter valid Notional.";
          this.errorMsgBookOrder = "Please enter valid allocated notional.";
          return false;
      }
      // let i = 0;
      // this.tblAllocation.forEach((element) => {
      //     ////console.log((<HTMLInputElement>document.getElementById("Notional" + i)).value);
      //     //console.log(i);
      //     //console.log((<HTMLInputElement>document.getElementById("checkbox" + i)).checked)
      //     //console.log((<HTMLInputElement>document.getElementById("Notional" + i)).value );
      //     if ((<HTMLInputElement>document.getElementById("Notional" + i)).value === '0' && (<HTMLInputElement>document.getElementById("checkbox" + i)).checked) {
      //         this.errorMsgBookOrder = "Please enter valid Notional.";
      //         //console.log('Please enter valid Notional.');
      //         return false;
      //     }
      //     i++;

      // });
      let i = 0;
      var rtnFlg = true;
      const that = this;
      this.tblAllocation.forEach(function (element) {
          ////console.log((<HTMLInputElement>document.getElementById("Notional" + i)).value);
          //console.log(i);
          //console.log((<HTMLInputElement>document.getElementById("checkbox" + i)).checked)
          //console.log((<HTMLInputElement>document.getElementById("Notional" + i)).value);
          if (rtnFlg) {
              if ((<HTMLInputElement>document.getElementById("Notional" + i)).value === '0' && (<HTMLInputElement>document.getElementById("checkbox" + i)).checked) {
                  that.errorMsgBookOrder = "Please enter valid Notional.";
                  //console.log('Please enter valid Notional123.');
                  rtnFlg = false;
                  // return false;
                  // break;
              }
          }
          // if(!rtnFlg){}
          i++;
      });
      //console.log("AAAA:" + rtnFlg)
      if (!rtnFlg) {
          return false;
      }
      else {
          return true;
      }
  }

  isValidParameters() {
      try {
          ////console.log("in isValidParameters");
          ////console.log("this.OrderType:" + this.OrderType);
          ////console.log("this.LimitAmount:" + this.LimitAmount);
          if (this.sortedAllPrices.length > 0 &&
              this.sortedAllPrices[0].lp !== this.Issuer &&
              (this.nonBestPriceRsnDD === "" || this.nonBestPriceRsnDD === 'Please Select')) {
              this.errorMsgBookOrder = 'Please enter Non Best Price Reason';
              return false;
          }

          if (this.sortedAllPrices.length > 0 &&
              this.sortedAllPrices[0].lp !== this.Issuer &&
              (this.nonBestPriceRsnDD == "Others" || this.nonBestPriceRsnDD == "Other") && this.txtOthersRsn == "") {
              this.errorMsgBookOrder = 'Please enter Other Non Best Price Reason';
              return false;
          }

          if (this.txtOrderType === 'Limit' && (this.txtlimitLevel === '' || this.txtlimitLevel <= 0)) {
              ////console.log('Please enter Limit Price.');
              this.errorMsgBookOrder = 'Please enter Limit Price.';
              //this.orderflag = true;
              return false;
          }
          else if (this.txtOrderType === 'Limit' && this.underlyingForLimit === '') {
              ////console.log('Please enter Limit Price.');
              this.errorMsgBookOrder = 'Please select Underlying for Limit Level.';
              //this.orderflag = true;
              return false;
          }
          else {
              if (this.txtOrderType === 'Market') {
                  this.txtlimitLevel = 0;
              }
              this.errorMsgBookOrder = '';
              // this.orderflag = false;
              return true;
          }
      }
      catch (error) {
          ////console.log("Error:", error);
      }

  }
  setTotalNotional() {
      if (this.errorMsgBookOrder == '') {
          this.totalNotional = parseFloat(this.txtnotional.replace(/,/g, ''));
      }
      this.remainingNotional = parseFloat(this.totalNotional.toString().replace(/,/g, '')) - parseFloat(this.allocatedNotional.toString().replace(/,/g, ''));
      this.remainingNotional = this.remainingNotional.toFixed(2);
  }
  toggleSuccessMessage() {
      this.successMessage = false;
      this.warningMessage = false;
      if (this.PrevQuoteShowOrderPopUp) {
          this.PrevQuoteShowOrderPopUp = false;
          this.EcHome.refreshPreQuoteFlag.next(true);
          this.EcHome.prevQuoteOrderPopUp.next(false);
      }
  }
  removeErrorPopup(target) {
      $(target).next(".error-input").remove();
      $(target).next(".validate-popup").remove();
  }
  async emailQuote(rfq) {
    this.quoteEmailFlg = false;
    this.saveFlag = false;
    var res: any = await this.EcHome.quoteEmail(rfq);
    if (res.Status === "Success") {
      this.quoteEmailFlg = true;
      this.successMessage = true;
      this.successMsgBookOrder = "Email sent successfully";
    }
    return false;
  } //Changes done by Jyoti S || 16-May-2023
  async emailQuoteLP(rfq) {
    this.quoteEmailFlg = false;
    this.saveFlag = false;
    var index = this.priceProvidersArr.findIndex(item => item.rfq == rfq)
    if (index !== -1) {
      var res: any = await this.EcHome.quoteEmail(rfq);
      //console.log(res);
      if (res.Status=== "Success") {
        // this.quoteEmailFlg = true;
        this.priceProvidersArr[index].quoteEmailFlg = true;
        this.priceProvidersArr[index].Msg = "Email sent successfully";
        // this.successMsg = "Quote Mail Initiated"
      }
    }
    return false;
  }//Changes done by Jyoti S || 16-May-2023
  
  chngPriceChkBox(i) {
      //console.log(this.priceProvidersArr);
      //console.log(this.priceProvidersArr[i].priceChkFlg);
      this.priceProvidersArr[i].priceChkFlg = !this.priceProvidersArr[i].priceChkFlg
  }

  portfolioChange() {
      this.reset();
      this.successMsg = '';
      this.errorTemplateMessage = '';
      if (this.portfolio !== '') {
          //this.portfolioName = '';
          $('#loading').show();
          setTimeout(async () => {

              const saveQuoteData = await this.EcHome.getRedirectionData(this.portfolio,'Participation');
              if (saveQuoteData.length === 0) {
                  this.ErrorMsgTop = 'No data found for this record.';
              } else {
                  this.setSaveQuoteData(saveQuoteData[0], false);
              }
              this.accessRight = this.portfolioIdArr[this.portfolioIdArr.findIndex((record: { P_ID: string; }) => record.P_ID === this.portfolio)].AccessDetail;
          });
      }
  }

  async DeleteTemplate() {
      try {
          this.saveFlag = false;
          this.errorTemplateMessage = '';
          this.successMsg = ''
          if (this.portfolio !== '') {
              const res = await this.EcHome.BBVADeletePortfolio(this.portfolio, 'Participation');
              if (res) {
                  this.saveFlag = true;
                  // this.successMsg = 'Template ID ' + this.portfolio + ' deleted successfully.';
                  const index = this.portfolioIdArr.findIndex(obj => obj.P_ID === this.portfolio)
                  this.successMsg = 'Template : ' + this.portfolioIdArr[index].P_Name + ' deleted successfully.';
                  this.portfolio = '';
                  this.portfolioName = '';

                  this.portfolioIdArr = [];
                  this.portfolioIdArr = await this.EcHome.BBVAGetPortfolio('Participation', 'Single Pricer');
                  this.portfolioIdArr?.splice(0, 0, {
                      AccessDetail: "ALL",
                      Created_At: "",
                      P_ID: "",
                      P_Name: "",
                      ProdType: "",
                      ShareType: "ALL",
                      created_by: "",
                  });
                  this.portfolioIdArr?.map(r => {
                      let item = r;
                      item.imageIcon = environment.asseturl + ((r.ShareType + '').toUpperCase() === 'OWNER' ? 'owner.png' : 'shared.png');
                      return item;
                  });

              }
          }
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }
  //<!--Added by Apurva C||19-Oct-->
  SelectedTab(Tab: any) {
      this.activeTab = Tab;
      // this.EcCommon.setState(false);
      // this.EcCommon.setAccord(4, 'Participation')
  }
  selectRecord = {};
  prevQuoteLaunchPopUp = false;
  lauchProduct(priceRecord) {
      // set close launch product subscriber to false || PriyaL || 05Apr2022 || Assigned by PranavD
      this.EcHome.closeLaunchProduct.next(false);
      this.selectRecord = {};
      this.prevQuoteLaunchPopUp = true;
      this.selectRecord = priceRecord;
      this.selectRecord['RFQ_ID'] = priceRecord.rfq;
      this.selectRecord['Template_Code'] = 'Participation';
      this.selectRecord['RedirectedFrom'] = 'Pricers';
      this.selectRecord['Mode'] = 'Launch Product';
      return false;

      // RFQ_ID:p.rfq,Template_Code:'AutocallablePhoenix',RedirectedFrom:'Pricers',Mode:'Launch Product'}
  }

  async updatePortfolio() {
      try {
          if (this.portfolioName === '') {
              this.ErrorMsgTop = "Please enter valid template name.";
              return false;
          }

          this.validationOnButton();
          if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
              this.timeLeft = -1;
              this.timeoutMsg = '';
              this.clearFlag = true;
              clearInterval(this.interval);
              clearInterval(this.TSInterval);
              if (this.ShareBasket.length > 0) {
                  $(".validate-popup").remove();
                  document.getElementById('txtShare').classList.remove('underlyingError');
                  document.getElementById('txtShare').classList.add('longText');
              }
              this.saveportfolioId = '';
              this.PPDetails = '';
              this.sortedAllPrices = [];
              this.AllPrices = [];
              this.orderID = '';
              this.loadflag = false;
              this.ErrorMsg = '';
              this.ErrorMsgTop = '';
              this.rfqID = '';
              this.noteMasterID = '';
              this.saveFlag = false;
              this.quoteEmailFlg = false;
              this.successMsg = '';
              this.errorTemplateMessage = '';
              this.reqSuccessMsg = '';
              const strXml = '<Details>' + await this.generateSaveXML() + '</Details>';
              const res: any = await this.EcHome.BBVASaveQuotes('Single Pricer', strXml, this.portfolioName, this.portfolio, 'Participation', AppConfig.settings.oRes.userID);
              if (res) {
                  if (res.errorMessage === '') {

                      this.saveFlag = true;
                      this.saveportfolioId = res.PortFolioID;
                      this.successMsg = 'Template : ' + this.portfolioName + ' updated successfully.';
                      // this.successMsg = 'Portfolio ID ' + res.PortFolioID + ' saved successfully.';
                      this.portfolioIdArr = [];
                      this.portfolioIdArr = await this.EcHome.BBVAGetPortfolio('Participation', 'Single Pricer');
                      this.portfolioIdArr?.splice(0, 0, {
                          AccessDetail: "ALL",
                          Created_At: "",
                          P_ID: "",
                          P_Name: "",
                          ProdType: "",
                          ShareType: "ALL",
                          created_by: "",
                      });
                      this.portfolioIdArr?.map(r => {
                          let item = r;
                          item.imageIcon = environment.asseturl + ((r.ShareType + '').toUpperCase() === 'OWNER' ? 'owner.png' : 'shared.png');
                          return item;
                      });
                  } else {
                      this.errorTemplateMessage = res.errorMessage;
                  }
              }
          }
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }
  changeOrderType() {
      if (this.txtOrderType !== 'Limit') {
          this.txtlimitLevel = '';
          this.underlyingForLimit = '';
      }
      if (this.txtOrderType === 'Limit') {
          this.underlyingForLimit = this.ShareBasket[0].Code;
      }
  }

  hideViewPopup() {
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.ordersuccessMsg = '';
      this.showOrderDetailsFlag = false;
      this.minNotionalConfirm = false;

      if (this.viewRFQID && this.viewRFQID !== '') {
          this.viewOnly = false;
          this.EcHome.showPricerScreeninViewModePopup.next(false);
      }
      return false;
  }
  Setstkshiftvalue(e) {
    this.stkshift = e
  }
  
  changeDdl(event: any) {
      this.selectedVariantName = event.P_Name;
      this.portfolioName = event.P_Name;
      this.portfolio = event.P_ID;
      this.reset();
      this.portfolioChange();
      return false;
  }

  async sendordertocounterparty() {
      try {
          this.successMessage = false;
          this.warningMessage = false;
          this.successMsgBookOrder = '';

          // validation before booking order - added by PriyaL. on 25-Feb-2022 - assigned by Pranav

          if (parseFloat(this.Notional.replace(/,/g, '')) < parseFloat(this.bestLPArray.minLimit)) {
              this.successMsgBookOrder = "Cannot place order. Order notional is less than the minimum permitted.";
              this.warningMessage = true;
              this.successMessage = true;
              this.sendtoCptyBookOrder = false;
              return false;

          }
          if (parseFloat(this.Notional.replace(/,/g, '')) > parseFloat(this.bestLPArray.maxLimit)) {
              this.successMsgBookOrder = "Cannot place order. Order notional is greater than the maximum permitted.";
              this.warningMessage = true;
              this.successMessage = true;
              this.sendtoCptyBookOrder = false;
              return false;

          }


          if (parseFloat(this.Notional.replace(/,/g, '')) <= 0) {
              this.successMsgBookOrder = "Please enter valid notional.";
              this.successMessage = true;
              this.warningMessage = true;
              this.sendtoCptyBookOrder = false;
              return false;
          }


          // let res = this.EcHome.SendOrderToCpty(this.sortedAllPrices[0].NoteMasterID, this.sortedAllPrices[0].rfq, 'N');
          let res = await this.EcHome.SendOrderToCpty(this.sortedAllPrices[0].NoteMasterID, this.sortedAllPrices[0].rfq, this.TokenIdReprice, 'N');
          if (res['Status'] == "Succeed") {
            this.successMessage = true;
            this.successMsgBookOrder = res['ResponseMessage'];
            this.shwRepriceBookOrder = false;
            this.sendtoCptyBookOrder = true;
          } else {
            this.successMessage = true;
            this.successMsgBookOrder = res['ResponseMessage'];
            this.warningMessage = true;
            // this.errorMsgBookOrder = res.ResponseMessage;
            this.sendtoCptyBookOrder = false;
          }
          this.timeLeft = -1;
          this.timeoutMsg = '';
          this.clearFlag = true;
          clearInterval(this.interval);
          return false;
        } catch (error) {

      }
  }

  async filldropdownfromcommandata() {

    this.pageloadflag=true;
          for (let i = 0; i < this.commonData.length; i++) {
          switch (this.commonData[i].Field_Name) {
              // commented below case as booking center is fetched from api -by Priya L. on 14Mar2022 - assigned by Pranav D.
              // case "BookingCenter":
              //     this.BookingCenter = this.parseCommonDatatoJSONArr('BookingCenter');
            case "NonBestPriceReason":
                this.NonBestPriceReasonArr = await this.parseCommonDatatoJSONArr('NonBestPriceReason');
                break;

            case "StaticFormat":
              this.Format = await this.parseCommonDatatoJSONArr('StaticFormat');
                break;

            case "Tenor":
                this.Tenor = await this.parseCommonDatatoJSONArr('Tenor');
                break;

            case "IssueDateOffset":
            case "IssueDateOffsetRef"://Sudarshan | Asked by vipul | 31-Jan-2024
                this.IssueDateOffset = await this.parseCommonDatatoJSONArr('IssueDateOffset');
                if (!(this.IssueDateOffset?.length > 0)){
                    this.IssueDateOffset = await this.parseCommonDatatoJSONArr('IssueDateOffsetRef');
                  }
                break;

            case "InputProductVariation":
                this.participationTypeArr = await this.parseCommonDatatoJSONArr('InputProductVariation');
                break;
            
            case "InputRFQSolveFor":
                this.SolveForvalueArr = await this.parseCommonDatatoJSONArr('InputRFQSolveFor');
                break;
            
            case "InputKOBarrierFrequency":
                this.upBarrierTypeArr = await this.parseCommonDatatoJSONArr('InputKOBarrierFrequency');
                break;

            case "InputKIBarrierFrequency":
                this.downBarrierTypeArr = await this.parseCommonDatatoJSONArr('InputKIBarrierFrequency');
                break;
                
            case "CountryofDistribution":
                this.CountryofDistribution = await this.parseCommonDatatoJSONArr('CountryofDistribution');
                this.countryArr = [];
                for (let j = 0; j < this.CountryofDistribution.length; j++) {
                    if (this.CountryofDistribution[j].Value !== '') {
                    this.countryArr.push(this.CountryofDistribution[j].Value);
                    }
        
                }
        
                break;
          }
      }

  }

    parseCommonDatatoJSONArr(Field_Name: any) {
        let commonDataJSONArr: any = [];
        const index = this.commonData.findIndex(obj => obj.Field_Name === Field_Name);
        if (index >= 0) {
            const displayTxt = (this.commonData[index].Display_Text).split(',');
            const saveTxt = (this.commonData[index].Save_text).split(',');
            if (displayTxt && displayTxt.length > 0) {
                for (let i = 0; i < displayTxt.length; i++) {
                    if (displayTxt[i] !== '') {
                        commonDataJSONArr.push({ 'Key': displayTxt[i], 'Value': saveTxt[i] === '' ? displayTxt[i] : saveTxt[i] });
                    }

                }
            }

            if (Field_Name !== 'Tenor') {
                commonDataJSONArr.sort((a, b) => (a.Key > b.Key) ? 1 : -1);
            }
        }
        return commonDataJSONArr;
    }

  async changeStkShiftToggle() {
    this.priceBtnActive = 'Y'; //ApurvaK 
    console.log("stkshift", this.stkshift)
    if (this.stkshift === '0B') {
      this.Dates = await this.EcHome.BBVAGetDates(this.Exchange(), '0B', '');
      if (this.Dates) {
        this.stkdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
        console.log("stkshift", this.stkdate)
      }
    }
  }//Added by Jyoti S || 16-May-2023


//START || Added by SandipA for FIN1EURINT-122 || 27-Apr-2023
TenorValidationwithoutDays(e, inputTxtBox){
    try {
      let len = inputTxtBox.length;
      if(len === 0){
        e = (e) ? e : window.event;
        const code = (e.which) ? e.which : e.keyCode;
        let codes = new Array();
        codes = [8, 9, 13, 17, 18, 19, 20, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
        if (!this.EcCommon.contains.call(codes, code)) {
          return false;
        }
        return true;
      }
      else{
        e = (e) ? e : window.event;
        const code = (e.which) ? e.which : e.keyCode;
        let codes = new Array();
        codes = [8, 9, 13, 17, 18, 19, 20, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,  77, 87, 89, 109, 119, 121];
        if (!this.EcCommon.contains.call(codes, code)) {
          return false;
        }
        else{
          let codes = new Array();
          codes = [77, 87, 89, 109, 119, 121];
          const code = inputTxtBox.charCodeAt(len - 1);
          if (this.EcCommon.contains.call(codes, code)) {
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
  //END || Added by SandipA for FIN1EURINT-122 || 27-Apr-2023

  priipsChanged(val) {
    this.reset();
    this.priipsYN = val;
  }

  resetdropdownArr() {
    // this.AutocallableFrom = [];
    // this.AutocallFrequency = [];
    // this.BarrierOneTouchorNOtouch = [];
    // this.BasketType = [];
    // this.CallableFrequency = [];
    // this.CallableFrom = [];
    // this.Channel = [];
    this.CountryofDistribution = [];
    // this.CouponBarrierType = [];
    // this.CouponFrequency = [];
    // this.CouponType = [];
    // this.Currency = [];
    // this.EarlyRedemptionType = [];
    // this.FinalUpside = [];
    // this.FixingDetermination = [];
    this.Format = [];
    this.IssueDateOffset = [];
    // this.KIDs = [];
    // this.ProtectionType = [];
    // this.PublicorPrivate = [];
    // this.PutableFrequency = [];
    // this.PutableFrom = [];
    // this.RangeAccrualFrequency = [];
    // this.SettlementMethodArr = [];
    // this.SolveFor = [];
    // this.StaticFundingType = [];
    // this.StockExchange = [];
    // this.SwapFloatingReference = [];
    // this.CouponTypeArr = [];
    this.Tenor = [];
    // this.StrikeArr = [];
    // this.Termsheets = [];
    // this.UnderlyingStrikeType = [];
    // this.YieldFloatingReference = [];
  }

  setSolveFor(e: any) {
    try {
        this.reset();
        // this.infoMsg = '';
        const target = this.EcCommon.GetEventTarget(e);
        this.SolveForvalue = target.value;
        if (this.SolveForvalue === 'IBPrice') {
            this.IBPrice = '';
            this.setDefaultSolveForValues('IBPrice');
        }
        if (this.SolveForvalue === 'UpsideStrike') {
            this.upStrike = '';
            this.setDefaultSolveForValues('UpsideStrike');
        }
        if (this.SolveForvalue === 'UpsideBarrierLevel') {
            this.upBarrierLevel = '';
            this.setDefaultSolveForValues('UpsideBarrierLevel');
        }

        if (this.SolveForvalue === 'UpsideGearing') {
            this.upGearing = '';
            this.setDefaultSolveForValues('UpsideGearing');
        }

        if (this.SolveForvalue === 'UpperStrike') {
            this.upUpperStrike = '';
            this.setDefaultSolveForValues('UpperStrike');
        }
        if (this.SolveForvalue === 'Rebate') {
            this.upRebate = '';
            this.setDefaultSolveForValues('Rebate');
        }
        if (this.SolveForvalue === 'DownsideStrike') {
            this.downStrike = '';
            this.setDefaultSolveForValues('DownsideStrike');
        }
        if (this.SolveForvalue === 'DownsideBarrierLevel') {
            this.downBarrierLevel = '';
            this.setDefaultSolveForValues('DownsideBarrierLevel');
        }
        if (this.SolveForvalue === 'LowerStrike') {
            this.downLowerStrike = '';
            this.setDefaultSolveForValues('LowerStrike');
        }
        if (this.SolveForvalue === 'Leverage') {
            this.downLeverage = '';
            this.setDefaultSolveForValues('Leverage');
        }
        if (this.SolveForvalue === 'DownsideStrike + LowerStrike') {
            this.downStrike = '';
            this.downLowerStrike = '';
            this.setDefaultSolveForValues('DownsideStrike + LowerStrike');
        }

    } catch (error) { }
}

onchangeDownsideType() {
    try {

        switch (this.downsideType) {
            case 'Put': 
            this.downLowerStrike = '';
            this.downStrike='100.00';
                break;

            case 'PutSpread': 
            this.downLowerStrike = '80.00';
            this.downStrike='100.00';
                break;
        }
    } catch (exception) {

    }
}
upsidetypechange(){
    try {

      switch (this.upsidetype) {
        case 'Call Spread':
       this.upUpperStrike='100.00'
        this.upperStrikeYN=''
        this.upBarrierType='';
          break;

        case 'Call':
            this.upUpperStrike='';
            this.upperStrikeYN=''
            this.upBarrierType='';
          break;

        case 'Up and Out':
            this.upperStrikeYN='N';
            this.upBarrierType='None';
            if(this.upperStrikeYN=='Y'){
                 this.upUpperStrike='100.00'
            }
            else{
                this.upUpperStrike=''
            }
           
          break;
       
      }
    } catch (exception) {

    }
  }  
}
