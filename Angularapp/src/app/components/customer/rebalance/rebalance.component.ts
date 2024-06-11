
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { AuthService } from '../../../services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
// import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { Subject, Subscription } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { takeUntil } from 'rxjs/operators';

//Changed by MohanP | 2FEB22
@Component({
  selector: 'app-rebalance',
  templateUrl: './rebalance.component.html',
  styleUrls: ['./rebalance.component.scss'],
})
export class RebalanceComponent implements OnInit {
  @Input() Portfolio: any;
  showProposalGeneration: boolean = false;
  loader: boolean;
  Product: string;
  LoginId: any;
  benchmarkId: any;
  rebalanceEQ: any;
  rebalanceMF: any;
  rebalanceBonds: any;
  EquitiesTransactionDetails: any[];
  MFTransactionDetails: any[];
  BondsTransactionDetails: any[];
  EquitiesData: any[];
  MFData: any[];
  BondsData: any[];
  Bonds_Imbalance: any;
  MF_Imbalance: any;
  Equities_Imbalance: any;
  userType: string;
  isUserRM: boolean;
  CustomerId: any;
  RefDate: any;
  Frequency: string;
  ThresholdVal: any;
  Customer: any;
  // Portfolio: any;
  NetWorth: any;
  InvestmentObj: any;
  PortfolioName: any;
  Risk: any;
  Strategy: any;
  AUM: any;
  Target: any;
  TargetInput = '10.00';
  collpase: boolean = true;
  collapseTable: boolean = true;
  error = '';
  tierFlag: any;
  orderTime: string;
  monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  hours1: any;
  min1: any;
  ampm: any;
  ColumnNames: any[] = [
    'Asset Group (Target/ Current)',
    'Asset Class (Target/ Current)',
    'Asset Group Target Amount',
    'Asset Class Target Amount',
    'Asset Group Actual Allocation Amount',
    'Asset Class Actual Allocation Amount',
    'Asset Group Allocation Gap (%)',
    'Asset Class Allocation Gap (%)',
    'Asset Group Rebalancing Required Amount',
    'Asset Class Rebalancing Required Amount',
    'Trading Action',
  ];
  ColumnNames1: any[] = [
    'Asset Group (Target/ Current)',
    'Asset Group Target Amount',
    'Asset Group Actual Allocation Amount',
    'Asset Group Allocation Gap (%)',
    'Asset Group Rebalancing Required Amount',
    'Trading Action',
  ];

  ColumnsEQ: any[] = [
    'Buy / Sell',
    'Underlying',
    'Sector',
    'Lot Size',
    'Existing Allocation (%)',
    'Holdings',
    'Target Allocation',
    'Investment Amount',
    'Price',
    'Quantity',
    'Remarks',
    'Exchange',
    'Flow Type',
    'Limit Price',
    'Order Type',
    'Trade Date',
  ];
  ColumnsEQ1: any[] = [
    'Buy / Sell',
    'Underlying',
    'Sector',
    'Lot Size',
    'Existing Allocation (%)',
    'Holdings',
    'Target Allocation',
    'Investment Amount',
    'Price',
    'Quantity',
    'Remarks',
  ];

  ColumnsMF: any[] = [
    'Subscribe / Redeem',
    'Fund Code',
    'Sector',
    'Existing Allocation (%)',
    'Units Allocated',
    'Target Allocation',
    'Investment Amount',
    'NAV',
    'Units',
    'Remarks',
    'Exchange',
    'Flow Type',
    'Limit Price',
    'Order Type',
    'Trade Date',
  ];
  ColumnsMF1: any[] = [
    'Subscribe / Redeem',
    'Fund Code',
    'Sector',
    'Existing Allocation (%)',
    'Units Allocated',
    'Target Allocation',
    'Investment Amount',
    'NAV',
    'Units',
    'Remarks',
  ];

  ColumnsBonds: any[] = [
    'Buy / Sell',
    'ISIN',
    'Product Name',
    'Existing Allocation (%)',
    'Holdings',
    'Target Allocation',
    'Investment Amount',
    'Price',
    'Nominal',
    'Remarks',
    'Currency',
    'Limit Price',
    'Order Type',
    'Trade Date',
  ];
  ColumnsBonds1: any[] = [
    'Buy / Sell',
    'ISIN',
    'Product Name',
    'Existing Allocation (%)',
    'Holdings',
    'Target Allocation',
    'Investment Amount',
    'Price',
    'Nominal',
    'Remarks',
  ];

  ColumnTierCollapsed: any[] = [
    // 'Asset Group (Target/ Current)',
    // 'Asset Class (Target/ Current)',
    // 'Sub Template (Target / Current)',
    // 'Category (Target / Current)',
    'Asset Group Target Amount',
    'Asset Class Target Amount',
    'Sub Template Target Amount',
    'Category Target Amount',
    'Asset Group Actual Allocation Amount',
    'Asset Class Actual Allocation Amount',
    'Sub Template Actual Allocation Amount',
    'Category Actual Allocation Amount',
    'Asset Group Allocation Gap (%)',
    'Asset Class Allocation Gap (%)',
    'Sub Template Allocation Gap (%)',
    'Category Allocation Gap (%)',
    'Asset Group Rebalancing Required Amount',
    'Asset Class Rebalancing Required Amount',
    'Sub Template Rebalancing Required Amount',
    'Category Rebalancing Required Amount',
    // 'Trading Action',
  ];

  ColumnTierExpand: any[] = [
    // 'Asset Group (Target/ Current)',
    // 'Asset Class (Target/ Current)',
    // 'Sub Template (Target / Current)',
    // 'Category (Target / Current)',
    'Asset Group Target Amount',
    'Asset Class Target Amount',
    'Sub Template Target Amount',
    'Category Target Amount',
    'Asset Group Actual Allocation Amount',
    'Asset Class Actual Allocation Amount',
    'Sub Template Actual Allocation Amount',
    'Category Actual Allocation Amount',
    'Asset Group Allocation Gap (%)',
    'Asset Class Allocation Gap (%)',
    'Sub Template Allocation Gap (%)',
    'Category Allocation Gap (%)',
    'Asset Group Rebalancing Required Amount',
    'Asset Class Rebalancing Required Amount',
    'Sub Templat Rebalancing Required Amount',
    'Rebalancing Required Amount',
    'Asset Group Revised Allocation Amount',
    'Asset Group Revised Allocation (%)',
    'Asset Class Revised Allocation Amount',
    'Asset Class Revised Allocation (%)',
    'Sub Template Revised Allocation Amount',
    'Sub Template Revised Allocation (%)',
    'Revised Allocation Amount',
    'Revised Allocation (%)',
    // 'Trading Action',
  ];

  masterSelected = true;
  filterArray = [
    // {value: 'All', isSelected: true}, 
    { value: 'Asset Group', isSelected: true },
    { value: 'Asset Class', isSelected: true },
    { value: 'Sub Template', isSelected: true },
    { value: 'Category', isSelected: true },
  ]
  CustomerAllocation: any[] = [];
  showOrderEntry: boolean = false;
  showRebalancePopup: boolean = false;
  showPropGenPopup: boolean = false;

  occurences: any[] = [];
  number: any;
  AllocationDetails: any[] = [];
  CustomerPortfolioDetails: any[] = [];
  chartColors = [
    '#dfc2e4',
    '#fbe19f',
    '#9ad3f0',
    '#bce4b1',
    '#ed7d31',
    '#a5a5a5',
    '#619010',
    '#388a90',
    '#6143b7',
    '#a3085f',
    '#85593d',
    '#878787',
    '#b19c0c',
  ];
  // actionstitle = 'Actions';
  actionstype = 'BarChart';
  actionsdata = [];
  actionscolumnNames = ['', 'Current Allocation', 'Target Amount'];
  actionsoptions = {
    width: '680',
    height: '280',
    legend: {
      position: 'right',
      maxLines: 2,
      textStyle: {
        color: '#fff',
        fontSize: 13,
      },
    },
    colors: this.chartColors,
    chartArea: { top: 10, right: 150, height: '80%', width: '60%' },
    // hAxis: {
    //   slantedText: true,
    //   slantedTextAngle: 45,
    // },
    titleTextStyle: {
      color: '#808080',
      fontSize: 22,
    },
    backgroundColor: { fill: 'transparent' },
    hAxis: {
      textStyle: {
        color: '#808080',
      },
      gridlines: {
        color: 'transparent',
      },
      hAxis: { format: 'decimal' },
      minValue: 0,
    },
    vAxis: {
      minValue: 0,
      viewWindow: {
        min: 0
      },
      textStyle: {
        color: '#808080',
      },
      gridlines: {
        color: 'transparent',
      },
    },
  };
  FrequencyArr: any[];
  dirEQ: string;
  dirMF: string;
  dirBonds: string;
  allocDetails: any[];
  baseCcy: any;
  portfolioList: any;
  showFilter: boolean = false;
  checkedFilter: any;
  AssetGroupFlag: boolean;
  AssetClassFlag: boolean;
  SubTemplateFlag: boolean;
  Category: boolean;
  ColumnTierCollapsedCopy: any[];
  showAll: boolean;
  CategoryFlag: boolean;
  checkedList: any;
  mfList: any[];
  OrderDetailsMF: any[];
  username: any;
  CIF: any;
  Units: any;
  balanceFlag: any;
  token: any;
  checkSuitability: boolean = false;
  orderDetails: any;
  NMID: any;
  successMsg: string = '';
  loadflag: boolean;
  OrderParamsXML: string;
  subscribeFlag: boolean;
  SaveCustomerDetailsSubscriber: Subscription;
  orderflag: boolean;
  NMID_Suitability: any;
  OrderDetailsEQ: any[];
  orderDetailsBonds: any[];
  notional: any;
  selectedBond: any;
  bondDetails: Subscription;
  bondCalculations: Subscription;
  Proceeds: any;

  bondCalSub = new Subject();
  bondCalSubf: boolean = false;
  AccDays: any;
  AccInt: any;
  AccVal: string;
  BankPNL: any;
  CurrentYield: any;
  CleanPrice: any;
  DirtyPrice: any;
  YTM: any;
  YTC: any;
  YTP: any;
  YTConv: any;
  SettAmt: any;
  settval: string;
  CustDirtyPrice: any;
  CustCleanPrice: any;
  MarketCleanPrice: any;
  MarketDirtyPrice: any;
  bondMsg: any;
  ClientPrice: any;
  bondRemark: any;
  TargetInterbankPrice: any;
  RMName: any;
  notionalFI: number;
  TimeInForce: any = 'DAY';

  bondsubscribe: Subscription;
  shareDetailsBS: Subscription;
  portSecHolSubcription: Subscription;

  OrderID: any;
  shareList: any;
  details: any;
  SettlementType: any;
  OrderQty: any;
  remainingBalanceMF: any;
  remainingUnitsMF: any;
  portfolioDetails: any;
  noBalFlag: boolean;
  RemainingCashBalanceFI: any;
  remainingUnitsFI: any;
  balanceFlagFI: boolean;
  noBalFlagMF: boolean;
  orderInterval: any;
  orderIntervalMF: any;
  orderIntervalEQ: any;
  imbalanceCcy: any;
  legends: { name: string; data: number[]; }[];
  legendFlag: boolean;

  // PortfolioAllocSubscription: Subscription;
  // ngAfterViewChecked() {
  //   Array.prototype.forEach.call(this.elem.nativeElement.getElementsByTagName('text'), (text: HTMLElement) => {
  //     if (text.getAttribute('fill') === '#fff' && text.getAttribute('stroke') === 'none' && text.getAttribute('stroke-width') === '0' && text.getAttribute('font-size') === '12') {
  //       text.setAttribute('fill', '#ffffff');
  //     }
  //   });
  // }

  constructor(
    public cfs: CommonApiService,
    public homeApi: HomeApiService,
    private afs: CustomerApiService,
    public authorApi: AuthService,
    public location: Location,
    public router: Router,
    public ref: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    public wfs: WorkflowApiService
  ) {
    this.Frequency = '';
  }

  ngOnDestroy() {
    // this.destroy$.next(true);
    // this.destroy$.unsubscribe();
    if (this.bondCalculations) {
      this.bondCalculations.remove;
      this.wfs.bondCalculations.next([]);
      this.bondCalculations = null;
    }
    if (![undefined, null].includes(this.bondDetails)) {
      this.bondDetails.unsubscribe();
      this.bondDetails = null;
    }

    if (![undefined, null].includes(this.shareDetailsBS)) {
      this.shareDetailsBS.unsubscribe();
      this.shareDetailsBS = null;
    }
    if (![undefined, null].includes(this.bondsubscribe)) {
      this.bondsubscribe.unsubscribe();
      this.bondsubscribe = null;
    }
    if (![undefined, null].includes(this.SaveCustomerDetailsSubscriber)) {
      this.SaveCustomerDetailsSubscriber.unsubscribe();
      this.SaveCustomerDetailsSubscriber = null;
    }
    if (![undefined, null].includes(this.portSecHolSubcription)) {
      this.portSecHolSubcription.unsubscribe();
      this.portSecHolSubcription = null;
    }
    this.afs.SaveOrderObserver.next([]);
    this.wfs.bondsubscribe.next([]);
    this.bondsubscribe = null;
    this.wfs.portfolioSecHolding.next([]);
    this.successMsg = '';
    this.bondMsg = '';

  }

  reset() {

  }

