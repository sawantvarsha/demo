import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ConcentrationReportsService } from 'src/app/services/concentration-reports.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import * as XLSX from 'xlsx';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { ThisReceiver } from '@angular/compiler';
import { AuthService } from 'src/app/services/auth/auth.service';

declare global {
  interface Array<T> {
    sortBy(p: any): Array<T>;
  }
}

Array.prototype.sortBy = function (p): Array<any> {
  return this.slice(0).sort(function (a, b) {
    return a[p] > b[p] ? 1 : a[p] < b[p] ? -1 : 0;
  });
};


@Component({
  selector: 'app-concentration-reports',
  templateUrl: './concentration-reports.component.html',
  styleUrls: ['./concentration-reports.component.scss'],
  providers: [DatePipe]
})

export class ConcentrationReportsComponent implements OnInit {
  
  constructor(
    public location: Location,
    private datepipe : DatePipe,
    private apifunction: ConcentrationReportsService,
    public ngxXml2jsonService: NgxXml2jsonService,
    private workflowfunction : WorkflowApiService,
    private auth: AuthService
  ) { }

  @ViewChild('content') content!: ElementRef;

  concentrationReports:any = [];
  columnTable: any = [];
  settingsFlag = false;
  filterFlag = false;
  fromDate: any ;
  toDate: any;
  totalRecords:number;
  recordsPer: number;
  entityId :any = '4';
  UserId :any ='SOLAR_S1';
  // BlotterCode :any = "10374";
  BlotterCode: any;
  from = this.datepipe.transform(new Date(), "dd-MMM-yyyy");;
  to = this.datepipe.transform(new Date(), "dd-MMM-yyyy");;
  // var date1 = 
  DealFacing:any = "ALL";
  WhereClause:any = "";
  RowsPerPage :any = '5';
  PageNo:any = '1';
  ExcelFlag:any = '0';
  dataFlag = false;
  concentrationData: any = [];
  sort1Result: any = [];
  colValue: any=[];
  typeVal: any = [];
  betweenVal1: any;
  betweenVal2: any;
  filter_field: any = "Next Redemption Exposure";
  noOfRecords = 0;
  pageFirstRecord = ((this.PageNo - 1) * this.RowsPerPage) + 1;
  pageLastRecord = this.RowsPerPage;
  checkbox: boolean[] = [];
  dataEmpty = true;

  months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec']

  ngOnInit(): void {

  this.getTableData();

    // this.recordsPer = this.RowsPerPage;

    // this.concentrationReports = [
    // {
    //   underlying: "0001.HK",
    //   ISIN: "32",
    //   ISINAlive: "15",
    //   ISINAutocalled: "0",
    //   ISINMatured: "17",
    //   ISINKnockedin: "4",
    //   exposure: "68,255,921.89",
    //   mtmChange: "0.19",
    //   redemptionExposure: "15-July-2021",
    //   redemExposureUSD: "10,000,000.00",
    //   avgProbability: "0",
    //   exchange: "HKG",
    //   sector: "Real Estate"
    // },
    // {
    //   underlying: "0005.HK",
    //   ISIN: "28",
    //   ISINAlive: "14",
    //   ISINAutocalled: "0",
    //   ISINMatured: "14",
    //   ISINKnockedin: "1",
    //   exposure: "68,948,708.77",
    //   mtmChange: "0.22",
    //   redemptionExposure: "15-July-2021",
    //   redemExposureUSD: "10,000,000.00",
    //   avgProbability: "0",
    //   exchange: "HKG",
    //   sector: "Financial Services"
    // },
    // {
    //   underlying: "2628.HK",
    //   ISIN: "30",
    //   ISINAlive: "13",
    //   ISINAutocalled: "0",
    //   ISINMatured: "17",
    //   ISINKnockedin: "4",
    //   exposure: "42,831,010.55",
    //   mtmChange: "0.30",
    //   redemptionExposure: "19-July-2021",
    //   redemExposureUSD: "2,575,220.25",
    //   avgProbability: "0.1412",
    //   exchange: "HKG",
    //   sector: "Financial Services"
    // },
    // {
    //   underlying: "3333.HK",
    //   ISIN: "9",
    //   ISINAlive: "6",
    //   ISINAutocalled: "0",
    //   ISINMatured: "3",
    //   ISINKnockedin: "3",
    //   exposure: "31,955,617.26",
    //   mtmChange: "-0.07",
    //   redemptionExposure: "15-July-2021",
    //   redemExposureUSD: "10,000,000.00",
    //   avgProbability: "0",
    //   exchange: "HKG",
    //   sector: "Real Estate"
    // },
    // {
    //   underlying: "AAPL.OQ",
    //   ISIN: "76",
    //   ISINAlive: "8",
    //   ISINAutocalled: "63",
    //   ISINMatured: "5",
    //   ISINKnockedin: "3",
    //   exposure: "15,040,000.00",
    //   mtmChange: "-0.32",
    //   redemptionExposure: "11-Jan-2021",
    //   redemExposureUSD: "2,000,000.00",
    //   avgProbability: "0.5424",
    //   exchange: "NASDAQ",
    //   sector: "Technology"
    // },
    // {
    //   underlying: "0001.HK",
    //   ISIN: "32",
    //   ISINAlive: "15",
    //   ISINAutocalled: "0",
    //   ISINMatured: "17",
    //   ISINKnockedin: "4",
    //   exposure: "68,255,921.89",
    //   mtmChange: "0.19",
    //   redemptionExposure: "15-July-2021",
    //   redemExposureUSD: "10,000,000.00",
    //   avgProbability: "0",
    //   exchange: "HKG",
    //   sector: "Real Estate"
    // },
    // ]

  //   this.columnTable = [{
  //     checkbox: "false",
  //     filterBy: "Underlying",
  //     type: "string",
  //     value: "",
  //     width: 0
  //   },
  //   {
  //     checkbox: "false",
  //     filterBy: "# of ISINs",
  //     type: "number",
  //     value: "",
  //     width: 0
  //   },
  //   {
  //     checkbox: "false",
  //     filterBy: "# of ISINs Alive",
  //     type: "number",
  //     value: "",
  //     width: 0
  //   },
  //   {
  //     checkbox: "false",
  //     filterBy: "# of ISINs Autocalled",
  //     type: "number",
  //     value: "",
  //     width: 6
  //   },
  //   {
  //     checkbox: "false",
  //     filterBy: "# of ISINs Matured",
  //     type: "number",
  //     value: "",
  //     width: 0
  //   },
  //   {
  //     checkbox: "false",
  //     filterBy: "# of ISINs Matured with Knocked-In",
  //     type: "number",
  //     value: "",
  //     width: 7
  //   },
  //   {
  //     checkbox: "false",
  //     filterBy: "Total Product Exposure",
  //     type: "number",
  //     value: "",
  //     width: 0
  //   },
  //   {
  //     checkbox: "false",
  //     filterBy: "Avg MTM 1 Day Change",
  //     type: "number",
  //     value: "",
  //     width: 0
  //   },
  //   {
  //     checkbox: "false",
  //     filterBy: "Next KO Exposure",
  //     type: "string",
  //     value: "",
  //     width: 0
  //   },
  //   // {
  //   //   checkbox: "false",
  //   //   filterBy: "Next Redemption Exposure USD",
  //   //   type: "number",
  //   //   value: "",
  //   //   width: 7
  //   // },
  //   {
  //     checkbox: "false",
  //     filterBy: "Next Redemption Avg Probability",
  //     type: "number",
  //     value: "",
  //     width: 7
  //   },
  //   {
  //     checkbox: "false",
  //     filterBy: "Exchange",
  //     type: "string",
  //     value: "",
  //     width: 0
  //   },
  //   {
  //     checkbox: "false",
  //     filterBy: "Sector",
  //     type: "string",
  //     value: "",
  //     width: 10
  //   },
  // ]

 

}

