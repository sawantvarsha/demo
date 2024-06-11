import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import * as _moment from 'moment';
const moment =  _moment;
import { ApifunctionService } from 'src/app/components/ucp/services/apifunction.service';
import { ExcelService } from 'src/app/components/ucp/services/UCPSharedControls/Controls/excel.service';
// import { User } from 'src/app/_models/user';
// import { AuthenticationService } from 'src/app/_services';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';

enum Status {
  Success = 1,
  Fail = 0
}

@Component({
  selector: 'app-ucp-package-schedule',
  templateUrl: './ucp-package-schedule.component.html',
  styleUrls: ['./ucp-package-schedule.component.css']
})
export class UcpPackageScheduleComponent implements OnInit {

  @Input() oUCPAppTablesData: any;
  @Input() sUCPMode: string;
  @Input() iTemplateID: string;
  @Input() entityId: string;
  @Input() iNoteMasterID: string;
  @Input() customStaticTabDetails: any[];
  @Output() GetPackageSchedule = new EventEmitter<any[]>();

  @ViewChild('fileUpload') fileUpload: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageSizeVal:number=10;
  loginId: string;
  // currentUser: User;
  scheduleLogic: string = "";
  ruleScheduleData: any[] = [];
  scheduleProgressYN: string = "";
  hideScheduleDiv: boolean = false;
  hideDetails: boolean = true;
  dsPackageSchedule: MatTableDataSource<any>;
  dsScheduleDetails: MatTableDataSource<any>;
  noOfFixings: number;
  packagedScheduleData: any[];
  detailedScheduleData: any[];
  displayedColumns: string[] = ['upS_Period', 'StartDate', 'EndDate', 'SettlementDate', 'upS_No_business_Days', 'select'];
  detailColumns: string[] = ['select', 'sR_No', 'Fixing', 'Settlement'];
  blnViewSchedule: boolean = true;
  oRuleSchedule_save: any[];
  oProdSchedule_save: any[];
  oUpdatePackageSchedule = [];
  oUpdatePackageRuleSchedule = [];
  
  lblErrorMsg: string = ""
  lblCount: string = ""
  loader: boolean = false;

  constructor(private api: ApifunctionService, private excelService: ExcelService,
    private _snackBar: MatSnackBar, private datePipe: DatePipe) {
    // authenticationService.currentUser.subscribe(x => this.currentUser = x);
     this.loginId = sessionStorage.getItem('FinIQUserID') ? sessionStorage.getItem('FinIQUserID') : 'Dealer1';
  }

  ngOnInit(): void {
    try{
      console.log("Inside package schedule component....");
      this.getScheduleLogic();
    }
    catch(e){
      console.log("Error in ngOnInit :", e)
    }
  }

  BindData() {
    try{
      this.lblErrorMsg = "";
      this.GetRuleSchedule();
    }
    catch(e){
      console.log("Error in BindData :", e)
    }
  }

  GetRuleSchedule() {
    var oEditedSchedule = [];
    //this.paginator.hidePageSize=true;
    try {
      this.loader = true;
      switch (this.sUCPMode) {
        case "UCPQEN":
          this.api.GetRuleSchedule(Number(this.iTemplateID), "Package Schedule", this.oUCPAppTablesData, false, oEditedSchedule, true, "", Number(this.entityId), this.sUCPMode, Number(this.iNoteMasterID), this.loginId).then(
            (response: any) => {
              if (response.status === Status.Success) {
                var res = response.response;
                if (res) {
                  this.ruleScheduleData = res;

                  this.CheckScheduleInsertionProgress();
                  if (this.ruleScheduleData.length > 0) {
                    this.GetPSDataTable();
                  }
                  this.loader = false;
                }
              } else {
                this.loader = false;
                this.lblErrorMsg = response.response;
              }
            }
          )
          break;
        default:
          if (this.scheduleLogic.toUpperCase() === "OLD") {
            this.loader = true;
            this.api.GetSchedule(Number(this.iNoteMasterID), "PACKAGESCHEDULE").then(
              (response: any) => {
                if (response.status === Status.Success) {
                  var res = response.response;
                  if (res) {
                    this.ruleScheduleData = res;

                    this.CheckScheduleInsertionProgress();
                    if (this.ruleScheduleData.length > 0) {
                      this.GetPSDataTable();
                    }
                    this.loader = false;
                  }
                } else {
                  this.loader = false;
                  this.lblErrorMsg = response.response;
                }
              }
            )
          } else {
            this.loader = true;
            this.api.GetProductSchedulefromDB(Number(this.iNoteMasterID)).then(
              (response: any) => {
                if (response.status === Status.Success) {
                  var res = response.response;
                  if (res) {
                    this.ruleScheduleData = res;
                    this.ruleScheduleData = this.ruleScheduleData.filter(c => c.pS_TSM_Code.toUpperCase() == 'PACKAGE SCHEDULE');
                    this.CheckScheduleInsertionProgress();
                    if (this.ruleScheduleData.length > 0) {
                      this.GetPSDataTable();
                    }
                    else {
                      this.lblErrorMsg = "No data found.";
                    }
                    this.loader = false;
                  }
                } else {
                  this.loader = false;
                  this.lblErrorMsg = response.response;
                }
              }
            )
          }
          break;
      }
    } catch (err) {
      console.error(err);
      this.loader = false;
    }
  }