  ngOnInit(): void {
    this.ColumnTierCollapsedCopy = this.ColumnTierCollapsed;

    this.Equities_Imbalance = 0;
    this.Bonds_Imbalance = 0;
    this.MF_Imbalance = 0;
    this.showOrderEntry = false;
    this.userType = this.authorApi.UserType;
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    if (!this.isUserRM) {
      this.CustomerId = this.homeApi.CustomerId;
      this.LoginId = this.authorApi.UserName;
    } else {
      this.CustomerId = sessionStorage.getItem('RMCustID');
      this.LoginId = sessionStorage.getItem('RMUser');
      if (this.homeApi.CustomerName.includes('|')) {
        this.RMName = this.homeApi.CustomerName.split('|')[0];
      } else {
        this.RMName = this.homeApi.CustomerName;
      }
    }
    console.log("this.homeApi.CustomerName", this.homeApi.CustomerName)
    this.username = this.authorApi.UserName;
    this.Strategy = 'Proportionate';
    this.ThresholdVal = 0.0;

    //Changes done by Alolika G on 10-02-2022 as told by Mohan P
    this.activatedRoute.queryParams.subscribe(res => {
      this.Portfolio = res.portfolio;
    })
    this.afs.getBankBaseCCYOBS.subscribe(() => {
      this.baseCcy = this.afs.bankBaseCCY;
      this.getTierFlag();
    });

    // this.PortfolioAllocSubscription = this.cfs.selectedPortfolioallocObserver.subscribe(res => {
    //   if (res.length !== 0) {
    //     this.CustomerPortfolioDetails = res.alloc;

    //     // this.CustomerPortfolioDetails.forEach(e => {
    //     //   if (e.PortfolioName.value === res.name) {
    //         this.Portfolio = this.CustomerPortfolioDetails["FacilityCode"];

    //     //   }
    //     // });
    //     // console.log('Portfolio details', this.CustomerPortfolioDetails);

    //     // this.ref.detectChanges();
    //   }
    // });

    // this.getTierFlag();





    // try {
    //   this.bondCalculations =
    //     this.wfs.bondCalculationsObserver.subscribe((c: any) => {
    //       if (c.length !== 0) {
    //         this.AccDays = c.DaysAccrued;
    //         this.AccInt = c.AccruedInterest;
    //         this.AccVal = this.FormatNumberFromValue(c.AccruedInterest);
    //         this.BankPNL = c.BankPnL;
    //         this.CurrentYield = c.CurrentYield;
    //         this.CleanPrice = c.MarketCleanPrice;
    //         this.DirtyPrice = c.CustDirtyPrice;
    //         this.YTM = c.YTM;
    //         this.YTC = c.YTC;
    //         this.YTP = c.YTP;
    //         this.YTConv = c.YTConv;
    //         this.SettAmt = c.CustCost;
    //         this.settval = this.FormatNumberFromValue(c.CustCost);
    //         this.Proceeds = c.CustCost;
    //         this.CustDirtyPrice = c.CustDirtyPrice;
    //         this.CustCleanPrice = c.CustCleanPrice;
    //         this.MarketCleanPrice = c.MarketCleanPrice;
    //         this.MarketDirtyPrice = c.MarketDirtyPrice;
    //         this.bondMsg = c.ResponseDetails.Description;
    //         this.ClientPrice = c.CustPrice;
    //         this.bondRemark = c.ResponseDetails.Remark;
    //         this.TargetInterbankPrice = c.LimitMarketPrice;
    //         if (this.bondRemark === 'failed' || this.bondRemark === null) {
    //           this.successMsg = this.bondMsg;
    //           this.loadflag = false;
    //         }

    //         // this.CalculateSettAmt();
    //         this.CalculateTotalProceeds(this.SettAmt);
    //         // let details = []
    //         // details.push(this.orderDetailsBonds);
    //         if (this.orderDetailsBonds[0].BuySell === 'Buy' || this.orderDetailsBonds[0].BuySell === 'BUY') {
    //           this.cashBalanceFI(this.orderDetailsBonds[0]);
    //         } else {
    //           this.sellBalance(this.orderDetailsBonds[0]);
    //         }
    //         // if (this.loadflag) {
    //         //   this.placeBondOrder(this.orderDetailsBonds);
    //         // }
    //       }
    //     });
    // } catch (error) {

    // }

  }

  getTierFlag() {
    try {
      //<!-- Addded by Alolika G | 15-02-2022 -->
      this.afs
        .GetPortfoliosFromCusID(this.CustomerId, this.baseCcy)
        .subscribe((folio) => {
          if (folio) {
            this.portfolioList = folio.DB_GetPortfoliosResult;
            if (this.portfolioList.length > 0) {

              this.portfolioList.forEach(element => {
                if (element.FacDesc === this.Portfolio) {
                  this.tierFlag = element.TierFlag;
                }
              });
            } else {

            }

            this.getbenchmarkId();

            if (this.tierFlag === 'Y') {
              this.checkedList = { value: 'All' };
              this.getCheckedItemList();
              this.applyFilter('All');

              // this.checkboxAction('All');
            }
          }
        });
    } catch (error) {

    }
  }

  getbenchmarkId() {
    this.loader = true;
    this.afs
      .GetBenchmarkId(this.CustomerId, this.Portfolio, this.LoginId)
      .subscribe((res) => {
        if (res) {
          this.benchmarkId = res.BenchmarkResponseBody.BenchmarkId;
          this.getAllocationDetails();
          this.getFrequencyddl();
        }
      });
  }

  selectFromDate(date) {
    this.RefDate = date;
    // console.log("this.RefDate", this.RefDate);
  }

  getFrequencyddl() {
    try {
      this.afs.GetFrequencies().subscribe((res) => {
        this.FrequencyArr = [];
        this.FrequencyArr = res.GetFrequenciesResult;
        this.Frequency = res.GetFrequenciesResult[0].Param2;
        this.getReferenceDate();
      });
    } catch (error) { }
  }

  changeThreshold(threshold) {
    this.ThresholdVal = threshold.target.value;
    // console.log("this.ThresholdVal", this.ThresholdVal);
    this.getAllocationDetails();
  }

  onChangeFreq(freq) {
    this.Frequency = freq.target.value;
    // console.log("this.Frequency", this.Frequency);
    this.getReferenceDate();
  }

  getReferenceDate() {
    this.afs
      .GetReferenceDate(this.Frequency, this.authorApi.EntityID)
      .subscribe((res) => {
        this.RefDate = res.GetReferenceDateResult;
        this.getAllocationDetails();
      });
  }

  getAllocationDetails() {
    if (this.Strategy === 'Proportionate') {
      this.afs
        .GetAllocationDetails(
          this.benchmarkId,
          this.Portfolio,
          this.authorApi.EntityID,
          this.CustomerId,
          this.Strategy
        )
        .subscribe((res) => {
          this.CustomerAllocation = [];
          this.AllocationDetails = [];
          if (res) {
            if (
              res['GetTACategoryData_WrapperResult']['O_Message'] !==
              'No record(s) found'
            ) {
              this.CustomerAllocation.push(
                res.GetTACategoryData_WrapperResult.CustomerPortfolioDetails
              );
              this.AllocationDetails =
                res.GetTACategoryData_WrapperResult.AllocationDetails;
              this.fillAllocDetails();
            } else {
              this.error = 'No Data Found.';
              this.loader = false;
            }
            // console.log("customer allocation", this.CustomerAllocation);
            // this.AllocationDetails = this.CustomerAllocation[0].AllocationDetails;
          } else {
          }
        });
    } else if (this.Strategy === 'Calendar') {
      this.afs
        .GetStrategyWiseData_Wrapper(
          this.Portfolio,
          this.authorApi.EntityID,
          this.CustomerId,
          this.Strategy,
          this.RefDate,
          '0.00'
        )
        .subscribe((res) => {
          this.CustomerAllocation = [];
          this.AllocationDetails = [];
          if (res) {
            this.CustomerAllocation.push(
              res.GetStrategyWiseData_WrapperResult.CustomerPortfolioDetails
            );
            this.AllocationDetails =
              res.GetStrategyWiseData_WrapperResult.AllocationDetails;
            this.fillAllocDetails();
            // console.log("customer allocation", this.CustomerAllocation);
            // this.AllocationDetails = this.CustomerAllocation[0].AllocationDetails;
          }
        });
    } else if (this.Strategy === 'Threshold') {
      this.afs
        .GetStrategyWiseData_Wrapper(
          this.Portfolio,
          this.authorApi.EntityID,
          this.CustomerId,
          this.Strategy,
          this.RefDate,
          this.ThresholdVal
        )
        .subscribe((res) => {
          this.CustomerAllocation = [];
          this.AllocationDetails = [];
          if (res) {
            this.CustomerAllocation.push(
              res.GetStrategyWiseData_WrapperResult.CustomerPortfolioDetails
            );
            this.AllocationDetails =
              res.GetStrategyWiseData_WrapperResult.AllocationDetails;

            this.fillAllocDetails();
            // console.log("customer allocation", this.CustomerAllocation);
            // this.AllocationDetails = this.CustomerAllocation[0].AllocationDetails;
          }
        });
    }

    // this.AllocationDetails.forEach(res=>{
    //   if(res.)
    // })
  }

  fillAllocDetails() {
    this.Customer = this.CustomerAllocation[0].CustomerName;
    this.PortfolioName = this.CustomerAllocation[0].PortfolioName;
    this.NetWorth = this.CustomerAllocation[0].NetWorthDeclared;
    this.InvestmentObj = this.CustomerAllocation[0].InvestmentObjctive;
    this.Risk = this.CustomerAllocation[0].RiskProfile;
    this.AUM = this.CustomerAllocation[0].NetWorthDeclared;

    let key = 'SCHEME_NAME';
    this.findOcc(this.AllocationDetails, key);
    // console.log("this.findOcc(this.AllocationDetails, key);", this.findOcc(this.AllocationDetails, key));
    this.occurences = this.findOcc(this.AllocationDetails, key);

    // this.AllocationDetails.forEach((element, index) => {
    //   this.occurences.forEach((i) => {
    //     if (element.SCHEME_NAME === i.SCHEME_NAME) {
    //       this.AllocationDetails[index].occurrence = i.occurrence;
    //       this.AllocationDetails[index].AssetGroupActualAllocationAmount = 0;
    //       this.AllocationDetails[index].AssetGroupAllocationGapPercent = 0;
    //       this.AllocationDetails[index].AssetGroupRebalancingRequiredAmount = 0;
    //     }
    //   });
    // });
    const allocTypes: any[] = [
      ...new Set(this.AllocationDetails.map((e) => e.SCHEME_NAME)),
    ];
    let groupAllocation = [];
    console.log("allocTypes", allocTypes);

    //Changes done by Alolika G on 28-02-2022 --START
    // if (this.tierFlag !== 'Y') {  //Do not remove
    //   allocTypes.forEach((_type) => {
    //     let obj: any = {
    //       SchemeName: _type,
    //       AssetClass: this.AllocationDetails.filter(
    //         (a) => a.SCHEME_NAME === _type
    //       ),
    //       // GroupTarget: this.AllocationDetails.filter(
    //       //   (a) => a.SCHEME_NAME === _type
    //       // ).reduce((r, a) => {
    //       //   return r + parseFloat(a.AssetClassTargetAmount);
    //       // }, 0),

    //       // GroupAmount: this.AllocationDetails.filter(
    //       //   (a) => a.SCHEME_NAME === _type
    //       // ).reduce((r, a) => {
    //       //   return r + parseFloat(a.AssetClassActualAllocationAmount);
    //       // }, 0),

          // GroupAmount: this.AllocationDetails.filter(
          //   (a) => a.SCHEME_NAME === _type
          // ).reduce((_r, a) => {
          //   return parseFloat(a.AssetClassActualAllocationAmount);
          // }, 0),

          // GroupTarget: this.AllocationDetails.filter(
          //   (a) => a.SCHEME_NAME === _type
          // ).reduce((_r, a) => {
    //         return parseFloat(a.AssetClassTargetAmount);
          // }, 0),


    //       SubTemplateTargetAmount: this.AllocationDetails.filter(
    //         (a) => a.SCHEME_NAME === _type
    //       ).reduce((_r, a) => {
    //         return parseFloat(a.SubTemplateTargetAmount);
    //       }, 0),

    //       GroupGap: this.AllocationDetails.filter(
    //         (a) => a.SCHEME_NAME === _type
    //       ).reduce((r, a) => {
    //         return r + parseFloat(a.AssetClassAllocationGapPercent);
    //       }, 0),
    //       GroupRebalancing: this.AllocationDetails.filter(
    //         (a) => a.SCHEME_NAME === _type
    //       ).reduce((r, a) => {
    //         return r + parseFloat(a.AssetClassRebalancingRequiredAmount || 0.00);
    //       }, 0),

    //       AssetGroupTarget: this.AllocationDetails.filter(
    //         (a) => a.SCHEME_NAME === _type
    //       ).reduce((r, a) => {
    //         return r + parseFloat(a.AssetClassTarget);
    //       }, 0),

    //       AssetGroupCurrent: this.AllocationDetails.filter(
    //         (a) => a.SCHEME_NAME === _type
    //       ).reduce((r, a) => {
    //         return r + parseFloat(a.AssetClassCurrent);
    //       }, 0),
    //     };
    //     obj.Action =
    //       obj.GroupTarget - obj.GroupAmount > 0
    //         ? 'Buy'
    //         : obj.GroupTarget - obj.GroupAmount < 0
    //           ? 'Sell'
    //           : '';
    //     obj.ArrowDirection =
    //       obj.GroupTarget - obj.GroupAmount > 0
    //         ? 'UP'
    //         : obj.GroupTarget - obj.GroupAmount < 0
    //           ? 'DOWN'
    //           : '';


    //     groupAllocation.push(obj);
    //   });
    //   this.allocDetails = groupAllocation;

    // }
    console.log(groupAllocation);

    // let assetTypeArr = [];
    // if (this.tierFlag === 'Y') {
      allocTypes.forEach((_type) => {
        let obj: any = {
          SchemeName: _type,
          AssetClass: this.AllocationDetails.filter(
            (a) => a.SCHEME_NAME === _type
          ),
          GroupTarget: this.AllocationDetails.filter(
            (a) => a.SCHEME_NAME === _type
          ).reduce((r, a) => {
            return r + parseFloat(a.AssetClassTargetAmount);
          }, 0),

          GroupAmount: this.AllocationDetails.filter(
            (a) => a.SCHEME_NAME === _type
          ).reduce((r, a) => {
            return r + parseFloat(a.AssetClassActualAllocationAmount);
          }, 0),

          // GroupAmount: this.AllocationDetails.filter(
          //   (a) => a.SCHEME_NAME === _type
          // ).reduce((_r, a) => {
          //   return parseFloat(a.AssetGroupActualAllocationAmount);
          // }, 0),

          // GroupTarget: this.AllocationDetails.filter(
          //   (a) => a.SCHEME_NAME === _type
          // ).reduce((_r, a) => {
          //   return parseFloat(a.AssetGroupTargetAmount);
          // }, 0),


          SubTemplateTargetAmount: this.AllocationDetails.filter(
            (a) => a.SCHEME_NAME === _type
          ).reduce((_r, a) => {
            return parseFloat(a.SubTemplateTargetAmount);
          }, 0),

          GroupGap: this.AllocationDetails.filter(
            (a) => a.SCHEME_NAME === _type
          ).reduce((_r, a) => {
            return _r + parseFloat(a.AssetClassAllocationGapPercent);
          }, 0),
          GroupRebalancing: this.AllocationDetails.filter(
            (a) => a.SCHEME_NAME === _type
          ).reduce((_r, a) => {
            return  parseFloat(a.AssetGroupRebalancingRequiredAmount || 0.00);
          }, 0),

          AssetGroupTarget: this.AllocationDetails.filter(
            (a) => a.SCHEME_NAME === _type
          ).reduce((_r, a) => {
            return parseFloat(a.AssetGroupTarget);
          }, 0),

          AssetGroupCurrent: this.AllocationDetails.filter(
            (a) => a.SCHEME_NAME === _type
          ).reduce((_r, a) => {
            return parseFloat(a.AssetGroupCurrent);
          }, 0),
        };
        obj.Action =
          obj.GroupTarget - obj.GroupAmount > 0
            ? 'Buy'
            : obj.GroupTarget - obj.GroupAmount < 0
              ? 'Sell'
              : '';
        obj.ArrowDirection =
          obj.GroupTarget - obj.GroupAmount > 0
            ? 'UP'
            : obj.GroupTarget - obj.GroupAmount < 0
              ? 'DOWN'
              : '';


        groupAllocation.push(obj);
      });
      //Changes done by Alolika G on 28-02-2022 --END
      this.allocDetails = groupAllocation;
      groupAllocation.forEach((element, i) => {
        // element.AssetClass.forEach(_ele => {
        const assetTypes: any[] = [
          ...new Set(element.AssetClass.map((e) => e.AssetClass)),
        ];
        const subGroupAllocation = [];
        console.log("assetTypes", i, assetTypes);
        assetTypes.forEach(_subAssetType => {
          let obj: any = {
            SubAssetClass: _subAssetType,

            SUBTEMPLATE: element.AssetClass.filter(
              (a) => a.AssetClass === _subAssetType
            ).reduce((_r, a) => {
              return a.SUBTEMPLATE;
            }, 0),

            AssetClassArray: element.AssetClass.filter(
              (a) => a.AssetClass === _subAssetType
            ),

            AssetClassTarget: element.AssetClass.filter(
              (a) => a.AssetClass === _subAssetType
            ).reduce((_r, a) => {
              return parseFloat(a.AssetClassTarget);
            }, 0),

            AssetClassCurrent: element.AssetClass.filter(
              (a) => a.AssetClass === _subAssetType
            ).reduce((_r, a) => {
              return parseFloat(a.AssetClassCurrent);
            }, 0),

            SubTemplateTarget: element.AssetClass.filter(
              (a) => a.AssetClass === _subAssetType
            ).reduce((_r, a) => {
              return parseFloat(a.SubTemplateTarget);
            }, 0),

            SubTemplateCurrent: element.AssetClass.filter(
              (a) => a.AssetClass === _subAssetType
            ).reduce((_r, a) => {
              return parseFloat(a.SubTemplateCurrent);
            }, 0),

            AssetClassTargetAmount: element.AssetClass.filter(
              (a) => a.AssetClass === _subAssetType
            ).reduce((_r, a) => {
              return parseFloat(a.AssetClassTargetAmount);
            }, 0),

            SubTemplateTargetAmount: element.AssetClass.filter(
              (a) => a.AssetClass === _subAssetType
            ).reduce((_r, a) => {
              return parseFloat(a.SubTemplateTargetAmount);
            }, 0),

            AssetClassActualAllocationAmount: element.AssetClass.filter(
              (a) => a.AssetClass === _subAssetType
            ).reduce((_r, a) => {
              return parseFloat(a.AssetClassActualAllocationAmount);
            }, 0),

            SubTemplateActualAllocationAmount: element.AssetClass.filter(
              (a) => a.AssetClass === _subAssetType
            ).reduce((_r, a) => {
              return parseFloat(a.SubTemplateActualAllocationAmount);
            }, 0),

            AssetClassAllocationGapPercent: element.AssetClass.filter(
              (a) => a.AssetClass === _subAssetType
            ).reduce((_r, a) => {
              return parseFloat(a.AssetClassAllocationGapPercent);
            }, 0),

            SubTemplateAllocationGapPercent: element.AssetClass.filter(
              (a) => a.AssetClass === _subAssetType
            ).reduce((_r, a) => {
              return parseFloat(a.SubTemplateAllocationGapPercent);
            }, 0),

            AssetClassRebalancingRequiredAmount: element.AssetClass.filter(
              (a) => a.AssetClass === _subAssetType
            ).reduce((_r, a) => {
              return parseFloat(a.AssetClassRebalancingRequiredAmount || 0.00);
            }, 0),

            SubTemplateRebalancingRequiredAmount: element.AssetClass.filter(
              (a) => a.AssetClass === _subAssetType
            ).reduce((_r, a) => {
              return parseFloat(a.SubTemplateRebalancingRequiredAmount || 0.00);
            }, 0),

          };
          subGroupAllocation.push(obj);
        })
        element.AssetClass = subGroupAllocation;
        console.log("subGroupAllocation", subGroupAllocation);

      });
    // }

    console.log(groupAllocation);
    // this.fnCalculateAssetGroupTragetAmount();
    // this.fnCalculateAssetGroupActualAmount();
    // this.fnCalculateAssetGroupGapPercent();
    // this.fnCalculateAssetGroupRebalancing();
    // this.fnCalculateAssetGroupTarget();
    // this.fnCalculateAssetGroupCurrent();
    let chartdata = [];
    this.allocDetails.forEach((element) => {
      chartdata.push([
        // 'MF',
        // 2000.0,
        // 2000.0
        element.SchemeName,
        parseFloat(element.GroupAmount),
        parseFloat(element.GroupTarget),
      ]);
    });

    // console.log(chartdata)

    this.actionsdata = chartdata.filter(
      (thing, index, self) =>
        index ===
        self.findIndex((t) => JSON.stringify(t) === JSON.stringify(thing))
    );

    this.legends = [
      {
        name: 'Current Allocation',
        data: [0]
      },
      {
        name: 'Target Amount',
        data: [0]
      }
    ]

    this.legendFlag = true;


    this.loader = false;

    // console.log("actions", this.actionsdata);
    console.log("AllocationDetails", this.AllocationDetails);
  }

