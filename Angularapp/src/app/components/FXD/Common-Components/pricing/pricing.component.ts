import {
  Component,
  OnInit,
  Input,
  Output,
  SimpleChanges,
  OnDestroy,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FxdApifunctionService } from '../../services/fxd-apifunction.service';
import { FxdCommonfunctionsService } from '../../services/fxd-commonfunctions.service';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss', '../../products/aqdq/aqdq.component.scss' ],
})
export class PricingComponent implements OnInit, OnDestroy, OnChanges {
  @Input() startLoading: any;
  @Input() data: any;
  @Input() ClearFlag: any;
  @Input() Product_code: any;
  @Input() Product_ID: any;
  @Input() Mode: string;
  @Input() UserGroup: string;
  @Input() PricingMode: string;
  @Input() LP: string;
  @Input() ViewMode: string;
  @Input() QuoteValidity:string; 
  @Input() SolveforStrike :boolean; // Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023 
  @Input() yield:any; //Added by UrmilaA | 29-Dec-23 | to show Yield for DCI

  @Output() TradedLPDetails = new EventEmitter<any>();
  @Output() EnablePrembtn = new EventEmitter<boolean>();
  @Output() DisableTradeButton = new EventEmitter<boolean>();
  @Output() DisableLoader = new EventEmitter<boolean>();

  //Added by Urmila A
  @Input() RFQNODisplayFromParent:any;
  @Input() ProdChangedYN:any;
  @Input() incomingLPs:any;
  @Input() RouteFromWorkflow:any;
  @Input() ClearLPs:boolean;
  @Input() isOrderBtnVisible:boolean;
  @Input() LPname:any;

  //Start : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
  @Input() Notional :any;
  @Input() PreminPipsToggle:any; 
  @Input() Strike :any; 
  @Input() PointShift:any; 
  @Input() IBPremCCY :any;
  @Input() NotionalCCY :any;
  @Input() DepCcy : any;
  //End : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024

  @Input() ShowPremAmtConfig : any; // Added By Anmol B || 15-Apr-2024 || JIRA ID : F5SAAINT-3655 

  @Input() ShowPriceProvider : any; 

  LPs:any[] = [];
  PriceProviderString: string;
  interval: any;
  BookingFlag: boolean = false;
  GetPriceProviderDetailsSubscription: Subject<void> = new Subject<void>();
  RFQNo: any;
  RFQNODisplayYN: boolean = false;
  LPRes: any;
  IsRMLoggedIn: boolean;
  IsIALoggedIn:boolean
  SelectedLPforTrade: any;
  stopDealLoadingFlag: boolean=true;
  disableonsaveTrade = false // Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P.
  currentSGTime:any;
  ShowPerctSign:any; // Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
  setSmallFont :any = "false"; // F5SAAINT-2228 | UI Distortion on price with large length | Chaitanya M | 04-March-2024

  // added by UrmilaA, 18-May-23 | LGTCLI-361 | start
  @Input() showRFS: any; //UrmilaA, 20-April-23 | LGTCLI-361
  bestPriceAlreadyExist: any;
  bestPriceIndex: any=0;
  bestpriceLP: any = '';
  RFSResSubscriber: any;
  pricecnt:any=0;
  cnt:any=0;
  @Input() OrderBtnEnable:boolean;
  @Input() signalRMsgRecv:any; //UrmilaA, 22-May-23
  @Input() PriceClick:any;
  isQENMode: boolean;
  // added by UrmilaA, 18-May-23 | LGTCLI-361 | ends

  LPbestPrice = {}; // Added By Anmol B || 12-Apr-2024 || JIRA ID : F5SAAINT-3655
  BestPriceRecieved = false; // Added By Anmol B || 12-Apr-2024 || JIRA ID : F5SAAINT-3655

  constructor(
    private FXDApi: FxdApifunctionService,
    private FXDCommonfun: FxdCommonfunctionsService,
    public AuthorAPI: AuthService,
    public fxd_cfs: FxdCommonfunctionsService
  ) {
    this.PriceProviderString = '';
    this.LPRes = [];
    
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this.fnReset();
    this.fnStopTimer(); //UrmilaA, LGTCLI-361 | 18-may-23
    if(!this.RFQNODisplayFromParent){this.RFQNODisplayYN=false}
    // This aborts all HTTP requests.
    this.GetPriceProviderDetailsSubscription.next();
    // This completes the subject properlly.
    this.GetPriceProviderDetailsSubscription.complete();

    if(this.RFSResSubscriber){ //added by UrmilaA,LGTCLI-361 | 17-May-23
      this.RFSResSubscriber.unsubscribe()
    }
   
  }