  GetPSDataTable() {
    let dtData: any[] = [];
    try {
      this.dsPackageSchedule = new MatTableDataSource();
      switch (this.sUCPMode) {
        case "UCPQEN":
          dtData = this.createPSTable();

          dtData.map(a => {
            a.StartDate = { fieldName: "StartDate", value: a.upS_Period_Start_Date.toString(), readOnly: true },
              a.EndDate = { fieldName: "EndDate", value: a.upS_Period_End_Date.toString(), readOnly: true },
              a.SettlementDate = { fieldName: "SettlementDate", value: a.upS_Settlement_Date.toString(), readOnly: true }
          });

          this.CheckScheduleInsertionProgress();
          if (dtData.length > 0) {
            this.dsPackageSchedule.data = dtData;
          } else {
            this.dsPackageSchedule.data = [];
          }
          this.noOfFixings = this.ruleScheduleData.length;
          this.lblCount = "Total No of Bussiness Day(s): " + this.ruleScheduleData.length
          break;
        default:
          this.loader = true;
          this.api.GetExtendedPackageScheduleData(Number(this.iNoteMasterID)).then(
            (response: any) => {
              if (response.status === Status.Success) {
                var res = response.response;
                if (res) {
                  dtData = res;

                  dtData.map(a => {
                    a.StartDate = { fieldName: "StartDate", value: moment(a.upS_Period_Start_Date.toString()).format("DD-MMM-YYYY"), readOnly: true },
                      a.EndDate = { fieldName: "EndDate", value: moment(a.upS_Period_End_Date.toString()).format("DD-MMM-YYYY"), readOnly: true },
                      a.SettlementDate = { fieldName: "SettlementDate", value: moment(a.upS_Settlement_Date.toString()).format("DD-MMM-YYYY"), readOnly: true }
                  }); // Added by OnkarE

                  if (!this.CreatePSRowWise()) {
                    dtData = null;
                  }
                  this.CheckScheduleInsertionProgress();
                  if (dtData && dtData.length > 0) {
                    this.dsPackageSchedule.data = dtData;
                  } else {
                    this.dsPackageSchedule.data = [];
                  }
                  this.noOfFixings = this.ruleScheduleData.length;
                  this.lblCount = "Total No of Bussiness Day(s): " + this.ruleScheduleData.length
                }
              } else {
                this.loader = false;
                this.lblErrorMsg = response.response;
              }
            }
          )
          break;
      }
    } catch (err) {
      console.error(err);
      this.loader = false;
    }
  }

