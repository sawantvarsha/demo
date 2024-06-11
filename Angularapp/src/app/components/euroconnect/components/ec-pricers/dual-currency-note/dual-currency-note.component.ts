import { Component, ElementRef, EventEmitter, OnInit, ViewChild, Input,Output,Renderer2} from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCalendar } from '@angular/material/datepicker';

import { Moment } from 'moment';
import * as moment from 'moment';

import { SearchunderlyingPipe } from '../../../pipe/searchunderlying.pipe';

import { Subscription } from 'rxjs/internal/Subscription';

import { EcCommonService } from '../../../services/ec-common.service';
import { EcHomeService } from '../../../services/ec-home.service';
import { ApifunctionsService } from 'src/app/components/dashboard-new/services/apifunctions.service';
import { CommonfunctionsService } from 'src/app/components/dashboard-new/services/commonfunctions.service';

import { environment } from 'src/environments/environment';
import { SearchUserGroupPipe } from '../../../pipe/search-user-group.pipe';

import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/services/config.service';

@Component({
  selector: 'app-dual-currency-note',
  templateUrl: './dual-currency-note.component.html',
  styleUrls: ['./dual-currency-note.component.scss']
})
export class DualCurrencyNoteComponent implements OnInit {
//  RMType = 'Non-BBVAUser1'; //Commented temporaily
@ViewChild('focusable', { static: false })
namefield!: ElementRef;
RMType: any;

  constructor(public elem: ElementRef, public commonfunctions: CommonfunctionsService,
    public apifunctions: ApifunctionsService, public datepipe: DatePipe, private route: ActivatedRoute, private renderer: Renderer2,
    public echome: EcHomeService, public eccommon: EcCommonService) { }

    @Output()
    selectedDate = moment();
  
    @Output()
    dateSelected: EventEmitter<Moment> = new EventEmitter();
  
    @Input() cloneData: any;
    @Input() cloneMatrixCellFlg: boolean = false;
    
    Fixing = "Fixing"
    
    rfqID: any;
    portfolioId: any;
    viewOnly = false;
    scheduledReqId: any;
    ErrorMsg: any = '';
    infoMsg = '';
    allBooksData: any = [];
    allMappedData: any = [];   //  Added by Riddhi and radha || 20march23 || Double api calls 
    onBehalfOf: any;
    Product: any;
    // sortedAllPrices: any = [];
    cpnType: any;
    Strike = '';
    format: any;
    mappedformatlist: any = [];
    mappedformatlistLocation: any = [];
    GetClientProdDetailsArr: any = [];
    priceBtnActive = 'N';
    Size: any;
    Spread = '';
    ddlccy: any;
    depoCcy: any;
    altCcy: any;
    Currency: any;
    CurrencyPair: any[] = [];
    Price = '';
    // Fixing = '';
    IssuePrice = '';
    Fee = '';
    CpnPct = '';
    Frequency: any;
    SolveForValue: any;
    paymentshift: any;
    settdate: any;
    Issuedate: any;
    Fixingdate: any;
    Maturitydate: any;
    timeoutMsg: string = '';
    orderID: any;
    replySolveFor: any;
    replySolveFor1: any;
    loadflag = false;
    orderStatus: any;
    saveFlag = false;
    successMsg: any;
    asseturl = environment.asseturl;
    interfaceUrl = environment.interfaceURL;
    priceoptionflag = false;
    saveoptionflag = false;
    checkNotionalRes: any;
    Spot = '';
    Issueshift = '';
    Fixingshifter = '';
    Maturityshifter = '';
    Feeamt: any;
    ReceivedCCY: any;
    datesarr: any[] = [];
    today: any;
    matDateChk: any;
    // bidAskRate: any[] = [];
    DecimalRate: any;
    PipsMultiplier: any;
    // ProductCode: any;
    Mode: any;
    issueDateShifter: any[] = [];
    fixingDateShifter: any[] = [];
    fixingDateShifterArr: any[] = [];
    maturityDateShifter: any[] = [];
    location: any;
    optCutLocation: any;
    optCutArr: any[] = [];
    optCutTime: any;
    ddlOptCut: any[] = [];
    reference: any;
    optionCut = '';
    specialSpreadArr: any[] = [];
    minSpread: any;
    maxSpread: any;
    defaultSpread: any;
    dealDepoDays: any;
    // ProductId: any;
    clientEntrySpotFlag: boolean = false;
    templateMappingArr: any;
    variantFlag = false; //Added by Apurva K|| 18-Dec-2023||HSBCECCLI-87
  
  
    // DCN Pricing functionality new variables || 11Jul2022 || assigned by Pranav D || start
    validationArr: any;
    dcnPriceSubscription?: Subscription;
    sortedAllPrices: any = [];
    AllPrices: any = [];
    Prices = [];
    NoteMasterID: any;
    clearFlag = false;
    // Prices = [];
    timeLeft = 60;
    PPDetails: any;
    defaultTimeout: number = 0;
    interval: any;
    portfolioGroupID: any = '';
  
    Product_Id = '';
    product_code = '';
    Product_Name = '';
  
    noOfDays: any;
    feePopupValidationFlag: boolean = false;
    allowPricingFee: boolean = false;
    showFeePopup = false;
    showSchedulePopupFlag = false;
    todayDate: any;
    scheduleType = 'Regular';
    scheduleTypeArr: any = [];
    inputDate: any;
    inputTime: any;
    scheduleFreq = 'Monthly';
    scheduleFreqArr: any = [];
    scheduleMsg: any;
    feeChkBox: any;
  
    matFeeChk: any;
    issuePriceBox: any;
    Cost: any;
    TradeDate: any;
    SpreadCost: any;
    // DCN Pricing functionality new variables || 11Jul2022 || assigned by Pranav D || end
  
    // added  by Suvarna P || 30Aug2022 || BBVACLI-441 || Save and share button not working for Main pricer || assigned by Prananv D
    showsaveSharePopupFlag = false;
    userName: string = '';
    selectedUserIndex = 0;
    showSuggestions_User = false;
    userflag: boolean = false;
    users: any;
    userCode: any;
    selectedBIndex_User = 0;
    userBasket: any = [];
    currentowner: any;
    receivedDeciamlofCcyPair: any;
    // BBVAEPLCI-94 Pranav D 10-Oct-2022
    manualSpotValue: any;
    manualSpreadValue: any;
    // BBVACLI-509 Pranav D 11-Oct-2022
    LPStatus: any;
    // BBVAEPLCI-101 
    Timestamp: any;
    SpotReceived: any;
    FeeAmtCcy: any;
    feeAmtCcyArr: any;
    // BBVACLI-551 Pranav D 17-Oct-2022
    realTimeSpotArr: any[] = [];
    midRate: any;
    // BBVAEPCLI-122 Upfront (%) added by Pranav D 31-Oct-2022
    Upfront: any;
    // BBVAEPCLI-199 Reoffer price precision
    receivedReoffer: any;
    // BBVAEPCLI-210 Pranav D 23-Nov-2022
    CouponPct: any;
    // BBVAEPCLI-20 Pranav D 13-Dec-2022
    receivedStrikeSpreadToggle: any;
  
    // Add to watchlist variabled
    ProductWatchlist: boolean = false;
    showAddToWatchlistPopupFlag: boolean = false;
    targetValue: any;
    direction: any;
    expiryDate: any;
    addWatchlistSolveFor: any;
    TimeValid: any = "";
    maxValidityDays: any
    // MaxSelectDate:any=moment().add({days:5}).format('DD-MM-YYYY');
    MaxSelectDate: any;
    MinSelectDate: any = moment().add({ days: 0 }).format('YYYY-MM-DD');
    fundRatePopup: any = false
    WatchID: any;
    tradebtnclicked:boolean=false; //RadhaM 23-02-23
    showTradeBtnFlag: boolean = false;
    DCNPriceValidation: boolean = false;
    RFQIDForDCNTrade: any = '';
    DCNTradeID: any = '';
    tradeTimer: any = '';
    dcntradeTimer: any = '';
    tradeBtnActionFlag: boolean = false;
    confirmOrderPopup: boolean = false;
  
    reviewOrder: any = false;
    displayTradeBtn: any = false;
    secondsRemaining: any;
    cloneVisible: boolean = true;
    placedOrderQueue: any = '';
    confirmTradeDate: any;
    // BBVAEPCLI-474 Pranav D 24-Apr-2023
    FXLoaderTimer: any = '';
    loaderTmeLeft: number = 0;
    // Pranav D 24-Apr-2023 dcn priing waiting message in blue
    waitingMsg: any = '';
    // BBVAEPCLI-530 Anubhav G 9-May-2023
    issuePriceValidation: any;
    invoiceDiscountToggle:any='Discount'; // To be default | Anubhav Goyal | EPCLI-530 | 24-May-2023
    invoiceCCYAmt:any;
    invoicePct:any; // Added by Anubhav Goyal | 24-May-2023 | EPCLI-530
  
    feePolicy: any //Added by Anubhav Goyal | 2-June-2023 |  BBVAEPCLI-567 New logic in terms of fee policy (Number 11 in Blanca's mail)
    detailedReofferPrice: any; // Added by Pranav D 26-Jun-2023 BBVAEPCLI-597 reoffer price shpuld be passed with 6 decimal in XML tag
    fileNameDCNTS: any; // added by Pranav D 26-Jun-2023 BBVAEPCLI-607 show DCN TS document on link click
    DCNTSFilePath: any; // added by Pranav D 26-Jun-2023 BBVAEPCLI-607 show DCN TS document on link click
    SaveandShareErrorMsg:any; // BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 31-08-23 

    Format = []; //Apurva K
    commonData:any = [];

  ngOnInit() {
    setTimeout(async() => {
      this.commonData = await this.echome.GetCommonDataEuroConnect("CreditLinkedNote");
    if (this.commonData && this.commonData.length > 0) {
     
      await this.filldropdownfromcommandata();
    }
    });
    
  }
  async filldropdownfromcommandata() {
    for (let i = 0; i < this.commonData?.length; i++) {
      switch (this.commonData[i].Field_Name) {
        case "InputProductFormatType":
          this.Format = await this.parseCommonDatatoJSONArr('InputProductFormatType');
          //console.log(this.Format,"Fornat arr")
        break;
              // case "InputFloatingIndex":
              // this.floatingRefArr = await this.parseCommonDatatoJSONArr('InputFloatingIndex');
              // console.log(this.floatingRefArr,"this.floatingRefArr")
              // break;
      }
    }
    //console.log(this.Format,"Fornat arr")

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

    //console.log(commonDataJSONArr,"commonDataJSONArr")
    if (Field_Name !== 'Tenor') {
      commonDataJSONArr.sort((a, b) => (a.Key > b.Key) ? 1 : -1);
    }
    if (Field_Name === 'AutocallFrequency') {
      //console.log(commonDataJSONArr);
    }
    return commonDataJSONArr;
  }

  setMultipricerData(params: any) {
    // var cloneData = {};
    // var cloneData1 = {};

    // cloneData['multiPricerRedirectFlg'] = [true,false];
    // cloneData1['multiPricerRedirectFlg'] = true;
    // cloneData1['Actions'] = "Clone,View,,,,";
    //  
    //  
    // for (const [key, value] of Object.entries(cloneData1)) {
    //   cloneData1[`${key}`] = [cloneData1[`${key}`]]
    // }
     

    var param2: any = {};
    for (const [key, value] of Object.entries(params)) {
      //  
      //  
      var key1 = `${key}`;
      // params[key1] = [[`${value}`]];
      param2[key1] = [[`${value}`].toString()];
      //  
    }
    //  
     
    return param2;
  }

