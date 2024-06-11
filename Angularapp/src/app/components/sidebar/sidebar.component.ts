import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginApiService } from 'src/app/services/auth/login-api.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthGuardService } from 'src/app/services/auth/auth-guard.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { environment } from 'src/environments/environment';
import { ThemeserviceService } from 'src/app/themeService/themeservice.service';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/services/config.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MenuApiService } from 'src/app/services/menu-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { Title } from '@angular/platform-browser';
import { LanguageService } from '../langService/language.service';
import packageJson from '../../../../package.json';
import { OauthService } from 'src/app/services/oauth/oauth.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() toggleMenuFlag = new EventEmitter<boolean>();
  submenuCollapsed = [];
  hideSideBar = false;
  isProd = environment.production;
  public version :string = "Version " + packageJson.version;
  isKYCdone: any;
  isAccCreated: boolean;
  userId: any;
  loggedInUsername: any;
  loggedAt: any;
  showSidebar: boolean;
  Customerid: any;
  islistactive = false;
  activeTab: any;
  isUserRM: boolean;
  asseturl = environment.asseturl;
  allsidebarMenuList = [];
  sidebarList: any;
  userType: any;
  MenuArray = [];
  customMenu = [];
  sidebarArray = [];
  sidebarData: Subscription;
  GetCustProfiledetailsSubscription: Subscription;
  SubmenuArray = [];
  finalSubpages = [];
  finalArray = [
    {
      Page: '',
      SubPage: [],
    },
  ];

  infoDivFlag : boolean = false;
  currentYear = new Date().getFullYear();
  sidebarNewUser: any;
  selectedSubMenu: any;
  isDemo: boolean;
  isPDFMode: any;
  constructor(
    public loginApi: LoginApiService,
    private readonly oauthApi: OauthService,
    public router: Router,
    public authApi: AuthGuardService,
    public commonApi: CommonApiService,
    public api: WorkflowApiService,
    public themeService: ThemeserviceService,
    public custApi: CustomerApiService,
    public authorApi: AuthService,
    public menuApi: MenuApiService,
    public homeApi: HomeApiService,
    public title: Title,
    public activatedRoute: ActivatedRoute,
    public languageApi: LanguageService,
    public datepipe: DatePipe
  ) {
    this.activeTab = ''; //FIN1EURINT-580 | Changed by Rohit T. 
    this.loggedAt = '';
    this.SubmenuArray = [];
    this.MenuArray = [];
    this.sidebarList = [];
    this.userType = '';
    this.isUserRM = false;
    this.isKYCdone = false;
    this.isAccCreated = false;
    this.sidebarNewUser = {};
    this.allsidebarMenuList = [];
    this.selectedSubMenu = '';
    this.isDemo = AppConfig.settings.CSP_IsDemo;
  }

  async ngOnInit() {
    const response : any = await this.oauthApi.getUserData();
    AppConfig.settings.oRes = response;  
    this.userType = sessionStorage.getItem('UserType');
    this.userId =  AppConfig.settings.oRes.userID;
    this.loggedInUsername = AppConfig.settings.oRes.userName;
    this.commonApi.showPDFMode.subscribe((res) => {
      this.isPDFMode = res;
    });
    this.router.events.subscribe((route) => {
      //console.log(this.selectedSubMenu);

      if (route instanceof NavigationEnd) {
        console.log(route.url);
        const navigatedMenu = this.MenuArray.find((m) => {
          let path =
            m.router.replace(/\//g, '') === route.url.replace(/\//g, '');
          if (!path) {
            path = m.SubMenu?.find(
              (s) =>
                s.router.replace(/\//g, '') === route.url.replace(/\//g, '')
            );
          }
          return path;
        });
        if (navigatedMenu === undefined) return;
        const navigatedSubMenu = navigatedMenu.SubMenu.find(
          (s) => s.router.replace(/\//g, '') === route.url.replace(/\//g, '')
        );
        this.activeTab = navigatedMenu.menu;
        this.setTitle(navigatedMenu, navigatedSubMenu);
      }
    });

    this.commonApi.hideMenuObs.subscribe((res) => {
      this.hideSideBar = res;
      this.MenuArray.forEach((m) => {
        m.isCollapsed = true;
      });
      //console.log('Menu collapsed', res);
    });

   // this.loggedInUsername = sessionStorage.getItem('Username');
    try {
      this.isKYCdone = sessionStorage.getItem('isClientKYCDone');
    } catch (ex) {
      this.isKYCdone = 'false';
      // console.log(
      //   'Error occured in Sidebar while loading KYC done or not as :',
      //   ex
      // );
    }

    if (sessionStorage.getItem('LoggedAt')) {
      const loginTime = sessionStorage.getItem('LoggedAt');
      this.loggedAt = new Date(
        parseInt(loginTime.substring(6, loginTime.length - 7), 10)
      ) ;
      //console.log(this.loggedAt);
    }
    else{
      const loginTime = AppConfig.settings.oRes.previousLoginTime;
      // this.loggedAt = new Date(
      //   parseInt(loginTime.substring(6, loginTime.length - 7), 10)
      // );
      this.loggedAt = this.datepipe.transform(new Date(loginTime),"MMM d, y, h:mm:ss a").toString();
      //console.log(this.loggedAt);
    }
    try {
      if (this.isKYCdone.toUpperCase() === 'FALSE') {
        this.userType = 'NEWUSER';
        sessionStorage.setItem('UserType', this.userType);
      } else {
        sessionStorage.setItem('UserType', this.userType);
      }
    } catch (Ex) { }
    //for RM dashboard statements
    // if (sessionStorage.getItem('UserType') === 'SelectedUser') {
      this.userType = 'RM';
    // }
   // this.userType = sessionStorage.getItem('UserType');
    this.sidebarUpdate(this.userType);
    this.languageApi.translate.onLangChange.subscribe((res) => {
      this.languageApi.currTranslations = res;
      this.updateMenuBylanguage();
    });
    this.languageApi.translate.onDefaultLangChange.subscribe((res) => {
      this.languageApi.currTranslations = res;
      this.updateMenuBylanguage();
    });
    this.custApi.updateSidebarOBS.subscribe((res) => {
      if (res !== '') {
        this.sidebarUpdate(res);
      }
    });
  }
  
  async sidebarUpdate(userType) {
    try {
      this.isKYCdone = sessionStorage.getItem('isClientKYCDone');
    } catch (ex) {
      this.isKYCdone = false;
      console.log(
        'Error occured in Sidebar while loading KYC done or not as :',
        ex
      );
    }
    if (sessionStorage.getItem('LoggedAt')) {
      const loginTime = sessionStorage.getItem('LoggedAt');
      this.loggedAt = new Date(
        parseInt(loginTime.substring(6, loginTime.length - 7), 10)
      );
      //console.log(this.loggedAt);
    }
    else{
      const loginTime = AppConfig.settings.oRes.previousLoginTime;
      // this.loggedAt = new Date(
      //   parseInt(loginTime.substring(6, loginTime.length - 7), 10)
      // );
      this.loggedAt = this.datepipe.transform(new Date(loginTime),"MMM d, y, h:mm:ss a").toString();
      //console.log(this.loggedAt);
    }
    if (!['RM', 'DEALER'].includes(userType)) {
      if (this.isKYCdone.toUpperCase() === 'FALSE') {
        this.userType = 'NEWUSER';
        sessionStorage.setItem('UserType', this.userType);
      } else {
        sessionStorage.setItem('UserType', this.userType);
      }
    }
    var res:any = await this.menuApi.GetSidebar(AppConfig.settings.oRes.groupID);
    //this.menuApi.GetSidebar(userType).subscribe((res) => {
      if (res) {
        this.allsidebarMenuList = res;
        // this.getFXDMenuList(); //Added by UrmilaA | 25-July-23
        this.MenuArray = [];
        this.SubmenuArray = [];
        this.allsidebarMenuList.forEach((ele) => {

          const isSubMenu =
            this.allsidebarMenuList.filter((s) => s.Menu).length > 0
              ? true
              : false;
          if (ele.Submenu === '-') {
            
            this.MenuArray.push({
              menu: ele.Menu,
              router: ele.RouterLink,
              icon: ele.Icon,
              isSubMenu,
              position: ele.Position,
              isCollapsed: true,
            });
            this.submenuCollapsed.push(true);
          }
          // debugger
          // Start - added by Ketan S
          // if(ele.Submenu === 'EQC Flexi Pricer'){
          //   ele.Menu = 'EQC';
          // }
          // END - added by Ketan S
          if (ele.Submenu !== '-') {
            this.SubmenuArray.push({
              menu: ele.Menu,
              submenu: ele.Submenu,
              router: ele.RouterLink,
              position: ele.Position,
            });
          }
        });
        // this.MenuArray.push({
        //     menu: 'Workflow',
        //     router: 'wfblotter',
        //     icon: 'workflow-icon',
        //     isSubMenu :false,
        //     position: '90',
        //     isCollapsed: true,
        //   });
        // this.MenuArray.push({
        //   menu: 'Timeline',
        //   router: 'Timeline',
        //   icon: 'workflow-icon',
        //   isSubMenu :false,
        //   position: '90',
        //   isCollapsed: true,
        // });
        this.MenuArray.map((m) => {
          // console.log(this.SubmenuArray.filter(s => s.menu === m.menu)[0].router);
          m.SubMenu = this.SubmenuArray.filter((s) => s.menu === m.menu);
          m.router =
            m.SubMenu.length > 0
              ? this.SubmenuArray.filter((s) => s.menu === m.menu)[0].router
              : m.router;
          m.isSubMenu = this.SubmenuArray.map((s) => s.menu).includes(m.menu);
          m.isCollapsed = false; //Added by Apurva K for FIN1EURINT-252|| 26-Apr-2023
        });
        this.menuApi.mainMenuArr = this.MenuArray;
        this.menuApi.subMenuArr = this.SubmenuArray;
       
      
        this.MenuArray = this.MenuArray.sort((a: any, b: any) => {
          const positionA = parseInt(a.Position + '', 10);
          const positionB = parseInt(b.Position + '', 10);
          return positionA < positionB ? -1 : positionA > positionB ? 1 : 0;
        });

        
        
        this.SubmenuArray = this.SubmenuArray.sort((a: any, b: any) => {
          const positionA = parseInt(a.Position + '', 10);
          const positionB = parseInt(b.Position + '', 10);
          console.log(
            'in sidebar ts',
            positionA < positionB ? -1 : positionA > positionB ? 1 : 0
          );
          return positionA < positionB ? -1 : positionA > positionB ? 1 : 0;
        });

        this.updateMenuBylanguage();

        this.activeTab = this.MenuArray[0].menu;
        this.setTitle(this.MenuArray[0]);
        // this.router.navigate([this.MenuArray[0].router]);
	// Changed by RajeshC on 09-Oct-2023 to open UCP deal entry in new tab 
       var url = location.href;
       if(url.indexOf("ucpdealentry") !== -1){
        console.log("INUCPDEALENTRY")
        //this.router.navigate(["app/ucpdealentry"]);
       }
       else{
        this.router.navigate(["app/".concat(this.MenuArray[0].router)], {
          state: {pageTitle: (this.MenuArray[0].SubMenu[0]?.translatedSubmenu ?? this.MenuArray[0].translatedSubmenu)}});//Added by Varsha G || FIN1EURINT-299, FIN1EURINT-508(4) || 09-May-2023
       }
      }else{
        this.router.navigate(["app/noappaccess"]);
      }
    this.allsidebarMenuList = [];
    this.themeService.themeObs.subscribe((_themeres) => {
      console.log(this.themeService.isdarkTheme());
    });
  }
  updateMenuBylanguage() {
    this.MenuArray.forEach((m) => {
      m.translatedMenu = this.languageApi.translatePipe.transform(
        m.menu,
        this.languageApi.currTranslations
      );
    });
    this.SubmenuArray.forEach((sm) => {
      sm.translatedSubmenu = this.languageApi.translatePipe.transform(
        sm.submenu,
        this.languageApi.currTranslations
      );
    });
  }

  logout() {
    let SessionToken: any = '';
    if (sessionStorage.getItem('Username')) {
      this.loggedInUsername = AppConfig.settings.oRes.userName; 
      SessionToken = sessionStorage.getItem('SessionToken');
    }
    this.custApi.getCheckedMenu.next([]);
    console.log(SessionToken);
    this.isKYCdone = false;
    this.isAccCreated = false;
    this.custApi.getCustAccountDetailsObserver.next([]);
    this.custApi.KYCriskRating.next({});
    this.api.portfolio.next([]);
    this.loginApi
      .LogoutUser(this.loggedInUsername, SessionToken, this.authorApi.EntityID)
      .subscribe((res) => {
        if (res) {
          console.log(res);

          // this.themeService.setActiveTheme(dark);

          if (res.LoggedOut) {
            this.title.setTitle('Gateway Markets');
            sessionStorage.clear();
            this.loginApi.allowAuth(false);
            this.router.navigate(['/welcome']);
            this.homeApi.reset();
          } else {
            this.title.setTitle('Gateway Markets');
            console.log('Logout Failed');
            sessionStorage.clear();
            this.loginApi.allowAuth(false);
            this.router.navigate(['/welcome']);
          }
        }
      });
  }

  navigate() {
    this.router.navigate(['home']);
  }

  toggleMenu(id) {
    switch (id) {
      case 1:
        this.activeTab = this.activeTab === 1 ? 0 : 1;
        break;
      case 2:
        this.activeTab = this.activeTab === 2 ? 0 : 2;
        break;
      case 3:
        this.activeTab = this.activeTab === 3 ? 0 : 3;
        break;
      case 4:
        this.activeTab = this.activeTab === 4 ? 0 : 4;
        break;
      case 5:
        this.activeTab = this.activeTab === 5 ? 0 : 5;
        break;
      case 6:
        this.activeTab = this.activeTab === 6 ? 0 : 6;
        break;
      case 7:
        this.activeTab = this.activeTab === 7 ? 0 : 7;
        break;
      case 8:
        this.activeTab = this.activeTab === 8 ? 0 : 8;
        break;
      case 9:
        this.activeTab = this.activeTab === 9 ? 0 : 9;
        break;
      case 10:
        this.activeTab = this.activeTab === 10 ? 0 : 10;
        break;
      case 11:
        this.activeTab = this.activeTab === 11 ? 0 : 11;
        break;
      case 12:
        this.activeTab = this.activeTab === 12 ? 0 : 12;
        break;
      default:
        this.activeTab = 0;
        break;
    }
  }

  setactivetab(ch) {
    switch (ch) {
      case 'amf':
        this.commonApi.setActiveNewOrderEntry('amf');

        break;
      case 'mf':
        this.commonApi.setActiveNewOrderEntry('mf');

        break;
      case 'bonds':
        this.commonApi.setActiveNewOrderEntry('bonds');

        break;
      case 'shares':
        this.commonApi.setActiveNewOrderEntry('shares');

        break;
      case 'fd':
        this.commonApi.setActiveNewOrderEntry('fd');

        break;
      case 'insurance':
        this.commonApi.setActiveNewOrderEntry('insurance');
        break;
      case 'PolicyDetails':
        this.router.navigate(['policy']);
        break;
      case 'PremiumCalendar':
        // this.router.navigate(['home']);

        break;
      case 'PaymentHistory':
        this.router.navigate(['paymenthistory']);
        break;

      case 'loan':
        this.commonApi.setActiveNewOrderEntry('loan');
        break;

      case 'overdraft':
        this.commonApi.setActiveNewOrderEntry('overdraft');
        break;
      default:
        break;
    }
  }
  uncheck() {
    const element = document.getElementById('hamburger') as HTMLInputElement;
    element.checked = false;
  }

  selectUserType() {
    // this.sidebarList = this.allsidebarMenuList;
    switch (this.userType.toUpperCase()) {
      case 'CLIENT':
        this.activeTab = 'Home';
        this.router.navigate(['/home']);
        break;
      case 'RM':
        this.activeTab = 'Client';
        this.router.navigate(['/validateUser/2']);
        break;
      case 'EMPLOYER':
        this.activeTab = 'Home';
        this.router.navigate(['/neworderentry/amfunds']);
        break;
      case 'NEWUSER':
        this.activeTab = 'Client';
        this.router.navigate(['/validateUser/1']);
        break;
      case 'ADMIN':
        this.activeTab = 'Admin';
        this.router.navigate(['Menu']);
        break;
      default:
        this.activeTab = 'Home';
        break;
    }
  }

  toggleSideBar() {
    this.hideSideBar = !this.hideSideBar;
    
    // this.toggleMenuFlag.emit(this.hideSideBar);
    this.commonApi.HideSidebar(this.hideSideBar);
  }
  clearInputs() { }
  collapse(i) {
    
    this.MenuArray[i].isCollapsed = !this.MenuArray[i].isCollapsed;
    // this.submenuCollapsed[i] = !this.submenuCollapsed[i];
  }
  setTitle(menu, submenu?: any) {
    this.homeApi.RMWlink = ''; //Added to clear filters on page navigation

    let title = 'Gateway Markets';
    if (submenu === undefined) {
      let title = menu.menu;
      this.title.setTitle(title);
      return;
    }
    title = submenu?.menu + ' - ' + submenu?.submenu;
    this.title.setTitle(title);
  }
  openProfile() {
    if (this.userType.toUpperCase() === 'CLIENT') {
      this.activeTab = 'Client';
      this.router.navigate(['/customersetupview']);
    }
  }

   //added for developement purpose , will remove after page registration done | by UrmilaA | 25-July-23 | start
  //  getFXDMenuList(){
  //   this.allsidebarMenuList.push(   
  //     {
  //       Menu: "EuroConnect",
  //       Submenu: "FXD",
  //       RouterLink: "fxdconnect", //gatewaymaple/fxd
  //       Icon: "",
  //       DisplayYN: "Y",
  //       Position: "0",
  //       isCollapsed: false
  //     },
    
  //   );
  // }
  //added by UrmilaA | 25-July-23 | ends

//Added by SandipA @08-Dec-23 for Third Party & Open Source Acknowledgment Note || Start
Disclaimer() {
  this.infoDivFlag = true;
}
closeDisclaimer(){
  this.infoDivFlag = false;
}
//Added by SandipA @08-Dec-23 for Third Party & Open Source Acknowledgment Note || End

}