  CreatePSRowWise(): boolean {
    try{
      if (this.scheduleLogic.toUpperCase() === "OLD") {
        let settlementData = this.ruleScheduleData.map(a => moment(a.rS_Schedule_PreDate).format("DD-MM-YYYY HH:mm:ss")).filter((val, index, self) => self.indexOf(val) === index).sort((a, b) => a.localeCompare(b)); // Added by OnkarE
        for (let i = 0; i <= settlementData.length; i++) {
          if (this.detailedScheduleData && this.detailedScheduleData[i]) {
          } else {
            let schData = this.ruleScheduleData.filter(a => a.rS_Schedule_PreDate == settlementData[i]);
            if (schData.length > 0) {
              if (!this.detailedScheduleData) {
                this.detailedScheduleData = new Array();
              }
              schData.sort((a, b) => a.rS_Schedule_Date.localeCompare(b.rS_Schedule_Date));
              this.detailedScheduleData[i] = schData;
            }
          }
        }
        this.detailedScheduleData.map(nested => nested.map(a => {
          a.Fixing = { fieldName: "Fixing", value: a.rS_Schedule_Date.toString(), readOnly: true },
            a.Settlement = { fieldName: "Settlement", value: a.rS_Schedule_PreDate.toString(), readOnly: true }
        }));
      } else {
        let settlementData = this.ruleScheduleData.map(a => a.pS_Settlement_Date).filter((val, index, self) => self.indexOf(val) === index).sort((a, b) => {
          return  moment(a).diff(moment(b))
        });// Added by OnkarE
        for (let i = 0; i <= settlementData.length; i++) {
          if (this.detailedScheduleData && this.detailedScheduleData[i]) {
          } else {
            let schData = this.ruleScheduleData.filter(a => a.pS_Settlement_Date == settlementData[i]);
            if (schData.length > 0) {
              if (!this.detailedScheduleData) {
                this.detailedScheduleData = new Array();
              }
              schData.sort((a, b) => {return  moment(a).diff(moment(b))}); // Added by OnkarE
              this.detailedScheduleData[i] = schData;
            }
          }
        }
        this.detailedScheduleData.map(nested => nested.map(a => {
          a.Fixing = { fieldName: "Fixing", value: moment(a.pS_Fixing_Date.toString()).format("DD-MMM-YYYY"), readOnly: true },
            a.Settlement = { fieldName: "Settlement", value: moment(a.pS_Settlement_Date.toString()).format("DD-MMM-YYYY"), readOnly: true }
        })); // Added by OnkarE
      }
      return true;
    }
    catch(e){
      console.log("Error in CreatePSRowWise :", e)
    }
  }

  createPSTable(): any[] {
    try{
      this.packagedScheduleData = new Array();
      this.detailedScheduleData = new Array();
      var schData: any[] = [];

      if (this.scheduleLogic.toUpperCase() === "OLD") {
        let settlementData = this.ruleScheduleData.map(a => a.rS_Schedule_PreDate).filter((val, index, self) => self.indexOf(val) === index).sort((a, b) => a.localeCompare(b));
        settlementData.forEach(schedule => {
          schData = this.ruleScheduleData.filter(a => a.rS_Schedule_PreDate == schedule);
          if (schData.length > 0) {
            schData.sort((a, b) => a.rS_Schedule_Date.localeCompare(b.rS_Schedule_Date));
            this.detailedScheduleData[settlementData.indexOf(schedule)] = schData
            this.packagedScheduleData.push({
              upS_RM_ID: 0,
              upS_Period: this.packagedScheduleData.length + 1,
              upS_Period_Start_Date: schData[0].rS_Schedule_Date,
              upS_Period_End_Date: schData[schData.length - 1].rS_Schedule_Date,
              upS_Settlement_Date: schedule,
              upS_No_business_Days: schData.length
            })
          }
        });
        this.detailedScheduleData.map(nested => nested.map(a => {
          a.Fixing = { fieldName: "Fixing", value: a.rS_Schedule_Date.toString(), readOnly: true },
            a.Settlement = { fieldName: "Settlement", value: a.rS_Schedule_PreDate.toString(), readOnly: true }
        }));
      } else {
        let settlementData = this.ruleScheduleData.map(a => a.pS_Settlement_Date).filter((val, index, self) => self.indexOf(val) === index).sort((a, b) => {
          return  moment(a).diff(moment(b))
        });
        settlementData.forEach(schedule => {
          schData = this.ruleScheduleData.filter(a => a.pS_Settlement_Date == schedule);
          if (schData.length > 0) {
            schData.sort((a, b) => {return  moment(a.pS_Fixing_Date).diff(moment(b.pS_Fixing_Date))});
            this.detailedScheduleData[settlementData.indexOf(schedule)] = schData;
            this.packagedScheduleData.push({
              upS_RM_ID: 0,
              upS_Period: this.packagedScheduleData.length + 1,
              upS_Period_Start_Date: schData[0].pS_Fixing_Date,
              upS_Period_End_Date: schData[schData.length - 1].pS_Fixing_Date,
              upS_Settlement_Date: schedule,
              upS_No_business_Days: schData.length
            })
          }
        });
        this.detailedScheduleData.map(nested => nested.map(a => {
          a.Fixing = { fieldName: "Fixing", value: moment(a.pS_Fixing_Date.toString()).format("DD-MMM-YYYY"), readOnly: true },
            a.Settlement = { fieldName: "Settlement", value: moment(a.pS_Settlement_Date.toString()).format("DD-MMM-YYYY"), readOnly: true }
        }));
      }
      this.SetInwardValues();
      return this.packagedScheduleData;
    }
    catch(e){
      console.log("Error in createPSTable :", e)
    }
  }

