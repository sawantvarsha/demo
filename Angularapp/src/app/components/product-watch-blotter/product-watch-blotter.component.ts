import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild } from '@angular/core';
import { OrderDetailsService } from 'src/app/services/order-details.service';
import { DatePipe } from '@angular/common';
import { CommonApiService } from 'src/app/services/common-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { EMPTY, Subscription } from 'rxjs';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { WorkflowUCPService } from 'src/app/services/workflow-ucp.service';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/excel.service';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';
declare global {
  interface Array<T> {
    sortBy(p: any): Array<T>;
    sortByDesc(p: any): Array<T>;
  }
}
declare var require: any;
const $: any = require('jquery');
Array.prototype.sortBy = function (p): Array<any> {
  return this.slice(0).sort(function (a, b) {
    return a[p] > b[p] ? 1 : a[p] < b[p] ? -1 : 0;
  });
};

Array.prototype.sortByDesc = function (p): Array<any> {
  return this.slice(0).sort(function (a, b) {
    return a[p] < b[p] ? 1 : a[p] > b[p] ? -1 : 0;
  });
};

@Component({
  selector: 'app-product-watch-blotter',
  templateUrl: './product-watch-blotter.component.html',
  styleUrls: ['./product-watch-blotter.component.scss']
})
export class ProductWatchBlotterComponent implements OnInit {
  @ViewChild("ISINField") ISINField: ElementRef;
  @ViewChild("NameField") NameField: ElementRef;
  @ViewChild("PayoffField") PayoffField: ElementRef;
  @ViewChild("SDateField") SDateField: ElementRef;
  @ViewChild("MaturityField") MaturityField: ElementRef;
  @ViewChild("NextFixingField") NextFixingField: ElementRef;
  @ViewChild("CCYField") CCYField: ElementRef;
  @ViewChild("UnderlyingField") UnderlyingField: ElementRef;
  @ViewChild("IssuerField") IssuerField: ElementRef;
  // @ViewChild('menu') menus: QueryList<ElementRef>;;
  // @ViewChild('toggleButton') toggleButtons: QueryList<ElementRef>;
  blotterData: any = [];
  showISINFilter: boolean = false;
  showNameFilter: boolean = false;
  showPayOffFilter: boolean = false;
  showSDate: boolean = false;
  showMaturityFilter: boolean = false;
  showNextFixingFilter: boolean = false;
  showCCYFilter: boolean = false;
  showUnderlyingFilter: boolean = false;
  showIssuerFilter: boolean = false;
  showDropdown: boolean = false;
  outstandingAscend: boolean = false;
  coutAscend: boolean = false;
  upfrontAscend: boolean = false;
  mtmAscend: boolean = false;
  StartDateAscend:boolean=false;
  MaturityDateAscend:boolean=false;
  NextFixingDateAscend:boolean=false;
  searchPayOff: any = [];
  searchISIN: any = [];
  unFilteredBlotterData: any = [];
  filteredPayOff: any = [];
  filteredISIN: any = [];
  filteredName: any = [];
  payOffList: any = [];
  filteredData: any = [];
  referenceData: any = [];
  isFiltered: boolean = false;
  isFilteredISIN: boolean = false;
  isFilteredPName: boolean = false;
  isFilteredPayoff: boolean = false;
  isFilteredCCY: boolean = false;
  isFilteredUnderlyings: boolean = false;
  isFilteredIssuer: boolean = false;
  loader: boolean = false;
  payOff: any;
  StartDate: any;
  StartDateDisplay: any;
  MaturityDisplay:any;
  NextFixingDisplay:any;
  MaturityDate: any;
  NextFixingDate: any;
  activeShareIndex: any;
  selectedPayOff: any;
  showPayOff: any;
  selectedISIN: any;
  selectedPName: any;
  selectedCCY: any;
  selectedUnderlying: any;
  selectedIssuer: any;
  filterfield: string = "Upfront";
  orderDetailsSubscription: Subscription | undefined;
  I_EntityId: any;
  I_lngNoteMasterID: any;
  I_strCreatedBy: any;
  I_strFromDate: any;
  I_strToDate: any;
  LoginID: any;
  PrdType: any;
  strBranchName: any;
  strISIN: any;
  strIssuerID: any;
  strOrderNo: any;
  strSchemeName: any;
  str_CusID: any;
  str_OrderStatus: any;
  str_RMName: any;
  strcboserchcustomer: any;
  strissuertype: any;
  strordertype: any;
  I_strAccountNo: any;
  I_strFundCode: any;
  I_strShowOrdersFor: any;
  ShowAdditionalColumns: any;
  OrderDetailsData: any[] = [];
  errorHandleOrder: boolean = false;
  showOrderDetails: any = [];
  showOptions: any = [];
  selectedIndex: number;
  targetButtons: EventTarget;
  toggleButtons: any;
  strFuncName: any;
  successMsg: string;
  workflowList: any = [];
  showWorkflows: any = [];
  url: string;
  fileName:any = '';
  showProductWatchPopUP:boolean=false;
  // selectedMPG:string='Select MPG';
  selectedMPG:any;
  asseturl = environment.asseturl;
  MPGList=[
    {
        "BCM_Code": "PAYMTS",
        "BCM_ID": 64,
        "BCM_long_name": "All Payments"
    },
    {
        "BCM_Code": "PDLCYP",
        "BCM_ID": 26,
        "BCM_long_name": "Concentration By Underlying"
    },
    {
        "BCM_Code": "SPDRPT",
        "BCM_ID": 40,
        "BCM_long_name": "LC - Autocallable Reval Snapshot"
    },
    {
        "BCM_Code": "LFCSPS",
        "BCM_ID": 42,
        "BCM_long_name": "LC - Lifecycle Snapshot By ISIN"
    },
    {
        "BCM_Code": "EANTML",
        "BCM_ID": 43,
        "BCM_long_name": "LC - Performance Timeline"
    }
]
  constructor(
    private ods: OrderDetailsService,
    public datepipe: DatePipe,
    public commonApi: CommonApiService,
    public homeApi: HomeApiService,
    public title: Title,
    private renderer: Renderer2,
    public wfs: WorkflowUCPService,
    private apifunction: WorkflowApiService,
    private excelService: ExcelService
  ) {
    this.payOff = '';
    this.selectedISIN = '';
    this.showPayOff = '';
    this.selectedPName = '';
    this.selectedCCY = '';
    this.selectedUnderlying = '';
    this.selectedIssuer = '';
    //this.selectedMPG ='Select MPG'
    this.renderer.listen('window', 'click', (e: Event) => {
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
     // console.log(this.selectedIndex, e)
      if (this.selectedIndex !== undefined && this.selectedIndex !== null) {
        if (!(e.target === this.toggleButtons) && this.showOptions[this.selectedIndex] === true) {
          console.log(this.selectedIndex, this.showOptions[this.selectedIndex])
          // if(this.showWorkflows[this.selectedIndex] === true)
          // {

          // }
          // else{
          //   this.showOptions[this.selectedIndex] = false;
          // }

          // if(this.selectedIndex!==2)
          // {
          //   this.showOptions[this.selectedIndex] = false;
          // }
          this.showOptions[this.selectedIndex] = false;
        }
      }

    });
  }

