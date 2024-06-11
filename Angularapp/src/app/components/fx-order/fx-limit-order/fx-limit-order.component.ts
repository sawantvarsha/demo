// import { formatDate } from '@angular/common';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';

// import { CustomerApiService } from 'src/app/services/customer-api.service';
import { FXLimitService } from 'src/app/services/fxlimit.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { environment } from 'src/environments/environment';
import { ApifunctionService } from '../apifunction.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fx-limit-order',
  templateUrl: './fx-limit-order.component.html',
  styleUrls: ['./fx-limit-order.component.scss'],
})
export class FxLimitOrderComponent implements OnInit, OnDestroy {

  parentMsg : any;
  pairsearch: any;
  showClearSearch : boolean;

  IsBackButtonEnabled: boolean;
  ccyPairArray: any[];
  ccyPairArrayDummy: any[];
  ccyPairDetails: any;
  ccypairLoadingFlag: boolean;
  ccyPairData: any;
  selectedCcyPair: any;
  selectedCardIndex: any;

  OT: any;
  HT: any;
  RT: any;

  orderBookFlag: boolean;

  @Output() getSelectedCcyPair = new EventEmitter<any>();

  //order book variables with prefix BLO<...>
  BLOcustomerName: any;
  BLObuyccy: any;
  BLOsellccy: any;
  BLObuyamount: any;
  BLOsellamount: any;
  BLOrate: any;
  BLOtargetrate: any;
  BLObillingAccount: any;
  BLOcreditAccount: any;
  BLOexpirytype: any;
  BLOexpirydate: any;

  BLOshowExpiryTypeFlag: boolean;
  BLOexHr: any;
  BLOexMin: any;
  BLOshowexHrFlag: boolean;
  BLOshowexMinFlag: boolean;
  BLOshowtimefield: boolean;

  expiryTypesArray: any[];

  customerListArray: any;

  userType: any;
  userName : any;

  BLOshowCustSuggestionsFlag: any;
  BLOshowBillingAccountSuggestionsFlag: boolean;
  BLOshowCreditAccountSuggestionsFlag: boolean;

  AccountDetailsCache : any;
  BLObillingAccountList : any[];
  BLOcreditAccountList : any[];
  custID : any;
  showconfirmationPopup : any;
  BLODirection: any;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  currentDate : Date;
  assetURL : any;
  custListSub: Subscription;
  commonDataSub: Subscription;
  allPairDataSub: Subscription;
  favPairSub: Subscription;
  bidaskSub: Subscription;

  constructor(
    private homeapi: HomeApiService,
    // private custAPI: CustomerApiService,
    private fxlimitService: FXLimitService,
    private afs: ApifunctionService,
    public location: Location
  ) {
    this.parentMsg = "From FX-LIMIT-ORDER";
    this.showClearSearch = false;
    this.assetURL = environment.assetURL;
    this.ccypairLoadingFlag = true;
    this.selectedCardIndex = '0';
    this.OT = 'Open Trades';
    this.HT = 'Histoical Trades';
    this.RT = 'Recent Trades';
    this.BLOshowExpiryTypeFlag = false;
    this.expiryTypesArray = [
      'Good Till Time (GTT)',
      'Good Till Date (GTD)',
      'Good Till Filled (GTF)',
      'End of Day (EOD)',
    ];
    this.BLOexHr = '12';
    this.BLOexMin = '00';
    this.BLOshowexHrFlag = false;
    this.BLOshowexMinFlag = false;
    this.BLOshowtimefield = false;
    this.BLOshowCustSuggestionsFlag = false;

    this.showconfirmationPopup = false;

    this.currentDate = new Date();
  }
  ngOnDestroy(): void {
    if(this.custListSub){
      this.custListSub.unsubscribe();
    }
    if(this.commonDataSub){
      this.commonDataSub.unsubscribe();
    }
    if(this.allPairDataSub){
      this.allPairDataSub.unsubscribe();
    }
    if(this.favPairSub){
      this.favPairSub.unsubscribe();
    }
    if(this.bidaskSub){
      this.bidaskSub.unsubscribe();
    }

    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.IsBackButtonEnabled =
      this.homeapi.RediretToHomeBuySellPledge === '' ? false : true;
    this.getCcyDataOnLoad();

    this.userType = sessionStorage.getItem('UserType');
    if (this.userType == 'RM') {
      //get customer list
      this.afs.CustomerSearch('');
      this.custListSub = this.afs.CustomerListObserver.subscribe((res) => {
        if (res) {
          this.customerListArray = res;
        }
        // console.log('customer list', this.customerListArray);
        this.userName = sessionStorage.getItem('Username');
      });
    }else{
      this.custID = sessionStorage.getItem('CustomerID');
      this.BLOcustomerName = sessionStorage.getItem('CustomerNamemisc1');
      this.userName = sessionStorage.getItem('Username');
    } 

  }