  back() {
    this.location.back();
  }

  GeneratePDF() {
   
    let data: any = document.getElementById('content');
    html2canvas(data).then((canvas) => {
      let fileWidth = 800;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let pdf = new jsPDF('landscape','pt');
      pdf.text('Concentration Reports',20,20);
      pdf.setFontSize(10);
      let position = 30;
      pdf.addImage(FILEURI, 'PDF', 10, position, fileWidth, fileHeight);

      // pdf.setFontSize(15);
      // pdf.setTextColor(40);
      pdf.save('concentrationReports.pdf');
    });
    
  }

  clearFilters(index: any) {
    console.log("in clear fileter",index);
    this.colValue[index] = "";
    this.apifunction.getConcentrationReports(this.auth.EntityID, sessionStorage.getItem('Username'), this.BlotterCode, this.from, this.to, this.RowsPerPage, this.PageNo)
    .subscribe(
      (res) => {
        // console.log("result = ",res);
             let concentrationRes = res.fillGrid_AllTemplate_UsingSP_GenResult;
      
          var json = JSON.stringify(concentrationRes);
          var temp = JSON.parse(json);
       
          var parser = new DOMParser();
          var xml = parser.parseFromString(temp, "text/xml");
          var obj = this.ngxXml2jsonService.xmlToJson(xml);

          this.concentrationReports = obj['NewDataSet'].Table;
          this.concentrationData = this.concentrationReports;
          this.totalRecords = this.concentrationReports.length;

          if(concentrationRes == '' || concentrationRes == null) {
            this.dataFlag = false;
          }
          else {
            this.dataFlag = true;
          }
      });
  }
  resetFilters() {
    this.fromDate = '';
    this.toDate = "";
    this.colValue = [];
    this.betweenVal1 = "";
    this.betweenVal2 = "";

    this.apifunction.getConcentrationReports(this.auth.EntityID,sessionStorage.getItem('Username'), this.BlotterCode, this.from, this.to, this.RowsPerPage, this.PageNo)
    .subscribe(
      (res) => {
        // console.log("result = ",res);
             let concentrationRes = res.fillGrid_AllTemplate_UsingSP_GenResult;
      
          var json = JSON.stringify(concentrationRes);
          var temp = JSON.parse(json);
       
          var parser = new DOMParser();
          var xml = parser.parseFromString(temp, "text/xml");
          var obj = this.ngxXml2jsonService.xmlToJson(xml);

          this.concentrationReports = obj['NewDataSet'].Table;
          this.concentrationData = this.concentrationReports;
          this.totalRecords = this.concentrationReports.length;

          if(concentrationRes == '' || concentrationRes == null) {
            this.dataFlag = false;
          }
          else {
            this.dataFlag = true;
          }
      });
  }

