import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { environment } from '../../../../environments/environment';
import { FxdApifunctionService } from '../services/fxd-apifunction.service';
import { AppConfig } from 'src/app/services/config.service';
import { FxdCommonfunctionsService } from '../services/fxd-commonfunctions.service';
import { AppComponent } from 'src/app/app.component';
import { Subscription } from 'rxjs';
import { FXDSignalRService } from '../services/fxdsignal-r.service';

@Component({
  selector: 'app-fxddashboard',
  templateUrl: './fxddashboard.component.html',
  styleUrls: ['./fxddashboard.component.scss', '../products/aqdq/aqdq.component.scss' ],
})
export class FXDDashboardComponent implements OnInit, OnDestroy {
  @Input() InputData: any;
  pageTitle = 'FXD Products';
  isProd = environment.production;
  IsLandingPage: boolean;
  subpages = [];
  Mode: string;
  UserGroup: string;
  PricingMode: string;
  AppMode: string;
  SwitchAutoManual: boolean;
  DisabledSwitchAppMode: boolean;
  ShowLandingPageYN: boolean=false; //added by Urmila A | 2-nov-23 | as not getting value from AppConfig settings
  SessionInvalid: boolean = false;
  RFQDetailsFromBlotterYes_QueueStatus: any;
  FXDProductInfoSubscriber: Subscription;
  FXDProdDetailsSubscriber: Subscription;
  AllProdData: any[] = []; //Urmila A | 20-feb-23

  //Urmila A | 6-Mar-23
  isAQPresent: boolean = false;
  isDQPresent: boolean = false;
  isTRFbuyPresent: boolean = false;
  isTRFsellPresent: boolean = false;
  EntityData: any[] = []; //UrmilaA, 24-april-23 | LGTGTWINT-1898
 
    //UrmilaA, LGTCLI-361 | 22-May-23 | start
    FXDConfigSubscriber:Subscription;
    ShowRFS:boolean=false;
    //UrmilaA, LGTCLI-361 | 22-May-23 | ends

  constructor(
    private FXD_afs: FxdApifunctionService,
    public AuthorAPI: AuthService,
    public CustAPI: CustomerApiService,
    public commonApi: CommonApiService,
    public FXD_cfs: FxdCommonfunctionsService,
    public appComponent: AppComponent,
    public SignalR: FXDSignalRService,  //UrmilaA, LGTCLI-361 | 22-May-23
    
  ) {
    this.IsLandingPage = false;
    this.Mode = 'FXOSEN';
    this.UserGroup = AppConfig?.settings.oRes.groupID; //Added by Urmila A | 29-Aug-23 
    this.PricingMode = 'AUTO';
    this.SwitchAutoManual = false;
    this.DisabledSwitchAppMode = false;
    this.SessionInvalid = false;
  }

  dataFlag = false;
  data = this.FXD_afs.getData();

  ngOnDestroy(): void {
    this.subpages = [];
    this.SessionInvalid = false;
    if (this.FXDProductInfoSubscriber)
      this.FXDProductInfoSubscriber.unsubscribe();
    if (this.FXDProdDetailsSubscriber)
      this.FXDProdDetailsSubscriber.unsubscribe();
  }

  StrategySubtype: any = [];

  ngOnInit(): void {
  
    this.dataFlag = false;
    this.fnGetEntity(); //added by UrmilaA, LGTGTWINT-1898 | 24-april-23
    this.FXD_cfs.fnSetSessionValid();
    
   
    // this.FXD_afs.SetCredentials(); //commented by UrmilaA, LGTGTWINT-1898 | 24-april-23
    // this.fnLoadLandingPageYN();

    this.FXD_cfs.sessionInvalidObserver.subscribe((res) => {
      if (res == true) {
        this.SessionInvalid = true;
        // console.log('session check:',res,this.SessionInvalid)
      }
    });

    //old code shifted in getEntityData() function to avoid Invalid session issue , by Urmila A | 26-April-23

    //commented by Urmila A | 10-Mar-23
    // this.AppMode = AppConfig.settings.CSP_FXD_Mode;
    // if (this.AppMode !== '' && this.AppMode !== undefined) {
    //   if (this.AppMode.includes(',')) {
    //     this.DisabledSwitchAppMode = false;
    //   } else {
    //     this.DisabledSwitchAppMode = true;
    //     if (this.AppMode.toUpperCase() === 'AUTO') {
    //       this.SwitchAutoManual = true;
    //     } else {
    //       this.SwitchAutoManual = false;
    //     }
    //   }
    // } else {
    //   this.DisabledSwitchAppMode = true;
    //   this.SwitchAutoManual = true;
    // }
  }

