import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../../../services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-neworderentry',
  templateUrl: './neworderentry.component.html',
  styleUrls: ['./neworderentry.component.scss'],
})
export class NeworderentryComponent implements OnInit, OnDestroy {
  showamf: boolean;
  showmf: boolean;
  showbonds: boolean;
  showshares: boolean;
  showfd: boolean;
  constval: any;
  showinsurance: boolean;
  showfxspot: boolean;
  showpledge: boolean;
  showfundtransfer: boolean;
  showStructuredNotes: boolean;
  showFundSwitch: boolean;
  IsBackButtonEnabled: boolean;
  SideBar = [];
  userType: string;
  sidebarData: Subscription;
  SubmenuArray = [];
  LoginID: string = '';
  //   subpages: [
  //     {
  //       name: 'AM Funds',
  //       displayYN: true
  //     },
  //     {
  //       name: 'Funds',
  //       displayYN: true
  //     },
  //     {
  //       name: 'Bonds',
  //       displayYN: true
  //     },
  //     {
  //       name: 'Shares',
  //       displayYN: true
  //     },
  //     {
  //       name: 'Fixed Deposit',
  //       displayYN: true
  //     },
  //     {
  //       name: 'Insurance',
  //       displayYN: true
  //   },
  //   {
  //     name: 'FX Spot',
  //     displayYN: true
  // }
  //   ]
  subpages = [
    {
      name: 'AM Funds',
      displayYN: 'false',
    },
    {
      name: 'Funds',
      displayYN: 'false',
    },
    {
      name: 'Bonds',
      displayYN: 'false',
    },
    {
      name: 'Shares',
      displayYN: 'false',
    },
    {
      name: 'Fixed Deposit',
      displayYN: 'false',
    },
    {
      name: 'Insurance',
      displayYN: 'false',
    },
    {
      name: 'FX Spot',
      displayYN: 'false',
    },
    {
      name: 'Pledge',
      displayYN: 'false',
    },
    {
      name: 'Fund Transfer',
      displayYN: 'false',
    },
    {
      name: 'Structured Notes',
      displayYN: 'false',
    },
    {
      name: 'Fund Switch',
      displayYN: 'false',
    },
  ];
  isUserRM: boolean;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public afs: CustomerApiService,
    public wfs: WorkflowApiService,
    public authorApi: AuthService,
    public location: Location,
    public HomeAPI: HomeApiService
  ) {
    this.showamf = false;
    this.showmf = true;
    this.showbonds = false;
    this.showshares = false;
    this.showfd = false;
    this.showinsurance = false;
    this.showfxspot = false;
    this.showfundtransfer = false;
    this.showStructuredNotes = false;
    this.showFundSwitch = false;
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this.subpages = [];
  }

  ngOnInit(): void {
    this.LoginID = sessionStorage.getItem('Username');
    this.userType = sessionStorage.getItem('UserType');
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    this.IsBackButtonEnabled =
      this.HomeAPI.RediretToHomeBuySellPledge === '' ? false : true;

    if (this.userType === 'rm') {
      this.userType = 'RM';
    } else if (this.userType === 'client') {
      this.userType = 'Client';
    }
    if (this.userType === 'RM' || this.userType === 'Client') {
      this.wfs.loadFunds();
      this.wfs.loadMutualFunds();
      this.wfs.GetShareList('');
      this.wfs.getbondslist(this.LoginID, '', this.authorApi.EntityID);
    }

    this.afs.GetSidebar(this.userType).subscribe((res) => {
      if (res.length !== 0) {
        this.SideBar = res;
        this.SideBar.forEach((ele) => {
          if (ele.Submenu === '-') {
          }
          if (ele.Submenu !== '-') {
            this.SubmenuArray.push({
              menu: ele.Menu,
              submenu: ele.Submenu,
              router: ele.RouterLink,
            });
          }
        });

        this.SubmenuArray.forEach((ele) => {
          if (ele.menu === 'New Investments') {
            this.subpages.forEach((page) => {
              if (ele.submenu.toUpperCase() === page.name.toUpperCase()) {
                page.displayYN = 'true';
              }
            });
          }
        });
        console.log(this.subpages);
      }
    });

    this.route.params.subscribe((params) => {
      // console.log(params);
      if (params.orderType) {
        this.showamf = false;
        this.showmf = false;
        this.showbonds = false;
        this.showshares = false;
        this.showfd = false;
        this.showinsurance = false;
        this.showfxspot = false;
        this.showpledge = false;
        this.showfundtransfer = false;
        this.showStructuredNotes = false;
        this.showFundSwitch = false;

        switch (params.orderType.toUpperCase()) {
          case 'AMFUNDS':
            this.showamf = true;
            if (this.userType.toUpperCase() === 'CLIENT') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'AMFUNDS')
                .map((s: any) => (s.displayYN = 'true'));
            } else if (this.userType.toUpperCase() === 'RM') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'AMFUNDS')
                .map((s: any) => (s.displayYN = 'true'));
            }
            break;
          case 'FUNDS':
            this.showmf = true;

            if (this.userType.toUpperCase() === 'CLIENT') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'FUNDS')
                .map((s: any) => (s.displayYN = 'true'));
            } else if (this.userType.toUpperCase() === 'RM') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'FUNDS')
                .map((s: any) => (s.displayYN = 'true'));
            }
            break;
          case 'BONDS':
            this.showbonds = true;

            if (this.userType.toUpperCase() === 'CLIENT') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'BONDS')
                .map((s: any) => (s.displayYN = 'true'));
            } else if (this.userType.toUpperCase() === 'RM') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'BONDS')
                .map((s: any) => (s.displayYN = 'true'));
            }

            break;
          case 'SHARES':
            this.showshares = true;
            if (this.userType.toUpperCase() === 'CLIENT') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'SHARES')
                .map((s: any) => (s.displayYN = 'true'));
            } else if (this.userType.toUpperCase() === 'RM') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'SHARES')
                .map((s: any) => (s.displayYN = 'true'));
            }
            break;
          case 'FIXEDDEPOSIT':
            this.showfd = true;
            if (this.userType.toUpperCase() === 'CLIENT') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'FIXED DEPOSIT')
                .map((s: any) => (s.displayYN = 'true'));
            } else if (this.userType.toUpperCase() === 'RM') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'FIXED DEPOSIT')
                .map((s: any) => (s.displayYN = 'true'));
            }
            break;
          case 'INSURANCE':
            this.showinsurance = true;
            if (this.userType.toUpperCase() === 'CLIENT') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'INSURANCE')
                .map((s: any) => (s.displayYN = 'true'));
            } else if (this.userType.toUpperCase() === 'RM') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'INSURANCE')
                .map((s: any) => (s.displayYN = 'true'));
            }
            break;
          case 'FXSPOT':
            this.showfxspot = true;
            if (this.userType.toUpperCase() === 'CLIENT') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'FXSPOT')
                .map((s: any) => (s.displayYN = 'true'));
            } else if (this.userType.toUpperCase() === 'RM') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'FXSPOT')
                .map((s: any) => (s.displayYN = 'true'));
            }
            break;

          case 'PLEDGE':
            this.showpledge = true;
            if (this.userType.toUpperCase() === 'CLIENT') {
              sessionStorage.setItem('PledgePageMode', '0');
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'PLEDGE')
                .map((s: any) => (s.displayYN = 'true'));
            } else if (this.userType.toUpperCase() === 'RM') {
              sessionStorage.setItem('PledgePageMode', '1');
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'PLEDGE')
                .map((s: any) => (s.displayYN = 'true'));
            }
            break;
          case 'FUNDTRANSFER':
            this.showfundtransfer = true;
            if (this.userType.toUpperCase() === 'CLIENT') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'FUND TRANSFER')
                .map((s: any) => (s.displayYN = 'true'));
            } else if (this.userType.toUpperCase() === 'RM') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'FUND TRANSFER')
                .map((s: any) => (s.displayYN = 'true'));
            }
            break;
          case 'STRUCTUREDNOTES':
            this.showStructuredNotes = true;
            if (this.userType.toUpperCase() === 'CLIENT') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'STRUCTUREDNOTES')
                .map((s: any) => (s.displayYN = 'true'));
            } else if (this.userType.toUpperCase() === 'RM') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'STRUCTUREDNOTES')
                .map((s: any) => (s.displayYN = 'true'));
            }
            break;

          case 'SWITCHFUND':
            this.showFundSwitch = true;
            if (this.userType.toUpperCase() === 'CLIENT') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'FUND SWITCH')
                .map((s: any) => (s.displayYN = 'true'));
            } else if (this.userType.toUpperCase() === 'RM') {
              this.subpages
                .filter((s: any) => s.name.toUpperCase() === 'FUND SWITCH')
                .map((s: any) => (s.displayYN = 'true'));
            }
            break;

          default:
            this.showamf = true;
            break;
        }
      }
    });

    // this.cfs.getactivetabObserver.subscribe((res: any) => {
    //   if (res) {
    //     //console.log(res);
    //     this.changeProduct(res);
    //   }
    // });
  }

  fnRedirectToHomePage() {
    if(!this.isUserRM) {     //Changes done by Alolika G | 11-02-2022
      // if (this.HomeAPI.selectedPage === 'HOME') {
      //   if (this.HomeAPI.RediretToHomeBuySellPledge === 'HOME') {
      //     //Changes done by Alolika G on 3rd Feb 2022. (JIRA - STANHCINT-599)
      //     this.router.navigate(['/home']);
      //   } else {
      //     this.HomeAPI.openPopup = true;
      //     this.router.navigate(['/home']);
      //   }
      // } else {
      //   if (this.HomeAPI.RediretToHomeBuySellPledge === 'HOME') {
      //     this.router.navigate(['/home']);
      //   } else {
      //     this.router.navigate(['/portfolioallocation']);
      //   }
      // }
    this.location.back();

    } else {
      if (this.HomeAPI.selectedPage === 'HOME') {
        if (this.HomeAPI.RediretToHomeBuySellPledge === 'HOME') {
          //Changes done by Alolika G on 3rd Feb 2022. (JIRA - STANHCINT-599)
          this.router.navigate(['/ClientSummary'], 
          { queryParams: {
              showDashboard: true,
              custId: sessionStorage.getItem("RMCustID"),
              login: sessionStorage.getItem("RMUser")
            }
          });
        } else {
          this.HomeAPI.openPopup = true;
          // this.router.navigate(['/portfolioallocation'], { queryParams: {}});
          this.location.back();

        }
      } else {
        if (this.HomeAPI.RediretToHomeBuySellPledge === 'HOME') {
          this.router.navigate(['/ClientSummary'], { queryParams: {showDashboard: true,custId: sessionStorage.getItem("RMCustID"),
          login: sessionStorage.getItem("RMUser")}});
        } else {
          // this.router.navigate(['/portfolioallocation'], { queryParams: {}});
          this.location.back(); //  Added by Alolika G | 15-02-2022

        }
      }
    }

  }

  changeProduct(choice) {
    this.showamf = false;
    this.showmf = false;
    this.showbonds = false;
    this.showshares = false;
    this.showfd = false;
    this.showinsurance = false;
    this.showfxspot = false;
    this.showpledge = false;
    this.showfundtransfer = false;
    this.showStructuredNotes = false;
    this.showFundSwitch = false;

    switch (choice) {
      case 'af':
        this.showamf = true;
        this.router.navigate(['/neworderentry/AMFUNDS']);
        break;
      case 'mf':
        this.showmf = true;
        this.router.navigate(['/neworderentry/FUNDS']);
        break;
      case 'bonds':
        this.showbonds = true;
        this.router.navigate(['/neworderentry/BONDS']);
        break;
      case 'shares':
        this.showshares = true;
        this.router.navigate(['/neworderentry/SHARES']);
        break;
      case 'fd':
        this.showfd = true;
        this.router.navigate(['/neworderentry/FIXEDDEPOSIT']);
        break;
      case 'insurance':
        this.showinsurance = true;
        this.router.navigate(['/neworderentry/INSURANCE']);
        break;
      case 'fxspot':
        this.showfxspot = true;
        this.router.navigate(['/neworderentry/FXSPOT']);
        break;
      case 'pledge':
        this.showpledge = true;
        this.router.navigate(['/neworderentry/PLEDGE']);
        break;
      case 'fundtransfer':
        this.showpledge = true;
        this.router.navigate(['/neworderentry/FUNDTRANSFER']);
        break;
      case 'structurednotes':
        this.showStructuredNotes = true;
        this.router.navigate(['/neworderentry/STRUCTUREDNOTES']);
        break;
      case 'switchfund':
        this.showFundSwitch = true;
        this.router.navigate(['/neworderentry/SWITCHFUND']);
        break;

      default:
        this.showamf = true;
        this.router.navigate(['/neworderentry/AMFUNDS']);
        break;
    }
  }
}
