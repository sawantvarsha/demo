import { DatePipe } from '@angular/common';
import { ViewEncapsulation } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ExcelService } from 'src/app/services/excel.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { isNullOrUndefined } from 'is-what';
import { AppConfig } from 'src/app/services/config.service';

@Component({
  selector: 'app-mpg-grid',
  templateUrl: './mpg-grid.component.html',
  styleUrls: ['./mpg-grid.component.scss'],

})
export class MpgGridComponent implements OnInit {

  @ViewChild('paginator', { static: true }) paginator: any = PageEvent;
  // @Input() expanded: boolean;
  @Output() expandedChange: EventEmitter<any> = new EventEmitter();
  selectedMPGitem: any;
  // BlotterDataItems: any;
  BlotterDataRows = [];
  BlotterDataColumnHeader: any;

  noOfRecords = 0;
  // pageSize = 5;
  pageSize = 10;
  // pageSize = 3;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100];
  // pageEvent: PageEvent;
  // pageEvent1: PageEvent;
  pageEvent: any;
  pageEvent1: any;

  pageNo = 1;
  pageFirstRecord = (this.pageNo - 1) * this.pageSize + 1;
  pageLastRecord = this.pageSize;

  BlotterDataRowsCopy: any;
  currDate: Date | undefined;
  sTokenToSearch = '';

  succMsg = '';
  errorMsg = '';
  expandedMPG: boolean;
  isLoader: boolean;
  rowLength: number;
  transpose: boolean;
  showColFilter: boolean = false;
  colName = ''
  y: string;
  x: string;
  filterkey: any;
  @Input() leftMenuExpanded = false
  colNo: any;
  loader: boolean = true;
  prevColName: string;
  totalRecords: any;

  // metaDataResult = [];

  constructor(
    private apifunction: WorkflowApiService,
    private datePipe: DatePipe,
    private auth: AuthService,
    private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
    this.expandedMPG = false;
    this.transpose = false;
    try {
      console.log('ngOnInit');
      // debugger;
      this.apifunction.selectedMPGObserver.subscribe((res: any) => {
        this.loader = true;
        this.currDate = new Date();
        this.apifunction.metaDataResult = [];
        this.sTokenToSearch = '';
        if (res) {

          if (this.apifunction.BlotterItems.length > 0) {
            console.log('Jyoti res',res);
            this.selectedMPGitem = res;
            if (
              this.selectedMPGitem &&
              (this.selectedMPGitem.length > 0 ||
                this.selectedMPGitem.BCM_ID !== '')
            ) {
              this.setMPGData();
            }
            // }
          }
        }
      });

      this.apifunction.BlotterDataRowsObserver.subscribe((res: any) => {
        this.BlotterDataRows = res;
        console.log('Jyoti BlotterDataRows',this.BlotterDataRows);
        this.BlotterDataRowsCopy = res;
        this.noOfRecords = this.BlotterDataRows.length;

        // console.log(this.apifunction.BlotterDataRowsCopy);
        // this.apifunction.setBlotterData(this.apifunction.BlotterDataRowsCopy);
      });
      // console.log(this.selectedMPGitem );
    } catch (error) {
      console.log(error);
    }
  }