  back() {
    this.ngOnDestroy();
    this.location.back();
  }

  getCcyDataOnLoad() {
    //get all ccy pair details
    this.allPairDataSub =  this.fxlimitService.getCcyPairDetailsforAll().subscribe((res) => {
      if (res) {
        // console.log('Master check ccy pair details', res);
        this.ccyPairDetails = res;

        //get required ccy pair to display
        // this.commonDataSub = this.custAPI
        //   .getCommonDataEFX('CSP_FX_Dashboard_CCY')
        //   .subscribe((res) => {
        //     if(res){
        //       console.log("master check common data", res)
        //       // this.ProcessCcyPairs(res);
        //     }
        //   });

        this.afs.getFavoritesFromTemplate(this.userName);
        this.favPairSub = this.afs.getfavoriteObserver.subscribe((res)=>{
          if(res){
            // console.log("Master check favourite pairs", res);
            this.ProcessCcyPairs(res);
          }
        })
      }
    });
  }

  ProcessCcyPairs(res: any){
    if (res) {
      this.ccyPairArray = res; //.Get_Configurable_Common_DataResult
      // console.log('only ccy pairs', this.ccyPairArray);

      //to change ccy pair to requested format
      this.ccyPairArray.forEach((element) => {
        element.ProductName =
          element.ProductName.substring(0, 3) +
          ' - ' +
          element.ProductName.substring(4, element.ProductName.length);
      });
      const pairs = [
        ...new Set(this.ccyPairArray.map((p) => p.ProductName)),
      ];

      // console.log('only ccy pairs after', this.ccyPairArray);

      //to get details for selected ccy pair that need to display
      this.ccyPairArray = Object.values(
        this.ccyPairDetails.body
      ).filter((item: { Pair: any }) => pairs.includes(item.Pair));

      this.ccyPairData = this.ccyPairArray;

      // console.log('only ccy pairs MODIFIED', this.ccyPairArray);
      this.selectedCcyPair = this.ccyPairData[0]?.Pair;

      //fetch rates foir ccy pairs
      this.getRates(this.ccyPairArray); 
    }
  }

  getRates(myarr: any){
    myarr.forEach((element) => {
      this.afs.Get_FxSpotBidAskRate(element.Pair);
    });

    this.bidaskSub = this.afs.GetFxSpotBidAskRateObserver.subscribe((res) => {
      if (res) {
        // console.log('rates res ', res);
        const dat = res;
        const ind = myarr.indexOf(
          myarr.find(
            (elem) =>
              elem.Pair === dat['Get_FxSpotBidAskRateResult'][0].code
          )
        );
        myarr[ind].pairaskrate =
          (dat['Get_FxSpotBidAskRateResult'][0].pairaskrate).toFixed(myarr[ind]?.PointShift);
        myarr[ind].pairaskrateSMALL = 
        myarr[ind].pairaskrate.substring(0, 4);

        myarr[ind].pairaskrateLARGE =
        myarr[ind].pairaskrate.substring(4, 6);


        myarr[ind].pairbidrate =
          (dat['Get_FxSpotBidAskRateResult'][0].pairbidrate).toFixed(myarr[ind].PointShift);
          myarr[ind].pairbidrateSMALL = 
        myarr[ind].pairbidrate.substring(0, 4);

        myarr[ind].pairbidrateLARGE =
        myarr[ind].pairbidrate.substring(4, 6);

        myarr[ind].pairmidrate =
          (dat['Get_FxSpotBidAskRateResult'][0].pairmidrate).toFixed(myarr[ind].PointShift);
        
          this.ccyPairArrayDummy = myarr;
      }
    });

    setTimeout(() => {
      this.ccypairLoadingFlag = false;
    }, 1000);
    
  }

