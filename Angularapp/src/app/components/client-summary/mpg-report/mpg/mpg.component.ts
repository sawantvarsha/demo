import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import * as _moment from 'moment';
import { WorkflowApiService } from '../../../../services/workflow-api.service';

import { PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-mpg',
  templateUrl: './mpg.component.html',
  styleUrls: ['./mpg.component.scss'],
  providers: [DatePipe],
})
export class MpgComponent implements OnInit {
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

  // metaDataResult = [];

  constructor(
    private apifunction: WorkflowApiService,
    private datePipe: DatePipe,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.expandedMPG = false;
    try {
      console.log('ngOnInit');

      this.apifunction.selectedMPGObserver.subscribe((res: any) => {
        this.currDate = new Date();
        this.apifunction.metaDataResult = [];
        this.sTokenToSearch = '';
        if (res) {
          // console.log(res);
          // console.log(this.apifunction.BlotterItems);
          // console.log(this.apifunction.BlotterItems.length);
          if (this.apifunction.BlotterItems.length > 0) {
            this.selectedMPGitem = res;
            // BCM_ID: 10207
            // BCM_long_name: "Asset Allocation Gap by Portfolio"
            // this.currDate = new Date();
            // this.fillGridMetaData();
            // console.log('b4 setMPGData')
            // console.log(this.selectedMPGitem);
            // console.log(this.selectedMPGitem.length());
            // console.log(this.selectedMPGitem == {});
            // console.log(this.selectedMPGitem !== {});
            // if(this.selectedMPGitem && this.selectedMPGitem !== {}){
            // console.log( this.selectedMPGitem);
            // console.log(this.selectedMPGitem && (this.selectedMPGitem.length>0 || this.selectedMPGitem.BCM_ID !==''));
            // console.log(this.selectedMPGitem.length>0 || this.selectedMPGitem.BCM_ID !=='');
            // console.log(this.selectedMPGitem.length>0);
            // console.log(this.selectedMPGitem.BCM_ID !=='');
            // console.log(this.selectedMPGitem.BCM_ID);
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
          // console.log(data);
          this.apifunction.metaDataResult = data.Fill_Grid_Meta_DataResult;
          console.log(this.apifunction.metaDataResult);

          // this.apifunction.metaDataResult = data.Fill_Grid_Meta_DataResult;
        });
    } catch (error) {
      console.log(error);
    }
  }
  setMPGData() {
    try {
      // console.log('setMPGData');
      this.BlotterDataRows = [];
      this.BlotterDataRowsCopy = [];
      this.isLoader = true;
      const that = this;

      var date1 = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
      this.pageNo = 1;
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
          sessionStorage.getItem('Username'),
          this.auth.EntityID
        )
        .subscribe(
          (result) => {
            // parseString(data['fillGrid_AllTemplate_UsingSP_GenResult'], function ( result: any) {

            console.log(result);
            this.isLoader = false;

            if (result) {
              that.apifunction.getDataForExportToExcel(result.NewDataSet.Table);

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
                }
              });
              console.log(
                'BlotterDataColumnHeader:',
                that.BlotterDataColumnHeader
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
        this.pageFirstRecord = (this.pageNo - 1) * this.pageSize + 1;

        this.pageLastRecord =
          this.pageNo * this.pageSize >= this.noOfRecords
            ? this.noOfRecords
            : this.pageNo * this.pageSize;
      }
    } catch (error) {
      console.log(error);
    }
  }

  nextBtnClicked() {
    try {
      var noOfPages =
        this.noOfRecords % this.pageSize == 0
          ? this.noOfRecords / this.pageSize
          : this.noOfRecords / this.pageSize + 1;
      if (this.pageNo + 1 > 0 && this.pageNo + 1 <= noOfPages) {
        this.pageNo = this.pageNo + 1;
        this.pageFirstRecord = (this.pageNo - 1) * this.pageSize + 1;
        this.pageLastRecord =
          this.pageNo * this.pageSize >= this.noOfRecords
            ? this.noOfRecords
            : this.pageNo * this.pageSize;
      }
    } catch (error) {
      console.log(error);
    }
  }

  onKeydownRowsPerPage(value: any) {
    try {
      console.log('Rows per page value : ' + value);
      this.pageSize = value;

      this.pageNo = 1;
      this.pageFirstRecord = (this.pageNo - 1) * this.pageSize + 1;
      this.pageLastRecord = this.pageSize;
    } catch (error) {
      console.log(error);
    }
  }

  onKeydownPageNo(value: any) {
    try {
      console.log('Page no value : ' + value);
      var noOfPages =
        this.noOfRecords % this.pageSize == 0
          ? this.noOfRecords / this.pageSize
          : this.noOfRecords / this.pageSize + 1;
      if (this.pageNo > 0 && this.pageNo <= noOfPages) {
        this.pageNo = value;
        this.pageFirstRecord = (this.pageNo - 1) * this.pageSize + 1;
        this.pageLastRecord =
          this.pageNo * this.pageSize >= this.noOfRecords
            ? this.noOfRecords
            : this.pageNo * this.pageSize;
      }
    } catch (error) {
      console.log(error);
    }
  }
  exportAsXLSX() {
    try {
      // console.log(this.BlotterDataRows[0]);
      // console.log(Object.keys(this.BlotterDataRows[0]));

      // console.log(keys);
      // console.log(this.mapHeader(keys[0]));

      var exlBlotterDataRows = []; // this.BlotterDataRows;

      // this.BlotterDataRows.forEach(item=>{
      //   console.log(item);
      //   for (const k in item) {
      //     console.log(k);
      //     console.log(this.mapHeader(k));
      //       item[this.mapHeader(k)] = item[k];
      //       delete item[k];
      // }
      // });

      this.BlotterDataRows.forEach((item) => {
        // console.log(item);
        var item11 = {};
        for (const k in item) {
          // console.log(k);
          // console.log(this.mapHeader(k));
          // item
          // item11.push({ this.mapHeader(k) , item[k]})
          // item11[this.mapHeader(k)] = item[k]
          item11[this.apifunction.mapHeader(k)] = item[k];
          // if (k === "name") {
        }
        exlBlotterDataRows.push(item11);
      });

      // console.log(exlBlotterDataRows[0]);
      // console.log(this.BlotterDataRows[0]);
      // var index = this.metaDataResult.findIndex(item => this.replaceChar(item.Blotter_Column) == this.replaceChar(str))

      // this.excelService.exportAsExcelFile(this.BlotterDataRows, this.selectedMPGitem.BCM_long_name);

      // this.excelService.exportAsExcelFile(exlBlotterDataRows, this.selectedMPGitem.BCM_long_name);
    } catch (error) {
      console.log(error);
    }
  }

  refreshData() {
    try {
      console.log('refresh Data');
      this.sTokenToSearch = '';
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
}