  fillGridMetaData() {
    try {
      this.apifunction
        .fillGridMetaData(this.selectedMPGitem)
        .subscribe((data) => {
          console.log("Jyoti",data);
          // this.apifunction.metaDataResult = data.Fill_Grid_Meta_DataResult;
          this.apifunction.metaDataResult = data;
          console.log(this.apifunction.metaDataResult);
          // this.apifunction.metaDataResult = data.Fill_Grid_Meta_DataResult;
        });
    } catch (error) {
      console.log(error);
    }
  }
  setMPGData(changePage = false) {
    try {
      // console.log('setMPGData');
      this.BlotterDataRows = [];
      this.BlotterDataRowsCopy = [];
      this.isLoader = true;
      const that = this;

      var date1 = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
      if (!changePage) {
        this.pageNo = 1;
      }
      this.pageFirstRecord = (this.pageNo - 1) * this.pageSize + 1;
      this.pageLastRecord = this.pageSize;

      this.succMsg = '';
      this.errorMsg = '';

      this.apifunction
        .fillGridAllTemplateUsingSPGen(
          this.selectedMPGitem,
          this.pageSize,
          this.pageNo,
          date1,
          // sessionStorage.getItem('Username'),
          AppConfig.settings.oRes.userName,
          // this.auth.EntityID
          AppConfig.settings.oRes.homeEntityID,
        )
        .subscribe(
          (result) => {
            // parseString(data['fillGrid_AllTemplate_UsingSP_GenResult'], function ( result: any) {

            console.log('fillGridAllTemplateUsingSPGen--- Jyoti', result);
            this.isLoader = false;
            if (result) {
              that.apifunction.getDataForExportToExcel(result.NewDataSet.Table);
              this.totalRecords = result.recordCount

              that.BlotterDataRows = result.NewDataSet.Table;
            } else {
              that.BlotterDataRows = [];
            }

            if (that.BlotterDataRows && that.BlotterDataRows.length > 0) {
              that.BlotterDataRows.forEach((item) => {
                // console.log(item['ROWCount'])
                delete item.ROWCount;
              });

              // console.log(that.BlotterDataRows);

              that.BlotterDataRows = that.BlotterDataRows.filter(
                (value) => Object.keys(value).length !== 0
              );
            }
            that.apifunction.BlotterDataRowsCopy = that.BlotterDataRows;
            that.BlotterDataRowsCopy = that.BlotterDataRows;

            that.BlotterDataRowsCopy = that.BlotterDataRows;
            // console.log(that.BlotterDataRows);
            // console.log(that.BlotterDataRows);

            if (!that.BlotterDataRows || that.BlotterDataRows.length == 0) {
              that.noOfRecords = 0;
              that.BlotterDataColumnHeader = [];
                            that.apifunction.setBlotterDataColumnHeader(
                that.BlotterDataColumnHeader
              );
              that.succMsg = '';
              that.errorMsg = 'No data found.';
            } else if (
              that.BlotterDataRows &&
              that.BlotterDataRows.length > 0
            ) {

              that.fillGridMetaData();
              // console.log(that.metaDataResult);
              that.noOfRecords = that.BlotterDataRows.length;
              that.succMsg = 'Data has been fetched successfully.';
              that.errorMsg = '';

              that.BlotterDataColumnHeader = [];
              that.apifunction.filterTable = []
              /*  for (const [key, value] of Object.entries(that.BlotterDataRows[0])) {
                  that.BlotterDataColumnHeader.push([`${key}`, false]);
                }
              */

              var headerObj =
                result.NewDataSet['xs:schema'][0]['xs:element'][0][
                'xs:complexType'
                ][0]['xs:choice'][0]['xs:element'][0]['xs:complexType'][0][
                'xs:sequence'
                ][0]['xs:element'];
                            headerObj.forEach((element) => {
                console.log(element);
                // console.log(element['$'].name.toUpperCase());
                if (
                  element['ATTR'].name.toUpperCase() !==
                  'ROWCount'.toUpperCase()
                ) {
                  that.BlotterDataColumnHeader.push([
                    element['ATTR'].name,
                    false,
                  ]);
                  that.apifunction.filterTable.push(
                    {
                      columnName: element['ATTR'].name,
                      filterTerm: ''

                    }
                  )
                }
              });
              console.log(
                'BlotterDataColumnHeader:',
                that.BlotterDataColumnHeader
              );
              console.log(
                'filterTable:',
                that.apifunction.filterTable
              );
              that.apifunction.setBlotterDataColumnHeader(
                that.BlotterDataColumnHeader
              );
              // that.BlotterDataColumnHeader.splice(that.BlotterDataColumnHeader.findIndex((item: string[]) => item[0] == 'ROWCount'), 1);
            }
            // })
          },
          (error) => {
            console.log('Error occured in fetching insertShare: ', error);
          }
        );
    } catch (error) {
      console.log(error);
    }
  }