  applyFilters() {

    // console.log("this.filter_field",this.filter_field);
    let tempDate1 = this.fromDate.split('-');
    let tempDate2 = this.toDate.split('-');
    let fromtempDate = tempDate1[2] + '-' + this.months[tempDate1[1]-1] + '-' + tempDate1[0]; 
    let todatetemp = tempDate2[2] + '-' + this.months[tempDate2[1]-1] + '-' + tempDate2[0]
    
    let date1 = new Date(fromtempDate);
    let date2 = new Date(todatetemp);
    let concentrationDate;

    for(let i =0;i<this.concentrationReports.length;i++)
    {
      if(this.filter_field == "Next Redemption Exposure")
        concentrationDate = new Date(this.concentrationReports[i].Next_x0020_KO_x0020_Exposure);
      if(this.filter_field == "Last Calculated At")
        concentrationDate = new Date(this.concentrationReports[i].Last_Calc_Date);
    }
     
    for(let i =0;i<this.concentrationReports.length;i++) 
    {
      if(this.filter_field == "Next Redemption Exposure")
      concentrationDate = new Date(this.concentrationReports[i].Next_x0020_KO_x0020_Exposure);
      if(this.filter_field == "Last Calculated At")
        concentrationDate = new Date(this.concentrationReports[i].Last_Calc_Date);
      if(concentrationDate >= date1 && concentrationDate < date2)
      {
        // console.log("datess====",concentrationDate,date1);
        // console.log("dates ",this.concentrationReports[i].Next_x0020_KO_x0020_Exposure)
          
      }
      else {
        this.concentrationReports.splice(i,1);
      }
    }
    // console.log("concentrationReports-",this.concentrationReports);
  }

  sort1(event: any) {
    console.log("sort1 = ",event.target.value);
    let sortCol = event.target.value;
    let val;

    if (sortCol == "Underlying" ) {
      val = 'underlying';
    }
    else if (sortCol == "# of ISINs") {
      val = "isins"
    }
    else if(sortCol == "# of ISINs Alive"){
      val = "isinsAlive"
    }
    else if(sortCol == "# of ISINs Autocalled"){
      val = "isinsAutocalled"
    }
    else if(sortCol == "# of ISINs Matured"){
      val = "isinsMatured"
    }
    else if(sortCol == "# of ISINs Matured with Knocked-In"){
      val = "knockin-In"
    }
    else if(sortCol == "Total Product Exposure USD"){
      val = "totalProductExpo"
    }
    else if(sortCol == "Avg MTM 1 Day Change"){
      val = "AvgMTM"
    }
    else if(sortCol == "Next Redemption Exposure"){
      val = "nextkoRedem"
    }
    else if(sortCol == "Next Redemption Exposure USD") {
      val = "nextkoRedemUSD";
    }
    else if(sortCol == "Next Redemption Avg Probability"){
      val = "nextAvyProb"
    }
    else if(sortCol == "Exchange"){
      val = "exch"
    }
    else if(sortCol == "Sector"){
      val = "sector"
    }
    else if(sortCol == "Last Calculated At"){
      val = "Last_Calc_Date"
    }
    else if(sortCol == "Anticipated Autocalls (20 days 1 sigma)") {
      val = "KnockedOut_Products20Days1Sigma"
    }
    // console.log("concentration ",this.concentrationReports);

    for(let i=0; i < this.concentrationReports.length; i++) 
    {
      this.concentrationReports[i].isins = parseFloat(this.concentrationReports[i].isins);
      this.concentrationReports[i].isinsAlive = parseFloat(this.concentrationReports[i].isinsAlive);
      this.concentrationReports[i].isinsAutocalled  = parseFloat(this.concentrationReports[i].isinsAutocalled);
      this.concentrationReports[i].isinsMatured = parseFloat(this.concentrationReports[i].isinsMatured);
      this.concentrationReports[i].knockin = parseFloat(this.concentrationReports[i].knockin);
      this.concentrationReports[i].totalProductExpo = parseFloat(this.concentrationReports[i].totalProductExpo);
      this.concentrationReports[i].AvgMTM = parseFloat(this.concentrationReports[i].AvgMTM);
      this.concentrationReports[i].nextkoRedem = parseFloat(this.concentrationReports[i].nextkoRedem);
      this.concentrationReports[i].nextkoRedemUSD = parseFloat(this.concentrationReports[i].nextkoRedemUSD);
      this.concentrationReports[i].nextAvyProb = parseFloat(this.concentrationReports[i].nextAvyProb);
      // this.concentrationReports[i].Exchange = parseFloat(this.concentrationReports[i].Exchange);
      // this.concentrationReports[i].Sector = parseFloat(this.concentrationReports[i].Sector);
    }
    this.concentrationReports = this.concentrationReports.sortBy(val);
    // this.concentrationReports = this.concentrationReports.sort((a: any, b: any) =>
    // a._x0023__x0020_of_x0020_ISINs - b._x0023__x0020_of_x0020_ISINs ||
    // a._x0023__x0020_of_x0020_ISINs_x0020_Alive - b._x0023__x0020_of_x0020_ISINs_x0020_Alive || 
    // a._x0023__x0020_of_x0020_ISINs_x0020_Autocalled - b._x0023__x0020_of_x0020_ISINs_x0020_Autocalled || 
    // a._x0023__x0020_of_x0020_ISINs_x0020_Matured - b._x0023__x0020_of_x0020_ISINs_x0020_Matured
    // )
    
    this.sort1Result = this.concentrationReports;
    console.log("sorted = ",this.sort1Result);
  }
  sort2(event: any) {
    let sortCol = event.target.value;
    let val;

    if (sortCol == "Underlying" ) {
      val = "underlying";
    }
    else if (sortCol == "# of ISINs") {
      val = "isins"
    }
    else if(sortCol == "# of ISINs Alive"){
      val = "isinsAlive"
    }
    else if(sortCol == "# of ISINs Autocalled"){
      val = "isinsAutocalled"
    }
    else if(sortCol == "# of ISINs Matured"){
      val = "isinsMatured"
    }
    else if(sortCol == "# of ISINs Matured with Knocked-In"){
      val = "knockin"
    }
    else if(sortCol == "Total Product Exposure"){
      val = "totalProductExpo"
    }
    else if(sortCol == "Avg MTM 1 Day Change"){
      val = "AvgMTM"
    }
    else if(sortCol == "Next KO Exposure"){
      val = "nextkoRedem"
    }
    else if(sortCol == "Next KO Exposure USD"){
      val = "nextkoRedemUSD"
    }
    else if(sortCol == "Next Redemption Avg Probability"){
      val = "nextAvyProb"
    }
    else if(sortCol == "Exchange"){
      val = "exch"
    }
    else if(sortCol == "Sector"){
      val = "sector"
    }
    for(let i=0; i < this.sort1Result.length; i++) 
    {
      this.sort1Result[i].isins = parseFloat(this.sort1Result[i].isins);
      this.sort1Result[i].isinsAlive = parseFloat(this.sort1Result[i].isinsAlive);
      this.sort1Result[i].isinsAutocalled  = parseFloat(this.sort1Result[i].isinsAutocalled);
      this.sort1Result[i].isinsMatured = parseFloat(this.sort1Result[i].isinsMatured);
      this.sort1Result[i].knockin = parseFloat(this.concentrationReports[i].knockin);
      this.sort1Result[i].totalProductExpo = parseFloat(this.sort1Result[i].totalProductExpo);
      this.sort1Result[i].AvgMTM = parseFloat(this.sort1Result[i].AvgMTM);
      this.sort1Result[i].nextkoRedem = parseFloat(this.sort1Result[i].nextkoRedem);
      this.sort1Result[i].nextkoRedemUSD = parseFloat(this.sort1Result[i].nextkoRedemUSD);
      this.sort1Result[i].nextAvyProb = parseFloat(this.sort1Result[i].nextAvyProb);
    }

  }

