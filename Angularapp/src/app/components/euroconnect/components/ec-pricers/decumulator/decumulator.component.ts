import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatCalendar } from '@angular/material/datepicker';
import moment from 'moment';
import { Moment } from 'moment';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { environment } from 'src/environments/environment';
import { CustomerService } from '../../../services/customer.service';
import { EcCommonService } from '../../../services/ec-common.service';
import { EcHomeService } from '../../../services/ec-home.service';
import { ExcelService } from '../../../services/excel.service';
import { NewsServiceService } from '../../../services/news-service.service';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Guid } from 'guid-typescript';
// import { DemoPipe } from 'src/app/demo.pipe';
import {SearchunderlyingPipe} from '../../../pipe/searchunderlying.pipe'
import { SvgIconsComponent } from '../../../CommonComponents/svg-icons/svg-icons.component';
import { AppConfig } from 'src/app/services/config.service';
import { HttpClient } from '@angular/common/http';
import { SearchUserGroupPipe } from '../../../pipe/search-user-group.pipe';




declare var require: any;
const $: any = require('jquery');

declare global {
  interface Array<T> {
      DQsortBy(p): Array<T>;
  }
}

Array.prototype.DQsortBy = function (p): Array<any> {
  try {

      if (this !== undefined) {
          if (this.length > 0) {
              if (this[0].solveFor.trim() !== 'Upfront') {
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

  }
  catch (error) {
      ////console.log("Error:", error);
  }
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
  selector: 'app-decumulator',
  templateUrl: './decumulator.component.html',
  styleUrls: ['./decumulator.component.scss']
})
export class DecumulatorComponent implements OnInit {

  constructor(public EcNews: NewsServiceService, public EcHome: EcHomeService, public EcCommon : EcCommonService , public EcExcel : ExcelService , 
    public EcCustomer : CustomerService , public elem: ElementRef , public datepipe: DatePipe, private route: ActivatedRoute,public http: HttpClient, private renderer: Renderer2) {
        try {
          this.portfolioId = '';
          this.flag = false;
          this.shares = [];
          this.ddlNoteCcy = 'EUR';
          this.UnderlyingCurrency = 'EUR';
          this.format = 'Note';
          this.autoNonCallYN = 'N';
          this.autoStepDownYN = 'N';
          this.autocallCouponYN = 'N';
          this.successMessage = false;
          this.warningMessage = false;
          this.pageloadflag=true;////Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
        } catch (error) {
          //console.log('Error', error);
        }
    }

  countrySel = new UntypedFormControl();
  pageActive: Boolean = true;
  myControl = new UntypedFormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  @Input() PrevQuoteShowOrderPopUp: any;
  @Input() dataItemAccordian: any;

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

  @Output()
  dateSelected: EventEmitter<Moment> = new EventEmitter();

  @Output()
  selectedDate = moment();

  @ViewChild('calendar', { static: true })
  calendar: MatCalendar<Moment>;

  @ViewChild('focusable', { static: false }) namefield: ElementRef;
  timeoutMsg = '';
  reqSuccessMsg: string;

  selectedBIndex = 0;
  showSuggestions = false;
  Currency: string;
  flag: boolean;
  shares: any;
  ShareName: string;
  shareCode: any;
  exchngCode: any;
  selectedShareIndex = 0;
  ShareBasket: any = [];
  settdate = '';
  stkdate = '';
  expdate = '';
  orderLoadFlag: boolean = false// Added by YASH AGRAWAL
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
  Strike: any;
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
  CouponBarrier: any;
  loadflag = false;
  variantFlag = false; //Added by Apurva K|| 18-Dec-2023||HSBCECCLI-87
  pageloadflag = true;//Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
  orderID: any;
  timeLeft = 60;
  interval: any;
  PPDetails: any;
  ErrorMsg = '';
  clearFlag: boolean;
  format: any;
  templateMappingArr: any;
  Product = 'Decumulator';
  autoTrigger: any;
  cpnTrigger: any;
  autoFreq: any;
  cpnFreq: any;
  autoStepDown: any;
  cpnType: any;
  autoNonCall: any;
  cpnObservation: any;
  cpnCoupon: any;
  fundType: any;
  fundFreq: any;
  fundRate: any;
  barrierLevel: any;
  barrierType: any;
  altLevel: any;
  altObservation: any;
  altCoupon: any;
  rfqID: any;
  noteMasterID: any;
  altcouponFlag: any;
  autocallCoupon: any;
  autocallCouponType: any;
  autocallCouponYN: any;
  autoNonCallYN: any;
  autoStepDownYN: any;
  MemoryPeriods: any;
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
  minStrike: any;
  minReoffer: any;
  issuePrice: any;
  defaultRFQTimeout: number;
  defaultOrderTimeout: number;
  showSaveNShare: string;
  BlockedUserGroups:any;
  showBlockReason = false;
  BlockUserMessage: any;
  tempXML = '';
  checkNotionalRes: any;
  viewOnly = false;

  stkshift: any;
  paymentshift: any;
  expshift: any;

  portfolioId: any;
  allBooksData: any = [];
  onBehalfOf = '';
  buttonList: any = '';
  portfolioGroupID: any = '';
  LeverageYN: any = 'No';
  LeverageFlag = false;
  // View TS flag and timer
  TSTimeout = 180;
  TSInterval: any;
  TSFlag = false;
  autoFreqArr: any = [];
  freqArr = ['1m', '2m', '3m', '4m', '6m', '12m'];
  DQPriceSubscription: Subscription;
  TriggerValueArr: any;
  autoTriggerPopup = false;
  cpnTriggerPopup = false;
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
  totalNotional: any = "10";
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
  ErrorMsgTop: any;


  allocatedNotionalArr: any = [0];
  EstimatedNotionalArr: any = [0.00];
  allocatedRMArray: any = [''];
  viewRFQ = '';
  templateName = '';


  txtnotional: any;
  txtIBPrice: any;
  txtClientPrice: any;
  txtStrike: any;
  txtTenor: any;
  txtUpfront: any;
  txtClietYield: any;
  txtOrderType: any;
  txtlimitLevel: any;
  underlyingForLimit: '';
  txtEQCRef: any;
  txtComment: any;
  txtOthersRsn: any;
  nonBestPriceRsnDD: any;



  txtShare: any;
  RMList = [];
  customerList:any = [];
  BookingCenter:any = [];
  successMsgBookOrder: string = "";
  errorMsgBookOrder: string = "";
  orderBookedFlag = false;
  successMessage: boolean;
  warningMessage: boolean;
  // selectedSharesData = [];
  priceClickFlag = false;


  basketType = 'Worst-Of';
  publicOrPrivate = 'Private Placement';
  listed = 'N';
  stockExchange = '';
  stockExchangeArr: any = [];
  quanto = 'Y';
  priipsYN = 'N';
  country = '';
  language = 'English';
  termsheetTypeYN = 'Y';
  termsheetType = 'Standard';
  customTenor = '';
  autocallableFrom = 'M1';
  startingAutocall = '100.00';
  PutableBarrier = '';
  cpnInFine = 'N';
  cpnFixing = 'In Advance';
  cpnFltRef = 'EUR001M Index';
  cpnFloor = '0.00';
  cpnCap = '';
  cpnMultiplier = '100.00';
  rangeAccrualFreq = 'Daily';
  lowCpnBarrier = '';
  upperCpnBarrier = '';
  upfrontFee = '';
  callableFreq = '';
  putableFreq = '';
  cpnSpread = '';
  upperPutStrike = '100.00';
  lowerPutStrike = '';
  putSpreadGearing = '100.00';
  upsideType = '';
  callStrike = '100.00';
  callGearing = '100.00';
  lowerCallStrike = '100.00';
  upperCallStrike = '';
  callSpreadGearing = '100.00';
  leverage = '100.00';
  ProtectionLevel = '';
  KIBarrier = true;
  countryArr = ['Andorra', 'Austria', 'Belgium', 'Czechia', 'Finland', 'France', 'Germany',
      'Greece', 'Guernsey', 'Hungary', 'Ireland', 'Italy', 'Jersey', 'Netherlands', 'Norway', 'Poland', 'Portugal',
      'Spain', 'Sweden', 'Switzerland', 'UK']
  allSelected = false;

  // AQ Variable
  showtooltip = false;
  upfront: any;
  Tenor: any;
  TenorType: any;
  Frequency: any;
  Guarantee: any;
  KO: any;
  NoOfShare: any;
  chkLeverage: boolean;
  UnderlyingPrice: any = '';
  StrikePer: any = '';
  NotionalAmount: any = '';
  StrikePrice: any = '';
  NoShares: any = '';
  showcalctableFlag = false;
  calcDayCount: any = '';
  totalShares: any;
  accrualDays: any;
  rdbcalcShares: boolean = false;
  rdbcalcNotional: boolean = false;
  calcLeverage: any = 'Yes';
  calcTotalShares: any = '';
  portfolio = '';
  portfolioIdArr: any = [];
  portfolioName = '';
  UserRolesArr:any = [];
  selectedVariantName = '';
  bookOrderFlag = true;
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
  DealerValue
  commonData:any = [];
  defaultvaluesArr:any = [];
  NonBestPriceReasonArr = [];
  tenorMaxMonth: number;
  tenorMinMonth: number;
  minNotionalConfirm = false;

  // new config variable || PriyaL || 05Apr2022 || Assigned by PranavD
  EQ_Show_Launch_Button = 'NO';
  EQ_Show_Order_Button = 'NO';

  // new config variable || Amogh k || 19Apr2022 || Assigned by PranavD
  EQ_Show_Termsheet_Button = 'NO';

  // new config variable || Amogh k || 21Apr2022 || Assigned by PranavD
  EQ_Show_KID_Button = 'NO';
  selectRecord = {};
  prevQuoteLaunchPopUp = false;
  docSupportStatus: any = {};

  TSloadFlag: boolean = false; //Apurva K||26-Apr-2023||FIN1EURINT-246
  ngAfterViewInit() {
    const buttons = document.querySelectorAll(
      '.mat-calendar-previous-button, .mat-calendar-next-button'
    );

    if (buttons) {
      Array.from(buttons).forEach((button) => {
        this.renderer.listen(button, 'click', () => {
          //console.log('Arrow buttons clicked');
        });
      });
    }
  }

  async ngOnDestroy(): Promise<void> {
    this.pageActive = false;
    this.timeLeft = -1;
    this.timeoutMsg = '';

    clearInterval(this.interval);
    clearInterval(this.TSInterval);
    this.AllPrices = [];
    this.sortedAllPrices = [];
    await this.EcCommon.setAQReceivedPrices({}, '');
    if (this.DQPriceSubscription) {
      this.DQPriceSubscription.unsubscribe();
    }
  }
  
  ngOnInit() {

    this.pageActive = true;
        this.minNotionalConfirm = false;
        try {
            this.pageloadflag=true;
            $('#loading').show();
            this.viewOnly = this.viewOnlyFlag ?? this.viewOnly; // Added by Jyoti S || 30-Jun-2023 || FIN1EURINT-511
            setTimeout(async () => {
                this.docSupportStatus = await this.EcHome.GetDocumentSupportStatus('Decumulator');//Changed by Sandip A || 05-Jan-2023 || To send docs specfic to the entity ID 
                // this.RMList = this.EcHome.Get_RMList();
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
                this.DealerValue = await this.EcHome.checkLoginBookName();
                //this.isDealer = this.DealerValue
                // this.BookingCenter = this.EcHome.GetBookingCenter();
                this.portfolioIdArr = [];
                this.portfolioIdArr = await this.EcHome.BBVAGetPortfolio('Decumulator', 'Single Pricer');
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
                //console.log(this.RMList);
                //console.log(this.BookingCenter);

                // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
                // if (this.EcHome.allBooksData === undefined || this.EcHome.allBooksData.length <= 0) {
                //     this.allBooksData = this.EcHome.getAllBooksMappedToLogin();
                // }
                // if (this.EcHome.shares === undefined || this.EcHome.shares.length <= 0) {
                // this.EcHome.BBVALoadShares('EQ', "", "EQC_Europe").subscribe((data:any)=>{
                //     this.shares = data.Get_All_Share_Details_JsonResult;
                //     this.EcHome.shares = this.shares
                //     });
                 //Commented by Apurva K|| 07-Jul-2023|| As discussed with Nitish K for removing extra call to GetAllShareDetails
                    //this.shares =  await this.EcHome.BBVALoadShares('EQ,IDX', "", "EQC_Europe")
                // }
                if (this.EcHome.CCY === undefined || this.EcHome.CCY.length <= 0) {
                    this.ReceivedCCY = await this.EcHome.BBVALoadCCY();
                }
                if (this.EcHome.validationArr === undefined || this.EcHome.validationArr.length <= 0) {
                    // this.EcHome.BBVAFetchValidation('EQ').subscribe((data:any)=>{
                    //     this.validationArr = data.FetchValidationResult;
                    //     this.EcHome.validationArr = this.validationArr
                    //   });
                      this.validationArr = await this.EcHome.BBVAFetchValidation('EQ')
                }
                if (this.EcHome.payOffList === undefined || this.EcHome.payOffList.length <= 0) {
                    await this.EcHome.getPayOffList();
                }
                if (this.EcHome.rmList === undefined || this.EcHome.rmList.length <= 0) {
                    await this.EcHome.Get_RMList();
                }

                // Fetch booking center - added by Priya L. on 14Mar2022 - assigned by Pranav D.
                // if (this.EcHome.BookingCenter === undefined || this.EcHome.BookingCenter.length <= 0) {
                    this.BookingCenter = await this.EcHome.GetBookingCenter();
                // }
                // this.BookingCenter = this.EcHome.BookingCenter;
                

                this.RMList = this.EcHome.rmList;
                this.customerList = await this.EcHome.getCustomerList();
                this.shares = await this.EcHome.shares;
                //console.log(" shares arrar" , this.shares);


                this.filteredOptions = this.myControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value))
                );

                this.changeAutocallCpn();
                this.changeAutoStepDown();
                this.changeAutoNonCall();
                this.reset();

                this.fnGetProdTemplate();
                //console.log(this.templateMappingArr);
                this.fnGetValidation();

                // //console.log('Price Providers',this.priceProvidersArr.lp.join(','))
                // if (this.templateMappingArr && this.templateMappingArr.length > 0) {
                    this.commonData = await this.EcHome.GetCommonDataEuroConnect('DAC');
                    if (this.commonData && this.commonData.length > 0) {
                        this.filldropdownfromcommandata();
                    }
                    this.defaultvaluesArr = await this.EcHome.GetEntityDefaultValues("", AppConfig.settings.oRes.userID, 'DAC');
                // }
                // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
                // this.allBooksData = this.EcHome.allBooksData;
                // Removed client book mapping || PriyaL || 22Apr2022 || Assigned by Pranav D


                // if (this.allBooksData && this.allBooksData.length > 0) {
                //     this.onBehalfOf = this.allBooksData[0].BookCode;
                //     this.GetClientProdDetailsArr = this.EcHome.GetClientProdDetails(this.onBehalfOf);
                //     if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
                //         if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix') > -1) {
                //             this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix')].CPM_Format).toString().split(',');
                //             this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix')].ActiveYN;
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
                await this.EcCommon.ClearPricesFromMultiToDealEntry();

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

                this.IBPrice = ''; // prev. default
                // this.IBPrice = '99.50';
                this.ddlNoteCcy = 'EUR';

                this.SolveForvalue = 'IBPrice'; // prev. default
                // this.SolveForvalue = 'Coupon';


                this.Notional = '1,000,000.00';
                this.Strike = '100.00';
                this.LeverageFlag = false;
                this.LeverageYN = 'No';

                this.autoTrigger = '';
                this.autoFreq = 'MONTHLY';
                this.autoStepDown = '';
                this.autoNonCall = '';
                this.cpnType = 'Conditional with Memory';
                this.cpnTrigger = '70.00';
                this.cpnFreq = 'MONTHLY';
                this.cpnObservation = 'European (Last day of the Month)';
                this.cpnCoupon = '5.00'; // prev. default
                // this.cpnCoupon = '';

                this.fundType = '';
                this.fundFreq = '';
                this.fundRate = '';
                this.barrierLevel = '60.00';
                this.barrierType = 'European (Maturity)';
                this.altLevel = '';
                this.altObservation = '';
                this.altCoupon = '';
                this.altcouponFlag = 'No';
                this.autocallCoupon = '';
                this.autocallCouponType = 'Constant Barrier';
                this.MemoryPeriods = '';
                this.issuePrice = '100.00';

                this.autoNonCallYN = 'N';
                this.autoStepDownYN = 'N';
                this.autocallCouponYN = 'N';

                const today = new Date();
                this.stkshift = '0B';
                this.paymentshift = '5B';
                this.expshift = '1Y';


                this.Tenor = 6;
                this.upfront = '0.50';
                this.IBPrice = '99.50';
                this.KO = '98.00';
                this.TenorType = 'Month';
                this.SolveForvalue = 'Strike';
                this.UnderlyingCurrency = 'USD';
                this.Frequency = 'MONTHLY';
                this.sortedAllPrices = [];
                this.NoOfShare = '10';
                this.Strike = '';
                this.Guarantee = '1';
                this.Notional = '';
                this.chkLeverage = true;

                // this.autoFreqArr = ['1m', '2m', '3m', '4m', '6m']
                this.changeAutoFreqOnTenor();
                // tslint:disable-next-line: max-line-length
                // this.stkdate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
                this.Dates = await this.EcHome.BBVAGetDates('', '0B', '');
                if (this.Dates) {
                    this.todayDate = this.EcCommon.formatDate(this.Dates.MaturityDate);

                }
                // Commented below code as not required for LGT || PriyaL || 28Apr2022 - EULGTINT -163
                // this.Dates = this.EcHome.BBVAGetDates(this.Exchange(), '0B', '');
                // if (this.Dates) {
                //     this.stkdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
                //     // this.EcCommon.formatDate(this.Dates.MaturityDate);
                //     // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
                // }

                // this.Dates = this.EcHome.BBVAGetDates(this.ddlNoteCcy, '5B', this.stkdate);
                // if (this.Dates) {
                //     this.settdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
                //     // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
                // }

                // this.Dates = this.EcHome.BBVAGetDates(this.ddlNoteCcy, '1Y', this.settdate);
                // if (this.Dates) {
                //     this.expdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
                //     // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
                // }
                this.sortedAllPrices = [];
                this.ReceivedCCY = this.EcHome.CCY;
                try {
                    this.ReceivedCCY.forEach((element) => {
                        const ccyData = element.Ccy;
                        this.CCY.push(ccyData);
                    });
                } catch (error) {
                }
                this.ddlNoteCcy = 'EUR';

                this.users = await this.EcHome.GetMappedUsersAndGroups();

                // set default values - added by Priya L on 15Feb2022 - assigned by Pranav D.
                if (this.defaultvaluesArr && this.defaultvaluesArr?.length > 0) {
                    this.ShareBasket = [];
                    this.SelectedUnderlyingBasket = [];
                    this.SelectedUnderlyingBasketArray = [];
                    //console.log(this.defaultvaluesArr);
                    this.setdefaultvalues();
                }
                const res:any = await this.EcHome.GetPriceProviderDetails(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator');
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
                        TSDisableFlag: false, //Added by Apurva K|| 22-May-2023
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
                        TSDisableFlag: false, //Added by Apurva K|| 22-May-2023
                        KidNotSupported: !(currCPdocStatus?.["KID"] === "Y"),
                        TSNotSupported: !(currCPdocStatus?.["Indicative_Termsheet"] === "Y"),
                    });
                }

                const that = this;
                this.DQPriceSubscription = await this.EcCommon.DQSignalRPrices.subscribe(res => {
                    const prices = res.price;
                    // if (this.EcCommon.isEmptyObject(prices)) {
                    //     // //console.log('blank');
                    //     this.sortedAllPrices = [];
                    //     this.AllPrices = [];
                    //     this.sortedAllPrices = [];

                    //     this.timeLeft = -1;
                    //     this.timeoutMsg = '';
                    //     clearInterval(this.interval);
                    //     // this.AllPrices = [];
                    //     // this.sortedAllPrices = [];

                    //     // this.EcCommon.setPHXReceivedPrices({}, '');
                    //     this.priceProvidersArr.forEach(element => {
                    //         element.rfq = '';
                    //         element.price = '-';
                    //         element.timer = this.defaultTimeout; //this.startCountDown(this.defaultTimeout, i),
                    //         element.id = '';
                    //         element.status = '';
                    //         element.NoteMasterID = '';
                    //         element.TSFlag = false;
                    //         element.Msg = '';
                    //         element.KIDFlag = false;
                    //         element.TSMsg = '';
                    //     });
                    //     return false;
                    //     // this.bestLPArray
                    //     // this.buttonList = '';
                    //     // that.timeLeft = 0;
                    // }
                    if (prices && prices.length > 0) {
                        this.sortedAllPrices = [];
                        this.AllPrices = [];
                        // tslint:disable-next-line: prefer-for-of
                        for (let i = 0; i < prices.length; i++) {

                            for (let k = 0; k < this.priceProvidersArr.length; k++) {
                                if (prices[i].ppID === this.priceProvidersArr[k].lp) {
                                    this.priceProvidersArr[k].price = (this.priceProvidersArr[k].timer === 0 && (this.priceProvidersArr[k].price === '' || this.priceProvidersArr[k].price === '-')) ? 'Timeout' :
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
                                        Price: (prices[i].value === null ? '-' : prices[i].value),
                                        solveFor: prices[i].solveFor,
                                        NoteMasterID: prices[i].noteMasterID,
                                        id: prices[i].id,
                                        status: prices[i].status,
                                        bestYN: prices[i].bestYN,
                                        // quote expired timeout chnages by suvarna P || 31Mar2022 || assigned by Pranav D || start
                                        EP_Quote_Response_At: prices[i].EP_Quote_Response_At,
                                        EP_ValidUntilTime: prices[i].EP_ValidUntilTime
                                    });
                                }
                            }
                            // else{
                            //     this.AllPrices[i].Price =prices[i].value;
                            //     this.AllPrices[i].id= prices[i].id;
                            //     this.AllPrices[i].status= prices[i].status;

                            // }
                        }


                        // //console.log('AllPrices', this.AllPrices);

                        // this.sortedAllPrices = this.AllPrices;//.sortBy('Price');
                        var idxBest = this.AllPrices.findIndex(item => item.bestYN === 'Y');
                        if (idxBest > -1) {
                            // this.sortedAllPrices = this.AllPrices.DQsortBy('Price');
                            this.sortedAllPrices = this.AllPrices.filter(item => item.bestYN === 'Y');
                        }

                        // set sortedAllPrices array on reprice action - added by PriyaL on  25-Feb-2022 - assigned by Pranav D.
                        if (this.sendtocptyflag) {
                            this.sortedAllPrices = this.AllPrices;
                        }

                        if (this.sortedAllPrices && this.sortedAllPrices[0]) {
                            var idx = this.priceProvidersArr.findIndex(item => item.lp == this.sortedAllPrices[0].lp);
                            ////console.log(idx);
                            //if(idx > 0){
                            //this.priceProvidersArr = array_move(this.priceProvidersArr, idx, 0)
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
                            switch (this.sortedAllPrices[0].solveFor) {
                                case 'Strike':
                                    that.Strike = price;
                                    that.replySolveFor = 'Strike';
                                    break;
                                case 'Upfront':
                                    that.upfront = price;
                                    that.replySolveFor = 'Upfront';
                                    break;
                                case 'Coupon':
                                    that.cpnCoupon = price;
                                    that.replySolveFor = 'Coupon';
                                    break;
                                case 'KO':
                                    that.autoTrigger = price;
                                    that.replySolveFor = 'Autocall Trigger';
                                    break;
                                case 'RebateCoupon':
                                    that.autocallCoupon = price;
                                    that.replySolveFor = 'Autocall Coupon';
                                    break;
                                case 'CouponBarrier':
                                    that.cpnTrigger = price;
                                    that.replySolveFor = 'Coupon Trigger';
                                    break;
                                case 'KI':
                                    that.barrierLevel = price;
                                    that.replySolveFor = 'Barrier Level';
                                    break;
                                case 'FundingRate':
                                    that.fundRate = price;
                                    that.replySolveFor = 'Rate/Spread';
                                    break;
                            }
                            if (price !== '') {
                                if (this.elem.nativeElement.querySelector('#txt' + this.sortedAllPrices[0].solveFor)) {
                                    this.elem.nativeElement.querySelector('#txt' + this.sortedAllPrices[0].solveFor).classList.add('reply');
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
                            var saveQuoteData:any ;
                             await this.EcHome.getRedirectionData(params.PORTFOLIO_ID,'Decumulator').then((data:any)=>{saveQuoteData=data});
                            if (saveQuoteData.length === 0) {
                                this.ErrorMsgTop = 'No data found for this record.';
                            } else {
                                // viewOnly
                                this.viewOnly = params.viewOnly ? true : false;
                                this.setSaveQuoteData(saveQuoteData[0], this.viewOnly);
                            }
                        }
                        if (params.Tenor) {
                            const tChar = (params.Tenor + '').substring(params.Tenor.length - 1);
                            //console.log(tChar);
                            if (tChar.toUpperCase() === 'M') {
                                this.TenorType = 'Month';
                            }
                            if (tChar.toUpperCase() === 'Y') {
                                this.TenorType = 'Year';
                            }

                            this.Tenor = (params.Tenor + '').substring(0, params.Tenor.length - 1);
                        }
                        if (params.Underlyings) {
                            // multiple shares issue when redirecting from home || by Suvarna P || 21Mar2022 || assign by Pranav D
                            this.ShareBasket = [];
                            this.SelectedUnderlyingarray = [];
                            this.SelectedUnderlyingBasketArray = [];
                            var list: string[] = params.Underlyings.split(",")
                            for (var each of list) {
                                this.showUnderlying("event", SearchunderlyingPipe.prototype.transform(this.shares, each)[0]);

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

                            // commented by PriyaL || 22Apr2022 || Assigned buy PranavD.
                            // if (parseInt(this.Order_Notional) < parseInt(preQuoteData1.cloneData.MinNotional[0])) {

                            //     this.minNotionalConfirm = true;
                            // }
                            this.viewRFQ = this.viewRFQID;
                            if (this.sendtocptyflag && this.Order_Notional && this.Order_Notional !== '') {
                                // preQuoteData1.cloneData.NoOfShares[0] = this.EcCommon.formatNotional(this.Order_Notional); // Azure change
                                preQuoteData1.cloneData.DailyNoOfShares[0] = await this.EcCommon.formatNotional(this.Order_Notional);

                            }
                            this.setPrevQuoteData1(preQuoteData1.cloneData, this.viewOnly);
                            this.RepriceIssuer = preQuoteData1.cloneData.PPCODE[0];

                            // Modified ordernotional with notional || PriyaL || 22Apr2022 || Assigned buy PranavD.
                            if (parseInt(this.Notional.replace(/,/g, '')) < parseInt(preQuoteData1.cloneData.MinNotional[0])) {
                                this.minNotionalConfirm = true;
                            }
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
                    clearInterval(this.TSInterval);
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

  fnGetValidation() {
    try {
        this.validationArr = this.EcHome.validationArr;
        if (this.validationArr) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.validationArr.length; i++) {
                switch (this.validationArr[i].Setting_Name) {
                    case 'EQ_MaxTriggerPercentage':
                        this.maxTrigger = this.validationArr[i].Default_Value;
                        break;

                    case 'EQ_MinTriggerPercentage':
                        this.minTrigger = this.validationArr[i].Default_Value;
                        break;

                    case 'EQ_MinStepdownTriggerPercentage':
                        this.minStepdown = this.validationArr[i].Default_Value;
                        break;

                    case 'EQ_MaxCouponTriggerPercentage':
                        this.maxCoupon = this.validationArr[i].Default_Value;
                        break;

                    case 'EQ_MinCouponTriggerPercentage':
                        this.minCoupon = this.validationArr[i].Default_Value;
                        break;

                    case 'EQ_MinBarrierLevelPercentage':
                        this.minBarrier = this.validationArr[i].Default_Value;
                        break;

                    case 'EQ_MinStrikePercentage':
                        this.minStrike = this.validationArr[i].Default_Value;
                        break;

                    case 'EQ_MinReOfferPricePercentage':
                        this.minReoffer = this.validationArr[i].Default_Value;
                        break;

                    case 'EQ_DefaultRFQTimeOut_Ang':
                        this.defaultRFQTimeout  = this.validationArr[i].Default_Value;
                        break;

                    case 'EQ_OrderValidityTimer_Ang':
                        this.defaultOrderTimeout = this.validationArr[i].Default_Value;
                        break;

                    case 'EQ_DefaultTSTimeOut_Ang':
                        this.TSTimeout = this.validationArr[i].Default_Value;
                        break;
                    case 'EQ_ShowSaveNShareOption':
                        this.showSaveNShare = this.validationArr[i].Default_Value;
                        break;
                    case 'EQC_BlockLoginGroupsFromorder':
                        this.BlockedUserGroups = this.validationArr[i].Default_Value;
                        break;
                    case 'EQC_BlockUserMessage':
                        this.BlockUserMessage = this.validationArr[i].Default_Value;
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
        //console.log('Error:' + error);
    }
}

async fnGetProdTemplate() { 
    try {

        this.templateMappingArr = await this.EcHome.fnGetProdTemplate('Decumulator');
      
      } catch (error) {
        //console.log('Error:', error);
      }
}

setSolveFor(e) {
    try {
        this.reset();
        const target = this.EcCommon.GetEventTarget(e);
        this.SolveForvalue = target.value;
        if (this.SolveForvalue === 'Strike') {
            this.Strike = '';
            this.setDefaultSolveForValues('Strike');
        }

        if (this.SolveForvalue === 'Upfront') {
            this.upfront = '';
            this.setDefaultSolveForValues('Upfront');
        }
    } catch (error) { }
}

setDefaultSolveForValues(solveFor) {
    try {
        if (this.Strike === '' && solveFor !== 'Strike') {
            this.Strike = '102.00';
        }
        if (this.upfront === '' && solveFor !== 'Upfront') {
            this.upfront = '0.50';
        }
    } catch (error) {
        //console.log('Erorr', error);
    }
}

setSelectedUnderlyingarray(LongName: string, Ccy: string, Code: string, ExchangeCode: string,
    Exchangename: string, ISINname: string, Last1yearHighValue: string,
    Last1yearLowValue: string, Spot: string, RiskRating: any, RICCode: any) {
    try {
        this.SelectedUnderlyingarray.push({ LongName, Ccy, Code, ExchangeCode, Exchangename });
        this.SelectedUnderlyingBasketArray.push({
            LongName, Ccy, Code, ExchangeCode, Exchangename,
            ISINName: ISINname, Last1yearHighValue, Last1yearLowValue, Spot, Riskrating: RiskRating, RICCode: RICCode
        });
        this.updateShareBasket();
    } catch (error) { }
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
    } catch (Error) {
    }
}

selectShare(e) {
    try {
        this.flag = false;
        if ($('.HoverSuggestion').data('share') !== undefined) {
            this.shareCode = $('.HoverSuggestion').data('share');
        }
        if (this.shareCode !== undefined && this.shareCode !== '') {
            this.showUnderlying(e, SearchunderlyingPipe.prototype.transform(this.shares, this.shareCode)[0]);
        }
    } catch (Error) {
        //console.log('Error', Error);
    }
}

backKeyPress(e) {
    try {
      console.log(e)
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
      console.log(event)
        this.reset();
		 // Start | share should get replace on selecting second share || ChitraM || 23-Apr2022 || FIN1EURINT-58 || as asked by Milind Sir
        this.ShareBasket = [];
        this.SelectedUnderlyingarray = [];
        this.SelectedUnderlyingBasketArray = [];
        //End | ChitraM | 23-Apr-23| FIN1EURINT-58
        this.flag = false;
        this.selectedBIndex = 0;
        this.showSuggestions = false;
        this.ShareName = '';
        // this.ccyChange = item.Ccy;
        if (this.ShareBasket.length < 1) {
            if (this.ShareBasket.find(i => i.Code === item.BloombergCode) === undefined) {
                this.ShareBasket.push({ Code: item.BloombergCode, LongName: item.LongName, Weight: '', Exchange: item.ExchangeCode, RICCode: item.Code });
                this.setSelectedUnderlyingarray(item.LongName, item.Ccy, item.BloombergCode,
                    item.ExchangeCode, item.ExchangeName, '', '', '', '', '', item.Code);
            } else {
                return false;
            }
            this.shareCode = item.Code;
            this.exchngCode = item.ExchangeCode;
            this.ddlNoteCcy = item.Ccy;
            this.calculateNotional(this.shareCode, this.exchngCode, this.NoOfShare);
        }
        if (this.ShareBasket.length > 0) {
            $("#txtShare").next(".error-input").remove();
            $("#txtShare").next(".validate-popup").remove();
            $('#txtShare').css("text-indent", "0px")
            document.getElementById('txtShare').classList.remove('underlyingError');
            document.getElementById('txtShare').classList.add('longText');
        }

        // Commented below code as not required for LGT || PriyaL || 28Apr2022 - EULGTINT -163
        // this.Dates = this.EcHome.BBVAGetDates(this.Exchange(), this.stkshift, '');
        // if (this.Dates) {
        //     this.stkdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
        // }

        // this.Dates = this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : this.paymentshift), this.stkdate);
        // if (this.Dates) {
        //     this.settdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
        // }

        // this.Dates = this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
        // if (this.Dates) {
        //     this.expdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
        // }

        this.upsideType = 'None';
        this.upsideTypeChange()

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
      await this.validationOnButton(); // added `await` keyword || FIN1EURINT-581 || Kaustubh S || 09-Aug-2023
      if (this.ErrorMsg === '' && this.ErrorMsgTop === '') {
          this.reset();
          this.priceBtnActive = 'N'; //Remove multiple clicks pn Price button
          this.loadflag = true;
          this.pageloadflag=false;//Added by SandipA for FIN1EURINT-46 || 14-Apr-2023
          this.portfolioGroupID = await this.EcHome.fnportfolioGroupID();
          if (!this.priceClickFlag) {
            this.DQPrice('All', "0", 'N');
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
       const res = this.EcHome.GetPriceProviderDetails(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator');
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
              // this.DQPrice(LP);
              if (this.sendtocptyflag) {

                  // cleared Pricer Provider Array on reprice action - added by PriyaL.on 25Feb2022 - assigned by Pranav D.
                  this.priceProvidersArr = [];
                  const res:any = await this.EcHome.GetPriceProviderDetails(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator');
                  for (let i = 0; i < res.length; i++) {
                      if (res[i] === res[i]) {
                          this.priceProvidersArr.push({ lp: res[i], rfq: '', price: '-', timer: '', id: '', status: '', NoteMasterID: '', TSFlag: false, Msg: '', KIDFlag: false, TSMsg: '',  TSLoadFlag: false, TSDisableFlag: false }); //Added by Apurva K|| 02-May-2023

                      }
                  }
                  // this.ERRePrice(LP,this.NMID,'Y');
                  // this.DQPrice(LP,this.NMID,'Y');
                  this.DQPrice(LP, this.viewRFQID, 'Y');
              }
              else {
                  this.DQPrice(LP, "0", 'N');
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

      //console.log(this.templateMappingArr);
    //   const d :any= await this.EcHome.BBVAGetDates(this.ddlNoteCcy, ((this.expshift === 'Custom' ? this.customTenor : this.expshift) + '').toUpperCase(), this.stkdate);
    //   const fixdate = this.EcCommon.formatDate(d.MaturityDate);
      let GuaranteedDuration: string;
      let GuaranteedDurationType: string;
      let GearingLeverage: string;

      if (this.chkLeverage) {
          GearingLeverage = '2';
      }
      else {
          GearingLeverage = '1';
      }

      if (this.Frequency === 'MONTHLY') {
          GuaranteedDuration = '' + this.Guarantee;
          GuaranteedDurationType = 'MONTH';
      } else if (this.Frequency === 'BIWEEKLY') {
          GuaranteedDuration = (this.Guarantee).toString();
          GuaranteedDurationType = 'WEEK';
      }

      if (this.templateMappingArr && this.templateMappingArr.length > 0) {
          let xmlstr: any = '<QuoteRequest>';
          this.templateName = this.templateMappingArr[0].template;
          // tslint:disable-next-line: forin
          for (const i in this.templateMappingArr) {
              switch (this.templateMappingArr[i].email_Header) {
                  case 'Product': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.Product + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'ShareCode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.Code() + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'Exchange': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.Exchange() + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'CCY': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.ddlNoteCcy + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'SolveForvalue': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.SolveForvalue + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  // Azure change    
                  case 'SolveFor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.SolveForvalue + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'Strike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.Strike + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'Upfront': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.upfront + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'Tenor': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + (this.Tenor + this.TenorType.toString().substr(0, 1).toUpperCase()) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'Frequency': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.Frequency + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'DailyNoOfShares': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.NoOfShare + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'Notional ': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.Notional + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'KO': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.KO + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'GearingLeverage': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + GearingLeverage
                      + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'GuaranteedDuration': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + GuaranteedDuration + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'GuaranteedDurationType': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + GuaranteedDurationType + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  // case 'OnBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                  //     + this.onBehalfOf + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                  //     break;
                  case 'PortfolioGroupID': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.portfolioGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'LoginUser': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + AppConfig.settings.oRes.userID
                      + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'RICCode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.RICCode() + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'underlying1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + (this.ShareBasket[0].Code === undefined ? '' : this.ShareBasket[0].Code)
                      + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  case 'exchange1': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + (this.ShareBasket[0].Exchange === undefined ? '' : this.ShareBasket[0].Exchange)
                      + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  // new field to pass Accrual days -added by Priya L. on 15Mar2022 - assigned by Pranav D.
                  case 'AccrualDays': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.accrualDays
                      + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
                  // new field to pass TotalShares required for DocGen -added by Suvarna P. on 14APr2022 - assigned by Pranav D.
                  case 'TotalShares': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
                      + this.totalShares
                      + '</' + this.templateMappingArr[i].template_Field_Name + '>';
                      break;
              }
          }
          // xmlstr += '<PriipsinScope>NO</PriipsinScope><Termsheets>EIS</Termsheets></QuoteRequest>';
          xmlstr += '</QuoteRequest>';
          return xmlstr;
      } else {
          return '';
      }

  } catch (error) {
      //console.log('Error' + error);
  }
}

    async DQPrice(LPVal, NMID, repriceFlg) {
  try {
      var LP = '';
      this.priceBtnActive = 'N'; //Remove multiple clicks pn Price button
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
            //       item.timer = this.startCountDown(this.defaultTimeout, idx);
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
                    //   var idx = this.priceProvidersArr.findIndex(item11 => item11.lp === item.lp);

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
            this.priceProvidersArr[idx].loadFlag = true // Added by Jyoti S || 02-May-2023
              //this.priceProvidersArr[idx].timer = this.startCountDown(this.defaultTimeout, idx);
          }
          LP = LPVal;
      }
      this.priceClickFlag = true;
      var xmlstr = this.generateXML()
      this.clearFlag = false;
      const webMethod = this.interfaceUrl + 'eqd/Quote/QuoteRequest';
      const that = this;
      const parameters = [{
        productCode: this.templateName,//'Decumulator',
        subTemplateCode: this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator',
          LP: LP, // this.EcHome.priceProviders.join(','),
          requestXML: xmlstr,
          solveFor: this.SolveForvalue,
          loginID: AppConfig.settings.oRes.userID,
          // userGroupID: this.allBooksData[this.allBooksData.findIndex(x => x.BookCode === this.onBehalfOf)].BookName,//this.onBehalfOf,
          // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
          // userGroupID: this.onBehalfOf == '' ? '' :
          //     this.allBooksData.findIndex(x => x.BookCode === this.onBehalfOf) > -1 ? this.allBooksData[this.allBooksData.findIndex(x => x.BookCode === this.onBehalfOf)].BookName : '',//this.onBehalfOf,
        userGroupID: AppConfig.settings.oRes.groupID,
        buyerEntityID: AppConfig.settings.oRes.homeEntityID,
        noteMasterID: NMID,
        repricereqYN: repriceFlg
      }];

      await this.http.post(webMethod, parameters).toPromise().then((data: any) => {
        this.loadflag = false;
        // debugger;
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

                        let quoteResponseCheck = false;
                        that.interval = setInterval(async () => {

                if (that.timeLeft > 0) {
                  that.timeoutMsg = '';
                                if (!quoteResponseCheck) {
                                    quoteResponseCheck = await that.DQPriceResponse(that.PPDetails);
                                }

                  that.timeLeft = that.timeLeft - 5;
                } else if (that.timeLeft === 0 || that.timeLeft < 0) {
                  that.loadflag = false;
                  // that.timeoutMsg = 'Timeout';
                  clearInterval(that.interval);

                              for (let i = 0; i < that.priceProvidersArr.length; i++) {
                                  if (that.priceProvidersArr[i].price === '-') {
                                      that.priceProvidersArr[i].price = 'Timeout'
                                  }

                              }
                          }
              }, 5000);
            }
          }
      });
    //   $.ajax({
    //       async: true,
    //       crossDomain: true,
    //       type: 'POST',
    //       url: webMethod,
    //       data: JSON.stringify(parameters),
    //       contentType: 'application/json; charset=utf-8',
    //       dataType: 'json',
    //       headers: {
    //           'Cache-Control': 'no-cache',
    //           'Access-Control-Allow-Origin': '*'
    //       },
    //       success(data) {
    //           if (data.errorMessage !== '' || !that.pageActive) {
    //               that.ErrorMsgTop = data.errorMessage.split('. ')[0];
    //               that.loadflag = false;
    //               that.timeLeft = 0;
    //               for (let i = 0; i < that.priceProvidersArr.length; i++) {
    //                   that.priceProvidersArr[i].timer = '';
    //                   clearInterval(that.priceProvidersArr[i].interval1);
    //                   // this.priceProvidersArr[index].price = 'Timeout';
    //                   that.priceProvidersArr[i].timeStartFlag = false;
    //               }
    //               return false;
    //           }
    //           that.rfqID = data.rfqid;
    //           that.noteMasterID = data.noteMasterID;
    //           if (!that.clearFlag) {
    //               that.Prices = [];
    //               that.timeLeft = that.defaultTimeout;
    //               that.PPDetails = that.rfqID;
    //               if (that.PPDetails !== '') {
    //                   that.priceClickFlag = false;

    //                   if (data.rfqPPid !== '') {
    //                       const rfqPPID = data.rfqPPid.split(',');
    //                       for (let k = 0; k < rfqPPID.length; k++) {
    //                           if (rfqPPID[k].toString().includes(':')) {
    //                               const splitRFQID = rfqPPID[k].split(':');
    //                               const index = that.priceProvidersArr.findIndex(res => res.lp === splitRFQID[0].toString().trim());
    //                               if (index > -1) {
    //                                   that.priceProvidersArr[index].rfq = splitRFQID[1];
    //                               }
    //                           }

    //                       }
    //                   }
    //                   /*	
    //                                   const res = that.EcHome.GetPriceProviderDetails(that.templateMappingArr.length > 0 ? that.templateMappingArr[0].subTemplate : 'Accumulator');
    //                                   for (let i = 0; i < res.length; i++) {
    //                                       that.priceProvidersArr.push({ lp: res[i], rfq: '', price: '-', timer: that.startCountDown(that.defaultTimeout, i), id: '', status: '', NoteMasterID: '', TSFlag: false, Msg: '', KIDFlag: false, TSMsg: '' });
    //                                   }
    //                   */
    //                   that.interval = setInterval(() => {

    //                       if (that.timeLeft > 0) {
    //                           that.timeoutMsg = '';
    //                           that.DQPriceResponse(that.PPDetails);

    //                           that.timeLeft = that.timeLeft - 5;
    //                       } else if (that.timeLeft === 0 || that.timeLeft < 0) {
    //                           that.loadflag = false;
    //                           // that.timeoutMsg = 'Timeout';
    //                           clearInterval(that.interval);
    //                           // tslint:disable-next-line: max-line-length
    //                           // that.ErrorMsg = 'Price response is taking longer than expected hence price will not display on this screen. \nInstead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section and by email.';

    //                           // for (let i = 0; i < res.length; i++) {
    //                           for (let i = 0; i < that.priceProvidersArr.length; i++) {
    //                               if (that.priceProvidersArr[i].price === '-') {
    //                                   that.priceProvidersArr[i].price = 'Timeout'
    //                               }

    //                           }
    //                       }

    //                   }, 5000);
    //               }
    //           }
    //       },
    //       error(error) {
    //           console.error(error);
    //           // Clear timer if api calling return error - added by Priya L. on 17Mar2022 - assigned by Pranav D.
    //           that.loadflag = false;
    //           that.timeLeft = 0;
    //           for (let i = 0; i < that.priceProvidersArr.length; i++) {
    //               that.priceProvidersArr[i].timer = '';
    //               clearInterval(that.priceProvidersArr[i].interval1);
    //               // this.priceProvidersArr[index].price = 'Timeout';
    //               that.priceProvidersArr[i].timeStartFlag = false;
    //           }
    //           return false;
    //       }
    //   });
  } catch (error) {
      //console.log('Error:', error);
  }
}

    async DQPriceResponse(PPDetails) {
  try {
      const webMethod = this.interfaceUrl + 'eqd/Quote/CheckIfResponseReceived';
      const that = this;
      const parameters = {
        QuoteRequestID: PPDetails

      };
            return await this.http.post(webMethod, parameters).toPromise().then(async (data: any) => {
            that.Prices = data;
            await that.EcCommon.setDQReceivedPrices(that.Prices, 1);
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
            });
  } catch (error) {
      //console.log('Error:', error);
  }
}

/* Notional change -not required  by Suvarna
setNotional(e) {
   try {
       this.reset();
       const target = this.EcCommon.GetEventTarget(e);
       this.Notional = parseFloat(target.value.replace(/,/g, ''));
       if (this.Notional === '0' || this.Notional === '0.00') {
            this.ErrorMsgTop = 'Please enter valid notional.';
       }
   }
   catch (error) {
       //console.log("Error:", error);
   }
}
*/

removeShare(rownumber: any) {
  try {
      this.ShareBasket.splice(rownumber, 1);
      this.SelectedUnderlyingarray.splice(rownumber, 1);
      this.SelectedUnderlyingBasketArray.splice(rownumber, 1);
      // if (this.SelectedUnderlyingBasketArray.length > 0) {
      //     this.ddlNoteCcy = this.SelectedUnderlyingBasketArray[this.SelectedUnderlyingBasketArray.length - 1]['Ccy'];
      // }
      // else {
      //     this.ddlNoteCcy = 'EUR';
      // }
      this.updateShareBasket();
      this.reset();
      if (this.ShareBasket.length < 2) {
          this.upsideType = 'None';
          this.upsideTypeChange();
      }
      this.Notional = '';
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
    async reset() {
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
      clearInterval(this.TSInterval);

      if (this.ShareBasket.length > 0) {
          document.getElementById('txtShare').classList.remove('underlyingError');
          document.getElementById('txtShare').classList.add('longText');
      }
      this.PPDetails = '';
      this.sortedAllPrices = [];
      this.AllPrices = [];
      this.orderID = '';
      this.loadflag = false;
      this.ErrorMsgTop = '';
      this.rfqID = '';
      this.noteMasterID = '';
      this.saveFlag = false;
      this.quoteEmailFlg = false;
      this.successMsg = '';
      this.reqSuccessMsg = '';
      this.errorTemplateMessage = '';
      const els = document.getElementsByClassName('error');
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < els.length; i++) {
          els[i].classList.remove('error');
      }
      document.getElementById('txtShare').classList.remove('underlyingError');
      document.getElementById('txtShare').classList.add('longText');
      if (this.SolveForvalue === 'Strike') {
          this.Strike = '';
          this.LeverageFlag = true;
          // this.LeverageYN = 'Yes';
      }
      if (this.SolveForvalue === 'Coupon') {
          this.cpnCoupon = '';
      }
      if (this.SolveForvalue === 'Upfront') {
          this.upfront = '';
      }
      if (this.SolveForvalue === 'KI') {
          this.barrierLevel = '';
      }
      if (this.SolveForvalue === 'KO') {
          this.autoTrigger = '';
      }
      if (this.SolveForvalue === 'RebateCoupon') {
          this.autocallCoupon = '';
      }
      if (this.SolveForvalue === 'CouponBarrier') {
          this.cpnTrigger = '';
      }
      if (this.SolveForvalue === 'FundingRate') {
          this.fundRate = '';
      }

      if (document.getElementById('txtStrike')) {
          document.getElementById('txtStrike').classList.remove('reply');
      }
      if (document.getElementById('txtUpfront')) {
          document.getElementById('txtUpfront').classList.remove('reply');
      }
      if (document.getElementById('txtCoupon')) {
          document.getElementById('txtCoupon').classList.remove('reply');
      }
      if (document.getElementById('txtRebateCoupon')) {
          document.getElementById('txtRebateCoupon').classList.remove('reply');
      }
      if (document.getElementById('txtCouponBarrier')) {
          document.getElementById('txtCouponBarrier').classList.remove('reply');
      }
      if (document.getElementById('txtKI')) {
          document.getElementById('txtKI').classList.remove('reply');
      }

      if (document.getElementById('txtKO')) {
          document.getElementById('txtKO').classList.remove('reply');
      }
      if (document.getElementById('txtFundingRate')) {
          document.getElementById('txtFundingRate').classList.remove('reply');
      }
      this.EcCommon.DQPricesObserver.next('');
      this.EcCommon.DQPrices = [];
      await this.EcCommon.setDQReceivedPrices({}, '');
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
          element.TSDisableFlag = false;  //Added by Apurva K|| 22-May-2023
      }
      );
      this.poolDetailsVisibleFlag = false;
      this.bookOrderFlag = true;

  } catch (error) {
      //console.log('Error:', error);
  }
  return false;
}

PriceValidation(e, Pricestr: string) {
  try {
      this.reset();
      const target = this.EcCommon.GetEventTarget(e);

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
          case 'Strike':

              if (parseFloat(target.value) <= parseFloat(this.minStrike)) {
                  this.ErrorMsgTop = 'Strike should be greater than ' + this.minStrike + '%.';
                  target.classList.add('error');
              }

              break;

          case 'CouponTrigger':
              if (target.value === '') {
                  this.ErrorMsgTop = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
                  target.classList.add('error');

              } else if (target.value.indexOf('/') < 0) {
                  if (parseFloat(target.value) <= parseFloat(this.minCoupon) ||
                      parseFloat(target.value) >= parseFloat(this.maxCoupon)) {
                      this.ErrorMsgTop = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
                      target.classList.add('error');

                  }
                  target.value = parseFloat(target.value).toFixed(2);
              } else {
                  const cpnArr = target.value.split('/');
                  // tslint:disable-next-line: prefer-for-of
                  for (let i = 0; i < cpnArr.length; i++) {
                      if (parseFloat(cpnArr[i]) <= parseFloat(this.minCoupon) ||
                          parseFloat(cpnArr[i]) >= parseFloat(this.maxCoupon)) {
                          this.ErrorMsgTop = 'Coupon trigger should be between ' + this.minCoupon + '% and ' + this.maxCoupon + '%.';
                          target.classList.add('error');
                      }
                  }
              }
              break;

          case 'BarrierLevel':
              if (parseFloat(target.value) <= parseFloat(this.minBarrier)) {
                  this.ErrorMsgTop = 'Barrier level should be greater than ' + this.minBarrier + '%.';
                  target.classList.add('error');
              }
              break;
          case 'Stepdown':
              if (parseFloat(target.value) <= parseFloat(this.minStepdown)) {
                  this.ErrorMsgTop = 'Stepdown should be greater than ' + this.minStepdown + '%.';
                  target.classList.add('error');
              }
              break;

          case 'AutoTrigger':
              if (target.value === '') {
                  this.ErrorMsgTop = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
                  target.classList.add('error');

              } else if (this.autoStepDown === '') {
                  if (target.value.indexOf('/') < 0) {
                      if (parseFloat(target.value) <= parseFloat(this.minTrigger) ||
                          parseFloat(target.value) >= parseFloat(this.maxTrigger)) {
                          this.ErrorMsgTop = 'Autocall trigger should be between ' + this.minTrigger + '% and ' + this.maxTrigger + '%.';
                          target.classList.add('error');
                      }
                      target.value = parseFloat(target.value).toFixed(2);
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

altCouponFlagChange() {
  try {
      this.reset();
      if (this.altcouponFlag === 'Yes') {
          this.altLevel = '0.00';
          this.altObservation = 'PerAnnum';
          this.altCoupon = '0.00';
      } else {
          this.altLevel = '';
          this.altObservation = '';
          this.altCoupon = '';
      }
  } catch (error) {
      //console.log(error);
  }
}

cpnTypeChange() {
  try {
      this.reset();
      this.cpnObservation = '';
      this.cpnTrigger = '';
      this.cpnFreq = '';
      this.cpnCoupon = '';
      this.cpnInFine = '';
      this.rangeAccrualFreq = '';
      this.lowCpnBarrier = '';
      this.upperCpnBarrier = '';
      this.cpnFloor = '';
      this.cpnCap = '';
      this.cpnMultiplier = '';
      this.cpnFixing = '';
      this.cpnFltRef = '';

      if (this.cpnType === 'Conditional with Memory' || this.cpnType === 'Conditional without Memory') {
          this.cpnObservation = 'European (Last day of the Month)';
          this.cpnTrigger = '70.00';
          this.cpnFreq = 'MONTHLY';
          this.cpnCoupon = '5.00';
          this.cpnInFine = 'N';
      } else if (this.cpnType === 'Snowball') {
          this.cpnCoupon = '5.00';
      } else if (this.cpnType === 'Fixed Unconditional') {
          this.cpnFreq = 'MONTHLY';
          this.cpnCoupon = '5.00';
      } else if (this.cpnType === 'Range Accrual') {
          this.cpnFreq = 'MONTHLY';
          this.cpnCoupon = '5.00';
          this.rangeAccrualFreq = 'Daily';
      } else if (this.cpnType === 'Fixed Unconditional') {
          this.cpnFreq = 'MONTHLY';
          this.cpnCoupon = '5.00';
      } else if (this.cpnType === 'Floating Unconditional') {
          this.cpnFreq = 'MONTHLY';
          this.cpnCoupon = '5.00';
          this.cpnFloor = '0.00';
          this.cpnCap = '';
          this.cpnMultiplier = '100.00';
          this.cpnFixing = 'In Advance';
          this.cpnFltRef = 'EUR001M Index';
      } else if (this.cpnType === 'Floating without Memory') {
          this.cpnFreq = 'MONTHLY';
          this.cpnTrigger = '';
          this.cpnCoupon = '5.00';
          this.cpnFloor = '0.00';
          this.cpnCap = '';
          this.cpnMultiplier = '100.00';
          this.cpnFixing = 'In Advance';
          this.cpnFltRef = 'EUR001M Index';
      }

  } catch (error) {
      //console.log('Error' + error);
  }
  return false;
}

formatChange() {
  try {
      this.reset();

      if (this.format !== 'Swap' && this.SolveForvalue === 'FundingRate') {
          this.SolveForvalue = 'IBPrice';
      }
      if (this.format === 'Option' && (this.SolveForvalue === 'CouponBarrier' || this.SolveForvalue === 'Coupon')) {
          this.SolveForvalue = 'IBPrice';
      }


      if (this.SolveForvalue === 'IBPrice') {
          this.IBPrice = '';
          if (this.format === 'Swap') {
              this.issuePrice = '';
          } else {
              this.issuePrice = '100.00';
          }
      } else {
          if (this.format === 'Swap') {
              this.IBPrice = '0.00';
              this.issuePrice = '';
          } else {
              this.IBPrice = '99.50';
              this.issuePrice = '100.00';
          }
      }

      if (this.format === 'Swap') {

          if (this.SolveForvalue === 'FundingRate') {
              this.fundRate = '';
              this.fundFreq = ''
              this.fundType = '';
          } else {
              this.fundRate = '1.00';
              this.fundType = 'Floating Rate';
              if (this.autoFreq === '1m' || this.autoFreq === '2m' || this.autoFreq === '4m') {
                  this.fundFreq = '1m';
              } else {
                  this.fundFreq = '3m';

              }
          }
      } else {

          this.fundType = '';
          this.fundFreq = '';
          this.fundRate = '';
      }
      if (this.format === 'BonoJ' || this.format === 'Warrant') {
          this.ddlNoteCcy = 'MXN';

      }
      if (this.format === 'Option') {
          this.cpnType = '';
          this.cpnFreq = '';
          this.cpnCoupon = '';
          this.cpnObservation = '';
          this.cpnTrigger = '';
          this.MemoryPeriods = '';
      } else {
          if (this.cpnType === '') {
              this.cpnType = 'Fixed Coupon';
          }
          if (this.cpnFreq === '') {
              this.cpnFreq = 'At Maturity';
          }
          if (this.cpnCoupon === '' && this.SolveForvalue !== 'Coupon') {
              this.cpnCoupon = '5.00';
          }
          if (this.cpnObservation === '') {
              this.cpnObservation = 'PerFreq';
          }
      }

  } catch (error) {
      //console.log('Error' + error);
  }
  return false;
}

barrierTypeChange() {
  try {
      this.reset();
      $(".validate-popup").each(function () {
          $(this).remove();
      });
      $(".error-input").each(function () {
          $(this).remove();
      });
      if (this.barrierType === 'None' || this.barrierType === '') {
          this.Strike = '';
          this.leverage = '';
          this.barrierLevel = '';
          this.putSpreadGearing = '';
      }

  } catch (error) {
      //console.log('Error', error);
  }
}

upsideTypeChange() {
  try {
      this.reset();
      this.priceBtnActive = 'Y'; //Remove multiple clicks pn Price button
      if (this.upsideType === 'None' || this.upsideType === '') {
          this.callStrike = '';
          this.callGearing = '';
          this.lowerCallStrike = '';
          this.upperCallStrike = '';
          this.callSpreadGearing = '';
      }

  } catch (error) {

  }
}

async txtTenorChange(e, type: any) {
  try {
      this.reset();
      const target = await this.EcCommon.GetEventTarget(e);
      const today = new Date();
      let strDate = '';
      const dayCount = 0;
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
      //console.log(target.value);
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
          strDate = this.EcCommon.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          // }

          this.stkdate = strDate;

          this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : this.paymentshift), this.stkdate);
          this.settdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

          this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
          this.expdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');


      }
      if (type === 'Payment') {
          this.paymentshift = target.value;
          // if (str.toUpperCase() === '0B') {
          // tslint:disable-next-line: max-line-length
          //     // strDate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
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
          // //console.log(target.value);
          if (str.toUpperCase() === '0B') {
              // tslint:disable-next-line: max-line-length
              // strDate = today.getFullYear().toString() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
              strDate = this.settdate;
          } else {
              this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, str.toUpperCase(), this.settdate);
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
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtsettdate")
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
//modified by PoojaW
    async Save() {
  try {
    this.variantFlag = true; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
    this.reset(); //Added to fix timeout bug on Save New variant call while pricing|| 13-Jun-2023
      if (this.portfolioName === '') {
          this.ErrorMsgTop = "Please enter valid template name.";
          this.variantFlag = false; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
          return false;
      }

      // this.validationOnButton();
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
          var res: any;
          await this.EcHome.BBVASaveQuotes('Single Pricer', strXml, this.portfolioName, '', 'Decumulator', AppConfig.settings.oRes.userID).then((data:any)=>{res= data});
          if (res) {
              if (res.errorMessage === '') {

                  this.saveFlag = true;
                  this.variantFlag = false; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
                  this.saveportfolioId = res.PortFolioID;
                  this.successMsg = 'Template : ' + this.portfolioName + ' saved successfully.';
                  // this.successMsg = 'Portfolio ID ' + res.PortFolioID + ' saved successfully.';
                  this.portfolioIdArr = [];
                  await this.EcHome.BBVAGetPortfolio('Decumulator', 'Single Pricer').then((data: any)=>{this.portfolioIdArr = data});
                  this.portfolioIdArr?.splice(0, 0, {
                      AccessDetail: "ALL",
                      Created_At: "",
                      P_ID: "",
                      P_Name: "",
                      ProdType: "",
                      ShareType: "ALL",
                      created_by: "",
                  });
                  this.portfolioIdArr.map(r => {
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
      //console.log('Error', error);
  }
  return false;
}

async generateSaveXML() {
  try {
      this.validationOnButton();
      if (this.ShareBasket.length <= 0) {
          // FIN1EURINT-502 : Bulk Pricer - Rows get rearranged on saving or updating a portfolio.
	  await this.EcCommon.generateFlexiXml({});
          return '';
      }
      this.tempXML = '';
      if ((this.Notional + '').includes(',')) {
          this.Notional = this.Notional.replace(/,/g, '');
      }

      // const shareCcy = ((this.ShareBasket[0] === undefined) ? '' : (this.ShareBasket[0].Code + '#')) +
      //     ((this.ShareBasket[1] === undefined) ? '' : (this.ShareBasket[1].Code + '#')) +
      //     ((this.ShareBasket[2] === undefined) ? '' : (this.ShareBasket[2].Code + '#')) +
      //     ((this.ShareBasket[3] === undefined) ? '' : (this.ShareBasket[3].Code + '#')) +
      //     ((this.ShareBasket[4] === undefined) ? '' : (this.ShareBasket[4].Code + '#')) +
      //     ((this.ShareBasket[5] === undefined) ? '' : (this.ShareBasket[5].Code + '#')) + '#' + this.ddlNoteCcy;

      //Changed by Apurva K||14-Dec-2023|| HSBCECCLI-86
      this.tempXML += '<Record>' +
          '<ShareBBGRIC1>' + ((this.ShareBasket[0] === undefined) ? '' : this.ShareBasket[0].RICCode) + '</ShareBBGRIC1>' +
          '<ShareBBGRIC2>' + ((this.ShareBasket[1] === undefined) ? '' : this.ShareBasket[1].RICCode) + '</ShareBBGRIC2>' +
          '<ShareBBGRIC3>' + ((this.ShareBasket[2] === undefined) ? '' : this.ShareBasket[2].RICCode) + '</ShareBBGRIC3>' +
          '<ShareBBGRIC4>' + ((this.ShareBasket[3] === undefined) ? '' : this.ShareBasket[3].RICCode) + '</ShareBBGRIC4>' +
          '<ShareBBGRIC5>' + ((this.ShareBasket[4] === undefined) ? '' : this.ShareBasket[4].RICCode) + '</ShareBBGRIC5>' +
          '<ShareBBGRIC6>' + ((this.ShareBasket[5] === undefined) ? '' : this.ShareBasket[5].RICCode) + '</ShareBBGRIC6>' +
          '<SolveFor>' + this.SolveForvalue + '</SolveFor>' +
          '<SharesQuantity>' + this.NoOfShare + '</SharesQuantity>' +
          '<TotalNotional>' + this.Notional + '</TotalNotional>' +
          '<TenorPer>' + this.Tenor + '</TenorPer>' +
          '<Strike>' + this.Strike + '</Strike>' +
          '<KOPer>' + this.KO + '</KOPer>' +
          '<KOType></KOType>' +
          '<Frequency>' + this.Frequency + '</Frequency>' +
          '<Guarantee>' + this.Guarantee + '</Guarantee>' +
          '<Upfront>' + this.upfront + '</Upfront>' +
          // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
          // '<onBehalfOf>' + this.onBehalfOf + '</onBehalfOf>' +
          '<onBehalfOf></onBehalfOf>' +
          '<LeverageYN>' + (this.chkLeverage ? 'Y' : 'N') + '</LeverageYN>' +
          '<TenorType>' + this.TenorType + '</TenorType>' +
          '</Record>';

      // FIN1EURINT-502 : Bulk Pricer - Rows get rearranged on saving or updating a portfolio.
      this.EcCommon.generateFlexiXml({xml: this.tempXML, index: 0});
      return this.tempXML;
  } catch (error) {
      //console.log('Error', error);
  }
}

    async checkValidNotional(e, type: any) {
  try {
      $("#txtnotional").next(".error-input").remove();
      $("#txtnotional").next(".validate-popup").remove();
      const NotionalData = await this.EcCommon.checkValidNotional(e);
      if (NotionalData.ErrorMsg === '') {
          if (type === 'Notional') {
              this.Notional = NotionalData.Notional;
          }
          if (type === 'NotionalAmt') {
              this.NotionalAmount = NotionalData.Notional;
          }

          if (type === 'NoOfShare') {
              this.NoOfShare = parseFloat(NotionalData.Notional.replace(/,/g, '')).toFixed(0);
              // Calculate total shares || PriyaL || 12Apr2022 || Assigned by Pranav D. -->
              //this.totalShares = this.accrualDays * this.NoOfShare; // commented by suvarna || added in calculateNotional function || 13APr2022
              this.NoOfShare = this.NoOfShare.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              this.calculateNotional(this.shareCode, this.exchngCode, this.NoOfShare)
          }

          // e.target.value = this.Notional;
      } else {
          this.ErrorMsgTop = NotionalData.ErrorMsg;
          if (type === 'Notional') {
              $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtnotional")
              $('.validate-popup').delay(5000).fadeOut('slow');
          }
          if (type === 'NotionalAmt') {
              document.getElementById('txtNotionalAmount').classList.remove('error');

          }

      }

  } catch (error) {
      //console.log('Error', error);
  }
}

    async checkValidAllocateNotional(e, rowindex) {
  try {
      const NotionalData = await this.EcCommon.checkValidNotional(e);
      if (NotionalData.ErrorMsg === '') {
          // this.Notional = NotionalData.Notional;
          if (NotionalData.Notional.includes(',')) {
              NotionalData.Notional = NotionalData.Notional.toString().replace(/,/g, '');
          }
          e.target.value = parseFloat(NotionalData.Notional).toFixed(0);
          this.allocatedNotionalArr[rowindex] = e.target.value;
          this.calculateAllocationNotional(this.shareCode, this.exchngCode, this.allocatedNotionalArr[rowindex].toString().replace(/,/g, '')).then(data =>{
            this.EstimatedNotionalArr[rowindex] = data
          })
        //   this.EstimatedNotionalArr[rowindex] = this.calculateAllocationNotional(this.shareCode, this.exchngCode, this.allocatedNotionalArr[rowindex].toString().replace(/,/g, ''));
          this.errorMsgBookOrder = "";
      } else {
          this.allocatedNotionalArr[rowindex] = 0;
          this.calculateAllocationNotional(this.shareCode, this.exchngCode, this.allocatedNotionalArr[rowindex].toString().replace(/,/g, '')).then(data =>{
            this.EstimatedNotionalArr[rowindex] = data
          })
        //   this.EstimatedNotionalArr[rowindex] = this.calculateAllocationNotional(this.shareCode, this.exchngCode, this.allocatedNotionalArr[rowindex].toString().replace(/,/g, ''));
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
          const target = this.EcCommon.GetEventTarget(e);
          const floatNotional = parseFloat(this.Notional.toString().replace(/,/g, ''));

          this.checkNotionalRes = await this.EcHome.BBVACheckNotional(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator', this.ddlNoteCcy);
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
      //console.log('Error', error);
  }
}

    async currencyChange() {
  try {
      this.reset();
      this.checkNotionalRes = await this.EcHome.BBVACheckNotional(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator', this.ddlNoteCcy);
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

      this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : this.paymentshift), this.stkdate);
      if (this.Dates) {
          this.settdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
      }

      this.Dates = await this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
      if (this.Dates) {
          this.expdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
      }

  } catch (error) {
      //console.log('Error', error);
  }
  return false;
}

validationOnButton() {
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

      // if (this.onBehalfOf === '' && !this.sendtocptyflag) {
      //     this.ErrorMsgTop = 'No client is  mapped for this user. Request cannot be placed.';
      //     return false;
      // } else {
      //     this.ErrorMsgTop = '';
      // }



      if (this.ShareBasket.length <= 0) {
          document.getElementById('txtShare').className = 'underlyingError';
          this.ErrorMsgTop = 'Please enter underlying.';
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter(".underlyingError")
          $('.validate-popup').delay(5000).fadeOut('slow');
          $('#txtShare').css("text-indent", "30px")
      }

      if (this.SolveForvalue !== 'Strike' && parseFloat(this.Strike) <= parseFloat(this.minStrike)) {
          this.ErrorMsgTop = 'Strike should be greater than ' + this.minStrike + '%.';
          document.getElementById('txtStrike').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtStrike")
          $('.validate-popup').delay(5000).fadeOut('slow');
      }

      //  Added strike validation on price button || PriyaL || 12Apr2022 || Assigned by Pranav D.
      if (this.SolveForvalue !== 'Strike' && parseFloat(this.Strike) < 102) {
          this.ErrorMsgTop = 'Strike % should be greater than or equal to 102';
          document.getElementById('txtStrike').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtStrike")
          $('.validate-popup').delay(5000).fadeOut('slow');
          // return false;
      }

      if (this.Guarantee === '') { // Guarentee Periods validation changes || asigned by pranav || 07Mar2022
          this.ErrorMsgTop = 'Please select valid Guarantee periods.';
          document.getElementById('ddlGuarantee').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#ddlGuarantee")
          $('.validate-popup').delay(5000).fadeOut('slow');
      }


      if (this.Frequency === 'BIWEEKLY') {
          if (((parseFloat(this.Guarantee) / 2) > (this.Tenor / 3)) && this.TenorType === 'Month') {

              this.ErrorMsgTop = 'Guarantee period should be less than or equal to 1/3 of tenor.';
              document.getElementById('ddlGuarantee').classList.add('error');
              // Changed by Amogh K | 12 Apr 2022 | EULGTINT-123 | Assigned by Pranav D
              $('<div style="margin-left:5px;" class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#ddlGuarantee")
              $('.validate-popup').delay(5000).fadeOut('slow');
          }
      } else {
          if ((parseFloat(this.Guarantee) > (this.Tenor / 3)) && this.TenorType === 'Month') {

              this.ErrorMsgTop = 'Guarantee period should be less than or equal to 1/3 of tenor.';
              document.getElementById('ddlGuarantee').classList.add('error');
              // Changed by Amogh K | 12 Apr 2022 | EULGTINT-123 | Assigned by Pranav D
              $('<div style="margin-left:5px;" class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#ddlGuarantee")
              $('.validate-popup').delay(5000).fadeOut('slow');
          }
      }

      if (this.Frequency === 'BIWEEKLY') {
          if (((parseFloat(this.Guarantee) / 2) > ((this.Tenor * 12) / 3)) && this.TenorType === 'Year') {
              this.ErrorMsgTop = 'Guarantee period should be less than or equal to 1/3 of tenor.';
              document.getElementById('ddlGuarantee').classList.add('error');
              // Changed by Amogh K | 12 Apr 2022 | EULGTINT-123 | Assigned by Pranav D
              $('<div style="margin-left:5px;" class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#ddlGuarantee")
              $('.validate-popup').delay(5000).fadeOut('slow');
          }
      } else {
          if ((parseFloat(this.Guarantee) > ((this.Tenor * 12) / 3)) && this.TenorType === 'Year') {
              this.ErrorMsgTop = 'Guarantee period should be less than or equal to 1/3 of tenor.';
              document.getElementById('ddlGuarantee').classList.add('error');
              // Changed by Amogh K | 12 Apr 2022 | EULGTINT-123 | Assigned by Pranav D
              $('<div style="margin-left:5px;" class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#ddlGuarantee")
              $('.validate-popup').delay(5000).fadeOut('slow');
          }
      }

      // if (this.Tenor == 1 && this.TenorType === 'Year') {
      //     if (parseFloat(this.Guarantee) / 4) {

      //         this.ErrorMsgTop = 'Guarantee period should be less than or equal to 1/3 of tenor.';
      //         document.getElementById('ddlGuarantee').classList.add('error');
      //         $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#ddlGuarantee")
      //         $('.validate-popup').delay(5000).fadeOut('slow');
      //     }

      // }

      if ((this.Tenor == 0) || ((this.Tenor > 60 || (this.Tenor > this.tenorMaxMonth || this.Tenor < this.tenorMinMonth)) && this.TenorType === 'Month') || ((this.Tenor > 5 || (this.Tenor * 12 > this.tenorMaxMonth || this.Tenor * 12 < this.tenorMinMonth)) && this.TenorType === 'Year')) {

          // Changed by Amogh K | 29Apr2022 | tenor validation modified | assigned by Pranav D
          // this.ErrorMsgTop = 'Please enter valid tenor.';
          this.ErrorMsgTop = 'Please enter tenor between ' + this.tenorMinMonth + " to " +this.tenorMaxMonth +" months";
          document.getElementById('txtTenor').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtTenor")
          $('.validate-popup').delay(5000).fadeOut('slow');
      }
      // Pranav D JIRA EURLGTINT-5 7-Feb-2022 
      if (parseFloat(this.KO) > 98) {
          this.ErrorMsgTop = 'KO % should be less than or equal to 98';
      }


      if (this.SolveForvalue !== 'Strike' && parseFloat(this.Strike) < 102) {
          this.ErrorMsgTop = 'Strike (%) should be greater than or equal to 102';
          document.getElementById('txtStrike').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtStrike")
          $('.validate-popup').delay(5000).fadeOut('slow');
          // return false;
      }
      if (this.SolveForvalue !== 'Upfront' && (this.upfront === '' || parseFloat(this.upfront) <= 0 || parseFloat(this.upfront) > 100)) {

          this.ErrorMsgTop = 'Upfront (%) should be less than or equal to 100';
          document.getElementById('txtUpfront').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtUpfront")
          $('.validate-popup').delay(5000).fadeOut('slow');
      }

      // Added to check empty frequency or number of shares before pricing
      if (this.Frequency === '') {
          this.ErrorMsgTop = 'Please select frequency.';
          document.getElementById('ddlFrequency').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#ddlFrequency")
          $('.validate-popup').delay(5000).fadeOut('slow');
      }

      if (this.NoOfShare == 0 || this.NoOfShare === '') {
          this.ErrorMsgTop = 'Enter valid number of shares.';
          document.getElementById('idNoOfShare').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#idNoOfShare")
          $('.validate-popup').delay(5000).fadeOut('slow');
      }

      // $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter(".error")
      // $('.validate-popup').delay(5000).fadeOut('slow');
  } catch (error) {
      //console.log('Error', error);
  }
  return false;
}
setPrevQuoteData1(cloneData, viewOnly) {
  try {

      //console.log(cloneData);
      //Added by Amogh K | 18-mar-2022
      if (cloneData.MinNotional[0] && cloneData.MinInvst[0] && parseFloat(cloneData.MinNotional[0]) !== 0 && parseFloat(cloneData.MinInvst[0]) !== 0 && cloneData.MinNotional[0] !== '' && cloneData.MinInvst[0] !== '')
          this.minNotional = parseFloat(cloneData.MinNotional[0]) < parseFloat(cloneData.MinInvst[0]) ? parseFloat(cloneData.MinInvst[0]) : parseFloat(cloneData.MinNotional[0]);
      else
          this.minNotional = 250000.00;
      this.maxNotional = cloneData.MaxNotional[0] && parseFloat(cloneData.MaxNotional[0]) !== 0 && cloneData.MaxNotional[0] !== '' ? parseFloat(cloneData.MaxNotional[0]) : 5000000.00;
      // this.buttonList = cloneData.Actions[0];
      // this.ddlNoteCcy = cloneData.InputSettlementCurrency[0];
      // this.format = cloneData.InputProductFormatType[0];
      this.SolveForvalue = cloneData.SolveFor[0];
      // const share1 = { Name: cloneData.SN1_Custom[0] }; 
      const share1 = { Name: cloneData.ShareCode[0] }; // Azure change
      // const share2 = { Name: cloneData.SecondUnderlyingCode1[0] };
      // const share3 = { Name: cloneData.ThirdUnderlyingCode1[0] };
      // const share4 = { Name: cloneData.FourthUnderlyingCode1[0] };
      // const share5 = { Name: cloneData.FifthUnderlyingCode1[0] };
      this.ShareBasket = [];
      this.SelectedUnderlyingarray = [];
      this.SelectedUnderlyingBasketArray = [];
      /* if (cloneData.SN1_Custom[0] !== undefined && cloneData.SN1_Custom[0] !== '') {
           if (this.ShareBasket.find(i => i.Code === cloneData.SN1_Custom[0]) === undefined) {
               // this.ShareBasket.push({ Code: cloneData.SN1_Custom[0] });
               // // this.SelectedUnderlyingBasket.UnderlyingOne['Code']=cloneData.FirstUnderlyingCode1[0];
               // this.setSelectedUnderlyingarray('', '', cloneData.SN1_Custom[0], '', '', '', '', '', '', '', '');


               var index = this.shares.findIndex(shareItem => shareItem.BloombergCode == cloneData.SN1_Custom[0])
               if (index >= 0) {
                   const shareCode = this.shares[index].Code;
                   this.showUnderlying('', SearchUnderlyingPipe.prototype.transform(this.shares, shareCode)[0]);
               }
           }
       }// Azure change */
      // Azure change
      if (cloneData.ShareCode[0] !== undefined && cloneData.ShareCode[0] !== '') {
          if (this.ShareBasket.find(i => i.Code === cloneData.ShareCode[0]) === undefined) {
              // this.ShareBasket.push({ Code: cloneData.SN1_Custom[0] });
              // // this.SelectedUnderlyingBasket.UnderlyingOne['Code']=cloneData.FirstUnderlyingCode1[0];
              // this.setSelectedUnderlyingarray('', '', cloneData.SN1_Custom[0], '', '', '', '', '', '', '', '');
              var index = this.shares.findIndex(shareItem => shareItem.BloombergCode == cloneData.ShareCode[0])
              if (index >= 0) {
                  const shareCode = this.shares[index].Code;
                  this.showUnderlying('', SearchunderlyingPipe.prototype.transform(this.shares, shareCode)[0]);
              }
          }
      }
      // if (cloneData.SecondUnderlyingCode1[0] !== undefined && cloneData.SecondUnderlyingCode1[0] !== '') {
      //     this.ShareBasket.push({ Code: cloneData.SecondUnderlyingCode1[0] });
      //     this.setSelectedUnderlyingarray('', '', cloneData.SecondUnderlyingCode1[0], '', '', '', '', '', '', '');
      // }
      // if (cloneData.ThirdUnderlyingCode1[0] !== undefined && cloneData.ThirdUnderlyingCode1[0] !== '') {
      //     this.ShareBasket.push({ Code: cloneData.ThirdUnderlyingCode1[0] });
      //     this.setSelectedUnderlyingarray('', '', cloneData.ThirdUnderlyingCode1[0], '', '', '', '', '', '', '');
      // }
      // if (cloneData.FourthUnderlyingCode1[0] !== undefined && cloneData.FourthUnderlyingCode1[0] !== '') {
      //     this.ShareBasket.push({ Code: cloneData.FourthUnderlyingCode1[0] });
      //     this.setSelectedUnderlyingarray('', '', cloneData.FourthUnderlyingCode1[0], '', '', '', '', '', '', '');
      // }
      // if (cloneData.FifthUnderlyingCode1[0] !== undefined && cloneData.FifthUnderlyingCode1[0] !== '') {
      //     this.ShareBasket.push({ Code: cloneData.FifthUnderlyingCode1[0] });
      //     this.setSelectedUnderlyingarray('', '', cloneData.FifthUnderlyingCode1[0], '', '', '', '', '', '', '');
      // }
      // this.IBPrice = cloneData.InputInterBankPrice[0];
      // this.NoOfShare = cloneData.NoOfShares[0]; // Azure change
      this.NoOfShare = cloneData.DailyNoOfShares[0];  // Azure change
      // this.issuePrice = cloneData.InputIssuePricePercent[0];



      // Barrier
      // this.barrierType = cloneData.StaticKIBarrierType[0];
      // this.barrierLevel = cloneData.InitialInputKIBarrierPercent[0];
      this.Strike = cloneData.Strike[0];

      this.chkLeverage = cloneData.LeveragedYN[0] === 'True' ? true : false;
      this.KO = cloneData.KO[0];
      // this.Guarantee = cloneData.GuaranteedPeriod[0]; // Azure change
      this.Guarantee = cloneData.GuaranteedDuration[0];  // Azure change
      // this.Frequency = cloneData.ELN_Frequency[0];  // Azure change
      this.Frequency = cloneData.Frequency[0]; // Azure change
      // this.upfront = cloneData.Upfront[0]; 
      // this.upfront = cloneData.Upfront_Perc[0]; // Azure change
      this.upfront = cloneData.Upfront[0]; // Azure change

      // this.Tenor = cloneData.ActualTenor[0].substr(0, cloneData.ActualTenor[0].length - 1); // Azure change
      // this.TenorType = cloneData.ActualTenor[0].substr(cloneData.ActualTenor[0].length - 1, 1) === 'M' ? 'Month' : 'Year'; // Azure change

      this.Tenor = cloneData.Tenor[0].substr(0, cloneData.Tenor[0].length - 1); // Azure change
      this.TenorType = cloneData.Tenor[0].substr(cloneData.Tenor[0].length - 1, 1) === 'M' ? 'Month' : 'Year'; // Azure change
      this.orderID = cloneData.BBVAIDcsv[0].trim().split(',')[0].trim();
      this.orderStatus = cloneData.Status[0];
      // var idx = this.shares.findIndex(i => i.BloombergCode == cloneData.SN1_Custom[0] || i.Code == cloneData.SN1_Custom[0]); // Azure Change
      var idx = this.shares.findIndex(i => i.BloombergCode == cloneData.ShareCode[0] || i.Code == cloneData.ShareCode[0]); // Azure change
      //console.log(idx);
      // const sharecode = this.shares[this.shares.findIndex(i => i.BloombergCode === cloneData.SN1_Custom[0])].Code;
      // const eCode = this.shares[this.shares.findIndex(i => i.BloombergCode === cloneData.SN1_Custom[0])].ExchangeCode;
      if (idx > -1) {
          const sharecode = this.shares[idx].Code;
          const eCode = this.shares[idx].ExchangeCode;

          this.shareCode = sharecode;
          this.exchngCode = eCode;
          // this.calculateNotional(sharecode, eCode, cloneData.NoOfShares[0]); // Azure change
          this.calculateNotional(sharecode, eCode, cloneData.DailyNoOfShares[0]); // Azure change
      }
      if (viewOnly) {
          // Removed client book mapping || PriyaL || 22Apr2022 || Assigned by Pranav D
          // this.onBehalfOf = cloneData.InputOnBehalfOfBook[0]; // Azure change
          // this.onBehalfOf = cloneData.OnBehalfOf[0]; // Azure change
          // this.GetClientProdDetailsArr = this.EcHome.GetClientProdDetails(this.onBehalfOf);
          // if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
          //     if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix') > -1) {
          //         this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix')].CPM_Format).toString().split(',');
          //         this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix')].ActiveYN;
          //         //console.log(this.mappedformatlist, this.priceBtnActive);
          //     } else {
          //         if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All') > -1) {
          //             this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].CPM_Format).toString().split(',');
          //             this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].ActiveYN;
          //             //console.log(this.mappedformatlist, this.priceBtnActive);
          //         }
          //     }
          // }

          this.rfqID = cloneData.RFQIDcsv[0].trim().substring(0, cloneData.RFQIDcsv[0].length - 2);
          this.noteMasterID = cloneData.Note_Master_Id[0];
          this.NoteMasterID = cloneData.Note_Master_Id[0];
          this.sortedAllPrices = [{
              Price: (cloneData.SolveForValue[0] === '' && this.orderID !== '')
                  ? 'Rejected' : cloneData.SolveForValue[0], solveFor: cloneData.SolveFor[0]
          }];


          //console.log(cloneData.RFQIDcsv[0]);
          //console.log(cloneData.RFQIDcsv[0].trim().split(','));
          this.priceProvidersArr = [];
          for (let i = 0; i < cloneData.RFQIDcsv[0].trim().split(',').length - 1; i++) {
              this.priceProvidersArr.push(
                  {
                      lp: cloneData.Counterparty[0].trim().split(',')[i].trim(),
                      rfq: cloneData.RFQIDcsv[0].trim().split(',')[i].trim(),
                      price: (cloneData.BestValue[0].trim().split(',')[i].trim() === '0' || cloneData.BestValue[0].trim().split(',')[i].trim() === '')
                          ? '-' : cloneData.BestValue[0].trim().split(',')[i].trim(),
                      bestPriceFlag: cloneData.BESTPriceFlag[0] ? cloneData.BESTPriceFlag[0].trim().split(',')[i].trim() : '',
                      //   BESTPriceFlag
                      id: cloneData.BBVAIDcsv[0].trim().split(',')[i].trim(),
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

          //   this.orderID = cloneData.BBVAID[0];**********
          //   this.NoteMasterID = this.sortedAllPrices[0].NoteMasterID;

          //   this.orderStatus = this.sortedAllPrices[0].status;
          //console.log(this.sortedAllPrices);

          switch (cloneData.SolveFor[0]) {
              case 'Strike':
                  this.Strike = this.sortedAllPrices[0].Price; //cloneData.SolveForValue[0]; //
                  this.replySolveFor = 'Strike';
                  break;
              case 'Upfront':
                  this.upfront = this.sortedAllPrices[0].Price; //cloneData.SolveForValue[0]; //
                  this.replySolveFor = 'Upfront';
                  break;

          }


          // NoteMasterID: "23510"
          // Price: "8.56"
          // id: "13910"
          // lp: "BBVA IB"
          // rfq: "1022814"
          // solveFor: "Coupon"
          // status: "OK"

          if (this.sortedAllPrices && this.sortedAllPrices[0]) {
              var idx = this.priceProvidersArr.findIndex(item => item.lp == this.sortedAllPrices[0].lp);
              // array_move(this.priceProvidersArr, idx, 0)
              this.bestLPArray = this.priceProvidersArr[idx];
              this.bestLPArray.idx = idx

          }
      }
      if (this.Strike !== '') {
          if (parseFloat(this.Strike) !== 100.00) {
              this.LeverageFlag = true;
          } else {
              this.LeverageFlag = false;
          }
      } else {
          this.LeverageFlag = true;
      }
  } catch (error) {
      //console.log('Error', error);
  }
}

    async setSaveQuoteData(cloneData, viewOnly) {
  try {

      // Removed client book mapping || PriyaL || 22Apr2022 || Assigned by Pranav D

      // this.onBehalfOf = cloneData.onBehalfOf;
      // this.GetClientProdDetailsArr = this.EcHome.GetClientProdDetails(this.onBehalfOf);
      // if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
      //     if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix') > -1) {
      //         this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix')].CPM_Format).toString().split(',');
      //         this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix')].ActiveYN;
      //         //console.log(this.mappedformatlist, this.priceBtnActive);
      //     } else {
      //         if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All') > -1) {
      //             this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].CPM_Format).toString().split(',');
      //             this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].ActiveYN;
      //             //console.log(this.mappedformatlist, this.priceBtnActive);
      //         }
      //     }
      // }
      this.ddlNoteCcy = cloneData.Ccy;
      this.format = cloneData.FormatDetails;
      this.SolveForvalue = cloneData.SolveFor;
      // this.ShareBasket = [];
      // if (cloneData.Share.indexOf('##') !== -1) {
      //     // tslint:disable-next-line: prefer-for-of
      //     for (let i = 0; i < cloneData.Share.split('##')[0].split('#').length; i++) {
      //         this.ShareBasket.push({ Code: cloneData.Share.split('##')[0].split('#')[i] });
      //         // this.SelectedUnderlyingBasket.UnderlyingOne['Code']=cloneData.FirstUnderlyingCode1[0];
      //         this.setSelectedUnderlyingarray('', '', cloneData.Share.split('##')[0].split('#')[i], '', '', '', '', '', '', '', '');
      //     }
      // }
      this.ShareBasket = [];
      // Added by Amogh K | 16-Mar-2022
      this.SelectedUnderlyingBasket = [];
      this.SelectedUnderlyingBasketArray = [];
      this.SelectedUnderlyingarray = [];
      if (cloneData.Share.indexOf('##') !== -1) {
          for (let i = 0; i < cloneData.Share.split('##')[0].split('#').length; i++) {
              this.shareCode = cloneData.Share.split('##')[0].split('#')[i];
              this.showUnderlying('', SearchunderlyingPipe.prototype.transform(this.shares, this.shareCode)[0]);
          }
      } else {
          for (let i = 1; i < 7; i++) {
              this.shareCode = cloneData.ShareBBGRIC1;
              //console.log('sharecode', this.shareCode);
              this.showUnderlying('', SearchunderlyingPipe.prototype.transform(this.shares, this.shareCode)[0]);
          }
      }
      this.IBPrice = cloneData.IBPrice;
      // this.Notional = this.EcCommon.formatNotional(cloneData.TotalNotional);
      this.issuePrice = cloneData.IssuePrice;

      this.Tenor = cloneData.TenorPer;
      this.TenorType = cloneData.TenorType;
      this.Frequency = cloneData.Frequency;

      this.KO = await this.EcCommon.formatNotional(cloneData.KOPer);
      this.NoOfShare = cloneData.SharesQuantity;
      // changes done by Pranav D 23-Feb-2022 to calculate notional as per spot rate on loading template
      let shareCode = this.shares[this.shares.findIndex(i => i.BloombergCode === cloneData.ShareBBGRIC1)].Code
      this.calculateNotional(shareCode, this.exchngCode, this.NoOfShare);

      this.Strike = cloneData.Strike; // load template issue || asigned by pranav || 07Mar2022
      this.upfront = cloneData.Upfront;
      this.Guarantee = cloneData.Guarantee;
      if (cloneData.LeverageYN === 'Y' || cloneData.LeverageYN === 'Yes') { // load template issue || asigned by pranav || 07Mar2022
          this.LeverageYN = 'Yes';
          this.chkLeverage = true;
      }
      else {
          this.LeverageYN = 'No';
          this.chkLeverage = false;
      }

       //Added by ApurvaK|| 18-Dec-2023|| FIN1EURINT-688
       if(cloneData.ComputedStrikeFixingLag == 'Forward'){
        this.stkdate = cloneData.StrikeShifterDate;
      }
      else{
        this.stkdate = '';
      }
      
      if (viewOnly) {
          // this.stkdate = cloneData.StrikeDate.split(' ')[0];
          // this.settdate = cloneData.PaymentDate.split(' ')[0];
          // this.expdate = cloneData.ExpiryDate.split(' ')[0];
          // this.stkshift = cloneData['ComputedStrikeFixingLag'];
          // this.paymentshift = cloneData['ComputedSettlementPeriodSoftTenor'];
          // this.expshift = cloneData['ComputedPayoffSoftTenor'];

          // this.orderID = cloneData['BBVAID'];
          // this.orderStatus = cloneData['Status'];
          this.rfqID = '';
          this.noteMasterID = '';

          this.replySolveFor = cloneData.RFQID;
          this.sortedAllPrices = [];
      } else {
          switch (this.SolveForvalue) {
              case 'Strike':
                  this.Strike = '';
                  break;
              case 'Upfront':
                  this.upfront = '';
                  break;
              case 'IBPrice':
                  this.IBPrice = '';
                  break;
              case 'Coupon':
                  this.cpnCoupon = '';
                  break;
              case 'KO':
                  this.autoTrigger = '';
                  break;
              case 'RebateCoupon':
                  this.autocallCoupon = '';
                  break;
              case 'CouponBarrier':
                  this.cpnTrigger = '';
                  break;
              case 'KI':
                  this.barrierLevel = '';
                  break;
              case 'FundingRate':
                  this.fundRate = '';
                  break;
          }
      }

      // if (this.Strike !== '') {
      //     if (parseFloat(this.Strike) !== 100.00) {
      //         this.LeverageFlag = true;
      //     } else {
      //         this.LeverageFlag = false;
      //     }
      // } else {
      //     this.LeverageFlag = true;
      // }

  } catch (error) {
      //console.log('Error', error);
  }
}

changeAutocallCpn() {
  try {
      this.reset();
      if (this.autocallCouponYN === 'Y') {
          this.autocallCoupon = '0.00';
      } else {
          this.autocallCoupon = '';
      }
  } catch (error) {
      //console.log('Error', error);
  }
}
changeAutoStepDown() {
  try {
      if (this.autoStepDownYN === 'Y') {
          this.autoStepDown = '0.00';
      } else {
          this.autoStepDown = '';
      }
  } catch (error) {
      //console.log('Error', error);
  }
}
changeAutoNonCall() {
  try {
      this.reset();
      if (this.autoNonCallYN === 'Y') {
          this.autoNonCall = '0';
      } else {
          this.autoNonCall = '';
      }
  } catch (error) {
      //console.log('Error', error);
  }
}

onclickShareBasket(item: any) {
  console.log(item)
  // open dotnet popup base
  //window.open("https://euroconnect.test-equity-connect.com/FinIQWebApp/Technical_Charts/Technical_Charts.aspx?Bloomberg="+ item.Code + "&FIGI=&ISIN=&LongName=" + item.LongName + "&RIC=" + item.RICCode + "&Master_Popup=POPUP", "_blank", "");
  return false;
}

async RequestTermsheet() {
  try {
      this.TSFlag = false;
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
      // const errorMsg = this.EcHome.termsheetSender(this.orderID, this.onBehalfOf, this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator', this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator', 'TS');
      const errorMsg: any= await this.EcHome.termsheetSender(this.orderID, '', this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator', this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator', 'TS');

      if (errorMsg === '') {
          this.reqSuccessMsg = 'Requested.';

          let TSTimeLeft = this.TSTimeout;

          const that = this;
          this.TSInterval = setInterval(async () => {
              if (TSTimeLeft > 0) {
                  const res : any= await this.EcHome.ViewTermsheet(that.sortedAllPrices[0].rfq, 'IndicativeTermsheet');
                  if (res !== null && res !== undefined) {
                      if (res.Status.toString().toUpperCase() === 'SUCCESS') {
                          that.TSFlag = true;
                          TSTimeLeft = 0;
                          clearInterval(that.TSInterval);
                          that.reqSuccessMsg = 'Received.';

                      } else {
                          that.TSFlag = false;
                          TSTimeLeft = TSTimeLeft - 10;
                      }

                  } else {
                      that.TSFlag = false;
                      TSTimeLeft = TSTimeLeft - 10;
                  }
              } else if (TSTimeLeft === 0 && that.TSFlag === false) {
                  // that.ErrorMsgTop = "Termsheet response is taking longer time than expected. Please try again later.";
                  // tslint:disable-next-line: max-line-length
                  that.ErrorMsgTop = 'Termsheet response is taking longer than expected hence Termsheet will not display on this screen.\n Instead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section.';
                  clearInterval(that.TSInterval);
              }
          }, 10000);
      } else {
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
      this.ErrorMsgTop = ''
      const res: any = await this.EcHome.ViewTermsheet(this.sortedAllPrices[0].rfq, 'IndicativeTermsheet');

      if (res?.length) {
        //<Sudarshan | base64 to Bytes>
        const downloadLink = document.createElement('a');
        res.forEach(function (item: any) {
          if (item.Status.toString().toUpperCase() === 'SUCCESS') {
            let fileName = item.Document_Output_Path;
            downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
            downloadLink.download = fileName;
            downloadLink.click();
          }
          else {
            this.ErrorMsgTop = item.Status.toString();
          }
        });
        //</Sudarshan | base64 to Bytes>  

      } else {
          this.ErrorMsgTop = 'Termsheet not available. Please try again later.';

      }
  } catch (error) {
      //console.log('Error', error);
  }
  return false;
}

async RequestKIDonView() {
  try {
      this.TSFlag = false;
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
      // const errorMsg = this.EcHome.termsheetSender(this.sortedAllPrices[0].id, this.onBehalfOf, 'AutocallablePhoenix', 'AutocallablePhoenix', 'KID');
      const errorMsg : any= await this.EcHome.termsheetSender(this.sortedAllPrices[0].id, '', 'AutocallablePhoenix', 'AutocallablePhoenix', 'KID');
      if (errorMsg === '') {
          // this.reqSuccessMsg = 'Requested.';
          this.sortedAllPrices[0].Msg = 'KID Requested.';
          let TSTimeLeft = this.TSTimeout;

          const that = this;
          that.TSInterval = setInterval(async () => {
              if (TSTimeLeft > 0) {
                  const res : any = await this.EcHome.ViewTermsheet(that.sortedAllPrices[0].rfq, 'Kid');//Apurva K|| FIN1EURINT-385|| 23-May-2023
                  if (res !== null && res !== undefined) {
                      if (res.Status.toString().toUpperCase() === 'SUCCESS') {
                          that.sortedAllPrices[0].KIDFlag = true;
                          TSTimeLeft = 0;
                          clearInterval(that.TSInterval);
                          // that.reqSuccessMsg = 'Received.';
                          that.sortedAllPrices[0].Msg = 'KID Received.';

                      } else {
                          that.sortedAllPrices[0].KIDFlag = false;
                          TSTimeLeft = TSTimeLeft - 10;
                      }

                  } else {
                      that.sortedAllPrices[0].KIDFlag = false;
                      TSTimeLeft = TSTimeLeft - 10;
                  }
              } else if (TSTimeLeft === 0 && that.sortedAllPrices[0].KIDFlag === false) {
                  // that.ErrorMsg = "Termsheet response is taking longer time than expected. Please try again later.";
                  // tslint:disable-next-line: max-line-length
                  that.ErrorMsg = 'KID response is taking longer than expected hence KID will not display on this screen.\n Instead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section.';
                  clearInterval(that.TSInterval);
              }
          }, 10000);
      } else {
          // this.reqSuccessMsg = 'TS Request Failed.';
          this.sortedAllPrices[0].Msg = 'KID Request Failed.';
      }

      return false;
  } catch (error) {
      return false;
      //console.log('Error:', error);
  }
}

async ViewKIDonView() {
  try {
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      const res :any = await this.EcHome.ViewTermsheet(this.sortedAllPrices[0].rfq, 'Kid');//Apurva K|| FIN1EURINT-385|| 23-May-2023

     if (res?.length) {
       //<Sudarshan | base64 to Bytes>
       const downloadLink = document.createElement('a');
       res.forEach(function (item : any) {
         if (item.Status.toString().toUpperCase() === 'SUCCESS') {
           let fileName = item.Document_Output_Path;
           downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
           downloadLink.download = fileName;
           downloadLink.click();            
         }
         else {
           this.ErrorMsgTop = item.Status.toString();
         }
       });
       //</Sudarshan | base64 to Bytes>  

      } else {
          this.ErrorMsgTop = 'KID not available. Please try again later.';

      }
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

setFocus() {
  this.namefield.nativeElement.focus();
}

cloneSinglePricer() {
  this.viewOnly = false;
  this.viewRFQ = '';
  this.buttonList = 'Clone,View,';
  this.reset();
}

changeAutoFreq() {

  this.autoFreq = '';
  this.autoNonCall = '';
  if (this.autocallCouponType === 'Constant Barrier') {

  } else if (this.autocallCouponType === 'Variable Barrier') {

  } else if (this.autocallCouponType === 'Callable by the Issuer') {

  } else if (this.autocallCouponType === 'Putable by the Investor') {

  }
  this.cpnType = 'Snowball';
  this.cpnTypeChange();
}

strikeChange() {
  if (this.Strike !== '') {
      if (parseFloat(this.Strike) !== 100.00) {
          this.LeverageYN = 'Yes';
          this.LeverageFlag = true;
      } else {
          this.LeverageYN = 'No';
          this.LeverageFlag = false;
      }
  } else {
      this.LeverageYN = 'Yes';
      this.LeverageFlag = true;
  }
}

txtTenorDateChange(type: any) {
  try {
      let strDate = '';
      if (type === 'Payment') {
          this.Dates = this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.paymentshift === 'Custom' ? '' : this.paymentshift), this.stkdate);
          strDate = this.EcCommon.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
          // }
          this.settdate = strDate;

          this.Dates = this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
          this.expdate = this.EcCommon.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
      }
      if (type === 'Expiry') {

          this.Dates = this.EcHome.BBVAGetDates(this.ddlNoteCcy, (this.expshift === 'Custom' ? this.customTenor : this.expshift), this.settdate);
          strDate = this.EcCommon.formatDate(this.Dates.MaturityDate);
          // this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');

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
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtsettdate")
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

changeAutoFreqOnTenor() {
  try {

      this.autoFreqArr = [];
      this.priceBtnActive = 'Y'; //Remove multiple clicks pn Price button
      const str = (this.expshift === 'Custom' ? this.customTenor : this.expshift) + '';
      // //console.log(str);
      if (str.toUpperCase() === 'M' || str.toUpperCase() === 'Y' || str.toUpperCase() === 'D') {
          this.autoFreqArr.push('1m');
          this.autoFreq = '1m';
      } else if (str.substr(str.length - 1, 1).toUpperCase() === 'M'
          || str.substr(str.length - 1, 1).toUpperCase() === 'Y'
          || str.substr(str.length - 1, 1).toUpperCase() === 'D') {
          const shiftChar = str.substr(str.length - 1, 1).toUpperCase();
          // tslint:disable-next-line: radix
          const shiftNum = parseInt(str.substr(0, str.length - 1));
          // //console.log(shiftChar, shiftNum);
          const month = (shiftChar === 'Y') ? (12 * shiftNum) :
              (shiftChar === 'D') ? (Math.round(shiftNum / 30)) : shiftNum;
          // //console.log(month);
          if (month === 0 || month === 1) {
              this.autoFreqArr.push('1m');
          } else {
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < this.freqArr.length; i++) {
                  // tslint:disable-next-line: radix
                  const freq = parseInt(this.freqArr[i].substring(0, this.freqArr[i].length - 1));
                  if (freq < month) {
                      this.autoFreqArr.push(this.freqArr[i]);
                  }
              }
          }
          const autoFreqNum = this.autoFreq.toString().substring(0, this.autoFreq.length - 1);
          // if (month < 4) {
          //   this.autoFreq = '1m';
          // } else {
          //   this.autoFreq = '3m';
          // }
          if (month < autoFreqNum) {
              if (month === 2) {
                  this.autoFreq = '1m';
              } else {
                  this.autoFreq = '3m';

              }
          }
      } else {
          this.autoFreqArr = this.freqArr;
          this.autoFreq = '3m';
      }
  } catch (error) {

  }
}

getNoncall() {
  // tslint:disable-next-line: radix
  const val = parseInt(this.autoNonCall) + 1;
  return val === 1 ? val + 'st' : (val === 2 ? val + 'nd' : (val === 3 ? val + 'rd' : val + 'th'));
}

async GetTriggerValue(type: any) {

  if (type === 'autoTrigger') {
    await  this.EcHome.GetTriggerValues((this.expshift === 'Custom' ? this.customTenor : this.expshift), this.autoFreq,
          this.autoTrigger, this.autoStepDown, this.autoNonCall).then((data)=>{this.TriggerValueArr=data});//Changed by Jyoti S || 14-Apr-2023
      //console.log(this.TriggerValueArr);
      this.autoTriggerPopup = true;
      this.cpnTriggerPopup = false;
      this.fundRatePopup = false;
  }

  if (type === 'cpnTrigger') {
    await   this.EcHome.GetTriggerValues((this.expshift === 'Custom' ? this.customTenor : this.expshift), this.cpnFreq,
          this.cpnTrigger, '', '').then((data)=>{this.TriggerValueArr=data});//Changed by Jyoti S || 14-Apr-2023
      //console.log(this.TriggerValueArr);
      this.autoTriggerPopup = false;
      this.cpnTriggerPopup = true;
      this.fundRatePopup = false;
  }
  if (type === 'fundRate') {
    await  this.EcHome.GetTriggerValues((this.expshift === 'Custom' ? this.customTenor : this.expshift), this.fundFreq,
          this.fundRate, '', '').then((data)=>{this.TriggerValueArr=data});//Changed by Jyoti S || 14-Apr-2023
      //console.log(this.TriggerValueArr);
      this.autoTriggerPopup = false;
      this.cpnTriggerPopup = false;
      this.fundRatePopup = true;
  }
}

onClickedOutside(type: any) {
  if (type === 'autoTrigger') {
      this.autoTriggerPopup = false;

  }

  if (type === 'cpnTrigger') {
      this.cpnTriggerPopup = false;

  }
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

monthSelected(_date: Moment) {
    //console.log('month changed');
  }

dateChanged() {
  this.scheduleMsg = '';
  this.ErrorMsgTop = '';
  // this.calendar.activeDate = this.selectedDate;
  this.inputDate = this.selectedDate.format('DD-MMM-YYYY');
  this.inputTime = this.selectedDate.format('HH:mm');
  //console.log(this.inputTime);

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
    console.log(e)
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
    console.log(e)
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
      console.log('Error', Error , e);
  }
}

showUser(event, item) {
  try {
    console.log(event)
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
      if (!this.EcCommon.validTime(this.EcCommon.getInputTime(this.inputTime))) {
          this.ErrorMsgTop = 'Please enter valid time in hh:mm (am/pm) format';
          $('#loading').hide();
          return false;
      } else {
          this.ErrorMsgTop = '';
      }
      this.validationOnButton();
      const sDate = new Date(this.inputDate + ' ' + this.EcCommon.getInputTime(this.inputTime));
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
          this.portfolioGroupID = this.EcHome.fnportfolioGroupID();
          const xmlstr = this.generateXML();
          // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
          // const res = this.EcHome.SchedulePrice(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator', xmlstr,
          //     sDate, 'SINGLE_PRICER', this.portfolioGroupID, timeinsecs, 'BBVA', this.SolveForvalue, this.allBooksData[this.allBooksData.findIndex(x => x.BookCode === this.onBehalfOf)].BookName);
          const res = this.EcHome.SchedulePrice(this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator', xmlstr,
              sDate, 'SINGLE_PRICER', this.portfolioGroupID, timeinsecs, 'BBVA', this.SolveForvalue, '');
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

startCountDown(sec, index) {

  let starttime = new Date().getTime();
  let counter = sec;
  //console.log(this.priceProvidersArr);

  this.priceProvidersArr[index].timeStartFlag = true;
  this.priceProvidersArr[index].interval1 = setInterval(() => {
      ////console.log( counter);  
    //   if (this.priceProvidersArr.length <= 0) {
    //       clearInterval(this.priceProvidersArr[index].interval1);
    //       this.priceProvidersArr[index].price = 'Timeout';
    //   }
      if (this.priceProvidersArr[index].price != '-' ) {//Changed by Varsha G || For starting timer after LP quote response received || 13-Apr-2023
          this.priceProvidersArr[index].timer = counter;
          counter--;
      }
      if (counter < 0) {
          clearInterval(this.priceProvidersArr[index].interval1);
        //   if (this.priceProvidersArr[index].rfq === '') {

        //       this.priceProvidersArr[index].price = 'Timeout';
        //   }

          this.priceProvidersArr[index].timeStartFlag = false;
      };
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
      let timediff = (curtime - starttime) / 1000

      // //console.log('1234',starttime, curtime , parseInt(((curtime  - starttime)/1000).toString())) 

      if (timediff !== counter) {
          //counter = this.defaultTimeout - timediff;// Commented by Varsha G || 13-Apr-2023 || To prevent counter decrement before LP Quote response received. 
          if ((this.defaultRFQTimeout  - timediff) < 0) {
              //counter = 0;
              this.loadflag = false;
              clearInterval(this.interval);
            //   for (let i = 0; i < this.priceProvidersArr.length; i++) {
            //       if (this.priceProvidersArr[i].price === '-') {
            //           //this.priceProvidersArr[i].price = 'Timeout'//Code commented by Varsha G || 13-Apr-2023 || Suggested by Sudarshan P 
            //           this.priceBtnActive = 'Y'
            //           this.priceProvidersArr[i].loadFlag = false
            //       }
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

    async RequestKID(index: any) {
  try {
      this.TSFlag = false;
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
      // const errorMsg = this.EcHome.termsheetSender(this.priceProvidersArr[index].id, this.onBehalfOf, this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator', this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator', 'KID');
      const errorMsg : any= await this.EcHome.termsheetSender(this.priceProvidersArr[index].id, '', this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator', this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator', 'KID');
      if (errorMsg === '') {
          // this.reqSuccessMsg = 'Requested.';
          this.priceProvidersArr[index].Msg = 'KID Requested.';
          let TSTimeLeft = this.TSTimeout;

          const that = this;
          that.TSInterval = setInterval(() => {
              if (TSTimeLeft > 0) {
                  const res : any = this.EcHome.ViewTermsheet(that.priceProvidersArr[index].rfq, 'Kid');//Apurva K|| FIN1EURINT-385|| 23-May-2023
                  if (res !== null && res !== undefined) {
                      if (res.Status.toString().toUpperCase() === 'SUCCESS') {
                          that.priceProvidersArr[index].KIDFlag = true;
                          TSTimeLeft = 0;
                          clearInterval(that.TSInterval);
                          // that.reqSuccessMsg = 'Received.';
                          that.priceProvidersArr[index].Msg = 'KID Received.';

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
                  that.ErrorMsgTop = 'KID response is taking longer than expected hence KID will not display on this screen.\n Instead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section.';
                  clearInterval(that.TSInterval);
              }
          }, 10000);
      } else {
          // this.reqSuccessMsg = 'TS Request Failed.';
          this.priceProvidersArr[index].Msg = 'KID Request Failed.';
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
      const res: any = await this.EcHome.ViewTermsheet(this.priceProvidersArr[index].rfq, 'Kid');//Apurva K|| FIN1EURINT-385|| 23-May-2023
      if (res?.length) {
       //<Sudarshan | base64 to Bytes>
       const downloadLink = document.createElement('a');
       res.forEach(function (item : any) {
         if (item.Status.toString().toUpperCase() === 'SUCCESS') {
           let fileName = item.Document_Output_Path;
           downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
           downloadLink.download = fileName;
           downloadLink.click();            
         }
          else {
           this.ErrorMsgTop = item.Status.toString();
         }
       });
       //</Sudarshan | base64 to Bytes>      

      } else {
          this.ErrorMsgTop = 'KID not available. Please try again later.';

      }
  } catch (error) {
      //console.log('Error', error);
  }
  return false;
}

RequestTS(index: any) {
  try {
      this.TSFlag = false;
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
      // const errorMsg = this.EcHome.termsheetSender(this.priceProvidersArr[index].id, this.onBehalfOf, this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator',

      const errorMsg : any= this.EcHome.termsheetSender(this.priceProvidersArr[index].id, '', this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator',
          this.templateMappingArr.length > 0 ? this.templateMappingArr[0].subTemplate : 'Decumulator', 'TS');
      if (errorMsg === '') {

          this.priceProvidersArr[index].TSMsg = 'TS Awaited.';
          this.priceProvidersArr[index].TSFlag = true;  //Added by Apurva K|| 22-May-2023||FIN1EURINT-359

          let TSTimeLeft = this.TSTimeout;

          const that = this;
          that.TSInterval = setInterval(() => {
              if (TSTimeLeft > 0) {
                  const res: any = this.EcHome.ViewTermsheet(that.priceProvidersArr[index].rfq, 'IndicativeTermsheet');
                  if (res !== null && res !== undefined) {
                      if (res.Status.toString().toUpperCase() === 'SUCCESS') {
                          that.priceProvidersArr[index].TSFlag = true;
                          TSTimeLeft = 0;
                          clearInterval(that.TSInterval);
                          // that.reqSuccessMsg = 'Received.';
                          that.priceProvidersArr[index].TSMsg = 'TS Received.';

                      } else {
                          that.TSFlag = false;
                          TSTimeLeft = TSTimeLeft - 10;
                      }

                  } else {
                      that.priceProvidersArr[index].TSFlag = false;
                      TSTimeLeft = TSTimeLeft - 10;
                  }
              } else if (TSTimeLeft === 0 && that.priceProvidersArr[index].TSFlag === false) {
                  // that.ErrorMsg = "Termsheet response is taking longer time than expected. Please try again later.";
                  // tslint:disable-next-line: max-line-length
                  that.ErrorMsgTop = 'Termsheet response is taking longer than expected hence Termsheet will not display on this screen.\n Instead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section.';
                  clearInterval(that.TSInterval);
              }
          }, 10000);
      } else {
          // this.reqSuccessMsg = 'TS Request Failed.';
          this.priceProvidersArr[index].TSMsg = 'TS Request Failed.';
      }

      return false;
  } catch (error) {
      return false;
      //console.log('Error:', error);
  }
}

async ViewTS(index: any) {
  try {
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      const res : any= await this.EcHome.ViewTermsheet(this.priceProvidersArr[index].rfq, 'IndicativeTermsheet');

     if (res?.length) {
       //<Sudarshan | base64 to Bytes>
       const downloadLink = document.createElement('a');
       res.forEach(function (item : any) {
         if (item.Status.toString().toUpperCase() === 'SUCCESS') {
           let fileName = item.Document_Output_Path;
           downloadLink.href = 'data:application/octet-stream;base64,' + item.DGI_Image;
           downloadLink.download = fileName;
           downloadLink.click();            
         }
         else {
           this.ErrorMsgTop = item.Status.toString();
         }
       });
       //</Sudarshan | base64 to Bytes>  

      } else {
          this.ErrorMsgTop = 'Termsheet not available. Please try again later.';

      }
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
      let UserGroup = AppConfig.settings.oRes.groupID;
      //if((this.BlockedUserGroups.indexOf(UserGroup)) != -1){
      if(this.BlockedUserGroups.split(",").map(ele => ele.trim()).includes(UserGroup.trim())){//Changes done by Varsha G || FIN1EURINT-256 || 27-Apr-2023
        this.showBlockReason = true;
        this.successMessage = true;
        this.successMsgBookOrder = this.BlockUserMessage;
      }else{
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
      this.txtnotional = this.NoOfShare;
      this.txtddlNoteCcy = this.ddlNoteCcy;
      // this.totalNotional=this.NoOfShare;
      this.txtIBPrice = this.IBPrice;
      this.txtClientPrice = '';
      this.txtStrike = this.SolveForvalue === 'Strike' ? item.price : this.Strike;
      this.txtTenor = this.Tenor + this.TenorType.toString().substr(0, 1).toUpperCase();
      this.txtUpfront = this.SolveForvalue === 'Upfront' ? item.price : this.upfront;
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



      // this.txtShare = this.ShareBasket[0].Code;
      this.txtShare = ''
      // this.selectedSharesData=[];
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

      this.tblAllocation = [];

      this.tblAllocation.push('');
      this.underlyingForLimit = "";
      // this.remainingNotional = "0.00"
      this.remainingNotional = "0"
      // this.totalNotional = "300,000.00";
      // this.totalNotional = parseFloat(this.Notional.replace(/,/g, '')).toFixed(2);
      this.totalNotional = this.NoOfShare;
      this.remainingNotional = this.NoOfShare;
      // this.txtnotional.replace(/,/g, '')
      // this.allocatedNotional = "0.00"
      this.allocatedNotional = "0"
      this.allocatedNotionalArr = [0];
      this.EstimatedNotionalArr = [0.00];
      this.allocatedRMArray = [''];


      this.orderBookedFlag = false;

      //console.log(this.tblAllocation)
      //console.log(this.tblAllocation.length)
      return false;
    }
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
      this.txtnotional = this.dataItemAccordian.ER_CashOrderQuantity;//this.formattedAmount(this.dataItemAccordian.ER_CashOrderQuantity);
      this.txtddlNoteCcy = this.dataItemAccordian.ER_CashCurrency;
      this.txtIBPrice = this.dataItemAccordian.ER_SolveFor === 'Price(%)' ? this.dataItemAccordian.EP_Price : this.dataItemAccordian.EP_OfferPrice;
      // this.txtClientPrice = '';
      this.txtStrike = this.dataItemAccordian.EP_StrikePercentage;
      this.txtTenor = this.dataItemAccordian.ER_RFQTenor;
      // this.txtUpfront = (100 - parseFloat(this.txtIBPrice)).toFixed(2);
      // this.txtUpfront = this.dataItemAccordian.ER_Upfront; // changed by Suvarna P || 31Mar2022 || issue- Upfront is not getting rounded up till 2digits
      this.txtUpfront = parseFloat(this.dataItemAccordian.ER_Upfront.toString().replace(/,/g, '')).toFixed(2);
      this.txtClietYield = '';
      this.txtOrderType = 'Market';
      this.txtlimitLevel = '';
      this.txtEQCRef = '';
      this.txtComment = '';
      this.txtClientPrice = 100; //this.issuePrice; // need to ask sheetal
      // this.maxNotional = this.dataItemAccordian.EP_MaxNotional && this.dataItemAccordian.EP_MaxNotional > 0 ? parseFloat(this.dataItemAccordian.EP_MaxNotional) : 5000000.00;
      // this.minNotional = this.dataItemAccordian.EP_MinNotional && this.dataItemAccordian.EP_MinNotional > 0 ? parseFloat(this.dataItemAccordian.EP_MinNotional) : 250000.00;
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
              var index = this.shares.findIndex(shareItem => shareItem.Code === sharecsvArr[k] || shareItem.BloombergCode == sharecsvArr[k]);
              if (index >= 0) {
                  this.shareCode = this.shares[index].Code;
                  this.exchngCode = this.shares[index].ExchangeCode;
                  const lName = this.shares[index].LongName;
                  const Ccy = this.shares[index].LongName;
                  this.ShareBasket.push({ Code: this.shares[index].Code, LongName: lName, Weight: '', Exchange: this.exchngCode, RICCode: this.shares[index].Code });
                  this.setSelectedUnderlyingarray(lName, Ccy, this.shares[index].Code, this.exchngCode, '', '', '', '', '', '', '');
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
      this.remainingNotional = "0"
      // this.totalNotional = "300,000.00";
      // this.totalNotional = parseFloat(this.Notional.replace(/,/g, '')).toFixed(2);
      // this.totalNotional = parseFloat(this.txtnotional.replace(/,/g, '')).toFixed(2);
      this.totalNotional = this.txtnotional;
      this.remainingNotional = this.txtnotional;
      // this.txtnotional.replace(/,/g, '')
      this.allocatedNotional = "0"
      this.allocatedNotionalArr = [0];
      this.EstimatedNotionalArr = [0.00];
      this.allocatedRMArray = [''];
      this.allocatedClientArray = [''];
      this.allocatedCustomerArray = [''];
      this.orderBookedFlag = false;

      //console.log(this.tblAllocation)
      //console.log(this.tblAllocation.length)

      this.Tenor = this.dataItemAccordian.ER_RFQTenor.substring(0, this.dataItemAccordian.ER_RFQTenor.length - 1);
      // this.TenorType = this.dataItemAccordian.ER_RFQTenor.substring(this.dataItemAccordian.ER_RFQTenor.length - 1, 1) === 'M' ? 'Month' : 'Year';
      this.TenorType = this.dataItemAccordian.ER_RFQTenor.substring(this.dataItemAccordian.ER_RFQTenor.length - 1) === 'M' ? 'Month' : 'Year';
      this.Frequency = this.dataItemAccordian.ER_Frequency;
      return false;


  } catch (error) {
      //console.log(error);
  }
}

btnAllocationClick() {
  ////console.log('click');
  this.tblAllocation.push('');
  (<HTMLInputElement>document.getElementById("checkboxAll")).checked = true;
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
              // this.allocatedNotional = parseFloat(this.allocatedNotional.replace(/,/g, '')) + parseFloat((<HTMLInputElement>document.getElementById("Notional" + i)).value.replace(/,/g, ''));
              // this.remainingNotional = parseFloat(this.Notional.replace(/,/g, '')) - parseFloat(this.allocatedNotional.replace(/,/g, ''));
              this.allocatedNotional = parseFloat(this.allocatedNotional) + parseFloat((<HTMLInputElement>document.getElementById("Notional" + i)).value.replace(/,/g, ''));
              this.remainingNotional = parseFloat(this.Notional.replace(/,/g, '')) - parseFloat(this.allocatedNotional);
              i++;

              // this.allocatedNotional==0 || this.allocatedNotional == '' ?  0.00: this.allocatedNotional.replace(/,/g, '')
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
          console.log(element);
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
          console.log(element);
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
      console.log(element);
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
  if (this.txtOrderType === 'Market') {
      this.ErrorMsg1 = '';
      await this.checkValidAllocateNotional(e, rowindex);

      // const target = this.EcCommon.GetEventTarget(e);
      // if (target.value === '' || isNaN(target.value))
      //     target.value = '0.00';


      ////console.log(target, this.allocatedNotional, target.value, this.previousNotional, this.Notional);
      // this.allocatedNotional = parseFloat(this.allocatedNotional) + parseFloat(target.value) - parseFloat(this.previousNotional);

      // target.value = parseFloat(target.value).toFixed(2);
      // this.allocatedNotionalArr[rowindex] = target.value;
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
      this.allocatedNotional = sumarr;//.toFixed(2);
      //console.log(this.totalNotional);

      this.remainingNotional = parseFloat(this.totalNotional.toString().replace(/,/g, '')) - parseFloat(this.allocatedNotional.toString().replace(/,/g, ''));
      this.remainingNotional = this.remainingNotional;//.toFixed(2);
      ////console.log("B4 Fixing 2 Decimal" + target.value);

      //console.log(this.allocatedNotionalArr);

      //console.log("AddNotional:" + this.Notional, this.allocatedNotional, this.previousNotional, this.remainingNotional, this.totalNotional);
      //console.log(this.shareCode, this.exchngCode, this.allocatedNotional[rowindex]);
      const sCode = (this.ShareBasket[0].RICCode === undefined || this.ShareBasket[0].RICCode === '') ? this.ShareBasket[0].Code : this.ShareBasket[0].RICCode;
      this.calculateAllocationNotional(sCode, this.ShareBasket[0].Exchange, this.allocatedNotionalArr[rowindex].toString().replace(/,/g, '')).then(data =>{
        this.EstimatedNotionalArr[rowindex] = data
      })
    //   this.EstimatedNotionalArr[rowindex] = this.calculateAllocationNotional(sCode, this.ShareBasket[0].Exchange, this.allocatedNotionalArr[rowindex].toString().replace(/,/g, ''));
      //console.log(this.EstimatedNotionalArr);
  } else {
      let sumarr = 0.00;
      for (let i = 0; i < this.allocatedNotionalArr.length; i++) {
          if ((<HTMLInputElement>document.getElementById("checkbox" + i)).checked) {
              sumarr += parseFloat(this.allocatedNotionalArr[i].toString().replace(/,/g, '')) || 0.00;
          }
      }
      //console.log(sumarr);
      ////console.log(this.allocatedNotional);
      this.allocatedNotional = sumarr;//.toFixed(2);
      //console.log(this.totalNotional);
      this.remainingNotional = parseFloat(this.totalNotional.toString().replace(/,/g, '')) - parseFloat(this.allocatedNotional.toString().replace(/,/g, ''));
      this.remainingNotional = this.remainingNotional;//.toFixed(2);
      ////console.log("B4 Fixing 2 Decimal" + target.value);
      //console.log(this.allocatedNotionalArr);
      //console.log("AddNotional:" + this.Notional, this.allocatedNotional, this.previousNotional, this.remainingNotional, this.totalNotional);
      //console.log(this.shareCode, this.exchngCode, this.allocatedNotional[rowindex]);
      const sCode = (this.ShareBasket[0].RICCode === undefined || this.ShareBasket[0].RICCode === '') ? this.ShareBasket[0].Code : this.ShareBasket[0].RICCode;
      this.calculateAllocationNotional(sCode, this.ShareBasket[0].Exchange, this.allocatedNotionalArr[rowindex].toString().replace(/,/g, '')).then(data =>{
        this.EstimatedNotionalArr[rowindex] = data
      })
    //   this.EstimatedNotionalArr[rowindex] = this.calculateAllocationNotional(sCode, this.ShareBasket[0].Exchange, this.allocatedNotionalArr[rowindex].toString().replace(/,/g, ''));
      //console.log(this.EstimatedNotionalArr);
  }
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
    console.log(element)
      ////console.log((<HTMLInputElement>document.getElementById("Notional" + i)).value);
      if ((<HTMLInputElement>document.getElementById("Notional" + i)).value === '0.00' && (<HTMLInputElement>document.getElementById("checkbox" + i)).checked) {
          this.ErrorMsg1 = "Please enter valid Notional.";
      }
      i++;

  });

}

checkValidAllocatedNotional(e) {
  try {
      this.ordersuccessMsg = '';
      this.ErrorMsg = '';
      this.ErrorMsg1 = '';
      this.ErrorMsgTop = '';
      const NotionalData = this.EcCommon.checkValidNotional(e);
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

setDefaultPoolVariable() {
  let today = new Date();
  this.Dates = this.EcHome.BBVAGetDates(this.Exchange(), '0B', '');
  if (this.Dates) {
      this.poolActivateDate = this.Dates.MaturityDate + ' ' + moment().format('hh:mm:ss A');

  }
  this.Dates = this.EcHome.BBVAGetDates(this.Exchange(), '3B', '');
  if (this.Dates) {
      this.poolExpiryDate = this.Dates.MaturityDate + ' ' + moment().format('hh:mm:ss A');

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
  //    var bookOrderDetails =  this.EcHome.bookOrderUCP( 
  //        this.Issuer, this.selectedRFQ, this.totalNotional.replace(/,/g, ''));

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
  //  //console.log(this.confirmValidation1());
  // var confrimValidation = this.confirmValidation1();
  // //console.log(confrimValidation);

  // return false;

  // Redirect validation check
  let redirectYN = 'N';
  let estAllocatedNotionalSum = 0.00;
  for (let i = 0; i < this.tblAllocation.length; i++) {
      estAllocatedNotionalSum += parseFloat(this.EstimatedNotionalArr[i].toString().replace(/,/g, '')); // by Amogh K | 16Feb2022
  }
  const res: any = await this.EcHome.RedirectOrderValidationChecks("", this.txtOrderType, this.txtlimitLevel.toString(), this.txtClietYield,
      parseFloat(this.txtUpfront) > 1 ? parseFloat(this.txtUpfront).toString() : (parseFloat(this.txtUpfront) * 100).toString(), this.SolveForvalue, this.Issuer, this.issuePrice, "", (this.templateMappingArr !== undefined && this.templateMappingArr.length > 0) ? this.templateMappingArr[0].template : 'DAC', estAllocatedNotionalSum.toString(), this.Code(), this.ddlNoteCcy, this.ddlNoteCcy, this.Tenor.toString());

  if (res.ValidationRemark !== 'Validation successful') {
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

  var bookOrderDetails :any = await this.EcHome.bookOrderUCP(
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

          if (redirectYN === 'N') {
              // Success message changes based on allocation - added by Pranav D. on 16Feb2022
              // if (this.tblAllocation.length > 1) {
              //     this.successMsgBookOrder = bookOrderDetails.SavingMessage;
              // } else {
              //     this.successMsgBookOrder = bookOrderDetails.SavingMessage.replace(DealNo, DealNo.split(',')[0]); //bookOrderDetails.SavingMessage; // changes bysuvarna P|| 15Feb2022 || asked by Pranav 
              // }
              // //console.log(bookOrderDetails.SavingMessage.replace(orderId+ ',',''))
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
          this.successMessage = true
          this.showOrderDetailsFlag = false;
          // this.EcHome.refreshPreQuoteFlag.next(true);
          // quote expired timeout chnages by suvarna P || 30Mar2022 || assigned by Pranav D
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

validateNotional() {
  //   //console.log(this.totalNotional);
  //    parseFloat(amt.replace(/,/g, '')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
}

confirmValidation1() {


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

  let estAllocatedNotionalSum = 0.00;
  for (let i = 0; i < this.tblAllocation.length; i++) {
      estAllocatedNotionalSum += parseFloat(this.EstimatedNotionalArr[i].toString().replace(/,/g, '')); // by Amogh K | 16Feb2022
  }
  if (estAllocatedNotionalSum < parseFloat(this.minNotional)) {
      if (estAllocatedNotionalSum < parseFloat(this.minNotional)) {
          // //console.log('less than min price');
          // //console.log('Allocated notional is should be between ' + this.priceProvidersArr[index].minLimit  +
          //              ' and' + this.priceProvidersArr[index].maxLimit);
          this.errorMsgBookOrder = "Cannot place order. Allocated notional is less than the minimum permitted.";
          return false;
      }
  }
  if (estAllocatedNotionalSum > parseFloat(this.maxNotional)) {
      if (estAllocatedNotionalSum > parseFloat(this.maxNotional)) {
          // //console.log('greater than min price');
          this.errorMsgBookOrder = "Cannot place order. Allocated notional is greater than the maximum permitted.";
          return false;
      }
  }

  if (parseFloat(this.allocatedNotional) !== parseFloat(this.totalNotional)) {
      this.errorMsgBookOrder = "Sum of shares is not equal to total daily shares.";
      return false;
  }

  if (parseFloat(this.allocatedNotional) <= 0) {
      // this.errorMsgBookOrder = "Please enter valid Notional.";
      this.errorMsgBookOrder = "Please enter valid allocated notional.";
      return false;
  }
  // if(parseFloat(this.allocatedNotional) < min){
  //console.log(this.priceProvidersArr);
  // }
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
    console.log(element)
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
  this.txtnotional = parseFloat(this.txtnotional.replace(/,/g, '')).toFixed(0);
  if (this.errorMsgBookOrder == '') {
      this.totalNotional = this.txtnotional;
      // this.totalNotional = this.NoOfShare;
  }
  this.remainingNotional = parseFloat(this.totalNotional.toString().replace(/,/g, '')) - parseFloat(this.allocatedNotional.toString().replace(/,/g, ''));
  this.remainingNotional = this.remainingNotional;//.toFixed(2);
  //console.log(this.remainingNotional);
}
toggleSuccessMessage() {
  this.successMessage = false;
  this.warningMessage = false;
  this.showBlockReason = false;
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
  } //Changes done by Jyoti S || 20-Apr-2023


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
  }//Changes done by Jyoti S || 20-Apr-2023


showhideKIBarrier() {
  if (this.barrierType !== 'None' && this.barrierType !== '' && this.barrierType !== 'Capital Protected'
      && this.barrierType !== 'Geared Put' && this.barrierType !== 'Ungeared Put' && this.barrierType !== 'Put Spread') {
      return true;
  } else {
      return false;
  }
}

autocallCouponTypeChange() {
  if (this.autocallCouponType === 'Constant Barrier' || this.autocallCouponType === 'Variable Barrier') {
      this.autoFreq = 'MONTHLY';
      this.callableFreq = '';
      this.putableFreq = '';

  } else if (this.autocallCouponType === 'Putable by the Investor') {
      this.autoFreq = '';
      this.callableFreq = '';
      this.putableFreq = 'MONTHLY';
  } else if (this.autocallCouponType === 'Callable by the Issuer') {
      this.autoFreq = '';
      this.callableFreq = 'MONTHLY';
      this.putableFreq = '';

  }
  if (this.autocallCouponType === 'Variable Barrier') {
      this.autoStepDown = '0.00';
      this.autoTrigger = '100.00';
  } else {
      this.autoStepDown = '';
      this.autoTrigger = '';
  }

  if (this.autocallCouponType === 'Putable by the Investor') {
      this.PutableBarrier = '100.00';
  } else {
      this.PutableBarrier = '';
  }


}

publicprivateChange() {
  if (this.publicOrPrivate === 'Public Offer') {
      this.listed = 'Y';
  }
}


priceValidation(priceValue: any, pricestr: string) {
  try {


      $('#txtShare').css("text-indent", "0px")
      $(".validate-popup").each(function () {
          $(this).remove();
      });
      $(".error-input").each(function () {
          $(this).remove();
      });


      this.reset();

      ////console.log(priceValue);
      if (pricestr === 'Strike (%)' && parseFloat(priceValue) < 102) {
          this.ErrorMsgTop = 'Strike % should be greater than or equal to 102';
          document.getElementById('txtStrike').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtStrike")
          $('.validate-popup').delay(5000).fadeOut('slow');
          // return false;
      }
      if (pricestr !== 'Strike (%)' && (priceValue === '' || parseFloat(priceValue) <= 0 || parseFloat(priceValue) > 100)) {

          this.ErrorMsgTop = pricestr + ' should be less than or equal to 100';
          document.getElementById('txtUpfront').classList.add('error');
          $('<div class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#txtUpfront")
          $('.validate-popup').delay(5000).fadeOut('slow');
      }
  }
  catch (error) {
      ////console.log("Error:", error);
  }
}

showcalcTable() {
  this.clearCalcFields();
  this.showcalctableFlag = true;
}

clearCalcFields() {
  this.UnderlyingPrice = '';
  this.StrikePer = '';
  this.NotionalAmount = '';
  this.StrikePrice = '';
  this.NoShares = '';
  this.calcDayCount = '';
  this.calcTotalShares = '';
  this.calcLeverage = 'Yes';
  return false;
}

changeTenor() {
  try {
      this.reset();
      this.priceBtnActive = 'Y'; //Remove multiple clicks pn Price button
      if ((this.Tenor == 0) || ((this.Tenor > 60 || (this.Tenor > this.tenorMaxMonth || this.Tenor < this.tenorMinMonth)) && this.TenorType === 'Month') || ((this.Tenor > 5 || (this.Tenor * 12 > this.tenorMaxMonth || this.Tenor * 12 < this.tenorMinMonth)) && this.TenorType === 'Year')) {

          // Changed by Amogh K | 29Apr2022 | tenor validation modified | assigned by Pranav D
          // this.ErrorMsgTop = 'Please enter valid tenor.';
          this.ErrorMsgTop = 'Please enter tenor between ' + this.tenorMinMonth + " to " +this.tenorMaxMonth +" months";
      }
  }
  catch (error) {
      ////console.log("Error:", error);
  }
}

ChangeKO(e) {
  try {
    this.priceBtnActive = 'Y'; //Remove multiple clicks pn Price button
    console.log("ko is " ,e )
      this.reset();

      if (this.KO === '' || this.KO === '0.00' || this.KO === '0') {
          this.ErrorMsgTop = 'Please enter valid KO % of Intial';
      }

      if (parseFloat(this.KO) > 98) {
          this.ErrorMsgTop = 'KO % should be less than or equal to 98';
      }

  }
  catch (error) {
      ////console.log("Error:", error);
  }
}

chkLeverageChange() {
    this.priceBtnActive = 'Y'; //Remove multiple clicks pn Price button
  if (this.chkLeverage) {
      // changes by Suvarna P || 13Apr2022 || Changed the tenor> but total number of share not changing on pricing screen || assigned by Pranav D 
      this.totalShares = parseFloat(this.accrualDays.replace(/,/g, '')) * parseFloat(this.NoOfShare.replace(/,/g, '')) * 2;
  } else {
      // changes by Suvarna P || 13Apr2022 || Changed the tenor> but total number of share not changing on pricing screen || assigned by Pranav D || start
      this.totalShares = parseFloat(this.accrualDays.replace(/,/g, '')) * parseFloat(this.NoOfShare.replace(/,/g, ''));
  }
}

AQCalculator() {
  if (this.UnderlyingPrice !== '') {
      // this.StrikePrice = (parseFloat(this.UnderlyingPrice) * parseFloat(this.StrikePer) / 100 ).toFixed(2);

      if (this.rdbcalcShares) {
          if (this.calcTotalShares !== '') {
              if (this.calcLeverage === 'Yes') {
                  this.NotionalAmount = (parseFloat(this.UnderlyingPrice) / 2) * parseFloat(this.calcTotalShares);
              } else {
                  this.NotionalAmount = parseFloat(this.UnderlyingPrice) * parseFloat(this.calcTotalShares);
              }

              if (this.NotionalAmount !== '' && this.calcDayCount !== '') {
                  if (this.calcLeverage === 'Yes') {

                      this.NoShares = (parseFloat(this.calcTotalShares) / (parseFloat(this.calcDayCount) * 2)).toFixed(2);
                  } else {
                      this.NoShares = (parseFloat(this.calcTotalShares) / parseFloat(this.calcDayCount)).toFixed(2);
                  }
              }

          }
      } else if (this.rdbcalcNotional) {
          if (this.NotionalAmount !== '') {
              if (this.calcLeverage === 'Yes') {
                  if (this.NotionalAmount.includes(',')) {
                      this.calcTotalShares = ((parseFloat(this.NotionalAmount.replace(/,/g, '')) * 2) / parseFloat(this.UnderlyingPrice)).toFixed(2);
                  } else {
                      this.calcTotalShares = ((parseFloat(this.NotionalAmount) * 2) / parseFloat(this.UnderlyingPrice)).toFixed(2);
                  }
              } else {
                  if (this.NotionalAmount.includes(',')) {
                      this.calcTotalShares = (parseFloat(this.NotionalAmount.replace(/,/g, '')) / parseFloat(this.UnderlyingPrice)).toFixed(2);
                  } else {
                      this.calcTotalShares = (parseFloat(this.NotionalAmount) / parseFloat(this.UnderlyingPrice)).toFixed(2);
                  }
              }

              if (this.NotionalAmount !== '' && this.calcDayCount !== '') {
                  if (this.calcLeverage === 'Yes') {

                      this.NoShares = (parseFloat(this.calcTotalShares) / (parseFloat(this.calcDayCount) * 2)).toFixed(2);
                  } else {
                      this.NoShares = (parseFloat(this.calcTotalShares) / parseFloat(this.calcDayCount)).toFixed(2);
                  }
              }

          }
      }
  }

  if (this.NotionalAmount !== '') {
      this.NotionalAmount = this.NotionalAmount.toFixed(2);
      this.NotionalAmount = this.NotionalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      this.NoShares = this.NoShares.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  // if (this.NoShares !== '') {
  //     this.NoShares = parseFloat(this.NoShares.replace(/,/g, '')).toFixed(2);
  // }
  return false;
}


hideCalculator() {
  this.showcalctableFlag = false;
  return false;
}

rdbCalcChange() {
  this.rdbcalcShares = true;
  this.rdbcalcNotional = false;
  this.NotionalAmount = '';

}

rdbCalcNotionalChange() {
  this.rdbcalcShares = false;
  this.rdbcalcNotional = true;
  this.calcTotalShares = '';
}

async calculateNotional(sharecode: any, ExchangeCode: any, NoofShare: any) {
  try {
      // removal of ',' from no of shares to calculate notional 3-3-2022
      if (NoofShare.includes(',')) {
          NoofShare = NoofShare.toString().replace(/,/g, '');
      }
      this.Notional = '';
      // changes by Suvarna P || 22Apr2022 || GetSharesInfo chnaged to GetShareRate || assigned by Pranav D
      // const shareInfo = this.EcHome.GetSharesInfo(sharecode)
      const shareInfo = await this.EcHome.GetShareRate(sharecode, this.ddlNoteCcy)
      const accrualdayResp = await this.EcHome.GetNoOfDays(ExchangeCode, this.Tenor, this.TenorType.substr(0, 1), this.ddlNoteCcy, this.Frequency);
      const accrualday = accrualdayResp['NoOfDays'];
      this.accrualDays = accrualday;
      // added by Suvarna P || 13Apr2022 || Changed the tenor> but total number of share not changing on pricing screen || assigned by Pranav D
      this.chkLeverageChange();
      // changes by Suvarna P || 22Apr2022 || GetSharesInfo chnaged to GetShareRate || assigned by Pranav D
      // if (shareInfo && shareInfo.length > 0 && accrualday !== '') {
      if (shareInfo['ShareRate'] && shareInfo['ShareRate'] !== '' && accrualday !== '') {
          let res = 0;
          // res = shareInfo[0].Spot * accrualday * NoofShare;
          res = parseFloat(shareInfo['ShareRate'].toString().replace(/,/g, '')) * accrualday * NoofShare;
          this.Notional = res.toFixed(2);
          this.Notional = this.Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
  } catch (error) {

  }
}

async calculateAllocationNotional(sharecode: any, ExchangeCode: any, NoofShare: any) {
  let res = 0;
  let retVal: any = '';
  try {

      // changes by Suvarna P || 22Apr2022 || GetSharesInfo chnaged to GetShareRate || assigned by Pranav D
      // const shareInfo = this.EcHome.GetSharesInfo(sharecode)
      const shareInfo = await this.EcHome.GetShareRate(sharecode, this.ddlNoteCcy)
      const accrualdayResp = await this.EcHome.GetNoOfDays(ExchangeCode, this.Tenor, this.TenorType.substr(0, 1), this.ddlNoteCcy, this.Frequency);
      const accrualday = accrualdayResp['NoOfDays'];
      this.accrualDays = accrualday;
      // changes by Suvarna P || 22Apr2022 || GetSharesInfo chnaged to GetShareRate || assigned by Pranav D
      // if (shareInfo && shareInfo.length > 0 && accrualday !== '') {
      if (shareInfo['ShareRate'] && shareInfo['ShareRate'] !== '' && accrualday !== '') {
          // res = shareInfo[0].Spot * accrualday * NoofShare;
          res = parseFloat(shareInfo['ShareRate'].toString().replace(/,/g, '')) * accrualday * NoofShare;
          retVal = res.toFixed(2);
          //console.log(res);
          retVal = retVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
  } catch (error) {

  }
  return retVal;
}
async calcAllocataionNotionalForLimitOrder(sharecode: any, ExchangeCode: any, NoofShare: any) {
  let res = 0;
  let retVal: any = '';
  try {
      // changes by Suvarna P || 22Apr2022 || GetSharesInfo chnaged to GetShareRate || assigned by Pranav D
      // const shareInfo = this.EcHome.GetSharesInfo(sharecode)
      const shareInfo = await this.EcHome.GetShareRate(sharecode, this.ddlNoteCcy)
      const accrualdayResp = await this.EcHome.GetNoOfDays(ExchangeCode, this.Tenor, this.TenorType.substr(0, 1), this.ddlNoteCcy, this.Frequency);
      const accrualday = accrualdayResp['NoOfDays'];
      this.accrualDays = accrualday;
      // changes by Suvarna P || 22Apr2022 || GetSharesInfo chnaged to GetShareRate || assigned by Pranav D
      // if (shareInfo && shareInfo.length > 0 && accrualday !== '') {
      if (shareInfo['ShareRate'] && shareInfo['ShareRate'] !== '' && accrualday !== '') {
          // res = (this.txtlimitLevel).replace(/,/g, '') * accrualday * NoofShare;
          // added by Pranav D 17Feb2022
          if (this.txtOrderType === 'Limit') {
              res = (this.txtlimitLevel).replace(/,/g, '') * accrualday * NoofShare;
          } else {
              // res = shareInfo[0].Spot * accrualday * NoofShare;
              res = parseFloat(shareInfo['ShareRate'].toString().replace(/,/g, '')) * accrualday * NoofShare;
          }
          //console.log('limit level', (this.txtlimitLevel).replace(/,/g, ''), accrualday, NoofShare);
          retVal = res.toFixed(2);
          //console.log(res);
          retVal = retVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          //console.log(retVal);
      }
  } catch (error) {
  }
  return retVal;
}
chngPriceChkBox(i) {
  //console.log(this.priceProvidersArr);
  //console.log(this.priceProvidersArr[i].priceChkFlg);
  this.priceProvidersArr[i].priceChkFlg = !this.priceProvidersArr[i].priceChkFlg
}

async portfolioChange() {
  this.reset();
  this.successMsg = '';
  this.errorTemplateMessage = '';
  if (this.portfolio !== '') {
      //this.portfolioName = '';
      $('#loading').show();
      setTimeout(async () => {
        var saveQuoteData:any ;
          await this.EcHome.getRedirectionData(this.portfolio,'Decumulator').then((data:any)=>{saveQuoteData=data});
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
          const res = await this.EcHome.BBVADeletePortfolio(this.portfolio, 'Decumulator');
          if (res) {
              this.saveFlag = true;
              // this.successMsg = 'Template ID ' + this.portfolio + ' deleted successfully.';
              const index = this.portfolioIdArr.findIndex(obj => obj.P_ID === this.portfolio)
              this.successMsg = 'Template : ' + this.portfolioIdArr[index].P_Name + ' deleted successfully.';
              this.portfolio = '';
              this.portfolioName = '';

              this.portfolioIdArr = [];
              await this.EcHome.BBVAGetPortfolio('Decumulator', 'Single Pricer').then((data:any)=>{this.portfolioIdArr = data});
              this.portfolioIdArr?.splice(0, 0, {
                  AccessDetail: "ALL",
                  Created_At: "",
                  P_ID: "",
                  P_Name: "",
                  ProdType: "",
                  ShareType: "ALL",
                  created_by: "",
              });
              this.portfolioIdArr.map(r => {
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
  // this.EcCommon.setAccord(9, 'Decumulator')
}

lauchProduct(priceRecord) {
  // set close launch product subscriber to false || PriyaL || 05Apr2022 || Assigned by PranavD
  this.EcHome.closeLaunchProduct.next(false);
  this.selectRecord = {};
  this.prevQuoteLaunchPopUp = true;
  this.selectRecord = priceRecord;
  this.selectRecord['RFQ_ID'] = priceRecord.rfq;
  this.selectRecord['Template_Code'] = 'Decumulator';
  this.selectRecord['RedirectedFrom'] = 'Pricers';
  this.selectRecord['Mode'] = 'Launch Product';
  return false;

  // RFQ_ID:p.rfq,Template_Code:'AutocallablePhoenix',RedirectedFrom:'Pricers',Mode:'Launch Product'}
}
async updatePortfolio() : Promise<any> {
  try {

      if (this.portfolioName === '') {
          this.ErrorMsgTop = "Please enter valid template name.";
          return false;
      }

      // this.validationOnButton();
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
          var res:any;
          await this.EcHome.BBVASaveQuotes('Single Pricer', strXml, this.portfolioName, this.portfolio, 'Decumulator', AppConfig.settings.oRes.userID).then((data:any)=>{res=data});
          if (res) {
              if (res.errorMessage === '') {

                  this.saveFlag = true;
                  this.saveportfolioId = res.PortFolioID;
                  this.successMsg = 'Template : ' + this.portfolioName + ' updated successfully.';
                  // this.successMsg = 'Portfolio ID ' + res.PortFolioID + ' saved successfully.';
                  this.portfolioIdArr = [];
                  await this.EcHome.BBVAGetPortfolio('Decumulator', 'Single Pricer').then((data:any)=>{
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
                  this.portfolioIdArr.map(r => {
                      let item = r;
                      item.imageIcon = environment.asseturl + ((r.ShareType + '').toUpperCase() === 'OWNER' ? 'owner.png' : 'shared.png');
                      return item;
                  });
              }
          } else {
              this.errorTemplateMessage = res.errorMessage;
          }
      }
  } catch (error) {
      //console.log('Error', error);
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
  this.minNotionalConfirm = false;
  this.showOrderDetailsFlag = false;

  if (this.viewRFQID && this.viewRFQID !== '') {
      this.viewOnly = false;
      this.EcHome.showPricerScreeninViewModePopup.next(false);
  }
  return false;
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

filldropdownfromcommandata() {

    this.pageloadflag=true;
  for (let i = 0; i < this.commonData.length; i++) {
      switch (this.commonData[i].Field_Name) {
          // commented below case as booking center is fetched from api -by Priya L. on 14Mar2022 - assigned by Pranav D.
          // case "BookingCenter":
          //     this.BookingCenter = this.parseCommonDatatoJSONArr('BookingCenter');
          case "NonBestPriceReason":
              this.NonBestPriceReasonArr = this.parseCommonDatatoJSONArr('NonBestPriceReason');
      }
  }

}

parseCommonDatatoJSONArr(Field_Name: any) {
  let commonDataJSONArr: any = [];
  const index = this.commonData.findIndex(obj => obj.Field_Name === Field_Name);
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

  return commonDataJSONArr;
}

// set default values - added by Priya L on 15Feb2022 - assigned by Pranav D.
setdefaultvalues() {

  for (let i = 0; i < this.defaultvaluesArr?.length; i++) {

      switch (this.defaultvaluesArr[i].Control_Name) {

          case 'SolveFor':
              this.SolveForvalue = this.defaultvaluesArr[i].Default_Value;
              // reset field values on page load based on solve for value - added by Priya L. on 24-Feb-2022 - assigned by Pranav D.
              if (this.SolveForvalue === 'Strike') {
                  this.Strike = '';
              }
              if (this.SolveForvalue === 'Upfront') {
                  this.upfront = '';
              }
              // //console.log(this.format,"defaultformatval");
              break;

          case 'Underlyings':
              // this.ShareName = this.defaultvaluesArr[i].Default_Value;
              if (this.defaultvaluesArr[i].Default_Value && this.defaultvaluesArr[i].Default_Value !== '') {
                  this.defaultvaluesArr[i].Default_Value.split(',').forEach(element => {
                      var index = this.shares.findIndex(shareItem => shareItem.BloombergCode == element)
                      if (index >= 0) {
                          // const bloombergCode = this.shares[index].BloombergCode;
                          const shareCode = this.shares[index].Code;
                          // const exchngCode = this.shares[index].ExchangeCode;
                          // const lName = this.shares[index].LongName;
                          // const Ccy = this.shares[index].Ccy;
                          // this.ShareBasket.push({ BloombergCode:bloombergCode,Code: shareCode, LongName: lName, Weight: '', Exchange: exchngCode });
                          // this.setSelectedUnderlyingarray(lName, Ccy, shareCode, exchngCode, '', '', '', '', '', '', '');
                          this.showUnderlying('', SearchunderlyingPipe.prototype.transform(this.shares, shareCode)[0]);
                      }
                  });
              }

              break;

          case 'Notional':
              this.Notional = this.defaultvaluesArr[i].Default_Value;
              this.defaultvaluesArr[i].label = "Notional"
              break;

          case 'Upfront':
              this.upfront = this.defaultvaluesArr[i].Default_Value;
              this.defaultvaluesArr[i].label = "Upfront (%)"
              break;


          case 'Tenor':
              this.Tenor = this.defaultvaluesArr[i].Default_Value;
              this.tenorMaxMonth = parseInt(this.defaultvaluesArr[i].MaxVal)
              this.tenorMinMonth = parseInt(this.defaultvaluesArr[i].MinVal)
              break;


          case 'TenorType':
              this.TenorType = this.defaultvaluesArr[i].Default_Value;
              break;

          case 'Frequency':
              this.Frequency = this.defaultvaluesArr[i].Default_Value.toString().toUpperCase();
              break;


          case 'Shares':
              this.NoOfShare = this.defaultvaluesArr[i].Default_Value;
              break;

          case 'Strike':
              this.Strike = this.defaultvaluesArr[i].Default_Value;
              break;


          case 'AutoTrigger':
              this.KO = this.defaultvaluesArr[i].Default_Value;
              console.log(this.defaultvaluesArr[i].Default_Value)
              break;

          case 'GearingLeverage':
              this.chkLeverage = (this.defaultvaluesArr[i].Default_Value === undefined || this.defaultvaluesArr[i].Default_Value === "undefined"
                  || this.defaultvaluesArr[i].Default_Value === "" || this.defaultvaluesArr[i].Default_Value === "false") ? false : true;
              break;


          case 'GuaranteePeriods':
              this.Guarantee = this.defaultvaluesArr[i].Default_Value;
              break;

      }
  }
console.log("ko value " , this.KO , this.Guarantee)
this.pageloadflag=false;
}

// function to disable fields based on default values - added by Priya L. on 28Feb2022 - assigned by Pranav D.
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

// Indicative Termsheet generation and Download - added by PriyaL on 04Mar2022 -assigned by PranavD - Start
    async GenerateDocument(index: any) {
  try {
      this.ErrorMsg = '';
      this.ErrorMsgTop = '';
      this.priceProvidersArr[index].TSLoadFlag= true; //Apurva K ||26-Apr-2023||FIN1EURINT-246
      // const res: any = this.EcHome.GenerateDocument(this.priceProvidersArr[index].NoteMasterID);
      const res: any = await this.EcHome.GenerateDocument(this.priceProvidersArr[index].NoteMasterID + '~' + this.priceProvidersArr[index].rfq);
      if (res !== null && res !== undefined) {
       
          if (res.GeneratedFileBytes[0] !== undefined) {
              const bytes = new Uint8Array(res.GeneratedFileBytes);
              const blob = new Blob([bytes], { type: 'application/pdf' });
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = "Decumulator_" + Guid.create();// res.Document_Output_Path;
              link.click();
          } else {
              this.ErrorMsgTop = res.Status.toString();
          }

          this.priceProvidersArr[index].TSLoadFlag= false;//Apurva K ||26-Apr-2023||FIN1EURINT-246
      } else {
        
          this.ErrorMsgTop = 'Termsheet not available. Please try again later.';
          this.priceProvidersArr[index].TSLoadFlag= false;//Apurva K ||26-Apr-2023||FIN1EURINT-246

      }
  } catch (error) {
      //console.log('Error', error);
  }
  return false;
}

// Added frequency change event || PriyaL || 11Apr2022 || Assigned by Pranav D.
freqChange() {
  try {
    this.priceBtnActive = 'Y'; //Remove multiple clicks pn Price button
      if (this.Frequency === 'MONTHLY' && parseInt(this.Guarantee) > 3) {
          this.Guarantee = 0;
      }

      if (this.Frequency === 'BIWEEKLY' && parseInt(this.Guarantee) === 3) {
          this.Guarantee = 0;
      }
  } catch (error) {

  }
}

// Added validation on changing guarantee period || PriyaL || 14Apr2022 || Assigned by Pranav D.
Guaranteechange() {
    this.priceBtnActive = 'Y'; //Remove multiple clicks pn Price button
  $(".validate-popup").each(function () {
      $(this).remove();
  });
  $(".error-input").each(function () {
      $(this).remove();
  });
  if (this.Frequency === 'BIWEEKLY') {
      if (((parseFloat(this.Guarantee) / 2) > (this.Tenor / 3)) && this.TenorType === 'Month') {

          this.ErrorMsgTop = 'Guarantee period should be less than or equal to 1/3 of tenor.';
          document.getElementById('ddlGuarantee').classList.add('error');
          // Changed by Amogh K | 12 Apr 2022 | EULGTINT-123 | Assigned by Pranav D
          $('<div style="margin-left:5px;" class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#ddlGuarantee")
          $('.validate-popup').delay(5000).fadeOut('slow');
      }
  } else {
      if ((parseFloat(this.Guarantee) > (this.Tenor / 3)) && this.TenorType === 'Month') {

          this.ErrorMsgTop = 'Guarantee period should be less than or equal to 1/3 of tenor.';
          document.getElementById('ddlGuarantee').classList.add('error');
          // Changed by Amogh K | 12 Apr 2022 | EULGTINT-123 | Assigned by Pranav D
          $('<div style="margin-left:5px;" class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#ddlGuarantee")
          $('.validate-popup').delay(5000).fadeOut('slow');
      }
  }

  if (this.Frequency === 'BIWEEKLY') {
      if (((parseFloat(this.Guarantee) / 2) > ((this.Tenor * 12) / 3)) && this.TenorType === 'Year') {
          this.ErrorMsgTop = 'Guarantee period should be less than or equal to 1/3 of tenor.';
          document.getElementById('ddlGuarantee').classList.add('error');
          // Changed by Amogh K | 12 Apr 2022 | EULGTINT-123 | Assigned by Pranav D
          $('<div style="margin-left:5px;" class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#ddlGuarantee")
          $('.validate-popup').delay(5000).fadeOut('slow');
      }
  } else {
      if ((parseFloat(this.Guarantee) > ((this.Tenor * 12) / 3)) && this.TenorType === 'Year') {
          this.ErrorMsgTop = 'Guarantee period should be less than or equal to 1/3 of tenor.';
          document.getElementById('ddlGuarantee').classList.add('error');
          // Changed by Amogh K | 12 Apr 2022 | EULGTINT-123 | Assigned by Pranav D
          $('<div style="margin-left:5px;" class="error-input"></div><div class="validate-popup active"><span> ' + this.ErrorMsgTop + '</span></div>').insertAfter("#ddlGuarantee")
          $('.validate-popup').delay(5000).fadeOut('slow');
      }
  }

}


}
