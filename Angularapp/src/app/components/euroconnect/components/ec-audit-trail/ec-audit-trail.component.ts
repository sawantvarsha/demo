import { Component, OnInit, ViewChild } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { DatePipe, formatDate } from '@angular/common';
import { EcHomeService } from "../../services/ec-home.service";
import { environment } from "src/environments/environment";
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from 'src/app/services/config.service';
@Component({
  selector: 'app-ec-audit-trail',
  templateUrl: './ec-audit-trail.component.html',
  styleUrls: ['./ec-audit-trail.component.scss']
})
export class EcAuditTrailComponent implements OnInit {

  @ViewChild("paginator", { static: true }) paginator: PageEvent;
  accord: number;
  rfqs: any = [];
  quotes = [];
  products: any;
  selectedProduct: any;
  selectedRFQ = -1;
  selectedRFQIndex = -1; //DrishtyR | 30-Jul-2021 | Change to clear RFQ selection
  selectedQuote = -1;
  solveForHeaderTxt = "Solve For Price"; //DrishtyR | 26-Jul-2021 | Change for dynamic Solver For Price column header
  searchKey = "";
  pageIndex: number = 0;
  showLogo : boolean = false;

  d = new Date();
  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  frmDate = "";
  toDate = "";
  noOfRecords : number = 0;
  pageSize : number = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  pageEvent: PageEvent;
  pageNo : number = 0;
  currentItemsToShow: any[];
  currentRFQID: any;
  subscription: boolean;
  timelineArray: any[] = [];
  showSub: boolean = false;
  subdData: any;
  subRfq: any;
  fromFormattedDate: string;
  toFormattedDate: string;
  viewOrderData: any[];

  auditTrailRequest: boolean = false;     // Added By AniruddhaJ to remove duplicate trail 23-Jul-2021.
  auditTrailTermSheet: boolean = false;
  auditTrailKID: boolean = false;

  payOffListSorted = [];
  asseturl = environment.asseturl;
  loadFlag = true;
  pageStart:number = 0;
  pageEnd:number;
  pageTitle: any;
  pageloadflag= true; // Added by AdilP || 04-05-2023 || FIN1EURINT-282
  //Changes done by Jyoti S || 09-Aug-2023 || HSBCECCLI-28 || START
  UserRolesArr: any;
  isDealer: boolean;
  //Changes done by Jyoti S || 09-Aug-2023 || HSBCECCLI-28 || END
  constructor(public api: EcHomeService, public datepipe: DatePipe,private route: ActivatedRoute) {
    this.accord = 1;
  }

  async ngOnInit() {
    this.pageTitle = history.state.pageTitle;//Added by Jyoti S || 25-May-2023
    // this.route.params.subscribe
    //   (async params => {
    //   this.pageTitle = params.pageTitle;

    // });//Added by Jyoti S || 05-May-2023
    this.showSub = false;
    this.pageloadflag = true; // Added by AdilP || 04-05-2023
    // this.timeZoneDiff();

    //console.log(this.api.payOffList);
    if (this.api.payOffList === undefined || this.api.payOffList.length <= 0) {
      await this.api.getPayOffList();
    }
    this.payOffListSorted = [];
    this.api.payOffList.forEach(element => this.payOffListSorted.push(element));
    // this.payOffListSorted.sort((a, b) => (a.displayName > b.displayName) ? 1 : -1);
    if (this.payOffListSorted.length > 1) {
      // this.selectedProduct = this.payOffListSorted[0].auditTProductType;
      if (this.payOffListSorted.filter(item => item.display).length > 0) {
        this.selectedProduct = this.payOffListSorted.filter(item => item.display)[0].auditTProductType;
      }
    }
    //Changes done by Jyoti S || 09-Aug-2023 || HSBCECCLI-28 || START
    let UserGroup = AppConfig.settings.oRes.groupID;       
        this.UserRolesArr = await this.api.GetCommonDataReason("CSP_UserRoles");//Added by Varsha G || 01-June-2023
        const matchedGroup = this.UserRolesArr?.filter((obj)=>{
          return obj.Misc1 === UserGroup;
        })
        if(matchedGroup?.[0]?.Data_Value?.toUpperCase() === "DEALER"){
          this.isDealer = true;
        }else{
          this.isDealer = false;
        }
        //Changes done by Jyoti S || 09-Aug-2023 || HSBCECCLI-28 || END
     this.setFromToDates();
     this.getRFQs();
    this.pageloadflag = false; // Added by AdilP || 04-05-2023
  }

  setFromToDates(dayDiff: number = 0) {
    let date = new Date();
    let day = date.getDate();
    const to = `${day > 9 ? day : '0' + day}-${this.months[date.getMonth()]}-${date.getFullYear()}`;
    this.toFormattedDate = to;

    date.setDate(date.getDate() - dayDiff);
    day = date.getDate();
    const from = `${day > 9 ? day : '0' + day}-${this.months[date.getMonth()]}-${date.getFullYear()}`;
    this.fromFormattedDate = from;
  }

