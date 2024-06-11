import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import moment, { Moment } from 'moment';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/services/config.service';
import { environment } from 'src/environments/environment';
import { SearchUserGroupPipe } from '../../../pipe/search-user-group.pipe';
import { EcCommonService } from '../../../services/ec-common.service';
import { EcHomeService } from '../../../services/ec-home.service';
import {EcSubmultirequestYeComponent} from '../ec-submultirequest-ye/ec-submultirequest-ye.component';
import {EcVerticalSubmultirequestYeComponent} from '../ec-vertical-submultirequest-ye/ec-vertical-submultirequest-ye.component';
import { ExcelService } from '../../../services/excel.service';


declare var require: any;
const $: any = require('jquery');

declare global {
    interface Array<T> {
        sortBy(p): Array<T>;
    }
}
Array.prototype.sortBy = function (p): Array<any> {
    try {
        // tslint:disable-next-line: only-arrow-functions
        return this.slice(0).sort(function (a, b) {
            return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
        });

    } catch (error) {
        //console.log('Error:', error);
    }
};


@Component({
  selector: 'app-ec-multi-yield-enhancement',
  templateUrl: './ec-multi-yield-enhancement.component.html',
  styleUrls: ['./ec-multi-yield-enhancement.component.scss']
})
export class EcMultiYieldEnhancementComponent implements OnInit {

  @Output()
  dateSelected: EventEmitter<Moment> = new EventEmitter();

  @Output()
  selectedDate = moment();

  @ViewChild('calendar', { static: true })
  calendar: MatCalendar<Moment>;

    @ViewChild('focusable', { static: false }) namefield: ElementRef;

    @ViewChild('saveButton') saveButton: ElementRef;
    @ViewChild('saveP') saveP: ElementRef;
    @ViewChild('saveI') saveI: ElementRef;
    @ViewChild('ddlSave') ddlSave: ElementRef;
    @ViewChild('ddlAdd') ddlAdd: ElementRef;
    @ViewChild('addButton') addButton: ElementRef;
    //Added by Adil || @26-06-2023 || Start
    @ViewChildren(EcSubmultirequestYeComponent ) childListHorizontal : QueryList<EcSubmultirequestYeComponent> ;
    @ViewChildren(EcVerticalSubmultirequestYeComponent ) childListVertical : QueryList<EcVerticalSubmultirequestYeComponent> ;
    //Added by Adil || @26-06-2023 || End


  clone = 'Add';
  multiPhoenixArr: any = [];
  shares: any;
  ReceivedCCY: any;
  templateMappingArr: any = [];
  //interfaceUrl = environment.euroconnectURL;
  asseturl = environment.asseturl;
  // ProductName = 'AutocallablePhoenix';
  //   ProductName = 'Accumulator';
  ProductName = 'YieldEnhancement';
  ErrorMsg = '';
  strXMLArr = [];
  strXML = '';
  strXLArr = []; // Bulk Pricer (YE) - Export to excel 
  strXL = ''; // Bulk Pricer (YE) - Export to excel 
  exportFlag = false; // Bulk Pricer (YE) - Export to excel
  PortFolioName = '';
  successMsg = '';
  portfolio = '';
  portfolioIdArr: any;
  saveFlag = false;
  addFlag: boolean;
  saveOptionsFlag = false;
  XMLFlag = false;
  // DisplayProductName = 'Autocallable Phoenix';
  //DisplayProductName = 'Accumulator';
  DisplayProductName = 'Yield Enhancement';
  onBehalfOf = '';
  allBooksData: any = [];
  toggleCheck = false;
  portfolioGroupID: any = '';
  toggleDisabledFlag = false;
  subscription: Subscription;
  priceoptionflag = false;
  saveoptionflag = false;
  showSchedulePopupFlag = false;
  showsaveSharePopupFlag = false;
  sharedportfolioArr: any;
  userflag: boolean;
  users: any;
  userName: string;
  userCode: any;
  selectedBIndex = 0;
  showSuggestions = false;
  selectedShareIndex = 0;
  userBasket = [];
  saveportfolioId: any = '';
  currentowner: any;
  accessRight = 'All';
  isPortfolioShared = false;
  portfolioowner: any;
  GetClientProdDetailsArr: any;
  // priceBtnActive = 'N';
  priceBtnActive = 'Y'; // set default to 'Y'|| added by PriyaL || 22Apr2022
  mappedformatlist: any;
  scheduleMsg: any;
  inputDate: any;
  inputTime: any;
  todayDate: any;
  startDate: any;
  displayFundingSection : boolean; // FIN1EURINT - 327 : Hide Funding Section for Bulk Pricer
  showDefault : boolean; // FIN1EURINT-502 : Default values appears during load after portfolio saving | 11-Aug-2023 
  monthSelected(_date: Moment) {
      //console.log('month changed');
  }

  dateChanged() {
      this.scheduleMsg = '';
      // this.ErrorMsgTop = '';
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

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
  }