  ngOnInit(): void {
    this.loader = true;
    this.getDataForBlotter();
    this.I_EntityId = '149';
    this.I_strCreatedBy = 'SOLAR_T1';
    this.I_strFromDate = '';
    this.I_strToDate = '';
    this.LoginID = 'SOLAR_T1';
    this.PrdType = 'BOTH';
    this.strBranchName = '';
    this.strISIN = '';
    this.strIssuerID = '0';
    this.strOrderNo = '';
    this.strSchemeName = '';
    this.str_CusID = '0';
    this.str_OrderStatus = 'All';
    this.str_RMName = '';
    this.strcboserchcustomer = '';
    this.strissuertype = 'All';
    this.strordertype = 'All';
    this.I_strAccountNo = '';
    this.I_strFundCode = '';
    this.I_strShowOrdersFor = 'NonFunds';
    this.ShowAdditionalColumns = 'N';
    this.errorHandleOrder = false;
    this.StartDate = "";
    this.StartDateDisplay = "";
    this.MaturityDisplay="";
    this.MaturityDate = "";
    this.NextFixingDate = "";
    this.NextFixingDisplay=""
  }
  getDataForBlotter() {
    this.loader = true;
    this.ods.GetProductWatchBlotter().subscribe(async (res: any) => {
      console.log(res);
      if (res) {
        let blotterData = [];
        blotterData = await res;
        blotterData.forEach(element => {

          element.Start_Date = this.datepipe.transform(element?.Start_Date, "dd-MMM-yyyy");
          element.Maturity_date = this.datepipe.transform(element?.Maturity_date, "dd-MMM-yyyy");
          element.Next_fixing = this.datepipe.transform(element?.Next_fixing, "dd-MMM-yyyy");
          element.Next_fixing_date = element.Next_fixing
          //element.Outstanding=this.commonApi.formatNumber(element?.Outstanding);
          // element.Upfront=this.commonApi.formatNumber(element?.Upfront);
          // element.MTM=this.commonApi.formatNumber(element?.MTM);
          element.Outstanding1 = this.commonApi.formatNumber(element?.Outstanding);
          element.Upfront1 = this.commonApi.formatNumber(element?.Upfront);
          element.MTM1 = this.commonApi.formatNumber(element?.MTM);
          // element.MTM=parseFloat(element.MTM).toFixed(2)
          // element.Upfront=parseFloat(element.Upfront).toFixed(2)
        });
        this.blotterData = blotterData;
        let mainData = blotterData;
        this.unFilteredBlotterData = mainData;
        this.filteredData = this.unFilteredBlotterData
        console.log(this.blotterData)
      }
    })
    this.loader = false;
  }
  async focusOnISIN() {
    this.showISINFilter = !this.showISINFilter;
    if (this.showISINFilter) {
      $('#ISIN').css("visibility", "visible")
      console.log("this.show", this.showISINFilter)
      await this.ISINField.nativeElement.focus();
    }
    else {
      $('#ISIN').css("visibility", "hidden")
    }

  }
  async focusOnPName() {
    this.showNameFilter = !this.showNameFilter;
    if (this.showNameFilter) {
      $('#Name').css("visibility", "visible")
      await this.NameField.nativeElement.focus();
    }
    else {
      $('#Name').css("visibility", "hidden")
    }

  }
  async focusOnPayoff() {
    this.showPayOffFilter = !this.showPayOffFilter;
    if (this.showPayOffFilter) {
      $('#Payoff').css("visibility", "visible")
      await this.PayoffField.nativeElement.focus();
    }
    else {
      $('#Payoff').css("visibility", "hidden")
    }

  }
  async focusOnSDate() {
    console.log("STARTT DATE", this.StartDateDisplay);
    this.showSDate = !this.showSDate;
    if (this.showSDate) {
      $('#SDate').css("visibility", "visible")
      await this.SDateField.nativeElement.focus();
    }
    else {
      $('#SDate').css("visibility", "hidden")
    }
  }
  async focusOnMaturity() {
    this.showMaturityFilter = !this.showMaturityFilter;
    if (this.showMaturityFilter) {
      $('#Maturity').css("visibility", "visible")
      await this.MaturityField.nativeElement.focus();
    }
    else {
      $('#Maturity').css("visibility", "hidden")
    }
  }

  async focusOnNextFixing() {
    this.showNextFixingFilter = !this.showNextFixingFilter;
    if (this.showNextFixingFilter) {
      $('#NextFixing').css("visibility", "visible")
      await this.NextFixingField.nativeElement.focus();
    }
    else {
      $('#NextFixing').css("visibility", "hidden")
    }
  }
  async focusOnCCY() {
    this.showCCYFilter = !this.showCCYFilter;
    if (this.showCCYFilter) {
      $('#CCY').css("visibility", "visible")
      await this.CCYField.nativeElement.focus();
    }
    else {
      $('#CCY').css("visibility", "hidden")
    }

  }
  async focusOnUnderlyings() {
    this.showUnderlyingFilter = !this.showUnderlyingFilter;
    if (this.showUnderlyingFilter) {
      $('#Underlying').css("visibility", "visible")
      await this.UnderlyingField.nativeElement.focus();
    }
    else {
      $('#Underlying').css("visibility", "hidden")
    }

  }
  async focusOnIssuer() {
    this.showIssuerFilter = !this.showIssuerFilter;
    if (this.showIssuerFilter) {
      $('#Issuer').css("visibility", "visible")
      await this.IssuerField.nativeElement.focus();
    }
    else {
      $('#Issuer').css("visibility", "hidden")
    }

  }
  PayOffFilter() {

    this.searchPayOff = [];
    let duplicatelist: any = [];
    let sampleArr: any = [];
    this.unFilteredBlotterData.forEach(element => {
      duplicatelist.push(element.Payoff)
    });
    duplicatelist = ([...new Set(duplicatelist)]);
    this.searchPayOff[0] = ["All", "false"];
    duplicatelist = duplicatelist.sort((a, b) =>
      a > b ? 1 : -1
    );
    console.log(duplicatelist)
    duplicatelist.forEach(element => {
      let arr: any = [];
      arr = [element, "false"]
      sampleArr.push(arr)
      this.searchPayOff.push(arr)
    });
    this.payOffList = sampleArr;
    console.log(duplicatelist, this.searchPayOff)
  }

