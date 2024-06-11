import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EcCommonService } from '../../services/ec-common.service';
import { EcHomeService } from '../../services/ec-home.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ec-multirequest',
  templateUrl: './ec-multirequest.component.html',
  styleUrls: ['./ec-multirequest.component.scss']
})
export class EcMultirequestComponent implements OnInit {
  subpages = [];
  IsLandingPage: boolean;
  // pageTitle = 'Euroconnect Multi Pricer';
  accord: number;
  subscribeRoute: any;
  allBooksData = [];
  public shares: any = [];
  ReceivedCCY: any = [];
  indexTrancheArr: any = [];
  floatingRefArr: any = [];
  validationArr: any = [];
  asseturl = environment.asseturl;
  pageTitle: any;
  pageloadflag: boolean; // Bulk Pricer - Loader until shares and currency api fetch data

  constructor(public Echome: EcHomeService , public EcCommon : EcCommonService , private router: Router,private route: ActivatedRoute) { 
    this.IsLandingPage = true;
    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // };
    // this.subscribeRoute = this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.router.navigated = false;
    //   }
    // });
  }
  

  // ngOnInit(): void {
  // //Anubhav 05-01-2023
  //   this.subpages = [
  //     {
  //       ActiveYN: true,
  //       Name: 'Autocallable',
  //       displayYN: true
  //     },
  //     {
  //       ActiveYN: false,
  //       Name: 'Yeild Enhancement',
  //       displayYN: true
  //     },
    
  //     {
  //       ActiveYN: false,
  //       Name: 'Accumulator',
  //       displayYN: true
  //     }
  //     ,
  //     {
  //       ActiveYN: false,
  //       Name: 'Decumulator',
  //       displayYN: true
  //     }
  //   ]
  // }
  ngOnInit() {
    
    // FIN1EURINT-187 : Quick Pricer and Bulk Pricer - Remove AQDQ tabs
    // this.subpages = [
    //   {
    //     ActiveYN: true,
    //     Name: 'Autocallable',
    //     displayYN: true
    //   },
    //   {
    //     ActiveYN: false,
    //     Name: 'Yield Enhancement',
    //     displayYN: true
    //   },
    
    //   {
    //     ActiveYN: false,
    //     Name: 'Participation',
    //     displayYN: true
    //   },
    //   {
    //     ActiveYN: false,
    //     Name: 'Accumulator',
    //     displayYN: true
    //   },
    //   {
    //     ActiveYN: false,
    //     Name: 'Decumulator',
    //     displayYN: true
    //   }
    // ]
    // FIN1EURINT-187 : Quick Pricer and Bulk Pricer - Remove AQDQ tabs
  //   this.route.params.subscribe
  //   (async params => {
  //   this.pageTitle = params.pageTitle;

  // });//Added by Jyoti S || 05-May-2023
    this.pageTitle = history.state.pageTitle;//Added by Jyoti S || 25-May-2023
    this.accord = 1;
    setTimeout(async () => {
      this.pageloadflag = true; // Bulk Pricer - Loader until shares and currency api fetch data
      //console.log(this.Echome.payOffList);
      if(this.Echome.payOffList === undefined || this.Echome.payOffList?.length <= 0){
        // this.validationArr = this.Echome.BBVAFetchValidation('EQ');
        // this.Echome.GetDealEntryUSAM();
        await this.Echome.getPayOffList();
      }   

      // FIN1EURINT-187 : Quick Pricer and Bulk Pricer - Remove AQDQ tabs
      if (this.subpages === undefined || this.subpages?.length <= 0) {
        // FIN1EURINT-281 : Bulk Pricer - Product tab inconsistent arrangement
        const allPages: any = this.Echome.payOffList.filter(e => {
          return e.display;
        });
        allPages.forEach((item: any) => this.subpages.push({ ActiveYN: false, Name: item.displayName, displayYN: item.display }));
        // FIN1EURINT-281 : Bulk Pricer - Product tab inconsistent arrangement
      }
      // FIN1EURINT-187 : Quick Pricer and Bulk Pricer - Remove AQDQ tabs

          const index = this.Echome.payOffList.findIndex(res=>res.display === true);
     // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
     // FIN1EURINT-104 : Participation pay off addition in 1Europe
          if (this.Echome.allBooksData === undefined || this.Echome.allBooksData?.length <= 0) {
            this.allBooksData = await this.Echome.getAllBooksMappedToLogin();
          }
          
      // if (this.Echome.shares === undefined || this.Echome.shares.length <= 0) {
      // changed by Suvarna P || 27Apr2022 || shares not loading in Autocallable product || assigned by Pranav D 
        // this.shares = this.Echome.BBVALoadShares('EQ',"", index > -1 ? this.Echome.payOffList[index].displayName : "EQC_Europe");
      //   this.shares = await this.Echome.BBVALoadShares('EQ',"", index > -1 ? this.Echome.payOffList[index].prevQuoteProductName : "EQC_Europe");
        
      // }
      
      // Bulk Pricer - Loader until shares and currency api fetch data
      if (this.Echome.shares === undefined || this.Echome.shares?.length <= 0) {
        this.shares = await this.Echome.BBVALoadShares('EQ,IDX', "", "EQC_Europe");
      }
      if (this.Echome.CCY === undefined || this.Echome.CCY?.length <= 0) {
        this.ReceivedCCY = await this.Echome.BBVALoadCCY();
      }

      // FIN1EURINT-526 : GetAllShares API call with different market type not required syncing like single pricer.
      // if (this.Echome.indexTrancheArr === undefined || this.Echome.indexTrancheArr.length <= 0) {
      //   this.indexTrancheArr = await this.Echome.BBVALoadSharesCR('CR',"","CreditTranche");
      // }
      // if (this.Echome.floatingRefArr === undefined || this.Echome.floatingRefArr?.length <= 0) {
      //   this.floatingRefArr = await this.Echome.BBVALoadSharesIR('IR',"","CreditTranche");
      // }
      // FIN1EURINT-526 : GetAllShares API call with different market type not required syncing like single pricer.

      if (this.Echome.validationArr === undefined || this.Echome.validationArr?.length <= 0) {
        this.validationArr = await this.Echome.BBVAFetchValidation('EQ');
      }
      this.pageloadflag = false; // Bulk Pricer - Loader until shares and currency api fetch data
      //$('#mainloader').hide();
    });

  }

  eqchangeProduct(choice, from) {
    if (from === 'click') {
      if (choice !== '') {
        this.IsLandingPage = false;
        this.subpages.forEach((res) => {
          if (res) {
            if (res.Name === choice) {
              res.ActiveYN = true;
            } else {
              res.ActiveYN = false;
            }
          }
        });
      }
    } else {
      if (choice !== '') {
        this.IsLandingPage = false;
        this.subpages.forEach((res) => {
          if (res) {
            if (res.Name === choice) {
              res.ActiveYN = true;
            } else {
              res.ActiveYN = false;
            }
          }
        });
      }
    }
    console.log(this.subpages)

  }
  openAcc(prod: any) {
    if (prod === 1) {
      this.accord = 1;
    } else if (prod === 2) {
      this.accord = 2;
    } else if (prod === 10) {
      this.accord = 10;
    } else {
      this.accord = 3;
    }
    return false;
  }

  closeProduct(){
    this.IsLandingPage = true;
  }

}
