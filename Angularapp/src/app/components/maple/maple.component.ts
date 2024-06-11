import {AfterViewChecked,AfterViewInit,Component,ElementRef,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AppConfig } from 'src/app/services/config.service';

declare var require: any;
// declare var require: any;
const $: any = require('jquery');
@Component({
  selector: 'app-maple',
  templateUrl: './maple.component.html',
  // styleUrls: ['./maple.component.scss','jquery-ui.css','bootstrap.min.css','CADB_Theme2.css','Font-Montserrat.css','UC_FinIQCommon.css']
  styleUrls: ['./maple.component.scss'],
})
export class MapleComponent implements OnInit, AfterViewChecked {
  isProd = environment.production;
  userdata: any;
  constructor(public elem: ElementRef, public router: Router) {
   
  }

  ngOnDestroy() {

    Object.keys(sessionStorage)
               .forEach(function (_key) {
                if(_key.includes("quoteResponse_")){
                  sessionStorage.removeItem(_key);
          }
    }); // INT1FIN47-768 Gateway Markets Instant Pricing issue

  
    for (let i = 0; i < 5; i++) {
      this.unloadCSS('link' + (i + 1));
    }

    for(let i=0; i< 31; i++){ //LGTGTWINT-1934  || RizwanS || 01 Jun 2023
      this.UnloadExternalScript('link' + (i + 1))
    } // INT1FIN47-768 Gateway Markets Instant Pricing issue
    
  }
  
  ngAfterViewChecked(): void {
    let ele = this.elem.nativeElement as HTMLElement;
    let btnWorkflow = ele.querySelectorAll('.gotoWorkflowCls');
    if (btnWorkflow) {
      btnWorkflow.forEach((e) =>
        e.addEventListener('click', this.goToWorkflow.bind(this))
      );
    }
  }

  goToWorkflow(event) {
    console.log(event);
    this.router.navigate(['wfblotter']);
  }