  SetInwardValues() {
    try{
      let customDetailsForPackageSchedule: any[] = [];
      let oFieldDetails = [];
      if (this.customStaticTabDetails.length > 0) {
        customDetailsForPackageSchedule = this.customStaticTabDetails.filter(a => a.CT_TabId === "TPPACKAGESCHEDULE");
        if (customDetailsForPackageSchedule.length > 0) {
          oFieldDetails = JSON.parse(sessionStorage.getItem('oFieldDetails'));
          if (oFieldDetails) {
            customDetailsForPackageSchedule.forEach(customTab => {
              let udfField = customTab.CT_UCP_CloneInward;
              if (customTab.CT_Tab_Field_Name.toUpperCase() === "NO OF FIXING") {
                customTab.UCPFieldValue = this.noOfFixings;
                let position = oFieldDetails.findIndex(a => a.FieldName.toUpperCase() === udfField)
                if (position > -1) {
                  oFieldDetails[position].CurrentValue = this.noOfFixings;
                }
              }
            });
          }
          sessionStorage.removeItem('oFieldDetails');
          sessionStorage.setItem('oFieldDetails', JSON.stringify(oFieldDetails));
          this.GetPackageSchedule.emit(customDetailsForPackageSchedule);
        }
      }
    }
    catch(e){
      console.log("Error in SetInwardValues :", e)
    }
  }

  CheckScheduleInsertionProgress() {
    try {
      if (this.scheduleLogic.toUpperCase() === "OLD") {
        this.loader = true;
        this.api.RuleScheduleInsertStatus(Number(this.iNoteMasterID)).then(
          (response: any) => {
            if (response.status === Status.Success) {
              var res = response.response;
              if (res) {
                this.scheduleProgressYN = res;
                if (this.scheduleProgressYN.toUpperCase() === "Y") {
                  this.lblErrorMsg = "Schedule saving is in progress.Please refresh after some time."
                  this.hideScheduleDiv = true;
                } else {
                  this.lblErrorMsg = "";
                  this.hideScheduleDiv = false;
                }
              }
            } else {
              this.loader = false;
              this.lblErrorMsg = response.response;
            }
          }
        )
      }

    } catch (err) {
      console.error(err);
      this.loader = false;
    }
  }

  getScheduleLogic() {
    try {
      this.loader = true;
      this.api.GetScheduleLogicFlag(Number(this.iTemplateID)).then(
        (response: any) => {
          if (response.status === Status.Success) {
            var res = response.response;
            if (res) {
              this.scheduleLogic = res;
              this.loader = false;
            } else {
              this.scheduleLogic = "NEW";
              this.loader = false;
            }
          } else {
            this.loader = false;
            this.lblErrorMsg = response.response;
          }
          this.BindData();
        }
      )
    } catch (err) {
      console.error(err);
      this.loader = false;
    } finally { }
  }

  reload() {
    try{
      this.fileUpload.nativeElement.value = "";
      this.ruleScheduleData = [];
      this.packagedScheduleData = [];
      this.detailedScheduleData = [];
      this.blnViewSchedule = true;
      this.hideDetails = true;
      this.BindData();
    }
    catch(e){
      console.log("Error in reload :", e)
    }
  }

