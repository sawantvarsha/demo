import { Component, OnInit, Inject, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
//import { AutocompleteService } from '../../../../Services/UCP/LayoutDesignControls/autocomplete.service';
import { isNullOrUndefined } from 'util';
import { NgForm } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../../../_services';
import { User } from '../../../../_models/user';
import { WorkflowService } from '../../../../Services/Workflow/workflow.service';
import { AutocompleteService } from 'src/app/Services/UCP/LayoutDesignControls/autocomplete.service';
//import { AuthenticationService } from '../../../_services';
//import { User } from '../../../_models/user';
@Component({
  selector: 'app-frm-all-tab-name-list',
  templateUrl: './frm-all-tab-name-list.component.html',
  styleUrls: ['./frm-all-tab-name-list.component.css'],
})
export class FrmAllTabNameListComponent implements OnInit {

  //Prpoerties of Session of .net code
  currentUser: User;
  popupParent: string;
  selectedTabName: string;
  CGMParam: string;
  selectedWFL: string;
  wflTemplateId: string;

  lblCustGrid: string;
  allFieldsSelected: boolean;
  selectedFieldNames: any[];
  bkp_selectedFieldNames: any[];
  fieldNameData: any[];
  oldFieldNames: any[];
  oldSelectedTabs: string;
  workflowData: any[];
  wflButtonData: any[];
  workflow: any; //edited by RajeshC
  isSelectedTabCGM: boolean;
  isWFL: boolean;
  isSelectedTab: boolean;
  searchText: string;
  isMappedUserGroup: boolean;
  MappedUserGroupData: any[];
  isVisibilityMap: boolean;
  visibilityMapData: any[];
  isUserMappedWF:boolean;
  isUserMappedDesigner: boolean;
  isUserMappedMetaData: boolean;
  MapperUserGrpWF:any[];
  MapperUserGrpWFDesigner:any[];
  MapperUserGrpMetaData:any[];
  UnselectedFieldName:any[];
  queueId:any;
  metadataQid: any;
  SaveTemp:any[]=[];
  DB_Check_Duplicate:boolean;
  Entity_Id: any;
  Login_Id: any;
  selectedHedging:any;
  @ViewChild('allTabNameForm') allTabNameForm: NgForm;

  constructor(@Inject(MAT_DIALOG_DATA) data, private _autodata: AutocompleteService,private _autodataWF: WorkflowService,private authenticationService: AuthenticationService,//private authenticationService: AuthenticationService,  
    private dialogRef: MatDialogRef<FrmAllTabNameListComponent>, private _snackBar: MatSnackBar) {
    this.popupParent = data.popupParent;
    this.selectedTabName = data.selectedTabName;
    this.CGMParam = data.CGMParam;
    this.selectedWFL = data.selectedWFL;
    this.wflTemplateId = data.wflTemplateId;
    this.queueId = data.queueId;
    this.metadataQid = data.metadataQid;
     this.authenticationService.currentUser.subscribe(x => this.currentUser = x);   
    this.Login_Id =  this.currentUser.userName;
    this.Entity_Id = 4;
   // this.Login_Id="Alolikag";
  }

  ngOnInit(): void {
    this.selectedHedging = "All";
    this.allFieldsSelected = false;
    this.searchText = "";
    this.selectedFieldNames = [];
    this.bkp_selectedFieldNames = [];
    if (this.popupParent === "SelectTabCGM") {
      this.lblCustGrid = "Selected fields will be invisible";
      this.oldSelectedTabs = this.selectedTabName;
      this.fillTabMasterGrid();
    } else if (this.popupParent === "SelectWFL") {
      if (this.selectedWFL === null || this.selectedWFL === undefined) {
        this.selectedWFL = "";
      }
      this.oldSelectedTabs = this.selectedWFL;
      this.workflow = "All";
      this.fillWorkflowDdl();
      this.fillWFLButtons();
    } else if (this.popupParent === "SelectTab") {
      this.fillTabMaster();
    }
    else if (this.popupParent === "MappedUserGroups") {
      this.FillMappedUserGroups();
    }
    else if (this.popupParent === "SelectVisibilityMap") {
      this.FillVisibiltyMap();
    }
    else if (this.popupParent === "UserPermission") {    
     
      this.FillUserMap();
    }
    else if(this.popupParent === "QM_Permission") {
      this.FillDesignerUserMap();
    }
    else if(this.popupParent === "UserPermissionMD") {
      this.FillMetaDataUserMap();
    }
  }

  //From Tab Mapping
  fillTabMaster() {
    var strTabName: any[];
    this.isSelectedTab = true;
    if (this.selectedTabName !== "") {
      strTabName = this.selectedTabName.split(",");
    }

    const tnPromise = this._autodata.Get_TabMasterDetails().toPromise();
    tnPromise.then(dt => {
      if (dt && !isNullOrUndefined(dt.Get_TabMasterDetailsResult)) {
        this.oldFieldNames = this.fieldNameData = dt.Get_TabMasterDetailsResult;
        if (this.fieldNameData[0].Field_Name.trim() === "") {
          this.oldFieldNames = this.fieldNameData = this.fieldNameData.slice(1);
        }

        if (strTabName) {
          strTabName.forEach(tab => {
            if (tab) {
              if (this.fieldNameData.filter(x => x.Display_Name.toUpperCase() === tab.toUpperCase()).length > 0) {
                this.selectedFieldNames.push(this.fieldNameData.filter(x => x.Display_Name.toUpperCase() === tab.toUpperCase())[0].Field_Name);
              }
            }
          });
          this.bkp_selectedFieldNames = this.selectedFieldNames;
        }
      }
    })
  }

  //From Function Definition
  fillWorkflowDdl() {
    this.isWFL = true;
    const wflPromise = this._autodata.Get_Worflow(this.wflTemplateId).toPromise();
    wflPromise.then(dt => {
      if (dt && !isNullOrUndefined(dt.Get_WorflowResult)) {
        this.workflowData = dt.Get_WorflowResult;
        console.log("WorkflowData",this.workflowData );
        this.workflow = "All";
      }
    });
  }

  fillWFLButtons() {
    var strTabName = [];
    if (this.selectedWFL.length > 0) {
      this.selectedWFL = this.selectedWFL[0] === "," ? this.selectedWFL.slice(1) : this.selectedWFL;
      this.selectedWFL = this.selectedWFL.slice(-1) === "," ? this.selectedWFL.slice(0, -1) : this.selectedWFL;
      strTabName = this.selectedWFL.split(",");
    }

    const wflButtonPromise = this._autodata.GetFillWFLButton(this.wflTemplateId).toPromise();
    wflButtonPromise.then(dt => {
      if (dt && !isNullOrUndefined(dt.GetFillWFLButtonResult)) {
        this.wflButtonData = dt.GetFillWFLButtonResult;
      }
      this.oldFieldNames = this.fieldNameData = this.wflButtonData.map(x => { return x.DisplayName; });//Added by RajeshC
      if (this.fieldNameData.length > 0) {
        if (strTabName) {
          this.selectedFieldNames = [];
          strTabName.forEach(tab => {
            if (this.fieldNameData.filter(x => x.toUpperCase() === tab.toUpperCase()).length > 0) {
              this.selectedFieldNames.push(tab);
            }
          });
          this.bkp_selectedFieldNames = this.selectedFieldNames;
        }
      }
    });
  }
//Added by RajeshC
  wflType_SelectionChange(): void {
    if (this.workflow !== undefined && this.workflow !== 0) {
      console.log("Workflow is:::: ", this.wflButtonData, this.workflow, this.fieldNameData)
      if (this.wflButtonData.filter(x => x.WB_Workflow_Type_ID == this.workflow).length > 0) {
        this.oldFieldNames = this.fieldNameData = this.wflButtonData.filter(x => x.WB_Workflow_Type_ID == this.workflow).map(x => { return x.DisplayName; });
        // this.oldFieldNames = this.fieldNameData = this.wflButtonData.filter(x => x.WT_Hedging_Type == "Product").map(x => { return x.DisplayName; });
      } else {
        this.oldFieldNames = this.fieldNameData = this.wflButtonData.map(x => { return x.DisplayName; });
      }
    } else {
      this.oldFieldNames = this.fieldNameData = this.wflButtonData.map(x => { return x.DisplayName; });
    }
  }
  hedgingTypeChange(): void {
    debugger;
    console.log("selectedHedging",this.selectedHedging);
    if (this.wflButtonData.filter(x => x.WT_Hedging_Type == this.selectedHedging).length > 0) {
        this.oldFieldNames = this.fieldNameData = this.oldFieldNames.filter(x => x.WT_Hedging_Type == this.selectedHedging).map(x => { return x.DisplayName; });
      } 
    else {
        this.oldFieldNames = this.fieldNameData = [];
      }
  }
  //Intersection for Workflow and Dropdown filter
  // <!-- Changed by RajeshC18-01 -->
  wflhedge_typechange(): void {
    debugger;
    if (this.workflow !== undefined && this.workflow != "All") {
      if (this.wflButtonData.filter(x => x.WB_Workflow_Type_Code == this.workflow).length > 0) {
        this.oldFieldNames = this.fieldNameData = this.wflButtonData.filter(x => x.WB_Workflow_Type_Code == this.workflow).map(x => { return x.DisplayName; });  
        if(this.selectedHedging != "All"){
          if(this.wflButtonData.filter(x => x.WB_Workflow_Type_Code == this.workflow && x.WT_Hedging_Type == this.selectedHedging ).length > 0){
          //this.oldFieldNames = this.fieldNameData = this.oldFieldNames.filter(x => x.WT_Hedging_Type == this.selectedHedging).map(x => { return x.DisplayName; });
          this.oldFieldNames = this.fieldNameData = this.wflButtonData.filter(x => x.WB_Workflow_Type_Code == this.workflow && x.WT_Hedging_Type == this.selectedHedging ).map(x => { return x.DisplayName; });
        }
          else {
            this.oldFieldNames = this.fieldNameData = [];
          }
        }
      }
      else{
        this.oldFieldNames = this.fieldNameData = this.wflButtonData.map(x => { return x.DisplayName; });
      }
    }
    else{
      if (this.wflButtonData.filter(x => x.WT_Hedging_Type == this.selectedHedging).length > 0) {
        this.oldFieldNames = this.fieldNameData = this.wflButtonData.filter(x => x.WT_Hedging_Type == this.selectedHedging).map(x => { return x.DisplayName; });
      } 
      else {
        this.oldFieldNames = this.fieldNameData = [];
      }
    }
    if(this.workflow == "All" && this.selectedHedging == "All"){
      this.oldFieldNames = this.fieldNameData = this.wflButtonData.map(x => { return x.DisplayName; });
    }
  }

  //From Customer Grid Mapping
  fillTabMasterGrid() {
    var [templateId, gridType] = this.CGMParam.split(" - ");
    var strTabNameList: any[];
    var strArrSeq: any[];
    this.isSelectedTabCGM = true;

    if (this.selectedTabName.includes(";")) {
      strTabNameList = this.selectedTabName.split(";");
      strTabNameList.forEach(tab => {
        strArrSeq.push(tab.split(":")[0]);
      });
    } else {
      if (!isNullOrUndefined(this.selectedTabName)) {
        strTabNameList = this.selectedTabName.split(",");
      }
    }

    if (gridType.toUpperCase().trim() !== "COLUMN SEQUENCE") {
      const fieldPromise = this._autodata.GetIntersectionFieldsForCustGridMpping(templateId.trim(), gridType.trim(), "CustomerGrid").toPromise();
      fieldPromise.then(dt => {
        if (dt && !isNullOrUndefined(dt.GetIntersectionFieldsForCustGridMppingResult)) {
          this.oldFieldNames = this.fieldNameData = dt.GetIntersectionFieldsForCustGridMppingResult;
        }
        if (strTabNameList) {
          strTabNameList.forEach(tab => {
            var filterRes;
            if (tab) {
              filterRes = this.fieldNameData.filter(f => f.Field_Name.toUpperCase() === tab.toUpperCase());
            }
            if (filterRes) {
              this.selectedFieldNames.push(filterRes[0].Field_Name);
            }
          });
          this.bkp_selectedFieldNames = this.selectedFieldNames;
        }
      })
    } else {
      const fieldPromise = this._autodata.GetUDFFieldSeq(templateId).toPromise();
      fieldPromise.then(dt => {
        if (dt && !isNullOrUndefined(dt.GetUDFFieldSeqResult)) {
          this.fieldNameData = dt.GetUDFFieldSeqResult;
        }

        if (this.selectedTabName.includes(";") && !isNullOrUndefined(strArrSeq)) {
          this.fieldNameData.forEach(element => {
            element.Display_Name = element.UCIF_Display_Name;
            delete element.UCIF_Display_Name;
            element.Field_Name = element.UCIF_Field_Name;
            delete element.UCIF_Field_Name;

            if (strArrSeq.includes(element.Field_Name)) {
              this.selectedFieldNames.push(element.Field_Name);
            }
          });
          this.bkp_selectedFieldNames = this.selectedFieldNames;
        } else {
          if (!isNullOrUndefined(strTabNameList)) {
            this.fieldNameData.forEach(element => {
              element.Display_Name = element.UCIF_Display_Name;
              delete element.UCIF_Display_Name;
              element.Field_Name = element.UCIF_Field_Name;
              delete element.UCIF_Field_Name;

              if (strTabNameList.includes(element.Field_Name)) {
                this.selectedFieldNames.push(element.Field_Name);
              }
            });
            this.bkp_selectedFieldNames = this.selectedFieldNames;
          }
        }
      })
    }
  }

  // From Product Master Page
  FillMappedUserGroups() {
    var strTabName: any[];
    this.isMappedUserGroup = true;
    if (this.selectedTabName !== "") {
      strTabName = this.selectedTabName.split(",");
    }
    const MUGPromise = this._autodata.GetApplicationUserGroups().toPromise();
    MUGPromise.then(dt => {
      if (dt && !isNullOrUndefined(dt.GetApplicationUserGroupsResult)) {
        this.fieldNameData = dt.GetApplicationUserGroupsResult;
        this.fieldNameData.sort((a, b) => a.Data_Value.localeCompare(b.Data_Value));
        this.MappedUserGroupData = this.fieldNameData;

        if (strTabName) {
          strTabName.forEach(name => {
            if (name) {
              if (this.fieldNameData.filter(x => x.Data_Value === name).length > 0) {
                this.selectedFieldNames.push(name);
              }
            }
          });
          this.bkp_selectedFieldNames = this.selectedFieldNames;
        }
      }
    });
  }

  //From Product Master Page
  FillVisibiltyMap() {
    var strTabName: any[];
    this.isVisibilityMap = true;
    this.fieldNameData = ['BuySellCurrency', 'Counterparty Prem. Amt', 'CounterpartyPremium',
      'CurrencyPair', 'Customer Prem. Amt', 'CustomerPremium', 'DeltaHedge', 'Direction', 'ExerciseType',
      'FixingDate', 'FixingDays', 'LowerBarrier', 'MaturityDate', 'MaturityDays', 'Notional', 'NotionalCurrency',
      'OptionalCut', 'PremiumDate', 'PremiumMethod', 'ProductType', 'QuotedAt', 'SolveForMargin', 'SolveForPremium',
      'SolveForStrike', 'SpotRate', 'Spread', 'Spread Amount', 'StrikePoints', 'StrikeRate', 'Tenor', 'TimeNow',
      'TradeDate', 'UpperBarrier', 'ValidTill', 'ValueDays', 'Volatility', 'VolatilityOn']

    if (this.selectedTabName !== "") {
      for (let i = 0; i < this.selectedTabName.length; i++) {
        if (this.selectedTabName[i] === 'Y') {
          this.selectedFieldNames.push(this.fieldNameData[i]);
        }
      }
    }
    this.bkp_selectedFieldNames = this.selectedFieldNames;

  }

 //From Workflow 
 FillUserMap()
 {
 
    var strTabName: any[];
    this.isUserMappedWF = true;
    if (this.selectedTabName !== "") {
      strTabName = this.selectedTabName.split(",");
    }
    const MUGPromise = this._autodata.GetUserGroup("").toPromise();
    MUGPromise.then(dt => {
      if (dt && !isNullOrUndefined(dt.GetUserGroupResult)) {
        this.fieldNameData = dt.GetUserGroupResult;
        this.fieldNameData.sort((a, b) => a.U_Id.localeCompare(b.U_Id));
        this.MapperUserGrpWF = this.fieldNameData;

        if (strTabName) {
          strTabName.forEach(name => {
            if (name) {
              if (this.fieldNameData.filter(x => x.U_Id === name).length > 0) {
                this.selectedFieldNames.push(name);
              }
              
            }
          });
          this.bkp_selectedFieldNames = this.selectedFieldNames;
        }
      }
    });
 }
 FillDesignerUserMap(){
  var strTabName: any[];
  this.isUserMappedDesigner = true;
  this.fieldNameData = [];
  if (this.selectedTabName !== "") {
    strTabName = this.selectedTabName.split(",");
  }
  const MUGPromise = this._autodataWF.QueueUserGroupDetails("", this.queueId, false).toPromise();
    MUGPromise.then(dt => {
      if (dt && !isNullOrUndefined(dt.QueueUserGroupDetailsResult)) {
        this.fieldNameData = dt.QueueUserGroupDetailsResult;
        this.fieldNameData.sort((a, b) => a.U_Id.localeCompare(b.U_Id));
        this.MapperUserGrpWFDesigner = this.fieldNameData;
        if (strTabName) {
          strTabName.forEach(name => {
            if (name) {
              if (this.fieldNameData.filter(x => x.NAME === name).length > 0) {
                this.selectedFieldNames.push(name);
              }
            }
          });
          this.bkp_selectedFieldNames = this.selectedFieldNames;
        }
      }
    });
 }
 FillMetaDataUserMap() {
  var strTabName: any[];
  this.isUserMappedMetaData = true;
  this.fieldNameData = [];
  //debugger;
  if (this.selectedTabName !== "") {
    strTabName = this.selectedTabName.split(",");
  }
  const MUGPromise = this._autodataWF.ColumnUserGroupDetails("", this.metadataQid, false).toPromise();
    MUGPromise.then(dt => {
      if (dt && !isNullOrUndefined(dt.ColumnUserGroupDetailsResult)) {
        this.fieldNameData = dt.ColumnUserGroupDetailsResult;
        this.fieldNameData.sort((a, b) => a.U_Id.localeCompare(b.U_Id));
        this.MapperUserGrpMetaData = this.fieldNameData;
        if (strTabName) {
          strTabName.forEach(name => {
            if (name) {
              if (this.fieldNameData.filter(x => x.NAME === name).length > 0) {
                this.selectedFieldNames.push(name);
              }
            }
          });
          this.bkp_selectedFieldNames = this.selectedFieldNames;
          //console.log("this.bkp_selectedFieldNames", this.bkp_selectedFieldNames);
        }
      }
    });
 }
  close(): void {
    this.dialogRef.close();
  }

  apply(): void {
    if (this.isSelectedTab) {
      var tabNames = [];
      var tabIds = [];
      this.selectedFieldNames.forEach(field => {
        tabNames.push(this.fieldNameData.filter(x => x.Field_Name.toUpperCase() === field.toUpperCase())[0].Display_Name);
      });
      tabNames.sort();
      tabNames.forEach(tab => {
        tabIds.push(this.fieldNameData.filter(x => x.Display_Name.toUpperCase() === tab.toUpperCase())[0].Field_Name);
      });
      this.selectedFieldNames = [tabIds, tabNames];
    } else if (this.isMappedUserGroup) {
      var userName = [];
      this.selectedFieldNames.forEach(name => {
        userName.push(this.fieldNameData.filter(x => x.Data_Value === name)[0].Data_Value);
      });
      this.selectedFieldNames = [userName];
    } else if (this.isVisibilityMap) {
      var strvisibility: string = "";
      
      this.fieldNameData.forEach(vm => {
        if (this.selectedFieldNames.some((item) => item === vm)) {
          if (strvisibility.length != 0) {
            strvisibility = strvisibility.concat('Y');

          } else {
            strvisibility = "Y";
          }
        } else {
          if (strvisibility.length != 0) {
            strvisibility = strvisibility.concat('N');
          } else{
            strvisibility = "N";
          }
        }
      });

      this.selectedFieldNames = [strvisibility];
    }else if (this.isUserMappedWF) {
      var userName = [];
      this.selectedFieldNames.forEach(name => {
        userName.push(this.fieldNameData.filter(x => x.U_Id === name)[0].U_Id);
      });
      this.selectedFieldNames = [userName];
    } else if(this.isUserMappedDesigner) {
      var userName = [];
      this.selectedFieldNames.forEach(name => {
        userName.push(this.fieldNameData.filter(x => x.NAME === name)[0].NAME);
      });
      this.selectedFieldNames = [userName];
    } else if(this.isUserMappedMetaData) {
      var userName = [];
      this.selectedFieldNames.forEach(name => {
        userName.push(this.fieldNameData.filter(x => x.NAME === name)[0].NAME);
      });
      this.selectedFieldNames = [userName];
    }

    this.dialogRef.close(this.selectedFieldNames);
  }

  selectAllChanged(event): void {
    if (event.checked) {
      if (this.isSelectedTabCGM || this.isSelectedTab) {
        this.selectedFieldNames = this.fieldNameData.map(a => { return a.Field_Name });
      } else if (this.isWFL) {
        this.selectedFieldNames = this.fieldNameData;
      } else if (this.isMappedUserGroup) {
        this.selectedFieldNames = this.fieldNameData.map(a => { return a.Data_Value });
      } else if (this.isVisibilityMap) {
        this.selectedFieldNames = this.fieldNameData;
      } else if (this.isUserMappedWF){
        this.selectedFieldNames=this.fieldNameData.map(a => { return a.U_Id });
      }else if(this.isUserMappedDesigner) {
        this.selectedFieldNames=this.fieldNameData.map(a => { return a.NAME });
      } else if(this.isUserMappedMetaData) {
        this.selectedFieldNames=this.fieldNameData.map(a => { return a.NAME });
      }

    } else {
      this.selectedFieldNames = [];
    }
    this.bkp_selectedFieldNames = this.selectedFieldNames;
  }

  refreshSelections(): void {
    if (this.searchText === "") {
      this.selectedFieldNames = this.bkp_selectedFieldNames;
    }
  }

  fieldNameSelectionChanged(event: MatSelectionListChange): void {
    if (event) {
      if (event.option.selected) {
        this.bkp_selectedFieldNames.push(event.option.value);
      } else {
        var index = this.bkp_selectedFieldNames.indexOf(event.option.value);
        if (index !== -1) {
          this.bkp_selectedFieldNames.splice(index, 1);
        }
      }
    }
    this.selectedFieldNames = this.bkp_selectedFieldNames;

    if (this.isSelectedTabCGM || this.isSelectedTab) {
      if (JSON.stringify(this.selectedFieldNames) === JSON.stringify(this.fieldNameData.map(a => { return a.Field_Name }))) {
        this.allFieldsSelected = true;
      } else {
        this.allFieldsSelected = false;
      }
    } else if (this.isWFL || this.isVisibilityMap) {
      if (JSON.stringify(this.selectedFieldNames) === JSON.stringify(this.fieldNameData)) {
        this.allFieldsSelected = true;
      } else {
        this.allFieldsSelected = false;
      }
    } else if (this.isMappedUserGroup) {
      if (JSON.stringify(this.selectedFieldNames) === JSON.stringify(this.fieldNameData.map(a => { return a.Data_Value }))) {
        this.allFieldsSelected = true;
      } else {
        this.allFieldsSelected = false;
      }
    }
    else if (this.isUserMappedWF) {
      if (JSON.stringify(this.selectedFieldNames) === JSON.stringify(this.fieldNameData.map(a => { return a.U_Id }))) {
        this.allFieldsSelected = true;
      } else {
        this.allFieldsSelected = false;
      }
    }
    else if (this.isUserMappedDesigner) {
      if (JSON.stringify(this.selectedFieldNames) === JSON.stringify(this.fieldNameData.map(a => { return a.U_Id }))) {
        this.allFieldsSelected = true;
      } else {
        this.allFieldsSelected = false;
      }
    } else if (this.isUserMappedMetaData) {
      if (JSON.stringify(this.selectedFieldNames) === JSON.stringify(this.fieldNameData.map(a => { return a.U_Id }))) {
        this.allFieldsSelected = true;
      } else {
        this.allFieldsSelected = false;
      }
    }
  }
}
