import { Component, OnInit, Input, ViewChild, OnChanges, ElementRef } from '@angular/core';

import { Moment } from 'moment';
// import {folder} from ''
import * as moment from 'moment';
// import { SearchUnderlyingPipe } from '../equity/pipes/search-underlying.pipe';
import { DatePipe, formatDate } from '@angular/common';
import {FilterPipe} from '../../pipe/filter.pipe'
import { environment } from 'src/environments/environment';
import { EcHomeService } from '../../services/ec-home.service';
import { EcCommonService } from '../../services/ec-common.service';
import { WorkbenchServiceService } from '../../services/workbench-service.service';
import { log } from 'console';
import { ActivatedRoute } from '@angular/router';

declare var require: any;
// declare var $: any;
const $: any = require('jquery');

interface AttachmentFilesModel {
  Filename: string;
  Link: string;
}

@Component({
  selector: 'app-ec-workbench',
  templateUrl: './ec-workbench.component.html',
  styleUrls: ['./ec-workbench.component.scss']
})

export class EcWorkbenchComponent implements OnInit {
  // @ViewChild('showOptions') showOptions;
  // @ViewChild('productInfo') productInfo;
  // @ViewChild('folderlistDiv') folderlistDiv;
  @Input() RMWBondProductDetailsArr: any[];
  @Input() popupFlag: any;
  @Input() ListName: any;
  @ViewChild('focusable', { static: false }) namefield: ElementRef;


  prevQuoteLaunchPopUp = false;
  productfilter: any;
  sortBy: any;
  sortOrder: any;
  // rowsperpage: any;
  pageIndex: any;
  pageSize: any;
  //Added by Amogh K 9-mar-2022
  pageStart:number = 0;
  pageEnd:number;

  ddlNoteCcy: any;
  template: any;
  UnderlyingCurrency = 'All';
  CCY:any = [];
  ReceivedCCY: any;
  // interfaceUrl = environment.euroconnectURL; //Rajesh C,Prasad G || 04-04-023 
  folderName: any;
  search: any = '';

  RMWBondProductDetailsArr1: any[];
  isProd = environment.production;
  showOptionsFlag = false;
  classApplied = false;
  currentItemsToShow: any;
  productInfoFlag = false;
  ProductDetailsArr: any;
  NoteMasterID: any = '';
  ISIN: any = '';

  // attachment variables;
  attachmentCount: number;
  attachmentFiles: AttachmentFilesModel[] = [];
  showAttachmentsPopup = false;
  showFolderPopupFlag = false;
  showmoredetailspopupFlag=false;
  folderlist: any;
  folderlist1: any =[];  //Added by AdilP @19-04-2023
  allFolderList :any = []; //Added by AdilP @19-04-2023
  publicListArr: any;
  successMsg = '';
  errorMsg = '';
  docurl = environment.interfaceURL;
  totalcount: any;
  asseturl = environment.asseturl;
  // filters

  publicList: any;
  privateList: any;
  filterISIN: any;
  filterIssuer: any;
  maturityFrom: any;
  maturityTo: any;
  publicFlag = false;
  privateFlag = false;
  filterCriteria: any = '';
  ListType; any = '';
  likeChk = false;

  orderPopupFlag = false;
  orderData: any = [];
  Notional: any;
  minCoupon: any;
  estNotional: any;
  ordererrorMsg: any;
  ordersuccessMsg: any;
  RM: any;
  AdvReason: any;
  customerID: any;
  bookOrderRes: any = [];
  orderUpfront: any;
  internalRefNumber: any;
  poolExpiryDate: any;
  minPoolNotional: any;
  maxPoolNotional: any;
  minOrderSize: any;
  Denomination: any;
  successMessage: boolean;
  errorMessage: boolean;
  ErrorMsgTop = '';
  addFolder = false;
  fName = '';
  showviewOrderPopupFlag = false;
  finalCoupon: any = '';
  finalCouponflag = false;
  viewOrderData: any = [];

  custName = '';
  // custDetails : any;
  customerList: any;
  EntityCode: any;
  AQDQFlag = false;
  poolType = '';
  //Added by ApurvaK for view attchamnet |16 Nov 2021
  showAttahmentflag: boolean = false;
  // attachmentName: any;
  ViewAttachmentRes: any;
  // Added by JyotiS
  noOfRecords: any;

  //Added by AdilP
  showDocsPopup: boolean = false;
  docsData: Object[] = [];
  docsPopupLabels: Object[] = [];
  docsView = "VIEW"

  solveForLabelArray1 = {
    'IBPrice': 'Min Price(%)',
    'KO': 'Min Autocall Trigger',
    'RebateCoupon': 'Min Autocall Coupon',
    'CouponBarrier': 'Min Coupon Trigger',
    'Coupon': 'Min Coupon (%)',
    'Strike': 'Min Strike (%)',
    'KI': 'Min Barrier Level(%)',
    'FundingRate': 'Min Rate/Spread (%)',
    'Reoffer': 'Min Reoffer',

    'CallGearing': 'Call Gearing (%)',
    'LowerCallGearing': 'Call Spread Gearing (%)',
    'CallStrike': 'Call Strike (%)',
    'ERCoupon': 'Autocall Coupon (%)',
    'LowerCallStrike': 'Lower Call Strike (%)',
    'LowerCouponBarrier': 'Lower Coupon Barrier (%)',
    'LowerPutStrike': 'Lower Put Strike (%)',
    'Multiplier': 'Multiplier (%)',
    'ProtectionLevel': 'Protection Level (%)',
    'PutStrike': 'Put Strike (%)',
    'Spread': 'Spread (%)',
    'Upfront': 'Upfront Fee (%)',
    'UpperCallStrike': 'Upper Call Strike (%)',
    'UpperPutStrike': 'Upper Put Strike (%)'
  }
  solveForLabelArrayNew = {
    'IBPrice': ['Max', 'Price(%)'],
    // 'KO': ['Max','Max Autocall Trigger'],
    'KO': ['Max', 'Autocall Barrier'],
    'RebateCoupon': ['Min', 'Autocall Coupon'],
    // 'CouponBarrier': ['Min','Min Coupon Trigger'],
    'CouponBarrier': ['Max', 'Coupon Barrier'],
    'Coupon': ['Min', 'Coupon (%)'],
    'Strike': ['Max', 'Strike (%)'],
    // 'KI': ['Max','Max Barrier Level(%)'],
    'KI': ['Max', 'KI Barrier (%)'],
    'FundingRate': ['Min', 'Rate/Spread (%)'],
    'Reoffer': ['Min', 'Reoffer'],

    'CallGearing': ['Min', 'Call Gearing (%)'],
    'LowerCallGearing': ['Min', 'Call Spread Gearing (%)'],
    'CallStrike': ['Max', 'Call Strike (%)'],
    'ERCoupon': ['Min', 'Autocall Coupon (%)'],
    'LowerCallStrike': ['Min', 'Lower Call Strike (%)'],
    'LowerCouponBarrier': ['Min', 'Lower Coupon Barrier (%)'],
    'LowerPutStrike': ['Min', 'Lower Put Strike (%)'],
    'Multiplier': ['Min', 'Multiplier (%)'],
    'ProtectionLevel': ['Min', 'Protection Level (%)'],
    'PutStrike': ['Max', 'Put Strike (%)'],
    'Spread': ['Min', 'Spread (%)'],
    'Upfront': ['Min', 'Upfront Fee (%)'],
    'UpperCallStrike': ['Min', 'Upper Call Strike (%)'],
    'UpperPutStrike': ['Min', 'Upper Put Strike (%)']
  }

  showCustDetails = false;
  showRMDetails = false;
  // checkLoginBookName = false;
  // fetchOnBehalfOf = false;
  showOnBehalfOf = false;

  showMinMaxSolveFor = false;
  isDealer = true;
  Dealervalue
  onBehalfOf = "";
  disabledSubscribeBtn = false;
  pageTitle: any;
  pageloadflag = true; //Added by AdilP || FIN1EURINT-282