  //added by UrmilaA, 24-april-23 | LGTGTWINT-1898 | start
  fnGetEntity() {
    this.FXD_afs.getEntityData(this.FXD_afs.UserName) //Core migration : API req paarms modified by Urmila A | 23-Aug-23
    .subscribe((res: any) => {
      console.log('entity data', res);
      try {
        if (res)  
         {
          res=res.cvpData
          if (res.length > 0 && res !== null) {
            this.EntityData=[]
            this.EntityData = res
            res.forEach(element => {
                  if(element.code == '29' ){
                    sessionStorage.setItem('FXD_EntityID',element.code);
                    console.log('FXD_EntityID',element.code, sessionStorage.getItem('FXD_EntityID'))
                  }
            });
            console.log('dashboard entity:', res,this.EntityData );
            // sessionStorage.setItem('FXD_EntityID',res[0].code);
         
            this.FXD_afs.SetCredentials();
            this.fnAfterAuthentication();
            //below code commented by urmila A | 29-Aug-23 | not necessory after Core migration | start
            //code added by UrmilaA to resolve Invalid Session issue immediately after login -LGTGTWINT-1918 | 26-April-23 | start
            // try {
            //   if ( this.FXD_afs.GetToken() === null || this.FXD_afs.GetToken() === undefined) 
            //   {
            //     this.FXD_afs.mapleFXDAuthenticateUser( this.FXD_afs.UserName, this.FXD_afs.Password).then((res: any) => {
              
            //       if (res) {
            //         sessionStorage.setItem('FXD_Token', res.token); // Added by Urmila A | 2-Nov-22
            //         this.FXD_afs.SetToken(res.token);
            //         this.fnAfterAuthentication();
            //       }
            //     });
            //   } else {
            //     this.fnAfterAuthentication();
            //   }
            // } catch (Ex) {
              
            // }
            //code added by UrmilaA to resolve Invalid Session issue immediately after login -LGTGTWINT-1918| 26-April-23 | ends
             //below code commented by urmila A | 29-Aug-23 | not necessory after Core migration | ends
          }
        }else{
          this.fnSubPages(); //added by UrmilaA | 31-July-23
        }
      } catch (err) {}
    });
  }
  //added by UrmilaA, 24-april-23 | LGTGTWINT-1898 | ends