  /*
  mapHeader(str: any) {
    try{
    if (this.metaDataResult && this.metaDataResult.length > 0) {

      var index = this.metaDataResult.findIndex(item => this.replaceChar(item.Blotter_Column) == this.replaceChar(str))
      if (index === -1) {
        return this.replaceChar(str);
      }
      else {
        return this.metaDataResult[index].Header;
      }
    }
  }
  catch (error) {
    console.log(error);
  }
  }

  replaceChar(str: any) {
    try {
      return (str.toString().replace(/_x0020_/g, ' '));
    } catch (error) {
      console.log(error);
    }
    
  }
*/
  getPageInfo(pageInfo: any) {
    try {
      this.noOfRecords = pageInfo.length;
      this.pageNo = pageInfo.pageIndex;
      this.pageSize = pageInfo.pageSize;
      this.pageFirstRecord = (this.pageNo - 1) * this.pageSize + 1;
      this.pageLastRecord =
        this.pageNo * this.pageSize >= this.noOfRecords
          ? this.noOfRecords
          : this.pageNo * this.pageSize;
    } catch (error) {
      console.log(error);
    }
  }

  prevBtnClicked() {
    try {
      if (this.pageNo > 1) {
        this.pageNo = this.pageNo - 1;
        this.setMPGData(true);

      }
    } catch (error) {
      console.log(error);
    }
  }

  nextBtnClicked() {
    try {

      this.pageNo = this.pageNo + 1;
      this.setMPGData(true);

    } catch (error) {
      console.log(error);
    }
  }

  onKeydownRowsPerPage(value: any) {
    try {
      console.log('Rows per page value : ' + value);
      this.pageSize = value;
      this.pageNo = 1;
      this.setMPGData();
    } catch (error) {
      console.log(error);
    }
  }

  onKeydownPageNo(value: any) {
    try {
      console.log('Page no value : ' + value);
      this.pageNo = value;
      this.setMPGData(true);

    } catch (error) {
      console.log(error);
    }
  }
  exportAsXLSX() {
    try {
      let exlBlotterDataRows = [];
      let BlotterDataRows = []
      this.apifunction.getAllDataForExportToExcel(
        this.selectedMPGitem,
        this.totalRecords,
        this.pageNo,
        this.datePipe.transform(new Date(), 'dd-MMM-yyyy'),
        // sessionStorage.getItem('Username'),
        AppConfig.settings.oRes.userName,
        // this.auth.EntityID
        AppConfig.settings.oRes.homeEntityID,
      ).subscribe(
        (result) => {
          if (result) {
            BlotterDataRows = result.NewDataSet.Table;
            BlotterDataRows.forEach((item) => {
              var item11 = {};
              for (const k in item) {
                item11[this.apifunction.mapHeader(k)] = item[k][0];
              }
              exlBlotterDataRows.push(item11);
            });
            console.log('exlBlotterDataRows exportAsXLSX ', exlBlotterDataRows)
            if(exlBlotterDataRows.length)
              this.excelService.exportAsExcelFile(exlBlotterDataRows, this.selectedMPGitem.BCM_long_name);

          } else {
            exlBlotterDataRows = [];
          }
          // this.exportAsXLSXOLD();
        }
      )
    
    } catch (error) {
      console.log(error);
    }
  }


  refreshData() {
    try {
      console.log('refresh Data');
      this.sTokenToSearch = '';
      // Added by Mitali D - 14-06-2023 - FIN1EURINT-422 - START
      this.showColFilter = false;
      this.colNo = null;
      // Added by Mitali D - 14-06-2023 - FIN1EURINT-422 - END
      this.apifunction.setFilterToggle.next(false);

      if (this.selectedMPGitem) {
        this.apifunction.setSelectedMPG(this.selectedMPGitem);
      }
    } catch (error) {
      console.log(error);
    }
  }