  chooseDateFilter(prod: any) {
    try {
      //<DrishtyR | 2-Aug-2021 | Changes to reset RFQ and quote selection on Date filter selection change> 
      this.noOfRecords = 0;
      this.pageNo = 0;
      this.pageIndex = 0;
      //Added by Amogh K | 9-mar-2022
      this.pageStart = 0;
      this.pageEnd = 0;
      this.currentItemsToShow = [];
      this.selectedRFQ = -1;
      this.selectedQuote = -1;
      this.selectedRFQIndex = -1;
      this.quotes = [];
      this.solveForHeaderTxt = "Solve For Price";
      this.showSub = false;
      this.subscription = false;
      this.timelineArray = [];
      this.rfqs = [];
      //<,DrishtyR | 2-Aug-2021 | Changes to reset RFQ and quote selection on Date filter selection change> 
      switch (prod) {
        case 1:
          this.accord = 1;
          this.setFromToDates(0);
          this.getRFQs();
          break;
        case 2:
          this.accord = 2;
          this.setFromToDates(7);
          this.getRFQs();
          break;
        case 3:
          this.accord = 3;
          this.setFromToDates(30);
          this.getRFQs();
          break;
        case 4:
          this.accord = 4;
          //<DrishtyR | 2-Aug-2021 | Changes to set From date and To date as today's date>
          this.frmDate = new Date().toISOString().split('T')[0];
          this.fromDateChange();
          this.toDate = new Date().toISOString().split('T')[0];
          this.toDateChange();
          this.getRFQs();
          //</DrishtyR | 2-Aug-2021 | Changes to set From date and To date as today's date>
          break;


        default:
          break;
      }
    } catch (error) {
      // //console.log(error);
    }
  }