  fnAfterAuthentication() {

    //Added by Urmila A | 20-feb-23 | LGTGTWINT-1444 | start
    //API Req parameters modified by Urmila A | Core migration | 21-Aug-23
    this.FXDProdDetailsSubscriber = this.FXD_afs.fnGetProdDetailsFXD(    
      this.FXD_afs.UserName,
      ''
    ).subscribe((res) => {
      try {
        if ( res) {
          //Urmila A | LGTGTWINT-1564 | 28-feb-23
          console.log('product details:', res);
          let TRF = [];
          let AQDQ = [];
          let Strategies = []; // Added changes by Mayuri D. on 12-Apr-2023 | As discussed with Karan G. and Sandhya R.
          this.AllProdData = res
         
          //Added by Urmila A | 6-Mar-23 |LGTGTWINT-1688 | start
          //**** sorting logic modified for both LGT,Demo pack by Urmila A | LGTGTWINT - 1887 | 25-April-23 | start
       
          // res.sort((a, b) => (a.Product_Name > b.Product_Name ? 1 : -1));
          res.forEach((element, index) => {
            if (element.Product_Name === 'AQ') {
              AQDQ[0] = element;
              AQDQ[0].displayYN = true;             
              this.subpages.push(AQDQ)
              this.subpages[index].displayYN = true;
              this.subpages[index].name = 'AQ/DQ';             
              this.isAQPresent = true;
            } else if (element.Product_Name === 'DQ') {
              AQDQ[1] = element;
              AQDQ[1].displayYN = true;            
              this.subpages.push(AQDQ)
              this.subpages[index].displayYN = true;  
              this.subpages[index].name = 'AQ/DQ';               
              this.isDQPresent = true;
            } else if (element.Product_Name === 'TARF Buy') {
              TRF[0] = element;
              TRF[0].displayYN = true;             
              this.subpages.push(TRF)
              this.subpages[index].displayYN = true;  
              this.subpages[index].name = 'TRF';                  
              this.isTRFbuyPresent = true;
            } else if (element.Product_Name === 'TARF Sell') {
              TRF[1] = element;
              TRF[1].displayYN = true;             
              this.subpages.push(TRF)
              this.subpages[index].displayYN = true;  
              this.subpages[index].name = 'TRF';                  
              this.isTRFsellPresent = true;
            }           
            else if (element.Product_Name === 'Strangle') {
              Strategies[0] = element;
              Strategies[0].displayYN = true;     
              this.StrategySubtype.push(element)       
              this.subpages.push(Strategies)
              this.subpages[index].displayYN = true;  
              this.subpages[index].name = 'Strategies';                 
            } else if (element.Product_Name === 'Straddle') {
              Strategies[1] = element;
              Strategies[1].displayYN = true;    
              this.StrategySubtype.push(element)        
              this.subpages.push(Strategies)
              this.subpages[index].displayYN = true;  
              this.subpages[index].name = 'Strategies';             
            } else if (element.Product_Name === 'Risk Reversal') {
              Strategies[2] = element;
              Strategies[2].displayYN = true;   
              this.StrategySubtype.push(element)         
              this.subpages.push(Strategies)
              this.subpages[index].displayYN = true;  
              this.subpages[index].name = 'Strategies';                 
            }else if(element.Product_Name === 'Option Spread'){
              Strategies[3] = element;
              this.StrategySubtype.push(element)
              Strategies[3].displayYN = true;            
              this.subpages.push(Strategies)
              this.subpages[index].displayYN = true;  
              this.subpages[index].name = 'Strategies';  
            }
	          //Added by Chaitanya | 18 July 2023 
            else if(element.Product_Name === 'DCI'){
              element.displayYN = false;   
              element.activeYN = false;                          
            } 
            //End
            else {
              //Urmila A | 8-Mar-23
              // OtherProducts.push(element)
              this.subpages.push(element);
              element.name = element.Product_Name;
              element.displayYN = true;
            }
            this.dataFlag = true;
          });     
          this.subpages=this.subpages.filter((nane, index) => this.subpages.indexOf(nane) === index);
          this.subpages[0].activeYN = true;
          // this.subpages.push(...this.subpages);
       
          //Currently dummy data added for UI developemnt purpose by UrmilaA | 17-July-23 | start
          // this.subpages.push({Internal_Product_Class : "DCD",
          //   Product_Id :   "16",
          //   Product_Name:  "DCI",
          //   Scheme_Name :   "Premium Currency Investment",
          //   Template_Code :  "DCD",
          //   Template_Id  :   "17",
          //   Template_Name :   "Premium Currency Investment",
          //   displayYN:true, 
          //   name:'DCI',
          //   product_code :  "DCD"})
          //Currently dummy data added for UI developemnt purpose by UrmilaA | 17-July-23 | ends

          console.log('subpages arr:', this.subpages);
          this.fnLoadLandingPageYN();  //added by UrmilaA | LGTGTWINT-1946 | 2-may-23
          //**** sorting logic modified for both LGT,Demo pack by Urmila A | LGTGTWINT - 1887 | 25-April-23 | ends
         
          this.fnGetConfigForDealEntry() //Added by UrmilaA, LGTCLI-361 | 23-May-23

        }
      } catch (err) {}
    });
    //end

    //commented by Urmila A, as no USE of below API here | 21-feb-23 | start
    // this.CustAPI.getPledgedAgainstData('CSP_FXDProductsLevelAccessUserType').subscribe((res) => {
    //   if (res) {
    //     // this.fnLoadValuesInSubPage();
    //     res.Get_Configurable_Common_DataResult.forEach((element) => {
    //       if (element) {
    //         this.subpages.forEach((res) => {
    //           if (res.name === element.DATA_VALUE) {
    //             res.displayYN = element.Misc1.split(',').includes(
    //               sessionStorage.getItem('FinIQGroupID').toString()
    //             );
    //           }
    //         });
    //       }
    //     });
    //   }
    // });
  }

  
  //UrmilaA, LGTCLI-361 | 22-May-23 | start
  fnGetConfigForDealEntry(){
    //API req modified by Urmila A | 21-Aug-23 | core migration
    this.FXDConfigSubscriber = this.FXD_afs.FXDGetConfigsForDealEntryAPI(this.FXD_afs.EntityID, this.FXD_afs.UserName )
    .subscribe((res:any)=>{
      try{
            if(res){              
              res=res.configs
              // console.log('RFQ/RFS config res:',res)
              if(res !== null){
                  res?.forEach(element => {
                          if(element.Setting_Name === 'FXDEnableWebsocketForPricing' && element.Value.toLowerCase() === 'yes'){
                                this.ShowRFS=true;
                                console.log('RFQ/RFS config res:',element)      
                                  this.SignalR.closeSignalR()     //added by UrmilaA | 6-June-23                                                    
                                  this.SignalR.firstloadSignalR()        //function name changed by UrmilaA | LGTCLI-361                           
                          }else if(element.Setting_Name === 'FXDEnableWebsocketForPricing' && element.Value.toLowerCase() === 'no'){
                                  this.ShowRFS=false;
                                  console.log('RFQ/RFS config res:',element, this.ShowRFS); // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
                          }
                  });
              }
              else{
                this.ShowRFS=false; //added by UrmilaA | 7-June-23 | LGTCLI-361              
              }
            
            }
      }catch(err){console.log(err)}
    })
}
//UrmilaA, LGTCLI-361 | 22-May-23 | ends

