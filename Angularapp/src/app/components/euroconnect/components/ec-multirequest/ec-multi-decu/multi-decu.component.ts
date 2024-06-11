import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild , Input, OnDestroy,Renderer2, AfterViewInit} from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import moment, { Moment } from 'moment';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerService } from '../../../services/customer.service';
import { EcCommonService } from '../../../services/ec-common.service';
import { EcHomeService } from '../../../services/ec-home.service';
import { ExcelService } from '../../../services/excel.service';
import { NewsServiceService } from '../../../services/news-service.service';
import {SearchUserGroupPipe} from '../../../pipe/search-user-group.pipe'
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
// import { SvgIconsComponent } from '../../../CommonComponents/svg-icons/svg-icons.component';

 
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
  selector: 'app-multi-decu',
  templateUrl: './multi-decu.component.html',
  styleUrls: ['./multi-decu.component.scss']
})
export class MultiDecuComponent implements OnInit {

  @Output()
  dateSelected: EventEmitter<Moment> = new EventEmitter();

  @Output()
  selectedDate = moment();

  @ViewChild('calendar', { static: true })
  calendar: MatCalendar<Moment>;

  @ViewChild('focusable', { static: false }) namefield: ElementRef;

  clone = 'Add';
  multiPhoenixArr: any = [];
  shares: any;
  ReceivedCCY: any;
  templateMappingArr: any = [];
  asseturl = environment.asseturl;
  // ProductName = 'AutocallablePhoenix';
  ProductName = 'Decumulator';
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
  // DisplayProductName = 'Autocallable Phoenix';
  DisplayProductName = 'Decumulator';
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
  priceBtnActive = 'Y';
  mappedformatlist: any;
  scheduleMsg: any;
  inputDate: any;
  inputTime: any;
  todayDate: any;
  startDate: any;
  monthSelected(date: Moment) {
      console.log('month changed' , date);
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

  constructor(public EcNews: NewsServiceService, public EcHome: EcHomeService, public EcCommon : EcCommonService , public EcExcel : ExcelService , 
    public EcCustomer : CustomerService , public elem: ElementRef , public datepipe: DatePipe, private route: ActivatedRoute) {
      try {
          this.pushChildComponent();
          this.ErrorMsg = '';
      } catch (error) {
          //console.log('Error:', error);
      }
  }

  ngOnInit(): void {

    try {
      $('#loading').show();
      setTimeout(() => {
          this.portfolioowner = (this.EcCommon.getLoggedInUserName())[0].UserId;
          this.toggleCheck = this.EcCommon.getLayout();
          // this.commonfunctions.changeLayout();
          this.ErrorMsg = '';
          // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
          // this.allBooksData = this.apifunctions.allBooksData;


          // if (this.allBooksData && this.allBooksData.length > 0) {
          //     this.onBehalfOf = this.allBooksData[0].BookCode;
          //     this.apifunctions.setUserGroupID(this.onBehalfOf);
          //     this.apifunctions.setUserGroup(this.allBooksData[this.allBooksData.findIndex(x => x.BookCode === this.onBehalfOf)].BookName);
          // Removed client book mapping || PriyaL || 22Apr2022 || Assigned by Pranav D
          // this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
          // if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
          //     if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix') > -1) {
          //         this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix')].CPM_Format).toString().split(',');
          //         // this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix')].ActiveYN;
          //         //console.log(this.mappedformatlist, this.priceBtnActive);
          //     } else{
          //         if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All') > -1) {
          //           this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].CPM_Format).toString().split(',');
          //         //   this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].ActiveYN;
          //           //console.log(this.mappedformatlist, this.priceBtnActive);
          //         }
          //       }
          // }

          // }

          this.addFlag = false;
                // START Changes on 16th Dec 2022 by Ashwini H. | for sharelist
                if (this.EcHome.shares === undefined || this.EcHome.shares.length <= 0) {
                    this.shares = this.EcHome.BBVALoadShares('EQ', "", this.ProductName);
                }
                else{
                    this.shares = this.EcHome.shares;
                }
                // END
          this.ReceivedCCY = this.EcHome.CCY;
          if (this.EcHome.payOffList === undefined || this.EcHome.payOffList.length <= 0) {
              this.EcHome.getPayOffList();
          }
          const that = this;
          this.EcCommon.deleteRowObserver.subscribe(res => {

              if (res !== '') {
                  that.deleteRow(res);

              }
          });
          this.EcCommon.strxml.subscribe(x => {
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

                          that.Save(that.strXML);
                          that.strXMLArr = [];
                          that.strXML = '';
                      }
                  }
              }

          });


          this.LoadPortfolio();
          this.EcHome.cloneData1Obs.subscribe(data => {
              if (data) {
                  this.clone = data;
              }
          });

          this.EcHome.toggleDataObs.subscribe(data => {
              if (data) {
                  let d: any;
                  d = data;
                  if (d.ComponentIndex <= this.multiPhoenixArr.length - 1) {
                      this.multiPhoenixArr[d.ComponentIndex] = d;
                  }
              }
          });

          this.subscription = this.EcHome.toggleVisiblityFlagObs.subscribe(data => {
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

      this.users = this.EcHome.GetMappedUsersAndGroups();

      const Dates:any = this.EcHome.BBVAGetDates('', '0B', '');
      if (Dates) {
          this.todayDate = this.EcCommon.formatDate(Dates.MaturityDate);

      }

      this.route.params.subscribe
          (params => {
              if (params.RFQ_ID) {
                  let preQuoteData1: any;
                  preQuoteData1 = this.EcHome.getPreviousQuoteCloneData(params.RFQ_ID, 'RFQID');
                  //console.log(preQuoteData1);
                  if (preQuoteData1.cloneData) {
                      const cloneData = preQuoteData1.cloneData;
                      this.multiPhoenixArr = [];
                      this.multiPhoenixArr.push({
                          //Modified share mapping || PriyaL || 12Apr2022 || Assigned by PranavD.
                          ShareBBGRIC1: cloneData.Underlying1 !== undefined ? cloneData.Underlying1[0] : '',
                          // ShareBBGRIC2: cloneData.SecondUnderlyingCode1 !== undefined ? cloneData.SecondUnderlyingCode1[0] : '',
                          // ShareBBGRIC3: cloneData.ThirdUnderlyingCode1 !== undefined ? cloneData.ThirdUnderlyingCode1[0] : '',
                          // ShareBBGRIC4: cloneData.FourthUnderlyingCode1 !== undefined ? cloneData.FourthUnderlyingCode1[0] : '',
                          // ShareBBGRIC5: cloneData.FifthUnderlyingCode1 !== undefined ? cloneData.FifthUnderlyingCode1[0] : '',
                          // FormatDetails: cloneData.InputProductFormatType[0],

                          SolveFor: cloneData.SolveFor[0],
                          // modified total shares mapping field || PriyaL || 02May2022 || issue reported by AbeerJ
                          // SharesQuantity: cloneData.NoOfShares[0],
                          SharesQuantity: cloneData.DailyNoOfShares[0],
                          // modified tenor mapping field || PriyaL || 02May2022 || issue reported by AbeerJ
                          // TenorPer: cloneData.ActualTenor[0],
                          TenorPer: cloneData.Tenor[0],
                          Strike: cloneData.Strike[0],
                          // modified Upfront mapping field || PriyaL || 02May2022 || issue reported by AbeerJ
                          // Upfront: cloneData.Upfront_Perc[0],
                          Upfront: cloneData.Upfront[0],
                          KOPer: cloneData.KO[0],
                            // modified KOType mapping field || PriyaL || 02May2022 || issue reported by AbeerJ
                          // KOType: cloneData.KOType[0],
                          KOType: cloneData.KOType ? cloneData.KOType[0] : '',
                          Frequency: cloneData.Frequency[0],
                            // modified GuaranteedPeriod mapping field || PriyaL || 02May2022 || issue reported by AbeerJ
                          // Guarantee: cloneData.GuaranteedPeriod[0],
                          Guarantee: cloneData.GuaranteedDuration[0],
                          LeverageYN: cloneData.LeveragedYN[0] === 'True' ? 'Y' : 'N',


                      });
                  }


              }

          });

  } catch (error) {
      //console.log('Error:', error);
  }

  }
  
  addNewRow(portfolioRowData: any) {
    try {
      console.log(portfolioRowData)
        if (this.multiPhoenixArr.length === 0) {
            this.EcHome.priceFlag.next(false);
            this.EcHome.schedulePriceFlag.next({});
        }
        this.pushChildComponent();
        this.EcHome.cloneData1.next('Add');
        this.EcHome.cloneFlag1.next(false);
    } catch (error) {
        //console.log('Error:', error);
    }
    return false;

}


cloneRow() {
    try {
        this.addNewRow(undefined);
        this.EcHome.cloneFlag1.next(true);
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
        setTimeout(() => {

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
                    this.EcHome.toggleVisiblityFlag.next(arr);
                    // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
                    // this.apifunctions.setUserGroupID(this.onBehalfOf);
                    // this.apifunctions.setUserGroup(this.allBooksData[this.allBooksData.findIndex(x => x.BookCode === this.onBehalfOf)].BookName);
                    this.EcHome.setUserGroupID('');
                    this.EcHome.setUserGroup('');
                    this.portfolioGroupID = this.EcHome.fnportfolioGroupID();
                    this.EcHome.setportfolioGroupID(this.portfolioGroupID);
                    this.EcHome.priceFlag.next(true);
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
        if (this.multiPhoenixArr.length > 0) {
            if (this.ErrorMsg === '') {
                this.strXMLArr = [];
                this.strXML = '';
                this.successMsg = '';
                this.XMLFlag = xmlFlag;
                // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
                // this.apifunctions.setUserGroupID(this.onBehalfOf);
                // this.apifunctions.setUserGroup(this.allBooksData[this.allBooksData.findIndex(x => x.BookCode === this.onBehalfOf)].BookName);+
                this.EcHome.setUserGroupID('');
                 this.EcHome.setUserGroup('');
                this.EcHome.priceFlag.next(false);
                this.EcHome.schedulePriceFlag.next({});
                this.EcCommon.generateFlexiXml({});
                this.EcHome.saveFlag.next(true);
                this.toggleDisabledFlag = false;
                this.EcHome.toggleVisiblityFlag.next([]);
                // this.subscription.unsubscribe();

            }
        }
    } catch (error) {
        //console.log('Error:', error);
    }
    return false;
}

Save(xmlstr: string) {
    try {
        if (this.ErrorMsg === '') {
            let res: any;
            if (this.XMLFlag) {
                this.currentowner = (this.EcCommon.getLoggedInUserName())[0].UserId;
                // res = this.apifunctions.BBVASaveQuotes('FlexiPricer', xmlstr, this.PortFolioName, '', 'AutocallablePhoenix', this.currentowner);
                res = this.EcHome.BBVASaveQuotes('FlexiPricer', xmlstr, this.PortFolioName, '', this.ProductName, this.currentowner);
            } else {
                //console.log(this.portfolioowner);
                // res = this.apifunctions.BBVASaveQuotes('FlexiPricer', xmlstr, this.PortFolioName,
                //     this.portfolio, 'AutocallablePhoenix', this.portfolioowner);
                res = this.EcHome.BBVASaveQuotes('FlexiPricer', xmlstr, this.PortFolioName,
                    this.portfolio, this.ProductName, this.portfolioowner);
            }

            if (res) {
                if (res.errorMessage === '') {
                    $('#loading').show();
                    setTimeout(() => {
                        this.saveFlag = false;
                        this.EcHome.saveFlag.next(false);
                        this.EcCommon.strxmlObserver.next({});// FIN1EURINT-502 : Bulk Pricer - Rows get rearranged on saving or updating a portfolio.
                        this.LoadPortfolio();
                        this.multiPhoenixArr = [];
                        this.ErrorMsg = '';
                        this.EcHome.loadFlag.next(true);
                        this.EcHome.priceFlag.next(false);
                        this.EcHome.schedulePriceFlag.next({});
                        if (res.PortFolioID !== '') {
                            // this.multiPhoenixArr = this.apifunctions.BBVAGetPortfolioDetails(res.PortFolioID, 'AutocallablePhoenix');
                            this.multiPhoenixArr = this.EcHome.BBVAGetPortfolioDetails(res.PortFolioID);
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

Load() {
    try {
        this.strXMLArr = [];
        this.strXML = '';
        this.successMsg = '';
        this.ErrorMsg = '';
        this.multiPhoenixArr = [];
        this.EcHome.loadFlag.next(true);
        this.EcHome.priceFlag.next(false);
        this.EcHome.schedulePriceFlag.next({});
        this.EcHome.saveFlag.next(false);

        this.toggleDisabledFlag = false;
        this.EcHome.toggleVisiblityFlag.next([]);
        // this.subscription.unsubscribe();

        if (this.portfolio !== '') {
            // this.multiPhoenixArr = this.apifunctions.BBVAGetPortfolioDetails(this.portfolio, 'AutocallablePhoenix');
            this.multiPhoenixArr = this.EcHome.BBVAGetPortfolioDetails(this.portfolio);
            if (this.multiPhoenixArr.length > 0) {
                // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
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
                    //         this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix')].CPM_Format).toString().split(',');
                    //         this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix')].ActiveYN;
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

LoadPortfolio() {
    try {
        // const portfolioArr = this.apifunctions.BBVAGetPortfolio('', '', 'AutocallablePhoenix');
        const portfolioArr:any = this.EcHome.BBVAGetPortfolio(this.ProductName, 'FlexiPricer');
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
Delete() {
    try {
        if (this.portfolio !== '') {
            let portfolioDeleted = this.portfolioIdArr.filter((i) => { return i.P_ID === this.portfolio.toString() })[0]["P_Name"]; //added by Amogh K on 1-dec-2021
            // const res = this.apifunctions.BBVADeletePortfolio(this.portfolio, 'AutocallablePhoenix');
            const res = this.EcHome.BBVADeletePortfolio(this.portfolio, this.ProductName);
            if (res) {
                this.successMsg = 'Portfolio ' + portfolioDeleted + ' deleted successfully.';
                this.portfolio = '';
                this.PortFolioName = '';
                this.multiPhoenixArr = [];
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
            this.multiPhoenixArr = [];
            this.multiPhoenixArr.push({}); // load default row on blank protfolio || PriyaL || 28Apr2022 || Assigned by Pranav D
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

  pushChildComponent() {
    try {
        this.EcHome.multiPhoenixArr.next(this.multiPhoenixArr.length);

        this.multiPhoenixArr.push({});

    } catch (error) {
        //console.log('Error:', error);
    }
    return false;


}


deleteRow(rowindex: any) {
  try {
      if (this.multiPhoenixArr.length === 1) {
          return false;
      }
      this.ErrorMsg = '';
      this.successMsg = '';

      this.EcHome.multiPhoenixArr.next(this.multiPhoenixArr.length);
      this.EcHome.cloneFlag1.next(true);
      this.multiPhoenixArr.splice(rowindex, 1);
      this.EcCommon.deleteRowObserver.next('');
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
  this.EcHome.toggleFlag.next(this.toggleCheck);
  this.EcHome.toggleVisiblityFlag.next([]);
  this.EcHome.priceFlag.next(false);
  // this.apifunctions.schedulePriceFlag.next({});
  this.EcHome.saveFlag.next(false);
  // this.apifunctions.schedulePopupFlag.next(false);

  this.EcCommon.setsubmultiReceivedPrices({}, '');
  this.EcCommon.setsubmultiRCReceivedPrices({}, '');
  this.EcCommon.setsubmultiCreditReceivedPrices({}, '');
  this.EcCommon.setsubmultiPTCReceivedPrices({}, '');

}

onbehalfChange() {

  this.mappedformatlist = [];
  this.priceBtnActive = 'Y';

  // this.priceBtnActive = 'N';
  // this.GetClientProdDetailsArr = this.apifunctions.GetClientProdDetails(this.onBehalfOf);
  // if (this.GetClientProdDetailsArr !== undefined && this.GetClientProdDetailsArr.length > 0) {
  //     if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix') > -1) {
  //         this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix')].CPM_Format).toString().split(',');
  //         // this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'Autocall Phoenix')].ActiveYN;
  //         //console.log(this.mappedformatlist, this.priceBtnActive);
  //     } else{
  //         if (this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All') > -1) {
  //           this.mappedformatlist = (this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].CPM_Format).toString().split(',');
  //         //   this.priceBtnActive = this.GetClientProdDetailsArr[this.GetClientProdDetailsArr.findIndex(record => record.CPM_Product === 'All')].ActiveYN;
  //           //console.log(this.mappedformatlist, this.priceBtnActive);
  //         }
  //       }
  // }


  this.toggleDisabledFlag = false;
  this.EcHome.toggleVisiblityFlag.next([]);
  // this.subscription.unsubscribe();
  this.EcHome.priceFlag.next(false);
  this.EcHome.schedulePriceFlag.next({});
  this.EcHome.saveFlag.next(false);
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
      this.EcHome.schedulePopupFlag.next(true);
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
      this.EcHome.schedulePopupFlag.next(false);

  } catch (error) {
      //console.log('Error:', error);
  }
  return false;
}

showsaveSharePopup() {
  try {
      if (this.PortFolioName === '') {
          this.ErrorMsg = 'Please enter portfolio name.';
          this.successMsg = '';
          this.showsaveSharePopupFlag = false;
          return false;
      }
      this.EcHome.schedulePopupFlag.next(true);
      if (this.ErrorMsg === '') {
          if (this.portfolio === '') {
              this.generateXML(true);
          }
          else {
              this.generateXML(false);
              const res : any= this.EcHome.getPortfolioSharingList(this.portfolio);
              if (res) {
                  for (let i = 0; i < res.length; i++) {
                      if (this.userBasket.find(i => i.Code === res.User) === undefined) {
                          this.userBasket.push({ 'Code': res[i].User, 'Name': res[i].Name, 'Type': res[i].UserType, 'Access': res[i].AccessDetail, 'NewAddFlag': false });
                          //console.log(this.userBasket);
                      }
                  }
              }
          }
          this.currentowner = (this.EcCommon.getLoggedInUserName())[0].UserId;

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
      if (this.saveportfolioId !== '') {
          this.successMsg = 'Portfolio ' + this.PortFolioName + ' saved and shared successfully.';

          this.saveportfolioId = '';
          this.userBasket = [];
          this.EcHome.schedulePopupFlag.next(false);
      }
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
    console.log(e)
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
      console.log(event);
      if (this.userBasket.find(i => i.Code === item.Code) === undefined) {
          this.userBasket.push({ 'Code': item.Code, 'Name': item.Name, 'Type': item.Type, 'Access': 'VIEW', 'NewAddFlag': true });
      }
  } catch (error) {
      //console.log('Error:', error);
  }
}

ChangeIndex(e) {
  try {
    console.log(e)
      this.selectedShareIndex = 0;
      this.userflag = true;
      this.userCode = '';
      this.selectedBIndex = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
  } catch (Error) {
  }
}

changeAccessofUserGroup(e: Event, index: any) {
  const target = this.EcCommon.GetEventTarget(e);
  let res: any;
  //console.log(target.value);

  this.userBasket[index]['Access'] = target.value;

}

sharePortfolio() {
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
      const res = this.EcHome.InsertPortfolioSharing(this.currentowner, [], groupView, this.saveportfolioId, userEdit, userView, [], []);
      if (res) {
          this.successMsg = 'Portfolio ' + this.PortFolioName + ' saved and shared successfully.';
          this.saveportfolioId = '';
          this.userBasket = [];
          this.showsaveSharePopupFlag = false;
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
      const res = this.EcHome.InsertPortfolioSharing(this.currentowner, [],
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
      setTimeout(() => {
          // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
          // if (this.onBehalfOf === '') {
          //     this.ErrorMsg = 'No client is  mapped for this user. Request cannot be placed.';
          //     $('#loading').hide();
          //     return false;
          // } else {
          //     this.ErrorMsg = '';
          // }

          if (!this.EcCommon.validTime(this.EcCommon.getInputTime(this.inputTime))) {
              this.ErrorMsg = 'Please enter valid time in hh:mm (am/pm) format';
              $('#loading').hide();
              return false;
          } else {
              this.ErrorMsg = '';
          }
          if (this.multiPhoenixArr.length > 0) {
              if (this.ErrorMsg === '') {

                  // this.apifunctions.setUserGroupID(this.onBehalfOf);
                  this.portfolioGroupID = this.EcHome.fnportfolioGroupID();
                  this.EcHome.setportfolioGroupID(this.portfolioGroupID);
                  this.EcHome.schedulePriceFlag.next({ Date: this.inputDate, Time: this.inputTime });
              }
          }
      });
  } catch (error) {
      //console.log('Error:', error);
  }
  return false;
}




}