  findOcc(arr, key) {
    let arr2 = [];

    arr.forEach((x) => {
      if (
        arr2.some((val) => {
          return val[key] == x[key];
        })
      ) {
        arr2.forEach((k) => {
          if (k[key] === x[key]) {
            k['occurrence']++;
          }
        });
      } else {
        let a = {};
        a[key] = x[key];
        a['occurrence'] = 1;
        arr2.push(a);
      }
    });

    return arr2;
  }

  fnCalculateAssetGroupTragetAmount() {
    let SCHEME_NAME: string = '';
    let AssetGroupTargetAmount: any = 0;
    try {
      // Adding the Asset group target amount
      this.AllocationDetails.forEach((element, index) => {
        if (element) {
          if (SCHEME_NAME !== '') {
            if (SCHEME_NAME === element.SCHEME_NAME) {
              this.AllocationDetails[index - 1].AssetGroupTargetAmount = 0;
              AssetGroupTargetAmount =
                Number(AssetGroupTargetAmount) +
                Number(element.AssetClassTargetAmount);
              element.AssetGroupTargetAmount = AssetGroupTargetAmount;
            } else {
              SCHEME_NAME = element.SCHEME_NAME;
              AssetGroupTargetAmount = 0;
              this.AllocationDetails[index].AssetGroupTargetAmount =
                element.AssetClassTargetAmount;
              AssetGroupTargetAmount = element.AssetClassTargetAmount;
            }
          } else {
            SCHEME_NAME = element.SCHEME_NAME;
            AssetGroupTargetAmount = 0;
            this.AllocationDetails[index].AssetGroupTargetAmount =
              element.AssetClassTargetAmount;
          }
        }
      });
      // copying the same amount for above elements
      let AssetGroupTargetAmountCopy: any = 0;
      for (let i = this.AllocationDetails.length - 1; i >= 0; i--) {
        if (this.AllocationDetails[i].AssetGroupTargetAmount === 0) {
          this.AllocationDetails[i].AssetGroupTargetAmount =
            AssetGroupTargetAmountCopy;
        } else {
          AssetGroupTargetAmountCopy =
            this.AllocationDetails[i].AssetGroupTargetAmount;
        }
      }
      // console.log('Modified array:', this.AllocationDetails);
    } catch (Ex) {
      console.log('Error occured while calculating Group target amount: ', Ex);
    }
  }

  fnCalculateAssetGroupActualAmount() {
    let SCHEME_NAME: string = '';
    let AssetGroupActualAllocationAmount: any = 0;
    try {
      // Adding the Asset group target amount
      this.AllocationDetails.forEach((element, index) => {
        if (element) {
          if (SCHEME_NAME !== '') {
            if (SCHEME_NAME === element.SCHEME_NAME) {
              this.AllocationDetails[
                index - 1
              ].AssetGroupActualAllocationAmount = 0;
              AssetGroupActualAllocationAmount =
                Number(AssetGroupActualAllocationAmount) +
                Number(element.AssetClassActualAllocationAmount);
              element.AssetGroupActualAllocationAmount =
                AssetGroupActualAllocationAmount;
            } else {
              SCHEME_NAME = element.SCHEME_NAME;
              AssetGroupActualAllocationAmount = 0;
              this.AllocationDetails[index].AssetGroupActualAllocationAmount =
                element.AssetClassActualAllocationAmount;
              AssetGroupActualAllocationAmount =
                element.AssetClassActualAllocationAmount;
            }
          } else {
            SCHEME_NAME = element.SCHEME_NAME;
            AssetGroupActualAllocationAmount = 0;
            this.AllocationDetails[index].AssetGroupActualAllocationAmount =
              element.AssetClassActualAllocationAmount;
          }
        }
      });
      // copying the same amount for above elements
      let AssetGroupActualAmountCopy: any = 0;
      for (let i = this.AllocationDetails.length - 1; i >= 0; i--) {
        if (this.AllocationDetails[i].AssetGroupActualAllocationAmount === 0) {
          this.AllocationDetails[i].AssetGroupActualAllocationAmount =
            AssetGroupActualAmountCopy;
        } else {
          AssetGroupActualAmountCopy =
            this.AllocationDetails[i].AssetGroupActualAllocationAmount;
        }
      }
      // console.log('Modified array:', this.AllocationDetails);
    } catch (Ex) {
      console.log('Error occured while calculating Group target amount: ', Ex);
    }
  }

  fnCalculateAssetGroupGapPercent() {
    let SCHEME_NAME: string = '';
    let AssetGroupAllocationGapPercent: any = 0;
    try {
      // Adding the Asset group target amount
      this.AllocationDetails.forEach((element, index) => {
        if (element) {
          if (SCHEME_NAME !== '') {
            if (SCHEME_NAME === element.SCHEME_NAME) {
              this.AllocationDetails[
                index - 1
              ].AssetGroupAllocationGapPercent = 0;
              AssetGroupAllocationGapPercent =
                Number(AssetGroupAllocationGapPercent) +
                Number(element.AssetClassAllocationGapPercent);
              element.AssetGroupAllocationGapPercent =
                AssetGroupAllocationGapPercent;
            } else {
              SCHEME_NAME = element.SCHEME_NAME;
              AssetGroupAllocationGapPercent = 0;
              this.AllocationDetails[index].AssetGroupAllocationGapPercent =
                element.AssetClassAllocationGapPercent;
              AssetGroupAllocationGapPercent =
                element.AssetClassAllocationGapPercent;
            }
          } else {
            SCHEME_NAME = element.SCHEME_NAME;
            AssetGroupAllocationGapPercent = 0;
            this.AllocationDetails[index].AssetGroupAllocationGapPercent =
              element.AssetClassAllocationGapPercent;
          }
        }
      });
      // copying the same amount for above elements
      let AssetGroupGapPercentCopy: any = 0;
      for (let i = this.AllocationDetails.length - 1; i >= 0; i--) {
        if (this.AllocationDetails[i].AssetGroupAllocationGapPercent === 0) {
          this.AllocationDetails[i].AssetGroupAllocationGapPercent =
            AssetGroupGapPercentCopy;
        } else {
          AssetGroupGapPercentCopy =
            this.AllocationDetails[i].AssetGroupAllocationGapPercent;
        }
      }
      // console.log('Modified array:', this.AllocationDetails);
    } catch (Ex) {
      console.log('Error occured while calculating Group target amount: ', Ex);
    }
  }

  fnCalculateAssetGroupRebalancing() {
    let SCHEME_NAME: string = '';
    let AssetGroupRebalancingRequiredAmount: any = 0;
    try {
      // Adding the Asset group target amount
      this.AllocationDetails.forEach((element, index) => {
        if (element) {
          if (SCHEME_NAME !== '') {
            if (SCHEME_NAME === element.SCHEME_NAME) {
              this.AllocationDetails[
                index - 1
              ].AssetGroupRebalancingRequiredAmount = 0;
              AssetGroupRebalancingRequiredAmount =
                Number(AssetGroupRebalancingRequiredAmount) +
                Number(element.AssetClassRebalancingRequiredAmount);
              element.AssetGroupRebalancingRequiredAmount =
                AssetGroupRebalancingRequiredAmount;
            } else {
              SCHEME_NAME = element.SCHEME_NAME;
              AssetGroupRebalancingRequiredAmount = 0;
              this.AllocationDetails[
                index
              ].AssetGroupRebalancingRequiredAmount =
                element.AssetClassRebalancingRequiredAmount;
              AssetGroupRebalancingRequiredAmount =
                element.AssetClassRebalancingRequiredAmount;
            }
          } else {
            SCHEME_NAME = element.SCHEME_NAME;
            AssetGroupRebalancingRequiredAmount = 0;
            this.AllocationDetails[index].AssetGroupRebalancingRequiredAmount =
              element.AssetClassRebalancingRequiredAmount;
          }
        }
      });
      // copying the same amount for above elements
      let AssetGroupRebalanceCopy: any = 0;
      for (let i = this.AllocationDetails.length - 1; i >= 0; i--) {
        if (
          this.AllocationDetails[i].AssetGroupRebalancingRequiredAmount === 0
        ) {
          this.AllocationDetails[i].AssetGroupRebalancingRequiredAmount =
            AssetGroupRebalanceCopy;
        } else {
          AssetGroupRebalanceCopy =
            this.AllocationDetails[i].AssetGroupRebalancingRequiredAmount;
        }
      }
      // console.log('Modified array:', this.AllocationDetails);
    } catch (Ex) {
      console.log('Error occured while calculating Group target amount: ', Ex);
    }
  }