  onKeydownFilter() {
    try {
      console.log('sTokenToSearch');
      console.log(this.BlotterDataRows);
      console.log(this.apifunction.BlotterDataRowsCopy);
      this.BlotterDataRows = [];
      if (this.sTokenToSearch === '') {
        this.BlotterDataRows = this.BlotterDataRowsCopy;
      } else {
        var BlotterDataRows = this.BlotterDataRowsCopy;

        // this.apifunction.BlotterDataRowsCopy.filter(
        BlotterDataRows.filter((item) => {
          console.log(
            this.apifunction.replaceChar(JSON.stringify(item)).toUpperCase()
          );
          // if((JSON.stringify(item).indexOf("E155048I"))
          // if(JSON.stringify(item).includes("E155048I")){
          // if(JSON.stringify(item).includes("E155048I")){
          if (
            this.apifunction
              .replaceChar(JSON.stringify(item))
              .toUpperCase()
              .includes(this.sTokenToSearch.toUpperCase())
          ) {
            this.BlotterDataRows.push(item);
            // console.log(item);
            // this.BlotterDataRows.push(item)
          }
        });
      }
      console.log(this.BlotterDataRows);

      this.noOfRecords = this.BlotterDataRows.length;
    } catch (error) {
      console.log(error);
    }
  }
  toggleExpand() {
    console.log(this.expandedMPG);
    this.expandedMPG = !this.expandedMPG;
    console.log(this.expandedMPG);
    if (this.expandedMPG === false) {
      this.expandedChange.emit({ isMPG: true, isFilter: true, isMenu: true });
    } else {
      this.expandedChange.emit({ isMPG: true, isFilter: false, isMenu: false });
    }

    // console.log(this.expanded);
  }

  isNumeric(str: any) {
    if (!isNullOrUndefined(str)) {
      if (typeof str === 'string') {
        return !isNaN(parseFloat(str)) && !isNaN(parseFloat(str)) || !isNaN(parseFloat(str.replace(/,/g, '')))
      }
      else{
        return !isNaN(str) && !isNaN(parseFloat(str)) 
      }

    }
    return '-'
  }


  getRowlength(row) {
    return Object.keys(row).length
  }

  openColFilter(filterkey, header, colNo) {
    this.prevColName = this.colName
    this.colName = header;
    this.colNo = colNo
    if (this.colName === this.prevColName || this.prevColName === '') {
      this.showColFilter = !this.showColFilter;
    }

    if (!this.showColFilter) {
      this.colNo = null
    }

    this.filterkey = filterkey;

    // if(this.leftMenuExpanded){
    //   this.x = (event.clientX-275) + "px";
    // }
    // else{
    //   this.x = (event.clientX-350) + "px";
    // }

    // this.y = event.clientY  + "px";
  }

  transposeTable() {
    this.transpose = !this.transpose
    this.showColFilter = false
  }

  applyFilter(filteredData) {
    console.log('filtered event--', filteredData)
    this.BlotterDataRows = []
    this.BlotterDataRows = filteredData
    // this.showColFilter = false
  }

  isFilterActive(colName) {
    if (this.apifunction.filterActive.includes(colName)) {
      return true
    }
    return false
  }

   // Added by Mitali D - 14-06-2023 - FIN1EURINT-422 - START
  isDate(sDate) {  

    if(!isNullOrUndefined(sDate)){
      if(sDate.toString() == parseInt(sDate).toString()) return false; 
      let tryDate:any = new Date(sDate);
      return (tryDate && tryDate.toString() != "NaN" && tryDate != "Invalid Date");  
    }
    return false
  }
 // Added by Mitali D - 14-06-2023 - FIN1EURINT-422 - END

}