  viewScheduleForSelectPeriod(index: number) {
    try {
      this.lblErrorMsg = "";
      this.dsScheduleDetails = new MatTableDataSource();
      this.dsScheduleDetails.data = this.detailedScheduleData[index];
      this.dsScheduleDetails.data = this.dsScheduleDetails.data.sort((a, b) => {return  moment(a.pS_Fixing_Date).diff(moment(b.pS_Fixing_Date))}) // Added by OnkarE
      //this.dsScheduleDetails.paginator = this.paginator;
      this.hideDetails = false;
    } catch (err) {
      console.error(err);

    }
  }

  viewSchedules() {
    try {
      this.lblErrorMsg = "";
      this.dsScheduleDetails = new MatTableDataSource();
      this.dsScheduleDetails.data = [].concat(...this.detailedScheduleData);
      //this.dsScheduleDetails.paginator = this.paginator;
      this.blnViewSchedule = false;
      this.hideDetails = false;
    } catch (err) {
      console.error(err);
    }
  }

  hideSchedules() {
    try {
      this.lblErrorMsg = "";
      this.blnViewSchedule = true;
      this.hideDetails = true;
    } catch (err) {
      console.error(err);
    }
  }

  exportSummary() {
    try{
      let tempJSON: any[] = [];
      let exporJSON: any[] = [];
      tempJSON = this.dsPackageSchedule.data;

      tempJSON.forEach(item => {
        exporJSON.push({
          "Period": item.upS_Period,
          "Period Start Date": item.upS_Period_Start_Date,
          "Period End Date": item.upS_Period_End_Date,
          "Settlement Date": item.upS_Settlement_Date,
          "No of Business Days": item.upS_No_business_Days
        });
      });

      this.excelService.exportAsExcelFile(exporJSON, "Package_Schedule_Summary_" + moment(new Date()).format("DD-MM-YYYY HH:mm:ss"));
      this._snackBar.open("File exported successfully", "", {
        duration: 3000
      });
    }
    catch(e){
      console.log("Error in exportSummary :", e)
    }
  }

  exportAsXLSX() {
    try{
      let tempJSON: any[] = [];
      let exporJSON: any[] = [];
      tempJSON = [].concat(...this.detailedScheduleData);

      if (this.scheduleLogic.toUpperCase() === "OLD") {
        tempJSON.forEach(item => {
          exporJSON.push({
            "SrNo": exporJSON.length + 1,
            "Fixing": this.datePipe.transform(item.rS_Schedule_Date, "d-MMM-y"),
            "Settlement": this.datePipe.transform(item.rS_Schedule_PreDate, "d-MMM-y")
          });
        });
      } else {
        tempJSON.forEach(item => {
          exporJSON.push({
            "SrNo": exporJSON.length + 1,
            "Fixing": this.datePipe.transform(item.pS_Fixing_Date, "d-MMM-y"),
            "Settlement": this.datePipe.transform(item.pS_Settlement_Date, "d-MMM-y")
          });
        });
      }

      this.excelService.exportAsExcelFile(exporJSON, "Package_Schedule_Details");
      this._snackBar.open("File exported successfully", "", {
        duration: 3000
      });
    }
    catch(e){
      console.log("Error in exportAsXLSX :", e)
    }
  }

  save() {
    try {
      if (this.setPackageScheduleDataContract()) {
        this.loader = true;

        this.api.InsertPackageSchedule(this.iNoteMasterID ? Number(this.iNoteMasterID) : 0, JSON.stringify(this.oUpdatePackageSchedule), this.loginId, JSON.stringify(this.oRuleSchedule_save), "UPDATE", JSON.stringify(this.oProdSchedule_save), this.scheduleLogic).then(
          (response: any) => {
            if (response.status === Status.Success) {
              let res = response.response;
              if (res) {
                this.lblErrorMsg = "Package schedule saved successfully."
                this.reload();
                this.SetInwardValues();
                this.hideDetails = false;
                this.loader = false;
              } else {
                this.lblErrorMsg = "Package schedule not saved."
                this.loader = false;
              }
            } else {
              this.loader = false;
            }
          }
        )
      }
    } catch (err) {
      console.error(err);
      this.loader = false;
    }
  }

