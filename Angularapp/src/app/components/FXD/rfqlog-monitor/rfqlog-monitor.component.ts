import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FxdApifunctionService } from '../services/fxd-apifunction.service';
import { FxdCommonfunctionsService } from '../services/fxd-commonfunctions.service';
import { SharedFxdSpService } from '../services/shared-fxd-sp.service';
// import { NgxPaginationModule } from 'ngx-pagination';
import { ExcelService } from 'src/app/services/excel.service';
import { Router } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-rfqlog-monitor',
  templateUrl: './rfqlog-monitor.component.html',
  styleUrls: [
    './rfqlog-monitor.component.scss',
    '../products/aqdq/aqdq.component.scss',
    '../fxddashboard/fxddashboard.component.scss'
  ], //Urmila A| 7-Sep-23| Inherited global scss
})
export class RFQLogMonitorComponent implements OnInit {
  FXDEntitySubscriber: Subscription;
  EntityData: any[] = [];
  Product_Code: any;
  Products: any[] = [];
  Mode: any;
  Product_ID: any;
  productDetailsSubscriber: Subscription;
  FXDLiveDatePeriodSubscription: Subscription;
  FXDRFQDateSubscription: Subscription;
  FXPriceProvidersubscription: any;
  UserGroup: any;
  PriceProvidersArr: any[] = [];
  Fromdate: any;
  Todate: any;
  LiveFromdate: any;
  LiveTodate: any;
  LogRFQData: any[] = [];
  RFQLogHeaders: any[] = [];

  PriceProviderChecked: boolean = false;
  BKP_RFQdata: any[] = [];
  RFQID: any = '';
  TopRecord: any = 20;
  FXDGetLegPremDetailsSubscriber: any;
  QuoteLegData: any[] = [];
  QuoteIDClicked: boolean = false;
  ShortView: boolean = true;
  LongView: boolean = false;
  RFQLegDataHeaders: any[] = [];
  QuoteId: any;
  legRFQID: any;
  legProvider: any;
  legProduct: any;
  TotalExeDeals: any[] = [];
  ActiveFilter: any = '';
  prodID: any; // HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024
  PP: any;
  RFQLegRowsPerPage: any;
  BKPLegdata: any = [];
  ProductId: any = '0';
  ProviderId: any = '';
  NoRecordsFounds: boolean = false; //Urmila A | LGTGTWINT-1367 | 8-Feb-23
  LoadRFQ: boolean = false; //Urmila A | LGTGTWINT-1367 | 8-Feb-23
  ClubbingId: any;
  // Added changes by Mayuri D. on 7-Dec-2022 | LGTGTWINT : 557 |start
  tempjson: any;
  jsonList: any;
  value: any;
  valueRFQ: any;
  selectedQuoteToExpand: any;
  expandAllQuotes: boolean = false;
  selectedIndex: string;
  showExpandloader: boolean = false;
  ExpandInterval: any;
  nonBestPrice: any = ([] = []);
  //Added changed by Mayuri D. on 24-Mar-2023 | LGTGTWINT - 1743 |
  FilterType: any = 'All'; // HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024
  FilterGroup: any = '';
  RFQSource: any;
  EntityID: any;
  loadLefData: any = undefined; //Urmila A, 30-Mar-23
  NoLegRecordsFounds: boolean = false; //Urmila A, 30-Mar-23

  //Urmila A, LGTCLI-383 | 31-mar-23
  showRFQSrcWarning: boolean = false;
  continueWithRFQ: boolean = false;
  PreviousRFQsrc: any = 'Gateway_Single_Pricer';

  //added by UrmilaA | LGTGTWINT-2138 | 4-July-23 |start
  pages: any[];
  selectedPage: any;
  totalpages: number;
  TotalRecords: any=0;  //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
  itemsPerPage: any = 10;
  currentPage: any = 1;
  //added by UrmilaA | LGTGTWINT-2138 | 4-July-23 |ends

  // Added changes by Mayuri D. on 7-Dec-2022 | LGTGTWINT : 557 |end
  AllowPopulateProductwiseEntity = false; // HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024
  constructor(
    public FXD_afs: FxdApifunctionService,
    public FXD_cfs: FxdCommonfunctionsService,
    public datepipe: DatePipe,
    public sharedFXD_Sp: SharedFxdSpService,
    public excelService: ExcelService,
    public _router: Router
  ) {
    this.Mode = 'FXOQEN';
    this.Product_Code = 'FXOption';
    // this.Product_ID = '2'; //hardcode chnages removed by UrmilaA | 4-Jan-24
    this.UserGroup = sessionStorage.getItem('UserType');
    this.Fromdate = this.Todate = new Date();
    this.PP = 'All';
    this.prodID = '4';

    //Added by UrmilaA, 14-April-23, LGTGTWINT-1876, LGTGTWINT-1867 | start
    if (sessionStorage.getItem('fxd/rfqlogmonitor') === 'SEN') {
      this.RFQSource = 'All';
    } else {
      this.RFQSource = 'Single_Pricer'; //UrmilaA | 6-Dec-23 | as told by RahulP
    }
    //Added by UrmilaA, 14-April-23, LGTGTWINT-1876, LGTGTWINT-1867 | end

    this.EntityID = FXD_afs.EntityID; //LGTGTWINT-1783, Urmila A, 29-Mar-23
  }

