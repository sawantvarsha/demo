import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EcCommonService } from '../../services/ec-common.service';
import { EcHomeService } from '../../services/ec-home.service';
import { ActivatedRoute } from '@angular/router';

declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-ec-pricers',
  templateUrl: './ec-pricers.component.html',
  styleUrls: ['./ec-pricers.component.scss']
})
export class EcPricersComponent implements OnInit {


  subscribeRoute: any;
  // public id: Guid;
  token: any;

  allBooksData = [];
  shares: any = [];
  ReceivedCCY: any = [];
  validationArr: any = [];

  routeParams = '';
  BookingCenter: any = [];
  asseturl = environment.asseturl;
  IsLandingPage: boolean;
  subpages = [];
  pageTitle: any;
  pageloadflag;
  sharesCLN: any = [];
  // pageTitle = 'Euroconnect Pricer';

  constructor(public Echome: EcHomeService, public EcCommon: EcCommonService, private router: Router,private route:ActivatedRoute) {
    this.IsLandingPage = true;
    
  }

  async ngOnInit() {

    
    //Commented by Apurva K for FIN1EURINT-228
    // this.subpages = [
    //   {
    //     ActiveYN: false,
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
    //   },//Added by Jyoti S || 17-Apr-2023
    //   // {
    //   //   ActiveYN: false,
    //   //   Name: 'Accumulator',
    //   //   displayYN: true
    //   // },
    //   // {
    //   //   ActiveYN: false,
    //   //   Name: 'Decumulator',
    //   //   displayYN: true
    //   // }
            
    // ]

    // this.activatedroute.params.subscribe((params:any)=>{
    //   console.log('params ', params)
    //   if(JSON.stringify(params) != '{}'){
    //     this.routeParams = params;
    //     this.IsLandingPage = false;

    //     switch(params['Product']){

    //       case 'AC':
    //         this.eqchangeProduct('Autocallable', 'click');
    //         break;
    //         case 'YE':
    //           this.eqchangeProduct('Yield Enhancement', 'click');
    //           break;
    //       case 'AQ':
    //         this.eqchangeProduct('Accumulator', 'click');
    //         break;
    //       case 'DQ':
    //         this.eqchangeProduct('Decumulator', 'click');
    //         break;
    //       case 'Participation':
    //         this.eqchangeProduct('Participation', 'click');//Added by Jyoti S || 17-Apr-2023
    //     }
        
    //   }
    // })//Commented by Jyoti S || 05-May-2023
  //   this.route.params.subscribe
  //   (async params => {
  //   this.pageTitle = params.pageTitle;
  // }); //Added by Jyoti S || 05-May-2023
    this.pageTitle = history.state.pageTitle;//Added by Jyoti S || 25-May-2023


    // setTimeout(() => {
    //   // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
    //   // if (this.apifunctions.allBooksData === undefined || this.apifunctions.allBooksData.length <= 0) {
    //   //   this.allBooksData = this.apifunctions.getAllBooksMappedToLogin();
    //   // }
    //   if (this.Echome.shares === undefined || this.Echome.shares.length <= 0) {
    //     this.Echome.BBVALoadShares('EQ', "", "EQC_Europe").subscribe((data:any)=>{
    //       this.shares = data.Get_All_Share_Details_JsonResult;
    //       this.Echome.shares = this.shares
    //     });
    //   }
      // Pranav D 9-Jan-23
      // this.shares = this.Echome.BBVALoadShares('EQ', "", "EQC_Europe");
    //   if (this.Echome.CCY === undefined || this.Echome.CCY.length <= 0) {
    //     this.Echome.BBVALoadCCY().subscribe((data:any)=>{
    //       this.ReceivedCCY = data.Get_CcyList_JSONResult;
    //     });
    //   }
      // this.ReceivedCCY = this.Echome.BBVALoadCCY();
    //   if (this.Echome.validationArr === undefined || this.Echome.validationArr.length <= 0) {
    //     this.Echome.BBVAFetchValidation('EQ').subscribe((data:any)=>{
    //       this.validationArr = data.FetchValidationResult;
    //       this.Echome.validationArr = this.validationArr
    //     });
    //   }

    //   // Fetch booking center - added by Priya L. on 14 Mar 2022 - assigned by Pranav D.
    //   if (this.Echome.BookingCenter === undefined || this.Echome.BookingCenter.length <= 0) {
    //     this.Echome.GetBookingCenter().subscribe((data:any)=>{
    //       this.BookingCenter = data
    //     });
    //   }

    //   //console.log(this.apifunctions.payOffList);
    //   if (this.Echome.payOffList === undefined || this.Echome.payOffList.length <= 0) {
    //     // this.validationArr = this.apifunctions.BBVAFetchValidation('EQ');
    //     // this.apifunctions.GetDealEntryUSAM();
    //     this.Echome.getPayOffList();
    //   }
    //   $('#mainloader').hide();
    // });
    // this.pageloadflag = true;
    $('#loading').show();
    setTimeout(async () => {
      // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
      // if (this.Echome.allBooksData === undefined || this.Echome.allBooksData.length <= 0) {
      //   this.allBooksData = this.Echome.getAllBooksMappedToLogin();
      // }
      this.pageloadflag = true;
      if (this.Echome.shares === undefined || this.Echome.shares?.length <= 0) {
        this.shares = await this.Echome.BBVALoadShares('EQ,IDX', "", "EQC_Europe");
      }
      if (this.Echome.sharesCLN === undefined || this.Echome.sharesCLN?.length <= 0) {
        this.sharesCLN = await this.Echome.GetReferenceEntityLookupData("", "");
      }


      if (this.Echome.CCY === undefined || this.Echome.CCY?.length <= 0) {
        this.ReceivedCCY = await this.Echome.BBVALoadCCY();
      }
      if (this.Echome.validationArr === undefined || this.Echome.validationArr?.length <= 0) {
        this.validationArr = await this.Echome.BBVAFetchValidation('EQ');
      }

      // Fetch booking center - added by Priya L. on 14 Mar 2022 - assigned by Pranav D.
      if (this.Echome.BookingCenter === undefined || this.Echome.BookingCenter?.length <= 0) {
        this.BookingCenter = await this.Echome.GetBookingCenter();
      }

      //console.log(this.Echome.payOffList);
      if (this.Echome.payOffList === undefined || this.Echome.payOffList?.length <= 0) {
        // this.validationArr = this.Echome.BBVAFetchValidation('EQ');
        // this.Echome.GetDealEntryUSAM();
        await this.Echome.getPayOffList();
        
      }
      const res:any = this.Echome.payOffList.filter(e=>{
        return e.display;
      });
      res.forEach((item: any)=>this.subpages.push({ ActiveYN: false, Name: item.displayName, displayYN: item.display}));    
      this.pageloadflag = false;
      $('#mainloader').hide();
    });
    $('#loading').hide();
    
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
    console.log('subpages',this.subpages)

  }
  closeProduct(){
    this.IsLandingPage = true;
  }

}