  constructor(public api: EcHomeService, public cfs: EcCommonService, public elem: ElementRef, public datepipe: DatePipe, public EcWorkbench : WorkbenchServiceService,private route: ActivatedRoute) {

    // this.RMWBondProductDetailsArr1 = this.RMWBondProductDetailsArr;
    this.ddlNoteCcy = 'All';
    this.UnderlyingCurrency = 'All';
    this.RMWBondProductDetailsArr = [];
    this.RMWBondProductDetailsArr1 = [];
    this.successMessage = false;
    this.errorMessage = false;
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges() {
    this.pageloadflag = true;
    this.sortBy = 'Product_Name';
    this.sortOrder = 'asc';
    // this.rowsperpage = 50;
    this.productfilter = '';
    this.pageIndex = 0;
    this.pageSize = 5;
    this.pageStart = 0;
    this.template = '';
    this.RMWBondProductDetailsArr1 = this.RMWBondProductDetailsArr;
    this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(0, this.pageSize);
    this.totalcount = this.RMWBondProductDetailsArr.length;
    this.pageloadflag = false;
  }

  payoffListQL = [];
  payOffListSorted = [];
  RMList = [];
  validationArr: any;
  ngOnInit(): void {

    $('#loading').show();
    //  this.route.params.subscribe
    // (async params => {
    // this.pageTitle = params.pageTitle;
  	// }); //Added by Jyoti S || 05-May-2023
    this.pageTitle = history.state.pageTitle;//Added by Jyoti S || 25-May-2023
    this.pageloadflag = true; // Added by AdilP
    setTimeout(async () => {

      if (this.api.rmList === undefined || this.api.rmList.length <= 0) {
        this.api.Get_RMList();
      }
      this.RMList = this.api.rmList;

      if (this.api.validationArr === undefined || this.api.validationArr.length <= 0) {
        this.validationArr = this.api.BBVAFetchValidation('EQ');
      } else {
        this.validationArr = this.api.validationArr;
      }

      if (this.validationArr && this.validationArr.length > 0) {
        for (let i = 0; i < this.validationArr.length; i++) {
          const configVal = this.validationArr[i].Config_Value === '' ? this.validationArr[i].Default_Value : this.validationArr[i].Config_Value;
          switch (this.validationArr[i].Setting_Name) {
            case 'EQ_Show_Order_Customer':
              //console.log(this.validationArr[i]);
              if (this.validationArr[i].Entity_Id === (this.cfs.getLoggedInUserName())[1].EntityId) {
                this.showCustDetails = configVal === 'Yes' || configVal === 'YES' ? true : false;
              }
              break;
            case 'EQ_Show_Order_RM':
              //console.log(this.validationArr[i]);
              if (this.validationArr[i].Entity_Id === (this.cfs.getLoggedInUserName())[1].EntityId) {
                this.showRMDetails = configVal === 'Yes' || configVal === 'YES' ? true : false;
              }
              //console.log(this.showRMDetails);
              break;
            case 'EQ_Login_Client_Mapping':
              //console.log(this.validationArr[i]);
              if (this.validationArr[i].Entity_Id === (this.cfs.getLoggedInUserName())[1].EntityId) {
                // this.isDealer = this.validationArr[i].Default_Value === 'Yes' || this.validationArr[i].Default_Value === 'YES' ? true : false;
                // this.fetchOnBehalfOf = configVal === 'Yes' || configVal === 'YES' ? false : true;
                // this.isDealer = configVal === 'Yes' || configVal === 'YES' ? false : true;
                this.showOnBehalfOf = configVal === 'Yes' || configVal === 'YES' ? true : false;
                // this.showOnBehalfOf = true;
                // if(!this.fetchOnBehalfOf){
                //   this.isDealer = true;
                // }
              }
              break;
          }
        }
      }
      if (this.showOnBehalfOf) {
        this.Dealervalue = await this.api.checkLoginBookName();
        this.isDealer  = this.Dealervalue
        // if (this.showOnBehalfOf) {
          // this.api.checkLoginBookName(); //checkLoginBookNameResult
          if (this.api.allBooksData === undefined || this.api.allBooksData.length <= 0) {
            // if (this.api.MappedUsersAndGroupsArr === undefined || this.api.MappedUsersAndGroupsArr.length <= 0) {
            this.api.getAllBooksMappedToLogin();
            
            // //console.log(this.api.allBooksData);
            //  this.isDealer = false;
            // this.api.GetMappedUsersAndGroups();

            // this.allBooksData = this.api.getAllBooksMappedToLogin();
          // }
        }
        this.onBehalfOf = this.api.allBooksData[0].BookCode

      }

/*
      if (this.api.showCustomerConfig === undefined || this.api.showCustomerConfig.length <= 0) {
        this.api.GetEntityConfig("EQC_Allow_BasketELN_YN");
      }

      //console.log(this.api.showCustomerConfig);
      if (this.api.showCustomerConfig.length > 0 && (this.api.showCustomerConfig[0].Config_Value === 'Yes' || this.api.showCustomerConfig[0].Config_Value === 'YES')) {
        this.showCustDetails = true;
      }
*/

      if (this.api.payOffList === undefined || this.api.payOffList.length <= 0) {
        await this.api.getPayOffList();
      }
      this.payoffListQL = [];
      this.api.payOffList.forEach(item => {
        if (item.display === true) {
          this.payoffListQL.push(item.auditTProductType);
        }
      });
      this.payOffListSorted = [];
      this.api.payOffList.forEach(element => this.payOffListSorted.push(element));
      // this.payOffListSorted.sort((a, b) => (a.displayName > b.displayName) ? 1 : -1);

      const res = await this.api.GetEntityCode();

      // this.EntityCode = res;
      this.EntityCode = res['entityId'];
      this.customerList = await this.api.getCustomerList();//Rajesh C,Prasad G || 04-04-023 
      //console.log(this.customerList);

      this.attachmentCount = 0;
      this.sortBy = 'Product_Name';
      this.sortOrder = 'asc';
      this.productfilter = '';
      this.pageIndex = 0;
      this.pageSize = 5;
      this.pageStart = 0;
      this.template = '';
      this.filterCriteria = '';


      const Dates:any = await this.api.BBVAGetDates('', '3B', '');//Rajesh C,Prasad G || 04-04-023 
      if (Dates) {
        this.poolExpiryDate = Dates.MaturityDate + ' ' + moment().format('hh:mm:ss A');

      }



      // this.minPoolNotional = '200,000.00';
      // this.maxPoolNotional = '3,000,000.00';
      // this.minOrderSize = '1,000,000.00';
      // this.Denomination = '100,000.00';

      // this.api.BBVALoadCCY().subscribe((data:any)=>{
      //   this.CCY = data.Get_CcyList_JSONResult;
      // });
      this.CCY =  await this.api.BBVALoadCCY()//Rajesh C,Prasad G || 04-04-023 
      if (this.popupFlag) {
        this.RMWBondProductDetailsArr1 = this.RMWBondProductDetailsArr;
        this.totalcount = this.RMWBondProductDetailsArr.length;
        this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(0, 5);
        this.pageloadflag = false;
        for(let i=0;i<this.currentItemsToShow.length;i++){
          if (parseFloat(this.currentItemsToShow[i].TotalDeals) >= parseFloat(this.currentItemsToShow[i].Maximum_Issue_Size)) {
            this.currentItemsToShow[i].disabledSubscribeBtn = true;
          } else {
            this.currentItemsToShow[i].disabledSubscribeBtn = false;
          }
         
        }
        // this.templateChange();
        this.publicList = this.ListName;
        this.listChange();
      } else {

        // this.folderName = 'Fed List';
        await this.templateChange();  //await Added by RajeshC & AdilP
        const str = await this.generatefilterstr();
        this.folderName = this.ListName;
        const res : any = await this.EcWorkbench.GetRMWProductDetails(this.template, this.productfilter, this.ddlNoteCcy, this.sortBy + ' ' + this.sortOrder, '\'AutocallablePhoenix\',\'ReverseConvertible\',\'Participation\',\'CreditTranche\',\'ACC\',\'DAC\',\'EQC_Europe\',\'YieldEnhancement\'', this.pageSize, this.folderName, this.pageIndex + 1, str
          , this.filterCriteria, this.ListType, 'Y', this.EntityCode, this.likeChk ? 'Y' : '');
        if (res && res.items && res.items.length > 0) {
          this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
          //Added by AdilP @14-04-2023 to resolve DatePipe Issue
          {
            this.RMWBondProductDetailsArr.forEach(d => {
              if (!(d.Close_Date instanceof Date && !isNaN(d.Close_Date))) {
                //if date dont need bottom logic
                if (d.Close_Date) {
                  // let parts = d.Close_Date.match(/\d+/g)
                  // let closeDate = new Date(parts[2], parts[1] - 1, parts[0]);
                  let closeDate = new Date(d.Close_Date); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                  d.Close_Date = closeDate;
                }
              }
              if (!(d.ER_MaturityDate instanceof Date && !isNaN(d.ER_MaturityDate))) {
                //if date dont need bottom logic
                if (d.ER_MaturityDate) {
                  // let parts = d.ER_MaturityDate.match(/\d+/g)
                  // let maturityDate = new Date(parts[2], parts[1] - 1, parts[0]);
                  let maturityDate = new Date(d.ER_MaturityDate); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                  d.ER_MaturityDate = maturityDate;
                }
              }
              if (!(d.ER_SettlmentDate instanceof Date && !isNaN(d.ER_SettlmentDate))) {
                //if date dont need bottom logic
                if (d.ER_SettlmentDate) {
                  // let parts = d.ER_SettlmentDate.match(/\d+/g)
                  // let SettlmentDate = new Date(parts[2], parts[1] - 1, parts[0]);
                  let SettlmentDate = new Date(d.ER_SettlmentDate); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                  d.ER_SettlmentDate = SettlmentDate;
                }
              }
              if (!(d.open_date instanceof Date && !isNaN(d.open_date))) {
                //if date dont need bottom logic
                if (d.open_date) {
                  // let parts = d.open_date.match(/\d+/g)
                  // let OpenDate = new Date(parts[2], parts[1] - 1, parts[0]);
                  let OpenDate = new Date(d.open_date); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                  d.open_date = OpenDate;
                }
              }
            })

          }

          this.totalcount = res.Count;
          this.RMWBondProductDetailsArr1 = this.RMWBondProductDetailsArr;
          this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(0, 5);
          this.pageloadflag = false;
          for(let i=0;i<this.currentItemsToShow.length;i++){
            if (parseFloat(this.currentItemsToShow[i].TotalDeals) >= parseFloat(this.currentItemsToShow[i].Maximum_Issue_Size)) {
              this.currentItemsToShow[i].disabledSubscribeBtn = true;
            } else {
              this.currentItemsToShow[i].disabledSubscribeBtn = false;
            }
           
          }
          //console.log(this.currentItemsToShow);
        }else{
          this.pageloadflag = false;
        }

      }

      //Added by Amogh K | 8-mar-2022
      this.pageEnd = (this.pageIndex * this.pageSize + parseInt(this.pageSize) )<=this.totalcount ? (this.pageIndex * this.pageSize +  parseInt(this.pageSize)):this.totalcount;
    });
    this.api.prevQuoteLaunchPopUpRMWObs.subscribe((res: any) => {
      this.prevQuoteLaunchPopUp = res[0];
    });

    this.EcWorkbench.backTestPopUpObs.subscribe((res: boolean) => {
      this.backTestPopUp = res;
      //console.log(this.backTestPopUp);
    });

    this.EcWorkbench.lifecyclePopUpObs.subscribe((res: boolean) => {
      this.lifecyclePopUp = res;
      //console.log(this.lifecyclePopUp);
    });


  }

  calculateYears(Maturity: any, Issue: any) {
    const diff = Math.abs(new Date(Maturity).getFullYear() - new Date(Issue).getFullYear());
    return diff;
  }
  onClickedOutside(e: Event, i: string) {
    console.log(e)
    document.getElementById('profile' + i).style.visibility = 'hidden';

  }
  showOptionPopup(i: string) {
    document.getElementById('profile' + i).style.visibility = 'visible';
  }

  txtSearch() { //changed by Amogh K 9-mar-2022
    $('#loading').show();
    this.pageloadflag = true;
    setTimeout(async () => {
      let lType = '';
      this.folderName = '';
      //console.log(this.ListName);
      if (this.ListName !== undefined && this.ListName !== '') {
        this.folderName = this.ListName;
        lType = 'Public';
        //console.log(lType);
      }
      if (this.ListType !== undefined && this.ListType !== '') {
        lType = this.ListType;
      }
      //console.log(lType);
      this.pageIndex = 0;
      this.pageStart = 0;
      
      this.RMWBondProductDetailsArr = [];
      this.totalcount = 0;
      let templateCode = '';
      if (this.template === '') {
        templateCode = '(\'AutocallablePhoenix\',\'ReverseConvertible\',\'Participation\',\'CreditTranche\',\'ACC\',\'DAC\',\'EQC_Europe\',\'YieldEnhancement\')';
      } else {
        templateCode = '(\'' + this.template + '\')';
      }
      // Added by AdilP @16-06-2023 || FIN1EURINT-477
      if(!this.search || this.search == ''){
        return ;
      }
      const str = this.generatefilterStrForSearch(this.search);
      const res = await this.EcWorkbench.GetRMWProductDetails('', this.productfilter, this.ddlNoteCcy, this.sortBy + ' ' + this.sortOrder, '\'' +
      this.template + '\'', this.pageSize, this.folderName, this.pageIndex + 1, str, this.filterCriteria, lType, 'Y', this.EntityCode, this.likeChk ? 'Y' : '');
      // const res: any = await this.EcWorkbench.GetRMWProductDetailsGenericFilter(this.search, this.pageIndex + 1, this.pageSize,
      //   templateCode, this.folderName, lType, this.popupFlag ? 'N' : 'Y', this.EntityCode);
      if (res && res.items !== null && res.items !== undefined) {
        this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
        //Added by AdilP @14-04-2023 to resolve DatePipe Issue
        {
          this.RMWBondProductDetailsArr.forEach(d => {
            if (!(d.Close_Date instanceof Date && !isNaN(d.Close_Date))) {
              //if date dont need bottom logic
              if (d.Close_Date) {
                // let parts = d.Close_Date.match(/\d+/g)
                // let closeDate = new Date(parts[2], parts[1] - 1, parts[0]);
                let closeDate = new Date(d.Close_Date); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                d.Close_Date = closeDate;
              }
            }
            if (!(d.ER_MaturityDate instanceof Date && !isNaN(d.ER_MaturityDate))) {
              //if date dont need bottom logic
              if (d.ER_MaturityDate) {
                // let parts = d.ER_MaturityDate.match(/\d+/g)
                // let maturityDate = new Date(parts[2], parts[1] - 1, parts[0]);
                let maturityDate = new Date(d.ER_MaturityDate); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                d.ER_MaturityDate = maturityDate;
              }
            }
            if (!(d.ER_SettlmentDate instanceof Date && !isNaN(d.ER_SettlmentDate))) {
              //if date dont need bottom logic
              if (d.ER_SettlmentDate) {
                // let parts = d.ER_SettlmentDate.match(/\d+/g)
                // let SettlmentDate = new Date(parts[2], parts[1] - 1, parts[0]);
                let SettlmentDate = new Date(d.ER_SettlmentDate); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                d.ER_SettlmentDate = SettlmentDate;
              }
            }
            if (!(d.open_date instanceof Date && !isNaN(d.open_date))) {
              //if date dont need bottom logic
              if (d.open_date) {
                // let parts = d.open_date.match(/\d+/g)
                // let OpenDate = new Date(parts[2], parts[1] - 1, parts[0]);
                let OpenDate = new Date(d.open_date); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                d.open_date = OpenDate;
              }
            }
          })

        }
        this.totalcount = res.Count;
        this.RMWBondProductDetailsArr1 = this.RMWBondProductDetailsArr;
        this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(0, this.pageSize);
        this.pageloadflag = false;
        this.pageIndex = 0;
        this.pageStart = 0;
        this.pageEnd = (this.pageIndex * this.pageSize + parseInt(this.pageSize) )<=this.totalcount ? (this.pageIndex * this.pageSize +  parseInt(this.pageSize)):this.totalcount;
        this.classApplied = false;
        //this.onPageChange({'pageNo':this.pageIndex,'pageSize':this.pageSize,'reload':true, 'length':this.totalcount})
      }
      else{
        this.totalcount = 0;
        this.pageloadflag = false;
        this.currentItemsToShow = [];
        //this.onPageChange({'pageNo':this.pageIndex,'pageSize':this.pageSize,'reload':true, 'length':this.totalcount})
      }
      this.search='';

    });
  }
  //function Added by AdilP @16-06-2023 || FIN1EURINT-477
  generatefilterStrForSearch(searchStr: String){
    try {
      this.filterCriteria = '';
    let wherestr = ' Where ';
    if (this.template === '') {
      var wherestr2 = ' Template_Code in (\'' + this.payoffListQL.join('\',\'') + '\')'
      wherestr = wherestr + wherestr2;
    } else {
      wherestr = wherestr + ' Template_Code in (\'' + this.template + '\')';
    }

    if (searchStr !== '') {
      wherestr = wherestr + ' and Product_Name like \'%' + searchStr + '%\'';
    }
    
    return wherestr;
    } catch (error) {
      console.log(error)
    }
  }

// Added by AdilP || @11-05-2023 || FIN1EURINT-313
clickoutsideSearchPopup(){
  this.classApplied = false;
}

  showsearchPopup() {
    this.search = '';
    this.classApplied = !this.classApplied;
  }

  hidefilter() {
    this.classApplied = false;
    return false;
  }
// Async await added by Rajesh & AdilP @10-04-2023
  async applyFilter() {
    $('#loading').show();
    this.pageloadflag = true;
    setTimeout(async () => {
      const str = this.generatefilterstr();
      let lType = '';
      this.folderName = '';
      // //console.log(this.ListName);
      if (this.ListName !== undefined && this.ListName !== '') {
        this.folderName = this.ListName;
        lType = 'Public';
        //console.log(lType);
      }
      if (this.ListType !== undefined && this.ListType !== '') {
        lType = this.ListType;
      }

      this.RMWBondProductDetailsArr = [];
      this.totalcount = 0;
      // this.folderName = 'Fed List';
      // lType = 'Public';
      const res : any = await this.EcWorkbench.GetRMWProductDetails('', this.productfilter, this.ddlNoteCcy, this.sortBy + ' ' + this.sortOrder, '\'' +
        this.template + '\'', this.pageSize, this.folderName, this.pageIndex + 1, str, this.filterCriteria, lType, 'Y', this.EntityCode, this.likeChk ? 'Y' : '');
      // //console.log(res.items);
      if (res && res.items !== null && res.items !== undefined) {
        this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
        //Added by AdilP @14-04-2023 to resolve DatePipe Issue
        {
          this.RMWBondProductDetailsArr.forEach(d => {
            if (!(d.Close_Date instanceof Date && !isNaN(d.Close_Date))) {
              //if date dont need bottom logic
              if (d.Close_Date) {
                // let parts = d.Close_Date.match(/\d+/g)
                // let closeDate = new Date(parts[2], parts[1] - 1, parts[0]);
                let closeDate = new Date(d.Close_Date); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                d.Close_Date = closeDate;
              }
            }
            if (!(d.ER_MaturityDate instanceof Date && !isNaN(d.ER_MaturityDate))) {
              //if date dont need bottom logic
              if (d.ER_MaturityDate) {
                // let parts = d.ER_MaturityDate.match(/\d+/g)
                // let maturityDate = new Date(parts[2], parts[1] - 1, parts[0]);
                let maturityDate = new Date(d.ER_MaturityDate); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                d.ER_MaturityDate = maturityDate;
              }
            }
            if (!(d.ER_SettlmentDate instanceof Date && !isNaN(d.ER_SettlmentDate))) {
              //if date dont need bottom logic
              if (d.ER_SettlmentDate) {
                // let parts = d.ER_SettlmentDate.match(/\d+/g)
                // let SettlmentDate = new Date(parts[2], parts[1] - 1, parts[0]);
                let SettlmentDate = new Date(d.ER_SettlmentDate); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                d.ER_SettlmentDate = SettlmentDate;
              }
            }
            if (!(d.open_date instanceof Date && !isNaN(d.open_date))) {
              //if date dont need bottom logic
              if (d.open_date) {
                // let parts = d.open_date.match(/\d+/g)
                // let OpenDate = new Date(parts[2], parts[1] - 1, parts[0]);
                let OpenDate = new Date(d.open_date); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                d.open_date = OpenDate;
              }
            }
          })

        }
        this.totalcount = res.Count;
      }else{
        this.totalcount = 0;
        this.currentItemsToShow =[];
        this.pageloadflag = false;
        return
      }

      this.RMWBondProductDetailsArr1 = this.RMWBondProductDetailsArr;
      this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(0, this.pageSize);
      this.pageloadflag = false;
      //console.log(this.currentItemsToShow);
      //Changed by Amogh K | 8-mar-2022
      this.pageIndex = 0;
      this.pageStart = 0;
      this.pageEnd = (this.pageIndex * this.pageSize + parseInt(this.pageSize) )<=this.totalcount ? (this.pageIndex * this.pageSize +  parseInt(this.pageSize)):this.totalcount;
      this.classApplied = false;
      $('#loading').hide();
    });
    return false;
  }



  onPageChange($event) {
    this.pageloadflag = true;
    //Pagination changed by Jyoti S || 14-Apr-2023
    this.classApplied = false;
    this.noOfRecords = $event.length;
    let x = $event.pageNo * $event.pageSize;
    if (x > this.noOfRecords || $event.reload) {
      this.pageIndex = 0;
    }
    else if (x < 0) {
      this.pageIndex = Math.floor(this.noOfRecords / $event.pageSize);
    }
    else {
      this.pageIndex = $event.pageNo;

    }
    this.pageStart = (this.pageIndex * this.pageSize);
    this.pageEnd = ((this.pageIndex + 1) * this.pageSize) >= this.noOfRecords
      ? this.noOfRecords : ((this.pageIndex + 1) * this.pageSize);
    this.pageSize = $event.pageSize;
    let lType = '';
    this.folderName = '';
    //console.log(this.ListName);
    if (this.ListName !== undefined && this.ListName !== '') {
      this.folderName = this.ListName;
      lType = 'Public';
      //console.log(lType);
    }
    if (this.ListType !== undefined && this.ListType !== '') {
      lType = this.ListType;
    }

    $('#loading').show();
    setTimeout(async () => {

      if (this.search !== '') {
        this.RMWBondProductDetailsArr = [];
        this.totalcount = 0;
        let templateCode = '';
        if (this.template === '') {
          templateCode = '(\'AutocallablePhoenix\',\'ReverseConvertible\',\'Participation\',\'CreditTranche\',\'ACC\',\'DAC\',\'EQC_Europe\',\'YieldEnhancement\')';
        } else {
          templateCode = '(\'' + this.template + '\')';
        }
        const res: any = await this.EcWorkbench.GetRMWProductDetailsGenericFilter(this.search, this.pageIndex + 1, this.pageSize,
          templateCode, this.folderName, this.ListType, this.popupFlag ? 'N' : 'Y', this.EntityCode);
        if (res.items !== null && res.items !== undefined) {
          this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
          //Added by AdilP @14-04-2023 to resolve DatePipe Issue
          {
            this.RMWBondProductDetailsArr.forEach(d => {
              if (!(d.Close_Date instanceof Date && !isNaN(d.Close_Date))) {
                //if date dont need bottom logic
                if (d.Close_Date) {
                  // let parts = d.Close_Date.match(/\d+/g)
                  // let closeDate = new Date(parts[2], parts[1] - 1, parts[0]);
                  let closeDate = new Date(d.Close_Date); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                  d.Close_Date = closeDate;
                }
              }
              if (!(d.ER_MaturityDate instanceof Date && !isNaN(d.ER_MaturityDate))) {
                //if date dont need bottom logic
                if (d.ER_MaturityDate) {
                  // let parts = d.ER_MaturityDate.match(/\d+/g)
                  // let maturityDate = new Date(parts[2], parts[1] - 1, parts[0]);
                  let maturityDate = new Date(d.ER_MaturityDate); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                  d.ER_MaturityDate = maturityDate;
                }
              }
              if (!(d.ER_SettlmentDate instanceof Date && !isNaN(d.ER_SettlmentDate))) {
                //if date dont need bottom logic
                if (d.ER_SettlmentDate) {
                  // let parts = d.ER_SettlmentDate.match(/\d+/g)
                  // let SettlmentDate = new Date(parts[2], parts[1] - 1, parts[0]);
                  let SettlmentDate = new Date(d.ER_SettlmentDate); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                  d.ER_SettlmentDate = SettlmentDate;
                }
              }
              if (!(d.open_date instanceof Date && !isNaN(d.open_date))) {
                //if date dont need bottom logic
                if (d.open_date) {
                  // let parts = d.open_date.match(/\d+/g)
                  // let OpenDate = new Date(parts[2], parts[1] - 1, parts[0]);
                  let OpenDate = new Date(d.open_date); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                  d.open_date = OpenDate;
                }
              }
            })

          }


          this.totalcount = res.Count;
        }
      } else {
        let str = '';
        // if (this.popupFlag) {
        str = this.generatefilterstr();
        // }


        this.RMWBondProductDetailsArr = [];
        this.totalcount = 0;
        // this.folderName = 'Fed List';
        // lType = 'Public';
        const res: any = await this.EcWorkbench.GetRMWProductDetails('', this.productfilter, this.ddlNoteCcy, this.sortBy + ' ' + this.sortOrder, '\''
          + this.template + '\'', this.pageSize, this.folderName, this.pageIndex + 1, str, this.filterCriteria, lType, 'Y', this.EntityCode, this.likeChk ? 'Y' : '');
        if (res && res.items !== null && res.items !== undefined) {
          this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
          //Added by AdilP @14-04-2023 to resolve DatePipe Issue
          {
            this.RMWBondProductDetailsArr.forEach(d => {
              if (!(d.Close_Date instanceof Date && !isNaN(d.Close_Date))) {
                //if date dont need bottom logic
                if (d.Close_Date) {
                  // let parts = d.Close_Date.match(/\d+/g)
                  // let closeDate = new Date(parts[2], parts[1] - 1, parts[0]);
                  let closeDate = new Date(d.Close_Date); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                  d.Close_Date = closeDate;
                }
              }
              if (!(d.ER_MaturityDate instanceof Date && !isNaN(d.ER_MaturityDate))) {
                //if date dont need bottom logic
                if (d.ER_MaturityDate) {
                  // let parts = d.ER_MaturityDate.match(/\d+/g)
                  // let maturityDate = new Date(parts[2], parts[1] - 1, parts[0]);
                  let maturityDate = new Date(d.ER_MaturityDate); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                  d.ER_MaturityDate = maturityDate;
                }
              }
              if (!(d.ER_SettlmentDate instanceof Date && !isNaN(d.ER_SettlmentDate))) {
                //if date dont need bottom logic
                if (d.ER_SettlmentDate) {
                  // let parts = d.ER_SettlmentDate.match(/\d+/g)
                  // let SettlmentDate = new Date(parts[2], parts[1] - 1, parts[0]);
                  let SettlmentDate = new Date(d.ER_SettlmentDate); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                  d.ER_SettlmentDate = SettlmentDate;
                }
              }
              if (!(d.open_date instanceof Date && !isNaN(d.open_date))) {
                //if date dont need bottom logic
                if (d.open_date) {
                  // let parts = d.open_date.match(/\d+/g)
                  // let OpenDate = new Date(parts[2], parts[1] - 1, parts[0]);
                  let OpenDate = new Date(d.open_date); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                  d.open_date = OpenDate;
                }
              }
            })

          }

          this.totalcount = res.Count;
        }
      }
      this.pageEnd = (this.pageIndex * this.pageSize + parseInt(this.pageSize)) <= this.totalcount ? (this.pageIndex * this.pageSize + parseInt(this.pageSize)) : this.totalcount;
      this.RMWBondProductDetailsArr1 = this.RMWBondProductDetailsArr;
      this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(0, this.pageSize);
      this.pageloadflag = false;
    });


  }

  showProductInfo(ProductDetailsArr: any) {
    this.classApplied = false;
    this.ProductDetailsArr = ProductDetailsArr;
    this.productInfoFlag = !this.productInfoFlag;
  }


  hideProductInfo() {
    this.productInfoFlag = false;
  }

  getLikeImage(like: string) {
   
    return like === '0' ?
      this.isProd ? './assets/like.svg' : './../../assets/like.svg' :
      this.isProd ? './assets/liked.svg' : './../../assets/liked.svg';
  }

  likeProduct(notemasterID: string, likeCurrentValue: string) {
    this.pageloadflag = true;
    const likeValue = likeCurrentValue === '1' ? '0' : '1';
    //console.log(likeCurrentValue);
    let response;
    if (likeCurrentValue === '0') {
      response = this.EcWorkbench.likeProduct(notemasterID);
    } else {
      response = this.EcWorkbench.unlikeProduct(notemasterID);
    }
    if (response) {
      this.RMWBondProductDetailsArr.map(r => {
        if (r.Note_Master_ID === notemasterID) {
          r.LikeValue = likeValue;
        }
      });
      this.RMWBondProductDetailsArr1.map(r => {
        if (r.Note_Master_ID === notemasterID) {
          r.LikeValue = likeValue;
        }
      });

      this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize);
      this.pageloadflag = false;
    }
  }

