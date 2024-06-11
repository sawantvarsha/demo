import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';


declare var require: any;
const $: any = require('jquery');


@Injectable({
  providedIn: 'root'
})
export class CommonfunctionsService {
  private LinearTranchePriceObserver = new BehaviorSubject<any>('');
  LinearTranchePrices = this.LinearTranchePriceObserver.asObservable();
  LinearTranchePrice:any = [];
  // Logic for toggle Functionality=> 0= horizontal \\   1= vertical
  public AlignmentToggle = new BehaviorSubject(true);
  Alignment = this.AlignmentToggle.asObservable();
  // AlignmentToggle.next('');

  private selectedShare = new BehaviorSubject(0);
  shareIndex = this.selectedShare.asObservable();

  private selectedAccount = new BehaviorSubject(0);
  Account = this.selectedAccount.asObservable();


  private underlyingCurrency = new BehaviorSubject<any>(0);
  Currency = this.underlyingCurrency.asObservable();


  private PricesObserver = new BehaviorSubject<any>('');
  SignalRPrices = this.PricesObserver.asObservable();
  Prices: any = [];

  private ClearPrices = new BehaviorSubject<any>('');
  clearPrices = this.ClearPrices.asObservable();


  selectedShareIndex = 0;
  selectedAccountNumber = 0;


  public PHXPricesObserver = new BehaviorSubject<any>('');
  PHXSignalRPrices = this.PHXPricesObserver.asObservable();
  PHXPrices: any = [];

  private DCNPricesObserver = new BehaviorSubject<any>('');
  DCNSignalRPrices = this.DCNPricesObserver.asObservable();
  DCNPrices: any = [];




  private BRCPricesObserver = new BehaviorSubject<any>('');
  BRCSignalRPrices = this.BRCPricesObserver.asObservable();
  BRCPrices: any = [];


  private RCPricesObserver = new BehaviorSubject<any>('');
  RCSignalRPrices = this.RCPricesObserver.asObservable();
  RCPrices: any = [];


  private CreditPricesObserver = new BehaviorSubject<any>('');
  CreditSignalRPrices = this.CreditPricesObserver.asObservable();
  CreditPrices: any = [];

  // New observable added by Pranav D for CLN
  private creditLinkedNotePriceObserver = new BehaviorSubject<any>('');
  creditLinkedNotePriceSignalRPrices = this.creditLinkedNotePriceObserver.asObservable();
  creditLinkedNotePrice: any = [];

  private submultiPricesObserver = new BehaviorSubject<any>('');
  submultiSignalRPrices = this.submultiPricesObserver.asObservable();
  submultiPrices: any = [];

  private submultiRCPricesObserver = new BehaviorSubject<any>('');
  submultiRCSignalRPrices = this.submultiRCPricesObserver.asObservable();
  submultiRCPrices: any = [];

  private submultiCreditPricesObserver = new BehaviorSubject<any>('');
  submultiCreditSignalRPrices = this.submultiCreditPricesObserver.asObservable();
  submultiCreditPrices: any = [];

  // New observable added by Pranav D for CLN
  private submultiCLNPricesObserver = new BehaviorSubject<any>('');
  submultiCLNSignalRPrices = this.submultiCLNPricesObserver.asObservable();
  submultiCLNPrices: any = [];

  private submultiPTCPricesObserver = new BehaviorSubject<any>('');
  submultiPTCSignalRPrices = this.submultiPTCPricesObserver.asObservable();
  submultiPTCPrices: any = [];

  private submultiDRAPricesObserver = new BehaviorSubject<any>('');
  submultiDRASignalRPrices = this.submultiDRAPricesObserver.asObservable();
  submultiDRAPrices: any = [];

  private PTCPricesObserver = new BehaviorSubject<any>('');
  PTCSignalRPrices = this.PTCPricesObserver.asObservable();
  PTCPrices: any = [];

  private DRAPricesObserver = new BehaviorSubject<any>('');
  DRASignalRPrices = this.DRAPricesObserver.asObservable();
  DRAPrices: any = [];

  // BEN Subscriber
  private BENPricesObserver = new BehaviorSubject<any>('');
  BENSignalRPrices = this.BENPricesObserver.asObservable();
  BENPrices: any = [];

  private submultiBENPricesObserver = new BehaviorSubject<any>('');
  submultiBENSignalRPrices = this.submultiBENPricesObserver.asObservable();
  submultiBENPrices: any = [];


  public strxmlObserver = new BehaviorSubject('');
  strxml = this.strxmlObserver.asObservable();

  public strxmlRCObserver = new BehaviorSubject('');
  strxmlRC = this.strxmlRCObserver.asObservable();

  public strxmlCreditObserver = new BehaviorSubject('');
  strxmlCredit = this.strxmlCreditObserver.asObservable();


  public strxmlPTCObserver = new BehaviorSubject('');
  strxmlPTC = this.strxmlPTCObserver.asObservable();

  public strxmlDRAObserver = new BehaviorSubject('');
  strxmlDRA = this.strxmlDRAObserver.asObservable();

  public deleteRowObserver = new BehaviorSubject('');
  dltRow = this.deleteRowObserver.asObservable();

  public deleteCreditRowObserver = new BehaviorSubject('');
  dltCreditRow = this.deleteCreditRowObserver.asObservable();

  // New observable added by Pranav D for CLN
  public deleteCLNRowObserver = new BehaviorSubject('');
  dltCLNRow = this.deleteCLNRowObserver.asObservable();

  //Error msg subscriber for linear tranche Added by Amogh K | BBVAEPCLI-238 | 24-Nov-2022 | start
  public linearTrancheErrorMsgObserver = new BehaviorSubject('');
  linearTrancheErrorMsg = this.linearTrancheErrorMsgObserver.asObservable();
  //Error msg subscriber for linear tranche Added by Amogh K | BBVAEPCLI-238 | 24-Nov-2022 | end