    constructor(public elem: ElementRef, public commonfunctions: EcCommonService,
        public apifunctions: EcHomeService,
        private route: ActivatedRoute, private renderer: Renderer2, public excelService: ExcelService) {
        try {
            this.pushChildComponent();
            this.ErrorMsg = '';

            this.renderer.listen('window', 'click', (e: Event) => {

                let result: Boolean;
                if (this.ddlSave == undefined) {
                    result = true;
                }
                else {
                    if (e.target !== this.ddlSave.nativeElement) {
                        result = true;
                    }
                    else {
                        result = false;
                    }
                }
                if (e.target !== this.saveButton.nativeElement && result && e.target !== this.saveI.nativeElement && e.target !== this.saveP.nativeElement) {
                    this.saveoptionflag = false;
                } else {
                    this.saveoptionflag = !this.saveoptionflag;
                }

                if (this.ddlAdd == undefined) {
                    result = true;
                }
                else {
                    if (e.target !== this.ddlAdd.nativeElement) {
                        result = true;
                    }
                    else {
                        result = false;
                    }
                }

                if (e.target !== this.addButton.nativeElement && result) {
                    this.addFlag = false;
                } else {
                    this.ErrorMsg = '';
                    this.successMsg = '';
                    this.addFlag = !this.addFlag;
                }
            });

        } catch (error) {
            //console.log('Error:', error);
        }

    }




