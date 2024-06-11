import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { DigitalModel } from '../../Common-Components/models/digital-model.service';
import { FxdApifunctionService } from '../../services/fxd-apifunction.service';
import { FxdCommonfunctionsService } from '../../services/fxd-commonfunctions.service';

@Component({
  selector: 'app-digital',
  templateUrl: './digital.component.html',
  styleUrls: ['./digital.component.scss'],
})
export class DigitalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() Product_ID: any;
  @Input() Product_Code: string;
  @Input() Product_Name: string;
  @Input() Mode: string;
  @Input() UserGroup: string;
  @Input() PricingMode: string;
  @Input() AppMode: string;
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    // console.log(event);
    switch (event.key || event.code) {
      case 'F7':
        console.log(event);
        this.ResetAllFields();
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'F8':
        console.log(event);
        this.Validations();
        this.FXBestPrice();
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'F9':
        console.log(event);
        event.stopPropagation();
        event.preventDefault();
        break;

      default:
        break;
    }
  }
  digitalModel: DigitalModel;
  CustomerID: string;
  Errormsg: string = '';
  Orderplace: any = '';

  Bestpricesubscription: Subscription;

  constructor(
    public Home_api: HomeApiService,
    public FXD_cfs: FxdCommonfunctionsService,
    public FXD_afs: FxdApifunctionService,
    public Author_api: AuthService
  ) {
    this.digitalModel = new DigitalModel();
    this.CustomerID = '';
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    if (this.Bestpricesubscription) this.Bestpricesubscription.unsubscribe();
  }

  ngOnInit(): void {

    this.fnDefaultValues();
    this.FXD_cfs.fnGetPriceProviderandCcypairs(this.digitalModel); 
    console.log(this.digitalModel);
  }



  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.digitalModel.Product_ID = this.Product_ID;
    this.digitalModel.Product_Code = this.Product_Code;
    this.digitalModel.Product_Name = this.Product_Name;
    this.digitalModel.Mode = this.Mode;
    this.digitalModel.UserGroup = this.UserGroup;
    this.digitalModel.PricingMode = this.PricingMode;
    this.digitalModel.AppMode = this.AppMode;
  }

  fnDefaultValues() {
    this.CustomerID = this.Home_api.CustomerName;
  }

  TradeSelectedLP(SelectedLPDetails) {
    this.digitalModel.BestPriceProvider = SelectedLPDetails.provider;
    this.digitalModel.ExternalRfqId = SelectedLPDetails.quoteId;
    this.digitalModel.BestPrice = SelectedLPDetails.price;
    this.FXD_cfs.BookDeal(this.digitalModel);
  }

  fnDisableTradebtn(e) {
    this.digitalModel.OrderPlaceFlag = e;
  }

  fnDisablePrembtn(e) {
    this.digitalModel.disabledPrembtn = e;
    // this.ResetAllFields();
  }

  Validations() {
    if(this.CustomerID === '' || this.CustomerID === undefined){
      this.Errormsg = 'Please Select Customer';
      return false;
    }else{
      this.Errormsg = '';
    }
    if (Number(this.digitalModel.Notional.replace(/,/g, '')) < 100000) {
      this.Errormsg =
        'Notional below ' + this.digitalModel.NotionalCCY + ' 100k not allowed';
      return false;
    }
    if (
      parseFloat(this.digitalModel.UpfrontPer) > 1 ||
      parseFloat(this.digitalModel.UpfrontPer) < 0.01
    ) {
      this.Errormsg = 'Upfront should be between 0.01% to 1%';
      return false;
    } else {
      this.Errormsg = '';
    }
    if (Number(this.digitalModel.Strike) > 0) {
      this.Errormsg = '';
    } else {
      this.Errormsg = 'Strike rate should be greater than 0';
      return false;
    }
    if (
      Number(this.digitalModel.AskRate) > 0 &&
      Number(this.digitalModel.BidRate) > 0
    ) {
      this.Errormsg = '';
    } else {
      this.Errormsg = 'Spot rate should be greater than 0';
      return false;
    }
    if (
      this.digitalModel.TradeDate !== '' &&
      this.digitalModel.PremiumDate !== '' &&
      this.digitalModel.FixingDate !== '' &&
      this.digitalModel.MaturityDate !== ''
    ) {
      this.Errormsg = '';
    } else {
      this.Errormsg = 'Dates are not loaded';
      return false;
    }
    // this.digitalModel.DisableTriggerCondition = false;
    // this.digitalModel.DisableLowerBarrier = true;
    // this.digitalModel.DisableUpperBarrier = true;
    if (!this.digitalModel.DisableLowerBarrier) {
      if (!isNaN(parseFloat(this.digitalModel.LowerBarrierLevel))) {
        if (parseFloat(this.digitalModel.LowerBarrierLevel) > parseFloat(this.digitalModel.Strike)) {
          this.Errormsg = 'Lower barrier value should be less than Spot.';
          return false;
        } else {
          this.Errormsg = '';
        }
      }else{
        this.Errormsg = 'Please enter valid value for the Lower barrier';
        return false;
      }
    }
    if (!this.digitalModel.DisableUpperBarrier) {
      if (!isNaN(parseFloat(this.digitalModel.UpperBarrierLevel))) {
        if (parseFloat(this.digitalModel.UpperBarrierLevel) < parseFloat(this.digitalModel.Strike)) {
          this.Errormsg = 'Upper barrier value should be greater than Spot.';
          return false;
        } else {
          this.Errormsg = '';
        }
      } else {
        this.Errormsg = 'Please enter valid value for the Upper barrier';
        return false;
      }
    }
    return true;
  }

  TargetValueLimitor(e) {
    const target = this.FXD_cfs.GetEventTarget(e);
    if (target.value > 10000) {
      return false;
    } else {
      return true;
    }
  }
  FXBestPrice() {
    if (this.digitalModel.PricingMode === 'AUTO') {
      // if (this.Validations() && this.Errormsg === '') {
      //   this.ResetAllFields();
      //   this.FXD_cfs.GenerateUserID(this.digitalModel);
      //   this.digitalModel.disabledPrembtn = true;
      //   this.digitalModel.PricingLoading = true;
      //   if (this.digitalModel.NotionalCCY === this.digitalModel.DepCcy) {
      //     this.digitalModel.AltNotional = Number(this.digitalModel.Notional.replace(/,/g, '')) * Number(this.digitalModel.Strike);
      //   } else {
      //     this.digitalModel.AltNotional = Number(this.digitalModel.Notional.replace(/,/g, '')) / Number(this.digitalModel.Strike);
      //   }
      //   this.digitalModel.ClearPricingFlag = false;
      //   const SpotRate =
      //     (this.digitalModel.OrderDirection === 'Sell' &&
      //       this.digitalModel.OptionType === 'Call') ||
      //       (this.digitalModel.OrderDirection === 'Buy' &&
      //         this.digitalModel.OptionType === 'Put')
      //       ? this.digitalModel.BidRate
      //       : this.digitalModel.AskRate;
      //   // eslint-disable-next-line @typescript-eslint/quotes
      //   var XMLString =
      //     '<ExcelSheets><Sheet1><Product_Name>' +
      //     this.Product_Name +
      //     '</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><CustID>' +
      //     this.Home_api.CustomerId +
      //     '</CustID><Customer_Name>' +
      //     this.Home_api.CustomerName +
      //     '</Customer_Name><Spotrate>' +
      //     SpotRate +
      //     '</Spotrate><Notional>' +
      //     Number(this.digitalModel.Notional.replace(/,/g, '')) +
      //     '</Notional><OptionCut>TOK</OptionCut><NonDeliveryYN>N</NonDeliveryYN><CcyPair>' +
      //     this.digitalModel.CurrencyPair +
      //     '</CcyPair><AltCcy>' +
      //     (this.digitalModel.NotionalCCY === this.digitalModel.DepCcy
      //       ? this.digitalModel.AltCcy
      //       : this.digitalModel.DepCcy) +
      //     '</AltCcy><InvCcy>' +
      //     this.digitalModel.NotionalCCY +
      //     '</InvCcy><PremiumCcy>' +
      //     this.digitalModel.IBPremCCY +
      //     '</PremiumCcy><Tenor>' +
      //     this.digitalModel.Tenor +
      //     '</Tenor><PremiumDate>' +
      //     this.digitalModel.PremiumDate +
      //     '</PremiumDate><BuySell>' +
      //     this.digitalModel.OrderDirection +
      //     '</BuySell><FixingDate>' +
      //     this.digitalModel.FixingDate +
      //     '</FixingDate><TradeDate>' +
      //     this.digitalModel.TradeDate +
      //     '</TradeDate><SettDate>' +
      //     this.digitalModel.MaturityDate +
      //     '</SettDate><Strike>' +
      //     this.digitalModel.Strike +
      //     '</Strike><TenorDays>' +
      //     this.digitalModel.TenorDays +
      //     '</TenorDays><optionType></optionType><LowerBarrier>' +
      //     this.digitalModel.LowerBarrierLevel +
      //     '</LowerBarrier><UpperBarrier>' +
      //     this.digitalModel.UpperBarrierLevel +
      //     '</UpperBarrier><DigitalType>' +
      //     this.digitalModel.SelectedDigitalType +
      //     '</DigitalType><TriggerCondition>' +
      //     this.digitalModel.SelectedTriggerCondition +
      //     '</TriggerCondition><GlobalCcy>' +
      //     this.digitalModel.DepCcy +
      //     '</GlobalCcy><EntityID>' +
      //     this.FXD_afs.EntityID +
      //     '</EntityID><CAI_ID>7400</CAI_ID></Sheet1></ExcelSheets>';
      //   this.FXD_afs.SetPricingProduct(this.Product_Name);

      //   this.Bestpricesubscription = this.FXD_afs.GetFXBestPriceForVB(
      //     this.FXD_afs.EntityID,
      //     this.Product_ID,
      //     this.Product_Name,
      //     this.digitalModel.CurrencyPair,
      //     this.digitalModel.NotionalCCY,
      //     this.digitalModel.NotionalCCY === this.digitalModel.DepCcy
      //       ? this.digitalModel.AltCcy
      //       : this.digitalModel.DepCcy,
      //     this.digitalModel.IBPremCCY,
      //     this.digitalModel.IBPremCCY === this.digitalModel.DepCcy
      //       ? this.digitalModel.AltCcy
      //       : this.digitalModel.DepCcy,
      //     this.digitalModel.Notional.replace(/,/g, ''),
      //     this.digitalModel.AltNotional.toString(),
      //     this.digitalModel.OrderDirection,
      //     this.digitalModel.OptionType,
      //     this.digitalModel.Strike,
      //     '0',
      //     '0',
      //     '',
      //     'EUROPEAN',
      //     'EUROPEAN',
      //     'TOK',
      //     this.digitalModel.Tenor + '',
      //     this.digitalModel.PremiumDate,
      //     this.digitalModel.FixingDate,
      //     this.digitalModel.MaturityDate,
      //     this.digitalModel.PriceProviderString,
      //     'PREMIUM',
      //     this.digitalModel.TemplateCode,
      //     this.digitalModel.TemplateID.toString(),
      //     this.digitalModel.Notional.replace(/,/g, ''),
      //     '',
      //     '',
      //     '',
      //     '',
      //     0,
      //     '',
      //     XMLString,
      //     this.digitalModel.UpfrontPer,
      //     this.FXD_afs.UserName,
      //     '',
      //     true,''
      //   ).subscribe((res) => {
      //     this.digitalModel.BestPrice = null;
      //     if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
      //       if (res) {
      //         this.digitalModel.PricingServiceResponse =
      //           res.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody;
      //         this.digitalModel.PricingServiceResponseArray =
      //           this.digitalModel.PricingServiceResponse[0].bestPriceProvider
      //             .toString()
      //             .split(':');
      //         if (this.digitalModel.PricingServiceResponseArray[0] !== 'FAIL') {
      //           this.digitalModel.BestPriceProvider =
      //             this.digitalModel.PricingServiceResponseArray[0];
      //           this.digitalModel.BestPrice =
      //             this.digitalModel.PricingServiceResponseArray[1];
      //           // this.BestPrice = Number(parseFloat(this.BestPrice.toString()).toFixed(4));
      //           this.digitalModel.PricingLoading = false;
      //           // eslint-disable-next-line @typescript-eslint/prefer-for-of
      //           this.digitalModel.DCDRfqId =
      //             this.digitalModel.PricingServiceResponse[0].o_DCDRFQID;

      //           this.digitalModel.PricingServiceResponse.forEach((element) => {
      //             if (
      //               this.digitalModel.BestPriceProvider === element.provider
      //             ) {
      //               this.fnSetIBPrem(element.premiumAmount);
      //               // this.digitalModel.IBPremium = element.premiumAmount;
      //               // this.digitalModel.IBPremium = parseFloat( this.digitalModel.IBPremium.toString()).toFixed(4);
      //               this.digitalModel.ExternalRfqId = element.quoteId;
      //               this.digitalModel.BestPriceabs = Math.abs(
      //                 Number(this.digitalModel.BestPrice)
      //               );
      //             }
      //           });

      //           this.FXD_cfs.fnCalcUpfrontAndIbPrem(this.digitalModel);
      //         } else {
      //           this.digitalModel.PricingLoading = false;
      //           this.Errormsg =
      //             this.digitalModel.PricingServiceResponse[0].errorMessage;
      //           this.Errormsg = 'No prices received';
      //           this.digitalModel.disabledPrembtn = false;
      //         }
      //       }
      //     }
      //   });
      // }
    } else {
      this.FXManualPricing();
    }
  }
  FXManualPricing() {
    if (this.Validations() && this.Errormsg === '') {
      // this.ResetAllFields();
      this.FXD_cfs.GenerateUserID(this.digitalModel);
      this.digitalModel.disabledPrembtn = true;
      this.digitalModel.PricingLoading = true;
      if (this.digitalModel.NotionalCCY === this.digitalModel.DepCcy) {
        this.digitalModel.AltNotional = Number(this.digitalModel.Notional.replace(/,/g, '')) * Number(this.digitalModel.Strike);
      } else {
        this.digitalModel.AltNotional = Number(this.digitalModel.Notional.replace(/,/g, '')) / Number(this.digitalModel.Strike);
      }
      this.digitalModel.ClearPricingFlag = false;
      const SpotRate =
        (this.digitalModel.OrderDirection === 'Sell' &&
          this.digitalModel.OptionType === 'Call') ||
          (this.digitalModel.OrderDirection === 'Buy' &&
            this.digitalModel.OptionType === 'Put')
          ? this.digitalModel.BidRate
          : this.digitalModel.AskRate;
      var XMLString =
        '<ExcelSheets><Sheet1><Product_Name>' +
        this.Product_Name +
        '</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><CustID>' +
        this.Home_api.CustomerId +
        '</CustID><Customer_Name>' +
        this.Home_api.CustomerName +
        '</Customer_Name><Spotrate>' +
        SpotRate +
        '</Spotrate><Notional>' +
        Number(this.digitalModel.Notional.replace(/,/g, '')) +
        '</Notional><OptionType>' +
        this.digitalModel.OptionType +
        '</OptionType><OptionCut>TOK</OptionCut><NonDeliveryYN>N</NonDeliveryYN><CcyPair>' +
        this.digitalModel.CurrencyPair +
        '</CcyPair><AltCcy>' +
        (this.digitalModel.NotionalCCY === this.digitalModel.DepCcy
          ? this.digitalModel.AltCcy
          : this.digitalModel.DepCcy) +
        '</AltCcy><InvCcy>' +
        this.digitalModel.NotionalCCY +
        '</InvCcy><PremiumCcy>' +
        this.digitalModel.IBPremCCY +
        '</PremiumCcy><CustPrem>0</CustPrem><Tenor>' +
        this.digitalModel.Tenor +
        '</Tenor><PremiumDate>' +
        this.digitalModel.PremiumDate +
        '</PremiumDate><BuySell>' +
        this.digitalModel.OrderDirection +
        '</BuySell><FixingDate>' +
        this.digitalModel.FixingDate +
        '</FixingDate><SpreadAmt>' +
        this.digitalModel.UpfrontPer +
        '</SpreadAmt><TradeDate>' +
        this.digitalModel.TradeDate +
        '</TradeDate><SettDate>' +
        this.digitalModel.MaturityDate +
        '</SettDate><Strike>' +
        this.digitalModel.Strike +
        '</Strike><TenorDays>' +
        this.digitalModel.TenorDays +
        '</TenorDays><optionType>' +
        this.digitalModel.SelectedDigitalTypeCode +
        '</optionType><LowerBarrier>' +
        this.digitalModel.LowerBarrierLevel +
        '</LowerBarrier><UpperBarrier>' +
        this.digitalModel.UpperBarrierLevel +
        '</UpperBarrier><DigitalType>' +
        this.digitalModel.SelectedDigitalType +
        '</DigitalType><TriggerCondition>' +
        this.digitalModel.SelectedTriggerCondition +
        '</TriggerCondition><GlobalCcy>' +
        this.digitalModel.DepCcy +
        '</GlobalCcy><EntityID>' +
        this.FXD_afs.EntityID +
        '</EntityID><CAI_ID>7400</CAI_ID></Sheet1></ExcelSheets>';
      this.FXD_afs.SetPricingProduct(this.Product_Name);
      this.Bestpricesubscription = this.FXD_afs.GetFXBestPriceForVBManual(
        this.FXD_afs.EntityID, //EntityId
        this.digitalModel.Product_ID, //ProductID
        this.digitalModel.Product_Code, //ProductType
        this.digitalModel.CurrencyPair, //CurrencyPair
        this.digitalModel.DepCcy, //DepositCurrency
        this.digitalModel.AltCcy, //AlternateCurrency
        this.digitalModel.DepCcy, //PremCurrency
        this.digitalModel.NotionalCCY, //SettlementCcy
        this.digitalModel.Notional.toString().replace(/,/g, ''), //AmountInDepositCurrency
        this.digitalModel.AltNotional, //AmountInAlternateCurrency
        this.digitalModel.OrderDirection, //BuySell
        'CALL', //CallPut
        this.digitalModel.Strike, //Strike
        this.digitalModel.LowerBarrierLevel === '' ? '0' : this.digitalModel.LowerBarrierLevel, //LowerBarrier
        this.digitalModel.UpperBarrierLevel === '' ? '0' : this.digitalModel.UpperBarrierLevel, //UpperBarrier
        '', //BarrierType
        'EUROPEAN',
        'EUROPEAN',
        'TOK',
        this.digitalModel.Tenor + '',
        this.digitalModel.TradeDate, //ValueDate
        this.digitalModel.FixingDate, //FixingDate
        this.digitalModel.MaturityDate, //MaturityDate
        '', //PriceProviderDetails
        'Premium', //SolveFor
        this.digitalModel.TemplateCode, //TemplateCode
        this.digitalModel.Product_ID, //TemplateID
        this.digitalModel.Notional.toString().replace(/,/g, ''), //NotionalPerFix
        '', //LeverageFactor
        '', //FixingSettFreq
        '', //GuaranteedPeriod
        '', //KORate
        0, //TargetInPips
        '', //TargetGainunit
        XMLString, //XMLString
        this.digitalModel.UpfrontPer, //RMMarginPercentage
        this.Home_api.CustomerId, //UserID
        this.digitalModel.Mode, //PricingModel
        'GWManual', //PricingMode
        this.digitalModel.ClientPremType, //CustPayReceiveDirection
        this.digitalModel.IBPremType, //IBPayReceiveDirection
        '', //MarketPremium
        this.digitalModel.IBPremium, //MarketPremiumAmount
        this.digitalModel.ClientPremium //CustomerPremAmount
      ).subscribe((res) => {
        this.digitalModel.BestPrice = null;
        if (this.FXD_afs.GetPricingProduct() === this.Product_Name) {
          if (res) {
            console.log(res);
            if (res) {
              this.digitalModel.PricingServiceResponse = res.GetFXOPriceManualModeResult;
              // this.fnSetIBPrem(this.digitalModel.PricingServiceResponse.IBPrem);
              // this.digitalModel.IBPremium = this.digitalModel.PricingServiceResponse.IBPrem;
              
              this.digitalModel.ClientPremium = parseFloat(this.digitalModel.PricingServiceResponse.CustPrem).toFixed(this.digitalModel.IBPremCCY === this.digitalModel.AltCcy ? this.digitalModel.Asset2_DecimalAmount : this.digitalModel.Asset1_DecimalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              this.digitalModel.UpfrontPer = this.digitalModel.PricingServiceResponse.MarginPerc;
              this.digitalModel.ClientPremType = this.digitalModel.PricingServiceResponse.CustPayReceiveDirection;
              this.digitalModel.IBPremType = this.digitalModel.PricingServiceResponse.IBPayReceiveDirection;
              this.digitalModel.DCDRfqId = this.digitalModel.PricingServiceResponse.DCDRFQID;
              this.digitalModel.PricingLoading = false;
            } else {
              this.digitalModel.PricingLoading = false;
              this.Errormsg =
                this.digitalModel.PricingServiceResponse[0].errorMessage;
              this.Errormsg = 'No prices received';
            }
          }
        }
      });
    }
  }
  ResetAllFields() {
    this.digitalModel.ClearPricingFlag = true;
    this.digitalModel.ClientPremium = '0.00';
    // this.digitalModel.IBPremium = '0.00';
    this.digitalModel.PricingMode.toUpperCase() !== 'MANUAL' ? this.digitalModel.IBPremium = '0.00' : '';
    this.digitalModel.PricingServiceResponse = '';
    this.digitalModel.BestPrice = '';
    this.digitalModel.BestPriceProvider = '';
    this.digitalModel.OrderPlaceFlag = false;
    this.digitalModel.PricingLoading = false;
    this.Errormsg = '';
    this.digitalModel.DealNo = '';
    if (this.Bestpricesubscription) this.Bestpricesubscription.unsubscribe();
  }

  fnChangeDigitalType() {
    this.ResetAllFields();
    switch (this.digitalModel.SelectedDigitalType) {
      case 'Digital-European':
        this.digitalModel.DisableTriggerCondition = false;
        this.digitalModel.DisableLowerBarrier = true;
        this.digitalModel.DisableUpperBarrier = true;
        if (
          this.digitalModel.SelectedTriggerCondition !== 'at or above' &&
          this.digitalModel.SelectedTriggerCondition !== 'at or below'
        ) {
          this.digitalModel.SelectedTriggerCondition = 'at or above';
        }
        if (this.digitalModel.SelectedTriggerCondition === 'at or above') {
          this.digitalModel.SelectedDigitalTypeCode = '1C';
        } else {
          this.digitalModel.SelectedDigitalTypeCode = '2C';
        }

        break;
      case 'Digital-No Touch American':
        this.digitalModel.DisableTriggerCondition = false;
        if (
          this.digitalModel.SelectedTriggerCondition !== 'always above' &&
          this.digitalModel.SelectedTriggerCondition !== 'always below'
        ) {
          this.digitalModel.SelectedTriggerCondition = 'always above';
        }
        if (this.digitalModel.SelectedTriggerCondition === 'always above') {
          this.digitalModel.DisableLowerBarrier = false;
          this.digitalModel.DisableUpperBarrier = true;
          this.digitalModel.UpperBarrierLevel = '';
          this.digitalModel.SelectedDigitalTypeCode = 'DNT1C';
        } else {
          this.digitalModel.DisableLowerBarrier = true;
          this.digitalModel.DisableUpperBarrier = false;
          this.digitalModel.LowerBarrierLevel = '';
          this.digitalModel.SelectedDigitalTypeCode = 'DNT2C';
        }
        break;
      case 'Digital Touch American':
        this.digitalModel.DisableTriggerCondition = false;
        if (
          this.digitalModel.SelectedTriggerCondition !==
          'touches upper barrier' &&
          this.digitalModel.SelectedTriggerCondition !== 'touches lower barrier'
        ) {
          this.digitalModel.SelectedTriggerCondition = 'touches upper barrier';
        }
        if (
          this.digitalModel.SelectedTriggerCondition === 'touches upper barrier'
        ) {
          this.digitalModel.DisableLowerBarrier = true;
          this.digitalModel.DisableUpperBarrier = false;
          this.digitalModel.LowerBarrierLevel = '';
          this.digitalModel.SelectedDigitalTypeCode = 'OT1C';
        } else {
          this.digitalModel.DisableLowerBarrier = false;
          this.digitalModel.DisableUpperBarrier = true;
          this.digitalModel.UpperBarrierLevel = '';
          this.digitalModel.SelectedDigitalTypeCode = 'OT2C';
        }
        break;
      case 'Double Digital-No Touch American':
        this.digitalModel.DisableTriggerCondition = true;
        this.digitalModel.DisableLowerBarrier = false;
        this.digitalModel.DisableUpperBarrier = false;
        this.digitalModel.SelectedDigitalTypeCode = 'DDNT';
        break;
      case 'Double Digital Touch American':
        this.digitalModel.DisableTriggerCondition = true;
        this.digitalModel.DisableLowerBarrier = false;
        this.digitalModel.DisableUpperBarrier = false;
        this.digitalModel.SelectedDigitalTypeCode = 'DDT';
        break;
      default:
        break;
    }
  }

  fnSetIBPrem(InputValue: any) {
    if (this.digitalModel.AltCcy === this.digitalModel.IBPremCCY) {
      this.digitalModel.IBPremium = Number(parseFloat(InputValue.toString()).toFixed(this.digitalModel.Asset2_DecimalAmount)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      this.digitalModel.IBPremium = Number(parseFloat(InputValue.toString()).toFixed(this.digitalModel.Asset1_DecimalAmount)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }
  fnCalcUpfrontAndIbPrem() {
    var UpfrontInCcy = 0;

    if (this.digitalModel.IBPremCCY === this.digitalModel.DepCcy && this.digitalModel.NotionalCCY === this.digitalModel.AltCcy) {
      UpfrontInCcy = ((Number(this.digitalModel.Notional.toString().replace(/,/g, '')) / parseFloat(this.digitalModel.Strike)) * (parseFloat(this.digitalModel.UpfrontPer) / 100));
    } else if (this.digitalModel.IBPremCCY !== this.digitalModel.NotionalCCY) {
      UpfrontInCcy = (Number(this.digitalModel.Notional.toString().replace(/,/g, '')) * parseFloat(this.digitalModel.Strike) * (parseFloat(this.digitalModel.UpfrontPer) / 100));
    } else {
      UpfrontInCcy = (Number(this.digitalModel.Notional.toString().replace(/,/g, '')) * (parseFloat(this.digitalModel.UpfrontPer) / 100));
    }

    if (this.digitalModel.OrderDirection === 'Buy') {
      //data.clientPrem = ((Math.abs(Number(this.unformatNumber(data.nominal)) * (Number(data.price) + Number(data.upfront)))) / 100).toString();
      this.digitalModel.ClientPremium = (parseFloat(this.fnGetIBPrem()) + UpfrontInCcy).toFixed(this.digitalModel.IBPremCCY === this.digitalModel.AltCcy ? this.digitalModel.Asset2_DecimalAmount : this.digitalModel.Asset1_DecimalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      //data.clientPrem = ((Math.abs(Number(this.unformatNumber(data.nominal)) * (Number(data.price) - Number(data.upfront)))) / 100).toString();
      this.digitalModel.ClientPremium = (parseFloat(this.fnGetIBPrem()) - UpfrontInCcy).toFixed(this.digitalModel.IBPremCCY === this.digitalModel.AltCcy ? this.digitalModel.Asset2_DecimalAmount : this.digitalModel.Asset1_DecimalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }
  fnGetIBPrem() {
    return this.digitalModel.IBPremium.replace(/,/g, '');
  }
  public SelectedCCy(e) {
    console.log(e);
    this.digitalModel.CurrencyPair = e;
    this.FXD_cfs.setCCY(this.digitalModel);
    this.FXD_cfs.GetStrikeRate(this.digitalModel);
  }
  fnChangePricingMode() {
    // this.PricingMode = this.SelectedPricingMode.toUpperCase();
    // switch (this.PricingMode) {
    //   case 'AUTO':
    //     this.SelectedLPForPricing = 'Best';
    //     break;
    //   case 'MANUAL':
    //     this.SelectedLPForPricing = this.SampleArray[0].PP_Name;
    //     this.SampleArray.forEach((element, index) => {
    //       if (element.PP_Name === 'Best') {
    //         this.SampleArray.splice(index, 1);
    //       }
    //     });
    //     // this.ServiceResponse = [{ bestPriceProvider: this.SelectedLPForPricing }];
    //     // SelectedIBType
    //     break;
    // }
  }
  fnCustomerSelection(e){
    this.CustomerID = e.CustomerID;
  }
}