  fnLoadLandingPageYN() {
    this.ShowLandingPageYN = AppConfig.settings.CSP_DisplayFXDLandingYN;
    console.log('AppConfig',AppConfig.settings)
    if (!this.ShowLandingPageYN) {
      try {
        if (this.data !== undefined) {
          //modified by Urmila A | LGTGTWINT-1758, 28-Mar-23
          if (this.data.redirectFrom === 'quotehistory') {
            //PIVOT case changed by Urmila A, 30-Mar-23
            this.fnchangeProduct(
              this.data.Product === 'FXAQ' || this.data.Product === 'FXDQ'
                ? 'AQ/DQ'
                : this.data.Product === 'TEKO' ||
                  this.data.Product === 'TARFSELL'
                ? 'TRF'
                // : this.data.Product === 'PIVOT'
                // ? 'Pivot'
                : (this.data.ProductName === 'Strangle'  ||  this.data.ProductName === 'Straddle' ||
                this.data.ProductName=== 'Risk Reversal' ||  this.data.ProductName === 'Option Spread') ? 
                'Strategies' : 
                this.data.ProductName,
              'navigate'
            );
            this.data = undefined;
          } else if (this.data.redirectFrom === 'blotter') {
            //bindings changed to uppercase by Urmila A | 2-Nov-23
            this.RFQDetailsFromBlotterYes_QueueStatus = this.data.STATUS; 
            this.fnchangeProduct(
              this.data.PRODUCT_CODE === 'FXAQ' ||
                this.data.PRODUCT_CODE === 'FXDQ'
                ? 'AQ/DQ'
                : this.data.PRODUCT_CODE === 'TEKO' ||
                  this.data.PRODUCT_CODE === 'TARFSELL'
                ? 'TRF'
                : (this.data.TEMPLATECODE === 'Strangle'  ||  this.data.TEMPLATECODE === 'Straddle' ||
                this.data.TEMPLATECODE === 'Risk Reversal' ||  this.data.TEMPLATECODE === 'Option Spread') ? 
                'Strategies' : 
                this.data.TEMPLATECODE,
              'navigate'
            );
            this.data = undefined;
          }
        } else {
          this.fnchangeProduct(this.subpages[0].name, 'click'); //added by UrmilaA | LGTGTWINT-1946 | 2-may-23
        }
      } catch (ex) {
        this.fnchangeProduct(this.subpages[0].name, 'click'); //added by UrmilaA | LGTGTWINT-1946 | 2-may-23
      }
    }
  }