  //Info msg subscriber for linear tranche Added by Amogh K | BBVAEPCLI-238 | 24-Nov-2022 | start
  public linearTrancheInfoMsgObserver = new BehaviorSubject('');
  linearTrancheInfoMsg = this.linearTrancheInfoMsgObserver.asObservable();
  //Info msg subscriber for linear tranche Added by Amogh K | BBVAEPCLI-238 | 24-Nov-2022 | end

  errorMsgChanged = new BehaviorSubject('')
  errorMsgChangedObs = this.errorMsgChanged.asObservable();

  public logoutFlgObserver = new BehaviorSubject(false);
  logoutFlg = this.logoutFlgObserver.asObservable();

  
// Language Translation
  AutoCall = "Autocall"
  Autocall = "Autocall"
  Onbehalfoflabel = "On behalf of"
  //currency = "currency"
  FormatLabel = "Format"
  Onbehalfof = "On behalf of"
    Format = "Format"
    Solvefor = "Solve for"
    Size = "Size"
    Pricepercent = "Price (%)"

    Underlying = "Underlying"
    Type = "Type"
    NonCall = "Non-Call"
    Stepdown = "Stepdown (%)"
    StepdownFrequency = "Stepdown Frequency"
    Trigger = "Trigger"
    Floor = "Floor (%)"
    Frequency = "Frequency"
    Airbaglabel = "Airbag"
    Couponlabel = "Coupon"
    Dateslabel = "Dates"
    StrikeShifterDate = "Strike Shifter/Date"
    PaymentShifterDate = "Payment Shifter/Date"
    Tenor = "Tenor"
    KIBarrierType = "KI Barrier Type"
    Level = "Level"
    Barrier = "Barrier"
    Observation = "Observation"
    Strikelabel = "Strike (%)"
    AltCoupon = "Alt. Coupon"
    AlternativeCoupon = "Alternative Coupon"
    Pricelabel = "Price"
    Schedule = "Schedule"
    Scheduleprice="Schedule price"
    Ccy = "Ccy"
  Date = "Date"
    Payment = "Payment"
    Max = "Max"
  StrikeDate = "Strike Date"
  myPortfolios = "My Portfolios"
  Freq = "Freq."
  Spread = "Spread"
    alternativeCouponLabel = "Alternative Coupon"
    dateLabel = "Dates"
    NumberofdaysyouwanttoshiftthePaymentForwardfromStrikeDate = "Number of days you want to shift the Payment Forward from Strike Date"
    NumberofdaysyouwanttoshifttheStrikeForwardfromTodayForStriketodayornextbusinessdayincasetodayisholidaypleaseinput0b = "Number of days you want to shift the Strike Forward from Today. For Strike today(or next business day in case today is holiday), please input 0b."
    IncaseyourequiretheexactMaturityorFinalObservationDatepleasedonothesitatetorequestaTermsheet = "In case you require the exact Maturity or Final Observation Date, please do not hesitate to request a Termsheet"
    Bonuscouponifputatmaturityisdeactivated = "Bonus coupon if put at maturity is deactivated"
    ValueofthecoupontobepaidincaseofEarlyRedeptionDifferentfromPhoenixCoupon = "Value of the coupon to be paid in case of Early Redemption.Different from Phoenix Coupon." //BBVACLI-842Tooltip spellings are wrong
    ThisdefinesthetypeofCoupontobepaidincasetheproductisearlyredeemedSnowballwillincreasethesizeofthecouponperiodbyperiodwhereasFlatwillmaintainthecouponunchanged = "This defines the type of Coupon to be paid in case the product is early redeemed. Snowball will increase the size of the coupon period by period whereas Flat will maintain the coupon unchanged."
    ThisinputisunsignedmeaningtheabsolutevalueofyourinputwillbeusedasthedecreasingamountofthetriggerThedecreasewillbeappliedfromthe2ndautocalldateonwardsignoringthenoncallperiods = "This input is unsigned, meaning, the absolute value of your input will be used as the decreasing amount of the trigger. The decrease will be applied from the 2nd autocall date onwards, ignoring the non-call periods."
    AllpreviouslyunpaidcouponsarepaidincaseacouponispaidonanObservationDate = "All previously unpaid coupons are paid in case a coupon is paid on an Observation Date."
  SharedPortfolios = "Shared Portfolios"
    KIbarriertype = "KI barrier type"
   currency = "Currency"
   Upfront="Upfront"
  // reverse convertiable
  Thereisnobarriermeaningtheputisalwaysactivated="There is no barrier, meaning the put is always activated."
  TheunderlyingsareobservedagainsttheBarrierLevelonlyontheCloseValuefortheFinalObservationDateoftheProduct="The underlyings are observed against the Barrier Level only on the Close Value for the Final Observation Date of the Product."
// participation
Productlabel = "Product"
PaymentType = "Payment Type"
Min = "Min"
Spreadlabel = "Spread"
// Spread = "Spread"
LowerStrikepercent = "Lower Strike (%)"
GuaranteedCoupon = "Guaranteed Coupon"
CapitalGuaranteed = "Capital Guaranteed"
Baskettype = "Basket Type"
// bonus
Bonus = "Bonus"
Upfrontpercent="Upfront (%)"

Upside="Upside"
Save="Save"
Downside="Downside"
Bonuspercent="Bonus (%)"
CustomBonusBarrier= "Custom Bonus Barrier"
BonusObservationType="Bonus Observation Type"
BonusBarrierLevelpercent="Bonus Barrier Level (%)"
Strikepercent="Strike (%)"
Gearingpercent="Gearing (%)"
Cappercent="Cap (%)"
Funding="Funding"
Leveraged="Leveraged"
Yes = "Yes"
No = "No"
BarrierLevelpercent="Barrier Level (%)" 
ThebonuscouponwillbeobservedonsamebarrierlevelandbarriertypeasDownside="The bonus coupon will be observed on same barrier level and barrier type as Downside"
IfCapaddedtheIfNoKOEventminCapmaxBonusWorstPerformance100IfKOEvent0 ="If Cap added then:If No KO Event, min(Cap, max(Bonus, Worst Performance - 100%)) If KO Event, 0" 
// dual autocall
ObservationLabel="Observation"
BonusBarrierObervationToolTip = "Bonus Barrier Observation"
  // CapPercentTooltip = "If Cap added then: If No KO Event, min(Cap, max(Bonus, Worst Performance - 100%)) If KO Event, 0"
GearingFI="Gearing FI"
GearingFIpercent="Gearing FI"
CouponFIpercent="Coupon FI (%)"
NotionalFI ="Notional FI"
 Notional = "Notional"
FIPaymentDay="FI Payment Day"
AutocallTriggerpercent="Autocall Trigger (%)"
Stepdownpercent="Stepdown (%)"
AutocallTriggerFloorpercent="Autocall Trigger Floor (%)"
autocallCouponpercent="Autocall Coupon (%)"
Couponpercent="Coupon (%)"
CouponTriggerpercent="Coupon Trigger (%)"
barrierLabel = "Barrier"
altCouponLabel = "Alt. Coupon"
// dualrc
RateSpreadpercent = "Rate/Spread (%)"
Leverage = "Leverage"
//fx
// Onbehalfoflabel = "On behalf of"
CurrencyT = "Currency"
SolveForvalue = "Solve for"
SizeT = "Size"
Strike="Strike"
FrequencyT = "Frequency"
// Ccy = "Ccy/"
// Date = "Date"
  // SharedPortfolios = "Shared Portfolios"
// Max = "Max"
// StrikeDate = "Strike"
MyPortfolios = "My Portfolios"
PortfolioName = "Portfolio Name"
Result = "Result"
Index = "Index"
// Notional = "Notional"
IssueDate = "Issue Date"
Attach = "Attach"
Detach = "Detach"
Reoffer = "Reoffer "
IssuepriceT = "Issue Price"
IssuePrice = "Issue Price (%)" //added by riddhi ||BBVACLI-862 ||(%) symbol missing for all products for both single pricer and multi-pricer 
Issueprice = "Issue Price"
Recovery = "Recovery"
Settlementtype = "Settlement Type"
Ind = "Ind"
Firm = "Firm"
Coupon = "Coupon"
Cpntype = "Cpn Type"
Floatingref = "Floating Ref."
// Freq = "Freq"
Couponbasis = "Coupon Basis"
SpreadT = "Spread"
Fundingtype = "Funding Type"
Fundingindex = "Funding Index"
Spreadpercent = "Spread(%)"
MaturityDate = "Maturity Date"
FinalFixingDate = "Final Fixing Date"
ReofferPricepecent = "Reoffer Price (%)"
ReofferPrice="Reoffer Price"
ReferenceEntity ="Reference Entity"
upfrontpercent="Upfront (%)"   //change on 25th Nov 2022
 IssuePricepercent="Issue Price (%)"
 Issuepricepercent="Issue Price (%)"
Indicative="Indicative"
CouponType="Coupon Type"
Couponpapercent="Coupon p.a.(%)"
Spreadpapercent="Spread p.a. (%)"
Couponpercentpa = "Coupon (%) p.a."
ReofferPricepercent = "Reoffer Price (%)"
Costpercentpa = "Cost (%) p.a."
Currencypair="Currency Pair"
upfrontpercentpa ="Upfront (%) p.a"
Franchisepercentpa="Franchise (%) p.a"
Spotlabel="Spot" 
Franchiseamount="Franchise(Amount)"
Fixing="Fixing"
// Strikelabel="Strike"
// Spreadlabel="Spread"
FullPrecision = "Full Precision"
Override = "Override"
Custom = "Custom"
//credittranche
CreditTranche = "Credit Tranche"
FixedRate="Fixed Rate"
  Currencylabel = "Currency"
  Tenorlabel = "Tenor"
  Notionallabel = "Notional"
  IssuePricelabel = "Issue Price (%)"
  RecoveryTypelabel = "Recovery Type"
  SettlementTypelabel = "Settlement Type"
  Tranche = "Tranche"
  Attachlabel = "Attach"
  Detachlabel = "Detach"
  IssueDatelabel = "Issue Date"
  CouponTypelabel = "Coupon Type"
  FloatingReflabel = "Floating Ref."
  CouponSpreadLabel = "Coupon (%) / Spread (%)"
  CouponFreq = "Coupon Freq."
  CouponBasislabel = "Coupon Basis"
// creditlinkednote
CreditLinkedNote = "Credit Linked Note"
ReferenceEntitylabel = "Reference Entity"
CouponpaSpreada = "Coupon p.a. (%) / Spread p.a. (%)"
Redemption = "Redemption"
FloatingIndex="Floating Index"
FirstnumberofPeriods="First number of Periods"
// CouponFreq="Coupon Freq."
CouponBasis="Coupon Basis"
RecoveryType="Recovery Type"
SettlementType="Settlement Type"
Rate="Rate"
//multi-cli
CreditIndex="Credit Index"
// Upfrontpercent="Upfront (%)"
Firstcoupon="First Coupon"
CouponFrequency="Coupon Frequency"
//extra
Add="Add"
DeletePortfolio="Delete Portfolio"
SavePortfolio="Save Portfolio"
SaveandShare="Save and Share"
SaveNew="Save New"
Updateportfolio="Update portfolio"
MemoryPds="Memory Pds"
Indexrate="Index rate"
Clone="Clone"
AddNew="Add New"
FloatingRate="Floating Rate"
KIBarrierLevelpercent="KI Barrier Level (%)"
Reference="Reference"
Location="Location"
Time="Time"
Default="Default"
ProductType="Product Type"
Gearing="Gearing"
UpperStrike="Upper Strike"
BarrierType="Barrier Type"
// Saved requests
Action="Action"
Paymentdate="Payment Date"
CreditLinearIndex = "Credit Linear Index"
// info-icon
 CouponpaidifproductisnotredeemedPleasebeawarethatunlikeguaranteedcouponthatarealwayspaidalternativecouponwillnotbepaidiftheproductisautocalled="Coupon paid if product is not redeemed. Please be aware that unlike guaranteed coupon that are always paid, alternative coupon will not be paid if the product is autocalled."
  Autocallfromnoncallplusoneperiod="Autocall from noncall + 1 period"
  Fixedrateexpressedperannum="Fixed rate expressed per annum"
  Thereisnobarriermeaningthecallisalwaysactivated="There is no barrier, meaning the call is always activated."
  Theguaranteedcoupontobepaidinabsoluteterm="The guaranteed coupon to be paid in absolute term."
  Couponexpressedperannum="Coupon expressed per annum."
  ThecouponispaidatMaturity="The coupon is paid at Maturity."
  Pleaseenterunderlying="Please Enter Underlying"
CouponamountremainsthesameonallObservations="Coupon amount remains the same on all Observations."
NoCouponeventisobserved="No Coupon event is observed"
GuaranteedCoupononeveryObservationDate ="Guaranteed Coupon on every Observation Date"
Theunderlyingsareobservedagainstthebarriernlyontheclosevalueeverydayoverthelifeoftheproduct="The underlyings are observed against the barrier only on the close value every day over the life of the product"
TheunderlyingsareobservedagainsttheBarrierLevelcontinuouslyoverthelifeoftheproduct="The underlyings are observed against the Barrier Level continuously overthe life of the product"
  KOBarrierType = "KO Barrier Type"
  KOBarrierLevel = "KO Barrier Level"
  CouponTriggerpercentage = "Coupon Trigger (%)"
  AdditionalCoupon = "Additional Coupon"
  LimitMaxLoss = "Limit Max Loss"
  IndexrateSpread = "Index Rate /"
  Parameters="Parameters"
  IfCustomselectedthefollowingoptionsareavailable="If Custom selected the following options are available"
  PricingDate="Pricing Date"
    // End of translation variables
    timeoutMsg = '';
  loadingFlag = false;
  datepipe: DatePipe = new DatePipe('en-US');
  layout = false;
  CommonDataProducts:any;
  apifunctions: any;
  NaturalDays = "Natural Days";