  refreshRates(){
    this.ccypairLoadingFlag = true;
    this.getRates(this.ccyPairArray);
  }

  getPairSuggestion(){
    this.ccyPairArrayDummy = this.ccyPairArray.filter(item => (item.Pair).toLowerCase().includes(this.pairsearch.toLowerCase()));
  }

  clearSearch(){
    // console.log("clicked clear");
    this.showClearSearch=false;
    this.pairsearch='';
    this.getPairSuggestion();
  }

  selectedCcyPairCard(item: any, i: any) {
    // console.log('selected', item);
    this.selectedCcyPair = item.Pair;
    this.selectedCardIndex = i;
  }

  getCustomerAccountDetails(){
    this.BLObillingAccountList = [];
    this.BLOcreditAccountList = [];
    this.afs.GetAccountDetailsObserver.subscribe((res) => {
      if(res){
        // console.log("customer details", res);
        this.AccountDetailsCache = res;
        for(let i=0; i< this.AccountDetailsCache.length;i++){
          if (this.AccountDetailsCache[i]['SICurrency'] === this.BLObuyccy && this.AccountDetailsCache[i]['TransactionType'] === 'Debit') {
            // this.BLObillingAccountList.push({ 'value': this.AccountDetailsCache[i]['AccountNo'] });
            this.BLObillingAccountList.push(this.AccountDetailsCache[i]['AccountNo']);
          }
          if (this.AccountDetailsCache[i]['SICurrency'] === this.BLOsellccy && this.AccountDetailsCache[i]['TransactionType'] === 'Credit') {
            this.BLOcreditAccountList.push(this.AccountDetailsCache[i]['AccountNo']);
          }
        }

        this.BLObillingAccountList = [...new Set(this.BLObillingAccountList)];
        this.BLOcreditAccountList = [...new Set(this.BLOcreditAccountList)];

        this.BLObillingAccount = this.BLObillingAccountList[0];
        this.BLOcreditAccount = this.BLOcreditAccountList[0];

        // console.log("Billing accounts", this.BLObillingAccountList);
        // console.log("selling accounts", this.BLOcreditAccountList)
      }
    })
  }

  PlaceOrder(dir: any, _item: any) {
    // console.log('place ', dir, ' order', _item);
    this.orderBookFlag = true;
    this.BLObuyamount = 10000.00;

    this.BLOtargetrate = '';
    this.BLOexpirytype = 'EOD';
    this.BLODirection = dir;

    switch (dir) {
      case 'Buy':
        this.BLObuyccy = _item.Asset1;
        this.BLOsellccy = _item.Asset2;
        this.BLOrate = _item.pairbidrate;
        break;

      case 'Sell':
        this.BLObuyccy = _item.Asset2;
        this.BLOsellccy = _item.Asset1;
        this.BLOrate = _item.pairaskrate;
        break;
    }

    if(this.userType != 'RM'){
      this.afs.getAccountDetails(this.custID, this.BLObuyccy, this.BLOsellccy, 'limit');
      this.getCustomerAccountDetails();
    }
  }

  closePopup() {
    this.orderBookFlag = false;
  }
  closesmallPopup() {
    this.BLOshowExpiryTypeFlag = false;
    this.BLOshowexHrFlag = false;
    this.BLOshowexMinFlag = false;
    this.BLOshowCustSuggestionsFlag = false;
    this.BLOshowCreditAccountSuggestionsFlag = false;
    this.BLOshowBillingAccountSuggestionsFlag = false;
  }

  changeExpiryDate() {
    // console.log('/*/*');
  }

  getExpiryType(item: any) {
    // console.log('item', item);
    this.BLOexpirytype = item;
    if (item != 'Good Till Time (GTT)') {
      this.BLOshowtimefield = false;
    }
    switch (item) {
      case 'Good Till Time (GTT)':
        this.BLOshowtimefield = true;
        this.BLOexpirydate = new Date();
        // this.BLOexpirydate = formatDate(new Date().replaceFunction('/','-'),'full','es-CO');
        break;

      case 'Good Till Date (GTD)':
        break;

      case 'Good Till Filled (GTF)':
        break;

      case 'End of Day (EOD)':
        this.BLOexpirydate = new Date();
        break;
    }
  }

  counter(i: number) {
    return new Array(i);
  }