  ngOnDestroy() {
    this.LoadRFQ = false; //Urmila A | LGTGTWINT-1367 | 8-Feb-23
    if (this.FXDEntitySubscriber) this.FXDEntitySubscriber.unsubscribe();
    if (this.productDetailsSubscriber)
      this.productDetailsSubscriber.unsubscribe();
    if (this.FXDLiveDatePeriodSubscription)
      this.FXDLiveDatePeriodSubscription.unsubscribe();
    if (this.FXPriceProvidersubscription)
      this.FXPriceProvidersubscription.unsubscribe();
    if (this.FXDRFQDateSubscription) this.FXDRFQDateSubscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    this.fngetEntityDetails();
    await this.fnGetConfigForDealEntry(); // HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024
    this.fnGetProductInfoInit();  // HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024
    this.getRFQLogMonitorHeader();
    this.getLegDataHeader();
    this.FilterGroup = sessionStorage.getItem('fxd/rfqlogmonitor'); //modified by Urmila A, LGTGTWINT-1798 | 3-april-23
  }

  fngetEntityDetails() {
    this.EntityData = [];
    this.FXDEntitySubscriber = this.FXD_afs.getEntityData(this.FXD_afs.UserName) //Core migration : API req paarms, mappings modified by Urmila A | 8-Sep-23
      .subscribe((res: any) => {
        console.log('entity data', res);
        if (res !== null) {
          this.EntityData = res.cvpData;
          this.EntityID = this.EntityData[0].code;
          this.EntityData.forEach((element) => {
            sessionStorage.setItem('FXD_EntityID', element.code);
            console.log('FXD_EntityID',element.code,sessionStorage.getItem('FXD_EntityID'));
          });
          this.FXD_afs.SetCredentials();
          this.fnGetProductInfo();
          this.fnGetRFQDate();
        } else {
          this.NotificationFunction('Error', 'Error', res);
        }
      });
  }
    //modified by Urmila A |2-Mar-23

  // Start : HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024
  fnGetProductInfoInit() {
    this.Products = [];
    //modified request parameters by UrmilaA, LGTGTWINT-1869, 14-April-23
    this.productDetailsSubscriber = this.FXD_afs.fnGetProdDetailsFXD(
      //API Req parameters , mappings modified by Urmila A | Core migration | 8-Sep-23
      this.FXD_afs.UserName,
      ''
    ).subscribe((res) => {
      try {
        if (res !== null) {
          if(this.AllowPopulateProductwiseEntity)
            res = res.filter(x => x.EntityId == this.EntityID);      

          // Changes added by AdittiM on 28-Feb-24 : F5SAAINT-2998 FXD Connect - > Quote and order history all drop down values should be in Ascending order
          this.Products = res.slice()
          .sort((a, b) =>
              a.Product_Name.localeCompare(b.Product_Name));;
               // Changes added by AdittiM on 28-Feb-24 : F5SAAINT-2998 FXD Connect - > Quote and order history all drop down values should be in Ascending order

          // Start: EFGUPINT-71 : PriceProvider not setting | Chaitanya M | 02-Apr-2024
          this.Product_ID =  this.Products[0].Product_Id
          this.fnGetPriceProviders();
          // Start: EFGUPINT-71 : PriceProvider not setting | Chaitanya M | 02-Apr-2024

        } else {
          // this.NotificationFunction("Error", "Error", res)
        }
      } catch (err) {}
    });
  }
  // End : HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024

  //modified by Urmila A |2-Mar-23
  fnGetProductInfo() {
    this.Products = [];
    //modified request parameters by UrmilaA, LGTGTWINT-1869, 14-April-23
    this.productDetailsSubscriber = this.FXD_afs.fnGetProdDetailsFXD(
      //API Req parameters , mappings modified by Urmila A | Core migration | 8-Sep-23
      this.FXD_afs.UserName,
      ''
    ).subscribe((res) => {
      try {
        if (res !== null) {
	
	// Start :  HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024
          if(this.AllowPopulateProductwiseEntity) 
            res = res.filter(x => x.EntityId == this.EntityID);
          this.Products = res.slice().sort((a, b) =>a.Product_Name.localeCompare(b.Product_Name));            
          this.Product_ID =  this.Products[0].Product_Id
          this.fnGetPriceProviders();
	  // End : HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024
	  

        } else {
          // this.NotificationFunction("Error", "Error", res)
        }
      } catch (err) {}
    });
  }

  fnGetPriceProviders() {
    this.PriceProvidersArr = [];
    this.FXPriceProvidersubscription = this.FXD_afs.GetPriceProviderDetails(
      this.EntityID,
      this.prodID,
      this.Mode,
      sessionStorage.getItem('UserType'),
      this.FXD_afs.UserName,
      'AUTO'
    ) //Core migration: API req parameters , mappings are modified | Urmila A | 14-sep-23
      .subscribe((res) => {
        try {
          if (res !== null) {
            this.PriceProvidersArr = res;
          } else {
            // this.NotificationFunction("Error", "Error", res)
          }
        } catch (err) {}
      });
  }

  //Added Function by Mayuri D. on 24-Mar-2023 | LGTGTWINT - 1743 |
  ChangeFilter(e: any) {
    this.FilterType = e.target.value;
    // this.fnGetRFQDate()
  }

