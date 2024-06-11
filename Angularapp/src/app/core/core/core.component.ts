import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Inject,
  HostListener,
} from '@angular/core';
import { LoginApiService } from '../../services/auth/login-api.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonApiService } from '../../services/common-api.service';
import { CustomerApiService } from '../../services/customer-api.service';
import { WorkflowApiService } from '../../services/workflow-api.service';
import { ThemeserviceService } from '../../themeService/themeservice.service';
import { ChartService } from '../../themeService/chart.service';
import { SpInteractiveDataService } from '../../services/sp-interactive-data.service';
import {
  dark,
  light,
  midnight,
  coral,
  stanhope,
  neu_dark,
  neu_light,
  BankTheme_1,
} from '../../themeService/theme.module';
import { RedPallete, pastel, vibrant } from '../../themeService/chart.module';
import { FontService } from '../../fontservice/font.service';
import {
  montserrat,
  opensans,
  biosans,
  roboto,
  client,
} from '../../fontservice/font.module';
import { AppConfig } from '../../services/config.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { HomeApiService } from '../../services/home-api.service';
import { DecimalPipe, DOCUMENT } from '@angular/common';
import { LanguageService } from '../../components/langService/language.service';
import { UtilitiesService } from '../../services/utilities.service';
import { OauthService } from 'src/app/services/oauth/oauth.service';
import { TranslateService } from '@ngx-translate/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core'; //Added for Idle logout || Kaustubh S || 15-Sep-2023
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {

  title = 'ClientSelfServicePortal';
  showSidebar: boolean;
  sideBarCollapsed: string;
  isAccCreated: any;
  isProd = environment.production;
  domainURL = environment.domainURL;
  isKYCdone: boolean;
  loggedInUsername: string;
  Customerid: any;
  api: any;
  isDarktheme: boolean;
  showNotification = false;
  notificationData = [];
  showSettings: boolean = false;
  currentTheme: any;
  currentPalette: any;
  currentFont: any;
  @ViewChild('appSideBar') appSideBar: SidebarComponent;
  RouteParamertesSubscription: Subscription;
  isMenuCollapsed: boolean;
  userType: any;
  displayUserType: any;
  currUserType: string;
  isDemo: boolean;
  entityID: any;
  marketWatch = [];
  isFirstCustomerLogin: boolean;
  menuSubscription: Subscription;
  openPopUp: boolean = false;
  showSupport: boolean = false;
  authSubscription: Subscription;
  marketWatchSubscriber: Subscription;
  isValidateLogout: boolean;
  CompanyLogo: string;
  BankBaseCCY: string;
  CurrencyList: any[];
  showCcy: boolean = false;
  tickerFlag: boolean = false;
  isTickerPaused: boolean;
  selectedIndex = 0;
  allowRouteHistory: boolean;
  showTicker: boolean;
  documentElement: any;
  isFullScreen: boolean;
  showCcyList: boolean;
  CurrencyImage: any;
  openPopUpVideo = false; // Added on 17 Jan 2022
  openPopupNotes = false; // Added on 17 Jan 2022
  openRightNav = false; //Added on 20 Jan 2022
  EQWLFeed: any;
  showPDFMode: boolean;
  languages: any;
  idlePopup: boolean = false; //Added for session idle popup || Kaustubh S || 17-Nov-2023
  idleCountdown: number = null; //Added for session idle popup || Kaustubh S || 17-Nov-2023
  idlePopupCountdown:number = null //Added for session idle popup || Varsha G || 22-Nov-2023
  ShowUCPPopUP: boolean = false; // Added by OnkarE on 09-Oct-2023
  lastUpdatedAt: any; //Added by Apurva K|| 06-Nov-2023|| FSLINT-15
  infromationUpdatedOnTime: any;//Changes done for  FSLINT-15|| 09-Nov-2023|| Apurva K
  logoHiddenForEntity: any;//Changes done for  FSLINT-63|| 20-May-2024|| Apurva K
  homeEntityId: any;//Changes done for  FSLINT-63|| 20-May-2024|| Apurva K
  AppConfigData: any;//Changes done for  FSLINT-63|| 20-May-2024|| Apurva K
  currencies: any[] = [];//Added by Varsha G || User currency preference || FSLINT-64 || 30-May-2024
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeAllPopUps();
    }
  }
  
  constructor(
    private idle: Idle, //Added for Idle logout || Kaustubh S || 15-Sep-2023
    public loginApi: LoginApiService,
    public commonApi: CommonApiService,
    public custApi: CustomerApiService,
    public workflowApi: WorkflowApiService,
    public themeService: ThemeserviceService,
    public chartService: ChartService,
    public fontService: FontService,
    public activatedRoute: ActivatedRoute,
    public authApi: AuthService,
    public homeApi: HomeApiService,
    public decimalPipe: DecimalPipe,
    public router: Router,
    public ref: ChangeDetectorRef,
    private elem: ElementRef,
    public languageApi: LanguageService,
    public utilitiesApi: UtilitiesService,
    private readonly oauthApi: OauthService,
    public translate: TranslateService,
    public datepipe: DatePipe,
    private intDashboard: SpInteractiveDataService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.showSidebar = true;
    this.isKYCdone = false;
    this.isAccCreated = false;
    this.isDarktheme = true;
    this.showSettings = false;
    this.isDemo = AppConfig.settings.CSP_IsDemo;
    this.isMenuCollapsed = false;
    this.isValidateLogout = false;
    this.BankBaseCCY = AppConfig.settings.BankBaseCCy;
    this.isTickerPaused = false;
    this.allowRouteHistory = false;
    this.showTicker = false;
    this.isFullScreen = false;
    this.showCcyList = false;
    this.languages = this.languageApi.getLanguages();
    this.languages = this.languageApi.supportedLanguages;
    this.CurrencyImage = [];
    this.translate.currentLang = 'en'; //added on 02 Dec 2022
    this.translate.use('en'); //ChitraM | 5-May-23 | FIN1EURINT-100
    this.idlePopupCountdown = AppConfig?.settings?.idlePopupCountdown; //Added for session idle popup || Varsha G || 22-Nov-2023
   
    this.lastUpdatedAt = new Date(); //Added by Apurva K|| 06-Nov-2023|| FSLINT-15
    //console.log(this.lastUpdatedAt,"lastUpdatedAt")
   // this.lastUpdatedAt = this.datepipe.transform(new Date(this.lastUpdatedAt),"dd MMM y h:mm").toString();;
    // this.custApi.setBankBaseCCY(this.BankBaseCCY);
    try {
      //Added for Idle logout || Kaustubh S || 15-Sep-2023 || START
      this.idle.setIdle(AppConfig?.settings?.sessionIdle || 3600); // how long can logged-in user be inactive before considered idle, in seconds
      this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active
      this.idle.setTimeout(AppConfig?.settings?.idlePopupCountdown || 10); //Set the idle popup timer value here //Added for session idle popup || Kaustubh S || 17-Nov-2023
      // do something when the user becomes idle
      this.idle.onIdleStart.subscribe(() => {
        this.ShowIdlePopup();
      });
      this.idle.onIdleEnd.subscribe(() => {
        this.CloseIdlePopup();
      });
      this.idle.onTimeout.subscribe(() => {
        this.CloseIdlePopup();
        this.oauthApi.logout();
      });
      this.idle.onTimeoutWarning.subscribe(seconds => this.idleCountdown = seconds);
      //Added for Idle logout || Kaustubh S || 15-Sep-2023 || END
      sessionStorage.setItem(
        'CompanyLogo',
        AppConfig.settings.CSP_Company_Logo
      ); //Added by Ketan S. on 16-Sep-2021
      sessionStorage.setItem('BankBaseCcy', AppConfig.settings.BankBaseCCy); //Added by Ruchira M on 11-oct-2021
    } catch (Ex) {
      sessionStorage.setItem('CompanyLogo', 'GWM'); // Default value
      sessionStorage.setItem('BankBaseCcy', 'USD'); //Added by Ruchira M on 11-oct-2021
    }

    // this.custApi.setBankBaseCCY(this.BankBaseCCY);
    try {
      this.CompanyLogo = sessionStorage.getItem('CompanyLogo');
      this.commonApi.setCompanyLogo(this.CompanyLogo);
    } catch (EX) {
      this.CompanyLogo = 'GWM';
    }

    
  }
  
  ngOnDestroy() {
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.marketWatchSubscriber) {
      this.marketWatchSubscriber.unsubscribe();
    }
    this.marketWatch = [];
  }
  ngAfterContentChecked() {
    this.ref.detectChanges();
    this.menuSubscription = this.commonApi.hideMenuObs.subscribe((res) => {
      this.isMenuCollapsed = res;
    });
  }
  async ngOnInit() {

    // right when the component initializes, start watching for idleness of user
    this.idle.watch(); //Added for Idle logout || Kaustubh S || 15-Sep-2023
    
    
    this.AppConfigData = await this.oauthApi.getUserData();
    this.homeEntityId = (this.AppConfigData.homeEntityID);
    
    
    // Do not remove
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    // sessionStorage.setItem('activeTheme', 'stanhope');
    // const response : any = await this.oauthApi.getUserData();
    // AppConfig.settings.oRes = response;   
   
    // Added this condition by OnkarE on 09-Oct-2023
    if(location.href.includes("ucpdealentry")){
      this.ShowUCPPopUP = true;
    }

    this.commonApi.showTickerObs.subscribe((res) => {
      this.showTicker = res;
    });
    // alert(this.BankBaseCCY);
    this.changeBankBaseCCY(this.BankBaseCCY);

    this.getInformationUpdatedOnTimeStamp(); //Changes done for  FSLINT-15|| 09-Nov-2023|| Apurva K

    this.workflowApi.loadCurrency().subscribe((res) => {
      if (res?.length !== 0) {
        this.CurrencyList = [];
        this.CurrencyList = res;
        this.CurrencyList?.forEach((c) => {
          this.CurrencyImage.push({
            imgLink:
              'http://' + this.domainURL + '/assets/flags/' + c.Code + '.png',
          });
        });
      }
    });
  
    this.custApi.isFirstCustomerLoginObs.subscribe((res) => {
      this.isFirstCustomerLogin = res;
    });

    this.commonApi.companyLogoObserver.subscribe((res) => {
      if (res !== '' && res !== null && res !== undefined) {
        this.CompanyLogo = res;
      } else {
        this.CompanyLogo = 'GWM';
      }
    });

    this.themeService.themeObs.subscribe((themeres) => {
      this.currentTheme = themeres;
      this.changeTheme(themeres);
      this.showSettings = false;
    });

    this.chartService.paletteObs.subscribe((paletteres) => {
      this.currentPalette = paletteres;
      this.changePalette(paletteres);
      this.showSettings = false;
    });
    this.fontService.fontObs.subscribe((fontres) => {
      console.log(fontres)
      this.currentFont = fontres;
      this.changeFont(fontres);
      this.showSettings = false;
    });

    //Added by SandipA @24-Nov-23 for Config based theme selection || Start
    if (this.CompanyLogo === 'client') {
      this.themeService.setActiveTheme(BankTheme_1);
    } else {
      this.themeService.setActiveTheme(dark);
      this.chartService.setActivePalette(pastel);
      this.fontService.setActiveFont(roboto);
    }
    //Added by SandipA @24-Nov-23 for Config based theme selection || End

    // this.authSubscription = this.loginApi.isAuthObserver.subscribe(
    //   (res: any) => {
    //     this.userType = sessionStorage.getItem('UserType');
    //     try {
    //       this.showSidebar = res;
    //       if (res !== '') {
    //         if (res) {
    //           if (!this.custApi.tradablePairs.length) {
    //             this.custApi.GetAllTradableCurrency();
    //           }
    //           // if (!this.workflowApi.insuranceList.length) {
    //           //   this.workflowApi.getInsuranceList();
    //           // }
    //           this.homeApi
    //             .getUserPreferences(
    //               this.authApi.UserName || sessionStorage.getItem('UserName')
    //             )
    //             .subscribe((res) => {
    //               try {
    //                 const ticker = res.GetPageNameListResult.filter(
    //                   (d) =>
    //                     Number(d.ColumnNumber) === 0 &&
    //                     Number(d.RowNumber) === 0 &&
    //                     d.layout.toUpperCase() === 'TICKER'
    //                 )[0];
    //                 const isPDFMode = res.GetPageNameListResult.filter(
    //                   (d) =>
    //                     Number(d.ColumnNumber) === -1 &&
    //                     Number(d.RowNumber) === -1 &&
    //                     d.layout.toUpperCase() === 'PDFMODE'
    //                 )[0];
    //                 this.showPDFMode = isPDFMode.Visible === 'Y';
    //                 this.showTicker = ticker.Visible === 'Y';
    //                 this.commonApi.togglePDFMode(this.showPDFMode);
    //                 this.commonApi.toggleTicker(this.showTicker);
    //               } catch (ex) {}
    //             });
    //         } else {
    //           this.closeAllPopUps();
    //           this.openRightNav = false;
    //           this.marketWatch = [];
    //           if (this.router.url === '/') {
    //             this.router.navigate(['welcome']);
    //           }
    //         }
    //       } else {
    //       }
    //     } catch (ex) {
    //       console.log('Error occured while loading Market Watch card :', ex);
    //     }
    //   }
    // );
    this.Customerid = this.homeApi.CustomerId;
    this.currencies = await this.intDashboard.GetInteractivedata({TemplateCode:"USP_GetCurrencyListLCM",EntityID: "0",UserId: "0",});////Added by Varsha G || User currency preference || FSLINT-64 || 30-May-2024
  }
  changePalette(selectPalette) {
    this.chartService.paletteEmit.next(selectPalette);
    if (selectPalette === 'pastel') {
      this.chartService.setActivePalette(pastel);
    } else if (selectPalette === 'vibrant') {
      this.chartService.setActivePalette(vibrant);
    } else if (selectPalette === 'RedPallete') {
      this.chartService.setActivePalette(RedPallete);
    }

    this.currentPalette = selectPalette;
    this.showSettings = !this.showSettings;
  }

  changeTheme(selectTheme) {
    this.themeService.themeEmit.next(selectTheme);
    if (selectTheme === 'dark') {
      this.themeService.setActiveTheme(dark);
      Array.prototype.forEach.call(
        this.elem.nativeElement.getElementsByTagName('text'),
        (text: HTMLElement) => {
          if (
            text.getAttribute('fill') === '#000000' &&
            text.getAttribute('stroke') === 'none' &&
            text.getAttribute('stroke-width') === '0' &&
            text.getAttribute('font-size') === '14'
          ) {
            text.setAttribute('fill', '#ffffff');
          }
        }
      );
    } else if (selectTheme === 'stanhope') {
      this.themeService.setActiveTheme(stanhope);
      Array.prototype.forEach.call(
        this.elem.nativeElement.getElementsByTagName('text'),
        (text: HTMLElement) => {
          if (
            text.getAttribute('fill') === '#ffffff' &&
            text.getAttribute('stroke') === 'none' &&
            text.getAttribute('stroke-width') === '0' &&
            text.getAttribute('font-size') === '14'
          ) {
            text.setAttribute('fill', '#000000');
          }
        }
      );
    } else if (selectTheme === 'midnight') {
      this.themeService.setActiveTheme(midnight);
      Array.prototype.forEach.call(
        this.elem.nativeElement.getElementsByTagName('text'),
        (text: HTMLElement) => {
          if (
            text.getAttribute('fill') === '#ffffff' &&
            text.getAttribute('stroke') === 'none' &&
            text.getAttribute('stroke-width') === '0' &&
            text.getAttribute('font-size') === '14'
          ) {
            text.setAttribute('fill', '#000000');
          }
        }
      );
    } else if (selectTheme === 'coral') {
      this.themeService.setActiveTheme(coral);
      Array.prototype.forEach.call(
        this.elem.nativeElement.getElementsByTagName('text'),
        (text: HTMLElement) => {
          if (
            text.getAttribute('fill') === '#ffffff' &&
            text.getAttribute('stroke') === 'none' &&
            text.getAttribute('stroke-width') === '0' &&
            text.getAttribute('font-size') === '14'
          ) {
            text.setAttribute('fill', '#000000');
          }
        }
      );
    } else if (selectTheme === 'BankTheme_1') {
      this.themeService.setActiveTheme(BankTheme_1);
      Array.prototype.forEach.call(
        this.elem.nativeElement.getElementsByTagName('text'),
        (text: HTMLElement) => {
          if (
            text.getAttribute('fill') === '#ffffff' &&
            text.getAttribute('stroke') === 'none' &&
            text.getAttribute('stroke-width') === '0' &&
            text.getAttribute('font-size') === '14'
          ) {
            text.setAttribute('fill', '#000000');
          }
        }
      );
    }else if (selectTheme === 'CSP') {
      this.themeService.setActiveTheme(light);
      Array.prototype.forEach.call(
        this.elem.nativeElement.getElementsByTagName('text'),
        (text: HTMLElement) => {
          if (
            text.getAttribute('fill') === '#ffffff' &&
            text.getAttribute('stroke') === 'none' &&
            text.getAttribute('stroke-width') === '0' &&
            text.getAttribute('font-size') === '14'
          ) {
            text.setAttribute('fill', '#000000');
          }
        }
      );
    } else if (selectTheme === 'neu_light') {
      this.themeService.setActiveTheme(neu_light);
      Array.prototype.forEach.call(
        this.elem.nativeElement.getElementsByTagName('text'),
        (text: HTMLElement) => {
          if (
            text.getAttribute('fill') === '#ffffff' &&
            text.getAttribute('stroke') === 'none' &&
            text.getAttribute('stroke-width') === '0' &&
            text.getAttribute('font-size') === '14'
          ) {
            text.setAttribute('fill', '#000000');
          }
        }
      );
    } else {
      //neu_dark
      this.themeService.setActiveTheme(neu_dark);
      Array.prototype.forEach.call(
        this.elem.nativeElement.getElementsByTagName('text'),
        (text: HTMLElement) => {
          if (
            text.getAttribute('fill') === '#000000' &&
            text.getAttribute('stroke') === 'none' &&
            text.getAttribute('stroke-width') === '0' &&
            text.getAttribute('font-size') === '14'
          ) {
            text.setAttribute('fill', '#ffffff');
          }
        }
      );
    }
    this.currentTheme = selectTheme;
    this.showSettings = !this.showSettings;
  }

  changeFont(selectFont) {
    if (selectFont === 'opensans') {
      this.fontService.setActiveFont(opensans);
    } else if (selectFont === 'biosans') {
      this.fontService.setActiveFont(biosans);
    } else if (selectFont === 'roboto') {
      this.fontService.setActiveFont(roboto);
    } else if (selectFont === 'montserrat') {
      this.fontService.setActiveFont(montserrat);
    } else if (selectFont === 'client') {
      this.fontService.setActiveFont(client);
    }
    console.log(selectFont);
    this.currentFont = selectFont;
    this.showSettings = !this.showSettings;
  }

  toggleNotification() {
    if (this.showNotification === true) {
      this.showNotification = false;
    } else {
      this.showNotification = true;
    }
  }
  toggleSideBar($event: any) {
    console.log('function called');
    console.log('Picked date: ', $event);
  }

  validateLogout() {
    this.isValidateLogout = true;
    // this.appSideBar.logout();
  }
  logout() {
    //this.appSideBar.logout();
	 this.oauthApi.logout();
  }
  openLogoutPopUp() {
    this.closeAllPopUps();
    this.openPopUp = !this.openPopUp;
   
  }

  ngAfterViewChecked() {
    if (this.showSidebar) {
      let routerOutletChilds = document.querySelector('router-outlet')
        .nextSibling as HTMLElement;
      routerOutletChilds.style.marginTop = this.allowRouteHistory
        ? this.showTicker
          ? '7.5em'
          : '3.5em'
        : '90px';
      // let routeHistoryDiv = document.querySelector(
      //   'route-history'
      // ) as HTMLElement;
      // routeHistoryDiv.style.top = this.allowRouteHistory ? '3.5em' : '';
      routerOutletChilds.style.marginTop = this.showTicker ? '90px' : '58px';
      routerOutletChilds.style.marginLeft = this.openRightNav ? '-30px' : '0px';
      routerOutletChilds.style.transition = 'all 0.3s';
    }
    if (this.currentTheme === 'dark' || this.currentTheme === 'neu_dark') {
      Array.prototype.forEach.call(
        this.elem.nativeElement.getElementsByTagName('text'),
        (text: HTMLElement) => {
          if (
            text.getAttribute('fill') === '#000000' &&
            text.getAttribute('stroke') === 'none' &&
            text.getAttribute('stroke-width') === '0' &&
            (text.getAttribute('font-size') === '14' ||
              text.getAttribute('font-size') === '13')
          ) {
            text.setAttribute('fill', '#ffffff');
          }
        }
      );
    } else {
      Array.prototype.forEach.call(
        this.elem.nativeElement.getElementsByTagName('text'),
        (text: HTMLElement) => {
          if (
            text.getAttribute('fill') === '#ffffff' &&
            text.getAttribute('stroke') === 'none' &&
            text.getAttribute('stroke-width') === '0' &&
            (text.getAttribute('font-size') === '14' ||
              text.getAttribute('font-size') === '13')
          ) {
            text.setAttribute('fill', '#000000');
          }
        }
      );
    }
  }
  insertBankBaseCCY(ccy) {
    this.homeApi
      .InsertLayout(this.authApi.UserName, ccy, 'N', 9, 9)
      .subscribe((res) => {
        if (res.length !== 0) {
          this.BankBaseCCY = res.InsertUpdateCCYResult[0].layout;
          this.custApi.setBankBaseCCY(this.BankBaseCCY);
        }
      });
  }
  changeBankBaseCCY(Ccy) {
    this.BankBaseCCY = Ccy;
    this.homeApi.getBaseCCYForLogin(this.authApi.UserName).subscribe((res) => {
      if (res?.length !== 0) {
        this.BankBaseCCY = res?.GetBaseCCYResult;//Changed by Varsha G || FIN1EURINT-315 || 11-May-2023
        this.custApi.setBankBaseCCY(this.BankBaseCCY);
        sessionStorage.setItem('BankBaseCcy', this.BankBaseCCY);
      }
    });
  }
  tickerPausePlay() {
    this.isTickerPaused = !this.isTickerPaused;
  }

  changeBankBaseCCYonEnter(e: KeyboardEvent) {
    try {
      const Ccy = $('.ccy-text').data('mfdata');
      this.selectedIndex = 0;
      this.BankBaseCCY = [null, undefined].includes(Ccy)
        ? sessionStorage.getItem('BankBaseCcy')
        : Ccy;
      if (!(this.BankBaseCCY === sessionStorage.getItem('BankBaseCcy'))) {
        this.custApi.setBankBaseCCY(this.BankBaseCCY);
      }
      sessionStorage.setItem('BankBaseCcy', this.BankBaseCCY);
      this.showCcy = false;
      this.homeApi
        .InsertLayout(this.authApi.UserName, this.BankBaseCCY, 'N', 9, 9)
        .subscribe((res) => {
          if (res.length !== 0) {
            this.BankBaseCCY = res.InsertUpdateCCYResult[0].layout;
            this.custApi.setBankBaseCCY(this.BankBaseCCY);
          }
        });
      e.preventDefault();
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  ClosePopup() {
    // var checkboxes = document.getElementById(Controlname);
    try {
      this.showCcy = false;
      this.showSettings = false;
      this.showSupport = false;
    } catch (ex) {
      console.log('Error occured while closing the pop up: ', ex);
    }
  }

  ChangeIndex() {
    try {
      // this.selectedIndex = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
      // this.apifunction.log(4, Error, 'share-component.component.ts', 'ChangeIndex()');
    }
  }
  gotoccy(event: KeyboardEvent, value) {
    this.showCcy = true;
    const searchKey = event.key;
    const ccylist = this.CurrencyList;
    ccylist.forEach((c, i) => {
      if (c.Code.startsWith(searchKey.toUpperCase())) {
        this.selectedIndex = i;
        this.commonApi.ScrollTo('.setting-grid', '.ccyselected', 'up');
        this.ref.detectChanges();
        return;
      }
    });
    event.preventDefault();
    console.log(value);
  }
  toggleShowCcy() {
    this.showCcy = !this.showCcy;
    const ccylist = this.CurrencyList;

    ccylist.forEach((c, i) => {
      if (c.Code.startsWith(this.BankBaseCCY.toUpperCase())) {
        this.selectedIndex = i;
        this.ref.detectChanges();
        this.commonApi.ScrollTo('.SelectorBox', '.HoverSuggestion', 'up');
        return;
      }
    });
  }
  toggleTicker() {
    console.log('Ticker', this.showTicker);
    this.commonApi.toggleTicker(this.showTicker);
    this.custApi
      .ToggleTicker(this.authApi.UserName, this.showTicker)
      .subscribe((res) => {
        console.log(res);
        if (res.UpdatePageNameListResult) {
          // this.showTicker = true;
        } else {
          this.showTicker = false;
        }
      });
  }
  togglePDFMode() {
    console.log('PDF Mode', this.showPDFMode);
    this.commonApi.togglePDFMode(this.showPDFMode);
    this.custApi
      .TogglePDFMode(this.authApi.UserName, this.showPDFMode)
      .subscribe((res) => {
        console.log(res);
        if (res.UpdatePageNameListResult) {
          // this.showTicker = true;
        } else {
          this.showPDFMode = false;
        }
      });
  }
  fullScreenToggle() {
    this.isFullScreen = !this.isFullScreen;
    if (this.isFullScreen) {
      this.documentElement = this.document.documentElement as HTMLElement;
      if (this.documentElement.requestFullscreen) {
        this.documentElement.requestFullscreen();
      } else if (this.documentElement.mozRequestFullScreen) {
        /* Firefox */
        this.documentElement.mozRequestFullScreen();
      } else if (this.documentElement.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.documentElement.webkitRequestFullscreen();
      } else if (this.documentElement.msRequestFullscreen) {
        /* IE/Edge */
        this.documentElement.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
  addCcyToFavorites() {}
  changeLanguage(lang: string) {
    this.translate.currentLang = lang;
    // this.selectedLanguage = lang; //ChitraM | 5-May-23 | FIN1EURINT-100
    this.translate.use(lang); //ChitraM | 5-May-23 | FIN1EURINT-100
  }

  // Added on 17 Jan 2021

  showVideoPopup() {
    if (!this.openPopUpVideo) this.closeAllPopUps();
    this.openPopUpVideo = !this.openPopUpVideo;
  }

  // Added on 17 Jan 2021
  getExpandVar(e: any) {
    console.log('video expand', e);
    this.openPopUpVideo = !this.openPopUpVideo;
  }

  // Added on 17 Jan 2021
  showNotesPopup() {
    if (!this.openPopupNotes) this.closeAllPopUps();
    this.openPopupNotes = !this.openPopupNotes;
  }
  toggleSettings() {
    if (!this.showSettings) this.closeAllPopUps();
    this.showSettings = !this.showSettings;
  }
  toggleSupport() {
    if (!this.showSupport) this.closeAllPopUps();
    this.showSupport = !this.showSupport;
  }
  onClickedOutside() {
    this.showSettings = !this.showSettings;
  }
  closeAllPopUps() {
    this.openPopUp = false;
    this.openPopUpVideo = false;
    this.openPopupNotes = false;
    this.showSupport = false;
    this.showSettings = false;
  }

  showRightNav() {
    this.openRightNav = !this.openRightNav;
    if (!this.openRightNav) this.closeAllPopUps();
  }
  
  ShowIdlePopup() {
    try {
      this.idlePopup = true;
      // this.ref.detectChanges();
    } catch (error) {
      console.log(error);
    }
  }

  CloseIdlePopup() {
    try {
      this.idlePopup = false;
      this.idleCountdown = null;
      this.ref.detectChanges();
    } catch (error) {
      console.log(error);
    }
  }


  //Start - Changes done for  FSLINT-15|| 09-Nov-2023|| Apurva K
  async getInformationUpdatedOnTimeStamp() {
    try {
      this.infromationUpdatedOnTime = await this.intDashboard.GetInteractivedata({
        TemplateCode: "GetLatestTimestamp_Santander",
        CustomerID: "",
        EventType: "",
        EntityID: "0",
        UserId: "0",
        FromDate: "",
        ToDate: "",
        Measure: "",
        Sector: "",
        RowsPerPage: "",
        PageNo: "",
        WhereClause: ""
      });
      if(this.infromationUpdatedOnTime?.length > 0){
        this.logoHiddenForEntity = this.infromationUpdatedOnTime[0]?.NoLogo;
        this.infromationUpdatedOnTime = this.infromationUpdatedOnTime[0]?.Info;
        
      }
     // console.log(this.infromationUpdatedOnTime,"info time update")
    } catch (error) {

    }
  }
   //End - Changes done for  FSLINT-15|| 09-Nov-2023|| Apurva K

  //Kaustubh S, Varsha G || User currency preference || FSLINT-64 || 30-May-2024
  CurrPreferenceChanged(event) {
    try {
      this.intDashboard.currencyPreference = event.target.value;
      this.intDashboard.currPreferenceSubject.next(event.target.value);
    } catch (error) {
      console.log(error);
    }
  }
}