  fillAttachmentPopup(NoteMasterID: string) {
    this.attachmentFiles.length = 0;
    const documents : any = this.EcWorkbench.ProductAttachmentList(NoteMasterID);
    if (documents) {
      this.attachmentCount = documents.length;
      documents.forEach(d => {
        const attachments: AttachmentFilesModel = {
          Filename: d.Document_Output_Path,
          Link: this.docurl + NoteMasterID + '/' + d.DGT_ID
        };
        this.attachmentFiles.push(attachments);
      });
    } else {
      this.attachmentCount = 0;
    }
    this.showAttachmentsPopup = true;
  }

  clearAttachmentPopup() {
    this.attachmentFiles.length = 0;
    this.attachmentCount = 0;
    this.showAttachmentsPopup = false;
  }

  ProductFoldersCSV: any;
  async showFolderPopup(NoteMasterID: any, ProductFoldersCSV: any) {
    this.successMsg = '';
    this.errorMsg = '';
    this.addFolder = false;
    this.folderlist = await this.EcWorkbench.FetchFolderList();
    const ProductFoldersCSVArr = ProductFoldersCSV.split(',');
    //console.log(ProductFoldersCSVArr);
    // tslint:disable-next-line: prefer-for-of
    if (this.folderlist !== null) {

      for (let i = 0; i < this.folderlist.length; i++) {
        if (ProductFoldersCSVArr.findIndex(record => record.toString().trim() === this.folderlist[i].PF_Folder_Name) > -1) {

          this.folderlist[i].isChecked = true;
        } else {
          this.folderlist[i].isChecked = false;
        }

      }
    }
    // this.ISIN = ISIN;
    this.NoteMasterID = NoteMasterID;
    this.ProductFoldersCSV = ProductFoldersCSV;
    this.showFolderPopupFlag = true;
  }