  fnCalculateAssetGroupTarget() {
    let SCHEME_NAME: string = '';
    let AssetGroupTarget: any = 0;
    try {
      // Adding the Asset group target amount
      this.AllocationDetails.forEach((element, index) => {
        if (element) {
          if (SCHEME_NAME !== '') {
            if (SCHEME_NAME === element.SCHEME_NAME) {
              this.AllocationDetails[index - 1].AssetGroupTarget = 0;
              AssetGroupTarget =
                Number(AssetGroupTarget) + Number(element.AssetClassTarget);
              element.AssetGroupTarget = AssetGroupTarget;
            } else {
              SCHEME_NAME = element.SCHEME_NAME;
              AssetGroupTarget = 0;
              this.AllocationDetails[index].AssetGroupTarget =
                element.AssetClassTarget;
              AssetGroupTarget = element.AssetClassTarget;
            }
          } else {
            SCHEME_NAME = element.SCHEME_NAME;
            AssetGroupTarget = 0;
            this.AllocationDetails[index].AssetGroupTarget =
              element.AssetClassTarget;
          }
        }
      });
      // copying the same amount for above elements
      let AssetGroupTargetCopy: any = 0;
      for (let i = this.AllocationDetails.length - 1; i >= 0; i--) {
        if (this.AllocationDetails[i].AssetGroupTarget === 0) {
          this.AllocationDetails[i].AssetGroupTarget = AssetGroupTargetCopy;
        } else {
          AssetGroupTargetCopy = this.AllocationDetails[i].AssetGroupTarget;
        }
      }
      // console.log('Modified array:', this.AllocationDetails);
    } catch (Ex) {
      console.log('Error occured while calculating Group target amount: ', Ex);
    }
  }

  fnCalculateAssetGroupCurrent() {
    let SCHEME_NAME: string = '';
    let AssetGroupCurrent: any = 0;
    try {
      // Adding the Asset group target amount
      this.AllocationDetails.forEach((element, index) => {
        if (element) {
          if (SCHEME_NAME !== '') {
            if (SCHEME_NAME === element.SCHEME_NAME) {
              this.AllocationDetails[index - 1].AssetGroupCurrent = 0;
              AssetGroupCurrent =
                Number(AssetGroupCurrent) + Number(element.AssetClassCurrent);
              element.AssetGroupCurrent = AssetGroupCurrent;
            } else {
              SCHEME_NAME = element.SCHEME_NAME;
              AssetGroupCurrent = 0;
              this.AllocationDetails[index].AssetGroupCurrent =
                element.AssetClassCurrent;
              AssetGroupCurrent = element.AssetClassCurrent;
            }
          } else {
            SCHEME_NAME = element.SCHEME_NAME;
            AssetGroupCurrent = 0;
            this.AllocationDetails[index].AssetGroupCurrent =
              element.AssetClassCurrent;
          }
        }
      });
      // copying the same amount for above elements
      let AssetGroupCurrentCopy: any = 0;
      for (let i = this.AllocationDetails.length - 1; i >= 0; i--) {
        if (this.AllocationDetails[i].AssetGroupCurrent === 0) {
          this.AllocationDetails[i].AssetGroupCurrent = AssetGroupCurrentCopy;
        } else {
          AssetGroupCurrentCopy = this.AllocationDetails[i].AssetGroupCurrent;
        }
      }
      // console.log('Modified array:', this.AllocationDetails);
    } catch (Ex) {
      console.log('Error occured while calculating Group target amount: ', Ex);
    }
  }

  async callOrderEntry(_dir, template, _item) {
    // template = template.toUpperCase();
    // this.showOrderEntry = !this.showOrderEntry;
    console.log("")
    switch (template) {
      case 'Shares':
        this.Product = 'Equity_Setup';
        // this.cfs.setAsset(_item.Underlying);
        // this.cfs.setDirection(dir);
        // this.cfs.setFlagToDisplayCust(true);

        let itemEQ = [];
        itemEQ.push(_item);
        this.getEQOrderDetails(itemEQ);
        break;

      case 'ETFs':
        this.Product = 'Equity_Setup';
        // this.cfs.setDirection(dir);

        let itemETF = [];
        itemETF.push(_item);
        this.getEQOrderDetails(itemETF);
        break;

      case 'Mutual Funds':
        this.Product = 'Fund_Setup';
        // this.wfs.MFList.subscribe((mf) => {
        //   // console.log("in cards compennts" , mf);
        //   this.mfList = mf
        //   const selectedMF = this.mfList.filter(
        //     (b) => b.Code === _item.FundCode  //Added by Alolika G | 19-02-2022
        //   );
        //   this.cfs.setAsset(selectedMF[0].ISIN);
        //   this.cfs.setDirection(dir);
        //   this.cfs.setFlagToDisplayCust(true);
        // });
        console.log("_item", _item);
        let item = [];
        item.push(_item);
        this.getMFOrderDetails(item);

        break;

      case 'Mutual Funds Trade':
        this.Product = 'Fund_Setup';
        // this.wfs.MFList.subscribe((mf) => {
        //   // console.log("in cards compennts" , mf);
        //   this.mfList = mf
        //   const selectedMF = this.mfList.filter(
        //     (b) => b.Code === _item.FundCode  //Added by Alolika G | 19-02-2022
        //   );
        //   this.cfs.setAsset(selectedMF[0].ISIN);
        //   this.cfs.setDirection(dir);
        //   this.cfs.setFlagToDisplayCust(true);
        // });
        let itemMF = [];
        itemMF.push(_item);
        // this.bondCalSubf = false;

        this.getMFOrderDetails(itemMF);

        break;

      case 'Bonds Investment':
        this.Product = 'Bonds';
        // sessionStorage.setItem('BondPorfolioDetails', 'FromRebalOrder');
        // this.cfs.setDirection(dir);
        // this.cfs.setFlagToDisplayCust(true);
        // this.cfs.setAsset(_item);
        let itemFI = [];
        itemFI.push(_item);
        this.bondCalSubf = false;
        this.selectedBond = await this.wfs.getbondinfoRebalance(_item.ISIN, this.authorApi.EntityID, this.LoginId);
        this.getBondsOrderDetails(itemFI);
        break;

      default:
        this.showOrderEntry = false;
        break;
    }
  }

  clickRebalance() {
    console.log('this.AllocationDetails', this.AllocationDetails);
    // this.AllocationDetails.forEach((element) => {
    //   switch (element.AssetClass) {
    //     case 'Shares':
    //       this.rebalanceEQ = element.AssetClassRebalancingRequiredAmount;
    //       if (
    //         this.cfs.UnformatNumberwithoutevent(
    //           element.AssetGroupTargetAmount -
    //           element.AssetGroupActualAllocationAmount
    //         ) < 0
    //       ) {
    //         this.dirEQ = 'SELL';
    //       } else {
    //         this.dirEQ = 'BUY';
    //       }
    //       break;

    //     case 'Mutual Funds Trade':
    //       this.rebalanceMF = element.AssetClassRebalancingRequiredAmount;
    //       if (
    //         this.cfs.UnformatNumberwithoutevent(
    //           element.AssetGroupTargetAmount -
    //           element.AssetGroupActualAllocationAmount
    //         ) < 0
    //       ) {
    //         this.dirMF = 'SELL';
    //       } else {
    //         this.dirMF = 'BUY';
    //       }
    //       break;

    //     case 'Mutual Funds':
    //       this.rebalanceMF = element.AssetClassRebalancingRequiredAmount;
    //       if (
    //         this.cfs.UnformatNumberwithoutevent(
    //           element.AssetGroupTargetAmount -
    //           element.AssetGroupActualAllocationAmount
    //         ) < 0
    //       ) {
    //         this.dirMF = 'SELL';
    //       } else {
    //         this.dirMF = 'BUY';
    //       }
    //       break;

    //     case 'Bonds Investment':
    //       this.rebalanceBonds = element.AssetClassRebalancingRequiredAmount;
    //       if (
    //         this.cfs.UnformatNumberwithoutevent(
    //           element.AssetGroupTargetAmount -
    //           element.AssetGroupActualAllocationAmount
    //         ) < 0
    //       ) {
    //         this.dirBonds = 'SELL';
    //       } else {
    //         this.dirBonds = 'BUY';
    //       }
    //       break;

    //     default:
    //       break;
    //   }
    // });
    this.successMsg = '';
    this.allocDetails.forEach((element) => {
      element.AssetClass.forEach(a => {
        switch (a.SubAssetClass) {
          case 'Shares':
            this.rebalanceEQ = a.AssetClassRebalancingRequiredAmount;
            if (
              this.cfs.UnformatNumberwithoutevent(
                element.GroupTarget -
                element.GroupAmount
              ) < 0
            ) {
              this.dirEQ = 'SELL';
            } else {
              this.dirEQ = 'BUY';
            }

            break;

          case 'Mutual Funds Trade':
            this.rebalanceMF = a.AssetClassRebalancingRequiredAmount;
            if (
              this.cfs.UnformatNumberwithoutevent(
                element.GroupTarget -
                element.GroupAmount
              ) < 0
            ) {
              this.dirMF = 'SELL';
            } else {
              this.dirMF = 'BUY';
            }
            break;

          case 'Mutual Funds':
            this.rebalanceMF = a.AssetClassRebalancingRequiredAmount;
            if (
              this.cfs.UnformatNumberwithoutevent(
                element.GroupTarget -
                element.GroupAmount
              ) < 0
            ) {
              this.dirMF = 'SELL';
            } else {
              this.dirMF = 'BUY';
            }
            break;

          case 'Bonds Investment':
            this.rebalanceBonds = a.AssetClassRebalancingRequiredAmount;
            if (
              this.cfs.UnformatNumberwithoutevent(
                element.GroupTarget -
                element.GroupAmount
              ) < 0
            ) {
              this.dirBonds = 'SELL';
            } else {
              this.dirBonds = 'BUY';
            }
            break;

          default:
            break;
        }
      });

    });

    this.getRebalEQ();
    this.getRebalMF();
    this.getRebalBonds();
  }

  getRebalEQ() {
    this.afs
      .GetRebalanceData_EQ(
        this.dirEQ,
        this.Portfolio,
        this.authorApi.EntityID,
        this.CustomerId,
        this.rebalanceEQ
      )
      .subscribe((res) => {
        if (res) {
          this.EquitiesTransactionDetails = [];
          this.EquitiesData = [];
          this.EquitiesData.push(res.GetRebalanceData_WrapperResult);
          console.log("this.EquitiesData",this.EquitiesData);
          if (![undefined, null].includes(this.EquitiesData[0].Equities_Currency)) {
            this.imbalanceCcy = this.EquitiesData[0].Equities_Currency;
          }
          res.GetRebalanceData_WrapperResult.EquitiesTransactionDetails.forEach((element, i) => {
            if (Number(this.cfs.UnformatNumberwithcomma(element.Quantity)) <= 0 || element.Quantity === "") {
              res.GetRebalanceData_WrapperResult.EquitiesTransactionDetails[i].orderFlag = false;
            } else {
              res.GetRebalanceData_WrapperResult.EquitiesTransactionDetails[i].orderFlag = true;
            }
            res.GetRebalanceData_WrapperResult.EquitiesTransactionDetails[i].index = i;
          });
          console.log("res.GetRebalanceData_Wrapper_UTResult.EquitiesTransactionDetails", res.GetRebalanceData_WrapperResult.EquitiesTransactionDetails)

          this.EquitiesTransactionDetails =
            res.GetRebalanceData_WrapperResult.EquitiesTransactionDetails;
          this.Equities_Imbalance = Number(
            this.cfs.UnformatNumberwithoutevent(
              res.GetRebalanceData_WrapperResult.Equities_Imbalance
            )
          );
          for(let i = 0; i < this.EquitiesTransactionDetails.length; i++) {
            this.EquitiesTransactionDetails[i].dir = this.dirEQ;
          }
        } else {
        }
      });
  }

  getRebalMF() {
    this.afs
      .GetRebalanceData_MF(
        this.dirMF,
        this.Portfolio,
        this.authorApi.EntityID,
        this.CustomerId,
        this.rebalanceMF
      )
      .subscribe((res) => {
        if (res) {
          this.MFTransactionDetails = [];
          this.MFData = [];
          this.MFData.push(res.GetRebalanceData_Wrapper_UTResult);
          console.log("this.MFData",this.MFData);
          if (![undefined, null].includes(this.MFData[0].MF_Currency)) {
            this.imbalanceCcy = this.MFData[0].MF_Currency;
          }
          res.GetRebalanceData_Wrapper_UTResult.UTTransactionDetails.forEach((element, i) => {
            if (Number(this.cfs.UnformatNumberwithcomma(element.Units)) <= 0 || element.Units === "") {
              res.GetRebalanceData_Wrapper_UTResult.UTTransactionDetails[i].orderFlag = false;
            } else {
              res.GetRebalanceData_Wrapper_UTResult.UTTransactionDetails[i].orderFlag = true;

            }
            res.GetRebalanceData_Wrapper_UTResult.UTTransactionDetails[i].index = i;

          });
          console.log("res.GetRebalanceData_Wrapper_UTResult.UTTransactionDetails", res.GetRebalanceData_Wrapper_UTResult.UTTransactionDetails)
          this.MFTransactionDetails =
            res.GetRebalanceData_Wrapper_UTResult.UTTransactionDetails;
          this.MF_Imbalance = Number(
            this.cfs.UnformatNumberwithoutevent(
              res.GetRebalanceData_Wrapper_UTResult.MF_Imbalance
            )
          );
          for(let i = 0; i < this.MFTransactionDetails.length; i++) {
            this.MFTransactionDetails[i].dir = this.dirMF;
          }
        } else {
        }
      });
  }