  searchISINFilter(selectedISIN: KeyboardEvent) {

    console.log(selectedISIN)
    if (this.selectedISIN == "") {
      console.log("CHECK FILETERED ISIN", this.filteredISIN)
      this.filteredISIN = [];
    }
    this.searchISIN = [];
    let duplicatelist: any = [];
    console.log(this.selectedISIN)
    let mainData = this.unFilteredBlotterData;
    console.log(this.filteredPayOff)
    /*try*/
    if (this.selectedISIN = "") {
      this.isFilteredISIN = false;
    }
    else {
      this.isFilteredISIN = true;
    }
    this.checkallFilters();
    // if(this.isFiltered)
    // {
    //   if()
    // }
    // else{
    //   this.blotterData=mainData.filter((s:any)=>s.Product_Ref.includes(this.selectedISIN))
    //   let filteredISIN :any []= this.blotterData;
    //   this.filteredISIN=filteredISIN;
    //   this.filteredData=filteredISIN
    // }
    /*try end*/
    if (this.filteredPayOff.length == 0) {
      console.log("LENGTH 0")
      this.blotterData = mainData.filter((s: any) => s.Product_Ref.includes(this.selectedISIN))
      let filteredISIN: any[] = this.blotterData;
      this.filteredISIN = filteredISIN;
      this.filteredData = filteredISIN

    }
    else {
      this.blotterData = this.filteredPayOff.filter((s: any) => s.Product_Ref.includes(this.selectedISIN))
      let filteredISIN: any[] = this.blotterData;
      this.filteredISIN = filteredISIN;
      this.filteredData = filteredISIN
    }

    // let mainData = this.unFilteredBlotterData;

    // console.log("IS FILETERED ccy", this.isFiltered, this.filteredData, this.blotterData)
    // if(this.selectedISIN=="")
    // {
    //   this.isFiltered=false;
    // }
    // else{
    //   this.isFiltered=true;
    // }
    // if(this.isFiltered)
    // {

    //  // this.blotterData=this.filteredData.filter((s:any)=>s.Currency.toLowerCase().includes(this.selectedCCY.toLowerCase()))
    //   let filteredData=this.filteredData.filter((s:any)=>s.Product_Ref.includes(this.selectedISIN))
    //   this.blotterData=filteredData;
    //   this.filteredData=filteredData

    // }
    // else{
    //   this.filteredData=mainData
    //   this.blotterData=mainData.filter((s:any)=>s.Product_Ref.includes(this.selectedISIN))
    // }

    console.log(this.blotterData)
  }