  setPackageScheduleDataContract(): boolean {
    try{
      let dtPackagedSchedule = [];
      dtPackagedSchedule = this.dsPackageSchedule.data;
      this.oUpdatePackageSchedule = new Array();
      this.oUpdatePackageRuleSchedule = new Array();
      this.oProdSchedule_save = [];
      dtPackagedSchedule.forEach(element => {
        this.oUpdatePackageSchedule.push({
          UPS_RM_ID: 0,
          UPS_Period: element.upS_Period,
          UPS_Period_Start_Date: element.upS_Period_Start_Date,
          UPS_Period_End_Date: element.upS_Period_End_Date,
          UPS_Settlement_Date: element.upS_Settlement_Date,
          UPS_No_business_Days: element.upS_No_business_Days
        });
        this.oUpdatePackageRuleSchedule.push({
          Rule_Id: 0,
          Period: element.upS_Period,
          Period_Start_Date: element.upS_Period_Start_Date,
          Period_End_Date: element.upS_Period_End_Date,
          Settlement_Date: element.upS_Settlement_Date,
          No_of_Bussiness_Days: element.upS_No_business_Days
        });
        this.CreateScheduleDataContract(dtPackagedSchedule.indexOf(element));
      });
      return true;
    }
    catch(e){
      console.log("Error in setPackageScheduleDataContract :", e)
    }
  }

  CreateScheduleDataContract(index: number) {
    try{
      let dtDetailSchedule = this.detailedScheduleData[index];
      if (dtDetailSchedule.length > 0) {
        if (this.scheduleLogic.toUpperCase() === "OLD") {
          if (!this.oRuleSchedule_save) {
            this.oRuleSchedule_save = new Array();
            this.oRuleSchedule_save = [];
          }
          dtDetailSchedule.forEach(sch => {
            this.oRuleSchedule_save.push({
              // RS_Active_YN
              // Sr_No
              // RS_Exclude_YN
              // RS_Status
              // RS_Schedule_start_date
              // RM_RMDSRC_ID
              // User_Facing_event
              // AccrualDays

              rS_Schedule_Date: sch.rS_Schedule_Date,
              rS_Schedule_PreDate: sch.rS_Schedule_PreDate,
              rS_Accrual_EndDate: sch.rS_Accrual_EndDate,
              rS_Accrual_StartDate: sch.rS_Accrual_StartDate,
              rS_RM_ID: sch.rS_RM_ID,
              rM_Action_Class: sch.rM_Action_Class,
              rM_Description: sch.rM_Description,
              rS_Message_Format: sch.rS_Message_Format,
              rM_Frequency: sch.rM_Frequency,
              rM_Misc2: sch.rM_Misc2,
              rM_Seq_No: sch.rM_Seq_No,
              rS_Id: sch.rS_Id
            });
          });
        } else {
          if (!this.oProdSchedule_save) {
            this.oProdSchedule_save = new Array();
          }
          dtDetailSchedule.forEach(sch => {
            this.oProdSchedule_save.push({
              pS_Fixing_Date: sch.pS_Fixing_Date,
              pS_Settlement_Date: sch.pS_Settlement_Date,
              pS_Accrual_EndDate: sch.pS_Accrual_EndDate,
              pS_Accrual_StartDate: sch.pS_Accrual_StartDate,
              pS_TSM_Id: sch.pS_TSM_Id,
              pS_NM_Id: sch.pS_NM_Id,
              pS_Status: sch.pS_Status,
              pS_Message_Format: sch.pS_Message_Format,
              pS_Active_YN: sch.pS_Active_YN,
              pS_Misc2: sch.pS_Misc2,
              pS_TSM_Code: sch.pS_TSM_Code,
              pS_Id: sch.pS_Id,
              pS_Misc3: sch.pS_Misc3,
              pS_Remark: sch.pS_Remark,
              pS_Created_AT: sch.pS_Created_AT,
              pS_Created_By: sch.pS_Created_By,
              pS_Updated_AT: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"), 
              pS_Updated_By: this.loginId,
              pS_Misc1: sch.pS_Misc1
            });
          });
        }
      }
    }
    catch(e){
      console.log("Error in setPackageScheduleDataContract :", e)
    }
  }

