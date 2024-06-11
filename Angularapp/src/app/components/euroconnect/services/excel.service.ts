import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const header = Object.keys(json[0]);
    const data = Object.values(json[0]);
    const wscols = [];
    //console.log(String(data[21]).trim().length);
    //console.log(String(header[21]).trim().length);

    //console.log(this.replaceChar(String(header[21]).trim()).length);

    //console.log(String(data[21]).trim());
    //console.log(String(header[21]).trim());

    for (let i = 0; i < header.length; i++) {
		//DrishtyR | 24-Aug-2021 | Changes to decrease datetime column width for excel
      //wscols.push({ wch: Math.max(String(data[i]).trim().length, this.replaceChar(String(header[i]).trim()).length) });
	  if(typeof data[i] === 'object')
      {
        wscols.push({ wch: 13  });
      }
      else
      {
        wscols.push({ wch: (Math.max(String(data[i]).trim().length, this.replaceChar(String(header[i]).trim()).length)) });
      }
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    worksheet['!cols'] = wscols;

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  // x0028  (
  // x0029 )
  // x002F  /
  // x0025 %
  replaceChar(str) {
    try {
      // tslint:disable-next-line: max-line-length
      return (str.toString().replace(/_x0020_/g, ' ').replace(/_x0028_/g, '(').replace(/_x0029_/g, ')').replace(/_x002F_/g, '/').replace(/_x0025_/g, '%'));
    } catch (error) {
      //console.log(error);
    }
  }
}