  FilterForAll(event: KeyboardEvent) {
    console.log("STARTT DATE", this.StartDateDisplay, event)
    let backupData = this.unFilteredBlotterData;
    console.log()
    for (let index = 0; index < this.showOrderDetails.length; index++) {
      // let element = this.showOrderDetails[index];
      // element=false;
      this.showOrderDetails[index] = false;
      this.showOptions[index] = false;
      this.showWorkflows[index] = false;

    }
    if (this.selectedISIN != "") {
      backupData = backupData.filter((s: any) => s.Product_Ref.includes(this.selectedISIN))
    }
    if (this.selectedPName != "") {
      backupData = backupData.filter((s: any) => s.Product_Name.toLowerCase().includes(this.selectedPName.toLowerCase()))
    }
    if (this.payOff != "") {
      console.log(this.payOff, this.selectedPayOff);
      //this.blotterData=this.blotterData.filter((s)=>s.Payoff===selectedPayOff);
      // if(this.selectedPayOff!= undefined && this.selectedPayOff!="")
      // {
      //   backupData=backupData.filter((s)=>s.Payoff.toLowercase().includes(this.payOff.toLowerCase()));
      // }

      // this.referenceData=backupData;
      // this.searchPayoff(event)
      this.searchPayOff = this.payOffList.filter((s: any) => s[0].toLowerCase().includes(this.payOff.toLowerCase()))

      try {
        // console.log(event);
        console.log(this.payOff, "2", this.selectedPayOff)
        if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event?.key)) {

          if (this.payOff == "") {
            this.filteredPayOff = [];
          }
          console.log(this.payOff)
          this.activeShareIndex = 0;
        }
        if (['Enter'].includes(event?.key)) {
          backupData = backupData.filter((s) => s.Payoff === this.selectedPayOff);
          this.showDropdown = false;
        }
        console.log(event?.type)
        if (event?.type == "click") {
          console.log(this.selectedPayOff)
          backupData = backupData.filter((s) => s.Payoff === this.payOff);
          this.showDropdown = false;
        }
        // else{
        //   //backupData=backupData.filter((s)=>s.Payoff===this.selectedPayOff);
        //   backupData=backupData.filter((s)=>s.Payoff.toLowercase().includes(this.selectedPayOff.toLowerCase()));

        //   this.showDropdown=false;
        // }
      } catch (error) { }
      console.log(backupData)
    }
    if (this.selectedCCY != "") {
      backupData = backupData.filter((s: any) => s.Currency.toLowerCase().includes(this.selectedCCY.toLowerCase()))
    }
    if (this.selectedUnderlying != "") {
      backupData = backupData.filter((s: any) => s.Underlyings.toLowerCase().includes(this.selectedUnderlying.toLowerCase()))
    }
    if (this.selectedIssuer != "") {
      backupData = backupData.filter((s: any) => s.Issuer.toLowerCase().includes(this.selectedIssuer.toLowerCase()))
    }
    if (this.StartDateDisplay != "" && this.StartDateDisplay !== undefined) {
      backupData = backupData.filter((s: any) => s.Start_Date == this.StartDateDisplay)
    }
    if (this.MaturityDisplay != "" && this.MaturityDisplay !== undefined) {
      backupData = backupData.filter((s: any) => s.Maturity_date == this.MaturityDisplay)
    }
    if (this.NextFixingDisplay != "" && this.NextFixingDisplay !== undefined) {
      backupData = backupData.filter((s: any) => s.Next_fixing == this.NextFixingDisplay)
    }


    this.blotterData = backupData;
  }
  finalSelectPayOff() {

  }

  searchNameFilter(selectedName: KeyboardEvent) {

    console.log(selectedName)
    this.searchISIN = [];
    if (this.selectedPName == "") {
      console.log("NONOOOOOOO NAME", this.filteredName)
      this.filteredName = [];
    }
    let duplicatelist: any = [];
    console.log(this.selectedPName)
    let mainData = this.unFilteredBlotterData;
    console.log(this.filteredPayOff, this.filteredISIN)
    if (this.filteredPayOff.length == 0 && this.filteredISIN.length == 0) {
      console.log("LENGTH 0")
      this.blotterData = mainData.filter((s: any) => s.Product_Name.toLowerCase().includes(this.selectedPName.toLowerCase()))
      let filteredName: any[] = this.blotterData;
      this.filteredName = filteredName;

    }
    else {
      console.log("isnide else", this.filteredPayOff, this.filteredISIN)
      if (this.filteredISIN.length > 0 && this.filteredPayOff > 0) {
        console.log("1", this.blotterData)
        this.blotterData = this.blotterData.filter((s: any) => s.Product_Name.toLowerCase().includes(this.selectedPName.toLowerCase()))
        let filteredName: any[] = this.blotterData;
        this.filteredName = filteredName;
      }
      else if (this.filteredISIN.length > 0 && this.filteredPayOff.length <= 0) {
        console.log("2", this.filteredISIN)
        this.blotterData = this.filteredISIN.filter((s: any) => s.Product_Name.toLowerCase().includes(this.selectedPName.toLowerCase()))
        let filteredName: any[] = this.blotterData;
        this.filteredName = filteredName;
      }
      else if (this.filteredPayOff.length > 0 && this.filteredISIN.length <= 0) {
        console.log("3", this.filteredPayOff)
        this.blotterData = this.filteredPayOff.filter((s: any) => s.Product_Name.toLowerCase().includes(this.selectedPName.toLowerCase()))
        let filteredName: any[] = this.blotterData;
        this.filteredName = filteredName;
      }
      // this.blotterData=this.filteredPayOff.filter((s:any)=>s.Product_Name.includes(this.selectedPName.toLowerCase()))
      // let filteredName :any []= this.blotterData;
      // this.filteredName=filteredName;
    }
    // if(this.filteredPayOff.length==0)
    // {
    //   console.log("LENGTH 0")
    //   this.blotterData=mainData.filter((s:any)=>s.Product_Name.toLowerCase().includes(this.selectedPName.toLowerCase()))
    //   // this.blotterData=this.filteredPayOff.filter((s:any)=>s.Product_Ref.includes(this.selectedISIN))
    // }
    // else{
    //   this.blotterData=this.filteredPayOff.filter((s:any)=>s.Product_Name.includes(this.selectedPName.toLowerCase()))
    //   //this.blotterData=mainData.filter((s:any)=>s.Product_Ref.includes(this.selectedISIN))
    // }
    console.log(this.blotterData)
  }

  async searchPayoff(event) {
    // this.showDropdown=true;
    console.log(event, this.filteredName, this.filteredISIN)
    // if(this.filteredName.length==0 && this.filteredISIN.length==0)
    // {
    //   console.log("111111")
    //   this.blotterData=this.unFilteredBlotterData;
    // }
    // else if(this.filteredName.length>0 && this.filteredISIN.length>0)
    // {
    //   console.log("222222")
    //   this.blotterData=this.blotterData;
    // }
    // else if(this.filteredISIN.length>0 && this.filteredName.length<=0 )
    // {
    //   console.log("33333333")
    //   this.blotterData=this.filteredISIN;
    // }
    // else if(this.filteredName.length>0 && this.filteredISIN.length<=0)
    // {
    //   console.log("44444444")
    //   this.blotterData=this.filteredName;
    // }
    this.searchPayOff = this.payOffList.filter((s: any) => s[0].toLowerCase().includes(this.payOff.toLowerCase()))

    try {
      // console.log(event);
      console.log(this.payOff, "2", this.selectedPayOff)
      if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {

        if (this.payOff == "") {
          this.filteredPayOff = [];
        }
        console.log(this.payOff)
        this.activeShareIndex = 0;
      }
      if (['Enter'].includes(event.key)) {
        this.blotterData = this.blotterData.filter((s) => s.Payoff === this.selectedPayOff);
        this.showDropdown = false;
      }
      console.log(event.type)
      if (event.type == "click") {
        console.log(this.selectedPayOff)
        this.blotterData = this.blotterData.filter((s) => s.Payoff === this.payOff);
        this.showDropdown = false;
      }
    } catch (error) { }
  }

  searchCCYFilter(event: KeyboardEvent) {
    let mainData = this.unFilteredBlotterData;

    console.log(event)
    console.log("IS FILETERED ccy", this.isFiltered, this.filteredData, this.blotterData)
    if (this.selectedCCY == "") {
      this.isFiltered = false;
    }
    else {
      this.isFiltered = true;
    }
    if (this.isFiltered) {

      // this.blotterData=this.filteredData.filter((s:any)=>s.Currency.toLowerCase().includes(this.selectedCCY.toLowerCase()))
      let filteredData = this.filteredData.filter((s: any) => s.Currency.toLowerCase().includes(this.selectedCCY.toLowerCase()))
      this.blotterData = filteredData;
      this.filteredData = filteredData

    }
    else {
      this.filteredData = mainData
      this.blotterData = mainData.filter((s: any) => s.Currency.toLowerCase().includes(this.selectedCCY.toLowerCase()))
    }
    // this.blotterData=mainData.filter((s:any)=>s.Currency.toLowerCase().includes(this.selectedCCY.toLowerCase()))


  }
  checkallFilters() {
    if (!this.isFilteredCCY && !this.isFilteredISIN && !this.isFilteredIssuer && !this.isFilteredPName && !this.isFilteredPayoff && !this.isFilteredUnderlyings) {
      this.isFiltered = false;
    }
    else {
      this.isFiltered = true;
    }
  }
  searchUnderlyingFilter(event: KeyboardEvent) {
    let mainData = this.unFilteredBlotterData;
    console.log(event)
    // this.blotterData=mainData.filter((s:any)=>s.Underlyings.toLowerCase().includes(this.selectedUnderlying.toLowerCase()))
    console.log("IS FILETERED underlying", this.isFiltered, this.filteredData, this.blotterData)
    if (this.selectedUnderlying == "") {
      this.isFiltered = false;
    }
    else {
      this.isFiltered = true;
    }
    if (this.isFiltered) {

      // this.blotterData=this.filteredData.filter((s:any)=>s.Currency.toLowerCase().includes(this.selectedCCY.toLowerCase()))
      let filteredData = this.filteredData.filter((s: any) => s.Underlyings.toLowerCase().includes(this.selectedUnderlying.toLowerCase()))
      this.blotterData = filteredData;
      this.filteredData = filteredData

    }
    else {
      this.filteredData = mainData
      this.blotterData = mainData.filter((s: any) => s.Underlyings.toLowerCase().includes(this.selectedUnderlying.toLowerCase()))
    }
  }
  searchIssuerFilter(event: KeyboardEvent) {
    let mainData = this.unFilteredBlotterData;
    console.log(event)
    this.blotterData = mainData.filter((s: any) => s.Issuer.toLowerCase().includes(this.selectedIssuer.toLowerCase()))
    // let filteredISIN :any []= this.blotterData;
    // this.filteredISIN=filteredISIN;

  }
  selectPayOff(selectedPayOff) {
    this.filteredPayOff = [];
    console.log(selectedPayOff)
    if (selectedPayOff == "All") {
      this.blotterData = this.unFilteredBlotterData;
      let filteredPayOff: any[] = this.blotterData;
      this.filteredPayOff = filteredPayOff;
    }
    else {
      this.blotterData = this.blotterData.filter((s) => s.Payoff === selectedPayOff);
      let filteredPayOff: any[] = this.blotterData;
      this.filteredPayOff = filteredPayOff;
    }

    // console.log("selectedPayOff",this.selectedPayOff)
    // this.blotterData=this.blotterData.filter((s)=>s.Payoff.includes(this.selectedPayOff));

    this.showDropdown = false;
  }
  selectShare() {
    this.searchPayOff.forEach((s, i) => {
      s[1] = "false";
      if (i === this.activeShareIndex) {
        s[1] = "true";
      }
    });
    this.selectedPayOff = this.searchPayOff.filter((s) => s[1] == "true")[0][0];
    console.log(this.selectedPayOff)
  }

  changeSearchIndex(dir) {
    switch (dir) {
      case 'DOWN':
        this.activeShareIndex =
          this.searchPayOff.length - 1 === this.activeShareIndex
            ? 0
            : this.activeShareIndex + 1;

        break;
      case 'UP':
        this.activeShareIndex =
          this.activeShareIndex > 0
            ? this.activeShareIndex - 1
            : this.searchPayOff.length - 1;

        break;

      default:
        break;
    }
    console.log(this.searchPayOff);
    this.selectShare();
    this.commonApi.ScrollTo('.shares-list', '.active-share', 'down');


  }

  goToPage(searchISIN, i) {
    console.log('Hello', window.location.origin + '/ProductWatch' + "?Master_Popup=POPUP", searchISIN, this.unFilteredBlotterData.filter((s: any) => s.Product_Ref == searchISIN)[0]['Product_Name']);
    sessionStorage.setItem('SearchProductName', this.unFilteredBlotterData.filter((s: any) => s.Product_Ref == searchISIN)[0]['Product_Name']);
    sessionStorage.setItem('SearchISIN', searchISIN);
    this.showOptions[i] = false
    //window.open(window.location.origin + '/ClientSelfServicePortal/ProductWatch' + "?Master_Popup=POPUP&ViewProductWatch");
    // window.location.origin + '/' + environment.hostedApp + '/reports'
  }
  // viewWorkflows(searchISIN, i) {
  //   console.log(i)
  //   this.wfs.GetSearchedRef(searchISIN, sessionStorage.getItem("Username")).subscribe((res) => {
  //     console.log(res);
  //     this.workflowList = res.GetSearchedRefResult;
  //     console.log(this.workflowList)
  //     this.workflowList.forEach(element => {
  //       console.log(element.WTM_Title)
  //     });
  //   })
  // }
  async goToViewWorkflow(searchISIN, i,workflow) {

    console.log('Hello', window.location.origin + '/ClientSelfServicePortal/workflow/blotter' + "?Master_Popup=POPUP&ViewWorkflow", searchISIN, this.unFilteredBlotterData.filter((s: any) => s.Product_Ref == searchISIN)[0]['Product_Name']);
    sessionStorage.setItem('SearchProductName', this.unFilteredBlotterData.filter((s: any) => s.Product_Ref == searchISIN)[0]['Product_Name']);
    //sessionStorage.setItem('SearchISIN', searchISIN); //uncomment this for ISIN
    sessionStorage.setItem('SearchISIN', searchISIN);
    this.showOptions[i] = false;
    // Added by Mitali D - 19-05-2023 - START
    sessionStorage.setItem('navFromProductWatch', 'true');
    sessionStorage.setItem('navFromProductWatchInfo', JSON.stringify({
      wfId:workflow.WTM_ID,
      wfType:workflow.WTM_Title,
      qId:workflow.QM_ID,
      refNo:searchISIN
     }));
    // Added by Mitali D - 19-05-2023 - END
    window.open(window.location.origin + '/ClientSelfServicePortal/workflow/blotter' + "??Master_Popup=POPUP&ViewWorkflow");
    // window.location.origin + '/' + environment.hostedApp + '/reports'

    
  }
  goToUCP(searchISIN, i, TokenId, Queue_Id) {
    console.log('Hello', i, window.location.origin + '/ClientSelfServicePortal/workflow/blotter' + "?Master_Popup=POPUP&ViewWorkflow", searchISIN, this.unFilteredBlotterData.filter((s: any) => s.Product_Ref == searchISIN)[0]['Product_Name']);
    // sessionStorage.setItem('SearchProductName', this.unFilteredBlotterData.filter((s: any) => s.Product_Ref == searchISIN)[0]['Product_Name']);
    // sessionStorage.setItem('SearchISIN', searchISIN);
    // this.showOptions[i] = false;
    // window.open(window.location.origin + '/ClientSelfServicePortal/workflow/blotter' + "??Master_Popup=POPUP&ViewWorkflow");
    window.open(window.location.origin + '/ClientSelfServicePortal/' + "dealentry?WorkflowMode=UCPWFL&DealNum=&NoteMasterid=N:" + searchISIN + "&TokenID=T:" + TokenId + "&QueueId=Q:" + Queue_Id + "&ButtonID=&Master_Popup=POPUP&ProductView&UserGroup=RM&LoginID=Mayank");
  }
  openMPGs(MPG)
  {
    //this.selectedMPG=this.MPGList[0].BCM_long_name;
    console.log(MPG.target.value, this.MPGList)
    this.selectedMPG=MPG.target.value;
    sessionStorage.setItem('MPGfromPWB', 'true');
    sessionStorage.setItem('MPGDatafromPWB', JSON.stringify({
      MPG_Code: this.MPGList.filter((s:any)=>s.BCM_long_name==this.selectedMPG)[0].BCM_Code,
      MPG_ID: this.MPGList.filter((s:any)=>s.BCM_long_name==this.selectedMPG)[0].BCM_ID,
      MPG_long_name: this.selectedMPG
     }));
    console.log("MPG", this.selectedMPG)
    window.open(window.location.origin + '/ClientSelfServicePortal/reports/mpg'+ "?Master_Popup=POPUP&MPGPage")
  }
  showAllFilters() {
    this.showISINFilter = true;
    this.showNameFilter = true;
    this.showPayOffFilter = true;
    this.showCCYFilter = true;
    this.showUnderlyingFilter = true;
    this.showIssuerFilter = true;
  }
  refresh() {
    this.loader = true
    console.log("FERSH", this.unFilteredBlotterData)
    this.selectedISIN = ''
    this.selectedPName = ''
    this.selectedCCY = '';
    this.selectedUnderlying = '';
    this.selectedIssuer = '';
    this.selectedPayOff = '';
    this.payOff = '';
    this.filteredISIN = [];
    this.filteredName = [];
    this.filteredPayOff = [];
    this.StartDate = "";
    this.StartDateDisplay = "";
    this.MaturityDate = "";
    this.MaturityDisplay="";
    this.NextFixingDate = "";
    this.NextFixingDisplay="";
    for (let index = 0; index < this.unFilteredBlotterData.length; index++) {
      const element = this.unFilteredBlotterData[index];
      this.showOptions[index] = false;
      this.showWorkflows[index] = false;
      this.showOrderDetails[index] = false;
    }
    this.getDataForBlotter();
    // this.blotterData=this.unFilteredBlotterData
  }
  clearInputs() { }

  sort(filterfield) {
    console.log(filterfield);
    for (let index = 0; index < this.showOrderDetails.length; index++) {
      // let element = this.showOrderDetails[index];
      // element=false;
      this.showOrderDetails[index] = false;
      this.showOptions[index] = false;
      this.showWorkflows[index] = false;

    }
    switch (filterfield) {
      case 'Upfront':
        console.log("CASE PYSMBOL", filterfield)
        this.blotterData = this.sortTable(
          this.blotterData,
          filterfield,
          this.upfrontAscend
        );
        // this.holdingTableData_Cache = this.holdingtable;
        this.upfrontAscend = !this.upfrontAscend;
        break;

      case 'Outstanding':
        console.log("CASE PYSMBOL", filterfield)
        this.blotterData = this.sortTable(
          this.blotterData,
          filterfield,
          this.outstandingAscend
        );
        // this.holdingTableData_Cache = this.holdingtable;
        this.outstandingAscend = !this.outstandingAscend;
        break;

      case 'Deal_Count':
        console.log("CASE PYSMBOL", filterfield)
        this.blotterData = this.sortTable(
          this.blotterData,
          filterfield,
          this.coutAscend
        );
        // this.holdingTableData_Cache = this.holdingtable;
        this.coutAscend = !this.coutAscend;
        break;

      case 'MTM':
        this.blotterData = this.sortTable(
          this.blotterData,
          filterfield,
          this.mtmAscend
        );
        // this.holdingTableData_Cache = this.holdingtable;
        this.mtmAscend = !this.mtmAscend;
        break;

        case 'Start_Date':
          console.log("CASE PYSMBOL", filterfield)
          this.blotterData = this.sortTable(
            this.blotterData,
            filterfield,
            this.StartDateAscend
          );
          // this.holdingTableData_Cache = this.holdingtable;
          this.StartDateAscend = !this.StartDateAscend;
          break;
        
        case 'Maturity_date':
          console.log("CASE PYSMBOL", filterfield)
          this.blotterData = this.sortTable(
            this.blotterData,
            filterfield,
            this.MaturityDateAscend
          );
          // this.holdingTableData_Cache = this.holdingtable;
          this.MaturityDateAscend = !this.MaturityDateAscend;
          break;

        case 'Next_fixing_date':
          console.log("CASE PYSMBOL", filterfield)
          this.blotterData = this.sortTable(
            this.blotterData,
            filterfield,
            this.NextFixingDateAscend
          );
          // this.holdingTableData_Cache = this.holdingtable;
          this.NextFixingDateAscend = !this.NextFixingDateAscend;
          break;

      // case 'price':
      //   this.holdingtable = this.sortTable(
      //     this.holdingtable,
      //     key,
      //     this.priceAscending
      //   );
      //   this.holdingTableData_Cache = this.holdingtable;
      //   this.priceAscending = !this.priceAscending;
      //   break;

      // case 'investedAmount':
      //   this.holdingtable = this.sortTable(
      //     this.holdingtable,
      //     key,
      //     this.investedAmountAscending
      //   );
      //   this.holdingTableData_Cache = this.holdingtable;
      //   this.investedAmountAscending = !this.investedAmountAscending;
      //   break;

      // case 'CURRAMOUNT':
      //   this.holdingtable = this.sortTable(
      //     this.holdingtable,
      //     key,
      //     this.CURRAMOUNTAscending
      //   );
      //   this.holdingTableData_Cache = this.holdingtable;
      //   this.CURRAMOUNTAscending = !this.CURRAMOUNTAscending;
      //   break;

      // case 'PnL':
      //   this.holdingtable = this.sortTable(
      //     this.holdingtable,
      //     key,
      //     this.PnLAscending
      //   );
      //   this.holdingTableData_Cache = this.holdingtable;
      //   this.PnLAscending = !this.PnLAscending;
      //   break;

      // case 'DayPnL':
      //   this.holdingtable = this.sortTable(
      //     this.holdingtable,
      //     key,
      //     this.DayPnLAscending
      //   );
      //   this.holdingTableData_Cache = this.holdingtable;
      //   this.DayPnLAscending = !this.DayPnLAscending;
      //   break;            

      default:
        break;
    }
  }

  sortTable<T>(data: T[], key, reverse: boolean = false) {
    const sortedData = data.sort((a: any, b: any) => {
      // if (key === 'pSymbolName') {
      //   if (a[key] < b[key]) {
      //     return reverse ? 1 : -1;
      //   } else if (a[key] > b[key]) {
      //     return reverse ? -1 : 1;
      //   }
      // }
      if(key.toLowerCase().includes("date"))
      {
        console.log(key)
        //console.log(new Date(b.Start_Date).getTime() - new Date(a.Start_Date).getTime())
        const dateA: any = new Date(a[key]);
        //  console.log(dateA)
        const dateB: any = new Date(b[key]);
        //  console.log(dateB)
        //  console.log(dateB - dateA);
         if(reverse)
         {
          return dateB - dateA;
         }
         else{
          return dateA - dateB;
         }
        //  return dateB - dateA;
      }
      else {
        if ((parseFloat(a[key]) ? parseFloat(a[key]) : 0) < (parseFloat(b[key]) ? parseFloat(b[key]) : 0)) {
          return reverse ? -1 : 1;
        } else if ((parseFloat(a[key]) ? parseFloat(a[key]) : 0) > (parseFloat(b[key]) ? parseFloat(b[key]) : 0)) {
          return reverse ? 1 : -1;
        }
      }
      // return 0;
    });
    console.log(sortedData)
    return sortedData;
  }

  expandProduct(ISIN, index) {
    console.log(this.blotterData)
    console.log("ISIN", ISIN, "INDEX", index)
    //this.showOrderDetails=!this.showOrderDetails;
    this.showOrderDetails[index] = !this.showOrderDetails[index];
    console.log(ISIN)
    try {
      console.log('check2: ' + this.I_lngNoteMasterID);
      this.orderDetailsSubscription = this.ods
        .DB_GetOrderDetails(
          this.I_EntityId,
          ISIN,
          this.I_strCreatedBy,
          this.I_strFromDate,
          this.I_strToDate,
          this.LoginID,
          this.PrdType,
          this.strBranchName,
          this.strISIN,
          this.strIssuerID,
          this.strOrderNo,
          this.strSchemeName,
          this.str_CusID,
          this.str_OrderStatus,
          this.str_RMName,
          this.strcboserchcustomer,
          this.strissuertype,
          this.strordertype,
          this.I_strAccountNo,
          this.I_strFundCode,
          this.I_strShowOrdersFor,
          this.ShowAdditionalColumns
        )
        .subscribe((data) => {
          if (data) {
            console.log(data.GetOrdersDataForProductFeatureDetailsResult)
            // this.blotterData[index].OrderDeatils=data.GetOrdersDataForProductFeatureDetailsResult;
            //this.OrderDetailsData = [];
            // this.OrderDetailsData.push(data);

            for (let i = 0; i < 500; i++) {
              // let element = this.OrderDetailsData[i];
              // element =data?.GetOrdersDataForProductFeatureDetailsResult;
              if (i == index) {
                this.OrderDetailsData[i] = data?.GetOrdersDataForProductFeatureDetailsResult;
              }
              else if (this.OrderDetailsData[i] == "" || this.OrderDetailsData[i] == null || this.OrderDetailsData[i] == EMPTY) {
                this.OrderDetailsData[i] = "";
              }
              // else{
              //   this.OrderDetailsData[i]="";
              // }
            }

            // this.OrderDetailsData[index]=data?.GetOrdersDataForProductFeatureDetailsResult
            //this.OrderDetailsData.push(data?.GetOrdersDataForProductFeatureDetailsResult);
            console.log('OrderDetailsData', this.OrderDetailsData);
            // this.OrderDetailsData.forEach(
            //   (e) => {
            //     e.Nominal_Amount = Number(e.Nominal_Amount).toFixed(2);
            //     e.NAV = Number(e.NAV).toFixed(4);
            //   }
            // );
            console.log('AfterOrderDetailsData', this.OrderDetailsData);
            if (
              this.OrderDetailsData.length == 0 ||
              this.OrderDetailsData == undefined
            ) {
              this.errorHandleOrder = true;
            } else {
              this.errorHandleOrder = false;
            }
          }
          else {
            this.errorHandleOrder = true;
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  assignTarget(e: Event) {
    this.toggleButtons = e.target
  }

  async OptionMenu(index: number, e: Event) {
    this.toggleButtons = e.target
    this.selectedIndex = index;
    //await this.viewWorkflows(ISIN, index)
    // this.audit_trail_unique_date = [];
    //for opening only one menu list at atime
    for (let i = 0; i < this.showOptions.length; i++) {
      this.showOptions[i] = false
    }
    for (let index1 = 0; index1 < this.showWorkflows.length; index1++) {
      this.showWorkflows[index1] = false;

    }
    //end
    this.showOptions[index] = !this.showOptions[index]; //open menu div

    // if (this.advisory_accordion[index]) {
    //   console.log(this.advisory_accordion[index]);
    //   this.getAuditTrail(this.advisory[index].nM_ID);
    // }

    // console.log("advisory_accordion", this.advisory_accordion)
  }
  FormatAmount(nStr) {
    var x, x1, x2;

    try {
      nStr += '';
      x = nStr.split('.');
      x1 = x[0];
      x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
    } catch (error) {
    } finally {
      nStr = null;
      x = null;
      x1 = null;
      x2 = null;
      rgx = null;
    }
  }

  // OnRefNoClick(tokenid) {
  //   console.log(tokenid)
  //   var currLocation = window.location.href.toString();
  //   this.wfs.getLeftClickOperationFunctionNameIfExists("22", sessionStorage.getItem("UserID")).subscribe((data) => {
  //     this.strFuncName = data.getLeftClickOperationFunctionNameIfExistsResult;
  //     console.log("LEFT CLICK", data)
  //     if (this.strFuncName.trim() === "" || this.strFuncName.trim().toString().toUpperCase() === "NOTALLOWED") {
  //       this.successMsg = 'Permission not granted';
  //     }
  //     if (this.strFuncName.trim() != "") {
  //       this.wfs.getModeButtonDetails(this.strFuncName, tokenid[0], sessionStorage.getItem("EntityID"), "0", sessionStorage.getItem("UserID")).subscribe(Res => {
  //         console.log("MODE BUTTON ", Res)
  //         if (Res.getModeButtonDetailsResult.length > 0) {
  //           if (!Res.getModeButtonDetailsResult[2].EXE_Name.toUpperCase().includes("EXCEPTION")) {
  //             this.url =
  //               "" +
  //               currLocation.replace(
  //                 "wfblotter",
  //                 Res.getModeButtonDetailsResult[2].EXE_Name
  //               ) +
  //               "?WorkflowMode=" +
  //               Res.getModeButtonDetailsResult[2].sixth +
  //               "&DealNum=" +
  //               Res.getModeButtonDetailsResult[2].thirteen +
  //               "&TokenID=" +
  //               Res.getModeButtonDetailsResult[2].eleven +
  //               "&ButtonID=" +
  //               Res.getModeButtonDetailsResult[2].seventh +
  //               "&Master_Popup=POPUP" +
  //               "&UserGroup=" + sessionStorage.getItem("UserType")
  //               +
  //               "&LoginID=" + sessionStorage.getItem("UserID");
  //             if (Res.getModeButtonDetailsResult[2].fourth.toString() === "OPENWORKFLOWINPOPUP" || Res.getModeButtonDetailsResult[2].fourth.toString() === "NORMALPOPUP") {
  //               var left = (screen.width - Res.getModeButtonDetailsResult[2].nine) / 2;
  //               var top = (screen.height - Res.getModeButtonDetailsResult[2].ten) / 4;
  //               var myWindow = window.open(
  //                 this.url,
  //                 "_blank"
  //               )
  //               myWindow.focus();
  //             }
  //             // else{
  //             //   this.pageURL = this.sanitizer.bypassSecurityTrustResourceUrl(
  //             //     this.url
  //             //   ); 
  //             //   const dialogConfig = new MatDialogConfig();
  //             //   dialogConfig.width = Res.getModeButtonDetailsResult[2].nine + "px";
  //             //   dialogConfig.height = Res.getModeButtonDetailsResult[2].ten + "px";
  //             //   dialogConfig.panelClass = "UCP_Popup";               
  //             //   this.UCP_PopupRef = this.dialog.open(this.UCP_Popup, dialogConfig);
  //             // }
  //           }
  //         }
  //       });
  //     }
  //   });
  // }

  selectDate(date) {
    try {
      console.log(date)
      if (date !== '') {
        this.StartDate = this.datepipe.transform(date, 'yyyy-MM-dd');
        this.StartDateDisplay = this.datepipe.transform(date, 'dd-MMM-yyyy');
      } else {
        this.StartDate = undefined;
        this.StartDateDisplay = undefined;
      }
      // return this.datepipe.transform(date, 'dd-MMM-yyyy');
    } catch (error) { }
  }
  selectMaturityDate(date) {
    try {
      //this.MaturityDate = this.datepipe.transform(date, 'dd-MMM-yyyy');
      if (date !== '') {
        this.MaturityDate = this.datepipe.transform(date, 'yyyy-MM-dd');
        this.MaturityDisplay = this.datepipe.transform(date, 'dd-MMM-yyyy');
      } else {
        this.MaturityDate = undefined;
        this.MaturityDisplay = undefined;
      }
      //return this.datepipe.transform(date, 'dd-MMM-yyyy');
    } catch (error) { }
  }
  selectNextFixingDate(date) {
    try {
      //this.NextFixingDate = this.datepipe.transform(date, 'dd-MMM-yyyy');
      if (date !== '') {
        this.NextFixingDate = this.datepipe.transform(date, 'yyyy-MM-dd');
        this.NextFixingDisplay = this.datepipe.transform(date, 'dd-MMM-yyyy');
      } else {
        this.NextFixingDate = undefined;
        this.NextFixingDisplay = undefined;
      }
      //return this.datepipe.transform(date, 'dd-MMM-yyyy');
    } catch (error) { }
  }

  exportToExcel() {
    this.fileName =
      'Product Watch Blotter' +
      '.xlsx';
    const element = document.getElementById('DataTables');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }

  // exportAsXLSX() {
  //   try {
  //     // console.log(this.BlotterDataRows[0]);
  //     // console.log(Object.keys(this.BlotterDataRows[0]));

  //     // console.log(keys);
  //     // console.log(this.mapHeader(keys[0]));

  //     var exlBlotterDataRows = []; // this.BlotterDataRows;

  //     // this.BlotterDataRows.forEach(item=>{
  //     //   console.log(item);
  //     //   for (const k in item) {
  //     //     console.log(k);
  //     //     console.log(this.mapHeader(k));
  //     //       item[this.mapHeader(k)] = item[k];
  //     //       delete item[k];
  //     // }
  //     // });

  //     this.blotterData.forEach((item) => {
  //       // console.log(item);
  //       var item11 = {};
  //       for (const k in item) {
  //         // console.log(k);
  //         // console.log(this.mapHeader(k));
  //         // item
  //         // item11.push({ this.mapHeader(k) , item[k]})
  //         // item11[this.mapHeader(k)] = item[k]
  //         item11[this.apifunction.mapHeader(k)] = item[k];
  //         // if (k === "name") {
  //       }
  //       exlBlotterDataRows.push(item11);
  //     });

  //     // console.log(exlBlotterDataRows[0]);
  //     // console.log(this.BlotterDataRows[0]);
  //     // var index = this.metaDataResult.findIndex(item => this.replaceChar(item.Blotter_Column) == this.replaceChar(str))

  //     // this.excelService.exportAsExcelFile(this.BlotterDataRows, this.selectedMPGitem.BCM_long_name);

  //     this.excelService.exportAsExcelFile(exlBlotterDataRows, "Product_Watch_Blotter");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  exportAsXLSX() {
    try {

      var exlBlotterDataRows = []; 
      var assetsExcelData =[];

      this.blotterData.forEach((item) => {
        // console.log(item);
        // var item11 = {};
        // for (const k in item) {        
        //   item11[this.apifunction.mapHeader(k)] = item[k];
        // }
        // exlBlotterDataRows.push(item11);

        // for (let i = 0; i < this.assetsArr.length; i++) {
          assetsExcelData.push({
            'ISIN/Ref': item.Product_Ref,
            'Product Name':item.Product_Name, 
            'PayOff':item.Payoff,
            'Start Date':item.Start_Date ? item.Start_Date: '-',
            'Maturity':item.Maturity_date ? item.Maturity_date: '-',
            'Next Fixing':item.Next_fixing ? item.Next_fixing: '-' ,
            'CCY':item.Currency ? item.Currency: '-',
            'Outstanding':item.Outstanding1 ? item.Outstanding1: '-',
            'Count':item.Deal_Count ? item.Deal_Count: '-',
            'Upfront':item.Upfront1 ? item.Upfront1: '-',
            'MTM':item.MTM1 ? item.MTM1: '-',
            'Underlyings': item.Underlyings ? item.Underlyings: '-',
            'Issuer':item.Issuer ? item.Issuer: '-',
  
          });
        // }
        
      });
      this.excelService.exportAsExcelFile(assetsExcelData, 'Product_Watch_Blotter'+this.datepipe.transform(new Date(), 'dd-MMM-yyyy'));
      //this.excelService.exportAsExcelFile(exlBlotterDataRows, "Product_Watch_Blotter");
    } catch (error) {
      console.log(error);
    }
  }
}