  fnLoadValuesInSubPage() {
    this.subpages = [
      // {
      //   name: 'Vanilla',
      //   Product_Id: '27',
      //   Product_Code: 'FXOption',
      //   Product_Name: 'Vanilla',
      //   displayYN: true,
      //   activeYN: true,
      // },
      // {
      //   name: 'Barrier',
      //   Product_Id: '28',
      //   Product_Code: 'FXBarrier',
      //   Product_Name: 'Barrier',
      //   displayYN: true,
      //   activeYN: false,
      // },
      // {
      //   name: 'Digital',
      //   Product_Id: '106',
      //   Product_Code: 'Digital',
      //   Product_Name: 'Digital',
      //   displayYN: true,
      //   activeYN: false,
      // },
      // {
      //   name: 'Strategies',
      //   Product_Id: '',
      //   Product_Code: 'STRADDLE',
      //   Product_Name: 'Straddle',
      //   displayYN: true,
      //   activeYN: false,
      // },
      {
        name: 'AQ/DQ',
        Product_Id: '11', // 33 Changed by Ketan
        // Product_Code: 'FXAccum',
        Product_Code: 'FXAQ', // 'FXAQ', Changed by Mohan
        Product_Name: 'AQ', //'FXAQ', Changed by Mohan
        Template_Name: '', //Added by Urmila A | LGTGTWINT-1444| 20-feb-23
        Template_Code: '', //Added by Urmila A | LGTGTWINT-1444 | 20-feb-23
        TemplateID: '', //Added by Urmila A | LGTGTWINT-1444 | 20-feb-23
        displayYN: true,
        activeYN: true,
      },

      {
        name: 'TRF',
        Product_Id: '13', //changed by Urmila A
        Product_Code: 'TEKO',
        Product_Name: 'TARF Buy',
        Template_Name: '', //Added by Urmila A | LGTGTWINT-1444 | 20-feb-23
        Template_Code: '', //Added by Urmila A | LGTGTWINT-1444 | 20-feb-23
        TemplateID: '', //Added by Urmila A | LGTGTWINT-1444 | 20-feb-23
        displayYN: true,
        activeYN: false,
      },

      {
        name: 'Pivot',
        Product_Id: '15', //changed by Urmila A
        Product_Code: 'Pivot',
        Product_Name: 'Pivot',
        Template_Name: '', //Added by Urmila A | LGTGTWINT-1444 | 20-feb-23
        Template_Code: '', //Added by Urmila A | LGTGTWINT-1444 | 20-feb-23
        TemplateID: '', //Added by Urmila A | LGTGTWINT-1444 | 20-feb-23
        displayYN: true,
        activeYN: false,
      },

      // {
      //   name:'TARF Sell',
      //   Product_Id: '13', //changed by Urmila A
      //   Product_Code: 'TEKO',
      //   Product_Name: 'TARF Buy',
      //   displayYN: false,
      //   activeYN: false,

      // }

      // {
      //   name: 'DCI',
      //   Product_Id: '51',
      //   Product_Code: 'DCD',
      //   Product_Name: 'Dual Currency Investment',
      //   displayYN: true,
      //   activeYN: false,
      // },
    ];
  }

