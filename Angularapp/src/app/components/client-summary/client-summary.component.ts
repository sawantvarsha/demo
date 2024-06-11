import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { WorkflowApiService } from '../../services/workflow-api.service';
import { CustomerApiService } from '../../services/customer-api.service';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';
import { CommonApiService } from '../../services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeApiService } from 'src/app/services/home-api.service';
import { CommonfunctionService } from '../fx-order/commonfunction.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-client-summary',
  templateUrl: './client-summary.component.html',
  styleUrls: ['./client-summary.component.scss'],
})
export class ClientSummaryComponent implements OnInit, OnDestroy {
  ClientSummaryResult: any[] = [];
  loader: boolean;
  isProd = environment.production;
  RM: any;
  showDashboard = false;
  showProfile = false;
  showPortfolio = false;
  showCreditSummary = false;
  showPortfolioDetails = false;
  showAccount = false;
  showReport = false;
  showStatements = false;
  searchName: string; //Added by Ketan S on 15-Sep-21 asked by Parikshit Sir
  baseCCY: string;
  selectedCustomer: {};
  custID: any;
  login: any;
  viewDetailedProfile: boolean = false;
  clientDetails_: any;
  isChecked: boolean = false;
  baseCCYSubcription: Subscription;
  portfolioDetails: any[] = [];
  filteredArray = [];
  assetAlloc: any;
  pnlAlloc: (string | number)[][];
  legends: { name: string; data: number[] }[];
  gridFlag: boolean;
  showGrid: boolean;
  colors: string[];
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.showDashboard = false;
    this.showProfile = false;
    this.showPortfolio = false;
    this.showCreditSummary = false;
    this.showPortfolioDetails = false;
    this.showAccount = false;
    this.showReport = false;
    this.showStatements = false;
  }
  constructor(
    public api: WorkflowApiService,
    public authorApi: AuthService,
    public cfs: CommonApiService,
    public router: Router,
    public custapi: CustomerApiService,
    public homeApi: HomeApiService,
    public activatedRoute: ActivatedRoute,
    public com: CommonfunctionService,
    public ref: ChangeDetectorRef
  ) {
    this.searchName = '';
    this.isChecked = false;
    this.showGrid = false;
  }

  ngOnDestroy() {
    sessionStorage.setItem('UserType', 'RM');
  }
  CustomerNameFlag: any = false;

  ngOnInit(): void {
    // this.baseCCY = AppConfig.settings.BankBaseCCy;
    // sessionStorage.setItem('BankBaseCcy', this.baseCCY);
    this.loader = true;
    this.custapi.getBankBaseCCYOBS.subscribe((ccy) => {
      this.baseCCY = ccy;
      this.getClientSummary(); //Changes done by Alolika G | 11-02-2022
      // this.api
      //   .GetClientSummary(
      //     this.authorApi.EntityID,
      //     this.authorApi.UserName,
      //     this.baseCCY
      //   )
      //   .subscribe((res) => {
      //     if (res.length !== 0) {
      //       let data = [];
      //       data = JSON.parse(res.GetRMPortalClientSummary_LCYEResult);
      //       console.log(data);
      //       this.ClientSummaryResult = data.sort((a, b) =>
      //         a.LongName > b.LongName ? 1 : -1
      //       );
      //       this.homeApi.CustomerMappedToRM = this.ClientSummaryResult;
      //       this.loader = false;
      //     }
      //   });
    });

    //Changes done by Alolika G on 10-02-2022 as told by Mohan P
    this.activatedRoute.queryParams.subscribe((res) => {
      this.showPortfolio = res.showPortfolio;
      if (res.showDashboard) {
        this.showPortfolio = false;
        this.showDashboard = true;
        this.getClientSummary();
        this.custID = res.custId;
        this.login = res.login;
      }
    });
  }

  //Added by Alolika G | 11-02-2022
  getClientSummary() {
    try {
      this.api
        .GetClientSummary(
          this.authorApi.EntityID,
          this.authorApi.UserName,
          this.baseCCY
        )
        .subscribe((res) => {
          if (res.length !== 0) {
            let data = [];
            data = JSON.parse(res.GetRMPortalClientSummary_LCYEResult);
            // console.log(data);
            this.ClientSummaryResult = data.sort((a, b) =>
              a.LongName > b.LongName ? 1 : -1
            );
            this.homeApi.CustomerMappedToRM = this.ClientSummaryResult;
            this.loader = false;
            if (this.showDashboard) {
              this.callDashboard('', this.custID, this.login);
            }
            // Do not remove :-
            // this.ClientSummaryResult.forEach(element => {
            //   this.loadPortfolioAllocation(element);
            // });
            this.ClientSummaryResult.forEach((element, i) => {
              this.ClientSummaryResult[i].index = i;
              this.getCustomerPortfolio(element.CustomerID, i);
            });
            // this.getChartData();
          }
          // console.log(this.ClientSummaryResult);
        });
    } catch (error) {}
  }

  toggle() {
    // this.isChecked = !this.isChecked;
    // console.log(this.isChecked);
    this.showGrid = this.isChecked;
    // if (!this.isChecked) {
    //   this.showGrid = true;
    // } else {
    //   this.showGrid = false;
    // }
    this.ref.detectChanges();
  }
  portfolioChange(value, item, index) {
    try {
      // console.log("value", value.target.value);
      // console.log("item", item);
      // console.log("index", index);
      this.loadPortfolioAllocation(item, index, value.target.value);
    } catch (error) {}
  }
  getCustomerPortfolio(custID, index) {
    try {
      this.api.GetPortfoliosFromCusID(custID, this.baseCCY).subscribe((res) => {
        if (res) {
          this.ClientSummaryResult[index].portfolio =
            res.DB_GetPortfoliosResult;
          // console.log("portfolios", this.ClientSummaryResult);
          this.loadPortfolioAllocation(
            this.ClientSummaryResult[index],
            index,
            this.ClientSummaryResult[index].portfolio[0]?.FacDesc
          );
        }
      });
    } catch (error) {}
  }
  getChartData() {
    this.colors = ['#d23f31', '#0f9d55'];
    this.gridFlag = true;
    this.legends = [
      {
        name: 'PnL',
        data: [0],
      },
      {
        name: '',
        data: [0],
      },
    ];
    this.assetAlloc = [
      {
        title: 'Equities',
        value: 2967812.24,
      },
      {
        title: 'Fixed Income',
        value: 14901889.29,
      },
      {
        title: 'Mutual Funds',
        value: 18990733.4,
      },
      {
        title: 'Cash',
        value: 191983890.01,
      },
    ];
    let pnlAlloc: any[] = [
      ['Mutual Funds', 613854.693349894],
      ['Equities', 159997.896879481],
      ['Cash', 0],
      [
        'Fixed Income',
        -121922.713236,
        //-251922.713236
      ],
    ];
    let chartdata = [];
    // pnlAlloc.forEach((element) => {
    //   chartdata.push([
    //     // 'MF',
    //     // 2000.0,
    //     // 2000.0
    //     element.SchemeName,
    //     parseFloat(element.GroupAmount),
    //     parseFloat(element.GroupTarget),
    //   ]);
    // });
    // console.log(chartdata)
    this.pnlAlloc = pnlAlloc.filter(
      (thing, index, self) =>
        index ===
        self.findIndex((t) => JSON.stringify(t) === JSON.stringify(thing))
    );
    // console.log("this.pnlAlloc", this.pnlAlloc);
  }
  loadPortfolioAllocation(element, index, portfolio) {
    try {
      this.colors = ['#d23f31', '#0f9d55'];
      this.gridFlag = true;
      this.legends = [
        {
          name: 'PnL',
          data: [0],
        },
      ];
      this.homeApi
        .GetAUMandPNL(
          element.CIF,
          element.UserLogin,
          'ASSETCLASS',
          this.custapi.bankBaseCCY,
          portfolio.length > 0 ? portfolio : null
        )
        .subscribe((resAUM) => {
          if (resAUM.length !== 0) {
            let client = resAUM.ResponseBody.ClientWiseHoldings;
            this.loader = false;
            // this.currency = client.BaseCurrency;
            // this.AUM = client.TotalAUM;
            // this.pnl = client.TotalPnL;
            if (client !== null) {
              this.portfolioDetails = [];
              this.ClientSummaryResult[index].pnlAlloc = [];
              this.ClientSummaryResult[index].assetAlloc = [];
              if (client.ClientwisePortfolioDetails !== null) {
                this.portfolioDetails = client.ClientwisePortfolioDetails;
                this.ClientSummaryResult[index].graphdata =
                  this.portfolioDetails;
                // console.log(this.portfolioDetails);
                // this.totalPortfolioData = [];
                // this.portfolioColumnNames = [];
                // this.portfolioColumnNames.push('');
                // client.ClientwisePortfolioDetails.forEach((element) => {
                //   this.portfolioColumnNames.push(
                //     element.FacilityCode + ' ' + element.TotalAUM + ' USD '
                //   );
                //   this.totalPortfolioData.push({
                //         title: element.PortfolioName,
                //         value: parseFloat(element.TotalAUM),
                //   });
                // });
                let pnlAlloc: any[] = [];
                let assetAlloc: any[] = [];
                this.ClientSummaryResult[
                  index
                ].graphdata[0].AssetDetails.forEach((element) => {
                  pnlAlloc.push([
                    element.XAxisMember + ' (' + this.custapi.bankBaseCCY + ')',
                    parseFloat(element.UnRealizedPnL),
                  ]);
                  assetAlloc.push({
                    title: element.XAxisMember,
                    value: parseFloat(element.Holdings),
                  });
                });
                this.ClientSummaryResult[index].pnlAlloc = pnlAlloc;
                this.ClientSummaryResult[index].pnlAlloc = pnlAlloc.filter(
                  (thing, index, self) =>
                    index ===
                    self.findIndex(
                      (t) => JSON.stringify(t) === JSON.stringify(thing)
                    )
                );
                this.ClientSummaryResult[index].assetAlloc = assetAlloc;
                this.ClientSummaryResult[index].assetAlloc = assetAlloc.filter(
                  (thing, index, self) =>
                    index ===
                    self.findIndex(
                      (t) => JSON.stringify(t) === JSON.stringify(thing)
                    )
                );
                this.ref.detectChanges();
              } else {
                this.ClientSummaryResult[index].pnlAlloc = [];
                this.ClientSummaryResult[index].assetAlloc = [];
              }
              // console.log("this.ClientSummaryResult", this.ClientSummaryResult);
              // this.filteredArray = this.getFilteredArray(
              //   this.portfolioDetails,
              //   (it) => it.FinIQResponseHeader.LoginID
              // );
              // console.log("filteredArray", this.filteredArray);
            } else {
              // this.noDataFlag = true;
            }
            // if (window.innerWidth <= 1477) {
            //   this.options.width = '340';
            //   this.options.height = '180';
            // }
          } else {
            this.ClientSummaryResult[index].pnlAlloc = [];
            this.ClientSummaryResult[index].assetAlloc = [];
          }
        });
    } catch (error) {}
    //Added By Arsh P || End
  }
  getFilteredArray(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }
  callDashboard(custDet, cust, login) {
    this.showPortfolio = false; //Added by Alolika G | 11-02-2022
    if (custDet != '') {
      // console.log('selected customer name', custDet);
      sessionStorage.setItem('selectedCustomerName', custDet.LongName); //change by Ashwini H. on 07 Feb 2022
      sessionStorage.setItem('SelectedCustomerName', custDet.LongName); //change by Mayuri D. on 07 Feb 2022
    }

    this.CustomerNameFlag = true;
    // Added by Mayuri D | 07-Feb-2022
    sessionStorage.setItem('SelectedCustomerName', custDet.LongName);
    sessionStorage.setItem('SelectedCustomerID', custDet.CIF);

    sessionStorage.setItem('ShowCustomerName', this.CustomerNameFlag);
    // Added by Mayuri D | 07-Feb-2022

    const clientDetails = this.ClientSummaryResult.filter(
      (c) => c.CustomerID === custDet.CustomerID
    )[0];
    this.homeApi.freecash = clientDetails['Free Cash'];
    this.homeApi.AUM = clientDetails['AUM'];
    this.homeApi.PNL = clientDetails['PnL'];
    sessionStorage.setItem('RMCustID', cust);

    sessionStorage.setItem('RMUser', login);

    this.selectedCustomer = {
      custName: custDet.LongName,
      custId: cust,
      userName: login,
      cif: custDet.CIF,
    };
  }
  callPortfolio(cust, login, CIF, custname) {
    sessionStorage.setItem('RMUser', login);
    sessionStorage.setItem('RMCustID', cust);
    sessionStorage.setItem('RMCustName', custname);
    sessionStorage.setItem('RMCIF', CIF);
    this.selectedCustomer = {
      //Changes done by Alolika G on 10-02-2022
      custName: custname,
      custId: cust,
      userName: login,
      cif: CIF,
    };
  }
  callCreditSummary(custid, custname, login) {
    sessionStorage.setItem('RMUser', login);
    sessionStorage.setItem('RMCustID', custid);
    sessionStorage.setItem('RMCustName', custname);
    this.selectedCustomer = {
      custName: custname,
      custId: custid,
      userName: login,
    };
  }
  callProfile(login) {
    sessionStorage.setItem('RMUser', login);
  }
  async callPortfolioDetails(custid, custname, login) {
    sessionStorage.setItem('RMUser', login);
    sessionStorage.setItem('RMCustID', custid);
    sessionStorage.setItem('RMCustName', custname);
    let clientDetails: any;
    clientDetails = await this.custapi.GetClientSetupformSavedForFuture(login);

    this.homeApi.NoteMasterID = clientDetails.NoteMasterID;
  }
  callAccount(custid, custname, login) {
    sessionStorage.setItem('RMUser', login);
    sessionStorage.setItem('RMCustID', custid);
    this.selectedCustomer = {
      custName: custname,
      custId: custid,
      userName: login,
    };
  }
  callMPGReport(login, custid, custname) {
    sessionStorage.setItem('RMUser', login);
    sessionStorage.setItem('UserType', 'SelectedUser');
    sessionStorage.setItem('CustomerID', custid);

    sessionStorage.setItem('CustomerName', custname);
  }
  callStatements(custid, custname, login) {
    // let searchFlag = true;
    sessionStorage.setItem('UserType', 'SelectedUser');
    sessionStorage.setItem('RMUser', login);
    sessionStorage.setItem('CustomerID', custid);
    sessionStorage.setItem('CustName', custname);
    // sessionStorage.setItem('custStatementFlag', 'true');
  }

  // closeStatement() {
  //   sessionStorage.setItem('custStatementFlag', '');

  // }
  //test

  // Added by Arsh P on 15-June-2022
  viewProfile(item: any) {
    this.viewDetailedProfile = true;
    this.clientDetails_ = item;
  }
}