  fromDateChange() {
    // Changed by Amogh K | 26 Apr 2022 | Audit trail incorrect date passed to api | assigned by Pranav D
    this.fromFormattedDate = this.datepipe.transform(this.frmDate, 'dd-MMM-yyyy');
    this.loadFlag = true;
    // $("#txtfrmDate").next(".error-input").remove();
    // $("#txtfrmDate").next(".validate-popup").remove();
    // $("#txttoDate").next(".error-input").remove();
    // $("#txttoDate").next(".validate-popup").remove();
    if (this.frmDate == '') {
      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + "Invalid date" + '</span></div>').insertAfter("#txtfrmDate")
      $('.validate-popup').delay(5000).fadeOut('slow');
      this.loadFlag = false;
      return false;
    }
    var d1 = Date.parse(this.frmDate);
    var d2 = Date.parse(this.toDate);
    if (d1 > d2) {
      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + "should be less than To date" + '</span></div>').insertAfter("#txtfrmDate")
      $('.validate-popup').delay(5000).fadeOut('slow');
      this.loadFlag = false;
      return false;
    }
    

    // //console.log(this.fromFormattedDate)
  }

  toDateChange() {
    this.loadFlag = true;
    // $("#txtfrmDate").next(".error-input").remove();
    // $("#txtfrmDate").next(".validate-popup").remove();
    // $("#txttoDate").next(".error-input").remove();
    // $("#txttoDate").next(".validate-popup").remove();
    if (this.toDate == '') {
      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + "Invalid date" + '</span></div>').insertAfter("#txttoDate")
      $('.validate-popup').delay(5000).fadeOut('slow');
      this.loadFlag = false;
      return false;
    }
    var d1 = Date.parse(this.frmDate);
    var d2 = Date.parse(this.toDate);
    if (d2 < d1) {
      $('<div class="error-input"></div><div class="validate-popup active"><span> ' + "should be greater than From date" + '</span></div>').insertAfter("#txttoDate")
      $('.validate-popup').delay(5000).fadeOut('slow');
      this.loadFlag = false;
      return false;
    }
    this.toFormattedDate = this.datepipe.transform(this.toDate, 'dd-MMM-yyyy');
    // //console.log(this.toFormattedDate);
  }

  async getRFQs() {
    //Changed by Amogh K 9-Mar-2022
    let rfqResponse :any= await this.api.getAuditTrailRFQData(
      // this.pageNo * this.pageSize,
      this.pageNo,//Changes done by Jyoti S || FIN1EURINT-227 || 03-May-2023 
      //0, //DrishtyR | 2-Aug-2021 | This should be always 0 as slice function is used later for fetching needed records
      this.pageSize,//Changes done by Jyoti S || FIN1EURINT-227 || 03-May-2023 
      this.selectedProduct == "All" ? "" : this.selectedProduct,
      this.searchKey,
      this.fromFormattedDate,
      this.toFormattedDate,
      this.isDealer ? "Dealer" : "RM"
    ); //Changes done by Jyoti S || 09-Aug-2023 || HSBCECCLI-28
    //console.log("a", rfqResponse);
    if (rfqResponse) {
      this.rfqs = rfqResponse; //.filter(
      //   (rfq) =>
      //     rfq.Product.includes(this.selectedProduct) ||
      //     this.selectedProduct.includes(rfq.Product)
      // );
      //console.log("b", this.rfqs);
      //this.noOfRecords = this.rfqs?.length;
      this.noOfRecords < parseInt(this.rfqs[0].Total) ? this.noOfRecords =  parseInt(this.rfqs[0].Total) : "";//Changes done by Jyoti S || FIN1EURINT-227 || 22-Jun-2023 
      // this.pageIndex = 0;
      // this.currentItemsToShow = this.rfqs?.slice(this.pageIndex * this.pageSize,this.pageIndex * this.pageSize + this.pageSize);
      this.currentItemsToShow = this.rfqs;//Changes done by Jyoti S || FIN1EURINT-227 || 03-May-2023
      this.pageEnd = (this.pageIndex * this.pageSize + this.pageSize)<=this.noOfRecords ? (this.pageIndex * this.pageSize + this.pageSize):this.noOfRecords;//Changes done by Jyoti S || FIN1EURINT-227 || 03-May-2023   
    }
    return false;

  }

  changeProduct() {
    //<DrishtyR | 26-Aug-2021| Change to clear RFQ and Quote selection on product selection change>
    this.noOfRecords = 0;
    this.pageNo = 0;
    this.pageIndex = 0;
    this.pageStart = 0;
    this.pageEnd = 0;
    this.currentItemsToShow = [];
    this.rfqs = [];
    this.selectedQuote = -1;
    this.selectedRFQIndex = -1;
    this.quotes = [];
    this.solveForHeaderTxt = "Solve For Price";
    this.showSub = false;
    this.subscription = false;
    this.timelineArray = [];
    this.selectedRFQ = -1;
    this.showLogo = false;
    //</DrishtyR | 26-Aug-2021| Change to clear RFQ and Quote selection on product selection change>
    this.getRFQs();
  }

  async selectRQF(rfqid: any, index: any) {
    this.showLogo = false;
    this.showSub = false;
    this.subscription = false; //DrishtyR | 29-Jul-2021 | Added to Hide Subscription link on RFQ selection changed
    this.selectedRFQ = rfqid;
    this.selectedRFQIndex = index;  //DrishtyR | 30-Jul-2021 | Added for maintaining selected row index
    this.selectedQuote = -1;
    //console.log(rfqid);
    //<DrishtyR | 30-Jul-2021 | Change to set RFQID>
    //this.currentRFQID = this.rfqs[index].RFQID;
    //let quotes = this.api.getAuditTrailQuoteData(this.rfqs[index].RFQID);
    this.currentRFQID = rfqid;
    //Commented by KaustubhS for EuroConnect :: START
    // let quotes = this.api.getAuditTrailQuoteData(rfqid);
    // //</DrishtyR | 30-Jul-2021 | Change to set RFQID>
    // this.quotes = quotes.GetAuditTrailQuoteDataResult;
    // if (this.quotes !== undefined && this.quotes.length > -1) {
    //   this.solveForHeaderTxt = "Solve For " + this.quotes[0].SolveFor;
    // }
    // //console.log(this.quotes)
    // this.timelineArray = [];
    //Commented by KaustubhS for EuroConnect :: END
    this.quotes = await this.api.getAuditTrailQuoteData(rfqid) as [];
    if (this.quotes !== undefined && this.quotes.length > -1) {
      this.solveForHeaderTxt = "Solve For " + this.quotes[0].SolveFor;
    }
    //console.log(this.quotes)
    this.timelineArray = [];
  }
  async selectQuote(index) {

    this.showLogo = true;
    this.auditTrailRequest = false;
    this.auditTrailTermSheet = false;
    this.auditTrailKID = false;

    this.selectedQuote = index;
    if (this.quotes[index].Status === "Pool Created" || this.quotes[index].Status === "Order Placed") {  //case added by Rijwan 23-Jul-2021

      this.subscription = true;
    } else {
      this.subscription = false;
    }
    let response = []
    response = await this.api.getAuditTrailProductData(
      this.quotes[index].QuoteID,
      this.subscription
    ) as [];

    const months = {
      0: "Jan",
      1: "Feb",
      2: "Mar",
      3: "Apr",
      4: "May",
      5: "Jun",
      6: "Jul",
      7: "Aug",
      8: "Sep",
      9: "Oct",
      10: "Nov",
      11: "Dec",
    };

    this.products = response[0];

    this.subdData = []
    this.subRfq = '-1'
    if (this.subscription === true) {
      this.subdData = this.products.Subscriptions
      this.subdData = this.subdData.map((data: any) => {
        // //console.log(data.CreatedAt);
        // let dateTime = (new Date(Date.parse(data.CreatedAt + ' UTC'))).toLocaleString() // added by suvarna P || 14Feb2022 || assigned by Pranav
        let dateTime = data.CreatedAt as Date;
        // //console.log(dateTime);
        const formattedDate = `${new Date(dateTime).getDate()}-${months[new Date(dateTime).getMonth()]
          }-${new Date(dateTime).getFullYear()}`;
        let hours1 = new Date(dateTime).getHours() > 12 ? new Date(dateTime).getHours() - 12 : new Date(dateTime).getHours();
        var am_pm = new Date(dateTime).getHours() >= 12 ? "PM" : "AM";
        let hours = hours1 < 10 ? "0" + hours1 : hours1;
        var minutes = new Date(dateTime).getMinutes() < 10 ? "0" + new Date(dateTime).getMinutes() : new Date(dateTime).getMinutes();
        var seconds = new Date(dateTime).getSeconds() < 10 ? "0" + new Date(dateTime).getSeconds() : new Date(dateTime).getSeconds();
        const time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
        const formattedTime = time 
        
        return {
         
          CreatedAt: (new Date(Date.parse(data.CreatedAt + ' UTC'))).toLocaleString(),
          CreatedBy:  data.CreatedBy,
          DealID: data.DealID,
          RFQID: data.RFQID,
          NominalAmt: data.NominalAmt
        };
      });
      //console.log(this.subdData)
      if (this.subdData) {
        this.subRfq = this.subdData.length > 0 ? this.subdData[0].RFQID : "";
      }
    }
    this.showSub = false
    this.timelineArray = [];
    response = await this.api.GetAuditTrailTimelineData(
      this.subRfq,
      this.quotes[index].QuoteID
    ) as [];
    // let timelineResponse: any[] = response.GetAuditTrailTimelineDataResult as object[];
    let timelineResponse: any[] = response;


    var QRID : any;
    timelineResponse.forEach((record: any,index:any) => {
      //Changes done by Jyoti S || 31-Jul-2023 || FIN1EURINT-544 || START
      QRID = QRID ?? record.QuoteId;
      //console.log((new Date(Date.parse('3/15/2022 5:09:20 PM UTC'))).toLocaleString())
      //console.log((new Date(Date.parse(record.SolveForRequestAt + ' UTC'))).toLocaleString())
      // if (timelineResponse.length === 2) {
      //   if (record.Status === "Quote Expired") {
      //     this.timelineArray.push({
      //       Status: "Price Request",
      //       Time:(new Date(Date.parse(record.SolveForRequestAt + ' UTC'))).toLocaleString(),
      //       ActionBy: timelineResponse[0].RequestedBy
      //     });
      //   }

      // }

      //console.log(index)

      // if (record.SolveForResponseAt) {
      //   if (!this.auditTrailRequest) {
      //     this.timelineArray.push({
      //       Status: "Price Request",
      //       Time: (new Date(Date.parse(record.SolveForRequestAt + ' UTC'))).toLocaleString(),
      //       ActionBy: timelineResponse[0].RequestedBy
      //     });
      //     this.timelineArray.push({
      //       Status: "Price Received",
      //       Time: (new Date(Date.parse(record.SolveForResponseAt + ' UTC'))).toLocaleString(),
      //       ActionBy: ""
      //     });
      //     this.auditTrailRequest = true;

      //   }
      // }

     //Changes done by Jyoti S || 20-Jul-2023 || Start
        if (record.Status.toLowerCase() === "repriced" ) { //Changed by Jyoti S || 22-Apr-2024 || FIN1EURINT-716 || Added lowercase check 
          if(QRID != record.QuoteId || index=== 0){
            QRID = record.QuoteId;
            this.timelineArray.push({
              Status: index=== 0 ? "Price Request ( " + record.QuoteId + " )":"Repriced Request ( " + record.QuoteId + " )",
              Time: (new Date(Date.parse(record.SolveForRequestAt + ' UTC'))).toLocaleString(),
              ActionBy: timelineResponse[0].RequestedBy
            });
            if (record.SolveForResponseAt !== "") {
              this.timelineArray.push({
                Status: index === 0 ? "Price Received ( " + record.QuoteId + " )" : "Repriced Received ( " + record.QuoteId + " )",
                Time: (new Date(Date.parse(record.SolveForResponseAt + ' UTC'))).toLocaleString(),
                ActionBy: ""
              });
            }
          }

          if (record.KID_Requested && record.Event =='KID') {
            // if (!this.auditTrailKID) {
              this.timelineArray.push({
                Status: "KID Received",
                Time: (new Date(Date.parse(record.KID_Requested + ' UTC'))).toLocaleString(),// new Date(record.KID_Requested).getTime(),
                ActionBy: "",
                inserted: true
              });
              this.auditTrailKID = true;
            // }
          }
  
          if (record.Termsheet_Requested && record.Event =='Indicative Termsheet') {
            // if (!this.auditTrailTermSheet) {
              this.timelineArray.push({
                Status: "Termsheet Received",
                Time: (new Date(Date.parse(record.Termsheet_Requested + ' UTC'))).toLocaleString(),//new Date(record.Termsheet_Requested).getTime(),
                ActionBy: ""
              });
              this.auditTrailTermSheet = true;
    
            // }
          }
        } 

      //Start - Added by Apurva K|| 06-May-2024 || FIN1EURINT-718
        else if (record.Status.toLowerCase() === "matched") { //Changed by Jyoti S || 22-Apr-2024 || FIN1EURINT-716 || Added lowercase check 
          if(QRID != record.QuoteId || index=== 0 ){
            QRID = record.QuoteId;
            this.timelineArray.push({
              Status: index=== 0 ? "Match Price Request ( " + record.QuoteId + " )":"Match Price Request ( " + record.QuoteId + " )",
              Time: (new Date(Date.parse(record.SolveForRequestAt + ' UTC'))).toLocaleString(),
              ActionBy: timelineResponse[0].RequestedBy
            });
          if (record.SolveForResponseAt !== "") {
            this.timelineArray.push({
              Status: index === 0 ? "Price Matched ( " + record.QuoteId + " )" : "Price Matched ( " + record.QuoteId + " )",
              Time: (new Date(Date.parse(record.SolveForResponseAt + ' UTC'))).toLocaleString(),
              ActionBy: ""
            });
          }
          }
       if (record.KID_Requested && record.Event =='KID') {
          // if (!this.auditTrailKID) {
            this.timelineArray.push({
              Status: "KID Received",
              Time: (new Date(Date.parse(record.KID_Requested + ' UTC'))).toLocaleString(),// new Date(record.KID_Requested).getTime(),
              ActionBy: "",
              inserted: true
            });
            this.auditTrailKID = true;
          // }
        }
  
        if (record.Termsheet_Requested && record.Event =='Indicative Termsheet') {
          // if (!this.auditTrailTermSheet) {
            this.timelineArray.push({
              Status: "Termsheet Received",
              Time: (new Date(Date.parse(record.Termsheet_Requested + ' UTC'))).toLocaleString(),//new Date(record.Termsheet_Requested).getTime(),
              ActionBy: ""
            });
            this.auditTrailTermSheet = true;
  
          // }
        }
      }

      else if (record.Status.toLowerCase() === "match rejected") { //Changed by Jyoti S || 22-Apr-2024 || FIN1EURINT-716 || Added lowercase check 
        if(QRID != record.QuoteId || index=== 0 ){
          QRID = record.QuoteId;
          this.timelineArray.push({
            Status: index=== 0 ? "Match Price Request ( " + record.QuoteId + " )":"Match Price Request ( " + record.QuoteId + " )",
            Time: (new Date(Date.parse(record.SolveForRequestAt + ' UTC'))).toLocaleString(),
            ActionBy: timelineResponse[0].RequestedBy
          });
          this.timelineArray.push({
            Status: "Match Rejected ( " + record.QuoteId + " )",
            Time: (new Date(Date.parse(record.SolveForResponseAt + ' UTC'))).toLocaleString(),
          });
        }
    }
      //End - Added by Apurva K|| 06-May-2024 || FIN1EURINT-718
        
        else if (record.Status.toLowerCase() === "active") { //Changed by Jyoti S || 22-Apr-2024 || FIN1EURINT-716 || Added lowercase check 
          if(QRID != record.QuoteId || index=== 0 ){
            QRID = record.QuoteId;
            this.timelineArray.push({
              Status: index=== 0 ? "Price Request ( " + record.QuoteId + " )":"Repriced Request ( " + record.QuoteId + " )",
              Time: (new Date(Date.parse(record.SolveForRequestAt + ' UTC'))).toLocaleString(),
              ActionBy: timelineResponse[0].RequestedBy
            });
          if (record.SolveForResponseAt !== "") {
            this.timelineArray.push({
              Status: index === 0 ? "Price Received ( " + record.QuoteId + " )" : "Repriced Received ( " + record.QuoteId + " )",
              Time: (new Date(Date.parse(record.SolveForResponseAt + ' UTC'))).toLocaleString(),
              ActionBy: ""
            });
          }
          }
       if (record.KID_Requested && record.Event =='KID') {
          // if (!this.auditTrailKID) {
            this.timelineArray.push({
              Status: "KID Received",
              Time: (new Date(Date.parse(record.KID_Requested + ' UTC'))).toLocaleString(),// new Date(record.KID_Requested).getTime(),
              ActionBy: "",
              inserted: true
            });
            this.auditTrailKID = true;
          // }
        }
  
        if (record.Termsheet_Requested && record.Event =='Indicative Termsheet') {
          // if (!this.auditTrailTermSheet) {
            this.timelineArray.push({
              Status: "Termsheet Received",
              Time: (new Date(Date.parse(record.Termsheet_Requested + ' UTC'))).toLocaleString(),//new Date(record.Termsheet_Requested).getTime(),
              ActionBy: ""
            });
            this.auditTrailTermSheet = true;
  
          // }
        }
      } 
      
      else if (record.Status.toLowerCase() === "rejected") { //Changed by Jyoti S || 22-Apr-2024 || FIN1EURINT-716 || Added lowercase check 
        if(QRID != record.QuoteId || index=== 0){
          QRID = record.QuoteId;
        this.timelineArray.push({
          Status: index=== 0 ? "Price Request ( " + record.QuoteId + " )":"Repriced Request ( " + record.QuoteId + " )",
          Time: (new Date(Date.parse(record.SolveForRequestAt + ' UTC'))).toLocaleString(),
          ActionBy: timelineResponse[0].RequestedBy
        });
        this.timelineArray.push({
          Status: "Price Rejected ( " + record.QuoteId + " )",
          Time: (new Date(Date.parse(record.SolveForResponseAt + ' UTC'))).toLocaleString(),
        });
      }
      } 
      
      else if( record.Status.toLowerCase() === 'expired' || record.Status.toLowerCase() == "quote expired") { //Changed by Jyoti S || 22-Apr-2024 || FIN1EURINT-716 || Added lowercase check 
        if(record.Status.toLowerCase() == "expired")
        {
          if(QRID != record.QuoteId || index=== 0){
            QRID = record.QuoteId;
          this.timelineArray.push({
            Status: index=== 0 ? "Price Request ( " + record.QuoteId + " )":"Repriced Request ( " + record.QuoteId + " )",
            Time: (new Date(Date.parse(record.SolveForRequestAt + ' UTC'))).toLocaleString(),
            ActionBy: timelineResponse[0].RequestedBy
          });
        if (record.SolveForResponseAt !== "") {
          this.timelineArray.push({
            Status: index === 0 ? "Price Received ( " + record.QuoteId + " )" : "Repriced Received ( " + record.QuoteId + " )",
            Time: (new Date(Date.parse(record.SolveForResponseAt + ' UTC'))).toLocaleString(),
            ActionBy: ""
          });
        }
      }
        }
        else{
          this.timelineArray.push({
            Status: record.Status + " ( " + record.QuoteId + " )",
            Time: (new Date(Date.parse(record.Time + ' UTC'))).toLocaleString(),
            inserted: false
          });
        }
        if (record.KID_Requested && record.Event =='KID') {
          // if (!this.auditTrailKID) {
            this.timelineArray.push({
              Status: "KID Received",
              Time: (new Date(Date.parse(record.KID_Requested + ' UTC'))).toLocaleString(),// new Date(record.KID_Requested).getTime(),
              ActionBy: "",
              inserted: true
            });
            this.auditTrailKID = true;
          // }
        }
  
        if (record.Termsheet_Requested && record.Event =='Indicative Termsheet') {
          // if (!this.auditTrailTermSheet) {
            this.timelineArray.push({
              Status: "Termsheet Received",
              Time: (new Date(Date.parse(record.Termsheet_Requested + ' UTC'))).toLocaleString(),//new Date(record.Termsheet_Requested).getTime(),
              ActionBy: ""
            });
            this.auditTrailTermSheet = true;
  
          // }
        }
      }
      else if( record.Status.toLowerCase() === 'no response') { //Changed by Jyoti S || 22-Apr-2024 || FIN1EURINT-716 || Added lowercase check 
        this.timelineArray.push({
          Status: index=== 0 ? "Price Request ( " + record.QuoteId + " )":"Repriced Request ( " + record.QuoteId + " )",
          Time: (new Date(Date.parse((record.SolveForRequestAt) + ' UTC'))).toLocaleString(),
          ActionBy: timelineResponse[0].RequestedBy,
        });
        if (record.SolveForResponseAt == "") {
        this.timelineArray.push({
          Status: record.Status + " ( " + record.QuoteId + " )",
        });
      }
     if (record.KID_Requested && record.Event =='KID') {
        // if (!this.auditTrailKID) {
          this.timelineArray.push({
            Status: "KID Received",
            Time: (new Date(Date.parse(record.KID_Requested + ' UTC'))).toLocaleString(),// new Date(record.KID_Requested).getTime(),
            ActionBy: "",
            inserted: true
          });
          this.auditTrailKID = true;
        // }
      }

      if (record.Termsheet_Requested && record.Event =='Indicative Termsheet') {
        // if (!this.auditTrailTermSheet) {
          this.timelineArray.push({
            Status: "Termsheet Received",
            Time: (new Date(Date.parse(record.Termsheet_Requested + ' UTC'))).toLocaleString(),//new Date(record.Termsheet_Requested).getTime(),
            ActionBy: ""
          });
          this.auditTrailTermSheet = true;

        // }
      }
      }
      //Changed by Jyoti S || 22-Apr-2024 || FIN1EURINT-716 || Added condition to display order placement timeline  || START
      else if(record.Status.toLowerCase() == 'order placed'){
          if(QRID != record.QuoteId || index=== 0){
            QRID = record.QuoteId;
            if (record.SolveForRequestAt !== "") {
          this.timelineArray.push({
            Status: index=== 0 ? "Price Request ( " + record.QuoteId + " )":"Repriced Request ( " + record.QuoteId + " )",
            Time: (new Date(Date.parse(record.SolveForRequestAt + ' UTC'))).toLocaleString(),
            ActionBy: timelineResponse[0].RequestedBy
          });
        }
        if (record.SolveForResponseAt !== "") {
          this.timelineArray.push({
            Status: index === 0 ? "Price Received ( " + record.QuoteId + " )" : "Repriced Received ( " + record.QuoteId + " )",
            Time: (new Date(Date.parse(record.SolveForResponseAt + ' UTC'))).toLocaleString(),
            ActionBy: ""
          });
        }
      }
      if (record.KID_Requested && record.Event.toLowerCase() =='kid') {
        // if (!this.auditTrailKID) {
          this.timelineArray.push({
            Status: "KID Received",
            Time: (new Date(Date.parse(record.KID_Requested + ' UTC'))).toLocaleString(),// new Date(record.KID_Requested).getTime(),
            ActionBy: "",
            inserted: true
          });
          this.auditTrailKID = true;
        // }
      }

      if (record.Termsheet_Requested && record.Event.toLowerCase() =='indicative termsheet') {
        // if (!this.auditTrailTermSheet) {
          this.timelineArray.push({
            Status: "Termsheet Received",
            Time: (new Date(Date.parse(record.Termsheet_Requested + ' UTC'))).toLocaleString(),//new Date(record.Termsheet_Requested).getTime(),
            ActionBy: ""
          });
          this.auditTrailTermSheet = true;

        // }
      }

      
    }
    //Changed by Jyoti S || 22-Apr-2024 || FIN1EURINT-716 || Added condition to display order placement timeline  || END
    // else if(record.Status.toLowerCase() != 'quote expired'){
        else{
        this.timelineArray.push({
          Status: record.OrderId ? "( " + record.OrderId +" ) " + record.Status  : record.Status, //Changed by Jyoti S || 22-Apr-2024 || FIN1EURINT-716 || Added for the remaining states of quote  
          Time: (new Date(Date.parse(record.Time + ' UTC'))).toLocaleString(),
          ActionBy: record.ActionBy,
          inserted: false
        });
      }
//Changes done by Jyoti S || 20-Jul-2023 || End

      if (record.Status === "" && record.SolveForResponseAt === "" && record.KID_Requested === "" && record.Termsheet_Requested === "") {

        this.timelineArray.push({
          Status: "Price Request",
          Time: (new Date(Date.parse(record.SolveForRequestAt + ' UTC'))).toLocaleString(),
          ActionBy: timelineResponse[0].RequestedBy
        });
      }

    });
    //Changes done by Jyoti S || 31-Jul-2023 || FIN1EURINT-544 || END
    // this.timelineArray = this.timelineArray.sortBy("Time");

    //console.log("TimelineArray:: ", this.timelineArray)
    //console.log(this.timelineArray);
    // this.timelineArray = this.timelineArray.map((data: any) => {
    //   let dateTime = data.Time as Date;
    //   //console.log(dateTime);
    //   const formattedDate = `${new Date(dateTime).getDate()}-${months[new Date(dateTime).getMonth()]
    //     }-${new Date(dateTime).getFullYear()}`;

    //   // const formattedTime = `${new Date(dateTime).getHours()}:${new Date(dateTime).getMinutes()}:${new Date(dateTime).getSeconds()}`;
    //   // let hours = dateTime.getHours();
    //   // let minutes = dateTime.getMinutes();
    //   // var ampm = hours >= 12 ? 'PM' : 'AM';
    //   // hours = hours % 12;
    //   // hours = hours ? hours : 12; 
    //   // minutes = ('0'+minutes).slice(-2);
    //   // let strTime = hours + ':' + minutes + ' ' + ampm;
    //   // const formattedTime = strTime

    //   let hours1 = new Date(dateTime).getHours() > 12 ? new Date(dateTime).getHours() - 12 : new Date(dateTime).getHours();
    //   var am_pm = new Date(dateTime).getHours() >= 12 ? "PM" : "AM";
    //   let hours = hours1 < 10 ? "0" + hours1 : hours1;
    //   var minutes = new Date(dateTime).getMinutes() < 10 ? "0" + new Date(dateTime).getMinutes() : new Date(dateTime).getMinutes();
    //   var seconds = new Date(dateTime).getSeconds() < 10 ? "0" + new Date(dateTime).getSeconds() : new Date(dateTime).getSeconds();
    //   const time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
    //   const formattedTime = time

    //   return {
    //     Status: data.Status,
    //     Date: formattedDate,
    //     Time: formattedTime,
    //     ActionBy: data.ActionBy,
    //   };
    // });
    //console.log(this.timelineArray);
  }

  // async handlePage(event) {
  //   try {
  //     //Changed by Amogh K | 8-mar-2022
  //     this.noOfRecords = event.length;
  //     this.pageNo = event.pageNo;
  //     this.pageSize = parseInt(event.pageSize);
  //     this.pageIndex = event.pageNo;

  //     let y = this.pageIndex * this.pageSize;
  //     if(y>this.noOfRecords || event.reload){
  //       this.pageStart = 0;
  //       this.pageNo=0;
  //       this.pageIndex = 0;
  //     }
  //     else if(y < 0){
  //       this.pageStart = Math.floor(this.noOfRecords / this.pageSize) * this.pageSize;
  //       this.pageNo= Math.floor(this.noOfRecords / this.pageSize);
  //       this.pageIndex = Math.floor(this.noOfRecords / this.pageSize);
  //     }
  //     else{
  //       this.pageStart = y;
  //     }
  //     await this.getRFQs();
  //     //<DrishtyR | 30-Jul-2021| Change to clear RFQ and Quote selection on page index change>
  //     this.selectedRFQ = -1;
  //     this.selectedQuote = -1;
  //     this.selectedRFQIndex = -1;
  //     this.quotes = [];
  //     this.solveForHeaderTxt = "Solve For Price";
  //     this.showSub = false;
  //     this.subscription = false;
  //     this.timelineArray = [];
  //     //</DrishtyR | 30-Jul-2021| Change to clear RFQ and Quote selection on page index change>
  //     // this.currentItemsToShow = this.rfqs.slice(
  //     //   this.pageIndex * this.pageSize,
  //     //   this.pageIndex * this.pageSize + this.pageSize
  //     // );
  //   } catch (error) {
  //     //console.log(error);
  //   }
  // }

  async handlePage(event) {
    try {
      //Changed by Amogh K | 8-mar-2022
      this.noOfRecords = event.length;
      this.pageNo = event.pageNo;
      this.pageSize = parseInt(event.pageSize);
      this.pageIndex = event.pageNo;

      let y = this.pageIndex * this.pageSize;
      if(y >= this.noOfRecords || event.reload){
        this.pageStart = 0;
        this.pageNo=0;
        this.pageIndex = 0;
      }
      else if(y < 0){
        // this.pageStart = Math.floor(this.noOfRecords / this.pageSize) * this.pageSize;
        this.pageNo= Math.floor(this.noOfRecords / this.pageSize);
        this.pageStart = this.pageNo * this.pageSize + 1 > this.noOfRecords ? ((this.pageNo -1 ) * this.pageSize) : ((this.pageNo) * this.pageSize) // Changes done for corner case by Jyoti S || 03-May-2023 
        this.pageIndex = Math.floor(this.noOfRecords / this.pageSize);
        // Changes done for corner case by Jyoti S || 24-Apr-2023
      }
      else{
        this.pageStart = y;
      }
      await this.getRFQs();
      //<DrishtyR | 30-Jul-2021| Change to clear RFQ and Quote selection on page index change>
      this.selectedRFQ = -1;
      this.selectedQuote = -1;
      this.selectedRFQIndex = -1;
      this.quotes = [];
      this.solveForHeaderTxt = "Solve For Price";
      this.showSub = false;
      this.subscription = false;
      this.timelineArray = [];
      //</DrishtyR | 30-Jul-2021| Change to clear RFQ and Quote selection on page index change>
      // this.currentItemsToShow = this.rfqs.slice(
      //   this.pageIndex * this.pageSize,
      //   this.pageIndex * this.pageSize + this.pageSize
      // );
    } catch (error) {
      //console.log(error);
    }
  }

  showSubscriptions() {
    this.showSub = true;
    // this.viewOrderData = this.api.getOrderInfo(this.selectedProduct, 1, 1500, this.currentRFQID);
    // //console.log(this.viewOrderData);
  }
  hideSubscriptions() {
    this.showSub = false;
  }

  

}