  sort3(event: any) {
    console.log("",event.target.value)
  }
  sort4(event: any) {
    console.log("",event.target.value)
  }
  sort5(event:any) {
    console.log("",event.target.value)
  }

  async getTableData() {
   
    this.apifunction.getBlotterCode(sessionStorage.getItem('Username')).subscribe((res)=>{

      let blotterCodesArray: any = [];
      blotterCodesArray = res.Get_blottercodeResult;

      for(let i=0;i < blotterCodesArray.length; i++) 
      {
        if(blotterCodesArray[i].BCM_long_name.toUpperCase() == "CONCENTRATION BY UNDERLYING") 
        {
            // this.BlotterCode = blotterCodesArray[i].BCM_ID;
            this.BlotterCode = blotterCodesArray[i].BCM_ID;
        }
      }
      // console.log("Blotter code= ",this.BlotterCode,typeof(this.BlotterCode));
      // this.BlotterCode = this.BlotterCode.toString();

      this.apifunction.getMetaData(this.BlotterCode).subscribe((res)=>{
        // console.log("res get meta data = ",res.Fill_Grid_Meta_DataResult);

        let metadata = res.Fill_Grid_Meta_DataResult;

        metadata.forEach((element: any) => {
           element.value = "";
        });
        // console.log("metadata = ",metadata)
        this.columnTable = metadata;

        for(let i =0;i<this.columnTable.length;i++) 
        {
          // console.log("----",this.columnTable)
          if(this.columnTable[i].Header == 'Underlying' || this.columnTable[i].Header == 'Exchange' || this.columnTable[i].Header == 'Sector') 
          {
            this.typeVal[i] = 'LIKE'
          }
          else{
            this.typeVal[i] = '='
          }
          this.checkbox[i] = false;
        }
        // console.log("in on init",this.typeVal)
      })
 // sessionStorage.getItem('Username') , this.auth.EntityID
      this.apifunction.getConcentrationReports(this.auth.EntityID,sessionStorage.getItem('Username') , this.BlotterCode, this.from, this.to, this.RowsPerPage, this.PageNo)
      .subscribe(
        (res) => {
          // console.log("result = ",res,this.BlotterCode);
               let concentrationRes = res.fillGrid_AllTemplate_UsingSP_GenResult;
        
            var json = JSON.stringify(concentrationRes);
            var temp = JSON.parse(json);
         
            var parser = new DOMParser();
            var xml = parser.parseFromString(temp, "text/xml");
            var obj = this.ngxXml2jsonService.xmlToJson(xml);
  
            this.concentrationReports = obj['NewDataSet'].Table;
  
            this.concentrationData = this.concentrationReports;
  
            this.totalRecords = this.concentrationReports.length;
  
            console.log("concentration reports ",this.concentrationReports)
            if(concentrationRes == '' || concentrationRes == null) {
              this.dataFlag = false;
            }
            else {
              this.dataFlag = true;
            }

             //---------------------
              let temp1 = [];

              for(let i = 0;i < this.concentrationReports.length;i++) 
              {
                temp1.push({
                  underlying:  this.concentrationReports[i]['Underlying'],
                  isins : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs'],
                  isinsAlive : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Alive'],
                  isinsAutocalled : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Autocalled'],
                  isinsMatured : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Matured'],
                  knockin : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Matured_x0020_with_x0020_Knocked-In'],
                  totalProductExpo : this.concentrationReports[i]['Total_x0020_Product_x0020_Exposure'],
                  AvgMTM : this.concentrationReports[i]['Avg_x0020_MTM_x0020_Change_x0020_1_x0020_Day'],
                  nextkoRedem : this.concentrationReports[i]['Next_x0020_KO_x0020_Exposure'],
                  nextkoRedemUSD : this.concentrationReports[i]['Next_x0020_KO_x0020_Avg_x0020_Exposure'],
                  nextAvyProb : this.concentrationReports[i]['Next_x0020_KO_x0020_Avg_x0020_Probability'],
                  exch : this.concentrationReports[i]['Exchange'],
                  sector : this.concentrationReports[i]['Sector'],
                })
              }

              this.concentrationReports = temp1
              if(this.concentrationReports.length == 0) {
                this.dataEmpty = true;
              }
              else 
              {
                this.dataEmpty = false;
              }
              console.log("----concentrat---------",temp1,this.concentrationReports)


              //-----------------
        });
       
        
    })

   

  }

