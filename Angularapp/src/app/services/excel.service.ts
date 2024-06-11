import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    for (let i = 0; i < header.length; i++) {
      wscols.push({ wch: Math.max(String(data[i]).trim().length, this.replaceChar(String(header[i]).trim()).length) });
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
      fileName + '_EXPORT_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  public ExportDOMTablesAsExcel(querySelectors: string[], sheetNames: string[], fileName) {
    try {

      if(querySelectors.length !== sheetNames.length)
        throw new Error('Table and sheet counts do not match.');

      /* generate workbook */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();

      /* iterate over elements and add worksheet for each table to the workbook */
      querySelectors.forEach((ele, idx) => {
        const domElement = document.querySelector(ele);
        if(domElement) {
          const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(domElement, {raw: true});
          XLSX.utils.book_append_sheet(wb, ws, sheetNames[idx]);
        } 
      })

       /* save to file */
       XLSX.writeFile(wb, fileName.concat(EXCEL_EXTENSION));

    } catch (error) {
      console.log(error);
    }
  }

  /** 
   * Method for PDF download functionality.
   * This method converts HTML element on the DOM tree into a <Canvas> element, converts it to Base64 encoded PNG image string,
   * and then adds this image to PDF and exports it.
   * 
   * Input parameters :: 
   *  @Required
   *  1) elementId => The HTML tag id value, i.e. the id of the HTML element to be exported as PDF.
   * 
   *  @Required
   *  2) fileName => The name of the exported file.
   * 
   *  @Optional
   *  3) elementStyles => Optional parameter that will contain information about the elements that are not visible on the DOM/Screen,
   *                      but need to be added in the PDF
   * 
   *  @Optional
   *  4) canvasCss => Optional parameter to adjust the height and width of the <Canvas> tag generated, needed to alter the space/padding 
   *                  so that hidden elements can be accommodated correctly in the PDF.

  **/
  public async ExportDomAsPDF(elementId: string, fileName: string, elementStyles?: PDFElementStyles[], canvasCss?: PDFCanvasStyle,watermarkText?:string) {
    try {
      let DOMElement: any = document.getElementById(elementId); //Get the element on the DOM
      await html2canvas(DOMElement, {
        width: canvasCss?.width ?? (<HTMLElement>DOMElement).clientWidth, //set the <Canvas> width and height over here 
        height: canvasCss?.height ?? (<HTMLElement>DOMElement).clientHeight + 100, //Completely optional, must work fine for most cases, but just in case :P
        onclone(clonedDoc) { //Callback funtion that is executed intermediately once the DOM element is converted into <Canvas> tag and before exporting it to PDF
          try {
            //clonedDoc is the copy of actual DOM element, hence we can modify the CSS(hide/show elements in PDF) in it without changing the actual DOM CSS
            if(elementStyles) {
              elementStyles.forEach(obj => { //iterate over the passed DOM selectors, and apply the required CSS
                const pdfElement = <HTMLElement>clonedDoc.querySelector(obj.domQuerySelector); //get the element from the cloned DOM
                Object.keys(obj.cssStyles).forEach(key => { //iterate over the CSS keys for that particular query selector and apply the CSS values to the element in the cloned DOM
                  pdfElement.style[key] = obj.cssStyles[key];
                })
              })
            }
          } catch (error) {
            console.log(error);
          }
        },
      }).then(canvas => {
        let imgWidth = 203; //Set the PDF file width and height so that <Canvas> tag fits properly
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png'); //converting the <Canvas> tag to Base64 encoded string in PNG format
        const pageHeight = 290;
        let heightLeft = imgHeight;
        let PDF = new jsPDF('p', 'mm', 'a4'); //Setting the print paper setting to A4 size and portrait orientation and create a blank PDF
        let position = 5;
        PDF.addImage(FILEURI, 'PNG', 4, position, imgWidth, imgHeight + 9); //adding the image to blank PDF, set the position of image on the PDF here
        //START || Modification by Varsha G || addition of multiple pages in pdf for large data
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          PDF.addPage();
          PDF.addImage(FILEURI, 'PNG', 4, position, imgWidth, imgHeight + 9);
          heightLeft -= pageHeight;
        }
        //END || Modification by Varsha G || addition of multiple pages in pdf for large data
        PDF = this.addWaterMark(PDF,watermarkText);
        PDF.save(fileName.concat('.pdf'));
      });
    } catch (error) {
      console.log(error);
    }
  }

  //Added by Varsha G || Addition of watermark in pdf 
  addWaterMark(doc,watermarkText) {
    var totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(16);
      doc.setTextColor(255,0,0);
      doc.text(156, doc.internal.pageSize.height - 5, watermarkText);
    }
    return doc;
  }

  replaceChar(str) {
    try {
      return (str.toString().replace(/_x0020_/g, ' ').replace(/_x0028_/g, '(').replace(/_x0029_/g, ')').replace(/_x002F_/g, '/').replace(/_x0025_/g, '%'));
    } catch (error) {
      console.log(error);
    }
  }

}

/**
 * Interface required for PDF export function
 * `domQuerySelector` is the query selector value (e.g. ==> `.className` || `#elemnentID`)
 * `cssStyles` contains key-value pairs where key is the inline CSS property(e.g. `display`) and value is its desired value in the PDF (e.g. `flex`)
 */
export interface PDFElementStyles {
  domQuerySelector: string,
  cssStyles: object
}

/**
 * Interface required for PDF export function
 * all properties of this interface are self-explanatory
 */
export interface PDFCanvasStyle {
  width?: number,
  height?: number
}