  async folderchkchange(index: any) {
    
    this.successMsg = '';
    this.errorMsg = '';
    this.addFolder = false;
    console.log(this.folderlist[index]);
    if (!this.folderlist[index].isChecked) {
      this.folderlist[index].isChecked = !this.folderlist[index].isChecked;
      // const res = this.api.SaveProductToFolder(this.folderlist[index].PF_Folder_Name, this.NoteMasterID, '32264', 'Private');
      let res: any;
      res = await this.EcWorkbench.CreateFolder(this.folderlist[index].PF_Folder_Name, this.NoteMasterID, 'Insert');
      //console.log(res);
      if (res['Result'] === 'Record inserted successfully') {
        this.errorMsg = '';
        this.successMsg = 'Product added successfully to the ' + this.folderlist[index].PF_Folder_Name + ' folder.';
      } else {
        this.successMsg = '';
        this.errorMsg = res['Result']; // this.ISIN + ' already exists under selected folder(s).';
      }


    } else {
      this.errorMsg = 'Folder already exists under selected folder(s).';
    }

  }

  hideFolderPopup() {
    this.showFolderPopupFlag = false;
  }

  saveproducttofolder() {
    // tslint:disable-next-line: prefer-for-of
    // for (let i = 0; i < this.folderlist.length; i++) {
    //   if (this.folderlist[i].isChecked) {
    //     const res = this.api.SaveProductToFolder(this.folderlist[i].PF_Folder_Name, this.NoteMasterID, '32264', '4', 'Dealer1', 'Private');
    //     if (res.Status) {
    //       this.errorMsg = '';
    //       this.successMsg = this.ISIN + ' added successfully to the folder(s).';
    //     } else {
    //       this.successMsg = '';
    //       this.errorMsg = this.ISIN + ' already exists under selected folder(s).';
    //     }
    //   }

    // }
    this.showFolderPopupFlag = false;
  }