    async ngOnInit() {
      try {
          $('#loading').show();
            // FIN1EURINT - 327 : Hide Funding Section for Bulk Pricer
            this.displayFundingSection = false;
            setTimeout(async () => {
                this.portfolioowner = AppConfig.settings.oRes.userID;
              this.toggleCheck = this.commonfunctions.getLayout();
              this.ErrorMsg = '';


              this.addFlag = false;
              this.shares = this.apifunctions.shares;
              this.ReceivedCCY = this.apifunctions.CCY;
              this.showDefault = true; // FIN1EURINT-502 : Default values appears during load after portfolio saving | 11-Aug-2023 
              if (this.apifunctions.payOffList === undefined || this.apifunctions.payOffList.length <= 0) {
                    await this.apifunctions.getPayOffList();
              }
              const that = this;
              this.commonfunctions.deleteRowObserver.subscribe(res => {

                  if (res !== '') {
                      that.deleteRow(res);

                  }
              });
                this.commonfunctions.strxml.subscribe(async x => {
                  if (this.saveFlag) {
                    // FIN1EURINT-502 : Bulk Pricer - Rows get rearranged on saving or updating a portfolio.
                      if (JSON.stringify(x) !== "{}") {
                          that.strXMLArr.push(x);

                          if (that.strXMLArr.length === that.multiPhoenixArr.length) {
                            that.strXMLArr = that.strXMLArr.sort((a, b) => {
                                if(a.index < b.index){
                                    return -1;
                                }
                            });
                            that.strXML = '<Details>';
                              // tslint:disable-next-line: prefer-for-of
                              for (let k = 0; k < that.strXMLArr.length; k++) {
                                  that.strXML += that.strXMLArr[k].xml;
                              }
                              that.strXML += '</Details>';

                                await that.Save(that.strXML);
                              that.strXMLArr = [];
                              that.strXML = '';
                          }
                      }
                  }

              });

              // Bulk Pricer (YE) - Export to excel 
              this.commonfunctions.strXL.subscribe(t => {
                if (this.exportFlag) {
                    that.strXLArr.push(t);
                    if (that.strXLArr.length === that.multiPhoenixArr.length) {
                        this.excelService.exportAsExcelFile(that.strXLArr, 'BulkPricer_YieldEnhancement');
                        this.exportFlag = false;
                        that.strXLArr = [];
                        that.strXL = '';
                    }
                }
              });


                await this.LoadPortfolio();
              this.apifunctions.cloneData1Obs.subscribe(data => {
                  if (data) {
                      this.clone = data;
		      // FIN1EURINT-502 : Default values appears during load after portfolio saving | 11-Aug-2023 
                      if(data === 'Add'){
                        this.showDefault = true;
                      }
                      else{
                        this.showDefault = false;
                      }
                  }
              });

              this.apifunctions.toggleDataObs.subscribe(data => {
                  if (data) {
                      let d: any;
                      d = data;
                      if (d.ComponentIndex <= this.multiPhoenixArr.length - 1) {
                          this.multiPhoenixArr[d.ComponentIndex] = d;
                      }
                      this.showDefault = false; // FIN1EURINT-502 : Default values appears during load after portfolio saving | 11-Aug-2023 
                  }
              });

              this.subscription = this.apifunctions.toggleVisiblityFlagObs.subscribe(data => {
                  if (data) {
                      let cntflag = 0;
                      // tslint:disable-next-line: prefer-for-of
                      for (let j = 0; j < data.length; j++) {
                          if (!data[j]) {
                              cntflag++;
                          }
                      }
                      if (cntflag === data.length) {
                          that.toggleDisabledFlag = false;
                      }
                  }
              });

          });

            this.users = await this.apifunctions.GetMappedUsersAndGroups();

             let Dates: any = await this.apifunctions.BBVAGetDates('', '0B', '');
          if (Dates) {
                this.todayDate = this.commonfunctions.formatDate(Dates.MaturityDate);

          }

          this.route.params.subscribe
              (async params => {
                  if (params.RFQ_ID) {
                      let preQuoteData1: any;
                      preQuoteData1 = await this.apifunctions.getPreviousQuoteCloneData(params.RFQ_ID, 'RFQID');
                      //console.log(preQuoteData1);
                      const cloneData = preQuoteData1.cloneData;
                      this.multiPhoenixArr = [];
                      // this.multiPhoenixArr.push({
                      //     ShareBBGRIC1: cloneData.FirstUnderlyingCode1 !== undefined ? cloneData.FirstUnderlyingCode1[0] : '',
                      //     ShareBBGRIC2: cloneData.SecondUnderlyingCode1 !== undefined ? cloneData.SecondUnderlyingCode1[0] : '',
                      //     ShareBBGRIC3: cloneData.ThirdUnderlyingCode1 !== undefined ? cloneData.ThirdUnderlyingCode1[0] : '',
                      //     ShareBBGRIC4: cloneData.FourthUnderlyingCode1 !== undefined ? cloneData.FourthUnderlyingCode1[0] : '',
                      //     ShareBBGRIC5: cloneData.FifthUnderlyingCode1 !== undefined ? cloneData.FifthUnderlyingCode1[0] : '',
                      //     FormatDetails: cloneData.InputProductFormatType[0],
                      //     SolveFor: cloneData.InputRFQSolveFor[0],
                      //     IBPrice: cloneData.InputInterBankPrice[0],
                      //     Ccy: cloneData.InputSettlementCurrency[0],
                      //     Size: cloneData.InputRFQNotionalAmount[0],

                      //     ComputedStrikeFixingLag: cloneData.ComputedStrikeFixingLag[0],
                      //     ComputedSettlementPeriodSoftTenor: cloneData.ComputedSettlementPeriodSoftTenor[0],
                      //     ComputedPayoffSoftTenor: cloneData.ComputedPayoffSoftTenor[0],


                      //     Strike: cloneData.InputStrikePercent[0],
                      //     KIPer: cloneData.InitialInputKIBarrierPercent[0],
                      //     KIType: cloneData.StaticKIBarrierType[0],
                      //     KOPer: cloneData.InputKOBarrierString[0],
                      //     KOType: cloneData.StaticKOFrequency[0],
                      //     StepDown: (cloneData.InputKOStepdown[0] !== undefined && cloneData.InputKOStepdown[0] !== '') ? cloneData.InputKOStepdown[0] : '0.00',
                      //     NonCallPeriod: (cloneData.StaticNonCallPeriod[0] !== undefined && cloneData.StaticNonCallPeriod[0] !== '') ? cloneData.StaticNonCallPeriod[0] : '',
                      //     ERCouponPer: (cloneData.InputERCouponAmountPercent[0] !== undefined && cloneData.InputERCouponAmountPercent[0] !== '') ? cloneData.InputERCouponAmountPercent[0] : '0.00',
                      //     ERCouponType: cloneData.StaticERCouponType[0],
                      //     CouponBarrier: cloneData.InputCouponBarrierPercent[0],
                      //     Frequency: cloneData.InputFixedCouponFrequencyPeriod[0],
                      //     CouponPer: cloneData.InputFixedCouponPercentPA[0],
                      //     CouponObs: cloneData.InputCouponObservation[0],
                      //     CouponType: cloneData.StaticCouponType[0],
                      //     MemoryPds: cloneData.InputMemoryPeriods[0],
                      //     AltCouponPer: cloneData.InputAlternateCouponPercent[0],
                      //     AltCouponObservation: cloneData.InputAlternateCouponFrequency[0].replace(' ', ''),
                      //     FundingType: cloneData.StaticFundingType[0],
                      //     FundingFrequency: cloneData.StaticFundingFrequency[0],
                      //     IndexRateSpread: cloneData.InputFundingRateSpread[0],
                      //     IssuePrice: cloneData.InputIssuePricePercent[0],
                      //     LeverageYN: cloneData.InputLeverage[0],

                      // });


                      // Modified field mappings to resolve clone issue || PriyaL || 11Apr2022 || Assigned by Pranav D.
                      this.multiPhoenixArr.push({
                          FormatDetails: cloneData.Format[0],
                          Wrapper: cloneData.Format[0],
                          SolveFor: cloneData.SolveForvalue[0],
                          IBPrice: cloneData.IBPrice[0],
                          IssuePrice: cloneData.IssuePrice[0],
                          Ccy: cloneData.ddlNoteCcy[0],
                          Size: cloneData.Notional[0],
                          quanto: cloneData.quanto[0],
                          publicOrPrivate: cloneData.publicOrPrivate[0],
                          listed: cloneData.listed[0],
                          stockExchange: cloneData.stockExchange[0],
                          priipsYN: cloneData.priipsYN[0],
                          country: cloneData.country[0],
                          language: cloneData.language[0],
                          termsheetType: cloneData.termsheetType[0],
                          //    ComputedStrikeFixingLag:cloneData.[0],
                          stkdate: cloneData.stkdate[0],
                          //    ComputedSettlementPeriodSoftTenor :cloneData.[0],
                          paymentshift: cloneData.SettShifter[0],
                          settdate: cloneData.settdate[0],
                          //    ComputedPayoffSoftTenor:cloneData.ExpShifter[0],
                          customTenor: cloneData.customTenor[0],
                          SettlementMethod: cloneData.SettlementMethod[0],
                          ERCouponType: cloneData.ERCouponType[0],
                          ERFrequency: cloneData.autoFreq[0],
                          putableFreq: cloneData.putableFreq[0],
                          callableFreq: cloneData.callableFreq[0],
                          NonCallPeriod: cloneData.autoNonCall[0],
                          KOPer: cloneData.autoFreq[0],
                          StepDown: cloneData.autoStepdown[0],
                          //    PutableBarrier:cloneData.[0],
                          AutocallCouponType: cloneData.ERCouponType[0],
                          ERCouponPerc: cloneData.ERCoupon[0],
                          PeriodicCouponYN: cloneData.periodicCouponFlag[0],
                          CouponType: cloneData.cpnType[0],
                          CouponObs: cloneData.cpnObservation[0],
                          CouponBarrier: cloneData.cpnTrigger[0],
                          Frequency: cloneData.cpnFreq[0],
                          cpnCoupon: cloneData.cpnObservation[0],
                          CouponinFine: cloneData.cpnInFine[0],
                          YieldFloatingReference: cloneData.cpnFltRef[0],
                          FixingDetermination: cloneData.cpnFixing[0],
                          CouponPer: cloneData.cpnCoupon[0],
                          Floor_Perc: cloneData.cpnFloor[0],
                          Cap_Perc: cloneData.cpnCap[0],
                          Multiplier: cloneData.cpnMultiplier[0],
                          RangeAccrualFrequency: cloneData.rangeAccrualFreq[0],
                          LowerCouponBarrier: cloneData.lowCpnBarrier[0],
                          UpperCouponBarrier: cloneData.upperCpnBarrier[0],
                          KIType: cloneData.barrierType[0],
                          Strike: cloneData.strike[0],
                          UpperPutStrike: cloneData.upperPutStrike[0],
                          LowerPutStrike: cloneData.lowerPutStrike[0],
                          PutGearing: cloneData.leverage[0],
                          KIBarrier: cloneData.barrierType[0],
                          PutSpreadGearing: cloneData.putSpreadGearing[0],
                          KIPer: cloneData.barrierLevel[0],
                          //    ProtectionLevel:cloneData.[0],
                          FinalUpside: cloneData.upsideType[0],
                          CallStrike: cloneData.callStrike[0],
                          LowerCallStrike: cloneData.lowerCallStrike[0],
                          UpperCallStrike: cloneData.upperCallStrike[0],
                          CallGearing: cloneData.callGearing[0],
                          CallSpreadGearing: cloneData.callSpreadGearing[0],
                          dailyKOYN: cloneData.DailyKO[0],
                      })

                  }

              });

          //console.log('////////////')
      } catch (error) {
          //console.log('Error:', error);
      }

  }

