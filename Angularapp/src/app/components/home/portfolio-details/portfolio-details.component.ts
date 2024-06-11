import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-portfolio-details',
  templateUrl: './portfolio-details.component.html',
  styleUrls: ['./portfolio-details.component.scss'],
})
export class PortfolioDetailsComponent implements OnInit, AfterViewChecked {
  selectedRMCustomerDetails: {
    custName: string;
    custId: string;
    userName: string;
    cif: string;
  };
  mode: any;
  isUserRM: boolean;
  username: string;
  custId: string;
  cif: string;

  // @Input() get CustomerDetails() {
  //   return this.selectedRMCustomerDetails;
  // }
  // set CustomerDetails(CustomerDetails) {
  //   this.selectedRMCustomerDetails = CustomerDetails;
  //   this.username = this.selectedRMCustomerDetails?.userName;
  //   this.custId = this.selectedRMCustomerDetails?.custId;
  //   this.cif = this.selectedRMCustomerDetails?.cif;
  //   // console.log(this.selectedRMCustomerDetails);
  // }
  // @Input() get Mode() {
  //   return this.mode;
  // }
  // set Mode(Mode) {
  //   this.mode = Mode;
  //   this.isUserRM = this.mode === 'RM';
  //   console.log(this.mode);
  // }
  @Input() get CustomerDetails() {
    return this.selectedRMCustomerDetails;
  }
  set CustomerDetails(CustomerDetails) {
    this.selectedRMCustomerDetails = CustomerDetails;
    console.log(this.selectedRMCustomerDetails);
  }
  @Input() get Mode() {
    return this.mode;
  }
  set Mode(Mode) {
    this.mode = Mode;
    this.isUserRM = this.mode === 'RM';
    console.log(this.mode);
  }
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
  expandPortfolio: boolean = false;
  showChart = true;
  popuperror = '';
  facilityCode = [];
  pieoptions = {
    pieHole: 0.5,
    legend: {
      position: 'right',
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: 'both',
    },
    colors: this.chartColors,
    width: '450',
    height: '300',
    hAxis: {
      textStyle: {
        color: '#808080',
      },
    },
    vAxis: {
      textStyle: {
        color: '#808080',
      },
    },
    titleTextStyle: {
      color: '#808080',
    },
    // backgroundColor: '#FFFFFF00',
    chartArea: { left: 20, top: 0, width: '100%', height: '100%' },
    // colors: ['#d4ab8b', '#ccb6a6', '#c8936a', '#ba7845'],
  };
  pnlbestoptions = {
    width: '500',
    height: '350',
    legend: 'none',
    colors: this.chartColors,
    hAxis: {
      slantedText: true,
      slantedTextAngle: 45,
      textStyle: {
        color: '#808080',
      },
      gridlines: {
        color: '#424242',
      },
    },
    vAxis: {
      textStyle: {
        color: '#808080',
      },
      gridlines: {
        color: '#424242',
      },
    },
    backgroundColor: { fill: 'transparent' },
    titleTextStyle: {
      color: '#808080',
    },
    tooltip: {
      trigger: 'both',
    },
  };
  assetAlloc = [];
  pnlAlloc = [];
  isLoading: boolean;
  selectedfacilityCode: string;
  Selectedportfolio: string;
  // @Input() selectedfacilityCode: string;

  // @Input() Selectedportfolio: string;
  // @Input() baseCCY: string;
  baseCCY: string;
  portfolioDetails: any;
  image: any[];

  isProd = environment.production;
  holdinghistorydetails: any[];

  holdinghistorypopupflag: any = [];

  previousIndex: any;
  Selectedassetlongname: any;
  userType: any;
  noDataFlag: boolean;

  Summaryflag: any = false; // Added by Mayuri D | 07-Feb-2022

  constructor(
    public homeApi: HomeApiService,
    public api: WorkflowApiService,
    public authApi: AuthService,
    public commonApi: CommonApiService,
    public customerApi: CustomerApiService,
    public router: Router,
    public elem: ElementRef,
    public location: Location,
    public activatedRoute: ActivatedRoute
  ) { }

