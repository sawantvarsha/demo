import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EcCommonService } from '../euroconnect/services/ec-common.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { EcHomeService } from '../euroconnect/services/ec-home.service';
import { CustomerService } from '../euroconnect/services/customer.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  asseturl = environment.asseturl;
  showFilterDropdown: boolean = false;
  dummyData= [
    {
      "product_Ref": "33",
      "product_Name": "60M EUR Digital on BBVA.MC, ELE.MC #33",
      "external": "1888014165",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "18 Feb 2019",
      "nextObsDate": "19 Feb 2024",
      "m2NextObs": "6 months",
      "maturity_date": "19 Feb 2024",
      "m2Maturity": "6 months",
      "currency": "EUR",
      "notional_Amt": "300000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "00VSA5",
      "couponTillDate": ""
  },
  {
      "product_Ref": "32",
      "product_Name": "60M EUR Digital on .IBEX #32",
      "external": "1888014055",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "01 Feb 2019",
      "nextObsDate": "05 Feb 2024",
      "m2NextObs": "6 months",
      "maturity_date": "04 Feb 2024",
      "m2Maturity": "6 months",
      "currency": "EUR",
      "notional_Amt": "1000000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "6XUU",
      "couponTillDate": ""
  },
  {
      "product_Ref": "31",
      "product_Name": "60M EUR Snowball Coupon Autocall on IBE.MC, REP.MC #31",
      "external": "2880000560",
      "isin": "",
      "payoff": "Snowball Coupon Autocall",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "80.00 %",
      "start_Date": "25 Feb 2019",
      "nextObsDate": "15 Dec 2023",
      "m2NextObs": "4 months",
      "maturity_date": "26 Feb 2024",
      "m2Maturity": "6 months",
      "currency": "EUR",
      "notional_Amt": "100000.00",
      "mtm": "0",
      "format": "Swap",
      "client": "1COO",
      "couponTillDate": ""
  },
  {
      "product_Ref": "30",
      "product_Name": "60M EUR Fixed Coupon Autocall on REP.MC #30",
      "external": "2880000550",
      "isin": "",
      "payoff": "Fixed Coupon Autocall",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "50.00 %",
      "start_Date": "08 Feb 2019",
      "nextObsDate": "14 Dec 2023",
      "m2NextObs": "4 months",
      "maturity_date": "08 Feb 2024",
      "m2Maturity": "6 months",
      "currency": "EUR",
      "notional_Amt": "4000000.00",
      "mtm": "0",
      "format": "Swap",
      "client": "D1DQ",
      "couponTillDate": ""
  },
  {
      "product_Ref": "29",
      "product_Name": "60M EUR Snowball Coupon Autocall on IBE.MC, REP.MC, TEF.MC #29",
      "external": "1516867",
      "isin": "",
      "payoff": "Snowball Coupon Autocall",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "20 Dec 2018",
      "nextObsDate": "14 Dec 2023",
      "m2NextObs": "4 months",
      "maturity_date": "20 Dec 2023",
      "m2Maturity": "4 months",
      "currency": "EUR",
      "notional_Amt": "552500.00",
      "mtm": "0",
      "format": "Swap",
      "client": "1COO",
      "couponTillDate": ""
  },
  {
      "product_Ref": "28",
      "product_Name": "60M EUR Snowball Coupon Autocall on IBE.MC, REP.MC #28",
      "external": "2880000513",
      "isin": "",
      "payoff": "Snowball Coupon Autocall",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "80.00 %",
      "start_Date": "21 Dec 2018",
      "nextObsDate": "15 Dec 2023",
      "m2NextObs": "4 months",
      "maturity_date": "21 Dec 2023",
      "m2Maturity": "4 months",
      "currency": "EUR",
      "notional_Amt": "189000.00",
      "mtm": "0",
      "format": "Swap",
      "client": "1COO",
      "couponTillDate": ""
  },
  {
      "product_Ref": "27",
      "product_Name": "60M EUR Digital on IBE.MC, BBVA.MC #27",
      "external": "1888013674",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "14 Dec 2018",
      "nextObsDate": "18 Dec 2023",
      "m2NextObs": "4 months",
      "maturity_date": "17 Dec 2023",
      "m2Maturity": "4 months",
      "currency": "EUR",
      "notional_Amt": "1000000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "ZCXA",
      "couponTillDate": ""
  },
  {
      "product_Ref": "26",
      "product_Name": "60M EUR Digital on BBVA.MC, IBE.MC, TEF.MC #26",
      "external": "1888013743",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "20 Dec 2018",
      "nextObsDate": "21 Dec 2023",
      "m2NextObs": "4 months",
      "maturity_date": "21 Dec 2023",
      "m2Maturity": "4 months",
      "currency": "EUR",
      "notional_Amt": "300000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "00JVNL",
      "couponTillDate": ""
  },
  {
      "product_Ref": "25",
      "product_Name": "60M EUR Digital on BBVA.MC #25",
      "external": "1888013593",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "06 Dec 2018",
      "nextObsDate": "07 Dec 2023",
      "m2NextObs": "4 months",
      "maturity_date": "07 Dec 2023",
      "m2Maturity": "4 months",
      "currency": "EUR",
      "notional_Amt": "500000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "6OVA",
      "couponTillDate": ""
  },
  {
      "product_Ref": "24",
      "product_Name": "60M EUR Digital on BBVA.MC, ELE.MC #24",
      "external": "1888013650",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "13 Dec 2018",
      "nextObsDate": "14 Dec 2023",
      "m2NextObs": "4 months",
      "maturity_date": "14 Dec 2023",
      "m2Maturity": "4 months",
      "currency": "EUR",
      "notional_Amt": "500000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "00DMEM",
      "couponTillDate": ""
  },
  {
      "product_Ref": "23",
      "product_Name": "60M EUR Digital on .IBEX #23",
      "external": "1888013498",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "29 Nov 2018",
      "nextObsDate": "30 Nov 2023",
      "m2NextObs": "3 months",
      "maturity_date": "30 Nov 2023",
      "m2Maturity": "3 months",
      "currency": "EUR",
      "notional_Amt": "1150000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "00FFE4",
      "couponTillDate": ""
  },
  {
      "product_Ref": "22",
      "product_Name": "60M EUR Snowball Coupon Autocall on IBE.MC, REP.MC, TEF.MC #22",
      "external": "2880000483",
      "isin": "",
      "payoff": "Snowball Coupon Autocall",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "21 Dec 2018",
      "nextObsDate": "27 Nov 2023",
      "m2NextObs": "3 months",
      "maturity_date": "21 Dec 2023",
      "m2Maturity": "4 months",
      "currency": "EUR",
      "notional_Amt": "6000000.00",
      "mtm": "0",
      "format": "Swap",
      "client": "1COO",
      "couponTillDate": ""
  },
  {
      "product_Ref": "21",
      "product_Name": "60M EUR Digital on IBE.MC, BBVA.MC #21",
      "external": "1888013411",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "26 Nov 2018",
      "nextObsDate": "27 Nov 2023",
      "m2NextObs": "3 months",
      "maturity_date": "27 Nov 2023",
      "m2Maturity": "3 months",
      "currency": "EUR",
      "notional_Amt": "500000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "00DVM8",
      "couponTillDate": ""
  },
  {
      "product_Ref": "20",
      "product_Name": "60M EUR Digital on .IBEX #20",
      "external": "1888013396",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "23 Nov 2018",
      "nextObsDate": "27 Nov 2023",
      "m2NextObs": "3 months",
      "maturity_date": "26 Nov 2023",
      "m2Maturity": "3 months",
      "currency": "EUR",
      "notional_Amt": "1000000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "00CKB2",
      "couponTillDate": ""
  },
  {
      "product_Ref": "19",
      "product_Name": "60M EUR Digital on IBE.MC, BBVA.MC #19",
      "external": "1888013338",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "20 Nov 2018",
      "nextObsDate": "21 Nov 2023",
      "m2NextObs": "3 months",
      "maturity_date": "21 Nov 2023",
      "m2Maturity": "3 months",
      "currency": "EUR",
      "notional_Amt": "295000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "KMXU",
      "couponTillDate": ""
  },
  {
      "product_Ref": "18",
      "product_Name": "60M EUR Snowball Coupon Autocall on IBE.MC, REP.MC #18",
      "external": "2880000477",
      "isin": "",
      "payoff": "Snowball Coupon Autocall",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "80.00 %",
      "start_Date": "14 Nov 2018",
      "nextObsDate": "11 Aug 2023",
      "m2NextObs": "0 months",
      "maturity_date": "14 Nov 2023",
      "m2Maturity": "3 months",
      "currency": "EUR",
      "notional_Amt": "132600.00",
      "mtm": "0",
      "format": "Swap",
      "client": "1COO",
      "couponTillDate": ""
  },
  {
      "product_Ref": "17",
      "product_Name": "60M EUR Autocall on SAN.MC #17",
      "external": "2880000479",
      "isin": "",
      "payoff": "Autocall",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "65.00 %",
      "start_Date": "13 Nov 2018",
      "nextObsDate": "11 Aug 2023",
      "m2NextObs": "0 months",
      "maturity_date": "16 Nov 2023",
      "m2Maturity": "3 months",
      "currency": "EUR",
      "notional_Amt": "200000.00",
      "mtm": "0",
      "format": "Swap",
      "client": "BSAB",
      "couponTillDate": ""
  },
  {
      "product_Ref": "16",
      "product_Name": "60M EUR Snowball Coupon Autocall on IBE.MC, REP.MC, TEF.MC #16",
      "external": "1445458",
      "isin": "",
      "payoff": "Snowball Coupon Autocall",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "08 Nov 2018",
      "nextObsDate": "25 Oct 2023",
      "m2NextObs": "2 months",
      "maturity_date": "08 Nov 2023",
      "m2Maturity": "3 months",
      "currency": "EUR",
      "notional_Amt": "267000.00",
      "mtm": "0",
      "format": "Swap",
      "client": "1COO",
      "couponTillDate": ""
  },
  {
      "product_Ref": "15",
      "product_Name": "60M EUR Digital on IBE.MC, BBVA.MC #15",
      "external": "1888012867",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "24 Oct 2018",
      "nextObsDate": "25 Oct 2023",
      "m2NextObs": "2 months",
      "maturity_date": "25 Oct 2023",
      "m2Maturity": "2 months",
      "currency": "EUR",
      "notional_Amt": "300000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "00FJRS",
      "couponTillDate": ""
  },
  {
      "product_Ref": "14",
      "product_Name": "60M EUR Digital on .IBEX #14",
      "external": "1888012761",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "17 Oct 2018",
      "nextObsDate": "18 Oct 2023",
      "m2NextObs": "2 months",
      "maturity_date": "18 Oct 2023",
      "m2Maturity": "2 months",
      "currency": "EUR",
      "notional_Amt": "600000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "00SSQE",
      "couponTillDate": ""
  },
  {
      "product_Ref": "13",
      "product_Name": "60M EUR Digital on IBE.MC, BBVA.MC #13",
      "external": "1888012718",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "12 Oct 2018",
      "nextObsDate": "16 Oct 2023",
      "m2NextObs": "2 months",
      "maturity_date": "15 Oct 2023",
      "m2Maturity": "2 months",
      "currency": "EUR",
      "notional_Amt": "500000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "00EELF",
      "couponTillDate": ""
  },
  {
      "product_Ref": "12",
      "product_Name": "60M EUR Snowball Coupon Autocall on IBE.MC, REP.MC #12",
      "external": "2880000432",
      "isin": "",
      "payoff": "Snowball Coupon Autocall",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "80.00 %",
      "start_Date": "10 Oct 2018",
      "nextObsDate": "11 Aug 2023",
      "m2NextObs": "0 months",
      "maturity_date": "10 Oct 2023",
      "m2Maturity": "2 months",
      "currency": "EUR",
      "notional_Amt": "79700.00",
      "mtm": "0",
      "format": "Swap",
      "client": "1COO",
      "couponTillDate": ""
  },
  {
      "product_Ref": "11",
      "product_Name": "60M EUR Autocall on SX7E #11",
      "external": "2880000428",
      "isin": "",
      "payoff": "Autocall",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "65.00 %",
      "start_Date": "04 Oct 2018",
      "nextObsDate": "26 Sep 2023",
      "m2NextObs": "1 months",
      "maturity_date": "09 Oct 2023",
      "m2Maturity": "2 months",
      "currency": "EUR",
      "notional_Amt": "200000.00",
      "mtm": "0",
      "format": "Swap",
      "client": "BSAB",
      "couponTillDate": ""
  },
  {
      "product_Ref": "10",
      "product_Name": "60M EUR Digital on IBE.MC, BBVA.MC #10",
      "external": "1888012291",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "25 Sep 2018",
      "nextObsDate": "26 Sep 2023",
      "m2NextObs": "1 months",
      "maturity_date": "26 Sep 2023",
      "m2Maturity": "1 months",
      "currency": "EUR",
      "notional_Amt": "480000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "00REZ0",
      "couponTillDate": ""
  },
  {
      "product_Ref": "9",
      "product_Name": "60M EUR Digital on BBVA.MC, TEF.MC #9",
      "external": "1888012270",
      "isin": "DigGa Rd Eu",
      "payoff": "Digital",
      "worst": "",
      "woPerf": "0",
      "ulCount": "1",
      "basketType": "Single Underlying",
      "kO_Distance": "N.A.",
      "kO_Level": "",
      "kI_Distance": "N.A.",
      "kI_Level": "N.A.",
      "start_Date": "25 Sep 2018",
      "nextObsDate": "26 Sep 2023",
      "m2NextObs": "1 months",
      "maturity_date": "26 Sep 2023",
      "m2Maturity": "1 months",
      "currency": "EUR",
      "notional_Amt": "100000.00",
      "mtm": "0",
      "format": "Deposit",
      "client": "00MNT4",
      "couponTillDate": ""
  }
  ];