  reset() {
    try {
     
      this.waitingMsg= ''
      //Added by Anubhav Goyal | 13-Apr-2023
      this.breachInfoMsg = ''
      this.infoMsg = ''
      // added by Suvarna P || 11Jul2022 || reset functionality || assigned by Pranav D || Start
      this.timeLeft = -1;
      this.timeoutMsg = '';
      this.clearFlag = true;
      clearInterval(this.interval);
      // added by Riddhi P || 22Sept2022 || Spread field not clearing out on changing parameters
      // this.Spread = '';
      //  this.TSFlag = false;
      // clearInterval(this.TSInterval);
      this.PPDetails = '';
      this.sortedAllPrices = [];
      this.AllPrices = [];
      this.orderID = '';
      this.loadflag = false;
      this.ErrorMsg = '';
      // this.infoMsg = '';
      this.rfqID = '';
      this.saveFlag = false;
      this.successMsg = '';
      this.DCNTradeID = '';           // Added by Vaibhav B | 14-03-2023 | BBVACLI-956 | To Avoid stickiness of Order ID and Order Status, as asked by Suraj T.
      this.tradeTimer = 0;		// Added by Vaibhav B | 16-03-2023 | BBVACLI-956 | To Avoid stickiness of Order ID and Order Status, as asked by Suraj T.
      this.secondsRemaining = -1;

      if (this.manualSpotValue === 'N') {
        this.Spot = '';
      }

      if (this.manualSpreadValue == 'N') {
        this.Spread = '';
      }
      // added by Suvarna P || 29Aug23 ||  BBVAEPCLI-583 || FX- Deal done missing spread and spot || when reprice, strike should become blank when manual Spread is Y and Manual Spot is  N
      if (this.manualSpotValue == 'N' && this.manualSpreadValue == 'Y' ) {
        this.Strike = '';
      }
      // this.allowPricingFee = false;
      // this.reqSuccessMsg = '';
      const els = document.getElementsByClassName('error');
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < els.length; i++) {
        els[i].classList.remove('error');
      }


      if (document.getElementById('txtCoupon')) {
        document.getElementById('txtCoupon')!.classList.remove('reply');
      }

      if (document.getElementById('txtprice')) {
        document.getElementById('txtprice')!.classList.remove('reply');
      }

      if (document.getElementById('txtStrike')) {
        document.getElementById('txtStrike')!.classList.remove('reply');
      }
      // added by Suvarna P || 18Jul2022 || solveFor Fee issues || assigned by Pranav D.
      if (document.getElementById('txtFee')) {
        document.getElementById('txtFee')!.classList.remove('reply');
      }

      // document.getElementById('txtspot').classList.remove('blackSpot');
      document.getElementById('txtspot')!.classList.remove('graySpot');
      //Added by Riddhi P || 22Sept2022 || Spot field highlighted green even after changing parameters and repricing
      document.getElementById('txtspot')!.classList.remove('reply');



      if (this.SolveForValue === 'Coupon') {
        this.CpnPct = '';
        this.CouponPct = ''; // Added by Anubhav Goyal | 18-Mar-2023 | BBVACLI-931
        document.getElementById('txtspread')!.classList.remove('error');
      }

      if (this.SolveForValue === 'Strike - Spread') {
        this.Strike = '';
        // this.Spread = this.Spread === '' ? '' : this.Spread;
        this.Spread = '';
        document.getElementById('txtspread')!.classList.remove('error');
      }

      if (this.SolveForValue === 'Reoffer Price') {
        this.Price = '';
        // BBVAEPCLI-191 clear upfront value when price button is clicked
        this.Upfront = '';
        document.getElementById('txtspread')!.classList.remove('error');
      }

      // if (this.SolveForValue !== 'Strike - Spread' && this.clientEntrySpotFlag ){
      //     this.Spot='';
      //     this.Spread = '';
      // }

      //  
      // added by Suvarna P || 18Jul2022 || solveFor Fee issues || assigned by Pranav D.
      if (this.SolveForValue === 'Fee') {
        this.Fee = '';
        this.Feeamt = '';
        document.getElementById('txtspread')!.classList.remove('error');
        if (this.clientEntrySpotFlag) {
	// changed by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side
          // this.Spot = parseFloat(this.sortedAllPrices[0].Price1).toFixed(this.receivedDeciamlofCcyPair);
          this.Spot = this.sortedAllPrices[0].Price1;
          // this.Spot = '';
          this.clientEntrySpotFlag = false;

        }
      }
      else {
        if (!this.clientEntrySpotFlag) {
          // document.getElementById('txtspot').classList.remove('graySpot');
          document.getElementById('txtspot')!.classList.remove('reply');
          this.Spot = this.Spot !== '' ? this.Spot : '';
        }
      }

      this.showTradeBtnFlag = false;
      this.tradeBtnActionFlag = false;
      // Pranav D BBVACLI-977 20-Mar-2023 Code changes done as validation was not cleared on parameter change if already manual spot is yes and then priced again
      this.DCNPriceValidation = false;
      // if(this.Spot = '' || parseFloat(this.Spot) == 0){
      //   this.clientEntrySpotFlag = false;
      // }
    } catch (error) {

    }
  }
  CurrencyChange(Currency: any) {
    try {
      this.fillSizeDropdown(Currency);
      // this.GetBidAskRate(Currency);
      this.setDCNDates();
      this.fetchDecimalfromCcyPair(Currency);
      this.Spread = '';
      this.Strike = '';
      this.Spot = '';
      // this.fetchSpecialSpreadValues();
      // API call added by Pranav D 6-Jun-2023 Pranav D BBVACLI-1129 as midrate was not getting refreshed resulting in wrong calculation of fee amount
      this.fetchRealTimeSpotValue();
    } catch (error) {

    }
  }

  fetchDecimalfromCcyPair(Currency: any) {
    try {
      this.receivedDeciamlofCcyPair = '';
      this.CurrencyPair.forEach(res => {
        if (Currency === res.Asset_Pair) {
          this.receivedDeciamlofCcyPair = res.Pair_DecimalRate;
           
        }
      });
      if (this.Spot !== '') {
        this.Spot = parseFloat(this.Spot).toFixed(this.receivedDeciamlofCcyPair);
      } else {
        this.Spot = '';
      }

    } catch (error) {

    }
  }



  fillSizeDropdown(Currency: any) {
    try {
      this.depoCcy = Currency.split('-')[0].trim();
      this.altCcy = Currency.split('-')[1].trim();
      this.ddlccy = this.depoCcy;

      // this.fetchRealTimeSpotValue();  //Added by Riddhip || 8march23 || 2:40pm || double api calls
      // if(this.depoCcy == 'MXN' || this.altCcy == 'MXN'){
      //   this.Fixing = "BFIX 1230 NY";
      // }
      // else{
      //   this.Fixing = "WMR 10AM NYC";
      // }
      //BBVACLI-748 |Pranav D
      //Added by Anubhav Goyal | 14-Apr-2023 | Reduce API call
      if (this.apifunctions.optCutArr == undefined || this.apifunctions.optCutArr.length <= 0) {
        this.onOptCutChange();
      } else {
        
      }
    } catch (error) {

    }
  }

  cloneSinglePricer() {
    try {
      this.viewOnly = false;
      this.buttonList = 'Clone,View,';
      this.reset();
      this.cloneReset();
      this.setDCNDates();
      this.infoMsg = '';
      // BBVAEPCLI-122 Pranav D 1-Nov-2022 calculate upfront if blank from Previous quotes
      // if else added Pranav D 10-Nov-2022 BBVAECLI-199 if solve for reoffer selected upfront should not be calculated on cone button click
      if (this.SolveForValue === 'Reoffer Price') {
        this.issuePriceBox = false;
      } else {
        if (this.Upfront === '') {
          this.GetReofferOrUpfront('Upfront');
        } else {

        }
      }
    } catch (error) {

    }
  }

  cloneReset() {
    try {
      this.Spot = '';
      this.Spread = '';
      // changes done by Pranav D 15-Jun-2023
      this.FeeAmtCcy = this.feeAmtCcyArr[0].Data_Value;
      //Added by Anubhav Goyal | BBVAEPCLI-1241 Solve for fee, franchise % and franchise amount changes to 0 on cloning | 21-Aug-2023
      if (this.SolveForValue == 'Fee') {
        this.Fee = '';
        this.Feeamt = '';
      }
    } catch (error) {

    }
  }


  priceOptions() {
    try {
      this.priceoptionflag = !this.priceoptionflag;
    } catch (error) {

    }
  }

  showSchedulePopup() {
    try {
      this.ErrorMsg = '';
      this.infoMsg = '';
      this.scheduleMsg = '';
      this.validationOnButton();
      if (this.ErrorMsg === '') {

        this.showSchedulePopupFlag = !this.showSchedulePopupFlag;
        this.todayScheduleDate();
        if (this.scheduleFreqArr && this.scheduleFreqArr.length > 0) {
          this.scheduleFreq = this.scheduleFreqArr[0].misc1;
        }


        if (this.scheduleTypeArr && this.scheduleTypeArr.length > 0) {
          this.scheduleType = this.scheduleTypeArr[0].misc1;
        }
        this.scheduleTypeChange();
      }
    } catch (error) {

    }
  }

  // changed  by Suvarna P || 30Aug2022 || BBVACLI-441 || Save and share button not working for Main pricer || assigned by Prananv D || start
  saveOptions() {
    try {
      this.saveoptionflag = !this.saveoptionflag;
    } catch (error) {
       
    }
    return false;
  }
  showsaveSharePopup() {
    try {
      this.ErrorMsg = '';
      this.infoMsg = '';
      if (!this.validationOnButton()) {
        return false;
      }
      if (this.ErrorMsg === '') {
        this.showsaveSharePopupFlag = !this.showsaveSharePopupFlag;
        // const res = this.apifunctions.GetMappedUsersAndGroups();
        // this.users = this.apifunctions.GetMappedUsersAndGroups();

        //  
        //  
        this.currentowner = (this.commonfunctions.getLoggedInUserName());
      }

    } catch (error) {
       
    }
    return false;
  }

  hidesaveSharePopup() {
    try {
      this.showsaveSharePopupFlag = false;
      this.saveportfolioId = '';
      this.userBasket = [];
      this.SaveandShareErrorMsg=''; //BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 31-08-23
    } catch (error) {
       
    }
    return false;
  }
  // save share user changes

  backKeyPress_User(e: any) {
    try {
      this.userflag = false;
      // this.shareCode = '';
      this.userCode = '';
      // this.selectedBIndex = 0;
      this.selectedBIndex_User = 0;
    } catch (error) {
       
    }
  }

  ChangeIndex_User(e: any) {
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

  selectUser(e: any) {
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
       
    }
  }

  showUser(event: any, item: any) {
    try {
      this.userflag = false;
      this.selectedBIndex_User = 0;
      this.showSuggestions_User = false;
      this.userName = '';
       
      if (this.userBasket.find((i: any) => i.Code === item.Code) === undefined) {
        this.userBasket.push({ 'Code': item.Code, 'Name': item.Name, 'Type': item.Type, 'Access': 'VIEW', 'NewAddFlag': true });
      }
    } catch (error) {
       
    }
  }
  deleteUserfromList(index: any) {
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
    const res = this.apifunctions.InsertPortfolioSharing(this.currentowner, [],
      [], this.saveportfolioId, [], [], groupdelete, userdelete);
    if (res) {
      this.userBasket.splice(index, 1);

      this.successMsg = type + ' ' + name + ' access removed sucessfully.';
    }
  }

  changeAccessofUserGroup(e: Event, index: any) {
    const target = this.commonfunctions.GetEventTarget(e);
    let res: any;
     

    this.userBasket[index]['Access'] = target.value;

  }

  sharePortfolio() {
    //BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 08-09-23
    this.SaveandShareErrorMsg = ''; 
    if (this.userBasket.length === 0) {
        this.SaveandShareErrorMsg = 'Please enter user ID or client group'; 
        return false;
    }
    //this.Save();
     //  Added condition'this.userBasket.length > 0'||BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 31-08-23
     if(this.userBasket.length > 0){
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
       
      const res = this.apifunctions.InsertPortfolioSharing(this.currentowner, [], groupView, this.saveportfolioId, userEdit, userView, [], []);
      if (res) {
        this.successMsg = 'Portfolio ID ' + this.saveportfolioId + ' saved and shared successfully.';
        this.saveportfolioId = '';
        this.userBasket = [];
        this.showsaveSharePopupFlag = false;
        }
      }
     }
      // Added ErrorMsg ||BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 31-08-23
      else{
        this.SaveandShareErrorMsg = 'Please enter user ID or client group';
    }

  }

  // changed  by Suvarna P || 30Aug2022 || BBVACLI-441 || Save and share button not working for Main pricer || assigned by Prananv D || end

  // added by Suvarna  P || 11Jul2022 || holiday weekend check validation || assign by Pranav D
  validationOnButton() {
    try {
      //  

      if (this.templateMappingArr === undefined || this.templateMappingArr.length <= 0) {
        this.ErrorMsg = "Service unavailable. Please reload the application and try again.";
        return false;
      } else {
        this.ErrorMsg = '';
      }

      //Added condition to check issuePriceValidation | 10-May-2023 | Anubhav Goyal
      if(parseFloat(this.IssuePrice) < parseFloat(this.issuePriceValidation)){
        this.ErrorMsg = 'Issue Price cannot be lower than ' + this.issuePriceValidation + ' %.';
        return false;
      }else{
        this.ErrorMsg = '';
      }
      // if (this.Strike === '' && this.SolveForValue !== 'Strike - Spread') {
      //   // Added by Riddhi P || 22Sept2022 ||Changed it to Strike cannot be empty 
      //   this.ErrorMsg = 'Strike cannot be empty.';
      //   document.getElementById('txtStrike').classList.add('error');

      //   // target.classList.add('error');
      //   // target.focus();
      //   return false;
      // } else {
      //   this.ErrorMsg = '';
      //   document.getElementById('txtStrike').classList.remove('error');
      //   // target.classList.remove('error');
      // }
      // Condition changed as asked by Nitij M 26-Sep-2022 both cannot be empty at same time
      if (this.Strike === '' && this.Spread === '') {
        if (this.SolveForValue !== 'Strike - Spread') {
          if (this.manualSpreadValue === 'Y') {
            this.ErrorMsg = 'Strike and Spread cannot be empty';
            document.getElementById('txtStrike')!.classList.add('error');
            document.getElementById('txtspread')!.classList.add('error');
            return false;
          } else {
            this.ErrorMsg = 'Strike cannot be empty';
            document.getElementById('txtStrike')!.classList.add('error');
            document.getElementById('txtspread')!.classList.remove('error');
            return false;
          }

        } else {
          document.getElementById('txtStrike')!.classList.remove('error');
          document.getElementById('txtspread')!.classList.remove('error');
        }
      } 
      // Start || added by Suvarna P || 29Aug23 ||  BBVAEPCLI-691 || Spot - NaN - when spread is toggled to YES || empty spread and spot validation on pricing
      else if(this.Spread === '' && this.manualSpreadValue === 'Y'){
        this.ErrorMsg = 'Spread cannot be empty';
        document.getElementById('txtspread')!.classList.add('error');
        return false;
      }
      else if(this.Spot === '' && this.manualSpotValue === 'Y'){
        this.ErrorMsg = 'Spot cannot be empty';
        document.getElementById('txtspot')!.classList.add('error');
        return false;
      }
      // End || added by Suvarna P || 29Aug23 ||  BBVAEPCLI-691 || Spot - NaN - when spread is toggled to YES || empty spread and spot validation on pricing

      else {
        this.ErrorMsg = '';
        document.getElementById('txtStrike')!.classList.remove('error');
        document.getElementById('txtspread')!.classList.remove('error');
      }

      //BBVAEPLCI-94 Pranav D 10-Oct-2022
      // if(this.manualSpotValue === 'Y') {
      //   if (this.Spot === '') {
      //     this.ErrorMsg = 'Spot cannot be empty while manual spot entry toggle ie yes.';
      //     document.getElementById('txtspot').classList.add('error');
      //     return false;
      //   } else {
      //     this.ErrorMsg = '';
      //     document.getElementById('txtspot').classList.remove('error');
      //   }
      // }

      if (this.onPriceChkWeekEnd) {
        if (!this.chkWeekEnd(this.Fixingdate, "ExpiryDate")) {
          return false;
        }
      }
      if (!this.validateShifter(this.Maturityshifter)) {
        //  
        return false;
        // this.ErrorMsg = 'Invalid maturity date shifter.';
      }
      const issueDate = new Date(this.Issuedate);
      const fixingDate = new Date(this.Fixingdate);
      var maturityDate = new Date(this.Maturitydate);
      maturityDate.setDate(maturityDate.getDate() + 2);
      if (fixingDate <= issueDate) {
        this.ErrorMsg = 'Final Fixing Date should be greater than Issue Date';
        return false;
      }

      if (fixingDate > maturityDate) {
        this.ErrorMsg = 'Final Fixing Date should be less or equal to Maturity - 2D';
        return false;
      }

      if (parseFloat(this.Price) < 85.00 && this.SolveForValue !== 'Reoffer Price') {
        this.ErrorMsg = 'Price cannot be lower than 85.00 %.';
        document.getElementById('txtprice')!.classList.add('error');
        return false;
      } else {
        this.ErrorMsg = '';
        document.getElementById('txtprice')!.classList.remove('error');
        // target.classList.remove('error');+
      }
      if (!this.checkValidNotionalBandB4Pricing()) {
        return false;
      }

      // added by Suvarna P || 19Jul23 || BBVACLI-1172 || DCN | Validation for fee showing when Solve for is 'Fee'
      // if (!this.allowPricingFee) {
        if (!this.allowPricingFee && this.SolveForValue !== "Fee") {
        if (!this.ValidateSpread()) {
          return false;
        }
      }

      //  
      // if (this.feePopupValidationFlag && !this.allowPricingFee) {
      //   // let feePopupValidationPopup = document.getElementById('feeSoftBlock') as HTMLElement;
      //   // this.showFeePopup = this.feePopupValidationFlag;
      //   this.showFeePopup = true;
      //   return false;
      //   // if (this.allowPricingFee) {
      //   //   return true;
      //   // } else {
      //   //   return false;
      //   // }
      // }
      return true;
    } catch (error) {

    }
  }
  // added by Suvarna  P || 11Jul2022 || holiday check validation || assign by Pranav D

  checkValidNotionalBand(e: any) {
    try {
       
      const target = this.commonfunctions.GetEventTarget(e);
      // added by Suvarna  P || 17Jun2022 || notional validation || assign by Pranav D
      this.ErrorMsg = ''
      target.classList.remove('error');
      const NotionalData = this.commonfunctions.checkValidNotional(e);
      if (NotionalData.ErrorMsg === '') {
        this.Size = NotionalData.Notional;
        e.target.value = NotionalData.Notional; // added by Suvarna  P || 25Aug2022 || notional formatting || assign by Pranav D
        const ErrorMsg = this.apifunctions.Get_ExcpRulesValidationWrapper(this.depoCcy, this.altCcy, this.Currency, this.Size.replace(/,/g, ''), this.Spread, this.Product_Id, this.product_code, this.noOfDays);
        if (ErrorMsg === "") {
          this.ErrorMsg = "";
          target.classList.remove('error');
          this.fetchSpecialSpreadValues();
        }
        else {
          this.ErrorMsg = ErrorMsg;
          // Field highlight removed on rule exception API as API never provides validation for 1 particular field 7-Oct-2022
          // target.classList.add('error');
          // target.focus();
          return false;
        }

      } else {
        this.ErrorMsg = NotionalData.ErrorMsg;
        target.classList.add('error');
      }
    } catch (error) {
      //  
    }
  }

  checkValidMaturityDateBand(e: any) {
    try {
       
      const target = this.commonfunctions.GetEventTarget(e);
       //Start: Added by Anubhav Goyal | 15-Sep-2023 | BBVAEPCLI-712 | To accept only 1 soft tenor letter
       var targetFlag = this.commonfunctions.chkValidShifter(target.value);
       if(!targetFlag){
           this.ErrorMsg = 'Please enter valid date shifter.';
           return false;
       }
       //End: Added by Anubhav Goyal | 15-Sep-2023 | BBVAEPCLI-712 | To accept only 1 soft tenor letter
      this.ErrorMsg = ''
      target.classList.remove('error');

      const ErrorMsg = this.apifunctions.Get_ExcpRulesValidationWrapper(this.depoCcy, this.altCcy, this.Currency, this.Size.replace(/,/g, ''), this.Spread, this.Product_Id, this.product_code, this.noOfDays);
      if (ErrorMsg === "") {
        this.ErrorMsg = "";
        target.classList.remove('error');
      }
      else {
        this.ErrorMsg = ErrorMsg;
        // Field highlight removed on rule exception API as API never provides validation for 1 particular field 7-Oct-2022
        // target.classList.add('error');
        // target.focus();
        return false;
      }

    } catch (error) {
      //  
    }
  }

  checkValidNotionalBandB4Pricing() {
    {

      if (this.Size === '') {
        this.ErrorMsg = 'Please enter valid notional';
        return false;
      }
      const ErrorMsg = this.apifunctions.Get_ExcpRulesValidationWrapper(this.depoCcy, this.altCcy, this.Currency, this.Size.replace(/,/g, ''), this.Spread, this.Product_Id, this.product_code, this.noOfDays);
      if (ErrorMsg === "") {
        this.ErrorMsg = "";
        document.getElementById('txtsize')!.classList.remove('error');
        // this.fetchSpecialSpreadValues();
        document.getElementById('txtsize')!.blur(); // added by Suvarna  P || 25Aug2022 || notional formatting || assign by Pranav D
        return true;
      }
      else {
        this.ErrorMsg = ErrorMsg;
        document.getElementById('txtsize')!.classList.add('error');
        document.getElementById('txtsize')!.focus();
        return false;
      }
    }
  }



  PriceValidation(e: any) {
    try {
      const target = this.commonfunctions.GetEventTarget(e);
      this.ErrorMsg = ''
      //  
      if (e.target.value < 85.00) {
        this.ErrorMsg = 'Price cannot be lower than 85.00 %.';
        target.classList.add('error');
        target.focus();
        return false;
      } else {
        this.ErrorMsg = '';
        target.classList.remove('error');
      }
    } catch (error) {

    }
  }


  IssuePriceValidation(e: any) {
    try {
      const target = this.commonfunctions.GetEventTarget(e);
      this.ErrorMsg = ''
      //  
      if (e.target.value < 0.00) {
        this.ErrorMsg = 'Price cannot be lower than 0.00 %.';
        target.classList.add('error');
        target.focus();
        return false;
      } // Added condition  to check if issuePrice is less than issuePriceValidation | Anubhav Goyal | 09-May-2023 | BBVAEPCLI-529 Block Issue price @ 85% on DCNs
      else if (parseFloat(e.target.value) < parseFloat(this.issuePriceValidation)) {
        this.ErrorMsg = 'Issue Price cannot be lower than ' + this.issuePriceValidation + ' %.';
        target.classList.add('error');
        target.focus();
        return false;
      } else {
        this.ErrorMsg = '';
        target.classList.remove('error');
      }

    } catch (error) {

    }
  }

  checkNotionalMinMax(e: any) {
    try {
      if (this.ErrorMsg === '') {
        const target = this.commonfunctions.GetEventTarget(e);
        const floatNotional = parseFloat(this.Size.toString().replace(/,/g, ''));
        this.checkNotionalRes = this.apifunctions.BBVACheckNotional('DCN', this.depoCcy);
        // added by Suvarna P. || 18May2022 || Notional Formatting issues || assigned by Pranav D.
        if (this.checkNotionalRes && this.checkNotionalRes[0] && this.checkNotionalRes[0].Minimum && this.checkNotionalRes[0].Maximum) {
          if (floatNotional < this.checkNotionalRes[0].Minimum || floatNotional > this.checkNotionalRes[0].Maximum) {
            target.classList.add('error');
            this.ErrorMsg = 'You must enter a number from '
              + this.checkNotionalRes[0].Minimum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              + ' and ' + this.checkNotionalRes[0].Maximum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.';
            target.focus();
          } else {
            target.classList.remove('error');
            this.fetchSpecialSpreadValues();
          }
        }
      }
      // this.Size = this.Size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      // e.target.value = this.Size;
    } catch (error) {
      //  
    }
  }

  changeStrikeonSpread(e: any) {
    try {
      // if (e.target.value !== '') {
      //   this.clientEntrySpotFlag = true;
      // } else {
      //   this.clientEntrySpotFlag = false;
      // }
      if (this.Spot == '' || parseFloat(this.Spot) === 0) {

        if (this.Spread !== '' && parseFloat(this.Spread) !== 0) {
          this.clientEntrySpotFlag = true;
          this.Spot = (parseFloat(this.Strike) - (parseFloat(this.Spread) / 10000)).toFixed(this.receivedDeciamlofCcyPair);
        }
        else {
          this.Spot = '';
          this.clientEntrySpotFlag = false;
        }
      }
      if (this.Strike == '' || parseFloat(this.Strike) === 0) {
        // this.clientEntrySpotFlag = false;
        if (this.Spread !== '' && parseFloat(this.Spread) !== 0) {
          this.Strike = (parseFloat(this.Spot) + (parseFloat(this.Spread) / 10000)).toFixed(4);
        }
        else {
          this.Strike = '';
        }
      }

      // if (parseFloat(this.Spot) !== 0 && this.Spot !== '') {
      //   if (parseFloat(this.Spread) !== 0 && this.Spread !== '') {
      //     this.Strike = (parseFloat(this.Spot) + (parseFloat(this.Spread) / 10000)).toFixed(4);
      //   } else {
      //     this.Strike = '';
      //   }
      // } else {
      //   this.Strike = this.Strike;
      // }

    } catch (error) {

    }
  }

  setStrikeSpotDCN(e: any, field: any) {
    const target = this.commonfunctions.GetEventTarget(e);
    //   
    //   
    if (target.value === '' && field === 'Spot') {
      this.Spread = ''
      this.clientEntrySpotFlag = false;
      return ''
    }
    return this.commonfunctions.setStrikeSpotDCN(e);
  }

  setSpotDecimalFromCcyPair(e: any) {
    try {
      const target: any = this.GetEventTarget(e);
      if (target.value.trim() === '' || isNaN(target.value)) {
        target.value = '';
      } else {
        target.value = parseFloat(target.value).toFixed(this.receivedDeciamlofCcyPair);
      }
      return target.value;
    } catch (error) {

    }
  }

  // changeSpreadOnSpot() {
  calculateSpread_old() {
    try {

      if (this.Strike !== '' && this.Spot !== '' && parseFloat(this.Strike) !== 0 && parseFloat(this.Spot) !== 0) {
        this.Spread = ((parseFloat(this.Strike) - parseFloat(this.Spot)) * 10000).toFixed(0);
      }
      if (this.Strike !== '' && this.Spread !== '' && parseFloat(this.Strike) !== 0 && parseFloat(this.Spread) !== 0) {
        // this.Spot = ((parseFloat(this.Strike) + parseFloat(this.Spread)) * 10000).toFixed(0);
        this.Spot = (parseFloat(this.Strike) - (parseFloat(this.Spread) / 10000)).toFixed(4);
        this.clientEntrySpotFlag = true;
      }
      if (this.Spread !== '' && this.Spot !== '' && parseFloat(this.Spread) !== 0 && parseFloat(this.Spot) !== 0) {
        this.Strike = (parseFloat(this.Spot) + (parseFloat(this.Spread) / 10000)).toFixed(4);
      }
      // }
    } catch (error) {

    }
  }

  calculateSpread(field: any) {
    try {

      switch (field) {
        case 'Spot':
          if (this.Spot === '') {
            this.calculateSpread('Strike');
            break;
          }
          if (this.Strike !== '' && parseFloat(this.Strike) !== 0 && this.Spot !== '' && parseFloat(this.Spot) !== 0) {
            this.Spread = (parseFloat(this.Strike) - parseFloat(this.Spot)).toFixed(this.receivedDeciamlofCcyPair);
            // START : if condition added by Pranav D BBVAEPCLI-220 flag enable disable based on view flag
            // changed by Suvarna P || 14Aug23 || BBVACLI-1230 || Spread toggle to become yes, if strike is manually input and spot toggle is 'Yes'
            // this.manualSpreadValue = 'N';
            this.manualSpreadValue = 'Y';

            // END : if condition added by Pranav D BBVAEPCLI-220 flag enable disable based on view flag
          }
          else if (this.Spread !== '' && parseFloat(this.Spread) !== 0 && this.Spot !== '' && parseFloat(this.Spot) !== 0) {
            this.Strike = (parseFloat(this.Spread) + parseFloat(this.Spot)).toFixed(this.receivedDeciamlofCcyPair);
          }
          else {
            this.Spread = this.Spread === '' ? '' : this.Spread;
            this.Strike = this.Strike == '' ? '' : this.Strike;
          }
          break;
        case 'Strike':
          if (this.Strike === '') {
            this.calculateSpread('Spot');
            break;
          }
          if (this.Spot !== '' && parseFloat(this.Spot) !== 0 && this.Strike !== '' && parseFloat(this.Strike) !== 0) {
            this.Spread = (parseFloat(this.Strike) - parseFloat(this.Spot)).toFixed(this.receivedDeciamlofCcyPair);
            // START : if condition added by Pranav D BBVAEPCLI-220 flag enable disable based on view flag
           // changed by Suvarna P || 14Aug23 || BBVACLI-1230 || Spread toggle to become yes, if strike is manually input and spot toggle is 'Yes'
           // added by Suvarna P || 29Aug23 ||  BBVAEPCLI-583 || FX- Deal done missing spread and spot || when manualSpot is Y, then manualSpread should be Y only when solveFor is not Strike/Spread
	          if(this.manualSpotValue === 'Y' ){
              // changed by Suvarna P || 11Sep23 || BBVACLI-1265 || 8 September Release: Angular code improvement || this, not required
              // if(this,this.SolveForValue !== 'Strike - Spread'){
              if(this.SolveForValue !== 'Strike - Spread'){
                this.manualSpreadValue = 'Y';
              }
            }
            else{
              this.manualSpreadValue = 'N';
            }
            // END : if condition added by Pranav D BBVAEPCLI-220 flag enable disable based on view flag
          } else {
            this.Spread = this.Spread === '' ? '' : this.Spread;
            this.Spot = this.Spot == '' ? '' : this.Spot;
          }
          // on enterig strike only spot was NaN resolved Pranav D 30-Sep-2022
          // if ((this.Spot === '' || parseFloat(this.Spot) === 0) && (this.Spread !== '' || parseFloat(this.Spread) !== 0)) {
          //   if (this.Strike !== '' || parseFloat(this.Strike) !== 0) {
          //     this.Spot = (parseFloat(this.Strike) - parseFloat(this.Spread)).toFixed(this.receivedDeciamlofCcyPair);
          //   }
          // }

          if ((this.Spot === '' || parseFloat(this.Spot) === 0)) {
            if (this.Spread !== '' && parseFloat(this.Spread) !== 0) {
              if (this.Strike !== '' || parseFloat(this.Strike) !== 0) {
                this.Spot = (parseFloat(this.Strike) - parseFloat(this.Spread)).toFixed(this.receivedDeciamlofCcyPair);
               // changed by Suvarna P || 14Aug23 || BBVACLI-1230 || Spread toggle to become yes, if strike is manually input and spot toggle is 'Yes'
	        this.manualSpotValue = 'Y';
                this.clientEntrySpotFlag = true;
                // BBVAEPCLI-220 Pranav D 16-Nov-2022 no need to enable manual spread flag on receiving response
                // this.manualSpotValue = 'Y';
              }
            }
          }


          break;
        case 'Spread':
           
          if (this.Spread === '') {
            this.calculateSpread('Strike');
            break;
          }
           
           
          if (this.Strike !== '' && parseFloat(this.Strike) !== 0 && this.Spread !== '' && parseFloat(this.Spread) !== 0) {
            // if (this.Strike !== '' && parseFloat(this.Strike) !== 0 ) {
            // this.Spot = (parseFloat(this.Strike) - (parseFloat(this.Spread) / 10000)).toFixed(4);
            this.Spot = (parseFloat(this.Strike) - (parseFloat(this.Spread))).toFixed(this.receivedDeciamlofCcyPair);
            this.manualSpotValue = 'Y';
            this.clientEntrySpotFlag = true;
             
          }
          else if (this.Spot !== '' && parseFloat(this.Spot) !== 0 && this.Spread !== '' && parseFloat(this.Spread) !== 0) {
            // if (this.Strike !== '' && parseFloat(this.Strike) !== 0 ) {
            this.Strike = (parseFloat(this.Spread) + parseFloat(this.Spot)).toFixed(4);
            // this.clientEntrySpotFlag = true;
          }
          else {
            this.Strike = this.Strike == '' ? '' : this.Strike;
            this.Spot = this.Spot == '' ? '' : this.Spot;
            this.Spread = this.Spread == '' ? '' : this.Spread;

          }
          break;
      }

    } catch (error) {

    }
  }
  /*
    changeSpreadonStrike() {
      if (this.SolveForValue === 'Strike - Spread') {
        this.Spread = '';
        this.Strike = '';
      } else {
        if (parseFloat(this.Spot) !== 0 && this.Spot !== '') {
          if (parseFloat(this.Strike) !== 0 && this.Strike !== '') {
            this.Spread = ((parseFloat(this.Strike) - parseFloat(this.Spot)) * 10000).toFixed(0);
          } else {
            this.Spread = '';
          }
        } else {
          this.Spread = this.Spread;
        }
      }
    }
  */

  // changedSpotField(e) {
  setClientEntrySpotFlag(e: any) {
    try {
      const target = this.commonfunctions.GetEventTarget(e);
       
      if (target.value == '' || parseFloat(target.value) == 0) {
        this.clientEntrySpotFlag = false;
      }
      else {
        this.clientEntrySpotFlag = true;
      }
      // if (this.clientEntrySpotFlag) {
      //   target.classList.add('blackSpot');
      // } else {
      //   target.classList.remove('blackSpot');
      // }
    } catch (error) {

    }
  }

  calcSpreadOnSpot() {
    try {

      if (this.Strike !== '' && this.Spot !== '' && parseFloat(this.Strike) !== 0 && parseFloat(this.Spot) !== 0) {
        this.Spread = ((parseFloat(this.Strike) - parseFloat(this.Spot))).toFixed(4);
      }

      // if (this.Strike === '' || parseFloat(this.Strike) === 0) {
      //   this.Strike = (parseFloat(this.Spot) + parseFloat(this.Spread)).toFixed(4);
      // }


    } catch (error) {

    }
  }

  fetchCcyPair() {
    try {
      //  
      // instead of TOK pass fixing dropdown value
      // this.CurrencyPair = this.apifunctions.CcypairsDCN((this.commonfunctions.getLoggedInUserName())[1].EntityId, this.Product_Id, "FXAQ", this.Mode, "TOK", "", "Y", "", "", "");
      // this.CurrencyPair = this.apifunctions.CcypairsDCN((this.commonfunctions.getLoggedInUserName())[1].EntityId, 33, "FXAQ", this.Mode, "TOK", "", "Y", "", "", "");
      //START : added by Anubhav G |20-03-2023
      if (this.CurrencyPair == undefined || this.apifunctions.ccypairsDCN.length <= 0) {
        this.CurrencyPair = this.apifunctions.CcypairsDCN((this.commonfunctions.getEntityOfUser()), this.Product_Id, this.product_code,
          this.Mode, this.optionCut, "", "Y", "", "", "");
         
      } else {
        this.CurrencyPair = this.apifunctions.ccypairsDCN;
         
      }
      //END : added by Anubhav G |20-03-2023
      //  
      this.CurrencyPair.forEach(res => {
        if (this.Currency === res.Asset_Pair) {
          this.receivedDeciamlofCcyPair = res.Pair_DecimalRate;
        }
      });

    } catch (error) {

    }
  }
  // added by suvarna P || 16Jun2022 || DCN Date Calculation || assigned by Pranav D Pranav D || start
  getDatesOnLoad() {
    try {
      if (this.location === 'Mexico') {
        this.Issueshift = "D+2";
      } else {
        // BBVAEPCLI-165 default value changes Pranav D 2-Nov-2022
        this.Issueshift = "D+5";
      }

      if (this.location === 'Mexico') {
        this.Fixingshifter = "M-2";
      } else {
        // BBVAEPCLI-165 default value changes Pranav D 2-Nov-2022
        this.Fixingshifter = "M-5";
      }

      this.Maturityshifter = '14D';

      // this.setAllDates(); old service
       
      this.setDCNDates();


    } catch (error) {

    }
  }
  // added by Suvarna P || 04Jul2022 || DCN Dates || start
  setDCNDates() {

    if (!this.validateShifter(this.Maturityshifter)) {
      return false;
    }

    var ProductId = this.Product_Id; // 5;
    var I_ProductCode = this.product_code; //'FXProducts';
    var I_Mode = this.Mode; // 'FXOSEN';
    var optioncut = this.Fixing;
    var tradeDate = this.today;
    var Fixingshifter = this.Fixingshifter == "" ? "" : this.Fixingshifter.split('-')[1];
    var Issueshift = this.Issueshift == "" ? "" : this.Issueshift.split('+')[1];
     
    //Added this.format | Anubhav Goyal | 14-Mar-2023
    var dateResponse = this.apifunctions.DCNDateCalculationAPI(
      this.depoCcy, this.altCcy, this.Currency, tradeDate, "", "", this.Maturityshifter, ProductId, I_ProductCode, I_Mode, optioncut,
      this.Maturityshifter.split('D')[0], Fixingshifter, Issueshift, Issueshift,this.format);



    if (dateResponse) { // changed by Suvarna P || 05Jul2022 || shifter changes suggested by Shikhar G || assigned by Pranav D
      this.Issuedate = this.Issueshift !== '' ? this.datepipe.transform(dateResponse.SpotDate, 'yyyy-MM-dd') : this.Issuedate;
      this.Fixingdate = this.Fixingshifter !== '' ? this.datepipe.transform(dateResponse.FixingDate, 'yyyy-MM-dd') : this.Fixingdate;
       

      this.Maturitydate = this.Maturityshifter !== '' ? this.datepipe.transform(dateResponse.MaturityDate, 'yyyy-MM-dd') : this.Maturitydate;
      var date1 = new Date(this.Issuedate);
      var date2 = new Date(this.Maturitydate);
      var Time = date2.getTime() - date1.getTime();
      var Days = Time / (1000 * 3600 * 24); //Diference in Days
      this.noOfDays = Days;
      this.fetchSpecialSpreadValues();
      // this.feeAmtCalc(); // by Suvarna P || no need ||  already called in fetchSpecialSpreadValues
      // BBVAEPCLI-208 Pranav D 17-Nov-2022 remove red color of final fixing date  on final fixing shifter change
      document.getElementById('txtFixingdate')!.classList.remove('error');
    }
    if (this.SolveForValue !== 'Coupon') {
      this.ChangeCouponPct('CpnPct');
    }

    // START BBVAEPCLI-208 Pranav D 18-Nov-2022 date validation on date selection instead of Price button click
    const issueDate = new Date(this.Issuedate);
    const fixingDate = new Date(this.Fixingdate);
    var maturityDate = new Date(this.Maturitydate);
    maturityDate.setDate(maturityDate.getDate() - 2);
    if (fixingDate < issueDate) {
      this.ErrorMsg = 'Final Fixing Date should be greater than or equal to Issue Date';
      document.getElementById('txtFixingdate')!.classList.add('error');
      return false;
    } else {
      document.getElementById('txtFixingdate')!.classList.remove('error');
    }

    if (fixingDate > maturityDate) {
      this.ErrorMsg = 'Final Fixing Date should be less or equal to Maturity - 2B';
      document.getElementById('txtFixingdate')!.classList.add('error');
      return false;
    } else {
      document.getElementById('txtFixingdate')!.classList.remove('error');
    }
    // END BBVAEPCLI-208 Pranav D 18-Nov-2022 date validation on date selection instead of Price button click

  }
  // added by Suvarna P || 04Jul2022 || DCN Dates || end
  setAllDates() {

    this.getIssueDate();

    this.getMaturityDate();
    this.getFixingDate();
  }

  getIssueDate() {
    try {
      //  
      if (this.Issueshift === '') {
        return true;
      }

      var issueShift = this.Issueshift.split('+')[1].trim();
      //  
      // this.apifunctions.GetSpotDateFromOffset('14-Jun-2022',5);
      var dateRes = this.apifunctions.GetSpotDateFromOffset(this.today, issueShift);
      //  
      // this.Issuedate = this.commonfunctions.formatDate(dateRes);
      this.Issuedate = this.datepipe.transform(dateRes, 'yyyy-MM-dd');
      //  
      // this.getFixingDate();
      //this.getMaturityDate();
      //  this.apifunctions.GetMaturityDateUsingBusinessDays('14-Jun-2022', '5D', 'USD');
      //  this.apifunctions.GetMaturityDateForNegativeTenor('14-Jun-2022', '-5', 'USD');
    } catch (error) {

    }
  }

  getFixingDate() {
    if (this.Fixingshifter === '') {
      return true;
    }
    var FixingShifter = this.Fixingshifter.split('-')[1].trim();
    //  this.apifunctions.GetMaturityDateForNegativeTenor('19-Jun-2022', '-5', 'USD');
    //  this.apifunctions.GetMaturityDateForNegativeTenor('2022-06-19', '-5', 'USD');
    // var dateRes = this.apifunctions.GetMaturityDateForNegativeTenor(this.Issuedate, '-' + fixingShifter, this.ddlccy);
    var dateRes = this.apifunctions.GetMaturityDateForNegativeTenor(this.Maturitydate, '-' + FixingShifter, this.ddlccy);
    //  
    // this.Issuedate = this.commonfunctions.formatDate(dateRes);
    this.Fixingdate = this.datepipe.transform(dateRes, 'yyyy-MM-dd');
     
    //  
    // this.getMaturityDate();
  }

  getMaturityDate() {
    if (this.Maturityshifter === '') {
      return true;
    }
    //  this.apifunctions.GetMaturityDateUsingBusinessDays('14-Jun-2022', '5D', 'USD');
    //  this.apifunctions.GetMaturityDateUsingBusinessDays('18-Jun-2022', '5D', 'USD');
    //  this.apifunctions.GetMaturityDateUsingBusinessDays('2022-06-18', '5D', 'USD');
    // var dateRes = this.apifunctions.GetMaturityDateUsingBusinessDays(this.Fixingdate, this.Maturityshifter, this.ddlccy);
    // var dateRes = this.apifunctions.GetMaturityDateUsingBusinessDays(this.Issuedate, this.Maturityshifter, this.ddlccy);
    var Maturityshifter = this.Maturityshifter.split('D')[0].trim();
    var dateRes = this.apifunctions.GetSpotDateFromOffset(this.Issuedate, Maturityshifter);

    //  
    // this.Issuedate = this.commonfunctions.formatDate(dateRes);
    this.Maturitydate = this.datepipe.transform(dateRes, 'yyyy-MM-dd');
    //  
    // this.getFixingDate();
    // Maturityshifter
    // Maturitydate

  }

  ChangeIssueDate() {
    try {
      this.Issueshift = '';
      let date = new Date(this.Issuedate);
      const dayCount = date.getDay();
       
      if (dayCount === 0 || dayCount === 6) {
        this.ErrorMsg = 'Selected date falls on weekend. Please select valid date.';
      } else {
        this.ErrorMsg = '';
      }
      this.getMaturityDate();
      this.getFixingDate();
      // this.getMaturityDate();
    } catch (error) {

    }
  }

  fixingShifterChange() {
    try {
      // this.setDCNDates();
      this.getFixingDate();
    } catch (error) {

    }
  }

  // added by Suvarna  P || 11Jul2022 || holiday weekend check validation || assign by Pranav D || start
  fixingDateChange() {
    this.Fixingshifter = '';
    // let date = new Date(this.Fixingdate);
    // const dayCount = date.getDay();
    //  
    // this.chkWeekEnd(this.Fixingdate, "FixingDate");
    this.chkWeekEnd(this.Fixingdate, "ExpiryDate"); // for fixing Date
    // this.chkWeekEnd(this.Fixingdate, "SpotDate"); // for issue Date
    // this.chkWeekEnd(this.Fixingdate, "MaturityDate"); // for Maturity Date
    //  

    // START BBVAEPCLI-208 Pranav D 18-Nov-2022 date validation on date selection instead of Price button click
    if (!this.chkWeekEnd(this.Fixingdate, "ExpiryDate")) {

    } else {
      const issueDate = new Date(this.Issuedate);
      const fixingDate = new Date(this.Fixingdate);
      var maturityDate = new Date(this.Maturitydate);
      maturityDate.setDate(maturityDate.getDate() - 2);
      if (fixingDate < issueDate) {
        this.ErrorMsg = 'Final Fixing Date should be greater than or equal to Issue Date';
        document.getElementById('txtFixingdate')!.classList.add('error');
        return false;
      } else {
        document.getElementById('txtFixingdate')!.classList.remove('error');
      }

      if (fixingDate > maturityDate) {
        this.ErrorMsg = 'Final Fixing Date should be less than or equal to Maturity - 2B';
        document.getElementById('txtFixingdate')!.classList.add('error');
        return false;
      } else {
        document.getElementById('txtFixingdate')!.classList.remove('error');
      }
      // END BBVAEPCLI-208 Pranav D 18-Nov-2022 date validation on date selection instead of Price button click
    }
  }

  chkWeekEnd(strDate: any, dateMode: any) {
    // var CheckHolidayOnSelectedDateResult = this.apifunctions.CheckHolidayOnSelectedDate(this.altCcy, dateMode, this.depoCcy, strDate, this.Mode, this.Product_Id);
    var CheckHolidayOnSelectedDateResult = this.apifunctions.CheckHolidayOnSelectedDate(this.altCcy, dateMode, this.depoCcy, strDate, this.Mode, this.Product_Id, this.noOfDays);
    // var CheckHolidayOnSelectedDateResult = this.apifunctions.CheckHolidayOnSelectedDate(this.altCcy, dateMode, this.depoCcy, "24-Jul-2022", this.Mode, this.Product_Id);

    if (CheckHolidayOnSelectedDateResult.IsHoliday === true) {
      this.ErrorMsg = 'Selected date falls on weekend or holiday. Please select valid date.';
      // BBVAEPCLI-208 Pranav D 17-Nov-2022
      document.getElementById('txtFixingdate')!.classList.add('error');
      return false;
    } else {
      this.ErrorMsg = '';
      // BBVAEPCLI-208 Pranav D 17-Nov-2022
      document.getElementById('txtFixingdate')!.classList.remove('error');
      return true;
    }
    /*
    let date = new Date(strDate);
    const dayCount = date.getDay();
    if (dayCount === 0 || dayCount === 6) {
      this.ErrorMsg = 'Selected date falls on weekend. Please select valid date.';
      return false;
    } else {
      this.ErrorMsg = '';
      return true;
    }
    */
  }
  // added by Suvarna  P || 11Jul2022 || holiday weekend check validation || assign by Pranav D // end


  maturityShifterChange() {
    this.getMaturityDate();
    this.getFixingDate();
  }

  maturityDateChange() {
    //  
    try {
      this.Maturityshifter = '';
      let date = new Date(this.Maturitydate);
      const dayCount = date.getDay();
      //  
      if (dayCount === 0 || dayCount === 6) {
        this.ErrorMsg = 'Selected date falls on weekend. Please select valid date.';
      } else {
        this.ErrorMsg = '';
      }
       
      this.getFixingDate();
    } catch (error) {

    }
  }

  changeMaturityshifter() {
    try {
      if (this.Maturityshifter.includes('d') || this.Maturityshifter.includes('D')) {
        this.Maturityshifter = this.Maturityshifter.toString().toUpperCase();
      }
      else if (this.Maturityshifter.includes('m') || this.Maturityshifter.includes('M')) {
        this.Maturityshifter = this.Maturityshifter.toString().toUpperCase();
        // this.Maturityshifter.includes('W') added by Pranav D 13-Oct-2022 BBVAEPCLI-115
      } else if (this.Maturityshifter.includes('w') || this.Maturityshifter.includes('W')) {
        this.Maturityshifter = this.Maturityshifter.toString().toUpperCase();
      }
      else {
        this.Maturityshifter = this.Maturityshifter + 'D';
      }
       

      // START BBVAEPCLI-208 Pranav D 18-Nov-2022 date validation on date selection instead of Price button click
      const issueDate = new Date(this.Issuedate);
      const fixingDate = new Date(this.Fixingdate);
      var maturityDate = new Date(this.Maturitydate);
      maturityDate.setDate(maturityDate.getDate() + 2);
      if (fixingDate > issueDate || fixingDate == issueDate) {
        this.ErrorMsg = 'Final Fixing Date should be greater than or equal to Issue Date issueDate fixingDate';
        document.getElementById('txtFixingdate')!.classList.add('error');
        return false;
      } else {
        document.getElementById('txtFixingdate')!.classList.remove('error');
      }

      if (fixingDate > maturityDate) {
        this.ErrorMsg = 'Final Fixing Date should be less or equal to Maturity - 2B';
        document.getElementById('txtFixingdate')!.classList.add('error');
        return false;
      } else {
        document.getElementById('txtFixingdate')!.classList.remove('error');
      }
      // END BBVAEPCLI-208 Pranav D 18-Nov-2022 date validation on date selection instead of Price button click

    } catch (error) {

    }
  }

  onChangeDdlccy() {
    // this.getFixingDate();
    // this.getMaturityDate();
    this.altCcy = this.depoCcy;
    this.depoCcy = this.ddlccy;
    this.setDCNDates();
    if (!this.checkValidNotionalBandB4Pricing()) {
      return false;
    }
  }
  // added by suvarna P || 16Jun2022 || DCN Date Calculation || assigned by Pranav D Pranav D || end



  setSolveFor_old(solveForVal: any) {
    try {
      this.reset();
      if (solveForVal === 'Coupon') {
        this.CpnPct = '';
        this.Spot = '';
        // if (this.Spot === '') {
        //   document.getElementById('txtspot').classList.remove('blackSpot');
        //   this.clientEntrySpotFlag = false;
        // } else {
        // }
        this.Spread = '';
        // if (this.Spread !== '' && this.Spot !== '') {
        //   this.Strike = parseFloat(this.Spot) + (parseFloat(this.Spread) / 10000);
        //   this.Strike = '';
        // } else {
        //   // this.Strike = parseFloat(this.Spot) + (parseFloat(this.Spread) / 10000);
        //   this.Strike = '';
        // }

        // this.changeSpreadonStrike();
        this.Price = '100.00';//Changed 99.50 to 100.00 | Anubhav Goyal | 11-May-2023 | BBVAEPCLI-534 DCN: Change default reoffer price to 100
        // this.Fee = '5.00';
        if (this.noOfDays) this.fetchSpecialSpreadValues(); // chnaged by suvarna P || 12Jul2022 || noOfDays related changes
      } else if (solveForVal === 'Strike - Spread') {
        this.Strike = '';
        this.Spread = '';
        this.CpnPct = '5.00';
        this.Price = '100.00';//Changed 99.50 to 100.00 | Anubhav Goyal | 11-May-2023 | BBVAEPCLI-534 DCN: Change default reoffer price to 100
        // this.Fee = '5.00';
        if (this.noOfDays) this.fetchSpecialSpreadValues(); // chnaged by suvarna P || 12Jul2022 || noOfDays related changes
        this.Spot = '';
        // if (this.Spot === '') {
        //   document.getElementById('txtspot').classList.remove('blackSpot');
        //   this.clientEntrySpotFlag = false;
        // } else {
        // }
      } else if (solveForVal === 'Reoffer Price') {
        this.Price = '';
        this.CpnPct = '5.00';
        this.Spread = '';
        this.Spot = '';
        // if (this.Spot === '') {
        //   document.getElementById('txtspot').classList.remove('blackSpot');
        //   this.clientEntrySpotFlag = false;
        // } else {
        // }
        // if (this.Spread !== '' && this.Spot !== '') {
        //   this.Strike = parseFloat(this.Spot) + (parseFloat(this.Spread) / 10000);
        //   this.Strike = '';
        // } else {
        //   // this.Strike = parseFloat(this.Spot) + (parseFloat(this.Spread) / 10000);
        //   this.Strike = '';
        // }
        // this.changeSpreadonStrike();
        // this.Fee = '5.00';
        if (this.noOfDays) this.fetchSpecialSpreadValues(); // chnaged by suvarna P || 12Jul2022 || noOfDays related changes
      } else {
        this.Fee = '';
        this.CpnPct = '5.00';
        this.Spread = '';
        this.Spot = '';
        // if (this.Spot === '') {
        //   document.getElementById('txtspot').classList.remove('blackSpot');
        //   this.clientEntrySpotFlag = false;
        // } else {
        // }
        // if (this.Spread !== '' && this.Spot !== '') {
        //   this.Strike = parseFloat(this.Spot) + (parseFloat(this.Spread) / 10000);
        //   this.Strike = '';
        // } else {
        //   // this.Strike = parseFloat(this.Spot) + (parseFloat(this.Spread) / 10000);
        //   this.Strike = '';
        // }
        // this.changeSpreadonStrike();
        this.Price = '100.00';//Changed 99.50 to 100.00 | Anubhav Goyal | 11-May-2023 | BBVAEPCLI-534 DCN: Change default reoffer price to 100
      }

      this.feeAmtCalc(this.midRate);
    } catch (error) {

    }

  }
  setSolveFor() {
    try {
      this.reset();
      if (this.SolveForValue === 'Coupon') {
        this.CpnPct = '';
        this.Price = this.Price === '' ? '100.00' : this.Price;//Changed 99.50 to 100.00 | Anubhav Goyal | 11-May-2023 | BBVAEPCLI-534 DCN: Change default reoffer price to 100
        this.setIssuePriceCheckBox(this.issuePriceBox);
        this.Spot = '';
        this.Spread = '';
        this.Strike = '';
        // Upfront change on solve for change BBVAEPCLI-122
        this.GetReofferOrUpfront('Upfront');
        // BBAEPCLI-210 Pranav D 23-nov-2022
        this.CouponPct = '';
        if (this.noOfDays) this.fetchSpecialSpreadValues(); // chnaged by suvarna P || 12Jul2022 || noOfDays related changes
      } else if (this.SolveForValue === 'Strike - Spread') {
        this.Strike = '';
        this.IssuePrice = this.IssuePrice === '' ? '100.00' : this.IssuePrice;
        this.Price = this.Price === '' ? '100.00' : this.Price;//Changed 99.50 to 100.00 | Anubhav Goyal | 11-May-2023 | BBVAEPCLI-534 DCN: Change default reoffer price to 100
        this.setIssuePriceCheckBox(this.issuePriceBox);
        this.CpnPct = this.CpnPct === '' ? '5.00' : this.CpnPct;
        this.Spot = '';
        this.Spread = '';
        if (this.noOfDays) this.fetchSpecialSpreadValues(); // chnaged by suvarna P || 12Jul2022 || noOfDays related changes
        // Upfront change on solve for change BBVAEPCLI-122
        this.GetReofferOrUpfront('Upfront');
        // BBAEPCLI-210 Pranav D 23-nov-2022
        this.ChangeCouponPct('CpnPct');

      } else if (this.SolveForValue === 'Reoffer Price') {
        this.Price = '';
        this.CpnPct = this.CpnPct === '' ? '5.00' : this.CpnPct;
        this.IssuePrice = this.IssuePrice === '' ? '100.00' : this.IssuePrice;
        this.Spot = '';
        this.Spread = '';
        this.Strike = '';
        // Upfront change on solve for change BBVAEPCLI-122
        this.Upfront = '';
        if (this.noOfDays) this.fetchSpecialSpreadValues(); // chnaged by suvarna P || 12Jul2022 || noOfDays related changes
        // BBAEPCLI-210 Pranav D 23-nov-2022
        this.ChangeCouponPct('CpnPct');
      } else {
        this.Fee = '';
        this.CpnPct = this.CpnPct === '' ? '5.00' : this.CpnPct;
        this.Price = this.Price === '' ? '100.00' : this.Price;//Changed 99.50 to 100.00 | Anubhav Goyal | 11-May-2023 | BBVAEPCLI-534 DCN: Change default reoffer price to 100
        this.setIssuePriceCheckBox(this.issuePriceBox);
        this.Spot = '';
        this.Spread = '';
        this.Strike = '';
        // Upfront change on solve for change BBVAEPCLI-122
        this.GetReofferOrUpfront('Upfront');
        // BBAEPCLI-210 Pranav D 23-nov-2022
        this.ChangeCouponPct('CpnPct');
      }
      this.feeAmtCalc(this.midRate);
    } catch (error) {

    }

  }
  /* no need 
    GetBidAskRate(currency) {
      try {
        this.bidAskRate = this.apifunctions.GetBidAskRate(currency, this.product_code, this.Mode, (this.commonfunctions.getLoggedInUserName())[0].UserId);
        //  
        // this.Spot = this.bidAskRate
      } catch (error) {
  
      }
    }
    */
  /*
    getLocation(onBehalfOf) {
      try {
        // let locationArr: any[] = [];
        // locationArr = this.apifunctions.GetBookLocation(onBehalfOf, (this.commonfunctions.getLoggedInUserName())[1].EntityId);
        // this.location = locationArr[0].Location;
        //  
  
      } catch (error) {
  
      }
    }
    */


  GetFXOptionCut() {
    try {
      this.ddlOptCut = [];
      // this.optCutArr = this.apifunctions.GetFXOptionCut((this.commonfunctions.getLoggedInUserName())[0].UserId);
      // this.optCutArr.forEach(res => this.ddlOptCut.push(res.Cut_Long_Name));
      //  
      // START : BBVAEPCLI-177 Pranav D 28-Nov-2022
      this.mappedformatlistLocation.forEach((res: any) => {
        if (res.Data_Value === this.format) {
          (res.Misc3).split(',').forEach((data: any) => {
            this.ddlOptCut.push(data.trim());
          })
        }
      });
      // END : BBVAEPCLI-177 Pranav D 28-Nov-2022
       
    } catch (error) {

    }
  }

  onOptCutChange() {
    try {
      // this.optCutTime = this.optCutArr[this.optCutArr.findIndex(res => res.Cut_Long_Name === this.Fixing)].Cut_Time_HHMM;
      // this.optCutLocation = this.optCutArr[this.optCutArr.findIndex(res => res.Cut_Long_Name === this.Fixing)].Cut_Location;
      // this.reference = this.optCutArr[this.optCutArr.findIndex(res => res.Cut_Long_Name === this.Fixing)].Fixing_Source;
      // this.optionCut = this.optCutArr[this.optCutArr.findIndex(res => res.Cut_Long_Name === this.Fixing)].Option_Cut;
      // this.Spread = '';
      //  
      //START : BBVACLI-748 Pranav D 18-Jan-2023
      this.optCutArr = this.apifunctions.GetFXOptionCut((this.commonfunctions.getLoggedInUserName()));
      this.optCutArr.forEach((res: any) => {
        if (this.Fixing === res.Cut_Long_Name) {
          this.reference = res.Fixing_Source;
          this.optCutLocation = res.Cut_Location;
          this.optCutTime = res.Cut_Time_HHMM;
        }
      });
      //END : BBVACLI-748 Pranav D 18-Jan-2023
    } catch (error) {

    }
  }

  sortMaturityShifterArr() {
    try {
      // let a: any = [];
      // let b: any = [];
      // let c: any = [];

      // this.maturityDateShifter.forEach(res => a.push(parseFloat(res.Data_Value.split('D')[0])));

      // b = a.sort((a, b) => {
      //   return a - b;
      // });
      // b.forEach(element => {
      //   c.push(element + 'D');
      // });

      // this.maturityDateShifter = [];
      // c.forEach(element => {
      //   this.maturityDateShifter.push(element);
      // });
      // BBVAEPCLI-44 Pranav D 17-Aug-2022 
      this.maturityDateShifter = this.maturityDateShifter.sort((a, b) => {
        return parseFloat(a.Misc2) - parseFloat(b.Misc2);
      });

      //  
    } catch (error) {

    }
  }

  sortIssueShifterArr() {
    try {
      let a: any = [];
      let b: any = [];
      let c: any = [];

      this.issueDateShifter.forEach(res => a.push((parseFloat(res.Data_Value.split('+')[1]))));
      b = a.sort((a: number, b: number) => {
        return a - b;
      });
      b.forEach((element: string) => {
        c.push('D+' + element);
      });
      this.issueDateShifter = [];
      c.forEach((element: any) => {
        this.issueDateShifter.push(element);
      });
       
      // if (this.location !== 'Mexico') {
      //   this.issueDateShifter.indexOf("D+2");
      //   this.issueDateShifter.splice(this.issueDateShifter.indexOf("D+2"), this.issueDateShifter.indexOf("D+2") + 1);
      //    
      // }
      //  

    } catch (error) {

    }
  }

  sortFixingShifterArr() {
    try {
      let a: any = [];
      let b: any = [];
      let c: any = [];

      this.fixingDateShifter.forEach(res => a.push((res.Data_Value)));

      this.fixingDateShifter = [];
      a.forEach((element: any) => {
        this.fixingDateShifter.push(element);
      });

      // if (this.location !== 'Mexico') {
      //   this.fixingDateShifter.indexOf("M-2");
      //   this.fixingDateShifter.splice(this.fixingDateShifter.indexOf("M-2"), this.fixingDateShifter.indexOf("M-2") + 1);
      //    
      // }
       
    } catch (error) {

    }
  }

  fetchSpecialSpreadValues() {
    try {
       
      if (this.onBehalfOf === undefined) {
        this.onBehalfOf = '';
      } else {
        this.onBehalfOf = this.onBehalfOf;
      }
      this.dealDepoDays = this.noOfDays; // added by suvarna p || noOfDays related Chnages || 12Jul2022
      this.specialSpreadArr = this.apifunctions.specialSpreadData(this.depoCcy, this.altCcy, this.dealDepoDays, this.onBehalfOf,
        (this.commonfunctions.getEntityOfUser()), this.Product_Id, this.product_code, this.Size.replace(/,/g, ''), "BUY");
       
      // this.minSpread = this.specialSpreadArr[this.specialSpreadArr.findIndex(res => res.CurrencyPair === this.Currency)].MinimumSpreadPercentage;
      // this.maxSpread = this.specialSpreadArr[this.specialSpreadArr.findIndex(res => res.CurrencyPair === this.Currency)].MaximumSpreadPercentage;
      // this.defaultSpread = this.specialSpreadArr[this.specialSpreadArr.findIndex(res => res.CurrencyPair === this.Currency)].SpreadDefault;
      if (this.specialSpreadArr.length > 0) {
        // START : min max spread fixed to decimal 4 Pranav D 3-Nov-2022
        this.minSpread = parseFloat(this.specialSpreadArr[0].Min_Spread_Percentage).toFixed(4);
        this.maxSpread = parseFloat(this.specialSpreadArr[0].Max_Spread_Percentage).toFixed(4);
        // END : min max spread fixed to decimal 4 Pranav D 3-Nov-2022
        // Added by Riddhi P ||29Sept2022||showing four decimals places for fee(%) p.a. on default
        this.defaultSpread = parseFloat(this.specialSpreadArr[0].SpreadDefault).toFixed(4);
        // Added by Riddhi P ||22Sept2022||On solving for fee, changing the maturity date leads to populating the fee% field
        if (this.defaultSpread !== '' && this.defaultSpread !== '0' && this.SolveForValue != "Fee") {
          // START : special spread array length checked to set fee to 0 if lenght is 0 Pranav D 3-Nov-2022 BBVACLI-578
          if (this.specialSpreadArr.length > 0) {
            this.Fee = this.defaultSpread;
            this.feeAmtCalc(this.midRate);
          } else {
            this.Fee = '0';
            // Fee amount shown 0 if fee % is 0 Pranav D 10-Nov-2022
            this.Feeamt = '0.00';
          }
          // END : special spread array length checked to set fee to 0 if lenght is 0 Pranav D 3-Nov-2022 BBVACLI-578
        } else {
          this.Fee = '0';
          // Fee amount shown 0 if fee % is 0 Pranav D 10-Nov-2022
          this.Feeamt = '0.00';
        }
      }
      else {
        this.Fee = '0';
        // Fee amount shown 0 if fee % is 0 Pranav D 10-Nov-2022
        this.Feeamt = '0.00';
        // START : min max spread set to blank if API response is bank on changing ccy pair Pranav D 4-Nov-2022 BBVACLI-582
        this.minSpread = '';
        this.maxSpread = '';
        this.defaultSpread = '';
        // END : min max spread set to blank if API response is bank on changing ccy pair Pranav D 4-Nov-2022 BBVACLI-582
      }
       
      //Added by Anubhav Goyal | BBVAEPCLI-1241 Solve for fee, franchise % and franchise amount changes to 0 on cloning | 21-Aug-2023
      if (this.SolveForValue == 'Fee') {
        this.Fee = '';
        this.Feeamt = '';
      }

    } catch (error) {

    }
  }

  setMaturityChk(isChecked: any) {
    try {
      const matDateChk = document.querySelector('.matDateChk') as HTMLInputElement;

      if (isChecked) {
        this.matDateChk = true;
      } else {
        this.matDateChk = false;
        this.Maturityshifter = '';
       // this.maturityDateShifter = this.apifunctions.GetCommonDataType('MaturityShifter_DCN');
        this.sortMaturityShifterArr();
        this.Maturityshifter = '14D';
        this.GetDCNBankSpreadCost();
        this.getMaturityDate();
      }
    } catch (error) {

    }
  }

  ValidateSpread_old(e: { target: { value: string; }; }) {
    // this.fetchSpecialSpreadValues();
    try {
      // if (this.ErrorMsg === '') {
      const target = this.commonfunctions.GetEventTarget(e);
      if (parseFloat(e.target.value) < parseFloat(this.minSpread)) {
        this.ErrorMsg = 'Fee cannot be lower than minimum Fee percentage.';
        target.classList.add('error');
        // target.focus();
        this.feePopupValidationFlag = true;
        return false;
      } else if (parseFloat(e.target.value) > parseFloat(this.maxSpread)) {
        this.ErrorMsg = 'Fee cannot be greater than maximum Fee percentage.';
        target.classList.add('error');
        // target.focus();
        this.feePopupValidationFlag = true;
        return false;
      } else {
        this.ErrorMsg = '';
        this.feePopupValidationFlag = false;
        target.classList.remove('error');
        // }
      }
    } catch (error) {

    }
  }


  ValidateSpread_old1() {
    // this.fetchSpecialSpreadValues();
     
    try {
      // if (this.ErrorMsg === '') {
      // const target = this.commonfunctions.GetEventTarget(e);

      // if (parseFloat(e.target.value) < parseFloat(this.minSpread)) {
      if (parseFloat(this.Fee) < parseFloat(this.minSpread)) {
        this.ErrorMsg = 'Fee cannot be lower than minimum Fee percentage.';
        // target.classList.add('error');
        if (document.getElementById('txtfee')) {
          document.getElementById('txtfee')!.classList.add('error');
        }
        // target.focus();
        this.feePopupValidationFlag = true;
        this.allowPricingFee = false;
         
        return false;
        // } else if (parseFloat(e.target.value) > parseFloat(this.maxSpread)) {
      } else if (parseFloat(this.Fee) > parseFloat(this.maxSpread)) {
         

        this.ErrorMsg = 'Fee cannot be greater than maximum Fee percentage.';
        // target.classList.add('error');
        if (document.getElementById('txtfee')) {
          document.getElementById('txtfee')!.classList.add('error');
        }
         
        // target.focus();
        this.feePopupValidationFlag = true;
        this.allowPricingFee = false;
         
         
        return false;
      } else {
        this.ErrorMsg = '';
        this.feePopupValidationFlag = false;
        this.allowPricingFee = true;;

        // target.classList.remove('error');
        // target.classList.remove('error');
         
        if (document.getElementById('txtfee')) {
          document.getElementById('txtfee')!.classList.remove('error');
        }
        // }
      }


    } catch (error) {
       
    }
  }
  ValidateSpread() {
    // this.fetchSpecialSpreadValues();
     
    try {
      // if (this.ErrorMsg === '') {
      // const target = this.commonfunctions.GetEventTarget(e);

      // if (parseFloat(e.target.value) < parseFloat(this.minSpread)) {
       
      if (parseFloat(this.Fee) < parseFloat(this.minSpread)) {
        this.ErrorMsg = 'Fee cannot be lower than minimum Fee percentage.';
        // target.classList.add('error');
        if (document.getElementById('txtfee')) {
          document.getElementById('txtfee')!.classList.add('error');
        }
        // target.focus();
        // this.feePopupValidationFlag = true;
        // this.allowPricingFee = false;
        //  
        return false;
        // } else if (parseFloat(e.target.value) > parseFloat(this.maxSpread)) {
      } else if (parseFloat(this.Fee) > parseFloat(this.maxSpread)) {
        //  

        this.ErrorMsg = 'Fee cannot be greater than maximum Fee percentage.';
        // target.classList.add('error');
        if (document.getElementById('txtfee')) {
          document.getElementById('txtfee')!.classList.add('error');
        }
        //  
        // target.focus();
        // this.feePopupValidationFlag = true;
        // this.allowPricingFee = false;
        //  
        //  
        return false;
      } else {
        this.ErrorMsg = '';
        // this.feePopupValidationFlag = false;
        // this.allowPricingFee = true;;

        // /
        if (document.getElementById('txtfee')) {
          document.getElementById('txtfee')!.classList.remove('error');
        }
        // }
        return true;
      }


    } catch (error) {
       
    }
  }
  ValidateNumber(e: { keyCode: number; }) {
    try {
       
      if (e.keyCode > 31 && (e.keyCode < 65 || e.keyCode > 90) && (e.keyCode < 97 || e.keyCode > 123)) {
        return false;
      } else {
        return true;
      }
    } catch (error) {

    }
  }
  // added by Suvarna P || 4Jul2022 || added regular expression to validate shifter assigned by Pranav D || start 
  validateShifter(shifter: string) {

    //  
    //  
    //  
    //  
    //  
    //  
    //  
    //  
    //  
    //  
    //  
    //  
    //  
    //  
    //  
    //  
    //  
    //  
    // 
    this.ErrorMsg = "";
    if (!this.chkValidShifter(shifter)) {
      this.ErrorMsg = 'Invalid maturity shifter.';
      // if(this.matDateChk)
      if (document.getElementById('txtmatDateChk'))
        document.getElementById('txtmatDateChk')!.classList.add('error');
      // else
      if (document.getElementById('txtMaturityshifter'))
        document.getElementById('txtMaturityshifter')!.classList.add('error');
      return false;
    }
    else {
      this.ErrorMsg = '';
      if (document.getElementById('txtmatDateChk'))
        document.getElementById('txtmatDateChk')!.classList.remove('error');
      if (document.getElementById('txtMaturityshifter'))
        document.getElementById('txtMaturityshifter')!.classList.remove('error');
      return true;
    }

  }
  chkValidShifter(shifterVal: string) {
    var regex: RegExp = new RegExp(/^([0-9]+[D]{1})$/);
    var regex1: RegExp = new RegExp(/^([0-9]+[M]{1})$/);
    // regex2 added by Pranav D 13-Oct-2022 BBVAEPCLI-115
    var regex2: RegExp = new RegExp(/^([0-9]+[W]{1})$/);
    //  
    //  
    //  
    if (shifterVal.match(regex) || shifterVal.match(regex1) || shifterVal.match(regex2)) {
      return true;
    } else {
      return false;
    }// const regex3: RegExp = new RegExp(/^[0-9]*(\.[0-9]*){0,1}([A-Za-z]){0,1}$/g);

    // notional = notional.toString();
  }

  chkValidShifter_old(shifterVal: string) {
    var regex: RegExp = new RegExp(/^([0-9]+[D]{1})$/);
    // notional = notional.toString();
    if (shifterVal.match(regex)) {
      return true;
    } else {
      return false;
    }// const regex3: RegExp = new RegExp(/^[0-9]*(\.[0-9]*){0,1}([A-Za-z]){0,1}$/g);

    // notional = notional.toString();
  }

  // added by Suvarna P || 4Jul2022 || added regular expression to validate shifter assigned by Pranav D || end 
  /*
    checkBlankShifter(shifter) {
      try {
        if (shifter.length === 1 && (shifter.includes('D') || shifter.includes('d'))) {
          this.ErrorMsg = 'Invalid maturity shifter.';
          return false;
        }
        else {
          this.ErrorMsg = '';
        }
        return true;
      } catch (error) {
  
      }
    }
  */
  GetRMType() {
    try {
      this.RMType = this.apifunctions.GetRMType((this.commonfunctions.getLoggedInUserName()), (this.commonfunctions.getEntityOfUser())).GetRMTypeResult;
      //  

    } catch (error) {

    }
  }
  fnGetProdTemplate() {
    try {
     // add by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || common service for all products || assigned by Pranav D
      this.templateMappingArr = this.apifunctions.fnGetProdTemplate('DualCurrencyNote');
      // const webMethod = this.interfaceUrl + 'PHXAutocallableTemplate';
      // // const webMethod = 'https://bbvadev.finiq-connect.com/BBVAServer/' + 'PHXAutocallableTemplate';
      // const that = this;
      // const parameters = {
      //   // Product: this.Product,
      //   Product: "DualCurrencyNote"
      // };
      // $.ajax({
      //   async: true,
      //   crossDomain: true,
      //   type: 'POST',
      //   url: webMethod,
      //   data: JSON.stringify(parameters),
      //   contentType: 'application/json; charset=utf-8',
      //   dataType: 'json',
      //   headers: this.apifunctions.getHeaders(),
      //   success(data: any) {
      //     that.templateMappingArr = data;
      //     //  
      //   },
      //   error(error: any) {
      //     console.error(error);
      //   }
      // });
    } catch (error) {
       
    }
  }

  generateXML() {
    try {
      let solveFor = ''

      if (this.SolveForValue === 'Reoffer Price') {
        solveFor = 'IBPrice';
      } else if (this.SolveForValue === 'Strike - Spread') {
        solveFor = 'Strike';
      } else {
        solveFor = this.SolveForValue
      }

      let xmlstr = '<QuoteRequest>';

      // tslint:disable-next-line: forin
      for (const i in this.templateMappingArr) {
        switch (this.templateMappingArr[i].email_Header) {
          case 'onBehalfOf': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.onBehalfOf + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'portfolioGroupID': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.portfolioGroupID + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'loginUser': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + (this.commonfunctions.getLoggedInUserName())
            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'format': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.format + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Size': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Size + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'ddlccy': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.ddlccy + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Spot': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Spot + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Price': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
          // below code commented by Pranav D 26-Jun-2023 as per BBVAEPCLI-597 as reoffer price should be sent as 6 decimals in xml tag
            // + this.Price + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            // Suvarna P || 19Jul23 || BBVACLI-1173 || DCN: Solve for reoffer case, reoffer xml value being sent as 100
            // + this.detailedReofferPrice + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            + (this.SolveForValue === 'Reoffer Price' ? '' : this.detailedReofferPrice) + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Strike': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Strike + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Fixing': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Fixing + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'IssuePrice': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + ((this.location !== 'Mexico') ? this.IssuePrice : '100.00') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Spread': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Spread + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'SolveForValue': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + solveFor + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Fee': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Fee + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Feeamt': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Feeamt + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Issueshift': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Issueshift + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Issuedate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.datepipe.transform(this.Issuedate, 'dd-MMM-yyyy') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Fixingshifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Fixingshifter
            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Fixingdate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.datepipe.transform(this.Fixingdate, 'dd-MMM-yyyy')
            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Maturityshifter': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Maturityshifter
            + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Maturitydate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.datepipe.transform(this.Maturitydate, 'dd-MMM-yyyy') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Coupon': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.CpnPct + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          // added by Suvarna  P || 11Jul2022 || DCN pricing functionality changes || assign by Pranav D || start
          case 'altccy': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.altCcy + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'depoccy': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.depoCcy + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'currencyPair': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Currency + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'matDateChk': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + (this.matDateChk ? 'Y' : 'N') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          // added by Suvarna  P || 11Jul2022 || DCN pricing functionality || assign by Pranav D || end
          // START : Added by Pranav D 22-Aug-2022 additional parameters for DCN pricing
          case 'FeeOverride': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + (this.feeChkBox ? 'Y' : 'N') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'FullPrecision': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + (this.issuePriceBox ? 'Y' : 'N') + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'ProductCode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.product_code + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'ProductId': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Product_Id + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'TradeDate': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.TradeDate + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Mode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Mode + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'Cost': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Cost + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          case 'DCNGridRequest': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + 'Single' + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          // StaticTemplateName
          case 'StaticTemplateName': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + 'Dual Currency Note' + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          // END : Added by Pranav D 22-Aug-2022 additional parameters for DCN pricing
          // START : Pranav D 1-Nov-2022 new upfront field sent to xml
          case 'Upfront': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.Upfront + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          // END : Pranav D 1-Nov-2022 new upfront field sent to xml

          //Added by Anubhav Goyal | 16-May-2023 | EPCLI-530
          case 'UpfrontMode': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.invoiceDiscountToggle + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
          // Added by Pranav D 15-Jun-2023 BBVAEPCLI-593 Fee amount ccy added in XML while pricing
          case 'FeeAmountCurrency': xmlstr += '<' + this.templateMappingArr[i].template_Field_Name + '>'
            + this.FeeAmtCcy + '</' + this.templateMappingArr[i].template_Field_Name + '>';
            break;
        }
      }
      xmlstr += '</QuoteRequest>';
       
      return xmlstr;
    } catch (error) {
       
    }
  }

  // DCN Pricing functionality || 11Jul2022 || assigned by Pranav D || start
  //Added by Anubhav Goyal | 13-Apr-2023
  onPriceChkWeekEnd: boolean = true
  Price1() {
    try {
      this.ErrorMsg = '';
      this.infoMsg = '';
      this.onPriceChkWeekEnd = false
      //  
      if (!this.validationOnButton()) {
        return false;
      }
      // START : BBVAEPCLI-354 Pranav D 3-Feb-2023
      if (parseFloat(this.Spot) < 0) {
        this.ErrorMsg = 'Spot is Negative. Please adjust strike and spread';
        return false;
      }
      if (parseFloat(this.Spot) == 0) {
        this.ErrorMsg = 'Spot is Zero. Please adjust strike and spread';
        return false;
      }
      // END : BBVAEPCLI-354 Pranav D 3-Feb-2023
      if (this.ErrorMsg === '') {
        this.reset();
        this.loadflag = true;
        this.portfolioGroupID = this.apifunctions.fnportfolioGroupID();
        if (isNaN(this.portfolioGroupID)) {
          this.ErrorMsg = "Price request failed. Please reload the application and try again.";
          return false;
        }
        this.FetchNotionalBasedTradingValidations();
        this.DCNPrice();
        document.getElementById("removeFocus")?.blur();
        this.onPriceChkWeekEnd = true
      }
      return false;
    } catch (error) {

    }
    return false;
  }
  // START : Pranav D 29-Mar-2023 FetchNotionalBasedTradingValidations 
  breachInfoMsg:any = ''
  FetchNotionalBasedTradingValidations() {
    try {
     // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D

      var res= this.apifunctions.FetchNotionalBasedTradingValidations(this.commonfunctions.getLoggedInUserName(), this.onBehalfOf, this.Size.replace(/,/g, ""), this.ddlccy, this.format);
      // this.apifunctions.FetchNotionalBasedTradingValidations(this.commonfunctions.getLoggedInUserName(), this.onBehalfOf, this.Size.replace(/,/g, ""), this.ddlccy, this.format)?.subscribe((res: any) => {
      
      let tradeBtnValidationData = res.FetchNotionalBasedTradingValidationsResult;
      // tradeBtnValidationData[0].ValidYN = 'R';
        //Added Condition | To hide Trade button if ValidYN = R |  Added by Anubhav Goyal | 11-Apr-2023 | BBVAEPCLI-462
        if (tradeBtnValidationData[0].ValidYN === 'Y' || (tradeBtnValidationData[0].ValidYN).toUpperCase() === 'YES') {
          this.tradeBtnActionFlag = false;
          this.displayTradeBtn = true
        } else if (tradeBtnValidationData[0].ValidYN === 'N' || (tradeBtnValidationData[0].ValidYN).toUpperCase() === 'NO') {
          this.tradeBtnActionFlag = true;
          this.displayTradeBtn = true
          this.breachInfoMsg = tradeBtnValidationData[0].ValidationString
        } else if (tradeBtnValidationData[0].ValidYN === 'R'){
          this.displayTradeBtn = false
          //IF ValidYN is R i.e this.displayTradeBtn =  false then do not show error message | BBVAEPCLI-487 | 18-Apr-2023 | Anubhav Goyal
          //this.breachInfoMsg = tradeBtnValidationData[0].ValidationString
        }else if (tradeBtnValidationData[0].ValidYN === 'T'){
          this.displayTradeBtn = false
          this.ErrorMsg = tradeBtnValidationData[0].ValidationString
        }
        // Added condition this.DCNPriceValidation to this.manualSpotValue == 'Y' && displayTradeBtn == true | Anubhav Goyal | EPCLI-564 FX: "Trade is not allowed for Fixed Spot" is shown even when the client does not have C&T enabled.
        if(this.manualSpotValue == 'Y' && this.displayTradeBtn == true){
          this.ErrorMsg = 'Trade is not allowed for Fixed Spot';
        }
      // });
     // 
    } catch (error) {

    }
  }
  // END : Pranav D 29-Mar-2023 FetchNotionalBasedTradingValidations 


  DCNPrice() {
    try {
      // // BBVACLI-965 Pranav D 16-Mar-2023 Coupon (%) Stickyness issue
      // Pranav D 20-Mar-2023 if else added as coupon (%) needs to be cleared only when solve for is coupon BBVACLI-976
      if (this.SolveForValue === 'Coupon') {
      this.CouponPct = '';
      } else {
        this.CouponPct = this.CouponPct;
      }
      $(document).bind("ajaxStart", () => {
        $("#loading").hide();
      });

      let solveForValue = '';
      // changed by Suvarna P || 18Jul2022 || solveFor Fee issues || assigned by Pranav D.
      // if (this.SolveForValue === 'Coupon') {
      //   solveForValue = 'Coupon';
      // } else 
      if (this.SolveForValue === 'Reoffer Price') {
        solveForValue = 'IBPrice';
      } else if (this.SolveForValue === 'Strike - Spread') {
        solveForValue = 'Strike';
      } else {
        solveForValue = this.SolveForValue;
      }
      if (this.Spot === "" || parseFloat(this.Spot) === 0) {
        this.clientEntrySpotFlag = false;
      }
      else {
        this.clientEntrySpotFlag = true;
      }
      const xmlstr = this.generateXML();
      this.clearFlag = false;
       //const webMethod = this.interfaceUrl + 'PHXAutocallable';
      const webMethod = this.interfaceUrl + 'DCNPricing';
      // const webMethod = "http://localhost:4000/api/" + 'PHXAutocallable';
      const that = this;
      const parameters = {
        Product: 'DualCurrencyNote',
        subTemplateCode: 'DualCurrencyNote',
        LP: 'BBVA',
        xmlstr,
        SolveFor: solveForValue,
        UserID: (this.commonfunctions.getLoggedInUserName()),
        userGroupID: this.allBooksData[this.allBooksData.findIndex((x: { BookCode: any; }) => x.BookCode === this.onBehalfOf)].BookName,//this.onBehalfOf,
        buyerEntityID: (this.commonfunctions.getEntityOfUser()),
      };

      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: this.apifunctions.getHeaders(),  // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D

        success(data: { errorMessage: string; rfqid: any; }) {
          if (data.errorMessage !== '') {
            that.ErrorMsg = data.errorMessage.split('. ')[0];
            that.loadflag = false;
            return;
          }
          that.rfqID = data.rfqid;
          if (!that.clearFlag) {
            that.timeLeft = 0;
            that.Prices = [];
            that.timeLeft = that.defaultTimeout;
            that.loaderTmeLeft = that.FXLoaderTimer;
            that.PPDetails = that.rfqID;
            if (that.PPDetails !== '') {
              that.interval = setInterval(() => {

                 
                if (that.timeLeft > 0) {
                  $("#loading").hide();
                  that.timeoutMsg = '';
                  that.DCNPriceResponse(that.PPDetails);
                  that.timeLeft = that.timeLeft - 2;

                  // START : Pranav D 24-Apr-2023 BBVAEPCLI-474 
                  if (that.loaderTmeLeft > 0) {
                    that.loaderTmeLeft = that.loaderTmeLeft - 2;
                    // 
                    
                  }
                  else {
                    //Added by Pranav D | 24Apr2023 | BBVAEPCLI-474 New behaviour when pricing FX DCN in e-pricer
                    that.waitingMsg = 'We are working on getting a price back to you. Please bear with us.';

                  }
                  // END : Pranav D 24-Apr-2023 BBVAEPCLI-474 
                } else if (that.timeLeft === 0) {
                  that.loadflag = false;
                  that.timeoutMsg = 'Timeout';
                  clearInterval(that.interval);
                  this.rfqid = '';
                  // tslint:disable-next-line: max-line-length
                  that.ErrorMsg = 'Price response is taking longer than expected hence price will not display on this screen. \nInstead, to avoid keeping you waiting, once it is retrieved, you will be able to find it in the Previous Quotes section.';

                }

              }, 2000);         //5000 | Vaibhav B. | 06-Apr-2023
            }
          }
        },
        error(error: any) {
          console.error(error);
        }
      });
    } catch (error) {
       
    }
  }

  DCNPriceResponse(PPDetails: any) {
    try {
      const webMethod = this.interfaceUrl + 'PHXAutocallablePriceResponse';
      const that = this;
      const parameters = {
        rfqID: PPDetails,
        SolveFor: this.SolveForValue
      };

      $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: webMethod,
        data: JSON.stringify(parameters),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: this.apifunctions.getHeaders(),  // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D

        success(data: never[]) {
          that.Prices = data;
          that.commonfunctions.setDCNReceivedPrices(that.Prices, 1);
          // START: Added by Pranav D | 24Apr2023 | BBVAEPCLI-474 New behaviour when pricing FX DCN in e-pricer
	  // changed by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side || unable to read dcnSpread value when no Response; throwing undefined errors
          if (that.sortedAllPrices.length > 0 && that.sortedAllPrices[0].Price) {
            that.waitingMsg = ''
          }
          // END: Added by Pranav D | 24Apr2023 | BBVAEPCLI-474 New behaviour when pricing FX DCN in e-pricer
        },
        error(error: any) {
          console.error(error);
        }
      });
    } catch (error) {
       
    }
  }

  fnGetValidation() {
    try {
      this.validationArr = this.apifunctions.validationArr;
      if (this.validationArr) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.validationArr.length; i++) {
          switch (this.validationArr[i].Setting_Name) {
            // New config for DCN BBVACLI-510 Pranav D 11-Oct-2022
            case 'FXDCN_DefaultRFQTimeOut_Ang':
              this.defaultTimeout = this.validationArr[i].Default_Value;
               
              break;
            //Added by Anubhav | 16-02-2023
            case 'EQ_Watchlist_MaxValidity_Days':
              this.maxValidityDays = this.validationArr[i].Default_Value;
              this.MaxSelectDate = moment().add({ days: this.maxValidityDays }).format('YYYY-MM-DD');
              break;
            case 'DCNTradeTimer':
              this.dcntradeTimer = this.validationArr[i].Default_Value;
              //this.MaxSelectDate = moment().add({ days: this.maxValidityDays }).format('YYYY-MM-DD');
              break;
            /*
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
           */
            // case 'EQ_DefaultRFQTimeOut_Ang':
            //   this.defaultTimeout = this.validationArr[i].Default_Value;
            //    
            //   break;
            /*


          case 'EQ_DefaultTSTimeOut_Ang':
              this.TSTimeout = this.validationArr[i].Default_Value;
              break;
              */
            // BBVAEPCLI-474 Pranav D 24-Apr-2023 
            case 'FXDCN_DefaultRFQLoadingIcon_Ang':
              this.FXLoaderTimer = this.validationArr[i].Default_Value;
              break;

            //  Anubhav Goyal | 09-May-2023 | BBVAEPCLI-529 Block Issue price @ 85% on DCNs
            case 'DCN_IssuePriceValidation': this.issuePriceValidation = this.validationArr[i].Default_Value;
              break;
          }
        }
      }
    } catch (error) {
       
    }
  }
  // DCN Pricing functionality || 11Jul2022 || assigned by Pranav D || end

  feeSoftBlockOverrid(value: string) {
    try {
      // this.showFeePopup = false;
      if (value === 'Yes') {
        this.allowPricingFee = true;
        // this.feePopupValidationFlag = false;
        this.ErrorMsg = '';
        // const target = document.getElementById('txtfee') as HTMLElement;
        // target.classList.remove('error');
        // if (this.feePopupValidationFlag && !this.allowPricingFee) 
        this.Price1();
        // return true;
      } else {
        this.allowPricingFee = false;
        // this.feePopupValidationFlag = false;
        // return false;
      }
      this.showFeePopup = false;
      document.getElementById('txtfee')!.classList.remove('error');

    } catch (error) {

    }
  }
  // DCN save portfolio functionality || 12Jul2022 || assigned by Pranav D || start
  saveportfolioId = '';
  tempXML = '';

  // Save() {
  //   try {
    //this.variantFlag = true; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
  //     this.ErrorMsg = '';
  //     this.infoMsg = '';
  //     if (!this.validationOnButton()) {
  //       return false;
  //     }

  //     if (this.ErrorMsg === '') {
  //       this.timeLeft = -1;
  //       this.timeoutMsg = '';
  //       this.clearFlag = true;
  //       clearInterval(this.interval);
  //       // if (this.ShareBasket.length > 0) {
  //       //     document.getElementById('txtShare').classList.remove('underlyingError');
  //       //     document.getElementById('txtShare').classList.add('longText');
  //       // }
  //       this.saveportfolioId = '';
  //       this.PPDetails = '';
  //       this.sortedAllPrices = [];
  //       this.AllPrices = [];
  //       this.orderID = '';
  //       this.loadflag = false;
  //       this.ErrorMsg = '';
  //       this.infoMsg = '';
  //       this.rfqID = '';
  //       this.saveFlag = false;
  //       this.successMsg = '';
  //       // this.reqSuccessMsg = '';
  //       const strXml = '<Details>' + this.generateSaveXML() + '</Details>';
  //       // return false;
  //       const res = this.apifunctions.BBVASaveQuotes('Single Pricer', strXml, '', '', 'DualCurrencyNote', (this.commonfunctions.getLoggedInUserName()));
  //        // Removed condition' && this.userBasket.length > 0'||BBVACLI-1252 Able to save and share without entering any user ID or client group || RadhaM || 31-08-23
  //       if (res) {
  //         if (res.errorMessage === '') {

  //           this.saveFlag = true;
  //this.variantFlag = false; //Added by Apurva K||18-Dec-2023||HSBCECCLI-87
  //           this.saveportfolioId = res.PortFolioID;
  //           this.successMsg = 'Portfolio ID ' + res.PortFolioID + ' saved successfully.';
  //         }
  //       }
  //     }
  //   } catch (error) {
       
  //   }
  //   return false;
  // }

  generateSaveXML() {
    try {
      this.ErrorMsg = '';
      this.infoMsg = '';
      if (!this.validationOnButton()) {
        return false;
      }

      if (this.ErrorMsg === '') {
        // if (this.ShareBasket.length <= 0) {
        //     this.commonfunctions.generateFlexiXml('');
        //     return '';
        // }
        this.tempXML = '';

        this.tempXML += '<Record>' +

          '<FormatDetails>' + this.format + '</FormatDetails>' +
          '<SolveFor>' + this.SolveForValue + '</SolveFor>' +
          '<Size>' + this.Size.replace(/,/g, '') + '</Size>' +
          '<Ccy>' + this.ddlccy + '</Ccy>' +
          '<CurrencyPair>' + this.Currency + '</CurrencyPair>' + //new
          '<AltCcy>' + this.altCcy + '</AltCcy>' + //new
          '<DepositCurrency>' + this.depoCcy + '</DepositCurrency>' + //new
          // '<ReofferPrice>' + this.IBPrice + '</ReofferPrice>' + //new
          // '<IssuePrice>' + this.Price + '</IssuePrice>' +
          '<ReofferPrice>' + this.Price + '</ReofferPrice>' +
          // '<IBPrice>' + this.IBPrice + '</IBPrice>' + 
          '<IssuePrice>' + this.IssuePrice + '</IssuePrice>' +
          '<Fixing>' + this.Fixing + '</Fixing>' + // new
          '<InputFeePercent>' + this.Fee + '</InputFeePercent>' + // new
          //Added replaceAll() | Anubhav Goyal | 16-Jun-2023 | To send input without ','
          '<InputFeeAmount>' + this.Feeamt.replaceAll(',','') + '</InputFeeAmount>' + // new
          '<InputSpotPrice>' + this.Spot + '</InputSpotPrice>' + // new
          '<Strike>' + this.Strike + '</Strike>' +
          '<IndexRateSpread>' + this.Spread + '</IndexRateSpread>' + // new
          '<CouponPer>' + this.CpnPct + '</CouponPer>' +

          '<IssueDate>' + this.datepipe.transform(this.Issuedate, 'dd-MMM-yyyy') + '</IssueDate>' +
          '<InputFixingDate>' + this.datepipe.transform(this.Fixingdate, 'dd-MMM-yyyy') + '</InputFixingDate>' +
          '<MaturityDate>' + this.datepipe.transform(this.Maturitydate, 'dd-MMM-yyyy') + '</MaturityDate>' +
          '<InputIssueDateShifter>' + this.Issueshift + '</InputIssueDateShifter>' +
          '<InputFixingDateShifter>' + this.Fixingshifter + '</InputFixingDateShifter>' +
          '<InputMaturityDateShifter>' + this.Maturityshifter + '</InputMaturityDateShifter>' +
          '<MaturityDateCheck>' + ((this.matDateChk) ? 'Y' : 'N') + '</MaturityDateCheck>' +
          '<onBehalfOf>' + this.onBehalfOf + '</onBehalfOf>' +
          '<SubTemplate>' + 'DualCurrencyNote' + '</SubTemplate>' +
          '<FullPrecision>' + ((this.issuePriceBox) ? 'Y' : 'N') + '</FullPrecision>' +
          '<FeeOverride>' + ((this.feeChkBox) ? 'Y' : 'N') + '</FeeOverride>' +
          '<Cost>' + this.Cost + '</Cost>' +
          '<Upfront>' + this.Upfront + ' </Upfront>' +	  
          '<UpfrontMode>' + this.invoiceDiscountToggle + '</UpfrontMode>' +
          //Added by Anubhav Goyal | 16-Jun-2023
          '<feeAmountCurrency>' + this.FeeAmtCcy + '</feeAmountCurrency>' +
          '</Record>';
        //  
        // upfront tag added in xml to save data while performing actions like Save, share, Clone and view Pranav D 1-Nov-2022
        this.commonfunctions.generateFlexiXml(this.tempXML);
      }
      return this.tempXML;
    } catch (error) {
       
    }
  }
  // DCN save portfolio functionality || 12Jul2022 || assigned by Pranav D || end

  monthSelected(date: Moment) {
     
  }

  dateChanged() {
    // this.calendar.activeDate = this.selectedDate;
    this.inputDate = this.selectedDate.format('DD-MMM-YYYY');
    if (this.selectedDate.format('HH:mm') === '00:00') {
      this.inputTime = '09:00';
    } else {
      this.inputTime = this.selectedDate.format('HH:mm');
    }

    this.dateSelected.emit(this.selectedDate);
  }

  prevDay() {
    const prevMoment = moment(this.selectedDate).add(-1, 'days');
    this.selectedDate = prevMoment;
    this.dateChanged();
  }

  todayScheduleDate() {
    this.selectedDate = moment();
    this.dateChanged();
  }

  nextDay() {
    const nextMoment = moment(this.selectedDate).add(1, 'days');
    this.selectedDate = nextMoment;
    this.dateChanged();
  }

  scheduleTypeChange() {
    if (this.scheduleType === 'One-Off') {
      this.scheduleFreq = '';
    } else {
      this.scheduleFreq = 'Monthly';
    }

  }

  hideSchedulePopup() {
    try {
      this.showSchedulePopupFlag = false;
    } catch (error) {
       
    }
    return false;
  }

  scheduleSend() {
    try {
      this.scheduleMsg = '';
      this.ErrorMsg = '';
      this.infoMsg = '';
      if (!this.commonfunctions.validTime(this.commonfunctions.getInputTime(this.inputTime))) {
        this.ErrorMsg = 'Please enter valid time in hh:mm (am/pm) format';
        $('#loading').hide();
        return false;
      } else {
        this.ErrorMsg = '';
      }
      this.validationOnButton();
      const sDate = new Date(this.inputDate + ' ' + this.commonfunctions.getInputTime(this.inputTime));
      const today = new Date();
      if (sDate < today) {
        this.ErrorMsg = 'Please enter valid time';
        return false;
      }
      // if (Date.parse(this.stkdate) < Date.parse(this.inputDate)) {
      //     this.ErrorMsg = 'Strike date must be greater than schedule date.';
      //     return false;
      // }

      const timeinsecs = Math.round((sDate.getTime() - today.getTime()) / 1000);
      if (this.ErrorMsg === '') {
        this.portfolioGroupID = this.apifunctions.fnportfolioGroupID();
        if (isNaN(this.portfolioGroupID)) {
          this.ErrorMsg = "Price request failed. Please reload the application and try again.";
          return false;
        }
        const xmlstr = this.generateXML();
        const res = this.apifunctions.SchedulePrice('DualCurrencyNote', xmlstr,
          sDate, 'SINGLE_PRICER', this.portfolioGroupID, timeinsecs, 'BBVA', this.SolveForValue,
          this.allBooksData[this.allBooksData.findIndex((x: { BookCode: any; }) => x.BookCode === this.onBehalfOf)].BookName,
          'DualCurrencyNote', this.scheduleFreq, this.scheduleType, '');
        if (res) {
          if (res['IsScheduled']) {
            this.scheduleMsg = 'Request scheduled successfully. Req ID: ' + res['PS_ID'];
          }
        }
      }
    } catch (error) {

    }
    return false;
  }


  // feeAmtCalc(midrate: any) {
  feeAmtCalc(midrate: any) {
    try {
      // var date1 = new Date(this.Issuedate);
      // var date2 = new Date(this.Maturitydate);
      // var Time = date2.getTime() - date1.getTime();
      // var Days = Time / (1000 * 3600 * 24);
      // this.noOfDays = Days;
      // Fee amount shown 0 if fee % is 0 Pranav D 10-Nov-2022
      // START : If else added by Pranav D 24-Nov-2022 as Franchise Amount was 0 in case of solve for Fee and redirected from Previous Quotes

      if (this.Fee !== '' && parseFloat(this.Fee) !== 0) {
        this.Feeamt = (this.Size.replace(/,/g, '') * (parseFloat(this.Fee) / 100) * this.noOfDays * midrate) / 360;
        // Added by Riddhi P || 22Sept2022 ||fee returned in 5-6 decimal places, only 4 decimal places shown
        this.Feeamt = this.Feeamt.toFixed(2);
        this.Feeamt = this.Feeamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        // Fee amount shown 0 if fee % is 0 Pranav D 10-Nov-2022
        this.Feeamt = '';
      }

      // END : If else added by Pranav D 24-Nov-2022 as Franchise Amount was 0 in case of solve for Fee and redirected from Previous Quotes


       
    } catch (error) {

    }
  }
  // added by Suvarna  P || 13Jul2022 || DCN clonning view functionality from Prev quotes and Saved req || assign by Suvarna P || start
  buttonList: any = '';

  // If else block added by Pranav D to check if clone performed for request or for DCN Grid record 28-Oct-2022 BBVACLI-571
  setPrevQuoteData1(cloneData: any, viewOnly: any) {
    try {
      //  
      // added by Suvarna P || 04Aug2022 || to change sidebar counter while redirection || Assigned by Pranav D
      this.apifunctions.setSidebarCounter(4);
      if (cloneData.multiPricerRedirectFlg && cloneData.multiPricerRedirectFlg[0] === 'true') {
         
        this.onBehalfOf = cloneData.InputOnBehalfOfBook[0];
        // function call to fetch formats based on on behalf of value passed from multi DCN because on single FX load 1st value of on behalf api call 0th item from array index
        // set on screen and formats filled in array resulting in missing format passed from Multi to single thus empty value in dropdown Pranav D 28-Jul-2023 BBVACLI-1197
       // this.onBehalfOfChange();
        this.buttonList = cloneData.Actions[0];
        this.ddlccy = cloneData.InputSettlementCurrency[0];
        this.format = cloneData.InputProductFormatType[0];
        this.formatChange(this.format);

        this.SolveForValue = cloneData.InputRFQSolveFor[0];
        if (this.SolveForValue === 'IBPrice') {
          this.SolveForValue = 'Reoffer Price';
        } else if (this.SolveForValue === 'Strike') {
          this.SolveForValue = 'Strike - Spread';
        } else {

        }
        // cloneData.InputRFQSolveFor = [this.SolveForValue];
        //  
        this.Size = cloneData.InputRFQNotionalAmount[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.ddlccy = cloneData.InputSettlementCurrency[0];
        this.Currency = cloneData.InputCurrencyPair[0];
        this.altCcy = cloneData.AltCcy[0];
        this.depoCcy = cloneData.InputDepositCurrency[0]; // DepositCurrency[0]; PS_ID=1641
        if (cloneData.CostPercent[0] !== '') {
          this.Cost = cloneData.CostPercent[0];
        } else {
          this.Cost = '0';
        }

        // added by Suvarna P || 07Sept2022 || Full Precision chkBox changes || assigned by Pranav D.
        var fullPrecission = cloneData.FullPrecision[0].toString().toUpperCase() === 'Y' ? true : false;
        this.issuePriceBox = fullPrecission;
        this.setIssuePriceCheckBox(fullPrecission);

        if (this.SolveForValue === 'Reoffer Price') {
          this.Price = '';
        } else {
          this.Price = cloneData.InputInterBankPrice[0];
          this.setIssuePriceCheckBox(fullPrecission);
          this.GetReofferOrUpfront('Upfront');
        }

        this.IssuePrice = cloneData.InputIssuePricePercent[0];
        this.Fixing = cloneData.Fixing[0];   //Fixing no value
        this.Fee = parseFloat(cloneData.InputFeePercent[0]).toFixed(2);
        this.Feeamt = parseFloat(cloneData.InputFeeAmount[0]).toFixed(2);
        this.FeeAmtCcy = cloneData.FeeAmountCcy[0];
        this.fetchRealTimeSpotValue();
        this.feeAmtCalc(this.midRate);

       //Added by Anubhav Goyal | 14-Apr-2023 | Reduce API call
        if (this.apifunctions.optCutArr == undefined || this.apifunctions.optCutArr.length <= 0) {
          this.onOptCutChange();
        } else {
          
        }

        // START : Pranav D 21-Nov-2022 BBVAEPCLI-219 Previous quote API parameter change handled on angular side
        if (viewOnly) {
          if (cloneData.Spot[0] !== '') {
	  // changed by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side
            // this.Spot = parseFloat(cloneData.Spot[0]).toFixed(this.receivedDeciamlofCcyPair);
            this.Spot = cloneData.Spot[0];
            if (this.Spot === "NaN") {
              this.Spot = '';
            }
          }
          else {
            this.Spot = '';
          }
          // END : Pranav D 21-Nov-2022 BBVAEPCLI-219 Previous quote API parameter change handled on angular side
        } else {
          this.Spot = '';
        }
        // Added by Taran || this.manualSpreadValue==='Y'
        
        
        if(cloneData.InputSpotPrice != ''){
          this.manualSpotValue == 'Y'
          this.Spot=cloneData.InputSpotPrice;
          
          
        }
        if(cloneData.InputSpreadPercent != ''){
          this.manualSpreadValue == 'Y'
          this.Spread=cloneData.InputSpreadPercent;
          
        }
        // START : BBVAEPCLI-209 Pranav D 24-Nov-2022 strike spread value handled based on strike spread toggle from Multi DCN
        let StrikeSpreadToggle = '';
        StrikeSpreadToggle = cloneData.StrikeSpreadToggle[0];
        this.receivedStrikeSpreadToggle = StrikeSpreadToggle;
        this.FeeAmtCcy = cloneData.FeeAmountCurrency[0]; // Added by Anubhav Goyal | BBVAEPCLI-658 | Multi to Single Pricer | 26-Jul-2023

        if (StrikeSpreadToggle === 'Strike') {

          if (this.SolveForValue === 'Strike - Spread') {
            this.Strike = '';
            // START : Pranav D 18-Nov-2022 BBVAEPCLI-219 Spread to be shown on rediretcion to single pricer
            if (viewOnly) {
              this.Spread = cloneData.InputSpreadPercent[0];
            } else {
              this.Spread = '';
            }
            // END : Pranav D 18-Nov-2022 BBVAEPCLI-219 Spread to be shown on rediretcion to single pricer
          } else {
            this.Strike = cloneData.InputStrikePercent[0];
            if (viewOnly) {
              if (cloneData.InputSpreadPercent[0] !== '') {
                this.Spread = cloneData.InputSpreadPercent[0];
              } else {
                this.Spread = '';
              }

            } else {
              this.Spread = '';
            }

          }
        } else {
          if (this.SolveForValue === 'Strike - Spread') {
            // START : Pranav D 18-Nov-2022 BBVAEPCLI-219 Spread to be shown on rediretcion to single pricer
            if (viewOnly) {
	    // BBVAEPCLI-530 Suvarna P || 30-May-2023 || clonning from multi to single DCN
              this.Spread = cloneData.SolveForValue ? cloneData.SolveForValue[0] : '';
              if (this.Spread === 'Rejected') {
                this.Spread = '';
              }
            } else {
              this.Spread = '';
            }
            // END : Pranav D 18-Nov-2022 BBVAEPCLI-219 Spread to be shown on rediretcion to single pricer
          } else {
            // this.Strike = '';
            this.Strike = cloneData.InputStrikePercent[0];
            if (viewOnly) {
	      // BBVAEPCLI-530 Suvarna P || 30-May-2023 || clonning from multi to single DCN
              if ( cloneData.InputSpreadPercent && cloneData.InputSpreadPercent[0] !== '') {
                this.Spread = cloneData.InputSpreadPercent[0]; // Changed SolveForValue to InputSpreadPercent | 17-Jul-2023 | Anubhav Goyal | BBVAEPCLI-650 When redirecting Multi dcn to single, Spread value changes.
              } else {
                this.Spread = '';
              }
            } else {
              this.Spread = '';
            }

          }
        }
        // END : BBVAEPCLI-209 Pranav D 24-Nov-2022 strike spread value handled based on strike spread toggle from Multi DCN

        this.Issueshift = cloneData.InputIssueType[0]; // pending no param no value
        this.Fixingshifter = cloneData.InputFixingType[0]; //pending no param no value
        this.Maturityshifter = cloneData.InputMaturityDateShifter[0]; // no value
        //Added by Riddhi P ||28Sept 2022 || Not able to view cost percent from prev quotes 
        // this.Cost = cloneData.CostPercent[0];
        //  

        this.CpnPct = cloneData.InputFixedCouponPercentPA[0];
        this.setDCNDates();
        // Added by Pranav D 9-Mar-2023 BBVAEPCLI-406 no of days going wrong
        // START : BBVAEPCLI-210 Pranav D 8-Dec-2022 calculate Coupon on redirecting from Multi DCN to DCN Single
        if (this.CpnPct !== '' || parseFloat(this.CpnPct) !== 0) {
          this.ChangeCouponPct('CpnPct');
        } else {

        }
        // END : BBVAEPCLI-210 Pranav D 8-Dec-2022 calculate Coupon on redirecting from Multi DCN to DCN Single


        if (this.Fixingshifter == '') {
          //this.Fixingdate = cloneData.InputFixingDate;
        }
        this.matDateChk = cloneData.MaturityDateCheck[0] === 'Y' ? true : false; // values not coming

        // InputIssueDate  '2022-07-19T00:00:00'
        // InputFixingDate '27-Jul-2022'
        // InputMaturityDate '2022-07-19T00:00:00'
        // MaturityDateCheck ''

        this.orderID = cloneData.BBVAID[0];
        this.orderStatus = cloneData.Status[0];

        if (cloneData.SolveForValue2[0] == '' || parseFloat(cloneData.SolveForValue2[0]) == 0) {
          document.getElementById('txtspot')!.classList.remove('graySpot');
          if (this.manualSpotValue === 'Y') {
            this.clientEntrySpotFlag = true;
          } else {
            this.clientEntrySpotFlag = false;
          }

        }
        else {
	// start || changed by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side
          // if (this.manualSpotValue === 'Y') {
          // this.SpotReceived = parseFloat(cloneData.SolveForValue2[0]).toFixed(this.receivedDeciamlofCcyPair);
          this.SpotReceived = cloneData.SolveForValue2[0];
          if (this.SpotReceived === "NaN") {
            this.SpotReceived = ''
          }
          // } else {
          //   this.Spot = '';
          // }


          // this.calcSpreadOnSpot();  this.Spread = cloneData.DCNSpread[0];
	 // end || changed by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side
          // this.calculateSpread('Spot');
          // document.getElementById('txtspot').classList.add('graySpot');
          // this.clientEntrySpotFlag = false;
        }

        // added by Suvarna P || 07Sept2022 || FeeOverride chkBox changes || assigned by Pranav D.
        var feeChkBox = cloneData.FeeOverride[0].toString().toUpperCase() === 'Y' ? true : false;
        this.feeChkBox = feeChkBox;
        this.setFeeCheckBox(feeChkBox);

        // BBVAEPCLI-122 Pranav D 1-Nov-2022 Fetched and shown upfront field passed from Multi DCN grid to single pricer
        if (this.SolveForValue !== 'Reoffer Price') {
          // Added by RiddhiP || 5june23 || BBVAEPCLI-585 || Add up to 6 Decimals to the coupon p.p in FX e pericer
          if (cloneData.Upfront && cloneData.Upfront[0] !== '') {
            this.Upfront = cloneData.Upfront[0];
            this.GetReofferOrUpfront('Reoffer Price');
          } else {
            this.GetReofferOrUpfront('Upfront');
          }
        }
        



        if (viewOnly) {
          this.onBehalfOf = cloneData.InputOnBehalfOfBook[0];
          this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
          if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
            if (this.GetClientProdDetailsArr.findIndex((record: { CPM_Product: string; }) => record.CPM_Product === 'DCN') > -1) {
              // Formats fetched from ClientProdDetails instead of Common data BBVACLI-519 Pranav D 12-Oct-2022
              this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: { CPM_Product: string; }) => record.CPM_Product === 'DCN')].CPM_Format).toString().split(',');
              this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: { CPM_Product: string; }) => record.CPM_Product === 'DCN')].ActiveYN;
              //  
            }
          }

          this.mappedformatlistLocation = this.apifunctions.GetCommonDataType('FXDCNFormat');

          this.Issuedate = this.datepipe.transform(cloneData.InputIssueDate[0].split('T')[0], 'yyyy-MM-dd');
          this.Fixingdate = this.datepipe.transform(cloneData.InputFixingDate[0], 'yyyy-MM-dd');
           
          this.Maturitydate = this.datepipe.transform(cloneData.InputMaturityDate[0].split('T')[0], 'yyyy-MM-dd');

          // this.stkshift = cloneData['ComputedStrikeFixingLag'];
          // this.paymentshift = cloneData['ComputedSettlementPeriodSoftTenor'];
          // this.expshift = cloneData['ComputedPayoffSoftTenor'];
          if (cloneData.TransactionTime[0] !== '') {
            this.Timestamp = cloneData.TransactionTime[0];
          } else {
            this.Timestamp = '';
          }

          this.rfqID = cloneData.RFQID[0];
          // BBVAEPCLI-219 Pranav D 21-Nov-2022 API call to get latest status of RFQ
          let selectedRFQIDDetails: any = this.apifunctions.getPreviousQuoteCloneData(this.rfqID, 'RFQID');
          //  

          this.NoteMasterID = cloneData.Note_Master_Id[0];
          if (!cloneData.PSID || cloneData.PSID[0] === '') {
            this.sortedAllPrices = [{
              // Price: (cloneData.SolveForValue[0] === '' && this.orderID !== '')
              //     ? 'Rejected' : cloneData.SolveForValue[0],
              // solveFor: cloneData.InputRFQSolveFor[0],
              // Price1: (cloneData.SolveForValue2[0] === '' && this.orderID !== '')
              //     ? 'Rejected' : cloneData.SolveForValue2[0]
              Price: (cloneData.SolveForValue === undefined || cloneData.SolveForValue[0] === undefined || cloneData.SolveForValue[0] === '')
                ? 'Rejected' : cloneData.SolveForValue[0],
              solveFor: cloneData.InputRFQSolveFor[0],
              Price1: (cloneData.SolveForValue2 === undefined || cloneData.SolveForValue2[0] === undefined || cloneData.SolveForValue2[0] === '')
                ? 'Rejected' : cloneData.SolveForValue2[0],
              QueueStatus: cloneData.QueueStatus[0] === 'Response Received' && cloneData.SolveForStatus1[0].toUpperCase() === 'REJECTED' ? 'Rejected Request'
                : cloneData.QueueStatus[0],
              QueueStatus1: cloneData.QueueStatus[0] === 'Response Received' && cloneData.SolveForStatus2[0].toUpperCase() === 'REJECTED' ? 'Rejected Request'
                : cloneData.QueueStatus[0],
            }];
          }
          switch (cloneData.InputRFQSolveFor[0]) {
            // START : BBVAEPCLI-219 Pranav D 21-Nov-2022 send timeout if timeout received
            case 'Coupon':
              // && cloneData.SolveForValue[0] !== 'Rejected' adde by Pranav D BBVACLI-623 5-Dec-2022
              if (cloneData.SolveForValue[0] !== '' && cloneData.SolveForValue[0] !== 'Timeout' && cloneData.SolveForValue[0] !== 'Rejected') {
                 // Added by RiddhiP || 5june23 || BBVAEPCLI-585 || Add up to 6 Decimals to the coupon p.p in FX e pericer
                // this.CpnPct = parseFloat(cloneData.SolveForValue[0]).toFixed(2);
                this.CpnPct = cloneData.SolveForValue[0];
                this.sortedAllPrices[0].Price = this.CpnPct;
                // BBVAEPCLI-210 Pranav D 23-Nov-2022
                this.ChangeCouponPct('CpnPct');
              }
              else if (cloneData.SolveForValue[0] === 'Timeout') {
                if (selectedRFQIDDetails['cloneData'].QueueStatus[0] === 'Response Received') {
                  this.CpnPct = selectedRFQIDDetails['cloneData'].SolveForValue[0];
                  this.sortedAllPrices[0].Price = this.CpnPct;
                  // BBVAEPCLI-210 Pranav D 23-Nov-2022
                  this.ChangeCouponPct('CpnPct');
                } else {
                  this.CpnPct = '';
                  // BBVAEPCLI-210 Pranav D 23-Nov-2022
                  this.CouponPct = '';
                  this.sortedAllPrices[0].Price = 'Pending Response';
                }
              }
              // END : BBVAEPCLI-219 Pranav D 21-Nov-2022 send timeout if timeout received
              else if (cloneData.SolveForValue[0] === 'Rejected') {
                this.CpnPct = '';
                this.CouponPct = '';
                this.sortedAllPrices[0].Price = 'Rejected';
              }
              else {
                this.CpnPct = '';
                // BBVAEPCLI-210 Pranav D 23-Nov-2022
                this.CouponPct = '';
              }

              this.replySolveFor = 'Coupon';
              break;
            case 'Strike':
              // START : BBVAEPCLI-219 Pranav D 21-Nov-2022 send timeout if timeout received
              // && cloneData.SolveForValue[0] !== 'Rejected' adde by Pranav D BBVACLI-623 5-Dec-2022
              if (cloneData.SolveForValue[0] !== '' && cloneData.SolveForValue[0] !== 'Timeout' && cloneData.SolveForValue[0] !== 'Rejected') {
                if (StrikeSpreadToggle === 'Strike') {
                  this.Strike = parseFloat(cloneData.SolveForValue[0]).toFixed(this.receivedDeciamlofCcyPair);
                  this.sortedAllPrices[0].Price = this.Strike;
                  this.calculateSpread('Strike');
                } else {
                  this.calculateSpread('Spread');
                  this.sortedAllPrices[0].Price = this.Strike;
                }

              }
              else if (cloneData.SolveForValue[0] === 'Timeout') {
                if (selectedRFQIDDetails['cloneData'].QueueStatus[0] === 'Response Received') {
                  this.Strike = parseFloat(selectedRFQIDDetails['cloneData'].SolveForValue[0]).toFixed(this.receivedDeciamlofCcyPair);
                  this.sortedAllPrices[0].Price = this.Strike;
                  this.Spot = selectedRFQIDDetails['cloneData'].SolveForValue2[0];
                } else {
                  this.Strike = '';
                  this.sortedAllPrices[0].Price = 'Pending Response';
                }
              }
              // END : BBVAEPCLI-219 Pranav D 21-Nov-2022 send timeout if timeout received
              else {
                this.Strike = '';
              }

              // this.replySolveFor = 'Strike';
              this.calculateSpread('Strike');
              this.replySolveFor = 'Strike / Spread';

              break;
            case 'IBPrice':
              // START : BBVAEPCLI-219 Pranav D 21-Nov-2022 send timeout if timeout received
              // && cloneData.SolveForValue[0] !== 'Rejected' adde by Pranav D BBVACLI-623 5-Dec-2022
              if (cloneData.SolveForValue[0] !== '' && cloneData.SolveForValue[0] !== 'Timeout' && cloneData.SolveForValue[0] !== 'Rejected') {
                this.Price = parseFloat(cloneData.SolveForValue[0]).toFixed(4); // this.sortedAllPrices[0].Price;
                this.sortedAllPrices[0].Price = this.Price;
                this.GetReofferOrUpfront('Upfront');
              }
              else if (cloneData.SolveForValue[0] === 'Timeout') {
                if (selectedRFQIDDetails['cloneData'].QueueStatus[0] === 'Response Received') {
                  this.Price = parseFloat(selectedRFQIDDetails['cloneData'].SolveForValue[0]).toFixed(4);
                  this.sortedAllPrices[0].Price = this.Price;
                } else {
                  this.Price = '';
                  this.sortedAllPrices[0].Price = 'Pending Response';
                }
              }
              // END : BBVAEPCLI-219 Pranav D 21-Nov-2022 send timeout if timeout received
              else {
                this.Price = '';
              }

              // this.replySolveFor = 'IBPrice';
              this.replySolveFor = 'Reoffer Price';
              break;
            // added by Suvarna P || 18Jul2022 || solveFor Fee issues || assigned by Pranav D.
            case 'Fee':
              // START : BBVAEPCLI-219 Pranav D 21-Nov-2022 send timeout if timeout received
              // && cloneData.SolveForValue[0] !== 'Rejected' adde by Pranav D BBVACLI-623 5-Dec-2022
              this.fetchRealTimeSpotValue(); // Added by Anubhav Goyal 28-Aug-2023 | BBVAEPCLI-677 
              if (cloneData.SolveForValue[0] !== '' && cloneData.SolveForValue[0] !== 'Timeout' && cloneData.SolveForValue[0] !== 'Rejected') {
                this.Fee = parseFloat(cloneData.SolveForValue[0]).toFixed(2); // this.sortedAllPrices[0].Price;
                this.sortedAllPrices[0].Price = this.Fee;
              }
              else if (cloneData.SolveForValue[0] === 'Timeout') {
                if (selectedRFQIDDetails['cloneData']!.QueueStatus[0] === 'Response Received') {
                  this.Fee = parseFloat(selectedRFQIDDetails['cloneData']!.SolveForValue[0]).toFixed(4);
                  this.sortedAllPrices[0].Price = this.Fee;
                } else {
                  this.Fee = '';
                  this.sortedAllPrices[0].Price = 'Pending Response';
                }
              }
              // END : BBVAEPCLI-219 Pranav D 21-Nov-2022 send timeout if timeout received
              else {
                this.Fee = '';
              }
              this.calculateSpread('Strike');
              this.replySolveFor = 'Fee';
              break;
          }
        }


      } else {
        // normal clone code
         
        this.CpnPct = cloneData.InputFixedCouponPercentPA[0]; //Added by Anubhav Goyal | 13-Mar-2023 | 3:30pm | BBVACLI-931 Reoffer Price is not in full precision when viewed from Dashboard, coupon (%) going blank
        this.ChangeCouponPct('CpnPct'); //Added by Anubhav Goyal | 17-Mar-2023 | BBVACLI-931 
        this.CouponPct = this.CouponPct //Added by Anubhav Goyal | 17-Mar-2023 | BBVACLI-931 
        this.buttonList = cloneData.Actions[0];
        this.ddlccy = cloneData.InputSettlementCurrency[0];


        // this.ddlNoteCcy = cloneData.Ccy;
        this.format = cloneData.InputProductFormatType[0];
        this.formatChange(this.format);
        // code changes done by Pranav D 29-Mar-2022 to enable CHF and GBP currency as asked by BBVA on clone action BBVACLI-136
        // if (cloneData.FormatDetails === 'Swap' && (cloneData.Ccy === 'CHF' || cloneData.Ccy === 'GBP')) {
        //     this.ddlNoteCcy = 'EUR';
        // }
        this.SolveForValue = cloneData.InputRFQSolveFor[0];
        if (this.SolveForValue === 'IBPrice') {
          this.SolveForValue = 'Reoffer Price';
        } else if (this.SolveForValue === 'Strike') {
          this.SolveForValue = 'Strike - Spread';
        }
        // cloneData.InputRFQSolveFor = [this.SolveForValue];
        //  
        this.Size = cloneData.InputRFQNotionalAmount[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.ddlccy = cloneData.InputSettlementCurrency[0];
        this.Currency = cloneData.InputCurrencyPair[0];
        this.altCcy = cloneData.AltCcy[0];
        this.depoCcy = cloneData.InputDepositCurrency[0]; // DepositCurrency[0]; PS_ID=1641
        if (cloneData.CostPercent[0] !== '') {
          this.Cost = cloneData.CostPercent[0];
        } else {
          this.Cost = '0';
        }

        // added by Suvarna P || 07Sept2022 || Full Precision chkBox changes || assigned by Pranav D.
        var fullPrecission = cloneData.FullPrecision[0].toString().toUpperCase() === 'Y' ? true : false;
        this.issuePriceBox = fullPrecission;


        if (this.SolveForValue === 'Reoffer Price') {
          this.Price = '';
          // BBVAEPCLI-199 Pranav D Full precision issue for Reoffer field 10-Nov-2022
          this.receivedReoffer = cloneData.SolveForValue[0];
          this.setIssuePriceCheckBox(this.issuePriceBox);
        } else {
          this.Price = cloneData.InputInterBankPrice[0];
          // BBVAEPCLI-199 Pranav D stored received value from prev quotes in variable
          this.receivedReoffer = cloneData.InputInterBankPrice[0];
          this.setIssuePriceCheckBox(fullPrecission);
        }
        // changed/ commented by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side || clonning from prev quotes also from api only || no calculations from angular side
        // added common function later
	// if (this.SolveForValue === 'Strike - Spread') {
        //   this.Strike = '';
        //   this.Spread = '';
        // } else {
        //   // this.Strike = cloneData.InputStrikePercent[0];
        //   // if (this.manualSpreadValue === 'N') {
        //   //   this.Spread = '';
        //   // } else {
        //   //   this.Spread = cloneData.InputSpreadPercent[0]; // no values 
        
        //   this.Strike = cloneData.InputStrikePercent[0];
        //   if (viewOnly) {
        //     if (cloneData.InputSpreadPercent[0] !== '') {
        //       this.Spread = cloneData.InputSpreadPercent[0];
        //     } else {
        //       this.Spread = '';
        //     }

        //   } else {
        //     this.Spread = '';
        //   }

        // }
        // commented by Suvarna P || 21Jul23 || BBVACLI-1176 || DCN: Reoffer value changes to view/clone from previous quotes/scheduled request || place shifter from lower side to upper side to get NoOfDays to calculat Reoffer Price
        // changed by Suvarna P || 26Jul23 || BBVAEPCLI-660 || wrong reoffer price value on the viewmode || same as BBVACLI-1176
         this.Issueshift = cloneData.InputIssueType[0];
         this.Fixingshifter = cloneData.InputFixingType[0]; 
         this.Maturityshifter = cloneData.InputMaturityDateShifter[0]; 
         this.setDCNDates();
      

        // Code added  by Pranav D 15-Jun-2023 BBVAEPCLI-593 to disaply fee amount currency from previous quotes
	// place shifted from lower part of code to upper side
        this.FeeAmtCcy = cloneData.FeeAmountCurrency[0];
        this.IssuePrice = cloneData.InputIssuePricePercent[0];
        this.Fixing = cloneData.Fixing[0];   //Fixing no value
        this.Fee = cloneData.InputFeePercent[0];

        //Added by Anubhav Goyal | 14-Apr-2023 | Reduce API call
        if (this.apifunctions.optCutArr == undefined || this.apifunctions.optCutArr.length <= 0) {
          this.onOptCutChange();
        } else {
          
        }


        // if (this.manualSpotValue === 'Y') {
        //   this.Spot = parseFloat(cloneData.InputSpotPrice[0]).toFixed(this.receivedDeciamlofCcyPair);
        // } else {
        //   this.Spot = '';
        // }

        // BBVAEPCLI-122 Pranav D 1-Nov-2022 upfront from previous quotes
	// BBVAEPCLI-530 Anubhav G 16-May-2023
        this.invoiceDiscountToggle = cloneData.UpfrontMode[0];
        if (viewOnly) {
          if (cloneData.Upfront[0] !== '') {
            this.Upfront = cloneData.Upfront[0];
	    // Suvarna P || 19Jul23 || BBVACLI-1173 || DCN: Solve for reoffer case, reoffer xml value being sent as 100
            this.GetReofferOrUpfront('Reoffer Price');
          } else {
            this.Upfront = '';
          }
        } else {
          if (cloneData.Upfront[0] !== '') {
            this.Upfront = cloneData.Upfront[0];
	    // Suvarna P || 19Jul23 || BBVACLI-1173 || DCN: Solve for reoffer case, reoffer xml value being sent as 100
            this.GetReofferOrUpfront('Reoffer Price');
          } else {
            this.GetReofferOrUpfront('Upfront');
          }
        }
/*
 // changed/ commented by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side || clonning from prev quotes also from api only || no calculations from angular side
        // added common function later
        
        // START : InputSpotPrice changed to Spot Pranav D 21-Nov-2022 BBVAEPCLI-219 parameter changed for Previous quotes API.
        if (viewOnly) {
          // Added cloneData?.Spot !== undefined | Anubhav Goyal | 16-Jun-2023 | From schedule price tag Undefined
          if (cloneData?.Spot !== undefined && cloneData.Spot[0] !== '') {
            this.Spot = parseFloat(cloneData.Spot[0]).toFixed(this.receivedDeciamlofCcyPair);
          } else {
            this.Spot = '';
          }
          // END : InputSpotPrice changed to Spot Pranav D 21-Nov-2022 BBVAEPCLI-219 parameter changed for Previous quotes API.
        } else {
          this.Spot = '';
        }

         // Added by Taran || BBVACLI576  || 5th April 2023
         if(cloneData.InputSpotPrice[0] != ''){
           this.manualSpotValue = 'Y'
           this.Spot=cloneData.InputSpotPrice[0];
           
           
         }
         if(cloneData.InputSpreadPercent[0] != ''){
           this.manualSpreadValue = 'Y'
           this.Spread=cloneData.InputSpreadPercent[0];
           
         }
         */
        // //  END

        // commented by Suvarna P || 21Jul23 || BBVACLI-1176 || DCN: Reoffer value changes to view/clone from previous quotes/scheduled request || place shifter from lower side to upper side to get NoOfDays to calculat Reoffer Price
        // changed by Suvarna P || 26Jul23 || BBVAEPCLI-660 || wrong reoffer price value on the viewmode || same as BBVACLI-1176
        // this.Issueshift = cloneData.InputIssueType[0]; // pending no param no value
        // this.Fixingshifter = cloneData.InputFixingType[0]; //pending no param no value
        // this.Maturityshifter = cloneData.InputMaturityDateShifter[0]; // no value
        // //Added by Riddhi P ||28Sept 2022 || Not able to view cost percent from prev quotes 
        // // this.Cost = cloneData.CostPercent[0];
        // //  

        // this.setDCNDates();
        // code shifted below as setDCNDates function internally calls fee amount calculation function BBVAEPCLI-593 
        // resulting in wrong value changed by Pranav D 15-Jun-2023


// Added by RiddhiP || 22AUG23 || BBVACLI-1241 || franchise amount is NaN on cloning from previous quotes when solve for is fee 
        if(cloneData.InputFeeAmount[0]!=''){
          this.Feeamt = parseFloat(cloneData.InputFeeAmount[0].replaceAll(',','')).toFixed(2);  // Added replaceAll()| Anubhav Goyal | 16-Jun-2023
        }
        else{
          this.Feeamt=''
        }
    
        this.CpnPct = cloneData.InputFixedCouponPercentPA[0];
        if (this.CpnPct !== '' || parseFloat(this.CpnPct) !== 0) {
          this.ChangeCouponPct('CpnPct');
        } else {

        }

        if (this.Fixingshifter == '') {
          //this.Fixingdate = cloneData.InputFixingDate;
        }
        this.matDateChk = cloneData.MaturityDateCheck[0] === 'Y' ? true : false; // values not coming

        // InputIssueDate  '2022-07-19T00:00:00'
        // InputFixingDate '27-Jul-2022'
        // InputMaturityDate '2022-07-19T00:00:00'
        // MaturityDateCheck ''

        this.orderID = cloneData.BBVAID[0];
        this.orderStatus = cloneData.Status[0];
        // Added cloneData?.SolveForValue2 !== undefined | Anubhav Goyal | 16-Jun-2023 | From schedule price tag Undefined
        
	/*
	 // changed/ commented by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side || clonning from prev quotes also from api only || no calculations from angular side
        // added common function later
        if (cloneData?.SolveForValue2 !== undefined && (cloneData.SolveForValue2[0] == '' || parseFloat(cloneData.SolveForValue2[0]) == 0)) {
          document.getElementById('txtspot')!.classList.remove('graySpot');
          if (this.manualSpotValue === 'Y') {
            this.clientEntrySpotFlag = true;
          } else {
            this.clientEntrySpotFlag = false;
          }

        }
        else {
          // if (this.manualSpotValue === 'Y') {
          // Added cloneData?.SolveForValue2 !== undefined | Anubhav Goyal | 16-Jun-2023 | From schedule price tag Undefined
          // Added by Anubhav Goyal || 21-Jun-23 || To Check Blank Condition
          if (cloneData?.SolveForValue2 !== undefined && cloneData?.SolveForValue2[0] !== '') {
            this.SpotReceived = parseFloat(cloneData.SolveForValue2[0]).toFixed(this.receivedDeciamlofCcyPair);
          }
          // } else {
          //   this.Spot = '';
          // }


          this.calcSpreadOnSpot();
          // this.calculateSpread('Spot');
          // document.getElementById('txtspot').classList.add('graySpot');
          // this.clientEntrySpotFlag = false;
        }
        */
	// changed/ commented by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side || clonning from prev quotes also from api only || no calculations from angular side
        // added common function here to set spot, strike and spread values
        this.setSpotStrikeSpreadValues(cloneData, viewOnly);

        // added by Suvarna P || 07Sept2022 || FeeOverride chkBox changes || assigned by Pranav D.
        var feeChkBox = cloneData.FeeOverride[0].toString().toUpperCase() === 'Y' ? true : false;
        this.feeChkBox = feeChkBox;
        this.setFeeCheckBox(feeChkBox);
        //START : BBVACLI-633 Amogh K 30-Nov-2022 
        //Vaibhav B | 06-02-2023 | BBVAEPCLI-350 | NOT taking into account franchise when cloning from previous quotes
        if (cloneData.InputFeePercent[0] !== "") {
          this.Fee = parseFloat(cloneData.InputFeePercent[0]).toFixed(4);
          // BBVAEPCLI-593 fee amount calculation not required when record populated from Previous Quotes Pranav D 15-Jun-2023
          // this.feeAmtCalc(this.midRate);
        }
        else {
          this.Fee = ''
        }
        //END : BBVACLI-633 Amogh K 30-Nov-2022 

        if (viewOnly) {
          this.onBehalfOf = cloneData.InputOnBehalfOfBook[0];
          this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
          if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
            if (this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'DCN') > -1) {
              // Formats fetched from ClientProdDetails instead of Common data BBVACLI-519 Pranav D 12-Oct-2022
              this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'DCN')].CPM_Format).toString().split(',');
              this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'DCN')].ActiveYN;
              //  
            }
          }

          this.mappedformatlistLocation = this.apifunctions.GetCommonDataType('FXDCNFormat');

          this.Issuedate = this.datepipe.transform(cloneData.InputIssueDate[0].split('T')[0], 'yyyy-MM-dd');
          this.Fixingdate = this.datepipe.transform(cloneData.InputFixingDate[0], 'yyyy-MM-dd');
           
          this.Maturitydate = this.datepipe.transform(cloneData.InputMaturityDate[0].split('T')[0], 'yyyy-MM-dd');

          // this.stkshift = cloneData['ComputedStrikeFixingLag'];
          // this.paymentshift = cloneData['ComputedSettlementPeriodSoftTenor'];
          // this.expshift = cloneData['ComputedPayoffSoftTenor'];
          //Added cloneData?.TransactionTime !== undefined | Anubhav Goyal | 16-Jun-2023 | From schedule price tag Undefined
          if (cloneData?.TransactionTime !== undefined && cloneData.TransactionTime[0] !== '') {
            this.Timestamp = cloneData.TransactionTime[0];
          } else {
            this.Timestamp = '';
          }

          this.rfqID = cloneData.RFQID[0];
          this.NoteMasterID = cloneData.Note_Master_Id[0];
          if (!cloneData.PSID || cloneData.PSID[0] === '') {
            this.sortedAllPrices = [{
              Price: (cloneData.SolveForValue === undefined || cloneData.SolveForValue[0] === undefined || cloneData.SolveForValue[0] === '')
                ? 'Rejected' : cloneData.SolveForValue[0],
              solveFor: cloneData.InputRFQSolveFor[0],
              Price1: (cloneData.SolveForValue2 === undefined || cloneData.SolveForValue2[0] === undefined || cloneData.SolveForValue2[0] === '')
                ? 'Rejected' : cloneData.SolveForValue2[0],
              QueueStatus: cloneData.QueueStatus[0] === 'Response Received' && cloneData.SolveForStatus1[0].toUpperCase() === 'REJECTED' ? 'Rejected Request'
                : cloneData.QueueStatus[0],
              QueueStatus1: cloneData.QueueStatus[0] === 'Response Received' && cloneData.SolveForStatus2[0].toUpperCase() === 'REJECTED' ? 'Rejected Request'
                : cloneData.QueueStatus[0],
            }];
          }
          switch (cloneData.InputRFQSolveFor[0]) {
            case 'Coupon':
              if (cloneData.SolveForValue[0] !== '') {
                // Added by RiddhiP || 5june23 || BBVAEPCLI-585 || Add up to 6 Decimals to the coupon p.p in FX e pericer

                // this.CpnPct = parseFloat(cloneData.SolveForValue[0]).toFixed(2);
                this.CpnPct = cloneData.SolveForValue[0];
                // BBVAEPCLI-210 Pranav D 23-Nov-2022
                this.ChangeCouponPct('CpnPct');
              } else {
                this.CpnPct = '';
                // BBVAEPCLI-210 Pranav D 23-Nov-2022
                this.CouponPct = '';
              }
              // BBVACLI-633 Pranav D 1-Dec-2022
	      // changed/ commented by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side || clonning from prev quotes also from api only || no calculations from angular side
        
              // this.calculateSpread('Strike');
              this.replySolveFor = 'Coupon';
              break;
            case 'Strike':
              if (cloneData.SolveForValue[0] !== '') {
                // strike value fixed as per currency pair decimal value Pranav D 1-Nov-2022
                this.Strike = parseFloat(cloneData.SolveForValue[0]).toFixed(this.receivedDeciamlofCcyPair);
              } else {
                this.Strike = '';
              }

              // this.replySolveFor = 'Strike';
	      // changed/ commented by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side || clonning from prev quotes also from api only || no calculations from angular side
        
              // this.calculateSpread('Strike');
              // Strike - Spread changed to Strike / Spread Pranav D  BBVACLI-571
              this.replySolveFor = 'Strike / Spread';

              break;
            case 'IBPrice':
              if (cloneData.SolveForValue[0] !== '') {
                // reoffer value value fixed as per currency pair decimal value Pranav D 1-Nov-2022
                // BBVAEPCLI-199 changes made for precision for reoffer price Pranav D 10-Nov-2022 
                // START : BBVACLI-641 Pranav D 28-Nov-2022 If else added to show reoffer price decimals as per precision checkbox selection, if checkbox selected then 6 decimal or 2 decimals
                if (this.issuePriceBox) {
                  this.Price = parseFloat(cloneData.SolveForValue[0]).toFixed(6);
                  // START : BBVACLI-641 Pranav D 2-Dec-2022
                  this.sortedAllPrices[0].Price = parseFloat(cloneData.SolveForValue[0]).toFixed(6);
                  // END : BBVACLI-641 Pranav D 2-Dec-2022
                  this.GetReofferOrUpfront('Upfront');
                } else {
                  this.Price = parseFloat(cloneData.SolveForValue[0]).toFixed(2);
                  // START : BBVACLI-641 Pranav D 2-Dec-2022
                  this.sortedAllPrices[0].Price = parseFloat(cloneData.SolveForValue[0]).toFixed(2);
                  this.GetReofferOrUpfront('Upfront');
                  // END : BBVACLI-641 Pranav D 2-Dec-2022
                }
                // END : BBVACLI-641 Pranav D 28-Nov-2022 If else added to show reoffer price decimals as per precision checkbox selection, if checkbox selected then 6 decimal or 2 decimals
              } else {
                this.Price = '';
              }

              // this.replySolveFor = 'IBPrice';
              // BBVACLI-633 Pranav D 1-Dec-2022
	       // changed/ commented by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side || clonning from prev quotes also from api only || no calculations from angular side
        
              // this.calculateSpread('Strike');
              this.replySolveFor = 'Reoffer Price';
              break;
            // added by Suvarna P || 18Jul2022 || solveFor Fee issues || assigned by Pranav D.
            case 'Fee':
              this.fetchRealTimeSpotValue(); // Added by Anubhav Goyal 28-Aug-2023 | BBVAEPCLI-677 
              if (cloneData.SolveForValue[0] !== '') {
                // START : BBVACLI-637 Pranav D 28-Nov-2022
                this.Fee = parseFloat(cloneData.SolveForValue[0]).toFixed(4);
                this.sortedAllPrices[0].Price = parseFloat(this.sortedAllPrices[0].Price).toFixed(4);
                // END : BBVACLI-637 Pranav D 28-Nov-2022
              } else {
                this.Fee = '';
              }
              // BBVACLI-633 Pranav D 1-Dec-2022
	       // changed/ commented by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side || clonning from prev quotes also from api only || no calculations from angular side
        
              // this.calculateSpread('Strike');
              this.replySolveFor = 'Fee';
              this.feeAmtCalc(this.midRate);
              break;
          }
        }
      }


    } catch (error) {
       
    }
  }

 // changed/ commented by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side || clonning from prev quotes also from api only || no calculations from angular side
 // start || added common function here to set spot, strike and spread values       
  setSpotStrikeSpreadValues(cloneData : any, viewOnly : any){
   
    // start || added by Suvarna P || 17Aug23 || BBVACLI-1235 || NULL check missing 
    if(this.SolveForValue !== 'Strike - Spread'){
    // this.Strike = cloneData.DCNStrike[0];
    // this.Spread = cloneData.DCNSpread[0];
    // this.Spot = cloneData.SolveForValue2[0];
    this.Strike = cloneData?.DCNStrike[0];
    this.Spread = cloneData?.DCNSpread[0];
    this.Spot = cloneData?.SolveForValue2[0];
    this.SpotReceived = cloneData?.SolveForValue2
    // this.Spot = cloneData.Spot[0];
    this.manualSpreadValue = 'N'
    this.manualSpotValue = 'N'
    this.clientEntrySpotFlag = false;

    if (cloneData?.InputSpotPrice !== undefined && cloneData.InputSpotPrice[0] !== '') {
      this.Spot = cloneData?.InputSpotPrice[0];
      this.SpotReceived = '';
      this.manualSpotValue = 'Y'
      this.clientEntrySpotFlag = true;
    }
    if (cloneData?.InputSpreadPercent !== undefined && cloneData.InputSpreadPercent[0] !== '') {
      this.Spread = cloneData?.InputSpreadPercent[0];
      this.manualSpreadValue = 'Y'
    }
    if (cloneData?.InputStrikePercent !== undefined && cloneData.InputStrikePercent[0] !== '') {
      this.Strike = cloneData?.InputStrikePercent[0];
    }
  }
  else{
    // this.Strike = cloneData.DCNStrike[0];
    // this.Spread = cloneData.DCNSpread[0];
    // this.Spot = cloneData.SolveForValue2[0];
    this.Strike = cloneData?.DCNStrike[0];
    this.Spread = cloneData?.DCNSpread[0];
    this.Spot = cloneData?.SolveForValue2[0];
    this.SpotReceived = cloneData?.SolveForValue2
    // this.Spot = cloneData.Spot[0];
    this.manualSpreadValue = 'N'
    this.manualSpotValue = 'N'
    this.clientEntrySpotFlag = false;

    if (cloneData?.InputSpotPrice !== undefined && cloneData.InputSpotPrice[0] !== '') {
      this.Spot = cloneData?.InputSpotPrice[0];
      this.SpotReceived = '';
      this.manualSpotValue = 'Y'
      this.clientEntrySpotFlag = true;
    }
  }
  // end || added by Suvarna P || 17Aug23 || BBVACLI-1235 || NULL check missing 

 }
   // changed/ commented by Suvarna P || 14Aug23 || BBVACLI-1229 || Strike, spot and spread to have same values on UI, blotters and deal done mails || to fetch Spread calculation and decimal places from api side || clonning from prev quotes also from api only || no calculations from angular side
 // end || added common function here to set spot, strike and spread values  
  setSaveQuoteData(cloneData: any, viewOnly: any) {
     
    try {
      this.onBehalfOf = cloneData.onBehalfOf;
      // this.getLocation(this.onBehalfOf);
      this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
      if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
        if (this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'DCN') > -1) {
          this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'DCN')].CPM_Format).toString().split(',');
          this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex((record: any) => record.CPM_Product === 'DCN')].ActiveYN;
          //  
        }
      }
      this.mappedformatlistLocation = this.apifunctions.GetCommonDataType('FXDCNFormat');
      // this.ddlNoteCcy = cloneData.Ccy;
      this.format = cloneData.FormatDetails;
      this.formatChange(this.format);
      // code changes done by Pranav D 29-Mar-2022 to enable CHF and GBP currency as asked by BBVA on clone action BBVACLI-136
      // if (cloneData.FormatDetails === 'Swap' && (cloneData.Ccy === 'CHF' || cloneData.Ccy === 'GBP')) {
      //     this.ddlNoteCcy = 'EUR';
      // }
      this.SolveForValue = cloneData.SolveFor;
      if (this.SolveForValue === 'IBPrice') {
        this.SolveForValue = 'Reoffer Price';
      } else if (this.SolveForValue === 'Strike') {
        this.SolveForValue = 'Strike - Spread';
      }
      this.Size = cloneData.Size.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      this.Currency = cloneData.CurrencyPair;
      this.altCcy = cloneData.AltCcy;
      this.depoCcy = cloneData.DepositCurrency;
      this.ddlccy = cloneData.Ccy;

      if (cloneData.CostPercent !== '') {
        this.Cost = cloneData.CostPercent;
      } else {
        this.Cost = '0';
      }


      // this.Price = cloneData.ReofferPrice;
      // added by Suvarna P || 07Sept2022 || Full Precision chkBox changes || assigned by Pranav D.
      var fullPrecission = cloneData.FullPrecision.toString().toUpperCase() === 'Y' ? true : false;
      this.issuePriceBox = fullPrecission;
      this.setIssuePriceCheckBox(fullPrecission);
      //if sove for reoffer then reoffer show NaN resolved Pranav D 13-Oct-2022 BBVACLI-534
      if (this.SolveForValue === 'Reoffer Price') {
        this.Price = '';
      } else {
        this.Price = cloneData.ReofferPrice;
        this.setIssuePriceCheckBox(fullPrecission);
      }

      if (this.SolveForValue === 'Strike - Spread') {
        this.Strike = '';
        this.Spread = '';
      } else {
        this.Strike = cloneData.InputStrikePercent;
        if (this.manualSpreadValue === 'N') {
          this.Spread = '';
        } else {
          this.Spread = cloneData.InputSpreadPercent; // no values 
        }
      }

      this.IssuePrice = cloneData.IssuePrice;
      this.Fixing = cloneData.Fixing;
      //Added by Anubhav Goyal | 14-Apr-2023 | Reduce API call
      if (this.apifunctions.optCutArr == undefined || this.apifunctions.optCutArr.length <= 0) {
        this.onOptCutChange();
      } else {
        
      }

      // this.Fee = cloneData.InputFeePercent;
      // this.Feeamt = cloneData.InputFeeAmount;

      this.Spot = cloneData.InputSpotPrice;
      this.Strike = cloneData.Strike;
      this.Spread = cloneData.IndexRateSpread;
      this.CpnPct = cloneData.CouponPer;
      this.ChangeCouponPct('CpnPct'); //Added by Anubhav Goyal | 17-Mar-2023 | BBVACLI-931 
      this.CouponPct = this.CouponPct  //Added by Anubhav Goyal | 17-Mar-2023 | BBVACLI-931 
      this.Issueshift = cloneData.InputIssueDateShifter;
      this.Fixingshifter = cloneData.InputFixingDateShifter;
      this.Maturityshifter = cloneData.InputMaturityDateShifter;
       
      this.setDCNDates();
      if (this.Fixingshifter == '') {
        this.Fixingdate = cloneData.InputFixingDate;
         
      }
      this.matDateChk = cloneData.MaturityDateCheck === 'Y' ? true : false;
      if (cloneData.CostPercent) {
        this.Cost = cloneData.CostPercent;
      } else {
        this.Cost = '0';
      }


      this.Fee = cloneData.InputFeePercent;
      this.FeeAmtCcy = cloneData.feeAmountCurrency; // Added by Anubhav Goyal | 16-Jun-2023 | EPCLI-593
      this.Feeamt = cloneData.InputFeeAmount;
      //this.feeAmtCalc(this.midRate);
      // added by Suvarna P || 07Sept2022 || FeeOverride chkBox changes || assigned by Pranav D.
      var feeChkBox = cloneData.FeeOverride.toString().toUpperCase() === 'Y' ? true : false;
      this.feeChkBox = feeChkBox;
      this.setFeeCheckBox(feeChkBox);

      //Added by Anubhav Goyal | 16-May-2023 | EPCLI-530
      this.invoiceDiscountToggle = cloneData.UpfrontMode;
      // BBVAEPCLI-122 Pranav D 1-Nov-2022 added upfront and related calculation for new field
      if (cloneData.Upfront !== '') {
        this.Upfront = cloneData.Upfront;
	// Suvarna P || 19Jul23 || BBVACLI-1173 || DCN: Solve for reoffer case, reoffer xml value being sent as 100
        this.GetReofferOrUpfront('Reoffer Price');
      } else {
        this.GetReofferOrUpfront('Upfront');
      }

      if (viewOnly) {
        this.Issuedate = cloneData.IssueDate.split(' ')[0];
        // this.Fixingdate = cloneData.InputFixingDate; this.datepipe.transform(this.Dates.MaturityDate, 'yyyy-MM-dd');
        this.Fixingdate = this.datepipe.transform(cloneData.InputFixingDate, 'yyyy-MM-dd');
         
        this.Maturitydate = cloneData.MaturityDate.split(' ')[0];
        this.rfqID = '';
        this.replySolveFor = cloneData.RFQID;
        this.sortedAllPrices = [];
      }
      else {

        switch (this.SolveForValue) {
          case 'Coupon':
            this.CpnPct = '';
            this.CouponPct = ''  //Added if condition | by Anubhav Goyal | 20-Mar-2023 | 3:30pm | BBVACLI-931 Reoffer Price is not in full precision when viewed from Dashboard, coupon (%) going blank
            break;
          case 'Strike':
            break;
          case 'Strike - Spread':
            this.Strike = '';
            break;
          case 'IBPrice':
            break;
          case 'Reoffer Price':
            this.Price = '';
            break;
          // added by Suvarna P || 18Jul2022 || solveFor Fee issues || assigned by Pranav D.
          case 'Fee':
            this.Fee = '';
            break;
        }
      }

    } catch (error) {
       
    }
  }
  // added by Suvarna  P || 13Jul2022 || DCN clonning view functionality from Prev quotes and Saved req || assign by Suvarna P || end

  formatChange(format: string) {
    try {
      if (format === '') {
        return false;
      }

      // BVVAEPCLI-177 Pranav D 28-Nov-2022
      this.GetFXOptionCut();
      // this.mappedformatlist.forEach((item, res) => {
      //   if (item.Data_Value === format) {
      //     this.location = item.Misc2;
      //   }
      // });

      this.mappedformatlistLocation.forEach((res: { Data_Value: any; Misc2: any; }) => {
        if (res.Data_Value === format) {
          this.location = res.Misc2;
        }
      });
       

      // START : IF else block added by Pranav D 27-Feb-2023 BBVAEPCLI-383 D+2 ewmoved from issue shifter array as per Foamt note selection and 
      // again API re fetched to have D+2 is format is different than Note
      if (this.format === 'Note') {
        // this.issueDateShifter.splice(this.issueDateShifter.indexOf('D+2'), this.issueDateShifter.indexOf('D+2') + 1);        //Vaibhav B | 13-03-2023 | BBVAEPCLI-417 | BBVAEPCLI-383 change reverted as asked by Shikhar G.
        //  
      // added by Suvarna P || 19Aug2021 ||BBVAEPCLI-7 For Mexican clients, default currency and fixing changes || assigned by Pranav D. || start
      if (this.location === 'Mexico') {
        // START : BBVACLI-609  Pranav D 10-Nov-2022 shifters were not getting cleared on format change
        this.Issueshift = '';
        this.Fixingshifter = '';
        // END : BBVACLI-609  Pranav D 10-Nov-2022 shifters were not getting cleared on format change
        this.Currency = 'USD - MXN';
        this.fetchDecimalfromCcyPair(this.Currency);
        // this.Fixing = "BFIX 10AM NY";
        // BBVAEPCLI-200 Pranav D 10-Nov-2022 default fixing changed
        this.Fixing = "BFIX 12:30PM NY";

        this.Issueshift = this.Issueshift === '' ? "D+2" : this.Issueshift;
        this.Fixingshifter = this.Fixingshifter === '' ? "M-2" : this.Fixingshifter;
      }
      else {
        // START : BBVACLI-609  Pranav D 10-Nov-2022 shifters were not getting cleared on format change
        this.Issueshift = '';
        this.Fixingshifter = '';
        // END : BBVACLI-609  Pranav D 10-Nov-2022 shifters were not getting cleared on format change
        this.Currency = 'EUR - USD';
        this.fetchDecimalfromCcyPair(this.Currency);
          //this.Fixing = "WMR 10AM NY";
          this.Fixing = this.ddlOptCut[0];//Added by Anubhav Goyal | 18-May-2023 | BBVAEPCLI-541 Modify "fixing" for Note format in DCN
          // START : BBVAEPCLI-165 Default values changed Pranav D 2-Nov-2022
        this.Issueshift = this.Issueshift === '' ? "D+5" : this.Issueshift;
        this.Fixingshifter = this.Fixingshifter === '' ? "M-5" : this.Fixingshifter;
        // END : BBVAEPCLI-165 Default values changed Pranav D 2-Nov-2022
      }
      this.Maturityshifter = this.Maturityshifter === '' ? '14D' : this.Maturityshifter;
       //Added by Anubhav Goyal | 14-Apr-2023 | Reduce API call
        if (this.apifunctions.optCutArr == undefined || this.apifunctions.optCutArr.length <= 0) {
          this.onOptCutChange();
        } else {
          
        }     //Added by Vaibhav B | 08-03-2023 | To remove extra API calls as compared to Old UI
      this.fillSizeDropdown(this.Currency);

      // START : BBVAEPCLI-165 Default values changed Pranav D 2-Nov-2022 and condition removed for ease of code
      // if ((this.location !== 'Mexico' && this.Issueshift == 'D+2') || (this.location !== 'Mexico' && this.Fixingshifter == 'M-2')) {
      if (this.location !== 'Mexico' && this.Issueshift == 'D+2') {
        this.Issueshift = "D+5";
      }
      if (this.location !== 'Mexico' && this.Fixingshifter == 'M-2') {
        this.Fixingshifter = "M-5";
      }
        // END : BBVAEPCLI-165 Default values changed Pranav D 2-Nov-2022 and condition removed for ease of code
        this.Spread = '';

        this.setDCNDates();

      } else {
        //this.issueDateShifter = this.apifunctions.GetCommonDataType('IssueDate_DCN');
        this.sortIssueShifterArr();
        this.GetFXOptionCut();

        this.mappedformatlistLocation.forEach((res: { Data_Value: any; Misc2: any; }) => {
          if (res.Data_Value === format) {
            this.location = res.Misc2;
          }
        });

        // added by Suvarna P || 19Aug2021 ||BBVAEPCLI-7 For Mexican clients, default currency and fixing changes || assigned by Pranav D. || start
        if (this.location === 'Mexico') {
          // START : BBVACLI-609  Pranav D 10-Nov-2022 shifters were not getting cleared on format change
          this.Issueshift = '';
          this.Fixingshifter = '';
          // END : BBVACLI-609  Pranav D 10-Nov-2022 shifters were not getting cleared on format change
          this.Currency = 'USD - MXN';
          this.fetchDecimalfromCcyPair(this.Currency);
          // this.Fixing = "BFIX 10AM NY";
          // BBVAEPCLI-200 Pranav D 10-Nov-2022 default fixing changed
          this.Fixing = "BFIX 12:30PM NY";

          this.Issueshift = this.Issueshift === '' ? "D+2" : this.Issueshift;
          this.Fixingshifter = this.Fixingshifter === '' ? "M-2" : this.Fixingshifter;
        }
        else {
          // START : BBVACLI-609  Pranav D 10-Nov-2022 shifters were not getting cleared on format change
          this.Issueshift = '';
          this.Fixingshifter = '';
          // END : BBVACLI-609  Pranav D 10-Nov-2022 shifters were not getting cleared on format change
          this.Currency = 'EUR - USD';
          this.fetchDecimalfromCcyPair(this.Currency);
          //this.Fixing = "WMR 10AM NY";
          this.Fixing = this.ddlOptCut[0];//Added by Anubhav Goyal | 18-May-2023 | BBVAEPCLI-541 Modify "fixing" for Note format in DCN
          // START : BBVAEPCLI-165 Default values changed Pranav D 2-Nov-2022
          this.Issueshift = this.Issueshift === '' ? "D+5" : this.Issueshift;
          this.Fixingshifter = this.Fixingshifter === '' ? "M-5" : this.Fixingshifter;
          // END : BBVAEPCLI-165 Default values changed Pranav D 2-Nov-2022
        }
        this.Maturityshifter = this.Maturityshifter === '' ? '14D' : this.Maturityshifter;
        //Added by Anubhav Goyal | 14-Apr-2023 | Reduce API call
        if (this.apifunctions.optCutArr == undefined || this.apifunctions.optCutArr.length <= 0) {
          this.onOptCutChange();
        } else {
          
        }
        this.fillSizeDropdown(this.Currency);

        // START : BBVAEPCLI-165 Default values changed Pranav D 2-Nov-2022 and condition removed for ease of code

        if (this.location !== 'Mexico' && this.Issueshift == 'D+2') {
          this.Issueshift = "D+5";
        }
        if (this.location !== 'Mexico' && this.Fixingshifter == 'M-2') {
          this.Fixingshifter = "M-5";
        }

        // END : BBVAEPCLI-165 Default values changed Pranav D 2-Nov-2022 and condition removed for ease of code
        this.Spread = '';

        this.setDCNDates();
        // added by Suvarna P || 19Aug2021 ||BBVAEPCLI-7 For Mexican clients, default currency and fixing changes || assigned by Pranav D. || end
      }
      // END : IF else block added by Pranav D 27-Feb-2023 BBVAEPCLI-383 D+2 ewmoved from issue shifter array as per Foamt note selection and 
      // again API re fetched to have D+2 is format is different than Note
      // added by Suvarna P || 30Aug23 || BBVACLI-1254 || DCN: On changing the format the franchise value is not getting updated
      this.fetchRealTimeSpotValue();
    } catch (error) {

    }
  }
  // added bby Suvarna P || 03Aug2022 ||  BBVAEPCLI-29 Add a box on the side of the fee filed for internal users only || start
  setFeeChk(isChecked: any) {
    try {
      // const matDateChk = document.querySelector('.matDateChk') as HTMLInputElement;

      if (isChecked) {
        this.matFeeChk = true;
      } else {
        this.matFeeChk = false;
        // this.Maturityshifter = '';
        // this.maturityDateShifter = this.apifunctions.GetCommonDataType('MaturityShifter_DCN');
        // this.sortMaturityShifterArr();
        // this.Maturityshifter = '14D';
        // this.getMaturityDate();
      }
    } catch (error) {

    }
  }
 

  // added bby Suvarna P || 03Aug2022 ||  BBVAEPCLI-29 Add a box on the side of the fee filed for internal users only || end

  setFeeCheckBox(feeChecked: any) {
    try {
      // START : if else blank added by Pranav D 24-Nov-2022 BBVACLI-638 to make fee blank on solve for Fee selection
      if (this.SolveForValue !== 'Fee') {
        if (feeChecked) {
          // this.showFeePopup = true;
          // added by Riddhi P || 29Sept2022 || showing of four digits for fee(%) p.a. on checked of fee override checkbox
          this.Fee = parseFloat(this.Fee).toFixed(4);
          this.allowPricingFee = true;
        } else {
          // this.showFeePopup = false;
          // Added by Riddhi P|| 29Sept2022 ||   showing of four digits for fee(%) p.a. on unchecked of fee override checkbox
          this.Fee = parseFloat(this.Fee).toFixed(4);
          this.allowPricingFee = false;
        }
        // 
      } else {
        this.Fee = '';
      }
      // END : if else blank added by Pranav D 24-Nov-2022 BBVACLI-638 to make fee blank on solve for Fee selection
    } catch (error) {

    }
  }
  // Added by Pranav D 16-Aug-2022 BBVAEPCLI-29 

  GetEventTarget(e: { target: any; srcElement: any; currentTarget: any; }): any {
    try {
      const target: any = e.target || e.srcElement || e.currentTarget || null;
      return target;
    } catch (error) {
       
    }
  }

  setDecimalReofferPrice(e: any, issuePriceBox: any) {
    try {
      const target: any = this.GetEventTarget(e);
      if (target.value.trim() === '' || isNaN(target.value)) {
        target.value = parseFloat('0.00').toFixed(2);
      } else {
        if (issuePriceBox) {
          target.value = parseFloat(target.value).toFixed(6);
          //  
        } else {
          target.value = parseFloat(target.value).toFixed(2);
          //  
        }

      }
      return target.value;
    } catch (error) {
       
    }
  }

  setIssuePriceCheckBox(issuePriceBox: any) {
    try {
      // START : BBVAEPCLI-166 Pranav D 2-Nov-2022 Non rounded value and rounded value on precision check box
      //Added .checked | Anubhav Goyal | 23-01-2023
      //Added if condition | by Anubhav Goyal | 13-Mar-2023 | 3:30pm | BBVACLI-931 Reoffer Price is not in full precision when viewed from Dashboard, coupon (%) going blank
      if (issuePriceBox == true || issuePriceBox == false) {
        this.issuePriceBox = issuePriceBox
      }
      else{
        this.issuePriceBox = issuePriceBox.checked;
      }
      if (this.SolveForValue !== 'Reoffer Price') {
        if (this.issuePriceBox) {  //Added this. | Anubhav Goyal | 23-01-2023
          this.GetReofferOrUpfront('Upfront');
          this.Price = parseFloat(this.Price).toFixed(6);
          // BBVAEPCLI-166 decimal matched with reoffer price for upfront Pranav D 2-Nov-2022
          this.Upfront = parseFloat(this.Upfront).toFixed(6);
        } else {
          this.Price = parseFloat(this.Price).toFixed(2);
          // BBVAEPCLI-166 decimal matched with reoffer price for upfront Pranav D 2-Nov-2022
          this.Upfront = parseFloat(this.Upfront).toFixed(2);
        }
      } else {
        // START : BBVAEPCLI-199 Pranav D 10-Nov-2022 to make value upto 6 decimal on precision click
        if (document.getElementById('txtprice')!.classList.contains('reply')) {
          if (this.issuePriceBox === true) {
            // this.Price = parseFloat(this.Price).toFixed(6);
            this.Price = parseFloat(this.receivedReoffer).toFixed(6);
            this.Upfront = parseFloat(this.Upfront).toFixed(6);
          } else {
            this.Price = parseFloat(this.Price).toFixed(2);
            this.Upfront = parseFloat(this.Upfront).toFixed(2);
          }
        } else if (this.viewOnly) {
          if (this.issuePriceBox === true) {
            this.Price = parseFloat(this.receivedReoffer).toFixed(6);
            this.Upfront = parseFloat(this.Upfront).toFixed(6);
          } else {
            this.Price = parseFloat(this.Price).toFixed(2);
            this.Upfront = parseFloat(this.Upfront).toFixed(2);
          }
        }
        // END : BBVAEPCLI-199 Pranav D 10-Nov-2022 to make value upto 6 decimal on precision click
        else {
          this.Price = '';
          this.Upfront = '';
        }
      }

      // END : BBVAEPCLI-166 Pranav D 2-Nov-2022 Non rounded value and rounded value on precision check box
    } catch (error) {

    }
  }

  getTodayDate() {
    try {
      var todayDate = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
      todayDate = todayDate.split(',')[0];
      var todayFormattedDate = todayDate.split('/')[2] + "-" + todayDate.split('/')[1] + "-" + todayDate.split('/')[0];
      this.TradeDate = todayFormattedDate;
      const d = new Date();
      this.confirmTradeDate = d.getFullYear().toString() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    } catch (error) {

    }
  }

  GetDCNBankSpreadCost() {
    try {
      let costField: any;
      let days: any;

      if (this.Maturityshifter.includes('D')) {
        days = this.Maturityshifter.split('D')[0];
      } else if (this.Maturityshifter.includes('M')) {
        days = parseFloat(this.Maturityshifter.split('M')[0]) * 30;
        // this.Maturityshifter.includes('W') Pranav D 13-Oct-2022 BBVAEPCLI-115
      } else if (this.Maturityshifter.includes('W')) {
        days = parseFloat(this.Maturityshifter.split('W')[0]) * 7;
      } else {

      }

      // costField = this.apifunctions.GetDCNBankSpreadCost(this.format.replace(/ /g, ''), this.Size.replace(/,/g, ''), this.Maturityshifter.split('D')[0]);
      costField = this.apifunctions.GetDCNBankSpreadCost(this.format, this.Size.replace(/,/g, ''), days, this.Currency, this.depoCcy);
       
       

      if (costField.length > 0) {
        this.Cost = costField[0].Cost;
      } else {
        this.Cost = '0';
      }
    } catch (error) {

    }
  }

  // BBVAEPCLI-93 10-Oct-2022 Pranav D enable spot edit flag on toggle button
  editSpotValue() {
    try {
      if (this.manualSpotValue === 'Y') {
        this.clientEntrySpotFlag = true;
        this.calculateSpread('Strike');
        document.getElementById('txtspot')!.classList.remove('reply');
        // START : BBVAEPCLI-496 18-Apr-2023 ManualSpot to be Yes only if strike and spread is not empty
        if (this.Spread !== '' &&  this.Strike !== '') {
          this.manualSpotValue = 'Y';
          this.clientEntrySpotFlag = true;
        } 
        // END : BBVAEPCLI-496 18-Apr-2023 ManualSpot to be Yes only if strike and spread is not empty

      } else if (this.manualSpotValue === 'N') {
        
        this.Spot = '';
        this.clientEntrySpotFlag = false;
        this.DCNPriceValidation = false;
	// changed by Suvarna P || 14Aug23 || BBVACLI-1230 || Spread toggle to become yes, if strike is manually input and spot toggle is 'Yes'
        if(this.SolveForValue !== 'Strike - Spread'){
        this.manualSpreadValue = 'N'
        this.editSpreadValue();
        }

       
        // START : BBVAEPCLI-496 18-Apr-2023 ManualSpot to be Yes only if strike and spread is not empty
        if (this.Spread !== '' &&  this.Strike !== '') {
          this.manualSpotValue = 'Y';
          this.clientEntrySpotFlag = true;
          this.calculateSpread('Spot');
        } 
        // END : BBVAEPCLI-496 18-Apr-2023 ManualSpot to be Yes only if strike and spread is not empty
      }
    } catch (error) {

    }
  }

