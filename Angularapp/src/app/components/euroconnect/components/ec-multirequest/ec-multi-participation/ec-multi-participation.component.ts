import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import moment, { Moment } from 'moment';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SearchUserGroupPipe } from '../../../pipe/search-user-group.pipe';
import { EcCommonService } from '../../../services/ec-common.service';
import { EcHomeService } from '../../../services/ec-home.service';
import { AppConfig } from 'src/app/services/config.service';
import { CustomerService } from '../../../services/customer.service';
import { ExcelService } from '../../../services/excel.service';
import { NewsServiceService } from '../../../services/news-service.service';
import {EcSubmultirequestComponent} from '../ec-submultirequest/ec-submultirequest.component';
import {EcVerticalSubmultiNewComponent} from '../ec-vertical-submulti-new/ec-vertical-submulti-new.component'


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
  selector: 'app-ec-multi-participation',
  templateUrl: './ec-multi-participation.component.html',
  styleUrls: ['./ec-multi-participation.component.scss']
})
export class EcMultiParticipationComponent implements OnInit {

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
    @ViewChildren(EcSubmultirequestComponent ) childListHorizontal : QueryList<EcSubmultirequestComponent> ;
    @ViewChildren(EcVerticalSubmultiNewComponent ) childListVertical : QueryList<EcVerticalSubmultiNewComponent> ;
    //Added by Adil || @26-06-2023 || End