  fnGetLiveDatePeriod() {
    //modified request parameters by UrmilaA, LGTGTWINT-1869, 14-April-23
    this.FXDLiveDatePeriodSubscription = this.FXD_afs.FXDGetLiveDatePeriodAPI(
      this.EntityID,
      this.FXD_afs.UserName,
      this.Product_Code
    ).subscribe((res: any) => {
      try {
        if (
          res &&
          this.FXD_cfs.fnCheckSessionValidity(res.Get_LiveDatePeriodResult)
        ) {
          console.log('live date res=>', res);
          this.LiveFromdate = this.FXD_cfs.convertDate(
            new Date(
              parseInt(
                res.Get_LiveDatePeriodResult.LiveDatePeriod[0].Min_Date.substr(
                  6
                )
              )
            )
          );
          this.LiveTodate = this.FXD_cfs.convertDate(
            new Date(
              parseInt(
                res.Get_LiveDatePeriodResult.LiveDatePeriod[0].MAX_Date.substr(
                  6
                )
              )
            )
          );
        }
      } catch (err) {
        // throw err // Commented By Ketan S due to Interceptor stability issue
      }
    });
  }
  
  //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('-');
    return new Date(`${year}-${this.getMonthNumber(month)}-${day}`);
  }
  
  // Helper function to get the month number from the month abbreviation
  getMonthNumber(month: string): string {
    const months: { [key: string]: string } = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };
  
    return months[month];
  }
  //Added by Urmila A | Modified req parametrs, LGTGTWINT-694, | 5-Jan-23
  fnGetRFQDate() {
    const FDate = this.FXD_cfs.convertDate(this.Fromdate);
    const TDate = this.FXD_cfs.convertDate(this.Todate);
    const parsedFDate = this.parseDate(FDate);
    const parsedTDate = this.parseDate(TDate);
    this.BKP_RFQdata = [];
    this.LogRFQData = [];
    this.LoadRFQ = true; //Urmila A | LGTGTWINT-1367 | 8-Feb-23
    let selectedRFQSrc = this.RFQSource; //added by Urmila A,  LGTCLI-383 ,  3-April-23
    this.Mode = this.FXD_cfs.GetQuoteHistoryMode(
      sessionStorage.getItem('fxd/rfqlogmonitor'),
      this.FilterType
    );
    if(parsedFDate > parsedTDate){
      this.LoadRFQ = false;
      //Changes by AdittiM on 29-Feb-24 : F5SAAINT-3097 FXD Connect -> Quote and Order History : Alignment issue in grid and record count issue
      this.TotalRecords=0;
      this.TotalExeDeals = [];
      this.pages=[];
      //Changes by AdittiM on 29-Feb-24 : F5SAAINT-3097 FXD Connect -> Quote and Order History : Alignment issue in grid and record count issue
      this.NotificationFunction("Error", "Error", 'Invalid Date Selection') // Gaurav M || F5SAAINT-748
    }
    else{
      this.FXDRFQDateSubscription = this.FXD_afs.FXDGetFXORFQDataAPI(
        this.EntityID,
        this.FXD_afs.UserName,
        FDate,
        TDate,
        this.ProviderId,
        this.RFQID,
        this.ProductId,
        this.TopRecord.toString(),
        this.Mode,
        this.RFQSource
      ).subscribe(
        (res) => {
          try {
            //mappings modified by Urmila A | 15-sep-23
            if (res !== null) {
              this.PreviousRFQsrc = selectedRFQSrc; //added by Urmila A,  LGTCLI-383 ,  3-April-23
              this.BKP_RFQdata = this.LogRFQData = this.arrange(res); // modified by Urmila A | 3-April-23, LGTGTWINT-1743
              this.setPaginator(1); //Added by UrmilaA | LGTGTWINT-2138 | custom pagination  | 3-July-23
              this.fnchkRecords(res); //Added by UrmilaA | LGTGTWINT-2138 | custom pagination  | 3-July-23
              this.TotalExeDeals = [];
              this.LogRFQData.forEach((element) => {
                if (element.OrderStatus === 'FILLED') {
                  this.TotalExeDeals.push(element);
                }
              });
              this.ActiveFilter = '';
              console.log('RFQ res:', this.LogRFQData);
            } else {
              this.LoadRFQ = false;
	      //Changes by AdittiM on 29-Feb-24 : F5SAAINT-3097 FXD Connect -> Quote and Order History : Alignment issue in grid and record count issue
              this.TotalRecords=0;
              this.TotalExeDeals = [];
              this.pages=[];
	      //Changes by AdittiM on 29-Feb-24 : F5SAAINT-3097 FXD Connect -> Quote and Order History : Alignment issue in grid and record count issue
              this.NotificationFunction("Warning", "Error", 'No Records Found') //HSBCFXEINT-90 || By Gargi ||17-05-24
              
            }
          } catch (err) { console.log(err);  }
        }
      );
    }
    
  }

  //LGTGTWINT-1783, Urmila A, 29-Mar-23, start
  fnChngRFQsrc(e) {
    this.RFQSource = e.target.value;

    //Urmila A, 31-Mar-23 | LGTCLI-383
    if (this.RFQSource === 'All') {
      this.showRFQSrcWarning = true;
    } else {
      // this.PreviousRFQsrc = e.target.value; //commented by Urmila A, 3-April-23
      this.PreviousRFQsrc = this.PreviousRFQsrc; //added by Urmila A,  LGTCLI-383 ,  3-April-23
    }
  }

  //Urmila A, LGTCLI-383 | 31-Mar-23 | start
  fnYesContinueRFQ() {
    this.RFQSource = 'All';
    this.continueWithRFQ = true;
    this.showRFQSrcWarning = false;
    this.fnGetRFQDate();
  }

  fnNoContinueRFQ() {
    this.RFQSource = this.PreviousRFQsrc;
    this.showRFQSrcWarning = false;
    // this.fnGetRFQDate() //commented by Urmila A, LGTCLI-383 , 3-april-23
  }
  //Urmila A, LGTCLI-383 | 31-Mar-23 | end

  fnChngEntity(e) {
    this.EntityID = e.target.value;
    this.fnGetProductInfo(); //EFGUPINT-71 : PriceProvider not setting | Chaitanya M | 02-Apr-2024
    this.prodID = '0'; // HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024
  }
  //LGTGTWINT-1783, Urmila A, 29-Mar-23, end

  //Added by Urmila A | 21-Mar-23
  ExpandRFQ(quoteReq, rfqId, i, expand) {
    console.log('after expand', quoteReq, rfqId, i);
    if (expand) {
      this.showExpandloader = true;
      this.selectedQuoteToExpand = rfqId;
      setTimeout(() => {
        this.showExpandloader = false;
      }, 500);

      if (quoteReq % 2 == 0) {
        this.selectedIndex = 'even';
      } else {
        this.selectedIndex = 'odd';
      }
    } else {
      this.selectedQuoteToExpand = undefined;
    }
  }

  //added by Urmila A, 28-Mar-23 | LGTGTWINT-1758
  fnRedirectSinglePricer(data) {
    console.log('redirect data:', data);
    if (data !== null) {
      data.redirectFrom = 'quotehistory';
      this.FXD_afs.setData(data);
      this._router.navigateByUrl('app/fxdconnect'); //modified by Urmila A | 23-Oct-23

      this.FXD_afs.FXD_RFQDealDetails_navigateToPricers.next({
        navigate: true,
        ProdcutCode: data.Product.toUpperCase(),
        ReFNo: data.NoteId,
        ProductID: data.ProductId,
        redirectFrom: 'quotehistory',
      });
    }
  }

  //Working code for re-arranging and sorting RFQ data | Urmila A, 3-April-23 ,LGTGTWINT-1791
  arrange(RFQData) {
    let values = [];
    let RES = [];
    let rearranged = [];
    //seperated out & clubbed BestPrice='Y' records
    RFQData.forEach((element) => {
      if (element.BestPriceYN === 'Y') {
        values.push(element);
      }
    });
    values.forEach((val) => {
      let grp = [];

      if (val.GroupKey !== '') {
        grp.push(val);
      }

      RFQData.forEach((rfq) => {
        if (
          rfq.GroupKey !== '' &&
          rfq.GroupKey === val.GroupKey &&
          rfq.QuoteRequestID !== val.QuoteRequestID
        ) {
          grp.push(rfq);
        }
      });

      rearranged.push(...grp);
    });

    console.log('RES 1', rearranged);

    //took diff between whole incoming data and clubbed Bestprice='Y' data
    let diff = [];
    diff = this.getDifference(RFQData, rearranged);

    const newval: any = Object.values(
      diff.reduce((a, b) => {
        if (!a[b.GroupKey]) a[b.GroupKey] = b;
        return a;
      }, {})
    );

    console.log('newval', newval);

    //clubbed bestPrice='N' records
    newval.forEach((newval) => {
      newval.BestPriceYN = 'N';
      RFQData.forEach((rfq) => {
        if (
          newval.GroupKey === rfq.GroupKey &&
          rfq.DCDRFQID === newval.DCDRFQID
        ) {
          RES.push(rfq);
        }
      });
    });

    console.log('RES', RES);
    //merged bestPrice='Y' & bestPrice='N' records, and sorted in descending order
    rearranged.push(...RES);
    rearranged.sort((a, b) => b.DCDRFQID - a.DCDRFQID);

    //assigned even-odd id's
    let id = 0;
    rearranged.forEach((element) => {
      if (element.BestPriceYN !== '') {
        id = id + 1;
        element.ClubbingId = id;
      }
    });

    //again filtered out unique records
    const UniqueIDs: any = Object.values(
      rearranged.reduce((a, b) => {
        if (!a[b.GroupKey]) a[b.GroupKey] = b;
        return a;
      }, {})
    );

    //to ensure total records | UrmilaA | LGTGTWINT-2138 | 4-July-23
    this.TotalRecords = UniqueIDs.length;

    //assigned clubbing id's to final array
    UniqueIDs.forEach((Unique) => {
      rearranged.forEach((ele) => {
        if (
          Unique.GroupKey === ele.GroupKey &&
          ele.DCDRFQID === Unique.DCDRFQID
        ) {
          ele.ClubbingId = Unique.ClubbingId;
        }
      });
    });

    console.log('final', rearranged);
    return rearranged;
  }

  //below code not in use
  //Urmila A | 23-Mar-23, LGTGTWINT-1743
  fnArrangedata(RFQData: any[]) {
    let bestPriceList = [];
    let rearranged = [];

    let id = 0;

    //for best price clubbing | start
    RFQData.forEach((element) => {
      //modified by Urmila A | LGTGTWINT-1743 | 27-Mar-23
      if (element.BestPriceYN === 'Y') {
        id = id + 1;
        element.ClubbingId = id;
        bestPriceList.push(element);
      }
    });

    bestPriceList.forEach((bestPrice) => {
      let grp = [];

      if (bestPrice.GroupKey !== '') {
        grp.push(bestPrice);
      }

      RFQData.forEach((element) => {
        if (
          element.GroupKey !== '' &&
          element.GroupKey === bestPrice.GroupKey &&
          element.QuoteRequestID !== bestPrice.QuoteRequestID
        ) {
          grp.push(element);
        }
      });

      rearranged.push(...grp);
    });

    RFQData.forEach((element) => {
      if (element.ClubbingId === '') {
        rearranged.push(element);
      }
    });
    console.log('rearranged 1', rearranged);
    //best price clubbing | end

    //added by Urmila A | 28-Mar-23 | for non-best price group clubbing  | start
    let diff = [];
    diff = this.getDifference(RFQData, rearranged);
    const values: any = Object.values(
      diff.reduce((a, b) => {
        if (!a[b.GroupKey]) a[b.GroupKey] = b;
        return a;
      }, {})
    );
    // console.log(' unique :',values)

    // values.sort((a, b) => (b.DCDRFQID - a.DCDRFQID ))

    let grp2 = [];
    values.forEach((nonbestPrice: any) => {
      let nonbestGrp = [];
      if (nonbestPrice.GroupKey !== '') {
        nonbestGrp.push(nonbestPrice);
      }
      console.log('non best grp,', nonbestGrp);
      for (let i = 0; i < nonbestGrp.length; i++) {
        nonbestGrp[0].BestPriceYN = 'N';
        id = id + 1;
        nonbestGrp[i].ClubbingId = id;
      }

      diff.forEach((element) => {
        if (
          element.GroupKey !== '' &&
          element.GroupKey === nonbestPrice.GroupKey &&
          element.QuoteRequestID !== nonbestPrice.QuoteRequestID
        ) {
          nonbestGrp.push(element);
        }
      });
      grp2.push(...nonbestGrp);
    });
    rearranged.push(...grp2);
    // console.log('non best arr',grp2)

    console.log('RFQ data', RFQData, 'rearranged', rearranged);
    return rearranged;
  }

  //added by Urmila A | 28-mar-23
  getDifference(array1, array2) {
    return array1.filter((object1) => {
      return !array2.some((object2) => {
        return object1.GroupKey === object2.GroupKey;
      });
    });
  }

  fnGetLegPremDetails(quoteID: any, DCD_RFQId: any) {
    //DCD_RFQId added by Urmila A | 22-Aug-23 | Core-migration API req parameters modified
    this.loadLefData = true; //Urmila A, 30-Mar-23
    this.QuoteIDClicked = true;
    this.QuoteLegData = [];
    this.QuoteId = quoteID;
    this.NoRecordsFounds = false; //Urmila A | LGTGTWINT-1367 | 8-Feb-23 |
    // this.LoadRFQ = true; //Urmila A | LGTGTWINT-1367 | 8-Feb-23 |
    this.LogRFQData.forEach((element) => {
      if (element.InternalRFQID === quoteID) {
        this.legRFQID = DCD_RFQId = element.InternalRFQID; // HSBCFXEINT-104 || By Gargi ||  15-05-2024;
        this.legProvider = element.Provider;
        this.legProduct = element.ProductName;
      }
    });

    //modified request parameters by UrmilaA, LGTGTWINT-1869, 14-April-23
    this.FXDGetLegPremDetailsSubscriber = this.FXD_afs.FXDGetLegPremDetailsAPI(
      DCD_RFQId,
      this.FXD_afs.UserName
    ) //DCD_RFQId added by Urmila A | 22-Aug-23 | Core-migration API req parameters modified
      .subscribe((res: any) => {
        try {
          if (res) {
            //Urmila A | 14-feb-23 | LGTGTWINT-1374 || Chaitanya M | 09-Sep-23 | Core-migration API
            //Urmila A | LGTGTWINT-1367 | 8-Feb-23 | start
            this.loadLefData = false;
            this.fnChkNoRecords(res); //LGTGTWINT-1761, Urmila A | 30-Mar-23

            //Urmila A | LGTGTWINT-1367 | 8-Feb-23 | end
            this.BKPLegdata = this.QuoteLegData = res;
            console.log('Quote leg data:', this.QuoteLegData);
          } else {
            //Urmila A | 14-feb-23 | LGTGTWINT-1374
            //LGTGTWINT-1761, Urmila A | 30-Mar-23
            if (res === null) {
              this.loadLefData = false;
              this.fnChkNoRecords(res);
            }
            this.NotificationFunction('Warning', 'Error', 'NO DATA'); //HSBCFXEINT-90 || By Gargi ||17-05-24
          }

          //  }
        } catch (err) {
          console.log('error', err);
        }
      });
  }

  //Urmila A, 30-mar-23
  fnChkNoRecords(res) {
    if (res === null || undefined || res.length === 0) {
      this.NoLegRecordsFounds = true;
    } else if (res.length > 0) {
      this.NoLegRecordsFounds = false;
    }
  }
  getLegDataHeader() {
    var headers = this.sharedFXD_Sp.getRFQQuoteLegWiseDataHeaders();
    if (this.ShortView) {
      this.RFQLegDataHeaders = headers[0].shortViewTableHeader;
    } else if (!this.ShortView) {
      this.RFQLegDataHeaders = headers[0].longViewTableHeader;
    }
    console.log('RFQ Leg headers:', this.RFQLegDataHeaders);
  }
  fnlongView() {
    this.LongView = true;
    this.ShortView = false;
    this.getLegDataHeader();
  }
  fnshortView() {
    this.LongView = false;
    this.ShortView = true;
    this.getLegDataHeader();
  }

  closeLegPopup() {
    this.QuoteIDClicked = false;
    this.loadLefData = false;
  }
  getRFQLogMonitorHeader() {
    var headers = this.sharedFXD_Sp.getRFQLogMonitorTableHeaders();
    this.RFQLogHeaders = headers[0].tableheader;
    console.log('RFQ headers:', this.RFQLogHeaders);
  }
  fnChngFromdate(e) {
    this.ActiveFilter = 'Fromdate';
    this.Fromdate = this.FXD_cfs.convertDate(e.target.value);
  }

  fnChngTodate(e) {
    this.ActiveFilter = 'Todate';
    this.Todate = this.FXD_cfs.convertDate(e.target.value);
    // this.fnGetRFQDate()
  }

  fnLoad() {
    this.fnGetRFQDate();
    this.currentPage = 1; //UrmilaA | LGTGTWINT-2138 |4-July-23
  }

  pageChange(e) {
    console.log('page changed', e);
  }

  // Added by Urmila A | Filters | 9-Dec-22 | start
  fnPriceProviderCheckbox(e) {
    if (e.target.checked) {
      this.PriceProviderChecked = true;
    } else {
      this.PriceProviderChecked = false;
    }
  }

  fnChangeProdct(e) {
    //commented by UrmilaA | LGTGTWINT-2138 |4-July-23
    // this.ActiveFilter='Product'
    // this.LogRFQData = this.BKP_RFQdata;
    // console.log('prod changed:',e.target.value);
    this.prodID = e.target.value;

    // Start : HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024
    for ( let element of this.Products ){
      if (this.prodID === element.Product_Id) {
        this.Product_Code = element.product_code;
        this.ProductId = element.Product_Id;
        break;
      } else if (this.prodID === '4') {
        //this.Product_Code = 'FXAQ';
        this.ProductId = '4';
        break;
      }
    }
    // End : HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024

    this.fnGetPriceProviders(); //EFGUPINT-71 : PriceProvider not setting | Chaitanya M | 02-Apr-2024

    //commented below code, as filters handling via API | Urmila A | 5-Jan-23
    // let filteredDate:any[] = []
    // if(this.PP === 'All'){
    //     this.LogRFQData.forEach(element => {
    //         if(element.ProductName === this.prodID && this.prodID !== 'All'){
    //             filteredDate.push(element)
    //         }else if(this.prodID === 'All'){
    //             filteredDate = this.BKP_RFQdata;
    //         }
    //     });
    // }else{
    //     this.LogRFQData.forEach(element => {
    //       if(element.ProductName === this.prodname && this.PP === element.Provider ){
    //           filteredDate.push(element)
    //       }else if(this.prodID === 'All' &&  this.PP === element.Provider){
    //           filteredDate.push(element)
    //       }
    //     });
    // }

    // this.LogRFQData = filteredDate;
  }

  fnSearchByRFQ(e) {
    this.ActiveFilter = 'RFQID';
    this.RFQID = e.target.value;
    //commented below code, as filters handling via API | Urmila A | 5-Jan-23

    // this.LogRFQData= this.BKP_RFQdata;
    // let filteredDate:any[] = []
    // this.LogRFQData.forEach(element => {
    //       if(element.DCDRFQID === this.RFQID){
    //           filteredDate.push(element)
    //       }else if(this.RFQID === ''){
    //           filteredDate = this.BKP_RFQdata;
    //       }
    // });
    // this.LogRFQData = filteredDate
    this.currentPage = 1; //Added by UrmilaA | LGTGTWINT-2138 | custom pagination starts
  }

  fnSelectTopRecord(e) {
    this.TopRecord = Math.floor(e.target.value); //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
    //commented by UrmilaA | LGTGTWINT-2138 |4-July-23
    // this.ActiveFilter = 'TopRecord'
    // this.LogRFQData = this.BKP_RFQdata;
    // let samplearr = [];
    // let cnt=0;
    // let dcdRFQ:any;
    // dcdRFQ  = this.LogRFQData[0].DCDRFQID;
    // this.LogRFQData.forEach(element => {
    //     if(element.DCDRFQID === dcdRFQ){
    //       element.index = cnt
    //     }else if(element.DCDRFQID !== dcdRFQ){
    //       dcdRFQ  = element.DCDRFQID;
    //       cnt = element.index = cnt+1
    //     }
    //     if(element.index < Number(this.TopRecord)){
    //       samplearr.push(element)
    //     }
    // });
    // this.LogRFQData = samplearr;
    // this.setPaginator(1)
    // console.log('Top Records:',this.LogRFQData)
  }

  fnGetTopRecords(filteredDate) {
    let samplearr = [];
    let cnt = 0;
    let dcdRFQ: any;
    dcdRFQ = filteredDate[0].DCDRFQID;
    filteredDate.forEach((element) => {
      if (element.DCDRFQID === dcdRFQ) {
        element.index = cnt;
      } else if (element.DCDRFQID !== dcdRFQ) {
        dcdRFQ = element.DCDRFQID;
        cnt = element.index = cnt + 1;
      }
      if (element.index < Number(this.TopRecord)) {
        samplearr.push(element);
      }
    });
    filteredDate = samplearr;
    return filteredDate;
  }
  fnSelectPriceProvider(e) {
    // this.LogRFQData = this.BKP_RFQdata     // Added by UrmilaA | LGTGTWINT-2138 | 4-July-23
    this.PP = e.target.value;
    this.PriceProvidersArr.forEach((element) => {
      if (this.PP === element.PP_Code) {
        this.ProviderId = element.PP_Id;
      } else if (this.PP === 'All') {
        this.ProviderId = '';
      }
    });
    //commented below code, as filters handling via API | Urmila A | 5-Jan-23
    // switch (this.ActiveFilter){
    //       case '':
    //         this.ActiveFilter='PriceProvider'
    //         this.BKP_RFQdata.forEach(element => {
    //               if(element.Provider === this.PP){
    //                 filteredDate.push(element)
    //               }else if(this.PP === 'All'){
    //                 filteredDate = this.BKP_RFQdata
    //               }
    //         });
    //         break;
    //       case 'PriceProvider' :
    //         this.ActiveFilter='PriceProvider'
    //         this.BKP_RFQdata.forEach(element => {
    //               if(element.Provider === this.PP){
    //                 filteredDate.push(element)
    //               }else if(this.PP === 'All'){
    //                 filteredDate = this.BKP_RFQdata
    //               }
    //         });
    //         break;
    //       case 'Product':
    //         this.BKP_RFQdata.forEach(element => {
    //           if(element.ProductName === this.prodID && element.Provider === this.PP ){
    //             filteredDate.push(element)
    //           }else if(this.prodID === 'All' && element.Provider === this.PP ){
    //               filteredDate.push(element)
    //           }else if(this.PP === 'All' && element.ProductName === this.prodID){
    //               filteredDate.push(element);
    //           }else if(this.PP === 'All' && this.prodID === 'All'){
    //               filteredDate = this.BKP_RFQdata;
    //           }
    //         });
    //         break;
    //       case 'RFQID':
    //         this.BKP_RFQdata.forEach(element => {
    //             if(element.DCDRFQID === this.RFQID && element.Provider === this.PP ){
    //               filteredDate.push(element)
    //             }else if(this.RFQID === '' && element.Provider === this.PP ){
    //                 filteredDate.push(element)
    //             }
    //         });
    //         break;
    //       case 'TopRecord':
    //         this.BKP_RFQdata.forEach(element => {
    //             if(element.Provider === this.PP){
    //               filteredDate.push(element)
    //             }
    //         });
    //         filteredDate = this.fnGetTopRecords(filteredDate);
    //         break;
    // }

    // this.LogRFQData = filteredDate;
  }
  // Added by Urmila A | Filters | 9-Dec-22 | end

  // Added by Urmila A, RFQ Leg Details filter | start
  //26-Dec-22
  fnExportRFQLegData() {
    let ExportedData = [];
    ExportedData = this.ExportData(
      this.QuoteLegData,
      this.RFQLegDataHeaders
    );
    this.excelService.exportAsExcelFile(ExportedData, 'RFQ_Leg_Details');
  }

  //29-Dec-22
  fnChangeRFQLegRowsPerPage(e) {
    let FilterredData = [];
    this.RFQLegRowsPerPage =Math.floor(e.target !== undefined ? Number(e.target.value) : e); //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
    this.BKPLegdata.forEach((element, index) => {
      if (index < Number(this.RFQLegRowsPerPage)) {
        FilterredData.push(element);
      }
    });
    this.QuoteLegData = FilterredData;
  }
  // Added by Urmila A, RFQ Leg Details filter | end

  // Added changes by Mayuri D. on 7-Dec-2022 | LGTGTWINT : 557 | start
  exportToexcel() {
    // code optimized by Urmila A | 26-Dec-22
    let ExportedData = [];

    ExportedData = this.ExportData(
      this.BKP_RFQdata,
      this.RFQLogHeaders
    );
    this.excelService.exportAsExcelFile(ExportedData, 'RFQ_Log_Monitor');
  }
//Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
  ExportData(TableData, TableHeaders) {
    let JSONData = [];    
    //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
    if (TableData.length == 0)
    {
      this.NotificationFunction("Warning", "Error", 'No Records to export') //HSBCFXEINT-90 || By Gargi ||17-05-24
    }
    //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star

    else{ 
      for (let i = 0; i < TableData.length; i++) {
        let Obj = {};
        //debugger;
        TableHeaders.forEach((headerEle, index) => {
          console.log(index, headerEle);
          let val = TableHeaders[index].key;
          if (val.toUpperCase() != "RFQ DETAILS")
          { 
            Obj[val] = TableData[i][TableHeaders[index].value];
          } 
          if (val.toUpperCase() == "QUOTE REQUEST SENT AT" || val.toUpperCase() == "QUOTE ACK AT" ||	val.toUpperCase() == "QUOTE RESPONSE AT"||	val.toUpperCase() == "ORDER REQUEST SENT AT"	|| val.toUpperCase() == "ORDER RESPONSE AT")
          {
            ////Added by AdittiM on 2-Mar-24 : Wrong dates were getting exported and blank records were setting todays date
         //// let val = TableHeaders[index].value;


          if( TableData[i][TableHeaders[index].value] == '' || TableData[i][TableHeaders[index].value]  == null || TableData[i][TableHeaders[index].value]  == undefined) 
          {  
           // Obj[val] = TableData[i][TableHeaders[index].value];          
           } 
           else
           {
            TableData[i][TableHeaders[index].value] = this.datepipe.transform(TableData[i][TableHeaders[index].value] , "dd-MMM-yyyy hh:mm:ss a");
            Obj[val] = TableData[i][TableHeaders[index].value];
           }
           
        
           

        }
      });
       
      JSONData.push(Obj);
    }
    return JSONData;
  }
  }
//Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star

  // Added changes by Mayuri D. on 7-Dec-2022 | LGTGTWINT : 557 |end

  // UrmilaA | LGTGTWINT-1374 | 14-feb-23 | start
  NotificationFunction(type, header, reason) {
    this.FXD_cfs.fnSetNotificationFXD({
      NotificationType: type, //'Error',
      header: header, // 'Error',
      body: reason,
      DateandTime: '',
    });
  }
  // UrmilaA | LGTGTWINT-1374 | 14-feb-23 | end

  //added by UrmilaA | LGTGTWINT-2138 | 4-July-23 |start
  fnchngRecordsPerPage(e) {
    this.currentPage = 1;
    this.itemsPerPage = Math.floor(e.target !== undefined ? Number(e.target.value) : e);
    
    if (this.itemsPerPage >= 0) {
      this.setPaginator(1);
    } else {
      this.LogRFQData = this.BKP_RFQdata;
      this.pages = [];
    }
  }
  //adde by UrmilaA | LGTGTWINT-2138 | 26-June-23 |ends

  //Added by UrmilaA | LGTGTWINT-2138 | custom pagination  | 3-July-23 | start
  setPaginator(pageNO) {
    if (this.itemsPerPage > 0) {
      this.pages = [];
      this.selectedPage = pageNO;
      this.totalpages = Math.ceil(
        Number(this.TotalRecords) / Number(this.itemsPerPage)
      );
      let pageMod = Math.floor(Number(this.selectedPage) / 10);
      if (!isNaN(this.totalpages) || isFinite(this.totalpages)) {
        for (
          let i = 0;
          i < (this.totalpages < 10 ? this.totalpages : 10);
          i++
        ) {
          this.pages.push(pageMod * this.totalpages + (i + 1));
        }
        console.log('pages', this.pages);
        this.getPaginationData();
      }
    }
    else if(this.itemsPerPage == 0){
      this.pages = [];
      this.selectedPage = pageNO;
      this.totalpages = 1;
      let pageMod = Math.floor(Number(this.selectedPage) / 10);
      if (!isNaN(this.totalpages) || isFinite(this.totalpages)) {
        for (
          let i = 0;
          i < (this.totalpages < 10 ? this.totalpages : 10);
          i++
        ) {
          this.pages.push(pageMod * this.totalpages + (i + 1));
        }
        console.log('pages', this.pages);
        this.getPaginationData();
      }
    }
    else {
      this.LogRFQData = this.BKP_RFQdata;
    }
  }

  getPage(mode, pageNo) {
    switch (mode) {
      case 'prev':
        if (this.selectedPage - 1 > 0) {
          this.currentPage--;
          this.selectedPage = this.selectedPage - 1;
          if (!this.pages.some((el) => el === this.selectedPage)) {
            this.pages.splice(0, 0, this.selectedPage);
            this.pages.pop();
          }
          this.getPaginationData();
        } else {
          this.selectedPage = 1;
        }
        break;
      case 'next':
        if (this.selectedPage + 1 <= this.pages.length) {
          this.currentPage++;
          this.selectedPage = this.selectedPage + 1;
          this.getPaginationData();
        } else if (this.selectedPage + 1 > this.pages.length) {
          this.currentPage++;
          this.selectedPage = this.selectedPage + 1;
          this.pages.shift();
          this.pages.push(this.selectedPage);
          this.getPaginationData();
        }
        break;
      case 'current':
        this.selectedPage = this.currentPage = pageNo;
        this.getPaginationData();
        break;
    }
  }

  getPaginationData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    let UniqueRec = this.filterData(this.BKP_RFQdata);
    UniqueRec = UniqueRec.sort((a, b) => b.DCDRFQID - a.DCDRFQID); //Re-arrnged seq by Urmila A | 18-July-23
    UniqueRec = UniqueRec.slice(startIndex, endIndex);

    console.log('unique records:', UniqueRec);
    let grp = [];
    UniqueRec.forEach((val) => {
      this.BKP_RFQdata.forEach((ele) => {
        if (val.GroupKey === ele.GroupKey) {
          grp.push(ele);
        }
      });
    });
    this.LogRFQData = grp;
    this.fnchkRecords(this.LogRFQData);
    console.log('after unique bunch grp', grp);
  }

  filterData(TotalRecords) {
    const UniqueIDs: any = Object.values(
      TotalRecords.reduce((a, b) => {
        if (!a[b.GroupKey]) a[b.GroupKey] = b;
        return a;
      }, {})
    );
    return UniqueIDs;
  }

  fnchkRecords(res) {
    this.LoadRFQ = false;
    if (res === null || undefined || res.length === 0) {
      this.NoRecordsFounds = true;
    } else if (res.length > 0) {
      this.NoRecordsFounds = false;
    }
  }
  //Added by UrmilaA | LGTGTWINT-2138 | custom pagination starts | 3-July-23 | ends
  
  // Start :  HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024
  async fnGetConfigForDealEntry(){
    //API req modified by Urmila A | 21-Aug-23 | core migration
    let res: any  = await this.FXD_afs.FXDGetConfigsForDealEntryAPI2("", this.FXD_afs.UserName ) //RizwanS || config to check product wise entity mapping on UI. || 12 Apr 2024
    try{
      if(res){              
        res=res.Configs
        // console.log('RFQ/RFS config res:',res)
        if(res !== null){
            res?.forEach(element => {    
              //RizwanS Start :: || config to check product wise entity mapping on UI. || 12 Apr 2024 
              if(element.Setting_Name === 'OPTDEN_PopulateProductwiseEntity' && element.Value.toLowerCase() === 'yes'){
                this.AllowPopulateProductwiseEntity = true;
              }else if(element.Setting_Name === 'OPTDEN_PopulateProductwiseEntity' && element.Value.toLowerCase() === 'no'){
                this.AllowPopulateProductwiseEntity = false;
              }
              //RizwanS END :: || config to check product wise entity mapping on UI. || 12 Apr 2024     
            });
          }
      }
      }catch(err){console.log(err)}
    }
   // End : HSBCFXEINT-102 | Page filters issues | ChaitanyaM | 21-May-2024
}