  // showAttachment(ISIN: any) {
  //   if (this.attachmentArr.filter(i => i.ISIN === ISIN).length > 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  generatefilterstr() {
    this.filterCriteria = '';
    let wherestr = ' Where ';

    // //console.log(this.ListName, this.publicList, this.privateList);
    if (this.template === '') {
      //console.log(this.payoffListQL);
      var wherestr2 = ' Template_Code in (\'' + this.payoffListQL.join('\',\'') + '\')'
      // wherestr = wherestr + ' Template_Code in (,\'AutocallablePhoenix\',\'ReverseConvertible\',\'Participation\',\'CreditTranche\',\'ACC\',\'DAC\',\'EQC_Europe\')';
      wherestr = wherestr + wherestr2;
    } else {
      wherestr = wherestr + ' Template_Code in (\'' + this.template + '\')';
    }

    if (this.productfilter !== '') {
      wherestr = wherestr + ' and Product_Name like \'%' + this.productfilter + '%\'';
    }
    if (this.ddlNoteCcy !== 'All') {
      wherestr = wherestr + ' and Currency=\'' + this.ddlNoteCcy + '\'';
    }
    if (!this.popupFlag) {
      this.ListName = '';
      this.ListType = '';
      // if (this.publicList !== '') {
      //   // wherestr = wherestr + ' and PF.PF_Folder_Name like \'%' + this.publicList + '%\'';
      //   this.ListName = this.publicList;
      //   this.ListType = 'Public';
      // }
      // if (this.privateList !== '') {
      //   // wherestr = wherestr + ' and PF.PF_Folder_Name like \'%' + this.privateList + '%\'';
      //   this.ListName = this.privateList;
      //   this.ListType = 'Private';
      // }

    }
    if (this.filterISIN !== undefined && this.filterISIN !== '') {
      wherestr = wherestr + ' and ISIN = \'' + this.filterISIN + '\'';
    }
    // if (this.bondType !== undefined && this.bondType !== '') {
    //   this.filterCriteria = this.filterCriteria + ' and NM.NM_Bond_Type = \'' + this.bondType + '\'';
    // }
    // if (this.guarantor !== '') {
    //   wherestr = wherestr + ' and Guarantor like \'%' + this.guarantor + '%\'';
    // }
    if (this.filterIssuer !== '') {
      wherestr = wherestr + ' and PPCODE like \'%' + this.filterIssuer + '%\'';
    }
    // if (this.LTVMin !== '' && this.LTVMax !== '') {
    //   wherestr = wherestr + ' and NM_Bonds_LTV between ' + this.LTVMin + ' and ' + this.LTVMax;
    // }
    // if (this.bidYTMMin !== '' && this.bidYTMMax !== '') {
    //   wherestr = wherestr + ' and NMP_Bid_Yield between ' + this.bidYTMMin + ' and ' + this.bidYTMMax;
    // }
    // if (this.askYTMMin !== '' && this.askYTMMax !== '') {
    //   wherestr = wherestr + ' and NMP_Ask_Yield between ' + this.askYTMMin + ' and ' + this.askYTMMax;
    // }
    // if (this.bidPriceMin !== '' && this.bidPriceMax !== '') {
    //   wherestr = wherestr + ' and NMP_Bid_Price between ' + this.bidPriceMin + ' and ' + this.bidPriceMax;
    // }
    // if (this.askPriceMin !== '' && this.askPriceMax !== '') {
    //   wherestr = wherestr + ' and NMP_Ask_Price between ' + this.askPriceMin + ' and ' + this.askPriceMax;
    // }
    // // //console.log('aa', this.PRR);
    // if (this.PRR !== undefined && this.PRR !== '' && this.PRR.length > 0) {
    //   wherestr = wherestr + ' and Note_Product_Rating  in (' + this.PRR + ')';
    // }

    if (this.maturityFrom !== '' && this.maturityTo !== '') {
      wherestr = wherestr + ' and ((convert(date, Close_Date,23) between \'' + this.maturityFrom + '\' and \''
        + this.maturityTo + '\'))';
      //  or (convert(date, ER_MaturityDate,23) between \'' + this.maturityFrom + '\' and \'' + this.maturityTo + '\'))';
      // this.filterCriteria = this.filterCriteria + ' and ((convert(date, AUP.ComputedTenorValue,23) between \'' + this.maturityFrom + '\' and \'' 
      // + this.maturityTo +'\') or (convert(date, RC.ComputedTenorValue,23) between \'' + this.maturityFrom + '\' and \'' + this.maturityTo +'\'))';
    }

    // // //console.log(wherestr);
    // if (this.snpRating !== '') {

    //   wherestr = wherestr + ' and Misc1 in (\'' + (this.snpRating + '').replace(/,/g, '\',\'') + '\')';
    // }
    // if (this.moodyRating !== '') {
    //   wherestr = wherestr + ' and Curve_Code in (\'' + (this.moodyRating + '').replace(/,/g, '\',\'') + '\')';
    // }

    // if (this.fitchRating !== '') {
    //   wherestr = wherestr + ' and Bond_Fitch_Rating in (\'' + (this.fitchRating + '').replace(/,/g, '\',\'') + '\')';
    // }

    if (this.likeChk) {
      wherestr = wherestr + ' and Number_Of_Likes > 0 ';
    }
    if (this.poolType !== '') {
      wherestr = wherestr + ' and Exotic_Misc5 = \'' + this.poolType + '\'';
    }
    return wherestr;
  }

  async templateChange() {
    // this.template='';
    this.productfilter = '';
    this.ddlNoteCcy = 'All';
    this.publicList = '';
    this.privateList = '';
    this.filterISIN = '';
    this.filterIssuer = '';
    // this.maturityFrom = '';
    // this.maturityTo = '';
    const matFrom:any = await this.api.BBVAGetDates('', '0B', '');
    if (matFrom) {
      const date = new Date(matFrom.MaturityDate);
      date.setDate(date.getDate() - 30);
      // //console.log( this.datepipe.transform(date, 'dd-MMM-yyyy'));
      this.maturityFrom = this.cfs.formatDate(this.datepipe.transform(date, 'dd-MMM-yyyy'));

    }

    const matTo:any = await this.api.BBVAGetDates('', '1M', '');
    if (matTo) {
      this.maturityTo = this.cfs.formatDate(matTo.MaturityDate);

    }
    this.ListType = '';
    //this.folderlist = this.EcWorkbench.GetFolders((this.cfs.getLoggedInUserName())[0].UserId);
	 //Added by AdilP @19-04-2024
    this.allFolderList = await this.EcWorkbench.GetFolders((this.cfs.getLoggedInUserName())[0].UserId); 
    // this.folderlist = this.EcWorkbench.GetFolders((this.cfs.getLoggedInUserName())[0].UserId);
    // this.allFolderList.forEach((d : any) =>{ this.folderlist.push(d.PF_Folder_Name)})
    for (let index = 0; index < this.allFolderList.length; index++) {
      this.folderlist1.push(this.allFolderList[index].PF_Folder_Name)
      
    }
    //console.log(this.folderlist1);
    
    this.publicListArr = this.EcWorkbench.GetFolders('');
    this.likeChk = false;
    this.poolType = '';
  }

  listChange() {
    if (this.publicList === '' || this.privateList === '') {
      this.publicFlag = false;
      this.privateFlag = false;
    }
    if (this.publicList !== '') {
      this.privateFlag = true;
    }
    if (this.privateList !== '') {
      this.publicFlag = true;
    }
  }