  constructor() {

    try {
    } catch (error) {
      console.log('Error:', error);
    }
  }


  contains(key: any) {
    try {
      const findNaN = key !== key;
      let indexOf: any;
      if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
      } else {
        // tslint:disable-next-line: no-shadowed-variable
        indexOf = function (_key: any) {
          // tslint:disable-next-line: one-variable-per-declaration
          let i = -1, index = -1;
          // for (i = 0; i < this.legth; i++) {
          //   const item = this[i];
          //   if ((findNaN && item !== item) || item === key) {
          //     index = i;
          //     break;
          //   }
          // }
          return index;
        };
      }
      return indexOf.call(this, key) > -1;
    } catch (error) {
      console.log('Error:', error);
      return false;
    }
  }

  GetEventTarget(e: any): any {
    try {
      const target: any = e.target || e.srcElement || e.currentTarget || null;
      return target;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  NotionalValidateKeys(e: any) {
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
      console.log('Error:', error);
      return false;
    }
  }

  // NotionalValidate(e)
  allowIntegerOnly(e: any) { // required only for MemoryPeriods
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
      console.log('Error:', error);
      return false;
    }
  }

  // NotionalChange(e) {  //to be remove later. used in Autocall and RC
  //   try {
  //     const target: any = this.GetEventTarget(e);

  //     if (target.value === '') {

  //     } else {
  //       if ((target.value.toString().match(/([kK]{1})/g)) !== null) {
  //         target.value = (parseFloat(target.value.replace(/[kK]/g, '')) * 1000);
  //       } else if ((target.value.toString().match(/([lL]{1})/g)) !== null) {
  //         target.value = (parseFloat(target.value.replace(/[lL]/g, '')) * 100000);
  //       } else if ((target.value.toString().match(/([mM]{1})/g)) !== null) {
  //         target.value = (parseFloat(target.value.replace(/[mM]/g, '')) * 1000000);
  //       } else if ((target.value.toString().match(/([bB]{1})/g)) !== null) {
  //         target.value = (parseFloat(target.value.replace(/[bB]/g, '')) * 1000000000);
  //       }
  //     }


  //     return target.value;
  //   }
  //   catch (error) {
  //     console.log("Error:", error);
  //   }
  // }

  FormatNumber(e: any) {
    try {
      const target: any = this.GetEventTarget(e);
      const notional = $('#' + target.id)[0].value;
      if ($('#' + target.id)[0].value.trim() === '' || isNaN($('#' + target.id)[0].value)) {
        $('#' + target.id)[0].value = '0';
        const evt = new Event('change');
        $('#' + target.id)[0].dispatchEvent(evt);
      }
      // else {
      //   $('#' + target.id)[0].value = $('#' + target.id)[0].value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      //   console.log($('#' + target.id)[0].value);
      // }
      // console.log(parseFloat($('#' + target.id)[0].value));
      return parseFloat($('#' + target.id)[0].value);
    } catch (error) {
      console.log('Error:', error);
      return false;
    }
  }

  UnformatNumber(e: any) {
    try {
      const target: any = this.GetEventTarget(e);
      $('#' + target.id)[0].value = $('#' + target.id)[0].value.replace(/,/g, '');
      if ($('#' + target.id)[0].value === '0.00') {
        $('#' + target.id)[0].value = '';
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }



  setDecimal(e: any) {
    try {
      const target: any = this.GetEventTarget(e);
      if (target.value.trim() === '' || isNaN(target.value)) {
        target.value = parseFloat('0.00').toFixed(2);
      } else {
        target.value = parseFloat(target.value).toFixed(2);
      }
      return target.value;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  /* added by Pranav || 06Jun2022 || added new product DCN- related changes */
  setStrikeSpotDCN(e: any) {
    try {
      const target: any = this.GetEventTarget(e);
      if (target.value.trim() === '' || isNaN(target.value)) {
        target.value = '';
      } else {
        target.value = parseFloat(target.value).toFixed(4);
      }
      return target.value;
    } catch (error) {

    }
  }
  setDecimaltoFour(e: any) {
    try {
      const target: any = this.GetEventTarget(e);
      if (target.value.trim() === '' || isNaN(target.value)) {
        target.value = parseFloat('0.0000').toFixed(4);
      } else {
        target.value = parseFloat(target.value).toFixed(4);
      }
      return target.value;
    } catch (error) {
      console.log('Error:', error);
    }
  }

  setDecimalForBlank(e: any) {
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
      console.log('Error:', error);
    }
  }

  InputNumber(e: any) {
    try {
      const target: any = this.GetEventTarget(e);
      // tslint:disable-next-line: deprecation
      e = (e) ? e : window.event;
      const code = (e.which) ? e.which : e.keyCode;
      let codes = new Array();
      codes = [8, 9, 13, 17, 18, 19, 20, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
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
      console.log('Error:', error);
      return false;
    }
  }

  InputNegativeNumber(e: any) {
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
      console.log('Error:', error);
      return false;
    }
  }
  TenorValidation(e: any) {
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
      console.log('Error:', error);
      return false;
    }
  }



  moveUpSelection1(_e: any, selectedIndex: any) {
    try {
      if (selectedIndex !== undefined&&$('.SelectorBoxh').length > 0) {
        if (selectedIndex > 0) {
          selectedIndex--;
        }
        console.log("Selector length",('.SelectorBoxh').length > 0);
        if ($('.SelectorBoxh').length > 0) {
          this.ScrollTo('.SelectorBoxh', '.HoverSuggestion', 'down');
          return selectedIndex;
        } else {
          // return 0;
        }
      }
      if (selectedIndex !== undefined&&$('.SelectorBoxv').length > 0) {
        if (selectedIndex > 0) {
          selectedIndex--;
        }
        //console.log("Selector length",('.SelectorBoxv').length > 0);
        if ($('.SelectorBoxv').length > 0) {
          this.ScrollTo('.SelectorBoxv', '.HoverSuggestion', 'down');
          return selectedIndex;
        } else {
          // return 0;
        }
      }
      if (selectedIndex !== undefined) {
        if (selectedIndex > 0&&$('.SelectorBox').length > 0) {
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
      console.log('Error:', error);
    }
  }

  moveDownSelection1(_e: any, selectedIndex: any) {
    try {
      if ($('.SelectorBoxh').length > 0) {
     
        if (selectedIndex < $('.SelectorBoxh')[0].childElementCount - 1) {
          selectedIndex++;
        }
        if ($('.SelectorBoxh')[0].childElementCount > selectedIndex) {
          this.ScrollTo('.SelectorBoxh', '.HoverSuggestion', 'up');
          return selectedIndex;
        }
      } else {
        // return 0;
      }
      if ($('.SelectorBoxv').length > 0) {
        if (selectedIndex < $('.SelectorBoxv')[0].childElementCount - 1) {
          selectedIndex++;
        }
        if ($('.SelectorBoxv')[0].childElementCount > selectedIndex) {
          this.ScrollTo('.SelectorBoxv', '.HoverSuggestion', 'up');
          return selectedIndex;
        }
      } else {
        // return 0;
      }
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
      console.log('Error:', error);
    }
  }
  moveUpSelection(_e: any, selectedIndex: any) {
  try {
    if (selectedIndex !== undefined) {
      if (selectedIndex > 0) {
        selectedIndex--;
      }
      if ($('.SelectorBoxv').length > 0) {
        this.ScrollTo('.SelectorBoxv', '.HoverSuggestion', 'down');
        return selectedIndex;
      } else {
        return 0;
      }

    }
  } catch (error) {
    console.log('Error:', error);
  }
}

  moveDownSelection(_e: any, selectedIndex: any) {
  try {
    if ($('.SelectorBoxv').length > 0) {
      if (selectedIndex < $('.SelectorBoxv')[0].childElementCount - 1) {
        selectedIndex++;
      }
      if ($('.SelectorBoxv')[0].childElementCount > selectedIndex) {
          this.ScrollTo('.SelectorBoxv', '.HoverSuggestion', 'up');
        return selectedIndex;
      }
    } else {
      return 0;
    }
  } catch (error) {
    console.log('Error:', error);
  }
}
  ScrollTo(container: any, element: any, direction: any) {
    try {
      const $container = $(container);
      const $scrollTo = $(element);
      switch (direction) {
        case 'up':
          $container.animate({ scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop(), scrollLeft: 0 }, 10);
          break;
        case 'down':
          $container.animate({
            scrollTop: $scrollTo.offset().top - $container.offset().top
              + $container.scrollTop() - 100, scrollLeft: 0
          }, 10);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }


  setReceivedPrices(prices: any) {
    try {
      this.Prices[this.Prices.length] = prices;
      this.PricesObserver.next(prices);
    } catch (error) {
      console.log('Error:', error);
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
      // changes to get prices for CLN 
      this.creditLinkedNotePriceObserver.next('');
      this.creditLinkedNotePrice = [];
    } catch (error) {
      console.log('Error:', error);
    }
  }



  clearPricesEvent(status: any) {
    try {
      this.ClearPrices.next(status);
    } catch (error) {
      console.log('Error:', error);
    }
  }
  CheckAllFieldsPrecision(e: any) {
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
      console.log('Error:', error);
    }
  }


  setPHXReceivedPrices(prices: any, ComponentIndex: any) {
    try {
      this.PHXPrices[this.PHXPrices.length] = prices;
      this.PHXPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  setDCNReceivedPrices(prices: any, ComponentIndex: any) {
    try {
      this.DCNPrices[this.DCNPrices.length] = prices;
      this.DCNPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  setBRCReceivedPrices(prices: any, ComponentIndex: any) {
    try {
      this.BRCPrices[this.BRCPrices.length] = prices;
      this.BRCPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  setRCReceivedPrices(prices: any, ComponentIndex: any) {
    try {
      this.RCPrices[this.RCPrices.length] = prices;
      this.RCPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  setCreditReceivedPrices(prices: any, ComponentIndex: any) {
    try {
      this.CreditPrices[this.CreditPrices.length] = prices;
      this.CreditPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  // function to get CLN price response
  setCLNReceivedPrices(prices: any, ComponentIndex: any) {
    try {
      this.creditLinkedNotePrice[this.creditLinkedNotePrice.length] = prices;
      this.creditLinkedNotePriceObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  setsubmultiReceivedPrices(prices: any, ComponentIndex: any) {
    try {
      this.submultiPrices[this.submultiPrices.length] = prices;
      this.submultiPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  setsubmultiCreditReceivedPrices(prices: any, ComponentIndex: any) {
    try {
      this.submultiCreditPrices[this.submultiPrices.length] = prices;
      this.submultiCreditPricesObserver.next({ price: prices, Index: ComponentIndex });

    } catch (error) {
      console.log('Error:', error);
    }
  }

  // submulti request CLN price response fetch function
  setsubmultiCLNReceivedPrices(prices: any, ComponentIndex: any) {
    try {
      this.submultiCLNPrices[this.submultiPrices.length] = prices;
      this.submultiCLNPricesObserver.next({ price: prices, Index: ComponentIndex });

    } catch (error) {
      console.log('Error:', error);
    }
  }

  setsubmultiRCReceivedPrices(prices: any, ComponentIndex: any) {
    try {
      this.submultiRCPrices[this.submultiPrices.length] = prices;
      this.submultiRCPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  setPTCReceivedPrices(prices: any, ComponentIndex: any) {
    try {
      this.PTCPrices[this.PHXPrices.length] = prices;
      this.PTCPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  setDRAReceivedPrices(prices: any, ComponentIndex: any) {
    try {
      this.DRAPrices[this.DRAPrices.length] = prices;
      this.DRAPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }


  setBENReceivedPrices(prices: any, ComponentIndex: any) {
    try {
      this.BENPrices[this.PHXPrices.length] = prices;
      this.BENPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }



  setsubmultiPTCReceivedPrices(prices: any, ComponentIndex: any) {
    try {

      this.submultiPTCPrices[this.submultiPrices.length] = prices;
      this.submultiPTCPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  // DRA

  setsubmultiDRAReceivedPrices(prices: any, ComponentIndex: any) {
    try {

      this.submultiDRAPrices[this.submultiPrices.length] = prices;
      this.submultiDRAPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }


  setsubmultiBENReceivedPrices(prices: any, ComponentIndex: any) {
    try {

      this.submultiBENPrices[this.submultiPrices.length] = prices;
      this.submultiBENPricesObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  tenorDateValidation(e: any) {
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
      console.log('Error:', error);
      return false;
    }
  }
  MaturityShifterValidation(e: any) {
    try {
      const target: any = this.GetEventTarget(e);
      // tslint:disable-next-line: deprecation
      e = (e) ? e : window.event;
      const code = (e.which) ? e.which : e.keyCode;
      console.log(code);
      let codes = new Array();
      // 66 B ;77M ; 87W; 89 Y; 98 b; 109 m; 119 w; 121 y;
      // Checking for number inputs, y,w, m, b, ., del or backspace 68 d 109 m
      // codes = [8, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 68, 100, 109, 127];
      codes = [8, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 68, 77, 87, 100, 109, 119, 127];
      if (!this.contains.call(codes, code)) {
        return false;
      }
      return true;
    } catch (error) {
      console.log('Error:', error);
      return false;
    }
  }



  /////////////////  Compare function start || added by suvarna start
  compareValues(key: any, order = 'asc') {
    try {
      return function innerSort(a: any, b: any) {
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
      console.log('Error:', error);
      return 0;
    }
  }

  ////////////////   Compare function end || added by suvarna end


  generateFlexiXml(xml: any) {
    this.strxmlObserver.next(xml);
  }

  generateRCFlexiXml(xml: any) {
    this.strxmlRCObserver.next(xml);
  }
  generateCreditFlexiXml(xml: any) {
    this.strxmlCreditObserver.next(xml);
  }


  generatePTCFlexiXml(xml: any) {
    this.strxmlPTCObserver.next(xml);
  }

  generateDRAFlexiXml(xml: any) {
    this.strxmlDRAObserver.next(xml);
  }
  getLoggedInUserName(): any {

    return sessionStorage.getItem('Username');
  }

  getEntityOfUser() {
    return sessionStorage.getItem('EntityID');
  }

  deleteRow(row: any) {
    this.deleteRowObserver.next(row);
  }

  deleteCreditRow(row: any) {
    this.deleteCreditRowObserver.next(row);
  }

  formatAmt(amount: any) {
    try {
      if (amount === '') {
        return amount;
      } else {
        const stramount = parseFloat(amount.replace(/,/g, '')).toFixed(2).toString();
        return (stramount.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }
  formatNotional(amount: any) {
    if (amount.indexOf(',') > -1) {
      amount = amount.toString().replace(/,/g, '');
    }
    // tslint:disable-next-line: radix
    return (parseInt(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  }

  getSolveForValue(val: any) {
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
        case 'KI + CouponBarrier':
          solForVal = ' Barrier Level + Coupon Trigger';
          break;
        case 'Strike + CouponBarrier':
          solForVal = 'Barrier Strike + Coupon Trigger';
          break;
        case 'UpsideStrike':
          solForVal = 'Upside Strike (%)';
          break;
        case 'UpsideBarrierLevel':
          solForVal = 'Upside Barrier Level (%)';
          break;
        case 'UpsideGearing':
          solForVal = 'Upside Gearing (%)';
          break;
        case 'UpperStrike':
          solForVal = 'Upper Strike (%)';
          break;
        case 'Rebate':
          solForVal = 'Rebate (%)';
          break;
        case 'DownsideStrike':
          solForVal = 'Downside Strike (%)';
          break;
        case 'DownsideBarrierLevel':
          solForVal = 'Downside Barrier Level (%)';
          break;
        case 'LowerStrike':
          solForVal = 'Lower Strike (%)';
          break;
        case 'Leverage':
          solForVal = 'Leverage (%)';
          break;
        case 'DownsideStrike + LowerStrike':
          solForVal = 'DS Strike + Lower Strike';
          break;
        case 'AttachDetach':
          solForVal = 'Attach/Detach';
          break;
        case 'KO + Strike':
          solForVal = 'Autocall Trigger + Strike';
          break;
        // new solvefors for BEN - added by PriyaL on 28Feb2022-assigned by PranavD
        case 'Bonus':
          solForVal = 'Bonus (%)';
          break;
        case 'UpsideBarrierLevel':
          solForVal = 'Upside Bonus Barrier Level (%)';
          break;
        case 'UpsideCap':
          solForVal = 'Upside Cap (%)';
          break;
        case 'KI':
          solForVal = 'KI Barrier Level (%)';
          break;
        case 'UpsideBarrierLevel + DownsideBarrierLevel':
          solForVal = 'Upside Bonus Barrier Level (%) + KI Barrier Level (%)';
          break;
        case 'DownsideBarrierLevel':
          solForVal = 'KI Barrier Level (%)';
          break;
        // New solve for value defined as applicable for CLN
        case 'Floating Coupon':
          solForVal = 'Floating Coupon';
          break;
        case 'Fixed Coupon':
          solForVal = 'Fixed Coupon';
          break;
        case 'FixedRate':
          solForVal = 'Fixed Rate';
          break;
        // added by Suvarna P || 15 Jul2022 || solveForIssue in Blotter || assigned by Pranav D || start
        case 'IBPrice1':
          solForVal = 'Reoffer Price';
          break;
        case 'Strike1':
          solForVal = 'Strike - Spread';
          break;
        case 'Fee':
          solForVal = 'Fee';
          break;
        // added by Suvarna P || 15 Jul2022 || solveForIssue in Blotter || assigned by Pranav D || end
        case 'Reoffer Price':
          solForVal = 'Reoffer Price';
          break;
        case 'Strike - Spread':
          solForVal = 'Strike - Spread';
          break;

      }
      return solForVal;
    } catch (error) {
      console.log('Error:', error);
      return '';
    }
  }
  isEmptyObject(obj: any) {
    return (obj && (Object.keys(obj).length === 0));
  }
  InputNumberForInteger(e: any) {
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
      console.log('Error:', error);
      return false;
    }
  }

  setloadflag(status: any) {
    this.loadingFlag = status;
  }

  getloadflag() {
    return this.loadingFlag;
  }

  checkValidNotional(e: any) {
    try {
      const target = this.GetEventTarget(e);
      let Notional = target.value.replace(/,/g, '');
      let ErrorMsg = '';
      if (Notional === '') {
        target.classList.add('error');
        ErrorMsg = 'Please enter valid notional';
        target.focus();
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
      }
      Notional = Notional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return { Notional, ErrorMsg };
    } catch (error) {
      console.log('Error:', error);
      return {};
    }
  }

  chkNotionalFormat(notional: any) {
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
      console.log('Error:', error);
      return false;
    }
  }

  // allowOneDecimalInInput(e) {
  //   try {
  //     const target = this.GetEventTarget(e);
  //     var regex = /^[0-9]+\.?[0-9]*/g;
  //     target.value = regex.exec(target.value);
  //   }
  //   catch (error) {
  //     console.log("Error:", error);
  //   }
  // }

  // allowOneDecimalInNegativeInput(e) {
  //   try {
  //     const target = this.GetEventTarget(e); //^[0-9 -]+\.?[0-9]*
  //     var regex = /^[0-9 -]+\.?[0-9]*/g;
  //     target.value = regex.exec(target.value);
  //   }
  //   catch (error) {
  //     console.log("Error:", error);
  //   }
  // }

  AutocallTriggerInputNumber(e: any) {
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
      console.log('Error:', error);
      return false;
    }
  }

  chkNotionalFormat_keyUp(e: any) {
    try {
      const regex: RegExp = new RegExp(/^[0-9]*(\.[0-9]*){0,1}$/g);
      const regex3: RegExp = new RegExp(/^[0-9]*(\.[0-9]*){0,1}([A-Za-z]){0,1}$/g);
      // var regex=/^[0-9]+\.?[0-9]*/g;
      let notional = e.target.value;
      notional = notional.toString().replace(/,/g, '');
      // console.log(notional);
      if (notional.match(regex) || notional.match(regex3)) {
        return true;
      } else {
        if (!notional.match(regex)) {
          e.target.value = /^[0-9]*(\.[0-9]*){0,1}/g.exec(notional)![0];
          // console.log('false1');
        } else if (!notional.match(regex3)) {
          e.target.value = /^[0-9]*(\.[0-9]*){0,1}([A-Za-z]){0,1}/g.exec(notional);
          // console.log('false2');
        }
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  getSpainDate(orignalDate: any, time: any) {
    console.log('getspaindate');
    
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
      console.log(error);
      return '';
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
    dateArray = Datestr.split('-');
    let monthNo = (months.indexOf(dateArray[1]) + 1) + '';
    // console.log(monthNo);
    if (monthNo.length === 1) {
      monthNo = '0' + monthNo;
    }
    // console.log(dateArray[2] + '-' + monthNo + '-' + dateArray[0]);
    return dateArray[2] + '-' + monthNo + '-' + dateArray[0];
  }

  InputSpread(e: any) {
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
      console.log('Error:', error);
      return false;
    }
  }

  formatSlashDate(Datestr: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let dateArray: any = [];
    dateArray = Datestr.split('/');

    // console.log(dateArray[2] + '-' + monthNo + '-' + dateArray[0]);
    return dateArray[0] + '-' + months[dateArray[1] - 1] + '-' + dateArray[2];
  }

  validTime(inputtime: any) {
    try {
      console.log(inputtime);
      const regex: RegExp = new RegExp(/((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/g);
      inputtime = inputtime.toString();
      if (inputtime.match(regex) !== null) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Error:', error);
      return false;
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


  numberToNotional(notional: string) {
    let str = notional.substring(0, notional.indexOf('.') != -1 ? notional.indexOf('.') : notional.length);
    let length = str.length;
    if (length > 9) {
      console.log('billion ', str.substring(0, length - 9));
    }
    else if (length > 6)
      console.log('million ', str.substring(0, length - 6));
    else if (length > 3)
      console.log('k ', str.substring(0, length - 3));
    return str;
  }
  // Added by Riddhi p || 30Sept 2022 || adding of four digits for fee (%) p.a. after rounding off
  setdecimalforfee(e:any) {
    try {
      const target: any = this.GetEventTarget(e);
      if (target.value.trim() === '' || isNaN(target.value)) {
        target.value = parseFloat('0.00').toFixed(2);
      } else {
        target.value = parseFloat(target.value).toFixed(4);
      }
      return target.value;
    } catch (error) {
      console.log('Error:', error);
    }
  }
  // added by Pranav D 26-Sep-2022 set spread even if strike and spot are blank
  setSpreadValue(e:any) {
    try {
      const target: any = this.GetEventTarget(e);
      if (target.value.trim() === '' || isNaN(target.value)) {
        target.value = '';
      } else {
        target.value = parseFloat(target.value).toFixed(4);
      }
      return target.value;
    } catch (error) {

    }
  }
  setLinearTrancheReceivedPrices(prices: any, ComponentIndex:any) {
    try {
      this.LinearTranchePrice[this.LinearTranchePrice.length] = prices;
      this.LinearTranchePriceObserver.next({ price: prices, Index: ComponentIndex });
    } catch (error) {
      console.log('Error:', error);
    }
  }
  CheckLTP(LTP: any, Target:any, direction:any) {
    try {   
      if(LTP!=''){
        if(direction === 'Up')
        {
          if(LTP-Target>0)
          {
            return "green"
          }
          else 
          {
            return "red";
          }
        }
        else
        {
          if(LTP-Target<0)
          {
            return "green"
          }
          else 
          {
            return "red";
          }
        }
      }     
        else {
          return "black"
        }     
    } catch (error) {
      console.log('Error:', error);
    }
  }

   //Start: Added by Anubhav Goyal | 15-Sep-2023 | BBVAEPCLI-712 | To accept only 1 soft tenor letter

   chkValidShifter(shifterVal: any) {
    try {
      var regex: RegExp = new RegExp(/^([0-9]+[(D|d)]{1})$/);
      var regex1: RegExp = new RegExp(/^([0-9]+[(M|m)]{1})$/);
      var regex2: RegExp = new RegExp(/^([0-9]+[(W|w)]{1})$/);
      var regex3: RegExp = new RegExp(/^([0-9]+[(Y|y)]{1})$/);
      var regex4: RegExp = new RegExp(/^([0-9]+[(B|b)]{1})$/);

      if (shifterVal.match(regex) || shifterVal.match(regex1) || shifterVal.match(regex2) ||  shifterVal.match(regex3) || shifterVal.match(regex4)) {
        return true;
      } else {
        return false;
      }
    }
    catch (error) {
    }
  }
    
 // changed by Suvarna P || 27Apr23 || BBVACLI-72 || Token based calls from UI to FinIQ service || assigned by Pranav D

 setTokenLogoutFlg(flg: any){
  // logoutFlag
  this.logoutFlgObserver.next(flg);
}

   // Added by RiddhiP || 5june23 || BBVAEPCLI-585 || Add up to 6 Decimals to the coupon p.p in FX e pericer
   setDecimaltoSix(e: any) {
    try {
      const target: any = this.GetEventTarget(e);
      if (target.value.trim() === '' || isNaN(target.value)) {
        target.value = parseFloat('0.00').toFixed(6);
      } else {
        target.value = parseFloat(target.value).toFixed(6);
      }
      return target.value;
    } catch (error) {

    }
  }
}