  getRebalBonds() {
    this.afs
      .GetRebalanceData_Bonds(
        this.dirBonds,
        this.Portfolio,
        this.authorApi.EntityID,
        this.CustomerId,
        this.rebalanceBonds
      )
      .subscribe((res) => {
        if (res) {
          this.BondsTransactionDetails = [];
          this.BondsData = [];
          this.BondsData.push(res.GetRebalanceData_Wrapper_BondsResult);
          console.log("this.BondsData",this.BondsData);
          if (![undefined, null].includes(this.BondsData[0].Bonds_Currency)) {
            this.imbalanceCcy = this.BondsData[0].Bonds_Currency;
          }
          res.GetRebalanceData_Wrapper_BondsResult.BondsTransactionDetails.forEach((element, i) => {
            if (Number(this.cfs.UnformatNumberwithcomma(element.Nominal)) <= 0 || element.Nominal === "") {
              res.GetRebalanceData_Wrapper_BondsResult.BondsTransactionDetails[i].orderFlag = false;
            } else {
              res.GetRebalanceData_Wrapper_BondsResult.BondsTransactionDetails[i].orderFlag = true;
            }
            res.GetRebalanceData_Wrapper_BondsResult.BondsTransactionDetails[i].index = i;

          });
          console.log("res.GetRebalanceData_Wrapper_UTResult.BondsTransactionDetails", res.GetRebalanceData_Wrapper_BondsResult.BondsTransactionDetails)

          this.BondsTransactionDetails =
            res.GetRebalanceData_Wrapper_BondsResult.BondsTransactionDetails;
          this.Bonds_Imbalance = Number(
            this.cfs.UnformatNumberwithoutevent(
              res.GetRebalanceData_Wrapper_BondsResult.Bonds_Imbalance
            )
          );
          for(let i = 0; i < this.BondsTransactionDetails.length; i++) {
            this.BondsTransactionDetails[i].dir = this.dirBonds;
          }
          // console.log("Bondsdir", this.Bondsdir);
        } else {
        }
      });
  }

  //Changes done by Alolika G on 10-02-2022
  fnRedirectToHomePage() {
    if (this.isUserRM) {
      this.router.navigate(['/ClientSummary'], { queryParams: { showPortfolio: true } });
    } else {
      this.location.back(); //  Added by Alolika G | 15-02-2022

    }
  }

  openFilterPopup() {
    this.showFilter = !this.showFilter;
  }

  checkboxAction(item) {
    // this.ColumnTierCollapsedCopy = this.ColumnTierCollapsed;
    // this.applyFilter(item);
    this.checkedFilter = item;

  }