  ngOnInit(): void {

    //Added by Rizwan S || to Store logged in user data || 12 Jul 2023
    sessionStorage.setItem("Username", AppConfig.settings.oRes.userName); 
    sessionStorage.setItem("HomeEntityID", AppConfig.settings.oRes.homeEntityID); 
    sessionStorage.setItem("userRole", AppConfig.settings.oRes.userRole);
    sessionStorage.setItem("FinIQGroupID", AppConfig.settings.oRes.groupID);
    //END
    
    sessionStorage.setItem("ServicePath_", environment.interfaceURL); // //LGTGTWINT-1966 || Added to store local app-server enpoint as per defined in environment component || RizwanS || 08 May 2023
    sessionStorage.setItem("SignalRPath_", environment.SignalREndpoint); // LGTGTWINT-1934 || Rizwan S || 05 Jun 2023

    const version = 'v7'; // Change this version whenever files are updated

    // Load Fonts and CSS styles :: Start
    this.loadCSS(`${environment.mapleAssetURL}FinIQJS/jquery-ui.css?ver=${version}`, 1);
    this.loadCSS(`${environment.mapleAssetURL}FinIQJS/Bootstrap/bootstrap.min.css?ver=${version}`,2);
    this.loadCSS(`${environment.mapleAssetURL}App_Themes/CADB_Theme2.css?ver=${version}`, 3);
    this.loadCSS(`${environment.mapleAssetURL}App_Themes/Font-Montserrat.css?ver=${version}`,4);
    this.loadCSS(`${environment.mapleAssetURL}App_Themes/UC_FinIQCommon.css?ver=${version}`,5);
    // END
   

    // SignalR Region For FXD RFS || LGTGTWINT-1934 || Rizwan S || 13 April 2023
    //Load Jquery and SignalR client
    this.loadExternalScript(`${environment.mapleAssetURL}FinIQJS/jquery.min.js?ver=${version}`,false,1);
    this.loadExternalScript(`${environment.mapleAssetURL}FinIQJS/jquery-ui.js?ver=${version}`,false,2);
    this.loadExternalScript(`${environment.mapleAssetURL}CommonJS/jquery.signalR-2.4.1.min.js?ver=${version}`,false,3);
    this.loadExternalScript(`${environment.mapleAssetURL}CommonJS/hubs.js?ver=${version}`,false,4);
    this.loadExternalScript(`${environment.mapleAssetURL}CommonJS/UC_FinIQCommon.js?ver=${version}`,false,5);
    //END
    
    // Load Common JS Files :: Start  
    this.loadExternalScript(`${environment.mapleAssetURL}FinIQJS/xlsx.full.min.js?ver=${version}`, true, 6);
    this.loadExternalScript(`${environment.mapleAssetURL}FinIQJS/popper.js?ver=${version}`,false,7);
    this.loadExternalScript(`${environment.mapleAssetURL}FinIQJS/Chart.js?ver=${version}`,false,8);
    this.loadExternalScript(`${environment.mapleAssetURL}FinIQJS/Charts.js?ver=${version}`,false,9);
    this.loadExternalScript(`${environment.mapleAssetURL}CommonJS/xmlToJSON.js?ver=${version}`,false,10);
    // END

    // Load Load EQC Pyaoff's JS :: Start
    this.loadExternalScript(`${environment.mapleAssetURL}EQC/FCNPricer.js?ver=${version}`,false,11);
    this.loadExternalScript(`${environment.mapleAssetURL}EQC/ELNPricer.js?ver=${version}`,false,12);
    this.loadExternalScript(`${environment.mapleAssetURL}EQC/AQPricer.js?ver=${version}`,false,13);
    this.loadExternalScript(`${environment.mapleAssetURL}EQC/EQCBEN.js?ver=${version}`, false,14);
    this.loadExternalScript(`${environment.mapleAssetURL}EQC/EQCDRA.js?ver=${version}`, false,15);
    this.loadExternalScript(`${environment.mapleAssetURL}EQC/EQCOptions.js?ver=${version}`,false,16);
    this.loadExternalScript(`${environment.mapleAssetURL}EQC/EQCPhoenix.js?ver=${version}`,false,17);
    this.loadExternalScript(`${environment.mapleAssetURL}EQC/EQCDCN.js?ver=${version}`,false,18);
    this.loadExternalScript(`${environment.mapleAssetURL}EQC/EQC_TwinWin.js?ver=${version}`,false,19);
    this.loadExternalScript(`${environment.mapleAssetURL}EQC/EQCBooster.js?ver=${version}`,false,20);
    this.loadExternalScript(`${environment.mapleAssetURL}EQC/EQCSharkfin.js?ver=${version}`,false,21);
    // END


    // Load FXD Pyaoff's JS :: Start
    this.loadExternalScript(`${environment.mapleAssetURL}FXD/FXAQ.js?ver=${version}`, false,22);
    this.loadExternalScript(`${environment.mapleAssetURL}FXD/FXTRF.js?ver=${version}`, false,23);
    this.loadExternalScript(`${environment.mapleAssetURL}FXD/FXPivot.js?ver=${version}`,false,24);
    this.loadExternalScript(`${environment.mapleAssetURL}FXD/FXO_Pricer.js?ver=${version}`,false,25);
    this.loadExternalScript(`${environment.mapleAssetURL}FXD/FXDCI.js?ver=${version}`,false,26);
    this.loadExternalScript(`${environment.mapleAssetURL}FXD/FXStrategies.js?ver=${version}`,false,27)
    this.loadExternalScript(`${environment.mapleAssetURL}Investments/FI_BondsPricer.js?ver=${version}`, false, 28)
    this.loadExternalScript(`${environment.mapleAssetURL}CommonJS/crypto-js.js?ver=${version}`,false,29);
    // END
	
	// LGTGTWINT-2212 // RizwanS // 11 Jul 2023
	setTimeout(() => {
          this.loadExternalScript(`${environment.mapleAssetURL}CommonJS/Maple.js?ver=${version}`,false,30);
          this.loadExternalScript(`${environment.mapleAssetURL}CommonJS/plotly-latest.min.js?ver=${version}`,false,31);
      console.log("Timeout completed!");
    }, 3000);
    
  } //LGTGTWINT-1934  || RizwanS || 01 Jun 2023

  public loadExternalScript(url: string, asynflag: boolean, id: any) {     // INT1FIN47-768 Gateway Markets Instant Pricing issue
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = asynflag;
    script.defer = true;
    script.id =  'link' + id;     // INT1FIN47-768 Gateway Markets Instant Pricing issue
    body.appendChild(script);
    
  }

  loadCSS(url: any, id: any) {
    // Create link
    let link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.id = 'link' + id;

    let head = document.getElementsByTagName('head')[0];
    let links = head.getElementsByTagName('link');
    let style = head.getElementsByTagName('style')[0];



    // Check if the same style sheet has been loaded already.
    let isLoaded = false;
    for (var i = 0; i < links.length; i++) {
      var node = links[i];
      if (node.href.indexOf(link.href) > -1) {
        isLoaded = true;
      }
    }
    if (isLoaded) return;
    head.insertBefore(link, style);
  }

  unloadCSS(elementID: any) {
    var element = document.getElementById(elementID);
    element.parentNode.removeChild(element);
  }

    // INT1FIN47-768 Gateway Markets Instant Pricing issue
UnloadExternalScript(eleID:any){
   var element = document.getElementById(eleID);
    element.parentNode.removeChild(element);
}

}