  ngAfterViewChecked() {
    // //console.log("out")
    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByTagName('rect'),
      (rect: HTMLElement) => {
        if (rect.getAttribute('fill') === '#ffffff') {
          // //console.log("hello")
          rect.setAttribute('fill', '#ffffff00');
        }
      }
    );
    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByTagName('path'),
      (path: HTMLElement) => {
        if (path.getAttribute('stroke') === '#ffffff') {
          // //console.log("hello")
          path.setAttribute('stroke-width', '0');
        }
      }
    );
  }
  ngOnInit(): void {
    this.userType = this.authApi.UserType;
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    if (this.isUserRM) {
      // this.username = this.selectedRMCustomerDetails?.userName;
      // this.custId = this.selectedRMCustomerDetails?.custId;
      // this.cif = this.selectedRMCustomerDetails?.cif;
      this.username = sessionStorage.getItem('RMUser');
      this.custId = sessionStorage.getItem('RMCustID');
      this.cif = sessionStorage.getItem('RMCIF');
    
    } else {
      this.username = this.authApi.UserName;
      this.custId = this.homeApi.CustomerId;
      this.cif = this.homeApi.CIF;
    }
    //Changes done by Alolika G on 10-02-2022 as told by Mohan P
    this.activatedRoute.queryParams.subscribe((res) => {
      this.Selectedportfolio = res.Selectedportfolio;
      this.selectedfacilityCode = res.selectedfacilityCode;
      this.baseCCY = res.baseCCY;
      this.username = res.username;
      this.cif = res.cif;
      this.custId = res.custId;
    });
    this.popuperror = '';
    this.isLoading = true;
    this.getSecurityHoldings();
    this.getAUMnPNL();
    this.api.portfolioSecHoldingObserver.subscribe((res) => {
      try {
        this.portfolioDetails = [];
        if (res.length !== 0) {
          this.portfolioDetails = res;
          this.image = [];
          // this.portfolioDetails = this.portfolioDetails.map(p=>p[0]);
          this.portfolioDetails.forEach((e) => {
            e.CEHD_Pending_receive_Qty[0] = parseFloat(
              e.CEHD_Pending_receive_Qty[0]
            );
            e.CEHD_Pending_pay_Qty[0] = parseFloat(e.CEHD_Pending_pay_Qty[0]);
            e.CEHD_Available_Qty[0] = parseFloat(e.CEHD_Available_Qty[0]);
            e.CEHD_BUY_Settled_Avg_Price[0] = 
              parseFloat(e.CEHD_BUY_Settled_Avg_Price[0])
           
            e.CEHD_PledgedOut_Qty[0] = parseFloat(e.CEHD_PledgedOut_Qty[0]);
            this.image.push(
              this.isProd
                ? 'assets/App_Resources/App_Resources/RMW_Images/' +
                e.TypeAsset[0] +
                '.png'
                : '../../../assets/App_Resources/App_Resources/RMW_Images/' +
                e.TypeAsset[0] +
                '.png'
            );
          });
          // console.log('Portfolio de', this.portfolioDetails);
          // this.ref.detectChanges();
          this.isLoading = false;
          if (this.portfolioDetails.length === 0) {
            this.popuperror = 'No data found.';
            this.noDataFlag = true;
          } else {
            this.noDataFlag = false;
            this.popuperror = '';
          }
        }
      } catch (Ex) { }
    });
  }

  // Added by Akhilesh D on 03/12/2021 as told by Parikshit Sir
  get_holding_history_details(item, i) {
    this.holdinghistorydetails = [];

    this.holdinghistorypopupflag[this.previousIndex] = false;
    this.previousIndex = i;
    this.customerApi
      .GetHoldingHistoryDetails(
        item.CEHD_ID[0],
        item.CEHD_Customer_ID[0],
        item.CEHD_Facility_Code[0],
        item.CEHD_Stock_Code[0],
        this.authApi.EntityID
      )
      .subscribe((res) => {
        if (res) {
          // console.log(res);
          this.holdinghistorydetails = res.Get_Holding_History_DetailsResult;
          // console.log(this.holdinghistorydetails, "Array")
          for (var item of this.holdinghistorydetails) {
            item.trade_date = item.trade_date.toString();
            // console.log(item.trade_date, "Trade Date")
            item.trade_date = item.trade_date.slice(
              6,
              item.trade_date.indexOf('+')
            );
            item.trade_date = new Date(+item.trade_date);
            item.settlement_date = item.settlement_date.toString();
            // console.log(item.settlement_date, "Settlement Date")
            item.settlement_date = item.settlement_date.slice(
              6,
              item.settlement_date.indexOf('+')
            );
            item.settlement_date = new Date(+item.settlement_date);
            item.CEHDH_LastUpdated_At = item.CEHDH_LastUpdated_At.toString();
            // console.log(item.CEHDH_LastUpdated_At, "Last Upddated")
            item.CEHDH_LastUpdated_At = item.CEHDH_LastUpdated_At.slice(
              6,
              item.CEHDH_LastUpdated_At.indexOf('+')
            );
            item.CEHDH_LastUpdated_At = new Date(+item.CEHDH_LastUpdated_At);
            // console.log(item.trade_date)
          }
        }
      });
    this.holdinghistorypopupflag[i] = true;
    this.Selectedassetlongname = item.longName;
  }
  showholdinghistorydetailsPopUp(d: boolean, row: number, folioName: string) {
    if (d === true) {
      this.isLoading = true;
      this.holdinghistorypopupflag[row] = true;
      this.Selectedassetlongname = folioName;
      this.holdinghistorydetails = [];
    } else {
      this.holdinghistorypopupflag[row] = false;
    }
  }
  // End Add Akhilesh D on 03/12/2021

  callOrderEntry(item, dir) {
    // console.log(item);
    this.homeApi.RediretToHomeBuySellPledge = dir.CEHD_Stock_Code[0];
    if (
      item === 'SELL' &&
      dir.CEHD_Available_Qty[0] <=
      0
    ) {
      this.popuperror = "You don't have enough balance to sell";
    } else {
      this.popuperror = '';
      switch (dir.TypeAsset[0]) {
        // case 'UT':
        //   this.router.navigate(['/neworderentry/amfunds']);
        //   // Asset
        //   break;
        case 'FI':
          // this.commonApi.setAsset(dir.CEHD_Stock_Code[0]);
          this.commonApi.setAsset(dir);
          this.commonApi.setDirection(item);
          // this.commonApi.setPortfoliobalance(
          //   dir.CEHD_Available_Qty[0] +
          //     dir.CEHD_Pending_receive_Qty[0] +
          //     dir.CEHD_PledgedOut_Qty[0] -
          //     dir.CEHD_Pending_pay_Qty[0]
          // );
          this.commonApi.setPortfoliobalance(
            dir.CEHD_Available_Qty[0]);

          //By Ashwini H. for product catalogue display on 07 Feb
          this.Summaryflag = true;
          this.commonApi.setFlagToDisplayCust(this.Summaryflag);
          sessionStorage.setItem('BondPorfolioDetails', 'FromPortfolioDetails');
          this.router.navigate(['/neworderentry/bonds'], {
            queryParams: { displaySearch: true },
          });
          break;
        case 'EQ':
          this.commonApi.setAsset(dir.CEHD_Stock_Code[0]);
          this.commonApi.setDirection(item);
          this.commonApi.setPortfoliobalance(
            dir.CEHD_Available_Qty[0] 
          );
          this.router.navigate(['/neworderentry/shares'], {
            queryParams: { displaySearch: true },
          });
          break;
        case 'UT':
          // this.commonApi.setAsset(dir.longName[0]);
          // Added by Mayuri D | 07-Feb-2022 ...START...
          this.Summaryflag = true;
          this.commonApi.setFlagToDisplayCust(this.Summaryflag);
          // console.log("in ut setfalg" ,)
          // Added by Mayuri D | 07-Feb-2022 ...END...
          this.commonApi.setAsset(dir.ISIN[0]);
          this.commonApi.setDirection(item);
          this.commonApi.setPortfoliobalance(
            dir.CEHD_Available_Qty[0]
          );
          this.router.navigate(['/neworderentry/funds'], {
            queryParams: { displaySearch: true },
          });
          break;

          //<!-- Addded by Alolika G | 15-02-2022 -->
          // case 'Notes':
          // this.Summaryflag = true;
          // this.commonApi.setFlagToDisplayCust(this.Summaryflag);

          // this.commonApi.setAsset(dir.ISIN[0]);
          // this.commonApi.setDirection(item);
          // this.commonApi.setPortfoliobalance(
          //   dir.CEHD_Available_Qty[0] +
          //   dir.CEHD_Pending_receive_Qty[0] +
          //   dir.CEHD_PledgedOut_Qty[0] -
          //   dir.CEHD_Pending_pay_Qty[0]
          // );
          // this.router.navigate(['/neworderentry/structurednotesorder'], { queryParams:{displaySearch: true}});
          // break;
      }

      this.commonApi.setPortfolio(this.selectedfacilityCode);
    }
  }
  fnCallPledgeOrderEntry(item) {
    sessionStorage.setItem('PledgePageMode', '0');
    sessionStorage.setItem('PledgeRecord', JSON.stringify(item));
    this.router.navigate(['neworderentry/PLEDGE']);
    this.homeApi.RediretToHomeBuySellPledge = item.CEHD_Stock_Code[0];
  }

  fnCallSwitchFund(dir) {
    this.commonApi.setAsset(dir.ISIN[0]);
    this.commonApi.setPortfoliobalance(
      dir.CEHD_Available_Qty[0] 
    );
    this.router.navigate(['neworderentry/SWITCHFUND']);
  }
  getAUMnPNL() {
    this.homeApi
      .GetAUMandPNL(
        this.cif,
        this.username,
        'ASSET',
        this.baseCCY,
        this.selectedfacilityCode || null
      )
      .subscribe((res) => {
        if (res.length !== 0) {
          // console.log(res);

          if (res.ResponseBody.OrdResponseDetails.Description === null) {
            if (
              res.ResponseBody.ClientWiseHoldings.ClientwisePortfolioDetails !==
              []
            ) {
              let portfolioData =
                res.ResponseBody.ClientWiseHoldings.ClientwisePortfolioDetails;
              // console.log(portfolioData);
              portfolioData.forEach((element) => {
                if (element.FacilityCode === this.selectedfacilityCode) {
                  this.assetAlloc = [];

                  this.pnlAlloc = [];
                  element.AssetDetails.forEach((ele) => {
                    // this.assetAlloc.push([
                    //   ele.XAxisMember,
                    //   Math.abs(ele.Holdings),
                    // ]);
                    this.assetAlloc.push({
                      title:  ele.XAxisMember,
                      value: parseInt(ele.Holdings),
                    });
                    this.pnlAlloc.push([
                      ele.XAxisMember,
                      parseFloat(ele.UnRealizedPnL),
                    ]);
                  });

                  console.log(this.assetAlloc, this.pnlAlloc);
                  if (
                    this.assetAlloc.length === 0 ||
                    this.pnlAlloc.length === 0
                  ) {
                    this.popuperror = 'No data found.';
                    this.noDataFlag = true;
                  } else {
                    this.noDataFlag = false;
                    this.popuperror = '';
                  }
                }
              });
              this.isLoading = false;
            }
          }
        }
      });
  }
  getSecurityHoldings() {
    console.log(this.custId, this.selectedfacilityCode, this.baseCCY)
    this.api.getCustPortfolioSecurityHoldings(
      this.custId,
      this.selectedfacilityCode,
      this.baseCCY
    );
  }

  fnRedirectToHomePage() {
    if (this.isUserRM) {
      if (this.homeApi.RediretToHomeBuySellPledge === 'HOME') {
        // Added by Alolika G | 11-02-2022
        this.router.navigate(['/ClientSummary'], {
          queryParams: {
            showDashboard: true,
            custId: this.cif,
            login: this.username,
          },
        });
      } else {
        this.router.navigate(['/ClientSummary'], {
          queryParams: { showPortfolio: true },
        });
      }
    } else {
      // if(this.homeApi.RediretToHomeBuySellPledge === 'HOME') {
      //   this.router.navigate(['/home'], { queryParams: {}});
      // } else {
      // this.router.navigate(['/portfolioallocation'], { queryParams: {}});
        
      // }
      this.location.back(); //  Added by Alolika G | 15-02-2022


    }
  }
}