// start || changed by Suvarna P || 14Aug23 || BBVACLI-1230 || Spread toggle to become yes, if strike is manually input and spot toggle is 'Yes'
        
  editSpreadValue() {
    try {
      if (this.manualSpreadValue === 'Y') {
       // this.calculateSpread('Strike');
        if (this.SolveForValue === 'Strike - Spread') {
          this.manualSpreadValue = 'N';
        }
        else{
          this.calculateSpread('Strike');
        }
      } else {
        this.Spread = '';
        this.manualSpotValue = 'N'
        this.editSpotValue();

        // editSpreadValue
        // this.manualSpotValue()
      }
    } catch (error) {

    }
  }
// end || changed by Suvarna P || 14Aug23 || BBVACLI-1230 || Spread toggle to become yes, if strike is manually input and spot toggle is 'Yes'
        

  // START : Get LP Status Pranav D 11-Oct-2022 BBVACLI-509

  GetLinkProviderStatus() {
    try {
      this.LPStatus = this.apifunctions.GetLinkProviderStatus('BBVA IB');
    } catch (error) {

    }
  }

  // END : Get LP Status Pranav D 11-Oct-2022 BBVACLI-509

  // START : Pranav D 17-Oct-2022 BBVACLI-535

  fetchRealTimeSpotValue() {
    try {
      this.midRate = '';
      let tempCcy = this.ddlccy + ' - ' + this.FeeAmtCcy;
      this.realTimeSpotArr = this.apifunctions.GetSpotRatesCrossDetails();
       
      let firstOccurence: boolean = false;
      let secondOccurence: boolean = false;

      this.realTimeSpotArr.forEach(res => {
        if (res.Code === tempCcy) {
          if (parseFloat(res.Mid) === 0) {
            this.midRate = 1;
            firstOccurence = true;
            this.feeAmtCalc(this.midRate);
          } else {
            this.midRate = res.Mid;
            firstOccurence = true;
            this.feeAmtCalc(this.midRate);
          }

        }
      });

      if (!firstOccurence) {
        // if (parseFloat(this.midRate) === 0 || this.midRate === undefined) {
        let tempCcy1 = this.FeeAmtCcy + ' - ' + this.ddlccy;
        this.realTimeSpotArr.forEach(res => {
          if (res.Code === tempCcy1) {
            if (parseFloat(res.Mid1) === 0) {
              this.midRate = 1;
              secondOccurence = true;
              this.feeAmtCalc(this.midRate);
            } else {
              this.midRate = res.Mid1;
              secondOccurence = true;
              this.feeAmtCalc(this.midRate);
            }
          }
        });
        // }
      }

      if (!firstOccurence && !secondOccurence) {
        this.midRate = 1;
        this.feeAmtCalc(this.midRate);
      }

       

    } catch (error) {

    }
  }
  // END : Pranav D 17-Oct-2022 BBVACLI-535 


  checkValidNotional(e: any) {
    try {
      const NotionalData = this.commonfunctions.checkValidNotional(e);
      if (NotionalData.ErrorMsg === '') {
        this.Size = NotionalData.Notional;
        e.target.value = this.Size;
      } else {

        this.ErrorMsg = NotionalData.ErrorMsg;
      }

    } catch (error) {
       
    }
  }


  // START : BBVAEPCLI-122 Pranav D 31-Oct-2022 to get upfront
  GetReofferOrUpfront(property: string) {
    try {
      let UpfrontArr = [];
      let yearBasis = '';

      this.CurrencyPair.forEach(res => {
        if (res.Asset1 === this.ddlccy) {
          yearBasis = res.Asset1_Year_Basis;
        } else {
          yearBasis = res.Asset2_Year_Basis;
        }
      });

      if (property === 'Reoffer Price') {
        //Added Issue Price | Anubhav Goyal | 26-May-2023 | BBVAEPCLI-565
        UpfrontArr = this.apifunctions.GetReofferOrUpfront(this.noOfDays, yearBasis, this.Upfront, '', this.IssuePrice);

        // BBVAEPCLI-166 Decimal equal to reoffer field if full precision is checked Pranav D 2-Nov-2022
        if (this.issuePriceBox) {
          this.Price = parseFloat(UpfrontArr[0].Reoffer).toFixed(6);
          this.Upfront = parseFloat(UpfrontArr[0].Upfront).toFixed(6);
        } else {
          this.Price = parseFloat(UpfrontArr[0].Reoffer).toFixed(2);
          this.Upfront = parseFloat(UpfrontArr[0].Upfront).toFixed(2);
        }
        this.detailedReofferPrice = parseFloat(UpfrontArr[0].Reoffer); // Added by Pranav D 26-Jun-2023 BBVAEPCLI-597 as reoffer price must br sent in 6 decimals to xml tag
                                                                        // irrespective of full precision check box checked or unchecked

      } else {
         //Added Issue Price | Anubhav Goyal | 26-May-2023 | BBVAEPCLI-565
        UpfrontArr = this.apifunctions.GetReofferOrUpfront(this.noOfDays, yearBasis, '', this.Price, this.IssuePrice);

        // BBVAEPCLI-166 if condition to make Decimal equal to reoffer field if full precision is checked Pranav D 2-Nov-2022
        if (this.issuePriceBox) {
          this.Price = parseFloat(UpfrontArr[0].Reoffer).toFixed(6);
          this.Upfront = parseFloat(UpfrontArr[0].Upfront).toFixed(6);
        } else {
          this.Price = parseFloat(UpfrontArr[0].Reoffer).toFixed(2);
          this.Upfront = parseFloat(UpfrontArr[0].Upfront).toFixed(2);
        }
        this.detailedReofferPrice = parseFloat(UpfrontArr[0].Reoffer); // Added by Pranav D 26-Jun-2023 BBVAEPCLI-597 as reoffer price must br sent in 6 decimals to xml tag
                                                                       // irrespective of full precision check box checked or unchecked
      }

       
    } catch (error) {

    }
  }
  // END : BBVAEPCLI-122 Pranav D 31-Oct-2022 to get upfront

  // START : BBAEPCLI-210 Pranav D 23-Nov-2022 coupon (%) calculation
  ChangeCouponPct(direction: any) {
    try {
      let yearBasis: any;
      this.CurrencyPair.forEach(res => {
        if (res.Asset1 === this.ddlccy) {
          yearBasis = res.Asset1_Year_Basis;
        } else {
          yearBasis = res.Asset2_Year_Basis;
        }
      });

      if (direction === 'CpnPct') {
        if (this.SolveForValue !== 'Coupon') {
          this.CouponPct = parseFloat(this.CpnPct) * (this.noOfDays / yearBasis);
             // Added by RiddhiP || 5june23 || BBVAEPCLI-585 || Add up to 6 Decimals to the coupon p.p in FX e pericer
          // this.CouponPct = this.CouponPct.toFixed(2);
          this.CouponPct = parseFloat(this.CouponPct).toFixed(6);
        } else {
          if (this.CpnPct !== '') {
            this.CouponPct = parseFloat(this.CpnPct) * (this.noOfDays / yearBasis);
   // Added by RiddhiP || 5june23 || BBVAEPCLI-585 || Add up to 6 Decimals to the coupon p.p in FX e pericer
            // this.CouponPct = this.CouponPct.toFixed(2);
            this.CouponPct = parseFloat(this.CouponPct).toFixed(6);
          } else {
            this.CouponPct = '';
          }
        }
      }
      // else {
      //   if (this.SolveForValue !== 'Coupon') {
      //     this.CpnPct = parseFloat(this.CouponPct) * (yearBasis / this.noOfDays);
      //     this.CpnPct = this.CpnPct.toFixed(2);
      //   } else {
      //     if (this.CouponPct !== '') {
      //       this.CpnPct = parseFloat(this.CpnPct) * (this.noOfDays / yearBasis);
      //       this.CpnPct = this.CpnPct.toFixed(2);
      //     } else {
      //       this.CpnPct = '';
      //     }
      //   }
      // }


    } catch (error) {

    }
  }
  // END : BBAEPCLI-210 Pranav D 23-Nov-2022 coupon (%) calculation

  // START : Add to watchlist popup

  confirmtext =''
  hideProductPopup() {
    this.ErrorMsg = ""    
    this.ProductWatchlist = false;          // Vaibhav B | 14-03-2023 | BBVACLI-952 | Cancel and Close pop up not working in DCN Add to Watchlist popup

  
  }

  //Added by Anubhav Goyal | EPCLI-463 | 05-Apr-2023
  confirmtextDisplay = ''
  confirmTradePopup() {
    
    this.confirmOrderPopup = true;
    if (this.tradeBtnActionFlag) {
      this.confirmtext = 'Order Routed to Trader successfully.';
      this.confirmtextDisplay = 'Routed to Trader';

      this.secondsRemaining = 60; // To call 


      const interval1 = setInterval(() => {
        if (this.rfqID !== '' && this.secondsRemaining > 0) {
          

 // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D

          var res = this.apifunctions.DCNOrderStatus(this.rfqID)
          // this.apifunctions.DCNOrderStatus(this.rfqID)?.subscribe((res: any) => {
            this.confirmtextDisplay = res.status;
            this.placedOrderQueue = res.status;
            this.confirmtext = res.status;
            if (this.placedOrderQueue === 'Order Executed' || this.placedOrderQueue === 'Order Rejected' || this.placedOrderQueue === 'Order Timeout') {
              clearInterval(interval1);
            } else {

            }

            


          // })
        }
        if (this.secondsRemaining === -1) {
          clearInterval(interval1);
        }
        this.secondsRemaining--;
      }, 5000);


    } else {
      this.confirmtext = 'Order Initiated successfully.';
      this.confirmtextDisplay = 'Order Initiated';
      this.secondsRemaining = 60; // To call 


      const interval1 = setInterval(() => {
        if (this.rfqID !== '' && this.secondsRemaining > 0) {
          

 // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D

          var res = this.apifunctions.DCNOrderStatus(this.rfqID)
          // this.apifunctions.DCNOrderStatus(this.rfqID)?.subscribe((res: any) => {
            this.confirmtextDisplay = res.status;
            this.placedOrderQueue = res.status;
            this.confirmtext = res.status;
            if(this.placedOrderQueue === 'Order Executed' || this.placedOrderQueue === 'Order Rejected' || this.placedOrderQueue === 'Order Timeout'){
              clearInterval(interval1);
            }else{

            }
            
            
           
          // })
        } 
        if (this.secondsRemaining === -1) {
          clearInterval(interval1);
        }
        this.secondsRemaining--;
      }, 5000);


    }

    //Added by Anubhav Goyal | Popup to show Order Initiated
    // setTimeout(() => {
    //   this.confirmOrderPopup = false
    //   // this.confirmtext = ''
    // }, 5000);
    //End
    this.DCNTradeInitiate();
  }

  showddToWatchlistPopup() {
    try {
      this.targetValue = '';
      this.expiryDate = this.datepipe.transform(moment().add({ days: 30 }).format('YYYY-MM-DD'), 'yyyy-MM-dd');
      this.ErrorMsg = '';
      this.TimeValid = formatDate(new Date(), 'HH:mm', 'en-US');
      // moment(new Date(), "HH:mm") ;
      this.ProductWatchlist = !this.ProductWatchlist;
      this.infoMsg = '';
      this.scheduleMsg = '';
      this.expiryDate = this.datepipe.transform(moment().add({ days: 30 }).format('YYYY-MM-DD'), 'yyyy-MM-dd');
      // this.addWatchlistSolveFor = this.SolveForvalue;
      let solveForData = document.getElementById('SolveForValue')?.childNodes;
      solveForData?.forEach((res: any) => {
         
        if (res.value === this.SolveForValue) {
          this.addWatchlistSolveFor = res.innerText;
        }
      });
      // START : Pranav D 6-Jul-2023 BBVAEPCLI-624 direction made conditional based on solvefor
      // this.direction = 'Up';
      if (this.SolveForValue === 'IBPrice') {
        this.direction = 'Down';
      } else {
        this.direction = 'Up';
      }
      // END : Pranav D 6-Jul-2023 BBVAEPCLI-624 direction made conditional based on solvefor
      this.validationOnButton();
      if (this.ErrorMsg === '') {
        // this.ProductWatchlist = !this.ProductWatchlist;
        this.today();
      }
    } catch (error) {
       
    }
    return false;
  }

  hideAddToWatchlistPopup() {
    try {
      this.ProductWatchlist = false;
    } catch (error) {
       
    }
    return false;
  }

  AddToWatchlist() {
    try {
      if (this.targetValue != '') {
        if (this.expiryDate <= this.MaxSelectDate && this.expiryDate >= this.MinSelectDate) {
          this.dateChanged()
          this.scheduleMsg = '';
          this.ErrorMsg = '';
          this.infoMsg = '';
          this.validationOnButton();
          const sDate = new Date(this.inputDate + ' ' + this.commonfunctions.getInputTime(this.TimeValid));
          const today = new Date();
          // if (sDate < today) {
          //     this.ErrorMsg = 'Please enter valid time';
          //     return false;
          // }
          document.getElementById('scheduleMsg')?.classList.remove('error');
          const timeinsecs = JSON.stringify(Math.abs(Math.round((today.getTime() - sDate.getTime()) / 1000)));
          if (this.ErrorMsg === '') {
            this.portfolioGroupID = this.apifunctions.fnportfolioGroupID();
            if (isNaN(this.portfolioGroupID)) {
              this.ErrorMsg = "Price request failed. Please reload the application and try again.";
              return false;
            }
            const xmlstr = this.generateXML();

            const res = this.apifunctions.AddToWatchlist('DualCurrencyNote', xmlstr,
              sDate, 'SINGLE_PRICER', this.portfolioGroupID, timeinsecs, 'BBVA', this.SolveForValue,
              this.allBooksData[this.allBooksData.findIndex((x: any) => x.BookCode === this.onBehalfOf)].BookName,
              'DualCurrencyNote', 'DAILY', 'REGULAR', "", "Y", this.targetValue, this.direction, this.expiryDate, "N", "");
            if (res) {
              if (res.PS_PW_ID.toLowerCase() !== 'max') {
                if (res['IsScheduled']) {
                  this.WatchID = res['PS_PW_ID'];
                  this.scheduleMsg = 'Product successfully added to watchlist.';
                }
              } else {
                this.ErrorMsg = 'Max product in watchlist limit reached.';
                document.getElementById('scheduleMsg')?.classList.remove('successMsg');
                 
                document.getElementById('scheduleMsg')?.classList.add('error');
              }

            }
          }
        } else {
          this.ErrorMsg = 'Invalid Date.';
        }
      }
      else {
        this.ErrorMsg = 'Please enter Target Value.';
      }
    } catch (error) {

    }
    return false;
  }
  fundRatePopuptoggle() {
    this.fundRatePopup != this.fundRatePopup;
  }

  //START: Added function to check Fee Policy | Anubhav Goyal | 2-June-2023 |  BBVAEPCLI-567 New logic in terms of fee policy (Number 11 in Blanca's mail)
  getFeePolicy() {
    var ch = this.Maturityshifter.charAt(this.Maturityshifter.length - 1);
    var tenor = this.Maturityshifter.split(/[DM]+/)[0];
    if (ch == 'M') {
      var TenorinDays = parseInt(tenor) * 30;
    } else {
      TenorinDays = parseInt(tenor);
    }
    this.feePolicy = this.apifunctions.GetFeePolicy(this.IssuePrice, this.Price, TenorinDays);
    if (this.feePolicy.GetFeePolicyResult) {
      this.showtradepopup();
    } else {
      this.ErrorMsg = 'This surpasses our fee policy';
    }
  }
  //END: Added function to check Fee Policy | Anubhav Goyal | 2-June-2023 |  BBVAEPCLI-567 New logic in terms of fee policy (Number 11 in Blanca's mail)
  // END : Add to watchlist popup
  showtradepopup(){
    this.tradebtnclicked=true;
  }
  closeTradePopup(){
    this.tradebtnclicked=false;
  }
  DCNTradeInitiate() {
    try {
      this.DCNTradeID = '';
      //START: Added by Anubhav Goyal | 04-Apr-2023 | EPCLI-398 

      if (this.tradeBtnActionFlag) { //tradeBtnActionFlag (Requested Trade Button) is true then sendmessage is false
        // Added a parameter Button Name | Anubhav Goyal | 13-Apr-2023
        var tradeRes = this.apifunctions.DCNTrade(this.RFQIDForDCNTrade.replace(/,/g, ","), this.ddlccy, this.Size, true, false, (this.commonfunctions.getLoggedInUserName()), '', 'Trade Request','');

      } else { //tradeBtnActionFlag is false then sendmessage is true
        var tradeRes = this.apifunctions.DCNTrade(this.RFQIDForDCNTrade.replace(/,/g, ","), this.ddlccy, this.Size, true, true, (this.commonfunctions.getLoggedInUserName()), '', 'Trade','');

      }
      this.DCNTradeID = tradeRes.noteDealID;
      this.tradeTimer = 0;
      if (this.DCNTradeID !== '') {
        this.tradebtnclicked=false;
      }
    } catch (error) {

    }
  }
  startTradeTimer() {
    try {
      this.tradeTimer = this.dcntradeTimer;
      let timerId: any;
      timerId = setInterval(() => {
        if (this.tradeTimer <= 0) {
          clearInterval(timerId);
        } else {
          this.tradeTimer--;
        }
      }, 1000);
    } catch (error) {

    }
  }