  ngOnInit(): void {

    //added by UrmilaA | LGTGTWINT-2137 (Usertype checks replaced with Mode)| 16-june-23 |start
    if(this.fxd_cfs.fngetMode() == 'QEN'){
      this.isQENMode=true;
    }
    
    console.log('incoming Lps' , this.incomingLPs,this.startLoading,'ViewMode',this.ViewMode)
    this.fnonloadLPs(this.incomingLPs); //Added by Urmila A | 16-Feb-23 | removed api call, as were creating redundancy
    // this.fnDefault();  //Commented by Urmila A | 16-Feb-23 | removed api call, as were creating redundancy
   
    if (this.startLoading) {
      this.fnReset();
    }

    this.FXDCommonfun.DealBookedObs.subscribe((res:any)=>{
      try{
        if(res === false){
          this.stopDealLoadingFlag=false;
        } 
      }catch(err){}
    });

    // ---START--- Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P.
    this.FXDApi.SaveTradeBtnFlagObserver.subscribe((res)=>
    {
      if(res)
      {
        this.disableonsaveTrade = res
        this.OrderBtnEnable=false;
        // this.BookingFlag  = res
        console.log("dis" , this.disableonsaveTrade)
      }
    })
    // ---END--- Added changes by Mayuri D. on 16-Dec-2022 | as discussed with Rahul P.

      //Added by Urmila A, 18-May-23, LGTCLI-361 | start
    this.RFSResSubscriber = this.FXDApi.RFSResObs.subscribe((res: any) => {
      try {
        if (res) {
          console.log('updated RFS response:', res);
          if (res !== null &&  res.length > 0 && res !== undefined) {
            this.pricecnt=this.pricecnt+1; //added by UrmilaA, 22-may-23 |  LGTCLI-361
            this.showRFS = true;
            this.data = [];        
            this.bestPriceAlreadyExist = false;
            this.data = res;  
            this.fnRFSPrice(res);
          }else{ // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023 
            this.showRFS = false;       
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
    //Added by Urmila A, 18-May-23, LGTCLI-361 | end


  }
  

  //Added by Urmila A | 16-Feb-23 | removed api call, as were creating redundancy
  fnonloadLPs(LPsArr){
    this.LPRes=[];
    this.LPs=[];
    this.LPRes = this.LPs = LPsArr;
    this.LPs?.forEach((element, _index) => {
      element.price = 0;
      element.IsBestPrice = false;
      element.totalTime = 0;
    });
    console.log(this.LPs);
  }

  ngOnChanges(_changes: SimpleChanges): void {
    //TO check the Pricing LP
    console.log('ready', 'this.ClearLPs', this.ClearLPs,this.PriceClick );
    console.log('buttons:',this.OrderBtnEnable);

    this.BestPriceRecieved = false; // Added By Anmol B || 12-Apr-2024 || JIRA ID : F5SAAINT-3655
    this.LPbestPrice = []; // Added By Anmol B || 12-Apr-2024 || JIRA ID : F5SAAINT-3655
  
    // this.LPs=[]
    // console.log('ProdChangedYN:',this.ProdChangedYN,'Product_code',this.Product_code)
    if(this.ProdChangedYN){
      this.LPs = this.incomingLPs;
      console.log('updated LPs',this.LPs)
    }
    if((this.LP !== 'Best Price') && (this.LP !== 'Best')){
      this.LPs = this.LPRes.filter((lp) => lp.PP_Name === this.LP);
    }else{
      this.LPs = this.LPRes;
    }
   
    if (this.ClearFlag || this.PriceClick) {
      //added by UrmilaA, LGTCLI-361 | 18-may-23
      this.BookingFlag = false;
      this.fnReset();
      this.fnStopTimer(); //added by UrmilaA, LGTCLI-361 | 18-may-23
    } else if (this.LPs.length > 0 && this.ClearLPs) {
      this.fnReset();
      this.fnStopTimer(); //added by UrmilaA, LGTCLI-361 | 23-may-23
    } else {
      console.log('data: ', this.data);
      switch (this.PricingMode) {
        case 'AUTO':

          if(this.LP !== 'Best' && this.LP !== 'Best Price'){ 

            // Start - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023 
            if(this.SolveforStrike !== true) {
              this.ShowPerctSign = "%";
            }
            // End - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
            
            this.LPs = this.LPRes.filter((lp) => lp.PP_Name === this.LP);
            if(!this.showRFS){   // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023
              this.fnSetPrices(); 
            }
          }else{
            this.LPs = this.LPRes;

            // Start - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
            if(this.SolveforStrike !== true) {
              this.ShowPerctSign = "%";
            }
            // END - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023

            if(!this.showRFS){   // Added by Chaitanya M / Urmila A LGTCLI-361 || 20 May 2023
              this.fnSetPrices(); 
            }
          }
          
          break;
        case 'MANUAL':
          this.LPs = this.LPRes.filter((lp) => lp.PP_Name === this.LP);
          this.fnSetManualPrices();

          break;
      }
    }
  }

  fnReset() {
    this.data = [];
    this.fnStopTimer();
    //modified by urmilaA, LGTCLI-361 | 18-May-23 | start
    this.bestPriceAlreadyExist = false;
    this.bestPriceIndex = 0;
    this.bestpriceLP = '';
    console.log('OrderBtnEnable',this.OrderBtnEnable)
    // this.OrderBtnEnable=false; //UrmilaA, 22-May-23, LGTCLI-361
 
    this.cnt=0;
    this.pricecnt=0;
    //modified by urmilaA, LGTCLI-361 | 18-May-23 | ends

    this.LPs?.forEach((element) => {
       // element.IsBestPrice=false; //not showing first best price , so keep it commented | LGTCLI-361 | 18-May-23
      element.price = 0;    
      element.totalTime = 0;
      clearInterval(element.interval); //added by UrmilaA, 18-May-23 | LGTCLI-23
      element.validResponseReceived=false  // added by UrmilaA | 17-July-23 | LGTGTWINT-2225
      element.Yield=0; //UrmilaA | 2-Jan-24 | reset yield
    });
    this.DisableTradeButton.emit(true);
    this.RFQNODisplayYN = false;
    this.RFQNo = '';
   
  }

  fnDefault(): void {
    console.log("pp details ", this.Product_code);
    this.FXDApi.GetPriceProviderDetails(
      this.FXDApi.EntityID,
      this.Product_ID,
      this.Mode,
      this.UserGroup,
      '',
      this.PricingMode,
      //Core migration: API req parameters are modified | Urmila A | 22-Aug-23
    ).subscribe( async (res) => {
      if (res.GetFXDPriceProviderDetailsResult.PriceProviderDetails) {
        // console.log('in pricing PP details:',res)
        this.LPRes=[];
        this.LPs=[];
        this.LPs = res.GetFXDPriceProviderDetailsResult.PriceProviderDetails;
        this.LPRes = res.GetFXDPriceProviderDetailsResult.PriceProviderDetails;
        let HSBCIndex: number = 0;
        let FoundHSBC: boolean = false;

        this.LPs.forEach((element, _index) => {
          element.price = 0;
          element.IsBestPrice = false;
          element.totalTime = 0;

          // if(element.PP_Code !== 'HSBC'){
          //   this.PriceProviderString === '' ? (this.PriceProviderString = '' + element.PP_Code) : (this.PriceProviderString = this.PriceProviderString + ':' + element.PP_Code);
          // }else{
          //   FoundHSBC = true;
          //   HSBCIndex = _index;
          // }
        });

        FoundHSBC ? this.LPs.splice(HSBCIndex, 1) : '';
        console.log('this.LPs:',this.LPs)
        console.log(this.LPs);
      }
    });
   
  }

  fnSetPrices() {
    try {
      this.ClearLPs = false;     
      let BestPriceLPName: any;
      if(this.data[0] !== undefined){
        BestPriceLPName = this.data[0] !== undefined ? this.data[0].bestPriceProvider.split(':')[0] : '';  //added by UrmilaA, 22-may-23 | LGTCLI-361
      }  
      // this.disableonsaveTrade = false;
    
      console.log('Master check For Detting Best Price ', this.data, this.LPs);
      this.data?.forEach((RateElement) => {
        this.LPs?.forEach((LPElement) => {
          if (RateElement.provider === LPElement.PP_Code) {
            LPElement.o_DCDRFQID = RateElement.o_DCDRFQID;
            LPElement.provider = RateElement.provider;
            LPElement.quoteId = RateElement.quoteId;
            LPElement.Yield = RateElement.Yield.toFixed(4) // Yield added by UrmilaA | UrmilaA | 3-jan-24
            LPElement.priceAMT = RateElement.premiumAmount ; // Added By Anmol B || 12-Apr-2024 || JIRA ID : F5SAAINT-3655

            // Start - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023
            if(this.SolveforStrike !== true){
              if (RateElement.premium !== 0) {
                LPElement.price = RateElement.premium ;        
              }
            }else{
              if (RateElement.strike !== 0) {
                LPElement.price = RateElement.strike;          
              }
            } 
            // END - Solve For changes | F5SAAINT-399 | Chaitanya M | 21 Nov 2023   
            
            //Start : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024
            if(this.PreminPipsToggle !== "%"){
              this.ShowPerctSign = '';
              LPElement.price = this.fxd_cfs.ConvertIntoPIPs(this.Notional.replaceAll(',', ''), this.Strike.replaceAll(',',''), RateElement.premiumAmount, this.PointShift, this.IBPremCCY, this.NotionalCCY,this.DepCcy);
            }
            //End : HSBCFXEINT-79 UAT- Pricing in pips & % | ChaitanyaM | 06-March-2024

            LPElement.validResponseReceived = RateElement.validResponseReceived; //Urmila A | 1-Mar-23 | LGTGTWINT-1576
	         
            // Added by Urmila A | 4-Nov-22 | start | Quote validity time shouldn't be hardcoded
            //commented by Urmila A | 27-feb-23
            // RateElement.validTill = new Date(RateElement.validTill).toUTCString();
            // this.currentSGTime = new Date(this.currentSGTime)

            // RateElement.quoteResponseAt = new Date(RateElement.quoteResponseAt);
            // LPElement.totalTime = (RateElement.validTill.getTime() -  RateElement.quoteResponseAt.getTime()) /1000
            // LPElement.totalTime = ((RateElement.validTill.getTime() - this.currentSGTime.getTime()) /1000 ) //Modified logic, LGTGTWINT-480

            LPElement.totalTime = this.fxd_cfs.calculateRemainingSecondsFXD(
              new Date(RateElement.validTill)
            ); //Urmila A | 27-feb-23 | start

            // Added by Urmila A | 4-Nov-22 | end
            LPElement.totalTime = Math.max(LPElement.totalTime, 0); //Urmila A | 15-feb-23

            //modified by UrmilaA, 18-May-23 | LGTCLI-361 | starts
            if (Number(LPElement.price) !== 0 && LPElement.totalTime > 0) {          
                console.log('clear lp in  interval', this.ClearLPs);
                if ((LPElement.interval && LPElement.totalTime) !== 0) {
                  LPElement.interval = setInterval(() => {                  
                    if (LPElement.totalTime > 0) {
                      LPElement.totalTime = LPElement.totalTime - 1;
                    }
                    if (LPElement.totalTime === 0) {
                      clearInterval(LPElement.interval);
                    }
                    
                  }, 1000);
                }
              
            } else {
              LPElement.totalTime = 0;
              clearInterval(LPElement.interval);
            }
            //modified by UrmilaA, 18-May-23 | LGTCLI-361 | ends

            this.BookingFlag = false; // Active Trade Button on price come
            if (LPElement.price !== 0) {
              // LPElement.price = this.FXDCommonfun.fnFormatNumber(LPElement.price, AppConfig.settings.BestPrice_PremiumRoundingDecimals);
              LPElement.price = this.FXDCommonfun.fnFormatNumber(
                LPElement.price,
                4
              );
              
              // Start : F5SAAINT-2228 | UI Distortion on price with large length | Chaitanya M | 04-March-2024
              let pricelength  = LPElement.price.toString().length;
              if(pricelength > 6){
                this.setSmallFont ="true"; 
              }else{
                this.setSmallFont = "false";
              }
              // End : F5SAAINT-2228 | UI Distortion on price with large length | Chaitanya M | 04-March-2024
              
            }
          }
          //Added by UrmilaA, 18-May-23, LGTCLI-361 | start   
            if (LPElement.PP_Code === BestPriceLPName) {
              LPElement.IsBestPrice = true;           
            }         
          //Added by UrmilaA, 18-May-23, LGTCLI-361 | ends
          
        });
      });
      console.log('LPs::',this.LPs)
      this.RFQNo = this.LPs[0].o_DCDRFQID;
      this.RFQNODisplayYN = true;
  
      // < START : Added By Anmol B || 12-Apr-2024 || JIRA ID : F5SAAINT-3655 >
      for (let i of this.LPs){
        if(i.IsBestPrice){
          this.LPbestPrice = i;
          this.BestPriceRecieved = true;
          break;
        }
        // < END : Added By Anmol B || 12-Apr-2024 || JIRA ID : F5SAAINT-3655 >
      }
    } catch (Ex) {
      // console.log('Exception caught at fnSetPrices()...', Ex);
    }
  }

 
  //added by UrmilaA, LGTCLI-361 | 19-May-23 | start
  fnRFSPrice(data) {
    this.ClearLPs = false;
    // this.disableonsaveTrade = false;   
   
  
    data.forEach((RateElement) => {
      this.LPs.forEach((LPElement, index) => {
        if (RateElement.provider === LPElement.PP_Code) {
          if (RateElement.o_DCDRFQID !== null) {
            LPElement.o_DCDRFQID = RateElement.o_DCDRFQID;
          }

          if (RateElement.premium !== 0) {
            LPElement.price = RateElement.premium;          
          }

          if (RateElement.validTill !== null) {

            // Added  Urmila A LGTCLI-361 || 22 May 2023 
             if(RateElement.IsBestPrice === 'N') {
              this.cnt=this.cnt+1;
            }
            //End

            LPElement.totalTime = this.fxd_cfs.calculateRemainingSecondsFXD(
              new Date(RateElement.validTill)
            ); //Urmila A |
            LPElement.totalTime = Math.max(LPElement.totalTime, 0); //Urmila A | 15-feb-2327-feb-23 | start

            //modified by UrmilaA, 18-May-23 | LGTCLI-361 | starts
            if (Number(LPElement.price) !== 0 && LPElement.totalTime > 0) {
              LPElement.validResponseReceived = true;
              if ((RateElement.alreadyMapped === undefined) === true) {
                console.log('clear lp in  interval', this.ClearLPs);
                if ((LPElement.interval && LPElement.totalTime) !== 0) {
                  LPElement.interval = setInterval(() => {
                    if (LPElement.totalTime > 0) {
                      LPElement.totalTime = LPElement.totalTime - 1;
                    }
                    if (LPElement.totalTime === 0) {
                      clearInterval(LPElement.interval);
                    }
                  }, 1000);
                }
              }
            } else {
              LPElement.totalTime = 0;
              clearInterval(LPElement.interval);
            }
            //modified by UrmilaA, 18-May-23 | LGTCLI-361 | ends
           
          }

          LPElement.provider = RateElement.provider;
          LPElement.quoteId = RateElement.quoteId;
          // Added by Urmila A | 4-Nov-22 | end
        
          LPElement.IsBestPrice = RateElement.IsBestPrice === 'Y'

          
         
          if (RateElement.IsBestPrice === 'Y') {
            this.LPs[this.bestPriceIndex].IsBestPrice = false;
            LPElement.IsBestPrice = true;
            this.bestPriceIndex = index;
            this.LPs[this.bestPriceIndex].IsBestPrice = true;         
          } else {         
            LPElement.IsBestPrice = false;
            if(this.cnt !== this.pricecnt){
              this.LPs[this.bestPriceIndex].IsBestPrice = true; 
            }else if(this.cnt === this.pricecnt){
              this.LPs[this.bestPriceIndex].IsBestPrice = false; 
            }
                          
           
           
          }
        }
      });
    });
    console.log('Final LPs', this.LPs);
   
  }

  //added by UrmilaA, LGTCLI-361 | 19-May-23 | ends

  fnSetManualPrices() {
    let BestPriceData = this.data;
    if (!!BestPriceData) {
      this.LPs.forEach((LPElement) => {
        if ( LPElement.PP_Name === this.LP && BestPriceData.IBPremPerc !== undefined) {
          LPElement.totalTime = 60;
          LPElement.provider = LPElement.PP_Code;
          LPElement.price = parseFloat(BestPriceData.IBPremPerc).toFixed(4);
          LPElement.IsBestPrice = true;
          this.RFQNo = BestPriceData.DCDRFQID;
          this.RFQNODisplayYN = true;
          if (Number(LPElement.price) !== 0) {
            LPElement.interval = setInterval(() => {
              if (LPElement.totalTime > 0) {
                LPElement.totalTime = LPElement.totalTime - 1;
              }
              if (LPElement.totalTime === 0) {
                this.fnReset();
                this.fnStopTimer();
              }
            }, 1000);
          } else {
            LPElement.totalTime = 0;
          }
          this.BookingFlag = false; // Active Trade Button on price come
        }
      });
    }
  }
  fnStopTimer() {
    this.LPs?.forEach((res) => {
      res.IsBestPrice = false; //UrmilaA, LGTCLI-361 | 23-May-23
      clearInterval(res.interval);
    });
    this.EnablePrembtn.emit(false);
  }
 
  BookDeal(LPDetails: any) {
    console.log('on click book deal:',LPDetails)
    this.SelectedLPforTrade = LPDetails.PP_Code
    this.BookingFlag = true;
    this.stopDealLoadingFlag=true;
    this.TradedLPDetails.emit(LPDetails);
    this.DisableLoader.emit(this.BookingFlag);
    this.fnStopTimer();
  }

}