toggleDisabledFlag = false;
toggleCheck = false; 
ErrorMsg = '';
successMsg = '';
unFilteredBlotterData: any = [];
blotterData: any = [];
filteredData: any = [];
selectedFormat:any;
selectedCurrency:any;
selectedPType:any;
selectedCapAtRisk:any;
selectedULType:any;
selectedUnderlying:any;
StartDate:any;
StartDateDisplay:any;
EndDateDisplay:any;
EndDate:any;

  constructor(
    public commonfunctions: EcCommonService,
    public apifunctions: EcHomeService,
    public customer:CustomerService,
    public datepipe: DatePipe
  ) { 

      this.selectedFormat='';
      this.selectedCurrency='';
      this.selectedPType='';
      this.selectedCapAtRisk='';
      this.selectedULType='';
      this.selectedUnderlying='';
      this.StartDate = "";
      this.StartDateDisplay = "";
      this.EndDateDisplay="";
      this.EndDate = "";
    }
  
  ngOnInit(): void {
    console.log("JSON",this.dummyData);
    this.getPortfolioData();
    this.toggleCheck = this.commonfunctions.getLayout();
  }

  getToggleData(event: MatSlideToggleChange) {
    //console.log('Error', this.ErrorMsg);
    this.ErrorMsg = '';
    this.successMsg = '';
    this.toggleCheck = event.checked;
    this.apifunctions.toggleFlag.next(this.toggleCheck);
    this.apifunctions.toggleVisiblityFlag.next([]);
    this.apifunctions.priceFlag.next(false);
    // this.apifunctions.schedulePriceFlag.next({});
    this.apifunctions.saveFlag.next(false);
    // this.apifunctions.schedulePopupFlag.next(false);

    this.commonfunctions.setsubmultiReceivedPrices({}, '');
    this.commonfunctions.setsubmultiRCReceivedPrices({}, '');
    this.commonfunctions.setsubmultiCreditReceivedPrices({}, '');
    this.commonfunctions.setsubmultiPTCReceivedPrices({}, '');

}

  getPortfolioData(){
    this.customer.GetProductDetailsTimeline().subscribe(async (data)=>{
      console.log("Data",data)
      
      if(data){
        
        let blotterData = [];
        blotterData = await data;
        for (let index = 0; index < blotterData.length; index++) {
          const element = blotterData[index];
          // console.log(element)
          //element.Start_Date.replace(/\s+/g, '-');
          element.start_Date=element.start_Date?.replace(/\s+/g, '-');
          element.maturity_date=element.maturity_date?.replace(/\s+/g, '-');
          element.nextObsDate=element.nextObsDate?.replace(/\s+/g, '-');
          // console.log(element.start_Date.replace(' ', '-'))
          // console.log( element.maturity_date.replace(/\s+/g, '-'))
          
        }
        this.blotterData = blotterData;
        let mainData = blotterData;
        this.unFilteredBlotterData = mainData;
        this.filteredData = this.unFilteredBlotterData
        console.log(this.blotterData)
      }

    });
    // for (let index = 0; index < this.dummyData.length; index++) {
    //   const element = this.dummyData[index];
    //   console.log(element)
    //   //element.Start_Date.replace(/\s+/g, '-');
    //   element.start_Date=element.start_Date?.replace(/\s+/g, '-');
    //   element.maturity_date=element.maturity_date?.replace(/\s+/g, '-');
    //   element.nextObsDate=element.nextObsDate?.replace(/\s+/g, '-');
    //   console.log(element.start_Date.replace(' ', '-'))
    //   console.log( element.maturity_date.replace(/\s+/g, '-'))
      
    // }
    // console.log("this.dummyData;0",this.dummyData)
    // let blotterData = [];
    //     blotterData = this.dummyData; //await data;
        
    //     this.blotterData = blotterData;
    //     let mainData = blotterData;
    //     this.unFilteredBlotterData = mainData;
    //     this.filteredData = this.unFilteredBlotterData
    //     console.log(this.blotterData)

  }

  FilterForAll(event: KeyboardEvent)
  {
    console.log("STARTT DATE",event)
    let backupData = this.unFilteredBlotterData;
    // if (this.selectedFormat != "") {
    //   backupData = backupData.filter((s: any) => s.Format.includes(this.selectedFormat))
    // }
    if (this.selectedFormat != "") {
      backupData = backupData.filter((s: any) => s.format.toLowerCase().includes(this.selectedFormat.toLowerCase()))
    }
    if (this.selectedCurrency != "") {
      backupData = backupData.filter((s: any) => s.currency.toLowerCase().includes(this.selectedCurrency.toLowerCase()))
    }
    if (this.selectedCapAtRisk != "") {
      backupData = backupData.filter((s: any) => s.notional_Amt.toLowerCase().includes(this.selectedCapAtRisk.toLowerCase()))
    }
    // if (this.selectedCurrency != "") {
    //   backupData = backupData.filter((s: any) => s.Currency.toLowerCase().includes(this.selectedCurrency.toLowerCase()))
    // }
    // if (this.selectedCurrency != "") {
    //   backupData = backupData.filter((s: any) => s.Currency.toLowerCase().includes(this.selectedCurrency.toLowerCase()))
    // }
    // if (this.selectedCurrency != "") {
    //   backupData = backupData.filter((s: any) => s.Currency.toLowerCase().includes(this.selectedCurrency.toLowerCase()))
    // }

    if (this.StartDateDisplay != "" && this.StartDateDisplay !== undefined) {
      backupData = backupData.filter((s: any) => s.start_Date == this.StartDateDisplay)
    }
    if (this.EndDateDisplay != "" && this.EndDateDisplay !== undefined) {
      backupData = backupData.filter((s: any) => s.maturity_date == this.EndDateDisplay)
    }
    this.blotterData = backupData;
  }

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
  selectEndDate(date) {
    try {
      //this.MaturityDate = this.datepipe.transform(date, 'dd-MMM-yyyy');
      if (date !== '') {
        this.EndDate = this.datepipe.transform(date, 'yyyy-MM-dd');
        this.EndDateDisplay = this.datepipe.transform(date, 'dd-MMM-yyyy');
      } else {
        this.EndDate = undefined;
        this.EndDateDisplay = undefined;
      }
      //return this.datepipe.transform(date, 'dd-MMM-yyyy');
    } catch (error) { }
  }

}
