import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/services/excel.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { AuthService } from 'src/app/services/auth/auth.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { Subscription } from 'rxjs';
import { DownloadService } from 'src/app/services/download.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { AppConfig } from 'src/app/services/config.service';

@Component({
  selector: 'app-proposal-generation',
  templateUrl: './proposal-generation.component.html',
  styleUrls: ['./proposal-generation.component.scss'],
})
export class ProposalGenerationComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput')
  private searchInput: ElementRef;
  @ViewChildren('listTrigger')
  private listTrigger: QueryList<ElementRef>;
  tableRows: number[] = [1, 2, 3];
  RowCount: number = 3;
  //TemplateSelect: string[][] = [["Cash Balance"], ["Shares"], ["Mutual Funds"], ["Bonds Investment", "Clawback Schedule", "DCI", "Fixed Deposit", "Insurance Investment", "Maxi-Yield", "Structured Deposit", "Structured Notes", "Time Deposit"]];
  //selectedSchemes: string[] = ["Cash", "Equities", "MF", "Fixed Income"];
  selectedSchemes: any;
  TemplateSelect: any;

  selectedValue: string[] = ['--New--'];
  ProposalDropdown = ['--New--', '--Private Proposal--'];
  Securities: string[];
  NominalArr: any;

  interfaceUrl = environment.interfaceURL;

  TargetNotional: any = 0.0;

  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  Format = 'PDF';

  username: any;
  Customerid: any;
  CIF: any;
  portfolio: any = '';
  customerName: any;
  baseCCY: any;
  allocationArray = [];
  Currency: any;
  AUM: number;
  crr: any = '';
  portfolioFacilityCode: string = '';
  RiskProfile: any;
  investmentObj: string;
  index: any;
  mydate = new Date();
  ProposalName: any;
  nameproposal: any;
  ProposalId: any;
  Template: any;
  SubTemplate = null;
  Nominal: any;
  Category = null;
  SecurityCode = null;
  SecurityAllocation = null;
  CategoryAllocation = null;
  SubTemplateAllocation = null;
  TemplateAllocation = null;
  SchemeAllocation = null;
  Security: string = 'null';
  btntext: string = 'Save Proposal';
  UserId: any;
  EntityId: any;
  noDataFlag: boolean;
  selectedDetails: any;
  SchemeCode: string = '';
  TemplateCode: string = '';
  TemplateId: string = '';
  TemplateName: string = '';
  EmailID: any;
  Code: any;
  ContactNo: any;
  schemeobj: any;
  tempdetails: any;

  Rowobj: object;
  Rowarray: any = [];
  RecProductList: any[] = [];

  showProposalGeneration: boolean = false;
  showRebalance: boolean = false;
  showRecommendedPL: boolean = false;
  SchemeCodesResult: any;
  showPreview: boolean = false;
  loadflag: boolean = false;
  CustomerPortfolioDetails: any;
  Risk: any;
  showProposalSavedMsg: boolean = false;
  usertype: any;
  LoginId: any;
  benchmarkId: any;
  loader: boolean;
  CustomerAllocation: any[];
  error: string;
  EmailFlag: boolean;
  EmailMsg: any;
  noneID: HTMLInputElement;
  selectedID: HTMLInputElement;
  showriskProfile: HTMLInputElement;
  showLongname: boolean = false;
  LongnamesObj: object;
  LongnamesList: any[] = [];
  ClientSummaryResult: any[];
  InvestObjSubSubscriber: any;
  dd_InvestmentObjective: string[] = [];
  Longname: string = '';
  LongnameDisplaySuggestion: boolean = false;
  data: any;
  NameCode: string = '';
  ProposalPdfURL: any;
  ProposalPDFLink: any;
  EMAIL_TO: string;
  schemeError: boolean = false;
  SecOrNomError: boolean = false;
  PortfolioAllocSub: Subscription;
  isDownloading: boolean;
  successMsg: string;
  AllocationDetails: any;
  bmd: string;
  BenchmarkMasterData: any;
  profile: string[] = [];
  RiskProfileArray: any;
  TotalAllocation: any = 0.0;
  dirBonds: any;
  rebalanceBonds: any;
  BondsTransactionDetails: any[];
  BondsData: any[];
  MFTransactionDetails: any[];
  MFData: any[];
  EquitiesTransactionDetails: any[];
  EquitiesData: any[];
  Equities_Imbalance: number;
  dirEQ: any;
  dirMF: any;
  rebalanceMF: any;
  MF_Imbalance: number;
  rebalanceEQ: any;
  Bonds_Imbalance: number;
  isRebalDataFill: boolean = false;
  tempsub: Subscription = null;
  BuySellDropdown: any = ["BUY", "SELL"];
  // flag: boolean = true;

  type = 'PieChart';
  chartData = [];

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

  options = {
    pieHole: 0.4,
    // pieSliceText: 'none',
    backgroundColor: {
      fill: 'transparent',
    },
    legend: {
      // position: 'bottom',
      textStyle: {
        color: 'white',
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: 'both',
    },
    colors: this.chartColors,
    // changed
    width: '600',
    height: '200',
    is3D: true,

    chartArea: {
      left: 80,
      top: 40,
      width: '70%',
      height: '80%',
      Margin: '0 auto',
    },
    pieSliceTextStyle: {
      color: 'black',
    },

    // colors: ['#d4ab8b', '#ccb6a6', '#c8936a', '#ba7845'],
  };
  showChart: boolean = false;
  percentError: boolean = false;
  nominalError: boolean = false;
  totalPercentCheck: boolean = false;
  totalNominalError: boolean = false;
  SubTempData: any;
  subtemp: any[];
  CategoryData: any;
  CategoryList: any;

  constructor(
    private afs: CustomerApiService,
    public cfs: CommonApiService,
    private excelService: ExcelService,
    public api: WorkflowApiService,
    public authorApi: AuthService,
    private datePipe: DatePipe,
    //private homeApi: HomeApiService,
    public ngxXml2jsonService: NgxXml2jsonService,
    public router: Router,
    public downloadService: DownloadService,
    public Home_afs: HomeApiService,
    public Auth_afs: AuthService
  ) {
    this.noDataFlag = false;
    this.ProposalId;
    this.nameproposal;
    this.TargetNotional;
    this.AUM;
    this.baseCCY;
    this.error = '';
  }

  ngOnInit(): void {
    this.isRebalDataFill = false;
    
    this.showProposalGeneration = true;
    var Previewbtn = <HTMLInputElement>document.getElementById('Previewbtn');
    Previewbtn.disabled = true;
    var GenProbtn = <HTMLInputElement>document.getElementById('GPbtn');
    GenProbtn.disabled = true;

    this.usertype = sessionStorage.getItem('UserType');
    //console.log(this.usertype);
    this.EntityId = sessionStorage.getItem('HomeEntityID');
    this.UserId = sessionStorage.getItem('FinIQUserID');

    this.GetProposalNames();
    this.DB_Get_SchemeCode();
    this.GetRecommendedProductList();
    this.getBOP_ProcessingCommonData("TemplateSubTemplateMap");
    this.getBOP_ProcessingCommonData("SubTemplateCategory");

    this.noneID = <HTMLInputElement>document.getElementById('noneid');
    this.selectedID = <HTMLInputElement>document.getElementById('selectedid');
    this.showriskProfile = <HTMLInputElement>document.getElementById('rp');

    if (this.usertype == 'CLIENT') {
      this.GetBenchmarkMasterData();
      this.customerName = this.Home_afs.CustomerName; //Added by Ketan S on 21-Feb-22
      this.username = this.Auth_afs.UserName; //Added by Ketan S on 21-Feb-22

      //Start - Added by Ketan S on 21-Feb-22
      this.afs.getBankBaseCCYOBS.subscribe((ccy) => {
        if (ccy === '') {
          this.afs.setBankBaseCCY(AppConfig.settings.BankBaseCCy);
          this.baseCCY = AppConfig.settings.BankBaseCCy;
        } else {
          this.baseCCY = ccy
          this.afs.baseCCY;
        }
      });
      //END - Added by Ketan S on 21-Feb-22

      this.crr = this.Home_afs.RiskRating;  //Added by Ketan S on 21-Feb-22
      console.log(this.crr); 
      this.GetRiskProfileDetails();
      

      this.Customerid = this.Home_afs.CustomerId; //Added by Ketan S on 21-Feb-22
      this.NameCode = this.Home_afs.CustomerDisplayName; //Added by Ketan S on 21-Feb-22

      this.selectedID.checked = true;
      this.selectedID.disabled = false;
      this.noneID.disabled = true;
      this.showLongname = true;

      this.Get_Private_Proposal_Customer_Details(this.Customerid);
      this.LoginId = this.authorApi.UserName;

      if (this.username.length > 0) {
        console.log(this.username);
        this.afs.fngetCustAccountDetails(this.username);
      }
      this.tempsub = this.afs.getCustAccountDetails.subscribe((res) => {
        try {
          console.log(res);
          if (res.length !== 0) {
            if (Object.keys(res).length === 0 && res.constructor === Object) {
            } else {
              this.Customerid = res.CustomerID;
              this.CIF = res.misc10;
              sessionStorage.setItem('CustomerID', this.Customerid);
              this.customerName = res.misc1;
              //console.log(this.customerName);

              document.getElementById('PropName').innerText =
                this.username +
                '_' +
                this.datePipe.transform(this.mydate, 'MMM-dd-yyyy');
              this.ProposalName =
                this.username +
                '_' +
                this.datePipe.transform(this.mydate, 'MMM-dd-yyyy');
              this.nameproposal = this.ProposalName;
              console.log("nameproposal: ", this.ProposalName);

              this.caseDivision();
              

              // this.PortfolioAllocSub =
              //   this.cfs.selectedPortfolioallocObserver.subscribe((res) => {
              //     try {
              //       console.log("332",res);
              //       if (res.length !== 0) {
              //         console.log("Inside IF");
              //         this.CustomerPortfolioDetails = res.alloc;
  
              //         console.log(this.CustomerPortfolioDetails);
  
              //         if (this.CustomerPortfolioDetails.PortfolioName == res.name) {
              //           this.portfolio = this.CustomerPortfolioDetails.FacilityCode;
              //           //console.log(this.portfolio);
              //           this.investmentObj =
              //             this.CustomerPortfolioDetails.InvestmentObjective;
              //         } else {
              //           console.log("CustomerPortfolioDetails Empty.");
              //         }
              //       } else {
              //         console.log("RES Empty.");
              //       }
              //     } catch (error) {
              //       console.log(error);
              //     }
                  
              // });        
            }
          }
        } catch (EX) {}
      });  
     
    } //RM mode start

    else if (this.usertype == 'RM') {
      this.GetRiskProfileDetails();
      sessionStorage.setItem('User Login', 'RM');

      this.LoginId = this.authorApi.UserName;
      this.NameCode = sessionStorage.getItem('CustomerNamemisc1');
      this.noneID.checked = true;

      if (this.noneID.checked == true) {
        this.GetBenchmarkMasterData();
        //this.showriskProfile.disabled = true;
        this.showLongname = false;
        this.AUM = 0.0;
        // this.TotalAllocation = this.FormatNumberFromValue(this.AUM);
        // this.TargetNotional = this.FormatNumberFromValue(this.AUM);
        // this.TargetNotional = this.TotalAllocation; // Changes by Arsh
        //this.investmentObj = "Default";
        this.NameCode = 'Default';
        this.Customerid = 99;
      } else if (this.selectedID.checked == true) {
        this.showriskProfile.disabled = true;
        this.showLongname = true;
      }
      //console.log('Inside RM');
      this.loader = true;
      this.afs.getBankBaseCCYOBS.subscribe((ccy) => {
        this.baseCCY = ccy;
        //console.log(this.baseCCY);
        this.afs.baseCCY = this.baseCCY;
        this.api
          .GetClientSummary(
            this.authorApi.EntityID,
            this.authorApi.UserName,
            this.baseCCY
          )
          .subscribe((res) => {
            if (res.length !== 0) {
              // //console.log(JSON.parse(res.GetRMPortalClientSummary_LCYEResult));
              //console.log('Client summary Result', res);
              this.data = JSON.parse(res.GetRMPortalClientSummary_LCYEResult);
              //console.log(this.data);

              for (let i = 0; i < this.data.length; i++) {
                this.LongnamesObj = {
                  ln: this.data[i].LongName,
                };
                this.LongnamesList.push(this.LongnamesObj);
              }
              //console.log(this.LongnamesList);

              this.ClientSummaryResult = this.data.sort((a, b) =>
                a.LongName > b.LongName ? 1 : -1
              );
              //console.log(this.ClientSummaryResult);
              this.loader = false;
            } else {
              //console.log(' RMPortalClientSummary_LCYE Not Working ');
            }
          });
      });
    }

    //console.log(this.crr);
    this.changeCheckbox();
  } // End of ngOnInIt()

  ngOnDestroy(): void {
    if (this.PortfolioAllocSub != null ) {
      this.PortfolioAllocSub.unsubscribe();
      this.PortfolioAllocSub = null;
    }
    if(this.tempsub != null && this.tempsub != undefined){
      this.tempsub.unsubscribe();
      this.tempsub = null;
    }
  }

  GetRiskProfileDetails() {
    this.afs.GetRiskProfileDetails().subscribe((res) => {
      if (res) {
        console.log('RiskProfile', res);

        var Riskobj = res;
        this.RiskProfileArray = Object.keys(Riskobj).map((index) => {
          let result = Riskobj[index];
          return result;
        });
        //console.log(this.RiskProfileArray, typeof this.RiskProfileArray[0]);
        if (this.usertype === "RM") {
          this.profile = this.RiskProfileArray[0].map((it) => it.Risk_Profile);
          console.log(this.profile);
  
        } else if (this.usertype === "CLIENT"){
          var rArray = this.RiskProfileArray[0];
          console.log(rArray);
          this.Risk = rArray.filter((it) => it.ID == this.crr)[0]['Risk_Profile'];
          console.log(this.Risk);
        }              
      }
    });
  }

  GetBenchmarkMasterData () {
    this.afs.GetBenchmarkMasterData().subscribe((res) => {
      if (res) {
        //console.log(res);
        this.BenchmarkMasterData = res;
        console.log('GetBenchmarkMasterData', this.BenchmarkMasterData);
      }
    });
  }

  caseDivision() {
    if (this.portfolio == '') {       //Opened from Side Menu.
      this.GetPortfoliosFromCusID(this.Customerid, this.baseCCY);

    } else {                        //Opened from Reporting.
      this.getbenchmarkId();
    }   
  }

  GetPortfoliosFromCusID(CustId, Ccy) {
    this.afs.GetPortfoliosFromCusID(CustId, Ccy).subscribe((res) => {
      try {
        if (res) {
          console.log(res);
          if (this.portfolio === ''){
            this.portfolio = res.DB_GetPortfoliosResult[0].FacDesc;
            console.log(this.portfolio);
            this.getbenchmarkId();
          }    
        } else {
          console.log('GetPortfoliosFromCusID Empty.');
        }
      } catch (error) {
        console.log(error);
      }
    });
  }


  getbenchmarkId() {
    this.afs
        .GetBenchmarkId(this.Customerid, this.portfolio, this.LoginId)
        .subscribe((res) => {
          if (res) {
            this.benchmarkId = res.BenchmarkResponseBody.BenchmarkId;
            console.log("BenchmarkId", this.benchmarkId);
            this.getallocationdetails();
          }
        });
  }

  getallocationdetails() {
    try {
      this.afs
        .GetAllocationDetails(
          this.benchmarkId,
          this.portfolio,
          this.authorApi.EntityID,
          this.Customerid,
          'Proportionate'
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
              this.AllocationDetails = res.GetTACategoryData_WrapperResult.AllocationDetails;
              console.log('This.AllocationDetails', this.AllocationDetails);
              console.log(this.CustomerAllocation[0].NetWorthDeclared);

              this.AUM = this.CustomerAllocation[0].NetWorthDeclared;
              this.afs.AUM = this.AUM;
              this.TargetNotional = this.FormatNumberFromValue(this.AUM);
            } else {
              this.error = 'No Data Found.';
              this.loader = false;
            }
            console.log('customer allocation', this.CustomerAllocation);
            this.Risk = (this.CustomerAllocation.length > 0) ? (this.CustomerAllocation[0].RiskProfile) : '';
            this.investmentObj = this.CustomerAllocation[0].InvestmentObjctive;
            console.log("Investment Objective: ",this.investmentObj,"Risk Profile: ",this.Risk);

            if (![null, undefined].includes(this.investmentObj)) {
              this.GetChartData(this.CIF, this.Risk, this.investmentObj);
            }
            this.SelectedRiskProfile(this.Risk);
            this.ConfigPortfolioDefault();
          } else {
            console.log('No data fetched by GetAllocationDetails wrapper');
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  GetChartData(CIF, Risk, investmentObj) {
    //console.log('RISK AND INVESTMENT', Risk, investmentObj);
    this.afs.GetChartData(CIF, Risk, investmentObj).subscribe((res) => {
      if (res) {
        //console.log(res, 'Chart Data 1');
        //console.log(res.GetChartDataResult, 'Chart Data');

        var AssetContribution = res.GetChartDataResult;
        this.chartData = [];
        // AssetContribution.forEach((element) => {
        //   this.chartData.push([
        //     element.Scheme_Name,
        //     parseFloat(element.BA_Allocation),
        //   ]);
        // });
        if (AssetContribution.length !== 0){
        AssetContribution.forEach((element) => {
            this.chartData.push({
              title:  element.Scheme_Name,
              value: parseInt(element.BA_Allocation || 0, 10),
        });
          })
          // console.log(this.collateralChartData)
        }
        //console.log(this.chartData);
        this.showChart = true;
        //  this.BenchmarkMasterData = res;
        //  //console.log('GetBenchmarkMasterData', this.BenchmarkMasterData);
      }
    });
  }

  SelectedRiskProfile(item) {             //Fills the Investment Objective dropdown according to Risk Profile.
    //console.log(item);
    this.dd_InvestmentObjective = [];

    for (var i = 0; i < this.BenchmarkMasterData.length; i++) {
      if (item == this.BenchmarkMasterData[i].Benchmark_Name) {
        this.dd_InvestmentObjective.push(
          this.BenchmarkMasterData[i].Benchmark_Misc1
        );
      }
    }

    if (![null, undefined].includes(this.investmentObj)) {
      this.GetChartData(0, this.Risk, this.investmentObj);
    }

    if (this.crr == '') {
      this.crr = this.RiskProfileArray[0].filter(
        (it) => it.Risk_Profile == this.Risk
      )[0]['ID'];

      this.changeCheckbox();
    } else {
      try {
        var element1 = <HTMLInputElement>document.getElementById('c1');
        var element2 = <HTMLInputElement>document.getElementById('c2');
        var element3 = <HTMLInputElement>document.getElementById('c3');
        var element4 = <HTMLInputElement>document.getElementById('c4');
        var element5 = <HTMLInputElement>document.getElementById('c5');

        element1.checked = false;
        element2.checked = false;
        element3.checked = false;
        element4.checked = false;
        element5.checked = false;
        if (this.RiskProfileArray[0].length > 0) {
          this.crr = this.RiskProfileArray[0].filter(
            (it) => it.Risk_Profile == this.Risk
          )[0]['ID'];
        }

        this.changeCheckbox();
      } catch (ex) {}
    }
  }

  ConfigPortfolioDefault() {
    //console.log('this.AllocationDetails', this.AllocationDetails);
    this.AllocationDetails.forEach((element) => {
      switch (element.TEMPLATE_NAME) {
        case 'Shares':
          this.rebalanceEQ = element.AssetClassRebalancingRequiredAmount;
          if (
            this.cfs.UnformatNumberwithoutevent(
              element.AssetGroupTargetAmount -
                element.AssetGroupActualAllocationAmount
            ) < 0
          ) {
            this.dirEQ = 'SELL';
          } else {
            this.dirEQ = 'BUY';
          }
          break;

        case 'Mutual Funds Trade':
          this.rebalanceMF = element.AssetClassRebalancingRequiredAmount;
          if (
            this.cfs.UnformatNumberwithoutevent(
              element.AssetGroupTargetAmount -
                element.AssetGroupActualAllocationAmount
            ) < 0
          ) {
            this.dirMF = 'SELL';
          } else {
            this.dirMF = 'BUY';
          }
          break;

        case 'Mutual Funds':
          this.rebalanceMF = element.AssetClassRebalancingRequiredAmount;
          if (
            this.cfs.UnformatNumberwithoutevent(
              element.AssetGroupTargetAmount -
                element.AssetGroupActualAllocationAmount
            ) < 0
          ) {
            this.dirMF = 'SELL';
          } else {
            this.dirMF = 'BUY';
          }
          break;

        case 'Bonds Investment':
          this.rebalanceBonds = element.AssetClassRebalancingRequiredAmount;
          if (
            this.cfs.UnformatNumberwithoutevent(
              element.AssetGroupTargetAmount -
                element.AssetGroupActualAllocationAmount
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
    if (!this.isRebalDataFill) {
      this.Rowarray = [];
      this.TotalAllocation = 0;
      this.TargetNotional = 0;
      this.getRebalEQ();
      this.isRebalDataFill = true;
    }
  }

  getRebalEQ() {
    this.afs
      .GetRebalanceData_EQ(
        this.dirEQ,
        this.portfolio,
        this.authorApi.EntityID,
        this.Customerid,
        this.rebalanceEQ
      )
      .subscribe(
        (res) => {
          if (res) {
            console.log(res, 'Equities Details');
            this.EquitiesTransactionDetails = [];
            this.EquitiesData = [];
            this.EquitiesData.push(res.GetRebalanceData_WrapperResult);
            this.EquitiesTransactionDetails =
              res.GetRebalanceData_WrapperResult.EquitiesTransactionDetails;
            this.Equities_Imbalance = Number(
              this.cfs.UnformatNumberwithoutevent(
                res.GetRebalanceData_WrapperResult.Equities_Imbalance
              )
            );

            if(res.GetRebalanceData_WrapperResult.O_Message === "No record(s) found") {
              //this.getRebalMF();
            }
            else {
              for (var i = 0; i < this.EquitiesTransactionDetails.length; i++) {
                this.TemplateSelect = this.tempdetails.filter(
                  (sc) => sc.SchemeCode == 35
                );
  
                var obj = this.tempdetails.filter(ob => ob.TemplateName === this.TemplateSelect.slice()[0].TemplateName)[0]['TemplateCode'];
                console.log(obj);
                this.subtemp = [];
                this.subtemp = this.SubTempData.filter(tryFunc);
                function tryFunc(element) {
                  return element.Data_Value === obj;
                }
                console.log("CashbalanceEQ Rowobj");
                this.Rowobj = {
                  buysell: this.EquitiesTransactionDetails[i].BuySell,
                  schemecode: 35,
                  schemename: this.selectedSchemes.filter(
                    (item) => item.Scheme_Code == 35
                    // (item) => item.Scheme_Code == 3
                  )[0]['Scheme_Name'],
                  templates: this.TemplateSelect.slice(),
                  selectedTemplate: this.TemplateSelect.slice()[0].TemplateName,              
                  subTemplate: this.subtemp !== undefined ? this.subtemp : "",
                  activeSubTemp: this.subtemp !== undefined ? this.subtemp[0] : "",
                  categories: "",
                  activecategory: "",
                  securityname: this.EquitiesTransactionDetails[i].LongName,
                  securitycode: this.EquitiesTransactionDetails[i].ProductName,
                  nominal: this.EquitiesTransactionDetails[i].InvestmentAmount,
                  percentage: this.nominalToPercent(
                    this.EquitiesTransactionDetails[i].InvestmentAmount
                  ),
                  displaySuggestions: false,
                };
                this.Rowarray.push(this.Rowobj);
                console.log(this.Rowarray);
                var total = this.cfs.UnformatNumberwithoutevent(
                  this.Rowarray[i].nominal
                );
                this.TotalAllocation =
                  +this.cfs.UnformatNumberwithoutevent(this.TotalAllocation) +
                  +total;
                this.TotalAllocation = this.cfs.FormatNumberwithoutevent(
                  String(this.TotalAllocation)
                );
              }
            }
          } else {
          }
          this.getRebalMF();
        },
        (err) => {
          console.log(err);
          this.getRebalMF();
        }
      );
  }

  getRebalMF() {
    this.afs
      .GetRebalanceData_MF(
        this.dirMF,
        this.portfolio,
        this.authorApi.EntityID,
        this.Customerid,
        this.rebalanceMF
      )
      .subscribe(
        (res) => {
          if (res) {
            console.log(res, 'Funds Details');
            this.MFTransactionDetails = [];
            this.MFData = [];
            this.MFData.push(res.GetRebalanceData_Wrapper_UTResult);
            this.MFTransactionDetails =
              res.GetRebalanceData_Wrapper_UTResult.UTTransactionDetails;
            this.MF_Imbalance = Number(
              this.cfs.UnformatNumberwithoutevent(
                res.GetRebalanceData_Wrapper_UTResult.MF_Imbalance
              )
            );
          
            if(res.GetRebalanceData_Wrapper_UTResult.O_Message === "No record(s) found") {
              //this.getRebalBonds();
            }
            else {
              for (var i = 0; i < this.MFTransactionDetails.length; i++) {
                this.TemplateSelect = this.tempdetails.filter(
                  (sc) => sc.SchemeCode == 3
                );
                var obj = this.tempdetails.filter(ob => ob.TemplateName === this.TemplateSelect.slice()[0].TemplateName)[0]['TemplateCode'];
                console.log(obj);
                this.subtemp = [];
                this.subtemp = this.SubTempData.filter(tryFunc);
                function tryFunc(element) {
                  return element.Data_Value === obj;
                }
                this.Rowobj = {
                  buysell: "",
                  schemecode: 3,
                  schemename: this.selectedSchemes.filter(
                    (item) => item.Scheme_Code == 3
                  )[0]['Scheme_Name'],
                  templates: this.TemplateSelect.slice(),
                  selectedTemplate: this.TemplateSelect.slice()[0].TemplateName,
                  subTemplate: this.subtemp !== undefined ? this.subtemp : "",                    //this.subtemp !== undefined ? this.subtemp : "",
                  activeSubTemp: this.subtemp !== undefined ? this.subtemp[0] : "",
                  categories: "",
                  activecategory: "",
                  securityname: this.MFTransactionDetails[i].LongName,
                  securitycode: this.MFTransactionDetails[i].FundCode,
                  nominal: this.MFTransactionDetails[i].InvestmentAmount,
                  percentage: this.nominalToPercent(
                    this.MFTransactionDetails[i].InvestmentAmount
                  ),
                  displaySuggestions: false,
                };
                this.Rowarray.push(this.Rowobj);
                console.log(this.Rowarray);
                var total = this.cfs.UnformatNumberwithoutevent(
                  this.Rowarray[i].nominal
                );
                this.TotalAllocation =
                  +this.cfs.UnformatNumberwithoutevent(this.TotalAllocation) +
                  +total;
                this.TotalAllocation = this.cfs.FormatNumberwithoutevent(
                  String(this.TotalAllocation)
                );
              }
            }
            //console.log(this.Rowarray);
          } else {
          }          
          this.getRebalBonds();
        },
        (err) => {
          console.log(err);
          this.getRebalBonds();
        }
      );
  }

  getRebalBonds() {
    this.afs
      .GetRebalanceData_Bonds(
        this.dirBonds,
        this.portfolio,
        this.authorApi.EntityID,
        this.Customerid,
        this.rebalanceBonds
      )
      .subscribe((res) => {
        if (res) {
          console.log(res, 'Bonds Details');
          this.BondsTransactionDetails = [];
          this.BondsData = [];
          this.BondsData.push(res.GetRebalanceData_Wrapper_BondsResult);
          this.BondsTransactionDetails =
            res.GetRebalanceData_Wrapper_BondsResult.BondsTransactionDetails;
          this.Bonds_Imbalance = Number(
            this.cfs.UnformatNumberwithoutevent(
              res.GetRebalanceData_Wrapper_BondsResult.Bonds_Imbalance
            )
          );

          if(res.GetRebalanceData_Wrapper_BondsResult.O_Message === "No record(s) found") {

          } 
          else {
            for (var i = 0; i < this.BondsTransactionDetails.length; i++) {
              this.TemplateSelect = this.tempdetails.filter(
                (sc) => sc.SchemeCode == 4
              );
  
              //console.log(this.Rowarray);
              var obj = this.tempdetails.filter(ob => ob.TemplateName === this.TemplateSelect.slice()[0].TemplateName)[0]['TemplateCode'];
              console.log(obj);
              this.subtemp = [];
              this.subtemp = this.SubTempData.filter(tryFunc);
              function tryFunc(element) {
                return element.Data_Value === obj;
              }
              console.log(this.subtemp);
              this.Rowobj = {
                buysell: this.BondsTransactionDetails[i].BuySell,
                schemecode: 3,
                schemename: this.selectedSchemes.filter(
                  (item) => item.Scheme_Code == 4
                )[0]['Scheme_Name'],
                templates: this.TemplateSelect.slice(),
                selectedTemplate: this.TemplateSelect.slice()[0].TemplateName,
                subTemplate: this.subtemp !== undefined ? this.subtemp : "",                    //this.subtemp !== undefined ? this.subtemp : "",
                activeSubTemp: this.subtemp !== undefined ? this.subtemp[0] : "",
                categories: "",
                activecategory: "",
                securityname: this.BondsTransactionDetails[i].ProductName,
                securitycode: this.BondsTransactionDetails[i].ISIN,
                nominal: this.BondsTransactionDetails[i].InvestmentAmount,
                percentage: this.nominalToPercent(
                  this.BondsTransactionDetails[i].InvestmentAmount
                ),
                displaySuggestions: false,
              };
              this.Rowarray.push(this.Rowobj);
              console.log(this.Rowarray);
              var total = this.cfs.UnformatNumberwithoutevent(
                this.Rowarray[i].nominal
              );
              this.TotalAllocation =
                +this.cfs.UnformatNumberwithoutevent(this.TotalAllocation) +
                +total;
              this.TotalAllocation = this.cfs.FormatNumberwithoutevent(
                String(this.TotalAllocation)
              );
              //console.log(this.Rowarray[i].subTemplate, this.Rowarray[i].activeSubTemp);
            }
          }         

        } else {
          console.log("Bonds Empty.");
        }
      });
  }

  selectedLongNamefromSearch(item) {
    this.Longname = item.ln;
    this.username = this.Longname;
    this.NameCode = this.Longname;

    sessionStorage.setItem('NameCode', this.Longname);

    this.fnfilldetails(this.Longname);
  }

  fnfilldetails(Longname) {
    //console.log(Longname);
    this.Customerid = this.ClientSummaryResult.filter(
      (it) => it.LongName == Longname
    )[0]['CustomerID'];
    //console.log(this.Customerid);

    sessionStorage.setItem('CustomerID', this.Customerid);
    this.LoginId = this.ClientSummaryResult.filter(
      (it) => it.LongName == Longname
    )[0]['UserLogin'];

    sessionStorage.setItem('UserLogin', this.LoginId);
    this.investmentObj = this.dd_InvestmentObjective[0];
    //console.log(this.investmentObj);

    this.Risk = this.ClientSummaryResult.filter(
      (it) => it.LongName == Longname
    )[0]['Risk Profile'];
    //console.log(this.Risk);

    this.crr = this.ClientSummaryResult.filter(
      (it) => it.LongName == Longname
    )[0]['Risk Rating'];
    //console.log(this.crr);

    this.changeCheckbox();
    this.AUM = this.ClientSummaryResult.filter(
      (it) => it.LongName == Longname
    )[0]['AUM'];

    //Changed by Arsh
    // this.TotalAllocation = this.FormatNumberFromValue(this.AUM);
    //console.log(this.AUM);
    this.afs.AUM = this.AUM;
    this.TargetNotional = this.FormatNumberFromValue(this.AUM);

    // this.TotalAllocation = this.FormatNumberFromValue(this.AUM);
    // this.TargetNotional = this.TotalAllocation;

    //console.log(this.TotalAllocation);

    this.Customerid = this.ClientSummaryResult.filter(
      (it) => it.LongName == Longname
    )[0]['CustomerID'];
    this.CIF = this.ClientSummaryResult.filter(
      (it) => it.LongName == Longname
    )[0]['CIF'];
    //console.log(this.CIF);

    this.GetCustInvestmentObj();
    // To get particular Customer's Investment Objectives
  }

  GetCustInvestmentObj() {
    this.afs.GetCustInvestmentObj(this.Customerid);
    this.InvestObjSubSubscriber = this.afs.InvestObjSubObserver.subscribe(
      (res: any) => {
        //console.log(res);
        this.dd_InvestmentObjective = [];

        if (res.length > 0) {
          this.Risk =
            res[0].benchmark_name ||
            sessionStorage.getItem('RiskProfile').toUpperCase();
          //console.log(this.Risk);

          res.forEach((element) => {
            this.dd_InvestmentObjective.push(element.benchmark_misc1);
          });
          this.investmentObj = this.dd_InvestmentObjective[0];
          //console.log(this.dd_InvestmentObjective);

          this.getbenchmarkId();

          this.GetChartData(this.CIF, this.Risk, this.investmentObj);
        }
      }
    );
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
      // //console.log("Error:", error);
    }
  }

  fnLongname() {
    this.showLongname = true;
    this.showriskProfile = <HTMLInputElement>document.getElementById('rp');
    this.showriskProfile.disabled = true;
  }

  clickNone() {
    this.showLongname = false;
    this.showriskProfile = <HTMLInputElement>document.getElementById('rp');
    this.showriskProfile.disabled = false;
  }

  hideWithdelayLongname() {
    setTimeout(() => {
      this.LongnameDisplaySuggestion = false;
    }, 200);
  }

  SmartSearchLongname() {
    //console.log(this.Longname);

    if (this.Longname.length > 0) {
      this.LongnameDisplaySuggestion = true;
      //console.log(this.LongnameDisplaySuggestion);
    } else {
      this.LongnameDisplaySuggestion = false;
    }
  }

  changeOBJ(objective) {
    // this.TotalAllocation = 0;
    this.investmentObj = objective;
    //console.log(objective);

    this.GetTemplateList(this.Risk, this.investmentObj);
    this.GetChartData(0, this.Risk, this.investmentObj);
  }

  addRow(j) {
    this.Rowobj = {
      buysell: "",
      Schemecode: this.Rowarray[j].schemecode,
      schemename: this.Rowarray[j].schemename,
      templates: this.Rowarray[j].templates,
      selectedTemplate: this.Rowarray[j].selectedTemplate,
      subTemplate: "",
      activeSubTemp: "",
      categories: "",
      activecategory: "",
      securityname: '',
      securitycode: '',
      nominal: 0,
      percentage: '0%',
      displaySuggestions: false,
    };
    this.Rowarray.push(this.Rowobj);
    var total = this.cfs.UnformatNumberwithoutevent(
      this.Rowarray[this.Rowarray.length - 1].nominal
    );
    this.TotalAllocation =
      +this.cfs.UnformatNumberwithoutevent(this.TotalAllocation) + +total;
    this.TotalAllocation = this.cfs.FormatNumberwithoutevent(
      String(this.TotalAllocation)
    );
    // this.TargetNotional = this.TotalAllocation;

    //console.log(this.Rowarray.length, this.Rowarray);
  }

  addPlus() {
    this.Rowobj = {
      buysell: "BUY",
      Schemecode: '',
      schemename: '',
      templates: '',
      selectedTemplate: '',
      subTemplate: "",
      activeSubTemp: "",
      categories: "",
      activecategory: "",
      securityname: '',
      securitycode: '',
      nominal: '',
      percentage: '0%',
      displaySuggestions: false,
    };
    this.Rowarray.push(this.Rowobj);
    var total = this.cfs.UnformatNumberwithoutevent(
      this.Rowarray[this.Rowarray.length - 1].nominal
    );
    this.TotalAllocation =
      +this.cfs.UnformatNumberwithoutevent(this.TotalAllocation) + +total;
    this.TotalAllocation = this.cfs.FormatNumberwithoutevent(
      String(this.TotalAllocation)
    );
    // this.TargetNotional = this.TotalAllocation;
  }

  delRow(j) {
    //var count = this.Rowarray.length
    if (j >= 0) {
      this.Rowarray.splice(j, 1);
      //console.log(this.Rowarray.length);
    }
  }

  changeScheme(index: number) {
    //console.log(this.Rowarray, index);
    this.Rowarray[index].categories = [];
    var scheme = this.Rowarray[index].schemename;
    console.log(scheme);

    this.Rowarray[index].schemecode = this.selectedSchemes.filter((it) => {
      return it.Scheme_Name == this.Rowarray[index].schemename;
    })[0]['Scheme_Code'];
    //console.log(this.Rowarray[index].schemecode);
    var tempo = this.tempdetails
      .filter((sc) => sc.SchemeCode == this.Rowarray[index].schemecode)
      .slice();
    //console.log(tempo);
    this.Rowarray[index].templates = tempo.slice();
    this.Rowarray[index].selectedTemplate =
      this.Rowarray[index].templates[0].TemplateName;
    var obj = this.tempdetails.filter((it) => it.TemplateName === this.Rowarray[index].selectedTemplate)[0]['TemplateCode'];
    this.Rowarray[index].subTemplate = this.SubTempData.filter((ele) => ele.Data_Value === obj);
    console.log(obj);
    console.log(this.Rowarray[index].subTemplate);
    this.CategoryList = this.CategoryData.filter((it) => { return it.Data_Value === this.Rowarray[index].activeSubTemp });
    this.Rowarray[index].categories = this.CategoryList;
  }

  changeCheckbox() {
    if (this.crr == 'R1') {
      var element = <HTMLInputElement>document.getElementById('c1');
      element.checked = true;
    } else if (this.crr == 'R2') {
      var element = <HTMLInputElement>document.getElementById('c2');
      element.checked = true;
    } else if (this.crr == 'R3') {
      var element = <HTMLInputElement>document.getElementById('c3');
      element.checked = true;
    } else if (this.crr == 'R4') {
      var element = <HTMLInputElement>document.getElementById('c4');
      element.checked = true;
    } else if (this.crr == 'R5') {
      var element = <HTMLInputElement>document.getElementById('c5');
      element.checked = true;
    } else {
      //console.log('NOT DEFINED');
    }
  }

  selectedSecurityfromSearch(item, index) {
    //console.log(item, index);
    this.Rowarray[index].securityname = item.Param1;
    this.hideWithdelay(index);
  }

  btnsave() {
    //var objArray = [];
    this.GetNextValue(); //To Calculate ProposalID
  }

  GetNextValue() {
    var sTable = 'ProposalDetails';
    var sField = 'ProposalId';

    this.afs.GetNextValue(sTable, sField).subscribe((res) => {
      if (res) {
        console.log(res);
        this.ProposalId = res.GetNextValueResult;
        this.afs.ProposalId = this.ProposalId;
        //console.log(this.ProposalId);

        var objArray = [];
        var Pname = <HTMLInputElement>document.getElementById('PropName');
        this.ProposalName = Pname.value;
        if (this.ProposalName != '') {
          this.ProposalName = Pname.value;
        } else {
          this.ProposalName =
            this.username +
            '_' +
            this.datePipe.transform(this.mydate, 'MMM-dd-yyyy');
        }
        //console.log(this.Rowarray);

        for (let i = 0; i < this.Rowarray.length; i++) {
          console.log(i);
          var BuyOrSell = this.Rowarray[i].buysell;
          var Scheme = this.Rowarray[i].schemename;
          var Template = this.Rowarray[i].selectedTemplate;
          var Nominal = this.Rowarray[i].nominal.replaceAll(',', '');
          var Security = this.Rowarray[i].securityname;
          var SubTemplate = this.Rowarray[i].activeSubTemp;
          var Category = this.Rowarray[i].activecategory;
          //console.log(this.RecProductList);
          var Securitycode = this.RecProductList.filter((list) => {
            return list.Param1.trim() == this.Rowarray[i].securityname.trim();
          })[0]['Param2'];

          var obj = this.ArrObj(
            this.ProposalId,
            this.ProposalName,
            Scheme,
            Template,
            SubTemplate,
            Category,
            Securitycode,
            Nominal.replaceAll(',', ''),
            this.SecurityAllocation,
            this.CategoryAllocation,
            this.SubTemplateAllocation,
            this.TemplateAllocation,
            this.SchemeAllocation,
            this.cfs.UnformatNumberwithoutevent(
              this.TargetNotional === null ||
                this.TargetNotional === '' ||
                this.TargetNotional === undefined
                ? 0
                : this.TargetNotional
            ),
            this.baseCCY,
            Security,
            BuyOrSell
          );
          objArray.push(obj);
        }
        this.SaveProposalDetails(objArray);
      }
    });
  }

  ArrObj(
    ProposalId,
    ProposalName,
    Scheme,
    Template,
    SubTemplate,
    Category,
    SecurityCode,
    Nominal,
    SecurityAllocation,
    CategoryAllocation,
    SubTemplateAllocation,
    TemplateAllocation,
    SchemeAllocation,
    TargetNotional,
    baseCCY,
    Security,
    BuyOrSell
  ) {
    let rowobj: {
      ProposalId: number;
      ProposalName: string;
      Scheme: string;
      Template: string;
      SubTemplate: string;
      Category: string;
      SecurityCode: any;
      Nominal: number;
      SecurityAllocation: any;
      CategoryAllocation: any;
      SubTemplateAllocation: any;
      TemplateAllocation: any;
      SchemeAllocation: any;
      TargetNotional: any;
      Currency: any;
      Security: string;
      BuySell: string;
    } = {
      ProposalId: ProposalId,
      ProposalName: ProposalName,
      Scheme: Scheme,
      Template: Template,
      SubTemplate: SubTemplate,
      Category: Category,
      SecurityCode: SecurityCode,
      Nominal: Nominal,
      SecurityAllocation: SecurityAllocation,
      CategoryAllocation: CategoryAllocation,
      SubTemplateAllocation: SubTemplateAllocation,
      TemplateAllocation: TemplateAllocation,
      SchemeAllocation: SchemeAllocation,
      TargetNotional: TargetNotional,
      Currency: baseCCY,
      Security: Security,
      BuySell: BuyOrSell
    };

    return rowobj;
  }

  Change_Proposal() {
    var element = this.selectedValue[0];

    if (element != '--New--' && element != '--Private Proposal--') {
      this.btntext = 'Update Proposal';
      document.getElementById('PropName').innerText =
        this.username +
        '_' +
        this.datePipe.transform(this.mydate, 'MMM-dd-yyyy');
      this.ProposalName =
        this.username +
        '_' +
        this.datePipe.transform(this.mydate, 'MMM-dd-yyyy');
      this.nameproposal = this.ProposalName;
    } else {
      this.btntext = 'Save Proposal';
      document.getElementById('PropName').innerText =
        this.username +
        '_' +
        this.datePipe.transform(this.mydate, 'MMM-dd-yyyy');
      this.ProposalName =
        this.username +
        '_' +
        this.datePipe.transform(this.mydate, 'MMM-dd-yyyy');
      this.nameproposal = this.ProposalName;
    }
  }

  Refresh() {
    this.selectedValue = ['--New--'];
    this.Rowarray = [];
    this.TotalAllocation = 0;
    this.ProposalDropdown = ['--New--', '--Private Proposal--'];

    this.GetTemplateDetails();
    this.GetProposalNames();
    this.DB_Get_SchemeCode();
    this.GetRecommendedProductList();
    this.Get_Private_Proposal_Customer_Details(this.Customerid);
    this.GetRiskProfileDetails();
  }

  Reset() {
    this.selectedValue = ['--New--'];
    this.Rowarray = [];
    this.TotalAllocation = 0;
    this.ProposalDropdown = ['--New--', '--Private Proposal--'];

    this.GetTemplateDetails();
    this.GetProposalNames();
    this.DB_Get_SchemeCode();
    this.GetRecommendedProductList();
    this.Get_Private_Proposal_Customer_Details(this.Customerid);
    this.GetRiskProfileDetails();
  }

  Export() {
    const ExcelData = [] as any;

    for (let i = 0; i < this.Rowarray.length; i++) {
      var Scheme = this.Rowarray[i].schemename;
      var Template = this.Rowarray[i].selectedTemplate;
      var value = this.cfs.FormatNumberValue(this.Rowarray[i].nominal);
      var Security = this.Rowarray[i].securityname;

      ExcelData.push({
        Scheme: Scheme,
        Template: Template,
        Security: Security,
        Nominal: value,
      });
    }

    this.excelService.exportAsExcelFile(ExcelData, this.nameproposal);
  }

  onOptionSelected(event) {
    this.nameproposal = event; // event = Proposal Name of selected Proposal.
    //console.log(this.nameproposal);
    this.afs.nameproposal = this.nameproposal;

    if (event != '--New--' && event != '--Private Proposal--') {
      this.GetProposalDetails(event);
      var element = <HTMLInputElement>document.getElementById('PropName');
      element.value = event;
    } else if (event == '--New--') {
      this.TotalAllocation = 0.0;
      this.TargetNotional = 0.0;
      //console.log(this.Rowarray.length);
      var newProposal = this.Rowarray;
      this.Rowarray = [];
      for (var i = 0; i < newProposal.length; i++) {
        //console.log(newProposal.length);
        this.TemplateSelect = this.tempdetails.filter(
          (sc) => sc.SchemeCode === this.selectedSchemes[i].Scheme_Code
        );
        //console.log(this.TemplateSelect);

        this.Rowobj = {
          buysell: "",
          schemecode: this.selectedSchemes[i].Scheme_Code,
          schemename: this.selectedSchemes[i].Scheme_Name,
          templates: this.TemplateSelect.slice(),
          selectedTemplate: this.TemplateSelect.slice()[0].TemplateName,
          subTemplate: "",
          activeSubTemp: "",
          categories: "",
          activecategory: "",
          securityname: '',
          securitycode: '',
          nominal: '',
          percentage: '0%',
          displaySuggestions: false,
        };
        console.log('Row Obj', this.Rowobj);

        this.Rowarray.push(this.Rowobj);
        var total = this.cfs.UnformatNumberwithoutevent(
          this.Rowarray[i].nominal
        );
        this.TotalAllocation =
          +this.cfs.UnformatNumberwithoutevent(this.TotalAllocation) + +total;
        this.TotalAllocation = this.cfs.FormatNumberwithoutevent(
          String(this.TotalAllocation)
        );

        //console.log('Rowarray', this.Rowarray);
      }
    } else {
      var element = <HTMLInputElement>document.getElementById('PropName');
      element.value = '';
    }
  }

  SmartSearch(index) {
    //console.log(this.Rowarray[index].displaySuggestions);

    if (this.Rowarray[index].securityname.length > 0) {
      this.Rowarray[index].displaySuggestions = true;
      //console.log(this.Rowarray[index].displaySuggestions);
    } else {
      this.Rowarray[index].displaySuggestions = false;
    }
  }

  hideWithdelay(_index, _event?: KeyboardEvent) {
    // if (![].includes(event.key)) {
    //   setTimeout(() => {
    //     this.Rowarray[index].displaySuggestions = false;
    //   }, 100);
    // }
  }

  generateProposal(num: number) {
    //console.log(this.ProposalId);
    this.isDownloading = true;
    if (this.usertype == 'CLIENT') {
      this.GenerateProposalReport(
        this.ProposalId,
        this.nameproposal,
        this.TargetNotional,
        this.baseCCY,
        this.LoginId,
        this.Customerid,
        this.NameCode,
        this.investmentObj
      );
    } else if (this.usertype == 'RM') {
      this.LoginId = this.ClientSummaryResult[num].UserLogin;
      // this.AUM = 0.00;
      // this.investmentObj = "Default";
      // this.NameCode = "Default";
      // this.Customerid = 99;
      this.GenerateProposalReport(
        this.ProposalId,
        this.nameproposal,
        this.TargetNotional,
        this.baseCCY,
        this.LoginId,
        this.Customerid,
        this.NameCode,
        this.investmentObj
      );
    }
  }

  checkAll() {
    //console.log('Hello');

    var element = <HTMLInputElement>document.getElementById('headertextbox');
    //console.log(element);

    if (element.checked == true) {
      for (var i = 0; i < this.data.length; i++) {
        var childboxes = <HTMLInputElement>(
          document.getElementById('CustCheckbox' + i)
        );
        childboxes.checked = true;
      }
    } else {
      for (var i = 0; i < this.data.length; i++) {
        var childboxes = <HTMLInputElement>(
          document.getElementById('CustCheckbox' + i)
        );
        childboxes.checked = false;
      }
    }
  }

  SendEmailClient(emailId) {
    this.EMAIL_TO = emailId;
    this.SendProposalAsEmail(
      this.EMAIL_TO,
      this.UserId,
      this.EntityId,
      this.ProposalId,
      this.nameproposal,
      this.TargetNotional,
      this.baseCCY,
      this.LoginId,
      this.Customerid,
      this.NameCode,
      this.investmentObj
    );
  }

  SendEmailRM(emailId, num) {
    this.EMAIL_TO = emailId;
    this.LoginId = this.ClientSummaryResult[num].UserLogin;
    this.SendProposalAsEmail(
      this.EMAIL_TO,
      this.UserId,
      this.EntityId,
      this.ProposalId,
      this.nameproposal,
      this.TargetNotional,
      this.baseCCY,
      this.LoginId,
      this.Customerid,
      this.NameCode,
      this.investmentObj
    );
  }

  btnValidate() {
    for (let i = 0; i < this.Rowarray.length; i++) {
      if (this.Rowarray[i].schemename == '') {
        this.schemeError = true;
      } else {
        if (
          this.Rowarray[i].securityname == '' ||
          this.Rowarray[i].nominal == ''
        ) {
          this.SecOrNomError = true;
        } else {
          this.SecOrNomError = false;
        }

        this.schemeError = false;
        //console.log('Good');
      }
    }
  }

  DB_Get_SchemeCode() {
    this.afs.DB_Get_SchemeCode().subscribe((res) => {
      if (res) {
        //console.log(res);
        this.SchemeCodesResult = res;
        //console.log(this.SchemeCodesResult);

        this.selectedSchemes = this.SchemeCodesResult.slice();

        console.log('Schemes', this.selectedSchemes);
        
        this.GetTemplateDetails();
      }
    });
  }

  GetTemplateDetails() {
    this.afs.GetTemplateDetails().subscribe((res) => {
      if (res) {
        //console.log(res);
        //console.log(res.length);
        this.tempdetails = res;
        console.log('Template Details', this.tempdetails);
        if (this.usertype === 'RM') {
          this.RowCount = 3;
        }
        else {
          this.RowCount = 0;
        }
        for (var i = 0; i < this.Rowarray ? this.Rowarray.length : this.RowCount; i++) {
          this.TemplateSelect = this.tempdetails.filter(
            (sc) => sc.SchemeCode === this.selectedSchemes[i].Scheme_Code
          );
          console.log(this.TemplateSelect);

          this.Rowobj = {
            buysell: "",
            schemecode: this.selectedSchemes[i].Scheme_Code,
            schemename: this.selectedSchemes[i].Scheme_Name,
            templates: this.TemplateSelect.slice(),
            selectedTemplate: this.TemplateSelect.slice()[0].TemplateName,
            subTemplate: "",
            activeSubTemp: "",
            categories: "",
            activecategory: "",
            securityname: '',
            securitycode: '',
            nominal: 0,
            percentage: '0%',
            displaySuggestions: false,
          };
          console.log('Row Obj', this.Rowobj);

          this.Rowarray.push(this.Rowobj);
          var total = this.cfs.UnformatNumberwithoutevent(
            this.Rowarray[i].nominal
          );
          this.TotalAllocation =
            +this.cfs.UnformatNumberwithoutevent(this.TotalAllocation) + +total;
          this.TotalAllocation = this.cfs.FormatNumberwithoutevent(
            String(this.TotalAllocation)
          );

          console.log('Rowarray', this.Rowarray);
        }
      }
    });
  }

 

  SaveProposalDetails(returnedArray) {
    var objProposalDetails = returnedArray.slice();
    console.log(objProposalDetails);

    this.afs
      .SaveProposalDetails(objProposalDetails, this.UserId, this.EntityId)
      .subscribe((res) => {
        if (res) {
          console.log(res.SaveProposalDetailsResult);

          if (res.SaveProposalDetailsResult == true) {
            //To display Proposal saved successfuly  msg.
            this.showProposalSavedMsg = true;

            var Previewbtn = <HTMLInputElement>(
              document.getElementById('Previewbtn')
            );
            Previewbtn.disabled = false;
            var GenProbtn = <HTMLInputElement>document.getElementById('GPbtn');
            GenProbtn.disabled = false;
          } else {
            var Previewbtn = <HTMLInputElement>(
              document.getElementById('Previewbtn')
            );
            Previewbtn.disabled = true;
            var GenProbtn = <HTMLInputElement>document.getElementById('GPbtn');
            GenProbtn.disabled = true;
          }
        }
      });
  }

  GetProposalNames() {
    this.afs.GetProposalNames().subscribe((res) => {
      if (res) {
        //console.log(res);
        for (var i = 0; i < res.GetProposalNamesResult.length; i++) {
          this.ProposalDropdown.push(
            res.GetProposalNamesResult[i].ProposalName
          );
        }
      }
    });
  }

  GetProposalDetails(event) {
    ////console.log(ProposalName);
    this.afs.GetProposalDetails(event).subscribe((res) => {
      if (res) {
        //console.log(res);
        this.selectedDetails = res.GetProposalDetailsResult;
        console.log(this.selectedDetails);
        //console.log(this.selectedSchemes);

        this.Rowarray = [];
        this.TotalAllocation = 0;
        for (var i = 0; i < this.selectedDetails.length; i++) {
          this.TemplateSelect = this.tempdetails.filter((sc) => {
            return (
              sc.SchemeCode ===
              this.selectedSchemes.filter((ss) => {
                return ss.Scheme_Name === this.selectedDetails[i].Scheme;
              })[0]['Scheme_Code']
            );
          });
          //console.log(this.TemplateSelect);

          var selectedTempListFix = this.TemplateSelect.filter((tt) => {
            return tt.TemplateCode === this.selectedDetails[i].Template;
          });

          if (selectedTempListFix.length === 0) {
            selectedTempListFix = this.TemplateSelect.filter((tt) => {
              return tt.TemplateName === this.selectedDetails[i].Template;
            });
          }

          this.Rowobj = {
            buysell: this.selectedDetails[i].BuySell,
            schemename: this.selectedDetails[i].Scheme,
            schemecode: this.SchemeCodesResult.filter((scode) => {
              return scode.Scheme_Name == this.selectedDetails[i].Scheme;
            })[0]['Scheme_Code'],
            templates: this.TemplateSelect.slice(),
            selectedTemplate: selectedTempListFix[0]['TemplateName'],
            subTemplate: "",
            activeSubTemp: "",
            categories: "",
            activecategory: "",
            securityname: this.selectedDetails[i].Security,
            securitycode: this.selectedDetails[i].SecurityCode,
            nominal: this.cfs.FormatNumberValue(
              this.selectedDetails[i].Nominal
            ),
            percentage: this.nominalToPercent(this.selectedDetails[i].Nominal),
            displaySuggestions: false,
          };
          //console.log('Row Obj', this.Rowobj);

          this.Rowarray.push(this.Rowobj);
          var total = this.cfs.UnformatNumberwithoutevent(
            this.Rowarray[i].nominal
          );
          this.TotalAllocation =
            +this.cfs.UnformatNumberwithoutevent(this.TotalAllocation) + +total;
          this.TotalAllocation = this.cfs.FormatNumberwithoutevent(
            String(this.TotalAllocation)
          );

          //console.log('Rowarray', this.Rowarray);
        }
      }
    });
  }

  // GetLoginRMMappedCustomer(username, entityID) {
  //   this.afs.GetLoginRMMappedCustomer(username, entityID)
  //     .subscribe((res) => {
  //       if (res) {

  //         //console.log(res);
  //         //this.invobj = res.GetLoginRMMappedCustomerResult;
  //       }
  //     });
  // }

  Get_Private_Proposal_Customer_Details(Customerid) {
    this.afs
      .Get_Private_Proposal_Customer_Details(Customerid)
      .subscribe((res) => {
        if (res) {
          //console.log(res);
          // if (this.usertype != 'RM'){
          this.Code = res.Get_Private_Proposal_Customer_DetailsResult[0].Code;
          this.EmailID =
            res.Get_Private_Proposal_Customer_DetailsResult[0].EmailID;
          this.ContactNo =
            res.Get_Private_Proposal_Customer_DetailsResult[0].ContactNo;
        }
      });
  }

  GetRecommendedProductList() {
    var TemplateCode = '';
    var SubTemplate = '';
    var Category = '';
    this.afs
      .GetRecommendedProductList(TemplateCode, SubTemplate, Category)
      .subscribe((res) => {
        if (res) {
          //console.log(res);
          this.RecProductList = res.GetRecommendedProductListResult;
          //console.log('Recommended Product List', this.RecProductList);
        }
      });
  }

  GenerateProposalReport(
    ProposalId: string,
    nameproposal: string,
    AUM,
    baseCCY,
    LoginId,
    Customerid,
    NameCode,
    investmentObj
  ) {
    try {
      this.loadflag = true;
      this.ProposalPdfURL =
        this.interfaceUrl +
        'ProposalGeneration/' +
        ProposalId.trim() +
        '/' +
        nameproposal +
        '/' +
        AUM +
        '/' +
        baseCCY +
        '/' +
        LoginId +
        '/' +
        Customerid +
        '/' +
        NameCode +
        '/' +
        investmentObj;
      //console.log(this.ProposalPdfURL, 'ProposalPDF');
      this.downloadFileFromURL(this.ProposalPdfURL);
      //window.open("http://localhost/FinIQService/ProposalGeneration.svc/GenerateProposalReport/" + ProposalId.trim());

      // this.ProposalPdfURL.subscribe((res) => {
      //   if (res) {
      //     this.ProposalPDFLink = res.URL;
      //     //console.log(this.ProposalPDFLink, 'ProposalPDF1');
      //     window.open(this.ProposalPDFLink);
      //   }
      // });
    } catch (error) {
      console.error(error);
    }
  }

  SendProposalAsEmail(
    EMAIL_TO,
    UserId,
    EntityId,
    ProposalId,
    nameproposal,
    AUM,
    baseCCY,
    LoginId,
    Customerid,
    NameCode,
    investmentObj
  ) {
    try {
      this.loadflag = true;
      (this.ProposalPdfURL =
        this.interfaceUrl +
        'SendProposalAsEmail/' +
        EMAIL_TO +
        '/' +
        UserId +
        '/' +
        EntityId +
        '/' +
        ProposalId.trim() +
        '/' +
        nameproposal +
        '/' +
        AUM +
        '/' +
        baseCCY +
        '/' +
        LoginId +
        '/' +
        Customerid +
        '/' +
        NameCode +
        '/' +
        investmentObj),
        { headers: this.headerOptions };

      //console.log(this.ProposalPdfURL, 'PDF');

      //window.open("http://localhost/FinIQService/ProposalGeneration.svc/GenerateProposalReport/" + ProposalId.trim());
      this.downloadFileFromURL(this.ProposalPdfURL);
      // this.ProposalPdfURL.subscribe((res) => {
      //   if (res) {
      //     this.ProposalPDFLink = res.URL;
      //     //console.log(this.ProposalPDFLink, 'ProposalPDF2');
      //     window.open(this.ProposalPDFLink);
      //   }
      // });
    } catch (error) {
      console.error(error);
    }
  }

  clickBack() {
    this.afs.FacilityCodeStatus(this.portfolio);
    this.router.navigate(['/portfolioallocation']);
  }
  downloadFileFromURL(url) {
    if (url) {
      this.downloadService
        .downloadPDF(url)
        .subscribe((resp: HttpResponse<Blob>) => {
          //console.log(resp.headers.get('content-disposition'));
          this.isDownloading = false;
          const fileName = resp.headers.get('content-disposition')
            ? resp.headers
                .get('content-disposition')
                .split(';')[1]
                .trim()
                .replace(/filename=/g, '')
            : 'File' + new Date().toLocaleString();
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(resp.body);
          a.href = objectUrl;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(objectUrl);
        });
    } else {
      setTimeout(() => {
        this.error = 'Error while downloading.';
      }, 3000);
    }
  }

  GetTemplateList(riskprofile, invobjective) {
    //console.log('Inside Template List.');
    this.afs.GetTemplateList(riskprofile, invobjective).subscribe((res) => {
      try {
        //console.log('RES', res);
        var xmlString: string = res.body;
        xmlString.replace('a:', '');
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, 'text/xml');
        const obj = this.ngxXml2jsonService.xmlToJson(xml);
        var template =
          obj['GetTemplateListResponse']['GetTemplateListResult'][
            'a:DC_TemplateList'
          ];

        if (
          template['a:BA_Allocation'] !== null &&
          template['a:BA_Allocation'] !== undefined
        ) {
          console.log('TEMPLATE OBJ', template);
          //object
          this.Rowarray = [];
          this.TotalAllocation = 0;

          this.Rowobj = {
            buysell: "",
            schemecode: template['a:Scheme_Code'],
            schemename: template['a:Scheme_Name'],
            templates: (this.TemplateSelect = this.tempdetails.filter(
              (sc) => sc.SchemeCode == template['a:Scheme_Code']
            )),
            selectedTemplate: '',
            subTemplate: "",
            activeSubTemp: "",
            categories: "",
            activecategory: "",
            securityname: '',
            securitycode: '',
            nominal: 0,
            percentage: '0%',
            displaySuggestions: false,
          };
          this.Rowobj['selectedTemplate'] = template['a:Template_name'];
          this.Rowarray.push(this.Rowobj);
          var total = this.cfs.UnformatNumberwithoutevent(
            this.Rowarray[0].nominal
          );
          this.TotalAllocation =
            +this.cfs.UnformatNumberwithoutevent(this.TotalAllocation) + +total;
          this.TotalAllocation = this.cfs.FormatNumberwithoutevent(
            String(this.TotalAllocation)
          );
          //console.log(this.Rowarray);
        } else {
          // array
          //console.log('TEMPLATE LIST', template);
          this.Rowarray = [];
          this.TotalAllocation = 0;
          template.forEach((row, index) => {
            //console.log(row);
            this.Rowobj = {
              buysell: "",
              schemecode: row['a:Scheme_Code'],
              schemename: row['a:Scheme_Name'],
              templates: (this.TemplateSelect = this.tempdetails.filter(
                (sc) => sc.SchemeCode == row['a:Scheme_Code']
              )),
              selectedTemplate: row['a:Template_name'],
              subTemplate: "",
              activeSubTemp: "",
              categories: "",
              activecategory: "",
              securityname: '',
              securitycode: '',
              nominal: 0,
              percentage: '0%',
              displaySuggestions: false,
            };
            this.Rowarray.push(this.Rowobj);
            var total = this.cfs.UnformatNumberwithoutevent(
              this.Rowarray[index].nominal
            );
            // this.TotalAllocation += +total;
            this.TotalAllocation =
              +this.cfs.UnformatNumberwithoutevent(this.TotalAllocation) +
              +total;
            this.TotalAllocation = this.cfs.FormatNumberwithoutevent(
              String(this.TotalAllocation)
            );
          });
        }

        //console.log('TEMPLATE', typeof template, template);
        if (res) {
          //console.log('template List', res);
        } else {
          //console.log('GetTemplateList Empty.');
        }
      } catch (error) {
        //console.log(error);
      }
    });
  }

  public setFocusOnFirstMenuItem(event: KeyboardEvent): void {
    if (event.key == 'ArrowDown' || event.key == 'ArrowUp') {
      event.preventDefault();
      if (this.listTrigger != null && this.listTrigger.first != null) {
        //console.log(this.listTrigger.first.nativeElement);
        this.listTrigger.first.nativeElement.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    //console.log(this.listTrigger, index);
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        (index === 0
          ? this.listTrigger.last
          : this.listTrigger.get(index - 1)
        ).nativeElement.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        (index === this.listTrigger.length - 1
          ? this.listTrigger.first
          : this.listTrigger.get(index + 1)
        ).nativeElement.focus();
        break;
      case 'Escape':
        event.stopPropagation();
        (index === this.listTrigger.length - 1
          ? this.listTrigger.first
          : this.listTrigger.get(index + 1)
        ).nativeElement.blur();
        this.searchInput.nativeElement.focus();
        break;
    }
  }

  percentToNominal(percentage) {
    percentage = percentage.replace('%', '');
    var targetNotional = parseFloat(
      this.cfs.UnformatNumberwithoutevent(this.TargetNotional)
    );
    percentage = parseFloat(percentage);
    var nominal = (percentage / 100) * targetNotional;
    //console.log(percentage);
    return this.cfs.FormatNumberwithoutevent(nominal.toString());
  }

  nominalToPercent(nominal) {
    nominal = !!nominal ? this.cfs.UnformatNumberwithoutevent(nominal) : 0;
    var targetNotional = parseFloat(
      this.cfs.UnformatNumberwithoutevent(this.TargetNotional)
    );
    if (targetNotional === 0) {
      var percentage = 0;
    } else {
    var percentage = (nominal / targetNotional) * 100;
    }
    return (
      this.cfs.FormatNumberwithoutevent(percentage.toString()).toString() + '%'
    );
  }

  onNominalChange(index) {
    if (index === 'a') {
      for (var i = 0; i < this.Rowarray.length; i++) {
        percentage = this.nominalToPercent(this.Rowarray[i].nominal);
        if (+percentage.replace('%', '') <= 100) {
          console.log(percentage);
          this.Rowarray[i].percentage = percentage;
          this.nominalError = false;
        } else {
          this.nominalError = true;
        }
      }
      console.log(this.Rowarray);
    } else {
    var obj = this.Rowarray[index];
    var nominal = obj.nominal;
    var percentage: any = 0;
    //console.log(obj);
    percentage = this.nominalToPercent(nominal);
    if (+percentage.replace('%', '') <= 100) {
      //console.log(percentage);
      this.Rowarray[index].percentage = percentage;
      this.nominalError = false;
    } else {
      this.nominalError = true;
      //console.log(this.nominalError);
    }
    // this.totalNominalPercentCheck();
    // this.totalNominalCheck();
    this.TotalAllocation = 0;
    //console.log(this.Rowarray.length);
    for (let i = 0; i < this.Rowarray.length; i++) {
      var total = this.cfs.UnformatNumberwithoutevent(this.Rowarray[i].nominal);
      this.TotalAllocation =
        +this.cfs.UnformatNumberwithoutevent(this.TotalAllocation) + +total;
      //console.log(total, this.TotalAllocation);
      this.TotalAllocation = this.cfs.FormatNumberwithoutevent(
        String(this.TotalAllocation)
      );
    }
  }
  
  }
  onPercentChange(index) {
    //console.log(this.Rowarray, index);
    var obj = this.Rowarray[index];
    var percentage = obj.percentage;
    if (+percentage.replace('%', '') <= 100) {
      var nominal = 0;
      nominal = this.percentToNominal(percentage);
      //console.log(nominal);
      this.Rowarray[index].nominal = nominal;
      this.percentError = false;
    } else {
      this.percentError = true;
    }
    this.TotalAllocation = '0';
    for (let i = 0; i < this.Rowarray.length; i++) {
      var total = this.cfs.UnformatNumberwithoutevent(this.Rowarray[i].nominal);
      this.TotalAllocation =
        +this.cfs.UnformatNumberwithoutevent(this.TotalAllocation) + +total;
      this.TotalAllocation = this.cfs.FormatNumberwithoutevent(
        String(this.TotalAllocation)
      );
    }
    // this.totalNominalPercentCheck();
    // this.totalNominalCheck();
  }
  // totalNominalPercentCheck() {
  //   var percent = 0;
  //   this.Rowarray.forEach((row) => {
  //     //console.log(row.percentage, +(row.percentage.replace('%', '')), "  ", percent  )
  //     percent += +(row.percentage.replace('%', ''));
  //   });
  //   // if (percent > 100) {
  //   //   this.totalPercentCheck = true;
  //   // } else {
  //   //   this.totalPercentCheck = false;
  //   // }
  //   this.totalPercentCheck = false;
  // }
  // totalNominalCheck() {
  //   var nominal = 0;
  //   this.Rowarray.forEach((row) => {
  //     nominal += this.cfs.UnformatNumberwithoutevent(row.nominal);
  //   });
  //   // if (nominal > this.TargetNotional) {
  //   //   this.totalNominalError = true;
  //   // } else {
  //   //   this.totalNominalError = false;
  //   // }
  //   this.totalNominalError = false;
  // }

  changeBuySell(index) {
    console.log(index);
  }
  getBOP_ProcessingCommonData(subtempOrCat) {
    console.log("BOP");
    if (subtempOrCat === "TemplateSubTemplateMap") {
      this.afs.BOProcessing_CommonData(subtempOrCat).subscribe((res) => {
        if (res) {
          console.log("RES");
          this.SubTempData = res.BOProcessing_CommonDataResult;
          console.log("SubTempData", this.SubTempData);
          console.log(this.Rowarray);
        } else {
          console.log("NO RES for BOP.")
        }
      })
    } else if (subtempOrCat === "SubTemplateCategory") {
      console.log(subtempOrCat);
      this.afs.BOProcessing_CommonData(subtempOrCat).subscribe((object) => {
        if (object) {
          this.CategoryData = object.BOProcessing_CommonDataResult;
          console.log(this.CategoryData, object);
          //console.log(this.Rowarray);
        } else {
          console.log("No object for BOP.")
        }
      })
    }
  }
  changedTemplate(j) {
    this.Rowarray[j].subTemplate = [];
    this.Rowarray[j].categories = [];
    var obj = this.tempdetails.filter((it) => it.TemplateName === this.Rowarray[j].selectedTemplate)[0]['TemplateCode'];
    console.log(obj);
    this.Rowarray[j].subTemplate = this.SubTempData.filter((it) => it.Data_Value === obj);
    console.log(this.Rowarray[j].subTemplate);
  }
  changdedSubTemp(j) {
    console.log("Inside changedSubTemp", j);
    this.Rowarray[j].categories = [];
    this.CategoryList = this.CategoryData.filter((it) => { return it.Data_Value === this.Rowarray[j].activeSubTemp });
    this.Rowarray[j].categories = this.CategoryList;
    console.log(this.CategoryList);
  }
  changedCategory(j) {
    console.log(this.Rowarray[j].activecategory);
  }
}