// Async Await added by RajeshC & AdilP 
  Clear() {
    this.pageloadflag = true;
    $('#loading').show();
    setTimeout(async () => {
      this.template = '';
      await this.templateChange(); // <!-- Changes made for FIN1EURINT-383 : to show refresh/reload button || Kaustubh S || 05-Jun-2023 -->

      const str = this.generatefilterstr();
      this.folderName = this.ListName;
      const res : any = await this.EcWorkbench.GetRMWProductDetails(this.template, this.productfilter, this.ddlNoteCcy, this.sortBy + ' ' + this.sortOrder, '\'AutocallablePhoenix\',\'ReverseConvertible\',\'Participation\',\'CreditTranche\',\'ACC\',\'DAC\',\'EQC_Europe\',\'YieldEnhancement\'', this.pageSize, this.folderName, this.pageIndex + 1, str
        , this.filterCriteria, this.ListType, 'Y', this.EntityCode, this.likeChk ? 'Y' : '');
      // if (res) {
      if (res && res.items && res.items.length > 0) {

        this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
        //Added by AdilP @14-04-2023 to resolve DatePipe Issue
        {
          this.RMWBondProductDetailsArr.forEach(d => {
            if (!(d.Close_Date instanceof Date && !isNaN(d.Close_Date))) {
              //if date dont need bottom logic
              if (d.Close_Date) {
                // let parts = d.Close_Date.match(/\d+/g)
                // let closeDate = new Date(parts[2], parts[1] - 1, parts[0]);
                let closeDate = new Date(d.Close_Date); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                d.Close_Date = closeDate;
              }
            }
            if (!(d.ER_MaturityDate instanceof Date && !isNaN(d.ER_MaturityDate))) {
              //if date dont need bottom logic
              if (d.ER_MaturityDate) {
                // let parts = d.ER_MaturityDate.match(/\d+/g)
                // let maturityDate = new Date(parts[2], parts[1] - 1, parts[0]);
                let maturityDate = new Date(d.ER_MaturityDate); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                d.ER_MaturityDate = maturityDate;
              }
            }
            if (!(d.ER_SettlmentDate instanceof Date && !isNaN(d.ER_SettlmentDate))) {
              //if date dont need bottom logic
              if (d.ER_SettlmentDate) {
                // let parts = d.ER_SettlmentDate.match(/\d+/g)
                // let SettlmentDate = new Date(parts[2], parts[1] - 1, parts[0]);
                let SettlmentDate = new Date(d.ER_SettlmentDate); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                d.ER_SettlmentDate = SettlmentDate;
              }
            }
            if (!(d.open_date instanceof Date && !isNaN(d.open_date))) {
              //if date dont need bottom logic
              if (d.open_date) {
                // let parts = d.open_date.match(/\d+/g)
                // let OpenDate = new Date(parts[2], parts[1] - 1, parts[0]);
                let OpenDate = new Date(d.open_date); //Changed by AdilP || 04-09-2023 || FIN1EURINT-605
                d.open_date = OpenDate;
              }
            }
          })

        }
        this.totalcount = res.Count;
        this.RMWBondProductDetailsArr1 = this.RMWBondProductDetailsArr;
        this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(0, 5);
        this.pageloadflag = false;
        for(let i=0;i<this.currentItemsToShow.length;i++){
          if (parseFloat(this.currentItemsToShow[i].TotalDeals) >= parseFloat(this.currentItemsToShow[i].Maximum_Issue_Size)) {
            this.currentItemsToShow[i].disabledSubscribeBtn = true;
          } else {
            this.currentItemsToShow[i].disabledSubscribeBtn = false;
          }
         
        }
      }
      $('#loading').hide();
    });
    return false;
  }

  async showOrderPopup(orderData: any) {
    // //console.log(this.cfs.getLoggedInUserName());
    // //console.log(this.cfs.getLoggedInUserName()[0]);
    // //console.log(this.cfs.getLoggedInUserName()[0].EntityId);
    // //console.log(this.cfs.getLoggedInUserName()[1].EntityId);
    //console.log(orderData);
    this.orderData = orderData;
    this.orderUpfront = orderData.upfront;
    this.ordererrorMsg = '';
    this.ordersuccessMsg = '';
    this.RM = '';
    this.customerID = '';
    // this.AdvReason = 'ADVR_001';
    this.AdvReason = '';
    if (orderData.Template_Code === 'ACC' || orderData.Template_Code === 'DAC') {
      this.Notional = '10';
    } else {
      this.Notional = '100,000.00';
    }

    this.orderPopupFlag = true;
    await this.calcEstNotional(orderData);
    // this.showUnderlying(event, this.customerList[0])
    this.custCode = '';
    this.custName = '';
    this.minCoupon = '';
    // this.estNotional = '';
    return false;
  }

  hideOrderPopup() {
    this.orderPopupFlag = false;
  }

  checkValidNotional(e, fieldName) {
    try {
      var fieldMap = {
        'Notional': 'Notional',
        'minCoupon': 'Min Coupon',
        'estNotional': 'Estimated Notional'
      }
      const res = this.cfs.checkValidNotionalRMW(e, fieldMap[fieldName]);
      //console.log(res.ErrorMsg);
      if (res.ErrorMsg === '') {
        e.target.value = res.Notional;
        // this.Notional = res.Notional;
        this[fieldName] = res.Notional;
        //console.log(this.minCoupon);

        if (fieldName === 'NoOfShare') {
          this.Notional = parseFloat(res.Notional.replace(/,/g, '')).toFixed(0);
          this.Notional = this.Notional.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }

        this.errorMsg = res.ErrorMsg;
        return true;
      } else {
        this.errorMsg = res.ErrorMsg;
        // this[fieldName] = "0.00";
        return false;
      }
    } catch (error) {
      //console.log('Error', error);
    }
  }

  async BookOrder() {

    this.ordererrorMsg = '';
    this.ordersuccessMsg = '';
    
    if (!this.showRMDetails) {
      this.RM = '';
    }
    else {
      if (this.RM === '') {
        // this.ordererrorMsg = 'Please enter valid RM name.';
        this.ordererrorMsg = 'Please select RM name.';
        return false;
      }
    }
    // if (this.customerID === '') {
    //   this.ordererrorMsg = 'Please enter valid Client Rel ID.';
    //   return false;
    // }
    if (this.Notional === '') {
      this.ordererrorMsg = 'Please enter valid notional.';
      return false;
    }
    //console.log(this.orderData);
    // //console.log(this.AdvReason);
    // if (this.cfs.strToFloat(this.Notional) < this.cfs.strToFloat(this.orderData.Minimum_Issue_Size)) {
    if (this.orderData.Template_Code !== 'ACC' && this.orderData.Template_Code !== 'DAC') {
      if (this.cfs.strToFloat(this.Notional) < this.cfs.strToFloat(this.orderData.minordersize)) {
        this.ordererrorMsg = "Cannot place order. Notional size is less than the minimum permitted.";
        return false;
      }
      if (this.cfs.strToFloat(this.Notional) > this.cfs.strToFloat(this.orderData.Maximum_Issue_Size)) {
        this.ordererrorMsg = "Cannot place order. Notional size is greater than the maximum permitted.";
        return false;
      }
      if (this.cfs.strToFloat(this.Notional) % this.cfs.strToFloat(this.orderData.denomination) !== 0.00) {
        this.ordererrorMsg = "Notional should be multiple of denomination";
        return false;
      }
      // condition added by AdilP || FIN1EURINT-347 || @31-05-2023
      //Added toString() to TotalDeals for order confirmation not workng 2nd time without refresh issue|| Apurva K|| 18-Oct-2023|| For Demo  
      if((this.cfs.strToFloat(this.Notional) + this.cfs.strToFloat(this.orderData.TotalDeals.toString())) > this.cfs.strToFloat(this.orderData.Maximum_Issue_Size) ){
        this.ordererrorMsg = "Cannot place order. Total orders crossed maximum pool size  ";
        return false;
      }
    }
    // changes done by Pranav D for AQ DQ minimum maximum notional validation 03-Feb-2022
    else {
      //console.log('notionals', this.Notional, this.estNotional, this.orderData.Minimum_Issue_Size);
      // Commented as asked by DJ 15-Feb-2022 validation appear for only maximum pool size | start
      // if (this.cfs.strToFloat(this.Notional) < this.cfs.strToFloat(this.orderData.Minimum_Issue_Size)) {
      //   //this.ordererrorMsg = "Cannot place order. Notional size is less than the minimum permitted.";
      //   this.ordererrorMsg = "Cannot place order. Number of shares are less than the minimum permitted.";
      //   return false;
      // }// Commented as asked by DJ 15-Feb-2022 validation appear for only maximum pool size | end
      if (this.cfs.strToFloat(this.Notional) > this.cfs.strToFloat(this.orderData.Maximum_Issue_Size)) {
        //this.ordererrorMsg = "Cannot place order. Notional size is greater than the maximum permitted.";
        this.ordererrorMsg = "Cannot place order. Number of shares are greater than the maximum permitted.";
        return false;
      } else if (this.cfs.strToFloat(this.Notional) === 0) {
        this.ordererrorMsg = "Cannot place order. Number of shares is 0.";
        return false;
      }
      // if (this.cfs.strToFloat(this.estNotional) % this.cfs.strToFloat(this.orderData.denomination) !== 0.00) {
      //   this.ordererrorMsg = "Notional should be multiple of denomination";
    //     return false;
    //   }
    }
    // Maximum_Issue_Size
    // Minimum_Issue_Size
    // denomination

    if (this.AdvReason === '') {
      // this.ordererrorMsg = 'Please enter valid reason.';
      this.ordererrorMsg = 'Please select Stock Eligibility Reason.';
      return false;
    }

    if (this.orderData.Template_Code !== 'ACC' && this.orderData.Template_Code !== 'DAC' && this.showMinMaxSolveFor && this.orderData.ER_SolveFor !== 'Reoffer' && this.orderData.ER_SolveFor !== 'IBPrice') {
      // if (this.orderData.Template_Code !== 'ACC' && this.orderData.Template_Code !== 'DAC' ) {
      if (!this.minCoupon || this.minCoupon === '') {
        // this.ordererrorMsg = 'Please enter Min Coupon.';
        this.ordererrorMsg = 'Please enter ' + this.getSolveForLabel(this.orderData.ER_SolveFor);
        return false;
      }
    }

    //console.log(this.cfs.getLoggedInUserName()[1].EntityId);

    // if(this.cfs.getLoggedInUserName()[1].EntityId === '151' || this.cfs.getLoggedInUserName()[1].EntityId === '157'){
    if (!this.showCustDetails) {
      this.custName = '';
      this.custCode = '';
    }
    else {
      if (this.custName === '') {
        this.ordererrorMsg = 'Please select Customer.';
        return false;
      }
    }

    var RMName='';
    var idx =  this.RMList.findIndex(item=> item.RM_ID === this.RM);
    if(idx > -1){
    RMName = this.RMList[idx].Rel_Manager_Name
    }
    if (this.ordererrorMsg === '') {

      // this.ordersuccessMsg = 'Order placed successfully.';
      // const res = this.api.UDTForRMOrderSave(this.orderData.Note_Master_ID, 
      // (this.orderData.Template_Code !== 'ACC' && this.orderData.Template_Code !== 'DAC') ? this.Notional.toString().replace(/,/g, '') : this.estNotional.toString().replace(/,/g, ''), 
      // this.RM,
      // RMName,
      //   this.orderData.Currency, this.custCode, this.custName, this.minCoupon, this.onBehalfOf);

      // passed noofshares instead of estimated notional and modified currency parameter by Priya L. on 16Feb2022 - assigned by Pranav D
      const res : any = await this.EcWorkbench.UDTForRMOrderSave1(this.orderData.Note_Master_ID,
        this.Notional.toString().replace(/,/g, ''), this.RM, RMName,
        this.orderData.Currency, this.custCode, this.custName, this.minCoupon, this.onBehalfOf);

      //console.log('order place', res);

      if (res[0].Status == 'TRUE') {
        this.ordersuccessMsg = 'Order placed successfully. Order ID : ' + res[0].ResponseMessage;
        this.successMessage = true;
        this.orderPopupFlag = false;
        if (this.currentItemsToShow.findIndex(record => record.Note_Master_ID === this.orderData.Note_Master_ID) > -1) {
          let index = this.currentItemsToShow.findIndex(record => record.Note_Master_ID === this.orderData.Note_Master_ID);
          //console.log(index, this.currentItemsToShow);
          // commented by Priya L. on 16Feb2022 as passing noofshares instead of  estimated notional - assigned by Pranav D.
          // if (this.orderData.Template_Code !== 'ACC' && this.orderData.Template_Code !== 'DAC') {
          this.currentItemsToShow[index].TotalDeals = parseInt(this.currentItemsToShow[index].TotalDeals) + parseInt(this.Notional.replace(/,/g, ''));
          this.currentItemsToShow[index].PercentageFilled = ((this.currentItemsToShow[index].TotalDeals) / (this.currentItemsToShow[index].Maximum_Issue_Size)) * 100;
          // commented by Priya L. on 16Feb2022 as passing noofshares instead of  estimated notional - assigned by Pranav D.
          // } else {
          //   this.currentItemsToShow[index].TotalDeals = parseInt(this.currentItemsToShow[index].TotalDeals) + parseInt(this.estNotional.replace(/,/g, ''));
          //   this.currentItemsToShow[index].PercentageFilled = ((this.currentItemsToShow[index].TotalDeals) / (this.currentItemsToShow[index].Maximum_Issue_Size)) * 100;

          // }
          if (parseFloat(this.currentItemsToShow[index].TotalDeals) === parseFloat(this.currentItemsToShow[index].Maximum_Issue_Size)) {
            this.currentItemsToShow[index].disabledSubscribeBtn = true;
          } else {
            this.currentItemsToShow[index].disabledSubscribeBtn = false;
          }
        }
      } else {
        this.ordersuccessMsg = '';
        this.ordererrorMsg = res[0].ResponseMessage + ': Order execution failed. Please try again';

      }
    }

    return false;

  }

  reset() {
    this.errorMsg = '';
    this.ordersuccessMsg = '';
    this.ordererrorMsg = '';

  }
  toggleSuccessMessage() {
    this.successMessage = false;
  }

  ViewTermsheet(rfq: any) {
    try {

      $('#loading').show();
      setTimeout(() => {

        // this.ErrorMsg = '';
        this.ErrorMsgTop = '';
        this.errorMessage = false;
        const res : any = this.api.ViewTermsheet(rfq, 'IndicativeTermsheet');
        if (res !== null && res !== undefined) {
          if (res.Status.toString().toUpperCase() === 'SUCCESS') {
            const bytes = new Uint8Array(res.DGI_Image);
            const blob = new Blob([bytes], { type: 'application/doc' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = res.Document_Output_Path;
            link.click();
          } else {
            this.ErrorMsgTop = res.Status.toString();
            this.errorMessage = true;
          }

        } else {
          this.ErrorMsgTop = 'Termsheet not available. Please try again later.';
          this.errorMessage = true;
        }
        $('#loading').hide();

      });

    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

  ViewKID(rfq: any) {
    try {
      $('#loading').show();
      setTimeout(() => {
        // this.ErrorMsg = '';
        this.ErrorMsgTop = '';
        this.errorMessage = false;
        const res : any = this.api.ViewTermsheet(rfq, 'KID Termsheet');
        if (res !== null && res !== undefined) {
          if (res.Status.toString().toUpperCase() === 'SUCCESS') {
            const bytes = new Uint8Array(res.DGI_Image);
            const blob = new Blob([bytes], { type: 'application/doc' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = res.Document_Output_Path;
            link.click();
          } else {
            this.ErrorMsgTop = res.Status.toString();
            this.errorMessage = true;
          }

        } else {
          this.ErrorMsgTop = 'KID not available. Please try again later.';
          this.errorMessage = true;
        }

        $('#loading').hide();

      });
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

  toggleErrorMessage() {
    this.errorMessage = false;
  }

  async createNewFolder() {
    
    this.successMsg = '';
    this.errorMsg = '';
    if (this.fName !== '') {
      let res: any;
      res = await this.EcWorkbench.CreateFolder(this.fName, this.NoteMasterID, 'Create');
      if (res['Result'] === 'Folder created successfully') {

        const index = this.currentItemsToShow.findIndex(res => res.Note_Master_ID === this.NoteMasterID);
        if (index > -1) {
         if(this.endsWith( this.currentItemsToShow[index].ProductFoldersCSV,',')){
           this.currentItemsToShow[index].ProductFoldersCSV = this.currentItemsToShow[index].ProductFoldersCSV + this.fName + ',';
         } else{
          this.currentItemsToShow[index].ProductFoldersCSV = this.currentItemsToShow[index].ProductFoldersCSV + ',' + this.fName + ',';
         }
          
          this.ProductFoldersCSV = this.currentItemsToShow[index].ProductFoldersCSV;
        }

        this.showFolderPopup(this.NoteMasterID, this.ProductFoldersCSV);
        this.errorMsg = '';
        this.successMsg = 'New folder created and product added successfully to the ' + this.fName + ' folder.';

      } else {
        this.successMsg = '';
        this.errorMsg = res['Result']; // this.ISIN + ' already exists under selected folder(s).';
      }
      this.addFolder = false;
    } else {
      this.errorMsg = 'Please add new folder.';
    }
  }

   endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

  selectedShareIndex = 0;
  flag = false;
  custCode = '';
  selectedBIndex = 0;
  showSuggestions = false;

  ChangeIndex(e) {
    try {
      console.log(e)
      this.selectedShareIndex = 0;
      this.flag = true;
      // this.shareCode = '';
      this.custCode = '';
      this.selectedBIndex = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
    }
  }

  selectShare(e) {
    try {
      this.flag = false;
      //console.log($('.HoverSuggestion').data('share'));
      if ($('.HoverSuggestion').data('share') !== undefined) {
        // this.shareCode = $('.HoverSuggestion').data('share');
        this.custCode = $('.HoverSuggestion').data('share');
      }
      // if (this.shareCode !== undefined && this.shareCode !== '') {
      if (this.custCode !== undefined && this.custCode !== '') {
        // this.showUnderlying(e, SearchUnderlyingPipe.prototype.transform(this.shares, this.shareCode)[0]);
        // this.showUnderlying(e, SearchUnderlyingPipe.prototype.transform(this.customerList, this.custCode)[0]);
        // this.showUnderlying(e, FilterPipe.prototype.transform(this.customerList, this.custCode)[0]);
        //console.log(this.customerList.findIndex(item => item.CustomerID == this.custCode));
        var index = this.customerList.findIndex(item => item.CustomerID == this.custCode)
        if (index !== -1) {
          this.showUnderlying(e, this.customerList[index]);
        }
        else {
          this.custCode = '';
          this.custName = '';
        }

        // this.custName = item.CustomerName;
        // this.custCode = item.CustomerID;
      }
    } catch (Error) {
      //console.log('Error', Error);
    }
  }
  backKeyPress(e) {
    try {
      console.log(e)
      // this.flag = false;
      // // this.shareCode = '';
      // this.custCode = '';
      // this.selectedBIndex = 0;

      this.selectedShareIndex = 0;
      this.flag = true;
      this.custCode = '';
      this.selectedBIndex = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;

      if (this.custName.length === 1) {
        this.showSuggestions = false;
        this.flag = false;
      }

    } catch (error) {
      //console.log('Error:', error);
    }
  }
  showUnderlying(event, item) {
    try {
      console.log(event);
      //console.log(item);
      this.ordererrorMsg = '';
      // this.reset();
      this.flag = false;
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      // this.ShareName = '';
      this.custName = item.CustomerName;
      this.custCode = item.CustomerID;
      // this.ccyChange = item.Ccy;
      /*
      
      
      
      
            if (this.ShareBasket.length < 5) {
                if (this.ShareBasket.find(i => i.Code === item.BloombergCode) === undefined) {
                    this.ShareBasket.push({ Code: item.BloombergCode, LongName: item.LongName });
                    this.setSelectedUnderlyingarray(item.LongName, item.Ccy, item.BloombergCode,
                        item.ExchangeCode, item.ExchangeName, '', '', '', '', '');
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
      
            this.Dates = this.apifunctions.BBVAGetDates(this.Exchange(), this.stkshift, '');
            if (this.Dates) {
                this.stkdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            }
      
            this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.paymentshift, this.stkdate);
            if (this.Dates) {
                this.settdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            }
      
            this.Dates = this.apifunctions.BBVAGetDates(this.ddlNoteCcy, this.expshift, this.settdate);
            if (this.Dates) {
                this.expdate = this.commonfunctions.formatDate(this.Dates.MaturityDate);
            }
      */
    } catch (error) {
      //console.log('Error:', error);
    }
  }

  setFocus() {
    this.namefield.nativeElement.focus();
  }

  async showViewOrderPopup(templateCode: any, noteMasterID: any, data: any) {

    this.finalCoupon = '';
    this.orderData = data;
    //console.log(this.orderData)
    if (templateCode === 'ACC' || templateCode === 'DAC') {
      this.AQDQFlag = true;
    } else {
      this.AQDQFlag = false;
    }
    this.viewOrderData = await this.api.getOrderInfo(templateCode, 1, 1500, noteMasterID, 0, 'Y');
    this.showviewOrderPopupFlag = true;
    //console.log(this.viewOrderData);
  }
  hideViewOrderPopup() {
    this.showviewOrderPopupFlag = false;
  }

  async calcEstNotional(data: any) {
    // //console.log('123');
    this.ordererrorMsg = '';
    if (data.Template_Code === 'ACC' || data.Template_Code === 'DAC') {
      let share = []
      //this.api.BBVALoadShares('EQ', "", "EQC_Europe").then(async (data: any) => {
		this.api.BBVALoadShares('EQ', "", "EQC_Europe").then(async (d: any) => {
        //share = data.Get_All_Share_Details_JsonResult;
        //share = data;
		share = d;
        this.api.shares = share;
        if (share.findIndex(i => i.Code === data.Asset || i.BloombergCode === data.Asset) > -1) {
          const sharecode = share[share.findIndex(i => i.Code === data.Asset || i.BloombergCode === data.Asset)].Code;
          const eCode = share[share.findIndex(i => i.Code === data.Asset || i.BloombergCode === data.Asset)].ExchangeCode;
          const Ccy = share[share.findIndex(i => i.Code === data.Asset || i.BloombergCode === data.Asset)].Ccy;
          // changes by Suvarna P || 22Apr2022 || GetSharesInfo chnaged to GetShareRate || assigned by Pranav D
        // const shareInfo = this.api.GetSharesInfo(sharecode)
           const shareInfo = await this.api.GetShareRate(sharecode, Ccy);
          const accrualdayResp = await this.api.GetNoOfDays(eCode, data.Soft_Tenor.substring(0, data.Soft_Tenor.length - 1), data.Soft_Tenor.substring(data.Soft_Tenor.length - 1),
            this.orderData.Currency, this.orderData.Note_KO_Frequency_Type);
            const accrualday = accrualdayResp['NoOfDays'];
           // changes by Suvarna P || 22Apr2022 || GetSharesInfo chnaged to GetShareRate || assigned by Pranav D
           // if (shareInfo && shareInfo.length > 0 && accrualday !== '') {
           if (shareInfo['ShareRate'] && shareInfo['ShareRate'] !== '' && accrualday !== '') {
            let res = 0;
            // res = shareInfo[0].Spot * accrualday * (this.Notional.replace(/,/g, ''));
            res = parseFloat(shareInfo['ShareRate'].toString().replace(/,/g, '')) * accrualday * (this.Notional.replace(/,/g, ''));
            this.estNotional = res.toFixed(0);
            this.estNotional = this.estNotional.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
          }
        }
      });
      
      // if (this.api.shares === undefined || this.api.shares.length <= 0) {
      //   share = this.api.BBVALoadShares('EQ', "", data.Template_Code === 'ACC' ? 'Accumulator' : 'Decumulator');
      // }
      // share = this.api.shares;
      

    }
  }
  selectRecord = {};
  showMoreDetails(d) {
    this.selectRecord = {};
    this.prevQuoteLaunchPopUp = true;
    this.selectRecord = d;
    this.selectRecord['redirectFrom'] = "RMW";
    this.selectRecord['Mode'] = "Launch Product";
  }
  backTestPopUp = {};
  showBackTest(d) {
    this.selectRecord = {};
    // this.prevQuoteLaunchPopUp = true;
    this.backTestPopUp = true;
    this.selectRecord = d;
    this.selectRecord['Note_Master_ID'] = d.Note_Master_ID;
    // this.selectRecord['Mode'] = "Launch Product";
  }
  // // Added by AppurvaK for ViewAttachment| 16 Nov 2021| start
  // async ViewAttachment(NoteMasterID: any) {
  //   this.ViewAttachmentRes=[];
  //   this.showAttahmentflag = true;
  //   //console.log("this is view attachment func call", NoteMasterID);
  //   // this.downloadAttachment(NoteMasterID);
  //   this.ViewAttachmentRes = await this.api.viewAttachment(NoteMasterID);
  //   // this.attachmentName = this.ViewAttachmentRes[0].DocumentName;
  //   // //console.log(this.attachmentName);
  // }

  // Changed API call and code logic for View Attachment by AdilP || 05-06-2023
  async ViewAttachment(token) {
    try {
      this.docsData = [];
      this.docsPopupLabels = [
        { title: "Counterparty", value: token.Issuer },
        { title: "Product Name ", value: token.Product_Name },
        { title: "RFQ ID ", value: token.EP_ER_QuoteRequestId },
        { title: "ISIN", value: token.Note_Master_ID },
      ];
      this.docsView = "BOTH";
      this.showDocsPopup = true;

    } catch (error) {
      console.log(error)
    }
  }

  downloadAttachment_old(i) { //commeneted by suvarna
    console.log(i);
    if (this.ViewAttachmentRes !== null && this.ViewAttachmentRes !== undefined) {
      //console.log(this.ViewAttachmentRes);
      const bytes = new Uint8Array(this.ViewAttachmentRes[0].DocumentByteFile);
      const blob = new Blob([bytes], { type: 'application/doc' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = this.ViewAttachmentRes[0].DocumentName;
      link.click();
    }
    else {
      this.ErrorMsgTop = 'Attachment not available. Please try again later.';

    }
  }
  downloadAttachment(i) {
    // //console.log(res);
    if (this.ViewAttachmentRes !== null && this.ViewAttachmentRes !== undefined) {
      //console.log(this.ViewAttachmentRes);
      const bytes = new Uint8Array(this.ViewAttachmentRes[i].DocumentByteFile);
      const blob = new Blob([bytes], { type: 'application/doc' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = this.ViewAttachmentRes[i].DocumentName;
      link.click();
    }
    else {
      this.ErrorMsgTop = 'Attachment not available. Please try again later.';

    }
  }
  // Added by AppurvaK for ViewAttachment| 16 Nov 2021| end

  closeLaunchProduct() {
    this.showAttahmentflag = false;
  }
  checkCouponRange(t) {
    // if(this.finalCoupon !== '' && parseFloat(t.Min_x0020_Coupon[0]) > this.finalCoupon){
    // orderData.ER_SolveFor
    // //console.log(this.solveForLabelArrayNew[this.orderData.ER_SolveFor][0].toString().toUpperCase() === 'MIN');
    if (this.solveForLabelArrayNew[this.orderData.ER_SolveFor] && this.finalCoupon !== '') {
      if (this.solveForLabelArrayNew[this.orderData.ER_SolveFor][0].toString().toUpperCase() === 'MIN' && parseFloat(t.Solve_x0020_For_x0020_Value[0]) > this.finalCoupon) {
        return true;
      }
      else if (this.solveForLabelArrayNew[this.orderData.ER_SolveFor][0].toString().toUpperCase() === 'MAX' && parseFloat(t.Solve_x0020_For_x0020_Value[0]) < this.finalCoupon) {
        return true;
      }
      else {
        return false
      }
    }
    return false;
  }

  // getSolveForLabel(ER_SolveFor) {
  //   //console.log(this.solveForLabelArrayNew);
  //   if (this.solveForLabelArray[ER_SolveFor]) {
  //     return this.solveForLabelArray[ER_SolveFor];
  //   }
  //   else {
  //     "Min Coupon(%)"
  //   }

  // }
  getSolveForLabel(ER_SolveFor) {
    //console.log(ER_SolveFor);
    if (this.solveForLabelArrayNew[ER_SolveFor]) {
      return this.solveForLabelArrayNew[ER_SolveFor][0] + " " + this.solveForLabelArrayNew[ER_SolveFor][1];
    }
    else {
      "Min Coupon(%)"
    }

  }
  lifecyclePopUp = false;
  showLifecycle(d) {
    this.selectRecord = {};
   
    this.lifecyclePopUp = true;
    this.selectRecord = d;
    this.selectRecord['Note_Master_ID'] = d.Note_Master_ID;
    // this.selectRecord['Mode'] = "Launch Product";
  }

  closeDocsModal(val: boolean) {
    try {
      this.showDocsPopup = val;
    } catch (error) {
      console.log(error);
    }
  }

  showDocsModal() {
    try {
      this.showDocsPopup = true;
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  async ViewDoc(RFQ,LP,docType) {
    try {
      
      this.docsData = [];
      let showFlag = false;
      const res: any = await this.api.ViewTermsheet(RFQ, docType);
      const thisRef = this;
      this.docsPopupLabels = [
        {title: "Counterparty", value: LP},
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
              "File Name": item["Document_Output_Path"],
              "Type": item["DocumentType"],
              "Language": item["DocumentLanguage"],
              "Country": item["DocumentCountry"],
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
  
  
      }// Changed by Jyoti S || 25-May-2023  || END
    } catch (error) {
      //console.log('Error', error);
    }
    return false;
  }

}
