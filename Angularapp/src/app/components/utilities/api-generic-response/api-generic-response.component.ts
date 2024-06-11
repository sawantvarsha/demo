import { Component, OnInit } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-api-generic-response',
  templateUrl: './api-generic-response.component.html',
  styleUrls: ['./api-generic-response.component.scss']
})
export class ApiGenericResponseComponent implements OnInit {

  genres: any;
  showtable: boolean = false;

  table: Array<any> = [];
  tableHeadergen: Array<any> = [];
  tableBodygen: Array<any> = [];

  constructor(
    private excelService: ExcelService,
    public commonApi: CommonApiService
  ) { }

  ngOnInit(): void {
  }

  // Akhilesh

  clientdetailsclick_() {
    if (this.showtable === true){
      this.showtable = false;
    }
    else {
      this.showtable = true;
    }
  }

  parsegenres_() {

    this.showtable = true

    var tableHeader: Array<any> = [];
    var tableBody: Array<any> = [];
    this.table = [];

    console.log(this.genres);
    
    tableHeader = eval(this.genres)[0]['COLUMNS'].slice()
    tableBody = eval(this.genres)[0]['DATA'].slice()

    console.log(tableHeader, tableBody)

    this.table.push(tableHeader);

    tableBody.forEach((asset) => { 
      this.table.push(asset)
    });

    this.tableHeadergen = tableHeader;
    this.tableBodygen = tableBody;

    console.log(this.table);
  }

  Exporttoexcel_() {
    // const ExcelData = [] as any;

    this.showtable = true

    var tableHeader: Array<any> = [];
    var tableBody: Array<any> = [];
    this.table = [];
    
    tableHeader = eval(this.genres)[0]['COLUMNS'].slice()
    tableBody = eval(this.genres)[0]['DATA'].slice()

    this.table.push(tableHeader);

    tableBody.forEach((asset) => { 
      this.table.push(asset)
    });

    this.tableHeadergen = tableHeader;
    this.tableBodygen = tableBody;

    console.log(this.table)

    this.excelService.exportAsExcelFile(this.table, "Response_Table");

    // console.log(this.table);

    // const element = document.getElementById('GenResTable')

    // console.log(this.TABLE.nativeElement)

    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // XLSX.writeFile(wb, 'Response_table.xlsx');

  }

}