  exporttoExcel() {
    const element = document.getElementById('content');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, "Concentration_Reports");
  }

  changeFromDate(event) {
    this.fromDate = event.target.value;
    // console.log("event.target.value",this.fromDate);
  }

  changeToDate(event) {
    this.toDate = event.target.value;
    // console.log("to date",this.toDate);
  }

  exportAsXLSX() {
    try{

    var exlBlotterDataRows = [] ; 

    this.concentrationReports.forEach(item=>{    
      var item11 = {};
      for (const k in item) {
      
        item11[this.workflowfunction.mapHeader(k)] = item[k]
       
      }
      exlBlotterDataRows.push(item11)
    });

  }
  catch (error) {
    console.log(error);
  }
  }

  refreshData() {
    this.apifunction.getConcentrationReports(this.auth.EntityID,sessionStorage.getItem('Username'), this.BlotterCode, this.from, this.to, this.RowsPerPage, this.PageNo)
    .subscribe(
      (res) => {
        // console.log("result = ",res);
             let concentrationRes = res.fillGrid_AllTemplate_UsingSP_GenResult;
      
          var json = JSON.stringify(concentrationRes);
          var temp = JSON.parse(json);
       
          var parser = new DOMParser();
          var xml = parser.parseFromString(temp, "text/xml");
          var obj = this.ngxXml2jsonService.xmlToJson(xml);

          this.concentrationReports = obj['NewDataSet'].Table;
          this.concentrationData = this.concentrationReports;
          this.totalRecords = this.concentrationReports.length;

          if(concentrationRes == '' || concentrationRes == null) {
            this.dataFlag = false;
          }
          else {
            this.dataFlag = true;
          }
           //---------------------
           let temp1 = [];

           for(let i = 0;i < this.concentrationReports.length;i++) 
           {
             temp1.push({
               underlying:  this.concentrationReports[i]['Underlying'],
               isins : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs'],
               isinsAlive : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Alive'],
               isinsAutocalled : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Autocalled'],
               isinsMatured : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Matured'],
               knockin : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Matured_x0020_with_x0020_Knocked-In'],
               totalProductExpo : this.concentrationReports[i]['Total_x0020_Product_x0020_Exposure'],
               AvgMTM : this.concentrationReports[i]['Avg_x0020_MTM_x0020_Change_x0020_1_x0020_Day'],
               nextkoRedem : this.concentrationReports[i]['Next_x0020_KO_x0020_Exposure'],
               nextkoRedemUSD : this.concentrationReports[i]['Next_x0020_KO_x0020_Avg_x0020_Exposure'],
               nextAvyProb : this.concentrationReports[i]['Next_x0020_KO_x0020_Avg_x0020_Probability'],
               exch : this.concentrationReports[i]['Exchange'],
               sector : this.concentrationReports[i]['Sector'],
             })
           }
 
           this.concentrationReports = temp1
 
           console.log("----concentrat---------",temp1,this.concentrationReports)
           //-----------------
      });
  }

  changeRows(records: any) {
    this.concentrationData = this.concentrationReports;
    console.log("records= ",records);
    this.RowsPerPage = records;
    this.apifunction.getConcentrationReports(this.auth.EntityID, sessionStorage.getItem('Username'), this.BlotterCode, this.from, this.to, this.RowsPerPage, this.PageNo)
    .subscribe(
      (res) => {
          let concentrationRes = res.fillGrid_AllTemplate_UsingSP_GenResult;
          // console.log("result ................= ",concentrationRes);
      
          var json = JSON.stringify(concentrationRes);
          var temp = JSON.parse(json);
       
          var parser = new DOMParser();
          var xml = parser.parseFromString(temp, "text/xml");
          var obj = this.ngxXml2jsonService.xmlToJson(xml);
          // console.log("obj.......",obj)
          this.concentrationReports = obj['NewDataSet'].Table;

          this.concentrationData = this.concentrationReports;

          this.totalRecords = this.concentrationReports.length;

          // this.concentrationReports = Array.of(this.concentrationReports)
          // this.concentrationReports = Object.assign([], ...this.concentrationReports);
          if(this.RowsPerPage == 1) {
            this.concentrationReports = [this.concentrationReports];
          }
          else{
            this.concentrationReports = [this.concentrationReports];
            this.concentrationReports = this.concentrationReports[0];

          }
          console.log("concentration reports .....................",this.concentrationReports,this.concentrationReports[0])
          if(concentrationRes == '' || concentrationRes == null) {
            this.dataFlag = false;
          }
          else {
            this.dataFlag = true;
          }
          //---------------------
          let temp1 = [];

          for(let i = 0;i < this.concentrationReports.length;i++) 
          {
            temp1.push({
              underlying:  this.concentrationReports[i]['Underlying'],
              isins : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs'],
              isinsAlive : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Alive'],
              isinsAutocalled : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Autocalled'],
              isinsMatured : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Matured'],
              knockin : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Matured_x0020_with_x0020_Knocked-In'],
              totalProductExpo : this.concentrationReports[i]['Total_x0020_Product_x0020_Exposure'],
              AvgMTM : this.concentrationReports[i]['Avg_x0020_MTM_x0020_Change_x0020_1_x0020_Day'],
              nextkoRedem : this.concentrationReports[i]['Next_x0020_KO_x0020_Exposure'],
              nextkoRedemUSD : this.concentrationReports[i]['Next_x0020_KO_x0020_Avg_x0020_Exposure'],
              nextAvyProb : this.concentrationReports[i]['Next_x0020_KO_x0020_Avg_x0020_Probability'],
              exch : this.concentrationReports[i]['Exchange'],
              sector : this.concentrationReports[i]['Sector'],
            })
          }

          this.concentrationReports = temp1

          // console.log("----concentrat---------",temp1,this.concentrationReports)
          //-----------------
      });

  
  }

  valueFilter( index: any) {
    console.log("in value filters ",this.colValue[index]);
    // console.log("betweenVal1 =",this.betweenVal1,this.betweenVal2);
    
    let sortCol = this.columnTable[index].Header;
    let val;

    if (sortCol == "Underlying" ) {
      val = "underlying";
      this.colValue[index] = this.colValue[index].toUpperCase();
      // console.log("col value =",this.colValue[index])

    }
    else if (sortCol == "# of ISINs") {
      val = "isins"
    }
    else if(sortCol == "# of ISINs Alive"){
      val = "isinsAlive"
    }
    else if(sortCol == "# of ISINs Autocalled"){
      val = "isinsAutocalled"
    }
    else if(sortCol == "# of ISINs Matured"){
      val = "isinsMatured"
    }
    else if(sortCol == "# of ISINs Matured with Knocked-In"){
      val = "knockin"
    }
    else if(sortCol == "Total Product Exposure USD"){
      val = "totalProductExpo"
    }
    else if(sortCol == "Avg MTM 1 Day Change"){
      val = "AvgMTM"
    }
    else if(sortCol == "Next Redemption Exposure"){
      val = "nextkoRedem"
    }
    else if(sortCol == "Next Redemption Exposure USD"){
      val = "nextkoRedemUSD"
    }   
    else if(sortCol == "Next Redemption Avg Probability"){
      val = "nextAvyProb"
    }    
    else if(sortCol == "Exchange"){
      val = "exch";
      this.colValue[index] = this.colValue[index].toUpperCase();
      // console.log("col value =",this.colValue[index])

    }
    else if(sortCol == "Sector"){
      val = "sector";
      this.colValue[index] = this.colValue[index].toUpperCase();
      // console.log("col value sector----------- =",this.colValue[index])
    }

  
    if(this.columnTable[index].Header == 'Underlying' || this.columnTable[index].Header == 'Exchange' || this.columnTable[index].Header == 'Sector') 
    {
        let tempArray: any = [];
        // console.log("in string  =",this.colValue[index]);
        if(this.typeVal[index] == '=') 
        {
          for(let i=0 ;i <this.concentrationReports.length; i++) 
          { 
            if(this.concentrationReports[i][val] == this.colValue[index]) 
            {
              console.log("=",i,this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);
            }
          }
        }
        else if(this.typeVal[index] == '!=') 
        {
          for(let i=0 ;i <this.concentrationReports.length; i++) 
          { 
            if(this.concentrationReports[i][val] != this.colValue[index])
            {
              // console.log("!= val",i,this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);
            }         
          }
        }
        else if(this.typeVal[index] == 'LIKE') 
        {          
          for(let i=0 ;i <this.concentrationReports.length; i++) 
          { 
            let temp = this.concentrationReports[i][val];
            temp = temp.toUpperCase();
            if(temp.includes(this.colValue[index])) 
            {
              // console.log("like val",i,this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);
              // console.log("temp array ",tempArray)
            }
          }
        }
        else if(this.typeVal[index] == 'NOT LIKE') 
        {
          for(let i=0 ;i <this.concentrationReports.length; i++) 
          { 
            if(this.concentrationReports[i][val].includes(this.colValue[index])) 
            {
             
            }
            else
            {
              // console.log("not like val",i,this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);
              // console.log("temp array ",tempArray)
            }
          }
        }
        this.concentrationReports = "";
        this.concentrationReports = tempArray;
    }
   
    else
    {
      this.colValue[index] = parseFloat(this.colValue[index]);
      let tempArray: any = [];
      // console.log("col  Header",this.columnTable[index].Header);
      for(let i =0;i< this.concentrationReports.length ; i++) {
        // console.log("in else ",this.concentrationReports[i][val]);
        if(this.columnTable[index].Header != 'Total Product Exposure USD' && this.columnTable[index].Header != 'Next Redemption Exposure USD')  
        {
          // console.log("in if")
          this.concentrationReports[i][val] = parseFloat(this.concentrationReports[i][val]);      
        }
        // console.log("in else after",this.concentrationReports[i][val])  
      }

      let unformatVal = [];
      if(this.typeVal[index] == '=') 
      {
        // console.log("in---colvalue---",this.colValue[index])
        for(let i =0;i< this.concentrationReports.length ; i++) 
        {
          if(this.columnTable[index].Header == 'Total Product Exposure USD' ||  this.columnTable[index].Header == 'Next Redemption Exposure USD')  
          {
            unformatVal[i] = this.UnformatNumbernotionalnotevent(this.concentrationReports[i][val]);
            console.log("i= ",i,this.concentrationReports[i][val],unformatVal[i]);
            if(unformatVal[i] == this.colValue[index]) 
            {
              // console.log("== ",this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);
              // console.log("temp array = ",tempArray);            
            }
          }
          else 
          {
            if(this.concentrationReports[i][val] === this.colValue[index]) 
            {
              // console.log("== ",this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);
              // console.log("temp array = ",tempArray);
            
            }
          }
         
        }
      }
      else if(this.typeVal[index] == '!=') {
        for(let i =0;i< this.concentrationReports.length ; i++) 
        { 
          if(this.columnTable[index].Header == 'Total Product Exposure USD' ||  this.columnTable[index].Header == 'Next Redemption Exposure USD')  
          {
            unformatVal[i] = this.UnformatNumbernotionalnotevent(this.concentrationReports[i][val]);
            // console.log("i= ",i,this.concentrationReports[i][val],unformatVal[i]);
            if(unformatVal[i] != this.colValue[index]) 
            {
              // console.log("== ",this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);
              console.log("temp array = ",tempArray);            
            }
          }
          else 
          {
            if(this.concentrationReports[i][val] != this.colValue[index]) 
            {
              tempArray.push(this.concentrationReports[i]);           
            }
          }
        }
      }
      else if(this.typeVal[index] == '<') {
        for(let i =0;i< this.concentrationReports.length ; i++) 
        { 
          if(this.columnTable[index].Header == 'Total Product Exposure USD' ||  this.columnTable[index].Header == 'Next Redemption Exposure USD')  
          {
            unformatVal[i] = this.UnformatNumbernotionalnotevent(this.concentrationReports[i][val]);
            // console.log("i= ",i,this.concentrationReports[i][val],unformatVal[i]);
            if(unformatVal[i] < this.colValue[index]) 
            {
              // console.log("== ",this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);
              console.log("temp array = ",tempArray);            
            }
          }
          else 
          {
            if(this.concentrationReports[i][val] < this.colValue[index]) 
            {
              // console.log("less than ",this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);
              
            }
          }
        }
      }
      else if(this.typeVal[index] == '>') {
        for(let i =0;i< this.concentrationReports.length ; i++) 
        { 
          if(this.columnTable[index].Header == 'Total Product Exposure USD' ||  this.columnTable[index].Header == 'Next Redemption Exposure USD')  
          {
            unformatVal[i] = this.UnformatNumbernotionalnotevent(this.concentrationReports[i][val]);
            // console.log("i= ",i,this.concentrationReports[i][val],unformatVal[i]);
            if(unformatVal[i] > this.colValue[index]) 
            {
              // console.log("== ",this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);
              console.log("temp array = ",tempArray);            
            }
          }
          else 
          {
            if(this.concentrationReports[i][val] > this.colValue[index]) 
            {
              // console.log("greater than ",this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);            
            }
          }
        }
      }
      else if(this.typeVal[index] == '<=') {
        for(let i =0;i< this.concentrationReports.length ; i++) 
        {
          if(this.columnTable[index].Header == 'Total Product Exposure USD' ||  this.columnTable[index].Header == 'Next Redemption Exposure USD')  
          {
            unformatVal[i] = this.UnformatNumbernotionalnotevent(this.concentrationReports[i][val]);
            // console.log("i= ",i,this.concentrationReports[i][val],unformatVal[i]);
            if(unformatVal[i] <= this.colValue[index]) 
            {
              // console.log("== ",this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);
              console.log("temp array = ",tempArray);            
            }
          }
          else 
          {
            if(this.concentrationReports[i][val] <= this.colValue[index]) 
            {
              tempArray.push(this.concentrationReports[i]); 
            }
          }
        }
      }
      else if(this.typeVal[index] == '>=') {
        for(let i =0;i< this.concentrationReports.length ; i++) 
        { 
          if(this.columnTable[index].Header == 'Total Product Exposure USD' ||  this.columnTable[index].Header == 'Next Redemption Exposure USD')  
          {
            unformatVal[i] = this.UnformatNumbernotionalnotevent(this.concentrationReports[i][val]);
            // console.log("i= ",i,this.concentrationReports[i][val],unformatVal[i]);
            if(unformatVal[i] >= this.colValue[index]) 
            {
              // console.log("== ",this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);
              console.log("temp array = ",tempArray);            
            }
          }
          else 
          {
            if(this.concentrationReports[i][val] >= this.colValue[index]) 
            {
              // console.log("greater than equal ",this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);           
            }
          }
        }
      }
      else if(this.typeVal[index] == 'BETWEEN') {
        for(let i =0;i< this.concentrationReports.length ; i++) 
        { 
          if(this.columnTable[index].Header == 'Total Product Exposure USD' ||  this.columnTable[index].Header == 'Next Redemption Exposure USD')  
          {
            unformatVal[i] = this.UnformatNumbernotionalnotevent(this.concentrationReports[i][val]);
            // console.log("i= ",i,this.concentrationReports[i][val],unformatVal[i]);
            if(unformatVal[i] >= this.betweenVal1 && unformatVal[i] < this.betweenVal2) 
            {
              // console.log("== ",this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);
              console.log("temp array = ",tempArray);            
            }
          }
          else 
          {
            if(this.concentrationReports[i][val] >= this.betweenVal1 && this.concentrationReports[i][val] < this.betweenVal2) 
            {
              // console.log("greater than equal ",this.concentrationReports[i][val]);
              tempArray.push(this.concentrationReports[i]);           
            }
          }
        }
      }

      this.concentrationReports = "";
      this.concentrationReports = tempArray;

    }
   
  }

  changeType(event: any, i: any) {
    console.log("in change type ",);
    this.typeVal[i] = event.target.value;
    this.checkbox[i] = true;
    console.log("checkbox  =",this.checkbox[i])
  }

  closeFilter() {
    this.filterFlag = false;
    this.fromDate = '';
    this.toDate = "";
    this.colValue = [];
  }

  prevBtnClicked() {
    try{
      if (this.PageNo > 1) {
        this.PageNo = this.PageNo - 1;
        this.pageFirstRecord = ((this.PageNo - 1) * this.RowsPerPage) + 1;
  
        this.pageLastRecord = ((this.PageNo) * this.RowsPerPage) >= this.noOfRecords
          ? this.noOfRecords : ((this.PageNo) * this.RowsPerPage);
        this.pageNoChange();
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  nextBtnClicked() {
    console.log("next btn")
    try{
      var noOfPages = this.noOfRecords % this.RowsPerPage == 0 ?
        this.noOfRecords / this.RowsPerPage :
        (this.noOfRecords / this.RowsPerPage) + 1;
      if (this.PageNo + 1 > 0 && (this.PageNo + 1) <= noOfPages) {
        this.PageNo = this.PageNo + 1;
        this.pageFirstRecord = ((this.PageNo - 1) * this.RowsPerPage) + 1;
        this.pageLastRecord = ((this.PageNo) * this.RowsPerPage) >= this.noOfRecords
          ? this.noOfRecords : ((this.PageNo) * this.RowsPerPage);         
      }
      console.log("page nno n in nect",this.PageNo)
      this.pageNoChange();
    }
    catch (error) {
      console.log(error);
    }
  }

  pageNoChange() {
    console.log("this.page",this.PageNo);
    this.apifunction.getConcentrationReports(this.auth.EntityID, sessionStorage.getItem('Username'), this.BlotterCode, this.from, this.to, this.RowsPerPage, this.PageNo)
    // this.apifunction.getConcentrationReports("4","Nikhlikumar","10267","16-Feb-2020","16-Feb-2022","5","2")
    .subscribe(
      (res) => {
        let concentrationRes = res.fillGrid_AllTemplate_UsingSP_GenResult;
        console.log("result-------------------= ",concentrationRes);
      
          var json = JSON.stringify(concentrationRes);
          var temp = JSON.parse(json);
       
          var parser = new DOMParser();
          var xml = parser.parseFromString(temp, "text/xml");
          var obj = this.ngxXml2jsonService.xmlToJson(xml);

          this.concentrationReports = obj['NewDataSet'].Table;

          this.concentrationData = this.concentrationReports;

          this.totalRecords = this.concentrationReports.length;

          this.concentrationReports = [this.concentrationReports]
          // console.log("concentration reports new page data ",this.concentrationReports)
          if(concentrationRes == '' || concentrationRes == null) {
            this.dataFlag = false;
          }
          else {
            this.dataFlag = true;
          }
            //---------------------
            let temp1 = [];

            for(let i = 0;i < this.concentrationReports.length;i++) 
            {
              temp1.push({
                underlying:  this.concentrationReports[i]['Underlying'],
                isins : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs'],
                isinsAlive : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Alive'],
                isinsAutocalled : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Autocalled'],
                isinsMatured : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Matured'],
                knockin : this.concentrationReports[i]['_x0023__x0020_of_x0020_ISINs_x0020_Matured_x0020_with_x0020_Knocked-In'],
                totalProductExpo : this.concentrationReports[i]['Total_x0020_Product_x0020_Exposure'],
                AvgMTM : this.concentrationReports[i]['Avg_x0020_MTM_x0020_Change_x0020_1_x0020_Day'],
                nextkoRedem : this.concentrationReports[i]['Next_x0020_KO_x0020_Exposure'],
                nextkoRedemUSD : this.concentrationReports[i]['Next_x0020_KO_x0020_Avg_x0020_Exposure'],
                nextAvyProb : this.concentrationReports[i]['Next_x0020_KO_x0020_Avg_x0020_Probability'],
                exch : this.concentrationReports[i]['Exchange'],
                sector : this.concentrationReports[i]['Sector'],
              })
            }
  
            this.concentrationReports = temp1
  
            console.log("----concentrat---------",temp1,this.concentrationReports)
      });
  }
  changeDateField(event: any) {
    this.filter_field = event.target.value;
    console.log("change filter = ",this.filter_field);

  }


  UnformatNumbernotionalnotevent(e : any) {
    let target: any = e.toString();
    target = target.replace(/,/g, '');
    target = target.split('.');
    target = target[0];
    if (target === '0.00') {
      target = '';
    }
  return target;
  }

}