    clone = 'Add';
    multiPTCArr: any[] = [];
    shares: any;
    ReceivedCCY: any;
    templateMappingArr: any = [];
    asseturl = environment.asseturl;
    ProductName = 'Participation';
    ErrorMsg = '';
    strXMLArr = [];
    strXML = '';
    PortFolioName = '';
    successMsg = '';
    portfolio = '';
    portfolioIdArr: any;
    saveFlag = false;
    addFlag: boolean;
    saveOptionsFlag = false;
    XMLFlag = false;
    DisplayProductName = 'Participation';
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
    displayFundingSection : boolean; // FIN1EURINT - 327 : Hide Funding Section for Bulk Pricer
    monthSelected(date: Moment) {
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
        public apifunctions: EcHomeService, public datepipe: DatePipe, private route: ActivatedRoute,private renderer: Renderer2) {
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
                // this.commonfunctions.changeLayout();
                this.ErrorMsg = '';
                this.allBooksData = this.apifunctions.allBooksData;
                if (this.allBooksData && this.allBooksData.length > 0) {
                    this.onBehalfOf = this.allBooksData[0].BookCode;
                    this.apifunctions.setUserGroupID(this.onBehalfOf);
                    this.apifunctions.setUserGroup(this.allBooksData[this.allBooksData.findIndex(x => x.BookCode === this.onBehalfOf)].BookName);
                    // Removed client book mapping || PriyaL || 22Apr2022 || Assigned by Pranav D
                    // this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
                    // if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
                    //     if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation') > -1) {
                    //         this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation')].CPM_Format).toString().split(',');
                    //         this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation')].ActiveYN;
                    //         //console.log(this.mappedformatlist, this.priceBtnActive);
                    //     } else{
                    //         if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All') > -1) {
                    //           this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].CPM_Format).toString().split(',');
                    //           this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].ActiveYN;
                    //           //console.log(this.mappedformatlist, this.priceBtnActive);
                    //         }
                    //       }
                    // }
                }
                this.addFlag = false;
                this.shares = this.apifunctions.shares;
                this.ReceivedCCY = this.apifunctions.CCY;
                if(this.apifunctions.payOffList === undefined || this.apifunctions.payOffList.length <= 0){
                    await this.apifunctions.getPayOffList();
                } 
                const that = this;
                this.commonfunctions.deleteRowObserver.subscribe(res => {
                    if (res !== '') {
                        that.deleteRow(res);
                    }
                });
                this.commonfunctions.strxmlPTC.subscribe(async x => {
                    if (this.saveFlag) {
                        if (x !== '') {
                            that.strXMLArr.push(x);
                            if (that.strXMLArr.length === that.multiPTCArr.length) {
                                that.strXML = '<Details>';
                                // tslint:disable-next-line: prefer-for-of
                                for (let k = 0; k < that.strXMLArr.length; k++) {
                                    that.strXML += that.strXMLArr[k];
                                }
                                that.strXML += '</Details>';
                                await that.Save(that.strXML);
                                that.strXMLArr = [];
                                that.strXML = '';
                            }
                        }
                    }

                });

                await this.LoadPortfolio();
                this.apifunctions.cloneData1Obs.subscribe(data => {
                    if (data) {
                        this.clone = data;
                    }
                });

                this.apifunctions.toggleDataObs.subscribe(data => {
                    if (data) {
                        let d: any;
                        d = data;
                        if (d.ComponentIndex <= this.multiPTCArr.length - 1) {
                            this.multiPTCArr[d.ComponentIndex] = d;
                        }
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
            //console.log('Users', this.users);
            const Dates = await this.apifunctions.BBVAGetDates('', '0B', '');
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
                        this.multiPTCArr = [];
                        this.multiPTCArr.push({
                            ShareBBGRIC1: cloneData.FirstUnderlyingCode1 !== undefined ? cloneData.FirstUnderlyingCode1[0] : '',
                            ShareBBGRIC2: cloneData.SecondUnderlyingCode1 !== undefined ? cloneData.SecondUnderlyingCode1[0] : '',
                            ShareBBGRIC3: cloneData.ThirdUnderlyingCode1 !== undefined ? cloneData.ThirdUnderlyingCode1[0] : '',
                            ShareBBGRIC4: cloneData.FourthUnderlyingCode1 !== undefined ? cloneData.FourthUnderlyingCode1[0] : '',
                            ShareBBGRIC5: cloneData.FifthUnderlyingCode1 !== undefined ? cloneData.FifthUnderlyingCode1[0] : '',
                            Wrapper: cloneData.StaticFormat[0],
                            SolveFor: cloneData.InputRFQSolveFor[0],
                            IBPrice: cloneData.InputInterBankPrice[0],
                            Ccy: cloneData.InputSettlementCurrency[0],
                            Size: cloneData.InputRequestedSize[0],

                            ComputedStrikeFixingLag: cloneData.ComputedStrikeFixingLag[0],
                            ComputedSettlementPeriodSoftTenor: cloneData.ComputedSettlementPeriodSoftTenor[0],
                            ComputedPayoffSoftTenor: cloneData.ComputedPayoffSoftTenor[0],


                            FundingType: cloneData.StaticFundingType[0],
                            FundingFrequency: cloneData.StaticFundingFrequency[0],
                            IndexRateSpread: cloneData.InputFundingRateSpread[0],

                            ProductType: cloneData.InputProductVariation[0],
                            GuaranteedCoupon: cloneData.InputFixedCouponPercentPA[0],
                            InputFixedCouponFrequencyPeriod: cloneData.InputFixedCouponFrequencyPeriod[0],
                            InputStrikePercent: cloneData.InputStrikePercent[0],
                            UpsideParticipationPercent: cloneData.UpsideParticipationPercent[0],
                            InputDownsideStrikePercent: cloneData.InputDownsideStrikePercent[0],
                            DownsideParticipationPercent: cloneData.DownsideParticipationPercent[0],
                            DownsideParticipationCapPercent: cloneData.DownsideParticipationCapPercent[0],
                            DownsideCapitalProtectionPercent: cloneData.DownsideCapitalProtectionPercent[0],
                            InitialInputKOBarrierPercent: cloneData.InitialInputKOBarrierPercent[0],
                            InputKOBarrierFrequency: cloneData.InputKOBarrierFrequency[0],
                            InputKIBarrierFrequency: cloneData.InputKIBarrierFrequency[0],
                            InitialInputKIBarrierPercent: cloneData.InitialInputKIBarrierPercent[0],
                            UpsideParticipationCapPercent: cloneData.UpsideParticipationCapPercent[0],
                            InputRebatePercent: cloneData.InputRebatePercent[0],
                            InputMinimumCouponPercentPA: cloneData.InputMinimumCouponPercentPA[0],
                            IssuePrice: cloneData.InputIssuePricePercent[0],
                            downLeverage:cloneData.DownsideParticipationPercent[0],
                            downLeverageYN: cloneData.DownsideParticipationPercent[0] === '100.00' ? 'N' : 'Y'
                        });

                    }

                });
        } catch (error) {
            //console.log('Error:', error);
        }

    }

    addNewRow() {
        try {
            if (this.multiPTCArr.length === 0) {
                this.apifunctions.ptcPriceFlag.next(false);
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
            this.apifunctions.multiPhoenixArr.next(this.multiPTCArr.length);
            this.multiPTCArr.push({});
        } catch (error) {
            //console.log('Error:', error);
        }
        return false;


    }


    cloneRow() {
        try {
            this.addNewRow();
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
                if (this.onBehalfOf === '') {
                    this.ErrorMsg = 'No client is  mapped for this user. Request cannot be placed.';
                    $('#loading').hide();
                    return false;
                } else {
                    this.ErrorMsg = '';
                }
                if (this.multiPTCArr.length > 0) {
                    if (this.ErrorMsg === '') {
                        const arr = [];
                        // tslint:disable-next-line: prefer-for-of
                        for (let i = 0; i < this.multiPTCArr.length; i++) {

                            arr.push(true);

                        }
                        this.toggleDisabledFlag = true;
                        this.apifunctions.toggleVisiblityFlag.next(arr);
                        this.apifunctions.setUserGroupID(this.onBehalfOf);
                        this.apifunctions.setUserGroup(this.allBooksData[this.allBooksData.findIndex(x => x.BookCode === this.onBehalfOf)].BookName);
                        this.portfolioGroupID = await this.apifunctions.fnportfolioGroupID();
                        this.apifunctions.setportfolioGroupID(this.portfolioGroupID);
                        this.apifunctions.ptcPriceFlag.next(true);
                    }
                }
            });
        } catch (error) {
            //console.log('Error:', error);
        }
        return false;
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
            if (this.multiPTCArr.length > 0) {
                if (this.ErrorMsg === '') {
                    this.strXMLArr = [];
                    this.strXML = '';
                    this.successMsg = '';
                    this.XMLFlag = xmlFlag;

                    this.apifunctions.setUserGroupID(this.onBehalfOf);
                    this.apifunctions.setUserGroup(this.allBooksData[this.allBooksData.findIndex(x => x.BookCode === this.onBehalfOf)].BookName);
                    this.apifunctions.ptcPriceFlag.next(false);
                    this.apifunctions.schedulePriceFlag.next({});
                    this.commonfunctions.generatePTCFlexiXml('');
                    this.apifunctions.ptcsaveFlag.next(true);
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
    async Save(xmlstr) {
        try {
            if (this.ErrorMsg === '') {
                let res: any;
                if (this.XMLFlag) {
                    this.currentowner = AppConfig.settings.oRes.userID;
                    res = await this.apifunctions.BBVASaveQuotes('FlexiPricer', xmlstr, this.PortFolioName, '', 'Participation', this.currentowner);
                } else {
                    res = await this.apifunctions.BBVASaveQuotes('FlexiPricer', xmlstr, this.PortFolioName,
                        this.portfolio, 'Participation', this.portfolioowner);
                }

                if (res) {
                    if (res.errorMessage === '') {
                        $('#loading').show();
                        setTimeout(async () => {

                            this.saveFlag = false;
                            this.apifunctions.ptcsaveFlag.next(false);
                            this.commonfunctions.strxmlPTCObserver.next('');
                            await this.LoadPortfolio();
                            this.multiPTCArr = [];
                            this.ErrorMsg = '';
                            this.apifunctions.ptcloadFlag.next(true);
                            this.apifunctions.ptcPriceFlag.next(false);
                            this.apifunctions.schedulePriceFlag.next({});
                            // FIN1EURINT-405 || Participation Bulk: After saving the portfolio, the default leg get vanished
                            if (res.PortFolioID !== '') {
                                this.multiPTCArr = await this.apifunctions.BBVAGetPortfolioDetails(res.PortFolioID);
                            }

                            if (!this.showsaveSharePopupFlag) {
                                this.successMsg = 'Portfolio  ' + this.PortFolioName + ' saved successfully.';
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
            this.multiPTCArr = [];
            this.apifunctions.ptcloadFlag.next(true);
            this.apifunctions.ptcPriceFlag.next(false);
            this.apifunctions.schedulePriceFlag.next({});
            this.apifunctions.ptcsaveFlag.next(false);
            this.toggleDisabledFlag = false;
            this.apifunctions.toggleVisiblityFlag.next([]);
            // this.subscription.unsubscribe();
            if (this.portfolio !== '') {
                this.multiPTCArr = await this.apifunctions.BBVAGetPortfolioDetails(this.portfolio);
                if (this.multiPTCArr.length > 0) {
                    // if (this.multiPTCArr[0].onBehalfOf !== '') {
                    //     if (this.allBooksData && this.allBooksData.length > 0) {
                    //         if (this.allBooksData.findIndex(record => record.BookCode === this.multiPTCArr[0].onBehalfOf) > -1) {
                    //             this.onBehalfOf = this.multiPTCArr[0].onBehalfOf;
                    //         } else {
                    //             this.onBehalfOf = this.allBooksData[0].BookCode;
                    //         }

                    //     }

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
            const portfolioArr = await this.apifunctions.BBVAGetPortfolio('Participation','FlexiPricer');
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
                const res = await this.apifunctions.BBVADeletePortfolio(this.portfolio, 'Participation');
                if (res) {
                    this.successMsg = 'Portfolio ' + this.PortFolioName + ' deleted successfully.';
                    this.portfolio = '';
                    this.PortFolioName = '';
                    this.multiPTCArr = [];
                    this.pushChildComponent();
                    this.LoadPortfolio();
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
                this.multiPTCArr = [];
                this.multiPTCArr.push({}); // FIN1EURINT-405 || Participation Bulk: After saving the portfolio, the default leg get vanished
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
    addOptions() {
        try {
            this.ErrorMsg = '';
            this.successMsg = '';
            this.addFlag = !this.addFlag;
        } catch (error) {
            //console.log('Error:', error);
        }
        return false;
    }
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
            if (this.multiPTCArr.length === 1) {
                return false;
            }
            this.ErrorMsg = '';
            this.successMsg = '';
            this.apifunctions.multiPhoenixArr.next(this.multiPTCArr.length);
            this.apifunctions.cloneFlag1.next(true);
            this.multiPTCArr.splice(rowindex, 1);

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
        this.multiPTCArr = [];
        this.pushChildComponent();
        this.ErrorMsg = '';
    }

    getToggleData(event: MatSlideToggleChange) {
        this.ErrorMsg = '';
        this.successMsg = '';
        this.toggleCheck = event.checked;
        this.apifunctions.toggleFlag.next(this.toggleCheck);
        this.apifunctions.toggleVisiblityFlag.next([]);
        this.apifunctions.ptcPriceFlag.next(false);
        this.apifunctions.schedulePriceFlag.next({});
        this.apifunctions.ptcsaveFlag.next(false);
        this.commonfunctions.setsubmultiReceivedPrices({}, '');
        this.commonfunctions.setsubmultiRCReceivedPrices({}, '');
        this.commonfunctions.setsubmultiCreditReceivedPrices({}, '');
        this.commonfunctions.setsubmultiPTCReceivedPrices({}, '');
    }

    onbehalfChange() {

        this.mappedformatlist = [];
        this.priceBtnActive = 'Y';

        // this.priceBtnActive = 'N';
        // this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
        // if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
        //     if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation') > -1) {
        //         this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation')].CPM_Format).toString().split(',');
        //         this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Participation')].ActiveYN;
        //         //console.log(this.mappedformatlist, this.priceBtnActive);
        //     } else{
        //         if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All') > -1) {
        //           this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].CPM_Format).toString().split(',');
        //           this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].ActiveYN;
        //           //console.log(this.mappedformatlist, this.priceBtnActive);
        //         }
        //       }
        // }

        this.toggleDisabledFlag = false;
        this.apifunctions.toggleVisiblityFlag.next([]);
        // this.subscription.unsubscribe();
        this.apifunctions.ptcPriceFlag.next(false);
        this.apifunctions.schedulePriceFlag.next({});
        this.apifunctions.ptcsaveFlag.next(false);

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
                    const res = await this.apifunctions.getPortfolioSharingList(this.portfolio);
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
            // if (this.saveportfolioId !== '') {
            //     this.successMsg = 'Portfolio ' + this.PortFolioName + ' saved and shared successfully.';

            //     this.saveportfolioId = '';
            //     this.userBasket = [];
            //     this.apifunctions.schedulePopupFlag.next(false);
            // }
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

    backKeyPress(e) {
        try {
            // this.userflag = false;
            // this.userCode = '';
            // this.selectedBIndex = 0;

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

    showUnderlying(event, item) {
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

    ChangeIndex(e) {
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
            if (res) {
                this.successMsg = 'Portfolio ' + this.PortFolioName + ' saved and shared successfully.';
                this.saveportfolioId = '';
                this.userBasket = [];
                this.showsaveSharePopupFlag = false;
            }
        }
        }

    }

    deleteUserfromList(index: any) {
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
            const res = this.apifunctions.InsertPortfolioSharing(this.currentowner, [],
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
                if (this.onBehalfOf === '') {
                    this.ErrorMsg = 'No client is  mapped for this user. Request cannot be placed.';
                    $('#loading').hide();
                    return false;
                } else {
                    this.ErrorMsg = '';
                }

                if (!this.commonfunctions.validTime(this.commonfunctions.getInputTime(this.inputTime))) {
                    this.ErrorMsg = 'Please enter valid time in hh:mm (am/pm) format';
                    $('#loading').hide();
                    return false;
                } else {
                    this.ErrorMsg = '';
                }
                if (this.multiPTCArr.length > 0) {
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
            child.reset();
         })
    } 
    if(this.childListVertical.length > 0){
        this.childListVertical.forEach((child)=>{
            child.reset();
         })
    }
}
}