//Start: Added by Anubhav Goyal | 10-Apr-2023 | Accept Reject Order
  acceptOrderPopup: boolean = false

  AcceptOrderPopup() {


    this.acceptOrderPopup = true


  }

  AcceptOrder() {
    //Accept Order - generateOrder is false
    //var tradeRes = this.apifunctions.DCNTrade(RFQID, Currency, Amount, false, true, (this.commonfunctions.getLoggedInUserName()));
    var tradeRes = this.apifunctions.DCNTrade(this.rfqID, this.ddlccy, this.Size, false, true, (this.commonfunctions.getLoggedInUserName()), '', 'Trade Order Accept','');
    this.acceptOrderPopup = false

    if (tradeRes) {
      this.confirmOrderPopup = true
     this.confirmtext = 'Order Initiated successfully.'
    //  setTimeout(() => {
    //    this.confirmOrderPopup = false
    //    this.confirmtext =''
    //  }, 5000);
    }
    this.reviewOrder = false
    this.confirmtextDisplay = 'Order Initiated'
  }


  rejectOrderPopup: boolean = false
  RejectOrderPopup() {
    this.rejectOrderPopup = true

  }

  orderRejectionReason: any = ''
  RejectOrder(orderRejectionReason: any) {
    //Reject Order - generateOrder is false and sendMessage is false
    var tradeRes = this.apifunctions.DCNTrade(this.rfqID, this.ddlccy, this.Size, false, false, (this.commonfunctions.getLoggedInUserName()), orderRejectionReason, 'Trade Order Reject','');
    this.rejectOrderPopup = false

    if (tradeRes) {
      this.confirmOrderPopup = true
      this.confirmtext = 'Trader Order Rejected.'
      // setTimeout(() => {
      //   this.confirmOrderPopup = false
      //   this.confirmtext =''
      // }, 50000);
     }
     this.confirmtextDisplay = 'Order Rejected'
     this.reviewOrder = false
 
  }

  closePopup() {
    this.confirmOrderPopup = false
    this.acceptOrderPopup = false
    this.rejectOrderPopup = false
  }
  //End: Added by Anubhav Goyal | 10-Apr-2023 | Accept Reject Order