  getTime(timetype: any, data: any) {
    if (data.length == 1) {
      data = '0' + data;
    }
    switch (timetype) {
      case 'hr':
        this.BLOexHr = data;
        break;

      case 'min':
        this.BLOexMin = data;
        break;
    }
  }

  selectedCustomer(_item: any) {
    // console.log('selected customer', _item);
    this.BLOcustomerName = _item.CustomerName;
    this.afs.getAccountDetails(_item.CustomerID, this.BLObuyccy, this.BLOsellccy, 'limit');
    this.getCustomerAccountDetails();
  }

  getselectedAccount(type: any, item: any){
    switch(type){
      case 'billing':
        this.BLObillingAccount = item;
        break;

      case 'credit':
        this.BLOcreditAccount = item;
        break;
    }
  }

  calculateTargetAmount(){
    this.BLOsellamount = (this.BLObuyamount * this.BLOtargetrate).toFixed(2);
  }

  bookOrder(){
    // console.log("buy ccy", this.BLObuyccy,
    // "sell ccy", this.BLOsellccy,
    // "buy amount", this.BLObuyamount,
    // "sell amount", this.BLOsellamount,
    // "rate", this.BLOrate,
    // "targetRate", this.BLOtargetrate,
    // "buyaccount", this.BLObillingAccount,
    // "sell account", this.BLOcreditAccount,
    // "expirytype", this.BLOexpirytype,
    // "expirydate", this.BLOexpirydate);

    // this.afs.CheckTransactionLimit(this.BLObuyamount, this.BLObuyccy, this.BLOcustomerName);
    this.afs.validateTradeBlockObserver.subscribe((res)=>{
      if(res){
        // console.log("validation", res);
        this.showconfirmationPopup = true;
        //need to check for validation response for all
      }
    })
  }

  getEPOCHDate(dateValue: string, timeValue?: string) {
    try {
      let date: Date;
      if (timeValue) {
        date = new Date(
          parseInt(dateValue.split('-')[2], 10), this.months.indexOf(dateValue.split('-')[1]), parseInt(dateValue.split('-')[0], 10),
          parseInt(timeValue.split(':')[0], 10), parseInt(timeValue.split(':')[1], 10));
      } else {
        date = new Date(
          parseInt(dateValue.split('-')[2], 10), this.months.indexOf(dateValue.split('-')[1]), parseInt(dateValue.split('-')[0], 10));
      }
      const etime = (((((date).getTime()) / 1000) + 19800) * 1000);
      return etime;
    } catch (ex) { console.log(ex) }
  }

  processOrder(){
    // let exType;
    // let timezone = 'Singapore Standard Time';
    // let expiryDate = '';
    switch (this.BLOexpirytype) {
      case 'Good Till Time (GTT)':
        // exType = 'GTT';
        break;

      case 'Good Till Date (GTD)':
        // exType = 'GTD';
        break;

      case 'Good Till Filled (GTF)':
        // exType = 'GTF';
        break;

      case 'End of Day (EOD)':
        // exType = 'EOD';
        break;
    }

    // this.BLOexpirydate = '\/Date(' + this.getEPOCHDate(this.BLOexpirydate, '23:59') + ')\/';
    // console.log(exType, "uddesh check",'\/Date(' + this.getEPOCHDate(this.BLOexpirydate, '23:59') + ')\/');
    // console.log(exType);

   // this.afs.bookLimitOrder(exType, this.selectedCcyPair, this.BLOrate, this.BLOtargetrate, this.BLODirection, this.BLObillingAccount, this.BLOcreditAccount, 'blank', this.BLObuyamount, this.BLOsellamount, this.BLOexpirydate, this.BLOexpirydate, '', 'Singapore Standard Time');
   
   
    // this.afs.bookLimitOrder(this.orderExpType, this.selectedCCY, rate, targetRate, this.direction, this.billingAcc, this.creditAcc, 'blank',
    // ccy1, ccy2, expiryDate, valueDate, 'via api', timezone, this.CustPAN, this.RMID, this.RMName, this.CustomerCIF, this.CustomerSegment, 40416, this.templateSerialNo, this.authApi.UserName, this.authApi.EntityID);

   
    this.afs.BookLimitOrderDataObserver.subscribe((res) => {
      if(res){
        // console.log("Book limit order msg", res);
        this.showconfirmationPopup = false;
      }
      
    })
  }
}
