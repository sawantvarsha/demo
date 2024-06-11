import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApifunctionService } from '../apifunction.service';
import { CommonfunctionService } from '../commonfunction.service';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';
// import * as pdfMake from 'pdfmake';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spread-manage',
  templateUrl: './spread-manage.component.html',
  styleUrls: ['./spread-manage.component.css']
})
export class SpreadManageComponent implements OnInit, OnDestroy {


  assetURL: string;
  workflowRecords = [];
  filteredWorflowRecords = [];
  workflowLen = 0;
  filterLen = 0;
  spreadGrp = 'All';
  apifunction: ApifunctionService;
  spreadGroupType = [];
  validationMsg = '';
  TradeDate: string;
  loading = false;
  private spreadSubscription: Subscription;
  private spreadGroupSubscription: Subscription;
  constructor(afs: ApifunctionService, public commonfunction: CommonfunctionService) {
    this.apifunction = afs;
  }
  ngOnDestroy() {
    if (this.spreadSubscription !== undefined) {
      this.spreadSubscription.unsubscribe();
    }
    if (this.spreadGroupSubscription !== undefined) {
      this.spreadGroupSubscription.unsubscribe();
    }

  }
  ngOnInit() {
    this.assetURL = environment.assetURL;
    this.TradeDate = formatDate(new Date(), 'dd-MMM-yyyy', 'en-US', '+0530');
    this.apifunction.getSpreadData();
    this.loading = true;
    this.apifunction.getSpreadGroup();
    this.spreadSubscription = this.apifunction.spreadDataObserver.subscribe(res => {
      if (res) {
        try {
          this.loading = false;
          this.workflowRecords = res;
          this.filteredWorflowRecords = this.workflowRecords;
          this.ChangeLen();
          this.validation();
        } catch (ex) {
          //console.log(ex);
        }

      }
    });
    this.spreadGroupSubscription = this.apifunction.spreadGroupObserver.subscribe(res => {
      if (res) {
        try {
          this.spreadGroupType = res;
        } catch (ex) {
          //console.log(ex);
        }
      }
    });
  }

  ChangeLen() {
    this.filterLen = this.filteredWorflowRecords.length;
    this.workflowLen = this.workflowRecords.length;
  }
  validation() {
    if (this.filterLen === 0) {
      this.validationMsg = 'No data found.';
    } else {
      this.validationMsg = '';
    }
  }
  exportexcel() {
    try {
      if (this.filteredWorflowRecords.length === 0) {
        this.validationMsg = 'No data for export';
      } else {
        /* table id is passed over here */
        const element = document.getElementById('excel-table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, 'SpreadManagement' + this.TradeDate + '.xlsx');
        this.validationMsg = '';
      }
    } catch (ex) {
      //console.log(ex);
    }
  }
  public captureScreen() {
    const data = document.getElementById('contentToConvert1');
    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('SpreadManagement' + this.TradeDate + '.pdf'); // Generated PDF
    }).catch(err => console.log(err));
   
  }

  callWorkflow() {
    this.spreadGrp = 'All';
    this.workflowRecords = this.filteredWorflowRecords = [];
    this.ChangeLen();
    this.apifunction.getSpreadData();
    this.loading = true;
  }
  filterdata() {
    try {

      this.filteredWorflowRecords = this.workflowRecords.filter(element => {

        if (this.spreadGrp === 'All') {
          return (element.SpreadGroup);
        } else if (this.spreadGrp !== 'All') {
          return (element.SpreadGroup === this.spreadGrp);
        }
      });

      this.ChangeLen();
      this.validation();
    } catch (ex) {
      //console.log(ex);
    }
  }
}