  isAllSelected() {
    this.masterSelected = this.filterArray.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }
  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (var i = 0; i < this.filterArray.length; i++) {
      this.filterArray[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    // for (var i = 0; i < this.filterArray.length; i++) {
    //   // if(this.filterArray[i].isSelected)
    //   this.checkedList.push(this.filterArray[i]);
    // }
    this.checkedList = this.filterArray;
    // this.checkedList = JSON.stringify(this.checkedList);
    console.log("this.checkedList", this.checkedList);
  }



  applyFilter(_item) {
    // this.checkedFilter = item;
    this.ColumnTierCollapsedCopy = [];
    this.ColumnTierCollapsed.forEach(element => {
      this.checkedList.forEach(e => {
        
        if (element.includes(e.value)) {
          if (e.value === 'Asset Group') {
            this.AssetGroupFlag = e.isSelected;
            if(e.isSelected){
              this.ColumnTierCollapsedCopy.push(element);
            }

          } else if (e.value === 'Asset Class') {

            this.AssetClassFlag = e.isSelected;
            if (e.isSelected) {
              this.ColumnTierCollapsedCopy.push(element);
            }

          } else if (e.value === 'Sub Template') {
            this.SubTemplateFlag = e.isSelected;
            if(e.isSelected){
              this.ColumnTierCollapsedCopy.push(element);
            }
            // this.AssetGroupFlag = false;
            // this.AssetClassFlag = false;
            // this.CategoryFlag = false;
          } else if (e.value === 'Category') {
            this.CategoryFlag = e.isSelected;
            if(e.isSelected){
              this.ColumnTierCollapsedCopy.push(element);
            }
            // this.SubTemplateFlag = false;         
            // this.AssetGroupFlag = false;
            // this.AssetClassFlag = false;
          } else if (e.value === 'All') {
            this.ColumnTierCollapsedCopy = this.ColumnTierCollapsed;
            this.ColumnTierExpand = this.ColumnTierCollapsed;
            if(e.isSelected){
                this.ColumnTierCollapsedCopy.push(element);
            }
            this.CategoryFlag = true;
            this.SubTemplateFlag = true;
            this.AssetGroupFlag = true;
            this.AssetClassFlag = true;
          }
        }
      });
      this.ColumnTierExpand = this.ColumnTierCollapsed;

      this.ref.detectChanges();

    });

    console.log("ColumnTierCollapsedCopy", this.ColumnTierCollapsedCopy);
  }

  placeBulkOrder() {
    this.loadflag = true;
    // this.getMFOrderDetails(this.MFTransactionDetails);
    // this.getBondsOrderDetails(this.BondsTransactionDetails);
    // this.getEQOrderDetails(this.EquitiesTransactionDetails);

    if(this.EquitiesTransactionDetails.length > 0) {
      let EQOrdersArray = []
      EQOrdersArray = this.EquitiesTransactionDetails;
      EQOrdersArray = this.EquitiesTransactionDetails.filter(e => e.orderFlag == true);
      console.log("EquitiesTransactionDetails", EQOrdersArray);
      var indexEQ = EQOrdersArray.length - 1;
      this.orderIntervalEQ = setInterval(() => {
        if (indexEQ >= 0) {
          this.callOrderEntry(
            '',
            'Shares',
            EQOrdersArray[indexEQ]
          );
          console.log(
  
          );
          indexEQ--;
        }else{
          clearInterval(this.orderIntervalEQ);
        }
      }, 1000);
    }

    if(this.MFTransactionDetails.length > 0) {
      let MFOrdersArray = []
      MFOrdersArray = this.MFTransactionDetails;
      MFOrdersArray = this.MFTransactionDetails.filter(e => e.orderFlag == true);
      console.log("MFTransactionDetails", MFOrdersArray);
      var indexMF = MFOrdersArray.length - 1;
      this.orderIntervalMF = setInterval(() => {
        if (indexMF >= 0) {
          this.callOrderEntry(
            '',
            'Mutual Funds',
            MFOrdersArray[indexMF]
          );
          console.log(
  
          );
          indexMF--;
        }else{
          clearInterval(this.orderIntervalMF);
        }
      }, 1000);
    }

    if(this.BondsTransactionDetails.length > 0) {
      let FIOrdersArray = []
      FIOrdersArray = this.EquitiesTransactionDetails;
      FIOrdersArray = this.BondsTransactionDetails.filter(e => e.orderFlag == true);
      console.log("BondsTransactionDetails", FIOrdersArray);
      var index = FIOrdersArray.length - 1;
      this.orderInterval = setInterval(() => {
        if (index >= 0) {
          this.callOrderEntry(
            '',
            'Bonds Investment',
            FIOrdersArray[index]
          );
          console.log(
  
          );
          index--;
        }else{
          clearInterval(this.orderInterval);
        }
      }, 1000);
    }
  }

  getEQOrderDetails(orderDetails) {
    try {
      if (orderDetails.length > 0) {
        this.OrderDetailsEQ = [];
        orderDetails.forEach(async element => {
          if (element.orderFlag) {
            if (element.AccountNo !== '' || element.AccountNo !== null) {
              this.shareList = await this.wfs.GetShareListAsync(element.Underlying);
              if (this.shareList.length !== 0) {
                const NMArray = this.shareList.filter(
                  (b) => b.Feedcode === element.Underlying
                )[0];
                let NoteMasterId = NMArray.Note_Master_Id;
                // this.OrderQty = NMArray.Note_Master_Id;
                console.log('id', NMArray, NoteMasterId);
                this.selectShare(NoteMasterId, element);
              }
            }
          } else {
            this.successMsg = 'Invalid Quantity';
            this.loadflag = false;
          }


        });
      } else {

      }
    } catch (error) {

    }
  }

  getMFOrderDetails(orderDetails) {
    try {
      if (orderDetails.length > 0) {
        this.OrderDetailsMF = [];
        this.wfs.MFList.subscribe((mf) => {
          this.mfList = mf;
        });

        orderDetails.forEach((element, _i) => {
          const selectedMF = this.mfList.filter(
            (b) => b.Code === element.FundCode
          );
          if (element.orderFlag) {
            // console.log("selected MF", selectedMF);
            this.OrderDetailsMF.push({
              "CustomerID": element.CustomerID,
              "CustomerName": element.CustomerName.split('|')[0],
              "Portfolio": element.Portfolio,
              "RMName": this.isUserRM ? this.RMName : this.homeApi.RMName,
              "CIF": this.isUserRM ? this.CIF : this.homeApi.CIF,
              "FundCode": element.FundCode,
              "Currency": element.Currency,
              "ApplicationType": element.dir === 'BUY' ? 'Subscription' : 'Redemption',
              "Account_Number": element.NAACCNoSecondary || '',
              "Notional": Number(this.cfs.UnformatNumberwithcomma(element.InvestmentAmount)),
              "Units": Number(this.cfs.UnformatNumberwithcomma(element.Units)),
              "FundMode": 'Fully Funded',
              "LTV": selectedMF[0].LTV,
              "NAV": selectedMF[0].BidNAV,
              "MinInvestment": selectedMF[0].Min_Inv_Amt,
              "Rating": selectedMF[0].Rating
            })
          } else {
            this.successMsg = 'Invalid Units';
            this.loadflag = false;
          }
        });
        // console.log("this.OrderDetailsMF MF", this.OrderDetailsMF);
        if (this.OrderDetailsMF.length > 0) {
          this.OrderDetailsMF.forEach(async element => {
            this.orderDetails = {};
            this.orderDetails = {
              "custID": element.CustomerID,
              "CRR": element.Rating,
              "commissionValue": '',
              "commissionPercentage": '',
              "commissionReason": '',
              "currency": element.Currency,
              "custName": element.CustomerName,
              "orderType": "",
              "direction": element.ApplicationType,
              "fundingMode": element.FundMode,
              "settlementAmount": element.Notional,
              "productCode": element.FundCode,
              "productref": this.NMID
            }

            if (element.ApplicationType === 'Subscription') {
              this.cashBalanceMF(element);

            } else if (element.ApplicationType === 'Redemption') {
              this.sellBalanceMF(element);
            }

          });
        }
      } else {

      }
    } catch (error) {

    }

  }

  sellBalanceMF(fund) {
    this.wfs.getCustPortfolioSecurityHoldings_bulk(
      fund.CustomerID,
      fund.Portfolio,
      this.baseCcy
    ).then(res => {
      if (res.length !== 0) {
        this.portfolioDetails = res;
        this.remainingUnitsMF = 0;
        console.log(this.portfolioDetails, "this.details");
        this.portfolioDetails.forEach((elem) => {
          if (elem.CEHD_Stock_Code[0] === (fund.FundCode)) {
            this.remainingUnitsMF = elem.CEHD_Available_Qty[0];
            // var mfISIN = elem;
            // console.log(mfISIN);
            this.noBalFlagMF = true;
          }
        });
        if(this.noBalFlagMF) {
          this.MForderSubscribe(fund);
        }

      } else {
        this.loadflag = false;
        this.noBalFlagMF = false;
      }
    })
    // this.portSecHolSubcription = this.wfs.portfolioSecHoldingObserver.subscribe((res) => {
    //   if (res.length !== 0) {
    //     this.portfolioDetails = res;
    //     this.remainingUnitsMF = 0;
    //     console.log(this.portfolioDetails, "this.details");
    //     this.portfolioDetails.forEach((elem) => {
    //       if (elem.CEHD_Stock_Code[0] === (fund.FundCode)) {
    //         this.remainingUnitsMF = elem.CEHD_Available_Qty[0];
    //         // var mfISIN = elem;
    //         // console.log(mfISIN);
    //         this.noBalFlagMF = true;
    //       }
    //     });
    //     if(this.noBalFlagMF) {
    //       this.MForderSubscribe(fund);
    //     }

    //   } else {
    //     this.loadflag = false;
    //     this.noBalFlagMF = false;
    //   }
    //   // console.log("this.remainingUnits", this.remainingUnits);
    // });
  }

  getBondsOrderDetails(orderDetails) {
    try {
      if (orderDetails.length > 0) {
        orderDetails.forEach(async (element) => {
          if (element.orderFlag) {
            this.orderDetailsBonds = [];
            this.bondCalSubf = false;
            // this.selectedBond = await this.wfs.getbondinfoRebalance(element.ISIN, this.authorApi.EntityID, this.LoginId);
            // console.log("this.bondDetails", this.selectedBond);
            this.notionalFI = Number(this.cfs.UnformatNumberwithcomma(element.Nominal))
            if (!element.BuySell) {
              this.successMsg = 'Please select Customer B/S.';
              this.loadflag = false;
            } else if (!this.notionalFI) {
              this.successMsg = 'Please enter Notional amount.';
              this.loadflag = false;
            } else if (this.notionalFI <= 0) {
              this.successMsg = 'Notional amount should be greater than 0.';
              this.loadflag = false;
            }
            // this.bondCalSubf = false;

            if (element.BuySell && this.notionalFI > 0 && element.CustomerName) {
              this.orderDetailsBonds = [];
              this.orderDetailsBonds.push(element);
              this.successMsg = '';


              this.CalculationSubscribed(element)

            }
          } else {
            this.successMsg = 'Invalid Nominal'
            this.loadflag = false;
          }

        });

      }
    } catch (error) {

    }
  }

  CalculationSubscribed(bond) {
    try {
      this.wfs.getbondCalculations_bulk(
        this.LoginId,
        this.selectedBond.NoteMasterID,
        this.notionalFI,
        bond.BuySell,
        this.selectedBond.SettlementDate,
        this.selectedBond.BasicSpread || 0,
        bond.OrderType.includes('Market') ? 'Market' : 'Limit',
        this.authorApi.EntityID,
        bond.OrderType.includes('Limit') ? bond.LimitPrice : '',
        bond.ISIN
      ).then(c => {
        if (c.length !== 0) {
          // if (this.bondCalSubf === true) {
          //   console.log("bondCalSub EXIT.");
          //   this.bondCalSub.next();
          //   this.bondCalSub.complete();

          // } else {
            this.AccDays = c.DaysAccrued;
            this.AccInt = c.AccruedInterest;
            this.AccVal = this.FormatNumberFromValue(c.AccruedInterest);
            this.BankPNL = c.BankPnL;
            this.CurrentYield = c.CurrentYield;
            this.CleanPrice = c.MarketCleanPrice;
            this.DirtyPrice = c.CustDirtyPrice;
            this.YTM = c.YTM;
            this.YTC = c.YTC;
            this.YTP = c.YTP;
            this.YTConv = c.YTConv;
            this.SettAmt = c.CustCost;
            this.settval = this.FormatNumberFromValue(c.CustCost);
            this.Proceeds = c.CustCost;
            this.CustDirtyPrice = c.CustDirtyPrice;
            this.CustCleanPrice = c.CustCleanPrice;
            this.MarketCleanPrice = c.MarketCleanPrice;
            this.MarketDirtyPrice = c.MarketDirtyPrice;
            this.bondMsg = c.ResponseDetails.Description;
            this.ClientPrice = c.CustPrice;
            this.bondRemark = c.ResponseDetails.Remark;
            this.TargetInterbankPrice = c.LimitMarketPrice;
            if (this.bondRemark === 'failed' || this.bondRemark === null) {
              this.successMsg = this.bondMsg;
              this.loadflag = false;
            }

            // this.CalculateSettAmt();
            this.CalculateTotalProceeds(this.SettAmt);
            // let details = []
            // details.push(this.orderDetailsBonds);
            if (bond.dir === 'Buy' || bond.dir === 'BUY') {
              this.cashBalanceFI(bond);
            } else {
              this.sellBalance(bond);
            }

            // this.bondCalSubf = true;
            // this.bondCalSub.next();
            // this.bondCalSub.complete();
          // }

          // if (this.loadflag) {
          //   this.placeBondOrder(this.orderDetailsBonds);
          // }
        }
      })

      // this.bondCalculations =
      //   this.wfs.bondCalculationsObserver.subscribe((c: any) => {
      //     if (c.length !== 0) {
      //       // if (this.bondCalSubf === true) {
      //       //   console.log("bondCalSub EXIT.");
      //       //   this.bondCalSub.next();
      //       //   this.bondCalSub.complete();

      //       // } else {
      //         this.AccDays = c.DaysAccrued;
      //         this.AccInt = c.AccruedInterest;
      //         this.AccVal = this.FormatNumberFromValue(c.AccruedInterest);
      //         this.BankPNL = c.BankPnL;
      //         this.CurrentYield = c.CurrentYield;
      //         this.CleanPrice = c.MarketCleanPrice;
      //         this.DirtyPrice = c.CustDirtyPrice;
      //         this.YTM = c.YTM;
      //         this.YTC = c.YTC;
      //         this.YTP = c.YTP;
      //         this.YTConv = c.YTConv;
      //         this.SettAmt = c.CustCost;
      //         this.settval = this.FormatNumberFromValue(c.CustCost);
      //         this.Proceeds = c.CustCost;
      //         this.CustDirtyPrice = c.CustDirtyPrice;
      //         this.CustCleanPrice = c.CustCleanPrice;
      //         this.MarketCleanPrice = c.MarketCleanPrice;
      //         this.MarketDirtyPrice = c.MarketDirtyPrice;
      //         this.bondMsg = c.ResponseDetails.Description;
      //         this.ClientPrice = c.CustPrice;
      //         this.bondRemark = c.ResponseDetails.Remark;
      //         this.TargetInterbankPrice = c.LimitMarketPrice;
      //         if (this.bondRemark === 'failed' || this.bondRemark === null) {
      //           this.successMsg = this.bondMsg;
      //           this.loadflag = false;
      //         }

      //         // this.CalculateSettAmt();
      //         this.CalculateTotalProceeds(this.SettAmt);
      //         // let details = []
      //         // details.push(this.orderDetailsBonds);
      //         if (bond.BuySell === 'Buy' || bond.BuySell === 'BUY') {
      //           this.cashBalanceFI(bond);
      //         } else {
      //           this.sellBalance(bond);
      //         }

      //         // this.bondCalSubf = true;
      //         // this.bondCalSub.next();
      //         // this.bondCalSub.complete();
      //       // }

      //       // if (this.loadflag) {
      //       //   this.placeBondOrder(this.orderDetailsBonds);
      //       // }
      //     }
      //   });
    } catch (error) {

    }
  }

  unitCalculations(nominal, nav) {
    // console.log(nominal, nav);
    try {
      nav !== 0 ? (this.Units = nominal / nav) : (this.Units = 0);
      this.Units = this.Units.toFixed(2);
      this.notional = nominal.toFixed(2);
      // this.Units = this.cfs.FormatNumberr(this.Units);

      // if (this.FundVal === 'TL') {
      //   this.LoanAmt = this.cfs.FormatNumberr(this.nominal);
      //   this.getAvailableDrawdown();
      // } else if (this.FundVal === 'PL') {
      //   this.LoanAmt = 0;
      //   this.getAvailableDrawdown();
      // }
      // this.cashBalance(this.data.Ccy, nominal);
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  calculateNotional(units, nav) {
    nav !== 0 ? (this.notional = units * nav) : (this.notional = 0);
    this.notional = this.notional.toFixed(2);
    this.Units = units.toFixed(2);
    this.successMsg = '';
    // this.UnitsBalance();
    console.log("calculateNotional()",this.notional, this.Units);
  }

  async checkOrderSuitability(order) {
    try {
      // order.CRR = 'R3';
      const res = await this.wfs.checkSuitability(order);
      // console.log(res);
      order.isSuitabilityValid = res.HARDBLOCK_STATUS.toUpperCase() === 'YES';
      this.NMID_Suitability = res.NMID;
      this.token = res.SUITABILITY_TOKEN_COUNT;
      // this.note_Master_Id = this.NMID_Suitability;
      // order.isSuitabilityValid = true;
      return true;
    } catch (error) { }
  }

  SavefundsOrder(fund, transactionType, applicationType, modeofSettlement, switchUnits, realizedAmountUnits) {
    const today = new Date();
    let CustomerID = '';
    let notional = this.notional;
    let orderbasis = transactionType === 'Subscription' ? 'Amount' : 'Units';
    const OrderPlacementTime =
      (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
      '-' +
      (today.getMonth() + 1 < 10
        ? '0' + (today.getMonth() + 1)
        : today.getMonth() + 1) +
      '-' +
      today.getFullYear() +
      ' ' +
      (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) +
      ':' +
      (today.getMinutes() < 10
        ? '0' + today.getMinutes()
        : today.getMinutes()) +
      ':' +
      '00';
    let CIF = '';

    this.isUserRM ? (CIF = sessionStorage.getItem('RMCIF')) : (CIF = this.homeApi.CIF);
    CustomerID = fund.CustomerID;

    if (this.notional.includes(',')) {
      //Added by AlolikaG on 4th Feb 2022. Assigned by Parikshit K.
      notional = notional.replace(/,/g, '');
    }
    let ClientContribution: any = '';
    let bankContribution: any = '';

    //Funding Mode - FF
    bankContribution = '0.00';
    ClientContribution = notional;

    this.OrderParamsXML = '';
    this.OrderParamsXML = this.OrderParamsXML + '<dtData>';
    this.OrderParamsXML = this.OrderParamsXML + '<RecordType>D</RecordType>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<HEDGING_TYPE>Product</HEDGING_TYPE>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ApplicationReferenceNumber>PIB' +
        this.wfs.getNewApplicationIDForMF(CustomerID) +
        '</ApplicationReferenceNumber>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ApplicationType>' + applicationType + '</ApplicationType>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<SourceofOrigin>PIB</SourceofOrigin>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<SalespersonOfficerCodeTeam>AB82</SalespersonOfficerCodeTeam>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<UTSalespersonCode>1234</UTSalespersonCode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<DomicileBranchCode>AB33</DomicileBranchCode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<DomicileBankCode>30</DomicileBankCode>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<EffectingBranchCode>' + '' + '</EffectingBranchCode>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<EffectingBankCode>30</EffectingBankCode>';
    this.OrderParamsXML = this.OrderParamsXML + '<Bank>UOB</Bank>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<ReferrorEmployeeName>ABCD Name1</ReferrorEmployeeName>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<ReferrorEmployeeID>AB7887997</ReferrorEmployeeID>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ExternalReferrorName>' + fund.PortFolio + '</ExternalReferrorName>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<ExternalReferrorID>76879678</ExternalReferrorID>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<ExternalReferrorIDType>PP</ExternalReferrorIDType>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<ExternalReferrorIDCountry>SG</ExternalReferrorIDCountry>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<ReferrorFlag>Y</ReferrorFlag>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<SubmittedDateTime>03-07-2015 05:14:06</SubmittedDateTime>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<RcRpIndicator>E</RcRpIndicator>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<SalespersonEmployeeID>' + fund.RMName + '</SalespersonEmployeeID>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<SalespersonName1LastName>NAME 1345</SalespersonName1LastName>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<SalespersonName2MidName>NAME 2322425</SalespersonName2MidName>';
    this.OrderParamsXML =
      this.OrderParamsXML + ('<CIFNumber>' + CIF + '</CIFNumber>');
    this.OrderParamsXML = this.OrderParamsXML + '<Salutation>MR</Salutation>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ApplicantName1>' + fund.CustomerName + '</ApplicantName1>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<ApplicantName2>NAME 31</ApplicantName2>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<IDInformation>ID12</IDInformation>';
    this.OrderParamsXML = this.OrderParamsXML + '<IDTypeCode>PP</IDTypeCode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<IDCountryCode>SG</IDCountryCode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<PhoneWork>6532123232</PhoneWork>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<PhoneHome>6532123232</PhoneHome>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<PhoneMobile>9865321245</PhoneMobile>';
    this.OrderParamsXML = this.OrderParamsXML + '<Email>test@email.com</Email>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<DateOfBirth>03-07-2015</DateOfBirth>';
    this.OrderParamsXML = this.OrderParamsXML + '<Age>27</Age>';
    this.OrderParamsXML = this.OrderParamsXML + '<Gender>male</Gender>';
    this.OrderParamsXML = this.OrderParamsXML + '<Race>abc</Race>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<MaritalStatus>M</MaritalStatus>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CountryofCitizenshipCode>SG</CountryofCitizenshipCode>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CountryofResidenshipCode>SG</CountryofResidenshipCode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<PermanentResidentFlg>SG</PermanentResidentFlg>';
    this.OrderParamsXML = this.OrderParamsXML + '<CDPNo>1234</CDPNo>';
    this.OrderParamsXML = this.OrderParamsXML + '<CPFNo>3216</CPFNo>';
    this.OrderParamsXML = this.OrderParamsXML + '<TaxStatus>P</TaxStatus>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<OtherIdentification>ID13</OtherIdentification>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<EmployerName>NAME E3</EmployerName>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<TypeofBusiness>B1</TypeofBusiness>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<JobDesignation>SSC</JobDesignation>';
    this.OrderParamsXML = this.OrderParamsXML + '<Position>ABC</Position>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<EmployeeFlag>Y</EmployeeFlag>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<ApplicantType>ABC</ApplicantType>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<CareOfName>NAME78789</CareOfName>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<AddressSeqNum>1313131</AddressSeqNum>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<AddressType>ABCD</AddressType>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<AddressFormat>ABCD1</AddressFormat>';
    this.OrderParamsXML = this.OrderParamsXML + '<Block>4</Block>';
    this.OrderParamsXML = this.OrderParamsXML + '<Street>6</Street>';
    this.OrderParamsXML = this.OrderParamsXML + '<Storey>8</Storey>';
    this.OrderParamsXML = this.OrderParamsXML + '<Unit>10</Unit>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<BuildingName>B3</BuildingName>';
    this.OrderParamsXML = this.OrderParamsXML + '<POBox>3648</POBox>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<PostalCode>36486</PostalCode>';
    this.OrderParamsXML = this.OrderParamsXML + '<City>SG</City>';
    this.OrderParamsXML = this.OrderParamsXML + '<Country>SG</Country>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<AddressLine1>LINE1</AddressLine1>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<AddressLine2>LINE2</AddressLine2>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<AddressLine3>LINE3</AddressLine3>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<AddressLine4>LINE4</AddressLine4>';
    this.OrderParamsXML = this.OrderParamsXML + '<Segment>PB</Segment>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<CustomerRiskScoreRc>3</CustomerRiskScoreRc>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<RiskReviewDate>12-05-2018</RiskReviewDate>';
    this.OrderParamsXML = this.OrderParamsXML + '<RiskSource>ABCD</RiskSource>';
    this.OrderParamsXML = this.OrderParamsXML + '<RcId>ABCD</RcId>';
    this.OrderParamsXML = this.OrderParamsXML + '<RcIdType>XY</RcIdType>';
    this.OrderParamsXML = this.OrderParamsXML + '<RcIdCountry>SG</RcIdCountry>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<IDExpiryDate>30-07-2019</IDExpiryDate>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<CountryofBirthCode>SG</CountryofBirthCode>';
    this.OrderParamsXML = this.OrderParamsXML + '<TIN1>4646</TIN1>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<Country1Code>SG</Country1Code>';
    this.OrderParamsXML = this.OrderParamsXML + '<TIN2>46466</TIN2>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<Country2Code>SG</Country2Code>';
    this.OrderParamsXML = this.OrderParamsXML + '<Reason1>4647</Reason1>';
    this.OrderParamsXML = this.OrderParamsXML + '<Reason2>4646</Reason2>';
    this.OrderParamsXML = this.OrderParamsXML + '<TIN3>4646</TIN3>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<Country3Code>SG</Country3Code>';
    this.OrderParamsXML = this.OrderParamsXML + '<Reason3>77546</Reason3>';
    this.OrderParamsXML = this.OrderParamsXML + '<TIN4>4646</TIN4>';
    this.OrderParamsXML = this.OrderParamsXML + '<Country4>SG</Country4>';
    this.OrderParamsXML = this.OrderParamsXML + '<Reason4>5353</Reason4>';
    this.OrderParamsXML =
      this.OrderParamsXML + ('<FundCode>' + fund.FundCode + '</FundCode>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<ProductRiskScoreRp>01</ProductRiskScoreRp>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<CurrencyDenominated>' + fund.Currency + '</CurrencyDenominated>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<TradeDate>' +
        +(today.getMonth() + 1 < 10
          ? '0' + (today.getMonth() + 1)
          : today.getMonth() + 1) +
        '-' +
        (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()) +
        '-' +
        today.getFullYear() +
        '</TradeDate>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<TransactionType>' + applicationType + '</TransactionType>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<FINorWPNo>13411111</FINorWPNo>';
    this.OrderParamsXML = this.OrderParamsXML + '<Discount>12</Discount>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<ExistingSubscriberofFund>01</ExistingSubscriberofFund>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<AccountNumber>' + fund.Account_Number + '</AccountNumber>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<SigningCondition>C1</SigningCondition>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<ModeofPayment>SA</ModeofPayment>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<PurchaseAmount>' + notional + '</PurchaseAmount>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<DividendInstruction>AB</DividendInstruction>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<RegularSavingsMode>CA</RegularSavingsMode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<NumberofMthsorQtrs>1</NumberofMthsorQtrs>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<RegularInvestment>10</RegularInvestment>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<DepositAmount>10000</DepositAmount>';
    this.OrderParamsXML =
      this.OrderParamsXML + ('<SwitchFrom>' + '' + '</SwitchFrom>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<SwitchTo>' + '' + '</SwitchTo>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<SwitchUnits>' + switchUnits + '</SwitchUnits>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ModeofSettlement>' + modeofSettlement + '</ModeofSettlement>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<RealizedAmountUnits>' +
        realizedAmountUnits +
        '</RealizedAmountUnits>');
    this.OrderParamsXML =
      this.OrderParamsXML + '<AccountPaymentType>Cash</AccountPaymentType>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<UOBCreditCardNumber>54654789</UOBCreditCardNumber>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<UOBCreditCardExpiry>30-08-2026</UOBCreditCardExpiry>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<ApprovalCode>ghjhg</ApprovalCode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<ChequeNumber>100000111</ChequeNumber>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<UOBDebitingACNo>1110001</UOBDebitingACNo>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<TelegraphicTransfertoFundManagerACNo>546545</TelegraphicTransfertoFundManagerACNo>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<CPFApprovedBank>uob</CPFApprovedBank>';
    this.OrderParamsXML = this.OrderParamsXML + '<CPFACNo>10000003</CPFACNo>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<CPFInvestmentACNo>30000001</CPFInvestmentACNo>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CompletedStandingInstructionFormPreviously>33</CompletedStandingInstructionFormPreviously>';
    this.OrderParamsXML = this.OrderParamsXML + '<SRSOperator>BA</SRSOperator>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<SRSACNo>30101111131</SRSACNo>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<CreditingACNo>80000002</CreditingACNo>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CreditingACNoForDividend>80003002</CreditingACNoForDividend>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CreditingACName1ForDividend>NAME1</CreditingACName1ForDividend>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CreditingACName2ForDividend>NAME2</CreditingACName2ForDividend>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CreditingACCurrencyForDividend>SGD</CreditingACCurrencyForDividend>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<CampaignCode>13</CampaignCode>';
    this.OrderParamsXML =
      this.OrderParamsXML + '<SystemCampaignCode>cd</SystemCampaignCode>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<EarlyMaturityProceedsInstruction>Instruction 1</EarlyMaturityProceedsInstruction>';
    this.OrderParamsXML =
      this.OrderParamsXML +
      '<CreditingACNoMaturity>21345</CreditingACNoMaturity>';
    this.OrderParamsXML =
      this.OrderParamsXML + ('<AccountType>' + 'CA' + '</AccountType>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<tofundccy>' + '' + '</tofundccy>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<ToFundNav>' + '' + '</ToFundNav>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<SalesCharge>' + '0.00' + '</SalesCharge>');
    this.OrderParamsXML = this.OrderParamsXML + ('<LTVNo>' + '' + '</LTVNo>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<LTVOverride>' + 'N' + '</LTVOverride>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<Load_Fee>' + '0.00' + '</Load_Fee>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<ExitLoadFee>' + '0.00' + '</ExitLoadFee>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<EntryLoadFee>' + '0.00' + '</EntryLoadFee>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<SameFundHouseFlag>' + '' + '</SameFundHouseFlag>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<FundMode>' + fund.FundMode + '</FundMode>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<OrderConfirmationRemark>' + '' + '</OrderConfirmationRemark>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<Time>' + OrderPlacementTime + '</Time>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<PlaceEmailExtensionNo>' + '' + '</PlaceEmailExtensionNo>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<OrderPlacementMode>' + 'In-Person' + '</OrderPlacementMode>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<FreezeAmount>' + ClientContribution + '</FreezeAmount>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<OrderBasis>' + orderbasis + '</OrderBasis>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<LTV>' + fund.LTV + '</LTV>');
    this.OrderParamsXML = this.OrderParamsXML + ('<VAT>' + '0.00' + '</VAT>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<VATAmount>' + '0.00' + '</VATAmount>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<ChargesApplicability>' + 'Inclusive' + '</ChargesApplicability>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<PreapprovedFeeWaiver>' + true + '</PreapprovedFeeWaiver>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<PresignedDisclaimer>' + true + '</PresignedDisclaimer>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<SuitabilityRef>' + '' + '</SuitabilityRef>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<AvailableForDrawdown>' +
        '0' +
        '</AvailableForDrawdown>');
    this.OrderParamsXML =
      this.OrderParamsXML + ('<SwitchingId>' + '' + '</SwitchingId>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Client_Contribution>' + ClientContribution + '</Client_Contribution>');
    this.OrderParamsXML =
      this.OrderParamsXML +
      ('<Bank_Contribution>' + bankContribution + '</Bank_Contribution>');

    //  Added by Alolika G on 2nd Feb 2022. Params shared by Prachi P. --START
    // if (this.FundVal === 'TL' || this.FundVal === 'PL') {
    //   this.OrderParamsXML =
    //     this.OrderParamsXML +
    //     ('<LoanCurrency>' + this.data.Ccy + '</LoanCurrency>');
    //   this.OrderParamsXML =
    //     this.OrderParamsXML + ('<LoanTenor>' + this.LoanTenor + '</LoanTenor>');
    //   this.OrderParamsXML =
    //     this.OrderParamsXML +
    //     ('<LoanRequestSpecialRateYN>' + 'N' + '</LoanRequestSpecialRateYN>');
    //   this.OrderParamsXML =
    //     this.OrderParamsXML +
    //     ('<LoanIntRateBenchmark>' + 'LIBOR' + '</LoanIntRateBenchmark>');
    //   this.OrderParamsXML =
    //     this.OrderParamsXML +
    //     ('<LoanInterestRate>' + '1.75' + '</LoanInterestRate>');
    //   this.OrderParamsXML =
    //     this.OrderParamsXML + ('<LoanRolloverYN>' + 'N' + '</LoanRolloverYN>');
    //   this.OrderParamsXML =
    //     this.OrderParamsXML + ('<LoanFeeYN>' + 'N' + '</LoanFeeYN>');
    //   this.OrderParamsXML =
    //     this.OrderParamsXML + ('<LoanFeeMethod>' + 'PCT' + '</LoanFeeMethod>');
    //   this.OrderParamsXML =
    //     this.OrderParamsXML + ('<LoanFeePerc>' + '0' + '</LoanFeePerc>');
    //   this.OrderParamsXML =
    //     this.OrderParamsXML + ('<LoanFeeAmount>' + '0' + '</LoanFeeAmount>');
    //   this.OrderParamsXML =
    //     this.OrderParamsXML + ('<LoanFeeVAT>' + '0' + '</LoanFeeVAT>');
    //   this.OrderParamsXML =
    //     this.OrderParamsXML + ('<FXRateInd >' + '1' + '</FXRateInd >');
    //   this.OrderParamsXML =
    //     this.OrderParamsXML + ('<FXRateInd >' + '1' + '</FXRateInd >');
    //   this.OrderParamsXML =
    //     this.OrderParamsXML +
    //     ('<LoanAmountActual >' + bankContribution + '</LoanAmountActual >'); //Added by Alolika G on 3rd Feb 2022. Assigned by by Prachi P
    // }


    this.OrderParamsXML = this.OrderParamsXML + '</dtData>';
    this.afs.saveNewOrder_bulk(
      this.OrderParamsXML,
      this.username,
      'funds_trade_setup',
      'MutualFundSave',
      0
    ).then( res => {
      if (res) {
        if (res.SaveUCPResult) {
          const d1 = new Date();
          if (d1.getHours() >= 12) {
            if (d1.getHours() === 12) {
              this.hours1 = d1.getHours();
            } else {
              this.hours1 = d1.getHours() % 12;
            }
            this.ampm = 'PM';
          } else {
            this.hours1 = d1.getHours();
            this.ampm = 'AM';
          }
          if (d1.getMinutes() < 10) {
            this.min1 = '0' + d1.getMinutes();
          } else {
            this.min1 = d1.getMinutes();
          }
          if (res.SaveUCPResult[0].SavingMessage !== null) {
            if (
              res.SaveUCPResult[0].RowNumber === 1 &&
              res.SaveUCPResult[0].NoteMasterID !== 0
            ) {
              this.loadflag = false;

              if (this.subscribeFlag === true) {
                this.successMsg =
                  'Order placed successfully for ' + fund.FundCode + '. Order Ref No.:' +
                  res.SaveUCPResult[0].NoteMasterID;
                this.orderflag = true;

                //Added by Alolika G on 7th Feb 2022
                let orderDetail = {
                  custID: fund.CustomerID,
                  currency: fund.Currency,
                  custName: fund.CustomerName,
                  NoteMasterId: this.NMID_Suitability,
                  portfolio: fund.Portfolio,
                  orderID: res.SaveUCPResult[0].NoteMasterID,
                  settlementAmount: fund.Notional,
                  failrules: this.token
                };
                if (this.checkSuitability && this.token !== '') {
                  this.wfs.getSuitabilityToken(orderDetail).then((token) => {
                    console.log(token, 'token', orderDetail, 'orderDetail');
                  });
                }
              }
              this.orderTime =
                d1.getDate() +
                '-' +
                this.monthNames[d1.getMonth()] +
                '-' +
                d1.getFullYear() +
                ' ' +
                this.hours1 +
                ':' +
                this.min1 +
                ' ' +
                this.ampm;
            } else {
              this.successMsg = 'Order placement failed.';
              this.loadflag = false;
            }
          } else {
            this.successMsg = 'Order placement failed.';
            this.loadflag = false;
          }
        } else {
          // this.successMsg = 'Order placement failed.';
          this.loadflag = false;
        }
        this.saveOrderMessageMF(fund);
      }
    })
    // {
    //   this.OrderSubscribed(fund)
    // }
  }

  saveOrderMessageMF(fund) {
    try {
      this.MFTransactionDetails.forEach(element => {
        if(fund.FundCode === element.FundCode) {
          element.Remark = this.successMsg;
        }
      });
    } catch (error) {
      
    }

  }

  OrderSubscribed(fund) {
    this.SaveCustomerDetailsSubscriber = this.afs.SaveOrder.subscribe((res) => {
      if (res) {
        if (res.SaveUCPResult) {
          const d1 = new Date();
          if (d1.getHours() >= 12) {
            if (d1.getHours() === 12) {
              this.hours1 = d1.getHours();
            } else {
              this.hours1 = d1.getHours() % 12;
            }
            this.ampm = 'PM';
          } else {
            this.hours1 = d1.getHours();
            this.ampm = 'AM';
          }
          if (d1.getMinutes() < 10) {
            this.min1 = '0' + d1.getMinutes();
          } else {
            this.min1 = d1.getMinutes();
          }
          if (res.SaveUCPResult[0].SavingMessage !== null) {
            if (
              res.SaveUCPResult[0].RowNumber === 1 &&
              res.SaveUCPResult[0].NoteMasterID !== 0
            ) {
              this.loadflag = false;

              if (this.subscribeFlag === true) {
                this.successMsg =
                  'Mutual Fund Order placed successfully for' + fund.FundCode +'. Order Ref No.:' +
                  res.SaveUCPResult[0].NoteMasterID;
                this.orderflag = true;

                //Added by Alolika G on 7th Feb 2022
                let orderDetail = {
                  custID: fund.CustomerID,
                  currency: fund.Currency,
                  custName: fund.CustomerName,
                  NoteMasterId: this.NMID_Suitability,
                  portfolio: fund.Portfolio,
                  orderID: res.SaveUCPResult[0].NoteMasterID,
                  settlementAmount: fund.Notional,
                  failrules: this.token
                };
                if (this.checkSuitability && this.token !== '') {
                  this.wfs.getSuitabilityToken(orderDetail).then((token) => {
                    console.log(token, 'token', orderDetail, 'orderDetail');
                  });
                }
              }
              this.orderTime =
                d1.getDate() +
                '-' +
                this.monthNames[d1.getMonth()] +
                '-' +
                d1.getFullYear() +
                ' ' +
                this.hours1 +
                ':' +
                this.min1 +
                ' ' +
                this.ampm;
            } else {
              this.successMsg = 'Order placement failed.';
              this.loadflag = false;
            }
          } else {
            this.successMsg = 'Order placement failed.';
            this.loadflag = false;
          }
        } else {
          // this.successMsg = 'Order placement failed.';
          this.loadflag = false;
        }
      }
    });
  }

  FormatNumberFromValue(value) {
    try {
      if (value) {
        value = parseFloat(value).toFixed(2);

        return (value + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '';
      } else {
        return '';
      }
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  CalculateTotalProceeds(settAmt) {
    try {
      this.Proceeds = settAmt;
      // console.log('settAmt:', settAmt);

    } catch (error) {
      // console.log('Error:', error);
    }
  }

  placeBondOrder(bond) {
    try {
      this.successMsg = '';
      // console.log(" bond", bond);
      // console.log("bond", this.orderDetailsBonds);
      let RMName = ''
      this.isUserRM ? RMName = this.RMName : RMName = this.homeApi.RMName;
      if (bond.NAACCNoSecondary === '') {
        this.successMsg = 'Please select account number.';
        this.loadflag = false;
      } else if (!bond.dir) {
        this.successMsg = 'Please select Customer B/S.';
        this.loadflag = false;
      } else if (!this.notionalFI) {
        this.successMsg = 'Please enter Notional amount.';
        this.loadflag = false;
      } else if (this.notionalFI <= 0.0) {
        this.successMsg = 'Notional amount should be greater than 0.';
        this.loadflag = false;
      } else if (!this.selectedBond.BasicSpread) {
        this.successMsg = 'Please enter Spread.';
        this.loadflag = false;
      } else if ([null, undefined].includes(RMName)) {
        this.successMsg = `No RM mapped for ${bond.CustomerName}.`;
        this.loadflag = false;
      } else if (bond.BuySell === 'BUY' && !this.balanceFlagFI) {
        this.successMsg =
          'Insufficient cash balance in this account' +
          '(Account Number: ' +
          bond.NAACCNoSecondary +
          ')';
        this.loadflag = false;
      } else if (bond.dir === 'SELL' && !this.noBalFlag) {
        this.successMsg =
          'Notional amount should be less than balance notional. Balance is:  0.00';
        this.loadflag = false;
      } else if (bond.dir === 'SELL' && this.notionalFI > this.RemainingCashBalanceFI) {
        this.successMsg =
          'Notional amount should be less than balance notional. Balance is: ' +
          this.cfs.FormatNumberr(parseFloat(this.RemainingCashBalanceFI));
        this.loadflag = false;
      } else if (this.ClientPrice > 0 && this.successMsg === '') {
        this.wfs.getbondsubscribe_bulk(
          bond.ISIN,
          bond.Currency,
          bond.dir,
          this.notionalFI,
          this.selectedBond.SettlementDate,
          '' + this.selectedBond.BasicSpread,
          this.AccInt,
          this.SettAmt,
          bond.TradeDate,
          this.selectedBond.SettlementType.split('+')[1],
          bond.TradeDate,
          this.selectedBond.PriceType,
          this.ClientPrice,
          this.DirtyPrice,
          this.CleanPrice,
          this.YTM,
          this.Proceeds,
          this.BankPNL,
          bond.Portfolio,
          bond.OrderType.includes('Market') ? '' : this.TimeInForce,
          bond.OrderType.includes('Market') ? 'Market' : 'Limit',
          this.selectedBond.NoteMasterID,
          this.CustDirtyPrice,
          this.CustCleanPrice,
          this.MarketCleanPrice,
          this.MarketDirtyPrice,
          this.YTC,
          this.YTP,
          this.YTConv,
          this.username,
          bond.CustomerName,
          bond.NAACCNoSecondary,
          this.authorApi.EntityID,
          this.selectedBond.PercentParQuoted === 'N' ? 1 : 0,
          this.isUserRM ? this.RMName : this.homeApi.RMName
        ).then((OID: any) => {
          console.log("Inside Bond Subscription.", OID);
          this.successMsg = '';

          if (OID.length !== 0) {
            if (OID.ClOrdID === '') {
              this.successMsg = '';
              this.successMsg =
                'Order Execution : ' +
                OID.OrdStatus +
                ' ' +
                OID.OrdResponseDetails.Description;
            } else {
              this.OrderID = OID.ClOrdID;
              this.successMsg =
                'Bond Order placed succesfully for ' + bond.ISIN + ' with Ref Id.' + this.OrderID;
            }
            this.loadflag = false;
          }
          this.saveOrderMessageFI(bond);

        })

        // this.bondsubscribe = this.wfs.bondsubscribeObserver.subscribe(
        //   (OID: any) => {
        //     console.log("Inside Bond Subscription.", OID);
        //     this.successMsg = '';
  
        //     if (OID.length !== 0) {
        //       if (OID.ClOrdID === '') {
        //         this.successMsg = '';
        //         this.successMsg =
        //           'Order Execution : ' +
        //           OID.OrdStatus +
        //           ' ' +
        //           OID.OrdResponseDetails.Description;
        //       } else {
        //         this.OrderID = OID.ClOrdID;
        //         this.successMsg =
        //           'Bond Order placed succesfully for ' + bond.ISIN + ' with Ref Id.' + this.OrderID;
        //       }
        //       this.loadflag = false;
        //     }
        //   },
        //   (error) => console.log('Error :: ' + error)
        // );

      } else {
        this.successMsg = 'Please calculate the client price.';
        this.loadflag = false;
      }
    } catch (error) {

    }


  }

  saveOrderMessageFI(bond) {
    try {
      this.BondsTransactionDetails.forEach(element => {
        if(bond.ISIN === element.ISIN && bond.index === element.index) {
          element.Remark = this.successMsg;
        }
      });
    } catch (error) {
      
    }
  }
  selectShare(NotemasterId, share) {
    this.wfs.GetIndividualShareDetails(NotemasterId);
    this.shareDetailsBS =
      this.wfs.shareDetailsObserver.subscribe(
        (res: any) => {
          if (res.length !== 0) {

            if (res.ProductDetails["NoteMasterID"] === NotemasterId) {

              this.details = res.ProductDetails;
              // console.log("this.details TRY", this.details);

              this.SettlementType = this.details.SettlementType.split('+')[1].trim();
              this.OrderQty = Number(this.cfs.UnformatNumberwithcomma(share.Quantity));
              if (share.OrderType === 'Limit') {
                this.SettAmt =
                  parseFloat(this.OrderQty) * share.LimitPrice;

              } else {
                if (share.OrderType === 'Market') {
                  if (share.BuySell.toLowerCase() === 'buy') {
                    this.SettAmt =
                      this.details.AskPx *
                      parseFloat(this.OrderQty);
                  } else {
                    this.SettAmt =
                      this.details.BidPx *
                      parseFloat(this.OrderQty);
                  }
                }
              }

              this.subscribeShare(share);
            }


          } else {
            console.log("getShareDetails Failed!!");
          }
        }
      );
    // console.log(this.shareDetailsBS);
  }

  subscribeShare(share) {
    let RMName = ''
    let bankContribution = '0.00';
    this.isUserRM ? RMName = this.RMName : RMName = this.homeApi.RMName
    // console.log("SHARE DETAILS", share);
    if (share.Underlying === '') {
      this.successMsg = 'Please select valid share';
      this.loadflag = false;
    } else if (this.OrderQty <= 0) {
      this.loadflag = false;
      this.successMsg = 'Please enter valid order quantity';
      this.loadflag = false;
    } else {
      this.wfs.SubscribeEquities(
        share.Underlying,
        share.dir,
        share.Currency,
        share.TradeDate,
        // this.businessDate,
        this.SettlementType,
        this.details.SettlementDate,
        share.OrderType,
        share.OrderType === 'Limit'
          ? share.LimitPrice
          : share.BuySell.toLowerCase() === 'buy'
            ? this.details.AskPx
            : this.details.BidPx,
        this.TimeInForce,
        share.TradeDate,
        this.OrderQty,
        share.Exchange,
        share.Portfolio, // Added by Anjali T asked by Mohan P 07-Feb-2022 -->
        //this.portfolio,
        share.CustomerName,
        RMName,
        share.NAACCNoSecondary || '',
        share.CustomerID,
        this.SettAmt.toFixed(2),
        // Changes done by Alolika G on 28-02-2022
        bankContribution,
        'Fully Funded',
        ''

      );

      this.wfs.eqsubscribeObserver.subscribe((res: any) => {
        // console.log("Moment Of Truth");
        if (res.length === 0) {
          console.log("Try Order Placement Again.")
        } else {
          if (res.FinIQResponseHeader.Status === 'Failed') {
            this.loadflag = false;
            this.successMsg =
              res.Order_Save_Res_DTO.objResponseDetails.OrdResponseDetails.Description;
          } else {
            this.loadflag = false;
            this.OrderID = res.Order_Save_Res_DTO.objResponseDetails.ClOrdID;
            this.successMsg =
              'Order placed successfully with Ref No. ' + this.OrderID;
          }
        }
      });
    }
  }

  cashBalanceMF(fund) {
    /** To check cash balance from account balance using service: this.afs.getmultiPortfolio(this.username); */
    try {
      this.remainingBalanceMF = '';
      // console.log(fund.Currency);
      this.wfs
        .getCashbalanceFromAccountNumber(fund.Currency, fund.Account_Number).subscribe((res) => {
          if (res) {
            // console.log(res);
            this.remainingBalanceMF = res.ExecGenericScalarFunctionResult;
            this.remainingBalanceMF = this.cfs.FormatNumberr(this.remainingBalanceMF);
            // console.log(this.remainingBalanceMF);
            // console.log(this.nominal);
            // console.log(this.cfs.UnformatNumberwithcomma(this.remainingBalanceMF));

            // this.cfs.setPortfoliobalance(this.remainingBalanceMF);
            // this.cfs.selectedPortfolioBalObserver.subscribe((res) => {
            //   console.log(res);
            //   if (res.length !== 0) {
            //     this.remainingUnitsMF = res;
            //     console.log(this.remainingUnitsMF);
            //   } else {
            //     console.log("Balance not fetched.");
            //   }
            // });


            if (parseFloat(fund.Notional) <= this.cfs.UnformatNumberwithcomma(this.remainingBalanceMF)) {         //parseFloat(this.fnGetCashBalance())
              this.balanceFlag = true;
              // console.log(this.balanceFlag);
              this.MForderSubscribe(fund);

            } else {
              this.balanceFlag = false;
              console.log("MF balance Flag set False");
            }
            // this.MForderSubscribe(fund);

          }
        });
    } catch (ex) {
      console.log('Error occured while loading Cash balance card :', ex);
    }
  }

  MForderSubscribe(element) {
    this.successMsg = '';
    if (element.NAV === 0) {
      this.successMsg = 'NAV is 0. Please select other fund.';
      this.loadflag = false;
    } else if (!element.Notional) {
      this.successMsg = 'Please enter the notional.';
      this.loadflag = false;
    } else if (element.Notional >= 1000000000) {
      this.successMsg = 'Notional should be less than 1,000,000,000.';
      this.loadflag = false;
    } else if (
      element.Account_Number === '' ||
      element.Account_Number === undefined
    ) {
      this.successMsg = 'No account with required fund currency.';
      this.loadflag = false;
    } else if (this.successMsg === '') {
      if (element.FundCode) {
        this.subscribeFlag = true;
        if (element.ApplicationType === 'Subscription') {
          this.unitCalculations(element.Notional, element.NAV);
          if (element.Notional < element.MinInvestment) {
            this.successMsg =
              'Notional should be greater than minimum investment.';
            this.loadflag = false;
          } else if (!this.balanceFlag) {
            // console.log("!balanceFlag");
            this.successMsg =
              'Insufficient cash balance in this account' +
              '(Account Number: ' +
              element.Account_Number +
              ')';
            this.loadflag = false;
          } else {
            // if (this.checkSuitability) {
            //   const isSuitabilityValid: boolean =
            //     await this.checkOrderSuitability(this.orderDetails);
            //   console.log(isSuitabilityValid);
            //   this.SavefundsOrder(element, 'Subscription', 'SB', '', '00000', Number(element.Notional) / Number(element.NAV))

            // } else {
              this.SavefundsOrder(element, 'Subscription', 'SB', '', '00000', Number(element.Notional) / Number(element.NAV))

            // }
          }
        } else if (element.ApplicationType === 'Redemption') {
          this.calculateNotional(element.Units, element.NAV);

          if (this.Units > this.remainingUnitsMF) {
            this.successMsg =
              'Sell units should be less than balance units. Balance units: ' +
              this.cfs.FormatNumberr(parseFloat(this.remainingUnitsMF));
            // console.log("Remaining Units Check.");
            this.loadflag = false;
          } else if (!this.noBalFlagMF) {
            this.successMsg =
              'Sell units should be less than balance units. Balance units: 0.00';
            this.loadflag = false;
          } else {
            // if (this.checkSuitability) {
            //   const isSuitabilityValid: boolean =
            //     await this.checkOrderSuitability(this.orderDetails);
            //   console.log(isSuitabilityValid);
            //   this.SavefundsOrder(
            //     element,
            //     'Redemption',
            //     'RD',
            //     'SRS',
            //     this.Units,
            //     this.Units
            //   );

            // } else {
              this.SavefundsOrder(
                element,
                'Redemption',
                'RD',
                'SRS',
                this.Units,
                this.Units
              );
            // }
          }
        }
      } else {
        this.successMsg = 'Fund Code is unavailable.';
        this.loadflag = false;
      }
    }
  }

  cashBalanceFI(bond) {
    /** To check cash balance from account balance using service: this.afs.getmultiPortfolio(this.username); */
    try {
      // console.log("IN CASHBAL");
      this.RemainingCashBalanceFI = '';

      this.wfs
        .getCashbalanceFromAccountNumber(
          bond.Currency,
          bond.NAACCNoSecondary
        )
        .subscribe((res) => {
          if (res) {
            console.log(res.ExecGenericScalarFunctionResult);
            if (
              this.notionalFI <=
              parseFloat(res.ExecGenericScalarFunctionResult)
            ) {
              this.balanceFlagFI = true;
              this.RemainingCashBalanceFI = res.ExecGenericScalarFunctionResult;
              // console.log("this.balanceFlagFI", this.balanceFlagFI, "CASH BAL: ", this.RemainingCashBalanceFI);
              this.placeBondOrder(bond);
            } else {
              this.balanceFlagFI = false;
              this.RemainingCashBalanceFI = res.ExecGenericScalarFunctionResult;
              // console.log("this.balanceFlagFI", this.balanceFlagFI, "CASH BAL: ", this.RemainingCashBalanceFI);
            }
            // this.placeBondOrder(bond);

          } else {
            console.log("cashBalance Failed.")
          }
        });
    } catch (ex) {
      console.log('Error occured while loading Cash balance card :', ex);
    }
  }

  sellBalance(bond) {
    this.wfs.getCustPortfolioSecurityHoldings_bulk(
      bond.CustomerID,
      bond.Portfolio,
      this.baseCcy
    ).then(res => {
      if (res.length !== 0) {
        this.portfolioDetails = res;
        this.remainingUnitsFI = 0;
        //console.log(this.portfolioDetails);
        this.portfolioDetails.forEach((elem) => {
          if (elem.ISIN[0] === bond.ISIN) {
            this.remainingUnitsFI = elem.CEHD_Available_Qty[0];
            // this.securityData = elem;
            // console.log(this.securityData);
            // console.log(this.remainingUnits);
            this.noBalFlag = true;
          }
        });
        if(this.noBalFlag) {
          this.placeBondOrder(bond);

        } else {
          this.loadflag = false;
          this.noBalFlag = false;
        }

      } else {
        this.loadflag = false;
        this.noBalFlag = false;
      }
    })

    // this.portSecHolSubcription = this.wfs.portfolioSecHoldingObserver.subscribe((res) => {
    //   if (res.length !== 0) {
    //     this.portfolioDetails = res;
    //     this.remainingUnitsFI = 0;
    //     //console.log(this.portfolioDetails);
    //     this.portfolioDetails.forEach((elem) => {
    //       if (elem.ISIN[0] === bond.ISIN) {
    //         this.remainingUnitsFI = elem.CEHD_Available_Qty[0];
    //         // this.securityData = elem;
    //         // console.log(this.securityData);
    //         // console.log(this.remainingUnits);
    //         this.noBalFlag = true;
    //       }
    //     });
    //     if(this.noBalFlag) {
    //       this.placeBondOrder(bond);

    //     } else {
    //       this.loadflag = false;
    //       this.noBalFlag = false;
    //     }

    //   } else {
    //     this.loadflag = false;
    //     this.noBalFlag = false;
    //   }
    // });

  }

}