  addNewRow(_portfolioRowData: any) {
      try {
          if (this.multiPhoenixArr.length === 0) {
              this.apifunctions.priceFlag.next(false);
              this.apifunctions.schedulePriceFlag.next({});
          }
          this.pushChildComponent();
          this.apifunctions.cloneData1.next('Add');
          this.apifunctions.cloneFlag1.next(false);
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;

  }

  pushChildComponent() {
      try {
          this.apifunctions.multiPhoenixArr.next(this.multiPhoenixArr.length);

          this.multiPhoenixArr.push({});
          this.showDefault = true; // FIN1EURINT-502 : Default values appears during load after portfolio saving | 11-Aug-2023 

      } catch (error) {
          //console.log('Error:', error);
      }
      return false;


  }

  cloneRow() {
      try {
          this.addNewRow(undefined);
          this.apifunctions.cloneFlag1.next(true);
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;

  }

  Price() {
      try {
          this.ErrorMsg = '';
          this.successMsg = '';
          $('#loading').show();
            setTimeout(async () => {
              // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
              // if (this.onBehalfOf === '') {
              //     this.ErrorMsg = 'No client is  mapped for this user. Request cannot be placed.';
              //     $('#loading').hide();
              //     return false;
              // } else {
              //     this.ErrorMsg = '';
              // }
              if (this.multiPhoenixArr.length > 0) {

                  if (this.ErrorMsg === '') {
                      const arr = [];
                      // tslint:disable-next-line: prefer-for-of
                      for (let i = 0; i < this.multiPhoenixArr.length; i++) {
                          arr.push(true);
                      }
                      this.toggleDisabledFlag = true;
                      this.apifunctions.toggleVisiblityFlag.next(arr);
                      // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
                      // this.apifunctions.setUserGroupID(this.onBehalfOf);
                      // this.apifunctions.setUserGroup(this.allBooksData[this.allBooksData.findIndex(x => x.BookCode === this.onBehalfOf)].BookName);
                      this.apifunctions.setUserGroupID('');
                      this.apifunctions.setUserGroup('');
                        this.portfolioGroupID = await this.apifunctions.fnportfolioGroupID();
                      this.apifunctions.setportfolioGroupID(this.portfolioGroupID);
                      this.apifunctions.priceFlag.next(true);
                  }
              }
          });
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

  // Bulk Pricer (YE) - Export to excel
  exportToExcel(){
    try{
        if (this.multiPhoenixArr.length > 0) {
            if (this.ErrorMsg === '') {
                this.exportFlag = true;
                this.strXLArr = [];
                this.strXL = '';
                this.apifunctions.excelFlag.next(true);
            

            }
        }
    }
    catch(error){

    }
  }

  generateXML(xmlFlag: boolean) {
      try {
          this.saveFlag = true;

          if (this.PortFolioName === '') {
              this.ErrorMsg = 'Please enter portfolio name.';
              this.successMsg = '';
              this.showsaveSharePopupFlag = false;
              return false;
          } else {
              this.ErrorMsg = '';
          }
          if (this.multiPhoenixArr.length > 0) {
              if (this.ErrorMsg === '') {
                  this.strXMLArr = [];
                  this.strXML = '';
                  this.successMsg = '';
                  this.XMLFlag = xmlFlag;
                  // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
                  // this.apifunctions.setUserGroupID(this.onBehalfOf);
                  // this.apifunctions.setUserGroup(this.allBooksData[this.allBooksData.findIndex(x => x.BookCode === this.onBehalfOf)].BookName);
                  this.apifunctions.setUserGroupID('');
                  this.apifunctions.setUserGroup('');
                  this.apifunctions.priceFlag.next(false);
                  this.apifunctions.schedulePriceFlag.next({});
                  this.commonfunctions.generateFlexiXml({});
                  this.apifunctions.saveFlag.next(true);
                  this.toggleDisabledFlag = false;
                  this.apifunctions.toggleVisiblityFlag.next([]);
                  // this.subscription.unsubscribe();

              }
          }
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

    async Save(xmlstr: string) {
      try {
          if (this.ErrorMsg === '') {
              let res: any;
              if (this.XMLFlag) {
                    this.currentowner = AppConfig.settings.oRes.userID;
                  // res = this.apifunctions.BBVASaveQuotes('FlexiPricer', xmlstr, this.PortFolioName, '', 'AutocallablePhoenix', this.currentowner);
                    res = await this.apifunctions.BBVASaveQuotes('FlexiPricer', xmlstr, this.PortFolioName, '', this.ProductName, this.currentowner);
              } else {
                  //console.log(this.portfolioowner);
                  // res = this.apifunctions.BBVASaveQuotes('FlexiPricer', xmlstr, this.PortFolioName,
                  //     this.portfolio, 'AutocallablePhoenix', this.portfolioowner);
                    res = await this.apifunctions.BBVASaveQuotes('FlexiPricer', xmlstr, this.PortFolioName,
                      this.portfolio, this.ProductName, this.portfolioowner);
              }

              if (res) {
                  if (res.errorMessage === '') {
                      $('#loading').show();
                        setTimeout(async () => {
                          this.saveFlag = false;
                          this.apifunctions.saveFlag.next(false);
                          this.commonfunctions.strxmlObserver.next({}); // FIN1EURINT-502 : Bulk Pricer - Rows get rearranged on saving or updating a portfolio.
                            await this.LoadPortfolio();
                          this.multiPhoenixArr = [];
                          this.ErrorMsg = '';
                          this.apifunctions.loadFlag.next(true);
                          this.apifunctions.priceFlag.next(false);
                          this.apifunctions.schedulePriceFlag.next({});
                          if (res.PortFolioID !== '') {
                              // this.multiPhoenixArr = this.apifunctions.BBVAGetPortfolioDetails(res.PortFolioID, 'AutocallablePhoenix');
                                this.multiPhoenixArr = await this.apifunctions.BBVAGetPortfolioDetails(res.PortFolioID);
                                this.showDefault = false; // FIN1EURINT-502 : Default values appears during load after portfolio saving | 11-Aug-2023 
                          }

                          if (!this.showsaveSharePopupFlag) {
                              this.successMsg = 'Portfolio ' + this.PortFolioName + ' saved successfully.';
                          } else {
                              this.saveportfolioId = res.PortFolioID;
                          }



                      });
                  } else {

                      this.ErrorMsg = res.errorMessage;
                      this.successMsg = '';

                      return false;
                  }
              }
          }
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

    async Load() {
      try {
          this.strXMLArr = [];
          this.strXML = '';
          this.successMsg = '';
          this.ErrorMsg = '';
          this.multiPhoenixArr = [];
          this.apifunctions.loadFlag.next(true);
          this.apifunctions.priceFlag.next(false);
          this.apifunctions.schedulePriceFlag.next({});
          this.apifunctions.saveFlag.next(false);

          this.toggleDisabledFlag = false;
          this.apifunctions.toggleVisiblityFlag.next([]);
          // this.subscription.unsubscribe();

          if (this.portfolio !== '') {
              // this.multiPhoenixArr = this.apifunctions.BBVAGetPortfolioDetails(this.portfolio, 'AutocallablePhoenix');
                this.multiPhoenixArr = await this.apifunctions.BBVAGetPortfolioDetails(this.portfolio);
                this.showDefault = false; // FIN1EURINT-502 : Default values appears during load after portfolio saving | 11-Aug-2023 
              if (this.multiPhoenixArr.length > 0) {
                  // if (this.multiPhoenixArr[0].onBehalfOf !== '') {
                      // if (this.allBooksData && this.allBooksData.length > 0) {
                      //     // tslint:disable-next-line: max-line-length
                      //     if (this.allBooksData.findIndex((record: { BookCode: any; }) => record.BookCode === this.multiPhoenixArr[0].onBehalfOf) > -1) {
                      //         this.onBehalfOf = this.multiPhoenixArr[0].onBehalfOf;
                      //     } else {
                      //         this.onBehalfOf = this.allBooksData[0].BookCode;
                      //     }
                      //     this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
                      //     if(this.GetClientProdDetailsArr.length > 0){
                      //         this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'YieldEnhancement')].CPM_Format).toString().split(',');
                      //         this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'YieldEnhancement')].ActiveYN;
                      //         //console.log(this.mappedformatlist, this.priceBtnActive);
                      //     }


                      // }

                  // }
              }
          }
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

    async LoadPortfolio() {
      try {
          // const portfolioArr = this.apifunctions.BBVAGetPortfolio('', '', 'AutocallablePhoenix');
            const portfolioArr: any = await this.apifunctions.BBVAGetPortfolio(this.ProductName, 'FlexiPricer');
          this.portfolioIdArr = portfolioArr.filter(obj => {
              return (
                  obj.ShareType === 'OWNER'
              );
          });
          this.sharedportfolioArr = portfolioArr.filter(obj => {
              return (
                  obj.ShareType === 'SHARED'
              );
          });
      } catch (error) {
          //console.log('Error:', error);
      }
  }
    async Delete() {
      try {
          if (this.portfolio !== '') {
              // const res = this.apifunctions.BBVADeletePortfolio(this.portfolio, 'AutocallablePhoenix');
              let portfolioDeleted = this.portfolioIdArr.filter((i) => { return i.P_ID === this.portfolio.toString() })[0]["P_Name"]; //added by Amogh K on 1-dec-2021
                const res = await this.apifunctions.BBVADeletePortfolio(this.portfolio, this.ProductName);
              if (res) {
                  this.successMsg = 'Portfolio ' + portfolioDeleted + ' deleted successfully.';
                  this.portfolio = '';
                  this.PortFolioName = '';
                  this.multiPhoenixArr = [];
                  this.pushChildComponent();
                    await this.LoadPortfolio();
              }
          }
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }
  portfolioChange(type: any) {
      try {
          if (this.portfolio === '') {
              this.PortFolioName = '';
              this.ErrorMsg = '';
              this.successMsg = '';
              this.multiPhoenixArr = [];
              this.multiPhoenixArr.push({}); // load default row on blank protfolio || PriyaL || 28Apr2022 || Assigned by Pranav D
              this.showDefault = true; // FIN1EURINT-502 : Default values appears during load after portfolio saving | 11-Aug-2023 
              return false;
          }
          $('#loading').show();
          setTimeout(() => {
              this.ErrorMsg = '';
              this.successMsg = '';
              this.PortFolioName = '';
              this.isPortfolioShared = false;
              this.accessRight = 'All';

              if (this.portfolio !== '') {
                  // tslint:disable-next-line: max-line-length
                  if (type === 'Owner') {
                      this.PortFolioName = this.portfolioIdArr[this.portfolioIdArr.findIndex((record: { P_ID: string; }) => record.P_ID === this.portfolio)].P_Name;
                      this.portfolioowner = this.portfolioIdArr[this.portfolioIdArr.findIndex((record: { P_ID: string; }) => record.P_ID === this.portfolio)].created_by;

                  }
                  if (type === 'Shared') {
                      this.PortFolioName = this.sharedportfolioArr[this.sharedportfolioArr.findIndex((record: { P_ID: string; }) => record.P_ID === this.portfolio)].P_Name;
                      this.accessRight = this.sharedportfolioArr[this.sharedportfolioArr.findIndex((record: { P_ID: string; }) => record.P_ID === this.portfolio)].AccessDetail;
                      this.portfolioowner = this.sharedportfolioArr[this.sharedportfolioArr.findIndex((record: { P_ID: string; }) => record.P_ID === this.portfolio)].created_by;
                      this.isPortfolioShared = true;
                  }




              }

              this.Load();
          });
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;

    }
    // addOptions() {
    //     try {
    //         this.ErrorMsg = '';
    //         this.successMsg = '';
    //         this.addFlag = !this.addFlag;
    //     } catch (error) {
    //         //console.log('Error:', error);
    //     }
    //     return false;
    // }
    // saveOptions() {
    //     try {
    //         this.ErrorMsg = '';
    //         this.successMsg = '';
    //         this.saveOptionsFlag = !this.saveOptionsFlag;
    //     } catch (error) {
    //         //console.log('Error:', error);
    //     }

  //     return false;
  // }

  deleteRow(rowindex: any) {
      try {
          if (this.multiPhoenixArr.length === 1) {
              return false;
          }
          this.ErrorMsg = '';
          this.successMsg = '';

          this.apifunctions.multiPhoenixArr.next(this.multiPhoenixArr.length);
          this.apifunctions.cloneFlag1.next(true);
          this.multiPhoenixArr.splice(rowindex, 1);
          this.commonfunctions.deleteRowObserver.next('');
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;

  }


  reset() {
      this.ErrorMsg = '';
  }


  errorMsgChangedHandler(msg: string) {
      this.ErrorMsg = msg;
  }

  scheduleMsgChangedHandler(msg: string) {
      this.scheduleMsg = msg;
  }
  clearData() {
      this.multiPhoenixArr = [];
      this.pushChildComponent();
      this.ErrorMsg = '';
  }

  getToggleData(event: MatSlideToggleChange) {
      //console.log('Error', this.ErrorMsg);
      this.ErrorMsg = '';
      this.successMsg = '';
      this.toggleCheck = event.checked;
      this.apifunctions.toggleFlag.next(this.toggleCheck);
      this.apifunctions.toggleVisiblityFlag.next([]);
      this.apifunctions.priceFlag.next(false);
      // this.apifunctions.schedulePriceFlag.next({});
      this.apifunctions.saveFlag.next(false);
      // this.apifunctions.schedulePopupFlag.next(false);

      this.commonfunctions.setsubmultiReceivedPrices({}, '');
      this.commonfunctions.setsubmultiRCReceivedPrices({}, '');
      this.commonfunctions.setsubmultiCreditReceivedPrices({}, '');
      this.commonfunctions.setsubmultiPTCReceivedPrices({}, '');

  }

  onbehalfChange() {

      this.mappedformatlist = [];
      this.priceBtnActive = 'Y';
      // Removed client book mapping || PriyaL || 22Apr2022 || Assigned by Pranav D
      // this.priceBtnActive = 'N';
      // this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
      // if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
      //     if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'YieldEnhancement') > -1) {
      //         this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'YieldEnhancement')].CPM_Format).toString().split(',');
      //         this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'YieldEnhancement')].ActiveYN;
      //         //console.log(this.mappedformatlist, this.priceBtnActive);
      //     } else {
      //         if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All') > -1) {
      //             this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].CPM_Format).toString().split(',');
      //             this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].ActiveYN;
      //             //console.log(this.mappedformatlist, this.priceBtnActive);
      //         }
      //     }
      // }


      this.toggleDisabledFlag = false;
      this.apifunctions.toggleVisiblityFlag.next([]);
      // this.subscription.unsubscribe();
      this.apifunctions.priceFlag.next(false);
      this.apifunctions.schedulePriceFlag.next({});
      this.apifunctions.saveFlag.next(false);
      // this.multiPhoenixArr = [];
      // this.pushChildComponent();



  }

  priceOptions() {
      try {
          this.priceoptionflag = !this.priceoptionflag;
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

    // saveOptions() {
    //     try {
    //         this.saveoptionflag = !this.saveoptionflag;
    //     } catch (error) {
    //         //console.log('Error:', error);
    //     }
    //     return false;
    // }

  showSchedulePopup() {
      try {
          this.ErrorMsg = '';
          this.scheduleMsg = '';
          this.apifunctions.schedulePopupFlag.next(true);
          if (this.ErrorMsg === '') {
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
          this.apifunctions.schedulePopupFlag.next(false);

      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

    async showsaveSharePopup() {
      try {
          if (this.PortFolioName === '') {
              this.ErrorMsg = 'Please enter portfolio name.';
              this.successMsg = '';
              this.showsaveSharePopupFlag = false;
              return false;
          }
          this.apifunctions.schedulePopupFlag.next(true);
          if (this.ErrorMsg === '') {
              if (this.portfolio === '') {
                  this.generateXML(true);
              }
              else {
                  this.generateXML(false);
                    const res: any = await this.apifunctions.getPortfolioSharingList(this.portfolio);
                  if (res) {
                      for (let i = 0; i < res.length; i++) {
                          if (this.userBasket.find(i => i.Code === res.User) === undefined) {
                              this.userBasket.push({ 'Code': res[i].User, 'Name': res[i].Name, 'Type': res[i].UserType, 'Access': res[i].AccessDetail, 'NewAddFlag': false });
                              //console.log(this.userBasket);
                          }
                      }
                  }
              }
                this.currentowner = AppConfig.settings.oRes.userID;

              // if (this.ErrorMsg === '') {

              this.showsaveSharePopupFlag = !this.showsaveSharePopupFlag;
          }


      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

  hidesaveSharePopup() {
      try {
        // FIN1EURINT-457 || Cancel action in sharing portfolio displays wrong message
        //   if (this.saveportfolioId !== '') {
        //       this.successMsg = 'Portfolio ' + this.PortFolioName + ' saved and shared successfully.';

        //       this.saveportfolioId = '';
        //       this.userBasket = [];
        //       this.apifunctions.schedulePopupFlag.next(false);
        //   }
        // FIN1EURINT-457 || Cancel action in sharing portfolio displays wrong message
          this.showsaveSharePopupFlag = false;

      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }

  selectShare(e) {
      try {
          this.userflag = false;
          if ($('.HoverSuggestion').data('share') !== undefined) {
              this.userCode = $('.HoverSuggestion').data('share');
          }
          if (this.userCode !== undefined && this.userCode !== '') {
              this.showUnderlying(e, SearchUserGroupPipe.prototype.transform(this.users, this.userCode)[0]);
          }
      } catch (Error) {
          //console.log('Error', Error);
      }
  }

  backKeyPress(_e) {
      try {
          //   this.userflag = false;
          //   this.userCode = '';
          //   this.selectedBIndex = 0;

          this.selectedShareIndex = 0;
          this.userflag = true;
          this.userCode = '';
          this.selectedBIndex = 0;
          this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;

          if (this.userName.length === 1) {
              this.showSuggestions = false;
              this.userflag = false;
          }

      } catch (error) {
          //console.log('Error:', error);
      }
  }

  showUnderlying(_event, item) {
      try {
          this.userflag = false;
          this.selectedBIndex = 0;
          this.showSuggestions = false;
          this.userName = '';
          //console.log(item);
          if (this.userBasket.find(i => i.Code === item.Code) === undefined) {
              this.userBasket.push({ 'Code': item.Code, 'Name': item.Name, 'Type': item.Type, 'Access': 'VIEW', 'NewAddFlag': true });
          }
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  ChangeIndex(_e) {
      try {
          this.selectedShareIndex = 0;
          this.userflag = true;
          this.userCode = '';
          this.selectedBIndex = 0;
          this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
      } catch (Error) {
      }
  }

  changeAccessofUserGroup(e: Event, index: any) {
      const target = this.commonfunctions.GetEventTarget(e);
      let res: any;
      //console.log(target.value);

      this.userBasket[index]['Access'] = target.value;

  }

  async sharePortfolio() {
   
      if (this.saveportfolioId !== '') {
          // let groupEdit =[];
          let groupView = [];
          let userEdit = [];
          let userView = [];
          if(this.userBasket && this.userBasket.length > 0){
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
          const res = await this.apifunctions.InsertPortfolioSharing(this.currentowner, [], groupView, this.saveportfolioId, userEdit, userView, [], []);
          if (res["Status"]?.toUpperCase() === "SUCCESS") {
           
              this.successMsg = 'Portfolio ' + this.PortFolioName + ' saved and shared successfully.';
              this.saveportfolioId = '';
              this.userBasket = [];
              this.showsaveSharePopupFlag = false;
          }
        }

      }

  }

    async deleteUserfromList(index: any) {
      if (!this.userBasket[index]['NewAddFlag']) {
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
            const res = await this.apifunctions.InsertPortfolioSharing(this.currentowner, [],
              [], this.saveportfolioId, [], [], groupdelete, userdelete);
          if (res) {
              this.userBasket.splice(index, 1);

              this.successMsg = type + ' ' + name + ' access removed sucessfully.';
          }

      } else {
          this.userBasket.splice(index, 1);
      }


  }

  scheduleSend() {
      try {
          this.ErrorMsg = '';
          this.successMsg = '';
          $('#loading').show();
            setTimeout(async () => {
              // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
              // if (this.onBehalfOf === '') {
              //     this.ErrorMsg = 'No client is  mapped for this user. Request cannot be placed.';
              //     $('#loading').hide();
              //     return false;
              // } else {
              //     this.ErrorMsg = '';
              // }

              if (!this.commonfunctions.validTime(this.commonfunctions.getInputTime(this.inputTime))) {
                  this.ErrorMsg = 'Please enter valid time in hh:mm (am/pm) format';
                  $('#loading').hide();
                  return false;
              } else {
                  this.ErrorMsg = '';
              }
              if (this.multiPhoenixArr.length > 0) {
                  if (this.ErrorMsg === '') {

                      // this.apifunctions.setUserGroupID(this.onBehalfOf);
                        this.portfolioGroupID = await this.apifunctions.fnportfolioGroupID();
                      this.apifunctions.setportfolioGroupID(this.portfolioGroupID);
                      this.apifunctions.schedulePriceFlag.next({ Date: this.inputDate, Time: this.inputTime });
                  }
              }
          });
      } catch (error) {
          //console.log('Error:', error);
      }
      return false;
  }
  /* Function Added by AdilP || @26-06-2023 */
  clearPrices() {
    if(this.childListHorizontal.length > 0){
        this.childListHorizontal.forEach((child)=>{
            child.ERReset();
         })
    } 
    if(this.childListVertical.length > 0){
        this.childListVertical.forEach((child)=>{
            child.ERReset();
         })
    }
}

}