  onImportClick(event) {
    try {
      let data;
      const target: DataTransfer = <DataTransfer>(event.target);
      let isExceclFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
      if (target.files.length > 1) {
        this.fileUpload.nativeElement.value = '';
      }
      if (isExceclFile) {
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

          const wsName: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsName];

          data = XLSX.utils.sheet_to_json(ws);
        };
        reader.readAsBinaryString(target.files[0]);

        reader.onloadend = (e) => {
          console.log("Import data: ", data, e);;
          if (data.length <= 0) {
            this._snackBar.open("Import file is blank.", "", {
              duration: 5000
            });
            return false;
          }

          this.readAsJson(data);
        }
      } else {
        this.fileUpload.nativeElement.value = '';
        this._snackBar.open("Import file is not in correct format.", "", {
          duration: 5000
        });
        return false;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async readAsJson(data: any[]) {
    try {
      let tempJSON = [], importJSON = [];
      let dtData: any[] = [];
      let packageSchedules = this.dsPackageSchedule.data;
      let oldElement = [].concat(...this.detailedScheduleData)[0];
      let formattedSettlementDates = packageSchedules.map(a => this.datePipe.transform(a.upS_Settlement_Date, "d-MMM-y"));
      let settlementDates = packageSchedules.map(a => a.upS_Settlement_Date)
      data = data.filter(a => formattedSettlementDates.includes(a.Settlement));

      for (let i = 0; i < data.length; i++) {
        if (data[i].Fixing == "" || data[i].Settlement == "") {
          this.lblErrorMsg = "Date format not supported. Please check and try again.";
          break;
        }
        if (this.scheduleLogic.toUpperCase() === "OLD") {
          tempJSON.push({

            rS_Schedule_Date: new Date(new Date(data[i].Fixing).setDate(new Date(data[i].Fixing).getDate() + 1)).toJSON().slice(0, -13).concat("00:00:00"),
            rS_Schedule_PreDate: settlementDates[formattedSettlementDates.findIndex(a => a === data[i].Settlement)],
            rS_Accrual_EndDate: oldElement.rS_Accrual_EndDate,
            rS_Accrual_StartDate: oldElement.rS_Accrual_StartDate,
            rS_RM_ID: oldElement.rS_RM_ID,
            rM_Action_Class: oldElement.rM_Action_Class,
            rM_Description: oldElement.rM_Description,
            rS_Message_Format: oldElement.rS_Message_Format,
            rM_Frequency: oldElement.rM_Frequency,
            rM_Misc2: oldElement.rM_Misc2,
            rM_Seq_No: oldElement.rM_Seq_No,
            rS_Id: oldElement.rS_Id
          })
        } else {
          tempJSON.push({
            pS_Fixing_Date: new Date(new Date(data[i].Fixing).setDate(new Date(data[i].Fixing).getDate() + 1)).toJSON().slice(0, -13).concat("00:00:00"),
            pS_Settlement_Date: settlementDates[formattedSettlementDates.findIndex(a => a === data[i].Settlement)],
            pS_Accrual_EndDate: oldElement.pS_Accrual_EndDate,
            pS_Accrual_StartDate: oldElement.pS_Accrual_StartDate,
            pS_Active_YN: oldElement.pS_Active_YN,
            pS_Id: 0,
            pS_NM_Id: oldElement.pS_NM_Id,
            pS_TSM_Code: oldElement.pS_TSM_Code,
            pS_TSM_Id: oldElement.pS_TSM_Id,
            pS_Created_By: this.loginId,
            pS_Created_AT: new Date(Date.now()).toDateString(),
            pS_Message_Format: oldElement.pS_Message_Format,
            pS_Misc1: oldElement.pS_Misc1,
            pS_Misc2: oldElement.pS_Misc2,
            pS_Misc3: oldElement.pS_Misc3,
            pS_Remark: oldElement.pS_Remark,
            pS_Status: oldElement.pS_Status
          })
        }
      };

      if (tempJSON.length == data.length) {
        importJSON = tempJSON;
        if (this.scheduleLogic.toUpperCase() === "OLD") {
          importJSON.map(a => {
            a.Fixing = { fieldName: "Fixing", value: a.rS_Schedule_Date.toString(), readOnly: true },
              a.Settlement = { fieldName: "Settlement", value: a.rS_Schedule_PreDate.toString(), readOnly: true }
          });
        } else {
          importJSON.map(a => {
            a.Fixing = { fieldName: "Fixing", value: a.pS_Fixing_Date.toString(), readOnly: true },
              a.Settlement = { fieldName: "Settlement", value: a.pS_Settlement_Date.toString(), readOnly: true }
          });
        }
        console.log("Import JSON: ", importJSON);
        let oldLength = this.ruleScheduleData.length;
        this.ruleScheduleData = this.ruleScheduleData.concat(...importJSON);
        if (this.scheduleLogic.toUpperCase() == "OLD") {
          this.ruleScheduleData = this.ruleScheduleData.filter(function (a) {
            if (!this[a.rS_Schedule_Date]) {
              this[a.rS_Schedule_Date] = true;
              return true;
            }
            return false;
          }, Object.create(null));
        } else {
          this.ruleScheduleData = this.ruleScheduleData.filter(function (a) {
            if (!this[a.pS_Fixing_Date]) {
              this[a.pS_Fixing_Date] = true;
              return true;
            }
            return false;
          }, Object.create(null));
        }
        if (this.ruleScheduleData.length !== oldLength) {
          dtData = this.createPSTable();
          dtData.map(a => {
            a.StartDate = { fieldName: "StartDate", value: a.upS_Period_Start_Date.toString(), readOnly: true },
              a.EndDate = { fieldName: "EndDate", value: a.upS_Period_End_Date.toString(), readOnly: true },
              a.SettlementDate = { fieldName: "SettlementDate", value: a.upS_Settlement_Date.toString(), readOnly: true }
          });
          this.dsPackageSchedule.data = dtData;
          this.noOfFixings = this.ruleScheduleData.length;
          this.lblCount = "Total No of Bussiness Day(s): " + this.ruleScheduleData.length;
        } else {
          this.lblErrorMsg = "No data to import for current periods";
        }
      } else {
        this.lblErrorMsg = "No data to import for current periods";
      }
    } catch (err) {
      console.error(err);
    }
  }

  deleteRecord(element: any) {
    try{
      if (this.scheduleLogic.toUpperCase() === "OLD") {
        this.ruleScheduleData = this.ruleScheduleData.filter(a => a.rS_Schedule_PreDate !== element.rS_Schedule_PreDate || a.rS_Schedule_Date !== element.rS_Schedule_Date);
      } else {
        this.ruleScheduleData = this.ruleScheduleData.filter(a => a.pS_Settlement_Date !== element.pS_Settlement_Date || a.pS_Fixing_Date !== element.pS_Fixing_Date);
      }
      let dtData: any[] = [];
      if (this.ruleScheduleData.length > 0) {
        dtData = this.createPSTable();
        dtData.map(a => {
          a.StartDate = { fieldName: "StartDate", value: moment(a.upS_Period_Start_Date.toString()).format("DD-MMM-YYYY"), readOnly: true },
            a.EndDate = { fieldName: "EndDate", value: moment(a.upS_Period_End_Date.toString()).format("DD-MMM-YYYY"), readOnly: true },
            a.SettlementDate = { fieldName: "SettlementDate", value: moment(a.upS_Settlement_Date.toString()).format("DD-MMM-YYYY"), readOnly: true }
        }); // Added by OnkarE
        this.dsPackageSchedule.data = dtData;
        this.noOfFixings = this.ruleScheduleData.length;
        this.lblCount = "Total No of Bussiness Day(s): " + this.ruleScheduleData.length;

        let period = this.scheduleLogic.toUpperCase() === "OLD" ? dtData.findIndex(a => a.rS_Schedule_PreDate == element.rS_Schedule_PreDate) : dtData.findIndex(a => a.upS_Settlement_Date == element.pS_Settlement_Date);
        if (this.blnViewSchedule) {
          this.viewScheduleForSelectPeriod(period);
        } else {
          this.viewSchedules();
        }

      }
    }
    catch(e){
      console.log("Error in deleteRecord :", e)
    }
  }

  rowsperpage(rows: number) {
    try{
      if (rows.toString() != "") {
        this.dsPackageSchedule.paginator.pageSize = rows;
        this.paginator._changePageSize(this.dsPackageSchedule.paginator.pageSize);
      }
    }
    catch(e){
      console.log("Error in rowsperpage :", e)
    }
  }

}