   //added by UrmilaA | currently added dummy data for UI purpose will remove once core6 APIs are hosted | 31-July-23 | start
   fnSubPages(){
    this.subpages =
    [
      [
          {
              "Product_Id": "11",
              "product_code": "FXAQ",
              "Product_Name": "AQ",
              "Internal_Product_Class": "FXAccum",
              "Scheme_Name": "FxAccumulator",
              "Template_Id": "11",
              "Template_Code": "FxAccum",
              "Template_Name": "AQ",
              "displayYN": true
          },
          {
              "Product_Id": "12",
              "product_code": "FXDQ",
              "Product_Name": "DQ",
              "Internal_Product_Class": "FXAccum",
              "Scheme_Name": "FXDecum",
              "Template_Id": "12",
              "Template_Code": "DQ",
              "Template_Name": "FX DQ",
              "displayYN": true
          },
        
      ]
      ,
      [
          {
              "Product_Id": "13",
              "product_code": "TEKO",
              "Product_Name": "TARF Buy",
              "Internal_Product_Class": "TEKO",
              "Scheme_Name": "TARFBUY",
              "Template_Id": "13",
              "Template_Code": "TARFBUY",
              "Template_Name": "TRF Buy",
              "displayYN": true
          },
          {
              "Product_Id": "14",
              "product_code": "TARFSELL",
              "Product_Name": "TARF Sell",
              "Internal_Product_Class": "TARFSELL",
              "Scheme_Name": "TARF SELL",
              "Template_Id": "14",
              "Template_Code": "TARFSELL",
              "Template_Name": "TRF Sell",
              "displayYN": true
          }
      ],
      {
          "Product_Id": "15",
          "product_code": "Pivot",
          "Product_Name": "Pivot",
          "Internal_Product_Class": "Pivot",
          "Scheme_Name": "PivotTarn",
          "Template_Id": "15",
          "Template_Code": "PivotTarn",
          "Template_Name": "Pivot",
          "name": "Pivot",
          "displayYN": false, //true
          "activeYN": false
      }, 
      //Added by Urmila A | 28-Aug-23 | start
        {
          "Product_Id": "1",
          "product_code": "FXOption",
          "Product_Name": "Vanilla",
          "Internal_Product_Class": "FXOption",
          "Scheme_Name": "FXOption",
          "Template_Id": "1",
          "Template_Code": "VFXO",
          "Template_Name": "Vanilla",
          "name": "Vanilla",
          "displayYN": true,
          "activeYN": true
        },
        {
          "Product_Id": "2",
          "product_code": "FXBarrier",
          "Product_Name": "Barrier",
          "Internal_Product_Class": "FXBarrier",
          "Scheme_Name": "FXBarrier",
          "Template_Id": "2",
          "Template_Code": "FXExotic",
          "Template_Name": "Barrier",
          "name": "Barrier",
          "displayYN": true,
          "activeYN": false
        },
       //Added by Urmila A | 28-Aug-23 | ends
    ]

    this.subpages[0].name="AQ/DQ"
    this.subpages[0].displayYN=false //true
    this.subpages[0].activeYN=false //true
    this.subpages[1].name="TRF"
    this.subpages[1].displayYN=false //true
    this.subpages[1].activeYN=false
    console.log('subpages:',this.subpages)
  }
  //added by UrmilaA | currently added dummy data for UI purpose | 31-July-23 | ends

  fnchangeProduct(choice, from) {
    if (from === 'click') {
      if (choice !== '') {
        this.InputData = undefined;
        this.data = undefined;
        // this.commonApi.HideSidebar(true);
        this.IsLandingPage = false;
        this.subpages.forEach((res) => {
          if (res) {
            if (res.name === choice) {
              res.activeYN = true;
            } else {
              res.activeYN = false;
            }
          }
        });
      }
    } else {
      if (choice !== '') {
        // this.commonApi.HideSidebar(true);
        this.IsLandingPage = false;
        this.subpages.forEach((res) => {
          if (res) {
            if (res.name === choice) {
              res.activeYN = true;
            } else {
              res.activeYN = false;
            }
          }
        });
      }
    }
  }

  closeProduct() {
    // this.commonApi.HideSidebar(false);
    this.IsLandingPage = true;
    this.ngOnInit();
  }

  fnSwitchAutoManualMode() {
    // this.SwitchAutoManual ?  this.SwitchAutoManual = false : this.SwitchAutoManual = true;
  }

  logout() {
    // this.appComponent.logout();
  }
}
