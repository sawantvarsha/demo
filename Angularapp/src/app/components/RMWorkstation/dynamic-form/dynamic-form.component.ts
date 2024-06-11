import {
  Component,
  OnDestroy,
  OnInit,
  ViewChildren,
  QueryList,
  Input,
  ElementRef,
} from '@angular/core';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import { CustomerCommonfunctionsService } from '../../../services/customer-commonfunctions.service';
import { environment } from '../../../../environments/environment';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../../services/auth/auth.service';
import { ApifunctionService } from '../../fx-order/apifunction.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HomeApiService } from '../../../services/home-api.service';
import { DatePipe, Location } from '@angular/common';
import { Options } from '@angular-slider/ngx-slider';
import { Subscription } from 'rxjs';
import { MenuApiService } from 'src/app/services/menu-api.service';
// import SwiperCore, {
//   Navigation,
//   Pagination,
//   Scrollbar,
//   A11y,
//   Virtual,
//   Zoom,
//   Autoplay,
//   Thumbs,
//   Controller
// } from 'swiper/core';

// SwiperCore.use([
//   Navigation,
//   Pagination,
//   Scrollbar,
//   A11y,
//   Virtual,
//   Zoom,
//   Autoplay,
//   Thumbs,
//   Controller
// ]);
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @Input() control: any;
  @Input() data: any;
  saveFilter = [];
  FormData = [];
  pageEvent: PageEvent;
  isLoading: boolean;
  privateList = [];
  publicList = [];
  length: any;
  pageSize: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageNo: any;
  publicItem: string;
  privateItem: string;
  allList = [];
  allItem: string;
  textValue = '';
  username: string;
  rmwdata = [];
  rmwlayout = [];
  showamf: boolean;
  showmf: boolean;
  showbonds: boolean;
  showshares: boolean;
  showfd: boolean;
  filterFlag: boolean;
  ratingApplied: any[] = [];
  showInsurance: boolean = false;
  flag = false;
  filterLoader = false;
  likeChecked = false;
  searchStringPublic: any = '';
  searchStringPrivate: any = '';
  searchStringCcy: any = '';
  searchStringSnP: any = '';
  searchStringMoody: any = '';
  searchStringFitch: any = '';
  searchStringBond: any = '';
  searchStringAsset: any = '';
  searchStringIssuer: any = '';
  searchStringExchange: any = '';
  // showInsurance: boolean;
  layout = [];
  gridColumn: any;
  column = [];
  fillExchangeDdl: any[] = [];
  fillGenericSQLDdl: any[] = [];
  fillIssuerDdl: any[] = [];
  FinalData = [];
  myStyles: any = {};
  displayName = '';
  isProd = environment.production;
  imgUrl = '../../../../assets/App_Resources/';
  imagepathProd = 'assets';
  portfoliopopflag: boolean;
  templateID = '';
  filterArray = [];
  checkAsset = [];
  links = [];
  checkCcy = [];
  checkSnp = [];
  checkMoody = [];
  checkFitch = [];
  checkIssuer = [];
  filterString = '';
  foldersString = '';
  ListType = '';
  textFlag: boolean;
  disabled: boolean = false;
  disabled1: boolean = false;
  // lastIndexElement = '';
  // filterFlag: boolean = false;
  lastIndexElement: string;
  filterBonds: any[];
  filterFunds: any[];
  filterInsurance: any[];
  filterAll: any[];
  stringBonds: any;
  stringFunds: any;
  stringInsurance: any;
  stringAll: any;
  selectedProduct = 'ALL';
  folderName: any;
  searchBarString = '';
  msg = '';
  loader: boolean = false;
  minValue = 50;
  maxValue = 150;
  riskprofilecheck = true;
  options: Options = {
    floor: 0,
    ceil: 200,
  };

  options2: Options = {
    floor: 0,
    ceil: 100,
  };

  optionsytm: Options = {
    floor: 0,
    ceil: 20,
  };
  accord1: number;
  logText = '';
  Link = '';
  checkboxArray: any = [
    { rate: 1 },
    { rate: 2 },
    { rate: 3 },
    { rate: 4 },
    { rate: 5 },
  ];
  showFactsheet = [];
  factsheetdata = [];
  userType: string;
  i: number;
  ccy: any;
  getFirstRowDataArray: any[] = [];
  getSecondRowDataArray: any[] = [];
  getThirdRowDataArray: any[] = [];
  getFourthRowDataArray: any[] = [];
  getFifthRowDataArray: any[] = [];
  currencyList = [];
  selectedItems = [];
  Checkedpublic = [];
  // Checkedpublic: string = '';
  RMWLayoutSubscription: Subscription;
  dropdownSettings: IDropdownSettings;
  sNP: any;
  moody: any;
  fitch: any;
  Checked = [];
  assetFilter: any;
  CheckedRisk = [];
  issuer: any;
  issuer1: any;
  whereclause: any;
  showsnpRating = false;
  showfitchRating = false;
  showmoodyRating = false;
  flagsnp = false;
  snpstring = '';
  fitchstring = '';
  moodyString = '';
  snpRating = '';
  fitchRating = '';
  moodyRating = '';
  showccy = false;
  ratingArr: any[];
  isinArr: any[];
  assetArr: any[];
  minInv: any[];
  annualMgmt: any[];
  ltvArr: any[];
  entryArr: any[];
  assetBonds: any[];
  searchBonds: any[];
  issuerBonds: any[];
  listArr: any[];
  filterSideArray = [];
  bidAsk: any[];
  ccyAll = '';
  ccyBonds = '';
  ccyFunds = '';
  ccyInsurance = '';
  likesBonds = '';
  likesFunds = '';
  likesInsurance = '';
  likesAll = '';
  bondstempId: any;
  fundstempId: any;
  alltempId: any;
  insurancestempId: any;
  toggleChecked: boolean;
  // textFlag: boolean;
  activeTab: boolean[];
  hideSidebar = false;
  moreLessFilters = false;
  moreFilter: string;
  displaySidebar: boolean;
  hideSideBar: boolean;
  MenuArray = [];
  likes: any;
  searchString: any;
  assetItems: any[] = [
    { Name: 'Single & Basket' },
    { Name: 'Single Only' },
    { Name: 'Basket Only' },
  ];
  searchFlag: boolean;
  @Input() icon = 'arrow';
  @ViewChildren('el', { read: ElementRef }) el: QueryList<ElementRef>;
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  @ViewChildren('searchInput') searchInput: QueryList<ElementRef>;
  @ViewChildren('bidask') bidask: QueryList<ElementRef>;

  snpRatingList: any = [
    { snpRate: 'A', isChecked: false },
    { snpRate: 'A-', isChecked: false },
    { snpRate: 'A+', isChecked: false },
    { snpRate: 'AA', isChecked: false },
    { snpRate: 'AA-', isChecked: false },
    { snpRate: 'AA+', isChecked: false },
    { snpRate: 'AAA', isChecked: false },
    { snpRate: 'B', isChecked: false },
    { snpRate: 'B-', isChecked: false },
    { snpRate: 'B+', isChecked: false },
    { snpRate: 'BB', isChecked: false },
    { snpRate: 'BB-', isChecked: false },
    { snpRate: 'BB+', isChecked: false },
    { snpRate: 'BBB', isChecked: false },
    { snpRate: 'BBB-', isChecked: false },
    { snpRate: 'BBB+', isChecked: false },
    { snpRate: 'C', isChecked: false },
    { snpRate: 'CC', isChecked: false },
    { snpRate: 'CCC', isChecked: false },
    { snpRate: 'CCC-', isChecked: false },
    { snpRate: 'CCC+', isChecked: false },
    { snpRate: 'D', isChecked: false },
    { snpRate: 'NA', isChecked: false },
    { snpRate: 'NR', isChecked: false },
  ];

  moodyRatingList: any = [
    { moodyrate: 'A1', isChecked: false },
    { moodyrate: 'A2', isChecked: false },
    { moodyrate: 'A3', isChecked: false },
    { moodyrate: 'Aa1', isChecked: false },
    { moodyrate: 'Aa2', isChecked: false },
    { moodyrate: 'Aa3', isChecked: false },
    { moodyrate: 'Aaa', isChecked: false },
    { moodyrate: 'B1', isChecked: false },
    { moodyrate: 'B2', isChecked: false },
    { moodyrate: 'B3', isChecked: false },
    { moodyrate: 'Ba1', isChecked: false },
    { moodyrate: 'Ba2', isChecked: false },
    { moodyrate: 'Ba3', isChecked: false },
    { moodyrate: 'Baa1', isChecked: false },
    { moodyrate: 'Baa2', isChecked: false },
    { moodyrate: 'Baa3', isChecked: false },
    { moodyrate: 'BB+', isChecked: false },
    { moodyrate: 'C', isChecked: false },
    { moodyrate: 'Ca', isChecked: false },
    { moodyrate: 'Caa1', isChecked: false },
    { moodyrate: 'Caa2', isChecked: false },
    { moodyrate: 'Caa3', isChecked: false },
    { moodyrate: 'NA', isChecked: false },
    { moodyrate: 'NR', isChecked: false },
    { moodyrate: 'WR', isChecked: false },
  ];

  fitchRatingList: any = [
    { fitchrate: 'A', isChecked: false },
    { fitchrate: 'A-', isChecked: false },
    { fitchrate: 'A+', isChecked: false },
    { fitchrate: 'AA', isChecked: false },
    { fitchrate: 'AA-', isChecked: false },
    { fitchrate: 'AA+', isChecked: false },
    { fitchrate: 'AAA', isChecked: false },
    { fitchrate: 'B', isChecked: false },
    { fitchrate: 'B-', isChecked: false },
    { fitchrate: 'B+', isChecked: false },
    { fitchrate: 'BB', isChecked: false },
    { fitchrate: 'BB-', isChecked: false },
    { fitchrate: 'BB+', isChecked: false },
    { fitchrate: 'BBB', isChecked: false },
    { fitchrate: 'BBB-', isChecked: false },
    { fitchrate: 'BBB+', isChecked: false },
    { fitchrate: 'CCC', isChecked: false },
    { fitchrate: 'D', isChecked: false },
    { fitchrate: 'DD', isChecked: false },
    { fitchrate: 'DDD', isChecked: false },
    { fitchrate: 'NA', isChecked: false },
    { fitchrate: 'NR', isChecked: false },
    { fitchrate: 'WD', isChecked: false },
  ];

  assetType = '';
  fromDate: string = '';
  toDate: string = '';
  SortingCriteria: string = '';
  selectedTarget: string = '';
  order = 'asc';
  tabs = [];
  sort: string = '';
  showSortingData: boolean = false;
  showRecommendations: any[];
  recommendedProductsList: any[];
  saveSearchFilter: any[];
  recommendatioMsg: any;
  controlledSwiper: any;
  RMWDataSubscription: Subscription;
  tabcount: any;
  selectedMFIndex = 0;
  activeAll: boolean = false;
  sortingData = [];
  ccyflag: boolean;
  liststring: string;
  folderName1: string;
  liststring1: string;
  folderName3: string;
  liststring3: string;
  folderName2: string;
  liststring2: string;
  popupFlag: boolean;
  pageload: boolean;
  search_Bonds: any;
  search_Funds: any;
  search_Insurance: any;
  search_All: any;
  checkLikes = false;
  tempCcyArray: any[];
  privateListCopy: any[];
  pageSize1 = 5;
  checkPrimaryMkt = false;
  // publicListCopy: any[];
  // snpRatingListCopy: any;
  // moodyRatingListCopy: any;
  // fitchRatingListCopy: any;
  // fillGenericSQLDdlCopy: any[];
  // assetItemsCopy: any[];
  // fillIssuerDdlCpoy: any[];
  checkboxArrayCopy: any;
  stateFlag: boolean;
  choice: any;
  index: any;
  RMWStateArr: any;
  tabChangeFlag: boolean;
  checkRiskProfile: boolean = true;
  isUserRM: boolean;
  RiskProfile: any;
  showNifty: boolean;
  niftyId: any;
  folderName4: string;
  liststring4: string;
  stringNifty: string;
  ccyNifty: any;
  filterNifty: any[];
  search_Nifty: string;
  likesNifty: any;
  showTicker: any;
  clearFlag: boolean;
  showSP: boolean;
  spId: any;
  stringSP: string;
  folderName5: string;
  liststring5: string;
  ccySP: any;
  filterSP: any[];
  search_SP: string;
  likesSP: any;
  templateName: any;
  counter: number; //Added by Alolika G | 19-02-2022
  rateFilterString: string; //Added by Alolika | 25-02-2022

  constructor(
    private workflowApi: WorkflowApiService,
    public cfs: CommonApiService,
    private ccfs: CustomerCommonfunctionsService,
    public authorApi: AuthService,
    public menuApi: MenuApiService,
    public afs: ApifunctionService,
    private datepipe: DatePipe,
    public homeapi: HomeApiService,
    public location: Location
  ) {
    this.MenuArray = [];
  }
  ngOnDestroy(): void {
    try {
      if (this.RMWDataSubscription) {
        this.RMWDataSubscription.unsubscribe();
        this.workflowApi.ResetRMWData();
      }
      this.workflowApi.RMWData.next([]);

      //Added to clear filters on page navigation --START
      if (this.homeapi.RMWlink === '') {
        // this.clearFlag = false;
        this.cfs.selectedState.next([]);
        this.clearFilter();
      } else {
        // this.clearFlag = true;
      }
      //-- END

      // this.clearSearch(); //commented to save search string on tab change
    } catch (error) {}
  }
  ngOnInit(): void {

    this.cfs.setFlagToDisplayCust(false);      //By Ashwini H. for product catalogue display on 07 Feb
    sessionStorage.setItem('BondPorfolioDetails', 'FromDynamicForm');   //Changes by Ashwini H. on 15 Feb 2022 for bond order entry
    // this.filterString = "and RIGHT(NM.Note_Product_Rating, 1) < " + this.homeapi.RiskRating.split('')[1]; //Added by Alolika | 17-02-2022
    // this.filterString = "and RIGHT(NM.Note_Product_Rating, 1) between '1' and '" + this.homeapi.RiskRating.split('')[1] + "'"; //Added by Alolika | 17-02-2022
    this.rateFilterString =  "and RIGHT(NM.Note_Product_Rating, 1) between '1' and '" + this.homeapi.RiskRating?.split('')[1] + "'"; //Added by Alolika | 25-02-2022
    this.pageNo = 1;
    this.pageSize = 5;
    this.accord1 = 1;
    this.moreFilter = 'More Filters  +';
    this.likes = '';
    this.ccy = '';
    this.issuer = '';
    this.issuer1 = '';
    this.saveFilter = [];
    this.stringBonds = '';
    this.stringFunds = '';
    this.stringInsurance = '';
    this.stringAll = '';
    this.filterBonds = [];
    this.filterFunds = [];
    this.filterInsurance = [];
    this.filterAll = [];
    this.whereclause = '';
    this.folderName = '';
    this.liststring = '';
    this.folderName1 = '';
    this.liststring1 = '';
    this.folderName3 = '';
    this.liststring3 = '';
    this.folderName2 = '';
    this.liststring2 = '';
    this.pageload = true;
    this.stateFlag = false;
    this.workflowApi.loadMutualFunds();
    this.username = sessionStorage.getItem('Username');
    this.userType = sessionStorage.getItem('UserType');
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    this.RiskProfile = this.homeapi.RiskProfile;
  //  this.stringAll = this.stringFunds =this.stringBonds =this.stringInsurance =this.stringNifty = this.stringSP = this.filterString; //Added by Ruchira | 17-02-2022
    this.cfs.showTickerObs.subscribe((res) => {
      this.showTicker = res;
      console.log(res, 'ticker');
    });

    this.cfs.selectedStateObserver.subscribe((res) => {
      if (res.length > 0) {
        this.RMWStateArr = [];
        this.stateFlag = true;
        this.RMWStateArr = res;
      }
    });

    this.afs.getCommonDataFXOrder('CSPRMWProducts').subscribe((res) => {
      if (res.length !== 0) {
        this.tabs = [];

        this.tabs = res.Get_Configurable_Common_DataResult;

        this.tabcount = res.Get_Configurable_Common_DataResult.length;
         console.log(this.tabs);
        this.activeTab = [];
        for (let i = 0; i < this.tabcount; i++) {
          this.activeTab.push(false);
        }
        this.activeAll = true;

        // this.changeProduct('ALL', this.tabs.length);
        if (this.stateFlag) {
          this.tabChangeFlag = true;
          this.pageNo = this.RMWStateArr[0].pageNo;
          this.pageSize = this.RMWStateArr[0].pageSize;
          this.changeProduct(
            this.RMWStateArr[0].tab,
            this.RMWStateArr[0].index
          );
        } else {
          this.tabChangeFlag = false;
          this.pageNo = 1;
          this.pageSize = 5;
          this.changeProduct('ALL', this.tabs.length);
        }
      }
    });

    this.cfs.hideMenuObs.subscribe((res) => {
      this.hideSideBar = res;
      this.MenuArray.forEach((m) => {
        m.isCollapsed = true;
      });
      // console.log('Menu collapsed', res);
    });

    this.getTemplateId();

    // let pageArr = [];
    // pageArr.push({"pageNo": this.pageNo, "pageSize": this.pageSize, "tab": this.choice, "index": this.index});
    //   this.cfs.setRMWstate(pageArr);
    // this.riskprofileChanged();

    // this.workflowApi.getRMWData(
    //   // 'Where Template_Code in ( \'Bonds\',\'Fund_Setup\',\'Product_Maintenance\')',

    //   "Where Template_Code in ( 'Bonds','Fund_Setup','Product_Maintenance','NiftyParticipation')",
    //   this.username,
    //   this.filterString,
    //   '',
    //   this.pageNo,
    //   this.authorApi.EntityID,
    //   this.pageSize,
    //   this.SortingCriteria,
    //   this.foldersString,
    //   this.ListType,
    //   '',
    //   ''
    // );

    this.RMWDataSubscription = this.workflowApi.RMWDataObserver.subscribe(
      (res: any) => {
        if (res.length !== 0) {
          if (res.RMWGenericResponse.Count !== null) {
            this.msg = '';
            this.rmwdata = [];
            this.length = res.RMWGenericResponse.Count;
            res = res.RMWGenericResponse;
            this.rmwdata = JSON.parse(res.items.replace(/\n/g, ''));
            console.log(this.rmwdata);
    
            for (let i = 0; i < this.rmwdata.length; i++) {
              this.showFactsheet[i] = false;
              this.rmwdata[i].Maturity_Date = this.ccfs.checkAndFormatDate(
                this.rmwdata[i].Maturity_Date
              );
              this.rmwdata[i].Value_Date = this.ccfs.checkAndFormatDate(
                this.rmwdata[i].Value_Date
              );
            }
            // console.log("rmwdata", this.rmwdata);
            this.templateID = this.rmwdata[0].Template_ID
            ;
            sessionStorage.setItem('templateID', this.templateID);
            // switch (this.selectedProduct) {
            //   case 'ALL':
            //     this.alltempId = !this.alltempId ? this.templateID : this.alltempId;
            //     break;

            // case 'Fund_Setup':
            //   this.fundstempId = !this.fundstempId ? this.templateID : this.fundstempId;
            //   break;

            // case 'Bonds':
            //   this.bondstempId = !this.bondstempId ? this.templateID : this.bondstempId;
            //   break;

            // case 'Product_Maintenance':
            //   this.insurancestempId = !this.insurancestempId ? this.templateID : this.insurancestempId;

            //     break;

            // }

            if (this.selectedProduct === 'All') {
              this.workflowApi.getRMWSortingData('');
            } else {
              this.workflowApi.getRMWSortingData(this.templateID);
            }
            // this.workflowApi.getRMWActionLinks(this.templateID, this.userType);
            this.loader = false;
          } else {
            this.rmwdata = [];
            this.length = 0;
            this.msg = 'No Record Found';
            this.loader = false;
          }
        }
      }
    );
    this.workflowApi.RMWFilterDataObserver.subscribe((res: any) => {
      if (res.length) {
        this.showFilters(res);
        this.filterLoader = false;
      }
    });
    this.workflowApi.loadCurrency().subscribe((res) => {
      if (res.length !== 0) {
        this.currencyList = res;
        this.tempCcyArray = this.currencyList.slice();
      }
    });

    this.workflowApi.RMWSortingDataObserver.subscribe((res: any) => {
      if (res.length !== 0) {
        // console.log(res);
        this.sortingData = res;
        // this.callSorting(this.sortingData[0], 'asc')
        if (this.sort === '') {
          this.sort = this.sortingData[0].RSM_Display_Name;
        }
      }
    });

    this.workflowApi.FillIssuerDetails(this.username).subscribe((res: any) => {
      //this.fillIssuerDdl = res.FillIssuerDetailsResult;
      res.FillIssuerDetailsResult.forEach((element) => {
        if (element.Issuer_Code !== '') {
          this.fillIssuerDdl.push(element);
          // this.fillIssuerDdlCpoy = this.fillIssuerDdl.slice();
        }
      });
      //console.log("this.fillIssuerDdl", this.fillIssuerDdl);
    });

    this.workflowApi.FillExchange(this.username).subscribe((res: any) => {
      res.FillExchangeResult.forEach((element) => {
        if (element.Exchange_Name !== '') {
          this.fillExchangeDdl.push(element);
          // this.fillIssuerDdlCpoy = this.fillIssuerDdl.slice();
        }
      });
      // console.log("this.fillExchangeDdl", this.fillExchangeDdl);
    });

    this.workflowApi.GenericSQLToFillDropdown().subscribe((res: any) => {
      this.fillGenericSQLDdl = res.GenericSQLToFillDropdownResult;
      // this.fillGenericSQLDdlCopy = this.fillGenericSQLDdl.slice();
      // console.log("this.fillExchangeDdl", this.fillExchangeDdl);
    });

    if (this.pageload) {
      this.removeFilter(
        [
          'SearchBar',
          this.searchBarString,
          'NM.Product_Name',
          'search',
          'SearchBar',
        ],
        []
      );
      this.removeFilter(
        ['SearchBar', this.searchBarString, 'NM.ISIN', 'search', 'SearchBar'],
        []
      );
      // this.saveRmwFilters();
    }

    // this.snpRatingListCopy = this.snpRatingList.slice();
    // this.moodyRatingListCopy = this.moodyRatingList.slice();
    // this.fitchRatingListCopy = this.fitchRatingList.slice();
    // this.assetItemsCopy = this.assetItems.slice();
    this.checkboxArrayCopy = this.checkboxArray.slice();
  }

  changeProduct(choice, index) {

    if(choice.includes(',')) {
      this.choice = "('" + choice.split(',')[0] + "'" + "," + "'" + choice.split(',')[1] + "')";
      this.selectedProduct = "";
    } else {
      this.choice = choice;
      this.selectedProduct = this.choice;
    }
    
    this.index = index;
    this.SortingCriteria = '';
    this.foldersString = '';
    this.ListType = '';
    if (this.tabChangeFlag) {
      this.pageNo = this.RMWStateArr[0].pageNo;
      this.pageSize = this.RMWStateArr[0].pageSize;
    } else {
      this.pageNo = 1;
      this.pageSize = 5;
    }

    this.sort = '';
    for (let i = 0; i < this.tabcount; i++) {
      this.activeTab[i] = false;
    }
    this.saveFilter = [];
    this.activeAll = false;
    this.activeTab[index] = true;
    this.showamf = false;
    this.showmf = false;
    this.showbonds = false;
    this.showshares = false;
    this.showfd = false;
    this.showInsurance = false;
    this.showNifty = false;
    this.showSP = false;
    this.layout = [];
    this.rmwdata = [];
    this.rmwlayout = [];
    this.loader = true;
    this.gridColumn = 0;
    this.popupFlag = false;
    this.hideSidebar = false;
    this.displaySidebar = false;
    this.hideSideBar = false;
    this.cfs.HideSidebar(this.hideSideBar);
    this.tabs.forEach((element) => {
      if (element.DATA_VALUE === choice) {
        // this.selectedProduct = element.DATA_VALUE;
        this.templateName = element.Misc1;
      }
    });
    if (this.choice === 'ALL') {
      this.templateName = 'ALL';
    }

    // this.saveRmwFilters(); //Added by Alolika | 17-02-2022
    this.getSavedFilters(this.templateName);

    if (this.searchBarString.length > 0) {
      this.getRMWSearch(this.searchBarString);
    } else {
      this.filterString = this.rateFilterString + this.filterString; //Added by Alolika | 25-02-2022
      this.workflowApi.getRMWData(
        // 'Where Template_Code = \'Fund_Setup\'',
        this.whereclause,
        this.username,
        this.filterString,
        // this.stringFunds,
        // '',
        this.selectedProduct,
        this.pageNo,
        this.authorApi.EntityID,
        this.pageSize,
        this.SortingCriteria,
        this.foldersString,
        this.ListType,
        '',
        ''
      );
    }

    this.checkUncheck();
    let pageArr = [];
    pageArr.push({
      pageNo: this.pageNo,
      pageSize: this.pageSize,
      tab: this.choice,
      index: this.index,
    });
    this.cfs.setRMWstate(pageArr);
    this.tabChangeFlag = false;
  }

  getSavedFilters(choice) {
    switch (choice) {
      case 'Funds':
        this.showmf = true;
        // this.saveRmwFilters(); //Added by Ruchira | 17-02-2022
        this.homeapi.riskProfileArray.forEach((element) => {
          if (element.product === this.selectedProduct) {
            this.checkRiskProfile = element.value;
          }
        });
        this.saveFilter =
          JSON.parse(sessionStorage.getItem('filterFunds')) || [];
        this.filterString = sessionStorage.getItem('stringFunds') || '';
        this.ccy = sessionStorage.getItem('ccyFunds') || '';
        this.foldersString = sessionStorage.getItem('folderName1') || '';
        this.ListType = sessionStorage.getItem('liststring1') || '';
        this.searchBarString = sessionStorage.getItem('search_Funds') || '';
        this.whereclause = '';
        if(this.choice.includes(",")) {
          this.whereclause = "Where Template_Code in " + this.choice ;
        } else {
          this.whereclause =
          "Where Template_Code = '" + this.selectedProduct + "'";
        }
        this.likes = sessionStorage.getItem('likesFunds') || '';
        if (this.ccy !== '') {
          this.whereclause =
            this.whereclause + ' and Currency in (' + this.ccy + ')';
        }
        if (this.likes !== '') {
          this.whereclause = this.whereclause + this.likes;
        }
        // if (!this.isUserRM) {
        //   this.riskprofileChanged();
        // }
        break;

      case 'Bonds':
        this.showbonds = true;
        // this.saveRmwFilters(); //Added by Ruchira | 17-02-2022
        this.homeapi.riskProfileArray.forEach((element) => {
          if (element.product === this.selectedProduct) {
            this.checkRiskProfile = element.value;
          }
        });

        this.saveFilter =
          JSON.parse(sessionStorage.getItem('filterBonds')) || [];
        this.filterString = sessionStorage.getItem('stringBonds') || '';
        this.foldersString = sessionStorage.getItem('folderName') || '';
        this.ListType = sessionStorage.getItem('liststring') || '';
        this.ccy = sessionStorage.getItem('ccyBonds') || '';
        this.searchBarString = sessionStorage.getItem('search_Bonds') || '';
        this.likes = sessionStorage.getItem('likesBonds') || '';
        if(this.choice.includes(",")) {
          this.whereclause = "Where Template_Code in " + this.choice ;
        } else {
          this.whereclause =
          "Where Template_Code = '" + this.selectedProduct + "'";
        }
        if (this.ccy !== '') {
          this.whereclause =
            this.whereclause + ' and Currency in (' + this.ccy + ')';
        }
        if (this.likes !== '') {
          this.whereclause = this.whereclause + this.likes;
        }
        // Commented as asked by Roshan D | 21Dec
        // if (!this.isUserRM) {
        //   this.riskprofileChanged();
        // }
        break;

      case 'Insurance':
        this.showInsurance = true;
        // this.saveRmwFilters(); //Added by Ruchira | 17-02-2022
        this.homeapi.riskProfileArray.forEach((element) => {
          if (element.product === this.selectedProduct) {
            this.checkRiskProfile = element.value;
          }
        });

        this.saveFilter =
          JSON.parse(sessionStorage.getItem('filterInsurance')) || [];
        this.filterString = sessionStorage.getItem('stringInsurance') || '';
        this.ccy = sessionStorage.getItem('ccyInsurance') || '';
        this.foldersString = sessionStorage.getItem('folderName2') || '';
        this.ListType = sessionStorage.getItem('liststring2') || '';
        this.searchBarString = sessionStorage.getItem('search_Insurance') || '';
        if(this.choice.includes(",")) {
          this.whereclause = "Where Template_Code in " + this.choice ;
        } else {
          this.whereclause =
          "Where Template_Code = '" + this.selectedProduct + "'";
        }
        this.likes = sessionStorage.getItem('likesInsurance') || '';

        if (this.ccy !== '') {
          this.whereclause =
            this.whereclause + ' and Currency in (' + this.ccy + ')';
        }
        if (this.likes !== '') {
          this.whereclause = this.whereclause + this.likes;
        }
        // if (!this.isUserRM) {
        //   this.riskprofileChanged();
        // }
        break;

      case 'SP':
        this.showNifty = true;
        // this.saveRmwFilters(); //Added by Ruchira | 17-02-2022
        this.homeapi.riskProfileArray.forEach((element) => {
          if (element.product === this.selectedProduct) {
            this.checkRiskProfile = element.value;
          }
        });
        this.saveFilter =
          JSON.parse(sessionStorage.getItem('filterNifty')) || [];
        this.filterString = sessionStorage.getItem('stringNifty') || '';
        this.ccy = sessionStorage.getItem('ccyNifty') || '';
        this.foldersString = sessionStorage.getItem('folderName4') || '';
        this.ListType = sessionStorage.getItem('liststring4') || '';
        this.searchBarString = sessionStorage.getItem('search_Nifty') || '';
        this.whereclause = '';
        if(this.choice.includes(",")) {
          this.whereclause = "Where Template_Code in " + this.choice ;
        } else {
          this.whereclause =
          "Where Template_Code = '" + this.selectedProduct + "'";
        }
        this.likes = sessionStorage.getItem('likesNifty') || '';
        if (this.ccy !== '') {
          this.whereclause =
            this.whereclause + ' and Currency in (' + this.ccy + ')';
        }
        if (this.likes !== '') {
          this.whereclause = this.whereclause + this.likes;
        }
        // if (!this.isUserRM) {
        //   this.riskprofileChanged();
        // }
        break;

      case 'Equity Autocallable (specific)':
        this.showSP = true;
        // this.saveRmwFilters(); //Added by Ruchira | 17-02-2022
        // this.homeapi.riskProfileArray.forEach((element) => {
        //   if (element.product === this.selectedProduct) {
        //     this.checkRiskProfile = element.value;
        //   }
        // });
        this.saveFilter = JSON.parse(sessionStorage.getItem('filterSP')) || [];
        this.filterString = sessionStorage.getItem('stringSP') || '';
        this.ccy = sessionStorage.getItem('ccySP') || '';
        this.foldersString = sessionStorage.getItem('folderName5') || '';
        this.ListType = sessionStorage.getItem('liststring5') || '';
        this.searchBarString = sessionStorage.getItem('search_SP') || '';
        this.whereclause = '';
        if(this.choice.includes(",")) {
          this.whereclause = "Where Template_Code in " + this.choice ;
        } else {
          this.whereclause =
          "Where Template_Code = '" + this.selectedProduct + "'";
        }
        this.likes = sessionStorage.getItem('likesSP') || '';
        if (this.ccy !== '') {
          this.whereclause =
            this.whereclause + ' and Currency in (' + this.ccy + ')';
        }
        if (this.likes !== '') {
          this.whereclause = this.whereclause + this.likes;
        }
        // if (!this.isUserRM) {
        //   this.riskprofileChanged();
        // }
        break;

      case 'ALL':
        this.activeAll = true;
        // this.saveRmwFilters(); //Added by Ruchira | 17-02-2022
        this.homeapi.riskProfileArray.forEach((element) => {
          if (element.product === this.selectedProduct) {
            this.checkRiskProfile = element.value;
          }
        });
        this.saveFilter = JSON.parse(sessionStorage.getItem('filterAll')) || [];
        this.filterString = sessionStorage.getItem('stringAll') || '';
        this.ccy = sessionStorage.getItem('ccyAll') || '';
        this.foldersString = sessionStorage.getItem('folderName3') || '';
        this.ListType = sessionStorage.getItem('liststring3') || '';
        this.searchBarString = sessionStorage.getItem('search_All') || '';
        this.whereclause =
          "Where Template_Code in ( 'Bonds','Fund_Setup','Product_Maintenance','NiftyParticipation', 'EquityAutocallableNote', 'FundsBundle')";
        this.likes = sessionStorage.getItem('likesAll') || '';

        if (this.ccy !== '') {
          this.whereclause =
            this.whereclause + ' and Currency in (' + this.ccy + ')';
        }
        if (this.likes !== '') {
          this.whereclause = this.whereclause + this.likes;
        }
        // if (!this.isUserRM) {
        //   this.riskprofileChanged();
        // }
        break;

      default:
        this.saveFilter = [];
        // this.filterString = "and RIGHT(NM.Note_Product_Rating, 1) < " + this.homeapi.RiskRating.split('')[1]; //Added by Alolika | 17-02-2022;
        this.filterString = "and RIGHT(NM.Note_Product_Rating, 1) between '1' and '" + this.homeapi.RiskRating?.split('')[1] + "'"; //Added by Alolika | 17-02-2022
        this.ccy = '';
        this.foldersString = '';
        this.ListType = '';
        this.searchBarString = '';
        if(this.choice.includes(",")) {
          "Where Template_Code in " + this.choice;
        } else {
          this.whereclause =
          "Where Template_Code = '" + this.selectedProduct + "'";
        }
        // this.whereclause = "Where Template_Code = '" + this.selectedProduct + "'";
        this.likes = '';
        break;
    }
  }

  checkUncheck() {
    // console.log("this.checkCcy", this.checkCcy);
    const tempSaveFilter = this.saveFilter;
    // this.checkCcy = [];
    this.currencyList.forEach((item) => (item.selected = false));
    tempSaveFilter.forEach((element) => {
      if (element[0] === 'Ccy') {
        if (this.whereclause.includes(element[1])) {
          // this.checkCcy[element[3]] = true;
          this.currencyList.forEach((item) => {
            if (element[1] === item.Code) {
              item.selected = true;
            }
          });
        } else {
          this.saveFilter = this.removeFilter(element, this.saveFilter);
        }
      }
    });

    this.checkLikes = false;

    if (this.whereclause.includes('Number_Of_Likes')) {
      this.checkLikes = true;
    } else {
      this.checkLikes = false;
    }

    if (tempSaveFilter.length > 0) {
      // this.Checked = [];
      this.checkboxArray.forEach((item) => (item.selected = false));
      // this.checkIssuer = [];
      this.fillIssuerDdl.forEach((item) => (item.selected = false));
      // this.checkSnp = [];
      this.snpRatingList.forEach((item) => (item.selected = false));
      // this.checkMoody = [];
      this.moodyRatingList.forEach((item) => (item.selected = false));
      // this.checkFitch = [];
      this.fitchRatingList.forEach((item) => (item.selected = false));
      this.publicList.forEach((l) => {
        l.isChecked = false;
      });
      this.privateList.forEach((l) => {
        l.isChecked = false;
      });
      this.fillExchangeDdl.forEach((l) => {
        l.isChecked = false;
      });
      this.fillGenericSQLDdl.forEach((l) => {
        l.isChecked = false;
      });
      this.assetItems.forEach((l) => {
        l.isChecked = false;
      });

      tempSaveFilter.forEach((element) => {
        if (element[0] === 'PRR' || element[0] === 'Risk Rating') {
          if (this.filterString.includes(element[1])) {
            // this.Checked[element[3]] = true;
            this.checkboxArray.forEach((item, _i) => {
              if (element[1] === item.rate) {
                item.selected = true;
              }
            });
          } else {
            this.saveFilter = this.removeFilter(element, this.saveFilter);
          }
        } else if (element[0] === 'Issuer') {
          if (this.filterString.includes(element[4])) {
            // this.checkIssuer[element[3]] = true;
            this.fillIssuerDdl.forEach((item) => {
              if (element[1] === item.Issuer_Name) {
                item.selected = true;
              }
            });
          } else {
            this.saveFilter = this.removeFilter(element, this.saveFilter);
          }
        } else if (element[0] === 'S&P') {
          if (this.filterString.includes(element[1])) {
            // this.checkSnp[element[3]] = true;
            this.snpRatingList.forEach((item) => {
              if (element[1] === item.snpRate) {
                item.selected = true;
              }
            });
          } else {
            this.saveFilter = this.removeFilter(element, this.saveFilter);
          }
        } else if (element[0] === "Moody's") {
          if (this.filterString.includes(element[1])) {
            // this.checkMoody[element[3]] = true;
            this.moodyRatingList.forEach((item) => {
              if (element[1] === item.moodyrate) {
                item.selected = true;
              }
            });
          } else {
            this.saveFilter = this.removeFilter(element, this.saveFilter);
          }
        } else if (element[0] === 'Fitch') {
          if (this.filterString.includes(element[1])) {
            // this.checkFitch[element[3]] = true;
            this.fitchRatingList.forEach((item) => {
              if (element[1] === item.fitchrate) {
                item.selected = true;
              }
            });
          } else {
            this.saveFilter = this.removeFilter(element, this.saveFilter);
          }
        } else if (element[0] === 'Public List') {
          if (this.foldersString === element[1]) {
            this.publicList.forEach((l) => {
              if (l.PF_Folder_Name === element[1]) {
                l.isChecked = true;
                this.disabled = true;
                this.disabled1 = false;
              }
            });
          } else {
            this.saveFilter = this.removeFilter(element, this.saveFilter);
          }
        } else if (element[0] === 'Private List') {
          if (this.foldersString === element[1]) {
            this.privateList.forEach((l) => {
              if (l.PF_Folder_Name === element[1]) {
                l.isChecked = true;
                this.disabled1 = true;
                this.disabled = false;
              }
            });
          } else {
            this.saveFilter = this.removeFilter(element, this.saveFilter);
          }
        } else if (element[0] === 'Exchange') {
          if (this.filterString.includes(element[1])) {
            this.fillExchangeDdl.forEach((l) => {
              if (l.Long_Name === element[1]) {
                l.isChecked = true;
              }
            });
          } else {
            this.saveFilter = this.removeFilter(element, this.saveFilter);
          }
        } else if (element[0] === 'Bond Type') {
          if (this.filterString.includes(element[1])) {
            this.fillGenericSQLDdl.forEach((l) => {
              if (l.DisplayField === element[1]) {
                l.isChecked = true;
              }
            });
          } else {
            this.saveFilter = this.removeFilter(element, this.saveFilter);
          }
        } else if (element[0] === 'Asset Type') {
          if (this.filterString.includes(element[1])) {
            this.assetItems.forEach((l) => {
              if (l.Name === element[1]) {
                l.isChecked = true;
              }
            });
          } else {
            this.saveFilter = this.removeFilter(element, this.saveFilter);
          }
          // this.assetItems.forEach(l => {
          //   if (this.filterString.includes(l.Name)) {
          //     l.isChecked = true;
          //   }else {
          //     this.saveFilter = this.removeFilter(element, this.saveFilter);
          //   }
          // })
        } else if (element[0] === 'Risk Profile') {
          if (this.filterString.includes(element[1])) {
            // this.checkSnp[element[3]] = true;
            this.homeapi.riskProfileArray.forEach((element, i) => {
              if (this.selectedProduct === element.product) {
                this.checkRiskProfile = true;
                this.homeapi.riskProfileArray[i].value = this.checkRiskProfile;
              }
            });
          } else {
            this.saveFilter = this.removeFilter(element, this.saveFilter);
          }
        }
      });
    } else {
      this.Checked = [];
      this.checkboxArray.forEach((item) => (item.selected = false));
      // this.checkIssuer = [];
      // this.checkSnp = [];
      // this.checkMoody = [];
      // this.checkFitch = [];
      // this.checkRiskProfile = false;
      this.fillIssuerDdl.forEach((item) => (item.selected = false));
      // this.checkSnp = [];
      this.snpRatingList.forEach((item) => (item.selected = false));
      // this.checkMoody = [];
      this.moodyRatingList.forEach((item) => (item.selected = false));
      // this.checkFitch = [];
      this.fitchRatingList.forEach((item) => (item.selected = false));
      this.disabled = false;
      this.disabled1 = false;
      this.publicList.forEach((l) => {
        l.isChecked = false;
      });
      this.privateList.forEach((l) => {
        l.isChecked = false;
      });
      this.fillExchangeDdl.forEach((l) => {
        l.isChecked = false;
      });
      this.fillGenericSQLDdl.forEach((l) => {
        l.isChecked = false;
      });
      this.assetItems.forEach((l) => {
        l.isChecked = false;
      });
    }
  }

  pageEvents(event: any) {
    // console.log(event.pageIndex);
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    // this.isLoading = true;

    if (this.selectedProduct === 'ALL') {
      if (this.whereclause === '') {
        // this.whereclause = 'Where Template_Code in ( \'Bonds\',\'Fund_Setup\',\'Product_Maintenance\')';

        this.whereclause =
          "Where Template_Code in ( 'Bonds','Fund_Setup','Product_Maintenance','NiftyParticipation')";
      }
      this.workflowApi.getRMWData(
        this.whereclause,
        this.username,
        this.filterString,
        '',
        this.pageNo,
        this.authorApi.EntityID,
        this.pageSize,
        this.SortingCriteria,
        this.foldersString,
        this.ListType,
        '',
        ''
      );
    } else {
      if (this.whereclause === '') {
        this.whereclause =
          "Where Template_Code = '" + this.selectedProduct + "'";
      }
      this.workflowApi.getRMWData(
        this.whereclause,
        this.username,
        this.filterString,
        this.selectedProduct,
        this.pageNo,
        this.authorApi.EntityID,
        this.pageSize,
        this.SortingCriteria,
        this.foldersString,
        this.ListType,
        '',
        ''
      );
    }
    let pageArr = [];
    pageArr.push({
      pageNo: this.pageNo,
      pageSize: this.pageSize,
      tab: this.choice,
      index: this.index,
    });
    this.cfs.setRMWstate(pageArr);
  }

  searchPopup() {
    this.filterLoader = true;
    this.hideSideBar = false;
    this.cfs.HideSidebar(this.hideSideBar);
    this.hideSidebar = false;
    this.searchFlag = !this.searchFlag;

    if (this.searchFlag === true) {
      this.displaySidebar = true;

      this.workflowApi
        .Get_FoldersAPI('', this.authorApi.EntityID)
        .subscribe((res) => {
          this.publicList = [];
          this.publicList = res;
          // this.publicListCopy = this.publicList.slice();
        });
      this.workflowApi
        .Get_FoldersAPI(this.username, this.authorApi.EntityID)
        .subscribe((res) => {
          this.privateList = [];
          res.forEach((element) => {
            if (element.PF_Folder_Name !== '') {
              this.privateList.push(element);
              this.privateListCopy = this.privateList.slice();
            }
          });
        });
      this.workflowApi
        .Get_FoldersAPI('ALL', this.authorApi.EntityID)
        .subscribe((res) => {
          this.allList = [];
          this.allList = res;
        });
      if (this.selectedProduct === 'ALL') {
        this.workflowApi.getRMWFilter('ALL');
      } else if (this.showbonds) {
        this.workflowApi.getRMWFilter(this.bondstempId);
      } else if (this.showmf) {
        this.workflowApi.getRMWFilter(this.fundstempId);
      } else if (this.showInsurance) {
        this.workflowApi.getRMWFilter(this.insurancestempId);
      } else if (this.showNifty) {
        this.workflowApi.getRMWFilter(this.niftyId);
      } else if (this.showSP) {
        this.workflowApi.getRMWFilter(this.spId);
      }
    } else {
      // this.filterString = '';
      this.displaySidebar = false;
    }

    // const tempSaveFilter = this.saveFilter;
    // this.checkCcy = [];
    // tempSaveFilter.forEach(element => {
    //   if (element[0] === 'Ccy') {
    //     if (this.whereclause.includes(element[1])) {
    //       this.checkCcy[element[3]] = true;
    //     } else {
    //       this.saveFilter = this.removeFilter(element, this.saveFilter);
    //     }
    //   }

    // });
    this.checkUncheck();
  }

  togglePopup() {
    this.filterLoader = true;
    // console.log("this.toggleChecked", this.toggleChecked);
    if (!this.toggleChecked) {
      this.toggleFilterSidebar();
    } else if (this.toggleChecked) {
      this.hideSideBar = false;
      this.cfs.HideSidebar(this.hideSideBar);
      this.hideSidebar = false;
      this.popupFlag = !this.popupFlag;

      if (this.popupFlag === true) {
        this.displaySidebar = true;

        this.workflowApi
          .Get_FoldersAPI('', this.authorApi.EntityID)
          .subscribe((res) => {
            this.publicList = [];
            this.publicList = res;
            // this.publicListCopy = this.publicList.slice();
            this.checkUncheck();
          });
        this.workflowApi
          .Get_FoldersAPI(this.username, this.authorApi.EntityID)
          .subscribe((res) => {
            this.privateList = [];
            res.forEach((element) => {
              if (element.PF_Folder_Name !== '') {
                this.privateList.push(element);
                // this.privateListCopy = this.privateList.slice();
                this.checkUncheck();
              }
            });
          });
        this.workflowApi
          .Get_FoldersAPI('ALL', this.authorApi.EntityID)
          .subscribe((res) => {
            this.allList = [];
            this.allList = res;
          });
        if (this.selectedProduct === 'ALL') {
          this.workflowApi.getRMWFilter('ALL');
        } else if (this.showbonds) {
          this.workflowApi.getRMWFilter(this.bondstempId);
        } else if (this.showmf) {
          this.workflowApi.getRMWFilter(this.fundstempId);
        } else if (this.showInsurance) {
          this.workflowApi.getRMWFilter(this.insurancestempId);
        } else if (this.showNifty) {
          this.workflowApi.getRMWFilter(this.niftyId);
        } else if (this.showSP) {
          this.workflowApi.getRMWFilter(this.spId);
        }
      } else {
        // this.filterString = '';
        this.displaySidebar = false;
      }
    }
    // const tempSaveFilter = this.saveFilter;
    // this.checkCcy = [];
    // tempSaveFilter.forEach(element => {
    //   if (element[0] === 'Ccy') {
    //     if (this.whereclause.includes(element[1])) {
    //       this.checkCcy[element[3]] = true;
    //     } else {
    //       this.saveFilter = this.removeFilter(element, this.saveFilter);
    //     }
    //   }

    // });
    this.checkUncheck();
  }

  toggleFilterSidebar() {
    this.filterLoader = true;
    this.popupFlag = false;
    this.toggleChecked = false;
    // console.log("this.toggleinfilter", this.toggleChecked);
    this.hideSideBar = !this.hideSideBar;
    this.cfs.HideSidebar(this.hideSideBar);
    this.closeRating();
    this.snpstring = '';
    this.fitchstring = '';
    this.moodyString = '';
    // this.filterString = '';
    // this.saveFilter = [];
    this.hideSidebar = !this.hideSidebar;
    if (this.hideSidebar === true) {
      this.displaySidebar = true;

      this.workflowApi
        .Get_FoldersAPI('', this.authorApi.EntityID)
        .subscribe((res) => {
          this.publicList = [];
          this.publicList = res;
          // this.publicListCopy = this.publicList.slice();
        });
      this.workflowApi
        .Get_FoldersAPI(this.username, this.authorApi.EntityID)
        .subscribe((res) => {
          this.privateList = [];
          res.forEach((element) => {
            if (element.PF_Folder_Name !== '') {
              this.privateList.push(element);
              this.privateListCopy = this.privateList.slice();
            }
          });
        });
      this.workflowApi
        .Get_FoldersAPI('ALL', this.authorApi.EntityID)
        .subscribe((res) => {
          this.allList = [];
          this.allList = res;
        });
      if (this.selectedProduct === 'ALL') {
        this.workflowApi.getRMWFilter('ALL');
      } else if (this.showbonds) {
        this.workflowApi.getRMWFilter(this.bondstempId);
      } else if (this.showmf) {
        this.workflowApi.getRMWFilter(this.fundstempId);
      } else if (this.showInsurance) {
        this.workflowApi.getRMWFilter(this.insurancestempId);
      } else if (this.showNifty) {
        this.workflowApi.getRMWFilter(this.niftyId);
      } else if (this.showSP) {
        this.workflowApi.getRMWFilter(this.spId);
      }
    } else {
      // this.filterString = '';
      this.displaySidebar = false;
    }
    // console.log("this.hideSidebar", this.hideSidebar);
    // console.log("this.displaySidebar", this.displaySidebar);
  }

  closeRating() {
    this.showmoodyRating = false;
    this.showsnpRating = false;
    this.showfitchRating = false;
  }

  showFilters(data) {
    this.filterArray = [];
    // this.filterString = "";
    data.forEach((element) => {
      if (element.RFM_Visible_YN === 'Y' && element.RFM_Display_Name !== '') {
        if (
          element.RFM_Display_Name === 'Annual Mgmt Fee' ||
          element.RFM_Display_Name === 'Entry Load' ||
          element.RFM_Display_Name === 'Risk Score' ||
          element.RFM_Display_Name === 'LTV ' ||
          // element.RFM_Display_Name === 'Coupon' ||
          element.RFM_Display_Name === 'Bond LTV'
        ) {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'slider',
            0,
            100,
            {
              floor: 0,
              ceil: 100,
            },
          ]);
        } else if (element.RFM_Display_Name === 'Min.Initial Inv.') {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'slider',
            '',
            '',
            {
              floor: 1000,
              ceil: 100000,
            },
          ]);
        } else if (element.RFM_Display_Name === 'Coupon') {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'slider',
            0,
            10,
            {
              floor: 0,
              ceil: 200,
            },
          ]);
        } else if (element.RFM_Display_Name.includes('YTM')) {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'slider',
            0,
            10,
            {
              floor: 0,
              ceil: 200,
            },
          ]);
        } else if (element.RFM_Display_Name.includes('Price')) {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'slider',
            80,
            150,
            {
              floor: 0,
              ceil: 200,
            },
          ]);
        } else if (element.RFM_Display_Name.includes('KO Barrier')) {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'slider',
            0,
            10,
            {
              floor: 0,
              ceil: 100,
            },
          ]);
        } else if (element.RFM_Display_Name.includes('KI Level')) {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'slider',
            0,
            10,
            {
              floor: 0,
              ceil: 100,
            },
          ]);
        } else if (element.RFM_Display_Name.includes('Strike (%) ')) {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'slider',
            0,
            10,
            {
              floor: 0,
              ceil: 100,
            },
          ]);
        } else if (element.RFM_Display_Name.includes('Note Price')) {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'slider',
            0,
            10,
            {
              floor: 0,
              ceil: 100,
            },
          ]);
        } else if (
          element.RFM_Display_Name === 'Risk Rating' ||
          element.RFM_Display_Name === 'PRR'
        ) {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'checkbox',
            50,
            150,
          ]);
        } else if (
          element.RFM_Display_Name === 'Public List' ||
          element.RFM_Display_Name === 'Private List'
        ) {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'dropdown',
            0,
            0,
            {
              floor: 0,
              ceil: 0,
            },
          ]);
        } else if (
          element.RFM_Display_Name === 'Bid YTM' ||
          element.RFM_Display_Name === 'Ask YTM'
        ) {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'slider',
            0,
            10,
            {
              floor: 0,
              ceil: 200,
            },
          ]);
        } else if (
          element.RFM_Display_Name === 'Ask Price' ||
          element.RFM_Display_Name === 'Bid Price'
        ) {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'slider',
            80,
            150,
            {
              floor: 0,
              ceil: 200,
            },
          ]);
        } else if (
          element.RFM_Display_Name === 'S&P Rating' ||
          element.RFM_Display_Name === "Moody's Rating" ||
          element.RFM_Display_Name === 'Fitch Rating'
        ) {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'Rating',
            0,
            0,
            {
              floor: 0,
              ceil: 0,
            },
          ]);
        } else if (element.RFM_Display_Name === 'Ccy') {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'ccy',
            0,
            0,
            {
              floor: 0,
              ceil: 0,
            },
          ]);
        } else if (element.RFM_Display_Name.includes('Date')) {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'date',
            0,
            0,
            {
              floor: 0,
              ceil: 0,
            },
          ]);
        } else {
          this.filterArray.push([
            element.RFM_Display_Name,
            element.RFM_Target_Field,
            'textbox',
            0,
            0,
          ]);
        }
      }
    });
    console.log('this.filterArray', this.filterArray);
    this.assetArr = [];
    this.isinArr = [];
    this.ratingArr = [];
    this.minInv = [];
    this.annualMgmt = [];
    this.ltvArr = [];
    this.entryArr = [];
    this.assetBonds = [];
    this.searchBonds = [];
    this.issuerBonds = [];
    this.bidAsk = [];
    this.listArr = [];
    this.filterArray.forEach((element) => {
      if (element[0] === 'Asset Class') {
        this.assetArr.push(element);
      } else if (element[0] === 'Annual Mgmt Fee') {
        this.annualMgmt.push(element);
      } else if (element[0] === 'Entry Load') {
        this.entryArr.push(element);
      } else if (element[0] === 'Asset Type') {
        this.assetBonds.push(element);
      } else if (
        element[0] === 'Search By Product' ||
        element[0] === 'Search By ISIN'
      ) {
        this.searchBonds.push(element);
      } else if (element[0] === 'Issuer' || element[0] === 'Guarantor') {
        this.issuerBonds.push(element);
      } else if (element[0] === 'Bid Price' || element[0] === 'Ask Price') {
        this.bidAsk.unshift(element);
      } else if (element[0] === 'Risk Rating' || element[0] === 'PRR') {
        this.ratingArr.push(element);
      } else if (
        element[0] === 'Public List' ||
        element[0] === 'Private List'
      ) {
        this.listArr.unshift(element);
      }
      // console.log("this.listArr", this.listArr);
    });
  }
  addFilter() {
    // console.log(this.saveFilter);
    this.portfoliopopflag = false;
    this.loader = true;
    if (this.showbonds || this.activeAll) {
      let snpstringData = [];
      snpstringData = this.snpstring.split(',');

      if (this.snpstring !== '') {
        snpstringData.forEach((element, i) => {
          if (
            this.filterString !== '' &&
            this.filterString.includes('NM.Misc1')
          ) {
            if (element !== '' && !this.filterString.includes(element)) {
              if (i === 0) {
                this.filterString =
                  this.filterString + 'and NM.Misc1 = ' + element;
              } else {
                this.filterString =
                  this.filterString + ' or NM.Misc1 = ' + element;
              }
            }
          } else {
            if (element !== '') {
              if (i === 0) {
                this.filterString =
                  this.filterString + 'and NM.Misc1 = ' + element;
              } else {
                this.filterString =
                  this.filterString + ' or NM.Misc1 = ' + element;
              }
            }
          }
        });

        // }
      }

      let fitchstringData = [];
      fitchstringData = this.fitchstring.split(',');
      if (this.fitchstring !== '') {
        fitchstringData.forEach((element, i) => {
          if (
            this.filterString !== '' &&
            this.filterString.includes('NM.Bond_Fitch_Rating')
          ) {
            if (element !== '' && !this.filterString.includes(element)) {
              if (i === 0) {
                this.filterString =
                  this.filterString + 'and NM.Bond_Fitch_Rating = ' + element;
              } else {
                this.filterString =
                  this.filterString + ' or NM.Bond_Fitch_Rating = ' + element;
              }
            }
          } else {
            if (element !== '') {
              if (i === 0) {
                this.filterString =
                  this.filterString + 'and NM.Bond_Fitch_Rating = ' + element;
              } else {
                this.filterString =
                  this.filterString + ' or NM.Bond_Fitch_Rating = ' + element;
              }
            }
          }
        });
      }

      let moodystringData = [];
      moodystringData = this.moodyString.split(',');
      if (this.moodyString !== '') {
        moodystringData.forEach((element, i) => {
          if (
            this.filterString !== '' &&
            this.filterString.includes('NM.Curve_Code')
          ) {
            if (element !== '' && !this.filterString.includes(element)) {
              if (i === 0) {
                this.filterString =
                  this.filterString + 'and NM.Curve_Code = ' + element;
              } else {
                this.filterString =
                  this.filterString + ' or NM.Curve_Code = ' + element;
              }
            }
          } else {
            if (element !== '') {
              if (i === 0) {
                this.filterString =
                  this.filterString + 'and NM.Curve_Code = ' + element;
              } else {
                this.filterString =
                  this.filterString + ' or NM.Curve_Code = ' + element;
              }
            }
          }
        });
      }
    }

    this.whereclause = '';
    if (this.selectedProduct === 'ALL') {
      // this.whereclause = 'Where Template_Code in ( \'Bonds\',\'Fund_Setup\',\'Product_Maintenance\')';

      this.whereclause =
        "Where Template_Code in ( 'Bonds','Fund_Setup','Product_Maintenance','NiftyParticipation')";
    } else {
      if(this.choice.includes(",")) { //Added by Alolika G | 19-02-2022
        this.whereclause = "Where Template_Code in " + this.choice ;
      } else {
        this.whereclause =
        "Where Template_Code = '" + this.selectedProduct + "'";
      }
      // this.whereclause = "Where Template_Code = '" + this.selectedProduct + "'";
    }
    if (this.ccy !== '') {
      this.whereclause =
        this.whereclause + ' and Currency in (' + this.ccy + ')';
    } else {
      let splitarray = [];
      splitarray = this.whereclause.split('and');
      splitarray.forEach((element) => {
        if (element.includes('Currency')) {
          this.whereclause = this.whereclause.replace('and' + element, '');
        }
      });
    }
    if (this.likes !== '') {
      this.whereclause = this.whereclause + this.likes;
    } else {
      let splitarray = [];
      splitarray = this.whereclause.split('and');
      splitarray.forEach((element) => {
        if (element.includes('Number_Of_Likes')) {
          this.whereclause = this.whereclause.replace('and' + element, '');
        }
      });
    }

    if (this.showbonds) {
      if (this.issuer !== '') {
        let splitArray = [];
        if (
          this.filterString === '' ||
          !this.filterString.includes('NM.Issuer')
        ) {
          this.filterString =
            this.filterString + ' and NM.Issuer in (' + this.issuer + ')';
        } else {
          splitArray = this.filterString.split('and');
          splitArray.forEach((element) => {
            if (element.includes('NM.Issuer')) {
              this.filterString = this.filterString.replace(
                element,
                ' NM.Issuer in (' + this.issuer + ')'
              );
            }
          });
        }
      } else {
        let splitarray = [];
        splitarray = this.filterString.split('and');
        splitarray.forEach((element) => {
          if (element.includes('NM.Issuer')) {
            this.filterString = this.filterString.replace('and' + element, '');
          }
        });
      }
    } else if (this.activeAll) {
      if (this.issuer1 !== '') {
        let splitArray = [];
        if (
          this.filterString === '' ||
          !this.filterString.includes('NM.Issuer')
        ) {
          this.filterString =
            this.filterString + ' and NM.Issuer in (' + this.issuer1 + ')';
        } else {
          splitArray = this.filterString.split('and');
          splitArray.forEach((element) => {
            if (element.includes('NM.Issuer')) {
              this.filterString = this.filterString.replace(
                element,
                ' NM.Issuer in (' + this.issuer1 + ')'
              );
            }
          });
        }
      } else {
        let splitarray = [];
        splitarray = this.filterString.split('and');
        splitarray.forEach((element) => {
          if (element.includes('NM.Issuer')) {
            this.filterString = this.filterString.replace('and' + element, '');
          }
        });
      }
    }

    if (this.fromDate !== '' && this.toDate !== '') {
      this.filterString =
        this.filterString +
        " and   NM.Maturity_Date between '" +
        this.fromDate +
        "' and '" +
        this.toDate +
        "'";
    }

    this.workflowApi.getRMWData(
      this.whereclause,
      this.username,
      this.filterString,
      this.selectedProduct === 'ALL' ? '' : this.selectedProduct,
      this.pageNo,
      this.authorApi.EntityID,
      this.pageSize,
      this.SortingCriteria,
      this.foldersString,
      this.ListType,
      '',
      ''
    );
    // this.filterString = '';

    this.saveRmwFilters();

    if (this.toggleChecked) {
      this.togglePopup();
    }
  }

  saveRmwFilters() {
    // sessionStorage.setItem('riskProfile', this.riskProfileArray);
    // this.filterString = this.filterString.replace("and RIGHT(NM.Note_Product_Rating, 1) between '1' and '" + this.homeapi.RiskRating.split('')[1] + "'", "");
    if (this.showbonds) {
      this.stringBonds = '';
      this.folderName = '';
      this.liststring = '';
      this.stringBonds = this.filterString.replace("and RIGHT(NM.Note_Product_Rating, 1) between '1' and '" + this.homeapi.RiskRating?.split('')[1] + "'", ""); //Added by Alolika | 25-02-2022
      sessionStorage.setItem('stringBonds', this.stringBonds);
      this.ccyBonds = this.ccy;
      this.folderName = this.foldersString;
      this.liststring = this.ListType;
      this.filterBonds = [];
      this.filterBonds = this.saveFilter;
      this.search_Bonds = this.searchBarString;
      this.likesBonds = this.likes;
      sessionStorage.setItem('filterBonds', JSON.stringify(this.filterBonds));
      sessionStorage.setItem('folderName', this.folderName);
      sessionStorage.setItem('liststring', this.liststring);
      sessionStorage.setItem('ccyBonds', this.ccyBonds);
      sessionStorage.setItem('search_Bonds', this.search_Bonds);
      sessionStorage.setItem('likesBonds', this.likesBonds);

      // if (this.filterBonds.length === 0) {
      //   // this.filterBonds.push(this.saveFilter);
      //   this.filterBonds = this.saveFilter;
      // } else {
      //   this.filterBonds = [];
      //   this.filterBonds = this.saveFilter;
      // }
    } else if (this.showmf) {
      this.folderName1 = '';
      this.liststring1 = '';
      this.stringFunds = '';
      this.stringFunds = this.filterString.replace("and RIGHT(NM.Note_Product_Rating, 1) between '1' and '" + this.homeapi.RiskRating?.split('')[1] + "'", "");//Added by Alolika | 25-02-2022
      sessionStorage.setItem('stringFunds', this.stringFunds);
      this.ccyFunds = this.ccy;
      this.folderName1 = this.foldersString;
      this.liststring1 = this.ListType;
      this.filterFunds = [];
      this.filterFunds = this.saveFilter;
      this.search_Funds = this.searchBarString;
      this.likesFunds = this.likes;
      sessionStorage.setItem('filterFunds', JSON.stringify(this.filterFunds));
      sessionStorage.setItem('folderName1', this.folderName1);
      sessionStorage.setItem('liststring1', this.liststring1);
      sessionStorage.setItem('ccyFunds', this.ccyFunds);
      sessionStorage.setItem('search_Funds', this.search_Funds);
      sessionStorage.setItem('likesFunds', this.likesFunds);
    } else if (this.showInsurance) {
      this.stringInsurance = '';
      this.folderName2 = '';
      this.liststring2 = '';
      this.stringInsurance = this.filterString.replace("and RIGHT(NM.Note_Product_Rating, 1) between '1' and '" + this.homeapi.RiskRating?.split('')[1] + "'", "");//Added by Alolika | 25-02-2022
      sessionStorage.setItem('stringInsurance', this.stringInsurance);
      this.ccyInsurance = this.ccy;
      this.folderName2 = this.foldersString;
      this.liststring2 = this.ListType;
      this.filterInsurance = [];
      this.filterInsurance = this.saveFilter;
      this.search_Insurance = this.searchBarString;
      this.likesInsurance = this.likes;
      sessionStorage.setItem(
        'filterInsurance',
        JSON.stringify(this.filterInsurance)
      );
      sessionStorage.setItem('folderName2', this.folderName2);
      sessionStorage.setItem('liststring2', this.liststring2);
      sessionStorage.setItem('ccyInsurance', this.ccyInsurance);
      sessionStorage.setItem('search_Insurance', this.search_Insurance);
      sessionStorage.setItem('likesInsurance', this.likesInsurance);
    } else if (this.activeAll) {
      // console.log("all");
      // this.stringAll = stringAll; 'Ruchira M || 17-02-2022
      this.folderName3 = '';
      this.liststring3 = '';
      this.stringAll = this.filterString.replace("and RIGHT(NM.Note_Product_Rating, 1) between '1' and '" + this.homeapi.RiskRating?.split('')[1] + "'", "");//Added by Alolika | 25-02-2022
      sessionStorage.setItem('stringAll', this.stringAll);
      this.ccyAll = this.ccy;
      this.folderName3 = this.foldersString;
      this.liststring3 = this.ListType;
      this.filterAll = [];
      this.filterAll = this.saveFilter;
      this.search_All = this.searchBarString;
      this.likesAll = this.likes;
      sessionStorage.setItem('filterAll', JSON.stringify(this.filterAll));
      sessionStorage.setItem('folderName3', this.folderName3);
      sessionStorage.setItem('liststring3', this.liststring3);
      sessionStorage.setItem('ccyAll', this.ccyAll);
      sessionStorage.setItem('search_All', this.search_All);
      sessionStorage.setItem('likesAll', this.likesAll);
    } else if (this.showNifty) {
      this.stringNifty = '';
      this.folderName4 = '';
      this.liststring4 = '';
      this.stringNifty = this.filterString.replace("and RIGHT(NM.Note_Product_Rating, 1) between '1' and '" + this.homeapi.RiskRating?.split('')[1] + "'", "");//Added by Alolika | 25-02-2022
      sessionStorage.setItem('stringNifty', this.stringNifty);
      this.ccyNifty = this.ccy;
      this.folderName4 = this.foldersString;
      this.liststring4 = this.ListType;
      this.filterNifty = [];
      this.filterNifty = this.saveFilter;
      this.search_Nifty = this.searchBarString;
      this.likesNifty = this.likes;
      sessionStorage.setItem('filterNifty', JSON.stringify(this.filterNifty));
      sessionStorage.setItem('folderName4', this.folderName4);
      sessionStorage.setItem('liststring4', this.liststring4);
      sessionStorage.setItem('ccyNifty', this.ccyNifty);
      sessionStorage.setItem('search_Nifty', this.search_Nifty);
      sessionStorage.setItem('likesNifty', this.likesNifty);
    } else if (this.showSP) {
      this.stringSP = '';
      this.folderName5 = '';
      this.liststring5 = '';
      this.stringSP = this.filterString.replace("and RIGHT(NM.Note_Product_Rating, 1) between '1' and '" + this.homeapi.RiskRating?.split('')[1] + "'", "");//Added by Alolika | 25-02-2022
      sessionStorage.setItem('stringSP', this.stringSP);
      this.ccySP = this.ccy;
      this.folderName5 = this.foldersString;
      this.liststring5 = this.ListType;
      this.filterSP = [];
      this.filterSP = this.saveFilter;
      this.search_SP = this.searchBarString;
      this.likesSP = this.likes;
      sessionStorage.setItem('filterSP', JSON.stringify(this.filterSP));
      sessionStorage.setItem('folderName5', this.folderName5);
      sessionStorage.setItem('liststring5', this.liststring5);
      sessionStorage.setItem('ccySP', this.ccySP);
      sessionStorage.setItem('search_SP', this.search_SP);
      sessionStorage.setItem('likesSP', this.likesSP);
    }
  }

  clearFilter() {
    this.filterFlag = false;
    this.portfoliopopflag = false;
    this.filterString = "and RIGHT(NM.Note_Product_Rating, 1) between '1' and '" + this.homeapi.RiskRating?.split('')[1] + "'"; //Added by Alolika | 17-02-2022
    this.ccy = '';
    this.issuer = '';
    this.issuer1 = '';
    this.assetType = '';
    this.snpstring = '';
    this.fitchstring = '';
    this.moodyRating = '';
    this.saveFilter = [];
    this.foldersString = '';
    this.ListType = '';
    this.disabled = false;
    this.disabled1 = false;
    this.searchBarString = '';
    // if (this.showbonds) {
    //   sessionStorage.setItem('stringBonds', '');
    //   sessionStorage.setItem('filterBonds', JSON.stringify([]));
    // } else if (this.showmf) {
    //   sessionStorage.setItem('stringFunds', '');
    //   sessionStorage.setItem('filterFunds', JSON.stringify([]));
    // } else if (this.showInsurance) {
    //   sessionStorage.setItem('stringInsurance', '');
    //   sessionStorage.setItem('filterInsurance', JSON.stringify([]));
    // } else if (this.activeAll) {
    //   sessionStorage.setItem('stringAll', '');
    //   sessionStorage.setItem('filterAll', JSON.stringify([]));
    // }

    this.searchInput.forEach((element) => {
      element.nativeElement.value = '';
    });

    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });

    // if (this.clearFlag) {
    this.checkRiskProfile = false;
    this.homeapi.riskProfileArray.forEach((element, i) => {
      if (this.selectedProduct === element.product) {
        this.homeapi.riskProfileArray[i].value = this.checkRiskProfile;
      }
    });
    // }

    this.whereclause = '';
    if (this.selectedProduct === 'ALL') {
      // this.whereclause = 'Where Template_Code in ( \'Bonds\',\'Fund_Setup\',\'Product_Maintenance\')';

      this.whereclause =
        "Where Template_Code in ( 'Bonds','Fund_Setup','Product_Maintenance','NiftyParticipation')";
    } else {
      if(this.choice.includes(",")) {  //Added by Alolika G | 19-02-2022
        this.whereclause = "Where Template_Code in " + this.choice ;
      } else {
        this.whereclause =
        "Where Template_Code = '" + this.selectedProduct + "'";
      }
      // this.whereclause = "Where Template_Code = '" + this.selectedProduct + "'";
    }
    this.workflowApi.getRMWData(
      this.whereclause,
      this.username,
      this.filterString,
      this.selectedProduct === 'ALL' ? '' : this.selectedProduct,
      this.pageNo,
      this.authorApi.EntityID,
      this.pageSize,
      '',
      '',
      '',
      '',
      ''
    );

    if (this.selectedProduct === 'ALL') {
      this.workflowApi.getRMWFilter('ALL');
    } else if (this.showbonds) {
      this.workflowApi.getRMWFilter(this.bondstempId);
    } else if (this.showmf) {
      this.workflowApi.getRMWFilter(this.fundstempId);
    } else if (this.showInsurance) {
      this.workflowApi.getRMWFilter(this.insurancestempId);
    } else if (this.showNifty) {
      this.workflowApi.getRMWFilter(this.niftyId);
    } else if (this.showSP) {
      this.workflowApi.getRMWFilter(this.spId);
    }
    this.saveRmwFilters();
  }

  toggleHelper(i: number) {
    this.el.toArray()[i].nativeElement.classList.toggle('active');
    const panel = this.el.toArray()[i].nativeElement.nextElementSibling;
    // alert( panel.scrollHeight);
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  }

  moreFilters(i: number) {
    this.el.toArray()[i].nativeElement.classList.toggle('active2');
    this.moreLessFilters = !this.moreLessFilters;
    if (this.moreLessFilters === true) {
      this.moreFilter = 'Less Filters  -';
    } else {
      this.moreFilter = 'More Filters  +';
    }
  }

  riskratingChange(i, item, Checked, index, header) {
    if (Checked) {
      if(this.templateName === 'Funds') { //Added by Alolika G | 19-02-2022
        item = 'NM.Note_Product_Rating';
      }
      this.saveFilter.push([header, i, item, index]);
      // this.saveFilter.push(['Risk Rating', i, item, index]);
      if (!this.filterString.includes(item)) {
        this.filterString =
          this.filterString + 'and ' + item + " like '" + '%' + i + "%'";
      } else if (this.filterString.includes(item)) {
        this.filterString =
          this.filterString + ' or ' + item + " like '" + '%' + i + "%'";
      }
    } else {
      this.removeFilter([header, i, item, index], []);
    }
  }

  changeAssetTypeItem(assetItem) {
    this.assetItems.forEach((l) => {
      if (assetItem === l.Name) {
        l.isChecked = true;
      }
    });

    let flag = false;
    // if(Checked) {
    if (this.saveFilter.length > 0) {
      this.saveFilter.forEach((element) => {
        if (element[2] === 'NM.Note_Scheme_Type') {
          flag = true;
          this.saveFilter = this.saveFilter.filter(
            (item) => item[1] !== element[1]
          );
          this.removeFilter(
            ['Asset Type', element[1], 'NM.Note_Scheme_Type'],
            []
          );
          if (!element[1].includes(assetItem)) {
            this.saveFilter.push([
              'Asset Type',
              assetItem,
              'NM.Note_Scheme_Type',
            ]);
          }
          return;
        }
      });
      if (flag === false) {
        this.saveFilter.push(['Asset Type', assetItem, 'NM.Note_Scheme_Type']);
      }
    } else {
      this.saveFilter.push(['Asset Type', assetItem, 'NM.Note_Scheme_Type']);
    }

    if (!this.filterString.includes('Note_Scheme_Type')) {
      this.filterString =
        this.filterString + "and NM.Note_Scheme_Type='" + assetItem + "'";
    } else if (this.filterString.includes('Note_Scheme_Type')) {
      this.filterString = this.filterString.replace(
        this.filterString.split('Note_Scheme_Type')[1].split('%')[0],
        " like '" + assetItem
      );
    }
  }

  changeIssuerItem(issuerItem, Checked?, index?, name?) {
    if (Checked) {
      if (this.showbonds) {
        if (!this.issuer.includes(issuerItem)) {
          if (this.issuer !== '') {
            this.issuer = this.issuer + ",'" + issuerItem + "'";
          } else {
            this.issuer = this.issuer + "'" + issuerItem + "'";
          }
        }
      } else if (this.activeAll) {
        if (!this.issuer1.includes(issuerItem)) {
          if (this.issuer1 !== '') {
            this.issuer1 = this.issuer + ",'" + issuerItem + "'";
          } else {
            this.issuer1 = this.issuer + "'" + issuerItem + "'";
          }
        }
      }

      this.saveFilter.push(['Issuer', name, 'NM.Issuer', index, issuerItem]);
      // if (!this.filterString.includes('Issuer')) {
      //   // this.whereclause = this.whereclause + ' and Currency in (' + this.ccy + ')';
      //   this.filterString =
      //     this.filterString +
      //     + ' and NM.Issuer in (' + this.issuer + ')';
      // } else if (this.filterString.includes('Issuer')) {
      //   this.filterString =
      //     this.filterString + 'or NM.Issuer = \'' + issuerItem + "\'";
      // }
    } else {
      this.removeFilter(['Issuer', name, 'NM.Issuer', index, issuerItem], []);
    }
  }

  selectExchange(exchange) {
    this.fillExchangeDdl.forEach((l) => {
      if (exchange === l.Long_Name) {
        l.isChecked = true;
      }
    });

    let flag = false;
    // if(Checked) {
    if (this.saveFilter.length > 0) {
      this.saveFilter.forEach((element) => {
        if (element[2] === 'Exchange') {
          flag = true;
          this.saveFilter = this.saveFilter.filter(
            (item) => item[1] !== element[1]
          );
          this.removeFilter(['Exchange', element[1], 'Exchange'], []);
          if (!element[1].includes(exchange)) {
            this.saveFilter.push(['Exchange', exchange, 'Exchange']);
          }
          return;
        }
      });
      if (flag === false) {
        this.saveFilter.push(['Exchange', exchange, 'Exchange']);
      }
    } else {
      this.saveFilter.push(['Exchange', exchange, 'Exchange']);
    }

    if (!this.filterString.includes('Exchange')) {
      this.filterString =
        this.filterString + 'and ' + 'Exchange' + " like '" + exchange + "%'";
    } else if (this.filterString.includes('Exchange')) {
      this.filterString = this.filterString.replace(
        this.filterString.split('Exchange')[1].split('%')[0],
        " like '" + exchange
      );
    }
  }

  selectBondType(bondtype) {
    this.fillGenericSQLDdl.forEach((l) => {
      if (bondtype === l.DisplayField) {
        l.isChecked = true;
      }
    });
    let flag = false;
    if (this.saveFilter.length > 0) {
      this.saveFilter.forEach((element) => {
        if (element[2] === 'Bond Type') {
          flag = true;
          this.saveFilter = this.saveFilter.filter(
            (item) => item[1] !== element[1]
          );
          this.removeFilter(['Bond Type', element[1], 'Bond Type'], []);
          if (!element[1].includes(bondtype)) {
            this.saveFilter.push(['Bond Type', bondtype, 'Bond Type']);
          }
          return;
        }
        // else{
        //   if((!element[1].includes(bondtype))) {
        //       this.saveFilter.push(['Bond Type',bondtype, 'Bond Type']);
        //     }
        // }
      });
      if (flag === false) {
        this.saveFilter.push(['Bond Type', bondtype, 'Bond Type']);
      }
    } else {
      this.saveFilter.push(['Bond Type', bondtype, 'Bond Type']);
    }

    if (!this.filterString.includes('Bond Type')) {
      this.filterString =
        this.filterString + 'and ' + 'Bond Type' + " like '" + bondtype + "%'";
    } else if (this.filterString.includes('Bond Type')) {
      this.filterString = this.filterString.replace(
        this.filterString.split('Bond Type')[1].split('%')[0],
        " like '" + bondtype
      );
    }
  }

  sliderEvent(item, min, max, header) {
    let flag = false;
    if (this.saveFilter.length > 0) {
      this.saveFilter.forEach((element) => {
        if (element[2] === item) {
          flag = true;
          this.saveFilter = this.saveFilter.filter(
            (item) => item[0] !== element[0]
          );
          if (!element[1].includes(header)) {
            this.saveFilter.push([header, min + '-' + max, item, 'slider']);
          }
          return;
        }
      });
      if (flag === false) {
        this.saveFilter.push([header, min + '-' + max, item, 'slider']);
      }
    } else {
      this.saveFilter.push([header, min + '-' + max, item, 'slider']);
    }

    if (item.includes(min)) {
      min = min * 1000;
      max = max * 1000;
    }
    if (!this.filterString.includes(item)) {
      this.filterString =
        this.filterString +
        'and ' +
        item +
        ' >= ' +
        min +
        ' and ' +
        item +
        ' <= ' +
        max;
    } else if (this.filterString.includes(item)) {
      this.filterString = this.filterString.replace(
        this.filterString.split(item)[1],
        ' >= ' + min + ' and '
      );

      this.filterString = this.filterString.replace(
        this.filterString.split(item)[2].split('and ')[0],
        ' <= ' + max
      );
    }
  }
  changePrivateItem(privateItem) {
    if (!this.disabled) {
      this.disabled1 = true;
      this.privateList.forEach((l) => {
        if (privateItem === l.PF_Folder_Name) {
          l.isChecked = true;
        }
      });
      let flag = false;
      if (this.saveFilter.length > 0) {
        this.saveFilter.forEach((element) => {
          if (element[2] === 'Private List') {
            flag = true;
            this.saveFilter = this.saveFilter.filter(
              (item) => item[1] !== element[1]
            );
            this.removeFilter(['Private List', element[1], 'Private List'], []);
            // if (!element[1].includes(privateItem)) {
            if (element[1] !== privateItem) {
              this.saveFilter.push([
                'Private List',
                privateItem,
                'Private List',
              ]);
              this.disabled1 = true;
              this.disabled = false;
            }
            return;
          }
        });
        if (flag === false) {
          this.saveFilter.push(['Private List', privateItem, 'Private List']);
          this.disabled1 = true;
          this.disabled = false;
        }
      } else {
        this.saveFilter.push(['Private List', privateItem, 'Private List']);
        this.disabled1 = true;
        this.disabled = false;
      }

      this.ListType = 'Private';
      this.foldersString = privateItem;
      // console.log('privateItem chnage', this.filterString);
    } else {
      this.disabled1 = false;
    }
    this.ListType = 'Private';
    this.foldersString = privateItem;
    // if (!this.filterString.includes('Private List')) {
    //   this.filterString =
    //     this.filterString +
    //     'and ' +
    //     'Private List' +
    //     ' like \'' +
    //     privateItem +
    //     '%\'';
    // } else if (this.filterString.includes('Private List')) {
  }
  changePublicItem(publicItem, index) {
    // console.log("checked", index);
    if (!this.disabled1) {
      this.disabled = true;
      this.publicList.forEach((l) => {
        if (publicItem === l.PF_Folder_Name) {
          l.isChecked = true;
        }
      });
      let flag = false;
      if (this.saveFilter.length > 0) {
        this.saveFilter.forEach((element) => {
          if (element[2] === 'Public List') {
            flag = true;
            this.saveFilter = this.saveFilter.filter(
              (item) => item[1] !== element[1]
            );
            this.removeFilter(
              ['Public List', element[1], 'Public List', index],
              []
            );
            // if (!element[1].includes(publicItem)) {
            if (element[1] !== publicItem) {
              this.saveFilter.push([
                'Public List',
                publicItem,
                'Public List',
                index,
              ]);
              this.disabled1 = false;
              this.disabled = true;
            }
            return;
          }
        });
        if (flag === false) {
          this.saveFilter.push([
            'Public List',
            publicItem,
            'Public List',
            index,
          ]);
          this.disabled1 = false;
          this.disabled = true;
        }
      } else {
        this.saveFilter.push(['Public List', publicItem, 'Public List', index]);
        this.disabled1 = false;
        this.disabled = true;
      }
      this.ListType = 'Public';
      this.foldersString = publicItem;
    } else {
      this.disabled = false;
    }
  }
  selectccy(value, Checked, index) {
    if (Checked) {
      this.saveFilter.push(['Ccy', value, 'Currency', index]);
      if (!this.ccy.includes(value)) {
        if (this.ccy !== '') {
          this.ccy = this.ccy + ",'" + value + "'";
        } else {
          this.ccy = this.ccy + "'" + value + "'";
        }
      }
    } else {
      this.removeFilter(['Ccy', value, 'Currency', index], []);
    }
  }

  selectfitch(value, Checked, index) {
    if (Checked) {
      this.saveFilter.push(['Fitch', value, 'NM.Bond_Fitch_Rating', index]);
      if (!this.fitchstring.includes(value)) {
        if (this.fitchstring !== '') {
          this.fitchstring = this.fitchstring + ",'" + value + "'";
        } else {
          this.fitchstring = this.fitchstring + "'" + value + "'";
        }
      }
    } else {
      this.removeFilter(['Fitch', value, 'NM.Bond_Fitch_Rating', index], []);
    }
  }

  selectMoody(value, Checked, index) {
    if (Checked) {
      this.saveFilter.push(["Moody's", value, 'NM.Curve_Code', index]);
      if (!this.moodyString.includes(value)) {
        if (this.moodyString !== '') {
          this.moodyString = this.moodyString + ",'" + value + "'";
        } else {
          this.moodyString = this.moodyString + "'" + value + "'";
        }
      }
    } else {
      this.removeFilter(["Moody's", value, 'NM.Curve_Code', index], []);
    }
  }

  selectsnp(value, Checked, index) {
    if (Checked) {
      this.saveFilter.push(['S&P', value, 'NM.Misc1', index]);
      if (!this.snpstring.includes(value)) {
        if (this.snpstring !== '') {
          this.snpstring = this.snpstring + ",'" + value + "'";
        } else {
          this.snpstring = this.snpstring + "'" + value + "'";
        }
      }
    } else {
      this.removeFilter(['S&P', value, 'NM.Misc1', index], []);
    }
  }

  changeRating(prod: any) {
    try {
      switch (prod) {
        case 1:
          this.accord1 = 1;
          break;
        case 2:
          this.accord1 = 2;

          break;
        case 3:
          this.accord1 = 3;
          return false;
          break;
        case 4:
          break;

        default:
          break;
      }
    } catch (error) {}
  }

  displaysnprating() {
    this.showsnpRating === true
      ? (this.showsnpRating = false)
      : (this.showsnpRating = true);
    this.showmoodyRating = false;
    this.showfitchRating = false;
  }
  displaymoodyRating() {
    this.showmoodyRating === true
      ? (this.showmoodyRating = false)
      : (this.showmoodyRating = true);
    this.showsnpRating = false;
    this.showfitchRating = false;
  }
  displayfitchRating() {
    this.showfitchRating === true
      ? (this.showfitchRating = false)
      : (this.showfitchRating = true);
    this.showmoodyRating = false;
    this.showsnpRating = false;
  }

  textChangeSearch(e) {
    this.pageload = false;
    this.loader = true;
    // this.pageSize = ""
    // this.pageNo = "";
    this.searchBarString = e.target.value;
    this.getRMWSearch(this.searchBarString);
  }

  getRMWSearch(searchBarString) {
    this.filterString = this.rateFilterString + this.filterString; //Added by Alolika | 25-02-2022
    if (searchBarString.length > 0) {
      this.workflowApi
        .getRMWDataforSearch(
          this.whereclause,
          this.username,
          this.filterString,
          this.selectedProduct === 'ALL' ? '' : this.selectedProduct,
          '',
          this.authorApi.EntityID,
          '',
          this.SortingCriteria,
          this.foldersString,
          this.ListType,
          searchBarString,
          ''
        )
        .subscribe((res) => {
          if (res.length !== 0) {
            if (res.RMWGenericResponse.Count !== null) {
              this.msg = '';
              this.rmwdata = [];
              this.length = res.RMWGenericResponse.Count;
              res = res.RMWGenericResponse;
              this.rmwdata = JSON.parse(res.items.replace(/\n/g, ''));

              for (let i = 0; i < this.rmwdata.length; i++) {
                this.showFactsheet[i] = false;
                this.rmwdata[i].Maturity_Date = this.ccfs.checkAndFormatDate(
                  this.rmwdata[i].Maturity_Date
                );
                this.rmwdata[i].Value_Date = this.ccfs.checkAndFormatDate(
                  this.rmwdata[i].Value_Date
                );
              }
              // console.log("rmwdata", this.rmwdata);
              this.templateID = this.rmwdata[0].Template_ID;
              sessionStorage.setItem('templateID', this.templateID);
              // switch (this.selectedProduct) {
              //   case 'ALL':
              //     this.alltempId = !this.alltempId ? this.templateID : this.alltempId;
              //     break;

              // case 'Fund_Setup':
              //   this.fundstempId = !this.fundstempId ? this.templateID : this.fundstempId;
              //   break;

              // case 'Bonds':
              //   this.bondstempId = !this.bondstempId ? this.templateID : this.bondstempId;
              //   break;

              // case 'Product_Maintenance':
              //   this.insurancestempId = !this.insurancestempId ? this.templateID : this.insurancestempId;

              //   break;

              // }

              if (this.selectedProduct === 'All') {
                this.workflowApi.getRMWSortingData('');
              } else {
                this.workflowApi.getRMWSortingData(this.templateID);
              }
              // this.workflowApi.getRMWActionLinks(this.templateID, this.userType);
              this.loader = false;
            } else {
              this.rmwdata = [];
              this.length = 0;
              // this.msg = 'No Record Found';
              this.loader = false;
              this.workflowApi.getRMWData(
                this.whereclause,
                this.username,
                this.filterString,
                this.selectedProduct === 'ALL' ? '' : this.selectedProduct,
                '',
                this.authorApi.EntityID,
                '',
                this.SortingCriteria,
                this.foldersString,
                this.ListType,
                '',
                searchBarString
              );
            }
          }
          this.saveRmwFilters();
        });
    } else {
      this.workflowApi.getRMWData(
        this.whereclause,
        this.username,
        this.filterString,
        this.selectedProduct === 'ALL' ? '' : this.selectedProduct,
        1,
        this.authorApi.EntityID,
        5,
        this.SortingCriteria,
        this.foldersString,
        this.ListType,
        '',
        ''
      );
      this.saveRmwFilters();
    }
  }

  textChange(e, item, header) {
    if (e.target.value.length > 0) {
      let flag = false;
      if (this.saveFilter.length > 0) {
        this.saveFilter.forEach((element) => {
          if (element[2] === item) {
            flag = true;
            this.saveFilter = this.saveFilter.filter(
              (item) => item[1] !== element[1]
            );
            if (header.includes('Search')) {
              this.textFlag = true;
              this.removeFilter(
                [this.lastIndexElement, e.target.value, item, 'search', header],
                []
              );
            } else {
              this.textFlag = false;
              this.removeFilter(
                [header, e.target.value, item, 'search', header],
                []
              );
            }
            if (!element[1].includes(e.target.value)) {
              if (header.includes('Search')) {
                this.textFlag = true;
                let splitarray = [];
                this.lastIndexElement = '';
                splitarray = header.split(' ');
                this.lastIndexElement = splitarray[splitarray.length - 1];
                this.saveFilter.push([
                  this.lastIndexElement,
                  e.target.value,
                  item,
                  'search',
                  header,
                ]);
              } else {
                this.textFlag = false;
                this.saveFilter.push([
                  header,
                  e.target.value,
                  item,
                  'search',
                  header,
                ]);
              }
            }
            return;
          }
        });
        if (flag === false) {
          if (header.includes('Search')) {
            this.textFlag = true;
            let splitarray = [];
            this.lastIndexElement = '';
            splitarray = header.split(' ');
            this.lastIndexElement = splitarray[splitarray.length - 1];
            this.saveFilter.push([
              this.lastIndexElement,
              e.target.value,
              item,
              'search',
              header,
            ]);
          } else {
            this.textFlag = false;
            this.saveFilter.push([
              header,
              e.target.value,
              item,
              'search',
              header,
            ]);
          }
        }
      } else {
        if (header.includes('Search')) {
          this.textFlag = true;
          let splitarray = [];
          this.lastIndexElement = '';
          splitarray = header.split(' ');
          this.lastIndexElement = splitarray[splitarray.length - 1];
          this.saveFilter.push([
            this.lastIndexElement,
            e.target.value,
            item,
            'search',
            header,
          ]);
        } else {
          this.textFlag = false;
          this.saveFilter.push([
            header,
            e.target.value,
            item,
            'search',
            header,
          ]);
        }
      }

      // this.saveFilter.push([header, e.target.value, item, 'search']);

      if (!this.filterString.includes(item)) {
        this.filterString =
          this.filterString + 'and ' + item + " like '" + e.target.value + "%'";
      } else if (this.filterString.includes(item)) {
        this.filterString = this.filterString.replace(
          this.filterString.split(item)[1].split('%')[0],
          " like '" + e.target.value
        );
      }
    } else {
      if (header.includes('Search')) {
        this.textFlag = true;
        this.removeFilter(
          [this.lastIndexElement, e.target.value, item, 'search', header],
          []
        );
      } else {
        this.textFlag = false;
        this.removeFilter([header, e.target.value, item, 'search', header], []);
      }
      // this.removeFilter(['Ccy',value,'Currency',index]);
    }

    // console.log(this.filterString);
  }

  riskprofileChanged() {
    // this.checkRiskProfile = !this.checkRiskProfile;
    this.homeapi.riskProfileArray.forEach((element, i) => {
      if (this.selectedProduct === element.product) {
        this.homeapi.riskProfileArray[i].value = this.checkRiskProfile;
      }
    });
    let flag = false;
    if (this.checkRiskProfile) {
      if (this.saveFilter.length > 0) {
        this.saveFilter.forEach((element) => {
          if (element[2] === 'NM.Exotic_Misc6') {
            flag = true;
            this.saveFilter = this.saveFilter.filter(
              (item) => item[1] !== element[1]
            );
            this.removeFilter(
              ['Risk Profile', element[1], 'NM.Exotic_Misc6'],
              []
            );
            this.saveFilter.push([
              'Risk Profile',
              this.RiskProfile,
              'NM.Exotic_Misc6',
            ]);
            return;
          }
        });
        if (flag === false) {
          this.saveFilter.push([
            'Risk Profile',
            this.RiskProfile,
            'NM.Exotic_Misc6',
          ]);
        }
      } else {
        this.saveFilter.push([
          'Risk Profile',
          this.RiskProfile,
          'NM.Exotic_Misc6',
        ]);
      }

      if (!this.filterString.includes('Exotic_Misc6')) {
        // this.saveFilter.push(['Risk Profile', this.RiskProfile, 'NM.Exotic_Misc6']);
        if (this.RiskProfile === null || this.RiskProfile === undefined) {
          this.filterString = this.filterString;
        } else {
          this.filterString =
            this.filterString +
            "and NM.Exotic_Misc6 like '%" +
            this.RiskProfile +
            "%'";
        }
      }
    } else {
      this.removeFilter(
        ['Risk Profile', this.RiskProfile, 'NM.Exotic_Misc6'],
        []
      );
    }
    // if (this.checkRiskProfile) {
    //   // this.removeFilter(['Risk Profile', this.RiskProfile, 'NM.Exotic_Misc6'], []);
    //   if (this.saveFilter.length > 0) {
    //     this.saveFilter.forEach((element) => {
    //       if (!element[2].includes('NM.Exotic_Misc6')) {
    //         this.saveFilter.push([
    //           'Risk Profile',
    //           this.RiskProfile,
    //           'NM.Exotic_Misc6',
    //         ]);
    //       } else {
    //       }
    //     });
    //   } else {
    //     this.saveFilter.push([
    //       'Risk Profile',
    //       this.RiskProfile,
    //       'NM.Exotic_Misc6',
    //     ]);
    //   }

    //   if (!this.filterString.includes('Exotic_Misc6')) {
    //     // this.saveFilter.push(['Risk Profile', this.RiskProfile, 'NM.Exotic_Misc6']);
    //     if (this.RiskProfile === null || this.RiskProfile === undefined) {
    //       this.filterString = this.filterString;
    //     } else {
    //       this.filterString =
    //         this.filterString +
    //         "and NM.Exotic_Misc6 like '%" +
    //         this.RiskProfile +
    //         "%'";
    //     }
    //   }
    //   // else if (this.filterString.includes('Exotic_Misc6')) {
    //   //   this.filterString =
    //   //     this.filterString + 'or NM.Exotic_Misc6 like \'%' + this.RiskProfile + '%\'';
    //   // }
    // } else {
    //   this.removeFilter(
    //     ['Risk Profile', this.RiskProfile, 'NM.Exotic_Misc6'],
    //     []
    //   );
    //   // console.log('and NM.Exotic_Misc6 like' +this.filterString.split('and NM.Exotic_Misc6 like')[1].split('and')[0])
    //   // if(this.filterString !== "") {
    //   //   if (this.filterString.includes('and NM.Exotic_Misc6 like' +this.filterString.split('and NM.Exotic_Misc6 like')[1].split('and')[0])){
    //   //     this.filterString = this.filterString.replace('and NM.Exotic_Misc6 like' +this.filterString.split('and NM.Exotic_Misc6 like')[1].split('and')[0] , '');
    //   //   }
    //   // }
    // }
    // this.saveRmwFilters();
    this.addFilter();
  }

  selectDate(date) {
    return this.datepipe.transform(date, 'dd-MMM-yyyy');
  }

  removeFilter(item, filterArr: any[]) {
    // console.log("this.Checked", this.Checked);

    if (item[0] === 'Ccy') {
      // this.checkCcy[item[3]] = false;
      this.currencyList.forEach((i) => {
        if (item[1] === i.Code) {
          i.selected = false;
        }
      });
      if (this.ccy.length > 0) {
        if (this.ccy.includes(item[1])) {
          let listarray = [];
          listarray = this.ccy.split(',');
          listarray.forEach((_element, i) => {
            if (listarray.length > 1) {
              if (i === 0) {
                this.ccy = this.ccy.replace("'" + item[1] + "',", '');
              } else {
                this.ccy = this.ccy.replace(",'" + item[1] + "'", '');
              }
            } else {
              this.ccy = this.ccy.replace("'" + item[1] + "'", '');
            }
          });
        }
      }
    } else if (item[0] === 'PRR' || item[0] === 'Risk Rating') {
      this.checkboxArray.forEach((i) => {
        if (item[1] === i.rate) {
          i.selected = false;
        }
      });
      // this.Checked[item[3]] = false;
    } else if (item[0] === 'Issuer') {
      if (this.showbonds) {
        // this.checkIssuer[item[3]] = false;
        this.fillIssuerDdl.forEach((i) => {
          if (item[1] === i.Issuer_Name) {
            i.selected = false;
          }
        });
        if (this.issuer.length > 0) {
          if (this.issuer.includes(item[4])) {
            let listarray = [];
            listarray = this.issuer.split(',');
            listarray.forEach((_element, i) => {
              if (listarray.length > 1) {
                if (i === 0) {
                  this.issuer = this.issuer.replace("'" + item[4] + "',", '');
                } else {
                  this.issuer = this.issuer.replace(",'" + item[4] + "'", '');
                }
              } else {
                this.issuer = this.issuer.replace("'" + item[4] + "'", '');
              }
            });
          }
        }
      } else if (this.activeAll) {
        // this.checkIssuer[item[3]] = false;
        this.fillIssuerDdl.forEach((i) => {
          if (item[1] === i.Issuer_Name) {
            i.selected = false;
          }
        });
        if (this.issuer1.length > 0) {
          if (this.issuer1.includes(item[4])) {
            let listarray = [];
            listarray = this.issuer1.split(',');
            listarray.forEach((_element, i) => {
              if (listarray.length > 1) {
                if (i === 0) {
                  this.issuer1 = this.issuer1.replace("'" + item[4] + "',", '');
                } else {
                  this.issuer1 = this.issuer1.replace(",'" + item[4] + "'", '');
                }
              } else {
                this.issuer1 = this.issuer1.replace("'" + item[4] + "'", '');
              }
            });
          }
        }
      }
    } else if (item[0] === 'S&P') {
      // this.checkSnp[item[3]] = false;
      this.snpRatingList.forEach((i) => {
        if (item[1] === i.snpRate) {
          i.selected = false;
        }
      });
      let subArray = [];
      subArray = this.snpstring.split(',');
      subArray.forEach((element) => {
        if (element === "'" + item[1] + "'") {
          this.snpstring = this.snpstring.replace(element, '');
        }
      });
    } else if (item[0] === "Moody's") {
      // this.checkMoody[item[3]] = false;
      this.moodyRatingList.forEach((i) => {
        if (item[1] === i.moodyrate) {
          i.selected = false;
        }
      });
      let subArray = [];
      subArray = this.moodyString.split(',');
      subArray.forEach((element) => {
        if (element === "'" + item[1] + "'") {
          this.moodyString = this.moodyString.replace(element, '');
        }
      });
    } else if (item[0] === 'Fitch') {
      // this.checkFitch[item[3]] = false;
      this.fitchRatingList.forEach((i) => {
        if (item[1] === i.fitchrate) {
          i.selected = false;
        }
      });
      let subArray = [];
      subArray = this.fitchstring.split(',');
      subArray.forEach((element) => {
        if (element === "'" + item[1] + "'") {
          this.fitchstring = this.fitchstring.replace(element, '');
        }
      });
    } else if (item[0] === 'Public List') {
      this.disabled = true;
      this.disabled1 = false;
      this.publicList.forEach((l) => {
        if (item[1] === l.PF_Folder_Name) {
          l.isChecked = false;
        }
      });
    } else if (item[0] === 'Private List') {
      this.disabled = false;
      this.disabled1 = true;
      this.privateList.forEach((l) => {
        if (item[1] === l.PF_Folder_Name) {
          l.isChecked = false;
        }
      });
    } else if (item[0] === 'Exchange') {
      this.fillExchangeDdl.forEach((l) => {
        if (item[1] === l.Long_Name) {
          l.isChecked = false;
        }
      });
    } else if (item[0] === 'Bond Type') {
      this.fillGenericSQLDdl.forEach((l) => {
        if (item[1] === l.DisplayField) {
          l.isChecked = false;
        }
      });
    } else if (item[0] === 'Asset Type') {
      this.assetItems.forEach((l) => {
        if (item[1] === l.Name) {
          l.isChecked = false;
        }
      });
    } else if (item[0] === 'Risk Profile') {
      this.homeapi.riskProfileArray.forEach((element, i) => {
        if (element.product === this.selectedProduct) {
          this.checkRiskProfile = false;
          this.homeapi.riskProfileArray[i].value = this.checkRiskProfile;
        }
      });
    }

    if (filterArr.length > 0) {
      filterArr = filterArr.filter((element) => {
        if (element[0] === item[0] && element[1] === item[1]) {
          this.saveFilter.remove(element);
        }
      });
    } else {
      this.saveFilter.forEach((element) => {
        if (element[0] === item[0] && element[1] === item[1]) {
          this.saveFilter.remove(element);
        }
      });

      if (this.saveFilter.length === 0) {
        this.disabled = false;
        this.disabled1 = false;
      } else {
        this.saveFilter.forEach((element) => {
          if (element[0] === 'Public List') {
            this.disabled1 = false;
            this.disabled = true;
          } else if (element[0] === 'Private List') {
            this.disabled = false;
            this.disabled1 = true;
          }
        });
      }
    }

    // this.removeFilter(['Public List', element[1], 'Public List', index]);
    if (this.foldersString === item[1] && this.ListType === 'Public') {
      this.foldersString = '';
      this.ListType = '';
    }

    if (this.filterString.includes(item[2])) {
      let splitarray = [];
      splitarray = this.filterString.split('and');
      let subArray = [];
      if(splitarray.length === 4) {
        this.counter = 3
      } else if (splitarray.length === 3) {
        this.counter = 2;
      }
      if (splitarray[this.counter].includes(' or')) {  //changed splitarray[1] to splitarray[counter] by Alolika G | 19-02-2022
        subArray = splitarray[this.counter].split('or');

        subArray.forEach((element, i) => {
          if (element.includes(item[1])) {
            if (i === 0) {
              this.filterString = this.filterString.replace(element + 'or', '');
            } else {
              this.filterString = this.filterString.replace('or' + element, '');
            }
          }
        });
      } else if (splitarray[this.counter].includes(item[2])) {
        if (splitarray[this.counter].includes(' in')) {
        } else if (item[this.counter] === 'slider') {
          splitarray.forEach((element) => {
            if (element.includes(item[2])) {
              this.filterString = this.filterString.replace(
                'and' + element,
                ''
              );
            }
          });
        } else {
          this.filterString = this.filterString.replace(
            'and' + splitarray[this.counter],
            ''
          );
        }
      } else if (item[this.counter] === 'slider') {
        splitarray.forEach((element) => {
          if (element.includes(item[2])) {
            this.filterString = this.filterString.replace('and' + element, '');
          }
        });
      } else {
        this.filterString = this.filterString.replace(
          'and' + splitarray[this.counter + 1],
          ''
        );
      }
    }

    return this.saveFilter;
  }

  callSorting(data, order) {
    this.order = order;
    this.selectedTarget = data.RSM_Target_Field;
    this.SortingCriteria =
      data.RSM_Target_Field.replace('NM.', '') + ' ' + order;
    this.sort = data.RSM_Display_Name;
    // this.riskprofileChanged();
    if (this.selectedProduct === 'ALL') {
      this.workflowApi.getRMWData(
        // 'Where Template_Code in ( \'Bonds\',\'Fund_Setup\',\'Product_Maintenance\')',

        "Where Template_Code in ( 'Bonds','Fund_Setup','Product_Maintenance','NiftyParticipation')",
        this.username,
        this.filterString,
        '',
        this.pageNo,
        this.authorApi.EntityID,
        this.pageSize,
        this.SortingCriteria,
        this.foldersString,
        this.ListType,
        '',
        ''
      );
    } else {
      this.workflowApi.getRMWData(
        "Where Template_Code in ( '" + this.selectedProduct + "')",
        this.username,
        this.filterString,
        '',
        this.pageNo,
        this.authorApi.EntityID,
        this.pageSize,
        this.SortingCriteria,
        this.foldersString,
        this.ListType,
        '',
        ''
      );
    }
  }

  toggleSorting(order) {
    // if(this.order === 'asc'){
    this.order = order;
    // } else if(this.order === 'desc'){
    //   this.order = 'asc';
    // }
    this.SortingCriteria =
      this.selectedTarget.replace('NM.', '') + ' ' + this.order;
    // this.riskprofileChanged();
    if (this.selectedProduct === 'ALL') {
      this.workflowApi.getRMWData(
        // 'Where Template_Code in ( \'Bonds\',\'Fund_Setup\',\'Product_Maintenance\')',

        "Where Template_Code in ( 'Bonds','Fund_Setup','Product_Maintenance','NiftyParticipation')",
        this.username,
        this.filterString,
        '',
        this.pageNo,
        this.authorApi.EntityID,
        this.pageSize,
        this.SortingCriteria,
        this.foldersString,
        this.ListType,
        '',
        ''
      );
    } else {
      this.workflowApi.getRMWData(
        "Where Template_Code in ( '" + this.selectedProduct + "')",
        this.username,
        this.filterString,
        '',
        this.pageNo,
        this.authorApi.EntityID,
        this.pageSize,
        this.SortingCriteria,
        this.foldersString,
        this.ListType,
        '',
        ''
      );
    }
  }

  likeChanged(Checked) {
    // this.likeChecked = !this.likeChecked;
    if (Checked) {
      this.likes = 'and Number_Of_Likes > 0';
    } else {
      this.likes = '';
    }
  }

  primaryMktChange(Checked) {
    if (Checked) {
    }
  }

  filterSearch(p: any, header) {
    let string = p.target.value;
    // let tempArray = [];
    let tempArray1 = [];
    switch (header) {
      case 'PRR':
        // tempArray = this.currencyList.slice();
        if (string.toUpperCase().includes('P')) {
          string = string.toUpperCase().split('P')[1];
        }
        this.checkboxArrayCopy.forEach((element, _i) => {
          if (string === '') {
            tempArray1 = this.checkboxArrayCopy.slice();
            this.checkboxArray = tempArray1;
          } else if (
            string !== '' &&
            element.rate.toString().includes(string.toUpperCase())
          ) {
            this.checkboxArray = [];
            tempArray1.push(element);
          }
        });
        this.checkboxArray = tempArray1;
        break;

      default:
        break;
    }
    // this.checkUncheck();
  }

  clearSearch() {
    this.activeAll = true;
    this.showInsurance = false;
    this.showbonds = false;
    this.showmf = false;
    this.showNifty = false;
    this.filterString = sessionStorage.getItem('stringAll') || '';
    this.removeFilter(
      [
        'SearchBar',
        this.searchBarString,
        'NM.Product_Name',
        'search',
        'SearchBar',
      ],
      []
    );
    this.removeFilter(
      ['SearchBar', this.searchBarString, 'NM.ISIN', 'search', 'SearchBar'],
      []
    );
    this.saveRmwFilters();
    sessionStorage.setItem('search_All', '');

    this.showInsurance = true;
    this.activeAll = false;
    this.showbonds = false;
    this.showmf = false;
    this.showNifty = false;
    this.filterString = sessionStorage.getItem('stringInsurance') || '';
    this.removeFilter(
      [
        'SearchBar',
        this.searchBarString,
        'NM.Product_Name',
        'search',
        'SearchBar',
      ],
      []
    );
    this.removeFilter(
      ['SearchBar', this.searchBarString, 'NM.ISIN', 'search', 'SearchBar'],
      []
    );
    this.saveRmwFilters();
    sessionStorage.setItem('search_Insurance', '');

    this.showbonds = true;
    this.showInsurance = false;
    this.activeAll = false;
    this.showmf = false;
    this.showNifty = false;
    this.filterString = sessionStorage.getItem('stringBonds') || '';
    this.removeFilter(
      [
        'SearchBar',
        this.searchBarString,
        'NM.Product_Name',
        'search',
        'SearchBar',
      ],
      []
    );
    this.removeFilter(
      ['SearchBar', this.searchBarString, 'NM.ISIN', 'search', 'SearchBar'],
      []
    );
    this.saveRmwFilters();
    sessionStorage.setItem('search_Bonds', '');

    this.showmf = true;
    this.showbonds = false;
    this.showInsurance = false;
    this.activeAll = false;
    this.showNifty = false;
    this.filterString = sessionStorage.getItem('stringFunds') || '';
    this.removeFilter(
      [
        'SearchBar',
        this.searchBarString,
        'NM.Product_Name',
        'search',
        'SearchBar',
      ],
      []
    );
    this.removeFilter(
      ['SearchBar', this.searchBarString, 'NM.ISIN', 'search', 'SearchBar'],
      []
    );
    this.saveRmwFilters();
    sessionStorage.setItem('search_Funds', '');

    this.showNifty = true;
    this.showmf = false;
    this.showbonds = false;
    this.showInsurance = false;
    this.activeAll = false;
    this.filterString = sessionStorage.getItem('stringNifty') || '';
    this.removeFilter(
      [
        'SearchBar',
        this.searchBarString,
        'NM.Product_Name',
        'search',
        'SearchBar',
      ],
      []
    );
    this.removeFilter(
      ['SearchBar', this.searchBarString, 'NM.ISIN', 'search', 'SearchBar'],
      []
    );
    this.saveRmwFilters();
    sessionStorage.setItem('search_Nifty', '');
  }

  getTemplateId() {
    this.alltempId = 'ALL';
    this.workflowApi.getTemplates().subscribe((res) => {
      if (res) {
        res.GET_TemplateDataResult.forEach((element) => {
          switch (element.Template_Name) {
            case 'Fund Products':
              this.fundstempId = element.Id;
              break;

            case 'Bonds':
              this.bondstempId = element.Id;
              break;

            case 'Product Maintenance':
              this.insurancestempId = element.Id;

              break;

            case 'Nifty Participation':
              this.niftyId = element.Id;
              break;

            case 'Equity Autocallable (specific)':
              this.spId = element.Id;
              break;
          }
        });
      }
    });
  }

  clearSearchString() {
    this.searchBarString = '';
    this.pageload = false;
    this.loader = true;
    // this.pageSize = ""
    // this.pageNo = "";
    this.workflowApi.getRMWData(
      this.whereclause,
      this.username,
      this.filterString,
      this.selectedProduct === 'ALL' ? '' : this.selectedProduct,
      1,
      this.authorApi.EntityID,
      5,
      this.SortingCriteria,
      this.foldersString,
      this.ListType,
      '',
      ''
    );
    this.saveRmwFilters();
  }

  refreshPage() {
    this.searchBarString = '';
    this.pageload = false;
    this.loader = true;
    this.pageNo = 1;
    this.pageSize = 5;
    this.filterString = "and RIGHT(NM.Note_Product_Rating, 1) between '1' and '" + (this.homeapi.RiskRating?.split('')[1] || '5') + "\'"; //Added by Alolika | 19-02-2022
    
    //Changes done by AlolikaG on 2nd Feb 2022. --START
    for (let i = 0; i < this.tabcount; i++) {
      this.activeTab[i] = false;
    }
    this.activeAll = true;
    this.activeTab[this.tabs.length] = true;
    //Changes done by AlolikaG on 2nd Feb 2022. --END

    this.selectedProduct = 'ALL';
    this.workflowApi.getRMWData(
      // 'Where Template_Code in ( \'Bonds\',\'Fund_Setup\',\'Product_Maintenance\')',

      "Where Template_Code in ( 'Bonds','Fund_Setup','Product_Maintenance','NiftyParticipation', 'EquityAutocallableNote', 'FundsBundle')",
      this.username,
      this.filterString,  //Added by Alolika G | 19-02-2022
      this.selectedProduct,
      this.pageNo,
      this.authorApi.EntityID,
      this.pageSize,
      '',
      '',
      '',
      '',
      ''
    );
    this.saveRmwFilters();
  }


  generateTemplatesString(choice) {
    switch (choice) {
      case 'amf':
        this.showamf = true;
        this.selectedProduct = 'AM_Fund_Setup';

        this.workflowApi.getRMWData(
          "Where Template_Code = 'AM_Fund_Setup'",
          this.username,
          "Where Template_Code = 'AM_Fund_Setup'" + this.filterString,
          this.selectedProduct,
          this.pageNo,
          this.authorApi.EntityID,
          this.pageSize,
          this.SortingCriteria,
          this.foldersString,
          this.ListType,
          '',
          ''
        );
        break;
      case 'Funds':
        // this.saveFilter = this.filterFunds;
        // this.filterString = this.stringFunds;
        // this.ccy = this.ccyFunds;
        // this.foldersString = this.folderName1;
        // this.ListType = this.liststring1;
        this.selectedProduct = 'Fund_Setup';
        this.homeapi.riskProfileArray.forEach((element) => {
          if (element.product === this.selectedProduct) {
            this.checkRiskProfile = element.value;
          }
        });
        this.showmf = true;

        this.saveFilter =
          JSON.parse(sessionStorage.getItem('filterFunds')) || [];
        this.filterString = sessionStorage.getItem('stringFunds') || '';
        this.ccy = sessionStorage.getItem('ccyFunds') || '';
        this.foldersString = sessionStorage.getItem('folderName1') || '';
        this.ListType = sessionStorage.getItem('liststring1') || '';
        this.searchBarString = sessionStorage.getItem('search_Funds') || '';
        this.whereclause = '';
        this.whereclause =
          "Where Template_Code = '" + this.selectedProduct + "'";
        this.likes = sessionStorage.getItem('likesFunds') || '';
        if (this.ccy !== '') {
          this.whereclause =
            this.whereclause + ' and Currency in (' + this.ccy + ')';
        }
        if (this.likes !== '') {
          this.whereclause = this.whereclause + this.likes;
        }
        if (!this.isUserRM) {
          this.riskprofileChanged();
        }
        if (this.searchBarString.length > 0) {
          this.getRMWSearch(this.searchBarString);
        } else {
          this.workflowApi.getRMWData(
            // 'Where Template_Code = \'Fund_Setup\'',
            this.whereclause,
            this.username,
            this.filterString,
            // this.stringFunds,
            // '',
            this.selectedProduct,
            this.pageNo,
            this.authorApi.EntityID,
            this.pageSize,
            this.SortingCriteria,
            this.foldersString,
            this.ListType,
            '',
            ''
          );
        }

        // this.fundstempId = !this.fundstempId ? this.templateID : this.fundstempId;

        break;
      case 'Bonds':
        // this.saveFilter = this.filterBonds;
        // this.filterString = this.stringBonds;
        // this.foldersString = this.folderName;
        // this.ccy = this.ccyBonds;
        // this.ListType = this.liststring;
        this.selectedProduct = 'Bonds';

        this.homeapi.riskProfileArray.forEach((element) => {
          if (element.product === this.selectedProduct) {
            this.checkRiskProfile = element.value;
          }
        });
        this.showbonds = true;

        this.saveFilter =
          JSON.parse(sessionStorage.getItem('filterBonds')) || [];
        this.filterString = sessionStorage.getItem('stringBonds') || '';
        this.foldersString = sessionStorage.getItem('folderName') || '';
        this.ListType = sessionStorage.getItem('liststring') || '';
        this.ccy = sessionStorage.getItem('ccyBonds') || '';
        this.searchBarString = sessionStorage.getItem('search_Bonds') || '';
        this.likes = sessionStorage.getItem('likesBonds') || '';
        this.whereclause =
          "Where Template_Code = '" + this.selectedProduct + "'";
        if (this.ccy !== '') {
          this.whereclause =
            this.whereclause + ' and Currency in (' + this.ccy + ')';
        }
        if (this.likes !== '') {
          this.whereclause = this.whereclause + this.likes;
        }
        if (!this.isUserRM) {
          this.riskprofileChanged();
        }
        if (this.searchBarString.length > 0) {
          this.getRMWSearch(this.searchBarString);
        } else {
          this.workflowApi.getRMWData(
            // 'Where Template_Code = \'Bonds\'',
            this.whereclause,
            this.username,
            this.filterString,
            // this.stringBonds,
            // '',
            this.selectedProduct,
            this.pageNo,
            this.authorApi.EntityID,
            this.pageSize,
            this.SortingCriteria,
            this.foldersString,
            this.ListType,
            '',
            ''
          );
        }

        // this.bondstempId = !this.bondstempId ? this.templateID : this.bondstempId;
        break;
      case 'Shares':
        this.showshares = true;
        this.selectedProduct = 'Equity_Setup';

        this.workflowApi.getRMWData(
          "Where Template_Code = 'Equity_Setup'",
          this.username,
          this.filterString,
          'Shares in UCP',
          this.pageNo,
          this.pageSize,
          this.authorApi.EntityID,
          this.SortingCriteria,
          this.foldersString,
          this.ListType,
          '',
          ''
        );

        break;
      case 'Fixed Deposit':
        this.showfd = true;
        this.workflowApi.getRMWData(
          "Where Template_Code = 'fixed_deposit'",
          this.username,
          this.filterString,
          this.selectedProduct,
          this.pageNo,
          this.authorApi.EntityID,
          this.pageSize,
          this.SortingCriteria,
          this.foldersString,
          this.ListType,
          '',
          ''
        );

        break;
      case 'Insurance':
        // this.filterString = this.stringInsurance;
        // this.saveFilter = this.filterInsurance;
        // this.ccy = this.ccyInsurance;
        // this.foldersString = this.folderName2;
        // this.ListType = this.liststring2;
        this.selectedProduct = 'Product_Maintenance';
        this.homeapi.riskProfileArray.forEach((element) => {
          if (element.product === this.selectedProduct) {
            this.checkRiskProfile = element.value;
          }
        });
        this.showInsurance = true;

        this.saveFilter =
          JSON.parse(sessionStorage.getItem('filterInsurance')) || [];
        this.filterString = sessionStorage.getItem('stringInsurance') || '';
        this.ccy = sessionStorage.getItem('ccyInsurance') || '';
        this.foldersString = sessionStorage.getItem('folderName2') || '';
        this.ListType = sessionStorage.getItem('liststring2') || '';
        this.searchBarString = sessionStorage.getItem('search_Insurance') || '';
        this.whereclause =
          "Where Template_Code = '" + this.selectedProduct + "'";
        this.likes = sessionStorage.getItem('likesInsurance') || '';

        if (this.ccy !== '') {
          this.whereclause =
            this.whereclause + ' and Currency in (' + this.ccy + ')';
        }
        if (this.likes !== '') {
          this.whereclause = this.whereclause + this.likes;
        }
        if (!this.isUserRM) {
          this.riskprofileChanged();
        }
        if (this.searchBarString.length > 0) {
          this.getRMWSearch(this.searchBarString);
        } else {
          this.workflowApi.getRMWData(
            "Where Template_Code = 'Product_Maintenance'",
            this.username,
            this.filterString,
            // this.stringInsurance,
            // '',
            this.selectedProduct,
            this.pageNo,
            this.authorApi.EntityID,
            this.pageSize,
            this.SortingCriteria,
            this.foldersString,
            this.ListType,
            '',
            ''
          );
        }
        // this.insurancestempId = !this.insurancestempId ? this.templateID : this.insurancestempId;
        break;
      case 'Nifty Participation':
        // this.saveFilter = this.filterFunds;
        // this.filterString = this.stringFunds;
        // this.ccy = this.ccyFunds;
        // this.foldersString = this.folderName1;
        // this.ListType = this.liststring1;
        this.selectedProduct = 'NiftyParticipation';
        this.homeapi.riskProfileArray.forEach((element) => {
          if (element.product === this.selectedProduct) {
            this.checkRiskProfile = element.value;
          }
        });
        this.showNifty = true;

        this.saveFilter =
          JSON.parse(sessionStorage.getItem('filterNifty')) || [];
        this.filterString = sessionStorage.getItem('stringNifty') || '';
        this.ccy = sessionStorage.getItem('ccyNifty') || '';
        this.foldersString = sessionStorage.getItem('folderName4') || '';
        this.ListType = sessionStorage.getItem('liststring4') || '';
        this.searchBarString = sessionStorage.getItem('search_Nifty') || '';
        this.whereclause = '';
        this.whereclause =
          "Where Template_Code = '" + this.selectedProduct + "'";
        this.likes = sessionStorage.getItem('likesNifty') || '';
        if (this.ccy !== '') {
          this.whereclause =
            this.whereclause + ' and Currency in (' + this.ccy + ')';
        }
        if (this.likes !== '') {
          this.whereclause = this.whereclause + this.likes;
        }
        if (!this.isUserRM) {
          this.riskprofileChanged();
        }
        if (this.searchBarString.length > 0) {
          this.getRMWSearch(this.searchBarString);
        } else {
          this.workflowApi.getRMWData(
            // 'Where Template_Code = \'Fund_Setup\'',
            this.whereclause,
            this.username,
            this.filterString,
            // this.stringFunds,
            // '',
            this.selectedProduct,
            this.pageNo,
            this.authorApi.EntityID,
            this.pageSize,
            this.SortingCriteria,
            this.foldersString,
            this.ListType,
            '',
            ''
          );
        }

        // this.fundstempId = !this.fundstempId ? this.templateID : this.fundstempId;

        break;

      case 'ALL':
        //this.showInsurance = true;
        // this.ccy = this.ccyAll;
        // this.foldersString = this.folderName3;
        // this.ListType = this.liststring3;
        // this.saveFilter = this.filterAll;
        // this.filterString = this.stringAll;
        this.selectedProduct = 'ALL';

        this.homeapi.riskProfileArray.forEach((element) => {
          if (element.product === this.selectedProduct) {
            this.checkRiskProfile = element.value;
          }
        });
        this.activeAll = true;

        this.saveFilter = JSON.parse(sessionStorage.getItem('filterAll')) || [];
        this.filterString = sessionStorage.getItem('stringAll') || '';
        this.ccy = sessionStorage.getItem('ccyAll') || '';
        this.foldersString = sessionStorage.getItem('folderName3') || '';
        this.ListType = sessionStorage.getItem('liststring3') || '';
        this.searchBarString = sessionStorage.getItem('search_All') || '';
        this.whereclause =
          "Where Template_Code in ( 'Bonds','Fund_Setup','Product_Maintenance','NiftyParticipation')";
        this.likes = sessionStorage.getItem('likesAll') || '';

        if (this.ccy !== '') {
          this.whereclause =
            this.whereclause + ' and Currency in (' + this.ccy + ')';
        }
        if (this.likes !== '') {
          this.whereclause = this.whereclause + this.likes;
        }
        if (!this.isUserRM) {
          this.riskprofileChanged();
        }
        if (this.searchBarString.length > 0) {
          this.getRMWSearch(this.searchBarString);
        } else {
          this.workflowApi.getRMWData(
            this.whereclause,
            this.username,
            // this.stringAll,
            this.filterString,
            // '',
            '',
            this.pageNo,
            this.authorApi.EntityID,
            this.pageSize,
            this.SortingCriteria,
            this.foldersString,
            this.ListType,
            '',
            ''
          );
        }
        // this.alltempId = !this.alltempId ? this.templateID : this.alltempId;
        break;
      default:
        this.showamf = true;
        break;
    }

    this.checkUncheck();
    let pageArr = [];
    pageArr.push({
      pageNo: this.pageNo,
      pageSize: this.pageSize,
      tab: this.choice,
      index: this.index,
    });
    this.cfs.setRMWstate(pageArr);
    this.tabChangeFlag = false;
  }
  
  back() {
    this.location.back();
  }
}