// BBVAEPCLI-530 Anubhav G 16-May-2023
  calculateInvoiceCCYAmt(){
    //Changed Formula | Anubhav Goyal | 24-May-2023 | EPCLI-530  | (Issue Price - Reoffer Price) x Notional
    this.invoiceCCYAmt = ((parseFloat(this.IssuePrice) - parseFloat(this.Price)) * parseFloat(this.Size.replaceAll(',','')))/100;    
    this.invoiceCCYAmt = (this.invoiceCCYAmt).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return this.invoiceCCYAmt;
    }

    // BBVAEPCLI-530 | Anubhav Goyal | 24-May-2023
    invoicePctCalculation(){
      this.invoicePct = parseFloat(this.IssuePrice) - parseFloat(this.Price);
      return parseFloat(this.invoicePct).toFixed(2);
    }
    // BBVAEPCLI-607 Pranav D 26-Jun-2023 DCN TS doc shown on format note
    DownloadDCNTS() {
      try {
        this.fileNameDCNTS = 'LIST_OF_PRODUCTS_AVAILABLE_TO_TRADE_ON_BBVA_EPRICER.pdf';
        this.DCNTSFilePath = this.apifunctions.getDCNTSDoc(this.fileNameDCNTS);
        window.open(this.DCNTSFilePath, '_blank');
      } catch (error) {
      }
    }


  setFocus() {
    this.namefield.nativeElement.focus();
  }
  
}
